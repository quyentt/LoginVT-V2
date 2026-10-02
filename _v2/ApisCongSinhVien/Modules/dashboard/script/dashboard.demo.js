/* Dữ liệu mẫu cho Trang chính (Cổng sinh viên) — chỉ dùng ở chế độ dựng thử.
   Tên đơn vị trải đủ ba nhóm tin (ums.csvTinTuc.phanNhom): "Công tác sinh viên" →
   Hoạt động sinh viên, "Quản lý đào tạo" → Tin đào tạo, còn lại → Tin nhà trường.
   Nhóm "Tin nhà trường" có 4 tin để thấy chỉ hiện 3 tin đầu. ID khác ID mẫu của
   màn Tin tức: bấm tin mở Tin tức bằng ums.state.moTin (chi tiết mẫu không có →
   màn Tin tức hiện chính dòng được truyền sang). */
(function () {
    'use strict';
    var TIN = [
        ['Thông báo lịch đăng ký học kỳ 2 năm học 2025-2026', 'Phòng Quản lý đào tạo và Đảm bảo chất lượng'],
        ['Hạn nộp học phí học kỳ 1 và hướng dẫn thanh toán trực tuyến', 'Phòng Kế hoạch - Tài chính'],
        ['Lễ trao học bổng khuyến khích học tập đợt 1', 'Phòng Công tác sinh viên'],
        ['Kế hoạch khảo sát ý kiến người học về hoạt động giảng dạy', 'Phòng Khảo thí'],
        ['Thông báo nghỉ học ngày 02/09 và lịch học bù', 'Ban Giám hiệu'],
        ['Giải bóng đá sinh viên toàn trường 2026', 'Đoàn Thanh niên'],
        ['Lịch bảo trì hệ thống cổng thông tin', 'Trung tâm Công nghệ thông tin'],
        ['Hướng dẫn nhận thẻ sinh viên khoá mới', 'Phòng Hành chính']
    ];
    ums.demo.add({
        'pkg_tintuc.LayDSTinTuc_BangTin_NguoiDung': TIN.map(function (t, i) {
            return {
                ID: 'DBTIN' + (i + 1),
                TIEUDE: t[0],
                DAOTAO_COCAUTOCHUC_TEN: t[1],
                DUONGDANANHHIENTHI: '',
                NOIDUNG: '<p>Nội dung tin mẫu ' + (i + 1) + ' dành cho người học.</p>',
                NGAYBATDAU: (i < 9 ? '0' : '') + (i + 1) + '/09/2026',
                NGUOITAO_TENDAYDU: t[1]
            };
        })
    });
})();
