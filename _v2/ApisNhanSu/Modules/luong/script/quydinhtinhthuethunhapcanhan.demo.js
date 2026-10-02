/* Dữ liệu mẫu cho quydinhtinhthuethunhapcanhan — chỉ dùng ở chế độ dựng thử. */
(function () {
    var ds = [
        { ID: 'TT1', MUCCANDUOI: '0', MUCCANTREN: '5000000', PHANTRAMTHUE: '5', NGAYAPDUNG: '01/01/2014' },
        { ID: 'TT2', MUCCANDUOI: '5000000', MUCCANTREN: '10000000', PHANTRAMTHUE: '10', NGAYAPDUNG: '01/01/2014' },
        { ID: 'TT3', MUCCANDUOI: '10000000', MUCCANTREN: '18000000', PHANTRAMTHUE: '15', NGAYAPDUNG: '01/01/2014' }
    ];
    ums.demo.add({
        'L_QuyDinh_ThueThuNhapCaNhan/LayDanhSach': ds,
        'L_QuyDinh_ThueThuNhapCaNhan/LayChiTiet': function (o) { return ds.filter(function (r) { return r.ID === o.strId; }); }
    });
})();
