/* Dữ liệu mẫu cho nganh2/kehoach (Kế hoạch ngành 2) — chỉ dùng ở chế độ dựng thử. */
(function () {
    function dm(id, ma, ten, bang, t1, t2) { return { ID: id, MA: ma, TEN: ten, CHUNG_TENDANHMUC_TEN: bang, THONGTIN1: t1 || '', THONGTIN2: t2 || '' }; }
    var KH = [
        { ID: 'N2KH01', TENKEHOACH: 'Đăng ký học ngành 2 đợt 1 năm 2025', PHANLOAI_ID: 'PL_N2', PHANLOAI_TEN: 'Ngành 2', MOHINHDANGKY_ID: 'MH_SS',
          MOHINHDANGKY_TEN: 'Học song song hai chương trình', TUNGAY: '01/09/2025', DENNGAY: '30/09/2025', HIEULUC: 1, MOTA: 'Dành cho SV khóa K22, K23' },
        { ID: 'N2KH02', TENKEHOACH: 'Chuyển ngành đợt tháng 1/2026', PHANLOAI_ID: 'PL_CN', PHANLOAI_TEN: 'Chuyển ngành', MOHINHDANGKY_ID: 'MH_CN',
          MOHINHDANGKY_TEN: 'Chuyển hẳn sang ngành mới', TUNGAY: '05/01/2026', DENNGAY: '20/01/2026', HIEULUC: 1, MOTA: '' },
        { ID: 'N2KH03', TENKEHOACH: 'Đăng ký học ngành 2 đợt 2 năm 2024', PHANLOAI_ID: 'PL_N2', PHANLOAI_TEN: 'Ngành 2', MOHINHDANGKY_ID: 'MH_SS',
          MOHINHDANGKY_TEN: 'Học song song hai chương trình', TUNGAY: '01/03/2024', DENNGAY: '31/03/2024', HIEULUC: 0, MOTA: 'Đã kết thúc' }
    ];
    ums.demo.add({
        'DKH_Nganh2/LayDSQLSV_NguoiDung_PhanLoai': [{ ID: 'PL_N2', TEN: 'Ngành 2' }, { ID: 'PL_CN', TEN: 'Chuyển ngành' }],
        'DKH_Nganh2/LayDSKeHoach': function (o) {
            return KH.filter(function (r) {
                return (!o.strPhanLoai_Id || r.PHANLOAI_ID === o.strPhanLoai_Id) &&
                    (!o.strTuKhoa || r.TENKEHOACH.toLowerCase().indexOf(String(o.strTuKhoa).toLowerCase()) >= 0);
            });
        },
        'DKH_Nganh2/Them_DangKy_Nganh_Tiep': { rows: [], raw: { Id: 'N2KHMOI' } },
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLSV.DANGKY.NGANH2.MOHINH': [
            dm('MH_SS', 'SONGSONG', 'Học song song hai chương trình', 'Mô hình đăng ký ngành 2'),
            dm('MH_CN', 'CHUYENNGANH', 'Chuyển hẳn sang ngành mới', 'Mô hình đăng ký ngành 2')
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLSV.DANGKY.NGANH.TIEP.DUYET': [
            dm('DY_DONGY', 'DONGY', 'Duyệt', 'Duyệt ngành tiếp', 'fa fa-check-circle', 'color: #16a34a'),
            dm('DY_TUCHOI', 'TUCHOI', 'Không duyệt', 'Duyệt ngành tiếp', 'fa fa-times-circle', 'color: #dc2626'),
            dm('DY_BOSUNG', 'BOSUNG', 'Yêu cầu bổ sung', 'Duyệt ngành tiếp', 'fa fa-reply', '')
        ],
        'KHCT_HeDaoTao/LayDanhSach': [{ ID: 'H1', TENHEDAOTAO: 'Đại học chính quy' }, { ID: 'H2', TENHEDAOTAO: 'Liên thông' }],
        'KHCT_KhoaDaoTao/LayDanhSach': function (o) {
            var all = [{ ID: 'K67', TENKHOA: 'Khóa 67', H: 'H1' }, { ID: 'K68', TENKHOA: 'Khóa 68', H: 'H1' }, { ID: 'LT24', TENKHOA: 'Liên thông 2024', H: 'H2' }];
            return o.strDaoTao_HeDaoTao_Id ? all.filter(function (x) { return x.H === o.strDaoTao_HeDaoTao_Id; }) : all;
        },
        'DKH_Nganh2/LayDSDangKy_Nganh_Tiep_PhamVi': function (o) {
            return o.strQLSV_DangKy_Nganh_Tiep_Id === 'N2KH01'
                ? [{ ID: 'PV01', DAOTAO_HEDAOTAO_ID: 'H1', PHAMVIAPDUNG_ID: 'K67' }, { ID: 'PV02', DAOTAO_HEDAOTAO_ID: 'H1', PHAMVIAPDUNG_ID: 'K68' }] : [];
        },
        'DKH_Nganh2/LayDSDK_Nganh_Tiep_PV_MoNganh': function (o) {
            return o.strQLSV_DangKy_Nganh_Tiep_Id === 'N2KH01' ? [
                { ID: 'MN01', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Kỹ thuật phần mềm',
                  DAOTAO_LOPQUANLY_TEN: 'K67-KTPM1', XAUDIEUKIEN: 'DTBTL>=2.5', MOTA: 'Chỉ tiêu 40' },
                { ID: 'MN02', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Quản trị kinh doanh',
                  DAOTAO_LOPQUANLY_TEN: 'K67-QTKD2', XAUDIEUKIEN: '', MOTA: '' }] : [];
        },
        'DKH_Nganh2/LayDSDK_Nganh_Tiep_KetQua': function (o) {
            return o.strQLSV_DangKy_Nganh_Tiep_Id === 'N2KH01' ? [
                { ID: 'KQ01', QLSV_NGUOIHOC_MASO: 'BIT220263', QLSV_NGUOIHOC_HODEM: 'Nguyễn Văn', QLSV_NGUOIHOC_TEN: 'An', DAOTAO_CHUONGTRINH_TEN: 'Công nghệ thông tin',
                  DAOTAO_LOPQUANLY_DANGKY_TEN: 'K67-QTKD2', DAOTAO_CHUONGTRINH_DANGKY_TEN: 'Quản trị kinh doanh', DAOTAO_KHOADAOTAO_DANGKY_TEN: 'Khóa 67',
                  SOTIENPHAINOP: 12500000, SOTIENDANOP: 12500000, TINHTRANGDUYET: 'Đã duyệt',
                  QLSV_DANGKY_NGANH_TIEP_ID: 'N2KH01', QLSV_NGUOIHOC_ID: 'SV01', DAOTAO_CHUONGTRINH_ID: 'CTCNTT', DAOTAO_CHUONGTRINH_DANGKY_ID: 'CTQTKD' },
                { ID: 'KQ02', QLSV_NGUOIHOC_MASO: 'BBA220561', QLSV_NGUOIHOC_HODEM: 'Lê Hoàng', QLSV_NGUOIHOC_TEN: 'Cường', DAOTAO_CHUONGTRINH_TEN: 'Quản trị kinh doanh',
                  DAOTAO_LOPQUANLY_DANGKY_TEN: 'K67-KTPM1', DAOTAO_CHUONGTRINH_DANGKY_TEN: 'Kỹ thuật phần mềm', DAOTAO_KHOADAOTAO_DANGKY_TEN: 'Khóa 67',
                  SOTIENPHAINOP: 14200000, SOTIENDANOP: 0, TINHTRANGDUYET: 'Chờ duyệt',
                  QLSV_DANGKY_NGANH_TIEP_ID: 'N2KH01', QLSV_NGUOIHOC_ID: 'SV02', DAOTAO_CHUONGTRINH_ID: 'CTQTKD', DAOTAO_CHUONGTRINH_DANGKY_ID: 'CTKTPM' }] : [];
        },
        'pkg_dangkyhoc_nganh2.LayDSQLSV_DangKy_Nganh_GioiHan': function (o) {
            return o.strQLSV_DangKy_Nganh_Tiep_Id === 'N2KH01'
                ? [{ ID: 'GH01', DAOTAO_LOPQUANLY_GIOIHAN_TEN: 'K67-KTPM1', DAOTAO_CHUONGTRINH_DANGKY_TEN: 'Quản trị kinh doanh', MANGANH: '7340101' }] : [];
        },
        'pkg_dangkyhoc_nganh2.LayDSLopQuanLyDeGioiHan': [{ ID: 'L1', TEN: 'K67-KTPM1' }, { ID: 'L2', TEN: 'K67-QTKD2' }],
        'pkg_dangkyhoc_nganh2.LayDSChuongTrinhDeGioiHan': [
            { ID: 'CTG1', MACHUONGTRINH: 'QTKD67', MANGANH: '7340101', TENCHUONGTRINH: 'Quản trị kinh doanh', TENNGANH: 'Quản trị kinh doanh', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67' },
            { ID: 'CTG2', MACHUONGTRINH: 'KTPM67', MANGANH: '7480103', TENCHUONGTRINH: 'Kỹ thuật phần mềm', TENNGANH: 'Kỹ thuật phần mềm', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67' }
        ]
    });
})();
