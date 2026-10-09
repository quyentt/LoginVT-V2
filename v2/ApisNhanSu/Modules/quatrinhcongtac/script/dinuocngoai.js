/* =========================================================================
   Đi nước ngoài — bản QUẢN TRỊ (Nhân sự): chọn cán bộ rồi xem/sửa
   Bản gốc: ApisNhanSu/Modules/quatrinhcongtac/script/dinuocngoai.js
   ---------------------------------------------------------------------------
   Bản gốc hai cột: trái "Danh sách cán bộ" (ums.nsQT.man), phải khung của
   cán bộ đang chọn. Lời gọi, tham số, cột, ô bắt buộc TRÙNG bản Cổng cán bộ
   (ApisCongCanBo/Modules/quatrinhcongtac/script/dinuocngoai.js), chỉ khác
   strNhanSu_HoSoCanBo_Id = cán bộ đang chọn (me.strNhanSu_Id) → dùng lại
   ums.ccbHS.dinuocngoai(P).
   Khác Cổng cán bộ (cờ P.ns): sửa thì lấy NS_QT_CongTacNuocNgoai/LayChiTiet (strId) như
   getDetail_DiNuocNgoai của bản gốc Nhân sự (Cổng cán bộ lấy dòng từ danh sách).
   Lưới "Quyết định": strThanhVien_Id / strNhanSu_HoSoCanBo_Id = cán bộ đang chọn.
   ========================================================================= */
(function () {
    'use strict';

    ums.nsQT.man({
        el: document.getElementById('ns_dinuocngoai'),
        title: 'Đi nước ngoài',
        mo: function (host, cb, P) { ums.nsQT.crud(host, ums.ccbHS.dinuocngoai(P)); }
    });
})();
