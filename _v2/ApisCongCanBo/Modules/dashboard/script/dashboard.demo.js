/* Dữ liệu mẫu cho bảng điều khiển (cổng cán bộ) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var CN = [['CCB-hoso-capnhathoso', 'Cập nhật hồ sơ', 'fa fa-user'], ['CCB-lichgiang-lichgiang', 'Lịch giảng', 'fa fa-calendar'],
        ['CCB-nhapdiem-nhapdiem', 'Nhập điểm', 'fa fa-pencil'], ['CCB-tintuc-tintuc', 'Tin tức', 'fa fa-newspaper-o'],
        ['CCB-klgd-khoiluongnckh', 'Khối lượng NCKH', 'fa fa-flask'], ['CCB-khaosat-kehoach', 'Khảo sát', 'fa fa-check-square-o']];
    ums.demo.add({
        'pkg_chung_quanlynguoidung.LayDSChucNangTheoPhanLoai': CN.map(function (x) { return { CHUCNANG_ID: x[0], CHUCNANG_TEN: x[1], CHUCNANG_TENANH: x[2] }; }),
        'pkg_chung.LayDSCauHinh': [{ DINHDANH: 'APP_LOGO_WEB', DULIEU: '_v2/assets/img/logo.png' }, { DINHDANH: 'APP_TENTRUONG', DULIEU: 'Trường Đại học Mẫu' },
            { DINHDANH: 'APP_NDGT', DULIEU: 'Hệ thống quản lý đào tạo — <b>cổng cán bộ</b>. Nội dung giới thiệu do quản trị nhập ở cấu hình APP_HOME.' }],
        'pkg_tintuc.LayDSTinTuc_BangTin_NguoiDung': [1, 2, 3, 4].map(function (n) {
            return { ID: 'TIN' + n, TIEUDE: ['Thông báo lịch thi học kỳ 1 năm học 2025-2026', 'Hội thảo chuyển đổi số trong giáo dục đại học',
                'Kế hoạch đánh giá khối lượng giảng dạy năm 2026', 'Tuyển sinh thạc sĩ đợt 2'][n - 1], DUONGDANANHHIENTHI: '',
                NOIDUNG: '<p>Nội dung tin mẫu ' + n + '.</p>', NGAYBATDAU: '0' + n + '/09/2026', DAOTAO_COCAUTOCHUC_TEN: 'Phòng Đào tạo', NGUOITAO_TENDAYDU: 'Quản trị' };
        })
    });
})();
