/* =========================================================================
   PLUGIN "Yêu cầu hỗ trợ" — nút nổi → bảng "Yêu cầu của tôi" trượt từ mép phải (danh sách + trạng thái + bộ lọc,
   đọc từ cửa /ho-tro/danh-sach của Help) → nút "Tạo yêu cầu mới" chụp màn hình, sửa ảnh, gửi sang Cổng Help.
   Tài liệu: nut-yeu-cau-ho-tro-tren-app.docx (Help gửi đội app 26/10/2026), mục 2, 4, 5, mục 10 (bảng + cửa
   danh sách, Help trả lời ở 10.7: id = uuid kèm maHienThi, mã trạng thái HOA, ds[].ma = mã nghiệp vụ) + dòng
   "Sửa ảnh" (đội app): chụp xong có nút sửa ảnh dạng Paint (khung, mũi tên) và nút Cắt ảnh.

   TỰ CHỨA: tệp này + btn-yeucau-hotro.css (tự nạp, cùng thư mục) + html2canvas.min.js (nạp lười
   lần bấm đầu). Không dùng class / hàm nào của ums ngoài bộ chuyển tiếp (adapter) bên dưới.

   GẮN VÀO VỎ — một thẻ script, đặt SAU các script của vỏ:
       <script src="assets/plugin/btn-yeucau-hotro/btn-yeucau-hotro.js"></script>
   Cấu hình (tuỳ chọn) — một trong hai cách:
       window.UMS_HOTRO_CONFIG = { url: '…/help-master/ho-tro/gui', v: '2', text: 'Yêu cầu hỗ trợ' };
       <script src="…/btn-yeucau-hotro.js" data-url="…" data-v="2" data-token-url="help-sso.aspx">

   Plugin làm ba việc như tài liệu (mục 10.4): đọc danh sách yêu cầu của người dùng (POST JSON tới cửa
   /ho-tro/danh-sach, chỉ khi mở bảng / đổi bộ lọc — không gọi nền, không định kỳ), chụp ảnh, và gửi MỘT form
   POST (multipart) sang Help. Mọi lần gọi Help đều kèm token SSO phát MỚI (help-sso.aspx?json=1 — cùng claim
   với đăng nhập SSO). Không giữ token, không cookie Help, không SDK.
   "Gửi nhanh" submit vào iframe ẩn và chờ postMessage { loai: "help-ho-tro-xong", ok, id, url, soTuongTu }
   từ đúng origin Help (bước 3a) → chèn dòng mới lên đầu bảng. "Chi tiết hơn" mở tab help-portal (bước 3b).
   Chế độ dựng thử (index.html, không vỏ ASPX): bảng chạy bằng dữ liệu mẫu cùng hình dạng JSON mục 10.2.

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
        listUrl: cau.listUrl || ds.listUrl || 'https://con98.api-apis.com/help-master/ho-tro/danh-sach',   // cửa danh sách (mục 10.2)
        tokenUrl: cau.tokenUrl || ds.tokenUrl || 'help-sso.aspx',                          // phát token: cùng trang SSO, thêm json=1
        kichCo: Number(cau.kichCo || ds.kichCo || 20),                                      // số dòng mỗi lần tải (Help tối đa 50)
        choMs: Number(cau.choMs || ds.choMs || 10000),                                      // chờ Help trả lời (danh sách / postMessage) tối đa
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
    /* html2canvas 1.4.1 ném "Error parsing CSS component value, unexpected EOF" khi thẻ <input> có giả phần tử
       ::before / ::after mang content (ô chọn của _v2: field.css `input[type=checkbox]::before { content: "" }`) → mọi màn
       có ô chọn đều không chụp được (26/10). Giả phần tử được dựng NGAY LÚC nhân bản (trước onclone) nên phải tắt tạm
       trên tài liệu thật trong khoảnh khắc chụp rồi gỡ; ô đã chọn vẫn thấy nhờ nền `:checked`. */
    var CSS_CHUP = 'input::before,input::after,textarea::before,textarea::after,select::before,select::after{content:none!important}';
    function chup() {
        var st = document.createElement('style'); st.setAttribute('data-yh-chup', '1'); st.textContent = CSS_CHUP;
        document.head.appendChild(st);
        function go() { if (st.parentNode) st.parentNode.removeChild(st); }
        return napHtml2canvas().then(function (h2c) {
            var w = global.innerWidth, h = global.innerHeight;
            return h2c(document.body, {
                x: global.scrollX, y: global.scrollY, width: w, height: h, windowWidth: w, windowHeight: h,
                scale: 1, useCORS: true, logging: false, backgroundColor: '#ffffff',
                ignoreElements: function (e) { return !!(e.classList && (e.classList.contains('yh-fab') || e.classList.contains('yh-veil') || e.classList.contains('yh-bang') || e.classList.contains('yh-man'))); }
            });
        }).then(function (c) { go(); return thuNho(c); }, function (e) { go(); throw e; });
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
    var HELP_GOC = (function () { try { return new URL(CFG.url, location.href).origin; } catch (e) { return ''; } })();
    function khoaNut(khoa) { if (popup) popup.veil.querySelectorAll('[data-yh="gui"]').forEach(function (b) { b.disabled = !!khoa; }); }
    function gui(cheDo, nut) {
        if (!popup) return;
        var ad = adapter(), nc = popup.nc;
        var noiDung = popup.veil.querySelector('.yh-mota').value.trim().slice(0, CFG.maxChu);
        if (ad.demo()) {
            if (cheDo === 'nhanh') {
                themDongMoi({ id: 'mau-' + Date.now(), maHienThi: 'HT-mẫu', url: '#' }, noiDung, nc);
                thongBao('Chế độ dựng thử trên máy: không có phiên đăng nhập để phát token nên không gửi sang Help; đã thêm một dòng mẫu vào bảng để xem luồng.', 'canh');
            } else thongBao('Chế độ dựng thử trên máy: không có phiên đăng nhập để phát token, nên không gửi sang Help. Mọi bước chụp / sửa / cắt ảnh vẫn thử được.', 'canh');
            return;
        }
        if (!nc.ma) { thongBao('Chưa mở chức năng nào nên không biết gửi cho màn hình nào. Mở màn hình đang mắc rồi bấm lại.', 'canh'); return; }
        khoaNut(true);
        thongBao('Đang phát token và gửi…', 'nhe');
        Promise.all([layToken(ad), anhBlob()]).then(function (kq) {
            var tk = kq[0], anh = kq[1];
            if (anh && anh.size > CFG.maxBytes) throw new Error('Ảnh ' + (anh.size / 1048576).toFixed(1) + ' MB vượt 5 MB — cắt bớt rồi gửi lại.');
            var f = document.createElement('form');
            f.method = 'POST'; f.enctype = 'multipart/form-data'; f.action = CFG.url; f.style.display = 'none';
            function them(n, v) { var i = document.createElement('input'); i.type = 'hidden'; i.name = n; i.value = v == null ? '' : String(v); f.appendChild(i); }
            them('token', tk.token); them('ma', nc.ma); them('ten', String(nc.ten || '').slice(0, 200)); them('duong', String(nc.duong || '').slice(0, 300));
            them('v', popup.v); them('cheDo', cheDo); them('noiDung', noiDung);
            them('route', nc.route || ''); them('appVersion', (global.ums && global.ums.ban) || ''); them('browser', navigator.userAgent);
            if (anh) {
                var fi = document.createElement('input'); fi.type = 'file'; fi.name = 'anh';
                var dt = new DataTransfer(); dt.items.add(new File([anh], 'man-hinh.' + (anh.type === 'image/jpeg' ? 'jpg' : 'png'), { type: anh.type }));
                fi.files = dt.files; f.appendChild(fi);
            }
            if (cheDo === 'nhanh') {
                /* Bước 3a: submit vào iframe ẩn trong popup, người dùng ở lại phần mềm; Help trả trang nhỏ gửi postMessage */
                var fr = popup.veil.querySelector('iframe[name="yh-nhanh"]');
                if (!fr) { fr = document.createElement('iframe'); fr.name = 'yh-nhanh'; fr.hidden = true; fr.setAttribute('title', 'Help nhận gửi nhanh'); popup.veil.appendChild(fr); }
                f.target = 'yh-nhanh';
                document.body.appendChild(f); f.submit();
                choHelpXacNhan(nc, noiDung);
            } else {
                /* Bước 3b: mở tab help-portal — nút duy nhất mở Help */
                f.target = CFG.target;
                document.body.appendChild(f);
                global.open('', CFG.target);   // mở / lấy lại tab trước khi submit để không bị chặn popup
                f.submit();
                thongBao('Đã gửi sang Cổng Help ở tab "' + CFG.target + '". Popup giữ nguyên ảnh và nội dung: nếu Help báo lỗi token, bấm gửi lại.', 'tot');
                khoaNut(false);
            }
            setTimeout(function () { if (f.parentNode) f.parentNode.removeChild(f); }, 3000);
        }).catch(function (e) {
            thongBao('Chưa gửi được: ' + e.message, 'canh');
            khoaNut(false);
        });
    }
    /* Chờ postMessage { loai: "help-ho-tro-xong", ok, id, url, soTuongTu } từ đúng origin Help; quá CFG.choMs thì báo và cho gửi lại */
    var choMsg = null;
    function huyCho() { if (choMsg) { global.removeEventListener('message', choMsg.fn); clearTimeout(choMsg.hen); choMsg = null; } }
    function choHelpXacNhan(nc, noiDung) {
        huyCho();
        var p = popup;
        function fn(ev) {
            if (ev.origin !== HELP_GOC) return;
            var d = ev.data || {}; if (d.loai !== 'help-ho-tro-xong') return;
            huyCho();
            if (!popup || popup !== p) return;
            khoaNut(false);
            if (!d.ok) { thongBao('Help chưa nhận: ' + (d.thongBao || d.loi || 'không rõ lý do') + '. Ảnh và nội dung vẫn còn, bấm gửi lại.', 'canh'); return; }
            themDongMoi(d, noiDung, nc);
            var tt = popup.veil.querySelector('[data-yh="tt"]'); tt.hidden = false; tt.className = 'yh-tt yh-tt--tot';
            tt.innerHTML = '<i class="fa-light fa-circle-check"></i> Đã gửi yêu cầu <b>' + esc(d.maHienThi || d.id || '') + '</b>.' +
                (d.soTuongTu > 0 ? ' Đã có ' + esc(d.soTuongTu) + ' người báo ở màn này.' : '') +
                (d.url ? ' <a href="' + esc(d.url) + '" target="' + esc(CFG.target) + '">Xem trên Help</a>' : '');
        }
        choMsg = { fn: fn, hen: setTimeout(function () {
            huyCho(); if (!popup || popup !== p) return;
            khoaNut(false); thongBao('Help chưa xác nhận sau ' + Math.round(CFG.choMs / 1000) + ' giây. Ảnh và nội dung vẫn còn, bấm gửi lại.', 'canh');
        }, CFG.choMs) };
        global.addEventListener('message', fn);
    }

    /* ---------- Bảng "Yêu cầu của tôi" — trượt từ mép phải (tài liệu mục 10) ---------- */
    var bang = null;
    var DM_MAC_DINH = [   // chỉ dùng khi chưa có phản hồi Help / dựng thử; mã thật lấy từ danh mục trangThai trong MỌI phản hồi (10.7)
        { ma: 'MOI', ten: 'Mới', mau: '#2563eb' }, { ma: 'DANG_XU_LY', ten: 'Đang xử lý', mau: '#d97706' },
        { ma: 'CHO_NGUOI_DUNG', ten: 'Chờ bạn trả lời', mau: '#7c3aed' }, { ma: 'DA_XU_LY', ten: 'Đã xử lý', mau: '#059669' },
        { ma: 'DA_DONG', ten: 'Đã đóng', mau: '#6b7280' }];
    function hai(n) { return (n < 10 ? '0' : '') + n; }
    function gioVN(d) { return hai(d.getDate()) + '/' + hai(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + hai(d.getHours()) + ':' + hai(d.getMinutes()); }
    function ngayVN(iso) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || ''); return m ? m[3] + '/' + m[2] + '/' + m[1] : ''; }
    function tuVN(s) { var m = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(s || ''); return m ? new Date(+m[3], m[2] - 1, +m[1]).getTime() : NaN; }

    function moBang() {
        if (bang) { dongBang(); return; }
        napCss();
        var ad = adapter(), nc = ad.nguCanh();
        var man = el('div', 'yh-man'), box = el('aside', 'yh-bang');
        box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', CFG.text);
        box.innerHTML =
            '<div class="yh-head"><i class="fa-light fa-life-ring"></i><span>' + esc(CFG.text) + '</span>' +
            '   <button type="button" class="yh-x" data-yh="dong" title="Đóng (Esc)"><i class="fa-light fa-xmark"></i></button></div>' +
            '<div class="yh-loc">' +
            '   <div class="yh-loc__hang"><label class="yh-tim"><i class="fa-light fa-magnifying-glass"></i><input type="search" data-loc="tuKhoa" maxlength="100" placeholder="Tìm trong tiêu đề, mô tả"></label>' +
            '      <button type="button" class="yh-tool" data-yh="taiLai" title="Tải lại danh sách"><i class="fa-light fa-rotate-right"></i></button></div>' +
            '   <div class="yh-chips" data-yh="chips"></div>' +
            '   <div class="yh-loc__hang yh-loc__hang--nho">' +
            '      <label class="yh-ck" title="' + esc(nc.ten ? 'Chỉ yêu cầu của màn: ' + nc.ten : 'Chưa mở chức năng nào') + '"><input type="checkbox" data-loc="chiMan"' + (nc.ma ? '' : ' disabled') + '><span>Chỉ màn đang mở</span></label>' +
            '      <label class="yh-ck" title="Thêm yêu cầu của người cùng trường ở các ứng dụng bạn được cấp"><input type="checkbox" data-loc="caTruong"><span>Cả trường</span></label></div>' +
            '   <div class="yh-loc__hang yh-loc__hang--nho"><span class="yh-loc__nhan">Cập nhật từ</span>' +
            '      <input type="date" data-loc="tuNgay" title="Cập nhật từ ngày"><span class="yh-loc__den">đến</span><input type="date" data-loc="denNgay" title="Cập nhật đến ngày"></div>' +
            '</div>' +
            '<div class="yh-ds" data-yh="ds"></div>' +
            '<div class="yh-bang__foot"><button type="button" class="yh-btn yh-btn--chinh yh-btn--rong" data-yh="tao"><i class="fa-light fa-plus"></i>Tạo yêu cầu mới</button></div>';
        document.body.appendChild(man); document.body.appendChild(box);
        requestAnimationFrame(function () { man.classList.add('is-mo'); box.classList.add('is-mo'); });
        bang = { box: box, man: man, ad: ad, nc: nc, dm: DM_MAC_DINH, loc: { tuKhoa: '', trangThai: '', chiMan: false, caTruong: false, tuNgay: '', denNgay: '' },
                 trang: 1, ds: [], tong: 0, dangTai: false, loi: '', lanGoi: 0 };
        veChips();

        var hen = null;
        man.addEventListener('click', dongBang);
        box.addEventListener('click', function (ev) {
            var c = ev.target.closest('[data-chip]');
            if (c) { bang.loc.trangThai = c.getAttribute('data-chip'); veChips(); tai(true); return; }
            var it = ev.target.closest('[data-yh="item"]');
            if (it) { ev.preventDefault(); var u = it.getAttribute('href'); if (u && u !== '#') global.open(u, CFG.target); return; }
            var b = ev.target.closest('[data-yh]'); if (!b) return;
            var k = b.getAttribute('data-yh');
            if (k === 'dong') dongBang();
            else if (k === 'taiLai' || k === 'thuLai') tai(true);
            else if (k === 'them') tai(false);
            else if (k === 'tao') taoMoi();
        });
        box.addEventListener('input', function (ev) {
            var i = ev.target.closest('[data-loc]'); if (!i) return;
            var k = i.getAttribute('data-loc');
            if (k === 'tuKhoa') { bang.loc.tuKhoa = i.value.trim(); clearTimeout(hen); hen = setTimeout(function () { if (bang) tai(true); }, 400); return; }
            if (i.type === 'checkbox') bang.loc[k] = i.checked; else bang.loc[k] = i.value;
            tai(true);
        });
        tai(true);
    }
    function dongBang() { if (!bang) return; var b = bang; bang = null; if (b.box.parentNode) b.box.parentNode.removeChild(b.box); if (b.man.parentNode) b.man.parentNode.removeChild(b.man); }
    function coLoc(l) { return !!(l.tuKhoa || l.trangThai || l.chiMan || l.tuNgay || l.denNgay); }
    function veChips() {
        var h = bang.box.querySelector('[data-yh="chips"]');
        h.innerHTML = [{ ma: '', ten: 'Tất cả' }].concat(bang.dm).map(function (d) {
            var on = (bang.loc.trangThai || '') === (d.ma || '');
            return '<button type="button" class="yh-chip' + (on ? ' is-on' : '') + '" data-chip="' + esc(d.ma || '') + '"' +
                   (d.mau ? ' style="--yh-mau:' + esc(d.mau) + '"' : '') + '>' + (d.mau ? '<i></i>' : '') + esc(d.ten) + '</button>';
        }).join('');
    }
    function veDs() {
        var b = bang, h = b.box.querySelector('[data-yh="ds"]'), dm = {};
        b.dm.forEach(function (d) { dm[d.ma] = d; });
        var html = '';
        if (b.loi && !b.ds.length) html = '<div class="yh-trong yh-trong--loi"><i class="fa-light fa-triangle-exclamation"></i><div>' + esc(b.loi) + '</div><button type="button" class="yh-btn" data-yh="thuLai"><i class="fa-light fa-rotate-right"></i>Thử lại</button></div>';
        else if (!b.ds.length && !b.dangTai) html = '<div class="yh-trong"><i class="fa-light fa-inbox"></i><div>' + (coLoc(b.loc) || b.loc.caTruong ? 'Không có yêu cầu nào khớp bộ lọc.' : 'Bạn chưa gửi yêu cầu hỗ trợ nào.') + '</div></div>';
        else html = b.ds.map(function (r) { return veDong(r, dm[r.trangThai]); }).join('');
        if (b.dangTai) html += '<div class="yh-dangtai"><i class="fa-light fa-spinner"></i>Đang tải…</div>';
        else if (b.ds.length && b.ds.length < b.tong) html += '<button type="button" class="yh-them" data-yh="them">Tải thêm (' + b.ds.length + ' / ' + b.tong + ')</button>';
        else if (b.loi) html += '<div class="yh-tt yh-tt--canh">' + esc(b.loi) + '</div>';
        h.innerHTML = html;
    }
    function veDong(r, tt) {
        var ten = tt ? tt.ten : (r.trangThai || ''), mau = (tt && tt.mau) || '#6b7280';
        return '<a class="yh-item' + (r.moi ? ' yh-item--moi' : '') + '" href="' + esc(r.url || '#') + '" data-yh="item" title="Mở yêu cầu trên Cổng Help">' +
            '<div class="yh-item__d1"><span class="yh-tag" style="--yh-mau:' + esc(mau) + '">' + esc(ten) + '</span><span class="yh-item__ma">' + esc(r.maHienThi || r.id || '') + '</span>' +
            (r.soPhanHoiMoi > 0 ? '<span class="yh-item__moi" title="Phản hồi chưa đọc">' + esc(r.soPhanHoiMoi) + '</span>' : '') + '</div>' +
            '<div class="yh-item__ten">' + esc(r.tieuDe || r.moTa || '(không có mô tả)') + '</div>' +
            '<div class="yh-item__meta"><span><i class="fa-light fa-window"></i>' + esc(r.ten || r.ma || '—') + '</span><span><i class="fa-light fa-clock"></i>' + esc(r.ngayCapNhat || r.ngayTao || '') + '</span>' +
            (r.cuaToi === false ? '<span><i class="fa-light fa-user"></i>' + esc(r.nguoiTao || 'người khác') + '</span>' : '') + '</div></a>';
    }
    function tai(lamMoi) {
        if (!bang) return;
        var b = bang;
        if (lamMoi) { b.trang = 1; b.ds = []; b.tong = 0; } else b.trang++;
        b.dangTai = true; b.loi = ''; veDs();
        var p = { v: CFG.v || b.nc.v || '2', phamVi: b.loc.caTruong ? 'truong' : 'toi', ma: b.loc.chiMan ? b.nc.ma : '', trangThai: b.loc.trangThai,
                  tuKhoa: b.loc.tuKhoa, tuNgay: ngayVN(b.loc.tuNgay), denNgay: ngayVN(b.loc.denNgay), trang: b.trang, kichCo: CFG.kichCo };
        var lan = ++b.lanGoi;
        layDanhSach(b.ad, p).then(function (kq) {
            if (bang !== b || lan !== b.lanGoi) return;
            if (kq.trangThai && kq.trangThai.length) { b.dm = kq.trangThai; veChips(); }
            b.ds = b.ds.concat(kq.ds || []);
            b.tong = kq.tong != null ? Number(kq.tong) : b.ds.length;
            b.dangTai = false; veDs();
        }, function (e) {
            if (bang !== b || lan !== b.lanGoi) return;
            if (!lamMoi) b.trang--;
            b.loi = e.message; b.dangTai = false; veDs();
        });
    }
    function layDanhSach(ad, p) {
        if (ad.demo()) return danhSachMau(p);
        return layToken(ad).then(function (tk) {
            var body = new URLSearchParams({ token: tk.token });
            Object.keys(p).forEach(function (k) { if (p[k] !== '' && p[k] != null) body.set(k, p[k]); });
            var ctl = global.AbortController ? new AbortController() : null;
            var hen = ctl ? setTimeout(function () { ctl.abort(); }, CFG.choMs) : null;
            return fetch(CFG.listUrl, { method: 'POST', body: body, mode: 'cors', credentials: 'omit', cache: 'no-store', signal: ctl ? ctl.signal : undefined })
                .then(function (r) { return r.text().then(function (t) {
                    var j = null; try { j = JSON.parse(t); } catch (e) { }
                    if (!j) throw new Error('Help trả HTTP ' + r.status + ', không phải JSON.');
                    if (!j.ok) throw new Error(j.thongBao || j.loi || ('Help trả HTTP ' + r.status));
                    return j;
                }); })
                .catch(function (e) { throw new Error(e.name === 'AbortError' ? 'Help không trả lời sau ' + Math.round(CFG.choMs / 1000) + ' giây.' : (e.message || 'Không gọi được Help.')); })
                .then(function (j) { clearTimeout(hen); return j; }, function (e) { clearTimeout(hen); throw e; });
        });
    }
    /* Dữ liệu mẫu cho chế độ dựng thử — cùng hình dạng JSON mục 10.2 (lọc, phân trang tại chỗ để thử bộ lọc) */
    var mauCache = null;
    function danhSachMau(p) {
        if (!mauCache) {
            var nc = (bang && bang.nc) || adapter().nguCanh();
            var mans = [[nc.ma || 'MAN-HIEN-TAI', nc.ten || 'Màn đang mở'], ['TC-THUTIEN', 'Thu tiền'], ['SV-HOSO', 'Hồ sơ sinh viên'], ['DKH-LOPHP', 'Lớp học phần'], ['NS-QUATRINH', 'Quá trình công tác']];
            var de = ['Không lưu được phiếu thu', 'Bảng điểm không hiện cột tổng', 'Nút Xuất Excel không phản hồi', 'Danh sách lớp thiếu sinh viên mới chuyển', 'Không chọn được năm học 2026-2027',
                      'Thông báo "Sai hàm" khi mở màn', 'In quyết định bị mất dấu tiếng Việt', 'Ảnh đại diện tải lên bị xoay', 'Không gửi được email nhắc nợ', 'Lọc theo khoa không ra kết quả',
                      'Mã lớp trùng khi thêm mới', 'Trang trắng sau khi đăng nhập lại', 'Số tín chỉ tính sai sau khi đổi lớp'];
            var tt = DM_MAC_DINH.map(function (d) { return d.ma; });
            mauCache = [];
            for (var i = 0; i < 26; i++) {
                var m = mans[i % mans.length], ng = new Date(Date.now() - i * 31 * 3600 * 1000), d = de[i % de.length] + (i >= de.length ? ' (lặp lại)' : '');
                mauCache.push({ id: 'mau-' + i, maHienThi: 'HT-' + (240 - i), url: HELP_GOC + '/help-master/van-de/mau-' + i, tieuDe: d, moTa: 'Mô tả mẫu của yêu cầu "' + d + '".',
                                ma: m[0], ten: m[1], v: nc.v || '2', trangThai: tt[(i * 3) % tt.length], ngayTao: gioVN(new Date(ng.getTime() - 5 * 3600 * 1000)), ngayCapNhat: gioVN(ng), _ng: ng.getTime(),
                                soPhanHoiMoi: i % 4 === 1 ? 1 + (i % 3) : 0, cuaToi: i % 5 !== 3, nguoiTao: i % 5 === 3 ? 'Người khác cùng trường' : '' });
            }
        }
        var ds = mauCache.filter(function (r) {
            if (p.phamVi !== 'truong' && r.cuaToi === false) return false;
            if (p.ma && r.ma !== p.ma) return false;
            if (p.trangThai && String(p.trangThai).split(',').indexOf(r.trangThai) < 0) return false;
            if (p.tuKhoa && (r.tieuDe + ' ' + r.moTa).toLowerCase().indexOf(String(p.tuKhoa).toLowerCase()) < 0) return false;
            if (p.tuNgay && r._ng < tuVN(p.tuNgay)) return false;
            if (p.denNgay && r._ng >= tuVN(p.denNgay) + 86400000) return false;
            return true;
        });
        var tr = Number(p.trang) || 1, kc = Number(p.kichCo) || 20;
        return new Promise(function (ok) { setTimeout(function () { ok({ ok: true, tong: ds.length, trang: tr, kichCo: kc, trangThai: DM_MAC_DINH, ds: ds.slice((tr - 1) * kc, tr * kc) }); }, 250); });
    }
    /* Gửi nhanh xong: chèn dòng mới lên đầu bảng bằng id / url Help trả, không gọi lại cửa danh sách (10.1) */
    function themDongMoi(d, noiDung, nc) {
        if (!bang) return;
        var dm = bang.dm[0] || {};
        bang.ds.unshift({ id: d.id, maHienThi: d.maHienThi || d.id, url: d.url, tieuDe: String(noiDung || '').split('\n')[0].slice(0, 120) || '(Gửi nhanh, chưa có mô tả)',
                          ma: nc.ma, ten: nc.ten, trangThai: dm.ma, ngayCapNhat: gioVN(new Date()), soPhanHoiMoi: 0, cuaToi: true, moi: true });
        bang.tong++; veDs();
        var h = bang.box.querySelector('[data-yh="ds"]'); if (h) h.scrollTop = 0;
    }
    /* "Tạo yêu cầu mới": giấu bảng trong khoảnh khắc chụp rồi mở popup bước 2 đè lên */
    function taoMoi() {
        var b = bang; if (!b) return moTuNut();
        b.box.hidden = true; b.man.hidden = true;
        function hien() { if (bang === b) { b.box.hidden = false; b.man.hidden = false; } }
        setTimeout(function () {
            chup().then(function (c) { hien(); moPopup(c, ''); }, function (e) { hien(); moPopup(null, e.message); });
        }, 80);
    }
    /* Esc đóng bảng (chỉ khi popup không mở; ô tìm đang có chữ thì để trình duyệt xoá chữ trước). Bắt ở pha capture và
       preventDefault để tầng chung của vỏ (ui.js: Esc = bấm nút Đóng của màn) không đóng luôn màn bên dưới. */
    document.addEventListener('keydown', function (ev) {
        if (ev.key !== 'Escape' || !bang || popup) return;
        var a = document.activeElement; if (a && a.tagName === 'INPUT' && a.type === 'search' && a.value) return;
        ev.preventDefault(); ev.stopPropagation(); dongBang();
    }, true);

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
        b.type = 'button'; b.title = CFG.text + ' — xem yêu cầu đã gửi và trạng thái, tạo yêu cầu mới kèm ảnh màn hình';
        b.addEventListener('click', moBang);
        document.body.appendChild(b);
    }

    /* Hỗ trợ dò lỗi ảnh chụp: btnYeuCauHoTro.taiAnh() trên console khi popup đang mở → tải ảnh trong popup về máy
       (anh-chup.png) và in thông số môi trường (tỷ lệ, kích thước cửa sổ, zoom, cuộn, trình duyệt) để gửi người làm plugin. */
    function taiAnh() {
        var c = popup && popup.canvas;
        var tt = { devicePixelRatio: global.devicePixelRatio, inner: global.innerWidth + 'x' + global.innerHeight, outer: global.outerWidth + 'x' + global.outerHeight,
                   zoomUocTinh: Math.round(global.outerWidth / global.innerWidth * 100) / 100, visualViewportScale: global.visualViewport ? global.visualViewport.scale : null,
                   scroll: global.scrollX + ',' + global.scrollY, docScrollHeight: document.documentElement.scrollHeight, bodyScrollHeight: document.body.scrollHeight,
                   canvas: c ? c.width + 'x' + c.height : '(chưa có popup)', ua: navigator.userAgent, url: location.href };
        console.log('[btn-yeucau-hotro] môi trường:', JSON.stringify(tt, null, 1));
        if (c && c.width > 1) { var a = document.createElement('a'); a.href = c.toDataURL('image/png'); a.download = 'anh-chup.png'; document.body.appendChild(a); a.click(); a.remove(); }
        return tt;
    }

    function dongPopup() { if (popup) { huyCho(); popup.dong(); popup = null; } }
    global.btnYeuCauHoTro = { config: CFG, mo: moBang, tao: moTuNut, dong: function () { dongPopup(); dongBang(); }, taiLai: function () { tai(true); },
                              adapter: null, adapters: adapters, dung: dungNut, taiAnh: taiAnh };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', dungNut); else dungNut();
})(window);
