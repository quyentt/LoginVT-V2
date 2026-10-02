/* Dữ liệu mẫu chung của các màn Chuyên cần (nhapchuyencan, nhaptheolop, tonghoptheongay) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {}, D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', P = 'PKG_CHUYENCAN_THONGTIN.';
    fx[D + 'QLSV.KIEUCHUYENCAN'] = [{ ID: 'K1', MA: 'CM', TEN: 'Có mặt', CHUNG_TENDANHMUC_TEN: 'Kiểu chuyên cần' },
        { ID: 'K2', MA: 'VP', TEN: 'Vắng có phép', CHUNG_TENDANHMUC_TEN: 'Kiểu chuyên cần' },
        { ID: 'K3', MA: 'VK', TEN: 'Vắng không phép', CHUNG_TENDANHMUC_TEN: 'Kiểu chuyên cần' }];
    fx['KHCT_ThongTin/LayDSNamNhapHoc'] = [{ NAMNHAPHOC: '2022' }, { NAMNHAPHOC: '2023' }, { NAMNHAPHOC: '2024' }, { NAMNHAPHOC: '2025' }];

    var SV = [
        ['SV1', 'BIT220263', 'Nguyễn Văn An', '12/03/2004', 'DHCQ-IT-K66A'],
        ['SV2', 'BIT220271', 'Trần Thị Bình', '25/07/2004', 'DHCQ-IT-K66A'],
        ['SV3', 'BIT220288', 'Lê Hoàng Cường', '02/11/2004', 'DHCQ-IT-K66A'],
        ['SV4', 'BBA220561', 'Phạm Thu Dung', '19/01/2004', 'DHCQ-QT-K66B'],
        ['SV5', 'BBA220574', 'Hoàng Minh Đức', '08/09/2004', 'DHCQ-QT-K66B'],
        ['SV6', 'BBA220590', 'Vũ Ngọc Hà', '30/05/2004', 'DHCQ-QT-K66B']
    ].map(function (x, i) {
        return { ID: x[0], QLSV_NGUOIHOC_ID: 'NH' + (i + 1), MASO: x[1], HOTEN: x[2], QLSV_NGUOIHOC_NGAYSINH: x[3], LOP: x[4],
            LOP_ID: 'L' + (i < 3 ? 1 : 2), HEDAOTAO_TEN: 'Đại học chính quy', KHOADAOTAO_TEN: 'K66',
            KHOAQUANLY_TEN: i < 3 ? 'Khoa Công nghệ thông tin' : 'Khoa Quản trị kinh doanh',
            DAOTAO_CHUONGTRINH_ID: 'CT' + (i < 3 ? 1 : 2), DAOTAO_CHUONGTRINH_TEN: i < 3 ? 'Công nghệ thông tin' : 'Quản trị kinh doanh',
            QLSV_NGUOIHOC_TRANGTHAI_ID: 'TT1' };
    });
    var NGAY = [
        { ID: 'N1', NGAYGHINHAN: '07/09/2026', GIO: 7, PHUT: 0, GIAY: 0 },
        { ID: 'N2', NGAYGHINHAN: '14/09/2026', GIO: 7, PHUT: 0, GIAY: 0 },
        { ID: 'N3', NGAYGHINHAN: '21/09/2026', GIO: 7, PHUT: 0, GIAY: 0 }
    ];
    function loc(o) {
        var q = (o.strTuKhoa || '').toLowerCase();
        return SV.filter(function (s) { return !q || (s.MASO + ' ' + s.HOTEN).toLowerCase().indexOf(q) >= 0; });
    }
    ums.demo.ccSV = SV;
    ums.demo.ccNgay = NGAY;

    fx[P + 'LayDSQLSV_NguoiHoc_ChuyenCan'] = function (o) { return { rows: { rs: loc(o), rsNgay: NGAY } }; };
    fx[P + 'LayKQQLSV_NguoiHoc_ChuyenCan'] = function (o) {
        var all = loc(o), sz = Number(o.pageSize) || 10, pg = Number(o.pageIndex) || 1;
        return { rows: { rs: all.slice((pg - 1) * sz, pg * sz), rsNgay: NGAY }, pager: all.length };
    };
    /* Ô có kết quả: sinh viên / ngày lẻ-chẵn, kiểu K1 nhiều hơn các kiểu khác */
    function mot(svId, ngayId, kieu) {
        var i = Number(String(svId).replace(/\D/g, '')) || 0, j = Number(String(ngayId).replace(/\D/g, '')) || 0;
        var co = kieu === 'K1' ? (i + j) % 3 !== 0 : (i + j) % 4 === 0;
        return co ? [{ ID: 'KQ' + i + '_' + j, GIATRI: 1, SOLUONG: 1 + (i + j) % 3 }] : [{ GIATRI: 0, SOLUONG: 0 }];
    }
    ums.demo.ccMot = mot;
    fx[P + 'LayKetQuaChuyenCanTheoNgay'] = function (o) { return mot(o.strQLSV_NguoiHoc_Id, o.strNgay_Gio_Phut_Giay_Id, o.strKieuChuyenCan_Id); };
    fx[P + 'Them_QLSV_NguoiHoc_ChuyenCan'] = { rows: [], message: 'Thêm thành công' };
    fx[P + 'Sua_QLSV_NguoiHoc_ChuyenCan'] = { rows: [], message: 'Cập nhật thành công' };
    fx[P + 'Xoa_QLSV_NguoiHoc_ChuyenCan1'] = { rows: [], message: 'Xoá thành công' };
    fx[P + 'KhoiTao_Ngay_ChuyenCan'] = { rows: [], message: 'Khởi tạo thành công' };
    ums.demo.add(fx);
})();
