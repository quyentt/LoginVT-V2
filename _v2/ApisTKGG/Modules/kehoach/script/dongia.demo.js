/* Dữ liệu mẫu cho dongia — chỉ dùng ở chế độ dựng thử. */
(function () {
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten }; }
    var DVT = [dm('DVT1', 'TIET', 'Tiết'), dm('DVT2', 'GIO', 'Giờ chuẩn'), dm('DVT3', 'BAI', 'Bài')];
    var PL = [dm('PLD1', 'GD', 'Giảng dạy'), dm('PLD2', 'CT', 'Coi chấm thi')];
    var DM = [
        { ID: 'DM1', MA: 'DG_LT', TEN: 'Đơn giá giảng lý thuyết', PHANLOAI_ID: 'PLD1', PHANLOAI_TEN: 'Giảng dạy', MOTA: '', HIEULUC: 1 },
        { ID: 'DM2', MA: 'DG_CT', TEN: 'Đơn giá coi thi', PHANLOAI_ID: 'PLD2', PHANLOAI_TEN: 'Coi chấm thi', MOTA: 'Theo ca', HIEULUC: 1 },
        { ID: 'DM3', MA: 'DG_CU', TEN: 'Đơn giá cũ 2023', PHANLOAI_ID: 'PLD1', PHANLOAI_TEN: 'Giảng dạy', MOTA: '', HIEULUC: 0 }
    ];
    var AD = [
        { ID: 'AD1', KLGD_DANHMUCAPDONGIA_ID: 'DM1', KLGD_DANHMUCAPDONGIA_TEN: 'Đơn giá giảng lý thuyết', DONGIA: 120000, DONVITINH_ID: 'DVT2', DONVITINH_TEN: 'Giờ chuẩn', MOTA: '', PHAMVIAPDUNG_ID: 'TH1', PHAMVIAPDUNG_TEN: 'Tổng hợp khối lượng 2025-2026', HIEULUC: 1, NGAYTAO_DD_MM_YYYY_HHMMSS: '02/08/2025 09:00:00', NGUOITAO_TAIKHOAN: 'admin' },
        { ID: 'AD2', KLGD_DANHMUCAPDONGIA_ID: 'DM2', KLGD_DANHMUCAPDONGIA_TEN: 'Đơn giá coi thi', DONGIA: 150000, DONVITINH_ID: 'DVT1', DONVITINH_TEN: 'Tiết', MOTA: 'Ca 90 phút', PHAMVIAPDUNG_ID: 'CT1', PHAMVIAPDUNG_TEN: 'Học kỳ 1 - giảng dạy', HIEULUC: 1, NGAYTAO_DD_MM_YYYY_HHMMSS: '02/08/2025 09:05:00', NGUOITAO_TAIKHOAN: 'admin' }
    ];
    var seq = 10;
    ums.demo.add({
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KLGD.DONVITINH.APDONGIA': DVT,
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KLGD.PHANLOAI.DANHMUCAPDONGIA': PL,
        'PKG_KLGV_V2_TINHTIEN.LayDSKLGD_DanhMucApDonGia': function () { return DM.slice(); },
        'PKG_KLGV_V2_TINHTIEN.Them_KLGD_DanhMucApDonGia': function (o) { var id = 'DM' + (seq++); DM.push({ ID: id, MA: o.strMa, TEN: o.strTen, PHANLOAI_ID: o.strPhanLoai_Id, PHANLOAI_TEN: (PL.filter(function (p) { return p.ID === o.strPhanLoai_Id; })[0] || {}).TEN || '', MOTA: o.strMoTa, HIEULUC: Number(o.dHieuLuc) }); return { rows: [], raw: { Id: id } }; },
        'PKG_KLGV_V2_TINHTIEN.Sua_KLGD_DanhMucApDonGia': function (o) { DM.forEach(function (r) { if (r.ID === o.strId) { r.MA = o.strMa; r.TEN = o.strTen; r.MOTA = o.strMoTa; r.HIEULUC = Number(o.dHieuLuc); } }); return []; },
        'PKG_KLGV_V2_TINHTIEN.Xoa_KLGD_DanhMucApDonGia': function (o) { for (var i = DM.length - 1; i >= 0; i--) if (DM[i].ID === o.strId) DM.splice(i, 1); return []; },
        'PKG_KLGV_V2_TINHTIEN.LayDSKLGD_DanhMucApDonGia_Ad': function (o) {
            var q = (o.strTuKhoa || '').toLowerCase();
            return AD.filter(function (r) { return (!o.strPhamViApDung_Id || r.PHAMVIAPDUNG_ID === o.strPhamViApDung_Id) && (!o.strKLGD_DanhMucApDonGia_Id || r.KLGD_DANHMUCAPDONGIA_ID === o.strKLGD_DanhMucApDonGia_Id) && (!o.strDonViTinh_Id || r.DONVITINH_ID === o.strDonViTinh_Id) && (!q || r.KLGD_DANHMUCAPDONGIA_TEN.toLowerCase().indexOf(q) >= 0); });
        },
        'PKG_KLGV_V2_TINHTIEN.Them_KLGD_DanhMucApDonGia_Ad': function (o) {
            var id = 'AD' + (seq++), dmr = DM.filter(function (d) { return d.ID === o.strKLGD_DanhMucApDonGia_Id; })[0] || {}, dv = DVT.filter(function (d) { return d.ID === o.strDonViTinh_Id; })[0] || {};
            var pv = ums.demo.tkgg.CT.concat(ums.demo.tkgg.TH).filter(function (x) { return x.ID === o.strPhamViApDung_Id; })[0] || {};
            AD.push({ ID: id, KLGD_DANHMUCAPDONGIA_ID: o.strKLGD_DanhMucApDonGia_Id, KLGD_DANHMUCAPDONGIA_TEN: dmr.TEN || '', DONGIA: o.dDonGia, DONVITINH_ID: o.strDonViTinh_Id, DONVITINH_TEN: dv.TEN || '', MOTA: o.strMoTa, PHAMVIAPDUNG_ID: o.strPhamViApDung_Id, PHAMVIAPDUNG_TEN: pv.TEN || '', HIEULUC: 1, NGAYTAO_DD_MM_YYYY_HHMMSS: '06/10/2026 02:00:00', NGUOITAO_TAIKHOAN: 'demo' });
            return { rows: [], raw: { Id: id } };
        },
        'PKG_KLGV_V2_TINHTIEN.Sua_KLGD_DanhMucApDonGia_Ad': function (o) { AD.forEach(function (r) { if (r.ID === o.strId) { r.DONGIA = o.dDonGia; r.MOTA = o.strMoTa; r.DONVITINH_ID = o.strDonViTinh_Id; } }); return []; },
        'PKG_KLGV_V2_TINHTIEN.Xoa_KLGD_DanhMucApDonGia_Ad': function (o) { for (var i = AD.length - 1; i >= 0; i--) if (AD[i].ID === o.strId) AD.splice(i, 1); return []; }
    });
})();
