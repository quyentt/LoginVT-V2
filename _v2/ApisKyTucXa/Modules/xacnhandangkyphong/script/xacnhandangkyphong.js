/* =========================================================================
   Xác nhận đăng ký phòng — Ký túc xá
   Bản gốc: ApisKyTucXa/Modules/xacnhandangkyphong/html/xacnhandangkyphong.html + script/xacnhandangkyphong.js (1.662 dòng)
   ---------------------------------------------------------------------------
   Chép 92% từ kehoach/xepphongdangky → dùng chung khung ../../kehoach/script/_xepphong.js (ums.ktxXP). Chỗ khác của bản gốc này,
   gom thành cờ xacNhan: true:
     · danh sách là người ĐĂNG KÝ chờ xác nhận (KTX_DangKyPhong/LayDanhSach), nút "Xác nhận" = KTX_DangKyPhong/Xoa rồi
       KTX_DaXepPhong/ThemMoi (ngày vào = hôm nay, ngày ra rỗng — thứ tự gốc);
     · không nút Thêm người ở, không Import; tiêu đề "Vui lòng tìm phòng cần xác nhận đăng ký" / "Danh sách người đăng ký";
     · thẻ toà chỉ in Số phòng, thẻ tổng chỉ Tổng số tòa nhà / phòng; tầng không in "Trống … chỗ / phòng"; ô phòng không in
       giới tính / "Đã bao"; cột Ngày sinh / Ngày vào / Ngày ra thay bằng "Người thực hiện" (NGUOITHUCHIEN_TENDAYDU).
   Khác gốc riêng màn này (ghi ở _xepphong.js): gửi strKTX_Phong_Id khi lấy đăng ký (gốc rỗng); Mã / Họ tên lấy cột KTX_DOITUONGOKYTUCXA_*
   (gốc in NGUOITHUCHIEN_ID / _TENDAYDU vào chỗ Mã / Tên); bỏ số cứng "Số SV chờ xếp phòng: 130"; loadHopDong đọc main_doc.ChuaCoHopDong
   (không có) → lấy KTX.TTHD như màn xếp phòng.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('ktx-xacnhandangkyphong');
    if (!root) return;
    ums.ktxXP.dung(root, { xacNhan: true, title: 'Xác nhận đăng ký phòng', tieuDeTim: 'Vui lòng tìm phòng cần xác nhận đăng ký', tieuDeNguoiO: 'Danh sách người đăng ký' });
})();
