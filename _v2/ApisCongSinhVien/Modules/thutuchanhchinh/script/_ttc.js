/* =========================================================================
   _ttc.js — phần dùng chung của module "Thủ tục hành chính" (Cổng sinh viên)
   Dùng ở: xinxacnhan (Hệ thống 1 cửa của sinh viên), yeucau (Hệ thống một cửa);
   khối trao đổi còn dùng ở bản CÁN BỘ ApisSinhVien/Modules/thutuchanhchinh/canboxuly (cờ laSV).
   ---------------------------------------------------------------------------
     ums.ttc.sv()                  id người học đang xem (vai trò thủ vai)
     ums.ttc.e / esc / arr         tiện ích nhỏ, viết một lần
     ums.ttc.binhLuan(host, cfg)   khối trao đổi trong thẻ yêu cầu (genTab_TinNhan
                                   của bản gốc): danh sách tin + ô nhập + nút gửi
                                   cfg = { load() → Promise<dòng>, them(nộiDung) → Promise,
                                           xoa(id) → Promise,
                                           laSV(dòng) → true = tin của sinh viên (tuỳ chọn; mặc định:
                                                        người tạo tin ĐẦU TIÊN là sinh viên, như gốc) }
                                   → { tai() }  nạp / vẽ lại
     ums.ttc.sao(host, cfg)        chấm sao 1..5 (rate của bản gốc)
                                   cfg = { value, onPick(sao) }  → { set(n) }
   Kiểu riêng: css/_ttc.css (nạp bằng <link> trong từng .html).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui;
    var T = ums.ttc = {};

    T.e = function (v) { return v === null || v === undefined ? '' : v; };
    T.esc = function (s) { return ui.esc(s); };
    T.arr = function (d) { return Array.isArray(d) ? d : []; };
    T.sv = function () { return (ums.session && ums.session.userId) || ''; };

    var e = T.e, esc = T.esc, arr = T.arr;

    /* ---------- Khối trao đổi (tin nhắn) --------------------------------- */
    T.binhLuan = function (host, cfg) {
        host.innerHTML = '<div class="ttc-bl"><div class="ttc-bl__ds"></div>' +
            '<div class="ttc-bl__gui">' +
            '<input class="ums-input ttc-bl__o" placeholder="Nhập thông tin" autocomplete="off">' +
            '<button type="button" class="ums-btn ums-btn--primary ums-btn--sm ttc-bl__nut" title="Gửi">' +
            '<i class="fa-light fa-paper-plane"></i></button></div></div>';
        var ds = host.querySelector('.ttc-bl__ds'), o = host.querySelector('.ttc-bl__o');

        function ve(rows) {
            // Bản gốc: tin của NGƯỜI TẠO ĐẦU TIÊN là "của mình", còn lại là của cán bộ.
            // cfg.laSV(dòng) (tuỳ chọn) thay luật đó — bản cán bộ xử lý (ApisSinhVien/thutuchanhchinh/canboxuly)
            // coi tin KHÔNG phải của người đăng nhập là của sinh viên.
            var dau = rows.length ? rows[0].NGUOITAO_ID : '';
            ds.innerHTML = rows.map(function (r) {
                var laSV = cfg.laSV ? cfg.laSV(r) : r.NGUOITAO_ID === dau;
                return '<div class="ttc-bl__item' + (laSV ? ' is-sv' : ' is-gv') + '">' +
                    '<div class="ttc-bl__dau">' +
                    '<span class="ttc-bl__anh">' + (r.ANHDAIDIEN
                        ? '<img src="' + esc(ums.files.url(r.ANHDAIDIEN)) + '" alt="">'
                        : '<i class="fa-light fa-user"></i>') + '</span>' +
                    '<span class="ttc-bl__ten"><b>' + esc(e(r.NGUOITAO_TAIKHOAN)) + '</b>' +
                    '<span>' + esc(e(r.NGUOITAO_TENDAYDU)) + '</span></span>' +
                    '<button type="button" class="ums-iconbtn ums-iconbtn--del ttc-bl__xoa" data-bl="' + esc(e(r.ID)) +
                    '" title="Xóa"><i class="fa-light fa-trash-can"></i></button></div>' +
                    '<div class="ttc-bl__noi">' + ui.escBr(e(r.NOIDUNG)) + '</div>' +
                    '<div class="ttc-bl__ngay"><i class="fa-light fa-calendar-days"></i> ' +
                    esc(e(r.NGAYTAO_DD_MM_YYYY)) + '</div></div>';
            }).join('');
        }
        function tai() {
            return Promise.resolve(cfg.load()).then(function (rows) { ve(arr(rows)); }, function () { ve([]); });
        }
        function gui() {
            var s = o.value.trim();
            if (!s) return;
            Promise.resolve(cfg.them(s)).then(function () { o.value = ''; tai(); });
        }
        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-bl]');
            if (b) { Promise.resolve(cfg.xoa(b.getAttribute('data-bl'))).then(tai); return; }
            if (ev.target.closest('.ttc-bl__nut')) gui();
        });
        o.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); gui(); } });

        tai();
        return { tai: tai };
    };

    /* ---------- Chấm sao ------------------------------------------------- */
    T.sao = function (host, cfg) {
        var n = Number(cfg.value) || 0;
        function ve() {
            var h = '';
            for (var i = 1; i <= 5; i++) {
                h += '<button type="button" class="ttc-sao__i" data-sao="' + i + '" title="' + i + ' trên 5">' +
                    '<i class="' + (i <= n ? 'fa-solid' : 'fa-light') + ' fa-star"></i></button>';
            }
            host.innerHTML = '<div class="ttc-sao">' + h +
                '<span class="ttc-sao__chu">' + (n ? esc(n + ' trên 5') : '') + '</span></div>';
        }
        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-sao]');
            if (!b) return;
            n = Number(b.getAttribute('data-sao'));
            ve();
            if (cfg.onPick) cfg.onPick(n);
        });
        ve();
        return { set: function (v) { n = Number(v) || 0; ve(); } };
    };
})();
