/**
 * ============================================
 * DASHBOARD BGH - BACKEND LOGIC
 * Xử lý dữ liệu và render các component
 * Version: 2.0.0
 * ============================================
 */

function DashboardBGH() {
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
            category: 'Quy mô sinh viên',
            value: '33,000',
            trend: 'up',
            trendValue: '+3.8%',
            subtext: 'so với cùng kỳ năm trước',
            color: 'blue'
        },
        {
            id: 'kpi2',
            icon: 'fa-graduation-cap',
            label: 'Sinh viên nhập học mới',
            category: 'Tuyển sinh',
            value: '12,800',
            trend: 'up',
            trendValue: '+11.3%',
            subtext: '85.3% chỉ tiêu (15,000 SV)',
            color: 'green'
        },
        {
            id: 'kpi3',
            icon: 'fa-award',
            label: 'Tỷ lệ TN đúng hạn',
            category: 'Chỉ số vàng',
            value: '68.5%',
            trend: 'up',
            trendValue: '+5.1%',
            subtext: 'Mục tiêu 75% (còn thiếu 6.5%)',
            color: 'orange'
        },
        {
            id: 'kpi4',
            icon: 'fa-exclamation-triangle',
            label: 'Tỷ lệ SV bị cảnh báo học vụ',
            category: 'Rủi ro',
            value: '2.1%',
            trend: 'down',
            trendValue: '-25.0%',
            subtext: '693 sinh viên (giảm 231 SV)',
            color: 'red'
        }
    ];

    /**
     * Dữ liệu các khoa
     */
    this.facultyData = [
        { name: 'Khoa CNTT', students: 8500, gpa: 3.25, programs: 6, passRate: 92.5 },
        { name: 'Khoa Kinh tế', students: 7200, gpa: 3.08, programs: 5, passRate: 88.2 },
        { name: 'Khoa Ngoại ngữ', students: 4800, gpa: 3.15, programs: 4, passRate: 90.1 },
        { name: 'Khoa Kỹ thuật', students: 6200, gpa: 3.02, programs: 7, passRate: 85.8 },
        { name: 'Khoa Y tế', students: 6300, gpa: 3.18, programs: 3, passRate: 89.6 }
    ];

    /**
     * Dữ liệu rủi ro
     */
    this.riskData = [
        {
            name: 'Khoa Công nghệ thông tin',
            riskScore: 85.2,
            level: 'Cao',
            color: 'high',
            mainCause: 'GPA TB ↓, Tỷ lệ trượt ↑',
            icon: 'fa-computer'
        },
        {
            name: 'Khoa Cơ khí',
            riskScore: 76.8,
            level: 'Trung bình',
            color: 'medium',
            mainCause: 'SV thôi học cao',
            icon: 'fa-gear'
        },
        {
            name: 'Khoa Kinh tế',
            riskScore: 68.4,
            level: 'Trung bình',
            color: 'medium',
            mainCause: 'Nhập điểm trễ',
            icon: 'fa-chart-line'
        },
        {
            name: 'Khoa Ngoại ngữ',
            riskScore: 58.7,
            level: 'Trung bình',
            color: 'medium',
            mainCause: 'Vi phạm tiến độ đào tạo',
            icon: 'fa-language'
        },
        {
            name: 'Khoa Kỹ thuật',
            riskScore: 45.3,
            level: 'Thấp',
            color: 'low',
            mainCause: 'Ổn định chung',
            icon: 'fa-wrench'
        }
    ];

    // ==================== INITIALIZATION ====================
    
    /**
     * Khởi tạo Dashboard
     */
    this.init = function() {
        console.log('🚀 Dashboard BGH: Initializing...');
        
        this.loadData();
        this.renderStatsCards();
        // Bỏ renderGPACards() - không hiển thị cards nữa
        this.renderQuickStats();
        this.renderRiskList();
        this.renderHighlightCard();
        this.initCharts();
        this.bindEvents();
        this.updateLastUpdateTime();
        
        console.log('✅ Dashboard BGH: Initialized successfully');
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
        
        // TODO: Thay thế bằng API call thực
        // fetch('/api/dashboard/bgh')
        //     .then(response => response.json())
        //     .then(data => {
        //         this.kpiData = data.kpis;
        //         this.facultyData = data.faculties;
        //         this.riskData = data.risks;
        //         this.renderAll();
        //     })
        //     .catch(error => {
        //         console.error('Error loading data:', error);
        //         this.showError('Không thể tải dữ liệu');
        //     });
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
        // Bỏ renderGPACards()
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
            
            return `
                <div class="stat-card ${stat.color} fade-in">
                    <div class="stat-header">
                        <div class="stat-icon">
                            <i class="fa-solid ${stat.icon}"></i>
                        </div>
                        <div class="stat-trend ${trendClass}">
                            <i class="fa-solid ${trendIcon}"></i>
                            ${stat.trendValue}
                        </div>
                    </div>
                    <div class="stat-value">${stat.value}</div>
                    <div class="stat-label">${stat.label}</div>
                    <div class="stat-subtitle">${stat.subtext}</div>
                </div>
            `;
        }).join('');
        
        console.log('✅ Stats cards rendered');
    };

    /**
     * Render GPA Cards - Padding hợp lý
     */
    this.renderGPACards = function() {
        const container = document.getElementById('gpaCards');
        if (!container) return;

        container.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 20px;">
                ${this.facultyData.map(faculty => {
                    // Xác định màu sắc dựa trên điều kiện
                    const isGoodGPA = faculty.gpa > 2.5;
                    const isGoodPass = faculty.passRate > 90;
                    
                    let borderColor = '#10b981'; // Xanh lá - Tốt
                    if (!isGoodGPA && isGoodPass) {
                        borderColor = '#f59e0b'; // Cam - Chưa cao
                    } else if (isGoodGPA && !isGoodPass) {
                        borderColor = '#ef4444'; // Đỏ - Phân hóa
                    }
                    
                    const gpaColor = isGoodGPA ? '#10b981' : '#f59e0b';
                    const passColor = isGoodPass ? '#10b981' : '#f59e0b';
                    const gpaWidth = (faculty.gpa / 4) * 100;
                    const passWidth = faculty.passRate;
                    
                    return `
                        <div style="background: white; border-radius: 8px; padding: 14px 10px; border-left: 4px solid ${borderColor}; box-shadow: 0 1px 3px rgba(0,0,0,0.08); transition: all 0.2s; min-height: 160px; display: flex; flex-direction: column; justify-content: space-between;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 1px 3px rgba(0,0,0,0.08)'">
                            <div style="font-size: 12px; color: #374151; font-weight: 600; margin-bottom: 10px; text-align: center; line-height: 1.3;">${faculty.name}</div>
                            
                            <!-- GPA -->
                            <div style="margin-bottom: 10px;">
                                <div style="font-size: 28px; font-weight: 700; color: ${gpaColor}; margin-bottom: 6px; text-align: center; line-height: 1;">${faculty.gpa}</div>
                                <div style="width: 100%; height: 4px; background: #e5e7eb; border-radius: 2px; overflow: hidden;">
                                    <div style="width: ${gpaWidth}%; height: 100%; background: ${gpaColor}; transition: width 0.8s ease;"></div>
                                </div>
                                <div style="font-size: 10px; color: #9ca3af; margin-top: 4px; text-align: center;">GPA TB</div>
                            </div>
                            
                            <!-- Tỷ lệ đỗ -->
                            <div style="background: #f9fafb; padding: 8px 6px; border-radius: 6px;">
                                <div style="font-size: 24px; font-weight: 700; color: ${passColor}; margin-bottom: 6px; text-align: center; line-height: 1;">${faculty.passRate}%</div>
                                <div style="width: 100%; height: 4px; background: #e5e7eb; border-radius: 2px; overflow: hidden;">
                                    <div style="width: ${passWidth}%; height: 100%; background: ${passColor}; transition: width 1s ease;"></div>
                                </div>
                                <div style="font-size: 10px; color: #9ca3af; margin-top: 4px; text-align: center;">Tỷ lệ đỗ</div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        
        console.log('✅ GPA cards rendered');
    };

    /**
     * Render Quick Stats
     */
    this.renderQuickStats = function() {
        const container = document.getElementById('quickStats');
        if (!container) return;

        const totalStudents = this.facultyData.reduce((sum, f) => sum + f.students, 0);
        const avgGPA = (this.facultyData.reduce((sum, f) => sum + f.gpa, 0) / this.facultyData.length).toFixed(2);
        const totalPrograms = this.facultyData.reduce((sum, f) => sum + f.programs, 0);

        const quickStatsData = [
            { icon: 'fa-building-columns', label: 'Tổng số khoa', value: this.facultyData.length },
            { icon: 'fa-list-check', label: 'Tổng số ngành', value: totalPrograms },
            { icon: 'fa-star', label: 'GPA TB toàn trường', value: avgGPA },
            { icon: 'fa-briefcase', label: 'Tỷ lệ có việc làm', value: '92.8%' },
            { icon: 'fa-users', label: 'Tổng SV đang học', value: totalStudents.toLocaleString() }
        ];

        container.innerHTML = quickStatsData.map(item => `
            <div class="quick-stat-item">
                <span class="quick-stat-label">
                    <i class="fa-solid ${item.icon}" style="margin-right: 6px;"></i>
                    ${item.label}
                </span>
                <span class="quick-stat-value">${item.value}</span>
            </div>
        `).join('');
        
        console.log('✅ Quick stats rendered');
    };

    /**
     * Render Risk List
     */
    this.renderRiskList = function() {
        const container = document.getElementById('riskList');
        if (!container) return;

        const topRisks = this.riskData.slice(0, 5);

        container.innerHTML = topRisks.map(risk => `
            <div class="risk-item ${risk.color}">
                <div class="risk-header">
                    <span class="risk-name">
                        <i class="fa-solid ${risk.icon}" style="margin-right: 6px; font-size: 12px;"></i>
                        ${risk.name}
                    </span>
                    <span class="risk-score">${risk.riskScore.toFixed(1)}</span>
                </div>
                <p class="risk-description">${risk.mainCause}</p>
            </div>
        `).join('');
        
        console.log('✅ Risk list rendered');
    };

    /**
     * Render Highlight Card
     */
    this.renderHighlightCard = function() {
        const valueElement = document.getElementById('highlightValue');
        const labelElement = document.getElementById('highlightLabel');
        
        if (valueElement && labelElement) {
            const totalStudents = this.facultyData.reduce((sum, f) => sum + f.students, 0);
            valueElement.textContent = totalStudents.toLocaleString();
            labelElement.textContent = 'Tổng sinh viên toàn trường';
        }
    };

    // ==================== CHARTS ====================
    
    /**
     * Khởi tạo tất cả biểu đồ
     */
    this.initCharts = function() {
        console.log('📈 Initializing charts...');
        
        setTimeout(() => {
            if (typeof Chart !== 'undefined' && Chart !== null) {
                console.log('✅ Using Chart.js for interactive charts');
                this.initChartJSCharts();
            } else {
                console.log('⚠️ Chart.js not available, using fallback charts');
                this.createFallbackCharts();
            }
        }, 500);
    };

    /**
     * Khởi tạo Chart.js charts
     */
    this.initChartJSCharts = function() {
        this.initGPAChart();
        this.initStudentFlowChart();
        this.initTuitionChart();
    };

    /**
     * Biểu đồ GPA với Chart.js - Giống thiết kế trong hình
     */
    this.initGPAChart = function() {
        const ctx = document.getElementById('gpaChart');
        if (!ctx) return;

        try {
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: this.facultyData.map(f => f.name.replace('Khoa ', '')),
                    datasets: [
                        {
                            label: 'GPA TB (thang 4)',
                            data: this.facultyData.map(f => f.gpa),
                            backgroundColor: 'rgba(74, 144, 226, 0.9)',
                            borderColor: 'rgba(74, 144, 226, 1)',
                            borderWidth: 2,
                            yAxisID: 'y-axis-gpa',
                            barThickness: 50
                        },
                        {
                            label: 'Tỷ lệ đỗ (%)',
                            data: this.facultyData.map(f => f.passRate),
                            type: 'line',
                            borderColor: 'rgba(245, 158, 11, 1)',
                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
                            borderWidth: 3,
                            fill: false,
                            yAxisID: 'y-axis-pass',
                            pointRadius: 6,
                            pointHoverRadius: 8,
                            pointBackgroundColor: 'rgba(245, 158, 11, 1)',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: { top: 30, bottom: 20, left: 15, right: 15 }
                    },
                    scales: {
                        yAxes: [
                            {
                                id: 'y-axis-gpa',
                                type: 'linear',
                                position: 'left',
                                ticks: {
                                    beginAtZero: true,
                                    max: 4,
                                    stepSize: 1,
                                    fontSize: 12,
                                    fontColor: '#374151'
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: 'GPA (thang 4)',
                                    fontSize: 13,
                                    fontStyle: 'bold',
                                    fontColor: '#1e40af'
                                },
                                gridLines: {
                                    color: 'rgba(229, 231, 235, 1)',
                                    drawBorder: false
                                }
                            },
                            {
                                id: 'y-axis-pass',
                                type: 'linear',
                                position: 'right',
                                ticks: {
                                    beginAtZero: true,
                                    max: 100,
                                    stepSize: 25,
                                    fontSize: 12,
                                    fontColor: '#374151',
                                    callback: function(value) {
                                        return value + '%';
                                    }
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Tỷ lệ đỗ (%)',
                                    fontSize: 13,
                                    fontStyle: 'bold',
                                    fontColor: '#d97706'
                                },
                                gridLines: {
                                    drawOnChartArea: false,
                                    drawBorder: false
                                }
                            }
                        ],
                        xAxes: [{
                            ticks: {
                                fontSize: 12,
                                fontColor: '#374151'
                            },
                            gridLines: {
                                display: false,
                                drawBorder: false
                            }
                        }]
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            fontSize: 13,
                            padding: 20,
                            fontColor: '#374151',
                            usePointStyle: true,
                            boxWidth: 12
                        }
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                        titleFontSize: 14,
                        bodyFontSize: 13,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        cornerRadius: 8,
                        callbacks: {
                            label: function(tooltipItem, data) {
                                const datasetLabel = data.datasets[tooltipItem.datasetIndex].label;
                                const value = tooltipItem.yLabel;
                                if (datasetLabel.includes('%')) {
                                    return datasetLabel + ': ' + value + '%';
                                } else {
                                    return datasetLabel + ': ' + value;
                                }
                            }
                        }
                    },
                    plugins: {
                        datalabels: {
                            display: true,
                            color: function(context) {
                                return context.datasetIndex === 0 ? '#1e40af' : '#d97706';
                            },
                            font: {
                                weight: 'bold',
                                size: 12
                            },
                            formatter: function(value, context) {
                                if (context.datasetIndex === 1) {
                                    return value + '%';
                                }
                                return value;
                            },
                            anchor: 'end',
                            align: 'top'
                        }
                    }
                }
            });
            console.log('✅ GPA Chart created');
        } catch (error) {
            console.error('❌ Error creating GPA Chart:', error);
            this.showGPAFallback();
        }
    };

    /**
     * Biểu đồ Student Flow với Chart.js
     */
    this.initStudentFlowChart = function() {
        const ctx = document.getElementById('studentFlowChart');
        if (!ctx) return;

        try {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['2021', '2022', '2023', '2024', '2025'],
                    datasets: [
                        {
                            label: 'SV nhập mới',
                            data: [3000, 5000, 7500, 9000, 12000],
                            borderColor: 'rgba(59, 130, 246, 1)',
                            backgroundColor: 'rgba(59, 130, 246, 0.05)',
                            borderWidth: 3,
                            fill: false,
                            pointRadius: 0,
                            pointHoverRadius: 6,
                            tension: 0.4
                        },
                        {
                            label: 'SV đang học',
                            data: [7000, 10000, 15000, 22000, 32500],
                            borderColor: 'rgba(16, 185, 129, 1)',
                            backgroundColor: 'rgba(16, 185, 129, 0.05)',
                            borderWidth: 3,
                            fill: false,
                            pointRadius: 0,
                            pointHoverRadius: 6,
                            tension: 0.4
                        },
                        {
                            label: 'SV tốt nghiệp',
                            data: [500, 800, 1000, 1200, 1500],
                            borderColor: 'rgba(245, 158, 11, 1)',
                            backgroundColor: 'rgba(245, 158, 11, 0.05)',
                            borderWidth: 3,
                            fill: false,
                            pointRadius: 0,
                            pointHoverRadius: 6,
                            tension: 0.4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: { top: 30, bottom: 20, left: 20, right: 20 }
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                fontSize: 12,
                                callback: function(value) {
                                    return value.toLocaleString();
                                }
                            },
                            gridLines: { 
                                color: 'rgba(0,0,0,0.05)',
                                drawBorder: false
                            }
                        }],
                        xAxes: [{
                            ticks: { 
                                fontSize: 12,
                                padding: 10
                            },
                            gridLines: { 
                                display: false,
                                drawBorder: false
                            }
                        }]
                    },
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: { 
                            fontSize: 13, 
                            padding: 20,
                            usePointStyle: true,
                            boxWidth: 6
                        }
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                        titleFontSize: 14,
                        bodyFontSize: 13,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleFontColor: '#1e293b',
                        bodyFontColor: '#64748b',
                        borderColor: 'rgba(0,0,0,0.1)',
                        borderWidth: 1,
                        callbacks: {
                            label: function(tooltipItem, data) {
                                const label = data.datasets[tooltipItem.datasetIndex].label || '';
                                const value = tooltipItem.yLabel.toLocaleString();
                                return label + ': ' + value;
                            }
                        }
                    }
                }
            });
            console.log('✅ Student Flow Chart created');
        } catch (error) {
            console.error('❌ Error creating Student Flow Chart:', error);
            this.showStudentFlowFallback();
        }
    };

    /**
     * Biểu đồ Tuition với Chart.js
     */
    this.initTuitionChart = function() {
        const ctx = document.getElementById('tuitionChart');
        if (!ctx) return;

        try {
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
                    datasets: [
                        {
                            label: 'Đã thu (tỷ)',
                            data: [45, 75, 95, 112, 125],
                            backgroundColor: 'rgba(59, 130, 246, 0.85)',
                            borderColor: 'rgba(59, 130, 246, 1)',
                            borderWidth: 1,
                            yAxisID: 'y-axis-1',
                            barThickness: 50,
                            order: 2
                        },
                        {
                            label: 'Mục tiêu (tỷ)',
                            data: [50, 80, 100, 115, 132],
                            type: 'line',
                            borderColor: 'rgba(139, 195, 74, 1)',
                            backgroundColor: 'rgba(139, 195, 74, 0.1)',
                            borderWidth: 3,
                            fill: false,
                            yAxisID: 'y-axis-1',
                            pointRadius: 6,
                            pointHoverRadius: 8,
                            pointBackgroundColor: 'rgba(139, 195, 74, 1)',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                            tension: 0.3,
                            order: 1
                        },
                        {
                            label: 'Tỷ lệ thu %',
                            data: [90, 94, 95, 97, 95],
                            type: 'line',
                            borderColor: 'rgba(239, 68, 68, 1)',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            borderWidth: 3,
                            fill: false,
                            yAxisID: 'y-axis-2',
                            pointRadius: 6,
                            pointHoverRadius: 8,
                            pointBackgroundColor: 'rgba(239, 68, 68, 1)',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                            tension: 0.3,
                            order: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: { top: 30, bottom: 20, left: 50, right: 60 }
                    },
                    scales: {
                        yAxes: [
                            {
                                id: 'y-axis-1',
                                type: 'linear',
                                position: 'left',
                                ticks: {
                                    beginAtZero: true,
                                    fontSize: 14,
                                    fontStyle: 'bold',
                                    fontColor: '#1e293b',
                                    padding: 15,
                                    callback: function(value) {
                                        return value;
                                    }
                                },
                                gridLines: { 
                                    color: 'rgba(0,0,0,0.08)',
                                    drawBorder: false,
                                    lineWidth: 1
                                }
                            },
                            {
                                id: 'y-axis-2',
                                type: 'linear',
                                position: 'right',
                                ticks: {
                                    beginAtZero: false,
                                    min: 86,
                                    max: 98,
                                    fontSize: 14,
                                    fontStyle: 'bold',
                                    fontColor: '#1e293b',
                                    padding: 15,
                                    callback: function(value) {
                                        return value + '%';
                                    }
                                },
                                gridLines: { 
                                    drawOnChartArea: false,
                                    drawBorder: false
                                }
                            }
                        ],
                        xAxes: [{
                            ticks: { 
                                fontSize: 13,
                                fontStyle: 'bold',
                                fontColor: '#1e293b',
                                padding: 10
                            },
                            gridLines: { 
                                display: false,
                                drawBorder: false
                            }
                        }]
                    },
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            fontSize: 13,
                            padding: 20,
                            usePointStyle: true,
                            boxWidth: 6
                        }
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                        titleFontSize: 14,
                        bodyFontSize: 13,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleFontColor: '#1e293b',
                        bodyFontColor: '#64748b',
                        borderColor: 'rgba(0,0,0,0.1)',
                        borderWidth: 1,
                        callbacks: {
                            label: function(tooltipItem, data) {
                                const datasetLabel = data.datasets[tooltipItem.datasetIndex].label;
                                const value = tooltipItem.yLabel;
                                if (datasetLabel.includes('%')) {
                                    return datasetLabel + ': ' + value + '%';
                                } else {
                                    return datasetLabel + ': ' + value + ' tỷ';
                                }
                            }
                        }
                    }
                }
            });
            console.log('✅ Tuition Chart created');
        } catch (error) {
            console.error('❌ Error creating Tuition Chart:', error);
            this.showTuitionFallback();
        }
    };

    // ==================== FALLBACK CHARTS ====================
    
    /**
     * Tạo fallback charts khi Chart.js không có
     */
    this.createFallbackCharts = function() {
        this.showGPAFallback();
        this.showStudentFlowFallback();
        this.showTuitionFallback();
    };

    /**
     * GPA Fallback Chart - Chỉ hiển thị biểu đồ SVG (cards đã render riêng)
     */
    this.showGPAFallback = function() {
        const canvas = document.getElementById('gpaChart');
        const fallback = document.getElementById('gpaChartFallback');
        if (!canvas || !fallback) return;

        canvas.style.display = 'none';
        fallback.style.display = 'block';

        // Chỉ hiển thị biểu đồ SVG
        fallback.innerHTML = this.createGPASVGChart();
    };

    /**
     * Tạo biểu đồ SVG cho GPA/Tỷ lệ đỗ - Khung to hơn, thoáng hơn
     */
    this.createGPASVGChart = function() {
        const height = 430;
        const margin = { top: 40, right: 40, bottom: 65, left: 40 };
        
        const viewBoxWidth = 900;
        const chartWidth = viewBoxWidth - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        const maxGPA = 4;
        const maxPass = 100;

        const barWidth = 65;
        const spacing = chartWidth / this.facultyData.length;

        const linePoints = this.facultyData.map((faculty, index) => {
            const x = margin.left + spacing * index + spacing / 2;
            const y = margin.top + chartHeight - (faculty.passRate / maxPass * chartHeight);
            return { x, y, value: faculty.passRate };
        });

        const pathD = linePoints.map((point, index) => 
            `${index === 0 ? 'M' : 'L'} ${point.x},${point.y}`
        ).join(' ');

        return `
            <div style="background: linear-gradient(to bottom, #f0f9f0 0%, #ffffff 100%); border-radius: 10px; padding: 20px; border: 1px solid #d1e7dd;">
                <div style="text-align: center; margin-bottom: 15px;">
                    <h4 style="margin: 0; color: #374151; font-size: 14px; font-weight: 600;">GPA/Tỷ lệ đỗ</h4>
                </div>
                
                <svg width="100%" height="${height}" viewBox="0 0 ${viewBoxWidth} ${height}" preserveAspectRatio="xMidYMid meet" style="display: block;">
                    <!-- Grid -->
                    ${[0, 1, 2, 3, 4].map(i => {
                        const y = margin.top + (chartHeight * i / 4);
                        const gpaValue = 4 - i;
                        const passValue = (4 - i) * 25;
                        return `
                            <line x1="${margin.left}" y1="${y}" x2="${margin.left + chartWidth}" y2="${y}" 
                                  stroke="#e5e7eb" stroke-width="1" stroke-dasharray="3,3"/>
                            <text x="${margin.left - 12}" y="${y + 4}" text-anchor="end" font-size="11" fill="#6b7280">
                                ${gpaValue}
                            </text>
                            <text x="${margin.left + chartWidth + 12}" y="${y + 4}" text-anchor="start" font-size="11" fill="#6b7280">
                                ${passValue}
                            </text>
                        `;
                    }).join('')}
                    
                    <!-- Y labels -->
                    <text x="${margin.left - 25}" y="${margin.top - 15}" text-anchor="middle" font-size="11" font-weight="600" fill="#1e40af">4</text>
                    <text x="${margin.left + chartWidth + 25}" y="${margin.top - 15}" text-anchor="middle" font-size="11" font-weight="600" fill="#d97706">100</text>
                    
                    <!-- Bars -->
                    ${this.facultyData.map((faculty, index) => {
                        const x = margin.left + spacing * index + (spacing - barWidth) / 2;
                        const barHeight = (faculty.gpa / maxGPA) * chartHeight;
                        const y = margin.top + chartHeight - barHeight;
                        
                        return `
                            <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" 
                                  fill="#4a90e2" rx="3" opacity="0.9">
                                <title>${faculty.name}: GPA ${faculty.gpa}</title>
                            </rect>
                            <text x="${x + barWidth/2}" y="${y - 6}" text-anchor="middle" 
                                  font-size="13" font-weight="700" fill="#1e40af">
                                ${faculty.gpa}
                            </text>
                        `;
                    }).join('')}
                    
                    <!-- Line -->
                    <path d="${pathD}" stroke="#f59e0b" stroke-width="3" fill="none" 
                          stroke-linecap="round" stroke-linejoin="round"/>
                    
                    <!-- Points -->
                    ${linePoints.map((point, index) => `
                        <circle cx="${point.x}" cy="${point.y}" r="5" fill="#f59e0b" stroke="white" stroke-width="2">
                            <title>${this.facultyData[index].name}: ${point.value}%</title>
                        </circle>
                        <text x="${point.x}" y="${point.y - 10}" text-anchor="middle" 
                              font-size="12" font-weight="700" fill="#d97706">
                            ${point.value}%
                        </text>
                    `).join('')}
                    
                    <!-- X labels -->
                    ${this.facultyData.map((faculty, index) => {
                        const x = margin.left + spacing * index + spacing / 2;
                        const y = margin.top + chartHeight + 22;
                        const name = faculty.name.replace('Khoa ', '');
                        
                        return `
                            <text x="${x}" y="${y}" text-anchor="middle" font-size="11" fill="#374151" font-weight="500">
                                ${name}
                            </text>
                        `;
                    }).join('')}
                    
                    <!-- Legend -->
                    <g transform="translate(${viewBoxWidth/2 - 100}, ${margin.top + chartHeight + 42})">
                        <rect x="0" y="0" width="18" height="10" fill="#4a90e2" rx="2"/>
                        <text x="22" y="9" font-size="11" fill="#374151">GPA TB (thang 4)</text>
                        
                        <line x1="150" y1="5" x2="168" y2="5" stroke="#f59e0b" stroke-width="3"/>
                        <circle cx="159" cy="5" r="4" fill="#f59e0b" stroke="white" stroke-width="1.5"/>
                        <text x="172" y="9" font-size="11" fill="#374151">Tỷ lệ đỗ</text>
                    </g>
                </svg>
            </div>
        `;
    };

    /**
     * Student Flow Fallback Chart
     */
    this.showStudentFlowFallback = function() {
        const canvas = document.getElementById('studentFlowChart');
        const fallback = document.getElementById('studentFlowChartFallback');
        if (!canvas || !fallback) return;

        canvas.style.display = 'none';
        fallback.style.display = 'block';

        const years = ['2021', '2022', '2023', '2024', '2025'];
        const newStudents = [3000, 5000, 7500, 9000, 12000];
        const currentStudents = [7000, 10000, 15000, 22000, 32500];
        const graduates = [500, 800, 1000, 1200, 1500];
        
        const maxValue = Math.max(...currentStudents);
        const chartHeight = 300;
        const chartWidth = 800;
        const padding = { top: 40, right: 40, bottom: 60, left: 60 };
        const plotWidth = chartWidth - padding.left - padding.right;
        const plotHeight = chartHeight - padding.top - padding.bottom;

        // Tạo các điểm cho đường line
        const createPath = (data) => {
            return data.map((value, index) => {
                const x = padding.left + (index / (data.length - 1)) * plotWidth;
                const y = padding.top + plotHeight - (value / maxValue) * plotHeight;
                return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
            }).join(' ');
        };

        fallback.innerHTML = `
            <svg width="100%" height="${chartHeight}" viewBox="0 0 ${chartWidth} ${chartHeight}" style="background: #f8f9fa;">
                <!-- Grid lines -->
                ${[0, 1, 2, 3, 4].map(i => {
                    const y = padding.top + (i / 4) * plotHeight;
                    const value = Math.round(maxValue * (1 - i / 4));
                    return `
                        <line x1="${padding.left}" y1="${y}" x2="${chartWidth - padding.right}" y2="${y}" 
                              stroke="rgba(0,0,0,0.05)" stroke-width="1"/>
                        <text x="${padding.left - 10}" y="${y + 4}" text-anchor="end" 
                              font-size="11" fill="#64748b">${value.toLocaleString()}</text>
                    `;
                }).join('')}
                
                <!-- X-axis labels -->
                ${years.map((year, index) => {
                    const x = padding.left + (index / (years.length - 1)) * plotWidth;
                    return `<text x="${x}" y="${chartHeight - padding.bottom + 25}" text-anchor="middle" 
                                  font-size="12" fill="#1e293b" font-weight="500">${year}</text>`;
                }).join('')}
                
                <!-- Line: SV đang học (green) -->
                <path d="${createPath(currentStudents)}" fill="none" stroke="rgba(16, 185, 129, 1)" 
                      stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                
                <!-- Line: SV nhập mới (blue) -->
                <path d="${createPath(newStudents)}" fill="none" stroke="rgba(59, 130, 246, 1)" 
                      stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                
                <!-- Line: SV tốt nghiệp (orange) -->
                <path d="${createPath(graduates)}" fill="none" stroke="rgba(245, 158, 11, 1)" 
                      stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                
                <!-- Legend -->
                <g transform="translate(${padding.left}, ${chartHeight - 20})">
                    <circle cx="0" cy="0" r="4" fill="rgba(59, 130, 246, 1)"/>
                    <text x="10" y="4" font-size="12" fill="#64748b">SV nhập mới</text>
                    
                    <circle cx="120" cy="0" r="4" fill="rgba(16, 185, 129, 1)"/>
                    <text x="130" y="4" font-size="12" fill="#64748b">SV đang học</text>
                    
                    <circle cx="240" cy="0" r="4" fill="rgba(245, 158, 11, 1)"/>
                    <text x="250" y="4" font-size="12" fill="#64748b">SV tốt nghiệp</text>
                </g>
            </svg>
        `;
    };

    /**
     * Tuition Fallback Chart
     */
    this.showTuitionFallback = function() {
        const canvas = document.getElementById('tuitionChart');
        const fallback = document.getElementById('tuitionChartFallback');
        if (!canvas || !fallback) return;

        canvas.style.display = 'none';
        fallback.style.display = 'block';

        const months = ['Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
        const collected = [45, 75, 95, 112, 125];
        const target = [50, 80, 100, 115, 132];
        const rates = [90, 94, 95, 97, 95];
        
        const maxValue = Math.max(...target);
        const chartHeight = 320;
        const chartWidth = 800;
        const padding = { top: 40, right: 70, bottom: 80, left: 70 };
        const plotWidth = chartWidth - padding.left - padding.right;
        const plotHeight = chartHeight - padding.top - padding.bottom;
        const barWidth = 40;

        // Tạo path cho đường line
        const createPath = (data, scale) => {
            return data.map((value, index) => {
                const x = padding.left + (index / (data.length - 1)) * plotWidth;
                const y = padding.top + plotHeight - (value / scale) * plotHeight;
                return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
            }).join(' ');
        };

        fallback.innerHTML = `
            <svg width="100%" height="${chartHeight}" viewBox="0 0 ${chartWidth} ${chartHeight}" style="background: #f8f9fa;">
                <!-- Grid lines -->
                ${[0, 1, 2, 3, 4].map(i => {
                    const y = padding.top + (i / 4) * plotHeight;
                    const value = Math.round(maxValue * (1 - i / 4));
                    return `
                        <line x1="${padding.left}" y1="${y}" x2="${chartWidth - padding.right}" y2="${y}" 
                              stroke="rgba(0,0,0,0.08)" stroke-width="1"/>
                        <text x="${padding.left - 15}" y="${y + 5}" text-anchor="end" 
                              font-size="14" font-weight="bold" fill="#1e293b">${value}</text>
                    `;
                }).join('')}
                
                <!-- Right Y-axis labels (%) -->
                ${[86, 89, 92, 95, 98].map((value, i) => {
                    const y = padding.top + plotHeight - (i / 4) * plotHeight;
                    return `
                        <text x="${chartWidth - padding.right + 15}" y="${y + 5}" text-anchor="start" 
                              font-size="14" font-weight="bold" fill="#1e293b">${value}%</text>
                    `;
                }).join('')}
                
                <!-- Bars (Đã thu) -->
                ${collected.map((value, index) => {
                    const x = padding.left + (index / (collected.length - 1)) * plotWidth - barWidth / 2;
                    const barHeight = (value / maxValue) * plotHeight;
                    const y = padding.top + plotHeight - barHeight;
                    return `
                        <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" 
                              fill="rgba(59, 130, 246, 0.85)" stroke="rgba(59, 130, 246, 1)" stroke-width="1"/>
                    `;
                }).join('')}
                
                <!-- Line: Mục tiêu (green) -->
                <path d="${createPath(target, maxValue)}" fill="none" stroke="rgba(139, 195, 74, 1)" 
                      stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                ${target.map((value, index) => {
                    const x = padding.left + (index / (target.length - 1)) * plotWidth;
                    const y = padding.top + plotHeight - (value / maxValue) * plotHeight;
                    return `<circle cx="${x}" cy="${y}" r="5" fill="rgba(139, 195, 74, 1)" stroke="#fff" stroke-width="2"/>`;
                }).join('')}
                
                <!-- Line: Tỷ lệ thu % (red) - scale 86-98 -->
                <path d="${createPath(rates.map(r => (r - 86) * (maxValue / 12)), maxValue)}" fill="none" 
                      stroke="rgba(239, 68, 68, 1)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                ${rates.map((value, index) => {
                    const x = padding.left + (index / (rates.length - 1)) * plotWidth;
                    const scaledValue = (value - 86) * (maxValue / 12);
                    const y = padding.top + plotHeight - (scaledValue / maxValue) * plotHeight;
                    return `<circle cx="${x}" cy="${y}" r="5" fill="rgba(239, 68, 68, 1)" stroke="#fff" stroke-width="2"/>`;
                }).join('')}
                
                <!-- X-axis labels -->
                ${months.map((month, index) => {
                    const x = padding.left + (index / (months.length - 1)) * plotWidth;
                    return `<text x="${x}" y="${chartHeight - padding.bottom + 25}" text-anchor="middle" 
                                  font-size="13" font-weight="bold" fill="#1e293b">${month}</text>`;
                }).join('')}
                
                <!-- Legend -->
                <g transform="translate(${padding.left}, ${chartHeight - 30})">
                    <rect x="0" y="-8" width="12" height="12" fill="rgba(59, 130, 246, 0.85)"/>
                    <text x="18" y="2" font-size="12" fill="#64748b">Đã thu (tỷ)</text>
                    
                    <circle cx="130" cy="-2" r="4" fill="rgba(139, 195, 74, 1)"/>
                    <text x="140" y="2" font-size="12" fill="#64748b">Mục tiêu (tỷ)</text>
                    
                    <circle cx="270" cy="-2" r="4" fill="rgba(239, 68, 68, 1)"/>
                    <text x="280" y="2" font-size="12" fill="#64748b">Tỷ lệ thu %</text>
                </g>
            </svg>
        `;
    };

    // ==================== EVENT HANDLERS ====================
    
    /**
     * Bind các event listeners
     */
    this.bindEvents = function() {
        const yearFilter = document.getElementById('yearFilter');
        const levelFilter = document.getElementById('levelFilter');

        if (yearFilter) {
            yearFilter.addEventListener('change', () => {
                console.log('📅 Year filter changed:', yearFilter.value);
                this.handleFilterChange();
            });
        }

        if (levelFilter) {
            levelFilter.addEventListener('change', () => {
                console.log('🎓 Level filter changed:', levelFilter.value);
                this.handleFilterChange();
            });
        }

        // Auto-update timestamp every minute
        setInterval(() => {
            this.updateLastUpdateTime();
        }, 60000);
        
        console.log('✅ Events bound');
    };

    /**
     * Xử lý khi filter thay đổi
     */
    this.handleFilterChange = function() {
        console.log('🔄 Reloading data with new filters...');
        this.updateLastUpdateTime();
        
        // TODO: Reload data với filters mới
        // const yearFilter = document.getElementById('yearFilter').value;
        // const levelFilter = document.getElementById('levelFilter').value;
        // this.loadData({ year: yearFilter, level: levelFilter });
    };

    /**
     * Cập nhật thời gian cập nhật cuối
     */
    this.updateLastUpdateTime = function() {
        const timeElement = document.getElementById('lastUpdateTime');
        if (timeElement) {
            const now = new Date();
            timeElement.textContent = now.toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        }
    };

    // ==================== UTILITY METHODS ====================
    
    /**
     * Hiển thị thông báo lỗi
     */
    this.showError = function(message) {
        console.error('❌ Error:', message);
        // TODO: Implement error notification UI
        alert('Lỗi: ' + message);
    };

    /**
     * Refresh toàn bộ dashboard
     */
    this.refresh = function() {
        console.log('🔄 Refreshing dashboard...');
        this.loadData();
    };

    /**
     * Export dữ liệu
     */
    this.exportData = function(format) {
        console.log('📥 Exporting data as:', format);
        // TODO: Implement export functionality
        alert('Chức năng export đang được phát triển');
    };
}

// ==================== EXPORT ====================

// Export for global use
window.DashboardBGH = DashboardBGH;

// Log version
console.log('📦 Dashboard BGH v2.0.0 loaded');
