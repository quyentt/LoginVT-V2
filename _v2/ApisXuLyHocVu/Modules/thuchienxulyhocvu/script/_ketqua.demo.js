/* Dữ liệu mẫu chung của Thực hiện xử lý học vụ / Tra cứu kết quả — chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {}, D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', AC = 'XLHV_KetQuaXuLy/';
    function dm(id, ma, ten, bang) { return { ID: id, MA: ma, TEN: ten, CHUNG_TENDANHMUC_TEN: bang }; }

    fx['pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao'] = [
        { ID: 'HK1', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm học 2025-2026' },
        { ID: 'HK2', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 năm học 2025-2026' }
    ];
    fx['pkg_kehoach_thongtin.LayDSKhoaQuanLy'] = [
        { ID: 'KQL1', TEN: 'Khoa Công nghệ thông tin' }, { ID: 'KQL2', TEN: 'Khoa Kinh tế' }
    ];
    fx['KHCT_NamNhapHoc/LayDanhSach'] = [{ NAMNHAPHOC: '2022' }, { NAMNHAPHOC: '2023' }, { NAMNHAPHOC: '2024' }];
    fx[D + 'XLHV.LOAIXULY'] = [dm('LXL1', 'CANHBAO', 'Cảnh báo học vụ', 'Loại xử lý'),
        dm('LXL2', 'BUOCTHOIHOC', 'Buộc thôi học', 'Loại xử lý')];
    var MUC = [dm('MXL1', 'M1', 'Cảnh báo mức 1', 'Mức xử lý'), dm('MXL2', 'M2', 'Cảnh báo mức 2', 'Mức xử lý'),
        dm('MXL3', 'M3', 'Cảnh báo mức 3', 'Mức xử lý'), dm('MXL4', 'BTH', 'Buộc thôi học', 'Mức xử lý')];
    fx[D + 'XLHV.MUCXULY'] = MUC;
    fx['XLHV_KeHoachXuLy/LayDanhSach'] = [
        { ID: 'KH1', TEN: 'Xét cảnh báo học vụ học kỳ 1 năm học 2025-2026' },
        { ID: 'KH2', TEN: 'Xét buộc thôi học năm học 2024-2025' }
    ];

    var SV = [
        ['XL01', 'SV20001', 'Nguyễn Văn', 'An', 'K67-KTPM1', 'Đang học', 'MXL1', '', ''],
        ['XL02', 'SV20014', 'Trần Thị', 'Bình', 'K67-KTPM1', 'Đang học', 'MXL2', 'Đã bổ sung điểm học kỳ phụ', 'Lê Thu Hà'],
        ['XL03', 'SV20027', 'Lê Hoàng', 'Cường', 'K67-QTKD2', 'Đang học', 'MXL1', '', ''],
        ['XL04', 'SV20031', 'Phạm Thu', 'Dung', 'K67-QTKD2', 'Bảo lưu', 'MXL3', '', ''],
        ['XL05', 'SV21008', 'Hoàng Minh', 'Đức', 'K68-HTTT1', 'Đang học', 'MXL2', '', ''],
        ['XL06', 'SV21019', 'Vũ Ngọc', 'Hà', 'K68-HTTT1', 'Đang học', 'MXL4', 'Xét lại theo đơn đề nghị', 'Lê Thu Hà'],
        ['XL07', 'SV21022', 'Đặng Quốc', 'Huy', 'K68-HTTT1', 'Đang học', 'MXL1', '', ''],
        ['XL08', 'SV21035', 'Bùi Thanh', 'Lam', 'K68-HTTT1', 'Tạm ngừng học', 'MXL2', '', ''],
        ['XL09', 'SV21040', 'Ngô Bảo', 'Ngọc', 'K68-HTTT1', 'Đang học', 'MXL1', '', ''],
        ['XL10', 'SV21052', 'Đỗ Gia', 'Phúc', 'K68-HTTT1', 'Đang học', 'MXL3', '', ''],
        ['XL11', 'SV21066', 'Mai Anh', 'Quân', 'K68-HTTT1', 'Đang học', 'MXL1', '', ''],
        ['XL12', 'SV21071', 'Lý Hải', 'Sơn', 'K68-HTTT1', 'Đang học', 'MXL2', '', '']
    ];
    function tenMuc(id) { var m = MUC.filter(function (x) { return x.ID === id; })[0]; return m ? m.TEN : ''; }
    var ROWS = SV.map(function (x) {
        var k68 = x[4].indexOf('K68') === 0;
        return { ID: x[0], QLSV_NGUOIHOC_ID: 'NH' + x[0], QLSV_NGUOIHOC_MASO: x[1], QLSV_NGUOIHOC_HODEM: x[2],
            QLSV_NGUOIHOC_TEN: x[3], DAOTAO_LOPQUANLY_TEN: x[4], DAOTAO_LOPQUANLY_ID: 'L' + x[4],
            DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', DAOTAO_KHOADAOTAO_TEN: k68 ? 'Khóa 68' : 'Khóa 67',
            DAOTAO_CHUONGTRINH_TEN: x[4].indexOf('QTKD') > 0 ? 'Quản trị kinh doanh' : 'Kỹ thuật phần mềm',
            DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1', DAOTAO_THOIGIANDAOTAO_ID: 'HK1', QLSV_TRANGTHAINGUOIHOC_TEN: x[5],
            MUCXULY_ID: x[6], MUCXULY_TEN: tenMuc(x[6]), LOAIXULY_ID: 'LXL1',
            MUCXULY_THAYDOI_LYDO: x[7], MUCXULY_THAYDOI_CANBO: x[8],
            XLHV_KEHOACHXULY_ID: 'KH1', XLHV_KEHOACHXULY_TEN: 'Điểm TBC học kỳ dưới 1,0 (thang 4)' };
    });
    fx[AC + 'LayDanhSach'] = function (o) {
        var q = String(o.strTuKhoa || '').toLowerCase();
        var rs = ROWS.filter(function (r) {
            return !q || (r.QLSV_NGUOIHOC_MASO + ' ' + r.QLSV_NGUOIHOC_HODEM + ' ' + r.QLSV_NGUOIHOC_TEN).toLowerCase().indexOf(q) >= 0;
        });
        var sz = Number(o.pageSize) || 10, pi = Number(o.pageIndex) || 1;
        return { rows: {
            rsThongTinNguoiHoc: rs.slice((pi - 1) * sz, pi * sz),
            rsCotThongSoXuLy: [
                { TUKHOA: 'DIEMTBCHK', TENTUKHOA: 'Điểm TBC học kỳ' },
                { TUKHOA: 'DIEMTBCTL', TENTUKHOA: 'Điểm TBC tích lũy' },
                { TUKHOA: 'SOTCNO', TENTUKHOA: 'Số tín chỉ nợ' }
            ] }, pager: rs.length };
    };
    fx[AC + 'LayDuLieuTuKhoaKetQuaXuLy'] = function (o) {
        var n = Number(String(o.strQLSV_NguoiHoc_Id).replace(/\D/g, '')) || 1;
        var v = o.strTuKhoa === 'SOTCNO' ? String((n * 3) % 17) :
            o.strTuKhoa === 'DIEMTBCHK' ? (0.4 + (n % 7) * 0.12).toFixed(2) : (1.2 + (n % 5) * 0.15).toFixed(2);
        return [{ KETQUA: v }];
    };
    fx[AC + 'CapNhat'] = function (o) {
        ROWS.forEach(function (r) {
            if (r.ID !== o.strId) return;
            // như máy chủ: MUCXULY_TEN giữ mức tự động, mức điều chỉnh ở MUCXULY_THAYDOI_*
            r.MUCXULY_THAYDOI_ID = o.strMucXuLy_Moi_Id; r.MUCXULY_THAYDOI_TEN = tenMuc(o.strMucXuLy_Moi_Id);
            r.MUCXULY_THAYDOI_LYDO = o.strMucXuLy_LyDo; r.MUCXULY_THAYDOI_CANBO = 'Nguyễn Thị Lan';
        });
        return [];
    };
    fx['XLHV_HangDoi/TaoHangDoi_XLHV_TuDong'] = [];
    ums.demo.add(fx);
})();
