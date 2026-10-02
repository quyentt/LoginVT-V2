/* Dữ liệu mẫu cho ngaylamviectuan — chỉ dùng ở chế độ dựng thử. */
(function () {
    var QD = [{ ID: 'LV1', MA: 'CANGAY', TEN: 'Làm cả ngày' }, { ID: 'LV2', MA: 'SANG', TEN: 'Làm buổi sáng' }, { ID: 'LV3', MA: 'NGHI', TEN: 'Nghỉ' }];
    function ten(id) { var r = QD.filter(function (x) { return x.ID === id; })[0]; return r ? r.TEN : ''; }
    ums.demo.add({ 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NS.LVTT': QD });
    ums.demo.crudStore('NS_QuyDinhNgayLamViec', [
        { ID: 'NL1', THU: 2, QUYDINH_ID: 'LV1', QUYDINH_TEN: 'Làm cả ngày', NGAYAPDUNG: '01/01/2025', NGUOITHUCHIEN_TENDAYDU: 'Nguyễn Thị Hạnh' },
        { ID: 'NL2', THU: 7, QUYDINH_ID: 'LV2', QUYDINH_TEN: 'Làm buổi sáng', NGAYAPDUNG: '01/01/2025', NGUOITHUCHIEN_TENDAYDU: 'Nguyễn Thị Hạnh' },
        { ID: 'NL3', THU: 8, QUYDINH_ID: 'LV3', QUYDINH_TEN: 'Nghỉ', NGAYAPDUNG: '01/01/2025', NGUOITHUCHIEN_TENDAYDU: 'Nguyễn Thị Hạnh' }
    ], { map: function (o) { return { THU: o.strThu, QUYDINH_ID: o.strQuyDinh_Id, QUYDINH_TEN: ten(o.strQuyDinh_Id), NGAYAPDUNG: o.strNgayApDung }; } });
})();
