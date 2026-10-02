/* =========================================================================
   Dashboard Sinh viên — TRANG MẪU (cổng cán bộ). Khung chung ums.dbv2 (_dbv2.js).
   Bản gốc: ApisCongCanBo/Modules/Dashboardv2/html/sinh-vien.html + script/sinh-vien.js ("Placeholder data (sẽ thay bằng API sau)").
   Số liệu MẪU viết cứng trong seedMockData của gốc — KHÔNG có lời gọi API, KHÔNG có bộ lọc. Chép NGUYÊN:
   4 thẻ KPI, lịch học hôm nay, thông tin sinh viên, thống kê học tập, dữ liệu 3 biểu đồ; cấu hình biểu đồ giữ
   dạng Chart.js 2 (khung tự đổi sang v4).
   Khác gốc:
     · Bố cục gốc: cột trái 3 biểu đồ + cột phải 1 thẻ "Thông tin sinh viên" → lưới hai cột của khung, giữ thứ tự thẻ.
     · Radar gốc khai `scale` (số ít, kiểu v2) → truyền qua `scales` để v2sang4 đổi thành trục r (min 0, max 20);
       angleLines / pointLabels (chỉ là màu kẻ, cỡ chữ) bỏ.
     · Lịch học hôm nay (gốc: danh sách khối) → bảng ums.ui.table; thống kê học tập → dòng .ums-kv.
     · Dòng "Trạng thái: OK" ở đầu trang gốc (gán cứng) bỏ — khung đã có "Cập nhật" / "Nguồn".
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('dbv2-sinh-vien');
    if (!root) return;
    var D = ums.dbv2, esc = ums.ui.esc;

    function seedMockData() {
        return {
            kpis: [
                { iconClass: 'fa-solid fa-trophy', label: 'GPA hiện tại', value: '3.45', change: '+0.15', subtext: 'so với kỳ trước', trendDirection: 'up', color: 'red' },
                { iconClass: 'fa-solid fa-book', label: 'Tín chỉ tích lũy', value: '95/140', change: '+18 TC', subtext: 'kỳ này', trendDirection: 'up', color: 'blue' },
                { iconClass: 'fa-solid fa-calendar-days', label: 'Số môn đang học', value: '7', change: '22 tín chỉ', subtext: 'kỳ 1 năm 2024-2025', trendDirection: 'stable', color: 'green' },
                { iconClass: 'fa-solid fa-star', label: 'Điểm rèn luyện', value: '85/100', change: 'Loại Tốt', subtext: 'kỳ này', trendDirection: 'up', color: 'yellow' }],
            schedule: [
                { time: '07:00-09:30', subject: 'Lập trình Java', room: 'A101', teacher: 'TS. Nguyễn Văn A' },
                { time: '09:45-12:15', subject: 'Cơ sở dữ liệu', room: 'B205', teacher: 'ThS. Trần Thị B' },
                { time: '13:30-16:00', subject: 'Tiếng Anh 3', room: 'C301', teacher: 'ThS. Lê Văn C' }],
            academic: {
                labels: ['HK1-2022', 'HK2-2022', 'HK1-2023', 'HK2-2023', 'HK1-2024', 'HK2-2024', 'HK1-2025'],
                datasets: [
                    { label: 'GPA', data: [2.8, 3.0, 3.2, 3.3, 3.4, 3.3, 3.45], borderColor: 'rgba(239, 68, 68, 1)', backgroundColor: 'rgba(239, 68, 68, 0.10)',
                        borderWidth: 3, pointRadius: 3, pointHoverRadius: 5, fill: true, lineTension: 0.35, yAxisID: 'y' },
                    { label: 'Tín chỉ tích lũy', data: [15, 30, 48, 66, 77, 95, 95], borderColor: 'rgba(59, 130, 246, 1)', backgroundColor: 'rgba(59, 130, 246, 0.10)',
                        borderWidth: 3, pointRadius: 3, pointHoverRadius: 5, fill: true, lineTension: 0.35, yAxisID: 'y1' }] },
            subject: {
                labels: ['Lập trình Java', 'Cơ sở dữ liệu', 'Mạng máy tính', 'Tiếng Anh 3', 'Toán rời rạc', 'Web Dev', 'Mobile App'],
                datasets: [{ label: 'Điểm số', data: [8.5, 7.8, 8.2, 7.5, 9.0, 8.8, 8.0],
                    backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.8)',
                        'rgba(16, 185, 129, 0.8)', 'rgba(34, 197, 94, 0.8)', 'rgba(34, 197, 94, 0.8)'],
                    borderColor: ['rgba(34, 197, 94, 1)', 'rgba(245, 158, 11, 1)', 'rgba(34, 197, 94, 1)', 'rgba(239, 68, 68, 1)',
                        'rgba(16, 185, 129, 1)', 'rgba(34, 197, 94, 1)', 'rgba(34, 197, 94, 1)'],
                    borderWidth: 2 }] },
            activity: {
                labels: ['Học tập', 'Hoạt động tập thể', 'Hoạt động xã hội', 'Ý thức kỷ luật', 'Phẩm chất đạo đức'],
                datasets: [{ label: 'Điểm rèn luyện', data: [18, 16, 20, 15, 16], backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 1)',
                    pointBackgroundColor: ['rgba(59, 130, 246, 1)', 'rgba(34, 197, 94, 1)', 'rgba(245, 158, 11, 1)', 'rgba(168, 85, 247, 1)', 'rgba(239, 68, 68, 1)'],
                    pointRadius: 3, borderWidth: 2 }] },
            quick: { classRank: '5/45', debtSubjects: '0', scholarship: 'Có', expectedGradYear: '2025' },
            student: { name: 'Nguyễn Thị B', code: '2021001234', faculty: 'Khoa CNTT', cohort: 'K21' }
        };
    }

    function base(extra) {
        return Object.assign({
            legend: { display: true, position: 'top', labels: { fontSize: 12, fontStyle: 'bold', padding: 15 } },
            tooltips: { backgroundColor: 'rgba(255, 255, 255, 0.96)', titleFontColor: '#0f172a', bodyFontColor: '#334155', borderColor: '#e2e8f0',
                borderWidth: 1, xPadding: 10, yPadding: 10, cornerRadius: 8 }
        }, extra);
    }

    D.man(root, {
        tieuDe: 'Dashboard Sinh viên', moTa: 'Theo dõi kết quả học tập và hoạt động', icon: 'fa-solid fa-user-graduate',
        loc: [], macDinh: {},
        tinh: function () { return seedMockData(); },
        the: [
            { key: 'hoctap', tieuDe: 'Kết quả học tập theo kỳ', icon: 'fa-chart-line', moTa: 'GPA và số tín chỉ tích lũy',
                ve: function (host, kq, api) {
                    api.bieuDo(host, 'line', kq.academic, base({ scales: {
                        yAxes: [{ id: 'y', type: 'linear', position: 'left', ticks: { beginAtZero: true, suggestedMax: 4.0 }, gridLines: { color: 'rgba(0,0,0,0.06)' } },
                            { id: 'y1', type: 'linear', position: 'right', ticks: { beginAtZero: true, suggestedMax: 140 }, gridLines: { drawOnChartArea: false } }],
                        xAxes: [{ gridLines: { display: false }, ticks: { maxRotation: 0 } }] } }));
                } },
            { key: 'monhoc', tieuDe: 'Điểm số các môn học', icon: 'fa-list-check', moTa: 'Kết quả học tập kỳ hiện tại',
                ve: function (host, kq, api) {
                    api.bieuDo(host, 'bar', kq.subject, base({ scales: {
                        yAxes: [{ ticks: { beginAtZero: true, max: 10 }, gridLines: { color: 'rgba(0,0,0,0.06)' } }],
                        xAxes: [{ gridLines: { display: false }, ticks: { autoSkip: false, fontSize: 11 } }] } }));
                } },
            { key: 'ngoaikhoa', tieuDe: 'Hoạt động ngoại khóa', icon: 'fa-bullseye', moTa: 'Điểm rèn luyện và hoạt động',
                ve: function (host, kq, api) {
                    // gốc: options.scale (radar v2) — v2sang4 đọc radar ở `scales`
                    api.bieuDo(host, 'radar', kq.activity, base({ legend: { display: true, position: 'top' },
                        scales: { ticks: { beginAtZero: true, max: 20 }, gridLines: { color: 'rgba(0,0,0,0.08)' } } }));
                } },
            { key: 'hoso', bang: true, tieuDe: 'Thông tin sinh viên', icon: 'fa-id-card', moTa: 'Thông tin tóm tắt hồ sơ',
                ve: function (host, kq, api) {
                    var s = kq.student || {}, q = kq.quick || {};
                    function kv(nhan, gt) { return '<div class="ums-kv"><span>' + esc(nhan) + '</span><b>' + esc(gt || '--') + '</b></div>'; }
                    host.innerHTML =
                        '<div class="ums-stat"><div class="ums-stat__icon">SV</div><div class="ums-stat__main">' +
                            '<div class="ums-stat__value">' + esc(s.name || '--') + '</div>' +
                            '<div class="ums-stat__label">MSSV: ' + esc(s.code || '--') + '</div>' +
                            '<div class="ums-stat__label">' + esc(s.faculty || '--') + ' - ' + esc(s.cohort || '--') + '</div></div></div>' +
                        '<div class="ums-u-bold ums-u-mt-4 ums-u-mb-2">Lịch học hôm nay</div><div data-z="lich"></div>' +
                        '<div class="ums-u-bold ums-u-mt-4 ums-u-mb-2">Thống kê học tập</div>' +
                        kv('Xếp hạng lớp', q.classRank) + kv('Số môn nợ', q.debtSubjects) + kv('Học bổng', q.scholarship) + kv('Dự kiến TN', q.expectedGradYear);
                    api.bang(host.querySelector('[data-z="lich"]'), [
                        { title: 'Thời gian', prop: 'time', width: '110px' },
                        { title: 'Môn học', render: function (r) { return '<b>' + esc(r.subject || '') + '</b>'; } },
                        { title: 'Phòng', prop: 'room', cls: 'is-center', width: '70px' },
                        { title: 'Giảng viên', prop: 'teacher' }], kq.schedule);
                } }]
    });
})();
