/* Dữ liệu mẫu cho mucphilop — chỉ dùng ở chế độ dựng thử. */
(function () {
    var B = ums.dmhsB;
    B.demoChung();
    var LOP = B.demo.lop;
    ums.demo.add({
        'TC_MucPhi_Lop/LayDSThoiGian_MucPhi_Lop_Tien': [{ ID: 'TG1', THOIGIAN: '2025_2026_1' }, { ID: 'TG2', THOIGIAN: '2025_2026_2' }],
        'TC_MucPhi_Lop/LayDSTaiChinh_LopQL_SoTien': function (o) {
            return LOP.filter(function (r) { return !o.strChuongTrinh_Id || r.DAOTAO_TOCHUCCHUONGTRINH_ID === o.strChuongTrinh_Id; })
                .map(function (r) { return { PHAMVIAPDUNG_ID: r.ID, DAOTAO_LOPQUANLY_TEN: r.TEN }; });
        },
        'TC_MucPhi_Lop/LayDanhSach': [
            { ID: 'ML1', PHAMVIAPDUNG_ID: 'L1', DAOTAO_THOIGIANDAOTAO_ID: 'TG1', TONGSOTIEN: 13200000, TAICHINH_CACKHOANTHU_ID: 'KT1', NGAYAPDUNG: '01/09/2025' },
            { ID: 'ML2', PHAMVIAPDUNG_ID: 'L2', DAOTAO_THOIGIANDAOTAO_ID: 'TG1', TONGSOTIEN: 12900000, TAICHINH_CACKHOANTHU_ID: 'KT1', NGAYAPDUNG: '01/09/2025' }
        ]
    });
})();
