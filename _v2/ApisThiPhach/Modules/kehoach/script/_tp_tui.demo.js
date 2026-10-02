/* Dữ liệu mẫu cho hai màn túi bài / lập phách (tuibaitc, tuibai) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var C = 'TP_Chung/', fx = {}, dem = 0;
    function moi(p) { dem++; return p + dem; }

    fx[C + 'LayDSHeDaoTaoDuaTheoDot'] = [{ ID: 'HE1', TENHEDAOTAO: 'Đại học chính quy' }, { ID: 'HE2', TENHEDAOTAO: 'Đại học liên thông' }];
    fx[C + 'LayThoiGian'] = [{ ID: 'TG1', THOIGIAN: '2026_2027_1' }, { ID: 'TG2', THOIGIAN: '2025_2026_2' }];
    fx[C + 'LayLoaiDiem'] = function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'LD1', TEN: 'Điểm thi kết thúc học phần' }, { ID: 'LD2', TEN: 'Điểm thi lại' }] : []; };
    fx[C + 'LayHinhThucThi'] = function (o) { return o.strDiem_ThanhPhanDiem_Id ? [{ ID: 'HT1', TEN: 'Tự luận' }, { ID: 'HT2', TEN: 'Vấn đáp' }] : []; };
    fx[C + 'LayDotThi'] = function (o) { return o.strHinhThucThi_Id ? [{ ID: 'DOT1', TEN: 'Đợt 1 - Học kỳ 1' }, { ID: 'DOT2', TEN: 'Đợt 2 - Học kỳ 1' }] : []; };
    fx[C + 'LayHocPhan'] = function (o) {
        return o.strDotThi_Id ? [{ ID: 'HP1', TEN: 'Kinh tế vi mô', MA: 'KT1101' }, { ID: 'HP2', TEN: 'Nguyên lý kế toán', MA: 'KT1203' }, { ID: 'HP3', TEN: 'Pháp luật đại cương', MA: 'LU1001' }] : [];
    };

    var DOT = [
        { ID: 'DP1', TEN: '2026_2027_1 - Đợt 1 - Học kỳ 1 - Kinh tế vi mô', THOIGIAN: '2026_2027_1', THI_DOTTHI_ID: 'DOT1', THI_DOTTHI_TEN: 'Đợt 1 - Học kỳ 1', DAOTAO_HOCPHAN_ID: 'HP1', DAOTAO_HOCPHAN_TEN: 'Kinh tế vi mô' },
        { ID: 'DP2', TEN: '2026_2027_1 - Đợt 1 - Học kỳ 1 - Nguyên lý kế toán', THOIGIAN: '2026_2027_1', THI_DOTTHI_ID: 'DOT1', THI_DOTTHI_TEN: 'Đợt 1 - Học kỳ 1', DAOTAO_HOCPHAN_ID: 'HP2', DAOTAO_HOCPHAN_TEN: 'Nguyên lý kế toán' },
        { ID: 'DP3', TEN: '2026_2027_1 - Đợt 2 - Học kỳ 1 - Pháp luật đại cương', THOIGIAN: '2026_2027_1', THI_DOTTHI_ID: 'DOT2', THI_DOTTHI_TEN: 'Đợt 2 - Học kỳ 1', DAOTAO_HOCPHAN_ID: 'HP3', DAOTAO_HOCPHAN_TEN: 'Pháp luật đại cương' }
    ];
    fx[C + 'LayDotTaoPhach'] = function (o) {
        return DOT.filter(function (d) { return (!o.strDotThi_Id || d.THI_DOTTHI_ID === o.strDotThi_Id) && (!o.strDaoTao_HocPhan_Id || d.DAOTAO_HOCPHAN_ID === o.strDaoTao_HocPhan_Id); });
    };
    fx['TP_DotPhach/ThemMoi'] = function (o) {
        var id = moi('DPM');
        DOT.push({ ID: id, TEN: o.strTen, THOIGIAN: '2026_2027_1', THI_DOTTHI_ID: o.strTHI_DotThi_Id, THI_DOTTHI_TEN: 'Đợt 1 - Học kỳ 1', DAOTAO_HOCPHAN_ID: o.strDaoTao_HocPhan_Id, DAOTAO_HOCPHAN_TEN: 'Kinh tế vi mô' });
        return { rows: [], raw: { Id: id } };
    };
    fx['TP_DotPhach/CapNhat'] = function (o) { DOT.forEach(function (d) { if (d.ID === o.strId) d.TEN = o.strTen; }); return []; };
    fx['TP_DotPhach/Xoa'] = function (o) { DOT = DOT.filter(function (d) { return String(o.strIds).split(',').indexOf(d.ID) < 0; }); return []; };

    /* quy tắc túi - phách của đợt phách */
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#THI.PHACH.QUYTACTAOTUI'] = [{ ID: 'QTT1', MA: 'THEOPHONG', TEN: 'Mỗi phòng thi một túi' }, { ID: 'QTT2', MA: 'THEOSOBAI', TEN: 'Theo số bài mỗi túi' }];
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#THI.PHACH.QUYTACTAOPHACH'] = [{ ID: 'QTP1', MA: 'TUANTU', TEN: 'Tuần tự' }, { ID: 'QTP2', MA: 'NGAUNHIEN', TEN: 'Ngẫu nhiên' }];
    var QT = [{ ID: 'QT1', PHAMVI: 'DP1', QUYTACTAOPHACH_BUOCNHAY: 1, QUYTACTAOPHACH_SOBATDAU: 1001, QUYTACTAOTUI_ID: 'QTT1', QUYTACTAOTUI_TEN: 'Mỗi phòng thi một túi', QUYTACTAOPHACH_ID: 'QTP1', QUYTACTAOPHACH_TEN: 'Tuần tự' }];
    fx['TP_QuyTacTu_SoPhach/LayDanhSach'] = function (o) { return QT.filter(function (q) { return q.PHAMVI === o.strPhamViApDung_Id; }); };
    fx['TP_QuyTacTu_SoPhach/ThemMoi'] = function (o) {
        var q = QT.filter(function (x) { return x.ID === o.strId; })[0];
        if (!q) { q = { ID: moi('QTM'), PHAMVI: o.strPhamViApDung_Id }; QT.push(q); }
        q.QUYTACTAOPHACH_BUOCNHAY = o.dQuyTacTaoPhach_BuocNhay; q.QUYTACTAOPHACH_SOBATDAU = o.dQuyTacTaoPhach_SoBatDau;
        q.QUYTACTAOTUI_ID = o.strQuyTacTaoTui_Id; q.QUYTACTAOPHACH_ID = o.strQuyTacTaoPhach_Id;
        return { rows: [], raw: { Id: q.ID } };
    };

    /* danh sách thi: DOTPHACH = đợt phách đã gán ('' = chưa), TUI = túi đã dồn */
    var DST = [
        { ID: 'DST1', MADANHSACHTHI: 'KT1101-C1-P201', NGAYTHI: '05/01/2027', THI_CATHI_TEN: 'Ca 1 (07:30)', PHONG: 'P.201 - Nhà A', SOSV: 40, CHISOBAODANHBATDAU: 1, CHISOBAODANHKETTHUC: 40, HP: 'HP1', DOT: 'DOT1', DOTPHACH: 'DP1', GAN: 'G1', TUI: 'TUI1' },
        { ID: 'DST2', MADANHSACHTHI: 'KT1101-C1-P202', NGAYTHI: '05/01/2027', THI_CATHI_TEN: 'Ca 1 (07:30)', PHONG: 'P.202 - Nhà A', SOSV: 38, CHISOBAODANHBATDAU: 41, CHISOBAODANHKETTHUC: 78, HP: 'HP1', DOT: 'DOT1', DOTPHACH: 'DP1', GAN: 'G2', TUI: '' },
        { ID: 'DST3', MADANHSACHTHI: 'KT1101-C2-P201', NGAYTHI: '05/01/2027', THI_CATHI_TEN: 'Ca 2 (09:30)', PHONG: 'P.201 - Nhà A', SOSV: 35, CHISOBAODANHBATDAU: 79, CHISOBAODANHKETTHUC: 113, HP: 'HP1', DOT: 'DOT1', DOTPHACH: '', GAN: '', TUI: '' },
        { ID: 'DST4', MADANHSACHTHI: 'KT1101-C2-P203', NGAYTHI: '05/01/2027', THI_CATHI_TEN: 'Ca 2 (09:30)', PHONG: 'P.203 - Nhà A', SOSV: 42, CHISOBAODANHBATDAU: 114, CHISOBAODANHKETTHUC: 155, HP: 'HP1', DOT: 'DOT1', DOTPHACH: '', GAN: '', TUI: '' },
        { ID: 'DST5', MADANHSACHTHI: 'KT1203-C3-P305', NGAYTHI: '06/01/2027', THI_CATHI_TEN: 'Ca 3 (13:30)', PHONG: 'P.305 - Nhà B', SOSV: 45, CHISOBAODANHBATDAU: 1, CHISOBAODANHKETTHUC: 45, HP: 'HP2', DOT: 'DOT1', DOTPHACH: 'DP2', GAN: 'G5', TUI: '' },
        { ID: 'DST6', MADANHSACHTHI: 'KT1203-C3-P306', NGAYTHI: '06/01/2027', THI_CATHI_TEN: 'Ca 3 (13:30)', PHONG: 'P.306 - Nhà B', SOSV: 44, CHISOBAODANHBATDAU: 46, CHISOBAODANHKETTHUC: 89, HP: 'HP2', DOT: 'DOT1', DOTPHACH: '', GAN: '', TUI: '' }
    ];
    function dst(d) { return Object.assign({ TKB_PHONGTHI_TEN: d.PHONG, PHONGTHI_TEN: d.PHONG, THI_DOTPHACH_DANHSACHTHI_ID: d.GAN }, d); }
    fx[C + 'LayDSThiTheoDotPhach'] = function (o) { return o.strThi_DotPhach_Id ? DST.filter(function (d) { return d.DOTPHACH === o.strThi_DotPhach_Id; }).map(dst) : []; };
    fx[C + 'LayDSThiChuaGanPhachTheoDotThi'] = function (o) {
        return DST.filter(function (d) { return !d.DOTPHACH && (!o.strThi_DotThi_Id || d.DOT === o.strThi_DotThi_Id) && (!o.strDaoTao_HocPhan_Id || d.HP === o.strDaoTao_HocPhan_Id); }).map(dst);
    };
    fx['TP_DotPhach_DST/ThemMoi'] = function (o) { DST.forEach(function (d) { if (d.ID === o.strThi_DanhSachThi_Id) { d.DOTPHACH = o.strThi_DotPhach_Id; d.GAN = moi('G'); } }); return []; };
    fx['TP_DotPhach_DST/Xoa'] = function (o) { DST.forEach(function (d) { if (d.GAN === o.strIds) { d.DOTPHACH = ''; d.GAN = ''; d.TUI = ''; } }); return []; };
    fx[C + 'LayDSThiChuaGanTuiTheoDotPhach'] = function (o) { return DST.filter(function (d) { return d.DOTPHACH === o.strThi_DotPhach_Id && !d.TUI; }).map(dst); };

    /* túi bài */
    var TUI = [
        { ID: 'TUI1', TEN: 'Túi 01', TIENTO: 'A', SOBAI: 40, SOPHACHBATDAU: 1001, SOPHACHKETTHUC: 1040, DOTPHACH: 'DP1' },
        { ID: 'TUI2', TEN: 'Túi 02', TIENTO: 'A', SOBAI: 0, SOPHACHBATDAU: 1041, SOPHACHKETTHUC: '', DOTPHACH: 'DP1' }
    ];
    function tui(t) {
        var d = DOT.filter(function (x) { return x.ID === t.DOTPHACH; })[0] || {};
        return Object.assign({ THI_DOTPHACH_TEN: d.TEN, DAOTAO_HOCPHAN_TEN: d.DAOTAO_HOCPHAN_TEN, DOT: d.THI_DOTTHI_ID }, t);
    }
    fx[C + 'LayDSTuiTheoDotPhach'] = function (o) { return TUI.filter(function (t) { return t.DOTPHACH === o.strThi_DotPhach_Id; }).map(tui); };
    fx['TP_TuiBai/LayDSThi_TuiBai_DotThi'] = function (o) { return TUI.map(tui).filter(function (t) { return !o.strThi_DotThi_Id || t.DOT === o.strThi_DotThi_Id; }); };
    fx[C + 'LayTuiTiepTheoTrongDotThi'] = function () { return [{ TUITIEPTHEO: 'Túi 0' + (TUI.length + 1), SOPHACHTIEPTHEO: 1001 + TUI.length * 40 }]; };
    fx['TP_TuiBai/ThemMoi'] = function (o) {
        var id = moi('TUIM');
        TUI.push({ ID: id, TEN: o.strTen, TIENTO: o.strTienTo, SOBAI: 0, SOPHACHBATDAU: o.dSoPhachBatDau, SOPHACHKETTHUC: '', DOTPHACH: o.strThi_DotPhach_Id });
        return { rows: [], raw: { Id: id } };
    };
    fx['TP_TuiBai/CapNhat'] = function (o) { TUI.forEach(function (t) { if (t.ID === o.strId) { t.TEN = o.strTen; t.TIENTO = o.strTienTo; t.SOPHACHBATDAU = o.dSoPhachBatDau; } }); return []; };
    fx['TP_TuiBai/Xoa'] = function (o) {
        var ids = String(o.strIds).split(',');
        TUI = TUI.filter(function (t) { return ids.indexOf(t.ID) < 0; });
        DST.forEach(function (d) { if (ids.indexOf(d.TUI) >= 0) d.TUI = ''; });
        return [];
    };
    fx['TP_TuiBai_DST/Them_Thi_TuiBai_DST'] = function (o) {
        DST.forEach(function (d) { if (d.ID === o.strThi_DanhSachThi_Id) { d.TUI = o.strThi_TuiBai_Id; TUI.forEach(function (t) { if (t.ID === d.TUI) t.SOBAI = Number(t.SOBAI || 0) + d.SOSV; }); } });
        return [];
    };
    fx['TP_XuLy/TaoTui_SinhPhach_DST'] = function (o) {
        String(o.strThi_DanhSachThi_Id).split(',').forEach(function (id, i) {
            var d = DST.filter(function (x) { return x.ID === id; })[0]; if (!d) return;
            var t = { ID: moi('TUIM'), TEN: (o.strTen || 'Túi') + (i ? ' (' + (i + 1) + ')' : ''), TIENTO: o.strTienTo, SOBAI: d.SOSV, SOPHACHBATDAU: 2001 + i * 100, SOPHACHKETTHUC: 2000 + i * 100 + d.SOSV, DOTPHACH: o.strThi_DotPhach_Id };
            TUI.push(t); d.TUI = t.ID;
        });
        return [];
    };
    fx['TP_XuLy/TaoTuiBai_SinhSoPhach_NguoiHoc'] = function (o) {
        DST.filter(function (d) { return d.DOTPHACH === o.strThi_DotPhach_Id && !d.TUI; }).forEach(function (d, i) {
            var t = { ID: moi('TUIM'), TEN: 'Túi tự động ' + (i + 1), TIENTO: '', SOBAI: d.SOSV, SOPHACHBATDAU: 3001 + i * 100, SOPHACHKETTHUC: 3000 + i * 100 + d.SOSV, DOTPHACH: o.strThi_DotPhach_Id };
            TUI.push(t); d.TUI = t.ID;
        });
        return [];
    };
    fx['TP_XuLy/SinhSoPhachTheoTuiBai'] = function (o) { TUI.forEach(function (t) { if (t.ID === o.strThi_TuiBai_Id && t.SOBAI) t.SOPHACHKETTHUC = Number(t.SOPHACHBATDAU) + Number(t.SOBAI) - 1; }); return []; };
    fx['TP_XuLy/XoaSoPhachTheoTuiBai'] = function (o) { var ids = String(o.strThi_TuiBai_Id).split(','); TUI.forEach(function (t) { if (ids.indexOf(t.ID) >= 0) t.SOPHACHKETTHUC = ''; }); return []; };
    fx['TP_ThongTin/LayDSQuyTacPhanDoan'] = [{ ID: 'PD1', TEN: 'Phân đoạn theo phòng thi' }, { ID: 'PD2', TEN: 'Phân đoạn 20 bài' }];

    /* sinh viên trong túi */
    var SV = [
        { ID: 'TN1', TUI: 'TUI1', SOBAODANH: 1, TIENTO: 'A', SOPHACH: 1001, QLSV_NGUOIHOC_MASO: 'BBA220561', QLSV_NGUOIHOC_HODEM: 'Nguyễn Thị', QLSV_NGUOIHOC_TEN: 'An', DAOTAO_LOPQUANLY_TEN: 'QTKD.22.01', THI_DANHSACHTHI_TEN: 'KT1101-C1-P201' },
        { ID: 'TN2', TUI: 'TUI1', SOBAODANH: 2, TIENTO: 'A', SOPHACH: 1002, QLSV_NGUOIHOC_MASO: 'BBA220574', QLSV_NGUOIHOC_HODEM: 'Trần Văn', QLSV_NGUOIHOC_TEN: 'Bình', DAOTAO_LOPQUANLY_TEN: 'QTKD.22.01', THI_DANHSACHTHI_TEN: 'KT1101-C1-P201' },
        { ID: 'TN3', TUI: 'TUI1', SOBAODANH: 3, TIENTO: 'A', SOPHACH: 1003, QLSV_NGUOIHOC_MASO: 'BIT220263', QLSV_NGUOIHOC_HODEM: 'Lê Hoàng', QLSV_NGUOIHOC_TEN: 'Cường', DAOTAO_LOPQUANLY_TEN: 'CNTT.22.03', THI_DANHSACHTHI_TEN: 'KT1101-C1-P201' },
        { ID: 'TN4', TUI: '', SOBAODANH: 41, TIENTO: '', SOPHACH: '', QLSV_NGUOIHOC_MASO: 'BIT220301', QLSV_NGUOIHOC_HODEM: 'Phạm Thu', QLSV_NGUOIHOC_TEN: 'Dung', DAOTAO_LOPQUANLY_TEN: 'CNTT.22.03', THI_DANHSACHTHI_TEN: 'KT1101-C1-P202' },
        { ID: 'TN5', TUI: '', SOBAODANH: 42, TIENTO: '', SOPHACH: '', QLSV_NGUOIHOC_MASO: 'BBA220612', QLSV_NGUOIHOC_HODEM: 'Vũ Minh', QLSV_NGUOIHOC_TEN: 'Đức', DAOTAO_LOPQUANLY_TEN: 'QTKD.22.02', THI_DANHSACHTHI_TEN: 'KT1101-C1-P202' }
    ];
    fx[C + 'LayDSNguoiHocTheoTuiBai'] = function (o) { return SV.filter(function (s) { return s.TUI === o.strThi_TuiBai_Id; }); };
    fx['TP_XuLy/LayDSNguoiHocChuaDonTui'] = function () {
        return SV.filter(function (s) { return !s.TUI; }).map(function (s) { return { ID: s.ID, MASO: s.QLSV_NGUOIHOC_MASO, HOTEN: s.QLSV_NGUOIHOC_HODEM + ' ' + s.QLSV_NGUOIHOC_TEN, SOBAODANH: s.SOBAODANH }; });
    };
    fx['TP_XuLy/Them_Thi_Tui_NH_ThuCong'] = function (o) {
        SV.forEach(function (s) { if (s.ID === o.strThi_DanhSachSinhVien_Id) { s.TUI = o.strThi_TuiBai_Id; s.TIENTO = o.strTienTo; s.SOPHACH = o.strSoPhach; } });
        return [];
    };
    fx['TP_XuLy/Xoa_Thi_Tui_NH_ThuCong'] = function (o) { SV.forEach(function (s) { if (s.ID === o.strThi_TuiBai_NguoiHoc_Id) { s.TUI = ''; s.SOPHACH = ''; } }); return []; };

    ums.demo.add(fx);
})();
