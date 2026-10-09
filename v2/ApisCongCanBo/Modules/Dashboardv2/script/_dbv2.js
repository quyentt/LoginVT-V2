/* =========================================================================
   Dashboardv2 — khung chung 9 bảng điều khiển MẪU (cổng cán bộ): ums.dbv2.*
   Bản gốc: ApisCongCanBo/Modules/Dashboardv2/{html,script}/*.  Đây là TRANG MẪU TĨNH của gốc ("layout demo"):
   số liệu sinh bằng mã (mock, biến thiên theo bộ lọc — hashString / clamp), KHÔNG có lời gọi API.
   Bản mới giữ NGUYÊN phần tính số liệu của từng màn (chép từ .js gốc), chỉ thay phần vẽ:
     · thẻ KPI, bộ lọc, khung thẻ → thành phần ums (ums.dbv2.*)
     · biểu đồ Chart.js 2.9 từ CDN → Chart.js 4 có sẵn trong _v2 (ums.ui.chart); cấu hình v2 đổi TỰ ĐỘNG
       bằng ums.dbv2.v2sang4(type, data, options) — legend / tooltips / scales xAxes-yAxes / gridLines /
       scaleLabel / ticks.min-max-beginAtZero-fontColor / callback tooltip (tooltipItem, data) / horizontalBar.
   ---------------------------------------------------------------------------
   ums.dbv2.man(root, cfg) — dựng khung một bảng điều khiển:
     cfg = { tieuDe, moTa, icon, nguon (chữ "Nguồn: …"),
             loc: [{ key, label, items: [{ value, text }] }], macDinh: { key: value },
             tinh(filters) → { kpis: [...kpi gốc], ... dữ liệu màn tự dùng }   (gọi mỗi lần Áp dụng / Đặt lại),
             the: [{ key, tieuDe, moTa, icon, rong: 1 | 2 (chiếm 1 hay 2 cột lưới), cao (px, mặc định 320),
                     ve(host, kq, api) → vẽ nội dung thẻ; host rỗng sẵn }] }
     kpi gốc = { iconClass, label, value, change, trendDirection up|down|stable, trendClass good|bad|warn|neutral|…,
                 color green|blue|orange|red|purple|teal…, subtext, tooltip, timing, details: [] }
     api = { bieuDo(host, type, data, options2) → vẽ canvas trong host (cấu hình Chart.js 2), bang(host, cot, dong),
             badge(chu, tone) }
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var D = ums.dbv2 = ums.dbv2 || {};
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : String(v); }

    /* ---------------------------------------------------------------------
       Chart.js 2 → 4
       --------------------------------------------------------------------- */
    function doiTruc(a, macDinhId) {
        var t = { };
        if (a.position) t.position = a.position;
        if (a.stacked !== undefined) t.stacked = a.stacked;
        if (a.display !== undefined) t.display = a.display;
        if (a.type) t.type = a.type;
        var k = a.ticks || {};
        if (k.beginAtZero !== undefined) t.beginAtZero = k.beginAtZero;
        if (k.min !== undefined) t.min = k.min;
        if (k.max !== undefined) t.max = k.max;
        if (k.suggestedMin !== undefined) t.suggestedMin = k.suggestedMin;
        if (k.suggestedMax !== undefined) t.suggestedMax = k.suggestedMax;
        t.ticks = {};
        if (k.fontColor) t.ticks.color = k.fontColor;
        if (k.stepSize !== undefined) t.ticks.stepSize = k.stepSize;
        if (k.precision !== undefined) t.ticks.precision = k.precision;
        if (k.autoSkip !== undefined) t.ticks.autoSkip = k.autoSkip;
        if (k.maxRotation !== undefined) t.ticks.maxRotation = k.maxRotation;
        if (k.minRotation !== undefined) t.ticks.minRotation = k.minRotation;
        if (k.fontSize) t.ticks.font = { size: k.fontSize };
        if (k.display !== undefined) t.ticks.display = k.display;
        if (typeof k.callback === 'function') {
            var cb = k.callback;
            // v4: callback(value, index, ticks) với trục danh mục value = chỉ số → đổi ra nhãn như v2
            t.ticks.callback = function (value, index, ticks) {
                var v = value;
                if (this && this.type === 'category' && typeof this.getLabelForValue === 'function') v = this.getLabelForValue(value);
                return cb.call(this, v, index, ticks);
            };
        }
        var g = a.gridLines || {};
        t.grid = {};
        if (g.color) t.grid.color = g.color;
        if (g.display !== undefined) t.grid.display = g.display;
        if (g.drawOnChartArea !== undefined) t.grid.drawOnChartArea = g.drawOnChartArea;
        if (g.drawBorder !== undefined) t.border = { display: g.drawBorder };
        var s = a.scaleLabel;
        if (s) t.title = { display: s.display !== false, text: s.labelString || '' };
        return { id: a.id || macDinhId, truc: t };
    }
    function boItem(ctx) {
        return { index: ctx.dataIndex, datasetIndex: ctx.datasetIndex, label: ctx.label,
            xLabel: ctx.parsed && ctx.parsed.x !== undefined ? ctx.parsed.x : ctx.label,
            yLabel: ctx.parsed && ctx.parsed.y !== undefined ? ctx.parsed.y : ctx.raw, value: ctx.raw };
    }
    function doiCallback(cbs) {
        var out = {};
        Object.keys(cbs || {}).forEach(function (k) {
            var f = cbs[k];
            if (typeof f !== 'function') return;
            out[k] = function (x) {
                var ctx = Array.isArray(x) ? x : [x];
                var chart = ctx[0] && ctx[0].chart;
                var data = chart ? chart.data : {};
                var items = ctx.map(boItem);
                return f.call(this, Array.isArray(x) ? items : items[0], data);
            };
        });
        return out;
    }
    D.v2sang4 = function (type, data, o) {
        o = o || {};
        var n = { responsive: o.responsive !== false, maintainAspectRatio: o.maintainAspectRatio === true, plugins: {} };
        if (type === 'horizontalBar') { type = 'bar'; n.indexAxis = 'y'; }
        if (o.legend) {
            var l = o.legend, lb = l.labels || {};
            n.plugins.legend = { display: l.display !== false, position: l.position || 'top',
                labels: { padding: lb.padding, boxWidth: lb.boxWidth, usePointStyle: lb.usePointStyle, color: lb.fontColor,
                    font: { size: lb.fontSize, weight: lb.fontStyle === 'bold' ? 'bold' : undefined } } };
            if (typeof l.onClick === 'function') n.plugins.legend.onClick = l.onClick;
        }
        if (o.title) n.plugins.title = { display: !!o.title.display, text: o.title.text };
        if (o.tooltips) {
            var t = o.tooltips;
            n.plugins.tooltip = { enabled: t.enabled !== false, mode: t.mode, intersect: t.intersect, backgroundColor: t.backgroundColor,
                titleColor: t.titleFontColor, bodyColor: t.bodyFontColor, borderColor: t.borderColor, borderWidth: t.borderWidth,
                padding: t.xPadding || t.yPadding ? { x: t.xPadding || 10, y: t.yPadding || 8 } : undefined, cornerRadius: t.cornerRadius,
                callbacks: doiCallback(t.callbacks) };
            if (t.mode) n.interaction = { mode: t.mode, intersect: t.intersect };
        }
        if (o.hover && o.hover.mode) n.interaction = { mode: o.hover.mode, intersect: o.hover.intersect };
        if (o.cutoutPercentage !== undefined) n.cutout = o.cutoutPercentage + '%';
        if (o.rotation !== undefined) n.rotation = o.rotation;
        if (o.circumference !== undefined) n.circumference = o.circumference;
        if (o.plugins && o.plugins.datalabels) n.plugins.datalabels = o.plugins.datalabels;
        else n.plugins.datalabels = { display: false };          // shell đăng ký datalabels toàn cục — gốc không dùng thì tắt
        if (o.animation !== undefined) n.animation = o.animation;
        if (typeof o.onClick === 'function') n.onClick = o.onClick;
        if (o.layout) n.layout = o.layout;
        var sc = o.scales;
        if (sc && (sc.xAxes || sc.yAxes)) {
            n.scales = {};
            var ngang = n.indexAxis === 'y';
            (sc.xAxes || []).forEach(function (a, i) { var r = doiTruc(a, i ? 'x' + i : 'x'); r.truc.axis = 'x'; n.scales[r.id] = r.truc; });
            (sc.yAxes || []).forEach(function (a, i) { var r = doiTruc(a, i ? 'y' + i : 'y'); r.truc.axis = 'y'; n.scales[r.id] = r.truc; });
            if (ngang) { /* v2 horizontalBar: xAxes là trục GIÁ TRỊ — v4 indexAxis 'y' giữ nguyên tên x/y nên không đổi */ }
        } else if (sc && sc.ticks) {
            // radar / polarArea v2: scale đơn
            var r1 = doiTruc(sc, 'r'); n.scales = { r: r1.truc };
        }
        // Tập dữ liệu: lineTension → tension; xAxisID/yAxisID giữ nguyên
        var d = { labels: (data && data.labels) || [], datasets: ((data && data.datasets) || []).map(function (ds) {
            var c = Object.assign({}, ds);
            if (c.lineTension !== undefined && c.tension === undefined) { c.tension = c.lineTension; delete c.lineTension; }
            if (c.type === 'horizontalBar') c.type = 'bar';
            return c;
        }) };
        return { type: type, data: d, options: n };
    };

    /* ---------------------------------------------------------------------
       Khung trang
       --------------------------------------------------------------------- */
    function gio() {
        var d = new Date(), p = function (x) { return (x < 10 ? '0' : '') + x; };
        return p(d.getDate()) + '/' + p(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
    }
    var XU = { up: 'fa-arrow-up', down: 'fa-arrow-down', stable: 'fa-minus' };
    D.kpiHtml = function (kpis) {
        return (kpis || []).map(function (k) {
            var dir = k.trendDirection || 'stable', tone = k.trendClass || dir;
            var tip = [];
            if (k.tooltip) tip.push(k.tooltip);
            if (k.timing) tip.push('Cập nhật: ' + k.timing);
            (k.details || []).forEach(function (x) { tip.push('• ' + x); });
            return '<div class="dbv-kpi dbv-kpi--' + esc(k.color || 'blue') + '" title="' + esc(tip.join('\n')) + '">' +
                '<div class="dbv-kpi__dau"><span class="dbv-kpi__ic"><i class="' + esc(ums.iconFA4 ? ums.iconFA4(k.iconClass || 'fa-solid fa-circle') : k.iconClass) + '"></i></span>' +
                (k.change !== undefined && k.change !== '' ? '<span class="dbv-xu dbv-xu--' + esc(tone) + '"><i class="fa-solid ' + (XU[dir] || XU.stable) + '"></i> ' + esc(e(k.change)) + '</span>' : '') + '</div>' +
                '<div class="dbv-kpi__nhan">' + esc(e(k.label)) + '</div>' +
                '<div class="dbv-kpi__so">' + esc(e(k.value) || '—') + '</div>' +
                (k.subtext ? '<div class="dbv-kpi__phu">' + esc(e(k.subtext)) + '</div>' : '') + '</div>';
        }).join('');
    };
    D.badge = function (chu, tone) { return '<span class="dbv-nhan dbv-nhan--' + esc(tone || 'mute') + '">' + esc(chu) + '</span>'; };

    D.man = function (root, cfg) {
        var cur = Object.assign({}, cfg.macDinh || {});
        root.innerHTML =
            '<div class="dbv-dau"><div class="dbv-dau__trai"><span class="dbv-dau__ic"><i class="' + esc(cfg.icon || 'fa-solid fa-chart-line') + '"></i></span>' +
                '<div><h1 class="dbv-dau__td">' + esc(cfg.tieuDe) + '</h1>' + (cfg.moTa ? '<div class="dbv-dau__mt">' + esc(cfg.moTa) + '</div>' : '') + '</div></div>' +
                '<div class="dbv-dau__meta"><span><i class="fa-light fa-clock"></i> Cập nhật: <b data-z="gio">--</b></span>' +
                '<span><i class="fa-light fa-database"></i> Nguồn: ' + esc(cfg.nguon || 'Dữ liệu mẫu') + '</span>' +
                '<span class="dbv-mau"><i class="fa-light fa-flask"></i> Trang mẫu — số liệu dựng thử</span></div></div>' +
            '<div class="dbv-kpis" data-z="kpi"></div>' +
            (cfg.loc && cfg.loc.length ? pat.panel({ title: 'Bộ lọc chung', icon: 'fa-filter', cls: 'ums-u-mb-4', tools: '<span class="ums-u-faint ums-u-fz13">Áp dụng cho toàn bộ KPI / biểu đồ / trang</span>',
                body: '<div class="ums-filter">' + cfg.loc.map(function (l) {
                    return '<div class="ums-field"><label class="ums-field__label">' + esc(l.label) + '</label><select class="ums-select" data-loc="' + esc(l.key) + '" data-no-s2>' +
                        l.items.map(function (x) { return '<option value="' + esc(x.value) + '">' + esc(x.text) + '</option>'; }).join('') + '</select></div>';
                }).join('') + '<div class="ums-field ums-field--fit">' + ui.btn('close', { text: 'Đặt lại', icon: 'fa-rotate-left', attr: { 'data-a': 'datlai' } }) + '</div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { text: 'Áp dụng', icon: 'fa-check', attr: { 'data-a': 'apdung' } }) + '</div></div>' }) : '') +
            '<div class="dbv-luoi">' + cfg.the.map(function (t) {
                return '<div class="dbv-o' + (t.rong === 2 ? ' dbv-o--rong' : '') + '">' + pat.panel({ title: t.tieuDe, icon: t.icon || 'fa-chart-simple', cls: 'dbv-the',
                    body: (t.moTa ? '<div class="dbv-the__mt">' + esc(t.moTa) + '</div>' : '') + '<div class="dbv-the__nd" data-the="' + esc(t.key) + '"' +
                        (t.bang ? '' : ' style="height:' + (t.cao || 320) + 'px"') + '></div>' }) + '</div>';
            }).join('') + '</div>';
        function datLoc() { (cfg.loc || []).forEach(function (l) { var s = root.querySelector('[data-loc="' + l.key + '"]'); if (s && cur[l.key] !== undefined) s.value = cur[l.key]; }); }
        function docLoc() { (cfg.loc || []).forEach(function (l) { var s = root.querySelector('[data-loc="' + l.key + '"]'); if (s) cur[l.key] = s.value; }); }
        var api = {
            bieuDo: function (host, type, data, opts2) {
                host.innerHTML = '<canvas></canvas>';
                var c = D.v2sang4(type, data, opts2);
                return ui.chart(host.querySelector('canvas'), c);
            },
            bang: function (host, cot, dong, o) { ui.table(Object.assign({ el: host, columns: cot, rows: dong, empty: 'Không có dữ liệu' }, o || {})); },
            badge: D.badge, kpiHtml: D.kpiHtml
        };
        function ve() {
            root.querySelector('[data-z="gio"]').textContent = gio();
            var kq = cfg.tinh(Object.assign({}, cur)) || {};
            root.querySelector('[data-z="kpi"]').innerHTML = D.kpiHtml(kq.kpis);
            cfg.the.forEach(function (t) {
                var host = root.querySelector('[data-the="' + t.key + '"]');
                try { t.ve(host, kq, api); } catch (err) { host.innerHTML = ui.fail('Lỗi vẽ: ' + err.message); if (window.console) console.error(err); }
            });
        }
        root.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b) return;
            if (b.getAttribute('data-a') === 'apdung') { docLoc(); ve(); }
            else if (b.getAttribute('data-a') === 'datlai') { cur = Object.assign({}, cfg.macDinh || {}); datLoc(); ve(); }
        });
        datLoc(); ve();
        return { ve: ve, loc: function () { return Object.assign({}, cur); } };
    };

    /* ---------- Tiện ích số liệu mẫu (chép nguyên từ các .js gốc) ---------- */
    D.so = function (x, f) { var n = Number(x); return isFinite(n) ? n : (f === undefined ? 0 : f); };
    D.r1 = function (v) { return Math.round(D.so(v) * 10) / 10; };
    D.pct = function (a, b) { var d = D.so(b); return d > 0 ? D.so(a) / d * 100 : 0; };
    D.fPct = function (v) { return D.r1(v).toFixed(1) + '%'; };
    D.clamp = function (v, a, b) { var n = D.so(v); return n < a ? a : n > b ? b : n; };
    D.hash = function (s) { var str = String(s || ''), h = 0; for (var i = 0; i < str.length; i++) { h = ((h << 5) - h) + str.charCodeAt(i); h |= 0; } return Math.abs(h); };
    D.huong = function (d, eps) { eps = eps === undefined ? 1e-6 : eps; return d > eps ? 'up' : d < -eps ? 'down' : 'stable'; };
    D.xuHuong = function (ratio, dir) { if (dir === 'stable') return '0%'; return (dir === 'up' ? '+' : '-') + D.r1(Math.abs(D.so(ratio) * 100)).toFixed(1) + '%'; };
    D.tyLeDoi = function (c, p) { c = D.so(c); p = D.so(p); return p > 0 ? (c - p) / p : 0; };
    D.namBatDau = function (y) { var m = String(y || '').match(/(\d{4})\s*[-–]\s*(\d{4})/); return m ? parseInt(m[1], 10) : new Date().getFullYear(); };
    D.namHoc = function (y) { y = parseInt(y, 10); if (!isFinite(y)) y = new Date().getFullYear(); return y + '-' + (y + 1); };
})();
