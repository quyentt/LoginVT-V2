/* Dữ liệu mẫu cho loprieng — chỉ dùng ở chế độ dựng thử. */
(function () {
    var LOP = [
        { ID: 'LHP1', THOIGIAN: '2025_2026_1', MALOP: 'INT3306-01', TENLOP: 'Phát triển ứng dụng Web 01', DAOTAO_HOCPHAN_TEN: 'Phát triển ứng dụng Web', DAOTAO_HOCPHAN_MA: 'INT3306', THOIGIANCHOT: '15/09/2025 10:12', SOLUONGKHICHOT: 42, NGUOICHOT: 'Nguyễn Thu Trang', HP: 'HP1' },
        { ID: 'LHP2', THOIGIAN: '2025_2026_1', MALOP: 'INT3306-02', TENLOP: 'Phát triển ứng dụng Web 02', DAOTAO_HOCPHAN_TEN: 'Phát triển ứng dụng Web', DAOTAO_HOCPHAN_MA: 'INT3306', THOIGIANCHOT: '', SOLUONGKHICHOT: '', NGUOICHOT: '', HP: 'HP1' },
        { ID: 'LHP3', THOIGIAN: '2025_2026_1', MALOP: 'BSA2002-01', TENLOP: 'Nguyên lý marketing 01', DAOTAO_HOCPHAN_TEN: 'Nguyên lý marketing', DAOTAO_HOCPHAN_MA: 'BSA2002', THOIGIANCHOT: '16/09/2025 08:40', SOLUONGKHICHOT: 55, NGUOICHOT: 'Lê Văn Hùng', HP: 'HP2' },
        { ID: 'LHP4', THOIGIAN: '2025_2026_1', MALOP: 'FLF1107-05', TENLOP: 'Tiếng Anh B1 05', DAOTAO_HOCPHAN_TEN: 'Tiếng Anh B1', DAOTAO_HOCPHAN_MA: 'FLF1107', THOIGIANCHOT: '', SOLUONGKHICHOT: '', NGUOICHOT: '', HP: 'HP3' }
    ];
    ums.demo.add({
        'pkg_taichinh_loprieng.LayDSThoiGian': [{ ID: 'TG1', THOIGIAN: '2025_2026_1' }, { ID: 'TG2', THOIGIAN: '2025_2026_2' }],
        'pkg_taichinh_loprieng.LayDSKeHoachDangKyHoc': [{ ID: 'KHD1', TENKEHOACH: 'Đăng ký học kỳ 1 năm 2025–2026' }, { ID: 'KHD2', TENKEHOACH: 'Đăng ký học lại, học cải thiện HK1' }],
        'pkg_taichinh_loprieng.LayDSHocPhan': [
            { ID: 'HP1', MA: 'INT3306', TEN: 'Phát triển ứng dụng Web' }, { ID: 'HP2', MA: 'BSA2002', TEN: 'Nguyên lý marketing' }, { ID: 'HP3', MA: 'FLF1107', TEN: 'Tiếng Anh B1' }
        ],
        'pkg_taichinh_loprieng.LayDSLopHocPhan': function (o) {
            return LOP.filter(function (r) { return !o.strDaoTao_HocPhan_Id || r.HP === o.strDaoTao_HocPhan_Id; });
        }
    });
})();
