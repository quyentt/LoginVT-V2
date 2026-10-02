/* Dữ liệu mẫu cho quyetdinh — chỉ dùng ở chế độ dựng thử. NS.QUDI, NS_Files, danh sách nhân sự có sẵn ở demo-data.js. */
(function () {
    var tv = { QDN1: [{ ID: 'QN1', NHANSU_HOSOCANBO_ID: 'NS1', HOTEN: 'Nguyễn Văn Hùng', MACANBO: 'CB001', LOAICHUCDANH_MA: 'PGS', LOAIHOCVI_MA: 'TS', NGAYSINHDAYDU: '12/04/1975' }] };
    ums.demo.crudStore('NS_ThongTinQuyetDinh', [
        { ID: 'QDN1', THONGTINQUYETDINH: 'Quyết định bổ nhiệm Trưởng khoa Công nghệ thông tin', LOAIQUYETDINH_ID: 'QD1', SOQUYETDINH: '215/QĐ-ĐHCN',
          NGAYQUYETDINH: '01/08/2025', NGAYHIEULUC: '01/09/2025', NGAYHETHIEULUC: '31/08/2030', NGUOIKYQUYETDINH: 'Hiệu trưởng' },
        { ID: 'QDN2', THONGTINQUYETDINH: 'Quyết định miễn nhiệm Phó trưởng phòng Đào tạo', LOAIQUYETDINH_ID: 'QD3', SOQUYETDINH: '318/QĐ-ĐHCN',
          NGAYQUYETDINH: '15/03/2026', NGAYHIEULUC: '01/04/2026', NGAYHETHIEULUC: '', NGUOIKYQUYETDINH: 'Hiệu trưởng' }
    ], {
        map: function (o) { return { THONGTINQUYETDINH: o.strThongTinQuyetDinh, LOAIQUYETDINH_ID: o.strLoaiQuyetDinh_Id, SOQUYETDINH: o.strSoQuyetDinh,
            NGAYQUYETDINH: o.strNgayQuyetDinh, NGAYHIEULUC: o.strNgayHieuLuc, NGAYHETHIEULUC: o.strNgayHetHieuLuc, NGUOIKYQUYETDINH: o.strNguoiKyQuyetDinh }; },
        list: function (rows, o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            var r = rows.filter(function (x) { return (!q || String(x.THONGTINQUYETDINH).toLowerCase().indexOf(q) >= 0) && (!o.strLoaiQuyetDinh_Id || x.LOAIQUYETDINH_ID === o.strLoaiQuyetDinh_Id); });
            return { rows: r, pager: r.length };
        }
    });
    ums.demo.add({
        'NS_QuyetDinhNhanSu/LayDanhSach': function (o) { return tv[o.strNhanSu_ThongTinQD_Id] || []; },
        'NS_QuyetDinhNhanSu/ThemMoi': [],
        'NS_QuyetDinhNhanSu/Xoa': function (o) { Object.keys(tv).forEach(function (k) { tv[k] = tv[k].filter(function (r) { return r.ID !== o.strId; }); }); return []; }
    });
})();
