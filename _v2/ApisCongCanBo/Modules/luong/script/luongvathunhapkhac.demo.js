/* Dữ liệu mẫu cho luongvathunhapkhac — chỉ dùng ở chế độ dựng thử. */
(function () {
    var NS = { DAOTAO_COCAUTOCHUC_TEN: 'Khoa Công nghệ thông tin', NHANSU_HOSOCANBO_MASO: 'CB0123', NHANSU_HOSOCANBO_HODEM: 'Nguyễn Văn',
               NHANSU_HOSOCANBO_TEN: 'An', NHANSU_HOSOCANBO_MASOTHUE: '8012345678', TONGLUONG_THUNHAPKHAC: '4500000', TONGTHUE_TNCN: '150000' };
    function r(x) { var o = {}; Object.keys(NS).forEach(function (k) { o[k] = NS[k]; }); Object.keys(x).forEach(function (k) { o[k] = x[k]; }); return o; }
    ums.demo.add({
        'L_DuocNhan/LayDanhSach': { rows: [
            r({ ID: 'DN1', CHUNGTU: 'PC-0815', SOTIEN: '3000000', THUETNCN: '100000', MOTA: 'Thù lao coi thi', LOAIKHOAN_TEN: 'Thù lao', NGAYPHATSINH: '15/06/2026' }),
            r({ ID: 'DN2', CHUNGTU: 'PC-0902', SOTIEN: '1500000', THUETNCN: '50000', MOTA: 'Hội đồng chấm luận văn', LOAIKHOAN_TEN: 'Hội đồng', NGAYPHATSINH: '02/09/2026' })
        ], pager: 2 },
        'L_KetQuaLuong/LayDanhSach': [
            r({ ID: 'KL1', NAM: '2026', THANG: '8', CHUNGTU: 'BL-08', SOTIEN: '11421500', THUETNCN: '450000', MOTA: 'Lương tháng 8', NGAYPHATSINH: '05/08/2026',
                TONGLUONG_THUNHAPKHAC: '11421500', TONGTHUE_TNCN: '450000' })
        ]
    });
})();
