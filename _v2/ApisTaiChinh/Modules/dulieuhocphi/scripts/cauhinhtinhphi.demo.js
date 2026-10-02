/* Dữ liệu mẫu cho cauhinhtinhphi — chỉ dùng ở chế độ dựng thử.
   Hệ / khoá / lớp / thời gian: xem _chung.demo.js */
(function () {
    'use strict';
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten }; }
    var CH = [
        ['CH1', 'Học kỳ 1 năm học 2025-2026', 'Học phí', 'Học đi', 'Tính phí học kỳ', 'CNTT 66A', 'Công nghệ thông tin', 'Khóa 2022 (K66)', 'Đại học chính quy'],
        ['CH2', 'Học kỳ 1 năm học 2025-2026', 'Học phí', 'Học đi', 'Tính phí học kỳ', 'CNTT 66B', 'Công nghệ thông tin', 'Khóa 2022 (K66)', 'Đại học chính quy'],
        ['CH3', 'Học kỳ 1 năm học 2025-2026', 'Học phí học lại', 'Học lại', 'Tính phí học lại', 'QTKD 66', 'Quản trị kinh doanh', 'Khóa 2022 (K66)', 'Đại học chính quy'],
        ['CH4', 'Học kỳ 2 năm học 2025-2026', 'Học phí', 'Học đi', 'Tính phí học kỳ', 'KT 67A', 'Kế toán', 'Khóa 2023 (K67)', 'Đại học chính quy']
    ].map(function (x) {
        return { ID: x[0], DAOTAO_THOIGIANDAOTAO: x[1], TAICHINH_CACKHOANTHU_TEN: x[2], KIEUHOC_TEN: x[3], NGHIEPVUAPDUNG_TEN: x[4],
            DAOTAO_LOPQUANLY_TEN: x[5], DAOTAO_CHUONGTRINH_TEN: x[6], DAOTAO_KHOADAOTAO_TEN: x[7], DAOTAO_HEDAOTAO_TEN: x[8] };
    });
    ums.demo.add({
        'TC_CauHinhTinhTuDong/LayDanhSach': function (o) {
            var from = ((o.pageIndex || 1) - 1) * (o.pageSize || 10);
            return { rows: CH.slice(from, from + (o.pageSize || 10)), pager: CH.length };
        },
        'KHCT_LopQuanLy/LayDanhSach': function (o) {
            var L = ums.demo.fixtures['pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy']({ strDaoTao_KhoaDaoTao_Id: o.strDaoTao_KhoaDaoTao_Id });
            var from = ((o.pageIndex || 1) - 1) * (o.pageSize || 10);
            return { rows: L.slice(from, from + (o.pageSize || 10)), pager: L.length };
        },
        'pkg_nhansu_hoso_v2.LayDanhSachToanBo': [
            { ID: 'BM1', MA: 'CNPM', TEN: 'Bộ môn Công nghệ phần mềm' },
            { ID: 'BM2', MA: 'HTTT', TEN: 'Bộ môn Hệ thống thông tin' },
            { ID: 'BM3', MA: 'KTTC', TEN: 'Bộ môn Kế toán tài chính' }
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KHCT.LOAILOP': [dm('LL1', 'CQ', 'Lớp chính quy'), dm('LL2', 'CLC', 'Lớp chất lượng cao')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KHCT.NHOMLOP': [dm('NL1', 'N1', 'Nhóm 1'), dm('NL2', 'N2', 'Nhóm 2')]
    });
})();
