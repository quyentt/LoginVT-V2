/* Dữ liệu mẫu CHUNG của Thống kê giờ giảng (nạp cùng _tkgg.js) — chỉ dùng ở chế độ dựng thử.
   Hai họ lời gọi cùng dữ liệu: 'plain' TKGG_KeHoach/* và 'ma' PKG_KLGV_V2_KEHOACH.* (khoá demo = tên func). */
(function () {
    var TG = [{ ID: 'TG1', THOIGIAN: 'Năm học 2025-2026', DAOTAO_THOIGIANDAOTAO: 'Năm học 2025-2026' }, { ID: 'TG2', THOIGIAN: 'Năm học 2024-2025', DAOTAO_THOIGIANDAOTAO: 'Năm học 2024-2025' }];
    var TH = [
        { ID: 'TH1', MA: 'KL2526', TEN: 'Tổng hợp khối lượng 2025-2026', MOTA: 'Cả năm', THOIGIAN_ID: 'TG1', THOIGIAN: 'Năm học 2025-2026', HIEULUC: 1, NGAYTAO_DD_MM_YYYY: '01/08/2025', NGUOITAO_TAIKHOAN: 'admin' },
        { ID: 'TH2', MA: 'KL2425', TEN: 'Tổng hợp khối lượng 2024-2025', MOTA: '', THOIGIAN_ID: 'TG2', THOIGIAN: 'Năm học 2024-2025', HIEULUC: 1, NGAYTAO_DD_MM_YYYY: '01/08/2024', NGUOITAO_TAIKHOAN: 'admin' }
    ];
    var CT = [
        { ID: 'CT1', MA: 'HK1', TEN: 'Học kỳ 1 - giảng dạy', MOTA: '', KLGD_TONGHOPKHOILUONG_ID: 'TH1', TONGHOPKHOILUONG_TEN: 'Tổng hợp khối lượng 2025-2026', THOIGIAN_ID: 'TG1', TUNGAY: '01/09/2025', DENNGAY: '31/01/2026', CHEDOAPDUNG_ID: '', PHANLOAI_ID: '', HIEULUC: 1 },
        { ID: 'CT2', MA: 'HK2', TEN: 'Học kỳ 2 - giảng dạy', MOTA: '', KLGD_TONGHOPKHOILUONG_ID: 'TH1', TONGHOPKHOILUONG_TEN: 'Tổng hợp khối lượng 2025-2026', THOIGIAN_ID: 'TG1', TUNGAY: '01/02/2026', DENNGAY: '30/06/2026', CHEDOAPDUNG_ID: '', PHANLOAI_ID: '', HIEULUC: 1 },
        { ID: 'CT3', MA: 'CT', TEN: 'Coi thi, chấm thi HK1', MOTA: '', KLGD_TONGHOPKHOILUONG_ID: 'TH2', TONGHOPKHOILUONG_TEN: 'Tổng hợp khối lượng 2024-2025', THOIGIAN_ID: 'TG2', TUNGAY: '', DENNGAY: '', CHEDOAPDUNG_ID: '', PHANLOAI_ID: '', HIEULUC: 1 }
    ];
    function dsTH(o) { return TH.filter(function (r) { return !o.strDaoTao_ThoiGianDaoTao_Id || r.THOIGIAN_ID === o.strDaoTao_ThoiGianDaoTao_Id; }); }
    function dsCT(o) { return CT.filter(function (r) { return (!o.strKLGD_TongHopKhoiLuong_Id || r.KLGD_TONGHOPKHOILUONG_ID === o.strKLGD_TongHopKhoiLuong_Id) && (!o.strDaoTao_ThoiGianDaoTao_Id || r.THOIGIAN_ID === o.strDaoTao_ThoiGianDaoTao_Id); }); }
    var XN = [{ ID: 'XN1', TINHTRANG_TEN: 'Đã duyệt', NOIDUNG: 'Khoa đã rà soát', NGUOIXACNHAN_TENDAYDU: 'Nguyễn Văn Khoa', NGAYTAO_DD_MM_YYYY: '15/09/2025' }];
    var PVXN = [{ ID: 'PV1', MA: 'LOPHP', TEN: 'Lớp học phần' }, { ID: 'PV2', MA: 'COITHI', TEN: 'Coi thi' }, { ID: 'PV3', MA: 'KHAC', TEN: 'Phạm vi khác' }];
    var LOAI = { PV1: [{ ID: 'L1', MA: 'LT', TEN: 'Lý thuyết' }, { ID: 'L2', MA: 'TH', TEN: 'Thực hành' }], PV2: [{ ID: 'L3', MA: 'CT1', TEN: 'Coi thi giấy' }, { ID: 'L4', MA: 'CT2', TEN: 'Coi thi máy' }], PV3: [{ ID: 'L5', MA: 'HD', TEN: 'Hướng dẫn' }] };
    ums.demo.add({
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KLGD.PHANLOAIXACNHAN': PVXN,
        'pkg_klgv_v2_xacnhan.LayDSLoaiXacNhan_HanhDong': function (o) { return LOAI[o.strLoaiXacNhan_Id] || []; },
        'TKGG_KeHoach/LayDSThoiGianTongHopKL': TG, 'PKG_KLGV_V2_KEHOACH.LayDSThoiGianTongHopKL': TG,
        'TKGG_KeHoach/LayDSKLGD_TongHopKhoiLuong': dsTH, 'PKG_KLGV_V2_KEHOACH.LayDSKLGD_TongHopKhoiLuong': dsTH,
        'TKGG_KeHoach/LayDSKLGD_KeHoachChiTiet': dsCT, 'PKG_KLGV_V2_KEHOACH.LayDSKLGD_KeHoachChiTiet': dsCT,
        'TKGG_XacNhan/LayHanhDongXacNhanNguoiDung': [{ ID: 'HD1', TEN: 'Duyệt', THONGTIN1: 'fa fa-check', THONGTIN2: '' }, { ID: 'HD2', TEN: 'Trả lại', THONGTIN1: 'fa fa-undo', THONGTIN2: '' }],
        'TKGG_XacNhan/Them_KLGD_PhanLoai_XacNhan': function () { return []; },
        'TKGG_XacNhan/LayDSKLGD_PhanLoai_XacNhan': XN,
        'TKGG_XacNhan/LayTTKLGD_PhanLoai_XacNhan': function (o) { return o.strDuLieuXacNhan ? [{ HANHDONG_TEN: 'Đã duyệt' }] : []; }
    });
    ums.demo.tkgg = { TG: TG, TH: TH, CT: CT };
})();
