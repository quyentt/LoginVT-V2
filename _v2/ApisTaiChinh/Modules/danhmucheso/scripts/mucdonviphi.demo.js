/* Dữ liệu mẫu cho mucdonviphi — chỉ dùng ở chế độ dựng thử. */
(function () {
    var B = ums.dmhsB;
    B.demoChung();
    function r(id, ct, hk, hkTen, kt, kh, tien) {
        return { ID: id, PHAMVIAPDUNG_ID: ct, DAOTAO_THOIGIANDAOTAO_ID: hk, DAOTAO_THOIGIANDAOTAO_HOCKY: hkTen, TAICHINH_CACKHOANTHU_ID: kt, KIEUHOC_ID: kh,
            TONGSOTIEN: tien, NGUOICUOI_TENDAYDU: 'Nguyễn Thu Trang', NGAYCUOI_DD_MM_YYYY: '12/08/2025' };
    }
    var ROWS = [
        r('DV1', 'CT1', 'TG1', 'Học kỳ 1 (2025–2026)', 'KT1', 'KH1', 450000),
        r('DV2', 'CT1', 'TG1', 'Học kỳ 1 (2025–2026)', 'KT1', 'KH2', 520000),
        r('DV3', 'CT1', 'TG2', 'Học kỳ 2 (2025–2026)', 'KT1', 'KH1', 460000),
        r('DV4', 'CT1', 'TG1', 'Học kỳ 1 (2025–2026)', 'KT2', 'KH2', 600000),
        r('DV5', 'CT2', 'TG1', 'Học kỳ 1 (2025–2026)', 'KT1', 'KH1', 420000)
    ];
    ums.demo.add({
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KHDT.DIEM.KIEUHOC': [
            { ID: 'KH1', MA: 'HM', TEN: 'Học mới' }, { ID: 'KH2', MA: 'HL', TEN: 'Học lại' }, { ID: 'KH3', MA: 'CT', TEN: 'Cải thiện' }
        ],
        'TC_DonViPhi_SoTien/LayDanhSach': function (o) { return ROWS.filter(function (x) { return x.PHAMVIAPDUNG_ID === o.strPhamViApDung_Id; }); }
    });
})();
