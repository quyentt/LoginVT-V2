/* =========================================================================
   Dashboard BGH (Lãnh đạo trường) — TRANG MẪU (cổng cán bộ). Khung chung ums.dbv2 (_dbv2.js).
   Bản gốc: ApisCongCanBo/Modules/Dashboardv2/html/bgh.html + script/bgh.js ("TODO: Thay thế bằng API call thực").
   Số liệu MẪU viết cứng trong gốc (kpiData, facultyData, riskData, dữ liệu 3 biểu đồ) — KHÔNG có lời gọi API.
   Chép NGUYÊN: 4 thẻ KPI, renderQuickStats (tính từ facultyData), renderHighlightCard, renderRiskList (TOP 5),
   ba biểu đồ initGPAChart / initStudentFlowChart / initTuitionChart (cấu hình Chart.js 2, khung tự đổi sang v4).
   Khác gốc:
     · Bộ lọc Năm học / Bậc đào tạo giữ nguyên chữ và giá trị, nhưng gốc KHÔNG đổi số liệu (handleFilterChange chỉ
       cập nhật giờ, "TODO: Reload data") → Áp dụng chỉ vẽ lại, số liệu như cũ.
     · Bố cục gốc: cột trái 3 biểu đồ + cột phải (bộ lọc, thống kê nhanh, thẻ nổi bật, TOP rủi ro) → biểu đồ trải
       hết bề ngang, bộ lọc lên dải lọc chung, ba thẻ cột phải xuống dưới theo đúng thứ tự.
     · Chú giải màu dưới tiêu đề biểu đồ (Tốt / Chưa cao / Phân hóa; 3 kịch bản; công thức tỷ lệ thu) → nhãn màu.
     · Nhãn số trên cột/điểm biểu đồ GPA (plugins.datalabels trong cấu hình gốc) nay HIỆN — gốc khai nhưng không
       nạp plugin nên không thấy.
     · TOP rủi ro (gốc: danh sách khối) → bảng; thẻ nổi bật bỏ đường cong SVG trang trí.
     · Bỏ: renderGPACards (gốc đã tắt, không có vùng #gpaCards), fallback SVG khi thiếu Chart.js (_v2 có sẵn Chart.js),
       hiệu ứng "đang tải" giả 1 giây, exportData / showError (chỉ alert "đang phát triển", không có nút gọi).
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('dbv2-bgh');
    if (!root) return;
    var D = ums.dbv2, esc = ums.ui.esc;

    var KPI = [
        { icon: 'fa-users', label: 'Tổng số sinh viên đang học', category: 'Quy mô sinh viên', value: '33,000', trend: 'up', trendValue: '+3.8%', subtext: 'so với cùng kỳ năm trước', color: 'blue' },
        { icon: 'fa-graduation-cap', label: 'Sinh viên nhập học mới', category: 'Tuyển sinh', value: '12,800', trend: 'up', trendValue: '+11.3%', subtext: '85.3% chỉ tiêu (15,000 SV)', color: 'green' },
        { icon: 'fa-award', label: 'Tỷ lệ TN đúng hạn', category: 'Chỉ số vàng', value: '68.5%', trend: 'up', trendValue: '+5.1%', subtext: 'Mục tiêu 75% (còn thiếu 6.5%)', color: 'orange' },
        { icon: 'fa-triangle-exclamation', label: 'Tỷ lệ SV bị cảnh báo học vụ', category: 'Rủi ro', value: '2.1%', trend: 'down', trendValue: '-25.0%', subtext: '693 sinh viên (giảm 231 SV)', color: 'red' }];
    var KHOA = [
        { name: 'Khoa CNTT', students: 8500, gpa: 3.25, programs: 6, passRate: 92.5 },
        { name: 'Khoa Kinh tế', students: 7200, gpa: 3.08, programs: 5, passRate: 88.2 },
        { name: 'Khoa Ngoại ngữ', students: 4800, gpa: 3.15, programs: 4, passRate: 90.1 },
        { name: 'Khoa Kỹ thuật', students: 6200, gpa: 3.02, programs: 7, passRate: 85.8 },
        { name: 'Khoa Y tế', students: 6300, gpa: 3.18, programs: 3, passRate: 89.6 }];
    var RUIRO = [
        { name: 'Khoa Công nghệ thông tin', riskScore: 85.2, level: 'Cao', color: 'high', mainCause: 'GPA TB ↓, Tỷ lệ trượt ↑', icon: 'fa-computer' },
        { name: 'Khoa Cơ khí', riskScore: 76.8, level: 'Trung bình', color: 'medium', mainCause: 'SV thôi học cao', icon: 'fa-gear' },
        { name: 'Khoa Kinh tế', riskScore: 68.4, level: 'Trung bình', color: 'medium', mainCause: 'Nhập điểm trễ', icon: 'fa-chart-line' },
        { name: 'Khoa Ngoại ngữ', riskScore: 58.7, level: 'Trung bình', color: 'medium', mainCause: 'Vi phạm tiến độ đào tạo', icon: 'fa-language' },
        { name: 'Khoa Kỹ thuật', riskScore: 45.3, level: 'Thấp', color: 'low', mainCause: 'Ổn định chung', icon: 'fa-wrench' }];
    var TONE = { high: 'bad', medium: 'warn', low: 'good' };

    function tongSV() { return KHOA.reduce(function (s, f) { return s + f.students; }, 0); }
    function quickStats() {
        var avgGPA = (KHOA.reduce(function (s, f) { return s + f.gpa; }, 0) / KHOA.length).toFixed(2);
        var totalPrograms = KHOA.reduce(function (s, f) { return s + f.programs; }, 0);
        return [
            { icon: 'fa-building-columns', label: 'Tổng số khoa', value: KHOA.length },
            { icon: 'fa-list-check', label: 'Tổng số ngành', value: totalPrograms },
            { icon: 'fa-star', label: 'GPA TB toàn trường', value: avgGPA },
            { icon: 'fa-briefcase', label: 'Tỷ lệ có việc làm', value: '92.8%' },
            { icon: 'fa-users', label: 'Tổng SV đang học', value: tongSV().toLocaleString('en-US') }];
    }
    function gpaData() {
        return { labels: KHOA.map(function (f) { return f.name.replace('Khoa ', ''); }), datasets: [
            { label: 'GPA TB (thang 4)', data: KHOA.map(function (f) { return f.gpa; }), backgroundColor: 'rgba(74, 144, 226, 0.9)', borderColor: 'rgba(74, 144, 226, 1)',
                borderWidth: 2, yAxisID: 'y-axis-gpa', barThickness: 50 },
            { label: 'Tỷ lệ đỗ (%)', data: KHOA.map(function (f) { return f.passRate; }), type: 'line', borderColor: 'rgba(245, 158, 11, 1)', backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderWidth: 3, fill: false, yAxisID: 'y-axis-pass', pointRadius: 6, pointHoverRadius: 8, pointBackgroundColor: 'rgba(245, 158, 11, 1)', pointBorderColor: '#fff', pointBorderWidth: 2 }] };
    }
    function flowData() {
        function ds(label, data, c) { return { label: label, data: data, borderColor: 'rgba(' + c + ', 1)', backgroundColor: 'rgba(' + c + ', 0.05)', borderWidth: 3, fill: false, pointRadius: 0, pointHoverRadius: 6, tension: 0.4 }; }
        return { labels: ['2021', '2022', '2023', '2024', '2025'], datasets: [
            ds('SV nhập mới', [3000, 5000, 7500, 9000, 12000], '59, 130, 246'),
            ds('SV đang học', [7000, 10000, 15000, 22000, 32500], '16, 185, 129'),
            ds('SV tốt nghiệp', [500, 800, 1000, 1200, 1500], '245, 158, 11')] };
    }
    function tuitionData() {
        var diem = { borderWidth: 3, fill: false, pointRadius: 6, pointHoverRadius: 8, pointBorderColor: '#fff', pointBorderWidth: 2, tension: 0.3, order: 1, type: 'line' };
        return { labels: ['Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'], datasets: [
            { label: 'Đã thu (tỷ)', data: [45, 75, 95, 112, 125], backgroundColor: 'rgba(59, 130, 246, 0.85)', borderColor: 'rgba(59, 130, 246, 1)', borderWidth: 1, yAxisID: 'y-axis-1', barThickness: 50, order: 2 },
            Object.assign({ label: 'Mục tiêu (tỷ)', data: [50, 80, 100, 115, 132], borderColor: 'rgba(139, 195, 74, 1)', backgroundColor: 'rgba(139, 195, 74, 0.1)',
                yAxisID: 'y-axis-1', pointBackgroundColor: 'rgba(139, 195, 74, 1)' }, diem),
            Object.assign({ label: 'Tỷ lệ thu %', data: [90, 94, 95, 97, 95], borderColor: 'rgba(239, 68, 68, 1)', backgroundColor: 'rgba(239, 68, 68, 0.1)',
                yAxisID: 'y-axis-2', pointBackgroundColor: 'rgba(239, 68, 68, 1)' }, diem)] };
    }
    var TIP_TRANG = { mode: 'index', intersect: false, backgroundColor: 'rgba(255, 255, 255, 0.95)', titleFontColor: '#1e293b', bodyFontColor: '#64748b', borderColor: 'rgba(0,0,0,0.1)', borderWidth: 1 };
    var LEGEND_DUOI = { display: true, position: 'bottom', labels: { fontSize: 13, padding: 20, usePointStyle: true, boxWidth: 6 } };

    // Chú giải dưới tiêu đề thẻ (gốc: .chart-legend) + vùng vẽ biểu đồ cao cố định
    function khung(host, chuGiai, cao) {
        host.innerHTML = '<div class="ums-u-mb-2">' + chuGiai.join(' ') + '</div><div data-z="bd" style="height:' + cao + 'px"></div>';
        return host.querySelector('[data-z="bd"]');
    }

    D.man(root, {
        tieuDe: 'Dashboard BGH (Lãnh đạo trường)', moTa: '📊 Tổng quan các chỉ số quan trọng của toàn trường - Dữ liệu cập nhật theo thời gian thực',
        icon: 'fa-solid fa-chart-line', nguon: 'Hệ thống quản lý sinh viên',
        loc: [
            { key: 'year', label: 'Năm học', items: [{ value: '', text: 'Chọn năm học...' }, { value: '2024-2025', text: '2024-2025' }, { value: '2023-2024', text: '2023-2024' }, { value: '2022-2023', text: '2022-2023' }] },
            { key: 'level', label: 'Bậc đào tạo', items: [{ value: '', text: 'Tất cả' }, { value: 'daihoc', text: 'Đại học' }, { value: 'caodang', text: 'Cao đẳng' }] }],
        macDinh: { year: '', level: '' },
        tinh: function () {
            return {
                kpis: KPI.map(function (s) {
                    return { iconClass: 'fa-solid ' + s.icon, label: s.label, value: s.value, change: s.trendValue, trendDirection: s.trend === 'up' ? 'up' : 'down',
                        color: s.color, subtext: s.subtext, tooltip: s.category };
                }),
                quick: quickStats(), tong: tongSV(), ruiRo: RUIRO.slice(0, 5)
            };
        },
        the: [
            { key: 'gpa', rong: 2, bang: true, tieuDe: 'GPA TB / Tỷ lệ đỗ theo Khoa', icon: 'fa-chart-column',
                moTa: 'Biểu đồ GPA trung bình và tỷ lệ đỗ ĐXT học phần. Di chuyển chuột để xem phân tích chất lượng đào tạo.',
                ve: function (host, kq, api) {
                    var bd = khung(host, [api.badge('Tốt: GPA >2.5 & Tỷ lệ đỗ >90%', 'good'), api.badge('Chưa cao: GPA ≤2.5 & Tỷ lệ đỗ >90%', 'warn'),
                        api.badge('Phân hóa: GPA >2.5 & Tỷ lệ đỗ ≤90%', 'bad')], 420);
                    api.bieuDo(bd, 'bar', gpaData(), {
                        layout: { padding: { top: 30, bottom: 20, left: 15, right: 15 } },
                        scales: {
                            yAxes: [
                                { id: 'y-axis-gpa', type: 'linear', position: 'left', ticks: { beginAtZero: true, max: 4, stepSize: 1, fontSize: 12, fontColor: '#374151' },
                                    scaleLabel: { display: true, labelString: 'GPA (thang 4)' }, gridLines: { color: 'rgba(229, 231, 235, 1)', drawBorder: false } },
                                { id: 'y-axis-pass', type: 'linear', position: 'right', ticks: { beginAtZero: true, max: 100, stepSize: 25, fontSize: 12, fontColor: '#374151',
                                    callback: function (value) { return value + '%'; } },
                                    scaleLabel: { display: true, labelString: 'Tỷ lệ đỗ (%)' }, gridLines: { drawOnChartArea: false, drawBorder: false } }],
                            xAxes: [{ ticks: { fontSize: 12, fontColor: '#374151' }, gridLines: { display: false, drawBorder: false } }] },
                        legend: { display: true, position: 'top', labels: { fontSize: 13, padding: 20, fontColor: '#374151', usePointStyle: true, boxWidth: 12 } },
                        tooltips: { mode: 'index', intersect: false, backgroundColor: 'rgba(0, 0, 0, 0.8)', cornerRadius: 8, callbacks: {
                            label: function (tooltipItem, data) {
                                var datasetLabel = data.datasets[tooltipItem.datasetIndex].label, value = tooltipItem.yLabel;
                                return datasetLabel.indexOf('%') >= 0 ? datasetLabel + ': ' + value + '%' : datasetLabel + ': ' + value;
                            } } },
                        plugins: { datalabels: { display: true, color: function (context) { return context.datasetIndex === 0 ? '#1e40af' : '#d97706'; },
                            font: { weight: 'bold', size: 12 }, formatter: function (value, context) { return context.datasetIndex === 1 ? value + '%' : value; },
                            anchor: 'end', align: 'top' } }
                    });
                } },
            { key: 'dongsv', rong: 2, bang: true, tieuDe: 'Theo dõi dòng sinh viên', icon: 'fa-users-line',
                moTa: 'Quy mô toàn trường theo năm. Di chuyển chuột để xem phân tích kịch bản phát triển.',
                ve: function (host, kq, api) {
                    var bd = khung(host, [api.badge('Kịch bản 1: Phát triển ổn định', 'good'), api.badge('Kịch bản 2: Cảnh báo tuyển sinh', 'warn'),
                        api.badge('Kịch bản 3: Phát triển nhanh', 'info')], 420);
                    api.bieuDo(bd, 'line', flowData(), {
                        layout: { padding: { top: 30, bottom: 20, left: 20, right: 20 } },
                        scales: {
                            yAxes: [{ ticks: { beginAtZero: true, fontSize: 12, callback: function (value) { return value.toLocaleString('en-US'); } },
                                gridLines: { color: 'rgba(0,0,0,0.05)', drawBorder: false } }],
                            xAxes: [{ ticks: { fontSize: 12 }, gridLines: { display: false, drawBorder: false } }] },
                        legend: LEGEND_DUOI,
                        tooltips: Object.assign({}, TIP_TRANG, { callbacks: {
                            label: function (tooltipItem, data) { return (data.datasets[tooltipItem.datasetIndex].label || '') + ': ' + tooltipItem.yLabel.toLocaleString('en-US'); } } })
                    });
                } },
            { key: 'hocphi', rong: 2, bang: true, tieuDe: 'Xu hướng thu học phí toàn trường', icon: 'fa-coins',
                moTa: 'Biểu đồ kết hợp cột và đường theo tháng. Trục trái: số tiền (tỷ VNĐ), Trục phải: tỷ lệ thu (%).',
                ve: function (host, kq, api) {
                    var bd = khung(host, [api.badge('Công thức: Tỷ lệ thu (%) = Tổng học phí đã thu / Tổng học phí phải thu × 100', 'mute')], 420);
                    api.bieuDo(bd, 'bar', tuitionData(), {
                        layout: { padding: { top: 30, bottom: 20, left: 50, right: 60 } },
                        scales: {
                            yAxes: [
                                { id: 'y-axis-1', type: 'linear', position: 'left', ticks: { beginAtZero: true, fontSize: 14, fontColor: '#1e293b', callback: function (value) { return value; } },
                                    gridLines: { color: 'rgba(0,0,0,0.08)', drawBorder: false } },
                                { id: 'y-axis-2', type: 'linear', position: 'right', ticks: { beginAtZero: false, min: 86, max: 98, fontSize: 14, fontColor: '#1e293b',
                                    callback: function (value) { return value + '%'; } }, gridLines: { drawOnChartArea: false, drawBorder: false } }],
                            xAxes: [{ ticks: { fontSize: 13, fontColor: '#1e293b' }, gridLines: { display: false, drawBorder: false } }] },
                        legend: LEGEND_DUOI,
                        tooltips: Object.assign({}, TIP_TRANG, { callbacks: {
                            label: function (tooltipItem, data) {
                                var datasetLabel = data.datasets[tooltipItem.datasetIndex].label, value = tooltipItem.yLabel;
                                return datasetLabel.indexOf('%') >= 0 ? datasetLabel + ': ' + value + '%' : datasetLabel + ': ' + value + ' tỷ';
                            } } })
                    });
                } },
            { key: 'nhanh', bang: true, tieuDe: 'Thống kê nhanh', icon: 'fa-gauge-high',
                ve: function (host, kq) {
                    host.innerHTML = kq.quick.map(function (it) {
                        return '<div class="ums-kv"><span><i class="fa-solid ' + esc(it.icon) + '"></i> ' + esc(it.label) + '</span><b>' + esc(String(it.value)) + '</b></div>';
                    }).join('');
                } },
            { key: 'noibat', bang: true, tieuDe: 'Tổng sinh viên toàn trường', icon: 'fa-users',
                ve: function (host, kq) {
                    host.innerHTML = '<div class="ums-stat"><div class="ums-stat__icon"><i class="fa-solid fa-users"></i></div><div class="ums-stat__main">' +
                        '<div class="ums-stat__value">' + esc(kq.tong.toLocaleString('en-US')) + '</div><div class="ums-stat__label">Tổng sinh viên toàn trường</div></div></div>';
                } },
            { key: 'ruiro', rong: 2, bang: true, tieuDe: 'TOP Rủi ro theo khoa', icon: 'fa-triangle-exclamation',
                ve: function (host, kq, api) {
                    api.bang(host, [
                        { title: 'Khoa', render: function (r) { return '<i class="fa-solid ' + esc(r.icon) + '"></i> <b>' + esc(r.name) + '</b>'; } },
                        { title: 'Điểm rủi ro', cls: 'is-right', width: '120px', render: function (r) { return '<b>' + r.riskScore.toFixed(1) + '</b>'; } },
                        { title: 'Mức rủi ro', cls: 'is-center', width: '140px', render: function (r) { return api.badge(r.level, TONE[r.color]); } },
                        { title: 'Nguyên nhân chính', prop: 'mainCause' }], kq.ruiRo, {
                        rowCls: function (r) { return r.color === 'high' ? 'dbv-dong--bad' : r.color === 'medium' ? 'dbv-dong--warn' : ''; } });
                } }]
    });
})();
