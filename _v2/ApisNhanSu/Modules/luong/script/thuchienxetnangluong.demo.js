/* Dữ liệu mẫu cho thuchienxetnangluong — chỉ dùng ở chế độ dựng thử. */
(function () {
    var tp = [
        { THANHPHAN_ID: 'T1', THANHPHAN_CHA_ID: '', THANHPHAN_TEN: 'Hiện hưởng' },
        { THANHPHAN_ID: 'T11', THANHPHAN_CHA_ID: 'T1', THANHPHAN_TEN: 'Ngạch' },
        { THANHPHAN_ID: 'T12', THANHPHAN_CHA_ID: 'T1', THANHPHAN_TEN: 'Bậc' },
        { THANHPHAN_ID: 'T13', THANHPHAN_CHA_ID: 'T1', THANHPHAN_TEN: 'Hệ số' },
        { THANHPHAN_ID: 'T2', THANHPHAN_CHA_ID: '', THANHPHAN_TEN: 'Đề nghị nâng' },
        { THANHPHAN_ID: 'T21', THANHPHAN_CHA_ID: 'T2', THANHPHAN_TEN: 'Bậc mới' },
        { THANHPHAN_ID: 'T22', THANHPHAN_CHA_ID: 'T2', THANHPHAN_TEN: 'Hệ số mới' },
        { THANHPHAN_ID: 'T3', THANHPHAN_CHA_ID: '', THANHPHAN_TEN: 'Ngày hưởng' }
    ];
    var ns = [
        { NHANSU_HOSOCANBO_ID: 'NS1', NHANSU_HOSOCANBO_MASO: 'CB001', NHANSU_HOSOCANBO_HO: 'Nguyễn Văn', NHANSU_HOSOCANBO_TEN: 'Hùng', DAOTAO_COCAUTOCHUC_TEN: 'Khoa Công nghệ thông tin' },
        { NHANSU_HOSOCANBO_ID: 'NS2', NHANSU_HOSOCANBO_MASO: 'CB015', NHANSU_HOSOCANBO_HO: 'Trần Thị', NHANSU_HOSOCANBO_TEN: 'Mai', DAOTAO_COCAUTOCHUC_TEN: 'Bộ môn Hệ thống thông tin' }
    ];
    var gt = [];
    [['NS1', 'V.07.01.03', '3', '3.00', '4', '3.33', '01/07/2026'], ['NS2', 'V.07.01.03', '5', '3.66', '6', '3.99', '01/10/2026']].forEach(function (x) {
        ['T11', 'T12', 'T13', 'T21', 'T22', 'T3'].forEach(function (t, i) { gt.push({ NHANSU_HOSOCANBO_ID: x[0], THANHPHAN_ID: t, THANHPHAN_GIATRI: x[i + 1] }); });
    });
    ums.demo.add({
        'L_KeHoachXetLuong/LayDanhSach': [{ ID: 'KHX1', LOAIXETLUONG_TEN: 'Xét nâng lương thường xuyên năm 2026' }, { ID: 'KHX2', LOAIXETLUONG_TEN: 'Xét nâng lương trước thời hạn 2026' }],
        'L_XetLuong_CauTruc/LayDanhSach': tp,
        'L_XetLuong_CauTruc/LayDSDuLieuXetLuong': function () { return { rows: { rsNhanSu: ns, rsDuLieuXetLuong: gt } }; }
    });
})();
