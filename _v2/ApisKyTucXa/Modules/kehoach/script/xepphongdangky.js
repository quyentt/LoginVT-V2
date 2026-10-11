/* =========================================================================
   Xếp phòng đăng ký — Ký túc xá / Kế hoạch
   Bản gốc: ApisKyTucXa/Modules/kehoach/html/xepphongdangky.html + script/xepphongdangky.js (1.672 dòng)
   ---------------------------------------------------------------------------
   Toàn bộ cách dựng, lời gọi, "Giữ như gốc / Khác gốc / Cố ý bỏ" ở khung chung _xepphong.js (ums.ktxXP) — màn này chỉ truyền cờ:
     xacNhan: false  → danh sách là người ĐÃ xếp phòng (KTX_DaXepPhong/LayDanhSach), nút Thêm (hộp chọn người ở KTX_NguoiHocOKTX)
                       + Rời phòng (KTX_DaXepPhong/Xoa), nút Import (ums.report.mount — getList_MauImport("zonebtnDK") gốc),
                       thẻ toà / tầng / phòng in số phòng còn trống, chỗ trống, giới tính, "Đã bao".
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('ktx-xepphongdangky');
    if (!root) return;
    ums.ktxXP.dung(root, { xacNhan: false, title: 'Xếp phòng đăng ký', tieuDeTim: 'Vui lòng tìm phòng cần đăng ký', tieuDeNguoiO: 'Danh sách người ở' });
})();
