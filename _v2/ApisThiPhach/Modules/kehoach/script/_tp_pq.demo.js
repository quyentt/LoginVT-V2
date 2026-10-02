/* Dữ liệu mẫu cho ba màn phân quyền nhập điểm của Thi phách (khung ums.tpPq) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var T = 'TP_Chung/', Q = 'CMS_PhanQuyenDuLieu/', fx = {};

    /* ---------- Bộ lọc thi (bản Túi, bản DST) ---------- */
    fx[T + 'LayThoiGian'] = [{ ID: 'TG1', THOIGIAN: '2026_2027_1' }, { ID: 'TG2', THOIGIAN: '2025_2026_2' }];
    fx[T + 'LayLoaiDiem'] = function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'LD1', TEN: 'Điểm thi kết thúc học phần' }, { ID: 'LD2', TEN: 'Điểm giữa kỳ' }] : []; };
    fx[T + 'LayHinhThucThi'] = function (o) { return o.strDiem_ThanhPhanDiem_Id ? [{ ID: 'HT1', TEN: 'Tự luận' }, { ID: 'HT2', TEN: 'Trắc nghiệm' }] : []; };
    fx[T + 'LayDotThi'] = function (o) { return o.strHinhThucThi_Id ? [{ ID: 'DOT1', TEN: 'Đợt 1 - Học kỳ 1' }, { ID: 'DOT2', TEN: 'Đợt 2 - Học kỳ 1' }] : []; };
    fx[T + 'LayHocPhan'] = function (o) { return o.strDotThi_Id ? [{ ID: 'HP1', TEN: 'Lập trình hướng đối tượng', MA: 'IT3100' }, { ID: 'HP2', TEN: 'Cơ sở dữ liệu', MA: 'IT3090' }] : []; };

    /* ---------- Bản Túi ---------- */
    var DOT = [
        { ID: 'DP1', TEN: 'Đợt phách IT3100 - Ca 2 - 06/01/2027', QUYTACTAOTUI_TEN: '25 bài một túi', QUYTACTAOPHACH_TEN: 'Tăng dần', BUOCNHAY: 1, SOBATDAU: 101, HP: 'HP1' },
        { ID: 'DP2', TEN: 'Đợt phách IT3090 - Ca 3 - 07/01/2027', QUYTACTAOTUI_TEN: '30 bài một túi', QUYTACTAOPHACH_TEN: 'Ngẫu nhiên', BUOCNHAY: 3, SOBATDAU: 500, HP: 'HP2' },
        { ID: 'DP3', TEN: 'Đợt phách IT3100 - Ca 4 - 08/01/2027', QUYTACTAOTUI_TEN: '25 bài một túi', QUYTACTAOPHACH_TEN: 'Tăng dần', BUOCNHAY: 1, SOBATDAU: 301, HP: 'HP1' }];
    fx[T + 'LayDotTaoPhach'] = function (o) { return DOT.filter(function (x) { return !o.strDaoTao_HocPhan_Id || x.HP === o.strDaoTao_HocPhan_Id; }); };
    var TUI = [{ ID: 'TUI1', TEN: 'Túi 01', DP: 'DP1' }, { ID: 'TUI2', TEN: 'Túi 02', DP: 'DP1' }, { ID: 'TUI3', TEN: 'Túi 01', DP: 'DP2' }, { ID: 'TUI4', TEN: 'Túi 01', DP: 'DP3' }];
    fx[T + 'LayDSTuiTheoDotPhach'] = function (o) {
        var ids = String(o.strThi_DotPhach_Id || '').split(',');
        return TUI.filter(function (x) { return ids.indexOf(x.DP) >= 0; }).map(function (x) {
            return { ID: x.ID, TEN: x.TEN, THI_DOTPHACH_TEN: DOT.filter(function (d) { return d.ID === x.DP; })[0].TEN };
        });
    };
    var PH = [101, 102, 103, 104].map(function (n, i) {
        return { ID: 'TN' + n, SOPHACH: n, DIEMBANDAU: i ? '' : 7.5, THONGTINXULY: i === 2 ? 'Khiển trách' : '', QLSV_NGUOIHOC_ID: 'SV' + n,
            CAMTHI_DUYETDKTHI: i === 3 ? '1' : '0', NGUOISUA_TAIKHOAN: i ? '' : 'cb001', NGAYSUA_DD_MM_YYYY: i ? '' : '08/01/2027' };
    });
    fx['TP_XuLy/LayDSPhachTheoTui'] = function (o) { return o.strThi_TuiBai_Id === 'TUI1' ? PH : []; };
    fx['TP_XuLy/CapNhat_DiemPhachTheoTuiBai'] = function (o) {
        PH.forEach(function (p) { if (p.ID === o.strThi_TuiBai_NguoiHoc_Id) { p.DIEMBANDAU = o.strDiem; p.NGUOISUA_TAIKHOAN = 'cb001'; p.NGAYSUA_DD_MM_YYYY = '28/09/2026'; } });
        return [];
    };

    /* ---------- Bản Danh sách thi ---------- */
    var DST = [
        { ID: 'DST1', MADANHSACHTHI: 'DST-IT3100-01', DAOTAO_HOCPHAN_TEN: 'Lập trình hướng đối tượng', NGAYTHI: '06/01/2027', THI_CATHI_TEN: 'Ca 2', TKB_PHONGTHI_TEN: 'A2-301', SOSVTHEODST: 40, THONGTINLOPHOCPHAN: 'IT3100.01, IT3100.02' },
        { ID: 'DST2', MADANHSACHTHI: 'DST-IT3100-02', DAOTAO_HOCPHAN_TEN: 'Lập trình hướng đối tượng', NGAYTHI: '06/01/2027', THI_CATHI_TEN: 'Ca 3', TKB_PHONGTHI_TEN: 'A2-302', SOSVTHEODST: 38, THONGTINLOPHOCPHAN: 'IT3100.03' },
        { ID: 'DST3', MADANHSACHTHI: 'DST-IT3090-01', DAOTAO_HOCPHAN_TEN: 'Cơ sở dữ liệu', NGAYTHI: '07/01/2027', THI_CATHI_TEN: 'Ca 1', TKB_PHONGTHI_TEN: 'B1-204', SOSVTHEODST: 35, THONGTINLOPHOCPHAN: 'IT3090.01' }];
    fx[T + 'LayDSThiTheoDotThi'] = function (o) {
        var q = String(o.strTuKhoa || '').toLowerCase();
        return DST.filter(function (x) { return !q || (x.MADANHSACHTHI + ' ' + x.DAOTAO_HOCPHAN_TEN).toLowerCase().indexOf(q) >= 0; });
    };
    var SV = [['BIT220101', 'Nguyễn Văn', 'An', 'K67-KTPM1'], ['BIT220102', 'Trần Thị', 'Bình', 'K67-KTPM1'], ['BIT220145', 'Lê Minh', 'Châu', 'K67-KTPM2'], ['BIT220163', 'Phạm Thu', 'Dung', 'K67-HTTT1']]
        .map(function (s, i) {
            return { ID: 'DSV' + (i + 1), QLSV_NGUOIHOC_ID: 'NH0' + (i + 1), QLSV_NGUOIHOC_MASO: s[0], QLSV_NGUOIHOC_HODEM: s[1], QLSV_NGUOIHOC_TEN: s[2], DAOTAO_LOPQUANLY_TEN: s[3],
                DIEM_THANHPHANDIEM_TEN: 'Điểm thi kết thúc học phần', LANHOC: 1, LANTHI: 1, SOBAODANH: 12 + i, DIEMBANDAU: i === 1 ? 8 : '', DIEM_DANHSACHHOC_TEN: 'IT3100.01',
                CAMTHI_VIPHAMQUYCHE: i === 3 ? '1' : '0', NGUOISUA_TAIKHOAN: i === 1 ? 'cb015' : '', NGAYSUA_DD_MM_YYYY: i === 1 ? '09/01/2027' : '' };
        });
    fx[T + 'LayDSNguoiHocTheoDST'] = function (o) { return o.strDanhSachThi_Id === 'DST3' ? [] : SV; };
    fx['TP_XuLy/CapNhat_DiemPhachTheoDST'] = function (o) {
        SV.forEach(function (p) { if (p.ID === o.strThi_DanhSachSinhVien_Id) { p.DIEMBANDAU = o.strDiem; p.NGUOISUA_TAIKHOAN = 'cb001'; p.NGAYSUA_DD_MM_YYYY = '28/09/2026'; } });
        return [];
    };

    /* ---------- Xác nhận ---------- */
    fx['D_HanhDongXacNhan/LayDanhSach'] = [{ ID: 'HDX1', TEN: 'Hoàn thành', THONGTIN1: 'fa fa-check-circle', THONGTIN2: 'color: #198754' },
        { ID: 'HDX2', TEN: 'Hủy hoàn thành', THONGTIN1: 'fa fa-ban', THONGTIN2: 'color: #c0392b' }];
    var LS = [];
    fx['D_XacNhan/LayDSDiem_XacNhan'] = function (o) { return LS.filter(function (x) { return x.id === o.strDuLieuXacNhan && x.loai === o.strLoaiXacNhan_Id; }); };
    fx['D_XacNhan/Them_Diem_XacNhan'] = function (o) {
        LS.unshift({ id: o.strDuLieuXacNhan, loai: o.strLoaiXacNhan_Id, TEN: o.strHanhDong_Id === 'HDX1' ? 'Hoàn thành' : 'Hủy hoàn thành', NGUOIXACNHAN_TENDAYDU: 'Nguyễn Văn Hùng', NGAYTAO_DD_MM_YYYY: '28/09/2026' });
        return [];
    };

    /* ---------- Quyền nhập điểm (ba bản) ---------- */
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#CHUNG.HANHDONG'] = [{ ID: 'HD1', MA: 'NHAP', TEN: 'Nhập điểm' }, { ID: 'HD2', MA: 'XACNHAN', TEN: 'Xác nhận' }, { ID: 'HD3', MA: 'XEM', TEN: 'Xem' }];
    var HD = { HD1: 'Nhập điểm', HD2: 'Xác nhận', HD3: 'Xem' }, ND = { NS1: ['cb001', 'Nguyễn Văn Hùng'], NS2: ['cb015', 'Trần Thị Mai'], NS3: ['cb102', 'Lê Quang Minh'] };
    var QUYEN = [
        { ID: 'Q1', dl: 'TUI1', cha: 'DP1', DST_TUI_TEN: 'Túi 01', NGUOIDUNG_TAIKHOAN: 'cb001', NGUOIDUNG_TENDAYDU: 'Nguyễn Văn Hùng', HANHDONG_TEN: 'Nhập điểm' },
        { ID: 'Q2', dl: 'DST1', cha: 'DST1', DST_TUI_TEN: 'DST-IT3100-01', NGUOIDUNG_TAIKHOAN: 'cb015', NGUOIDUNG_TENDAYDU: 'Trần Thị Mai', HANHDONG_TEN: 'Nhập điểm' },
        { ID: 'Q3', dl: 'LHP1', cha: 'LHP1', DANGKY_LOPHOCPHAN_MA: 'IT3100.01', DANGKY_LOPHOCPHAN_TEN: 'Lập trình hướng đối tượng - 01', NGUOIDUNG_TAIKHOAN: 'cb102', NGUOIDUNG_TENDAYDU: 'Lê Quang Minh', HANHDONG_TEN: 'Xác nhận' }];
    var soQ = 10;
    function them(dl, o, cot) {
        var n = ND[o.strNguoiDung_Id] || [o.strNguoiDung_Id, ''];
        var r = { ID: 'Q' + (++soQ), dl: dl, cha: dl, NGUOIDUNG_TAIKHOAN: n[0], NGUOIDUNG_TENDAYDU: n[1], HANHDONG_TEN: HD[o.strHanhDong_Id] || o.strHanhDong_Id };
        Object.keys(cot).forEach(function (k) { r[k] = cot[k]; });
        QUYEN.push(r);
        return [];
    }
    function xoa(o) { QUYEN = QUYEN.filter(function (x) { return x.ID !== o.strId; }); return []; }
    fx[Q + 'Them_Thi_GiaoVien_NhapDiem'] = function (o) {
        var t = TUI.filter(function (x) { return x.ID === o.strDST_Tui_Id; })[0], d = DST.filter(function (x) { return x.ID === o.strDST_Tui_Id; })[0];
        var r = them(o.strDST_Tui_Id, o, { DST_TUI_TEN: t ? t.TEN : d ? d.MADANHSACHTHI : o.strDST_Tui_Id });
        if (t) QUYEN[QUYEN.length - 1].cha = t.DP;
        return r;
    };
    fx[Q + 'Xoa_Thi_GiaoVien_NhapDiem'] = xoa;
    fx[Q + 'LayDSQuyenDotPhach_GV_NhapDiem'] = function (o) { return QUYEN.filter(function (x) { return x.cha === o.strThi_DotPhach_Id; }); };
    fx[Q + 'LayDSQuyenThi_GV_NhapDiem'] = function (o) { return QUYEN.filter(function (x) { return x.dl === o.strDST_Tui_Id; }); };

    /* ---------- Bản Lớp học phần ---------- */
    fx['DKH_Chung/LayThoiGianDangKyHoc'] = [{ ID: 'TG1', DAOTAO_THOIGIANDAOTAO: '2026_2027_1' }, { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: '2025_2026_2' }];
    fx['DKH_PhanCong_LopHP/LayDSKhoaToChuc'] = [{ ID: 'K67', TENKHOA: 'Khóa 67' }, { ID: 'K68', TENKHOA: 'Khóa 68' }];
    fx['DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc'] = [{ ID: 'CTKTPM', TENCHUONGTRINH: 'Kỹ thuật phần mềm' }, { ID: 'CTHTTT', TENCHUONGTRINH: 'Hệ thống thông tin' }];
    fx['DKH_PhanCong_LopHP/LayDSHocPhan'] = [{ ID: 'HP1', TEN: 'Lập trình hướng đối tượng', MA: 'IT3100' }, { ID: 'HP2', TEN: 'Cơ sở dữ liệu', MA: 'IT3090' }];
    fx['DKH_ThongTin/LayDSDangKy_KeHoachDangKy'] = function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'KH1', TENKEHOACH: 'Đăng ký học kỳ 1 năm 2026-2027' }] : []; };
    fx['pkg_kehoach_thongtin.LayDSKhoaQuanLy'] = [{ ID: 'KQL1', TEN: 'Khoa Công nghệ thông tin' }, { ID: 'KQL2', TEN: 'Khoa Kinh tế' }];
    var LHP = [];
    for (var i = 1; i <= 14; i++) {
        LHP.push({ ID: 'LHP' + i, MALOP: (i % 2 ? 'IT3100.' : 'IT3090.') + ('0' + i).slice(-2), TENLOP: (i % 2 ? 'Lập trình hướng đối tượng' : 'Cơ sở dữ liệu') + ' - ' + ('0' + i).slice(-2),
            THOIGIANCHITIET: 'Thứ ' + (2 + i % 5) + ', tiết 1-3, A2-30' + (i % 9), SOSVDADANGKY: i === 4 ? 0 : 30 + i, SOLUONGDUKIENHOC: 45, HOCPHITINHRIENG: i === 3 ? 1 : 0, HP: i % 2 ? 'HP1' : 'HP2' });
    }
    fx['DKH_BaoCao/LayDSLopHocPhanPhanTrang'] = function (o) {
        var hp = String(o.strDaoTao_HocPhan_Id || '').split(',').filter(Boolean);
        var d = LHP.filter(function (x) { return !hp.length || hp.indexOf(x.HP) >= 0; });
        var dau = ((Number(o.pageIndex) || 1) - 1) * (Number(o.pageSize) || 10);
        return { rows: d.slice(dau, dau + (Number(o.pageSize) || 10)), pager: d.length };
    };
    fx['DKH_PhanCong_LopHP/LayDanhSach'] = [{ ID: 'PV1', PHAMVIAPDUNG_TEN: 'K67-KTPM1', PHANCAPAPDUNG_TEN: 'Lớp quản lý' }, { ID: 'PV2', PHAMVIAPDUNG_TEN: 'Kỹ thuật phần mềm', PHANCAPAPDUNG_TEN: 'Chương trình' }];
    fx['DKH_PhanCong_LopHP/LayDSDangKyHoc'] = SV.map(function (s) {
        return { ID: 'DK' + s.ID, QLSV_NGUOIHOC_MASO: s.QLSV_NGUOIHOC_MASO, QLSV_NGUOIHOC_HODEM: s.QLSV_NGUOIHOC_HODEM, QLSV_NGUOIHOC_TEN: s.QLSV_NGUOIHOC_TEN, QLSV_NGUOIHOC_NGAYSINH: '12/03/2004',
            QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học', DAOTAO_LOPQUANLY_TEN: s.DAOTAO_LOPQUANLY_TEN, DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67',
            KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy' };
    });
    fx['pkg_diem_phanquyen.TaoDuLieuNhapDiem'] = [];
    fx['PKG_DIEM_PHANQUYEN.HuyTaoDuLieuNhapDiem'] = [];
    fx[Q + 'Them_DuLieu_LopHocPhan'] = function (o) {
        var l = LHP.filter(function (x) { return x.ID === o.strDangKy_LopHocPhan_Id; })[0] || {};
        return them(o.strDangKy_LopHocPhan_Id, o, { DANGKY_LOPHOCPHAN_MA: l.MALOP, DANGKY_LOPHOCPHAN_TEN: l.TENLOP });
    };
    fx[Q + 'Xoa_DuLieu_LopHocPhan'] = xoa;
    fx[Q + 'LayDSQuyenDuLieu_LopHocPhan'] = function (o) { return QUYEN.filter(function (x) { return x.dl === o.strDangKy_LopHocPhan_Id; }); };

    ums.demo.add(fx);
})();
