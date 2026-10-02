/* Dữ liệu mẫu cho hoatdong/dukienhocphan — chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {}, D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    var P = 'PKG_KEHOACH_HOATDONG_', T = P + 'THONGTIN.';
    fx[P + 'CHUNG.LayDSNam'] = [{ ID: 'N2026', NAM: '2026' }];
    fx[P + 'KEHOACH.LayDSKH_Nam_TongHop'] = function (o) { return o.strNam ? [{ ID: 'KHN1', TEN: 'Kế hoạch đào tạo năm 2026' }] : []; };
    fx[P + 'KEHOACH.LayDSKH_Nam_ChiTietTheo'] = function (o) { return o.strKH_Nam_TongHop_Id ? [{ ID: 'KHCT1', TEN: 'Học kỳ 1 năm 2026' }] : []; };
    function hp(id, ma, ten, tg) {
        return { ID: id, DAOTAO_HOCPHAN_ID: 'HP' + id, DAOTAO_HOCPHAN_MA: ma, DAOTAO_HOCPHAN_TEN: ten, HOCTRINHAPDUNGHOCTAP: 3, DAOTAO_COCAUTOCHUC_TEN: 'Bộ môn KTPM',
            DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm', DAOTAO_KHOADAOTAO_TEN: 'K67', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', KHOIKIENTHUC_TEN: 'Chuyên ngành',
            DINHHUONG_TEN: 'Ứng dụng', THOIGIAN: tg ? '2026_2027_1' : '', DAOTAO_THOIGIANDAOTAO_ID: tg ? 'TG1' : '', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1' };
    }
    var DK = [hp('DK1', 'IT3100', 'Lập trình hướng đối tượng', true), hp('DK2', 'IT3200', 'Cơ sở dữ liệu', false)];
    DK[0].SOSVCHUAHOANTHANH = 12; DK[0].SOSVDUDKHOC = 150; DK[0].TONGSOLUONGBANDAU = 162; DK[0].TONGSOLUONGTANGGIAM = 0; DK[0].TONGSODUKIEN = 162; DK[0].TANGGIAMKHOADEXUAT = 5; DK[0].HANHDONG_TEN = 'Đồng ý';
    DK[1].SOSVDUDKHOC = 90; DK[1].TONGSOLUONGBANDAU = 90; DK[1].TONGSODUKIEN = 90;
    var DX = [hp('DX1', 'IT4100', 'Trí tuệ nhân tạo', true)];
    DX[0].NGUOITAO_TAIKHOAN = 'khoacntt'; DX[0].NGAYTAO_DD_MM_YYYY_HHMMSS = '20/09/2026 10:00:00';
    fx[T + 'LayDSKH_HocPhan_DuKien'] = function () { return { rows: DK, pager: DK.length }; };
    fx['KHCT_HoatDong_ThongTin/LayDSKH_HocPhan_DeXuat'] = function () { return { rows: DX, pager: DX.length }; };
    fx[T + 'CapNhatTangGiamKhoaDeXuat'] = function (o) { DK.forEach(function (r) { if (r.ID === o.strKH_HocPhan_DuKien_Id) r.TANGGIAMKHOADEXUAT = o.dTangGiamKhoaDeXuat; }); return []; };
    fx[T + 'LayDSThoiGianTheo'] = [{ ID: 'TG1', THOIGIAN: '2026_2027_1' }, { ID: 'TG2', THOIGIAN: '2026_2027_2' }];
    fx[T + 'Sua_KH_HocPhan_DuKien'] = function (o) { DK.forEach(function (r) { if (r.ID === o.strKH_HocPhan_DuKien_Id) { r.DAOTAO_THOIGIANDAOTAO_ID = o.strDaoTao_ThoiGianDaoTao_Id; r.THOIGIAN = o.strDaoTao_ThoiGianDaoTao_Id === 'TG2' ? '2026_2027_2' : '2026_2027_1'; } }); return []; };
    fx[D + 'KH.KHOA.HOCPHAN.XACNHAN'] = [{ ID: 'XN1', MA: 'DY', TEN: 'Đồng ý' }, { ID: 'XN0', MA: 'KDY', TEN: 'Không đồng ý' }];
    fx[P + 'XACNHAN.LayDSKH_Khoa_HP_XacNhan'] = [];
    fx[P + 'XACNHAN.Them_KH_Khoa_HP_XacNhan'] = function (o) { DK.forEach(function (r) { if (r.ID === o.strSanPham_Id) r.HANHDONG_TEN = o.strHanhDong_Id === 'XN1' ? 'Đồng ý' : 'Không đồng ý'; }); return []; };
    var NGUON = [hp('C1', 'IT4200', 'Học máy', false), hp('C2', 'IT4300', 'Xử lý ảnh', false)];
    fx[T + 'LayDSKH_HocPhan_CT'] = function () { return { rows: NGUON, pager: NGUON.length }; };
    fx[T + 'LayDSKH_HocPhan_DonVi'] = function () { return { rows: NGUON, pager: NGUON.length }; };
    fx[P + 'CHUNG.LayThoiGianTheoCTDT'] = function (o) { return o.strDaoTao_HeDaoTao_Id ? [{ ID: 'TG1', DAOTAO_THOIGIANDAOTAO: '2026_2027_1' }] : []; };
    fx[T + 'Them_KH_HocPhan_DeXuat'] = function (o) { var n = NGUON.filter(function (x) { return x.DAOTAO_HOCPHAN_ID === o.strDaoTao_HocPhan_Id; })[0]; if (n) DX.push(Object.assign({}, n, { ID: 'DX' + (DX.length + 1) })); return []; };
    fx[T + 'Xoa_KH_HocPhan_DeXuat'] = function (o) { DX = DX.filter(function (x) { return x.ID !== o.strId; }); return []; };
    ums.demo.add(fx);
})();
