/* =========================================================================
   Tiến độ nhập điểm theo HỌC PHẦN (Quản lý điểm)
   Bản gốc: ApisQuanLyDiem/Modules/thongke/html/nhapdiemhocphan.html + script/nhapdiemhocphan.js
   Khung chung: ApisCongCanBo/Modules/thongke/script/_nhapdiem.js (ums.tkNhapDiem, cờ qld) — mọi lời gọi,
   chỗ lệch với bản Cổng cán bộ và lỗi gốc đã sửa ghi ở đầu tệp đó.
   Lời gọi riêng của bản QLD:
       XLHV_TP_ToChucThi_MH/DSA4BRIJLiIRKSAvFSkkLgokCS4gIilz  func pkg_thi_tochucthi.LayDSHocPhanTheoKeHoach2  (POST)
       Danh mục DIEM.TRANGTHAILOC (ô "Chọn lọc", giá trị = MA)
   Bỏ (không có tác dụng trên màn này ở bản gốc): nạp Khoa quản lý và Đợt thi — hai ô không có trong html học phần.
   ========================================================================= */
ums.tkNhapDiem(document.getElementById('qld-nhapdiemhp'), false, { qld: true });
