/* Dữ liệu mẫu cho hoatdongchung (kehoach, kehoachchitiet) — chỉ dùng ở chế độ dựng thử.
   Tài khoản / tên người là dữ liệu bịa. */
(function () {
    var fx = {}, P = 'PKG_KEHOACH_HOATDONG_', KH = P + 'KEHOACH.', TT = P + 'THONGTIN.';
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    var dem = 100;
    function moiId() { dem++; return 'KHC' + dem; }
    function xoaTheo(arr, id) { for (var i = arr.length - 1; i >= 0; i--) if (arr[i].ID === id) arr.splice(i, 1); }

    var NAM = [{ ID: 'N2026', NAM: '2026' }];
    var TG = [
        { ID: 'TG261', DAOTAO_THOIGIANDAOTAO: '2026_2027_1' },
        { ID: 'TG262', DAOTAO_THOIGIANDAOTAO: '2026_2027_2' },
        { ID: 'TG263', DAOTAO_THOIGIANDAOTAO: '2026_2027_3' }
    ];
    var PL = [{ ID: 'PL1', MA: 'DAOTAO', TEN: 'Kế hoạch đào tạo' }, { ID: 'PL2', MA: 'TUYENSINH', TEN: 'Kế hoạch tuyển sinh' }];
    var CD = [{ ID: 'CD1', MA: 'CHINH', TEN: 'Học kỳ chính' }, { ID: 'CD2', MA: 'PHU', TEN: 'Học kỳ phụ' }];
    function tenPL(id) { var x = PL.filter(function (p) { return p.ID === id; })[0]; return x ? x.TEN : ''; }
    function tenTG(id) { var x = TG.filter(function (p) { return p.ID === id; })[0]; return x ? x.DAOTAO_THOIGIANDAOTAO : ''; }

    var KHN = [
        { ID: 'KHN1', NAM: '2026', TEN: 'Kế hoạch đào tạo năm 2026', MA: 'KHDT2026', TUNGAY: '01/01/2026', DENNGAY: '31/12/2026',
          HIEULUC: 1, KHOADULIEU: 0, PHANLOAI_ID: 'PL1', PHANLOAI_TEN: 'Kế hoạch đào tạo', NGAYTAO_DD_MM_YYYY_HHMMSS: '05/01/2026 08:30:00', NGUOITAO_TAIKHOAN: 'phongdaotao' }
    ];
    var KHN_TG = [{ ID: 'KT1', KH_NAM_TONGHOP_ID: 'KHN1', DAOTAO_THOIGIANDAOTAO_ID: 'TG261' }];
    var KHCT = [
        { ID: 'KC1', KH_NAM_TONGHOP_ID: 'KHN1', KH_NAM_TONGHOP_TEN: 'Kế hoạch đào tạo năm 2026', NAM: '2026', TEN: 'Kế hoạch học kỳ 1 năm học 2026-2027', MA: 'KHCT-HK1',
          DAOTAO_THOIGIANDAOTAO_ID: 'TG261', THOIGIAN: '2026_2027_1', TUNGAY: '15/08/2026', DENNGAY: '15/01/2027', HIEULUC: 1, KHOADULIEU: 0,
          PHANLOAI_ID: 'PL1', PHANLOAI_TEN: 'Kế hoạch đào tạo', CHEDOAPDUNG_ID: 'CD1', CHEDOAPDUNG_TEN: 'Học kỳ chính',
          NGAYTAO_DD_MM_YYYY_HHMMSS: '10/06/2026 09:00:00', NGUOITAO_TAIKHOAN: 'phongdaotao' }
    ];
    var ND = [
        { ID: 'NS1', KH_ID: 'KHN1', NGUOIDUNG_TAIKHOAN: 'cb001', NGUOIDUNG_TENDAYDU: 'Nguyễn Văn Minh', DAOTAO_COCAUTOCHUC_TEN: 'Phòng Đào tạo' }
    ];
    var NDC = [
        { ID: 'NC1', KH_ID: 'KC1', NGUOIDUNG_TAIKHOAN: 'cb002', NGUOIDUNG_TENDAYDU: 'Trần Thị Lan', DAOTAO_COCAUTOCHUC_TEN: 'Khoa Công nghệ thông tin' }
    ];
    var NGUOI = [
        { ID: 'U1', TAIKHOAN: 'cb003', TENDAYDU: 'Lê Văn Hùng', GIOITINH_TEN: 'Nam', HINHDAIDIEN: '' },
        { ID: 'U2', TAIKHOAN: 'cb004', TENDAYDU: 'Phạm Thu Hà', GIOITINH_TEN: 'Nữ', HINHDAIDIEN: '' }
    ];
    function hp(id, ma, ten) {
        return { ID: id, DAOTAO_HOCPHAN_MA: ma, DAOTAO_HOCPHAN_TEN: ten, HOCTRINHAPDUNGHOCTAP: 3, DAOTAO_COCAUTOCHUC_TEN: 'Bộ môn Kỹ thuật phần mềm',
            DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm', DAOTAO_KHOADAOTAO_TEN: 'Khóa 2025', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy',
            KHOIKIENTHUC_TEN: 'Chuyên ngành', DINHHUONG_TEN: 'Ứng dụng', THOIGIAN: '2026_2027_1' };
    }
    var DK = [hp('DK1', 'IT3100', 'Lập trình hướng đối tượng'), hp('DK2', 'IT3200', 'Cơ sở dữ liệu')];
    var DX = [hp('DX1', 'IT4100', 'Trí tuệ nhân tạo')];
    DX[0].NGUOITAO_TAIKHOAN = 'khoacntt'; DX[0].NGUOITAO_DONVI_TEN = 'Khoa Công nghệ thông tin'; DX[0].NGAYTAO_DD_MM_YYYY_HHMMSS = '20/09/2026 10:00:00';

    fx[P + 'CHUNG.LayDSNam'] = NAM;
    fx[D + 'KH.NAM.PHANLOAI'] = PL;
    fx[D + 'KH.NAM.CHEDOAPDUNG'] = CD;
    fx['KHCT_ThoiGianDaoTao/LayDanhSach'] = function () { return { rows: TG, pager: TG.length }; };

    /* Kế hoạch năm */
    fx[KH + 'LayDSKH_Nam_TongHop'] = function (o) {
        var n = NAM.filter(function (x) { return x.ID === o.strNam; })[0];
        return KHN.filter(function (r) { return !o.strNam || !n || r.NAM === n.NAM; });
    };
    function ghiKHN(o, r) {
        var n = NAM.filter(function (x) { return x.ID === o.strNam; })[0];
        r.NAM = n ? n.NAM : ''; r.TEN = o.strTen; r.MA = o.strMa; r.TUNGAY = o.strTuNgay; r.DENNGAY = o.strDenNgay;
        r.HIEULUC = Number(o.dHieuLuc); r.KHOADULIEU = Number(o.dKhoaDuLieu); r.PHANLOAI_ID = o.strPhanLoai_Id; r.PHANLOAI_TEN = tenPL(o.strPhanLoai_Id);
        return r;
    }
    fx[KH + 'Them_KH_Nam_TongHop'] = function (o) {
        var r = ghiKHN(o, { ID: moiId(), NGAYTAO_DD_MM_YYYY_HHMMSS: '27/09/2026 08:00:00', NGUOITAO_TAIKHOAN: 'demo' });
        KHN.push(r);
        return { rows: [], raw: { Id: r.ID } };
    };
    fx[KH + 'Sua_KH_Nam_TongHop'] = function (o) { KHN.forEach(function (r) { if (r.ID === o.strId) ghiKHN(o, r); }); return []; };
    fx[KH + 'Xoa_KH_Nam_TongHop'] = function (o) { xoaTheo(KHN, o.strId); return []; };
    fx[KH + 'LayDSKH_Nam_ThoiGian'] = function (o) { return KHN_TG.filter(function (r) { return r.KH_NAM_TONGHOP_ID === o.strKH_Nam_TongHop_Id; }); };
    fx[KH + 'Them_KH_Nam_ThoiGian'] = function (o) {
        var id = moiId();
        KHN_TG.push({ ID: id, KH_NAM_TONGHOP_ID: o.strKH_Nam_TongHop_Id, DAOTAO_THOIGIANDAOTAO_ID: o.strDaoTao_ThoiGianDaoTao_Id });
        return { rows: [], raw: { Id: id } };
    };
    fx[KH + 'Xoa_KH_Nam_ThoiGian'] = function (o) { xoaTheo(KHN_TG, o.strId); return []; };
    fx[KH + 'LayDSKH_Nam_ChiTietTheo'] = function (o) { return KHCT.filter(function (r) { return r.KH_NAM_TONGHOP_ID === o.strKH_Nam_TongHop_Id; }); };
    fx[KH + 'LayDSKH_Nam_NhanSu'] = function (o) { return ND.filter(function (r) { return r.KH_ID === o.strKH_Nam_TongHop_Id; }); };
    fx[KH + 'Them_KH_Nam_NhanSu'] = function (o) {
        var u = NGUOI.filter(function (x) { return x.ID === o.strNguoiDung_Id; })[0] || {};
        ND.push({ ID: moiId(), KH_ID: o.strKH_Nam_TongHop_Id, NGUOIDUNG_TAIKHOAN: u.TAIKHOAN, NGUOIDUNG_TENDAYDU: u.TENDAYDU, DAOTAO_COCAUTOCHUC_TEN: 'Phòng Đào tạo' });
        return [];
    };
    fx[KH + 'Xoa_KH_Nam_NhanSu'] = function (o) { xoaTheo(ND, o.strId); return []; };

    /* Kế hoạch chi tiết */
    fx[KH + 'LayDSKH_Nam_ChiTiet'] = function (o) {
        var q = String(o.strTuKhoa || '').toLowerCase();
        return KHCT.filter(function (r) {
            return (!o.strKH_Nam_TongHop_Id || r.KH_NAM_TONGHOP_ID === o.strKH_Nam_TongHop_Id) &&
                (!o.strKH_Nam_ChiTiet_Id || r.ID === o.strKH_Nam_ChiTiet_Id) &&
                (!q || (r.TEN + ' ' + r.MA).toLowerCase().indexOf(q) >= 0);
        });
    };
    function ghiKC(o, r) {
        var n = KHN.filter(function (x) { return x.ID === o.strKH_Nam_TongHop_Id; })[0];
        var cd = CD.filter(function (x) { return x.ID === o.strCheDoApDung_Id; })[0];
        r.KH_NAM_TONGHOP_ID = o.strKH_Nam_TongHop_Id; r.KH_NAM_TONGHOP_TEN = n ? n.TEN : '';
        r.TEN = o.strTen; r.MA = o.strMa; r.TUNGAY = o.strTuNgay; r.DENNGAY = o.strDenNgay;
        r.HIEULUC = Number(o.dHieuLuc); r.KHOADULIEU = Number(o.dKhoaDuLieu);
        r.PHANLOAI_ID = o.strPhanLoai_Id; r.PHANLOAI_TEN = tenPL(o.strPhanLoai_Id);
        r.CHEDOAPDUNG_ID = o.strCheDoApDung_Id; r.CHEDOAPDUNG_TEN = cd ? cd.TEN : '';
        r.DAOTAO_THOIGIANDAOTAO_ID = o.strDaoTao_ThoiGianDaoTao_Id; r.THOIGIAN = tenTG(o.strDaoTao_ThoiGianDaoTao_Id);
        return r;
    }
    fx[KH + 'Them_KH_Nam_ChiTiet'] = function (o) {
        var r = ghiKC(o, { ID: moiId(), NGAYTAO_DD_MM_YYYY_HHMMSS: '27/09/2026 08:00:00', NGUOITAO_TAIKHOAN: 'demo' });
        KHCT.push(r);
        return { rows: [], raw: { Id: r.ID } };
    };
    fx[KH + 'Sua_KH_Nam_ChiTiet'] = function (o) { KHCT.forEach(function (r) { if (r.ID === o.strId) ghiKC(o, r); }); return []; };
    fx[KH + 'Xoa_KH_Nam_ChiTiet'] = function (o) { xoaTheo(KHCT, o.strId); return []; };
    fx[KH + 'LayDSKH_Nam_ChiTiet_NhanSu'] = function (o) { return NDC.filter(function (r) { return r.KH_ID === o.strKH_Nam_ChiTiet_Id; }); };
    fx[KH + 'Them_KH_Nam_ChiTiet_NhanSu'] = function (o) {
        var u = NGUOI.filter(function (x) { return x.ID === o.strNguoiDung_Id; })[0] || {};
        NDC.push({ ID: moiId(), KH_ID: o.strKH_Nam_ChiTiet_Id, NGUOIDUNG_TAIKHOAN: u.TAIKHOAN, NGUOIDUNG_TENDAYDU: u.TENDAYDU, DAOTAO_COCAUTOCHUC_TEN: 'Phòng Đào tạo' });
        return [];
    };
    fx[KH + 'Xoa_KH_Nam_ChiTiet_NhanSu'] = function (o) { xoaTheo(NDC, o.strId); return []; };
    fx[P + 'CHUNG.LayDSThoiGianTheoKeHoach'] = function (o) {
        var ids = KHN_TG.filter(function (r) { return r.KH_NAM_TONGHOP_ID === o.strKH_Nam_TongHop_Id; }).map(function (r) { return r.DAOTAO_THOIGIANDAOTAO_ID; });
        return TG.filter(function (t) { return ids.indexOf(t.ID) >= 0; }).map(function (t) { return { ID: t.ID, THOIGIAN: t.DAOTAO_THOIGIANDAOTAO }; });
    };
    fx[TT + 'LayDSKH_HocPhan_DuKien'] = function (o) { return o.strKH_Nam_ChiTiet_Id ? { rows: DK, pager: DK.length } : []; };
    fx[TT + 'LayDSKH_HocPhan_DeXuat'] = function (o) { return o.strKH_Nam_ChiTiet_Id ? { rows: DX, pager: DX.length } : []; };

    /* Hộp chọn người dùng (ums.tlKh.pickNguoiDung) */
    fx['pkg_chung_quanlynguoidung.LayDanhSachNguoiDung'] = function (o) {
        var q = String(o.strTuKhoa || '').toLowerCase();
        var ds = NGUOI.filter(function (r) { return !q || (r.TAIKHOAN + ' ' + r.TENDAYDU).toLowerCase().indexOf(q) >= 0; });
        return { rows: ds, pager: ds.length };
    };
    ums.demo.add(fx);
})();
