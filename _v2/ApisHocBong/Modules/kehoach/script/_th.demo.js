/* Dữ liệu mẫu chung của ums.hbTh (Tổng hợp, Phân bổ học bổng, Quản lý thông tin văn bằng) — chỉ dùng ở chế độ dựng thử.
   Hệ / Khoá / CT / Lớp (pkg_kehoach_thongtin.*) đã có trong demo-data.js. */
ums.demo.add({
    'HB_QuyHocBong/LayDanhSach': [
        { ID: 'QHB1', MA: 'KKHT', TEN: 'Quỹ học bổng khuyến khích học tập', MOTA: 'Trích từ nguồn thu học phí', HIEULUC: 1 },
        { ID: 'QHB2', MA: 'DNTT', TEN: 'Quỹ học bổng doanh nghiệp tài trợ', MOTA: 'Các doanh nghiệp đối tác', HIEULUC: 1 },
        { ID: 'QHB3', MA: 'VUOTKHO', TEN: 'Quỹ học bổng vượt khó', MOTA: 'Hỗ trợ sinh viên hoàn cảnh khó khăn', HIEULUC: 1 }
    ],
    'pkg_kehoach_thongtin.LayDSKhoaQuanLy': [
        { ID: 'KQL1', TEN: 'Khoa Công nghệ thông tin' }, { ID: 'KQL2', TEN: 'Khoa Kinh tế' }, { ID: 'KQL3', TEN: 'Khoa Ngoại ngữ' }
    ],
    'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao': [
        { ID: 'HK1', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm học 2025-2026' },
        { ID: 'HK2', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 năm học 2025-2026' }
    ],
    'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy': function (o) {
        var ds = [
            { ID: 'L1', MA: 'K67-KTPM1', TEN: 'K67 Kỹ thuật phần mềm 1', DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', CT: 'CTKTPM', K: 'K67' },
            { ID: 'L2', MA: 'K67-KTPM2', TEN: 'K67 Kỹ thuật phần mềm 2', DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', CT: 'CTKTPM', K: 'K67' },
            { ID: 'L3', MA: 'K67-QTKD1', TEN: 'K67 Quản trị kinh doanh 1', DAOTAO_CHUONGTRINH_TEN: 'Quản trị kinh doanh', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', CT: 'CTQTKD', K: 'K67' },
            { ID: 'L4', MA: 'K68-KTPM1', TEN: 'K68 Kỹ thuật phần mềm 1', DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm', DAOTAO_KHOADAOTAO_TEN: 'Khóa 68', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', CT: 'CTKTPM', K: 'K68' }
        ];
        return ds.filter(function (r) {
            return (!o.strDaoTao_KhoaDaoTao_Id || String(o.strDaoTao_KhoaDaoTao_Id).split(',').indexOf(r.K) >= 0) &&
                (!o.strDaoTao_ToChucCT_Id || String(o.strDaoTao_ToChucCT_Id).split(',').indexOf(r.CT) >= 0);
        });
    }
});
