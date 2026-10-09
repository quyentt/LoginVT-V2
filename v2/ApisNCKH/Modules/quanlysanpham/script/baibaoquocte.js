/* Bài báo quốc tế — bản XEM 2018 (danh sách + chi tiết, CHỈ XEM). Khung ums.nckhBB.xemMan (_bb_chung.js).
   Lời gọi chép nguyên: NCKH_TapChiQuocTe/LayDanhSach (strThanhVienDangKy_Id, strDMTapChiQuocTe_Id, strNhanSu_TDKT_KeHoach_Id…),
   NCKH_TapChiQuocTe_ThanhVien/LayDanhSach strTapChiQuocTe_Id; danh mục phân loại NCKH.TCQT. */
(function () {
    var r = document.getElementById('quanlysanpham-baibaoquocte');
    if (r) ums.nckhBB.xemMan(r, { tieuDe: 'Bài báo quốc tế', dsTieuDe: 'Danh sách bài báo quốc tế', ctl: 'NCKH_TapChiQuocTe', dmPhanLoai: 'NCKH.TCQT',
        khoaDM: 'strDMTapChiQuocTe_Id', coTDKT: true, coHeSo: true, coDOI: true,
        tvAction: 'NCKH_TapChiQuocTe_ThanhVien/LayDanhSach', tvKhoa: 'strTapChiQuocTe_Id' });
})();
