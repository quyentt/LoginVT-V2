/* =========================================================================
   Phân quyền nhóm câu hỏi (thi trắc nghiệm) — người dùng × nhóm câu hỏi, bảng "chưa phân quyền" lọc theo đơn vị
   Bản gốc: ApisQuanLyThiTracNghiem/modules/phanquyendulieu/html/phanquyendulieugroupquestion.html + script/phanquyendulieugroupquestion.js
   Toàn bộ khung, lời gọi, điểm khác gốc: script/_pq.js (ums.qlttnPq, kiểu 'nhom').
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('qlttn-phanquyendulieugroupquestion');
    if (!root) return;
    ums.qlttnPq.man(root, { kieu: 'nhom' });
})();
