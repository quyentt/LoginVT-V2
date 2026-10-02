/* =========================================================================
   ums.scroll — thanh trượt tự vẽ, đặt chồng lên nội dung
   =========================================================================
   Thanh trượt của trình duyệt chiếm chỗ thật trong bố cục (thường 9–17px),
   làm nội dung hẹp lại và để hở một dải trống bên phải. Module này ẩn thanh
   trượt gốc và vẽ lại một thanh nổi phía trên nội dung.

   Dùng:
       ums.scroll.attach('#navScroll');     // hoặc truyền thẳng phần tử
       ums.scroll.refresh(el);              // gọi lại khi nội dung đổi

   Tự theo dõi thay đổi nội dung bằng MutationObserver và ResizeObserver nên
   phần lớn trường hợp không cần gọi refresh thủ công.
   ========================================================================= */
(function (global) {
    'use strict';

    var ums = global.ums || (global.ums = {});
    var mod = ums.scroll || (ums.scroll = {});

    function attach(target) {
        var root = typeof target === 'string' ? document.querySelector(target) : target;
        if (!root || root._umsScroll) return;

        var view = root.querySelector('.ums-scroll__view');
        var bar = root.querySelector('.ums-scroll__bar');
        var thumb = root.querySelector('.ums-scroll__thumb');
        if (!view || !bar || !thumb) return;

        var hideTimer = null;
        var drag = null;

        function refresh() {
            var vh = view.clientHeight;
            var sh = view.scrollHeight;

            // Không có gì để cuộn
            if (sh <= vh + 1) {
                root.classList.add('is-idle');
                return;
            }
            root.classList.remove('is-idle');

            var track = bar.clientHeight;
            var h = Math.max(28, Math.round(track * vh / sh));
            var maxTop = track - h;
            var top = maxTop <= 0 ? 0 : Math.round(maxTop * view.scrollTop / (sh - vh));

            thumb.style.height = h + 'px';
            thumb.style.top = top + 'px';
        }

        function flash() {
            root.classList.add('is-scrolling');
            clearTimeout(hideTimer);
            hideTimer = setTimeout(function () { root.classList.remove('is-scrolling'); }, 700);
        }

        view.addEventListener('scroll', function () { refresh(); flash(); }, { passive: true });

        /* ---- Kéo thanh trượt ---- */
        thumb.addEventListener('mousedown', function (e) {
            e.preventDefault();
            var track = bar.clientHeight;
            var h = thumb.offsetHeight;
            drag = {
                y: e.clientY,
                top: thumb.offsetTop,
                ratio: (view.scrollHeight - view.clientHeight) / Math.max(1, track - h)
            };
            root.classList.add('is-dragging');
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', function (e) {
            if (!drag) return;
            view.scrollTop = (drag.top + (e.clientY - drag.y)) * drag.ratio;
        });

        document.addEventListener('mouseup', function () {
            if (!drag) return;
            drag = null;
            root.classList.remove('is-dragging');
            document.body.style.userSelect = '';
        });

        /* ---- Bấm vào rãnh thì nhảy tới vị trí đó ---- */
        bar.addEventListener('mousedown', function (e) {
            if (e.target === thumb) return;
            var r = bar.getBoundingClientRect();
            var p = (e.clientY - r.top) / r.height;
            view.scrollTop = p * (view.scrollHeight - view.clientHeight);
        });

        /* ---- Nội dung hoặc kích thước đổi thì tính lại ---- */
        if (global.ResizeObserver) {
            var ro = new ResizeObserver(refresh);
            ro.observe(view);
            if (view.firstElementChild) ro.observe(view.firstElementChild);
        }

        if (global.MutationObserver) {
            new MutationObserver(refresh).observe(view, { childList: true, subtree: true, attributes: true });
        }

        global.addEventListener('resize', refresh);

        root._umsScroll = { refresh: refresh };
        refresh();
    }

    mod.attach = attach;

    mod.refresh = function (target) {
        var root = typeof target === 'string' ? document.querySelector(target) : target;
        if (root && root._umsScroll) root._umsScroll.refresh();
    };

    /* Tự gắn cho mọi .ums-scroll có sẵn khi trang tải xong */
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.ums-scroll').forEach(attach);
    });

})(window);
