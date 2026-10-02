/* Dữ liệu mẫu cho nhansungoaitruong — chỉ dùng ở chế độ dựng thử. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', fx = {};
    function dm(p) { return p.map(function (x) { return { ID: x[0], MA: x[0], TEN: x[1] }; }); }
    fx[D + 'NS.GITI'] = dm([['NAM', 'Nam'], ['NU', 'Nữ']]);
    fx[D + 'NCKH.DMHH'] = dm([['GS', 'Giáo sư'], ['PGS', 'Phó giáo sư']]);
    fx[D + 'NS.DMHV'] = dm([['THS', 'Thạc sĩ'], ['TS', 'Tiến sĩ']]);
    fx[D + 'QLCB.CNDT'] = dm([['KHMT', 'Khoa học máy tính'], ['QTKD', 'Quản trị kinh doanh']]);
    var DS = [
        { ID: 'NT1', HOTEN: 'Phạm Minh Tuấn', HODEM: 'Phạm Minh', TEN: 'Tuấn', MASO: 'NT001', EMAIL: 'tuan.pm@vnu.edu.vn', SDT_CANHAN: '0903111222',
          GIOITINH_ID: 'NAM', CHUCDANH_ID: 'PGS', HOCVI_ID: 'TS', CHUCVU_ID: 'CV1', CHUYENNGANHHOCVI_ID: 'KHMT', MASOTHUE: '8123456789',
          CANCUOC_SO: '001080012345', LINHVUCNGHIENCUU: 'Học máy', HKTT_DIACHI: 'Đại học Quốc gia Hà Nội', DIACHI: '144 Xuân Thủy, Cầu Giấy',
          NGAYSINH: '05', THANGSINH: '11', NAMSINH: '1980' },
        { ID: 'NT2', HOTEN: 'Lê Thu Hằng', HODEM: 'Lê Thu', TEN: 'Hằng', MASO: 'NT002', EMAIL: 'hang.lt@neu.edu.vn', SDT_CANHAN: '0988777666',
          GIOITINH_ID: 'NU', HOCVI_ID: 'THS', HKTT_DIACHI: 'Đại học Kinh tế Quốc dân', DIACHI: '207 Giải Phóng' }
    ];
    /* Danh sách nhân sự dùng chung (demo-data.js) chỉ có cán bộ trong trường — bản ngoài
       trường (dLaCanBoNgoaiTruong 1) trả DS ở đây, còn lại chuyển cho bản dùng chung. */
    var goc = ums.demo.fixtures['pkg_nhansu_hoso_v2.LayDSNhanSu_HoSo_v2'];
    if (goc && !goc._ngoai) {
        fx['pkg_nhansu_hoso_v2.LayDSNhanSu_HoSo_v2'] = function (o) {
            if (String(o.dLaCanBoNgoaiTruong) === '1') return { rows: DS, pager: DS.length };
            return typeof goc === 'function' ? goc(o) : goc;
        };
        fx['pkg_nhansu_hoso_v2.LayDSNhanSu_HoSo_v2']._ngoai = true;
    }
    ums.demo.add(fx);
    ums.demo.crudStore('NS_HoSo_NgoaiV2', DS, { map: function (o) {
        return { HODEM: o.strHoDem, TEN: o.strTen, HOTEN: (o.strHoDem + ' ' + o.strTen).trim(), MASO: o.strMaSo, EMAIL: o.strEmail, SDT_CANHAN: o.strDienThoai };
    } });
    ums.demo.add({ 'NS_HoSoV2/LayChiTiet': function (o) { return DS.filter(function (r) { return r.ID === o.strId; }); } });
})();
