/* =========================================================================
   Dashboard Lãnh đạo Phòng CTSV — TRANG MẪU (cổng cán bộ). Khung chung ums.dbv2 (_dbv2.js).
   Bản gốc: ApisCongCanBo/Modules/Dashboardv2/html/lanh-dao-phong-ctsv.html + script/lanh-dao-phong-ctsv.js.
   (Trong script/ của gốc còn một tệp LẠC `script/lanh-dao-phong-ctsv.html` — bản nháp CŨ của cùng màn: ba biểu đồ
   "Hoạt động CTSV theo loại" / "Học bổng và hỗ trợ" / "Tình hình kỷ luật", không có bảng rủi ro. Menu nạp html/…,
   nên bản mới theo html/lanh-dao-phong-ctsv.html.)
   Số liệu MẪU sinh bằng mã — gốc KHÔNG có lời gọi API. Chép NGUYÊN phần tính: baseMetrics + getMetricsByFilters
   (hệ số năm / học kỳ / bậc / đơn vị), computeKpis + getTrendByNumerator, updateDataByFilters (kỷ luật, nghỉ học,
   xếp loại rèn luyện theo mẫu năm), rủi ro theo khoa (getRiskByFacultyForFilters, computeRiskRows, normalizeA..D).
   Bỏ: initActivityChart / initScholarshipChart — html gốc KHÔNG có canvas (activityChart, scholarshipChart); riêng
   activityData vẫn giữ (đã nhân hệ số lọc) vì "Hoạt động/nhu cầu" ở Thống kê CTSV là tổng của nó, như gốc.
   Bỏ: khung "Đang tải…" giả, trạng thái hệ thống, buildSignature / validateDom (chỉ ghi console).
   Khác gốc (hiển thị): KPI màu 'rose' → 'pink' (khung không có rose); đơn vị " /1000 SV" ghép vào giá trị;
   nhãn trục "HK1\n22-23" vẽ thành hai dòng; dòng mô tả bảng rủi ro ghi TÊN học kỳ (gốc in mã "hk1").
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('dbv2-lanh-dao-phong-ctsv');
    if (!root) return;
    var D = ums.dbv2, esc = ums.ui.esc;

    /* ---------- Số liệu mẫu (chép nguyên từ gốc) ---------- */
    var BASE = {
        current: { totalStudents: 12800, extracurricularParticipants: 4200, disciplinedStudents: 36, policyBeneficiaries: 1250, oneStopRequests: 3013 },
        previous: { totalStudents: 12500, extracurricularParticipants: 4050, disciplinedStudents: 48, policyBeneficiaries: 1320, oneStopRequests: 2776 } };
    var RISK_BASE = [
        { faculty: 'Công nghệ thông tin', current: { disciplinePct: 1.2, extracurricularPct: 28, dropoutPct: 6.5, counselingPer1000: 1.4 },
            previous: { disciplinePct: 1.0, extracurricularPct: 35, dropoutPct: 5.8, counselingPer1000: 1.1 } },
        { faculty: 'Trí tuệ nhân tạo', current: { disciplinePct: 2.4, extracurricularPct: 42, dropoutPct: 12.2, counselingPer1000: 2.2 },
            previous: { disciplinePct: 1.8, extracurricularPct: 48, dropoutPct: 9.0, counselingPer1000: 1.7 } },
        { faculty: 'An toàn thông tin', current: { disciplinePct: 0.8, extracurricularPct: 74, dropoutPct: 4.2, counselingPer1000: 0.6 },
            previous: { disciplinePct: 1.1, extracurricularPct: 69, dropoutPct: 4.8, counselingPer1000: 0.8 } }];
    var ACTIVITY = [850, 320, 450, 1250, 18, 125];      // Tư vấn học tập, Hỗ trợ tâm lý, Ngoại khóa, Học bổng, Kỷ luật, Khác
    var KY_LUAT = { labels: ['9', '10', '11', '12', '1', '2', '3', '4'], datasets: [
        { label: 'Khiển trách', data: [3, 4, 5, 4, 6, 5, 7, 6], borderColor: 'rgba(59, 130, 246, 1)', backgroundColor: 'rgba(59, 130, 246, 0.12)', borderWidth: 2, pointRadius: 4,
            pointHoverRadius: 6, pointBackgroundColor: 'rgba(59, 130, 246, 1)', pointBorderColor: '#ffffff', pointBorderWidth: 2, fill: false, tension: 0 },
        { label: 'Cảnh cáo', data: [1, 1, 2, 2, 2, 3, 3, 4], borderColor: 'rgba(245, 158, 11, 1)', backgroundColor: 'rgba(245, 158, 11, 0.12)', borderWidth: 2, borderDash: [6, 4],
            pointRadius: 4, pointHoverRadius: 6, pointBackgroundColor: 'rgba(245, 158, 11, 1)', pointBorderColor: '#ffffff', pointBorderWidth: 2, fill: false, tension: 0 },
        { label: 'Đình chỉ / buộc thôi học', data: [0, 0, 1, 0, 1, 1, 1, 2], borderColor: 'rgba(34, 197, 94, 1)', backgroundColor: 'rgba(34, 197, 94, 0.12)', borderWidth: 2,
            borderDash: [2, 3], pointRadius: 4, pointHoverRadius: 6, pointBackgroundColor: 'rgba(34, 197, 94, 1)', pointBorderColor: '#ffffff', pointBorderWidth: 2, fill: false, tension: 0 }] };
    var NGHI_HOC = { labels: ['HK1\n22-23', 'HK2\n22-23', 'HK1\n23-24', 'HK2\n23-24'], datasets: [
        { label: 'Khóa K20', data: [3.0, 3.5, 4.0, 4.5], backgroundColor: 'rgba(59, 130, 246, 0.85)', borderColor: 'rgba(59, 130, 246, 1)', borderWidth: 1 },
        { label: 'Khóa K21', data: [2.0, 2.5, 3.0, 3.2], backgroundColor: 'rgba(245, 158, 11, 0.85)', borderColor: 'rgba(245, 158, 11, 1)', borderWidth: 1 },
        { label: 'Khóa K22', data: [1.0, 1.5, 2.0, 2.5], backgroundColor: 'rgba(34, 197, 94, 0.85)', borderColor: 'rgba(34, 197, 94, 1)', borderWidth: 1 }] };
    var REN_LUYEN = {
        '2022-2023': { labels: ['HK1\n22-23', 'HK2\n22-23'], series: { tot: [35, 37], kha: [40, 39], trungBinh: [18, 17], yeuKem: [7, 7] } },
        '2023-2024': { labels: ['HK1\n23-24', 'HK2\n23-24'], series: { tot: [38, 40], kha: [38, 37], trungBinh: [17, 16], yeuKem: [7, 7] } } };

    var HE_SO = {
        year: { '2024-2025': 1.0, '2023-2024': 0.96, '2022-2023': 0.92, '2021-2022': 0.88 },
        semester: { '': 1.0, hk1: 0.98, hk2: 1.02, he: 0.92, dot1: 0.97, dot2: 1.01 },
        level: { all: 1.0, 'dai-hoc': 1.0, 'thac-si': 0.12, 'tien-si': 0.03 },
        unit: { 'toan-truong': 1.0, khoa: 0.35, nganh: 0.12 } };
    function heSo(f) { return (HE_SO.year[f.year] || 1.0) * (HE_SO.semester[f.semester] || 1.0) * (HE_SO.level[f.level] || 1.0) * (HE_SO.unit[f.unit] || 1.0); }

    function metrics(m) {
        var cnt = function (n) { return Math.max(0, Math.round((Number(n) || 0) * m)); };
        var sv = function (n) { return Math.max(1, Math.round((Number(n) || 0) * m)); };
        var kl = function (n) { return Math.max(0, Math.round((Number(n) || 0) * (0.6 + m * 0.4))); };
        function mot(x) { return { totalStudents: sv(x.totalStudents), extracurricularParticipants: cnt(x.extracurricularParticipants),
            disciplinedStudents: kl(x.disciplinedStudents), policyBeneficiaries: cnt(x.policyBeneficiaries), oneStopRequests: cnt(x.oneStopRequests) }; }
        return { current: mot(BASE.current), previous: mot(BASE.previous) };
    }
    function trend(c, p) {
        c = Number(c) || 0; p = Number(p) || 0;
        if (p <= 0) return c <= 0 ? { direction: 'stable', valueText: '0.0%' } : { direction: 'up', valueText: '+100.0%' };
        var pc = (c - p) / p * 100;
        if (Math.abs(pc) < 0.05) return { direction: 'stable', valueText: '0.0%' };
        return { direction: pc > 0 ? 'up' : 'down', valueText: (pc > 0 ? '+' : '-') + Math.abs(pc).toFixed(1) + '%' };
    }
    function soNguyen(n) { var v = Number(n); return isNaN(v) ? '0' : Math.round(v).toLocaleString('en-US'); }
    function computeKpis(mt) {
        var cur = mt.current, prev = mt.previous;
        var r1 = cur.totalStudents > 0 ? cur.extracurricularParticipants / cur.totalStudents * 100 : 0, t1 = trend(cur.extracurricularParticipants, prev.extracurricularParticipants);
        var r2 = cur.totalStudents > 0 ? cur.disciplinedStudents / cur.totalStudents * 1000 : 0, t2 = trend(cur.disciplinedStudents, prev.disciplinedStudents);
        var r3 = cur.totalStudents > 0 ? cur.policyBeneficiaries / cur.totalStudents * 100 : 0, t3 = trend(cur.policyBeneficiaries, prev.policyBeneficiaries);
        var t4 = trend(cur.oneStopRequests, prev.oneStopRequests);
        var nhanh = { ngoaiKhoa: r1, viPham: r2, chinhSach: r3, motCua: cur.oneStopRequests };
        var kpis = [
            { iconClass: 'fa-solid fa-people-group', label: 'Tỷ lệ SV tham gia hoạt động ngoại khóa', value: r1.toFixed(1) + '%', change: t1.valueText, trendDirection: t1.direction,
                trendClass: t1.direction === 'up' ? 'good' : t1.direction === 'down' ? 'bad' : 'neutral', subtext: 'so với học kỳ trước',
                tooltip: 'Mức độ tham gia hoạt động sinh viên', timing: 'Theo Học kỳ', color: 'green' },
            { iconClass: 'fa-solid fa-gavel', label: 'Tỷ lệ SV vi phạm kỷ luật', value: r2.toFixed(1) + ' /1000 SV', change: t2.valueText, trendDirection: t2.direction,
                trendClass: t2.direction === 'up' ? 'bad' : t2.direction === 'down' ? 'good' : 'neutral', subtext: 'so với cùng kỳ năm trước',     // tăng là xấu
                tooltip: 'Chỉ số kỷ luật sinh viên', timing: 'Hàng tháng / Quý', color: 'orange' },
            { iconClass: 'fa-solid fa-award', label: 'Tỷ lệ SV hưởng chế độ chính sách', value: r3.toFixed(1) + '%', change: t3.valueText, trendDirection: t3.direction,
                trendClass: t3.direction === 'up' ? 'good' : t3.direction === 'down' ? 'warn' : 'neutral', subtext: 'so với cùng kỳ năm trước',   // giảm là cảnh báo vàng
                tooltip: 'Mức độ hỗ trợ sinh viên', timing: 'Theo Học kỳ', color: 'blue' },
            { iconClass: 'fa-solid fa-headset', label: 'Số yêu cầu một cửa SV gửi đến', value: soNguyen(cur.oneStopRequests), change: t4.valueText, trendDirection: t4.direction,
                trendClass: t4.direction === 'down' ? 'good' : 'neutral', subtext: 'so với cùng kỳ năm trước',
                tooltip: 'Số yêu cầu sinh viên gửi qua hệ thống một cửa', timing: 'Realtime / Daily', color: 'pink' }];
        return { kpis: kpis, nhanh: nhanh };
    }
    function hangDong(ds) { return (ds.labels || []).map(function (l) { return String(l).split('\n'); }); }
    function renLuyen(f) {
        var y = f.year || '2024-2025', sem = f.semester || '';
        var my = (y === '2022-2023' || y === '2023-2024') ? y : (y === '2021-2022' ? '2022-2023' : '2023-2024');
        var t = REN_LUYEN[my] || REN_LUYEN['2023-2024'];
        var labels = t.labels.slice(), s = { tot: t.series.tot.slice(), kha: t.series.kha.slice(), trungBinh: t.series.trungBinh.slice(), yeuKem: t.series.yeuKem.slice() };
        if (sem === 'hk1' || sem === 'hk2') {
            var i = sem === 'hk1' ? 0 : 1;
            labels = labels[i] ? [labels[i]] : labels;
            Object.keys(s).forEach(function (k) { s[k] = s[k][i] !== undefined ? [s[k][i]] : s[k]; });
        }
        var bar = { categoryPercentage: 0.7, barPercentage: 0.75, borderWidth: 1 };
        return { labels: hangDong({ labels: labels }), datasets: [
            Object.assign({ label: 'Tốt', data: s.tot, backgroundColor: 'rgba(59, 130, 246, 0.85)', borderColor: 'rgba(59, 130, 246, 1)' }, bar),
            Object.assign({ label: 'Khá', data: s.kha, backgroundColor: 'rgba(245, 158, 11, 0.85)', borderColor: 'rgba(245, 158, 11, 1)' }, bar),
            Object.assign({ label: 'Trung bình', data: s.trungBinh, backgroundColor: 'rgba(34, 197, 94, 0.85)', borderColor: 'rgba(34, 197, 94, 1)' }, bar),
            Object.assign({ label: 'Yếu / Kém', data: s.yeuKem, backgroundColor: 'rgba(239, 68, 68, 0.85)', borderColor: 'rgba(239, 68, 68, 1)' }, bar)] };
    }

    /* ---------- Rủi ro theo khoa (Risk Score A:20% · B:40% · C:30% · D:10%) ---------- */
    var HE_SO_RR = {
        year: { '2024-2025': 1.0, '2023-2024': 0.98, '2022-2023': 1.02, '2021-2022': 1.04 },
        semester: { '': 1.0, hk1: 0.98, hk2: 1.02, he: 1.03, dot1: 0.99, dot2: 1.01 },
        level: { all: 1.0, 'dai-hoc': 1.0, 'thac-si': 0.8, 'tien-si': 0.7 } };
    function nA(v) { v = Number(v) || 0; return v < 1 ? { score: 0, reason: 'Tỷ lệ SV bị kỷ luật rất thấp' } : v < 2 ? { score: 40, reason: 'Có một số SV bị kỷ luật' } :
        v < 4 ? { score: 70, reason: 'Tỷ lệ SV bị kỷ luật cao' } : { score: 100, reason: 'Tỷ lệ vi phạm kỷ luật rất cao' }; }
    function nB(v) { v = Number(v) || 0; return v >= 70 ? { score: 0, reason: 'Đa số SV có tham gia hoạt động' } : v >= 50 ? { score: 40, reason: 'Mức tham gia trung bình' } :
        v >= 30 ? { score: 70, reason: 'Ít SV tham gia, rủi ro gắn kết thấp' } : { score: 100, reason: 'Rất ít SV tham gia hoạt động, thiếu gắn kết' }; }
    function nC(v) { v = Number(v) || 0; return v <= 5 ? { score: 0, reason: 'Tỷ lệ nghỉ học thấp' } : v < 10 ? { score: 40, reason: 'Tỷ lệ nghỉ học trung bình' } :
        v < 15 ? { score: 70, reason: 'Cần tư vấn, theo dõi' } : { score: 100, reason: 'Báo động rủi ro nghỉ học' }; }
    function nD(v) { v = Number(v) || 0; return v < 1 ? { score: 0, reason: 'Ít ca tư vấn/tâm lý nghiêm trọng' } : v < 2 ? { score: 40, reason: 'Có một số ca nghiêm trọng' } :
        v < 4 ? { score: 70, reason: 'Khá nhiều ca nghiêm trọng, cần quan tâm đặc biệt' } : { score: 100, reason: 'Rất nhiều ca nghiêm trọng, rủi ro lớn về an sinh SV' }; }
    function xuHuongRR(d) { d = Number(d) || 0; return d >= 10 ? { direction: 'up', text: 'Tăng mạnh ↑↑' } : d >= 5 ? { direction: 'up', text: 'Tăng ↑' } :
        d <= -10 ? { direction: 'down', text: 'Giảm mạnh ↓↓' } : d <= -5 ? { direction: 'down', text: 'Giảm ↓' } : { direction: 'stable', text: 'Ổn định →' }; }
    function ruiRo(f) {
        // unitFactor của gốc luôn 1.0 → bỏ qua
        var factor = (HE_SO_RR.year[f.year] || 1.0) * (HE_SO_RR.semester[f.semester] || 1.0) * (HE_SO_RR.level[f.level] || 1.0);
        var pct = function (x) { return Math.max(0, Math.min(100, +((Number(x) || 0) * (0.95 + factor * 0.05)).toFixed(1))); };
        var rate = function (x) { return Math.max(0, +((Number(x) || 0) * (0.95 + factor * 0.05)).toFixed(2)); };
        function diem(x) {
            var ch = [nA(pct(x.disciplinePct)), nB(pct(x.extracurricularPct)), nC(pct(x.dropoutPct)), nD(rate(x.counselingPer1000))];
            return { ch: ch, score: ch[0].score * 0.20 + ch[1].score * 0.40 + ch[2].score * 0.30 + ch[3].score * 0.10 };
        }
        return RISK_BASE.map(function (it) {
            var c = diem(it.current), p = diem(it.previous), delta = c.score - p.score;
            var best = c.ch.slice().sort(function (a, b) { return b.score - a.score; })[0];
            var tr = xuHuongRR(delta);
            return { faculty: it.faculty, score: c.score, riskLevel: c.score >= 80 ? 'Cao' : c.score >= 50 ? 'Trung bình' : 'Thấp',
                reason: best && best.reason ? best.reason : 'Ổn định', trendDirection: tr.direction, trendText: tr.text,
                deltaText: (delta >= 0 ? '+' : '') + delta.toFixed(1) + ' điểm' };
        }).sort(function (a, b) { return b.score - a.score; });
    }

    var BASE_OPTS = {
        legend: { display: true, position: 'top', labels: { fontSize: 12, padding: 15, usePointStyle: true } },
        tooltips: { mode: 'index', intersect: false, backgroundColor: 'rgba(255, 255, 255, 0.98)', titleFontColor: '#1f2937', bodyFontColor: '#4b5563', borderColor: '#e5e7eb',
            borderWidth: 2, cornerRadius: 10, xPadding: 15, yPadding: 15 },
        animation: { duration: 1500, easing: 'easeInOutQuart' } };
    var TRUC_X = { gridLines: { display: false, drawBorder: true }, ticks: { fontSize: 12, fontColor: '#475569', autoSkip: false, maxRotation: 0, minRotation: 0 } };
    function trucY(ticks) { return { ticks: Object.assign({ beginAtZero: true, fontSize: 11, fontColor: '#64748b' }, ticks), gridLines: { color: 'rgba(0, 0, 0, 0.06)', drawBorder: false } }; }
    function opts(callbacks, yTicks) {
        return Object.assign({}, BASE_OPTS, { tooltips: Object.assign({}, BASE_OPTS.tooltips, { callbacks: callbacks }),
            scales: { xAxes: [TRUC_X], yAxes: [trucY(yTicks)] } });
    }
    function tieuDeHK(items, data) {
        var l = data.labels[items && items.length ? items[0].index : 0] || '';
        return 'Học kỳ / Năm học: ' + (Array.isArray(l) ? l.join(' ') : String(l).replace(/\n/g, ' '));
    }
    function nhanPct(it, data) { return (data.datasets[it.datasetIndex].label || '') + ': ' + it.yLabel + '%'; }
    var TEN_HK = { hk1: 'Học kỳ 1', hk2: 'Học kỳ 2', he: 'Học kỳ hè', dot1: 'Đợt 1', dot2: 'Đợt 2' };
    var MUC = { 'Cao': { tone: 'bad', icon: 'fa-circle-exclamation' }, 'Trung bình': { tone: 'warn', icon: 'fa-triangle-exclamation' }, 'Thấp': { tone: 'good', icon: 'fa-circle-check' } };
    var XU = { up: { tone: 'bad', icon: 'fa-arrow-up' }, down: { tone: 'good', icon: 'fa-arrow-down' }, stable: { tone: 'mute', icon: 'fa-minus' } };
    function nhan(chu, tone, icon, title) {
        return '<span class="dbv-nhan dbv-nhan--' + tone + '" title="' + esc(title) + '"><i class="fa-solid ' + icon + '"></i> ' + esc(chu) + '</span>';
    }

    D.man(root, {
        tieuDe: 'Dashboard Lãnh đạo Phòng CTSV', moTa: '🎓 Quản lý công tác sinh viên, học bổng và hỗ trợ - Dữ liệu cập nhật theo thời gian thực',
        icon: 'fa-solid fa-people-group', nguon: 'Hệ thống CTSV',
        loc: [
            { key: 'year', label: 'Năm học', items: [{ value: '2024-2025', text: '2024-2025' }, { value: '2023-2024', text: '2023-2024' }, { value: '2022-2023', text: '2022-2023' },
                { value: '2021-2022', text: '2021-2022' }] },
            { key: 'semester', label: 'Học kỳ / Đợt', items: [{ value: '', text: 'Tất cả' }, { value: 'hk1', text: 'Học kỳ 1' }, { value: 'hk2', text: 'Học kỳ 2' },
                { value: 'he', text: 'Học kỳ hè' }, { value: 'dot1', text: 'Đợt 1' }, { value: 'dot2', text: 'Đợt 2' }] },
            { key: 'level', label: 'Bậc đào tạo', items: [{ value: 'all', text: 'Tất cả' }, { value: 'dai-hoc', text: 'Đại học' }, { value: 'thac-si', text: 'Thạc sĩ' },
                { value: 'tien-si', text: 'Tiến sĩ' }] },
            { key: 'unit', label: 'Đơn vị', items: [{ value: 'toan-truong', text: 'Toàn trường' }, { value: 'khoa', text: 'Theo Khoa' }, { value: 'nganh', text: 'Theo Ngành/CTĐT' }] }],
        macDinh: { year: '2024-2025', semester: '', level: 'all', unit: 'toan-truong' },
        tinh: function (f) {
            var m = heSo(f), k = computeKpis(metrics(m));
            var klScale = function (n) { return Math.max(0, Math.round((Number(n) || 0) * (0.6 + m * 0.4))); };
            var nhScale = function (n) { return Math.max(0, Math.min(100, +((Number(n) || 0) * (0.9 + m * 0.1)).toFixed(1))); };
            var kyLuat = { labels: KY_LUAT.labels.slice(), datasets: KY_LUAT.datasets.map(function (ds) { return Object.assign({}, ds, { data: ds.data.map(klScale) }); }) };
            var nghiHoc = { labels: hangDong(NGHI_HOC), datasets: NGHI_HOC.datasets.map(function (ds) {
                return Object.assign({}, ds, { data: ds.data.map(nhScale), categoryPercentage: 0.6, barPercentage: 0.7 }); }) };
            k.nhanh.hoatDong = ACTIVITY.reduce(function (s, v) { return s + Math.max(0, Math.round(v * m)); }, 0);
            return { kpis: k.kpis, nhanh: k.nhanh, kyLuat: kyLuat, nghiHoc: nghiHoc, renLuyen: renLuyen(f), ruiRo: ruiRo(f), f: f };
        },
        the: [
            { key: 'kyluat', tieuDe: 'Xu hướng sinh viên vi phạm kỷ luật theo năm học', icon: 'fa-chart-line', cao: 360,
                moTa: 'Xu hướng vi phạm kỷ luật sinh viên theo thời gian (cập nhật hàng tháng)',
                ve: function (host, kq, api) {
                    host.title = 'Xu hướng vi phạm kỷ luật sinh viên theo thời gian | Hàng tháng: Sau khi Hội đồng kỷ luật chốt danh sách và ban hành quyết định';
                    api.bieuDo(host, 'line', kq.kyLuat, opts({
                        title: function (items, data) { return 'Tháng ' + (data.labels[items && items.length ? items[0].index : 0] || '') + ' (năm học)'; },
                        label: function (it, data) { return (data.datasets[it.datasetIndex].label || '') + ': ' + it.yLabel; } }, { precision: 0 }));
                } },
            { key: 'nghihoc', tieuDe: 'Tỷ lệ sinh viên xin nghỉ học tạm thời / thôi học', icon: 'fa-person-walking-arrow-right', cao: 360,
                moTa: 'So sánh tỷ lệ nghỉ học giữa các khóa theo học kỳ/năm học',
                ve: function (host, kq, api) {
                    host.title = 'Tỷ lệ sinh viên tạm nghỉ hoặc thôi học | Hàng tháng / Học kỳ: Cập nhật ngay khi có quyết định';
                    api.bieuDo(host, 'bar', kq.nghiHoc, opts({ title: tieuDeHK, label: nhanPct }, { callback: function (v) { return v + '%'; } }));
                } },
            { key: 'renluyen', tieuDe: 'Tỷ lệ sinh viên xếp loại rèn luyện theo năm học / học kỳ', icon: 'fa-ranking-star', cao: 360,
                moTa: 'So sánh các mức xếp loại rèn luyện theo từng học kỳ',
                ve: function (host, kq, api) {
                    api.bieuDo(host, 'bar', kq.renLuyen, opts({ title: tieuDeHK, label: nhanPct }, { callback: function (v) { return v + '%'; } }));
                } },
            { key: 'nhanh', bang: true, tieuDe: 'Thống kê CTSV', icon: 'fa-gauge-high',
                ve: function (host, kq) {
                    var n = kq.nhanh;
                    host.innerHTML = [['% tham gia ngoại khóa', n.ngoaiKhoa.toFixed(1) + '%'], ['Hoạt động/nhu cầu', soNguyen(n.hoatDong)], ['% hưởng chính sách', n.chinhSach.toFixed(1) + '%'],
                        ['Vi phạm /1000 SV', n.viPham.toFixed(1)], ['Yêu cầu một cửa', soNguyen(n.motCua)]].map(function (x) {
                        return '<div class="ums-kv"><span>' + esc(x[0]) + '</span><b>' + esc(x[1]) + '</b></div>'; }).join('');
                } },
            { key: 'ruiro', rong: 2, bang: true, tieuDe: 'Danh sách rủi ro theo khoa', icon: 'fa-triangle-exclamation',
                moTa: 'Risk Score 0-100 (A:20% • B:40% • C:30% • D:10%)',
                ve: function (host, kq, api) {
                    var f = kq.f, mt = host.previousElementSibling, duoi = 'Risk Score 0-100 (A:20% • B:40% • C:30% • D:10%)';
                    if (mt && mt.classList.contains('dbv-the__mt')) {
                        mt.textContent = f.semester ? 'Chốt theo học kỳ/đợt (' + (TEN_HK[f.semester] || f.semester) + ') • Năm học ' + f.year + ' • ' + duoi : 'Chốt theo năm học ' + f.year + ' • ' + duoi;
                        mt.title = 'Chốt theo học kỳ hoặc theo năm học';
                    }
                    api.bang(host, [
                        { title: 'Khoa', width: '220px', render: function (r) { return '<b>' + esc(r.faculty) + '</b>'; } },
                        { title: 'Mức rủi ro', width: '180px', render: function (r) { var m = MUC[r.riskLevel]; return nhan(r.riskLevel, m.tone, m.icon, 'Risk Score: ' + r.score.toFixed(1) + ' / 100'); } },
                        { title: 'Nguyên nhân chính', render: function (r) { return esc(r.reason); } },
                        { title: 'Xu hướng', width: '140px', render: function (r) { var x = XU[r.trendDirection]; return nhan(r.trendText, x.tone, x.icon, 'So với cùng kỳ trước: ' + r.deltaText); } }], kq.ruiRo);
                } }]
    });
})();
