/* Dữ liệu mẫu cho danhhieuhocham — chỉ dùng ở chế độ dựng thử. NS.QUDI, NS_Files có sẵn. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', fx = {};
    fx[D + 'NS.LOCD'] = [{ ID: 'CD1', MA: 'PGS', TEN: 'Phó giáo sư' }, { ID: 'CD2', MA: 'GS', TEN: 'Giáo sư' }];
    fx[D + 'NS.LODH'] = [{ ID: 'DHI1', MA: 'NGUT', TEN: 'Nhà giáo ưu tú' }, { ID: 'DHI2', MA: 'NGND', TEN: 'Nhà giáo nhân dân' }];
    ums.demo.add(fx);
    ums.demo.crudStore('NS_QT_ChucDanh', [
        { ID: 'HHA1', CHUYENNGANH: 'Khoa học máy tính', CHUCDANH_ID: 'CD1', CHUCDANH_TEN: 'Phó giáo sư', NAMPHONGCHUCDANH: '15/11/2024', NOIPHONGCHUCDANH: 'HĐGS Nhà nước', THOIHAN: '', MOTA: '' }
    ], { map: function (o) { return { CHUYENNGANH: o.strChuyenNganh, CHUCDANH_ID: o.strChucDanh_Id, NAMPHONGCHUCDANH: o.strNamPhongChucDanh,
        NOIPHONGCHUCDANH: o.strNoiPhongChucDanh, THOIHAN: o.strThoiHan, MOTA: o.strMoTa }; } });
    ums.demo.crudStore('NS_ThongTinQuyetDinh', [
        { ID: 'TTQD1', NGUONDULIEU_ID: 'HHA1', LOAIQUYETDINH_ID: 'QD1', SOQUYETDINH: '45/QĐ-HĐGS', NGAYQUYETDINH: '20/11/2024', NGAYHIEULUC: '01/01/2025', NGAYHETHIEULUC: '31/12/2029', THONGTINQUYETDINH: 'Giao nhiệm vụ hướng dẫn NCS' }
    ], { list: function (rows, o) { return rows.filter(function (r) { return r.NGUONDULIEU_ID === o.strNguonDuLieu_Id; }); },
         map: function (o) { return { NGUONDULIEU_ID: o.strNguonDuLieu_Id, LOAIQUYETDINH_ID: o.strLoaiQuyetDinh_Id, SOQUYETDINH: o.strSoQuyetDinh,
            NGAYQUYETDINH: o.strNgayQuyetDinh, NGAYHIEULUC: o.strNgayHieuLuc, NGAYHETHIEULUC: o.strNgayHetHieuLuc, THONGTINQUYETDINH: o.strThongTinQuyetDinh }; } });
    ums.demo.crudStore('NS_QT_DanhHieu', [
        { ID: 'DHA1', DANHHIEU_ID: 'DHI1', DANHHIEU_TEN: 'Nhà giáo ưu tú', NAMPHONG: '20/11/2023', NOIPHONG: 'Chủ tịch nước', NHANSU_TTQUYETDINH_SOQD: '1520/QĐ-CTN', NHANSU_TTQUYETDINH_NGAYQD: '10/11/2023', MOTA: '' }
    ], { map: function (o) { return { DANHHIEU_ID: o.strDanhHieu_Id, NAMPHONG: o.strNamPhong, NOIPHONG: o.strNoiPhong, NHANSU_TTQUYETDINH_SOQD: o.strSoQuyetDinh,
        NHANSU_TTQUYETDINH_NGAYQD: o.strNgayQuyetDinh, MOTA: o.strMoTa }; } });
})();
