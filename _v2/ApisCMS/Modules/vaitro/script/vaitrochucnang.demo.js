/* Dữ liệu mẫu cho Vai trò - chức năng — chỉ dùng ở chế độ dựng thử.
   Nguồn vai trò / ứng dụng / chức năng: _chung.demo.js (ums.cmsDemo). */
(function () {
    var D = ums.cmsDemo || { CN: [], UD: [] };
    var HD = [
        { ID: 'HD_XEM', MA: 'XEM', TEN: 'Xem', CHUNG_TENDANHMUC_TEN: 'Hành động' },
        { ID: 'HD_THEM', MA: 'THEM', TEN: 'Thêm', CHUNG_TENDANHMUC_TEN: 'Hành động' },
        { ID: 'HD_SUA', MA: 'SUA', TEN: 'Sửa', CHUNG_TENDANHMUC_TEN: 'Hành động' },
        { ID: 'HD_XOA', MA: 'XOA', TEN: 'Xóa', CHUNG_TENDANHMUC_TEN: 'Hành động' }
    ];
    function laCha(cn) { return D.CN.some(function (c) { return c.CHUCNANGCHA_ID === cn.ID; }); }
    // Chức năng cha chỉ có quyền Xem; chức năng lá đủ bốn quyền. CN0110 chưa tạo quyền.
    function quyenCua(cn) {
        if (cn.ID === 'CN0110') return [];
        return (laCha(cn) ? HD.slice(0, 1) : HD).map(function (h) {
            return { ID: 'Q-' + cn.ID + '-' + h.MA, CHUCNANG_ID: cn.ID, CHUCNANG_MA: cn.MACHUCNANG, CHUCNANG_TEN: cn.TENCHUCNANG,
                     HANHDONG_ID: h.ID, HANHDONG_TEN: h.TEN, MOTA: '' };
        });
    }
    function cn(id) { return D.CN.filter(function (c) { return c.ID === id; })[0]; }

    // vai trò → { id quyền: true }
    var GAN = {};
    function gan(vt, ids, hds) {
        GAN[vt] = GAN[vt] || {};
        ids.forEach(function (id) {
            quyenCua(cn(id)).forEach(function (q) { if (!hds || hds.indexOf(q.HANHDONG_ID) >= 0 || laCha(cn(id))) GAN[vt][q.ID] = true; });
        });
    }
    gan('VT01', ['CN0201', 'CN0202', 'CN0203', 'CN0204', 'CN0205', 'CN0206', 'CN0101', 'CN0102', 'CN0103']);
    gan('VT02', ['CN0201', 'CN0202', 'CN0203']);
    gan('VT02', ['CN0107', 'CN0108'], ['HD_XEM', 'HD_THEM']);
    gan('VT06', ['CN0101', 'CN0102', 'CN0103', 'CN0104', 'CN0105', 'CN0107', 'CN0108', 'CN0109']);
    gan('VT03', ['CN0301', 'CN0302']);

    function cnDaGan(vt) {
        var g = GAN[vt] || {};
        return D.CN.filter(function (c) { return quyenCua(c).some(function (q) { return g[q.ID]; }); });
    }

    ums.demo.add({
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#CHUNG.HANHDONG': HD,
        'PKG_CORE_QUANTRI_01.LayDSUngDungTheoVaiTro': function (o) {
            var ds = cnDaGan(o.strVaiTro_Id);
            return D.UD.filter(function (u) { return ds.some(function (c) { return c.CHUNG_UNGDUNG_ID === u.ID; }); })
                .map(function (u) { return { ID: u.ID, TENUNGDUNG: u.TENUNGDUNG, MAUNGDUNG: u.MAUNGDUNG }; });
        },
        'PKG_CORE_QUANTRI_01.LayDSChucNangTheoUDVaiTro': function (o) {
            return cnDaGan(o.strVaiTro_Id).filter(function (c) { return c.CHUNG_UNGDUNG_ID === o.strUngDung_Id; })
                .map(function (c) { return { ID: c.ID, TENCHUCNANG: c.TENCHUCNANG, CHUCNANGCHA_ID: c.CHUCNANGCHA_ID, CHUNG_UNGDUNG_ID: c.CHUNG_UNGDUNG_ID, TINHTRANGDONGBO: 1 }; });
        },
        'PKG_CORE_QUANTRI_01.LayDSQuyenTheoUngDung': function (o) {
            var g = GAN[o.strVaiTro_Id] || {};
            var out = [];
            cnDaGan(o.strVaiTro_Id).filter(function (c) { return c.CHUNG_UNGDUNG_ID === o.strUngDung_Id; }).forEach(function (c) {
                quyenCua(c).forEach(function (q) { if (g[q.ID]) out.push(Object.assign({ DAPHAN: 1 }, q)); });
            });
            return out;
        },
        'PKG_CORE_QUANTRI_02.LayDSCore_Quyen': function (o) { var c = cn(o.strChucNang_Id); return c ? quyenCua(c) : []; },
        'PKG_CORE_QUANTRI_02.Them_Core_VaiTro_Quyen': function (o) {
            GAN[o.strVaiTro_Id] = GAN[o.strVaiTro_Id] || {};
            GAN[o.strVaiTro_Id][o.strCore_Quyen_Id] = true;
            return [];
        },
        'PKG_CORE_QUANTRI_02.Xoa_Core_VaiTro_Quyen': function (o) {
            Object.keys(GAN).forEach(function (vt) { delete GAN[vt][o.strId]; });
            return [];
        },
        'PKG_CORE_QUANTRI_02.Xoa_Core_VaiTro_Quyen2': function (o) {
            var g = GAN[o.strVaiTro_Id] || {}, c = cn(o.strChucNang_Id);
            if (c) quyenCua(c).forEach(function (q) { delete g[q.ID]; });
            return [];
        }
    });
})();
