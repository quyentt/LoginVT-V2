/* Dữ liệu mẫu cho taichinh/phidichvu — chỉ dùng ở chế độ dựng thử. Khoản thu dùng mẫu chung (TC_KhoanThu/LayDanhSach ở demo-data.js). */
(function () {
    var DVT = [{ ID: 'DVT1', MA: 'KWH', TEN: 'kWh' }, { ID: 'DVT2', MA: 'M3', TEN: 'm³' }, { ID: 'DVT3', MA: 'THANG', TEN: 'Tháng' }];
    var LK = [
        { ID: 'LK1', MA: 'B1', TEN: 'Bậc 1 (0 - 50)', MUCCANDUOI: 0, MUCCANTREN: 50 },
        { ID: 'LK2', MA: 'B2', TEN: 'Bậc 2 (51 - 100)', MUCCANDUOI: 51, MUCCANTREN: 100 },
        { ID: 'LK3', MA: 'B3', TEN: 'Bậc 3 (trên 100)', MUCCANDUOI: 101, MUCCANTREN: 999999 }
    ];
    var fx = {};
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KTX.DVT0'] = DVT;
    fx['KTX_LuyKe/LayDanhSach'] = function () { return LK.slice(); };
    ums.demo.add(fx);
    function ten(list, id, k) { var r = list.filter(function (x) { return x.ID === id; })[0]; return r ? r[k || 'TEN'] : ''; }
    ums.demo.crudStore('KTX_MucPhiDichVu', [
        { ID: 'PDV1', TAICHINH_CACKHOANTHU_ID: 'KT5', TAICHINH_CACKHOANTHU_TEN: 'Phí ký túc xá', DONGIA: 2500, DONVITINH_ID: 'DVT1', DONVITINH_TEN: 'kWh', NGAYAPDUNG: '01/01/2026', KTX_LUYKE_ID: 'LK1' },
        { ID: 'PDV2', TAICHINH_CACKHOANTHU_ID: 'KT5', TAICHINH_CACKHOANTHU_TEN: 'Phí ký túc xá', DONGIA: 3200, DONVITINH_ID: 'DVT1', DONVITINH_TEN: 'kWh', NGAYAPDUNG: '01/01/2026', KTX_LUYKE_ID: 'LK2' },
        { ID: 'PDV3', TAICHINH_CACKHOANTHU_ID: 'KT5', TAICHINH_CACKHOANTHU_TEN: 'Phí ký túc xá', DONGIA: 15000, DONVITINH_ID: 'DVT2', DONVITINH_TEN: 'm³', NGAYAPDUNG: '01/09/2025', KTX_LUYKE_ID: '' }
    ], { map: function (o) {
        return { TAICHINH_CACKHOANTHU_ID: o.strTaiChinh_CacKhoanThu_Id, TAICHINH_CACKHOANTHU_TEN: o.strTaiChinh_CacKhoanThu_Id === 'KT5' ? 'Phí ký túc xá' : 'Khoản ' + o.strTaiChinh_CacKhoanThu_Id,
            DONGIA: o.dDonGia, DONVITINH_ID: o.strDonViTinh_Id, DONVITINH_TEN: ten(DVT, o.strDonViTinh_Id), NGAYAPDUNG: o.strNgayApDung, KTX_LUYKE_ID: o.strKTX_LuyKe_Id };
    } });
})();
