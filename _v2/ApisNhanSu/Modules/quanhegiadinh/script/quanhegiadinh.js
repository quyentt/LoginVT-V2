/* =========================================================================
   Quan hệ gia đình — bản QUẢN TRỊ (Nhân sự): chọn cán bộ rồi xem/sửa
   Bản gốc: ApisNhanSu/Modules/quanhegiadinh/script/quanhegiadinh.js
   ---------------------------------------------------------------------------
   Bản gốc hai cột: trái "Danh sách cán bộ" (ums.nsQT.man), phải một tab
   "Quan hệ gia đình" (một tab → không vẽ dải tab), dòng "* Lưu ý: …", ba khung
       a) Về bản thân           NS_QT_QuanHeThanToc
       b) Về bên vợ (hoặc chồng) NS_QT_QuanHeVoChong
       c) Thân nhân ở nước ngoài NS_QT_ThanNhanNuocNgoai
   LayDanhSach GET (strNhanSu_HoSoCanBo_Id = cán bộ đang chọn) · LayChiTiet GET ·
   ThemMoi | CapNhat · Xoa (strIds). Dùng lại ums.ccbHS.quanhegiadinh(P) — các
   điểm Nhân sự khác Cổng cán bộ (địa chỉ bản thân → strQueQuan, quá trình cuối
   cùng NHANSU_QT_GD_QHGD, cột Năm định cư, không sắp HESO1) nằm sau cờ P.ns,
   ghi ở đầu tệp Cổng cán bộ.
   Bản gốc nạp NS.QHGD.CVHT vào ba ô dropCongViecHienTai_* không có trên màn → bỏ.
   ========================================================================= */
(function () {
    'use strict';

    ums.nsQT.man({
        el: document.getElementById('ns_quanhegiadinh'),
        title: 'Quan hệ gia đình',
        ghiChu: '* Lưu ý: Cần khai báo chi tiết đến ông/bà nếu cán bộ là đảng viên',
        mo: function (host, cb, P) { ums.nsQT.sections(host, ums.ccbHS.quanhegiadinh(P)); }
    });
})();
