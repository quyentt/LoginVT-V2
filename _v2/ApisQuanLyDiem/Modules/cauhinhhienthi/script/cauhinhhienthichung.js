/* =========================================================================
   cauhinhhienthichung — Cấu hình hiển thị cột CHUNG (theo chức năng) của các bảng nhập điểm
   Bản gốc: ApisQuanLyDiem/Modules/cauhinhhienthi/html/cauhinhhienthichung.html + script/cauhinhhienthichung.js
   Bố cục như gốc (một cột): thanh lọc Chức năng → khung "Danh sách" (bảng sửa trong ô, Thêm dòng mới, Lưu).
   Lời gọi: D_CauHinhCotHienThi_C/LayDanhSach · ThemMoi · CapNhat · Xoa — chi tiết và các điểm khác gốc ở _cauhinh.js.
   Riêng bản này: strChucNang_Id = ô Chức năng đang chọn (gốc không bắt chọn — để trống thì gửi rỗng, giữ như gốc);
   cột Stt chỉ hiện số thứ tự (dòng mới thì nhập được).
   ========================================================================= */
(function () {
    'use strict';
    ums.qldCH.man(document.getElementById('qld-cauhinhhienthichung'), {
        tieuDe: 'Cấu hình hiển thị chung', ctl: 'D_CauHinhCotHienThi_C', chung: true
    });
})();
