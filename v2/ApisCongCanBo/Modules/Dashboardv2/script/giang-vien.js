/* =========================================================================
   Dashboard Giảng viên — TRANG MẪU (cổng cán bộ). Khung chung ums.dbv2 (_dbv2.js).
   Bản gốc: ApisCongCanBo/Modules/Dashboardv2/html/giang-vien.html + script/giang-vien.js ("layout demo").
   Số liệu MẪU sinh bằng mã (baseMetrics + biến thiên theo bộ lọc) — gốc KHÔNG có lời gọi API ("chờ nối API").
   Phần tính số liệu chép NGUYÊN từ gốc: computeKpis, buildTeachingProgressWeekly, buildNormCompletion5Years,
   buildRiskList, buildStudentResultDistribution; cấu hình biểu đồ giữ dạng Chart.js 2 (khung tự đổi sang v4).
   Gốc có renderSchedule / renderQuickStats nhưng html KHÔNG có vùng đổ (đã bỏ khỏi layout) → không vẽ.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('dbv2-giang-vien');
    if (!root) return;
    var D = ums.dbv2, so = D.so, r1 = D.r1, pct = D.pct, fPct = D.fPct, clamp = D.clamp, hash = D.hash, huong = D.huong;

    var BASE = {
        current: { totalClasses: 8, onScheduleClasses: 7, onTimeGradeClasses: 6, taughtHoursStd: 98, normHoursStd: 90, totalStudents: 420, atRiskStudents: 8 },
        previous: { totalClasses: 8, onScheduleClasses: 6, onTimeGradeClasses: 7, taughtHoursStd: 80, normHoursStd: 90, totalStudents: 410, atRiskStudents: 12 },
        comparison: { deptAvgOnSchedulePct: 82.0, deptAvgOnTimeGradePct: 85.0, schoolRuleOnTimeGradePct: 90.0 }
    };

    function computeKpis(cur, prev, cmp) {
        function k(curPct, prevPct, sem) {
            var dir = huong(curPct - prevPct);
            return { dir: dir, change: D.xuHuong(D.tyLeDoi(curPct, prevPct), dir), sem: sem(dir, curPct) };
        }
        var p1c = pct(cur.onScheduleClasses, cur.totalClasses), p1p = pct(prev.onScheduleClasses, prev.totalClasses);
        var p2c = pct(cur.onTimeGradeClasses, cur.totalClasses), p2p = pct(prev.onTimeGradeClasses, prev.totalClasses);
        var p3c = pct(cur.taughtHoursStd, cur.normHoursStd), p3p = pct(prev.taughtHoursStd, prev.normHoursStd);
        var p4c = pct(cur.atRiskStudents, cur.totalStudents), p4p = pct(prev.atRiskStudents, prev.totalStudents);
        var tot = function (d) { return d === 'up' ? 'good' : d === 'down' ? 'bad' : 'neutral'; };
        var k1 = k(p1c, p1p, tot), k2 = k(p2c, p2p, tot), k3 = k(p3c, p3p, function (d, c) { return c >= 100 ? 'good' : 'warn'; });
        var k4 = k(p4c, p4p, function (d) { return d === 'up' ? 'bad' : d === 'down' ? 'good' : 'neutral'; });   // tăng là xấu
        return [
            { iconClass: 'fa-solid fa-calendar-check', label: 'Tỷ lệ lớp giảng dạy đúng tiến độ', value: fPct(p1c), change: k1.change, trendDirection: k1.dir,
                trendClass: k1.sem, color: 'green', subtext: 'So sánh kỳ trước: ' + fPct(p1p), tooltip: 'Mức độ bám sát tiến độ giảng dạy',
                timing: 'Realtime / Daily: Cập nhật ngay sau mỗi buổi học khi giảng viên xác nhận lên lớp.',
                details: ['% lớp đúng tiến độ = Số lớp đang dạy đúng tiến độ / Tổng số lớp đang phụ trách ×100', 'Kỳ trước: ' + fPct(p1p), 'TB khoa (mock): ' + fPct(so(cmp.deptAvgOnSchedulePct))] },
            { iconClass: 'fa-solid fa-clipboard-check', label: 'Tỷ lệ lớp nhập điểm đúng hạn', value: fPct(p2c), change: k2.change, trendDirection: k2.dir,
                trendClass: k2.sem, color: 'blue', subtext: 'So sánh kỳ trước: ' + fPct(p2p), tooltip: 'Mức độ tuân thủ kế hoạch nhập điểm',
                timing: 'Daily: Trong giai đoạn sau khi kết thúc môn học/đợt thi.',
                details: ['% lớp nhập điểm đúng hạn = Số lớp hoàn thành nhập điểm trước hạn / Tổng số lớp giảng viên phụ trách ×100', 'Kỳ trước: ' + fPct(p2p),
                    'Quy định (mock): ≥ ' + fPct(so(cmp.schoolRuleOnTimeGradePct))] },
            { iconClass: 'fa-solid fa-gauge-high', label: 'Tỷ lệ hoàn thành khối lượng giảng dạy', value: fPct(p3c), change: k3.change, trendDirection: k3.dir,
                trendClass: k3.sem, color: 'orange', subtext: 'Yêu cầu: ≥100%', tooltip: 'Mức độ hoàn thành định mức giảng dạy',
                timing: 'Hàng tháng / Học kỳ: Cập nhật lũy kế theo tiến độ giảng dạy thực tế.',
                details: ['% hoàn thành định mức = Khối lượng giảng dạy đã thực hiện / Định mức giảng dạy ×100', 'Khối lượng (giờ chuẩn): ' + so(cur.taughtHoursStd),
                    'Định mức (giờ chuẩn): ' + so(cur.normHoursStd), 'Kỳ trước: ' + fPct(p3p)] },
            { iconClass: 'fa-solid fa-triangle-exclamation', label: 'Tỷ lệ SV có nguy cơ không được dự thi', value: fPct(p4c), change: k4.change, trendDirection: k4.dir,
                trendClass: k4.sem, color: 'red', subtext: 'So sánh kỳ trước: ' + fPct(p4p), tooltip: 'Sinh viên có nguy cơ không đủ điều kiện dự thi',
                timing: 'Realtime / Weekly: Nhắc nhở SV ngay trong quá trình học.',
                details: ['% SV nguy cơ = Số SV có nguy cơ không đủ điều kiện dự thi / Tổng số SV lớp học ×100',
                    'SV nguy cơ (định nghĩa): điểm quá trình < 4 hoặc số buổi nghỉ vượt quá quy định', 'Kỳ trước: ' + fPct(p4p)] }
        ];
    }
    function tuanHoc(f) { var s = String(f.semester || ''); return s === 'HK3' ? 8 : (s === 'DOT1' || s === 'DOT2') ? 4 : 15; }
    function tienDo(f) {
        var weeks = tuanHoc(f), labels = [], plan = [], actual = [], seed = hash(JSON.stringify(f)), drift = (seed % 7) - 3, catchUp = (seed % 5) - 2;
        for (var w = 1; w <= weeks; w++) {
            labels.push(String(w));
            var p = (w / weeks) * 100, lag = Math.max(0, 8 - (w * (8 / Math.max(1, Math.floor(weeks / 2))))), wiggle = (((seed + w * 131) % 9) - 4) * 0.35;
            var a = p - lag + (w > Math.floor(weeks * 0.65) ? (catchUp * 1.2) : 0) + (drift * 0.6) + wiggle;
            plan.push(r1(clamp(p, 0, 100))); actual.push(r1(clamp(a, 0, 120)));
        }
        return { labels: labels, datasets: [
            { label: 'Kế hoạch', data: plan, borderColor: 'rgba(249, 115, 22, 1)', backgroundColor: 'rgba(249, 115, 22, 0)', borderWidth: 3, pointRadius: 3, pointHoverRadius: 5, tension: 0.35, fill: false },
            { label: 'Thực hiện', data: actual, borderColor: 'rgba(59, 130, 246, 1)', backgroundColor: 'rgba(59, 130, 246, 0)', borderWidth: 3, pointRadius: 3, pointHoverRadius: 5, borderDash: [6, 6], tension: 0.35, fill: false }] };
    }
    function trangThaiTienDo(a, p) { a = so(a); p = so(p); return a + 0.75 < p ? 'Chậm tiến độ' : a > p + 0.75 ? 'Vượt tiến độ' : 'Đúng tiến độ'; }
    function dinhMuc5Nam(f, cur) {
        var end = D.namBatDau(f.year), labels = [], hours = [], pc = [], seed = hash('norm5y|' + JSON.stringify(f));
        var baseNorm = Math.max(180, so(cur.normHoursStd, 270) * 3), baseHours = Math.max(150, so(cur.taughtHoursStd, 260) * 3);
        for (var i = 4; i >= 0; i--) {
            var y = end - i; labels.push(D.namHoc(y));
            var h = baseHours + (4 - i) * 6 + (((seed + y * 97) % 31) - 15), n = baseNorm + (((seed + y * 41) % 21) - 10);
            h = r1(clamp(h, 0, 9999)); n = Math.max(1, r1(clamp(n, 1, 9999)));
            hours.push(h); pc.push(r1((h / n) * 100));
        }
        return { labels: labels, datasets: [
            { type: 'bar', order: 1, label: 'Khối lượng đã thực hiện (giờ chuẩn)', data: hours, yAxisID: 'yHours', backgroundColor: 'rgba(59, 130, 246, 0.80)', borderColor: 'rgba(59, 130, 246, 1)', borderWidth: 1, barPercentage: 0.55, categoryPercentage: 0.72 },
            { type: 'line', label: 'Tỷ lệ so với định mức (%)', data: pc, yAxisID: 'yPct', borderColor: 'rgba(16, 185, 129, 1)', backgroundColor: 'rgba(16, 185, 129, 0)', borderWidth: 3, pointRadius: 3, pointHoverRadius: 5, tension: 0.25, fill: false }] };
    }
    function diemTre(d) { d = so(d); return d <= 0 ? { score: 0, reason: 'Giảng dạy đúng tiến độ' } : d >= 20 ? { score: 100, reason: 'Tiến độ dạy chậm, cần sắp xếp dạy bù ngay' } :
        d >= 10 ? { score: 70, reason: 'Cần dạy bù' } : d >= 5 ? { score: 40, reason: 'Tiến độ giảng dạy chậm' } : { score: 0, reason: 'Giảng dạy đúng tiến độ' }; }
    function diemThieu(m) { m = so(m); return m < 20 ? { score: 0, reason: 'Nhập điểm đúng hạn' } : m >= 70 ? { score: 100, reason: 'Rất chậm nhập điểm' } :
        m >= 40 ? { score: 70, reason: 'Chậm hạn nhập điểm' } : { score: 40, reason: 'Chậm nhập điểm' }; }
    function mucRuiRo(s) { s = so(s); return s >= 80 ? { level: 'Cao', tone: 'bad', icon: 'fa-circle-exclamation' } : s >= 50 ? { level: 'Trung bình', tone: 'warn', icon: 'fa-circle-exclamation' } : { level: 'Thấp', tone: 'info', icon: 'fa-circle-check' }; }
    function ruiRo(f) {
        var weeks = tuanHoc(f), statWeek = Math.max(1, Math.min(weeks, 10) - 1), planPct = (statWeek / weeks) * 100, seed = hash('risk|' + JSON.stringify(f));
        var names = ['Tin học văn phòng-1-1-25(N01.TH1)', 'Tin học văn phòng-1-1-25(N01.TH8)', 'Cơ sở dữ liệu-2-3-25(CSDL.02)', 'Lập trình Web-1-2-25(WEB.01)',
            'Mạng máy tính-2-2-25(MMT.03)', 'Trí tuệ nhân tạo-1-3-25(AI.01)'];
        return names.map(function (nm) {
            var cs = hash(seed + '|' + nm), actual = clamp(planPct + ((cs % 41) - 20), 0, 120), delay = Math.max(0, r1(planPct - actual));
            var missing = r1(clamp(((cs % 101) * 0.95), 0, 100)), a = diemTre(delay), b = diemThieu(missing), score = r1(a.score * 0.5 + b.score * 0.5);
            var ly = a.score > b.score ? [a.reason] : b.score > a.score ? [b.reason] : [a.reason, b.reason];
            return { className: nm, statWeek: statWeek, delayPct: delay, missingPct: missing, scoreA: a.score, scoreB: b.score, riskScore: score, reasons: ly };
        }).sort(function (x, y) { return so(y.riskScore) - so(x.riskScore); });
    }
    function phanLoaiKQ(f) {
        var end = D.namBatDau(f.year), prev = end - 1;
        var terms = [{ s: 'HK1', y: prev }, { s: 'HK2', y: prev }, { s: 'HK1', y: end }, { s: 'HK2', y: end }];
        var seed = hash('dist|' + JSON.stringify(f)), totals = [], c = [[], [], [], [], []];
        terms.forEach(function (t, i) {
            var ts = hash(seed + '|' + t.s + '|' + t.y), trend = i * 1.2;
            totals.push(280 + (ts % 121));
            var xs = clamp(6 + (ts % 5) + trend * 0.6, 3, 15), gioi = clamp(24 + (ts % 9) + trend, 15, 40), kha = clamp(28 + ((ts >> 3) % 10) + trend * 0.2, 18, 45);
            var tb = clamp(22 + ((ts >> 5) % 7) - trend * 0.6, 10, 35), yeu = clamp(100 - (xs + gioi + kha + tb), 3, 20), sum = xs + gioi + kha + tb + yeu;
            xs = xs / sum * 100; gioi = gioi / sum * 100; kha = kha / sum * 100; tb = tb / sum * 100; yeu = 100 - (xs + gioi + kha + tb);
            [xs, gioi, kha, tb, yeu].forEach(function (v, j) { c[j].push(r1(v)); });
        });
        var MAU = [['Xuất sắc', '168, 85, 247'], ['Giỏi', '59, 130, 246'], ['Khá', '245, 158, 11'], ['Trung bình', '16, 185, 129'], ['Yếu kém', '239, 68, 68']];
        return { totals: totals, labels: terms.map(function (t) { return [t.s, String(t.y).slice(-2) + '-' + String(t.y + 1).slice(-2)]; }),
            datasets: MAU.map(function (m, j) { return { label: m[0], data: c[j], backgroundColor: 'rgba(' + m[1] + ', 0.80)', borderColor: 'rgba(' + m[1] + ', 1)', borderWidth: 1 }; }) };
    }

    var COMMON = { legend: { display: true, position: 'top', labels: { fontSize: 12, fontStyle: 'bold', padding: 16 } },
        tooltips: { backgroundColor: 'rgba(255, 255, 255, 0.96)', titleFontColor: '#0f172a', bodyFontColor: '#334155', borderColor: '#e2e8f0', borderWidth: 1, xPadding: 12, yPadding: 10, cornerRadius: 8 } };
    function opts(extra) { return Object.assign({}, JSON.parse(JSON.stringify(COMMON)), extra); }

    D.man(root, {
        tieuDe: 'Dashboard Giảng viên', moTa: '📚 Quản lý giảng dạy và nghiên cứu khoa học (layout demo)', icon: 'fa-solid fa-chalkboard-user', nguon: 'Hệ thống GV',
        loc: [
            { key: 'year', label: 'Năm học', items: [{ value: '2023-2024', text: '2023 - 2024' }, { value: '2024-2025', text: '2024 - 2025' }, { value: '2025-2026', text: '2025 - 2026' }] },
            { key: 'semester', label: 'Học kỳ / Đợt thi', items: [{ value: 'ALL', text: 'Tất cả' }, { value: 'HK1', text: 'Học kỳ 1' }, { value: 'HK2', text: 'Học kỳ 2' },
                { value: 'HK3', text: 'Học kỳ hè' }, { value: 'DOT1', text: 'Đợt thi 1' }, { value: 'DOT2', text: 'Đợt thi 2' }] },
            { key: 'level', label: 'Bậc đào tạo', items: [{ value: 'ALL', text: 'Tất cả' }, { value: 'DH', text: 'Đại học' }, { value: 'THS', text: 'Thạc sĩ' }, { value: 'TS', text: 'Tiến sĩ' }] },
            { key: 'unit', label: 'Đơn vị', items: [{ value: 'ALL', text: 'Toàn trường' }, { value: 'KHOA', text: 'Theo Khoa' }, { value: 'NGANH', text: 'Theo Ngành/CTĐT' }] }],
        macDinh: { year: '2025-2026', semester: 'HK1', level: 'DH', unit: 'ALL' },
        tinh: function (f) {
            var cur = JSON.parse(JSON.stringify(BASE.current)), prev = BASE.previous, shift = 0;
            shift += f.semester === 'HK2' ? 1 : 0; shift += f.semester === 'DOT1' ? -1 : 0; shift += f.level === 'THS' ? -1 : 0;
            shift += f.level === 'TS' ? -2 : 0; shift += f.unit === 'KHOA' ? 1 : 0; shift += f.unit === 'NGANH' ? -1 : 0;
            cur.onScheduleClasses = Math.max(0, cur.onScheduleClasses + shift);
            cur.onTimeGradeClasses = Math.max(0, cur.onTimeGradeClasses + (shift >= 0 ? 0 : shift));
            cur.taughtHoursStd = Math.max(0, cur.taughtHoursStd + shift * 4);
            cur.atRiskStudents = Math.max(0, cur.atRiskStudents + (shift < 0 ? 2 : -1));
            return { kpis: computeKpis(cur, prev, BASE.comparison), tienDo: tienDo(f), dinhMuc: dinhMuc5Nam(f, cur), ruiRo: ruiRo(f), kq: phanLoaiKQ(f) };
        },
        the: [
            { key: 'ruiro', rong: 2, bang: true, tieuDe: 'Danh sách rủi ro (chốt theo học kỳ)', icon: 'fa-triangle-exclamation',
                moTa: 'Các lớp học phần có nguy cơ chậm tiến độ hoặc chưa nhập đủ điểm quá trình',
                ve: function (host, kq, api) {
                    api.bang(host, [
                        { title: 'Tên lớp học phần', render: function (r) { return '<b>' + ums.ui.esc(r.className) + '</b>'; } },
                        { title: 'Mức rủi ro', cls: 'is-center', width: '160px', render: function (r) { var m = mucRuiRo(r.riskScore); return api.badge(m.level, m.tone); } },
                        { title: 'Nguyên nhân chính', render: function (r) { return ums.ui.esc(r.reasons.join(', ') || '—'); } }], kq.ruiRo, {
                        rowCls: function (r) { var m = mucRuiRo(r.riskScore); return m.tone === 'bad' ? 'dbv-dong--bad' : m.tone === 'warn' ? 'dbv-dong--warn' : ''; } });
                    Array.prototype.forEach.call(host.querySelectorAll('tbody tr'), function (tr, i) {
                        var r = kq.ruiRo[i]; if (!r) return;
                        tr.title = 'Risk Score: ' + r1(r.riskScore).toFixed(1) + '\nA (Tiến độ dạy chậm): ' + r1(r.delayPct).toFixed(1) + '% (score ' + r.scoreA + ')' +
                            '\nB (% thiếu điểm): ' + r1(r.missingPct).toFixed(1) + '% (score ' + r.scoreB + ')\nTuần thống kê: ' + r.statWeek;
                    });
                } },
            { key: 'tiendo', tieuDe: 'Tiến độ giảng dạy của học phần theo từng tuần', icon: 'fa-clock', moTa: 'Tỷ lệ hoàn thành giảng dạy (%) theo tuần (Kế hoạch vs Thực hiện)',
                ve: function (host, kq, api) {
                    api.bieuDo(host, 'line', kq.tienDo, opts({
                        scales: { yAxes: [{ ticks: { beginAtZero: true, min: 0, max: 120, callback: function (v) { return v + '%'; }, fontColor: '#64748b' }, gridLines: { color: 'rgba(0, 0, 0, 0.05)' } }],
                            xAxes: [{ ticks: { fontColor: '#64748b' }, gridLines: { display: false }, scaleLabel: { display: true, labelString: 'Tuần học' } }] },
                        tooltips: Object.assign({}, COMMON.tooltips, { mode: 'index', intersect: false, callbacks: {
                            title: function (items) { return items.length ? 'Tuần ' + items[0].label : ''; },
                            label: function (it, data) { return (data.datasets[it.datasetIndex].label || '') + ': ' + r1(it.yLabel).toFixed(1) + '%'; },
                            afterBody: function (items, data) { if (!items.length) return; var i = items[0].index; return ['Trạng thái: ' + trangThaiTienDo(data.datasets[1].data[i], data.datasets[0].data[i])]; } } })
                    }));
                } },
            { key: 'dinhmuc', tieuDe: 'Mức độ hoàn thành khối lượng giảng dạy theo năm học', icon: 'fa-star',
                moTa: 'Giờ chuẩn thực hiện (cột) & tỷ lệ hoàn thành định mức % (đường) trong 5 năm gần nhất',
                ve: function (host, kq, api) {
                    api.bieuDo(host, 'bar', kq.dinhMuc, opts({
                        scales: { yAxes: [
                            { id: 'yHours', position: 'left', ticks: { beginAtZero: true, fontColor: '#64748b' }, gridLines: { color: 'rgba(0, 0, 0, 0.05)' }, scaleLabel: { display: true, labelString: 'Giờ chuẩn' } },
                            { id: 'yPct', position: 'right', ticks: { beginAtZero: true, min: 0, max: 140, callback: function (v) { return v + '%'; }, fontColor: '#64748b' },
                                gridLines: { drawOnChartArea: false }, scaleLabel: { display: true, labelString: 'Tỷ lệ % so với định mức' } }],
                            xAxes: [{ ticks: { fontColor: '#64748b' }, gridLines: { display: false }, scaleLabel: { display: true, labelString: 'Năm học' } }] },
                        tooltips: Object.assign({}, COMMON.tooltips, { mode: 'index', intersect: false, callbacks: {
                            label: function (it, data) { var ds = data.datasets[it.datasetIndex]; return (ds.label || '') + ': ' + r1(it.yLabel).toFixed(1) + (ds.yAxisID === 'yPct' ? '%' : ''); },
                            afterBody: function (items, data) { if (!items.length) return; return ['Trạng thái: ' + (so(data.datasets[1].data[items[0].index]) >= 100 ? 'Hoàn thành định mức' : 'Chưa đạt định mức')]; } } })
                    }));
                } },
            { key: 'ketqua', rong: 2, tieuDe: 'Phân loại kết quả học tập theo học kỳ / năm học', icon: 'fa-flask', moTa: 'Tỷ lệ sinh viên (%) theo thang điểm TKHP (Xuất sắc → Yếu kém)',
                ve: function (host, kq, api) {
                    var tong = kq.kq.totals;
                    api.bieuDo(host, 'bar', kq.kq, opts({
                        scales: { yAxes: [{ ticks: { beginAtZero: true, min: 0, max: 100, callback: function (v) { return v + '%'; }, fontColor: '#64748b' }, gridLines: { color: 'rgba(0, 0, 0, 0.05)' },
                            scaleLabel: { display: true, labelString: 'Tỷ lệ sinh viên (%)' } }],
                            xAxes: [{ ticks: { fontColor: '#64748b' }, gridLines: { display: false }, scaleLabel: { display: true, labelString: 'Học kỳ / Năm học' } }] },
                        tooltips: Object.assign({}, COMMON.tooltips, { mode: 'index', intersect: false, callbacks: {
                            label: function (it, data) { var p = r1(it.yLabel); return (data.datasets[it.datasetIndex].label || '') + ': ' + p.toFixed(1) + '% (' + Math.round(so(tong[it.index]) * p / 100) + ' SV)'; },
                            afterBody: function (items) { if (!items.length) return; return ['Tổng SV: ' + so(tong[items[0].index])]; } } })
                    }));
                } }]
    });
})();
