/* =========================================================================
   quantri_phanlichgiang — Quản trị phân lịch giảng (KHCT). Khung chung: CCB phanlichgiang/_phanlich.js
   Bản gốc chép từ CCB phanlichgiang.js; chỗ lệch (so từng dòng) → cờ của ums.plg.man:
     · LayDSHocPhan gửi dToanBo 1 (CCB 0)
     · ô Thành viên: NS_HoSoV2/LayDanhSach gửi dLaCanBoNgoaiTruong -1 (CCB 0)
     · danh sách bài học bỏ cột "Số tiết" (tiêu đề và cột bị chú thích bỏ ở gốc; biểu mẫu vẫn có ô Số tiết)
     · nút "Phân giảng" (CCB "Xem lịch Phân giảng"); thứ tự nút: Import, Xác nhận, Danh sách mời giảng,
       Kế thừa, Thêm bài học, Danh sách lịch phân giảng, Phân giảng
   Lệch chỉ ở trình bày (không chép): biểu tượng xác nhận fa-4x, tổng số tiết nối "; " trên một dòng,
   màu nút Tổng hợp (btn-warning).
   ========================================================================= */
(function () {
    ums.plg.man(document.getElementById('plg-quantri_phanlichgiang'), {
        sua: true, tieuDe: 'Quản trị phân lịch giảng',
        dToanBo: 1, ngoaiTruong: -1, bhSoTiet: false, nutXemLich: 'Phân giảng',
        thuTuNut: ['import', 'xacnhan', 'moigiang', 'kethua', 'baihoc', 'dslich', 'xemlich']
    });
})();
