/* Dữ liệu mẫu riêng của Phê duyệt kết quả / Ra quyết định (ums.xlhv) — chỉ dùng ở chế độ dựng thử.
   Danh sách, thanh lọc, đổi mức: dùng dữ liệu mẫu của ums.xlhvKQ (thuchienxulyhocvu/script/_ketqua.demo.js). */
(function () {
    function dm(id, ma, ten, icon, mau, heso) { return { ID: id, MA: ma, TEN: ten, THONGTIN1: icon, THONGTIN2: mau, HESO1: heso, CHUNG_TENDANHMUC_TEN: 'Tình trạng xác nhận' }; }
    ums.demo.add({
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#XLHV.XNKK': [
            dm('XN1', 'DONGY', 'Đồng ý', 'fa fa-check-circle', 'color:#198754', 1),
            dm('XN2', 'KHONGDONGY', 'Không đồng ý', 'fa fa-times-circle', 'color:#dc3545', 2),
            dm('XN3', 'XEMLAI', 'Xem lại', 'fa fa-refresh', 'color:#e8590c', 3)],
        'XLHV_PheDuyetKetQua/ThemMoi': []
    });
})();
