/* Dữ liệu mẫu cho Tổng hợp kết quả xét học bổng — chỉ dùng ở chế độ dựng thử. */
(function () {
    var SV = [
        ['KQ01', 'SV22001', 'Nguyễn Văn', 'An', '12/03/2004', 'K67-KTPM1', 'Xuất sắc', ''],
        ['KQ02', 'SV22014', 'Trần Thị', 'Bình', '05/07/2004', 'K67-KTPM1', 'Giỏi', 'Khá'],
        ['KQ03', 'SV22027', 'Lê Hoàng', 'Cường', '21/11/2004', 'K67-QTKD1', 'Giỏi', ''],
        ['KQ04', 'SV22031', 'Phạm Thu', 'Dung', '02/01/2004', 'K67-QTKD1', 'Khá', ''],
        ['KQ05', 'SV23008', 'Hoàng Minh', 'Đức', '14/09/2005', 'K68-KTPM1', 'Xuất sắc', ''],
        ['KQ06', 'SV23019', 'Vũ Ngọc', 'Hà', '30/04/2005', 'K68-KTPM1', 'Giỏi', ''],
        ['KQ07', 'SV23022', 'Đặng Quốc', 'Huy', '08/08/2005', 'K68-KTPM1', 'Khá', ''],
        ['KQ08', 'SV23035', 'Bùi Thanh', 'Lam', '19/12/2005', 'K68-KTPM1', 'Giỏi', ''],
        ['KQ09', 'SV23040', 'Ngô Bảo', 'Ngọc', '03/03/2005', 'K68-KTPM1', 'Khá', ''],
        ['KQ10', 'SV23052', 'Đỗ Gia', 'Phúc', '27/06/2005', 'K68-KTPM1', 'Giỏi', ''],
        ['KQ11', 'SV23066', 'Mai Anh', 'Quân', '11/10/2005', 'K68-KTPM1', 'Xuất sắc', '']
    ];
    var ROWS = SV.map(function (x) {
        var k68 = x[5].indexOf('K68') === 0;
        return { ID: x[0], QLSV_NGUOIHOC_MASO: x[1], QLSV_NGUOIHOC_HODEM: x[2], QLSV_NGUOIHOC_TEN: x[3], QLSV_NGUOIHOC_NGAYSINH: x[4],
            DAOTAO_LOPQUANLY_TEN: x[5], DAOTAO_CHUONGTRINH_TEN: x[5].indexOf('QTKD') > 0 ? 'Quản trị kinh doanh' : 'Kỹ thuật phần mềm',
            DAOTAO_KHOADAOTAO_TEN: k68 ? 'Khóa 68' : 'Khóa 67', KHOAQUANLY_TEN: x[5].indexOf('QTKD') > 0 ? 'Khoa Kinh tế' : 'Khoa Công nghệ thông tin',
            DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', XEPLOAI_TEN: x[6], XEPLOAI_THAYDOI: x[7] };
    });
    var TT = [{ ID: 'TTDT', TEN: 'Đào tạo' }, { ID: 'TTTC', TEN: 'Tài chính' }, { ID: 'TTCT', TEN: 'Công tác HSSV' }];
    var KQ = ['Đồng ý', 'Đồng ý', 'Chờ xác nhận', 'Không đồng ý'];
    ums.demo.add({
        'HB_XacNhanKetQua/LayDSTinhTrangQuyDinhCuoi': function (o) { return o.strHB_QuyHocBong_Id === 'QHB3' ? TT.slice(0, 2) : TT; },
        'HB_KetQua/LayDSHB_KetQua_CongNhan': function (o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            var rs = ROWS.filter(function (r) {
                return !q || (r.QLSV_NGUOIHOC_MASO + ' ' + r.QLSV_NGUOIHOC_HODEM + ' ' + r.QLSV_NGUOIHOC_TEN).toLowerCase().indexOf(q) >= 0;
            });
            var sz = Number(o.pageSize) || 10, pi = Number(o.pageIndex) || 1;
            return { rows: rs.slice((pi - 1) * sz, pi * sz), pager: rs.length };
        },
        'HB_KetQua/LayKetQuaXacNhanCuoi': function (o) {
            var n = (String(o.strSanPham_Id).charCodeAt(3) + String(o.strPhanLoai_Id).charCodeAt(3)) % KQ.length;
            return [{ KETQUAXACNHAN_TEN: KQ[n] }];
        }
    });
})();
