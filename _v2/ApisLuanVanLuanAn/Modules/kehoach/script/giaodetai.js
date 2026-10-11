/* =========================================================================
   Giao đề tài (Luận văn, luận án)
   Bản gốc: ApisLuanVanLuanAn/Modules/kehoach/html/giaodetai.html + script/giaodetai.js (vỏ indexi, 826 dòng)
   ---------------------------------------------------------------------------
   Bản gốc là bản nháp CŨ của chính màn "Giao đề tài" ở cổng cán bộ (ApisCongCanBo/Modules/luanvan/script/giaodetai.js,
   cùng lời gọi LVLA_BV_KeHoach/*): cùng bảng người học của kế hoạch, cùng khung "Giao đề tài" (Thông tin · Danh sách đề tài ·
   Thêm / Xóa · Chọn) và cùng lưới người hướng dẫn — nên DÙNG LẠI khung ums.lv.deTai (_detai.js), chạy ở chế độ gọn
   (gon) + có ô từ khoá (tuKhoa) như gốc:
     · LVLA_BV_KeHoach/LayDSBV_Kehoach_NguoiHoc GET strTuKhoa (ô tìm) · strBV_KeHoach_Id · pageIndex · pageSize
     · LVLA_BV_KeHoach/LayDSBV_KeHoach GET (danh sách kế hoạch, dHieuLuc -1, pageSize 100000)
     · LVLA_BV_KeHoach/LayDSBV_KH_NG_GiaoDeTai GET (đề tài đã giao của một người học)
     · Them_ / Sua_ / Xoa_BV_KH_NG_GiaoDeTai, LayDSBV_KH_NG_GiaoDeTai_HD, Them_ / Sua_ / Xoa_BV_KeHoach_NH_GiaoDT_HD.
   Khác gốc:
     · Gốc lưu "Giao đề tài" bằng save_DeTai đọc biến strDanhSach_Id không tồn tại (lỗi JS) và ô "Chọn đề tài" (dropDeTai)
       không bao giờ được nạp → làm theo ý định: ô chọn đề tài nạp các đề tài CHƯA giao của kế hoạch, lưu xong ở lại để giao tiếp;
       người hướng dẫn thêm / sửa ở nút "Chọn" của từng đề tài (lý do điều chỉnh + lưới người hướng dẫn, lưu từng đề tài).
     · Gốc dựng dòng người hướng dẫn bằng biến `row`/`aData`/`i` không tồn tại, ô vai trò không có danh mục → lưới chung có vai trò thật.
     · Gốc nạp lại bảng bằng me.getList_KeHoachXuly (không tồn tại) → nạp lại danh sách người học.
   Cố ý bỏ (mã chết — html không có): rewrite, save_/getList_ DieuKien, btnDelete_DieuKien, "Danh sách sinh viên xét" (#myModal,
   #myModalKetQua — nút mở không được dựng ở bảng), mẫu import (zonebtnBaoCao_GDT không có nút), toàn bộ ô ApDungCho* / dropPhanLoai.
   ========================================================================= */
(function () {
    var r = document.getElementById('lvla-kehoach-giaodetai');
    if (r) ums.lv.deTai(r, 'giaodetai', { gon: true, tuKhoa: true });
})();
