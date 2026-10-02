/* =========================================================================
   Quá trình sức khỏe — bản QUẢN TRỊ (Nhân sự): chọn cán bộ rồi xem/sửa
   Bản gốc: ApisNhanSu/Modules/quatrinhsuckhoe/script/quatrinhsuckhoe.js
   ---------------------------------------------------------------------------
   Bản gốc hai cột: trái "Danh sách cán bộ" (ums.nsQT.man), phải khung
   "Quá trình sức khỏe" của cán bộ đang chọn. Lời gọi, tham số, cột, ô bắt
   buộc TRÙNG bản Cổng cán bộ, chỉ khác strNhanSu_HoSoCanBo_Id = cán bộ đang
   chọn (me.strNhanSu_Id) → dùng lại ums.ccbHS.quatrinhsuckhoe(P).
       NS_QT_KhamSucKhoe/LayDanhSach GET · LayChiTiet GET · ThemMoi | CapNhat · Xoa (strIds)
       Thêm xong: ThietLapQuaTrinhCuoiCung "NHANSU_QT_KHAMSK".
   Bản gốc có nạp QLCB.NHMA vào dropNhomMau và viewFiles(txtThongTinDinhKem)
   cho hai vùng KHÔNG có trên màn — bỏ.
   ========================================================================= */
(function () {
    'use strict';

    ums.nsQT.man({
        el: document.getElementById('ns_quatrinhsuckhoe'),
        title: 'Quá trình sức khỏe',
        mo: function (host, cb, P) { ums.nsQT.crud(host, ums.ccbHS.quatrinhsuckhoe(P)); }
    });
})();
