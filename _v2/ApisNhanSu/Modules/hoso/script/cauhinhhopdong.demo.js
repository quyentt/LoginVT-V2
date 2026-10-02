/* Dữ liệu mẫu cho cauhinhhopdong — chỉ dùng ở chế độ dựng thử. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    var fx = {};
    var HD = [{ ID: 'HDN1', MA: 'KYHD', TEN: 'Ký hợp đồng lần đầu' }, { ID: 'HDN2', MA: 'GIAHAN', TEN: 'Gia hạn hợp đồng' }];
    var PV = [{ ID: 'PV1', MA: 'TOANTRUONG', TEN: 'Toàn trường' }, { ID: 'PV2', MA: 'GV', TEN: 'Giảng viên' }];
    fx[D + 'NHANSU.HOATDONG'] = HD;
    fx[D + 'NHANSU.PHAMVI.HOATDONG'] = PV;
    fx[D + 'NHANSU.TRUONGTHONGTIN'] = [
        { ID: 'TTD1', MA: 'SOHD', TEN: 'Số hợp đồng' }, { ID: 'TTD2', MA: 'THOIHAN', TEN: 'Thời hạn hợp đồng' },
        { ID: 'TTD3', MA: 'LUONG', TEN: 'Mức lương thoả thuận' }];
    ums.demo.add(fx);
    function ten(list, id) { var x = list.filter(function (r) { return r.ID === id; })[0]; return x || {}; }
    ums.demo.crudStore('NS_DanhMucHoatDong', [
        { ID: 'CHD1', HOATDONGNHANSU_ID: 'HDN1', HOATDONGNHANSU_MA: 'KYHD', HOATDONGNHANSU_TEN: 'Ký hợp đồng lần đầu', PHAMVIAPDUNG_ID: 'PV1', PHAMVIAPDUNG_TEN: 'Toàn trường', NGAYAPDUNG: '01/01/2025', HIEULUC: 1 },
        { ID: 'CHD2', HOATDONGNHANSU_ID: 'HDN2', HOATDONGNHANSU_MA: 'GIAHAN', HOATDONGNHANSU_TEN: 'Gia hạn hợp đồng', PHAMVIAPDUNG_ID: 'PV2', PHAMVIAPDUNG_TEN: 'Giảng viên', NGAYAPDUNG: '01/03/2025', HIEULUC: 1 }
    ], { map: function (o) {
        var h = ten(HD, o.strHoatDongNhanSu_Id), p = ten(PV, o.strPhamViApDung_Id);
        return { HOATDONGNHANSU_ID: o.strHoatDongNhanSu_Id, HOATDONGNHANSU_MA: h.MA, HOATDONGNHANSU_TEN: h.TEN,
            PHAMVIAPDUNG_ID: o.strPhamViApDung_Id, PHAMVIAPDUNG_TEN: p.TEN, NGAYAPDUNG: o.strNgayApDung, HIEULUC: Number(o.dHieuLuc) };
    } });
    ums.demo.crudStore('NS_HoatDong_MoRong', [
        { ID: 'HMD1', HOATDONGNHANSU_ID: 'CHD1', TRUONGTHONGTIN_ID: 'TTD1', MOTA: '', THUTU: 1, DORONG: 4, BATBUOC: 1 }
    ], {
        list: function (rows, o) { return rows.filter(function (r) { return r.HOATDONGNHANSU_ID === o.strHoatDongNhanSu_Id; }); },
        map: function (o) { return { HOATDONGNHANSU_ID: o.strHoatDongNhanSu_Id, TRUONGTHONGTIN_ID: o.strTruongThongTin_Id, MOTA: o.strMoTa, THUTU: o.iThuTu, DORONG: o.dDoRong, BATBUOC: o.dBatBuoc }; }
    });
})();
