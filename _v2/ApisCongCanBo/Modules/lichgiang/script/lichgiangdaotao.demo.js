/* Dữ liệu mẫu cho lichgiangdaotao / lichgiangkhoa — chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {}, C = 'KHCT_LichGiang_DoiLich/', D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    fx[C + 'LayThoiGian'] = [{ ID: 'HK1', THOIGIAN: '2026_2027_1' }, { ID: 'HK2', THOIGIAN: '2025_2026_2' }];
    fx[C + 'LayDSKhoaQuanLyChuyenMon'] = function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'K1', DAOTAO_KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin' }, { ID: 'K2', DAOTAO_KHOAQUANLY_TEN: 'Khoa Kinh tế' }] : []; };
    var HP = [{ ID: 'HP1', TEN: 'Lập trình hướng đối tượng', K: 'K1' }, { ID: 'HP2', TEN: 'Cơ sở dữ liệu', K: 'K1' }, { ID: 'HP3', TEN: 'Kinh tế vi mô', K: 'K2' }];
    fx[C + 'LayDSHocPhanDuyetKhoaQuanLy'] = function (o) { return HP.filter(function (h) { return h.K === o.strDaoTao_KhoaQuanLy_Id; }); };
    fx[C + 'LayDSHocPhanMucKhoaQuanLy'] = function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? HP.slice(0, 2) : []; };
    var NG = [{ ID: 'NS1', NGUOIYEUCAU_MASO: 'CB001', NGUOIYEUCAU_HODEM: 'Nguyễn Văn', NGUOIYEUCAU_TEN: 'Hùng', HP: 'HP1' },
        { ID: 'NS2', NGUOIYEUCAU_MASO: 'CB015', NGUOIYEUCAU_HODEM: 'Trần Thị', NGUOIYEUCAU_TEN: 'Mai', HP: 'HP2' }];
    fx[C + 'LayDSNguoiGuiDuyetKhoaQuanLy'] = function (o) { return NG.filter(function (n) { return n.HP === o.strDaoTao_HocPhan_Id; }); };
    fx[C + 'LayDSNguoiGuiKhoaQuanLy'] = NG;
    var DS = [];
    for (var i = 1; i <= 14; i++) DS.push({ ID: 'YC' + i, DAOTAO_HOCPHAN_ID: HP[i % 3].ID, DAOTAO_HOCPHAN_TEN: HP[i % 3].TEN, LOPHOCPHAN_TEN: 'IT31' + (i % 3) + '0.0' + i,
        NGUOIYEUCAU_TAIKHOAN: i % 2 ? 'hungnv' : 'maitt', NGUOIYEUCAU_ID: i % 2 ? 'NS1' : 'NS2', NGAYTAO_DD_MM_YYYY: '1' + (i % 9) + '/09/2026',
        NGUOIDUYET_TAIKHOAN: i % 3 ? 'truongkhoa' : '', THOIGIANDUYET: i % 3 ? '20/09/2026' : '', TINHTRANGDUYET_TEN: i % 3 ? 'Đã duyệt' : 'Chờ duyệt',
        NGUOIXULY_TAIKHOAN: '', THOIGIANXULY: '', KETQUAXULY: 'Chờ xử lý', NOIDUNGXULY: '' });
    function loc(o) {
        var d = DS.filter(function (r) { return (!o.strDaoTao_HocPhan_Id || r.DAOTAO_HOCPHAN_ID === o.strDaoTao_HocPhan_Id) && (!o.strNguoiGuiYeuCau_Id || r.NGUOIYEUCAU_ID === o.strNguoiGuiYeuCau_Id); });
        var a = ((+o.pageIndex || 1) - 1) * (+o.pageSize || 10);
        return { rows: d.slice(a, a + (+o.pageSize || 10)), pager: d.length };
    }
    fx[C + 'LayDSLichGiang_Doi_PhamVi_XL'] = loc;
    fx[C + 'LayDSLichGiang_Doi_PhamVi_PC'] = loc;
    fx[C + 'LayTTLichGiang_Doi'] = [{ NOIDUNG: 'Đi công tác', LOPHOCPHAN_TEN: 'IT3100.01', NGAYHOC: '07/09/2026', NGAYHOC_THAYDOI: '09/09/2026', TIETBATDAU: 1, TIETBATDAU_THAYDOI: 7,
        TIETKETTHUC: 3, TIETKETTHUC_THAYDOI: 9, PHONGHOC_TEN: 'A2-301', PHONGHOC_THAYDOI_TEN: 'A2-305', GIANGVIEN_HOVATEN: 'Nguyễn Văn Hùng', GIANGVIEN_THAYDOI_HOVATEN: 'Nguyễn Văn Hùng' }];
    var LS = {};
    function ls(o) { return LS[o.strsanpham_Id] || []; }
    function them(o) {
        var t = { XN1: 'Đồng ý', XN2: 'Từ chối', CD1: 'Khoa đồng ý', CD2: 'Khoa từ chối' }[o.strTinhTrang_Id] || o.strTinhTrang_Id;
        (LS[o.strSanPham_Id] = LS[o.strSanPham_Id] || []).unshift({ TEN: t, NGUOIXACNHAN_TENDAYDU: 'Quản trị', NGAYTAO_DD_MM_YYYY: '22/09/2026' });
        DS.forEach(function (r) { if (o.strSanPham_Id.indexOf(r.ID) === 0 && (o.strSanPham_Id.length === r.ID.length || !/\d/.test(o.strSanPham_Id.charAt(r.ID.length)))) r.KETQUAXULY = t; });
        return [];
    }
    fx[C + 'LayDSTKB_XacNhanDoiLich'] = ls; fx[C + 'LayDSLichGiang_CapDoThongQua'] = ls;
    fx[C + 'Them_TKB_XacNhanDoiLich'] = them; fx[C + 'Them_LichGiang_CapDoThongQua'] = them;
    fx[C + 'LayDSTinhTrangCapDo'] = [{ ID: 'CD1', TEN: 'Khoa đồng ý' }, { ID: 'CD2', TEN: 'Khoa từ chối' }];
    fx['CMS_TienIch/ThucHienGuiEmailTheoCauTruc'] = [];
    fx[D + 'TKB.LICHGIANG.XACNHANDOILICH'] = [{ ID: 'XN1', MA: 'DY', TEN: 'Đồng ý' }, { ID: 'XN2', MA: 'TC', TEN: 'Từ chối' }];
    fx[D + 'TKB.LICHGIANG.DUYETDOILICH'] = [{ ID: 'DD1', MA: 'CD', TEN: 'Chờ duyệt' }, { ID: 'DD2', MA: 'DD', TEN: 'Đã duyệt' }];
    ums.demo.add(fx);
})();
