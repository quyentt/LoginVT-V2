/* Dữ liệu mẫu cho Xác nhận kết quả — chỉ dùng ở chế độ dựng thử. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    var SV = [['PV1', 'NH1', 'K67KTPM1', 'BIT220101', 'Nguyễn Văn', 'An'], ['PV2', 'NH2', 'K67KTPM1', 'BIT220102', 'Trần Thị', 'Bình'],
        ['PV3', 'NH3', 'K67KTPM2', 'BIT220117', 'Lê Minh', 'Châu'], ['PV4', 'NH4', 'K68HTTT1', 'BIT230210', 'Phạm Thu', 'Dung']];
    var x = {
        'SV_KeHoach_NguoiHoc/LayDanhSach': [
            { ID: 'KHN1', MOTA: 'Cập nhật hồ sơ sinh viên khóa 67 — học kỳ 1 năm học 2026-2027', XACNHANTHONGTIN: 1 },
            { ID: 'KHN2', MOTA: 'Bổ sung thông tin liên lạc, tài khoản ngân hàng', XACNHANTHONGTIN: 0 }
        ],
        'SV_KeHoach_NguoiHoc/LayDSThongTinTheoKeHoach': [
            { ID: 'TTT1', TEN: 'Số điện thoại', KIEUDULIEU: 'TEXT' },
            { ID: 'TTT3', TEN: 'Nơi ở hiện tại', KIEUDULIEU: 'TEXT' },
            { ID: 'TTT5', TEN: 'Ảnh căn cước công dân', KIEUDULIEU: 'FILE' }
        ],
        'SV_KeHoach_PhamVi/LayDSQLSV_KeHoach_PhamVi_DL': function (o) {
            var r = SV.map(function (a) { return { ID: a[0], QLSV_NGUOIHOC_ID: a[1], DAOTAO_LOPQUANLY_MA: a[2], QLSV_NGUOIHOC_MASO: a[3],
                QLSV_NGUOIHOC_HODEM: a[4], QLSV_NGUOIHOC_TEN: a[5], QLSV_NGUOIHOC_NGAYSINH: '12/03/2004', QLSV_NGUOIHOC_GIOITINH_TEN: 'Nam' }; });
            return { rows: r.slice(0, Number(o.pageSize) || r.length), pager: r.length };
        },
        'SV_KeHoach_DuLieu/LayKQQLSV_KeHoach_DuLieu': function (o) {
            var n = o.strQLSV_NguoiHoc_Id;
            return [
                { QLSV_NGUOIHOC_ID: n, TRUONGTHONGTIN_ID: 'TTT1', TRUONGTHONGTIN_GIATRI_KQ: '09' + n.length + '8 123 45' + n.slice(-1), THONGTINXACMINH_KQ: '0912 345 678 (đã gọi xác minh)', KETQUAXACNHAN_TEN: n === 'NH1' ? 'Đã duyệt' : '' },
                { QLSV_NGUOIHOC_ID: n, TRUONGTHONGTIN_ID: 'TTT3', TRUONGTHONGTIN_GIATRI_KQ: 'Số 12 ngõ 45 Trần Duy Hưng, Cầu Giấy, Hà Nội', THONGTINXACMINH_KQ: 'Khớp sổ tạm trú', KETQUAXACNHAN_TEN: n === 'NH2' ? 'Yêu cầu bổ sung' : '' },
                { QLSV_NGUOIHOC_ID: n, TRUONGTHONGTIN_ID: 'TTT5', TRUONGTHONGTIN_GIATRI_KQ: 'cccd.jpg', KETQUAXACNHAN_TEN: '' }
            ];
        },
        'SV_Files/LayDanhSach': function (o) {
            return [{ ID: 'F' + o.strDuLieu_Id, FILEMINHCHUNG: 'SV/Files/' + o.strDuLieu_Id + '_cccd.jpg', TENHIENTHI: 'cccd_mat_truoc.jpg' }];
        },
        'CMS_Files/GopFile': { rows: 'Temp/GopFile_20260926.zip' },
        'PKG_HOSOSINHVIEN_IMPORT.LayDSKQImport_HoSo_TruongTT': [
            { QLSV_NGUOIHOC_MA: 'BIT220101', NGAYTAO_DD_MM_YYYY_HHMMSS: '26/09/2026 09:12:03', NGUOITHUCHIEN_TAIKHOAN: 'admin', TRUONGTHONGTIN_TEN: 'Số điện thoại', TRUONGTHONGTINDULIEU_GIATRI: '0912 345 678', ERR: '', QLSV_KEHOACH_NGUOIHOC_TEN: 'Cập nhật hồ sơ sinh viên khóa 67' },
            { QLSV_NGUOIHOC_MA: 'BIT22999', NGAYTAO_DD_MM_YYYY_HHMMSS: '26/09/2026 09:12:03', NGUOITHUCHIEN_TAIKHOAN: 'admin', TRUONGTHONGTIN_TEN: 'Số điện thoại', TRUONGTHONGTINDULIEU_GIATRI: '0987 000 111', ERR: 'Không tìm thấy mã người học', QLSV_KEHOACH_NGUOIHOC_TEN: '' }
        ]
    };
    x[D + 'QLSV.XACNHAN.SINHVIEN.NHAP.HOSO'] = [
        { ID: 'XN1', MA: 'DUYET', TEN: 'Duyệt', THONGTIN1: 'fa fa-check-circle', THONGTIN2: 'color: #16a34a', CHUNG_TENDANHMUC_TEN: 'Xác nhận hồ sơ' },
        { ID: 'XN2', MA: 'BOSUNG', TEN: 'Yêu cầu bổ sung', THONGTIN1: 'fa fa-reply', THONGTIN2: 'color: #d97706', CHUNG_TENDANHMUC_TEN: 'Xác nhận hồ sơ' },
        { ID: 'XN3', MA: 'TUCHOI', TEN: 'Từ chối', THONGTIN1: 'fa fa-times-circle', THONGTIN2: 'color: #dc2626', CHUNG_TENDANHMUC_TEN: 'Xác nhận hồ sơ' }
    ];
    x['KHCT_NamNhapHoc/LayDanhSach'] = [{ NAMNHAPHOC: '2022' }, { NAMNHAPHOC: '2023' }, { NAMNHAPHOC: '2024' }];
    x['pkg_kehoach_thongtin.LayDSKhoaQuanLy'] = [{ ID: 'KQL1', TEN: 'Khoa Công nghệ thông tin' }, { ID: 'KQL2', TEN: 'Khoa Kinh tế' }];
    ums.demo.add(x);
})();
