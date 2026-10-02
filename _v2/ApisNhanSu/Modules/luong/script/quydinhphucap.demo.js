/* Dữ liệu mẫu cho quydinhphucap — chỉ dùng ở chế độ dựng thử. */
(function () {
    var ds = [
        { ID: 'HP1', THOIHANNHANPHUCAP: '12', NHANSU_BANGQUYDINHLUONG_ID: 'QDL2', LOAI_ID: 'LCC1', LOAI_TEN: 'Công chức loại A', NHOM_ID: 'NN1', NGACH_ID: 'NG3', LOAIPHUCAP_ID: 'PC2', LOAIPHUCAP_TEN: 'Phụ cấp ưu đãi', GHICHU: '' },
        { ID: 'HP2', THOIHANNHANPHUCAP: '60', NHANSU_BANGQUYDINHLUONG_ID: 'QDL2', LOAI_ID: 'LCC1', LOAI_TEN: 'Công chức loại A', NHOM_ID: 'NN2', NGACH_ID: 'NG2', LOAIPHUCAP_ID: 'PC3', LOAIPHUCAP_TEN: 'Phụ cấp thâm niên', GHICHU: 'Từ năm thứ 5' }
    ];
    ums.demo.add({
        'L_QuyDinhHuongPhuCap/LayDanhSach': ds,
        'L_QuyDinhHuongPhuCap/LayChiTiet': function (o) { return ds.filter(function (r) { return r.ID === o.strId; }); }
    });
})();
