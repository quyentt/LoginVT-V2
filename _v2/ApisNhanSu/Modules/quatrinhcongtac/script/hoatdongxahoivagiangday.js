/* =========================================================================
   Hoạt động xã hội và giảng dạy — bản QUẢN TRỊ (Nhân sự): chọn cán bộ rồi xem/sửa
   Bản gốc: ApisNhanSu/Modules/quatrinhcongtac/script/hoatdongxahoivagiangday.js
   ---------------------------------------------------------------------------
   Bản gốc hai cột: trái "Danh sách cán bộ" (ums.nsQT.man), phải khung của
   cán bộ đang chọn. Lời gọi, tham số, cột, ô bắt buộc TRÙNG bản Cổng cán bộ
   (ApisCongCanBo/Modules/quatrinhcongtac/script/hoatdongxahoi_giangday.js), chỉ khác
   strNhanSu_HoSoCanBo_Id = cán bộ đang chọn (me.strNhanSu_Id) → dùng lại
   ums.ccbHS.hoatdongxahoi_giangday(P).
   Tên tệp khác bản Cổng cán bộ (hoatdongxahoivagiangday ↔ hoatdongxahoi_giangday).
   Bản gốc Nhân sự nạp NS.NHIEMVUCHIENLUOC vào dropNhiemVu không có trên màn → bỏ.
   ========================================================================= */
(function () {
    'use strict';

    ums.nsQT.man({
        el: document.getElementById('ns_hoatdongxahoivagiangday'),
        title: 'Hoạt động xã hội và giảng dạy',
        mo: function (host, cb, P) { ums.nsQT.crud(host, ums.ccbHS.hoatdongxahoi_giangday(P)); }
    });
})();
