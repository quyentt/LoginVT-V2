/* =========================================================================
   Dashboard (ApisNhanSu) — TRANG MẪU TĨNH
   Bản gốc: ApisNhanSu/Modules/dashboard/html/dashboard.html + script/dashboard.js
   ---------------------------------------------------------------------------
   Gốc là trang HTML dựng sẵn: tiêu đề "Dashboard" + 5 thẻ ảnh (assets/images/dashboard-1/2/3.png) cùng chữ
   "Dashboard Mod điểm" và nút "Chi tiết" trỏ tới "modul-chitiet.html" — trang KHÔNG tồn tại.
   Tệp .js gốc (biểu đồ biến động nhân sự, giới tính / chức danh, tuổi, hệ số lương, sinh nhật — đọc NS_HoSoV2/
   LayDanhSach) KHÔNG BAO GIỜ CHẠY: html gọi `new DashBoard()` còn tệp khai lớp `Dashboard` (khác chữ hoa) →
   ReferenceError ngay khi mở; các vùng biểu đồ mà .js đổ vào cũng không có trong html.
   Bản mới: chép đúng trang mẫu (5 thẻ ảnh), nút "Chi tiết" để KHOÁ (đích không tồn tại), đầu trang ghi rõ là
   trang mẫu. Ảnh lấy từ assets/images của ứng dụng gốc (bản mới nằm trong _v2/ → "../").
   Chờ nghiệp vụ (ghi báo cáo): có dựng thật bảng điều khiển nhân sự theo dashboard.js hay gỡ mục menu.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('ns-dashboard');
    if (!root) return;
    var ui = ums.ui, pat = ums.pat;
    var ANH = [1, 2, 3, 1, 2];
    root.innerHTML = pat.page('Dashboard') +
        '<p class="ums-u-muted ums-u-fz13 ums-u-mb-4"><i class="fa-light fa-circle-info"></i> Trang mẫu — bản gốc chỉ có ảnh minh hoạ, chưa nối số liệu.</p>' +
        '<div class="nsdb-luoi">' + ANH.map(function (n) {
            return '<div class="ums-panel nsdb-the"><div class="nsdb-the__anh"><img alt="" src="../assets/images/dashboard-' + n + '.png" onerror="this.remove()">' +
                '<i class="fa-light fa-chart-mixed"></i></div>' +
                '<div class="nsdb-the__chan"><span>Dashboard Mod điểm</span>' +
                ui.btn('view', { text: 'Chi tiết', icon: 'fa-eye', cls: 'ums-btn--sm', attr: { disabled: 'disabled', title: 'Trang chi tiết của bản gốc không tồn tại' } }) +
                '</div></div>';
        }).join('') + '</div>';
})();
