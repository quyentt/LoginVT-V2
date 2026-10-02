/* =========================================================================
   Phân công phạm vi (kế hoạch đăng ký học)
   Bản gốc: ApisDangKyHoc/Modules/kehoachdangky/html/phancongphamvi.html
            + script/phancongphamvi.js (lớp PhanCongPhamVi, vỏ indexi)
   Dựng bằng khung chung ums.dkhPC.phamViMan (script/_phancong.js) — bản
   nguyện vọng (nguyenvongdangky/phancongphamvi) dùng cùng khung.
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên):
       CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM  DANGKY.PHANCAP (nhóm bảng)
       DKH_KeHoachDangKy/LayDanhSach            GET  ô Kế hoạch (TENKEHOACH)
       DKH_PhanCong_PhamVi/LayDanhSach          GET  strDangKy_KeHoachDangKy_Id, pageSize 1000000
       DKH_ThongTin/Them_DangKy_PhanCong_PhamVi POST mỗi phạm vi một lời gọi
       DKH_ThongTin/Sua_DangKy_PhanCong_PhamVi  POST strId = ID dòng đầu mang phạm vi đó
       DKH_PhanCong_PhamVi/Xoa                  POST strIds = ID dòng, mỗi dòng một lời gọi
       DKH_PhanCong_PhamVi/LayDSNguoiHoc_PhanCong_PhamVi  GET  (khung "Danh sách" khi sửa; Tính toán)
       PKG_DANGKYHOC_CHUNG5.TaoDuLieuTamTheoNguoiHoc  mỗi người học một lời gọi (Tính toán)
       PKG_DANGKYHOC_CHUNG5.TaoDuLieuLichTuanTam      (Tạo dữ liệu thời khóa biểu theo lớp học phần)
       + danh mục khối "Thông tin phạm vi" (xem _phancong.js)

   Cột trả về: PHANCAPAPDUNG_ID, PHAMVIAPDUNG_ID, PHAMVIAPDUNG_TEN, SOLUONG, ID,
   DANGKY_KEHOACHDANGKY_ID, NGAYBATDAU, NGAYKETTHUC, GIODANGKYTRONGNGAYDAU,
   PHUTDANGKYTRONGNGAYDAU, GIOKETTHUCTRONGNGAYCUOI, PHUTKETTHUCTRONGNGAYCUOI,
   SOTINCHITOIDA, SOTINCHITOITHIEU, SOTINCHITOIDAN2, SOTINCHITOITHIEUN2,
   NGAYBATDAUTINHRUTHOCPHAN, SISOTOIDA, SISOTOITHIEU; người học: HODEM, TEN,
   MASO, QLSV_NGUOIHOC_ID.

   Lỗi bản gốc — đã làm theo ý định:
     · Biểu mẫu thêm: ô "Số tín tối thiểu N2" mang id txtSoTinToiThieuN1 nhưng
       lời gọi đọc txtSoTinToiThieuN2 (không tồn tại) → gốc luôn gửi rỗng.
       Nay gửi đúng giá trị ô đó.
     · Lưu thêm xong gốc để nguyên biểu mẫu với danh sách phạm vi cũ (bấm lần
       hai là thêm TRÙNG) — nay lưu xong quay về danh sách.
     · Sửa: gốc lưu KHÔNG hỏi, đóng hộp trước khi gửi; nay lưu xong mới đóng.
   Giữ như gốc:
     · Thêm mới gửi strNgayBatDauTinhRutHocPhan = '' (ô chỉ có ở hộp sửa; gốc
       xoá trắng nó ở rewrite() trước khi mở biểu mẫu thêm).
     · strDangKy_LopHocPhan_Id khi thêm = '' (gốc truyền undefined).
     · Tính toán: gom người học của các phạm vi đã đánh dấu, bỏ trùng theo
       QLSV_NGUOIHOC_ID, hỏi lại rồi gọi TaoDuLieuTamTheoNguoiHoc từng người.
       Gốc bắn mọi lời gọi cùng lúc; ở đây 4 luồng song song.
   Bỏ (mã chết của gốc — gắn vào phần tử không có trên màn): getList_HocPhan,
   getList_LopHocPhan, getList_PhamVi/delete_PhamVi, delete_QuanSoTheoLop,
   getList_ThoiGianDaoTao, getList_NamNhapHoc, genList_TrangThaiSV, các ô
   dropThoiGianDaoTao / dropHocPhan / tblLopHocPhan / tblPhamVi.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('dkh-phancongphamvi');
    if (!root) return;

    ums.dkhPC.phamViMan(root, {
        tieuDe: 'Phân công phạm vi',
        keHoachAction: 'DKH_KeHoachDangKy/LayDanhSach',
        list: 'DKH_PhanCong_PhamVi/LayDanhSach',
        them: 'DKH_ThongTin/Them_DangKy_PhanCong_PhamVi',
        sua: 'DKH_ThongTin/Sua_DangKy_PhanCong_PhamVi',
        xoa: 'DKH_PhanCong_PhamVi/Xoa',
        nguoiHoc: 'DKH_PhanCong_PhamVi/LayDSNguoiHoc_PhanCong_PhamVi',
        khKey: 'strDangKy_KeHoachDangKy_Id',
        rutHP: true, siSo: true, kqlKhoa: true, tinhToan: true
    });
})();
