/* Dữ liệu mẫu cho Xác nhận kết quả xét tốt nghiệp — chỉ dùng ở chế độ dựng thử. Mã sinh viên là mã bịa. */
(function () {
    function trang(rows, o) {
        var p = Number(o.pageIndex) || 1, s = Number(o.pageSize) || rows.length || 1;
        return { rows: rows.slice((p - 1) * s, p * s), pager: rows.length };
    }
    var SV = [
        ['CN01', 'SV22001', 'Nguyễn Văn An', 'K22-CNTT1', 'Công nghệ thông tin', 'Giỏi', '', 'Đã duyệt'],
        ['CN02', 'SV22017', 'Trần Thị Bình', 'K22-CNTT1', 'Công nghệ thông tin', 'Khá', '', ''],
        ['CN03', 'SV22045', 'Lê Hoàng Cường', 'K22-QTKD2', 'Quản trị kinh doanh', 'Xuất sắc', 'Giỏi', 'Không duyệt'],
        ['CN04', 'SV22058', 'Phạm Minh Đức', 'K22-QTKD2', 'Quản trị kinh doanh', 'Khá', '', '']
    ].map(function (x) {
        return { ID: x[0], QLSV_NGUOIHOC_MASO: x[1], QLSV_NGUOIHOC_HOTEN: x[2], QLSV_NGUOIHOC_NGAYSINH: '12/05/2004',
            DAOTAO_LOPQUANLY_TEN: x[3], DAOTAO_CHUONGTRINH_TEN: x[4], DAOTAO_KHOADAOTAO_TEN: 'Khóa 2022', KHOAQUANLY_TEN: 'Khoa ' + x[4],
            DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', XEPLOAI_TEN: x[5], XEPLOAI_THAYDOI_TEN: x[6], KETQUAXACNHAN_TEN: x[7] };
    });
    ums.demo.add({
        'TN_Chung/LayDSPhanLoaiTheoNguoiDung': [{ ID: 'PL1', MA: 'TN', TEN: 'Xét tốt nghiệp đại học' }, { ID: 'PL2', MA: 'TNS', TEN: 'Xét tốt nghiệp sớm' }],
        'TN_ThongTin/LayDSTN_KeHoach': function (o) {
            return [{ ID: 'TNKH01', TEN: 'Xét tốt nghiệp đợt 1 năm 2026', PHANLOAI_ID: 'PL1' },
                { ID: 'TNKH02', TEN: 'Xét tốt nghiệp sớm học kỳ 1 năm 2025-2026', PHANLOAI_ID: 'PL2' }]
                .filter(function (x) { return !o.strPhanLoai_Id || x.PHANLOAI_ID === o.strPhanLoai_Id; });
        },
        'TN_ThongTin/LayDSTN_KetQua_CongNhan': function (o) {
            var t = String(o.strTuKhoa || '').toLowerCase();
            return trang(SV.filter(function (r) { return !t || (r.QLSV_NGUOIHOC_MASO + ' ' + r.QLSV_NGUOIHOC_HOTEN).toLowerCase().indexOf(t) >= 0; }), o);
        },
        'TN_XacNhan/LayDSTinhTrangXacNhan': [
            { ID: 'XN1', TEN: 'Duyệt', THONGTIN1: 'fa fa-check-circle' },
            { ID: 'XN2', TEN: 'Không duyệt', THONGTIN1: 'fa fa-times-circle' },
            { ID: 'XN3', TEN: 'Yêu cầu bổ sung', THONGTIN1: '' }
        ],
        'TN_XacNhan/ThemMoi': [],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#VANBANG.XEPLOAI': [{ ID: 'XL1', TEN: 'Giỏi' }, { ID: 'XL2', TEN: 'Khá' }, { ID: 'XL3', TEN: 'Trung bình' }],
        'pkg_totnghiep_tinhtoan.HaBacTrucTiep': [],
        'TN_XacNhan/LayDanhSach': [
            { TINHTRANG_TEN: 'Duyệt', NOIDUNG: 'Đủ điều kiện tốt nghiệp', NGUOIXACNHAN_TENDAYDU: 'Nguyễn Thị Lan', NGAYTAO_DD_MM_YYYY: '20/06/2026' }
        ],
        'SYS_Import/getDataFormFileImport': {
            rows: { Table1: [{ 'Mã số': 'SV22001', 'Họ tên': 'Nguyễn Văn An' }, { 'Mã số': 'SV22045', 'Họ tên': 'Lê Hoàng Cường' }] },
            raw: { Id: 'Sheet1' }
        }
    });
})();
