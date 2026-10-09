/* Thu hồ sơ (bản cũ) — bản gốc ApisNhapHoc/Modules/thuhoso/scripts/thuhoso.js.
   Khác bản mới: API kiểu cũ (NH_ThongTin, NH_DinhMuc_Chung, NH_ThongKe — GET), khối Tài chính luôn hiện,
   dòng phụ người học chỉ có SBD. Xử lý ở _thuhoso.js (ums.nhThuHoSo, cờ cu). */
(function () {
    'use strict';
    var root = document.getElementById('thuhoso');
    if (root) ums.nhThuHoSo.man(root, { title: 'Thu hồ sơ (bản cũ)', cu: true });
})();
