/* Dữ liệu mẫu cho chamkiemtradst / champhach (khung _tp_cham.js) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var C = 'TP_Chung/', K = 'TP_ChamKiemTra/', fx = {};
    fx[C + 'LayThoiGian'] = [{ ID: 'TG1', THOIGIAN: '2026_2027_1' }, { ID: 'TG2', THOIGIAN: '2025_2026_2' }];
    fx[C + 'LayLoaiDiem'] = function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'LD1', TEN: 'Điểm thi cuối kỳ' }, { ID: 'LD2', TEN: 'Điểm giữa kỳ' }] : []; };
    fx[C + 'LayHinhThucThi'] = function (o) { return o.strDiem_ThanhPhanDiem_Id ? [{ ID: 'HT1', TEN: 'Tự luận' }, { ID: 'HT2', TEN: 'Vấn đáp' }] : []; };
    fx[C + 'LayDotThi'] = function (o) { return o.strHinhThucThi_Id ? [{ ID: 'DOT1', TEN: 'Đợt 1 HK1' }, { ID: 'DOT2', TEN: 'Đợt 2 HK1' }] : []; };
    fx[C + 'LayHocPhan'] = function (o) { return o.strDotThi_Id ? [{ ID: 'HP1', TEN: 'Lập trình hướng đối tượng', MA: 'IT3100' }, { ID: 'HP2', TEN: 'Cơ sở dữ liệu', MA: 'IT3090' }] : []; };

    /* ---- Theo danh sách thi ---- */
    var SV = [['2201', 'Trần Minh', 'Anh', 7.5], ['2202', 'Lê Thu', 'Hà', 8], ['2203', 'Phạm Quốc', 'Bảo', 4.5], ['2204', 'Ngô Bảo', 'Châu', 9],
        ['2205', 'Đỗ Thị', 'Dung', 6], ['2206', 'Vũ Hoàng', 'Giang', 5.5], ['2207', 'Bùi Thanh', 'Hương', 7], ['2208', 'Đặng Văn', 'Khoa', 3]].map(function (x, i) {
        return { ID: 'DSSV' + (i + 1), QLSV_NGUOIHOC_MASO: 'DCQT.14.' + x[0], QLSV_NGUOIHOC_HODEM: x[1], QLSV_NGUOIHOC_TEN: x[2], DAOTAO_LOPQUANLY_TEN: i < 4 ? 'KTPM01-K14' : 'KTPM02-K14',
            DIEM_THANHPHANDIEM_TEN: 'Điểm thi cuối kỳ', LANHOC: 1, LANTHI: i === 7 ? 2 : 1, SOBAODANH: ('00' + (i + 1)).slice(-3), DIEMBANDAU: x[3],
            DIEM_DANHSACHHOC_TEN: 'IT3100.0' + (i < 4 ? 1 : 2), THI_DANHSACHTHI_TEN: 'DST-IT3100-0' + (i < 4 ? 1 : 2), DAOTAO_HOCPHAN_MA: 'IT3100', DAOTAO_HOCPHAN_TEN: 'Lập trình hướng đối tượng' };
    });
    /* ---- Theo túi / phách ---- */
    var PH = [['P1001', 7.5, ''], ['P1002', 6, ''], ['P1003', 0, 'Đình chỉ thi'], ['P1004', 8.5, ''], ['P1005', 5, 'Khiển trách (trừ 25%)'], ['P1006', 9, '']].map(function (x, i) {
        return { ID: 'TUISV' + (i + 1), SOPHACH: x[0], DIEMBANDAU: x[1], THONGTINXULY: x[2] };
    });
    var DA = { dst: { DSSV2: 1 }, tui: { TUISV4: 1 } };

    function loc(ds, o) {
        var q = String(o.strTuKhoa || '').toLowerCase();
        return ds.filter(function (x) {
            return !q || [x.QLSV_NGUOIHOC_MASO, x.QLSV_NGUOIHOC_HODEM, x.QLSV_NGUOIHOC_TEN, x.SOPHACH].join(' ').toLowerCase().indexOf(q) >= 0;
        });
    }
    function ngau(ds, o) {
        var pt = Number(o.dTyLePhanTram);
        if (!(pt > 0)) pt = 50;
        var n = Math.max(1, Math.round(ds.length * Math.min(pt, 100) / 100));
        return ds.filter(function (x, i) { return i % Math.max(1, Math.floor(ds.length / n)) === 0; }).slice(0, n);
    }
    function bo(k, ds) {
        return {
            ds: function (o) { return (o.strDotThi_Id || o.strThi_DotThi_Id) ? loc(ds, o) : []; },
            nn: function (o) { return (o.strDotThi_Id || o.strThi_DotThi_Id) ? ngau(loc(ds, o), o) : []; },
            kq: function (o) { return loc(ds, o).filter(function (x) { return DA[k][x.ID]; }); },
            them: function (o) { DA[k][o.strId] = 1; return []; },
            xoa: function (o) { delete DA[k][o.strId]; return []; }
        };
    }
    var D = bo('dst', SV), U = bo('tui', PH);
    fx[K + 'LayDSTheoDST'] = D.ds; fx[K + 'LayDSNgauNhienTheoDST'] = D.nn; fx[K + 'LayDSTheoDSTChamKT'] = D.kq;
    fx[K + 'Them_Thi_DSSV_ChamKT'] = D.them; fx[K + 'Xoa_Thi_DSSV_ChamKT'] = D.xoa;
    fx[K + 'LayDSTheoTui'] = U.ds; fx[K + 'LayDSNgauNhienTheoTui'] = U.nn; fx[K + 'LayDSTheoTuiChamKT'] = U.kq;
    fx[K + 'Them_Thi_DSSV_Tui_ChamKT'] = U.them; fx[K + 'Xoa_Thi_DSSV_Tui_ChamKT'] = U.xoa;
    ums.demo.add(fx);
})();
