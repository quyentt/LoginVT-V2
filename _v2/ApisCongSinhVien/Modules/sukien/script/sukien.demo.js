/* Dữ liệu mẫu cho sukien (Đăng ký - quản lý sự kiện) — chỉ dùng ở chế độ dựng thử.
   Người học mẫu: SV0001. Đăng ký / hủy đăng ký đổi ngay trạng thái trong bộ nhớ. */
(function () {
    var fx = {};

    var KH = [
        { ID: 'KHSK1', TENKEHOACH: 'Hoạt động ngoại khóa học kỳ 1 năm học 2026-2027' },
        { ID: 'KHSK2', TENKEHOACH: 'Tuần sinh hoạt công dân đầu khóa 2026' }
    ];
    fx['pkg_hososinhvien_sukien.LayDSKeHoachSuKien'] = KH;

    function sk(id, kh, ten, anh, trangThai) {
        return { ID: id, QLSV_SUKIEN_KEHOACH_ID: kh, TEN: ten, HINHANHSUKIEN: anh, TRANGTHAI: trangThai };
    }
    /* TRANGTHAI (chỉ dùng cho dữ liệu mẫu): 0 chưa đăng ký · 1 đã đăng ký · 2 đã tham gia */
    var SK = [
        sk('SK1', 'KHSK1', 'Ngày hội việc làm 2026 - gặp gỡ doanh nghiệp ô tô', 'sukien/ngayhoivieclam.jpg', 0),
        sk('SK2', 'KHSK1', 'Hội thảo "Kỹ năng viết CV và phỏng vấn"', '', 0),
        sk('SK3', 'KHSK1', 'Hiến máu nhân đạo - Giọt hồng tri ân', '', 1),
        sk('SK4', 'KHSK1', 'Cuộc thi Robocon cấp trường', 'sukien/robocon.jpg', 1),
        sk('SK5', 'KHSK1', 'Tọa đàm "Khởi nghiệp từ giảng đường"', '', 2),
        sk('SK6', 'KHSK2', 'Sinh hoạt công dân - Quy chế đào tạo tín chỉ', '', 0),
        sk('SK7', 'KHSK2', 'Sinh hoạt công dân - Phòng chống ma túy học đường', '', 2)
    ];
    function cua(kh, tt) {
        return SK.filter(function (r) { return r.QLSV_SUKIEN_KEHOACH_ID === kh && r.TRANGTHAI === tt; });
    }

    fx['pkg_hososinhvien_sukien.LayDSSuKien_HoatDong'] = function (o) { return cua(o.strQLSV_SuKien_KeHoach_Id, 0); };
    /* Bản gốc gọi nhầm dịch vụ vé tháng cho bảng "đã đăng ký" — dữ liệu mẫu giữ đúng khoá đó */
    fx['pkg_hososinhvien_vethang.LayDSQLSV_KeHoach_Ve_DangKy'] = function (o) { return cua(o.strQLSV_KeHoach_DichVu_Ve_Id, 1); };
    fx['pkg_hososinhvien_sukien.LayDSSuKien_KeHoach_ThamGia_SV'] = function (o) { return cua(o.strQLSV_SuKien_KeHoach_Id, 2); };

    fx['pkg_hososinhvien_sukien.Them_SuKien_KeHoach_DangKy'] = function (o) {
        SK.forEach(function (r) { if (r.ID === o.strQLSV_SuKien_HoatDong_Id) r.TRANGTHAI = 1; });
        return { rows: [], message: 'Thêm mới thành công' };
    };
    fx['pkg_hososinhvien_sukien.Xoa_SuKien_KeHoach_DangKy'] = function (o) {
        SK.forEach(function (r) { if (r.ID === o.strId) r.TRANGTHAI = 0; });
        return { rows: [], message: 'Xóa thành công' };
    };

    var TG = {
        SK1: [{ DIADIEM: 'Nhà thi đấu đa năng', TUNGAY: '12/10/2026', GIOBATDAU: 7, PHUTBATDAU: '30', DENNGAY: '12/10/2026', GIOKETTHUC: 11, PHUTKETTHUC: '30' }],
        SK2: [{ DIADIEM: 'Hội trường A1', TUNGAY: '18/10/2026', GIOBATDAU: 14, PHUTBATDAU: '00', DENNGAY: '18/10/2026', GIOKETTHUC: 16, PHUTKETTHUC: '30' }],
        SK3: [{ DIADIEM: 'Sảnh nhà A2', TUNGAY: '20/10/2026', GIOBATDAU: 8, PHUTBATDAU: '00', DENNGAY: '20/10/2026', GIOKETTHUC: 15, PHUTKETTHUC: '00' }],
        SK4: [{ DIADIEM: 'Xưởng thực hành cơ khí', TUNGAY: '02/11/2026', GIOBATDAU: 8, PHUTBATDAU: '00', DENNGAY: '03/11/2026', GIOKETTHUC: 17, PHUTKETTHUC: '00' }],
        SK5: [{ DIADIEM: 'Hội trường B3', TUNGAY: '05/09/2026', GIOBATDAU: 14, PHUTBATDAU: '00', DENNGAY: '05/09/2026', GIOKETTHUC: 16, PHUTKETTHUC: '00' }],
        SK6: [{ DIADIEM: 'Hội trường lớn', TUNGAY: '09/09/2026', GIOBATDAU: 7, PHUTBATDAU: '30', DENNGAY: '09/09/2026', GIOKETTHUC: 11, PHUTKETTHUC: '00' }],
        SK7: [{ DIADIEM: 'Hội trường lớn', TUNGAY: '10/09/2026', GIOBATDAU: 13, PHUTBATDAU: '30', DENNGAY: '10/09/2026', GIOKETTHUC: 17, PHUTKETTHUC: '00' }]
    };
    var DG = {
        SK1: [{ DIENGIA: 'Ông Trần Quang Vinh', MOTA: 'Giám đốc nhân sự - Công ty ô tô Trường Hải' }],
        SK2: [{ DIENGIA: 'Bà Nguyễn Thu Trang', MOTA: 'Chuyên viên tuyển dụng' }],
        SK4: [{ DIENGIA: 'TS. Lê Minh Hoàng', MOTA: 'Trưởng khoa Cơ khí' }],
        SK5: [{ DIENGIA: 'Ông Phạm Văn Nam', MOTA: 'Cựu sinh viên khóa 10, Giám đốc Công ty TNHH AutoTech' }],
        SK6: [{ DIENGIA: 'ThS. Đỗ Thị Hồng', MOTA: 'Phòng Đào tạo' }],
        SK7: [{ DIENGIA: 'Thượng tá Vũ Đức Anh', MOTA: 'Công an tỉnh' }]
    };
    fx['pkg_hososinhvien_sukien.LayDSSuKien_HoatDong_ThoiGian'] = function (o) { return TG[o.strQLSV_SuKien_HoatDong_Id] || []; };
    fx['pkg_hososinhvien_sukien.LayDSSuKien_HoatDong_DienGia'] = function (o) { return DG[o.strQLSV_SuKien_HoatDong_Id] || []; };

    var FILES = {
        SK1: [{ ID: 'FSK1', FILEMINHCHUNG: 'sukien/ke-hoach-ngay-hoi-viec-lam.pdf', TENHIENTHI: 'Kế hoạch ngày hội việc làm.pdf' }],
        SK4: [{ ID: 'FSK4', FILEMINHCHUNG: 'sukien/the-le-robocon.docx', TENHIENTHI: 'Thể lệ cuộc thi Robocon.docx' }],
        SK6: [{ ID: 'FSK6', FILEMINHCHUNG: 'sukien/quy-che-dao-tao.pdf', TENHIENTHI: 'Quy chế đào tạo tín chỉ.pdf' }]
    };
    fx['SV_Files/LayDanhSach'] = function (o) { return FILES[o.strDuLieu_Id] || []; };

    ums.demo.add(fx);
})();
