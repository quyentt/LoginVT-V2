/* Dữ liệu mẫu cho nhiemvuchienluoc — chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {}; fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NS.NHIEMVUCHIENLUOC'] = [{ ID: 'NV1', MA: 'CDS', TEN: 'Chuyển đổi số' }, { ID: 'NV2', MA: 'QT', TEN: 'Quốc tế hoá' }];
    ums.demo.add(fx);
    ums.demo.crudStore('NS_QT_NhiemVuChienLuoc', [ { ID: 'NVC1', NHIEMVU_ID: 'NV1', NHIEMVU_TEN: 'Chuyển đổi số', THONGTINTHAMGIA: 'Thành viên tổ triển khai', THOIGIANBATDAU: '2024' } ],
        { map: function (o) { return { NHIEMVU_ID: o.strNhiemVu_Id, THONGTINTHAMGIA: o.strThongTinThamGia, THOIGIANBATDAU: o.strThoiGianBatDau }; } });
})();
