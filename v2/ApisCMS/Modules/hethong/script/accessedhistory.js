/* =========================================================================
   Lịch sử truy cập (chỉ xem)
   Bản gốc: ApisCMS/Modules/hethong/html/accessedhistory.html + script/accessedhistory.js
   ---------------------------------------------------------------------------
   Một cột như bản gốc: thanh lọc (8 ô, hai hàng) + bảng phân trang máy chủ.
   Lời gọi — chép nguyên văn:
       SYS_LuuCacThongTinHoatDong/LayDanhSach  GET  strTuKhoa, strChucNang_Id,
           strUngDung_Id, strHoatDong, strDiaChiMayTramTruyCap "",
           strTrinhDuyetSuDungTruyCap "", strTaiKhoanDangNhap,
           strThoiGianMayTram_BD "", strThoiGianMayTram_KT "",
           strThoiGianMayChu_BD, strThoiGianMayChu_KT, strTenThietBi "",
           strMoTa "", pageIndex, pageSize
       CMS_UngDung/LayDanhSach   GET  strTuKhoa "", pageIndex 1, pageSize 10000, dTrangThai 1  (TENUNGDUNG)
       CMS_ChucNang/LayDanhSach  GET  strTuKhoa "", strChung_UngDung_Id, strCha_Id "",
                                      pageIndex 1, pageSize 1000, strPhamViTruyCap_Id "", dTrangThai 1  (TENCHUCNANG)
   ⚠ strChucNang_Id là ô LỌC chức năng. Để trống ("Tất cả chức năng") thì
     makeRequest gốc (Corei:makeRequest) và ums.api.call đều tự điền id CHÍNH
     màn này → danh sách chỉ ra lịch sử của màn Lịch sử truy cập. Hành vi y như
     gốc — giữ nguyên, ghi can-quyet để kiểm trên host.

   Lỗi gốc đã sửa:
     · Nạp chức năng gửi strChung_UngDung_Id = giá trị của Ô CHỨC NĂNG (chính
       nó) thay vì ô Ứng dụng → danh sách chức năng không bao giờ lọc theo ứng
       dụng. Bản mới gửi giá trị ô Ứng dụng.
   Cặp cha → con: Ứng dụng → Chức năng (ums.pat.chain): chưa chọn ứng dụng thì
     ô chức năng khoá; chọn/xoá ứng dụng thì xoá trắng chức năng.
   Nút "Test connect" (gốc: bắn 1.000 lời gọi danh sách, mỗi lần mở một hộp
     tiến độ) — giữ nút, đổi thành: hỏi lại → 1.000 lời gọi qua ums.ui.batch
     (10 luồng, một hộp tiến độ). Đây là nút thử tải máy chủ.
   Sáu cột OS / Màn hình / Trình duyệt / IP or MAC / IP public / Địa điểm cắt
   chuỗi TRINHDUYETSUDUNGTRUYCAP và DIACHIMAYTRAMTRUYCAP y như gốc (tên cột gốc
   không khớp phần cắt — giữ nguyên).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var root = document.getElementById('cms-accessedhistory');
    if (!root) return;

    var HOATDONG = [
        { ID: 'LOGINSUCESS', TEN: 'Đăng nhập thành công' },
        { ID: 'LOGINPASSFAIL', TEN: 'Đăng nhập thất bại' },
        { ID: 'VAOUNGDUNG', TEN: 'Vào ứng dụng' },
        { ID: 'VAOCHUCNANG', TEN: 'Vào chức năng' },
        { ID: 'CONFIRM', TEN: 'Xác nhận' },
        { ID: 'BUTTON', TEN: 'Nút đã ấn' }
    ];
    var trang = { index: 1, size: (ums.cfg && ums.cfg.behavior && ums.cfg.behavior.pageSize) || 10, total: 0 };

    root.innerHTML =
        pat.page('Lịch sử truy cập', '') +
        pat.filterBar([
            { key: 'hoatDong', type: 'select', label: 'Tất cả thao tác' },
            { key: 'ungDung', type: 'select', label: 'Tất cả ứng dụng' },
            { key: 'chucNang', type: 'select', label: 'Tất cả chức năng' },
            { key: 'user', label: 'User đăng nhập' },
            { key: 'tu', type: 'date', label: 'Thời gian truy cập từ' },
            { key: 'den', type: 'date', label: 'Thời gian truy cập đến' },
            { key: 'q', label: 'Nhập từ khóa tìm kiếm' }
        ], { extra: '<div class="ums-field ums-field--fit">' +
            ui.btn('reload', { text: 'Test connect', mod: 'danger', icon: 'fa-recycle', attr: { 'data-a': 'test' } }) + '</div>' }) +
        pat.panel({ title: 'Lịch sử truy cập', icon: 'fa-clock-rotate-left', count: 'tong', flush: true, zone: 'bang' });

    function F(k) { return root.querySelector('[data-f="' + k + '"]'); }
    var elBang = root.querySelector('[data-z="bang"]');
    var elTong = root.querySelector('[data-z="tong"]');

    pat.fill(F('hoatDong'), HOATDONG, { head: 'Tất cả thao tác' });

    /* getList_UngDung */
    ums.api.call({ action: 'CMS_UngDung/LayDanhSach', method: 'GET', silent: true,
        strTuKhoa: '', pageIndex: 1, pageSize: 10000, dTrangThai: 1 })
        .then(function (r) { pat.fill(F('ungDung'), r.data || [], { name: 'TENUNGDUNG', head: 'Tất cả ứng dụng' }); })
        .catch(function (err) { ums.api.handle(err, 'CMS_UngDung/LayDanhSach'); });

    /* getList_UngDungChucNang — theo ỨNG DỤNG đang chọn (gốc đọc nhầm ô chức năng) */
    function napChucNang() {
        var ud = F('ungDung').value;
        if (!ud) { pat.fill(F('chucNang'), [], { head: 'Tất cả chức năng' }); return; }
        ums.api.call({ action: 'CMS_ChucNang/LayDanhSach', method: 'GET', silent: true,
            strTuKhoa: '', strChung_UngDung_Id: ud, strCha_Id: '', pageIndex: 1, pageSize: 1000,
            strPhamViTruyCap_Id: '', dTrangThai: 1 })
            .then(function (r) { pat.fill(F('chucNang'), r.data || [], { name: 'TENCHUCNANG', head: 'Tất cả chức năng' }); })
            .catch(function (err) { ums.api.handle(err, 'CMS_ChucNang/LayDanhSach'); });
    }
    if (window.jQuery) jQuery(F('ungDung')).on('select2:select', napChucNang);
    pat.chain([F('ungDung'), F('chucNang')]);

    function thamSo() {
        return {
            action: 'SYS_LuuCacThongTinHoatDong/LayDanhSach', method: 'GET',
            strTuKhoa: F('q').value.trim(),
            strChucNang_Id: F('chucNang').value,
            strUngDung_Id: F('ungDung').value,
            strHoatDong: F('hoatDong').value,
            strDiaChiMayTramTruyCap: '',
            strTrinhDuyetSuDungTruyCap: '',
            strTaiKhoanDangNhap: F('user').value.trim(),
            strThoiGianMayTram_BD: '',
            strThoiGianMayTram_KT: '',
            strThoiGianMayChu_BD: F('tu').value,
            strThoiGianMayChu_KT: F('den').value,
            strTenThietBi: '',
            strMoTa: '',
            pageIndex: trang.index,
            pageSize: trang.size
        };
    }

    /* Các cột cắt chuỗi — y như mRender của gốc */
    function td(v) { return v == null ? '' : String(v); }
    function coMo(s) { return s.indexOf('(') >= 0; }
    var COT = [
        { title: 'User', prop: 'NGUOIDUNG_TAIKHOAN', cls: 'is-nowrap' },
        { title: 'Người dùng', prop: 'NGUOIDUNG_TENDAYDU' },
        { title: 'Ứng dụng', prop: 'UNGDUNG_TEN' },
        { title: 'Chức năng', prop: 'CHUCNANG_TEN' },
        { title: 'Hoạt động', prop: 'HOATDONG', cls: 'is-center' },
        { title: 'Thời gian', prop: 'THOIGIANMAYCHU', cls: 'is-nowrap is-center' },
        { title: 'OS', cls: 'cmsht-nho', render: function (r) {
            var s = r.TRINHDUYETSUDUNGTRUYCAP; if (s == null) return ''; s = td(s);
            return coMo(s) ? esc(s.substring(0, s.indexOf('(') - 1)) : '';
        } },
        { title: 'Màn hình', cls: 'cmsht-nho', render: function (r) {
            var s = r.TRINHDUYETSUDUNGTRUYCAP; if (s == null) return ''; s = td(s);
            return coMo(s) ? esc(s.substring(s.indexOf('(') + 1, s.indexOf(')'))) : '';
        } },
        { title: 'Trình duyệt', cls: 'cmsht-nho', render: function (r) {
            var s = r.TRINHDUYETSUDUNGTRUYCAP; if (s == null) return ''; s = td(s);
            return s.indexOf('/') >= 0 ? esc(s.substring(s.indexOf('/') + 1)) : '';
        } },
        { title: 'IP or MAC', cls: 'is-nowrap', render: function (r) {
            var s = r.DIACHIMAYTRAMTRUYCAP; if (s == null) return ''; s = td(s);
            return s.indexOf(' ') >= 0 ? esc(s.substring(0, s.indexOf(' '))) : '';
        } },
        { title: 'IP public', cls: 'is-nowrap', render: function (r) {
            var s = r.DIACHIMAYTRAMTRUYCAP; if (s == null) return ''; s = td(s);
            return coMo(s) ? esc(s.substring(s.indexOf('(') + 1, s.lastIndexOf(':'))) : '';
        } },
        { title: 'Địa điểm', render: function (r) {
            var s = r.DIACHIMAYTRAMTRUYCAP; if (s == null) return ''; s = td(s);
            return coMo(s) ? esc(s.substring(s.lastIndexOf(':') + 1, s.lastIndexOf(')'))) : '';
        } }
    ];

    function nap(p) {
        if (p) trang.index = p;
        if (!elBang.firstChild) elBang.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call(thamSo()).then(function (r) {
            var rows = r.data || [];
            trang.total = Number(r.pager) || rows.length;
            elTong.textContent = '(' + trang.total + ')';
            ui.table({
                el: elBang, rows: rows, columns: COT, empty: 'Không có dữ liệu',
                page: { index: trang.index, size: trang.size, total: trang.total,
                    onChange: function (x) { if (x >= 1 && x <= Math.ceil(trang.total / trang.size)) nap(x); },
                    onSize: function (v) { trang.size = v; nap(1); } }
            });
        }).catch(function (err) {
            elBang.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'SYS_LuuCacThongTinHoatDong/LayDanhSach');
        });
    }

    /* btnSearchTest */
    function thuKetNoi() {
        ui.confirm('Gửi 1.000 lời gọi danh sách lịch sử truy cập để thử kết nối / tải máy chủ?', { title: 'Test connect', ok: 'Chạy thử' })
            .then(function (yes) {
                if (!yes) return;
                var p = thamSo(), ds = [];
                p.silent = true;
                for (var i = 0; i < 1000; i++) ds.push(p);
                return ui.batch(ds, { title: 'Test connect', concurrency: 10 });
            });
    }

    root.addEventListener('click', function (e) {
        var b = e.target.closest('[data-a]');
        if (!b) return;
        if (b.getAttribute('data-a') === 'search') nap(1);
        else if (b.getAttribute('data-a') === 'test') thuKetNoi();
    });
    F('q').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); nap(1); } });

    nap(1);
})();
