/* Dữ liệu mẫu cho quydinhnangluong — chỉ dùng ở chế độ dựng thử. */
(function () {
    var ds = [
        { ID: 'NL1', THOIHANNANGLUONG: '36', NHANSU_BANGQUYDINHLUONG_ID: 'QDL2', LOAI_ID: 'LCC1', NHOM_ID: 'NN1', NGACH_ID: 'NG3', NGACH_TEN: 'Giảng viên', GHICHU: '' },
        { ID: 'NL2', THOIHANNANGLUONG: '24', NHANSU_BANGQUYDINHLUONG_ID: 'QDL2', LOAI_ID: 'LCC3', NHOM_ID: 'NN3', NGACH_ID: 'NG2', NGACH_TEN: 'Giảng viên chính', GHICHU: 'Nhân viên' }
    ];
    ums.demo.add({
        'L_QuyDinhNangLuong/LayDanhSach': ds,
        'L_QuyDinhNangLuong/LayChiTiet': function (o) { return ds.filter(function (r) { return r.ID === o.strId; }); }
    });
})();
