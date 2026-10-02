/* Dữ liệu mẫu cho phancongchuongtrinh — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    var KH = [
        { ID: 'KHDK1', MAKEHOACH: 'DK2025-1', TENKEHOACH: 'Đăng ký học kỳ 1 năm học 2025-2026', DAOTAO_THOIGIANDAOTAO_NAM: '2025-2026', DAOTAO_THOIGIANDAOTAO_KY: '1', DAOTAO_THOIGIANDAOTAO_DOT: '1' },
        { ID: 'KHDK2', MAKEHOACH: 'DK2025-2', TENKEHOACH: 'Đăng ký học kỳ 2 năm học 2025-2026', DAOTAO_THOIGIANDAOTAO_NAM: '2025-2026', DAOTAO_THOIGIANDAOTAO_KY: '2', DAOTAO_THOIGIANDAOTAO_DOT: '1' },
        { ID: 'KHDK3', MAKEHOACH: 'DKHE2026', TENKEHOACH: 'Đăng ký học kỳ hè 2026', DAOTAO_THOIGIANDAOTAO_NAM: '2025-2026', DAOTAO_THOIGIANDAOTAO_KY: '3', DAOTAO_THOIGIANDAOTAO_DOT: '1' },
        { ID: 'KHDK4', MAKEHOACH: 'DK2024-2', TENKEHOACH: 'Đăng ký học kỳ 2 năm học 2024-2025', DAOTAO_THOIGIANDAOTAO_NAM: '2024-2025', DAOTAO_THOIGIANDAOTAO_KY: '2', DAOTAO_THOIGIANDAOTAO_DOT: '2' }
    ];
    var CT = [
        ['CTKTPM67', 'KTPM-K67', 'Kỹ thuật phần mềm', 'Khóa 67'], ['CTHTTT67', 'HTTT-K67', 'Hệ thống thông tin', 'Khóa 67'],
        ['CTQTKD67', 'QTKD-K67', 'Quản trị kinh doanh', 'Khóa 67'], ['CTKTPM68', 'KTPM-K68', 'Kỹ thuật phần mềm', 'Khóa 68'],
        ['CTKT68', 'KT-K68', 'Kế toán', 'Khóa 68'], ['CTNNA68', 'NNA-K68', 'Ngôn ngữ Anh', 'Khóa 68']
    ].map(function (x) { return { ID: x[0], MACHUONGTRINH: x[1], TENCHUONGTRINH: x[2], DAOTAO_KHOADAOTAO_TEN: x[3] }; });
    var DA = {
        KHDK1: [CT[0], CT[1], CT[2]].map(function (c, i) {
            return { ID: 'PCCT' + (i + 1), DANGKY_KEHOACHDANGKY_ID: 'KHDK1', DAOTAO_CHUONGTRINH_ID: c.ID, MACHUONGTRINH: c.MACHUONGTRINH,
                TENCHUONGTRINH: c.TENCHUONGTRINH, DAOTAO_KHOADAOTAO_TEN: c.DAOTAO_KHOADAOTAO_TEN, TENKEHOACH: 'Đăng ký học kỳ 1 năm học 2025-2026' };
        })
    };
    function like(rows, q, cols) {
        q = String(q || '').toLowerCase();
        return q ? rows.filter(function (r) { return cols.some(function (c) { return String(r[c] || '').toLowerCase().indexOf(q) >= 0; }); }) : rows;
    }
    ums.demo.add({
        'DKH_KeHoachDangKy/LayDanhSach': function (o) { return like(KH, o.strTuKhoa, ['TENKEHOACH', 'MAKEHOACH']); },
        'KHCT_ToChucChuongTrinh/LayDanhSach': CT,
        'DKH_PhanCong_ChuongTrinh/LayDanhSach': function (o) { return DA[o.strDangKy_KeHoachDangKy_Id] || []; },
        'DKH_PhanCong_ChuongTrinh/ThemMoi': { rows: [], raw: { Id: 'PCCTNEW' } },
        'DKH_PhanCong_ChuongTrinh/Xoa': [],
        'KHCT_NamHoc/LayDanhSach': [{ ID: 'NH2526', NAMHOC: '2025-2026' }, { ID: 'NH2425', NAMHOC: '2024-2025' }],
        'KHCT_ThoiGianDaoTao/LayDanhSach': function (o) {
            return o.strDAOTAO_NAM_Id ? [{ ID: o.strDAOTAO_NAM_Id + '-1', HOCKY: '1' }, { ID: o.strDAOTAO_NAM_Id + '-2', HOCKY: '2' }, { ID: o.strDAOTAO_NAM_Id + '-3', HOCKY: '3' }] : [];
        },
        'KHCT_DotHoc/LayDanhSach_RutGon': function (o) {
            return o.strDaoTao_HocKy_Id ? [{ ID: o.strDaoTao_HocKy_Id + '-D1', DOTHOC: '1' }, { ID: o.strDaoTao_HocKy_Id + '-D2', DOTHOC: '2' }] : [];
        }
    });
})();
