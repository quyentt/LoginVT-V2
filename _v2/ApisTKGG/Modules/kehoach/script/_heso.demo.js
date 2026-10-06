/* Dữ liệu mẫu chung hai màn hệ số — chỉ dùng ở chế độ dựng thử. */
(function () {
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten }; }
    var PVXN = [dm('PV1', 'LOPHP', 'Lớp học phần'), dm('PV2', 'COITHI', 'Coi thi'), dm('PV3', 'KHAC', 'Phạm vi khác')];
    var LB = PVXN;   // gốc: ô lọc Phân loại (KLGD.LOAIBANG) và ô Phạm vi của biểu mẫu (KLGD.PHANLOAIXACNHAN) cùng gửi strLoaiBang_Id → mẫu dùng chung một bộ id
    var LOAI = { PV1: [dm('L1', 'LT', 'Lý thuyết'), dm('L2', 'TH', 'Thực hành')], PV2: [dm('L3', 'CT1', 'Coi thi giấy'), dm('L4', 'CT2', 'Coi thi máy')], PV3: [dm('L5', 'HD', 'Hướng dẫn')] };
    var TG = [{ ID: 'TG1', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 2025-2026' }, { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 2025-2026' }];
    function dong(id, lb, pv, bd, kt, hs, tg) {
        var l = LOAI[pv].filter(function (x) { return x.ID === hs; })[0] || LOAI[pv][0];
        return { ID: id, LOAIBANG_ID: lb, LOAIBANG_TEN: LB.filter(function (x) { return x.ID === lb; })[0].TEN, PHAMVIAPDUNG_ID: l.ID, PHAMVIAPDUNG_TEN: l.TEN,
            SOBATDAU: bd, SOKETTHUC: kt, HESO: hs === 'L1' ? 1 : 1.2, THOIGIAN_ID: tg, THOIGIAN: TG.filter(function (x) { return x.ID === tg; })[0].DAOTAO_THOIGIANDAOTAO,
            NGAYTAO_DD_MM_YYYY_HHMMSS: '01/09/2025 08:30:00', NGUOITAO_TAIKHOAN: 'admin' };
    }
    var QM = [dong('QM1', 'PV1', 'PV1', 0, 40, 'L1', 'TG1'), dong('QM2', 'PV1', 'PV1', 41, 80, 'L2', 'TG1'), dong('QM3', 'PV2', 'PV2', 0, 999, 'L3', 'TG2')];
    var PVA = [dong('PA1', 'PV1', 'PV1', '', '', 'L1', 'TG1'), dong('PA2', 'PV3', 'PV3', '', '', 'L5', 'TG2')];
    var seq = 10;
    function ds(list) { return function (o) { return list.filter(function (r) { return (!o.strDaoTao_ThoiGianDaoTao_Id || r.THOIGIAN_ID === o.strDaoTao_ThoiGianDaoTao_Id) && (!o.strLoaiBang_Id || r.LOAIBANG_ID === o.strLoaiBang_Id); }); }; }
    function them(list) { return function (o) { var id = 'HS' + (seq++); list.push(dong(id, o.strLoaiBang_Id || 'PV1', PVXN.some(function (p) { return p.ID === o.strLoaiBang_Id; }) ? o.strLoaiBang_Id : 'PV1', o.dSoBatDau, o.dSoKetThuc, o.strPhamViApDung_Id, o.strDaoTao_ThoiGianDaoTao_Id || 'TG1')); return { rows: [], raw: { Id: id } }; }; }
    function sua(list) { return function (o) { list.forEach(function (r) { if (r.ID === o.strId) { r.HESO = o.dHeSo; r.SOBATDAU = o.dSoBatDau; r.SOKETTHUC = o.dSoKetThuc; } }); return []; }; }
    function xoa(list) { return function (o) { for (var i = list.length - 1; i >= 0; i--) if (list[i].ID === o.strId) list.splice(i, 1); return []; }; }
    ums.demo.add({
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KLGD.LOAIBANG': LB,
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KLGD.PHANLOAIXACNHAN': PVXN,
        'pkg_klgv_v2_xacnhan.LayDSLoaiXacNhan_HanhDong': function (o) { return LOAI[o.strLoaiXacNhan_Id] || []; },
        'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao': TG,
        'PKG_KLGV_V2_THONGTIN.LayDSKLGD_HeSo_QuyMoSoLuong': ds(QM), 'PKG_KLGV_V2_THONGTIN.Them_KLGD_HeSo_QuyMoSoLuong': them(QM),
        'PKG_KLGV_V2_THONGTIN.Sua_KLGD_HeSo_QuyMoSoLuong': sua(QM), 'PKG_KLGV_V2_THONGTIN.Xoa_KLGD_HeSo_QuyMoSoLuong': xoa(QM),
        'PKG_KLGV_V2_THONGTIN.LayDSKLGD_HeSo_PhamViApDung': ds(PVA), 'PKG_KLGV_V2_THONGTIN.Them_KLGD_HeSo_PhamViApDung': them(PVA),
        'PKG_KLGV_V2_THONGTIN.Sua_KLGD_HeSo_PhamViApDung': sua(PVA), 'PKG_KLGV_V2_THONGTIN.Xoa_KLGD_HeSo_PhamViApDung': xoa(PVA)
    });
})();
