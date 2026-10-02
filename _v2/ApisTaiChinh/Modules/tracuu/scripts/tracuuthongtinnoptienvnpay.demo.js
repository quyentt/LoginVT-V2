/* Dữ liệu mẫu cho tracuuthongtinnoptienvnpay — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    var T = ums.tcTraCuu;
    var ROWS = [
        { ID: 'VP1', MASINHVIEN: 'SV2201001', HOVATENSINHVIEN: 'Nguyễn Văn An', NGAYSINH: '12/03/2004', LOP: 'CNTT K22A', NGANHDAOTAO: 'Công nghệ thông tin', KHOADAOTAO: 'K22', SOTIENPHAINOP: 9800000, NGAYTAODH_DD_MM_YYYY_HHMMSS: '02/09/2026 08:15:22', TRANSACTIONSTATUS: '00', MADONHANG_GUI_NGANHANG: 'b688bce4082442598594119d8cf27439_5', VNP_TRANSACTIONNO: '14512877', SOTIENVNPAY: 9800000, VNP_MESSAGE: 'Giao dịch thành công', TXNREF: '13501326', NGANHANG: 'NCB' },
        { ID: 'VP2', MASINHVIEN: 'SV2201002', HOVATENSINHVIEN: 'Trần Thị Bình', NGAYSINH: '28/11/2004', LOP: 'KT K22B', NGANHDAOTAO: 'Kế toán', KHOADAOTAO: 'K22', SOTIENPHAINOP: 4900000, NGAYTAODH_DD_MM_YYYY_HHMMSS: '03/09/2026 21:40:03', TRANSACTIONSTATUS: '24', MADONHANG_GUI_NGANHANG: 'c1f0a7d3e22b4f0c9d51c3b2a8f7e610_1', VNP_TRANSACTIONNO: '', SOTIENVNPAY: 0, VNP_MESSAGE: 'Khách hàng huỷ giao dịch', TXNREF: '13501390', NGANHANG: 'VCB' },
        { ID: 'VP3', MASINHVIEN: 'SV2305020', HOVATENSINHVIEN: 'Phạm Minh Đức', NGAYSINH: '19/01/2005', LOP: 'QTKD K23', NGANHDAOTAO: 'Quản trị kinh doanh', KHOADAOTAO: 'K23', SOTIENPHAINOP: 1200000, NGAYTAODH_DD_MM_YYYY_HHMMSS: '05/09/2026 10:02:44', TRANSACTIONSTATUS: '00', MADONHANG_GUI_NGANHANG: '0e9d1c2b3a4f4e5d8c7b6a5f4e3d2c1b_2', VNP_TRANSACTIONNO: '14519004', SOTIENVNPAY: 1200000, VNP_MESSAGE: 'Giao dịch thành công', TXNREF: '13501511', NGANHANG: 'BIDV' }
    ];
    ums.demo.add({
        'TC_TraCuuHocPhi/LayDS_LichSuThanhToanOnline': function (o) {
            return T.demoPage(T.demoLike(ROWS, o.strTuKhoa, ['MASINHVIEN', 'HOVATENSINHVIEN']), { pageIndex: o.PageNumber, pageSize: o.ItemPerPage });
        },
        'CTT_HocPhi/ThucHienGachNo': []
    });
})();
