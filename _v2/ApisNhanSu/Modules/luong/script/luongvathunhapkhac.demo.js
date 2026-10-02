/* Dữ liệu mẫu cho luongvathunhapkhac — chỉ dùng ở chế độ dựng thử. */
(function () {
    function d(id, ns, ma, ho, ten, thang, tien, thue) {
        return { ID: id, NAM: 2026, THANG: thang, DAOTAO_COCAUTOCHUC_TEN: 'Khoa Công nghệ thông tin', NHANSU_HOSOCANBO_ID: ns, NHANSU_HOSOCANBO_MASO: ma,
            NHANSU_HOSOCANBO_HODEM: ho, NHANSU_HOSOCANBO_TEN: ten, NHANSU_HOSOCANBO_MASOTHUE: '80' + ma.slice(2) + '45678', CHUNGTU: 'BL-0' + thang,
            SOTIEN: tien, THUETNCN: thue, MOTA: 'Lương tháng ' + thang, NGAYPHATSINH: '28/0' + thang + '/2026' };
    }
    ums.demo.add({
        'L_KetQuaLuong/LayDanhSach': [
            d('KQ1', 'NS1', 'CB001', 'Nguyễn Văn', 'Hùng', 7, '18650000', '420000'),
            d('KQ2', 'NS1', 'CB001', 'Nguyễn Văn', 'Hùng', 8, '18650000', '420000'),
            d('KQ3', 'NS2', 'CB015', 'Trần Thị', 'Mai', 8, '11200000', '0')
        ]
    });
})();
