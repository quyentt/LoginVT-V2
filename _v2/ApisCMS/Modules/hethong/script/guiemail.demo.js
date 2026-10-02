/* Dữ liệu mẫu cho hethong/guiemail — chỉ dùng ở chế độ dựng thử. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    var ROWS = [
        { ID: 'EM1', EMAIL: 'nguyenvan.an@sv.truong.edu.vn', TIEUDE: 'Thông báo lịch thi học kỳ 1 năm học 2026-2027', NOIDUNG: '<p>Chào bạn <b>Nguyễn Văn An</b>,</p><p>Lịch thi học kỳ 1 đã được công bố trên cổng sinh viên.</p>' },
        { ID: 'EM2', EMAIL: 'tranthi.binh@sv.truong.edu.vn', TIEUDE: 'Nhắc nộp học phí đợt 1', NOIDUNG: '<p>Bạn còn nợ học phí <b>4.250.000 đ</b>. Hạn nộp: 15/10/2026.</p>' },
        { ID: 'EM3', EMAIL: 'le.hoang.cuong@sv.truong.edu.vn', TIEUDE: 'Kết quả xét học bổng khuyến khích học tập', NOIDUNG: '<p>Chúc mừng bạn đạt học bổng loại Giỏi học kỳ 2 năm học 2025-2026.</p>' },
        { ID: 'EM4', EMAIL: 'pham.thu.dung@truong.edu.vn', TIEUDE: 'Mời họp hội đồng khoa', NOIDUNG: '<p>Kính mời thầy/cô tham dự họp hội đồng khoa lúc 14h00 ngày 30/09/2026.</p>' },
        { ID: 'EM5', EMAIL: 'vo.minh.em@sv.truong.edu.vn', TIEUDE: 'Xác nhận đăng ký học phần', NOIDUNG: '<p>Bạn đã đăng ký thành công 18 tín chỉ.</p>' }
    ];
    var fx = {
        'CMS_Email_ThongTin/LayDanhSach': function () { return { rows: ROWS.slice(), pager: ROWS.length }; },
        'CMS_NguoiDung/SendEmail': { rows: [], message: 'Đã gửi' },
        'CMS_Email_ThongTin/CapNhat_DaGui': { rows: [] },
        'CMS_Email_ThongTin/Xoa': function (o) { ROWS = ROWS.filter(function (r) { return r.ID !== o.strIds; }); return { rows: [] }; }
    };
    fx[D + 'CMS.TKEMAIL'] = [
        { ID: 'TK1', MA: 'daotao@truong.edu.vn', TEN: 'Phòng Đào tạo', THONGTIN1: 'smtp.truong.edu.vn', THONGTIN2: '(mật khẩu)', CHUNG_TENDANHMUC_TEN: 'Tài khoản email' },
        { ID: 'TK2', MA: 'taichinh@truong.edu.vn', TEN: 'Phòng Tài chính', THONGTIN1: 'smtp.truong.edu.vn', THONGTIN2: '(mật khẩu)', CHUNG_TENDANHMUC_TEN: 'Tài khoản email' }
    ];
    ums.demo.add(fx);
})();
