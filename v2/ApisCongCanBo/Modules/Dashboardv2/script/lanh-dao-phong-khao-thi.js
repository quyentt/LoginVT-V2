/* =========================================================================
   Dashboard Lãnh đạo Phòng Khảo thí — TRANG MẪU (cổng cán bộ). Khung chung ums.dbv2 (_dbv2.js).
   Bản gốc: ApisCongCanBo/Modules/Dashboardv2/html/lanh-dao-phong-khao-thi.html + script/lanh-dao-phong-khao-thi.js.
   Số liệu MẪU viết CỨNG trong gốc (kpiData, examPreparationData, gradingProgressData, failRateAvgScoreData,
   riskListData, renderQuickStats) — chép NGUYÊN; gốc KHÔNG có lời gọi API.
   Bộ lọc: gốc chỉ ghi console ("Simulate API call"), số liệu KHÔNG đổi theo bộ lọc → bản mới giữ đúng như vậy.
   Đã bỏ:
     · initExamStatsChart / initGradeDistributionChart (examStatsData, gradeDistributionData): html gốc KHÔNG có
       canvas examStatsChart / gradeDistributionChart và init() không gọi → mã chết, không vẽ.
     · Dải chú thích màu trong đầu mỗi thẻ (Kế hoạch / Thực tế / Realtime…): trùng chú giải biểu đồ → gộp vào dòng mô tả.
     · Tooltip gốc có emoji (📝 ⚠️ ✅ 📊) — giữ nguyên chữ.
   Thẻ "Thống kê thi cử" (cột phải của gốc) → thẻ bảng cuối lưới.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('dbv2-lanh-dao-phong-khao-thi');
    if (!root) return;
    var D = ums.dbv2, esc = ums.ui.esc;

    /* ---------- Số liệu gốc (chép nguyên) ---------- */
    var KPI = [
        { icon: 'fa-file-lines', label: 'Tỷ lệ đề thi chuẩn bị đúng hạn', category: 'Chuẩn bị đề thi', value: '95.8%', trend: 'up', trendValue: '+3.2%',
            subtext: 'so với cùng kỳ năm trước', color: 'green', tooltip: 'Dữ liệu cập nhật đến ngày 03/04/2026', updateType: 'Hàng ngày (Daily)' },
        { icon: 'fa-calendar-check', label: 'Tỷ lệ tổ chức thi đúng kế hoạch', category: 'Ổn định tổ chức', value: '98.5%', trend: 'up', trendValue: '+1.8%',
            subtext: 'so với cùng kỳ năm trước', color: 'blue', tooltip: 'Chỉ số ổn định tổ chức kỳ thi', updateType: 'Hàng ngày (Daily)' },
        { icon: 'fa-circle-check', label: 'Tỷ lệ hoàn thành chấm thi đúng hạn', category: 'Tiến độ chấm điểm', value: '92.3%', trend: 'up', trendValue: '+4.5%',
            subtext: 'so với cùng kỳ năm trước', color: 'purple', tooltip: 'Tiến độ chấm thi và nhập điểm', updateType: 'Realtime/Daily' },
        { icon: 'fa-triangle-exclamation', label: 'Số sự cố/vi phạm trên 1000 SV', category: 'An toàn & kỷ luật', value: '2.8', trend: 'down', trendValue: '-1.2',
            subtext: 'giảm so với cùng kỳ năm trước', color: 'orange', tooltip: 'Chỉ số an toàn & kỷ luật kỳ thi', updateType: 'Daily Snapshot', isWarning: true }
    ];
    function kpis() {
        return KPI.map(function (k) {
            // gốc: KPI cảnh báo (vi phạm) đảo màu — giảm là tốt
            var tot = k.isWarning ? k.trend === 'down' : k.trend === 'up';
            return { iconClass: 'fa-solid ' + k.icon, label: k.label, value: k.value, change: k.trendValue, trendDirection: k.trend === 'up' ? 'up' : 'down',
                trendClass: tot ? 'good' : 'bad', color: k.color, subtext: k.subtext, tooltip: k.tooltip, timing: k.updateType, details: ['Nhóm: ' + k.category] };
        });
    }
    var DIEM = { pointBorderColor: '#fff', pointBorderWidth: 2 };
    function deThi() {
        return {
            labels: ['T-10', 'T-9', 'T-8', 'T-7', 'T-6', 'T-5', 'T-4', 'T-3', 'T-2', 'T-1'],
            datasets: [
                Object.assign({ label: 'Kế hoạch phê duyệt', data: [20, 30, 40, 50, 60, 70, 80, 90, 95, 100], borderColor: 'rgba(59, 130, 246, 1)', backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3, tension: 0.4, fill: false, pointRadius: 6, pointBackgroundColor: 'rgba(59, 130, 246, 1)' }, DIEM),
                Object.assign({ label: 'Thực tế phê duyệt', data: [10, 18, 35, 45, 55, 62, 72, 85, 92, 98], borderColor: 'rgba(245, 158, 11, 1)', backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderWidth: 3, tension: 0.4, fill: false, pointRadius: 6, pointBackgroundColor: 'rgba(245, 158, 11, 1)', borderDash: [5, 5] }, DIEM)],
            submittedCount: [15, 28, 54, 70, 86, 97, 112, 133, 144, 153], totalCount: 156,
            pendingDepartments: [['Khoa CNTT', 'Khoa Kinh tế', 'Khoa Y tế'], ['Khoa CNTT', 'Khoa Kinh tế'], ['Khoa CNTT', 'Khoa Y tế'], ['Khoa CNTT'], ['Khoa Kinh tế'], ['Khoa Y tế'], [], [], [], []]
        };
    }
    function chamThi() {
        return {
            labels: ['Ngày 1', 'Ngày 3', 'Ngày 5', 'Ngày 7', 'Ngày 10', 'Ngày 12', 'Ngày 14'],
            datasets: [
                Object.assign({ label: 'Đã chấm xong', data: [10, 35, 55, 70, 82, 91, 97], borderColor: 'rgba(59, 130, 246, 1)', backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3, tension: 0.4, fill: true, pointRadius: 6, pointBackgroundColor: 'rgba(59, 130, 246, 1)' }, DIEM),
                Object.assign({ label: 'Đã nhập điểm xong', data: [5, 20, 40, 60, 75, 87, 95], borderColor: 'rgba(249, 115, 22, 1)', backgroundColor: 'rgba(249, 115, 22, 0.1)',
                    borderWidth: 3, tension: 0.4, fill: true, pointRadius: 6, pointBackgroundColor: 'rgba(249, 115, 22, 1)', borderDash: [5, 5] }, DIEM)],
            gradedCount: [156, 546, 858, 1092, 1279, 1420, 1513], enteredCount: [78, 312, 624, 936, 1170, 1357, 1482], totalCount: 1560,
            pendingCourses: [['Toán cao cấp 1', 'Vật lý đại cương', 'Hóa học đại cương'], ['Toán cao cấp 1', 'Vật lý đại cương'], ['Toán cao cấp 1'], ['Lập trình C++'], [], [], []]
        };
    }
    function truotDiem() {
        return {
            labels: ['CNTT', 'Cơ khí', 'Kinh tế', 'Ngoại ngữ', 'Y Dược'],
            datasets: [
                { label: 'Tỷ lệ trượt (%)', data: [35, 18, 10, 8, 25], backgroundColor: 'rgba(59, 130, 246, 0.8)', borderColor: 'rgba(59, 130, 246, 1)', borderWidth: 2, yAxisID: 'y-left', type: 'bar', order: 1 },
                Object.assign({ label: 'Điểm trung bình (thang 10)', data: [6.3, 7.2, 7.8, 8.0, 6.9], borderColor: 'rgba(16, 185, 129, 1)', backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3, tension: 0.4, fill: false, yAxisID: 'y-right', type: 'line', pointRadius: 7, pointBackgroundColor: 'rgba(16, 185, 129, 1)' }, DIEM)],
            failedStudents: [420, 216, 120, 96, 300], totalStudents: [1200, 1200, 1200, 1200, 1200], passedStudents: [780, 984, 1080, 1104, 900]
        };
    }
    var RUI_RO = [
        { department: 'Khoa Công nghệ thông tin', riskScore: 85, riskLevel: 'high', reasons: ['Nộp đề trễ (18%)', 'Chấm, nhập điểm trễ hạn (20%)'], trend: 'up', trendValue: 12 },
        { department: 'Khoa Trí tuệ nhân tạo', riskScore: 78, riskLevel: 'medium', reasons: ['Nộp đề trễ (15%)', 'Nhiều sự cố tổ chức thi (1.8/1000 SV)'], trend: 'up', trendValue: 8 },
        { department: 'Khoa Kinh tế', riskScore: 72, riskLevel: 'medium', reasons: ['Điều chỉnh lịch thi nhiều (8%)', 'Điểm phúc khảo cao (4%)'], trend: 'up', trendValue: 6 },
        { department: 'Khoa Kỹ thuật', riskScore: 55, riskLevel: 'medium', reasons: ['Có một số ca phải điều chỉnh (4%)', 'Tuân thủ chấm điểm tốt'], trend: 'stable', trendValue: 3 },
        { department: 'Khoa An toàn thông tin', riskScore: 42, riskLevel: 'low', reasons: ['Lịch thi ổn định', 'Tuân thủ rất tốt'], trend: 'down', trendValue: -2 }
    ];
    var THONG_KE = [
        { nhan: 'Phòng thi', gt: '85' }, { nhan: 'Giám thị', gt: '170' },
        { nhan: 'Điểm TB toàn trường', gt: '6.8' }, { nhan: 'Tỷ lệ vi phạm', gt: '0.14%', tone: 'bad' }];

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
    var LEGEND = { display: true, position: 'top', labels: { fontSize: 12, padding: 15, usePointStyle: true } };
    function trucX(nhan) { return [{ gridLines: { display: true, color: 'rgba(0, 0, 0, 0.05)' }, scaleLabel: { display: true, labelString: nhan }, ticks: { fontSize: 12, fontColor: '#475569' } }]; }
    function trucPct(nhan) {
        return [{ ticks: { beginAtZero: true, max: 100, stepSize: 20, callback: function (v) { return v + '%'; }, fontSize: 11, fontColor: '#64748b' },
            gridLines: { color: 'rgba(0, 0, 0, 0.05)', drawBorder: false }, scaleLabel: { display: true, labelString: nhan } }];
    }
    function nhanPct(it, data) { var l = data.datasets[it.datasetIndex].label || ''; return (l ? l + ': ' : '') + Number(it.yLabel).toFixed(1) + '%'; }

    D.man(root, {
        tieuDe: 'Dashboard Lãnh đạo Phòng Khảo thí', moTa: '📝 Quản lý thi cử và đánh giá kết quả học tập', icon: 'fa-solid fa-clipboard-check', nguon: 'Dữ liệu mẫu',
        loc: [
            { key: 'year', label: 'Năm học', items: [{ value: '2024-2025', text: '2024-2025' }, { value: '2023-2024', text: '2023-2024' }, { value: '2022-2023', text: '2022-2023' }, { value: '2021-2022', text: '2021-2022' }] },
            { key: 'semester', label: 'Học kỳ / Đợt thi', items: [{ value: '', text: 'Tất cả học kỳ' }, { value: 'hk1', text: 'Học kỳ 1' }, { value: 'hk2', text: 'Học kỳ 2' },
                { value: 'hk3', text: 'Học kỳ 3 (Hè)' }, { value: 'dot1', text: 'Đợt thi 1' }, { value: 'dot2', text: 'Đợt thi 2' }] },
            { key: 'level', label: 'Bậc đào tạo', items: [{ value: '', text: 'Tất cả bậc' }, { value: 'daihoc', text: 'Đại học' }, { value: 'thacsi', text: 'Thạc sĩ' },
                { value: 'tiensi', text: 'Tiến sĩ' }, { value: 'lienthong', text: 'Liên thông' }] },
            { key: 'unit', label: 'Đơn vị', items: [{ value: '', text: 'Toàn trường' }, { value: 'cntt', text: 'Khoa CNTT' }, { value: 'ktoan', text: 'Khoa Kinh tế' },
                { value: 'ngoaingu', text: 'Khoa Ngoại ngữ' }, { value: 'kythuat', text: 'Khoa Kỹ thuật' }, { value: 'yte', text: 'Khoa Y tế' }] }],
        macDinh: { year: '2024-2025', semester: '', level: '', unit: '' },
        tinh: function () {
            // gốc: bộ lọc không làm đổi số liệu (applyFilters chỉ ghi console)
            return { kpis: kpis(), deThi: deThi(), chamThi: chamThi(), truot: truotDiem(), ruiRo: RUI_RO, thongKe: THONG_KE };
        },
        the: [
            { key: 'dethi', rong: 2, cao: 360, tieuDe: 'Tiến độ hoàn thành đề thi trước kỳ thi', icon: 'fa-chart-line',
                moTa: 'Theo dõi tiến độ chuẩn bị và phê duyệt đề thi · Kế hoạch / Thực tế · Realtime/Daily',
                ve: function (host, kq, api) {
                    var d = kq.deThi;
                    api.bieuDo(host, 'line', d, { legend: LEGEND, scales: { xAxes: trucX('Số ngày trước ngày thi'), yAxes: trucPct('% học phần có đề thi đã phê duyệt') },
                        tooltips: Object.assign({}, TOOLTIP, { callbacks: {
                            title: function (items) { return 'Ngày ' + items[0].label; },
                            label: nhanPct,
                            afterBody: function (items) {
                                var i = items[0].index, dept = d.pendingDepartments[i], kq2 = ['', '📝 Số học phần đã nộp đề: ' + d.submittedCount[i] + '/' + d.totalCount];
                                if (dept && dept.length) { kq2.push('', '⚠️ Khoa chưa nộp đề:'); dept.forEach(function (x) { kq2.push('  • ' + x); }); }
                                else kq2.push('', '✅ Tất cả khoa đã nộp đề');
                                return kq2;
                            } } }) });
                } },
            { key: 'chamthi', rong: 2, cao: 360, tieuDe: 'Tiến độ chấm thi và nhập điểm sau kỳ thi', icon: 'fa-list-check',
                moTa: 'Theo dõi tiến độ chấm bài và nhập điểm của các học phần · Đã chấm xong / Đã nhập điểm · Realtime',
                ve: function (host, kq, api) {
                    var d = kq.chamThi;
                    api.bieuDo(host, 'line', d, { legend: LEGEND, scales: { xAxes: trucX('Số ngày sau ngày thi'), yAxes: trucPct('% hoàn thành') },
                        tooltips: Object.assign({}, TOOLTIP, { callbacks: {
                            title: function (items) { return items[0].label + ' sau kỳ thi'; },
                            label: nhanPct,
                            afterBody: function (items) {
                                var i = items[0].index, hp = d.pendingCourses[i];
                                var kq2 = ['', '📝 Túi bài đã chấm: ' + d.gradedCount[i] + '/' + d.totalCount, '💾 Túi bài đã nhập điểm: ' + d.enteredCount[i] + '/' + d.totalCount];
                                if (hp && hp.length) { kq2.push('', '⚠️ Học phần đã chấm chưa nhập điểm:'); hp.forEach(function (x) { kq2.push('  • ' + x); }); }
                                else kq2.push('', '✅ Tất cả đã nhập điểm');
                                return kq2;
                            } } }) });
                } },
            { key: 'truot', rong: 2, cao: 360, tieuDe: 'Tỷ lệ trượt & Điểm trung bình theo khoa', icon: 'fa-chart-column',
                moTa: 'Phân tích kết quả học tập theo từng khoa · Tỷ lệ trượt (%) / Điểm TB (thang 10)',
                ve: function (host, kq, api) {
                    var d = kq.truot;
                    api.bieuDo(host, 'bar', d, { legend: LEGEND,
                        scales: { xAxes: trucX('Khoa'), yAxes: [
                            { id: 'y-left', position: 'left', ticks: { beginAtZero: true, max: 50, stepSize: 10, callback: function (v) { return v + '%'; }, fontSize: 11, fontColor: '#64748b' },
                                gridLines: { color: 'rgba(0, 0, 0, 0.05)', drawBorder: false }, scaleLabel: { display: true, labelString: 'Tỷ lệ trượt (%)' } },
                            { id: 'y-right', position: 'right', ticks: { beginAtZero: false, min: 5.0, max: 9.0, stepSize: 0.5, callback: function (v) { return Number(v).toFixed(1); }, fontSize: 11, fontColor: '#64748b' },
                                gridLines: { drawOnChartArea: false, drawBorder: false }, scaleLabel: { display: true, labelString: 'Điểm trung bình (thang 10)' } }] },
                        tooltips: Object.assign({}, TOOLTIP, { callbacks: {
                            title: function (items) { return 'Khoa ' + items[0].label; },
                            label: function (it, data) { var l = data.datasets[it.datasetIndex].label || '', v = Number(it.yLabel); return l + ': ' + (it.datasetIndex === 0 ? v.toFixed(1) + '%' : v.toFixed(2)); },
                            afterBody: function (items) {
                                var i = items[0].index, f = d.failedStudents[i], t = d.totalStudents[i];
                                return ['', '📊 Thống kê chi tiết:', '  • Tổng số SV: ' + t + ' sinh viên', '  • SV đạt: ' + d.passedStudents[i] + ' sinh viên',
                                    '  • SV không đạt: ' + f + ' sinh viên', '  • Tỷ lệ trượt: ' + (f / t * 100).toFixed(1) + '%'];
                            } } }) });
                } },
            { key: 'ruiro', rong: 2, bang: true, tieuDe: 'Danh sách rủi ro thi cử theo khoa', icon: 'fa-triangle-exclamation',
                moTa: 'Các khoa có rủi ro cao về tổ chức thi và chấm điểm · Cao: ≥ 80 · TB: 50-80 · Thấp: < 50',
                ve: function (host, kq, api) {
                    api.bang(host, [
                        { title: 'Khoa quản lý học phần', width: '30%', render: function (r) { return '<b>' + esc(r.department) + '</b>'; } },
                        { title: 'Mức rủi ro', width: '20%', render: function (r) { var m = MUC[r.riskLevel] || MUC.low; return api.badge(m[0] + ' (' + r.riskScore + ')', m[1]); } },
                        { title: 'Nguyên nhân chính', width: '35%', render: function (r) { return r.reasons.map(function (x) { return '• ' + esc(x); }).join('<br>'); } },
                        { title: 'Xu hướng', width: '15%', render: function (r) { return xuHuong(r.trend, r.trendValue); } }], kq.ruiRo, {
                        rowCls: function (r) { return r.riskLevel === 'high' ? 'dbv-dong--bad' : ''; } });
                } },
            { key: 'thongke', bang: true, tieuDe: 'Thống kê thi cử', icon: 'fa-gauge-high',
                ve: function (host, kq, api) {
                    api.bang(host, [
                        { title: 'Chỉ số', render: function (r) { return esc(r.nhan); } },
                        { title: 'Giá trị', cls: 'is-right', render: function (r) { return r.tone ? api.badge(r.gt, r.tone) : '<b>' + esc(r.gt) + '</b>'; } }], kq.thongKe);
                } }]
    });
})();
