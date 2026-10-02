/* Tiêu chí thưởng CVQL — bản gốc RỖNG (html là khung <html> trống, .js 0 byte). Chỉ hiện khung báo chưa có nội dung, không gọi API. */
(function () {
    var r = document.getElementById('dgpl-ltt-tieuchithuong_cvql');
    if (!r) return;
    r.innerHTML = ums.pat.page('Tiêu chí thưởng CVQL') + ums.pat.panel({ title: 'Tiêu chí thưởng chức vụ quản lý', icon: 'fa-award',
        body: ums.ui.empty('Chức năng chưa có nội dung — bản gốc là trang trống, đang chờ nghiệp vụ mô tả.', 'fa-award') });
})();
