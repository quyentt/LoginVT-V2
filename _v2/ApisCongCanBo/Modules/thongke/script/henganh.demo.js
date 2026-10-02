/* Dữ liệu mẫu cho thongke/henganh. */
ums.demo.add({
    'KHCT_NamNhapHoc/LayDanhSach': [{ NAMNHAPHOC: '2024' }, { NAMNHAPHOC: '2025' }, { NAMNHAPHOC: '2026' }],
    'KHCT_ToChucChuongTrinh/LayNganhTheoHeDaoTao': function (o) { return o.strDaoTao_HeDaoTao_Id ? [{ ID: 'NG1', TENCHUONGTRINH: 'Công nghệ thông tin' }, { ID: 'NG2', TENCHUONGTRINH: 'Quản trị kinh doanh' }] : []; }
});
