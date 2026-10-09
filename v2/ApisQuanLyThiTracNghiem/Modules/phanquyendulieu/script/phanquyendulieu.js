/* =========================================================================
   Phân quyền dữ liệu (thi trắc nghiệm) — người dùng × đơn vị, mức phê duyệt NHCH
   Bản gốc: ApisQuanLyThiTracNghiem/modules/phanquyendulieu/html/phanquyendulieu.html + script/phanquyendulieu.js
   Toàn bộ khung, lời gọi, điểm khác gốc: script/_pq.js (ums.qlttnPq, kiểu 'donvi').
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('qlttn-phanquyendulieu');
    if (!root) return;
    ums.qlttnPq.man(root, { kieu: 'donvi' });
})();
