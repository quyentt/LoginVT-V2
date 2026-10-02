// Dashboard Sinh viên (Dashboardv2 style)

function DashboardSinhVien() {
    var self = this;

    this.charts = {
        academicChart: null,
        subjectChart: null,
        activityChart: null
    };

    this.data = {
        stats: [],
        schedule: [],
        academic: null,
        subject: null,
        activity: null,
        quick: null,
        student: null
    };

    this.init = function () {
        self.updateHeaderMeta();
        self.seedMockData();
        self.renderAll();
        self.initCharts();
    };

    this.updateHeaderMeta = function () {
        var now = new Date();
        var timeText = now.toLocaleString('vi-VN');
        var elTime = document.getElementById('lastUpdateTime');
        if (elTime) elTime.textContent = timeText;

        var elStatus = document.getElementById('systemStatus');
        if (elStatus) elStatus.textContent = 'OK';
    };

    this.seedMockData = function () {
        // Placeholder data (sẽ thay bằng API sau)
        self.data.stats = [
            {
                icon: 'fa-trophy',
                label: 'GPA hiện tại',
                value: '3.45',
                change: '+0.15',
                subtext: 'so với kỳ trước',
                trend: 'up',
                color: 'red'
            },
            {
                icon: 'fa-book',
                label: 'Tín chỉ tích lũy',
                value: '95/140',
                change: '+18 TC',
                subtext: 'kỳ này',
                trend: 'up',
                color: 'blue'
            },
            {
                icon: 'fa-calendar-days',
                label: 'Số môn đang học',
                value: '7',
                change: '22 tín chỉ',
                subtext: 'kỳ 1 năm 2024-2025',
                trend: 'stable',
                color: 'green'
            },
            {
                icon: 'fa-star',
                label: 'Điểm rèn luyện',
                value: '85/100',
                change: 'Loại Tốt',
                subtext: 'kỳ này',
                trend: 'up',
                color: 'yellow'
            }
        ];

        self.data.schedule = [
            { time: '07:00-09:30', subject: 'Lập trình Java', room: 'A101', teacher: 'TS. Nguyễn Văn A' },
            { time: '09:45-12:15', subject: 'Cơ sở dữ liệu', room: 'B205', teacher: 'ThS. Trần Thị B' },
            { time: '13:30-16:00', subject: 'Tiếng Anh 3', room: 'C301', teacher: 'ThS. Lê Văn C' }
        ];

        self.data.academic = {
            labels: ['HK1-2022', 'HK2-2022', 'HK1-2023', 'HK2-2023', 'HK1-2024', 'HK2-2024', 'HK1-2025'],
            datasets: [
                {
                    label: 'GPA',
                    data: [2.8, 3.0, 3.2, 3.3, 3.4, 3.3, 3.45],
                    borderColor: 'rgba(239, 68, 68, 1)',
                    backgroundColor: 'rgba(239, 68, 68, 0.10)',
                    borderWidth: 3,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    fill: true,
                    lineTension: 0.35,
                    yAxisID: 'y'
                },
                {
                    label: 'Tín chỉ tích lũy',
                    data: [15, 30, 48, 66, 77, 95, 95],
                    borderColor: 'rgba(59, 130, 246, 1)',
                    backgroundColor: 'rgba(59, 130, 246, 0.10)',
                    borderWidth: 3,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    fill: true,
                    lineTension: 0.35,
                    yAxisID: 'y1'
                }
            ]
        };

        self.data.subject = {
            labels: ['Lập trình Java', 'Cơ sở dữ liệu', 'Mạng máy tính', 'Tiếng Anh 3', 'Toán rời rạc', 'Web Dev', 'Mobile App'],
            datasets: [{
                label: 'Điểm số',
                data: [8.5, 7.8, 8.2, 7.5, 9.0, 8.8, 8.0],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(34, 197, 94, 0.8)'
                ],
                borderColor: [
                    'rgba(34, 197, 94, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(34, 197, 94, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(34, 197, 94, 1)',
                    'rgba(34, 197, 94, 1)'
                ],
                borderWidth: 2
            }]
        };

        self.data.activity = {
            labels: ['Học tập', 'Hoạt động tập thể', 'Hoạt động xã hội', 'Ý thức kỷ luật', 'Phẩm chất đạo đức'],
            datasets: [{
                label: 'Điểm rèn luyện',
                data: [18, 16, 20, 15, 16],
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                borderColor: 'rgba(239, 68, 68, 1)',
                pointBackgroundColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(34, 197, 94, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(168, 85, 247, 1)',
                    'rgba(239, 68, 68, 1)'
                ],
                pointRadius: 3,
                borderWidth: 2
            }]
        };

        self.data.quick = {
            classRank: '5/45',
            debtSubjects: '0',
            scholarship: 'Có',
            expectedGradYear: '2025'
        };

        self.data.student = {
            name: 'Nguyễn Thị B',
            code: '2021001234',
            faculty: 'Khoa CNTT',
            cohort: 'K21'
        };
    };

    this.renderAll = function () {
        self.renderStudentInfo();
        self.renderStatsCards();
        self.renderScheduleList();
        self.renderQuickStats();
    };

    this.renderStudentInfo = function () {
        var s = self.data.student || {};
        var elName = document.getElementById('studentName');
        var elCode = document.getElementById('studentCode');
        var elFaculty = document.getElementById('studentFaculty');
        var elCohort = document.getElementById('studentCohort');

        if (elName) elName.textContent = s.name || '--';
        if (elCode) elCode.textContent = s.code || '--';
        if (elFaculty) elFaculty.textContent = s.faculty || '--';
        if (elCohort) elCohort.textContent = s.cohort || '--';
    };

    this.renderStatsCards = function () {
        var container = document.getElementById('statsCards');
        if (!container) return;

        container.innerHTML = (self.data.stats || []).map(function (stat) {
            var trendText = stat.change || '';
            var trendCls = (stat.trend === 'up' ? 'up' : (stat.trend === 'down' ? 'down' : 'stable'));
            var trendIcon = (stat.trend === 'up' ? 'fa-arrow-up' : (stat.trend === 'down' ? 'fa-arrow-down' : 'fa-minus'));
            var colorCls = stat.color || 'red';

            return ''
                + '<div class="sv-stat-card ' + colorCls + '">'
                +   '<div class="sv-stat-header">'
                +     '<div class="sv-stat-icon"><i class="fa-solid ' + (stat.icon || 'fa-chart-simple') + '"></i></div>'
                +     '<div class="sv-stat-trend ' + trendCls + '">'
                +       '<i class="fa-solid ' + trendIcon + '"></i>'
                +       '<span>' + self.escapeHtml(trendText) + '</span>'
                +     '</div>'
                +   '</div>'
                +   '<div class="sv-stat-label">' + self.escapeHtml(stat.label || '') + '</div>'
                +   '<div class="sv-stat-value">' + self.escapeHtml(stat.value || '--') + '</div>'
                +   '<p class="sv-stat-subtext">' + self.escapeHtml(stat.subtext || '') + '</p>'
                + '</div>';
        }).join('');
    };

    this.renderScheduleList = function () {
        var container = document.getElementById('scheduleList');
        if (!container) return;

        container.innerHTML = (self.data.schedule || []).map(function (item) {
            return ''
                + '<div class="sv-schedule-item">'
                +   '<div class="sv-schedule-row">'
                +     '<span>' + self.escapeHtml(item.time || '--') + '</span>'
                +     '<span style="color:#64748b;font-weight:800;">' + self.escapeHtml(item.room || '--') + '</span>'
                +   '</div>'
                +   '<p class="sv-schedule-subject">' + self.escapeHtml(item.subject || '') + '</p>'
                +   '<p class="sv-schedule-teacher">' + self.escapeHtml(item.teacher || '') + '</p>'
                + '</div>';
        }).join('');
    };

    this.renderQuickStats = function () {
        var container = document.getElementById('quickStats');
        if (!container) return;

        var q = self.data.quick || {};
        container.innerHTML = ''
            + '<div class="sv-quick-row"><span style="color:#475569;">Xếp hạng lớp:</span><span style="font-weight:900;color:#ef4444;">' + self.escapeHtml(q.classRank || '--') + '</span></div>'
            + '<div class="sv-quick-row"><span style="color:#475569;">Số môn nợ:</span><span style="font-weight:900;color:#0f172a;">' + self.escapeHtml(q.debtSubjects || '--') + '</span></div>'
            + '<div class="sv-quick-row"><span style="color:#475569;">Học bổng:</span><span style="font-weight:900;color:#10b981;">' + self.escapeHtml(q.scholarship || '--') + '</span></div>'
            + '<div class="sv-quick-row"><span style="color:#475569;">Dự kiến TN:</span><span style="font-weight:900;color:#3b82f6;">' + self.escapeHtml(q.expectedGradYear || '--') + '</span></div>';
    };

    this.getBaseChartOptions = function () {
        // Chart.js 2.9.4 options
        return {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: true,
                position: 'top',
                labels: {
                    fontSize: 12,
                    fontStyle: 'bold',
                    padding: 15
                }
            },
            tooltips: {
                backgroundColor: 'rgba(255, 255, 255, 0.96)',
                titleFontColor: '#0f172a',
                bodyFontColor: '#334155',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                xPadding: 10,
                yPadding: 10,
                cornerRadius: 8,
                displayColors: true
            }
        };
    };

    this.initCharts = function () {
        if (typeof Chart === 'undefined') {
            // Chart.js có thể được load fallback trong HTML
            return;
        }
        self.destroyCharts();
        self.initAcademicChart();
        self.initSubjectChart();
        self.initActivityChart();
    };

    this.destroyCharts = function () {
        Object.keys(self.charts).forEach(function (key) {
            if (self.charts[key] && typeof self.charts[key].destroy === 'function') {
                try { self.charts[key].destroy(); } catch (e) { /* ignore */ }
            }
            self.charts[key] = null;
        });
    };

    this.initAcademicChart = function () {
        var el = document.getElementById('academicChart');
        if (!el) return;
        var ctx = el.getContext('2d');
        if (!ctx) return;

        var base = self.getBaseChartOptions();
        var options = self.extend(base, {
            scales: {
                yAxes: [
                    {
                        id: 'y',
                        type: 'linear',
                        position: 'left',
                        ticks: { beginAtZero: true, suggestedMax: 4.0 },
                        gridLines: { color: 'rgba(0,0,0,0.06)' }
                    },
                    {
                        id: 'y1',
                        type: 'linear',
                        position: 'right',
                        ticks: { beginAtZero: true, suggestedMax: 140 },
                        gridLines: { drawOnChartArea: false }
                    }
                ],
                xAxes: [
                    {
                        gridLines: { display: false },
                        ticks: { maxRotation: 0 }
                    }
                ]
            }
        });

        self.charts.academicChart = new Chart(ctx, {
            type: 'line',
            data: self.data.academic,
            options: options
        });
    };

    this.initSubjectChart = function () {
        var el = document.getElementById('subjectChart');
        if (!el) return;
        var ctx = el.getContext('2d');
        if (!ctx) return;

        var base = self.getBaseChartOptions();
        var options = self.extend(base, {
            scales: {
                yAxes: [
                    {
                        ticks: { beginAtZero: true, max: 10 },
                        gridLines: { color: 'rgba(0,0,0,0.06)' }
                    }
                ],
                xAxes: [
                    {
                        gridLines: { display: false },
                        ticks: { autoSkip: false, fontSize: 11 }
                    }
                ]
            }
        });

        self.charts.subjectChart = new Chart(ctx, {
            type: 'bar',
            data: self.data.subject,
            options: options
        });
    };

    this.initActivityChart = function () {
        var el = document.getElementById('activityChart');
        if (!el) return;
        var ctx = el.getContext('2d');
        if (!ctx) return;

        var base = self.getBaseChartOptions();
        var options = self.extend(base, {
            legend: { display: true, position: 'top' },
            scale: {
                ticks: { beginAtZero: true, max: 20 },
                gridLines: { color: 'rgba(0,0,0,0.08)' },
                angleLines: { color: 'rgba(0,0,0,0.08)' },
                pointLabels: { fontSize: 12, fontStyle: 'bold' }
            }
        });

        self.charts.activityChart = new Chart(ctx, {
            type: 'radar',
            data: self.data.activity,
            options: options
        });
    };

    this.escapeHtml = function (val) {
        var s = String(val == null ? '' : val);
        return s
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    this.extend = function (a, b) {
        var out = {};
        Object.keys(a || {}).forEach(function (k) { out[k] = a[k]; });
        Object.keys(b || {}).forEach(function (k) {
            if (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k])) {
                out[k] = self.extend(out[k] || {}, b[k]);
            } else {
                out[k] = b[k];
            }
        });
        return out;
    };
}