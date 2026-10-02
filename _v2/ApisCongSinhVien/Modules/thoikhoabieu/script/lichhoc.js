/* =========================================================================
   Lịch cá nhân (Lịch học) — Cổng sinh viên, vai trò thủ vai (userId = ID người học)
   Bản gốc: ApisCongSinhVien/Modules/thoikhoabieu/html/lichhoc.html
            + script/lichgiang.js  (lớp LichGiang — tên tệp .js LỆCH tên màn hình;
              bản mới đặt theo tên html: lichhoc.html + lichhoc.js)
   ---------------------------------------------------------------------------
   DÙNG LẠI khung chung ums.tkbSV — tệp
   ApisCongCanBo/Modules/thoikhoabieusinhvien/script/_lichhocsv.js (+ css/lichhoc.css).
   Khung đó được viết ra TỪ CHÍNH tệp lichgiang.js này (bản Cổng cán bộ là một bản
   chép của bản Cổng sinh viên), nên mọi lời gọi / tên tham số / tên cột đã trùng khít:
       SV_ThongTin_MH · pkg_congthongtin_hssv_thongtin.LayDSLichCaNhan             lịch tuần (lịch học + lịch thi)
       SV_ThongTin_MH · PKG_CONGTHONGTIN_HSSV_THONGTIN.LayTKBLopKhongCoLichChiTiet  lớp học phần không có lịch chi tiết
       SV_CamXuc_MH · pkg_dg_camxuc_nguoihoc.LayDSCamXuc / LayTTMacDinh / Tang_CamXuc / Giam_CamXuc / ThayDoi_CamXuc
       Bấm buổi học: NS_ThongTinCanBo_MH · pkg_congthongtincanbo.LayDSDangKyHoc_2
                     "Lưu" → CC_ThongTin/Them_QLSV_NguoiHoc_TuGhiNhan (tự ghi nhận điểm danh, kèm IP)
       Bấm buổi thi: SV_ThongTin_MH · pkg_congthongtin_hssv_thongtin.LayTTLichThi
       Mẫu báo cáo (zonebtnBaoCao_LichGiang): strNhanSu_HoSoCanBo_Id = ID người học, strNgayBatDau, strNgayKetThuc.

   BẢN CỔNG SINH VIÊN KHÁC BẢN CỔNG CÁN BỘ ở đúng ba chỗ (đã xử lý ngay tại đây,
   KHÔNG sửa tệp chung của Cổng cán bộ):
     1. Không có ô tra "Mã sinh viên" (getList_TimCanBo / action_NguoiDung chỉ có ở
        bản cán bộ). Người học chính là người đăng nhập → truyền thẳng
        sv = { ID: ums.session.userId } (gốc: me.strGiangVien_Id = edu.system.userId);
        tenSV: false vì bản gốc không hiện tên ai cạnh tiêu đề khung.
     2. Thứ tự hai khung trong cột trái: TỪ KÉO GỐC 30/9 bản gốc Cổng SV cũng đưa "Lớp học
        phần (không có lịch chi tiết)" lên TRƯỚC "Lịch cá nhân" (như bản Cổng cán bộ) → bỏ
        klctTruoc: false, dùng thứ tự mặc định của khung chung.
     3. Khung chung bỏ tiêu đề trang khi đã biết trước sinh viên (nó còn dùng cho
        hộp thoại "Lịch học" của In bảng điểm) → tieuDe: 'Lịch cá nhân'.
     4. html gốc chỉ có vùng mẫu BÁO CÁO (#zonebtnBaoCao_LichGiang), không có vùng
        "#<zone>_Import" nên nút Import chưa bao giờ hiện → import: false.
   Kéo gốc 30/9 (git fed68f6e..HEAD, lichhoc.html 23/23, lichgiang.js +11/−18):
     · Khối "Lớp học phần (không có lịch chi tiết)" dời lên đầu cột trái (xem mục 2).
     · Đầu cột ngày của lịch tuần chỉ hiện SỐ NGÀY, ngày đủ nằm ở title → ngayNgan: true (ums.lich).
     · Bảng lớp đọc đúng cột MALOP, TENLOP, TENHINHTHUCHOC, NGAYBATDAU, NGAYKETTHUC, GHICHU — sửa ở
       khung chung (tên thật đứng đầu dãy dò).
     · BỎ QUA: ô lịch dịch xuống 30px (top: 30 + PHUTBATDAU) — bù hàng tiêu đề trong cột của vỏ cũ;
       lưới tuần ums.lich đặt tiêu đề ngoài cột nên ô đã đúng giờ. Chữ đậm 800 của ngày hôm nay (CSS).
   Bố cục giữ nguyên bản gốc: HAI cột (col-md-9 lịch tuần + bảng lớp không có lịch
   chi tiết | col-md-3 lịch tháng nhỏ + nút mẫu báo cáo).

   Giữ như bản gốc: danh sách lớp của buổi học gửi strNguoiThucHien_Id =
   edu.system.userId (nguoiDsLop: 'canbo' → ums.session.userId; ở Cổng sinh viên
   hai giá trị này là MỘT nên không lệch gì).
   Chữ nút mẫu báo cáo là "Báo cáo" — Cổng sinh viên chạy ở vỏ index (Core:6945),
   không phải "Xuất báo cáo" của vỏ indexi.
   Khác bản gốc (thừa hưởng từ khung chung, đã ghi ở _lichhocsv.js): ô trùng giờ xếp
   cạnh nhau thay vì chồng lên nhau; hộp buổi học không lỗi JS khi người học không
   nằm trong danh sách lớp.
   Bỏ (mã chết của bản gốc): bindCalendarScrollSync / bindDragScroll (lịch tuần mới
   tự cuộn + kéo chuột), getData_NhapChuyenCan · save_NhapChuyenCan ·
   delete_NhapChuyenCan · save_DiemDanhTuDong · save_XacNhan · getList_PhanChamThi
   (không nút nào trên màn gọi tới: #btnDiemDanhTuDong bị chú thích trong html,
   .btnXacNhan thuộc bảng #tblThongTin không tồn tại, cột kiểu chuyên cần đã bị
   chú thích), hai nút ẩn "Chi tiết lịch thi" / "học phần" (display:none !important).
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('csv-lichhoc');
    ums.tkbSV.mount(root, {
        sv: { ID: (ums.session && ums.session.userId) || '' },
        tieuDe: 'Lịch cá nhân', tenSV: false, ngayNgan: true, import: false,
        nguoiDsLop: 'canbo', reportText: 'Báo cáo'
    });
})();
