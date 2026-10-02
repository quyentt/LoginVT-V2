/* =========================================================================
   cauhinhhienthi — Cấu hình hiển thị cột (theo NGƯỜI DÙNG) của các bảng nhập điểm
   Bản gốc: ApisQuanLyDiem/Modules/cauhinhhienthi/html/cauhinhhienthi.html + script/cauhinhhienthi.js
            (+ plugin bootstrap-colorselector — không chép, thay bằng ô chọn màu thường)
   Bố cục như gốc (một cột): thanh lọc Chức năng → khung "Danh sách" (bảng sửa trong ô, Thêm dòng mới, Lưu).
   Lời gọi: D_CauHinhCotHienThi/LayDanhSach · ThemMoi · CapNhat · Xoa — chi tiết và các điểm khác gốc ở _cauhinh.js.
   Riêng bản này: dòng MỚI không lưu được (gốc lấy CHUCNANG_ID / NGUOIDUNG_ID từ dòng đã có; không có thì báo
   "Dữ liệu hệ thống chỉ có thể sửa") — giữ như gốc.
   ========================================================================= */
(function () {
    'use strict';
    ums.qldCH.man(document.getElementById('qld-cauhinhhienthi'), {
        tieuDe: 'Cấu hình hiển thị', ctl: 'D_CauHinhCotHienThi', chung: false
    });
})();
