/* Dữ liệu mẫu dùng chung của module nguoidung (ApisCMS) — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function khongDau(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd'); }
    function trang(rows, o) {
        var q = khongDau(o.strTuKhoa);
        if (q) rows = rows.filter(function (r) { return khongDau(r.TENDAYDU + ' ' + r.TAIKHOAN + ' ' + r.EMAIL).indexOf(q) >= 0; });
        var n = rows.length, sz = Number(o.pageSize) || 10, p = Number(o.pageIndex) || 1;
        return { rows: rows.slice((p - 1) * sz, p * sz), pager: n };
    }

    var ND = [
        ['U01', 'nvhung', 'Nguyễn Văn Hùng', 'hungnv@ums.edu.vn', '0912345678', 'Khoa Công nghệ thông tin', 'CC1', 'CANBO', '15/09/2026'],
        ['U02', 'ttmai', 'Trần Thị Mai', 'maitt@ums.edu.vn', '0987654321', 'Phòng Đào tạo', 'CC4', 'CANBO', '20/09/2026'],
        ['U03', 'lqminh', 'Lê Quang Minh', 'minhlq@ums.edu.vn', '0903111222', 'Khoa Kinh tế', 'CC3', 'CANBO', '11/09/2026'],
        ['U04', 'BIT220263', 'Phạm Thu Hà', 'bit220263@st.ums.edu.vn', '0868123456', '', '', 'SINHVIEN', '24/09/2026'],
        ['U05', 'BBA220561', 'Đỗ Minh Châu', 'bba220561@st.ums.edu.vn', '0335789456', '', '', 'SINHVIEN', '23/09/2026'],
        ['U06', 'phhuy', 'Phụ huynh Nguyễn Văn Huy', 'huynv.ph@gmail.com', '0977001122', '', '', 'GIADINH', ''],
        ['U07', 'vtdoan', 'Vũ Thị Đoan', 'doanvt@ums.edu.vn', '0944556677', 'Bộ môn Hệ thống thông tin', 'CC2', 'CANBO', '19/09/2026'],
        ['U08', 'hoangnam', 'Hoàng Văn Nam', 'namhv@ums.edu.vn', '0911223344', 'Phòng Đào tạo', 'CC4', 'CANBO', '02/09/2026'],
        ['U09', 'dtfpt', 'Công ty FPT Software', 'hr@fpt.com.vn', '02437689048', '', '', 'DOITAC', ''],
        ['U10', 'ngthlan', 'Nguyễn Thị Lan', 'lannt@ums.edu.vn', '0909998877', 'Khoa Công nghệ thông tin', 'CC1', 'CANBO', '22/09/2026'],
        ['U11', 'BIT190112', 'Trịnh Văn Long', 'bit190112@alumni.ums.edu.vn', '0355123987', '', '', 'CUUSINHVIEN', '01/06/2026'],
        ['U12', 'bqtuan', 'Bùi Quốc Tuấn', 'tuanbq@ums.edu.vn', '0913456789', 'Khoa Kinh tế', 'CC3', 'CANBO', '21/09/2026']
    ].map(function (x) {
        return { ID: x[0], TAIKHOAN: x[1], TENDAYDU: x[2], EMAIL: x[3], SODIENTHOAI: x[4], TENDONVI: x[5], CHUNG_DONVI_ID: x[6],
                 PHANLOAI: x[7], NGAYCN_GAN_DD_MM_YYYY: x[8], HINHDAIDIEN: '', THOIHANPHAIDOIMATKHAU: 90, TRANGTHAI: 1, DIACHI: 'Hà Nội' };
    });

    var UD = [
        { ID: 'APP1', MAUNGDUNG: 'ApisTaiChinh', TENUNGDUNG: 'Tài chính' },
        { ID: 'APP2', MAUNGDUNG: 'ApisCMS', TENUNGDUNG: 'Quản trị hệ thống' },
        { ID: 'APP3', MAUNGDUNG: 'ApisCongCanBo', TENUNGDUNG: 'Cổng cán bộ' }
    ];
    function cn(id, app, cha, ten) { return { ID: id, CHUNG_UNGDUNG_ID: app, CHUCNANGCHA_ID: cha, TENCHUCNANG: ten, MACHUCNANG: id }; }
    var CN = {
        APP1: [cn('F11', 'APP1', null, 'Danh mục hệ số'), cn('F12', 'APP1', 'F11', 'Khoản thu'), cn('F13', 'APP1', 'F11', 'Tài khoản nợ'),
               cn('F14', 'APP1', null, 'Phiếu thu'), cn('F15', 'APP1', 'F14', 'Thu tiền'), cn('F16', 'APP1', 'F14', 'Tra cứu số phiếu thu')],
        APP2: [cn('F21', 'APP2', null, 'Người dùng'), cn('F22', 'APP2', 'F21', 'Quản lý người dùng'), cn('F23', 'APP2', 'F21', 'Người dùng - vai trò'),
               cn('F24', 'APP2', null, 'Vai trò'), cn('F25', 'APP2', 'F24', 'Quản lý vai trò')],
        APP3: [cn('F31', 'APP3', null, 'Hồ sơ cá nhân'), cn('F32', 'APP3', 'F31', 'Quá trình công tác'), cn('F33', 'APP3', null, 'Lịch giảng')]
    };
    /* Quyền chức năng đang có của từng người (theo ID chức năng) — sửa được khi thử Lưu */
    var CO = { U01: ['F11', 'F12', 'F14', 'F15', 'F31', 'F32'], U02: ['F21', 'F22', 'F23'], U07: ['F33'] };
    function tatCaCN() { return CN.APP1.concat(CN.APP2, CN.APP3); }

    ums.demo.add({
        'pkg_chung_quanlynguoidung.LayDanhSachNguoiDung': function (o) {
            var rows = o.strPhanLoaiDoiTuong ? ND.filter(function (r) { return r.PHANLOAI === o.strPhanLoaiDoiTuong; }) : ND;
            return trang(rows, o);
        },
        'pkg_chung_quanlynguoidung2.LayDanhSachNguoiDungQuanLy': function (o) {
            var rows = ND.filter(function (r) { return r.PHANLOAI === 'CANBO'; });
            if (o.strUngDung_Id === 'APP2') rows = rows.slice(0, 2);
            return trang(rows, o);
        },
        'pkg_chung_quanlynguoidung.LayDanhSachUngDung': UD,
        'pkg_chung_laythongtinquyen.LayDSUngDungTheoNguoiDung_Id': UD.slice(0, 2),
        'CMS_Quyen/LayDSChucNangTheoNguoiDung_Id': function (o) {
            var co = CO[o.strNguoiDung_Id] || [];
            return tatCaCN().filter(function (r) { return co.indexOf(r.ID) >= 0; });
        },
        'pkg_chung_quanlynguoidung.LayDanhSachChucNang': function (o) { return (CN[o.strChung_UngDung_Id] || []).slice(); },
        'CMS_QuanLyNguoiDung/ThemNguoiDungChucNang': function (o) { (CO[o.strNguoiDung_Id] = CO[o.strNguoiDung_Id] || []).push(o.strChucNang_Id); return []; },
        'CMS_NguoiDungChucNang/ThemMoi': function (o) { (CO[o.strNguoiDung_Id] = CO[o.strNguoiDung_Id] || []).push(o.strChucNang_Id); return []; },
        'CMS_QuanLyNguoiDung/XoaChucNangTheoNguoiDung': function (o) {
            CO[o.strNguoiDung_Id] = (CO[o.strNguoiDung_Id] || []).filter(function (x) { return x !== o.strUngDung_Id; }); return [];
        },
        'CMS_NguoiDungChucNang/XoaChucNangTheoNguoiDung': function (o) {
            CO[o.strNguoiDung_Id] = (CO[o.strNguoiDung_Id] || []).filter(function (x) { return x !== o.strUngDung_Id; }); return [];
        },
        'pkg_chung_quanlynguoidung2.Them_Chung_NguoiDung_QuanLy': [],
        'pkg_chung_quanlynguoidung2.Xoa_Chung_NguoiDung_QuanLy1': []
    });

    /* Vai trò (nguoidungvaitro) */
    var VT = [
        { ID: 'R33', TENVAITRO: 'Tài chính - Kế toán' }, { ID: 'R44', TENVAITRO: 'Quản trị hệ thống' },
        { ID: 'R02', TENVAITRO: 'Cổng cán bộ' }, { ID: 'R07', TENVAITRO: 'Chuyên cần' }, { ID: 'R04', TENVAITRO: 'Cổng sinh viên - thủ vai' }
    ];
    var VT_CO = { U01: ['R33', 'R02'], U02: ['R44'], U03: ['R02'] };
    ums.demo.add({
        'pkg_chung_quanlynguoidung.LayDanhSachVaiTro': { rows: VT, pager: VT.length },
        'PKG_CORE_QUANTRI_01.LayDSVaiTroNguoiDung': function (o) {
            var co = VT_CO[o.strNguoiThucHien_Id] || [];
            return VT.filter(function (r) { return co.indexOf(r.ID) >= 0; });
        },
        'PKG_CORE_QUANTRI_01.LayDSChucNangNguoiDung': function (o) {
            var m = { R33: CN.APP1, R44: CN.APP2, R02: CN.APP3 }[o.strVaiTro_Id] || [];
            return { rs: m.map(function (r, i) {
                return { ID: r.ID, MACHUCNANG: 'CN.' + r.ID, TENCHUCNANG: r.TENCHUCNANG, CHUNG_UNGDUNG: ({ APP1: 'Tài chính', APP2: 'Quản trị hệ thống', APP3: 'Cổng cán bộ' })[r.CHUNG_UNGDUNG_ID], TRANGTHAI: i === 2 ? 0 : 1 };
            }) };
        },
        'PKG_CORE_QUANTRI_02.Them_Core_NhanSu_VaiTro': function (o) { (VT_CO[o.strCore_NhanSu_Id] = VT_CO[o.strCore_NhanSu_Id] || []).push(o.strVaiTro_Id); return []; },
        'PKG_CORE_QUANTRI_02.Xoa_Core_NhanSu_VaiTro': function (o) {
            Object.keys(VT_CO).forEach(function (k) { VT_CO[k] = VT_CO[k].filter(function (x) { return x !== o.strId; }); }); return [];
        }
    });
})();
