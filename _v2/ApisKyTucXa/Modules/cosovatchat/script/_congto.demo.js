/* Dữ liệu mẫu cho cosovatchat/congtodien + congtonuoc (bản dựng chung _congto.js) — chỉ ở chế độ dựng thử.
   Cần _ktx.demo.js nạp trước (danh mục TS.HSX0). */
(function () {
    var HSX = ums.demo.ktx.dm['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TS.HSX0'];
    function hsx(id) { var x = HSX.filter(function (h) { return h.ID === id; })[0]; return x ? x.TEN : ''; }
    function kho(ctrl, rows) {
        ums.demo.crudStore(ctrl, rows, {
            list: function (rs, o) { return rs.filter(function (r) { return ums.demo.ktx.khop(r, o.strTuKhoa); }); },
            map: function (o) { return { TEN: o.strTen, MA: o.strMa, NAMSANXUAT: o.strNamSanXuat, HANGSANXUAT_ID: o.strHangSanXuat_Id, HANGSANXUAT: hsx(o.strHangSanXuat_Id), MOTA: o.strMoTa }; }
        });
    }
    var CTD = [
        { ID: 'CTD1', TEN: 'Công tơ A1-101', MA: 'CTD-A1-101', NAMSANXUAT: 2022, HANGSANXUAT_ID: 'HSX1', HANGSANXUAT: 'EMIC', MOTA: 'Công tơ 1 pha 40A' },
        { ID: 'CTD2', TEN: 'Công tơ A1-102', MA: 'CTD-A1-102', NAMSANXUAT: 2022, HANGSANXUAT_ID: 'HSX1', HANGSANXUAT: 'EMIC', MOTA: '' },
        { ID: 'CTD3', TEN: 'Công tơ A2-101', MA: 'CTD-A2-101', NAMSANXUAT: 2024, HANGSANXUAT_ID: 'HSX2', HANGSANXUAT: 'Landis+Gyr', MOTA: 'Công tơ điện tử' },
        { ID: 'CTD4', TEN: '', MA: 'CTD-B-201', NAMSANXUAT: '', HANGSANXUAT_ID: '', HANGSANXUAT: '', MOTA: '' }
    ];
    var CTN = [
        { ID: 'CTN1', TEN: 'Đồng hồ nước A1-T1', MA: 'CTN-A1-T1', NAMSANXUAT: 2021, HANGSANXUAT_ID: 'HSX3', HANGSANXUAT: 'Vinasino', MOTA: 'Đồng hồ nước lạnh DN15' },
        { ID: 'CTN2', TEN: 'Đồng hồ nước A1-T2', MA: 'CTN-A1-T2', NAMSANXUAT: 2021, HANGSANXUAT_ID: 'HSX3', HANGSANXUAT: 'Vinasino', MOTA: '' },
        { ID: 'CTN3', TEN: 'Đồng hồ nước A2-T1', MA: 'CTN-A2-T1', NAMSANXUAT: 2023, HANGSANXUAT_ID: 'HSX2', HANGSANXUAT: 'Landis+Gyr', MOTA: '' }
    ];
    kho('KTX_CongToDien', CTD);
    kho('KTX_CongToNuoc', CTN);
    ums.demo.ktx.CTD = CTD;
    ums.demo.ktx.CTN = CTN;
})();
