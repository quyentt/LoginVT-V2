/* =========================================================================
   Nhập điểm phúc khảo — bản Quản lý điểm
   Bản gốc: ApisQuanLyDiem/Modules/nhapdiem/script/nhapdiemphuckhao.js
   Khung chung: ums.nd.kiemTra (ApisCongCanBo/Modules/nhapdiem/script/_kiemtra.js — ghi chú lời gọi chung ở đó).
   ---------------------------------------------------------------------------
   Lệch bản cổng cán bộ (chép nguyên gốc Quản lý điểm):
     · MỘT bảng (không chia ba bảng theo PHANLOAI), cột Mã số / Họ đệm / Tên / Học phần / Kết quả; điểm hiện và gửi
       nguyên văn (không đổi sang "7,5").
     · Học phần: GET TP_PhucKhao/LayHocPhanPhucKhao, tên ô "TEN - MA"; thời gian (cột THOIGIAN) KHÔNG tự chọn mục đầu.
     · Xác nhận: hộp KIỂU NÚT (ums.nd.xacNhanNut) + ô "Nội dung" (strThongTinXacNhan).
     · Báo cáo / Import theo mẫu: vùng zonebtnBaoCao_DPK (strDaoTao_ThoiGianDaoTao_Id, strDaoTao_HocPhan_Id).
   Không chép (lỗi rõ của gốc): nút #btnDongYXacNhan không có trong html (mã chết).
   Giữ như gốc: ô "Nhập từ khóa tìm kiếm" không được gửi đi (bỏ ô, như bản cổng cán bộ).
   ========================================================================= */
(function () {
    'use strict';
    ums.nd.kiemTra(document.getElementById('qld-nhapdiemphuckhao'), {
        tieuDe: 'Nhập điểm phúc khảo', loai: 'XACNHAN_HOANTHANH_PHUCKHAO', baoCao: true, baoCaoText: 'Xuất báo cáo', xnNut: true, chonDau: false,
        hpTen: function (x) { return (x.TEN == null ? '' : x.TEN) + ' - ' + (x.MA == null ? '' : x.MA); },
        hocPhan: { action: 'TP_PhucKhao/LayHocPhanPhucKhao', method: 'GET' },
        dsAction: 'TP_PhucKhao/LayDSThiPhucKhaoNhapDiem', diemAction: 'TP_PhucKhao/LayDiemPhucKhao', luuAction: 'TP_PhucKhao/CapNhatThi_PhucKhao_KetQua'
    });
})();
