/* =========================================================================
   Tình trạng quân số — bảng quân số theo CẤU TRÚC (khoa → khoá → lớp…) × tình trạng sinh viên
   Bản gốc: ApisSinhVien/Modules/tinhtrangquanso/html/tinhtrangquanso.html + script/tinhtrangquanso.js
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc — MỘT cột: thanh lọc (+ "Chọn trạng thái sinh viên") ở trên, khung
   "Bảng theo dõi tình trạng quân số" ẩn tới khi bấm Tìm kiếm (#zone_quanso, nút Đóng ẩn lại),
   bấm một ô số → hộp "Chi tiết quân số lớp" (+ In danh sách).

   Thanh lọc: ums.pat.boLocNguoiHoc (tầng chung — cùng họ
   ô lọc _IHD chọn nhiều của gốc: Hệ → Khoá → CT → Lớp gọi edu.system.getList_* KHÔNG lọc quyền, Năm nhập
   học KHCT_NamNhapHoc/LayDanhSach GET, Khoa quản lý, trạng thái QLSV.TRANGTHAI đánh dấu sẵn hết).
   Hàng hai thêm Từ ngày / Đến ngày, hai nút tìm và vùng Xuất báo cáo như html gốc.

   Lời gọi (kiểu cũ, chép nguyên, đều GET):
     SV_CauTrucQuanSo/LayDanhSach        strTuKhoa '' (gốc đọc txtSearch_DT — ô không có) · strKhoaQuanLy_Id ·
                                         strHeDaoTao_Id · strKhoaDaoTao_Id · strChuongTrinh_Id · strLopQuanLy_Id ·
                                         strNamNhapHoc · strTrangThaiNguoiHoc_Id · strNguoiThucHien_Id
                                         → THANHPHAN_ID · THANHPHAN_CHA_ID · THANHPHAN_TEN (cây; nút LÁ = lớp)
     SV_CauTrucQuanSo/LayDSQuanSoTheoTinhTrang     strDaoTao_LopQuanLy_Id · strTinhDenNgay · strNgayBatDau → ID · SOLUONG
     SV_CauTrucQuanSo/LayDSQuanSoTheoTieuChiMoRong (cùng tham số) — cột QLSV.QUANSO.MORONG
     SV_CauTrucQuanSo/LayDSQuanSoTheoLop  strDaoTao_LopQuanLy_Id · strTinhTrangSinhVien_Id · strNgayBatDau ·
                                         strTinhDenNgay · strNguoiThucHien_Id (hộp chi tiết)
     "Tìm kiếm theo đăng ký-chuyên cần":
     SV_QuanSo/LayDSKyTheoCauTruc        strTuKhoa '' · strChucNang_Id · strNamNhapHoc · strKhoaQuanLy_Id · strHeDaoTao_Id ·
                                         strKhoaDaoTao_Id · strChuongTrinh_Id · strLopQuanLy_Id · strTrangThaiNguoiHoc_Id ·
                                         strNguoiThucHien_Id → ID · THOIGIAN (mỗi kỳ một cột)
     SV_QuanSo/LayDSQuanSoTheoKy         strChucNang_Id · strDaoTao_LopQuanLy_Id · strDaoTao_ThoiGianDaoTao_Id → ID · SOLUONG
     Danh mục: QLSV.TRANGTHAI (ô đánh dấu + tên cột), QLSV.QUANSO.MORONG (cột "tiêu chí mở rộng").
     Báo cáo: ums.report.mount (getList_MauImport "zonebtnBaoCao_TTQS" — html gốc không có vùng _Import →
       import: false). Cặp khoá chép nguyên callback gốc. Không có mẫu báo cáo nào thì hiện mục cứng
       "1. Bảng quân số" (BangQuanSo) của html gốc — đúng như gốc (mẫu nạp về thì ghi đè mục cứng).

   Giữ như gốc: mỗi lớp (nút lá) HAI lời gọi (tình trạng + mở rộng) / mỗi lớp × kỳ MỘT lời gọi —
     N×M lời gọi, chạy hàng đợi 6 luồng (gốc bắn cùng lúc). Tổng dòng / dòng "Tổng số" cộng trên các ô.
     Chế độ theo kỳ: không có cột "Tổng số", ô không bấm được (như gốc).
   Khác gốc (chỉ phần vẽ):
     · Cây cấu trúc: ô lá luôn phủ hết các cột cây còn lại (gốc để colspan 1 cho nút GỐC không con → lệch cột).
     · Dòng / cột Tổng tính lại mỗi khi có số (gốc chỉ tính một lần khi mọi lời gọi xong).
     · Tìm lại giữa chừng thì bỏ các lời gọi của lượt cũ.
     · Tiêu đề hộp chi tiết bỏ tiền tố "Thêm mới -" (chép nhầm từ khuôn biểu mẫu).
   Cố ý bỏ (mã chết): getList_MauImport riêng (CM_Import_PhanQuyen, đổ vào #zonebtnBaoCao_LHD không có),
     report() / reportAllTable() (không ai gọi, reportAllTable mở URL localhost:6368), #zonetabkhoanthu /
     activeTabFun, #txtSearch_DT, getList_ThoiGianDaoTao (#dropSearch_HocKy_IHD không có), resetCombobox.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var root = document.getElementById('sv-tinhtrangquanso');
    if (!root) return;

    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function cn() { return (ums.state && ums.state.chucNangId) || ''; }
    function so(v) { var n = parseInt(v, 10); return isNaN(n) ? 0 : n; }

    root.innerHTML = pat.page('Tình trạng quân số', '') +
        '<div data-z="loc"></div>' +
        '<div data-z="kq" hidden>' +
            pat.panel({ title: 'Bảng theo dõi tình trạng quân số', icon: 'fa-table-list', count: 'tiendo', flush: true, zone: 'bang',
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) }) +
        '</div>';
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

    /* ---------- Thanh lọc ---------------------------------------------------- */
    var L = ums.pat.boLocNguoiHoc(z('loc'), { hang: [['he', 'khoa', 'ct', 'lop'], ['nam', 'kql']] });
    function fit(h) { return '<div class="ums-field ums-field--fit">' + h + '</div>'; }
    function ngay(k, ph) {
        return '<div class="ums-field"><div class="ums-inputwrap"><input class="ums-input" data-f="' + k + '" data-date placeholder="' + esc(ph) +
            '" autocomplete="off"><i class="fa-light fa-calendar"></i></div></div>';
    }
    var hang2 = z('loc').querySelectorAll('.ums-filter')[1];
    hang2.insertAdjacentHTML('beforeend',
        ngay('tu', 'Từ ngày dd/mm/yyyy') + ngay('den', 'Đến ngày dd/mm/yyyy') +
        fit(ui.btn('search', { attr: { 'data-a': 'tim' } })) +
        fit(ui.btn('search', { text: 'Tìm kiếm theo đăng ký-chuyên cần', mod: 'out-primary', attr: { 'data-a': 'timcc' } })) +
        '<div class="ums-field ums-field--fit" data-z="bc"></div>' +
        '<div class="ums-field ums-field--fit" data-z="bcmau" hidden>' +
            '<div class="ums-drop"><button type="button" class="ums-btn ums-btn--out-info ums-drop__toggle" aria-haspopup="menu" aria-expanded="false">' +
            '<i class="fa-light fa-file-chart-column"></i><span>Xuất báo cáo</span><i class="fa-light fa-angle-down ums-drop__caret"></i></button>' +
            '<div class="ums-drop__menu" role="menu" hidden><button type="button" class="ums-drop__item" role="menuitem" data-a="bqs">' +
            '<span class="ums-drop__no">1.</span><span class="ums-drop__text">Bảng quân số</span></button></div></div>' +
        '</div>');
    ui.enhance(hang2);
    function gt(k) { var el = L.f(k); return el ? (el.value || '').trim() : ''; }

    /** Tham số lọc chung của SV_CauTrucQuanSo/LayDanhSach (tên chép nguyên) */
    function thamSoLoc() {
        return {
            strTuKhoa: '',
            strKhoaQuanLy_Id: L.v('kql'),
            strHeDaoTao_Id: L.v('he'),
            strKhoaDaoTao_Id: L.v('khoa'),
            strChuongTrinh_Id: L.v('ct'),
            strLopQuanLy_Id: L.v('lop'),
            strNamNhapHoc: L.v('nam'),
            strTrangThaiNguoiHoc_Id: L.tt.ids().join(','),
            strNguoiThucHien_Id: uid()
        };
    }

    /* ---------- Báo cáo ------------------------------------------------------- */
    function thuThap(add) {
        var tts = L.tt.picked();
        add('strTuKhoa', '');
        add('strKhoaQuanLy_Id', L.v('kql'));
        add('strHeDaoTao_Id', L.v('he'));
        add('strKhoaDaoTao_Id', L.v('khoa'));
        add('strChuongTrinh_Id', L.v('ct'));
        add('strLopQuanLy_Id', L.v('lop'));
        add('strNamNhapHoc', L.v('nam'));
        add('strTrangThaiNguoiHoc_Id', tts.map(function (r) { return r.ID; }).join(','));
        add('strTrangThaiNguoiHoc_Ten', tts.map(function (r) { return e(r.TEN); }).join(','));
        add('strTinhDenNgay', gt('den'));
        add('strNgayBatDau', gt('tu'));
    }
    function laBaoCao(r) { return !/^(IMPORTALLINPUT|IMPORTWITHPROC)/i.test(String(e(r.MAUIMPORT_MA)).substring(0, 14)); }
    ums.report.mount(z('bc'), {
        import: false,
        collect: thuThap,
        onLoad: function (rows) { z('bcmau').hidden = arr(rows).some(laBaoCao); }
    });

    /* ---------- Danh mục cột mở rộng --------------------------------------------- */
    var moRong = ums.api.dm('QLSV.QUANSO.MORONG').catch(function (err) { ums.api.handle(err, 'tiêu chí mở rộng quân số'); return []; });

    /* ---------- Vẽ bảng cây × cột ----------------------------------------------------
       cols: [{ id, ten, bam }] — bam: ô bấm được (mở chi tiết). o.tong: thêm cột "Tổng số" + ô tổng chung. */
    var luot = 0, st = null;

    function veBang(ds, cols, o) {
        var con = {}, goc = [], seen = {};
        ds.forEach(function (x) {
            var p = x.THANHPHAN_CHA_ID;
            if (p === null || p === undefined) goc.push(x);   // gốc: THANHPHAN_CHA_ID == null
            else (con[p] = con[p] || []).push(x);
        });
        var dong = [], maxD = 0;
        function duyet(x, d) {
            var k = x.THANHPHAN_ID;
            if (seen[k]) return [];
            seen[k] = 1;
            var ks = con[k] || [];
            if (!ks.length) {
                if (d > maxD) maxD = d;
                var r = { la: x, d: d, o: [] };
                dong.push(r);
                return [r];
            }
            var list = [];
            ks.forEach(function (c) { list = list.concat(duyet(c, d + 1)); });
            if (list.length) list[0].o.unshift('<td class="ums-gtable__g" rowspan="' + list.length + '">' + esc(e(x.THANHPHAN_TEN)) + '</td>');
            return list;
        }
        goc.forEach(function (g) { duyet(g, 0); });

        st = { dong: dong, cols: cols, tong: !!o.tong, gt: {} };
        var cay = maxD + 1;
        var h = '<div class="ums-tablewrap"><table class="ums-table ums-table--lined ums-gtable ttqs-bang"><thead><tr>' +
            '<th class="is-center" colspan="' + cay + '">' + esc(o.tieuDe) + '</th>' +
            cols.map(function (c) { return '<th class="is-center">' + esc(e(c.ten)) + '</th>'; }).join('') +
            (o.tong ? '<th class="is-center"><b>Tổng số</b></th>' : '') + '</tr></thead><tbody>';
        if (!dong.length) {
            h += '<tr><td colspan="' + (cay + cols.length + (o.tong ? 1 : 0)) + '" style="padding:0">' + ui.empty('Không có cấu trúc quân số') + '</td></tr>';
        }
        dong.forEach(function (r, i) {
            var lop = e(r.la.THANHPHAN_ID);
            h += '<tr>' + r.o.join('') +
                '<td' + (cay - r.d > 1 ? ' colspan="' + (cay - r.d) + '"' : '') + '>' + esc(e(r.la.THANHPHAN_TEN)) + '</td>' +
                cols.map(function (c, j) { return '<td class="is-center" data-o="' + i + ':' + j + '"></td>'; }).join('') +
                (o.tong ? '<td class="is-center ums-u-bold" data-dt="' + i + '"></td>' : '') + '</tr>';
            st.gt[lop] = st.gt[lop] || {};
        });
        h += '</tbody>';
        if (dong.length) {
            h += '<tfoot><tr class="ums-table__sum"><td class="is-center" colspan="' + cay + '"><b>Tổng số</b></td>' +
                cols.map(function (c, j) { return '<td class="is-center" data-ct="' + j + '"></td>'; }).join('') +
                (o.tong ? '<td class="is-center" data-ctt></td>' : '') + '</tr></tfoot>';
        }
        h += '</table></div>';
        z('bang').innerHTML = h;
    }

    /** Ghi số trả về của một lớp (gốc: $("#lblQuanSo" + lớp + "_" + r.ID).html(SOLUONG)) rồi cộng lại các tổng */
    function ghi(i, rows) {
        if (!st) return;
        var r = st.dong[i];
        if (!r) return;
        var lop = e(r.la.THANHPHAN_ID);
        arr(rows).forEach(function (x) {
            var j = -1;
            st.cols.forEach(function (c, k) { if (String(c.id) === String(x.ID)) j = k; });
            if (j < 0) return;
            st.gt[lop][x.ID] = x.SOLUONG;
            var td = z('bang').querySelector('[data-o="' + i + ':' + j + '"]');
            if (!td) return;
            var v = e(x.SOLUONG);
            td.innerHTML = st.cols[j].bam
                ? '<button type="button" class="ums-btn ums-btn--quiet ums-btn--sm" data-a="ct" data-i="' + i + '" data-j="' + j +
                  '" title="Xem chi tiết quân số trong lớp">' + esc(v) + '</button>'
                : esc(v);
        });
        tong();
    }
    function tong() {
        var tat = 0;
        st.cols.forEach(function (c, j) {
            var t = 0;
            st.dong.forEach(function (r) { t += so((st.gt[e(r.la.THANHPHAN_ID)] || {})[c.id]); });
            tat += t;
            var td = z('bang').querySelector('[data-ct="' + j + '"]');
            if (td) td.innerHTML = '<b>' + t + '</b>';
        });
        if (!st.tong) return;
        st.dong.forEach(function (r, i) {
            var g = st.gt[e(r.la.THANHPHAN_ID)] || {}, t = 0;
            st.cols.forEach(function (c) { t += so(g[c.id]); });
            var td = z('bang').querySelector('[data-dt="' + i + '"]');
            if (td) td.textContent = t;
        });
        var tt = z('bang').querySelector('[data-ctt]');
        if (tt) tt.innerHTML = '<b>' + tat + '</b>';
    }

    /** Chạy các lời gọi của một lượt, 6 luồng; tìm lại thì lượt cũ tự dừng */
    function chay(tasks, l) {
        var i = 0, xong = 0, loi = 0, n = tasks.length;
        var dem = z('tiendo');
        function bao() { if (l === luot && dem) dem.textContent = xong < n ? '(Đang nạp số liệu ' + xong + '/' + n + ')' : ''; }
        function w() {
            if (l !== luot || i >= n) return Promise.resolve();
            var t = tasks[i++];
            return t().catch(function (err) {
                if (l !== luot) return;
                if (err && err.expired) { i = n; ums.api.handle(err); return; }
                if (!loi++) ums.api.handle(err, 'số liệu quân số');
            }).then(function () { xong++; bao(); return w(); });
        }
        bao();
        var ps = [];
        for (var k = 0; k < 6; k++) ps.push(w());
        return Promise.all(ps);
    }

    function ngayTieuDe() {
        var s = '', tu = gt('tu'), den = gt('den');
        if (tu) s = 'từ ngày ' + tu + ' ';
        if (den) s += 'tính đến ngày ' + den;
        return s || 'hiện tại';
    }
    function mo() { z('kq').hidden = false; z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin'); }
    function loiBang(err, noi) { z('bang').innerHTML = ui.fail(err && err.message); ums.api.handle(err, noi); }

    /* ---------- Tìm kiếm (theo tình trạng) ---------------------------------------- */
    function tim() {
        var l = ++luot;
        mo();
        var tts = L.tt.picked(), tieuDe = 'Thông tin quân số ' + ngayTieuDe();
        var tu = gt('tu'), den = gt('den');
        Promise.all([moRong, ums.api.call(Object.assign({ action: 'SV_CauTrucQuanSo/LayDanhSach', method: 'GET' }, thamSoLoc()))])
            .then(function (x) {
                if (l !== luot) return;
                var cols = tts.map(function (r) { return { id: r.ID, ten: r.TEN, bam: true }; })
                    .concat(arr(x[0]).map(function (r) { return { id: r.ID, ten: r.TEN, bam: true }; }));
                veBang(arr(x[1].data), cols, { tieuDe: tieuDe, tong: true });
                var tasks = [];
                st.dong.forEach(function (r, i) {
                    var lop = r.la.THANHPHAN_ID;
                    ['LayDSQuanSoTheoTinhTrang', 'LayDSQuanSoTheoTieuChiMoRong'].forEach(function (a) {
                        tasks.push(function () {
                            return ums.api.call({ action: 'SV_CauTrucQuanSo/' + a, method: 'GET', silent: true,
                                strDaoTao_LopQuanLy_Id: lop, strTinhDenNgay: den, strNgayBatDau: tu })
                                .then(function (res) { if (l === luot) ghi(i, res.data); });
                        });
                    });
                });
                return chay(tasks, l);
            }).catch(function (err) { if (l === luot) loiBang(err, 'cấu trúc quân số'); });
    }

    /* ---------- Tìm kiếm theo đăng ký - chuyên cần (theo kỳ) --------------------------- */
    function timTheoKy() {
        var l = ++luot;
        mo();
        var p = thamSoLoc();
        ums.api.call({
            action: 'SV_QuanSo/LayDSKyTheoCauTruc', method: 'GET',
            strTuKhoa: '', strChucNang_Id: cn(), strNamNhapHoc: p.strNamNhapHoc, strKhoaQuanLy_Id: p.strKhoaQuanLy_Id,
            strHeDaoTao_Id: p.strHeDaoTao_Id, strKhoaDaoTao_Id: p.strKhoaDaoTao_Id, strChuongTrinh_Id: p.strChuongTrinh_Id,
            strLopQuanLy_Id: p.strLopQuanLy_Id, strTrangThaiNguoiHoc_Id: p.strTrangThaiNguoiHoc_Id, strNguoiThucHien_Id: uid()
        }).then(function (rk) {
            if (l !== luot) return;
            var ky = arr(rk.data);
            return ums.api.call(Object.assign({ action: 'SV_CauTrucQuanSo/LayDanhSach', method: 'GET' }, p)).then(function (r) {
                if (l !== luot) return;
                veBang(arr(r.data), ky.map(function (k) { return { id: k.ID, ten: k.THOIGIAN, bam: false }; }),
                    { tieuDe: 'Thông tin quân số hiện tại', tong: false });
                var tasks = [];
                st.dong.forEach(function (d, i) {
                    ky.forEach(function (k) {
                        tasks.push(function () {
                            return ums.api.call({ action: 'SV_QuanSo/LayDSQuanSoTheoKy', method: 'GET', silent: true,
                                strChucNang_Id: cn(), strDaoTao_LopQuanLy_Id: d.la.THANHPHAN_ID, strDaoTao_ThoiGianDaoTao_Id: k.ID })
                                .then(function (res) { if (l === luot) ghi(i, res.data); });
                        });
                    });
                });
                return chay(tasks, l);
            });
        }).catch(function (err) { if (l === luot) loiBang(err, 'quân số theo kỳ'); });
    }

    /* ---------- Hộp chi tiết quân số lớp --------------------------------------------- */
    function chiTiet(i, j) {
        var r = st && st.dong[Number(i)], c = st && st.cols[Number(j)];
        if (!r || !c) return;
        var dlg = ui.dialog({
            title: 'Chi tiết quân số lớp — ' + e(r.la.THANHPHAN_TEN) + ' · ' + e(c.ten), icon: 'fa-users', size: 'xl',
            body: '<div data-x="t">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>',
            buttons: [{ text: 'In danh sách', kind: 'print', keepOpen: true, onClick: function () {
                ui.print(dlg.body.querySelector('[data-x="t"]'), { title: 'Chi tiết quân số lớp' });
                return false;
            } }]
        });
        var host = dlg.body.querySelector('[data-x="t"]');
        ums.api.call({
            action: 'SV_CauTrucQuanSo/LayDSQuanSoTheoLop', method: 'GET',
            strDaoTao_LopQuanLy_Id: r.la.THANHPHAN_ID, strTinhTrangSinhVien_Id: c.id,
            strNgayBatDau: gt('tu'), strTinhDenNgay: gt('den'), strNguoiThucHien_Id: uid()
        }).then(function (res) {
            ui.table({
                el: host, rows: arr(res.data), empty: 'Không có sinh viên',
                columns: [
                    { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-center is-nowrap' },
                    { title: 'Họ tên', render: function (x) { return esc(e(x.QLSV_NGUOIHOC_HODEM) + ' ' + e(x.QLSV_NGUOIHOC_TEN)); } },
                    { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' },
                    { title: 'Tình trạng', prop: 'QLSV_TRANGTHAINGUOIHOC_TEN', cls: 'is-center' },
                    { title: 'Lớp học', prop: 'DAOTAO_LOPQUANLY_TEN', cls: 'is-center' },
                    { title: 'Chương trình học', prop: 'DAOTAO_CHUONGTRINH_TEN', cls: 'is-center' },
                    { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN', cls: 'is-center' },
                    { title: 'Khoa quản lý', prop: 'KHOAQUANLY_TEN', cls: 'is-center' },
                    { title: 'Hệ đào tạo', prop: 'DAOTAO_HEDAOTAO_TEN', cls: 'is-center' },
                    { title: 'Hộ khẩu thường trú', prop: 'HOKHAUTHUONGTRU' },
                    { title: 'Địa chỉ báo tin', prop: 'TTLL_KHICANBAOTINCHOAI_ODAU' },
                    { title: 'Số quyết định', prop: 'QLSV_QUYETDINH_SOQD', cls: 'is-nowrap' },
                    { title: 'Ngày quyết định', prop: 'QLSV_QUYETDINH_NGAYQD', cls: 'is-center is-nowrap' }
                ]
            });
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'chi tiết quân số lớp'); });
    }

    /* ---------- Sự kiện ------------------------------------------------------------- */
    root.addEventListener('click', function (ev) {
        var tog = ev.target.closest('[data-z="bcmau"] .ums-drop__toggle');
        if (tog) {
            var d = tog.closest('.ums-drop'), m = d.querySelector('.ums-drop__menu'), on = !d.classList.contains('is-open');
            d.classList.toggle('is-open', on); m.hidden = !on; tog.setAttribute('aria-expanded', on ? 'true' : 'false');
            return;
        }
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b) || b.disabled) return;
        switch (b.getAttribute('data-a')) {
            case 'tim': tim(); break;
            case 'timcc': timTheoKy(); break;
            case 'dong': luot++; z('kq').hidden = true; break;
            case 'ct': chiTiet(b.getAttribute('data-i'), b.getAttribute('data-j')); break;
            case 'bqs':
                var dd = b.closest('.ums-drop');
                dd.classList.remove('is-open'); dd.querySelector('.ums-drop__menu').hidden = true;
                ums.report.run('BangQuanSo', { collect: thuThap });
                break;
        }
    });
})();
