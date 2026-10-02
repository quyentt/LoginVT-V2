/* =========================================================================
   Nhập hồ sơ tuyển sinh (Tuyển sinh › tuyensinh)
   Bản gốc: ApisQuanlyTuyenSinh/Modules/tuyensinh/html/hosotuyensinh.html + script/hosotuyensinh.js (2.465 dòng)
   ---------------------------------------------------------------------------
   Bản Nhập học (ApisNhapHoc/…/phanlop/hosotuyensinh — "Chuyển lớp") là bản CHÉP của màn này nên hai màn dùng
   chung khung ApisNhapHoc/Modules/phanlop/scripts/_hosots.js (ums.hoSoTS.man). Ở đây bật cờ { ts: true }:
   Năm → Kế hoạch (LayDSTS_KeHoach_NguoiDung), Lớp theo Hệ + Khóa, cột Lớp (tên), Thêm mới / Xóa đã chọn,
   "Thêm mới từ Đào Tạo" (kế thừa), "Chuyển nguyện vọng", Xuất báo cáo / Import; biểu mẫu thêm lớp 9 (xếp loại,
   tỉnh/huyện/xã), lớp 10 (SBD, hội đồng, điểm TB), lớp 11, Điểm thi THPT, Điểm thi cuối kỳ, Diện cộng điểm ưu tiên.
   Lời gọi (chép nguyên, GET/POST như gốc) và mọi điểm khác gốc / tự chốt: xem đầu _hosots.js.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('ts-hosotuyensinh');
    if (!root) return;
    ums.hoSoTS.man(root, { ts: true, title: 'Nhập hồ sơ tuyển sinh' });
})();
