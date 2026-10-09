/* =========================================================================
   Xuất chứng từ
   Bản gốc: ApisTaiChinh/Modules/hoadon/html/xuatchungtu.html, nạp CHUNG
            scripts/xuathoadon.js với màn Xuất hóa đơn.
   ---------------------------------------------------------------------------
   Khác xuathoadon DUY NHẤT ở HTML: không có vùng #zoneActionXuatHoaDon, nên
   genHTML_NoiDung_HoaDon đổ nút phát hành vào hư không — người dùng chỉ xem
   được bản nháp. Giữ nguyên: phatHanh = false (không hiện nút, không nạp
   danh mục TAICHINH.NUTHDDT). Xem/in/huỷ hoá đơn đã xuất vẫn như xuathoadon.
   ========================================================================= */
(function () {
    'use strict';
    ums.hoadon.xuat(document.getElementById('xuatchungtu'), {
        mode: 'sv',
        phatHanh: false,
        title: 'Xuất chứng từ'
    });
})();
