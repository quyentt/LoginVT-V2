/* =========================================================================
   Dashboard Lãnh đạo Phòng TCKT — TRANG MẪU (cổng cán bộ). Khung chung ums.dbv2 (_dbv2.js).
   Bản gốc: ApisCongCanBo/Modules/Dashboardv2/html/lanh-dao-phong-tckt.html + script/lanh-dao-phong-tckt.js.
   Số liệu MẪU viết CỨNG trong gốc (kpiData, tuitionTrendData, debtData, monthlyTrendData, riskListData,
   renderQuickStats) — chép NGUYÊN; gốc KHÔNG có lời gọi API.
   Bộ lọc: gốc chỉ hiện khung chờ 0,5 giây rồi vẽ lại CÙNG số liệu → bản mới giữ đúng: số liệu không đổi theo bộ lọc.
   Đã bỏ / đổi:
     · "Trạng thái: Đang tải… → Hoạt động bình thường" ở đầu trang và khung chờ giả (showLoadingState 1 giây) — chỉ là
       hiệu ứng giả lập, khung chung đã có dòng Cập nhật / Nguồn.
     · Dải chú thích màu trong đầu mỗi thẻ → gộp vào dòng mô tả thẻ.
     · Tooltip biểu đồ công nợ: gốc mode 'single' (Chart.js 2) → 'nearest' (Chart.js 4 không còn 'single').
     · Cột trong biểu đồ kết hợp đặt order: 1 để đường nằm TRÊN cột như Chart.js 2 (v4 mặc định vẽ tập đầu lên trên).
   Thẻ "Thống kê tài chính" (cột phải của gốc) → thẻ bảng cuối lưới.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('dbv2-lanh-dao-phong-tckt');
    if (!root) return;
    var D = ums.dbv2, esc = ums.ui.esc;

    /* ---------- Số liệu gốc (chép nguyên) ---------- */
    var KPI = [
        { icon: 'fa-dollar-sign', label: 'Tổng thu năm 2024', category: 'Tổng thu', value: '450 tỷ', trend: 'up', trendValue: '+12%', subtext: 'so với năm 2023', color: 'yellow', tooltip: 'Tổng thu nhập năm 2024' },
        { icon: 'fa-credit-card', label: 'Thu học phí', category: 'Học phí', value: '380 tỷ', trend: 'up', trendValue: '95% kế hoạch', subtext: 'đạt mục tiêu', color: 'green', tooltip: 'Thu học phí đạt 95% kế hoạch' },
        { icon: 'fa-chart-line', label: 'Tổng chi phí', category: 'Chi phí', value: '320 tỷ', trend: 'up', trendValue: '+8%', subtext: 'tăng hợp lý', color: 'red', tooltip: 'Tổng chi phí năm 2024' },
        { icon: 'fa-chart-pie', label: 'Lợi nhuận', category: 'Lợi nhuận', value: '130 tỷ', trend: 'up', trendValue: '+18%', subtext: 'tăng trưởng tốt', color: 'blue', tooltip: 'Lợi nhuận năm 2024' }
    ];
    function kpis() {
        // gốc: lên = xanh, xuống = đỏ (không đảo màu KPI nào)
        return KPI.map(function (k) {
            return { iconClass: 'fa-solid ' + k.icon, label: k.label, value: k.value, change: k.trendValue, trendDirection: k.trend === 'up' ? 'up' : 'down',
                trendClass: k.trend === 'up' ? 'good' : 'bad', color: k.color, subtext: k.subtext, tooltip: k.tooltip, details: ['Nhóm: ' + k.category] };
        });
    }
    var DIEM = { pointBorderColor: '#fff', pointBorderWidth: 2 };
    function hocPhi() {
        return {
            labels: ['HK1 22-23', 'HK2 22-23', 'HK1 23-24', 'HK2 23-24', 'HK1 24-25', 'HK2 24-25'],
            datasets: [
                { label: 'Đã thu (tỷ)', type: 'bar', data: [3.5, 3.2, 3.1, 2.9, 2.8, 2.6], backgroundColor: 'rgba(59, 130, 246, 0.8)', borderColor: 'rgba(59, 130, 246, 1)', borderWidth: 2, yAxisID: 'y-axis-1', order: 1 },
                { label: 'Phải thu (tỷ)', type: 'bar', data: [3.7, 3.5, 3.4, 3.2, 3.5, 3.3], backgroundColor: 'rgba(203, 213, 225, 0.5)', borderColor: 'rgba(148, 163, 184, 1)', borderWidth: 1, yAxisID: 'y-axis-1', order: 1 },
                Object.assign({ label: 'Tỷ lệ hoàn thành (%)', type: 'line', data: [94.6, 91.4, 91.2, 90.6, 80, 78.8], borderColor: 'rgba(245, 158, 11, 1)', backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderWidth: 3, tension: 0.4, yAxisID: 'y-axis-2', fill: false, pointRadius: 6, pointBackgroundColor: 'rgba(245, 158, 11, 1)' }, DIEM)]
        };
    }
    function congNo() {
        return {
            labels: ['K2018', 'K2019', 'K2020', 'K2021', 'K2022', 'K2023', 'K2024', 'K2017', 'K2016', 'K2015'],
            datasets: [{
                label: 'Công nợ học phí', data: [1250, 980, 850, 720, 650, 580, 420, 380, 320, 280],
                backgroundColor: ['rgba(239, 68, 68, 0.85)', 'rgba(239, 68, 68, 0.75)', 'rgba(239, 68, 68, 0.65)', 'rgba(245, 158, 11, 0.85)', 'rgba(245, 158, 11, 0.75)',
                    'rgba(245, 158, 11, 0.65)', 'rgba(59, 130, 246, 0.85)', 'rgba(59, 130, 246, 0.75)', 'rgba(59, 130, 246, 0.65)', 'rgba(59, 130, 246, 0.55)'],
                borderColor: ['rgba(239, 68, 68, 1)', 'rgba(239, 68, 68, 1)', 'rgba(239, 68, 68, 1)', 'rgba(245, 158, 11, 1)', 'rgba(245, 158, 11, 1)',
                    'rgba(245, 158, 11, 1)', 'rgba(59, 130, 246, 1)', 'rgba(59, 130, 246, 1)', 'rgba(59, 130, 246, 1)', 'rgba(59, 130, 246, 1)'],
                borderWidth: 2,
                studentCount: [485, 398, 345, 298, 265, 238, 185, 158, 135, 118],
                debtRatio: [22.5, 18.2, 16.5, 14.8, 13.2, 11.8, 8.5, 7.8, 6.5, 5.8]
            }]
        };
    }
    function theoThang() {
        return {
            labels: ['Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
            datasets: [
                { label: 'Đã thu (tỷ)', type: 'bar', data: [1, 0.8, 1.2, 1.1, 1], backgroundColor: 'rgba(59, 130, 246, 0.8)', borderColor: 'rgba(59, 130, 246, 1)', borderWidth: 2, yAxisID: 'y-axis-1', order: 1 },
                Object.assign({ label: 'Mục tiêu (tỷ)', type: 'line', data: [0.9, 1, 1, 1, 1], borderColor: 'rgba(16, 185, 129, 1)', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderWidth: 3,
                    tension: 0.4, yAxisID: 'y-axis-1', fill: false, pointRadius: 5, pointBackgroundColor: 'rgba(16, 185, 129, 1)', borderDash: [5, 5] }, DIEM),
                Object.assign({ label: 'Tỷ lệ thu (%)', type: 'line', data: [111, 80, 120, 110, 100], borderColor: 'rgba(239, 68, 68, 1)', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderWidth: 3,
                    tension: 0.4, yAxisID: 'y-axis-2', fill: false, pointRadius: 6, pointBackgroundColor: 'rgba(239, 68, 68, 1)' }, DIEM)]
        };
    }
    var RUI_RO = [
        { major: 'Công nghệ thông tin', riskScore: 85, riskLevel: 'high', reasons: ['Tỷ lệ nợ quá hạn cao (12%)', 'Doanh thu giảm 8% so với năm trước'], trend: 'up', trendValue: 12 },
        { major: 'Kế toán - Kiểm toán', riskScore: 78, riskLevel: 'medium', reasons: ['Tỷ lệ miễn giảm cao (14%)', 'Chưa đạt kế hoạch thu (88%)'], trend: 'up', trendValue: 8 },
        { major: 'Quản trị kinh doanh', riskScore: 72, riskLevel: 'medium', reasons: ['Nợ học phí cao (18%)', 'Tiệm cận kế hoạch (92%)'], trend: 'up', trendValue: 6 },
        { major: 'Tài chính - Ngân hàng', riskScore: 55, riskLevel: 'medium', reasons: ['Tỷ lệ nợ ở mức chấp nhận (8%)', 'Quyết toán trễ hạn (12%)'], trend: 'stable', trendValue: 3 },
        { major: 'Luật kinh tế', riskScore: 42, riskLevel: 'low', reasons: ['Đạt kế hoạch thu (102%)', 'Công nợ rất tốt (3%)'], trend: 'down', trendValue: -2 }
    ];
    var THONG_KE = [
        { nhan: 'Tỷ suất lợi nhuận', gt: '28.9%' }, { nhan: 'Nợ xấu', gt: '2.1%', tone: 'bad' },
        { nhan: 'Thanh khoản', gt: '1.8', tone: 'info' }, { nhan: 'ROI', gt: '15.2%' }];

    /* ---------- Bảng rủi ro (getRiskBadge / getTrendBadge của gốc) ---------- */
    var MUC = { high: ['Cao', 'bad'], medium: ['Trung bình', 'warn'], low: ['Thấp', 'good'] };
    function xuHuong(trend, v) {
        if (trend === 'up') return D.badge((v >= 10 ? '↑↑ ' : '↑ ') + (v >= 10 ? 'Tăng mạnh' : 'Tăng'), 'bad');
        if (trend === 'down') return D.badge('↓ Giảm', 'good');
        return D.badge('→ Ổn định', 'info');
    }

    /* ---------- Cấu hình biểu đồ (Chart.js 2 như gốc — khung tự đổi sang v4) ---------- */
    var TOOLTIP = { mode: 'index', intersect: false, backgroundColor: 'rgba(255, 255, 255, 0.98)', titleFontColor: '#1f2937', bodyFontColor: '#4b5563',
        borderColor: '#e5e7eb', borderWidth: 2, cornerRadius: 10, xPadding: 15, yPadding: 15 };
    var LEGEND_DUOI = { display: true, position: 'bottom', labels: { fontSize: 12, padding: 15, usePointStyle: true } };
    function ty(v) { return Number(v).toFixed(1) + ' tỷ'; }

    D.man(root, {
        tieuDe: 'Dashboard Lãnh đạo Phòng TCKT', moTa: '💰 Quản lý tài chính và kế toán trường - Dữ liệu cập nhật theo thời gian thực', icon: 'fa-solid fa-chart-pie',
        nguon: 'Hệ thống quản lý tài chính',
        loc: [
            { key: 'year', label: 'Năm học', items: [{ value: '2024-2025', text: '2024-2025' }, { value: '2023-2024', text: '2023-2024' }, { value: '2022-2023', text: '2022-2023' }, { value: '2021-2022', text: '2021-2022' }] },
            { key: 'semester', label: 'Học kỳ', items: [{ value: '', text: 'Tất cả học kỳ' }, { value: 'hk1', text: 'Học kỳ 1' }, { value: 'hk2', text: 'Học kỳ 2' }, { value: 'hk3', text: 'Học kỳ 3 (Hè)' }] },
            { key: 'level', label: 'Bậc đào tạo', items: [{ value: '', text: 'Tất cả bậc' }, { value: 'daihoc', text: 'Đại học' }, { value: 'thacsi', text: 'Thạc sĩ' },
                { value: 'tiensi', text: 'Tiến sĩ' }, { value: 'lienthong', text: 'Liên thông' }] },
            { key: 'unit', label: 'Đơn vị', items: [{ value: '', text: 'Toàn trường' }, { value: 'cntt', text: 'Khoa CNTT' }, { value: 'ktoan', text: 'Khoa Kinh tế' },
                { value: 'ngoaingu', text: 'Khoa Ngoại ngữ' }, { value: 'kythuat', text: 'Khoa Kỹ thuật' }, { value: 'yte', text: 'Khoa Y tế' }] }],
        macDinh: { year: '2024-2025', semester: '', level: '', unit: '' },
        tinh: function () {
            // gốc: bộ lọc không làm đổi số liệu (applyFilters vẽ lại cùng dữ liệu)
            return { kpis: kpis(), hocPhi: hocPhi(), congNo: congNo(), thang: theoThang(), ruiRo: RUI_RO, thongKe: THONG_KE };
        },
        the: [
            { key: 'hocphi', rong: 2, cao: 360, tieuDe: 'Thu học phí theo Năm học / Học kỳ', icon: 'fa-chart-line',
                moTa: 'Xu hướng thu học phí và tỷ lệ hoàn thành kế hoạch · Đạt: ≥ 95% · Gần đạt: 85-95% · Chưa đạt: < 85%',
                ve: function (host, kq, api) {
                    api.bieuDo(host, 'bar', kq.hocPhi, { legend: LEGEND_DUOI,
                        tooltips: Object.assign({}, TOOLTIP, { cornerRadius: 8, callbacks: {
                            label: function (it, data) { var l = data.datasets[it.datasetIndex].label || ''; return (l ? l + ': ' : '') + Number(it.yLabel).toFixed(1) + (it.datasetIndex === 2 ? '%' : ' tỷ'); } } }),
                        scales: {
                            xAxes: [{ gridLines: { display: false }, scaleLabel: { display: true, labelString: 'Học kỳ' } }],
                            yAxes: [
                                { id: 'y-axis-1', type: 'linear', position: 'left', ticks: { beginAtZero: true, callback: ty }, scaleLabel: { display: true, labelString: 'Số tiền (tỷ VNĐ)' }, gridLines: { color: 'rgba(0, 0, 0, 0.05)' } },
                                { id: 'y-axis-2', type: 'linear', position: 'right', ticks: { beginAtZero: true, max: 100, stepSize: 10, callback: function (v) { return v + '%'; } },
                                    scaleLabel: { display: true, labelString: 'Tỷ lệ hoàn thành (%)' }, gridLines: { drawOnChartArea: false } }] } });
                } },
            { key: 'congno', rong: 2, cao: 360, tieuDe: 'Công nợ học phí theo khóa', icon: 'fa-triangle-exclamation',
                moTa: 'TOP 10 khóa có số nợ học phí cao nhất (triệu VNĐ) · Theo khóa học · Cập nhật: Hàng ngày (Daily)',
                ve: function (host, kq, api) {
                    api.bieuDo(host, 'bar', kq.congNo, { legend: { display: false },
                        tooltips: Object.assign({}, TOOLTIP, { mode: 'nearest', intersect: true, callbacks: {
                            title: function (items, data) { return '🎓 Khóa ' + data.labels[items[0].index]; },
                            label: function (it) { return '💰 Tổng nợ học phí: ' + Number(it.yLabel).toLocaleString('en-US') + ' triệu VNĐ'; },
                            afterLabel: function (it, data) {
                                var ds = data.datasets[0];
                                return ['👥 Tổng số sinh viên còn nợ: ' + ds.studentCount[it.index].toLocaleString('en-US') + ' SV', '📊 Tỷ lệ nợ so với toàn trường: ' + ds.debtRatio[it.index] + '%'];
                            },
                            footer: function () { return '\n⚠️ Cần theo dõi và xử lý công nợ'; } } }),
                        scales: {
                            yAxes: [{ ticks: { beginAtZero: true, fontSize: 11, fontColor: '#64748b', callback: function (v) { return v >= 1000 ? (v / 1000).toFixed(1) + ' tỷ' : Number(v).toLocaleString('en-US') + ' tr'; } },
                                scaleLabel: { display: true, labelString: 'Tổng số tiền học phí còn nợ (triệu VNĐ)' }, gridLines: { color: 'rgba(0, 0, 0, 0.06)', drawBorder: false } }],
                            xAxes: [{ gridLines: { display: false }, ticks: { fontSize: 12, fontColor: '#475569', autoSkip: false, maxRotation: 0, minRotation: 0 },
                                scaleLabel: { display: true, labelString: 'Khóa học' } }] } });
                } },
            { key: 'ruiro', rong: 2, bang: true, tieuDe: 'Danh sách rủi ro tài chính theo ngành', icon: 'fa-triangle-exclamation',
                moTa: 'Các ngành/CTĐT có rủi ro cao về công nợ và thu học phí · Cao: ≥ 80 · TB: 50-80 · Thấp: < 50',
                ve: function (host, kq, api) {
                    api.bang(host, [
                        { title: 'Ngành/CTĐT', width: '25%', render: function (r) { return '<b>' + esc(r.major) + '</b>'; } },
                        { title: 'Mức rủi ro', width: '20%', render: function (r) { var m = MUC[r.riskLevel] || MUC.low; return api.badge(m[0] + ' (' + r.riskScore + ')', m[1]); } },
                        { title: 'Nguyên nhân chính', width: '40%', render: function (r) { return r.reasons.map(function (x) { return '• ' + esc(x); }).join('<br>'); } },
                        { title: 'Xu hướng', width: '15%', render: function (r) { return xuHuong(r.trend, r.trendValue); } }], kq.ruiRo, {
                        rowCls: function (r) { return r.riskLevel === 'high' ? 'dbv-dong--bad' : ''; } });
                } },
            { key: 'thang', rong: 2, cao: 360, tieuDe: 'Xu hướng thu học phí toàn trường', icon: 'fa-chart-area',
                moTa: 'Số tiền đã thu và tỷ lệ hoàn thành theo tháng · Đã thu (tỷ) / Mục tiêu (tỷ) / Tỷ lệ thu %',
                ve: function (host, kq, api) {
                    api.bieuDo(host, 'bar', kq.thang, { legend: LEGEND_DUOI,
                        tooltips: Object.assign({}, TOOLTIP, { callbacks: {
                            label: function (it, data) { var l = data.datasets[it.datasetIndex].label || ''; var v = Number(it.yLabel); return (l ? l + ': ' : '') + (it.datasetIndex === 2 ? v.toFixed(0) + '%' : v.toFixed(2) + ' tỷ'); } } }),
                        scales: {
                            xAxes: [{ gridLines: { display: false }, scaleLabel: { display: true, labelString: 'Tháng' }, ticks: { fontSize: 12, fontColor: '#475569' } }],
                            yAxes: [
                                { id: 'y-axis-1', type: 'linear', position: 'left', ticks: { beginAtZero: true, fontSize: 11, fontColor: '#64748b', callback: ty },
                                    scaleLabel: { display: true, labelString: 'Số tiền (tỷ VNĐ)' }, gridLines: { color: 'rgba(0, 0, 0, 0.06)', drawBorder: false } },
                                { id: 'y-axis-2', type: 'linear', position: 'right', ticks: { beginAtZero: true, max: 150, stepSize: 30, fontSize: 11, fontColor: '#64748b', callback: function (v) { return v + '%'; } },
                                    scaleLabel: { display: true, labelString: 'Tỷ lệ thu (%)' }, gridLines: { drawOnChartArea: false, drawBorder: false } }] } });
                } },
            { key: 'thongke', bang: true, tieuDe: 'Thống kê tài chính', icon: 'fa-gauge-high',
                ve: function (host, kq, api) {
                    api.bang(host, [
                        { title: 'Chỉ số', render: function (r) { return esc(r.nhan); } },
                        { title: 'Giá trị', cls: 'is-right', render: function (r) { return r.tone ? api.badge(r.gt, r.tone) : '<b>' + esc(r.gt) + '</b>'; } }], kq.thongKe);
                } }]
    });
})();
