/* Dữ liệu mẫu cho cauhinhhoso — chỉ dùng ở chế độ dựng thử. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    var fx = {};
    fx[D + 'NHANSU.HOSO.TRUONGTHONGTIN'] = [
        { ID: 'TTH1', MA: 'CCCD', TEN: 'Số căn cước công dân' }, { ID: 'TTH2', MA: 'BHXH', TEN: 'Số sổ bảo hiểm xã hội' },
        { ID: 'TTH3', MA: 'NGANHANG', TEN: 'Tài khoản ngân hàng' }, { ID: 'TTH4', MA: 'ANH34', TEN: 'Ảnh 3x4' }];
    ums.demo.add(fx);
    ums.demo.crudStore('NS_MauHoSo', [
        { ID: 'MHS1', MA: 'HS-VC', TEN: 'Hồ sơ viên chức', NGAYAPDUNG: '01/01/2025', HIEULUC: 1 },
        { ID: 'MHS2', MA: 'HS-HD', TEN: 'Hồ sơ lao động hợp đồng', NGAYAPDUNG: '01/09/2025', HIEULUC: 1 },
        { ID: 'MHS3', MA: 'HS-2020', TEN: 'Mẫu hồ sơ cũ (2020)', NGAYAPDUNG: '01/01/2020', HIEULUC: 0 }
    ], { map: function (o) { return { MA: o.strMa, TEN: o.strTen, NGAYAPDUNG: o.strNgayApDung, HIEULUC: Number(o.dHieuLuc) }; } });
    ums.demo.crudStore('NS_HoSoMoRong', [
        { ID: 'HMR1', NHANSU_MAUHOSO_ID: 'MHS1', TRUONGTHONGTIN_ID: 'TTH1', MOTA: 'Bắt buộc với viên chức', THUTU: 1, DORONG: 6, BATBUOC: 1 },
        { ID: 'HMR2', NHANSU_MAUHOSO_ID: 'MHS1', TRUONGTHONGTIN_ID: 'TTH2', MOTA: '', THUTU: 2, DORONG: 6, BATBUOC: 0 }
    ], {
        list: function (rows, o) { return rows.filter(function (r) { return r.NHANSU_MAUHOSO_ID === o.strNhanSu_MauHoSo_Id; }); },
        map: function (o) { return { NHANSU_MAUHOSO_ID: o.strNhanSu_MauHoSo_Id, TRUONGTHONGTIN_ID: o.strTruongThongTin_Id, MOTA: o.strMoTa, THUTU: o.iThuTu, DORONG: o.dDoRong, BATBUOC: o.dBatBuoc }; }
    });
})();
