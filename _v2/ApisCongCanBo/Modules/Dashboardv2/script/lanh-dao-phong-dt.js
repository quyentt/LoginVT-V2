/* =========================================================================
   Dashboard Lãnh đạo Phòng Đào tạo — TRANG MẪU (cổng cán bộ). Khung chung ums.dbv2 (_dbv2.js).
   Bản gốc: ApisCongCanBo/Modules/Dashboardv2/html/lanh-dao-phong-dt.html + script/lanh-dao-phong-dt.js.
   Số liệu MẪU viết cứng trong .js gốc (kpiData, classManagementData, riskData, examProgressData, tuitionData,
   renderQuickStats) — gốc KHÔNG có lời gọi API ("TODO: Gọi API với filters"). Chép NGUYÊN các con số đó.
   Giữ như gốc: bộ lọc KHÔNG làm đổi số liệu (gốc bấm Áp dụng chỉ vẽ lại đúng các số cũ); thứ tự thẻ theo html gốc
   (cột biểu đồ: mở/hủy lớp → rủi ro theo khoa → chấm thi/nhập điểm → học phí; cột phải: Thống kê nhanh).
   Thay đổi so với gốc:
     · Khoa → Ngành: chưa chọn Khoa thì KHOÁ ô Ngành (luật cha → con của bản mới); gốc lúc mở màn liệt kê sẵn ngành
       của Khoa CNTT dù Khoa = "Toàn trường", chọn lại "Toàn trường" thì ô Ngành chỉ còn "Tất cả ngành".
     · Danh sách rủi ro theo khoa (gốc: thẻ tự vẽ) → bảng; cột xu hướng gốc in "++12" (ghép '+' trước chuỗi đã có
       dấu) → in đúng "+12".
     · KPI gốc có trend 'down' với isWarning (cảnh báo học vụ giảm là TỐT) → trendClass good.
     · Chú giải màu dưới tiêu đề thẻ (Tốt / Cảnh báo / Cao…) gộp vào dòng mô tả thẻ.
     · Thẻ "mở, hủy" và bảng rủi ro chiếm cả hàng (gốc: cột biểu đồ rộng) — bảng 8 cột không vừa nửa hàng.
   Bỏ: khung "Đang tải…" giả (setTimeout), trạng thái hệ thống, fallback CDN Chart.js (bản mới dùng Chart.js có sẵn).
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('dbv2-lanh-dao-phong-dt');
    if (!root) return;
    var D = ums.dbv2, esc = ums.ui.esc;

    /* ---------- Số liệu mẫu (chép nguyên từ gốc) ---------- */
    var KPI = [
        { iconClass: 'fa-solid fa-users', label: 'Tổng số sinh viên đang học', value: '33,000', change: '+1,250 SV (+3.9%)', trendDirection: 'up', trendClass: 'good',
            color: 'green', subtext: 'so với cùng kỳ năm trước', tooltip: 'Dữ liệu cập nhật đến ngày 03/04/2026', timing: 'Realtime/Daily' },
        { iconClass: 'fa-solid fa-graduation-cap', label: 'Tỷ lệ tốt nghiệp đúng hạn', value: '68.5%', change: '+5.1%', trendDirection: 'up', trendClass: 'good',
            color: 'purple', subtext: 'so với cùng kỳ năm trước', tooltip: 'Chỉ số chất lượng đào tạo - Cập nhật theo năm học', timing: 'Theo năm' },
        { iconClass: 'fa-solid fa-triangle-exclamation', label: 'Tỷ lệ SV bị cảnh báo học vụ', value: '2.1%', change: '-0.9%', trendDirection: 'down', trendClass: 'good',
            color: 'orange', subtext: '693/33,000 SV bị cảnh báo', tooltip: 'Dữ liệu cập nhật theo học kỳ - HK1 2024-2025', timing: 'Theo học kỳ' },
        { iconClass: 'fa-solid fa-chart-line', label: 'Tỷ lệ SV học đúng tiến độ', value: '85.3%', change: '+2.8%', trendDirection: 'up', trendClass: 'good',
            color: 'blue', subtext: '28,149/33,000 SV đúng tiến độ', tooltip: 'Tiến độ đào tạo của sinh viên - Cập nhật theo học kỳ', timing: 'Theo học kỳ' }];

    function moHuyLop() {
        return { labels: ['HK1 22-23', 'HK2 22-23', 'HK1 23-24', 'HK2 23-24', 'HK1 24-25', 'HK2 24-25'], datasets: [
            { label: 'Số lớp mở', type: 'bar', data: [950, 1030, 1100, 1150, 1200, 1250], backgroundColor: 'rgba(59, 130, 246, 0.8)', borderColor: 'rgba(59, 130, 246, 1)', borderWidth: 2, yAxisID: 'y-axis-1', order: 2 },
            { label: 'Số lớp bị hủy', type: 'bar', data: [45, 55, 75, 70, 85, 80], backgroundColor: 'rgba(245, 158, 11, 0.8)', borderColor: 'rgba(245, 158, 11, 1)', borderWidth: 2, yAxisID: 'y-axis-1', order: 2 },
            { label: 'Tỷ lệ hủy (%)', type: 'line', data: [4.7, 5.3, 6.8, 6.1, 7.1, 6.4], borderColor: 'rgba(239, 68, 68, 1)', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderWidth: 3,
                tension: 0.4, yAxisID: 'y-axis-2', fill: false, pointRadius: 6, pointBackgroundColor: 'rgba(239, 68, 68, 1)', pointBorderColor: '#fff', pointBorderWidth: 2, order: 1 }] };
    }
    var RUI_RO = [
        { name: 'Khoa Công nghệ thông tin', riskScore: 85.2, level: 'Cao', color: 'high', mainCause: 'GPA TB ↓, Trượt ↑', trend: 'up-high', trendValue: '+12', trendText: '↑↑', icon: 'fa-computer',
            details: { gpa: 2.3, failRate: 25, lateGrade: 8, warning: 18, dropout: 6 } },
        { name: 'Khoa Kỹ thuật', riskScore: 76.8, level: 'Trung bình', color: 'medium', mainCause: 'SV thôi học cao', trend: 'up', trendValue: '+8', trendText: '↑', icon: 'fa-gears',
            details: { gpa: 2.6, failRate: 15, lateGrade: 5, warning: 12, dropout: 8 } },
        { name: 'Khoa Kinh tế', riskScore: 68.4, level: 'Trung bình', color: 'medium', mainCause: 'Nhập điểm trễ', trend: 'down', trendValue: '-3', trendText: '↓', icon: 'fa-chart-line',
            details: { gpa: 2.8, failRate: 12, lateGrade: 18, warning: 10, dropout: 4 } },
        { name: 'Khoa Ngoại ngữ', riskScore: 58.7, level: 'Trung bình', color: 'medium', mainCause: 'Vi phạm tiến độ đào tạo', trend: 'stable', trendValue: '+2', trendText: '→', icon: 'fa-language',
            details: { gpa: 2.9, failRate: 10, lateGrade: 6, warning: 8, dropout: 3 } },
        { name: 'Khoa Y tế', riskScore: 45.3, level: 'Thấp', color: 'low', mainCause: 'Ổn định chung', trend: 'down', trendValue: '-5', trendText: '↓', icon: 'fa-heart-pulse',
            details: { gpa: 3.1, failRate: 8, lateGrade: 3, warning: 6, dropout: 2 } }];
    function hocPhi() {
        return { labels: ['Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'], datasets: [
            { label: 'Đã thu (tỷ)', type: 'bar', data: [1, 0.8, 1.2, 1.1, 1], backgroundColor: 'rgba(59, 130, 246, 0.8)', borderColor: 'rgba(59, 130, 246, 1)', borderWidth: 2, yAxisID: 'y-axis-1', order: 3 },
            { label: 'Mục tiêu (tỷ)', type: 'line', data: [0.9, 1, 1, 1, 1], borderColor: 'rgba(16, 185, 129, 1)', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderWidth: 3, tension: 0.4,
                yAxisID: 'y-axis-1', fill: false, pointRadius: 5, pointBackgroundColor: 'rgba(16, 185, 129, 1)', pointBorderColor: '#fff', pointBorderWidth: 2, borderDash: [5, 5], order: 1 },
            { label: 'Tỷ lệ thu %', type: 'line', data: [111, 80, 120, 110, 100], borderColor: 'rgba(239, 68, 68, 1)', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderWidth: 3, tension: 0.4,
                yAxisID: 'y-axis-2', fill: false, pointRadius: 5, pointBackgroundColor: 'rgba(239, 68, 68, 1)', pointBorderColor: '#fff', pointBorderWidth: 2, order: 2 }] };
    }
    function chamThi() {
        return { labels: ['Ngày 1', 'Ngày 2', 'Ngày 3', 'Ngày 5', 'Ngày 7', 'Ngày 10', 'Ngày 11', 'Ngày 13'], datasets: [
            { label: 'Đã chấm xong', data: [10, 35, 55, 70, 82, 91, 95, 97], borderColor: 'rgba(59, 130, 246, 1)', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderWidth: 3, tension: 0.4,
                fill: true, pointRadius: 6, pointBackgroundColor: 'rgba(59, 130, 246, 1)', pointBorderColor: '#fff', pointBorderWidth: 2 },
            { label: 'Đã nhập điểm xong', data: [5, 20, 40, 60, 75, 85, 90, 95], borderColor: 'rgba(249, 115, 22, 1)', backgroundColor: 'rgba(249, 115, 22, 0.1)', borderWidth: 3, tension: 0.4,
                fill: true, pointRadius: 6, pointBackgroundColor: 'rgba(249, 115, 22, 1)', pointBorderColor: '#fff', pointBorderWidth: 2, borderDash: [5, 5] }] };
    }
    var NHANH = [['Tổng học phần', '820'], ['CT chuẩn quốc tế', '15'], ['CT liên kết', '8'], ['Đánh giá ABET', '5 CT']];

    /* Ngành theo khoa (gốc: updateMajorOptions) */
    var NGANH = {
        cntt: [['cntt', 'Công nghệ thông tin'], ['ktpm', 'Kỹ thuật phần mềm'], ['attt', 'An toàn thông tin'], ['ai', 'Trí tuệ nhân tạo'], ['khmt', 'Khoa học máy tính']],
        ktoan: [['qtkd', 'Quản trị kinh doanh'], ['ktoan', 'Kế toán'], ['tcdn', 'Tài chính doanh nghiệp'], ['marketing', 'Marketing']],
        ngoaingu: [['anh', 'Ngôn ngữ Anh'], ['nhat', 'Ngôn ngữ Nhật'], ['han', 'Ngôn ngữ Hàn'], ['phap', 'Ngôn ngữ Pháp']],
        kythuat: [['co', 'Kỹ thuật cơ khí'], ['dien', 'Kỹ thuật điện'], ['xd', 'Kỹ thuật xây dựng'], ['oto', 'Kỹ thuật ô tô']],
        yte: [['dieuduong', 'Điều dưỡng'], ['duoc', 'Dược học'], ['yhct', 'Y học cổ truyền'], ['xn', 'Xét nghiệm y học']] };

    var TIP = { mode: 'index', intersect: false, backgroundColor: 'rgba(255, 255, 255, 0.95)', titleFontColor: '#1f2937', bodyFontColor: '#4b5563', borderColor: '#e5e7eb', borderWidth: 2, cornerRadius: 8 };
    var LEGEND = { display: true, position: 'bottom', labels: { fontSize: 12, padding: 15, usePointStyle: true } };
    function tim(items, i) { for (var k = 0; k < items.length; k++) if (items[k].datasetIndex === i) return items[k]; return null; }
    var MUC = { high: { tone: 'bad', mau: '#ef4444' }, medium: { tone: 'warn', mau: '#f59e0b' }, low: { tone: 'good', mau: '#10b981' } };

    D.man(root, {
        tieuDe: 'Dashboard Lãnh đạo Phòng Đào tạo', moTa: '📊 Quản lý chương trình đào tạo và chất lượng giáo dục - Dữ liệu cập nhật theo thời gian thực',
        icon: 'fa-solid fa-chart-pie', nguon: 'Hệ thống quản lý đào tạo',
        loc: [
            { key: 'year', label: 'Năm học', items: [{ value: '', text: 'Chọn năm học...' }, { value: '2024-2025', text: '2024-2025' }, { value: '2023-2024', text: '2023-2024' },
                { value: '2022-2023', text: '2022-2023' }, { value: '2021-2022', text: '2021-2022' }] },
            { key: 'semester', label: 'Học kỳ / Đợt', items: [{ value: '', text: 'Tất cả học kỳ' }, { value: 'hk1', text: 'Học kỳ 1' }, { value: 'hk2', text: 'Học kỳ 2' },
                { value: 'hk3', text: 'Học kỳ 3 (Hè)' }, { value: 'dot1', text: 'Đợt thi 1' }, { value: 'dot2', text: 'Đợt thi 2' }] },
            { key: 'level', label: 'Bậc đào tạo', items: [{ value: '', text: 'Tất cả bậc' }, { value: 'daihoc', text: 'Đại học' }, { value: 'thacsi', text: 'Thạc sĩ' },
                { value: 'tiensi', text: 'Tiến sĩ' }, { value: 'lienthong', text: 'Liên thông' }, { value: 'caodang', text: 'Cao đẳng' }] },
            { key: 'faculty', label: 'Khoa', items: [{ value: '', text: 'Toàn trường' }, { value: 'cntt', text: 'Khoa CNTT' }, { value: 'ktoan', text: 'Khoa Kinh tế' },
                { value: 'ngoaingu', text: 'Khoa Ngoại ngữ' }, { value: 'kythuat', text: 'Khoa Kỹ thuật' }, { value: 'yte', text: 'Khoa Y tế' }] },
            { key: 'major', label: 'Ngành đào tạo', items: [{ value: '', text: 'Tất cả ngành' }] }],
        macDinh: { year: '2024-2025', semester: '', level: '', faculty: '', major: '' },
        tinh: function () {
            // Gốc: bộ lọc chỉ ghi console, số liệu không đổi
            return { kpis: KPI, moHuy: moHuyLop(), ruiRo: RUI_RO, chamThi: chamThi(), hocPhi: hocPhi(), nhanh: NHANH };
        },
        the: [
            { key: 'mohuy', rong: 2, tieuDe: 'Tỷ lệ lớp học phần mở, hủy', icon: 'fa-chalkboard-user', cao: 360,
                moTa: 'Xu hướng mở lớp học phần và lớp bị hủy theo học kỳ (3 năm gần nhất) · Tốt: Tỷ lệ hủy < 5% · Cảnh báo: 5% ≤ Tỷ lệ hủy < 10% · Cao: Tỷ lệ hủy ≥ 10%',
                ve: function (host, kq, api) {
                    api.bieuDo(host, 'bar', kq.moHuy, {
                        legend: LEGEND,
                        tooltips: Object.assign({}, TIP, { callbacks: {
                            label: function (it, data) {
                                var l = data.datasets[it.datasetIndex].label || '';
                                if (l) l += ': ';
                                return l + (it.datasetIndex === 2 ? D.so(it.yLabel).toFixed(1) + '%' : D.so(it.yLabel).toLocaleString('en-US') + ' lớp');
                            },
                            afterBody: function (items) {
                                var t = tim(items, 2), a = t && t.yLabel < 5 ? '✅ Kế hoạch mở lớp phù hợp' : t && t.yLabel < 10 ? '⚠️ Cần xem xét điều chỉnh' : '❌ Cần điều chỉnh kế hoạch mở lớp';
                                return ['', '📊 Đánh giá ' + items[0].label + ':', a];
                            } } }),
                        scales: {
                            xAxes: [{ gridLines: { display: false }, scaleLabel: { display: true, labelString: 'Học kỳ' } }],
                            yAxes: [
                                { id: 'y-axis-1', type: 'linear', position: 'left', ticks: { beginAtZero: true, callback: function (v) { return v.toLocaleString('en-US') + ' lớp'; } },
                                    scaleLabel: { display: true, labelString: 'Số lượng lớp học phần' }, gridLines: { color: 'rgba(0, 0, 0, 0.05)' } },
                                { id: 'y-axis-2', type: 'linear', position: 'right', ticks: { beginAtZero: true, max: 10, stepSize: 2, callback: function (v) { return v + '%'; } },
                                    scaleLabel: { display: true, labelString: 'Tỷ lệ hủy (%)' }, gridLines: { drawOnChartArea: false } }] }
                    });
                } },
            { key: 'ruiro', rong: 2, bang: true, tieuDe: 'Danh sách rủi ro theo khoa', icon: 'fa-triangle-exclamation',
                moTa: 'Phát hiện khoa có rủi ro cao để tập trung chỉ đạo - Cập nhật theo học kỳ',
                ve: function (host, kq, api) {
                    api.bang(host, [
                        { title: 'Khoa', render: function (r) { return '<i class="fa-solid ' + esc(r.icon) + '"></i> <b>' + esc(r.name) + '</b>'; } },
                        { title: 'Risk Score', cls: 'is-center', render: function (r) { return api.badge(String(r.riskScore), MUC[r.color].tone); } },
                        { title: 'Xu hướng', cls: 'is-center', render: function (r) {
                            var tone = r.trend === 'up-high' || r.trend === 'up' ? 'bad' : r.trend === 'down' ? 'good' : 'mute';
                            return api.badge(r.trendText + ' ' + r.trendValue, tone); } },
                        { title: 'Nguyên nhân chính', render: function (r) { return esc(r.mainCause); } },
                        { title: 'GPA', cls: 'is-center', render: function (r) { return esc(String(r.details.gpa)); } },
                        { title: 'Trượt', cls: 'is-center', render: function (r) { return r.details.failRate + '%'; } },
                        { title: 'Thôi học', cls: 'is-center', render: function (r) { return r.details.dropout + '%'; } },
                        { title: 'Mức rủi ro', cls: 'is-center', render: function (r) { return api.badge(r.level, MUC[r.color].tone); } }], kq.ruiRo);
                } },
            { key: 'chamthi', tieuDe: 'Tiến độ chấm thi, nhập điểm sau mỗi đợt thi', icon: 'fa-clipboard-check', cao: 360,
                moTa: 'Theo dõi tiến độ xử lý bài thi và nhập điểm theo số ngày sau ngày thi · Đã chấm xong: % túi bài đã chấm · Đã nhập điểm xong: % túi bài đã nhập · Cập nhật: Realtime trong đợt thi',
                ve: function (host, kq, api) {
                    api.bieuDo(host, 'line', kq.chamThi, {
                        legend: LEGEND,
                        tooltips: Object.assign({}, TIP, { callbacks: {
                            label: function (it, data) { var l = data.datasets[it.datasetIndex].label || ''; if (l) l += ': '; return l + D.so(it.yLabel).toFixed(0) + '%'; },
                            afterBody: function (items) {
                                var c = tim(items, 0), n = tim(items, 1), gap = c && n ? Number((c.yLabel - n.yLabel).toFixed(0)) : 0;
                                var a = gap <= 10 ? '✅ Tiến độ nhập điểm tốt' : gap <= 20 ? '⚠️ Cần đẩy nhanh nhập điểm' : '❌ Chậm nhập điểm đáng kể';
                                return ['', '📊 ' + items[0].label + ':', 'Chênh lệch: ' + gap + '%', a];
                            } } }),
                        scales: {
                            xAxes: [{ gridLines: { display: false }, scaleLabel: { display: true, labelString: 'Số ngày sau ngày thi' } }],
                            yAxes: [{ ticks: { beginAtZero: true, max: 100, stepSize: 10, callback: function (v) { return v + '%'; } },
                                scaleLabel: { display: true, labelString: '% hoàn thành' }, gridLines: { color: 'rgba(0, 0, 0, 0.05)' } }] }
                    });
                } },
            { key: 'hocphi', tieuDe: 'Xu hướng thu học phí theo khoa', icon: 'fa-money-bill-trend-up', cao: 360,
                moTa: 'Biểu đồ kết hợp: Cột (Số tiền đã thu) và Đường (Tỷ lệ thu %) theo tháng · Đạt mục tiêu: Tỷ lệ thu ≥100% · Gần đạt: 80% ≤ Tỷ lệ thu < 100% · Chưa đạt: Tỷ lệ thu < 80%',
                ve: function (host, kq, api) {
                    api.bieuDo(host, 'bar', kq.hocPhi, {
                        legend: LEGEND,
                        tooltips: Object.assign({}, TIP, { callbacks: {
                            label: function (it, data) {
                                var l = data.datasets[it.datasetIndex].label || ''; if (l) l += ': ';
                                return l + (it.datasetIndex === 2 ? D.so(it.yLabel).toFixed(0) + '%' : D.so(it.yLabel).toFixed(1) + ' tỷ');
                            },
                            afterBody: function (items) {
                                var t = tim(items, 2), a = t && t.yLabel >= 100 ? '✅ Đạt mục tiêu thu' : t && t.yLabel >= 80 ? '⚠️ Gần đạt mục tiêu' : '❌ Chưa đạt mục tiêu';
                                return ['', '📊 ' + items[0].label + ':', a];
                            } } }),
                        scales: {
                            xAxes: [{ gridLines: { display: false }, scaleLabel: { display: true, labelString: 'Tháng' } }],
                            yAxes: [
                                { id: 'y-axis-1', type: 'linear', position: 'left', ticks: { beginAtZero: true, callback: function (v) { return Number(v).toFixed(1) + ' tỷ'; } },
                                    scaleLabel: { display: true, labelString: 'Số tiền đã thu (tỷ VNĐ)' }, gridLines: { color: 'rgba(0, 0, 0, 0.05)' } },
                                { id: 'y-axis-2', type: 'linear', position: 'right', ticks: { beginAtZero: true, max: 140, stepSize: 20, callback: function (v) { return v + '%'; } },
                                    scaleLabel: { display: true, labelString: 'Tỷ lệ thu (%)' }, gridLines: { drawOnChartArea: false } }] }
                    });
                } },
            { key: 'nhanh', rong: 2, bang: true, tieuDe: 'Thống kê nhanh', icon: 'fa-gauge-high',
                ve: function (host, kq) {
                    host.innerHTML = kq.nhanh.map(function (x) { return '<div class="ums-kv"><span>' + esc(x[0]) + '</span><b>' + esc(x[1]) + '</b></div>'; }).join('');
                } }]
    });

    /* Khoa → Ngành (gốc: updateMajorOptions). Chưa chọn Khoa thì khoá Ngành. */
    var selKhoa = root.querySelector('[data-loc="faculty"]'), selNganh = root.querySelector('[data-loc="major"]');
    function napNganh() {
        var ds = NGANH[selKhoa.value] || [];
        selNganh.innerHTML = '<option value="">Tất cả ngành</option>' + ds.map(function (m) { return '<option value="' + esc(m[0]) + '">' + esc(m[1]) + '</option>'; }).join('');
        selNganh.value = '';
        selNganh.disabled = !selKhoa.value;
    }
    if (selKhoa && selNganh) {
        selKhoa.addEventListener('change', napNganh);
        root.addEventListener('click', function (ev) { var b = ev.target.closest('[data-a="datlai"]'); if (b) napNganh(); });
        napNganh();
    }
})();
