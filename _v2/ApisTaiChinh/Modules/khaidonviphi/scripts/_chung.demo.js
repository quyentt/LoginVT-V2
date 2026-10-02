/* Dữ liệu mẫu cho donviphikhoa / donviphilop — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function cell(id, pv, tg, tien) {
        return { ID: id, PHAMVIAPDUNG_ID: pv, DAOTAO_THOIGIANDAOTAO_ID: tg, TONGSOTIEN: tien, TAICHINH_CACKHOANTHU_ID: 'KT1', NGAYAPDUNG: '01/09/2023' };
    }
    ums.demo.add({
        'TC_DonViPhi_SoTien/LayDSThoiGian_DonViPhi_SoTien': [
            { ID: 'TG231', THOIGIAN: 'HK1 2023-2024' }, { ID: 'TG232', THOIGIAN: 'HK2 2023-2024' },
            { ID: 'TG241', THOIGIAN: 'HK1 2024-2025' }, { ID: 'TG242', THOIGIAN: 'HK2 2024-2025' }
        ],
        'TC_DonViPhi_SoTien/LayDSTaiChinh_Lop_DonViPhi': function (o) {
            if (o.strChuongTrinh_Id || o.strKhoaDaoTao_Id) {
                return [
                    { PHAMVIAPDUNG_ID: 'LOP1', PHAMVIAPDUNG_TEN: 'QTKD23A', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', DAOTAO_KHOADAOTAO_TEN: 'Khoá 2023', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Quản trị kinh doanh' },
                    { PHAMVIAPDUNG_ID: 'LOP2', PHAMVIAPDUNG_TEN: 'QTKD23B', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', DAOTAO_KHOADAOTAO_TEN: 'Khoá 2023', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Quản trị kinh doanh' }
                ];
            }
            return [
                { PHAMVIAPDUNG_ID: 'KH22', PHAMVIAPDUNG_TEN: 'Khoá 2022', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy' },
                { PHAMVIAPDUNG_ID: 'KH23', PHAMVIAPDUNG_TEN: 'Khoá 2023', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy' },
                { PHAMVIAPDUNG_ID: 'KH24', PHAMVIAPDUNG_TEN: 'Khoá 2024', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy' }
            ];
        },
        'TC_DonViPhi_SoTien/LayDanhSach': [
            cell('DV1', 'KH22', 'TG231', 450000), cell('DV2', 'KH22', 'TG232', 450000), cell('DV3', 'KH23', 'TG231', 480000),
            cell('DV4', 'KH23', 'TG241', 520000), cell('DV5', 'KH24', 'TG241', 550000),
            cell('DV6', 'LOP1', 'TG231', 480000), cell('DV7', 'LOP2', 'TG232', 500000)
        ]
    });
})();
