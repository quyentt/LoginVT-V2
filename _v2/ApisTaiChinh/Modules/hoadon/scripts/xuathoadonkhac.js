/* =========================================================================
   Xuất hóa đơn khác
   Bản gốc: ApisTaiChinh/Modules/hoadon/scripts/xuathoadonkhac.js
   ---------------------------------------------------------------------------
   Luồng, lời gọi, cách tính tiền: xem đầu tệp scripts/_xuatdon.js (mode 'khac').
   Riêng của màn này:
       TC_DoiTuongKhac/LayDanhSach  GET v1.0  strTuKhoa, pageIndex, pageSize
       Phát hành: strLoaiDoiTuong 'DOITUONGKHAC', strTenNguoiThu, bTenNguoiThu,
                  bSoLuong ("Không hiển thị số lượng và đơn giá")
   Bỏ: các ô lọc hệ/khoá/chương trình/lớp/trạng thái của HTML gốc — lời gọi
   TC_DoiTuongKhac/LayDanhSach không gửi giá trị nào của chúng.
   ========================================================================= */
(function () {
    'use strict';
    ums.hoadon.xuat(document.getElementById('xuathoadonkhac'), {
        mode: 'khac',
        title: 'Xuất hóa đơn khác'
    });
})();
