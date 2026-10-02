/* Dữ liệu mẫu cho donviphimoict — chỉ dùng ở chế độ dựng thử.
   Hệ/khoá/chương trình/thời gian/kiểu học dùng chung nằm trong _chung_a.js. */
(function () {
    var KKT = [
        { ID: 'KKT1', PHAMVIAPDUNG_ID: 'KKT1', TEN: 'Kiến thức giáo dục đại cương', MA: 'DC', CHUONGTRINH_ID: 'CT1', CHUONGTRINH_TEN: 'Công nghệ thông tin', CHUONGTRINH_MA: '7480201' },
        { ID: 'KKT2', PHAMVIAPDUNG_ID: 'KKT2', TEN: 'Kiến thức cơ sở ngành', MA: 'CSN', CHUONGTRINH_ID: 'CT1', CHUONGTRINH_TEN: 'Công nghệ thông tin', CHUONGTRINH_MA: '7480201' },
        { ID: 'KKT3', PHAMVIAPDUNG_ID: 'KKT3', TEN: 'Kiến thức chuyên ngành', MA: 'CN', CHUONGTRINH_ID: 'CT1', CHUONGTRINH_TEN: 'Công nghệ thông tin', CHUONGTRINH_MA: '7480201' },
        { ID: 'KKT4', PHAMVIAPDUNG_ID: 'KKT4', TEN: 'Kiến thức giáo dục đại cương', MA: 'DC', CHUONGTRINH_ID: 'CT3', CHUONGTRINH_TEN: 'Quản trị kinh doanh', CHUONGTRINH_MA: '7340101' },
        { ID: 'KKT5', PHAMVIAPDUNG_ID: 'KKT5', TEN: 'Thực tập và khoá luận', MA: 'TT', CHUONGTRINH_ID: 'CT3', CHUONGTRINH_TEN: 'Quản trị kinh doanh', CHUONGTRINH_MA: '7340101' }
    ];
    KKT.forEach(function (r) {
        r.DAOTAO_KHOAHOC_TEN = 'K67 (2022-2026)'; r.DAOTAO_KHOAHOC_MA = 'K67';
        r.DAOTAO_KHOAQUANLY_TEN = r.CHUONGTRINH_ID === 'CT1' ? 'Khoa Công nghệ thông tin' : 'Khoa Kinh tế';
    });
    ums.demo.add({
        'TC_DonViPhi_SoTien/LayDSThoiGian_DonViPhi_SoTien': [
            { ID: 'TG1', THOIGIAN: 'HK1 2025-2026' },
            { ID: 'TG2', THOIGIAN: 'HK2 2025-2026' }
        ],
        'TC_ThuChi2/LayDSTaiChinh_KhoiKT_DonViPhi': function (o) {
            return KKT.filter(function (r) { return !o.strChuongTrinh_Id || r.CHUONGTRINH_ID === o.strChuongTrinh_Id; });
        },
        'KHCT_ToChucChuongTrinh/LayDSNganhTheoKhoa': [
            { ID: 'NG1', MA: '7480201', TEN: 'Công nghệ thông tin' },
            { ID: 'NG2', MA: '7340101', TEN: 'Quản trị kinh doanh' },
            { ID: 'NG3', MA: '7220201', TEN: 'Ngôn ngữ Anh' }
        ],
        'TC_DonViPhi_SoTien/LayDanhSach': [
            { ID: 'DK1', PHAMVIAPDUNG_ID: 'KKT1', DAOTAO_THOIGIANDAOTAO_ID: 'TG1', TONGSOTIEN: 380000, TAICHINH_CACKHOANTHU_ID: 'KT1', KIEUHOC_ID: 'KHO1', NGAYAPDUNG: '01/08/2025' },
            { ID: 'DK2', PHAMVIAPDUNG_ID: 'KKT2', DAOTAO_THOIGIANDAOTAO_ID: 'TG1', TONGSOTIEN: 420000, TAICHINH_CACKHOANTHU_ID: 'KT1', KIEUHOC_ID: 'KHO1', NGAYAPDUNG: '01/08/2025' },
            { ID: 'DK3', PHAMVIAPDUNG_ID: 'KKT3', DAOTAO_THOIGIANDAOTAO_ID: 'TG2', TONGSOTIEN: 465000, TAICHINH_CACKHOANTHU_ID: 'KT1', KIEUHOC_ID: 'KHO1', NGAYAPDUNG: '05/01/2026' },
            { ID: 'DK4', PHAMVIAPDUNG_ID: 'KKT5', DAOTAO_THOIGIANDAOTAO_ID: 'TG2', TONGSOTIEN: 1500000, TAICHINH_CACKHOANTHU_ID: 'KT1', KIEUHOC_ID: 'KHO1', NGAYAPDUNG: '05/01/2026' }
        ]
    });
})();
