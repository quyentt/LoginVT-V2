/* =========================================================================
   Tất cả hoạt động — bản QUẢN TRỊ (cán bộ nhân sự chọn một người rồi khai
   hoạt động / biến động nhân sự cho người đó)
   Bản gốc: ApisNhanSu/Modules/hoso/script/qtthongtin.js + html/qtthongtin.html
   ---------------------------------------------------------------------------
   Hai cột như gốc: cột trái ums.nsCanBo (getList_NhanSu dLaCanBoNgoaiTruong 0, lọc
   Khoa/Viện/Phòng ban → Bộ môn, Tình trạng làm việc); cột phải DÙNG LẠI khung Cổng
   cán bộ ums.ccbQtThongTin (hoso/script/qtthongtin.js) — bản gốc NS là cùng mã Cổng
   cán bộ, cờ quanTri lo phần lệch (xem chú thích đầu tệp CCB):
     · strNhanSu_HoSoCanBo_Id = người ĐANG CHỌN (me.strNguoiDung_Id);
     · bảng 5 cột (không có nhóm "Biến động liên quan");
     · "Tự nhập hồ sơ" theo hoạt động đang chọn trong biểu mẫu, gửi thêm
       strNhanSu_HoatDong_TT_Id, đủ kiểu TEXT/NUMBER/DATE/LIST/FILE.
   Lời gọi: NS_HoatDong_ThongTin/LayDM_NhanSu_HoatDong · LayDanhSach · ThemMoi | CapNhat · Xoa;
   NS_ThongTinQuyetDinh/* (lưới quyết định, tệp NS_Files); NS_HoatDong_DuLieu/LayDanhSach + ThemMoi.

   Giữ như gốc: bảng một tab "1) Tất cả hoạt động" → không vẽ dải tab; ô đánh dấu +
   nút xoá hàng loạt đã bị chú thích bỏ ở gốc → không vẽ; xoá bằng nút Xoá trong biểu mẫu.
   Lỗi gốc (không chép): nút "Tìm kiếm" của danh sách cán bộ gọi getList_TuNhapHoSo
   (nạp bảng tự nhập) thay vì tìm cán bộ — ở đây tìm cán bộ (Enter ở ô từ khoá, như gốc).
   ========================================================================= */
(function () {
    'use strict';

    ums.nsCanBo.man(document.getElementById('nsqtthongtin'), {
        tieuDe: 'Tất cả hoạt động',
        onChon: function (row, host) {
            ums.ccbQtThongTin.mount(host, {
                tieuDe: false,
                quanTri: true,
                nhanSuId: function () { return row.ID; }
            });
        }
    });
})();
