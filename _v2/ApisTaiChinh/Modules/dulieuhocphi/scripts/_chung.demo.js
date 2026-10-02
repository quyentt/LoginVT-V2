/* Dữ liệu mẫu dùng chung cho module dulieuhocphi (và giahanthu/kehoach) —
   chỉ dùng ở chế độ dựng thử. Tên cột lấy từ tệp .js gốc. */
(function () {
    'use strict';

    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten }; }

    var HE = [
        { ID: 'HE1', TENHEDAOTAO: 'Đại học chính quy', MAHEDAOTAO: 'DHCQ' },
        { ID: 'HE2', TENHEDAOTAO: 'Đại học vừa làm vừa học', MAHEDAOTAO: 'VLVH' },
        { ID: 'HE3', TENHEDAOTAO: 'Thạc sĩ', MAHEDAOTAO: 'THS' }
    ];
    var KHOA = [
        { ID: 'K1', TENKHOA: 'Khóa 2022 (K66)', MAKHOA: 'K66', DAOTAO_HEDAOTAO_ID: 'HE1' },
        { ID: 'K2', TENKHOA: 'Khóa 2023 (K67)', MAKHOA: 'K67', DAOTAO_HEDAOTAO_ID: 'HE1' },
        { ID: 'K3', TENKHOA: 'Khóa 2024 (K68)', MAKHOA: 'K68', DAOTAO_HEDAOTAO_ID: 'HE1' },
        { ID: 'K4', TENKHOA: 'VLVH 2023', MAKHOA: 'V23', DAOTAO_HEDAOTAO_ID: 'HE2' },
        { ID: 'K5', TENKHOA: 'Cao học 2024', MAKHOA: 'CH24', DAOTAO_HEDAOTAO_ID: 'HE3' }
    ];
    var CT = [
        { ID: 'CT1', TENCHUONGTRINH: 'Công nghệ thông tin', MACHUONGTRINH: '7480201', DAOTAO_KHOADAOTAO_ID: 'K1' },
        { ID: 'CT2', TENCHUONGTRINH: 'Quản trị kinh doanh', MACHUONGTRINH: '7340101', DAOTAO_KHOADAOTAO_ID: 'K1' },
        { ID: 'CT3', TENCHUONGTRINH: 'Kế toán', MACHUONGTRINH: '7340301', DAOTAO_KHOADAOTAO_ID: 'K2' },
        { ID: 'CT4', TENCHUONGTRINH: 'Công nghệ thông tin', MACHUONGTRINH: '7480201', DAOTAO_KHOADAOTAO_ID: 'K2' }
    ];
    var LOP = [
        { ID: 'L1', TEN: 'CNTT 66A', MA: 'CNTT66A', DAOTAO_KHOADAOTAO_ID: 'K1', SOLUONGTHUCTE: 58, SOLUONGKEHOACH: 60, LOAILOP_TEN: 'Lớp chính quy', NHOMLOP_TEN: 'Nhóm 1', DAOTAO_KHOADAOTAO_TEN: 'Khóa 2022 (K66)', DAOTAO_CHUONGTRINH_TEN: 'Công nghệ thông tin', DAOTAO_KHOAQUANLY_TEN: 'Khoa CNTT' },
        { ID: 'L2', TEN: 'CNTT 66B', MA: 'CNTT66B', DAOTAO_KHOADAOTAO_ID: 'K1', SOLUONGTHUCTE: 61, SOLUONGKEHOACH: 60, LOAILOP_TEN: 'Lớp chính quy', NHOMLOP_TEN: 'Nhóm 1', DAOTAO_KHOADAOTAO_TEN: 'Khóa 2022 (K66)', DAOTAO_CHUONGTRINH_TEN: 'Công nghệ thông tin', DAOTAO_KHOAQUANLY_TEN: 'Khoa CNTT' },
        { ID: 'L3', TEN: 'QTKD 66', MA: 'QTKD66', DAOTAO_KHOADAOTAO_ID: 'K1', SOLUONGTHUCTE: 72, SOLUONGKEHOACH: 75, LOAILOP_TEN: 'Lớp chính quy', NHOMLOP_TEN: 'Nhóm 2', DAOTAO_KHOADAOTAO_TEN: 'Khóa 2022 (K66)', DAOTAO_CHUONGTRINH_TEN: 'Quản trị kinh doanh', DAOTAO_KHOAQUANLY_TEN: 'Khoa Kinh tế' },
        { ID: 'L4', TEN: 'KT 67A', MA: 'KT67A', DAOTAO_KHOADAOTAO_ID: 'K2', SOLUONGTHUCTE: 55, SOLUONGKEHOACH: 55, LOAILOP_TEN: 'Lớp chính quy', NHOMLOP_TEN: 'Nhóm 2', DAOTAO_KHOADAOTAO_TEN: 'Khóa 2023 (K67)', DAOTAO_CHUONGTRINH_TEN: 'Kế toán', DAOTAO_KHOAQUANLY_TEN: 'Khoa Kinh tế' }
    ];
    var THOIGIAN = [
        { ID: 'TG1', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm học 2025-2026', THOIGIAN: 'HK1 2025-2026' },
        { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 năm học 2025-2026', THOIGIAN: 'HK2 2025-2026' },
        { ID: 'TG3', DAOTAO_THOIGIANDAOTAO: 'Học kỳ hè năm học 2025-2026', THOIGIAN: 'HK hè 2025-2026' }
    ];
    var SV = [
        sv('SV1', 'BIT220263', 'Nguyễn Văn', 'An', '12/03/2004', 'L1', 'CNTT 66A', 'CT1', 'Công nghệ thông tin', 'K1', 'Khóa 2022 (K66)'),
        sv('SV2', 'BIT220274', 'Trần Thị', 'Bình', '25/07/2004', 'L1', 'CNTT 66A', 'CT1', 'Công nghệ thông tin', 'K1', 'Khóa 2022 (K66)'),
        sv('SV3', 'BIT220301', 'Lê Hoàng', 'Cường', '02/11/2004', 'L2', 'CNTT 66B', 'CT1', 'Công nghệ thông tin', 'K1', 'Khóa 2022 (K66)'),
        sv('SV4', 'BBA220561', 'Phạm Thu', 'Dung', '19/01/2004', 'L3', 'QTKD 66', 'CT2', 'Quản trị kinh doanh', 'K1', 'Khóa 2022 (K66)'),
        sv('SV5', 'BAC230118', 'Vũ Minh', 'Đức', '30/09/2005', 'L4', 'KT 67A', 'CT3', 'Kế toán', 'K2', 'Khóa 2023 (K67)'),
        sv('SV6', 'BAC230142', 'Đỗ Thị Mai', 'Hương', '08/05/2005', 'L4', 'KT 67A', 'CT3', 'Kế toán', 'K2', 'Khóa 2023 (K67)')
    ];
    function sv(id, ma, hodem, ten, ns, lop, lopTen, ct, ctTen, khoa, khoaTen) {
        return {
            ID: 'HS' + id, QLSV_NGUOIHOC_ID: id, QLSV_NGUOIHOC_MASO: ma, QLSV_NGUOIHOC_HODEM: hodem, QLSV_NGUOIHOC_TEN: ten,
            QLSV_NGUOIHOC_HOTEN: hodem + ' ' + ten, QLSV_NGUOIHOC_NGAYSINH: ns,
            DAOTAO_LOPQUANLY_ID: lop, DAOTAO_LOPQUANLY_TEN: lopTen, DAOTAO_TOCHUCCHUONGTRINH_ID: ct, DAOTAO_CHUONGTRINH_TEN: ctTen,
            DAOTAO_KHOADAOTAO_ID: khoa, DAOTAO_KHOADAOTAO_TEN: khoaTen, QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học',
            DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', KHOAQUANLY_TEN: ct === 'CT1' ? 'Khoa CNTT' : 'Khoa Kinh tế',
            MASO: ma, HODEM: hodem, TEN: ten, ANH: ''
        };
    }

    /* Kết quả tính phí — một dòng mỗi sinh viên */
    function kqTinChi(s, i) {
        var hp = [6, 7, 5, 8, 6, 7][i], tc = [18, 21, 15, 24, 17, 20][i];
        var di = tc * 450000, lai = [0, 1350000, 0, 900000, 0, 0][i], nang = [0, 0, 450000, 0, 0, 0][i];
        var pt = [0, 0, 50, 0, 100, 0][i];
        var mien = Math.round((di + lai + nang) * pt / 100);
        return {
            QLSV_NGUOIHOC_ID: s.QLSV_NGUOIHOC_ID, QLSV_NGUOIHOC_MASO: s.QLSV_NGUOIHOC_MASO, QLSV_NGUOIHOC_HODEM: s.QLSV_NGUOIHOC_HODEM,
            QLSV_NGUOIHOC_TEN: s.QLSV_NGUOIHOC_TEN, QLSV_NGUOIHOC_NGAYSINH: s.QLSV_NGUOIHOC_NGAYSINH, QLSV_NGUOIHOC_TINHTRANG: 'Đang học',
            QLSV_NGUOIHOC_LOP: s.DAOTAO_LOPQUANLY_TEN, QLSV_NGUOIHOC_CHUONGTRINH: s.DAOTAO_CHUONGTRINH_TEN, QLSV_NGUOIHOC_KHOAHOC: s.DAOTAO_KHOADAOTAO_TEN,
            SOHOCPHAN: hp, SOTINCHI: tc, SOTIEN_HOCDI: di, SOTIEN_HOCLAI: lai, SOTIEN_HOCNANGDIEM: nang,
            PHANTRAMMIEN: pt, SOTIENMIEN: mien, SOTIENPHAINOP: di + lai + nang - mien
        };
    }
    function kqNienChe(s, i) {
        var tien = [9800000, 9800000, 11200000, 9800000, 8600000, 8600000][i];
        var pt = [0, 30, 0, 0, 100, 50][i], coDinh = [0, 0, 500000, 0, 0, 0][i];
        var mien = Math.round(tien * pt / 100);
        return {
            QLSV_NGUOIHOC_ID: s.QLSV_NGUOIHOC_ID, QLSV_NGUOIHOC_MASO: s.QLSV_NGUOIHOC_MASO, QLSV_NGUOIHOC_HODEM: s.QLSV_NGUOIHOC_HODEM,
            QLSV_NGUOIHOC_TEN: s.QLSV_NGUOIHOC_TEN, QLSV_NGUOIHOC_NGAYSINH: s.QLSV_NGUOIHOC_NGAYSINH, QLSV_NGUOIHOC_TINHTRANG: 'Đang học',
            QLSV_NGUOIHOC_LOP: s.DAOTAO_LOPQUANLY_TEN, QLSV_NGUOIHOC_CHUONGTRINH: s.DAOTAO_CHUONGTRINH_TEN, QLSV_NGUOIHOC_KHOAHOC: s.DAOTAO_KHOADAOTAO_TEN,
            SOTIEN: tien, PHANTRAMMIEN: pt, SOTIENMIEN: mien, SOTIENMIENCODINH: coDinh, SOTIENPHAINOP: tien - mien - coDinh
        };
    }
    var CHITIET = [
        { DAOTAO_HOCPHAN_MA: 'IT3100', DAOTAO_HOCPHAN_TEN: 'Lập trình hướng đối tượng', DAOTAO_HOCPHAN_TINCHI: 3, SOTIEN: 1350000, KIEUHOC_TEN: 'Học đi', PHANTRAMMIEN: 0, SOTIENMIEN: 0 },
        { DAOTAO_HOCPHAN_MA: 'IT3080', DAOTAO_HOCPHAN_TEN: 'Mạng máy tính', DAOTAO_HOCPHAN_TINCHI: 3, SOTIEN: 1350000, KIEUHOC_TEN: 'Học đi', PHANTRAMMIEN: 0, SOTIENMIEN: 0 },
        { DAOTAO_HOCPHAN_MA: 'IT3090', DAOTAO_HOCPHAN_TEN: 'Cơ sở dữ liệu', DAOTAO_HOCPHAN_TINCHI: 4, SOTIEN: 1800000, KIEUHOC_TEN: 'Học đi', PHANTRAMMIEN: 50, SOTIENMIEN: 900000 },
        { DAOTAO_HOCPHAN_MA: 'MI1111', DAOTAO_HOCPHAN_TEN: 'Giải tích I', DAOTAO_HOCPHAN_TINCHI: 3, SOTIEN: 1350000, KIEUHOC_TEN: 'Học lại', PHANTRAMMIEN: 0, SOTIENMIEN: 0 },
        { DAOTAO_HOCPHAN_MA: 'SSH1111', DAOTAO_HOCPHAN_TEN: 'Triết học Mác - Lênin', DAOTAO_HOCPHAN_TINCHI: 2, SOTIEN: 900000, KIEUHOC_TEN: 'Học nâng điểm', PHANTRAMMIEN: 0, SOTIENMIEN: null }
    ];

    function inList(val, list) {
        if (!val) return true;
        return String(val).split(',').indexOf(list) >= 0;
    }

    ums.demo.add({
        /* --- Danh mục đào tạo (ums.ref) --- */
        'pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTao': HE,
        'pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTaoQuyen': HE,
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_KhoaDaoTao': function (o) {
            return KHOA.filter(function (k) { return inList(o.strDAOTAO_HeDaoTao_Id, k.DAOTAO_HEDAOTAO_ID); });
        },
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_ToChucCT': function (o) {
            return CT.filter(function (c) { return inList(o.strDaoTao_KhoaDaoTao_Id, c.DAOTAO_KHOADAOTAO_ID); });
        },
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy': function (o) {
            return LOP.filter(function (l) { return inList(o.strDaoTao_KhoaDaoTao_Id, l.DAOTAO_KHOADAOTAO_ID); });
        },
        'KHCT_KhoaDaoTao/LayDanhSach': function (o) {
            return KHOA.filter(function (k) { return inList(o.strDaoTao_HeDaoTao_Id, k.DAOTAO_HEDAOTAO_ID); });
        },
        'KHCT_ToChucChuongTrinh/LayDanhSach': function (o) {
            return CT.filter(function (c) { return inList(o.strDaoTao_KhoaDaoTao_Id, c.DAOTAO_KHOADAOTAO_ID); });
        },
        'CM_ThoiGianDaoTao/LayDSDAOTAO_ThoiGianDaoTao': THOIGIAN,

        /* --- Danh mục dùng chung --- */
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLTC.NVAP': [
            dm('NV1', 'TINHPHI', 'Tính phí học kỳ'), dm('NV2', 'HOCLAI', 'Tính phí học lại'), dm('NV3', 'BOSUNG', 'Tính phí bổ sung')
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLSV.TRANGTHAI': [
            dm('TT1', 'DH', 'Đang học'), dm('TT2', 'BL', 'Bảo lưu'), dm('TT3', 'TN', 'Tốt nghiệp'), dm('TT4', 'TH', 'Thôi học')
        ],
        'CM_DanhMucDuLieu/LayDanhSach#QLSV.TRANGTHAI': [
            dm('TT1', 'DH', 'Đang học'), dm('TT2', 'BL', 'Bảo lưu'), dm('TT3', 'TN', 'Tốt nghiệp'), dm('TT4', 'TH', 'Thôi học')
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KHDT.DIEM.KIEUHOC': [
            dm('KH1', 'HOCDI', 'Học đi'), dm('KH2', 'HOCLAI', 'Học lại'), dm('KH3', 'NANGDIEM', 'Học nâng điểm')
        ],

        /* --- Nguồn theo nghiệp vụ / thời gian --- */
        'TC_TinhTien/LayDSKhoanPhiTheoNghiepVu': function (o) {
            return o.strNghiepVuApDung_Id ? [dm('KT1', 'HP', 'Học phí'), dm('KT2', 'HPHL', 'Học phí học lại')] : [];
        },
        'DKH_KeHoachDangKy/LayDSKeHoachTheoThoiGian': function (o) {
            return o.strDaoTao_ThoiGianDaoTao_Id ? [
                { ID: 'KHDK1', TEN: 'Đăng ký học chính thức HK1 2025-2026' },
                { ID: 'KHDK2', TEN: 'Đăng ký học bổ sung HK1 2025-2026' }
            ] : [];
        },

        /* --- Sinh viên --- */
        'TC_NguoiHoc_HoSo/LayDanhSach': function (o) {
            return SV.filter(function (s) { return inList(o.strLopHoc_Id, s.DAOTAO_LOPQUANLY_ID); })
                .map(function (s) { return { ID: s.QLSV_NGUOIHOC_ID, MASO: s.MASO, HODEM: s.HODEM, TEN: s.TEN }; });
        },
        'pkg_hosohocvien.LayDanhSachHoSoNhieuNganh': function (o) {
            var q = (o.strTuKhoa || '').toLowerCase();
            var all = SV.filter(function (s) {
                return inList(o.strLopQuanLy_Id, s.DAOTAO_LOPQUANLY_ID) && inList(o.strKhoaDaoTao_Id, s.DAOTAO_KHOADAOTAO_ID) &&
                    (!q || (s.QLSV_NGUOIHOC_MASO + ' ' + s.QLSV_NGUOIHOC_HOTEN).toLowerCase().indexOf(q) >= 0);
            });
            var from = ((o.pageIndex || 1) - 1) * (o.pageSize || 10);
            return { rows: all.slice(from, from + (o.pageSize || 10)), pager: all.length };
        },

        /* --- Kết quả tính phí --- */
        'TC_KetQuaDaTinhPhi/LayDanhSach': function () { return SV.map(kqTinChi); },
        'TC_KetQuaDaTinhPhi_ChuaKiemTra/LayDanhSach': function () { return SV.slice(0, 4).map(kqTinChi); },
        'TC_KetQuaDaTinhPhi_NC/LayDanhSach': function (o) {
            // Bản gốc dùng CHUNG action này cho danh sách niên chế và chi tiết một SV
            return o.strChuongTrinh_Id !== undefined ? CHITIET : SV.map(kqNienChe);
        },
        'TC_KetQuaDaTinhPhi_NC_ChuaKiemTra/LayDanhSach': function () { return SV.slice(2).map(kqNienChe); },

        /* --- Hàng đợi (CMS_HangDoiTuTao, dùng bởi ums.queue) --- */
        'CMS_HangDoiTuTao/LayDanhSach': function (o) {
            return [
                { ID: 'HD1', TEN: o.strLoaiNhiemVu, NGUOITHUCHIEN_TENDAYDU: 'Nguyễn Thị Lan', NGAYTAO_DD_MM_YYYY_HHMMSS: '15/09/2026 08:30:12', TONGDULIEUCANTHUCHIEN: 240, TONGDULIEUDAHOANTHANH: 240, TAICHINH_CACKHOANTHU_TEN: 'Học phí' },
                { ID: 'HD2', TEN: o.strLoaiNhiemVu, NGUOITHUCHIEN_TENDAYDU: 'Nguyễn Thị Lan', NGAYTAO_DD_MM_YYYY_HHMMSS: '18/09/2026 14:02:47', TONGDULIEUCANTHUCHIEN: 120, TONGDULIEUDAHOANTHANH: 45, TAICHINH_CACKHOANTHU_TEN: 'Học phí' }
            ];
        }
    });
})();
