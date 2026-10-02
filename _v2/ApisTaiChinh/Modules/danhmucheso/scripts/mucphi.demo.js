/* Dữ liệu mẫu cho mucphi — chỉ dùng ở chế độ dựng thử. */
(function () {
    var B = ums.dmhsB;
    B.demoChung();
    var CT = B.demo.ct;
    var TG = [{ ID: 'TG1', THOIGIAN: '2025_2026_1' }, { ID: 'TG2', THOIGIAN: '2025_2026_2' }, { ID: 'TG3', THOIGIAN: '2026_2027_1' }];
    var MP = [
        { ID: 'MP1', PHAMVIAPDUNG_ID: 'CT1', DAOTAO_THOIGIANDAOTAO_ID: 'TG1', TONGSOTIEN: 12500000, TAICHINH_CACKHOANTHU_ID: 'KT1', NGAYAPDUNG: '01/09/2025' },
        { ID: 'MP2', PHAMVIAPDUNG_ID: 'CT1', DAOTAO_THOIGIANDAOTAO_ID: 'TG2', TONGSOTIEN: 12500000, TAICHINH_CACKHOANTHU_ID: 'KT1', NGAYAPDUNG: '01/02/2026' },
        { ID: 'MP3', PHAMVIAPDUNG_ID: 'CT2', DAOTAO_THOIGIANDAOTAO_ID: 'TG1', TONGSOTIEN: 11800000, TAICHINH_CACKHOANTHU_ID: 'KT1', NGAYAPDUNG: '01/09/2025' }
    ];
    ums.demo.add({
        'TC_MucPhi_SoTien/LayDSThoiGian_MucPhi_SoTien': TG,
        'TC_MucPhi_SoTien/LayDSTaiChinh_CT_SoTien': function (o) {
            return CT.filter(function (r) { return !o.strKhoaDaoTao_Id || r.DAOTAO_KHOADAOTAO_ID === o.strKhoaDaoTao_Id; })
                .map(function (r) { return { PHAMVIAPDUNG_ID: r.ID, DAOTAO_TOCHUCCHUONGTRINH_TEN: r.TENCHUONGTRINH }; });
        },
        'TC_MucPhi_SoTien/LayDanhSach': MP
    });
})();
