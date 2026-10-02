/* Dữ liệu mẫu cho thanhtoanonline (Cổng sinh viên) — chỉ dùng ở chế độ dựng thử.
   Người học thủ vai trong bản dựng thử là SV0001. Đường GHI (nộp trước, xoá, xác
   nhận đơn hàng, gạch nợ) đổi luôn dữ liệu trong bộ nhớ để màn hình phản ánh đúng. */
(function () {
    var sv = {
        ID: 'SV0001', HOVATEN: 'Lăng Văn Huy', MASINHVIEN: '25001029', NGAYSINH: '18/07/2007',
        LOP: 'DCOT.16.2', NGANH: 'Công nghệ thông tin', KHOADAOTAO: 'Khóa 16',
        DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT16CNTT'
    };
    var rs = {
        MASINHVIEN: '25001029', HOVATEN: 'Lăng Văn Huy', TKAO: '9704251029',
        NOIDUNG: '', MADONHANG_GUI_NGANHANG: 'DH25001029', NGAYTAODONHANG: '23/09/2026'
    };
    var rows = [
        { ID: 'KT01', NOIDUNG: 'Học phí học kỳ 1 năm học 2026 - 2027', SOTIEN: 9750000, GHICHU: '15 tín chỉ', BATBUOC: 0, DUOCSUASOTIENCHITIET: 1 },
        { ID: 'KT02', NOIDUNG: 'Bảo hiểm y tế năm 2026 - 2027', SOTIEN: 1105000, GHICHU: 'Bắt buộc theo quy định', BATBUOC: 0, DUOCSUASOTIENCHITIET: 0 },
        { ID: 'KT03', NOIDUNG: 'Lệ phí nhập học và khám sức khỏe', SOTIEN: 450000, GHICHU: '', BATBUOC: 0, DUOCSUASOTIENCHITIET: 0 },
        { ID: 'KT04', NOIDUNG: 'Nộp trước - Học phí học kỳ 2', SOTIEN: 2000000, GHICHU: 'Sinh viên tự đăng ký', BATBUOC: 0, DUOCSUASOTIENCHITIET: 0 }
    ];
    /* Chi tiết của khoản học phí (hộp "Danh sách") */
    var chiTiet = {
        KT01: [
            { ID: 'CT01', DAOTAO_HOCPHAN_TEN: 'Lập trình hướng đối tượng', DAOTAO_HOCPHAN_MA: 'IT3100', KIEUHOC_TEN: 'Học lần đầu', DANGKY_LOPHOCPHAN_TEN: 'IT3100.01', TAICHINH_CACKHOANTHU_TEN: 'Học phí tín chỉ', SOTIEN: 3250000, SOTINCHI: 3, THOIGIAN: 'Học kỳ 1, đợt 1' },
            { ID: 'CT02', DAOTAO_HOCPHAN_TEN: 'Cơ sở dữ liệu', DAOTAO_HOCPHAN_MA: 'IT3090', KIEUHOC_TEN: 'Học lần đầu', DANGKY_LOPHOCPHAN_TEN: 'IT3090.02', TAICHINH_CACKHOANTHU_TEN: 'Học phí tín chỉ', SOTIEN: 3250000, SOTINCHI: 3, THOIGIAN: 'Học kỳ 1, đợt 1' },
            { ID: 'CT03', DAOTAO_HOCPHAN_TEN: 'Mạng máy tính', DAOTAO_HOCPHAN_MA: 'IT4060', KIEUHOC_TEN: 'Học lại', DANGKY_LOPHOCPHAN_TEN: 'IT4060.03', TAICHINH_CACKHOANTHU_TEN: 'Học phí học lại', SOTIEN: 3250000, SOTINCHI: 3, THOIGIAN: 'Học kỳ 1, đợt 2' }
        ]
    };
    var daGachNo = {}, lanHoi = {};

    var fx = {};

    fx['CM_DanhMucDuLieu/LayDanhSach'] = function (o) {
        if (o.strMaBangDanhMuc === 'VNPAY.CAUHINHTHANHTOAN') {
            return [{ MA: 'KHONGCHOPHEPSUASOTIEN', TEN: 'Không cho phép sửa số tiền', THONGTIN1: '1' }];
        }
        if (o.strMaBangDanhMuc === 'VNPAY.NGANHANG') {
            return [
                /* HESO1 = thứ tự hiện (kéo gốc 30/9: màn sắp theo cột này) */
                { MA: 'BIDV', THONGTIN1: 'BIDV - mã QR', THONGTIN2: 'BIDV0001', HESO1: 2 },
                { MA: 'VNPAY', THONGTIN1: 'Cổng thanh toán VNPAY', THONGTIN2: '', HESO1: 1 },
                { MA: 'VTB', THONGTIN1: 'VietinBank - mã QR', THONGTIN2: 'VTB0001', HESO1: 3 },
                { MA: 'VCB', THONGTIN1: 'Vietcombank - tài khoản ảo', THONGTIN2: 'VCB0001', HESO1: 4 }
            ];
        }
        return [];
    };

    fx['pkg_thanhtoan.LayThongTinTaiChinh'] = function () {
        return { rs: [rs], rsSinhVien: [sv], rsChiTiet: rows.slice() };
    };

    fx['PKG_THANHTOAN_NOPTRUOC.LayDSKhoanNopTruoc'] = [
        { ID: 'KHT01', TEN: 'Học phí học kỳ 2 năm học 2026 - 2027' },
        { ID: 'KHT02', TEN: 'Lệ phí ký túc xá' },
        { ID: 'KHT03', TEN: 'Lệ phí thi chuẩn đầu ra ngoại ngữ' }
    ];

    fx['PKG_THANHTOAN_NOPTRUOC.Them_TaiChinh_PhaiNop_NopTruoc'] = function (o) {
        var n = parseFloat(String(o.dSoTien || '0').replace(/,/g, '')) || 0;
        rows.push({
            ID: 'KT' + (10 + rows.length), NOIDUNG: o.strNoiDung || 'Khoản nộp trước',
            SOTIEN: n, GHICHU: 'Sinh viên tự đăng ký', BATBUOC: 0, DUOCSUASOTIENCHITIET: 0
        });
        return { rows: [], message: 'Thêm mới thành công' };
    };

    fx['PKG_THANHTOAN_NOPTRUOC.Xoa_NopTruoc_DonHang_ChiTiet'] = function (o) {
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].ID === o.strDonHang_ChiTiet_Id) { rows.splice(i, 1); break; }
        }
        return [];
    };

    fx['PKG_THANHTOAN_NOPTRUOC.LayChiTietNoiDungThanhToan'] = function (o) {
        return chiTiet[o.strTT_DonHang_ChiTiet_Id] || [];
    };

    fx['TC_TCThanhToan/XacNhanThanhToanDonHang'] = function (o) {
        var ma = 'GD' + Date.now().toString().slice(-8);
        daGachNo[ma] = String(o.strThanhToan_DonHang_CT_Id || '');
        lanHoi[ma] = 0;
        return ma;
    };

    /* Ảnh QR mẫu (1x1 px) — đủ để kiểm đường hiện hộp mã QR */
    var anh = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    fx['CTT_BIDVPayment/VanTinQRCode'] = function () { return JSON.stringify({ errorCode: '000', vietQRImage: anh }); };
    fx['CTT_VTBPayment/VanTinQRCode'] = function () { return JSON.stringify({ status: { statusCode: '00' }, data: { qrData: anh } }); };
    fx['CTT_VCBPayment/VanTinQRCode'] = function () { return anh; };
    fx['CTT_VNPAYPayment/VanTinQRCode'] = function () { return anh; };

    /* Hỏi lần đầu chưa gạch nợ, lần sau báo đã thu — mô phỏng người học quét mã */
    fx['TC_TCThanhToan/KiemTraGachNoTheoDonHang'] = function (o) {
        var ma = o.strMaDonHangTongHop;
        lanHoi[ma] = (lanHoi[ma] || 0) + 1;
        if (lanHoi[ma] < 2) return [];
        (daGachNo[ma] || '').split(',').forEach(function (x) {
            var id = x.split('#')[0];
            for (var i = 0; i < rows.length; i++) if (rows[i].ID === id) { rows.splice(i, 1); break; }
        });
        return [{ ID: ma, SOTIEN: 0 }];
    };

    fx['CTT_ThongTinKetNoi/KetNoiVNPAY'] = function () { return ''; };

    ums.demo.add(fx);
})();
