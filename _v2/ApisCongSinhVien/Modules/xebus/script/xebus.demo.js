/* Dữ liệu mẫu cho xebus (Đăng ký xe buýt) — chỉ dùng ở chế độ dựng thử.
   Người học mẫu: SV0001. Các lời GHI đổi luôn trạng thái trong bộ nhớ để bấm
   Đăng ký / Hủy đăng ký là thấy màn hình đổi theo. */
(function () {
    var P = 'pkg_hososinhvien_xebus.', fx = {}, seq = 100;

    var KE_HOACH = [
        { ID: 'KHB1', TENKEHOACH: 'Đăng ký xe buýt học kỳ 1 năm học 2026 - 2027' },
        { ID: 'KHB2', TENKEHOACH: 'Đăng ký xe buýt học kỳ 2 năm học 2026 - 2027' }
    ];

    /* Tháng mở đăng ký theo từng kế hoạch */
    var THANG = {
        KHB1: [{ THANG: 9, NAM: 2026 }, { THANG: 10, NAM: 2026 }, { THANG: 11, NAM: 2026 },
            { THANG: 12, NAM: 2026 }, { THANG: 1, NAM: 2027 }],
        KHB2: [{ THANG: 2, NAM: 2027 }, { THANG: 3, NAM: 2027 }, { THANG: 4, NAM: 2027 },
            { THANG: 5, NAM: 2027 }, { THANG: 6, NAM: 2027 }]
    };
    var TUYEN = {
        KHB1: [
            { ID: 'TX1', TEN: 'Tuyến 01: Cơ sở chính - Bến xe Mỹ Đình', MOTA: 'Xuất phát 6h15, đón tại Cầu Giấy - Xuân Thủy - Hồ Tùng Mậu' },
            { ID: 'TX2', TEN: 'Tuyến 02: Cơ sở chính - Hà Đông', MOTA: 'Xuất phát 6h00, đón tại Quang Trung - Trần Phú - Nguyễn Trãi' },
            { ID: 'TX3', TEN: 'Tuyến 03: Cơ sở chính - Long Biên', MOTA: 'Xuất phát 5h50, đón tại Ngọc Lâm - Nguyễn Văn Cừ - Cầu Chương Dương' },
            { ID: 'TX4', TEN: 'Tuyến 04: Cơ sở chính - Ký túc xá Pháp Vân', MOTA: 'Xuất phát 6h30, chạy thẳng không đón dọc đường' }
        ],
        KHB2: [
            { ID: 'TX1', TEN: 'Tuyến 01: Cơ sở chính - Bến xe Mỹ Đình', MOTA: 'Xuất phát 6h15, đón tại Cầu Giấy - Xuân Thủy - Hồ Tùng Mậu' },
            { ID: 'TX2', TEN: 'Tuyến 02: Cơ sở chính - Hà Đông', MOTA: 'Xuất phát 6h00, đón tại Quang Trung - Trần Phú - Nguyễn Trãi' },
            { ID: 'TX5', TEN: 'Tuyến 05: Cơ sở chính - Khu công nghệ cao Hòa Lạc', MOTA: 'Chỉ chạy các ngày có lịch thực tập' }
        ]
    };

    /* Kết quả đăng ký của người học — theo kế hoạch */
    var DK = {
        KHB1: {
            hoSo: { ID: 'DKB1', DIENTHOAILIENHE: '0987 654 321', NOINOPDONVANHANTHE: 'Phòng Công tác sinh viên - Nhà A1', ANHCANHAN: '' },
            thang: [{ ID: 'TDK1', THANG: 9, NAM: 2026 }, { ID: 'TDK2', THANG: 10, NAM: 2026 }],
            tuyen: [{ ID: 'TUDK1', QLSV_XEBUS_TUYENXE_ID: 'TX2' }]
        },
        KHB2: { hoSo: null, thang: [], tuyen: [] }
    };
    function kho(id) {
        if (!DK[id]) DK[id] = { hoSo: null, thang: [], tuyen: [] };
        return DK[id];
    }

    fx[P + 'LayDSKeHoach_DichVu_XeBus'] = KE_HOACH;

    fx[P + 'LayDSThangDangKyTheoKeHoach'] = function (o) {
        var id = o.strQLSV_KeHoach_XeBus_Id;
        if (!id) return { rs: [], rsKetQuaCaNhan: [] };
        return { rs: THANG[id] || [], rsKetQuaCaNhan: kho(id).thang };
    };
    fx[P + 'LayDSQLSV_XeBus_TuyenXe_KH'] = function (o) {
        var id = o.strQLSV_KeHoach_XeBus_Id;
        if (!id) return { rs: [], rsKetQuaCaNhan: [] };
        return { rs: TUYEN[id] || [], rsKetQuaCaNhan: kho(id).tuyen };
    };
    fx[P + 'LayDSKeHoach_XeBus_DangKy'] = function (o) {
        var k = kho(o.strQLSV_KeHoach_XeBus_Id);
        return k.hoSo ? [k.hoSo] : [];
    };

    fx[P + 'Them_KeHoach_XeBus_DangKy'] = function (o) {
        var k = kho(o.strQLSV_KeHoach_XeBus_Id);
        k.hoSo = {
            ID: (k.hoSo && k.hoSo.ID) || ('DKB' + (seq++)),
            DIENTHOAILIENHE: o.strDienThoaiLienHe || '',
            NOINOPDONVANHANTHE: o.strNoiNopDonVaNhanThe || '',
            ANHCANHAN: o.strAnhCaNhan || ''
        };
        return [];
    };
    fx[P + 'Them_XeBus_ThangDangKy'] = function (o) {
        var k = kho(o.strQLSV_KeHoach_XeBus_Id);
        k.thang.push({ ID: 'TDK' + (seq++), THANG: Number(o.dThang), NAM: Number(o.dNam) });
        return [];
    };
    fx[P + 'Xoa_XeBus_ThangDangKy'] = function (o) {
        var k = kho(o.strQLSV_KeHoach_XeBus_Id);
        k.thang = k.thang.filter(function (x) { return !(String(x.THANG) === String(o.dThang) && String(x.NAM) === String(o.dNam)); });
        return [];
    };
    fx[P + 'Them_XeBus_TuyenDangKy'] = function (o) {
        var k = kho(o.strQLSV_KeHoach_XeBus_Id);
        k.tuyen.push({ ID: 'TUDK' + (seq++), QLSV_XEBUS_TUYENXE_ID: o.strQLSV_XeBus_TuyenXe_Id });
        return [];
    };
    fx[P + 'Xoa_XeBus_TuyenDangKy'] = function (o) {
        var k = kho(o.strQLSV_KeHoach_XeBus_Id);
        k.tuyen = k.tuyen.filter(function (x) { return x.QLSV_XEBUS_TUYENXE_ID !== o.strQLSV_XeBus_TuyenXe_Id; });
        return [];
    };
    fx[P + 'HuyDangKy'] = function (o) {
        DK[o.strQLSV_KeHoach_XeBus_Id] = { hoSo: null, thang: [], tuyen: [] };
        return [];
    };

    ums.demo.add(fx);
})();
