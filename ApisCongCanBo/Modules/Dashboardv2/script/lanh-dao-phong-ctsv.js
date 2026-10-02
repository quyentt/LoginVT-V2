/**
 * ============================================
 * DASHBOARD LÃNH ĐẠO PHÒNG CTSV - BACKEND LOGIC
 * Xử lý dữ liệu và render các component
 * Version: 2.0.0
 * ============================================
 */

function DashboardPhongCTSV() {
    'use strict';

    this.buildSignature = 'CTSV_DV2_2026-04-06_4filters_kpi4';

    // ==================== PROPERTIES ====================

    // KPI được tính từ metrics (để filter và trend luôn đúng theo spec)
    this.kpiData = [];

    // Mock metrics: current vs previous (kỳ trước / cùng kỳ năm trước)
    // Trend trong bảng CTSV tính theo SỐ LƯỢNG (numerator) giữa current và previous
    this.baseMetrics = {
        current: {
            totalStudents: 12800,
            extracurricularParticipants: 4200,
            disciplinedStudents: 36,
            policyBeneficiaries: 1250,
            oneStopRequests: 3013
        },
        previous: {
            totalStudents: 12500,
            extracurricularParticipants: 4050,
            disciplinedStudents: 48,
            policyBeneficiaries: 1320,
            oneStopRequests: 2776
        }
    };

    // Row 3: Risk list theo khoa (mock)
    // current vs previous: phục vụ xu hướng (so với cùng kỳ trước)
    this.baseRiskByFaculty = [
        {
            faculty: 'Công nghệ thông tin',
            current: { disciplinePct: 1.2, extracurricularPct: 28, dropoutPct: 6.5, counselingPer1000: 1.4 },
            previous: { disciplinePct: 1.0, extracurricularPct: 35, dropoutPct: 5.8, counselingPer1000: 1.1 }
        },
        {
            faculty: 'Trí tuệ nhân tạo',
            current: { disciplinePct: 2.4, extracurricularPct: 42, dropoutPct: 12.2, counselingPer1000: 2.2 },
            previous: { disciplinePct: 1.8, extracurricularPct: 48, dropoutPct: 9.0, counselingPer1000: 1.7 }
        },
        {
            faculty: 'An toàn thông tin',
            current: { disciplinePct: 0.8, extracurricularPct: 74, dropoutPct: 4.2, counselingPer1000: 0.6 },
            previous: { disciplinePct: 1.1, extracurricularPct: 69, dropoutPct: 4.8, counselingPer1000: 0.8 }
        }
    ];

    this.activityData = {
        labels: ['Tư vấn học tập', 'Hỗ trợ tâm lý', 'Ngoại khóa', 'Học bổng', 'Kỷ luật', 'Khác'],
        datasets: [
            {
                label: 'Số lượng',
                data: [850, 320, 450, 1250, 18, 125],
                backgroundColor: [
                    'rgba(244, 63, 94, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(156, 163, 175, 0.8)'
                ],
                borderColor: [
                    'rgba(244, 63, 94, 1)',
                    'rgba(59, 130, 246, 1)',
                    'rgba(34, 197, 94, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(156, 163, 175, 1)'
                ],
                borderWidth: 2
            }
        ]
    };

    this.scholarshipData = {
        labels: ['T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        datasets: [
            {
                label: 'HB học tập',
                data: [180, 200, 220, 250, 280, 300],
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 2
            },
            {
                label: 'Hỗ trợ xã hội',
                data: [120, 135, 150, 165, 180, 200],
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2
            },
            {
                label: 'HB khuyến khích',
                data: [80, 90, 100, 110, 120, 130],
                backgroundColor: 'rgba(245, 158, 11, 0.8)',
                borderColor: 'rgba(245, 158, 11, 1)',
                borderWidth: 2
            }
        ]
    };

    // HÀNG 2 - Biểu đồ A (2x1): Xu hướng SV vi phạm kỷ luật theo tháng trong năm học
    // Trục X: Tháng trong năm học (09..04), Trục Y: Số SV vi phạm
    // 3 đường dữ liệu: Khiển trách / Cảnh cáo / Đình chỉ - Buộc thôi học
    this.disciplineTrendData = {
        labels: ['9', '10', '11', '12', '1', '2', '3', '4'],
        datasets: [
            {
                label: 'Khiển trách',
                data: [3, 4, 5, 4, 6, 5, 7, 6],
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.12)',
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                fill: false,
                tension: 0
            },
            {
                label: 'Cảnh cáo',
                data: [1, 1, 2, 2, 2, 3, 3, 4],
                borderColor: 'rgba(245, 158, 11, 1)',
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                borderWidth: 2,
                borderDash: [6, 4],
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: 'rgba(245, 158, 11, 1)',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                fill: false,
                tension: 0
            },
            {
                label: 'Đình chỉ / buộc thôi học',
                data: [0, 0, 1, 0, 1, 1, 1, 2],
                borderColor: 'rgba(34, 197, 94, 1)',
                backgroundColor: 'rgba(34, 197, 94, 0.12)',
                borderWidth: 2,
                borderDash: [2, 3],
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: 'rgba(34, 197, 94, 1)',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                fill: false,
                tension: 0
            }
        ]
    };

    this.charts = {
        activity: null,
        scholarship: null,
        discipline: null,
        dropoutRate: null,
        trainingClassification: null
    };

    this.baseData = null;
    this.currentFilters = {
        year: '2024-2025',
        semester: '',
        level: 'all',
        unit: 'toan-truong'
    };

    // ==================== INITIALIZATION ====================

    this.init = function() {
        console.log('🚀 Dashboard Phòng CTSV: Initializing...');

        this.applyBuildSignature();
        this.validateDom();

        // Lưu dữ liệu gốc để có thể filter/re-render nhiều lần
        if (!this.baseData) {
            this.baseData = {
                metrics: JSON.parse(JSON.stringify(this.baseMetrics)),
                activityData: JSON.parse(JSON.stringify(this.activityData)),
                scholarshipData: JSON.parse(JSON.stringify(this.scholarshipData)),
                disciplineTrendData: JSON.parse(JSON.stringify(this.disciplineTrendData)),
                dropoutRateData: JSON.parse(JSON.stringify(this.dropoutRateData)),
                trainingClassificationTemplates: JSON.parse(JSON.stringify(this.trainingClassificationTemplates))
            };
        }

        // Tính KPI lần đầu theo metrics
        this.computeKpis(this.getMetricsByFilters(this.currentFilters));

        this.loadData();
        this.renderStatsCards();
        this.renderQuickStats();
        this.renderRiskList();

        if (typeof Chart !== 'undefined') {
            this.initCharts();
        } else {
            console.warn('⚠️ Chart.js chưa load, sẽ khởi tạo charts sau khi load xong');
        }

        this.bindEvents();
        this.updateLastUpdateTime();

        console.log('✅ Dashboard Phòng CTSV: Initialized successfully');
    };

    this.applyBuildSignature = function() {
        try {
            window.__DASHBOARD_CTSV_BUILD__ = this.buildSignature;
            if (window.console && typeof window.console.log === 'function') {
                console.log('🧩 CTSV build:', this.buildSignature);
            }

            const root = document.querySelector('.dashboard-phong-ctsv');
            if (root) root.setAttribute('data-build', this.buildSignature);
        } catch (e) {
            // ignore
        }
    };

    this.validateDom = function() {
        const requiredIds = ['yearFilter', 'semesterFilter', 'levelFilter', 'unitFilter', 'applyFilters', 'resetFilters', 'statsCards', 'quickStats'];
        const missing = requiredIds.filter((id) => !document.getElementById(id));
        if (missing.length) {
            console.error('❌ CTSV dashboard DOM missing:', missing.join(', '));
            console.error('↳ Khả năng cao đang load nhầm/phiên bản cũ HTML. Hãy kiểm tra cấu hình CHỨC NĂNG (DUONGDANFILE) đang trỏ tới đúng /Modules/Dashboardv2/html/lanh-dao-phong-ctsv.html (app: ApisCongCanBo).');
        }
    };

    // ==================== DATA LOADING ====================

    this.loadData = function() {
        this.showLoadingState();

        setTimeout(() => {
            this.hideLoadingState();
            this.updateSystemStatus('Hoạt động bình thường');
        }, 600);
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

    // ==================== RENDERING ====================

    this.renderStatsCards = function() {
        const container = document.getElementById('statsCards');
        if (!container) return;

        container.innerHTML = this.kpiData.map(stat => {
            const direction = stat.trendDirection || stat.trend || 'up';
            const trendIcon = direction === 'up' ? 'fa-arrow-up' : (direction === 'down' ? 'fa-arrow-down' : 'fa-minus');
            const trendClass = this.getTrendClass(stat);
            const colorClass = stat.color || 'rose';

            const title = this.escapeHtml([stat.tooltip, stat.updateType].filter(Boolean).join(' | '));
            const valueSuffix = stat.valueSuffix ? `<span style="font-size: 13px; font-weight: 600; color: #64748b;">${this.escapeHtml(stat.valueSuffix)}</span>` : '';

            return `
                <div class="stat-card ${colorClass} fade-in" title="${title}">
                    <div class="stat-header">
                        <div class="stat-icon">
                            <i class="fa-solid ${stat.icon}"></i>
                        </div>
                        <div class="stat-trend ${trendClass}">
                            <i class="fa-solid ${trendIcon}"></i>
                            ${stat.trendValue}
                        </div>
                    </div>
                    <div class="stat-value">${stat.value}${valueSuffix}</div>
                    <div class="stat-label">${stat.label}</div>
                    <div class="stat-subtitle">${stat.subtext}</div>
                </div>
            `;
        }).join('');
    };

    this.renderQuickStats = function() {
        const container = document.getElementById('quickStats');
        if (!container) return;

        const extracurricularRate = this.parseNumber(this.getKpiValueById('kpi1'));
        const disciplinePer1000 = this.parseNumber(this.getKpiValueById('kpi2'));
        const policyRate = this.parseNumber(this.getKpiValueById('kpi3'));
        const oneStopRequests = this.parseNumber(this.getKpiValueById('kpi4'));
        const activityTotal = this.sumDataset(this.activityData);

        container.innerHTML = `
            <div class="quick-stat-item">
                <span class="quick-stat-label">% tham gia ngoại khóa</span>
                <span class="quick-stat-value">${extracurricularRate.toFixed(1)}%</span>
            </div>
            <div class="quick-stat-item">
                <span class="quick-stat-label">Hoạt động/nhu cầu</span>
                <span class="quick-stat-value">${this.formatInt(activityTotal)}</span>
            </div>
            <div class="quick-stat-item">
                <span class="quick-stat-label">% hưởng chính sách</span>
                <span class="quick-stat-value">${policyRate.toFixed(1)}%</span>
            </div>
            <div class="quick-stat-item">
                <span class="quick-stat-label">Vi phạm /1000 SV</span>
                <span class="quick-stat-value">${disciplinePer1000.toFixed(1)}</span>
            </div>
            <div class="quick-stat-item">
                <span class="quick-stat-label">Yêu cầu một cửa</span>
                <span class="quick-stat-value">${this.formatInt(oneStopRequests)}</span>
            </div>
        `;
    };

    // ==================== CHARTS ====================

    this.getBaseChartOptions = function() {
        return {
            responsive: true,
            maintainAspectRatio: true,
            legend: {
                display: true,
                position: 'top',
                labels: { fontSize: 12, padding: 15, usePointStyle: true }
            },
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
                yPadding: 15
            },
            scales: {
                xAxes: [
                    {
                        gridLines: { display: false, drawBorder: true, borderColor: '#e2e8f0' },
                        ticks: { fontSize: 12, fontColor: '#475569', autoSkip: false, maxRotation: 0, minRotation: 0 }
                    }
                ],
                yAxes: [
                    {
                        ticks: { beginAtZero: true, fontSize: 11, fontColor: '#64748b' },
                        gridLines: { color: 'rgba(0, 0, 0, 0.06)', drawBorder: false, zeroLineColor: 'rgba(0, 0, 0, 0.1)' }
                    }
                ]
            },
            animation: { duration: 1500, easing: 'easeInOutQuart' }
        };
    };

    this.destroyCharts = function() {
        Object.keys(this.charts).forEach(key => {
            if (this.charts[key] && typeof this.charts[key].destroy === 'function') {
                this.charts[key].destroy();
            }
            this.charts[key] = null;
        });
    };

    this.initCharts = function() {
        this.destroyCharts();

        this.initDisciplineChart();
        this.initDropoutRateChart();
        this.initTrainingClassificationChart();
    };

    // Biểu đồ B: Tỷ lệ SV tạm nghỉ / thôi học
    // % SV nghỉ học = (SV xin nghỉ học tạm thời + SV thôi học) / Tổng SV đang học * 100
    // Mock theo ảnh minh hoạ: so sánh giữa các khóa theo học kỳ/năm học
    this.dropoutRateData = {
        labels: ['HK1\n22-23', 'HK2\n22-23', 'HK1\n23-24', 'HK2\n23-24'],
        datasets: [
            {
                label: 'Khóa K20',
                data: [3.0, 3.5, 4.0, 4.5],
                backgroundColor: 'rgba(59, 130, 246, 0.85)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1
            },
            {
                label: 'Khóa K21',
                data: [2.0, 2.5, 3.0, 3.2],
                backgroundColor: 'rgba(245, 158, 11, 0.85)',
                borderColor: 'rgba(245, 158, 11, 1)',
                borderWidth: 1
            },
            {
                label: 'Khóa K22',
                data: [1.0, 1.5, 2.0, 2.5],
                backgroundColor: 'rgba(34, 197, 94, 0.85)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 1
            }
        ]
    };

    this.initDropoutRateChart = function() {
        const canvas = document.getElementById('dropoutRateChart');
        if (!canvas) return;

        this.charts.dropoutRate = new Chart(canvas.getContext('2d'), {
            type: 'bar',
            data: this.dropoutRateData,
            options: {
                ...this.getBaseChartOptions(),
                legend: {
                    display: true,
                    position: 'top',
                    labels: { fontSize: 12, padding: 15, usePointStyle: true }
                },
                tooltips: {
                    ...this.getBaseChartOptions().tooltips,
                    callbacks: {
                        title: function(tooltipItems, data) {
                            const idx = tooltipItems && tooltipItems.length ? tooltipItems[0].index : 0;
                            const label = data.labels[idx] || '';
                            return `Học kỳ / Năm học: ${String(label).replace(/\n/g, ' ')}`;
                        },
                        label: function(tooltipItem, data) {
                            const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
                            return `${datasetLabel}: ${tooltipItem.yLabel}%`;
                        }
                    }
                },
                scales: {
                    xAxes: [
                        {
                            gridLines: { display: false, drawBorder: true, borderColor: '#e2e8f0' },
                            ticks: { fontSize: 12, fontColor: '#475569', autoSkip: false, maxRotation: 0, minRotation: 0 },
                            categoryPercentage: 0.6,
                            barPercentage: 0.7
                        }
                    ],
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                                fontSize: 11,
                                fontColor: '#64748b',
                                callback: function(value) { return `${value}%`; }
                            },
                            gridLines: { color: 'rgba(0, 0, 0, 0.06)', drawBorder: false, zeroLineColor: 'rgba(0, 0, 0, 0.1)' }
                        }
                    ]
                }
            }
        });
    };

    // Biểu đồ: Tỷ lệ sinh viên xếp loại rèn luyện theo năm học / học kỳ
    // Dạng nhóm cột: Tốt / Khá / Trung bình / Yếu - Kém
    this.trainingClassificationTemplates = {
        '2022-2023': {
            labels: ['HK1\n22-23', 'HK2\n22-23'],
            series: {
                tot: [35, 37],
                kha: [40, 39],
                trungBinh: [18, 17],
                yeuKem: [7, 7]
            }
        },
        '2023-2024': {
            labels: ['HK1\n23-24', 'HK2\n23-24'],
            series: {
                tot: [38, 40],
                kha: [38, 37],
                trungBinh: [17, 16],
                yeuKem: [7, 7]
            }
        }
    };

    // Mặc định hiển thị template gần nhất
    this.trainingClassificationData = {
        labels: ['HK1\n23-24', 'HK2\n23-24'],
        datasets: [
            { label: 'Tốt', data: [38, 40], backgroundColor: 'rgba(59, 130, 246, 0.85)', borderColor: 'rgba(59, 130, 246, 1)', borderWidth: 1 },
            { label: 'Khá', data: [38, 37], backgroundColor: 'rgba(245, 158, 11, 0.85)', borderColor: 'rgba(245, 158, 11, 1)', borderWidth: 1 },
            { label: 'Trung bình', data: [17, 16], backgroundColor: 'rgba(34, 197, 94, 0.85)', borderColor: 'rgba(34, 197, 94, 1)', borderWidth: 1 },
            { label: 'Yếu / Kém', data: [7, 7], backgroundColor: 'rgba(239, 68, 68, 0.85)', borderColor: 'rgba(239, 68, 68, 1)', borderWidth: 1 }
        ]
    };

    this.initTrainingClassificationChart = function() {
        const canvas = document.getElementById('trainingClassificationChart');
        if (!canvas) return;

        this.charts.trainingClassification = new Chart(canvas.getContext('2d'), {
            type: 'bar',
            data: this.trainingClassificationData,
            options: {
                ...this.getBaseChartOptions(),
                legend: {
                    display: true,
                    position: 'top',
                    labels: { fontSize: 12, padding: 15, usePointStyle: true }
                },
                tooltips: {
                    ...this.getBaseChartOptions().tooltips,
                    callbacks: {
                        title: function(tooltipItems, data) {
                            const idx = tooltipItems && tooltipItems.length ? tooltipItems[0].index : 0;
                            const label = data.labels[idx] || '';
                            return `Học kỳ / Năm học: ${String(label).replace(/\n/g, ' ')}`;
                        },
                        label: function(tooltipItem, data) {
                            const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
                            return `${datasetLabel}: ${tooltipItem.yLabel}%`;
                        }
                    }
                },
                scales: {
                    xAxes: [
                        {
                            gridLines: { display: false, drawBorder: true, borderColor: '#e2e8f0' },
                            ticks: { fontSize: 12, fontColor: '#475569', autoSkip: false, maxRotation: 0, minRotation: 0 },
                            categoryPercentage: 0.7,
                            barPercentage: 0.75
                        }
                    ],
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                                fontSize: 11,
                                fontColor: '#64748b',
                                callback: function(value) { return `${value}%`; }
                            },
                            gridLines: { color: 'rgba(0, 0, 0, 0.06)', drawBorder: false, zeroLineColor: 'rgba(0, 0, 0, 0.1)' }
                        }
                    ]
                }
            }
        });
    };

    this.initActivityChart = function() {
        const canvas = document.getElementById('activityChart');
        if (!canvas) return;

        this.charts.activity = new Chart(canvas.getContext('2d'), {
            type: 'bar',
            data: this.activityData,
            options: {
                ...this.getBaseChartOptions(),
                legend: { display: false },
                tooltips: {
                    ...this.getBaseChartOptions().tooltips,
                    callbacks: {
                        label: function(tooltipItem, data) {
                            const label = data.datasets[tooltipItem.datasetIndex].label || '';
                            return `${label}: ${tooltipItem.yLabel}`;
                        }
                    }
                }
            }
        });
    };

    this.initScholarshipChart = function() {
        const canvas = document.getElementById('scholarshipChart');
        if (!canvas) return;

        this.charts.scholarship = new Chart(canvas.getContext('2d'), {
            type: 'bar',
            data: this.scholarshipData,
            options: {
                ...this.getBaseChartOptions(),
                tooltips: {
                    ...this.getBaseChartOptions().tooltips,
                    callbacks: {
                        label: function(tooltipItem, data) {
                            const label = data.datasets[tooltipItem.datasetIndex].label || '';
                            return `${label}: ${tooltipItem.yLabel}`;
                        }
                    }
                }
            }
        });
    };

    this.initDisciplineChart = function() {
        const canvas = document.getElementById('disciplineChart');
        if (!canvas) return;

        this.charts.discipline = new Chart(canvas.getContext('2d'), {
            type: 'line',
            data: this.disciplineTrendData,
            options: {
                ...this.getBaseChartOptions(),
                tooltips: {
                    ...this.getBaseChartOptions().tooltips,
                    callbacks: {
                        title: function(tooltipItems, data) {
                            const idx = tooltipItems && tooltipItems.length ? tooltipItems[0].index : 0;
                            const month = data.labels[idx] || '';
                            return `Tháng ${month} (năm học)`;
                        },
                        label: function(tooltipItem, data) {
                            const label = data.datasets[tooltipItem.datasetIndex].label || '';
                            return `${label}: ${tooltipItem.yLabel}`;
                        }
                    }
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: { fontSize: 12, padding: 15, usePointStyle: true }
                },
                scales: {
                    xAxes: [
                        {
                            gridLines: { display: false, drawBorder: true, borderColor: '#e2e8f0' },
                            ticks: { fontSize: 12, fontColor: '#475569', autoSkip: false, maxRotation: 0, minRotation: 0 }
                        }
                    ],
                    yAxes: [
                        {
                            ticks: { beginAtZero: true, fontSize: 11, fontColor: '#64748b', precision: 0 },
                            gridLines: { color: 'rgba(0, 0, 0, 0.06)', drawBorder: false, zeroLineColor: 'rgba(0, 0, 0, 0.1)' }
                        }
                    ]
                }
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
        const filters = this.getFilters();
        this.currentFilters = filters;

        console.log('Applying filters:', filters);
        this.updateSystemStatus('Đang lọc dữ liệu...');
        this.showLoadingState();

        setTimeout(() => {
            this.updateDataByFilters(filters);
            this.renderStatsCards();
            this.renderQuickStats();
            this.renderRiskList();
            if (typeof Chart !== 'undefined') {
                this.initCharts();
            }
            this.updateSystemStatus('Hoạt động bình thường');
            this.updateLastUpdateTime();
            console.log('Filters applied successfully');
        }, 500);
    };

    this.resetFilters = function() {
        const year = document.getElementById('yearFilter');
        const semester = document.getElementById('semesterFilter');
        const level = document.getElementById('levelFilter');
        const unit = document.getElementById('unitFilter');

        if (year) year.value = '2024-2025';
        if (semester) semester.value = '';
        if (level) level.value = 'all';
        if (unit) unit.value = 'toan-truong';

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

    this.getFilters = function() {
        const yearEl = document.getElementById('yearFilter');
        const semesterEl = document.getElementById('semesterFilter');
        const levelEl = document.getElementById('levelFilter');
        const unitEl = document.getElementById('unitFilter');

        return {
            year: yearEl ? yearEl.value : this.currentFilters.year,
            semester: semesterEl ? semesterEl.value : this.currentFilters.semester,
            level: levelEl ? levelEl.value : this.currentFilters.level,
            unit: unitEl ? unitEl.value : this.currentFilters.unit
        };
    };

    this.updateDataByFilters = function(filters) {
        if (!this.baseData) return;

        const yearFactor = {
            '2024-2025': 1.0,
            '2023-2024': 0.96,
            '2022-2023': 0.92,
            '2021-2022': 0.88
        }[filters.year] || 1.0;

        const semesterFactor = {
            '': 1.0,
            hk1: 0.98,
            hk2: 1.02,
            he: 0.92,
            dot1: 0.97,
            dot2: 1.01
        }[filters.semester] || 1.0;

        const levelFactor = {
            all: 1.0,
            'dai-hoc': 1.0,
            'thac-si': 0.12,
            'tien-si': 0.03
        }[filters.level] || 1.0;

        const unitFactor = {
            'toan-truong': 1.0,
            khoa: 0.35,
            nganh: 0.12
        }[filters.unit] || 1.0;

        const multiplier = yearFactor * semesterFactor * levelFactor * unitFactor;

        // Metrics + KPI (tính lại KPI theo đúng công thức + xu hướng)
        const metrics = this.getMetricsByFilters(filters, multiplier);
        this.computeKpis(metrics);

        // Activity chart
        this.activityData = JSON.parse(JSON.stringify(this.baseData.activityData));
        if (this.activityData && this.activityData.datasets && this.activityData.datasets[0]) {
            this.activityData.datasets[0].data = this.activityData.datasets[0].data.map((v) => Math.max(0, Math.round(v * multiplier)));
        }

        // Scholarship chart
        this.scholarshipData = JSON.parse(JSON.stringify(this.baseData.scholarshipData));
        if (this.scholarshipData && this.scholarshipData.datasets) {
            this.scholarshipData.datasets.forEach((ds, idx) => {
                const slight = 1 + (idx * 0.03);
                ds.data = ds.data.map((v) => Math.max(0, Math.round(v * multiplier * slight)));
            });
        }

        // Discipline trend chart
        this.disciplineTrendData = JSON.parse(JSON.stringify(this.baseData.disciplineTrendData));
        if (this.disciplineTrendData && this.disciplineTrendData.datasets) {
            const scale = (n) => Math.max(0, Math.round((Number(n) || 0) * (0.6 + multiplier * 0.4)));
            this.disciplineTrendData.datasets.forEach((ds) => {
                ds.data = (ds.data || []).map(scale);
            });
        }

        // Dropout rate chart (%): scale nhẹ và clamp 0..100
        this.dropoutRateData = JSON.parse(JSON.stringify(this.baseData.dropoutRateData));
        if (this.dropoutRateData && this.dropoutRateData.datasets) {
            const scalePct = (n) => {
                const base = Number(n) || 0;
                // % không nên scale tuyến tính theo quy mô; điều chỉnh nhẹ theo filter
                const next = base * (0.9 + multiplier * 0.1);
                return Math.max(0, Math.min(100, +next.toFixed(1)));
            };
            this.dropoutRateData.datasets.forEach((ds) => {
                ds.data = (ds.data || []).map(scalePct);
            });
        }

        // Training classification chart: filter theo năm học / học kỳ
        this.updateTrainingClassificationByFilters(filters);
    };

    this.updateTrainingClassificationByFilters = function(filters) {
        const templates = this.baseData ? this.baseData.trainingClassificationTemplates : this.trainingClassificationTemplates;
        const year = filters && filters.year ? filters.year : '2024-2025';
        const sem = filters && filters.semester ? filters.semester : '';

        // Mock templates chỉ có 22-23 và 23-24; map các năm filter về template gần nhất
        const mappedYear = (year === '2022-2023' || year === '2023-2024') ? year : (year === '2021-2022' ? '2022-2023' : '2023-2024');
        const template = (templates && templates[mappedYear]) ? templates[mappedYear] : (templates ? templates['2023-2024'] : null);

        let labels = template && template.labels ? template.labels.slice() : [];
        let tot = template && template.series ? (template.series.tot || []).slice() : [];
        let kha = template && template.series ? (template.series.kha || []).slice() : [];
        let trungBinh = template && template.series ? (template.series.trungBinh || []).slice() : [];
        let yeuKem = template && template.series ? (template.series.yeuKem || []).slice() : [];

        if (sem === 'hk1' || sem === 'hk2') {
            const idx = sem === 'hk1' ? 0 : 1;
            labels = labels[idx] ? [labels[idx]] : labels;
            tot = tot[idx] !== undefined ? [tot[idx]] : tot;
            kha = kha[idx] !== undefined ? [kha[idx]] : kha;
            trungBinh = trungBinh[idx] !== undefined ? [trungBinh[idx]] : trungBinh;
            yeuKem = yeuKem[idx] !== undefined ? [yeuKem[idx]] : yeuKem;
        }

        this.trainingClassificationData = {
            labels,
            datasets: [
                { label: 'Tốt', data: tot, backgroundColor: 'rgba(59, 130, 246, 0.85)', borderColor: 'rgba(59, 130, 246, 1)', borderWidth: 1 },
                { label: 'Khá', data: kha, backgroundColor: 'rgba(245, 158, 11, 0.85)', borderColor: 'rgba(245, 158, 11, 1)', borderWidth: 1 },
                { label: 'Trung bình', data: trungBinh, backgroundColor: 'rgba(34, 197, 94, 0.85)', borderColor: 'rgba(34, 197, 94, 1)', borderWidth: 1 },
                { label: 'Yếu / Kém', data: yeuKem, backgroundColor: 'rgba(239, 68, 68, 0.85)', borderColor: 'rgba(239, 68, 68, 1)', borderWidth: 1 }
            ]
        };
    };

    // ==================== RISK LIST (ROW 3) ====================

    this.renderRiskList = function() {
        const tbody = document.getElementById('riskTableBody');
        if (!tbody) return;

        const timingEl = document.getElementById('riskTimingText');
        if (timingEl) {
            const sem = (this.currentFilters && this.currentFilters.semester) ? this.currentFilters.semester : '';
            const year = (this.currentFilters && this.currentFilters.year) ? this.currentFilters.year : '';
            timingEl.textContent = sem ? `Chốt theo học kỳ/đợt (${sem}) • Năm học ${year} • Risk Score 0-100 (A:20% • B:40% • C:30% • D:10%)` : `Chốt theo năm học ${year} • Risk Score 0-100 (A:20% • B:40% • C:30% • D:10%)`;
        }

        const riskRows = this.computeRiskRows(this.getRiskByFacultyForFilters(this.currentFilters));
        tbody.innerHTML = riskRows.map((row) => {
            const badgeClass = row.riskLevel === 'Cao' ? 'high' : (row.riskLevel === 'Trung bình' ? 'medium' : 'low');
            const badgeIcon = row.riskLevel === 'Cao' ? 'fa-circle-exclamation' : (row.riskLevel === 'Trung bình' ? 'fa-triangle-exclamation' : 'fa-circle-check');
            const trendClass = row.trendDirection;
            const trendIcon = row.trendDirection === 'up' ? 'fa-arrow-up' : (row.trendDirection === 'down' ? 'fa-arrow-down' : 'fa-minus');

            return `
                <tr>
                    <td style="font-weight: 700; color: #0f172a;">${this.escapeHtml(row.faculty)}</td>
                    <td>
                        <span class="risk-badge ${badgeClass}" title="Risk Score: ${row.score.toFixed(1)} / 100">
                            <i class="fa-solid ${badgeIcon}"></i>
                            ${this.escapeHtml(row.riskLevel)}
                        </span>
                    </td>
                    <td class="risk-reason">${this.escapeHtml(row.reason)}</td>
                    <td>
                        <span class="risk-trend ${trendClass}" title="So với cùng kỳ trước: ${row.deltaText}">
                            <i class="fa-solid ${trendIcon}"></i>
                            ${this.escapeHtml(row.trendText)}
                        </span>
                    </td>
                </tr>
            `;
        }).join('');
    };

    this.getRiskByFacultyForFilters = function(filters) {
        // Mock: áp dụng bộ lọc bằng điều chỉnh nhẹ các %/rate để bảng có phản hồi
        const yearFactor = {
            '2024-2025': 1.0,
            '2023-2024': 0.98,
            '2022-2023': 1.02,
            '2021-2022': 1.04
        }[filters.year] || 1.0;

        const semesterFactor = {
            '': 1.0,
            hk1: 0.98,
            hk2: 1.02,
            he: 1.03,
            dot1: 0.99,
            dot2: 1.01
        }[filters.semester] || 1.0;

        const levelFactor = {
            all: 1.0,
            'dai-hoc': 1.0,
            'thac-si': 0.8,
            'tien-si': 0.7
        }[filters.level] || 1.0;

        const unitFactor = {
            'toan-truong': 1.0,
            khoa: 1.0,
            nganh: 1.0
        }[filters.unit] || 1.0;

        const factor = yearFactor * semesterFactor * levelFactor * unitFactor;
        const adjustPct = (pct) => {
            const base = Number(pct) || 0;
            const next = base * (0.95 + factor * 0.05);
            return Math.max(0, Math.min(100, +next.toFixed(1)));
        };
        const adjustRate = (rate) => {
            const base = Number(rate) || 0;
            const next = base * (0.95 + factor * 0.05);
            return Math.max(0, +next.toFixed(2));
        };

        return (this.baseRiskByFaculty || []).map((item) => {
            const cur = item.current;
            const prev = item.previous;
            return {
                faculty: item.faculty,
                current: {
                    disciplinePct: adjustPct(cur.disciplinePct),
                    extracurricularPct: adjustPct(cur.extracurricularPct),
                    dropoutPct: adjustPct(cur.dropoutPct),
                    counselingPer1000: adjustRate(cur.counselingPer1000)
                },
                previous: {
                    disciplinePct: adjustPct(prev.disciplinePct),
                    extracurricularPct: adjustPct(prev.extracurricularPct),
                    dropoutPct: adjustPct(prev.dropoutPct),
                    counselingPer1000: adjustRate(prev.counselingPer1000)
                }
            };
        });
    };

    this.computeRiskRows = function(riskByFaculty) {
        const weights = { A: 0.20, B: 0.40, C: 0.30, D: 0.10 };

        return (riskByFaculty || []).map((item) => {
            const cur = item.current;
            const prev = item.previous;

            const aCur = this.normalizeA(cur.disciplinePct);
            const bCur = this.normalizeB(cur.extracurricularPct);
            const cCur = this.normalizeC(cur.dropoutPct);
            const dCur = this.normalizeD(cur.counselingPer1000);

            const aPrev = this.normalizeA(prev.disciplinePct);
            const bPrev = this.normalizeB(prev.extracurricularPct);
            const cPrev = this.normalizeC(prev.dropoutPct);
            const dPrev = this.normalizeD(prev.counselingPer1000);

            const scoreCur = (aCur.score * weights.A) + (bCur.score * weights.B) + (cCur.score * weights.C) + (dCur.score * weights.D);
            const scorePrev = (aPrev.score * weights.A) + (bPrev.score * weights.B) + (cPrev.score * weights.C) + (dPrev.score * weights.D);
            const delta = scoreCur - scorePrev;

            const level = scoreCur >= 80 ? 'Cao' : (scoreCur >= 50 ? 'Trung bình' : 'Thấp');
            const reason = this.pickPrimaryReason([aCur, bCur, cCur, dCur]);
            const trend = this.getRiskTrend(delta);

            return {
                faculty: item.faculty,
                score: scoreCur,
                riskLevel: level,
                reason: reason,
                trendDirection: trend.direction,
                trendText: trend.text,
                deltaText: `${delta >= 0 ? '+' : ''}${delta.toFixed(1)} điểm`
            };
        }).sort((a, b) => b.score - a.score);
    };

    this.pickPrimaryReason = function(normalizedIndicators) {
        const best = (normalizedIndicators || []).slice().sort((a, b) => (b.score - a.score))[0];
        return best && best.reason ? best.reason : 'Ổn định';
    };

    // A: Tỷ lệ SV bị kỷ luật (%)
    this.normalizeA = function(pct) {
        const v = Number(pct) || 0;
        if (v < 1) return { key: 'A', score: 0, reason: 'Tỷ lệ SV bị kỷ luật rất thấp' };
        if (v < 2) return { key: 'A', score: 40, reason: 'Có một số SV bị kỷ luật' };
        if (v < 4) return { key: 'A', score: 70, reason: 'Tỷ lệ SV bị kỷ luật cao' };
        return { key: 'A', score: 100, reason: 'Tỷ lệ vi phạm kỷ luật rất cao' };
    };

    // B: Tỷ lệ tham gia HĐ ngoại khóa (%) (thấp -> rủi ro cao)
    this.normalizeB = function(pct) {
        const v = Number(pct) || 0;
        if (v >= 70) return { key: 'B', score: 0, reason: 'Đa số SV có tham gia hoạt động' };
        if (v >= 50) return { key: 'B', score: 40, reason: 'Mức tham gia trung bình' };
        if (v >= 30) return { key: 'B', score: 70, reason: 'Ít SV tham gia, rủi ro gắn kết thấp' };
        return { key: 'B', score: 100, reason: 'Rất ít SV tham gia hoạt động, thiếu gắn kết' };
    };

    // C: Tỷ lệ nghỉ học tạm thời, thôi học (%)
    this.normalizeC = function(pct) {
        const v = Number(pct) || 0;
        if (v <= 5) return { key: 'C', score: 0, reason: 'Tỷ lệ nghỉ học thấp' };
        if (v < 10) return { key: 'C', score: 40, reason: 'Tỷ lệ nghỉ học trung bình' };
        if (v < 15) return { key: 'C', score: 70, reason: 'Cần tư vấn, theo dõi' };
        return { key: 'C', score: 100, reason: 'Báo động rủi ro nghỉ học' };
    };

    // D: Tư vấn tâm lý (ca/1000 SV)
    this.normalizeD = function(ratePer1000) {
        const v = Number(ratePer1000) || 0;
        if (v < 1) return { key: 'D', score: 0, reason: 'Ít ca tư vấn/tâm lý nghiêm trọng' };
        if (v < 2) return { key: 'D', score: 40, reason: 'Có một số ca nghiêm trọng' };
        if (v < 4) return { key: 'D', score: 70, reason: 'Khá nhiều ca nghiêm trọng, cần quan tâm đặc biệt' };
        return { key: 'D', score: 100, reason: 'Rất nhiều ca nghiêm trọng, rủi ro lớn về an sinh SV' };
    };

    this.getRiskTrend = function(delta) {
        const d = Number(delta) || 0;
        if (d >= 10) return { direction: 'up', text: 'Tăng mạnh ↑↑' };
        if (d >= 5) return { direction: 'up', text: 'Tăng ↑' };
        if (d <= -10) return { direction: 'down', text: 'Giảm mạnh ↓↓' };
        if (d <= -5) return { direction: 'down', text: 'Giảm ↓' };
        return { direction: 'stable', text: 'Ổn định →' };
    };

    this.getKpiValueById = function(id) {
        const kpi = (this.kpiData || []).find((x) => x.id === id);
        return kpi ? kpi.value : '0';
    };

    this.getMetricsByFilters = function(filters, multiplierOverride) {
        const base = this.baseData ? this.baseData.metrics : this.baseMetrics;
        const current = base.current;
        const previous = base.previous;

        let multiplier = multiplierOverride;
        if (multiplier === undefined) {
            const yearFactor = {
                '2024-2025': 1.0,
                '2023-2024': 0.96,
                '2022-2023': 0.92,
                '2021-2022': 0.88
            }[filters.year] || 1.0;

            const semesterFactor = {
                '': 1.0,
                hk1: 0.98,
                hk2: 1.02,
                he: 0.92,
                dot1: 0.97,
                dot2: 1.01
            }[filters.semester] || 1.0;

            const levelFactor = {
                all: 1.0,
                'dai-hoc': 1.0,
                'thac-si': 0.12,
                'tien-si': 0.03
            }[filters.level] || 1.0;

            const unitFactor = {
                'toan-truong': 1.0,
                khoa: 0.35,
                nganh: 0.12
            }[filters.unit] || 1.0;

            multiplier = yearFactor * semesterFactor * levelFactor * unitFactor;
        }

        const scaleCount = (n) => Math.max(0, Math.round((Number(n) || 0) * multiplier));
        const scaleStudents = (n) => Math.max(1, Math.round((Number(n) || 0) * multiplier));
        const scaleDiscipline = (n) => Math.max(0, Math.round((Number(n) || 0) * (0.6 + multiplier * 0.4)));

        return {
            current: {
                totalStudents: scaleStudents(current.totalStudents),
                extracurricularParticipants: scaleCount(current.extracurricularParticipants),
                disciplinedStudents: scaleDiscipline(current.disciplinedStudents),
                policyBeneficiaries: scaleCount(current.policyBeneficiaries),
                oneStopRequests: scaleCount(current.oneStopRequests)
            },
            previous: {
                totalStudents: scaleStudents(previous.totalStudents),
                extracurricularParticipants: scaleCount(previous.extracurricularParticipants),
                disciplinedStudents: scaleDiscipline(previous.disciplinedStudents),
                policyBeneficiaries: scaleCount(previous.policyBeneficiaries),
                oneStopRequests: scaleCount(previous.oneStopRequests)
            }
        };
    };

    this.computeKpis = function(metrics) {
        const cur = metrics.current;
        const prev = metrics.previous;

        // KPI1: % SV tham gia ngoại khóa; trend dựa trên số SV tham gia
        const extracurricularRate = cur.totalStudents > 0 ? (cur.extracurricularParticipants / cur.totalStudents) * 100 : 0;
        const extracurricularTrend = this.getTrendByNumerator(cur.extracurricularParticipants, prev.extracurricularParticipants);

        // KPI2: SV vi phạm / 1000 SV; trend dựa trên số SV vi phạm
        const disciplinePer1000 = cur.totalStudents > 0 ? (cur.disciplinedStudents / cur.totalStudents) * 1000 : 0;
        const disciplineTrend = this.getTrendByNumerator(cur.disciplinedStudents, prev.disciplinedStudents);

        // KPI3: % SV hưởng chính sách; trend dựa trên số SV hưởng chính sách
        const policyRate = cur.totalStudents > 0 ? (cur.policyBeneficiaries / cur.totalStudents) * 100 : 0;
        const policyTrend = this.getTrendByNumerator(cur.policyBeneficiaries, prev.policyBeneficiaries);

        // KPI4: tổng yêu cầu một cửa; trend dựa trên tổng yêu cầu
        const oneStopTrend = this.getTrendByNumerator(cur.oneStopRequests, prev.oneStopRequests);

        this.kpiData = [
            {
                id: 'kpi1',
                icon: 'fa-people-group',
                label: 'Tỷ lệ SV tham gia hoạt động ngoại khóa',
                category: 'Gắn kết sinh viên',
                value: `${extracurricularRate.toFixed(1)}%`,
                trendDirection: extracurricularTrend.direction,
                trendValue: extracurricularTrend.valueText,
                trendStyle: extracurricularTrend.direction === 'up' ? 'good' : (extracurricularTrend.direction === 'down' ? 'bad' : 'neutral'),
                subtext: 'so với học kỳ trước',
                tooltip: 'Mức độ tham gia hoạt động sinh viên',
                updateType: 'Theo Học kỳ',
                color: 'green'
            },
            {
                id: 'kpi2',
                icon: 'fa-gavel',
                label: 'Tỷ lệ SV vi phạm kỷ luật',
                category: 'Kỷ luật & ổn định',
                value: `${disciplinePer1000.toFixed(1)}`,
                valueSuffix: ' /1000 SV',
                trendDirection: disciplineTrend.direction,
                trendValue: disciplineTrend.valueText,
                // KPI2: tăng là xấu, giảm là tốt
                trendStyle: disciplineTrend.direction === 'up' ? 'bad' : (disciplineTrend.direction === 'down' ? 'good' : 'neutral'),
                subtext: 'so với cùng kỳ năm trước',
                tooltip: 'Chỉ số kỷ luật sinh viên',
                updateType: 'Hàng tháng / Quý',
                color: 'orange'
            },
            {
                id: 'kpi3',
                icon: 'fa-award',
                label: 'Tỷ lệ SV hưởng chế độ chính sách',
                category: 'Học bổng / Miễn giảm',
                value: `${policyRate.toFixed(1)}%`,
                trendDirection: policyTrend.direction,
                trendValue: policyTrend.valueText,
                // KPI3: giảm là cảnh báo vàng
                trendStyle: policyTrend.direction === 'up' ? 'good' : (policyTrend.direction === 'down' ? 'warn' : 'neutral'),
                subtext: 'so với cùng kỳ năm trước',
                tooltip: 'Mức độ hỗ trợ sinh viên',
                updateType: 'Theo Học kỳ',
                color: 'blue'
            },
            {
                id: 'kpi4',
                icon: 'fa-headset',
                label: 'Số yêu cầu một cửa SV gửi đến',
                category: 'Hỗ trợ hành chính',
                value: this.formatInt(cur.oneStopRequests),
                trendDirection: oneStopTrend.direction,
                trendValue: oneStopTrend.valueText,
                // KPI4: giảm là tốt (ổn định), tăng theo dõi
                trendStyle: oneStopTrend.direction === 'down' ? 'good' : (oneStopTrend.direction === 'up' ? 'neutral' : 'neutral'),
                subtext: 'so với cùng kỳ năm trước',
                tooltip: 'Số yêu cầu sinh viên gửi qua hệ thống một cửa',
                updateType: 'Realtime / Daily',
                color: 'rose'
            }
        ];
    };

    this.getTrendByNumerator = function(currentValue, previousValue) {
        const cur = Number(currentValue) || 0;
        const prev = Number(previousValue) || 0;

        if (prev <= 0) {
            if (cur <= 0) return { direction: 'stable', valueText: '0.0%' };
            return { direction: 'up', valueText: '+100.0%' };
        }

        const pct = ((cur - prev) / prev) * 100;
        if (Math.abs(pct) < 0.05) return { direction: 'stable', valueText: '0.0%' };

        const abs = Math.abs(pct).toFixed(1);
        return {
            direction: pct > 0 ? 'up' : 'down',
            valueText: `${pct > 0 ? '+' : '-'}${abs}%`
        };
    };

    this.parseNumber = function(value) {
        if (value === null || value === undefined) return 0;
        const str = String(value).replace(/[^0-9.-]/g, '');
        const n = Number(str);
        return isNaN(n) ? 0 : n;
    };

    this.formatInt = function(n) {
        const val = Number(n);
        if (isNaN(val)) return '0';
        return Math.round(val).toLocaleString('en-US');
    };

    this.sumDataset = function(chartData) {
        try {
            if (!chartData || !chartData.datasets || !chartData.datasets[0] || !chartData.datasets[0].data) return 0;
            return chartData.datasets[0].data.reduce((acc, v) => acc + (Number(v) || 0), 0);
        } catch (e) {
            return 0;
        }
    };

    this.getTrendClass = function(stat) {
        const style = stat.trendStyle;
        if (style === 'good' || style === 'bad' || style === 'warn' || style === 'neutral') return style;
        const direction = stat.trendDirection || stat.trend || 'up';
        return direction === 'up' ? 'up' : 'down';
    };

    this.escapeHtml = function(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    };
}