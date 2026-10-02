/* Dữ liệu mẫu cho quydinhdongbaohiem — chỉ dùng ở chế độ dựng thử. */
(function () {
    var ds = [
        { ID: 'BH1', NHANSU_BANGQUYDINHLUONG_ID: 'QDL2', NHANSU_BANGQUYDINHLUONG_TEN: '2340000', LOAIKHOAN_ID: 'LK1', LOAIKHOAN_TEN: 'Lương cơ bản', PHANTRAM: '8',
          LOAIKHOANTINHBAOHIEM_IDS: 'LK1,LK2', LOAIPHUCAPTINHBAOHIEM_IDS: 'LK2', DOITUONG_ID: 'DT1' },
        { ID: 'BH2', NHANSU_BANGQUYDINHLUONG_ID: 'QDL2', NHANSU_BANGQUYDINHLUONG_TEN: '2340000', LOAIKHOAN_ID: 'LK1', LOAIKHOAN_TEN: 'Lương cơ bản', PHANTRAM: '17.5',
          LOAIKHOANTINHBAOHIEM_IDS: 'LK1', LOAIPHUCAPTINHBAOHIEM_IDS: 'LK2', DOITUONG_ID: 'DT2' }
    ];
    ums.demo.add({
        'L_QuyDinhBaoHiem/LayDanhSach': ds,
        'L_QuyDinhBaoHiem/LayChiTiet': function (o) { return ds.filter(function (r) { return r.ID === o.strId; }); }
    });
})();
