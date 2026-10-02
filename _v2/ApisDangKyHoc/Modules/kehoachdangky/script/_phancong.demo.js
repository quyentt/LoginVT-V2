/* Dữ liệu mẫu cho khung _phancong.js — phanconglop, phancongphamvi (đăng ký học
   và nguyện vọng). Chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function like(rows, q, cols) {
        q = String(q || '').toLowerCase();
        return q ? rows.filter(function (r) { return cols.some(function (c) { return String(r[c] || '').toLowerCase().indexOf(q) >= 0; }); }) : rows;
    }
    function trang(rows, o) {
        var i = Number(o.pageIndex) || 1, n = Number(o.pageSize) || rows.length || 1;
        return { rows: rows.slice((i - 1) * n, i * n), pager: rows.length };
    }

    var PHANCAP = [
        { ID: 'PC_SV', MA: 'SINHVIEN', TEN: 'Sinh viên' },
        { ID: 'PC_LOP', MA: 'LOP', TEN: 'Lớp' },
        { ID: 'PC_CT', MA: 'CHUONGTRINH', TEN: 'Chương trình' },
        { ID: 'PC_KHOA', MA: 'KHOA', TEN: 'Khóa' },
        { ID: 'PC_HE', MA: 'HE', TEN: 'Hệ' },
        { ID: 'PC_KQL', MA: 'KHOAQUANLY', TEN: 'Khoa quản lý' }
    ];
    var KH = [
        { ID: 'KHDK1', MAKEHOACH: 'DK2025-1', TENKEHOACH: 'Đăng ký học kỳ 1 năm học 2025-2026', DAOTAO_THOIGIANDAOTAO_ID: 'TG1',
          DAOTAO_THOIGIANDAOTAO_NAM: '2025-2026', DAOTAO_THOIGIANDAOTAO_KY: '1', DAOTAO_THOIGIANDAOTAO_DOT: '1' },
        { ID: 'KHDK2', MAKEHOACH: 'DK2025-2', TENKEHOACH: 'Đăng ký học kỳ 2 năm học 2025-2026', DAOTAO_THOIGIANDAOTAO_ID: 'TG2',
          DAOTAO_THOIGIANDAOTAO_NAM: '2025-2026', DAOTAO_THOIGIANDAOTAO_KY: '2', DAOTAO_THOIGIANDAOTAO_DOT: '1' },
        { ID: 'KHDK3', MAKEHOACH: 'DKHE2026', TENKEHOACH: 'Đăng ký học kỳ hè 2026', DAOTAO_THOIGIANDAOTAO_ID: 'TG3',
          DAOTAO_THOIGIANDAOTAO_NAM: '2025-2026', DAOTAO_THOIGIANDAOTAO_KY: '3', DAOTAO_THOIGIANDAOTAO_DOT: '1' }
    ];
    function tg(o) {
        return { NGAYBATDAU: '05/08/2025', GIODANGKYTRONGNGAYDAU: 8, PHUTDANGKYTRONGNGAYDAU: 0,
            NGAYKETTHUC: '20/08/2025', GIOKETTHUCTRONGNGAYCUOI: 17, PHUTKETTHUCTRONGNGAYCUOI: 30,
            SOTINCHITOIDA: o[0], SOTINCHITOITHIEU: o[1], SOTINCHITOIDAN2: o[2], SOTINCHITOITHIEUN2: o[3],
            NGAYBATDAUTINHRUTHOCPHAN: '01/09/2025', SISOTOIDA: 60, SISOTOITHIEU: 20 };
    }
    function pcRow(id, pc, pv, ten, sl, t) {
        var r = tg(t || [25, 14, 10, 0]);
        r.ID = id; r.PHANCAPAPDUNG_ID = pc; r.PHAMVIAPDUNG_ID = pv; r.PHAMVIAPDUNG_TEN = ten; r.SOLUONG = sl;
        r.DANGKY_KEHOACHDANGKY_ID = 'KHDK1';
        return r;
    }
    var PCPV = [
        pcRow('PV01', 'PC_KHOA', 'K67', 'Khóa 67', 812),
        pcRow('PV02', 'PC_KHOA', 'K68', 'Khóa 68', 905, [22, 12, 8, 0]),
        pcRow('PV03', 'PC_CT', 'CTKTPM', 'Kỹ thuật phần mềm', 356),
        pcRow('PV04', 'PC_CT', 'CTQTKD', 'Quản trị kinh doanh', 298),
        pcRow('PV05', 'PC_LOP', 'L1', 'K67-KTPM1', 58),
        pcRow('PV06', 'PC_KQL', 'KQL1', 'Khoa Công nghệ thông tin', 1204),
        pcRow('PV07', 'PC_SV', 'NH03', 'Lê Minh Châu', 1)
    ];
    var NGUOIHOC = [
        ['NH01', 'BIT220101', 'Nguyễn Văn', 'An'], ['NH02', 'BIT220102', 'Trần Thị', 'Bình'],
        ['NH03', 'BBA220561', 'Lê Minh', 'Châu'], ['NH04', 'BIT230210', 'Phạm Thu', 'Dung'],
        ['NH05', 'BIT220263', 'Đỗ Quang', 'Huy'], ['NH06', 'BIT220318', 'Vũ Thị', 'Lan'],
        ['NH07', 'BIT220344', 'Hoàng Đức', 'Minh'], ['NH08', 'BIT220407', 'Bùi Thanh', 'Nga'],
        ['NH09', 'BIT220415', 'Ngô Bảo', 'Ngọc'], ['NH10', 'BIT220522', 'Đặng Văn', 'Phúc'],
        ['NH11', 'BIT220530', 'Phan Thị', 'Quỳnh'], ['NH12', 'BIT220611', 'Trịnh Minh', 'Tâm']
    ].map(function (x) { return { ID: 'R' + x[0], QLSV_NGUOIHOC_ID: x[0], MASO: x[1], HODEM: x[2], TEN: x[3] }; });

    var LHP = [
        ['LHP1', 'INT1340-01', 'Lập trình hướng đối tượng - 01', 'Kỹ thuật phần mềm', 'KTPM', 'Khóa 67'],
        ['LHP2', 'INT1340-02', 'Lập trình hướng đối tượng - 02', 'Kỹ thuật phần mềm', 'KTPM', 'Khóa 67'],
        ['LHP3', 'INT2208-01', 'Cơ sở dữ liệu - 01', 'Hệ thống thông tin', 'HTTT', 'Khóa 68'],
        ['LHP4', 'BSA2002-01', 'Nguyên lý kế toán - 01', 'Quản trị kinh doanh', 'QTKD', 'Khóa 67'],
        ['LHP5', 'MAT1093-03', 'Đại số tuyến tính - 03', 'Kỹ thuật phần mềm', 'KTPM', 'Khóa 68'],
        ['LHP6', 'PHI1006-05', 'Triết học Mác - Lênin - 05', 'Quản trị kinh doanh', 'QTKD', 'Khóa 68']
    ].map(function (x) {
        return { ID: x[0], MALOP: x[1], TENLOP: x[2], DAOTAO_CHUONGTRINH_TEN: x[3], DAOTAO_CHUONGTRINH_MA: x[4], DAOTAO_KHOADAOTAO_TEN: x[5] };
    });
    var PCLHP = [
        { ID: 'PL1', PHAMVIAPDUNG_ID: 'K67', PHANCAPAPDUNG_ID: 'PC_KHOA', PHAMVIAPDUNG_TEN: 'Khóa 67', PHANCAPAPDUNG_TEN: 'Khóa', DANGKY_LOPHOCPHAN_ID: 'LHP1', DANGKY_LOPHOCPHAN_MA: 'INT1340-01', DANGKY_LOPHOCPHAN_TEN: 'Lập trình hướng đối tượng - 01' },
        { ID: 'PL2', PHAMVIAPDUNG_ID: 'K67', PHANCAPAPDUNG_ID: 'PC_KHOA', PHAMVIAPDUNG_TEN: 'Khóa 67', PHANCAPAPDUNG_TEN: 'Khóa', DANGKY_LOPHOCPHAN_ID: 'LHP4', DANGKY_LOPHOCPHAN_MA: 'BSA2002-01', DANGKY_LOPHOCPHAN_TEN: 'Nguyên lý kế toán - 01' },
        { ID: 'PL3', PHAMVIAPDUNG_ID: 'CTKTPM', PHANCAPAPDUNG_ID: 'PC_CT', PHAMVIAPDUNG_TEN: 'Kỹ thuật phần mềm', PHANCAPAPDUNG_TEN: 'Chương trình', DANGKY_LOPHOCPHAN_ID: 'LHP1', DANGKY_LOPHOCPHAN_MA: 'INT1340-01', DANGKY_LOPHOCPHAN_TEN: 'Lập trình hướng đối tượng - 01' },
        { ID: 'PL4', PHAMVIAPDUNG_ID: 'CTKTPM', PHANCAPAPDUNG_ID: 'PC_CT', PHAMVIAPDUNG_TEN: 'Kỹ thuật phần mềm', PHANCAPAPDUNG_TEN: 'Chương trình', DANGKY_LOPHOCPHAN_ID: 'LHP5', DANGKY_LOPHOCPHAN_MA: 'MAT1093-03', DANGKY_LOPHOCPHAN_TEN: 'Đại số tuyến tính - 03' },
        { ID: 'PL5', PHAMVIAPDUNG_ID: 'L1', PHANCAPAPDUNG_ID: 'PC_LOP', PHAMVIAPDUNG_TEN: 'K67-KTPM1', PHANCAPAPDUNG_TEN: 'Lớp', DANGKY_LOPHOCPHAN_ID: 'LHP2', DANGKY_LOPHOCPHAN_MA: 'INT1340-02', DANGKY_LOPHOCPHAN_TEN: 'Lập trình hướng đối tượng - 02' }
    ];

    ums.demo.add({
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DANGKY.PHANCAP': PHANCAP,
        'DKH_KeHoachDangKy/LayDanhSach': function (o) { return like(KH, o.strTuKhoa, ['TENKEHOACH', 'MAKEHOACH']); },
        'DKH_KeHoachDangKyNV/LayDanhSach': [
            { ID: 'KHNV1', MAKEHOACH: 'NV2025-1', TENKEHOACH: 'Nguyện vọng học kỳ 1 năm học 2025-2026', DAOTAO_THOIGIANDAOTAO_ID: 'TG1' },
            { ID: 'KHNV2', MAKEHOACH: 'NV2025-2', TENKEHOACH: 'Nguyện vọng học kỳ 2 năm học 2025-2026', DAOTAO_THOIGIANDAOTAO_ID: 'TG2' }
        ],
        // Phân công phạm vi (đăng ký học / nguyện vọng)
        'DKH_PhanCong_PhamVi/LayDanhSach': function (o) { return o.strDangKy_KeHoachDangKy_Id === 'KHDK1' ? PCPV : []; },
        'DKH_NguyenVong_PhamVi/LayDanhSach': function (o) {
            return o.strDangKy_KeHoachDangKy_Id === 'KHNV1' ? PCPV.slice(0, 5).map(function (r) {
                var x = JSON.parse(JSON.stringify(r)); x.ID = 'N' + r.ID; x.DANGKY_KEHOACHDANGKY_ID = 'KHNV1'; return x;
            }) : [];
        },
        'DKH_PhanCong_PhamVi/LayDSNguoiHoc_PhanCong_PhamVi': function (o) { return trang(NGUOIHOC, o); },
        'DKH_NguyenVong_PhamVi/LayDSNguoiHoc_NV_PhamVi': function (o) { return trang(NGUOIHOC.slice(0, 7), o); },
        'DKH_ThongTin/Them_DangKy_PhanCong_PhamVi': { rows: [], raw: { Id: 'PVNEW' } },
        'DKH_ThongTin/Sua_DangKy_PhanCong_PhamVi': [],
        'DKH_PhanCong_PhamVi/Xoa': [],
        'DKH_NguyenVong_PhamVi/ThemMoi': { rows: [], raw: { Id: 'NVNEW' } },
        'DKH_NguyenVong_PhamVi/CapNhat': [],
        'DKH_NguyenVong_PhamVi/Xoa': [],
        'PKG_DANGKYHOC_CHUNG5.TaoDuLieuTamTheoNguoiHoc': [],
        'PKG_DANGKYHOC_CHUNG5.TaoDuLieuLichTuanTam': [],
        // Phân công lớp
        'DKH_PhanCong_LopHP/LayDSDangKy_PhamVi_LopHP': function (o) { return o.strDangKy_KeHoachDangKy_Id === 'KHDK1' ? PCPV.slice(0, 6) : []; },
        'DKH_PhanCong_LopHP/LayDanhSach': function (o) {
            var rows = PCLHP.filter(function (r) {
                return (!o.strPhamViApDung_Id || r.PHAMVIAPDUNG_ID === o.strPhamViApDung_Id) &&
                    (!o.strDangKy_LopHocPhan_Id || r.DANGKY_LOPHOCPHAN_ID === o.strDangKy_LopHocPhan_Id);
            });
            return trang(rows, o);
        },
        'DKH_PhanCong_LopHP/ThemMoi': { rows: [], raw: { Id: 'PLNEW' } },
        'DKH_PhanCong_LopHP/Xoa': [],
        'DKH_PhanCong_LopHP/Xoa_DangKy_PhanCong_LopHP': [],
        'DKH_PhanCong_LopHP/LayDSKhoaToChuc': function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'K67', TENKHOA: 'Khóa 67' }, { ID: 'K68', TENKHOA: 'Khóa 68' }] : []; },
        'DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc': function (o) {
            return o.strDaoTao_KhoaDaoTao_Id ? [{ ID: 'CTKTPM', TENCHUONGTRINH: 'Kỹ thuật phần mềm' }, { ID: 'CTHTTT', TENCHUONGTRINH: 'Hệ thống thông tin' }, { ID: 'CTQTKD', TENCHUONGTRINH: 'Quản trị kinh doanh' }] : [];
        },
        'DKH_PhanCong_LopHP/LayDSHocPhan': [
            { ID: 'HP1', MA: 'INT1340', TEN: 'Lập trình hướng đối tượng' }, { ID: 'HP2', MA: 'INT2208', TEN: 'Cơ sở dữ liệu' },
            { ID: 'HP3', MA: 'BSA2002', TEN: 'Nguyên lý kế toán' }, { ID: 'HP4', MA: 'MAT1093', TEN: 'Đại số tuyến tính' }
        ],
        'DKH_ThongTin/LayDSLopHocPhan': function (o) {
            var rows = LHP;
            if (o.dChiLayCacLopChuaPhanCong == 1) rows = rows.filter(function (r) { return !PCLHP.some(function (p) { return p.DANGKY_LOPHOCPHAN_ID === r.ID; }); });
            return trang(rows, o);
        },
        'KHCT_CoSoDaoTao/LayDanhSach': [{ ID: 'CS1', TEN: 'Cơ sở Hà Nội' }, { ID: 'CS2', TEN: 'Cơ sở Hòa Lạc' }],
        'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao': [
            { ID: 'TG1', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 - 2025-2026' }, { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 - 2025-2026' },
            { ID: 'TG3', DAOTAO_THOIGIANDAOTAO: 'Học kỳ hè - 2025-2026' }
        ],
        // Khối "Thông tin phạm vi"
        'pkg_kehoach_thongtin.LayDSKhoaQuanLy': [{ ID: 'KQL1', TEN: 'Khoa Công nghệ thông tin' }, { ID: 'KQL2', TEN: 'Khoa Kinh tế' }],
        'SV_HoSo/LayDanhSach': function (o) { return o.strLopQuanLy_Id ? NGUOIHOC.slice(0, 5) : []; },
        'pkg_kehoach_thongtin.LayDSDaoTao_CT_DinhHuong': function (o) {
            return o.strDaoTao_ChuongTrinh_Id ? [{ ID: 'DH1', TEN: 'Định hướng Công nghệ phần mềm' }, { ID: 'DH2', TEN: 'Định hướng Trí tuệ nhân tạo' }] : [];
        },
        'pkg_kehoach_thongtin2.LayDSDaoTao_CT_DH_Nhom': function (o) {
            return o.strDaoTao_CT_DinhHuong_Id ? [{ ID: 'NDH1', TEN: 'Nhóm tự chọn 1' }, { ID: 'NDH2', TEN: 'Nhóm tự chọn 2' }] : [];
        }
    });
})();
