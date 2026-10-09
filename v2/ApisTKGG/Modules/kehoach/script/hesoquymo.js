/* =========================================================================
   Khai hệ số quy mô theo dải (Thống kê giờ giảng → Tổng hợp giờ)
   Bản gốc: ApisTKGG/Modules/kehoach/html/hesoquymo.html + script/hesoquymo.js (370 dòng) — khung chung _heso.js (ums.tkggHeSo).
   Lời gọi (POST mã hoá, có func):
       NS_KLGD_ThongTin_MH/DSA4BRIKDQYFHgkkEi4eEDQ4DC4SLg00Li8m  PKG_KLGV_V2_THONGTIN.LayDSKLGD_HeSo_QuyMoSoLuong   strLoaiBang_Id, strDaoTao_ThoiGianDaoTao_Id
       NS_KLGD_ThongTin_MH/FSkkLB4KDQYFHgkkEi4eEDQ4DC4SLg00Li8m  …Them_KLGD_HeSo_QuyMoSoLuong | EjQgHgoNBgUeCSQSLh4QNDgMLhIuDTQuLyYP …Sua_… khi có strId
       NS_KLGD_ThongTin_MH/GS4gHgoNBgUeCSQSLh4QNDgMLhIuDTQuLyYP  …Xoa_KLGD_HeSo_QuyMoSoLuong  strId — mỗi dòng một lời gọi
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('tkgg-hesoquymo');
    if (!root) return;
    ums.tkggHeSo(root, {
        title: 'Khai hệ số quy mô theo dải', khoang: true, locPhanLoai: true,
        list: { action: 'NS_KLGD_ThongTin_MH/DSA4BRIKDQYFHgkkEi4eEDQ4DC4SLg00Li8m', func: 'PKG_KLGV_V2_THONGTIN.LayDSKLGD_HeSo_QuyMoSoLuong' },
        them: { action: 'NS_KLGD_ThongTin_MH/FSkkLB4KDQYFHgkkEi4eEDQ4DC4SLg00Li8m', func: 'PKG_KLGV_V2_THONGTIN.Them_KLGD_HeSo_QuyMoSoLuong', method: 'POST' },
        sua: { action: 'NS_KLGD_ThongTin_MH/EjQgHgoNBgUeCSQSLh4QNDgMLhIuDTQuLyYP', func: 'PKG_KLGV_V2_THONGTIN.Sua_KLGD_HeSo_QuyMoSoLuong', method: 'POST' },
        xoa: { action: 'NS_KLGD_ThongTin_MH/GS4gHgoNBgUeCSQSLh4QNDgMLhIuDTQuLyYP', func: 'PKG_KLGV_V2_THONGTIN.Xoa_KLGD_HeSo_QuyMoSoLuong', method: 'POST' }
    });
})();
