/* Dữ liệu mẫu cho hocphan — Công thức theo học phần (Quản lý điểm) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var KQ = {
        'HP01|TG1': { ID: 'C1', DIEM_THANHPHANDIEM_ID: 'TP1', DIEM_CONGTHUCDIEM_XAU: '[CC]*0.1+[GK]*0.3+[CK]*0.6' },
        'HP02|TG1': { ID: 'C2', DIEM_THANHPHANDIEM_ID: 'TP1', DIEM_CONGTHUCDIEM_XAU: '[CC]*0.1+[BT]*0.2+[CK]*0.7' },
        'HP06|TG2': { ID: 'C3', DIEM_THANHPHANDIEM_ID: 'TP1', DIEM_CONGTHUCDIEM_XAU: '[GK]*0.4+[CK]*0.6' }
    };
    ums.demo.add({
        'pkg_diem_thongtin.LayDSThanhPhanTKHP': [{ ID: 'TP1', TEN: 'Điểm tổng kết học phần' }, { ID: 'TP2', TEN: 'Điểm quá trình' }],
        'pkg_diem_thongtin.LayDSkY_CongThucDiem_PhamViHP': [{ ID: 'TG1', THOIGIAN: '2025_2026_1' }, { ID: 'TG2', THOIGIAN: '2025_2026_2' }, { ID: 'TG3', THOIGIAN: '2026_2027_1' }],
        'pkg_diem_thongtin.LayTTDiem_CTD_AD_PhamVi': function (o) {
            var r = KQ[o.strPhamViApDung_Id + '|' + o.strDaoTao_ThoiGianDaoTao_Id];
            return r ? [r] : [];
        },
        'pkg_diem_thongtin.Them_Diem_CongThucDiem_AD': function (o) {
            KQ[o.strPhamViApDung_Id + '|' + o.strDaoTao_ThoiGianDaoTao_Id] = { ID: 'N' + Date.now(), DIEM_THANHPHANDIEM_ID: o.strDiem_ThanhPhanDiem_Id,
                DIEM_CONGTHUCDIEM_XAU: o.strXauCongThuc };
            return [];
        },
        'pkg_diem_thongtin.Xoa_Diem_CongThucDiem_AD': function (o) {
            Object.keys(KQ).forEach(function (k) { if (KQ[k].ID === o.strIds) delete KQ[k]; });
            return [];
        }
    });
})();
