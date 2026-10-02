/* =========================================================================
   Thu tiền — bản cũ (Nhập học) — taichinh
   Bản gốc: ApisNhapHoc/Modules/taichinh/html/taichinh.html + scripts/taichinh.js (1.840 dòng)
   Gốc là bản chép của taichinhnew.js; khác đúng năm lời gọi kiểu cũ (không mã hoá):
     NH_ThongTin/NhapHoc_ThuTien · NH_DinhMuc_Chung/LayDSCacKhoanNhapHoc (GET) ·
     NH_NguoiHoc_ThongTinTuyenSinh/NhapHoc_SuaPhieuThu · NH_NguoiHoc_ThongTinTuyenSinh/LayChiTiet (GET) ·
     NH_DinhMuc_Chung/LayDSKhoanDaThuNhapHoc (GET); danh sách người học qua edu.extend (Corei) → 'SV_CORE_…'.
   Và: xuất hoá đơn chỉ mở khung chọn khoản khi phiếu có khoản (bản mới mở cả khi rỗng + báo).
   Dùng chung khung scripts/_thu_chung.js với cờ cu: true.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('taichinh');
    if (root && ums.nhThu) ums.nhThu.man(root, { cu: true, tieuDe: 'Thu tiền' });
})();
