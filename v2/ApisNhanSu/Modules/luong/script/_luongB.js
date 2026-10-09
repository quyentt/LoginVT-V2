/* =========================================================================
   Tầng chung của nhóm màn LƯƠNG (luongB) — phân hệ Nhân sự
   ---------------------------------------------------------------------------
   Dùng ở: phucap, quatrinhluong (cột trái "Danh sách cán bộ"),
           luongduocnhankhac, truylinh, thamnien, luongvathunhapkhac,
           thuchienxetnangluong (ô Đơn vị → Thành viên, lưới nhân sự kèm theo).
   Tên riêng hậu tố B vì module `luong` có hai nhóm chuyển song song.

   ums.luongB.donViThanhVien(dv, tv, o)
       Ô "Chọn đơn vị" (edu.system.getList_CoCauToChuc — toàn bộ cơ cấu) và ô
       "Chọn thành viên" (NS_HoSoV2/LayDanhSach GET, nhãn HOTEN - MASO) của các
       màn khoản lương. o.la = dLaCanBoNgoaiTruong gốc (-1 / 0); o.khoa = false
       thì KHÔNG khoá Thành viên khi chưa chọn Đơn vị (ô mang nhãn "Tất cả …").
       Chọn / xoá Đơn vị → nạp lại Thành viên (như gốc getList_HS).
   ums.luongB.canBo(el, o) → { m, host, dang }
       Hai cột: cột trái "Danh sách cán bộ" (getList_NhanSu — pkg_nhansu_hoso_v2.
       LayDSNhanSu_HoSo_v2, dLaCanBoNgoaiTruong 0, phân trang máy chủ) có ô từ
       khoá + Khoa/Viện/Phòng ban → Bộ môn; bấm một cán bộ → o.onPick(row, host).
       Cột phải: dòng "Họ tên - Mã cán bộ" + vùng nội dung `host`.
   ums.luongB.nguoiLuoi(host, o) → { them(rows), ds(), xoaHet(), dem() }
       Bảng "Danh sách nhân sự kèm theo" (genHTML_NhanSu gốc): ảnh, họ tên - mã,
       các ô nhập theo từng người (o.cot), nút xoá dòng; trùng người thì báo.
   ums.luongB.cheDo(crud, row, { chiThem: [khoá], chiSua: [khoá] })
       Ẩn / hiện ô biểu mẫu theo lúc Thêm hay Sửa (biểu mẫu thêm và sửa của gốc
       là hai vùng khác nhau).
   ums.luongB.tien(root) — ô có data-lgb-tien tự thêm dấu phẩy ngăn nghìn khi gõ.
   ums.luongB.drop(text, icon, items) / batDrop / dongDrop — nút thả xuống
       "Import ▾" viết cứng trong html gốc (bản sao thứ ba của H.drop — Nợ tầng chung).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat;
    function e(v) { return v === undefined || v === null ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function rows(r) { var d = r && r.data; return Array.isArray(d) ? d : (d && d.rs) || []; }
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function qa(el, s) { return Array.prototype.slice.call(el.querySelectorAll(s)); }

    var L = ums.luongB = { e: e, esc: esc, rows: rows, uid: uid, qa: qa };

    L.num = function (v) { return pat.num(v); };
    L.hoTen = function (r) { return (e(r.NHANSU_HOSOCANBO_HODEM) + ' ' + e(r.NHANSU_HOSOCANBO_TEN)).trim(); };

    /* Ảnh đại diện tròn (.table-img gốc) — ảnh lỗi thì gỡ, còn biểu tượng người */
    L.anh = function (path) { return pat.anhNguoi(path); };

    /* ---------------------------------------------------------------------
       Đơn vị → Thành viên
       --------------------------------------------------------------------- */
    L.napDonVi = function (dv) {
        return ums.ref.coCauToChuc({ strCCTC_Loai_Id: '', strCCTC_Cha_Id: '', iTrangThai: 1 }).then(function (r) {
            pat.fill(dv, r, { name: 'TEN' });
            return r;
        }).catch(function (err) { ums.api.handle(err, 'danh sách đơn vị'); return []; });
    };

    L.napThanhVien = function (tv, dvId, la) {
        return ums.api.call({
            action: 'NS_HoSoV2/LayDanhSach', method: 'GET',
            strTuKhoa: '', pageIndex: 1, pageSize: 100000,
            strDaoTao_CoCauToChuc_Id: dvId || '',
            strNguoiThucHien_Id: '',
            dLaCanBoNgoaiTruong: la,
            silent: true
        }).then(function (r) {
            var ds = rows(r);
            pat.fill(tv, ds, { name: function (x) { return e(x.HOTEN) + ' - ' + e(x.MASO); } });
            return ds;
        }).catch(function (err) { ums.api.handle(err, 'danh sách thành viên'); return []; });
    };

    L.donViThanhVien = function (dv, tv, o) {
        o = o || {};
        var la = o.la === undefined ? -1 : o.la;
        L.napDonVi(dv);
        function nap() {
            if (o.khoa !== false && !dv.value) { pat.fill(tv, []); return; }
            L.napThanhVien(tv, dv.value, la);
        }
        if (o.napDau) nap();
        if (window.jQuery) {
            jQuery(dv).on('select2:select', function () { nap(); if (o.onDoi) o.onDoi(); });
            if (o.khoa !== false) pat.chain([dv, tv]);
            else jQuery(dv).on('select2:clear', function () { nap(); if (o.onDoi) o.onDoi(); });
        }
        return { nap: nap };
    };

    /* ---------------------------------------------------------------------
       Cột trái "Danh sách cán bộ" + cột phải theo cán bộ đang chọn
       --------------------------------------------------------------------- */
    L.canBo = function (el, o) {
        /* Từ 2026-09-26: lớp bọc của khung chung ums.pat.dsNhanSu (patterns.js). Vùng nội dung
           bên phải (host) GIỮ NGUYÊN giữa các lần chọn cán bộ — quatrinhluong dùng lại một ums.crud. */
        o = o || {};
        var m = pat.master({
            el: el, title: o.title, actions: o.actions || '',
            side: { title: 'Danh sách cán bộ', icon: 'fa-users', search: 'Nhập từ khóa tìm kiếm',
                    filter: pat.dsNhanSuLoc() },
            main: { title: false }
        });
        m.el.classList.add('ums-dsns');
        m.mainBody.innerHTML =
            '<div class="ums-panel ums-dsns__dau"><div class="ums-panel__head"><div class="ums-panel__title" data-lgb="ten">' +
            '<span class="ums-u-muted">Chọn một cán bộ ở danh sách bên trái.</span></div></div></div>' +
            '<div data-lgb="host"></div>';
        var ten = m.mainBody.querySelector('[data-lgb="ten"]');
        var host = m.mainBody.querySelector('[data-lgb="host"]');
        var ds = pat.dsNhanSu(m, {
            onPick: function (r) {
                ten.innerHTML = '<i class="fa-light fa-id-card"></i> ' + esc(e(r.HOTEN) || (e(r.HODEM) + ' ' + e(r.TEN))) +
                    ' <span class="ums-u-faint ums-u-fz13">– Mã cán bộ: ' + esc(r.MASO) + '</span>';
                if (o.onPick) o.onPick(r, host);
            }
        });
        return { m: m, host: host, tai: ds.load };
    };

    /* ---------------------------------------------------------------------
       Bảng "Danh sách nhân sự kèm theo" (genHTML_NhanSu / removeHTML_NhanSu)
       o = { title, chon: 'Chọn giảng viên', cot: [{ key, title, kieu: 'tien'|'ngay'|'chu', macDinh() }],
             tong: 'key' (dòng "Tổng tiền"), timTitle }
       --------------------------------------------------------------------- */
    L.nguoiLuoi = function (host, o) {
        o = o || {};
        var ds = [];            // [{ ns, v: { key: giá trị } }]
        host.innerHTML = pat.panel({
            title: o.title || 'Danh sách nhân sự kèm theo', icon: 'fa-users', flush: true, zone: 'lgbng',
            count: 'lgbngdem',
            foot: o.ghiChu ? '<i class="ums-u-faint ums-u-fz13">' + esc(o.ghiChu) + '</i>' : '',
            tools:(o.tong ? '<span class="ums-badge ums-badge--bad" data-lgb="tong">Tổng tiền: 0</span>' : '') +
                ui.btn('add', { text: o.chon || 'Chọn nhân sự', mod: 'out-success', attr: { 'data-lgb': 'chon' } })
        });
        var zone = host.querySelector('[data-z="lgbng"]');

        function doc() {
            qa(zone, '[data-lgbv]').forEach(function (inp) {
                var p = inp.getAttribute('data-lgbv').split('|');
                var x = ds[Number(p[0])];
                if (x) x.v[p[1]] = inp.value;
            });
        }
        function tong() {
            if (!o.tong) return;
            var t = 0;
            qa(zone, '[data-lgbv$="|' + o.tong + '"]').forEach(function (inp) { t += Number(pat.num(inp.value)) || 0; });
            var el = host.querySelector('[data-lgb="tong"]');
            if (el) el.textContent = 'Tổng tiền: ' + pat.money(t);
        }
        function ve() {
            var cols = [
                { title: 'Hình ảnh', cls: 'is-center', width: '80px', render: function (x) { return L.anh(x.ns.ANH); } },
                { title: 'Họ tên', render: function (x) {
                    var cd = (e(x.ns.LOAICHUCDANH_MA) ? x.ns.LOAICHUCDANH_MA + '.' : '') + (e(x.ns.LOAIHOCVI_MA) ? x.ns.LOAIHOCVI_MA + '.' : '');
                    return esc((cd ? cd + ' ' : '') + e(x.ns.HOTEN || (e(x.ns.HODEM) + ' ' + e(x.ns.TEN)))) + ' - ' + esc(x.ns.MASO);
                } }
            ].concat((o.cot || []).map(function (c) {
                return {
                    title: c.title, width: c.width,
                    render: function (x, i) {
                        return '<input class="ums-input' + (c.kieu === 'tien' ? ' is-right' : '') + '" data-lgbv="' + i + '|' + esc(c.key) + '"' +
                            (c.kieu === 'tien' ? ' data-lgb-tien inputmode="decimal"' : '') +
                            (c.kieu === 'ngay' ? ' data-lgb-ngay placeholder="dd/mm/yyyy"' : '') +
                            ' value="' + esc(e(x.v[c.key])) + '" autocomplete="off">';
                    }
                };
            })).concat([{ title: 'Xóa', cls: 'is-center is-actions', width: '60px', render: function (x, i) {
                return '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-lgbxoa="' + i + '" title="Xoá"><i class="fa-light fa-trash-can"></i></button>';
            } }]);
            ui.table({ el: zone, rows: ds, columns: cols, empty: 'Không tìm thấy dữ liệu!' });
            qa(zone, '[data-lgb-ngay]').forEach(function (inp) { ui.datepicker(inp); });
            var dem = host.querySelector('[data-z="lgbngdem"]');
            if (dem) dem.textContent = ds.length ? '(' + ds.length + ')' : '';
            tong();
        }

        var api = {
            them: function (list) {
                doc();
                var trung = 0;
                (list || []).forEach(function (ns) {
                    if (ds.some(function (x) { return x.ns.ID === ns.ID; })) { trung++; return; }
                    var v = {};
                    (o.cot || []).forEach(function (c) { v[c.key] = c.macDinh ? c.macDinh() : ''; });
                    ds.push({ ns: ns, v: v });
                });
                if (trung) ui.toast(trung + ' nhân sự đã tồn tại trong danh sách', 'warn');
                ve();
            },
            ds: function () { doc(); return ds.slice(); },
            xoaHet: function () { ds = []; ve(); },
            dem: function () { return ds.length; }
        };

        host.addEventListener('click', function (ev) {
            var b;
            if ((b = ev.target.closest('[data-lgb="chon"]'))) {
                pat.pickNhanSu({ title: 'Tìm kiếm nhân sự', onPick: function (r) { api.them(r); } });
                return;
            }
            if ((b = ev.target.closest('[data-lgbxoa]'))) {
                doc();
                ds.splice(Number(b.getAttribute('data-lgbxoa')), 1);
                ve();
            }
        });
        host.addEventListener('input', function (ev) { if (ev.target.hasAttribute('data-lgb-tien')) tong(); });
        L.tien(host);
        ve();
        return api;
    };

    /* Ô tiền: gõ tới đâu thêm dấu phẩy tới đó (keyup + formatCurrency của gốc) */
    L.tien = function (root) {
        root.addEventListener('input', function (ev) {
            var el = ev.target;
            if (!el.hasAttribute || !el.hasAttribute('data-lgb-tien')) return;
            var s = pat.num(el.value);
            if (s === '' || isNaN(Number(s))) return;
            var v = pat.money(s);
            if (v !== el.value) el.value = v;
        });
    };

    /* Ô biểu mẫu chỉ hiện khi thêm / khi sửa */
    L.cheDo = function (crud, row, o) {
        function an(k, hide) {
            qa(crud.root, '[data-cf="' + crud.uid + '"][data-scope="form"][data-k="' + k + '"]').forEach(function (el) {
                var box = el;
                var grid = el.closest('.ums-grid');
                while (box.parentNode && box.parentNode !== grid) box = box.parentNode;
                box.hidden = hide;
            });
        }
        (o.chiThem || []).forEach(function (k) { an(k, !!row); });
        (o.chiSua || []).forEach(function (k) { an(k, !row); });
    };

    /* Ô lọc / ô biểu mẫu của một ums.crud theo khoá */
    L.oLoc = function (crud, k) { return crud.root.querySelector('[data-cf="' + crud.uid + '"][data-scope="filter"][data-k="' + k + '"]'); };
    L.oForm = function (crud, k) { return crud.root.querySelector('[data-cf="' + crud.uid + '"][data-scope="form"][data-k="' + k + '"]'); };
    /* Ô lọc ngày (crud chỉ có ô chữ / ô chọn) → gắn lịch */
    L.ngayLoc = function (crud, keys) {
        keys.forEach(function (k) { var el = L.oLoc(crud, k); if (el) ui.datepicker(el); });
    };
    /* Ô tiền trong biểu mẫu crud */
    L.tienForm = function (crud, keys) {
        keys.forEach(function (k) { var el = L.oForm(crud, k); if (el) { el.setAttribute('data-lgb-tien', ''); el.classList.add('is-right'); } });
        if (!crud._lgbTien) { crud._lgbTien = true; L.tien(crud.root); }
    };

    /* Biểu mẫu THÊM có bảng "Danh sách nhân sự kèm theo" (vùng zoneEdit gốc),
       biểu mẫu SỬA một dòng (zoneEdit_NhanSu_… gốc) — cùng một ums.crud.
       o = { hai: true (thông tin chung 4 | nhân sự 8) | 6 (6 | 6), anForm: true (THÊM
             không có ô chung), chiThem, chiSua, + tuỳ chọn của nguoiLuoi }
       → trả bảng nhân sự (null khi sửa) */
    L.formNhanSu = function (crud, row, o) {
        L.cheDo(crud, row, o);
        var body = crud.z('form').querySelector('.ums-panel__body');
        var grid = body.querySelector('.ums-grid');
        var cu = body.querySelector('[data-lgbds]');
        if (cu) cu.parentNode.removeChild(cu);                 // dựng lại để khỏi gắn trùng sự kiện
        body.classList.toggle('lgb-hai', !row && !!o.hai);
        body.classList.toggle('lgb-hai--6', !row && o.hai === 6);     // col-sm-6 | col-sm-6
        grid.hidden = !row && !!o.anForm;
        if (row) return null;
        var host = document.createElement('div');
        host.setAttribute('data-lgbds', '');
        body.appendChild(host);
        return L.nguoiLuoi(host, o);
    };

    /* Nút thả xuống tự dựng (Import ▾ viết cứng trong html gốc) — cùng khung .ums-drop với ums.report */
    L.drop = function (text, icon, items) {
        return '<div class="ums-drop"><button type="button" class="ums-btn ums-btn--out-info ums-drop__toggle" aria-haspopup="menu" aria-expanded="false">' +
            '<i class="fa-light ' + icon + '"></i><span>' + esc(text) + '</span><i class="fa-light fa-angle-down ums-drop__caret"></i></button>' +
            '<div class="ums-drop__menu" role="menu" hidden>' + items.map(function (x, i) {
                return '<button type="button" class="ums-drop__item" role="menuitem" data-lgbimp="' + i + '"><span class="ums-drop__no">' + (i + 1) +
                    '.</span><span class="ums-drop__text">' + esc(x.chu) + '</span></button>';
            }).join('') + '</div></div>';
    };
    L.batDrop = function (tog) {
        var d = tog.closest('.ums-drop'), mnu = d.querySelector('.ums-drop__menu');
        var on = !d.classList.contains('is-open');
        d.classList.toggle('is-open', on);
        mnu.hidden = !on;
        tog.setAttribute('aria-expanded', on ? 'true' : 'false');
    };
    L.dongDrop = function (el) {
        var d = el.closest('.ums-drop');
        if (!d) return;
        d.classList.remove('is-open');
        d.querySelector('.ums-drop__menu').hidden = true;
    };

    /* Báo cáo theo mẫu (getList_MauImport) + ô Import viết cứng của html gốc:
       có mẫu IMPORT của chức năng thì ums.report tự vẽ nút Import (gốc ghi đè
       vùng <zone>_Import); không có thì hiện nút Import viết cứng.
       o = { collect(add), importCung: [{ chu, ma }], import: false (màn gốc không có vùng _Import), onImported } */
    L.baoCao = function (host, o) {
        host.innerHTML = '<span data-lgb="rp"></span><span data-lgb="imp"></span>';
        var imp = host.querySelector('[data-lgb="imp"]');
        ums.report.mount(host.querySelector('[data-lgb="rp"]'), {
            collect: o.collect,
            onImported: o.onImported,
            import: o.import === false ? false : undefined,
            onLoad: function (tpl) {
                if (!o.importCung) return;
                var coImport = (tpl || []).some(function (t) {
                    var ma = String(t.MAUIMPORT_MA || '').substring(0, 14).toUpperCase();
                    return ma === 'IMPORTALLINPUT' || ma === 'IMPORTWITHPROC';
                });
                imp.innerHTML = coImport ? '' : L.drop('Import', 'fa-cloud-arrow-up', o.importCung);
            }
        });
        host.addEventListener('click', function (ev) {
            var b;
            if ((b = ev.target.closest('.ums-drop__toggle')) && imp.contains(b)) { L.batDrop(b); return; }
            if ((b = ev.target.closest('[data-lgbimp]'))) {
                L.dongDrop(b);
                var x = o.importCung[Number(b.getAttribute('data-lgbimp'))];
                ums.report.importChung(x.chu, x.ma, { onDone: o.onImported });   // Corei: showImportChungV2(title, name)
            }
        });
    };
})();
