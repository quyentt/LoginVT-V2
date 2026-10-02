/* =========================================================================
   Chính sách theo số tiền — lưới sinh viên × đối tượng (số tháng hưởng + số tiền)
   Bản gốc: ApisSinhVien/Modules/chinhsach/html/chinhsachsotien.html + script/chinhsachsotien.js
   ---------------------------------------------------------------------------
   Khung chung: script/_chinhsach.js (ums.svcs.man, kieu 'st').
   Riêng màn này:
     · Ô lưới SV_ChinhSach/LayKQChinhSach_SoTien GET (cột SOTIEN); Lưu TC_SoTienMien/ThemMoi (dSoTien) | Xoa.
     · "Nhập theo lớp" → TC_DoiTuong_Lop_TienMien/ThemMoi (dSoTien, dSoThang, kiểu học, khoản thu).
     · Báo cáo: getList_MauImport vào zonebtnBaoCao_CSST — html gốc chỉ có zonebtnBaoCao_CSQS_Import
       (chép từ màn phần trăm, không khớp tên) nên mẫu Import không bao giờ hiện → chỉ nút Xuất báo cáo.
     · Số tiền nhập và gửi NGUYÊN chuỗi ô như gốc (không tự bỏ dấu ngăn nghìn).
   Bỏ: nút "Nhập theo lớp" thứ hai (html gốc có HAI thẻ cùng id btnSearch_Lop).
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('svcs-chinhsachsotien');
    if (!root) return;
    ums.svcs.man(root, {
        tieuDe: 'Chính sách theo số tiền',
        kieu: 'st',
        hang: [['he', 'khoa', 'ct', 'lop'], ['hk', 'kieu', 'khoan', 'chedo'], ['dt', 'q']],
        nut: ['lop'],
        mau: { lop: 'danger' },
        baoCaoImport: false
    });
})();
