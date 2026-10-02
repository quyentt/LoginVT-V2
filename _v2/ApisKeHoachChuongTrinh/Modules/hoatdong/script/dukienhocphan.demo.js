/* Dữ liệu mẫu cho hoatdong/dukienhocphan — chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {}, D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', T = 'PKG_KEHOACH_HOATDONG_THONGTIN.', TG = {};
    fx[D + 'KH.PHANLOAI.TINHCHAT.SOLUONG'] = [{ ID: 'TC1', MA: 'HOCMOI', TEN: 'Học mới', HESO3: 0 }, { ID: 'TC2', MA: 'HOCLAI', TEN: 'Học lại', HESO3: 0 },
        { ID: 'TC3', MA: 'CAITHIEN', TEN: 'Cải thiện', HESO3: 1 }];
    function hp(id, ma, ten) {
        return { ID: id, DAOTAO_HOCPHAN_ID: 'HP' + id, DAOTAO_HOCPHAN_MA: ma, DAOTAO_HOCPHAN_TEN: ten, HOCTRINHAPDUNGHOCTAP: 3, DAOTAO_COCAUTOCHUC_TEN: 'Bộ môn Kỹ thuật phần mềm',
            DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm', DAOTAO_KHOADAOTAO_TEN: 'K67', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', KHOIKIENTHUC_TEN: 'Chuyên ngành',
            DINHHUONG_TEN: 'Ứng dụng', THOIGIAN: '2026_2027_1', DAOTAO_THOIGIANDAOTAO_ID: 'TG1', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1', KH_NAM_CHITIET_ID: 'KHCT1',
            NGUOITAO_TAIKHOAN: 'phongdaotao', NGAYTAO_DD_MM_YYYY_HHMMSS: '18/09/2026 09:15:00' };
    }
    var DK = [hp('DK1', 'IT3100', 'Lập trình hướng đối tượng'), hp('DK2', 'IT3200', 'Cơ sở dữ liệu')];
    Object.assign(DK[0], { TONGSOLUONGBANDAU: 162, TONGSOLUONGTANGGIAM: 5, TANGGIAMKHOADEXUAT: 5, DUYETTANGGIAMKHOADEXUAT: 1, TONGSODUKIEN: 167, HANHDONG_TEN: 'Đồng ý', HANHDONG_DAOTAO_TEN: 'Đồng ý' });
    Object.assign(DK[1], { TONGSOLUONGBANDAU: 90, TONGSOLUONGTANGGIAM: 0, TONGSODUKIEN: 90, DEXUATTUKHOA: 'Có' });
    TG['HPDK1:TC1'] = { QUYMOBANDAU: 150, TANGGIAM: 5 }; TG['HPDK1:TC2'] = { QUYMOBANDAU: 12, TANGGIAM: 0 }; TG['HPDK2:TC1'] = { QUYMOBANDAU: 90, TANGGIAM: '' };
    var DX = [hp('DX1', 'IT4100', 'Trí tuệ nhân tạo')];
    Object.assign(DX[0], { NGUOITAO_TAIKHOAN: 'khoacntt', NGAYTAO_DD_MM_YYYY_HHMMSS: '20/09/2026 10:00:00' });
    var NGUON = [hp('C1', 'IT4200', 'Học máy'), hp('C2', 'IT4300', 'Xử lý ảnh')];
    fx[T + 'LayDSKH_HocPhan_DuKien'] = function () { return { rows: DK, pager: DK.length }; };
    fx[T + 'LayDSGiaTriQuyMoTheoTinhChat'] = function (o) { var v = TG[o.strDaoTao_HocPhan_Id + ':' + o.strPhanLoai_Id]; return v ? [v] : []; };
    fx[T + 'Them_KH_HocPhan_QuyMo'] = function (o) { var k = o.strDaoTao_HocPhan_Id + ':' + o.strPhanLoai_Id; TG[k] = Object.assign(TG[k] || { QUYMOBANDAU: 0 }, { TANGGIAM: o.dTangGiam }); return []; };
    fx['KHCT_HoatDong_ThongTin/Xoa_KH_HocPhan_DuKien'] = function (o) { DK = DK.filter(function (x) { return x.ID !== o.strId; }); return []; };
    fx['KHCT_HoatDong_ThongTin/LayDSKH_HocPhan_DeXuat'] = function () { return { rows: DX, pager: DX.length }; };
    fx['KHCT_HoatDong_ThongTin/Them_KH_HocPhan_DuKien_DX'] = function (o) { var n = DX.filter(function (x) { return x.ID === o.strId; })[0]; if (n) DK.push(Object.assign({}, n, { ID: 'DK' + (DK.length + 10), DEXUATTUKHOA: 'Có' })); return []; };
    fx[T + 'LayDSKH_HocPhan_CT'] = function () { return { rows: NGUON, pager: NGUON.length }; };
    fx[T + 'LayDSKH_HocPhan_DonVi'] = function () { return { rows: NGUON, pager: NGUON.length }; };
    fx['PKG_KEHOACH_HOATDONG_CHUNG.LayThoiGianTheoCTDT'] = function (o) { return o.strDaoTao_HeDaoTao_Id ? [{ ID: 'TG1', DAOTAO_THOIGIANDAOTAO: '2026_2027_1' }] : []; };
    fx[T + 'Them_KH_HocPhan_DuKien'] = function (o) { var n = NGUON.filter(function (x) { return x.DAOTAO_HOCPHAN_ID === o.strDaoTao_HocPhan_Id; })[0]; if (n) DK.push(Object.assign({}, n, { ID: 'DK' + (DK.length + 20) })); return []; };
    ums.demo.add(fx);
})();
