/* Bài báo trong nước — bản XEM 2018 (danh sách + chi tiết, CHỈ XEM). Khung ums.nckhBB.xemMan (_bb_chung.js).
   Gần như chép baibaoquocte: gửi versionAPI 'v1.0', strDMTapChiQuocGia_Id, không strNhanSu_TDKT_KeHoach_Id; tên bài báo IN HOA;
   thành viên NCKH_TapChiQuocGia_ThanhVien/LayDanhSach strTapChiQuocGia_Id; phân loại NCKH.TCQG. Gốc nạp các ô lọc vào id không
   tồn tại (ô trống) và đổ lĩnh vực vào nhãn sai id → làm theo ý định. Nhãn "Hệ số IF" gốc không đổ gì → để trống như gốc. */
(function () {
    var r = document.getElementById('quanlysanpham-baibaotrongnuoc');
    if (r) ums.nckhBB.xemMan(r, { tieuDe: 'Bài báo trong nước', dsTieuDe: 'Danh sách bài báo trong nước', ctl: 'NCKH_TapChiQuocGia', dmPhanLoai: 'NCKH.TCQG',
        khoaDM: 'strDMTapChiQuocGia_Id', versionAPI: 'v1.0', hoa: true, nhanTap: 'Tập bài báo', nhanTrichDan: 'Trích dẫn Pubmet',
        tvAction: 'NCKH_TapChiQuocGia_ThanhVien/LayDanhSach', tvKhoa: 'strTapChiQuocGia_Id' });
})();
