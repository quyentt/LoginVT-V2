/* =========================================================================
   Xem thu tiền
   Bản gốc: ApisTaiChinh/Modules/phieuthu/scripts/viewthutien.js (3.678 dòng)
   ---------------------------------------------------------------------------
   Bản gốc là phiên bản cũ của thutien.js (cùng bố cục và lời gọi, ít tính
   năng hơn), nên dùng chung lõi _chung_thutien*.js với biến thể
   "viewthutien" (bảng BIEN_THE trong _chung_thutien.js). Khác thutien:
     · tình trạng tài chính: TC_ThongTinChung/LayDanhSach
     · không tự nhảy tab nợ chung, không QR, không ngày chứng từ, không
       đơn vị tính từng dòng, không cân đối, không sửa/xoá khoản, không báo cáo
     · bảng khoản thừa không cho nhập quá số tiền gốc
     · "Xuất hóa đơn" có ở khoản nợ (thu) và ở thu trước (cả thu lẫn rút)
   Cố ý bỏ (lỗi bản gốc): nút "Thu tiền" (gọi save_ThuTien không có trong
   ViewPhieuThu → lỗi JS), các nút HĐĐT (không gắn sự kiện), nút "Xem thông
   tin" (không gắn sự kiện), "Hủy biên lai" (đã comment trong bản gốc).
   ========================================================================= */
(function () {
    'use strict';
    ums.phieuthu.thuTien.mount(document.getElementById('viewthutien'), 'viewthutien');
})();
