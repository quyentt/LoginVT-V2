/* Dữ liệu mẫu cho sinhviennotien — chỉ dùng ở chế độ dựng thử.
   Khoản thu (TC_KhoanThu/LayDanhSach) lấy từ demo-data.js; học kỳ từ _chung_tracuu.js. */
(function () {
    'use strict';
    var T = ums.tcTraCuu;

    var HO = ['Nguyễn Văn', 'Trần Thị', 'Lê Hoàng', 'Phạm Minh', 'Vũ Thị Thu', 'Đỗ Quang', 'Ngô Thị', 'Bùi Văn', 'Hoàng Thị', 'Đinh Công'];
    var TEN = ['An', 'Bình', 'Cường', 'Đức', 'Hà', 'Huy', 'Lan', 'Nam', 'Mai', 'Sơn'];
    var LOP = ['CNTT K22A', 'KT K22B', 'QTKD K23', 'CNTT K23A'];
    var KHOAN = [['KT1', 'Học phí', 9800000], ['KT5', 'Phí ký túc xá', 1200000], ['KT2', 'Lệ phí thi lại', 250000]];
    var NO = [];
    for (var i = 0; i < 23; i++) {
        var kh = KHOAN[i % 3];
        NO.push({
            ID: 'NO' + (i + 1), TAICHINH_TONGHOPNOCHUNG_ID: 'THN' + (i + 1), QLSV_NGUOIHOC_ID: 'NH' + (i % 10),
            MASONGUOIHOC: 'SV22010' + String(10 + (i % 10)), HOTENNGUOIHOC: HO[i % 10] + ' ' + TEN[i % 10], LOP: LOP[i % 4],
            DAOTAO_THOIGIANDAOTAO: i % 4 ? 'Học kỳ 1 năm 2026-2027' : 'Học kỳ 2 năm 2025-2026',
            TAICHINH_CACKHOANTHU_ID: kh[0], TAICHINH_CACKHOANTHU_TEN: kh[1], SOTIEN: kh[2],
            EMAIL: i % 5 === 3 ? '' : 'sv22010' + (10 + (i % 10)) + '@st.truongmau.edu.vn'
        });
    }

    ums.demo.add({
        'pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTao': [
            { ID: 'HE1', TENHEDAOTAO: 'Đại học chính quy' },
            { ID: 'HE2', TENHEDAOTAO: 'Đại học vừa làm vừa học' }
        ],
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_KhoaDaoTao': [
            { ID: 'KH22', TENKHOA: 'Khoá 22 (2022-2026)' },
            { ID: 'KH23', TENKHOA: 'Khoá 23 (2023-2027)' }
        ],
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_ToChucCT': [
            { ID: 'CT1', TENCHUONGTRINH: 'Công nghệ thông tin' },
            { ID: 'CT2', TENCHUONGTRINH: 'Kế toán' },
            { ID: 'CT3', TENCHUONGTRINH: 'Quản trị kinh doanh' }
        ],
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy': LOP.map(function (l, i) { return { ID: 'L' + i, TEN: l }; }),
        'KHCT_NamNhapHoc/LayDanhSach': [{ NAMNHAPHOC: '2022' }, { NAMNHAPHOC: '2023' }, { NAMNHAPHOC: '2024' }, { NAMNHAPHOC: '2025' }],
        'KHCT_KhoaQuanLy/LayDanhSach': [
            { ID: 'KQL1', TEN: 'Khoa Công nghệ thông tin' },
            { ID: 'KQL2', TEN: 'Khoa Kinh tế' }
        ],
        'CM_DanhMucDuLieu/LayDanhSach#QLSV.TRANGTHAI': [
            { ID: 'TT1', TEN: 'Đang học' }, { ID: 'TT2', TEN: 'Bảo lưu' },
            { ID: 'TT3', TEN: 'Tạm ngừng học' }, { ID: 'TT4', TEN: 'Đã tốt nghiệp' }
        ],
        'TC_NguoiHoc/LayDSNguoiHocConNoTien': function (o) {
            var ks = String(o.strTAICHINH_CacKhoanThu_Ids || '').split(',');
            var rows = NO.filter(function (r) { return ks.indexOf(r.TAICHINH_CACKHOANTHU_ID) >= 0; });
            return T.demoPage(T.demoLike(rows, o.strTuKhoa, ['MASONGUOIHOC', 'HOTENNGUOIHOC']), o);
        },
        'TC_NguoiHoc/LayDSNguoiHoc': [{ ID: 'NH1' }, { ID: 'NH2' }, { ID: 'NH3' }, { ID: 'NH4' }, { ID: 'NH5' }]
    });
})();
