/* Dữ liệu mẫu cho baocao — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';

    function sv(i, tien, ngay, ct, loai, kt) {
        var ten = ['Nguyễn Văn An', 'Trần Thị Bích', 'Lê Hoàng Cường', 'Phạm Minh Đức', 'Hoàng Thu Hà'][i % 5];
        return { ID: 'R' + i, SOTIEN: tien, NGAYTAO_DD_MM_YYYY: ngay, MADONHANG: ct ? 'DH' + (10230 + i) : '', CHUNGTU: ct, LOAICHUNGTU: loai,
                 DAOTAO_THOIGIANDAOTAO: 'HK1 2026-2027', NGUOITAO_TENDAYDU: 'Nguyễn Thị Lan', TAICHINH_CACKHOANTHU_TEN: kt,
                 MASONGUOIHOC: 'BIT2301' + (10 + i), HOTENNGUOIHOC: ten, NGAYSINH: '1' + i + '/03/2004', TRANGTHAINGUOIHOC_N1_TEN: 'Đang học',
                 LOP: 'K66-CNTT' + (1 + i % 2), NGANH: 'Công nghệ thông tin', KHOADAOTAO: 'K66', KHOAQUANLY: 'Khoa CNTT', HEDAOTAO: 'Đại học chính quy',
                 KHONGHACHTOAN: i === 2 ? 1 : 0, TONGTIEN: 48650000 };
    }
    var THU = [0, 1, 2, 3, 4].map(function (i) { return sv(i, [12500000, 11800000, 680000, 12500000, 11170000][i], '0' + (i + 2) + '/09/2026', 'BL00012' + (30 + i), 'Chuyển khoản', i === 2 ? 'Bảo hiểm y tế' : 'Học phí'); });
    var NOP = [0, 1, 2].map(function (i) { return sv(i, [12500000, 12500000, 680000][i], '15/08/2026', '', '', i === 2 ? 'Bảo hiểm y tế' : 'Học phí'); });

    ums.demo.add({
        'pkg_kehoach_thongtin.LayDSDaoTao_CoSoDaoTao': [{ ID: 'CS1', MA: 'HN', TEN: 'Cơ sở Hà Nội' }, { ID: 'CS2', MA: 'TN', TEN: 'Cơ sở Thái Nguyên' }],
        'pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTao': [{ ID: 'H1', TENHEDAOTAO: 'Đại học chính quy' }, { ID: 'H2', TENHEDAOTAO: 'Liên thông' }],
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_KhoaDaoTao': [{ ID: 'K1', TENKHOA: 'K66' }, { ID: 'K2', TENKHOA: 'K67' }],
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_ToChucCT': [{ ID: 'CT1', TENCHUONGTRINH: 'Công nghệ thông tin' }, { ID: 'CT2', TENCHUONGTRINH: 'Kế toán' }],
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy': [{ ID: 'L1', TEN: 'K66-CNTT1' }, { ID: 'L2', TEN: 'K66-KT2' }],
        'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao': [{ ID: 'TG1', DAOTAO_THOIGIANDAOTAO: 'HK1 2026-2027' }, { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: 'HK2 2025-2026' }],
        'TC_NguoiDungDaThuTien/LayDanhSach': [{ ID: 'U1', TAIKHOAN: 'lannt' }, { ID: 'U2', TAIKHOAN: 'hungpv' }],
        'KHCT_NamNhapHoc/LayDanhSach': [{ NAMNHAPHOC: '2024' }, { NAMNHAPHOC: '2025' }, { NAMNHAPHOC: '2026' }],
        'KHCT_KhoaQuanLy/LayDanhSach': [{ ID: 'KQ1', TEN: 'Khoa Công nghệ thông tin' }, { ID: 'KQ2', TEN: 'Khoa Kinh tế' }],
        'CM_DanhMucDuLieu/LayDanhSach#QLSV.TRANGTHAI': [{ ID: 'TT1', TEN: 'Đang học' }, { ID: 'TT2', TEN: 'Bảo lưu' }, { ID: 'TT3', TEN: 'Đã tốt nghiệp' }],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TAICHINH.PHANLOAICHUNGTU': [{ ID: 'PL1', TEN: 'Biên lai' }, { ID: 'PL2', TEN: 'Hoá đơn' }],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KHCT.NCN': [{ ID: 'N1', TEN: 'Công nghệ thông tin' }, { ID: 'N2', TEN: 'Kế toán' }],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TAICHINH.BC.TINHTRANGBCLUU': [
            { ID: 'XN1', TEN: 'Đã kiểm tra', THONGTIN1: 'fa fa-check' }, { ID: 'XN2', TEN: 'Cần sửa', THONGTIN1: 'fa fa-pencil' }
        ],
        'DKH_KeHoachDangKy/LayDSKeHoachTheoThoiGian': [{ ID: 'KH1', TEN: 'Đăng ký học HK1 2026-2027' }],
        'TC_ThuChi2/LayDSTaiChinh_Nam_BaoCao': [{ ID: 'NB1', TAICHINH_NAM_BAOCAO_TEN: 'Năm tài chính 2026' }, { ID: 'NB2', TAICHINH_NAM_BAOCAO_TEN: 'Năm tài chính 2025' }],
        'TC_ThuChi2/LayDSTaiChinh_Nam_Thang_BC': [{ ID: 'NT1', TAICHINH_NAM_BAOCAO_ID: 'NB1', NAM: '2026', THANG: '1' }, { ID: 'NT2', TAICHINH_NAM_BAOCAO_ID: 'NB1', NAM: '2026', THANG: '2' }],
        'TC_BaoCao/LayDSThuTien': { rows: THU, pager: 23 },
        'TC_BaoCao/LayDSNopTien': { rows: NOP, pager: 3 },
        'TC_KeToan/LayDSAPI_DoiTac': [{ ID: 'DT1', TEN: 'Phần mềm kế toán FAST', TAIKHOAN: 'api', MATKHAU: 'x', DIACHI_API: 'https://ketoan.example', LINK_API: '/api/SyncData', LOAIXACTHUC_API: 'Basic' }],
        'TC_KeToan/LayDSTenBangDuLieu': [{ ID: 'BANG_T9', TEN: 'Chứng từ thu tháng 9/2026' }],
        'TC_KeToan/LayCauTrucHienThiDuLieuAPI': [{ THANHPHAN_ID: 'C1', THANHPHAN_TEN: 'Số tiền', KIEUDULIEU: 'NUMBER' }, { THANHPHAN_ID: 'C2', THANHPHAN_TEN: 'Tài khoản', KIEUDULIEU: 'TEXT' }],
        'TC_KeToan/LayDSDuLieuAPI': [
            { ID: 'O1', API_DOITUONGDULIEU_MA: 'CT0001', API_DOITUONGDULIEU_TEN: 'Thu học phí K66-CNTT1', GHICHU: '' },
            { ID: 'O2', API_DOITUONGDULIEU_MA: 'CT0002', API_DOITUONGDULIEU_TEN: 'Thu BHYT K66', GHICHU: 'Chờ duyệt' }
        ],
        'TC_KeToan/LayGiaTriDuLieuAPI': [
            { API_DOITUONGDULIEU_ID: 'O1', THANHPHAN_ID: 'C1', THANHPHAN_MA: 'SOTIEN', THANHPHAN_GIATRI: '125000000', KIEUDULIEU: 'NUMBER' },
            { API_DOITUONGDULIEU_ID: 'O1', THANHPHAN_ID: 'C2', THANHPHAN_MA: 'TK', THANHPHAN_GIATRI: '1121', KIEUDULIEU: 'TEXT' },
            { API_DOITUONGDULIEU_ID: 'O2', THANHPHAN_ID: 'C1', THANHPHAN_MA: 'SOTIEN', THANHPHAN_GIATRI: '6800000', KIEUDULIEU: 'NUMBER' },
            { API_DOITUONGDULIEU_ID: 'O2', THANHPHAN_ID: 'C2', THANHPHAN_MA: 'TK', THANHPHAN_GIATRI: '1111', KIEUDULIEU: 'TEXT' }
        ],
        'TC_KeToan/LayDSAPI_DoiTac_ChiTiet': [
            { ID: 'S1', CHA_ID: null, KEY_API: 'form', DATADEFAULT_API: 'PT', DATATYPE_API: 'string' },
            { ID: 'S2', CHA_ID: null, KEY_API: 'amount', VALUE_API: 'SOTIEN', DATATYPE_API: 'number' }
        ],
        'CM_UngDung/CustomAPI': { rows: 'OK', message: '' },
        'TC_ThuChi2/LayDSNguoiThucHienBC': [{ ID: 'U1', TEN: 'Nguyễn Thị Lan' }],
        'TC_ThuChi2/LayDSBC_BaoCaoDaThucHien': [
            { ID: 'BC1', TAICHINH_BC_XACNHANBCLUU_TEN: 'Đã kiểm tra', DAUVAO_TENBAOCAO: 'Tổng hợp thu học phí', DAURA_DUONGDANBAOCAO: '/Upload/Report/tonghop_0926.xlsx',
              NGUOITAO_TENDAYDU: 'Nguyễn Thị Lan', NGAYTAO_DD_MM_YYYY_HHMMSS: '16/09/2026 10:21:05', DAUVAO_HEDAOTAO_TEN: 'Đại học chính quy', DAUVAO_TUNGAY_TEN: '01/09/2026', DAUVAO_KHOANTHU_TEN: 'Học phí' }
        ],
        'TC_ThuChi2/LayDSTaiChinh_BC_XacNhanBCLuu': [{ TINHTRANG_TEN: 'Đã kiểm tra', NGUOIXACNHAN_TENDAYDU: 'Trần Văn Hùng', NGAYTAO_DD_MM_YYYY: '16/09/2026' }],
        'TC_KeToan/LayDSTC_BC_KyHieu_KhoaNganh': [
            { ID: 'KH1', DAOTAO_KHOADAOTAO_ID: 'K1', DAOTAO_CHUONGTRINH_ID: 'CT1', MAKHOAHOC: 'K66', TENKHOAHOC: 'Khoá 66', MACHUONGTRINH: '7480201', TENCHUONGTRINH: 'Công nghệ thông tin', KYHIEU: 'CNTT66' },
            { ID: 'KH2', DAOTAO_KHOADAOTAO_ID: 'K1', DAOTAO_CHUONGTRINH_ID: 'CT2', MAKHOAHOC: 'K66', TENKHOAHOC: 'Khoá 66', MACHUONGTRINH: '7340301', TENCHUONGTRINH: 'Kế toán', KYHIEU: '' }
        ],
        'PKG_TAICHINH_THUCHI2.LayDSBaoCao': [{ BAOCAO_ID: 'L1', NGUOITHUCHIEN_TAIKHOAN: 'lannt', NGAYTAO_DD_MM_YYYY: '10/09/2026', LOAIBAOCAO: 'Tổng hợp thu theo ngày', TUDONG: 'Hằng ngày 06:00' }],
        'PKG_TAICHINH_THUCHI2.LayKetQuaBaoCao': [{ DUONGDANKETQUA: 'https://example.invalid/report/tonghop_1709.xlsx', NGAYTAO_DD_MM_YYYY_HHMMSS: '17/09/2026 06:00:12' }],
        'PKG_TAICHINH_THUCHI2.LayThongSoBaoCao': [{ TUKHOA: 'strTuNgay', DULIEU: '01/09/2026', NGAYTAO_DD_MM_YYYY_HHMMSS: '10/09/2026 08:00:00', NGUOITHUCHIEN_TAIKHOAN: 'lannt' }]
    });
})();
