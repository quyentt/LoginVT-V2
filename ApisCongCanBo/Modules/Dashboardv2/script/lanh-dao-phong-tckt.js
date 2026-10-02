/**
 * ============================================
 * DASHBOARD LÃNH ĐẠO PHÒNG TCKT - BACKEND LOGIC
 * Xử lý dữ liệu và render các component
 * Version: 2.0.0
 * ============================================
 */

function DashboardPhongTCKT() {
    'use strict';
    
    // ==================== PROPERTIES ====================
    
    /**
     * Dữ liệu KPI Cards
     */
    this.kpiData = [
        {
            id: 'kpi1',
            icon: 'fa-dollar-sign',
            label: 'Tổng thu năm 2024',
            category: 'Tổng thu',
            value: '450 tỷ',
            trend: 'up',
            trendValue: '+12%',
            subtext: 'so với năm 2023',
            color: 'yellow',
            tooltip: 'Tổng thu nhập năm 2024'
        },
        {
            id: 'kpi2',
            icon: 'fa-credit-card',
            label: 'Thu học phí',
            category: 'Học phí',
            value: '380 tỷ',
            trend: 'up',
            trendValue: '95% kế hoạch',
            subtext: 'đạt mục tiêu',
            color: 'green',
            tooltip: 'Thu học phí đạt 95% kế hoạch'
        },
        {
            id: 'kpi3',
            icon: 'fa-chart-line',
            label: 'Tổng chi phí',
            category: 'Chi phí',
            value: '320 tỷ',
            trend: 'up',
            trendValue: '+8%',
            subtext: 'tăng hợp lý',
            color: 'red',
            tooltip: 'Tổng chi phí năm 2024'
        },
        {
            id: 'kpi4',
            icon: 'fa-chart-pie',
            label: 'Lợi nhuận',
            category: 'Lợi nhuận',
            value: '130 tỷ',
            trend: 'up',
            trendValue: '+18%',
            subtext: 'tăng trưởng tốt',
            color: 'blue',
            tooltip: 'Lợi nhuận năm 2024'
        }
    ];

    /**
     * Dữ liệu thu học phí theo học kỳ
     */
    this.tuitionTrendData = {
        labels: ['HK1 22-23', 'HK2 22-23', 'HK1 23-24', 'HK2 23-24', 'HK1 24-25', 'HK2 24-25'],
        datasets: [
            {
                label: 'Đã thu (tỷ)',
                type: 'bar',
                data: [3.5, 3.2, 3.1, 2.9, 2.8, 2.6],
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2,
                yAxisID: 'y-axis-1'
            },
            {
                label: 'Phải thu (tỷ)',
                type: 'bar',
                data: [3.7, 3.5, 3.4, 3.2, 3.5, 3.3],
                backgroundColor: 'rgba(203, 213, 225, 0.5)',
                borderColor: 'rgba(148, 163, 184, 1)',
                borderWidth: 1,
                yAxisID: 'y-axis-1'
            },
            {
                label: 'Tỷ lệ hoàn thành (%)',
                type: 'line',
                data: [94.6, 91.4, 91.2, 90.6, 80, 78.8],
                borderColor: 'rgba(245, 158, 11, 1)',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                yAxisID: 'y-axis-2',
                fill: false,
                pointRadius: 6,
                pointBackgroundColor: 'rgba(245, 158, 11, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }
        ]
    };

    /**
     * Dữ liệu công nợ học phí theo khóa
     */
    this.debtData = {
        labels: ['K2018', 'K2019', 'K2020', 'K2021', 'K2022', 'K2023', 'K2024', 'K2017', 'K2016', 'K2015'],
        datasets: [{
            label: 'Công nợ học phí',
            data: [1250, 980, 850, 720, 650, 580, 420, 380, 320, 280],
            backgroundColor: [
                'rgba(239, 68, 68, 0.85)',
                'rgba(239, 68, 68, 0.75)',
                'rgba(239, 68, 68, 0.65)',
                'rgba(245, 158, 11, 0.85)',
                'rgba(245, 158, 11, 0.75)',
                'rgba(245, 158, 11, 0.65)',
                'rgba(59, 130, 246, 0.85)',
                'rgba(59, 130, 246, 0.75)',
                'rgba(59, 130, 246, 0.65)',
                'rgba(59, 130, 246, 0.55)'
            ],
            borderColor: [
                'rgba(239, 68, 68, 1)',
                'rgba(239, 68, 68, 1)',
                'rgba(239, 68, 68, 1)',
                'rgba(245, 158, 11, 1)',
                'rgba(245, 158, 11, 1)',
                'rgba(245, 158, 11, 1)',
                'rgba(59, 130, 246, 1)',
                'rgba(59, 130, 246, 1)',
                'rgba(59, 130, 246, 1)',
                'rgba(59, 130, 246, 1)'
            ],
            borderWidth: 2,
            studentCount: [485, 398, 345, 298, 265, 238, 185, 158, 135, 118],
            debtRatio: [22.5, 18.2, 16.5, 14.8, 13.2, 11.8, 8.5, 7.8, 6.5, 5.8]
        }]
    };

    /**
     * Dữ liệu xu hướng thu học phí theo tháng
     */
    this.monthlyTrendData = {
        labels: ['Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
        datasets: [
            {
                label: 'Đã thu (tỷ)',
                type: 'bar',
                data: [1, 0.8, 1.2, 1.1, 1],
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2,
                yAxisID: 'y-axis-1'
            },
            {
                label: 'Mục tiêu (tỷ)',
                type: 'line',
                data: [0.9, 1, 1, 1, 1],
                borderColor: 'rgba(16, 185, 129, 1)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                yAxisID: 'y-axis-1',
                fill: false,
                pointRadius: 5,
                pointBackgroundColor: 'rgba(16, 185, 129, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                borderDash: [5, 5]
            },
            {
                label: 'Tỷ lệ thu (%)',
                type: 'line',
                data: [111, 80, 120, 110, 100],
                borderColor: 'rgba(239, 68, 68, 1)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                yAxisID: 'y-axis-2',
                fill: false,
                pointRadius: 6,
                pointBackgroundColor: 'rgba(239, 68, 68, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }
        ]
    };

    /**
     * Dữ liệu danh sách rủi ro tài chính
     */
    this.riskListData = [
        {
            major: 'Công nghệ thông tin',
            riskScore: 85,
            riskLevel: 'high',
            reasons: ['Tỷ lệ nợ quá hạn cao (12%)', 'Doanh thu giảm 8% so với năm trước'],
            trend: 'up',
            trendValue: 12
        },
        {
            major: 'Kế toán - Kiểm toán',
            riskScore: 78,
            riskLevel: 'medium',
            reasons: ['Tỷ lệ miễn giảm cao (14%)', 'Chưa đạt kế hoạch thu (88%)'],
            trend: 'up',
            trendValue: 8
        },
        {
            major: 'Quản trị kinh doanh',
            riskScore: 72,
            riskLevel: 'medium',
            reasons: ['Nợ học phí cao (18%)', 'Tiệm cận kế hoạch (92%)'],
            trend: 'up',
            trendValue: 6
        },
        {
            major: 'Tài chính - Ngân hàng',
            riskScore: 55,
            riskLevel: 'medium',
            reasons: ['Tỷ lệ nợ ở mức chấp nhận (8%)', 'Quyết toán trễ hạn (12%)'],
            trend: 'stable',
            trendValue: 3
        },
        {
            major: 'Luật kinh tế',
            riskScore: 42,
            riskLevel: 'low',
            reasons: ['Đạt kế hoạch thu (102%)', 'Công nợ rất tốt (3%)'],
            trend: 'down',
            trendValue: -2
        }
    ];

    // ==================== INITIALIZATION ====================
    
    this.init = function() {
        console.log('🚀 Dashboard Phòng TCKT: Initializing...');
        this.loadData();
        this.renderStatsCards();
        this.renderQuickStats();
        this.renderRiskList();
        if (typeof Chart !== 'undefined') {
            this.initCharts();
        }
        this.bindEvents();
        this.updateLastUpdateTime();
        console.log('✅ Dashboard Phòng TCKT: Initialized successfully');
    };

    // ==================== DATA LOADING ====================
    
    this.loadData = function() {
        console.log('📊 Loading data...');
        this.showLoadingState();
        setTimeout(() => {
            this.hideLoadingState();
            this.updateSystemStatus('Hoạt động bình thường');
            console.log('✅ Data loaded successfully');
        }, 1000);
    };

    this.showLoadingState = function() {
        const statsContainer = document.getElementById('statsCards');
        if (statsContainer) {
            statsContainer.innerHTML = Array(4).fill(0).map(() => `
                <div class="stat-card" style="height: 180px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite;"></div>
            `).join('');
        }
    };

    this.hideLoadingState = function() {
        this.renderStatsCards();
        this.renderQuickStats();
        this.renderRiskList();
    };

    this.updateSystemStatus = function(status) {
        const statusElement = document.getElementById('systemStatus');
        if (statusElement) {
            statusElement.textContent = status;
        }
    };

    // ==================== RENDERING COMPONENTS ====================
    
    this.renderStatsCards = function() {
        const container = document.getElementById('statsCards');
        if (!container) return;

        container.innerHTML = this.kpiData.map(stat => {
            const trendClass = stat.trend === 'up' ? 'up' : 'down';
            const trendIcon = stat.trend === 'up' ? 'fa-arrow-up' : 'fa-arrow-down';
            
            return `
                <div class="stat-card ${stat.color} fade-in" title="${stat.tooltip}">
                    <div class="stat-header">
                        <div class="stat-icon">
                            <i class="fa-solid ${stat.icon}"></i>
                        </div>
                        <div class="stat-trend ${trendClass}">
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
                <span class="quick-stat-label">Tỷ suất lợi nhuận:</span>
                <span class="quick-stat-value">28.9%</span>
            </div>
            <div class="quick-stat-item">
                <span class="quick-stat-label">Nợ xấu:</span>
                <span class="quick-stat-value" style="color: #dc2626;">2.1%</span>
            </div>
            <div class="quick-stat-item">
                <span class="quick-stat-label">Thanh khoản:</span>
                <span class="quick-stat-value" style="color: #3b82f6;">1.8</span>
            </div>
            <div class="quick-stat-item">
                <span class="quick-stat-label">ROI:</span>
                <span class="quick-stat-value">15.2%</span>
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
                        <th style="width: 25%;">Ngành/CTĐT</th>
                        <th style="width: 20%;">Mức rủi ro</th>
                        <th style="width: 40%;">Nguyên nhân chính</th>
                        <th style="width: 15%;">Xu hướng</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.riskListData.map(item => `
                        <tr>
                            <td><div class="major-name">${item.major}</div></td>
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
            this.initTuitionTrendChart();
            this.initDebtChart();
            this.initMonthlyTrendChart();
            console.log('✅ All charts initialized');
        } catch (error) {
            console.error('❌ Error initializing charts:', error);
        }
    };

    this.initTuitionTrendChart = function() {
        const canvas = document.getElementById('tuitionTrendChart');
        if (!canvas) return;

        new Chart(canvas.getContext('2d'), {
            type: 'bar',
            data: this.tuitionTrendData,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                legend: { display: true, position: 'bottom', labels: { fontSize: 12, padding: 15, usePointStyle: true } },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleFontColor: '#1f2937',
                    bodyFontColor: '#4b5563',
                    borderColor: '#e5e7eb',
                    borderWidth: 2,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(tooltipItem, data) {
                            var label = data.datasets[tooltipItem.datasetIndex].label || '';
                            if (label) label += ': ';
                            if (tooltipItem.datasetIndex === 2) {
                                label += tooltipItem.yLabel.toFixed(1) + '%';
                            } else {
                                label += tooltipItem.yLabel.toFixed(1) + ' tỷ';
                            }
                            return label;
                        }
                    }
                },
                scales: {
                    xAxes: [{ gridLines: { display: false }, scaleLabel: { display: true, labelString: 'Học kỳ', fontSize: 12, fontStyle: 'bold' } }],
                    yAxes: [
                        { id: 'y-axis-1', type: 'linear', position: 'left', ticks: { beginAtZero: true, callback: function(value) { return value.toFixed(1) + ' tỷ'; } }, scaleLabel: { display: true, labelString: 'Số tiền (tỷ VNĐ)', fontSize: 12, fontStyle: 'bold' }, gridLines: { color: 'rgba(0, 0, 0, 0.05)' } },
                        { id: 'y-axis-2', type: 'linear', position: 'right', ticks: { beginAtZero: true, max: 100, stepSize: 10, callback: function(value) { return value + '%'; } }, scaleLabel: { display: true, labelString: 'Tỷ lệ hoàn thành (%)', fontSize: 12, fontStyle: 'bold' }, gridLines: { drawOnChartArea: false } }
                    ]
                }
            }
        });
    };

    this.initDebtChart = function() {
        const canvas = document.getElementById('debtChart');
        if (!canvas) return;
        
        new Chart(canvas.getContext('2d'), {
            type: 'bar',
            data: this.debtData,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                legend: { display: false },
                tooltips: {
                    enabled: true,
                    mode: 'single',
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    titleFontColor: '#1f2937',
                    titleFontSize: 14,
                    titleFontStyle: 'bold',
                    bodyFontColor: '#4b5563',
                    bodyFontSize: 13,
                    borderColor: '#e5e7eb',
                    borderWidth: 2,
                    cornerRadius: 10,
                    xPadding: 15,
                    yPadding: 15,
                    displayColors: false,
                    callbacks: {
                        title: function(tooltipItems, data) {
                            return '🎓 Khóa ' + data.labels[tooltipItems[0].index];
                        },
                        label: function(tooltipItem) {
                            return '💰 Tổng nợ học phí: ' + tooltipItem.yLabel.toLocaleString('vi-VN') + ' triệu VNĐ';
                        },
                        afterLabel: function(tooltipItem, data) {
                            var dataset = data.datasets[0];
                            var studentCount = dataset.studentCount[tooltipItem.index];
                            var debtRatio = dataset.debtRatio[tooltipItem.index];
                            return [
                                '👥 Tổng số sinh viên còn nợ: ' + studentCount.toLocaleString('vi-VN') + ' SV',
                                '📊 Tỷ lệ nợ so với toàn trường: ' + debtRatio + '%'
                            ];
                        },
                        footer: function() {
                            return '\n⚠️ Cần theo dõi và xử lý công nợ';
                        }
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontSize: 11,
                            fontColor: '#64748b',
                            callback: function(value) {
                                if (value >= 1000) return (value / 1000).toFixed(1) + ' tỷ';
                                return value.toLocaleString('vi-VN') + ' tr';
                            }
                        },
                        scaleLabel: { display: true, labelString: 'Tổng số tiền học phí còn nợ (triệu VNĐ)', fontSize: 13, fontStyle: 'bold', fontColor: '#1e293b' },
                        gridLines: { color: 'rgba(0, 0, 0, 0.06)', drawBorder: false, zeroLineColor: 'rgba(0, 0, 0, 0.1)' }
                    }],
                    xAxes: [{
                        gridLines: { display: false, drawBorder: true, borderColor: '#e2e8f0' },
                        ticks: { fontSize: 12, fontColor: '#475569', autoSkip: false, maxRotation: 0, minRotation: 0 },
                        scaleLabel: { display: true, labelString: 'Khóa học', fontSize: 13, fontStyle: 'bold', fontColor: '#1e293b' }
                    }]
                },
                animation: { duration: 1500, easing: 'easeInOutQuart' }
            }
        });
    };

    this.initMonthlyTrendChart = function() {
        const canvas = document.getElementById('monthlyTrendChart');
        if (!canvas) return;

        new Chart(canvas.getContext('2d'), {
            type: 'bar',
            data: this.monthlyTrendData,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                legend: { display: true, position: 'bottom', labels: { fontSize: 12, padding: 15, usePointStyle: true } },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    titleFontColor: '#1f2937',
                    titleFontSize: 14,
                    bodyFontColor: '#4b5563',
                    bodyFontSize: 13,
                    borderColor: '#e5e7eb',
                    borderWidth: 2,
                    cornerRadius: 10,
                    xPadding: 15,
                    yPadding: 15,
                    callbacks: {
                        label: function(tooltipItem, data) {
                            var label = data.datasets[tooltipItem.datasetIndex].label || '';
                            if (label) label += ': ';
                            if (tooltipItem.datasetIndex === 2) {
                                label += tooltipItem.yLabel.toFixed(0) + '%';
                            } else {
                                label += tooltipItem.yLabel.toFixed(2) + ' tỷ';
                            }
                            return label;
                        }
                    }
                },
                scales: {
                    xAxes: [{ gridLines: { display: false, drawBorder: true, borderColor: '#e2e8f0' }, scaleLabel: { display: true, labelString: 'Tháng', fontSize: 13, fontStyle: 'bold', fontColor: '#1e293b' }, ticks: { fontSize: 12, fontColor: '#475569' } }],
                    yAxes: [
                        { id: 'y-axis-1', type: 'linear', position: 'left', ticks: { beginAtZero: true, fontSize: 11, fontColor: '#64748b', callback: function(value) { return value.toFixed(1) + ' tỷ'; } }, scaleLabel: { display: true, labelString: 'Số tiền (tỷ VNĐ)', fontSize: 13, fontStyle: 'bold', fontColor: '#1e293b' }, gridLines: { color: 'rgba(0, 0, 0, 0.06)', drawBorder: false, zeroLineColor: 'rgba(0, 0, 0, 0.1)' } },
                        { id: 'y-axis-2', type: 'linear', position: 'right', ticks: { beginAtZero: true, max: 150, stepSize: 30, fontSize: 11, fontColor: '#64748b', callback: function(value) { return value + '%'; } }, scaleLabel: { display: true, labelString: 'Tỷ lệ thu (%)', fontSize: 13, fontStyle: 'bold', fontColor: '#1e293b' }, gridLines: { drawOnChartArea: false, drawBorder: false } }
                    ]
                },
                animation: { duration: 1500, easing: 'easeInOutQuart' }
            }
        });
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
        this.showLoadingState();
        setTimeout(() => {
            this.hideLoadingState();
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

    // ==================== UTILITIES ====================
    
    this.updateLastUpdateTime = function() {
        const timeElement = document.getElementById('lastUpdateTime');
        if (timeElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const dateString = now.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
            timeElement.textContent = `${timeString} - ${dateString}`;
        }
    };
}
