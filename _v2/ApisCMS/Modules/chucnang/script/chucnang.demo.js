/* Dữ liệu mẫu cho Quản lý chức năng — chỉ dùng ở chế độ dựng thử. */
ums.demo.add({
    'PKG_CORE_QUANTRI_01.LayDSNguoiDungCoQuyenChucNang': [
        { ID: 'U1', TAIKHOAN: 'ntlan', TENDAYDU: 'Nguyễn Thị Lan', EMAIL: 'ntlan@truong.edu.vn', HINHDAIDIEN: '' },
        { ID: 'U2', TAIKHOAN: 'tvhung', TENDAYDU: 'Trần Văn Hùng', EMAIL: 'tvhung@truong.edu.vn', HINHDAIDIEN: '' },
        { ID: 'U3', TAIKHOAN: 'lmquan', TENDAYDU: 'Lê Minh Quân', EMAIL: 'lmquan@truong.edu.vn', HINHDAIDIEN: '' },
        { ID: 'U4', TAIKHOAN: 'phthu', TENDAYDU: 'Phạm Hoài Thu', EMAIL: 'phthu@truong.edu.vn', HINHDAIDIEN: '' }
    ],
    'PKG_CORE_QUANTRI_02.LayDSCore_Quyen': [
        { ID: 'Q1', HANHDONG_ID: 'HD1', HANHDONG_TEN: 'Xem', MOTA: 'Xem danh sách', HIEULUC: 1, CHUCNANG_TEN: 'Khai báo khoản thu', NGAYTAO_DD_MM_YYYY_HHMMSS: '12/09/2026 08:15:02', NGUOITAO_TAIKHOAN: 'admin' },
        { ID: 'Q2', HANHDONG_ID: 'HD2', HANHDONG_TEN: 'Thêm', MOTA: 'Thêm khoản thu', HIEULUC: 1, CHUCNANG_TEN: 'Khai báo khoản thu', NGAYTAO_DD_MM_YYYY_HHMMSS: '12/09/2026 08:15:03', NGUOITAO_TAIKHOAN: 'admin' },
        { ID: 'Q3', HANHDONG_ID: 'HD3', HANHDONG_TEN: 'Sửa', MOTA: '', HIEULUC: 1, CHUCNANG_TEN: 'Khai báo khoản thu', NGAYTAO_DD_MM_YYYY_HHMMSS: '12/09/2026 08:15:03', NGUOITAO_TAIKHOAN: 'admin' },
        { ID: 'Q4', HANHDONG_ID: 'HD4', HANHDONG_TEN: 'Xóa', MOTA: 'Tạm khoá', HIEULUC: 0, CHUCNANG_TEN: 'Khai báo khoản thu', NGAYTAO_DD_MM_YYYY_HHMMSS: '15/09/2026 14:40:11', NGUOITAO_TAIKHOAN: 'ntlan' }
    ],
    'pkg_chung_quanlynguoidung.LayDanhSachVaiTroChucNang': [
        { ID: 'V1', TENVAITRO: 'Tài chính - kế toán' },
        { ID: 'V2', TENVAITRO: 'Quản trị hệ thống' }
    ],
    'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#CHUNG.HANHDONG': [
        { ID: 'HD1', MA: 'VIEW', TEN: 'Xem' }, { ID: 'HD2', MA: 'ADD', TEN: 'Thêm' },
        { ID: 'HD3', MA: 'EDIT', TEN: 'Sửa' }, { ID: 'HD4', MA: 'DELETE', TEN: 'Xóa' },
        { ID: 'HD5', MA: 'EXPORT', TEN: 'Xuất báo cáo' }
    ]
});
