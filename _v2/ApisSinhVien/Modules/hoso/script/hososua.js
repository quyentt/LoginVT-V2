/* =========================================================================
   Sửa hồ sơ (phân hệ Sinh viên) — ĐỂ LẠI, chỉ hiện khung giải thích
   Bản gốc: ApisSinhVien/Modules/hoso/html/hoso_sua.html + script/hososua.js
   ---------------------------------------------------------------------------
   Bản gốc là bản BỎ DỞ chép từ màn hồ sơ CÁN BỘ, chưa từng chạy được:
     · Ô tìm (gõ là tìm) gọi thẳng $.ajax tới v1.0/CM_NhanSu/LayDanhSach_RutGon — danh sách
       CÁN BỘ, không phải sinh viên; nút "Tìm kiếm" / "Tải lại" gọi getList_LoaiKhoanThu —
       hàm KHÔNG tồn tại (ReferenceError).
     · viewForm_HS đổ các cột của hồ sơ cán bộ (MACANBO, DIACHIEMAIL, SODIENTHOAIDIDONG,
       HOCHETLOP, QUANHAMCAONHAT…) vào các ô của biểu mẫu sinh viên; phần lớn ô đích không
       có trong html.
     · Nút "Cập nhật" chỉ hỏi lại rồi khoá ô (closeChinhSua) — KHÔNG gọi lưu; save_HS
       (SV_HoSoSinhVien/ThemMoi) không nơi nào gọi, lại gửi ô txtHo không tồn tại cho gần
       nửa tham số và gọi getList_QD / save_QDNS không tồn tại khi thành công.
     · Ba tab "Thông tin hồ sơ / Thông tin quyết định / Điều chuyển lớp" không có mã nạp.
   Lời gọi duy nhất có ý nghĩa là SV_HoSoSinhVien/LayChiTiet (GET, strId lấy từ đuôi
   localStorage.strRootPath) — không đủ dựng một màn.
   Cập nhật hồ sơ sinh viên đã có ở màn "Cập nhật hồ sơ" (hoso/hoso_capnhat) → nút mở màn đó.
   Chờ quyết gỡ khỏi menu (ghi trong báo cáo chuyển đổi).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui;
    var r = document.getElementById('sv-hososua');
    if (!r) return;
    r.innerHTML = ums.pat.page('Sửa hồ sơ', '<button type="button" class="ums-btn ums-btn--out-primary" data-a="mo"><i class="fa-light fa-arrow-up-right-from-square"></i>' +
        '<span>Mở màn Cập nhật hồ sơ</span></button>') +
        ums.pat.panel({ title: 'Sửa hồ sơ', icon: 'fa-user-pen',
            body: ui.empty('Bản gốc của màn này làm dở (tìm kiếm gọi danh sách cán bộ, nút Cập nhật không lưu) nên không chuyển. ' +
                'Cập nhật hồ sơ sinh viên dùng màn "Cập nhật hồ sơ".', 'fa-user-pen') });
    r.addEventListener('click', function (ev) {
        if (ev.target.closest('[data-a="mo"]')) ums.app.openPath('/modules/hoso/html/hoso_capnhat.html');
    });
})();
