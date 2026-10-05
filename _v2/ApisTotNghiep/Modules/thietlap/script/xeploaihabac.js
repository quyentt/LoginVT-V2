/* =========================================================================
   Xếp loại hạ bậc (Xét tốt nghiệp)
   Bản gốc: ApisTotNghiep/Modules/thietlap/html/xeploaihabac.html + script/xeploaihabac.js
   Dựng bằng CHÍNH màn Học bổng: ApisHocBong/Modules/thietlap/script/xeploaihabac.js
   (ums.hbXlhb, khung ums.hbDk) — mọi lời gọi, lỗi gốc đã sửa, khác gốc: xem đầu hai tệp đó.
   ---------------------------------------------------------------------------
   Bản TN gốc lệch bản HB gốc đúng ba chỗ (diff -w):
     · Biểu mẫu có ô "Xếp loại" (#dropXepLoai, danh mục VANBANG.XEPLOAI) ở cột "Thông tin
       áp dụng", trên Xâu điều kiện; Lưu điều kiện CHUNG và RIÊNG gửi thêm strXepLoai_Id;
       mở Sửa đặt lại từ XEPLOAI_ID  → cờ xepLoai.
     · Bảng "Danh sách từ khóa":
         TN_XepLoai_TuKhoa/LayDSTN_XepLoai_TuKhoa   GET strTuKhoa = '', strPhanLoai_Id = '',
                                                    strNguoiTao_Id = '', pageIndex 1, pageSize 100000
                                                    (không phân trang — gốc chú thích bPaginate)
         TN_XepLoai_TuKhoa/Sua_TN_XepLoai_TuKhoa    POST strId, strTenTuKhoa, strMoTa
                                                    (gốc dùng cho CẢ thêm lẫn sửa)
     · Mở màn gọi thêm getList_DieuKienRieng (tab 2 chưa có phân cấp → ở đây nạp khi chọn).
   ========================================================================= */
(function () {
    'use strict';

    var root = document.getElementById('tn-xeploaihabac');
    if (!root || !ums.hbXlhb) return;

    ums.hbXlhb(root, {
        xepLoai: true,
        tuKhoa: {
            ds: 'TN_XepLoai_TuKhoa/LayDSTN_XepLoai_TuKhoa',
            them: 'TN_XepLoai_TuKhoa/Sua_TN_XepLoai_TuKhoa',
            sua: 'TN_XepLoai_TuKhoa/Sua_TN_XepLoai_TuKhoa',
            size: 100000, trang: false
        }
    });
})();
