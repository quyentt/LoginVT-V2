/* Dữ liệu mẫu cho nhapchuyencan/khongdiemdanh — chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {}, P = 'PKG_CHUYENCAN_THONGTIN.';
    var DS = [
        { ID: 'VP1', QLSV_NGUOIHOC_ID: 'NH1', MASO: 'BIT220263', HODEM: 'Nguyễn Văn', TEN: 'An', LOP: 'DHCQ-IT-K66A', LOP_ID: 'L1', MOTA: 'Quên thẻ sinh viên' },
        { ID: 'VP2', QLSV_NGUOIHOC_ID: 'NH4', MASO: 'BBA220561', HODEM: 'Phạm Thu', TEN: 'Dung', LOP: 'DHCQ-QT-K66B', LOP_ID: 'L2', MOTA: 'Máy điểm danh lỗi' },
        { ID: 'VP3', QLSV_NGUOIHOC_ID: 'NH5', MASO: 'BBA220574', HODEM: 'Hoàng Minh', TEN: 'Đức', LOP: 'DHCQ-QT-K66B', LOP_ID: 'L2', MOTA: '' }
    ];
    fx[P + 'LayDSQLSV_NH_TuGhiNhan_ViPham'] = function (o) {
        var q = (o.strTuKhoa || '').toLowerCase();
        var r = DS.filter(function (x) { return !q || (x.MASO + ' ' + x.HODEM + ' ' + x.TEN).toLowerCase().indexOf(q) >= 0; });
        return { rows: r, pager: r.length };
    };
    fx[P + 'Them_QLSV_NH_TuGhiNhan_ViPham'] = { rows: [], message: 'Lưu thành công' };
    fx[P + 'Xoa_QLSV_NH_TuGhiNhan_ViPham'] = { rows: [], message: 'Xoá thành công' };
    /* Hộp chọn sinh viên (Corei genModal_SinhVien → PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc) */
    var NH = [
        ['SV2', 'BIT220271', 'Trần Thị', 'Bình', 'DHCQ-IT-K66A', 'L1'],
        ['SV3', 'BIT220288', 'Lê Hoàng', 'Cường', 'DHCQ-IT-K66A', 'L1'],
        ['SV6', 'BBA220590', 'Vũ Ngọc', 'Hà', 'DHCQ-QT-K66B', 'L2']
    ].map(function (x) {
        return { ID: x[0], QLSV_NGUOIHOC_ID: x[0], QLSV_NGUOIHOC_MASO: x[1], QLSV_NGUOIHOC_HODEM: x[2], QLSV_NGUOIHOC_TEN: x[3],
            QLSV_NGUOIHOC_NGAYSINH: '01/01/2004', DAOTAO_LOPQUANLY_TEN: x[4], DAOTAO_LOPQUANLY_ID: x[5],
            DAOTAO_CHUONGTRINH_TEN: x[5] === 'L1' ? 'Công nghệ thông tin' : 'Quản trị kinh doanh', DAOTAO_KHOADAOTAO_TEN: 'K66',
            QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học' };
    });
    fx['PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc'] = function (o) {
        var q = (o.strTuKhoa || '').toLowerCase();
        var r = NH.filter(function (x) { return !q || (x.QLSV_NGUOIHOC_MASO + ' ' + x.QLSV_NGUOIHOC_HODEM + ' ' + x.QLSV_NGUOIHOC_TEN).toLowerCase().indexOf(q) >= 0; });
        return { rows: r, pager: r.length };
    };
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#IMPORTWITHPROC_CCTGN'] = [];
    ums.demo.add(fx);
})();
