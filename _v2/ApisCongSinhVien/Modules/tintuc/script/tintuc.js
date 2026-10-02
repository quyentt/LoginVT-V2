/* =========================================================================
   Bảng tin (Cổng sinh viên)
   Bản gốc: ApisCongSinhVien/Modules/tintuc/html/tintuc.html + script/tintuc.js
   ---------------------------------------------------------------------------
   Toàn bộ mã nằm ở khung dùng chung `_tintuc.js` (ums.csvTinTuc) vì màn này và
   `tintuc1` nạp CHUNG một tệp .js gốc. Riêng màn này có thêm khối THÔNG BÁO
   viết cứng ngay trong HTML gốc → `thongBao: true`.
   Xem chú thích đầu `_tintuc.js` để biết lời gọi, cột trả về, chỗ khác bản gốc.
   ========================================================================= */
(function () {
    'use strict';
    ums.csvTinTuc.man(document.getElementById('csv-tintuc'), { thongBao: true });
})();
