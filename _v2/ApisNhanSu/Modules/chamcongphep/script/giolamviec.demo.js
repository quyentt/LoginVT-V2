/* Dữ liệu mẫu cho giolamviec — chỉ dùng ở chế độ dựng thử. */
(function () {
    var NG = [{ ID: 'TG1', MA: 'HE', TEN: 'Mùa hè' }, { ID: 'TG2', MA: 'DONG', TEN: 'Mùa đông' }];
    function ten(id) { var r = NG.filter(function (x) { return x.ID === id; })[0]; return r ? r.TEN : ''; }
    ums.demo.add({ 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NS.TGLV': NG });
    ums.demo.crudStore('NS_QuyDinhGioLamViec', [
        { ID: 'GL1', NGAYAPDUNG: '15/04/2025', NHOMTHOIGIAN_ID: 'TG1', NHOMTHOIGIAN_TEN: 'Mùa hè', GIOBATDAUBUOISANG: 7, PHUTBATDAUBUOISANG: 0,
          GIOKETTHUCBUOISANG: 11, PHUTKETTHUCBUOISANG: 30, GIOBATDAUBUOICHIEU: 13, PHUTBATDAUBUOICHIEU: 30, GIOKETTHUCBUOICHIEU: 17, PHUTKETTHUCBUOICHIEU: 0 },
        { ID: 'GL2', NGAYAPDUNG: '15/10/2025', NHOMTHOIGIAN_ID: 'TG2', NHOMTHOIGIAN_TEN: 'Mùa đông', GIOBATDAUBUOISANG: 7, PHUTBATDAUBUOISANG: 30,
          GIOKETTHUCBUOISANG: 11, PHUTKETTHUCBUOISANG: 30, GIOBATDAUBUOICHIEU: 13, PHUTBATDAUBUOICHIEU: 0, GIOKETTHUCBUOICHIEU: 16, PHUTKETTHUCBUOICHIEU: 30 }
    ], { map: function (o) {
        return { NGAYAPDUNG: o.strNgayApDung, NHOMTHOIGIAN_ID: o.strNhomThoiGian_Id, NHOMTHOIGIAN_TEN: ten(o.strNhomThoiGian_Id),
            GIOBATDAUBUOISANG: o.dGioBatDauBuoiSang, PHUTBATDAUBUOISANG: o.dPhutBatDauBuoiSang, GIOKETTHUCBUOISANG: o.dGioKetThucBuoiSang,
            PHUTKETTHUCBUOISANG: o.dPhutKetThucBuoiSang, GIOBATDAUBUOICHIEU: o.dGioBatDauBuoiChieu, PHUTBATDAUBUOICHIEU: o.dPhutBatDauBuoiChieu,
            GIOKETTHUCBUOICHIEU: o.dGioKetThucBuoiChieu, PHUTKETTHUCBUOICHIEU: o.dPhutKetThucBuoiChieu };
    } });
})();
