/* Dữ liệu mẫu cho Tổng hợp kết quả xét tốt nghiệp — chỉ dùng ở chế độ dựng thử. Mã sinh viên là mã bịa. */
(function () {
    var SV = [
        ['KQ01', 'SV22001', 'Nguyễn Văn', 'An', 'K22-CNTT1', 'Giỏi', '', 'Đã duyệt'],
        ['KQ02', 'SV22017', 'Trần Thị', 'Bình', 'K22-CNTT1', 'Khá', '', 'Chờ xác nhận'],
        ['KQ03', 'SV22045', 'Lê Hoàng', 'Cường', 'K22-QTKD2', 'Xuất sắc', 'Giỏi', 'Đã duyệt'],
        ['KQ04', 'SV22058', 'Phạm Minh', 'Đức', 'K22-QTKD2', 'Khá', '', 'Không duyệt']
    ];
    var ROWS = SV.map(function (x) {
        return { ID: x[0], QLSV_NGUOIHOC_MASO: x[1], QLSV_NGUOIHOC_HODEM: x[2], QLSV_NGUOIHOC_TEN: x[3], QLSV_NGUOIHOC_NGAYSINH: '12/05/2004',
            DAOTAO_LOPQUANLY_TEN: x[4], DAOTAO_CHUONGTRINH_TEN: x[4].indexOf('QTKD') > 0 ? 'Quản trị kinh doanh' : 'Công nghệ thông tin',
            DAOTAO_KHOADAOTAO_TEN: 'Khóa 2022', KHOAQUANLY_TEN: x[4].indexOf('QTKD') > 0 ? 'Khoa Kinh tế' : 'Khoa Công nghệ thông tin',
            DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', XEPLOAI_TEN: x[5], XEPLOAI_THAYDOI: x[6], KETQUAXACNHAN_TEN: x[7] };
    });
    ums.demo.add({
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TN.PHANLOAI': [{ ID: 'PL1', TEN: 'Xét tốt nghiệp đại học' }, { ID: 'PL2', TEN: 'Xét tốt nghiệp sớm' }],
        'TN_XacNhan/LayDSTinhTrangQuyDinhCuoi': [{ ID: 'TTDT', TEN: 'Phòng Đào tạo' }],
        'TN_KetQua_CongNhan/LayDanhSach': function (o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            var rs = ROWS.filter(function (r) {
                return !q || (r.QLSV_NGUOIHOC_MASO + ' ' + r.QLSV_NGUOIHOC_HODEM + ' ' + r.QLSV_NGUOIHOC_TEN).toLowerCase().indexOf(q) >= 0;
            });
            var sz = Number(o.pageSize) || 10, pi = Number(o.pageIndex) || 1;
            return { rows: rs.slice((pi - 1) * sz, pi * sz), pager: rs.length };
        }
    });
})();
