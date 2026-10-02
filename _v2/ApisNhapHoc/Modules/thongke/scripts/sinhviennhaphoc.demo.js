/* Dữ liệu mẫu cho Sinh viên nhập học — chỉ dùng ở chế độ dựng thử. */
(function () {
    var HO = ['Nguyễn Văn', 'Trần Thị', 'Lê Minh', 'Phạm Thu', 'Hoàng Đức', 'Vũ Ngọc', 'Đặng Quốc', 'Bùi Thanh', 'Đỗ Hải', 'Ngô Phương', 'Dương Tuấn', 'Lý Mai'];
    var TEN = ['An', 'Bình', 'Châu', 'Dung', 'Giang', 'Hà', 'Khánh', 'Linh', 'Minh', 'Ngân', 'Phúc', 'Quỳnh'];
    var LOP = { L1: 'K67-KTPM1', L4: 'K67-KTPM2', L2: 'K67-QTKD2', L3: 'K68-HTTT1' };
    var DS = HO.map(function (h, i) {
        var lop = ['L1', 'L4', 'L2', 'L3'][i % 4];
        return { ID: 'SVN' + i, SOBAODANH: 'TLA00' + (1200 + i * 7), MASONGUOIHOC: '25510600' + (i < 10 ? '0' : '') + i, HODEM: h, TEN: TEN[i],
                 NGAYSINH_NGAY: String(1 + i * 2), NGAYSINH_THANG: String(1 + i % 12), NGAYSINH_NAM: '2007', GIOITINH_TEN: i % 2 ? 'Nữ' : 'Nam',
                 _LOP: lop, _CT: lop === 'L2' ? 'CTQTKD' : lop === 'L3' ? 'CTHTTT' : 'CTKTPM', DAOTAO_LOPQUANLY_TEN: LOP[lop] };
    });
    ums.demo.add({
        'SV_HoSoHocVien/LayDanhSachHoSo': function (o) {
            var q = (o.strTuKhoa || '').toLowerCase();
            var r = DS.filter(function (x) {
                return (!o.strLopQuanLy_Id || x._LOP === o.strLopQuanLy_Id) && (!o.strChuongTrinh_Id || x._CT === o.strChuongTrinh_Id) &&
                    (!q || (x.HODEM + ' ' + x.TEN + ' ' + x.MASONGUOIHOC).toLowerCase().indexOf(q) >= 0);
            });
            var s = Number(o.pageSize) || 10, p = Number(o.pageIndex) || 1;
            return { rows: r.slice((p - 1) * s, p * s), pager: r.length };
        }
    });
})();
