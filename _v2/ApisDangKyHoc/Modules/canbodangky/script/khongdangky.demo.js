/* Dữ liệu mẫu cho canbodangky/khongdangky — chỉ dùng ở chế độ dựng thử. */
(function () {
    var DS = [
        { ID: 'CH1', QLSV_NGUOIHOC_ID: 'NH11', DAOTAO_LOPQUANLY_ID: 'L1', MASO: 'BIT220263', HODEM: 'Nguyễn Văn', TEN: 'An', LOP: 'K66-KTPM1', MOTA: 'Chưa hoàn thành học phí học kỳ trước' },
        { ID: 'CH2', QLSV_NGUOIHOC_ID: 'NH14', DAOTAO_LOPQUANLY_ID: 'L2', MASO: 'BBA220561', HODEM: 'Lê Minh', TEN: 'Châu', LOP: 'K66-QTKD2', MOTA: 'Đang bảo lưu' },
        { ID: 'CH3', QLSV_NGUOIHOC_ID: 'NH15', DAOTAO_LOPQUANLY_ID: 'L2', MASO: 'BBA220574', HODEM: 'Hoàng Minh', TEN: 'Đức', LOP: 'K66-QTKD2', MOTA: '' }
    ];
    var NH = [
        ['NH21', 'BIT220271', 'Trần Thị', 'Bình', 'K66-KTPM1', 'L1'],
        ['NH22', 'BIT220288', 'Lê Hoàng', 'Cường', 'K66-KTPM1', 'L1'],
        ['NH23', 'BBA220590', 'Vũ Ngọc', 'Hà', 'K66-QTKD2', 'L2']
    ].map(function (x) {
        return { ID: 'R' + x[0], QLSV_NGUOIHOC_ID: x[0], QLSV_NGUOIHOC_MASO: x[1], QLSV_NGUOIHOC_HODEM: x[2], QLSV_NGUOIHOC_TEN: x[3],
            QLSV_NGUOIHOC_HOTEN: x[2] + ' ' + x[3], QLSV_NGUOIHOC_NGAYSINH: '01/01/2004', DAOTAO_LOPQUANLY_TEN: x[4], DAOTAO_LOPQUANLY_ID: x[5],
            DAOTAO_CHUONGTRINH_TEN: x[5] === 'L1' ? 'Kỹ thuật phần mềm' : 'Quản trị kinh doanh', DAOTAO_KHOADAOTAO_TEN: 'Khóa 66',
            QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học' };
    });
    ums.demo.add({
        'DKH_ThongTin/LayDSDangKy_NguoiHoc_Chan': function (o) {
            var q = (o.strTuKhoa || '').toLowerCase();
            var r = DS.filter(function (x) { return !q || (x.MASO + ' ' + x.HODEM + ' ' + x.TEN).toLowerCase().indexOf(q) >= 0; });
            return { rows: r, pager: r.length };
        },
        'DKH_ThongTin/Them_DangKy_NguoiHoc_Chan': { rows: [], message: '' },
        'DKH_ThongTin/Xoa_DangKy_NguoiHoc_Chan': { rows: [], message: '' },
        'PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc': function (o) {
            var q = (o.strTuKhoa || '').toLowerCase();
            var r = NH.filter(function (x) { return !q || (x.QLSV_NGUOIHOC_MASO + ' ' + x.QLSV_NGUOIHOC_HOTEN).toLowerCase().indexOf(q) >= 0; });
            return { rows: r, pager: r.length };
        }
    });
})();
