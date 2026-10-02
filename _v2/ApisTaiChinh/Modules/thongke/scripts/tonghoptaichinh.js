/* =========================================================================
   Tổng hợp tài chính
   Bản gốc: ApisTaiChinh/Modules/thongke/scripts/tonghoptaichinh.js
   ---------------------------------------------------------------------------
   Lời gọi (action kiểu cũ, GET, versionAPI v1.0):
       TC_ThongKe/LayDuLieuTongHopDuLieuTheoKhoa  strKhoaHoc_Id ""  → dòng [0]:
           TONGDOANHTHU, TONGPHAINOP, TONGMIEN, TONGRUT, TONG_DU_NO
       TC_ThongKe/LayDuLieuTongHop                gọi SAU lời gọi trên (kể cả
           khi lời gọi trên báo lỗi, như bản gốc) → biểu đồ theo khoá:
           NAMNHAPHOC, TENKHOA, TONGDOANHTHU, TONGPHAINOP, TONGMIEN, TONGRUT, TONG_DU_NO
       TC_ThongKe/LayDuLieuTongHopTheoKhoanThu    chi tiết theo khoản, nạp một
           lần rồi dùng lại (TEN + cột theo loại)
       TC_ThongKe/LayCTDuLieuTongHop              chi tiết theo đối tượng,
           strLoaiThongTin = TongDoanhThu | TongPhaiNop | TongMien | TongRut |
           Tong_Du_No, phân trang máy chủ → MASO, HOVATEN, TAICHINH_CACKHOANTHU_TEN, SOTIEN

   LỖI BẢN GỐC — đã sửa:
     · Biểu đồ: mảng dữ liệu bị khởi tạo lại bên trong vòng lặp từng dòng nên
       mỗi khoa thành một biểu đồ riêng chỉ có một cột. Ở đây mỗi năm nhập học
       một biểu đồ, trục ngang là các khoa của năm đó — đúng tiêu đề bản gốc
       "BIỂU ĐỒ THỐNG KÊ TÀI CHÍNH THEO KHÓA <năm>".
     · Màu Dư nợ: bản gốc so chuỗi đã định dạng tiền với 0. Ở đây so số:
       dương = xanh, còn lại = đỏ.

   Cố ý bỏ:
     · Dòng "Thời gian: 27/07/2018 - 20/08/2018" và nút tìm cạnh nó — chữ
       viết cứng trong HTML, nút không có xử lý.
     · Ô "Nhập từ khoá tìm kiếm" trên biểu đồ: lọc theo chữ của khung chứa
       canvas, không bao giờ khớp nên không có tác dụng.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var tk = ums.thongke;
    var root = document.getElementById('tonghoptaichinh');
    function z(n) { return root.querySelector('[data-z="' + n + '"]'); }
    function e(v) { return v === undefined || v === null ? '' : v; }

    var LOAI = {
        TONGDOANHTHU: { label: 'Tổng doanh thu', user: 'TongDoanhThu', icon: 'fa-chart-line-up', tone: 'green' },
        TONGPHAINOP:  { label: 'Tổng phải nộp', user: 'TongPhaiNop', icon: 'fa-sack-dollar', tone: '' },
        TONGMIEN:     { label: 'Tổng miễn', user: 'TongMien', icon: 'fa-circle-dollar-to-slot', tone: 'red' },
        TONGRUT:      { label: 'Tổng rút', user: 'TongRut', icon: 'fa-money-simple-from-bracket', tone: 'purple' },
        TONG_DU_NO:   { label: 'Tổng dư nợ', user: 'Tong_Du_No', icon: 'fa-scale-balanced', tone: '' }
    };

    var theoKhoanThu = null;     // dtTongHopTheoKhoanThu — nạp một lần

    function links(key) {
        return [
            { act: 'khoan:' + key, text: 'Theo khoản', icon: 'fa-circle-arrow-right' },
            { act: 'user:' + key, text: 'Theo đối tượng', icon: 'fa-circle-user' }
        ];
    }

    /* ---------- [1] Tổng hợp theo khoá → thẻ số liệu ---------------------- */
    function loadTongHopTheoKhoa() {
        z('stats').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: 'TC_ThongKe/LayDuLieuTongHopDuLieuTheoKhoa',
            method: 'GET',
            versionAPI: 'v1.0',
            strKhoaHoc_Id: ''
        }).then(function (r) {
            var d = (Array.isArray(r.data) ? r.data : [])[0] || {};
            z('stats').innerHTML = ['TONGDOANHTHU', 'TONGPHAINOP', 'TONGMIEN', 'TONGRUT'].map(function (k) {
                return tk.stat({ value: d[k], label: LOAI[k].label, icon: LOAI[k].icon, tone: LOAI[k].tone, links: links(k) });
            }).join('');
            var duNo = tk.num(d.TONG_DU_NO);
            z('duno').innerHTML = tk.stat({
                value: duNo, label: LOAI.TONG_DU_NO.label, icon: LOAI.TONG_DU_NO.icon,
                tone: duNo > 0 ? 'green' : 'red', links: links('TONG_DU_NO')
            });
        }).catch(function (err) {
            z('stats').innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'tổng hợp theo khoá');
        });
    }

    /* ---------- [2] Tổng hợp → biểu đồ theo năm nhập học ------------------ */
    var SERIES = [
        { key: 'TONGDOANHTHU', label: 'Doanh thu', color: '#2fb380' },
        { key: 'TONGPHAINOP', label: 'Phải nộp', color: '#5b96ff' },
        { key: 'TONGMIEN', label: 'Miễn', color: '#a275ff' },
        { key: 'TONGRUT', label: 'Rút', color: '#f5b547' },
        { key: 'TONG_DU_NO', label: 'Dư nợ', color: '#f0647a' }
    ];

    function loadTongHop() {
        z('charts').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: 'TC_ThongKe/LayDuLieuTongHop',
            method: 'GET',
            versionAPI: 'v1.0'
        }).then(function (r) {
            var data = Array.isArray(r.data) ? r.data : [];
            var years = [];
            data.forEach(function (x) { if (years.indexOf(e(x.NAMNHAPHOC)) < 0) years.push(e(x.NAMNHAPHOC)); });
            if (!years.length) { z('charts').innerHTML = ui.empty('Không có dữ liệu'); return; }
            z('charts').innerHTML = '<div class="thtc-charts">' + years.map(function (y, i) {
                return '<div><div class="ums-legend">Biểu đồ thống kê tài chính theo khoá ' + ui.esc(y) + '</div>' +
                    '<canvas data-chart="' + i + '" height="260"></canvas></div>';
            }).join('') + '</div>';
            years.forEach(function (y, i) {
                var rows = data.filter(function (x) { return e(x.NAMNHAPHOC) === y; });
                ui.chart(z('charts').querySelector('[data-chart="' + i + '"]'), {
                    type: 'bar',
                    data: {
                        labels: rows.map(function (x) { return e(x.TENKHOA); }),
                        datasets: SERIES.map(function (s) {
                            return { label: s.label, data: rows.map(function (x) { return tk.num(x[s.key]); }),
                                     backgroundColor: s.color, borderRadius: 4, maxBarThickness: 36 };
                        })
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } },
                            tooltip: { callbacks: { label: function (c) { return c.dataset.label + ': ' + ui.money(c.raw); } } },
                            datalabels: { display: false }
                        },
                        scales: {
                            x: { grid: { display: false }, ticks: { font: { size: 11 } } },
                            y: { beginAtZero: true, grid: { color: '#eef2f7' }, ticks: { font: { size: 11 }, callback: function (v) { return ui.money(v); } } }
                        }
                    }
                });
            });
        }).catch(function (err) {
            z('charts').innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'biểu đồ tổng hợp');
        });
    }

    /* ---------- [3] Chi tiết theo khoản ---------------------------------- */
    function showDetail(title) {
        z('detailTitle').textContent = title;
        z('detailTable').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ui.swap(z('list'), z('detail'), { top: false });
    }

    function drawKhoan(key) {
        ui.table({
            el: z('detailTable'),
            rows: theoKhoanThu,
            columns: [
                { title: 'Khoản', prop: 'TEN' },
                tk.moneyCol('Số tiền', key)
            ]
        });
    }

    function openKhoan(key) {
        showDetail('Chi tiết theo khoản — ' + LOAI[key].label.toLowerCase());
        if (theoKhoanThu && theoKhoanThu.length) return drawKhoan(key);
        ums.api.call({
            action: 'TC_ThongKe/LayDuLieuTongHopTheoKhoanThu',
            method: 'GET',
            versionAPI: 'v1.0',
            strKhoaHoc_Id: ''
        }).then(function (r) {
            theoKhoanThu = Array.isArray(r.data) ? r.data : [];
            drawKhoan(key);
        }).catch(function (err) {
            z('detailTable').innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'chi tiết theo khoản');
        });
    }

    /* ---------- [4] Chi tiết theo đối tượng ------------------------------ */
    function openUser(key) {
        showDetail('Chi tiết theo đối tượng — ' + LOAI[key].label.toLowerCase());
        tk.pagedTable(z('detailTable'), {
            where: 'chi tiết theo đối tượng',
            call: function () {
                return {
                    action: 'TC_ThongKe/LayCTDuLieuTongHop',
                    method: 'GET',
                    versionAPI: 'v1.0',
                    strLoaiThongTin: LOAI[key].user,
                    strKhoaHoc_Id: '',
                    strTAICHINH_CacKhoanThu_Id: '',
                    strNguoiThucHien_Id: '',
                    strTuKhoa: ''
                };
            },
            columns: [
                { title: 'Mã số', prop: 'MASO', cls: 'is-nowrap' },
                { title: 'Họ tên', prop: 'HOVATEN' },
                { title: 'Khoản', prop: 'TAICHINH_CACKHOANTHU_TEN' },
                tk.moneyCol('Số tiền', 'SOTIEN')
            ]
        }).load(1);
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-act]');
        if (!b) return;
        var act = b.getAttribute('data-act');
        if (act === 'back') { ui.swap(z('detail'), z('list'), { top: false }); return; }
        if (act === 'reload') { nap(); return; }
        var p = act.split(':');
        if (p[0] === 'khoan') openKhoan(p[1]);
        else if (p[0] === 'user') openUser(p[1]);
    });

    function nap() {
        tk.thoiDiem(z('tinhDen'));
        return loadTongHopTheoKhoa().then(loadTongHop);
    }

    nap();
})();
