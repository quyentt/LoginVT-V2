/* =========================================================================
   ApisCMS — tầng chung của module vaitro (và ungdung/ungdungchucnang nạp chéo)
   ---------------------------------------------------------------------------
   Thay edu.system.loadToTreejs_data (jstree) của bản gốc. Bốn màn dùng:
   vaitro, vaitrochucnang, vaitronguoidung (cây vai trò) và
   ungdung/ungdungchucnang (cây chức năng) — tầng chung _v2/assets chưa có
   CÂY nên dựng tạm ở đây (đã báo đề nghị đưa lên tầng chung).

   ums.cmsCay.dung(rows, { id, cha })            → gốc [{ r, i, con: [...] }]
       Cây theo cột cha; mục mồ côi (cha không có trong danh sách) và mục
       tạo vòng (A cha B, B cha A — genCombo_VaiTro gốc đã phải tự phá vòng)
       nằm ở gốc, không mất.
   ums.cmsCay.html(rows, { id, cha, ten, sub, icon, kieu, active, attr })
       kieu 'nut'    — mỗi mục một <button class="cmsc-cay__node">, bấm được
       kieu 'xem'    — chỉ hiện (cây chức năng của ứng dụng)
       kieu 'chon'   — ô đánh dấu ba trạng thái (xem ums.cmsCay.chon)
   ums.cmsCay.loc(host, q)          lọc tại chỗ + tô từ khoá (filterTree_* gốc)
   ums.cmsCay.active(host, id)      tô mục đang chọn
   ums.cmsCay.chon(host, rows, o)   cây ô đánh dấu ba trạng thái (jstree
       "checkbox" plugin): đánh dấu cha → đánh dấu mọi con; con đổi → cha
       tự thành đủ / lưng chừng / trống.
       → { ids() (đã đánh dấu + lưng chừng, như bản gốc đọc jstree-clicked +
           jstree-undetermined), tatCa(on), dem() }
   ums.cmsCay.thuTu(rows, o)        danh sách phẳng theo thứ tự cây, kèm độ
       sâu — dùng đổ ô chọn "Vai trò cha" (loadToCombo_data type 'unorder').
   ums.cmsCay.bang(host, nhom, o)   bảng gộp ô NHIỀU TẦNG (insertHeaderTable
       của vaitrochucnang): cột 1 = nhóm (ứng dụng), các cột sau = các tầng
       chức năng, mục cha gộp dòng theo số lá.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var esc = ui.esc;

    function e(v) { return v === undefined || v === null ? '' : String(v); }
    function boDau(x) {
        return e(x).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
    }
    function lay(r, k) { return typeof k === 'function' ? k(r) : r[k]; }

    var C = ums.cmsCay = {};
    C.boDau = boDau;

    /* ---------- Dựng cây ------------------------------------------------ */
    C.dung = function (rows, o) {
        o = o || {};
        var id = o.id || 'ID', cha = o.cha;
        var map = {}, nodes = [];
        (rows || []).forEach(function (r, i) {
            var n = { r: r, i: i, con: [] };
            nodes.push(n);
            if (r[id] !== undefined && r[id] !== null) map[r[id]] = n;
        });
        var goc = [];
        nodes.forEach(function (n) {
            var p = cha ? n.r[cha] : '';
            var cay = p && map[p] && map[p] !== n ? map[p] : null;
            // Phá vòng: đi ngược lên, gặp lại chính nó thì coi là gốc
            if (cay) {
                var seen = {}, cur = p;
                seen[n.r[id]] = true;
                while (cur && map[cur]) {
                    if (seen[cur]) { cay = null; break; }
                    seen[cur] = true;
                    cur = map[cur].r[cha];
                }
            }
            (cay ? cay.con : goc).push(n);
        });
        return goc;
    };

    C.thuTu = function (rows, o) {
        var out = [];
        (function di(ds, sau) {
            ds.forEach(function (n) { out.push({ r: n.r, sau: sau }); di(n.con, sau + 1); });
        })(C.dung(rows, o), 0);
        return out;
    };

    /* ---------- Vẽ cây -------------------------------------------------- */
    C.html = function (rows, o) {
        o = o || {};
        var id = o.id || 'ID';
        var kieu = o.kieu || 'nut';
        var goc = C.dung(rows, o);
        if (!goc.length) return ui.empty(o.empty || 'Không tìm thấy dữ liệu!');

        function nut(n) {
            var r = n.r;
            var ten = e(lay(r, o.ten || 'TEN'));
            var sub = o.sub ? e(lay(r, o.sub)) : '';
            var icon = o.icon ? '<i class="fa-light ' + esc(typeof o.icon === 'function' ? o.icon(r) : o.icon) + '"></i>' : '';
            var trong = icon + '<span class="cmsc-cay__ten" data-ten="' + esc(ten) + '">' + esc(ten) + '</span>' +
                (sub ? '<span class="cmsc-cay__sub">' + esc(sub) + '</span>' : '');
            var them = o.attr ? o.attr(r, n.i) : '';
            if (kieu === 'chon') {
                return '<label class="cmsc-cay__node"><input type="checkbox" data-cay="' + esc(r[id]) + '"' + them + '>' + trong + '</label>';
            }
            if (kieu === 'xem') return '<div class="cmsc-cay__node is-static"' + them + '>' + trong + '</div>';
            return '<button type="button" class="cmsc-cay__node' + (o.active && o.active === r[id] ? ' is-active' : '') +
                '" data-id="' + esc(r[id]) + '"' + them + '>' + trong + '</button>';
        }
        function nhanh(ds) {
            return '<ul>' + ds.map(function (n) {
                return '<li data-cid="' + esc(n.r[id]) + '" data-q="' + esc(boDau(lay(n.r, o.ten || 'TEN'))) + '">' +
                    nut(n) + (n.con.length ? nhanh(n.con) : '') + '</li>';
            }).join('') + '</ul>';
        }
        return '<div class="cmsc-cay' + (kieu === 'chon' ? ' cmsc-cay--chon' : '') + '">' + nhanh(goc).replace(/^<ul>/, '<ul class="cmsc-cay__goc">') + '</div>';
    };

    /* ---------- Lọc + tô từ khoá (filterTree_VaiTro gốc) --------------- */
    C.loc = function (host, q) {
        if (!host) return 0;
        var kw = boDau(q).trim();
        var so = 0;
        function to(span, khop) {
            var ten = span.getAttribute('data-ten') || '';
            if (!khop || !kw) { span.textContent = ten; return; }
            var idx = boDau(ten).indexOf(kw);
            // Bỏ dấu giữ nguyên độ dài chuỗi dựng sẵn (NFC) — lệch thì chỉ lọc, không tô
            if (idx < 0 || boDau(ten).length !== ten.length) { span.textContent = ten; return; }
            span.innerHTML = esc(ten.substring(0, idx)) + '<mark>' + esc(ten.substring(idx, idx + kw.length)) + '</mark>' +
                esc(ten.substring(idx + kw.length));
        }
        function di(li) {
            var khop = !kw || (li.getAttribute('data-q') || '').indexOf(kw) >= 0;
            var conKhop = false;
            var ul = li.querySelector(':scope > ul');
            if (ul) Array.prototype.forEach.call(ul.children, function (c) { if (di(c)) conKhop = true; });
            var span = li.querySelector(':scope > .cmsc-cay__node .cmsc-cay__ten');
            if (span) to(span, khop);
            li.hidden = !(khop || conKhop);
            if (khop && kw) so++;
            return khop || conKhop;
        }
        var goc = host.querySelector('.cmsc-cay__goc');
        if (goc) Array.prototype.forEach.call(goc.children, di);
        return so;
    };

    C.active = function (host, id) {
        Array.prototype.forEach.call(host.querySelectorAll('.cmsc-cay__node[data-id]'), function (b) {
            b.classList.toggle('is-active', b.getAttribute('data-id') === id);
        });
    };

    /* ---------- Cây ô đánh dấu ba trạng thái ---------------------------- */
    C.chon = function (host, rows, o) {
        o = o || {};
        o.kieu = 'chon';
        host.innerHTML = C.html(rows, o);

        function boxOf(li) { return li.querySelector(':scope > .cmsc-cay__node input[data-cay]'); }
        function conOf(li) { var ul = li.querySelector(':scope > ul'); return ul ? Array.prototype.slice.call(ul.children) : []; }

        function xuong(li, on) {
            var b = boxOf(li);
            b.checked = on; b.indeterminate = false;
            conOf(li).forEach(function (c) { xuong(c, on); });
        }
        function tinh(li) {
            var con = conOf(li);
            if (!con.length) return;
            con.forEach(tinh);
            var du = 0, mot = 0;
            con.forEach(function (c) { var b = boxOf(c); if (b.checked && !b.indeterminate) du++; else if (b.checked || b.indeterminate) mot++; });
            var b = boxOf(li);
            b.checked = du === con.length;
            b.indeterminate = !b.checked && (du + mot) > 0;
        }
        function tinhHet() {
            var goc = host.querySelector('.cmsc-cay__goc');
            if (goc) Array.prototype.forEach.call(goc.children, tinh);
        }

        // Đánh dấu sẵn: y như select_node của jstree — mục và mọi con của nó
        var da = {};
        (o.da || []).forEach(function (x) { da[x] = true; });
        Array.prototype.forEach.call(host.querySelectorAll('li[data-cid]'), function (li) {
            if (da[li.getAttribute('data-cid')]) xuong(li, true);
        });
        tinhHet();

        // Vẽ lại vào cùng khung thì gỡ trình nghe của lần trước
        if (host.__cmsCay) host.removeEventListener('change', host.__cmsCay);
        host.__cmsCay = function (ev) {
            var b = ev.target.closest('input[data-cay]');
            if (!b || !host.contains(b)) return;
            xuong(b.closest('li'), b.checked);
            tinhHet();
            if (o.onChange) o.onChange();
        };
        host.addEventListener('change', host.__cmsCay);

        return {
            el: host,
            ids: function () {
                return Array.prototype.filter.call(host.querySelectorAll('input[data-cay]'), function (b) {
                    return b.checked || b.indeterminate;
                }).map(function (b) { return b.getAttribute('data-cay'); });
            },
            tatCa: function (on) {
                Array.prototype.forEach.call(host.querySelectorAll('input[data-cay]'), function (b) { b.checked = on; b.indeterminate = false; });
            },
            dem: function () { return host.querySelectorAll('input[data-cay]').length; }
        };
    };

    /* ---------- Bảng gộp ô nhiều tầng ----------------------------------
       nhom = [{ ten, rows }] ; o = { id, cha, o.o(r) → HTML ô, attr(r) → thuộc tính ô }
       Cột "Chức năng" chia theo số tầng sâu nhất; mục lá kéo hết phần còn lại
       (colspan) — đúng cách insertHeaderTable của bản gốc dựng.            */
    C.bang = function (host, nhom, o) {
        o = o || {};
        var ds = [];
        var sauMax = 0;
        (nhom || []).forEach(function (g) {
            var goc = C.dung(g.rows, o);
            if (!goc.length) return;
            (function doSau(list, s) {
                list.forEach(function (n) {
                    if (s > sauMax) sauMax = s;
                    doSau(n.con, s + 1);
                });
            })(goc, 1);
            ds.push({ g: g, goc: goc });
        });
        if (!ds.length) { host.innerHTML = ui.empty(o.empty || 'Không có dữ liệu'); return; }

        function la(n) { return n.con.length ? n.con.reduce(function (a, c) { return a + la(c); }, 0) : 1; }
        function td(n, s, rs) {
            var cs = n.con.length ? 1 : sauMax - s + 1;
            return '<td class="cmsc-bang__o"' + (rs > 1 ? ' rowspan="' + rs + '"' : '') + (cs > 1 ? ' colspan="' + cs + '"' : '') +
                (o.attr ? o.attr(n.r) : '') + '>' + (o.o ? o.o(n.r) : esc(n.r.TEN)) + '</td>';
        }

        var body = '';
        ds.forEach(function (x) {
            var dong = [];               // mỗi phần tử = chuỗi ô của một dòng
            (function di(list, s, dau) {
                list.forEach(function (n, k) {
                    var mo = dau && k === 0 ? dau : '';
                    if (!n.con.length) { dong.push(mo + td(n, s, 1)); return; }
                    di(n.con, s + 1, mo + td(n, s, la(n)));
                });
            })(x.goc, 1, '');
            var tong = dong.length;
            dong.forEach(function (d, i) {
                body += '<tr>' + (i === 0 ? '<td class="cmsc-bang__nhom" rowspan="' + tong + '">' + esc(x.g.ten) + '</td>' : '') + d + '</tr>';
            });
        });

        host.innerHTML = '<div class="ums-tablewrap"><table class="ums-table ums-table--lined ums-gtable cmsc-bang"><thead><tr>' +
            '<th>' + esc(o.nhomTitle || 'Ứng dụng') + '</th><th colspan="' + sauMax + '">' + esc(o.title || 'Chức năng') + '</th>' +
            '</tr></thead><tbody>' + body + '</tbody></table></div>';
    };
})();
