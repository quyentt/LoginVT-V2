/* Dữ liệu mẫu cho lichgiangphonghoc — chỉ dùng ở chế độ dựng thử. Lịch sinh theo tuần đang xem. */
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
    var PH = [{ ID: 'PA2301', TEN: 'A2-301' }, { ID: 'PA1205', TEN: 'A1-205' }, { ID: 'PB1101', TEN: 'B1-101' }];
    fx['pkg_congthongtincanbo.LayDSPhongHoc'] = PH;
    fx['pkg_congthongtincanbo.LayLichPhongHoc'] = function (o) {
        var ten = (PH.filter(function (p) { return p.ID === o.strIdPhongHoc; })[0] || {}).TEN;
        var ds = tuan(o).map(function (r) { r.TENPHONGHOC = ten; r.THONGTINGIANGVIEN = 'TS. Nguyễn Văn Hùng<br>ThS. Lê Quang Minh'; return r; });
        if (o.strIdPhongHoc === 'PB1101') ds = [];
        else if (ds.length) ds[0].DSNGAYCOLICH = ngayCoLich(ds, o);
        return ds;
    };
    fx['pkg_dg_camxuc_nguoihoc.LayTTCamXucTongHop'] = [{ DG_CHUCNANG_CHUDE_CHITIET_ANH: 'happy.png', SOLUONG: 12 }];

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

    /* Đăng ký / duyệt mượn phòng */
    var hom = new Date(), homS = dmy(hom), homQua = new Date(hom); homQua.setDate(hom.getDate() + 2);
    var DK = [
        { TKB_DANGKY_PHONG_THOIGIAN_ID: 'DKP1', NGUOIDANGKY: 'Nguyễn Văn Hùng', THOIGIANTHUCHIEN: '20/09/2026 08:12:00', PHONGDANGKY: 'A2-301', TKB_PHONG_ID: 'PA2301',
          NGAYSUDUNG: homS, GIOBATDAU: 14, PHUTBATDAU: 0, GIOKETTHUC: 16, PHUTKETTHUC: 0, MUCDICHSUDUNG: 'Bảo vệ đồ án', TINHTRANG_DUYET_TEN: 'Chờ duyệt', NGUOIDANGKY_ID: 'U1' },
        { TKB_DANGKY_PHONG_THOIGIAN_ID: 'DKP2', NGUOIDANGKY: 'Trần Thị Mai', THOIGIANTHUCHIEN: '21/09/2026 10:00:00', PHONGDANGKY: 'A1-205', TKB_PHONG_ID: 'PA1205',
          NGAYSUDUNG: homS, GIOPHUTBATDAU: '07:30', GIOPHUTKETTHUC: '09:00', MUCDICHSUDUNG: 'Họp bộ môn', TINHTRANG_DUYET_TEN: 'Đã duyệt' },
        { TKB_DANGKY_PHONG_THOIGIAN_ID: 'DKP3', NGUOIDANGKY: 'Nguyễn Văn Hùng', THOIGIANTHUCHIEN: '21/09/2026 11:00:00', PHONGDANGKY: 'A2-301', TKB_PHONG_ID: 'PA2301',
          NGAYSUDUNG: dmy(homQua), GIOBATDAU: 8, PHUTBATDAU: 0, GIOKETTHUC: 10, PHUTKETTHUC: 0, MUCDICHSUDUNG: 'Seminar', TINHTRANG_DUYET_TEN: 'Chờ duyệt' },
        { NGUOIDANGKY: 'Dòng thiếu ID', NGAYSUDUNG: homS, GIOBATDAU: 18, PHUTBATDAU: 0, GIOKETTHUC: 19, PHUTKETTHUC: 0, MUCDICHSUDUNG: '—' }
    ];
    fx['PKG_CORE_DANGKY_MUONPHONG.Pr_Tkb_DangKy_Phong_Get_List'] = function (o) {
        return DK.filter(function (r) {
            return (!o.strTkb_Phong_Id || r.TKB_PHONG_ID === o.strTkb_Phong_Id) && (!o.strNgaySuDung || r.NGAYSUDUNG === o.strNgaySuDung) &&
                (!o.strNguoiDangKy_Id || r.NGUOIDANGKY === 'Nguyễn Văn Hùng');
        });
    };
    fx['PKG_CORE_DANGKY_MUONPHONG.Pr_Tkb_Dk_Phong_Tg_Check'] = [];
    fx['PKG_CORE_DANGKY_MUONPHONG.Pr_Tkb_Dk_Phong_Tg_Ins'] = function (o) {
        DK.push({ TKB_DANGKY_PHONG_THOIGIAN_ID: 'DKP' + (DK.length + 1), NGUOIDANGKY: 'Nguyễn Văn Hùng', THOIGIANTHUCHIEN: homS, TKB_PHONG_ID: o.strTkb_Phong_Id,
            PHONGDANGKY: (PH.filter(function (p) { return p.ID === o.strTkb_Phong_Id; })[0] || {}).TEN, NGAYSUDUNG: o.strNgaySuDung, GIOBATDAU: o.strGioBatDau, PHUTBATDAU: o.strPhutBatDau,
            GIOKETTHUC: o.strGioKetThuc, PHUTKETTHUC: o.strPhutKetThuc, MUCDICHSUDUNG: o.strMucDichSuDung, TINHTRANG_DUYET_TEN: 'Chờ duyệt' });
        return [];
    };
    var TT = [{ ID: 'TT1', TEN: 'Đồng ý' }, { ID: 'TT2', TEN: 'Từ chối' }];
    var LS = [];
    fx['PKG_CORE_DANGKY_MUONPHONG.Pr_Tkb_DK_TT_Get_By_User'] = TT;
    fx['PKG_CORE_DANGKY_MUONPHONG.LayDSTKB_DangKy_Duyet'] = function (o) { return LS.filter(function (x) { return x.SP === o.strSanPham_Id; }); };
    fx['PKG_CORE_DANGKY_MUONPHONG.Pr_Tkb_DangKy_Duyet_Insert'] = function (o) {
        var t = TT.filter(function (x) { return x.ID === o.strTinhTrang_Id; })[0] || {};
        DK.forEach(function (r) { if (r.TKB_DANGKY_PHONG_THOIGIAN_ID === o.strSanPham_Id) r.TINHTRANG_DUYET_TEN = t.TEN === 'Đồng ý' ? 'Đã duyệt' : 'Từ chối'; });
        LS.unshift({ SP: o.strSanPham_Id, TINHTRANG_TEN: t.TEN, NGUOIXACNHAN_HIENTHI: 'Quản trị', NGAYTAO_DD_MM_YYYY_HHMMSS: homS + ' 09:00:00' });
        return [];
    };
    ums.demo.add(fx);
})();
