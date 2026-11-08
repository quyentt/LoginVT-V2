/* =========================================================================
   ums.nhomVaiTro — nhóm vai trò trên trang chủ (một bảng dùng chung cho trang chủ và màn CMS)
   =========================================================================
   Gốc: index.aspx initRolePicker (kho gốc 8/11, 9 nhóm theo Điều 2 "Biên bản thỏa thuận hợp tác
   EAUT-APIS" 13/03/2026) + ApisCMS/Modules/vaitro/script/nhomvaitro.js. Hai nơi đó mỗi nơi chép một
   bản GROUPS / tagOf / sttOf / merge; ở _v2 gom về đây để trang chủ (app.js) và màn "Cấu hình nhóm
   vai trò" (ApisCMS vaitro/nhomvaitro) cùng đọc một bảng.

   Thứ tự ưu tiên khi xếp MỘT vai trò vào nhóm (cao → thấp):
     1) Thẻ [nhom:mã] trong MOTA của vai trò — admin chọn ở màn CMS "Cấu hình nhóm vai trò", lưu ở DB.
     2) site.config `roleGroupMap`: "Tên vai trò" → mã nhóm (không phân biệt hoa thường / dấu / khoảng trắng).
     3) site.config `roleRules`: từ khoá trong tên (dự phòng cho vai trò mới) — luật đầu tiên khớp thắng.
        Biểu tượng LUÔN lấy từ roleRules nếu có luật khớp tên, không phụ thuộc nhóm.
     4) Còn lại → "khac".
   Thứ tự vai trò TRONG nhóm: thẻ [stt:N] trong MOTA (số nhỏ trước, đứng TRƯỚC vai trò chưa có số; chưa có
   số giữ thứ tự máy chủ trả).

   Danh sách nhóm = site.config `roleGroups` (có sẵn, luôn là dự phòng) GỘP với danh mục dữ liệu
   "nhomvaitro" (CMS > Danh mục > Danh mục dữ liệu): mã có sẵn → lấy TÊN danh mục; mã mới → thêm nhóm
   (xếp trước "Khác", màu lần lượt MAU_MOI, tự đăng ký lớp .ums-tile--<mã>); thứ tự nhóm = cột HESO1 > 0
   hoặc thẻ [stt:N] ở MOTA dòng danh mục (dòng có số đứng trước, bằng nhau / không số giữ thứ tự có sẵn).
   Không bao giờ xoá nhóm có sẵn. Mã chỉ a-z 0-9 _ (nằm trong thẻ).

   Dùng:
       ums.nhomVaiTro.san().then(list => …)        // nạp danh mục MỘT lần (tối đa 3 s, lỗi → có sẵn) rồi trả danh sách nhóm
       ums.nhomVaiTro.danhSach()                   // danh sách đang có (đồng bộ)  [{ key, name, tone, color }]
       ums.nhomVaiTro.phanLoai(roleRow)            // { group, icon, matched, stt }  (dòng API: TENVAITRO, MOTA…)
       ums.nhomVaiTro.tagOf(moTa) / sttOf(moTa) / withTags(moTa, code, stt)
       ums.nhomVaiTro.soSanh(a, b)                 // sắp vai trò trong nhóm theo { stt, idx }
       ums.nhomVaiTro.tenNgan(label)               // "Quản lý khảo thí" → "Khảo thí" (chip lọc)
   ========================================================================= */
(function (global) {
    'use strict';

    var ums = global.ums || (global.ums = {});
    var N = ums.nhomVaiTro || (ums.nhomVaiTro = {});

    N.DM_MA = 'nhomvaitro';
    /* Màu cho nhóm MỚI thêm ở danh mục — khác 8 màu nhóm có sẵn (giữ khớp NEW_GROUP_COLORS của index.aspx gốc) */
    N.MAU_MOI = ['#0f766e', '#4338ca', '#b91c1c', '#a16207', '#92400e', '#0369a1', '#9a3412', '#115e59'];

    function cfg() { return ums.cfg || {}; }
    function noAccent(s) {
        return (s === null || s === undefined ? '' : String(s)).toLowerCase()
            .normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
    }
    function tenChuan(s) { return noAccent(s).replace(/\s+/g, ' ').trim(); }
    function hexToRgba(hex, a) {
        var n = parseInt(String(hex).replace('#', ''), 16);
        return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
    }

    /* ---------- Thẻ trong MOTA ---------------------------------------------- */
    N.tagOf = function (moTa) { var m = /\[nhom:([a-z0-9_]+)\]/i.exec(moTa || ''); return m ? m[1].toLowerCase() : ''; };
    N.sttOf = function (moTa) { var m = /\[stt:(\d+)\]/i.exec(moTa || ''); var n = m ? parseInt(m[1], 10) : 0; return n > 0 ? String(n) : ''; };
    /* MOTA mới = mô tả cũ (bỏ thẻ cũ) + thẻ mới; code / stt rỗng = không ghi thẻ đó */
    N.withTags = function (moTa, code, stt) {
        var out = String(moTa === null || moTa === undefined ? '' : moTa)
            .replace(/\s*\[nhom:[a-z0-9_]+\]/ig, '').replace(/\s*\[stt:\d+\]/ig, '').trim();
        if (code) out += (out ? ' ' : '') + '[nhom:' + code + ']';
        if (stt) out += (out ? ' ' : '') + '[stt:' + stt + ']';
        return out;
    };
    /* Số thứ tự của một dòng NHÓM trong danh mục: HESO1 (> 0) trước, không có thì [stt:N] ở MOTA; không có = null */
    N.thuTuDm = function (r) {
        var h = parseFloat(r && r.HESO1);
        if (isFinite(h) && h > 0) return h;
        var m = /\[stt:(\d+)\]/i.exec((r && r.MOTA) || '');
        return m ? parseInt(m[1], 10) : null;
    };

    /* ---------- Danh sách nhóm ---------------------------------------------- */
    function coSan() {
        var tone = cfg().tone || {};
        return (cfg().roleGroups || []).map(function (g) {
            return { key: g.key, name: g.name, tone: g.tone || 'slate', color: g.color || (tone[g.tone] || {}).fg || '#64748b' };
        });
    }
    var hienTai = null;      // danh sách đã gộp (null = chưa gộp, dùng coSan())
    var dangNap = null;      // Promise của lần nạp danh mục

    /* Đăng ký màu cho nhóm MỚI: lớp .ums-tile--<mã> (thẻ vai trò) — nhóm có sẵn đã có lớp theo tone trong tile.css */
    function dangKyMau(key, color) {
        if (typeof document === 'undefined') return;
        var st = document.getElementById('ums-nhom-vaitro-mau');
        if (!st) { st = document.createElement('style'); st.id = 'ums-nhom-vaitro-mau'; document.head.appendChild(st); }
        var rule = '.ums-tile--' + key + '{--ums-tile-fg:' + color + ';--ums-tile-bg:' + hexToRgba(color, 0.16) + '}';
        if (st.textContent.indexOf('.ums-tile--' + key + '{') < 0) st.textContent += rule;
    }

    N.gop = function (rows) {
        var base = coSan(), seen = {}, moi = [], doiTen = {}, thuTu = {};
        (rows || []).forEach(function (r) {
            var code = String((r && r.MA) || '').trim().toLowerCase(), label = String((r && r.TEN) || '').trim();
            if (!code || !label || seen[code]) return;
            if (!/^[a-z0-9_]+$/.test(code)) {
                if (global.console) console.warn('[nhomVaiTro] Bỏ qua mã nhóm không hợp lệ trong danh mục "' + N.DM_MA + '": "' + r.MA + '" (chỉ a-z, 0-9, _).');
                return;
            }
            seen[code] = true;
            var o = N.thuTuDm(r);
            if (o !== null) thuTu[code] = o;
            if (base.some(function (g) { return g.key === code; })) doiTen[code] = label; else moi.push({ key: code, name: label });
        });
        var out = [], khac = null;
        base.forEach(function (g) {
            var it = { key: g.key, name: doiTen[g.key] || g.name, tone: g.tone, color: g.color };
            if (g.key === 'khac') khac = it; else out.push(it);
        });
        moi.forEach(function (g, i) {
            var c = N.MAU_MOI[i % N.MAU_MOI.length];
            dangKyMau(g.key, c);
            out.push({ key: g.key, name: g.name, tone: g.key, color: c });
        });
        if (khac) out.push(khac);
        var pos = {};
        out.forEach(function (g, i) { pos[g.key] = i; });
        out.sort(function (a, b) {
            var ha = thuTu.hasOwnProperty(a.key), hb = thuTu.hasOwnProperty(b.key);
            if (ha && hb) return (thuTu[a.key] - thuTu[b.key]) || (pos[a.key] - pos[b.key]);
            if (ha) return -1;
            if (hb) return 1;
            return pos[a.key] - pos[b.key];
        });
        hienTai = out;
        return out;
    };
    N.danhSach = function () { return hienTai || coSan(); };
    N.nhom = function (key) { var ds = N.danhSach(); for (var i = 0; i < ds.length; i++) if (ds[i].key === key) return ds[i]; return null; };

    /* Nạp danh mục MỘT lần cho cả phiên; quá 3 s / lỗi / trống → danh sách có sẵn (trang chủ không bao giờ treo),
       danh mục đến muộn vẫn gộp vào cho lần vẽ sau. Luôn resolve. */
    N.san = function () {
        if (dangNap) return dangNap;
        if (!ums.api || typeof ums.api.dm !== 'function') { dangNap = Promise.resolve(N.danhSach()); return dangNap; }
        var goi = ums.api.dm(N.DM_MA).then(function (rows) {
            if (rows && rows.length) return N.gop(rows);
            if (global.console) console.warn('[nhomVaiTro] Danh mục "' + N.DM_MA + '" trống → dùng danh sách nhóm có sẵn.');
            return N.danhSach();
        }, function () {
            if (global.console) console.warn('[nhomVaiTro] Không đọc được danh mục "' + N.DM_MA + '" → dùng danh sách nhóm có sẵn.');
            return N.danhSach();
        });
        var cho = new Promise(function (res) { setTimeout(function () { res(N.danhSach()); }, 3000); });
        dangNap = Promise.race([goi, cho]);
        return dangNap;
    };

    /* ---------- Xếp một vai trò vào nhóm ------------------------------------ */
    var mapChuan = null, mapNguon = null;
    function roleGroupMap() {
        var m = cfg().roleGroupMap || {};
        if (mapChuan && mapNguon === m) return mapChuan;
        mapChuan = {}; mapNguon = m;
        Object.keys(m).forEach(function (k) { mapChuan[tenChuan(k)] = String(m[k] || '').toLowerCase(); });
        return mapChuan;
    }
    function icon(ic) { return ic ? (/^fa-(light|regular|solid|thin|duotone) /.test(ic) ? ic : 'fa-light ' + ic) : 'fa-light fa-cube'; }

    N.phanLoai = function (role) {
        var raw = (role && (role.TENVAITRO || role.TENUNGDUNG || role.TEN || role.name)) || '';
        var hay = noAccent(raw), rules = cfg().roleRules || [], rule = null, i;
        for (i = 0; i < rules.length; i++) if (hay.indexOf(rules[i].kw) >= 0) { rule = rules[i]; break; }
        var theTag = N.tagOf(role && role.MOTA);
        if (theTag && !N.nhom(theTag)) {
            if (global.console) console.warn('[nhomVaiTro] Thẻ [nhom:' + theTag + '] ở MOTA của "' + raw + '" không phải mã nhóm hợp lệ → bỏ qua.');
            theTag = '';
        }
        var theoTen = roleGroupMap()[tenChuan(raw)];
        var group = theTag || theoTen || (rule && rule.group) || 'khac';
        if (!N.nhom(group)) {
            if (global.console) console.warn('[nhomVaiTro] Mã nhóm không tồn tại "' + group + '" (vai trò: ' + raw + ') → về "khac".');
            group = 'khac';
        }
        return { group: group, icon: icon(rule && rule.icon), matched: !!(theTag || theoTen || rule), stt: N.sttOf(role && role.MOTA) };
    };

    /* Thứ tự trong nhóm: có stt thì theo số tăng dần và đứng TRƯỚC; chưa có thì giữ thứ tự gốc (idx) */
    N.soSanh = function (a, b) {
        var sa = a.stt === '' || a.stt === null || a.stt === undefined ? null : Number(a.stt);
        var sb = b.stt === '' || b.stt === null || b.stt === undefined ? null : Number(b.stt);
        if (sa !== null && sb !== null) return (sa - sb) || ((a.idx || 0) - (b.idx || 0));
        if (sa !== null) return -1;
        if (sb !== null) return 1;
        return (a.idx || 0) - (b.idx || 0);
    };

    /* Chip lọc dùng tên NGẮN để gọn một hàng: bỏ tiền tố "Quản lý " */
    N.tenNgan = function (label) {
        var s = String(label || '').replace(/^\s*quản lý\s+/i, '').trim();
        return s ? s.charAt(0).toUpperCase() + s.slice(1) : String(label || '');
    };
})(window);
