/* Dữ liệu mẫu cho dimuonvesom — chỉ dùng ở chế độ dựng thử. */
ums.demo.crudStore('NS_QuyDinhDiMuonVeSom', [
    { ID: 'DM1', SOPHUTDIMUON: 15, SOPHUTVESOM: 15, SOLAN: 3, NGAYAPDUNG: '01/01/2025', NGUOITHUCHIEN_TENDAYDU: 'Nguyễn Thị Hạnh' },
    { ID: 'DM2', SOPHUTDIMUON: 10, SOPHUTVESOM: 10, SOLAN: 4, NGAYAPDUNG: '01/09/2023', NGUOITHUCHIEN_TENDAYDU: 'Trần Văn Nam' }
], { map: function (o) { return { SOPHUTDIMUON: o.dSoPhutDiMuon, SOPHUTVESOM: o.dSoPhutVeSom, SOLAN: o.dSoLan, NGAYAPDUNG: o.strNgayApDung, NGUOITHUCHIEN_TENDAYDU: 'Cán bộ đang đăng nhập' }; } });
