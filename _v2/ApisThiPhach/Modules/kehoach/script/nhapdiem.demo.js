/* Dữ liệu mẫu cho nhapdiem (Nhập điểm theo phách — Thi phách) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {};
    var DOT = [{ ID: 'DP1', TEN: 'Đợt phách IT3100 - Ca 2 - 06/01/2027', QUYTACTAOTUI_TEN: 'Theo phòng thi', QUYTACTAOPHACH_TEN: 'Tăng dần', BUOCNHAY: 1, SOBATDAU: 1001, DSNHANSUCHAMTHI: 'Trần Văn Hùng; Lê Thị Mai', HP: 'HP1' },
        { ID: 'DP2', TEN: 'Đợt phách IT3090 - Ca 3 - 07/01/2027', QUYTACTAOTUI_TEN: 'Theo phòng thi', QUYTACTAOPHACH_TEN: 'Ngẫu nhiên', BUOCNHAY: 3, SOBATDAU: 2001, DSNHANSUCHAMTHI: '', HP: 'HP2' },
        { ID: 'DP3', TEN: 'Đợt phách EC1010 - Ca 1 - 08/01/2027', QUYTACTAOTUI_TEN: 'Theo số bài', QUYTACTAOPHACH_TEN: 'Tăng dần', BUOCNHAY: 1, SOBATDAU: 3001, DSNHANSUCHAMTHI: '', HP: 'HP3' }];
    fx['TP_Chung/LayDotTaoPhach'] = function (o) {
        return DOT.filter(function (x) { return !o.strDaoTao_HocPhan_Id || x.HP === o.strDaoTao_HocPhan_Id; })
            .map(function (x) { x.NGAYNHANBAI = (ums.demo.tpNdNgay || {})[x.ID] || x.NGAYNHANBAI || ''; return x; });
    };
    fx['TP_Chung/LayDSTuiTheoDotPhach'] = function (o) {
        return o.strThi_DotPhach_Id === 'DP1' ? [{ ID: 'TUI1', TEN: 'Túi 01 - A2-301' }, { ID: 'TUI2', TEN: 'Túi 02 - A2-302' }] : (o.strThi_DotPhach_Id === 'DP2' ? [{ ID: 'TUI3', TEN: 'Túi 01 - B1-201' }] : []);
    };
    function phach(tui, dau, n) {
        var ra = [];
        for (var i = 0; i < n; i++) ra.push({ ID: tui + 'P' + (dau + i), SOPHACH: dau + i, DIEMBANDAU: i < 2 ? [7.5, 6][i] : '', THONGTINXULY: i === 3 ? 'Khiển trách (trừ 25%)' : '',
            NGUOISUA_TAIKHOAN: i < 2 ? 'hungtv' : '', NGAYSUA_DD_MM_YYYY: i < 2 ? '10/01/2027' : '', QLSV_NGUOIHOC_ID: 'SV' + tui + i,
            CAMTHI_DUYETDKTHI: '0', CAMTHI_VIPHAMQUYCHE: i === 4 ? '1' : '0' });
        return ra;
    }
    var PH = { TUI1: phach('TUI1', 1001, 6), TUI2: phach('TUI2', 1007, 4), TUI3: phach('TUI3', 2001, 5) };
    fx['TP_XuLy/LayDSPhachTheoTui'] = function (o) { return PH[o.strThi_TuiBai_Id] || []; };
    fx['TP_XuLy/CapNhat_DiemPhachTheoTuiBai'] = function (o) {
        Object.keys(PH).forEach(function (k) { PH[k].forEach(function (p) {
            if (p.ID === o.strThi_TuiBai_NguoiHoc_Id) { p.DIEMBANDAU = o.strDiem; p.NGUOISUA_TAIKHOAN = 'khaothi01'; p.NGAYSUA_DD_MM_YYYY = '28/09/2026'; }
        }); });
        return [];
    };
    ums.demo.tpNdXacNhan = null;
    ums.demo.add(fx);
})();
