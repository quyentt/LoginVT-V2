/* =========================================================================
   Dashboard Lãnh đạo khoa — TRANG MẪU (cổng cán bộ). Khung chung ums.dbv2 (_dbv2.js).
   Bản gốc: ApisCongCanBo/Modules/Dashboardv2/html/lanh-dao-khoa.html + script/lanh-dao-khoa.js (v2.0.0).
   Số liệu MẪU viết CỨNG trong mã (kpiData, majorData, gpaPassRateData, studentFlowData, tuitionData, riskData,
   quickStats) — gốc KHÔNG có lời gọi API ("Simulate API call"). Chép NGUYÊN các con số và cấu hình biểu đồ
   (dạng Chart.js 2, khung tự đổi sang v4).
   Bộ lọc Năm học / Ngành: gốc chỉ ghi console ("TODO: Reload data based on filter") — số liệu KHÔNG đổi theo lọc.
   Giữ nguyên hành vi đó (Áp dụng / Đặt lại chỉ vẽ lại).
   Khác gốc (chỉ cách vẽ):
     · Gốc có cột phải (Bộ lọc & Tùy chọn + Thống kê nhanh) → khung chung đặt Bộ lọc ở trên; "Thống kê nhanh"
       vẽ dưới hàng ô lọc. Bốn thẻ biểu đồ / danh sách xếp một cột như gốc.
     · Chú giải đầu mỗi thẻ (Tốt / Chưa cao / Phân hóa, 4 kịch bản quy mô, mức rủi ro, mức thu) → nhãn ums.
     · Danh sách rủi ro (gốc: thẻ từng ngành, nhiều style nội tuyến) → bảng ums.ui.table cùng các trường:
       ngành, Risk Score, xu hướng, nguyên nhân chính, GPA / Trượt / Thôi học, mức rủi ro.
     · Gốc in xu hướng bằng `(trendValue > 0 ? '+' : '') + trendValue` với trendValue là CHUỖI đã có dấu
       ("+12") → hiện "++12"; bản mới in đúng "+12".
   Bỏ: renderMajorList + thẻ "Danh sách ngành" (gốc display:none, không có hàm vẽ — mã chết); khung chờ tải giả
   (setTimeout 1 giây) và dòng "Trạng thái".
   Giữ như gốc: studentFlowData có 5 nhãn năm nhưng "SV đang học" 7 giá trị, "SV tốt nghiệp" 6 giá trị — Chart.js
   chỉ vẽ 5 điểm đầu.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('dbv2-lanh-dao-khoa');
    if (!root) return;
    var D = ums.dbv2, esc = ums.ui.esc;

    var KPI = [
        { icon: 'fa-users', label: 'Tổng số sinh viên đang học', value: '2,450', trend: 'up', trendValue: '+125 SV (+5.4%)', subtext: 'so với cùng kỳ năm trước',
            color: 'green', tooltip: 'Dữ liệu cập nhật đến ngày 03/04/2026' },
        { icon: 'fa-user-plus', label: 'Sinh viên nhập học mới', value: '680', trend: 'up', trendValue: '+8.2%', subtext: '85% đạt chỉ tiêu (800 SV)',
            color: 'blue', tooltip: 'Dữ liệu cập nhật đến đợt tuyển sinh Đợt 2 - 2025' },
        { icon: 'fa-graduation-cap', label: 'Tỷ lệ tốt nghiệp đúng hạn', value: '78.5%', trend: 'up', trendValue: '+3.2%', subtext: '550/700 SV dự kiến TN',
            color: 'purple', tooltip: 'Chỉ số vàng của Khoa - Dữ liệu cập nhật theo năm học' },
        { icon: 'fa-triangle-exclamation', label: 'Tỷ lệ SV bị cảnh báo học vụ', value: '8.2%', trend: 'down', trendValue: '-1.5%', subtext: '201/2,450 SV bị cảnh báo',
            color: 'orange', tooltip: 'Dữ liệu cập nhật theo học kỳ - HK1 2024-2025', isWarning: true }
    ];
    var MAJOR = [
        { name: 'Công nghệ thông tin', students: 850, gpa: 3.5, passRate: 95, quality: 'Chất lượng tốt' },
        { name: 'Công nghệ thông tin Việt Nhật', students: 420, gpa: 3.2, passRate: 90, quality: 'Chất lượng tốt' },
        { name: 'An toàn thông tin', students: 380, gpa: 3.1, passRate: 93, quality: 'Chất lượng tốt' },
        { name: 'Tài năng Khoa học máy tính', students: 350, gpa: 2.9, passRate: 85, quality: 'Phân hóa mạnh' },
        { name: 'Trí tuệ nhân tạo', students: 280, gpa: 2.8, passRate: 80, quality: 'Chất lượng chưa cao' }
    ];
    var RISK = [
        { name: 'Công nghệ thông tin', riskScore: 85.2, level: 'Cao', color: 'high', mainCause: 'GPA TB ↓, Trượt ↑', trend: 'up-high', trendValue: '+12', trendText: '↑↑',
            icon: 'fa-computer', details: { gpa: 2.3, failRate: 25, lateGrade: 8, warning: 18, dropout: 6 } },
        { name: 'Trí tuệ nhân tạo', riskScore: 76.8, level: 'Trung bình', color: 'medium', mainCause: 'SV thôi học cao', trend: 'up', trendValue: '+8', trendText: '↑',
            icon: 'fa-brain', details: { gpa: 2.6, failRate: 15, lateGrade: 5, warning: 12, dropout: 8 } },
        { name: 'An toàn thông tin', riskScore: 68.4, level: 'Trung bình', color: 'medium', mainCause: 'Nhập điểm trễ', trend: 'down', trendValue: '-3', trendText: '↓',
            icon: 'fa-shield-halved', details: { gpa: 2.8, failRate: 12, lateGrade: 18, warning: 10, dropout: 4 } },
        { name: 'Khoa học máy tính', riskScore: 58.7, level: 'Trung bình', color: 'medium', mainCause: 'Vi phạm tiến độ đào tạo', trend: 'stable', trendValue: '+2', trendText: '→',
            icon: 'fa-laptop-code', details: { gpa: 2.9, failRate: 10, lateGrade: 6, warning: 8, dropout: 3 } },
        { name: 'Hệ thống thông tin', riskScore: 45.3, level: 'Thấp', color: 'low', mainCause: 'Ổn định chung', trend: 'down', trendValue: '-5', trendText: '↓',
            icon: 'fa-network-wired', details: { gpa: 3.1, failRate: 8, lateGrade: 3, warning: 6, dropout: 2 } }
    ];
    var NHANH = [{ label: 'Tổng số ngành', value: '8' }, { label: 'Tỷ lệ có việc làm', value: '92%' }, { label: 'Số lượng GV TS', value: '18/45' },
        { label: 'Điểm đánh giá khoa', value: '4.2/5' }];

    function diem(c, o) { return Object.assign({ borderWidth: 3, tension: 0.4, fill: false, pointRadius: 5, pointBackgroundColor: 'rgba(' + c + ', 1)',
        pointBorderColor: '#fff', pointBorderWidth: 2, borderColor: 'rgba(' + c + ', 1)', backgroundColor: 'rgba(' + c + ', 0.1)' }, o); }
    function gpaData() {
        return { labels: MAJOR.map(function (m) { return m.name; }), datasets: [
            { label: 'GPA TB tháng 4', type: 'bar', data: MAJOR.map(function (m) { return m.gpa; }), backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgba(59, 130, 246, 1)', borderWidth: 2, yAxisID: 'y-axis-1', order: 1 },
            diem('245, 158, 11', { label: 'Tỷ lệ đỗ', type: 'line', data: MAJOR.map(function (m) { return m.passRate; }), yAxisID: 'y-axis-2' })] };
    }
    function quyMoData() {
        return { labels: ['2021', '2022', '2023', '2024', '2025'], datasets: [
            diem('59, 130, 246', { label: 'SV nhập mới', data: [680, 750, 1200, 750, 900] }),
            diem('16, 185, 129', { label: 'SV đang học', data: [1200, 1400, 1500, 2000, 2300, 2500, 3400] }),
            diem('245, 158, 11', { label: 'SV tốt nghiệp', data: [50, 80, 120, 250, 300, 350] })] };
    }
    function hocPhiData() {
        return { labels: ['Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'], datasets: [
            { label: 'Đã thu (tỷ)', type: 'bar', data: [1, 0.8, 1.2, 1.1, 1], backgroundColor: 'rgba(59, 130, 246, 0.8)', borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2, yAxisID: 'y-axis-1', order: 1 },
            diem('16, 185, 129', { label: 'Mục tiêu (tỷ)', type: 'line', data: [0.9, 1, 1, 1, 1], yAxisID: 'y-axis-1', borderDash: [5, 5] }),
            diem('239, 68, 68', { label: 'Tỷ lệ thu %', type: 'line', data: [111, 80, 120, 110, 100], yAxisID: 'y-axis-2' })] };
    }

    function tip(cbs) {
        return { mode: 'index', intersect: false, backgroundColor: 'rgba(255, 255, 255, 0.95)', titleFontColor: '#1f2937', bodyFontColor: '#4b5563',
            borderColor: '#e5e7eb', borderWidth: 2, cornerRadius: 8, callbacks: cbs };
    }
    function chuGiai(pos) { return { display: true, position: pos, labels: { fontSize: 12, padding: 15, usePointStyle: true } }; }
    function nhan(ds) { return ds.label ? ds.label + ': ' : ''; }
    function tim(items, i) { for (var k = 0; k < items.length; k++) if (items[k].datasetIndex === i) return items[k]; return null; }

    /* Chú giải đầu thẻ (gốc: dải nhãn màu dưới tiêu đề) + vùng biểu đồ cao 360px (gốc .chart-canvas) */
    function khung(host, nhans) {
        host.innerHTML = '<div class="dbv-ldk-chu">' + nhans.map(function (n) { return D.badge(n[0], n[1]); }).join('') + '</div><div class="dbv-ldk-bd"></div>';
        return host.lastChild;
    }

    /* "Thống kê nhanh" — gốc ở cột phải, dưới Bộ lọc */
    function veNhanh() {
        var loc = root.querySelector('.ums-filter');
        if (!loc || root.querySelector('[data-z="ldk-nhanh"]')) return;
        var host = document.createElement('div');
        host.className = 'dbv-ldk-nhanh';
        host.setAttribute('data-z', 'ldk-nhanh');
        host.innerHTML = '<div class="dbv-ldk-nhanh__td"><i class="fa-solid fa-gauge-high"></i> Thống kê nhanh</div><div class="dbv-ldk-nhanh__luoi">' + NHANH.map(function (x) {
            return '<div class="dbv-ldk-nhanh__o"><span>' + esc(x.label) + ':</span><b>' + esc(x.value) + '</b></div>';
        }).join('') + '</div>';
        loc.parentNode.insertBefore(host, loc.nextSibling);
    }

    var TONE_MUC = { high: 'bad', medium: 'warn', low: 'good' };
    var TONE_XU = { 'up-high': 'bad', up: 'bad', down: 'good', stable: 'mute' };

    D.man(root, {
        tieuDe: 'Dashboard Lãnh đạo khoa', moTa: '📊 Quản lý và theo dõi hoạt động của khoa - Dữ liệu cập nhật theo thời gian thực', icon: 'fa-solid fa-chart-pie',
        nguon: 'Hệ thống quản lý sinh viên',
        loc: [
            { key: 'year', label: 'Năm học', items: [{ value: '', text: 'Chọn năm học...' }, { value: '2024-2025', text: '2024-2025' },
                { value: '2023-2024', text: '2023-2024' }, { value: '2022-2023', text: '2022-2023' }] },
            { key: 'major', label: 'Ngành', items: [{ value: '', text: 'Tất cả ngành' }, { value: 'cntt', text: 'Công nghệ thông tin' },
                { value: 'ketoan', text: 'Kế toán' }, { value: 'marketing', text: 'Marketing' }] }],
        macDinh: { year: '', major: '' },
        tinh: function () {
            veNhanh();
            return {
                kpis: KPI.map(function (s) {
                    // gốc: KPI cảnh báo đảo màu xu hướng (giảm = tốt)
                    var tot = s.isWarning ? s.trend === 'down' : s.trend === 'up';
                    return { iconClass: 'fa-solid ' + s.icon, label: s.label, value: s.value, change: s.trendValue, trendDirection: s.trend === 'up' ? 'up' : 'down',
                        trendClass: tot ? 'good' : 'bad', color: s.color, subtext: s.subtext, tooltip: s.tooltip };
                }),
                gpa: gpaData(), quyMo: quyMoData(), hocPhi: hocPhiData(), ruiRo: RISK
            };
        },
        the: [
            { key: 'gpa', rong: 2, bang: true, tieuDe: 'GPA / Tỷ lệ đỗ', icon: 'fa-chart-column',
                moTa: 'Biểu đồ kết hợp: Cột (GPA TB) và Đường (Tỷ lệ đỗ %) theo ngành/CTĐT thuộc Khoa',
                ve: function (host, kq, api) {
                    var bd = khung(host, [['Tốt: GPA >2.5 & Tỷ lệ đỗ >90%', 'good'], ['Chưa cao: GPA ≤2.5 & Tỷ lệ đỗ >90%', 'warn'], ['Phân hóa: GPA >2.5 & Tỷ lệ đỗ ≤90%', 'bad']]);
                    api.bieuDo(bd, 'bar', kq.gpa, { legend: chuGiai('top'),
                        tooltips: tip({
                            label: function (it, data) { return nhan(data.datasets[it.datasetIndex]) + (it.datasetIndex === 0 ? Number(it.yLabel).toFixed(2) : Number(it.yLabel).toFixed(1) + '%'); },
                            afterBody: function (items) { var m = MAJOR[items[0].index]; return ['', '📊 Đánh giá: ' + m.quality, '👥 Sinh viên: ' + m.students]; } }),
                        scales: {
                            xAxes: [{ gridLines: { display: false }, ticks: { fontSize: 11, callback: function (v) { v = String(v); return v.length > 20 ? v.substr(0, 20) + '...' : v; } } }],
                            yAxes: [
                                { id: 'y-axis-1', type: 'linear', position: 'left', ticks: { beginAtZero: true, max: 4, stepSize: 0.5, callback: function (v) { return Number(v).toFixed(1); } },
                                    scaleLabel: { display: true, labelString: 'GPA Trung bình' }, gridLines: { color: 'rgba(0, 0, 0, 0.05)' } },
                                { id: 'y-axis-2', type: 'linear', position: 'right', ticks: { beginAtZero: true, max: 100, stepSize: 10, callback: function (v) { return v + '%'; } },
                                    scaleLabel: { display: true, labelString: 'Tỷ lệ đỗ (%)' }, gridLines: { drawOnChartArea: false } }] } });
                } },
            { key: 'quymo', rong: 2, bang: true, tieuDe: 'Quy mô sinh viên toàn Khoa', icon: 'fa-chart-line',
                moTa: 'Theo dõi biến động quy mô sinh viên của Khoa theo các năm học (5-6 năm gần nhất)',
                ve: function (host, kq, api) {
                    var bd = khung(host, [['Kịch bản 1: Quy mô bền vững', 'good'], ['Kịch bản 2: Cảnh báo tuyển sinh', 'warn'], ['Kịch bản 3: Mở rộng nhanh', 'info'],
                        ['Kịch bản 4: Tắc nghẽn đầu ra', 'bad']]);
                    api.bieuDo(bd, 'line', kq.quyMo, { legend: chuGiai('bottom'),
                        tooltips: tip({
                            label: function (it, data) { return nhan(data.datasets[it.datasetIndex]) + Number(it.yLabel).toLocaleString('en-US') + ' SV'; },
                            afterBody: function (items) {
                                var nm = tim(items, 0), tn = tim(items, 2), a = '';
                                if (nm && tn) a = nm.yLabel >= tn.yLabel ? '✅ Kịch bản 1: Quy mô bền vững' : '⚠️ Kịch bản 2: Cảnh báo tuyển sinh';
                                return ['', '📊 Phân tích năm ' + items[0].label + ':', a];
                            } }),
                        scales: {
                            xAxes: [{ gridLines: { display: false }, scaleLabel: { display: true, labelString: 'Năm học' } }],
                            yAxes: [{ ticks: { beginAtZero: true, callback: function (v) { return Number(v).toLocaleString('en-US') + ' SV'; } },
                                scaleLabel: { display: true, labelString: 'Số lượng sinh viên' }, gridLines: { color: 'rgba(0, 0, 0, 0.05)' } }] } });
                } },
            { key: 'ruiro', rong: 2, bang: true, tieuDe: 'Danh sách rủi ro theo ngành/CTĐT', icon: 'fa-triangle-exclamation',
                moTa: 'Phát hiện ngành/CTĐT đang có rủi ro cao để lãnh đạo Khoa tập trung chỉ đạo',
                ve: function (host, kq, api) {
                    var bang = khung(host, [['Cao: ≥80 điểm', 'bad'], ['Trung bình: 50-79 điểm', 'warn'], ['Thấp: <50 điểm', 'good']]);
                    bang.className = '';
                    api.bang(bang, [
                        { title: 'Ngành/CTĐT', render: function (r) { return '<i class="fa-solid ' + esc(r.icon) + '"></i> <b>' + esc(r.name) + '</b>'; } },
                        { title: 'Risk Score', width: '110px', cls: 'is-center', render: function (r) { return '<b>' + esc(r.riskScore) + '</b>'; } },
                        { title: 'Xu hướng', width: '110px', cls: 'is-center', render: function (r) { return api.badge(r.trendText + ' ' + r.trendValue, TONE_XU[r.trend] || 'mute'); } },
                        { title: 'Nguyên nhân chính', render: function (r) { return esc(r.mainCause); } },
                        { title: 'GPA', width: '80px', cls: 'is-center', render: function (r) { return esc(r.details.gpa); } },
                        { title: 'Trượt', width: '80px', cls: 'is-center', render: function (r) { return esc(r.details.failRate) + '%'; } },
                        { title: 'Thôi học', width: '90px', cls: 'is-center', render: function (r) { return esc(r.details.dropout) + '%'; } },
                        { title: 'Mức rủi ro', width: '130px', cls: 'is-center', render: function (r) { return api.badge(r.level, TONE_MUC[r.color]); } }], kq.ruiRo, {
                        rowCls: function (r) { return r.color === 'high' ? 'dbv-dong--bad' : r.color === 'medium' ? 'dbv-dong--warn' : ''; } });
                } },
            { key: 'hocphi', rong: 2, bang: true, tieuDe: 'Xu hướng thu học phí theo khoa', icon: 'fa-coins',
                moTa: 'Biểu đồ kết hợp: Cột (Số tiền đã thu) và Đường (Tỷ lệ thu %) theo tháng',
                ve: function (host, kq, api) {
                    var bd = khung(host, [['Đạt mục tiêu: ≥100%', 'good'], ['Gần đạt: 80-99%', 'warn'], ['Chưa đạt: <80%', 'bad']]);
                    api.bieuDo(bd, 'bar', kq.hocPhi, { legend: chuGiai('bottom'),
                        tooltips: tip({
                            label: function (it, data) { return nhan(data.datasets[it.datasetIndex]) + (it.datasetIndex === 2 ? Number(it.yLabel).toFixed(0) + '%' : Number(it.yLabel).toFixed(1) + ' tỷ'); },
                            afterBody: function (items) {
                                var t = tim(items, 2), a = t && t.yLabel >= 100 ? '✅ Đạt mục tiêu thu' : t && t.yLabel >= 80 ? '⚠️ Gần đạt mục tiêu' : '❌ Chưa đạt mục tiêu';
                                return ['', '📊 ' + items[0].label + ':', a];
                            } }),
                        scales: {
                            xAxes: [{ gridLines: { display: false }, scaleLabel: { display: true, labelString: 'Tháng' } }],
                            yAxes: [
                                { id: 'y-axis-1', type: 'linear', position: 'left', ticks: { beginAtZero: true, callback: function (v) { return Number(v).toFixed(1) + ' tỷ'; } },
                                    scaleLabel: { display: true, labelString: 'Số tiền đã thu (tỷ VNĐ)' }, gridLines: { color: 'rgba(0, 0, 0, 0.05)' } },
                                { id: 'y-axis-2', type: 'linear', position: 'right', ticks: { beginAtZero: true, max: 140, stepSize: 20, callback: function (v) { return v + '%'; } },
                                    scaleLabel: { display: true, labelString: 'Tỷ lệ thu (%)' }, gridLines: { drawOnChartArea: false } }] } });
                } }]
    });
})();
