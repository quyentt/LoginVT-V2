/* Dữ liệu mẫu cho taichinh/phitheophong — chỉ dùng ở chế độ dựng thử. */
(function () {
    var DVT = [{ ID: 'DVT1', MA: 'KWH', TEN: 'kWh' }, { ID: 'DVT2', MA: 'M3', TEN: 'm³' }, { ID: 'DVT3', MA: 'THANG', TEN: 'Tháng' }];
    var PHONG = [
        { ID: 'PH101', MA: 'A1-101', TEN: 'Phòng 101 nhà A1', KTX_TOANHA_TEN: 'Nhà A1' },
        { ID: 'PH102', MA: 'A1-102', TEN: 'Phòng 102 nhà A1', KTX_TOANHA_TEN: 'Nhà A1' },
        { ID: 'PH201', MA: 'B2-201', TEN: 'Phòng 201 nhà B2', KTX_TOANHA_TEN: 'Nhà B2' }
    ];
    var fx = {};
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KTX.DVT0'] = DVT;
    fx['KTX_Phong/LayDanhSach'] = function () { return PHONG.slice(); };
    ums.demo.add(fx);
    function ten(list, id, k) { var r = list.filter(function (x) { return x.ID === id; })[0]; return r ? r[k || 'TEN'] : ''; }
    ums.demo.crudStore('KTX_MucPhi_Phong', [
        { ID: 'MPP1', TAICHINH_CACKHOANTHU_ID: 'KT5', KTX_PHONG_ID: 'PH101', KTX_PHONG_MA: 'A1-101', DONGIATHEONGUOI: 250000, DONGIACAPHONG: 2000000, DONVITINH_ID: 'DVT3', DONVITINH_TEN: 'Tháng', NGAYAPDUNG: '01/09/2025' },
        { ID: 'MPP2', TAICHINH_CACKHOANTHU_ID: 'KT5', KTX_PHONG_ID: 'PH102', KTX_PHONG_MA: 'A1-102', DONGIATHEONGUOI: 300000, DONGIACAPHONG: 2400000, DONVITINH_ID: 'DVT3', DONVITINH_TEN: 'Tháng', NGAYAPDUNG: '01/09/2025' },
        { ID: 'MPP3', TAICHINH_CACKHOANTHU_ID: 'KT5', KTX_PHONG_ID: 'PH201', KTX_PHONG_MA: 'B2-201', DONGIATHEONGUOI: 180000, DONGIACAPHONG: 1440000, DONVITINH_ID: 'DVT3', DONVITINH_TEN: 'Tháng', NGAYAPDUNG: '01/01/2026' }
    ], { list: function (rows, o) {
        return rows.filter(function (r) { return (!o.strKTX_Phong_Id || r.KTX_PHONG_ID === o.strKTX_Phong_Id) && (!o.strDonViTinh_Id || r.DONVITINH_ID === o.strDonViTinh_Id) &&
            (!o.strTuKhoa || (r.KTX_PHONG_MA || '').toLowerCase().indexOf(String(o.strTuKhoa).toLowerCase()) >= 0); });
    }, map: function (o) {
        return { TAICHINH_CACKHOANTHU_ID: o.strTaiChinh_CacKhoanThu_Id, KTX_PHONG_ID: o.strKTX_Phong_Id, KTX_PHONG_MA: ten(PHONG, o.strKTX_Phong_Id, 'MA'),
            DONGIATHEONGUOI: o.dDonGiaTheoNguoi, DONGIACAPHONG: o.dDonGiaCaPhong, DONVITINH_ID: o.strDonViTinh_Id, DONVITINH_TEN: ten(DVT, o.strDonViTinh_Id), NGAYAPDUNG: o.strNgayApDung };
    } });
})();
