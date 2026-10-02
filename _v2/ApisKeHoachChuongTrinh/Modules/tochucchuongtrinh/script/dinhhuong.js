/* =========================================================================
   Định hướng — Tổ chức chương trình (khai báo định hướng của chương trình đào tạo)
   Bản gốc: ApisKeHoachChuongTrinh/Modules/tochucchuongtrinh/html/dinhhuong.html + script/dinhhuong.js
   ---------------------------------------------------------------------------
   BẢN GỐC CHƯA TỪNG CHẠY:
     · html nạp "modules/tuyensinh/script/dinhhuong.js" — tệp KHÔNG tồn tại trong phân hệ (404), nên
       `new DinhHuong()` lỗi ReferenceError (hoặc, nếu trước đó đã mở Hoạt động › Định hướng, chạy NHẦM lớp
       DinhHuong của màn đó trên html này).
     · script/dinhhuong.js cùng thư mục là bản chép DỞ của "Kế hoạch tuyển sinh" (ApisQuanlyTuyenSinh/
       tuyensinh/kehoachtuyensinh.js, đổi KeHoach → DinhHuong): gọi TS_DinhHuong/*, TS_Dot_DoiTuong/*,
       TS_KeHoach_Phi_Dot/*, TS_ToHop_Mon_Nganh_Dot/*… — controller TS_DinhHuong không có ở đâu khác;
       nút "Thêm mới" của html (btnAddDinhHuong) không được gắn (mã gắn #btnAddKeHoach), Lưu đọc ô
       txt_Input_TenKeHoach không có trên màn; khối "Gắn theo khối kiến thức / học phần" không có xử lý.
   Ý định còn đọc được từ html: danh sách định hướng + "Thêm mới" (Tên định hướng, Mã định hướng) —
   đúng việc mà Hoạt động › Định hướng làm với dữ liệu thật (KHCT_ThongTin …DaoTao_CT_DinhHuong).
   → Dựng lại bằng CÙNG khung ums.khctDH (_dinhhuong.js), bật "Thêm mới" (biểu mẫu thêm chọn Hệ → Khoá →
     Chương trình theo QUYỀN, đi theo ô lọc). Người học / chia nhóm để ở Hoạt động › Định hướng.
   Bỏ: toàn bộ phần tuyển sinh (đợt/phương thức, khoản phí, ngành nghề, tổ hợp môn, hồ sơ, nhân sự) và hai
   khối "Gắn theo khối kiến thức / học phần" (không có lời gọi nào để chép).
   ========================================================================= */
(function () {
    'use strict';
    ums.khctDH.man(document.getElementById('khct-dinhhuong-tc'), { tieuDe: 'Định hướng', them: true, nguoiHoc: false });
})();
