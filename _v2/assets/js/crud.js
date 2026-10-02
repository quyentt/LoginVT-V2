/* =========================================================================
   ums.crud — khung màn hình DANH SÁCH + LỌC + BIỂU MẪU THÊM/SỬA/XOÁ
   =========================================================================
   Phần lớn màn hình khai báo của hệ cũ là cùng một khuôn: một bảng, một
   thanh lọc, một biểu mẫu, ba lời gọi Lấy/Lưu/Xoá. Hệ cũ chép tay khuôn đó
   vào từng tệp (mỗi tệp 300–1.500 dòng). Ở đây màn hình chỉ KHAI BÁO:

       ums.crud({
           root: document.getElementById('screen'),
           title: 'Hệ thống hoá đơn',
           filters: [{ key: 'q', type: 'text', label: 'Nhập từ khoá' }],
           list:   { paged: true, call: function (f) { return { action: …, strTuKhoa: f.q }; } },
           columns:[ … cột của ums.ui.table … ],
           fields: [{ key: 'strMauso', col: 'MAUSO', label: 'Mẫu số', required: true }],
           save:   function (v, row) { return { action: row ? 'X/CapNhat' : 'X/ThemMoi', strId: row ? row.ID : '', … }; },
           remove: function (ids) { return ids.map(function (id) { return { action: 'X/Xoa', strId: id }; }); }
       });

   Mọi lời gọi đi qua ums.api.call nên giữ nguyên giao thức cũ. Tên tham số
   và tên cột lấy NGUYÊN từ tệp .js gốc — đừng "chuẩn hoá" lại, procedure
   phía Oracle đọc đúng những tên đó.

   Nguồn dữ liệu cho ô chọn (`source`):
       { dm: 'TAICHINH.MAUIN' }                          danh mục dùng chung
       { call: { action, func, … }, id: 'ID', name: 'TEN' }  gọi API
       { items: [{ ID: '1', TEN: 'Hoạt động' }] }         liệt kê sẵn
   `name` có thể là hàm (row) → chuỗi. Một nguồn dùng ở nhiều ô chỉ tải một lần.

   saveFail(err, laSua) → chuỗi: câu báo thay cho câu lỗi của máy chủ khi lưu hỏng (máy chủ chỉ trả
   "Du lieu da ton tai" / "Du lieu khong hop le"; màn biết trùng cái gì, thiếu cái gì thì nói rõ).
   ========================================================================= */
(function (global) {
    'use strict';

    var ums = global.ums || (global.ums = {});
    var ui = ums.ui;
    var seq = 0;

    function esc(s) { return ui.esc(s); }
    function q(root, sel) { return root.querySelector(sel); }
    function qa(root, sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }

    /* ---------- Nguồn dữ liệu cho ô chọn -------------------------------- */
    function loadSource(src) {
        if (!src) return Promise.resolve([]);
        if (src._p) return src._p;
        var p;
        if (src.items) {
            p = Promise.resolve(src.items);
        } else if (src.dm) {
            p = ums.api.dm(src.dm, src.sort);
        } else {
            var call = {};
            Object.keys(src.call || {}).forEach(function (k) { call[k] = src.call[k]; });
            call.silent = true;
            p = ums.api.call(call).then(function (r) {
                var d = r.data;
                return Array.isArray(d) ? d : (d && d.rs) || [];
            });
        }
        src._p = p.catch(function (e) { delete src._p; throw e; });
        return src._p;
    }

    function optionsHtml(rows, src, head) {
        var id = src.id || 'ID';
        var name = src.name || 'TEN';
        var h = head === false ? '' : '<option value="">' + esc(head || '-- Chọn --') + '</option>';
        (rows || []).forEach(function (r) {
            var t = typeof name === 'function' ? name(r) : r[name];
            h += '<option value="' + esc(r[id]) + '">' + esc(t) + '</option>';
        });
        return h;
    }

    /* =====================================================================
       Khởi tạo
       ===================================================================== */
    function Crud(cfg) {
        this.cfg = cfg;
        this.uid = 'c' + (++seq);
        this.root = typeof cfg.root === 'string' ? document.querySelector(cfg.root) : cfg.root;
        this.rows = [];
        this.total = 0;
        this.page = 1;
        this.size = cfg.pageSize || (ums.cfg && ums.cfg.behavior && ums.cfg.behavior.pageSize) || 10;
        this.editing = null;        // dòng đang sửa, null = thêm mới
        this.selected = {};         // chỉ số dòng → true

        if (!this.root) throw new Error('ums.crud: không thấy root');
        this.render();
        this.bind();
        this.fillSources();
        this.fillLookups();
        if (cfg.autoload !== false) this.load();
    }

    /* Cột tra tên: { title, prop: 'MAUIN_ID', lookup: { dm: 'TAICHINH.MAUIN' } }
       hiện TEN thay cho mã. Nguồn về sau danh sách thì vẽ lại bảng. */
    Crud.prototype.fillLookups = function () {
        var me = this;
        (this.cfg.columns || []).forEach(function (col) {
            if (!col.lookup) return;
            var id = col.lookup.id || 'ID';
            var name = col.lookup.name || 'TEN';
            loadSource(col.lookup).then(function (rows) {
                var m = {};
                rows.forEach(function (r) { m[r[id]] = typeof name === 'function' ? name(r) : r[name]; });
                col._map = m;
                if (me.rows.length) me.draw();
            }).catch(function () { /* thiếu tên thì hiện mã */ });
            if (!col.render) {
                col.render = function (r) {
                    var v = r[col.prop];
                    if (!col._map) return '';            // chưa tải xong nguồn: để trống, đừng hiện GUID
                    return esc(col._map[v] !== undefined ? col._map[v] : (v || ''));
                };
            }
        });
    };

    Crud.prototype.a = function (act) { return 'data-c="' + this.uid + ':' + act + '"'; };
    Crud.prototype.z = function (name) { return q(this.root, '[data-z="' + this.uid + name + '"]'); };
    Crud.prototype.zattr = function (name) { return 'data-z="' + this.uid + name + '"'; };

    /* =====================================================================
       Khung HTML
       ===================================================================== */
    Crud.prototype.render = function () {
        var c = this.cfg;
        var canAdd = !!c.save && c.canAdd !== false;
        var multi = !!c.remove && c.multi !== false;

        var addBtn = canAdd ? ui.btn('add', { text: c.addText || 'Thêm mới', attr: { 'data-c': this.uid + ':add' } }) : '';
        var extraTop = (c.toolbar || []).map(this.toolBtn, this).join('');

        var h = '';

        if (!c.embedded) {
            h += '<div class="ums-page__head">' +
                '<h1 class="ums-page__title ums-u-mb-0">' + esc(c.title || '') + '</h1>' +
                '<div class="ums-page__actions" ' + this.zattr('actions') + '>' + extraTop + addBtn + '</div></div>';
        }

        /* --- Bố cục HAI CỘT (master): danh sách bên trái, nội dung bên phải ---
           Dùng cho màn mà BẢN GỐC vốn hai cột (BO-CUC.md luật 0). Mọi phần
           nạp / lọc / phân trang / lưu / xoá của ums.crud giữ nguyên, chỉ đổi
           chỗ đặt danh sách và cách vẽ một dòng. */
        if (c.master) { this.root.innerHTML = h + this.masterHtml(canAdd, addBtn, extraTop); this.afterRender(); return; }

        /* --- Vùng danh sách --- */
        h += '<div ' + this.zattr('list') + '>';

        if ((c.filters || []).length) {
            h += '<div class="ums-panel ums-u-mb-4"><div class="ums-panel__body">' +
                '<div class="ums-filter">' + c.filters.map(this.filterHtml, this).join('') +
                '<div class="ums-field ums-field--fit">' +
                ui.btn('search', { attr: { 'data-c': this.uid + ':search' } }) + '</div></div></div></div>';
        }

        /* Khung lồng có c.back: đóng bằng nút "Đóng" ở ĐẦU .ums-panel__tools — ngoài cùng bên trái (quy ước chung —
           KHÔNG dùng mũi tên ← ở đầu khung; mũi tên đã gỡ khỏi các màn tự dựng từ 2026-09-21). */
        h += '<div class="ums-panel"><div class="ums-panel__head">' +
            '<div class="ums-panel__title"><i class="fa-light ' + esc(c.icon || 'fa-list-ul') + '"></i> ' +
                esc(c.listTitle || (c.embedded ? c.title : 'Danh sách')) +
                ' <span class="ums-u-faint ums-u-fz13" ' + this.zattr('count') + '></span></div>' +
            '<div class="ums-panel__tools">' +
                (c.back ? ui.btn('close', { attr: { 'data-c': this.uid + ':back' } }) : '') +   // Đóng luôn ngoài cùng bên TRÁI nhóm nút
                (multi ? '<button type="button" class="ums-btn ums-btn--delsel ums-btn--sm" ' + this.a('delsel') + ' disabled>' +
                    '<i class="fa-light fa-trash-can"></i><span>' + esc(c.removeText || 'Xoá đã chọn') + '</span></button>' : '') +
                /* nút Tải lại CHUẨN (.ums-btn--tailai → CSS order: luôn CUỐI nhóm, sau Xoá đã chọn) — người dùng 2026-09-27:
                   "sai cấu trúc hệ nút, làm mới luôn ở cuối cùng" (bản embedded từng đặt ↻ trước Thêm mới) */
                '<button type="button" class="ums-btn ums-btn--tailai" ' + this.a('reload') + ' title="Tải lại" aria-label="Tải lại">' +
                    '<i class="fa-light fa-rotate-right"></i></button>' +
                (c.embedded ? extraTop + addBtn : '') +
            '</div></div>' +
            '<div class="ums-panel__body ums-panel__body--flush" ' + this.zattr('table') + '></div></div>';

        h += '</div>';

        /* --- Vùng biểu mẫu --- */
        h += this.formHtml();

        this.root.innerHTML = h;
        this.afterRender();
    };

    /* =====================================================================
       Khung HAI CỘT (cfg.master)
       ---------------------------------------------------------------------
       cfg.master = {
           title, icon      đầu khung danh sách bên trái
           item(row) → HTML nội dung một mục (bản gốc thường 2 dòng)
           width            bề ngang cột trái, mặc định 320px
           empty            câu dẫn ở khung bên phải lúc chưa chọn gì
       }
       Cột trái: ô lọc + danh sách + phân trang. Cột phải: khung giới thiệu,
       đổi chỗ cho biểu mẫu khi thêm/sửa — đúng hai vùng zone_notify /
       zone_input của bản gốc.
       ===================================================================== */
    Crud.prototype.masterHtml = function (canAdd, addBtn, extraTop) {
        var c = this.cfg, m = c.master;

        /* Một ô lọc chữ → vẽ đúng ô tìm chuẩn của cột trái (.ums-searchbar
           --sm) như ums.pat.master, cho giống các màn hai cột khác. Giữ
           nguyên data-cf/data-k/data-scope để filterValues() và phím Enter
           vẫn chạy. Nhiều ô lọc thì mới xếp thành hàng lọc. */
        /* Cùng khuôn với danh sách cán bộ (ums.pat.dsNhanSu — người dùng 2026-09-26): ô chữ ĐẦU TIÊN là ô tìm
           chuẩn (gõ là tự tìm sau 400ms, Enter tìm ngay), các ô còn lại vào khung "Bộ lọc nâng cao" ẨN SẴN,
           mở bằng nút thanh trượt cạnh nút Tải lại. Không còn nút Tìm kiếm — đổi ô chọn là tự tải.
           Ô lọc bắt buộc (required / first) thì khung mở sẵn để người dùng thấy phải chọn gì. */
        var fs_ = c.filters || [];
        var loc = '', f0 = null, conLai = fs_;
        if (fs_.length && fs_[0].type !== 'select') { f0 = fs_[0]; conLai = fs_.slice(1); }
        if (f0) {
            loc = '<div class="ums-master__search"><div class="ums-searchbar ums-searchbar--sm">' +
                '<button type="button" class="ums-searchbar__icon" data-c="' + this.uid + ':search" title="Tìm kiếm">' +
                '<i class="fa-light fa-magnifying-glass"></i></button>' +
                '<input class="ums-searchbar__input" data-cf="' + this.uid + '" data-k="' + esc(f0.key) +
                '" data-scope="filter" data-tutim="1" placeholder="' + esc(f0.label || 'Tìm kiếm') + '" autocomplete="off">' +
                '</div></div>';
        }
        var coAdv = conLai.length > 0;
        if (coAdv) {
            var moSan = conLai.some(function (f) { return f.required || f.first; });
            loc += '<div class="ums-master__filter"><div class="ums-master__adv ums-dsns__loc" ' + this.zattr('adv') + (moSan ? '' : ' hidden') + '>' +
                conLai.map(this.filterHtml, this).join('') + '</div></div>';
        }

        var side =
            '<aside class="ums-master__side">' +
            '<div class="ums-panel"><div class="ums-panel__head">' +
            '<div class="ums-panel__title"><i class="fa-light ' + esc(m.icon || c.icon || 'fa-list-ul') + '"></i> ' +
                esc(m.title || c.listTitle || 'Danh sách') +
                ' <span class="ums-u-faint ums-u-fz13" ' + this.zattr('count') + '></span></div>' +
            '<div class="ums-panel__tools">' +
                '<button type="button" class="ums-iconbtn" ' + this.a('reload') + ' title="Tải lại">' +
                '<i class="fa-light fa-rotate-right"></i></button>' +
                (coAdv ? '<button type="button" class="ums-iconbtn" ' + this.a('adv') + ' title="Bộ lọc nâng cao">' +
                    '<i class="fa-light fa-sliders"></i></button>' : '') + '</div></div>' +
            '<div class="ums-panel__body ums-panel__body--flush">' +
                loc +
                '<div class="ums-master__list" ' + this.zattr('table') + '></div>' +
                '<div class="ums-master__foot" ' + this.zattr('foot') + '></div>' +
            '</div></div></aside>';

        var main =
            '<div class="ums-master__main">' +
            '<div ' + this.zattr('notify') + '>' +
                '<div class="ums-panel"><div class="ums-panel__head">' +
                '<div class="ums-panel__title"><i class="fa-light fa-circle-info"></i> Thông tin chung</div></div>' +
                '<div class="ums-panel__body"><div class="ums-row ums-u-muted">' +
                esc(m.empty || ('Chọn một mục ở danh sách bên trái để xem' +
                    (canAdd ? ', hoặc bấm Thêm mới ở đầu trang để tạo mới.' : '.'))) +
                '</div></div></div>' +
            '</div>' +
            this.formHtml() +
            '</div>';

        return '<div class="ums-master"' + (m.width ? ' style="--ums-master-side:' + esc(m.width) + '"' : '') + '>' +
            side + main + '</div>';
    };

    /** Vùng biểu mẫu — chung cho cả bố cục một cột và hai cột */
    Crud.prototype.formHtml = function () {
        var c = this.cfg;
        if (!(c.fields && c.save)) return '';
        return '<div ' + this.zattr('form') + ' hidden>' +
            '<div class="ums-panel"><div class="ums-panel__head">' +
            '<div class="ums-panel__title"><i class="fa-light fa-pen-to-square"></i> <span ' + this.zattr('ftitle') + '></span></div>' +
            '<div class="ums-panel__tools">' +
                ui.btn('close', { attr: { 'data-c': this.uid + ':back' } }) +
                (c.remove && c.formDelete !== false ? '<button type="button" class="ums-btn ums-btn--danger" ' + this.a('delone') + ' hidden>' +
                    '<i class="fa-light fa-trash-can"></i><span>' + esc(c.formRemoveText || 'Xoá') + '</span></button>' : '') +
                // "Lưu và Nhập tiếp" (btnReWrite_* của hệ cũ): lưu xong ở lại
                // biểu mẫu, xoá trắng để nhập bản ghi kế tiếp
                (c.saveAgain ? ui.btn('save', { text: typeof c.saveAgain === 'string' ? c.saveAgain : 'Lưu và Nhập tiếp',
                    mod: c.saveAgainMod || 'out-primary', icon: 'fa-floppy-disk-circle-arrow-right', attr: { 'data-c': this.uid + ':again' } }) : '') +
                ui.btn('save', { attr: { 'data-c': this.uid + ':save' } }) +
            '</div></div>' +
            '<div class="ums-panel__body"><div class="ums-grid ums-grid--' + ((this.tuHaiCot = this.motCot()) ? 2 : (c.formCols || 2)) + '">' +
                c.fields.map(this.fieldHtml, this).join('') +
            '</div></div></div>' +
            '<div class="ums-u-mt-4" ' + this.zattr('extra') + '></div>' +
            '</div>';
    };

    /** Vẽ danh sách bên trái của bố cục hai cột (thay ums.ui.table) */
    Crud.prototype.drawMaster = function (shown, offset) {
        var me = this, c = this.cfg, m = c.master;
        var host = this.z('table');
        var id = this.editing && this.editing.ID;

        host.innerHTML = shown.length
            ? shown.map(function (r, i) {
                return '<button type="button" class="ums-master__item' + (id && r.ID === id ? ' is-active' : '') +
                    '" data-c="' + me.uid + ':edit" data-i="' + (offset + i) + '">' +
                    (m.item ? m.item(r) : esc(r.TEN || r.ID || '')) + '</button>';
            }).join('')
            : ui.empty(c.empty || 'Không có dữ liệu');

        var foot = this.z('foot');
        var paged = !!c.list.paged;
        var trang = {
            index: this.page, size: this.size, total: this.total,
            onChange: function (p) {
                if (p < 1 || p > Math.ceil(me.total / me.size)) return;
                if (paged) me.load(p); else { me.page = p; me.draw(); }
            },
            onSize: function (v) { me.setSize(v); }
        };
        foot.innerHTML = ui.pager(trang, shown.length);
        ui.pagerBind(foot, trang);
    };

    /** Ô "Hiển thị" của thanh phân trang — về trang 1 như hệ cũ (Core:1833) */
    Crud.prototype.setSize = function (v) {
        this.size = v;
        this.page = 1;
        if (this.cfg.list.paged) this.load(1); else this.draw();
    };

    /** Gắn lịch và select2 cho mọi ô vừa dựng */
    Crud.prototype.afterRender = function () {
        // Ô ngày và ô chọn
        var me = this;
        qa(this.root, '[data-cf="' + this.uid + '"][data-type="date"]').forEach(function (el) { ui.datepicker(el); });
        qa(this.root, 'select[data-cf="' + this.uid + '"]').forEach(function (el) {
            // Ô bắt buộc thì không cho xoá trắng; ô lọc và ô tuỳ chọn thì cho
            var f = el.getAttribute('data-scope') === 'form' ? (me.fieldDef(el.getAttribute('data-k')) || {}) : {};
            ui.select2(el, { placeholder: el.getAttribute('data-ph') || '-- Chọn --', allowClear: !f.required });
        });
        // Tệp đính kèm: { type: 'files', key, api: 'NS_Files', folder?, idOf?(row) }
        me.files = {};
        qa(this.root, '[data-cfiles="' + this.uid + '"]').forEach(function (el) {
            var k = el.getAttribute('data-k');
            var f = me.fieldDef(k) || {};
            me.files[k] = ums.files.mount(el, { api: f.api, folder: f.folder });
        });
        // Ảnh đại diện: { type: 'avatar', key, col, width?, height?, icon? } — giá trị là đường dẫn ảnh
        me.avatars = {};
        qa(this.root, '[data-cavatar="' + this.uid + '"]').forEach(function (el) {
            var k = el.getAttribute('data-k');
            var f = me.fieldDef(k) || {};
            me.avatars[k] = ums.files.avatar(el, { width: f.width, height: f.height, icon: f.icon });
        });
        me.syncSelection();
    };

    Crud.prototype.toolBtn = function (t, i) {
        /* Nút phụ ở đầu trang (mở công cụ, xem thêm…) mặc định là NÚT VIỀN,
           không để trắng lẫn vào nền. Màn nào cần khác thì truyền mod. */
        return '<button type="button" class="ums-btn ums-btn--' + esc(t.mod || 'out-primary') + '" ' + this.a('tool' + i) + '>' +
            (t.icon ? '<i class="fa-light ' + esc(t.icon) + '"></i>' : '') + '<span>' + esc(t.text) + '</span></button>';
    };

    Crud.prototype.filterHtml = function (f) {
        var attr = 'data-cf="' + this.uid + '" data-k="' + esc(f.key) + '" data-scope="filter"';
        if (f.type === 'select') {
            return '<div class="ums-field"><select class="ums-select" ' + attr + ' data-ph="' + esc(f.label) + '">' +
                '<option value="">' + esc(f.label) + '</option></select></div>';
        }
        return '<div class="ums-field"><input class="ums-input" ' + attr +
            ' placeholder="' + esc(f.label) + '" autocomplete="off"' +
            (f.value !== undefined ? ' value="' + esc(f.value) + '"' : '') + '></div>';
    };

    /** Biểu mẫu MỘT CỘT (formCols 1, hoặc mọi ô đều `span`) → tự xếp HAI Ô MỘT HÀNG: ô ngắn nằm nửa hàng,
        ô dài (xem Crud.oDai) vẫn cả dòng. Người dùng 2026-09-26: "đừng để input dài full thế" rồi "những cái
        này 2 dòng 1 hàng chứ". Giữ một cột thật sự (hiếm): khai `formMotCot: true`. Biểu mẫu hai cột thường
        cũng vậy: `span` của ô ngắn bị bỏ qua (xem fieldHtml). */
    Crud.prototype.motCot = function () {
        var c = this.cfg;
        if (c.formMotCot || c.formCols === 12) return false;
        if (c.formCols === 1) return true;
        var o = c.fields.filter(function (f) { return ['hidden', 'legend', 'note', 'gap'].indexOf(f.type) < 0; });
        return o.length > 0 && o.every(function (f) { return f.span; });
    };
    /** Ô DÀI — vẫn chiếm cả dòng khi biểu mẫu tự xếp hai cột: kiểu nhiều dòng / tệp / nhóm ô đánh dấu,
        khai `dai: true`, hoặc nhãn là loại chữ dài (mô tả, ghi chú, nội dung, công thức, đường dẫn…) */
    var DAI = /mô tả|ghi chú|nội dung|công thức|biểu thức|điều kiện|đường dẫn|diễn giải|lý do|địa chỉ|tiêu đề|trích yếu|thông báo|chú thích|url|link/i;
    Crud.oDai = function (f) {
        if (f.dai) return true;
        if (['textarea', 'files', 'checks', 'avatar', 'note', 'legend', 'gap', 'editor', 'html', 'rows'].indexOf(f.type) >= 0) return true;
        return DAI.test(f.label || '') || DAI.test(f.placeholder || '');
    };

    Crud.prototype.fieldHtml = function (f) {
        var attr = 'data-cf="' + this.uid + '" data-k="' + esc(f.key) + '" data-scope="form" data-type="' + esc(f.type || 'text') + '"';
        // span: cả dòng; cols: số phần trên lưới 12 (formCols: 12), vd 4 = một phần ba dòng
        /* `span` (cả dòng) chỉ giữ cho Ô DÀI; ô ngắn luôn nửa hàng (người dùng 2026-09-26: "2 dòng 1 hàng").
           Ép cả dòng cho ô ngắn: `caDong: true`. Lưới 12 (formCols 12) giữ nguyên `cols`. */
        var full = f.caDong || ((f.span || this.tuHaiCot) && Crud.oDai(f));
        var span = full ? ' style="grid-column:1 / -1"' : (!this.tuHaiCot && f.cols ? ' style="grid-column:span ' + Number(f.cols) + '"' : '');
        var ctl;

        switch (f.type) {
            case 'legend':
                return '<div class="ums-legend ums-u-mb-0"' + ' style="grid-column:1 / -1">' + esc(f.label) + '</div>';
            case 'hidden':
                // Ô ẩn giữ giá trị lấy từ chi tiết (vd id quyết định) để gửi lại khi lưu
                return '<input type="hidden" ' + attr + '>';
            case 'note':
                // Dòng chữ ghi chú của biểu mẫu (vd "* Lưu ý: … chỉ nhập năm")
                return '<div class="ums-u-faint ums-u-fz13" style="grid-column:1 / -1">' + esc(f.label || f.text || '') + '</div>';
            case 'gap':
                // Ô trống giữ chỗ trên lưới — giữ đúng dòng như bản gốc
                return '<div aria-hidden="true"></div>';
            case 'avatar':
                // Ảnh (edu.system.uploadAvatar) — ô ẩn chỉ để formValues / fillForm
                // nhận ra khoá; giá trị đọc/ghi qua ums.files.avatar
                return '<div class="ums-field"' + span + '>' +
                    '<label class="ums-field__label">' + esc(f.label || '') + '</label>' +
                    '<input type="hidden" ' + attr + '><div data-cavatar="' + this.uid + '" data-k="' + esc(f.key) + '"></div></div>';
            case 'files':
                // Tệp đính kèm (ums.files) — không phải ô nhập nên không mang
                // data-scope="form": formValues / validate / fillForm bỏ qua nó.
                return '<div style="grid-column:1 / -1">' +
                    ui.field(f.label || 'Thông tin đính kèm', '<div data-cfiles="' + this.uid + '" data-k="' + esc(f.key) + '"></div>') + '</div>';
            case 'checks':
                // Nhóm ô đánh dấu — mỗi mục là một khoá riêng
                return '<div class="ums-field"' + span + '>' +
                    (f.label ? '<label class="ums-field__label">' + esc(f.label) + '</label>' : '') +
                    '<div class="ums-checkgrid">' +
                    f.items.map(function (it) {
                        return '<label class="ums-check"><input type="checkbox" data-cf="' + this.uid + '" data-k="' +
                            esc(it.key) + '" data-scope="form" data-type="check"> ' + esc(it.label) + '</label>';
                    }, this).join('') + '</div></div>';
            case 'select':
                ctl = '<select class="ums-select" ' + attr + ' data-ph="' + esc(f.placeholder || '-- Chọn --') + '">' +
                    (f.source && f.source.items ? optionsHtml(f.source.items, f.source, f.placeholder) : '<option value=""></option>') +
                    '</select>';
                break;
            case 'textarea':
                ctl = '<textarea class="ums-textarea" ' + attr + '></textarea>';
                break;
            case 'date':
                ctl = '<div class="ums-inputwrap"><input class="ums-input" ' + attr + ' autocomplete="off" placeholder="dd/mm/yyyy">' +
                    '<i class="fa-light fa-calendar"></i></div>';
                break;
            case 'number':
                ctl = '<input class="ums-input" inputmode="decimal" ' + attr + ' autocomplete="off">';
                break;
            case 'static':
                ctl = '<div class="ums-input" style="display:flex;align-items:center" ' + attr + '></div>';
                break;
            default:
                ctl = '<input class="ums-input" ' + attr + ' autocomplete="off">';
        }
        return '<div' + span + '>' + ui.field(f.label, ctl, { required: f.required, hint: f.hint }) + '</div>';
    };

    /* =====================================================================
       Nạp nguồn cho các ô chọn (lọc + biểu mẫu)
       ===================================================================== */
    Crud.prototype.fillSources = function () {
        var me = this, c = this.cfg, jobs = [];
        var all = [].concat(
            (c.filters || []).map(function (f) { return { f: f, scope: 'filter' }; }),
            (c.fields || []).map(function (f) { return { f: f, scope: 'form' }; })
        );

        all.forEach(function (x) {
            var f = x.f;
            if (f.type !== 'select' || !f.source || f.source.items && x.scope === 'form') return;
            var el = q(me.root, '[data-cf="' + me.uid + '"][data-scope="' + x.scope + '"][data-k="' + f.key + '"]');
            if (!el) return;
            jobs.push(loadSource(f.source).then(function (rows) {
                var keep = el.value;
                /* Nhãn ô chọn: màn khai gì dùng nấy; không khai thì lấy tên
                   danh mục do quản trị nhập (ums.pat.dmTitle) như hệ cũ, chứ
                   không để trơ "-- Chọn --". */
                var nhan = x.scope === 'filter'
                    ? (f.label || ums.pat.dmTitle(rows) || '-- Chọn --')
                    : (f.placeholder || ums.pat.dmTitle(rows) || '-- Chọn --');
                el.innerHTML = optionsHtml(rows, f.source, nhan);
                /* select2 vẽ nhãn từ cấu hình lúc khởi tạo, mà lúc đó chưa có
                   dữ liệu — gắn lại nhãn rồi dựng lại ô cho khớp. */
                if (el.getAttribute('data-ph') !== nhan) {
                    el.setAttribute('data-ph', nhan);
                    if (el.classList.contains('select2-hidden-accessible')) {
                        ui.select2(el, { placeholder: nhan, allowClear: !f.required });
                    }
                }
                if (keep) el.value = keep;
                // Ô lọc dạng chọn có giá trị mặc định (vd hiệu lực = 1)
                else if (x.scope === 'filter' && f.value !== undefined) el.value = f.value;
                // first: true — chọn sẵn mục đầu (selectFirst của loadToCombo_data)
                else if (x.scope === 'filter' && f.first && rows.length) el.value = rows[0][f.source.id || 'ID'];
                if (global.jQuery) jQuery(el).trigger('change.select2');
            }).catch(function (err) {
                ums.api.handle(err, 'nguồn ' + f.key);
            }));
        });

        this.sourcesReady = Promise.all(jobs);
    };

    /* =====================================================================
       Đọc / ghi giá trị
       ===================================================================== */
    Crud.prototype.filterValues = function () {
        var v = {}, defs = {};
        (this.cfg.filters || []).forEach(function (f) { defs[f.key] = f; });
        qa(this.root, '[data-cf="' + this.uid + '"][data-scope="filter"]').forEach(function (el) {
            var k = el.getAttribute('data-k');
            var val = (el.value || '').trim();
            // Ô chọn chưa nạp xong danh sách mà có giá trị mặc định → dùng mặc định
            var f = defs[k] || {};
            if (!val && el.tagName === 'SELECT' && el.options.length <= 1 && f.value !== undefined) val = String(f.value);
            v[k] = val;
        });
        return v;
    };

    Crud.prototype.formEls = function () {
        return qa(this.root, '[data-cf="' + this.uid + '"][data-scope="form"]');
    };

    Crud.prototype.fieldDef = function (key) {
        var hit = null;
        (this.cfg.fields || []).some(function (f) {
            if (f.key === key) { hit = f; return true; }
            if (f.items) return f.items.some(function (it) { if (it.key === key) { hit = it; return true; } });
            return false;
        });
        return hit;
    };

    /** Giá trị biểu mẫu theo đúng khoá tham số gửi lên máy chủ */
    Crud.prototype.formValues = function () {
        var me = this, v = {};
        this.formEls().forEach(function (el) {
            var k = el.getAttribute('data-k');
            var t = el.getAttribute('data-type');
            var f = me.fieldDef(k) || {};
            if (t === 'static') return;
            if (t === 'avatar') { v[k] = me.avatars && me.avatars[k] ? me.avatars[k].get() : ''; return; }
            if (t === 'check') {
                // Hệ cũ: đánh dấu → 1, bỏ trống → undefined (gửi thành chuỗi rỗng)
                v[k] = el.checked ? (f.on !== undefined ? f.on : 1) : (f.off !== undefined ? f.off : '');
            } else {
                v[k] = (el.value || '').trim();
            }
        });
        return v;
    };

    Crud.prototype.fillForm = function (row) {
        var me = this;
        this.formEls().forEach(function (el) {
            var k = el.getAttribute('data-k');
            var t = el.getAttribute('data-type');
            var f = me.fieldDef(k) || {};
            var raw = row ? (typeof f.get === 'function' ? f.get(row) : row[f.col || '']) : f.value;
            if (raw === undefined || raw === null) raw = (row ? '' : (f.value !== undefined ? f.value : ''));

            el.classList.remove('is-invalid');
            if (t === 'avatar') { if (me.avatars && me.avatars[k]) me.avatars[k].set(raw); return; }
            if (t === 'check') {
                el.checked = raw === true || String(raw) === '1';
            } else if (t === 'static') {
                el.textContent = raw;
            } else {
                el.value = raw;
                if (el.tagName === 'SELECT' && global.jQuery) jQuery(el).trigger('change.select2');
                if (el._flatpickr) el._flatpickr.setDate(raw || null, false, 'd/m/Y');
            }
            var lock = row ? f.readonlyEdit : false;
            if (t !== 'check' && t !== 'static') el.disabled = !!lock;
        });
    };

    Crud.prototype.validate = function () {
        var me = this, bad = [];
        this.formEls().forEach(function (el) {
            var f = me.fieldDef(el.getAttribute('data-k')) || {};
            var t = el.getAttribute('data-type');
            var val = (el.value || '').trim();
            var wrong = false;
            if (f.required && t !== 'check' && !val) wrong = true;
            if (!wrong && t === 'number' && val && isNaN(Number(val.replace(/,/g, '')))) wrong = true;
            if (!wrong && t === 'date' && val && !/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(val)) wrong = true;
            el.classList.toggle('is-invalid', wrong);
            var s2 = el.nextElementSibling && el.nextElementSibling.classList.contains('select2') ? el.nextElementSibling : null;
            if (s2) s2.classList.toggle('is-invalid', wrong);
            if (wrong) bad.push(f.label || el.getAttribute('data-k'));
        });
        if (bad.length) ui.toast('Kiểm tra lại: ' + bad.join(', '), 'warn');
        return !bad.length;
    };

    /* =====================================================================
       Danh sách
       ===================================================================== */
    Crud.prototype.load = function (page) {
        var me = this, c = this.cfg;
        if (page) this.page = page;
        var call = c.list.call(this.filterValues(), { index: this.page, size: this.size });
        if (!call) return Promise.resolve();
        if (c.list.paged) {
            call.pageIndex = this.page;
            call.pageSize = this.size;
        }

        var tbl = this.z('table');
        if (!this.rows.length) {
            tbl.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
        }

        var token = this.token = {};
        return ums.api.call(call).then(function (r) {
            if (me.token !== token) return;
            var d = r.data;
            var rows = c.list.rows ? c.list.rows(d, r) : (Array.isArray(d) ? d : (d && d.rs) || []);
            me.rows = rows || [];
            me.total = c.list.paged ? (Number(r.pager) || me.rows.length) : me.rows.length;
            me.selected = {};
            me.draw();
            if (c.onLoad) c.onLoad(me.rows, me);
        }).catch(function (err) {
            if (me.token !== token) return;
            me.rows = [];
            tbl.innerHTML = ui.fail(err.message, me.a('reload'));
            ums.api.handle(err, c.title);
        });
    };

    Crud.prototype.draw = function () {
        var me = this, c = this.cfg;
        var multi = !!c.remove && c.multi !== false;
        var paged = !!c.list.paged;
        var from = paged ? 0 : (this.page - 1) * this.size;
        var shown = paged ? this.rows : this.rows.slice(from, from + this.size);
        var offset = paged ? 0 : from;

        var cols = (c.columns || []).slice();
        var acts = [];
        (c.rowActions || []).forEach(function (ra, i) { acts.push({ ra: ra, i: i }); });
        var canEdit = !!c.save && !!c.fields && c.canEdit !== false;
        var canDel = !!c.remove && c.rowDelete !== false;

        if (acts.length || canEdit || canDel) {
            cols.push({
                title: 'Thao tác', cls: 'is-actions', width: (40 * (acts.length + canEdit + canDel) + 24) + 'px',
                render: function (r, i) {
                    var n = offset + i;
                    return acts.map(function (x) {
                        return '<button type="button" class="ums-iconbtn" data-c="' + me.uid + ':ra' + x.i + '" data-i="' + n + '" title="' +
                            esc(x.ra.title) + '"><i class="fa-light ' + esc(x.ra.icon) + '"></i></button>';
                    }).join('') +
                    (canEdit ? '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-c="' + me.uid + ':edit" data-i="' + n + '" title="Sửa"><i class="fa-light fa-pen-to-square"></i></button>' : '') +
                    (canDel ? '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-c="' + me.uid + ':del" data-i="' + n + '" title="Xoá"><i class="fa-light fa-trash-can"></i></button>' : '');
                }
            });
        }
        if (multi) {
            cols.push({
                head: '<input type="checkbox" data-c="' + me.uid + ':all" title="Chọn tất cả">',
                cls: 'is-center', width: '44px',
                render: function (r, i) {
                    return '<input type="checkbox" data-c="' + me.uid + ':pick" data-i="' + (offset + i) + '">';
                }
            });
        }

        if (c.master) {
            this.drawMaster(shown, offset);
            var cntM = this.z('count');
            if (cntM) cntM.textContent = '(' + this.total + ')';
            return;
        }

        ui.table({
            el: this.z('table'),
            rows: shown,
            columns: cols,
            empty: c.empty || 'Không có dữ liệu',
            page: {
                index: this.page, size: this.size, total: this.total,
                onChange: function (p) {
                    if (p < 1 || p > Math.ceil(me.total / me.size)) return;
                    if (paged) me.load(p); else { me.page = p; me.draw(); }
                },
                onSize: function (v) { me.setSize(v); }
            }
        });

        var cnt = this.z('count');
        if (cnt) cnt.textContent = '(' + this.total + ')';
        this.syncSelection();
    };

    Crud.prototype.pickedRows = function () {
        var me = this;
        return Object.keys(this.selected).map(function (i) { return me.rows[i]; }).filter(Boolean);
    };

    Crud.prototype.syncSelection = function () {
        var n = Object.keys(this.selected).length;
        var b = q(this.root, '[data-c="' + this.uid + ':delsel"]');
        if (b) {
            b.disabled = !n;
            var nhan = this.cfg.removeText;
            b.querySelector('span').textContent = nhan ? (n ? nhan + ' (' + n + ')' : nhan)
                : (n ? 'Xoá ' + n + ' dòng đã chọn' : 'Xoá đã chọn');
        }
        var me = this;
        qa(this.root, '[data-c="' + this.uid + ':pick"]').forEach(function (el) {
            el.checked = !!me.selected[el.getAttribute('data-i')];
            var tr = el.closest('tr');
            if (tr) tr.classList.toggle('is-selected', el.checked);
        });
        var all = q(this.root, '[data-c="' + this.uid + ':all"]');
        if (all) {
            var boxes = qa(this.root, '[data-c="' + this.uid + ':pick"]');
            all.checked = boxes.length > 0 && boxes.every(function (x) { return x.checked; });
        }
    };

    /* =====================================================================
       Biểu mẫu
       ===================================================================== */
    Crud.prototype.showForm = function (row) {
        var me = this, c = this.cfg;
        this.editing = row || null;

        var t = this.z('ftitle');
        if (t) t.textContent = (row ? 'Sửa ' : 'Thêm ') + (c.formTitle || (c.title || '').toLowerCase());
        var del = q(this.root, '[data-c="' + this.uid + ':delone"]');
        if (del) del.hidden = !row;

        var get = row && c.detail
            ? ums.api.call(c.detail(row)).then(function (r) {
                var d = Array.isArray(r.data) ? r.data[0] : r.data;
                return d || row;
            })
            : Promise.resolve(row);

        return Promise.all([get, this.sourcesReady]).then(function (x) {
            var full = x[0];
            if (row) me.editing = full;
            if (c.master) me.draw();          // tô sáng mục đang mở ở cột trái
            me.fillForm(full);
            Object.keys(me.files || {}).forEach(function (k) {
                var f = me.fieldDef(k) || {};
                me.files[k].load(full ? (f.idOf ? f.idOf(full) : full.ID) : '');
            });
            var extra = me.z('extra');
            if (extra) extra.innerHTML = '';
            var actions = me.z('actions');
            if (actions) actions.hidden = true;
            // Hai cột: danh sách bên trái ở nguyên, chỉ đổi khung bên phải
            ui.swap(c.master ? me.z('notify') : me.z('list'), me.z('form'), { top: !c.embedded && !c.master });
            if (c.onForm) c.onForm(full, me, extra);
            var first = me.formEls().find(function (el) { return !el.disabled && el.getAttribute('data-type') !== 'static' && el.getAttribute('data-type') !== 'check'; });
            if (first && first.tagName !== 'SELECT') first.focus();
        }).catch(function (err) { ums.api.handle(err, 'mở biểu mẫu'); });
    };

    /** Về biểu mẫu thêm mới trống (sau "Lưu và Nhập tiếp") */
    Crud.prototype.clearForm = function () {
        var c = this.cfg, me = this;
        this.editing = null;
        var t = this.z('ftitle');
        if (t) t.textContent = 'Thêm ' + (c.formTitle || (c.title || '').toLowerCase());
        var del = q(this.root, '[data-c="' + this.uid + ':delone"]');
        if (del) del.hidden = true;
        this.fillForm(null);
        Object.keys(this.files || {}).forEach(function (k) { me.files[k].clear(); });
        if (c.onForm) c.onForm(null, this, this.z('extra'));
    };

    Crud.prototype.showList = function () {
        var actions = this.z('actions');
        if (actions) actions.hidden = false;
        this.editing = null;
        ui.swap(this.z('form'), this.cfg.master ? this.z('notify') : this.z('list'),
            { top: !this.cfg.embedded && !this.cfg.master });
        if (this.cfg.master) this.draw();          // bỏ đánh dấu mục đang chọn
        if (this.cfg.onList) this.cfg.onList(this);
    };

    Crud.prototype.save = function (opt) {
        var me = this, c = this.cfg;
        var again = !!(opt && opt.again);
        if (!this.validate()) return;
        var files = this.files || {};
        if (Object.keys(files).some(function (k) { return files[k].busy(); })) {
            ui.toast('Đang tải tệp lên, đợi xong rồi lưu', 'warn');
            return;
        }
        var isEdit = !!this.editing;
        var editing = this.editing;
        var call = c.save(this.formValues(), this.editing, this);
        if (!call) return;

        var btn = q(this.root, '[data-c="' + this.uid + ':save"]');
        if (btn) btn.disabled = true;

        ums.api.call(call).then(function (result) {
            ui.toast(isEdit ? 'Cập nhật thành công' : 'Thêm mới thành công', 'ok');
            // Tệp đính kèm gắn vào id máy chủ trả (saveFiles gốc dùng data.Id cả
            // khi thêm lẫn khi sửa); không có thì lấy id dòng đang sửa.
            var id = (result.raw && result.raw.Id) || (editing && editing.ID) || '';
            return Object.keys(files).reduce(function (p, k) {
                return p.then(function () { return files[k].save(id); });
            }, Promise.resolve()).then(function () {
                // result = { data, pager, message, raw } — id mới thường ở raw.Id hoặc message
                if (c.onSaved) c.onSaved(me, result, isEdit);
                if (again) { me.clearForm(); me.load(); return; }
                me.showList();
                me.load();
            });
        }).catch(function (err) {
            /* saveFail(err, laSua) → câu báo thay cho câu của máy chủ khi màn biết rõ nghĩa (vd "Du lieu da ton tai" → trùng cái gì).
               Trả rỗng = giữ câu của máy chủ; câu gốc còn ở err.goc. */
            if (c.saveFail && err && !err.expired) {
                var cau = c.saveFail(err, isEdit);
                if (cau) { err.goc = err.goc || err.message; err.message = cau; }
            }
            ums.api.handle(err, 'lưu');
            /* Máy chủ báo lỗi vẫn có thể ĐÃ GHI một phần (gặp thật 2026-09-24: TC_BienLai/ThemMoi
               báo ORA-00001 nhưng bản ghi đã tạo; danh sách không nạp lại nên người dùng tưởng
               chưa có gì, bấm Lưu tiếp → sinh bản ghi rác). Giữ nguyên biểu mẫu, nạp lại danh sách. */
            if (err && err.status) me.load();
        }).then(function () {
            if (btn) btn.disabled = false;
        });
    };

    /* =====================================================================
       Xoá — xác nhận một lần, gửi từng lời gọi, báo kết quả gộp
       ===================================================================== */
    /* remove(rows, trongBieuMau): nút "Xoá đã chọn" ở danh sách dùng c.remove;
       nút Xoá trong biểu mẫu dùng c.formRemove nếu có (màn gốc hai nút gọi hai
       procedure khác nhau, vd khaosat/kehoach). c.removeConfirm(rows, trongBieuMau)
       → chữ hỏi lại riêng. */
    Crud.prototype.remove = function (rows, trongBieuMau) {
        var me = this, c = this.cfg;
        if (!rows.length) return;
        var msg = c.removeConfirm ? c.removeConfirm(rows, !!trongBieuMau) : (rows.length === 1
            ? 'Xoá dòng đã chọn? Thao tác này không hoàn tác được.'
            : 'Xoá ' + rows.length + ' dòng đã chọn? Thao tác này không hoàn tác được.');

        ui.confirm(msg, { tone: 'bad', ok: 'Xoá', title: 'Xoá dữ liệu' }).then(function (yes) {
            if (!yes) return;
            var ids = rows.map(function (r) { return r.ID; });
            var calls = (trongBieuMau && c.formRemove ? c.formRemove : c.remove)(ids, rows);
            if (!calls) return;
            if (!Array.isArray(calls)) calls = [calls];

            var ok = 0, errs = [], daXoa = [];
            return calls.reduce(function (p, call, i) {
                return p.then(function () {
                    return ums.api.call(call).then(function () { ok++; daXoa.push(i); }, function (e) {
                        if (e.expired) throw e;
                        errs.push(e.message);
                    });
                });
            }, Promise.resolve()).then(function () {
                /* onRemoved(ids, rows): việc dọn kèm SAU khi xoá (vd quyết định sinh kèm) — chỉ nhận các id đã xoá THÀNH CÔNG.
                   Lời gọi không ứng một-một với id (một lời gọi xoá nhiều id) thì chỉ gọi khi mọi lời gọi đều thành công. */
                if (!c.onRemoved) return;
                var xong = calls.length === ids.length ? daXoa.map(function (i) { return ids[i]; }) : (ok === calls.length ? ids : []);
                if (xong.length) return Promise.resolve(c.onRemoved(xong, rows)).catch(function () {});
            }).then(function () {
                if (ok) ui.toast('Đã xoá ' + (calls.length > 1 ? ok + '/' + calls.length + ' ' : '') + 'dữ liệu', 'ok');
                if (errs.length) ui.toast(errs[0] + (errs.length > 1 ? ' (và ' + (errs.length - 1) + ' lỗi khác)' : ''), 'bad');
                if (me.editing) me.showList();
                me.load();
            });
        }).catch(function (err) { ums.api.handle(err, 'xoá'); });
    };

    /* =====================================================================
       Sự kiện — gắn một lần trên root, lọc theo uid để khung lồng nhau
       (ví dụ danh sách con trong biểu mẫu) không bắt nhầm của nhau
       ===================================================================== */
    Crud.prototype.bind = function () {
        var me = this, c = this.cfg;

        this.root.addEventListener('click', function (e) {
            var b = e.target.closest('[data-c]');
            if (!b || !me.root.contains(b)) return;
            var parts = b.getAttribute('data-c').split(':');
            if (parts[0] !== me.uid) return;
            var act = parts[1];
            var i = b.getAttribute('data-i');
            var row = i !== null ? me.rows[Number(i)] : null;

            if (act === 'add') me.showForm(null);
            else if (act === 'edit') me.showForm(row);
            else if (act === 'back') { if (me.z('form') && !me.z('form').hidden) me.showList(); else if (c.back) c.back(); }
            else if (act === 'save') me.save();
            else if (act === 'again') me.save({ again: true });
            else if (act === 'search') me.load(1);
            else if (act === 'reload') me.load();
            else if (act === 'adv') { var av = me.z('adv'); if (av) { av.hidden = !av.hidden; me.danhDauLoc(); } }
            else if (act === 'del') me.remove([row]);
            else if (act === 'delone') me.remove([me.editing], true);
            else if (act === 'delsel') me.remove(me.pickedRows());
            else if (act === 'pick') { if (b.checked) me.selected[i] = true; else delete me.selected[i]; me.syncSelection(); }
            else if (act === 'all') {
                qa(me.root, '[data-c="' + me.uid + ':pick"]').forEach(function (x) {
                    var k = x.getAttribute('data-i');
                    if (b.checked) me.selected[k] = true; else delete me.selected[k];
                });
                me.syncSelection();
            }
            else if (act.indexOf('ra') === 0) c.rowActions[Number(act.slice(2))].onClick(row, me);
            else if (act.indexOf('tool') === 0) c.toolbar[Number(act.slice(4))].onClick(me);
        });

        // Enter trong ô lọc = tìm; đổi ô chọn lọc = tìm ngay
        this.root.addEventListener('keydown', function (e) {
            var el = e.target;
            if (e.key !== 'Enter' || !el.matches || !el.matches('[data-cf="' + me.uid + '"][data-scope="filter"]')) return;
            e.preventDefault();
            me.load(1);
        });
        if (global.jQuery) {
            jQuery(this.root).on('change', 'select[data-cf="' + this.uid + '"][data-scope="filter"]', function () { me.danhDauLoc(); me.load(1); });
        }
        // Ô tìm của cột trái: gõ là tự tìm (400ms sau khi ngừng gõ)
        var hen = 0;
        this.root.addEventListener('input', function (e) {
            if (!e.target.matches || !e.target.matches('[data-cf="' + me.uid + '"][data-tutim]')) return;
            clearTimeout(hen);
            hen = setTimeout(function () { me.load(1); }, 400);
        });
        this.root.addEventListener('change', function (e) {   // ô lọc chữ / ngày trong khung nâng cao
            if (e.target.matches && e.target.matches('input[data-cf="' + me.uid + '"][data-scope="filter"]:not([data-tutim])')) { me.danhDauLoc(); me.load(1); }
        });
        this.danhDauLoc();
    };

    /** Nút "Bộ lọc nâng cao" tô sáng khi khung đang mở hoặc đang có điều kiện lọc */
    Crud.prototype.danhDauLoc = function () {
        var av = this.z('adv'), b = this.root.querySelector('[data-c="' + this.uid + ':adv"]');
        if (!av || !b) return;
        var co = qa(av, '[data-scope="filter"]').some(function (x) { return !!(ums.pat ? ums.pat.val(x) : x.value); });
        b.classList.toggle('is-on', co || !av.hidden);
    };

    ums.crud = function (cfg) { return new Crud(cfg); };
    ums.crud.loadSource = loadSource;

})(window);
