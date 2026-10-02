/* =========================================================================
   Tiến độ nhập điểm theo LỚP HỌC PHẦN (Quản lý điểm)
   Bản gốc: ApisQuanLyDiem/Modules/thongke/html/nhapdiemlophocphan.html + script/nhapdiemhocphan.js
   (html gốc nạp chung tệp .js của màn học phần — không có nhapdiemlophocphan.js).
   Khung chung: ApisCongCanBo/Modules/thongke/script/_nhapdiem.js (ums.tkNhapDiem, cờ qld).
   Lời gọi riêng của bản QLD:
       XLHV_TP_ToChucThi_MH/DSA4BRINLjEJLiIRKSAvFSA1AiAP  func pkg_thi_tochucthi.LayDSLopHocPhanTatCa  (POST)
       TP_Chung/LayDotThi — strDaoTao_ThoiGianDaoTao_Id = ô Kế hoạch (chép nguyên), nạp lại khi đổi Kế hoạch
       Danh mục DIEM.TRANGTHAILOC (ô "Chọn lọc")
   Nối tầng: Kế hoạch (chọn nhiều) → Khoa quản lý (chọn nhiều) / Học phần / Đợt thi; Khoa quản lý → Học phần.
   ========================================================================= */
ums.tkNhapDiem(document.getElementById('qld-nhapdiemlhp'), true, { qld: true });
