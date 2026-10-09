/* =========================================================================
   Nhập điểm chấm kiểm tra — bản Quản lý điểm
   Bản gốc: ApisQuanLyDiem/Modules/nhapdiem/script/nhapdiemchamkiemtra.js
   Khung chung: ums.nd.kiemTra (ApisCongCanBo/Modules/nhapdiem/script/_kiemtra.js — ghi chú lời gọi chung ở đó).
   ---------------------------------------------------------------------------
   Lệch bản cổng cán bộ (chép nguyên gốc Quản lý điểm):
     · Học phần: POST XLHV_TP_ChamKT_MH/DSA4CS4iESkgLwIpICwKFQPP · PKG_THI_PHACH_CHAMKT.LayHocPhanChamKT
       (strDaoTao_ThoiGianDaoTao_Id, strNguoiThucHien_Id), tên ô "TEN - MA".
     · Thời gian (TP_PhucKhao/LayThoiGianTheoDotThi) đọc cột DAOTAO_THOIGIANDAOTAO, KHÔNG tự chọn mục đầu.
     · Xác nhận: hộp KIỂU NÚT (ums.nd.xacNhanNut) — D_HanhDongXacNhan/LayDanhSach không gửi strDiem_DanhSachHoc_Id,
       Them_Diem_XacNhan gửi strThongTinXacNhan = ô "Nội dung" (gốc #txtNoiDungXacNhanSanPham).
   Giữ như gốc: ô "Nhập từ khóa tìm kiếm" của gốc không được gửi đi ở bất cứ lời gọi nào (bỏ ô, như bản cổng cán bộ).
   ========================================================================= */
(function () {
    'use strict';
    ums.nd.kiemTra(document.getElementById('qld-nhapdiemchamkiemtra'), {
        tieuDe: 'Nhập điểm chấm kiểm tra', loai: 'XACNHAN_HOANTHANH_CHAMKIEMTRA', xnNut: true,
        tgTen: 'DAOTAO_THOIGIANDAOTAO', chonDau: false,
        hpTen: function (x) { return (x.TEN == null ? '' : x.TEN) + ' - ' + (x.MA == null ? '' : x.MA); },
        hocPhan: { action: 'XLHV_TP_ChamKT_MH/DSA4CS4iESkgLwIpICwKFQPP', func: 'PKG_THI_PHACH_CHAMKT.LayHocPhanChamKT' },
        dsAction: 'TP_ChamKiemTra/LayDSThiChamKTNhapDiem', diemAction: 'TP_ChamKiemTra/LayDiemChamKT', luuAction: 'TP_ChamKiemTra/CapNhatThi_ChamKT_KetQua'
    });
})();
