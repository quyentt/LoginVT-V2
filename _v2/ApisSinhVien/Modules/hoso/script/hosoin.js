/* =========================================================================
   In hồ sơ (phân hệ Sinh viên) — bản gốc RỖNG
   Bản gốc: ApisSinhVien/Modules/hoso/html/hoso_in.html (chỉ dấu BOM, không nạp .js nào);
            script/hosoin.js cũng rỗng và không nơi nào nạp (đã dò toàn bộ các phân hệ Apis, Core, Corei).
   Chỉ hiện khung báo chưa có nội dung, không gọi API; chờ nghiệp vụ mô tả
   (hoặc gỡ khỏi menu).
   ========================================================================= */
(function () {
    'use strict';
    var r = document.getElementById('sv-hosoin');
    if (!r) return;
    r.innerHTML = ums.pat.page('In hồ sơ') + ums.pat.panel({ title: 'In hồ sơ', icon: 'fa-print',
        body: ums.ui.empty('Chức năng chưa có nội dung — bản gốc là trang trống, đang chờ nghiệp vụ mô tả.', 'fa-print') });
})();
