/* Dữ liệu mẫu cho Vai trò - người dùng — chỉ dùng ở chế độ dựng thử. */
(function () {
    var ND = [
        { ID: 'ND01', TAIKHOAN: 'nvhung', TENDAYDU: 'Nguyễn Văn Hùng', EMAIL: 'nvhung@truong.edu.vn', PHANLOAI: 'CANBO' },
        { ID: 'ND02', TAIKHOAN: 'ttlan', TENDAYDU: 'Trần Thị Lan', EMAIL: 'ttlan@truong.edu.vn', PHANLOAI: 'CANBO' },
        { ID: 'ND03', TAIKHOAN: 'lqminh', TENDAYDU: 'Lê Quang Minh', EMAIL: 'lqminh@truong.edu.vn', PHANLOAI: 'CANBO' },
        { ID: 'ND04', TAIKHOAN: 'pthoa', TENDAYDU: 'Phạm Thu Hoà', EMAIL: 'pthoa@truong.edu.vn', PHANLOAI: 'CANBO' },
        { ID: 'ND05', TAIKHOAN: 'dvnam', TENDAYDU: 'Đỗ Văn Nam', EMAIL: 'dvnam@truong.edu.vn', PHANLOAI: 'CANBO' },
        { ID: 'ND06', TAIKHOAN: 'BIT220263', TENDAYDU: 'Hoàng Minh Tuấn', EMAIL: 'bit220263@sv.truong.edu.vn', PHANLOAI: 'SINHVIEN' },
        { ID: 'ND07', TAIKHOAN: 'BBA220561', TENDAYDU: 'Vũ Thị Mai', EMAIL: 'bba220561@sv.truong.edu.vn', PHANLOAI: 'SINHVIEN' },
        { ID: 'ND08', TAIKHOAN: 'doitac.vnpt', TENDAYDU: 'VNPT Hà Nội', EMAIL: 'lienhe@vnpt.vn', PHANLOAI: 'DOITAC' }
    ];
    var GAN = { VT01: ['ND01'], VT02: ['ND02', 'ND03'], VT03: ['ND03', 'ND04', 'ND05'], VT06: ['ND04'], VT07: ['ND01', 'ND02', 'ND05'] };

    function trang(rows, o) {
        var i = Number(o.pageIndex) || 1, s = Number(o.pageSize) || rows.length || 1;
        return { rows: rows.slice((i - 1) * s, i * s), pager: rows.length };
    }
    ums.demo.add({
        'pkg_chung_quanlynguoidung.LayDanhSachNguoiDung': function (o) {
            var q = (o.strTuKhoa || '').toLowerCase();
            return trang(ND.filter(function (n) {
                return (!o.strPhanLoaiDoiTuong || n.PHANLOAI === o.strPhanLoaiDoiTuong) &&
                    (!q || (n.TAIKHOAN + ' ' + n.TENDAYDU).toLowerCase().indexOf(q) >= 0);
            }), o);
        },
        'PKG_CORE_QUANTRI_01.LayDSNguoiDungVaiTro': function (o) {
            var q = (o.strTuKhoa || '').toLowerCase();
            return trang((GAN[o.strVaiTro_Id] || []).map(function (id) {
                var n = ND.filter(function (x) { return x.ID === id; })[0];
                return { ID: n.ID, NAME: n.TAIKHOAN, FULLNAME: n.TENDAYDU, EMAIL: n.EMAIL };
            }).filter(function (n) { return !q || (n.NAME + ' ' + n.FULLNAME).toLowerCase().indexOf(q) >= 0; }), o);
        }
    });
})();
