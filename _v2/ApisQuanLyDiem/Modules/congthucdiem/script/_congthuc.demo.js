/* Dữ liệu mẫu dùng chung cho hinhthucthi, hocphan (Quản lý điểm) — chỉ dùng ở chế độ dựng thử.
   Bộ môn (pkg_nhansu_hoso_v2.LayDanhSachToanBo) dùng dữ liệu mẫu chung của demo-data.js. */
(function () {
    var HP = [
        ['HP01', 'INT1001', 'Nhập môn lập trình', 3, 'Bộ môn Hệ thống thông tin', 'MH1', 'CC2'],
        ['HP02', 'INT1002', 'Cấu trúc dữ liệu và giải thuật', 3, 'Bộ môn Hệ thống thông tin', 'MH2', 'CC2'],
        ['HP03', 'INT2003', 'Cơ sở dữ liệu', 3, 'Bộ môn Hệ thống thông tin', 'MH3', 'CC2'],
        ['HP04', 'ECO1001', 'Kinh tế vi mô', 2, 'Khoa Kinh tế', 'MH4', 'CC3'],
        ['HP05', 'ECO1002', 'Kinh tế vĩ mô', 2, 'Khoa Kinh tế', 'MH5', 'CC3'],
        ['HP06', 'MAT1001', 'Giải tích 1', 4, 'Khoa Công nghệ thông tin', 'MH6', 'CC1'],
        ['HP07', 'MAT1002', 'Đại số tuyến tính', 3, 'Khoa Công nghệ thông tin', 'MH7', 'CC1']
    ].map(function (x) { return { ID: x[0], MA: x[1], TEN: x[2], HOCTRINH: x[3], THUOCBOMON_TEN: x[4], MONHOC_ID: x[5], BOMON_ID: x[6] }; });
    function dsHP(o) {
        var q = String(o.strTuKhoa || '').toLowerCase();
        var ds = HP.filter(function (h) {
            return (!q || (h.MA + ' ' + h.TEN).toLowerCase().indexOf(q) >= 0) &&
                (!o.strThuocBoMon_Id || h.BOMON_ID === o.strThuocBoMon_Id) &&
                (!o.strDaoTao_MonHoc_Id || h.MONHOC_ID === o.strDaoTao_MonHoc_Id);
        });
        var size = Number(o.pageSize) || 10, i = Number(o.pageIndex) || 1;
        return { rows: ds.slice((i - 1) * size, i * size), pager: ds.length };
    }
    ums.demo.add({
        'KHCT_MonHoc/LayDanhSach': function (o) {
            return HP.filter(function (h) { return !o.strThuocBoMon_Id || h.BOMON_ID === o.strThuocBoMon_Id; })
                .map(function (h) { return { ID: h.MONHOC_ID, MA: h.MA, TEN: h.TEN }; });
        },
        'KHCT_ThoiGianDaoTao/LayDanhSach': [
            { ID: 'TG1', DAOTAO_THOIGIANDAOTAO: '2025_2026_1' }, { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: '2025_2026_2' },
            { ID: 'TG3', DAOTAO_THOIGIANDAOTAO: '2026_2027_1' }
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KHCT.TTHP': [
            { ID: 'TT1', MA: 'BB', TEN: 'Bắt buộc' }, { ID: 'TT2', MA: 'TC', TEN: 'Tự chọn' }, { ID: 'TT3', MA: 'DK', TEN: 'Điều kiện' }
        ],
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_HocPhan': dsHP,
        'PKG_KEHOACH_THONGTIN2.LayDSKS_DaoTao_HocPhan': function (o) {
            var r = dsHP(o);
            if (Number(o.dMonChuaKhaiCongThuc) === 1) { r.rows = r.rows.filter(function (h, i) { return i % 2; }); r.pager = r.rows.length; }
            return r;
        }
    });
})();
