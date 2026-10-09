/* =========================================================================
   Sinh viên miễn giảm (mới) — phần trăm miễn theo sinh viên × thời gian
   Bản gốc: ApisTaiChinh/Modules/miengiam/scripts/sinhvienmiengiammoi.js
   ---------------------------------------------------------------------------
   Khuôn dựng chung ở scripts/_svmien.js (dùng chung với sinhviensotienmien).
   Lời gọi (action kiểu cũ, chép nguyên bản gốc):
       TC_DoiTuong_MienGiam/LayDSThoiGian_DoiTuong_Mien   GET  cột thời gian
       TC_DoiTuong_MienGiam/LayDSTaiChinh_NguoiHoc_Mien   GET  dòng sinh viên
       TC_DoiTuong_MienGiam/LayDanhSach                   GET  giá trị ô
       TC_DoiTuong_MienGiam/ThemMoi | CapNhat             lưu (dPhanTramMienGiam)
       TC_DoiTuong_MienGiam/Xoa                           xoá, strIds = id
       SV_HoSoHocVien_MH/… pkg_hosohocvien.LayDanhSachHoSo  sinh viên của lớp (thêm mới)
       SV_ChuongTrinhCuaHocVien/LayDanhSach               chương trình của từng sinh viên
       danh mục QLTC.DTMG (loadToCombo_DanhMucDuLieu)     đối tượng

   Khác bản gốc:
     · Danh sách sinh viên khi thêm mới lấy đủ 100000 dòng như bản gốc
       định truyền (hàm hệ cũ bỏ qua và chỉ lấy 10 dòng — lớp > 10 người
       thì thiếu người).
     · Chương trình của sinh viên chỉ có một thì chọn sẵn (bản gốc khai
       selectOne: true nhưng đặt sai chỗ nên không có tác dụng).
     · Bỏ mã chết: dropEdit_ChuongTrinh, dropChuongTrinhDaoTao_Form_SVMG,
       dropNew_HocPhan, dropNew_DoiTuongMienGiam (ẩn, không dùng).
   ========================================================================= */
(function () {
    'use strict';
    ums.miengiam.svMienMatrix({
        root: document.getElementById('sinhvienmiengiammoi'),
        title: 'Sinh viên miễn giảm',
        noun: 'phần trăm miễn giảm',
        valueLabel: 'Phần trăm miễn',
        money: false,
        col: 'PHANTRAMMIENGIAM',
        param: 'dPhanTramMienGiam',
        clean: function (v) { return v; },
        act: {
            thoiGian: 'TC_DoiTuong_MienGiam/LayDSThoiGian_DoiTuong_Mien',
            nguoiHoc: 'TC_DoiTuong_MienGiam/LayDSTaiChinh_NguoiHoc_Mien',
            list: 'TC_DoiTuong_MienGiam/LayDanhSach',
            add: 'TC_DoiTuong_MienGiam/ThemMoi',
            edit: 'TC_DoiTuong_MienGiam/CapNhat',
            del: 'TC_DoiTuong_MienGiam/Xoa'
        }
    });
})();
