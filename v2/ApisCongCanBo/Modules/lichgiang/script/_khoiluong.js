/* =========================================================================
   Khối lượng cá nhân — khung chung của khoiluongcanhan (tự xem) và
   khoaxemkhoiluongcanhan (khoa xem một cán bộ) — ums.lg.khoiLuong(root, { khoa })
   Bản gốc: MỘT tệp script/khoiluongcanhan.js cho hai html; khác nhau chỉ vì
   html có / không có ô (Đơn vị, Cán bộ, nút "Xem toàn bộ", nút "Lưu").
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên; "người đang xem" = người đăng nhập, hoặc cán bộ khoa chọn):
       NS_ThongTinCanBo/LayDSKeHoachKLGDChiTietCaNhan (GET)   ô Bảng tính (Data.rs, tự chọn khi chỉ có một)
                                                              + Data.rsThongTin[0] → Họ tên / Mã / Đơn vị
       TKGG_KeHoach/LayDSDuLieuKLCaNhan (GET)                 danh sách (strNguoiThucHien_Id = người đang xem)
       NS_KLGD_KeHoach_MH · PKG_KLGV_V2_KEHOACH.LayDSDuLieuKLCaNhanTongHop   "Xem toàn bộ" (người ĐĂNG NHẬP, như gốc)
       TKGG_ThongTin/LayDSDuLieu_ChiTiet (GET)                hộp chi tiết → rs + rsThanhPhanCongThuc
       TKGG_ThongTin/LayGiaTriTuKhoa (GET)                    MỖI Ô (dòng × thành phần công thức) một lời gọi, như gốc
       Hộp "Duyệt buổi học": ma trận chỉ xem — _matranbuoi.js
       Khoa: KHCT_ThongTin/LayDSKhoaQuanLyPhanQuyen (GET)     ô Đơn vị
             ums.ref.nhanSu (dLaCanBoNgoaiTruong −1)            ô Cán bộ theo đơn vị
   Mẫu báo cáo: strKLGD_KeHoachChitiet_Id, strNguoiDung_Id (người đang xem).

   Không chép (lỗi rõ của bản gốc):
     · Nạp Đơn vị hai lần lúc mở màn (và cả ở trang tự xem, nơi không có ô).
     · rsThongTin rỗng → lỗi JS; LayGiaTriTuKhoa trả rỗng → lỗi JS.
     · Dòng tổng cộng cả cột "Vai trò" (chữ) — bỏ cột đó khỏi dòng tổng.
     · Hộp chi tiết loại KLGD_DULIEU_DOANKHOALUAN có nhánh thứ hai không bao giờ chạy — bỏ.
     · Đổi Đơn vị / Cán bộ không xoá bảng, bảng tính, họ tên cũ → ở đây xoá.
     · CRUD NS_HeSo_KhoiLuongCaNhan (ThemMoi / CapNhat / Xoa) chép từ màn hệ số, không có đường vào → bỏ.
   Giữ như bản gốc: nút "Lưu" ở trang tự xem không có xử lý → giữ nút, khoá lại.
   Khác bản gốc (luật cha → con): trang khoa — Đơn vị → Cán bộ → Bảng tính khoá
   theo tầng; bản gốc mở màn là hiện luôn khối lượng CỦA NGƯỜI ĐĂNG NHẬP.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var lg = ums.lg = ums.lg || {};
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function get(a, o) { return ums.api.call(Object.assign({ action: a, method: 'GET' }, o)); }

    /* Cột cơ sở của hộp chi tiết theo LOAI (viewForm_KhoiLuongCaNhan của gốc) */
    var HP = { title: 'Học phần', render: function (r) { return esc(e(r.DAOTAO_HOCPHAN_TEN) + ' - ' + e(r.DAOTAO_HOCPHAN_MA)); } };
    var LHP = { title: 'Lớp học phần', prop: 'DAOTAO_LOPHOCPHAN_TEN' };
    var GC = { title: 'Giờ chuẩn', prop: 'GIOCHUAN', cls: 'is-center', sum: true };
    var SV = { title: 'Số sinh viên', prop: 'QUYMO', cls: 'is-center' };
    var TC = { title: 'Số tín chỉ', prop: 'SOTINCHIHOCPHAN', cls: 'is-center' };
    var COT_LOAI = {
        KLGD_DULIEU_LICHGIANG: [{ title: 'Ngày học', prop: 'NGAY', cls: 'is-center is-nowrap' }, { title: 'Tiết bắt đầu', prop: 'TIETBATDAU', cls: 'is-center' },
            { title: 'Tiết kết thúc', prop: 'TIETKETTHUC', cls: 'is-center' }, { title: 'Số tiết', prop: 'SOLUONG', cls: 'is-center' }, SV, HP, LHP, GC],
        KLGD_DULIEU_LAMSAN: [{ title: 'Ngày đi', prop: 'NGAY', cls: 'is-center is-nowrap' }, { title: 'Số ngày', prop: 'SOLUONG', cls: 'is-center' }, SV, TC, HP, LHP, GC],
        KLGD_DULIEU_DOANKHOALUAN: [SV, TC, HP, LHP, GC],
        KLGD_DULIEU_HOIDONG: [GC]
    };

    lg.khoiLuong = function (root, o) {
        o = o || {};
        var nguoi = o.khoa ? '' : uid(), ds = [];
        var loc = (o.khoa ? '<div class="ums-field"><select class="ums-select" data-f="dv" data-ph="Chọn đơn vị"><option value=""></option></select></div>' +
                '<div class="ums-field"><select class="ums-select" data-f="cb" data-ph="Chọn cán bộ"><option value=""></option></select></div>' : '') +
            '<div class="ums-field"><select class="ums-select" data-f="bt" data-ph="Bảng tính khối lượng"><option value=""></option></select></div>' +
            '<div class="ums-field ums-field--fit">' + ui.btn('search', { text: 'Xem', attr: { 'data-a': 'xem' } }) + '</div>' +
            (o.khoa ? '' : '<div class="ums-field ums-field--fit">' + ui.btn('search', { text: 'Xem toàn bộ', icon: 'fa-table', mod: 'out-primary', attr: { 'data-a': 'toanbo' } }) + '</div>');
        root.innerHTML =
            pat.page('Khối lượng cá nhân', '<div data-z="bc"></div>') +
            pat.panel({ title: false, cls: 'ums-u-mb-4', body: '<div class="ums-filter">' + loc + '</div>' +
                '<div class="lg-kl__tt"><span>Họ và tên: <b data-z="ten"></b></span><span>Mã nhân sự: <b data-z="ma"></b></span><span>Thuộc đơn vị: <b data-z="donvi"></b></span></div>' }) +
            pat.panel({ title: 'Danh sách Khối lượng cá nhân', icon: 'fa-square-poll-horizontal', flush: true, zone: 'bang',
                tools: o.khoa ? '' : ui.btn('save', { attr: { disabled: '', title: 'Bản gốc chưa có chức năng lưu' } }) });
        ui.enhance(root);
        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
        function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
        function xoaTT() { z('ten').textContent = ''; z('ma').textContent = ''; z('donvi').textContent = ''; }
        function trong(msg) { z('bang').innerHTML = ui.empty(msg, 'fa-hand-pointer'); }
        trong('Chọn bảng tính khối lượng');

        /* ---------- Bảng tính + thông tin người ------------------------- */
        function napBangTinh() {
            xoaTT();
            if (o.khoa && !nguoi) { pat.fill(f('bt'), []); return Promise.resolve(); }
            return get('NS_ThongTinCanBo/LayDSKeHoachKLGDChiTietCaNhan', { strNguoiDung_Id: nguoi }).then(function (r) {
                var d = r.data || {}, rs = arr(d), tt = Array.isArray(d.rsThongTin) ? d.rsThongTin[0] : null;
                if (tt) { z('ten').textContent = e(tt.HODEM) + ' ' + e(tt.TEN); z('ma').textContent = e(tt.MASO); z('donvi').textContent = e(tt.DAOTAO_COCAUTOCHUC_TEN); }
                pat.fill(f('bt'), rs, { name: 'TEN', head: 'Chọn bảng tính' });
                if (rs.length === 1) { f('bt').value = rs[0].ID; if (window.jQuery) jQuery(f('bt')).trigger('change.select2'); tai(); }
                if (chuoi) chuoi.sync();
            }).catch(function (err) { ums.api.handle(err, 'bảng tính khối lượng'); });
        }

        /* ---------- Danh sách ------------------------------------------- */
        function ve(rows) {
            ds = rows;
            ui.table({ el: z('bang'), rows: ds, empty: 'Không có dữ liệu', columns: [
                { title: 'Chi tiết', cls: 'is-center', width: '60px', render: function (x, i) {
                    return '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-ct="' + i + '" title="Chi tiết"><i class="fa-light fa-eye"></i></button>'; } },
                { title: 'Duyệt buổi học', cls: 'is-center', render: function (x, i) { return '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm" data-db="' + i + '"><span>Duyệt buổi học</span></button>'; } },
                { title: 'Thông tin bậc hệ', prop: 'DAOTAO_HEDAOTAO_TEN', cls: 'is-center' },
                { title: 'Học kỳ', prop: 'THOIGIAN' },
                { title: 'Đơn vị', prop: 'DONVI_PHUTRACH_HOCPHAN_TEN', cls: 'is-center' },
                { title: 'Thông tin dữ liệu tính khối lượng', prop: 'TENLOP', cls: 'is-center' },
                { title: 'Tổng TC/LT/TH', prop: 'TONGPHANBO', cls: 'is-center' },
                { title: 'Phân loại', prop: 'PHANLOAI_TEN', cls: 'is-center' },
                { title: 'Số SV', prop: 'QUYMO', cls: 'is-center', sum: true },
                { title: 'Vai trò', prop: 'VAITRO_TEN', cls: 'is-center' },
                { title: 'Số lượng (Số tiết|Số ngày)', prop: 'SOLUONG', cls: 'is-center', sum: true },
                { title: 'Giờ chuẩn quy đổi', prop: 'SOGIOCHUAN', cls: 'is-center', sum: true },
                { title: 'Tình trạng xác nhận', prop: 'TINHTRANGXACNHAN_TEN', cls: 'is-center' },
                { title: 'Ghi chú', prop: 'GHICHU' }
            ] });
        }
        function tai() {
            if (!f('bt').value) { trong('Chọn bảng tính khối lượng'); return Promise.resolve(); }
            z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return get('TKGG_KeHoach/LayDSDuLieuKLCaNhan', { strKLGD_KeHoachChitiet_Id: f('bt').value, strNguoiThucHien_Id: nguoi })
                .then(function (r) { ve(arr(r.data)); }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'khối lượng cá nhân'); });
        }
        function toanBo() {
            z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return ums.api.call({ action: 'NS_KLGD_KeHoach_MH/DSA4BRIFNA0oJDQKDQIgDykgLxUuLyYJLjEP', func: 'PKG_KLGV_V2_KEHOACH.LayDSDuLieuKLCaNhanTongHop',
                strKLGD_KeHoachChitiet_Id: f('bt').value, strNguoiThucHien_Id: uid() })
                .then(function (r) { ve(arr(r.data)); }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'khối lượng toàn bộ'); });
        }

        /* ---------- Hộp chi tiết ---------------------------------------- */
        function chiTiet(r) {
            var dlg = ui.dialog({ title: 'Dữ liệu ' + e(r.GHICHU), icon: 'fa-table-list', size: 'xl', body: '<div data-k="bang">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
            var host = dlg.body.querySelector('[data-k="bang"]');
            get('TKGG_ThongTin/LayDSDuLieu_ChiTiet', { strKLGD_KeHoachChiTiet_Id: e(r.KLGD_KEHOACHCHITIET_ID), strLoai: e(r.LOAI), strId: e(r.ID), strNguoiThucHien_Id: nguoi })
                .then(function (x) {
                    var d = x.data || {}, rs = arr(d), tp = Array.isArray(d.rsThanhPhanCongThuc) ? d.rsThanhPhanCongThuc : [];
                    var G = tp.length ? [e(tp[0].XAUCONGTHUC)] : [];
                    ui.table({ el: host, rows: rs, empty: 'Không có dữ liệu', columns: (COT_LOAI[r.LOAI] || []).concat(tp.map(function (c) {
                        return { title: e(c.TENTUKHOA), group: G, cls: 'is-center', render: function (row) { return '<span data-kq="' + esc(row.ID + '|' + c.ID) + '"></span>'; } };
                    })) });
                    rs.forEach(function (row) {
                        tp.forEach(function (c) {
                            get('TKGG_ThongTin/LayGiaTriTuKhoa', { silent: true, strTuKhoa: e(c.TUKHOA), strKLGD_DuLieu_Loai_Id: row.ID, strNguoiThucHien_Id: nguoi }).then(function (y) {
                                var v = arr(y.data)[0], el = host.querySelector('[data-kq="' + row.ID + '|' + c.ID + '"]');
                                if (el && v) el.textContent = e(v.GIATRITUKHOA);
                            }).catch(function () {});
                        });
                    });
                }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'chi tiết khối lượng'); });
        }
        function duyetBuoi(r) {
            var dlg = ui.dialog({ title: 'Dữ liệu', icon: 'fa-calendar-check', size: 'xl', body: '<div data-k="mt"></div>' });
            lg.maTranBuoi(dlg.body.querySelector('[data-k="mt"]'), { sua: false, nguoiThucHien: function () { return nguoi; }, ts: function () {
                return { strKLGD_KeHoachChitiet_Id: e(r.KLGD_KEHOACHCHITIET_ID), strDaoTao_HocPhan_Id: e(r.DAOTAO_HOCPHAN_ID), strDaoTao_LopHocPhan_Id: e(r.DULIEUXACNHAN) };
            } }).tai();
        }

        /* ---------- Trang khoa: Đơn vị → Cán bộ → Bảng tính ------------- */
        var chuoi = null, dsCB = [];
        if (o.khoa) {
            get('KHCT_ThongTin/LayDSKhoaQuanLyPhanQuyen', { strNguoiThucHien_Id: uid() })
                .then(function (r) { pat.fill(f('dv'), arr(r.data), { name: 'TEN' }); chuoi.sync(); }).catch(function (err) { ums.api.handle(err, 'đơn vị'); });
            var napCB = function () {
                nguoi = ''; xoaTT(); pat.fill(f('bt'), []); trong('Chọn cán bộ và bảng tính khối lượng');
                if (!f('dv').value) { pat.fill(f('cb'), []); return; }
                ums.ref.nhanSu({ strCoCauToChuc_Id: f('dv').value, dLaCanBoNgoaiTruong: -1, pageIndex: 1, pageSize: 1000000 })
                    .then(function (d) { dsCB = d || []; pat.fill(f('cb'), dsCB, { name: function (x) { return e(x.HODEM) + ' ' + e(x.TEN) + ' - ' + e(x.MASO) + ' - ' + e(x.DAOTAO_COCAUTOCHUC_TEN); } }); chuoi.sync(); })
                    .catch(function (err) { ums.api.handle(err, 'cán bộ'); });
            };
            if (window.jQuery) {
                jQuery(f('dv')).on('select2:select select2:clear', napCB);
                jQuery(f('cb')).on('select2:select select2:clear', function () { nguoi = f('cb').value; trong('Chọn bảng tính khối lượng'); napBangTinh(); });
            }
            chuoi = pat.chain([f('dv'), f('cb'), f('bt')], { phatLai: false });
            trong('Chọn đơn vị, cán bộ và bảng tính khối lượng');
        } else napBangTinh();
        if (window.jQuery) jQuery(f('bt')).on('select2:select', tai);

        ums.report.mount(z('bc'), { collect: function (add) { add('strKLGD_KeHoachChitiet_Id', f('bt').value); add('strNguoiDung_Id', nguoi); } });
        root.addEventListener('click', function (ev) {
            var b;
            if ((b = ev.target.closest('[data-ct]'))) { chiTiet(ds[Number(b.getAttribute('data-ct'))]); return; }
            if ((b = ev.target.closest('[data-db]'))) { duyetBuoi(ds[Number(b.getAttribute('data-db'))]); return; }
            if ((b = ev.target.closest('[data-a]'))) {
                if (b.getAttribute('data-a') === 'xem') tai();
                else if (b.getAttribute('data-a') === 'toanbo') toanBo();
            }
        });
    };
})();
