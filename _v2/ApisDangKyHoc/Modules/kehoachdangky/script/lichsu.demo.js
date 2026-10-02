/* Dữ liệu mẫu cho kehoachdangky/lichsu — chỉ dùng ở chế độ dựng thử. */
(function () {
    var DS = [
        ['NH1', 'BIT220263', 'Nguyễn Văn', 'An', 'Công nghệ thông tin', 'Lập trình Web', 'IT3080.01 - Thứ 3 tiết 1-3, P.402', '05/08/2026 08:12:45', 'bit220263', 'Đăng ký', 'Thành công'],
        ['NH1', 'BIT220263', 'Nguyễn Văn', 'An', 'Công nghệ thông tin', 'Cơ sở dữ liệu', 'IT3090.02 - Thứ 5 tiết 4-6, P.305', '05/08/2026 08:14:02', 'bit220263', 'Đăng ký', 'Lớp đã đủ số lượng'],
        ['NH1', 'BIT220263', 'Nguyễn Văn', 'An', 'Công nghệ thông tin', 'Cơ sở dữ liệu', 'IT3090.03 - Thứ 6 tiết 1-3, P.307', '05/08/2026 08:15:30', 'bit220263', 'Đăng ký', 'Thành công'],
        ['NH4', 'BBA220561', 'Phạm Thu', 'Dung', 'Quản trị kinh doanh', 'Kinh tế vi mô', 'EC2010.01 - Thứ 2 tiết 7-9, P.201', '06/08/2026 14:02:11', 'canbo.dkh', 'Hủy đăng ký', 'Thành công'],
        ['NH5', 'BBA220574', 'Hoàng Minh', 'Đức', 'Quản trị kinh doanh', 'Marketing căn bản', 'MK2001.02 - Thứ 4 tiết 1-3, P.210', '06/08/2026 15:40:09', 'bba220574', 'Đăng ký', 'Trùng lịch học']
    ].map(function (x, i) {
        return { ID: 'LS' + (i + 1), QLSV_NGUOIHOC_ID: x[0], QLSV_NGUOIHOC_MASO: x[1], QLSV_NGUOIHOC_HODEM: x[2], QLSV_NGUOIHOC_TEN: x[3],
            NAMHOC: '2026-2027', HOCKY: '1', DOTHOC: '1', DAOTAO_CHUONGTRINH_TEN: x[4], DAOTAO_HOCPHAN_TEN: x[5],
            THONGTINLOPHOCPHAN: x[6], NGAYTAO_DD_MM_YYYY_HHMMSS: x[7], NGUOITHUCHIEN_TAIKHOAN: x[8], HANHDONG: x[9], ERR: x[10] };
    });
    function loc(o, rows) {
        var q = (o.strTuKhoa || '').toLowerCase();
        var r = rows.filter(function (x) { return !q || (x.QLSV_NGUOIHOC_MASO + ' ' + x.QLSV_NGUOIHOC_HODEM + ' ' + x.QLSV_NGUOIHOC_TEN + ' ' + x.DAOTAO_HOCPHAN_TEN).toLowerCase().indexOf(q) >= 0; });
        var s = Number(o.pageSize) || 10, p = Number(o.pageIndex) || 1;
        return { rows: r.slice((p - 1) * s, p * s), pager: r.length };
    }
    ums.demo.add({
        'DKH_XuLy/LayKetQuaLichSuDangKyHoc': function (o) { return loc(o, DS); },
        'DKH_XuLy/LayKetQuaDangKyHoc': function (o) { return loc(o, DS.filter(function (x) { return x.ERR === 'Thành công' && x.HANHDONG === 'Đăng ký'; })); }
    });
})();
