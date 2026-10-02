/* Dữ liệu mẫu cho Đăng ký học lại thi lại — chỉ dùng ở chế độ dựng thử (hộp "Đăng ký"). */
(function () {
    var LS = [
        { TINHTRANG_TEN: 'Đăng ký học lại', NOIDUNG: 'Đăng ký theo danh sách khoa gửi', NGUOIXACNHAN_TENDAYDU: 'Nguyễn Thị Hằng', NGAYTAO_DD_MM_YYYY: '15/09/2026' },
        { TINHTRANG_TEN: 'Đăng ký thi lại', NOIDUNG: 'Bổ sung đợt 2', NGUOIXACNHAN_TENDAYDU: 'Trần Văn Khoa', NGAYTAO_DD_MM_YYYY: '18/09/2026' }
    ];
    ums.demo.add({
        'HLTL_XacNhanDangKy/LayDanhSach': function () { return LS.slice(); },
        'HLTL_XacNhanDangKy/ThemMoi': { rows: [], message: 'Thêm thành công' }
    });
})();
