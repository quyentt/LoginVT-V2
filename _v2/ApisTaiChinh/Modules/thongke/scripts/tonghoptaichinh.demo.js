/* Dữ liệu mẫu cho tonghoptaichinh — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';

    function k(nam, ten, dt, pn, mien, rut) {
        return { NAMNHAPHOC: nam, TENKHOA: ten, TONGDOANHTHU: dt, TONGPHAINOP: pn, TONGMIEN: mien, TONGRUT: rut, TONG_DU_NO: dt - pn + mien - rut };
    }
    var KHOA = [
        k('2024', 'Công nghệ thông tin', 18200000000, 19100000000, 420000000, 80000000),
        k('2024', 'Kinh tế', 12500000000, 12900000000, 310000000, 45000000),
        k('2024', 'Ngoại ngữ', 7400000000, 7650000000, 150000000, 20000000),
        k('2025', 'Công nghệ thông tin', 20100000000, 21400000000, 380000000, 60000000),
        k('2025', 'Kinh tế', 13800000000, 14200000000, 290000000, 35000000),
        k('2025', 'Ngoại ngữ', 8100000000, 8300000000, 120000000, 10000000)
    ];

    var CT = [
        { MASO: 'BIT230112', HOVATEN: 'Nguyễn Văn An', TAICHINH_CACKHOANTHU_TEN: 'Học phí', SOTIEN: 12500000 },
        { MASO: 'BBA230561', HOVATEN: 'Trần Thị Bích', TAICHINH_CACKHOANTHU_TEN: 'Học phí', SOTIEN: 11800000 },
        { MASO: 'BIT240033', HOVATEN: 'Lê Hoàng Cường', TAICHINH_CACKHOANTHU_TEN: 'Bảo hiểm y tế', SOTIEN: 680000 },
        { MASO: 'BEN240210', HOVATEN: 'Phạm Minh Đức', TAICHINH_CACKHOANTHU_TEN: 'Phí ký túc xá', SOTIEN: 3600000 }
    ];

    ums.demo.add({
        'TC_ThongKe/LayDuLieuTongHopDuLieuTheoKhoa': [{
            TONGDOANHTHU: 80100000000, TONGPHAINOP: 83550000000, TONGMIEN: 1670000000, TONGRUT: 250000000, TONG_DU_NO: -2030000000
        }],
        'TC_ThongKe/LayDuLieuTongHop': KHOA,
        'TC_ThongKe/LayDuLieuTongHopTheoKhoanThu': [
            { TEN: 'Học phí', TONGDOANHTHU: 71200000000, TONGPHAINOP: 74000000000, TONGMIEN: 1600000000, TONGRUT: 200000000, TONG_DU_NO: -1400000000 },
            { TEN: 'Bảo hiểm y tế', TONGDOANHTHU: 5100000000, TONGPHAINOP: 5500000000, TONGMIEN: 70000000, TONGRUT: 30000000, TONG_DU_NO: -360000000 },
            { TEN: 'Phí ký túc xá', TONGDOANHTHU: 3800000000, TONGPHAINOP: 4050000000, TONGMIEN: 0, TONGRUT: 20000000, TONG_DU_NO: -270000000 }
        ],
        'TC_ThongKe/LayCTDuLieuTongHop': { rows: CT, pager: 4 }
    });
})();
