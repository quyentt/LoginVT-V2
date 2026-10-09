/* =========================================================================
   Khoa duyệt buổi học thực tế
   Bản gốc: ApisCongCanBo/Modules/lichgiang/html/duyetbuoihoc.html + script/duyetbuoihoc.js
   Ma trận buổi × giảng viên + Lưu: _matranbuoi.js (ums.lg.maTranBuoi).
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, GET):
       NS_ThongTinCanBo/LayDSKeHoachKLGDChiTiet          ô Kế hoạch (tự chọn khi chỉ có một)
       NS_ThongTinCanBo/LayDSHocPhanTinhKLGDTheoKhoaQL   ô Học phần (strKLGD_KeHoachChiTiet_Id — chữ T hoa, như gốc)
       TKGG_KeHoach/LayDSLopHocPhanDuyet                 ô Lớp học phần
   Mẫu báo cáo: strNCKH_TinhDiem_KeHoach_Id = kế hoạch (tên tham số chép nguyên của gốc).
   Nối tầng: Kế hoạch → Học phần → Lớp học phần (ums.pat.chain); chọn lớp là nạp ma trận.
   Không chép: hộp "Xác nhận" (#modal_XacNhan) không có đường mở; nạp Học phần
   lúc mở màn khi chưa có kế hoạch; hai nút "Lưu" giống hệt nhau → một nút.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, lg = ums.lg;
    var root = document.getElementById('lg-duyetbuoihoc');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function get(a, o) { return ums.api.call(Object.assign({ action: a, method: 'GET', strNguoiThucHien_Id: uid() }, o)).then(function (r) { return arr(r.data); }); }

    root.innerHTML =
        pat.page('Khoa duyệt buổi học thực tế', '<div data-z="bc"></div>' + ui.btn('save', { attr: { 'data-a': 'luu' } })) +
        pat.filterBar([
            { key: 'kh', label: 'Chọn kế hoạch', type: 'select' },
            { key: 'hp', label: 'Chọn học phần', type: 'select' },
            { key: 'lop', label: 'Chọn lớp học phần', type: 'select' }
        ], { searchText: 'Danh sách' }) +
        pat.panel({ title: 'Danh sách khoa duyệt buổi học thực tế', icon: 'fa-calendar-check', flush: true, zone: 'bang' });
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    z('bang').innerHTML = ui.empty('Chọn kế hoạch, học phần và lớp học phần', 'fa-hand-pointer');

    var M = lg.maTranBuoi(z('bang'), { sua: true, ts: function () {
        return { strKLGD_KeHoachChitiet_Id: f('kh').value, strDaoTao_HocPhan_Id: f('hp').value, strDaoTao_LopHocPhan_Id: f('lop').value };
    } });
    var chuoi = pat.chain([f('kh'), f('hp'), f('lop')], { phatLai: false });

    function napHP() {
        if (!f('kh').value) { pat.fill(f('hp'), []); return Promise.resolve(); }
        return get('NS_ThongTinCanBo/LayDSHocPhanTinhKLGDTheoKhoaQL', { strKLGD_KeHoachChiTiet_Id: f('kh').value })
            .then(function (d) { pat.fill(f('hp'), d, { name: function (r) { return e(r.TEN) + ' - ' + e(r.MA); } }); chuoi.sync(); }).catch(function (err) { ums.api.handle(err, 'học phần'); });
    }
    function napLop() {
        if (!f('hp').value) { pat.fill(f('lop'), []); return Promise.resolve(); }
        return get('TKGG_KeHoach/LayDSLopHocPhanDuyet', { strKLGD_KeHoachChitiet_Id: f('kh').value, strDaoTao_HocPhan_Id: f('hp').value })
            .then(function (d) { pat.fill(f('lop'), d, { name: function (r) { return e(r.TENLOP) + ' - ' + e(r.MALOP); } }); chuoi.sync(); }).catch(function (err) { ums.api.handle(err, 'lớp học phần'); });
    }
    get('NS_ThongTinCanBo/LayDSKeHoachKLGDChiTiet', { strNguoiDung_Id: uid() }).then(function (d) {
        pat.fill(f('kh'), d, { name: 'TEN' });
        if (d.length === 1) { f('kh').value = d[0].ID; if (window.jQuery) jQuery(f('kh')).trigger('change.select2'); napHP(); }
        chuoi.sync();
    }).catch(function (err) { ums.api.handle(err, 'kế hoạch'); });
    if (window.jQuery) {
        jQuery(f('kh')).on('select2:select select2:clear', napHP);
        jQuery(f('hp')).on('select2:select select2:clear', napLop);
        jQuery(f('lop')).on('select2:select', function () { M.tai(); });
    }
    ums.report.mount(z('bc'), { collect: function (add) { add('strNCKH_TinhDiem_KeHoach_Id', f('kh').value); } });
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b) return;
        if (b.getAttribute('data-a') === 'search') M.tai();
        else if (b.getAttribute('data-a') === 'luu') M.luu();
    });
})();
