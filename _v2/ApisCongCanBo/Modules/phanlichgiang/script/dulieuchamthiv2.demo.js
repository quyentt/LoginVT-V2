/* Dữ liệu mẫu cho dulieuchamthi / dulieuchamthiv2 — chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {}, L = 'KHCT_LichGiang/', C = 'KHCT_DuLieuChamThi_V2/';
    fx[L + 'LayDSThoiGian'] = [{ ID: 'TG1', DAOTAO_THOIGIANDAOTAO: '2026_2027_1' }, { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: '2025_2026_2' }];
    fx[L + 'LayDSHeDaoTao'] = function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'H1', TEN: 'Đại học chính quy' }] : []; };
    fx[L + 'LayDSHocPhan'] = function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'HP1', MA: 'IT3100', TEN: 'Lập trình HĐT' }, { ID: 'HP2', MA: 'IT3200', TEN: 'Cơ sở dữ liệu' }] : []; };
    var LOP = [{ ID: 'LHP1', IDHOCPHAN: 'HP1', DAOTAO_HOCPHAN_ID: 'HP1', TENLOPHOCPHAN: 'IT3100.01', DAOTAO_HOCPHAN_MA: 'IT3100', DAOTAO_HOCPHAN_TEN: 'Lập trình HĐT', DAOTAO_HOCPHAN_SOTC: 3, SOSINHVIEN: 60, NGAYBATDAU: '01/09/2026', NGAYKETTHUC: '15/12/2026' },
        { ID: 'LHP2', IDHOCPHAN: 'HP1', DAOTAO_HOCPHAN_ID: 'HP1', TENLOPHOCPHAN: 'IT3100.02', DAOTAO_HOCPHAN_MA: 'IT3100', DAOTAO_HOCPHAN_TEN: 'Lập trình HĐT', DAOTAO_HOCPHAN_SOTC: 3, SOSINHVIEN: 55, NGAYBATDAU: '01/09/2026', NGAYKETTHUC: '15/12/2026' }];
    fx[L + 'LayDSLopHocPhan'] = function (o) { return o.strDaoTao_HocPhan_Id === 'HP1' ? { rows: LOP, pager: LOP.length } : []; };
    var CT = [{ ID: 'CT1', DANGKY_LOPHOCPHAN_ID: 'LHP1', NHANSU_HOSOCANBO_ID: 'NS1', NHANSU_HOSOCANBO_MASO: 'CB001', NHANSU_HOSOCANBO_HODEM: 'Nguyễn Văn', NHANSU_HOSOCANBO_TEN: 'Hùng',
        DAOTAO_COCAUTOCHUC_TEN: 'Khoa CNTT', DAOTAO_HOCPHAN_TEN: 'Lập trình HĐT', SOLUONG: 30, SOBAICHAM: 30, NGAYCHAMTHI: '20/12/2026', GHICHU: '' }], n = 1;
    fx[C + 'LayDanhSach'] = function (o) { return CT.filter(function (x) { return x.DANGKY_LOPHOCPHAN_ID === o.strDaoTao_LopHocPhan_Id; }); };
    fx[C + 'ThemMoi'] = function (o) { CT.push({ ID: 'CT' + (++n), DANGKY_LOPHOCPHAN_ID: o.strDangKy_LopHocPhan_Id, NHANSU_HOSOCANBO_ID: o.strNhanSu_HoSoCanBo_Id, NHANSU_HOSOCANBO_MASO: 'CB' + n,
        NHANSU_HOSOCANBO_HODEM: 'Cán bộ', NHANSU_HOSOCANBO_TEN: String(n), SOLUONG: o.dSoBaiCham, SOBAICHAM: o.dSoBaiCham, NGAYCHAMTHI: o.strNgayChamThi, GHICHU: o.strGhiChu }); return []; };
    fx[C + 'CapNhat'] = function (o) { CT.forEach(function (x) { if (x.ID === o.strId) { x.NHANSU_HOSOCANBO_ID = o.strNhanSu_HoSoCanBo_Id; x.SOLUONG = x.SOBAICHAM = o.dSoBaiCham; x.NGAYCHAMTHI = o.strNgayChamThi; x.GHICHU = o.strGhiChu; } }); return []; };
    fx[C + 'Xoa'] = function (o) { CT = CT.filter(function (x) { return x.ID !== o.strIds; }); return []; };
    ums.demo.add(fx);
})();
