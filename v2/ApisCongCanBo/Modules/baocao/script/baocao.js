/* =========================================================================
   Báo cáo cá nhân — lưới nút báo cáo
   Bản gốc: ApisCongCanBo/Modules/baocao/script/baocao.js
   ---------------------------------------------------------------------------
   Danh mục CCB.BCTK (sắp theo HESO1): mỗi mục một nút —
       MA        mã báo cáo (edu.system.report(MA, …))
       THONGTIN1 lớp biểu tượng (Font Awesome 4, vd "fa fa-file-text-o")
       THONGTIN2 style của biểu tượng (vd màu) — do quản trị nhập
       THONGTIN3 đường dẫn trang báo cáo riêng (rỗng thì dùng mặc định)
   Bấm → ums.report.run (SYS_Report/ThemMoi) kèm strNhanSu_Id, strNguoiDangNhap_Id = userId.
   Bỏ report_CaNhan của bản gốc (không nơi nào gọi).
   Biểu tượng FA4 đổi tiền tố sang fa-light như menu — tên đã đổi ở FA7 sẽ hiện trống
   (cùng việc hoãn với TENANH của menu).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('ccb-baocao');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function icon(c) { return ums.iconFA4(e(c)) || 'fa-light fa-file-chart-column'; }   // tên FA4 → FA7 (assets/js/icon-fa4.js)

    root.innerHTML = pat.page('Báo cáo', '') + '<div class="ums-grid ums-grid--tiles" data-z="ds">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>';
    var z = root.querySelector('[data-z="ds"]'), ds = [];

    ums.api.dm('CCB.BCTK', 'HESO1').then(function (rows) {
        ds = rows || [];
        z.innerHTML = ds.length ? ds.map(function (r, i) {
            return '<button type="button" class="ums-tile ums-tile--blue" data-bc="' + i + '" style="text-align:left;cursor:pointer">' +
                '<span class="ums-tile__icon"><i class="' + esc(icon(r.THONGTIN1)) + '"' + (r.THONGTIN2 ? ' style="' + esc(r.THONGTIN2) + '"' : '') + '></i></span>' +
                '<span class="ums-tile__body"><span class="ums-tile__name">' + esc(e(r.TEN)) + '</span></span></button>';
        }).join('') : ui.empty('Chưa có báo cáo nào được khai báo (danh mục CCB.BCTK)', 'fa-file-chart-column');
    }).catch(function (err) { z.innerHTML = ui.fail(err.message); ums.api.handle(err, 'tải danh sách báo cáo'); });

    z.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-bc]');
        if (!b) return;
        var r = ds[Number(b.getAttribute('data-bc'))];
        if (!r) return;
        ums.report.run(r.MA, {
            duongDan: e(r.THONGTIN3),
            collect: function (add) { add('strNhanSu_Id', uid()); add('strNguoiDangNhap_Id', uid()); }
        });
    });
})();
