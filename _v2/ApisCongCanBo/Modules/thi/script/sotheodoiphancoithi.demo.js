/* Dữ liệu mẫu cho các màn phân công thi — chỉ dùng ở chế độ dựng thử. */
(function () {
    var C = 'pkg_thi_phach_chung.', P = 'pkg_thi_phancong.', fx = {};
    fx[C + 'LayThoiGian'] = [{ ID: 'TG1', THOIGIAN: '2026_2027_1' }];
    fx[C + 'LayLoaiDiem'] = function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'LD1', TEN: 'Điểm thi cuối kỳ' }] : []; };
    fx[C + 'LayHinhThucThi'] = function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'HT1', TEN: 'Tự luận' }] : []; };
    fx[C + 'LayDotThi'] = function (o) { return o.strHinhThucThi_Id ? [{ ID: 'DOT1', TEN: 'Đợt 1 HK1' }] : []; };
    fx[C + 'LayHocPhan'] = function (o) { return o.strDotThi_Id ? [{ ID: 'HP1', TEN: 'Lập trình HĐT', MA: 'IT3100' }] : []; };
    fx[C + 'LayDotTaoPhach'] = function (o) { return o.strDaoTao_HocPhan_Id ? [{ ID: 'DP1', TEN: 'Đợt phách IT3100' }] : []; };
    var DS = [{ ID: 'DST1', MADANHSACHTHI: 'DST-IT3100-01', DAOTAO_HOCPHAN_TEN: 'Lập trình HĐT', DAOTAO_HOCPHAN_MA: 'IT3100', DSLOP: 'IT3100.01', NGAYTHI: '06/01/2027', THI_CATHI_TEN: 'Ca 2',
        TKB_PHONGTHI_TEN: 'A2-301', SOSV: 40, NGAYNHANBAI: '', DSNHANSUCOITHI: 'Nguyễn Văn Hùng', DSNHANSUCHAMTHI: '' },
        { ID: 'DST2', MADANHSACHTHI: 'DST-IT3100-02', DAOTAO_HOCPHAN_TEN: 'Lập trình HĐT', DAOTAO_HOCPHAN_MA: 'IT3100', DSLOP: 'IT3100.02', NGAYTHI: '06/01/2027', THI_CATHI_TEN: 'Ca 3',
        TKB_PHONGTHI_TEN: 'A2-302', SOSV: 38, NGAYNHANBAI: '07/01/2027', DSNHANSUCOITHI: '', DSNHANSUCHAMTHI: 'Trần Thị Mai' }];
    fx[P + 'LayDSThiTheoDotThi'] = function () { return DS; };
    fx[P + 'LayDSTuiTheoDotPhach'] = function (o) { return o.strThi_DotPhach_Id ? [{ ID: 'TUI1', TEN: 'Túi 01', SOBAI: 25, DSLOP: 'IT3100.01', NGAYNHANBAI: '', DSNHANSUCHAMTHI: '' }] : []; };
    var PC = [];
    ['CoiThi', 'ChamThi'].forEach(function (k) {
        fx[P + 'LayDSNhanSuPhanCong' + k] = function () { return PC; };
        fx[P + 'Them_Thi_GiaoVien_' + k] = function (o) { PC.push({ ID: 'PC' + (PC.length + 1), HODEM: 'Cán bộ', TEN: String(PC.length + 1), MASO: o.strNhanSu_HoSoCanBo_v2_Id, THONGTIN: o['strDuLieuPhanCong' + k + '_Id'], STT: 1, SOLUONG: 1 }); return []; };
        fx[P + 'Xoa_Thi_GiaoVien_' + k] = function (o) { PC = PC.filter(function (x) { return x.ID !== o.strId; }); return []; };
    });
    fx[P + 'CapNhat_ThoiGianNhanBai'] = [];
    ums.demo.add(fx);
})();
