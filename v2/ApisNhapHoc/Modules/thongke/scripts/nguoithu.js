/* =========================================================================
   Người thu — TRANG MẪU (ums.nhMau, scripts/_mau.js)
   Bản gốc: ApisNhapHoc/Modules/thongke/html/nguoithu.html — HTML tĩnh; scripts/nguoithu.js chỉ gọi page_load,
   không lời gọi API nào. Chép nguyên số liệu viết cứng của gốc (các ngày trong lịch sử để trống số tiền như gốc).
   ========================================================================= */
(function () {
    'use strict';
    var r = document.getElementById('nh-nguoithu');
    if (!r) return;
    function trong(ngay) { return { ngay: ngay, dong: [['Học phí', null], ['Kinh phí', null]], tong: null }; }
    ums.nhMau.man(r, {
        tieuDe: 'Người thu',
        keHoach: { ten: 'THU HỌC PHÍ SINH VIÊN NHẬP HỌC 2017-2018', tong: 67000000 },
        the: [
            { ten: 'NGUYỄN VÂN ANH', tien: 12000000, icon: 'fa-sack-dollar', mau: 'green' },
            { ten: 'TRƯỜNG MẠNH HẢI', tien: 23000000, icon: 'fa-dollar-sign', mau: '' },
            { ten: 'Hà Anh Quân', tien: 19000000, icon: 'fa-badge-dollar', mau: 'red' },
            { ten: 'Triệu Thu Ngần', tien: 13000000, icon: 'fa-circle-dollar-to-slot', mau: 'purple' }
        ],
        trai: { tieuDe: 'Thông tin người thu', icon: 'fa-user', dong: [['Họ tên', 'NGUYỄN VÂN ANH'], ['Tổng thu', ums.ui.money(25450000, { donVi: true })], ['Quầy thu', 'Số 1']] },
        cotTen: 'Loại khoản',
        lichSu: [trong('30/06/2018'), trong('29/06/2018'), trong('28/06/2018')]
    });
})();
