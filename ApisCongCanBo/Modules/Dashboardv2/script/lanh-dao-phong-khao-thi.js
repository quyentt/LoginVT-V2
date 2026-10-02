/**
 * ============================================
 * DASHBOARD LÃNH ĐẠO PHÒNG KHẢO THÍ - BACKEND LOGIC
 * Xử lý dữ liệu và render các component
 * Version: 2.0.0
 * ============================================
 */

function DashboardPhongKhaoThi() {
    'use strict';
    
    // ==================== PROPERTIES ====================
    
    /**
     * Dữ liệu KPI Cards
     */
    this.kpiData = [
        {
            id: 'kpi1',
            icon: 'fa-file-alt',
            label: 'Tỷ lệ đề thi chuẩn bị đúng hạn',
            category: 'Chuẩn bị đề thi',
            value: '95.8%',
            trend: 'up',
            trendValue: '+3.2%',
            subtext: 'so với cùng kỳ năm trước',
            color: 'green',
            tooltip: 'Dữ liệu cập nhật đến ngày 03/04/2026',
            updateType: 'Hàng ngày (Daily)'
        },
        {
            id: 'kpi2',
            icon: 'fa-calendar-check',
            label: 'Tỷ lệ tổ chức thi đúng kế hoạch',
            category: 'Ổn định tổ chức',
            value: '98.5%',
            trend: 'up',
            trendValue: '+1.8%',
            subtext: 'so với cùng kỳ năm trước',
            color: 'blue',
            tooltip: 'Chỉ số ổn định tổ chức kỳ thi',
            updateType: 'Hàng ngày (Daily)'
        },
        {
            id: 'kpi3',
            icon: 'fa-check-circle',
            label: 'Tỷ lệ hoàn thành chấm thi đúng hạn',
            category: 'Tiến độ chấm điểm',
            value: '92.3%',
            trend: 'up',
            trendValue: '+4.5%',
            subtext: 'so với cùng kỳ năm trước',
            color: 'purple',
            tooltip: 'Tiến độ chấm thi và nhập điểm',
            updateType: 'Realtime/Daily'
        },
        {
            id: 'kpi4',
            icon: 'fa-exclamation-triangle',
            label: 'Số sự cố/vi phạm trên 1000 SV',
            category: 'An toàn & kỷ luật',
            value: '2.8',
            trend: 'down',
            trendValue: '-1.2',
            subtext: 'giảm so với cùng kỳ năm trước',
            color: 'orange',
            tooltip: 'Chỉ số an toàn & kỷ luật kỳ thi',
            updateType: 'Daily Snapshot',
            isWarning: true
        }
    ];

    // Chart data
    /**
     * Dữ liệu tiến độ hoàn thành đề thi trước kỳ thi
     * Theo dõi tiến độ chuẩn bị và phê duyệt đề thi
     */
    this.examPreparationData = {
        labels: ['T-10', 'T-9', 'T-8', 'T-7', 'T-6', 'T-5', 'T-4', 'T-3', 'T-2', 'T-1'],
        datasets: [
            {
                label: 'Kế hoạch phê duyệt',
                data: [20, 30, 40, 50, 60, 70, 80, 90, 95, 100],
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: false,
                pointRadius: 6,
                pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            },
            {
                label: 'Thực tế phê duyệt',
                data: [10, 18, 35, 45, 55, 62, 72, 85, 92, 98],
                borderColor: 'rgba(245, 158, 11, 1)',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: false,
                pointRadius: 6,
                pointBackgroundColor: 'rgba(245, 158, 11, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                borderDash: [5, 5]
            }
        ],
        // Dữ liệu bổ sung cho tooltip
        submittedCount: [15, 28, 54, 70, 86, 97, 112, 133, 144, 153],
        totalCount: 156,
        pendingDepartments: [
            ['Khoa CNTT', 'Khoa Kinh tế', 'Khoa Y tế'],
            ['Khoa CNTT', 'Khoa Kinh tế'],
            ['Khoa CNTT', 'Khoa Y tế'],
            ['Khoa CNTT'],
            ['Khoa Kinh tế'],
            ['Khoa Y tế'],
            [],
            [],
            [],
            []
        ]
    };

    /**
     * Dữ liệu tỷ lệ trượt & điểm trung bình theo khoa
     * Tỷ lệ trượt = (Số SV không đạt / Tổng số SV học) × 100
     * Điểm TB = Điểm trung bình học tập của sinh viên thuộc khoa
     */
    this.failRateAvgScoreData = {
        labels: ['CNTT', 'Cơ khí', 'Kinh tế', 'Ngoại ngữ', 'Y Dược'],
        datasets: [
            {
                label: 'Tỷ lệ trượt (%)',
                data: [35, 18, 10, 8, 25],
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2,
                yAxisID: 'y-left',
                type: 'bar'
            },
            {
                label: 'Điểm trung bình (thang 10)',
                data: [6.3, 7.2, 7.8, 8.0, 6.9],
                borderColor: 'rgba(16, 185, 129, 1)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: false,
                yAxisID: 'y-right',
                type: 'line',
                pointRadius: 7,
                pointBackgroundColor: 'rgba(16, 185, 129, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }
        ],
        // Dữ liệu bổ sung cho tooltip
        failedStudents: [420, 216, 120, 96, 300],
        totalStudents: [1200, 1200, 1200, 1200, 1200],
        passedStudents: [780, 984, 1080, 1104, 900]
    };

    /**
     * Dữ liệu tiến độ chấm thi và nhập điểm sau kỳ thi
     * Theo dõi tiến độ chấm bài và nhập điểm của các học phần
     */
    this.gradingProgressData = {
        labels: ['Ngày 1', 'Ngày 3', 'Ngày 5', 'Ngày 7', 'Ngày 10', 'Ngày 12', 'Ngày 14'],
        datasets: [
            {
                label: 'Đã chấm xong',
                data: [10, 35, 55, 70, 82, 91, 97],
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            },
            {
                label: 'Đã nhập điểm xong',
                data: [5, 20, 40, 60, 75, 87, 95],
                borderColor: 'rgba(249, 115, 22, 1)',
                backgroundColor: 'rgba(249, 115, 22, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointBackgroundColor: 'rgba(249, 115, 22, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                borderDash: [5, 5]
            }
        ],
        // Dữ liệu bổ sung cho tooltip
        gradedCount: [156, 546, 858, 1092, 1279, 1420, 1513],
        enteredCount: [78, 312, 624, 936, 1170, 1357, 1482],
        totalCount: 1560,
        pendingCourses: [
            ['Toán cao cấp 1', 'Vật lý đại cương', 'Hóa học đại cương'],
            ['Toán cao cấp 1', 'Vật lý đại cương'],
            ['Toán cao cấp 1'],
            ['Lập trình C++'],
            [],
            [],
            []
        ]
    };

    this.examStatsData = {
        labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
        datasets: [
            {
                label: 'Số môn thi',
                data: [45, 52, 38, 21],
                backgroundColor: 'rgba(99, 102, 241, 0.8)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 2,
                yAxisID: 'y'
            },
            {
                label: 'Số thí sinh',
                data: [2800, 3200, 2100, 1350],
                type: 'line',
                borderColor: 'rgba(34, 197, 94, 1)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                yAxisID: 'y1'
            }
        ]
    };

    this.gradeDistributionData = {
        labels: ['A (8.5-10)', 'B+ (7.0-8.4)', 'B (6.0-6.9)', 'C+ (5.5-5.9)', 'C (4.0-5.4)', 'D+ (3.5-3.9)', 'D (2.0-3.4)', 'F (0-1.9)'],
        datasets: [{
            label: 'Số sinh viên',
            data: [850, 1200, 1800, 1500, 1900, 800, 300, 100],
            backgroundColor: [
                'rgba(34, 197, 94, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(99, 102, 241, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(168, 85, 247, 0.8)',
                'rgba(239, 68, 68, 0.8)',
                'rgba(156, 163, 175, 0.8)',
                'rgba(75, 85, 99, 0.8)'
            ],
            borderColor: [
                'rgba(34, 197, 94, 1)',
                'rgba(59, 130, 246, 1)',
                'rgba(99, 102, 241, 1)',
                'rgba(245, 158, 11, 1)',
                'rgba(168, 85, 247, 1)',
                'rgba(239, 68, 68, 1)',
                'rgba(156, 163, 175, 1)',
                'rgba(75, 85, 99, 1)'
            ],
            borderWidth: 2
        }]
    };

    /**
     * Dữ liệu danh sách rủi ro thi cử theo khoa
     * Risk Score = Σ (Điểm chuẩn hoá × Trọng số)
     * Nhóm A: Chuẩn bị đề thi (20%)
     * Nhóm B: Tổ chức thi (40%)
     * Nhóm C: Chấm và nhập điểm (30%)
     * Nhóm D: Kết quả (10%)
     */
    this.riskListData = [
        {
            department: 'Khoa Công nghệ thông tin',
            riskScore: 85,
            riskLevel: 'high',
            reasons: ['Nộp đề trễ (18%)', 'Chấm, nhập điểm trễ hạn (20%)'],
            trend: 'up',
            trendValue: 12
        },
        {
            department: 'Khoa Trí tuệ nhân tạo',
            riskScore: 78,
            riskLevel: 'medium',
            reasons: ['Nộp đề trễ (15%)', 'Nhiều sự cố tổ chức thi (1.8/1000 SV)'],
            trend: 'up',
            trendValue: 8
        },
        {
            department: 'Khoa Kinh tế',
            riskScore: 72,
            riskLevel: 'medium',
            reasons: ['Điều chỉnh lịch thi nhiều (8%)', 'Điểm phúc khảo cao (4%)'],
            trend: 'up',
            trendValue: 6
        },
        {
            department: 'Khoa Kỹ thuật',
            riskScore: 55,
            riskLevel: 'medium',
            reasons: ['Có một số ca phải điều chỉnh (4%)', 'Tuân thủ chấm điểm tốt'],
            trend: 'stable',
            trendValue: 3
        },
        {
            department: 'Khoa An toàn thông tin',
            riskScore: 42,
            riskLevel: 'low',
            reasons: ['Lịch thi ổn định', 'Tuân thủ rất tốt'],
            trend: 'down',
            trendValue: -2
        }
    ];

    // ==================== INITIALIZATION ====================
    
    this.init = function() {
        console.log('🚀 Dashboard Phòng Khảo thí: Initializing...');
        this.renderStatsCards();
        this.renderQuickStats();
        this.renderRiskList();
        if (typeof Chart !== 'undefined') {
            this.initCharts();
        }
        this.updateLastUpdateTime();
        console.log('✅ Dashboard Phòng Khảo thí: Initialized successfully');
    };

    // ==================== RENDERING COMPONENTS ====================
    
    /**
     * Render Stats Cards
     */
    this.renderStatsCards = function() {
        const container = document.getElementById('statsCards');
        if (!container) return;

        container.innerHTML = this.kpiData.map(stat => {
            const trendClass = stat.trend === 'up' ? 'up' : 'down';
            const trendIcon = stat.trend === 'up' ? 'fa-arrow-up' : 'fa-arrow-down';
            
            // Đối với KPI cảnh báo (vi phạm), đảo ngược màu sắc
            let trendColorClass = trendClass;
            if (stat.isWarning) {
                trendColorClass = stat.trend === 'down' ? 'up' : 'down';
            }
            
            return `
                <div class="stat-card ${stat.color} fade-in" title="${stat.tooltip}">
                    <div class="stat-header">
                        <div class="stat-icon">
                            <i class="fa-solid ${stat.icon}"></i>
                        </div>
                        <div class="stat-trend ${trendColorClass}">
                            <i class="fa-solid ${trendIcon}"></i>
                            ${stat.trendValue}
                        </div>
                    </div>
                    <div class="stat-label">${stat.label}</div>
                    <div class="stat-value">${stat.value}</div>
                    <div class="stat-subtitle">${stat.subtext}</div>
                </div>
            `;
        }).join('');
    };

    this.renderQuickStats = function() {
        const container = document.getElementById('quickStats');
        if (!container) return;

        container.innerHTML = `
            <div class="quick-stat-item">
                <span class="quick-stat-label">Phòng thi:</span>
                <span class="quick-stat-value">85</span>
            </div>
            <div class="quick-stat-item">
                <span class="quick-stat-label">Giám thị:</span>
                <span class="quick-stat-value">170</span>
            </div>
            <div class="quick-stat-item">
                <span class="quick-stat-label">Điểm TB toàn trường:</span>
                <span class="quick-stat-value">6.8</span>
            </div>
            <div class="quick-stat-item">
                <span class="quick-stat-label">Tỷ lệ vi phạm:</span>
                <span class="quick-stat-value" style="color: #ef4444;">0.14%</span>
            </div>
        `;
    };

    this.renderRiskList = function() {
        const container = document.getElementById('riskListContainer');
        if (!container) return;

        const getRiskBadge = (level, score) => {
            const labels = { high: 'Cao', medium: 'Trung bình', low: 'Thấp' };
            return `<div class="risk-badge ${level}"><span class="risk-icon ${level}"></span>${labels[level]} (${score})</div>`;
        };

        const getTrendBadge = (trend, value) => {
            let icon = '', label = '';
            if (trend === 'up') {
                icon = value >= 10 ? '↑↑' : '↑';
                label = value >= 10 ? 'Tăng mạnh' : 'Tăng';
            } else if (trend === 'down') {
                icon = '↓';
                label = 'Giảm';
            } else {
                icon = '→';
                label = 'Ổn định';
            }
            return `<div class="risk-trend ${trend}"><span>${icon}</span><span>${label}</span></div>`;
        };

        const tableHTML = `
            <table class="risk-table">
                <thead>
                    <tr>
                        <th style="width: 30%;">Khoa quản lý học phần</th>
                        <th style="width: 20%;">Mức rủi ro</th>
                        <th style="width: 35%;">Nguyên nhân chính</th>
                        <th style="width: 15%;">Xu hướng</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.riskListData.map(item => `
                        <tr>
                            <td><div class="major-name">${item.department}</div></td>
                            <td>${getRiskBadge(item.riskLevel, item.riskScore)}</td>
                            <td><div class="risk-reason">${item.reasons.map(r => `• ${r}`).join('<br>')}</div></td>
                            <td>${getTrendBadge(item.trend, item.trendValue)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = tableHTML;
    };

    // ==================== CHARTS ====================
    
    this.initCharts = function() {
        if (typeof Chart === 'undefined') {
            console.error('❌ Chart.js not loaded');
            return;
        }
        console.log('📊 Initializing charts...');
        try {
            this.initExamPreparationChart();
            this.initGradingProgressChart();
            this.initFailRateAvgScoreChart();
            console.log('✅ All charts initialized');
        } catch (error) {
            console.error('❌ Error initializing charts:', error);
        }
    };

    this.initExamPreparationChart = function() {
        const canvas = document.getElementById('examPreparationChart');
        if (!canvas) return;

        const self = this;

        new Chart(canvas.getContext('2d'), {
            type: 'line',
            data: this.examPreparationData,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                legend: { 
                    display: true, 
                    position: 'top', 
                    labels: { 
                        fontSize: 12, 
                        padding: 15,
                        usePointStyle: true
                    } 
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    titleFontColor: '#1f2937',
                    titleFontSize: 14,
                    titleFontStyle: 'bold',
                    bodyFontColor: '#4b5563',
                    bodyFontSize: 13,
                    bodySpacing: 6,
                    borderColor: '#e5e7eb',
                    borderWidth: 2,
                    cornerRadius: 10,
                    xPadding: 15,
                    yPadding: 15,
                    callbacks: {
                        title: function(tooltipItems) {
                            return 'Ngày ' + tooltipItems[0].label;
                        },
                        label: function(tooltipItem, data) {
                            var label = data.datasets[tooltipItem.datasetIndex].label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += tooltipItem.yLabel.toFixed(1) + '%';
                            return label;
                        },
                        afterBody: function(tooltipItems, data) {
                            var index = tooltipItems[0].index;
                            var submittedCount = self.examPreparationData.submittedCount[index];
                            var totalCount = self.examPreparationData.totalCount;
                            var pendingDepts = self.examPreparationData.pendingDepartments[index];
                            
                            var result = [
                                '',
                                '📝 Số học phần đã nộp đề: ' + submittedCount + '/' + totalCount
                            ];
                            
                            if (pendingDepts && pendingDepts.length > 0) {
                                result.push('');
                                result.push('⚠️ Khoa chưa nộp đề:');
                                pendingDepts.forEach(function(dept) {
                                    result.push('  • ' + dept);
                                });
                            } else {
                                result.push('');
                                result.push('✅ Tất cả khoa đã nộp đề');
                            }
                            
                            return result;
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        gridLines: { 
                            display: true,
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Số ngày trước ngày thi',
                            fontSize: 13,
                            fontStyle: 'bold',
                            fontColor: '#1e293b'
                        },
                        ticks: {
                            fontSize: 12,
                            fontColor: '#475569'
                        }
                    }],
                    yAxes: [{
                        ticks: { 
                            beginAtZero: true, 
                            max: 100,
                            stepSize: 20,
                            callback: function(value) {
                                return value + '%';
                            },
                            fontSize: 11,
                            fontColor: '#64748b'
                        },
                        gridLines: { 
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false,
                            zeroLineColor: 'rgba(0, 0, 0, 0.1)'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: '% học phần có đề thi đã phê duyệt',
                            fontSize: 13,
                            fontStyle: 'bold',
                            fontColor: '#1e293b'
                        }
                    }]
                },
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
                }
            }
        });
    };

    this.initGradingProgressChart = function() {
        const canvas = document.getElementById('gradingProgressChart');
        if (!canvas) return;

        const self = this;

        new Chart(canvas.getContext('2d'), {
            type: 'line',
            data: this.gradingProgressData,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                legend: { 
                    display: true, 
                    position: 'top', 
                    labels: { 
                        fontSize: 12, 
                        padding: 15,
                        usePointStyle: true
                    } 
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    titleFontColor: '#1f2937',
                    titleFontSize: 14,
                    titleFontStyle: 'bold',
                    bodyFontColor: '#4b5563',
                    bodyFontSize: 13,
                    bodySpacing: 6,
                    borderColor: '#e5e7eb',
                    borderWidth: 2,
                    cornerRadius: 10,
                    xPadding: 15,
                    yPadding: 15,
                    callbacks: {
                        title: function(tooltipItems) {
                            return tooltipItems[0].label + ' sau kỳ thi';
                        },
                        label: function(tooltipItem, data) {
                            var label = data.datasets[tooltipItem.datasetIndex].label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += tooltipItem.yLabel.toFixed(1) + '%';
                            return label;
                        },
                        afterBody: function(tooltipItems, data) {
                            var index = tooltipItems[0].index;
                            var gradedCount = self.gradingProgressData.gradedCount[index];
                            var enteredCount = self.gradingProgressData.enteredCount[index];
                            var totalCount = self.gradingProgressData.totalCount;
                            var pendingCourses = self.gradingProgressData.pendingCourses[index];
                            
                            var result = [
                                '',
                                '📝 Túi bài đã chấm: ' + gradedCount + '/' + totalCount,
                                '💾 Túi bài đã nhập điểm: ' + enteredCount + '/' + totalCount
                            ];
                            
                            if (pendingCourses && pendingCourses.length > 0) {
                                result.push('');
                                result.push('⚠️ Học phần đã chấm chưa nhập điểm:');
                                pendingCourses.forEach(function(course) {
                                    result.push('  • ' + course);
                                });
                            } else {
                                result.push('');
                                result.push('✅ Tất cả đã nhập điểm');
                            }
                            
                            return result;
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        gridLines: { 
                            display: true,
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Số ngày sau ngày thi',
                            fontSize: 13,
                            fontStyle: 'bold',
                            fontColor: '#1e293b'
                        },
                        ticks: {
                            fontSize: 12,
                            fontColor: '#475569'
                        }
                    }],
                    yAxes: [{
                        ticks: { 
                            beginAtZero: true, 
                            max: 100,
                            stepSize: 20,
                            callback: function(value) {
                                return value + '%';
                            },
                            fontSize: 11,
                            fontColor: '#64748b'
                        },
                        gridLines: { 
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false,
                            zeroLineColor: 'rgba(0, 0, 0, 0.1)'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: '% hoàn thành',
                            fontSize: 13,
                            fontStyle: 'bold',
                            fontColor: '#1e293b'
                        }
                    }]
                },
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
                }
            }
        });
    };

    this.initFailRateAvgScoreChart = function() {
        const canvas = document.getElementById('failRateAvgScoreChart');
        if (!canvas) return;

        const self = this;

        new Chart(canvas.getContext('2d'), {
            type: 'bar',
            data: this.failRateAvgScoreData,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                legend: { 
                    display: true, 
                    position: 'top', 
                    labels: { 
                        fontSize: 12, 
                        padding: 15,
                        usePointStyle: true
                    } 
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    titleFontColor: '#1f2937',
                    titleFontSize: 14,
                    titleFontStyle: 'bold',
                    bodyFontColor: '#4b5563',
                    bodyFontSize: 13,
                    bodySpacing: 6,
                    borderColor: '#e5e7eb',
                    borderWidth: 2,
                    cornerRadius: 10,
                    xPadding: 15,
                    yPadding: 15,
                    callbacks: {
                        title: function(tooltipItems) {
                            return 'Khoa ' + tooltipItems[0].label;
                        },
                        label: function(tooltipItem, data) {
                            var datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
                            var value = tooltipItem.yLabel;
                            
                            if (tooltipItem.datasetIndex === 0) {
                                return datasetLabel + ': ' + value.toFixed(1) + '%';
                            } else {
                                return datasetLabel + ': ' + value.toFixed(2);
                            }
                        },
                        afterBody: function(tooltipItems, data) {
                            var index = tooltipItems[0].index;
                            var failedCount = self.failRateAvgScoreData.failedStudents[index];
                            var totalCount = self.failRateAvgScoreData.totalStudents[index];
                            var passedCount = self.failRateAvgScoreData.passedStudents[index];
                            var failRate = ((failedCount / totalCount) * 100).toFixed(1);
                            
                            var result = [
                                '',
                                '📊 Thống kê chi tiết:',
                                '  • Tổng số SV: ' + totalCount + ' sinh viên',
                                '  • SV đạt: ' + passedCount + ' sinh viên',
                                '  • SV không đạt: ' + failedCount + ' sinh viên',
                                '  • Tỷ lệ trượt: ' + failRate + '%'
                            ];
                            
                            return result;
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        gridLines: { 
                            display: true,
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Khoa',
                            fontSize: 13,
                            fontStyle: 'bold',
                            fontColor: '#1e293b'
                        },
                        ticks: {
                            fontSize: 12,
                            fontColor: '#475569'
                        }
                    }],
                    yAxes: [
                        {
                            id: 'y-left',
                            position: 'left',
                            ticks: { 
                                beginAtZero: true,
                                max: 50,
                                stepSize: 10,
                                callback: function(value) {
                                    return value + '%';
                                },
                                fontSize: 11,
                                fontColor: '#64748b'
                            },
                            gridLines: { 
                                color: 'rgba(0, 0, 0, 0.05)',
                                drawBorder: false,
                                zeroLineColor: 'rgba(0, 0, 0, 0.1)'
                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'Tỷ lệ trượt (%)',
                                fontSize: 13,
                                fontStyle: 'bold',
                                fontColor: '#3b82f6'
                            }
                        },
                        {
                            id: 'y-right',
                            position: 'right',
                            ticks: { 
                                beginAtZero: false,
                                min: 5.0,
                                max: 9.0,
                                stepSize: 0.5,
                                callback: function(value) {
                                    return value.toFixed(1);
                                },
                                fontSize: 11,
                                fontColor: '#64748b'
                            },
                            gridLines: { 
                                drawOnChartArea: false,
                                drawBorder: false
                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'Điểm trung bình (thang 10)',
                                fontSize: 13,
                                fontStyle: 'bold',
                                fontColor: '#10b981'
                            }
                        }
                    ]
                },
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
                }
            }
        });
    };

    this.initExamStatsChart = function() {
        const canvas = document.getElementById('examStatsChart');
        if (!canvas) return;

        new Chart(canvas.getContext('2d'), {
            type: 'bar',
            data: this.examStatsData,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                legend: { display: true, position: 'top', labels: { fontSize: 12, padding: 15 } },
                tooltips: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleFontColor: '#1f2937',
                    bodyFontColor: '#4b5563',
                    borderColor: '#e5e7eb',
                    borderWidth: 2,
                    cornerRadius: 8
                },
                scales: {
                    yAxes: [
                        { id: 'y', beginAtZero: true, position: 'left', gridLines: { color: 'rgba(0, 0, 0, 0.05)' } },
                        { id: 'y1', beginAtZero: true, position: 'right', gridLines: { drawOnChartArea: false } }
                    ]
                }
            }
        });
    };

    this.initGradeDistributionChart = function() {
        const canvas = document.getElementById('gradeDistributionChart');
        if (!canvas) return;

        new Chart(canvas.getContext('2d'), {
            type: 'bar',
            data: this.gradeDistributionData,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                legend: { display: true, position: 'top', labels: { fontSize: 12, padding: 15 } },
                tooltips: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleFontColor: '#1f2937',
                    bodyFontColor: '#4b5563',
                    borderColor: '#e5e7eb',
                    borderWidth: 2,
                    cornerRadius: 8
                },
                scales: {
                    yAxes: [{
                        ticks: { beginAtZero: true },
                        gridLines: { color: 'rgba(0, 0, 0, 0.05)' }
                    }]
                }
            }
        });
    };

    this.updateLastUpdateTime = function() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const dateString = now.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
        console.log(`Last update: ${timeString} - ${dateString}`);
    };

    // ==================== EVENT HANDLERS ====================
    
    this.bindEvents = function() {
        const applyBtn = document.getElementById('applyFilters');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                console.log('Applying filters...');
                this.applyFilters();
            });
        }

        const resetBtn = document.getElementById('resetFilters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                console.log('Resetting filters...');
                this.resetFilters();
            });
        }
    };

    this.applyFilters = function() {
        const filters = {
            year: document.getElementById('yearFilter')?.value,
            semester: document.getElementById('semesterFilter')?.value,
            level: document.getElementById('levelFilter')?.value,
            unit: document.getElementById('unitFilter')?.value
        };

        console.log('Applying filters:', filters);
        
        // Simulate API call
        setTimeout(() => {
            console.log('Filters applied successfully');
        }, 500);
    };

    this.resetFilters = function() {
        document.getElementById('yearFilter').value = '2024-2025';
        document.getElementById('semesterFilter').value = '';
        document.getElementById('levelFilter').value = '';
        document.getElementById('unitFilter').value = '';
        
        console.log('Filters reset to default');
        this.applyFilters();
    };
}

// Initialize
var main_doc = {};
main_doc['DashboardPhongKhaoThi'] = new DashboardPhongKhaoThi();

$(document).ready(function () {
    main_doc.DashboardPhongKhaoThi.init();
    main_doc.DashboardPhongKhaoThi.bindEvents();
});