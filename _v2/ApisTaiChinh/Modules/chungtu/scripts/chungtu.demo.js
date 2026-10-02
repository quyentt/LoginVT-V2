/* Dữ liệu mẫu cho chungtu — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';

    var SV = [
        { ID: 'NH1', QLSV_NGUOIHOC_ID: 'Q1', HODEM: 'Nguyễn Văn', TEN: 'An', MASO: 'BIT230112', DAOTAO_LOPQUANLY_N1_TEN: 'K66-CNTT1',
          TTLL_DIENTHOAICANHAN: '0912 345 678', QLSV_TRANGTHAINGUOIHOC_MA: 'NORMAL', QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1' },
        { ID: 'NH2', QLSV_NGUOIHOC_ID: 'Q2', HODEM: 'Trần Thị', TEN: 'Bích', MASO: 'BBA230561', DAOTAO_LOPQUANLY_N1_TEN: 'K66-KT2',
          TTLL_DIENTHOAICANHAN: '0987 111 222', QLSV_TRANGTHAINGUOIHOC_MA: 'RESERVE', QLSV_TRANGTHAINGUOIHOC_TEN: 'Bảo lưu', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT2' },
        { ID: 'NH3', QLSV_NGUOIHOC_ID: 'Q3', HODEM: 'Lê Hoàng', TEN: 'Cường', MASO: 'BIT240033', DAOTAO_LOPQUANLY_N1_TEN: 'K67-CNTT2',
          TTLL_DIENTHOAICANHAN: '', QLSV_TRANGTHAINGUOIHOC_MA: 'CANHBAO', QLSV_TRANGTHAINGUOIHOC_TEN: 'Cảnh báo học vụ', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1' }
    ];

    function dn(id, kt, ten, nd, tien, htct) {
        return { ID: id, TAICHINH_CACKHOANTHU_ID: kt, TAICHINH_CACKHOANTHU_TEN: ten, DAOTAO_THOIGIANDAOTAO_ID: 'TG1',
                 DAOTAO_THOIGIANDAOTAO: 'HK1 2026-2027', DAOTAO_THOIGIANDAOTAO_DOT: '1', NOIDUNG: nd, SOTIEN: tien,
                 NGAYTAO_DD_MM_YYYY: '15/09/2026', HETHONGCHUNGTU_MA: htct, HINHTHUCTHU_MA: 'CK', HINHTHUCTHU_TEN: 'Chuyển khoản',
                 LOAITIENTE_MA: 'VND', DONVITINH_TEN: 'Học kỳ' };
    }

    var THONGTIN = { HODEM: 'Nguyễn Văn', TEN: 'An', MASO: 'BIT230112', NGAYSINH: '12/03/2004', MASOTHUECANHAN: '',
        NOIOHIENNAY: 'Cầu Giấy, Hà Nội', DAOTAO_LOPQUANLY_N1_TEN: 'K66-CNTT1', NGANHHOC_N1_TEN: 'Công nghệ thông tin', KHOAHOC_N1_TEN: 'K66',
        NOCO: -8450000, TONGKHOANPHAINOP: 24500000, TONGKHOANDUOCMIEN: 1200000, TONGKHOANDANOP: 14850000, TONGKHOANDARUT: 0,
        TONGNORIENG: 1900000, TONGNOCHUNG: 6550000, TONGDURIENG: 0, TONGDUCHUNG: 0, TONGTIENPHIEUTHU: 12500000, TONGTIENPHIEURUT: 0, TONGTIENHOADON: 2350000 };

    function khoan(n) {
        return [
            { DAOTAO_THOIGIANDAOTAO: 'HK1 2026-2027', DAOTAO_THOIGIANDAOTAO_DOT: '1', TAICHINH_CACKHOANTHU_TEN: 'Học phí', NOIDUNG: 'Học phí 18 tín chỉ', SOTIEN: 12500000 * n, CHUNGTU_SO: 'BL0001234', NGAYTAO_DD_MM_YYYY: '02/09/2026', NGUOITAO_TENDAYDU: 'Nguyễn Thị Lan' },
            { DAOTAO_THOIGIANDAOTAO: 'HK1 2026-2027', DAOTAO_THOIGIANDAOTAO_DOT: '1', TAICHINH_CACKHOANTHU_TEN: 'Bảo hiểm y tế', NOIDUNG: 'BHYT năm 2026', SOTIEN: 680000 * n, CHUNGTU_SO: 'BL0001235', NGAYTAO_DD_MM_YYYY: '02/09/2026', NGUOITAO_TENDAYDU: 'Nguyễn Thị Lan' }
        ];
    }
    var PHIEU = [
        { ID: 'CT1', SOPHIEUTHU: 'BL0001234', SOHOADON: '0000871', TONGTIEN: 12500000, NGAYTHU_DD_MM_YYYY_HHMMSS: '02/09/2026 09:12:40', TAIKHOAN_NGUOITHU: 'lannt', TAIKHOAN_NGUOIRUT: 'lannt' }
    ];

    var CT_RS = [
        { CHUNGTU_ID: 'CT1', SOCHUNGTU: 'BL0001234', TAICHINH_CACKHOANTHU_TEN: 'Học phí', NOIDUNG: 'Học phí 18 tín chỉ HK1', SOTIENDATHU: 12500000, NGAYTAO_DD_MM_YYYY: '02/09/2026', NGUOITAO_TAIKHOAN: 'lannt', DUONGDANFILEHOADON: '' }
    ];

    var nextId = 100;

    ums.demo.add({
        'PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc_All': function (o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            var rows = SV.filter(function (r) { return !q || (r.HODEM + ' ' + r.TEN + ' ' + r.MASO).toLowerCase().indexOf(q) >= 0; });
            return { rows: rows, pager: rows.length };
        },
        'CM_DanhMucDuLieu/LayDanhSach#QLSV.TRANGTHAI': [
            { ID: 'TT1', TEN: 'Đang học' }, { ID: 'TT2', TEN: 'Bảo lưu' }, { ID: 'TT3', TEN: 'Cảnh báo học vụ' }, { ID: 'TT4', TEN: 'Đã tốt nghiệp' }
        ],
        'CM_DanhMucDuLieu/LayDanhSach#TAICHINH.NUTHDDT': [
            { ID: 'N1', MA: 'HDDTNHAP_VNPT', TEN: 'HĐĐT nháp', THONGTIN1: 'fa fa-eye', THONGTIN2: '', THONGTIN4: '' },
            { ID: 'N2', MA: 'HDDT_VNPT', TEN: 'Xuất HĐĐT', THONGTIN1: 'fa fa-send', THONGTIN2: '', THONGTIN4: '' }
        ],
        'TC_ThongTinChung/LayDanhSach': function () {
            return { rows: {
                rsThongTin: [THONGTIN],
                rsKhoanDaNopChuaXuatPhieuThu: [dn('DN1', 'KT1', 'Học phí', 'Học phí 18 tín chỉ HK1', 12500000, 'TAICHINH_HETHONGPHIEUTHU')],
                rsKhoanDaNopChuaXuatBienLai: [
                    dn('DN2', 'KT1', 'Học phí', 'Học phí 18 tín chỉ HK1', 12500000, 'TAICHINH_HETHONGBIENLAI'),
                    dn('DN3', 'KT4', 'Bảo hiểm y tế', 'BHYT năm 2026', 680000, 'TAICHINH_HETHONGBIENLAI'),
                    dn('DN4', 'KT5', 'Phí ký túc xá', 'KTX tháng 9', 1200000, 'TAICHINH_HETHONGPHIEUTHU')
                ],
                rsKhoanDaNopChuaXuatHoaDon: [
                    dn('DN5', 'KT1', 'Học phí', 'Học phí 18 tín chỉ HK1', 12500000, 'TAICHINH_HOADON'),
                    dn('DN6', 'KT5', 'Phí ký túc xá', 'KTX tháng 9', 1200000, 'TAICHINH_HOADON')
                ]
            } };
        },
        'TC_ThongTinChung/LayDSKhoanPhaiNop': khoan(1),
        'TC_ThongTinChung/LayDSKhoanMien': khoan(0.1),
        'TC_ThongTinChung/LayDSKhoanDaNop': khoan(1),
        'TC_ThongTinChung/LayDSKhoanDaRut': [],
        'TC_ThongTinChung/LayDSKhoanNoRieng': khoan(0.2),
        'TC_ThongTinChung/LayDSKhoanNoChung': khoan(0.5),
        'TC_ThongTinChung/LayDSKhoanDuRieng': [],
        'TC_ThongTinChung/LayDSKhoanDuChung': [],
        'TC_ThongTinChung/LayDSPhieuDaThu': PHIEU,
        'TC_ThongTinChung/LayDSPhieuDaRut': [],
        'TC_ThongTinChung/LayDSPhieuHoaDon': PHIEU,
        'TC_DaNop_PhieuThu/ThemMoi': function () { return { rows: [], raw: null }; },
        'TC_PhieuThu/LayTTPhieuThu_Rut': function () { return { rows: { rs: CT_RS, rsThongTinDoiTuong: [THONGTIN] } }; },
        'TC_HoaDon/LayTTHoaDonThu_Rut': function () { return { rows: { rs: CT_RS, rsThongTinDoiTuong: [THONGTIN] } }; },
        'HDDT_HoaDon/ThemMoi_Nhap': function () { nextId++; return { rows: 'https://example.invalid/hddt/nhap/' + nextId }; },

        /* Danh mục đào tạo dùng chung (ums.ref) */
        'pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTao': [{ ID: 'H1', TENHEDAOTAO: 'Đại học chính quy' }, { ID: 'H2', TENHEDAOTAO: 'Liên thông' }],
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_KhoaDaoTao': [{ ID: 'K1', TENKHOA: 'K66' }, { ID: 'K2', TENKHOA: 'K67' }],
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_ToChucCT': [{ ID: 'CT1', TENCHUONGTRINH: 'Công nghệ thông tin' }, { ID: 'CT2', TENCHUONGTRINH: 'Kế toán' }],
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy': [{ ID: 'L1', TEN: 'K66-CNTT1' }, { ID: 'L2', TEN: 'K66-KT2' }]
    });
})();
