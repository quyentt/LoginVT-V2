/* =========================================================================
   Lớp học phần — Học lại thi lại › Lập danh sách
   Bản gốc: ApisHocLaiThiLai/Modules/lapdanhsach/html/lophocphan.html + script/lophocphan.js
   (bản chép của dangky/lophocphan — .js khác đúng hai chỗ GET → POST, .html khác màu nút).
   Toàn bộ màn nằm ở ../../dangky/script/_lhp.js (ums.hltlLhp.man).
   Bản này: "Xem danh sách lớp học phần" gửi POST; "đăng ký chi tiết" gửi type = 'POST'
   (HTTP vẫn GET như gốc); nút xem lớp xanh lá, xem chi tiết xanh dương, "Tạo dữ liệu thi lại" xanh lá.
   ========================================================================= */
(function () {
    'use strict';
    ums.hltlLhp.man(document.getElementById('lophocphan'), { kieu: 'lapdanhsach' });
})();
