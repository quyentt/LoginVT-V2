/* Dữ liệu mẫu cho KHCT phanlichgiang/dulieuthucdia — chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {}, L = 'KHCT_LichGiang/', TD = 'KHCT_DuLieuThucDiaCD_v2/';
    var HP = [{ ID: 'HP1', MA: 'IT3100', TEN: 'Lập trình HĐT', SOTC: 3 }, { ID: 'HP2', MA: 'IT3200', TEN: 'Cơ sở dữ liệu', SOTC: 3 }, { ID: 'HP3', MA: 'NN1010', TEN: 'Thực tập lâm sinh', SOTC: 2 }];
    fx['KHCT_ThoiGianDaoTao/LayDanhSach'] = [{ ID: 'TG1', DAOTAO_THOIGIANDAOTAO: '2026_2027_1' }, { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: '2025_2026_2' }];
    fx[L + 'LayDSHeDaoTao'] = function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'H1', TEN: 'Đại học chính quy', MA: 'DHCQ' }] : []; };
    fx[L + 'LayDSHocPhan'] = function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? HP.slice(0, 2) : []; };
    fx['KHCT_HocPhan/LayDanhSach'] = function (o) {
        var q = (o.strTuKhoa || '').toLowerCase();
        var ds = HP.filter(function (x) { return !q || (x.MA + ' ' + x.TEN).toLowerCase().indexOf(q) >= 0; });
        return { rows: ds, pager: ds.length };
    };
    var DS = [{ ID: 'TD1', NHANSU_HOSOCANBO_ID: 'NS1', DAOTAO_COCAUTOCHUC_TEN: 'Ban Giám hiệu', NHANSU_HOSOCANBO_MASO: 'CB001', NHANSU_HOSOCANBO_HODEM: 'Nguyễn Văn',
        NHANSU_HOSOCANBO_TEN: 'Hùng', DAOTAO_HOCPHAN_ID: 'HP1', DAOTAO_HOCPHAN_TEN: 'Lập trình HĐT', SOLUONG: 8, NGAYBATDAU: '05/10/2026', NGAYKETTHUC: '06/10/2026', SOLUONGHSSV: 40, GHICHU: 'K65' }];
    var seq = 2;
    fx[TD + 'LayDanhSach'] = function (o) { return DS.filter(function (x) { return x.DAOTAO_HOCPHAN_ID === o.strDaoTao_HocPhan_Id; }); };
    function ghi(x, o) { x.SOLUONG = o.dSoLuong; x.NGAYBATDAU = o.strNgayBatDau; x.NGAYKETTHUC = o.strNgayKetThuc; x.SOLUONGHSSV = o.dSoLuongHSSV; x.GHICHU = o.strGhiChu; }
    fx[TD + 'ThemMoi'] = function (o) {
        var hp = HP.filter(function (h) { return h.ID === o.strDaoTao_HocPhan_Id; })[0] || {};
        var x = { ID: 'TD' + (seq++), NHANSU_HOSOCANBO_ID: o.strNhanSu_HoSoCanBo_Id, DAOTAO_COCAUTOCHUC_TEN: 'Khoa Công nghệ thông tin', NHANSU_HOSOCANBO_MASO: o.strNhanSu_HoSoCanBo_Id,
            NHANSU_HOSOCANBO_HODEM: 'Cán bộ', NHANSU_HOSOCANBO_TEN: o.strNhanSu_HoSoCanBo_Id, DAOTAO_HOCPHAN_ID: o.strDaoTao_HocPhan_Id, DAOTAO_HOCPHAN_TEN: hp.TEN };
        ghi(x, o); DS.push(x); return [];
    };
    fx[TD + 'CapNhat'] = function (o) { DS.forEach(function (x) { if (x.ID === o.strId) ghi(x, o); }); return []; };
    fx[TD + 'Xoa'] = function (o) { DS = DS.filter(function (x) { return x.ID !== o.strIds; }); return []; };
    ums.demo.add(fx);
})();
