/* Dữ liệu mẫu cho sothangtinhtien — chỉ dùng ở chế độ dựng thử. */
(function () {
    var B = ums.dmhsB;
    B.demoChung();
    var CT = B.demo.ct;
    ums.demo.add({
        'TC_SoThang_TinhTien/LayDSThoiGian_SoThang_TinhTien': [{ ID: 'TG1', THOIGIAN: '2025_2026_1' }, { ID: 'TG2', THOIGIAN: '2025_2026_2' }],
        'TC_SoThang_TinhTien/LayDSTaiChinh_CT_SoThang': function (o) {
            return CT.filter(function (r) { return !o.strKhoaDaoTao_Id || r.DAOTAO_KHOADAOTAO_ID === o.strKhoaDaoTao_Id; })
                .map(function (r) { return { PHAMVIAPDUNG_ID: r.ID, DAOTAO_TOCHUCCHUONGTRINH_TEN: r.TENCHUONGTRINH }; });
        },
        'TC_SoThang_TinhTien/LayDanhSach': [
            { ID: 'ST1', PHAMVIAPDUNG_ID: 'CT1', DAOTAO_THOIGIANDAOTAO_ID: 'TG1', SOTHANG: 5, TAICHINH_CACKHOANTHU_ID: 'KT5', NGAYAPDUNG: '01/09/2025' },
            { ID: 'ST2', PHAMVIAPDUNG_ID: 'CT1', DAOTAO_THOIGIANDAOTAO_ID: 'TG2', SOTHANG: 5, TAICHINH_CACKHOANTHU_ID: 'KT5', NGAYAPDUNG: '01/02/2026' },
            { ID: 'ST3', PHAMVIAPDUNG_ID: 'CT2', DAOTAO_THOIGIANDAOTAO_ID: 'TG1', SOTHANG: 4, TAICHINH_CACKHOANTHU_ID: 'KT5', NGAYAPDUNG: '01/09/2025' }
        ]
    });
})();
