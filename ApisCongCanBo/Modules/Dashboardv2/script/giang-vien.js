function DashboardGiangVien() {
    var self = this;

    this.charts = {
        teaching: null,
        evaluation: null,
        research: null
    };

    this.risks = [];

    this.defaultFilters = {
        year: '2025-2026',
        semester: 'HK1',
        level: 'DH',
        unit: 'ALL'
    };

    this.currentFilters = {
        year: this.defaultFilters.year,
        semester: this.defaultFilters.semester,
        level: this.defaultFilters.level,
        unit: this.defaultFilters.unit
    };

    this.filterOptions = {
        years: [
            { value: '2023-2024', text: '2023 - 2024' },
            { value: '2024-2025', text: '2024 - 2025' },
            { value: '2025-2026', text: '2025 - 2026' }
        ],
        semesters: [
            { value: 'ALL', text: 'Tất cả' },
            { value: 'HK1', text: 'Học kỳ 1' },
            { value: 'HK2', text: 'Học kỳ 2' },
            { value: 'HK3', text: 'Học kỳ hè' },
            { value: 'DOT1', text: 'Đợt thi 1' },
            { value: 'DOT2', text: 'Đợt thi 2' }
        ],
        levels: [
            { value: 'ALL', text: 'Tất cả' },
            { value: 'DH', text: 'Đại học' },
            { value: 'THS', text: 'Thạc sĩ' },
            { value: 'TS', text: 'Tiến sĩ' }
        ],
        units: [
            { value: 'ALL', text: 'Toàn trường' },
            { value: 'KHOA', text: 'Theo Khoa' },
            { value: 'NGANH', text: 'Theo Ngành/CTĐT' }
        ]
    };

    // =========================
    // KPI – mock metrics (chờ nối API)
    // =========================
    this.baseMetrics = {
        current: {
            totalClasses: 8,
            onScheduleClasses: 7,
            onTimeGradeClasses: 6,
            taughtHoursStd: 98,
            normHoursStd: 90,
            totalStudents: 420,
            atRiskStudents: 8
        },
        previous: {
            totalClasses: 8,
            onScheduleClasses: 6,
            onTimeGradeClasses: 7,
            taughtHoursStd: 80,
            normHoursStd: 90,
            totalStudents: 410,
            atRiskStudents: 12
        },
        comparison: {
            deptAvgOnSchedulePct: 82.0,
            deptAvgOnTimeGradePct: 85.0,
            schoolRuleOnTimeGradePct: 90.0
        }
    };

    this.kpis = [];

    this.toNumber = function (x, fallback) {
        if (fallback === undefined) fallback = 0;
        var n = Number(x);
        return isFinite(n) ? n : fallback;
    };

    this.calcPct = function (num, den) {
        var n = self.toNumber(num, 0);
        var d = self.toNumber(den, 0);
        if (!d || d <= 0) return 0;
        return (n / d) * 100;
    };

    this.round1 = function (v) {
        var n = self.toNumber(v, 0);
        return Math.round(n * 10) / 10;
    };

    this.formatPct = function (v) {
        return self.round1(v).toFixed(1) + '%';
    };

    this.calcTrendRatio = function (currentPct, prevPct) {
        var c = self.toNumber(currentPct, 0);
        var p = self.toNumber(prevPct, 0);
        if (!p || p <= 0) return 0;
        return (c - p) / p;
    };

    this.getDirection = function (delta, eps) {
        if (eps === undefined) eps = 1e-6;
        if (delta > eps) return 'up';
        if (delta < -eps) return 'down';
        return 'stable';
    };

    this.escapeAttr = function (s) {
        if (s === null || s === undefined) return '';
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    };

    this.computeKpis = function (metricsCurrent, metricsPrev, comparison) {
        var cur = metricsCurrent || {};
        var prev = metricsPrev || {};
        var cmp = comparison || {};

        // KPI1 – % lớp đúng tiến độ
        var kpi1CurPct = self.calcPct(cur.onScheduleClasses, cur.totalClasses);
        var kpi1PrevPct = self.calcPct(prev.onScheduleClasses, prev.totalClasses);
        var kpi1TrendRatio = self.calcTrendRatio(kpi1CurPct, kpi1PrevPct);
        var kpi1Dir = self.getDirection(kpi1CurPct - kpi1PrevPct);
        var kpi1Semantic = (kpi1Dir === 'up' ? 'good' : (kpi1Dir === 'down' ? 'bad' : 'neutral'));

        // KPI2 – % lớp nhập điểm đúng hạn
        var kpi2CurPct = self.calcPct(cur.onTimeGradeClasses, cur.totalClasses);
        var kpi2PrevPct = self.calcPct(prev.onTimeGradeClasses, prev.totalClasses);
        var kpi2TrendRatio = self.calcTrendRatio(kpi2CurPct, kpi2PrevPct);
        var kpi2Dir = self.getDirection(kpi2CurPct - kpi2PrevPct);
        var kpi2Semantic = (kpi2Dir === 'up' ? 'good' : (kpi2Dir === 'down' ? 'bad' : 'neutral'));

        // KPI3 – % hoàn thành định mức
        var kpi3CurPct = self.calcPct(cur.taughtHoursStd, cur.normHoursStd);
        var kpi3PrevPct = self.calcPct(prev.taughtHoursStd, prev.normHoursStd);
        var kpi3TrendRatio = self.calcTrendRatio(kpi3CurPct, kpi3PrevPct);
        var kpi3Dir = self.getDirection(kpi3CurPct - kpi3PrevPct);
        var kpi3Semantic = (kpi3CurPct >= 100 ? 'good' : 'warn');

        // KPI4 – % SV nguy cơ không dự thi
        var kpi4CurPct = self.calcPct(cur.atRiskStudents, cur.totalStudents);
        var kpi4PrevPct = self.calcPct(prev.atRiskStudents, prev.totalStudents);
        var kpi4TrendRatio = self.calcTrendRatio(kpi4CurPct, kpi4PrevPct);
        var kpi4Dir = self.getDirection(kpi4CurPct - kpi4PrevPct);
        // KPI4: tăng là xấu, giảm là tốt
        var kpi4Semantic = (kpi4Dir === 'up' ? 'bad' : (kpi4Dir === 'down' ? 'good' : 'neutral'));

        var formatTrend = function (ratio, dir) {
            if (dir === 'stable') return '0%';
            var pct = self.round1(Math.abs(self.toNumber(ratio, 0) * 100));
            return (dir === 'up' ? '+' : '-') + pct.toFixed(1) + '%';
        };

        return [
            {
                id: 'KPI1',
                iconClass: 'fa-solid fa-calendar-check',
                label: 'Tỷ lệ lớp giảng dạy đúng tiến độ',
                value: self.formatPct(kpi1CurPct),
                change: formatTrend(kpi1TrendRatio, kpi1Dir),
                trendDirection: kpi1Dir,
                trendClass: kpi1Semantic,
                color: 'green',
                subtext: 'So sánh kỳ trước: ' + self.formatPct(kpi1PrevPct),
                tooltip: 'Mức độ bám sát tiến độ giảng dạy',
                timing: 'Realtime / Daily: Cập nhật ngay sau mỗi buổi học khi giảng viên xác nhận lên lớp.',
                details: [
                    '% lớp đúng tiến độ = Số lớp đang dạy đúng tiến độ / Tổng số lớp đang phụ trách ×100',
                    'Kỳ trước: ' + self.formatPct(kpi1PrevPct),
                    'TB khoa (mock): ' + self.formatPct(self.toNumber(cmp.deptAvgOnSchedulePct, 0))
                ]
            },
            {
                id: 'KPI2',
                iconClass: 'fa-solid fa-clipboard-check',
                label: 'Tỷ lệ lớp nhập điểm đúng hạn',
                value: self.formatPct(kpi2CurPct),
                change: formatTrend(kpi2TrendRatio, kpi2Dir),
                trendDirection: kpi2Dir,
                trendClass: kpi2Semantic,
                color: 'blue',
                subtext: 'So sánh kỳ trước: ' + self.formatPct(kpi2PrevPct),
                tooltip: 'Mức độ tuân thủ kế hoạch nhập điểm',
                timing: 'Daily: Trong giai đoạn sau khi kết thúc môn học/đợt thi.',
                details: [
                    '% lớp nhập điểm đúng hạn = Số lớp hoàn thành nhập điểm trước hạn / Tổng số lớp giảng viên phụ trách ×100',
                    'Kỳ trước: ' + self.formatPct(kpi2PrevPct),
                    'Quy định (mock): ≥ ' + self.formatPct(self.toNumber(cmp.schoolRuleOnTimeGradePct, 0))
                ]
            },
            {
                id: 'KPI3',
                iconClass: 'fa-solid fa-gauge-high',
                label: 'Tỷ lệ hoàn thành khối lượng giảng dạy',
                value: self.formatPct(kpi3CurPct),
                change: formatTrend(kpi3TrendRatio, kpi3Dir),
                trendDirection: kpi3Dir,
                trendClass: kpi3Semantic,
                color: 'orange',
                subtext: 'Yêu cầu: ≥100%',
                tooltip: 'Mức độ hoàn thành định mức giảng dạy',
                timing: 'Hàng tháng / Học kỳ: Cập nhật lũy kế theo tiến độ giảng dạy thực tế.',
                details: [
                    '% hoàn thành định mức = Khối lượng giảng dạy đã thực hiện / Định mức giảng dạy ×100',
                    'Khối lượng (giờ chuẩn): ' + self.toNumber(cur.taughtHoursStd, 0),
                    'Định mức (giờ chuẩn): ' + self.toNumber(cur.normHoursStd, 0),
                    'Kỳ trước: ' + self.formatPct(kpi3PrevPct)
                ]
            },
            {
                id: 'KPI4',
                iconClass: 'fa-solid fa-triangle-exclamation',
                label: 'Tỷ lệ SV có nguy cơ không được dự thi',
                value: self.formatPct(kpi4CurPct),
                change: formatTrend(kpi4TrendRatio, kpi4Dir),
                trendDirection: kpi4Dir,
                trendClass: kpi4Semantic,
                color: 'red',
                subtext: 'So sánh kỳ trước: ' + self.formatPct(kpi4PrevPct),
                tooltip: 'Sinh viên có nguy cơ không đủ điều kiện dự thi',
                timing: 'Realtime / Weekly: Nhắc nhở SV ngay trong quá trình học.',
                details: [
                    '% SV nguy cơ = Số SV có nguy cơ không đủ điều kiện dự thi / Tổng số SV lớp học ×100',
                    'SV nguy cơ (định nghĩa): điểm quá trình < 4 hoặc số buổi nghỉ vượt quá quy định',
                    'Kỳ trước: ' + self.formatPct(kpi4PrevPct)
                ]
            }
        ];
    };

    this.schedule = [
        { time: '07:00-09:30', subject: '—', room: '—', className: '—' },
        { time: '09:45-12:15', subject: '—', room: '—', className: '—' },
        { time: '13:30-16:00', subject: '—', room: '—', className: '—' }
    ];

    this.quickStats = [
        { label: 'Tổng giờ năm', value: '—' },
        { label: 'Số sinh viên', value: '—' },
        { label: 'Tỷ lệ đỗ TB', value: '—' },
        { label: 'H-index', value: '—' }
    ];

    this.chartData = {
        teaching: {
            labels: [],
            datasets: [
                {
                    label: 'Kế hoạch',
                    data: [],
                    borderColor: 'rgba(249, 115, 22, 1)',
                    backgroundColor: 'rgba(249, 115, 22, 0)',
                    borderWidth: 3,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false
                },
                {
                    label: 'Thực hiện',
                    data: [],
                    borderColor: 'rgba(59, 130, 246, 1)',
                    backgroundColor: 'rgba(59, 130, 246, 0)',
                    borderWidth: 3,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    borderDash: [6, 6],
                    tension: 0.35,
                    fill: false
                }
            ]
        },
        evaluation: {
            labels: [],
            datasets: [
                {
                    type: 'bar',
                    label: 'Khối lượng đã thực hiện (giờ chuẩn)',
                    data: [],
                    yAxisID: 'yHours',
                    backgroundColor: 'rgba(59, 130, 246, 0.80)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1,
                    barPercentage: 0.55,
                    categoryPercentage: 0.72
                },
                {
                    type: 'line',
                    label: 'Tỷ lệ so với định mức (%)',
                    data: [],
                    yAxisID: 'yPct',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    backgroundColor: 'rgba(16, 185, 129, 0)',
                    borderWidth: 3,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    tension: 0.25,
                    fill: false
                }
            ]
        },
        research: {
            labels: [],
            datasets: []
        }
    };

    this.init = function () {
        self.updateMeta();
        self.renderFilters();
        self.bindEvents();
        self.updateDataByFilters(self.currentFilters);
        self.renderKpis();
        self.renderRiskList();
        self.renderSchedule();
        self.renderQuickStats();
        self.initCharts();
    };

    this.bindEvents = function () {
        var btnApply = document.getElementById('btnFilterApply');
        if (btnApply) {
            btnApply.addEventListener('click', function () {
                self.applyFiltersFromUI();
            });
        }

        var btnReset = document.getElementById('btnFilterReset');
        if (btnReset) {
            btnReset.addEventListener('click', function () {
                self.resetFilters();
            });
        }
    };

    this.renderFilters = function () {
        self.fillSelect('yearFilter', self.filterOptions.years, self.currentFilters.year);
        self.fillSelect('semesterFilter', self.filterOptions.semesters, self.currentFilters.semester);
        self.fillSelect('levelFilter', self.filterOptions.levels, self.currentFilters.level);
        self.fillSelect('unitFilter', self.filterOptions.units, self.currentFilters.unit);
    };

    this.fillSelect = function (id, items, selectedValue) {
        var el = document.getElementById(id);
        if (!el) return;
        el.innerHTML = (items || []).map(function (x) {
            var selected = (x.value === selectedValue ? ' selected' : '');
            return '<option value="' + x.value + '"' + selected + '>' + x.text + '</option>';
        }).join('');
    };

    this.getFiltersFromUI = function () {
        var year = document.getElementById('yearFilter');
        var semester = document.getElementById('semesterFilter');
        var level = document.getElementById('levelFilter');
        var unit = document.getElementById('unitFilter');

        return {
            year: year ? year.value : self.currentFilters.year,
            semester: semester ? semester.value : self.currentFilters.semester,
            level: level ? level.value : self.currentFilters.level,
            unit: unit ? unit.value : self.currentFilters.unit
        };
    };

    this.setFiltersToUI = function (filters) {
        var year = document.getElementById('yearFilter');
        if (year) year.value = filters.year;
        var semester = document.getElementById('semesterFilter');
        if (semester) semester.value = filters.semester;
        var level = document.getElementById('levelFilter');
        if (level) level.value = filters.level;
        var unit = document.getElementById('unitFilter');
        if (unit) unit.value = filters.unit;
    };

    this.applyFiltersFromUI = function () {
        self.currentFilters = self.getFiltersFromUI();
        self.updateDataByFilters(self.currentFilters);
        self.renderKpis();
        self.renderRiskList();
        self.renderSchedule();
        self.renderQuickStats();
        self.initCharts();
    };

    this.resetFilters = function () {
        self.currentFilters = {
            year: self.defaultFilters.year,
            semester: self.defaultFilters.semester,
            level: self.defaultFilters.level,
            unit: self.defaultFilters.unit
        };
        self.setFiltersToUI(self.currentFilters);
        self.updateDataByFilters(self.currentFilters);
        self.renderKpis();
        self.renderRiskList();
        self.renderSchedule();
        self.renderQuickStats();
        self.initCharts();
    };

    this.updateDataByFilters = function (filters) {
        // Pipeline: sau này nối API ở đây.
        // Hiện tại dùng mock metrics + biến thiên nhẹ theo filter để dễ nhìn xu hướng.

        // Clone base
        var cur = JSON.parse(JSON.stringify(self.baseMetrics.current || {}));
        var prev = JSON.parse(JSON.stringify(self.baseMetrics.previous || {}));
        var cmp = self.baseMetrics.comparison || {};

        // Small deterministic adjustment
        var shift = 0;
        if (filters) {
            shift += (filters.semester === 'HK2' ? 1 : 0);
            shift += (filters.semester === 'DOT1' ? -1 : 0);
            shift += (filters.level === 'THS' ? -1 : 0);
            shift += (filters.level === 'TS' ? -2 : 0);
            shift += (filters.unit === 'KHOA' ? 1 : 0);
            shift += (filters.unit === 'NGANH' ? -1 : 0);
        }

        cur.onScheduleClasses = Math.max(0, cur.onScheduleClasses + shift);
        cur.onTimeGradeClasses = Math.max(0, cur.onTimeGradeClasses + (shift >= 0 ? 0 : shift));
        cur.taughtHoursStd = Math.max(0, cur.taughtHoursStd + (shift * 4));
        cur.atRiskStudents = Math.max(0, cur.atRiskStudents + (shift < 0 ? 2 : -1));

        // Recompute KPI models
        self.kpis = self.computeKpis(cur, prev, cmp);

        // Biểu đồ A – Tiến độ giảng dạy theo tuần (mock data)
        self.chartData.teaching = self.buildTeachingProgressWeekly(filters);

        // Biểu đồ B – Khối lượng giảng dạy so với định mức trong 5 năm gần nhất (mock data)
        self.chartData.evaluation = self.buildNormCompletion5Years(filters, cur);

        // Danh sách rủi ro (mock data)
        self.risks = self.buildRiskList(filters);

        // Biểu đồ (cột nhóm) – phân loại kết quả học tập theo HK/Năm học (mock data)
        self.chartData.research = self.buildStudentResultDistribution(filters);

        var status = document.getElementById('systemStatus');
        if (status) {
            status.textContent = 'Sẵn sàng';
            status.title = 'Filters: ' + JSON.stringify(filters);
        }
    };

    // =========================
    // Biểu đồ: Phân loại kết quả học tập theo HK/Năm học
    // =========================
    this.getRecentTerms = function (filters) {
        // Default: show 4 terms: HK1/HK2 of previous year and selected year.
        var endStartYear = self.parseAcademicYearStart(filters && filters.year);
        var prev = endStartYear - 1;

        return [
            { semester: 'HK1', yearStart: prev },
            { semester: 'HK2', yearStart: prev },
            { semester: 'HK1', yearStart: endStartYear },
            { semester: 'HK2', yearStart: endStartYear }
        ];
    };

    this.termLabel = function (t) {
        // Two-line label like example: "HK1\n22-23"
        var y0 = parseInt(t.yearStart, 10);
        var y1 = y0 + 1;
        var yy = String(y0).slice(-2) + '-' + String(y1).slice(-2);
        return String(t.semester) + '\n' + yy;
    };

    this.buildStudentResultDistribution = function (filters) {
        // Categories (TKHP):
        // Xuất sắc >=9.0; Giỏi 8-<9; Khá 7-<8; Trung bình 5-<7; Yếu kém <5
        // Chart displays percent per term; tooltip shows both % and counts.

        var terms = self.getRecentTerms(filters);
        var labels = terms.map(self.termLabel);

        var seed = self.hashString('dist|' + JSON.stringify(filters || {}));
        var totals = [];

        // Generate totals and base distribution per term (mock, smooth changes)
        var pctXS = [];
        var pctG = [];
        var pctK = [];
        var pctTB = [];
        var pctY = [];

        for (var i = 0; i < terms.length; i++) {
            var t = terms[i];
            var tSeed = self.hashString(seed + '|' + t.semester + '|' + t.yearStart);
            var total = 280 + (tSeed % 121); // 280..400
            totals.push(total);

            // base around: Giỏi/Khá dominant; slight improvements over time
            var trend = i * 1.2;
            var xs = self.clamp(6 + (tSeed % 5) + trend * 0.6, 3, 15);
            var gioi = self.clamp(24 + (tSeed % 9) + trend, 15, 40);
            var kha = self.clamp(28 + ((tSeed >> 3) % 10) + trend * 0.2, 18, 45);
            var tb = self.clamp(22 + ((tSeed >> 5) % 7) - trend * 0.6, 10, 35);
            var yeu = self.clamp(100 - (xs + gioi + kha + tb), 3, 20);

            // Normalize to 100
            var sum = xs + gioi + kha + tb + yeu;
            xs = (xs / sum) * 100;
            gioi = (gioi / sum) * 100;
            kha = (kha / sum) * 100;
            tb = (tb / sum) * 100;
            yeu = 100 - (xs + gioi + kha + tb);

            pctXS.push(self.round1(xs));
            pctG.push(self.round1(gioi));
            pctK.push(self.round1(kha));
            pctTB.push(self.round1(tb));
            pctY.push(self.round1(yeu));
        }

        // Save totals so tooltip can compute counts
        self._studentDistTotals = totals;

        return {
            labels: labels,
            datasets: [
                {
                    label: 'Xuất sắc',
                    data: pctXS,
                    backgroundColor: 'rgba(168, 85, 247, 0.80)',
                    borderColor: 'rgba(168, 85, 247, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Giỏi',
                    data: pctG,
                    backgroundColor: 'rgba(59, 130, 246, 0.80)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Khá',
                    data: pctK,
                    backgroundColor: 'rgba(245, 158, 11, 0.80)',
                    borderColor: 'rgba(245, 158, 11, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Trung bình',
                    data: pctTB,
                    backgroundColor: 'rgba(16, 185, 129, 0.80)',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Yếu kém',
                    data: pctY,
                    backgroundColor: 'rgba(239, 68, 68, 0.80)',
                    borderColor: 'rgba(239, 68, 68, 1)',
                    borderWidth: 1
                }
            ]
        };
    };

    this.getStudentDistributionChartOptions = function () {
        var opts = self.getChartOptions();
        opts.tooltips = opts.tooltips || {};
        opts.tooltips.mode = 'index';
        opts.tooltips.intersect = false;
        opts.tooltips.callbacks = {
            title: function (items, data) {
                if (!items || !items.length) return '';
                // Show multiline label nicely
                var raw = data.labels && data.labels[items[0].index] ? data.labels[items[0].index] : '';
                return String(raw).split('\n');
            },
            label: function (tooltipItem, data) {
                var ds = data.datasets[tooltipItem.datasetIndex] || {};
                var pct = self.round1(tooltipItem.yLabel);
                var totals = self._studentDistTotals || [];
                var total = self.toNumber(totals[tooltipItem.index], 0);
                var count = Math.round(total * pct / 100);
                return (ds.label || '') + ': ' + pct.toFixed(1) + '% (' + count + ' SV)';
            },
            afterBody: function (items) {
                if (!items || !items.length) return;
                var totals = self._studentDistTotals || [];
                var total = self.toNumber(totals[items[0].index], 0);
                return ['Tổng SV: ' + total];
            }
        };

        opts.scales = {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 100,
                    callback: function (value) { return value + '%'; },
                    fontColor: '#64748b'
                },
                gridLines: { color: 'rgba(0, 0, 0, 0.05)' },
                scaleLabel: {
                    display: true,
                    labelString: 'Tỷ lệ sinh viên (%)'
                }
            }],
            xAxes: [{
                ticks: {
                    fontColor: '#64748b',
                    callback: function (value) {
                        // Render two-line label (HK / yy-yy)
                        return String(value).split('\n');
                    }
                },
                gridLines: { display: false },
                scaleLabel: {
                    display: true,
                    labelString: 'Học kỳ / Năm học'
                }
            }]
        };

        return opts;
    };

    // =========================
    // Danh sách rủi ro (chốt theo học kỳ)
    // =========================
    this.getTeachingDelayScore = function (delayPct) {
        // delayPct = (Kế hoạch - Thực tế) theo điểm % (percentage points)
        var d = self.toNumber(delayPct, 0);
        if (d <= 0) return { score: 0, reason: 'Giảng dạy đúng tiến độ' };
        if (d >= 20) return { score: 100, reason: 'Tiến độ dạy chậm, cần sắp xếp dạy bù ngay' };
        if (d >= 10) return { score: 70, reason: 'Cần dạy bù' };
        if (d >= 5) return { score: 40, reason: 'Tiến độ giảng dạy chậm' };
        // 0<d<5: không đặc tả rõ, coi như mức thấp
        return { score: 0, reason: 'Giảng dạy đúng tiến độ' };
    };

    this.getGradeDelayScore = function (missingPct) {
        // missingPct = % số đầu điểm chưa hoàn thành
        var m = self.toNumber(missingPct, 0);
        if (m < 20) return { score: 0, reason: 'Nhập điểm đúng hạn' };
        if (m >= 70) return { score: 100, reason: 'Rất chậm nhập điểm' };
        if (m >= 40) return { score: 70, reason: 'Chậm hạn nhập điểm' };
        // 20-<40
        return { score: 40, reason: 'Chậm nhập điểm' };
    };

    this.getRiskLevel = function (riskScore) {
        var s = self.toNumber(riskScore, 0);
        if (s >= 80) return { level: 'Cao', cls: 'high', icon: 'fa-circle-exclamation', color: '#ef4444' };
        if (s >= 50) return { level: 'Trung bình', cls: 'mid', icon: 'fa-circle-exclamation', color: '#f59e0b' };
        return { level: 'Thấp', cls: 'low', icon: 'fa-circle-check', color: '#3b82f6' };
    };

    this.buildRiskList = function (filters) {
        // Mock list; sau này nối API theo học kỳ/đợt học.
        // Mỗi lớp: delay dạy (A) dựa trên tuần thống kê - 1, và % thiếu điểm quá trình (B)
        var weeks = self.getTeachingWeeks(filters);
        var currentWeek = Math.min(weeks, 10);
        var statWeek = Math.max(1, currentWeek - 1);
        var planPctAtWeek = (statWeek / weeks) * 100;

        var seed = self.hashString('risk|' + JSON.stringify(filters || {}));
        var names = [
            'Tin học văn phòng-1-1-25(N01.TH1)',
            'Tin học văn phòng-1-1-25(N01.TH8)',
            'Cơ sở dữ liệu-2-3-25(CSDL.02)',
            'Lập trình Web-1-2-25(WEB.01)',
            'Mạng máy tính-2-2-25(MMT.03)',
            'Trí tuệ nhân tạo-1-3-25(AI.01)'
        ];

        var items = [];
        for (var i = 0; i < names.length; i++) {
            var classSeed = self.hashString(seed + '|' + names[i]);

            // Actual progress around plan with possible lag/lead
            var progressDelta = ((classSeed % 41) - 20); // -20..+20 percentage points
            var actualPctAtWeek = self.clamp(planPctAtWeek + progressDelta, 0, 120);
            var delayPct = Math.max(0, self.round1(planPctAtWeek - actualPctAtWeek));

            // Grade missing percent
            var missingPct = self.round1(self.clamp(((classSeed % 101) * 0.95), 0, 100));

            var a = self.getTeachingDelayScore(delayPct);
            var b = self.getGradeDelayScore(missingPct);

            var riskScore = self.round1(a.score * 0.5 + b.score * 0.5);
            var riskInfo = self.getRiskLevel(riskScore);

            // Nguyên nhân chính: ưu tiên chỉ số có điểm chuẩn hoá cao hơn.
            var reasons = [];
            if (a.reason) reasons.push(a.reason);
            if (b.reason) reasons.push(b.reason);
            var mainReasons;
            if (a.score > b.score) mainReasons = [a.reason];
            else if (b.score > a.score) mainReasons = [b.reason];
            else mainReasons = reasons;

            items.push({
                className: names[i],
                statWeek: statWeek,
                planPct: self.round1(planPctAtWeek),
                actualPct: self.round1(actualPctAtWeek),
                delayPct: delayPct,
                missingPct: missingPct,
                scoreA: a.score,
                scoreB: b.score,
                riskScore: riskScore,
                riskLevel: riskInfo.level,
                riskClass: riskInfo.cls,
                riskIcon: riskInfo.icon,
                riskColor: riskInfo.color,
                reasons: mainReasons
            });
        }

        // sort desc by riskScore
        items.sort(function (x, y) { return self.toNumber(y.riskScore, 0) - self.toNumber(x.riskScore, 0); });
        return items;
    };

    this.renderRiskList = function () {
        var body = document.getElementById('riskTableBody');
        if (!body) return;

        var rows = self.risks || [];
        if (!rows.length) {
            body.innerHTML = '<tr><td colspan="3" style="padding:14px; color:#64748b;">Không có dữ liệu rủi ro.</td></tr>';
            return;
        }

        body.innerHTML = rows.map(function (r) {
            var risk = self.getRiskLevel(r.riskScore);
            var bg = (risk.cls === 'high' ? 'rgba(239, 68, 68, 0.08)' : (risk.cls === 'mid' ? 'rgba(245, 158, 11, 0.10)' : 'rgba(59, 130, 246, 0.08)'));
            var title = self.escapeAttr(
                'Risk Score: ' + self.round1(r.riskScore).toFixed(1)
                + '\nA (Tiến độ dạy chậm): ' + self.round1(r.delayPct).toFixed(1) + '% (score ' + r.scoreA + ')'
                + '\nB (% thiếu điểm): ' + self.round1(r.missingPct).toFixed(1) + '% (score ' + r.scoreB + ')'
                + '\nTuần thống kê: ' + (r.statWeek || '')
            );

            var reasons = (r.reasons && r.reasons.length) ? r.reasons.join(', ') : '—';

            return ''
                + '<tr style="background:' + bg + ';">'
                +   '<td style="padding:12px; border-bottom:1px solid #e2e8f0; font-weight:800; color:#0f172a;" title="' + title + '">'
                +     self.escapeAttr(r.className)
                +   '</td>'
                +   '<td style="padding:12px; border-bottom:1px solid #e2e8f0;">'
                +     '<span style="display:inline-flex; align-items:center; gap:8px; padding:6px 10px; border-radius:999px; font-weight:800; font-size:12px; background:#fff; border:1px solid #e2e8f0;" title="' + title + '">'
                +       '<i class="fa-solid ' + risk.icon + '" style="color:' + risk.color + ';"></i>'
                +       risk.level
                +     '</span>'
                +   '</td>'
                +   '<td style="padding:12px; border-bottom:1px solid #e2e8f0; color:#334155; font-weight:700;" title="' + title + '">'
                +     self.escapeAttr(reasons)
                +   '</td>'
                + '</tr>';
        }).join('');
    };

    this.clamp = function (v, min, max) {
        var n = self.toNumber(v, 0);
        if (n < min) return min;
        if (n > max) return max;
        return n;
    };

    this.hashString = function (s) {
        // deterministic small hash for stable mock variations
        var str = String(s || '');
        var h = 0;
        for (var i = 0; i < str.length; i++) {
            h = ((h << 5) - h) + str.charCodeAt(i);
            h |= 0;
        }
        return Math.abs(h);
    };

    this.getTeachingWeeks = function (filters) {
        var sem = (filters && filters.semester) ? String(filters.semester) : '';
        if (sem === 'HK3') return 8;
        if (sem === 'DOT1' || sem === 'DOT2') return 4;
        // HK1/HK2/ALL
        return 15;
    };

    this.getTeachingProgressStatus = function (actualPct, planPct) {
        var a = self.toNumber(actualPct, 0);
        var p = self.toNumber(planPct, 0);
        var eps = 0.75; // ~ “≈” tolerance (percentage points)
        if (a + eps < p) return 'Chậm tiến độ';
        if (a > p + eps) return 'Vượt tiến độ';
        return 'Đúng tiến độ';
    };

    this.buildTeachingProgressWeekly = function (filters) {
        // % hoàn thành = (Số tiết đã giảng dạy / Tổng số tiết theo kế hoạch) ×100
        // Tổng hợp theo tuần học (cumulative %)
        var weeks = self.getTeachingWeeks(filters);
        var labels = [];
        var plan = [];
        var actual = [];

        var seed = self.hashString(JSON.stringify(filters || {}));
        var drift = (seed % 7) - 3; // -3..+3
        var catchUp = (seed % 5) - 2; // -2..+2

        for (var w = 1; w <= weeks; w++) {
            labels.push(String(w));

            // Plan: linear cumulative to 100%
            var p = (w / weeks) * 100;

            // Actual: lag early, then catch up near end; plus small deterministic wiggle
            var lag = Math.max(0, 8 - (w * (8 / Math.max(1, Math.floor(weeks / 2)))));
            var wiggle = (((seed + w * 131) % 9) - 4) * 0.35; // about -1.4..+1.4
            var a = p - lag + (w > Math.floor(weeks * 0.65) ? (catchUp * 1.2) : 0) + (drift * 0.6) + wiggle;

            plan.push(self.round1(self.clamp(p, 0, 100)));
            actual.push(self.round1(self.clamp(a, 0, 120)));
        }

        return {
            labels: labels,
            datasets: [
                {
                    label: 'Kế hoạch',
                    data: plan,
                    borderColor: 'rgba(249, 115, 22, 1)',
                    backgroundColor: 'rgba(249, 115, 22, 0)',
                    borderWidth: 3,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false
                },
                {
                    label: 'Thực hiện',
                    data: actual,
                    borderColor: 'rgba(59, 130, 246, 1)',
                    backgroundColor: 'rgba(59, 130, 246, 0)',
                    borderWidth: 3,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    borderDash: [6, 6],
                    tension: 0.35,
                    fill: false
                }
            ]
        };
    };

    this.parseAcademicYearStart = function (yearValue) {
        // Expecting '2025-2026' -> 2025
        var s = String(yearValue || '').trim();
        var m = s.match(/(\d{4})\s*[-–]\s*(\d{4})/);
        if (m && m[1]) return parseInt(m[1], 10);
        // fallback: current year
        return (new Date()).getFullYear();
    };

    this.formatAcademicYear = function (startYear) {
        var y = parseInt(startYear, 10);
        if (!isFinite(y)) y = (new Date()).getFullYear();
        return String(y) + '-' + String(y + 1);
    };

    this.buildNormCompletion5Years = function (filters, metricsCurrent) {
        // % hoàn thành định mức = (Khối lượng đã thực hiện / Định mức được giao) ×100
        // 5 năm gần nhất tính theo Năm học filter
        var cur = metricsCurrent || {};
        var endStartYear = self.parseAcademicYearStart(filters && filters.year);

        var labels = [];
        var hours = [];
        var pct = [];

        var seed = self.hashString('norm5y|' + JSON.stringify(filters || {}));
        var baseNorm = Math.max(180, self.toNumber(cur.normHoursStd, 270) * 3); // scale mock to look like chart (giờ chuẩn)
        var baseHours = Math.max(150, self.toNumber(cur.taughtHoursStd, 260) * 3);

        for (var i = 4; i >= 0; i--) {
            var startYear = endStartYear - i;
            labels.push(self.formatAcademicYear(startYear));

            var wobble = (((seed + startYear * 97) % 31) - 15); // -15..+15
            var trend = (4 - i) * 6; // slight upward trend into recent years
            var h = baseHours + trend + wobble;
            var n = baseNorm + (((seed + startYear * 41) % 21) - 10); // norm slightly changes

            h = self.round1(self.clamp(h, 0, 9999));
            n = Math.max(1, self.round1(self.clamp(n, 1, 9999)));

            hours.push(h);
            pct.push(self.round1((h / n) * 100));
        }

        return {
            labels: labels,
            datasets: [
                {
                    type: 'bar',
                    label: 'Khối lượng đã thực hiện (giờ chuẩn)',
                    data: hours,
                    yAxisID: 'yHours',
                    backgroundColor: 'rgba(59, 130, 246, 0.80)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1,
                    barPercentage: 0.55,
                    categoryPercentage: 0.72
                },
                {
                    type: 'line',
                    label: 'Tỷ lệ so với định mức (%)',
                    data: pct,
                    yAxisID: 'yPct',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    backgroundColor: 'rgba(16, 185, 129, 0)',
                    borderWidth: 3,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    tension: 0.25,
                    fill: false
                }
            ]
        };
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

    this.renderKpis = function () {
        var container = document.getElementById('statsCards');
        if (!container) return;

        container.innerHTML = (self.kpis || []).map(function (kpi) {
            var dir = (kpi.trendDirection || 'stable');
            var pillClass = (kpi.trendClass || dir || 'stable');
            var trendIcon = (dir === 'up' ? 'fa-arrow-up' : (dir === 'down' ? 'fa-arrow-down' : 'fa-minus'));
            var titleParts = [];
            if (kpi.tooltip) titleParts.push('Tooltip: ' + kpi.tooltip);
            if (kpi.timing) titleParts.push('Timing: ' + kpi.timing);
            if (kpi.details && kpi.details.length) {
                titleParts.push('---');
                for (var i = 0; i < kpi.details.length; i++) titleParts.push(kpi.details[i]);
            }
            var title = self.escapeAttr(titleParts.join('\n'));
            return ''
                + '<div class="gv-stat-card ' + (kpi.color || 'orange') + '" title="' + title + '">'
                +   '<div class="gv-stat-header">'
                +     '<div class="gv-stat-icon"><i class="' + (kpi.iconClass || 'fa-solid fa-circle') + '"></i></div>'
                +     '<div class="gv-stat-trend ' + pillClass + '"><i class="fa-solid ' + trendIcon + '"></i><span>' + (kpi.change || '') + '</span></div>'
                +   '</div>'
                +   '<div class="gv-stat-label">' + (kpi.label || '') + '</div>'
                +   '<div class="gv-stat-value">' + (kpi.value || '—') + '</div>'
                +   '<p class="gv-stat-subtext">' + (kpi.subtext || '') + '</p>'
                + '</div>';
        }).join('');
    };

    this.renderSchedule = function () {
        var container = document.getElementById('scheduleList');
        if (!container) return;

        container.innerHTML = (self.schedule || []).map(function (s) {
            return ''
                + '<div class="gv-list-item">'
                +   '<div class="gv-list-item-top">'
                +     '<span class="gv-time">' + (s.time || '') + '</span>'
                +     '<span class="gv-room">' + (s.room || '') + '</span>'
                +   '</div>'
                +   '<p class="gv-subject">' + (s.subject || '') + '</p>'
                +   '<p class="gv-class">' + (s.className || '') + '</p>'
                + '</div>';
        }).join('');
    };

    this.renderQuickStats = function () {
        var container = document.getElementById('quickStats');
        if (!container) return;

        container.innerHTML = (self.quickStats || []).map(function (x) {
            return ''
                + '<div class="gv-quick-row">'
                +   '<span style="color:#475569; font-weight:600;">' + (x.label || '') + ':</span>'
                +   '<span style="font-weight:800; color:#0f172a;">' + (x.value || '—') + '</span>'
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

    this.getTeachingChartOptions = function () {
        // Customize for Biểu đồ A
        var opts = self.getChartOptions();
        opts.scales = {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 120,
                    callback: function (value) { return value + '%'; },
                    fontColor: '#64748b'
                },
                gridLines: { color: 'rgba(0, 0, 0, 0.05)' }
            }],
            xAxes: [{
                ticks: { fontColor: '#64748b' },
                gridLines: { display: false },
                scaleLabel: {
                    display: true,
                    labelString: 'Tuần học'
                }
            }]
        };

        opts.tooltips = opts.tooltips || {};
        opts.tooltips.mode = 'index';
        opts.tooltips.intersect = false;
        opts.tooltips.callbacks = {
            title: function (items) {
                if (!items || !items.length) return '';
                return 'Tuần ' + items[0].label;
            },
            label: function (tooltipItem, data) {
                var ds = data.datasets[tooltipItem.datasetIndex] || {};
                var v = self.round1(tooltipItem.yLabel);
                return (ds.label || '') + ': ' + v.toFixed(1) + '%';
            },
            afterBody: function (items, data) {
                if (!items || !items.length) return;
                var index = items[0].index;
                var plan = (data.datasets[0] && data.datasets[0].data) ? data.datasets[0].data[index] : 0;
                var actual = (data.datasets[1] && data.datasets[1].data) ? data.datasets[1].data[index] : 0;
                var status = self.getTeachingProgressStatus(actual, plan);
                return ['Trạng thái: ' + status];
            }
        };

        return opts;
    };

    this.getNormCompletionChartOptions = function () {
        var opts = self.getChartOptions();
        opts.legend = opts.legend || {};
        opts.legend.position = 'top';

        opts.tooltips = opts.tooltips || {};
        opts.tooltips.mode = 'index';
        opts.tooltips.intersect = false;
        opts.tooltips.callbacks = {
            title: function (items, data) {
                if (!items || !items.length) return '';
                return (data.labels && data.labels[items[0].index]) ? data.labels[items[0].index] : '';
            },
            label: function (tooltipItem, data) {
                var ds = data.datasets[tooltipItem.datasetIndex] || {};
                var v = tooltipItem.yLabel;
                if (ds.yAxisID === 'yPct') {
                    v = self.round1(v);
                    return (ds.label || '') + ': ' + v.toFixed(1) + '%';
                }
                v = self.round1(v);
                return (ds.label || '') + ': ' + v.toFixed(1);
            },
            afterBody: function (items, data) {
                if (!items || !items.length) return;
                var idx = items[0].index;
                var p = 0;
                // line is dataset 1 by construction
                if (data.datasets[1] && data.datasets[1].data) p = data.datasets[1].data[idx];
                var status = (self.toNumber(p, 0) >= 100) ? 'Hoàn thành định mức' : 'Chưa đạt định mức';
                return ['Trạng thái: ' + status];
            }
        };

        opts.scales = {
            yAxes: [
                {
                    id: 'yHours',
                    position: 'left',
                    ticks: {
                        beginAtZero: true,
                        fontColor: '#64748b'
                    },
                    gridLines: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Giờ chuẩn'
                    }
                },
                {
                    id: 'yPct',
                    position: 'right',
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        max: 140,
                        callback: function (value) { return value + '%'; },
                        fontColor: '#64748b'
                    },
                    gridLines: {
                        drawOnChartArea: false
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Tỷ lệ % so với định mức'
                    }
                }
            ],
            xAxes: [
                {
                    ticks: { fontColor: '#64748b' },
                    gridLines: { display: false },
                    scaleLabel: {
                        display: true,
                        labelString: 'Năm học'
                    }
                }
            ]
        };

        return opts;
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

        var opts = self.getChartOptions();
        var optsTeaching = self.getTeachingChartOptions();
        var optsNorm = self.getNormCompletionChartOptions();
        var optsDist = self.getStudentDistributionChartOptions();

        var elTeaching = document.getElementById('teachingChart');
        if (elTeaching) {
            self.safeDestroy(self.charts.teaching);
            self.charts.teaching = new Chart(elTeaching.getContext('2d'), {
                type: 'line',
                data: self.chartData.teaching,
                options: optsTeaching
            });
        }

        var elEvaluation = document.getElementById('evaluationChart');
        if (elEvaluation) {
            self.safeDestroy(self.charts.evaluation);
            self.charts.evaluation = new Chart(elEvaluation.getContext('2d'), {
                type: 'bar',
                data: self.chartData.evaluation,
                options: optsNorm
            });
        }

        var elResearch = document.getElementById('researchChart');
        if (elResearch) {
            self.safeDestroy(self.charts.research);
            self.charts.research = new Chart(elResearch.getContext('2d'), {
                type: 'bar',
                data: self.chartData.research,
                options: optsDist
            });
        }
    };
}