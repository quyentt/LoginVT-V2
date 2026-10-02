/* Dữ liệu mẫu cho nhomngachbac — chỉ dùng ở chế độ dựng thử. */
(function () {
    var ds = [
        { ID: 'NB1', NHOMNGACH_ID: 'NHNG2', NHOMNGACH_TEN: 'Giảng viên cao cấp', BAC_ID: 'BL1', BAC_TEN: 'Bậc 1', THOIHANNANGLUONG: '60', GHICHU: '' },
        { ID: 'NB2', NHOMNGACH_ID: 'NHNG2', NHOMNGACH_TEN: 'Giảng viên cao cấp', BAC_ID: 'BL2', BAC_TEN: 'Bậc 2', THOIHANNANGLUONG: '60', GHICHU: '' },
        { ID: 'NB3', NHOMNGACH_ID: 'NHNG3', NHOMNGACH_TEN: 'Giảng viên chính', BAC_ID: 'BL1', BAC_TEN: 'Bậc 1', THOIHANNANGLUONG: '36', GHICHU: 'Hạng II' }
    ];
    ums.demo.add({
        'NS_NhomNgachBac/LayDanhSach': function (o) { return ds.filter(function (r) { return r.NHOMNGACH_ID === o.strNhomNgach_Id; }); }
    });
})();
