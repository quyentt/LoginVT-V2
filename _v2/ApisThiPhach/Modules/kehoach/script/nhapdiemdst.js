/* =========================================================================
   nhapdiemdst — Nhập điểm theo danh sách thi (Thi phách): danh sách thi → khung "Thông tin danh sách thi" (nhập điểm
   từng người học), xác nhận theo danh sách / từng bản ghi, khung "Thống kê kết quả điểm thi".
   Bản gốc: ApisThiPhach/Modules/kehoach/html/nhapdiemdst.html + script/nhapdiemdst.js (nạp dưới tên NhapDiemdst.js).
   Khung chung: _tp_nd.js (ums.tpNd) — ghi chú lời gọi chung (bộ lọc, xác nhận, ngày nhận bài, cán bộ chấm thi) ở đó.
   Bản anh em: ApisCongCanBo/Modules/nhapdiem/script/_dst.js — gốc lệch ~960 dòng (danh sách gọi thủ tục mã hoá khác, thêm
   Khoa quản lý / trạng thái nhập điểm / thống kê, khung thay chỗ thay vì hộp thoại, không có vi phạm / công bố / hệ 10)
   nên KHÔNG dùng lại được bằng cờ; chỉ dùng lại các mảnh ums.nd.
   ---------------------------------------------------------------------------
   Lời gọi riêng của màn (chép nguyên):
       Khoa quản lý: ums.ref.coCauToChuc({ strCCTC_Loai_Id: '', strCCTC_Cha_Id: '', iTrangThai: 1 }) (edu.system.getList_CoCauToChuc)
       Môn thi: TP_Chung/LayHocPhan gửi thêm strDaoTao_CoCauToChuc_Id = Khoa quản lý
       Danh sách: POST XLHV_TP_Chung_MH/DSA4BRIVKSgVKSQuBS41FSko · pkg_thi_phach_chung.LayDSThiTheoDotThi
         (strTuKhoa, strChucNang_Id, dLocKhongHoanThanhNhapDiem '0' — cố định, strThi_DotThi_Id, strDaoTao_HocPhan_Id,
          strTuNgay '', strDenNgay '' — ô txtAAAA không tồn tại, strHinhThucThi_Id, strDiem_ThanhPhanDiem_Id, strDaoTao_CoCauToChuc_Id)
         "Trạng thái nhập điểm" lọc TẠI CHỖ theo XACNHANHOANTHANHDIEMTHI (gốc ghi rõ: lọc phía máy chủ trả sai);
         phân trang máy khách (gốc cắt theo cỡ trang mặc định).
       Người học: GET TP_Chung/LayDSNguoiHocTheoDST (strDanhSachThi_Id)
       Lưu: POST TP_XuLy/CapNhat_DiemPhachTheoDST mỗi dòng đã sửa (strChucNang_Id, strUngDung_Id = vai trò đăng nhập,
         strThi_DanhSachSinhVien_Id = ID dòng, strDiem)
       Xác nhận: các danh sách đánh dấu XACNHAN_HOANTHANH_DIEMTHI · từng bản ghi XACNHAN_HOANTHANH_DIEMTHI_NGUOIHOC
         (id = id danh sách thi + QLSV_NGUOIHOC_ID, ghép như gốc)
       Thống kê: POST XLHV_TP_ThongKe_MH/FSkuLyYKJAokNRA0IAUoJCwVKSgVKSQu · PKG_THI_PHACH_THONGKE.ThongKeKetQuaDiemThiTheo
         (strHanhDong_Code '', strDaoTao_ThoiGianDaoTao_Id, strThi_DotThi_Id, strDaoTao_HocPhan_Id, strDaoTao_KhoaQuanLyHP_Id;
          strVaiTroDangNhap_Id / strChucNangHeThong_Id tầng chung tự điền) — cột bảng = mọi khoá của dòng đầu (gạch dưới → dấu cách);
          ô lọc Khoa / Chuyên ngành dò cột KHOA_QLSV, KHOA_QLHP, KHOA, TEN_KHOA, MA_KHOA / CHUYEN_NGANH, CHUYENNGANH,
          CHUYEN_NGANH_TEN, TEN_CHUYENNGANH (không thấy thì khoá ô); cỡ trang 10/20/50/100/200/500, mặc định 20.
       Báo cáo (có cả Import): strThi_DotThi_Id, strDaoTao_HocPhan_Id, strDanhSachThi_Id (danh sách mở gần nhất) + mỗi dòng đánh dấu.
   Không chép (lỗi rõ của bản gốc):
     · "Xác nhận từng bản ghi": cột Tình trạng tra bằng ô #dropSearch_DSThi KHÔNG có trong html (id thiếu phần danh sách thi)
       trong khi lưu và lịch sử dùng id danh sách thi + người học → tình trạng không bao giờ hiện; nay tra đúng id.
       Không chọn dòng nào mà bấm nút: gốc im lặng → báo "Vui lòng chọn đối tượng".
     · Xuất Excel thống kê: dùng ums.ui.xuatXls (cùng kiểu bảng HTML đuôi .xls như gốc).
   Giữ như gốc: dòng CAMTHI_DUYETDKTHI / CAMTHI_VIPHAMQUYCHE = 1 để trống ô điểm; đổi ô lọc KHÔNG tự nạp danh sách (bấm Tìm kiếm);
     danh sách không gửi Thời gian; đóng khung (chi tiết / thống kê) thì nạp lại danh sách.
   Cha → con: Thời gian → Loại điểm → Hình thức thi → Đợt thi → Môn thi (khoá). Khoa quản lý → Môn thi: Môn thi có HAI cha
     (Đợt thi, Khoa quản lý) — Khoa quản lý là lọc tuỳ chọn, không khoá; đổi / xoá Khoa quản lý thì nạp lại Môn thi.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, nd = ums.nd, T = ums.tpNd, e = T.e, arr = T.arr;
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function cn() { return (ums.state && ums.state.chucNangId) || ''; }
    function vt() { return (ums.state && ums.state.roleId) || ''; }
    function esc(s) { return ui.esc(s); }

    /* ---------- Khung "Thống kê kết quả điểm thi" --------------------------- */
    function thongKe(api) {
        var v = api.v;
        if (!v('tg')) { ui.toast('Vui lòng chọn Thời gian trước khi thống kê!', 'warn'); return; }
        if (!v('dot') && !v('kql') && !v('mon')) { ui.toast('Vui lòng chọn thêm ít nhất một trong: Đợt thi / Khoa quản lý / Môn thi để thu hẹp phạm vi thống kê!', 'warn'); return; }
        ums.api.call({ action: 'XLHV_TP_ThongKe_MH/FSkuLyYKJAokNRA0IAUoJCwVKSgVKSQu', func: 'PKG_THI_PHACH_THONGKE.ThongKeKetQuaDiemThiTheo', strNguoiThucHien_Id: uid(),
            strHanhDong_Code: '', strDaoTao_ThoiGianDaoTao_Id: v('tg'), strThi_DotThi_Id: v('dot'), strDaoTao_HocPhan_Id: v('mon'), strDaoTao_KhoaQuanLyHP_Id: v('kql') })
            .then(function (r) { veThongKe(api, arr(r.data)); }).catch(function (err) { ums.api.handle(err, 'thống kê kết quả'); });
    }
    function veThongKe(api, ds) {
        var cols = ds.length ? Object.keys(ds[0]) : [], hien = ds, trang = 1, co = 20;
        function tim(ung) { for (var i = 0; i < ung.length; i++) if (cols.indexOf(ung[i]) >= 0) return ung[i]; return null; }
        var cKhoa = tim(['KHOA_QLSV', 'KHOA_QLHP', 'KHOA', 'TEN_KHOA', 'MA_KHOA']), cCN = tim(['CHUYEN_NGANH', 'CHUYENNGANH', 'CHUYEN_NGANH_TEN', 'TEN_CHUYENNGANH']);
        var k = api.moKhung(pat.panel({ title: 'Thống kê kết quả điểm thi', icon: 'fa-chart-simple', count: 'ntk', flush: true,
            tools: ui.btn('close', { attr: { 'data-c': 'dong' } }) + ui.btn('excel', { text: 'Xuất Excel', attr: { 'data-t': 'excel' } }),
            body: '<div class="ums-filter tpnd-tk">' +
                '<div class="ums-field"><input class="ums-input" data-t="q" placeholder="Tìm kiếm trong kết quả..." autocomplete="off"></div>' +
                '<div class="ums-field"><select class="ums-select" data-t="khoa" data-ph="Chọn Khoa"><option value=""></option></select></div>' +
                '<div class="ums-field"><select class="ums-select" data-t="cn" data-ph="Chọn chuyên ngành"><option value=""></option></select></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('reload', { text: 'Xóa lọc', icon: 'fa-eraser', attr: { 'data-t': 'xoaloc', title: 'Xóa toàn bộ bộ lọc' } }) + '</div></div>' +
                '<div data-t="bang"></div>' }));
        function q(n) { return k.querySelector('[data-t="' + n + '"]'); }
        function rieng(cot) {
            var thay = {}, ra = [];
            if (cot) ds.forEach(function (r) { var g = r[cot]; if (g === null || g === undefined || g === '') return; g = String(g); if (!thay[g]) { thay[g] = 1; ra.push(g); } });
            ra.sort(function (a, b) { return a.localeCompare(b, 'vi'); });
            return ra.map(function (g) { return { ID: g, TEN: g }; });
        }
        pat.fill(q('khoa'), rieng(cKhoa), { head: 'Chọn Khoa' }); q('khoa').disabled = !cKhoa;
        pat.fill(q('cn'), rieng(cCN), { head: 'Chọn chuyên ngành' }); q('cn').disabled = !cCN;
        if (window.jQuery) jQuery([q('khoa'), q('cn')]).trigger('change.select2');
        function ve() {
            k.querySelector('[data-z="ntk"]').textContent = '(' + hien.length + ')';
            ui.table({ el: q('bang'), rows: hien.slice((trang - 1) * co, trang * co), empty: 'Không có dữ liệu',
                columns: cols.map(function (c) { return { title: String(c).replace(/_/g, ' '), cls: 'is-center is-nowrap', render: function (x) { return esc(e(x[c])); } }; }),
                page: { index: trang, size: co, total: hien.length, sizes: [10, 20, 50, 100, 200, 500], onChange: function (p) { trang = p; ve(); }, onSize: function (s) { co = s; trang = 1; ve(); } } });
        }
        function loc() {
            var tk = q('q').value.trim().toLowerCase(), kh = q('khoa').value, cnv = q('cn').value;
            hien = ds.filter(function (r) {
                if (kh && cKhoa && String(e(r[cKhoa])) !== kh) return false;
                if (cnv && cCN && String(e(r[cCN])) !== cnv) return false;
                return !tk || cols.some(function (c) { return r[c] !== null && r[c] !== undefined && String(r[c]).toLowerCase().indexOf(tk) >= 0; });
            });
            trang = 1; ve();
        }
        q('q').addEventListener('input', loc);
        if (window.jQuery) jQuery([q('khoa'), q('cn')]).on('select2:select select2:clear', loc);
        k.addEventListener('click', function nghe(ev) {
            var b = ev.target.closest('[data-t]'); if (!b || b.tagName !== 'BUTTON' || !q('bang')) return;
            var a = b.getAttribute('data-t');
            if (a === 'xoaloc') {
                q('q').value = ''; q('khoa').value = ''; q('cn').value = '';
                if (window.jQuery) jQuery([q('khoa'), q('cn')]).trigger('change.select2');
                loc();
            } else if (a === 'excel') {
                if (!hien.length && !ds.length) { ui.toast('Không có dữ liệu để xuất Excel!', 'warn'); return; }
                var d = new Date(), hai = function (n) { return n < 10 ? '0' + n : String(n); };
                ui.xuatXls('ThongKeKetQuaDiemThi_' + d.getFullYear() + hai(d.getMonth() + 1) + hai(d.getDate()) + '_' + hai(d.getHours()) + hai(d.getMinutes()) + hai(d.getSeconds()) + '.xls',
                    { cot: [{ title: 'Stt', get: function (r, i) { return i + 1; } }].concat(cols.map(function (c) { return { title: String(c).replace(/_/g, ' '), prop: c }; })), dong: hien.length ? hien : ds });
            }
        });
        ve();
    }

    T.man(document.getElementById('tp-nhapdiemdst'), {
        tieuDe: 'Nhập điểm theo danh sách thi', phanTrang: true, rong: 'Không có danh sách thi',
        nut: ui.btn('view', { text: 'Thống kê kết quả', icon: 'fa-chart-simple', mod: 'out-warn', attr: { 'data-a': 'thongke', title: 'Thống kê kết quả điểm thi' } }),
        loc: [{ key: 'tg', type: 'select', label: 'Chọn thời gian' }, { key: 'ld', type: 'select', label: 'Chọn loại điểm' },
            { key: 'ht', type: 'select', label: 'Chọn hình thức thi' }, { key: 'dot', type: 'select', label: 'Chọn đợt thi' },
            { key: 'kql', type: 'select', label: 'Chọn khoa quản lý' }, { key: 'mon', type: 'select', label: 'Chọn môn thi' },
            { key: 'tt', type: 'select', label: 'Chọn trạng thái nhập điểm' }, { key: 'q', label: 'Nhập từ khóa tìm kiếm' }],
        locThem: function (k, v) { return k === 'mon' ? { strDaoTao_CoCauToChuc_Id: v('kql') } : {}; },
        sauLoc: function (api) {
            pat.fill(api.f('tt'), [{ ID: '0', TEN: 'Chưa hoàn thành nhập điểm' }, { ID: '1', TEN: 'Hoàn thành nhập điểm' }], { head: 'Chọn trạng thái nhập điểm' });
            ums.ref.coCauToChuc({ strCCTC_Loai_Id: '', strCCTC_Cha_Id: '', iTrangThai: 1 })
                .then(function (d) { pat.fill(api.f('kql'), d, { name: 'TEN', head: 'Chọn khoa quản lý' }); }).catch(function (err) { ums.api.handle(err, 'khoa quản lý'); });
            if (window.jQuery) jQuery(api.f('kql')).on('select2:select select2:clear', function () {
                var m = api.f('mon'); m.value = ''; jQuery(m).trigger('change.select2');   // đổi / xoá cha thì xoá trắng con
                api.napMon();
            });
        },
        tai: function (v) {
            return ums.api.call({ action: 'XLHV_TP_Chung_MH/DSA4BRIVKSgVKSQuBS41FSko', func: 'pkg_thi_phach_chung.LayDSThiTheoDotThi', strTuKhoa: v('q'), strChucNang_Id: cn(),
                dLocKhongHoanThanhNhapDiem: '0', strThi_DotThi_Id: v('dot'), strDaoTao_HocPhan_Id: v('mon'), strTuNgay: '', strDenNgay: '', strHinhThucThi_Id: v('ht'),
                strDiem_ThanhPhanDiem_Id: v('ld'), strDaoTao_CoCauToChuc_Id: v('kql'), strNguoiThucHien_Id: uid() });
        },
        hien: function (ds, v) {
            var tt = v('tt');
            if (tt === '1') return ds.filter(function (x) { return String(x.XACNHANHOANTHANHDIEMTHI) === '1'; });
            if (tt === '0') return ds.filter(function (x) { return String(x.XACNHANHOANTHANHDIEMTHI) !== '1'; });
            return ds;
        },
        cot: function (lk) {
            return [{ title: 'Mã danh sách thi', cls: 'is-nowrap', render: function (x) { return lk(x.MADANHSACHTHI, x); } },
                { title: 'Học phần', render: function (x) { return lk(x.DAOTAO_HOCPHAN_TEN, x); } },
                { title: 'Ngày thi', cls: 'is-nowrap', render: function (x) { return lk(x.NGAYTHI, x); } },
                { title: 'Ca thi', cls: 'is-center', render: function (x) { return lk(x.THI_CATHI_TEN, x); } },
                { title: 'Phòng thi', render: function (x) { return lk(x.TKB_PHONGTHI_TEN, x); } },
                { title: 'Số SV', cls: 'is-center', render: function (x) { return lk(x.SOSVTHEODST, x); } }];
        },
        cotSau: [{ title: 'Xác nhận hoàn thành', cls: 'is-center is-nowrap', render: function (x) { return String(x.XACNHANHOANTHANHDIEMTHI) === '1' ? ui.badge('Đã xác nhận', 'ok') : ''; } }],
        loaiXN: 'XACNHAN_HOANTHANH_DIEMTHI', chuDeXN: 'Danh sách thi',
        baoCao: function (add, v) { add('strThi_DotThi_Id', v('dot')); add('strDaoTao_HocPhan_Id', v('mon')); },
        onNut: function (a, api) { if (a === 'thongke') thongKe(api); },
        ct: {
            icon: 'fa-users-between-lines',
            tieuDe: function (x) { return 'Thông tin danh sách thi ' + [x.MADANHSACHTHI, x.NGAYTHI, x.THI_CATHI_TEN, x.TKB_PHONGTHI_TEN].map(e).join(' - '); },
            tools: ui.btn('confirm', { text: 'Xác nhận từng bản ghi', mod: 'out-success', attr: { 'data-c': 'xntung' } }),
            mo: function (dst, k) {
                var h = k.bang, NH = [];
                function tai2() {
                    h.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
                    return ums.api.call({ action: 'TP_Chung/LayDSNguoiHocTheoDST', method: 'GET', strDanhSachThi_Id: dst.ID, strNguoiThucHien_Id: uid() }).then(function (r) {
                        NH = arr(r.data);
                        ui.table({ el: h, rows: NH, empty: 'Danh sách thi chưa có người học', columns: [
                            { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' }, { title: 'Họ đệm', prop: 'QLSV_NGUOIHOC_HODEM' }, { title: 'Tên', prop: 'QLSV_NGUOIHOC_TEN' },
                            { title: 'Lớp quản lý', prop: 'DAOTAO_LOPQUANLY_TEN' }, { title: 'Điểm thành phần', prop: 'DIEM_THANHPHANDIEM_TEN' },
                            { title: 'Lần học', prop: 'LANHOC', cls: 'is-center' }, { title: 'Lần thi', prop: 'LANTHI', cls: 'is-center' }, { title: 'Số báo danh', prop: 'SOBAODANH', cls: 'is-center' },
                            { title: 'Điểm', cls: 'is-center', render: function (y, i) {
                                if (String(y.CAMTHI_DUYETDKTHI) === '1' || String(y.CAMTHI_VIPHAMQUYCHE) === '1') return '';
                                var g = esc(e(y.DIEMBANDAU));
                                return '<input class="ums-input ums-input--sm nd-o" id="txtDiem' + esc(y.ID) + '" data-r="' + i + '" data-c="0" data-goc="' + g + '" value="' + g + '" autocomplete="off">';
                            } },
                            { title: 'Điểm phúc khảo', prop: 'DIEMPHUCKHAO', cls: 'is-center' },
                            { title: 'Lớp đăng ký học', prop: 'DIEM_DANHSACHHOC_TEN' },
                            { title: 'Người cập nhật', prop: 'NGUOISUA_TAIKHOAN' },
                            { title: 'Ngày cập nhật', prop: 'NGAYSUA_DD_MM_YYYY', cls: 'is-nowrap' }] });
                        var t = h.querySelector('table');
                        if (t) t.classList.add('nd-luoi');
                    }).catch(function (err) { h.innerHTML = ui.fail(err.message); ums.api.handle(err, 'người học'); });
                }
                function luu() {
                    var doi = nd.oDoi(h);
                    if (!doi.length) { ui.toast('Chưa có điểm mới nào cần lưu', 'info'); return; }
                    ui.confirm('Bạn có chắc chắn lưu ' + doi.length + ' dữ liệu không?', { title: 'Lưu điểm' }).then(function (yes) {
                        if (!yes) return;
                        ui.batch(doi.map(function (i) {
                            return { action: 'TP_XuLy/CapNhat_DiemPhachTheoDST', method: 'POST', strChucNang_Id: cn(), strUngDung_Id: vt(), strNguoiThucHien_Id: uid(),
                                strThi_DanhSachSinhVien_Id: i.id.substring(7), strDiem: i.value.trim() };
                        }), { title: 'Đang lưu điểm', okText: 'Thực hiện thành công', concurrency: 5, show: true }).then(tai2);
                    });
                }
                tai2();
                return {
                    luu: luu,
                    doi: function () { return nd.oDoi(h).length; },
                    nut: function (a) {
                        if (a !== 'xntung') return;
                        T.tungDong({ chuDe: 'Từng bản ghi', icon: 'fa-memo-circle-check', loai: 'XACNHAN_HOANTHANH_DIEMTHI_NGUOIHOC', ds: NH,
                            cot: [{ title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO' }, { title: 'Họ đệm', prop: 'QLSV_NGUOIHOC_HODEM' }, { title: 'Tên', prop: 'QLSV_NGUOIHOC_TEN' }],
                            khoa: function (y) { return dst.ID + e(y.QLSV_NGUOIHOC_ID); } });
                    }
                };
            }
        }
    });
})();
