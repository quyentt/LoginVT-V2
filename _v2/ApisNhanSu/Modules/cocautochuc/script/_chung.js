/* =========================================================================
   ApisNhanSu / cocautochuc — phần dùng chung của module (ums.nsCoCau)
   ---------------------------------------------------------------------------
   Chín màn của module chép nhau ba thứ:
     1. CÂY cơ cấu tổ chức (jstree — edu.system.loadToTreejs_data, lồng theo
        DAOTAO_COCAUTOCHUC_CHA_ID, tên TEN) + ô từ khoá lọc tại chỗ
        ("#zone ul li" toggle theo chữ) — cocautochuc, cocautochucngoaitruong,
        cocautochucv2, khungcocaunhansu, vitricongviec, vaitrovitri;
     2. ô "Thuộc cơ cấu / Đơn vị cha" (loadToCombo_data có parentId → danh sách
        thụt lề theo cây);
     3. danh sách đơn vị Core_Org_Unit và vị trí theo đơn vị
        (PKG_CORE_HOSONHANSU_03.LayDSCore_Org_Unit / LayDSCore_PositionByUnit) —
        phanconglaodong, quanhelaodong.

       var C = ums.nsCoCau;
       C.rows(r)                              mảng dữ liệu của một kết quả ums.api.call
       C.cay(host, rows, { id, cha, ten, chon })   vẽ cây kiểu DANH MỤC (BO-CUC mục 4)
       C.chon(host, id) · C.loc(host, từKhoá)      tô sáng nút · lọc + tô vàng chữ khớp
       C.theoCay(rows, o) → [{ row, sau }]         thứ tự cây kèm độ sâu
       C.optsCay(rows, o, nhãnĐầu) → HTML <option> thụt lề theo cây
       C.donVi() → Promise<dòng Core_Org_Unit>     (dùng chung một lần tải cho cả màn)
       C.viTri(orgId) → Promise<dòng Core_Position>
       C.homNay() → 'dd/mm/yyyy'

   Nút cây: <button class="ums-master__item nscc-node" data-id="…">. Cây nằm ở
   cột trái (ums.pat.master side.kieu 'danhmuc') hoặc trong khung chính — khi đó
   bọc bằng lớp .ums-master--danhmuc + .ums-master__list để dùng lại kiểu cây
   thư mục sẵn có (patterns.css), không viết kiểu riêng.
   Nợ tầng chung: đây là bản cây thứ tư (sau ums.cmsNd.cay, ums.cmsCay, ums.cmsCN)
   → nên gộp thành một ums.pat.cay.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui;
    function e(v) { return v === undefined || v === null ? '' : String(v); }

    var C = ums.nsCoCau = ums.nsCoCau || {};

    C.rows = function (r) { var d = r && r.data; return Array.isArray(d) ? d : (d && d.rs) || []; };

    C.homNay = function () {
        var d = new Date();
        function h(n) { return (n < 10 ? '0' : '') + n; }
        return h(d.getDate()) + '/' + h(d.getMonth() + 1) + '/' + d.getFullYear();
    };

    function cfg(o) {
        o = o || {};
        return { id: o.id || 'ID', cha: o.cha || 'DAOTAO_COCAUTOCHUC_CHA_ID', ten: o.ten || 'TEN', ma: o.ma };
    }
    /* Nút gốc = không có cha, hoặc cha không nằm trong danh sách (jstree của gốc
       cũng đưa những nút đó lên gốc). */
    function conCua(rows, k) {
        var ids = {}, con = { '': [] };
        rows.forEach(function (r) { ids[e(r[k.id])] = true; });
        rows.forEach(function (r) {
            var p = e(r[k.cha]);
            if (!p || !ids[p] || p === e(r[k.id])) p = '';
            (con[p] || (con[p] = [])).push(r);
        });
        return con;
    }

    C.cay = function (host, rows, o) {
        var k = cfg(o), con = conCua(rows || [], k), da = {};
        var dangChon = o && o.chon;
        function nhanh(pid) {
            var kids = (con[pid] || []).filter(function (r) { return !da[e(r[k.id])]; });
            if (!kids.length) return '';
            return '<ul>' + kids.map(function (r) {
                var id = e(r[k.id]);
                da[id] = true;
                var ten = e(r[k.ten]);
                return '<li data-text="' + ui.esc(ten.toLowerCase()) + '">' +
                    '<button type="button" class="ums-master__item nscc-node' + (id === dangChon ? ' is-active' : '') +
                    '" data-id="' + ui.esc(id) + '" title="' + ui.esc(ten) + '"><span class="nscc-node__t">' +
                    ui.esc(ten) + '</span></button>' + nhanh(id) + '</li>';
            }).join('') + '</ul>';
        }
        host.innerHTML = nhanh('') || ui.empty((o && o.empty) || 'Không có đơn vị nào', 'fa-sitemap');
    };

    C.chon = function (host, id) {
        Array.prototype.forEach.call(host.querySelectorAll('.nscc-node'), function (b) {
            b.classList.toggle('is-active', b.getAttribute('data-id') === id);
        });
    };

    /* Ô từ khoá của gốc: gõ tới đâu ẩn nhánh không chứa chữ tới đó. Ở đây: ẩn mọi
       nhánh, hiện nút khớp + các nút tổ tiên, tô vàng đoạn chữ khớp. Rỗng → hiện hết. */
    C.loc = function (host, q) {
        var kw = e(q).trim().toLowerCase();
        Array.prototype.forEach.call(host.querySelectorAll('li'), function (li) { li.hidden = !!kw; });
        Array.prototype.forEach.call(host.querySelectorAll('.nscc-node__t'), function (t) {
            var text = t.textContent;
            var idx = kw ? text.toLowerCase().indexOf(kw) : -1;
            if (idx < 0) { t.textContent = text; return; }
            t.innerHTML = ui.esc(text.substring(0, idx)) + '<mark class="nscc-mark">' +
                ui.esc(text.substring(idx, idx + kw.length)) + '</mark>' + ui.esc(text.substring(idx + kw.length));
            for (var li = t.closest('li'); li && host.contains(li); li = li.parentNode.closest('li')) li.hidden = false;
        });
    };

    C.theoCay = function (rows, o) {
        var k = cfg(o), con = conCua(rows || [], k), out = [], da = {};
        (function di(pid, sau) {
            (con[pid] || []).forEach(function (r) {
                var id = e(r[k.id]);
                if (da[id]) return;
                da[id] = true;
                out.push({ row: r, sau: sau });
                di(id, sau + 1);
            });
        })('', 0);
        return out;
    };

    /* loadToCombo_data có parentId của gốc: tên thụt lề theo cấp */
    C.optsCay = function (rows, o, head) {
        var k = cfg(o);
        return '<option value="">' + ui.esc(head || '-- Chọn --') + '</option>' + C.theoCay(rows, o).map(function (x) {
            return '<option value="' + ui.esc(x.row[k.id]) + '">' + ui.esc(new Array(x.sau + 1).join('— ') + e(x.row[k.ten])) + '</option>';
        }).join('');
    };

    /* PKG_CORE_HOSONHANSU_03.LayDSCore_Org_Unit — tham số chép nguyên getList_DonVi
       của phanconglaodong / quanhelaodong (ngày xem = hôm nay, chính thức, hiệu lực). */
    var donViP = null;
    C.donVi = function () {
        if (donViP) return donViP;
        donViP = ums.api.call({
            action: 'NS_HoSoNhanSu3_MH/DSA4BRICLjMkHg4zJh4ULyg1',
            func: 'PKG_CORE_HOSONHANSU_03.LayDSCore_Org_Unit',
            strTuKhoa: '', strOrg_Type_Code: '', dIs_Offcial: 1, dIs_Active: 1,
            strNgayXem: C.homNay(), strNguoiThucHien_Id: ''
        }).then(C.rows, function (err) { donViP = null; ums.api.handle(err, 'LayDSCore_Org_Unit'); return []; });
        return donViP;
    };

    /* PKG_CORE_HOSONHANSU_03.LayDSCore_PositionByUnit */
    C.viTri = function (orgId) {
        if (!orgId) return Promise.resolve([]);
        return ums.api.call({
            action: 'NS_HoSoNhanSu3_MH/DSA4BRICLjMkHhEuMig1KC4vAzgULyg1',
            func: 'PKG_CORE_HOSONHANSU_03.LayDSCore_PositionByUnit',
            strOrg_Unit_Id: orgId, strNguoiThucHien_Id: ''
        }).then(C.rows, function (err) { ums.api.handle(err, 'LayDSCore_PositionByUnit'); return []; });
    };

    /* NS_CoCauToChuc/LayDanhSach (GET) — danh sách cây của các màn cơ cấu */
    C.coCau = function (o) {
        o = o || {};
        return ums.api.call({
            action: o.action || 'NS_CoCauToChuc/LayDanhSach', method: 'GET',
            dTrangThai: o.dTrangThai !== undefined ? o.dTrangThai : 1,
            strLoaiCoCauToChuc_Id: e(o.strLoaiCoCauToChuc_Id),
            strCoCauToChucCha_Id: ''
        }).then(C.rows);
    };
})();
