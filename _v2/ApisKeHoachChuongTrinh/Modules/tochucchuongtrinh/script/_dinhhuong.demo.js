/* Dữ liệu mẫu cho khung Định hướng (ums.khctDH — tochucchuongtrinh/dinhhuong, hoatdong/dinhhuong). Chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {}, D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', P1 = 'pkg_kehoach_thongtin.', P2 = 'pkg_kehoach_thongtin2.';
    function bo(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase(); }
    function trang(rows, o) {
        var i = Number(o.pageIndex) || 1, n = Number(o.pageSize) || rows.length || 1;
        return { rows: rows.slice((i - 1) * n, i * n), pager: rows.length };
    }

    fx[D + 'DAOTAO.CTDT.DINHHUONG.CHEDO'] = [
        { ID: 'CD1', MA: 'TUCHON', TEN: 'Sinh viên tự đăng ký' },
        { ID: 'CD2', MA: 'PHANCONG', TEN: 'Nhà trường phân định hướng' }
    ];

    var DH = [
        ['DH1', 'KTPM-WEB', 'Phát triển ứng dụng Web', 'CD1', '01/09/2026', '30/09/2026'],
        ['DH2', 'KTPM-AI', 'Trí tuệ nhân tạo ứng dụng', 'CD1', '01/09/2026', '30/09/2026'],
        ['DH3', 'KTPM-NHUNG', 'Hệ thống nhúng và IoT', 'CD2', '15/09/2026', '15/10/2026'],
        ['DH4', 'QTKD-MKT', 'Quản trị marketing', 'CD1', '01/10/2026', '31/10/2026'],
        ['DH5', 'QTKD-TC', 'Quản trị tài chính doanh nghiệp', 'CD2', '01/10/2026', '31/10/2026']
    ].map(function (x) {
        var qt = x[1].indexOf('QTKD') === 0;
        return { ID: x[0], MA: x[1], TEN: x[2], CHEDODANGKYDINHHUONG_ID: x[3],
            CHEDODANGKYDINHHUONG_TEN: x[3] === 'CD1' ? 'Sinh viên tự đăng ký' : 'Nhà trường phân định hướng',
            NGAYBATDAU: x[4], NGAYKETTHUC: x[5],
            DAOTAO_HEDAOTAO_ID: 'H1', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', DAOTAO_KHOADAOTAO_ID: 'K67', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67',
            DAOTAO_TOCHUCCHUONGTRINH_ID: qt ? 'CTQTKD' : 'CTKTPM', DAOTAO_TOCHUCCHUONGTRINH_TEN: qt ? 'Quản trị kinh doanh' : 'Kỹ thuật phần mềm',
            DAOTAO_TOCHUCCHUONGTRINH_MA: qt ? '7340101' : '7480103' };
    });
    fx[P1 + 'LayDSDaoTao_CT_DinhHuong'] = function (o) {
        var q = bo(o.strTuKhoa);
        var rows = DH.filter(function (r) {
            return (!o.strDaoTao_HeDaoTao_Id || r.DAOTAO_HEDAOTAO_ID === o.strDaoTao_HeDaoTao_Id) &&
                (!o.strDaoTao_KhoaDaoTao_Id || r.DAOTAO_KHOADAOTAO_ID === o.strDaoTao_KhoaDaoTao_Id) &&
                (!o.strDaoTao_ChuongTrinh_Id || r.DAOTAO_TOCHUCCHUONGTRINH_ID === o.strDaoTao_ChuongTrinh_Id) &&
                (!q || bo(r.TEN + ' ' + r.MA).indexOf(q) >= 0);
        });
        return trang(rows, o);
    };

    var SV = [
        ['NH01', 'BIT220101', 'Nguyễn Văn', 'An', 'K67-KTPM1'],
        ['NH02', 'BIT220102', 'Trần Thị', 'Bình', 'K67-KTPM1'],
        ['NH05', 'BIT220117', 'Hoàng Đức', 'Duy', 'K67-KTPM1'],
        ['NH06', 'BIT220133', 'Vũ Thị', 'Hạnh', 'K67-KTPM2'],
        ['NH07', 'BIT220148', 'Đỗ Minh', 'Khoa', 'K67-KTPM2'],
        ['NH08', 'BIT220152', 'Bùi Thanh', 'Lam', 'K67-KTPM2']
    ].map(function (x) {
        return { QLSV_NGUOIHOC_ID: x[0], QLSV_NGUOIHOC_MASO: x[1], QLSV_NGUOIHOC_HODEM: x[2], QLSV_NGUOIHOC_TEN: x[3],
            DAOTAO_LOPQUANLY_TEN: x[4], QLSV_TRANGTHAINGUOIHOC_ID: 'TT1', QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CTKTPM' };
    });
    function sv(x, extra) { var r = {}; Object.keys(x).forEach(function (k) { r[k] = x[k]; }); Object.keys(extra).forEach(function (k) { r[k] = extra[k]; }); return r; }

    fx[P1 + 'LayDSDaoTao_CT_DinhHuong_NH'] = function (o) {
        var dh = DH.filter(function (d) { return d.ID === o.strDaoTao_CT_DinhHuong_Id; })[0];
        if (!dh || dh.DAOTAO_TOCHUCCHUONGTRINH_ID !== 'CTKTPM') return trang([], o);
        return trang(SV.slice(0, 3).map(function (x) {
            return sv(x, { ID: 'DHNH-' + x.QLSV_NGUOIHOC_ID, DAOTAO_CT_DINHHUONG_ID: dh.ID, DAOTAO_CT_DINHHUONG_TENDAYDU: dh.TEN + ' (' + dh.MA + ')' });
        }), o);
    };
    fx[P2 + 'LayDSNguoiHocChuaPhanDinhHuong'] = function (o) {
        return o.strDaoTao_ChuongTrinh_Id === 'CTKTPM' ? SV.slice(3).map(function (x) { return sv(x, { ID: 'CH-' + x.QLSV_NGUOIHOC_ID }); }) : [];
    };

    var NHOM = [
        { ID: 'NHOM1', MA: 'N01', TEN: 'Nhóm Web 1', SOSVTHUOCNHOM: 2 },
        { ID: 'NHOM2', MA: 'N02', TEN: 'Nhóm Web 2', SOSVTHUOCNHOM: 0 }
    ];
    fx[P2 + 'LayDSDaoTao_CT_DH_Nhom'] = function (o) {
        var dh = DH.filter(function (d) { return d.ID === o.strDaoTao_CT_DinhHuong_Id; })[0];
        if (!dh) return trang([], o);
        return trang(NHOM.map(function (n) { return sv(n, { DAOTAO_CT_DINHHUONG_ID: dh.ID, DAOTAO_CT_DINHHUONG_TEN: dh.TEN }); }), o);
    };
    fx[P2 + 'LayDSDaoTao_CT_DH_Nhom_NH'] = function (o) {
        return o.strDaoTao_CT_DH_Nhom_Id === 'NHOM1' ? SV.slice(0, 2).map(function (x) { return sv(x, { ID: 'NNH-' + x.QLSV_NGUOIHOC_ID }); }) : [];
    };
    fx[P2 + 'LayDSDaoTao_CT_DH_ChuaNhom_NH'] = function (o) {
        return o.strDaoTao_CT_DinhHuong_Id ? [sv(SV[2], { ID: 'CN-' + SV[2].QLSV_NGUOIHOC_ID, DAOTAO_CT_DINHHUONG_ID: o.strDaoTao_CT_DinhHuong_Id })] : [];
    };

    ums.demo.add(fx);
})();
