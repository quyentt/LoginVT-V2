/* Dữ liệu mẫu cho kehoachxetnangluong — chỉ dùng ở chế độ dựng thử. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', fx = {};
    fx[D + 'LUONG.LOAIXETNANGLUONG'] = [{ ID: 'LX1', MA: 'TX', TEN: 'Nâng lương thường xuyên' }, { ID: 'LX2', MA: 'TTH', TEN: 'Nâng lương trước thời hạn' }];
    ums.demo.add(fx);
    ums.demo.crudStore('L_KeHoachXetLuong', [
        { ID: 'KH1', LOAIXETLUONG_ID: 'LX1', LOAIXETLUONG_TEN: 'Nâng lương thường xuyên', NGAYBATDAU: '01/03/2026', NGAYKETTHUC: '31/03/2026', GHICHU: 'Đợt 1 năm 2026' },
        { ID: 'KH2', LOAIXETLUONG_ID: 'LX2', LOAIXETLUONG_TEN: 'Nâng lương trước thời hạn', NGAYBATDAU: '01/09/2026', NGAYKETTHUC: '30/09/2026', GHICHU: '' }
    ], {
        map: function (o) { return { LOAIXETLUONG_ID: o.strLoaiXetLuong_Id, LOAIXETLUONG_TEN: o.strLoaiXetLuong_Id === 'LX2' ? 'Nâng lương trước thời hạn' : 'Nâng lương thường xuyên',
            NGAYBATDAU: o.strNgayBatDau, NGAYKETTHUC: o.strNgayKetThuc, GHICHU: o.strGhiChu }; },
        list: function (rows, o) { return rows.filter(function (r) { return !o.strLoaiXetLuong_Id || r.LOAIXETLUONG_ID === o.strLoaiXetLuong_Id; }); }
    });
})();
