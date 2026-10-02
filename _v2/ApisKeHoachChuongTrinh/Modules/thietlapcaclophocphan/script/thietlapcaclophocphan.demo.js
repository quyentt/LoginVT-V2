/* Dữ liệu mẫu cho thietlapcaclophocphan — chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {}, D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    var TG = [{ ID: 'TG261', DAOTAO_THOIGIANDAOTAO: '2026_2027_1' }, { ID: 'TG262', DAOTAO_THOIGIANDAOTAO: '2026_2027_2' }];
    var PL = [{ ID: 'PLL1', MA: 'LT', TEN: 'Lớp lý thuyết' }, { ID: 'PLL2', MA: 'TH', TEN: 'Lớp thực hành' }];
    var PV = [{ ID: 'PV1', MA: 'TRONG', TEN: 'Trong khoa' }, { ID: 'PV2', MA: 'NGOAI', TEN: 'Liên khoa' }];
    var CT = [
        { ID: 'CT1', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', DAOTAO_KHOADAOTAO_TEN: 'Khóa 2025', CHUONGTRINH_TEN: 'Kỹ thuật phần mềm' },
        { ID: 'CT2', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', DAOTAO_KHOADAOTAO_TEN: 'Khóa 2024', CHUONGTRINH_TEN: 'Quản trị kinh doanh' }
    ];
    var LOP = [
        { ID: 'L1', CT: 'CT1', TENLOPHOCPHAN_DAYDU: 'IT3100 - Lập trình hướng đối tượng - Lớp 01', PHANLOAITINHKHOILUONG_ID: 'PLL1', PHANLOAITINHKHOILUONG_TEN: 'Lớp lý thuyết', PHANLOAIPHAMVI_TEN: 'Trong khoa' },
        { ID: 'L2', CT: 'CT1', TENLOPHOCPHAN_DAYDU: 'IT3100 - Lập trình hướng đối tượng - Lớp 02', PHANLOAITINHKHOILUONG_TEN: '', PHANLOAIPHAMVI_TEN: '' },
        { ID: 'L3', CT: 'CT2', TENLOPHOCPHAN_DAYDU: 'BA2000 - Quản trị học - Lớp 01', PHANLOAITINHKHOILUONG_TEN: '', PHANLOAIPHAMVI_TEN: '' }
    ];
    function ten(arr, id) { var x = arr.filter(function (r) { return r.ID === id; })[0]; return x ? x.TEN : ''; }
    fx['KHCT_ThoiGianDaoTao/LayDanhSach'] = function () { return { rows: TG, pager: TG.length }; };
    fx[D + 'KLGD.PHANLOAITINHKHOILUONG'] = PL;
    fx[D + 'KLGD_PHANLOAIPHAMVI'] = PV;
    fx['KHCT_LichGiang/LayDSChuongTrinh'] = function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? CT : []; };
    fx['KHCT_LichGiang/LayDSLopHocPhan'] = function (o) { return LOP.filter(function (r) { return r.CT === o.strDaoTao_ChuongTrinh_Id; }); };
    fx['KHCT_LichGiang/Sua_ThongTinLopHocPhan'] = function (o) {
        LOP.forEach(function (r) { if (r.ID === o.strIdLopHocPhan) r.PHANLOAITINHKHOILUONG_TEN = ten(PL, o.strPhanLoaiLopTinhKL_Id); });
        return [];
    };
    fx['KHCT_LichGiang/Sua_PhamViLopHocPhan'] = function (o) {
        LOP.forEach(function (r) { if (r.ID === o.strIdLopHocPhan) r.PHANLOAIPHAMVI_TEN = ten(PV, o.strPhanLoaiPhamVi_Id); });
        return [];
    };
    ums.demo.add(fx);
})();
