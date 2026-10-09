/* =========================================================================
   Nền động cho trang đăng nhập — các điểm trôi, điểm nào gần nhau thì nối
   =========================================================================
   Vẽ bằng <canvas> thuần, không thư viện, không ảnh — nên không phải chép
   tệp ảnh nặng lên máy chủ và đổi màu theo đúng biến màu của hệ.

   Cách dùng: đặt <canvas id="umsLoginBg"></canvas> rồi nạp tệp này.

   Ba điều đã tính sẵn:
     · Máy yếu / màn hình lớn: số điểm tính theo diện tích, chặn trên 110 điểm.
     · Tab bị ẩn thì DỪNG hẳn vòng vẽ (không đốt pin khi không ai nhìn).
     · Người dùng đặt "giảm chuyển động" (prefers-reduced-motion) thì vẽ MỘT
       khung tĩnh rồi thôi.
   ========================================================================= */
(function (global) {
    'use strict';

    var canvas = document.getElementById('umsLoginBg');
    if (!canvas || !canvas.getContext) return;

    var ctx = canvas.getContext('2d');
    var diem = [];
    var w = 0, h = 0, dpr = 1, raf = null;
    var NOI = 150;            // khoảng cách tối đa còn nối hai điểm (px)
    var lang = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Màu lấy từ biến của hệ, để đổi màu ở site.config.js là nền đổi theo */
    function bien(ten, duPhong) {
        var v = getComputedStyle(document.documentElement).getPropertyValue(ten);
        return (v || '').trim() || duPhong;
    }

    function doKhung() {
        dpr = Math.min(global.devicePixelRatio || 1, 2);
        w = canvas.clientWidth;
        h = canvas.clientHeight;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function taoDiem() {
        var n = Math.min(110, Math.round(w * h / 14000));
        diem = [];
        for (var i = 0; i < n; i++) {
            diem.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                r: Math.random() * 1.6 + 0.6
            });
        }
    }

    function ve() {
        var mauDiem = bien('--ums-login-dot', 'rgba(255,255,255,.85)');
        var mauNoi = bien('--ums-login-line', '120,170,255');

        ctx.clearRect(0, 0, w, h);

        for (var i = 0; i < diem.length; i++) {
            var a = diem[i];
            for (var j = i + 1; j < diem.length; j++) {
                var b = diem[j];
                var dx = a.x - b.x, dy = a.y - b.y;
                var d = Math.sqrt(dx * dx + dy * dy);
                if (d > NOI) continue;
                /* Càng gần càng rõ — đây là thứ tạo cảm giác "mạng lưới" */
                ctx.strokeStyle = 'rgba(' + mauNoi + ',' + (0.30 * (1 - d / NOI)).toFixed(3) + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
            ctx.fillStyle = mauDiem;
            ctx.beginPath();
            ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function buoc() {
        for (var i = 0; i < diem.length; i++) {
            var p = diem[i];
            p.x += p.vx;
            p.y += p.vy;
            /* Chạm mép thì quay đầu — không cho điểm bay mất khỏi khung */
            if (p.x < 0 || p.x > w) p.vx = -p.vx;
            if (p.y < 0 || p.y > h) p.vy = -p.vy;
        }
        ve();
        raf = global.requestAnimationFrame(buoc);
    }

    function chay() {
        if (raf) return;
        raf = global.requestAnimationFrame(buoc);
    }

    function dung() {
        if (!raf) return;
        global.cancelAnimationFrame(raf);
        raf = null;
    }

    function khoiDong() {
        doKhung();
        taoDiem();
        if (lang) { ve(); return; }
        chay();
    }

    var hen = null;
    global.addEventListener('resize', function () {
        clearTimeout(hen);
        hen = setTimeout(function () {
            dung();
            khoiDong();
        }, 200);
    });

    document.addEventListener('visibilitychange', function () {
        if (lang) return;
        if (document.hidden) dung(); else chay();
    });

    khoiDong();

})(window);
