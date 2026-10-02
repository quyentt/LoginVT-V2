/* Ngày thu — bản gốc RỖNG (html chỉ có khung trống, .js chỉ gọi edu.system.page_load). Hiện khung báo chưa có nội dung. */
(function () {
    'use strict';
    var r = document.getElementById('nh-ngaythu');
    if (!r) return;
    r.innerHTML = ums.pat.page('Ngày thu') + ums.pat.panel({ title: 'Thống kê theo ngày thu', icon: 'fa-calendar-day',
        body: ums.ui.empty('Chức năng chưa có nội dung — bản gốc là trang trống, đang chờ nghiệp vụ mô tả.', 'fa-calendar-day') });
})();
