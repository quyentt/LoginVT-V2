/* =========================================================================
   Thu tiền
   Bản gốc: ApisTaiChinh/Modules/phieuthu/scripts/thutien.js (6.914 dòng)
   ---------------------------------------------------------------------------
   Toàn bộ nghiệp vụ nằm ở lõi dùng chung với viewthutien:
       _chung_thutien.js          tìm sinh viên, bảng khoản, tính tiền, viết phiếu
       _chung_thutien.phieu.js    lưu chứng từ, thu tiền, HĐĐT, xem/in, huỷ biên lai
       _chung_thutien.chitiet.js  tình hình học phí, sửa/xoá khoản, thu hộ
   Danh sách lời gọi, phép tính tiền và chỗ khác bản gốc: đầu _chung_thutien.js.
   Biến thể "thutien" (bảng BIEN_THE): đủ tính năng — ngày chứng từ, đơn vị
   tính từng dòng, cân đối, QR, HĐĐT, huỷ biên lai, sửa/xoá khoản.
   ========================================================================= */
(function () {
    'use strict';
    ums.phieuthu.thuTien.mount(document.getElementById('thutien'), 'thutien');
})();
