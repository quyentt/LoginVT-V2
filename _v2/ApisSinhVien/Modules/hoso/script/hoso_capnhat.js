/* =========================================================================
   Cập nhật hồ sơ sinh viên
   Bản gốc: ApisSinhVien/Modules/hoso/html/hoso_capnhat.html + script/hosocapnhat.js
            (+ dexuathoso.js + zoneEditModal_inject.js — biểu mẫu "Chỉnh sửa - Hồ sơ đề xuất", ums.hsA.editor)
   ---------------------------------------------------------------------------
   Bố cục gốc HAI cột: trái ô từ khoá + "Danh sách cập nhật" (ảnh · họ tên · ngày sinh · nút Xem, phân trang);
   phải biểu mẫu 3 tab trong trang (#zeInlineHost). Bấm "Xem" → openEditByPerson.
   Lời gọi: SV_HoSo/LayDanhSach GET (strTuKhoa, strHeDaoTao_Id, strKhoaDaoTao_Id, strChuongTrinh_Id, strLopQuanLy_Id,
            strNguoiThucHien_Id '', pageIndex, pageSize).
   Lỗi gốc đã sửa: getList_HSSV đọc từ khoá / Hệ / Khoá / Ngành / Lớp từ các ô *_DS KHÔNG có trên trang (ô từ khoá
   thật là txtSearchSinhVien_TuKhoa_CN) → gõ từ khoá + Enter chưa từng lọc được. Nay gửi đúng ô từ khoá; bốn ô lọc
   kia không có trên trang nên gửi rỗng như gốc. Ảnh ở danh sách gốc đọc nhầm data.ANH của CẢ mảng (luôn trống)
   → nay ảnh của từng sinh viên.
   Cố ý bỏ (mã chết — form cũ ẩn cứng, nút Thêm không hiện): CMS.TTSV "thuộc tính sinh viên" (CMS_DanhMucDuLieu/
   ThemMoi|CapNhat ghi vào danh mục chung khi bấm +/−), viewForm_HSSV.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('sv-hoso-capnhat');
    if (!root) return;
    var esc = ums.ui.esc;
    ums.hsA.manHaiCot({
        el: root, title: 'Cập nhật hồ sơ', sideTitle: 'Danh sách cập nhật', loc: false, call: ums.hsA.callHoSo,
        dong: function (r) { return '<span class="ums-master__item__sub">' + esc(ums.hsA.ngaySinh(r)) + '</span>'; }
    });
})();
