/* =========================================================================
   Hội đồng thông qua chuyên đề (luanan/hoidongthongqua)
   Bản gốc: ApisLuanVanLuanAn/Modules/luanan/html/hoidongthongqua.html + script/hoidongthongqua.js
   Giống luanvan/hoidongthongqua 88% nhưng đơn giản hơn: danh sách chuyên đề ĐÃ ĐĂNG KÝ (LVLA_DangKy_ChuyenDe) — KHÔNG có cột Kết quả,
   ô đánh dấu, nút "Thực hiện phê duyệt", hộp Xác nhận, lưới "Danh sách hướng dẫn" (bị chú thích ở gốc). Có cột / ô Phân loại.
   Biểu mẫu "Chuyên đề đã đăng ký": thông tin học viên + chuyên đề CHỈ XEM (gốc khoá readonly), lưới "Danh sách" thành viên hội đồng
   (Họ tên · Cơ quan công tác · Điểm · Đánh giá · Nhận xét · Vai trò · Xóa) — thêm bằng hộp chọn LLKH.
   Khung: ums.lvla.man (cờ chiXem) + ums.lvla.luoiNguoi (cờ diem) trong luanvan/script/_lv_chung.js.
   Lời gọi (chép nguyên, strNguoiThucHien_Id / strChucNang_Id hệ tự chèn):
       LVLA_DangKy_ChuyenDe/LayDanhSach GET strTuKhoa · strQLSV_NguoiHoc_Id '' · strNguoiDangKy_Id '' · strLVLA_KeHoach_ChuyenDe_Id · pageIndex · pageSize
       LVLA_BaoVe_ChuyenDe_HoiDong_ThanhVien/LayDanhSach GET strTuKhoa '' · strNguoiDung_Id '' · strLVLA_DangKy_ChuyenDe_Id · pageIndex 1 · pageSize 100000
            (cột THANHVIEN_ID/HODEM/TEN/COQUANCONGTAC · DIEM · DANHGIA_ID · NHANXET · VAITRO_ID)
       LVLA_BaoVe_ChuyenDe_HoiDong_ThanhVien/ThemMoi | CapNhat POST strId · strLVLA_DangKy_ChuyenDe_Id · strVaiTro_Id · strThanhVien_Id
            · strLVLA_KeHoach_ChuyenDe_Id · strQLSV_NguoiHoc_Id · strMoTa · dDiem · strDanhGia_Id · strNhanXet;  Xoa strIds
       Danh mục: vai trò LVLA.VTHDONG · đánh giá LVLA.DGHD · phân loại LVLA.PLCD
   Khác gốc: Lưu xong đóng biểu mẫu về danh sách (gốc ở lại biểu mẫu); các dòng thành viên lưu bằng lô có thanh tiến độ.
   Cố ý bỏ: nút Xoá đăng ký (btnDelete) và delete_HoiDongThongQua; getList_HoiDongThongQua_HuongDan (gốc đã chú thích lời gọi).
   Việc dữ liệu cần chốt: màn này (gốc luanan) gọi bộ LVLA_BaoVe_ChuyenDe_HoiDong_ThanhVien — tên bộ là "bảo vệ" dù màn là "hội đồng thông qua";
       chép nguyên, cần kiểm trên host xem đúng bộ.
   ========================================================================= */
(function () {
    'use strict';
    var L = ums.lvla, T = 'LVLA_BaoVe_ChuyenDe_HoiDong_ThanhVien/';
    var root = document.getElementById('lvla-luanan-hoidongthongqua');
    if (!root) return;
    L.man(root, {
        title: 'Hội đồng thông qua chuyên đề', listTitle: 'Danh sách đăng ký', formTitle: 'Chuyên đề đã đăng ký',
        P: 'LVLA_DangKy_ChuyenDe/', canAdd: false, phanLoai: 'LVLA.PLCD', chiXem: true,
        keHoach: { action: 'LVLA_KeHoach_ChuyenDe/LayDanhSach' },
        khoaKH: { param: 'strLVLA_KeHoach_ChuyenDe_Id', col: 'LVLA_KEHOACH_CHUYENDE_ID' },
        nguoi: [{
            title: 'Danh sách', icon: 'fa-people-group', vaiTro: 'LVLA.VTHDONG', diem: true, xoa: T + 'Xoa',
            list: function (row) {
                return { action: T + 'LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiDung_Id: '', strLVLA_DangKy_ChuyenDe_Id: row.ID, pageIndex: 1, pageSize: 100000 };
            },
            map: function (r) {
                return { ID: r.ID, pid: r.THANHVIEN_ID, ten: (L.e(r.THANHVIEN_HODEM) + ' ' + L.e(r.THANHVIEN_TEN)).trim(), coQuan: r.THANHVIEN_COQUANCONGTAC,
                    vt: r.VAITRO_ID, vtTen: r.VAITRO_TEN, diem: L.e(r.DIEM), dg: L.e(r.DANHGIA_ID), nx: L.e(r.NHANXET) };
            },
            save: function (rec, cha, row) {
                return { action: T + (rec.ID ? 'CapNhat' : 'ThemMoi'), method: 'POST', strId: rec.ID, strLVLA_DangKy_ChuyenDe_Id: cha,
                    strVaiTro_Id: rec.vt, strThanhVien_Id: rec.pid, strLVLA_KeHoach_ChuyenDe_Id: L.e(row.LVLA_KEHOACH_CHUYENDE_ID),
                    strQLSV_NguoiHoc_Id: L.e(row.QLSV_NGUOIHOC_ID), strMoTa: L.e(row.MOTA),
                    dDiem: rec.diem, strDanhGia_Id: rec.dg, strNhanXet: rec.nx };
            }
        }]
    });
})();
