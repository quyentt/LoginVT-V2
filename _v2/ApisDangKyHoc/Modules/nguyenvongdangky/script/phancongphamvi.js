/* =========================================================================
   Phân công phạm vi nguyện vọng
   Bản gốc: ApisDangKyHoc/Modules/nguyenvongdangky/html/phancongphamvi.html
            + script/phancongphamvi.js (lớp PhanCongPhamVi, vỏ indexi)
   Bản gốc là BẢN CHÉP của kehoachdangky/phancongphamvi (git diff -w: đổi
   controller, bỏ bớt ô / nút) → dùng chung khung ums.dkhPC.phamViMan nạp chéo
   từ ../../kehoachdangky/script/_phancong.js.
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên):
       CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM  DANGKY.PHANCAP
       DKH_KeHoachDangKyNV/LayDanhSach          GET  ô Kế hoạch (TENKEHOACH)
       DKH_NguyenVong_PhamVi/LayDanhSach        GET  strDangKy_KeHoachDangKy_Id (tên tham số như gốc)
       DKH_NguyenVong_PhamVi/ThemMoi            POST strKeHoachNguyenVong_Id, mỗi phạm vi một lời gọi
       DKH_NguyenVong_PhamVi/CapNhat            POST strId = ID dòng, strKeHoachNguyenVong_Id = DANGKY_KEHOACHDANGKY_ID của dòng
       DKH_NguyenVong_PhamVi/Xoa                POST strIds = ID dòng
       DKH_NguyenVong_PhamVi/LayDSNguoiHoc_NV_PhamVi  GET  (khung "Danh sách" khi sửa)
   Khác bản đăng ký học: KHÔNG có Sĩ số, Ngày bắt đầu tính mốc rút học phần,
   "Thêm Khoa quản lý - khóa học", "Tạo dữ liệu thời khóa biểu…", "Tính toán…".

   Lỗi bản gốc — đã làm theo ý định (như bản đăng ký học):
     · ô "Số tín tối thiểu N2" của biểu mẫu thêm mang id …N1, lời gọi đọc …N2
       không tồn tại → gốc luôn gửi rỗng; nay gửi đúng giá trị ô.
     · Lưu thêm xong quay về danh sách (gốc để nguyên → bấm lần hai thêm trùng).
   Nghi ngờ, giữ như gốc: sửa gửi strKeHoachNguyenVong_Id lấy cột
   DANGKY_KEHOACHDANGKY_ID của dòng — kiểm trên host tên cột thật.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('dkh-nv-phancongphamvi');
    if (!root) return;

    ums.dkhPC.phamViMan(root, {
        tieuDe: 'Phân công phạm vi nguyện vọng',
        keHoachAction: 'DKH_KeHoachDangKyNV/LayDanhSach',
        list: 'DKH_NguyenVong_PhamVi/LayDanhSach',
        them: 'DKH_NguyenVong_PhamVi/ThemMoi',
        sua: 'DKH_NguyenVong_PhamVi/CapNhat',
        xoa: 'DKH_NguyenVong_PhamVi/Xoa',
        nguoiHoc: 'DKH_NguyenVong_PhamVi/LayDSNguoiHoc_NV_PhamVi',
        khKey: 'strKeHoachNguyenVong_Id',
        rutHP: false, siSo: false, kqlKhoa: false, tinhToan: false
    });
})();
