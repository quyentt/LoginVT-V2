/* Dữ liệu mẫu cho taichinh/phitheoloaiphong — chỉ dùng ở chế độ dựng thử. */
(function () {
    var DVT = [{ ID: 'DVT1', MA: 'KWH', TEN: 'kWh' }, { ID: 'DVT2', MA: 'M3', TEN: 'm³' }, { ID: 'DVT3', MA: 'THANG', TEN: 'Tháng' }];
    var LP = [{ ID: 'LP1', MA: 'P4', TEN: 'Phòng 4 người' }, { ID: 'LP2', MA: 'P6', TEN: 'Phòng 6 người' }, { ID: 'LP3', MA: 'P8', TEN: 'Phòng 8 người' }];
    var fx = {};
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KTX.DVT0'] = DVT;
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KTX.LP00'] = LP;
    ums.demo.add(fx);
    function ten(list, id) { var r = list.filter(function (x) { return x.ID === id; })[0]; return r ? r.TEN : ''; }
    ums.demo.crudStore('KTX_MucPhi_LoaiPhong', [
        { ID: 'MLP1', TAICHINH_CACKHOANTHU_ID: 'KT5', TAICHINH_CACKHOANTHU_TEN: 'Phí ký túc xá', LOAIPHONG_ID: 'LP1', LOAIPHONG_TEN: 'Phòng 4 người', DONGIA: 400000, DONVITINH_ID: 'DVT3', DONVITINH_TEN: 'Tháng', NGAYAPDUNG: '01/09/2025' },
        { ID: 'MLP2', TAICHINH_CACKHOANTHU_ID: 'KT5', TAICHINH_CACKHOANTHU_TEN: 'Phí ký túc xá', LOAIPHONG_ID: 'LP2', LOAIPHONG_TEN: 'Phòng 6 người', DONGIA: 300000, DONVITINH_ID: 'DVT3', DONVITINH_TEN: 'Tháng', NGAYAPDUNG: '01/09/2025' },
        { ID: 'MLP3', TAICHINH_CACKHOANTHU_ID: 'KT5', TAICHINH_CACKHOANTHU_TEN: 'Phí ký túc xá', LOAIPHONG_ID: 'LP3', LOAIPHONG_TEN: 'Phòng 8 người', DONGIA: 220000, DONVITINH_ID: 'DVT3', DONVITINH_TEN: 'Tháng', NGAYAPDUNG: '01/01/2026' }
    ], { list: function (rows, o) {
        return rows.filter(function (r) { return (!o.strLoaiPhong_Id || r.LOAIPHONG_ID === o.strLoaiPhong_Id) && (!o.strDonViTinh_Id || r.DONVITINH_ID === o.strDonViTinh_Id) &&
            (!o.strTuKhoa || (r.TAICHINH_CACKHOANTHU_TEN + ' ' + r.LOAIPHONG_TEN).toLowerCase().indexOf(String(o.strTuKhoa).toLowerCase()) >= 0); });
    }, map: function (o) {
        return { TAICHINH_CACKHOANTHU_ID: o.strTaiChinh_CacKhoanThu_Id, TAICHINH_CACKHOANTHU_TEN: o.strTaiChinh_CacKhoanThu_Id === 'KT5' ? 'Phí ký túc xá' : 'Khoản ' + o.strTaiChinh_CacKhoanThu_Id,
            LOAIPHONG_ID: o.strLoaiPhong_Id, LOAIPHONG_TEN: ten(LP, o.strLoaiPhong_Id), DONGIA: o.dDonGia, DONVITINH_ID: o.strDonViTinh_Id, DONVITINH_TEN: ten(DVT, o.strDonViTinh_Id), NGAYAPDUNG: o.strNgayApDung };
    } });
})();
