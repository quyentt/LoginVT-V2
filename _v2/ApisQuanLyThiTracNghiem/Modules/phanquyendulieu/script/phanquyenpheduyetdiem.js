/* =========================================================================
   Phân quyền phê duyệt dữ liệu điểm, NHCH (thi trắc nghiệm) — người dùng × đơn vị, hai bảng mức phê duyệt (NHCH, Điểm)
   Bản gốc: ApisQuanLyThiTracNghiem/modules/phanquyendulieu/html/phanquyenpheduyetdiem.html + script/phanquyenpheduyetdiem.js
   Toàn bộ khung, lời gọi, điểm khác gốc: script/_pq.js (ums.qlttnPq, kiểu 'pheduyet').
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('qlttn-phanquyenpheduyetdiem');
    if (!root) return;
    ums.qlttnPq.man(root, { kieu: 'pheduyet' });
})();
