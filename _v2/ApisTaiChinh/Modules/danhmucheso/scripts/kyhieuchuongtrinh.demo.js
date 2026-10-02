/* Dữ liệu mẫu cho kyhieuchuongtrinh — chỉ dùng ở chế độ dựng thử. */
(function () {
    var B = ums.dmhsB;
    B.demoChung();
    var ROWS = [
        { ID: 'KH1', DAOTAO_KHOADAOTAO_MAKHOA: 'K67', DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm', DAOTAO_CHUONGTRINH_MA: '7480103', KYHIEU: 'KTPM' },
        { ID: 'KH2', DAOTAO_KHOADAOTAO_MAKHOA: 'K67', DAOTAO_CHUONGTRINH_TEN: 'Quản trị kinh doanh', DAOTAO_CHUONGTRINH_MA: '7340101', KYHIEU: 'QTKD' },
        { ID: 'KH3', DAOTAO_KHOADAOTAO_MAKHOA: 'K68', DAOTAO_CHUONGTRINH_TEN: 'Kế toán', DAOTAO_CHUONGTRINH_MA: '7340301', KYHIEU: 'KT' },
        { ID: 'KH4', DAOTAO_KHOADAOTAO_MAKHOA: 'K68', DAOTAO_CHUONGTRINH_TEN: 'Công nghệ thông tin', DAOTAO_CHUONGTRINH_MA: '7480201', KYHIEU: 'CNTT' }
    ];
    var KHOA = { K67: 'K67', K68: 'K68', K69: 'K69' };
    var CT = { CT1: '7480103', CT2: '7340101', CT3: '7340301', CT4: '7480201' };
    ums.demo.add({
        'pkg_taichinh_ketoan.LayDSTC_BC_KyHieu_Khoa_Nganh': function (o) {
            return ROWS.filter(function (r) {
                return (!o.strDaoTao_KhoaDaoTao_Id || r.DAOTAO_KHOADAOTAO_MAKHOA === KHOA[o.strDaoTao_KhoaDaoTao_Id]) &&
                    (!o.strDaoTao_ChuongTrinh_Id || r.DAOTAO_CHUONGTRINH_MA === CT[o.strDaoTao_ChuongTrinh_Id]);
            });
        }
    });
})();
