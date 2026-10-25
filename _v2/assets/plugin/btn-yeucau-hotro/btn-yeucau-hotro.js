/* =========================================================================
   PLUGIN "Yêu cầu hỗ trợ" — nút nổi + popup chụp màn hình → gửi sang Cổng Help
   Tài liệu: nut-yeu-cau-ho-tro-tren-app.docx (Help gửi đội app 26/10/2026), mục 2, 4, 5 + dòng
   "Sửa ảnh" (đội app): chụp xong có nút sửa ảnh dạng Paint (khung, mũi tên) và nút Cắt ảnh.

   TỰ CHỨA: tệp này + btn-yeucau-hotro.css (tự nạp, cùng thư mục) + html2canvas.min.js (nạp lười
   lần bấm đầu). Không dùng class / hàm nào của ums ngoài bộ chuyển tiếp (adapter) bên dưới.

   GẮN VÀO VỎ — một thẻ script, đặt SAU các script của vỏ:
       <script src="assets/plugin/btn-yeucau-hotro/btn-yeucau-hotro.js"></script>
   Cấu hình (tuỳ chọn) — một trong hai cách:
       window.UMS_HOTRO_CONFIG = { url: '…/help-master/ho-tro/gui', v: '2', text: 'Yêu cầu hỗ trợ' };
       <script src="…/btn-yeucau-hotro.js" data-url="…" data-v="2" data-token-url="help-sso.aspx">

   Plugin chỉ làm hai việc như tài liệu yêu cầu: chụp ảnh và gửi MỘT form POST (multipart) sang Help,
   kèm token SSO phát MỚI mỗi lần bấm gửi (help-sso.aspx?json=1 — cùng claim với đăng nhập SSO).
   Không gọi API nào của Help, không giữ token.

   Bộ chuyển tiếp (adapter) tự chọn theo vỏ đang chạy:
     · _v2  : window.ums  (ums.state.menu / chucNangId, ums.session.userId, ums.api.call để lấy vai trò)
     · v1   : window.edu  (edu.system.dtChucNang / strChucNang_Id / userId / dtUngDung)
   Muốn vỏ khác: gán window.btnYeuCauHoTro.adapter = { nguCanh(), uid(), roles() → Promise, demo() }.
   ========================================================================= */
(function (global) {
    'use strict';
    if (global.btnYeuCauHoTro) return;

    var SCRIPT = document.currentScript;
    var GOC = SCRIPT ? SCRIPT.src.replace(/[^\/]*(\?.*)?$/, '') : 'assets/plugin/btn-yeucau-hotro/';
    var ds = (SCRIPT && SCRIPT.dataset) || {};
    var cau = global.UMS_HOTRO_CONFIG || {};

    var CFG = {
        url: cau.url || ds.url || 'https://con98.api-apis.com/help-master/ho-tro/gui',   // cửa nhận của Help (tài liệu mục 4)
        tokenUrl: cau.tokenUrl || ds.tokenUrl || 'help-sso.aspx',                          // phát token: cùng trang SSO, thêm json=1
        v: cau.v || ds.v || '',                                                             // rỗng = lấy theo vỏ (_v2: help.version), mặc định "2"
        text: cau.text || ds.text || 'Yêu cầu hỗ trợ',
        target: cau.target || ds.target || 'help-portal',                                   // tên tab cố định (trùng tab của nút "?")
        maxRong: Number(cau.maxRong || ds.maxRong || 1600),                                 // thu ảnh về ≤ 1600px bề ngang
        maxBytes: Number(cau.maxBytes || ds.maxBytes || 5 * 1024 * 1024),                   // Help chặn > 5 MB
        maxChu: 2000,
        mauVe: '#e11d48',
        netVe: 3
    };

    /* ---------- Bộ chuyển tiếp theo vỏ ---------- */
    var adapters = {
        v2: {
            ok: function () { return !!(global.ums && global.ums.state); },
            nguCanh: function () {
                var st = global.ums.state, cfg = global.ums.cfg || {};
                var cn = (st.menu || []).filter(function (c) { return c.id === st.chucNangId; })[0];
                return {
                    ma: cn ? cn.id : '', ten: cn ? cn.name : '', duong: cn ? (cn.path || '') : '',
                    ungDung: cn ? (cn.appCode || '') : '', v: (cfg.help && cfg.help.version) || '2', route: location.hash || ''
                };
            },
            uid: function () { return (global.ums.session && global.ums.session.userId) || ''; },
            roles: function () {
                var ums = global.ums, ep = ((ums.cfg || {}).api || {}).endpoints || {};
                if (!ums.api || !ep.roles) return Promise.resolve([]);
                return ums.api.call({ action: ep.roles.action, func: ep.roles.func, strChucNang_Id: '', silent: true })
                    .then(function (r) { return maVaiTro(r && r.data); }, function () { return []; });
            },
            demo: function () { return global.ums.state.mode === 'demo'; }
        },
        v1: {
            ok: function () { return !!(global.edu && global.edu.system); },
            nguCanh: function () {
                var s = global.edu.system, id = s.strChucNang_Id || '';
                var cn = (s.dtChucNang || []).filter(function (c) { return c.ID === id; })[0];
                return { ma: id, ten: cn ? (cn.TENCHUCNANG || '') : '', duong: cn ? (cn.DUONGDANFILE || '') : '',
                         ungDung: s.appCode || '', v: '1', route: location.hash || '' };
            },
            uid: function () { return global.edu.system.userId || ''; },
            roles: function () {
                var s = global.edu.system;
                if (s.dtUngDung && s.dtUngDung.length) return Promise.resolve(maVaiTro(s.dtUngDung));
                return Promise.resolve([]);
            },
            demo: function () { return false; }
        }
    };
    function maVaiTro(rows) {
        var ma = [];
        (rows || []).forEach(function (r) { var m = r && (r.MAVAITRO || r.MAUNGDUNG); if (m && ma.indexOf(m) < 0) ma.push(m); });
        return ma;
    }
    function adapter() {
        var a = global.btnYeuCauHoTro.adapter;
        if (a) return a;
        if (adapters.v2.ok()) return adapters.v2;
        if (adapters.v1.ok()) return adapters.v1;
        return { nguCanh: function () { return { ma: '', ten: document.title, duong: location.pathname, ungDung: '', v: '2', route: location.hash }; },
                 uid: function () { return ''; }, roles: function () { return Promise.resolve([]); }, demo: function () { return true; } };
    }

    /* ---------- Tiện ích ---------- */
    function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
    function napCss() {
        if (document.querySelector('link[data-yh-css]')) return;
        var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = GOC + 'btn-yeucau-hotro.css' + (SCRIPT && /\?v=/.test(SCRIPT.src) ? SCRIPT.src.slice(SCRIPT.src.indexOf('?')) : '');
        l.setAttribute('data-yh-css', '1'); document.head.appendChild(l);
    }
    var h2cHua = null;
    function napHtml2canvas() {
        if (global.html2canvas) return Promise.resolve(global.html2canvas);
        if (h2cHua) return h2cHua;
        h2cHua = new Promise(function (ok, loi) {
            var s = document.createElement('script'); s.src = GOC + 'html2canvas.min.js';
            s.onload = function () { ok(global.html2canvas); };
            s.onerror = function () { h2cHua = null; loi(new Error('Không nạp được html2canvas.min.js')); };
            document.head.appendChild(s);
        });
        return h2cHua;
    }

    /* ---------- Chụp màn hình đang mở (vùng đang hiện) ---------- */
    function chup() {
        return napHtml2canvas().then(function (h2c) {
            var w = global.innerWidth, h = global.innerHeight;
            return h2c(document.body, {
                x: global.scrollX, y: global.scrollY, width: w, height: h, windowWidth: w, windowHeight: h,
                scale: 1, useCORS: true, logging: false, backgroundColor: '#ffffff',
                ignoreElements: function (e) { return !!(e.classList && (e.classList.contains('yh-fab') || e.classList.contains('yh-veil'))); }
            });
        }).then(thuNho);
    }
    function thuNho(c) {
        if (c.width <= CFG.maxRong) return c;
        var t = document.createElement('canvas'), k = CFG.maxRong / c.width;
        t.width = CFG.maxRong; t.height = Math.round(c.height * k);
        t.getContext('2d').drawImage(c, 0, 0, t.width, t.height);
        return t;
    }
    function tuAnh(img) {           // ảnh dán / tệp → canvas
        var c = document.createElement('canvas'); c.width = img.naturalWidth || img.width; c.height = img.naturalHeight || img.height;
        c.getContext('2d').drawImage(img, 0, 0);
        return thuNho(c);
    }

    /* ---------- Trình sửa ảnh dạng Paint: khung, mũi tên, cắt, hoàn tác ---------- */
    function TrinhVe(canvas) {
        var me = this;
        me.c = canvas; me.ctx = canvas.getContext('2d');
        me.tool = 'khung'; me.stack = []; me.dang = null;
        me.onThayDoi = null;
        function toa(ev) {
            var r = me.c.getBoundingClientRect(), p = ev.touches ? ev.touches[0] : ev;
            return { x: (p.clientX - r.left) * me.c.width / r.width, y: (p.clientY - r.top) * me.c.height / r.height };
        }
        function xuong(ev) {
            if (ev.button != null && ev.button !== 0) return;
            ev.preventDefault();
            me.nen = me.ctx.getImageData(0, 0, me.c.width, me.c.height);
            me.dang = { a: toa(ev), b: toa(ev) };
        }
        function di(ev) {
            if (!me.dang) return;
            ev.preventDefault();
            me.dang.b = toa(ev);
            me.ctx.putImageData(me.nen, 0, 0);
            me.veTam(me.dang.a, me.dang.b);
        }
        function len(ev) {
            if (!me.dang) return;
            var a = me.dang.a, b = me.dang.b; me.dang = null;
            me.ctx.putImageData(me.nen, 0, 0);
            if (Math.abs(b.x - a.x) < 4 && Math.abs(b.y - a.y) < 4) return;
            me.luu();
            if (me.tool === 'cat') me.cat(a, b); else me.veTam(a, b);
            if (me.onThayDoi) me.onThayDoi();
        }
        me.c.addEventListener('mousedown', xuong); me.c.addEventListener('mousemove', di); document.addEventListener('mouseup', len);
        me.c.addEventListener('touchstart', xuong, { passive: false }); me.c.addEventListener('touchmove', di, { passive: false }); document.addEventListener('touchend', len);
        me.huy = function () { document.removeEventListener('mouseup', len); document.removeEventListener('touchend', len); };
    }
    TrinhVe.prototype.luu = function () {
        this.stack.push({ w: this.c.width, h: this.c.height, d: this.ctx.getImageData(0, 0, this.c.width, this.c.height) });
        if (this.stack.length > 30) this.stack.shift();
    };
    TrinhVe.prototype.hoanTac = function () {
        var s = this.stack.pop(); if (!s) return false;
        this.c.width = s.w; this.c.height = s.h; this.ctx.putImageData(s.d, 0, 0);
        if (this.onThayDoi) this.onThayDoi();
        return true;
    };
    TrinhVe.prototype.veTam = function (a, b) {
        var ctx = this.ctx, k = Math.max(1, this.c.width / 800);
        ctx.save();
        ctx.strokeStyle = CFG.mauVe; ctx.fillStyle = CFG.mauVe; ctx.lineWidth = CFG.netVe * k; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        if (this.tool === 'khung') {
            ctx.strokeRect(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.abs(b.x - a.x), Math.abs(b.y - a.y));
        } else if (this.tool === 'muiten') {
            var goc = Math.atan2(b.y - a.y, b.x - a.x), dau = 14 * k;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(b.x, b.y);
            ctx.lineTo(b.x - dau * Math.cos(goc - Math.PI / 6), b.y - dau * Math.sin(goc - Math.PI / 6));
            ctx.lineTo(b.x - dau * Math.cos(goc + Math.PI / 6), b.y - dau * Math.sin(goc + Math.PI / 6));
            ctx.closePath(); ctx.fill();
        } else if (this.tool === 'cat') {
            ctx.setLineDash([6 * k, 4 * k]); ctx.lineWidth = 1.5 * k; ctx.strokeStyle = '#111';
            ctx.strokeRect(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.abs(b.x - a.x), Math.abs(b.y - a.y));
            ctx.fillStyle = 'rgba(0,0,0,.25)';
            ctx.fillRect(0, 0, this.c.width, this.c.height);
            ctx.clearRect(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.abs(b.x - a.x), Math.abs(b.y - a.y));
            ctx.putImageData(this.nen, 0, 0, Math.min(a.x, b.x), Math.min(a.y, b.y), Math.abs(b.x - a.x), Math.abs(b.y - a.y));
        }
        ctx.restore();
    };
    TrinhVe.prototype.cat = function (a, b) {
        var x = Math.max(0, Math.round(Math.min(a.x, b.x))), y = Math.max(0, Math.round(Math.min(a.y, b.y)));
        var w = Math.min(this.c.width - x, Math.round(Math.abs(b.x - a.x))), h = Math.min(this.c.height - y, Math.round(Math.abs(b.y - a.y)));
        if (w < 10 || h < 10) return;
        var d = this.ctx.getImageData(x, y, w, h);
        this.c.width = w; this.c.height = h; this.ctx.putImageData(d, 0, 0);
    };
    TrinhVe.prototype.thay = function (src) {   // thay toàn bộ ảnh (chụp lại / dán)
        this.luu();
        this.c.width = src.width; this.c.height = src.height; this.ctx.drawImage(src, 0, 0);
        if (this.onThayDoi) this.onThayDoi();
    };

    /* ---------- Popup ---------- */
    var popup = null;
    function moPopup(anhDau, loiChup) {
        if (popup) dongPopup();
        var ad = adapter(), nc = ad.nguCanh(), vLan = CFG.v || nc.v || '2';
        var veil = el('div', 'yh-veil');
        veil.innerHTML =
            '<div class="yh-popup" role="dialog" aria-label="' + esc(CFG.text) + '">' +
            '  <div class="yh-head"><i class="fa-light fa-life-ring"></i><span>' + esc(CFG.text) + '</span>' +
            '     <button type="button" class="yh-x" data-yh="dong" title="Đóng"><i class="fa-light fa-xmark"></i></button></div>' +
            '  <div class="yh-ngucanh">' +
            '     <span><i class="fa-light fa-window"></i>' + esc(nc.ten || '(chưa mở chức năng nào)') + '</span>' +
            (nc.ungDung ? '<span><i class="fa-light fa-cube"></i>' + esc(nc.ungDung) + '</span>' : '') +
            '     <span><i class="fa-light fa-code-branch"></i>Phiên bản ' + esc(vLan) + '</span></div>' +
            '  <div class="yh-cc">' +
            '     <button type="button" class="yh-tool is-on" data-tool="khung" title="Đóng khung chỗ có vấn đề"><i class="fa-light fa-vector-square"></i>Khung</button>' +
            '     <button type="button" class="yh-tool" data-tool="muiten" title="Vẽ mũi tên chỉ vào chỗ có vấn đề"><i class="fa-light fa-arrow-up-right"></i>Mũi tên</button>' +
            '     <button type="button" class="yh-tool" data-tool="cat" title="Kéo chọn vùng rồi thả để cắt đúng khu vực muốn gửi"><i class="fa-light fa-crop-simple"></i>Cắt ảnh</button>' +
            '     <span class="yh-cc__cach"></span>' +
            '     <button type="button" class="yh-tool" data-yh="hoantac" title="Hoàn tác"><i class="fa-light fa-rotate-left"></i>Hoàn tác</button>' +
            '     <button type="button" class="yh-tool" data-yh="chuplai" title="Chụp lại màn hình"><i class="fa-light fa-camera-rotate"></i>Chụp lại</button>' +
            '     <label class="yh-tool" title="Chọn tệp ảnh khác"><i class="fa-light fa-image"></i>Ảnh khác<input type="file" accept="image/*" hidden></label>' +
            '     <span class="yh-cc__kt" data-yh="kt"></span></div>' +
            '  <div class="yh-anh"><canvas></canvas>' +
            '     <div class="yh-anh__trong" hidden><i class="fa-light fa-image-slash"></i><div>Chưa có ảnh. Bấm "Chụp lại", chọn "Ảnh khác" hoặc dán ảnh bằng Ctrl+V (chụp bằng Win+Shift+S).</div></div></div>' +
            '  <textarea class="yh-mota" maxlength="' + CFG.maxChu + '" placeholder="Mô tả ngắn: bạn đang làm gì, thấy gì (không bắt buộc với Gửi nhanh)"></textarea>' +
            '  <div class="yh-nhac"><i class="fa-light fa-circle-info"></i>Người cùng ứng dụng ở trường bạn sẽ nhìn thấy ảnh và nội dung này. Cắt bớt hoặc che phần không muốn gửi.</div>' +
            '  <div class="yh-tt" data-yh="tt" hidden></div>' +
            '  <div class="yh-foot">' +
            '     <button type="button" class="yh-btn" data-yh="dong"><i class="fa-light fa-xmark"></i>Đóng</button>' +
            '     <span class="yh-foot__cach"></span>' +
            '     <button type="button" class="yh-btn yh-btn--phu" data-yh="gui" data-chedo="chi-tiet"><i class="fa-light fa-list-check"></i>Chi tiết hơn</button>' +
            '     <button type="button" class="yh-btn yh-btn--chinh" data-yh="gui" data-chedo="nhanh"><i class="fa-light fa-paper-plane"></i>Gửi nhanh</button></div>' +
            '</div>';
        document.body.appendChild(veil);

        var canvas = veil.querySelector('canvas'), trong = veil.querySelector('.yh-anh__trong'), kt = veil.querySelector('[data-yh="kt"]');
        var ve = new TrinhVe(canvas);
        popup = { veil: veil, ve: ve, canvas: canvas, coAnh: false, nc: nc, v: vLan };

        function capNhat() {
            popup.coAnh = canvas.width > 1 && canvas.height > 1;
            canvas.hidden = !popup.coAnh; trong.hidden = popup.coAnh;
            kt.textContent = popup.coAnh ? canvas.width + ' × ' + canvas.height : '';
        }
        ve.onThayDoi = capNhat;
        function datAnh(src) { canvas.width = src.width; canvas.height = src.height; canvas.getContext('2d').drawImage(src, 0, 0); ve.stack = []; capNhat(); }
        if (anhDau) datAnh(anhDau); else { canvas.width = 1; canvas.height = 1; capNhat(); }
        if (loiChup) thongBao('Không tự chụp được màn hình (' + loiChup + '). Bạn vẫn gửi được: dán ảnh bằng Ctrl+V hoặc chọn "Ảnh khác".', 'canh');

        veil.addEventListener('click', function (ev) {
            var t = ev.target.closest('[data-tool]');
            if (t) { ve.tool = t.getAttribute('data-tool'); veil.querySelectorAll('[data-tool]').forEach(function (b) { b.classList.toggle('is-on', b === t); }); return; }
            var b = ev.target.closest('[data-yh]'); if (!b) return;
            var k = b.getAttribute('data-yh');
            if (k === 'dong') dongPopup();
            else if (k === 'hoantac') { if (!ve.hoanTac()) thongBao('Không còn gì để hoàn tác.', 'nhe'); }
            else if (k === 'chuplai') chupLai();
            else if (k === 'gui') gui(b.getAttribute('data-chedo'), b);
        });
        veil.querySelector('input[type=file]').addEventListener('change', function () {
            var f = this.files && this.files[0]; this.value = ''; if (f) napTep(f);
        });
        veil.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') { ev.stopPropagation(); dongPopup(); } });
        document.addEventListener('paste', onPaste);
        setTimeout(function () { var ta = veil.querySelector('.yh-mota'); if (ta) ta.focus(); }, 50);

        function onPaste(ev) {
            var items = (ev.clipboardData || {}).items || [];
            for (var i = 0; i < items.length; i++) if (items[i].type.indexOf('image/') === 0) { ev.preventDefault(); napTep(items[i].getAsFile()); return; }
        }
        function napTep(f) {
            var url = URL.createObjectURL(f), img = new Image();
            img.onload = function () { URL.revokeObjectURL(url); ve.thay(tuAnh(img)); thongBao('Đã thay ảnh.', 'nhe'); };
            img.onerror = function () { URL.revokeObjectURL(url); thongBao('Không đọc được ảnh này.', 'canh'); };
            img.src = url;
        }
        function chupLai() {
            veil.hidden = true;
            setTimeout(function () {
                chup().then(function (c) { veil.hidden = false; ve.thay(c); thongBao('Đã chụp lại.', 'nhe'); },
                            function (e) { veil.hidden = false; thongBao('Không chụp được: ' + e.message, 'canh'); });
            }, 120);
        }
        popup.dong = function () { ve.huy(); document.removeEventListener('paste', onPaste); if (veil.parentNode) veil.parentNode.removeChild(veil); };
    }
    function dongPopup() { if (popup) { popup.dong(); popup = null; } }
    function thongBao(msg, loai) {
        if (!popup) return;
        var tt = popup.veil.querySelector('[data-yh="tt"]');
        tt.hidden = false; tt.className = 'yh-tt yh-tt--' + (loai || 'nhe'); tt.textContent = msg;
    }

    /* ---------- Gửi: token mới → form POST multipart sang Help, tab "help-portal" ---------- */
    function anhBlob() {
        return new Promise(function (ok) {
            if (!popup.coAnh) return ok(null);
            var c = popup.canvas;
            c.toBlob(function (b) {
                if (b && b.size <= CFG.maxBytes) return ok(b);
                c.toBlob(function (j) { ok(j); }, 'image/jpeg', 0.85);  // PNG quá 5 MB → JPEG
            }, 'image/png');
        });
    }
    function layToken(ad) {
        return ad.roles().then(function (roles) {
            var body = new URLSearchParams({ roles: JSON.stringify(roles), uid: ad.uid() || '', json: '1' });
            return fetch(CFG.tokenUrl, { method: 'POST', body: body, credentials: 'same-origin', cache: 'no-store' })
                .then(function (r) { return r.text().then(function (t) { var j; try { j = JSON.parse(t); } catch (e) { throw new Error('HTTP ' + r.status + ' — ' + t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160)); } if (!j.token) throw new Error(j.error || 'không có token'); return j; }); });
        });
    }
    function gui(cheDo, nut) {
        if (!popup) return;
        var ad = adapter(), nc = popup.nc;
        var noiDung = popup.veil.querySelector('.yh-mota').value.trim().slice(0, CFG.maxChu);
        if (ad.demo()) { thongBao('Chế độ dựng thử trên máy: không có phiên đăng nhập để phát token, nên không gửi sang Help. Mọi bước chụp / sửa / cắt ảnh vẫn thử được.', 'canh'); return; }
        if (!nc.ma) { thongBao('Chưa mở chức năng nào nên không biết gửi cho màn hình nào. Mở màn hình đang mắc rồi bấm lại.', 'canh'); return; }
        var cacNut = popup.veil.querySelectorAll('[data-yh="gui"]'); cacNut.forEach(function (b) { b.disabled = true; });
        thongBao('Đang phát token và gửi…', 'nhe');
        Promise.all([layToken(ad), anhBlob()]).then(function (kq) {
            var tk = kq[0], anh = kq[1];
            if (anh && anh.size > CFG.maxBytes) throw new Error('Ảnh ' + (anh.size / 1048576).toFixed(1) + ' MB vượt 5 MB — cắt bớt rồi gửi lại.');
            var f = document.createElement('form');
            f.method = 'POST'; f.enctype = 'multipart/form-data'; f.action = CFG.url; f.target = CFG.target; f.style.display = 'none';
            function them(n, v) { var i = document.createElement('input'); i.type = 'hidden'; i.name = n; i.value = v == null ? '' : String(v); f.appendChild(i); }
            them('token', tk.token); them('ma', nc.ma); them('ten', String(nc.ten || '').slice(0, 200)); them('duong', String(nc.duong || '').slice(0, 300));
            them('v', popup.v); them('cheDo', cheDo); them('noiDung', noiDung);
            them('route', nc.route || ''); them('appVersion', (global.ums && global.ums.ban) || ''); them('browser', navigator.userAgent);
            if (anh) {
                var fi = document.createElement('input'); fi.type = 'file'; fi.name = 'anh';
                var dt = new DataTransfer(); dt.items.add(new File([anh], 'man-hinh.' + (anh.type === 'image/jpeg' ? 'jpg' : 'png'), { type: anh.type }));
                fi.files = dt.files; f.appendChild(fi);
            }
            document.body.appendChild(f);
            global.open('', CFG.target);   // mở / lấy lại tab trước khi submit để không bị chặn popup
            f.submit();
            setTimeout(function () { if (f.parentNode) f.parentNode.removeChild(f); }, 3000);
            thongBao('Đã gửi sang Cổng Help ở tab "' + CFG.target + '". Popup giữ nguyên ảnh và nội dung: nếu Help báo lỗi token, bấm gửi lại.', 'tot');
        }).catch(function (e) {
            thongBao('Chưa gửi được: ' + e.message, 'canh');
        }).then(function () { cacNut.forEach(function (b) { b.disabled = false; }); });
    }

    /* ---------- Nút nổi ---------- */
    function moTuNut() {
        var fab = document.querySelector('.yh-fab'); if (fab) fab.classList.add('is-busy');
        chup().then(function (c) { moPopup(c, ''); }, function (e) { moPopup(null, e.message); })
              .then(function () { if (fab) fab.classList.remove('is-busy'); });
    }
    function dungNut() {
        if (document.querySelector('.yh-fab')) return;
        napCss();
        var b = el('button', 'yh-fab', '<i class="fa-light fa-life-ring"></i><span>' + esc(CFG.text) + '</span>');
        b.type = 'button'; b.title = CFG.text + ' — chụp màn hình đang mở và gửi sang Cổng Help';
        b.addEventListener('click', moTuNut);
        document.body.appendChild(b);
    }

    global.btnYeuCauHoTro = { config: CFG, mo: moTuNut, dong: dongPopup, adapter: null, adapters: adapters, dung: dungNut };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', dungNut); else dungNut();
})(window);
