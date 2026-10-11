/* =========================================================================
   Hội đồng thông qua đề cương (luanvan/hoidongthongqua)
   Bản gốc: ApisLuanVanLuanAn/Modules/luanvan/html/hoidongthongqua.html (381 dòng) + script/hoidongthongqua.js (1.290 dòng)
   Giống dangkydecuong 86%: danh sách đề cương ĐÃ ĐĂNG KÝ (LVLA_DeCuong_DangKy) kèm cột "Kết quả" + ô đánh dấu + nút
   "Thực hiện phê duyệt" (hộp Xác nhận hàng loạt); không có Thêm mới. Biểu mẫu: thông tin học viên / đề cương (như đăng ký),
   "Danh sách hướng dẫn" CHỈ XEM, "Hội đồng" (thêm / xoá thành viên), nút Xác nhận (kèm lịch sử) và Lưu. Khung: ums.lvla.man.
   Lời gọi (chép nguyên): danh sách / lưu đề cương như dangkydecuong (LVLA_DeCuong_DangKy/LayDanhSach · CapNhat).
       LVLA_DeCuong_DangKy_HuongDan/LayDanhSach GET strTuKhoa '' · strLVLA_KeHoach_DeCuong_Id · strNguoiDung_Id '' · strLVLA_DeCuong_DangKy_Id · pageIndex 1 · pageSize 100000
       LVLA_DeCuong_HoiDong_ThanhVien/LayDanhSach GET strTuKhoa '' · strNguoiDung_Id '' · strLVLA_KeHoach_DeCuong_Id · strLVLA_DeCuong_DangKy_Id · pageIndex 1 · pageSize 100000
       LVLA_DeCuong_HoiDong_ThanhVien/ThemMoi | CapNhat POST strId · strLVLA_DeCuong_DangKy_Id · strVaiTro_Id · strThanhVien_Id
            · strLVLA_KeHoach_DeCuong_Id · strQLSV_NguoiHoc_Id · strMoTa;  Xoa strIds
       Xác nhận: LVLA_NhanXet_DanhGia (strSanPham_Id = ID đề cương) · vai trò hội đồng: danh mục LVLA.VTHDONG · cột người: THANHVIEN_ID/HOTEN/COQUANCONGTAC
   Phần còn lại (biểu mẫu trong trang, học viên bắt buộc, nhớ ID sau khi lưu) xem _lv_chung.js.
   ========================================================================= */
(function () {
    'use strict';
    var L = ums.lvla, H = 'LVLA_DeCuong_DangKy_HuongDan/', T = 'LVLA_DeCuong_HoiDong_ThanhVien/';
    var root = document.getElementById('lvla-luanvan-hoidongthongqua');
    if (!root) return;
    L.man(root, {
        title: 'Hội đồng thông qua đề cương', listTitle: 'Danh sách đăng ký', formTitle: 'Đề cương đã đăng ký',
        P: 'LVLA_DeCuong_DangKy/', canAdd: false, check: true, cotKetQua: true,
        xacNhan: { sanPham: function (id) { return id; } },
        nguoi: [{
            title: 'Danh sách hướng dẫn', icon: 'fa-chalkboard-user', readonly: true, cotVaiTro: true,
            list: function (row) {
                return { action: H + 'LayDanhSach', method: 'GET', strTuKhoa: '', strLVLA_KeHoach_DeCuong_Id: L.e(row.LVLA_KEHOACH_DECUONG_ID),
                    strNguoiDung_Id: '', strLVLA_DeCuong_DangKy_Id: row.ID, pageIndex: 1, pageSize: 100000 };
            },
            map: function (r) { return { ID: r.ID, pid: r.NGUOIHUONGDAN_ID, ten: r.NGUOIHUONGDAN_HOTEN, coQuan: r.NGUOIHUONGDAN_COQUANCONGTAC, vt: r.VAITRO_ID, vtTen: r.VAITRO_TEN }; }
        }, {
            title: 'Hội đồng', icon: 'fa-people-group', vaiTro: 'LVLA.VTHDONG', xoa: T + 'Xoa',
            list: function (row) {
                return { action: T + 'LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiDung_Id: '',
                    strLVLA_KeHoach_DeCuong_Id: L.e(row.LVLA_KEHOACH_DECUONG_ID), strLVLA_DeCuong_DangKy_Id: row.ID, pageIndex: 1, pageSize: 100000 };
            },
            map: function (r) { return { ID: r.ID, pid: r.THANHVIEN_ID, ten: r.THANHVIEN_HOTEN, coQuan: r.THANHVIEN_COQUANCONGTAC, vt: r.VAITRO_ID, vtTen: r.VAITRO_TEN }; },
            save: function (rec, cha, row) {
                return { action: T + (rec.ID ? 'CapNhat' : 'ThemMoi'), method: 'POST', strId: rec.ID, strLVLA_DeCuong_DangKy_Id: cha,
                    strVaiTro_Id: rec.vt, strThanhVien_Id: rec.pid, strLVLA_KeHoach_DeCuong_Id: L.e(row.LVLA_KEHOACH_DECUONG_ID),
                    strQLSV_NguoiHoc_Id: L.e(row.QLSV_NGUOIHOC_ID), strMoTa: L.e(row.MOTA) };
            }
        }]
    });
})();
