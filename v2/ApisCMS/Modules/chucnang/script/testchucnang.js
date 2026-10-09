/* =========================================================================
   Test chức năng (ApisCMS) — ĐỂ LẠI, chỉ hiện khung giải thích
   Bản gốc: ApisCMS/Modules/chucnang/html/testchucnang.html + script/testchucnang.js
   ---------------------------------------------------------------------------
   Trang THỬ của lập trình viên, không có nghiệp vụ:
     · html là một bảng 10 dòng VIẾT CỨNG (HTQT.LVDC1 "Lĩnh vực đề cươn1",
       NCKH.DVMT, NS.TTKT… — dữ liệu danh mục chép tay), nút Sửa không có xử lý;
     · .js chỉ gắn "chọn cả cột" cho ô đánh dấu ở tiêu đề (checkedCol_BgRow);
       phần còn lại là mã thử ký số MISA meInvoice (initMISAKYSOParam với MST
       0101243150-136 viết cứng, Base64, callback gọi HDDT_HoaDon/PhatHanhHoaDon_Nhap
       với biến dtHoaDon / saveNhap / d KHÔNG tồn tại) — không nơi nào gọi tới.
   Không gọi API nào. → Chờ quyết gỡ khỏi menu (can-quyet.js).
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('cms-testchucnang');
    if (!root) return;
    root.innerHTML = ums.pat.page('Test chức năng') + ums.pat.panel({
        title: 'Test chức năng', icon: 'fa-flask',
        body: ums.ui.empty('Trang thử nội bộ của lập trình viên — bản gốc chỉ có bảng dữ liệu viết cứng và mã thử ký số, ' +
            'không có nghiệp vụ nên không chuyển. Đang chờ quyết định gỡ khỏi menu.', 'fa-flask')
    });
})();
