/* Dữ liệu mẫu cho Tổng quan NCKH — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function chuoi(so) {
        return function (o) {
            var d = [], bd = Number(o.strNamBatDau) || 2021;
            so.forEach(function (n, i) { d.push({ NAM: String(bd + i), SOLUONG: n }); });
            return d;
        };
    }
    ums.demo.add({
        'NCKH_TK_DeTai/ThongKeDeTaiHangNam': chuoi([12, 15, 11, 18, 22, 9]),
        'NCKH_TK_Sach/ThongKeSachHangNam': chuoi([4, 6, 5, 7, 8, 3]),
        'NCKH_TK_TapChiQuocTe/ThongKeTapChiQuocTeHangNam': chuoi([20, 26, 31, 38, 45, 17]),
        'NCKH_TK_TapChiQuocGia/ThongKeTapChiQuocGiaHangNam': chuoi([55, 61, 58, 64, 70, 28])
    });
})();
