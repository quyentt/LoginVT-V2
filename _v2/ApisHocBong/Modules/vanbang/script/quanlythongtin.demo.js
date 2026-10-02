/* Dữ liệu mẫu cho Quản lý thông tin văn bằng — chỉ dùng ở chế độ dựng thử. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    var SV = [
        ['VB01', 'SV20001', 'Nguyễn Văn', 'An', 12, 3, 2002, 'Nam', 'Kinh', 'Hà Nội', 'Kỹ thuật phần mềm', 'QH-2026-001', '0012/VB', '215/QĐ-ĐHKT', '20/06/2026', '25/06/2026', '26/06/2026'],
        ['VB02', 'SV20014', 'Trần Thị', 'Bình', 5, 7, 2002, 'Nữ', 'Kinh', 'Nam Định', 'Kỹ thuật phần mềm', 'QH-2026-002', '0013/VB', '215/QĐ-ĐHKT', '20/06/2026', '25/06/2026', '26/06/2026'],
        ['VB03', 'SV20027', 'Lê Hoàng', 'Cường', 21, 11, 2002, 'Nam', 'Tày', 'Lạng Sơn', 'Quản trị kinh doanh', '', '', '', '', '', ''],
        ['VB04', 'SV20031', 'Phạm Thu', 'Dung', 2, 1, 2003, 'Nữ', 'Kinh', 'Thái Bình', 'Quản trị kinh doanh', '', '', '', '', '', ''],
        ['VB05', 'SV20045', 'Hoàng Minh', 'Đức', 14, 9, 2002, 'Nam', 'Mường', 'Hòa Bình', 'Hệ thống thông tin', 'QH-2026-005', '', '215/QĐ-ĐHKT', '20/06/2026', '', '']
    ];
    var ROWS = SV.map(function (x) {
        return { ID: x[0], QLSV_NGUOIHOC_MASO: x[1], QLSV_NGUOIHOC_HODEM: x[2], QLSV_NGUOIHOC_TEN: x[3], QLSV_NGUOIHOC_NGAYSINH: x[4],
            QLSV_NGUOIHOC_THANGSINH: x[5], QLSV_NGUOIHOC_NAMSINH: x[6], QLSV_NGUOIHOC_GIOITINH: x[7], QLSV_NGUOIHOC_DANTOC: x[8],
            QLSV_NGUOIHOC_NOISINH: x[9], QLSV_NGUOIHOC_NGANHNGHE: x[10], SOHIEUBANG: x[11], SOVAOSOCAPBANG: x[12],
            SOQUYETDINH: x[13], NGAYQUYETDINH: x[14], NGAYKYBANG: x[15], NGAYVAOSOCAPBANG: x[16], DUONGDANANHCANHAN: '' };
    });
    var TT = [
        { ID: 'XN1', MA: 'DUYET', TEN: 'Duyệt', THONGTIN1: 'fa fa-check-circle', THONGTIN2: 'color: #16a34a', CHUNG_TENDANHMUC_TEN: 'Xác nhận văn bằng' },
        { ID: 'XN2', MA: 'KHONGDUYET', TEN: 'Không duyệt', THONGTIN1: 'fa fa-times-circle', THONGTIN2: 'color: #dc2626', CHUNG_TENDANHMUC_TEN: 'Xác nhận văn bằng' },
        { ID: 'XN3', MA: 'BOSUNG', TEN: 'Yêu cầu bổ sung', THONGTIN1: 'fa fa-exclamation-circle', THONGTIN2: 'color: #d97706', CHUNG_TENDANHMUC_TEN: 'Xác nhận văn bằng' }
    ];
    var fx = {};
    fx[D + 'TN.PHANLOAI'] = [
        { ID: 'PL1', MA: 'TN', TEN: 'Xét tốt nghiệp', CHUNG_TENDANHMUC_TEN: 'Phân loại' },
        { ID: 'PL2', MA: 'HB', TEN: 'Xét học bổng', CHUNG_TENDANHMUC_TEN: 'Phân loại' }
    ];
    fx[D + 'TN.XACNHANVANBANG'] = TT;
    fx['TN_QuanLyThongTin/LayDSTinhTrangQuanLyThongTin'] = TT.slice(0, 2);
    fx['TN_KetQua_CongNhan_VB/LayDanhSach'] = function (o) {
        var q = String(o.strTuKhoa || '').toLowerCase();
        var rs = ROWS.filter(function (r) {
            return !q || (r.QLSV_NGUOIHOC_MASO + ' ' + r.QLSV_NGUOIHOC_HODEM + ' ' + r.QLSV_NGUOIHOC_TEN).toLowerCase().indexOf(q) >= 0;
        });
        var sz = Number(o.pageSize) || 10, pi = Number(o.pageIndex) || 1;
        return { rows: rs.slice((pi - 1) * sz, pi * sz), pager: rs.length };
    };
    fx['TN_KetQua_CongNhan_VB/CapNhat'] = function (o) {
        ROWS.forEach(function (r) {
            if (r.ID !== o.strId) return;
            r.QLSV_NGUOIHOC_HODEM = o.strNguoiHoc_HoDem; r.QLSV_NGUOIHOC_TEN = o.strNguoiHoc_Ten;
            r.SOQUYETDINH = o.strSoQuyetDinh; r.NGAYQUYETDINH = o.strNgayQuyetDinh;
            r.NGAYKYBANG = o.strNgayKyBang; r.NGAYVAOSOCAPBANG = o.strNgayVaoSoCapBang;
        });
        return [];
    };
    var n = 20;
    fx['TN_KetQua_CongNhan_VB/SinhSoHieuVanBang'] = function (o) {
        ROWS.forEach(function (r) { if (r.ID === o.strTN_KetQua_CongNhan_VB_Id && !r.SOHIEUBANG) r.SOHIEUBANG = 'QH-2026-0' + (n++); });
        return [];
    };
    fx['TN_KetQua_CongNhan_VB/SinhSoVaoSo'] = function (o) {
        ROWS.forEach(function (r) { if (r.ID === o.strTN_KetQua_CongNhan_VB_Id && !r.SOVAOSOCAPBANG) r.SOVAOSOCAPBANG = '00' + (n++) + '/VB'; });
        return [];
    };
    fx['TS_QuanLyThongTinQuanLyThongTin/ThemMoi'] = [];
    fx['TN_VanBang_XacNhanIn/LayDanhSach'] = [
        { TINHTRANG_TEN: 'Yêu cầu bổ sung', NOIDUNG: 'Bổ sung bản sao giấy khai sinh', NGUOIQuanLyThongTin_TENDAYDU: 'Lê Thu Hà', NGAYTAO_DD_MM_YYYY: '18/06/2026' },
        { TINHTRANG_TEN: 'Duyệt', NOIDUNG: 'Hồ sơ đầy đủ', NGUOIQuanLyThongTin_TENDAYDU: 'Lê Thu Hà', NGAYTAO_DD_MM_YYYY: '22/06/2026' }
    ];
    ums.demo.add(fx);
})();
