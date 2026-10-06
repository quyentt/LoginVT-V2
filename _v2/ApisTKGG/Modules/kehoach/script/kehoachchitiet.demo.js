/* Dữ liệu mẫu cho kehoachchitiet — chỉ dùng ở chế độ dựng thử (phần chung: _kehoach.demo.js). */
(function () {
    var D = ums.tkggKHDemo;
    function tgTen(id) { return D.tgTen(id); }
    function plTen(id) { return (D.PL.filter(function (x) { return x.ID === id; })[0] || {}).TEN || ''; }
    function cdTen(id) { return (D.CHEDO.filter(function (x) { return x.ID === id; })[0] || {}).TEN || ''; }
    function khTen(id) { return (D.KH.filter(function (x) { return x.ID === id; })[0] || {}).TEN || ''; }
    function ctTen(id) { return (D.KHCT.filter(function (x) { return x.ID === id; })[0] || {}).TEN || ''; }
    function dat(r, o) {
        r.TEN = o.strTen; r.MOTA = o.strMoTa; r.PHANLOAI_ID = o.strPhanLoai_Id; r.PHANLOAI_TEN = plTen(o.strPhanLoai_Id);
        r.KLGD_KHCHITIET_KEYTHUA_ID = o.strKLGD_KHChiTiet_KeyThua_Id; r.KLGD_KHCHITIET_KEYTHUA_TEN = ctTen(o.strKLGD_KHChiTiet_KeyThua_Id);
        r.CHEDOAPDUNG_ID = o.strCheDoApDung_Id; r.CHEDOAPDUNG_TEN = cdTen(o.strCheDoApDung_Id); r.DAOTAO_THOIGIANDAOTAO_ID = o.strDaoTao_ThoiGianDaoTao_Id; r.THOIGIAN = tgTen(o.strDaoTao_ThoiGianDaoTao_Id);
        r.TUNGAY = o.strTuNgay; r.DENNGAY = o.strDenNgay; r.KLGD_TONGHOPKHOILUONG_ID = o.strKLGD_TongHopKhoiLuong_Id; r.KLGD_TONGHOPKHOILUONG_TEN = khTen(o.strKLGD_TongHopKhoiLuong_Id);
        r.HIENTHICONGGIANVIEN = Number(o.dHienThiCongGianVien);
        return r;
    }
    ums.demo.add({
        'PKG_KLGV_V2_KEHOACH.Them_KLGD_KeHoachChiTiet': function (o) {
            var id = D.moi('CT');
            D.KHCT.push(dat({ ID: id, NGUOITAO_TAIKHOAN: 'admin', NGAYTAO_DD_MM_YYYY: '06/10/2026' }, o));
            D.KHCT_NS[id] = [];
            return { rows: [], raw: { Id: id } };
        },
        'PKG_KLGV_V2_KEHOACH.Sua_KLGD_KeHoachChiTiet': function (o) { D.KHCT.forEach(function (r) { if (r.ID === o.strId) dat(r, o); }); return []; },
        'TKGG_KeHoach/Xoa_KLGD_KeHoachChiTiet': function (o) { for (var i = D.KHCT.length - 1; i >= 0; i--) if (D.KHCT[i].ID === o.strIds) D.KHCT.splice(i, 1); return []; },
        'TKGG_HangDoi/TaoHangDoi_Tinh_KLGD_TuDong': function () { return []; },
        'PKG_KLGV_V2_KEHOACH.Them_KLGD_KeHoachChiTiet_NS': function (o) {
            var ds = D.KHCT_NS[o.strKLGD_KeHoachChiTiet_Id] || (D.KHCT_NS[o.strKLGD_KeHoachChiTiet_Id] = []);
            if (!ds.some(function (x) { return x.NGUOIDUNG_ID === o.strNguoiDung_Id; })) ds.push(D.nsDong(D.moi('N'), o.strNguoiDung_Id));
            return [];
        },
        'PKG_KLGV_V2_KEHOACH.Xoa_KLGD_KeHoachChiTiet_NS': function (o) {
            Object.keys(D.KHCT_NS).forEach(function (k) { for (var i = D.KHCT_NS[k].length - 1; i >= 0; i--) if (D.KHCT_NS[k][i].ID === o.strIds) D.KHCT_NS[k].splice(i, 1); });
            return [];
        }
    });
})();
