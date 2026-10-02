/* =========================================================================
   ums.ui — tầng component cho JavaScript
   =========================================================================
   Mọi chỗ sinh markup đều đi qua đây, để giao diện không rã ra theo thời
   gian. Hàm trả về CHUỖI nên dùng được ngay bên trong hàm render của bảng.

   Không phụ thuộc jQuery (trừ hai hàm gắn select2), không phụ thuộc lớp
   class nào của giao diện cũ.
   ========================================================================= */
(function (global) {
    'use strict';

    var ums = global.ums || (global.ums = {});
    var ui = ums.ui || (ums.ui = {});

    /* ---------- Tiện ích ------------------------------------------------ */
    function esc(s) {
        if (s === null || s === undefined) return '';
        return String(s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    ui.esc = esc;

    /* Nhiều cột của hệ cũ chứa sẵn thẻ <br> trong DỮ LIỆU (vd THOIGIANCHITIET
       của lớp học phần: "Tu 29/06 den 12/07:<br>Thu 3 tiet 4,5,6…"). Bản gốc
       trả thẳng vào HTML nên xuống dòng; ở đây escape hết nên người dùng nhìn
       thấy chữ "<br>". Hàm này escape như thường rồi TRẢ LẠI đúng thẻ <br> —
       không mở cửa cho HTML tuỳ ý từ máy chủ. */
    ui.escBr = function (v) {
        return dsLich(esc(v).replace(/&lt;br[^&]*&gt;/gi, '<br>'));
    };

    /* Thông tin lịch ("Tu 23/03 den 05/04:<br>Thu 3 tiet 13,14,15, P.303, GV<br><br>Tu …") → danh sách có dấu
       đầu dòng, mỗi khoảng thời gian một mục (người dùng 2026-09-29: các khối dính nhau khó đọc). Chỉ đổi khi
       MỌI khối (ngăn nhau bằng dòng trống) đều mở đầu bằng một dòng kết thúc dấu ":" — văn bản thường giữ nguyên. */
    function dsLich(s) {
        if (s.indexOf(':') < 0 || s.indexOf('<br>') < 0) return s;
        var khoi = s.split(/(?:\s*<br>\s*){2,}/).map(function (k) { return k.replace(/^(\s*<br>\s*)+|(\s*<br>\s*)+$/g, '').trim(); })
            .filter(Boolean).map(function (k) { var i = k.indexOf('<br>'); return i < 0 ? null : [k.slice(0, i).trim(), k.slice(i + 4).trim()]; });
        if (!khoi.length || khoi.some(function (k) { return !k || !/:$/.test(k[0]) || !k[1]; })) return s;
        return '<ul class="ums-dsl">' + khoi.map(function (k) {
            return '<li><span class="ums-dsl__dau">' + k[0] + '</span>' + k[1] + '</li>';
        }).join('') + '</ul>';
    }

    /* ums.ui.money(n)                → "1.250.000"
       ums.ui.money(n, { donVi: true }) → "1.250.000 đ"  (khỏi mỗi màn tự nối) */
    /* Số tiền hiển thị — theo site.config.js `money` (chốt 2026-09-26: dấu PHẨY ngăn nghìn, 0 số lẻ; đổi sang
       USD thì sửa cấu hình, xem ghi chú ở đó). Mọi chỗ hiện tiền dùng hàm này, không tự toLocaleString. */
    ui.money = function (n, o) {
        if (n === null || n === undefined || n === '') return '';
        var c = (ums.cfg && ums.cfg.money) || {};
        var dec = c.decimals === undefined ? 0 : c.decimals;
        var v = Number(String(n).replace(/[^\d.-]/g, ''));
        var s = isNaN(v) ? esc(n) : v.toLocaleString(c.locale || 'en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
        return (o && o.donVi) ? s + ' ' + (c.unit || 'đ') : s;
    };
    /* Số đếm (sinh viên, lớp, bản ghi…) — cùng kiểu ngăn nghìn với tiền cho thống nhất, không số lẻ */
    ui.so = function (n) {
        var v = Number(n);
        if (n === null || n === undefined || n === '' || isNaN(v)) return n === undefined || n === null ? '' : String(n);
        var c = (ums.cfg && ums.cfg.money) || {};
        return Math.round(v).toLocaleString(c.locale || 'en-US');
    };

    /* Đọc số tiền thành chữ — thư viện n2vi của chính dự án gốc, nay nạp ở
       assets/vendor/n2vi. Hệ cũ gọi to_vietnamese(n) rồi viết hoa chữ đầu và
       thêm dấu chấm; giữ đúng vậy để bản in không lệch với hệ đang chạy. */
    ui.docSo = function (n) {
        if (typeof global.to_vietnamese !== 'function') return '';
        var s = global.to_vietnamese(String(n === null || n === undefined ? '' : n).replace(/[^\d.-]/g, '')) + '.';
        s = s.trim();
        return s.charAt(0).toUpperCase() + s.slice(1);
    };

    /* ---------- MỞ / ĐÓNG CÓ TRƯỢT --------------------------------------
       ums.ui.truot(el, mo, xong)  — trượt mở (mo = true) hoặc trượt đóng.
       Đo chiều cao thật rồi chạy bằng Web Animations nên không phải khai
       max-height ước lượng trong CSS (ước lượng sai thì hoặc giật, hoặc cắt
       mất nội dung). Tôn trọng prefers-reduced-motion: tắt hiệu ứng thì đổi
       trạng thái ngay. Hàm gọi tự lo việc thêm / bỏ lớp mở:
           el.classList.add('is-open'); ui.truot(el, true);
           ui.truot(el, false, function () { el.classList.remove('is-open'); });  */
    ui.truot = function (el, mo, xong) {
        if (!el) { if (xong) xong(); return; }
        var it = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
        function het() { el.style.overflow = ''; el.style.height = ''; if (xong) xong(); }
        if (it || !el.animate) return het();
        var h = el.scrollHeight;
        el.style.overflow = 'hidden';
        var a = el.animate(mo ? [{ height: '0px' }, { height: h + 'px' }] : [{ height: h + 'px' }, { height: '0px' }],
            { duration: 220, easing: 'cubic-bezier(.4, 0, .2, 1)' });
        var xongRoi = false;
        function ket() { if (xongRoi) return; xongRoi = true; het(); }
        a.onfinish = ket;
        a.oncancel = ket;
        setTimeout(ket, 260);        // chốt: trạng thái phải đúng kể cả khi sự kiện kết thúc không tới
    };

    /* ---------- <details> : trượt + đàn xếp ------------------------------
       Mọi vùng thu gọn viết bằng <details><summary> (bảng điểm theo học kỳ,
       nhóm trong màn…) đều đi qua đây:
         · mở / đóng có trượt như nhóm menu ở cột trái;
         · behavior.accordion (mặc định bật): mở một cái thì đóng các <details>
           CÙNG CẤP; tắt trong Cài đặt giao diện thì mở được nhiều cái.
       Gắn một trình xử lý ở document nên màn hình không phải khai gì thêm. */
    ui.moDetails = function (det, mo) {
        if (!det) return;
        var giam = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (giam || !det.animate) { det.open = mo; return; }
        var cao0 = det.offsetHeight;
        if (mo) det.open = true;
        var s = det.querySelector('summary');
        var cao1 = mo ? det.scrollHeight : (s ? s.offsetHeight : 0);
        det.style.overflow = 'hidden';
        var a = det.animate([{ height: cao0 + 'px' }, { height: cao1 + 'px' }],
            { duration: 220, easing: 'cubic-bezier(.4, 0, .2, 1)' });
        var xong = false;
        function het() { if (xong) return; xong = true; det.style.overflow = ''; det.style.height = ''; if (!mo) det.open = false; }
        a.onfinish = het;
        a.oncancel = het;
        setTimeout(het, 260);        // chốt: trạng thái phải đúng kể cả khi sự kiện kết thúc không tới
    };
    document.addEventListener('click', function (ev) {
        var s = ev.target.closest && ev.target.closest('summary');
        if (!s) return;
        var det = s.parentNode;
        if (!det || det.tagName !== 'DETAILS' || det.hasAttribute('data-tu-mo')) return;   // data-tu-mo: để trình duyệt tự lo
        ev.preventDefault();
        var mo = !det.open;
        var cfg = (ums.cfg && ums.cfg.behavior) || {};
        if (mo && cfg.accordion !== false && det.parentNode) {
            Array.prototype.forEach.call(det.parentNode.children, function (x) {
                if (x !== det && x.tagName === 'DETAILS' && x.open) ui.moDetails(x, false);
            });
        }
        ui.moDetails(det, mo);
    });

    /* ---------- NGÀY GIỜ ------------------------------------------------
       ums.ui.ngayGio(v) → "dd/MM/yyyy HH:mm" (bỏ phần giờ khi không có).
       Máy chủ trả ngày ở nhiều dạng tuỳ procedure: "13/09/2026",
       "13/09/2026 09:12:33", ISO "2026-09-13T09:12:00", hoặc đã là chữ
       ("vừa xong"). Hàm này chỉ CHUẨN HOÁ những dạng nhận ra được và trả
       nguyên văn khi không nhận ra — không bao giờ làm mất dữ liệu gốc. */
    ui.ngayGio = function (v, o) {
        o = o || {};
        var s = (v === null || v === undefined) ? '' : String(v).trim();
        if (!s) return '';
        function hai(n) { return (n < 10 ? '0' : '') + n; }
        function ra(d, m, y, gi, ph) {
            var ngay = hai(d) + '/' + hai(m) + '/' + y;
            return (gi === null || o.chiNgay) ? ngay : ngay + ' ' + hai(gi) + ':' + hai(ph);
        }
        var m = s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})(?:[ T](\d{1,2}):(\d{2}))?/);
        if (m) return ra(+m[1], +m[2], m[3], m[4] === undefined ? null : +m[4], +(m[5] || 0));
        m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{2}))?/);
        if (m) return ra(+m[3], +m[2], m[1], m[4] === undefined ? null : +m[4], +(m[5] || 0));
        return s;
    };

    ui.empty = function (msg, icon) {
        return '<div class="ums-empty"><i class="fa-light ' + (icon || 'fa-inbox') + '"></i>' +
            esc(msg || 'Không có dữ liệu') + '</div>';
    };

    /* ---------- Nút ------------------------------------------------------ */
    var BTN = {
        add:    { icon: 'fa-light fa-plus',             text: 'Thêm mới',    mod: 'add' },
        save:   { icon: 'fa-light fa-floppy-disk',      text: 'Lưu',         mod: 'save' },
        search: { icon: 'fa-light fa-magnifying-glass', text: 'Tìm kiếm',    mod: 'primary' },
        close:  { icon: 'fa-light fa-xmark',            text: 'Đóng',        mod: 'ghost' },
        del:    { icon: 'fa-light fa-trash-can',        text: 'Xoá',         mod: 'danger' },
        /* Xuất / in là việc ĐƯA DỮ LIỆU RA NGOÀI — nút viền xanh lơ (out-info),
           không để trắng lẫn với Đóng. Xem bảng phân loại ở components/button.css. */
        excel:  { icon: 'fa-light fa-file-excel',       text: 'Xuất Excel',  mod: 'out-info' },
        print:  { icon: 'fa-light fa-print',            text: 'In',          mod: 'out-info' },
        /* ---- Từ vựng biểu tượng dùng chung (người dùng chốt 2026-09-23) -------
           MỘT hành động = MỘT biểu tượng trên toàn ứng dụng. Chữ trên nút vẫn giữ
           đúng bản gốc ("Xem", "Danh sách", "Xem học phần"…), chỉ biểu tượng là
           bắt buộc theo bảng này. Kiểm bằng  python _harness/kiem-icon-chuan.py  */
        view:    { icon: 'fa-light fa-eye',                  text: 'Chi tiết',      mod: 'out-primary' },
        edit:    { icon: 'fa-light fa-pen-to-square',        text: 'Sửa',           mod: 'warn' },
        history: { icon: 'fa-light fa-clock-rotate-left',    text: 'Lịch sử',       mod: 'out-primary' },
        confirm: { icon: 'fa-light fa-circle-check',         text: 'Xác nhận',      mod: 'save' },
        reload:  { icon: 'fa-light fa-rotate-right',         text: 'Tải lại',       mod: 'ghost' },
        attach:  { icon: 'fa-light fa-paperclip',            text: 'Tệp đính kèm',  mod: 'out-primary' },
        report:  { icon: 'fa-light fa-file-chart-column',    text: 'Xuất báo cáo',  mod: 'out-info' },
        importer:{ icon: 'fa-light fa-cloud-arrow-up',       text: 'Import',        mod: 'out-info' }
    };

    /* Bảng tra cho màn hình và cho script kiểm: ums.ui.ICON.view … */
    ui.ICON = {};
    Object.keys(BTN).forEach(function (k) { ui.ICON[k] = BTN[k].icon.replace('fa-light ', ''); });

    /** ums.ui.btn('add', { text: 'Mở kế hoạch mới', attr: {...} }) */
    ui.btn = function (kind, opts) {
        var d = BTN[kind] || BTN.search;
        opts = opts || {};
        /* NÚT TẢI LẠI CHUẨN (người dùng 2026-09-26): chỉ biểu tượng ↻, nhẹ và nhỏ như "Xoá đã chọn", luôn CUỐI nhóm nút
           (CSS order — trước nó là Xoá đã chọn, trước nữa là các nút chức năng). Áp khi dùng chữ mặc định "Tải lại";
           nút reload mang chữ khác (Viết lại, Đặt lại…) là nút chức năng, giữ nguyên. Màu riêng màn truyền vào bị bỏ qua. */
        if (kind === 'reload' && (opts.text === undefined || opts.text === 'Tải lại')) {
            var at = '';
            Object.keys(opts.attr || {}).forEach(function (k) { if (k !== 'title') at += ' ' + k + '="' + esc(opts.attr[k]) + '"'; });
            return '<button type="button" class="ums-btn ums-btn--tailai' + (opts.cls ? ' ' + opts.cls : '') + '"' +
                (opts.id ? ' id="' + esc(opts.id) + '"' : '') + at + ' title="' + esc((opts.attr && opts.attr.title) || 'Tải lại') + '" aria-label="Tải lại">' +
                '<i class="fa-light fa-rotate-right"></i></button>';
        }
        var text = opts.text !== undefined ? opts.text : d.text;
        /* Nút Đóng mang thêm lớp ums-btn--dong: luật "mỗi lúc chỉ MỘT nút Đóng" (objects/shell.css) dựa vào lớp này để ẩn nút Đóng
           của tầng ngoài khi biểu mẫu bên trong đang mở (người dùng 2026-09-29). */
        var cls = 'ums-btn ums-btn--' + (opts.mod || d.mod) + (kind === 'close' ? ' ums-btn--dong' : '') + (opts.cls ? ' ' + opts.cls : '');
        var attrs = '';
        if (opts.id) attrs += ' id="' + esc(opts.id) + '"';
        if (opts.attr) {
            Object.keys(opts.attr).forEach(function (k) { attrs += ' ' + k + '="' + esc(opts.attr[k]) + '"'; });
        }
        /* opts.icon: đổi biểu tượng mặc định của loại nút — dùng khi bản gốc đặt
           biểu tượng khác ("Đọc dữ liệu" là quyển sách, không phải kính lúp).
           Truyền tên FA7 không kèm kiểu: 'fa-book' → 'fa-light fa-book'. */
        var icon = opts.icon ? (/^fa-(light|regular|solid|thin|duotone) /.test(opts.icon) ? opts.icon : 'fa-light ' + opts.icon) : d.icon;
        return '<button type="button" class="' + cls + '"' + attrs + '>' +
            '<i class="' + icon + '"></i>' + (text ? '<span>' + esc(text) + '</span>' : '') + '</button>';
    };

    /* ---------- Nút biểu tượng trong ô bảng ------------------------------ */
    var ICONBTN = {
        view:    { icon: 'fa-light fa-eye',               title: 'Xem chi tiết' },
        edit:    { icon: 'fa-light fa-pen-to-square',     title: 'Sửa' },
        del:     { icon: 'fa-light fa-trash-can',         title: 'Xoá' },
        history: { icon: 'fa-light fa-clock-rotate-left', title: 'Lịch sử' },
        confirm: { icon: 'fa-light fa-circle-check',      title: 'Xác nhận' },
        reload:  { icon: 'fa-light fa-rotate-right',      title: 'Tải lại' },
        print:   { icon: 'fa-light fa-print',             title: 'In' },
        attach:  { icon: 'fa-light fa-paperclip',         title: 'Tệp đính kèm' }
    };

    ui.iconBtn = function (kind, id) {
        var d = ICONBTN[kind] || ICONBTN.view;
        return '<button type="button" class="ums-iconbtn ums-iconbtn--' + kind + '"' +
            (id ? ' data-id="' + esc(id) + '"' : '') +
            ' data-act="' + kind + '" title="' + esc(d.title) + '">' +
            '<i class="' + d.icon + '"></i></button>';
    };

    ui.actions = function (id, kinds) {
        return (kinds || ['view', 'edit', 'del']).map(function (k) { return ui.iconBtn(k, id); }).join('');
    };

    /* ---------- Nhãn trạng thái ------------------------------------------ */
    ui.badge = function (text, tone) {
        var t = ['ok', 'warn', 'bad', 'mute', 'info'].indexOf(tone) >= 0 ? tone : 'mute';
        return '<span class="ums-badge ums-badge--' + t + '">' + esc(text) + '</span>';
    };

    /* ---------- Chip lọc -------------------------------------------------- */
    ui.chips = function (list, activeKey) {
        return '<div class="ums-chips">' + list.map(function (c) {
            return '<button type="button" class="ums-chip' + (c.key === activeKey ? ' is-active' : '') +
                '" data-chip="' + esc(c.key) + '">' + esc(c.label) +
                (c.count !== undefined ? '<span class="ums-chip__count">' + c.count + '</span>' : '') +
                '</button>';
        }).join('') + '</div>';
    };

    /* ---------- Dải tab --------------------------------------------------
       ums.ui.tabs([{ key, text, icon }], 'keyĐangMở', 'data-ktab')
       → '<div class="ums-tabs">…</div>'; màn tự nghe click trên [data-ktab]
       và gọi ums.ui.tabsActive(host, key) để đổi tab đang sáng. */
    ui.tabs = function (list, active, attr) {
        attr = attr || 'data-tab';
        return '<div class="ums-tabs">' + list.map(function (t) {
            return '<a class="ums-tabs__item' + (t.key === active ? ' is-active' : '') + '" href="javascript:void(0)" ' + attr + '="' + esc(t.key) + '">' +
                (t.icon ? '<i class="fa-light ' + esc(t.icon) + '"></i> ' : '') + esc(t.text) + '</a>';
        }).join('') + '</div>';
    };
    ui.tabsActive = function (host, key, attr) {
        attr = attr || 'data-tab';
        Array.prototype.forEach.call(host.querySelectorAll('[' + attr + ']'), function (a) {
            a.classList.toggle('is-active', a.getAttribute(attr) === key);
        });
    };

    /* ---------- Thẻ vai trò / phân hệ ------------------------------------- */
    ui.tile = function (t) {
        return '<a class="ums-tile ums-tile--' + esc(t.tone || 'slate') + '" href="' + esc(t.href || 'javascript:void(0)') + '">' +
            '<span class="ums-tile__icon"><i class="' + esc(t.icon || 'fa-light fa-cube') + '"></i></span>' +
            '<span class="ums-tile__body">' +
            '<span class="ums-tile__name">' + esc(t.name) + '</span>' +
            (t.group ? '<span class="ums-tile__group">' + esc(t.group) + '</span>' : '') +
            '</span></a>';
    };

    /* ---------- Ô trong bảng ---------------------------------------------- */
    ui.cell = function (title, sub) {
        return '<div class="ums-cell__title">' + esc(title) + '</div>' +
            (sub ? '<div class="ums-cell__sub">' + esc(sub) + '</div>' : '');
    };

    ui.meter = function (value, max, label) {
        var p = max ? Math.round(value / max * 100) : 0;
        return '<div class="ums-meter"><div class="ums-meter__track">' +
            '<div class="ums-meter__fill" style="width:' + p + '%"></div></div>' +
            '<b class="ums-u-fz12">' + esc(label !== undefined ? label : ui.money(value)) + '</b></div>';
    };

    /* ---------- BẢNG ------------------------------------------------------
       Sinh cả <table>, <thead>, <tbody> và phân trang, nên đổi giao diện
       bảng cho toàn hệ thống chỉ cần sửa hàm này.

       cfg = { el, columns:[{title, prop|render(row,i), cls, width, group?:[…]}], rows,
               stt, page:{index,size,total,onChange}, empty, tableCls }
       ------------------------------------------------------------------- */
    ui.table = function (cfg) {
        var host = typeof cfg.el === 'string' ? document.querySelector(cfg.el) : cfg.el;
        if (!host) return;

        var cols = cfg.columns || [];
        var rows = cfg.rows || [];
        var stt = cfg.stt !== false;
        var span = cols.length + (stt ? 1 : 0);

        /* Cột ô đánh dấu chọn dòng và cột "Thao tác" luôn nằm CUỐI bảng (người dùng chốt 2026-09-29):
           … dữ liệu … | Thao tác | ô đánh dấu — đúng thứ tự ums.crud vẫn vẽ. Màn khai các cột đó ở ĐẦU bảng
           (như bản gốc) thì tự dời xuống cuối, không phải sửa từng màn. Chỉ dời các cột ĐỨNG ĐẦU liền nhau;
           cột nằm giữa bảng giữ nguyên. Ô dời mang `data-cot-goc` = vị trí gốc trong dòng để báo cáo /
           import (đọc theo vị trí cột) vẫn thấy thứ tự cũ — ums.ui.oTheoGoc.
           Giữ nguyên chỗ: cfg.chonCuoi = false hoặc cột khai `giuCho: true`. */
        var gocCua = [];                 // [cột, vị trí gốc trong dòng]
        if (cfg.chonCuoi !== false && cols.length > 1) {
            var laChon = function (c) { return !c.title && /^\s*(<label[^>]*>\s*)?<input[^>]*type="checkbox"/i.test(String(c.head || '')); };
            var laThaoTac = function (c) { return /(^|\s)is-actions(\s|$)/.test(String(c.cls || '')) || String(c.title || '').trim() === 'Thao tác'; };
            var dau = 0;
            while (dau < cols.length - 1 && !cols[dau].giuCho && !(cols[dau].group || []).length && (laChon(cols[dau]) || laThaoTac(cols[dau]))) dau++;
            if (dau) {
                var doi = cols.slice(0, dau);
                doi.forEach(function (c, i) { gocCua.push([c, i + (stt ? 1 : 0)]); });
                cols = cols.slice(dau).concat(doi.filter(laThaoTac), doi.filter(function (c) { return !laThaoTac(c); }));
            }
        }
        function goc(c) {
            for (var i = 0; i < gocCua.length; i++) if (gocCua[i][0] === c) return ' data-cot-goc="' + gocCua[i][1] + '"';
            return '';
        }

        var h = '<div class="ums-tablewrap"><table class="ums-table ' +
            esc(cfg.tableCls || 'ums-table--lined') + '"><thead><tr>';

        /* Tiêu đề nhiều tầng: cột khai `group: ['Tầng 1', 'Tầng 2']` — các cột
           liền nhau cùng tiền tố nhóm gộp thành một ô (colspan), cột không nhóm
           kéo dài hết các tầng (rowspan). Không cột nào có group → một tầng. */
        var depth = 1 + cols.reduce(function (m, c) { return Math.max(m, (c.group || []).length); }, 0);
        function leaf(c, rs) {
            // `head` là HTML dựng sẵn (vd ô chọn tất cả), `title` là chữ thường
            return '<th class="' + esc(c.cls || '') + '"' + goc(c) + (rs > 1 ? ' rowspan="' + rs + '"' : '') +
                (c.width ? ' style="width:' + esc(c.width) + '"' : '') + '>' +
                (c.head !== undefined ? c.head : esc(c.title || '')) + '</th>';
        }
        function cung(a, b, L) {
            a = a || []; b = b || [];
            if (a.length <= L || b.length <= L) return false;
            for (var k = 0; k <= L; k++) if (a[k] !== b[k]) return false;
            return true;
        }
        for (var L = 0; L < depth; L++) {
            if (L) h += '</tr><tr>';
            if (!L && stt) h += '<th class="is-center" style="width:56px"' + (depth > 1 ? ' rowspan="' + depth + '"' : '') + '>Stt</th>';
            for (var i = 0; i < cols.length;) {
                var g = cols[i].group || [];
                if (g.length < L) { i++; continue; }
                if (g.length === L) { h += leaf(cols[i], depth - L); i++; continue; }
                var j = i + 1;
                while (j < cols.length && cung(cols[j].group, g, L)) j++;
                h += '<th class="is-center ums-table__grp" colspan="' + (j - i) + '">' + esc(g[L]) + '</th>';
                i = j;
            }
        }
        h += '</tr></thead><tbody>';

        if (!rows.length) {
            h += '<tr><td colspan="' + span + '" style="padding:0">' + ui.empty(cfg.empty) + '</td></tr>';
        } else {
            var start = cfg.page ? ((cfg.page.index || 1) - 1) * (cfg.page.size || rows.length) : 0;
            rows.forEach(function (row, i) {
                // cfg.rowCls(row) → lớp của <tr> (vd tô nền dòng theo mức rủi ro)
                var rc = cfg.rowCls ? cfg.rowCls(row, i) : '';
                h += '<tr' + (row.ID ? ' data-id="' + esc(row.ID) + '"' : '') + (rc ? ' class="' + esc(rc) + '"' : '') + '>';
                if (stt) h += '<td class="is-center">' + (start + i + 1) + '</td>';
                cols.forEach(function (c) {
                    // Ô không có hàm render riêng: cho phép đúng thẻ <br> trong dữ liệu
                    var v = c.render ? c.render(row, i) : ui.escBr(row[c.prop]);
                    h += '<td class="' + esc(c.cls || '') + '"' + goc(c) + '>' + (v === undefined ? '' : v) + '</td>';
                });
                h += '</tr>';
            });
        }
        h += '</tbody>';

        /* Dòng tổng — thay edu.system.insertSumAfterTable. Cột nào có
           `sum: true` thì cộng số của `sumProp || prop` trên các dòng đang
           hiện (đúng như bản gốc cộng trên <tbody>). `sum` là hàm thì tự
           tính: sum(rows) → chuỗi HTML. `sumAll` = mảng dòng để cộng thay
           cho các dòng đang hiện (khi bảng phân trang ở máy khách). */
        var hasSum = cols.some(function (c) { return c.sum; });
        if (hasSum && rows.length) {
            var base = cfg.sumAll || rows;
            h += '<tfoot><tr class="ums-table__sum">';
            if (stt) h += '<td class="is-center"><b>Tổng</b></td>';
            cols.forEach(function (c, ci) {
                var v = '';
                if (typeof c.sum === 'function') v = c.sum(base);
                else if (c.sum) {
                    var key = c.sumProp || c.prop;
                    var t = base.reduce(function (a, r) {
                        var n = Number(String(r[key] === null || r[key] === undefined ? '' : r[key]).replace(/[^\d.-]/g, ''));
                        return a + (isNaN(n) ? 0 : n);
                    }, 0);
                    v = '<b>' + ui.money(t) + '</b>';
                } else if (!stt && ci === 0) v = '<b>Tổng</b>';
                h += '<td class="' + esc(c.cls || '') + '"' + goc(c) + '>' + v + '</td>';
            });
            h += '</tr></tfoot>';
        }

        h += '</table></div>';

        if (cfg.page) h += ui.pager(cfg.page, rows.length);

        host.innerHTML = h;

        ui.pagerBind(host, cfg.page);
    };

    /* Các ô của một dòng theo thứ tự cột GỐC: các ô đã dời xuống cuối bảng (ô chọn dòng, Thao tác —
       data-cot-goc) được đặt lại về vị trí màn khai. Dùng ở nơi đọc ô theo chỉ số. */
    ui.oTheoGoc = function (row) {
        var o = [], doi = [];
        Array.prototype.forEach.call(row.cells, function (c) {
            var g = c.getAttribute('data-cot-goc');
            if (g === null) o.push(c); else doi.push([Number(g), c]);
        });
        doi.sort(function (a, b) { return a[0] - b[0]; }).forEach(function (d) { o.splice(d[0], 0, d[1]); });
        return o;
    };

    /* Gắn sự kiện cho thanh phân trang vừa vẽ — số trang (data-go) và số dòng
       mỗi trang (data-size). Mọi nơi vẽ ums.ui.pager đều gọi hàm này để không
       chỗ nào quên gắn một trong hai. */
    ui.pagerBind = function (host, page) {
        if (!host || !page) return;
        if (page.onChange) {
            host.querySelectorAll('.ums-pager__btn[data-go]').forEach(function (b) {
                b.addEventListener('click', function () { page.onChange(Number(b.getAttribute('data-go'))); });
            });
        }
        if (page.onSize) {
            host.querySelectorAll('select[data-size]').forEach(function (b) {
                b.addEventListener('change', function () {
                    var v = Number(b.value);
                    if (v && v !== (page.size || 10)) page.onSize(v);
                });
            });
        }
    };

    /* pageSize cho mục "Tất cả" — hệ cũ gửi 100000 (Core:1748), có màn gửi -1.
       Chọn một triệu cho mọi màn để còn so sánh được bằng số. */
    ui.PAGE_ALL = 1000000;

    /* Danh sách mặc định của ô "Hiển thị" — đúng bốn mục của hệ cũ
       (Core/systemroot.js:1744) cộng "Tất cả". Màn nào muốn danh sách khác
       thì truyền page.sizes; cỡ trang đang dùng luôn được chèn thêm vào. */
    ui.PAGE_SIZES = [10, 15, 25, 50, 'all'];

    ui.pager = function (page, shown) {
        var size = page.size || 10;
        var total = page.total !== undefined ? page.total : shown;
        var index = page.index || 1;
        var pages = Math.max(1, Math.ceil(total / size));
        var from = total ? (index - 1) * size + 1 : 0;
        var to = Math.min(index * size, total);

        /* Số dòng mỗi trang — đúng khuôn bản gốc: chữ "Hiển thị" rồi ô chọn,
           nằm ở đầu thanh phân trang (beginLoadPag, Core/systemroot.js:1739).
           Ô này đánh dấu data-no-s2 — KHÔNG bọc select2 (chỉ vài mục số, không
           cần tìm kiếm, lại nằm trong vùng hay vẽ lại) nhưng được vẽ cho GIỐNG
           HỆT select2 ở components/field.css, nhìn không phân biệt được.

           MẶC ĐỊNH CÓ Ở MỌI THANH PHÂN TRANG — không phải mỗi màn tự dựng.
             page.onSize(v)  bắt buộc — không có thì ẩn ô (không ai nhận thay đổi)
             page.sizes      danh sách riêng; đặt false để ẩn hẳn
           Ẩn tự động khi tổng số dòng ≤ mục nhỏ nhất: màn ít bản ghi thì chọn cỡ
           trang không có tác dụng gì. */
        var sizes = page.sizes === undefined ? ui.PAGE_SIZES : page.sizes;
        var oSize = '';
        if (sizes && sizes.length && page.onSize) {
            var ds = sizes.map(function (x) { return x === 'all' ? ui.PAGE_ALL : Number(x); });
            /* Cỡ trang đang dùng mà không có trong danh sách thì chèn vào đúng chỗ,
               không thì ô hiện một đằng danh sách đang xem một nẻo. */
            if (ds.indexOf(size) < 0) { ds.push(size); ds.sort(function (a, b) { return a - b; }); }
            var nho = Math.min.apply(null, ds);
            if (total > nho) {
                oSize = '<span class="ums-pager__size"><span class="ums-pager__sizelb">Hiển thị</span>' +
                    '<select class="ums-select ums-input--sm ums-pager__sizesel" data-no-s2 data-size ' +
                    'aria-label="Số dòng mỗi trang">';
                ds.forEach(function (v) {
                    oSize += '<option value="' + v + '"' + (v === size ? ' selected' : '') + '>' +
                        (v >= ui.PAGE_ALL ? 'Tất cả' : v) + '</option>';
                });
                oSize += '</select></span>';
            }
        }

        /* Có ô "Hiển thị" rồi thì dòng đếm bỏ chữ "Hiển thị" để không nói hai lần */
        var h = '<div class="ums-pager">' + oSize +
            '<span class="ums-pager__info">' + (oSize ? '' : 'Hiển thị ') + '<b>' + from +
            '</b>–<b>' + to + '</b> trong <b>' + total + '</b> dữ liệu</span>';

        h += '<span class="ums-pager__list">';

        h += '<button type="button" class="ums-pager__btn" data-go="' + (index - 1) + '"' +
            (index <= 1 ? ' disabled' : '') + '><i class="fa-light fa-angle-left"></i></button>';

        /* Cửa sổ số trang: luôn có trang đầu, trang cuối và trang đang xem ±1,
           chèn "…" ở MỌI chỗ đứt quãng. Bản trước luôn vẽ 1 2 3 nên ở giữa
           danh sách dài ra 11 nút (đo được 412px) — tràn cột trái 320px của
           ums.pat.master — và chỉ chèn "…" một lần nên bên phải mất dấu đứt. */
        var show = {};
        show[1] = show[pages] = true;
        for (var k = index - 1; k <= index + 1; k++) if (k >= 1 && k <= pages) show[k] = true;

        var truoc = 0;
        for (var p = 1; p <= pages; p++) {
            if (pages > 7 && !show[p]) continue;
            if (truoc && p - truoc > 1) h += '<button type="button" class="ums-pager__btn" disabled>…</button>';
            h += '<button type="button" class="ums-pager__btn' + (p === index ? ' is-active' : '') +
                '" data-go="' + p + '">' + p + '</button>';
            truoc = p;
        }

        h += '<button type="button" class="ums-pager__btn" data-go="' + (index + 1) + '"' +
            (index >= pages ? ' disabled' : '') + '><i class="fa-light fa-angle-right"></i></button>';

        return h + '</span></div>';
    };

    /* ---------- Biểu mẫu --------------------------------------------------- */
    ui.options = function (data, cfg) {
        cfg = cfg || {};
        var id = cfg.id || 'ID', name = cfg.name || 'TEN';
        var h = cfg.title === false ? '' : '<option value="">' + esc(cfg.title || '-- Tất cả --') + '</option>';
        (data || []).forEach(function (d) {
            h += '<option value="' + esc(d[id]) + '">' + esc(d[name]) + '</option>';
        });
        return h;
    };

    /* ---------- Ô lọc: nhãn nằm TRONG ô -------------------------------------
       Ở thanh lọc, nhãn riêng chiếm chỗ mà không thêm thông tin gì — tên
       trường đã nằm sẵn trong chữ mờ của ô. Hai hàm dưới dựng ô lọc không
       nhãn, nhãn thành chữ gợi ý bên trong.

           ums.ui.filterSelect('Chọn tình trạng', DATA, { id: 'fTT' })
           ums.ui.filterInput('Nhập mã hoặc tên kế hoạch', { id: 'fKey' })

       Muốn quay lại kiểu có nhãn ngoài: đặt
       behavior.filterLabelInside = false trong site.config.js               */
    function labelOutside() {
        var b = (global.ums && ums.cfg && ums.cfg.behavior) || {};
        return b.filterLabelInside === false;
    }

    function attrs(o) {
        return Object.keys(o || {}).map(function (k) {
            return ' ' + k + '="' + esc(o[k]) + '"';
        }).join('');
    }

    ui.filterInput = function (label, opts) {
        opts = opts || {};
        var a = { 'class': 'ums-input', placeholder: labelOutside() ? (opts.placeholder || '') : label };
        if (opts.id) a.id = opts.id;
        if (opts.value !== undefined) a.value = opts.value;
        if (opts.type) a.type = opts.type;
        var html = '<input' + attrs(a) + '>';
        return labelOutside() ? ui.field(label, html) : '<div class="ums-field">' + html + '</div>';
    };

    ui.filterSelect = function (label, data, opts) {
        opts = opts || {};
        var a = { 'class': 'ums-select' };
        if (opts.id) a.id = opts.id;
        // Mục đầu của select đóng vai trò chữ gợi ý
        var head = labelOutside() ? (opts.title || '-- Tất cả --') : label;
        var html = '<select' + attrs(a) + '>' +
            ui.options(data, { title: head, id: opts.idField, name: opts.nameField }) + '</select>';
        return labelOutside() ? ui.field(label, html) : '<div class="ums-field">' + html + '</div>';
    };

    ui.field = function (label, control, opts) {
        opts = opts || {};
        var cls = 'ums-field' + (opts.inline ? ' ums-field--inline' : '');
        var style = opts.labelWidth ? ' style="--ums-label-w:' + esc(opts.labelWidth) + '"' : '';
        return '<div class="' + cls + '"' + style + '>' +
            '<label class="ums-field__label">' + esc(label) +
            (opts.required ? '<i class="ums-field__req">*</i>' : '') + '</label>' +
            '<div class="ums-field__control">' + control +
            (opts.hint ? '<div class="ums-field__hint">' + esc(opts.hint) + '</div>' : '') +
            '</div></div>';
    };

    /* ---------- Thông báo nổi ----------------------------------------------
       Thay cho `edu.system.alert` của hệ cũ: không chặn thao tác, tự biến mất,
       nhiều thông báo xếp chồng được.                                        */
    var TOAST = {
        ok:   { icon: 'fa-light fa-circle-check',        title: 'Thành công' },
        warn: { icon: 'fa-light fa-triangle-exclamation', title: 'Lưu ý' },
        bad:  { icon: 'fa-light fa-circle-xmark',        title: 'Có lỗi' },
        info: { icon: 'fa-light fa-circle-info',         title: 'Thông báo' }
    };

    var toastBox = null;

    /** Hộp thoại sắp bị gỡ: trả hộp thông báo về <body>, không thì thông báo
        đang hiện sẽ biến mất theo hộp thoại. Không dựa vào sự kiện "close" —
        hộp thoại bị gỡ khỏi DOM ngay sau d.close() nên sự kiện đó không chạy. */
    function releaseToasts(d) {
        if (toastBox && d && d.contains(toastBox)) document.body.appendChild(toastBox);
    }

    /** Hộp thoại đang mở ở trên cùng (mở sau thì nằm trên) */
    function topDialog() {
        var ds = document.querySelectorAll('dialog[open]');
        return ds.length ? ds[ds.length - 1] : null;
    }

    ui.toast = function (msg, tone, opts) {
        opts = opts || {};
        var t = TOAST[tone] || TOAST.info;

        if (!toastBox) {
            toastBox = document.createElement('div');
            toastBox.className = 'ums-toasts';
            document.body.appendChild(toastBox);
        }
        /* Hộp thoại mở bằng <dialog>.showModal() nằm ở LỚP TRÊN CÙNG: lớp này
           ở trên MỌI z-index (tăng z-index vô ích), và nó làm phần còn lại của
           trang thành trơ (inert) — thông báo để ở <body> thì vừa bị lớp phủ
           che, vừa không bấm được nút đóng. Nên khi đang có hộp thoại thì gắn
           hộp thông báo vào CHÍNH hộp thoại đó; đóng hộp thoại thì trả về
           <body>. Hộp vẫn position:fixed nên chỗ đứng không đổi. */
        var hostMoi = topDialog() || document.body;
        if (toastBox.parentNode !== hostMoi) {
            hostMoi.appendChild(toastBox);
        }

        var el = document.createElement('div');
        el.className = 'ums-toast ums-toast--' + (TOAST[tone] ? tone : 'info');
        el.innerHTML =
            '<span class="ums-toast__icon"><i class="' + t.icon + '"></i></span>' +
            '<span class="ums-toast__body">' +
            '<span class="ums-toast__title">' + esc(opts.title || t.title) + '</span>' +
            '<div class="ums-toast__msg">' + esc(msg) + '</div>' +
            '</span>' +
            '<button type="button" class="ums-toast__close"><i class="fa-light fa-xmark"></i></button>';

        toastBox.appendChild(el);

        function close() {
            el.classList.add('is-out');
            setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 200);
        }

        el.querySelector('.ums-toast__close').addEventListener('click', close);
        /* Thời gian hiện (người dùng 2026-09-30: "lâu hơn chút, đủ thời gian đọc"): mức nền theo loại + thêm theo ĐỘ DÀI câu
           (câu dài đọc lâu hơn), trần 20 giây. Rê chuột vào thì DỪNG đếm, rời chuột đếm lại từ đầu. Mức nền đổi ở
           site.config.js → behavior.toastMs. Màn truyền opts.timeout thì theo màn (0 = không tự đóng). */
        if (opts.timeout !== 0) {
            var nen = (ums.cfg && ums.cfg.behavior && ums.cfg.behavior.toastMs) || {};
            var ms = opts.timeout || Math.min(20000,
                (nen[tone] || nen.info || { ok: 6000, info: 6000, warn: 9000, bad: 12000 }[tone] || 6000) + Math.max(0, String(msg || '').length - 60) * 60);
            var hen = setTimeout(close, ms);
            el.addEventListener('mouseenter', function () { clearTimeout(hen); });
            el.addEventListener('mouseleave', function () { hen = setTimeout(close, ms); });
        }

        return close;
    };

    /* ---------- Hộp xác nhận ------------------------------------------------
       Thay cho edu.system.confirm + $("#btnYes").click(...) của hệ cũ — cách
       cũ gắn thêm một trình xử lý mỗi lần mở hộp, bấm lần thứ ba là xoá ba
       lần. Ở đây trả Promise<boolean>, mỗi lần mở là một hộp mới.

           ums.ui.confirm('Xoá 3 dòng đã chọn?', { tone: 'bad', ok: 'Xoá' })
               .then(function (yes) { if (yes) … });                        */
    ui.confirm = function (msg, opts) {
        opts = opts || {};
        return new Promise(function (resolve) {
            var d = document.createElement('dialog');
            d.className = 'ums-dialog' + (opts.tone === 'bad' ? ' ums-dialog--bad' : '');
            d.innerHTML =
                '<div class="ums-dialog__body">' +
                '<span class="ums-dialog__icon"><i class="fa-light ' +
                    (opts.tone === 'bad' ? 'fa-trash-can' : 'fa-circle-question') + '"></i></span>' +
                '<div><div class="ums-dialog__title">' + esc(opts.title || 'Xác nhận') + '</div>' +
                '<div class="ums-dialog__msg">' + esc(msg) + '</div></div></div>' +
                '<div class="ums-dialog__foot">' +
                '<button type="button" class="ums-btn ums-btn--ghost" value="0">' +
                    '<span>' + esc(opts.cancel || 'Huỷ') + '</span></button>' +
                '<button type="button" class="ums-btn ums-btn--' + (opts.tone === 'bad' ? 'danger' : 'primary') + '" value="1">' +
                    '<span>' + esc(opts.ok || 'Đồng ý') + '</span></button></div>';
            document.body.appendChild(d);

            var done = false;
            function close(v) {
                if (done) return;
                done = true;
                releaseToasts(d);
                try { d.close(); } catch (e) {}
                if (d.parentNode) d.parentNode.removeChild(d);
                resolve(v);
            }
            d.addEventListener('click', function (e) {
                var b = e.target.closest('button[value]');
                if (b) close(b.value === '1');
                else if (e.target === d) close(false);      // bấm ra nền
            });
            d.addEventListener('cancel', function (e) { e.preventDefault(); close(false); });

            if (d.showModal) d.showModal(); else d.setAttribute('open', '');
            var ok = d.querySelector('button[value="1"]');
            if (ok) ok.focus();
        });
    };

    /* ---------- Hộp thoại nội dung ----------------------------------------
       Thay các modal Bootstrap của hệ cũ ($('#myModal').modal('show')).

           var dlg = ums.ui.dialog({
               title: 'Kế hoạch xuất hoá đơn', icon: 'fa-file-invoice',
               size: 'lg',                     // sm | md (mặc định) | lg | xl
               body: '<div id="x"></div>',     // chuỗi HTML hoặc phần tử
               buttons: [{ text: 'Lưu', kind: 'save', onClick: function (dlg) { … } }],
               onClose: function () { … }
           });
           dlg.body   → phần tử thân hộp, để gắn nội dung/sự kiện
           dlg.close()

       Nút có sẵn "Đóng". onClick trả false thì hộp KHÔNG tự đóng.          */
    /* ---------- Nút "Xoá đã chọn" cho mọi chỗ xoá NHIỀU dòng ------------------
       Cùng vẻ với nút của ums.crud (.ums-btn--delsel): chưa chọn gì thì mờ và
       khoá; có dòng được đánh dấu thì viền đỏ + chữ "Xoá N dòng đã chọn".
       Nút tự đếm — màn không phải gắn gì:

           ums.ui.xoaChon('input[data-ck]', { attr: { 'data-a': 'xoa' } })

       chon  bộ chọn các ô đánh dấu dòng (ô trong <thead> — "chọn tất cả" — không tính)
       o.goc    bộ chọn KHUNG chứa gần nhất làm gốc đếm (vd '.ums-panel' khi nút nằm ở
                đầu một khung có bảng riêng)
       o.trong  bộ chọn vùng chứa bảng (tìm từ gốc) khi một gốc có nhiều bảng cùng kiểu ô
       o.text   chữ nút (mặc định "Xoá đã chọn"; có số thì "<text> (N)")
       Gốc đếm = hộp thoại chứa nút, không thì phần tử gần nhất có id (gốc màn).
       Xoá MỘT dòng (thùng rác trên dòng, Xoá trong biểu mẫu) giữ nút đỏ thường. */
    ui.xoaChon = function (chon, o) {
        o = o || {};
        var a = '';
        Object.keys(o.attr || {}).forEach(function (k) { a += ' ' + k + '="' + esc(o.attr[k]) + '"'; });
        return '<button type="button" class="ums-btn ums-btn--delsel' + (o.sm ? ' ums-btn--sm' : '') + '" data-xoachon="' + esc(chon) + '"' +
            (o.trong ? ' data-xoachon-trong="' + esc(o.trong) + '"' : '') + (o.goc ? ' data-xoachon-goc="' + esc(o.goc) + '"' : '') + (o.text ? ' data-xoachon-text="' + esc(o.text) + '"' : '') + a + ' disabled>' +
            '<i class="fa-light fa-trash-can"></i><span>' + esc(o.text || 'Xoá đã chọn') + '</span></button>';
    };
    function demXoaChon() {
        qa(document, '[data-xoachon]').forEach(function (b) {
            var gs = b.getAttribute('data-xoachon-goc');
            var goc = (gs && b.closest(gs)) || b.closest('dialog') || (b.parentNode && b.parentNode.closest('[id]')) || document;
            var trong = b.getAttribute('data-xoachon-trong');
            var vung = trong ? goc.querySelector(trong) : goc;
            // Bỏ ô "chọn tất cả" ở thead và ô của nhóm lọc ums.pat.checks (data-pchecks — trạng thái SV… đánh dấu
            // sẵn khi mở màn, cùng thuộc tính data-ck): tính vào thì nút xoá đỏ sẵn dù chưa chọn dòng nào.
            var o = vung ? qa(vung, b.getAttribute('data-xoachon')).filter(function (x) { return !x.closest('thead') && !x.closest('[data-pchecks]'); }) : [];
            // Dòng đang chọn tô sáng như bảng của ums.crud (tr.is-selected)
            o.forEach(function (x) { var tr = x.closest('tr'); if (tr && tr.classList.contains('is-selected') !== x.checked) tr.classList.toggle('is-selected', x.checked); });
            var n = o.filter(function (x) { return x.checked; }).length;
            var t = b.getAttribute('data-xoachon-text');
            var nhan = t ? (n ? t + ' (' + n + ')' : t) : (n ? 'Xoá ' + n + ' dòng đã chọn' : 'Xoá đã chọn');
            if (b.disabled !== !n) b.disabled = !n;
            var sp = b.querySelector('span');
            if (sp && sp.textContent !== nhan) sp.textContent = nhan;
        });
    }
    /* ---------- Ô "chọn tất cả" ở tiêu đề bảng theo ô con ------------------
       Mọi màn tự viết chiều CHA → CON (bấm ô tiêu đề thì đánh dấu cả cột); chiều
       CON → CHA thì hầu như không màn nào có: bỏ một ô con mà ô tiêu đề vẫn đánh dấu
       (người dùng bắt được 2026-09-25). Ở đây làm chung cho mọi bảng: ô con trong
       <tbody> đổi thì mỗi ô đánh dấu trong <thead> = "mọi ô con ĐANG BẬT (không
       disabled) cùng CỘT đều đã đánh dấu". Cột xác định theo VỊ TRÍ trên màn hình
       (giữa ô tiêu đề nằm trong ô thân) nên đúng cả với tiêu đề gộp nhiều tầng.
       Màn cần tự lo (vd chọn cả DÒNG) thì vẫn tự đồng bộ thêm — hàm này không đụng
       ô ngoài <thead>. Gọi tay: ums.ui.dongBoChon(table). */
    function dongBoChon(table) {
        if (!table || !table.tHead) return;
        var tieuDe = qa(table.tHead, 'input[type="checkbox"]');
        if (!tieuDe.length) return;
        var con = [];
        Array.prototype.forEach.call(table.tBodies, function (tb) { con = con.concat(qa(tb, 'input[type="checkbox"]')); });
        tieuDe.forEach(function (h) {
            var th = h.closest('th, td'); if (!th) return;
            var r = th.getBoundingClientRect(); if (!r.width) return;
            var x = (r.left + r.right) / 2;
            var cot = con.filter(function (c) {
                if (c.disabled) return false;
                var td = c.closest('td, th'), q = td ? td.getBoundingClientRect() : null;
                return q && q.width && x >= q.left && x <= q.right;
            });
            if (cot.length) h.checked = cot.every(function (c) { return c.checked; });
        });
    }
    ui.dongBoChon = dongBoChon;
    document.addEventListener('change', function (ev) {
        var t = ev.target;
        if (!t || t.type !== 'checkbox' || !t.closest || !t.closest('tbody')) return;
        var tb = t.closest('table');
        // sau các trình xử lý của màn (có màn đổi thêm ô khác trong cùng sự kiện)
        if (tb) setTimeout(function () { dongBoChon(tb); }, 0);
    });

    var hen = 0;
    function henDem() { clearTimeout(hen); hen = setTimeout(demXoaChon, 30); }
    ui.demXoaChon = demXoaChon;
    // Ô "chọn tất cả" của các màn đặt .checked bằng mã (không bắn change) → nghe cả click;
    // bảng vẽ lại (bỏ chọn) → nghe thay đổi cây DOM.
    document.addEventListener('change', henDem, true);
    document.addEventListener('click', henDem, true);
    if (global.MutationObserver) {
        var gan = function () { new MutationObserver(henDem).observe(document.body, { childList: true, subtree: true }); };
        if (document.body) gan(); else document.addEventListener('DOMContentLoaded', gan);
    }

    ui.dialog = function (o) {
        o = o || {};
        var d = document.createElement('dialog');
        d.className = 'ums-dialog ums-dialog--content ums-dialog--' + (o.size || 'md');
        d.innerHTML =
            '<div class="ums-dialog__head">' +
            '<div class="ums-dialog__title">' + (o.icon ? '<i class="fa-light ' + esc(o.icon) + '"></i> ' : '') + esc(o.title || '') + '</div>' +
            '<button type="button" class="ums-iconbtn" data-dlg="x" title="Đóng"><i class="fa-light fa-xmark"></i></button></div>' +
            '<div class="ums-dialog__content"></div>' +
            '<div class="ums-dialog__foot">' +
            // o.xoa = { chon, trong, text, onClick(api) } — nút "Xoá đã chọn" ở CHÂN hộp, dạt trái
            (o.xoa ? ui.xoaChon(o.xoa.chon, { trong: o.xoa.trong, text: o.xoa.text, attr: { 'data-dlg': 'xoa' } }) : '') +
            ui.btn('close', { attr: { 'data-dlg': 'x' } }) +
            (o.buttons || []).map(function (b, i) {
                // b.icon: giữ đúng biểu tượng của nút bản gốc (vd "Xét" dùng fa-ballot-check)
                return ui.btn(b.kind || 'save', { text: b.text, mod: b.mod, icon: b.icon, attr: { 'data-dlg': String(i) } });
            }).join('') + '</div>';

        var body = d.querySelector('.ums-dialog__content');
        if (typeof o.body === 'string') body.innerHTML = o.body;
        else if (o.body) body.appendChild(o.body);
        document.body.appendChild(d);

        var api = { el: d, body: body, closed: false };
        api.close = function () {
            if (api.closed) return;
            api.closed = true;
            releaseToasts(d);
            try { d.close(); } catch (e) {}
            if (d.parentNode) d.parentNode.removeChild(d);
            if (o.onClose) o.onClose();
        };

        d.addEventListener('click', function (e) {
            var b = e.target.closest('[data-dlg]');
            if (!b || !d.contains(b)) return;
            var k = b.getAttribute('data-dlg');
            if (k === 'x') return api.close();
            if (k === 'xoa') { if (o.xoa && o.xoa.onClick) o.xoa.onClick(api); return; }
            var def = (o.buttons || [])[Number(k)];
            if (def && def.onClick && def.onClick(api) === false) return;
            if (def && def.keepOpen) return;
            api.close();
        });
        d.addEventListener('cancel', function (e) { e.preventDefault(); api.close(); });

        if (d.showModal) d.showModal(); else d.setAttribute('open', '');
        return api;
    };

    /* ---------- Chạy hàng loạt kèm tiến độ -----------------------------------
       Thay cặp edu.system.genHTML_Progress(zone, n) + start_Progress(zone, cb)
       của hệ cũ (hệ cũ bắn n request cùng lúc rồi đếm complete). Ở đây chạy
       tuần tự (hoặc `concurrency` luồng), hiện hộp tiến độ, cuối cùng báo gộp.

           ums.ui.batch(calls, { title: 'Đang lưu hệ số' })
               .then(function (r) { r.ok, r.fail, r.errors; me.reload(); });

       `calls` là mảng tham số cho ums.api.call, hoặc mảng hàm trả Promise.
       Không bao giờ reject — lỗi từng lời gọi nằm trong r.errors. Hết phiên
       (401) thì dừng và đăng xuất như ums.api.handle.                        */
    ui.batch = function (calls, opts) {
        opts = opts || {};
        var total = calls.length;
        var ok = 0, failed = 0, errors = [], results = [];
        if (!total) return Promise.resolve({ ok: 0, fail: 0, errors: [], results: [] });

        var box = null, bar = null, lbl = null;
        if (total > 1 || opts.show) {
            box = ui.dialog({
                title: opts.title || 'Đang xử lý', icon: 'fa-spinner fa-spin', size: 'sm',
                body: '<div class="ums-u-fz13 ums-u-muted ums-u-mb-2" data-b="lbl">0 / ' + total + '</div>' +
                      '<div class="ums-meter"><div class="ums-meter__track"><div class="ums-meter__fill" data-b="bar" style="width:0"></div></div></div>'
            });
            bar = box.body.querySelector('[data-b="bar"]');
            lbl = box.body.querySelector('[data-b="lbl"]');
        }

        var idx = 0, stop = false, done = 0;
        var conc = Math.max(1, opts.concurrency || 1);

        function tick() {
            done++;
            if (bar) bar.style.width = Math.round(done / total * 100) + '%';
            if (lbl) lbl.textContent = done + ' / ' + total + (failed ? ' — ' + failed + ' lỗi' : '');
        }

        function worker() {
            if (stop || idx >= total) return Promise.resolve();
            var i = idx++;
            var c = calls[i];
            var p = typeof c === 'function' ? c() : ums.api.call(c);
            return Promise.resolve(p).then(function (r) { ok++; results[i] = r; }, function (e) {
                failed++; errors.push(e && e.message ? e.message : String(e));
                if (e && e.expired) { stop = true; if (ums.api) ums.api.handle(e); }
            }).then(function () { tick(); return worker(); });
        }

        var pool = [];
        for (var k = 0; k < conc; k++) pool.push(worker());

        return Promise.all(pool).then(function () {
            if (box) box.close();
            if (opts.toast !== false) {
                if (ok) ui.toast((opts.okText || 'Hoàn thành') + ' ' + ok + '/' + total, failed ? 'warn' : 'ok');
                if (failed) ui.toast(errors[0] + (failed > 1 ? ' (và ' + (failed - 1) + ' lỗi khác)' : ''), 'bad');
            }
            return { ok: ok, fail: failed, errors: errors, results: results };
        });
    };

    /* ---------- In ----------------------------------------------------------
       Thay edu.util.printHTML(divId) (Core/util.js:40): mở cửa sổ mới chỉ
       chứa nội dung cần in. Nhận id, phần tử, hoặc chuỗi HTML.
       `css` thêm kiểu riêng cho bản in (mẫu phiếu thu, hoá đơn…).          */
    ui.print = function (what, opts) {
        opts = opts || {};
        var html = what;
        if (typeof what === 'string' && document.getElementById(what)) html = document.getElementById(what).innerHTML;
        else if (what && what.nodeType === 1) html = what.innerHTML;

        var w = global.open('', 'Print', 'height=700,width=900');
        if (!w) { ui.toast('Trình duyệt chặn cửa sổ in — hãy cho phép cửa sổ bật lên.', 'warn'); return false; }
        // cssHref: một hoặc nhiều tệp .css (đường dẫn tương đối tính theo trang hiện tại)
        var hrefs = [].concat(opts.cssHref || []).map(function (h) { return new URL(h, location.href).href; });
        w.document.write('<html><head><meta charset="utf-8"><title>' + esc(opts.title || 'In') + '</title>' +
            hrefs.map(function (h) { return '<link rel="stylesheet" href="' + esc(h) + '">'; }).join('') +
            '<style>@media print{@page{margin:0}body{margin:1.0cm}} body{font-family:"Times New Roman",serif}' +
            (opts.css || '') + '</style></head><body>' + html + '</body></html>');
        w.document.close();
        w.focus();
        // Chờ tệp CSS về rồi mới in, không thì bản in mất kiểu
        var fired = false;
        function go() { if (fired) return; fired = true; w.print(); }
        if (hrefs.length) { w.onload = go; setTimeout(go, 1500); } else setTimeout(go, 250);
        return true;
    };

    /** Khối báo lỗi đặt trong vùng nội dung, kèm nút thử lại */
    ui.fail = function (msg, retryAttr) {
        return '<div class="ums-fail">' +
            '<i class="fa-light fa-triangle-exclamation"></i>' +
            '<div>Không tải được dữ liệu</div>' +
            '<div class="ums-fail__msg">' + esc(msg) + '</div>' +
            (retryAttr ? '<button type="button" class="ums-btn ums-btn--ghost" ' + retryAttr + '>' +
                '<i class="fa-light fa-rotate-right"></i><span>Thử lại</span></button>' : '') +
            '</div>';
    };

    /* ---------- Gắn thư viện ngoài ----------------------------------------- */
    ui.datepicker = function (sel, opts) {
        if (typeof flatpickr === 'undefined') return;
        var cfg = {
            dateFormat: 'd/m/Y',
            allowInput: true,
            locale: (flatpickr.l10ns && flatpickr.l10ns.vn) ? flatpickr.l10ns.vn : 'default'
        };
        /* Trong <dialog>: lịch gắn vào <body> thì bị hộp thoại che (lớp trên
           cùng), còn gắn vào hộp thoại bằng appendTo thì flatpickr tính toạ độ
           theo vị trí của ô trên TRANG, trong khi hộp thoại lại là position:
           fixed — lịch bung ra lệch hẳn và tràn khỏi đáy màn (đo được: ô ngày
           ở 427,554 mà lịch mở ở 826,801). Dùng static: true — flatpickr bọc
           ô lại và đặt lịch ngay dưới ô, không tính toạ độ nữa. */
        var elx = typeof sel === 'string' ? document.querySelector(sel) : sel;

        /* BIỂU TƯỢNG LỊCH — gắn Ở ĐÂY, màn hình không phải tự vẽ.
           Trước đây phải tự bọc <div class="ums-inputwrap"> kèm thẻ <i>, nên chỗ nhớ
           chỗ quên — cùng một hệ mà ô ngày chỗ có biểu tượng chỗ không. Bọc trước
           khi tạo flatpickr: bản static:true của flatpickr sẽ bọc thêm .flatpickr-wrapper
           BÊN TRONG lớp bọc này, biểu tượng vẫn nằm đúng chỗ. */
        if (elx && elx.parentNode && !elx.closest('.ums-inputwrap') && !elx.closest('.flatpickr-wrapper')) {
            var boc = document.createElement('div');
            boc.className = 'ums-inputwrap';
            elx.parentNode.insertBefore(boc, elx);
            boc.appendChild(elx);
            boc.insertAdjacentHTML('beforeend', '<i class="fa-light fa-calendar"></i>');
            if (sel === elx || typeof sel !== 'string') sel = elx;
        }

        var dlg = elx && elx.closest ? elx.closest('dialog') : null;
        if (dlg && cfg.static === undefined && !cfg.appendTo) cfg.static = true;
        Object.keys(opts || {}).forEach(function (k) { cfg[k] = opts[k]; });

        /* Lịch đặt ngay dưới ô (static) nên nằm TRONG vùng nội dung hộp thoại,
           mà vùng đó có thanh cuộn riêng — lịch dài hơn chỗ còn lại thì bị cắt
           mất phần dưới (đo được: cắt 253px). Mở xong thì cuộn vừa đủ để thấy
           trọn lịch. block:"nearest" nên chỉ cuộn khi thật sự thiếu chỗ. */
        var onOpenCu = cfg.onOpen;
        cfg.onOpen = function (dates, str, fp) {
            if (typeof onOpenCu === 'function') onOpenCu(dates, str, fp);
            else if (Array.isArray(onOpenCu)) onOpenCu.forEach(function (f) { f(dates, str, fp); });
            if (!fp || !fp.calendarContainer || !fp.calendarContainer.scrollIntoView) return;
            setTimeout(function () {
                try { fp.calendarContainer.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (e) {}
            }, 0);
        };

        return flatpickr(sel, cfg);
    };

    /* Ô chọn nhiều của select2 mặc định KHÔNG có ô tìm trong danh sách xổ
       xuống — nó chỉ cho gõ nội tuyến trong ô. Hàm dưới ghép thêm bộ tìm
       kiếm vào danh sách xổ xuống bằng đúng các adapter sẵn có của select2. */
    var dropSearchAdapter = null;

    function makeDropSearchAdapter() {
        if (dropSearchAdapter !== null) return dropSearchAdapter;
        dropSearchAdapter = false;
        try {
            var amd = jQuery.fn.select2.amd;
            var Utils = amd.require('select2/utils');
            var Dropdown = amd.require('select2/dropdown');
            var Search = amd.require('select2/dropdown/search');
            var AttachBody = amd.require('select2/dropdown/attachBody');
            dropSearchAdapter = Utils.Decorate(Utils.Decorate(Dropdown, Search), AttachBody);
        } catch (e) {
            dropSearchAdapter = false;   // bản select2 không có amd thì bỏ qua
        }
        return dropSearchAdapter;
    }

    /* ---------- Ô CHỌN — MỘT KIỂU DUY NHẤT CHO CẢ HỆ -------------------------
       Mọi <select> trong vùng màn hình đều đi qua đây. Màn hình KHÔNG được
       để ô chọn trần (ô chọn gốc của trình duyệt trông khác hẳn select2 —
       nhìn ra thành "hai kiểu ô chọn").

       Không cần gọi tay: `ui.enhance` chạy tự động cho mọi ô chọn mới xuất
       hiện trong `#screen` và trong hộp thoại. Muốn giữ ô chọn gốc thì đánh
       dấu `data-no-s2` trên chính thẻ <select>.

       Ô chọn NHIỀU: chọn từ 2 mục trở lên thì ô chỉ hiện MỘT dòng tóm tắt
       ("Tất cả (12)" / "3 mục đã chọn") kèm nút xoá hết, thay vì gim từng
       thẻ làm ô cao lên và vỡ hàng lọc.                                     */

    ui.select2 = function (sel, opts) {
        if (!global.jQuery || !jQuery.fn.select2) return;
        opts = opts || {};

        var $el = jQuery(sel);
        if (!$el.length) return;
        var el = $el[0];
        var isMulti = $el.prop('multiple');

        var cfg = {
            language: 'vi',
            width: '100%',
            placeholder: opts.placeholder || el.getAttribute('data-ph') ||
                (isMulti ? '-- Chọn --' : firstOptionText(el) || '-- Chọn --')
        };

        if (isMulti) {
            // Chọn nhiều thì giữ danh sách mở sau mỗi lần chọn, và gắn ô tìm
            cfg.closeOnSelect = false;
            var adapter = makeDropSearchAdapter();
            if (adapter) cfg.dropdownAdapter = adapter;
        } else {
            // Ô không bắt buộc thì cho xoá trắng; ô bắt buộc thì không
            cfg.allowClear = !el.required && !el.hasAttribute('data-required');
        }

        // Trong <dialog> danh sách xổ gắn vào body sẽ bị che — gắn vào hộp
        var dlg = $el.closest('dialog');
        if (dlg.length) cfg.dropdownParent = dlg;

        Object.keys(opts).forEach(function (k) { cfg[k] = opts[k]; });

        try { if ($el.hasClass('select2-hidden-accessible')) $el.select2('destroy'); } catch (e) {}
        var out = $el.select2(cfg);
        bridgeNative(el);

        if (isMulti) {
            var apply = function () { setTimeout(function () { summarize(el); }, 0); };
            // `ums:refresh` do ums.pat.fill bắn sau khi đổ lại danh sách
            $el.off('.umsS2').on('change.umsS2 select2:select.umsS2 select2:unselect.umsS2 ums:refresh.umsS2', apply);
            apply();
        }
        return out;
    };

    /* ---------- CẦU NỐI SỰ KIỆN CHO select2 --------------------------------
       select2 bắn 'change' bằng jQuery. jQuery.trigger KHÔNG sinh ra sự kiện
       DOM thật, nên mọi trình xử lý gắn bằng addEventListener('change') đều
       KHÔNG chạy — đo thật trên máy: native=0, jquery=1. Đây là nguyên nhân
       của loại lỗi "đổi ô chọn mà màn hình đứng im", rất khó đoán vì mã nhìn
       đúng hoàn toàn.

       Chữa một lần ở đây: mỗi lần select2 đổi giá trị thì bắn thêm một sự
       kiện change THẬT trên chính thẻ <select>. Để trình xử lý jQuery không
       chạy hai lần, đặt jQuery.event.triggered = 'change' quanh lúc bắn —
       đúng cơ chế jQuery tự dùng khi nó gọi elem[type]() (jQuery.event.add:
       eventHandle so jQuery.event.triggered !== e.type mới xử lý).

       ev.originalEvent chỉ có khi sự kiện đến từ DOM — gặp nó thì không bắn
       lại nữa. Trình xử lý đặt tên miền .umsBridge nên trigger('change.select2')
       của ums.pat.fill (đổ lại danh sách, không phải người dùng chọn) không
       đụng tới.                                                              */
    function bridgeNative(el) {
        if (!global.jQuery || el._umsBridge) return;
        el._umsBridge = true;
        jQuery(el).on('change.umsBridge', function (ev) {
            if (ev.originalEvent || el._umsFiring) return;
            el._umsFiring = true;
            var jq = jQuery.event, giu = jq.triggered;
            jq.triggered = 'change';
            try { el.dispatchEvent(new Event('change', { bubbles: true })); }
            finally { jq.triggered = giu; el._umsFiring = false; }
        });
    }

    /* Mục đầu của <select> thường là dòng gợi ý ("-- Chọn --", "Chọn khoá…").
       Lấy nó làm placeholder để select2 hiện đúng chữ màn hình đã đặt. */
    function firstOptionText(el) {
        var o = el.options && el.options[0];
        return o && o.value === '' ? o.textContent.trim() : '';
    }

    /** Gom các thẻ đã chọn thành một dòng tóm tắt */
    function summarize(el) {
        var $el = jQuery(el);
        var box = $el.next('.select2-container');
        if (!box.length) return;
        var rendered = box.find('.select2-selection__rendered')[0];
        if (!rendered) return;

        var n = el.selectedOptions ? el.selectedOptions.length : jQuery(el).val() ? jQuery(el).val().length : 0;
        var total = el.options.length;
        // Ô nạp theo trang (ajax): <option> chỉ gồm các mục ĐÃ chọn — không bao giờ là "Tất cả"
        var s2 = $el.data('select2');
        if (s2 && s2.options && s2.options.get('ajax')) total = Infinity;
        box.find('.ums-s2-chip').remove();

        if (n < 2) { box.removeClass('is-summary'); return; }

        box.addClass('is-summary');
        var text = (n >= total ? 'Tất cả' : n + ' mục đã chọn') + ' (' + n + ')';
        var li = document.createElement('li');
        li.className = 'ums-s2-chip';
        li.title = Array.prototype.map.call(el.selectedOptions, function (o) { return o.textContent; }).join(', ');
        li.innerHTML = '<span>' + esc(text) + '</span>' +
            '<button type="button" class="ums-s2-chip__x" title="Bỏ chọn tất cả">' +
            '<i class="fa-light fa-xmark"></i></button>';
        li.querySelector('.ums-s2-chip__x').addEventListener('mousedown', function (e) {
            e.preventDefault(); e.stopPropagation();
            jQuery(el).val(null).trigger('change');
        });
        rendered.insertBefore(li, rendered.firstChild);
    }

    /**
     * Gắn select2 + lịch cho mọi ô bên trong `root` chưa được gắn.
     * Gọi lại nhiều lần vô hại. Bỏ qua ô có `data-no-s2` / `data-no-fp`.
     */
    /* ---------- THẺ THÔNG TIN KHI RÊ CHUỘT --------------------------------
       Hệ cũ dùng popover của Bootstrap (vd thutien.js:1500 — rê vào một người
       học thì hiện thẻ có ảnh và mười dòng thông tin). Ở đây viết lại gọn,
       không phụ thuộc Bootstrap:

           ums.ui.hoverCard(khung, '.ums-master__item[data-sv]', function (el) {
               return '<div>…</div>';      // trả null thì không hiện
           });

       Đặt position: fixed nên không bị khung cuộn cắt; tự lật sang trái khi hết
       chỗ bên phải; tự đóng khi cuộn, khi bấm, hay khi chuột rời đi.        */
    var hcEl = null, hcHen = null;

    function hcDong() {
        clearTimeout(hcHen);
        if (hcEl) { hcEl.remove(); hcEl = null; }
    }

    ui.hoverCard = function (khung, chon, dung) {
        if (!khung) return;

        function mo(muc) {
            var html = dung(muc);
            if (!html) return;
            hcDong();
            hcEl = document.createElement('div');
            hcEl.className = 'ums-hovercard';
            hcEl.innerHTML = html;
            document.body.appendChild(hcEl);

            var r = muc.getBoundingClientRect();
            var w = hcEl.offsetWidth, h = hcEl.offsetHeight;
            var trai = r.right + 12;
            var beTrai = trai + w > innerWidth - 8;
            if (beTrai) trai = Math.max(8, r.left - w - 12);
            var tren = Math.min(Math.max(8, r.top + r.height / 2 - h / 2), innerHeight - h - 8);
            hcEl.classList.toggle('is-left', beTrai);
            hcEl.style.left = Math.round(trai) + 'px';
            hcEl.style.top = Math.round(tren) + 'px';
            /* Mũi tên chỉ đúng vào mục đang rê, kể cả khi thẻ bị đẩy lên/xuống */
            hcEl.style.setProperty('--ums-hc-arrow',
                Math.round(Math.min(Math.max(12, r.top + r.height / 2 - tren), h - 12)) + 'px');
        }

        khung.addEventListener('mouseover', function (e) {
            var muc = e.target.closest(chon);
            if (!muc || !khung.contains(muc)) return;
            clearTimeout(hcHen);
            hcHen = setTimeout(function () { mo(muc); }, 250);
        });

        khung.addEventListener('mouseout', function (e) {
            var muc = e.target.closest(chon);
            if (!muc) return;
            if (e.relatedTarget && muc.contains(e.relatedTarget)) return;
            hcDong();
        });

        khung.addEventListener('click', hcDong);
        window.addEventListener('scroll', hcDong, true);
    };

    /* ---------- Ô CHỌN TỆP ----------------------------------------------
       Trình duyệt tự vẽ <input type="file"> thành "Choose file / No file chosen":
       chữ tiếng Anh (CSS không đổi được), nền xám, cao thấp hơn ô nhập — đặt
       cạnh một ô chọn là thấy lệch ngay. Ở đây bọc trong <label>: ô thật vẫn
       nằm trong (ẩn đi), phần nhìn thấy là một nút + tên tệp, vẽ bằng
       .ums-file ở components/field.css cho khớp ô nhập.

           ums.ui.file({ key: 'file', accept: '.xls,.xlsx' })

       Tên tệp do ums.ui.enhance tự cập nhật — màn hình không phải gắn gì,
       và `[data-k]` vẫn nằm trên chính <input> nên mã cũ tìm ô không đổi. */
    ui.file = function (opts) {
        opts = opts || {};
        var a = '';
        if (opts.key) a += ' data-k="' + esc(opts.key) + '"';
        if (opts.accept) a += ' accept="' + esc(opts.accept) + '"';
        if (opts.multiple) a += ' multiple';
        if (opts.attr) Object.keys(opts.attr).forEach(function (k) { a += ' ' + k + '="' + esc(opts.attr[k]) + '"'; });
        return '<label class="ums-file' + (opts.cls ? ' ' + esc(opts.cls) : '') + '">' +
            '<input type="file" class="ums-file__input"' + a + '>' +
            '<span class="ums-file__btn"><i class="fa-light fa-folder-open"></i>' +
            esc(opts.pick || 'Chọn tệp') + '</span>' +
            '<span class="ums-file__name">' + esc(opts.empty || 'Chưa chọn tệp nào') + '</span></label>';
    };

    ui.enhance = function (root) {
        root = root || document;

        /* Tên tệp của ums.ui.file — gắn một lần cho mỗi ô */
        qa(root, '.ums-file__input').forEach(function (el) {
            if (el._umsFile) return;
            el._umsFile = true;
            var nh = el.parentNode.querySelector('.ums-file__name');
            var trong = nh ? nh.textContent : '';
            el.addEventListener('change', function () {
                if (!nh) return;
                var f = el.files;
                nh.textContent = !f || !f.length ? trong
                    : (f.length > 1 ? f.length + ' tệp đã chọn' : f[0].name);
                nh.classList.toggle('is-empty', !f || !f.length);
            });
            if (nh) nh.classList.add('is-empty');
        });

        if (!global.jQuery || !jQuery.fn.select2) return;
        qa(root, 'select').forEach(function (el) {
            if (el.hasAttribute('data-no-s2') || el.classList.contains('select2-hidden-accessible')) return;
            if (el.closest('.select2-container')) return;
            /* Ô chọn THÁNG nằm trong lịch flatpickr là phần ruột của thư viện:
               bọc select2 vào thì vỡ đầu lịch (mọc thêm nút ×, danh sách tháng
               đè lên bảng ngày) và ô NĂM bị đẩy khuất vì khung select2 rộng
               100%. Lịch tự lo ô chọn của nó. */
            if (el.closest('.flatpickr-calendar')) return;
            /* Ô chọn nằm TRONG BẢNG: không gắn select2. Mỗi dòng một ô thì
               bảng trăm dòng là trăm khung select2 — nặng, và khung xổ gắn ở
               body rất dễ lạc chỗ khi bảng cuộn ngang. Ô gốc đã được vẽ cho
               giống hệt select2 (assets/css/components/field.css), nhìn vẫn
               đồng bộ. Cần select2 thật thì đánh dấu data-s2 trên ô. */
            if (el.closest('.ums-table') && !el.hasAttribute('data-s2')) return;
            try { ui.select2(el); } catch (e) { /* ô hỏng không được làm chết màn */ }
        });
        qa(root, 'input[data-date]').forEach(function (el) {
            if (el._flatpickr || el.hasAttribute('data-no-fp')) return;
            try { ui.datepicker(el); } catch (e) {}
        });
    };

    function qa(root, sel) {
        return Array.prototype.slice.call((root || document).querySelectorAll(sel));
    }

    /* Tự gắn cho ô chọn xuất hiện sau (màn hình vẽ lại bảng, mở hộp thoại…).
       Gom theo nhịp để nhiều thay đổi liên tiếp chỉ chạy một lần. */
    var pending = null;
    function watch() {
        if (!global.MutationObserver) return;
        new MutationObserver(function (recs) {
            for (var i = 0; i < recs.length; i++) {
                for (var j = 0; j < recs[i].addedNodes.length; j++) {
                    var n = recs[i].addedNodes[j];
                    if (n.nodeType !== 1) continue;
                    if (n.tagName === 'SELECT' || n.querySelector && n.querySelector('select, input[data-date]')) {
                        if (pending) clearTimeout(pending);
                        pending = setTimeout(function () { pending = null; ui.enhance(document); }, 60);
                        return;
                    }
                }
            }
        }).observe(document.documentElement, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watch);
    else watch();

    ui.chart = function (canvas, cfg) {
        if (typeof Chart === 'undefined') return;
        if (typeof ChartDataLabels !== 'undefined') Chart.register(ChartDataLabels);
        var el = typeof canvas === 'string' ? document.querySelector(canvas) : canvas;
        if (!el) return;
        if (el._chart) el._chart.destroy();
        el._chart = new Chart(el, cfg);
        return el._chart;
    };

    /* ---------- Chuyển vùng có hiệu ứng ----------------------------------
       Đổi giữa danh sách và biểu mẫu mà bật thẳng ra thì mắt không bắt kịp.
       Hai hàm dưới đây cho vùng vừa hiện trượt lên một đoạn ngắn.

       Lớp hiệu ứng được GỠ khi chạy xong: `transform` biến phần tử thành
       khối chứa của con nó, để lại thì đầu khung `position: sticky` bên
       trong sẽ dính sai chỗ.                                               */

    function node(x) { return typeof x === 'string' ? document.querySelector(x) : x; }

    /** Hiện một vùng đang ẩn, kèm hiệu ứng trượt lên */
    ui.reveal = function (el, opts) {
        el = node(el);
        if (!el) return null;
        opts = opts || {};
        var cls = opts.fade ? 'ums-in-fade' : 'ums-in-up';

        el.hidden = false;
        el.classList.remove(cls);
        /* Đọc một thuộc tính bố cục để trình duyệt chốt lại trạng thái cũ,
           nếu không thì gỡ rồi gắn ngay trong cùng một nhịp sẽ không chạy
           lại hiệu ứng. */
        void el.offsetWidth;
        el.classList.add(cls);

        el.addEventListener('animationend', function h(e) {
            if (e.target !== el) return;
            el.classList.remove(cls);
            el.removeEventListener('animationend', h);
        });

        /* Chạy dự phòng: người dùng bật "giảm chuyển động" thì không có sự
           kiện animationend nào để gỡ lớp. */
        setTimeout(function () { el.classList.remove(cls); }, 600);
        return el;
    };

    /** Ẩn vùng này, hiện vùng kia kèm hiệu ứng. Trả về vùng vừa hiện. */
    ui.swap = function (out, into, opts) {
        out = node(out);
        into = node(into);
        if (out) out.hidden = true;
        /* Vùng mới bắt đầu từ đầu trang, không thừa hưởng chỗ cuộn của vùng cũ */
        if (!opts || opts.top !== false) global.scrollTo({ top: 0, behavior: 'auto' });
        if (ums.chrome) ums.chrome.reveal();
        return ui.reveal(into, opts);
    };


    /* =====================================================================
       Kéo chuột để VUỐT BẢNG NGANG
       ---------------------------------------------------------------------
       Bảng nhiều cột tràn ngang thì trên máy tính chỉ còn cách kéo thanh cuộn
       ở tận đáy bảng, hoặc lăn chuột kèm Shift — cả hai đều khó. Ở đây giữ
       chuột kéo ngang ngay trên mặt bảng là cuộn, như vuốt trên điện thoại.

       Gắn MỘT lần ở document nên bảng vẽ sau vẫn dùng được, không cần màn
       hình khai báo gì.

       Ba điều phải giữ:
         · Không cướp thao tác của ô nhập / ô chọn / nút / liên kết trong ô.
         · Bấm thường (không di chuyển) vẫn là bấm — chỉ coi là kéo khi con
           trỏ đã đi quá 4px, nên nút trong ô bảng vẫn bấm được bình thường.
         · Chỉ bật ở bảng thật sự tràn; bảng vừa khung thì con trỏ vẫn như cũ.
       ===================================================================== */
    function panInit() {
        if (ui._pan) return;
        ui._pan = true;
        var st = null;
        var KHONG_KEO = 'input, select, textarea, button, a, label, [contenteditable], .ums-pager';

        function traoDuoc(el) { return el && el.scrollWidth > el.clientWidth + 1; }
        // sơ đồ cây (pat.soDo) cũng kéo được như bảng
        function wrapOf(t) { return t && t.closest ? t.closest('.ums-tablewrap, .ums-sodo') : null; }

        document.addEventListener('mousedown', function (e) {
            if (e.button !== 0) return;
            var w = wrapOf(e.target);
            if (!w || !traoDuoc(w)) return;
            if (e.target.closest(KHONG_KEO)) return;
            st = { w: w, x: e.clientX, left: w.scrollLeft, keo: false };
        });

        document.addEventListener('mousemove', function (e) {
            if (!st) return;
            var dx = e.clientX - st.x;
            if (!st.keo) {
                if (Math.abs(dx) < 4) return;       // vẫn coi là bấm, chưa phải kéo
                st.keo = true;
                st.w.classList.add('is-panning');
            }
            st.w.scrollLeft = st.left - dx;
            e.preventDefault();                      // chặn bôi đen chữ khi đang kéo
        });

        function ketThuc() {
            if (!st) return;
            st.w.classList.remove('is-panning');
            st = null;
        }
        document.addEventListener('mouseup', ketThuc);
        document.addEventListener('mouseleave', ketThuc);

        /* Con trỏ bàn tay chỉ hiện ở bảng đang tràn — đo lúc chuột đi vào */
        document.addEventListener('mouseover', function (e) {
            var w = wrapOf(e.target);
            if (w) w.classList.toggle('is-scrollable', traoDuoc(w));
        });
    }
    panInit();

    /* ---------- Tải tệp dựng ở máy khách -----------------------------------
       ums.ui.taiTep('ten.csv', 'text/csv;charset=utf-8', noiDung)
       ums.ui.xuatXls('DSSV_20260922.xls', { tieuDe, cot: [{ title, get(dòng) }], dong })
       Excel ở đây là BẢNG HTML lưu đuôi .xls (Excel mở được, không cần thư viện
       SheetJS tải từ CDN như vài màn gốc — _v2 không phụ thuộc CDN).        */
    ui.taiTep = function (ten, kieu, noiDung) {
        var url = URL.createObjectURL(new Blob([noiDung], { type: kieu })), a = document.createElement('a');
        a.href = url; a.download = ten; document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    };
    ui.xuatXls = function (ten, o) {
        var cot = o.cot || [], dong = o.dong || [];
        var h = '<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"></head><body><table border="1">' +
            (o.tieuDe ? '<tr><td colspan="' + cot.length + '" style="font-size:14pt;font-weight:bold">' + esc(o.tieuDe) + '</td></tr>' : '') +
            '<tr style="font-weight:bold;background:#D9E1F2">' + cot.map(function (c) { return '<td>' + esc(c.title) + '</td>'; }).join('') + '</tr>' +
            dong.map(function (r, i) {
                return '<tr>' + cot.map(function (c) { var v = c.get ? c.get(r, i) : r[c.prop]; return '<td style="mso-number-format:\'\\@\'">' + esc(v === null || v === undefined ? '' : v) + '</td>'; }).join('') + '</tr>';
            }).join('') + '</table></body></html>';
        ui.taiTep(/\.xls$/i.test(ten) ? ten : ten + '.xls', 'application/vnd.ms-excel;charset=utf-8', h);
    };

    /* =====================================================================
       Phím Esc = bấm nút "Đóng" của TẦNG ĐANG HIỆN (người dùng 2026-09-30)
       ---------------------------------------------------------------------
       Không đóng cả chồng: mỗi lần Esc chỉ đóng một tầng — biểu mẫu tầng hai → biểu mẫu tầng một → khung chi tiết…
       Dựa vào luật "mỗi lúc chỉ MỘT nút Đóng đang hiện" (BO-CUC luật 18): Esc bấm đúng nút đó (ui.btn('close') → .ums-btn--dong),
       nên mọi việc dọn dẹp của màn khi đóng vẫn chạy y như bấm chuột.
       KHÔNG làm gì khi:
         · đang có hộp thoại (<dialog> tự đóng bằng Esc — cũng chỉ hộp trên cùng);
         · Esc đang dùng để đóng thứ khác: ô chọn select2, lịch, menu thả xuống, menu người dùng, ô tìm màn hình;
         · màn đã tự xử lý Esc và gọi ev.preventDefault() (huỷ sửa tại ô, đóng bộ lọc nổi…).
       Ghi trạng thái ở pha BẮT (trước khi các trình xử lý khác kịp đóng popup), hành động ở pha NỔI BỌT trên window (sau cùng). */
    var escBan = false;
    global.addEventListener('keydown', function (ev) {
        if (ev.key !== 'Escape') return;
        var a = document.activeElement;
        escBan = !!document.querySelector('dialog[open], .select2-container--open, .flatpickr-calendar.open, .ums-drop.is-open, .ums-usermenu:not([hidden])') ||
            !!(a && a.id === 'gSearchInput');
    }, true);
    global.addEventListener('keydown', function (ev) {
        if (ev.key !== 'Escape' || ev.defaultPrevented || escBan || ev.ctrlKey || ev.altKey || ev.metaKey) return;
        var ds = qa(document, '.ums-btn--dong').filter(function (b) {
            return !b.disabled && !b.hidden && b.offsetParent && !b.closest('dialog') && !b.closest('.ums-canquyet');
        });
        if (!ds.length) return;
        ev.preventDefault();
        ds[ds.length - 1].click();          // nhiều hơn một (không nên có) thì lấy nút nằm SÂU nhất / sau cùng
    });

})(window);
