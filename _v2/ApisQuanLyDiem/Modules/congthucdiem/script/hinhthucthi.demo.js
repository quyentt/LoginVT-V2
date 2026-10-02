/* Dữ liệu mẫu cho hinhthucthi (Quản lý điểm) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var HT = [{ ID: 'HT1', TEN: 'Tự luận' }, { ID: 'HT2', TEN: 'Trắc nghiệm' }, { ID: 'HT3', TEN: 'Vấn đáp' }, { ID: 'HT4', TEN: 'Tiểu luận' }];
    var KQ = {
        'HP01|TG1': { ID: 'A1', THI_HINHTHUCTHI_ID: 'HT1', HINHTHUCTHI_TEN: 'Tự luận', THOIGIANTHI: '90 phút' },
        'HP02|TG1': { ID: 'A2', THI_HINHTHUCTHI_ID: 'HT2', HINHTHUCTHI_TEN: 'Trắc nghiệm', THOIGIANTHI: '60 phút' },
        'HP03|TG2': { ID: 'A3', THI_HINHTHUCTHI_ID: 'HT3', HINHTHUCTHI_TEN: 'Vấn đáp', THOIGIANTHI: '15 phút' },
        'HP04|TG1': { ID: 'A4', THI_HINHTHUCTHI_ID: 'HT4', HINHTHUCTHI_TEN: 'Tiểu luận', THOIGIANTHI: '' }
    };
    ums.demo.add({
        'pkg_diem_chung.LayDSThi_HinhThucThi': HT,
        'pkg_diem_thongtin.LayDSkY_HinhThucThi_PhamViHP': [{ ID: 'TG1', THOIGIAN: '2025_2026_1' }, { ID: 'TG2', THOIGIAN: '2025_2026_2' }],
        'pkg_diem_thongtin.LayTTDiem_HTTHI_AD_PhamVi': function (o) {
            var r = KQ[o.strPhamViApDung_Id + '|' + o.strDaoTao_ThoiGianDaoTao_Id];
            return r ? [r] : [];
        },
        'pkg_diem_thongtin.Them_Diem_HinhThucThi_AD': function (o) {
            var h = HT.filter(function (x) { return x.ID === o.strThi_HinhThucThi_Id; })[0];
            KQ[o.strPhamViApDung_Id + '|' + o.strDaoTao_ThoiGianDaoTao_Id] = { ID: 'N' + Date.now(), THI_HINHTHUCTHI_ID: o.strThi_HinhThucThi_Id,
                HINHTHUCTHI_TEN: h ? h.TEN : '', THOIGIANTHI: o.strThoiGianThi };
            return [];
        },
        'pkg_diem_thongtin.Xoa_Diem_HinhThucThi_AD': function (o) {
            Object.keys(KQ).forEach(function (k) { if (KQ[k].ID === o.strIds) delete KQ[k]; });
            return [];
        }
    });
})();
