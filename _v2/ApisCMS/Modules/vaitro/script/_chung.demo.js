/* Dữ liệu mẫu dùng chung của module vaitro (và ungdung/ungdungchucnang nạp
   chéo _chung.js) — chỉ dùng ở chế độ dựng thử. Tên cột chép từ bản gốc. */
(function () {
    var VT = [
        { ID: 'VT01', MAVAITRO: 'QTHT', TENVAITRO: 'Quản trị hệ thống', THUTU: 1, MOTA: 'Toàn quyền cấu hình', LOAIVAITRO_ID: 'LVT1', CHUNG_VAITRO_CHA_ID: null },
        { ID: 'VT02', MAVAITRO: 'PDT', TENVAITRO: 'Phòng Đào tạo', THUTU: 2, MOTA: '', LOAIVAITRO_ID: 'LVT2', CHUNG_VAITRO_CHA_ID: null },
        { ID: 'VT03', MAVAITRO: 'PDT_CV', TENVAITRO: 'Chuyên viên đào tạo', THUTU: 1, MOTA: 'Xếp lịch, quản lý lớp', LOAIVAITRO_ID: 'LVT2', CHUNG_VAITRO_CHA_ID: 'VT02' },
        { ID: 'VT04', MAVAITRO: 'PDT_TP', TENVAITRO: 'Trưởng phòng đào tạo', THUTU: 2, MOTA: '', LOAIVAITRO_ID: 'LVT2', CHUNG_VAITRO_CHA_ID: 'VT02' },
        { ID: 'VT05', MAVAITRO: 'PKHTC', TENVAITRO: 'Phòng Kế hoạch - Tài chính', THUTU: 3, MOTA: '', LOAIVAITRO_ID: 'LVT2', CHUNG_VAITRO_CHA_ID: null },
        { ID: 'VT06', MAVAITRO: 'PKHTC_KT', TENVAITRO: 'Kế toán thu học phí', THUTU: 1, MOTA: 'Thu tiền, xuất hoá đơn', LOAIVAITRO_ID: 'LVT2', CHUNG_VAITRO_CHA_ID: 'VT05' },
        { ID: 'VT07', MAVAITRO: 'GV', TENVAITRO: 'Giảng viên', THUTU: 4, MOTA: '', LOAIVAITRO_ID: 'LVT3', CHUNG_VAITRO_CHA_ID: null },
        { ID: 'VT08', MAVAITRO: 'SV_TV', TENVAITRO: 'Cổng sinh viên - thủ vai', THUTU: 5, MOTA: 'Cán bộ đăng nhập thay sinh viên', LOAIVAITRO_ID: 'LVT3', CHUNG_VAITRO_CHA_ID: null }
    ];

    var UD = [
        { ID: 'UD01', MAUNGDUNG: 'ApisTaiChinh', TENUNGDUNG: 'Tài chính', MOTA: 'Thu học phí, hoá đơn', THUTU: 1, TRANGTHAI: 1, COSUDUNGDANGONNGU: 0, TENANH: 'fa fa-credit-card', DUONGDANTRUYCAPSSO: 'https://ums.truong.edu.vn/ApisTaiChinh', TENFILEDINHKEM: '/ApisTaiChinh/Upload' },
        { ID: 'UD02', MAUNGDUNG: 'ApisCMS', TENUNGDUNG: 'Quản trị hệ thống', MOTA: '', THUTU: 2, TRANGTHAI: 1, COSUDUNGDANGONNGU: 1, TENANH: 'fa fa-cogs', DUONGDANTRUYCAPSSO: 'https://ums.truong.edu.vn/ApisCMS', TENFILEDINHKEM: '' },
        { ID: 'UD03', MAUNGDUNG: 'ApisNhanSu', TENUNGDUNG: 'Nhân sự', MOTA: 'Hồ sơ cán bộ', THUTU: 3, TRANGTHAI: 1, COSUDUNGDANGONNGU: 0, TENANH: 'fa fa-users', DUONGDANTRUYCAPSSO: 'https://ums.truong.edu.vn/ApisNhanSu', TENFILEDINHKEM: '' },
        { ID: 'UD04', MAUNGDUNG: 'ApisDangKyHoc', TENUNGDUNG: 'Đăng ký học', MOTA: '', THUTU: 4, TRANGTHAI: 2, COSUDUNGDANGONNGU: 0, TENANH: 'fa fa-calendar', DUONGDANTRUYCAPSSO: '', TENFILEDINHKEM: '' },
        { ID: 'UD05', MAUNGDUNG: 'ApisCongSinhVien', TENUNGDUNG: 'Cổng sinh viên', MOTA: 'Cổng thông tin người học', THUTU: 5, TRANGTHAI: 1, COSUDUNGDANGONNGU: 1, TENANH: 'fa fa-graduation-cap', DUONGDANTRUYCAPSSO: 'https://sv.truong.edu.vn', TENFILEDINHKEM: '' }
    ];

    function cn(ud, id, ten, cha) { return { ID: id, TENCHUCNANG: ten, CHUCNANGCHA_ID: cha || null, CHUNG_UNGDUNG_ID: ud, MACHUCNANG: id }; }
    var CN = [
        cn('UD01', 'CN0101', 'Danh mục hệ số'),
        cn('UD01', 'CN0102', 'Khai báo khoản thu', 'CN0101'),
        cn('UD01', 'CN0103', 'Hệ thống hoá đơn', 'CN0101'),
        cn('UD01', 'CN0104', 'Mức phí', 'CN0101'),
        cn('UD01', 'CN0105', 'Mức phí theo lớp', 'CN0104'),
        cn('UD01', 'CN0106', 'Mức phí niên chế', 'CN0104'),
        cn('UD01', 'CN0107', 'Thu tiền'),
        cn('UD01', 'CN0108', 'Thu học phí', 'CN0107'),
        cn('UD01', 'CN0109', 'Thu tiền khác', 'CN0107'),
        cn('UD01', 'CN0110', 'Báo cáo tổng hợp'),
        cn('UD02', 'CN0201', 'Người dùng'),
        cn('UD02', 'CN0202', 'Quản lý người dùng', 'CN0201'),
        cn('UD02', 'CN0203', 'Người dùng - vai trò', 'CN0201'),
        cn('UD02', 'CN0204', 'Vai trò'),
        cn('UD02', 'CN0205', 'Quản lý vai trò', 'CN0204'),
        cn('UD02', 'CN0206', 'Vai trò - chức năng', 'CN0204'),
        cn('UD03', 'CN0301', 'Hồ sơ cán bộ'),
        cn('UD03', 'CN0302', 'Quá trình công tác', 'CN0301'),
        cn('UD03', 'CN0303', 'Quá trình lương', 'CN0301'),
        cn('UD05', 'CN0501', 'Đăng ký học'),
        cn('UD05', 'CN0502', 'Tra cứu điểm')
    ];

    ums.cmsDemo = { VT: VT, UD: UD, CN: CN };

    ums.demo.add({
        'pkg_chung_quanlynguoidung.LayDanhSachVaiTro': VT,
        'pkg_chung_quanlynguoidung.LayDanhSachUngDung': function (o) {
            var q = (o.strTuKhoa || '').toLowerCase();
            return UD.filter(function (u) { return !q || (u.TENUNGDUNG + ' ' + u.MAUNGDUNG).toLowerCase().indexOf(q) >= 0; });
        },
        'pkg_chung_quanlynguoidung.LayDanhSachChucNang': function (o) {
            return CN.filter(function (c) { return c.CHUNG_UNGDUNG_ID === o.strChung_UngDung_Id; });
        },
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLTC.LOVT': [
            { ID: 'LVT1', MA: 'HETHONG', TEN: 'Vai trò hệ thống', CHUNG_TENDANHMUC_TEN: 'Loại vai trò' },
            { ID: 'LVT2', MA: 'NGHIEPVU', TEN: 'Vai trò nghiệp vụ', CHUNG_TENDANHMUC_TEN: 'Loại vai trò' },
            { ID: 'LVT3', MA: 'CONG', TEN: 'Vai trò cổng thông tin', CHUNG_TENDANHMUC_TEN: 'Loại vai trò' }
        ]
    });
})();
