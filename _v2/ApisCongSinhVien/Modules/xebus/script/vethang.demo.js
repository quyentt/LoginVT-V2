/* Dữ liệu mẫu cho vethang (Vé tháng) — chỉ dùng ở chế độ dựng thử.
   Người học mẫu: SV0001. Đăng ký / hủy đổi luôn trạng thái trong bộ nhớ. */
(function () {
    var P = 'pkg_hososinhvien_vethang.', fx = {}, seq = 200;

    var KE_HOACH = [
        { ID: 'KHV1', TENKEHOACH: 'Vé xe tháng học kỳ 1 năm học 2026 - 2027' },
        { ID: 'KHV2', TENKEHOACH: 'Vé xe tháng học kỳ hè 2026' }
    ];

    var LOAI_XE = [
        { ID: 'LX1', MA: 'XM', TEN: 'Xe máy' },
        { ID: 'LX2', MA: 'XD', TEN: 'Xe đạp' },
        { ID: 'LX3', MA: 'XDD', TEN: 'Xe đạp điện' },
        { ID: 'LX4', MA: 'XMD', TEN: 'Xe máy điện' },
        { ID: 'LX5', MA: 'OTO', TEN: 'Ô tô' }
    ];
    var TEN_XE = {};
    LOAI_XE.forEach(function (x) { TEN_XE[x.ID] = x.TEN; });

    /* Loại vé mở bán theo từng kế hoạch */
    var VE = {
        KHV1: [
            { LOAIVE_ID: 'LV1', LOAIVE_TEN: 'Vé gửi xe máy cả học kỳ', SOTIEN: 450000, DSTHANG: 'T9/2026; T10/2026; T11/2026; T12/2026; T1/2027' },
            { LOAIVE_ID: 'LV2', LOAIVE_TEN: 'Vé gửi xe đạp cả học kỳ', SOTIEN: 250000, DSTHANG: 'T9/2026; T10/2026; T11/2026; T12/2026; T1/2027' },
            { LOAIVE_ID: 'LV3', LOAIVE_TEN: 'Vé gửi xe máy theo tháng', SOTIEN: 100000, DSTHANG: 'T9/2026' },
            { LOAIVE_ID: 'LV4', LOAIVE_TEN: 'Vé gửi ô tô theo tháng', SOTIEN: 800000, DSTHANG: 'T9/2026' }
        ],
        KHV2: [
            { LOAIVE_ID: 'LV5', LOAIVE_TEN: 'Vé gửi xe máy học kỳ hè', SOTIEN: 180000, DSTHANG: 'T6/2026; T7/2026' },
            { LOAIVE_ID: 'LV6', LOAIVE_TEN: 'Vé gửi xe đạp học kỳ hè', SOTIEN: 100000, DSTHANG: 'T6/2026; T7/2026' }
        ]
    };

    /* Đã đăng ký — theo kế hoạch */
    var DK = {
        KHV1: [{
            ID: 'VDK1', LOAIVE_ID: 'LV2', LOAIVE_TEN: 'Vé gửi xe đạp cả học kỳ', BIENSO: '', LOAIXE: 'Xe đạp',
            SOTIEN: 250000, DSTHANG: 'T9/2026; T10/2026; T11/2026; T12/2026; T1/2027'
        }],
        KHV2: []
    };
    function kho(id) {
        if (!DK[id]) DK[id] = [];
        return DK[id];
    }
    function daDangKy(id) {
        var m = {};
        kho(id).forEach(function (x) { m[x.LOAIVE_ID] = true; });
        return m;
    }

    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLSV.VE.LOAIXE'] = LOAI_XE;
    fx[P + 'LayDSKeHoachVeThang'] = KE_HOACH;

    fx[P + 'LayDSKeHoach_DichVu_Phi_ChuaDK'] = function (o) {
        var id = o.strQLSV_KeHoach_DichVu_Ve_Id;
        if (!id) return [];
        var da = daDangKy(id);
        return (VE[id] || []).filter(function (x) { return !da[x.LOAIVE_ID]; });
    };
    fx[P + 'LayDSQLSV_KeHoach_Ve_DangKy'] = function (o) {
        var id = o.strQLSV_KeHoach_DichVu_Ve_Id;
        return id ? kho(id) : [];
    };
    fx[P + 'Them_QLSV_KeHoach_Ve_DangKy'] = function (o) {
        var id = o.strQLSV_KeHoach_DichVu_Ve_Id;
        var ve = (VE[id] || []).filter(function (x) { return x.LOAIVE_ID === o.strLoaiVe_Id; })[0];
        if (!ve) return [];
        kho(id).push({
            ID: 'VDK' + (seq++), LOAIVE_ID: ve.LOAIVE_ID, LOAIVE_TEN: ve.LOAIVE_TEN,
            BIENSO: o.strBienSoXe || '', LOAIXE: TEN_XE[o.strLoaiXe_Id] || '',
            SOTIEN: ve.SOTIEN, DSTHANG: ve.DSTHANG
        });
        return [];
    };
    fx[P + 'Xoa_QLSV_KeHoach_Ve_DangKy'] = function (o) {
        Object.keys(DK).forEach(function (k) {
            DK[k] = DK[k].filter(function (x) { return x.ID !== o.strId; });
        });
        return [];
    };

    ums.demo.add(fx);
})();
