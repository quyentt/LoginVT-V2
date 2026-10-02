/* Dữ liệu mẫu cho ruttien — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';

    function du(id, sv, ma, ten, lop, ktId, kt, tien) {
        return { ID: id, QLSV_NGUOIHOC_ID: sv, MASONGUOIHOC: ma, HOTENNGUOIHOC: ten, LOP: lop, DAOTAO_LOPQUANLY_N1_TEN: lop,
            NGANHHOC_N1_TEN: 'Công nghệ thông tin', KHOAHOC_N1_TEN: 'K66', NGAYSINH: '12/05/2004',
            DAOTAO_THOIGIANDAOTAO_ID: 'TG0', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 2025-2026',
            TAICHINH_CACKHOANTHU_ID: ktId, TAICHINH_CACKHOANTHU_TEN: kt, SOTIEN: tien, HETHONGCHUNGTU_MA: 'TAICHINH_HETHONGPHIEUTHURUT' };
    }
    var DU = [
        du('R1', 'SV01', 'BIT220263', 'Lê Minh Quân', 'K66-CNTT1', 'KT1', 'Học phí', 1250000),
        du('R2', 'SV01', 'BIT220263', 'Lê Minh Quân', 'K66-CNTT1', 'KT4', 'Ký túc xá', 600000),
        du('R3', 'SV02', 'BBA220561', 'Đỗ Thu Trang', 'K66-QTKD2', 'KT1', 'Học phí', 2100000),
        du('R4', 'SV03', 'BIT220301', 'Phạm Quốc Huy', 'K66-CNTT2', 'KT2', 'Lệ phí thi', 0),
        du('R5', 'SV04', 'BIT220318', 'Vũ Hải Yến', 'K66-CNTT2', 'KT1', 'Học phí', 475500)
    ];

    var n = 0;
    ums.demo.add({
        'CM_DanhMucDuLieu/LayDanhSach#QLSV.TRANGTHAI': [
            { ID: 'TT1', MA: 'NORMAL', TEN: 'Đang học' }, { ID: 'TT2', MA: 'GRADUATE', TEN: 'Đã tốt nghiệp' }, { ID: 'TT3', MA: 'DROPOUT', TEN: 'Thôi học' }
        ],
        'pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTao': [{ ID: 'H1', TENHEDAOTAO: 'Đại học chính quy' }],
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_KhoaDaoTao': [{ ID: 'K1', TENKHOA: 'K66' }],
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_ToChucCT': [{ ID: 'CT1', TENCHUONGTRINH: 'Công nghệ thông tin' }],
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy': [{ ID: 'L1', TEN: 'K66-CNTT1' }, { ID: 'L2', TEN: 'K66-CNTT2' }],
        'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao': [{ ID: 'TG0', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 2025-2026' }, { ID: 'TG1', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 2026-2027' }],
        'KHCT_NamNhapHoc/LayDanhSach': [{ NAMNHAPHOC: '2022' }, { NAMNHAPHOC: '2023' }, { NAMNHAPHOC: '2024' }],
        'KHCT_KhoaQuanLy/LayDanhSach': [{ ID: 'KQ1', TEN: 'Khoa Công nghệ thông tin' }, { ID: 'KQ2', TEN: 'Khoa Kinh tế' }],
        'TC_NguoiHoc_DuTien/LayDanhSach': function (o) {
            var s = (o.pageIndex - 1) * o.pageSize;
            return { rows: DU.slice(s, s + o.pageSize), pager: DU.length };
        },
        'TC_PhieuThu/LayTTPhieuThu_Rut': function () {
            n++;
            var sv = DU[(n - 1) % 2 === 0 ? 0 : 2];
            return { rows: {
                rs: [{ CHUNGTU_ID: 'RUT' + n, NOIDUNG: sv.TAICHINH_CACKHOANTHU_TEN, SOTIENDATHU: sv.SOTIEN, SOPHIEUTHU: '00050' + n, QUYENSO: 'R01',
                    MAUSO: 'C38-BB', NGAYIN_NGAY: '19', NGAYIN_THANG: '09', NGAYIN_NAM: '2026', DAOTAO_COCAUTOCHUC_TEN: 'TRƯỜNG ĐH CNTT&TT', NGUOITAO_TENDAYDU: 'Phạm Thu Hà' }],
                rsThongTinDoiTuong: [{ HODEM: sv.HOTENNGUOIHOC.split(' ').slice(0, -1).join(' '), TEN: sv.HOTENNGUOIHOC.split(' ').slice(-1)[0], MASO: sv.MASONGUOIHOC,
                    DAOTAO_LOPQUANLY_N1_TEN: sv.LOP, MAUIN_MASO: 'DHCNTTTN_BIENLAIRUT_2018', TINHTRANG: 1 }]
            } };
        }
    });
})();
