/* Rút tiền (trên menu) — bản gốc ApisNhapHoc/Modules/ruttien/scripts/ruttiennew.js.
   Toàn bộ xử lý ở _ruttien.js (ums.nhRutTien) — xem chú thích đầu tệp đó (kèm lỗi gốc đã sửa). */
(function () {
    'use strict';
    var root = document.getElementById('ruttiennew');
    if (root) ums.nhRutTien.man(root, { title: 'Rút tiền', cu: false });
})();
