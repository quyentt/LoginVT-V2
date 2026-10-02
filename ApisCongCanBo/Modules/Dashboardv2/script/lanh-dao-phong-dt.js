/**
 * ============================================
 * DASHBOARD LÃNH ĐẠO PHÒNG ĐÀO TẠO - BACKEND LOGIC
 * Xử lý dữ liệu và render các component
 * Version: 2.0.0
 * ============================================
 */

function DashboardPhongDT() {
    'use strict';
    
    // ==================== PROPERTIES ====================
    
    /**
     * Dữ liệu KPI Cards
     */
    this.kpiData = [
        {
            id: 'kpi1',
            icon: 'fa-users',
            label: 'Tổng số sinh viên đang học',
            category: 'Quy mô sinh viên toàn trường',
            value: '33,000',
            trend: 'up',
            trendValue: '+1,250 SV (+3.9%)',
            subtext: 'so với cùng kỳ năm trước',
            color: 'green',
            tooltip: 'Dữ liệu cập nhật đến ngày 03/04/2026',
            updateType: 'Realtime/Daily'
        },
        {
            id: 'kpi2',
            icon: 'fa-graduation-cap',
            label: 'Tỷ lệ tốt nghiệp đúng hạn',
            category: 'Chỉ số chất lượng đào tạo',
            value: '68.5%',
            trend: 'up',
            trendValue: '+5.1%',
            subtext: 'so với cùng kỳ năm trước',
            color: 'purple',
            tooltip: 'Chỉ số chất lượng đào tạo - Cập nhật theo năm học',
            updateType: 'Theo năm'
        },
        {
            id: 'kpi3',
            icon: 'fa-exclamation-triangle',
            label: 'Tỷ lệ SV bị cảnh báo học vụ',
            category: 'Rủi ro học tập',
            value: '2.1%',
            trend: 'down',
            trendValue: '-0.9%',
            subtext: '693/33,000 SV bị cảnh báo',
            color: 'orange',
            tooltip: 'Dữ liệu cập nhật theo học kỳ - HK1 2024-2025',
            updateType: 'Theo học kỳ',
            isWarning: true
        },
        {
            id: 'kpi4',
            icon: 'fa-chart-line',
            label: 'Tỷ lệ SV học đúng tiến độ',
            category: 'Tiến độ đào tạo',
            value: '85.3%',
            trend: 'up',
            trendValue: '+2.8%',
            subtext: '28,149/33,000 SV đúng tiến độ',
            color: 'blue',
            tooltip: 'Tiến độ đào tạo của sinh viên - Cập nhật theo học kỳ',
            updateType: 'Theo học kỳ'
        }
    ];

    /**
     * Dữ liệu quy mô sinh viên toàn trường theo năm
     */
    this.classManagementData = {
        labels: ['HK1 22-23', 'HK2 22-23', 'HK1 23-24', 'HK2 23-24', 'HK1 24-25', 'HK2 24-25'],
        datasets: [
            {
                label: 'Số lớp mở',
                type: 'bar',
                data: [950, 1030, 1100, 1150, 1200, 1250],
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2,
                yAxisID: 'y-axis-1'
            },
            {
                label: 'Số lớp bị hủy',
                type: 'bar',
                data: [45, 55, 75, 70, 85, 80],
                backgroundColor: 'rgba(245, 158, 11, 0.8)',
                borderColor: 'rgba(245, 158, 11, 1)',
                borderWidth: 2,
                yAxisID: 'y-axis-1'
            },
            {
                label: 'Tỷ lệ hủy (%)',
                type: 'line',
                data: [4.7, 5.3, 6.8, 6.1, 7.1, 6.4],
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
     * Dữ liệu rủi ro theo khoa
     */
    this.riskData = [
        {
            name: 'Khoa Công nghệ thông tin',
            riskScore: 85.2,
            level: 'Cao',
            color: 'high',
            mainCause: 'GPA TB ↓, Trượt ↑',
            trend: 'up-high',
            trendValue: '+12',
            trendText: '↑↑',
            icon: 'fa-computer',
            details: {
                gpa: 2.3,
                failRate: 25,
                lateGrade: 8,
                warning: 18,
                dropout: 6
            }
        },
        {
            name: 'Khoa Kỹ thuật',
            riskScore: 76.8,
            level: 'Trung bình',
            color: 'medium',
            mainCause: 'SV thôi học cao',
            trend: 'up',
            trendValue: '+8',
            trendText: '↑',
            icon: 'fa-gears',
            details: {
                gpa: 2.6,
                failRate: 15,
                lateGrade: 5,
                warning: 12,
                dropout: 8
            }
        },
        {
            name: 'Khoa Kinh tế',
            riskScore: 68.4,
            level: 'Trung bình',
            color: 'medium',
            mainCause: 'Nhập điểm trễ',
            trend: 'down',
            trendValue: '-3',
            trendText: '↓',
            icon: 'fa-chart-line',
            details: {
                gpa: 2.8,
                failRate: 12,
                lateGrade: 18,
                warning: 10,
                dropout: 4
            }
        },
        {
            name: 'Khoa Ngoại ngữ',
            riskScore: 58.7,
            level: 'Trung bình',
            color: 'medium',
            mainCause: 'Vi phạm tiến độ đào tạo',
            trend: 'stable',
            trendValue: '+2',
            trendText: '→',
            icon: 'fa-language',
            details: {
                gpa: 2.9,
                failRate: 10,
                lateGrade: 6,
                warning: 8,
                dropout: 3
            }
        },
        {
            name: 'Khoa Y tế',
            riskScore: 45.3,
            level: 'Thấp',
            color: 'low',
            mainCause: 'Ổn định chung',
            trend: 'down',
            trendValue: '-5',
            trendText: '↓',
            icon: 'fa-heart-pulse',
            details: {
                gpa: 3.1,
                failRate: 8,
                lateGrade: 3,
                warning: 6,
                dropout: 2
            }
        }
    ];

    /**
     * Dữ liệu biểu đồ thu học phí theo tháng
     */
    this.tuitionData = {
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
                label: 'Tỷ lệ thu %',
                type: 'line',
                data: [111, 80, 120, 110, 100],
                borderColor: 'rgba(239, 68, 68, 1)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                yAxisID: 'y-axis-2',
                fill: false,
                pointRadius: 5,
                pointBackgroundColor: 'rgba(239, 68, 68, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }
        ]
    };

    /**
     * Dữ liệu tiến độ chấm thi, nhập điểm
     */
    this.examProgressData = {
        labels: ['Ngày 1', 'Ngày 2', 'Ngày 3', 'Ngày 5', 'Ngày 7', 'Ngày 10', 'Ngày 11', 'Ngày 13'],
        datasets: [
            {
                label: 'Đã chấm xong',
                data: [10, 35, 55, 70, 82, 91, 95, 97],
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
                data: [5, 20, 40, 60, 75, 85, 90, 95],
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
        ]
    };

    // ==================== INITIALIZATION ====================
    
    /**
     * Khởi tạo Dashboard
     */
    this.init = function() {
        console.log('🚀 Dashboard Phòng ĐT: Initializing...');
        
        this.loadData();
        this.renderStatsCards();
        this.renderQuickStats();
        this.renderRiskList();
        
        // Kiểm tra Chart.js đã load chưa
        if (typeof Chart !== 'undefined') {
            this.initCharts();
        } else {
            console.warn('⚠️ Chart.js chưa load, sẽ khởi tạo charts sau khi load xong');
        }
        
        this.bindEvents();
        this.updateLastUpdateTime();
        
        console.log('✅ Dashboard Phòng ĐT: Initialized successfully');
    };

    // ==================== DATA LOADING ====================
    
    /**
     * Load dữ liệu từ API (hiện tại dùng mock data)
     */
    this.loadData = function() {
        console.log('📊 Loading data...');
        
        // Hiển thị loading state
        this.showLoadingState();
        
        // Simulate API call
        setTimeout(() => {
            this.hideLoadingState();
            this.updateSystemStatus('Hoạt động bình thường');
            console.log('✅ Data loaded successfully');
        }, 1000);
    };

    /**
     * Hiển thị loading state
     */
    this.showLoadingState = function() {
        const statsContainer = document.getElementById('statsCards');
        if (statsContainer) {
            statsContainer.innerHTML = Array(4).fill(0).map(() => `
                <div class="stat-card" style="height: 180px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite;"></div>
            `).join('');
        }
    };

    /**
     * Ẩn loading state
     */
    this.hideLoadingState = function() {
        this.renderStatsCards();
        this.renderQuickStats();
        this.renderRiskList();
    };

    /**
     * Cập nhật trạng thái hệ thống
     */
    this.updateSystemStatus = function(status) {
        const statusElement = document.getElementById('systemStatus');
        if (statusElement) {
            statusElement.textContent = status;
        }
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
            
            // Đối với KPI cảnh báo, đảo ngược màu sắc
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

    /**
     * Render Quick Stats
     */
    this.renderQuickStats = function() {
        const container = document.getElementById('quickStats');
        if (!container) return;

        container.innerHTML = `
            <div class="quick-stat-item">
                <span class="quick-stat-label">Tổng học phần:</span>
                <span class="quick-stat-value">820</span>
            </div>
            <div class="quick-stat-item">
                <span class="quick-stat-label">CT chuẩn quốc tế:</span>
                <span class="quick-stat-value">15</span>
            </div>
            <div class="quick-stat-item">
                <span class="quick-stat-label">CT liên kết:</span>
                <span class="quick-stat-value">8</span>
            </div>
            <div class="quick-stat-item">
                <span class="quick-stat-label">Đánh giá ABET:</span>
                <span class="quick-stat-value">5 CT</span>
            </div>
        `;
    };

    /**
     * Render Risk List
     */
    this.renderRiskList = function() {
        const container = document.getElementById('riskList');
        if (!container) return;

        container.innerHTML = this.riskData.map((risk, index) => {
            // Xác định màu icon rủi ro
            let riskIcon, riskIconColor, riskBgColor;
            if (risk.color === 'high') {
                riskIcon = 'fa-circle';
                riskIconColor = '#ef4444';
                riskBgColor = '#fee2e2';
            } else if (risk.color === 'medium') {
                riskIcon = 'fa-circle';
                riskIconColor = '#f59e0b';
                riskBgColor = '#fef3c7';
            } else {
                riskIcon = 'fa-circle';
                riskIconColor = '#10b981';
                riskBgColor = '#dcfce7';
            }

            // Xác định màu xu hướng
            let trendColor, trendBg;
            if (risk.trend === 'up-high' || risk.trend === 'up') {
                trendColor = '#ef4444';
                trendBg = '#fee2e2';
            } else if (risk.trend === 'down') {
                trendColor = '#10b981';
                trendBg = '#dcfce7';
            } else {
                trendColor = '#64748b';
                trendBg = '#f1f5f9';
            }

            return `
                <div class="risk-item ${risk.color}" style="animation: fadeIn 0.5s ease ${index * 0.1}s both;">
                    <div class="risk-header">
                        <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
                            <div style="width: 40px; height: 40px; border-radius: 10px; background: ${riskBgColor}; display: flex; align-items: center; justify-content: center;">
                                <i class="fa-solid ${risk.icon}" style="color: ${riskIconColor}; font-size: 18px;"></i>
                            </div>
                            <div style="flex: 1;">
                                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                                    <i class="fa-solid ${riskIcon}" style="color: ${riskIconColor}; font-size: 8px;"></i>
                                    <span class="risk-name">${risk.name}</span>
                                </div>
                                <div style="font-size: 11px; color: #94a3b8;">
                                    <i class="fa-solid fa-chart-line" style="margin-right: 4px;"></i>
                                    Risk Score: <strong style="color: ${riskIconColor};">${risk.riskScore}</strong>
                                </div>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 24px; font-weight: 700; color: ${riskIconColor}; line-height: 1; margin-bottom: 4px;">
                                ${risk.riskScore}
                            </div>
                            <div style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 12px; background: ${trendBg};">
                                <span style="font-size: 14px; font-weight: 700; color: ${trendColor};">
                                    ${risk.trendText}
                                </span>
                                <span style="font-size: 10px; color: ${trendColor};">
                                    ${risk.trendValue > 0 ? '+' : ''}${risk.trendValue}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div style="margin: 12px 0; padding: 10px; background: rgba(0,0,0,0.02); border-radius: 8px; border-left: 3px solid ${riskIconColor};">
                        <div style="font-size: 11px; color: #64748b; margin-bottom: 4px; font-weight: 600;">
                            <i class="fa-solid fa-exclamation-circle" style="margin-right: 4px;"></i>
                            NGUYÊN NHÂN CHÍNH
                        </div>
                        <div style="font-size: 13px; color: #1e293b; font-weight: 600;">
                            ${risk.mainCause}
                        </div>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid rgba(0,0,0,0.05);">
                        <div style="display: flex; gap: 12px; font-size: 11px; color: #64748b;">
                            <span><i class="fa-solid fa-graduation-cap" style="margin-right: 4px;"></i>GPA: <strong>${risk.details.gpa}</strong></span>
                            <span><i class="fa-solid fa-times-circle" style="margin-right: 4px;"></i>Trượt: <strong>${risk.details.failRate}%</strong></span>
                            <span><i class="fa-solid fa-user-xmark" style="margin-right: 4px;"></i>Thôi học: <strong>${risk.details.dropout}%</strong></span>
                        </div>
                        <span style="font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 12px; background: ${riskBgColor}; color: ${riskIconColor};">
                            ${risk.level}
                        </span>
                    </div>
                </div>
            `;
        }).join('');
    };

    // ==================== CHARTS ====================
    
    /**
     * Khởi tạo các biểu đồ
     */
    this.initCharts = function() {
        if (typeof Chart === 'undefined') {
            console.error('❌ Chart.js not loaded, cannot initialize charts');
            this.showChartFallback();
            return;
        }

        console.log('📊 Initializing charts...');
        
        try {
            this.initQualityChart();
            this.initExamProgressChart();
            this.initTuitionChart();
            console.log('✅ All charts initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing charts:', error);
            this.showChartFallback();
        }
    };

    /**
     * Hiển thị fallback khi Chart.js không load được
     */
    this.showChartFallback = function() {
        const chartIds = ['qualityChart', 'examProgressChart', 'tuitionChart'];
        chartIds.forEach(id => {
            const canvas = document.getElementById(id);
            if (canvas) {
                const parent = canvas.parentElement;
                parent.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: center; height: 300px; background: #f8fafc; border-radius: 12px; border: 2px dashed #cbd5e1;">
                        <div style="text-align: center; color: #64748b;">
                            <i class="fa-solid fa-chart-line" style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
                            <p style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">Biểu đồ đang tải...</p>
                            <p style="font-size: 14px;">Vui lòng kiểm tra kết nối mạng</p>
                        </div>
                    </div>
                `;
            }
        });
    };

    /**
     * Biểu đồ tỷ lệ lớp học phần mở, hủy
     */
    this.initQualityChart = function() {
        const canvas = document.getElementById('qualityChart');
        if (!canvas) return;

        new Chart(canvas.getContext('2d'), {
            type: 'bar',
            data: this.classManagementData,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        fontSize: 12,
                        padding: 15,
                        usePointStyle: true
                    }
                },
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
                            if (label) {
                                label += ': ';
                            }
                            if (tooltipItem.datasetIndex === 2) {
                                // Tỷ lệ hủy %
                                label += tooltipItem.yLabel.toFixed(1) + '%';
                            } else {
                                // Số lớp
                                label += tooltipItem.yLabel.toLocaleString() + ' lớp';
                            }
                            return label;
                        },
                        afterBody: function(tooltipItems, data) {
                            var semester = tooltipItems[0].label;
                            var lopMo = tooltipItems.find(t => t.datasetIndex === 0);
                            var lopHuy = tooltipItems.find(t => t.datasetIndex === 1);
                            var tyLeHuy = tooltipItems.find(t => t.datasetIndex === 2);
                            
                            var analysis = '';
                            if (tyLeHuy && tyLeHuy.yLabel < 5) {
                                analysis = '✅ Kế hoạch mở lớp phù hợp';
                            } else if (tyLeHuy && tyLeHuy.yLabel < 10) {
                                analysis = '⚠️ Cần xem xét điều chỉnh';
                            } else {
                                analysis = '❌ Cần điều chỉnh kế hoạch mở lớp';
                            }
                            
                            return ['', '📊 Đánh giá ' + semester + ':', analysis];
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        gridLines: {
                            display: false
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Học kỳ',
                            fontSize: 12,
                            fontStyle: 'bold'
                        }
                    }],
                    yAxes: [
                        {
                            id: 'y-axis-1',
                            type: 'linear',
                            position: 'left',
                            ticks: {
                                beginAtZero: true,
                                callback: function(value) {
                                    return value.toLocaleString() + ' lớp';
                                }
                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'Số lượng lớp học phần',
                                fontSize: 12,
                                fontStyle: 'bold'
                            },
                            gridLines: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        {
                            id: 'y-axis-2',
                            type: 'linear',
                            position: 'right',
                            ticks: {
                                beginAtZero: true,
                                max: 10,
                                stepSize: 2,
                                callback: function(value) {
                                    return value + '%';
                                }
                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'Tỷ lệ hủy (%)',
                                fontSize: 12,
                                fontStyle: 'bold'
                            },
                            gridLines: {
                                drawOnChartArea: false
                            }
                        }
                    ]
                }
            }
        });
    };

    /**
     * Biểu đồ tiến độ chấm thi, nhập điểm
     */
    this.initExamProgressChart = function() {
        const canvas = document.getElementById('examProgressChart');
        if (!canvas) return;

        new Chart(canvas.getContext('2d'), {
            type: 'line',
            data: this.examProgressData,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        fontSize: 12,
                        padding: 15,
                        usePointStyle: true
                    }
                },
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
                            if (label) {
                                label += ': ';
                            }
                            label += tooltipItem.yLabel.toFixed(0) + '%';
                            return label;
                        },
                        afterBody: function(tooltipItems, data) {
                            var day = tooltipItems[0].label;
                            var chamXong = tooltipItems.find(t => t.datasetIndex === 0);
                            var nhapDiem = tooltipItems.find(t => t.datasetIndex === 1);
                            
                            var gap = chamXong && nhapDiem ? (chamXong.yLabel - nhapDiem.yLabel).toFixed(0) : 0;
                            
                            var analysis = '';
                            if (gap <= 10) {
                                analysis = '✅ Tiến độ nhập điểm tốt';
                            } else if (gap <= 20) {
                                analysis = '⚠️ Cần đẩy nhanh nhập điểm';
                            } else {
                                analysis = '❌ Chậm nhập điểm đáng kể';
                            }
                            
                            return ['', '📊 ' + day + ':', 'Chênh lệch: ' + gap + '%', analysis];
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        gridLines: {
                            display: false
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Số ngày sau ngày thi',
                            fontSize: 12,
                            fontStyle: 'bold'
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            max: 100,
                            stepSize: 10,
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        scaleLabel: {
                            display: true,
                            labelString: '% hoàn thành',
                            fontSize: 12,
                            fontStyle: 'bold'
                        },
                        gridLines: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }]
                }
            }
        });
    };

    /**
     * Biểu đồ thu học phí theo tháng
     */
    this.initTuitionChart = function() {
        const canvas = document.getElementById('tuitionChart');
        if (!canvas) return;

        new Chart(canvas.getContext('2d'), {
            type: 'bar',
            data: this.tuitionData,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        fontSize: 12,
                        padding: 15,
                        usePointStyle: true
                    }
                },
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
                            if (label) {
                                label += ': ';
                            }
                            if (tooltipItem.datasetIndex === 2) {
                                // Tỷ lệ thu %
                                label += tooltipItem.yLabel.toFixed(0) + '%';
                            } else {
                                // Số tiền
                                label += tooltipItem.yLabel.toFixed(1) + ' tỷ';
                            }
                            return label;
                        },
                        afterBody: function(tooltipItems, data) {
                            var month = tooltipItems[0].label;
                            var daThu = tooltipItems.find(t => t.datasetIndex === 0);
                            var tyLe = tooltipItems.find(t => t.datasetIndex === 2);
                            
                            var analysis = '';
                            if (tyLe && tyLe.yLabel >= 100) {
                                analysis = '✅ Đạt mục tiêu thu';
                            } else if (tyLe && tyLe.yLabel >= 80) {
                                analysis = '⚠️ Gần đạt mục tiêu';
                            } else {
                                analysis = '❌ Chưa đạt mục tiêu';
                            }
                            
                            return ['', '📊 ' + month + ':', analysis];
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        gridLines: {
                            display: false
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Tháng',
                            fontSize: 12,
                            fontStyle: 'bold'
                        }
                    }],
                    yAxes: [
                        {
                            id: 'y-axis-1',
                            type: 'linear',
                            position: 'left',
                            ticks: {
                                beginAtZero: true,
                                callback: function(value) {
                                    return value.toFixed(1) + ' tỷ';
                                }
                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'Số tiền đã thu (tỷ VNĐ)',
                                fontSize: 12,
                                fontStyle: 'bold'
                            },
                            gridLines: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        {
                            id: 'y-axis-2',
                            type: 'linear',
                            position: 'right',
                            ticks: {
                                beginAtZero: true,
                                max: 140,
                                stepSize: 20,
                                callback: function(value) {
                                    return value + '%';
                                }
                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'Tỷ lệ thu (%)',
                                fontSize: 12,
                                fontStyle: 'bold'
                            },
                            gridLines: {
                                drawOnChartArea: false
                            }
                        }
                    ]
                }
            }
        });
    };

    // ==================== EVENT HANDLERS ====================
    
    /**
     * Bind các sự kiện
     */
    this.bindEvents = function() {
        // Year filter
        const yearFilter = document.getElementById('yearFilter');
        if (yearFilter) {
            yearFilter.addEventListener('change', () => {
                console.log('Year filter changed:', yearFilter.value);
                this.updateFilterInfo();
            });
        }

        // Semester filter
        const semesterFilter = document.getElementById('semesterFilter');
        if (semesterFilter) {
            semesterFilter.addEventListener('change', () => {
                console.log('Semester filter changed:', semesterFilter.value);
                this.updateFilterInfo();
            });
        }

        // Level filter
        const levelFilter = document.getElementById('levelFilter');
        if (levelFilter) {
            levelFilter.addEventListener('change', () => {
                console.log('Level filter changed:', levelFilter.value);
                this.updateFilterInfo();
            });
        }

        // Faculty filter
        const facultyFilter = document.getElementById('facultyFilter');
        if (facultyFilter) {
            facultyFilter.addEventListener('change', () => {
                console.log('Faculty filter changed:', facultyFilter.value);
                this.updateFilterInfo();
                // Cập nhật danh sách ngành theo khoa
                this.updateMajorOptions(facultyFilter.value);
            });
        }

        // Major filter
        const majorFilter = document.getElementById('majorFilter');
        if (majorFilter) {
            majorFilter.addEventListener('change', () => {
                console.log('Major filter changed:', majorFilter.value);
                this.updateFilterInfo();
            });
        }

        // Apply filters button
        const applyBtn = document.getElementById('applyFilters');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                console.log('Applying filters...');
                this.applyFilters();
            });
        }

        // Reset filters button
        const resetBtn = document.getElementById('resetFilters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                console.log('Resetting filters...');
                this.resetFilters();
            });
        }
    };

    /**
     * Cập nhật thông tin bộ lọc
     */
    this.updateFilterInfo = function() {
        const year = document.getElementById('yearFilter')?.value || 'Tất cả';
        const semester = document.getElementById('semesterFilter')?.value || 'Tất cả';
        const level = document.getElementById('levelFilter')?.value || 'Tất cả';
        const faculty = document.getElementById('facultyFilter')?.value || 'Toàn trường';
        const major = document.getElementById('majorFilter')?.value || 'Tất cả';
        
        console.log('Current filters:', { year, semester, level, faculty, major });
    };

    /**
     * Cập nhật danh sách ngành theo khoa
     */
    this.updateMajorOptions = function(facultyValue) {
        const majorFilter = document.getElementById('majorFilter');
        if (!majorFilter) return;

        // Danh sách ngành theo khoa
        const majorsByFaculty = {
            'cntt': [
                { value: 'cntt', label: 'Công nghệ thông tin' },
                { value: 'ktpm', label: 'Kỹ thuật phần mềm' },
                { value: 'attt', label: 'An toàn thông tin' },
                { value: 'ai', label: 'Trí tuệ nhân tạo' },
                { value: 'khmt', label: 'Khoa học máy tính' }
            ],
            'ktoan': [
                { value: 'qtkd', label: 'Quản trị kinh doanh' },
                { value: 'ktoan', label: 'Kế toán' },
                { value: 'tcdn', label: 'Tài chính doanh nghiệp' },
                { value: 'marketing', label: 'Marketing' }
            ],
            'ngoaingu': [
                { value: 'anh', label: 'Ngôn ngữ Anh' },
                { value: 'nhat', label: 'Ngôn ngữ Nhật' },
                { value: 'han', label: 'Ngôn ngữ Hàn' },
                { value: 'phap', label: 'Ngôn ngữ Pháp' }
            ],
            'kythuat': [
                { value: 'co', label: 'Kỹ thuật cơ khí' },
                { value: 'dien', label: 'Kỹ thuật điện' },
                { value: 'xd', label: 'Kỹ thuật xây dựng' },
                { value: 'oto', label: 'Kỹ thuật ô tô' }
            ],
            'yte': [
                { value: 'dieuduong', label: 'Điều dưỡng' },
                { value: 'duoc', label: 'Dược học' },
                { value: 'yhct', label: 'Y học cổ truyền' },
                { value: 'xn', label: 'Xét nghiệm y học' }
            ]
        };

        // Reset về tất cả ngành nếu chọn "Toàn trường"
        if (!facultyValue || facultyValue === '') {
            majorFilter.innerHTML = '<option value="">Tất cả ngành</option>';
            return;
        }

        // Cập nhật danh sách ngành theo khoa
        const majors = majorsByFaculty[facultyValue] || [];
        majorFilter.innerHTML = '<option value="">Tất cả ngành</option>' + 
            majors.map(m => `<option value="${m.value}">${m.label}</option>`).join('');
    };

    /**
     * Áp dụng bộ lọc
     */
    this.applyFilters = function() {
        const filters = {
            year: document.getElementById('yearFilter')?.value,
            semester: document.getElementById('semesterFilter')?.value,
            level: document.getElementById('levelFilter')?.value,
            faculty: document.getElementById('facultyFilter')?.value,
            major: document.getElementById('majorFilter')?.value
        };

        console.log('Applying filters:', filters);
        
        // Hiển thị loading
        this.showLoadingState();
        
        // Simulate API call
        setTimeout(() => {
            // TODO: Gọi API với filters
            this.hideLoadingState();
            
            // Hiển thị thông báo
            this.showNotification('Đã áp dụng bộ lọc thành công!', 'success');
        }, 500);
    };

    /**
     * Reset bộ lọc về mặc định
     */
    this.resetFilters = function() {
        document.getElementById('yearFilter').value = '2024-2025';
        document.getElementById('semesterFilter').value = '';
        document.getElementById('levelFilter').value = '';
        document.getElementById('facultyFilter').value = '';
        document.getElementById('majorFilter').value = '';
        
        this.updateMajorOptions('');
        this.showNotification('Đã reset bộ lọc về mặc định!', 'info');
        
        // Reload data
        this.applyFilters();
    };

    /**
     * Hiển thị thông báo
     */
    this.showNotification = function(message, type) {
        // Simple console notification for now
        console.log(`[${type.toUpperCase()}] ${message}`);
        // TODO: Implement toast notification UI
    };

    // ==================== UTILITIES ====================
    
    /**
     * Cập nhật thời gian cập nhật cuối
     */
    this.updateLastUpdateTime = function() {
        const timeElement = document.getElementById('lastUpdateTime');
        if (timeElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            const dateString = now.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            timeElement.textContent = `${timeString} - ${dateString}`;
        }
    };
}
