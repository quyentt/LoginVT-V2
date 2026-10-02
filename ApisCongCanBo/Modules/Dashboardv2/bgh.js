// Dashboard BGH JavaScript - Sử dụng ApexCharts hoặc fallback

// Class chính
function DashboardBGH() {
    this.init = function() {
        this.loadData();
        this.renderStatsCards();
        this.renderQuickStats();
        this.renderRiskList();
        this.initCharts();
        this.bindEvents();
    };

    // Dữ liệu mẫu
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
            color: 'blue',
            statusIcon: 'fa-circle-check',
            statusText: 'Ổn định'
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
            color: 'green',
            statusIcon: 'fa-bullseye',
            statusText: 'Đạt mục tiêu'
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
            color: 'orange',
            statusIcon: 'fa-clock',
            statusText: 'Cần cải thiện'
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
            color: 'red',
            statusIcon: 'fa-shield-check',
            statusText: 'Đang kiểm soát'
        }
    ];

    this.facultyData = [
        { name: 'Khoa CNTT', students: 8500, gpa: 3.25, programs: 6, passRate: 92.5 },
        { name: 'Khoa Kinh tế', students: 7200, gpa: 3.08, programs: 5, passRate: 88.2 },
        { name: 'Khoa Ngoại ngữ', students: 4800, gpa: 3.15, programs: 4, passRate: 90.1 },
        { name: 'Khoa Kỹ thuật', students: 6200, gpa: 3.02, programs: 7, passRate: 85.8 },
        { name: 'Khoa Y tế', students: 6300, gpa: 3.18, programs: 3, passRate: 89.6 }
    ];

    this.riskData = [
        {
            name: 'Khoa Công nghệ thông tin',
            riskScore: 85.2,
            level: 'Cao',
            color: 'high',
            mainCause: 'GPA TB ↓, Tỷ lệ trượt ↑',
            icon: 'fa-computer',
            riskIcon: 'fa-triangle-exclamation'
        },
        {
            name: 'Khoa Cơ khí',
            riskScore: 76.8,
            level: 'Trung bình',
            color: 'medium',
            mainCause: 'SV thôi học cao',
            icon: 'fa-gear',
            riskIcon: 'fa-exclamation-circle'
        },
        {
            name: 'Khoa Kinh tế',
            riskScore: 68.4,
            level: 'Trung bình',
            color: 'medium',
            mainCause: 'Nhập điểm trễ',
            icon: 'fa-chart-line',
            riskIcon: 'fa-clock'
        },
        {
            name: 'Khoa Ngoại ngữ',
            riskScore: 58.7,
            level: 'Trung bình',
            color: 'medium',
            mainCause: 'Vi phạm tiến độ đào tạo',
            icon: 'fa-language',
            riskIcon: 'fa-calendar-xmark'
        },
        {
            name: 'Khoa Kỹ thuật',
            riskScore: 45.3,
            level: 'Thấp',
            color: 'low',
            mainCause: 'Ổn định chung',
            icon: 'fa-wrench',
            riskIcon: 'fa-circle-check'
        }
    ];

    // Load dữ liệu
    this.loadData = function() {
        console.log('Dashboard BGH: Loading data...');
        
        // Simulate loading with visual feedback
        this.showLoadingState();
        
        // Simulate API call delay
        setTimeout(() => {
            this.hideLoadingState();
            console.log('Dashboard BGH: Data loaded successfully');
        }, 1000);
    };

    // Show loading state
    this.showLoadingState = function() {
        const statsContainer = document.getElementById('statsCards');
        if (statsContainer) {
            statsContainer.innerHTML = Array(4).fill(0).map(() => `
                <div class="stat-card loading-shimmer" style="height: 180px; border-radius: 12px;"></div>
            `).join('');
        }
    };

    // Hide loading state
    this.hideLoadingState = function() {
        // Re-render all components after loading
        this.renderStatsCards();
        this.renderQuickStats();
        this.renderRiskList();
    };

    // Render Stats Cards
    this.renderStatsCards = function() {
        const container = document.getElementById('statsCards');
        if (!container) return;

        container.innerHTML = this.kpiData.map(stat => {
            const trendClass = stat.trend === 'up' ? 'up' : 'down';
            const trendIcon = stat.trend === 'up' ? 'fa-arrow-up' : 'fa-arrow-down';
            
            return `
                <div class="stat-card ${stat.color}">
                    <div class="stat-trend ${trendClass}">
                        <i class="fa-solid ${trendIcon}"></i> ${stat.trendValue}
                    </div>
                    <div class="stat-icon ${stat.color}">
                        <i class="fa-solid ${stat.icon}"></i>
                    </div>
                    <div class="stat-category">
                        <i class="fa-solid fa-tag" style="margin-right: 4px; opacity: 0.7;"></i>
                        ${stat.category}
                    </div>
                    <div class="stat-title">${stat.label}</div>
                    <div class="stat-value">${stat.value}</div>
                    <p class="stat-subtitle">
                        <i class="fa-solid ${stat.statusIcon}" style="margin-right: 5px; color: ${stat.color === 'green' ? '#4CAF50' : stat.color === 'orange' ? '#FF9800' : stat.color === 'red' ? '#F44336' : '#2196F3'};"></i>
                        ${stat.subtext}
                    </p>
                    <div style="margin-top: 10px; padding: 8px; background: rgba(0,0,0,0.05); border-radius: 6px; font-size: 11px; color: #666;">
                        <i class="fa-solid fa-info-circle" style="margin-right: 4px;"></i>
                        Trạng thái: ${stat.statusText}
                    </div>
                </div>
            `;
        }).join('');
    };

    // Render Quick Stats
    this.renderQuickStats = function() {
        const container = document.getElementById('quickStats');
        if (!container) return;

        const totalStudents = this.facultyData.reduce((sum, f) => sum + f.students, 0);
        const avgGPA = (this.facultyData.reduce((sum, f) => sum + f.gpa, 0) / this.facultyData.length).toFixed(2);
        const totalPrograms = this.facultyData.reduce((sum, f) => sum + f.programs, 0);

        const quickStatsData = [
            { icon: 'fa-building-columns', label: 'Tổng số khoa:', value: this.facultyData.length, color: '#2196F3' },
            { icon: 'fa-list-check', label: 'Tổng số ngành:', value: totalPrograms, color: '#4CAF50' },
            { icon: 'fa-star', label: 'GPA TB toàn trường:', value: avgGPA, color: '#FF9800' },
            { icon: 'fa-briefcase', label: 'Tỷ lệ có việc làm:', value: '92.8%', color: '#9C27B0' },
            { icon: 'fa-users', label: 'Tổng SV đang học:', value: totalStudents.toLocaleString(), color: '#607D8B' }
        ];

        container.innerHTML = quickStatsData.map(item => `
            <div class="quick-stat-item">
                <span class="quick-stat-label">
                    <i class="fa-solid ${item.icon}" style="color: ${item.color}; margin-right: 6px;"></i>
                    ${item.label}
                </span>
                <span class="quick-stat-value" style="color: ${item.color};">${item.value}</span>
            </div>
        `).join('');
    };

    // Render Risk List
    this.renderRiskList = function() {
        const container = document.getElementById('riskList');
        if (!container) return;

        const topRisks = this.riskData.slice(0, 5);

        container.innerHTML = topRisks.map((risk, index) => {
            const riskIconColor = risk.color === 'high' ? '#F44336' : risk.color === 'medium' ? '#FF9800' : '#4CAF50';
            const priorityIcon = index < 2 ? 'fa-fire' : index < 4 ? 'fa-exclamation-triangle' : 'fa-info-circle';
            
            return `
                <div class="risk-item ${risk.color}">
                    <div class="risk-header">
                        <span class="risk-name">
                            <i class="fa-solid ${risk.icon}" style="color: #666; margin-right: 6px; font-size: 12px;"></i>
                            #${index + 1} ${risk.name}
                        </span>
                        <span class="risk-score">
                            <i class="fa-solid ${priorityIcon}" style="color: ${riskIconColor}; margin-right: 4px; font-size: 12px;"></i>
                            ${risk.riskScore.toFixed(1)}
                        </span>
                    </div>
                    <p class="risk-description">
                        <i class="fa-solid ${risk.riskIcon}" style="color: ${riskIconColor}; margin-right: 5px; font-size: 10px;"></i>
                        ${risk.mainCause}
                    </p>
                    <div style="margin-top: 8px; font-size: 10px; color: #999;">
                        <i class="fa-solid fa-tag" style="margin-right: 4px;"></i>
                        Mức độ: ${risk.level}
                    </div>
                </div>
            `;
        }).join('');
    };

    // Initialize Charts - Hỗ trợ Chart.js hoặc SVG fallback
    this.initCharts = function() {
        console.log('Initializing charts...');
        
        // Đợi DOM ready
        setTimeout(() => {
            if (typeof Chart !== 'undefined' && Chart !== null) {
                console.log('Using Chart.js for interactive charts');
                this.initChartJSCharts();
            } else {
                console.log('Chart.js not available, using SVG charts');
                this.createSVGCharts();
            }
        }, 500);
    };

    // Initialize Chart.js Charts
    this.initChartJSCharts = function() {
        this.initGPAChartJS();
        this.initStudentFlowChartJS();
        this.initTuitionChartJS();
    };

    // GPA Chart với Chart.js
    this.initGPAChartJS = function() {
        const ctx = document.getElementById('gpaChart');
        if (!ctx) return;

        try {
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: this.facultyData.map(f => f.name),
                    datasets: [
                        {
                            label: 'GPA TB',
                            data: this.facultyData.map(f => f.gpa),
                            backgroundColor: 'rgba(33, 150, 243, 0.8)',
                            borderColor: 'rgba(33, 150, 243, 1)',
                            borderWidth: 2,
                            yAxisID: 'y-axis-1'
                        },
                        {
                            label: 'Tỷ lệ đỗ (%)',
                            data: this.facultyData.map(f => f.passRate),
                            type: 'line',
                            borderColor: 'rgba(244, 67, 54, 1)',
                            backgroundColor: 'rgba(244, 67, 54, 0.1)',
                            borderWidth: 3,
                            fill: false,
                            yAxisID: 'y-axis-2'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: {
                            top: 20,
                            bottom: 20,
                            left: 10,
                            right: 10
                        }
                    },
                    scales: {
                        yAxes: [
                            {
                                id: 'y-axis-1',
                                type: 'linear',
                                position: 'left',
                                ticks: {
                                    beginAtZero: true,
                                    max: 4,
                                    fontSize: 12
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: 'GPA',
                                    fontSize: 14,
                                    fontStyle: 'bold'
                                },
                                gridLines: {
                                    color: 'rgba(0,0,0,0.1)'
                                }
                            },
                            {
                                id: 'y-axis-2',
                                type: 'linear',
                                position: 'right',
                                ticks: {
                                    beginAtZero: true,
                                    max: 100,
                                    fontSize: 12
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Tỷ lệ đỗ (%)',
                                    fontSize: 14,
                                    fontStyle: 'bold'
                                },
                                gridLines: {
                                    drawOnChartArea: false
                                }
                            }
                        ],
                        xAxes: [{
                            ticks: {
                                fontSize: 11
                            },
                            gridLines: {
                                display: false
                            }
                        }]
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            fontSize: 12,
                            padding: 20
                        }
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                        titleFontSize: 13,
                        bodyFontSize: 12
                    }
                }
            });
            console.log('GPA Chart.js created successfully');
        } catch (error) {
            console.error('Error creating GPA Chart.js:', error);
            this.createSVGGPAChart();
        }
    };

    // Student Flow Chart với Chart.js
    this.initStudentFlowChartJS = function() {
        const ctx = document.getElementById('studentFlowChart');
        if (!ctx) return;

        try {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['2020', '2021', '2022', '2023', '2024', '2025 (dự kiến)'],
                    datasets: [
                        {
                            label: 'SV nhập mới',
                            data: [9800, 10500, 11200, 11800, 12800, 13500],
                            borderColor: 'rgba(76, 175, 80, 1)',
                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                            borderWidth: 3,
                            fill: true,
                            pointRadius: 6,
                            pointHoverRadius: 8
                        },
                        {
                            label: 'SV đang học',
                            data: [28500, 29800, 31200, 32100, 33000, 34200],
                            borderColor: 'rgba(33, 150, 243, 1)',
                            backgroundColor: 'rgba(33, 150, 243, 0.1)',
                            borderWidth: 3,
                            fill: true,
                            pointRadius: 6,
                            pointHoverRadius: 8
                        },
                        {
                            label: 'SV tốt nghiệp',
                            data: [8200, 8800, 9100, 9400, 9800, 10500],
                            borderColor: 'rgba(255, 152, 0, 1)',
                            backgroundColor: 'rgba(255, 152, 0, 0.1)',
                            borderWidth: 3,
                            fill: true,
                            pointRadius: 6,
                            pointHoverRadius: 8
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: {
                            top: 20,
                            bottom: 20,
                            left: 10,
                            right: 10
                        }
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                fontSize: 12
                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'Số sinh viên',
                                fontSize: 14,
                                fontStyle: 'bold'
                            },
                            gridLines: {
                                color: 'rgba(0,0,0,0.1)'
                            }
                        }],
                        xAxes: [{
                            ticks: {
                                fontSize: 12
                            },
                            gridLines: {
                                display: false
                            }
                        }]
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            fontSize: 12,
                            padding: 20
                        }
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                        titleFontSize: 13,
                        bodyFontSize: 12
                    }
                }
            });
            console.log('Student Flow Chart.js created successfully');
        } catch (error) {
            console.error('Error creating Student Flow Chart.js:', error);
            this.createSVGStudentFlowChart();
        }
    };

    // Tuition Chart với Chart.js - Thiết kế mới
    this.initTuitionChartJS = function() {
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
                            backgroundColor: 'rgba(33, 150, 243, 0.8)',
                            borderColor: 'rgba(33, 150, 243, 1)',
                            borderWidth: 2,
                            yAxisID: 'y-axis-1',
                            barThickness: 40
                        },
                        {
                            label: 'Mục tiêu (tỷ)',
                            data: [50, 80, 100, 115, 132],
                            backgroundColor: 'rgba(76, 175, 80, 0.8)',
                            borderColor: 'rgba(76, 175, 80, 1)',
                            borderWidth: 2,
                            yAxisID: 'y-axis-1',
                            barThickness: 40
                        },
                        {
                            label: 'Tỷ lệ thu (%)',
                            data: [90, 94, 95, 97, 95],
                            type: 'line',
                            borderColor: 'rgba(244, 67, 54, 1)',
                            backgroundColor: 'rgba(244, 67, 54, 0.1)',
                            borderWidth: 4,
                            fill: false,
                            yAxisID: 'y-axis-2',
                            pointRadius: 8,
                            pointHoverRadius: 10,
                            pointBackgroundColor: 'rgba(244, 67, 54, 1)',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 3
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: {
                            top: 40,
                            bottom: 30,
                            left: 20,
                            right: 20
                        }
                    },
                    scales: {
                        yAxes: [
                            {
                                id: 'y-axis-1',
                                type: 'linear',
                                position: 'left',
                                ticks: {
                                    beginAtZero: true,
                                    fontSize: 12,
                                    fontColor: '#666',
                                    callback: function(value) {
                                        return value + ' tỷ';
                                    }
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Số tiền (tỷ VNĐ)',
                                    fontSize: 14,
                                    fontStyle: 'bold',
                                    fontColor: '#333'
                                },
                                gridLines: {
                                    color: 'rgba(0,0,0,0.1)',
                                    lineWidth: 1
                                }
                            },
                            {
                                id: 'y-axis-2',
                                type: 'linear',
                                position: 'right',
                                ticks: {
                                    beginAtZero: true,
                                    min: 85,
                                    max: 100,
                                    fontSize: 12,
                                    fontColor: '#666',
                                    callback: function(value) {
                                        return value + '%';
                                    }
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Tỷ lệ thu (%)',
                                    fontSize: 14,
                                    fontStyle: 'bold',
                                    fontColor: '#333'
                                },
                                gridLines: {
                                    drawOnChartArea: false
                                }
                            }
                        ],
                        xAxes: [{
                            ticks: {
                                fontSize: 12,
                                fontColor: '#666'
                            },
                            gridLines: {
                                display: false
                            },
                            categoryPercentage: 0.8,
                            barPercentage: 0.9
                        }]
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            fontSize: 13,
                            padding: 20,
                            fontColor: '#333',
                            usePointStyle: true
                        }
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                        titleFontSize: 14,
                        bodyFontSize: 13,
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleFontColor: '#fff',
                        bodyFontColor: '#fff',
                        borderColor: 'rgba(0,0,0,0.1)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(tooltipItem, data) {
                                const datasetLabel = data.datasets[tooltipItem.datasetIndex].label;
                                const value = tooltipItem.yLabel;
                                if (datasetLabel.includes('%')) {
                                    return datasetLabel + ': ' + value + '%';
                                } else {
                                    return datasetLabel + ': ' + value + ' tỷ VNĐ';
                                }
                            },
                            afterBody: function(tooltipItems, data) {
                                if (tooltipItems.length > 0) {
                                    const index = tooltipItems[0].index;
                                    const collected = [45, 75, 95, 112, 125][index];
                                    const target = [50, 80, 100, 115, 132][index];
                                    const rate = Math.round((collected / target) * 100);
                                    return ['', `Hiệu suất: ${rate}%`, `Chênh lệch: ${(collected - target > 0 ? '+' : '')}${collected - target} tỷ`];
                                }
                                return [];
                            }
                        }
                    },
                    plugins: {
                        datalabels: {
                            display: false
                        }
                    }
                }
            });
            console.log('Tuition Chart.js created successfully');
        } catch (error) {
            console.error('Error creating Tuition Chart.js:', error);
            this.createSVGTuitionChart();
        }
    };

    // Tạo biểu đồ SVG (fallback khi Chart.js không có)
    this.createSVGCharts = function() {
        console.log('Creating SVG charts...');
        this.createSVGGPAChart();
        this.createSVGStudentFlowChart();
        this.createSVGTuitionChart();
    };

    // SVG GPA Chart
    this.createSVGGPAChart = function() {
        const canvas = document.getElementById('gpaChart');
        const fallback = document.getElementById('gpaChartFallback');
        if (!canvas || !fallback) return;

        canvas.style.display = 'none';
        fallback.style.display = 'block';

        const width = 700;
        const height = 500;
        const margin = { top: 40, right: 100, bottom: 80, left: 80 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        // Tạo SVG
        const svg = `
            <svg width="${width}" height="${height}" style="background: white; border-radius: 8px;">
                <!-- Grid lines -->
                ${[0, 1, 2, 3, 4].map(i => 
                    `<line x1="${margin.left}" y1="${margin.top + (chartHeight * i / 4)}" 
                           x2="${margin.left + chartWidth}" y2="${margin.top + (chartHeight * i / 4)}" 
                           stroke="#e0e0e0" stroke-dasharray="2,2"/>`
                ).join('')}
                
                <!-- Bars và Line -->
                ${this.facultyData.map((faculty, index) => {
                    const x = margin.left + (index * chartWidth / this.facultyData.length) + 20;
                    const barWidth = (chartWidth / this.facultyData.length) - 40;
                    const gpaHeight = (faculty.gpa / 4) * chartHeight;
                    const passY = margin.top + chartHeight - ((faculty.passRate / 100) * chartHeight);
                    
                    return `
                        <!-- GPA Bar -->
                        <rect x="${x}" y="${margin.top + chartHeight - gpaHeight}" 
                              width="${barWidth}" height="${gpaHeight}" 
                              fill="rgba(33, 150, 243, 0.8)" stroke="rgba(33, 150, 243, 1)" stroke-width="2" rx="4"/>
                        
                        <!-- Pass Rate Point -->
                        <circle cx="${x + barWidth/2}" cy="${passY}" r="6" 
                                fill="rgba(244, 67, 54, 1)" stroke="white" stroke-width="2"/>
                        
                        <!-- Labels -->
                        <text x="${x + barWidth/2}" y="${height - 10}" text-anchor="middle" 
                              font-size="12" fill="#666">${faculty.name}</text>
                        
                        <!-- Values -->
                        <text x="${x + barWidth/2}" y="${margin.top + chartHeight - gpaHeight - 5}" text-anchor="middle" 
                              font-size="11" font-weight="bold" fill="#1976d2">${faculty.gpa}</text>
                        <text x="${x + barWidth/2}" y="${passY - 10}" text-anchor="middle" 
                              font-size="11" font-weight="bold" fill="#d32f2f">${faculty.passRate}%</text>
                    `;
                }).join('')}
                
                <!-- Y Axis Labels -->
                <text x="20" y="${margin.top + 10}" font-size="12" fill="#666">GPA</text>
                <text x="${width - 20}" y="${margin.top + 10}" font-size="12" fill="#666" text-anchor="end">Tỷ lệ đỗ (%)</text>
                
                <!-- Legend -->
                <g transform="translate(${margin.left}, 10)">
                    <rect x="0" y="0" width="15" height="15" fill="rgba(33, 150, 243, 0.8)"/>
                    <text x="20" y="12" font-size="12" fill="#666">GPA TB</text>
                    <circle cx="100" cy="7" r="6" fill="rgba(244, 67, 54, 1)"/>
                    <text x="115" y="12" font-size="12" fill="#666">Tỷ lệ đỗ (%)</text>
                </g>
            </svg>
        `;

        fallback.innerHTML = svg;
    };

    // SVG Student Flow Chart
    this.createSVGStudentFlowChart = function() {
        const canvas = document.getElementById('studentFlowChart');
        const fallback = document.getElementById('studentFlowChartFallback');
        if (!canvas || !fallback) return;

        canvas.style.display = 'none';
        fallback.style.display = 'block';

        const width = 700;
        const height = 500;
        const margin = { top: 60, right: 60, bottom: 80, left: 100 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        const years = ['2020', '2021', '2022', '2023', '2024', '2025'];
        const datasets = [
            { name: 'SV nhập mới', data: [9800, 10500, 11200, 11800, 12800, 13500], color: '#4CAF50' },
            { name: 'SV đang học', data: [28500, 29800, 31200, 32100, 33000, 34200], color: '#2196F3' },
            { name: 'SV tốt nghiệp', data: [8200, 8800, 9100, 9400, 9800, 10500], color: '#FF9800' }
        ];

        const maxValue = Math.max(...datasets.flatMap(d => d.data));

        const svg = `
            <svg width="${width}" height="${height}" style="background: white; border-radius: 8px;">
                <!-- Grid lines -->
                ${[0, 1, 2, 3, 4].map(i => 
                    `<line x1="${margin.left}" y1="${margin.top + (chartHeight * i / 4)}" 
                           x2="${margin.left + chartWidth}" y2="${margin.top + (chartHeight * i / 4)}" 
                           stroke="#e0e0e0" stroke-dasharray="2,2"/>`
                ).join('')}
                
                <!-- Lines -->
                ${datasets.map(dataset => {
                    const points = dataset.data.map((value, index) => {
                        const x = margin.left + (index * chartWidth / (years.length - 1));
                        const y = margin.top + chartHeight - ((value / maxValue) * chartHeight);
                        return `${x},${y}`;
                    }).join(' ');
                    
                    return `
                        <polyline points="${points}" fill="none" stroke="${dataset.color}" stroke-width="3"/>
                        ${dataset.data.map((value, index) => {
                            const x = margin.left + (index * chartWidth / (years.length - 1));
                            const y = margin.top + chartHeight - ((value / maxValue) * chartHeight);
                            return `<circle cx="${x}" cy="${y}" r="5" fill="${dataset.color}" stroke="white" stroke-width="2"/>`;
                        }).join('')}
                    `;
                }).join('')}
                
                <!-- X Axis Labels -->
                ${years.map((year, index) => {
                    const x = margin.left + (index * chartWidth / (years.length - 1));
                    return `<text x="${x}" y="${height - 20}" text-anchor="middle" font-size="12" fill="#666">${year}</text>`;
                }).join('')}
                
                <!-- Legend -->
                <g transform="translate(${margin.left}, 15)">
                    ${datasets.map((dataset, index) => `
                        <g transform="translate(${index * 120}, 0)">
                            <line x1="0" y1="0" x2="20" y2="0" stroke="${dataset.color}" stroke-width="3"/>
                            <text x="25" y="5" font-size="12" fill="#666">${dataset.name}</text>
                        </g>
                    `).join('')}
                </g>
            </svg>
        `;

        fallback.innerHTML = svg;
    };

    // SVG Tuition Chart
    this.createSVGTuitionChart = function() {
        const canvas = document.getElementById('tuitionChart');
        const fallback = document.getElementById('tuitionChartFallback');
        if (!canvas || !fallback) return;

        canvas.style.display = 'none';
        fallback.style.display = 'block';

        // Sử dụng HTML/CSS chart đẹp hơn cho tuition
        fallback.innerHTML = this.createSimpleTuitionChart();
    };

    // GPA Chart với ApexCharts
    this.initGPAChart = function() {
        const container = document.getElementById('gpaChart');
        if (!container) return;

        const options = {
            series: [
                {
                    name: 'GPA TB',
                    type: 'column',
                    data: this.facultyData.map(f => f.gpa)
                },
                {
                    name: 'Tỷ lệ đỗ (%)',
                    type: 'line',
                    data: this.facultyData.map(f => f.passRate)
                }
            ],
            chart: {
                height: 400,
                type: 'line'
            },
            colors: ['#2196F3', '#F44336'],
            stroke: {
                width: [0, 4]
            },
            labels: this.facultyData.map(f => f.name),
            yaxis: [
                {
                    title: { text: 'GPA' },
                    min: 0,
                    max: 4
                },
                {
                    opposite: true,
                    title: { text: 'Tỷ lệ đỗ (%)' },
                    min: 0,
                    max: 100
                }
            ]
        };

        try {
            const chart = new ApexCharts(container, options);
            chart.render();
            console.log('GPA Chart created successfully');
        } catch (error) {
            console.error('Error creating GPA Chart:', error);
            this.createSimpleGPAChart();
        }
    };

    // Student Flow Chart
    this.initStudentFlowChart = function() {
        const container = document.getElementById('studentFlowChart');
        if (!container) return;

        const options = {
            series: [
                {
                    name: 'SV nhập mới',
                    data: [9800, 10500, 11200, 11800, 12800, 13500]
                },
                {
                    name: 'SV đang học',
                    data: [28500, 29800, 31200, 32100, 33000, 34200]
                },
                {
                    name: 'SV tốt nghiệp',
                    data: [8200, 8800, 9100, 9400, 9800, 10500]
                }
            ],
            chart: {
                height: 400,
                type: 'area'
            },
            colors: ['#4CAF50', '#2196F3', '#FF9800'],
            xaxis: {
                categories: ['2020', '2021', '2022', '2023', '2024', '2025 (dự kiến)']
            }
        };

        try {
            const chart = new ApexCharts(container, options);
            chart.render();
            console.log('Student Flow Chart created successfully');
        } catch (error) {
            console.error('Error creating Student Flow Chart:', error);
            this.createSimpleStudentFlowChart();
        }
    };

    // Tuition Chart
    this.initTuitionChart = function() {
        const container = document.getElementById('tuitionChart');
        if (!container) return;

        const options = {
            series: [
                {
                    name: 'Đã thu (tỷ)',
                    type: 'column',
                    data: [45, 75, 95, 112, 125]
                },
                {
                    name: 'Mục tiêu (tỷ)',
                    type: 'column',
                    data: [50, 80, 100, 115, 132]
                },
                {
                    name: 'Tỷ lệ thu (%)',
                    type: 'line',
                    data: [90, 94, 95, 97, 95]
                }
            ],
            chart: {
                height: 400,
                type: 'line'
            },
            colors: ['#2196F3', '#4CAF50', '#F44336'],
            stroke: {
                width: [0, 0, 4]
            },
            labels: ['Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
            yaxis: [
                {
                    title: { text: 'Số tiền (tỷ VNĐ)' }
                },
                {
                    opposite: true,
                    title: { text: 'Tỷ lệ thu (%)' },
                    min: 80,
                    max: 100
                }
            ]
        };

        try {
            const chart = new ApexCharts(container, options);
            chart.render();
            console.log('Tuition Chart created successfully');
        } catch (error) {
            console.error('Error creating Tuition Chart:', error);
            this.createSimpleTuitionChart();
        }
    };

    // Tạo biểu đồ đơn giản bằng HTML/CSS (fallback)
    this.createSimpleCharts = function() {
        console.log('Creating simple HTML charts...');
        this.createSimpleGPAChart();
        this.createSimpleStudentFlowChart();
        this.createSimpleTuitionChart();
    };

    // Simple GPA Chart - Cải thiện với CSS đẹp hơn
    this.createSimpleGPAChart = function() {
        const container = document.getElementById('gpaChart');
        if (!container) return;
        
        container.innerHTML = `
            <div style="padding: 20px;">
                <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 15px; margin-bottom: 20px;">
                    ${this.facultyData.map((faculty, index) => {
                        const gpaColor = faculty.gpa >= 3.0 ? '#4CAF50' : faculty.gpa >= 2.5 ? '#FF9800' : '#F44336';
                        const passColor = faculty.passRate >= 90 ? '#4CAF50' : faculty.passRate >= 80 ? '#FF9800' : '#F44336';
                        const gpaHeight = (faculty.gpa / 4) * 100;
                        const passHeight = faculty.passRate;
                        
                        return `
                            <div style="text-align: center; padding: 20px; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-left: 4px solid ${gpaColor}; transition: transform 0.3s ease;" 
                                 onmouseover="this.style.transform='translateY(-5px)'" 
                                 onmouseout="this.style.transform='translateY(0)'">
                                
                                <div style="font-size: 13px; color: #666; margin-bottom: 15px; font-weight: 600;">${faculty.name}</div>
                                
                                <!-- GPA Bar -->
                                <div style="margin-bottom: 15px;">
                                    <div style="font-size: 24px; font-weight: bold; color: ${gpaColor}; margin-bottom: 8px;">${faculty.gpa}</div>
                                    <div style="width: 100%; height: 8px; background: #e0e0e0; border-radius: 4px; overflow: hidden;">
                                        <div style="width: ${gpaHeight}%; height: 100%; background: linear-gradient(90deg, ${gpaColor}, ${gpaColor}dd); transition: width 1s ease;"></div>
                                    </div>
                                    <div style="font-size: 11px; color: #666; margin-top: 5px;">GPA TB</div>
                                </div>
                                
                                <!-- Pass Rate -->
                                <div style="padding: 12px; background: #f8f9fa; border-radius: 8px;">
                                    <div style="font-size: 20px; font-weight: bold; color: ${passColor}; margin-bottom: 8px;">${faculty.passRate}%</div>
                                    <div style="width: 100%; height: 6px; background: #e0e0e0; border-radius: 3px; overflow: hidden;">
                                        <div style="width: ${passHeight}%; height: 100%; background: linear-gradient(90deg, ${passColor}, ${passColor}dd); transition: width 1.2s ease;"></div>
                                    </div>
                                    <div style="font-size: 10px; color: #666; margin-top: 5px;">Tỷ lệ đỗ</div>
                                </div>
                                
                                <!-- Students count -->
                                <div style="margin-top: 12px; font-size: 11px; color: #999;">
                                    ${faculty.students.toLocaleString()} sinh viên
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <!-- Legend -->
                <div style="display: flex; justify-content: center; gap: 20px; margin-top: 20px; font-size: 12px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 16px; height: 16px; background: #4CAF50; border-radius: 3px;"></div>
                        <span>Tốt (GPA ≥3.0, Đỗ ≥90%)</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 16px; height: 16px; background: #FF9800; border-radius: 3px;"></div>
                        <span>Trung bình (GPA ≥2.5, Đỗ ≥80%)</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 16px; height: 16px; background: #F44336; border-radius: 3px;"></div>
                        <span>Cần cải thiện</span>
                    </div>
                </div>
            </div>
        `;
    };

    // Simple Student Flow Chart - Cải thiện với timeline đẹp
    this.createSimpleStudentFlowChart = function() {
        const container = document.getElementById('studentFlowChart');
        if (!container) return;
        
        const years = ['2020', '2021', '2022', '2023', '2024', '2025'];
        const newStudents = [9800, 10500, 11200, 11800, 12800, 13500];
        const currentStudents = [28500, 29800, 31200, 32100, 33000, 34200];
        const graduates = [8200, 8800, 9100, 9400, 9800, 10500];
        
        // Tính max để scale
        const maxValue = Math.max(...currentStudents);
        
        container.innerHTML = `
            <div style="padding: 20px;">
                <!-- Timeline Header -->
                <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; margin-bottom: 30px;">
                    ${years.map((year, index) => {
                        const isProjected = year.includes('2025');
                        const newHeight = (newStudents[index] / maxValue) * 100;
                        const currentHeight = (currentStudents[index] / maxValue) * 150;
                        const gradHeight = (graduates[index] / maxValue) * 80;
                        
                        return `
                            <div style="text-align: center; position: relative;">
                                <!-- Year Label -->
                                <div style="font-size: 14px; font-weight: bold; color: #223771; margin-bottom: 20px; ${isProjected ? 'opacity: 0.7;' : ''}">${year}</div>
                                
                                <!-- Chart Bars Container -->
                                <div style="height: 300px; display: flex; align-items: end; justify-content: center; gap: 4px; margin-bottom: 15px;">
                                    
                                    <!-- SV nhập mới -->
                                    <div style="width: 20px; height: ${newHeight}px; background: linear-gradient(180deg, #4CAF50, #2E7D32); border-radius: 3px 3px 0 0; position: relative; transition: all 0.8s ease; ${isProjected ? 'opacity: 0.7; border: 2px dashed #4CAF50;' : ''}"
                                         title="SV nhập mới: ${newStudents[index].toLocaleString()}">
                                        <div style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%); font-size: 10px; font-weight: bold; color: #2E7D32; white-space: nowrap;">
                                            ${(newStudents[index]/1000).toFixed(1)}k
                                        </div>
                                    </div>
                                    
                                    <!-- SV đang học -->
                                    <div style="width: 25px; height: ${currentHeight}px; background: linear-gradient(180deg, #2196F3, #1976D2); border-radius: 3px 3px 0 0; position: relative; transition: all 1s ease; ${isProjected ? 'opacity: 0.7; border: 2px dashed #2196F3;' : ''}"
                                         title="SV đang học: ${currentStudents[index].toLocaleString()}">
                                        <div style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%); font-size: 10px; font-weight: bold; color: #1976D2; white-space: nowrap;">
                                            ${(currentStudents[index]/1000).toFixed(1)}k
                                        </div>
                                    </div>
                                    
                                    <!-- SV tốt nghiệp -->
                                    <div style="width: 20px; height: ${gradHeight}px; background: linear-gradient(180deg, #FF9800, #F57C00); border-radius: 3px 3px 0 0; position: relative; transition: all 1.2s ease; ${isProjected ? 'opacity: 0.7; border: 2px dashed #FF9800;' : ''}"
                                         title="SV tốt nghiệp: ${graduates[index].toLocaleString()}">
                                        <div style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%); font-size: 10px; font-weight: bold; color: #F57C00; white-space: nowrap;">
                                            ${(graduates[index]/1000).toFixed(1)}k
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Growth Indicator -->
                                ${index > 0 ? `
                                    <div style="font-size: 10px; color: ${currentStudents[index] > currentStudents[index-1] ? '#4CAF50' : '#F44336'};">
                                        ${currentStudents[index] > currentStudents[index-1] ? '↗' : '↘'} 
                                        ${(((currentStudents[index] - currentStudents[index-1]) / currentStudents[index-1]) * 100).toFixed(1)}%
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <!-- Legend -->
                <div style="display: flex; justify-content: center; gap: 30px; margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 20px; height: 16px; background: linear-gradient(180deg, #4CAF50, #2E7D32); border-radius: 3px;"></div>
                        <span style="font-size: 12px; font-weight: 500;">SV nhập mới</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 25px; height: 16px; background: linear-gradient(180deg, #2196F3, #1976D2); border-radius: 3px;"></div>
                        <span style="font-size: 12px; font-weight: 500;">SV đang học</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 20px; height: 16px; background: linear-gradient(180deg, #FF9800, #F57C00); border-radius: 3px;"></div>
                        <span style="font-size: 12px; font-weight: 500;">SV tốt nghiệp</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 16px; height: 16px; border: 2px dashed #999; border-radius: 3px;"></div>
                        <span style="font-size: 12px; font-weight: 500; color: #666;">Dự kiến</span>
                    </div>
                </div>
            </div>
        `;
    };

    // Simple Tuition Chart - Biểu đồ kết hợp rộng rãi và rõ ràng
    this.createSimpleTuitionChart = function() {
        const months = ['Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
        const collected = [45, 75, 95, 112, 125];
        const target = [50, 80, 100, 115, 132];
        const rates = [90, 94, 95, 97, 95];
        
        const maxValue = Math.max(...collected, ...target);
        const chartHeight = 280;
        const chartWidth = 500;
        const margin = { top: 30, right: 50, bottom: 40, left: 50 };
        const plotWidth = chartWidth - margin.left - margin.right;
        const plotHeight = chartHeight - margin.top - margin.bottom;
        
        return `
            <div style="padding: 15px; background: white; border-radius: 8px; max-width: 100%; overflow-x: auto;">
                <!-- Header Info -->
                <div style="margin-bottom: 15px; padding: 12px; background: #f8f9fa; border-radius: 6px; border-left: 3px solid #2196F3;">
                    <div style="font-size: 15px; color: #666; margin-bottom: 10px;">
                        <i class="fa-solid fa-info-circle" style="color: #2196F3; margin-right: 8px;"></i>
                        Biểu đồ kết hợp cột và đường theo tháng. Trục trái: số tiền (tỷ VNĐ), Trục phải: tỷ lệ thu (%).
                    </div>
                    <div style="font-size: 14px; color: #2196F3; font-weight: 600;">
                        <i class="fa-solid fa-calculator" style="margin-right: 8px;"></i>
                        <strong>Công thức:</strong> Tỷ lệ thu (%) = Tổng học phí đã thu / Tổng học phí phải thu × 100
                    </div>
                </div>

                <!-- Combined Chart - Tận dụng toàn bộ không gian -->
                <div style="position: relative; width: 100%; height: ${chartHeight}px; background: #f8f9fa; border-radius: 6px; margin-bottom: 15px; overflow: visible;">
                    <svg width="100%" height="100%" viewBox="0 0 ${chartWidth} ${chartHeight}" style="max-width: 100%; height: auto;">
                        <!-- Background -->
                        <rect x="0" y="0" width="100%" height="100%" fill="white" rx="8" opacity="0.9"/>
                        
                        <!-- Grid Lines - Nhiều hơn để dễ đọc -->
                        ${[0, 1, 2, 3, 4, 5, 6].map(i => {
                            const y = margin.top + (plotHeight * i / 6);
                            return `<line x1="${margin.left}" y1="${y}" x2="${margin.left + plotWidth}" y2="${y}" stroke="#e0e0e0" stroke-width="1" stroke-dasharray="3,3" opacity="0.7"/>`;
                        }).join('')}
                        
                        <!-- Vertical Grid Lines -->
                        ${months.map((month, index) => {
                            const x = margin.left + (index * plotWidth / (months.length - 1));
                            return `<line x1="${x}" y1="${margin.top}" x2="${x}" y2="${margin.top + plotHeight}" stroke="#f0f0f0" stroke-width="1" opacity="0.5"/>`;
                        }).join('')}
                        
                        <!-- Y Axis Left (Money) -->
                        <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + plotHeight}" stroke="#333" stroke-width="2"/>
                        ${[0, 1, 2, 3, 4, 5, 6].map(i => {
                            const value = Math.round((maxValue * i / 6) / 10) * 10;
                            const y = margin.top + plotHeight - (plotHeight * i / 6);
                            return `
                                <text x="${margin.left - 15}" y="${y + 5}" text-anchor="end" font-size="13" font-weight="500" fill="#666">${value}</text>
                                <line x1="${margin.left - 5}" y1="${y}" x2="${margin.left}" y2="${y}" stroke="#333" stroke-width="2"/>
                            `;
                        }).join('')}
                        <text x="25" y="${margin.top - 20}" font-size="14" font-weight="bold" fill="#333">Số tiền (tỷ VNĐ)</text>
                        
                        <!-- Y Axis Right (Percentage) -->
                        <line x1="${margin.left + plotWidth}" y1="${margin.top}" x2="${margin.left + plotWidth}" y2="${margin.top + plotHeight}" stroke="#333" stroke-width="2"/>
                        ${[86, 88, 90, 92, 94, 96, 98].map((value, i) => {
                            const y = margin.top + plotHeight - (plotHeight * i / 6);
                            return `
                                <text x="${margin.left + plotWidth + 15}" y="${y + 5}" text-anchor="start" font-size="13" font-weight="500" fill="#666">${value}%</text>
                                <line x1="${margin.left + plotWidth}" y1="${y}" x2="${margin.left + plotWidth + 5}" y2="${y}" stroke="#333" stroke-width="2"/>
                            `;
                        }).join('')}
                        <text x="${chartWidth - 25}" y="${margin.top - 20}" font-size="14" font-weight="bold" fill="#333" text-anchor="end">Tỷ lệ thu (%)</text>
                        
                        <!-- X Axis -->
                        <line x1="${margin.left}" y1="${margin.top + plotHeight}" x2="${margin.left + plotWidth}" y2="${margin.top + plotHeight}" stroke="#333" stroke-width="2"/>
                        
                        <!-- Bars and Data - Rộng rãi hơn -->
                        ${months.map((month, index) => {
                            const x = margin.left + (index * plotWidth / (months.length - 1));
                            const barWidth = 25;
                            const barSpacing = 5;
                            
                            // Collected bar
                            const collectedHeight = (collected[index] / maxValue) * plotHeight;
                            const collectedY = margin.top + plotHeight - collectedHeight;
                            
                            // Target bar  
                            const targetHeight = (target[index] / maxValue) * plotHeight;
                            const targetY = margin.top + plotHeight - targetHeight;
                            
                            // Rate line point
                            const rateY = margin.top + plotHeight - ((rates[index] - 86) / (98 - 86)) * plotHeight;
                            
                            return `
                                <!-- Collected Bar với shadow -->
                                <rect x="${x - barWidth - barSpacing}" y="${collectedY}" width="${barWidth}" height="${collectedHeight}" 
                                      fill="url(#blueGradient)" stroke="rgba(33, 150, 243, 1)" stroke-width="2" rx="4"/>
                                <rect x="${x - barWidth - barSpacing + 2}" y="${collectedY + 2}" width="${barWidth - 4}" height="${Math.max(collectedHeight - 4, 0)}" 
                                      fill="rgba(255,255,255,0.3)" rx="2"/>
                                <text x="${x - barWidth/2 - barSpacing}" y="${collectedY - 5}" text-anchor="middle" font-size="10" font-weight="bold" fill="#1976D2">${collected[index]}</text>
                                
                                <!-- Target Bar với shadow -->
                                <rect x="${x + barSpacing}" y="${targetY}" width="${barWidth}" height="${targetHeight}" 
                                      fill="url(#greenGradient)" stroke="rgba(76, 175, 80, 1)" stroke-width="2" rx="4"/>
                                <rect x="${x + barSpacing + 2}" y="${targetY + 2}" width="${barWidth - 4}" height="${Math.max(targetHeight - 4, 0)}" 
                                      fill="rgba(255,255,255,0.3)" rx="2"/>
                                <text x="${x + barWidth/2 + barSpacing}" y="${targetY - 5}" text-anchor="middle" font-size="10" font-weight="bold" fill="#2E7D32">${target[index]}</text>
                                
                                <!-- Rate Point với glow effect -->
                                <circle cx="${x}" cy="${rateY}" r="5" fill="#F44336" stroke="white" stroke-width="2"/>
                                <text x="${x}" y="${rateY - 10}" text-anchor="middle" font-size="10" font-weight="bold" fill="#D32F2F">${rates[index]}%</text>
                                
                                <!-- Month Label -->
                                <text x="${x}" y="${margin.top + plotHeight + 18}" text-anchor="middle" font-size="11" font-weight="600" fill="#333">${month}</text>
                            `;
                        }).join('')}
                        
                        <!-- Rate Line với smooth curve -->
                        <path d="M ${months.map((month, index) => {
                            const x = margin.left + (index * plotWidth / (months.length - 1));
                            const rateY = margin.top + plotHeight - ((rates[index] - 86) / (98 - 86)) * plotHeight;
                            return `${index === 0 ? 'M' : 'L'} ${x} ${rateY}`;
                        }).join(' ')}" 
                        fill="none" stroke="#F44336" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        
                        <!-- Gradients và Effects -->
                        <defs>
                            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style="stop-color:#42A5F5;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#1976D2;stop-opacity:1" />
                            </linearGradient>
                            <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style="stop-color:#66BB6A;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#2E7D32;stop-opacity:1" />
                            </linearGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                <feMerge> 
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                                <feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
                            </filter>
                        </defs>
                    </svg>
                </div>
                
                <!-- Legend - Rộng rãi hơn -->
                <div style="display: flex; justify-content: center; gap: 40px; margin-bottom: 25px; padding: 20px; background: #f8f9fa; border-radius: 12px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 25px; height: 18px; background: linear-gradient(135deg, #42A5F5, #1976D2); border: 2px solid rgba(33, 150, 243, 1); border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>
                        <span style="font-size: 14px; font-weight: 600; color: #333;">Đã thu (tỷ VNĐ)</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 25px; height: 18px; background: linear-gradient(135deg, #66BB6A, #2E7D32); border: 2px solid rgba(76, 175, 80, 1); border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>
                        <span style="font-size: 14px; font-weight: 600; color: #333;">Mục tiêu (tỷ VNĐ)</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 25px; height: 6px; background: #F44336; border-radius: 3px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>
                        <span style="font-size: 14px; font-weight: 600; color: #333;">Tỷ lệ thu (%)</span>
                    </div>
                </div>

                <!-- Summary Stats - Layout rộng rãi -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                    <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #E3F2FD, #BBDEFB); border-radius: 12px; border-left: 5px solid #2196F3; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                        <div style="font-size: 24px; font-weight: bold; color: #1976D2; margin-bottom: 8px;">
                            ${collected.reduce((a, b) => a + b, 0)} tỷ
                        </div>
                        <div style="font-size: 13px; color: #666; font-weight: 600;">Tổng đã thu</div>
                        <div style="font-size: 11px; color: #999; margin-top: 4px;">5 tháng gần nhất</div>
                    </div>
                    <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #E8F5E8, #C8E6C8); border-radius: 12px; border-left: 5px solid #4CAF50; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                        <div style="font-size: 24px; font-weight: bold; color: #2E7D32; margin-bottom: 8px;">
                            ${target.reduce((a, b) => a + b, 0)} tỷ
                        </div>
                        <div style="font-size: 13px; color: #666; font-weight: 600;">Tổng mục tiêu</div>
                        <div style="font-size: 11px; color: #999; margin-top: 4px;">Kế hoạch đề ra</div>
                    </div>
                    <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #FFEBEE, #FFCDD2); border-radius: 12px; border-left: 5px solid #F44336; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                        <div style="font-size: 24px; font-weight: bold; color: #D32F2F; margin-bottom: 8px;">
                            ${Math.round((collected.reduce((a, b) => a + b, 0) / target.reduce((a, b) => a + b, 0)) * 100)}%
                        </div>
                        <div style="font-size: 13px; color: #666; font-weight: 600;">Tỷ lệ trung bình</div>
                        <div style="font-size: 11px; color: #999; margin-top: 4px;">Hiệu suất chung</div>
                    </div>
                </div>
            </div>
        `;
    };

    // Bind Events
    this.bindEvents = function() {
        const yearFilter = document.getElementById('yearFilter');
        const levelFilter = document.getElementById('levelFilter');

        if (yearFilter) {
            yearFilter.addEventListener('change', () => {
                console.log('Year filter changed:', yearFilter.value);
                this.updateLastUpdateTime();
            });
        }

        if (levelFilter) {
            levelFilter.addEventListener('change', () => {
                console.log('Level filter changed:', levelFilter.value);
                this.updateLastUpdateTime();
            });
        }

        // Update timestamp every minute
        setInterval(() => {
            this.updateLastUpdateTime();
        }, 60000);
    };

    // Update last update time
    this.updateLastUpdateTime = function() {
        const timeElement = document.getElementById('lastUpdateTime');
        if (timeElement) {
            timeElement.textContent = new Date().toLocaleString('vi-VN');
        }
    };
}

// Export for global use
window.DashboardBGH = DashboardBGH;