/* Dữ liệu mẫu cho hethong/config_app — chỉ dùng ở chế độ dựng thử.
   SYS_Xml/GetFile trả NỘI DUNG tệp XML trong Message. Giá trị là dữ liệu dựng, không phải cấu hình thật. */
(function () {
    var XML = '<?xml version="1.0" encoding="utf-8"?>' +
        '<CauHinh>' +
        '<UngDung_DaoTao>' +
            '<!-- Số tín chỉ tối đa mỗi học kỳ --><SoTinChiToiDa>25</SoTinChiToiDa>' +
            '<!-- Số tín chỉ tối thiểu mỗi học kỳ --><SoTinChiToiThieu>12</SoTinChiToiThieu>' +
            '<!-- Cho phép đăng ký vượt lịch --><ChoPhepTrungLich>0</ChoPhepTrungLich>' +
            '<!-- Thang điểm mặc định --><ThangDiem>10</ThangDiem>' +
        '</UngDung_DaoTao>' +
        '<UngDung_TaiChinh>' +
            '<!-- Tiền tố số phiếu thu --><TienToPhieuThu>PT</TienToPhieuThu>' +
            '<!-- Số ngày nhắc nợ trước hạn --><SoNgayNhacNo>7</SoNgayNhacNo>' +
            '<!-- Đơn vị tiền tệ --><DonViTien>VND</DonViTien>' +
        '</UngDung_TaiChinh>' +
        '<UngDung_Email>' +
            '<!-- Máy chủ gửi thư --><MayChuSMTP>smtp.truong.edu.vn</MayChuSMTP>' +
            '<!-- Cổng --><Cong>587</Cong>' +
            '<!-- Số thư gửi mỗi lượt --><SoThuMoiLuot>50</SoThuMoiLuot>' +
        '</UngDung_Email>' +
        '<UngDung_BaoCao>' +
            '<!-- Thư mục lưu báo cáo --><ThuMucBaoCao>Upload/BaoCao/</ThuMucBaoCao>' +
        '</UngDung_BaoCao>' +
        '</CauHinh>';
    ums.demo.add({
        'SYS_Xml/GetFile': { rows: [], message: XML },
        'SYS_Xml/EditNode': { rows: [], message: 'True' }
    });
})();
