/* Dữ liệu mẫu dùng chung nhóm thống kê / báo cáo Nhập học (ums.nhTk) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var KH = [
        { ID: 'NHKH1', TENKEHOACH: 'Thu học phí sinh viên nhập học 2025-2026', NGAYBATDAU: '15/08/2025', NGAYKETTHUC: '30/09/2025',
          DAOTAO_KHOADAOTAO_ID: 'K67', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67' },
        { ID: 'NHKH2', TENKEHOACH: 'Nhập học bổ sung đợt 2 năm 2025', NGAYBATDAU: '01/10/2025', NGAYKETTHUC: '20/10/2025',
          DAOTAO_KHOADAOTAO_ID: 'K67', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67' },
        { ID: 'NHKH3', TENKEHOACH: 'Thu học phí sinh viên nhập học 2024-2025', NGAYBATDAU: '12/08/2024', NGAYKETTHUC: '25/09/2024',
          DAOTAO_KHOADAOTAO_ID: 'K68', DAOTAO_KHOADAOTAO_TEN: 'Khóa 68' }
    ];
    ums.demo.add({
        'PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc': KH,
        'pkg_kehoach_thongtin.LayDSDaoTao_CoSoDaoTao': [{ ID: 'CS1', TEN: 'Cơ sở chính — Hà Nội' }, { ID: 'CS2', TEN: 'Phân hiệu Đồng Nai' }],
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_ToChucCT': function (o) {
            return o.strDaoTao_KhoaDaoTao_Id === 'K68'
                ? [{ ID: 'CTHTTT', TENCHUONGTRINH: 'Hệ thống thông tin' }]
                : [{ ID: 'CTKTPM', TENCHUONGTRINH: 'Kỹ thuật phần mềm' }, { ID: 'CTQTKD', TENCHUONGTRINH: 'Quản trị kinh doanh' }];
        },
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy': function (o) {
            var m = { CTKTPM: [{ ID: 'L1', TEN: 'K67-KTPM1' }, { ID: 'L4', TEN: 'K67-KTPM2' }], CTQTKD: [{ ID: 'L2', TEN: 'K67-QTKD2' }],
                      CTHTTT: [{ ID: 'L3', TEN: 'K68-HTTT1' }] };
            return m[o.strDaoTao_ToChucCT_Id] || [];
        }
    });
})();
