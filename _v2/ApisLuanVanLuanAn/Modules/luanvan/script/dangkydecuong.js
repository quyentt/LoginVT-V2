/* =========================================================================
   Đăng ký đề cương (luanvan/dangkydecuong)
   Bản gốc: ApisLuanVanLuanAn/Modules/luanvan/html/dangkydecuong.html (250 dòng) + script/dangkydecuong.js (1.063 dòng)
   Bố cục gốc một cột: thanh lọc (Kế hoạch · từ khoá · Tìm kiếm · Import) → "Danh sách đăng ký" → khung biểu mẫu thay chỗ
   (Thông tin học viên | Thông tin đề cương | Danh sách hướng dẫn). Bản mới: ums.lvla.man (xem _lv_chung.js).
   Lời gọi (chép nguyên, strNguoiThucHien_Id / strChucNang_Id hệ tự chèn):
       LVLA_DeCuong_DangKy/LayDanhSach GET strTuKhoa · strQLSV_NguoiHoc_Id '' · strNguoiDangKy_Id '' · strLVLA_KeHoach_DeCuong_Id · pageIndex · pageSize
       LVLA_DeCuong_DangKy/ThemMoi | CapNhat POST strId · strLVLA_KeHoach_DeCuong_Id · strQLSV_NguoiHoc_Id · strNguoiDangKy_Id (userId)
            · strNgayDangKy · strTenTiengViet · strTenTiengAnh · strMoTa
       LVLA_DeCuong_DangKy_HuongDan/LayDanhSach GET strTuKhoa '' · strNguoiDung_Id '' · strLVLA_KeHoach_DeCuong_Id (của dòng)
            · strLVLA_DeCuong_DangKy_Id · pageIndex 1 · pageSize 100000;  ThemMoi | CapNhat POST strId · strLVLA_DeCuong_DangKy_Id · strVaiTro_Id
            · strNguoiHuongDan_Id · strLVLA_KeHoach_DeCuong_Id · strQLSV_NguoiHoc_Id · strMoTa (ô Mô tả của đề cương);  Xoa strIds
       Vai trò: danh mục LVLA.VTHD · Kế hoạch: LVLA_KeHoach_DeCuong/LayDanhSach · Cột: QLSV_NGUOIHOC_MASO/HOTEN · DAOTAO_LOPQUANLY_TEN
            · DAOTAO_CHUONGTRINH_TEN · DAOTAO_KHOADAOTAO_TEN · TENTIENGVIET · MOTA; người HD: NGUOIHUONGDAN_ID/HOTEN/COQUANCONGTAC · VAITRO_ID
   Cố ý bỏ: nút "Xóa" (btnDelete display:none, không có đường nào hiện) và delete_DangKyDeCuong; mã chết liệt kê ở _lv_chung.js.
   Khác gốc: xem _lv_chung.js (biểu mẫu trong trang, nhớ ID sau khi lưu, học viên bắt buộc). Ô Hệ/Khóa/Chương trình/Lớp/Học viên khoá
       ở chế độ sửa như gốc (readonlyselect2); chưa chọn tầng trên thì khoá tầng dưới (luật cha → con).
   ========================================================================= */
(function () {
    'use strict';
    var L = ums.lvla, H = 'LVLA_DeCuong_DangKy_HuongDan/';
    var root = document.getElementById('lvla-luanvan-dangkydecuong');
    if (!root) return;
    L.man(root, {
        title: 'Đăng ký đề cương', listTitle: 'Danh sách đăng ký', formTitle: 'Đăng ký đề cương',
        P: 'LVLA_DeCuong_DangKy/', canAdd: true, import: true,
        nguoi: [{
            title: 'Danh sách hướng dẫn', icon: 'fa-chalkboard-user', vaiTro: 'LVLA.VTHD', xoa: H + 'Xoa',
            list: function (row) {
                return { action: H + 'LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiDung_Id: '',
                    strLVLA_KeHoach_DeCuong_Id: L.e(row.LVLA_KEHOACH_DECUONG_ID), strLVLA_DeCuong_DangKy_Id: row.ID, pageIndex: 1, pageSize: 100000 };
            },
            map: function (r) { return { ID: r.ID, pid: r.NGUOIHUONGDAN_ID, ten: r.NGUOIHUONGDAN_HOTEN, coQuan: r.NGUOIHUONGDAN_COQUANCONGTAC, vt: r.VAITRO_ID, vtTen: r.VAITRO_TEN }; },
            save: function (rec, cha, row) {
                return { action: H + (rec.ID ? 'CapNhat' : 'ThemMoi'), method: 'POST', strId: rec.ID, strLVLA_DeCuong_DangKy_Id: cha,
                    strVaiTro_Id: rec.vt, strNguoiHuongDan_Id: rec.pid, strLVLA_KeHoach_DeCuong_Id: L.e(row.LVLA_KEHOACH_DECUONG_ID),
                    strQLSV_NguoiHoc_Id: L.e(row.QLSV_NGUOIHOC_ID), strMoTa: L.e(row.MOTA) };
            }
        }]
    });
})();
