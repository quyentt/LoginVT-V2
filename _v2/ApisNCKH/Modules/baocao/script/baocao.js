/* Báo cáo (NCKH) — bản gốc RỖNG (baocao.html là khung HTML trống, baocao.js 0 byte). Chỉ hiện khung báo chưa có nội dung,
   không gọi API; các báo cáo thật nằm ở những mục cùng nhóm (Bài báo quốc tế, Sách, Đề tài…). */
(function () {
    var r = document.getElementById('nckh-baocao-baocao');
    if (!r) return;
    r.innerHTML = ums.pat.page('Báo cáo') + ums.pat.panel({ title: 'Báo cáo', icon: 'fa-file-lines',
        body: ums.ui.empty('Chức năng chưa có nội dung — bản gốc là trang trống. Các báo cáo nằm ở những mục khác cùng nhóm "Báo cáo".', 'fa-file-lines') });
})();
