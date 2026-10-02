/* =========================================================================
   Dashboard Giáo vụ khoa — TRANG MẪU (cổng cán bộ). Khung chung ums.dbv2 (_dbv2.js).
   Bản gốc: ApisCongCanBo/Modules/Dashboardv2/html/giao-vu-khoa.html + script/giao-vu-khoa.js ("layout demo").
   Số liệu MẪU sinh bằng mã (hashString + biến thiên theo bộ lọc) — gốc KHÔNG có lời gọi API ("sau này nối API ở đây").
   Phần tính số liệu chép NGUYÊN từ gốc: updateDataByFilters (4 KPI + thống kê giáo vụ), seeded01 / randBetween,
   normalizePct, getRiskLevel, getPrevTermExam, getTrend, buildRiskList, buildTeacherAssignmentProgressChart,
   buildGradingProgressChart, buildActivityChart, buildStudentOutcomeDistributionByCohort; cấu hình biểu đồ giữ dạng
   Chart.js 2 (khung tự đổi sang v4).
   Khác gốc (chỉ cách vẽ):
     · "Thống kê giáo vụ" (gốc nằm trong khung Bộ lọc) → vẽ ngay dưới hàng ô lọc của khung Bộ lọc chung.
     · Nhãn % trên cột chồng (gốc: plugin Chart.plugins.register tự viết, bỏ đoạn < 6%) → chartjs-plugin-datalabels, cùng luật.
     · Chú giải mức rủi ro (Cao / Trung bình / Thấp) → nhãn ums đầu thẻ; bảng rủi ro vẽ bằng ums.ui.table.
   Bỏ: buildClassByMajorChart (gốc không có canvas nào dùng — mã chết); dòng "Trạng thái: Sẵn sàng" ở đầu trang
   (khung chung đã có nhãn "Trang mẫu").
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('dbv2-giao-vu-khoa');
    if (!root) return;
    var D = ums.dbv2, esc = ums.ui.esc, so = D.so, r1 = D.r1, pct = D.pct, hash = D.hash;

    function r0(v) { return Math.round(so(v)); }
    function fInt(n) { var x = r0(n); try { return x.toLocaleString('en-US'); } catch (e) { return String(x); } }
    function fPct1(v) { return r1(v).toFixed(1) + '%'; }
    function trendPct(c, p) { p = so(p); return p === 0 ? 0 : ((so(c) - p) / p) * 100; }
    function seeded01(seed) { var x = Math.sin(seed * 9999.123) * 10000; return x - Math.floor(x); }
    function randBetween(seed, min, max) { return min + (max - min) * seeded01(seed); }

    /* ---------- KPI + thống kê giáo vụ (updateDataByFilters gốc) ---------- */
    function tinhKpi(filters) {
        var seed = hash(JSON.stringify(filters || {})), shift = (seed % 7) - 3;
        var totalOpen = Math.max(0, 120 + shift * 6), assigned = Math.max(0, Math.min(totalOpen, 92 + shift * 5));
        var pAssigned = pct(assigned, totalOpen);
        var prevOpen = Math.max(0, 118 + (shift - 1) * 6), prevAssigned = Math.max(0, Math.min(prevOpen, 88 + (shift - 1) * 5));
        var tAssigned = trendPct(pAssigned, pct(prevAssigned, prevOpen));
        var need = Math.max(0, 110 + shift * 4), onTime = Math.max(0, Math.min(need, 86 + shift * 4)), pOnTime = pct(onTime, need);
        var prevNeed = Math.max(0, 108 + (shift - 1) * 4), prevOnTime = Math.max(0, Math.min(prevNeed, 84 + (shift - 1) * 4));
        var tOnTime = trendPct(pOnTime, pct(prevOnTime, prevNeed));
        var sessions = Math.max(0, 60 + shift * 3), proctors = Math.max(0, Math.min(sessions, 44 + shift * 3)), pProctor = pct(proctors, sessions);
        var prevSessions = Math.max(0, 58 + (shift - 1) * 3), prevProctors = Math.max(0, Math.min(prevSessions, 42 + (shift - 1) * 3));
        var tProctor = trendPct(pProctor, pct(prevProctors, prevSessions));
        var students = Math.max(0, 2450 + shift * 25), prevStudents = Math.max(0, 2420 + (shift - 1) * 25), tStudents = trendPct(students, prevStudents);

        function trendClass(t, mode) { if (Math.abs(t) < 0.05) return 'stable'; if (t > 0) return 'up'; return mode === 'students' ? 'warn' : 'down'; }
        function trendText(t) { var v = r1(t); if (Math.abs(v) < 0.05) return '0.0%'; return (v > 0 ? '+' : '') + v.toFixed(1) + '%'; }
        // gốc: trend up (xanh) / down (đỏ) / warn (vàng, mũi tên xuống) / stable
        var TONE = { up: 'good', down: 'bad', warn: 'warn', stable: 'neutral' };
        function kpi(icon, label, value, t, mode, color, tooltip, subtext) {
            var k = trendClass(t, mode);
            return { iconClass: icon, label: label, value: value, change: trendText(t), trendDirection: k === 'warn' ? 'down' : k, trendClass: TONE[k],
                color: color, subtext: subtext || 'So với kỳ trước', tooltip: tooltip };
        }
        return {
            kpis: [
                kpi('fa-solid fa-chalkboard-user', 'Tỷ lệ lớp HP đã phân công GV', fPct1(pAssigned), tAssigned, 'goodUp', 'pink',
                    'Mức độ hoàn thành phân công giảng viên giảng dạy. Cập nhật Realtime/Daily (quan trọng 2-4 tuần trước khi học kỳ bắt đầu).'),
                kpi('fa-solid fa-clipboard-check', 'Tỷ lệ lớp xác nhận đúng hạn', fPct1(pOnTime), tOnTime, 'goodUp', 'green',
                    'Mức độ tuân thủ kế hoạch nhập điểm và xác nhận điểm danh. Cập nhật Hàng ngày (trong suốt quá trình giảng dạy và ngay sau khi kết thúc môn học).'),
                kpi('fa-solid fa-user-shield', 'Tỷ lệ ca thi đã phân công CBCT', fPct1(pProctor), tProctor, 'goodUp', 'orange',
                    'Mức độ hoàn thành phân công cán bộ coi thi. Cập nhật Realtime/Daily (cao điểm 1-2 tuần trước đợt thi).'),
                kpi('fa-solid fa-users', 'Tổng số sinh viên của khoa', fInt(students), tStudents, 'students', 'blue',
                    'Quy mô sinh viên của khoa. Chốt theo học kỳ sau khi kết thúc đăng ký học phần và đóng học phí.', 'So với kỳ/năm trước')],
            nhanh: [
                { label: 'Số học phần', value: String(156 + shift * 2) },
                { label: 'Số lớp đang theo dõi', value: String(Math.max(0, 85 + shift)) },
                { label: 'Đợt/kỳ có dữ liệu', value: (filters && filters.termExam && filters.termExam !== 'ALL') ? '1' : 'Nhiều' },
                { label: 'Tỷ lệ hoàn thành nhập liệu', value: r1(98.5 + shift * 0.1).toFixed(1) + '%' }]
        };
    }

    /* ---------- Danh sách rủi ro (A/B/C) ---------- */
    function normalizePct(p, kind) {
        p = so(p);
        var score = p < 5 ? 0 : p < 10 ? 40 : p < 20 ? 70 : 100, i = p < 5 ? 0 : p < 10 ? 1 : p < 20 ? 2 : 3;
        var LY = {
            A: ['Tiến độ tín chỉ ≥ lộ trình chuẩn, học nhanh', 'Tiến độ tín chỉ sát chuẩn, đúng tiến độ', 'Nhiều SV học chậm so với chuẩn',
                'Rất nhiều SV học chậm so với lộ trình, nguy cơ kéo dài thời gian học tập'],
            B: ['Phần lớn SV hoàn thành học phần đăng ký', 'Có SV còn nợ môn', 'Nhiều học phần học chưa qua, cần có kế hoạch học lại', 'Nguy cơ học chậm'],
            C: ['GPA tích lũy tốt', 'GPA tích lũy chấp nhận', 'Nhiều SV có GPA thấp, nguy cơ cảnh báo học vụ', 'Rất nhiều SV có GPA thấp, nguy cơ cao bị cảnh báo / buộc thôi học']
        };
        return { pct: r1(p), score: score, reason: LY[kind] ? LY[kind][i] : '' };
    }
    function mucRuiRo(s) { s = so(s); return s >= 80 ? { key: 'high', text: 'Cao' } : s >= 50 ? { key: 'medium', text: 'Trung bình' } : { key: 'low', text: 'Thấp' }; }
    function kyTruoc(t) { return t === 'HK2' ? 'HK1' : t === 'HK1' ? 'HK2' : t === 'HE' ? 'HK2' : t === 'THI_CK' ? 'HK2' : 'HK1'; }
    function xuHuong(c, p) {
        var d = so(c) - so(p);
        if (Math.abs(d) < 5) return { key: 'stable', text: '→', delta: d };
        if (d >= 10) return { key: 'upStrong', text: '↑↑', delta: d };
        if (d >= 5) return { key: 'up', text: '↑', delta: d };
        if (d <= -10) return { key: 'downStrong', text: '↓↓', delta: d };
        return { key: 'down', text: '↓', delta: d };
    }
    function abc(seed) {
        var a = randBetween(seed + 1, 0, 28), b = randBetween(seed + 2, 0, 26), c = randBetween(seed + 3, 0, 24);
        b = Math.min(30, b + Math.max(0, (a - 12) * 0.25));
        c = Math.min(30, c + Math.max(0, (b - 10) * 0.20));
        return [normalizePct(a, 'A'), normalizePct(b, 'B'), normalizePct(c, 'C')];
    }
    function ruiRo(f) {
        var baseSeed = hash('risk|' + JSON.stringify(f || {}));
        var prevF = { schoolYear: f.schoolYear, termExam: (f.termExam && f.termExam !== 'ALL') ? kyTruoc(f.termExam) : 'HK1', educationLevel: f.educationLevel };
        var prevSeedBase = hash('riskPrev|' + JSON.stringify(prevF));
        var classes = ['K15_CNTT01', 'K15_CNTT02', 'K15_ATTT01', 'K16_CNTT01', 'K16_ATTT02', 'K16_MKT01',
            'K17_CNTT01', 'K17_CNTT02', 'K17_KT01', 'K18_CNTT01', 'K18_ATTT01', 'K18_KT02'];
        var items = classes.map(function (code, idx) {
            var x = abc(baseSeed + hash(code) + idx * 31), A = x[0], B = x[1], C = x[2];
            var score = r0(A.score * 0.40 + B.score * 0.30 + C.score * 0.30);
            var y = abc(prevSeedBase + hash(code) + idx * 29);
            var prev = r0(y[0].score * 0.40 + y[1].score * 0.30 + y[2].score * 0.30);
            var parts = [{ points: A.score * 0.40, reason: A.reason, score: A.score }, { points: B.score * 0.30, reason: B.reason, score: B.score },
                { points: C.score * 0.30, reason: C.reason, score: C.score }].sort(function (p, q) { return q.points - p.points; });
            var reasons = [];
            if (parts[0].score > 0) reasons.push(parts[0].reason);
            if (parts[1].score > 0 && parts[1].points >= parts[0].points * 0.8) reasons.push(parts[1].reason);
            if (!reasons.length) reasons.push('Rủi ro thấp, các chỉ số ổn định');
            return { classCode: code, riskScore: score, level: mucRuiRo(score), reasons: reasons, trend: xuHuong(score, prev),
                title: 'A (40%): ' + A.pct + '% → ' + A.score + '\nB (30%): ' + B.pct + '% → ' + B.score + '\nC (30%): ' + C.pct + '% → ' + C.score +
                    '\nRisk Score = ' + score + ' (0-100)' };
        });
        items.sort(function (a, b) { return b.riskScore - a.riskScore; });
        return items.slice(0, 7);
    }

    /* ---------- Biểu đồ ---------- */
    function phanCongGV(f) {
        var labels = ['T-4', 'T-3', 'T-2', 'T-1'], seed = hash('teacherAssign|' + JSON.stringify(f || {}));
        var total = Math.max(1, 120 + ((seed % 9) - 4) * 2);
        var last = Math.max(0, Math.min(total, Math.round(total * (0.15 + ((seed % 5) * 0.03))))), assigned = [];
        for (var i = 0; i < labels.length; i++) {
            last = Math.min(total, last + Math.max(0, Math.round(total * (0.12 + (((seed + i * 11) % 7) * 0.02)))));
            assigned.push(last);
        }
        return { labels: labels, datasets: [
            { label: 'Số lớp đã phân công (lớp)', data: assigned, yAxisID: 'y-left', borderColor: 'rgba(59, 130, 246, 1)', backgroundColor: 'rgba(59, 130, 246, 0.12)',
                borderWidth: 3, pointRadius: 3, pointHoverRadius: 5, lineTension: 0.25, fill: false },
            { label: 'Tỷ lệ phân công (%)', data: assigned.map(function (x) { return r1(pct(x, total)); }), yAxisID: 'y-right', borderColor: 'rgba(16, 185, 129, 1)',
                backgroundColor: 'rgba(16, 185, 129, 0.10)', borderWidth: 3, pointRadius: 3, pointHoverRadius: 5, lineTension: 0.25, fill: false }] };
    }
    function tienDoDiem(f) {
        var seed = hash('gradingProgress|' + JSON.stringify(f || {})), labels = [];
        for (var i = 1; i <= 14; i++) labels.push('10+' + i);
        var startA = 12 + (seed % 7), startB = Math.max(0, startA - (6 + (seed % 5))), speedA = 7 + ((seed % 5) * 0.6), speedB = 6 + (((seed + 11) % 5) * 0.55);
        var dA = [], dB = [];
        for (var d = 0; d < labels.length; d++) {
            var a = Math.min(100, startA + d * speedA + (((seed + d * 13) % 7) - 3) * 0.35);
            var b = Math.min(100, startB + d * speedB + (((seed + d * 17) % 7) - 3) * 0.35);
            b = Math.min(b, a - (d < 6 ? 2 : 0));
            dA.push(r1(Math.max(0, a))); dB.push(r1(Math.max(0, b)));
        }
        return { labels: labels, datasets: [
            { label: 'Hoàn thành điểm danh (%)', data: dA, borderColor: 'rgba(59, 130, 246, 1)', backgroundColor: 'rgba(59, 130, 246, 0.10)', borderWidth: 3,
                pointRadius: 2.5, pointHoverRadius: 4, lineTension: 0.25, fill: false },
            { label: 'Hoàn thành điểm quá trình (%)', data: dB, borderColor: 'rgba(245, 158, 11, 1)', backgroundColor: 'rgba(245, 158, 11, 0.10)', borderWidth: 3,
                pointRadius: 2.5, pointHoverRadius: 4, lineTension: 0.25, fill: false }] };
    }
    function ketQuaKhoa(f) {
        var seedBase = hash('outcome|' + JSON.stringify(f || {})), cohorts = ['K20', 'K21', 'K22'], normal = [], slow = [], risk = [];
        cohorts.forEach(function (k, i) {
            var s = seedBase + hash(k) + i * 41;
            var a = randBetween(s + 1, 2, 22), b = randBetween(s + 2, 2, 18), c = randBetween(s + 3, 1, 12);
            if (k === 'K22') { a += 3; b += 2; c += 1; }
            var A = normalizePct(a, 'A'), B = normalizePct(b, 'B'), C = normalizePct(c, 'C');
            var riskPct = Math.max(0, Math.min(100, C.pct)), slowPct = Math.max(0, Math.min(100 - riskPct, Math.max(A.pct, B.pct)));
            var normalPct = Math.max(0, 100 - riskPct - slowPct);
            var n0 = Math.round(normalPct), s0 = Math.round(slowPct), q0 = Math.round(riskPct), diff = 100 - (n0 + s0 + q0);
            if (diff !== 0) n0 = Math.max(0, Math.min(100, n0 + diff));
            normal.push(n0); slow.push(s0); risk.push(q0);
        });
        return { labels: cohorts, datasets: [
            { label: 'Bình thường / đúng lộ trình', data: normal, backgroundColor: 'rgba(59, 130, 246, 0.90)', borderColor: 'rgba(59, 130, 246, 1)', borderWidth: 1 },
            { label: 'Chậm tiến độ', data: slow, backgroundColor: 'rgba(245, 158, 11, 0.90)', borderColor: 'rgba(245, 158, 11, 1)', borderWidth: 1 },
            { label: 'Nguy cơ học vụ', data: risk, backgroundColor: 'rgba(16, 185, 129, 0.90)', borderColor: 'rgba(16, 185, 129, 1)', borderWidth: 1 }] };
    }
    function hoatDong(f) {
        var seed = hash('activity|' + JSON.stringify(f || {})), base = [450, 125, 380, 85, 25];
        var MAU = ['251, 113, 133', '59, 130, 246', '16, 185, 129', '245, 158, 11', '168, 85, 247'];
        return { labels: ['Đăng ký học phần', 'Xử lý đơn từ', 'Cập nhật điểm', 'Tư vấn học tập', 'Báo cáo'], datasets: [{ label: 'Số lượng',
            data: base.map(function (x, i) { return Math.max(0, x + (((seed + i * 19) % 41) - 20)); }),
            backgroundColor: MAU.map(function (m) { return 'rgba(' + m + ', 0.80)'; }), borderColor: MAU.map(function (m) { return 'rgba(' + m + ', 1)'; }), borderWidth: 1 }] };
    }

    /* getChartOptions gốc */
    function opts() {
        return { legend: { display: true, position: 'top', labels: { fontSize: 12, fontStyle: 'bold', padding: 16 } },
            tooltips: { backgroundColor: 'rgba(255, 255, 255, 0.96)', titleFontColor: '#0f172a', bodyFontColor: '#334155', borderColor: '#e2e8f0', borderWidth: 1,
                xPadding: 12, yPadding: 10, cornerRadius: 8 },
            scales: { yAxes: [{ ticks: { beginAtZero: true, fontColor: '#64748b' }, gridLines: { color: 'rgba(0, 0, 0, 0.05)' } }],
                xAxes: [{ ticks: { fontColor: '#64748b' }, gridLines: { display: false } }] } };
    }

    /* "Thống kê giáo vụ" — gốc nằm trong khung Bộ lọc, dưới hai nút */
    function veNhanh(items) {
        var host = root.querySelector('[data-z="gvk-nhanh"]');
        if (!host) {
            var loc = root.querySelector('.ums-filter');
            if (!loc) return;
            host = document.createElement('div');
            host.className = 'dbv-gvk-nhanh';
            host.setAttribute('data-z', 'gvk-nhanh');
            loc.parentNode.insertBefore(host, loc.nextSibling);
        }
        host.innerHTML = '<div class="dbv-gvk-nhanh__td">Thống kê giáo vụ</div><div class="dbv-gvk-nhanh__luoi">' + items.map(function (x) {
            return '<div class="dbv-gvk-nhanh__o"><span>' + esc(x.label) + ':</span><b>' + esc(x.value || '—') + '</b></div>';
        }).join('') + '</div>';
    }

    var TONE_MUC = { high: 'bad', medium: 'warn', low: 'info' };
    var TONE_XU = { up: 'bad', upStrong: 'bad', down: 'good', downStrong: 'good', stable: 'mute' };

    D.man(root, {
        tieuDe: 'Dashboard Giáo vụ khoa', moTa: '📌 Theo dõi công tác giáo vụ và hoạt động học tập (layout demo)', icon: 'fa-solid fa-building-columns', nguon: 'Hệ thống Đào tạo',
        loc: [
            { key: 'schoolYear', label: 'Năm học', items: [{ value: 'ALL', text: 'Tất cả năm học' }, { value: '2023-2024', text: '2023 - 2024' },
                { value: '2024-2025', text: '2024 - 2025' }, { value: '2025-2026', text: '2025 - 2026' }] },
            { key: 'termExam', label: 'Học kỳ / Đợt thi', items: [{ value: 'ALL', text: 'Tất cả học kỳ/đợt thi' }, { value: 'HK1', text: 'Học kỳ 1' },
                { value: 'HK2', text: 'Học kỳ 2' }, { value: 'HE', text: 'Học kỳ hè' }, { value: 'THI_GK', text: 'Đợt thi giữa kỳ' }, { value: 'THI_CK', text: 'Đợt thi cuối kỳ' }] },
            { key: 'educationLevel', label: 'Bậc đào tạo', items: [{ value: 'ALL', text: 'Tất cả bậc đào tạo' }, { value: 'DH', text: 'Đại học' },
                { value: 'ThS', text: 'Thạc sĩ' }, { value: 'TS', text: 'Tiến sĩ' }] }],
        macDinh: { schoolYear: 'ALL', termExam: 'ALL', educationLevel: 'ALL' },
        tinh: function (F) {
            // giữ đúng thứ tự khoá như gốc — hạt giống số liệu là JSON.stringify(bộ lọc)
            var f = { schoolYear: F.schoolYear, termExam: F.termExam, educationLevel: F.educationLevel };
            var k = tinhKpi(f);
            veNhanh(k.nhanh);    // vùng nằm trong khung Bộ lọc (khung chung dựng sẵn trước khi gọi tinh)
            return { kpis: k.kpis, phanCong: phanCongGV(f), tienDo: tienDoDiem(f), ketQua: ketQuaKhoa(f), hoatDong: hoatDong(f), ruiRo: ruiRo(f) };
        },
        the: [
            { key: 'phancong', rong: 2, tieuDe: 'Phân công giảng viên giảng dạy', icon: 'fa-chalkboard-user',
                moTa: 'Tiến độ phân công theo mốc thời gian trước khi học kỳ bắt đầu (T-4 → T-1)',
                ve: function (host, kq, api) {
                    var o = opts();
                    o.legend.labels.usePointStyle = true;
                    o.tooltips.callbacks = {
                        title: function (items, data) { return items && items.length ? 'Mốc: ' + ((data && data.labels && data.labels[items[0].index]) || '') : ''; },
                        label: function (it, data) { var ds = data.datasets[it.datasetIndex] || {}; return (ds.label || '') + ': ' + (ds.yAxisID === 'y-right' ? fPct1(it.yLabel) : fInt(it.yLabel)); },
                        afterBody: function () { return 'Tiến độ phân công giảng viên cho các lớp học phần theo thời gian trước học kỳ'; } };
                    o.scales = { xAxes: [{ ticks: { fontColor: '#64748b' }, gridLines: { display: false } }], yAxes: [
                        { id: 'y-left', position: 'left', ticks: { beginAtZero: true, fontColor: '#64748b' }, scaleLabel: { display: true, labelString: 'Số lớp đã phân công' },
                            gridLines: { color: 'rgba(0, 0, 0, 0.05)' } },
                        { id: 'y-right', position: 'right', ticks: { beginAtZero: true, max: 100, callback: function (v) { return v + '%'; }, fontColor: '#64748b' },
                            scaleLabel: { display: true, labelString: 'Tỷ lệ phân công (%)' }, gridLines: { drawOnChartArea: false } }] };
                    api.bieuDo(host, 'line', kq.phanCong, o);
                } },
            { key: 'tiendo', rong: 2, tieuDe: 'Tiến độ hoàn thành điểm danh và điểm quá trình', icon: 'fa-clipboard-check',
                moTa: 'Tỷ lệ hoàn thành theo từng ngày sau khi kết thúc đợt học (10+T, tối đa 14 ngày)',
                ve: function (host, kq, api) {
                    var o = opts();
                    o.legend.labels.usePointStyle = true;
                    o.tooltips.callbacks = {
                        title: function (items, data) { return items && items.length ? 'Ngày theo dõi: ' + ((data && data.labels && data.labels[items[0].index]) || '') : ''; },
                        label: function (it, data) { return ((data.datasets[it.datasetIndex] || {}).label || '') + ': ' + fPct1(it.yLabel); },
                        afterBody: function () { return 'Tiến độ hoàn thành xác nhận điểm danh và điểm quá trình của các học phần'; } };
                    o.scales.yAxes[0].ticks.max = 100;
                    o.scales.yAxes[0].ticks.callback = function (v) { return v + '%'; };
                    o.scales.yAxes[0].scaleLabel = { display: true, labelString: 'Tỷ lệ hoàn thành (%)' };
                    o.scales.xAxes[0].scaleLabel = { display: true, labelString: 'Thời gian sau khi kết thúc đợt học (10+T)' };
                    api.bieuDo(host, 'line', kq.tienDo, o);
                } },
            { key: 'ketqua', rong: 2, tieuDe: 'Phân bổ tỷ lệ sinh viên theo kết quả học tập (theo khóa)', icon: 'fa-chart-column',
                moTa: 'Đúng lộ trình, học chậm, rủi ro cảnh báo học vụ (xác định theo A/B/C)',
                ve: function (host, kq, api) {
                    var o = opts();
                    o.legend = { display: true, position: 'top', labels: { fontSize: 12, fontStyle: 'bold', padding: 16, boxWidth: 14 } };
                    o.tooltips.callbacks = {
                        title: function (items, data) { return items && items.length ? 'Khóa: ' + (data.labels[items[0].index] || '') : ''; },
                        label: function (it, data) { return ((data.datasets[it.datasetIndex] || {}).label || '') + ': ' + fPct1(it.yLabel); } };
                    o.scales = { xAxes: [{ stacked: true, ticks: { fontColor: '#64748b' }, gridLines: { display: false } }],
                        yAxes: [{ stacked: true, ticks: { beginAtZero: true, max: 100, callback: function (v) { return v + '%'; }, fontColor: '#64748b' },
                            scaleLabel: { display: true, labelString: 'Tỷ lệ sinh viên (%)' }, gridLines: { color: 'rgba(0, 0, 0, 0.06)' } }] };
                    // gốc: plugin tự viết in "n%" màu trắng giữa mỗi đoạn cột, bỏ đoạn < 6%
                    o.plugins = { datalabels: { display: function (c) { var v = Number(c.dataset.data[c.dataIndex]); return isFinite(v) && v >= 6; },
                        color: '#ffffff', font: { weight: 'bold', size: 11 }, formatter: function (v) { return Math.round(v) + '%'; } } };
                    api.bieuDo(host, 'bar', kq.ketQua, o);
                } },
            { key: 'hoatdong', rong: 2, tieuDe: 'Hoạt động giáo vụ', icon: 'fa-list-check', moTa: 'Các hoạt động giáo vụ trong tháng',
                ve: function (host, kq, api) {
                    var o = opts();
                    o.scales = {};     // gốc: doughnut không dùng trục
                    api.bieuDo(host, 'doughnut', kq.hoatDong, o);
                } },
            { key: 'ruiro', rong: 2, bang: true, tieuDe: 'Danh sách rủi ro (chốt theo học kỳ)', icon: 'fa-triangle-exclamation',
                moTa: 'Top 5–7 lớp có Risk Score cao nhất để theo dõi và can thiệp kịp thời',
                ve: function (host, kq, api) {
                    host.innerHTML = '<div class="dbv-gvk-chu">' + api.badge('Cao: ≥80', 'bad') + api.badge('Trung bình: 50–79', 'warn') + api.badge('Thấp: <50', 'info') + '</div><div></div>';
                    var bang = host.lastChild;
                    api.bang(bang, [
                        { title: 'Lớp', width: '160px', render: function (r) { return '<b>' + esc(r.classCode) + '</b>'; } },
                        { title: 'Mức rủi ro', width: '180px', render: function (r) { return api.badge(r.level.text, TONE_MUC[r.level.key]); } },
                        { title: 'Risk Score', width: '120px', cls: 'is-center', render: function (r) { return '<b>' + esc(r.riskScore) + '</b>'; } },
                        { title: 'Nguyên nhân chính', render: function (r) { return esc(r.reasons.join(', ')); } },
                        { title: 'Xu hướng', width: '110px', cls: 'is-center', render: function (r) { return api.badge(r.trend.text, TONE_XU[r.trend.key]); } }], kq.ruiRo, {
                        rowCls: function (r) { return r.level.key === 'high' ? 'dbv-dong--bad' : r.level.key === 'medium' ? 'dbv-dong--warn' : ''; } });
                    Array.prototype.forEach.call(bang.querySelectorAll('tbody tr'), function (tr, i) { var r = kq.ruiRo[i]; if (r) tr.title = r.title; });
                } }]
    });
})();
