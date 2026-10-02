/* Dữ liệu mẫu cho quydinhgiamtru — chỉ dùng ở chế độ dựng thử. */
(function () {
    var ds = [
        { ID: 'GT1', VOINGUOINOPTHUE: '11000000', VOIMOINGUOIPHUTHUOC: '4400000', NGAYAPDUNG: '01/07/2020' },
        { ID: 'GT2', VOINGUOINOPTHUE: '15500000', VOIMOINGUOIPHUTHUOC: '6200000', NGAYAPDUNG: '01/01/2026' }
    ];
    ums.demo.add({
        'L_QuyDinh_GiamTru/LayDanhSach': ds,
        'L_QuyDinh_GiamTru/LayChiTiet': function (o) { return ds.filter(function (r) { return r.ID === o.strId; }); }
    });
})();
