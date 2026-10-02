/* Dữ liệu mẫu dùng chung module Phân lớp (nhập học) — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    ums.demo.add({
        'PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc': [
            { ID: 'KHNH2026', TENKEHOACH: 'Nhập học Đại học chính quy khóa 2026', MA: 'NH2026', DAOTAO_KHOADAOTAO_ID: 'K68' },
            { ID: 'KHNH2025', TENKEHOACH: 'Nhập học Đại học chính quy khóa 2025', MA: 'NH2025', DAOTAO_KHOADAOTAO_ID: 'K67' }
        ],
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy': function (o) {
            var ds = [
                { ID: 'L68KT1', TEN: 'K68-KTPM1', MA: 'K68KTPM1', SOLUONGTHUCTE: 38, SOLUONGKEHOACH: 45, CT: 'CTKTPM', KHOA: 'K68' },
                { ID: 'L68KT2', TEN: 'K68-KTPM2', MA: 'K68KTPM2', SOLUONGTHUCTE: 41, SOLUONGKEHOACH: 45, CT: 'CTKTPM', KHOA: 'K68' },
                { ID: 'L68QT1', TEN: 'K68-QTKD1', MA: 'K68QTKD1', SOLUONGTHUCTE: 50, SOLUONGKEHOACH: 50, CT: 'CTQTKD', KHOA: 'K68' },
                { ID: 'L67KT1', TEN: 'K67-KTPM1', MA: 'K67KTPM1', SOLUONGTHUCTE: 44, SOLUONGKEHOACH: 45, CT: 'CTKTPM', KHOA: 'K67' }
            ];
            return ds.filter(function (r) {
                return (!o.strDaoTao_ToChucCT_Id || r.CT === o.strDaoTao_ToChucCT_Id) &&
                    (!o.strDaoTao_KhoaDaoTao_Id || r.KHOA === o.strDaoTao_KhoaDaoTao_Id);
            });
        }
    });
})();
