/* =========================================================================
   Cấu hình nhóm và thứ tự vai trò
   Bản gốc: ApisCMS/Modules/vaitro/html/nhomvaitro.html + script/nhomvaitro.js
   (kho gốc 8/11 — màn MỚI đi kèm trang chủ 9 nhóm vai trò theo Điều 2 biên bản EAUT-APIS 13/03/2026)
   ---------------------------------------------------------------------------
   Một cột như bản gốc: ghi chú cách dùng → thanh lọc (tìm, sắp xếp, lọc, Tải lại)
   → bảng vai trò, mỗi dòng có ô chọn NHÓM + ô THỨ TỰ (▲ số ▼) → dòng đếm thay đổi.
   Nút "Hoàn tác" / "Lưu thay đổi" đặt ở đầu trang (dính đỉnh khi cuộn — bản gốc để
   ở chân khung, cuộn bảng dài thì mất nút).

   Cách lưu (giữ nguyên gốc): ghi thẻ vào CUỐI cột MOTA của vai trò bằng API SuaVaiTro
   sẵn có — gửi lại nguyên các trường khác, CHỈ đổi MOTA:
       [nhom:mã]   nhóm của vai trò (mã lấy từ danh mục dữ liệu "nhomvaitro")
       [stt:N]     thứ tự trong nhóm (số nhỏ đứng trước; chưa có số đứng sau, theo tên)
   Đây là cách TẠM vì bảng vai trò chưa có cột riêng. Khi BE thêm cột riêng chỉ đổi:
   tagOf / sttOf (đọc), withTags (ghi), yeuCauSua (tham số gửi).

   Lời gọi (chép nguyên văn):
       pkg_chung_quanlynguoidung.LayDanhSachVaiTro   CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikXICgVMy4P
           versionAPI v1.0, strLoaiVaiTro_Id "", strTuKhoa "", pageIndex 1, pageSize 1000,
           dTrangThai 1, strChung_VaiTro_Cha_Id ""
       CMS_QuanLyNguoiDung/SuaVaiTro   versionAPI, strMaVaiTro, strTenVaiTro, strMoTa (đã gắn thẻ),
           dThuTu, dTrangThai 1, strLoaiVaiTro_Id, strChung_VaiTro_Cha_Id, strNguoiThucHien_Id "", strId
       Danh mục dữ liệu "nhomvaitro" (ums.api.dm): Mã = mã nhóm, Tên = tên nhóm, HESO1 hoặc
           thẻ [stt:N] ở MOTA = thứ tự nhóm. Trống / lỗi → dùng 9 nhóm có sẵn (NHOM_MAC_DINH).

   Khác gốc / cố ý:
     · Ô chọn nhóm trong bảng là <select> thường (9–10 mục) thay select2 — BO-CUC luật 2.
     · Lưu hàng loạt qua form tiến trình chung ums.process.run (gốc: edu.process.run,
       dự phòng saveSequential — ở đây không cần dự phòng).
     · Tìm gõ tự lọc, không nút Tìm kiếm; Tải lại là nút ↻ cuối thanh lọc (luật 26/9).
     · Danh mục trống thì tầng chung tự hiện khung "Cần làm trước" (ums.lamTruoc) — không
       thêm thông báo riêng.

   Việc chờ: khi chuyển phân nhóm TRANG CHỦ (_v2/assets/js/app.js + site.config roleGroups)
   sang 9 nhóm, dời NHOM_MAC_DINH / tagOf / sttOf / gopNhom ở đây lên tầng chung để hai nơi
   dùng chung một bảng (CHO-CHUYEN-SAU-PULL.md lần kéo 15, dòng index.aspx).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var root = document.getElementById('cms-nhomvaitro');
    if (!root) return;

    var DM_MA = 'nhomvaitro';
    /* color = màu chấm nhóm — đúng màu nhóm trên trang chủ gốc (GROUPS.fg, index.aspx) */
    var NHOM_MAC_DINH = [
        { code: 'tuyensinh', label: 'Quản lý tuyển sinh và sinh viên', color: '#be185d' },
        { code: 'daotao',    label: 'Quản lý đào tạo',                 color: '#6d28d9' },
        { code: 'khaothi',   label: 'Quản lý khảo thí',                color: '#c2410c' },
        { code: 'taichinh',  label: 'Quản lý tài chính và học phí',    color: '#15803d' },
        { code: 'cong',      label: 'Hệ thống cổng thông tin',         color: '#1d4ed8' },
        { code: 'mobile',    label: 'Ứng dụng di động',                color: '#0e7490' },
        { code: 'nhansu',    label: 'Nhân sự',                         color: '#a21caf' },
        { code: 'quantri',   label: 'Quản trị hệ thống',               color: '#4d7c0f' },
        { code: 'khac',      label: 'Khác',                            color: '#6b7280' }
    ];
    var MAU_MOI = ['#0f766e', '#4338ca', '#b91c1c', '#a16207', '#92400e', '#0369a1', '#9a3412', '#115e59'];

    var S = {
        rows: [], byId: {},
        nhom: NHOM_MAC_DINH.slice(),
        doi: {},        // ID vai trò → mã nhóm mới ('' = theo mặc định); chỉ dòng KHÁC giá trị đã lưu
        stt: {},        // ID vai trò → thứ tự mới ('' = bỏ); chỉ dòng KHÁC giá trị đã lưu
        daLuu: {},      // ID → { nhom, stt } lưu thành công lần gần nhất (đối chiếu lại với máy chủ)
        laRank: {},     // mã nhóm lạ → thứ hạng khối
        timer: 0
    };

    /* ---------- Thẻ trong MOTA (cùng quy ước với trang chủ gốc) ----------- */
    function tagOf(moTa) { var m = /\[nhom:([a-z0-9_]+)\]/i.exec(moTa || ''); return m ? m[1].toLowerCase() : ''; }
    function sttOf(moTa) { var m = /\[stt:(\d+)\]/i.exec(moTa || ''); var n = m ? parseInt(m[1], 10) : 0; return n > 0 ? String(n) : ''; }
    function withTags(moTa, code, stt) {
        var out = String(moTa === null || moTa === undefined ? '' : moTa)
            .replace(/\s*\[nhom:[a-z0-9_]+\]/ig, '').replace(/\s*\[stt:\d+\]/ig, '').trim();
        if (code) out += (out ? ' ' : '') + '[nhom:' + code + ']';
        if (stt) out += (out ? ' ' : '') + '[stt:' + stt + ']';
        return out;
    }
    function norm(s) {
        return String(s === null || s === undefined ? '' : s).toLowerCase()
            .normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
    }

    /* ---------- Danh sách nhóm: có sẵn + danh mục "nhomvaitro" ------------- */
    function thuTuDm(r) {
        var h = parseFloat(r && r.HESO1);
        if (isFinite(h) && h > 0) return h;
        var m = /\[stt:(\d+)\]/i.exec((r && r.MOTA) || '');
        return m ? parseInt(m[1], 10) : null;
    }
    /* Mã có sẵn: lấy TÊN danh mục làm nhãn. Mã mới: thêm trước "Khác", màu lần lượt MAU_MOI. Không xoá nhóm có sẵn.
       Thứ tự: dòng có số (HESO1 / [stt:N]) xếp theo số và đứng TRƯỚC dòng chưa có số. Mã chỉ a-z 0-9 _. */
    function gopNhom(rows) {
        var seen = {}, extra = [], doiTen = {}, thuTu = {};
        (rows || []).forEach(function (r) {
            var code = String((r && r.MA) || '').trim().toLowerCase(), label = String((r && r.TEN) || '').trim();
            if (!code || !label || seen[code]) return;
            if (!/^[a-z0-9_]+$/.test(code)) { if (window.console) console.warn('[nhomvaitro] Bỏ mã nhóm không hợp lệ trong danh mục: "' + r.MA + '"'); return; }
            seen[code] = true;
            var o = thuTuDm(r);
            if (o !== null) thuTu[code] = o;
            if (NHOM_MAC_DINH.some(function (g) { return g.code === code; })) doiTen[code] = label; else extra.push({ code: code, label: label });
        });
        var out = [], khac = null;
        NHOM_MAC_DINH.forEach(function (g) {
            var it = { code: g.code, label: doiTen[g.code] || g.label, color: g.color };
            if (g.code === 'khac') khac = it; else out.push(it);
        });
        extra.forEach(function (g, i) { out.push({ code: g.code, label: g.label, color: MAU_MOI[i % MAU_MOI.length] }); });
        if (khac) out.push(khac);
        var pos = {};
        out.forEach(function (g, i) { pos[g.code] = i; });
        out.sort(function (a, b) {
            var ha = thuTu.hasOwnProperty(a.code), hb = thuTu.hasOwnProperty(b.code);
            if (ha && hb) return (thuTu[a.code] - thuTu[b.code]) || (pos[a.code] - pos[b.code]);
            if (ha) return -1;
            if (hb) return 1;
            return pos[a.code] - pos[b.code];
        });
        return out;
    }
    function nhomCua(code) { for (var i = 0; i < S.nhom.length; i++) if (S.nhom[i].code === code) return S.nhom[i]; return null; }
    function labelOf(code) { if (!code) return 'Theo mặc định'; var g = nhomCua(code); return g ? g.label : '(mã lạ: ' + code + ')'; }
    function colorOf(code) { var g = nhomCua(code); return g ? g.color : '#94a3b8'; }
    function blockRank(code) {
        if (!code) return 1000000;
        for (var i = 0; i < S.nhom.length; i++) if (S.nhom[i].code === code) return i;
        return S.nhom.length + 1 + (S.laRank[code] || 0);
    }

    /* ---------- Trạng thái từng dòng ---------------------------------------- */
    function origOf(r) { return tagOf(r.MOTA); }
    function curOf(r) { return S.doi.hasOwnProperty(r.ID) ? S.doi[r.ID] : origOf(r); }
    function origStt(r) { return sttOf(r.MOTA); }
    function curStt(r) { return S.stt.hasOwnProperty(r.ID) ? S.stt[r.ID] : origStt(r); }
    function daDoi(r) { return curOf(r) !== origOf(r) || curStt(r) !== origStt(r); }
    function datStt(r, v) { if (v === origStt(r)) delete S.stt[r.ID]; else S.stt[r.ID] = v; }
    function datNhom(r, code) { if (code === origOf(r)) delete S.doi[r.ID]; else S.doi[r.ID] = code; }
    function soDoi() {
        var all = {};
        Object.keys(S.doi).forEach(function (k) { all[k] = 1; });
        Object.keys(S.stt).forEach(function (k) { all[k] = 1; });
        return Object.keys(all).length;
    }

    /* ---------- Khung trang ------------------------------------------------- */
    root.innerHTML =
        pat.page('Cấu hình nhóm và thứ tự vai trò',
            ui.btn('reload', { text: 'Hoàn tác', icon: 'fa-arrow-rotate-left', attr: { 'data-a': 'hoantac' } }) +
            ui.btn('save', { text: 'Lưu thay đổi', attr: { 'data-a': 'luu' } })) +
        '<div class="cmsnvt-note">' +
            'Chọn nhóm để mỗi vai trò hiện đúng nhóm trên màn hình <b>Danh sách vai trò</b> ở trang chủ. ' +
            'Để <b>"Theo mặc định hệ thống"</b> thì vai trò giữ nhóm mặc định. Thay đổi áp dụng cho <b>toàn hệ thống</b>, người dùng thấy sau khi tải lại trang.<br>' +
            '<b>Sắp thứ tự:</b> bấm <b>▲ ▼</b> để đưa vai trò lên / xuống trong nhóm, hoặc gõ số vào ô <b>Thứ tự</b> rồi nhấn <b>Enter</b> ' +
            '(số nhỏ đứng trước; vai trò chưa có số đứng sau, theo tên). Thứ tự các <b>nhóm</b> chỉnh ở danh mục dữ liệu <code>nhomvaitro</code> (cột Thứ tự / HeSo1).<br>' +
            'Nhóm và thứ tự được lưu dưới dạng thẻ <code>[nhom:…]</code> <code>[stt:…]</code> ở cuối ô <b>Mô tả</b> của vai trò (trang Vai trò) — không xoá các thẻ này.' +
        '</div>' +
        '<div class="cmsnvt-banner" data-z="banner"></div>' +
        '<div data-z="loc"></div>' +
        pat.panel({
            title: 'Danh sách vai trò', icon: 'fa-layer-group', count: 'tong', flush: true,
            body: '<div data-z="bang"></div>',
            foot: '<span data-z="soDoi">Chưa có thay đổi</span>'
        });

    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    var elBang = z('bang'), elLoc = z('loc'), elBanner = z('banner');
    var elTim, elSx, elLocNhom;

    function banner(tone, html) {
        elBanner.innerHTML = html ? '<div class="cmsnvt-banner--' + esc(tone) + '">' + html + '</div>' : '';
    }

    /* Thanh lọc dựng SAU khi có danh sách nhóm (ô lọc liệt kê từng nhóm) */
    function dungLoc() {
        elLoc.innerHTML = pat.filterBar([
            { key: 'q', type: 'text', label: 'Tìm theo tên hoặc mã vai trò...' },
            { key: 'sx', type: 'select', label: 'Sắp theo nhóm và thứ tự' },
            { key: 'loc', type: 'select', label: 'Tất cả vai trò' }
        ], { search: false, extra: '<div class="ums-field ums-field--fit">' + ui.btn('reload', { attr: { 'data-a': 'tailai' } }) + '</div>' });
        elTim = elLoc.querySelector('[data-f="q"]');
        elSx = elLoc.querySelector('[data-f="sx"]');
        elLocNhom = elLoc.querySelector('[data-f="loc"]');
        elSx.insertAdjacentHTML('beforeend', '<option value="ten">Sắp theo tên A–Z</option>');
        elLocNhom.insertAdjacentHTML('beforeend',
            '<option value="set">Đã chọn nhóm</option><option value="unset">Chưa chọn (theo mặc định)</option><option value="changed">Có thay đổi chưa lưu</option>' +
            '<optgroup label="Theo nhóm đã chọn">' + S.nhom.map(function (g) { return '<option value="g:' + esc(g.code) + '">' + esc(g.label) + '</option>'; }).join('') + '</optgroup>');
    }
    function boLoc() {
        return { kw: norm(elTim ? elTim.value : '').trim(), loc: (elLocNhom && elLocNhom.value) || '', sx: (elSx && elSx.value) === 'ten' ? 'ten' : 'nhom' };
    }
    function khop(r, f) {
        if (f.kw && norm(r.TENVAITRO + ' ' + r.MAVAITRO).indexOf(f.kw) < 0) return false;
        var cur = curOf(r);
        if (f.loc === 'set') return cur !== '';
        if (f.loc === 'unset') return cur === '';
        if (f.loc === 'changed') return daDoi(r);
        if (f.loc.indexOf('g:') === 0) return cur === f.loc.substring(2);
        return true;
    }

    /* ---------- Sắp xếp + vẽ bảng ---------------------------------------- */
    function sapXep(sx) {
        var rows = S.rows.slice();
        var theoTen = function (a, b) { return String(a.TENVAITRO || '').localeCompare(String(b.TENVAITRO || ''), 'vi'); };
        if (sx === 'ten') return rows.sort(theoTen);
        var la = {}, ds = [];
        rows.forEach(function (r) { var c = curOf(r); if (c && !nhomCua(c) && !la[c]) { la[c] = 1; ds.push(c); } });
        ds.sort();
        S.laRank = {};
        ds.forEach(function (c, i) { S.laRank[c] = i; });
        return rows.sort(function (a, b) {
            var ra = blockRank(curOf(a)), rb = blockRank(curOf(b));
            if (ra !== rb) return ra - rb;
            var sa = curStt(a), sb = curStt(b);
            var na = sa === '' ? Infinity : parseInt(sa, 10), nb = sb === '' ? Infinity : parseInt(sb, 10);
            if (na !== nb) return na < nb ? -1 : 1;
            return theoTen(a, b);
        });
    }
    function dot(code) {
        return code ? '<i class="cmsnvt-dot" style="background:' + esc(colorOf(code)) + '"></i>' : '<i class="cmsnvt-dot cmsnvt-dot--none"></i>';
    }
    function nhan(r) {
        if (daDoi(r)) return ui.badge('Chưa lưu', 'warn');
        return (origOf(r) || origStt(r)) ? ui.badge('Đã chọn', 'ok') : ui.badge('Mặc định', 'mute');
    }
    function optionsNhom(sel) {
        var h = '<option value=""' + (sel === '' ? ' selected' : '') + '>— Theo mặc định hệ thống —</option>', biet = false;
        S.nhom.forEach(function (g) {
            if (g.code === sel) biet = true;
            h += '<option value="' + esc(g.code) + '"' + (g.code === sel ? ' selected' : '') + '>' + esc(g.label) + '</option>';
        });
        if (sel && !biet) h += '<option value="' + esc(sel) + '" selected>(mã lạ: ' + esc(sel) + ')</option>';   // giữ lại, không âm thầm mất khi lưu
        return h;
    }
    function tieuDeNhom(code, n) {
        var label = code ? labelOf(code) : 'Chưa chọn nhóm — trang chủ dùng nhóm mặc định';
        return '<tr class="cmsnvt-grp"><td colspan="7">' + dot(code) + ' <b>' + esc(label) + '</b><span class="cmsnvt-grp-n">(' + n + ')</span></td></tr>';
    }
    function ve(giuCuon) {
        var f = boLoc(), wrap = elBang.querySelector('.ums-tablewrap'), st = giuCuon && wrap ? wrap.scrollTop : 0;
        var rows = sapXep(f.sx).filter(function (r) { return khop(r, f); });
        var dem = {}, dau = {}, cuoi = {};
        rows.forEach(function (r) { var k = curOf(r); dem[k] = (dem[k] || 0) + 1; if (dau[k] === undefined) dau[k] = r.ID; cuoi[k] = r.ID; });
        var h = '<div class="ums-tablewrap"><table class="ums-table ums-table--lined"><thead><tr>' +
            '<th class="is-center" style="width:56px">Stt</th><th>Tên vai trò</th><th>Mã vai trò</th><th>Vai trò cha</th>' +
            '<th style="width:320px">Nhóm hiển thị ở trang chủ</th><th class="is-center" style="width:170px">Thứ tự trong nhóm</th>' +
            '<th class="is-center" style="width:120px">Trạng thái</th></tr></thead><tbody>';
        var n = 0, truoc = null;
        rows.forEach(function (r) {
            var key = curOf(r), id = esc(r.ID);
            if (f.sx === 'nhom' && key !== truoc) { h += tieuDeNhom(key, dem[key]); truoc = key; }
            n++;
            var cha = r.CHUNG_VAITRO_CHA_ID && S.byId[r.CHUNG_VAITRO_CHA_ID] ? S.byId[r.CHUNG_VAITRO_CHA_ID].TENVAITRO : '';
            var ord = '<div class="cmsnvt-ord">' +
                (f.sx === 'nhom' ? '<button type="button" class="cmsnvt-arrow" data-a="len" data-id="' + id + '" title="Đưa lên trên" aria-label="Đưa lên trên"' + (dau[key] === r.ID ? ' disabled' : '') + '><i class="fa-light fa-chevron-up"></i></button>' : '') +
                '<input type="text" class="ums-input ums-input--sm cmsnvt-stt" inputmode="numeric" maxlength="4" placeholder="—" data-id="' + id + '" value="' + esc(curStt(r)) + '" aria-label="Thứ tự trong nhóm">' +
                (f.sx === 'nhom' ? '<button type="button" class="cmsnvt-arrow" data-a="xuong" data-id="' + id + '" title="Đưa xuống dưới" aria-label="Đưa xuống dưới"' + (cuoi[key] === r.ID ? ' disabled' : '') + '><i class="fa-light fa-chevron-down"></i></button>' : '') +
                '</div>';
            h += '<tr data-id="' + id + '"' + (daDoi(r) ? ' class="cmsnvt-changed"' : '') + '>' +
                '<td class="is-center">' + n + '</td>' +
                '<td><b>' + esc(r.TENVAITRO) + '</b></td>' +
                '<td class="is-nowrap">' + esc(r.MAVAITRO) + '</td>' +
                '<td class="ums-u-muted">' + esc(cha) + '</td>' +
                '<td><div class="cmsnvt-nhom">' + dot(key) + '<select class="ums-select cmsnvt-sel" data-id="' + id + '" aria-label="Nhóm hiển thị ở trang chủ">' + optionsNhom(key) + '</select></div></td>' +
                '<td class="is-center">' + ord + '</td>' +
                '<td class="is-center" data-c="nhan">' + nhan(r) + '</td></tr>';
        });
        if (!n) h += '<tr><td colspan="7" style="padding:0">' + ui.empty('Không có vai trò phù hợp.') + '</td></tr>';
        h += '</tbody></table></div>';
        elBang.innerHTML = h;
        if (st) { wrap = elBang.querySelector('.ums-tablewrap'); if (wrap) wrap.scrollTop = st; }
        var tong = z('tong');
        if (tong) tong.textContent = S.rows.length ? '(hiển thị ' + n + ' / ' + S.rows.length + ' vai trò)' : '';
        veChan();
    }
    function veDong(r) {
        var tr = elBang.querySelector('tr[data-id="' + r.ID + '"]');
        if (!tr) return;
        tr.classList.toggle('cmsnvt-changed', daDoi(r));
        tr.querySelector('[data-c="nhan"]').innerHTML = nhan(r);
        var d = tr.querySelector('.cmsnvt-nhom .cmsnvt-dot'), c = curOf(r);
        if (d) { d.className = 'cmsnvt-dot' + (c ? '' : ' cmsnvt-dot--none'); d.style.background = c ? colorOf(c) : ''; }
        veChan();
    }
    function veChan() {
        var n = soDoi(), el = z('soDoi');
        if (el) el.innerHTML = n > 0 ? '<b style="color:#c2410c">' + n + '</b> thay đổi chưa lưu' : 'Chưa có thay đổi';
    }

    /* ---------- Nạp dữ liệu ------------------------------------------------- */
    function napNhom() {
        return ums.api.dm(DM_MA).then(function (rows) {
            if (rows && rows.length) S.nhom = gopNhom(rows);
            else S.nhom = NHOM_MAC_DINH.slice();        // danh mục trống: tầng chung tự báo khung "Cần làm trước"
        }, function () { S.nhom = NHOM_MAC_DINH.slice(); });
    }
    function napVaiTro() {
        return ums.api.call({
            action: 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikXICgVMy4P',
            func: 'pkg_chung_quanlynguoidung.LayDanhSachVaiTro',
            versionAPI: 'v1.0', strLoaiVaiTro_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000, dTrangThai: 1, strChung_VaiTro_Cha_Id: ''
        }).then(function (r) {
            var dt = Array.isArray(r.data) ? r.data : ((r.data && r.data.rs) || []);
            S.rows = dt.slice();
            S.byId = {};
            S.rows.forEach(function (x) { S.byId[x.ID] = x; });
            var pager = parseInt(r.pager, 10);
            if (pager > dt.length) banner('warn', 'Chỉ nạp được ' + dt.length + '/' + pager + ' vai trò đầu tiên. Dùng ô tìm kiếm của trang Vai trò cho các vai trò còn lại.');
            ve();
        }, function (e) { ums.api.handle(e, 'Nạp danh sách vai trò'); });
    }

    /* ---------- Thao tác trên dòng ---------------------------------------- */
    function doiStt(id, val, inp) {
        var r = S.byId[id];
        if (!r) return;
        var v = String(val || '').replace(/\D/g, '').replace(/^0+/, '').slice(0, 4);
        if (inp) inp.value = v;
        datStt(r, v);
        veDong(r);
    }
    /* ▲▼: đổi chỗ với vai trò kế bên (cùng khối, đang hiển thị) rồi ĐÁNH SỐ LẠI cả khối 1..k theo thứ tự mới */
    function chuyen(id, dir) {
        var r = S.byId[id];
        if (!r) return;
        var key = curOf(r), f = boLoc();
        var khoi = sapXep('nhom').filter(function (x) { return curOf(x) === key; });
        var pos = -1;
        khoi.forEach(function (x, i) { if (x.ID === id) pos = i; });
        if (pos < 0) return;
        var j = pos + dir;
        while (j >= 0 && j < khoi.length && !khop(khoi[j], f)) j += dir;   // bỏ qua dòng đang bị bộ lọc ẩn
        if (j < 0 || j >= khoi.length) return;
        var t = khoi[pos]; khoi[pos] = khoi[j]; khoi[j] = t;
        khoi.forEach(function (x, i) { datStt(x, String(i + 1)); });
        ve(true);
    }

    /* ---------- Lưu: mỗi vai trò đổi = 1 lần SuaVaiTro qua form tiến trình chung ---------- */
    function yeuCauSua(it) {
        var r = it.row;
        return {
            action: 'CMS_QuanLyNguoiDung/SuaVaiTro',
            data: {
                versionAPI: 'v1.0',
                strMaVaiTro: r.MAVAITRO,
                strTenVaiTro: r.TENVAITRO,
                strMoTa: withTags(r.MOTA, it.MOI, it.SMOI),
                dThuTu: (r.THUTU === undefined || r.THUTU === null || r.THUTU === '') ? null : r.THUTU,
                dTrangThai: 1,
                strLoaiVaiTro_Id: r.LOAIVAITRO_ID || '',
                strChung_VaiTro_Cha_Id: r.CHUNG_VAITRO_CHA_ID || '',
                strNguoiThucHien_Id: '',
                strId: r.ID
            }
        };
    }
    function luu() {
        var items = [];
        S.rows.forEach(function (r) {
            if (daDoi(r)) items.push({ ID: r.ID, TEN: r.TENVAITRO, MA: r.MAVAITRO, CU: origOf(r), MOI: curOf(r), SCU: origStt(r), SMOI: curStt(r), row: r });
        });
        if (!items.length) { ui.toast('Chưa có thay đổi nào để lưu.', 'info'); return; }
        banner('', '');
        S.daLuu = {};
        ums.process.run({
            title: 'Lưu nhóm và thứ tự vai trò',
            unit: 'vai trò',
            fileName: 'KetQuaLuuNhomVaiTro',
            items: items,
            columns: [
                { header: 'Tên vai trò', render: function (it) { return it.TEN; } },
                { header: 'Mã vai trò', render: function (it) { return it.MA; } },
                { header: 'Nhóm (cũ → mới)', render: function (it) { return it.CU === it.MOI ? labelOf(it.MOI) + ' (giữ nguyên)' : labelOf(it.CU) + ' → ' + labelOf(it.MOI); } },
                { header: 'Thứ tự (cũ → mới)', render: function (it) { return (it.SCU || '—') + ' → ' + (it.SMOI || '—'); } }
            ],
            notes: ['Mỗi vai trò đổi nhóm hoặc thứ tự được lưu bằng 1 lần cập nhật. Nhóm và thứ tự mới hiện ở trang chủ sau khi người dùng tải lại trang.'],
            okMessage: 'Đã lưu',
            run: function (it) {
                var p = yeuCauSua(it), call = { silent: true, action: p.action };
                Object.keys(p.data).forEach(function (k) { call[k] = p.data[k]; });
                return ums.api.call(call).then(function (r) {
                    S.daLuu[it.ID] = { nhom: it.MOI, stt: it.SMOI };
                    return { ok: true, message: (r && r.message) || '' };
                });
            },
            refresh: sauLuu
        });
    }
    /* Sau khi lưu: nạp lại rồi ĐỐI CHIẾU thẻ — phòng khi máy chủ báo thành công mà không ghi MOTA */
    function sauLuu() {
        var saved = S.daLuu;
        Object.keys(saved).forEach(function (id) { delete S.doi[id]; delete S.stt[id]; });
        napVaiTro().then(function () {
            var hong = [], tong = Object.keys(saved).length;
            Object.keys(saved).forEach(function (id) {
                var r = S.byId[id];
                if (!r || tagOf(r.MOTA) !== saved[id].nhom || sttOf(r.MOTA) !== saved[id].stt) hong.push(r ? r.TENVAITRO : id);
            });
            if (hong.length) {
                banner('warn', 'Máy chủ báo lưu thành công nhưng <b>' + hong.length + '/' + tong + '</b> vai trò chưa đổi nhóm / thứ tự (cột Mô tả không được cập nhật): ' +
                    hong.map(esc).join(', ') + '. Cần báo bộ phận kỹ thuật kiểm tra hàm SuaVaiTro.');
            } else if (soDoi() > 0) {
                banner('warn', 'Đã lưu cho <b>' + tong + '</b> vai trò. Còn <b>' + soDoi() + '</b> vai trò chưa lưu được (dòng màu vàng, trạng thái "Chưa lưu") — xem lý do ở form kết quả, sửa rồi bấm Lưu lại.');
            } else {
                banner('ok', 'Đã lưu nhóm và thứ tự cho <b>' + tong + '</b> vai trò. Người dùng tải lại trang chủ (Ctrl+F5) sẽ thấy thay đổi.');
            }
        });
    }

    /* ---------- Sự kiện ------------------------------------------------------ */
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'len' || a === 'xuong') { if (!b.disabled) chuyen(b.getAttribute('data-id'), a === 'len' ? -1 : 1); }
        else if (a === 'luu') luu();
        else if (a === 'hoantac') { S.doi = {}; S.stt = {}; ve(); }
        else if (a === 'tailai') {
            var n = soDoi();
            (n > 0 ? ui.confirm('Có ' + n + ' thay đổi chưa lưu sẽ bị bỏ. Tải lại danh sách?', { ok: 'Tải lại' }) : Promise.resolve(true))
                .then(function (ok) { if (!ok) return; S.doi = {}; S.stt = {}; banner('', ''); napNhom().then(function () { dungLoc(); return napVaiTro(); }); });
        }
    });
    root.addEventListener('change', function (ev) {
        var t = ev.target;
        if (t.classList.contains('cmsnvt-sel')) { var r = S.byId[t.getAttribute('data-id')]; if (r) { datNhom(r, t.value); veDong(r); } }
        else if (t.classList.contains('cmsnvt-stt')) doiStt(t.getAttribute('data-id'), t.value, t);
        else if (t === elSx || t === elLocNhom) ve();
    });
    root.addEventListener('input', function (ev) {
        if (ev.target === elTim) { clearTimeout(S.timer); S.timer = setTimeout(function () { ve(); }, 150); }
    });
    /* Ô thứ tự: rời ô chỉ ghi nhận; Enter mới sắp xếp lại bảng (gõ xong Tab xuống dòng dưới nhập tiếp được) */
    root.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' && ev.target.classList && ev.target.classList.contains('cmsnvt-stt')) {
            ev.preventDefault();
            doiStt(ev.target.getAttribute('data-id'), ev.target.value, ev.target);
            ve(true);
        }
    });

    napNhom().then(function () { dungLoc(); return napVaiTro(); });
})();
