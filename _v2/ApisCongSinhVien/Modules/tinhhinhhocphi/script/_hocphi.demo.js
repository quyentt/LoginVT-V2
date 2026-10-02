/* Dữ liệu mẫu cho hai màn Tình hình học phí / Xuất hóa đơn — chỉ dùng ở chế độ dựng thử.
   Người học mẫu của vai trò thủ vai: SV0001 — Lăng Văn Huy (25001029), DCOT.16.2. */
(function () {
    'use strict';
    var T = 'pkg_taichinh_thongtin.';

    function khoan(i, hk, dot, loai, nd, tien, ngay, them) {
        var r = {
            ID: 'K' + i, DAOTAO_THOIGIANDAOTAO: hk, DAOTAO_THOIGIANDAOTAO_DOT: dot,
            DAOTAO_THOIGIANDAOTAO_ID: 'TG' + (dot || 1),
            TAICHINH_CACKHOANTHU_TEN: loai, NOIDUNG: nd, SOTIEN: tien,
            NGAYTAO_DD_MM_YYYY: ngay, NGUOITAO_TENDAYDU: 'Hoàng Thu Trang'
        };
        for (var k in (them || {})) r[k] = them[k];
        return r;
    }
    function phieu(i, so, tien, ngay, nguoi) {
        return {
            ID: 'P' + i, SOPHIEUTHU: so, TONGTIEN: tien,
            NGAYTHU_DD_MM_YYYY_HHMMSS: ngay, TAIKHOAN_NGUOITHU: nguoi, TAIKHOAN_NGUOIRUT: nguoi
        };
    }

    /* Khoản đã nộp chưa xuất hóa đơn — bảng của màn Xuất hóa đơn.
       Xuất hóa đơn xong thì các dòng đã chọn biến khỏi danh sách (như máy chủ thật). */
    var chuaXuat = [
        khoan(101, '2024-2025 - Học kỳ 1', '1', 'Học phí', 'Học phí học kỳ 1 năm học 2024-2025', 8250000, '05/09/2024',
            { SOLUONG: 1, DONGIA: 8250000, DONVITINH_TEN: 'Lần', HINHTHUCTHU_MA: 'CK', HINHTHUCTHU_TEN: 'Chuyển khoản', LOAITIENTE_MA: 'VND' }),
        khoan(102, '2024-2025 - Học kỳ 2', '1', 'Học phí', 'Học phí học kỳ 2 năm học 2024-2025', 7800000, '10/02/2025',
            { SOLUONG: 1, DONGIA: 7800000, DONVITINH_TEN: 'Lần', HINHTHUCTHU_MA: 'CK', HINHTHUCTHU_TEN: 'Chuyển khoản', LOAITIENTE_MA: 'VND' }),
        khoan(103, '2024-2025 - Học kỳ 2', '1', 'Lệ phí', 'Lệ phí thư viện năm học 2024-2025', 50000, '10/02/2025',
            { SOLUONG: 1, DONGIA: 50000, DONVITINH_TEN: 'Lần', HINHTHUCTHU_MA: 'TM', HINHTHUCTHU_TEN: 'Tiền mặt', LOAITIENTE_MA: 'VND' })
    ];

    var thongTin = {
        NOCO: -1250000,
        TONGKHOANPHAINOP: 17350000, TONGKHOANDUOCMIEN: 1650000, TONGKHOANDANOP: 16100000,
        TONGKHOANDARUT: 300000, TONGNORIENG: 1250000, TONGNOCHUNG: 1250000,
        TONGDURIENG: 0, TONGDUCHUNG: 0,
        TONGTIENPHIEUTHU: 16100000, TONGTIENPHIEURUT: 300000, TONGTIENHOADON: 8250000
    };

    var fx = {};

    fx['pkg_hosohocvien.LayThongTinChiTietHoSo'] = [{
        ID: 'SV0001', HODEM: 'Lăng Văn', TEN: 'Huy', MASO: '25001029',
        TTLL_DIENTHOAICANHAN: '0972 118 345', LOP: 'DCOT.16.2',
        NGAYSINH: '12/04/2007', QLSV_NGUOIHOC_NGAYSINH: '12/04/2007',
        DAOTAO_LOPQUANLY_TEN: 'DCOT.16.2', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Công nghệ thông tin',
        DAOTAO_KHOADAOTAO_TEN: 'K16', DAOTAO_KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin',
        /* Kéo gốc 30/9: tình trạng người học ở cột TRANGTHAINGUOIHOC_N1_* */
        TRANGTHAINGUOIHOC_N1_TEN: 'Đang học', TRANGTHAINGUOIHOC_N1_MA: 'NORMAL'
    }];

    fx[T + 'LayDSTinhTrangTaiChinh'] = function () {
        return { rsThongTin: [thongTin], rsKhoanDaNopChuaXuatHoaDon: chuaXuat };
    };

    fx[T + 'LayDSKhoanPhaiNop'] = [
        khoan(1, '2024-2025 - Học kỳ 1', '1', 'Học phí', 'Học phí học kỳ 1 (15 tín chỉ)', 8250000, '05/09/2024'),
        khoan(2, '2024-2025 - Học kỳ 2', '1', 'Học phí', 'Học phí học kỳ 2 (14 tín chỉ)', 7700000, '10/02/2025'),
        khoan(3, '2024-2025 - Học kỳ 2', '1', 'Lệ phí', 'Lệ phí thư viện', 50000, '10/02/2025'),
        khoan(4, '2024-2025 - Học kỳ 2', '2', 'Bảo hiểm', 'Bảo hiểm y tế 12 tháng', 1350000, '15/09/2024'),
        /* KHONGHACHTOAN = 1 — màn bỏ dòng này (kéo gốc 30/9) */
        khoan(5, '2024-2025 - Học kỳ 2', '2', 'Học phí', 'Dòng không hạch toán (không được hiện)', 999000, '15/09/2024',
            { KHONGHACHTOAN: 1 })
    ];
    fx[T + 'LayDSKhoanMien'] = [
        khoan(11, '2024-2025 - Học kỳ 1', '1', 'Miễn giảm', 'Miễn giảm học phí đối tượng chính sách (20%)', 1650000, '20/09/2024')
    ];
    fx[T + 'LayDSKhoanDaNop'] = [
        khoan(21, '2024-2025 - Học kỳ 1', '1', 'Học phí', 'Học phí học kỳ 1 (15 tín chỉ)', 8250000, '12/09/2024', { CHUNGTU_SO: 'PT0001254' }),
        khoan(22, '2024-2025 - Học kỳ 2', '1', 'Học phí', 'Học phí học kỳ 2 (14 tín chỉ)', 6500000, '18/02/2025', { CHUNGTU_SO: 'PT0001987' }),
        khoan(23, '2024-2025 - Học kỳ 2', '2', 'Bảo hiểm', 'Bảo hiểm y tế 12 tháng', 1350000, '20/09/2024', { CHUNGTU_SO: 'PT0001301' })
    ];
    fx[T + 'LayDSKhoanDaRut'] = [
        khoan(31, '2024-2025 - Học kỳ 1', '1', 'Học phí', 'Rút tiền thừa học kỳ 1', 300000, '02/10/2024')
    ];
    fx[T + 'LayDSKhoanNoRieng'] = [
        khoan(41, '2024-2025 - Học kỳ 2', '1', 'Học phí', 'Còn nợ học phí học kỳ 2', 1200000, '18/02/2025'),
        khoan(42, '2024-2025 - Học kỳ 2', '1', 'Lệ phí', 'Lệ phí thư viện', 50000, '10/02/2025')
    ];
    fx[T + 'LayDSKhoanNoChung'] = [
        khoan(51, '2024-2025 - Học kỳ 2', '1', 'Học phí', 'Còn nợ học phí học kỳ 2', 1200000, '18/02/2025',
            { MATHANHTOANDINHDANH: 'DHCN25001029HP' }),
        khoan(52, '2024-2025 - Học kỳ 2', '1', 'Lệ phí', 'Lệ phí thư viện', 50000, '10/02/2025',
            { MATHANHTOANDINHDANH: 'DHCN25001029LP' })
    ];
    fx[T + 'LayDSKhoanDuRieng'] = [];
    fx[T + 'LayDSKhoanDuChung'] = [];
    fx[T + 'LayDSPhieuDaThu'] = [
        phieu(1, 'PT0001254', 8250000, '12/09/2024 09:15:20', 'trang.ht'),
        phieu(2, 'PT0001301', 1350000, '20/09/2024 14:02:55', 'nam.dv'),
        phieu(3, 'PT0001987', 6500000, '18/02/2025 08:40:11', 'trang.ht')
    ];
    fx[T + 'LayDSPhieuDaRut'] = [
        phieu(11, 'PR0000087', 300000, '02/10/2024 10:05:00', 'nam.dv')
    ];
    fx[T + 'LayDSPhieuHoaDon'] = [
        phieu(21, '0000132', 8250000, '12/09/2024 09:20:40', 'trang.ht')
    ];

    /* Danh mục */
    var DM = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    fx[DM + 'CHUNG.NGANHANG'] = [
        { ID: 'NH1', MA: 'VCB', TEN: 'Vietcombank', THONGTIN1: 'Upload/File/huongdan-vietcombank.pdf', THONGTIN2: 'Áp dụng từ 01/2025' },
        { ID: 'NH2', MA: 'BIDV', TEN: 'BIDV', THONGTIN1: 'Upload/File/huongdan-bidv.pdf', THONGTIN2: '' },
        { ID: 'NH3', MA: 'MB', TEN: 'MB Bank', THONGTIN1: 'Upload/File/huongdan-mbbank.pdf', THONGTIN2: 'Quét mã QR định danh' }
    ];
    fx[DM + 'TAICHINH.NUTHDDT'] = [
        { ID: 'HD1', MA: 'HDDTVNPT', TEN: 'hóa đơn VNPT', THONGTIN2: '', THONGTIN4: '' },
        { ID: 'HD2', MA: 'HDDTNHAP', TEN: 'hóa đơn nháp', THONGTIN2: '', THONGTIN4: '' }
    ];

    /* Xuất hoá đơn điện tử — bỏ các dòng vừa xuất khỏi danh sách chờ */
    fx['HDDT_HoaDon/ThemMoi'] = function (o) {
        var ids = String(o.strTaiChinh_CacKhoanThu_Ids || '').split(',');
        for (var i = chuaXuat.length - 1; i >= 0; i--) {
            if (ids.indexOf(String(chuaXuat[i].ID)) >= 0) chuaXuat.splice(i, 1);
        }
        return { rows: null, raw: { Id: 'SHD9' }, message: '' };
    };
    fx['HDDT_HoaDon/ThemMoi_Nhap'] = { rows: 'HDDTFILE/nhap-demo.pdf', message: '' };

    /* Xem hoá đơn đã lưu (ums.phieu.viewer) */
    fx['TC_HoaDon/LayTTHoaDonThu_Rut'] = function (o) {
        return {
            rs: [
                { CHUNGTU_ID: o.strHoaDonThu_Rut_Id, TENPHIEU: 'Hoá đơn bán hàng', MAUSO: '2/001', KYHIEU: 'C25TAA',
                  SOPHIEUTHU: '0000132', NGAYIN_NGAY: '12', NGAYIN_THANG: '09', NGAYIN_NAM: '2024',
                  DAOTAO_COCAUTOCHUC_TEN: 'Trường Đại học Công nghệ Thông tin và Truyền thông',
                  MASOTHUE: '4600399999', DIACHI: 'Đường Z115, Quyết Thắng, TP Thái Nguyên', SODIENTHOAI: '0208 3846 254',
                  HINHTHUCTHU_TEN: 'Chuyển khoản', NOIDUNG: 'Học phí học kỳ 1 năm học 2024-2025', SOTIENDATHU: 8250000,
                  NGUOITAO_TENDAYDU: 'Hoàng Thu Trang', LAHOADONDIENTU: 0, DUONGDANFILEHOADON: null, SOHOADON: '0000132' }
            ],
            rsThongTinDoiTuong: [{
                HODEM: 'Lăng Văn', TEN: 'Huy', MASO: '25001029', DAOTAO_LOPQUANLY_N1_TEN: 'DCOT.16.2',
                NGANHHOC_N1_TEN: 'Công nghệ thông tin', MASOTHUECANHAN: '', TINHTRANG: 1, MAUIN_MASO: 'HOADONDHLUAT'
            }]
        };
    };

    ums.demo.add(fx);
})();
