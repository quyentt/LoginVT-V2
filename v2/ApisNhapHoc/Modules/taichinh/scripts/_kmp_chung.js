/* =========================================================================
   Khai mức phí thu nhập học — phần DÙNG CHUNG của màn (ums.kmp)
   Bản gốc: ApisNhapHoc/Modules/taichinh/scripts/khaimucphinhaphoc.js
   Tên tệp mang tiền tố _kmp_ vì module taichinh còn các màn khác (thu tiền,
   check-in) do người khác chuyển.
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên action / func của bản gốc, mọi lời gọi đều POST):
     SV_Core_NhapHoc_MH         PKG_CORE_NHAPHOC.*
     SV_CORE_NhapHoc_ThuTien_MH PKG_CORE_NhapHoc_ThuTien.*
     TC_KhoanThu/LayDanhSach    GET, kiểu cũ (danh sách khoản thu để chọn)
     KHCT_ThongTin_MH           pkg_kehoach_thongtin.LayDSDaoTao_CoSoDaoTao
                                (= edu.system.getList_CoSoDaoTao)
   Các lời gọi PKG_CORE_NHAPHOC gốc gửi thêm strVaiTroDangNhap_Id = '',
   strChucNangHeThong_Id, strHanhDong_Code = '' — giữ strHanhDong_Code rỗng;
   ba tham số hệ thống còn lại ums.api tự điền khi để trống (như makeRequest).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat;
    var K = ums.kmp = ums.kmp || {};

    var NH = 'SV_Core_NhapHoc_MH/', TT = 'SV_CORE_NhapHoc_ThuTien_MH/';
    /* Khoá → [controller, method mã hoá, func]. Đã giải ngược từng mã (XOR 'A') khớp tên thủ tục. */
    var A = {
        keHoach:       [NH, 'DSA4BRIeDwkeCiQJLiAiKR4PKSAxCS4iHgM4', 'PKG_CORE_NHAPHOC.LayDS_NH_KeHoach_NhapHoc_By'],
        nhomDS:        [NH, 'DSA4BRIeDykgMQkuIh4CIDQJKC8pHhUCHg8pLiwP', 'PKG_CORE_NHAPHOC.LayDS_NhapHoc_CauHinh_TC_Nhom'],
        nhomTT:        [NH, 'DSA4FRUeDykgMQkuIh4CIDQJKC8pHhUCHg8pLiwP', 'PKG_CORE_NHAPHOC.LayTT_NhapHoc_CauHinh_TC_Nhom'],
        nhomThem:      [NH, 'FSkkLB4PKSAxCS4iHgIgNAkoLykeFQIeDykuLAPP', 'PKG_CORE_NHAPHOC.Them_NhapHoc_CauHinh_TC_Nhom'],
        nhomSua:       [NH, 'EjQgHg8pIDEJLiIeAiA0CSgvKR4VAh4PKS4s', 'PKG_CORE_NHAPHOC.Sua_NhapHoc_CauHinh_TC_Nhom'],
        nhomXoa:       [NH, 'GS4gHg8pIDEJLiIeAiA0CSgvKR4VAh4PKS4s', 'PKG_CORE_NHAPHOC.Xoa_NhapHoc_CauHinh_TC_Nhom'],
        ktDS:          [NH, 'DSA4BRIeDykgMQkuIh4CIDQJKC8pHhUC', 'PKG_CORE_NHAPHOC.LayDS_NhapHoc_CauHinh_TC'],
        ktThem:        [NH, 'FSkkLB4PKSAxCS4iHgIgNAkoLykeFQIP', 'PKG_CORE_NHAPHOC.Them_NhapHoc_CauHinh_TC'],
        ktSua:         [NH, 'EjQgHg8pIDEJLiIeAiA0CSgvKR4VAgPP', 'PKG_CORE_NHAPHOC.Sua_NhapHoc_CauHinh_TC'],
        ktXoa:         [NH, 'GS4gHg8pIDEJLiIeAiA0CSgvKR4VAgPP', 'PKG_CORE_NHAPHOC.Xoa_NhapHoc_CauHinh_TC'],
        draDS:         [NH, 'DSA4BRIeDwkeAiA0CSgvKR4VAh4PKS4sHgUgNBMg', 'PKG_CORE_NHAPHOC.LayDS_NH_CauHinh_TC_Nhom_DauRa'],
        draThem:       [NH, 'FSkkLB4PCR4CIDQJKC8pHhUCHg8pLiweBSA0EyAP', 'PKG_CORE_NHAPHOC.Them_NH_CauHinh_TC_Nhom_DauRa'],
        draXoa:        [NH, 'GS4gHg8JHgIgNAkoLykeFQIeDykuLB4FIDQTIAPP', 'PKG_CORE_NHAPHOC.Xoa_NH_CauHinh_TC_Nhom_DauRa'],
        khDauRa:       [NH, 'DSA4BRIeDwkeCiQJLiAiKR4FIDQTIAPP', 'PKG_CORE_NHAPHOC.LayDS_NH_KeHoach_DauRa'],
        dvDS:          [NH, 'DSA4BRIeDwkeAiA0CSgvKR4VAh4PKS4sHgUV', 'PKG_CORE_NHAPHOC.LayDS_NH_CauHinh_TC_Nhom_DT'],
        dvThem:        [NH, 'FSkkLB4PCR4CIDQJKC8pHhUCHg8pLiweBRUP', 'PKG_CORE_NHAPHOC.Them_NH_CauHinh_TC_Nhom_DT'],
        dvXoa:         [NH, 'GS4gHg8JHgIgNAkoLykeFQIeDykuLB4FFQPP', 'PKG_CORE_NHAPHOC.Xoa_NH_CauHinh_TC_Nhom_DT'],
        nguoiHocTTTS:  [TT, 'DSA4BRIQDRIXHg8mNC4oCS4iHhUVFRIP', 'PKG_CORE_NhapHoc_ThuTien.LayDSQLSV_NguoiHoc_TTTS'],
        genPhaiNop:    [TT, 'BiQvHhUgKAIpKC8pHhEpICgPLjEeCC81ICok', 'PKG_CORE_NhapHoc_ThuTien.Gen_TaiChinh_PhaiNop_Intake'],
        mucPhiDaGan:   [TT, 'DSA4BRIMNCIRKSgFIAYgLw8pIDEJLiIP', 'PKG_CORE_NhapHoc_ThuTien.LayDSMucPhiDaGanNhapHoc'],
        phaiNopIntake: [TT, 'DSA4BRIeESkgKA8uMR4VKSQuCC81ICok', 'PKG_CORE_NhapHoc_ThuTien.LayDS_PhaiNop_TheoIntake'],
        thiSinhNH:     [TT, 'DSA4BRIVKSgSKC8pDykgMQkuIgPP', 'PKG_CORE_NhapHoc_ThuTien.LayDSThiSinhNhapHoc']
    };

    /** Tham số của một lời gọi — action/func theo khoá, tham số riêng truyền vào o */
    K.goi = function (k, o) {
        o = o || {};
        o.action = A[k][0] + A[k][1];
        o.func = A[k][2];
        if (A[k][0] === NH) {
            // Gốc gửi tường minh; để trống thì ums.api tự điền như makeRequest
            o.strNguoiThucHien_Id = '';
            o.strVaiTroDangNhap_Id = '';
            o.strChucNangHeThong_Id = '';
            o.strHanhDong_Code = '';
        }
        return o;
    };

    /* ---------- Đọc cột (bản gốc dò nhiều tên dự phòng) ------------------- */
    function e(v) { return v === undefined || v === null ? '' : v; }
    K.e = e;
    K.rows = function (r) { var d = r.data; return Array.isArray(d) ? d : (d && d.rs) || []; };

    /** pick(row, 'A', 'B') — cột đầu tiên có giá trị (bỏ qua null / rỗng) */
    K.pick = function (r) {
        for (var i = 1; i < arguments.length; i++) {
            var v = r ? r[arguments[i]] : undefined;
            if (v !== undefined && v !== null && v !== '') return v;
        }
        return '';
    };
    /** _pickCI của gốc: so tên cột bỏ qua hoa/thường, gạch dưới, gạch ngang, khoảng trắng */
    function chuan(k) { return String(k).toLowerCase().replace(/[_\-\s]/g, ''); }
    K.pickCI = function (r) {
        if (!r) return '';
        var m = {};
        Object.keys(r).forEach(function (k) { m[chuan(k)] = r[k]; });
        for (var i = 1; i < arguments.length; i++) {
            var v = m[chuan(arguments[i])];
            if (v !== undefined && v !== null && v !== '') return v;
        }
        return '';
    };
    /** "TEN (MA)" — gốc _mergeTenMa */
    K.tenMa = function (ten, ma) {
        ten = e(ten); ma = e(ma);
        if (ten && ma) return ten + ' (' + ma + ')';
        return ten || ma;
    };
    K.nhomId = function (r) { return K.pick(r, 'ID', 'NH_CAUHINH_TC_NHOM_ID'); };
    /** Nhãn "Tên (Mã)" của một nhóm — gốc _getNhomLabel */
    K.nhomLabel = function (r) {
        if (!r) return '';
        return K.tenMa(K.pick(r, 'TEN_NHOM', 'TEN'), K.pick(r, 'MA_NHOM', 'MA')) || K.nhomId(r);
    };
    function so(v) { return v === '' || v === null || v === undefined || isNaN(v) ? null : Number(v); }
    K.so = so;
    K.tien = function (v) { return so(v) === null ? ui.esc(e(v)) : ui.money(v); };
    K.cong = function (rows, get) {
        return (rows || []).reduce(function (a, r) { var n = so(get(r)); return a + (n === null ? 0 : n); }, 0);
    };

    /* Cột "tổng đã nộp": gốc dò một loạt tên, không khớp thì lấy cột đầu tiên có chữ
       danop / dathu / thutien trong tên (tự dò ở dòng đầu, _extraAlias_TongDaNop). */
    var TEN_DANOP = ['TongSoTienDaNop', 'TongTienDaNop', 'TongDaNop', 'SoTienDaNop', 'DaNop', 'TongThuTien', 'TongDaThu'];
    K.daNop = function (r) {
        var v = K.pickCI.apply(null, [r].concat(TEN_DANOP));
        if (v !== '' || !r) return v;
        var ks = Object.keys(r).filter(function (k) { var c = chuan(k); return c.indexOf('danop') >= 0 || c.indexOf('dathu') >= 0 || c.indexOf('thutien') >= 0; });
        for (var i = 0; i < ks.length; i++) if (r[ks[i]] !== null && r[ks[i]] !== '') return r[ks[i]];
        return '';
    };

    /* ---------- Danh mục tra tên (gốc preload_DMs + getList_CoSoDaoTao) ----
       API danh sách khoản thu chỉ trả MÃ đơn vị tính / kiểu tự động sinh; tên
       tra theo MA trong danh mục. Cơ sở đào tạo tra theo ID. */
    K.DM_DVT = 'TAICHINH.DVT';
    K.DM_KIEU = 'NHAPHOC_CAUHINH_TC.KIEUTUDONG.PHAINOP';
    K.COSO = {
        call: {
            action: 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eAi4SLgUgLhUgLgPP',
            func: 'pkg_kehoach_thongtin.LayDSDaoTao_CoSoDaoTao',
            strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000
        },
        id: 'ID', name: 'TEN'
    };
    var dmP = null;
    K.dm = function () {
        if (dmP) return dmP;
        function an(p) { return p.catch(function (err) { ums.api.handle(err, 'danh mục khai mức phí'); return []; }); }
        dmP = Promise.all([an(ums.api.dm(K.DM_DVT)), an(ums.api.dm(K.DM_KIEU)), an(ums.crud.loadSource(K.COSO))])
            .then(function (x) { return { dvt: x[0], kieu: x[1], coso: x[2] }; });
        return dmP;
    };
    /** Tra TEN theo MA (gốc lookupDM): không thấy thì trả chính mã */
    K.tenTheoMa = function (ds, ma) {
        if (!ma) return '';
        for (var i = 0; i < (ds || []).length; i++) if (ds[i].MA === ma) return ds[i].TEN || ma;
        return ma;
    };

    /* ---------- Bảng phân trang ở MÁY KHÁCH -------------------------------
       Gốc tải hết một lần (pageSize 100000) rồi lọc / chia trang tại chỗ ở ba
       hộp: chọn ngành đầu ra, mức phí đã gán, danh sách nhập học & thu tiền.
         var L = K.luoi(host, { columns, size, sizes, empty, id(r), chon: true, onChon(n) });
         L.dat(rows)   vẽ lại từ trang 1      L.dang() / L.loi(msg)
         L.chon()      mảng id đang đánh dấu (giữ qua các trang)
       chon: cột ô đánh dấu ở CUỐI (như gốc); ô tiêu đề = chọn TOÀN BỘ danh sách
       (mọi trang), đúng chkSelectAll của gốc. Cột có `sum` cộng trên toàn bộ
       danh sách đang lọc (sumAll), không chỉ trang đang xem. */
    K.luoi = function (host, o) {
        var tatCa = [], trang = 1, co = o.size || 20, chon = {};
        function idOf(r) { return String(o.id ? o.id(r) : e(r.ID)); }

        function ve() {
            var tong = tatCa.length, soTrang = Math.max(1, Math.ceil(tong / co));
            if (trang > soTrang) trang = soTrang;
            var tu = (trang - 1) * co;
            var cols = o.columns.slice();
            if (o.chon) {
                cols.push({
                    head: '<input type="checkbox" data-kmp-all title="Chọn tất cả (mọi trang)">', cls: 'is-center', width: '48px',
                    render: function (r) {
                        var id = idOf(r);
                        return '<input type="checkbox" data-kmp-ck="' + ui.esc(id) + '"' + (chon[id] ? ' checked' : '') + '>';
                    }
                });
            }
            ui.table({
                el: host, rows: tatCa.slice(tu, tu + co), columns: cols, sumAll: tatCa,
                empty: o.empty || 'Không có dữ liệu',
                page: {
                    index: trang, size: co, total: tong, sizes: o.sizes,
                    onChange: function (p) { if (p < 1 || p > soTrang) return; trang = p; ve(); },
                    onSize: function (s) { co = s; trang = 1; ve(); }
                },
                rowCls: o.chon ? function (r) { return chon[idOf(r)] ? 'is-selected' : ''; } : null
            });
            dongBoTieuDe();
        }
        function dongBoTieuDe() {
            var all = host.querySelector('[data-kmp-all]');
            var n = Object.keys(chon).length;
            if (all) { all.checked = tatCa.length > 0 && n === tatCa.length; all.indeterminate = n > 0 && n < tatCa.length; }
            if (o.onChon) o.onChon(n);
        }

        if (o.chon) {
            host.addEventListener('change', function (ev) {
                var t = ev.target;
                if (t.hasAttribute('data-kmp-all')) {
                    chon = {};
                    if (t.checked) tatCa.forEach(function (r) { var id = idOf(r); if (id) chon[id] = true; });
                    ve();
                } else if (t.hasAttribute('data-kmp-ck')) {
                    var id = t.getAttribute('data-kmp-ck');
                    if (t.checked) chon[id] = true; else delete chon[id];
                    var tr = t.closest('tr');
                    if (tr) tr.classList.toggle('is-selected', t.checked);
                    // ui.dongBoChon (tầng chung) chạy sau và chỉ xét trang đang xem — đặt lại theo toàn bộ danh sách
                    setTimeout(dongBoTieuDe, 0);
                }
            });
        }

        return {
            dat: function (rows, giuChon) { tatCa = rows || []; trang = 1; if (!giuChon) chon = {}; ve(); },
            chon: function () { return Object.keys(chon); },
            tatCa: function () { return tatCa; },
            dang: function () { host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin'); },
            loi: function (msg) { host.innerHTML = ui.fail(msg); }
        };
    };

    /** Số tiền gõ tay (cho phép . , khoảng trắng) → số nguyên hoặc null — gốc _parseTien_MucPhi */
    K.docTien = function (s) {
        var d = String(e(s)).replace(/[^0-9]/g, '');
        return d ? Number(d) : null;
    };

    /** Ctrl+G (Cmd+G) trong hộp = Xuất Excel, như gốc (gốc gắn lên document; ở đây gắn lên chính hộp) */
    K.phimXuat = function (dlgEl, fn) {
        dlgEl.addEventListener('keydown', function (ev) {
            if (!(ev.ctrlKey || ev.metaKey) || String(ev.key).toLowerCase() !== 'g') return;
            if (/^(input|textarea|select)$/i.test(ev.target.tagName || '')) return;
            ev.preventDefault();
            fn();
        });
    };

    /** Ô tiền "từ / đến": dấu phẩy ngăn nghìn khi rời ô */
    K.oTien = function (el) {
        el.addEventListener('blur', function () {
            var n = K.docTien(el.value);
            el.value = n === null ? '' : pat.money(n);
        });
    };
})();
