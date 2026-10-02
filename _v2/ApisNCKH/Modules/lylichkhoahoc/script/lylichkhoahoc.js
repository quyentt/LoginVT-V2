/* Lý lịch khoa học — bản gốc RỖNG (html trống, .js 0 byte). Chỉ hiện khung báo chưa có nội dung; chờ nghiệp vụ mô tả. */
(function () {
    var r = document.getElementById('nckh-lylichkhoahoc');
    if (!r) return;
    r.innerHTML = ums.pat.page('Lý lịch khoa học') + ums.pat.panel({ title: 'Lý lịch khoa học', icon: 'fa-id-card',
        body: ums.ui.empty('Chức năng chưa có nội dung — bản gốc là trang trống, đang chờ nghiệp vụ mô tả.', 'fa-id-card') });
})();
