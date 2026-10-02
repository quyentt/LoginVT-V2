/* Dữ liệu mẫu cho thongtinsinhvien/thanhtoanonline — chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {}, gach = 0;
    fx['CM_DanhMucDuLieu/LayDanhSach'] = function (o) {
        if (o.strMaBangDanhMuc === 'VNPAY.CAUHINHTHANHTOAN') return [{ MA: 'KHONGCHOPHEPSUASOTIEN', THONGTIN1: '0' }];
        return [{ MA: 'VNPAY', THONGTIN1: 'Cổng VNPAY', THONGTIN2: '' }, { MA: 'BIDV', THONGTIN1: 'BIDV — mã QR', THONGTIN2: 'SV01' }];
    };
    fx['SV_HoSo/LayDanhSach'] = function (o) { return /220101/.test(o.strTuKhoa || '') ? [{ ID: 'HS01', MASO: 'BIT220101' }] : []; };
    fx['TC_TCThanhToan/LayThongTinTaiChinh'] = function (o) {
        if (!o.strMaSinhVien) return { rs: [], rsSinhVien: [], rsChiTiet: [] };
        return {
            rs: [{ MASINHVIEN: 'BIT220101', HOVATEN: 'Nguyễn Văn An', TKAO: '9601234567', MADONHANG_GUI_NGANHANG: 'DH0001', NGAYTAODONHANG: '22/09/2026' }],
            rsSinhVien: [{ HOVATEN: 'Nguyễn Văn An', MASINHVIEN: 'BIT220101', NGAYSINH: '12/03/2004', LOP: 'K67-KTPM1', NGANH: 'Kỹ thuật phần mềm', KHOADAOTAO: 'Khóa 67' }],
            rsChiTiet: [
                { ID: 'K1', NOIDUNG: 'Học phí học kỳ 1 năm 2026–2027', SOTIEN: 9800000, GHICHU: '', BATBUOC: 1 },
                { ID: 'K2', NOIDUNG: 'Bảo hiểm y tế', SOTIEN: 1105000, GHICHU: 'Bắt buộc theo quy định', BATBUOC: 0 },
                { ID: 'K3', NOIDUNG: 'Lệ phí thư viện', SOTIEN: 150000, GHICHU: '', BATBUOC: 0 }
            ]
        };
    };
    fx['TC_TCThanhToan/XacNhanThanhToanDonHang'] = function () { return 'DHTH0001'; };
    fx['CTT_BIDVPayment/VanTinQRCode'] = function () { return JSON.stringify({ errorCode: '000', vietQRImage: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' }); };
    fx['TC_TCThanhToan/KiemTraGachNoTheoDonHang'] = function () { return ++gach > 1 ? [{ ID: 'X' }] : []; };
    fx['CTT_ThongTinKetNoi/KetNoiVNPAY'] = function () { return ''; };
    ums.demo.add(fx);
})();
