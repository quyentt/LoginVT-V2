/* =========================================================================
   Duyệt điểm thi tự luận (Quản lý thi trắc nghiệm)
   Bản gốc: ApisQuanLyThiTracNghiem/modules/quanlythi/html/duyetdiemthituluan.html + script/duyetdiemthituluan.js
   Toàn bộ ở khung chung ums.qlttnTL (_tuluan.js, kieu 'duyet': cột điểm từng giảng viên chấm, điểm so sánh, lưu bằng
   Sua_CongNhanDiem) — lời gọi, cột, khác gốc ghi ở đầu tệp đó.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('qlttn-duyetdiemthituluan');
    if (!root) return;
    ums.qlttnTL.man(root, { kieu: 'duyet', tieuDe: 'Duyệt điểm thi tự luận' });
})();
