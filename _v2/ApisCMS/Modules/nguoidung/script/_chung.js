/* =========================================================================
   Phần dùng chung của module nguoidung (ApisCMS) — ums.cmsNd
   ---------------------------------------------------------------------------
   Bốn màn gốc (nguoidung, nguoidungvaitro, nguoidungchucnang, canbochucnang)
   chép nhau từng khối:
     · cột trái "Danh sách người dùng": ảnh · TENDAYDU / EMAIL · một nút, bấm
       dòng là chọn (arrClassName "btnView…" đặt trên <tr>), phân trang máy
       chủ 10 dòng, popover_NguoiDung khi rê chuột (Corei/systemextend.js:2752);
     · hai màn "… - chức năng" có cùng khối bên phải: danh sách ứng dụng của
       người dùng · bảng chức năng gộp theo ứng dụng (insertHeaderTable) · khung
       "Thêm Người dùng - Chức năng" với cây chức năng có ô đánh dấu (jstree
       checkbox) và nút Lưu tính phần THÊM / XOÁ so với quyền đang có.

   ums.cmsNd.dsNguoiDung(master, { goi(q, page, size) → call, nut(row) → HTML, onChon(row),
                                   onNut(row, nút), hover: true, sau(rows) })
       → { nap(page), rows(), chon(id), dong(id) }
   ums.cmsNd.cay(host, ds, { co: { id: true } }) → { tatCa(bool), thayDoi() → { them, xoa }, dem }
   ums.cmsNd.bangChucNang(host, dsUngDung, dsChucNang)
   ums.cmsNd.quyen(host, cfg) — khối bên phải của nguoidungchucnang / canbochucnang
   ums.cmsNd.anh(path) — ảnh đại diện tròn (edu.system.getRootPathImg), trống → biểu tượng

   Khác gốc (cây chức năng — jstree checkbox "three_state"):
     · Gốc đánh dấu sẵn bằng cách gắn lớp jstree-clicked thẳng vào DOM (jstree
       không biết), rồi Lưu đọc lại lớp đó. Với three_state, đánh dấu một
       chức năng con thì chức năng cha chỉ "lưng chừng" (không được gửi) →
       người dùng có con mà không có cha, menu hệ cũ bỏ hẳn mục mồ côi.
       Ở đây: đánh dấu cha = đánh dấu mọi con; bỏ cha = bỏ mọi con (như gốc);
       đánh dấu con thì TỰ đánh dấu các cha của nó (để mục hiện được trên menu).
   Chỉ vẽ: bảng chức năng lấy gốc là mục không có cha TRONG danh sách của ứng
   dụng đó (gốc chỉ lấy CHUCNANGCHA_ID == null → mục mồ côi bị ẩn khỏi bảng).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat;
    function e(v) { return v === undefined || v === null ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function rows(r) { var d = r && r.data; return Array.isArray(d) ? d : (d && d.rs) || []; }
    function qa(el, s) { return Array.prototype.slice.call(el.querySelectorAll(s)); }

    var N = ums.cmsNd = { e: e, rows: rows, qa: qa };

    /* Ảnh đại diện tròn — ảnh lỗi thì gỡ ảnh, còn lại biểu tượng người */
    N.anh = function (path, cls) {
        if (!cls) return ums.pat.anhNguoi(path);     /* ảnh nhỏ trong danh sách: dùng chung */
        return '<span class="cmsnd-ava' + (cls ? ' ' + cls : '') + '"><i class="fa-light fa-user"></i>' +
            (path ? '<img alt="" src="' + esc(ums.files.url(path)) + '" onerror="this.remove()">' : '') + '</span>';
    };

    /* =====================================================================
       Cột trái: danh sách người dùng
       ===================================================================== */
    N.dsNguoiDung = function (m, o) {
        var st = { page: 1, size: 10, total: 0, rows: [], id: '', q: '' };
        var list = m.sideBody;

        function ve() {
            m.sideCount.textContent = '(' + st.total + ')';
            list.innerHTML = !st.rows.length ? ui.empty('Không tìm thấy người dùng') : st.rows.map(function (r) {
                /* Mục chỉ để CHỌN — không nút xem / xoá trên từng mục (người dùng 2026-09-26): thao tác nằm trên tiêu
                   đề khung phải (N.quyen nutTruoc) */
                return '<button type="button" class="ums-master__item ums-dsns__item cmsnd-item' + (r.ID === st.id ? ' is-active' : '') + '" data-id="' + esc(r.ID) + '">' +
                    N.anh(r.HINHDAIDIEN) +
                    '<span class="ums-master__item__main">' + esc(e(r.TENDAYDU)) +
                    '<span class="ums-master__item__sub cmsnd-item__mail">' + esc(e(r.EMAIL)) + '</span></span></button>';
            }).join('');
            m.setPage({
                index: st.page, size: st.size, total: st.total, shown: st.rows.length,
                onChange: function (p) { if (p >= 1 && p <= Math.ceil(st.total / st.size)) nap(p); },
                onSize: function (v) { st.size = v; nap(1); }
            });
        }

        function nap(page) {
            if (page) st.page = page;
            st.q = (m.search.value || '').trim();
            list.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return ums.api.call(o.goi(st.q, st.page, st.size)).then(function (r) {
                st.rows = rows(r);
                st.total = Number(r.pager) || st.rows.length;
                ve();
                if (o.sau) o.sau(st.rows);
                return st.rows;
            }).catch(function (err) {
                list.innerHTML = ui.fail(err.message);
                ums.api.handle(err, 'danh sách người dùng');
            });
        }

        function tim(id) { return st.rows.filter(function (r) { return r.ID === id; })[0]; }
        function chon(id) {
            st.id = id;
            qa(list, '.cmsnd-item').forEach(function (x) { x.classList.toggle('is-active', x.getAttribute('data-id') === id); });
        }

        m.search.addEventListener('keydown', function (ev) {
            if (ev.key === 'Enter') { ev.preventDefault(); nap(1); }
        });
        list.addEventListener('click', function (ev) {
            var it = ev.target.closest('.cmsnd-item');
            if (!it) return;
            var r = tim(it.getAttribute('data-id'));
            if (!r) return;
            chon(r.ID);
            if (o.onChon) o.onChon(r);
        });

        /* popover_NguoiDung: Tài khoản · Loại đối tượng (gốc để trống) · Hạn đổi mật khẩu */
        if (o.hover !== false) {
            ui.hoverCard(list, '.cmsnd-item', function (it) {
                var r = tim(it.getAttribute('data-id'));
                if (!r) return null;
                return '<div class="ums-hovercard__in"><div class="ums-hovercard__rows">' +
                    '<div class="ums-hovercard__row"><i class="fa-light fa-circle-info"></i><b>Thông tin</b></div>' +
                    [['fa-user', 'Tài khoản', r.TAIKHOAN], ['fa-users', 'Loại đối tượng', ''],
                     ['fa-key', 'Hạn đổi mật khẩu', r.THOIHANPHAIDOIMATKHAU]].map(function (d) {
                        return '<div class="ums-hovercard__row"><i class="fa-light ' + d[0] + '"></i><span>' + esc(d[1]) +
                            ' :</span><b>' + esc(e(d[2])) + '</b></div>';
                    }).join('') + '</div></div>';
            });
        }

        /* Luật cột trái (BO-CUC 12): Tải lại + Bộ lọc nâng cao trên tiêu đề, ô lọc ẩn sẵn, gõ là tự tìm.
           o.tuTaiLoc: false khi màn đã tự nạp lại lúc đổi ô lọc. */
        pat.cotTrai(m, { tai: nap, tuTaiLoc: o.tuTaiLoc });

        return { nap: nap, rows: function () { return st.rows; }, chon: chon, tim: tim, dangChon: function () { return st.id; } };
    };

    /* =====================================================================
       Cây chức năng có ô đánh dấu (jstree checkbox của bản gốc)
       ds: [{ ID, CHUCNANGCHA_ID, TENCHUCNANG }] — thứ tự giữ như máy chủ trả
       Ô mang data-cn (không dùng data-ck — tránh trùng ô của pat.checks).
       ===================================================================== */
    N.cay = function (host, ds, o) {
        o = o || {};
        var co = o.co || {};
        var ids = {}, cha = {}, con = {};
        ds.forEach(function (r) { ids[r.ID] = true; });
        ds.forEach(function (r) {
            var p = r.CHUCNANGCHA_ID && ids[r.CHUCNANGCHA_ID] ? r.CHUCNANGCHA_ID : '';
            cha[r.ID] = p;
            (con[p] = con[p] || []).push(r);
        });
        function nhanh(p) {
            var ks = con[p] || [];
            if (!ks.length) return '';
            return '<ul class="cmsnd-cay">' + ks.map(function (r) {
                var laCha = (con[r.ID] || []).length > 0;
                return '<li><label class="cmsnd-cay__nut"><input type="checkbox" data-cn="' + esc(r.ID) + '"' + (co[r.ID] ? ' checked' : '') + '>' +
                    '<i class="fa-light ' + (laCha ? 'fa-folder-open' : 'fa-file-lines') + '"></i><span>' + esc(e(r.TENCHUCNANG)) + '</span></label>' +
                    nhanh(r.ID) + '</li>';
            }).join('') + '</ul>';
        }
        host.innerHTML = '<div class="cmsnd-cayhop">' + (ds.length ? nhanh('') : ui.empty('Không tìm thấy dữ liệu!')) + '</div>';
        var hop = host.firstChild;
        var o2 = {};
        qa(hop, 'input[data-cn]').forEach(function (c) { o2[c.getAttribute('data-cn')] = c; });

        function xuong(id, v) {
            (con[id] || []).forEach(function (r) { if (o2[r.ID]) o2[r.ID].checked = v; xuong(r.ID, v); });
        }
        hop.addEventListener('change', function (ev) {
            var t = ev.target;
            if (!t.matches || !t.matches('input[data-cn]')) return;
            var id = t.getAttribute('data-cn');
            xuong(id, t.checked);
            if (t.checked) for (var p = cha[id]; p; p = cha[p]) if (o2[p]) o2[p].checked = true;
            if (o.onDoi) o.onDoi();
        });

        return {
            dem: ds.length,
            tatCa: function (v) { Object.keys(o2).forEach(function (k) { o2[k].checked = v; }); },
            thayDoi: function () {
                var them = [], xoa = [];
                Object.keys(o2).forEach(function (k) {
                    if (o2[k].checked && !co[k]) them.push(k);
                    if (!o2[k].checked && co[k]) xoa.push(k);
                });
                return { them: them, xoa: xoa };
            }
        };
    };

    /* Duyệt cây theo thứ tự máy chủ trả, kèm cấp — dùng cho bảng chức năng */
    N.phang = function (ds) {
        var ids = {}, con = {}, out = [];
        ds.forEach(function (r) { ids[r.ID] = true; });
        ds.forEach(function (r) {
            var p = r.CHUCNANGCHA_ID && ids[r.CHUCNANGCHA_ID] ? r.CHUCNANGCHA_ID : '';
            (con[p] = con[p] || []).push(r);
        });
        (function di(p, cap) {
            (con[p] || []).forEach(function (r) {
                out.push({ r: r, cap: cap, cha: (con[r.ID] || []).length > 0 });
                di(r.ID, cap + 1);
            });
        })('', 0);
        return out;
    };

    /* Bảng "Danh sách chức năng" (insertHeaderTable): ứng dụng gộp ô, chức năng thụt theo cấp */
    N.bangChucNang = function (host, ungDung, ds, empty) {
        pat.groupTable({
            el: host, empty: empty || 'Không có chức năng nào',
            groups: ungDung.map(function (u) {
                return { row: u, rows: N.phang(ds.filter(function (r) { return r.CHUNG_UNGDUNG_ID === u.ID; })) };
            }),
            groupCols: [{ title: 'Ứng dụng', prop: 'TENUNGDUNG', width: '220px' }],
            cols: [{ title: 'Chức năng', render: function (x) {
                return '<span class="cmsnd-cap" style="--cmsnd-cap:' + x.cap + '"><i class="fa-light ' +
                    (x.cha ? 'fa-folder-open' : 'fa-file-lines') + '"></i> ' + esc(e(x.r.TENCHUCNANG)) + '</span>';
            } }]
        });
    };

    /* =====================================================================
       Khối bên phải của hai màn "… - chức năng"
       cfg = {
         hauTo,                          hậu tố tên (NDCN / CBCN) — chỉ để ghi chú
         goiDsCN(uid)   → call           CMS_Quyen/LayDSChucNangTheoNguoiDung_Id
         goiCay(appId)  → call           danh sách chức năng của ứng dụng (cây)
         them(uid, cn)  → call           thêm một chức năng cho người dùng
         xoa(uid, cn)   → call           xoá một chức năng của người dùng
       }
       → { datUngDung(rows), chonNguoiDung(row) }
       ===================================================================== */
    N.quyen = function (host, cfg) {
        var st = { uid: '', ungDung: [], dsCN: [], app: '', cay: null };

        host.innerHTML = pat.panel({
            title: 'Người dùng:', icon: 'fa-user', count: 'ten',
            tools: (cfg.nutTruoc || '') + ui.btn('edit', { text: 'Chỉnh sửa quyền', attr: { 'data-a': 'sua' } }),
            body:
                '<div class="ums-grid cmsnd-hai">' +
                    '<div class="cmsnd-sub">' +
                        '<div class="cmsnd-sub__head"><b><i class="fa-light fa-hard-drive"></i> Danh sách ứng dụng</b> <span class="ums-u-faint" data-z="udN">(0)</span></div>' +
                        '<div data-z="ud">' + ui.empty('Chọn một người dùng ở cột trái', 'fa-hand-pointer') + '</div>' +
                    '</div>' +
                    '<div class="cmsnd-sub">' +
                        '<div data-z="ds">' +
                            '<div class="cmsnd-sub__head"><b><i class="fa-light fa-user-gear"></i> Danh sách chức năng</b> <span class="ums-u-faint" data-z="cnN">(0)</span></div>' +
                            '<div data-z="bang">' + ui.empty('Chọn một người dùng ở cột trái', 'fa-hand-pointer') + '</div>' +
                        '</div>' +
                        '<div data-z="nhap" hidden>' +
                            '<div class="cmsnd-sub__head"><b><i class="fa-light fa-plus"></i> Thêm Người dùng - Chức năng</b> <span class="ums-u-faint" data-z="cayN">( )</span>' +
                                '<span class="ums-u-flex1"></span>' + ui.btn('close', { attr: { 'data-a': 'dong' } }) + '</div>' +
                            '<div class="cmsnd-form">' +
                                ui.field('Ứng dụng', '<select class="ums-select" data-f="app" data-ph="Chọn ứng dụng"><option value=""></option></select>', { inline: true }) +
                                ui.field('Vai trò', '<select class="ums-select" data-f="vt" data-ph="Chọn vai trò" disabled><option value=""></option></select>',
                                    { inline: true, hint: 'Bản gốc có ô này nhưng chưa từng nạp danh sách vai trò.' }) +
                                '<div class="ums-row ums-row--between">' +
                                    '<label class="ums-check"><input type="checkbox" data-f="all"> <span>Check All</span></label>' +
                                    ui.btn('save', { attr: { 'data-a': 'luu' } }) +
                                '</div>' +
                            '</div>' +
                            '<div class="cmsnd-sub__head ums-u-mt-4"><b><i class="fa-light fa-folder-gear"></i> Danh sách chức năng</b></div>' +
                            '<div data-z="cay">' + ui.empty('Chọn ứng dụng để hiện danh sách chức năng', 'fa-hand-pointer') + '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>'
        });
        function z(k) { return host.querySelector('[data-z="' + k + '"]'); }
        function f(k) { return host.querySelector('[data-f="' + k + '"]'); }
        ui.enhance(host);

        function hienDs() { if (!z('nhap').hidden) ui.swap(z('nhap'), z('ds'), { top: false }); }
        function hienNhap() { if (z('nhap').hidden) ui.swap(z('ds'), z('nhap'), { top: false }); }

        /* Ứng dụng có trong danh sách chức năng của người dùng (process_NguoiDungUngDung) */
        function ungDungCuaND() {
            return st.ungDung.filter(function (u) {
                return st.dsCN.some(function (r) { return r.CHUNG_UNGDUNG_ID === u.ID; });
            });
        }
        function veUngDung() {
            var ds = ungDungCuaND();
            z('udN').textContent = '(' + ds.length + ')';
            z('ud').innerHTML = ds.length ? '<div class="cmsnd-list">' + ds.map(function (u) {
                return pat.masterItem({ text: e(u.TENUNGDUNG), id: u.ID, active: u.ID === st.app });
            }).join('') + '</div>' : ui.empty('Chưa có ứng dụng nào');
        }
        function veBang() {
            var ds = st.app ? st.dsCN.filter(function (r) { return r.CHUNG_UNGDUNG_ID === st.app; }) : st.dsCN;
            z('cnN').textContent = '(' + ds.length + ')';
            N.bangChucNang(z('bang'), ungDungCuaND(), ds, 'Người dùng chưa có chức năng nào');
        }
        function napDsCN() {
            z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return ums.api.call(cfg.goiDsCN(st.uid)).then(function (r) {
                st.dsCN = rows(r);
                veUngDung();
                veBang();
            }).catch(function (err) {
                z('bang').innerHTML = ui.fail(err.message);
                ums.api.handle(err, 'chức năng của người dùng');
            });
        }
        function napCay() {
            var app = f('app').value;
            f('all').checked = false;
            if (!app) {
                st.cay = null;
                z('cayN').textContent = '( )';
                z('cay').innerHTML = ui.empty('Chọn ứng dụng để hiện danh sách chức năng', 'fa-hand-pointer');
                return Promise.resolve();
            }
            var tok = napCay.tok = {};
            z('cay').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return ums.api.call(cfg.goiCay(app)).then(function (r) {
                if (napCay.tok !== tok) return;
                var co = {};
                st.dsCN.forEach(function (x) { co[x.ID] = true; });
                var ds = rows(r);
                z('cayN').textContent = '(' + ds.length + ')';
                st.cay = N.cay(z('cay'), ds, { co: co });
            }).catch(function (err) {
                if (napCay.tok !== tok) return;
                z('cay').innerHTML = ui.fail(err.message);
                ums.api.handle(err, 'danh sách chức năng');
            });
        }
        function datApp(id) {
            f('app').value = id || '';
            if (window.jQuery) jQuery(f('app')).trigger('change.select2');
        }

        host.addEventListener('click', function (ev) {
            var a = ev.target.closest('[data-a]');
            var it = ev.target.closest('.cmsnd-list .ums-master__item');
            if (it) {
                /* select_node.jstree của danh sách ứng dụng: lọc bảng theo ứng dụng,
                   đặt ô Ứng dụng của khung Thêm rồi nạp cây (gốc gọi getList_ChucNang) */
                st.app = it.getAttribute('data-id');
                qa(z('ud'), '.ums-master__item').forEach(function (x) { x.classList.toggle('is-active', x === it); });
                veBang();
                datApp(st.app);
                napCay();
                return;
            }
            if (!a) return;
            var k = a.getAttribute('data-a');
            if (k === 'sua') {
                if (!st.uid) { ui.toast('Vui lòng chọn người dùng phân quyền chức năng!', 'warn'); return; }
                hienNhap();
                if (f('app').value) napCay();
            } else if (k === 'dong') {
                hienDs();
            } else if (k === 'luu') {
                luu();
            }
        });
        f('all').addEventListener('change', function () { if (st.cay) st.cay.tatCa(f('all').checked); });
        jQuery(f('app')).on('select2:select select2:clear', function () { napCay(); });

        function luu() {
            if (!st.uid) { ui.toast('Vui lòng chọn người dùng phân quyền chức năng!', 'warn'); return; }
            if (!st.cay) { ui.toast('Vui lòng chọn ứng dụng!', 'warn'); return; }
            var d = st.cay.thayDoi();
            ui.confirm('Bạn có chắc chắn thêm ' + d.them.length + ' và xóa ' + d.xoa.length + ' dữ liệu không?').then(function (yes) {
                if (!yes) return;
                if (!d.them.length && !d.xoa.length) { ui.toast('Không có thay đổi nào để lưu', 'info'); return; }
                var uid = st.uid;
                var calls = d.them.map(function (cn) { return cfg.them(uid, cn); })
                    .concat(d.xoa.map(function (cn) { return cfg.xoa(uid, cn); }));
                ui.batch(calls, { title: 'Đang lưu quyền chức năng', okText: 'Đã lưu' }).then(function () {
                    return napDsCN().then(napCay);
                });
            });
        }

        return {
            datUngDung: function (ds) {
                st.ungDung = ds || [];
                pat.fill(f('app'), st.ungDung, { name: 'TENUNGDUNG' });
                if (st.uid) { veUngDung(); veBang(); }
            },
            chonNguoiDung: function (r) {
                st.uid = r.ID;
                st.app = '';
                st.cay = null;
                napCay.tok = {};
                z('cay').innerHTML = ui.empty('Chọn ứng dụng để hiện danh sách chức năng', 'fa-hand-pointer');
                z('ten').textContent = e(r.TENDAYDU);
                hienDs();
                napDsCN();
            }
        };
    };
})();
