/* Dữ liệu mẫu cho lophoc/lophoc — chỉ dùng ở chế độ dựng thử. */
(function () {
    var DM = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    function dm(id, ma, ten, tenDM) { return { ID: id, MA: ma, TEN: ten, CHUNG_TENDANHMUC_TEN: tenDM || '' }; }
    var HE = [{ ID: 'H1', TENHEDAOTAO: 'Đại học chính quy', MAHEDAOTAO: 'DHCQ' }, { ID: 'H2', TENHEDAOTAO: 'Liên thông', MAHEDAOTAO: 'LT' }];
    var KHOA = [{ ID: 'K67', TENKHOA: 'Khóa 67', MAKHOA: 'K67', HE: 'H1' }, { ID: 'K68', TENKHOA: 'Khóa 68', MAKHOA: 'K68', HE: 'H1' },
        { ID: 'KLT1', TENKHOA: 'Liên thông khóa 1', MAKHOA: 'LT1', HE: 'H2' }];
    var CT = [
        { ID: 'CTKTPM', TENCHUONGTRINH: 'Kỹ thuật phần mềm', MACHUONGTRINH: '7480103', DAOTAO_N_CN_MA: 'KTPM', KHOA: 'K67' },
        { ID: 'CTQTKD', TENCHUONGTRINH: 'Quản trị kinh doanh', MACHUONGTRINH: '7340101', DAOTAO_N_CN_MA: 'QTKD', KHOA: 'K67' },
        { ID: 'CTHTTT', TENCHUONGTRINH: 'Hệ thống thông tin', MACHUONGTRINH: '7480104', DAOTAO_N_CN_MA: 'HTTT', KHOA: 'K68' }
    ];
    var seq = 10;
    var LOP = [
        ['LQ1', 'K67-KTPM1', 'K67-KTPM1', 42, 45, 'LL1', 'Chính quy', 'NL1', 'Nhóm A', 'K67', 'CTKTPM', 'CC1', 0, 'CS1'],
        ['LQ2', 'K67-KTPM2', 'K67-KTPM2', 39, 45, 'LL1', 'Chính quy', 'NL1', 'Nhóm A', 'K67', 'CTKTPM', 'CC1', 0, 'CS1'],
        ['LQ3', 'K67-QTKD2', 'K67-QTKD2', 45, 50, 'LL1', 'Chính quy', 'NL2', 'Nhóm B', 'K67', 'CTQTKD', 'CC3', 0, 'CS1'],
        ['LQ4', 'K67-QTKD-N2', 'K67-QTKD ngành 2', 18, 30, 'LL2', 'Ngành 2', '', '', 'K67', 'CTQTKD', 'CC3', 1, 'CS2'],
        ['LQ5', 'K68-HTTT1', 'K68-HTTT1', 40, 45, 'LL1', 'Chính quy', 'NL1', 'Nhóm A', 'K68', 'CTHTTT', 'CC1', 0, 'CS1']
    ].map(function (x) { return ({ ID: x[0], MA: x[1], TEN: x[2], SOLUONGTHUCTE: x[3], SOLUONGKEHOACH: x[4], LOAILOP_ID: x[5],
        NHOMLOP_ID: x[7], DAOTAO_KHOADAOTAO_ID: x[9], DAOTAO_TOCHUCCHUONGTRINH_ID: x[10], DAOTAO_KHOAQUANLY_ID: x[11], LOPMONGANH2: x[12],
        DAOTAO_COSODAOTAO_ID: x[13], THOIGIANBATDAU: '05/09/2022', THOIGIANKETTHUC: '30/06/2026' }); });
    function ten(ds, id, k) { var r = ds.filter(function (x) { return x.ID === id; })[0]; return r ? r[k] : ''; }
    function lam(r) {
        r.LOAILOP_TEN = ten(LOAI, r.LOAILOP_ID, 'TEN'); r.NHOMLOP_TEN = ten(NHOM, r.NHOMLOP_ID, 'TEN');
        r.DAOTAO_KHOADAOTAO_TEN = ten(KHOA, r.DAOTAO_KHOADAOTAO_ID, 'TENKHOA');
        r.DAOTAO_CHUONGTRINH_TEN = ten(CT, r.DAOTAO_TOCHUCCHUONGTRINH_ID, 'TENCHUONGTRINH');
        r.DAOTAO_KHOAQUANLY_TEN = ten(CCTC, r.DAOTAO_KHOAQUANLY_ID, 'TEN'); r.DAOTAO_COSODAOTAO_TEN = ten(COSO, r.DAOTAO_COSODAOTAO_ID, 'TEN');
        return r;
    }
    var LOAI = [dm('LL1', 'CQ', 'Chính quy', 'Loại lớp'), dm('LL2', 'N2', 'Ngành 2', 'Loại lớp')];
    var NHOM = [dm('NL1', 'A', 'Nhóm A', 'Nhóm lớp'), dm('NL2', 'B', 'Nhóm B', 'Nhóm lớp')];
    var CCTC = [{ ID: 'CC1', TEN: 'Khoa Công nghệ thông tin' }, { ID: 'CC3', TEN: 'Khoa Kinh tế' }];
    var COSO = [{ ID: 'CS1', MA: 'CS1', TEN: 'Cơ sở Hà Nội' }, { ID: 'CS2', MA: 'CS2', TEN: 'Cơ sở Hưng Yên' }];
    LOP.forEach(lam);
    function tuO(r, o) {
        ['strTen:TEN', 'strMa:MA', 'strDaoTao_KhoaDaoTao_Id:DAOTAO_KHOADAOTAO_ID', 'strDaoTao_CoSoDaoTao_Id:DAOTAO_COSODAOTAO_ID',
            'strDaoTao_ToChucCT_Id:DAOTAO_TOCHUCCHUONGTRINH_ID', 'strThoiGianBatDau:THOIGIANBATDAU', 'strThoiGianKetThuc:THOIGIANKETTHUC',
            'strNhomLop_Id:NHOMLOP_ID', 'strLoaiLop_Id:LOAILOP_ID', 'strDaoTao_KhoaQuanLy_Id:DAOTAO_KHOAQUANLY_ID',
            'dSoLuongKeHoach:SOLUONGKEHOACH', 'dLopMoNganh2:LOPMONGANH2'].forEach(function (p) {
            var k = p.split(':'); if (o[k[0]] !== undefined) r[k[1]] = o[k[0]];
        });
        return lam(r);
    }
    ums.demo.add({
        'KHCT_HeDaoTao/LayDanhSach': HE,
        'KHCT_KhoaDaoTao/LayDanhSach': function (o) { return KHOA.filter(function (x) { return !o.strDaoTao_HeDaoTao_Id || x.HE === o.strDaoTao_HeDaoTao_Id; }); },
        'KHCT_ToChucChuongTrinh/LayDanhSach': function (o) { return CT.filter(function (x) { return !o.strDaoTao_KhoaDaoTao_Id || x.KHOA === o.strDaoTao_KhoaDaoTao_Id; }); },
        'pkg_nhansu_hoso_v2.LayDanhSachToanBo': CCTC,
        'pkg_kehoach_thongtin.LayDSDaoTao_CoSoDaoTao': COSO,
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy': function (o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            var r = LOP.filter(function (x) {
                return (!q || (x.MA + ' ' + x.TEN).toLowerCase().indexOf(q) >= 0) &&
                    (!o.strDaoTao_KhoaDaoTao_Id || x.DAOTAO_KHOADAOTAO_ID === o.strDaoTao_KhoaDaoTao_Id) &&
                    (!o.strDaoTao_ToChucCT_Id || x.DAOTAO_TOCHUCCHUONGTRINH_ID === o.strDaoTao_ToChucCT_Id) &&
                    (!o.strDaoTao_LoaiLop_Id || x.LOAILOP_ID === o.strDaoTao_LoaiLop_Id) &&
                    (!o.strNhomlop_Id || x.NHOMLOP_ID === o.strNhomlop_Id);
            });
            var s = Number(o.pageSize) || 10, p = Number(o.pageIndex) || 1;
            return { rows: r.slice((p - 1) * s, p * s), pager: r.length };
        },
        'KHCT_LopQuanLy/LayChiTiet': function (o) { return LOP.filter(function (x) { return x.ID === o.strId; }); },
        'pkg_kehoach_thongtin.Them_DaoTao_LopQuanLy': function (o) {
            var r = tuO({ ID: 'LQ' + (++seq), SOLUONGTHUCTE: 0 }, o); LOP.push(r); return { rows: [], raw: { Id: r.ID } };
        },
        'pkg_kehoach_thongtin.Sua_DaoTao_LopQuanLy': function (o) {
            LOP.forEach(function (x) { if (x.ID === o.strId) tuO(x, o); }); return [];
        },
        'KHCT_LopQuanLy/Xoa': function (o) {
            var ids = String(o.strIds || '').split(',');
            for (var i = LOP.length - 1; i >= 0; i--) if (ids.indexOf(LOP[i].ID) >= 0) LOP.splice(i, 1);
            return [];
        },
        'KHCT_LopQuanLy/Sua_DaoTao_LopQuanLy_Nhom': function (o) {
            LOP.forEach(function (x) { if (x.ID === o.strDaoTao_LopQuanLy_Id) { x.NHOMLOP_ID = o.strNhomLop_Id; lam(x); } }); return [];
        }
    });
    ums.demo.add((function () { var fx = {}; fx[DM + 'KHCT.LOAILOP'] = LOAI; fx[DM + 'KHCT.NHOMLOP'] = NHOM; return fx; })());
})();
