/* =========================================================================
   Chương trình – học phần (KHCT) — phần dùng chung của các tệp trong module
   Bản gốc: ApisKeHoachChuongTrinh/Modules/chuongtrinhhocphan/script/cthp.js
   ---------------------------------------------------------------------------
   ums.khctCt = K — trạng thái chung của màn (chương trình đang soạn, danh sách
   học phần của chương trình, loại phân bổ…) và các khung nhỏ dùng lại ở nhiều
   vùng của màn:
     K.vung(ten, html)        thêm một vùng thay chỗ (data-khu) vào gốc màn —
                              như các khối .zone-content của html gốc, đổi bằng
                              K.api.hien(ten) (= edu.util.toggle_overide)
     K.ghep(host, cfg)        khung HAI DANH SÁCH "Xác định học phần … ▶ Danh
                              sách kết quả học phần …" (nút Chọn / Bỏ Chọn,
                              Thêm tất cả, lọc nhanh, KÉO THẢ đổi thứ tự) — gốc
                              chép ba lần (chương trình, khối bắt buộc, khối tự
                              chọn đơn) bằng <ul>/<li> kéo thả
     K.cay(rows, cfg)         cây cha → con (thay jstree loadToTreejs_data),
                              vẽ bằng kiểu cây thư mục của tầng chung
                              (.ums-master--danhmuc)
     K.drop(text, icon, items) nút thả xuống tự dựng ("Import ▾" của html gốc)
     K.tenHP(r)               nhãn một học phần "MA - SốTín(Số tiết) - TÊN"
   ========================================================================= */
(function () {
    'use strict';
    var ums = window.ums, ui = ums.ui, pat = ums.pat;
    var K = ums.khctCt = {};

    function e(v) { return v === undefined || v === null ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function rows(r) { var d = r && r.data; return Array.isArray(d) ? d : (d && d.rs) || []; }
    function boDau(s) { return String(e(s)).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd'); }
    K.e = e; K.esc = esc; K.rows = rows; K.boDau = boDau;

    /* Trạng thái của màn (gốc: thuộc tính của lớp ChuongTrinhHocPhan) */
    K.ct = null;            // chương trình đang soạn (dòng KHCT_ToChucChuongTrinh/LayDanhSach)
    K.dsHP = [];            // dtHocPhan_ChuongTrinh
    K.dsKhoa = [];          // khoá đào tạo theo Hệ đang chọn ở thanh lọc (genComBo_KhoaDaoTao)
    K.dsKBB = [];           // dtKhoibatBuoc
    K.dsKTCD = [];          // dtKhoiTuChonDon
    K.dsDH = [];            // dtDinhHuong
    K.ctId = function () { return K.ct ? K.ct.ID : ''; };

    /* Loại phân bổ (KHCT.LOAIPHANBO) — cột động của bảng học phần + ô của lưới phân bổ */
    K.phanBo = function () { return ums.api.dm('KHCT.LOAIPHANBO').catch(function () { return []; }); };

    /* Nhãn học phần — genTable_HocPhan_* : MA - HOCTRINH(TONGSOTIETPHANBO) - TEN */
    K.tenHP = function (r) {
        return e(r.DAOTAO_HOCPHAN_MA || r.MA) + ' - ' + e(r.HOCTRINHAPDUNGHOCTAP) + '(' + e(r.TONGSOTIETPHANBO) + ') - ' +
            e(r.DAOTAO_HOCPHAN_TEN || r.TEN);
    };

    /* ---------- Vùng thay chỗ ---------------------------------------------- */
    K.vung = function (ten, html) {
        var d = document.createElement('div');
        d.setAttribute('data-khu', ten);
        d.hidden = true;
        d.innerHTML = html;
        K.api.root.appendChild(d);
        ui.enhance(d);
        return d;
    };
    /** Về vùng soạn chương trình — btnClose_SelectHocPhan → toggle_chuongtrinhhocphan (nạp lại học phần) */
    K.veCT = function () {
        K.api.hien('ct');
        if (K.taiHP) K.taiHP();
    };

    /* ---------- Nút thả xuống tự dựng -------------------------------------- */
    K.drop = function (text, icon, items) {
        return '<div class="ums-drop"><button type="button" class="ums-btn ums-btn--out-info ums-drop__toggle" aria-haspopup="menu" aria-expanded="false">' +
            '<i class="fa-light ' + icon + '"></i><span>' + esc(text) + '</span><i class="fa-light fa-angle-down ums-drop__caret"></i></button>' +
            '<div class="ums-drop__menu" role="menu" hidden>' + items.map(function (x, i) {
                return '<button type="button" class="ums-drop__item" role="menuitem" data-imp="' + i + '">' +
                    '<span class="ums-drop__text">' + esc(x.chu) + '</span></button>';
            }).join('') + '</div></div>';
    };
    K.batDrop = function (tog) {
        var d = tog.closest('.ums-drop'), m = d.querySelector('.ums-drop__menu');
        var on = !d.classList.contains('is-open');
        d.classList.toggle('is-open', on);
        m.hidden = !on;
        tog.setAttribute('aria-expanded', on ? 'true' : 'false');
    };
    K.dongDrop = function (el) {
        var d = el.closest('.ums-drop');
        if (!d) return;
        d.classList.remove('is-open');
        d.querySelector('.ums-drop__menu').hidden = true;
    };

    /* ---------- Cây cha → con ---------------------------------------------- */
    /* cfg = { id: 'ID', cha: 'COT_CHA', nhan(r) → HTML, cls(r) → lớp thêm, attr: 'data-kbb' } */
    K.cay = function (list, cfg) {
        list = list || [];
        if (!list.length) return ui.empty(cfg.empty || 'Chưa có dữ liệu');
        var id = cfg.id || 'ID', cha = cfg.cha;
        var co = {};
        list.forEach(function (r) { co[r[id]] = 1; });
        function con(pid) {
            return list.filter(function (r) {
                var p = cha ? r[cha] : '';
                return pid ? p === pid : !(p && co[p]);
            });
        }
        function ve(ds) {
            return '<ul>' + ds.map(function (r) {
                var sub = cha ? con(r[id]) : [];
                return '<li><button type="button" class="ums-master__item' + (cfg.cls ? ' ' + esc(cfg.cls(r) || '') : '') +
                    '" ' + cfg.attr + '="' + esc(r[id]) + '">' + cfg.nhan(r) + '</button>' + (sub.length ? ve(sub) : '') + '</li>';
            }).join('') + '</ul>';
        }
        return '<div class="ums-master--danhmuc khct-cay"><div class="ums-master__list">' + ve(con('')) + '</div></div>';
    };
    /** Có khối con không (gốc: data.node.children.length > 0 → ẩn nút Xóa khối) */
    K.coCon = function (list, cha, id) {
        return (list || []).some(function (r) { return r[cha] === id; });
    };

    /* =====================================================================
       HAI DANH SÁCH — chọn học phần (K.ghep)
       ---------------------------------------------------------------------
       cfg = {
         traiTieuDe, traiIcon, phaiTieuDe, phaiIcon,
         traiTools: HTML nút tìm của khung trái (Tìm từ danh mục / Tìm trong chương trình…),
         traiTren:  HTML chèn trên danh sách trái (vd khung "Nâng cao"),
         them: 'dau' | 'cuoi'       mục vừa chọn chèn ĐẦU (gốc chương trình: prepend) hay CUỐI danh sách phải,
         batBuoc: true              danh sách phải có ô "Bắt buộc" cho mục đã lưu (khối tự chọn đơn),
         napLai: true               nút "Tải lại" ở chân khung phải (gốc: không có xử lý → khoá),
         onBoLuu(muc) → Promise     bỏ chọn một mục ĐÃ LƯU (gốc xoá ngay — ở đây hỏi lại trước)
       }
       Mục: { hp: id học phần, luu: id dòng đã lưu | '', row: dòng máy chủ, chu: nhãn, bb: 0/1 }
       API: trai(rowsMucs) · phai(rowsMucs) · dsPhai() (đúng thứ tự trên màn) · nhac(chu)
       ===================================================================== */
    K.ghep = function (host, cfg) {
        var trai = [], phai = [];
        host.innerHTML =
            '<div class="khct-ghep ums-cols">' +
                pat.panel({ title: cfg.traiTieuDe, icon: cfg.traiIcon || 'fa-books', flush: true, cls: 'khct-ghep__trai',
                    body: '<div class="khct-ghep__tim"><input class="ums-input" data-g="qTrai" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off">' +
                        (cfg.traiTools ? '<div class="khct-ghep__nut">' + cfg.traiTools + '</div>' : '') + '</div>' +
                        (cfg.traiTren || '') + '<div data-g="trai"></div>',
                    foot: '<div class="ums-u-flex1"></div>' + ui.btn('add', { text: 'Thêm tất cả', mod: 'out-success', attr: { 'data-g': 'tatCa' } }) }) +
                '<div class="khct-ghep__mui" aria-hidden="true"><i class="fa-light fa-forward"></i></div>' +
                pat.panel({ title: cfg.phaiTieuDe, icon: cfg.phaiIcon || 'fa-list-timeline', flush: true, cls: 'khct-ghep__phai',
                    body: '<div class="khct-ghep__tim"><input class="ums-input" data-g="qPhai" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                        '<div data-g="phai"></div>',
                    foot: cfg.napLai ? '<div class="ums-u-flex1"></div>' + ui.btn('reload', { attr: { disabled: 'disabled', title: 'Bản gốc chưa có xử lý cho nút này' } }) : '' }) +
            '</div>';
        ui.enhance(host);
        function g(k) { return host.querySelector('[data-g="' + k + '"]'); }

        function locQ(ds, q) {
            q = boDau(q).trim();
            return q ? ds.filter(function (m) { return boDau(m.chu).indexOf(q) >= 0; }) : ds;
        }
        function coPhai(hp) { return phai.some(function (m) { return m.hp === hp; }); }
        function veTrai(nhac) {
            if (nhac) { g('trai').innerHTML = ui.empty(nhac, 'fa-magnifying-glass'); return; }
            var ds = locQ(trai.filter(function (m) { return !coPhai(m.hp); }), g('qTrai').value);   // expectSameData
            ui.table({ el: g('trai'), rows: ds.map(function (m) { return { ID: m.hp, m: m }; }), empty: 'Không có học phần để chọn',
                columns: [
                    { title: 'Học phần', render: function (x) { return esc(x.m.chu); } },
                    { title: '', cls: 'is-center is-actions', width: '96px', render: function (x) {
                        return ui.btn('add', { text: 'Chọn', mod: 'out-primary', icon: 'fa-angle-right', cls: 'ums-btn--sm', attr: { 'data-chon': x.m.hp } });
                    } }
                ] });
            keo(g('trai'), false);
        }
        function vePhai() {
            var q = g('qPhai').value;
            var ds = locQ(phai, q);
            ui.table({ el: g('phai'), rows: ds.map(function (m) { return { ID: m.hp, m: m }; }), empty: 'Chưa có học phần',
                columns: [
                    { title: 'Học phần', render: function (x) {
                        return esc(x.m.chu) + (x.m.luu ? '' : ' ' + ui.badge('Chưa lưu', 'warn'));
                    } },
                    cfg.batBuoc ? { title: 'Bắt buộc', cls: 'is-center', width: '80px', render: function (x) {
                        return x.m.luu ? '<input type="checkbox" data-bb="' + esc(x.m.hp) + '"' + (x.m.bb ? ' checked' : '') + ' title="Là học phần bắt buộc">' : '';
                    } } : null,
                    { title: '', cls: 'is-center is-actions', width: '110px', render: function (x) {
                        return ui.btn('del', { text: 'Bỏ Chọn', mod: 'out-danger', icon: 'fa-xmark', cls: 'ums-btn--sm', attr: { 'data-bo': x.m.hp } });
                    } }
                ].filter(Boolean) });
            keo(g('phai'), !boDau(q).trim());
        }
        function ve() { veTrai(); vePhai(); }

        /* Kéo thả: kéo từ trái sang phải = Chọn; kéo trong danh sách phải = đổi thứ tự
           (gốc: dragstart/drop_handler — thứ tự trên danh sách phải là iThuTu khi Lưu).
           Đang lọc nhanh danh sách phải thì không cho đổi thứ tự (vị trí không liền mạch). */
        var dangKeo = null;
        function keo(vung, choDoi) {
            Array.prototype.forEach.call(vung.querySelectorAll('tbody tr[data-id]'), function (tr) {
                if (vung === g('phai') && !choDoi) return;
                tr.draggable = true;
                tr.classList.add('khct-keo');
            });
        }
        host.addEventListener('dragstart', function (ev) {
            var tr = ev.target.closest && ev.target.closest('tr[data-id]');
            if (!tr) return;
            dangKeo = { hp: tr.getAttribute('data-id'), tuPhai: !!tr.closest('[data-g="phai"]') };
            try { ev.dataTransfer.setData('text/plain', dangKeo.hp); ev.dataTransfer.effectAllowed = 'move'; } catch (x) {}
        });
        host.addEventListener('dragover', function (ev) {
            if (!dangKeo || !ev.target.closest('[data-g="phai"]')) return;
            ev.preventDefault();
            var tr = ev.target.closest('tr[data-id]');
            Array.prototype.forEach.call(host.querySelectorAll('.is-dich'), function (x) { if (x !== tr) x.classList.remove('is-dich'); });
            if (tr) tr.classList.add('is-dich');
        });
        host.addEventListener('dragend', function () {
            dangKeo = null;
            Array.prototype.forEach.call(host.querySelectorAll('.is-dich'), function (x) { x.classList.remove('is-dich'); });
        });
        host.addEventListener('drop', function (ev) {
            if (!dangKeo || !ev.target.closest('[data-g="phai"]')) return;
            ev.preventDefault();
            var tr = ev.target.closest('tr[data-id]');
            var dich = tr ? tr.getAttribute('data-id') : null;
            var m;
            if (dangKeo.tuPhai) {
                m = phai.filter(function (x) { return x.hp === dangKeo.hp; })[0];
                phai.splice(phai.indexOf(m), 1);
            } else {
                m = trai.filter(function (x) { return x.hp === dangKeo.hp; })[0];
                if (!m || coPhai(m.hp)) { dangKeo = null; return; }
            }
            var i = dich ? phai.map(function (x) { return x.hp; }).indexOf(dich) : -1;
            if (i < 0) phai.push(m); else phai.splice(i, 0, m);
            dangKeo = null;
            ve();
        });

        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-chon]');
            if (b && host.contains(b)) {
                var hp = b.getAttribute('data-chon');
                var m = trai.filter(function (x) { return x.hp === hp; })[0];
                if (m && !coPhai(hp)) { if (cfg.them === 'dau') phai.unshift(m); else phai.push(m); }
                ve();
                return;
            }
            b = ev.target.closest('[data-bo]');
            if (b && host.contains(b)) {
                var id = b.getAttribute('data-bo');
                var mm = phai.filter(function (x) { return x.hp === id; })[0];
                if (!mm) return;
                if (!mm.luu) { phai.splice(phai.indexOf(mm), 1); if (!trai.some(function (x) { return x.hp === id; })) trai.push(mm); ve(); return; }
                ui.confirm('Bỏ học phần "' + mm.chu + '"? Dữ liệu đã lưu sẽ bị xoá.', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                    if (!yes || !cfg.onBoLuu) return;
                    return cfg.onBoLuu(mm).then(function () {
                        phai.splice(phai.indexOf(mm), 1);
                        var moi = { hp: mm.hp, luu: '', row: mm.row, chu: mm.chu };
                        if (!trai.some(function (x) { return x.hp === id; })) trai.push(moi);
                        ve();
                    });
                }).catch(function (err) { ums.api.handle(err, 'bỏ chọn học phần'); });
                return;
            }
            b = ev.target.closest('[data-g="tatCa"]');
            if (b && host.contains(b)) {
                var ds = trai.filter(function (x) { return !coPhai(x.hp); });
                if (!ds.length) { ui.toast('Không còn học phần để thêm.', 'warn'); return; }
                ui.confirm('Bạn có muốn thêm ' + ds.length + ' học phần vào chương trình không?', { title: 'Thêm tất cả', ok: 'Thêm' }).then(function (yes) {
                    if (!yes) return;
                    ds.forEach(function (m) { if (cfg.them === 'dau') phai.unshift(m); else phai.push(m); });
                    ve();
                });
            }
        });
        host.addEventListener('change', function (ev) {
            var c = ev.target.closest('[data-bb]');
            if (!c) return;
            var m = phai.filter(function (x) { return x.hp === c.getAttribute('data-bb'); })[0];
            if (m) m.bb = c.checked ? 1 : 0;
        });
        g('qTrai').addEventListener('input', function () { veTrai(); });
        g('qPhai').addEventListener('input', vePhai);

        veTrai('Nhập từ khoá rồi bấm nút tìm để lấy học phần');
        vePhai();

        return {
            trai: function (ds) { trai = ds || []; veTrai(); },
            phai: function (ds) { phai = ds || []; ve(); },
            dsPhai: function () { return phai.slice(); },
            nhac: function (chu) { trai = []; veTrai(chu); },
            dang: function () { g('trai').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin'); },
            tuKhoa: function () { return (g('qTrai').value || '').trim(); },
            xoaTim: function () { g('qTrai').value = ''; g('qPhai').value = ''; }
        };
    };
})();
