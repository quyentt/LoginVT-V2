/* =========================================================================
   Đơn vị phí theo khoá (khoá × thời gian, ô = tổng số tiền)
   Bản gốc: ApisTaiChinh/Modules/khaidonviphi/scripts/donviphikhoa.js
   ---------------------------------------------------------------------------
   Khuôn dựng chung ở scripts/_chung.js — ĐỌC CHÚ THÍCH ĐẦU TỆP ĐÓ: bản gốc
   không vẽ được bảng, luồng đã được nối lại theo donviphimoict.js.
   Riêng màn khoá: HTML gốc không có ô Khoá / Chương trình nhưng nút Thêm mới
   vẫn đòi đủ Hệ - Khoá - Chương trình → không bao giờ thêm được. Ở đây chỉ
   đòi Hệ.
   ========================================================================= */
(function () {
    'use strict';
    ums.khaidonviphi.donViPhi({ root: document.getElementById('donviphikhoa'), title: 'Đơn vị phí theo khoá', kind: 'khoa' });
})();
