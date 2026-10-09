/* Tra cứu phiếu rút (Nhập học) — bản gốc RỖNG: html là khung trang ASPX trống, .js 0 byte.
   Chỉ hiện khung báo chưa có nội dung; không gọi API. (Tra cứu phiếu rút của Tài chính nằm ở
   ApisTaiChinh/Modules/phieurut — khác phân hệ, không nạp chéo vì bản gốc Nhập học không có gì để bám.) */
(function () {
    var r = document.getElementById('nh-tracuuphieurut');
    if (!r) return;
    r.innerHTML = ums.pat.page('Tra cứu phiếu rút') + ums.pat.panel({ title: 'Danh sách phiếu rút', icon: 'fa-file-invoice',
        body: ums.ui.empty('Chức năng chưa có nội dung — bản gốc là trang trống, đang chờ nghiệp vụ mô tả.', 'fa-file-invoice') });
})();
