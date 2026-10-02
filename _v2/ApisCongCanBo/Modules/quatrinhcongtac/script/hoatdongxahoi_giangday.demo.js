/* Dữ liệu mẫu cho hoatdongxahoi_giangday — chỉ dùng ở chế độ dựng thử. */
ums.demo.crudStore('NS_QT_HoatDongXaHoi', [
    { ID: 'XH1', THONGTINTHAMGIA: 'Hội Tin học Việt Nam', THOIGIANBATDAU: '2015', VAITRO_KHAC: 'Hội viên' }
], { map: function (o) { return { THONGTINTHAMGIA: o.strThongTinThamGia, THOIGIANBATDAU: o.strThoiGianBatDau, VAITRO_KHAC: o.strVaiTro_Khac }; } });
