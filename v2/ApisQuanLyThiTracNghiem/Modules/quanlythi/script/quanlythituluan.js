/* =========================================================================
   Quản lý thi tự luận (Quản lý thi trắc nghiệm)
   Bản gốc: ApisQuanLyThiTracNghiem/modules/quanlythi/html/quanlythituluan.html + script/quanlythituluan.js
   Toàn bộ ở khung chung ums.qlttnTL (_tuluan.js, kieu 'ql') — lời gọi, cột, khác gốc ghi ở đầu tệp đó.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('qlttn-quanlythituluan');
    if (!root) return;
    ums.qlttnTL.man(root, { kieu: 'ql', tieuDe: 'Quản lý thi tự luận' });
})();
