/* =========================================================================
   ums.cmsBaoCao — phần dùng chung của module baocao (ApisCMS)
   ---------------------------------------------------------------------------
   bangCay(host, o) — bảng "Cấu trúc báo cáo" của khaibao / thuchien:
     · TIÊU ĐỀ nhiều tầng dựng từ cây cột (cột chính + cột phụ, nối bằng khoá
       cha) — thay insertHeaderTable của gốc;
     · THÂN là cây dòng dữ liệu, ô cha gộp dòng (rowspan) — thay
       insertBodyTableChinh;
     · (thuchien) mỗi dòng lá thêm một ô nhập cho mỗi cột lá được đánh dấu.

   Khác gốc (chỉ phần VẼ, không đổi dữ liệu):
     · Gốc dựng sẵn 8 hàng <thead> rồi kéo mọi ô colSpan = 1 xuống hết 8 hàng —
       ô CHA có đúng một cột con cũng bị kéo dài, đè lên con. Ở đây số hàng =
       độ sâu thật của cây, chỉ ô LÁ kéo xuống.
     · Gốc đặt colspan của dòng lá ở tầng 0 = 1 (sai khi cây có nhiều tầng) —
       ở đây ô lá luôn phủ hết các cột cây còn lại.
     · Bảng dựng tay (không qua ums.ui.table): tiêu đề cây nhiều tầng có ô
       bấm được + thân gộp dòng theo cây — ui.table / pat.groupTable không vẽ
       được. Vẫn dùng đúng lớp .ums-tablewrap / .ums-table / .ums-gtable;
       không có ô chọn trong bảng.
   Gốc mặc định cây: phần tử có khoá cha rỗng là gốc; phần tử trỏ tới cha
   không tồn tại thì không hiện (như gốc).

   o = {
     dau: [dòng cột], dauId: 'ID', dauCha: '<khoá cha>',
     oDau(item, laLa) → HTML trong <th>,
     laCot(item) → true nếu cột LÁ này có ô dữ liệu ở thân (thuchien),
     than: [dòng], thanId: 'ID', thanCha: '<khoá cha>',
     oThan(item, laLa) → HTML trong <td> tên dòng,
     oDuLieu(dongLa, cotLa) → HTML ô dữ liệu (khi có laCot),
     empty
   }
   → { dauLa: [cột lá], cot: [cột lá có dữ liệu], thanLa: [dòng lá] }
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    function rong(v) { return v === null || v === undefined || v === ''; }

    function cay(items, idK, chaK) {
        var con = {}, goc = [];
        (items || []).forEach(function (x) {
            var p = x[chaK];
            if (rong(p)) goc.push(x);
            else (con[p] = con[p] || []).push(x);
        });
        var dem = {};
        function la(x, seen) {
            var k = x[idK];
            if (dem[k] !== undefined) return dem[k];
            seen = seen || {};
            if (seen[k]) return 1;
            seen[k] = 1;
            var ks = con[k] || [];
            var n = ks.length ? ks.reduce(function (s, c) { return s + la(c, seen); }, 0) : 1;
            dem[k] = n;
            return n;
        }
        function kids(x) { return con[x[idK]] || []; }
        function sau(x, seen) {
            seen = seen || {};
            if (seen[x[idK]]) return 0;
            seen[x[idK]] = 1;
            var ks = kids(x);
            return ks.length ? 1 + Math.max.apply(null, ks.map(function (c) { return sau(c, seen); })) : 0;
        }
        return { goc: goc, kids: kids, la: la, sau: sau };
    }

    function bangCay(host, o) {
        var T = cay(o.dau, o.dauId || 'ID', o.dauCha);
        var B = cay(o.than, o.thanId || 'ID', o.thanCha);

        /* ---- tiêu đề ---- */
        var D = T.goc.length ? 1 + Math.max.apply(null, T.goc.map(function (g) { return T.sau(g); })) : 0;
        var hang = [], dauLa = [], seen = {};
        for (var i = 0; i < D; i++) hang.push([]);
        function veDau(x, lv) {
            var k = x[o.dauId || 'ID'];
            if (seen[k]) return;
            seen[k] = 1;
            var ks = T.kids(x);
            if (ks.length) {
                hang[lv].push('<th class="is-center" colspan="' + T.la(x) + '">' + o.oDau(x, false) + '</th>');
                ks.forEach(function (c) { veDau(c, lv + 1); });
            } else {
                dauLa.push(x);
                hang[lv].push('<th class="is-center"' + (D - lv > 1 ? ' rowspan="' + (D - lv) + '"' : '') + '>' + o.oDau(x, true) + '</th>');
            }
        }
        T.goc.forEach(function (g) { veDau(g, 0); });
        var cot = o.laCot ? dauLa.filter(o.laCot) : [];

        /* ---- thân ---- */
        var M = B.goc.length ? Math.max.apply(null, B.goc.map(function (g) { return B.sau(g); })) : 0;   // tầng lá sâu nhất
        var thanLa = [], seenB = {};
        function veThan(x, lv) {
            var k = x[o.thanId || 'ID'];
            if (seenB[k]) return [];
            seenB[k] = 1;
            var ks = B.kids(x);
            if (!ks.length) {
                thanLa.push(x);
                return [{ la: x, o: ['<td' + (M + 1 - lv > 1 ? ' colspan="' + (M + 1 - lv) + '"' : '') + '>' + o.oThan(x, true) + '</td>'] }];
            }
            var ds = [];
            ks.forEach(function (c) { ds = ds.concat(veThan(c, lv + 1)); });
            if (ds.length) ds[0].o.unshift('<td class="ums-gtable__g" rowspan="' + ds.length + '">' + o.oThan(x, false) + '</td>');
            return ds;
        }
        var dong = [];
        B.goc.forEach(function (g) { dong = dong.concat(veThan(g, 0)); });

        if (!D && !dong.length) {
            host.innerHTML = ui.empty(o.empty || 'Chưa có cấu trúc');
            return { dauLa: [], cot: [], thanLa: [] };
        }
        var h = '<div class="ums-tablewrap"><table class="ums-table ums-table--lined ums-gtable"><thead>' +
            hang.map(function (r) { return '<tr>' + r.join('') + '</tr>'; }).join('') + '</thead><tbody>' +
            dong.map(function (d) {
                return '<tr>' + d.o.join('') + cot.map(function (c) { return '<td>' + o.oDuLieu(d.la, c) + '</td>'; }).join('') + '</tr>';
            }).join('') + '</tbody></table></div>';
        host.innerHTML = h;
        return { dauLa: dauLa, cot: cot, thanLa: thanLa };
    }

    /* Chạy các hàm trả Promise với tối đa n luồng (gốc bắn N×M lời gọi cùng lúc) */
    function chayLuong(tasks, n) {
        var i = 0;
        function worker() {
            if (i >= tasks.length) return Promise.resolve();
            var t = tasks[i++];
            return Promise.resolve().then(t).catch(function (e) { if (e && e.expired) { i = tasks.length; ums.api.handle(e); } })
                .then(worker);
        }
        var ps = [];
        for (var k = 0; k < Math.max(1, n || 6); k++) ps.push(worker());
        return Promise.all(ps);
    }

    ums.cmsBaoCao = { bangCay: bangCay, chayLuong: chayLuong };
})();
