/* =========================================================================
   Các môn học đã giảng dạy — bản QUẢN TRỊ (Nhân sự): chọn cán bộ rồi xem/sửa
   Bản gốc: ApisNhanSu/Modules/quatrinhcongtac/script/cacmonhocdagiangday.js
   ---------------------------------------------------------------------------
   Bản gốc hai cột: trái "Danh sách cán bộ" (ums.nsQT.man), phải khung của
   cán bộ đang chọn. Lời gọi, tham số, cột, ô bắt buộc TRÙNG bản Cổng cán bộ
   (ApisCongCanBo/Modules/quatrinhcongtac/script/cacmonhocdagiangday.js), chỉ khác
   strNhanSu_HoSoCanBo_Id = cán bộ đang chọn (me.strNhanSu_Id) → dùng lại
   ums.ccbHS.cacmonhocdagiangday(P).
   Bản gốc Nhân sự nạp thêm NS.NHIEMVUCHIENLUOC vào dropNhiemVu và viewFiles(txtThongTinDinhKem)
   — cả hai vùng KHÔNG có trên màn (chép từ màn khác) → bỏ.
   ========================================================================= */
(function () {
    'use strict';

    ums.nsQT.man({
        el: document.getElementById('ns_cacmonhocdagiangday'),
        title: 'Các môn học đã giảng dạy',
        mo: function (host, cb, P) { ums.nsQT.crud(host, ums.ccbHS.cacmonhocdagiangday(P)); }
    });
})();
