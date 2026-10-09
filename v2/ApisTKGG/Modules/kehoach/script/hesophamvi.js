/* =========================================================================
   Khai hệ số theo phạm vi (Thống kê giờ giảng → Tổng hợp giờ)
   Bản gốc: ApisTKGG/Modules/kehoach/html/hesophamvi.html + script/hesophamvi.js (358 dòng) — khung chung _heso.js (ums.tkggHeSo).
   Lời gọi (POST mã hoá, có func):
       NS_KLGD_ThongTin_MH/DSA4BRIKDQYFHgkkEi4eESkgLBcoADEFNC8m  PKG_KLGV_V2_THONGTIN.LayDSKLGD_HeSo_PhamViApDung   strDaoTao_ThoiGianDaoTao_Id
       NS_KLGD_ThongTin_MH/FSkkLB4KDQYFHgkkEi4eESkgLBcoADEFNC8m  …Them_KLGD_HeSo_PhamViApDung | EjQgHgoNBgUeCSQSLh4RKSAsFygAMQU0LyYP …Sua_… khi có strId
       NS_KLGD_ThongTin_MH/GS4gHgoNBgUeCSQSLh4RKSAsFygAMQU0LyYP  …Xoa_KLGD_HeSo_PhamViApDung  strId
   Giữ như gốc: dSoBatDau / dSoKetThuc gửi '' (html gốc không có hai ô đó).
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('tkgg-hesophamvi');
    if (!root) return;
    ums.tkggHeSo(root, {
        title: 'Khai hệ số theo phạm vi', khoang: false, locPhanLoai: false,
        list: { action: 'NS_KLGD_ThongTin_MH/DSA4BRIKDQYFHgkkEi4eESkgLBcoADEFNC8m', func: 'PKG_KLGV_V2_THONGTIN.LayDSKLGD_HeSo_PhamViApDung' },
        them: { action: 'NS_KLGD_ThongTin_MH/FSkkLB4KDQYFHgkkEi4eESkgLBcoADEFNC8m', func: 'PKG_KLGV_V2_THONGTIN.Them_KLGD_HeSo_PhamViApDung', method: 'POST' },
        sua: { action: 'NS_KLGD_ThongTin_MH/EjQgHgoNBgUeCSQSLh4RKSAsFygAMQU0LyYP', func: 'PKG_KLGV_V2_THONGTIN.Sua_KLGD_HeSo_PhamViApDung', method: 'POST' },
        xoa: { action: 'NS_KLGD_ThongTin_MH/GS4gHgoNBgUeCSQSLh4RKSAsFygAMQU0LyYP', func: 'PKG_KLGV_V2_THONGTIN.Xoa_KLGD_HeSo_PhamViApDung', method: 'POST' }
    });
})();
