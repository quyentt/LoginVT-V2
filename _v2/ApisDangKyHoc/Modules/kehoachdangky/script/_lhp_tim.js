/* =========================================================================
   Lớp học phần — Ô "Tìm cụm từ trong bảng…" (kiểu Ctrl+F)
   Bản gốc: script/lophocphan.js — findState, runFindInTable, _doFind,
   _loadFindCache, _applyClientFilter, scanRenderedMatches, gotoFindMatch,
   next/prevFindMatch, clearFindInTable, updateFindCounter (khối "Find-in-table")
   ---------------------------------------------------------------------------
   Hành vi giữ nguyên bản gốc:
     · Gõ (trễ 300 ms): lần đầu với một bảng thì tải TOÀN BỘ dữ liệu của bảng
       đang hiện (cùng bộ lọc, từ khoá = '', trang 1, 100000 dòng) vào bộ nhớ,
       rồi giữ lại các bản ghi có BẤT KỲ trường nào chứa cụm từ (không phân
       biệt hoa thường) và vẽ lại bảng bằng các bản ghi đó.
     · Dòng nào chữ hiện trên màn chứa cụm từ thì tô vàng; dòng đang chọn tô
       đậm hơn và cuộn tới. Enter = sau, Shift+Enter = trước, Esc = xoá.
     · Xoá cụm từ khi đang lọc → nạp lại danh sách thường.
     · Bấm một nút "Xem …" ở thanh lọc → xoá ô tìm và bỏ bộ nhớ tạm.

   ums.lhp.tim(host, {
       dangXem()       → khoá bảng đang hiện ('lhp' | 'ct' | 'cb' | 'rut') hoặc null
       taiHet(k)       → Promise<mảng bản ghi> (toàn bộ, cùng bộ lọc, không từ khoá)
       veLoc(k, rows)  vẽ bảng bằng các bản ghi đã lọc (không phân trang)
       veLai(k)        nạp lại danh sách thường
       bang(k)         phần tử chứa bảng đang hiện
   }) → { lamMoi(), xoa(khongNap), huyCache(), dangLoc() }
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui;
    var L = ums.lhp = ums.lhp || {};

    L.tim = function (host, o) {
        var st = { kw: '', matches: [], cur: -1, active: false, cache: null, cacheK: null, loading: false };
        var hen = null;

        host.innerHTML =
            '<div class="lhp-tim" title="Tìm cụm từ trong bảng đang hiển thị">' +
                '<input type="text" class="ums-input lhp-tim__o" placeholder="Tìm cụm từ trong bảng..." autocomplete="off">' +
                '<span class="lhp-tim__dem">0/0</span>' +
                '<button type="button" class="ums-iconbtn" data-t="truoc" title="Trước (Shift+Enter)"><i class="fa-light fa-chevron-up"></i></button>' +
                '<button type="button" class="ums-iconbtn" data-t="sau" title="Sau (Enter)"><i class="fa-light fa-chevron-down"></i></button>' +
                '<button type="button" class="ums-iconbtn" data-t="xoa" title="Xóa (Esc)"><i class="fa-light fa-xmark"></i></button>' +
            '</div>';
        var inp = host.querySelector('.lhp-tim__o'), dem = host.querySelector('.lhp-tim__dem');

        function capNhat() {
            var n = st.matches.length, cur = st.cur >= 0 ? st.cur + 1 : 0;
            dem.classList.remove('is-co', 'is-khong');
            if (!st.kw) dem.textContent = '0/0';
            else if (!n) { dem.textContent = '0/0'; dem.classList.add('is-khong'); }
            else { dem.textContent = cur + '/' + n; dem.classList.add('is-co'); }
            host.querySelector('[data-t="truoc"]').disabled = !n;
            host.querySelector('[data-t="sau"]').disabled = !n;
        }
        function boTo() {
            ['lhp', 'ct', 'rut'].forEach(function (k) {
                var b = o.bang(k);
                if (!b) return;
                Array.prototype.forEach.call(b.querySelectorAll('tbody tr'), function (tr) {
                    tr.classList.remove('lhp-tim--khop', 'lhp-tim--dang');
                });
            });
        }
        function den(i) {
            var n = st.matches.length;
            if (!n) { st.cur = -1; capNhat(); return; }
            if (st.cur >= 0 && st.matches[st.cur]) st.matches[st.cur].classList.remove('lhp-tim--dang');
            st.cur = ((i % n) + n) % n;
            var tr = st.matches[st.cur];
            tr.classList.add('lhp-tim--dang');
            try { tr.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' }); } catch (e) { tr.scrollIntoView(); }
            capNhat();
        }
        function quet() {
            boTo();
            st.matches = []; st.cur = -1;
            var k = o.dangXem(), kw = st.kw.toLowerCase();
            if (!k || !kw) { capNhat(); return; }
            var b = o.bang(k);
            Array.prototype.forEach.call(b ? b.querySelectorAll('tbody tr') : [], function (tr) {
                if (tr.textContent.toLowerCase().indexOf(kw) >= 0) { tr.classList.add('lhp-tim--khop'); st.matches.push(tr); }
            });
            if (st.matches.length) den(0); else capNhat();
        }
        function khop(r, kw) {
            for (var k in r) {
                if (!Object.prototype.hasOwnProperty.call(r, k) || r[k] === null || r[k] === undefined) continue;
                if (String(r[k]).toLowerCase().indexOf(kw) >= 0) return true;
            }
            return false;
        }
        function loc(k) {
            var kw = st.kw.toLowerCase();
            st.active = true;
            o.veLoc(k, (st.cache || []).filter(function (r) { return khop(r, kw); }));
            // veLoc vẽ xong thì gọi lamMoi() → quét tô dòng
        }
        function tim() {
            var k = o.dangXem();
            if (!k) { capNhat(); return; }
            if (!st.kw) {
                if (st.active) { st.active = false; o.veLai(k); } else quet();
                return;
            }
            if (st.cache && st.cacheK === k) { loc(k); return; }
            if (st.loading) return;
            st.loading = true; st.cacheK = k;
            dem.textContent = '...'; dem.classList.remove('is-co', 'is-khong');
            o.taiHet(k).then(function (rows) {
                st.cache = rows || []; st.loading = false;
                if (st.kw) loc(k);
            }, function (err) {
                st.cache = null; st.loading = false; capNhat();
                ums.api.handle(err, 'tìm trong bảng');
            });
        }
        function xoa(khongNap) {
            if (hen) { clearTimeout(hen); hen = null; }
            var dangLoc = st.active;
            boTo();
            st.kw = ''; st.matches = []; st.cur = -1; st.active = false;
            inp.value = '';
            capNhat();
            if (dangLoc && khongNap !== true && o.dangXem()) o.veLai(o.dangXem());
        }

        inp.addEventListener('input', function () {
            st.kw = (inp.value || '').trim();
            if (hen) clearTimeout(hen);
            hen = setTimeout(tim, 300);
        });
        inp.addEventListener('keydown', function (ev) {
            if (ev.key === 'Enter') { ev.preventDefault(); if (st.matches.length) den(st.cur + (ev.shiftKey ? -1 : 1)); }
            else if (ev.key === 'Escape') { ev.preventDefault(); xoa(false); }
        });
        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-t]');
            if (!b || b.disabled) return;
            var t = b.getAttribute('data-t');
            if (t === 'xoa') xoa(false);
            else if (st.matches.length) den(st.cur + (t === 'sau' ? 1 : -1));
        });
        capNhat();

        return {
            lamMoi: function () { if (st.kw) quet(); else capNhat(); },
            xoa: xoa,
            huyCache: function () { st.cache = null; st.cacheK = null; st.loading = false; },
            dangLoc: function () { return st.active; }
        };
    };
})();
