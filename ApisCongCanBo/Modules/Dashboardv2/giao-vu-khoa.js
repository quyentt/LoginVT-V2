function DashboardGiaoVuKhoa() {
    var self = this;

    this.charts = {
        teacherAssignmentChart: null,
        gradingProgressChart: null,
        activityChart: null
    };

    this.defaultFilters = {
        schoolYear: 'ALL',
        termExam: 'ALL',
        educationLevel: 'ALL'
    };

    this.currentFilters = {
        schoolYear: this.defaultFilters.schoolYear,
        termExam: this.defaultFilters.termExam,
        educationLevel: this.defaultFilters.educationLevel
    };

    this.filterOptions = {
        schoolYears: [
            { value: 'ALL', text: 'Tất cả năm học' },
            { value: '2023-2024', text: '2023 - 2024' },
            { value: '2024-2025', text: '2024 - 2025' },
            { value: '2025-2026', text: '2025 - 2026' }
        ],
        termExams: [
            { value: 'ALL', text: 'Tất cả học kỳ/đợt thi' },
            { value: 'HK1', text: 'Học kỳ 1' },
            { value: 'HK2', text: 'Học kỳ 2' },
            { value: 'HE', text: 'Học kỳ hè' },
            { value: 'THI_GK', text: 'Đợt thi giữa kỳ' },
            { value: 'THI_CK', text: 'Đợt thi cuối kỳ' }
        ],
        educationLevels: [
            { value: 'ALL', text: 'Tất cả bậc đào tạo' },
            { value: 'DH', text: 'Đại học' },
            { value: 'ThS', text: 'Thạc sĩ' },
            { value: 'TS', text: 'Tiến sĩ' }
        ]
    };

    this.stats = [];
    this.quickStats = [];
    this.riskItems = [];

    this.chartData = {
        teacherAssignmentChart: {
            labels: [],
            datasets: []
        },
        gradingProgressChart: {
            labels: [],
            datasets: []
        },
        activityChart: {
            labels: [],
            datasets: []
        }
    };

    this.toNumber = function (x, fallback) {
        if (fallback === undefined) fallback = 0;
        var n = Number(x);
        return isFinite(n) ? n : fallback;
    };

    this.round1 = function (v) {
        var n = self.toNumber(v, 0);
        return Math.round(n * 10) / 10;
    };

    this.round0 = function (v) {
        var n = self.toNumber(v, 0);
        return Math.round(n);
    };

    this.formatInt = function (n) {
        var x = self.round0(n);
        try {
            return x.toLocaleString('vi-VN');
        } catch (e) {
            return String(x);
        }
    };

    this.formatPct1 = function (v) {
        return self.round1(v).toFixed(1) + '%';
    };

    this.safePct = function (num, den) {
        var d = self.toNumber(den, 0);
        if (d <= 0) return 0;
        return (self.toNumber(num, 0) / d) * 100;
    };

    this.safeTrendPct = function (currentValue, previousValue) {
        var prev = self.toNumber(previousValue, 0);
        if (prev === 0) return 0;
        return ((self.toNumber(currentValue, 0) - prev) / prev) * 100;
    };

    this.hashString = function (s) {
        var str = String(s || '');
        var h = 0;
        for (var i = 0; i < str.length; i++) {
            h = ((h << 5) - h) + str.charCodeAt(i);
            h |= 0;
        }
        return Math.abs(h);
    };

    this.init = function () {
        self.updateMeta();
        self.renderFilters();
        self.bindEvents();
        self.updateDataByFilters(self.currentFilters);
        self.renderStatsCards();
        self.renderQuickStats();
        self.renderRiskList();
        self.initCharts();
    };

    this.updateMeta = function () {
        var now = new Date();
        var pad = function (n) { return (n < 10 ? '0' : '') + n; };
        var t = pad(now.getDate()) + '/' + pad(now.getMonth() + 1) + '/' + now.getFullYear() + ' ' + pad(now.getHours()) + ':' + pad(now.getMinutes());

        var lastUpdate = document.getElementById('lastUpdateTime');
        if (lastUpdate) lastUpdate.textContent = t;

        var status = document.getElementById('systemStatus');
        if (status) status.textContent = 'Sẵn sàng';
    };

    this.fillSelect = function (id, items, selectedValue) {
        var el = document.getElementById(id);
        if (!el) return;
        el.innerHTML = (items || []).map(function (x) {
            var selected = (x.value === selectedValue ? ' selected' : '');
            return '<option value="' + x.value + '"' + selected + '>' + x.text + '</option>';
        }).join('');
    };

    this.renderFilters = function () {
        self.fillSelect('schoolYearFilter', self.filterOptions.schoolYears, self.currentFilters.schoolYear);
        self.fillSelect('termExamFilter', self.filterOptions.termExams, self.currentFilters.termExam);
        self.fillSelect('educationLevelFilter', self.filterOptions.educationLevels, self.currentFilters.educationLevel);
    };

    this.getFiltersFromUI = function () {
        var schoolYear = document.getElementById('schoolYearFilter');
        var termExam = document.getElementById('termExamFilter');
        var educationLevel = document.getElementById('educationLevelFilter');
        return {
            schoolYear: schoolYear ? schoolYear.value : self.currentFilters.schoolYear,
            termExam: termExam ? termExam.value : self.currentFilters.termExam,
            educationLevel: educationLevel ? educationLevel.value : self.currentFilters.educationLevel
        };
    };

    this.setFiltersToUI = function (filters) {
        var schoolYear = document.getElementById('schoolYearFilter');
        if (schoolYear) schoolYear.value = filters.schoolYear;

        var termExam = document.getElementById('termExamFilter');
        if (termExam) termExam.value = filters.termExam;

        var educationLevel = document.getElementById('educationLevelFilter');
        if (educationLevel) educationLevel.value = filters.educationLevel;
    };

    this.bindEvents = function () {
        var btnApply = document.getElementById('btnFilterApply');
        if (btnApply) {
            btnApply.addEventListener('click', function () {
                self.currentFilters = self.getFiltersFromUI();
                self.updateDataByFilters(self.currentFilters);
                self.renderStatsCards();
                self.renderQuickStats();
                self.renderRiskList();
                self.initCharts();
            });
        }

        var btnReset = document.getElementById('btnFilterReset');
        if (btnReset) {
            btnReset.addEventListener('click', function () {
                self.currentFilters = {
                    schoolYear: self.defaultFilters.schoolYear,
                    termExam: self.defaultFilters.termExam,
                    educationLevel: self.defaultFilters.educationLevel
                };
                self.setFiltersToUI(self.currentFilters);
                self.updateDataByFilters(self.currentFilters);
                self.renderStatsCards();
                self.renderQuickStats();
                self.renderRiskList();
                self.initCharts();
            });
        }
    };

    this.updateDataByFilters = function (filters) {
        // Pipeline: sau này nối API ở đây.
        // Hiện tại dùng mock data + biến thiên nhẹ theo filter.
        var seed = self.hashString(JSON.stringify(filters || {}));
        var shift = (seed % 7) - 3;

        // === KPI (mock theo filter) ===
        // KPI 1: % lớp học phần đã phân công giảng viên
        var totalOpenClasses = Math.max(0, 120 + shift * 6);
        var assignedTeacherClasses = Math.max(0, Math.min(totalOpenClasses, 92 + shift * 5));
        var pctAssignedTeacher = self.safePct(assignedTeacherClasses, totalOpenClasses);

        var prevTotalOpenClasses = Math.max(0, 118 + (shift - 1) * 6);
        var prevAssignedTeacherClasses = Math.max(0, Math.min(prevTotalOpenClasses, 88 + (shift - 1) * 5));
        var prevPctAssignedTeacher = self.safePct(prevAssignedTeacherClasses, prevTotalOpenClasses);
        var trendAssignedTeacher = self.safeTrendPct(pctAssignedTeacher, prevPctAssignedTeacher);

        // KPI 2: % lớp hoàn thành xác nhận điểm danh + điểm QT đúng hạn
        var totalNeedConfirm = Math.max(0, 110 + shift * 4);
        var onTimeConfirmed = Math.max(0, Math.min(totalNeedConfirm, 86 + shift * 4));
        var pctOnTime = self.safePct(onTimeConfirmed, totalNeedConfirm);

        var prevTotalNeedConfirm = Math.max(0, 108 + (shift - 1) * 4);
        var prevOnTimeConfirmed = Math.max(0, Math.min(prevTotalNeedConfirm, 84 + (shift - 1) * 4));
        var prevPctOnTime = self.safePct(prevOnTimeConfirmed, prevTotalNeedConfirm);
        var trendOnTime = self.safeTrendPct(pctOnTime, prevPctOnTime);

        // KPI 3: % ca thi đã phân công cán bộ coi thi
        var totalExamSessions = Math.max(0, 60 + shift * 3);
        var assignedProctors = Math.max(0, Math.min(totalExamSessions, 44 + shift * 3));
        var pctProctorAssigned = self.safePct(assignedProctors, totalExamSessions);

        var prevTotalExamSessions = Math.max(0, 58 + (shift - 1) * 3);
        var prevAssignedProctors = Math.max(0, Math.min(prevTotalExamSessions, 42 + (shift - 1) * 3));
        var prevPctProctorAssigned = self.safePct(prevAssignedProctors, prevTotalExamSessions);
        var trendProctorAssigned = self.safeTrendPct(pctProctorAssigned, prevPctProctorAssigned);

        // KPI 4: tổng số SV khoa
        var totalStudents = Math.max(0, 2450 + shift * 25);
        var prevTotalStudents = Math.max(0, 2420 + (shift - 1) * 25);
        var trendStudents = self.safeTrendPct(totalStudents, prevTotalStudents);

        var trendClass = function (trendPct, mode) {
            // mode: 'goodUp' => up green, down red
            // mode: 'students' => up green, down yellow
            if (Math.abs(trendPct) < 0.05) return 'stable';
            if (trendPct > 0) return 'up';
            if (mode === 'students') return 'warn';
            return 'down';
        };

        var trendText = function (trendPct) {
            var v = self.round1(trendPct);
            if (Math.abs(v) < 0.05) return '0.0%';
            return (v > 0 ? '+' : '') + v.toFixed(1) + '%';
        };

        self.stats = [
            {
                iconClass: 'fa-solid fa-chalkboard-user',
                label: 'Tỷ lệ lớp HP đã phân công GV',
                value: self.formatPct1(pctAssignedTeacher),
                change: trendText(trendAssignedTeacher),
                subtext: 'So với kỳ trước',
                trend: trendClass(trendAssignedTeacher, 'goodUp'),
                color: 'pink',
                tooltip: 'Mức độ hoàn thành phân công giảng viên giảng dạy. Cập nhật Realtime/Daily (quan trọng 2-4 tuần trước khi học kỳ bắt đầu).'
            },
            {
                iconClass: 'fa-solid fa-clipboard-check',
                label: 'Tỷ lệ lớp xác nhận đúng hạn',
                value: self.formatPct1(pctOnTime),
                change: trendText(trendOnTime),
                subtext: 'So với kỳ trước',
                trend: trendClass(trendOnTime, 'goodUp'),
                color: 'green',
                tooltip: 'Mức độ tuân thủ kế hoạch nhập điểm và xác nhận điểm danh. Cập nhật Hàng ngày (trong suốt quá trình giảng dạy và ngay sau khi kết thúc môn học).'
            },
            {
                iconClass: 'fa-solid fa-user-shield',
                label: 'Tỷ lệ ca thi đã phân công CBCT',
                value: self.formatPct1(pctProctorAssigned),
                change: trendText(trendProctorAssigned),
                subtext: 'So với kỳ trước',
                trend: trendClass(trendProctorAssigned, 'goodUp'),
                color: 'orange',
                tooltip: 'Mức độ hoàn thành phân công cán bộ coi thi. Cập nhật Realtime/Daily (cao điểm 1-2 tuần trước đợt thi).'
            },
            {
                iconClass: 'fa-solid fa-users',
                label: 'Tổng số sinh viên của khoa',
                value: self.formatInt(totalStudents),
                change: trendText(trendStudents),
                subtext: 'So với kỳ/năm trước',
                trend: trendClass(trendStudents, 'students'),
                color: 'blue',
                tooltip: 'Quy mô sinh viên của khoa. Chốt theo học kỳ sau khi kết thúc đăng ký học phần và đóng học phí.'
            }
        ];

        self.quickStats = [
            { label: 'Số học phần', value: String(156 + shift * 2) },
            { label: 'Số lớp đang theo dõi', value: String(Math.max(0, 85 + shift)) },
            { label: 'Đợt/kỳ có dữ liệu', value: (filters && filters.termExam && filters.termExam !== 'ALL') ? '1' : 'Nhiều' },
            { label: 'Tỷ lệ hoàn thành nhập liệu', value: self.round1(98.5 + shift * 0.1).toFixed(1) + '%' }
        ];

        self.chartData.teacherAssignmentChart = self.buildTeacherAssignmentProgressChart(filters);
        self.chartData.gradingProgressChart = self.buildGradingProgressChart(filters);
        self.chartData.activityChart = self.buildActivityChart(filters);

        self.riskItems = self.buildRiskList(filters);

        var status = document.getElementById('systemStatus');
        if (status) {
            status.textContent = 'Sẵn sàng';
            status.title = 'Filters: ' + JSON.stringify(filters);
        }
    };

    this.seeded01 = function (seed) {
        // deterministic pseudo-random [0,1)
        var x = Math.sin(seed * 9999.123) * 10000;
        return x - Math.floor(x);
    };

    this.randBetween = function (seed, min, max) {
        var r = self.seeded01(seed);
        return min + (max - min) * r;
    };

    this.normalizePct = function (pct, kind) {
        // pct: % kích hoạt rủi ro
        // kind: 'A'|'B'|'C' for reason text
        var p = self.toNumber(pct, 0);
        var score = 0;
        var reason = '';

        if (p < 5) score = 0;
        else if (p < 10) score = 40;
        else if (p < 20) score = 70;
        else score = 100;

        if (kind === 'A') {
            if (p < 5) reason = 'Tiến độ tín chỉ ≥ lộ trình chuẩn, học nhanh';
            else if (p < 10) reason = 'Tiến độ tín chỉ sát chuẩn, đúng tiến độ';
            else if (p < 20) reason = 'Nhiều SV học chậm so với chuẩn';
            else reason = 'Rất nhiều SV học chậm so với lộ trình, nguy cơ kéo dài thời gian học tập';
        } else if (kind === 'B') {
            if (p < 5) reason = 'Phần lớn SV hoàn thành học phần đăng ký';
            else if (p < 10) reason = 'Có SV còn nợ môn';
            else if (p < 20) reason = 'Nhiều học phần học chưa qua, cần có kế hoạch học lại';
            else reason = 'Nguy cơ học chậm';
        } else if (kind === 'C') {
            if (p < 5) reason = 'GPA tích lũy tốt';
            else if (p < 10) reason = 'GPA tích lũy chấp nhận';
            else if (p < 20) reason = 'Nhiều SV có GPA thấp, nguy cơ cảnh báo học vụ';
            else reason = 'Rất nhiều SV có GPA thấp, nguy cơ cao bị cảnh báo / buộc thôi học';
        }

        return { pct: self.round1(p), score: score, reason: reason };
    };

    this.getRiskLevel = function (riskScore) {
        var s = self.toNumber(riskScore, 0);
        if (s >= 80) return { key: 'high', text: 'Cao' };
        if (s >= 50) return { key: 'medium', text: 'Trung bình' };
        return { key: 'low', text: 'Thấp' };
    };

    this.getPrevTermExam = function (termExam) {
        // fallback đơn giản: HK2 -> HK1, HK1 -> HK2, others -> HK1
        if (termExam === 'HK2') return 'HK1';
        if (termExam === 'HK1') return 'HK2';
        if (termExam === 'HE') return 'HK2';
        if (termExam === 'THI_CK') return 'HK2';
        if (termExam === 'THI_GK') return 'HK1';
        return 'HK1';
    };

    this.getTrend = function (currentScore, previousScore) {
        var delta = self.toNumber(currentScore, 0) - self.toNumber(previousScore, 0);
        var abs = Math.abs(delta);
        if (abs < 5) return { key: 'stable', text: '→', delta: delta };
        if (delta >= 10) return { key: 'upStrong', text: '↑↑', delta: delta };
        if (delta >= 5) return { key: 'up', text: '↑', delta: delta };
        if (delta <= -10) return { key: 'downStrong', text: '↓↓', delta: delta };
        return { key: 'down', text: '↓', delta: delta };
    };

    this.buildRiskList = function (filters) {
        // Top 5-7 lớp có Risk Score cao nhất (mock theo filter)
        var f = filters || self.currentFilters;
        var baseSeed = self.hashString('risk|' + JSON.stringify(f || {}));

        var prevFilters = {
            schoolYear: f.schoolYear,
            termExam: (f.termExam && f.termExam !== 'ALL') ? self.getPrevTermExam(f.termExam) : 'HK1',
            educationLevel: f.educationLevel
        };
        var prevSeedBase = self.hashString('riskPrev|' + JSON.stringify(prevFilters || {}));

        var classes = [
            'K15_CNTT01', 'K15_CNTT02', 'K15_ATTT01',
            'K16_CNTT01', 'K16_ATTT02', 'K16_MKT01',
            'K17_CNTT01', 'K17_CNTT02', 'K17_KT01',
            'K18_CNTT01', 'K18_ATTT01', 'K18_KT02'
        ];

        var items = classes.map(function (classCode, idx) {
            var seed = baseSeed + self.hashString(classCode) + idx * 31;
            var seedPrev = prevSeedBase + self.hashString(classCode) + idx * 29;

            // generate % for A/B/C (0..30), correlated slightly
            var aPct = self.randBetween(seed + 1, 0, 28);
            var bPct = self.randBetween(seed + 2, 0, 26);
            var cPct = self.randBetween(seed + 3, 0, 24);
            // correlate: if A high, B/C can drift up
            bPct = Math.min(30, bPct + Math.max(0, (aPct - 12) * 0.25));
            cPct = Math.min(30, cPct + Math.max(0, (bPct - 10) * 0.20));

            var A = self.normalizePct(aPct, 'A');
            var B = self.normalizePct(bPct, 'B');
            var C = self.normalizePct(cPct, 'C');

            var riskScore = self.round0(A.score * 0.40 + B.score * 0.30 + C.score * 0.30);
            var level = self.getRiskLevel(riskScore);

            // previous term
            var aPrev = self.randBetween(seedPrev + 1, 0, 28);
            var bPrev = self.randBetween(seedPrev + 2, 0, 26);
            var cPrev = self.randBetween(seedPrev + 3, 0, 24);
            bPrev = Math.min(30, bPrev + Math.max(0, (aPrev - 12) * 0.25));
            cPrev = Math.min(30, cPrev + Math.max(0, (bPrev - 10) * 0.20));
            var A0 = self.normalizePct(aPrev, 'A');
            var B0 = self.normalizePct(bPrev, 'B');
            var C0 = self.normalizePct(cPrev, 'C');
            var prevRisk = self.round0(A0.score * 0.40 + B0.score * 0.30 + C0.score * 0.30);
            var trend = self.getTrend(riskScore, prevRisk);

            // main reasons (pick 1-2)
            var parts = [
                { key: 'A', weight: 0.40, points: A.score * 0.40, reason: A.reason, score: A.score },
                { key: 'B', weight: 0.30, points: B.score * 0.30, reason: B.reason, score: B.score },
                { key: 'C', weight: 0.30, points: C.score * 0.30, reason: C.reason, score: C.score }
            ].sort(function (x, y) { return y.points - x.points; });

            var reasons = [];
            if (parts[0].score > 0) reasons.push(parts[0].reason);
            if (parts[1].score > 0 && parts[1].points >= parts[0].points * 0.8) reasons.push(parts[1].reason);
            if (!reasons.length) reasons.push('Rủi ro thấp, các chỉ số ổn định');

            var title = ''
                + 'A (40%): ' + A.pct + '% → ' + A.score + '\n'
                + 'B (30%): ' + B.pct + '% → ' + B.score + '\n'
                + 'C (30%): ' + C.pct + '% → ' + C.score + '\n'
                + 'Risk Score = ' + riskScore + ' (0-100)';

            return {
                classCode: classCode,
                riskScore: riskScore,
                level: level,
                reasons: reasons,
                trend: trend,
                title: title
            };
        });

        items.sort(function (a, b) { return b.riskScore - a.riskScore; });
        return items.slice(0, 7);
    };

    this.renderRiskList = function () {
        var tbody = document.getElementById('riskClassTableBody');
        if (!tbody) return;

        var rows = (self.riskItems || []).map(function (x) {
            var reasons = (x.reasons || []).join(', ');
            var levelKey = (x.level && x.level.key) ? x.level.key : 'low';
            var levelText = (x.level && x.level.text) ? x.level.text : 'Thấp';
            var trendKey = (x.trend && x.trend.key) ? x.trend.key : 'stable';
            var trendText = (x.trend && x.trend.text) ? x.trend.text : '→';
            var trClass = 'gvk-risk-row ' + levelKey;

            return ''
                + '<tr class="' + trClass + '" title="' + String(x.title || '').replace(/\"/g, '&quot;') + '">'
                +   '<td><strong>' + x.classCode + '</strong></td>'
                +   '<td><span class="gvk-risk-pill ' + levelKey + '"><span class="dot"></span>' + levelText + '</span></td>'
                +   '<td class="gvk-risk-score">' + x.riskScore + '</td>'
                +   '<td class="gvk-risk-reason">' + reasons + '</td>'
                +   '<td><span class="gvk-risk-trend ' + trendKey + '">' + trendText + '</span></td>'
                + '</tr>';
        }).join('');

        tbody.innerHTML = rows;
    };

    this.renderStatsCards = function () {
        var container = document.getElementById('statsCards');
        if (!container) return;

        container.innerHTML = (self.stats || []).map(function (s) {
            var trendKey = (s.trend || 'stable');
            var trendIcon = (trendKey === 'up' ? 'fa-arrow-up' : (trendKey === 'down' || trendKey === 'warn' ? 'fa-arrow-down' : 'fa-minus'));
            var titleAttr = (s.tooltip ? ' title="' + String(s.tooltip).replace(/\"/g, '&quot;') + '"' : '');
            return ''
                + '<div class="gvk-stat-card ' + (s.color || 'pink') + '"' + titleAttr + '>'
                +   '<div class="gvk-stat-header">'
                +     '<div class="gvk-stat-icon"><i class="' + (s.iconClass || 'fa-solid fa-circle') + '"></i></div>'
                +     '<div class="gvk-stat-trend ' + trendKey + '"><i class="fa-solid ' + trendIcon + '"></i><span>' + (s.change || '') + '</span></div>'
                +   '</div>'
                +   '<div class="gvk-stat-label">' + (s.label || '') + '</div>'
                +   '<div class="gvk-stat-value">' + (s.value || '—') + '</div>'
                +   '<p class="gvk-stat-subtext">' + (s.subtext || '') + '</p>'
                + '</div>';
        }).join('');
    };

    this.renderQuickStats = function () {
        var container = document.getElementById('quickStats');
        if (!container) return;

        container.innerHTML = (self.quickStats || []).map(function (x) {
            return ''
                + '<div class="gvk-quick-row">'
                +   '<span style="font-weight:700;">' + (x.label || '') + ':</span>'
                +   '<span style="font-weight:800;">' + (x.value || '—') + '</span>'
                + '</div>';
        }).join('');
    };

    this.getChartOptions = function () {
        return {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: true,
                position: 'top',
                labels: {
                    fontSize: 12,
                    fontStyle: 'bold',
                    padding: 16
                }
            },
            tooltips: {
                backgroundColor: 'rgba(255, 255, 255, 0.96)',
                titleFontColor: '#0f172a',
                bodyFontColor: '#334155',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                xPadding: 12,
                yPadding: 10,
                cornerRadius: 8
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontColor: '#64748b'
                    },
                    gridLines: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontColor: '#64748b'
                    },
                    gridLines: {
                        display: false
                    }
                }]
            }
        };
    };

    this.safeDestroy = function (chart) {
        try {
            if (chart && typeof chart.destroy === 'function') chart.destroy();
        } catch (e) {
            // ignore
        }
    };

    this.initCharts = function () {
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js chưa sẵn sàng');
            return;
        }

        // Chart A: Teacher assignment progress (dual axis)
        var elTeacher = document.getElementById('teacherAssignmentChart');
        if (elTeacher) {
            self.safeDestroy(self.charts.teacherAssignmentChart);
            var optTeacher = self.getTeacherAssignmentChartOptions();
            self.charts.teacherAssignmentChart = new Chart(elTeacher.getContext('2d'), {
                type: 'line',
                data: self.chartData.teacherAssignmentChart,
                options: optTeacher
            });
        }

        // Chart B: Grading progress after term ends
        var elGrading = document.getElementById('gradingProgressChart');
        if (elGrading) {
            self.safeDestroy(self.charts.gradingProgressChart);
            var optGrading = self.getGradingProgressChartOptions();
            self.charts.gradingProgressChart = new Chart(elGrading.getContext('2d'), {
                type: 'line',
                data: self.chartData.gradingProgressChart,
                options: optGrading
            });
        }

        var elAct = document.getElementById('activityChart');
        if (elAct) {
            self.safeDestroy(self.charts.activityChart);
            var optAct = self.getChartOptions();
            // doughnut does not use scales
            optAct.scales = {};
            self.charts.activityChart = new Chart(elAct.getContext('2d'), {
                type: 'doughnut',
                data: self.chartData.activityChart,
                options: optAct
            });
        }
    };

    this.buildClassByMajorChart = function (filters) {
        var seed = self.hashString('classByMajor|' + JSON.stringify(filters || {}));
        var majors = ['CNTT', 'Kế toán', 'Marketing', 'QTKD', 'Tài chính', 'Logistics'];
        var base = [25, 18, 15, 12, 10, 5];
        var data = base.map(function (x, i) {
            var delta = (((seed + i * 17) % 7) - 3);
            return Math.max(0, x + delta);
        });

        return {
            labels: majors,
            datasets: [
                {
                    label: 'Số lớp',
                    data: data,
                    backgroundColor: [
                        'rgba(251, 113, 133, 0.80)',
                        'rgba(59, 130, 246, 0.80)',
                        'rgba(16, 185, 129, 0.80)',
                        'rgba(245, 158, 11, 0.80)',
                        'rgba(168, 85, 247, 0.80)',
                        'rgba(148, 163, 184, 0.80)'
                    ],
                    borderColor: [
                        'rgba(251, 113, 133, 1)',
                        'rgba(59, 130, 246, 1)',
                        'rgba(16, 185, 129, 1)',
                        'rgba(245, 158, 11, 1)',
                        'rgba(168, 85, 247, 1)',
                        'rgba(148, 163, 184, 1)'
                    ],
                    borderWidth: 1
                }
            ]
        };
    };

    this.getTeacherAssignmentChartOptions = function () {
        var opts = self.getChartOptions();
        opts.legend.labels.usePointStyle = true;

        opts.tooltips.callbacks = {
            title: function (items, data) {
                if (!items || !items.length) return '';
                var label = (data && data.labels && data.labels[items[0].index]) ? data.labels[items[0].index] : '';
                return 'Mốc: ' + label;
            },
            label: function (tooltipItem, data) {
                var ds = data.datasets[tooltipItem.datasetIndex] || {};
                var v = tooltipItem.yLabel;
                if (ds.yAxisID === 'y-right') {
                    return (ds.label || '') + ': ' + self.formatPct1(v);
                }
                return (ds.label || '') + ': ' + self.formatInt(v);
            },
            afterBody: function () {
                return 'Tiến độ phân công giảng viên cho các lớp học phần theo thời gian trước học kỳ';
            }
        };

        opts.scales = {
            xAxes: [{
                ticks: { fontColor: '#64748b' },
                gridLines: { display: false }
            }],
            yAxes: [
                {
                    id: 'y-left',
                    position: 'left',
                    ticks: {
                        beginAtZero: true,
                        fontColor: '#64748b'
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Số lớp đã phân công'
                    },
                    gridLines: { color: 'rgba(0, 0, 0, 0.05)' }
                },
                {
                    id: 'y-right',
                    position: 'right',
                    ticks: {
                        beginAtZero: true,
                        max: 100,
                        callback: function (value) { return value + '%'; },
                        fontColor: '#64748b'
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Tỷ lệ phân công (%)'
                    },
                    gridLines: { drawOnChartArea: false }
                }
            ]
        };

        return opts;
    };

    this.buildTeacherAssignmentProgressChart = function (filters) {
        // Labels: T-4 -> T-1 (4 tuần trước khi bắt đầu học kỳ)
        var labels = ['T-4', 'T-3', 'T-2', 'T-1'];
        var seed = self.hashString('teacherAssign|' + JSON.stringify(filters || {}));

        // Tổng lớp học phần theo kỳ (mock)
        var total = Math.max(1, 120 + ((seed % 9) - 4) * 2);

        // Build increasing assigned counts
        var base = Math.max(0, Math.min(total, Math.round(total * (0.15 + ((seed % 5) * 0.03)))));
        var assigned = [];
        var last = base;
        for (var i = 0; i < labels.length; i++) {
            var step = Math.max(0, Math.round(total * (0.12 + (((seed + i * 11) % 7) * 0.02))));
            last = Math.min(total, last + step);
            assigned.push(last);
        }

        // Percent derived from assigned/total
        var pct = assigned.map(function (x) {
            return self.round1(self.safePct(x, total));
        });

        return {
            labels: labels,
            datasets: [
                {
                    label: 'Số lớp đã phân công (lớp)',
                    data: assigned,
                    yAxisID: 'y-left',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    backgroundColor: 'rgba(59, 130, 246, 0.12)',
                    borderWidth: 3,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    lineTension: 0.25,
                    fill: false
                },
                {
                    label: 'Tỷ lệ phân công (%)',
                    data: pct,
                    yAxisID: 'y-right',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    backgroundColor: 'rgba(16, 185, 129, 0.10)',
                    borderWidth: 3,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    lineTension: 0.25,
                    fill: false
                }
            ]
        };
    };

    this.getGradingProgressChartOptions = function () {
        var opts = self.getChartOptions();
        opts.legend.labels.usePointStyle = true;

        opts.tooltips.callbacks = {
            title: function (items, data) {
                if (!items || !items.length) return '';
                var label = (data && data.labels && data.labels[items[0].index]) ? data.labels[items[0].index] : '';
                return 'Ngày theo dõi: ' + label;
            },
            label: function (tooltipItem, data) {
                var ds = data.datasets[tooltipItem.datasetIndex] || {};
                return (ds.label || '') + ': ' + self.formatPct1(tooltipItem.yLabel);
            },
            afterBody: function () {
                return 'Tiến độ hoàn thành xác nhận điểm danh và điểm quá trình của các học phần';
            }
        };

        opts.scales.yAxes[0].ticks.max = 100;
        opts.scales.yAxes[0].ticks.callback = function (value) { return value + '%'; };
        opts.scales.yAxes[0].scaleLabel = {
            display: true,
            labelString: 'Tỷ lệ hoàn thành (%)'
        };
        opts.scales.xAxes[0].scaleLabel = {
            display: true,
            labelString: 'Thời gian sau khi kết thúc đợt học (10+T)'
        };

        return opts;
    };

    this.buildGradingProgressChart = function (filters) {
        // X: 10+T, T = 1..14 (tối đa 14 ngày)
        var seed = self.hashString('gradingProgress|' + JSON.stringify(filters || {}));
        var labels = [];
        for (var i = 1; i <= 14; i++) labels.push('10+' + i);

        // mock curves: both increase; process grade usually lags attendance confirmation a bit
        var startA = 12 + (seed % 7);
        var startB = Math.max(0, startA - (6 + (seed % 5)));
        var speedA = 7 + ((seed % 5) * 0.6);
        var speedB = 6 + (((seed + 11) % 5) * 0.55);

        var dataA = [];
        var dataB = [];
        for (var d = 0; d < labels.length; d++) {
            var a = Math.min(100, startA + d * speedA + (((seed + d * 13) % 7) - 3) * 0.35);
            var b = Math.min(100, startB + d * speedB + (((seed + d * 17) % 7) - 3) * 0.35);
            // ensure B does not exceed A too early
            b = Math.min(b, a - (d < 6 ? 2 : 0));
            dataA.push(self.round1(Math.max(0, a)));
            dataB.push(self.round1(Math.max(0, b)));
        }

        return {
            labels: labels,
            datasets: [
                {
                    label: 'Hoàn thành điểm danh (%)',
                    data: dataA,
                    borderColor: 'rgba(59, 130, 246, 1)',
                    backgroundColor: 'rgba(59, 130, 246, 0.10)',
                    borderWidth: 3,
                    pointRadius: 2.5,
                    pointHoverRadius: 4,
                    lineTension: 0.25,
                    fill: false
                },
                {
                    label: 'Hoàn thành điểm quá trình (%)',
                    data: dataB,
                    borderColor: 'rgba(245, 158, 11, 1)',
                    backgroundColor: 'rgba(245, 158, 11, 0.10)',
                    borderWidth: 3,
                    pointRadius: 2.5,
                    pointHoverRadius: 4,
                    lineTension: 0.25,
                    fill: false
                }
            ]
        };
    };

    this.buildActivityChart = function (filters) {
        var seed = self.hashString('activity|' + JSON.stringify(filters || {}));
        var labels = ['Đăng ký học phần', 'Xử lý đơn từ', 'Cập nhật điểm', 'Tư vấn học tập', 'Báo cáo'];
        var base = [450, 125, 380, 85, 25];
        var data = base.map(function (x, i) {
            var delta = (((seed + i * 19) % 41) - 20);
            return Math.max(0, x + delta);
        });

        return {
            labels: labels,
            datasets: [
                {
                    label: 'Số lượng',
                    data: data,
                    backgroundColor: [
                        'rgba(251, 113, 133, 0.80)',
                        'rgba(59, 130, 246, 0.80)',
                        'rgba(16, 185, 129, 0.80)',
                        'rgba(245, 158, 11, 0.80)',
                        'rgba(168, 85, 247, 0.80)'
                    ],
                    borderColor: [
                        'rgba(251, 113, 133, 1)',
                        'rgba(59, 130, 246, 1)',
                        'rgba(16, 185, 129, 1)',
                        'rgba(245, 158, 11, 1)',
                        'rgba(168, 85, 247, 1)'
                    ],
                    borderWidth: 1
                }
            ]
        };
    };
}