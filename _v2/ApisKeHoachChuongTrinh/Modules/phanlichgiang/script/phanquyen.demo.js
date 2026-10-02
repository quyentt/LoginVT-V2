/* Dữ liệu mẫu cho KHCT phanlichgiang/phanquyen — chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {}, L = 'KHCT_LichGiang/', PQ = 'KHCT_PhanQuyen_HanhDong/';
    var kho = { 'ND1|LHP1|HD1': 'Q1' }, seq = 2;
    fx['KHCT_ThoiGianDaoTao/LayDanhSach'] = [{ ID: 'TG1', DAOTAO_THOIGIANDAOTAO: '2026_2027_1' }, { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: '2025_2026_2' }];
    fx[L + 'LayDSHeDaoTao'] = function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'H1', TEN: 'Đại học chính quy', MA: 'DHCQ' }] : []; };
    fx[L + 'LayDSHocPhan'] = function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'HP1', MA: 'IT3100', TEN: 'Lập trình HĐT', SOTC: 3 }, { ID: 'HP2', MA: 'IT3200', TEN: 'Cơ sở dữ liệu', SOTC: 3 }] : []; };
    fx[PQ + 'LayDSChucNangCanPhanQuyen'] = [{ ID: 'CNPQ1', PHANQUYEN_CHUCNANG_TEN: 'Phân lịch giảng' }];
    fx[PQ + 'LayDSHanhDongTheo'] = function (o) { return o.strPhanQuyen_ChucNang_Id ? [{ ID: 'HD1', HANHDONG_TEN: 'Được sửa' }, { ID: 'HD2', HANHDONG_TEN: 'Được xem' }] : []; };
    fx[PQ + 'LayDSNguoiDungTheoChucNang'] = [{ ID: 'ND1', FULLNAME: 'Nguyễn Văn Hùng', NAME: 'hungnv' }, { ID: 'ND2', FULLNAME: 'Trần Thị Mai', NAME: 'maitt' }];
    fx['KHCT_PhanQuyen_ThongTin/LayDanhSach'] = [
        { THANHPHAN_ID: 'K1', THANHPHAN_CHA_ID: null, THANHPHAN_TEN: 'Khoa Công nghệ thông tin' },
        { THANHPHAN_ID: 'HP1', THANHPHAN_CHA_ID: 'K1', THANHPHAN_TEN: 'IT3100 - Lập trình HĐT' },
        { THANHPHAN_ID: 'LHP1', THANHPHAN_CHA_ID: 'HP1', THANHPHAN_TEN: 'IT3100.01' },
        { THANHPHAN_ID: 'LHP2', THANHPHAN_CHA_ID: 'HP1', THANHPHAN_TEN: 'IT3100.02' },
        { THANHPHAN_ID: 'HP2', THANHPHAN_CHA_ID: 'K1', THANHPHAN_TEN: 'IT3200 - Cơ sở dữ liệu' },
        { THANHPHAN_ID: 'LHP3', THANHPHAN_CHA_ID: 'HP2', THANHPHAN_TEN: 'IT3200.01' }];
    fx['KHCT_PhanQuyen_ThongTin/LayDSQuyenTheoNguoiDung'] = function (o) {
        return ['ND1', 'ND2'].map(function (nd) { var q = kho[nd + '|' + o.strLopHocPhan_Id + '|' + o.strHanhDong_Id] || null; return { ID: nd, QUYEN: q ? 1 : 0, QUYEN_ID: q }; });
    };
    fx['KHCT_PhanQuyen_DuLieu/ThemMoi'] = function (o) { kho[o.strNguoiDung_Id + '|' + o.strToHopBoDuLieuQuyen + '|' + o.strHanhDong_Id] = 'Q' + (seq++); return []; };
    fx['KHCT_PhanQuyen_DuLieu/Xoa'] = function (o) { Object.keys(kho).forEach(function (k) { if (kho[k] === o.strIds) delete kho[k]; }); return []; };
    ums.demo.add(fx);
})();
