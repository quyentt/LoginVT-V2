/* =========================================================================
   Đơn vị phí theo lớp (lớp × thời gian, ô = tổng số tiền)
   Bản gốc: ApisTaiChinh/Modules/khaidonviphi/scripts/donviphilop.js
   ---------------------------------------------------------------------------
   Khuôn dựng chung ở scripts/_chung.js — ĐỌC CHÚ THÍCH ĐẦU TỆP ĐÓ: bản gốc
   không vẽ được bảng, luồng đã được nối lại theo donviphimoict.js.
   Riêng màn lớp: bỏ nút "Kế thừa" (chỉ mở hộp xác nhận rỗng, save_KeThua
   không bao giờ được gọi). Tiêu đề bảng gốc thiếu cột Lớp (3 tiêu đề cho 4
   cột dữ liệu) — ở đây đủ Hệ / Khóa / Chương trình / Lớp.
   ========================================================================= */
(function () {
    'use strict';
    ums.khaidonviphi.donViPhi({ root: document.getElementById('donviphilop'), title: 'Đơn vị phí theo lớp', kind: 'lop' });
})();
