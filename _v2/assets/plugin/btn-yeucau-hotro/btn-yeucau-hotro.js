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

   CHẾ ĐỘ NHÚNG (mục 11, Help trả lời 11.7, chủ dự án chốt 26/10) — công tắc `nhung` (mặc định TẮT = giữ mục 10; BẬT khi Help
   báo chế độ nhúng đã lên máy chủ, không làm hai nửa): popup chỉ còn một nút "Gửi" (cheDo = "nhung"), form target vào iframe
   trong popup; Help tạo yêu cầu rồi trả THẲNG trang vấn đề nhúng + postMessage help-ho-tro-xong → vùng ảnh / ô mô tả thu lại,
   iframe trao đổi chiếm chỗ. Bấm dòng trong bảng → popup trao đổi: POST token + id + v vào iframe tới /ho-tro/nhung (11.7).
   Nhận postMessage từ đúng origin Help: help-san-sang (tắt lối lui 10 giây), help-trang-thai / help-tin-moi (cập nhật dòng
   trong bảng, không gọi lại cửa danh sách), help-phien-het (phát token mới, gửi { loai: "app-token", token } vào iframe —
   KHÔNG POST lại để Help giữ nháp), help-loi. Chiều app → iframe: app-token, app-dong (trước khi đóng popup). Lối lui: không có
   help-san-sang sau choMs → báo + nút "Mở trong Help" (luôn hiện khi đã có url — Help đề nghị để trao đổi dài mở bản đầy đủ).
   Dựng thử: iframe nạp thu-nhung.html (giả lập trang nhúng Help, cùng thư mục).

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
        nhung: /^(1|true)$/i.test(String(cau.nhung != null ? cau.nhung : (ds.nhung || ''))), // mục 11: trao đổi ngay trong popup — BẬT khi Help báo trang nhúng đã lên máy chủ
        nhungUrl: cau.nhungUrl || ds.nhungUrl || 'https://con98.api-apis.com/help-master/ho-tro/nhung',   // mở yêu cầu cũ: POST token + id + v vào iframe (11.7)
        an: /^(1|true)$/i.test(String(cau.an != null ? cau.an : (ds.an || ''))),   // TẠM ẨN (vỏ v1, 2/11): nạp xong không dựng nút nổi, không hỏi Help; console `btnYeuCauHoTro.hien()` mới dựng
        huongDanUrl: cau.huongDanUrl || ds.huongDanUrl || 'https://con98.api-apis.com/help-master/huong-dan/khac/huong-dan-su-dung-chuc-nang-yeu-cau-ho-tro#thuc-hien',   // bài hướng dẫn dùng tính năng trên Help — nút "?" cạnh "Tạo yêu cầu mới" (người dùng 2/11)
        kichCo: Number(cau.kichCo || ds.kichCo || 20),                                      // số dòng mỗi lần tải (Help tối đa 50)
        choMs: Number(cau.choMs || ds.choMs || 10000),                                      // chờ Help trả lời (danh sách / postMessage) tối đa
        choChiaSeMs: Number(cau.choChiaSeMs || ds.choChiaSeMs || 30000),                    // chờ người dùng trả lời hộp "Chia sẻ tab" khi chụp thật
        v: cau.v || ds.v || '',                                                             // rỗng = lấy theo vỏ (_v2: help.version), mặc định "2"
        text: cau.text || ds.text || 'Yêu cầu hỗ trợ',
        target: cau.target || ds.target || 'help-portal',                                   // tên tab cố định (trùng tab của nút "?")
        maxRong: Number(cau.maxRong || ds.maxRong || 1600),                                 // thu ảnh về ≤ 1600px bề ngang
        maxBytes: Number(cau.maxBytes || ds.maxBytes || 900 * 1024),                        // TẠM 900 KB (27/10): nginx trước Help trên con98 chặn thân > 1 MB → 500; Help nới lên 5 MB thì trả về 5 * 1024 * 1024
        maxTep: Number(cau.maxTep || ds.maxTep || 5),                                       // số tệp đính kèm tối đa mỗi lần gửi (Help: tối đa 5 tệp)
        maxTepBytes: Number(cau.maxTepBytes || ds.maxTepBytes || 900 * 1024),               // TẠM 900 KB mỗi tệp — cùng lý do nginx con98 chặn thân > 1 MB như ảnh
        hoiMs: cau.hoiMs != null ? Number(cau.hoiMs) : (ds.hoiMs != null ? Number(ds.hoiMs) : 5 * 60 * 1000),   // chu kỳ hỏi tin mới để đổi màu nút; 0 = tắt hẳn
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
            /* sdt + phòng ban của người đang đăng nhập: dòng LayDanhSachNguoiDung khớp ID (máy chủ SSO không gọi được API này); nhớ kết quả cả phiên trang */
            nguoiDung: function () {
                var ums = global.ums, uid = String((ums.session && ums.session.userId) || '').toUpperCase();
                if (!uid || !ums.api) return Promise.resolve({ sdt: '', donvi: '' });
                if (adapters.v2._nd) return adapters.v2._nd;
                function trang(p) {
                    return ums.api.call({ action: 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikPJjQuKAU0LyYP', func: 'pkg_chung_quanlynguoidung.LayDanhSachNguoiDung',
                        strTuKhoa: '', strPhanLoaiDoiTuong: '', dTrangThai: 1, strChung_DonVi_Id: '', strVaiTro_Id: '', strCapXuLy_Id: '', strTinhThanh_Id: '',
                        pageIndex: p, pageSize: 500, silent: true }).then(function (r) {
                        var rows = (r && (r.data || r.Data)) || [];
                        var d = rows.filter(function (x) { return String(x.ID).toUpperCase() === uid; })[0];
                        if (d) return { sdt: d.SODIENTHOAI || '', donvi: d.TENDONVI || '' };
                        return rows.length < 500 || p >= 10 ? { sdt: '', donvi: '' } : trang(p + 1);
                    });
                }
                return (adapters.v2._nd = trang(1).catch(function () { return { sdt: '', donvi: '' }; }));
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
    /* CHỤP THẬT (người dùng chốt 26/10 — html2canvas tự vẽ lại DOM nên ảnh xô lệch: không hiểu gap của inline-flex, đo phông
       biểu tượng ::before khác trình duyệt, đè chữ…): Screen Capture API getDisplayMedia lấy ĐÚNG MỘT khung hình của tab rồi
       dừng luồng ngay — ảnh đúng pixel như mắt thấy. Trình duyệt hiện hộp "Chia sẻ tab này" mỗi lần (preferCurrentTab: tab hiện
       tại chọn sẵn). Không hỗ trợ / người dùng bỏ qua hộp → rơi về html2canvas (chupVe) như cũ. Cần https (isSecureContext). */
    var cachChup = '';   // 'that' | 've' — cách đã dùng ở lần chụp gần nhất, để nhắc khi phải vẽ lại
    function coChupThat() { return !!(global.isSecureContext && navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia); }
    /* Hộp "Allow … to see this tab?" là giao diện của trình duyệt, trang không vẽ đè lên được → đặt một dải gợi ý ở GIỮA CẠNH DƯỚI
       màn hình (hộp của trình duyệt nằm trên cùng, giữa) với mũi tên chỉ lên. Trả về hàm gỡ dải; gỡ ngay khi có luồng / bị từ chối
       để dải không lọt vào ảnh chụp. Nhãn nút tuỳ ngôn ngữ trình duyệt (Allow / Cho phép / Chia sẻ). */
    function hienGoiYChiaSe() {
        napCss();
        var g = el('div', 'yh-goiy', '<i class="fa-light fa-arrow-up"></i><div><b>Bấm nút "Allow" (hoặc "Cho phép" / "Chia sẻ") ở hộp phía trên</b>' +
            '<span>để ứng dụng chụp ảnh màn hình. Chỉ chụp một ảnh rồi dừng, không quay phim.</span></div>');
        g.setAttribute('role', 'status');
        goc().appendChild(g);
        return function () { if (g.parentNode) g.parentNode.removeChild(g); };
    }
    function chupThat() {
        /* Hộp chia sẻ không bao giờ trả lời (headless, trình duyệt lạ) → sau CFG.choChiaSeMs rơi về vẽ lại; luồng tới muộn thì tắt ngay */
        var qua = false, hen;
        var choHop = new Promise(function (_, loi) { hen = setTimeout(function () { qua = true; loi(new Error('hộp chia sẻ không trả lời')); }, CFG.choChiaSeMs); });
        var goiY = hienGoiYChiaSe();
        var xin = navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: 'browser' }, audio: false, preferCurrentTab: true,
                                                           selfBrowserSurface: 'include', surfaceSwitching: 'exclude', monitorTypeSurfaces: 'exclude' })
            .then(function (stream) { clearTimeout(hen); goiY(); if (qua) { stream.getTracks().forEach(function (t) { t.stop(); }); throw new Error('quá hạn'); } return stream; },
                  function (e) { clearTimeout(hen); goiY(); throw e; });
        return Promise.race([xin, choHop])
            .then(function (stream) {
                function tat() { stream.getTracks().forEach(function (t) { t.stop(); }); }
                return new Promise(function (ok, loi) {
                    var v = document.createElement('video'); v.srcObject = stream; v.muted = true; v.playsInline = true;
                    v.onloadedmetadata = function () {
                        v.play().then(function () {
                            setTimeout(function () {   // đợi khung hình đầu dựng xong rồi mới vẽ
                                try { var c = document.createElement('canvas'); c.width = v.videoWidth; c.height = v.videoHeight; c.getContext('2d').drawImage(v, 0, 0); ok(c); }
                                catch (e) { loi(e); }
                            }, 200);
                        }, loi);
                    };
                    v.onerror = function () { loi(new Error('không đọc được luồng chia sẻ')); };
                }).then(function (c) { tat(); return c; }, function (e) { tat(); throw e; });
            });
    }
    function chup() {
        var fab = document.querySelector('.yh-fab'); if (fab) fab.hidden = true;   // nút nổi không vào ảnh (CSS .yh-fab[hidden])
        function xong(c) { if (fab) fab.hidden = false; return c; }
        if (!coChupThat()) { cachChup = 've'; return chupVe().then(xong, function (e) { xong(); throw e; }); }
        return chupThat().then(function (c) { cachChup = 'that'; return xong(thuNho(c)); },
                               function () { cachChup = 've'; return chupVe().then(xong, function (e) { xong(); throw e; }); });
    }
    function nhacVeLai() {   // đã phải vẽ lại bằng html2canvas dù trình duyệt chụp thật được (người dùng bỏ qua hộp chia sẻ)
        if (cachChup === 've' && coChupThat()) thongBao('Bạn bỏ qua hộp "Chia sẻ tab" nên ảnh được vẽ lại bằng html2canvas, có thể lệch so với màn hình. Cần ảnh đúng hơn thì chụp bằng Win+Shift+S rồi dán bằng Ctrl+V.', 'nhe');
    }
    function chupVe() {
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
        me.c = canvas; me.ctx = canvas.getContext('2d', { willReadFrequently: true });   // getImageData nhiều lần (hoàn tác / kéo vẽ) — tắt cảnh báo Canvas2D
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

    /* ---------- Mức ảnh hưởng (tài liệu mục 12, 29/10): thap | binh-thuong | cao; tên / mô tả / màu lấy từ danh mục uuTien Help trả
       trong cửa danh sách (dmUt được thay mỗi lần có), chưa có thì dùng bảng này ---------- */
    var dmUt = [{ ma: 'thap', ten: 'Thấp', moTa: 'Góp ý, không ảnh hưởng công việc', mau: '#94A3B8' },
                { ma: 'binh-thuong', ten: 'Bình thường', moTa: 'Làm được nhưng vướng, hoặc chưa rõ ảnh hưởng', mau: '#64748B' },
                { ma: 'cao', ten: 'Cao', moTa: 'Không làm việc được, hoặc nhiều người cùng bị', mau: '#DC2626' }];
    function veUuTien(chon) {
        var cur = dmUt.filter(function (d) { return d.ma === chon; })[0] || dmUt[0];
        return '<div class="yh-ut__nhan">Mức ảnh hưởng</div><div class="yh-ut__nut">' + dmUt.map(function (d) {
            return '<button type="button" class="yh-ut__b' + (d.ma === chon ? ' is-on' : '') + '" data-ut="' + esc(d.ma) + '" style="--yh-mau:' + esc(d.mau || '#64748B') + '"><i></i>' + esc(d.ten) + '</button>';
        }).join('') + '</div><div class="yh-ut__mota">' + esc(cur.moTa || '') + '</div>';
    }

    /* ---------- Popup ---------- */
    var popup = null;
    /* chatNgay = true: mở để trao đổi về yêu cầu đã có (từ bảng) — không ảnh, không ô mô tả, không nút Gửi */
    function moPopup(anhDau, loiChup, chatNgay) {
        if (popup) dongPopup();
        var ad = adapter(), nc = ad.nguCanh(), vLan = CFG.v || nc.v || '2';
        var veil = el('div', 'yh-veil');
        var chanGui = CFG.nhung
            ? '     <button type="button" class="yh-btn yh-btn--phu" data-yh="moHelp" hidden title="Mở bản đầy đủ của yêu cầu này ở tab Help"><i class="fa-light fa-arrow-up-right-from-square"></i>Mở trong Help</button>' +
              '     <button type="button" class="yh-btn yh-btn--chinh" data-yh="gui" data-chedo="nhung"><i class="fa-light fa-paper-plane"></i>Gửi</button>'
            : '     <button type="button" class="yh-btn yh-btn--phu" data-yh="gui" data-chedo="chi-tiet"><i class="fa-light fa-list-check"></i>Chi tiết hơn</button>' +
              '     <button type="button" class="yh-btn yh-btn--chinh" data-yh="gui" data-chedo="nhanh"><i class="fa-light fa-paper-plane"></i>Gửi nhanh</button>';
        veil.innerHTML =
            '<div class="yh-popup" role="dialog" aria-label="' + esc(CFG.text) + '">' +
            '  <div class="yh-head"><i class="fa-light fa-life-ring"></i><span>' + esc(CFG.text) + '</span>' +
            '     <button type="button" class="yh-x" data-yh="dong" title="Đóng"><i class="fa-light fa-xmark"></i></button></div>' +
            '  <div class="yh-ngucanh">' +
            '     <span><i class="fa-light fa-window"></i>' + esc(nc.ten || '(chưa mở chức năng nào)') + '</span>' +
            (nc.ungDung ? '<span><i class="fa-light fa-cube"></i>' + esc(nc.ungDung) + '</span>' : '') +
            '     <span><i class="fa-light fa-code-branch"></i>Phiên bản ' + esc(vLan) + '</span>' +
            '     <span class="yh-item__ma" data-yh="ma" hidden></span><span class="yh-tag" data-yh="trangthai" hidden></span></div>' +
            '  <div class="yh-cc">' +
            '     <button type="button" class="yh-tool" data-tool="cat" title="Kéo chọn vùng rồi thả để cắt đúng khu vực muốn gửi"><i class="fa-light fa-crop-simple"></i>Cắt ảnh</button>' +
            '     <button type="button" class="yh-tool is-on" data-tool="khung" title="Đóng khung chỗ có vấn đề"><i class="fa-light fa-vector-square"></i>Khung</button>' +
            '     <button type="button" class="yh-tool" data-tool="muiten" title="Vẽ mũi tên chỉ vào chỗ có vấn đề"><i class="fa-light fa-arrow-up-right"></i>Mũi tên</button>' +
            '     <span class="yh-cc__cach"></span>' +
            '     <button type="button" class="yh-tool" data-yh="hoantac" title="Hoàn tác"><i class="fa-light fa-rotate-left"></i>Hoàn tác</button>' +
            '     <button type="button" class="yh-tool" data-yh="chuplai" hidden title="Chụp lại màn hình' + (coChupThat() ? ' (trình duyệt hỏi chia sẻ tab, chọn Chia sẻ)' : '') + '"><i class="fa-light fa-camera-rotate"></i>Chụp lại</button>' +
            '     <label class="yh-tool" hidden title="Chọn tệp ảnh khác"><i class="fa-light fa-image"></i>Ảnh khác<input type="file" accept="image/*" hidden></label>' +
            '     <button type="button" class="yh-tool" data-yh="boanh" hidden title="Gửi không kèm ảnh"><i class="fa-light fa-image-slash"></i>Bỏ ảnh</button>' +
            '     <span class="yh-cc__kt" data-yh="kt"></span></div>' +
            '  <div class="yh-anh"><canvas></canvas>' +
            '     <div class="yh-anh__trong" hidden><i class="fa-light fa-image-slash"></i><div>Chưa có ảnh. Dán ảnh bằng Ctrl+V (chụp bằng Win+Shift+S).</div></div></div>' +
            /* iframe nhận trả lời của Help: ẩn khi gửi nhanh (bước 3a); chế độ nhúng thì hiện làm khung trao đổi (mục 11) */
            '  <iframe name="yh-help" class="yh-chat" hidden title="Trao đổi với hỗ trợ"></iframe>' +
            '  <div class="yh-hoso" data-yh="hoso" hidden>' +
            '     <label><span>Số điện thoại <b>*</b></span><input type="tel" data-yh="sdt" maxlength="20" autocomplete="tel" placeholder="Số để hỗ trợ liên hệ"></label>' +
            '     <label><span>Phòng ban <b>*</b></span><input type="text" data-yh="donvi" maxlength="150" placeholder="Khoa / phòng / đơn vị của bạn"></label>' +
            '     <div class="yh-hoso__ghichu"><i class="fa-light fa-circle-info"></i><span>Hệ thống chưa có thông tin này của bạn. Chỉ cần nhập một lần, dùng cho báo cáo hỗ trợ.</span></div></div>' +
            '  <div class="yh-ut" data-yh="ut">' + veUuTien('binh-thuong') + '</div>' +
            '  <div class="yh-tep" hidden><label class="yh-btn yh-btn--phu yh-tep__chon" title="Gửi kèm ảnh, Word, Excel, PDF"><i class="fa-light fa-paperclip"></i>Đính kèm tài liệu' +
            '<input type="file" multiple hidden data-yh="tepIn" accept=".png,.jpg,.jpeg,.webp,.pdf,.doc,.docx,.xls,.xlsx,image/*"></label>' +
            '     <span class="yh-tep__ghi">Ảnh, Word, Excel, PDF — tối đa ' + CFG.maxTep + ' tệp, mỗi tệp ≤ ' + Math.round(CFG.maxTepBytes / 1024) + ' KB</span>' +
            '     <div class="yh-tep__ds" data-yh="tepDs"></div></div>' +
            '  <textarea class="yh-mota" maxlength="' + CFG.maxChu + '" placeholder="Mô tả: bạn đang làm gì, thấy gì (không bắt buộc' + (CFG.nhung ? '' : ' với Gửi nhanh') + ')"></textarea>' +
            '  <div class="yh-nhac"><i class="fa-light fa-circle-info"></i>Người gặp cùng vấn đề ở cùng trường với bạn sẽ nhìn thấy ảnh và nội dung này. Cắt bớt hoặc che phần không muốn gửi.</div>' +
            '  <div class="yh-tt" data-yh="tt" hidden></div>' +
            '  <div class="yh-foot">' +
            '     <button type="button" class="yh-btn" data-yh="dong"><i class="fa-light fa-xmark"></i>Đóng</button>' +
            '     <span class="yh-foot__cach"></span>' + chanGui + '</div>' +
            '</div>';
        goc().appendChild(veil);

        var canvas = veil.querySelector('canvas'), trong = veil.querySelector('.yh-anh__trong'), kt = veil.querySelector('[data-yh="kt"]');
        var ve = new TrinhVe(canvas);
        popup = { veil: veil, ve: ve, canvas: canvas, coAnh: false, nc: nc, v: vLan, chat: null, sanSangSom: false, uuTien: 'binh-thuong', teps: [] };
        function veTep() {
            veil.querySelector('[data-yh="tepDs"]').innerHTML = popup.teps.map(function (f, k) {
                return '<span class="yh-tep__it"><i class="fa-light fa-file"></i>' + esc(f.name) + ' <small>' + Math.max(1, Math.round(f.size / 1024)) + ' KB</small>' +
                       '<button type="button" data-xoa-tep="' + k + '" title="Bỏ tệp này"><i class="fa-light fa-xmark"></i></button></span>';
            }).join('');
        }
        veil.querySelector('[data-yh="tepIn"]').addEventListener('change', function () {
            var loi = [];
            Array.prototype.forEach.call(this.files || [], function (f) {
                if (popup.teps.length >= CFG.maxTep) { loi.push('Tối đa ' + CFG.maxTep + ' tệp.'); return; }
                if (f.size > CFG.maxTepBytes) { loi.push('"' + f.name + '" ' + Math.round(f.size / 1024) + ' KB vượt ' + Math.round(CFG.maxTepBytes / 1024) + ' KB.'); return; }
                popup.teps.push(f);
            });
            this.value = ''; veTep();
            if (loi.length) thongBao(loi.filter(function (m, k, a) { return a.indexOf(m) === k; }).join(' '), 'canh');
        });

        function capNhat() {
            popup.coAnh = canvas.width > 1 && canvas.height > 1;
            canvas.hidden = !popup.coAnh; trong.hidden = popup.coAnh;
            kt.textContent = popup.coAnh ? canvas.width + ' × ' + canvas.height : '';
        }
        ve.onThayDoi = capNhat;
        function datAnh(src) { canvas.width = src.width; canvas.height = src.height; canvas.getContext('2d').drawImage(src, 0, 0); ve.stack = []; capNhat(); }
        if (anhDau) { datAnh(anhDau); nhacVeLai(); } else { canvas.width = 1; canvas.height = 1; capNhat(); }
        if (loiChup) thongBao('Không tự chụp được màn hình (' + loiChup + '). Bạn vẫn gửi được: dán ảnh bằng Ctrl+V.', 'canh');

        veil.addEventListener('click', function (ev) {
            var xt = ev.target.closest('[data-xoa-tep]');
            if (xt) { popup.teps.splice(Number(xt.getAttribute('data-xoa-tep')), 1); veTep(); return; }
            var u = ev.target.closest('[data-ut]');
            if (u) { popup.uuTien = u.getAttribute('data-ut'); veil.querySelector('[data-yh="ut"]').innerHTML = veUuTien(popup.uuTien); return; }
            var t = ev.target.closest('[data-tool]');
            if (t) { ve.tool = t.getAttribute('data-tool'); veil.querySelectorAll('[data-tool]').forEach(function (b) { b.classList.toggle('is-on', b === t); }); return; }
            var b = ev.target.closest('[data-yh]'); if (!b) return;
            var k = b.getAttribute('data-yh');
            if (k === 'dong') dongPopup();
            else if (k === 'hoantac') { if (!ve.hoanTac()) thongBao('Không còn gì để hoàn tác.', 'nhe'); }
            else if (k === 'chuplai') chupLai();
            else if (k === 'boanh') { if (!popup.coAnh) return; ve.luu(); canvas.width = 1; canvas.height = 1; capNhat(); thongBao('Đã bỏ ảnh — form gửi đi sẽ không có trường anh. "Hoàn tác" lấy lại ảnh.', 'nhe'); }
            else if (k === 'gui') gui(b.getAttribute('data-chedo'), b);
            else if (k === 'moHelp') { if (popup.chat && popup.chat.url) global.open(popup.chat.url, CFG.target); }
        });
        veil.querySelector('input[type=file]').addEventListener('change', function () {
            var f = this.files && this.files[0]; this.value = ''; if (f) napTep(f);
        });
        veil.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') { ev.stopPropagation(); dongPopup(); } });
        document.addEventListener('paste', onPaste);
        if (!chatNgay) setTimeout(function () { var ta = veil.querySelector('.yh-mota'); if (ta) ta.focus(); }, 50);
        if (!chatNgay && !ad.demo()) napHoSo(ad);

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
                chup().then(function (c) { veil.hidden = false; ve.thay(c); thongBao('Đã chụp lại.', 'nhe'); nhacVeLai(); },
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
                var q = [0.85, 0.7, 0.55, 0.4], i = 0;        // PNG quá ngưỡng → JPEG, hạ dần chất lượng tới khi lọt ngưỡng
                (function thu() { c.toBlob(function (j) { if ((j && j.size <= CFG.maxBytes) || ++i >= q.length) ok(j); else thu(); }, 'image/jpeg', q[i]); })();
            }, 'image/png');
        });
    }
    /* ---------- Số điện thoại + phòng ban (bắt buộc ở yêu cầu đầu — phục vụ báo cáo) ----------
       Không lưu ở trình duyệt: Help giữ thông tin này theo người gửi (trường sdt / donvi của form gửi). Nguồn theo thứ tự:
       dòng người dùng trên API → Help (cửa danh sách trả hoSo của người này, nên đổi máy không phải nhập lại).
       Thiếu một trong hai thì hiện ô nhập. hoSoPhien chỉ nhớ trong phiên trang, để lần mở popup sau chưa phải chờ Help ghi nhận. */
    var hoSoPhien = null;
    /* Số yêu cầu đã gửi của người này theo cửa danh sách (phamVi=toi, KHÔNG lọc): null = chưa biết. = 0 là YÊU CẦU ĐẦU TIÊN → popup luôn
       hiện ô số điện thoại / phòng ban (điền sẵn nếu có) và bấm "Tạo yêu cầu mới" hiện hướng dẫn nhanh (người dùng 2/11). Cập nhật ở mọi chỗ
       gọi cửa danh sách không lọc (bảng, hỏi tin mới, napHoSo) và +1 khi Help xác nhận đã nhận. */
    var soYeuCauToi = null;
    function ghiSoYeuCau(kq) { if (kq && kq.tong != null && !isNaN(Number(kq.tong))) soYeuCauToi = Number(kq.tong); }
    function chuanHoSo(x) { x = x || {}; return { sdt: String(x.sdt || x.soDienThoai || '').trim(), donvi: String(x.donvi || x.donVi || x.phongBan || '').trim() }; }
    function gopHoSo() {
        var r = { sdt: '', donvi: '' };
        for (var i = 0; i < arguments.length; i++) { var h = chuanHoSo(arguments[i]); r.sdt = r.sdt || h.sdt; r.donvi = r.donvi || h.donvi; }
        return r;
    }
    /* Help trả hồ sơ ở j.hoSo (cửa danh sách, phamVi=toi); cùng lời gọi lấy luôn tong → soYeuCauToi. Hồ sơ KHÔNG suy từ ds (danh sách rỗng
       chỉ nói là yêu cầu đầu tiên, không nói Help chưa có hồ sơ) */
    function hoSoTuHelp(ad) {
        return layDanhSach(ad, { v: CFG.v || '2', phamVi: 'toi', trang: 1, kichCo: 1 }).then(function (j) {
            ghiSoYeuCau(j);
            return chuanHoSo(j && j.hoSo);
        }, function () { return { sdt: '', donvi: '' }; });
    }
    function napHoSo(ad) {
        var p = popup; if (!p) return;
        function ve(h) {
            if (popup !== p) return;
            var khung = p.veil.querySelector('[data-yh="hoso"]'), a = khung.querySelector('[data-yh="sdt"]'), b = khung.querySelector('[data-yh="donvi"]');
            if (!a.value) a.value = h.sdt; if (!b.value) b.value = h.donvi;   // người dùng đã gõ dở thì giữ
            var du = !!(a.value && b.value), dau = soYeuCauToi === 0;
            khung.hidden = du && !dau;
            khung.querySelector('.yh-hoso__ghichu span').textContent = du && dau
                ? 'Yêu cầu đầu tiên của bạn: kiểm tra lại số điện thoại và phòng ban để hỗ trợ liên hệ đúng người.'
                : 'Hệ thống chưa có thông tin này của bạn. Chỉ cần nhập một lần, dùng cho báo cáo hỗ trợ.';
        }
        var h = gopHoSo(hoSoPhien); ve(h);
        if (h.sdt && h.donvi && soYeuCauToi != null) return;
        (ad.nguoiDung ? ad.nguoiDung() : Promise.resolve(null)).then(function (nd) {
            h = gopHoSo(hoSoPhien, nd); ve(h);
            if (h.sdt && h.donvi && soYeuCauToi != null) return;
            return hoSoTuHelp(ad).then(function (hh) { ve(gopHoSo(h, hh)); });   // hỏi Help: lấy hồ sơ còn thiếu và / hoặc số yêu cầu đã gửi
        });
    }
    /* Đọc + kiểm hai ô; trả về hồ sơ đủ hoặc null (đã báo lỗi, đưa con trỏ vào ô thiếu) */
    function hoSoDeGui(ad) {
        var khung = popup.veil.querySelector('[data-yh="hoso"]');
        var a = khung.querySelector('[data-yh="sdt"]'), b = khung.querySelector('[data-yh="donvi"]');
        var hs = { sdt: (a.value || '').trim(), donvi: (b.value || '').trim() };
        a.classList.remove('is-loi'); b.classList.remove('is-loi');
        var loi = null;
        if (!hs.sdt) { a.classList.add('is-loi'); loi = a; }
        else if (!/^[0-9+().\s-]{8,20}$/.test(hs.sdt)) { a.classList.add('is-loi'); loi = a; }
        if (!hs.donvi) { b.classList.add('is-loi'); loi = loi || b; }
        if (loi) {
            khung.hidden = false;
            thongBao(!hs.sdt || !hs.donvi ? 'Cần nhập số điện thoại và phòng ban trước khi gửi yêu cầu đầu tiên.' : 'Số điện thoại chưa đúng (8–20 ký tự số).', 'canh');
            loi.focus(); return null;
        }
        hoSoPhien = hs;
        return hs;
    }
    function layToken(ad, hs) {
        return Promise.all([ad.roles(), hs ? hs : (ad.nguoiDung ? ad.nguoiDung() : { sdt: '', donvi: '' })]).then(function (kq) {
            var roles = kq[0], nd = hs || gopHoSo(hoSoPhien, kq[1]);
            var body = new URLSearchParams({ roles: JSON.stringify(roles), uid: ad.uid() || '', sdt: nd.sdt || '', donvi: nd.donvi || '', json: '1' });
            return fetch(CFG.tokenUrl, { method: 'POST', body: body, credentials: 'same-origin', cache: 'no-store' })
                .then(function (r) { return r.text().then(function (t) { var j; try { j = JSON.parse(t); } catch (e) { throw new Error('HTTP ' + r.status + ' — ' + t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160)); } if (!j.token) throw new Error(j.error || 'không có token'); return j; }); });
        });
    }
    /* Origin Help đọc ĐỘNG từ CFG.url mỗi lần dùng — đổi config.url trên console (ví dụ sang máy dev Help localhost:3001) là lọc postMessage theo origin mới ngay */
    function helpGoc() { try { return new URL(CFG.url, location.href).origin; } catch (e) { return ''; } }
    function khoaNut(khoa) { if (popup) popup.veil.querySelectorAll('[data-yh="gui"]').forEach(function (b) { b.disabled = !!khoa; }); }
    function gui(cheDo, nut) {
        if (!popup) return;
        var ad = adapter(), nc = popup.nc;
        var noiDung = popup.veil.querySelector('.yh-mota').value.trim().slice(0, CFG.maxChu);
        if (ad.demo()) {
            if (cheDo === 'nhung') {
                /* dựng thử chế độ nhúng: thêm dòng mẫu rồi vào thẳng khung trao đổi với trang giả lập Help */
                var dMau = { id: 'mau-' + Date.now(), maHienThi: 'HT-mẫu', url: '' };
                themDongMoi(dMau, noiDung, nc);
                vaoChat(dMau);
                popup.veil.querySelector('iframe[name="yh-help"]').src = GOC + 'thu-nhung.html?id=' + encodeURIComponent(dMau.id) + '&ma=' + encodeURIComponent(dMau.maHienThi) + '&moi=1';
            } else if (cheDo === 'nhanh') {
                themDongMoi({ id: 'mau-' + Date.now(), maHienThi: 'HT-mẫu', url: '#' }, noiDung, nc);
                thongBao('Chế độ dựng thử trên máy: không có phiên đăng nhập để phát token nên không gửi sang Help; đã thêm một dòng mẫu vào bảng để xem luồng.', 'canh');
            } else thongBao('Chế độ dựng thử trên máy: không có phiên đăng nhập để phát token, nên không gửi sang Help. Mọi bước chụp / sửa / cắt ảnh vẫn thử được.', 'canh');
            return;
        }
        if (!nc.ma) { thongBao('Chưa mở chức năng nào nên không biết gửi cho màn hình nào. Mở màn hình đang mắc rồi bấm lại.', 'canh'); return; }
        var hoSo = hoSoDeGui(ad); if (!hoSo) return;
        khoaNut(true);
        thongBao('Đang phát token và gửi…', 'nhe');
        Promise.all([layToken(ad, hoSo), anhBlob()]).then(function (kq) {
            var tk = kq[0], anh = kq[1];
            if (anh && anh.size > CFG.maxBytes) throw new Error('Ảnh ' + (anh.size / 1024).toFixed(0) + ' KB vượt ngưỡng ' + Math.round(CFG.maxBytes / 1024) + ' KB — cắt bớt rồi gửi lại.');
            var f = document.createElement('form');
            f.method = 'POST'; f.enctype = 'multipart/form-data'; f.action = CFG.url; f.style.display = 'none';
            function them(n, v) { var i = document.createElement('input'); i.type = 'hidden'; i.name = n; i.value = v == null ? '' : String(v); f.appendChild(i); }
            them('token', tk.token); them('ma', nc.ma); them('ten', String(nc.ten || '').slice(0, 200)); them('duong', String(nc.duong || '').slice(0, 300));
            them('v', popup.v); them('cheDo', cheDo); them('noiDung', noiDung); them('uutien', popup.uuTien || 'binh-thuong');
            them('sdt', hoSo.sdt); them('donvi', hoSo.donvi);
            them('route', nc.route || ''); them('appVersion', (global.ums && global.ums.ban) || ''); them('browser', navigator.userAgent);
            if (anh) {
                var fi = document.createElement('input'); fi.type = 'file'; fi.name = 'anh';
                var dt = new DataTransfer(); dt.items.add(new File([anh], 'man-hinh.' + (anh.type === 'image/jpeg' ? 'jpg' : 'png'), { type: anh.type }));
                fi.files = dt.files; f.appendChild(fi);
            }
            popup.teps.forEach(function (t) {   // tệp đính kèm: mỗi tệp một trường "tep" (tên trường chờ Help xác nhận)
                var ft = document.createElement('input'); ft.type = 'file'; ft.name = 'tep';
                var d2 = new DataTransfer(); d2.items.add(t); ft.files = d2.files; f.appendChild(ft);
            });
            if (cheDo === 'nhanh' || cheDo === 'nhung') {
                /* Bước 3a: submit vào iframe trong popup, người dùng ở lại phần mềm; Help trả trang nhỏ gửi postMessage.
                   Chế độ nhúng (mục 11): Help trả THẲNG trang vấn đề nhúng vào iframe này; help-ho-tro-xong → vaoChat() hiện nó. */
                f.target = 'yh-help';
                if (cheDo === 'nhung') batNghe();   // help-san-sang có thể tới trước help-ho-tro-xong
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
            if (ev.origin !== helpGoc()) return;
            var d = ev.data || {}; if (d.loai !== 'help-ho-tro-xong') return;
            huyCho();
            if (!popup || popup !== p) return;
            khoaNut(false);
            if (!d.ok) { thongBao('Help chưa nhận: ' + (d.thongBao || d.loi || 'không rõ lý do') + '. Ảnh và nội dung vẫn còn, bấm gửi lại.', 'canh'); return; }
            soYeuCauToi = (soYeuCauToi || 0) + 1;   // hết là "yêu cầu đầu tiên"
            themDongMoi(d, noiDung, nc);
            if (CFG.nhung) { vaoChat(d); return; }   // mục 11: iframe đã là trang vấn đề nhúng → thu ảnh / mô tả, hiện khung trao đổi
            var tt = popup.veil.querySelector('[data-yh="tt"]'); tt.hidden = false; tt.className = 'yh-tt yh-tt--tot';
            tt.innerHTML = '<i class="fa-light fa-circle-check"></i> Đã gửi yêu cầu <b>' + esc(d.maHienThi || d.id || '') + '</b>.' +
                (d.soTuongTu > 0 ? ' Đã có ' + esc(d.soTuongTu) + ' người báo ở màn này.' : '') +
                (d.url ? ' <a href="' + esc(d.url) + '" target="' + esc(CFG.target) + '">Xem trên Help</a>' : '');
        }
        choMsg = { fn: fn, hen: setTimeout(function () {
            huyCho(); if (!popup || popup !== p) return;
            khoaNut(false);
            /* Hiện iframe để thấy Help thực sự trả gì (401 token, lỗi máy chủ, trang không postMessage…) — đang ẩn thì không dò được */
            var fr = khungHelp(); if (fr) fr.hidden = false;
            thongBao('Help chưa xác nhận sau ' + Math.round(CFG.choMs / 1000) + ' giây. Bên dưới là trang Help trả về trong khung; ảnh và nội dung vẫn còn, bấm gửi lại.', 'canh');
        }, CFG.choMs) };
        global.addEventListener('message', fn);
    }

    /* ---------- Chế độ nhúng (mục 11, Help chốt 11.7): trao đổi với hỗ trợ ngay trong popup ---------- */
    function gocHelp() { return adapter().demo() ? location.origin : helpGoc(); }   // dựng thử: trang giả lập cùng origin
    function khungHelp() { return popup && popup.veil.querySelector('iframe[name="yh-help"]'); }
    /* Chuyển popup sang chế độ trao đổi: thu ảnh + mô tả + thanh vẽ, hiện iframe, mã + nhãn trạng thái lên dòng ngữ cảnh,
       bật lối lui: không có help-san-sang sau CFG.choMs → báo kèm nút "Mở trong Help" */
    function vaoChat(info) {
        if (!popup) return;
        var p = popup, v = p.veil, url = info.url && info.url !== '#' ? info.url : '';
        p.chat = { id: info.id, url: url, sanSang: !!p.sanSangSom, hen: null };
        ['.yh-cc', '.yh-anh', '.yh-mota', '.yh-nhac', '.yh-ut', '.yh-tep', '.yh-hoso'].forEach(function (s) { var e = v.querySelector(s); if (e) e.hidden = true; });
        v.querySelectorAll('[data-yh="gui"]').forEach(function (b) { b.hidden = true; });
        khungHelp().hidden = false;
        var ma = v.querySelector('[data-yh="ma"]'); ma.hidden = false; ma.textContent = info.maHienThi || info.id || '';
        datTrangThai(info);
        var mo = v.querySelector('[data-yh="moHelp"]'); if (mo) mo.hidden = !url;
        batNghe();
        if (p.chat.sanSang) { v.querySelector('[data-yh="tt"]').hidden = true; return; }
        thongBao('Đang mở khung trao đổi với hỗ trợ…', 'nhe');
        p.chat.hen = setTimeout(function () {
            if (popup !== p || p.chat.sanSang) return;
            loiNhung('Không mở được khung trao đổi trong popup sau ' + Math.round(CFG.choMs / 1000) + ' giây (trình duyệt chặn khung hoặc Help chưa trả lời).');
        }, CFG.choMs);
    }
    function loiNhung(msg) {
        if (!popup || !popup.chat) return;
        var mo = popup.veil.querySelector('[data-yh="moHelp"]'), coUrl = !!popup.chat.url;
        thongBao(msg + (coUrl ? ' Bấm "Mở trong Help" để tiếp tục ở tab Help.' : ''), 'canh');
        if (mo && coUrl) { mo.hidden = false; mo.classList.add('yh-btn--chinh'); }
    }
    function datTrangThai(d) {   // d: { trangThai, ten?, mau? } — ten / mau Help gửi kèm (help-trang-thai) hoặc tra danh mục của bảng
        var t = popup && popup.veil.querySelector('[data-yh="trangthai"]'); if (!t) return;
        var dm = ((bang && bang.dm) || DM_MAC_DINH).filter(function (x) { return x.ma === d.trangThai; })[0] || {};
        var ten = d.ten || dm.ten || d.trangThai || '';
        t.hidden = !ten; t.textContent = ten; t.style.setProperty('--yh-mau', d.mau || dm.mau || '#6b7280');
    }
    /* Một trình nghe postMessage cho cả phiên trao đổi (11.3); chỉ nhận từ đúng origin Help. help-ho-tro-xong do choHelpXacNhan nhận. */
    var ngheChat = null;
    function batNghe() {
        if (ngheChat) return;
        ngheChat = function (ev) {
            if (ev.origin !== gocHelp() || !popup) return;
            var d = ev.data; if (!d || typeof d.loai !== 'string') return;
            var c = popup.chat;
            if (!c) { if (d.loai === 'help-san-sang') popup.sanSangSom = true; return; }
            if (d.loai === 'help-san-sang') { c.sanSang = true; clearTimeout(c.hen); var tt = popup.veil.querySelector('[data-yh="tt"]'); if (tt) tt.hidden = true; }
            else if (d.loai === 'help-trang-thai') { datTrangThai(d); capNhatDong(d.id || c.id, { trangThai: d.trangThai, uuTien: d.uuTien || undefined }, d); }
            else if (d.loai === 'help-tin-moi') capNhatDong(d.id || c.id, { soPhanHoiMoi: Number(d.soChuaDoc) || 0 });
            else if (d.loai === 'help-phien-het') giaHan();
            else if (d.loai === 'help-loi') loiNhung('Help báo lỗi: ' + (d.thongBao || d.loi || 'không rõ') + '.');
        };
        global.addEventListener('message', ngheChat);
    }
    function tatNghe() { if (ngheChat) { global.removeEventListener('message', ngheChat); ngheChat = null; } }
    function guiVaoKhung(msg) { var fr = khungHelp(); if (fr && fr.contentWindow) fr.contentWindow.postMessage(msg, gocHelp()); }
    /* Phiên nhúng hết (help-phien-het): phát token SSO mới rồi gửi { loai: "app-token", token } vào iframe — KHÔNG POST lại,
       Help đổi access token tại chỗ, giữ nháp và vị trí cuộn (11.7) */
    function giaHan() {
        var ad = adapter(), p = popup;
        (ad.demo() ? Promise.resolve({ token: 'mau-' + Date.now() }) : layToken(ad)).then(
            function (tk) { if (popup === p) guiVaoKhung({ loai: 'app-token', token: tk.token }); },
            function (e) { if (popup === p) loiNhung('Không phát được token mới (' + e.message + ').'); });
    }
    /* Cập nhật một dòng trong bảng theo postMessage (không gọi lại cửa danh sách); mã trạng thái lạ thì thêm vào danh mục */
    function capNhatDong(id, patch, tt) {
        if (!bang || !id) return;
        var r = bang.ds.filter(function (x) { return x.id === id; })[0]; if (!r) return;
        Object.keys(patch).forEach(function (k) { if (patch[k] !== undefined) r[k] = patch[k]; });
        if (tt && tt.trangThai && !bang.dm.some(function (x) { return x.ma === tt.trangThai; })) { bang.dm.push({ ma: tt.trangThai, ten: tt.ten || tt.trangThai, mau: tt.mau || '' }); veChips(); }
        veDs();
    }
    /* Bấm dòng trong bảng: popup trao đổi về yêu cầu đã có — POST token + id + v vào iframe tới cửa /ho-tro/nhung (11.7) */
    function moChat(r) {
        if (!r || !r.id) return;
        var ad = adapter();
        if (r.soPhanHoiMoi > 0) capNhatDong(r.id, { soPhanHoiMoi: 0 });   // mở xem = coi như đã đọc ngay trên dòng; Help chưa ghi đọc (khung lỗi) thì lần tải danh sách sau số hiện lại
        moPopup(null, '', true);
        var p = popup;
        vaoChat({ id: r.id, maHienThi: r.maHienThi, url: r.url, trangThai: r.trangThai });
        if (ad.demo()) { khungHelp().src = GOC + 'thu-nhung.html?id=' + encodeURIComponent(r.id) + '&ma=' + encodeURIComponent(r.maHienThi || ''); return; }
        layToken(ad).then(function (tk) {
            if (popup !== p) return;
            var f = document.createElement('form'); f.method = 'POST'; f.action = CFG.nhungUrl; f.target = 'yh-help'; f.style.display = 'none';
            [['token', tk.token], ['id', r.id], ['v', p.v]].forEach(function (kv) { var i = document.createElement('input'); i.type = 'hidden'; i.name = kv[0]; i.value = kv[1] == null ? '' : String(kv[1]); f.appendChild(i); });
            document.body.appendChild(f); f.submit();
            setTimeout(function () { if (f.parentNode) f.parentNode.removeChild(f); }, 3000);
        }, function (e) { if (popup === p) loiNhung('Không phát được token (' + e.message + ').'); });
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
        datBaoMoi(0);   // mở bảng = người dùng đã thấy tin mới: nút về màu thường (bảng tự tải danh sách có dòng chưa đọc)
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
            '      <label class="yh-ck" title="' + esc(nc.ten ? 'Chỉ yêu cầu của màn: ' + nc.ten : 'Chưa mở chức năng nào') + '"><input type="checkbox" data-loc="chiMan"' + (nc.ma ? '' : ' disabled') + '><span>Chỉ màn đang mở</span></label></div>' +
            '   <div class="yh-loc__hang yh-loc__hang--nho"><span class="yh-loc__nhan">Cập nhật từ</span>' +
            '      <input type="date" data-loc="tuNgay" title="Cập nhật từ ngày"><span class="yh-loc__den">đến</span><input type="date" data-loc="denNgay" title="Cập nhật đến ngày"></div>' +
            '</div>' +
            '<div class="yh-ds" data-yh="ds"></div>' +
            '<div class="yh-bang__foot"><button type="button" class="yh-btn yh-btn--chinh yh-btn--rong" data-yh="tao"><i class="fa-light fa-plus"></i>Tạo yêu cầu mới</button>' +
            (CFG.huongDanUrl ? '<a class="yh-hoi" href="' + esc(CFG.huongDanUrl) + '" target="' + esc(CFG.target) + '" rel="noopener" title="Hướng dẫn sử dụng tính năng Yêu cầu hỗ trợ (mở trên Cổng Help)" aria-label="Hướng dẫn sử dụng"><i class="fa-light fa-question"></i></a>' : '') + '</div>';
        var hostB = goc(); hostB.appendChild(man); hostB.appendChild(box);
        requestAnimationFrame(function () { man.classList.add('is-mo'); box.classList.add('is-mo'); });
        bang = { box: box, man: man, ad: ad, nc: nc, dm: DM_MAC_DINH, loc: { tuKhoa: '', trangThai: '', chiMan: false,tuNgay: '', denNgay: '' },
                 trang: 1, ds: [], tong: 0, dangTai: false, loi: '', lanGoi: 0 };
        veChips();

        var hen = null;
        man.addEventListener('click', dongBang);
        box.addEventListener('click', function (ev) {
            var c = ev.target.closest('[data-chip]');
            if (c) { bang.loc.trangThai = c.getAttribute('data-chip'); veChips(); tai(true); return; }
            var it = ev.target.closest('[data-yh="item"]');
            if (it) {
                ev.preventDefault();
                if (CFG.nhung) { var r = bang.ds.filter(function (x) { return x.id === it.getAttribute('data-id'); })[0]; if (r) moChat(r); return; }   // mục 11: trao đổi trong popup
                var u = it.getAttribute('href'); if (u && u !== '#') global.open(u, CFG.target); return;
            }
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
        else if (!b.ds.length && !b.dangTai) html = '<div class="yh-trong"><i class="fa-light fa-inbox"></i><div>' + (coLoc(b.loc) ?'Không có yêu cầu nào khớp bộ lọc.' : 'Bạn chưa gửi yêu cầu hỗ trợ nào.') + '</div></div>';
        else html = b.ds.map(function (r) { return veDong(r, dm[r.trangThai]); }).join('');
        if (b.dangTai) html += '<div class="yh-dangtai"><i class="fa-light fa-spinner"></i>Đang tải…</div>';
        else if (b.ds.length && b.ds.length < b.tong) html += '<button type="button" class="yh-them" data-yh="them">Tải thêm (' + b.ds.length + ' / ' + b.tong + ')</button>';
        else if (b.loi) html += '<div class="yh-tt yh-tt--canh">' + esc(b.loi) + '</div>';
        h.innerHTML = html;
    }
    function veDong(r, tt) {
        var ten = tt ? tt.ten : (r.trangThai || ''), mau = (tt && tt.mau) || '#6b7280';
        var ut = (r.trangThai === 'DA_DONG' || r.trangThai === 'DA_XU_LY') ? null : dmUt.filter(function (d) { return d.ma === r.uuTien && (d.ma === 'cao' || d.ma === 'thap'); })[0];
        return '<a class="yh-item' + (r.moi ? ' yh-item--moi' : '') + '" href="' + esc(r.url || '#') + '" data-yh="item" data-id="' + esc(r.id || '') + '" title="' + (CFG.nhung ? 'Trao đổi với hỗ trợ về yêu cầu này' : 'Mở yêu cầu trên Cổng Help') + '">' +
            '<div class="yh-item__d1"><span class="yh-tag" style="--yh-mau:' + esc(mau) + '">' + esc(ten) + '</span><span class="yh-item__ma">' + esc(r.maHienThi || r.id || '') + '</span>' +
            (ut ? '<span class="yh-item__ut" style="--yh-mau:' + esc(ut.mau || '#64748B') + '" title="Mức ảnh hưởng: ' + esc(ut.ten) + '">' + esc(ut.ten) + '</span>' : '') +
            (r.soPhanHoiMoi > 0 ? '<span class="yh-item__moi" title="Phản hồi chưa đọc">' + esc(r.soPhanHoiMoi) + '</span>' : '') + '</div>' +
            '<div class="yh-item__ten' + (r.trangThai === 'DA_DONG' ? ' yh-item__ten--dong' : (r.soPhanHoiMoi > 0 ? ' yh-item__ten--chuadoc' : '')) + '">' + esc(r.tieuDe || r.moTa || '(không có mô tả)') + '</div>' +
            '<div class="yh-item__meta"><span><i class="fa-light fa-window"></i>' + esc(r.ten || r.ma || '—') + '</span><span><i class="fa-light fa-clock"></i>' + esc(r.ngayCapNhat || r.ngayTao || '') + '</span>' +
            (r.cuaToi === false ? '<span><i class="fa-light fa-user"></i>' + esc(r.nguoiTao || 'người khác') + '</span>' : '') + '</div></a>';
    }
    function tai(lamMoi) {
        if (!bang) return;
        var b = bang;
        if (lamMoi) { b.trang = 1; b.ds = []; b.tong = 0; } else b.trang++;
        b.dangTai = true; b.loi = ''; veDs();
        var p = { v: CFG.v || b.nc.v || '2', phamVi: 'toi',ma: b.loc.chiMan ? b.nc.ma : '', trangThai: b.loc.trangThai,
                  tuKhoa: b.loc.tuKhoa, tuNgay: ngayVN(b.loc.tuNgay), denNgay: ngayVN(b.loc.denNgay), trang: b.trang, kichCo: CFG.kichCo };
        var lan = ++b.lanGoi;
        layDanhSach(b.ad, p).then(function (kq) {
            if (bang !== b || lan !== b.lanGoi) return;
            if (kq.trangThai && kq.trangThai.length) { b.dm = kq.trangThai; veChips(); }
            if (kq.uuTien && kq.uuTien.length) dmUt = kq.uuTien;
            if (!coLoc(b.loc)) ghiSoYeuCau(kq);
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
                mauCache.push({ id: 'mau-' + i, maHienThi: 'HT-' + (240 - i), url: helpGoc() + '/help-master/van-de/mau-' + i, tieuDe: d, moTa: 'Mô tả mẫu của yêu cầu "' + d + '".',
                                ma: m[0], ten: m[1], v: nc.v || '2', trangThai: tt[(i * 3) % tt.length], ngayTao: gioVN(new Date(ng.getTime() - 5 * 3600 * 1000)), ngayCapNhat: gioVN(ng), _ng: ng.getTime(),
                                uuTien: i % 6 === 0 ? 'cao' : (i % 6 === 3 ? 'thap' : 'binh-thuong'), soPhanHoiMoi: i % 4 === 1 ? 1 + (i % 3) : 0, cuaToi: i % 5 !== 3, nguoiTao: i % 5 === 3 ? 'Người khác cùng trường' : '' });
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
        return new Promise(function (ok) { setTimeout(function () { ok({ ok: true, tong: ds.length, trang: tr, kichCo: kc, trangThai: DM_MAC_DINH, uuTien: dmUt, ds: ds.slice((tr - 1) * kc, tr * kc) }); }, 250); });
    }
    /* Gửi nhanh xong: chèn dòng mới lên đầu bảng bằng id / url Help trả, không gọi lại cửa danh sách (10.1) */
    function themDongMoi(d, noiDung, nc) {
        if (!bang) return;
        var dm = bang.dm[0] || {};
        bang.ds.unshift({ id: d.id, maHienThi: d.maHienThi || d.id, url: d.url, tieuDe: String(noiDung || '').split('\n')[0].slice(0, 120) || '(Gửi nhanh, chưa có mô tả)',
                          ma: nc.ma, ten: nc.ten, trangThai: dm.ma, uuTien: d.uuTien || (popup && popup.uuTien) || '', ngayCapNhat: gioVN(new Date()), soPhanHoiMoi: 0, cuaToi: true, moi: true });
        bang.tong++; veDs();
        var h = bang.box.querySelector('[data-yh="ds"]'); if (h) h.scrollTop = 0;
    }
    /* ---------- Hướng dẫn dạng slide — hiện MỘT lần, ở lần đầu bấm "Tạo yêu cầu mới" (trước khi chụp, để người dùng biết
       trình duyệt sắp hỏi chia sẻ tab). Xong / bỏ qua thì nhớ vào localStorage (khoá theo trình duyệt); bấm lại: btnYeuCauHoTro.huongDan(). */
    var KHOA_HD = 'yh-huongdan-v1', hdPhien = false;
    /* Cần hiện hướng dẫn: trình duyệt này chưa xem, HOẶC người này chưa gửi yêu cầu nào (soYeuCauToi === 0, người dùng 2/11) — trường hợp
       sau chỉ hiện một lần mỗi phiên trang (bấm Bỏ qua rồi bấm Tạo lại thì không hiện nữa) tới khi Help nhận yêu cầu đầu tiên */
    function canHuongDan() { return !daXemHuongDan() || (soYeuCauToi === 0 && !hdPhien); }
    function daXemHuongDan() { try { return !!localStorage.getItem(KHOA_HD); } catch (e) { return false; } }
    function nhoDaXem() { hdPhien = true; try { localStorage.setItem(KHOA_HD, '1'); } catch (e) { /* trình duyệt chặn lưu: lần sau hiện lại, chấp nhận */ } }
    function huongDan(tiepTuc) {
        if (document.querySelector('.yh-hd')) return;
        napCss();
        var that = coChupThat();
        var slides = [
            { icon: 'fa-life-ring', tieu: 'Gửi yêu cầu hỗ trợ trong 4 bước',
              nd: 'Bạn chụp lại màn hình đang gặp vấn đề, khoanh chỗ cần hỗ trợ, ghi vài dòng mô tả rồi gửi. Đội hỗ trợ thấy đúng màn hình bạn đang thấy.' },
            that ? { icon: 'fa-browser', tieu: 'Bước 1 — Cho phép chụp tab này',
                     nd: 'Ngay sau slide này, trình duyệt sẽ hỏi <b>"Chia sẻ tab này"</b>. Bạn chỉ cần bấm <b>Chia sẻ</b>.',
                     ghi: 'Ứng dụng chỉ lấy đúng MỘT ảnh rồi dừng ngay, không quay phim, không xem tab khác. Nếu bấm Huỷ, ảnh vẫn được vẽ lại tự động nhưng có thể lệch đôi chút.' }
                 : { icon: 'fa-camera', tieu: 'Bước 1 — Ảnh màn hình tự chụp',
                     nd: 'Ngay sau slide này, ứng dụng tự chụp màn hình bạn đang xem và mở cửa sổ gửi yêu cầu.',
                     ghi: 'Ảnh có thể lệch đôi chút so với thực tế. Cần ảnh đúng hơn, hãy chụp bằng Win+Shift+S rồi dán vào bằng Ctrl+V.' },
            { icon: 'fa-vector-square', tieu: 'Bước 2 — Khoanh chỗ có vấn đề',
              nd: 'Dùng <b>Khung</b> hoặc <b>Mũi tên</b> chỉ vào chỗ lỗi. <b>Cắt ảnh</b> để chỉ giữ vùng cần gửi, <b>Hoàn tác</b> nếu vẽ nhầm.',
              ghi: 'Muốn thay ảnh: chụp bằng Win+Shift+S rồi dán bằng Ctrl+V.' },
            { icon: 'fa-paper-plane', tieu: 'Bước 3 và 4 — Mô tả rồi gửi',
              nd: 'Ghi ngắn gọn bạn đang làm gì và thấy gì, rồi bấm <b>' + (CFG.nhung ? 'Gửi' : 'Gửi nhanh') + '</b>. Theo dõi trạng thái trong danh sách "Yêu cầu của tôi".',
              ghi: 'Người cùng trường gặp vấn đề tương tự sẽ thấy ảnh và nội dung này. Hãy cắt hoặc che thông tin không muốn gửi.' }
        ];
        var i = 0, xong = false;
        var veil = el('div', 'yh-veil yh-hd');
        veil.innerHTML = '<div class="yh-popup yh-hd__box" role="dialog" aria-modal="true" aria-label="Hướng dẫn gửi yêu cầu hỗ trợ">' +
            '<div class="yh-head"><i class="fa-light fa-circle-question"></i><span>Hướng dẫn nhanh</span>' +
            '<button type="button" class="yh-x" data-hd="bo" title="Bỏ qua"><i class="fa-light fa-xmark"></i></button></div>' +
            '<div class="yh-hd__than" data-hd="nd"></div>' +
            '<div class="yh-hd__cham" data-hd="cham"></div>' +
            '<div class="yh-foot"><button type="button" class="yh-btn" data-hd="bo">Bỏ qua</button><span class="yh-foot__cach"></span>' +
            '<button type="button" class="yh-btn" data-hd="lui"><i class="fa-light fa-chevron-left"></i>Trước</button>' +
            '<button type="button" class="yh-btn yh-btn--chinh" data-hd="tien"></button></div></div>';
        goc().appendChild(veil);
        veil.style.zIndex = 999997;
        function ve() {
            var s = slides[i], cuoi = i === slides.length - 1;
            veil.querySelector('[data-hd="nd"]').innerHTML = '<div class="yh-hd__icon"><i class="fa-light ' + s.icon + '"></i></div>' +
                '<h3>' + s.tieu + '</h3><p>' + s.nd + '</p>' + (s.ghi ? '<div class="yh-hd__ghi"><i class="fa-light fa-circle-info"></i><span>' + s.ghi + '</span></div>' : '');
            veil.querySelector('[data-hd="cham"]').innerHTML = slides.map(function (_, k) { return '<i' + (k === i ? ' class="is-on"' : '') + '></i>'; }).join('');
            veil.querySelector('[data-hd="lui"]').hidden = i === 0;
            var t = veil.querySelector('[data-hd="tien"]');
            t.innerHTML = cuoi ? '<i class="fa-light fa-camera"></i>Bắt đầu' : 'Tiếp<i class="fa-light fa-chevron-right"></i>';
            t.focus();
        }
        function dong(chay) {
            if (xong) return; xong = true; nhoDaXem();
            global.removeEventListener('keydown', phim, true);
            if (veil.parentNode) veil.parentNode.removeChild(veil);
            if (chay && tiepTuc) tiepTuc();
        }
        function phim(ev) {
            if (ev.key === 'Escape') { ev.preventDefault(); ev.stopPropagation(); dong(false); }
            else if (ev.key === 'ArrowRight') { ev.stopPropagation(); if (i < slides.length - 1) { i++; ve(); } }
            else if (ev.key === 'ArrowLeft') { ev.stopPropagation(); if (i > 0) { i--; ve(); } }
        }
        veil.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-hd]'); if (!b) return;
            var k = b.getAttribute('data-hd');
            if (k === 'bo') dong(false);               // bỏ qua: không mở popup, người dùng bấm lại khi cần
            else if (k === 'lui') { if (i > 0) { i--; ve(); } }
            else if (k === 'tien') { if (i < slides.length - 1) { i++; ve(); } else dong(true); }
        });
        global.addEventListener('keydown', phim, true);   // pha capture ở window: chạy trước Esc đóng bảng của plugin và Esc của vỏ
        ve();
    }
    /* "Tạo yêu cầu mới": giấu bảng trong khoảnh khắc chụp rồi mở popup bước 2 đè lên */
    function taoMoi() {
        if (canHuongDan()) return huongDan(taoMoi);
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
        if (canHuongDan()) return huongDan(moTuNut);
        var fab = document.querySelector('.yh-fab'); if (fab) fab.classList.add('is-busy');
        chup().then(function (c) { moPopup(c, ''); }, function (e) { moPopup(null, e.message); })
              .then(function () { if (fab) fab.classList.remove('is-busy'); });
    }
    /* Hộp thoại của vỏ mở bằng showModal() nằm ở "top layer" của trình duyệt: z-index không thắng được, và phần còn lại của trang bị
       INERT (nút ngoài hộp thoại nhìn thấy cũng không bấm được — kể cả popover). Cách duy nhất là đặt nút VÀO CHÍNH hộp thoại đang mở
       (giống hộp thông báo của ui.js): có hộp thoại thì nút chuyển vào hộp trên cùng, hết hộp thoại thì trả về <body>.
       Popup / bảng dựng ngay trong hộp thoại đang mở (goc()). Nút vẫn position:fixed nên chỗ đứng không đổi. */
    function hopTrenCung() {
        var ds = document.querySelectorAll('dialog[open]');
        for (var i = ds.length - 1; i >= 0; i--) if (ds[i].matches(':modal')) return ds[i];
        return null;
    }
    function goc() { return hopTrenCung() || document.body; }
    function canhNut() {
        var fab = canhDialog.fab; if (!fab) return;
        var host = goc();
        if (fab.parentNode !== host) host.appendChild(fab);   // hộp thoại bị gỡ khỏi DOM kéo theo nút → cũng chạy ở đây (parentNode null)
    }
    function canhDialog() {
        if (canhDialog.ob || !global.MutationObserver) return;
        /* open đổi → xét lại hộp trên cùng; hộp thoại bị gỡ (ở bất kỳ độ sâu nào) kéo theo nút → nút mất kết nối thì dựng lại ở <body> / hộp còn mở */
        canhDialog.ob = new MutationObserver(function (ds) {
            var fab = canhDialog.fab; if (!fab) return;
            if (!fab.isConnected) { (hopTrenCung() || document.body).appendChild(fab); return; }
            for (var i = 0; i < ds.length; i++) if (ds[i].type === 'attributes') { canhNut(); return; }
        });
        canhDialog.ob.observe(document.documentElement, { attributes: true, attributeFilter: ['open'], subtree: true, childList: true });
    }
    /* ---------- Báo tin mới trên nút nổi: hỏi cửa danh sách (cùng cửa của bảng) mỗi CFG.hoiMs, chỉ khi tab đang hiện và bảng đóng;
       tổng soPhanHoiMoi của yêu cầu chưa đóng > 0 → nút đỏ, nảy nhẹ, kèm số, cho tới khi mở bảng. Lỗi 3 lần liên tiếp thì thôi hỏi. ---------- */
    var tin = { hen: null, lanCuoi: 0, loi: 0 };
    function datBaoMoi(n) {
        var fab = document.querySelector('.yh-fab'); if (!fab) return;
        var so = fab.querySelector('.yh-fab__so');
        if (n > 0) {
            if (!so) { so = el('b', 'yh-fab__so'); fab.appendChild(so); }
            so.textContent = n > 99 ? '99+' : String(n);
            fab.classList.add('is-moi'); fab.title = CFG.text + ' — có ' + n + ' phản hồi mới từ hỗ trợ';
        } else {
            if (so && so.parentNode) so.parentNode.removeChild(so);
            fab.classList.remove('is-moi'); fab.title = CFG.text + ' — xem yêu cầu đã gửi và trạng thái, tạo yêu cầu mới kèm ảnh màn hình';
        }
    }
    function hoiTinMoi() {
        if (!CFG.hoiMs || document.hidden || bang || popup) return;
        var ad = adapter(); if (ad.demo() || !ad.uid()) return;
        tin.lanCuoi = Date.now();
        layDanhSach(ad, { v: CFG.v || ad.nguCanh().v || '2', phamVi: 'toi', trang: 1, kichCo: CFG.kichCo }).then(function (kq) {
            tin.loi = 0; ghiSoYeuCau(kq);
            if (bang) return;   // bảng mở trong lúc chờ: bảng tự hiện số chưa đọc
            var n = 0; (kq.ds || []).forEach(function (r) { if (r.trangThai !== 'DA_DONG') n += Number(r.soPhanHoiMoi) || 0; });
            datBaoMoi(n);
        }, function () { if (++tin.loi >= 3) dungHoi(); });
    }
    function dungHoi() { clearInterval(tin.hen); tin.hen = null; document.removeEventListener('visibilitychange', quayLai); }
    function quayLai() { if (!document.hidden && Date.now() - tin.lanCuoi > 60000) hoiTinMoi(); }
    function batDauHoi() {
        if (!CFG.hoiMs || tin.hen) return;
        tin.hen = setInterval(hoiTinMoi, CFG.hoiMs);
        document.addEventListener('visibilitychange', quayLai);
        /* Lần đầu: mở lại app thì phiên (userId) có thể chưa nạp xong ở giây thứ 4 → hoiTinMoi thoát im và phải chờ cả chu kỳ.
           Nên cứ mỗi giây xét lại tới khi phiên sẵn sàng (tối đa 30 giây) rồi hỏi Help ngay. */
        (function thuLanDau(n) {
            var ad = adapter();
            if (!ad.demo() && ad.uid()) { hoiTinMoi(); return; }
            if (n < 30) setTimeout(function () { thuLanDau(n + 1); }, 1000);
        })(0);
    }
    function dungNut() {
        if (document.querySelector('.yh-fab')) return;
        napCss();
        var b = el('button', 'yh-fab', '<i class="fa-light fa-life-ring"></i><span>' + esc(CFG.text) + '</span>');
        b.type = 'button'; b.title = CFG.text + ' — xem yêu cầu đã gửi và trạng thái, tạo yêu cầu mới kèm ảnh màn hình';
        b.addEventListener('click', moBang);
        goc().appendChild(b);
        canhDialog.fab = b;
        canhDialog();
        batDauHoi();
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

    /* Dò trên console: btnYeuCauHoTro.thuToken() — phát token như lúc gửi, in kết quả / lỗi của help-sso.aspx */
    function thuToken() {
        var ad = adapter();
        return ad.roles().then(function (roles) {
            console.log('[hotro] vai trò gửi đi:', roles, '| uid:', ad.uid() || '(trống)', '| tokenUrl:', CFG.tokenUrl);
            return layToken(ad);
        }).then(function (j) { console.log('[hotro] token OK — dich:', j.dich, '| exp:', j.exp, '\n' + j.token); return j; },
                function (e) { console.error('[hotro] KHÔNG phát được token:', e.message); throw e; });
    }
    function dongPopup() {
        if (!popup) return;
        var p = popup; popup = null; tatNghe(); huyCho();
        if (!p.chat) { p.dong(); return; }
        /* Help lưu nháp (11.7): postMessage giao không đồng bộ — gỡ iframe ngay thì Help không nhận được. Ẩn tức thì, gỡ sau 200 ms. */
        clearTimeout(p.chat.hen);
        var fr = p.veil.querySelector('iframe[name="yh-help"]'); if (fr && fr.contentWindow) fr.contentWindow.postMessage({ loai: 'app-dong' }, gocHelp());
        p.veil.style.display = 'none';
        setTimeout(function () { p.dong(); }, 200);
    }
    global.btnYeuCauHoTro = { config: CFG, mo: moBang, tao: moTuNut, huongDan: function () { huongDan(null); }, dong: function () { dongPopup(); dongBang(); }, taiLai: function () { tai(true); },
                              moChat: moChat, thuToken: thuToken, adapter: null, adapters: adapters, dung: dungNut, taiAnh: taiAnh };
    /* an: true → chưa dựng gì; hien() dựng nút + bật hỏi tin mới (gọi trên console hoặc từ vỏ) */
    function hien() { CFG.an = false; dungNut(); return !!document.querySelector('.yh-fab'); }
    global.btnYeuCauHoTro.hien = hien;
    function khoiDong() { if (!CFG.an) dungNut(); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', khoiDong); else khoiDong();
})(window);
