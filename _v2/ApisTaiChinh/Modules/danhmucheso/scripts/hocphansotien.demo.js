/* Dữ liệu mẫu cho hocphansotien — chỉ dùng ở chế độ dựng thử.
   Hệ/khoá/chương trình/học kỳ/kiểu học dùng chung nằm trong _chung_a.js;
   khoản thu (TC_KhoanThu/LayDanhSach, KT1…KT5) có sẵn trong assets/js/demo-data.js. */
(function () {
    var HP = [
        { ID: 'X1', DAOTAO_HOCPHAN_ID: 'HP1', DAOTAO_HOCPHAN_MA: 'INT1001', DAOTAO_HOCPHAN_TEN: 'Nhập môn lập trình', DAOTAO_HOCPHAN_SOTC: 3 },
        { ID: 'X2', DAOTAO_HOCPHAN_ID: 'HP2', DAOTAO_HOCPHAN_MA: 'INT2203', DAOTAO_HOCPHAN_TEN: 'Cấu trúc dữ liệu và giải thuật', DAOTAO_HOCPHAN_SOTC: 4 },
        { ID: 'X3', DAOTAO_HOCPHAN_ID: 'HP3', DAOTAO_HOCPHAN_MA: 'INT2211', DAOTAO_HOCPHAN_TEN: 'Cơ sở dữ liệu', DAOTAO_HOCPHAN_SOTC: 3 },
        { ID: 'X4', DAOTAO_HOCPHAN_ID: 'HP4', DAOTAO_HOCPHAN_MA: 'PES1001', DAOTAO_HOCPHAN_TEN: 'Giáo dục thể chất 1', DAOTAO_HOCPHAN_SOTC: 1 },
        { ID: 'X5', DAOTAO_HOCPHAN_ID: 'HP5', DAOTAO_HOCPHAN_MA: 'FLF1107', DAOTAO_HOCPHAN_TEN: 'Tiếng Anh B1', DAOTAO_HOCPHAN_SOTC: 5 }
    ];
    var TGTEN = { TG1: 'Học kỳ 1 năm 2025-2026', TG2: 'Học kỳ 2 năm 2025-2026', TG4: 'Học kỳ 1 năm 2026-2027' };
    function r(id, hp, tg, kt, kh, tien) {
        return { ID: id, DAOTAO_HOCPHAN_ID: hp, DAOTAO_THOIGIANDAOTAO_ID: tg, DAOTAO_THOIGIANDAOTAO_HOCKY: TGTEN[tg],
                 TAICHINH_CACKHOANTHU_ID: kt, KIEUHOC_ID: kh, TONGSOTIEN: tien };
    }
    var SOTIEN = [
        r('ST01', 'HP1', 'TG1', 'KT1', 'KHO1', '1350000'), r('ST02', 'HP1', 'TG1', 'KT1', 'KHO2', '1620000'),
        r('ST03', 'HP1', 'TG1', 'KT2', 'KHO2', '1620000'), r('ST04', 'HP1', 'TG2', 'KT1', 'KHO1', '1350000'),
        r('ST05', 'HP1', 'TG2', 'KT1', 'KHO3', '1080000'), r('ST06', 'HP1', 'TG4', 'KT2', 'KHO2', '1750000'),
        r('ST07', 'HP2', 'TG1', 'KT1', 'KHO1', '1800000'), r('ST08', 'HP2', 'TG2', 'KT1', 'KHO2', '2160000'),
        r('ST09', 'HP4', 'TG2', 'KT1', 'KHO1', '450000'),  r('ST10', 'HP5', 'TG4', 'KT2', 'KHO2', '2250000')
    ];
    ums.demo.add({
        'pkg_kehoach_thongtin.LayDSKS_HocPhan_ChuongTrinh': HP,
        'TC_HocPhan_SoTien/LayDanhSach': function (o) {
            return SOTIEN.filter(function (x) { return !o.strDaoTao_HocPhan_Id || x.DAOTAO_HOCPHAN_ID === o.strDaoTao_HocPhan_Id; });
        }
    });
})();
