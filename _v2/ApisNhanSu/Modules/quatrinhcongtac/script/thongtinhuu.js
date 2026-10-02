/* Thông tin hưu — bản gốc RỖNG (html trống, .js 0 byte). Chỉ hiện khung báo chưa có nội dung; chờ nghiệp vụ.
   (Thông tin nghỉ hưu có màn riêng: ApisNhanSu/Modules/nghihuu.) */
(function () {
    var r = document.getElementById('ns_thongtinhuu');
    if (!r) return;
    r.innerHTML = ums.pat.page('Thông tin hưu') + ums.pat.panel({ title: 'Thông tin hưu', icon: 'fa-user-clock',
        body: ums.ui.empty('Chức năng chưa có nội dung — bản gốc là trang trống, đang chờ nghiệp vụ mô tả.', 'fa-user-clock') });
})();
