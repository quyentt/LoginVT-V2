/* =========================================================================
   ums.chrome — hành vi của khung khi cuộn trang
   =========================================================================
     · Kéo XUỐNG  → thanh trên trượt lên khuất, lấy lại chiều cao màn hình
     · Kéo LÊN    → thanh trên hiện lại ngay
     · Cuộn khỏi đỉnh → khối tiêu đề và nút chức năng dính lại phía trên

   Có vùng chết (ngưỡng) để thanh trên không rung khi cuộn lắt nhắt, và
   luôn hiện lại khi đã về gần đỉnh trang.
   ========================================================================= */
(function (global) {
    'use strict';

    var ums = global.ums || (global.ums = {});

    var CFG = {
        // Phải cuộn quá bấy nhiêu px kể từ lần đổi hướng gần nhất mới đổi trạng thái
        delta: 8,
        // Dưới mức này thì luôn hiện thanh trên
        showAbove: 80,
        // Quá mức này thì khối tiêu đề coi như đã dính
        stuckAfter: 12
    };

    var app = null;
    var lastY = 0;
    var anchorY = 0;
    var hidden = false;

    function apply() {
        var y = global.scrollY || document.documentElement.scrollTop || 0;

        // Dính khối tiêu đề
        app.classList.toggle('is-stuck', y > CFG.stuckAfter);

        // Đang mở ngăn kéo cột trái thì không đụng vào thanh trên
        if (app.classList.contains('is-nav-open')) { lastY = y; return; }

        // Gần đỉnh thì luôn hiện
        if (y <= CFG.showAbove) {
            if (hidden) { hidden = false; app.classList.remove('is-head-hidden'); }
            lastY = y; anchorY = y;
            return;
        }

        var down = y > lastY;

        // Đổi hướng thì đặt lại mốc đo
        if (down !== (anchorY < lastY)) anchorY = lastY;

        if (down && !hidden && y - anchorY > CFG.delta) {
            hidden = true;
            app.classList.add('is-head-hidden');
            anchorY = y;
        } else if (!down && hidden && anchorY - y > CFG.delta) {
            hidden = false;
            app.classList.remove('is-head-hidden');
            anchorY = y;
        }

        lastY = y;
    }

    /* Xử lý thẳng trong sự kiện, chỉ chặn gọi dồn bằng mốc thời gian.
       Không dùng requestAnimationFrame: rAF bị trình duyệt tiết chế khi thẻ
       nền hoặc khung ẩn, làm trạng thái thanh trên kẹt lại sai. */
    var lastRun = 0;

    function onScroll() {
        var now = Date.now();
        if (now - lastRun < 30) return;
        lastRun = now;
        apply();
    }

    /** Hiện lại thanh trên — gọi khi chuyển màn hình */
    function reveal() {
        hidden = false;
        if (app) app.classList.remove('is-head-hidden');
        anchorY = lastY = global.scrollY || 0;
    }

    /* ---------- Menu người dùng ở thanh trên ------------------------------
       Vỏ cũ có sẵn menu này (index.aspx, .box-acc-user): Thông tin cá nhân,
       Cài đặt, Đăng xuất. Ở đây giữ đúng ba mục đó; "Thông tin cá nhân" của
       hệ cũ chưa nối vào đâu nên tạm báo chưa có. Đăng xuất dùng
       ums.session.logout() (xoá sessionStorage rồi về Logout.aspx). */
    function userMenu() {
        var btn = document.getElementById('btnUser');
        if (!btn) return;

        var box = document.createElement('div');
        box.className = 'ums-usermenu';
        box.hidden = true;
        box.innerHTML =
            '<button type="button" class="ums-usermenu__item" data-u="info">' +
                '<i class="fa-light fa-user"></i><span>Thông tin cá nhân</span></button>' +
            '<a class="ums-usermenu__item" href="#/cai-dat" data-u="close">' +
                '<i class="fa-light fa-gear"></i><span>Cài đặt giao diện</span></a>' +
            /* SSO sang Cổng Help để soạn bài (site.config.js help.sso). Ẩn tới khi
               app.js xác nhận vai trò được phép — ums.app.soanBaiChoPhep(). */
            '<a class="ums-usermenu__item" data-u="soan" id="umSoanBai" hidden target="_blank" rel="noopener">' +
                '<i class="fa-light fa-pen-to-square"></i><span></span></a>' +
            '<div class="ums-usermenu__sep"></div>' +
            '<button type="button" class="ums-usermenu__item ums-usermenu__item--out" data-u="logout">' +
                '<i class="fa-light fa-right-from-bracket"></i><span>Đăng xuất</span></button>';
        btn.parentNode.appendChild(box);

        function close() { box.hidden = true; }

        var soan = box.querySelector('#umSoanBai'), ssoCfg = (ums.cfg && ums.cfg.help && ums.cfg.help.sso) || {};
        if (soan) {
            soan.querySelector('span').textContent = ssoCfg.text || 'Soạn bài hướng dẫn';
            soan.href = ssoCfg.page || '#';
        }
        function hienSoan() {
            if (!soan || !ssoCfg.page || !ums.app || !ums.app.soanBaiChoPhep) return;
            ums.app.soanBaiChoPhep().then(function (ok) { soan.hidden = !ok; }, function () {});
        }

        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            box.hidden = !box.hidden;
            if (!box.hidden) hienSoan();
        });
        document.addEventListener('click', function (e) {
            if (!box.hidden && !box.contains(e.target) && e.target !== btn) close();
        });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

        box.addEventListener('click', function (e) {
            var b = e.target.closest('[data-u]');
            if (!b) return;
            var a = b.getAttribute('data-u');
            close();
            if (a === 'logout') {
                ums.ui.confirm('Đăng xuất khỏi hệ thống?', { ok: 'Đăng xuất', title: 'Đăng xuất' })
                    .then(function (yes) { if (yes) ums.session.logout(); });
            } else if (a === 'info') {
                ums.ui.toast('Màn hình thông tin cá nhân chưa chuyển sang giao diện mới.', 'info');
            } else if (a === 'soan' && ums.state && ums.state.mode === 'demo') {
                e.preventDefault();
                ums.ui.toast('Soạn bài hướng dẫn chỉ chạy trên máy chủ (cần phiên đăng nhập thật để phát token sang Cổng Help).', 'info');
            }
        });
    }

    ums.chrome = {
        reveal: reveal,
        config: CFG,

        init: function () {
            app = document.getElementById('app');
            if (!app) return;
            lastY = anchorY = global.scrollY || 0;
            global.addEventListener('scroll', onScroll, { passive: true });
            userMenu();
            apply();
        }
    };

    document.addEventListener('DOMContentLoaded', function () { ums.chrome.init(); });

})(window);
