/* =========================================================================
   Loại khoản — TRANG MẪU (ums.nhMau, scripts/_mau.js)
   Bản gốc: ApisNhapHoc/Modules/thongke/html/loaikhoan.html — HTML tĩnh; scripts/loaikhoan.js chỉ gọi page_load,
   không lời gọi API nào. Chép nguyên số liệu viết cứng của gốc (kể cả ngày 28/06/2018 để trống số tiền).
   ========================================================================= */
(function () {
    'use strict';
    var r = document.getElementById('nh-loaikhoan');
    if (!r) return;
    ums.nhMau.man(r, {
        tieuDe: 'Loại khoản',
        the: [
            { ten: 'HỌC PHÍ', tien: 12000000, icon: 'fa-sack-dollar', mau: 'green' },
            { ten: 'KINH PHÍ', tien: 23000000, icon: 'fa-dollar-sign', mau: '' },
            { ten: 'ĐOÀN PHÍ', tien: 19000, icon: 'fa-badge-dollar', mau: 'red' }
        ],
        trai: { tieuDe: 'Thông tin loại khoản', icon: 'fa-user', dong: [['Tên', 'HỌC PHÍ'], ['Tổng thu', ums.ui.money(12000000, { donVi: true })], ['Quầy thu', 'Số 1']] },
        cotTen: 'Người thu',
        lichSu: [
            { ngay: '30/06/2018', dong: [['Nguyễn Thị Yết', 1000000], ['Hà Mạnh Quân', 2000000], ['Trường mạnh hải', 4000000]], tong: 7000000 },
            { ngay: '29/06/2018', dong: [['Nguyễn Thị Yết', 1500000], ['Hà Mạnh Quân', 5000000], ['Trường mạnh hải', 500000]], tong: 7000000 },
            { ngay: '28/06/2018', dong: [['Học phí', null], ['Kinh phí', null]], tong: null }
        ]
    });
})();
