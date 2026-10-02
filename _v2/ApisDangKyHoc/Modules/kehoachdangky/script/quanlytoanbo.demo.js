/* Dữ liệu mẫu cho kehoachdangky/quanlytoanbo — chỉ dùng ở chế độ dựng thử. */
(function () {
    var DS = [
        ['NH1', 'BIT220263', 'Nguyễn Văn', 'An', '12/03/2004', 'Đang học', 'K67-KTPM1', 'Kỹ thuật phần mềm', 'Khóa 67', 'Khoa Công nghệ thông tin'],
        ['NH2', 'BIT220271', 'Trần Thị', 'Bình', '05/07/2004', 'Đang học', 'K67-KTPM1', 'Kỹ thuật phần mềm', 'Khóa 67', 'Khoa Công nghệ thông tin'],
        ['NH3', 'BIT220288', 'Lê Hoàng', 'Cường', '21/11/2004', 'Bảo lưu', 'K67-KTPM1', 'Kỹ thuật phần mềm', 'Khóa 67', 'Khoa Công nghệ thông tin'],
        ['NH4', 'BBA220561', 'Phạm Thu', 'Dung', '02/01/2004', 'Đang học', 'K67-QTKD2', 'Quản trị kinh doanh', 'Khóa 67', 'Khoa Kinh tế'],
        ['NH5', 'BBA220574', 'Hoàng Minh', 'Đức', '18/09/2004', 'Đang học', 'K67-QTKD2', 'Quản trị kinh doanh', 'Khóa 67', 'Khoa Kinh tế'],
        ['NH6', 'BIT230210', 'Vũ Ngọc', 'Hà', '30/04/2005', 'Đang học', 'K68-HTTT1', 'Hệ thống thông tin', 'Khóa 68', 'Khoa Công nghệ thông tin'],
        ['NH1', 'BIT220263', 'Nguyễn Văn', 'An', '12/03/2004', 'Đang học', 'K67-QTKD2', 'Quản trị kinh doanh (ngành 2)', 'Khóa 67', 'Khoa Kinh tế']
    ].map(function (x, i) {
        return { ID: 'HS' + (i + 1), QLSV_NGUOIHOC_ID: x[0], QLSV_NGUOIHOC_MASO: x[1], QLSV_NGUOIHOC_HODEM: x[2], QLSV_NGUOIHOC_TEN: x[3],
            QLSV_NGUOIHOC_NGAYSINH: x[4], DAOTAO_LOPQUANLY_ID: 'L-' + x[6], QLSV_TRANGTHAINGUOIHOC_TEN: x[5], DAOTAO_LOPQUANLY_TEN: x[6], DAOTAO_CHUONGTRINH_TEN: x[7],
            DAOTAO_KHOADAOTAO_TEN: x[8], DAOTAO_KHOAQUANLY_TEN: x[9], DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy' };
    });
    ums.demo.add({
        /* bản Kế hoạch chương trình (data-kieu="khct"): hộp Chuyển lớp */
        'KHCT_LopQuanLy/LayDanhSach': function (o) {
            return o.strDaoTao_KhoaDaoTao_Id ? [{ ID: 'L-K67-KTPM1', TEN: 'K67-KTPM1', SOLUONGTHUCTE: 42 },
                { ID: 'L-K67-KTPM2', TEN: 'K67-KTPM2', SOLUONGTHUCTE: 39 }, { ID: 'L-K67-QTKD2', TEN: 'K67-QTKD2', SOLUONGTHUCTE: 45 }] : [];
        },
        'PKG_HOSOHOCVIEN_QUYETDINH.ThucThi_ChuyenLop_TrucTiep': { rows: [] },
        'SV_HoSoNhieuNganh/LayDanhSach': function (o) {
            var q = (o.strTuKhoa || '').toLowerCase();
            var r = DS.filter(function (x) { return !q || (x.QLSV_NGUOIHOC_MASO + ' ' + x.QLSV_NGUOIHOC_HODEM + ' ' + x.QLSV_NGUOIHOC_TEN).toLowerCase().indexOf(q) >= 0; });
            var s = Number(o.pageSize) || 10, p = Number(o.pageIndex) || 1;
            return { rows: r.slice((p - 1) * s, p * s), pager: r.length };
        }
    });
})();
