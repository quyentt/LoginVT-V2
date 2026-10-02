/* Dữ liệu mẫu cho lichgiang / lichgiangadmin — chỉ dùng ở chế độ dựng thử. Lịch sinh theo tuần đang xem. */
(function () {
    var fx = {}, D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    function hai(n) { return (n < 10 ? '0' : '') + n; }
    function dmy(d) { return hai(d.getDate()) + '/' + hai(d.getMonth() + 1) + '/' + d.getFullYear(); }
    function parse(s) { var p = String(s || '').split('/'); return new Date(+p[2], +p[1] - 1, +p[0]); }
    /* DSNGAYCOLICH như máy chủ: số ngày có lịch của CẢ THÁNG chứa ngày đang chọn (lịch mẫu lặp hằng tuần theo thứ) */
    function ngayCoLich(ds, o) {
        var g = parse((o && (o.strNgayDangChon || o.strNgayBatDau)) || dmy(new Date())), thu = {}, kq = [];
        ds.forEach(function (r) { thu[parse(r.NGAYHOC).getDay()] = 1; });
        for (var d = new Date(g.getFullYear(), g.getMonth(), 1); d.getMonth() === g.getMonth(); d.setDate(d.getDate() + 1)) if (thu[d.getDay()]) kq.push(d.getDate());
        return kq.join(',');
    }
    function buoi(id, lop, hp, tenLop, phong, thu, g1, p1, g2, p2, t1, t2, batdau) {
        var d = new Date(batdau); d.setDate(d.getDate() + thu);
        return { ID: id + dmy(d).replace(/\//g, ''), IDLICHHOC: 'LH' + id, IDLOPHOCPHAN: lop, IDHOCPHAN: 'HP' + lop, IDPHONGHOC: 'P' + phong, IDHINHTHUCXEP: 'HT1',
            TENHOCPHAN: hp, TENLOPHOCPHAN: tenLop, TENPHONGHOC: phong, NGAYHOC: dmy(d), THUHOC: thu + 2, GIOBATDAU: g1, PHUTBATDAU: p1, GIOKETTHUC: g2, PHUTKETTHUC: p2,
            TIETBATDAU: t1, TIETKETTHUC: t2 };
    }
    function tuan(o) {
        var a = parse(o.strNgayBatDau || dmy(new Date()));
        var ds = [
            buoi('A', 'L1', 'Lập trình hướng đối tượng', 'IT3100.01', 'A2-301', 0, 7, 0, 9, 25, 1, 3, a),
            buoi('B', 'L2', 'Cơ sở dữ liệu', 'IT3200.02', 'A1-205', 1, 13, 0, 15, 30, 7, 9, a),
            buoi('C', 'L1', 'Lập trình hướng đối tượng', 'IT3100.01', 'A2-301', 3, 7, 0, 9, 25, 1, 3, a),
            buoi('D', 'L3', 'Kiến trúc máy tính', 'IT3300.01', 'B1-101', 3, 8, 30, 10, 0, 2, 4, a),
            buoi('E', 'L2', 'Cơ sở dữ liệu', 'IT3200.02', 'Phòng máy 3', 4, 9, 35, 11, 5, 4, 5, a)
        ];
        ds[0].DSNGAYCOLICH = ngayCoLich(ds, o);
        return ds;
    }
    fx['NS_ThongTinCanBo/LayDSLichGiang'] = function (o) {
        if (o.strDaoTao_LopHocPhan_Id) {       // xem các buổi của một lớp: vài tuần
            var ds = [], a = new Date(); a.setDate(a.getDate() - 21);
            for (var w = 0; w < 4; w++) { var b = new Date(a); b.setDate(a.getDate() + w * 7); ds = ds.concat(tuan({ strNgayBatDau: dmy(b) })); }
            return ds.filter(function (r) { return r.IDLOPHOCPHAN === o.strDaoTao_LopHocPhan_Id; });
        }
        return tuan(o);
    };
    fx['PKG_CONGTHONGTINCANBO.LayTKBLopKhongCoLichChiTiet'] = [{ MALOP: 'IT4990.01', TENLOP: 'Thực tập doanh nghiệp', HINHTHUCHOC: 'Thực tập', NGAYBATDAU: '01/09/2026', NGAYKETTHUC: '30/11/2026', GHICHU: 'Theo lịch doanh nghiệp' }];
    fx['pkg_dg_camxuc_nguoihoc.LayTTCamXucTongHop'] = [{ DG_CHUCNANG_CHUDE_CHITIET_ANH: 'happy.png', SOLUONG: 12 }, { DG_CHUCNANG_CHUDE_CHITIET_ANH: 'neutral.png', SOLUONG: 3 }];
    fx['NS_ThongTinCanBo/LayHocKyTheoLichCaNhan'] = [{ ID: 'HK1', THOIGIAN: '2026_2027_1' }];
    fx['NS_ThongTinCanBo/LayTTGiangVienTheoTuKhoa'] = function (o) { return /CB0/i.test(o.strTuKhoa) ? [{ ID: 'NS2', MASO: 'CB015', HODEM: 'Trần Thị', TEN: 'Mai' }] : []; };

    /* Điểm danh một buổi */
    fx['PKG_CHUYENCAN_THONGTIN.LayDSKieuChuyenCan'] = [{ ID: 'K1', TEN: 'Có mặt' }, { ID: 'K2', TEN: 'Vắng có phép' }, { ID: 'K3', TEN: 'Vắng không phép' }];
    fx[D + 'QLSV.KIEUCHUYENCAN'] = [{ ID: 'K1', MA: 'CM', TEN: 'Có mặt' }, { ID: 'K2', MA: 'VP', TEN: 'Vắng có phép' }, { ID: 'K3', MA: 'VK', TEN: 'Vắng không phép' }];
    var SV = [
        { ID: 'DK1', QLSV_NGUOIHOC_ID: 'NH01', QLSV_NGUOIHOC_MASO: 'BIT220101', QLSV_NGUOIHOC_HODEM: 'Nguyễn Văn', QLSV_NGUOIHOC_TEN: 'An', SOBUOIVANG: '1/3/6.7%', IPDIEMDANHNGUOIHOC: '10.0.2.15', MATLENHNGUOIHOC: 'OOP01',
          DANGKY_LOPHOCPHAN_ID: 'DKL1', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CTKTPM', QLSV_TRANGTHAINGUOIHOC_ID: 'TT1', MATLENHGIANGVIEN: 'OOP01', DAOTAO_LOPQUANLY_TEN: 'K67-KTPM1',
          TONGSOTIETHOC: 45, TONGSOTIETCOMAT: 42, PHANTRAMHOANTHANH: '80%', PHANTRAMTHUCHIEN: '93%' },
        { ID: 'DK2', QLSV_NGUOIHOC_ID: 'NH02', QLSV_NGUOIHOC_MASO: 'BIT220102', QLSV_NGUOIHOC_HODEM: 'Trần Thị', QLSV_NGUOIHOC_TEN: 'Bình', SOBUOIVANG: '0/0/0%', IPDIEMDANHNGUOIHOC: '', MATLENHNGUOIHOC: '',
          DANGKY_LOPHOCPHAN_ID: 'DKL2', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CTKTPM', QLSV_TRANGTHAINGUOIHOC_ID: 'TT1', MATLENHGIANGVIEN: 'OOP01', DAOTAO_LOPQUANLY_TEN: 'K67-KTPM1',
          TONGSOTIETHOC: 45, TONGSOTIETCOMAT: 45, PHANTRAMHOANTHANH: '80%', PHANTRAMTHUCHIEN: '100%' }
    ];
    fx['NS_ThongTinCanBo/LayDSDangKyHoc_2'] = function () { return SV; };
    fx['NS_ThongTinCanBo/LayDSDangKyHoc'] = function () { return { rows: { rs: SV } }; };
    var DD = [{ QLSV_NGUOIHOC_ID: 'NH01', KIEUCHUYENCAN_ID: 'K1', GIATRI: 1, SOLUONG: 0 }];
    fx['CC_ThoiGian_ChuyenCan/LayKetQuaTheoKieuChuyenCan'] = function () { return DD; };
    fx['CC_ThoiGian_ChuyenCan/LayKQTongHopTheoKieuChuyenCan'] = function (o) { return SV.map(function (s) { return { QLSV_NGUOIHOC_ID: s.QLSV_NGUOIHOC_ID, TONGSOBUOI: o.strKieuChuyenCan_Id === 'K1' ? 14 : 1, TONGSOTIET: o.strKieuChuyenCan_Id === 'K1' ? 42 : 3 }; }); };
    fx['CC_GiangVien_TuGhiNhan/LayChiTiet'] = [{ TONGSOSV: 2, TEN: 'Có mặt', SOLUONG: 1 }, { TONGSOSV: 2, TEN: 'Vắng', SOLUONG: 0 }];
    fx['CC_NguoiHoc_ChuyenCan/ThemMoi'] = function (o) { DD = DD.filter(function (x) { return x.QLSV_NGUOIHOC_ID !== o.strQLSV_NguoiHoc_Id; }); DD.push({ QLSV_NGUOIHOC_ID: o.strQLSV_NguoiHoc_Id, KIEUCHUYENCAN_ID: o.strKieuChuyenCan_Id, GIATRI: 1, SOLUONG: o.dSoLuong || 0 }); return []; };
    fx['CC_NguoiHoc_ChuyenCan/Xoa_QLSV_NguoiHoc_ChuyenCan2'] = function (o) { DD = DD.filter(function (x) { return !(x.QLSV_NGUOIHOC_ID === o.strQLSV_NguoiHoc_Id && x.KIEUCHUYENCAN_ID === o.strKieuChuyenCan_Id); }); return []; };
    fx['CC_GiangVien_TuGhiNhan/ThemMoi'] = []; fx['CC_GiangVien_TuGhiNhan/ThucHienDiemDanhTuDong'] = []; fx['CC_GiangVien_TuGhiNhan/XuLyDiemDanhKhongTonTaiTKB'] = [];

    /* Đổi lịch */
    var C = 'KHCT_LichGiang_DoiLich/';
    var DL = [{ ID: 'DL1', LOPHOCPHAN_TEN: 'IT3100.01', KETQUAXULY: 'Chờ duyệt' }];
    fx[C + 'LayDSLichGiang_Doi_ThongTinCaNhan'] = function () { return DL; };
    fx[C + 'LayDSLichGiang_Doi_PhamVi'] = function () { return DL; };
    fx[C + 'LayTTLichGiang_Doi'] = [{ NOIDUNG: 'Đi công tác', LOPHOCPHAN_TEN: 'IT3100.01', NGAYHOC: '07/09/2026', NGAYHOC_THAYDOI: '09/09/2026', TIETBATDAU: 1, TIETBATDAU_THAYDOI: 7,
        TIETKETTHUC: 3, TIETKETTHUC_THAYDOI: 9, PHONGHOC_TEN: 'A2-301', PHONGHOC_THAYDOI_TEN: 'A2-305', GIANGVIEN_HOVATEN: 'Nguyễn Văn Hùng', GIANGVIEN_THAYDOI_HOVATEN: 'Nguyễn Văn Hùng' }];
    fx[C + 'KhoiTaoThongTinYeuCauDoiLich'] = function (o) {
        return { rsThongTinChung: [{ NOIDUNG: '', LOPHOCPHAN_TEN: 'IT3100.01', NGAYHOC: o.strNgayHoc, NGAYHOC_THAYDOI: '', TIETBATDAU: o.strTietBatDau, TIETBATDAU_THAYDOI: '',
                    TIETKETTHUC: o.strTietKetThuc, TIETKETTHUC_THAYDOI: '', PHONGHOC_TEN: 'A2-301', IDPHONGHOC_THAYDOI: '' }],
                 rsGiangVien: [{ ID: 'NS1', HODEM: 'Nguyễn Văn', TEN: 'Hùng', MASO: 'CB001' }],
                 rsDanhMucPhong: [{ ID: 'PA2301', TENPHONGHOC: 'A2-301' }, { ID: 'PA2305', TENPHONGHOC: 'A2-305' }],
                 rsDanhMucGiangVien: [{ ID: 'NS1', HODEM: 'Nguyễn Văn', TEN: 'Hùng', MASO: 'CB001' }, { ID: 'NS3', HODEM: 'Lê Quang', TEN: 'Minh', MASO: 'CB102' }] };
    };
    fx[C + 'KiemTraLichCanDoi'] = [{ HOPLE: 0, THONGTINLOI: 'Phòng A2-305 đã có lớp IT2000.03 tiết 7-9' }];
    fx[C + 'GuiYeuCauDoiLich'] = function () { DL.push({ ID: 'DL' + (DL.length + 1), LOPHOCPHAN_TEN: 'IT3100.01', KETQUAXULY: 'Chờ duyệt' }); return []; };
    fx[C + 'Them_TKB_XacNhanDoiLich'] = function (o) { DL.forEach(function (x) { if (x.ID === o.strSanPham_Id) x.KETQUAXULY = 'Đã duyệt'; }); return []; };
    fx[C + 'Xoa_LichGiang_Doi_ThongTin'] = function (o) { DL = DL.filter(function (x) { return x.ID !== o.strIds; }); return []; };
    fx[D + 'TKB.LICHGIANG.XACNHANDOILICH'] = [{ ID: 'XN1', MA: 'DY', TEN: 'Đồng ý' }, { ID: 'XN2', MA: 'TC', TEN: 'Từ chối' }];
    ums.demo.add(fx);
})();
