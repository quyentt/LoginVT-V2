/* Dữ liệu mẫu cho lophoc/covanlop — chỉ dùng ở chế độ dựng thử. */
(function () {
    var DM = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    function dm(id, ma, ten, tenDM) { return { ID: id, MA: ma, TEN: ten, CHUNG_TENDANHMUC_TEN: tenDM || '' }; }
    var CCTC = [{ ID: 'CC1', TEN: 'Khoa Công nghệ thông tin' }, { ID: 'CC2', TEN: 'Bộ môn Hệ thống thông tin' }, { ID: 'CC3', TEN: 'Khoa Kinh tế' }];
    var GV = [
        { ID: 'GV1', HODEM: 'Nguyễn Văn', TEN: 'Hùng', MASO: 'CB001', BM: 'CC1' },
        { ID: 'GV2', HODEM: 'Trần Thị', TEN: 'Mai', MASO: 'CB014', BM: 'CC2' },
        { ID: 'GV3', HODEM: 'Lê Quang', TEN: 'Minh', MASO: 'CB102', BM: 'CC3' },
        { ID: 'GV4', HODEM: 'Phạm Thu', TEN: 'Hương', MASO: 'CB087', BM: 'CC1' }
    ];
    var LOP = [
        { ID: 'LQ1', MA: 'K67-KTPM1', TEN: 'K67-KTPM1', KHOA: 'K67', CT: 'CTKTPM' },
        { ID: 'LQ2', MA: 'K67-KTPM2', TEN: 'K67-KTPM2', KHOA: 'K67', CT: 'CTKTPM' },
        { ID: 'LQ3', MA: 'K67-QTKD2', TEN: 'K67-QTKD2', KHOA: 'K67', CT: 'CTQTKD' },
        { ID: 'LQ5', MA: 'K68-HTTT1', TEN: 'K68-HTTT1', KHOA: 'K68', CT: 'CTHTTT' }
    ];
    var VT = [dm('VT1', 'CVHT', 'Cố vấn học tập', 'Vai trò giảng viên'), dm('VT2', 'GVCN', 'Giáo viên chủ nhiệm', 'Vai trò giảng viên')];
    function ten(ds, id, k) { var r = ds.filter(function (x) { return x.ID === id; })[0]; return r ? r[k] : ''; }
    function lam(r) {
        var g = GV.filter(function (x) { return x.ID === r.GIANGVIEN_ID; })[0] || {};
        r.GIANGVIEN_HODEM = g.HODEM || ''; r.GIANGVIEN_TEN = g.TEN || ''; r.GIANGVIEN_MASO = g.MASO || '';
        r.DAOTAO_COCAUTOCHUC_ID = g.BM || ''; r.DAOTAO_COCAUTOCHUC_TEN = ten(CCTC, g.BM, 'TEN');
        r.DAOTAO_LOPQUANLY_TEN = ten(LOP, r.DAOTAO_LOPQUANLY_ID, 'TEN'); r.VAITRO_TEN = ten(VT, r.VAITRO_ID, 'TEN');
        return r;
    }
    var seq = 10;
    var CV = [
        { ID: 'CV1', GIANGVIEN_ID: 'GV1', DAOTAO_LOPQUANLY_ID: 'LQ1', VAITRO_ID: 'VT1' },
        { ID: 'CV2', GIANGVIEN_ID: 'GV4', DAOTAO_LOPQUANLY_ID: 'LQ2', VAITRO_ID: 'VT1' },
        { ID: 'CV3', GIANGVIEN_ID: 'GV3', DAOTAO_LOPQUANLY_ID: 'LQ3', VAITRO_ID: 'VT2' },
        { ID: 'CV4', GIANGVIEN_ID: 'GV2', DAOTAO_LOPQUANLY_ID: 'LQ5', VAITRO_ID: 'VT1' }
    ].map(lam);
    function tuO(r, o) {
        r.GIANGVIEN_ID = o.strGiangVien_Id; r.DAOTAO_LOPQUANLY_ID = o.strDaoTao_LopQuanLy_Id; r.VAITRO_ID = o.strVaiTro_Id;
        return lam(r);
    }
    var fx = {
        'KHCT_HeDaoTao/LayDanhSach': [{ ID: 'H1', TENHEDAOTAO: 'Đại học chính quy' }, { ID: 'H2', TENHEDAOTAO: 'Liên thông' }],
        'KHCT_KhoaDaoTao/LayDanhSach': function (o) { return o.strDaoTao_HeDaoTao_Id === 'H1' ? [{ ID: 'K67', TENKHOA: 'Khóa 67' }, { ID: 'K68', TENKHOA: 'Khóa 68' }] : []; },
        'KHCT_ToChucChuongTrinh/LayDanhSach': function (o) {
            return [{ ID: 'CTKTPM', TENCHUONGTRINH: 'Kỹ thuật phần mềm', K: 'K67' }, { ID: 'CTQTKD', TENCHUONGTRINH: 'Quản trị kinh doanh', K: 'K67' },
                { ID: 'CTHTTT', TENCHUONGTRINH: 'Hệ thống thông tin', K: 'K68' }].filter(function (x) { return x.K === o.strDaoTao_KhoaDaoTao_Id; });
        },
        'KHCT_LopQuanLy/LayDanhSach': function (o) {
            return LOP.filter(function (x) {
                return (!o.strDaoTao_KhoaDaoTao_Id || x.KHOA === o.strDaoTao_KhoaDaoTao_Id) && (!o.strDaoTao_ToChucCT_Id || x.CT === o.strDaoTao_ToChucCT_Id);
            });
        },
        'pkg_nhansu_hoso_v2.LayDanhSachToanBo': CCTC,
        'NS_HoSoV2/LayDanhSach': function (o) { return GV.filter(function (x) { return !o.strDaoTao_CoCauToChuc_Id || x.BM === o.strDaoTao_CoCauToChuc_Id; }); },
        'KHCT_LopQuanLy_CoVan/LayDanhSach': function (o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            var r = CV.filter(function (x) {
                return (!q || (x.GIANGVIEN_HODEM + ' ' + x.GIANGVIEN_TEN + ' ' + x.DAOTAO_LOPQUANLY_TEN).toLowerCase().indexOf(q) >= 0) &&
                    (!o.strDaoTao_LopQuanLy_Id || x.DAOTAO_LOPQUANLY_ID === o.strDaoTao_LopQuanLy_Id) &&
                    (!o.strGiangVien_Id || x.GIANGVIEN_ID === o.strGiangVien_Id) && (!o.strVaiTro_Id || x.VAITRO_ID === o.strVaiTro_Id);
            });
            var s = Number(o.pageSize) || 10, p = Number(o.pageIndex) || 1;
            return { rows: r.slice((p - 1) * s, p * s), pager: r.length };
        },
        'KHCT_LopQuanLy_CoVan/LayChiTiet': function (o) { return CV.filter(function (x) { return x.ID === o.strId; }); },
        'KHCT_LopQuanLy_CoVan/ThemMoi': function (o) { var r = tuO({ ID: 'CV' + (++seq) }, o); CV.push(r); return { rows: [], raw: { Id: r.ID } }; },
        'KHCT_LopQuanLy_CoVan/CapNhat': function (o) { CV.forEach(function (x) { if (x.ID === o.strId) tuO(x, o); }); return []; },
        'KHCT_LopQuanLy_CoVan/Xoa': function (o) {
            var ids = String(o.strIds || '').split(',');
            for (var i = CV.length - 1; i >= 0; i--) if (ids.indexOf(CV[i].ID) >= 0) CV.splice(i, 1);
            return [];
        }
    };
    fx[DM + 'KHCT.VTGV'] = VT;
    ums.demo.add(fx);
})();
