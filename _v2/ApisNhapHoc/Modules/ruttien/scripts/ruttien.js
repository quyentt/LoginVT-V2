/* Rút tiền (bản cũ) — bản gốc ApisNhapHoc/Modules/ruttien/scripts/ruttien.js.
   Khác bản mới: các khoản đã thu lấy qua NH_DinhMuc_Chung/LayDSKhoanDaThuNhapHoc (GET, không gửi kế hoạch),
   rút qua NH_NguoiHoc_ThongTinTuyenSinh/NhapHoc_RutTien. Xử lý ở _ruttien.js (ums.nhRutTien, cờ cu). */
(function () {
    'use strict';
    var root = document.getElementById('ruttien');
    if (root) ums.nhRutTien.man(root, { title: 'Rút tiền (bản cũ)', cu: true });
})();
