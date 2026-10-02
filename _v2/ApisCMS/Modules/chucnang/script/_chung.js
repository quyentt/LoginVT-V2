/* =========================================================================
   ApisCMS / chucnang — phần dùng chung của "Quản lý chức năng" và "Sơ đồ quy trình"
   ---------------------------------------------------------------------------
   Hai màn gốc (chucnang.js, sodoquytrinh.js) chép nhau phần cột trái:
   ô chọn ứng dụng + CÂY chức năng (jstree, lồng theo CHUCNANGCHA_ID, tên
   TENCHUCNANG, số lượng = data.Pager). Ở đây gom thành:

       var C = ums.cmsCN;
       C.fillUngDung(selectEl, rows)        đổ danh sách ứng dụng (ID / TENUNGDUNG)
       C.cay(hostEl, rows, idĐangChọn)      vẽ cây kiểu danh mục (pat.master side.kieu 'danhmuc')
       C.chon(hostEl, id)                   tô sáng một nút
       C.loc(hostEl, từKhoá)                lọc + tô vàng chữ khớp (filterTree_ChucNang của gốc)
       C.theoCay(rows)                      [{ row, sau }] theo thứ tự cây — cho ô "Chức năng cha"
       C.rows(r)                            mảng dữ liệu của một kết quả ums.api.call

   Nút cây: <button class="ums-master__item cn-node" data-id="…">. Màn tự nghe
   click trên vùng cây (không gắn gì lên document).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui;

    function e(v) { return v === undefined || v === null ? '' : String(v); }

    var C = ums.cmsCN = {};

    C.rows = function (r) { var d = r && r.data; return Array.isArray(d) ? d : (d && d.rs) || []; };

    C.fillUngDung = function (sel, rows) {
        ums.pat.fill(sel, rows, { id: 'ID', name: 'TENUNGDUNG', head: 'Chọn ứng dụng' });
    };

    /* Nút gốc = không có cha, hoặc cha không nằm trong danh sách (jstree của gốc
       cũng đưa những nút đó lên gốc). */
    function conCua(rows) {
        var ids = {}, con = { '': [] };
        rows.forEach(function (r) { ids[r.ID] = true; });
        rows.forEach(function (r) {
            var p = e(r.CHUCNANGCHA_ID);
            if (!p || !ids[p] || p === r.ID) p = '';
            (con[p] || (con[p] = [])).push(r);
        });
        return con;
    }

    C.cay = function (host, rows, dangChon) {
        var con = conCua(rows || []);
        var da = {};
        function nhanh(pid) {
            var kids = (con[pid] || []).filter(function (r) { return !da[r.ID]; });
            if (!kids.length) return '';
            return '<ul>' + kids.map(function (r) {
                da[r.ID] = true;
                return '<li data-text="' + ui.esc(e(r.TENCHUCNANG).toLowerCase()) + '">' +
                    '<button type="button" class="ums-master__item cn-node' + (r.ID === dangChon ? ' is-active' : '') +
                    '" data-id="' + ui.esc(r.ID) + '" title="' + ui.esc(r.TENCHUCNANG) + '"><span class="cn-node__t">' +
                    ui.esc(r.TENCHUCNANG) + '</span></button>' + nhanh(r.ID) + '</li>';
            }).join('') + '</ul>';
        }
        host.innerHTML = nhanh('') || ui.empty('Không có chức năng nào');
    };

    C.chon = function (host, id) {
        Array.prototype.forEach.call(host.querySelectorAll('.cn-node'), function (b) {
            b.classList.toggle('is-active', b.getAttribute('data-id') === id);
        });
    };

    /* filterTree_ChucNang: ẩn mọi nhánh, hiện nút khớp + các nút tổ tiên,
       tô vàng đoạn chữ khớp. Từ khoá rỗng → hiện lại tất cả. */
    C.loc = function (host, q) {
        var kw = e(q).trim().toLowerCase();
        var lis = host.querySelectorAll('li');
        Array.prototype.forEach.call(lis, function (li) { li.hidden = !!kw; });
        Array.prototype.forEach.call(host.querySelectorAll('.cn-node__t'), function (t) {
            var text = t.textContent;
            var idx = kw ? text.toLowerCase().indexOf(kw) : -1;
            if (idx < 0) { t.textContent = text; return; }
            t.innerHTML = ui.esc(text.substring(0, idx)) + '<mark class="cn-mark">' +
                ui.esc(text.substring(idx, idx + kw.length)) + '</mark>' + ui.esc(text.substring(idx + kw.length));
            for (var li = t.closest('li'); li && host.contains(li); li = li.parentNode.closest('li')) li.hidden = false;
        });
    };

    /* Thứ tự cây, kèm độ sâu — ô "Chức năng cha" của gốc (loadToCombo_data có parentId) */
    C.theoCay = function (rows) {
        var con = conCua(rows || []), out = [], da = {};
        (function di(pid, sau) {
            (con[pid] || []).forEach(function (r) {
                if (da[r.ID]) return;
                da[r.ID] = true;
                out.push({ row: r, sau: sau });
                di(r.ID, sau + 1);
            });
        })('', 0);
        return out;
    };
})();
