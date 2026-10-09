/* =========================================================================
   Nhiệm vụ chiến lược — bản QUẢN TRỊ (Nhân sự): chọn cán bộ rồi xem/sửa
   Bản gốc: ApisNhanSu/Modules/quatrinhcongtac/script/nhiemvuchienluoc.js
   ---------------------------------------------------------------------------
   Bản gốc hai cột: trái "Danh sách cán bộ" (ums.nsQT.man), phải khung của
   cán bộ đang chọn. Lời gọi, tham số, cột, ô bắt buộc TRÙNG bản Cổng cán bộ
   (ApisCongCanBo/Modules/quatrinhcongtac/script/nhiemvuchienluoc.js), chỉ khác
   strNhanSu_HoSoCanBo_Id = cán bộ đang chọn (me.strNhanSu_Id) → dùng lại
   ums.ccbHS.nhiemvuchienluoc(P).
   Xoá: NS_QT_NhiemVuChienLuoc/Xoa (strIds) — bản gốc Nhân sự gọi y hệt Cổng cán bộ.
   Kiểm host 2026-09-25: máy chủ trả Success mà KHÔNG xoá (lỗi procedure) — việc dữ liệu.
   ========================================================================= */
(function () {
    'use strict';

    ums.nsQT.man({
        el: document.getElementById('ns_nhiemvuchienluoc'),
        title: 'Nhiệm vụ chiến lược',
        mo: function (host, cb, P) { ums.nsQT.crud(host, ums.ccbHS.nhiemvuchienluoc(P)); }
    });
})();
