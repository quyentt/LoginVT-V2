/* =========================================================================
   Tổng quan (Dashboard) — Nghiên cứu khoa học
   Bản gốc: ApisNCKH/Modules/dashboard/html/dashboard.html + script/dashboard.js
   ---------------------------------------------------------------------------
   Bố cục gốc: một dải 4 ô số liệu (Đề tài · Sách xuất bản · Bài báo quốc tế · Bài báo trong nước), dưới là lưới 2 × 2
   biểu đồ ĐƯỜNG (edu.system.lineChart): Tình hình đề tài | sách xuất bản; bài báo trong nước | quốc tế.
   Bản mới giữ đúng bố cục: .ums-stat ×4 (ums-grid--4) + 4 khung biểu đồ (ums-grid--2), Chart.js 4 qua ums.ui.chart.
   KHÔNG dùng khung ums.dbv2 (Cổng cán bộ Dashboardv2): khung đó dành cho TRANG MẪU có bộ lọc + số liệu sinh bằng mã;
   màn này gọi API thật, không lọc.
   Lời gọi (chép nguyên, GET; năm = năm hiện tại − 5 … năm hiện tại, tên tham số strNamKeThuc giữ đúng chính tả gốc):
     NCKH_TK_DeTai/ThongKeDeTaiHangNam                  strNamBatDau, strNamKeThuc, strTinhTrang_Id ''
     NCKH_TK_Sach/ThongKeSachHangNam                    strNamBatDau, strNamKeThuc
     NCKH_TK_TapChiQuocTe/ThongKeTapChiQuocTeHangNam    strNamBatDau, strNamKeThuc
     NCKH_TK_TapChiQuocGia/ThongKeTapChiQuocGiaHangNam  strNamBatDau, strNamKeThuc
   Mỗi lời gọi trả các dòng { NAM, SOLUONG }: ô số liệu = tổng SOLUONG, biểu đồ = SOLUONG theo NAM.
   Khác gốc (tự chốt): gốc lỗi thì chỉ console.log (ô số trống, biểu đồ trắng) → nay ô số hiện "—" và khung biểu đồ báo lỗi.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('nckh-dashboard');
    if (!root) return;
    var ui = ums.ui, pat = ums.pat;
    function e(v) { return v === null || v === undefined ? '' : String(v); }

    var nam = new Date().getFullYear();
    var MUC = [
        { k: 'dt', nhan: 'Đề tài', icon: 'fa-file-lines', mau: 'green', net: '#7ab26f', tieuDe: 'Tình hình đề tài',
            action: 'NCKH_TK_DeTai/ThongKeDeTaiHangNam', them: { strTinhTrang_Id: '' }, dong: 'Đề tài',
            chu: '-- Biểu đồ thống kê số lượng đề tài hàng năm --' },
        { k: 'sach', nhan: 'Sách xuất bản', icon: 'fa-book', mau: 'red', net: '#dc3545', tieuDe: 'Tình hình sách xuất bản',
            action: 'NCKH_TK_Sach/ThongKeSachHangNam', dong: 'Sách xuất bản', chu: '-- Biểu đồ thống kê sách xuất bản hàng năm --' },
        { k: 'tcqt', nhan: 'Bài báo quốc tế', icon: 'fa-newspaper', mau: 'amber', net: '#f59e0b', tieuDe: 'Tình hình bài báo quốc tế',
            action: 'NCKH_TK_TapChiQuocTe/ThongKeTapChiQuocTeHangNam', dong: 'Bài báo quốc tế', chu: '-- Biểu đồ thống kê tạp chí quốc tế hàng năm --' },
        { k: 'tcqg', nhan: 'Bài báo trong nước', icon: 'fa-newspaper', mau: '', net: '#3b82f6', tieuDe: 'Tình hình bài báo trong nước',
            action: 'NCKH_TK_TapChiQuocGia/ThongKeTapChiQuocGiaHangNam', dong: 'Tạp chí quốc gia', chu: '-- Biểu đồ thống kê tạp chí quốc gia hàng năm --' }
    ];
    function m(k) { return MUC.filter(function (x) { return x.k === k; })[0]; }
    function khung(x) {
        return pat.panel({ title: x.tieuDe, icon: 'fa-chart-line',
            body: '<div style="position:relative;height:250px" data-z="bd-' + x.k + '"><canvas></canvas></div>' });
    }

    root.innerHTML = pat.page('Tổng quan') +
        '<div class="ums-grid ums-grid--4 ums-u-mb-4">' + MUC.map(function (x) {
            return '<div class="ums-stat' + (x.mau ? ' ums-stat--' + x.mau : '') + '">' +
                '<div class="ums-stat__icon"><i class="fa-light ' + x.icon + '"></i></div>' +
                '<div class="ums-stat__main"><div class="ums-stat__value" data-z="so-' + x.k + '">…</div>' +
                '<div class="ums-stat__label">' + ui.esc(x.nhan.toUpperCase()) + '</div></div></div>';
        }).join('') + '</div>' +
        /* Thứ tự khung như gốc: hàng 1 đề tài | sách; hàng 2 bài báo trong nước | quốc tế */
        '<div class="ums-grid ums-grid--2">' + khung(m('dt')) + khung(m('sach')) + '</div>' +
        '<div class="ums-grid ums-grid--2 ums-u-mt-4">' + khung(m('tcqg')) + khung(m('tcqt')) + '</div>';
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

    function ve(x, nhan, so) {
        ui.chart(z('bd-' + x.k).querySelector('canvas'), {
            type: 'line',
            data: { labels: nhan, datasets: [{ label: x.dong, data: so, borderColor: x.net, backgroundColor: x.net, pointRadius: 4, tension: 0.25 }] },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { display: true, position: 'top' },
                    title: { display: true, position: 'bottom', text: x.chu, color: '#8d97a8', font: { size: 12, weight: '500' } },
                    datalabels: { display: false }
                },
                scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
            }
        });
    }

    MUC.forEach(function (x) {
        var p = Object.assign({ action: x.action, method: 'GET', strNamBatDau: nam - 5, strNamKeThuc: nam, silent: true }, x.them || {});
        ums.api.call(p).then(function (r) {
            var rows = Array.isArray(r.data) ? r.data : [];
            var tong = 0, nhan = [], so = [];
            rows.forEach(function (d) { nhan.push(e(d.NAM)); so.push(Number(d.SOLUONG) || 0); tong += Number(d.SOLUONG) || 0; });
            z('so-' + x.k).textContent = ui.so ? ui.so(tong) : String(tong);
            ve(x, nhan, so);
        }).catch(function (err) {
            z('so-' + x.k).textContent = '—';
            z('bd-' + x.k).innerHTML = ui.fail(x.action + ': ' + (err && err.message || 'lỗi'));
        });
    });
})();
