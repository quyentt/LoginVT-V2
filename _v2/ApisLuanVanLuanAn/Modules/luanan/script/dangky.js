/* =========================================================================
   Đăng ký chuyên đề (luanan/dangky)
   Bản gốc: ApisLuanVanLuanAn/Modules/luanan/html/dangky.html + script/dangky.js
   Giống luanvan/dangkydecuong 91% — bố cục một cột: thanh lọc (Kế hoạch · từ khoá) → "Danh sách đăng ký" → biểu mẫu thay chỗ
   (Thông tin học viên | Thông tin chuyên đề). Khung: ums.lvla.man (luanvan/script/_lv_chung.js).
   Lời gọi (chép nguyên, strNguoiThucHien_Id / strChucNang_Id hệ tự chèn):
       LVLA_DangKy_ChuyenDe/LayDanhSach GET strTuKhoa · strQLSV_NguoiHoc_Id '' · strNguoiDangKy_Id '' · strLVLA_KeHoach_ChuyenDe_Id · pageIndex · pageSize
       LVLA_DangKy_ChuyenDe/ThemMoi | CapNhat POST strId · strLVLA_KeHoach_ChuyenDe_Id · strQLSV_NguoiHoc_Id · strNguoiDangKy_Id (userId)
            · strNgayDangKy · strTenTiengViet · strTenTiengAnh · strPhanLoai_Id · strMoTa
       Phân loại: danh mục LVLA.PLCD · Kế hoạch: LVLA_KeHoach_ChuyenDe/LayDanhSach
       Cột: QLSV_NGUOIHOC_MASO/HOTEN · DAOTAO_LOPQUANLY_TEN · DAOTAO_CHUONGTRINH_TEN · DAOTAO_KHOADAOTAO_TEN · TENTIENGVIET
            · PHANLOAI_TEN/ID · MOTA · LVLA_KEHOACH_CHUYENDE_ID
   Khác luanvan/dangkydecuong (theo gốc luanan): không có nút Import, không có lưới "Danh sách hướng dẫn" (khối bị chú thích ở gốc),
       thêm ô / cột Phân loại. Khác gốc chung: xem _lv_chung.js (biểu mẫu trong trang, nhớ ID sau khi lưu, học viên bắt buộc,
       Hệ → Khóa → Chương trình → Lớp → Học viên khoá ở chế độ sửa).
   Cố ý bỏ: nút "Xóa" (btnDelete display:none) và delete_DangKy; lưới thành viên / hệ-khóa bị chú thích (save_/delete_DangKy_ThanhVien, HeKhoa);
       iThuTu (đọc ô txtAAAA không có); mã chết liệt kê ở _lv_chung.js.
   ========================================================================= */
(function () {
    'use strict';
    var L = ums.lvla;
    var root = document.getElementById('lvla-luanan-dangky');
    if (!root) return;
    L.man(root, {
        title: 'Đăng ký chuyên đề', listTitle: 'Danh sách đăng ký', formTitle: 'Đăng ký chuyên đề',
        P: 'LVLA_DangKy_ChuyenDe/', canAdd: true, phanLoai: 'LVLA.PLCD',
        keHoach: { action: 'LVLA_KeHoach_ChuyenDe/LayDanhSach' },
        khoaKH: { param: 'strLVLA_KeHoach_ChuyenDe_Id', col: 'LVLA_KEHOACH_CHUYENDE_ID' }
    });
})();
