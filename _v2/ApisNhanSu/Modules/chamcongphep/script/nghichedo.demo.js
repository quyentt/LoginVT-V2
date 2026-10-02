/* Dữ liệu mẫu cho nghichedo — chỉ dùng ở chế độ dựng thử. */
(function () {
    var LT = [{ ID: 'LT1', MA: 'GV', TEN: 'Giảng viên' }, { ID: 'LT2', MA: 'CV', TEN: 'Chuyên viên' }, { ID: 'LT3', MA: 'NV', TEN: 'Nhân viên hợp đồng' }];
    function ten(id) { var r = LT.filter(function (x) { return x.ID === id; })[0]; return r ? r.TEN : ''; }
    ums.demo.add({ 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NS.LTNS': LT });
    ums.demo.crudStore('NS_QuyDinhNghiCheDo', [
        { ID: 'CD1', LOAIDOITUONG_ID: 'LT1', LOAIDOITUONG_TEN: 'Giảng viên', SONGAYDUOCNGHI: 56, NAMAPDUNG: '2026' },
        { ID: 'CD2', LOAIDOITUONG_ID: 'LT2', LOAIDOITUONG_TEN: 'Chuyên viên', SONGAYDUOCNGHI: 12, NAMAPDUNG: '2026' }
    ], { map: function (o) { return { LOAIDOITUONG_ID: o.strLoaiDoiTuong_Id, LOAIDOITUONG_TEN: ten(o.strLoaiDoiTuong_Id), SONGAYDUOCNGHI: o.dSoNgayDuocNghi, NAMAPDUNG: o.strNamApDung }; } });
})();
