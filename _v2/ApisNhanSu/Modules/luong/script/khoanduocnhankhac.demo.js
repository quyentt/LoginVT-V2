/* Dữ liệu mẫu cho khoanduocnhankhac — chỉ dùng ở chế độ dựng thử. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', fx = {};
    fx[D + 'NHANSU.LOAIKHOAN'] = [{ ID: 'LK1', MA: 'TT', TEN: 'Tiền thưởng' }, { ID: 'LK2', MA: 'TG', TEN: 'Thù lao giảng dạy' }, { ID: 'LK3', MA: 'HT', TEN: 'Hỗ trợ khác' }];
    ums.demo.add(fx);
    function r(id, ct, tien, lk, lkTen, ngay) {
        return { ID: id, DAOTAO_COCAUTOCHUC_TEN: 'Khoa Công nghệ thông tin', NHANSU_HOSOCANBO_MASO: 'CB001', HODEM: 'Nguyễn Văn', TEN: 'Hùng',
            NHANSU_HOSOCANBO_MASOTHUE: '8012345678', CHUNGTU: ct, SOTIEN: tien, LOAIKHOAN_ID: lk, LOAIKHOAN_TEN: lkTen, NGAYPHATSINH: ngay };
    }
    ums.demo.crudStore('L_DuocNhan', [
        r('DN1', 'PC-2026/081', '2500000', 'LK1', 'Tiền thưởng', '15/08/2026'),
        r('DN2', 'PC-2026/094', '4200000', 'LK2', 'Thù lao giảng dạy', '02/09/2026')
    ], { map: function (o) { return { CHUNGTU: o.strChungTu, SOTIEN: o.strSoTien, LOAIKHOAN_ID: o.strLoaiKhoan_Id, NGAYPHATSINH: o.strNgayPhatSinh }; } });
})();
