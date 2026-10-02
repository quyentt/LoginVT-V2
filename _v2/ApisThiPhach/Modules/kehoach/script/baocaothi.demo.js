/* Dữ liệu mẫu cho kehoach/baocaothi (Thi phách) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var DS = [
        { ID: 'DST1', MADANHSACHTHI: 'DST.2026.1.0001', DAOTAO_HOCPHAN_ID: 'HP1', DAOTAO_HOCPHAN_TEN: 'Nguyên lý kế toán', DAOTAO_HOCPHAN_MA: 'KT2101',
            NGAYTHI: '05/01/2027', THI_CATHI_TEN: 'Ca 1', TKB_PHONGTHI_TEN: 'A2-301', SOSVTHEODST: 42, DOT: 'DOT1' },
        { ID: 'DST2', MADANHSACHTHI: 'DST.2026.1.0002', DAOTAO_HOCPHAN_ID: 'HP1', DAOTAO_HOCPHAN_TEN: 'Nguyên lý kế toán', DAOTAO_HOCPHAN_MA: 'KT2101',
            NGAYTHI: '05/01/2027', THI_CATHI_TEN: 'Ca 1', TKB_PHONGTHI_TEN: 'A2-302', SOSVTHEODST: 40, DOT: 'DOT1' },
        { ID: 'DST3', MADANHSACHTHI: 'DST.2026.1.0003', DAOTAO_HOCPHAN_ID: 'HP2', DAOTAO_HOCPHAN_TEN: 'Triết học Mác - Lênin', DAOTAO_HOCPHAN_MA: 'CT1102',
            NGAYTHI: '07/01/2027', THI_CATHI_TEN: 'Ca 2', TKB_PHONGTHI_TEN: 'B1-204', SOSVTHEODST: 38, DOT: 'DOT1' },
        { ID: 'DST4', MADANHSACHTHI: 'DST.2026.1.0101', DAOTAO_HOCPHAN_ID: 'HP2', DAOTAO_HOCPHAN_TEN: 'Triết học Mác - Lênin', DAOTAO_HOCPHAN_MA: 'CT1102',
            NGAYTHI: '02/02/2027', THI_CATHI_TEN: 'Ca 3', TKB_PHONGTHI_TEN: 'B1-105', SOSVTHEODST: 27, DOT: 'DOT2' }
    ];
    ums.demo.add({
        'pkg_thi_phach_chung.LayThoiGianTatCa': [{ ID: 'TG1', THOIGIAN: '2026_2027_1' }, { ID: 'TG2', THOIGIAN: '2025_2026_2' }],
        'TP_Chung/LayLoaiDiem': function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'LD1', TEN: 'Điểm thi cuối kỳ' }, { ID: 'LD2', TEN: 'Điểm giữa kỳ' }] : []; },
        'TP_Chung/LayHinhThucThi': function (o) { return o.strDiem_ThanhPhanDiem_Id ? [{ ID: 'HT1', TEN: 'Tự luận' }, { ID: 'HT2', TEN: 'Trắc nghiệm' }] : []; },
        'TP_Chung/LayDotThi': function (o) { return o.strHinhThucThi_Id ? [{ ID: 'DOT1', TEN: 'Đợt 1 HK1 2026-2027' }, { ID: 'DOT2', TEN: 'Đợt 2 HK1 2026-2027' }] : []; },
        'TP_Chung/LayHocPhan': function (o) { return o.strDotThi_Id ? [{ ID: 'HP1', TEN: 'Nguyên lý kế toán', MA: 'KT2101' }, { ID: 'HP2', TEN: 'Triết học Mác - Lênin', MA: 'CT1102' }] : []; },
        'TP_Chung/LayDSThiTheoDotThi': function (o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            return DS.filter(function (x) {
                if (o.strThi_DotThi_Id && x.DOT !== o.strThi_DotThi_Id) return false;
                if (o.strDaoTao_HocPhan_Id && x.DAOTAO_HOCPHAN_ID !== o.strDaoTao_HocPhan_Id) return false;
                return !q || (x.MADANHSACHTHI + ' ' + x.DAOTAO_HOCPHAN_TEN + ' ' + x.DAOTAO_HOCPHAN_MA).toLowerCase().indexOf(q) >= 0;
            });
        }
    });
})();
