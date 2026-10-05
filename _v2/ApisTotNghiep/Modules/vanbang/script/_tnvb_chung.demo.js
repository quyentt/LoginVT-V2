/* Dữ liệu mẫu chung của hai màn Văn bằng (Tốt nghiệp) — chỉ dùng ở chế độ dựng thử.
   Hệ / Khoá / CT / Lớp: demo-data.js + ApisHocBong/Modules/kehoach/script/_th.demo.js. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    var fx = {};
    fx[D + 'TN.PHANLOAI'] = [
        { ID: 'PL1', MA: 'TN', TEN: 'Xét tốt nghiệp', CHUNG_TENDANHMUC_TEN: 'Phân loại' },
        { ID: 'PL2', MA: 'CC', TEN: 'Cấp chứng chỉ', CHUNG_TENDANHMUC_TEN: 'Phân loại' }
    ];
    fx['TN_ThongTin/LayDSTN_KeHoach'] = function (o) {
        var ds = [
            { ID: 'KH1', MA: 'TN2026-D1', TEN: 'Xét tốt nghiệp đợt 1 năm 2026', PL: 'PL1' },
            { ID: 'KH2', MA: 'TN2026-D2', TEN: 'Xét tốt nghiệp đợt 2 năm 2026', PL: 'PL1' },
            { ID: 'KH3', MA: 'CC2026-D1', TEN: 'Cấp chứng chỉ ngoại ngữ đợt 1 năm 2026', PL: 'PL2' }
        ];
        return ds.filter(function (r) { return !o.strPhanLoai_Id || r.PL === o.strPhanLoai_Id; });
    };
    fx['TN_PhoiIn/LayDS_MauPhoiIn_BanChinh'] = [
        { ID: 'PHOI01', MAPHOI: 'BANG-DHCQ-2026 (Bằng cử nhân chính quy)' },
        { ID: 'PHOI02', MAPHOI: 'BANG-KS-2026 (Bằng kỹ sư)' }
    ];
    fx['TN_PhoiIn/LayDS_MauPhoiIn_BanSao'] = [
        { ID: 'PHOI11', MAPHOI: 'BANSAO-DHCQ-2026 (Bản sao bằng cử nhân)' }
    ];
    ums.demo.add(fx);
})();
