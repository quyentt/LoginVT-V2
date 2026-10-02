/* Dữ liệu mẫu cho sukien/theodoi — chỉ dùng ở chế độ dựng thử. */
(function () {
    var C = 'SV_SuKien/', fx = {}, seq = 10;
    fx[C + 'LayDSQLSV_SuKien_KeHoach'] = [
        { ID: 'SKH1', TENKEHOACH: 'Tuần sinh hoạt công dân đầu khoá 2026' },
        { ID: 'SKH2', TENKEHOACH: 'Ngày hội việc làm 2026' }
    ];
    fx[C + 'LayDSQLSV_SuKien_HoatDong'] = function (o) {
        return [
            { ID: 'HD1', P: 'SKH1', TEN: 'Khai mạc tuần sinh hoạt công dân', HINHANHSUKIEN: '' },
            { ID: 'HD2', P: 'SKH1', TEN: 'Chuyên đề an toàn giao thông', HINHANHSUKIEN: '' },
            { ID: 'HD3', P: 'SKH2', TEN: 'Gặp gỡ doanh nghiệp CNTT', HINHANHSUKIEN: '' }
        ].filter(function (r) { return r.P === o.strQLSV_SuKien_KeHoach_Id; });
    };
    fx[C + 'LayDSSuKien_HoatDong_ThoiGian'] = function (o) {
        return o.strQLSV_SuKien_HoatDong_Id === 'HD1'
            ? [{ DIADIEM: 'Hội trường A', TUNGAY: '01/09/2026', GIOBATDAU: 7, PHUTBATDAU: 30, DENNGAY: '01/09/2026', GIOKETTHUC: 11, PHUTKETTHUC: 0 }] : [];
    };
    fx[C + 'LayDSSuKien_HoatDong_DienGia'] = function (o) {
        return o.strQLSV_SuKien_HoatDong_Id === 'HD1' ? [{ DIENGIA: 'TS. Nguyễn Văn Hùng', MOTA: 'Phó Hiệu trưởng' }] : [];
    };
    fx['SV_Files/LayDanhSach'] = [];
    var DK = [
        { ID: 'DK1', QLSV_SUKIEN_KEHOACH_ID: 'SKH1', QLSV_SUKIEN_HOATDONG_ID: 'HD1', QLSV_NGUOIHOC_ID: 'NH01', QLSV_NGUOIHOC_MASO: 'BIT220101', QLSV_NGUOIHOC_HODEM: 'Nguyễn Văn', QLSV_NGUOIHOC_TEN: 'An',
          DAOTAO_LOPQUANLY_TEN: 'K67-KTPM1', DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm', DAOTAO_KHOAHOC_TEN: 'Khóa 67', DAXACNHANTHAMGIA: 1, THOIGIAN: '01/09/2026 07:25' },
        { ID: 'DK2', QLSV_SUKIEN_KEHOACH_ID: 'SKH1', QLSV_SUKIEN_HOATDONG_ID: 'HD1', QLSV_NGUOIHOC_ID: 'NH02', QLSV_NGUOIHOC_MASO: 'BIT220102', QLSV_NGUOIHOC_HODEM: 'Trần Thị', QLSV_NGUOIHOC_TEN: 'Bình',
          DAOTAO_LOPQUANLY_TEN: 'K67-KTPM1', DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm', DAOTAO_KHOAHOC_TEN: 'Khóa 67', DAXACNHANTHAMGIA: '', THOIGIAN: '' }
    ];
    fx[C + 'LayDSSuKien_KeHoach_DangKy'] = function (o) { return DK.filter(function (d) { return d.QLSV_SUKIEN_HOATDONG_ID === o.strQLSV_SuKien_HoatDong_Id; }); };
    var CI = [{ QLSV_NGUOIHOC_MASO: 'BIT220101', QLSV_NGUOIHOC_HODEM: 'Nguyễn Văn', QLSV_NGUOIHOC_TEN: 'An', NGAYTAO_DD_MM_YYYY_HHMMSS: '01/09/2026 07:25:10', DANGKYTHAMGIA: 'Có', NGUOITAO_TAIKHOAN: 'ctsv01', HD: 'HD1' }];
    fx[C + 'LayDSSuKien_KeHoach_ThamGia_CI'] = function (o) { return CI.filter(function (c) { return c.HD === o.strQLSV_SuKien_KeHoach_Id; }); };
    fx[C + 'LayTTKiemTraThamGia'] = function (o) {
        var ma = o.strMaSoNguoiHoc || '', dk = o.strMaSoDangKy || '';
        if (ma !== 'BIT220102' && dk !== 'DK0002') return [];
        return [{ ID: 'NH02', HODEM: 'Trần Thị', TEN: 'Bình', HEDAOTAO: 'Đại học chính quy', KHOADAOTAO: 'Khóa 67', NGANHDAOTAO: 'Kỹ thuật phần mềm',
            LOPQUANLY: 'K67-KTPM1', TINHTRANGSINHVIEN: 'Đang học', TINHTRANGDANGKY: 'Đã đăng ký', MASODANGKY: 'DK0002', MASO: 'BIT220102', ANHCANHAN: '' }];
    };
    fx[C + 'Them_SuKien_KeHoach_ThamGia'] = function (o) {
        var d = DK.filter(function (x) { return x.QLSV_NGUOIHOC_ID === o.strQLSV_NguoiHoc_Id && x.QLSV_SUKIEN_HOATDONG_ID === o.strQLSV_SuKien_HoatDong_Id; })[0];
        if (d) { d.DAXACNHANTHAMGIA = 1; d.THOIGIAN = 'vừa xong'; CI.push({ QLSV_NGUOIHOC_MASO: d.QLSV_NGUOIHOC_MASO, QLSV_NGUOIHOC_HODEM: d.QLSV_NGUOIHOC_HODEM, QLSV_NGUOIHOC_TEN: d.QLSV_NGUOIHOC_TEN, NGAYTAO_DD_MM_YYYY_HHMMSS: 'vừa xong', DANGKYTHAMGIA: 'Có', NGUOITAO_TAIKHOAN: 'admin', HD: d.QLSV_SUKIEN_HOATDONG_ID }); }
        return { rows: [], raw: { Id: 'TG' + (seq++) } };
    };
    fx[C + 'Xoa_SuKien_KeHoach_ThamGia'] = function (o) { DK.forEach(function (d) { if (d.ID === o.strId) { d.DAXACNHANTHAMGIA = ''; d.THOIGIAN = ''; } }); return []; };
    ums.demo.add(fx);
})();
