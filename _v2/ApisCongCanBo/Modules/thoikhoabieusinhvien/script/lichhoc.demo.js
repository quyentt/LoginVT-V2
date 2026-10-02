/* Dữ liệu mẫu cho thoikhoabieusinhvien/lichhoc — chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {};
    function hai(n) { return (n < 10 ? '0' : '') + n; }
    function dmy(d) { return hai(d.getDate()) + '/' + hai(d.getMonth() + 1) + '/' + d.getFullYear(); }
    function parse(s) { var p = String(s || '').split('/'); return new Date(+p[2], +p[1] - 1, +p[0]); }
    fx['pkg_congthongtincanbo.LayTTNguoiHocTheoMaSo'] = function (o) { return /220101/.test(o.strTuKhoa) ? [{ ID: 'NH01', MASO: 'BIT220101', HODEM: 'Nguyễn Văn', TEN: 'An' }] : []; };
    fx['pkg_congthongtin_hssv_thongtin.LayDSLichCaNhan'] = function (o) {
        var a = parse(o.strNgayBatDau);
        function ngay(k) { var d = new Date(a); d.setDate(a.getDate() + k); return dmy(d); }
        return [
            { ID: 'S1', IDLOPHOCPHAN: 'L1', TENHOCPHAN: 'Lập trình hướng đối tượng', TENLOPHOCPHAN: 'IT3100.01', TENPHONGHOC: 'A2-301', GIANGVIEN: 'TS. Nguyễn Văn Hùng',
              NGAYHOC: ngay(0), GIOBATDAU: 7, PHUTBATDAU: 0, GIOKETTHUC: 9, PHUTKETTHUC: 25, TIETBATDAU: 1, TIETKETTHUC: 3, THONGTINCHUYENCAN: 'Vắng 1/15' },
            { ID: 'S2', IDLOPHOCPHAN: 'L2', TENHOCPHAN: 'Cơ sở dữ liệu', TENLOPHOCPHAN: 'IT3200.02', TENPHONGHOC: 'A1-205', GIANGVIEN: 'ThS. Trần Thị Mai',
              NGAYHOC: ngay(2), GIOBATDAU: 13, PHUTBATDAU: 0, GIOKETTHUC: 15, PHUTKETTHUC: 30, TIETBATDAU: 7, TIETKETTHUC: 9 },
            { ID: 'S3', IDLOPHOCPHAN: 'L3', PHANLOAI: 'LICHTHI', TENHOCPHAN: 'Kiến trúc máy tính', CATHI: 'Ca 2', DANGKY_LOPHOCPHAN_TEN: 'Thi viết', PHONGHOC_TEN: 'B1-101',
              TENPHONGHOC: 'B1-101', NGAYHOC: ngay(4), GIOBATDAU: 9, PHUTBATDAU: 30, GIOKETTHUC: 11, PHUTKETTHUC: 0 }
        ];
    };
    fx['PKG_CONGTHONGTIN_HSSV_THONGTIN.LayTKBLopKhongCoLichChiTiet'] = [];
    fx['pkg_dg_camxuc_nguoihoc.LayDSCamXuc'] = [{ ID: 'CX1', DG_CHUCNANG_CHUDE_CHITIET_ANH: 'happy.png' }, { ID: 'CX2', DG_CHUCNANG_CHUDE_CHITIET_ANH: 'neutral.png' }, { ID: 'CX3', DG_CHUCNANG_CHUDE_CHITIET_ANH: 'unhappy.png' }];
    fx['pkg_dg_camxuc_nguoihoc.LayTTMacDinh'] = [{ ID: 'CX1', DG_CHUCNANG_CHUDE_CHITIET_ANH: 'happy.png', SOLUONG: 5 }];
    fx['pkg_dg_camxuc_nguoihoc.Tang_CamXuc'] = []; fx['pkg_dg_camxuc_nguoihoc.Giam_CamXuc'] = []; fx['pkg_dg_camxuc_nguoihoc.ThayDoi_CamXuc'] = [];
    fx['pkg_congthongtincanbo.LayDSDangKyHoc_2'] = [
        { QLSV_NGUOIHOC_ID: 'NH01', QLSV_NGUOIHOC_MASO: 'BIT220101', QLSV_NGUOIHOC_HODEM: 'Nguyễn Văn', QLSV_NGUOIHOC_TEN: 'An', MATLENHNGUOIHOC: 'OOP01', SOBUOIVANG: '1/3/6.7%' },
        { QLSV_NGUOIHOC_ID: 'NH02', QLSV_NGUOIHOC_MASO: 'BIT220102', QLSV_NGUOIHOC_HODEM: 'Trần Thị', QLSV_NGUOIHOC_TEN: 'Bình' }
    ];
    fx['CC_ThongTin/Them_QLSV_NguoiHoc_TuGhiNhan'] = [];
    fx['pkg_congthongtin_hssv_thongtin.LayTTLichThi'] = [{ DANGKY_LOPHOCPHAN_TEN: 'Thi viết', NGAYHOC: '25/09/2026', GIOBATDAU: 9, PHUTBATDAU: 30, GIOKETTHUC: 11, PHUTKETTHUC: 0, PHONGHOC_TEN: 'B1-101', TENHOCPHAN: 'Kiến trúc máy tính' }];
    ums.demo.add(fx);
})();
