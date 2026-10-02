/* Dữ liệu mẫu cho tracuudiem — chỉ dùng ở chế độ dựng thử. */
(function () {
    var NH = [['NH01', 'BIT220101', 'Nguyễn Văn', 'An'], ['NH02', 'BIT220102', 'Trần Thị', 'Bình'], ['NH03', 'BIT220103', 'Lê Minh', 'Châu']]
        .map(function (x, i) { return { ID: 'R' + i, QLSV_NGUOIHOC_ID: x[0], QLSV_NGUOIHOC_MASO: x[1], QLSV_NGUOIHOC_HODEM: x[2], QLSV_NGUOIHOC_TEN: x[3], QLSV_NGUOIHOC_NGAYSINH: '0' + (i + 1) + '/05/2004' }; });
    var DIEM = { NH01: [8.5, 7, 7.6, 'B+'], NH02: [6, 5.5, 5.7, 'C'], NH03: [9, 8.5, 8.7, 'A'] };
    var XL = [{ ID: 'XL1', TEN: 'Xuất sắc' }, { ID: 'XL2', TEN: 'Giỏi' }, { ID: 'XL3', TEN: 'Khá' }];
    function svXL(o) {
        var n = { XL1: 1, XL2: 2, XL3: 3 }[o.strXepLoai_Id] || 0;
        return NH.slice(0, n).map(function (s) { return { QLSV_NGUOIHOC_MASO: s.QLSV_NGUOIHOC_MASO, QLSV_NGUOIHOC_HODEM: s.QLSV_NGUOIHOC_HODEM, QLSV_NGUOIHOC_TEN: s.QLSV_NGUOIHOC_TEN,
            GIOITINH_TEN: 'Nam', XEPLOAI_TEN: (XL.filter(function (x) { return x.ID === o.strXepLoai_Id; })[0] || {}).TEN, THOIGIANDAOTAO_TEN: '2025_2026_2', TRANGTHAINGUOIHOC_TEN: 'Đang học',
            DAOTAO_LOPQUANLY_TEN: 'K67-KTPM1', DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm', DAOTAO_CHUONGTRINH_MA: 'KTPM', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67' }; });
    }
    ums.demo.add({
        'pkg_kehoach_thongtin.LayDSKhoaQuanLy': [{ ID: 'KQL1', TEN: 'Khoa Công nghệ thông tin' }, { ID: 'KQL2', TEN: 'Khoa Kinh tế' }],
        'pkg_kehoach_thongtin.LayDSNamNhapHoc': [{ NAMNHAPHOC: '2022' }, { NAMNHAPHOC: '2023' }],
        'D_ThoiGianDaoTao/LayDanhSach': [{ ID: 'TG1', DAOTAO_THOIGIANDAOTAO: '2026_2027_1' }, { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: '2025_2026_2' }],
        'KHCT_LopQuanLy/LayDanhSach': function (o) { return o.strDaoTao_KhoaDaoTao_Id ? [{ ID: 'L1', TEN: 'K67-KTPM1' }, { ID: 'L2', TEN: 'K67-QTKD2' }] : []; },
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DIEM.PHAMVITONGHOPDIEM': [{ ID: 'PV1', MA: 'TOANKHOA', TEN: 'Toàn khóa' }, { ID: 'PV2', MA: 'NHIEUKY', TEN: 'Nhiều kỳ' },
            { ID: 'PV3', MA: 'NAMHOC', TEN: 'Năm học' }, { ID: 'PV4', MA: 'HOCKY', TEN: 'Học kỳ' }, { ID: 'PV5', MA: 'DOTHOC', TEN: 'Đợt học' }],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DIEM.THANGDIEM': [{ ID: 'TD10', MA: '10', TEN: 'Thang điểm 10' }, { ID: 'TD4', MA: '4', TEN: 'Thang điểm 4' }],
        'D_HocPhan_TraCuuDiem/LayDanhSach': { rows: [{ ID: 'HP1', MA: 'IT3100', TEN: 'Lập trình hướng đối tượng' }, { ID: 'HP2', MA: 'IT3200', TEN: 'Cơ sở dữ liệu' }], pager: 2 },
        'D_HocPhan_TraCuuDiem/LayChiTiet_Post': { rows: {
            rsDSCotThongTinNguoiHoc: [{ MACOT: 'QLSV_NGUOIHOC_MASO', TENCOT: 'Mã SV', DORONG: 100 }, { MACOT: 'QLSV_NGUOIHOC_HODEM', TENCOT: 'Họ đệm', DORONG: 140 },
                { MACOT: 'QLSV_NGUOIHOC_TEN', TENCOT: 'Tên', DORONG: 70 }],
            rsDSCotThongTinDiemHocPhan: [
                { MACOT: 'HP1', MACOT_CHA: null, TENCOT: 'IT3100 - Lập trình hướng đối tượng' },
                { MACOT: 'HP1_QT', MACOT_CHA: 'HP1', TENCOT: 'Quá trình' }, { MACOT: 'HP1_CK', MACOT_CHA: 'HP1', TENCOT: 'Cuối kỳ' },
                { MACOT: 'HP1_TK', MACOT_CHA: 'HP1', TENCOT: 'Tổng kết' }, { MACOT: 'HP1_CHU', MACOT_CHA: 'HP1', TENCOT: 'Điểm chữ', MAMAUHIENTHI: 'c0392b' }],
            rsDSCotThongTinDTB: [{ MACOT: 'DTBHK' }, { MACOT: 'DTBTL' }] } },
        'D_LopQuanLy_NguoiHoc/LayDanhSach': NH,
        'D_LopQuanLy_Diem/LayGiaTriDiemTheoLopQuanLy': function (o) {
            var k = { HP1_QT: 0, HP1_CK: 1, HP1_TK: 2, HP1_CHU: 3 }[o.strKyHieuCotDuLieu];
            return NH.map(function (s) { return { QLSV_NGUOIHOC_ID: s.QLSV_NGUOIHOC_ID, GIATRICOTDULIEU: String(DIEM[s.QLSV_NGUOIHOC_ID][k]) + (k === 1 ? '#(lần 1)' : '') }; });
        },
        'D_LopQuanLy_DiemTrungBinh/LayGiaTriDiemTBTheoLopQuanLy': NH.map(function (s, i) { return { QLSV_NGUOIHOC_ID: s.QLSV_NGUOIHOC_ID, DTBHK: 7.2 + i / 2, DTBTL: 7 + i / 3 }; }),
        'PKG_XEPLOAIHOCTAP_CHUNG.LayDMXepLoaiHocTap': XL,
        'PKG_KEHOACH_THONGTIN.LayDSKS_Nganh_KhoaDaoTao': [
            { DAOTAO_N_CN_ID: 'N1', DAOTAO_N_CN_TEN: 'Công nghệ thông tin', DAOTAO_KHOADAOTAO_ID: 'K67', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67', TONGSOSV: 120 },
            { DAOTAO_N_CN_ID: 'N1', DAOTAO_N_CN_TEN: 'Công nghệ thông tin', DAOTAO_KHOADAOTAO_ID: 'K68', DAOTAO_KHOADAOTAO_TEN: 'Khóa 68', TONGSOSV: 135 },
            { DAOTAO_N_CN_ID: 'N2', DAOTAO_N_CN_TEN: 'Quản trị kinh doanh', DAOTAO_KHOADAOTAO_ID: 'K67', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67', TONGSOSV: 90 }],
        'PKG_KEHOACH_THONGTIN.LayDSKS_CTDT_KhoaDaoTao': [
            { DAOTAO_CHUONGTRINH_ID: 'CT1', TENCHUONGTRINH: 'Kỹ thuật phần mềm', MACHUONGTRINH: 'KTPM', DAOTAO_KHOADAOTAO_ID: 'K67', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67', TONGSOSV: 60 },
            { DAOTAO_CHUONGTRINH_ID: 'CT2', TENCHUONGTRINH: 'Hệ thống thông tin', MACHUONGTRINH: 'HTTT', DAOTAO_KHOADAOTAO_ID: 'K67', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67', TONGSOSV: 60 }],
        'PKG_XEPLOAIHOCTAP_BAOCAO.LayDS_ThongKe_XLHT_KetQua': svXL,
        'PKG_XEPLOAIHOCTAP_BAOCAO.LayDS_ThongKe_XLHT_CTDT_KetQua': svXL
    });
})();
