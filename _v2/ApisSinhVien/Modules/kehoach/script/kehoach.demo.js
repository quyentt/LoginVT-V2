/* Dữ liệu mẫu cho Kế hoạch (kế hoạch nhập hồ sơ người học) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    function sv(id, ma, hd, ten, lop) {
        return { ID: 'PV' + id, QLSV_NGUOIHOC_ID: 'NH' + id, QLSV_NGUOIHOC_MASO: ma, QLSV_NGUOIHOC_HODEM: hd, QLSV_NGUOIHOC_TEN: ten,
            DAOTAO_LOPQUANLY_TEN: lop, DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67',
            DAOTAO_KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy' };
    }
    var x = {
        'SV_KeHoach_NguoiHoc/LayDanhSach': { rows: [
            { ID: 'KHN1', MOTA: 'Cập nhật hồ sơ sinh viên khóa 67 — học kỳ 1 năm học 2026-2027', TUNGAY: '01/09/2026', DENNGAY: '30/09/2026', KETQUACHINHTHUC: 1 },
            { ID: 'KHN2', MOTA: 'Bổ sung thông tin liên lạc, tài khoản ngân hàng', TUNGAY: '15/08/2026', DENNGAY: '31/10/2026', KETQUACHINHTHUC: 0 },
            { ID: 'KHN3', MOTA: 'Khai báo nơi ở ngoại trú năm học 2026-2027', TUNGAY: '05/09/2026', DENNGAY: '20/09/2026', KETQUACHINHTHUC: 1 }
        ], pager: 3 },
        'SV_KeHoach_NguoiHoc/ThemMoi': { rows: [], raw: { Id: 'KHN9' } },
        'SV_KeHoach_PhamVi/LayDanhSach': function (o) {
            var r = o.strQLSV_KeHoach_NguoiHoc_Id === 'KHN1'
                ? [sv(1, 'BIT220101', 'Nguyễn Văn', 'An', 'K67-KTPM1'), sv(2, 'BIT220102', 'Trần Thị', 'Bình', 'K67-KTPM1'), sv(3, 'BIT220117', 'Lê Minh', 'Châu', 'K67-KTPM2')]
                : [];
            return { rows: r, pager: r.length };
        },
        'SV_KeHoach_PhanQuyen/LayDanhSach': function (o) {
            return o.strQLSV_KeHoach_NguoiHoc_Id === 'KHN1' ? [
                { ID: 'PQ1', TRUONGTHONGTIN_ID: 'TTT1', MOTA: 'Số điện thoại cá nhân', THUTU: 1, DORONG: 4, BATBUOC: 1 },
                { ID: 'PQ2', TRUONGTHONGTIN_ID: 'TTT3', MOTA: 'Địa chỉ nơi ở hiện tại', THUTU: 2, DORONG: 12, BATBUOC: 0 }
            ] : [];
        },
        'PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc': function () {
            var r = [['NH11', 'BIT230210', 'Phạm Thu', 'Dung', 'K68-HTTT1'], ['NH12', 'BBA220561', 'Lê Minh', 'Châu', 'K67-QTKD2'], ['NH1', 'BIT220101', 'Nguyễn Văn', 'An', 'K67-KTPM1']]
                .map(function (a) {
                    return { ID: 'X' + a[0], QLSV_NGUOIHOC_ID: a[0], QLSV_NGUOIHOC_MASO: a[1], QLSV_NGUOIHOC_HODEM: a[2], QLSV_NGUOIHOC_TEN: a[3],
                        QLSV_NGUOIHOC_NGAYSINH: '02/01/2005', DAOTAO_LOPQUANLY_TEN: a[4], DAOTAO_LOPQUANLY_ID: 'L3', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CTKTPM',
                        DAOTAO_KHOADAOTAO_ID: 'K68', DAOTAO_CHUONGTRINH_TEN: 'Hệ thống thông tin', DAOTAO_KHOADAOTAO_TEN: 'Khóa 68',
                        DAOTAO_KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy',
                        QLSV_TRANGTHAINGUOIHOC_ID: 'TT1', QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học', ANH: '' };
                });
            return { rows: r, pager: r.length };
        }
    };
    x[D + 'QLSV.TRUONGTHONGTIN'] = [
        { ID: 'TTT1', MA: 'SDT', TEN: 'Số điện thoại', THONGTIN6: 'Liên lạc', CHUNG_TENDANHMUC_TEN: 'Trường thông tin' },
        { ID: 'TTT2', MA: 'EMAIL', TEN: 'Email cá nhân', THONGTIN6: 'Liên lạc', CHUNG_TENDANHMUC_TEN: 'Trường thông tin' },
        { ID: 'TTT3', MA: 'NOIO', TEN: 'Nơi ở hiện tại', THONGTIN6: 'Cư trú', CHUNG_TENDANHMUC_TEN: 'Trường thông tin' },
        { ID: 'TTT4', MA: 'STK', TEN: 'Số tài khoản ngân hàng', THONGTIN6: '', CHUNG_TENDANHMUC_TEN: 'Trường thông tin' },
        { ID: 'TTT5', MA: 'ANHCCCD', TEN: 'Ảnh căn cước công dân', THONGTIN6: 'Minh chứng', KIEUDULIEU: 'FILE', CHUNG_TENDANHMUC_TEN: 'Trường thông tin' }
    ];
    ums.demo.add(x);
})();
