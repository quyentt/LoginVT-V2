/* Dữ liệu mẫu cho lichsudangky — chỉ dùng ở chế độ dựng thử. */
ums.demo.add({
    'DKH_XuLy/LayDSKeHoachTheoLichSuDangKy': function (o) {
        var kh = [
            { ID: 'KHLS01', TENKEHOACH: 'Đăng ký học kỳ 1 năm học 2025-2026' },
            { ID: 'KHLS02', TENKEHOACH: 'Đăng ký học lại, cải thiện học kỳ 1 năm 2025-2026' },
            { ID: 'KHLS03', TENKEHOACH: 'Đăng ký học kỳ phụ hè 2025' }
        ];
        var q = String(o.strTuKhoa || '').trim();
        return { rows: { rsKeHoach: kh, rsThongTinNguoiHoc: q ? [{ ID: 'SVLS01', MASO: q.toUpperCase(), HODEM: 'Nguyễn Thị', TEN: 'Hồng Nhung' }] : [] } };
    },
    'DKH_XuLy/LayLichSuDangKyHocCaNhan': function (o) {
        var rows = [
            { NGUOITHUCHIEN_TAIKHOAN: 'bit220263', HANHDONG: 'Đăng ký', KETQUA: 'Thành công', THOIGIANTHUCHIEN: '12/08/2025 08:02:15', MAHOCPHAN: 'IT2031', TENHOCPHAN: 'Cấu trúc dữ liệu và giải thuật', DSLOPHOCPHAN: 'IT2031.01 - LT', DAOTAO_CHUONGTRINH_MA: '7480201', DAOTAO_CHUONGTRINH_TEN: 'Công nghệ thông tin', _kh: 'KHLS01' },
            { NGUOITHUCHIEN_TAIKHOAN: 'bit220263', HANHDONG: 'Đăng ký', KETQUA: 'Lớp đã đủ số lượng', THOIGIANTHUCHIEN: '12/08/2025 08:02:48', MAHOCPHAN: 'IT2040', TENHOCPHAN: 'Cơ sở dữ liệu', DSLOPHOCPHAN: 'IT2040.02 - LT', DAOTAO_CHUONGTRINH_MA: '7480201', DAOTAO_CHUONGTRINH_TEN: 'Công nghệ thông tin', _kh: 'KHLS01' },
            { NGUOITHUCHIEN_TAIKHOAN: 'bit220263', HANHDONG: 'Đăng ký', KETQUA: 'Thành công', THOIGIANTHUCHIEN: '12/08/2025 08:03:10', MAHOCPHAN: 'IT2040', TENHOCPHAN: 'Cơ sở dữ liệu', DSLOPHOCPHAN: 'IT2040.03 - LT, IT2040.03.1 - TH', DAOTAO_CHUONGTRINH_MA: '7480201', DAOTAO_CHUONGTRINH_TEN: 'Công nghệ thông tin', _kh: 'KHLS01' },
            { NGUOITHUCHIEN_TAIKHOAN: 'phongdaotao01', HANHDONG: 'Hủy đăng ký', KETQUA: 'Thành công', THOIGIANTHUCHIEN: '15/08/2025 14:20:03', MAHOCPHAN: 'IT2031', TENHOCPHAN: 'Cấu trúc dữ liệu và giải thuật', DSLOPHOCPHAN: 'IT2031.01 - LT', DAOTAO_CHUONGTRINH_MA: '7480201', DAOTAO_CHUONGTRINH_TEN: 'Công nghệ thông tin', _kh: 'KHLS01' },
            { NGUOITHUCHIEN_TAIKHOAN: 'bit220263', HANHDONG: 'Đăng ký', KETQUA: 'Thành công', THOIGIANTHUCHIEN: '02/09/2025 09:11:40', MAHOCPHAN: 'MA1012', TENHOCPHAN: 'Giải tích 2', DSLOPHOCPHAN: 'MA1012.05 - LT', DAOTAO_CHUONGTRINH_MA: '7480201', DAOTAO_CHUONGTRINH_TEN: 'Công nghệ thông tin', _kh: 'KHLS02' }
        ];
        var kh = String(o.strDangKy_KeHoachDangKy_Id || '');
        return kh ? rows.filter(function (r) { return kh.split(',').indexOf(r._kh) >= 0; }) : rows;
    }
});
