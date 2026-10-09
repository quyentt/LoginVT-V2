/* =========================================================================
   Xuất hóa đơn (người học)
   Bản gốc: ApisTaiChinh/Modules/hoadon/scripts/xuathoadon.js
   ---------------------------------------------------------------------------
   Toàn bộ luồng, lời gọi, cách tính tiền và những gì cố ý bỏ: xem đầu tệp
   scripts/_xuatdon.js (khung chung của ba màn xuất hoá đơn lẻ).
   Lời gọi riêng của màn này:
       SV_NGUOIHOC_01_MH/DSA4BRIPJjQuKAkuIh4ALS0P   PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc_All
   ========================================================================= */
(function () {
    'use strict';
    ums.hoadon.xuat(document.getElementById('xuathoadon'), {
        mode: 'sv',
        title: 'Xuất hóa đơn'
    });
})();
