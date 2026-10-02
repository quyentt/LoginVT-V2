/* Dữ liệu mẫu cho donviphimoilop — chỉ dùng ở chế độ dựng thử.
   Hệ/khoá/chương trình/thời gian/kiểu học dùng chung nằm trong _chung_a.js. */
(function () {
    var LOP = [
        { ID: 'L1', MA: '67CNTT1', TEN: 'CNTT 67A', CT: 'CT1', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Công nghệ thông tin', DAOTAO_TOCHUCCHUONGTRINH_MA: '7480201' },
        { ID: 'L2', MA: '67CNTT2', TEN: 'CNTT 67B', CT: 'CT1', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Công nghệ thông tin', DAOTAO_TOCHUCCHUONGTRINH_MA: '7480201' },
        { ID: 'L3', MA: '67KTPM1', TEN: 'KTPM 67A', CT: 'CT2', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Kỹ thuật phần mềm', DAOTAO_TOCHUCCHUONGTRINH_MA: '7480103' },
        { ID: 'L4', MA: '67QTKD1', TEN: 'QTKD 67A', CT: 'CT3', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Quản trị kinh doanh', DAOTAO_TOCHUCCHUONGTRINH_MA: '7340101' }
    ];
    LOP.forEach(function (r) { r.DAOTAO_KHOADAOTAO_TEN = 'K67 (2022-2026)'; });
    ums.demo.add({
        'PKG_TAICHINH_THUCHI3.LayDSThoiGian_DVP_LopQL_SoTien': [
            { ID: 'TG1', THOIGIAN: 'HK1 2025-2026' },
            { ID: 'TG2', THOIGIAN: 'HK2 2025-2026' },
            { ID: 'TG4', THOIGIAN: 'HK1 2026-2027' }
        ],
        'PKG_TAICHINH_THUCHI3.LayDSTaiChinh_LopQL_DonViPhi': function (o) {
            return LOP.filter(function (r) { return !o.strChuongTrinh_Id || r.CT === o.strChuongTrinh_Id; });
        },
        'TC_DonViPhi_SoTien/LayDanhSach': [
            { ID: 'DL1', PHAMVIAPDUNG_ID: 'L1', DAOTAO_THOIGIANDAOTAO_ID: 'TG1', TONGSOTIEN: 12500000, TAICHINH_CACKHOANTHU_ID: 'KT1', KIEUHOC_ID: 'KHO1', NGAYAPDUNG: '01/08/2025' },
            { ID: 'DL2', PHAMVIAPDUNG_ID: 'L2', DAOTAO_THOIGIANDAOTAO_ID: 'TG1', TONGSOTIEN: 12500000, TAICHINH_CACKHOANTHU_ID: 'KT1', KIEUHOC_ID: 'KHO1', NGAYAPDUNG: '01/08/2025' },
            { ID: 'DL3', PHAMVIAPDUNG_ID: 'L1', DAOTAO_THOIGIANDAOTAO_ID: 'TG2', TONGSOTIEN: 13000000, TAICHINH_CACKHOANTHU_ID: 'KT1', KIEUHOC_ID: 'KHO1', NGAYAPDUNG: '05/01/2026' },
            { ID: 'DL4', PHAMVIAPDUNG_ID: 'L4', DAOTAO_THOIGIANDAOTAO_ID: 'TG4', TONGSOTIEN: 11800000, TAICHINH_CACKHOANTHU_ID: 'KT1', KIEUHOC_ID: 'KHO1', NGAYAPDUNG: '15/07/2026' }
        ]
    });
})();
