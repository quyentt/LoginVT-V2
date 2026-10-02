/* Dữ liệu mẫu cho cacmonhocdagiangday — chỉ dùng ở chế độ dựng thử. NS.DMNN (quatrinhdaotao) không có sẵn → khai lại. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', fx = {};
    fx[D + 'KHCT.BACDAOTAO'] = [{ ID: 'BAC1', MA: 'DH', TEN: 'Đại học' }, { ID: 'BAC2', MA: 'THS', TEN: 'Thạc sĩ' }];
    fx[D + 'NS.DMNN'] = [{ ID: 'NG1', MA: 'VI', TEN: 'Tiếng Việt' }, { ID: 'NG2', MA: 'EN', TEN: 'Tiếng Anh' }];
    ums.demo.add(fx);
    ums.demo.crudStore('NS_QT_MonHoc', [
        { ID: 'MH1', TENMON: 'Cơ sở dữ liệu', MAMON: 'IT3090', BACDAOTAO_ID: 'BAC1', BACDAOTAO_TEN: 'Đại học', SOTC: '3', DONVIGIANGDAY_ID: 'CC1',
          DONVIGIANGDAY_TEN: 'Khoa Công nghệ thông tin', THOIGIANBATDAU: '2013', NGONNGU_ID: 'NG1' },
        { ID: 'MH2', TENMON: 'Khai phá dữ liệu', MAMON: 'IT5010', BACDAOTAO_ID: 'BAC2', BACDAOTAO_TEN: 'Thạc sĩ', SOTC: '2', DONVIGIANGDAY_ID: 'CC1',
          DONVIGIANGDAY_TEN: 'Khoa Công nghệ thông tin', THOIGIANBATDAU: '2020', NGONNGU_ID: 'NG2' }
    ], { map: function (o) { return { TENMON: o.strTenMon, MAMON: o.strMaMon, BACDAOTAO_ID: o.strBacDaoTao_Id, SOTC: o.dSoTC,
        DONVIGIANGDAY_ID: o.strDonViGiangDay_Id, DONVIGIANGDAY_KHAC: o.strDonViGiangDay_Khac, THOIGIANBATDAU: o.strThoiGianBatDau, NGONNGU_ID: o.strNgonNgu_Id }; } });
})();
