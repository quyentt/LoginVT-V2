/* =========================================================================
   Khung ứng dụng — điều hướng ba tầng trong một trang
   =========================================================================
       #/                          trang chủ, lưới vai trò
       #/r/<vaiTroId>              chọn vai trò, đổ cây chức năng ra cột trái
       #/r/<vaiTroId>/<chucNangId> mở một chức năng vào vùng nội dung

   Khác hệ hiện hành ở chỗ tầng 3 KHÔNG rời trang: không còn
   `location.href = "./indexi.aspx"`, không còn cột TENANH làm router.

   Hai chế độ, chọn bằng `api.dataSource` trong site.config.js:
       api   — gọi microservice thật (chạy trên máy chủ, mở index.aspx)
       demo  — dữ liệu dựng thử, không gọi mạng (mở index.html trên máy)
       auto  — có AXYZCLRVN() thì api, không thì demo
   ========================================================================= */
(function (global) {
    'use strict';

    var ums = global.ums || (global.ums = {});
    var CFG = ums.cfg || {};
    var T = CFG.getText || function (k, d) { return d || ''; };
    var API = CFG.api || {};

    /* Trạng thái dùng chung — api.js đọc chucNangId và thuVaiId từ đây */
    var state = ums.state = {
        mode: 'demo',
        user: 'admin',
        roleId: '',
        chucNangId: '',
        thuVaiId: '',
        roles: [],
        menu: [],        // phẳng, đúng như máy chủ trả
        tree: []         // đã dựng cây
    };

    var elApp, elNav, elContent;

    function el(id) { return document.getElementById(id); }
    function esc(s) { return ums.ui.esc(s); }

    /* =====================================================================
       Chọn chế độ
       ===================================================================== */
    function pickMode() {
        var want = API.dataSource || 'auto';
        if (want === 'demo') return 'demo';
        if (want === 'api') return 'api';
        return (typeof global.AXYZCLRVN === 'function') ? 'api' : 'demo';
    }

    /* =====================================================================
       Bỏ dấu tiếng Việt — dùng để phân nhóm vai trò theo tên
       ===================================================================== */
    function noAccent(s) {
        return (s || '').toString().toLowerCase()
            .normalize('NFD').replace(/[̀-ͯ]/g, '')
            .replace(/đ/g, 'd');
    }

    /** Suy ra nhóm và biểu tượng của một vai trò từ tên, theo roleRules */
    function classify(name) {
        var key = noAccent(name);
        var rules = CFG.roleRules || [];
        for (var i = 0; i < rules.length; i++) {
            if (key.indexOf(rules[i].kw) >= 0) {
                return { group: rules[i].group, icon: rules[i].icon };
            }
        }
        return { group: 'khac', icon: 'fa-light fa-cube' };
    }

    /* =====================================================================
       Chuẩn hoá dữ liệu — để phần vẽ không phải biết nguồn nào
       ===================================================================== */
    function normRole(r) {
        var name = r.TENVAITRO || r.TENUNGDUNG || r.TEN || r.name || '';
        var c = classify(name);
        return {
            id: r.ID || r.id,
            name: name,
            code: r.MAUNGDUNG || '',
            report: r.TENFILEDINHKEM || '',
            thuVai: String(r.CHOPHEPTHUVAI || '') === '1',
            group: r.group || c.group,
            icon: r.icon || c.icon
        };
    }

    function normChucNang(c) {
        return {
            id: c.ID || c.id,
            name: c.TENCHUCNANG || c.name || '',
            path: c.DUONGDANFILE || '',
            hash: c.DUONGDANHIENTHI || '',
            parent: c.CHUCNANGCHA_ID || '',
            icon: c.TENANH || '',
            order: Number(c.THUTUHIENTHI || 0),
            appCode: c.MAUNGDUNG || '',
            // Đường dẫn trang báo cáo riêng của chức năng — hệ cũ gán vào
            // rootPathReport khi mở chức năng (Core/systemroot.js:811)
            report: c.TENFILEDINHKEM || '',
            // Hướng dẫn sử dụng (nút ? ở breadcrumb) — Core/systemroot.js:6524
            help: c.DUONGDANHUONGDANSUDUNG || '',
            code: c.MACHUCNANG || '',   // mã chức năng — ghép vào link Cổng Help ({code})
            // Ẩn/khoá phần tử theo cấu hình của chức năng — Core:6564
            hide: c.THONGTINKHONGHIENTHI || ''
        };
    }

    /* Ẩn / khoá phần tử theo cột THONGTINKHONGHIENTHI của bảng chức năng.
       Bản viết lại của edu.system.hiddenElement (Core/systemroot.js:6564).
       Giá trị là JSON: { me, father, parent, readonly, readonlyselect2 },
       mỗi khoá là danh sách bộ chọn CSS ngăn bằng dấu phẩy:
           me                ẩn chính phần tử
           father            ẩn phần tử CHA của nó
           parent            ẩn cha VÀ phần tử liền trước cha (thường là nhãn)
           readonly          đặt readonly cho ô nhập
           readonlyselect2   khoá ô chọn
       Người quản trị dùng nó để tắt bớt trường của một chức năng mà không
       phải sửa mã, nên bỏ qua là màn hình mới hiện thừa trường. */
    function applyHidden(root, cfgJson) {
        if (!cfgJson) return;
        var o;
        try { o = JSON.parse(cfgJson); }
        catch (e) { console.warn('[ums] THONGTINKHONGHIENTHI không phải JSON hợp lệ:', cfgJson); return; }

        function each(val, fn) {
            if (!val) return;
            String(val).split(',').forEach(function (sel) {
                sel = sel.trim();
                if (!sel) return;
                var list;
                try { list = root.querySelectorAll(sel); } catch (e2) { return; }
                Array.prototype.forEach.call(list, fn);
            });
        }

        each(o.me, function (el) { el.hidden = true; el.style.display = 'none'; });
        each(o.father, function (el) {
            if (el.parentElement) { el.parentElement.hidden = true; el.parentElement.style.display = 'none'; }
        });
        each(o.parent, function (el) {
            var p = el.parentElement;
            if (!p) return;
            p.style.display = 'none';
            if (p.previousElementSibling) p.previousElementSibling.style.display = 'none';
        });
        each(o.readonly, function (el) { el.setAttribute('readonly', 'readonly'); });
        each(o.readonlyselect2, function (el) {
            el.disabled = true;
            if (global.jQuery) jQuery(el).trigger('change.select2');
        });
    }

    /* Dựng cây hai tầng từ danh sách phẳng.

       THỨ TỰ: giữ NGUYÊN thứ tự máy chủ trả về, đúng như hệ cũ
       (Core/systemroot.js:6391 duyệt mảng theo chỉ số, mục con lấy bằng
       data.filter nên cũng giữ thứ tự). Thứ tự thật do `ORDER BY` của
       PKG_CORE_QUANTRI_01.LayDSChucNangNguoiDung quyết định. KHÔNG sắp lại
       theo tên — sắp theo A→B là sai trật tự nghiệp vụ của bảng chức năng.
       Muốn sắp theo tên thì đặt behavior.menuOrder = 'name'.

       MỤC MỒ CÔI (cha không nằm trong danh sách trả về, thường do vai trò
       được cấp mục con mà không cấp mục cha): hệ cũ bỏ hẳn, người dùng mất
       chức năng dù đã được cấp quyền. Mặc định ở đây gom vào một nhóm cuối
       ("Khác"); đặt behavior.menuOrphans = 'hide' để giống hệt hệ cũ, hoặc
       'root' để coi như nhóm gốc.

       #dashboard: hệ cũ vẫn dựng nhưng display:none (Core:6417) — ở đây bỏ hẳn. */
    function buildTree(list) {
        var b = (CFG.behavior || {});
        var byId = {}, roots = [], orphans = [];

        list.forEach(function (n) { byId[n.id] = Object.assign({}, n, { items: [] }); });

        list.forEach(function (n) {
            if (b.menuHideDashboard !== false && String(n.hash || '').toLowerCase() === '#dashboard') return;
            var node = byId[n.id];
            if (!n.parent) { roots.push(node); return; }
            if (byId[n.parent]) { byId[n.parent].items.push(node); return; }
            if (b.menuOrphans === 'hide') return;                  // giống hệ cũ: bỏ hẳn
            if (b.menuOrphans === 'root') { roots.push(node); return; }
            orphans.push(node);                                     // mặc định: gom vào nhóm cuối
        });

        if (orphans.length) {
            roots.push({
                id: '__khac__', name: (CFG.getText && CFG.getText('menuOther')) || 'Khác',
                path: '', hash: '', parent: '', icon: 'fa-light fa-folder-open',
                order: 9999, appCode: '', report: '', items: orphans
            });
        }

        if (b.menuOrder === 'name') {
            var byName = function (a) {
                a.sort(function (x, y) { return x.name.localeCompare(y.name, 'vi'); });
                a.forEach(function (n) { if (n.items.length) byName(n.items); });
            };
            byName(roots);
        }
        return roots;
    }

    /* =====================================================================
       Nạp dữ liệu
       ===================================================================== */
    function loadRoles() {
        if (state.mode === 'demo') {
            return Promise.resolve((ums.demo.roles || []).map(normRole));
        }
        var ep = (API.endpoints || {}).roles || {};
        return ums.api.call({
            action: ep.action,
            func: ep.func,
            strChucNang_Id: ''
        }).then(function (r) {
            return (r.data || []).map(normRole);
        });
    }

    function loadMenu(roleId) {
        if (state.mode === 'demo') {
            // Vai trò có cây mẫu riêng (ums.demo.menus[R..]) thì dùng cây đó
            var m = (ums.demo.menus && ums.demo.menus[roleId]) || ums.demo.menu || [];
            return Promise.resolve(m.map(normChucNang));
        }
        var ep = (API.endpoints || {}).menu || {};
        return ums.api.call({
            action: ep.action,
            func: ep.func,
            strChucNang_Id: '',
            strVaiTro_Id: roleId
        }).then(function (r) {
            // Máy chủ trả { rs: [...] } cho thủ tục này
            var d = r.data;
            var list = Array.isArray(d) ? d : (d && d.rs) || [];
            return list.map(normChucNang);
        });
    }

    /* =====================================================================
       Cột trái — cây chức năng
       ===================================================================== */
    /* Thẻ "Đang xem — …" đầu cột trái khi đang thủ vai (Core/systemroot.js:6436) */
    function theThuVai() {
        return ums.thuVai && state.roleId ? ums.thuVai.theHtml(ums.thuVai.hienTai(state.roleId)) : '';
    }

    function renderNav() {
        if (!state.tree.length) {
            elNav.innerHTML = theThuVai() + '<div class="ums-nav__empty">' +
                (state.roleId ? 'Vai trò này chưa có chức năng nào.' : 'Chọn một vai trò ở trang chủ.') +
                '</div>';
            return;
        }

        var openFirst = !CFG.behavior || CFG.behavior.openFirstNavGroup !== false;

        /* Vẽ ĐỆ QUY: cây chức năng trong DB sâu bao nhiêu thì menu sâu bấy
           nhiêu. `index.aspx` của hệ cũ chỉ vẽ 2 tầng nên mục tầng 3 mất
           hẳn, trong khi `indexi.aspx` lại vẽ đủ (Corei:6622
           genHTML_MenuVertical_Recusive) — cùng một vai trò mà hai vỏ hiện
           khác nhau. Ở đây theo bản vẽ đủ, không giấu chức năng nào. */
        function nodeHtml(n, depth, index) {
            if (!n.items.length) {
                // Mục đơn không có tệp thì quay về trang chọn chức năng của vai trò
                var to = n.path ? href(n.id) : '#/r/' + state.roleId;
                if (depth === 0) {
                    return '<a class="ums-nav__single" href="' + to + '" data-cn="' + esc(n.id) + '">' +
                        '<i class="ums-nav__icon ' + esc(navIcon(n)) + '"></i>' +
                        '<span class="ums-nav__label">' + esc(n.name) + '</span></a>';
                }
                var can = !!n.path;
                return '<a class="ums-nav__link' + (can ? '' : ' is-disabled') + '" ' +
                    'href="' + (can ? href(n.id) : 'javascript:void(0)') + '" ' +
                    'data-cn="' + esc(n.id) + '">' + esc(n.name) + '</a>';
            }

            var subs = n.items.map(function (it) { return nodeHtml(it, depth + 1); }).join('');

            // Nhóm tầng 1 có biểu tượng; nhóm lồng bên trong dùng kiểu gọn hơn
            var head = depth === 0
                ? '<button type="button" class="ums-nav__head">' +
                  '<i class="ums-nav__icon ' + esc(navIcon(n)) + '"></i>' +
                  '<span class="ums-nav__label">' + esc(n.name) + '</span>' +
                  '<i class="ums-nav__caret fa-light fa-angle-right"></i></button>'
                : '<button type="button" class="ums-nav__head ums-nav__head--sub">' +
                  '<span class="ums-nav__label">' + esc(n.name) + '</span>' +
                  '<i class="ums-nav__caret fa-light fa-angle-right"></i></button>';

            return '<div class="ums-nav__group' + (depth ? ' ums-nav__group--sub' : '') +
                (openFirst && depth === 0 && index === 0 ? ' is-open' : '') + '">' +
                head + '<div class="ums-nav__sub">' + subs + '</div></div>';
        }

        elNav.innerHTML = theThuVai() + state.tree.map(function (n, i) { return nodeHtml(n, 0, i); }).join('');

        /* Đóng / mở nhóm chức năng: có trượt, và theo luật "đàn xếp" —
           behavior.accordion (mặc định bật): mở nhóm này thì đóng các nhóm
           CÙNG CẤP; tắt đi thì mở được nhiều nhóm một lúc như trước. */
        elNav.querySelectorAll('.ums-nav__head').forEach(function (b) {
            b.addEventListener('click', function () { moNhom(b.parentNode); });
        });

        if (ums.scroll) ums.scroll.refresh('#navScroll');
        veIconThieu(elNav);
    }

    /* Biểu tượng menu: TENANH của hệ cũ là Font Awesome 4 (`fa fa-x`) → FA7 theo bảng đổi tên
       tự sinh ums.iconFA4 (assets/js/icon-fa4.js: fa-money → fa-money-bill-1, fa-bar-chart → fa-chart-column,
       …-o → tên gốc, icon thương hiệu → fa-brands). Icon nào FA7 vẫn không có thì veIconThieu() thay mặc định. */
    /* Mở (hoặc đóng) một nhóm trong cây chức năng, có trượt. */
    function moNhom(g) {
        if (!g) return;
        var sub = g.querySelector(':scope > .ums-nav__sub');
        if (g.classList.contains('is-open')) return dongNhom(g);
        if (!CFG.behavior || CFG.behavior.accordion !== false) {
            Array.prototype.forEach.call(g.parentNode.children, function (x) {
                if (x !== g && x.classList && x.classList.contains('ums-nav__group') && x.classList.contains('is-open')) dongNhom(x);
            });
        }
        g.classList.add('is-open');
        ums.ui.truot(sub, true, function () { if (ums.scroll) ums.scroll.refresh('#navScroll'); });
    }
    function dongNhom(g) {
        var sub = g.querySelector(':scope > .ums-nav__sub');
        ums.ui.truot(sub, false, function () {
            g.classList.remove('is-open');
            // nhóm con bên trong cũng đóng lại để lần mở sau bắt đầu gọn
            g.querySelectorAll('.ums-nav__group.is-open').forEach(function (x) { x.classList.remove('is-open'); });
            if (ums.scroll) ums.scroll.refresh('#navScroll');
        });
    }

    function navIcon(n) {
        var t = (n.icon || '').trim();
        if (!t) return 'fa-light fa-circle-dot';
        return ums.iconFA4 ? ums.iconFA4(t) : t.replace(/^fa\s+/, 'fa-light ');
    }
    /* Lưới an toàn: glyph rỗng (tên không có trong FA7) → fa-circle-dot. Chạy sau khi vẽ menu. */
    function veIconThieu(host) {
        if (!host || !global.getComputedStyle) return;
        host.querySelectorAll('i.ums-nav__icon').forEach(function (i) {
            var c = global.getComputedStyle(i, '::before').content;
            if (!c || c === 'none' || c === 'normal' || c === '""') i.className = 'ums-nav__icon fa-light fa-circle-dot';
        });
    }

    function href(chucNangId) {
        return '#/r/' + state.roleId + '/' + chucNangId;
    }

    function markNav(chucNangId) {
        elNav.querySelectorAll('[data-cn]').forEach(function (a) {
            var on = a.getAttribute('data-cn') === chucNangId;
            a.classList.toggle('is-active', on);
            if (!on) return;
            // Mở mọi nhóm cha, không chỉ nhóm gần nhất (menu có thể sâu nhiều tầng)
            var g = a.closest('.ums-nav__group');
            while (g) {
                g.classList.add('is-open');
                g = g.parentNode && g.parentNode.closest ? g.parentNode.closest('.ums-nav__group') : null;
            }
        });
    }

    function filterNav(q) {
        q = noAccent((q || '').trim());
        var any = false;

        elNav.querySelectorAll('.ums-nav__group').forEach(function (g) {
            var hit = 0;
            g.querySelectorAll('.ums-nav__link').forEach(function (a) {
                var ok = !q || noAccent(a.textContent).indexOf(q) >= 0;
                a.style.display = ok ? '' : 'none';
                if (ok) hit++;
            });
            var headHit = noAccent(g.querySelector('.ums-nav__label').textContent).indexOf(q) >= 0;
            var show = !q || hit > 0 || headHit;
            g.style.display = show ? '' : 'none';
            if (show) any = true;
            if (q && hit) g.classList.add('is-open');
        });

        elNav.querySelectorAll('.ums-nav__single').forEach(function (a) {
            var ok = !q || noAccent(a.textContent).indexOf(q) >= 0;
            a.style.display = ok ? '' : 'none';
            if (ok) any = true;
        });

        var old = elNav.querySelector('.ums-nav__empty');
        if (old) old.remove();
        if (!any) {
            elNav.insertAdjacentHTML('beforeend',
                '<div class="ums-nav__empty">Không có chức năng nào khớp.</div>');
        }
        if (ums.scroll) ums.scroll.refresh('#navScroll');
    }

    /* =====================================================================
       Trang chủ — lưới vai trò
       ===================================================================== */
    var filter = { key: 'all', q: '' };

    /* Thanh "Vai trò" đầu cột trái (thay ô tìm chức năng cũ — người dùng 2026-09-26): cho biết đang ở vai trò nào */
    function datVaiTro(role) {
        var bar = el('roleBar');
        if (!bar) return;
        el('roleBarName').textContent = role ? role.name : 'Chưa chọn vai trò';
        el('roleBarIcon').className = (role && role.icon) || 'fa-light fa-user-shield';
        bar.classList.toggle('is-trong', !role);
        bar.title = role ? 'Đang dùng vai trò: ' + role.name : 'Chọn một vai trò ở trang chủ';
        var gi = el('gSearchInput');
        if (gi) gi.placeholder = role ? 'Tìm màn trong vai trò này, rồi mọi vai trò…' : 'Tìm màn hình trong mọi vai trò…';
    }

    function renderHome() {
        if (ums.thuVai) ums.thuVai.bo();
        datVaiTro(null);
        state.roleId = '';
        state.chucNangId = '';
        state.tree = [];
        renderNav();

        elContent.innerHTML =
            '<div class="ums-page">' +
            '  <div class="ums-page__greet">' + greet() + '</div>' +
            '  <h1 class="ums-page__title">' + esc(T('roleTitle', 'Danh sách vai trò')) + '</h1>' +
            '  <div class="ums-searchline">' +
            '    <div class="ums-searchbar">' +
            '      <span class="ums-searchbar__icon"><i class="fa-light fa-magnifying-glass"></i></span>' +
            '      <input class="ums-searchbar__input" id="roleSearch" type="text" autocomplete="off" placeholder="' +
                     esc(T('roleSearchPlaceholder', 'Tìm vai trò...')) + '">' +
            '      <button type="button" class="ums-searchbar__clear" id="roleClear" title="Xoá tìm kiếm">' +
            '        <i class="fa-light fa-xmark"></i></button>' +
            '    </div>' +
            '    <div class="ums-searchline__count" id="roleCount"></div>' +
            '  </div>' +
            '  <div id="roleChips"></div>' +
            '  <div id="roleList"></div>' +
            '  <div id="lbTong" class="ums-u-mt-5"></div>' +
            '</div>';
        lbVeNutTong();

        /* Vẽ lại trang chủ (vào vai trò rồi quay ra) vẫn giữ từ khoá đang lọc → điền lại vào ô,
           không để ô trống mà danh sách vẫn đang lọc theo chữ cũ. */
        el('roleSearch').value = filter.q;
        el('roleSearch').addEventListener('input', function () { filter.q = this.value; drawRoles(); });
        el('roleClear').addEventListener('click', function () {
            filter.q = ''; el('roleSearch').value = ''; drawRoles();
        });
        el('roleChips').addEventListener('click', function (e) {
            var b = e.target.closest('[data-chip]');
            if (!b) return;
            filter.key = b.getAttribute('data-chip');
            drawChips();
            drawRoles();
        });

        if (state.roles.length) { drawChips(); drawRoles(); return; }

        el('roleList').innerHTML = '<div class="ums-panel"><div class="ums-panel__body">' +
            '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>' +
            esc(T('loading', 'Đang tải…')) + '</div></div></div>';

        loadRoles()
            .then(function (rows) {
                if (!rows.length && taiLaiMotLan()) return;
                state.roles = rows;
                drawChips();
                drawRoles();
                // Tab mở từ màn cán bộ để thủ vai một SV (localStorage.pendingThuVaiSV)
                var tu = ums.thuVai && ums.thuVai.tuDong(rows);
                if (tu) tu.then(function (x) { location.hash = '#/r/' + x.role.id; }).catch(function () {});
            })
            .catch(function (err) {
                if (taiLaiMotLan()) return;
                el('roleList').innerHTML = '<div class="ums-panel"><div class="ums-panel__body">' +
                    ums.ui.fail(err.message, 'data-do="reload-roles"') + '</div></div>';
                ums.api.handle(err, 'loadRoles');
            });
    }

    /* =====================================================================
       Tải lại ĐÚNG MỘT LẦN khi lần đầu không lấy được vai trò
       ---------------------------------------------------------------------
       Ngay sau khi đăng nhập, lần tải đầu tiên đôi khi trả về danh sách vai
       trò rỗng hoặc lỗi (phiên máy chủ vừa tạo, blob chưa kịp dùng được) —
       bấm F5 là lên bình thường. Ở đây tự làm thay người dùng, nhưng chỉ một
       lần cho mỗi phiên: cờ nằm trong sessionStorage nên không bao giờ có
       chuyện tải lại vòng tròn; người không được cấp vai trò nào thì lần hai
       vẫn hiện đúng thông báo rỗng.
       ===================================================================== */
    function taiLaiMotLan() {
        try {
            if (sessionStorage.getItem('ums.taiLaiVaiTro')) return false;
            sessionStorage.setItem('ums.taiLaiVaiTro', '1');
        } catch (e) { return false; }
        location.reload();
        return true;
    }

    function greet() {
        var name = esc(state.user);
        if (!CFG.greeting) return 'Xin chào, <b>' + name + '</b>!';
        return esc(CFG.greeting(state.user)).replace(name, '<b>' + name + '</b>');
    }

    function groups() {
        return (CFG.roleGroups || []).filter(function (g) {
            return state.roles.some(function (r) { return r.group === g.key; });
        });
    }

    function drawChips() {
        var list = [{ key: 'all', label: 'Tất cả', count: state.roles.length }].concat(
            groups().map(function (g) {
                return {
                    key: g.key, label: g.name,
                    count: state.roles.filter(function (r) { return r.group === g.key; }).length
                };
            })
        );
        el('roleChips').innerHTML = ums.ui.chips(list, filter.key);
    }

    function drawRoles() {
        var q = noAccent(filter.q.trim());
        var rows = state.roles.filter(function (r) {
            if (filter.key !== 'all' && r.group !== filter.key) return false;
            if (q && noAccent(r.name).indexOf(q) < 0 && noAccent(r.code).indexOf(q) < 0) return false;
            return true;
        });

        el('roleCount').textContent = rows.length + ' / ' + state.roles.length + ' ' + T('roleUnit', 'vai trò');

        if (!rows.length) {
            el('roleList').innerHTML = '<div class="ums-panel"><div class="ums-panel__body">' +
                ums.ui.empty(T('emptyRole', 'Không tìm thấy vai trò nào'), 'fa-magnifying-glass') +
                '</div></div>';
            return;
        }

        el('roleList').innerHTML = groups().map(function (g) {
            var items = rows.filter(function (r) { return r.group === g.key; });
            if (!items.length) return '';
            return '<div class="ums-section">' +
                '<span class="ums-section__name">' + esc(g.name) + '</span>' +
                '<span class="ums-section__count">(' + items.length + ')</span></div>' +
                '<div class="ums-grid ums-grid--cards">' +
                items.map(function (r) {
                    return ums.ui.tile({
                        name: r.name, group: g.name, icon: r.icon,
                        tone: g.tone, href: '#/r/' + r.id
                    });
                }).join('') + '</div>';
        }).join('');
    }

    /* =====================================================================
       Tìm MÀN HÌNH trong mọi vai trò — ô tìm trên thanh trên (người dùng 2026-09-26)
       ---------------------------------------------------------------------
       ĐANG Ở MỘT VAI TRÒ: lọc cây menu trái (như ô "Tìm kiếm chức năng" cũ — đã bỏ, cột trái nay hiện tên
       vai trò) và thả xuống các màn của vai trò đó TRƯỚC; không có màn khớp (hoặc bấm "Tìm trong mọi vai trò")
       mới tìm toàn bộ. Ở trang chủ: tìm toàn bộ ngay. (2026-09-26 sau: tối đa 3 dòng vai trò đang dùng, tô màu,
       ngay dưới ~5 dòng vai trò khác; dòng phụ chỉ còn tên vai trò — nhóm menu đã thấy ở cây trái.)
       Danh sách toàn bộ: nạp danh sách vai trò (loadRoles) rồi cây chức năng của TỪNG vai trò
       (loadMenu = LayDSChucNangNguoiDung — đúng những màn người dùng được cấp), 4 vai trò cùng lúc,
       kết quả hiện dần trong lúc nạp. Nhớ trong sessionStorage theo người dùng (F5 không nạp lại).
       Chỉ lấy mục có DUONGDANFILE (màn thật, bỏ nhóm menu). Gõ không dấu cũng khớp; mọi từ phải
       có mặt trong tên màn / tên nhóm / tên vai trò. Mỗi kết quả: tên màn + dòng nhỏ "vai trò · nhóm".
       Bấm (hoặc ↑ ↓ Enter) → #/r/<vai trò>/<chức năng> — vai trò thủ vai sẽ hỏi chọn người học như thường.
       Ctrl K (hoặc /) để nhảy vào ô.
       ===================================================================== */
    var TM = { ds: null, dang: null, xong: 0, tong: 0, chon: -1, kq: [] };

    /* Màn của vai trò ĐANG MỞ (state.menu) — cùng dạng với danh sách toàn bộ */
    function tmTrongVaiTro() {
        if (!state.roleId || !state.menu || !state.menu.length) return [];
        var role = state.roles.find(function (r) { return r.id === state.roleId; }) || { name: '' };
        var byId = {}, out = [];
        state.menu.forEach(function (n) { byId[n.id] = n; });
        state.menu.forEach(function (n) {
            if (!n.path || String(n.hash || '').toLowerCase() === '#dashboard') return;
            var nhom = [], p = byId[n.parent], vong = 0;
            while (p && vong++ < 8) { nhom.unshift(p.name); p = byId[p.parent]; }
            out.push({ r: state.roleId, rn: role.name, id: n.id, n: n.name, g: nhom.join(' › '),
                       k: noAccent(n.name + ' ' + nhom.join(' ')), tai: true });
        });
        return out;
    }

    function tmKhoa() { return 'ums.timMan.' + ((ums.session && ums.session.userId) || state.user || '') + '.' + state.mode; }

    function tmNap() {
        if (TM.ds && !TM.dang) return Promise.resolve(TM.ds);
        if (TM.dang) return TM.dang;
        try {
            var c = JSON.parse(sessionStorage.getItem(tmKhoa()) || 'null');
            if (c && c.v === 4 && Array.isArray(c.ds)) { TM.ds = c.ds; TM.xong = TM.tong = c.tong || 0; return Promise.resolve(TM.ds); }
        } catch (e) { /* sessionStorage có thể bị chặn */ }
        TM.ds = [];
        TM.dang = (state.roles.length ? Promise.resolve(state.roles) : loadRoles().then(function (r) { state.roles = r; return r; }))
            .then(function (roles) {
                TM.tong = roles.length; TM.xong = 0;
                var i = 0;
                function mot() {
                    if (i >= roles.length) return Promise.resolve();
                    var role = roles[i++];
                    return loadMenu(role.id).then(function (list) {
                        var byId = {};
                        list.forEach(function (n) { byId[n.id] = n; });
                        list.forEach(function (n) {
                            if (!n.path || String(n.hash || '').toLowerCase() === '#dashboard') return;
                            var nhom = [], p = byId[n.parent], vong = 0;
                            while (p && vong++ < 8) { nhom.unshift(p.name); p = byId[p.parent]; }
                            var mm = { r: role.id, rn: role.name, id: n.id, n: n.name, g: nhom.join(' › '), p: String(screenUrl(n) || '').toLowerCase(),
                                       k: noAccent(n.name + ' ' + nhom.join(' ') + ' ' + role.name) };
                            var kq = lbKhoa(n);
                            if (kq) mm.q = kq;               // màn có mục lỗi backend trong sổ → nhớ khoá để dựng bảng tổng
                            TM.ds.push(mm);
                        });
                    }).catch(function () { /* vai trò lỗi menu: bỏ qua, không chặn cả danh sách */ })
                      .then(function () { TM.xong++; tmVe(); return mot(); });
                }
                return Promise.all([mot(), mot(), mot(), mot()]);
            })
            .then(function () {
                TM.dang = null;
                try { sessionStorage.setItem(tmKhoa(), JSON.stringify({ v: 4, ds: TM.ds, tong: TM.tong })); } catch (e) {}
                tmVe();
                return TM.ds;
            }, function (err) { TM.dang = null; TM.ds = null; throw err; });
        return TM.dang;
    }

    /* Tô đậm phần khớp — so không dấu; chỉ tô khi bỏ dấu không đổi độ dài chuỗi (chữ dựng sẵn NFC) */
    function tmDanh(ten, tu) {
        var s = String(ten || ''), khong = noAccent(s), dau = [];
        tu.forEach(function (w) {
            var i = khong.indexOf(w);
            if (i >= 0) dau.push([i, i + w.length]);
        });
        if (!dau.length || khong.length !== s.length) return esc(s);
        dau.sort(function (a, b) { return a[0] - b[0]; });
        var out = '', vt = 0;
        dau.forEach(function (d) {
            if (d[0] < vt) return;
            out += esc(s.slice(vt, d[0])) + '<mark>' + esc(s.slice(d[0], d[1])) + '</mark>';
            vt = d[1];
        });
        return out + esc(s.slice(vt));
    }

    function tmVe() {
        var list = el('gSearchList'), inp = el('gSearchInput');
        if (!list || !inp || (document.activeElement !== inp && list.hidden)) return;
        var q = noAccent(inp.value.trim());
        if (state.roleId) filterNav(inp.value);   // lọc luôn cây menu bên trái như ô tìm cũ
        var trongVT = state.roleId ? tmTrongVaiTro() : [];
        var dangNap = TM.dang ? '<div class="ums-gsearch__state"><i class="fa-light fa-spinner fa-spin"></i> Đang nạp danh sách màn… ' +
            TM.xong + '/' + (TM.tong || '?') + ' vai trò</div>' : '';
        if (!q) {
            TM.kq = [];
            list.innerHTML = '<div class="ums-gsearch__state">' + (state.roleId
                ? 'Gõ tên màn — màn của vai trò đang dùng hiện trước (tô màu), bên dưới là các vai trò khác.'
                : 'Gõ tên màn hình — ví dụ "hóa đơn", "nhap diem"… để tìm trong mọi vai trò.') + '</div>';
            list.hidden = false;
            return;
        }
        var tu = q.split(/\s+/).filter(Boolean);
        function khop(x) { return tu.every(function (w) { return x.k.indexOf(w) >= 0; }); }
        /* Khớp ở TÊN MÀN xếp trước khớp ở nhóm / vai trò; cùng hạng thì tên ngắn trước */
        function xep(a, b) {
            var ha = tu.every(function (w) { return noAccent(a.n).indexOf(w) >= 0; }) ? 0 : 1;
            var hb = tu.every(function (w) { return noAccent(b.n).indexOf(w) >= 0; }) ? 0 : 1;
            return ha - hb || a.n.length - b.n.length || a.n.localeCompare(b.n, 'vi');
        }
        /* Người dùng 2026-09-26: vai trò ĐANG DÙNG tô màu, tối đa 3 dòng; ngay dưới khoảng 5 dòng của các vai trò
           khác (không phải bấm thêm). Không có dòng nào của vai trò đang dùng thì phần mọi vai trò hiện nhiều hơn. */
        var tai = trongVT.filter(khop).sort(xep);
        var taiHien = tai.slice(0, 3);
        if (TM.ds === null && !TM.dang) tmNap().then(tmVe, function (err) { ums.api.handle(err, 'tìm màn hình'); });
        var ngoai = (TM.ds || []).filter(function (x) { return x.r !== state.roleId && khop(x); }).sort(xep);
        var ngoaiHien = ngoai.slice(0, taiHien.length ? 5 : 50);
        TM.kq = taiHien.concat(ngoaiHien);
        if (TM.chon >= TM.kq.length) TM.chon = TM.kq.length - 1;

        function dong(x, i) {
            return '<button type="button" class="ums-gsearch__item' + (x.tai ? ' is-tai' : '') + (i === TM.chon ? ' is-active' : '') +
                '" data-i="' + i + '" role="option">' +
                '<span class="ums-gsearch__ten">' + tmDanh(x.n, tu) + '</span>' +
                '<span class="ums-gsearch__sub"><i class="fa-light fa-user-shield"></i> ' + esc(x.rn) +
                (x.tai ? ' <span class="ums-gsearch__dang">đang dùng</span>' : '') + '</span></button>';
        }
        var html = TM.kq.map(dong).join('');
        var conTai = tai.length - taiHien.length, conNgoai = ngoai.length - ngoaiHien.length;
        if (conTai > 0) {
            /* còn màn của vai trò đang dùng: đã hiện đủ ở cây menu bên trái (đã lọc) */
            var cat = taiHien.map(dong).join('');
            html = cat + '<div class="ums-gsearch__state ums-gsearch__state--tai">+ ' + conTai + ' màn nữa của vai trò này — xem ở cây menu bên trái</div>' +
                html.slice(cat.length);
        }
        if (!TM.kq.length) html = TM.dang ? '' : '<div class="ums-gsearch__state">Không có màn nào khớp "' + esc(inp.value.trim()) + '".</div>';
        if (conNgoai > 0) html += '<div class="ums-gsearch__state">… còn ' + conNgoai + ' màn ở vai trò khác, gõ thêm để thu hẹp</div>';
        list.innerHTML = html + dangNap;
        list.hidden = false;
    }

    function tmMo(x) {
        var inp = el('gSearchInput');
        el('gSearchList').hidden = true;
        inp.value = ''; inp.blur();
        if (state.roleId) filterNav('');
        location.hash = '#/r/' + encodeURIComponent(x.r) + '/' + encodeURIComponent(x.id);
    }

    function timMan() {
        var inp = el('gSearchInput'), list = el('gSearchList');
        if (!inp || !list) return;
        inp.addEventListener('focus', function () {
            tmVe();
            if (!state.roleId) tmNap().then(tmVe, function (err) {
                list.innerHTML = '<div class="ums-gsearch__state">Không nạp được danh sách màn.</div>';
                ums.api.handle(err, 'tìm màn hình');
            });
        });
        inp.addEventListener('input', function () { TM.chon = 0; tmVe(); });
        inp.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                if (!TM.kq.length) return;
                TM.chon = (TM.chon + (e.key === 'ArrowDown' ? 1 : -1) + TM.kq.length) % TM.kq.length;
                tmVe();
                var a = list.querySelector('.is-active');
                if (a) a.scrollIntoView({ block: 'nearest' });
            } else if (e.key === 'Enter') {
                e.preventDefault();
                /* Gõ nhanh rồi Enter khi danh sách còn đang nạp: chờ nạp xong, lọc lại rồi mở kết quả đầu */
                (TM.kq.length ? Promise.resolve() : tmNap()).then(function () {
                    tmVe();
                    var x = TM.kq[TM.chon >= 0 ? TM.chon : 0];
                    if (x) tmMo(x);
                }, function () {});
            } else if (e.key === 'Escape') {
                list.hidden = true; inp.value = ''; if (state.roleId) filterNav(''); inp.blur();
            }
        });
        list.addEventListener('mousedown', function (e) { e.preventDefault(); });   // giữ focus tới lúc bấm xong
        list.addEventListener('click', function (e) {
            var b = e.target.closest('[data-i]');
            var x = b && TM.kq[Number(b.getAttribute('data-i'))];
            if (x) tmMo(x);
        });
        inp.addEventListener('blur', function () { setTimeout(function () { list.hidden = true; }, 120); });
        document.addEventListener('keydown', function (e) {
            var t = e.target, dangGo = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
            if (((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) || (e.key === '/' && !dangGo)) {
                e.preventDefault(); inp.focus(); inp.select();
            }
        });
    }

    /* =====================================================================
       Chọn vai trò
       ===================================================================== */
    function openRole(roleId, chucNangId) {
        var role = state.roles.find(function (r) { return r.id === roleId; });

        function go() {
            role = state.roles.find(function (r) { return r.id === roleId; });
            if (!role) { location.hash = '#/'; return; }

            /* Vai trò CHOPHEPTHUVAI = 1: phải chọn người học trước (hộp "Nhập thông tin
               định danh"); đã chọn trong tab này thì giữ (F5, chuyển chức năng). Đóng hộp
               mà chưa chọn thì về trang chủ. Vai trò thường: rời vai nếu đang thủ vai. */
            var TV = ums.thuVai;
            if (TV && role.thuVai) {
                var tv = TV.hienTai(roleId);
                if (!tv) {
                    TV.bo();
                    TV.chon(role).then(function (x) { TV.ap(x); vao(); }).catch(function () { location.hash = '#/'; });
                    return;
                }
                TV.ap(tv);
            } else if (TV && TV.hienTai()) TV.bo();
            vao();
        }

        function vao() {
            state.roleId = roleId;
            datVaiTro(role);

            loadMenu(roleId)
                .then(function (list) {
                    state.menu = list;
                    state.tree = buildTree(list);
                    renderNav();
                    if (chucNangId) openFunction(chucNangId);
                    else veTrangVaiTro(role);
                })
                .catch(function (err) {
                    elNav.innerHTML = '<div class="ums-nav__empty">Không tải được danh sách chức năng.</div>';
                    elContent.innerHTML = '<div class="ums-page"><div class="ums-panel"><div class="ums-panel__body">' +
                        ums.ui.fail(err.message, 'data-do="reload-menu"') + '</div></div></div>';
                    ums.api.handle(err, 'loadMenu');
                });
        }

        // Vào thẳng bằng đường dẫn sâu thì phải nạp danh sách vai trò trước
        if (!state.roles.length) {
            loadRoles().then(function (rows) { state.roles = rows; go(); })
                       .catch(function (err) { ums.api.handle(err, 'loadRoles'); location.hash = '#/'; });
        } else {
            go();
        }
    }

    /* Mở chức năng theo ĐƯỜNG DẪN TỆP — thay edu.system.initMain('#x', '/modules/…/html/x.html')
       của các nút nhảy màn (vd "Kê khai" ở phiếu đánh giá). Tìm trong cây chức
       năng của vai trò đang mở; vai trò không được cấp chức năng đó thì báo. */
    ums.app = ums.app || {};
    ums.app.openPath = function (path) {
        var want = String(path || '').toLowerCase().replace(/^\/+/, '');
        var cn = (state.menu || []).find(function (c) {
            var p = String(c.path || '').toLowerCase().replace(/^\/+/, '');
            return p && (p === want || p.slice(-want.length) === want);
        });
        if (!cn) { ums.ui.toast('Vai trò đang mở chưa được cấp chức năng này (' + path + ')', 'warn'); return false; }
        location.hash = href(cn.id);
        return true;
    };

    /* Mở chức năng theo MÃ HIỂN THỊ (DUONGDANHIENTHI, vd "#tintuc") — thay
       edu.system.triggerChucNang_MaHienThi (Core/systemroot.js:6514). */
    ums.app.openHash = function (ma) {
        var cn = (state.menu || []).find(function (c) { return c.hash && c.hash === ma; });
        if (!cn) { ums.ui.toast('Vai trò đang mở chưa được cấp chức năng này (' + ma + ')', 'warn'); return false; }
        location.hash = href(cn.id);
        return true;
    };
    /* Tìm màn theo ĐUÔI đường dẫn (đầy đủ, có tiền tố phân hệ như screenUrl — vd 'apiscms/modules/danhmuc/html/danhmucdulieu.html'
       hoặc chỉ '/danhmuc/html/danhmucdulieu.html') cho khung "Cần làm trước" (lamtruoc.js). Trả Promise<mảng { r, rn, id, n, url, hash }>:
       màn của vai trò đang mở trước, sau đó chỉ mục mọi vai trò của ô tìm màn (nạp một lần mỗi phiên). Không kiểm tệp có trong _v2 —
       lamtruoc.js tự kiểm trước khi nhảy. */
    ums.app.timManTheoDuongDan = function (duoi) {
        var d = String(duoi || '').toLowerCase().replace(/^\/+/, '');
        function khop(p) { p = String(p || '').toLowerCase().replace(/^\/+/, ''); return p && (p === d || p.slice(-d.length) === d); }
        var role = (state.roles || []).find(function (r) { return r.id === state.roleId; }) || {};
        var kq = (state.menu || []).filter(function (c) { return khop(screenUrl(c)); }).map(function (c) {
            return { r: state.roleId, rn: role.name || '', id: c.id, n: c.name, url: screenUrl(c), hash: href(c.id) };
        });
        return tmNap().then(function (all) {
            (all || []).forEach(function (m) {
                if (m.r === state.roleId || !khop(m.p)) return;
                kq.push({ r: m.r, rn: m.rn, id: m.id, n: m.n, url: m.p, hash: '#/r/' + encodeURIComponent(m.r) + '/' + encodeURIComponent(m.id) });
            });
            return kq;
        }, function () { return kq; });
    };
    /** Đường dẫn hash mở một chức năng theo id — cho thẻ <a> (lối tắt ở bảng điều khiển) */
    ums.app.hrefChucNang = function (id) { return href(id); };

    /* Mục "Soạn bài hướng dẫn" (menu người dùng, chrome.js) có hiện không —
       theo site.config.js help.sso.roles so với mã vai trò (MAUNGDUNG) của
       người đang đăng nhập. Danh sách vai trò lấy từ state.roles, chưa có
       (vào thẳng #/r/… bằng F5) thì nạp một lần. */
    var soanBaiKq = null;
    ums.app.soanBaiChoPhep = function () {
        var sso = (CFG.help && CFG.help.sso) || {}, cho = sso.roles || [];
        if (!sso.page || !cho.length) return Promise.resolve(false);
        if (cho.indexOf('*') >= 0) return Promise.resolve(true);
        if (soanBaiKq) return soanBaiKq;
        soanBaiKq = (state.roles.length ? Promise.resolve(state.roles) : loadRoles().then(function (r) { state.roles = r; return r; }))
            .then(function (rows) {
                return rows.some(function (r) { return cho.indexOf(r.code) >= 0; });
            });
        soanBaiKq.catch(function () { soanBaiKq = null; });
        return soanBaiKq;
    };

    /* Xuất MAPPING chức năng (màn Cài đặt, nút "Xuất mapping" — 2026-09-26). Danh mục Function ID chuẩn để nạp vào
       Cổng Help (tài liệu _v2/docs: STR-03 / STR-05 import danh mục chức năng, HELP-08 / CTX-01 mapping Function ID ↔ bài
       Help) và để theo dõi chuyển đổi (cờ `converted`).
       NGUỒN = TOÀN BỘ CSDL (người dùng: "phải lấy đủ trong csdl vì sẽ phải chuyển hết"), KHÔNG theo menu của tài khoản:
       CMS_QuanLyNguoiDung_MH · pkg_chung_quanlynguoidung.LayDanhSachUngDung → với TỪNG ứng dụng LayDanhSachChucNang
       (đúng lời gọi của màn Quản trị → Chức năng, ApisCMS/chucnang). Tài khoản xuất phải có quyền gọi hai thủ tục đó.
       Chế độ dựng thử: không có CSDL → lấy cây menu mẫu của mọi vai trò (source "demo").
       converted: tệp màn đã có trong _v2 chưa (GET đúng đường dẫn vỏ nạp — screenUrl). onTienDo(chữ). */
    ums.app.xuatMapping = function (onTienDo) {
        var tien = onTienDo || function () {};
        var QL = 'CMS_QuanLyNguoiDung_MH/', PQ = 'pkg_chung_quanlynguoidung.';
        function rows(r) { var d = r && r.data; return Array.isArray(d) ? d : (d && d.rs) || []; }
        function chay(ds, soLuong, viec) {   // chạy viec(x) cho từng phần tử, soLuong việc cùng lúc
            var i = 0;
            function mot() { if (i >= ds.length) return Promise.resolve(); var x = ds[i++]; return Promise.resolve(viec(x)).then(mot, mot); }
            var h = []; for (var k = 0; k < soLuong; k++) h.push(mot());
            return Promise.all(h);
        }
        var loi = [];
        var KIEU_NET = /(^|\s)(fa-(solid|regular|light|thin|brands|duotone|sharp)|fa[srlbdt])(\s|$)/;
        function coGlyph(c) { return /(^|\s)fa-(?!(solid|regular|light|thin|brands|duotone|sharp)(\s|$))[a-z0-9-]+/.test(c); }
        function iconChuan(t) {
            var c = navIcon({ icon: t });
            if (!coGlyph(c)) return 'fa-light fa-circle-dot';   // rác kiểu "1111" → mặc định như menu _v2 (veIconThieu)
            return KIEU_NET.test(c) ? c : 'fa-light ' + c;
        }

        /* [1] Danh sách chức năng thô: { id, name, code, parent, path, hash, help, icon, order, desc, scope, app:{id,code,name} } */
        function napCSDL() {
            return ums.api.call({ action: QL + 'DSA4BSAvKRIgIikULyYFNC8m', func: PQ + 'LayDanhSachUngDung',
                strTuKhoa: '', pageIndex: 1, pageSize: 1000, dTrangThai: 1 }).then(function (r) {
                var apps = rows(r).map(function (a) { return { id: a.ID, code: a.MAUNGDUNG || a.MA || '', name: a.TENUNGDUNG || a.TEN || '' }; });
                var out = [], xong = 0;
                tien('Đang nạp chức năng 0/' + apps.length + ' ứng dụng…');
                return chay(apps, 4, function (app) {
                    return ums.api.call({ action: QL + 'DSA4BSAvKRIgIikCKTQiDyAvJgPP', func: PQ + 'LayDanhSachChucNang',
                        versionAPI: 'v1.0', strTuKhoa: '', strChung_UngDung_Id: app.id, strCHUCNANGCHA_Id: '',
                        pageIndex: 1, pageSize: 100000, strNGUONTRUYCAP_Id: '', dTrangThai: 1 }).then(function (r) {
                        rows(r).forEach(function (c) {
                            out.push({ id: c.ID, name: c.TENCHUCNANG || '', code: c.MACHUCNANG || '', parent: c.CHUCNANGCHA_ID || '',
                                path: c.DUONGDANFILE || '', hash: c.DUONGDANHIENTHI || '', help: c.DUONGDANHUONGDANSUDUNG || '',
                                icon: c.TENANH || '', order: Number(c.THUTU || c.THUTUHIENTHI || 0), desc: c.MOTA || '',
                                scope: c.TENDAYDU || '', app: { id: app.id, code: c.MAUNGDUNG || app.code, name: app.name } });
                        });
                    }, function (e) { loi.push({ applicationId: app.id, applicationName: app.name, error: String((e && e.message) || e) }); })
                      .then(function () { tien('Đang nạp chức năng ' + (++xong) + '/' + apps.length + ' ứng dụng…'); });
                }).then(function () { return { nguon: 'database', apps: apps, ds: out }; });
            });
        }
        function napMau() {
            return (state.roles.length ? Promise.resolve(state.roles) : loadRoles()).then(function (roles) {
                var seen = {}, out = [];
                return chay(roles, 4, function (role) {
                    return loadMenu(role.id).then(function (list) {
                        list.forEach(function (n) {
                            if (seen[n.id]) return;
                            seen[n.id] = 1;
                            out.push({ id: n.id, name: n.name, code: '', parent: n.parent || '', path: n.path, hash: n.hash, help: n.help,
                                icon: n.icon, order: n.order, desc: '', scope: '', app: { id: '', code: n.appCode, name: n.appCode } });
                        });
                    });
                }).then(function () { return { nguon: 'demo', apps: [], ds: out }; });
            });
        }

        return (state.mode === 'demo' ? napMau() : napCSDL()).then(function (kq) {
            var byId = {};
            kq.ds.forEach(function (n) { byId[n.id] = n; });
            var nhomMenu = [], fns = [];
            kq.ds.forEach(function (n) {
                var nhom = [], p = byId[n.parent], vong = 0;
                while (p && vong++ < 8) { nhom.unshift(p.name); p = byId[p.parent]; }
                if (!n.path) {   // nhóm menu (không mở màn) — để dựng lại cây Ứng dụng > Nhóm > Chức năng
                    nhomMenu.push({ groupId: n.id, code: n.code, name: n.name, parentId: n.parent || null, menuPath: nhom,
                        order: n.order, application: n.app.code });
                    return;
                }
                var url = screenUrl({ path: n.path, appCode: n.app.code }) || '';
                var ph = /(Apis[A-Za-z0-9]+)/.exec(url), md = /Modules\/([^\/]+)/i.exec(url);
                fns.push({
                    functionId: n.id,
                    code: n.code,
                    name: String(n.name || '').trim(),
                    application: { id: n.app.id, code: n.app.code, name: n.app.name },
                    subsystem: ph ? ph[1] : '',
                    module: md ? md[1] : '',
                    screen: (url.split('/').pop() || '').replace(/\.html?$/i, ''),
                    file: url,
                    route: n.hash,
                    parentId: n.parent || null,
                    menuPath: nhom,
                    order: n.order,
                    /* icon = ĐÚNG như _v2 vẽ (navIcon: FA4 "fa fa-x" → FA7, trống → mặc định; thêm kiểu nét khi chỉ có "fa-x")
                       — bên nhận dùng thẳng, không phải hiểu luật TENANH của hệ cũ. iconRaw = giá trị gốc trong CSDL. */
                    icon: iconChuan(n.icon),
                    iconRaw: n.icon,
                    /* vỏ CŨ mở chức năng này (CLAUDE.md mục 5: TENANH bắt đầu "fa " → indexi) */
                    legacyShell: String(n.icon || '').trim().indexOf('fa ') === 0 ? 'indexi.aspx' : 'index.aspx',   // vỏ cũ trim() trước khi so (Core:813, Corei:781)
                    helpUrl: n.help,
                    description: n.desc,
                    scope: n.scope,
                    converted: null
                });
            });
            /* [2] Đã chuyển sang _v2 chưa — GET đúng tệp vỏ nạp (serve.ps1 không nhận HEAD) */
            var xong = 0, hoi = {};
            tien('Đang kiểm màn đã chuyển 0/' + fns.length + '…');
            return chay(fns, 8, function (f) {
                if (!f.file || /^https?:/i.test(f.file)) { f.converted = false; return; }
                var h = hoi[f.file] || (hoi[f.file] = fetch(f.file + '?v=' + Date.now(), { cache: 'no-store' })
                    .then(function (r) { return r.ok; }, function () { return null; }));
                return h.then(function (ok) {
                    f.converted = ok;
                    if (++xong % 25 === 0 || xong === fns.length) tien('Đang kiểm màn đã chuyển ' + xong + '/' + fns.length + '…');
                });
            }).then(function () {
                /* Lỗi DỮ LIỆU của từng dòng (bảng chức năng trong CSDL) — đánh dấu ngay trong tệp để bên nhận lọc được,
                   việc sửa là của quản trị CSDL (màn Quản trị → Chức năng). */
                var demMa = {}, demRoute = {};
                fns.forEach(function (f) {
                    if (f.code) demMa[f.code] = (demMa[f.code] || 0) + 1;
                    if (f.route) { var kr = f.application.code + '|' + f.route; (demRoute[kr] = demRoute[kr] || {})[f.file.toLowerCase()] = 1; }
                });
                fns.forEach(function (f) {
                    var v = [];
                    if (f.code && demMa[f.code] > 1) v.push('code-trung');
                    if (!f.code) v.push('thieu-code');
                    if (!f.module || !/\.html?$/i.test(f.file)) v.push('duong-dan-file-khong-hop-le');
                    if (!f.route) v.push('thieu-route');
                    else if (Object.keys(demRoute[f.application.code + '|' + f.route]).length > 1) v.push('route-trung');
                    /* route-trung = HAI MÀN KHÁC NHAU (khác tệp) cùng ứng dụng cùng DUONGDANHIENTHI — vd lophocphan trỏ "#donlop" (bên Help
                       bắt 2026-09-27). Cùng một màn đặt ở hai chỗ trong menu, hay trùng giữa hai ứng dụng: bình thường (vỏ cũ chỉ tìm
                       route trong menu đang mở — triggerChucNang_MaHienThi). */
                    if (!String(f.iconRaw || '').trim()) v.push('icon-mac-dinh');
                    else if (!coGlyph(navIcon({ icon: f.iconRaw }))) v.push('icon-khong-hop-le');
                    f.dataIssues = v;
                });
                fns.sort(function (a, b) {
                    return a.subsystem.localeCompare(b.subsystem) || a.module.localeCompare(b.module) || a.name.localeCompare(b.name, 'vi');
                });
                var modules = {};
                fns.forEach(function (f) {
                    var k = (f.subsystem || f.application.code || '?') + '/' + (f.module || '?');
                    var m = modules[k] || (modules[k] = { moduleId: k, subsystem: f.subsystem, module: f.module, functionCount: 0, converted: 0 });
                    m.functionCount++;
                    if (f.converted) m.converted++;
                });
                var daChuyen = fns.filter(function (f) { return f.converted; }).length;
                return {
                    schema: 'ums-help-mapping/1',
                    purpose: 'Danh mục Function ID của hệ thống để nạp / đồng bộ vào Cổng Help (mapping chức năng ↔ bài Help theo ngữ cảnh) và theo dõi chuyển đổi giao diện',
                    application: { id: 'UMS', name: document.title || 'UMS', version: (ums.cfg && ums.cfg.brand && ums.cfg.brand.footer) || '' },
                    generatedAt: new Date().toISOString(),
                    generatedBy: (ums.session && ums.session.userId) || state.user || '',
                    source: kq.nguon,
                    note: kq.nguon === 'database'
                        ? 'Toàn bộ chức năng trong CSDL (mọi ứng dụng, dTrangThai = 1), không phụ thuộc quyền của tài khoản xuất. converted = tệp màn đã có trong _v2.'
                        : 'Chế độ dựng thử: lấy từ cây menu MẪU, KHÔNG phải CSDL — xuất lại trên host để có danh mục thật.',
                    counts: { applications: kq.apps.length, functions: fns.length, converted: daChuyen, notConverted: fns.length - daChuyen,
                              menuGroups: nhomMenu.length, modules: Object.keys(modules).length,
                              dataIssues: fns.reduce(function (o, f) { f.dataIssues.forEach(function (k) { o[k] = (o[k] || 0) + 1; }); return o; }, {}) },
                    applications: kq.apps,
                    modules: Object.keys(modules).sort().map(function (k) { return modules[k]; }),
                    menuGroups: nhomMenu,
                    functions: fns,
                    errors: loi
                };
            });
        });
    };

    /* =====================================================================
       Mở một chức năng
       ===================================================================== */
    function openFunction(chucNangId) {
        var cn = state.menu.find(function (c) { return c.id === chucNangId; });
        if (!cn) { notice('fa-circle-question', 'Không tìm thấy chức năng.'); return; }

        // Mục không gắn tệp (nhóm hoặc mục trang chủ) — không có gì để mở
        if (!cn.path) {
            state.chucNangId = '';
            markNav('');
            notice('fa-hand-pointer', 'Chọn một chức năng ở cột bên trái.', cn.name);
            return;
        }

        state.chucNangId = cn.id;
        markNav(cn.id);

        shell(cn, '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>' +
                  esc(T('loading', 'Đang tải…')) + '</div>');

        if (global.innerWidth <= 991) elApp.classList.remove('is-nav-open');

        var url = screenUrl(cn);
        var demo = state.mode === 'demo' ? demoScreen(cn.path) : null;
        var token = {};
        openFunction.token = token;
        if (ums.lamTruoc) ums.lamTruoc.batDau(el('screen'), url || cn.path, cn);   // khung "Cần làm trước": gom việc thiếu dữ liệu của màn này

        // Ưu tiên màn hình đã chuyển đổi nằm đúng cây thư mục gốc; màn hình
        // mẫu dữ liệu cứng chỉ dùng khi đang chạy dựng thử.
        fetchScreen(url)
            .then(function (hit) {
                if (hit) return hit;
                return demo ? fetchScreen('screens/' + demo + '.html') : null;
            })
            .then(function (hit) {
                if (openFunction.token !== token) return;   // người dùng đã bấm sang chức năng khác
                if (!hit) { notConverted(cn, url); return; }
                return Promise.resolve(inject(el('screen'), hit.html, hit.url)).then(function () {
                    // Ẩn/khoá trường theo cấu hình của chức năng, sau khi
                    // màn hình đã dựng xong (hệ cũ gọi trong genPath_ChucNang)
                    if (openFunction.token === token) { applyHidden(el('screen'), cn.hide); veCanQuyet(el('screen'), url, cn.name); }
                });
            })
            .catch(function (err) {
                if (openFunction.token !== token) return;
                /* In ĐƯỜNG DẪN ĐẦY ĐỦ để mở thẳng trên trình duyệt mà xem máy chủ
                   báo gì — lỗi 500 khi nạp tệp màn hình là chuyện của máy chủ
                   (IIS / web.config), đường dẫn tương đối không đủ để dò. */
                var full = url ? new URL(url, location.href).href : (cn.path || '');
                shell(cn, ums.ui.fail('Không nạp được ' + full + ' — ' + err.message));
            });
    }

    /* Đường dẫn tệp màn hình mới, soi gương đúng cây thư mục của dự án gốc.
       Hệ cũ nạp  <gốc>/<MAUNGDUNG><DUONGDANFILE>  (Core/systemroot.js:1002),
       vỏ mới nạp <gốc>/_v2/<MAUNGDUNG><DUONGDANFILE>. Ví dụ:
           MAUNGDUNG    ApisTaiChinh
           DUONGDANFILE /Modules/danhmucheso/html/hethonghoadon.html
           → _v2/ApisTaiChinh/Modules/danhmucheso/html/hethonghoadon.html */
    function screenUrl(cn) {
        var p = (cn.path || '').replace(/\\/g, '/').split('?')[0].trim();
        if (!p || /^https?:/i.test(p) || p.indexOf('..') >= 0) return null;
        p = p.replace(/^\/+/, '');
        var app = (cn.appCode || '').replace(/^\/+|\/+$/g, '');
        if (app && p.toLowerCase().indexOf(app.toLowerCase() + '/') !== 0) p = app + '/' + p;
        return p;
    }

    /**
     * Tải tệp màn hình. Trả null khi chưa có tệp (404), lỗi khác thì ném ra.
     *
     * THỬ LẠI MỘT LẦN khi không nhận được phản hồi nào ("Failed to fetch").
     * Loại lỗi này là chuyện nhất thời của kết nối — dấu hiệu rõ nhất: bấm sang
     * màn khác rồi quay lại là vào được, không phải thiếu tệp hay hỏng máy chủ.
     *
     * KHÔNG thử lại khi máy chủ ĐÃ trả lời (404, 500…): đó là lỗi thật, thử nữa
     * chỉ tốn thềm một lượt chờ rồi vẫn báo đúng lỗi đó.
     */
    function fetchScreen(url, lanHai) {
        if (!url) return Promise.resolve(null);
        return fetch(url + (url.indexOf('?') < 0 ? '?' : '&') + 'v=' + Date.now(), { cache: 'no-store' })
            .then(function (r) {
                if (r.status === 404) return null;
                if (!r.ok) {
                    var e = new Error('HTTP ' + r.status);
                    e.tuMayChu = true;          // máy chủ có trả lời — đừng thử lại
                    throw e;
                }
                return r.text().then(function (html) { return { url: url, html: html }; });
            })
            .catch(function (err) {
                if (err.tuMayChu || lanHai) throw err;
                return new Promise(function (xong) { setTimeout(xong, 400); })
                    .then(function () { return fetchScreen(url, true); });
            });
    }

    /** Màn hình mẫu dữ liệu cứng trong screens/ — chỉ dùng ở chế độ dựng thử */
    function demoScreen(path) {
        if (!path) return null;
        var map = API.demoScreens || {};
        var low = path.toLowerCase();
        var hit = Object.keys(map).find(function (k) { return low.indexOf(k.toLowerCase()) >= 0; });
        return hit ? map[hit] : null;
    }

    /* Nút "?" — link Hướng dẫn sử dụng của một chức năng (Cổng Help, cách A — 2026-09-26).
       1) site.config.js `help.url` có giá trị → ghép mẫu link với mã chức năng (ưu tiên, mọi màn);
       2) không thì link riêng trong CSDL (DUONGDANHUONGDANSUDUNG) — hệ cũ eval() chuỗi có "$" (Core:6525),
          ở đây KHÔNG chạy mã lấy từ CSDL, chỉ nhận đường dẫn / URL;
       3) không có gì → '' : vẫn vẽ "?" nhưng bấm thì báo đang xây dựng (người dùng: tạo sẵn "?" ở mọi màn). */
    function helpCfg() { return (ums.cfg && ums.cfg.help) || {}; }
    function helpLink(cn) {
        var H = helpCfg(), mau = String(H.url || '').trim();
        if (mau) {
            var tep = screenUrl(cn) || '';
            var ph = /(Apis[A-Za-z0-9]+)/.exec(tep), md = /Modules\/([^\/]+)/i.exec(tep);
            var gt = {
                functionId: cn.id, code: cn.code || '', app: H.app || '', version: H.version || '', lang: H.lang || '',
                subsystem: ph ? ph[1] : (cn.appCode || ''), module: md ? md[1] : '',
                screen: (tep.split('/').pop() || '').replace(/\.html?$/i, '')
            };
            return mau.replace(/\{(\w+)\}/g, function (m, k) { return k in gt ? encodeURIComponent(gt[k]) : m; });
        }
        var rieng = String(cn.help || '').trim();
        return rieng && rieng.indexOf('$') < 0 ? rieng : '';
    }
    document.addEventListener('click', function (ev) {
        if (!ev.target.closest || !ev.target.closest('[data-help-cho]')) return;
        ums.ui.toast('Hướng dẫn sử dụng cho chức năng này đang được xây dựng trên Cổng Help.', 'info');
    });

    /* Khung chung: breadcrumb + chỗ đặt màn hình.
       Breadcrumb đi ngược theo CHUCNANGCHA_ID đủ mọi tầng, như
       getNameChucNang của hệ cũ (Core/systemroot.js:6555) — không chỉ một
       tầng cha. Nút "?" luôn hiện (Cổng Help — site.config.js `help`, xem helpLink). */
    function shell(cn, inner) {
        var chain = [], seen = {}, cur = cn;
        while (cur && !seen[cur.id]) {
            seen[cur.id] = true;
            chain.unshift(cur);
            cur = cur.parent ? state.menu.find(function (c) { return c.id === cur.parent; }) : null;
        }

        var crumbs = chain.map(function (c, i) {
            var last = i === chain.length - 1;
            return '<i class="ums-crumb__sep fa-light fa-angle-right"></i>' +
                (last ? '<span class="ums-crumb__cur">' + esc(c.name) + '</span>'
                      : '<span>' + esc(c.name) + '</span>');
        }).join('');

        var help = helpLink(cn);

        elContent.innerHTML =
            '<div class="ums-page">' +
            '  <nav class="ums-crumb">' +
            '    <a class="ums-crumb__link" href="#/"><i class="fa-light fa-house"></i>Bảng điều khiển</a>' +
            crumbs +
            (help ? '<a class="ums-crumb__help" href="' + esc(help) + '" target="' + esc(helpCfg().target || '_blank') + '" rel="noopener"' +
                    ' title="Hướng dẫn sử dụng"><i class="fa-light fa-circle-question"></i></a>'
                  : '<button type="button" class="ums-crumb__help is-cho" data-help-cho title="Hướng dẫn sử dụng (đang xây dựng)">' +
                    '<i class="fa-light fa-circle-question"></i></button>') +
            '  </nav>' +
            '  <div id="screen">' + inner + '</div>' +
            '</div>';
    }

    /* Khung "Cần quyết" ở đầu màn — sổ ums.canQuyet (assets/js/can-quyet.js). Tắt: behavior.canQuyet = false.
       Mỗi điểm có ô TRẢ LỜI (tình trạng + ghi chú), lưu ngay vào localStorage của trình duyệt
       (khoá TL_KHOA, mỗi câu = khoá màn + mã băm câu hỏi — sửa chữ câu hỏi thì câu trả lời cũ không
       gắn nhầm sang câu mới). Nút "Xuất tệp trả lời" gom MỌI màn đã trả lời thành một tệp .txt để gửi
       lại cho người chuyển đổi (cách A, người dùng chọn 2026-09-22 — không ghi gì lên máy chủ). */
    var TL_KHOA = 'ums.canQuyet.traLoi';
    var TL_HOI = [['', 'Chưa trả lời'], ['dongy', 'Đồng ý như hiện tại'], ['khac', 'Làm khác (ghi rõ bên cạnh)'], ['sau', 'Để sau']];
    var TL_KIEM = [['', 'Chưa kiểm'], ['ok', 'Đã kiểm — đúng'], ['loi', 'Đã kiểm — LỖI (ghi rõ)'], ['chua', 'Chưa kiểm được']];
    // Việc giao NGƯỜI KHÁC xử lý (mục có `ben` trong can-quyet.js), theo thứ tự hiện.
    // [khoá, tên nhóm, chữ trên huy hiệu, lớp màu]
    var TL_SUA = [['', 'Chưa xử lý'], ['dang', 'Đang xử lý'], ['xong', 'Đã khắc phục'], ['khong', 'Không phải lỗi (ghi rõ)']];
    var BEN = [
        ['oracle', 'Lỗi đã kiểm trên hệ thống thật — yêu cầu backend / CSDL xử lý', 'lỗi cần backend xử lý', 'is-loi'],
        ['nghiepvu', 'Nghiệp vụ Tài chính tự khai', 'việc nghiệp vụ', 'is-nv']
    ];
    function benTen(k) { var b = BEN.filter(function (x) { return x[0] === k; })[0]; return b ? b[1] : k; }
    function tlLua(x) { return x.ben ? TL_SUA : x.host ? TL_KIEM : TL_HOI; }
    function tlLoai(x) { return x.ben ? benTen(x.ben) : x.kiem || x.host ? 'Kiểm trên host' : 'Cần quyết'; }
    function tlDoc() { try { return JSON.parse(localStorage.getItem(TL_KHOA) || '{}') || {}; } catch (e) { return {}; } }
    function tlGhi(o) { try { localStorage.setItem(TL_KHOA, JSON.stringify(o)); return true; } catch (e) { return false; } }
    function tlBam(s) { var h = 0; s = String(s || ''); for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }
    function tlGio() {
        var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; };
        return p(d.getDate()) + '/' + p(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
    }
    // **…** trong câu của sổ = nhấn mạnh: khung trên màn in đậm, tệp .txt bỏ dấu
    function tlDam(q) { return esc(q).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'); }
    function tlTho(q) { return String(q || '').replace(/\*\*(.+?)\*\*/g, '$1'); }
    function tlNhan(ds, v) { var x = ds.filter(function (o) { return o[0] === v; })[0]; return x ? x[1] : v; }

    /** Tệp .txt đọc được bằng mắt + khối JSON ở cuối (để người chuyển đổi đọc lại chính xác) */
    function tlXuat() {
        var all = tlDoc(), keys = Object.keys(all).filter(function (k) { return all[k].tt || all[k].ghi; });
        if (!keys.length) { ums.ui.toast('Chưa có câu trả lời nào để xuất.', 'warn'); return; }
        var theoMan = {};
        keys.forEach(function (k) { var x = all[k]; (theoMan[x.khoa] = theoMan[x.khoa] || []).push(x); });
        var man = Object.keys(theoMan).sort();
        var t = 'GHI CHÚ CHUYỂN ĐỔI — CÂU TRẢ LỜI\r\n' +
            'Xuất lúc: ' + tlGio() + ' · Người xuất: ' + (state.user || '') + ' · Máy: ' + location.host + '\r\n' +
            'Tổng: ' + keys.length + ' câu đã trả lời trên ' + man.length + ' màn\r\n';
        man.forEach(function (m) {
            var ds = theoMan[m];
            t += '\r\n=== ' + m + (ds[0].ten ? '  (' + ds[0].ten + ')' : '') + '\r\n';
            ds.forEach(function (x) {
                t += '[' + tlLoai(x) + '] ' + tlTho(x.q) + '\r\n' +
                    (x.now ? '    Hiện tại: ' + x.now + '\r\n' : '') +
                    '    → ' + tlNhan(x.ben ? TL_SUA : x.kiem ? TL_KIEM : TL_HOI, x.tt || '') + (x.ghi ? ': ' + x.ghi : '') + '\r\n' +
                    '    (' + (x.nguoi || '') + ', ' + (x.luc || '') + ')\r\n';
            });
        });
        t += '\r\n---JSON---\r\n' + JSON.stringify(keys.map(function (k) { return all[k]; }), null, 1) + '\r\n';
        var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; };
        ums.ui.taiTep('ghi-chu-chuyen-doi_' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '_' + p(d.getHours()) + p(d.getMinutes()) + '.txt',
            'text/plain;charset=utf-8', '﻿' + t);
    }

    /** Tệp GỬI QUẢN LÝ — MỌI mục có `ben` trong sổ, kể cả chưa ai trả lời, kèm tình trạng đã ghi trên trình
        duyệt này. Viết cho người quản lý đọc: mở đầu nói rõ bối cảnh; mỗi việc ghi đường menu để mở ra xem;
        việc trùng chữ ở nhiều màn gộp làm một (liệt kê các màn). */
    /* Phần TỰ GHI câu lỗi máy chủ ("Lỗi máy chủ vừa gặp") ĐÃ BỎ (người dùng 2026-09-30, cuối ngày): lỗi nào người kiểm đã gặp và xác nhận thì
       viết thẳng thành mục `ben` trong can-quyet.js — nhóm "Lỗi đã kiểm … yêu cầu backend / CSDL xử lý". Dọn dữ liệu cũ của phần tự ghi. */
    try { localStorage.removeItem('ums.canQuyet.loiMayChu'); } catch (e) { /* trình duyệt chặn bộ nhớ cục bộ */ }

    function tlXuatViec() {
        var all = tlDoc(), S = ums.canQuyet || {}, nhom = {};
        BEN.forEach(function (b) { nhom[b[0]] = []; });
        Object.keys(S).sort().forEach(function (khoa) {
            S[khoa].forEach(function (x) {
                if (!x.ben || !nhom[x.ben]) return;
                var cu = all[khoa + '|' + tlBam(x.q)] || {};
                var co = nhom[x.ben].filter(function (y) { return y.q === x.q; })[0];
                if (co) { if (x.man && co.man.indexOf(x.man) < 0) co.man.push(x.man); if (!co.tt && cu.tt) { co.tt = cu.tt; co.ghi = cu.ghi || ''; } return; }
                nhom[x.ben].push({ man: [x.man || khoa], q: x.q, now: x.now || '', tt: cu.tt || '', ghi: cu.ghi || '' });
            });
        });
        var tong = BEN.reduce(function (n, b) { return n + nhom[b[0]].length; }, 0);
        var t = 'GỬI QUẢN LÝ CSDL — CÁC VIỆC CẦN XỬ LÝ TRÊN HỆ THỐNG ĐANG CHẠY\r\n' +
            'Ngày ' + tlGio() + ' · Người gửi: ' + (state.user || '') + ' · Hệ thống: ' + location.host + '\r\n\r\n' +
            'Giao diện mới đã được kiểm thử trực tiếp trên hệ thống thật (chỉ xem, không sửa dữ liệu). Các việc dưới đây\r\n' +
            'là thông tin chưa được khai hoặc lỗi CSDL — giao diện cũ cũng bị y hệt, không phải do giao diện mới.\r\n' +
            'Mỗi việc ghi rõ ai làm: "Anh:" là phần CSDL / cấu hình; "Nghiệp vụ Tài chính:" là phần phòng Tài chính\r\n' +
            'xác nhận hoặc tự khai. Việc nào không dùng thì báo lại để bỏ khỏi danh sách.\r\n' +
            'Phần trong ngoặc là chi tiết kỹ thuật (lời gọi, thủ tục, mã lỗi).\r\n' +
            'Tổng: ' + tong + ' việc.\r\n';
        var stt = 0;
        BEN.forEach(function (b) {
            var ds = nhom[b[0]];
            if (!ds.length) return;
            t += '\r\n==================== ' + b[1].toUpperCase() + ' (' + ds.length + ' việc)\r\n';
            ds.forEach(function (x) {
                t += '\r\n' + (++stt) + '. ' + tlTho(x.q) + '\r\n' +
                    '   Màn: ' + x.man.join('\r\n        ') + '\r\n' +
                    (x.now ? '   Hiện tại: ' + x.now + '\r\n' : '') +
                    '   Tình trạng: ' + tlNhan(TL_SUA, x.tt) + (x.ghi ? ' — ' + x.ghi : '') + '\r\n';
            });
        });
        var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; };
        ums.ui.taiTep('gui-quan-ly_viec-can-xu-ly_' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '_' + p(d.getHours()) + p(d.getMinutes()) + '.txt',
            'text/plain;charset=utf-8', '﻿' + t);
    }

    function veCanQuyet(host, url, ten, moSan) {
        if (!host || (CFG.behavior && CFG.behavior.canQuyet === false) || !ums.canQuyet) return;
        var khungCu = host.querySelector(':scope > .ums-canquyet');
        if (khungCu) { if (moSan === undefined) moSan = khungCu.open; khungCu.remove(); }
        var khoa = ums.canQuyetKhoa(url);
        var ds = ums.canQuyet[khoa] || [];
        if (!ds.length) return;
        var all = tlDoc();
        var hoi = ds.filter(function (x) { return !x.host && !x.ben; }), kiem = ds.filter(function (x) { return x.host && !x.ben; });
        var ben = BEN.map(function (b) { return { b: b, ds: ds.filter(function (x) { return x.ben === b[0]; }) }; })
            .filter(function (g) { return g.ds.length; });
        function ma(x) { return khoa + '|' + tlBam(x.q); }
        function li(x) {
            var k = ma(x), cu = all[k] || {}, lua = tlLua(x);
            return '<li>' + tlDam(x.q) + (x.now ? ' <span class="ums-canquyet__now">Hiện tại: ' + esc(x.now) + '</span>' : '') +
                '<div class="ums-canquyet__tl">' +
                '<select class="ums-select" data-no-s2 data-cq="' + esc(k) + '" aria-label="Tình trạng">' +
                lua.map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === (cu.tt || '') ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') +
                '</select>' +
                '<textarea class="ums-input" rows="1" data-cq-ghi="' + esc(k) + '" placeholder="Câu trả lời / ghi chú">' + esc(cu.ghi || '') + '</textarea>' +
                '</div></li>';
        }
        var d = document.createElement('details');
        d.className = 'ums-canquyet';
        d.innerHTML = '<summary><i class="fa-light fa-clipboard-question"></i><b>Ghi chú chuyển đổi</b>' +
            (hoi.length ? '<span class="ums-canquyet__so">' + hoi.length + ' điểm cần quyết</span>' : '') +
            (kiem.length ? '<span class="ums-canquyet__so is-kiem">' + kiem.length + ' điểm cần kiểm trên host</span>' : '') +
            ben.map(function (g) { return '<span class="ums-canquyet__so ' + g.b[3] + '">' + g.ds.length + ' ' + g.b[2] + '</span>'; }).join('') +
            '<span class="ums-canquyet__so is-tl" data-cq-dem></span></summary>' +
            (hoi.length ? '<div class="ums-canquyet__nhom">Cần nghiệp vụ quyết</div><ol>' + hoi.map(li).join('') + '</ol>' : '') +
            (kiem.length ? '<div class="ums-canquyet__nhom">Cần kiểm trên host</div><ol>' + kiem.map(li).join('') + '</ol>' : '') +
            ben.map(function (g) { return '<div class="ums-canquyet__nhom">' + esc(g.b[1]) + '</div><ol>' + g.ds.map(li).join('') + '</ol>'; }).join('') +
            '<div class="ums-canquyet__foot">' +
            '<span class="ums-canquyet__luu" data-cq-luu>Câu trả lời lưu ngay trên trình duyệt này (không gửi lên máy chủ).</span>' +
            ums.ui.btn('excel', { text: 'Xuất tệp trả lời (mọi màn)', icon: 'fa-file-arrow-down', cls: 'ums-btn--sm', attr: { 'data-cq-a': 'xuat' } }) +
            ums.ui.btn('excel', { text: 'Xuất tệp gửi quản lý (mọi màn)', icon: 'fa-file-arrow-down', cls: 'ums-btn--sm', attr: { 'data-cq-a': 'viec' } }) +
            ums.ui.btn('del', { text: 'Xoá mọi câu trả lời', mod: 'out-danger', cls: 'ums-btn--sm', attr: { 'data-cq-a': 'xoa' } }) +
            '</div>';
        if (moSan) d.open = true;
        host.insertBefore(d, host.firstChild);
        if (ums.lamTruoc) ums.lamTruoc.giuViTri();   // khung "Cần làm trước" luôn ngay dưới Ghi chú

        function dem() {
            var o = tlDoc(), n = ds.filter(function (x) { var v = o[ma(x)]; return v && (v.tt || v.ghi); }).length;
            var b = d.querySelector('[data-cq-dem]');
            if (!b) return;
            b.textContent = 'Đã trả lời ' + n + '/' + ds.length;
            b.classList.toggle('is-du', n === ds.length);
        }
        function luu(k) {
            var x = ds.filter(function (y) { return ma(y) === k; })[0];
            if (!x) return;
            var tt = d.querySelector('[data-cq="' + k + '"]').value, ghi = d.querySelector('[data-cq-ghi="' + k + '"]').value.trim();
            var o = tlDoc();
            if (!tt && !ghi) delete o[k];
            else o[k] = { khoa: khoa, ten: ten || '', q: x.q, now: x.now || '', kiem: !!x.host, ben: x.ben || '', tt: tt, ghi: ghi, nguoi: state.user || '', luc: tlGio() };
            var ok = tlGhi(o);
            d.querySelector('[data-cq-luu]').textContent = ok ? 'Đã lưu lúc ' + tlGio().slice(-5) + ' trên trình duyệt này.' : 'KHÔNG lưu được (trình duyệt chặn bộ nhớ cục bộ).';
            dem();
        }
        d.addEventListener('change', function (ev) {
            var k = ev.target.getAttribute('data-cq') || ev.target.getAttribute('data-cq-ghi');
            if (k) luu(k);
        });
        d.addEventListener('input', function (ev) {
            var k = ev.target.getAttribute('data-cq-ghi');
            if (!k) return;
            ev.target.style.height = 'auto';
            ev.target.style.height = ev.target.scrollHeight + 'px';
            clearTimeout(ev.target._t);
            ev.target._t = setTimeout(function () { luu(k); }, 400);
        });
        d.addEventListener('click', function (ev) {
            var a = ev.target.closest('[data-cq-a]');
            if (!a) return;
            if (a.getAttribute('data-cq-a') === 'xuat') { tlXuat(); return; }
            if (a.getAttribute('data-cq-a') === 'viec') { tlXuatViec(); return; }
            ums.ui.confirm('Xoá MỌI câu trả lời đã lưu trên trình duyệt này (tất cả các màn)? Nên xuất tệp trước.', { tone: 'bad', ok: 'Xoá hết' })
                .then(function (yes) {
                    if (!yes) return;
                    tlGhi({});
                    Array.prototype.forEach.call(d.querySelectorAll('[data-cq]'), function (s) { s.value = ''; });
                    Array.prototype.forEach.call(d.querySelectorAll('[data-cq-ghi]'), function (s) { s.value = ''; });
                    dem();
                    ums.ui.toast('Đã xoá mọi câu trả lời.', 'ok');
                });
        });
        dem();
    }

    /** Chức năng chưa chuyển sang giao diện mới */
    function notConverted(cn, url) {
        shell(cn,
            '<div class="ums-panel"><div class="ums-panel__body">' +
            '<div class="ums-empty">' +
            '<i class="fa-light fa-screwdriver-wrench"></i>' +
            '<div><b>' + esc(cn.name) + '</b> chưa chuyển sang giao diện mới.</div>' +
            '<div class="ums-u-fz13 ums-u-faint ums-u-mt-2">Đường dẫn cũ: <code>' +
                esc((cn.appCode ? cn.appCode : '') + cn.path) + '</code></div>' +
            (url ? '<div class="ums-u-fz13 ums-u-faint ums-u-mt-2">Đặt màn hình mới tại ' +
                '<code>_v2/' + esc(url) + '</code> là tự bật.</div>' : '') +
            '</div></div></div>');
        veCanQuyet(el('screen'), url, cn.name);   // màn chưa chuyển vẫn hiện ghi chú (vd màn cố ý không chuyển)
    }

    /* =====================================================================
       BẢNG "MÀN ĐANG CÓ LỖI BACKEND" (người dùng 2026-09-30 — để bộ phận backend nhìn thấy trước khi hoàn thiện sản phẩm; sau thì tắt)
       ---------------------------------------------------------------------
       Nguồn: sổ can-quyet.js, CHỈ mục `ben: 'oracle'` (lỗi máy chủ / CSDL / cấu hình) — mục nghiệp vụ tự khai không tính.
       · Trang một vai trò (chưa chọn chức năng): bảng các màn CỦA VAI TRÒ ĐÓ có lỗi, tên màn là liên kết mở thẳng màn.
       · Trang chủ: nút "Xem màn có lỗi backend của mọi vai trò" — bấm mới nạp menu mọi vai trò (dùng chung chỉ mục của ô tìm màn).
       Tắt: Cài đặt → "Hiện danh sách màn có lỗi backend" (từng trình duyệt), hoặc site.config.js → behavior.loiBackend = false (mọi người).
       behavior.canQuyet = false cũng tắt luôn. Mục của phân hệ CHƯA kiểm trên host (ums.canQuyetChuaKiem) mang nhãn "chưa kiểm trên host". */
    function lbBat() {
        var b = (ums.cfg && ums.cfg.behavior) || {};
        return b.loiBackend !== false && b.canQuyet !== false && !!ums.canQuyet;
    }
    function lbMuc(khoa) { return ((ums.canQuyet || {})[khoa] || []).filter(function (x) { return x.ben === 'oracle'; }); }
    function lbKhoa(n) {
        if (!ums.canQuyet || !n.path) return '';
        var url = screenUrl(n);
        if (!url) return '';
        var k = ums.canQuyetKhoa(url);
        return lbMuc(k).length ? k : '';
    }
    function lbChuaKiem(khoa) { return (ums.canQuyetChuaKiem || []).some(function (p) { return khoa.indexOf(p) === 0; }); }
    /** ds = [{ khoa, ten, nhom, href, vaiTro }] → HTML bảng */
    function lbBang(ds, coVaiTro) {
        var tl = tlDoc(), stt = 0;
        var h = '<div class="ums-tablewrap"><table class="ums-table ums-table--lined ums-lb"><thead><tr><th class="is-center" style="width:48px">Stt</th>' +
            '<th style="width:26%">Màn (bấm để mở)</th><th>Lỗi — việc cần backend làm</th><th style="width:130px">Tình trạng</th></tr></thead><tbody>';
        ds.forEach(function (m) {
            var muc = lbMuc(m.khoa);
            muc.forEach(function (x, i) {
                var tt = (tl[m.khoa + '|' + tlBam(x.q)] || {}).tt || '';
                h += '<tr>' + (i ? '' : '<td class="is-center" rowspan="' + muc.length + '">' + (++stt) + '</td>' +
                    '<td rowspan="' + muc.length + '"><a class="ums-lb__man" href="' + esc(m.href) + '">' + esc(m.ten) + '</a>' +
                    (m.nhom ? '<div class="ums-lb__phu">' + esc(m.nhom) + '</div>' : '') +
                    (coVaiTro && m.vaiTro ? '<div class="ums-lb__phu">Vai trò: ' + esc(m.vaiTro) + '</div>' : '') +
                    (lbChuaKiem(m.khoa) ? '<div class="ums-lb__phu"><span class="ums-canquyet__so is-kiem">chưa kiểm trên host</span></div>' : '') + '</td>') +
                    '<td>' + tlDam(x.q) + '</td>' +
                    '<td><span class="ums-canquyet__so ' + (tt === 'xong' ? 'is-tl is-du' : tt === 'dang' ? 'is-kiem' : tt === 'khong' ? 'is-tl' : 'is-loi') + '">' +
                    esc(tlNhan(TL_SUA, tt)) + '</span></td></tr>';
            });
        });
        return h + '</tbody></table></div>';
    }
    function lbKhung(tieuDe, soMan, soLoi, than) {
        return '<div class="ums-panel"><div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-triangle-exclamation"></i> ' + esc(tieuDe) +
            ' <span class="ums-u-faint ums-u-fz13">(' + soMan + ' màn · ' + soLoi + ' lỗi)</span></div></div>' +
            '<div class="ums-panel__body ums-panel__body--flush">' + than + '</div>' +
            '<div class="ums-lb__chan">Danh sách lấy từ sổ ghi chú chuyển đổi (lỗi đã gặp khi kiểm trên hệ thống thật). Chi tiết và ô cập nhật tình trạng nằm ở khung ' +
            '“Ghi chú chuyển đổi” đầu từng màn. Tắt bảng này: Cài đặt → Hành vi.</div></div>';
    }
    function veTrangVaiTro(role) {
        var ds = [];
        if (lbBat()) {
            var byId = {};
            state.menu.forEach(function (n) { byId[n.id] = n; });
            state.menu.forEach(function (n) {
                var k = lbKhoa(n);
                if (!k || String(n.hash || '').toLowerCase() === '#dashboard') return;
                var nhom = [], p = byId[n.parent], vong = 0;
                while (p && vong++ < 8) { nhom.unshift(p.name); p = byId[p.parent]; }
                ds.push({ khoa: k, ten: n.name, nhom: nhom.join(' › '), href: '#/r/' + encodeURIComponent(role.id) + '/' + encodeURIComponent(n.id) });
            });
        }
        if (!ds.length) { notice('fa-hand-pointer', 'Chọn một chức năng ở cột bên trái.', role.name); return; }
        var soLoi = ds.reduce(function (t, m) { return t + lbMuc(m.khoa).length; }, 0);
        elContent.innerHTML = '<div class="ums-page"><div class="ums-page__head"><h1 class="ums-page__title ums-u-mb-0">' + esc(role.name) + '</h1></div>' +
            '<div class="ums-lb__goi"><i class="fa-light fa-hand-pointer"></i> Chọn một chức năng ở cột bên trái.</div>' +
            lbKhung('Màn đang có lỗi backend của vai trò này', ds.length, soLoi, lbBang(ds, false)) + '</div>';
    }
    function lbVeNutTong() {
        var host = el('lbTong');
        if (!host) return;
        if (!lbBat()) { host.innerHTML = ''; return; }
        host.innerHTML = '<div class="ums-lb__goi">' + ums.ui.btn('view', { text: 'Xem màn có lỗi backend của mọi vai trò', icon: 'fa-triangle-exclamation', mod: 'out-danger', attr: { 'data-lb': 'tong' } }) +
            ' <span class="ums-u-faint ums-u-fz13">Nạp menu của mọi vai trò một lần mỗi phiên.</span></div>';
        host.onclick = function (ev) {
            if (!ev.target.closest('[data-lb="tong"]')) return;
            host.innerHTML = '<div class="ums-panel"><div class="ums-panel__body"><div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang nạp menu của mọi vai trò…</div></div></div>';
            tmNap().then(function (all) {
                if (!el('lbTong')) return;
                var gom = {}, ds = [];
                all.forEach(function (x) {
                    if (!x.q) return;
                    if (gom[x.q]) { if (gom[x.q].dsVaiTro.indexOf(x.rn) < 0) gom[x.q].dsVaiTro.push(x.rn); return; }
                    gom[x.q] = { khoa: x.q, ten: x.n, nhom: x.g, href: '#/r/' + encodeURIComponent(x.r) + '/' + encodeURIComponent(x.id), dsVaiTro: [x.rn] };
                    ds.push(gom[x.q]);
                });
                ds.forEach(function (m) { m.vaiTro = m.dsVaiTro.slice(0, 3).join(', ') + (m.dsVaiTro.length > 3 ? ' + ' + (m.dsVaiTro.length - 3) + ' vai trò khác' : ''); });
                ds.sort(function (a, b) { return a.vaiTro.localeCompare(b.vaiTro, 'vi') || a.ten.localeCompare(b.ten, 'vi'); });
                var soLoi = ds.reduce(function (t, m) { return t + lbMuc(m.khoa).length; }, 0);
                el('lbTong').innerHTML = ds.length ? lbKhung('Màn đang có lỗi backend — mọi vai trò', ds.length, soLoi, lbBang(ds, true))
                    : '<div class="ums-panel"><div class="ums-panel__body"><div class="ums-empty"><i class="fa-light fa-circle-check"></i>Không có màn nào trên menu đang có lỗi backend trong sổ.</div></div></div>';
            }, function (err) { ums.api.handle(err, 'nạp menu mọi vai trò'); lbVeNutTong(); });
        };
    }

    function notice(icon, msg, title) {
        elContent.innerHTML =
            '<div class="ums-page">' +
            (title ? '<div class="ums-page__head"><h1 class="ums-page__title ums-u-mb-0">' + esc(title) + '</h1></div>' : '') +
            '<div class="ums-panel"><div class="ums-panel__body">' +
            '<div class="ums-empty"><i class="fa-light ' + icon + '"></i>' + msg + '</div>' +
            '</div></div></div>';
    }

    /* Nạp HTML rồi chạy <script> bên trong, TUẦN TỰ: script ngoài phải tải
       xong thì script nội tuyến phía sau mới chạy — gắn thẳng vào DOM thì
       script nội tuyến chạy trước khi tệp .js kịp về.
       `src` / `href` tương đối tính theo vị trí tệp HTML, giống <iframe>:
       trong html/x.html viết  <script src="../scripts/x.js">  và
       <link rel="stylesheet" href="../css/x.css">  là đủ.

       Dữ liệu mẫu: ở chế độ dựng thử, với mỗi  …/x.js  được nạp, vỏ thử nạp
       …/x.demo.js  ngay TRƯỚC nó (không có thì bỏ qua). Vì vậy tệp HTML
       không bao giờ phải ghi thẻ .demo.js, và trên máy chủ thật không một
       tệp dữ liệu mẫu nào bị tải về. */
    function inject(host, html, baseUrl) {
        host.innerHTML = html;
        var base = new URL(baseUrl || location.href, location.href);
        var ver = String(Date.now());

        host.querySelectorAll('link[href]').forEach(function (l) {
            var u = new URL(l.getAttribute('href'), base);
            u.searchParams.set('v', ver);
            l.href = u.href;
        });

        var list = Array.prototype.slice.call(host.querySelectorAll('script'));

        function load(parent, before, url, optional) {
            return new Promise(function (resolve, reject) {
                var s = document.createElement('script');
                s.src = url;
                s.onload = resolve;
                s.onerror = function () {
                    if (optional) { if (s.parentNode) s.parentNode.removeChild(s); resolve(); }
                    else reject(new Error('không tải được ' + url));
                };
                parent.insertBefore(s, before);
            });
        }

        return list.reduce(function (p, old) {
            return p.then(function () {
                if (!old.parentNode) return;
                var src = old.getAttribute('src');
                if (!src) {
                    var s = document.createElement('script');
                    s.textContent = old.textContent;
                    old.parentNode.replaceChild(s, old);
                    return;
                }
                var u = new URL(src, base);
                u.searchParams.set('v', ver);
                var parent = old.parentNode;

                var demo = Promise.resolve();
                if (state.mode === 'demo' && /\.js$/i.test(u.pathname) && !/\.(min|demo)\.js$/i.test(u.pathname)) {
                    var d = new URL(u.href);
                    d.pathname = d.pathname.replace(/\.js$/i, '.demo.js');
                    demo = demoExists(d.pathname).then(function (yes) {
                        if (yes) return load(parent, old, d.href, true);
                    });
                }
                return demo.then(function () {
                    return load(parent, old, u.href, false).then(function () {
                        if (old.parentNode) old.parentNode.removeChild(old);
                    });
                });
            });
        }, Promise.resolve());
    }

    /* Hỏi trước tệp .demo.js có không, nhớ kết quả — để khỏi rải lỗi 404 của
       thẻ <script> ra Console cho mọi tệp không có dữ liệu mẫu. Dùng GET chứ
       không HEAD: máy chủ tĩnh _harness/serve.ps1 không xử lý HEAD. Chỉ chạy
       ở chế độ dựng thử nên tải hai lần không đáng kể. */
    var demoSeen = {};
    function demoExists(path) {
        if (demoSeen[path] === undefined) {
            demoSeen[path] = fetch(path, { cache: 'no-store' })
                .then(function (r) { return r.ok; }, function () { return false; });
        }
        return demoSeen[path];
    }

    /* =====================================================================
       Định tuyến
       ===================================================================== */
    function route() {
        if (ums.chrome) ums.chrome.reveal();
        global.scrollTo(0, 0);
        var parts = (location.hash || '#/').replace(/^#\/?/, '').split('/').filter(Boolean);

        if (parts[0] === 'cai-dat') {
            openStandalone('cai-dat', 'Cài đặt giao diện');
        } else if (parts[0] === 'r' && parts[1]) {
            openRole(parts[1], parts[2] || null);
        } else {
            renderHome();
        }
    }

    /** Màn hình không gắn với vai trò nào, ví dụ Cài đặt */
    function openStandalone(screen, title) {
        state.chucNangId = '';
        if (!state.tree.length) renderNav();
        markNav('');

        elContent.innerHTML =
            '<div class="ums-page">' +
            '  <nav class="ums-crumb">' +
            '    <a class="ums-crumb__link" href="#/"><i class="fa-light fa-house"></i>Bảng điều khiển</a>' +
            '    <i class="ums-crumb__sep fa-light fa-angle-right"></i>' +
            '    <span class="ums-crumb__cur">' + esc(title) + '</span>' +
            '  </nav>' +
            '  <div id="screen"><div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>' +
                 esc(T('loading', 'Đang tải…')) + '</div></div>' +
            '</div>';

        /* Dùng CHUNG fetchScreen với màn hình thường — trước đây chỗ này tự gọi
           fetch nên không có phần thử lại một lần, gặp lỗi mạng nhất thời là báo
           "Failed to fetch" ngay (màn Cài đặt giao diện bị đúng lỗi này). */
        var duongDan = 'screens/' + screen + '.html';
        fetchScreen(duongDan)
            .then(function (hit) {
                if (!hit) throw new Error('HTTP 404');
                return inject(el('screen'), hit.html, duongDan);
            })
            .catch(function (err) {
                var full = new URL(duongDan, location.href).href;
                el('screen').innerHTML = ums.ui.fail('Không nạp được ' + full + ' — ' + err.message);
            });
    }

    /* =====================================================================
       Màn hình chặn khi không khởi tạo được phiên
       ===================================================================== */
    function fatal(msg) {
        elContent.innerHTML =
            '<div class="ums-page"><div class="ums-panel"><div class="ums-panel__body">' +
            '<div class="ums-fail">' +
            '<i class="fa-light fa-plug-circle-xmark"></i>' +
            '<div>Không khởi tạo được phiên làm việc</div>' +
            '<div class="ums-fail__msg">' + esc(msg) + '</div>' +
            '<div class="ums-u-fz13 ums-u-faint">Trang này phải chạy trên máy chủ ứng dụng ' +
            '(<code>_v2/index.aspx</code>). Mở thẳng tệp <code>index.html</code> thì dùng ' +
            'chế độ dữ liệu dựng thử — đặt <code>api.dataSource = "demo"</code> trong site.config.js.</div>' +
            '</div></div></div></div>';
        elNav.innerHTML = '';
    }

    /* =====================================================================
       Khởi động
       ===================================================================== */
    document.addEventListener('DOMContentLoaded', function () {
        elApp = el('app');
        elNav = el('nav');
        elContent = el('content');
        elNav.addEventListener('click', function (ev) {
            if (!ev.target.closest('[data-tv-thoat]')) return;
            if (ums.thuVai) ums.thuVai.bo();
            location.hash = '#/';
        });

        state.mode = pickMode();

        if (state.mode === 'api') {
            var S = ums.session.init();
            if (API.logoutUrl) S.logoutUrl = API.logoutUrl;

            if (!S.ready) {
                document.documentElement.classList.remove('ums-busy');
                fatal(S.error || 'Lỗi không rõ');
                return;
            }
            state.user = (el('userName') && el('userName').textContent.trim()) || 'người dùng';
        } else {
            state.user = 'admin';
            console.info('[ums] chạy ở chế độ dữ liệu dựng thử — không gọi API.');
        }

        if (el('userName') && state.mode === 'demo') el('userName').textContent = state.user;

        /* --- Nút Menu: màn rộng thì thu cột trái, màn hẹp thì ngăn kéo --- */
        var remember = !CFG.behavior || CFG.behavior.rememberNavCollapsed !== false;
        if (remember) {
            try {
                if (localStorage.getItem('umsNavCollapsed') === '1') elApp.classList.add('is-nav-collapsed');
            } catch (e) {}
        }

        el('navToggle').addEventListener('click', function () {
            if (global.innerWidth <= 991) {
                elApp.classList.toggle('is-nav-open');
            } else {
                var on = elApp.classList.toggle('is-nav-collapsed');
                if (remember) { try { localStorage.setItem('umsNavCollapsed', on ? '1' : '0'); } catch (e) {} }
            }
        });

        el('veil').addEventListener('click', function () { elApp.classList.remove('is-nav-open'); });
        global.addEventListener('resize', function () {
            if (global.innerWidth > 991) elApp.classList.remove('is-nav-open');
        });


        timMan();

        /* --- Nút thử lại trong các khối báo lỗi --- */
        elContent.addEventListener('click', function (e) {
            var b = e.target.closest('[data-do]');
            if (!b) return;
            if (b.getAttribute('data-do') === 'reload-roles') { state.roles = []; renderHome(); }
            if (b.getAttribute('data-do') === 'reload-menu') { route(); }
        });

        global.addEventListener('hashchange', route);
        route();
        kiemPhongBieuTuong();
    });

    /* =====================================================================
       Kiểm phông biểu tượng
       ---------------------------------------------------------------------
       Thiếu tệp .woff2 (IIS chưa khai kiểu tệp, hoặc chưa chép thư mục
       webfonts lên host) thì MẤT SẠCH biểu tượng mà không báo gì — đã gặp hai
       lần, mỗi lần dò lại từ đầu. Ở đây tự kiểm rồi nói thẳng URL nào hỏng
       và máy chủ trả mã gì, thay vì để người dùng đoán.
       ===================================================================== */
    function kiemPhongBieuTuong() {
        if (!document.fonts || !document.fonts.load) return;
        var url = 'assets/vendor/fontawesome/webfonts/fa-light-300.woff2';

        function bao(chiTiet) {
            if (document.querySelector('[data-ums-fontwarn]')) return;
            var d = document.createElement('div');
            d.setAttribute('data-ums-fontwarn', '');
            d.className = 'ums-fontwarn';
            d.innerHTML =
                '<i class="fa-light fa-triangle-exclamation"></i>' +
                '<div><b>Không tải được phông biểu tượng</b> — mọi biểu tượng sẽ thành ô vuông.<br>' +
                new URL(url, location.href).href + ' — ' + chiTiet + '<br>' +
                'Thường do máy chủ chưa khai kiểu tệp .woff2: chép <code>_v2/web.config</code> lên host. ' +
                'Xem <code>_v2/TRIEN-KHAI.md</code> mục 8.1.</div>' +
                '<button type="button" class="ums-fontwarn__x" aria-label="Đóng">×</button>';
            d.querySelector('.ums-fontwarn__x').addEventListener('click', function () { d.remove(); });
            document.body.appendChild(d);
        }

        function doThat() {
            return fetch(url, { cache: 'no-store' })
                .then(function (r) { if (!r.ok) bao('máy chủ trả HTTP ' + r.status); })
                .catch(function (e) { bao(e.message); });
        }

        try {
            document.fonts.load('300 1em "Font Awesome 7 Pro"')
                .then(function (ds) { if (!ds || !ds.length) doThat(); }, doThat);
        } catch (e) { /* trình duyệt cũ — bỏ qua */ }
    }

})(window);
