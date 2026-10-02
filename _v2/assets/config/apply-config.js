/* =========================================================================
   BỘ ÁP DỤNG CẤU HÌNH — không cần sửa tệp này
   =========================================================================
   Đọc `site.config.js`, gộp thêm phần ghi đè do màn hình Cài đặt lưu trong
   localStorage, rồi ghi tất cả vào biến CSS trên thẻ <html>. Biến nội tuyến
   thắng biến khai báo trong settings/tokens.css.

   Thứ tự ưu tiên, sau đè lên trước:
       1. DEFAULT trong tệp này
       2. site.config.js
       3. Ghi đè từ màn hình Cài đặt (localStorage: ums.config.override)

   Phải nạp trong <head>, ngay sau site.config.js và TRƯỚC khi vẽ trang.

   Cung cấp:
       ums.cfg                 cấu hình đã gộp
       ums.cfg.getText(k, d)   lấy chuỗi, an toàn khi thiếu khoá
       ums.cfg.getTone(k)      lấy cặp màu của một tông
       ums.cfg.greeting(tên)   lời chào theo giờ
       ums.cfg.applyVars()     ghi lại biến CSS (dùng khi xem trước)
       ums.cfg.override        phần ghi đè đang lưu
       ums.cfg.saveOverride(o) lưu ghi đè và áp dụng ngay
       ums.cfg.clearOverride() xoá ghi đè, về đúng site.config.js
       ums.cfg.exportConfig()  sinh đoạn mã để dán vào site.config.js
   ========================================================================= */
(function (global) {
    'use strict';

    var ums = global.ums || (global.ums = {});
    var STORE_KEY = 'ums.config.override';

    /* ---------- Gộp sâu ---------------------------------------------------- */
    function merge(target, src) {
        Object.keys(src || {}).forEach(function (k) {
            if (src[k] && typeof src[k] === 'object' && !Array.isArray(src[k])) {
                target[k] = merge(target[k] || {}, src[k]);
            } else if (src[k] !== undefined && src[k] !== null) {
                target[k] = src[k];
            }
        });
        return target;
    }

    function clone(o) { return JSON.parse(JSON.stringify(o)); }

    var DEFAULT = {
        brand: {
            name: 'UMS', fullName: 'UMS', footer: '', favicon: null,
            logo: { image: null, icon: 'fa-light fa-graduation-cap', background: null, size: 32 }
        },
        color: {}, size: {}, font: {}, tone: {}, roleGroups: [], roleRules: [],
        text: {}, api: {},
        behavior: { rememberNavCollapsed: true, openFirstNavGroup: true, pageSize: 10, dateFormat: 'd/m/Y' }
    };

    /* ---------- Ghi đè từ màn hình Cài đặt --------------------------------- */
    function readOverride() {
        try {
            var raw = localStorage.getItem(STORE_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) { return {}; }
    }

    var fileCfg = global.UMS_CONFIG || {};
    var override = readOverride();

    var C = merge(merge(clone(DEFAULT), fileCfg), override);
    C.override = override;

    /* ---------- Ghi biến CSS ----------------------------------------------- */
    var root = document.documentElement;

    function setVar(name, value) {
        if (value === undefined || value === null || value === '') return;
        root.style.setProperty('--ums-' + name, value);
    }

    C.setVar = setVar;

    C.applyVars = function () {
        Object.keys(C.color).forEach(function (k) { setVar(k, C.color[k]); });
        Object.keys(C.size).forEach(function (k) { setVar(k, C.size[k]); });

        if (C.font.family) setVar('font', C.font.family);
        if (C.font.baseSize) setVar('fz-14', C.font.baseSize);

        Object.keys(C.tone).forEach(function (k) {
            setVar('g-' + k, C.tone[k].fg);
            setVar('g-' + k + '-bg', C.tone[k].bg);
        });

        if (C.brand.logo && C.brand.logo.background) setVar('logo-bg', C.brand.logo.background);
    };

    C.applyVars();

    /* ---------- Tiêu đề trang và favicon ----------------------------------- */
    function applyHead() {
        if (C.brand.fullName) document.title = C.brand.fullName;
        if (C.brand.favicon) {
            var link = document.querySelector('link[rel="icon"]') || document.createElement('link');
            link.rel = 'icon';
            link.href = C.brand.favicon;
            document.head.appendChild(link);
        }
    }
    applyHead();

    /* ---------- Tiện ích ---------------------------------------------------- */
    C.getText = function (key, fallback) {
        return C.text[key] !== undefined ? C.text[key] : (fallback !== undefined ? fallback : '');
    };

    C.getTone = function (key) {
        return C.tone[key] || { fg: '#64748b', bg: '#eef1f6' };
    };

    C.greeting = function (name) {
        var h = new Date().getHours();
        var key = h < 12 ? 'greetingMorning' : (h < 18 ? 'greetingAfternoon' : 'greetingEvening');
        return C.getText(key, 'Xin chào, %s!').replace('%s', name || '');
    };

    /* ---------- Dựng logo và tên hệ thống -----------------------------------
       Phần tử có [data-ums-brand] sẽ được điền:
           logo · name · fullname · footer
       -------------------------------------------------------------------- */
    function paintBrand() {
        var L = C.brand.logo || {};

        document.querySelectorAll('[data-ums-brand="logo"]').forEach(function (el) {
            if (L.size) { el.style.width = L.size + 'px'; el.style.height = L.size + 'px'; }
            el.style.background = L.background || '';
            el.innerHTML = L.image
                ? '<img src="' + L.image + '" alt="' + (C.brand.name || '') + '">'
                : '<i class="' + (L.icon || '') + '"></i>';
        });

        /* Tên ngắn để rỗng thì ẨN HẴN thẻ — còn để nguyên thì khoảng cách
           giữa logo và phần sau vẫn đứng đó, nhìn như lệch. */
        document.querySelectorAll('[data-ums-brand="name"]').forEach(function (el) {
            var t = C.brand.name || '';
            el.textContent = t;
            el.hidden = !t;
        });

        document.querySelectorAll('[data-ums-brand="fullname"]').forEach(function (el) {
            el.textContent = C.brand.fullName || '';
        });

        document.querySelectorAll('[data-ums-brand="footer"]').forEach(function (el) {
            el.textContent = C.brand.footer || '';
            el.hidden = !C.brand.footer;
        });
    }

    /* ---------- Ảnh nền trang -----------------------------------------------
       Màu nền đã do --ums-bg lo (body trong generic/reset.css). Ở đây chỉ đặt
       thêm ẢNH, và phủ một lớp màu lên nếu cấu hình có `overlay` — ảnh đậm
       quá thì chữ trên nền không đọc được. Không khai ảnh thì xoá sạch
       thuộc tính, trả về đúng màu nền như cũ. */
    function paintBackground() {
        var B = C.background || {};
        var b = document.body;
        if (!b) return;
        if (!B.image) {
            ['backgroundImage', 'backgroundSize', 'backgroundPosition',
             'backgroundRepeat', 'backgroundAttachment'].forEach(function (k) { b.style[k] = ''; });
            return;
        }
        var anh = 'url("' + String(B.image).replace(/"/g, '\\"') + '")';
        b.style.backgroundImage = B.overlay
            ? 'linear-gradient(' + B.overlay + ', ' + B.overlay + '), ' + anh
            : anh;
        b.style.backgroundSize = B.size || 'cover';
        b.style.backgroundPosition = B.position || 'center';
        b.style.backgroundRepeat = B.repeat || 'no-repeat';
        b.style.backgroundAttachment = B.attachment || 'fixed';
    }

    C.paintBackground = paintBackground;
    C.paintBrand = paintBrand;

    function paintAll() { paintBrand(); paintBackground(); }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', paintAll);
    } else {
        paintAll();
    }

    /* ---------- Lưu và xoá ghi đè -------------------------------------------- */
    C.saveOverride = function (obj) {
        override = obj || {};
        C.override = override;
        try { localStorage.setItem(STORE_KEY, JSON.stringify(override)); } catch (e) {}

        // Gộp lại từ đầu để bỏ được cả những khoá vừa xoá khỏi ghi đè
        var fresh = merge(merge(clone(DEFAULT), fileCfg), override);
        ['brand', 'background', 'color', 'size', 'font', 'tone', 'text', 'behavior'].forEach(function (k) {
            C[k] = fresh[k];
        });

        C.applyVars();
        applyHead();
        paintBrand();
        paintBackground();
    };

    C.clearOverride = function () { C.saveOverride({}); };

    /** Sinh đoạn mã để dán đè vào site.config.js cho vĩnh viễn */
    C.exportConfig = function () {
        var out = ['brand', 'background', 'color', 'size', 'font', 'tone'].reduce(function (acc, k) {
            if (override[k]) acc[k] = override[k];
            return acc;
        }, {});

        if (!Object.keys(out).length) return '// Chưa thay đổi gì so với site.config.js';

        return '/* Dán các mục dưới đây đè lên phần tương ứng trong\n' +
               '   _v2/assets/config/site.config.js để lưu vĩnh viễn. */\n\n' +
               Object.keys(out).map(function (k) {
                   return k + ': ' + JSON.stringify(out[k], null, 4) + ',';
               }).join('\n\n');
    };

    ums.cfg = C;

})(window);
