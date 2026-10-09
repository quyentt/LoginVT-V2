/* =========================================================================
   Báo cáo tài chính (Nhập học)
   Bản gốc: ApisNhapHoc/Modules/baocaothongke/html/baocao.html + scripts/baocao.js
   ---------------------------------------------------------------------------
   Khung chung ums.nhBc (baocaothongke/scripts/_chung.js) + bộ lọc ums.nhTk (thongke/scripts/_chung.js).
   Lời gọi (chép nguyên):
     PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc · getList_ChuongTrinhDaoTao · getList_LopQuanLy ·
     TC_KhoanThu/LayDanhSach (GET) · getList_CoSoDaoTao — xem thongke/scripts/_chung.js
     SYS_Import_PhanQuyen/LayDanhSach (GET) { strTuKhoa, strNguoiTao_Id, strUngDung_Id = vai trò (appId),
       strChucNang_Id, strNguoiDung_Id, strMauImport_Id, pageIndex 1, pageSize 100000 } → MAUIMPORT_MA / MAUIMPORT_TENFILEMAU;
       có dòng thì THAY bốn mẫu viết sẵn (M1–M4) của html gốc, rỗng thì giữ bốn mẫu đó.
     Tải xuống: edu.system.report(<mã>, "", addKeyValue) — strKeHoach_Id (các kế hoạch đang chọn, trống = id người dùng),
       strChuongTrinh_Id, strLopHoc_Id, strLoaiKhoan_Id, strCoSoDT, strTuKhoa "", strTuNgay, strDenNgay.
   Bỏ: khối nút btnExportM1..M4_BC đã chú thích bỏ trong gốc.
   ========================================================================= */
(function () {
    'use strict';
    var r = document.getElementById('nh-baocao');
    if (!r) return;
    ums.nhBc.man(r, {
        tieuDe: 'Báo cáo tài chính', loai: 'TÀI CHÍNH', nguon: true,
        mau: [
            { ma: 'M1', ten: 'Bảng tổng hợp các khoản' },
            { ma: 'M2', ten: 'Bảng tổng hợp theo sinh viên' },
            { ma: 'M3', ten: 'Bảng tổng hợp chi tiết từng khoản' },
            { ma: 'M4', ten: 'Thống kê dữ liệu khoản thu nhập học theo lớp' }
        ]
    });
})();
