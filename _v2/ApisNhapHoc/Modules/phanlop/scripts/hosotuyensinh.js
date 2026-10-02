/* =========================================================================
   Chuyển lớp — sẽ chuyển cả kế hoạch tuyển sinh (hồ sơ tuyển sinh)
   Bản gốc: ApisNhapHoc/Modules/phanlop/html/hosotuyensinh.html + scripts/hosotuyensinh.js
   (bản chép của ApisQuanlyTuyenSinh/Modules/tuyensinh/script/hosotuyensinh.js, bỏ lớp 11 / kế thừa / báo cáo).
   Từ 2026-09-27 hai phân hệ dùng CHUNG khung ./_hosots.js (ums.hoSoTS.man) — bản Nhập học là cấu hình mặc
   định (không cờ), bản Tuyển sinh bật { ts: true }. Toàn bộ lời gọi, tự chốt và khác gốc ghi ở đầu _hosots.js.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('nh-hosotuyensinh');
    if (!root) return;
    ums.hoSoTS.man(root, {});
})();
