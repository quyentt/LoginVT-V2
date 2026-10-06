/* Dữ liệu mẫu cho xacdinhphamvi — chỉ dùng ở chế độ dựng thử (bộ lọc kế hoạch: _tkgg.demo.js). */
(function () {
    var HE = [{ ID: 'HE1', TENHEDAOTAO: 'Đại học chính quy' }, { ID: 'HE2', TENHEDAOTAO: 'Liên thông' }];
    var VT = [{ ID: 'VT1', MA: 'CHINH', TEN: 'Chủ trì' }, { ID: 'VT2', MA: 'THAMGIA', TEN: 'Tham gia' }];
    var DS = [
        { ID: 'DK1', KLGD_KEHOACHCHITIET_ID: 'CT1', DAOTAO_HEDAOTAO_ID: 'HE1', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', DULIEUXACNHAN: 'XN-DK1', DULIEUXACNHAN_MA: 'HDKL01', DULIEUXACNHAN_TEN: 'Hướng dẫn khoá luận đợt 1', MOTA: '', NAMHOC: '2025-2026', HOCKY: '1', DOTHOC: '1' },
        { ID: 'DK2', KLGD_KEHOACHCHITIET_ID: 'CT1', DAOTAO_HEDAOTAO_ID: 'HE1', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', DULIEUXACNHAN: 'XN-DK2', DULIEUXACNHAN_MA: 'HD02', DULIEUXACNHAN_TEN: 'Hội đồng bảo vệ', MOTA: 'Theo quyết định', NAMHOC: '2025-2026', HOCKY: '1', DOTHOC: '1' }
    ];
    var CT = { DK1: [{ ID: 'CT-A', NGUOIDUNG_ID: 'GV1', NGUOIDUNG_HOTEN: 'Nguyễn Văn An', NGUOIDUNG_MASO: 'CB0012', GIOCHUAN: 12, MOTA: '', DAOTAO_COCAUTOCHUC_ID: 'CC1', VAITRO_ID: 'VT1', QUYMO: 1, SOLUONG: 5 }] };
    var seq = 10;
    ums.demo.add({
        'pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTao': HE,
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KLGD.DOANKL.VAITRO': VT,
        'TKGG_KeHoach/LayDSKLGD_DuLieu_Khac': function (o) { var r = DS.filter(function (x) { return !o.strKLGD_KeHoachChiTiet_Id || x.KLGD_KEHOACHCHITIET_ID === o.strKLGD_KeHoachChiTiet_Id; }); return { rows: r, pager: r.length }; },
        'TKGG_KeHoach/Them_KLGD_DuLieu_Khac': function (o) { var id = 'DK' + (seq++); DS.push({ ID: id, KLGD_KEHOACHCHITIET_ID: o.strKLGD_KeHoachChiTiet_Id, DAOTAO_HEDAOTAO_ID: o.strDaoTao_HeDaoTao_Id, DAOTAO_HEDAOTAO_TEN: (HE.filter(function (h) { return h.ID === o.strDaoTao_HeDaoTao_Id; })[0] || {}).TENHEDAOTAO || '', DULIEUXACNHAN: 'XN-' + id, DULIEUXACNHAN_MA: o.strDuLieuXacNhan_Ma, DULIEUXACNHAN_TEN: o.strDuLieuXacNhan_Ten, MOTA: '', NAMHOC: '2025-2026', HOCKY: '1', DOTHOC: '1' }); return { rows: [], raw: { Id: id } }; },
        'TKGG_KeHoach/Sua_KLGD_DuLieu_Khac': function (o) { DS.forEach(function (x) { if (x.ID === o.strId) { x.DULIEUXACNHAN_MA = o.strDuLieuXacNhan_Ma; x.DULIEUXACNHAN_TEN = o.strDuLieuXacNhan_Ten; x.DAOTAO_HEDAOTAO_ID = o.strDaoTao_HeDaoTao_Id; } }); return []; },
        'TKGG_KeHoach/Xoa_KLGD_DuLieu_Khac': function (o) { for (var i = DS.length - 1; i >= 0; i--) if (DS[i].ID === o.strIds) DS.splice(i, 1); return []; },
        'TKGG_KeHoach/LayDSKLGD_DuLieu_Khac_CT': function (o) { return (CT[o.strKLGD_DuLieu_Id] || []).slice(); },
        'TKGG_KeHoach/Them_KLGD_DuLieu_Khac_CT': function (o) { var id = 'CT-' + (seq++); (CT[o.strKLGD_DuLieu_Id] = CT[o.strKLGD_DuLieu_Id] || []).push({ ID: id, NGUOIDUNG_ID: o.strNguoiDung_Id, NGUOIDUNG_HOTEN: 'Cán bộ ' + o.strNguoiDung_Id, NGUOIDUNG_MASO: '', GIOCHUAN: o.dGioChuan, MOTA: o.strMoTa, DAOTAO_COCAUTOCHUC_ID: o.strDaoTao_CoCauToChuc_Id, VAITRO_ID: o.strVaiTro_Id, QUYMO: o.dQuyMo, SOLUONG: o.dSoLuong }); return { rows: [], raw: { Id: id } }; },
        'TKGG_KeHoach/Sua_KLGD_DuLieu_Khac_CT': function () { return []; },
        'TKGG_KeHoach/Xoa_KLGD_DuLieu_Khac_CT': function (o) { Object.keys(CT).forEach(function (k) { CT[k] = CT[k].filter(function (r) { return r.ID !== o.strIds; }); }); return []; }
    });
})();
