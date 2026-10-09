/* =========================================================================
   ums.editor — trình soạn thảo văn bản (CKEditor 4 của ứng dụng cha) + dàn công thức toán (MathJax)
   =========================================================================
   Bản gốc (indexi.aspx:1879-1886) nạp SẴN cho mọi màn: Scripts/ckeditor/ckeditor.js, Scripts/ckfinder/ckfinder.js,
   Scripts/ckeditor/plugins/ckeditor_wiris/integration/WIRISplugins.js và MathJax; màn gọi thẳng
   CKEDITOR.replace('id') / MathJax.typesetPromise([el]). Thư mục Scripts/ KHÔNG có trong kho (chỉ có trên host),
   _v2 nằm ngay dưới gốc ứng dụng nên ở đây nạp LÚC CHẠY bằng đường dẫn `../Scripts/…` (như index.aspx lùi về
   ../Config.js), CHỈ khi màn cần và chỉ MỘT lần cho cả phiên.

   Hợp đồng (các màn Quản lý thi trắc nghiệm, Bộ đề… gọi — GIỮ ĐÚNG TÊN):
       ums.editor.tao(textarea, { cao, congCu })  → Promise<{ get(): html, set(html), destroy(), loai: 'ck' | 'textarea' }>
           cao     chiều cao vùng soạn (px, mặc định 220)
           congCu  mảng toolbar CKEditor 4 (bỏ trống = cấu hình mặc định của host Scripts/ckeditor/config.js —
                   đúng như bản gốc gọi CKEDITOR.replace không kèm config, nên WIRIS / CKFinder theo config đó)
       ums.editor.toan(el)                        → Promise<boolean>  dàn công thức toán trong el; không có MathJax thì không làm gì
       ums.editor.sanSang()                       → Promise<boolean>  CKEditor đã nạp được chưa (nạp nếu chưa)
       ums.editor.html(chuoi)                     → chuỗi HTML máy chủ trả (nội dung CKEditor) đã bỏ <script>, thuộc tính on*,
                                                     javascript: — dùng khi hiện nội dung câu hỏi / đáp án
       ums.editor.donDep()                        huỷ các trình soạn thảo mà ô nhập không còn trong trang (tự gọi khi đổi màn)

   Lùi về <textarea> thường (KHÔNG lỗi, cùng get/set) khi: chế độ dữ liệu mẫu (không gọi mạng), tệp ../Scripts/… 404,
   CKEDITOR.replace ném lỗi, hoặc ô nhập đã bị gỡ khỏi trang trước khi CKEditor về.

   Đường dẫn mặc định ở ums.editor.DUONG_DAN; host đặt khác thì khai `editor: { ckeditor, ckfinder, wiris, mathjax }` trong
   site.config.js (tuỳ chọn, không bắt buộc; `editor.tat = true` = luôn dùng textarea). MathJax: bản gốc indexi nạp
   v2 từ cdn.mathjax.org (CDN đã ngừng) nhưng mã màn lại gọi API v3 (typesetPromise) → ở đây nạp bản v3 trong ứng dụng cha
   `../Scripts/MathJax/es5/tex-mml-chtml.js` (đường dẫn index.aspx:1868 từng khai); không có tệp → không dàn công thức,
   không lỗi. Không dùng CDN (bẫy số 4 CLAUDE.md).
   ========================================================================= */
(function (global) {
    'use strict';
    var ums = global.ums || (global.ums = {});
    var E = ums.editor = ums.editor || {};
    var seq = 0, ckP = null, mjP = null, live = [];

    E.DUONG_DAN = {
        ckeditor: '../Scripts/ckeditor/ckeditor.js',
        ckfinder: '../Scripts/ckfinder/ckfinder.js',
        wiris: '../Scripts/ckeditor/plugins/ckeditor_wiris/integration/WIRISplugins.js',
        mathjax: '../Scripts/MathJax/es5/tex-mml-chtml.js'
    };

    function isDemo() { return !!(ums.state && ums.state.mode === 'demo'); }
    function cfg() { return (ums.cfg && ums.cfg.editor) || {}; }
    function duong(k) { var c = cfg(); return new URL(c[k] || E.DUONG_DAN[k], location.href).href; }

    /** Thêm một thẻ <script> vào <head>; `tuyChon` = lỗi 404 vẫn resolve(false) */
    function napScript(src, tuyChon) {
        return new Promise(function (resolve, reject) {
            var s = document.createElement('script');
            s.src = src;
            s.async = false;
            s.onload = function () { resolve(true); };
            s.onerror = function () {
                if (s.parentNode) s.parentNode.removeChild(s);
                if (tuyChon) resolve(false); else reject(new Error('không tải được ' + src));
            };
            document.head.appendChild(s);
        });
    }

    /* ---------- CKEditor -------------------------------------------------- */
    E.sanSang = function () {
        if (ckP) return ckP;
        if (global.CKEDITOR && typeof global.CKEDITOR.replace === 'function') return (ckP = Promise.resolve(true));
        if (isDemo() || cfg().tat) return (ckP = Promise.resolve(false));
        ckP = napScript(duong('ckeditor')).then(function () {
            if (!global.CKEDITOR) return false;
            // Phụ trợ: CKFinder (chọn ảnh) và WIRIS (công thức) — thiếu vẫn soạn được
            return napScript(duong('ckfinder'), true)
                .then(function () { return napScript(duong('wiris'), true); })
                .then(function () { return true; }, function () { return true; });
        }).catch(function () { return false; });
        return ckP;
    };

    function textarea(ta, cao) {
        ta.classList.add('ums-input');
        ta.style.minHeight = cao + 'px';
        ta.style.resize = 'vertical';
        var api = {
            loai: 'textarea', el: ta,
            get: function () { return ta.value; },
            set: function (v) { ta.value = v === null || v === undefined ? '' : String(v); },
            destroy: function () {}
        };
        return api;
    }

    function ck(ta, cao, o) {
        return new Promise(function (resolve) {
            var ten = 'ums_ed_' + (++seq);
            ta.name = ten;
            if (!ta.id) ta.id = ten;
            var CK = global.CKEDITOR;
            if (CK.instances[ten]) { try { CK.instances[ten].destroy(true); } catch (e) {} }
            var conf = { height: cao };
            if (o.congCu) conf.toolbar = o.congCu;
            var ed = null;
            try { ed = CK.replace(ta, conf); } catch (e) { ed = null; }
            if (!ed) { resolve(textarea(ta, cao)); return; }

            var ready = false, cho = null, xong = false;
            var api = {
                loai: 'ck', el: ta, editor: ed,
                get: function () {
                    if (!ready) return cho !== null ? cho : ta.value;
                    try { return ed.getData(); } catch (e) { return ta.value; }
                },
                set: function (v) {
                    v = v === null || v === undefined ? '' : String(v);
                    if (!ready) { cho = v; ta.value = v; return; }
                    try { ed.setData(v); } catch (e) { ta.value = v; }
                },
                destroy: function () {
                    var i = live.indexOf(api);
                    if (i >= 0) live.splice(i, 1);
                    try { ed.destroy(true); } catch (e) {}
                }
            };
            live.push(api);
            function ok() {
                if (xong) return;
                xong = true;
                resolve(api);
            }
            ed.on('instanceReady', function () {
                ready = true;
                if (cho !== null) { try { ed.setData(cho); } catch (e) {} cho = null; }
                ok();
            });
            // CKEditor không bao giờ báo sẵn sàng (thiếu plugin, lỗi mạng) → vẫn trả về, get/set dùng ô nhập gốc
            setTimeout(ok, 8000);
        });
    }

    /**
     * ums.editor.tao(textarea, { cao, congCu }) → Promise<{ get, set, destroy, loai }>
     * `textarea` là phần tử <textarea> ĐÃ nằm trong trang (hoặc id của nó).
     */
    E.tao = function (ta, o) {
        o = o || {};
        E.donDep();
        if (typeof ta === 'string') ta = document.getElementById(ta);
        if (!ta) return Promise.reject(new Error('ums.editor.tao: thiếu ô nhập'));
        var cao = Number(o.cao) || 220;
        return E.sanSang().then(function (co) {
            if (!co || !ta.isConnected) return textarea(ta, cao);
            return ck(ta, cao, o);
        });
    };

    /** Huỷ trình soạn thảo của ô nhập đã rời khỏi trang (đổi màn, đóng biểu mẫu mà màn quên destroy) */
    E.donDep = function () {
        live.slice().forEach(function (a) {
            if (!a.el || !a.el.isConnected) a.destroy();
        });
    };
    global.addEventListener('hashchange', function () { setTimeout(E.donDep, 0); });

    /* ---------- MathJax --------------------------------------------------- */
    function napMathJax() {
        if (mjP) return mjP;
        if (global.MathJax && (global.MathJax.typesetPromise || global.MathJax.Hub)) return (mjP = Promise.resolve(true));
        if (isDemo() || cfg().tat) return (mjP = Promise.resolve(false));
        if (!global.MathJax) {
            global.MathJax = {
                tex: { inlineMath: [['$', '$'], ['\\(', '\\)']], displayMath: [['$$', '$$'], ['\\[', '\\]']] },
                options: { skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'] },
                startup: { typeset: false }
            };
        }
        mjP = napScript(duong('mathjax'), true).then(function (co) {
            if (!co || !global.MathJax) return false;
            var MJ = global.MathJax;
            if (MJ.startup && MJ.startup.promise) return MJ.startup.promise.then(function () { return true; }, function () { return false; });
            return !!(MJ.typesetPromise || MJ.Hub);
        }, function () { return false; });
        return mjP;
    }

    /**
     * ums.editor.toan(el) → Promise<boolean>: dàn công thức toán ($…$, \(…\), MathML) trong el.
     * Không có MathJax (dữ liệu mẫu, host không có tệp) → không làm gì, không lỗi.
     */
    E.toan = function (el) {
        if (!el || !el.nodeType) return Promise.resolve(false);
        return napMathJax().then(function (co) {
            var MJ = global.MathJax;
            if (!co || !MJ) return false;
            if (typeof MJ.typesetPromise === 'function') {
                return MJ.typesetPromise([el]).then(function () { return true; }, function () { return false; });
            }
            if (MJ.Hub && MJ.Hub.Queue) {
                try { MJ.Hub.Queue(['Typeset', MJ.Hub, el]); } catch (e) { return false; }
                return true;
            }
            return false;
        });
    };

    /* ---------- HTML máy chủ (nội dung soạn bằng CKEditor) ---------------- */
    /** Bỏ <script>, thuộc tính on*, href/src javascript: — phần còn lại giữ nguyên (định dạng, ảnh, công thức) */
    E.html = function (s) {
        if (s === null || s === undefined) return '';
        s = String(s);
        if (!/[<&]/.test(s)) return s;
        return s
            .replace(/<script[\s\S]*?<\/script\s*>/gi, '')
            .replace(/<script[^>]*>/gi, '')
            .replace(/\s(on[a-z]+)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
            .replace(/\s(href|src|action|formaction)\s*=\s*(["']?)\s*javascript:[^"'>\s]*/gi, ' $1=$2#');
    };
})(window);
