/* =========================================================================
   Tổng quan — phân hệ Sinh viên — TRANG MẪU (khung chung ums.dbv2)
   Bản gốc: ApisSinhVien/Modules/dashboard/html/dashboard.html + script/dashboard.js (2018).
   Bản gốc là TRANG MẪU TĨNH: bốn ô số viết cứng trong html (Tổng sinh viên 2,000 · Sinh viên mới 760 ·
   Sinh viên nghỉ 100 · Sinh viên tốt nghiệp 90%) + một "Biểu đồ đường" hai đường số liệu viết cứng
   ([1, 5, 3] "Tên đường số 1" đỏ, [2, 1, 4] "Tên đường số 2" xanh, tiêu đề "Biến động sinh viên hàng năm").
   KHÔNG có lời gọi API nào. Chép NGUYÊN số liệu, chỉ đổi cách vẽ:
     · bốn ô info-box AdminLTE → thẻ KPI của ums.dbv2 (màu giữ theo gốc: xanh lá / vàng / đỏ / xanh ngọc);
     · edu.system.lineChart (Chart.js 2) → api.bieuDo (Chart.js 4, cấu hình v2 tự đổi).
   Khác gốc:
     · Gốc truyền `labels: []` nên Chart.js không vẽ điểm nào (biểu đồ trống, chỉ có chú thích). Ở đây đánh
       nhãn trục hoành 1, 2, 3 để ba điểm hiện ra — vẫn là số liệu mẫu, ghi ở đầu trang "Trang mẫu".
     · Bỏ hàm chết pieChart_ThongKeTinhTrangKhaoSat (không nơi nào gọi, đọc biến không tồn tại).
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('sv-dashboard');
    if (!root) return;

    ums.dbv2.man(root, {
        tieuDe: 'Tổng quan', moTa: 'Tình hình sinh viên', icon: 'fa-solid fa-gauge', nguon: 'Số liệu viết cứng trong bản gốc',
        tinh: function () {
            return {
                kpis: [
                    { iconClass: 'fa-solid fa-users', label: 'Tổng sinh viên', value: '2,000', color: 'green' },
                    { iconClass: 'fa-solid fa-users', label: 'Sinh viên mới', value: '760', color: 'yellow' },
                    { iconClass: 'fa-solid fa-users', label: 'Sinh viên nghỉ', value: '100', color: 'red' },
                    { iconClass: 'fa-solid fa-users', label: 'Sinh viên tốt nghiệp', value: '90%', color: 'cyan' }
                ],
                duong: {
                    labels: ['1', '2', '3'],
                    datasets: [
                        { label: 'Tên đường số 1', data: [1, 5, 3], borderColor: 'red', backgroundColor: 'red', fill: false },
                        { label: 'Tên đường số 2', data: [2, 1, 4], borderColor: 'green', backgroundColor: 'green', fill: false }
                    ]
                }
            };
        },
        the: [
            { key: 'duong', rong: 2, cao: 300, tieuDe: 'Biểu đồ đường', icon: 'fa-chart-line',
                ve: function (host, kq, api) {
                    api.bieuDo(host, 'line', kq.duong, {
                        responsive: true, maintainAspectRatio: false,
                        legend: { display: true, position: 'top' },
                        title: { display: true, position: 'bottom', text: 'Biến động sinh viên hàng năm' }
                    });
                } }
        ]
    });
})();
