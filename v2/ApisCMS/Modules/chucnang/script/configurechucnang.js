/* =========================================================================
   Cấu hình chức năng (ApisCMS) — ĐỂ LẠI, chỉ hiện khung giải thích
   Bản gốc: ApisCMS/Modules/chucnang/html/configurechucnang.html + script/configurechucnang.js (1.572 dòng)
   ---------------------------------------------------------------------------
   Đây không phải màn nghiệp vụ mà là CÔNG CỤ SINH MÃ màn hình của lập trình viên:
   đọc một cấu hình JSON (Controller.lApi: LayDanhSach / ThemMoi + tham số) từ
   localStorage["configChucNang"], dựng thử khung tìm kiếm + bảng + modal, rồi
   "View code" in ra HTML/JS kiểu hệ cũ (genhtml / genJS) để chép vào dự án.

   Vì sao không chuyển:
     · Chạy CÂU SQL TỰ DO từ trình duyệt: SYS_LuuCacThongTinHoatDong/LayDanhSachSQL
       strA = "SELECT * FROM Chung_API_Function" / CHUNG_API_THAMSOFORCREATE /
       CHUNG_COLUMNOFTABLE / chung_ColumnOfTable … (ghép chuỗi, gọi async:false).
     · eval() ở nhiều chỗ (7 dòng), có chỗ chạy chuỗi người dùng gõ (Mimi/Lisa Render, danh mục).
     · Ghi cấu trúc qua CMS_OraDBTableName/Save_API_ThamSo, Save_API_ThamSoForUpdate,
       Save_ColumnOfTable, Save_CauHinh_ChucNang (cắt JSON thành khúc 3.500 ký tự);
       save_SQL (CreatAndAlterTable) có sẵn nhưng không nơi nào gọi.
     · Bản gốc KHÔNG CHẠY trên trình duyệt thường: init() gọi creatHtml() đọc
       me.objConfigure.Controller trước khi gắn mọi nút → thiếu localStorage
       "configChucNang" là TypeError ngay, không nút nào hoạt động (kể cả "Thêm").
       Ô "Chọn file cấu hình" không có nguồn nạp. Không màn nào khác đọc
       Save_CauHinh_ChucNang.
   → Chờ quyết: gỡ khỏi menu, hay giữ làm công cụ nội bộ (can-quyet.js).
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('cms-configurechucnang');
    if (!root) return;
    root.innerHTML = ums.pat.page('Cấu hình chức năng') + ums.pat.panel({
        title: 'Công cụ sinh mã màn hình', icon: 'fa-laptop-code',
        body: ums.ui.empty('Công cụ này không dựng lại ở giao diện mới — bản gốc là công cụ sinh mã nội bộ của lập trình viên ' +
            '(chạy câu SQL tự do, eval, đọc cấu hình trong bộ nhớ trình duyệt) và không mở được trên trình duyệt thường. ' +
            'Đang chờ quyết định gỡ khỏi menu hay giữ làm công cụ nội bộ.', 'fa-laptop-code')
    });
})();
