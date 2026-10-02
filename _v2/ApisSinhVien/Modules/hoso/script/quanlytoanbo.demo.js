/* Dữ liệu mẫu cho hoso/quanlytoanbo — chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {};
    function dong(i, ma, hd, ten, ns, sv) {
        return { ID: 'Q100000000000000000000000000000' + i, QLSV_NGUOIHOC_ID: sv, QLSV_NGUOIHOC_MASO: ma, QLSV_NGUOIHOC_HODEM: hd, QLSV_NGUOIHOC_TEN: ten,
            QLSV_NGUOIHOC_NGAYSINH: ns, QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học', DAOTAO_LOPQUANLY_TEN: 'DCQT.K14.01', DAOTAO_CHUONGTRINH_TEN: 'Quản trị kinh doanh',
            DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT10000000000000000000000000001', DAOTAO_KHOADAOTAO_TEN: 'Khoá 14', DAOTAO_KHOAQUANLY_TEN: 'Khoa Kinh tế',
            DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', TTLL_KHICANBAOTINCHOAI_ODAU: 'Bố: Đặng Văn Bình — 0987 654 321', QLSV_QUYETDINH_SOQD: '', QLSV_QUYETDINH_LYDO: '' };
    }
    var DS = [
        dong(1, 'DCQT.14.420233195', 'Đặng Bác', 'Ái', '12/03/2005', 'C1000000000000000000000000000001'),
        dong(2, 'BIT220263', 'Nguyễn Thị Thu', 'Hà', '05/11/2004', 'C1000000000000000000000000000002'),
        dong(3, 'BBA220561', 'Lê', 'Minh', '01/01/2004', 'C1000000000000000000000000000003')
    ];
    DS[2].QLSV_TRANGTHAINGUOIHOC_TEN = 'Bảo lưu'; DS[2].QLSV_QUYETDINH_SOQD = '215/QĐ-ĐHKT'; DS[2].QLSV_QUYETDINH_LYDO = 'Nghỉ ốm dài ngày';
    fx['pkg_hosohocvien.LayDanhSachHoSoNhieuNganh'] = function (o) {
        var q = String(o.strTuKhoa || '').toLowerCase();
        var ds = DS.filter(function (r) { return !q || (r.QLSV_NGUOIHOC_MASO + ' ' + r.QLSV_NGUOIHOC_HODEM + ' ' + r.QLSV_NGUOIHOC_TEN).toLowerCase().indexOf(q) >= 0; });
        return { rows: ds, pager: ds.length };
    };
    fx['SV_HoSo/Xoa'] = [];
    fx['SV_QuyetDinh_NguoiHoc/LayDanhSach'] = [
        { SOQUYETDINH: '120/QĐ-ĐHKT', NGAYQUYETDINH: '15/08/2023', NGAYHIEULUC: '01/09/2023', NGUYENNHAN_LYDO: 'Trúng tuyển năm 2023', LOAIQUYETDINH_TEN: 'Công nhận sinh viên', DSKETQUANHIEUKY: '2023-2024 HK1' }
    ];
    fx['SV_HoatDong_ThayDoi/LayDanhSach'] = [
        { DAOTAO_LOPCU_TEN: 'DCQT.K14.02', DAOTAO_LOPMOI_TEN: 'DCQT.K14.01', SOQUYETDINH: '301/QĐ-ĐHKT', LOAIQUYETDINH_TEN: 'Chuyển lớp', NGAYHIEULUC: '10/02/2024' }
    ];
    fx['PKG_HOSOSINHVIEN_THONGTIN.LayDSQLSV_ThongTin_CapNhat'] = function (o) {
        var r = DS.filter(function (x) { return x.QLSV_NGUOIHOC_ID === o.strQLSV_NguoiHoc_Id; })[0];
        return r ? [{ ID: 'LY10000000000000000000000000001', NOIDUNG: 'Đã nộp bổ sung bản sao giấy khai sinh', QLSV_NGUOIHOC_MASO: r.QLSV_NGUOIHOC_MASO,
            QLSV_NGUOIHOC_HODEM: r.QLSV_NGUOIHOC_HODEM, QLSV_NGUOIHOC_TEN: r.QLSV_NGUOIHOC_TEN, DAOTAO_CHUONGTRINH_TEN: 'Quản trị kinh doanh', DAOTAO_CHUONGTRINH_MA: '7340101',
            NGUOITAO_TAIKHOAN: 'ctsv01', NGAY_DD_MM_YYYY_HHMMSS: '20/09/2026 09:15:00', NGAYCUOI_DD_MM_YYYY_HHMMSS: '', NGUOICUOI_TAIKHOAN: '' }] : [];
    };
    ['Them_QLSV_ThongTin_CapNhat', 'Sua_QLSV_ThongTin_CapNhat', 'Xoa_QLSV_ThongTin_CapNhat'].forEach(function (k) { fx['PKG_HOSOSINHVIEN_THONGTIN.' + k] = { rows: [], raw: { Id: 'LY2' } }; });
    function tc(n) { return { DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm 2025-2026', DAOTAO_THOIGIANDAOTAO_DOT: '1', TAICHINH_CACKHOANTHU_TEN: 'Học phí', NOIDUNG: 'Học phí HK1', SOTIEN: n,
        NGAYTAO_DD_MM_YYYY: '05/09/2025', CHUNGTU_SO: 'PT000123', NGUOITAO_TENDAYDU: 'Kế toán 01' }; }
    fx['TC_ThongTinChung/LayDSKhoanPhaiNop'] = [tc(8500000)];
    fx['TC_ThongTinChung/LayDSKhoanDaNop'] = [tc(8000000)];
    fx['TC_ThongTinChung/LayDSKhoanNoRieng'] = [tc(500000)];
    ['LayDSKhoanNoChung', 'LayDSKhoanMien', 'LayDSKhoanDaRut', 'LayDSKhoanDuChung', 'LayDSKhoanDuRieng'].forEach(function (k) { fx['TC_ThongTinChung/' + k] = []; });
    ums.demo.add(fx);
})();
