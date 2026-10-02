/* Dữ liệu mẫu cho Số tín kế hoạch — chỉ dùng ở chế độ dựng thử. */
(function () {
    var ROWS = [
        { ID: 'ST1', PHAMVIAPDUNG_TEN: 'Khóa 67 - Kỹ thuật phần mềm', PHANCAPPHAMVI_TEN: 'Chương trình', THOIGIAN: 'Học kỳ 1 năm học 2025-2026', SOQUYDINH: 15 },
        { ID: 'ST2', PHAMVIAPDUNG_TEN: 'Khóa 67 - Quản trị kinh doanh', PHANCAPPHAMVI_TEN: 'Chương trình', THOIGIAN: 'Học kỳ 1 năm học 2025-2026', SOQUYDINH: 14 },
        { ID: 'ST3', PHAMVIAPDUNG_TEN: 'Khóa 68', PHANCAPPHAMVI_TEN: 'Khóa học', THOIGIAN: 'Học kỳ 1 năm học 2025-2026', SOQUYDINH: 16 },
        { ID: 'ST4', PHAMVIAPDUNG_TEN: 'K68 Kỹ thuật phần mềm 1', PHANCAPPHAMVI_TEN: 'Lớp', THOIGIAN: 'Học kỳ 1 năm học 2025-2026', SOQUYDINH: null }
    ];
    ums.demo.add({
        'pkg_hocbong_thongtin.LayDSHB_QuyHocBong': [
            { ID: 'QHB1', TEN: 'Quỹ học bổng khuyến khích học tập' },
            { ID: 'QHB2', TEN: 'Quỹ học bổng doanh nghiệp tài trợ' }
        ],
        'pkg_hocbong_chung.LayDSThoiGianTheoKeHoach': [
            { ID: 'HK1', THOIGIAN: 'Học kỳ 1 năm học 2025-2026' },
            { ID: 'HK2', THOIGIAN: 'Học kỳ 2 năm học 2025-2026' }
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#HB.QUYTAC.TINHSOTINCHITOITHIEU': [
            { ID: 'QT1', MA: 'CTDT', TEN: 'Theo chương trình đào tạo', CHUNG_TENDANHMUC_TEN: 'Quy tắc tính số tín chỉ tối thiểu' },
            { ID: 'QT2', MA: 'CODINH', TEN: 'Số tín cố định mỗi học kỳ', CHUNG_TENDANHMUC_TEN: 'Quy tắc tính số tín chỉ tối thiểu' }
        ],
        'pkg_hocbong_thongtin.LayDSHB_QuyDinh_SoTinChi': function (o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            var rs = ROWS.filter(function (r) { return !q || r.PHAMVIAPDUNG_TEN.toLowerCase().indexOf(q) >= 0; });
            return { rows: rs, pager: rs.length };
        },
        'pkg_hocbong_thongtin.Sua_HB_QuyDinh_SoTinDangKy': function (o) {
            ROWS.forEach(function (r) { if (r.ID === o.strId) r.SOQUYDINH = o.dSoQuyDinh; });
            return [];
        },
        'pkg_hocbong_tinhtoan.KhoiTaoDuLieuTinhSoTinChi': []
    });
})();
