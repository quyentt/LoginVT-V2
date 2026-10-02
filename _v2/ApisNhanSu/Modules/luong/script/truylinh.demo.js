/* Dữ liệu mẫu cho truylinh — chỉ dùng ở chế độ dựng thử. */
(function () {
    var ds = [
        { ID: 'TL1', NHANSU_HOSOCANBO_ID: 'NS1', DAOTAO_COCAUTOCHUC_TEN: 'Khoa Công nghệ thông tin', NHANSU_HOSOCANBO_MASO: 'CB001', NHANSU_HOSOCANBO_HODEM: 'Nguyễn Văn', NHANSU_HOSOCANBO_TEN: 'Hùng',
          NHANSU_HOSOCANBO_MASOTHUE: '8012345678', CHUNGTU: 'PC-0125', SOTIEN: '1250000', MOTA: 'Truy lĩnh nâng lương tháng 7-9/2025', LOAIKHOAN_ID: 'LK4', LOAIKHOAN_TEN: 'Truy lĩnh', NGAYPHATSINH: '15/10/2025' },
        { ID: 'TL2', NHANSU_HOSOCANBO_ID: 'NS2', DAOTAO_COCAUTOCHUC_TEN: 'Bộ môn Hệ thống thông tin', NHANSU_HOSOCANBO_MASO: 'CB015', NHANSU_HOSOCANBO_HODEM: 'Trần Thị', NHANSU_HOSOCANBO_TEN: 'Mai',
          NHANSU_HOSOCANBO_MASOTHUE: '8098765432', CHUNGTU: 'PC-0126', SOTIEN: '860000', MOTA: 'Truy lĩnh phụ cấp ưu đãi', LOAIKHOAN_ID: 'LK4', LOAIKHOAN_TEN: 'Truy lĩnh', NGAYPHATSINH: '15/10/2025' }
    ];
    ums.demo.add({
        'L_TruyLinh/LayDanhSach': function () { return { rows: ds, pager: ds.length }; },
        'L_TruyLinh/LayChiTiet': function (o) { return ds.filter(function (r) { return r.ID === o.strId; }); }
    });
})();
