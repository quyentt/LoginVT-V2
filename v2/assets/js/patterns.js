/* =========================================================================
   ums.pat — BỘ BỐ CỤC DÙNG CHUNG
   =========================================================================
   Sổ đăng ký bố cục: _v2/BO-CUC.md — ĐỌC TRƯỚC KHI DỰNG MÀN HÌNH MỚI.

   Lý do có tệp này: cùng một dạng màn hình ở hệ cũ (vd "lưới nhập theo cột
   thời gian") xuất hiện ở hàng chục chỗ, trải khắp các phân hệ. Nếu mỗi màn
   tự dựng lại thì mỗi màn một kiểu — đúng chuyện đã xảy ra ở đợt chuyển
   ApisTaiChinh. Ở đây mỗi bố cục có MỘT bản dựng, màn hình chỉ khai báo dữ
   liệu và lời gọi.

   Bố cục hiện có
   ---------------------------------------------------------------------------
   ums.crud(...)          danh sách + lọc + biểu mẫu   (assets/js/crud.js)
   ums.pat.matrix(...)    lưới nhập: dòng × cột thời gian, sửa ngay trong ô
   ums.pat.pivot(...)     bảng xoay, tiêu đề hai tầng, sửa ngay trong ô
   ums.pat.master(...)    hai cột: danh sách bên trái, nội dung bên phải
   ums.pat.sections(...)  nhiều tab × nhiều khung danh sách (hồ sơ cán bộ)
   ums.pat.rows(...)      lưới dòng nhập có nút "Thêm dòng mới" trong biểu mẫu
   ums.pat.diaChi(...)    ô địa chỉ Tỉnh/Huyện/Xã (setTinhThanh của hệ cũ)
   ums.pat.cards(...)     lưới thẻ (tra cứu số phiếu, hoá đơn) + phân trang
   ums.pat.page/panel/filterBar   khung trang, khung nội dung, thanh lọc
   ums.pat.checks(...)    nhóm ô đánh dấu có ô "Tất cả"
   ums.pat.pickSinhVien(...)       hộp chọn sinh viên (gọn / đầy đủ)
   ums.pat.pickSinhVienNganh(...)  hộp chọn sinh viên bản nhiều ngành
   ums.pat.pickNhanSu(...)         hộp chọn nhân sự (genModal_NhanSu)
   ums.pat.phamVi(...)    khối "Phạm vi áp dụng" (chọn SV / khoá / CT / lớp, lưu cùng kế hoạch)

   QUY TẮC CHUNG (xem BO-CUC.md mục "Quy ước")
     · Thêm/sửa luôn hiện biểu mẫu THAY CHỖ danh sách trong trang
       (ums.crud lo sẵn). Hộp thoại chỉ dành cho việc phụ: chọn sinh viên,
       xem phiếu, xem trước, tiến độ.
     · Không màn nào tự dựng <table>, dòng tổng, ô chọn, hay CSS riêng khi
       bố cục ở đây đã có.
   ========================================================================= */
(function (global) {
    'use strict';

    var ums = global.ums || (global.ums = {});
    var ui = ums.ui;
    var pat = {};

    function esc(s) { return ui.esc(s); }
    function e(v) { return v === undefined || v === null ? '' : v; }
    function qa(root, sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }

    /* Bỏ dấu phẩy ngăn nghìn để lấy số thật (bản gốc: edu.util.convertStrToNum) */
    pat.num = function (v) { return String(e(v)).replace(/,/g, '').trim(); };

    /* Tiền trong Ô NHẬP: dấu phẩy ngăn nghìn, đúng như edu.util.formatCurrency của hệ cũ — đọc ngược ra số
       được (pat.num). Giữ phần thập phân sau dấu chấm (dùng được cho USD). Hiển thị chỉ đọc: ums.ui.money —
       cùng kiểu dấu phẩy (site.config.js `money`, chốt 2026-09-26). */
    pat.money = function (v) {
        var s = pat.num(v);
        if (s === '' || isNaN(Number(s))) return e(v);
        var p = s.split('.');
        return p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (p[1] ? '.' + p[1] : '');
    };

    /* =====================================================================
       Khung trang, khung nội dung, thanh lọc
       ===================================================================== */

    /** Đầu trang: tiêu đề + vùng nút (nút dính đỉnh khi cuộn, xem shell.css) */
    pat.page = function (title, actionsHtml) {
        return '<div class="ums-page__head">' +
            '<h1 class="ums-page__title ums-u-mb-0">' + esc(title) + '</h1>' +
            '<div class="ums-page__actions">' + (actionsHtml || '') + '</div></div>';
    };

    /**
     * Khung nội dung.
     * o = { title, icon, tools, body (HTML), zone (data-z của phần thân),
     *       count (data-z của ô đếm), flush (bỏ đệm thân), cls, foot }
     */
    pat.panel = function (o) {
        o = o || {};
        return '<div class="ums-panel ' + esc(o.cls || '') + '">' +
            /* title: false mà vẫn có tools → vẫn dựng đầu khung (chỉ có nút, không tiêu đề):
               khung "chỉ bảng + nút" không phải bịa ra một cái tên cho có. */
            (o.title === false && !o.tools ? '' :
                '<div class="ums-panel__head' + (o.title === false ? ' ums-panel__head--chinut' : '') + '">' +
                (o.title === false ? '' : '<div class="ums-panel__title"><i class="fa-light ' + esc(o.icon || 'fa-list-ul') + '"></i> ' + esc(o.title || '')) +
                (o.title === false ? '' : (o.count ? ' <span class="ums-u-faint ums-u-fz13" data-z="' + esc(o.count) + '"></span>' : '') + '</div>') +
                '<div class="ums-panel__tools">' + (o.tools || '') + '</div></div>') +
            '<div class="ums-panel__body' + (o.flush ? ' ums-panel__body--flush' : '') + '"' +
            (o.zone ? ' data-z="' + esc(o.zone) + '"' : '') + '>' + (o.body || '') + '</div>' +
            (o.foot ? '<div class="ums-panel__foot">' + o.foot + '</div>' : '') +
            '</div>';
    };

    /**
     * Thanh lọc. fields = [{ key, label, type: 'select'|'text'|'date', multiple, value }]
     * Ô chọn để trống, màn hình tự đổ dữ liệu vào bằng pat.fill.
     * Nút tìm kiếm mang data-a="search".
     */
    pat.filterBar = function (fields, opts) {
        opts = opts || {};
        var h = (fields || []).map(function (f) {
            var attr = ' data-f="' + esc(f.key) + '"' + (f.multiple ? ' multiple' : '') +
                (f.required ? ' data-required' : '');
            if (f.type === 'select') {
                return '<div class="ums-field"><select class="ums-select"' + attr + ' data-ph="' + esc(f.label) + '">' +
                    '<option value="">' + esc(f.label) + '</option></select></div>';
            }
            return '<div class="ums-field"><input class="ums-input"' + attr +
                (f.type === 'date' ? ' data-date' : '') +
                ' placeholder="' + esc(f.label) + '" autocomplete="off"' +
                (f.value !== undefined ? ' value="' + esc(f.value) + '"' : '') + '></div>';
        }).join('');

        if (opts.search !== false) {
            h += '<div class="ums-field ums-field--fit">' +
                ui.btn('search', { text: opts.searchText, attr: { 'data-a': 'search' } }) + '</div>';
        }
        return pat.panel({ title: false, cls: 'ums-u-mb-4', body: '<div class="ums-filter">' + h + (opts.extra || '') + '</div>' });
    };

    /** Đổ dữ liệu vào một ô chọn; giữ giá trị đang chọn nếu còn trong danh sách */
    pat.fill = function (el, rows, o) {
        if (!el) return;
        o = o || {};
        var id = o.id || 'ID', name = o.name || 'TEN';
        var keep = el.multiple ? (global.jQuery ? jQuery(el).val() || [] : []) : el.value;
        var h = el.multiple ? '' : '<option value="">' + esc(o.head !== undefined ? o.head : (el.getAttribute('data-ph') || '-- Chọn --')) + '</option>';
        (rows || []).forEach(function (r) {
            var t = typeof name === 'function' ? name(r) : r[name];
            h += '<option value="' + esc(r[id]) + '">' + esc(t) + '</option>';
        });
        el.innerHTML = h;
        /* Chỉ báo cho select2 vẽ lại (`change.select2`), KHÔNG bắn `change`
           thật: đổ lại danh sách không phải là người dùng chọn. Bắn `change`
           sẽ gọi trình xử lý của màn và kéo theo lời gọi API thừa — đúng
           cách `loadToCombo_data` của hệ cũ. `ums:refresh` để ô chọn nhiều
           vẽ lại dòng tóm tắt. */
        if (el.multiple && global.jQuery) jQuery(el).val(keep);
        else if (keep) el.value = keep;
        if (global.jQuery) jQuery(el).trigger('change.select2').trigger('ums:refresh');
        ui.enhance(el.parentNode || document);
    };

    /* =====================================================================
       Nối tầng Hệ → Khoá → Chương trình → Lớp
       ---------------------------------------------------------------------
           ums.pat.chain([F.he, F.khoa, F.ct, F.lop]);

       Ba luật (luật 1 và 2 người dùng yêu cầu 2026-09-21, bản gốc KHÔNG có):
         1. Tầng trên chưa chọn → mọi tầng dưới bị KHOÁ (disabled). Bản gốc
            nạp sẵn toàn bộ Khoá nên chọn được Khoá khi chưa có Hệ.
         2. Chọn hoặc XOÁ một tầng → xoá trắng mọi tầng dưới. Bản gốc chỉ bắt
            'select2:select', và pat.fill giữ giá trị cũ nếu còn trong danh
            sách mới — bỏ Hệ thì Khoá cũ vẫn nằm nguyên.
         3. Xoá một tầng (trừ tầng cuối) → phát lại 'select2:select' để trình
            xử lý sẵn có của màn nạp lại tầng con. Màn / bộ nối tầng đã tự nghe
            lúc xoá thì truyền { phatLai: false } để khỏi nạp hai lần.

       Bốn bộ nối tầng dùng chung (ums.ref.cascade, ums.ref.cascadeQuyen,
       ums.dmhsB.cascadeQuyen, ums.dmhsB.mucPhi) đã tự gọi hàm này. Màn tự viết
       nối tầng thì gọi thêm một dòng SAU KHI gắn trình xử lý của nó.
       ===================================================================== */
    pat.chain = function (list, o) {
        if (!global.jQuery) return { sync: function () {} };
        o = o || {};
        list = (list || []).filter(function (x) { return x && x.nodeType === 1; });

        function coGiaTri(el) {
            return el.multiple ? (jQuery(el).val() || []).length > 0 : !!el.value;
        }
        /* Tầng i mở khi tầng i-1 đang mở VÀ đã chọn */
        function sync() {
            var mo = true;
            list.forEach(function (el, i) {
                if (i > 0) {
                    if (el.disabled === mo) {
                        el.disabled = !mo;
                        jQuery(el).trigger('change.select2');
                    }
                }
                mo = mo && coGiaTri(el);
            });
        }

        list.forEach(function (el, i) {
            var duoi = list.slice(i + 1);
            jQuery(el).on('select2:select select2:unselect select2:clear', function (ev) {
                duoi.forEach(function (c) {
                    if (c.multiple) jQuery(c).val([]); else c.value = '';
                    jQuery(c).trigger('change.select2').trigger('ums:refresh');
                });
                sync();
                if (ev.type === 'select2:clear' && duoi.length && o.phatLai !== false) {
                    jQuery(el).trigger({ type: 'select2:select', params: { data: { id: '' } } });
                }
            });
            /* Ô chọn KHÔNG qua select2 (ô trong bảng, ô data-no-s2) chỉ bắn `change`
               thật — không có select2:select, nên phải tự xoá trắng ô con ở đây. */
            jQuery(el).on('change', function () {
                if (el.classList.contains('select2-hidden-accessible')) return;   // select2 đã lo ở trên
                duoi.forEach(function (c) {
                    if (c.multiple) jQuery(c).val([]); else c.value = '';
                    jQuery(c).trigger('ums:refresh');
                });
            });
            // Đặt giá trị bằng mã (mở biểu mẫu sửa, nạp lại danh sách) cũng phải mở/khoá lại
            jQuery(el).on('change ums:refresh', sync);
            // Chốt chặn cuối: biểu mẫu bị đặt lại mà không bắn sự kiện nào
            jQuery(el).on('select2:opening', function (ev) {
                sync();
                if (el.disabled) ev.preventDefault();
            });
        });
        sync();
        return { sync: sync };
    };

    /* =====================================================================
       KHUNG "CHƯA đăng ký / ĐÃ đăng ký" — ums.pat.haiLuoi
       ---------------------------------------------------------------------
       Hai bảng xếp dọc: bảng trên có ô đánh dấu + nút "Đăng ký", bảng dưới có
       ô đánh dấu + nút "Hủy đăng ký".
       Dùng ở: dangkyhoc/nguyenvong, dangkyhoc/thilai, sukien/sukien,
       xebus/vethang (trước 2026-09-23 nằm ở dangkyhoc/script/_hailuoi.js,
       hai màn sau phải với sang thư mục module khác để nạp).
       ---------------------------------------------------------------------
       Bản gốc mỗi màn tự dựng hai <table> + ô "chọn tất cả" (checkedAll_BgRow /
       lớp chkSystemSelectAll) + hai nút đặt dưới bảng. Ở đây:
         · bảng qua ums.ui.table, cột ô đánh dấu do khung tự thêm ở CUỐI (như gốc);
         · nút "Đăng ký" (xanh lá như btn-success gốc) ở đầu khung bảng trên;
         · "Hủy đăng ký" là nút xoá nhiều dòng chuẩn (ums.ui.xoaChon) ở đầu khung
           bảng dưới — tự đếm, khoá khi chưa chọn (luật chung 2026-09-22);
         · `nhom: 'COT'` — đánh dấu một dòng thì đánh dấu mọi dòng cùng giá trị
           cột đó (thilai: các thành phần điểm của cùng một học phần — gốc làm
           bằng lớp CSS = DAOTAO_HOCPHAN_ID).

       var hl = ums.pat.haiLuoi(host, {
           chua: { title, icon, columns, empty, nut: { text, icon }, canChon: 'Vui lòng chọn…', onDangKy(rows),
                   kiemTra() → false thì dừng (chạy TRƯỚC khi đếm dòng chọn, như gốc nguyenvong) },
           da:   { title, icon, columns, empty, nut: { text },                                 onHuy(rows) },
           nhom: 'DAOTAO_HOCPHAN_ID'            // tuỳ chọn
       });
       hl.ve('chua' | 'da', rows, cột?)  vẽ lại bảng   hl.nhac(k, chữ)  khung lời nhắc
           (cột truyền vào thay cho cfg[k].columns — dùng khi số cột đổi theo dữ liệu)
       hl.dang(k)                   "Đang tải…"        hl.loi(k, chữ)   khung lỗi
       hl.bang(k)                   phần tử chứa bảng (đọc ô chọn trong dòng)
       ===================================================================== */
    pat.haiLuoi = function (host, o) {
        var K = ['chua', 'da'], ROWS = { chua: [], da: [] };
        var cfg = { chua: o.chua || {}, da: o.da || {} };

        host.innerHTML =
            pat.panel({ title: cfg.chua.title, icon: cfg.chua.icon || 'fa-list-check', count: 'n_chua', flush: true, zone: 'chua',
                tools: ui.btn('save', { text: (cfg.chua.nut || {}).text || 'Đăng ký', icon: (cfg.chua.nut || {}).icon || 'fa-money-check-pen',
                    attr: { 'data-hl': 'dangky' } }) }) +
            '<div class="ums-u-mt-4">' +
            pat.panel({ title: cfg.da.title, icon: cfg.da.icon || 'fa-clipboard-check', count: 'n_da', flush: true, zone: 'da',
                tools: ui.xoaChon('input[data-ck]', { goc: '.ums-panel', text: (cfg.da.nut || {}).text || 'Hủy đăng ký', attr: { 'data-hl': 'huy' } }) }) +
            '</div>';

        function z(k) { return host.querySelector('[data-z="' + k + '"]'); }
        function dem(k, n) { var c = host.querySelector('[data-z="n_' + k + '"]'); if (c) c.textContent = n === null ? '' : '(' + n + ')'; }

        function ve(k, rows, cot) {
            ROWS[k] = Array.isArray(rows) ? rows : [];
            var cols = (cot || cfg[k].columns || []).concat([{
                head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                render: function (r, i) { return '<input type="checkbox" data-ck="' + i + '">'; }
            }]);
            ui.table({ el: z(k), rows: ROWS[k], columns: cols, empty: cfg[k].empty || 'Không có dữ liệu' });
            dem(k, ROWS[k].length);
        }
        function nhac(k, msg, icon) { ROWS[k] = []; z(k).innerHTML = ui.empty(msg, icon || 'fa-hand-pointer'); dem(k, null); }
        function dang(k) { z(k).innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin'); }
        function loi(k, msg) { ROWS[k] = []; z(k).innerHTML = ui.fail(msg); dem(k, null); }
        function chon(k) {
            return Array.prototype.map.call(z(k).querySelectorAll('tbody input[data-ck]:checked'), function (c) { return c; })
                .map(function (c) { return ROWS[k][Number(c.getAttribute('data-ck'))]; }).filter(Boolean);
        }

        K.forEach(function (k) {
            z(k).addEventListener('change', function (ev) {
                var c = ev.target;
                if (!c.matches || !c.matches('input[data-ck]')) return;
                var all = z(k).querySelectorAll('tbody input[data-ck]');
                if (c.getAttribute('data-ck') === 'all') {
                    Array.prototype.forEach.call(all, function (x) { x.checked = c.checked; });
                    return;
                }
                // Cùng nhóm (cùng học phần) thì đánh dấu / bỏ đánh dấu cùng lúc — như bản gốc
                if (o.nhom) {
                    var r = ROWS[k][Number(c.getAttribute('data-ck'))], g = r ? r[o.nhom] : null;
                    if (g !== null && g !== undefined && g !== '') {
                        Array.prototype.forEach.call(all, function (x) {
                            var rr = ROWS[k][Number(x.getAttribute('data-ck'))];
                            if (rr && rr[o.nhom] === g) x.checked = c.checked;
                        });
                    }
                }
                var h = z(k).querySelector('thead input[data-ck="all"]');
                if (h) h.checked = all.length > 0 && Array.prototype.every.call(all, function (x) { return x.checked; });
            });
        });

        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-hl]');
            if (!b || !host.contains(b) || b.disabled) return;
            if (b.getAttribute('data-hl') === 'dangky') {
                if (cfg.chua.kiemTra && !cfg.chua.kiemTra()) return;
                var ds = chon('chua');
                if (!ds.length) { ui.toast(cfg.chua.canChon || 'Vui lòng chọn đối tượng?', 'warn'); return; }
                if (cfg.chua.onDangKy) cfg.chua.onDangKy(ds);
            } else {
                var dx = chon('da');
                if (!dx.length) { ui.toast(cfg.da.canChon || 'Vui lòng chọn đối tượng?', 'warn'); return; }
                if (cfg.da.onHuy) cfg.da.onHuy(dx);
            }
        });

        return { ve: ve, nhac: nhac, dang: dang, loi: loi, chon: chon, bang: z, rows: function (k) { return ROWS[k]; } };
    };

    /* =====================================================================
       Nhãn "Chọn …" của ô chọn đổ từ DANH MỤC
       ---------------------------------------------------------------------
       Hệ cũ (Core/systemroot.js:2350, hàm checkTitle của loadToCombo_data):
       nơi gọi không truyền title thì lấy CHUNG_TENDANHMUC_TEN của chính dữ
       liệu trả về, viết thường, ghép "Chọn ". Tên đó do quản trị nhập ở màn
       quản lý danh mục, nên đổi tên danh mục là nhãn ô chọn đổi theo — không
       được viết cứng trong màn.
       ===================================================================== */
    /* =====================================================================
       Lọc theo từ khoá ở MÁY TRẠM — bỏ dấu, không phân biệt hoa thường
       ---------------------------------------------------------------------
       Dùng khi bản gốc CÓ ô "Nhập từ khóa tìm kiếm" nhưng procedure không
       nhận tham số từ khoá (rất nhiều màn như vậy: ô nhập có, bấm Tìm thì
       gọi lại y nguyên, gõ gì cũng ra cùng kết quả). Bỏ ô đi là lệch bản
       gốc; gửi thêm tham số mà procedure không khai là hỏng lời gọi — nên
       lọc trên danh sách đã tải về.
           rows: mảng đã tải · q: từ khoá · cols: tên cột cần dò
       ===================================================================== */
    function bo_dau(x) {
        return String(x === null || x === undefined ? '' : x)
            .toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
    }
    pat.loc = function (rows, q, cols) {
        q = bo_dau(q).trim();
        if (!q) return rows || [];
        return (rows || []).filter(function (r) {
            return (cols || Object.keys(r)).some(function (c) { return bo_dau(r[c]).indexOf(q) >= 0; });
        });
    };

    pat.dmTitle = function (rows) {
        var t = rows && rows[0] && rows[0].CHUNG_TENDANHMUC_TEN;
        return t ? 'Chọn ' + String(t).toLowerCase() : '';
    };

    /** Giá trị một ô lọc: ô chọn nhiều trả "a,b" như edu.util.getValCombo */
    pat.val = function (el) {
        if (!el) return '';
        if (el.multiple) {
            var v = global.jQuery ? jQuery(el).val() : null;
            return v && v.length ? v.join(',') : '';
        }
        return (el.value || '').trim();
    };

    /* =====================================================================
       Nhóm ô đánh dấu có ô "Tất cả"
       ---------------------------------------------------------------------
       Hệ cũ: genList_TrangThaiSV / genList_DMLKT. Đợt chuyển Tài chính sinh
       ra NĂM bản chép tay, mỗi bản một tên thuộc tính nên không dùng lại
       được của nhau: hoadon/_chung.js H.checks (data-all + value),
       phieuthu/_chung_khac.js PK.checks (data-id), sinhviennotien.js
       checklist (data-ck), dulieuhocphi/_chung.js checkGroup (data-tt),
       danhmucheso/khongbatno.js (data-tt, dựng thẳng trong hộp chọn SV).
       Nay một bản.

       pat.checks(host, rows, {
           all: 'Tất cả' | false,    ô "Tất cả" ở đầu (mặc định có)
           checked: true,            đánh dấu sẵn (mặc định có)
           id: 'ID', name: 'TEN',    cột lấy giá trị / nhãn (name nhận hàm)
           cols: 3,                  số cột lưới (mặc định 2 = .ums-checkgrid)
           cls: '',                  lớp thêm cho lưới
           empty: 'Không có dữ liệu',
           onChange(input)
       })
       `rows` là mảng HOẶC Promise — Promise thì hiện "Đang tải…" rồi tự vẽ,
       lỗi thì báo bằng toast và để trống.

       trả { ids()  → mảng id đang đánh dấu, đúng thứ tự trên màn
                      (= edu.extend.getCheckedCheckBoxByClassName)
             val()  → chuỗi "a,b"
             picked() → chính các DÒNG đang đánh dấu (khỏi nhét dữ liệu vào
                      data-* rồi đọc ngược như bản hoadon cũ)
             set(ids) | setAll(on) | draw(rowsMới) | el }
       ===================================================================== */
    pat.checks = function (host, rows, o) {
        o = o || {};
        var idKey = o.id || 'ID', nameKey = o.name || 'TEN';
        var on = o.checked !== false;
        var data = [];
        var box = document.createElement('div');
        box.className = 'ums-checkgrid' + (o.cols === 3 ? ' ums-checkgrid--3' : '') + (o.cls ? ' ' + o.cls : '');
        // Dấu cho ums.ui.xoaChon: ô của nhóm lọc (đánh dấu sẵn) KHÔNG phải "dòng đã chọn để xoá"
        box.setAttribute('data-pchecks', '');
        host.innerHTML = '';
        host.appendChild(box);

        function draw(list) {
            data = list || [];
            var h = '';
            if (o.all !== false) {
                h += '<label class="ums-check ums-u-semi"><input type="checkbox" data-ck="all"' +
                    (on ? ' checked' : '') + '> ' + esc(typeof o.all === 'string' ? o.all : 'Tất cả') + '</label>';
            }
            data.forEach(function (r) {
                var t = typeof nameKey === 'function' ? nameKey(r) : r[nameKey];
                h += '<label class="ums-check" title="' + esc(t) + '"><input type="checkbox" data-ck="one" value="' +
                    esc(r[idKey]) + '"' + (on ? ' checked' : '') + '> ' + esc(t) + '</label>';
            });
            box.innerHTML = h || '<span class="ums-u-faint ums-u-fz13">' + esc(o.empty || 'Không có dữ liệu') + '</span>';
        }

        function ones() { return qa(box, 'input[data-ck="one"]'); }
        function allBox() { return box.querySelector('input[data-ck="all"]'); }

        box.addEventListener('change', function (ev) {
            var t = ev.target;
            if (!t.matches || !t.matches('input[data-ck]')) return;
            if (t.getAttribute('data-ck') === 'all') {
                ones().forEach(function (x) { x.checked = t.checked; });
            } else {
                var a = allBox();
                if (a) a.checked = ones().every(function (x) { return x.checked; });
            }
            if (o.onChange) o.onChange(t, data[ones().indexOf(t)]);
        });

        if (rows && typeof rows.then === 'function') {
            box.innerHTML = '<span class="ums-u-faint ums-u-fz13">Đang tải…</span>';
            rows.then(draw).catch(function (err) { box.innerHTML = ''; ums.api.handle(err, o.what || 'danh sách lựa chọn'); });
        } else {
            draw(rows);
        }

        return {
            el: box,
            draw: draw,
            ids: function () {
                return ones().filter(function (x) { return x.checked; }).map(function (x) { return x.value; });
            },
            val: function () {
                return ones().filter(function (x) { return x.checked; }).map(function (x) { return x.value; }).join(',');
            },
            picked: function () {
                var xs = ones();
                return data.filter(function (r, i) { return xs[i] && xs[i].checked; });
            },
            set: function (ids) {
                var want = {};
                (ids || []).forEach(function (x) { want[x] = 1; });
                ones().forEach(function (x) { x.checked = !!want[x.value]; });
                var a = allBox();
                if (a) a.checked = ones().every(function (x) { return x.checked; });
            },
            setAll: function (v) {
                ones().forEach(function (x) { x.checked = !!v; });
                var a = allBox();
                if (a) a.checked = !!v;
            }
        };
    };

    /* =====================================================================
       BỐ CỤC: lưới nhập (dòng × cột)
       ---------------------------------------------------------------------
       Thay các lưới nhập hệ số / đơn giá / mức phí của hệ cũ, nơi mỗi ô là
       một bản ghi và người dùng sửa thẳng trong ô rồi bấm "Cập nhật".

       o = {
         el, rows, cols,                    dòng và cột
         rowKey(row) → id, colKey(col) → id, colTitle(col) → chữ
         cells: [],  cellKey(rec) → { r, c } để ghép ô ↔ bản ghi
         value(rec) → giá trị trong ô
         lead: [{ title, prop | render(row), cls, width }]   các cột đầu
         money: true,                        ô tiền (định dạng lúc rời ô)
         onEdit(rec, row, col),              nút sửa trong ô (bỏ thì không có nút)
         readonly: true                      chỉ xem
       }
       trả { dirty() → [{ row, col, rec, value, old }], el }
       ===================================================================== */
    pat.matrix = function (o) {
        var host = typeof o.el === 'string' ? document.querySelector(o.el) : o.el;
        var rows = o.rows || [], cols = o.cols || [];
        var colKey = o.colKey || function (c) { return c.ID; };
        var colTitle = o.colTitle || function (c) { return c.THOIGIAN || c.TEN || c.MA; };
        /* Mỗi lần vẽ lại (Tìm kiếm, lưu xong, xoá xong) lưới dựng trên CÙNG một vùng: gỡ trình xử lý của lần vẽ trước, nếu không thì
           bấm nút sửa ô mở N hộp thoại (mỗi lần vẽ một hộp, kèm dữ liệu cũ) và Enter nhảy N dòng — kiểm host Tài chính 2026-09-30. */
        (host._umsMatrix || []).forEach(function (x) { host.removeEventListener(x[0], x[1]); });
        host._umsMatrix = [];
        function nghe(loai, fn) { host.addEventListener(loai, fn); host._umsMatrix.push([loai, fn]); }
        var map = {};
        (o.cells || []).forEach(function (d) {
            var k = o.cellKey(d);
            map[k.r + '|' + k.c] = d;      // trùng ô thì bản ghi sau thắng, như hệ cũ
        });

        if (!rows.length) {
            host.innerHTML = ui.empty(o.empty || 'Không có dữ liệu');
            return { el: host, dirty: function () { return []; } };
        }

        var h = '<div class="ums-tablewrap' + (o.tall ? ' ums-tablewrap--tall' : '') + '">' +
            '<table class="ums-table ums-table--lined ums-table--tight ums-matrix' +
            (o.text ? ' ums-matrix--text' : '') + '"><thead><tr>' +
            '<th class="is-center" style="width:56px">Stt</th>';
        (o.lead || []).forEach(function (c) {
            h += '<th class="' + esc(c.cls || '') + '"' + (c.width ? ' style="width:' + esc(c.width) + '"' : '') + '>' + esc(c.title) + '</th>';
        });
        cols.forEach(function (c) { h += '<th class="is-center ums-matrix__col">' + esc(colTitle(c)) + '</th>'; });
        h += '</tr></thead><tbody>';

        rows.forEach(function (row, i) {
            var rk = o.rowKey(row);
            h += '<tr><td class="is-center">' + (i + 1) + '</td>';
            (o.lead || []).forEach(function (c) {
                h += '<td class="' + esc(c.cls || '') + '">' + (c.render ? c.render(row) : ui.escBr(row[c.prop])) + '</td>';
            });
            cols.forEach(function (c, j) {
                var rec = map[rk + '|' + colKey(c)];
                var v = rec ? String(e(o.value(rec))) : '';
                h += '<td class="ums-matrix__cell"><div class="ums-cellbox">' +
                    (o.readonly
                        ? '<span class="ums-cellbox__text">' + esc(v) + '</span>'
                        : '<input class="ums-input ums-input--sm" data-mi="' + i + '" data-mj="' + j +
                          '" value="' + esc(v) + '" title="' + esc(v) + '" autocomplete="off">') +
                    (!o.onEdit ? '' : rec
                        ? '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-medit="' + i + ':' + j +
                          '" title="Sửa"><i class="fa-light fa-pen-to-square"></i></button>'
                        // giữ chỗ để các ô thẳng cột dù dòng đó chưa có bản ghi
                        : '<span class="ums-iconbtn" style="visibility:hidden" aria-hidden="true"></span>') +
                    '</div></td>';
            });
            h += '</tr>';
        });
        host.innerHTML = h + '</tbody></table></div>';

        function recAt(i, j) { return map[o.rowKey(rows[i]) + '|' + colKey(cols[j])]; }

        if (o.onEdit) {
            nghe('click', function (ev) {
                var b = ev.target.closest('[data-medit]');
                if (!b || !host.contains(b)) return;
                var p = b.getAttribute('data-medit').split(':');
                o.onEdit(recAt(Number(p[0]), Number(p[1])), rows[Number(p[0])], cols[Number(p[1])]);
            });
        }

        // Di chuyển giữa các ô (thay edu.system.move_ThroughInTable): Enter / ↓ / ↑
        nghe('keydown', function (ev) {
            var t = ev.target;
            if (!t.hasAttribute || !t.hasAttribute('data-mi')) return;
            var d = ev.key === 'Enter' || ev.key === 'ArrowDown' ? 1 : ev.key === 'ArrowUp' ? -1 : 0;
            if (!d) return;
            ev.preventDefault();
            var n = host.querySelector('[data-mi="' + (Number(t.getAttribute('data-mi')) + d) + '"][data-mj="' + t.getAttribute('data-mj') + '"]');
            if (n) { n.focus(); n.select(); }
        });

        if (o.money) {
            nghe('focusout', function (ev) {
                var t = ev.target;
                if (t.hasAttribute && t.hasAttribute('data-mi') && t.value.trim() !== '' && !isNaN(Number(pat.num(t.value)))) {
                    t.value = pat.money(t.value.trim());
                }
            });
        }

        return {
            el: host,
            dirty: function () {
                var out = [];
                qa(host, 'input[data-mi]').forEach(function (inp) {
                    var old = inp.getAttribute('title') || '';
                    var now = inp.value.trim();
                    var changed = o.money ? pat.num(now) !== pat.num(old) : now !== old;
                    if (!changed) return;
                    var i = Number(inp.getAttribute('data-mi')), j = Number(inp.getAttribute('data-mj'));
                    out.push({ row: rows[i], col: cols[j], rec: recAt(i, j) || null, value: now, old: old });
                });
                return out;
            }
        };
    };

    /* =====================================================================
       BỐ CỤC: biểu mẫu THAY CHỖ màn — cho màn KHÔNG dựng bằng ums.crud
       ---------------------------------------------------------------------
       BO-CUC luật 1: thêm / sửa bản ghi chính là biểu mẫu ngay trong trang, KHÔNG bật hộp thoại (người dùng nhắc lại 2026-09-30 với
       các màn lưới nhập Tài chính: "màn hình thêm mới hiện bật modal"). Hàm này nhận đúng cấu hình của ui.dialog và trả đúng hình
       dạng { body, close() } nên màn đang dùng hộp thoại chỉ phải đổi tên hàm gọi.

       o = { host: vùng gốc của màn (mọi phần tử con đang hiện sẽ ẩn đi, đóng thì hiện lại),
             title, icon, body: HTML | phần tử, cols: 1 | 2 (mặc định 2 — ô ngắn hai ô một hàng),
             buttons: [{ text, kind, mod, icon, keepOpen, onClick(api) }]   — Y HỆT ui.dialog: bấm xong tự đóng, trừ khi onClick trả false
                                                                            hoặc nút có keepOpen (lưu bất đồng bộ: trả false rồi tự gọi api.close())
             xoa: { chon, trong, text, onClick(api) }   — nút "Xoá đã chọn" (ui.xoaChon) như tuỳ chọn cùng tên của ui.dialog
             flush: true    — thân sát mép (bảng / màn con chiếm hết bề ngang khung)
             onClose() }
       Cũng dùng cho MÀN CON (danh sách + biểu mẫu của bản ghi con, vd ums.crud({ embedded: true })): truyền thân là vùng chứa, không cần buttons.
       host là vùng sẽ bị thay chỗ: cả màn (root) hoặc một khung con đang mở (khi đó biểu mẫu là tầng hai, nút Đóng của khung ngoài tự ẩn).
       Nút: "Đóng" ngoài cùng bên trái, rồi Xoá, rồi các nút còn lại (Lưu cuối) — đầu khung dính khi cuộn như biểu mẫu crud.
       ===================================================================== */
    pat.formTrang = function (o) {
        var host = typeof o.host === 'string' ? document.querySelector(o.host) : o.host;
        var cu = host._umsFormTrang;
        if (cu) cu.close();                                  // mỗi lúc một biểu mẫu
        var an = Array.prototype.filter.call(host.children, function (x) { return !x.hidden; });
        var buttons = o.buttons || [];
        var f = document.createElement('div');
        f.className = 'ums-formtrang';
        f.innerHTML =
            '<div class="ums-panel"><div class="ums-panel__head">' +
            '<div class="ums-panel__title"><i class="fa-light ' + esc(o.icon || 'fa-pen-to-square') + '"></i> <span>' + esc(o.title || '') + '</span></div>' +
            '<div class="ums-panel__tools">' + ui.btn('close', { attr: { 'data-ft': 'x' } }) +
            (o.xoa ? ui.xoaChon(o.xoa.chon, { trong: o.xoa.trong, goc: '.ums-formtrang', text: o.xoa.text, attr: { 'data-ft': 'xoa' } }) : '') +
            buttons.map(function (b, i) {
                var xoa = b.kind === 'del' || /^X(oá|óa|oa)/.test(b.text || '');   // "Xoá" và "Xóa" (hai cách đặt dấu)
                return ui.btn(xoa ? 'del' : (b.kind && b.kind !== 'close' ? b.kind : 'save'),
                    { text: b.text, mod: xoa ? undefined : b.mod, icon: b.icon, attr: { 'data-ft': String(i) } });
            }).sort(function (a, b) { return (/ums-btn--danger/.test(b) ? 1 : 0) - (/ums-btn--danger/.test(a) ? 1 : 0); }).join('') +
            '</div></div>' +
            '<div class="ums-panel__body' + (o.flush ? ' ums-panel__body--flush' : '') + '"><div class="' + (o.cols === 1 ? '' : 'ums-grid ums-grid--2') + '" data-ft="body"></div></div></div>';
        var body = f.querySelector('[data-ft="body"]');
        if (typeof o.body === 'string') body.innerHTML = o.body;
        else if (o.body) { body.className = ''; body.appendChild(o.body); }   // phần tử: giữ NGUYÊN nút gốc (màn còn tra ô qua chính phần tử đó), lưới do phần tử tự lo
        an.forEach(function (x) { x.hidden = true; });
        // Tầng hai: ẩn cả dãy nút của khung ngoài (đầu khung ngoài chỉ còn tiêu đề), đóng thì hiện lại
        var ngoai = host.closest ? host.closest('.ums-formtrang') : null;
        var nutNgoai = ngoai ? ngoai.querySelector('.ums-panel__tools') : null;
        if (nutNgoai && nutNgoai.hidden) nutNgoai = null;
        if (nutNgoai) nutNgoai.hidden = true;
        /* MỘT nút Đóng (BO-CUC luật 18): luật CSS chỉ ẩn được nút Đóng của khung CHỨA biểu mẫu. Biểu mẫu mở cạnh một khung khác (vd trong
           vùng `extra` dưới biểu mẫu ums.crud) thì nút Đóng kia vẫn hiện → ẩn mọi nút Đóng đang hiện khác của màn, đóng thì trả lại. */
        var man = host.closest ? (host.closest('.ums-page') || host.closest('main') || document.body) : document.body;
        var dongKhac = Array.prototype.filter.call(man.querySelectorAll('.ums-btn--dong'), function (x) {
            return !x.hidden && x.offsetParent && !x.closest('dialog');
        });
        host.appendChild(f);
        dongKhac = dongKhac.filter(function (x) { return !f.contains(x); });
        dongKhac.forEach(function (x) { x.hidden = true; });
        host.setAttribute('data-ft-mo', '');      // CSS ẩn mọi phần tử con khác của host, kể cả phần tử màn bật hiện SAU khi biểu mẫu đã mở
        var api = {
            body: body, el: f, closed: false,
            close: function () {
                if (api.closed) return;
                api.closed = true;
                if (host._umsFormTrang === api) host._umsFormTrang = null;
                if (f.parentNode) f.parentNode.removeChild(f);
                an.forEach(function (x) { x.hidden = false; });
                if (nutNgoai) nutNgoai.hidden = false;
                dongKhac.forEach(function (x) { x.hidden = false; });
                if (!host.querySelector(':scope > .ums-formtrang')) host.removeAttribute('data-ft-mo');
                if (o.onClose) o.onClose();
            }
        };
        host._umsFormTrang = api;
        f.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-ft]');
            // LỒNG NHAU: nút của biểu mẫu tầng trong nổi bọt qua khung ngoài — chỉ nhận nút của CHÍNH khung này
            if (!b || b.closest('.ums-formtrang') !== f || b.getAttribute('data-ft') === 'body') return;
            var k = b.getAttribute('data-ft');
            if (k === 'x') { api.close(); return; }
            if (k === 'xoa') { if (o.xoa && o.xoa.onClick) o.xoa.onClick(api); return; }
            var cfg = buttons[Number(k)];
            if (cfg && cfg.onClick && cfg.onClick(api) === false) return;
            if (cfg && cfg.keepOpen) return;
            api.close();
        });
        /* Gắn select2 / lịch SAU lượt mã hiện tại: màn thường đổ dữ liệu vào ô (el.value = …) ngay sau khi mở, như vẫn làm với ui.dialog
           (hộp thoại không tự gắn). Gắn ngay thì ô chọn hiện trống dù đã có giá trị. Màn tự gọi ui.enhance trước đó cũng không sao. */
        setTimeout(function () { if (!api.closed) ui.enhance(f); }, 0);
        /* Thay chỗ cả màn thì về đầu trang; biểu mẫu con nằm giữa trang (dưới một biểu mẫu / khung khác) thì cuộn tới CHÍNH nó */
        var giua = !!(host.closest && host.closest('.ums-panel, .ums-formtrang'));
        if (giua && f.scrollIntoView) f.scrollIntoView({ block: 'nearest' });
        else global.scrollTo({ top: 0, behavior: 'auto' });
        if (ums.chrome && ums.chrome.reveal) ums.chrome.reveal();
        ui.reveal(f);
        return api;
    };

    /* =====================================================================
       BỐ CỤC: bảng xoay, tiêu đề hai tầng
       ---------------------------------------------------------------------
       Dùng cho "học kỳ × khoản thu × kiểu học" và các bảng chéo khác: tầng
       trên gom nhóm, tầng dưới là cột con. Ô hiện giá trị; rê chuột vào ô
       mới hiện nút sửa/xoá nên bảng không rối.

       o = {
         el,
         groups: [{ title, cols: [{ title, key }] }],   hai tầng tiêu đề
         lead:   [{ title, prop | render(row), cls, width }],
         rows,
         value(row, col) → chuỗi đã sẵn sàng hiển thị (hoặc '' nếu trống)
         has(row, col)   → có bản ghi hay không (quyết định hiện nút sửa/xoá)
         onEdit(row, col), onDelete(row, col)
       }
       ===================================================================== */
    pat.pivot = function (o) {
        var host = typeof o.el === 'string' ? document.querySelector(o.el) : o.el;
        var groups = o.groups || [], rows = o.rows || [];
        var lead = o.lead || [];

        if (!rows.length || !groups.length) {
            host.innerHTML = ui.empty(o.empty || 'Không có dữ liệu');
            return { el: host };
        }

        var h = '<div class="ums-tablewrap"><table class="ums-table ums-table--lined ums-table--tight ums-pivot">' +
            '<thead><tr><th class="is-center" rowspan="2" style="width:56px">Stt</th>';
        lead.forEach(function (c) {
            h += '<th rowspan="2" class="' + esc(c.cls || '') + '"' + (c.width ? ' style="width:' + esc(c.width) + '"' : '') +
                '>' + esc(c.title) + '</th>';
        });
        groups.forEach(function (g) {
            h += '<th class="is-center" colspan="' + g.cols.length + '">' + esc(g.title) + '</th>';
        });
        h += '</tr><tr>';
        groups.forEach(function (g) {
            g.cols.forEach(function (c) { h += '<th class="is-center ums-pivot__col">' + esc(c.title) + '</th>'; });
        });
        h += '</tr></thead><tbody>';

        rows.forEach(function (row, i) {
            h += '<tr><td class="is-center">' + (i + 1) + '</td>';
            lead.forEach(function (c) {
                h += '<td class="' + esc(c.cls || '') + '">' + (c.render ? c.render(row) : ui.escBr(row[c.prop])) + '</td>';
            });
            groups.forEach(function (g, gi) {
                g.cols.forEach(function (c, ci) {
                    var v = o.value(row, c, g);
                    var has = o.has ? o.has(row, c, g) : v !== '' && v !== null && v !== undefined;
                    /* Sửa và xoá bật/tắt riêng: ô trống vẫn cho "sửa" (= tạo
                       mới tại ô) nhưng không cho xoá. Không khai thì theo has(). */
                    var canE = o.onEdit && (o.canEdit ? o.canEdit(row, c, g) : has);
                    var canD = o.onDelete && (o.canDelete ? o.canDelete(row, c, g) : has);
                    var acts = '';
                    if (canE || canD) {
                        acts = '<span class="ums-pivot__acts">' +
                            (canE ? '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-pv="e:' + i + ':' + gi + ':' + ci + '" title="Sửa"><i class="fa-light fa-pen-to-square"></i></button>' : '') +
                            (canD ? '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-pv="d:' + i + ':' + gi + ':' + ci + '" title="Xoá"><i class="fa-light fa-trash-can"></i></button>' : '') +
                            '</span>';
                    }
                    h += '<td class="ums-pivot__cell">' + esc(e(v)) + acts + '</td>';
                });
            });
            h += '</tr>';
        });
        host.innerHTML = h + '</tbody></table></div>';

        // Vẽ lại trên cùng một vùng: gỡ trình xử lý của lần vẽ trước (nếu không, bấm Sửa / Xoá chạy N lần với dữ liệu cũ — như pat.matrix)
        if (host._umsPivot) host.removeEventListener('click', host._umsPivot);
        host._umsPivot = function (ev) {
            var b = ev.target.closest('[data-pv]');
            if (!b || !host.contains(b)) return;
            var p = b.getAttribute('data-pv').split(':');
            var row = rows[Number(p[1])], g = groups[Number(p[2])], col = g.cols[Number(p[3])];
            if (p[0] === 'e' && o.onEdit) o.onEdit(row, col, g);
            if (p[0] === 'd' && o.onDelete) o.onDelete(row, col, g);
        };
        host.addEventListener('click', host._umsPivot);

        return { el: host };
    };

    /* =====================================================================
       BỐ CỤC: hai cột — danh sách bên trái, nội dung bên phải
       ---------------------------------------------------------------------
       Dùng cho: chọn sinh viên rồi thu tiền, chọn chương trình rồi xem học
       phần, chọn đối tượng rồi xem định mức…

       o = { el, title, actions,
             side: { title, icon, tools: HTML (nút ở đầu khung trái),
                     search: 'chữ gợi ý' | false, filter: HTML (tự có đệm),
                     footer: HTML (phân trang dưới danh sách), width,
                     kieu: 'danhmuc' — danh sách là DANH MỤC: vẽ kiểu cây thư mục
                           (đường chấm, biểu tượng thư mục, số lượng thành nhãn tròn).
                           Cây lồng: <ul><li><button class="ums-master__item">…</li></ul> },
             main: { title, icon, tools } }
       trả { el, side, main, sideBody, sideFoot, sideCount, mainBody, search }

       Mục trong danh sách trái: `<button class="ums-master__item">` — mục có
       nút thao tác riêng thì dùng `<div class="ums-master__item">` (nút lồng
       nút là HTML sai) và đặt nút trong `<span class="ums-master__item__act">`.
       ===================================================================== */
    pat.master = function (o) {
        var host = typeof o.el === 'string' ? document.querySelector(o.el) : o.el;
        var s = o.side || {}, m = o.main || {};

        var sideBody =
            (s.search === false ? '' :
                '<div class="ums-master__search"><div class="ums-searchbar ums-searchbar--sm">' +
                '<span class="ums-searchbar__icon"><i class="fa-light fa-magnifying-glass"></i></span>' +
                '<input class="ums-searchbar__input" data-a="q" type="text" autocomplete="off" placeholder="' +
                esc(s.search || 'Tìm kiếm') + '"></div></div>') +
            (s.filter ? '<div class="ums-master__filter">' + s.filter + '</div>' : '') +
            '<div class="ums-master__list" data-z="side"></div>' +
            '<div class="ums-master__foot" data-z="sideFoot">' +
                (s.page ? ui.pager(s.page, s.page.shown || 0) : (s.footer || '')) + '</div>';

        host.innerHTML =
            (o.title ? pat.page(o.title, o.actions || '') : '') +
            '<div class="ums-master' + (s.kieu === 'danhmuc' ? ' ums-master--danhmuc' : '') + '"' + (s.width ? ' style="--ums-master-side:' + esc(s.width) + '"' : '') + '>' +
            '<aside class="ums-master__side">' +
                pat.panel({ title: s.title || 'Danh sách', icon: s.icon || (s.kieu === 'danhmuc' ? 'fa-folder-tree' : 'fa-list-ul'), tools: s.tools,
                            body: sideBody, flush: true, count: 'sideCount' }) +
            '</aside>' +
            '<div class="ums-master__main" data-z="main">' +
                (m.title === false ? '' : pat.panel({ title: m.title || '', icon: m.icon, tools: m.tools,
                                                      count: m.count ? 'mainCount' : '', zone: 'mainBody', body: '' })) +
            '</div></div>';

        var api = {};

        /* =================================================================
           Mở biểu mẫu thì GIẤU nút thao tác ở đầu trang
           -----------------------------------------------------------------
           Luật dính đỉnh (assets/css/objects/shell.css): đầu trang dính khi
           nó có nút; đầu khung chỉ dính khi đầu trang KHÔNG có nút — để hai
           thanh không bao giờ cùng dính. Đang mở biểu mẫu thì thanh đáng dính
           là thanh có Lưu / Đóng, không phải nút "Thêm mới" (bấm cũng chẳng
           để làm gì lúc đó). ums.crud đã làm đúng vậy từ đầu (crud.js:519);
           màn dựng bằng pat.master trước đây bỏ sót nên cuộn xuống giữa biểu
           mẫu dài là mất luôn nút Lưu.
           ================================================================= */
        api.formMode = function (on) {
            var a = host.querySelector('.ums-page__head .ums-page__actions');
            if (a) a.hidden = !!on;
        };

        /** Vẽ lại phân trang của danh sách bên trái */
        api.setPage = function (page) {
            var f = host.querySelector('[data-z="sideFoot"]');
            if (!f) return;
            f.innerHTML = ui.pager(page, page.shown || 0);
            ui.pagerBind(f, page);
        };

        return Object.assign(api, {
            el: host,
            side: host.querySelector('.ums-master__side'),
            main: host.querySelector('.ums-master__main'),
            sideBody: host.querySelector('[data-z="side"]'),
            sideFoot: host.querySelector('[data-z="sideFoot"]'),
            sideCount: host.querySelector('[data-z="sideCount"]'),
            mainBody: host.querySelector('[data-z="mainBody"]') || host.querySelector('[data-z="main"]'),
            mainCount: host.querySelector('[data-z="mainCount"]'),
            search: host.querySelector('[data-a="q"]')
        });
    };

    /**
     * Một mục trong danh sách bên trái của pat.master.
     * o = { text, sub, active, id, act: HTML nút thao tác }
     * Có `act` thì dựng bằng <div> (không lồng nút trong nút).
     */
    pat.masterItem = function (o) {
        var cls = 'ums-master__item' + (o.active ? ' is-active' : '');
        var inner = '<span class="ums-master__item__main">' + esc(o.text) +
            (o.sub ? '<span class="ums-master__item__sub">' + esc(o.sub) + '</span>' : '') + '</span>' +
            (o.act ? '<span class="ums-master__item__act">' + o.act + '</span>' : '');
        var attr = (o.id !== undefined ? ' data-id="' + esc(o.id) + '"' : '');
        return o.act
            ? '<div class="' + cls + '"' + attr + '>' + inner + '</div>'
            : '<button type="button" class="' + cls + '"' + attr + '>' + inner + '</button>';
    };

    /* =====================================================================
       BỐ CỤC: lưới thẻ
       ---------------------------------------------------------------------
       Tra cứu số phiếu / hoá đơn: mỗi bản ghi là một thẻ bấm được, phân
       trang phía dưới.

       o = { el, items, render(item, i) → HTML bên trong thẻ, tone(item) →
             '' | 'ok' | 'bad' | 'warn' | 'mute' | 'info', onPick(item, i),
             title(item) / attrs(item) → thuộc tính đặt lên thẻ,
             actions(item, i) → HTML nút trong thẻ (khi có: thẻ dựng bằng
                 <div>, vì nút lồng trong nút là HTML sai; phần nội dung vẫn
                 bấm được nếu có onPick),
             page: { index, size, total, onChange } }
       ===================================================================== */
    pat.cards = function (o) {
        var host = typeof o.el === 'string' ? document.querySelector(o.el) : o.el;
        var items = o.items || [];

        if (!items.length) {
            host.innerHTML = ui.empty(o.empty || 'Không có dữ liệu', o.emptyIcon);
            return { el: host };
        }

        // o.cls: lớp thêm cho chính vùng .ums-cards (đổi số cột, khoảng cách… ở từng màn)
        host.innerHTML = '<div class="ums-cards' + (o.cls ? ' ' + esc(o.cls) : '') + '">' + items.map(function (it, i) {
            var tone = o.tone ? o.tone(it) : '';
            // attrs(item) → { title: 'chữ hiện khi rê chuột', … }
            var extra = '';
            var a = o.attrs ? o.attrs(it, i) : null;
            if (o.title) extra += ' title="' + esc(o.title(it, i)) + '"';
            if (a) Object.keys(a).forEach(function (k) { extra += ' ' + k + '="' + esc(a[k]) + '"'; });

            var acts = o.actions ? o.actions(it, i) : '';
            var cls = 'ums-card' + (tone ? ' ums-card--' + esc(tone) : '');
            if (!acts) {
                return '<button type="button" class="' + cls + '" data-card="' + i + '"' + extra + '>' +
                    o.render(it, i) + '</button>';
            }
            return '<div class="' + cls + ' ums-card--acts"' + extra + '>' +
                '<div class="ums-card__body"' + (o.onPick ? ' data-card="' + i + '"' : '') + '>' + o.render(it, i) + '</div>' +
                '<div class="ums-card__acts">' + acts + '</div></div>';
        }).join('') + '</div>' + (o.page ? ui.pager(o.page, items.length) : '');

        /* Vẽ lại lưới thẻ trên CÙNG một phần tử là chuyện thường (đổi trang, đổi bộ
           lọc). Trước đây mỗi lần vẽ lại gắn thêm một trình xử lý click → bấm một
           thẻ mở N hộp thoại. Ở đây gỡ trình xử lý của lần vẽ trước. */
        if (host.__umsCardPick) { host.removeEventListener('click', host.__umsCardPick); host.__umsCardPick = null; }
        if (o.onPick) {
            host.__umsCardPick = function (ev) {
                var b = ev.target.closest('[data-card]');
                if (b && host.contains(b)) o.onPick(items[Number(b.getAttribute('data-card'))], Number(b.getAttribute('data-card')));
            };
            host.addEventListener('click', host.__umsCardPick);
        }
        ui.pagerBind(host, o.page);
        return { el: host };
    };

    /* =====================================================================
       BỐ CỤC: bảng gộp ô theo nhóm
       ---------------------------------------------------------------------
       Thay `edu.system.actionRowSpan` của hệ cũ: mỗi nhóm (khối kiến thức,
       đợt, loại…) chiếm một khối dòng, các cột của NHÓM gộp lại bằng
       rowspan, các cột của DÒNG liệt kê bình thường.

       o = {
         el, groups: [{ row: <dòng nhóm>, rows: [<dòng con>] }],
         head: [[{ title, colspan }], …]        tiêu đề nhiều tầng (tuỳ chọn)
         groupCols: [{ title, prop | render(g), cls, width }]   cột của nhóm
         cols:      [{ title, prop | render(row, i), cls, width }]  cột của dòng
         stt: true      thêm cột Stt đánh số trong từng nhóm
         foot: HTML     nội dung vùng ums-tablefoot dưới bảng
         empty
       }
       ===================================================================== */
    pat.groupTable = function (o) {
        var host = typeof o.el === 'string' ? document.querySelector(o.el) : o.el;
        var groups = (o.groups || []).filter(function (g) { return (g.rows || []).length; });
        if (!groups.length) { host.innerHTML = ui.empty(o.empty || 'Không có dữ liệu'); return { el: host }; }

        var gc = o.groupCols || [], rc = o.cols || [];
        var head = '';
        if (o.head) {
            head = o.head.map(function (r) {
                return '<tr>' + r.map(function (c) {
                    return '<th class="is-center"' + (c.colspan ? ' colspan="' + c.colspan + '"' : '') +
                        (c.rowspan ? ' rowspan="' + c.rowspan + '"' : '') + '>' + esc(c.title) + '</th>';
                }).join('') + '</tr>';
            }).join('');
        }
        head += '<tr>' + gc.map(th).join('') + (o.stt ? '<th class="is-center" style="width:56px">Stt</th>' : '') +
            rc.map(th).join('') + '</tr>';

        function th(c) {
            return '<th class="' + esc(c.cls || '') + '"' + (c.width ? ' style="width:' + esc(c.width) + '"' : '') +
                '>' + esc(c.title || '') + '</th>';
        }

        var body = groups.map(function (g) {
            var rows = g.rows || [];
            return rows.map(function (r, i) {
                var tds = '';
                if (i === 0) {
                    var rs = ' rowspan="' + rows.length + '"';
                    tds += gc.map(function (c) {
                        return '<td class="ums-gtable__g ' + esc(c.cls || '') + '"' + rs + '>' +
                            (c.render ? c.render(g.row, g) : ui.escBr(g.row[c.prop])) + '</td>';
                    }).join('');
                }
                if (o.stt) tds += '<td class="is-center">' + (i + 1) + '</td>';
                tds += rc.map(function (c) {
                    return '<td class="' + esc(c.cls || '') + '">' + (c.render ? c.render(r, i, g) : ui.escBr(r[c.prop])) + '</td>';
                }).join('');
                return '<tr>' + tds + '</tr>';
            }).join('');
        }).join('');

        host.innerHTML = '<div class="ums-tablewrap' + (o.tall ? ' ums-tablewrap--tall' : '') + '">' +
            '<table class="ums-table ums-table--lined ums-gtable"><thead>' + head + '</thead><tbody>' +
            body + '</tbody></table></div>' +
            (o.foot ? '<div class="ums-tablefoot">' + o.foot + '</div>' : '');
        return { el: host };
    };

    /** Một ô tổng trong ums-tablefoot: nhãn + số */
    pat.footSum = function (label, value) {
        return '<span>' + esc(label) + ': <b>' + esc(e(value)) + '</b></span>';
    };

    /** Một dòng trong thẻ: nhãn trái, giá trị phải */
    pat.cardRow = function (label, value) {
        return '<span class="ums-card__row"><span>' + esc(label) + '</span><b>' + esc(e(value)) + '</b></span>';
    };

    /* =====================================================================
       BỐ CỤC: hộp chọn sinh viên
       ---------------------------------------------------------------------
       Thay edu.extend.genModal_SinhVien. Ba module từng tự viết ba bản —
       nay dùng chung một bản.

       Hai kiểu, chọn bằng `filters`:

       a) GỌN (mặc định) — ô tìm + bảng, mỗi dòng một nút "Chọn":
          o = { params() → tham số lọc lúc mở,
                searchParams() → tham số khi bấm Tìm (mặc định = params),
                isPicked(id), onPick(row) → false nếu không nhận,
                title, size, multi: false → chọn xong đóng hộp }

       b) ĐẦY ĐỦ — `filters: true`: thêm bộ lọc nối tầng Hệ → Khoá → Chương
          trình → Lớp (chọn nhiều), khối trạng thái người học, ô đánh dấu
          chọn nhiều dòng, nút "Chọn sinh viên" ở chân hộp:
          o = { filters: true, status: fn(el) → { ids() }, columns: [...],
                call(p, page, size) → tham số lời gọi (mặc định
                    pkg_hosohocvien.LayDanhSachHoSo),
                group: { khoa(), chuongTrinh(), lop() }  → nút "Thêm từng…",
                onPick(rows) }

       Trả về hộp thoại (ums.ui.dialog) — gọi .close() khi cần.
       ===================================================================== */
    pat.pickSinhVien = function (o) {
        o = o || {};
        if (o.filters) return pickFull(o);
        var base = o.params ? o.params() : {};
        var page = 1, size = 10, list = [];

        var dlg = ui.dialog({
            title: o.title || 'Tìm kiếm sinh viên', icon: 'fa-user-magnifying-glass', size: o.size || 'lg',
            body: '<div class="ums-row ums-u-mb-4">' +
                '<div class="ums-u-flex1"><input class="ums-input" data-sv="q" placeholder="Nhập mã hoặc tên sinh viên" autocomplete="off"></div>' +
                ui.btn('search', { attr: { 'data-sv': 'go' } }) + '</div>' +
                '<div data-sv="tbl"></div>'
        });
        var q = dlg.body.querySelector('[data-sv="q"]');
        var tbl = dlg.body.querySelector('[data-sv="tbl"]');

        function load(p, params) {
            page = p || 1;
            if (params) base = params;
            tbl.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            var x = {};
            Object.keys(base || {}).forEach(function (k) { x[k] = base[k]; });
            x.strTuKhoa = q.value.trim();
            x.pageIndex = page;
            x.pageSize = size;

            ums.ref.sinhVienPage(x).then(function (r) {
                list = r.rows;
                ui.table({
                    el: tbl, rows: list, empty: 'Không tìm thấy sinh viên',
                    page: { index: page, size: size, total: r.total, onChange: function (n) {
                        if (n >= 1 && n <= Math.ceil(r.total / size)) load(n);
                    } },
                    columns: [
                        { title: 'Họ tên', render: function (s) { return esc(e(s.HODEM) + ' ' + e(s.TEN)); } },
                        { title: 'Mã sinh viên', prop: 'MASONGUOIHOC', cls: 'is-nowrap' },
                        { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_N1_TEN', cls: 'is-nowrap' },
                        { title: '', cls: 'is-center', width: '110px', render: function (s, i) {
                            return (o.isPicked && o.isPicked(s.ID))
                                ? ui.badge('Đã chọn', 'ok')
                                : '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm" data-svpick="' + i +
                                  '"><i class="fa-light fa-plus"></i><span>Chọn</span></button>';
                        } }
                    ]
                });
            }).catch(function (err) {
                tbl.innerHTML = ui.fail(err.message);
                ums.api.handle(err, 'tìm sinh viên');
            });
        }

        dlg.body.addEventListener('click', function (ev) {
            if (ev.target.closest('[data-sv="go"]')) return load(1, o.searchParams ? o.searchParams() : null);
            var b = ev.target.closest('[data-svpick]');
            if (!b) return;
            var s = list[Number(b.getAttribute('data-svpick'))];
            if (s && o.onPick(s) !== false) {
                if (o.multi === false) return dlg.close();
                b.outerHTML = ui.badge('Đã chọn', 'ok');
            }
        });
        q.addEventListener('keydown', function (ev) {
            if (ev.key === 'Enter') { ev.preventDefault(); load(1, o.searchParams ? o.searchParams() : null); }
        });

        load(1);
        q.focus();
        return dlg;
    };

    /* =====================================================================
       Hộp chọn sinh viên — bản NHIỀU NGÀNH
       ---------------------------------------------------------------------
       Hệ cũ: edu.extend.genModal_SinhVien (Core/systemextend.js:918). Khác
       pat.pickSinhVien ở nguồn: pkg_hosohocvien.LayDanhSachHoSoNhieuNganh
       (một người học nhiều ngành → mỗi ngành một dòng), nên cột và tên khoá
       cũng khác (QLSV_NGUOIHOC_*). Đây là bản dùng ở dulieuhocphi,
       giahanthu và danhmucheso/khongbatno — trước có hai bản chép tay.

           ums.pat.pickSinhVienNganh({
               onPick:  function (rows) { … },       // nút "Chọn sinh viên"
               onGroup: function (kind, ids, names) { … }   // "Thêm từng khoá/chương trình/lớp"
           });                                        //  (chỉ hiện khi có onGroup; names = chữ các mục đã chọn)

       rows là dòng của LayDanhSachHoSoNhieuNganh (ID, QLSV_NGUOIHOC_ID,
       DAOTAO_TOCHUCCHUONGTRINH_ID, QLSV_NGUOIHOC_MASO…). Chọn giữ qua các
       trang (bản gốc chỉ lấy trang đang hiện).
       ===================================================================== */
    pat.pickSinhVienNganh = function (opts) {
        opts = opts || {};
        function nhom(kind) {
            return function (ids, params, dlg) {
                var arr = ids ? ids.split(',') : [];
                if (!arr.length) {
                    ui.toast('Chưa chọn ' + ({ khoa: 'khóa', ct: 'chương trình', lop: 'lớp' })[kind] + ' nào.', 'warn');
                    return;
                }
                // Tên các mục đã chọn — để màn hiện "Áp dụng cho khóa: …" như bản gốc
                var sel = dlg.body.querySelector('[data-f="' + kind + '"]');
                var names = sel ? Array.prototype.filter.call(sel.options, function (x) { return x.selected && x.value; })
                    .map(function (x) { return x.text; }) : [];
                dlg.close();
                opts.onGroup(kind, arr, names);
            };
        }

        return pat.pickSinhVien({
            filters: true,
            title: opts.title,
            /* Trạng thái người học: bản gốc lấy qua loadToCombo_DanhMucDuLieu
               ("QLSV.TRANGTHAI") = CMS_DanhMucThuocTinh. */
            status: function (el) { return pat.checks(el, ums.api.dm('QLSV.TRANGTHAI'), { cols: 3, what: 'trạng thái sinh viên' }); },
            columns: [
                { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                { title: 'Họ tên', render: function (r) { return esc(e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN)); } },
                { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' },
                { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' },
                { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                { title: 'Trạng thái', prop: 'QLSV_TRANGTHAINGUOIHOC_TEN' }
            ],
            // Tham số chép nguyên bản gốc, khác bản mặc định LayDanhSachHoSo.
            call: function (p, page, size) {
                return {
                    action: 'SV_HoSoHocVien_MH/DSA4BSAvKRIgIikJLhIuDykoJDQPJiAvKQPP',
                    func: 'pkg_hosohocvien.LayDanhSachHoSoNhieuNganh',
                    strTuKhoa: p.strTuKhoa,
                    strNamNhapHoc: '',
                    strKhoaQuanLy_Id: '',
                    strHeDaoTao_Id: p.strHeDaoTao_Id,
                    strKhoaDaoTao_Id: p.strKhoaDaoTao_Id,
                    strChuongTrinh_Id: p.strChuongTrinh_Id,
                    strLopQuanLy_Id: p.strLopQuanLy_Id,
                    strTrangThaiNguoiHoc_Id: p.strTrangThaiNguoiHoc_Id,
                    strNguoiTao_Id: '',
                    pageIndex: page,
                    pageSize: size
                };
            },
            group: opts.onGroup ? { khoa: nhom('khoa'), chuongTrinh: nhom('ct'), lop: nhom('lop') } : null,
            onPick: opts.onPick
        });
    };

    /* =====================================================================
       Hộp chọn NHÂN SỰ — ums.pat.pickNhanSu
       ---------------------------------------------------------------------
       Thay edu.extend.genModal_NhanSu + getList_NhanSu (Core/systemextend.js:67,
       186) — hơn 100 màn gốc dùng. Bộ lọc: Đơn vị (cơ cấu tổ chức, chọn nhiều),
       Cán bộ trong / ngoài trường (-1 / 0 / 1), từ khoá; phân trang ở máy chủ.
       Lời gọi: ums.ref.nhanSuPage (pkg_nhansu_hoso_v2.LayDSNhanSu_HoSo_v2).

           ums.pat.pickNhanSu({
               title: 'Tìm kiếm giảng viên',        // chữ bản gốc
               onPick: function (rows, hop) { … },   // dòng máy chủ: ID, MASO, HOTEN, HODEM, TEN…
               footExtra: HTML,                      // tuỳ chọn — ô thêm ở chân hộp
               loaiCanBo: '1'                        // tuỳ chọn — đặt sẵn ô Trong/ngoài trường ('-1' | '0' | '1')
           });

       Khác bản gốc: "Chọn nhân sự" khi chưa đánh dấu ai thì báo (bản gốc vẫn
       gọi callback với mảng rỗng rồi đóng hộp); chọn giữ qua các trang (bản
       gốc chỉ lấy trang đang hiện). "Thêm từng đơn vị" bản gốc không có xử lý
       → giữ nút, đặt disabled.
       ===================================================================== */
    pat.pickNhanSu = function (o) {
        o = o || {};
        var page = 1, size = o.pageSize || 10, total = 0, rows = [], picked = {};
        var dlg = ui.dialog({
            title: o.title || 'Tìm kiếm giảng viên', icon: 'fa-user-magnifying-glass', size: o.size || 'xl',
            body:
                '<div class="ums-filter">' +
                    '<div class="ums-field"><select class="ums-select" multiple data-f="dv" data-ph="Chọn đơn vị"></select></div>' +
                    '<div class="ums-field"><select class="ums-select" data-f="cb">' +
                        '<option value="-1">Tất cả nhân sự</option><option value="0">Cán bộ trong trường</option><option value="1">Cán bộ ngoài trường</option>' +
                    '</select></div>' +
                    '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
                '</div>' +
                '<div class="ums-row ums-u-mt-4"><span class="ums-u-fz13 ums-u-muted">Thêm nhiều:</span>' +
                    '<button type="button" class="ums-btn ums-btn--out-success ums-btn--sm" disabled title="Bản gốc chưa có xử lý">' +
                    '<i class="fa-light fa-plus"></i><span>Thêm từng đơn vị</span></button></div>' +
                '<div class="ums-row ums-row--between ums-u-mt-4">' +
                    '<b class="ums-u-navy">Danh sách <span class="ums-u-faint ums-u-fz13" data-f="n"></span></b>' +
                    '<span class="ums-u-fz13 ums-u-muted" data-f="sel"></span></div>' +
                '<div class="ums-u-mt-2" data-f="tbl"></div>',
            buttons: [{ text: o.okText || 'Chọn nhân sự', kind: 'save', onClick: function () {
                var list = Object.keys(picked).map(function (k) { return picked[k]; });
                if (!list.length) { ui.toast('Vui lòng chọn ít nhất 1 nhân sự!', 'warn'); return false; }
                if (o.onPick) o.onPick(list, dlg.el);
            } }]
        });
        /* footExtra: HTML đặt ở chân hộp, cạnh nút "Chọn nhân sự" (vd ô "Thông tin
           phân giảng" của hoatdong/phangiangvien — bản gốc chèn ngay sau #btnChonNhanSu).
           Đọc lại trong onPick(list, hộp). */
        if (o.footExtra) dlg.el.querySelector('.ums-dialog__foot').insertAdjacentHTML('afterbegin', '<div class="ums-dialog__extra">' + o.footExtra + '</div>');
        var B = dlg.body;
        function f(k) { return B.querySelector('[data-f="' + k + '"]'); }
        if (o.loaiCanBo !== undefined) f('cb').value = String(o.loaiCanBo);
        ui.enhance(B);
        ums.ref.coCauToChuc({}).then(function (ds) { pat.fill(f('dv'), ds, { name: 'TEN' }); })
            .catch(function (err) { ums.api.handle(err, 'đơn vị'); });

        function ten(r) { return (r.LOAICHUCDANH_MA ? r.LOAICHUCDANH_MA + '. ' : '') + (r.LOAIHOCVI_MA ? r.LOAIHOCVI_MA + '. ' : '') + e(r.HOTEN); }
        function sinh(r) { return [r.NGAYSINH, r.THANGSINH, r.NAMSINH].filter(function (x) { return !(x === null || x === undefined || x === ''); }).join('/'); }
        function search(p) {
            if (p) page = p;
            f('tbl').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            ums.ref.nhanSuPage({
                strTuKhoa: (f('q').value || '').trim(), strCoCauToChuc_Id: pat.val(f('dv')),
                dLaCanBoNgoaiTruong: f('cb').value || 1, strTinhTrangNhanSu_Id: '', pageIndex: page, pageSize: size
            }).then(function (r) { rows = r.rows; total = r.total; draw(); })
              .catch(function (err) { f('tbl').innerHTML = ui.fail(err.message); ums.api.handle(err, 'tìm nhân sự'); });
        }
        function draw() {
            f('n').textContent = '(' + total + ')';
            ui.table({
                el: f('tbl'), rows: rows, empty: 'Không tìm thấy nhân sự',
                page: { index: page, size: size, total: total, onChange: function (p) { if (p >= 1 && p <= Math.ceil(total / size)) search(p); },
                        onSize: function (v) { size = v === 'all' ? Math.max(total, 1) : Number(v); search(1); } },
                columns: [
                    { title: 'Mã số', prop: 'MASO', cls: 'is-nowrap' },
                    { title: 'Họ tên', render: function (r) { return esc(ten(r)); } },
                    { title: 'Ngày sinh', cls: 'is-center is-nowrap', render: function (r) { return esc(sinh(r)); } },
                    { title: 'Giới tính', prop: 'GIOITINH_TEN', cls: 'is-center' },
                    { head: '<input type="checkbox" data-ns="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                      render: function (r, i) { return '<input type="checkbox" data-ns="' + i + '"' + (picked[r.ID] ? ' checked' : '') + '>'; } }
                ]
            });
            sync();
        }
        function sync() {
            var n = Object.keys(picked).length;
            f('sel').textContent = n ? 'Đã chọn ' + n + ' nhân sự' : '';
            qa(f('tbl'), 'input[data-ns]').forEach(function (x) {
                if (x.getAttribute('data-ns') === 'all') return;
                var tr = x.closest('tr'); if (tr) tr.classList.toggle('is-selected', x.checked);
            });
        }
        f('tbl').addEventListener('change', function (ev) {
            var t = ev.target;
            if (!t.matches || !t.matches('input[data-ns]')) return;
            var k = t.getAttribute('data-ns');
            if (k === 'all') {
                rows.forEach(function (r, i) {
                    if (t.checked) picked[r.ID] = r; else delete picked[r.ID];
                    var c = f('tbl').querySelector('input[data-ns="' + i + '"]'); if (c) c.checked = t.checked;
                });
            } else {
                var r = rows[Number(k)];
                if (t.checked) picked[r.ID] = r; else delete picked[r.ID];
            }
            sync();
        });
        B.addEventListener('click', function (ev) { if (ev.target.closest('[data-a="search"]')) search(1); });
        f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); search(1); } });
        search(1);
        return dlg;
    };

    /* Bản ĐẦY ĐỦ của hộp chọn sinh viên — xem chú thích pat.pickSinhVien */
    function pickFull(o) {
        var page = 1, size = o.pageSize || 10, total = 0, rows = [], picked = {};

        var body =
            '<div class="ums-filter">' +
                fsel('he', 'Tất cả hệ đào tạo') + fsel('khoa', 'Tất cả khóa đào tạo') +
                fsel('ct', 'Tất cả chương trình đào tạo') + fsel('lop', 'Tất cả lớp') +
                '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
            '</div>' +
            (o.group ? '<div class="ums-row ums-u-mt-4"><span class="ums-u-fz13 ums-u-muted">Thêm nhiều:</span>' +
                gbtn('khoa', 'Thêm từng khóa') + gbtn('ct', 'Thêm từng chương trình') + gbtn('lop', 'Thêm từng lớp') + '</div>' : '') +
            (o.status ? '<div class="ums-u-mt-4"><div class="ums-u-fz13 ums-u-semi ums-u-mb-2">Trạng thái</div><div data-f="tt"></div></div>' : '') +
            '<div class="ums-row ums-row--between ums-u-mt-4">' +
                '<b class="ums-u-navy">Danh sách <span class="ums-u-faint ums-u-fz13" data-f="n"></span></b>' +
                '<span class="ums-u-fz13 ums-u-muted" data-f="sel"></span></div>' +
            '<div class="ums-u-mt-2" data-f="tbl"></div>';

        function fsel(k, ph) {
            return '<div class="ums-field"><select class="ums-select" multiple data-f="' + k + '" data-ph="' + esc(ph) + '"></select></div>';
        }
        function gbtn(k, text) {
            return '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm" data-g="' + k + '">' +
                '<i class="fa-light fa-plus"></i><span>' + esc(text) + '</span></button>';
        }

        var dlg = ui.dialog({
            title: o.title || 'Tìm kiếm sinh viên', icon: 'fa-user-magnifying-glass', size: o.size || 'xl', body: body,
            buttons: [{ text: o.okText || 'Chọn sinh viên', kind: 'save', onClick: function () {
                var list = Object.keys(picked).map(function (k) { return picked[k]; });
                if (!list.length) { ui.toast('Vui lòng chọn ít nhất 1 sinh viên!', 'warn'); return false; }
                if (o.onPick) o.onPick(list);
            } }]
        });

        var B = dlg.body;
        function f(k) { return B.querySelector('[data-f="' + k + '"]'); }
        ui.enhance(B);
        var tt = o.status ? o.status(f('tt')) : null;

        function fail(err) { ums.api.handle(err, 'chọn sinh viên'); }
        var big = { pageIndex: 1, pageSize: 1000000 };

        function loadHe() {
            return ums.ref.heDaoTao(big).then(function (r) { pat.fill(f('he'), r, { name: 'TENHEDAOTAO' }); });
        }
        function loadKhoa() {
            return ums.ref.khoaDaoTao({ strHeDaoTao_Id: pat.val(f('he')), pageIndex: 1, pageSize: 1000000 })
                .then(function (r) { pat.fill(f('khoa'), r, { name: 'TENKHOA' }); });
        }
        function loadCT() {
            return ums.ref.chuongTrinh({ strDaoTao_HeDaoTao_Id: pat.val(f('he')), strKhoaDaoTao_Id: pat.val(f('khoa')), pageIndex: 1, pageSize: 1000000 })
                .then(function (r) { pat.fill(f('ct'), r, { name: 'TENCHUONGTRINH' }); });
        }
        function loadLop() {
            return ums.ref.lopQuanLy({
                strDaoTao_HeDaoTao_Id: pat.val(f('he')), strKhoaDaoTao_Id: pat.val(f('khoa')),
                strToChucCT_Id: pat.val(f('ct')), pageIndex: 1, pageSize: 1000000
            }).then(function (r) { pat.fill(f('lop'), r, { name: 'TEN' }); });
        }

        loadHe().catch(fail);
        if (global.jQuery) {
            jQuery(f('he')).on('select2:select select2:clear', function () { loadKhoa().catch(fail); });
            jQuery(f('khoa')).on('select2:select select2:clear', function () { loadCT().catch(fail); loadLop().catch(fail); });
            jQuery(f('ct')).on('select2:select select2:clear', function () { loadLop().catch(fail); });
            jQuery(f('lop')).on('select2:select select2:clear', function () { search(1); });
        }

        function params() {
            return {
                strTuKhoa: (f('q').value || '').trim(),
                strHeDaoTao_Id: pat.val(f('he')),
                strKhoaDaoTao_Id: pat.val(f('khoa')),
                strChuongTrinh_Id: pat.val(f('ct')),
                strLopQuanLy_Id: pat.val(f('lop')),
                strTrangThaiNguoiHoc_Id: tt ? tt.ids().join(',') : ''
            };
        }

        function search(p) {
            if (p) page = p;
            f('tbl').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            var call = o.call
                ? o.call(params(), page, size)
                : null;
            var job = call
                ? ums.api.call(call).then(function (r) {
                    return { rows: Array.isArray(r.data) ? r.data : ((r.data && r.data.rs) || []), total: Number(r.pager) || 0 };
                })
                : ums.ref.sinhVienPage(Object.assign({ pageIndex: page, pageSize: size }, params()));

            job.then(function (r) {
                rows = r.rows; total = r.total || rows.length; draw();
            }).catch(function (err) { f('tbl').innerHTML = ui.fail(err.message); fail(err); });
        }

        var COLS = o.columns || [
            { title: 'Mã số', prop: 'MASONGUOIHOC', cls: 'is-nowrap' },
            { title: 'Họ tên', render: function (r) { return esc(e(r.HODEM) + ' ' + e(r.TEN)); } },
            { title: 'Ngày sinh', prop: 'NGAYSINH', cls: 'is-center is-nowrap' },
            { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_N1_TEN' }
        ];

        function draw() {
            f('n').textContent = '(' + total + ')';
            ui.table({
                el: f('tbl'), rows: rows, empty: 'Không tìm thấy sinh viên',
                page: { index: page, size: size, total: total, onChange: function (p) {
                    if (p >= 1 && p <= Math.ceil(total / size)) search(p);
                } },
                columns: COLS.concat([{
                    head: '<input type="checkbox" data-sv="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                    render: function (r, i) { return '<input type="checkbox" data-sv="' + i + '"' + (picked[r.ID] ? ' checked' : '') + '>'; }
                }])
            });
            sync();
        }

        function sync() {
            var n = Object.keys(picked).length;
            f('sel').textContent = n ? 'Đã chọn ' + n + ' sinh viên' : '';
            qa(f('tbl'), 'input[data-sv]').forEach(function (x) {
                if (x.getAttribute('data-sv') === 'all') return;
                var tr = x.closest('tr');
                if (tr) tr.classList.toggle('is-selected', x.checked);
            });
        }

        f('tbl').addEventListener('change', function (ev) {
            var t = ev.target;
            if (!t.matches || !t.matches('input[data-sv]')) return;
            var k = t.getAttribute('data-sv');
            if (k === 'all') {
                rows.forEach(function (r, i) {
                    if (t.checked) picked[r.ID] = r; else delete picked[r.ID];
                    var c = f('tbl').querySelector('input[data-sv="' + i + '"]');
                    if (c) c.checked = t.checked;
                });
            } else {
                var r = rows[Number(k)];
                if (t.checked) picked[r.ID] = r; else delete picked[r.ID];
            }
            sync();
        });

        B.addEventListener('click', function (ev) {
            if (ev.target.closest('[data-a="search"]')) return search(1);
            var g = ev.target.closest('[data-g]');
            if (!g || !o.group) return;
            var k = g.getAttribute('data-g');
            var fn = k === 'khoa' ? o.group.khoa : k === 'ct' ? o.group.chuongTrinh : o.group.lop;
            if (fn) fn(pat.val(f(k)), params(), dlg);
        });

        f('q').addEventListener('keydown', function (ev) {
            if (ev.key === 'Enter') { ev.preventDefault(); search(1); }
        });

        search(1);
        return dlg;
    }

    /* =====================================================================
       HỎI LẠI KÈM CHI TIẾT — ums.pat.xacNhanChiTiet(o) → Promise<boolean>
       ---------------------------------------------------------------------
       Bản viết lại của showFancyConfirm (hoatdong/DaQHHT.js) — hộp hỏi lại
       liệt kê đúng những gì sắp ghi, người dùng đánh dấu "đã kiểm tra" mới
       bấm được. Dùng khi một lần bấm ghi nhiều trường khó hoàn tác.

           ums.pat.xacNhanChiTiet({
               title, subTitle, icon, okText, tone: 'bad' (nút đỏ),
               warning: 'chữ cảnh báo',
               subject: { name, extra: [{ label, value }] },
               sections: [{ title, tone: 'blue'|'green'|'orange'|'red', rows: [[nhãn, giá trị], …] }],
               requireCheckbox: true (mặc định)
           }).then(function (dongY) { … });
       Ô trống hiện "— chưa nhập —" như gốc.
       ===================================================================== */
    pat.xacNhanChiTiet = function (o) {
        o = o || {};
        var can = o.requireCheckbox !== false, xong = false;
        return new Promise(function (resolve) {
            function ket(v) { if (xong) return; xong = true; resolve(v); }
            var sub = o.subject ? '<div class="ums-xnct__sub"><b>' + esc(o.subject.name || '') + '</b>' +
                (o.subject.extra || []).map(function (x) { return '<span>' + esc(x.label) + ': ' + esc(x.value === '' || x.value === null || x.value === undefined ? 'trống' : x.value) + '</span>'; }).join(' • ') + '</div>' : '';
            var secs = (o.sections || []).map(function (s) {
                return '<div class="ums-xnct__sec is-' + esc(s.tone || 'blue') + '"><div class="ums-xnct__sechead">' + esc(s.title || '') + '</div><table>' +
                    (s.rows || []).map(function (r) {
                        var v = r[1];
                        return '<tr><th>' + esc(r[0]) + '</th><td>' + (v === '' || v === null || v === undefined ? '<i>— chưa nhập —</i>' : esc(v)) + '</td></tr>';
                    }).join('') + '</table></div>';
            }).join('');
            var dlg = ui.dialog({
                title: o.title || 'Xác nhận', icon: o.icon || 'fa-circle-question', size: o.size || 'md',
                body: (o.subTitle ? '<p class="ums-u-muted ums-u-fz13 ums-u-mb-2">' + esc(o.subTitle) + '</p>' : '') +
                    '<div class="ums-xnct__canh"><i class="fa-light fa-triangle-exclamation"></i><div><b>Hành động này có thể không thể hoàn tác</b>' +
                        (o.warning ? '<div>' + esc(o.warning) + '</div>' : '') + '</div></div>' + sub + secs +
                    (can ? '<label class="ums-check ums-u-mt-4"><input type="checkbox" data-xnct="dongy"><span>Tôi đã kiểm tra kỹ tất cả thông tin trên và đồng ý thực hiện</span></label>' : ''),
                buttons: [{ text: o.okText || 'Đồng ý', kind: o.tone === 'bad' ? 'del' : 'save', onClick: function () { ket(true); } }],
                onClose: function () { ket(false); }
            });
            var nut = dlg.el.querySelector('[data-dlg="0"]');
            if (can && nut) {
                nut.disabled = true;
                dlg.body.querySelector('[data-xnct="dongy"]').addEventListener('change', function (ev) { nut.disabled = !ev.target.checked; });
            }
        });
    };

    /* =====================================================================
       NHIỀU TAB × NHIỀU DANH SÁCH — ums.pat.sections
       ---------------------------------------------------------------------
       Dạng màn hồ sơ của Cổng cán bộ / Nhân sự (vd quatrinhdaotao): một dải
       tab, mỗi tab một hay vài khung "danh sách + nút Thêm mới + Tải lại",
       mỗi khung một biểu mẫu riêng. Bản gốc: Bootstrap tab + panel collapse,
       nạp dữ liệu khi mở tab lần đầu; mở biểu mẫu thì
       edu.util.toggle_overide("zonecontent", …) giấu CẢ vùng tab, chỉ còn
       biểu mẫu. Ở đây giữ đúng hai hành vi đó.

           var pg = ums.pat.sections({
               el: root, title: 'Quá trình đào tạo',
               tabs: [
                   { key: 'daotao', text: 'Quá trình đào tạo', icon: 'fa-graduation-cap',
                     sections: [cfgDaoTao, cfgBoiDuong] },     // cfg của ums.crud
                   { key: 'hocvi', text: 'Học vị', sections: [cfgHocVi] }
               ]
           });
           pg.crud('daotao', 0) · pg.show('hocvi')

       Mỗi khung là ums.crud({ embedded: true, autoload: false, … }) — cfg của
       màn truyền nguyên, khung tự thêm hai cờ đó. Chỉ MỘT tab thì không vẽ
       dải tab (bản gốc có dải tab một mục chỉ để làm tiêu đề — tiêu đề trang
       đã nói điều đó).
       ===================================================================== */
    pat.sections = function (o) {
        var host = typeof o.el === 'string' ? document.querySelector(o.el) : o.el;
        var tabs = o.tabs || [];
        var many = tabs.length > 1;

        host.innerHTML =
            '<div class="ums-sections">' +
            (o.title ? '<div class="ums-page__head"><h1 class="ums-page__title ums-u-mb-0">' + esc(o.title) + '</h1></div>' : '') +
            (many ? '<nav class="ums-tabs ums-sections__tabs">' + tabs.map(function (t, i) {
                return '<a class="ums-tabs__item' + (i ? '' : ' is-active') + '" href="javascript:void(0)" data-stab="' + esc(t.key) + '">' +
                    (t.icon ? '<i class="fa-light ' + esc(t.icon) + '"></i> ' : '') + esc(t.text) + '</a>';
            }).join('') + '</nav>' : '') +
            tabs.map(function (t, i) {
                return '<div class="ums-sections__pane" data-spane="' + esc(t.key) + '"' + (i ? ' hidden' : '') + '>' +
                    (t.sections || []).map(function (s, k) {
                        return '<div class="ums-sections__sec" data-ssec="' + esc(t.key) + ':' + k + '"></div>';
                    }).join('') + '</div>';
            }).join('') +
            '</div>';
        var wrap = host.querySelector('.ums-sections');

        var cruds = {}, loaded = {};
        tabs.forEach(function (t) {
            cruds[t.key] = (t.sections || []).map(function (cfg, k) {
                var sec = host.querySelector('[data-ssec="' + t.key + ':' + k + '"]');
                var c = {};
                Object.keys(cfg).forEach(function (x) { c[x] = cfg[x]; });
                c.root = sec;
                c.embedded = true;
                c.autoload = false;
                var onForm = cfg.onForm, onList = cfg.onList;
                c.onForm = function (row, crud, extra) {
                    wrap.classList.add('is-editing');
                    sec.classList.add('is-open');
                    if (onForm) onForm(row, crud, extra);
                };
                c.onList = function (crud) {
                    wrap.classList.remove('is-editing');
                    sec.classList.remove('is-open');
                    if (onList) onList(crud);
                };
                return ums.crud(c);
            });
        });

        function show(key) {
            if (!cruds[key]) return;
            qa(host, '[data-stab]').forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('data-stab') === key); });
            qa(host, '[data-spane]').forEach(function (p) { p.hidden = p.getAttribute('data-spane') !== key; });
            if (!loaded[key]) {
                loaded[key] = true;
                cruds[key].forEach(function (c) { c.load(1); });
            }
        }
        host.addEventListener('click', function (ev) {
            var a = ev.target.closest('[data-stab]');
            if (a && host.contains(a)) show(a.getAttribute('data-stab'));
        });
        if (tabs.length) show(tabs[0].key);

        return {
            show: show,
            crud: function (key, i) { return (cruds[key] || [])[i || 0]; }
        };
    };

    /* =====================================================================
       LƯỚI DÒNG NHẬP (nằm trong biểu mẫu) — ums.pat.rows
       ---------------------------------------------------------------------
       Dạng "bảng có nút Thêm dòng mới" của hệ cũ (vd Gia hạn / Tiến độ học
       tập trong quatrinhdaotao): mỗi dòng là một bản ghi con của bản ghi
       đang sửa, lưu từng dòng SAU khi bản ghi cha đã có id.

           var g = ums.pat.rows(host, {
               title: 'Tiến độ học tập', icon: 'fa-list-check',
               columns: [
                   { key: 'strNgayBaoCao', col: 'NGAYBAOCAO', title: 'Ngày', type: 'date' },
                   { key: 'strTienDo_Id', col: 'TIENDO_ID', title: 'Tình trạng', type: 'select',
                     source: { dm: 'NS.TIENDOHOCTAP' }, placeholder: 'Chọn tình trạng' },
                   { key: 'strMoTa', col: 'MOTA', title: 'Mô tả' },
                   { key: '_tep', title: 'File đính kèm', type: 'files', api: 'NS_Files' }
               ],
               minRows: 4,                       // bản gốc luôn vẽ đủ 4 dòng
               minRowsNew: 4,                    // (tuỳ chọn) số dòng trống khi bản ghi cha mới thêm
               list: function (parentId) → lời gọi lấy các dòng đã lưu,
               filled: function (v) → true thì mới lưu dòng đó (bản gốc bỏ qua dòng trống),
               save: function (v, row, parentId) → lời gọi ThemMoi/CapNhat,
               remove: function (row) → lời gọi xoá dòng đã lưu
           });
           g.load(parentId) · g.clear() · g.save(parentId) → Promise · g.addNew(dòngNguồn)

       Ô chọn trong lưới là ô gốc (BO-CUC luật 2 — ít mục, không select2);
       danh sách dài thì đặt `s2: true` trên cột. Thêm nữa:
           group: 'Thời gian bắt đầu'   cột liền nhau cùng group → tiêu đề hai tầng
           source: { load: fn → Promise<dòng>, name: 'TEN' | fn(dòng) }
           tools: '<button…>'          nút thêm ở đầu khung, trước "Thêm dòng mới"
           type: 'static'              cột chỉ hiện (vd Ngày tạo, Người tạo), không gửi khi lưu
       Tệp đính kèm của dòng gắn vào id máy chủ trả cho CHÍNH dòng đó.
       ===================================================================== */
    pat.rows = function (hostEl, o) {
        var host = typeof hostEl === 'string' ? document.querySelector(hostEl) : hostEl;
        var cols = o.columns || [];
        var minRows = o.minRows || 0;
        var rows = [];          // [{ rec: dòng máy chủ | null, tr, files: {key: ctl} }]
        var srcRows = {};       // key cột → danh sách mục của ô chọn

        /* Tiêu đề: cột mang `group` gộp dưới một ô tiêu đề chung (hai tầng),
           như "Thời gian bắt đầu: Ngày | Giờ | Phút" của sukien */
        function th(c, attr) {
            return '<th' + (attr || '') + (c.width ? ' style="width:' + esc(c.width) + '"' : '') + '>' + esc(c.title || '') + '</th>';
        }
        function head() {
            var two = cols.some(function (c) { return c.group; });
            var rs = two ? ' rowspan="2"' : '';
            var top = '<th class="is-center" style="width:48px"' + rs + '>STT</th>', sub = '';
            for (var i = 0; i < cols.length; i++) {
                var c = cols[i];
                if (!c.group) { top += th(c, rs); continue; }
                var n = 1;
                while (cols[i + n] && cols[i + n].group === c.group) n++;
                top += '<th class="is-center ums-table__grp" colspan="' + n + '">' + esc(c.group) + '</th>';
                for (var j = 0; j < n; j++) sub += th(cols[i + j], ' class="is-center"');
                i += n - 1;
            }
            top += '<th class="is-center" style="width:90px"' + rs + '>Xóa dòng</th>';
            return '<tr>' + top + '</tr>' + (two ? '<tr>' + sub + '</tr>' : '');
        }

        host.innerHTML =
            '<div class="ums-panel ums-rows">' +
            '<div class="ums-panel__head"><div class="ums-panel__title">' +
                (o.icon ? '<i class="fa-light ' + esc(o.icon) + '"></i> ' : '') + esc(o.title || '') + '</div>' +
            '<div class="ums-panel__tools">' + (o.tools || '') +
                ui.btn('add', { text: o.addText || 'Thêm dòng mới', mod: 'out-success', attr: { 'data-rows': 'add' } }) +
            '</div></div>' +
            '<div class="ums-tablewrap"><table class="ums-table ums-table--lined ums-table--tight ums-rows__table"><thead>' +
                head() + '</thead><tbody></tbody></table></div></div>';
        var tbody = host.querySelector('tbody');

        var ready = Promise.all(cols.map(function (c) {
            if (c.type !== 'select' || !c.source) return null;
            var p = c.source.load ? c.source.load()
                : c.source.items ? Promise.resolve(c.source.items)
                : c.source.dm ? ums.api.dm(c.source.dm)
                : ums.api.call(Object.assign({ silent: true }, c.source.call)).then(function (r) { return Array.isArray(r.data) ? r.data : []; });
            return p.then(function (list) { srcRows[c.key] = list; }, function () { srcRows[c.key] = []; });
        }));

        function cell(c, rec) {
            var v = rec ? (typeof c.get === 'function' ? c.get(rec) : rec[c.col || '']) : '';
            v = v === null || v === undefined ? '' : v;
            if (c.type === 'files') return '<td data-rfiles="' + esc(c.key) + '"></td>';
            // static: chỉ hiện (Ngày tạo, Người tạo…), không gửi đi khi lưu
            if (c.type === 'static') return '<td class="' + esc(c.cls || '') + '">' + esc(v) + '</td>';
            if (c.type === 'select') {
                var id = (c.source && c.source.id) || 'ID', nm = (c.source && c.source.name) || 'TEN';
                // s2: danh sách dài (vd nhân sự toàn trường) — select2 thật, có ô tìm
                return '<td><select class="ums-select ums-input--sm" data-rk="' + esc(c.key) + '"' +
                    (c.s2 ? ' data-s2 data-ph="' + esc(c.placeholder || '-- Chọn --') + '"' : '') + '>' +
                    '<option value="">' + esc(c.placeholder || '-- Chọn --') + '</option>' +
                    (srcRows[c.key] || []).map(function (r) {
                        return '<option value="' + esc(r[id]) + '"' + (String(r[id]) === String(v) ? ' selected' : '') + '>' +
                            esc(typeof nm === 'function' ? nm(r) : r[nm]) + '</option>';
                    }).join('') + '</select></td>';
            }
            var date = c.type === 'date';
            return '<td>' + (date ? '<div class="ums-inputwrap">' : '') +
                '<input class="ums-input ums-input--sm" data-rk="' + esc(c.key) + '"' + (date ? ' data-date placeholder="dd/mm/yyyy"' : '') +
                ' autocomplete="off" value="' + esc(v) + '">' + (date ? '<i class="fa-light fa-calendar"></i></div>' : '') + '</td>';
        }
        function renumber() {
            qa(tbody, 'tr').forEach(function (tr, i) { tr.firstChild.textContent = String(i + 1); });
        }
        function add(rec) {
            var tr = document.createElement('tr');
            tr.innerHTML = '<td class="is-center"></td>' + cols.map(function (c) { return cell(c, rec); }).join('') +
                '<td class="is-center"><button type="button" class="ums-btn ums-btn--out-danger ums-btn--sm" data-rows="del">' +
                '<i class="fa-light fa-trash-can"></i><span>' + (rec ? 'Xóa' : 'Xóa dòng') + '</span></button></td>';
            tbody.appendChild(tr);
            var r = { rec: rec || null, tr: tr, files: {} };
            cols.forEach(function (c) {
                if (c.type !== 'files') return;
                r.files[c.key] = ums.files.mount(tr.querySelector('[data-rfiles="' + c.key + '"]'), { api: c.api, folder: c.folder });
                if (rec) r.files[c.key].load(rec.ID);
            });
            rows.push(r);
            ui.enhance(tr);
            renumber();
            return r;
        }
        function fill(list, min) {
            tbody.innerHTML = ''; rows = [];
            (list || []).forEach(function (rec) { add(rec); });
            for (var i = (list || []).length; i < min; i++) add(null);
        }
        // Bản ghi cha mới (chưa có id) có thể vẽ số dòng trống khác khi sửa
        var minNew = o.minRowsNew || minRows;
        function values(r) {
            var v = {};
            qa(r.tr, '[data-rk]').forEach(function (el) { v[el.getAttribute('data-rk')] = (el.value || '').trim(); });
            return v;
        }

        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-rows]');
            if (!b || !host.contains(b)) return;
            if (b.getAttribute('data-rows') === 'add') { add(null); return; }
            var tr = b.closest('tr');
            var r = rows.filter(function (x) { return x.tr === tr; })[0];
            if (!r) return;
            function drop() { tr.remove(); rows.splice(rows.indexOf(r), 1); renumber(); }
            if (!r.rec || !o.remove) { drop(); return; }
            ui.confirm('Bạn có chắc chắn muốn xóa dữ liệu?', { title: 'Xoá dòng' }).then(function (yes) {
                if (!yes) return;
                return ums.api.call(o.remove(r.rec)).then(function () { drop(); ui.toast('Xóa dữ liệu thành công!', 'ok'); });
            }).catch(function (err) { ums.api.handle(err, 'xoá dòng'); });
        });

        return {
            /** Thêm một dòng MỚI điền sẵn từ một dòng nguồn (theo `col`), vd chép đáp án mẫu */
            addNew: function (src) {
                var r = add(null);
                cols.forEach(function (c) {
                    var el = r.tr.querySelector('[data-rk="' + c.key + '"]');
                    if (!el || !src || !c.col) return;
                    el.value = src[c.col] === null || src[c.col] === undefined ? '' : src[c.col];
                    if (el._flatpickr) el._flatpickr.setDate(el.value || null, false, 'd/m/Y');
                });
                return r;
            },
            clear: function () { return ready.then(function () { fill([], minNew); }); },
            load: function (parentId) {
                return ready.then(function () {
                    if (!parentId || !o.list) { fill([], minNew); return; }
                    return ums.api.call(Object.assign({ silent: true }, o.list(parentId))).then(function (r) {
                        fill(Array.isArray(r.data) ? r.data : [], minRows);
                    }).catch(function (err) { fill([], minRows); ums.api.handle(err, 'nạp ' + (o.title || 'dòng')); });
                });
            },
            /** Lưu mọi dòng đã nhập, tuần tự — đọc giá trị NGAY lúc gọi */
            save: function (parentId) {
                if (!parentId || !o.save) return Promise.resolve();
                var jobs = rows.map(function (r) { return { r: r, v: values(r) }; })
                    .filter(function (j) { return !o.filled || o.filled(j.v, j.r.rec); });
                return jobs.reduce(function (p, j) {
                    return p.then(function () {
                        return ums.api.call(o.save(j.v, j.r.rec, parentId)).then(function (res) {
                            var id = (res.raw && res.raw.Id) || (j.r.rec && j.r.rec.ID) || '';
                            return Object.keys(j.r.files).reduce(function (q, k) {
                                return q.then(function () { return j.r.files[k].save(id); });
                            }, Promise.resolve());
                        });
                    });
                }, Promise.resolve()).catch(function (err) { ums.api.handle(err, 'lưu ' + (o.title || 'dòng')); });
            }
        };
    };

    /* =====================================================================
       PHẠM VI ÁP DỤNG — ums.pat.phamVi
       ---------------------------------------------------------------------
       Khối "Phạm vi áp dụng" trong biểu mẫu kế hoạch của hệ cũ (sukien/kehoach,
       sukien/sukien, khaosat/kehoach…): bảng tên phạm vi, nút Thêm mở
       edu.extend.genModal_SinhVien, nút Xóa xoá các dòng ĐÃ LƯU được đánh
       dấu. Dòng mới chỉ nằm trên màn, bấm Lưu kế hoạch xong mới gửi — mỗi
       phạm vi một lời gọi, gắn vào id kế hoạch máy chủ trả.

           var pv = ums.pat.phamVi(host, {
               list:   function (id)       { return { action: 'X/LayDS…PhamVi', … }; },
               save:   function (pvId, id) { return { action: 'X/Them…PhamVi', strPhamViApDung_Id: pvId, … }; },
               remove: function (rowId)    { return { action: 'X/Xoa…PhamVi', strId: rowId, … }; },
               name:   function (row) { … }            // mặc định PHAMVIAPDUNG_TEN
           });
           pv.load(idKeHoach) · pv.clear() · pv.save(idKeHoach) → Promise

       Chọn sinh viên → gửi QLSV_NGUOIHOC_ID (save_SinhVien của bản gốc đổi
       id dòng hộp chọn sang id người học). "Thêm từng khóa / chương trình /
       lớp" → gửi thẳng id khoá/CT/lớp; bấm lại cùng loại thì THAY danh sách
       cũ (bản gốc gán đè edu.extend.arrKhoa…), hiện dòng "Áp dụng cho …".
       ===================================================================== */
    pat.phamVi = function (hostEl, o) {
        var host = typeof hostEl === 'string' ? document.querySelector(hostEl) : hostEl;
        var saved = [], moi = [], nhom = {};      // nhom[kind] = { ids, names }
        var curId = '';
        var NHAN = { khoa: 'Áp dụng cho khóa', ct: 'Áp dụng cho chương trình', lop: 'Áp dụng cho lớp' };
        function nameOf(r) { return o.name ? o.name(r) : e(r.PHAMVIAPDUNG_TEN); }

        host.innerHTML =
            '<div class="ums-panel ums-rows">' +
            '<div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-users-viewfinder"></i> ' +
                esc(o.title || 'Phạm vi áp dụng') + '</div>' +
            '<div class="ums-panel__tools">' +
                ui.xoaChon('input[data-pvi]', { goc: '.ums-panel', attr: { 'data-pv': 'del' } }) +
                ui.btn('add', { text: 'Thêm', mod: 'out-success', attr: { 'data-pv': 'add' } }) +
            '</div></div>' +
            '<div data-pv="tbl"></div><div class="ums-u-fz13 ums-u-muted ums-u-mt-2" data-pv="nhom"></div></div>';
        var tbl = host.querySelector('[data-pv="tbl"]');

        function draw() {
            var rows = saved.map(function (r) { return { r: r }; }).concat(moi.map(function (m) { return { m: m }; }));
            ui.table({
                el: tbl, rows: rows, empty: 'Chưa có phạm vi áp dụng',
                columns: [
                    { title: 'Tên phạm vi', render: function (x) { return esc(x.r ? nameOf(x.r) : x.m.ten); } },
                    { head: '<input type="checkbox" data-pv="all" title="Chọn tất cả">', cls: 'is-center', width: '56px',
                      render: function (x, i) {
                          return x.r ? '<input type="checkbox" data-pvi="' + i + '">'
                              : '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-pvx="' + esc(x.m.id) +
                                '" title="Bỏ dòng chưa lưu"><i class="fa-light fa-trash-can"></i></button>';
                      } }
                ]
            });
            host.querySelector('[data-pv="nhom"]').innerHTML = Object.keys(nhom).filter(function (k) { return nhom[k].ids.length; })
                .map(function (k) { return '<div>' + esc(NHAN[k]) + ': <b>' + esc(nhom[k].names.join(', ')) + '</b></div>'; }).join('');
        }

        function load(id) {
            curId = id || '';
            moi = []; nhom = {};
            if (!curId) { saved = []; draw(); return Promise.resolve(); }
            tbl.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return ums.api.call(o.list(curId)).then(function (r) {
                saved = Array.isArray(r.data) ? r.data : [];
                draw();
            }).catch(function (err) { saved = []; draw(); ums.api.handle(err, 'tải phạm vi áp dụng'); });
        }

        host.addEventListener('change', function (ev) {
            var t = ev.target;
            if (t.getAttribute('data-pv') === 'all') qa(tbl, 'input[data-pvi]').forEach(function (x) { x.checked = t.checked; });
        });
        host.addEventListener('click', function (ev) {
            var x = ev.target.closest('[data-pvx]');
            if (x) {
                var k = x.getAttribute('data-pvx');
                moi = moi.filter(function (m) { return m.id !== k; });
                draw();
                return;
            }
            var b = ev.target.closest('button[data-pv]');
            if (!b) return;
            if (b.getAttribute('data-pv') === 'add') {
                pat.pickSinhVienNganh({
                    onPick: function (rows) {
                        rows.forEach(function (s) {
                            var id = s.QLSV_NGUOIHOC_ID || s.ID;
                            var co = moi.some(function (m) { return m.id === id; }) ||
                                saved.some(function (r) { return r.QLSV_NGUOIHOC_ID === id || r.PHAMVIAPDUNG_ID === id; });
                            if (!co) moi.push({ id: id, ten: e(s.QLSV_NGUOIHOC_HODEM) + ' ' + e(s.QLSV_NGUOIHOC_TEN) });
                        });
                        draw();
                    },
                    onGroup: function (kind, ids, names) {
                        nhom[kind] = { ids: ids, names: names || [] };
                        draw();
                        ui.toast(NHAN[kind] + ': ' + (names || []).join(', '), 'ok');
                    }
                });
                return;
            }
            var pick = qa(tbl, 'input[data-pvi]:checked').map(function (c) { return saved[Number(c.getAttribute('data-pvi'))]; }).filter(Boolean);
            if (!pick.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá phạm vi' }).then(function (yes) {
                if (!yes) return;
                ui.batch(pick.map(function (r) { return o.remove(r.ID); }), { title: 'Đang xoá phạm vi', okText: 'Xóa thành công!' })
                    .then(function () { load(curId); });
            });
        });

        draw();
        return {
            load: load,
            clear: function () { return load(''); },
            pending: function () {
                return moi.length + Object.keys(nhom).reduce(function (n, k) { return n + nhom[k].ids.length; }, 0);
            },
            save: function (id) {
                var ids = moi.map(function (m) { return m.id; });
                ['khoa', 'ct', 'lop'].forEach(function (k) { if (nhom[k]) ids = ids.concat(nhom[k].ids); });
                // Đã có trong danh sách đã lưu thì không gửi lại
                ids = ids.filter(function (x) { return !saved.some(function (r) { return r.PHAMVIAPDUNG_ID === x; }); });
                if (!ids.length || !id) return Promise.resolve({ ok: 0, fail: 0 });
                return ui.batch(ids.map(function (pvId) { return o.save(pvId, id); }), { title: 'Đang thêm phạm vi', okText: 'Thêm thành công!' });
            }
        };
    };

    /* =====================================================================
       Ô ĐỊA CHỈ Tỉnh / Huyện / Xã — ums.pat.diaChi
       ---------------------------------------------------------------------
       Bản viết lại của edu.extend.setTinhThanh + viewTinhThanhById
       (Corei/systemextend.js:2123, 2465). Danh mục CHUN.DMTT phẳng, cha–con
       qua QUANHECHA_ID (tỉnh: QUANHECHA_ID rỗng); lưu đệm localStorage
       "strTinhThanh7" như bản gốc để các màn dùng chung một bản.

           var dc = ums.pat.diaChi(inputEl, { placeholder });
           dc.set(tinhId, huyenId, xaId, thonXom)     // đổ lại khi mở hồ sơ
           dc.get() → { tinh, huyen, xa, them }       // gửi strX_Tinh_Id… / strX_DiaChi

       Hai cách nhập, đúng như bản gốc:
         · bấm kính lúp → hộp chọn Tỉnh → Quận/Huyện → Phường/Xã + Thôn/Xóm;
         · gõ thẳng "Tỉnh, Huyện, Xã, số nhà…" rồi rời ô → tự tách ra id (khớp
           tên chứa chuỗi gõ, bỏ các chữ XÃ/HUYỆN/TỈNH/PHƯỜNG/QUẬN/THÀNH PHỐ).
       "them" = phần sau xã (thôn/xóm/số nhà) — bản gốc giữ ở thuộc tính name.
       ===================================================================== */
    var dmttP = null;
    function dmTinhThanh() {
        if (dmttP) return dmttP;
        try {
            var c = JSON.parse(global.localStorage.getItem('strTinhThanh7') || 'null');
            if (c && c.length) { dmttP = Promise.resolve(c); return dmttP; }
        } catch (e) { /* bộ đệm hỏng thì nạp lại */ }
        dmttP = ums.api.dm('CHUN.DMTT').then(function (r) {
            var arr = (r || []).map(function (x) { return { ID: x.ID, TEN: x.TEN, QUANHECHA_ID: x.QUANHECHA_ID || null }; });
            try { global.localStorage.setItem('strTinhThanh7', JSON.stringify(arr)); } catch (e) { /* đầy bộ nhớ: bỏ qua */ }
            return arr;
        }, function (err) { dmttP = null; throw err; });
        return dmttP;
    }
    pat.dmTinhThanh = dmTinhThanh;

    pat.diaChi = function (input, o) {
        o = o || {};
        var st = { tinh: '', huyen: '', xa: '', them: '' };
        var ds = [];
        input.setAttribute('placeholder', o.placeholder || 'VD: TP Hà Nội, Quận Cầu Giấy, Dịch Vọng, Số 1 Nguyễn Phong Sắc');
        var wrap = document.createElement('div');
        wrap.className = 'ums-inputwrap ums-diachi';
        input.parentNode.insertBefore(wrap, input);
        wrap.appendChild(input);
        var nut = document.createElement('button');
        nut.type = 'button';
        nut.className = 'ums-diachi__btn';
        nut.title = 'Chọn tỉnh / huyện / xã';
        nut.innerHTML = '<i class="fa-light fa-magnifying-glass-location"></i>';
        wrap.appendChild(nut);

        function ten(id) { var x = ds.filter(function (r) { return r.ID === id; })[0]; return x ? x.TEN : ''; }
        function con(cha) { return ds.filter(function (r) { return (r.QUANHECHA_ID || null) === (cha || null); }); }
        function ve() {
            var s = ten(st.tinh);
            if (st.huyen && ten(st.huyen)) s += ', ' + ten(st.huyen);
            if (st.xa && ten(st.xa)) s += ', ' + ten(st.xa);
            if (st.them) s += (s ? ', ' : '') + st.them;
            input.value = s;
        }
        var san = dmTinhThanh().then(function (r) { ds = r; }, function (err) { ums.api.handle(err, 'nạp danh mục tỉnh thành'); });

        /* Gõ thẳng rồi rời ô: tách chuỗi như checkDuLieuDiaDiem của bản gốc */
        input.addEventListener('blur', function () {
            san.then(function () {
                var s = input.value.replace(/XÃ|HUYỆN|TỈNH|PHƯỜNG|QUẬN|THÀNH PHỐ/g, '').replace(/ {2}/g, ' ');
                st = { tinh: '', huyen: '', xa: '', them: '' };
                if (s.indexOf(',') >= 0) {
                    var p = s.split(',');
                    function tim(list, key) {
                        key = (key || '').toUpperCase().trim();
                        var hit = ''; list.forEach(function (r) { if (key && r.TEN.toUpperCase().indexOf(key) >= 0) hit = r.ID; });
                        return hit;
                    }
                    st.tinh = tim(con(null), p[0]);
                    st.huyen = st.tinh ? tim(con(st.tinh), p[1]) : '';
                    st.xa = st.huyen ? tim(con(st.huyen), p[2]) : '';
                    st.them = p.slice(3).map(function (x) { return x.trim(); }).join(',');
                }
                if (st.tinh) ve();
            });
        });

        nut.addEventListener('click', function () {
            san.then(function () {
                var body = document.createElement('div');
                body.className = 'ums-grid ums-grid--1';
                body.innerHTML =
                    ui.field('Tỉnh/Thành phố', '<select class="ums-select" data-dc="tinh"></select>') +
                    ui.field('Quận/Huyện', '<select class="ums-select" data-dc="huyen"></select>') +
                    ui.field('Phường/Xã', '<select class="ums-select" data-dc="xa"></select>') +
                    ui.field('Thôn/Xóm', '<input class="ums-input" data-dc="them" placeholder="Nhập dữ liệu">');
                var s = {};
                ['tinh', 'huyen', 'xa', 'them'].forEach(function (k) { s[k] = body.querySelector('[data-dc="' + k + '"]'); });
                function nap(el, list, head, val) { pat.fill(el, list, { head: head }); el.value = val || ''; if (global.jQuery) jQuery(el).trigger('change.select2'); }
                nap(s.tinh, con(null), '--Vui lòng chọn tỉnh/thành phố--', st.tinh);
                nap(s.huyen, st.tinh ? con(st.tinh) : [], '--Vui lòng chọn quận/huyện--', st.huyen);
                nap(s.xa, st.huyen ? con(st.huyen) : [], '--Vui lòng chọn phường/xã--', st.xa);
                s.them.value = st.them;
                ui.dialog({
                    title: 'Chọn địa chỉ', icon: 'fa-location-dot', size: 'sm', body: body,
                    buttons: [{ kind: 'save', text: 'OK', onClick: function () {
                        st = { tinh: s.tinh.value, huyen: s.huyen.value, xa: s.xa.value, them: s.them.value.trim() };
                        ve();
                    } }]
                });
                ui.enhance(body);
                if (global.jQuery) {
                    jQuery(s.tinh).on('select2:select select2:clear', function () { nap(s.huyen, con(s.tinh.value || '#'), '--Vui lòng chọn quận/huyện--', ''); nap(s.xa, [], '--Vui lòng chọn phường/xã--', ''); });
                    jQuery(s.huyen).on('select2:select select2:clear', function () { nap(s.xa, con(s.huyen.value || '#'), '--Vui lòng chọn phường/xã--', ''); });
                }
                pat.chain([s.tinh, s.huyen, s.xa], { phatLai: false });
            });
        });

        return {
            set: function (tinh, huyen, xa, them) {
                st = { tinh: tinh || '', huyen: huyen || '', xa: xa || '', them: them || '' };
                return san.then(ve);
            },
            get: function () { return { tinh: st.tinh, huyen: st.huyen, xa: st.xa, them: st.them }; }
        };
    };

    /* =====================================================================
       Chọn phạm vi thao tác hàng loạt — "chỉ dòng đã đánh dấu" / "toàn bộ"
       (bản gốc: hộp #myModalChonPhamVi của sinhviennotien, inbangdiem…)
         pat.chonPhamVi({ title, icon, soChon, daChon, tatCa, warn }) → Promise<'daChon' | 'tatCa' | null>
       soChon = 0 thì nút "đã đánh dấu" bị khoá.
       ===================================================================== */
    pat.chonPhamVi = function (o) {
        var n = o.soChon || 0;
        return new Promise(function (resolve) {
            var picked = null;
            var dlg = ui.dialog({
                title: o.title, icon: o.icon, size: 'sm',
                body: (o.warn ? '<div class="ums-u-fz13 ums-u-mb-4" style="padding:10px 12px;border-left:3px solid var(--ums-bad);background:var(--ums-bad-bg)">' + o.warn + '</div>' : '') +
                    '<div class="ums-stack">' +
                    '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--block" data-pv="daChon"' + (n ? '' : ' disabled') + '>' +
                    '<i class="fa-light fa-square-check"></i><span>' + esc(o.daChon) + ' — ' + n + ' trên trang này</span></button>' +
                    '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--block" data-pv="tatCa">' +
                    '<i class="fa-light fa-list"></i><span>' + esc(o.tatCa) + '</span></button></div>',
                onClose: function () { resolve(picked); }
            });
            dlg.body.addEventListener('click', function (e) {
                var b = e.target.closest('[data-pv]');
                if (!b || b.disabled) return;
                picked = b.getAttribute('data-pv');
                dlg.close();
            });
        });
    };

    /* =====================================================================
       Gửi email hàng loạt — xem trước (phân trang máy khách, 100 dòng/trang) rồi gửi TUẦN TỰ
       CMS_NguoiDung/SendEmail (type POST, mailTo, mailSubject, strBody, arrFileDinhKem []) như bản gốc.
         pat.guiEmail({
           title, icon, tieuDe (mặc định), hint (dưới ô tiêu đề), ghiChu (HTML khung xanh),
           list,                         các dòng sẽ gửi
           email(d) → địa chỉ,           cot: [cột xem trước — trước cột Email/Trạng thái]
           cotSau: [cột sau cột Email],   than(d) → HTML thân email (màn tự esc dữ liệu)
         })
       Dòng không có email hợp lệ hiện "Thiếu email" và bị bỏ qua khi gửi.
       ===================================================================== */
    var RE_EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    pat.emailHopLe = function (s) { return !!s && RE_EMAIL.test(String(s).toLowerCase()); };
    pat.guiEmail = function (o) {
        var list = o.list || [];
        if (!list.length) { ui.toast('Không có sinh viên nào khớp bộ lọc!', 'warn'); return null; }
        var mail = o.email;
        var ok = list.filter(function (d) { return pat.emailHopLe(mail(d)); }).length;
        var pv = { page: 1, size: 100 }, sending = false;
        var dlg = ui.dialog({
            title: o.title || 'Gửi Email', icon: o.icon || 'fa-envelope', size: 'xl',
            body:
                ui.field('Tiêu đề', '<textarea class="ums-textarea" data-e="tieuDe" rows="2">' + esc(o.tieuDe || '') + '</textarea>', { required: true, hint: o.hint }) +
                (o.ghiChu ? '<div class="ums-u-fz13 ums-u-mb-4" style="padding:10px 12px;border-left:3px solid var(--ums-blue);background:var(--ums-blue-l)">' + o.ghiChu + '</div>' : '') +
                '<div class="ums-row ums-row--between ums-u-mb-2"><b>Danh sách sẽ gửi (' + ok + '/' + list.length + ' có email hợp lệ)</b></div>' +
                '<div data-e="tbl"></div><div data-e="kq" class="ums-u-mt-4"></div>',
            buttons: [{ text: 'Gửi Email', kind: 'save', onClick: function () { send(); return false; } }]
        });
        var body = dlg.body;
        function drawPv() {
            ui.table({
                el: body.querySelector('[data-e="tbl"]'), rows: list.slice((pv.page - 1) * pv.size, pv.page * pv.size),
                page: { index: pv.page, size: pv.size, total: list.length,
                    onChange: function (p) { if (p >= 1 && p <= Math.ceil(list.length / pv.size)) { pv.page = p; drawPv(); } },
                    onSize: function (v) { pv.size = v; pv.page = 1; drawPv(); } },
                columns: (o.cot || []).concat([{ title: 'Email', render: function (d) { return mail(d) ? esc(mail(d)) : '<i class="ums-u-faint">(chưa có)</i>'; } }],
                    o.cotSau || [], [{ title: 'Trạng thái', cls: 'is-center', render: function (d) { return pat.emailHopLe(mail(d)) ? ui.badge('Sẵn sàng', 'ok') : ui.badge('Thiếu email', 'bad'); } }])
            });
        }
        drawPv();
        function send() {
            if (sending) return;
            var tieuDe = (body.querySelector('[data-e="tieuDe"]').value || '').replace(/\s*[\r\n]+\s*/g, ' ').trim();
            if (!tieuDe) { ui.toast('Vui lòng nhập tiêu đề email!', 'warn'); return; }
            var valid = list.filter(function (d) { return pat.emailHopLe(mail(d)); });
            if (!valid.length) { ui.toast('Không có sinh viên nào có email hợp lệ để gửi!', 'warn'); return; }
            sending = true;
            ui.batch(valid.map(function (d) {
                var to = mail(d);
                return function () {
                    return ums.api.call({ action: 'CMS_NguoiDung/SendEmail', type: 'POST', mailTo: to, mailSubject: tieuDe, strBody: o.than(d), arrFileDinhKem: [] })
                        .catch(function (e) { if (!e.expired) e.message = to + ' → ' + e.message; throw e; });
                };
            }), { title: 'Đang gửi email', toast: false }).then(function (r) {
                sending = false;
                body.querySelector('[data-e="kq"]').innerHTML =
                    '<div class="ums-row">' + ui.badge('Thành công: ' + r.ok, 'ok') + ui.badge('Thất bại: ' + r.fail, r.fail ? 'bad' : 'mute') + '</div>' +
                    (r.errors.length ? '<div class="ums-u-fz13 ums-u-mt-2">' + r.errors.slice(0, 5).map(function (x) { return '— ' + esc(x); }).join('<br>') + '</div>' : '');
                ui.toast('Gửi email: ' + r.ok + ' thành công, ' + r.fail + ' thất bại', r.fail ? 'warn' : 'ok');
            });
        }
        return dlg;
    };

    /* =====================================================================
       SƠ ĐỒ CÂY kiểu sơ đồ tổ chức (cha ở trên, các con dàn ngang bên dưới, nối bằng đường kẻ)
       ---------------------------------------------------------------------
       pat.soDo(host, rows, {
           id: 'ID', cha: 'CHA_ID',          // tên cột khoá / khoá cha
           nhan: function (r, laCha) → html,  // nội dung một ô (đã tự thoát ký tự thì trả html)
           attr: function (r) → { tên: giá trị } // thuộc tính gắn lên nút (vd data-c / data-i của ums.crud)
       })
       Dòng mồ côi (cha không có trong danh sách) và vòng cha–con của dữ liệu hỏng → vẽ ở tầng trên cùng,
       không treo. Rộng hơn khung thì cuộn ngang (kéo chuột như bảng). Mỗi ô là <button class="ums-sodo__nut">
       — màn tự nghe click. CSS: components/sodo.css. Dùng ở ApisRenLuyen tieuchidiem (2026-09-25). */
    pat.soDo = function (host, rows, o) {
        o = o || {};
        var idK = o.id || 'ID', chaK = o.cha || 'CHA_ID';
        var esc = ui.esc, co = {}, con = {}, da = {};
        rows.forEach(function (r) { co[r[idK]] = true; });
        rows.forEach(function (r) {
            var c = r[chaK];
            var k = c && co[c] && c !== r[idK] ? c : '';
            (con[k] = con[k] || []).push(r);
        });
        // Màu theo TẦNG (quy ước người dùng 2026-09-25, bảng màu ở components/sodo.css):
        // tầng 1 = is-cap-0 (navy, chỉ tầng gốc); tầng 2..6 = is-cap-1..5; từ tầng 7 lặp lại is-cap-1..5.
        function lopCap(cap) { return cap === 0 ? 0 : ((cap - 1) % 5) + 1; }
        function nut(r, laCha, cap) {
            var a = o.attr ? o.attr(r) : {};
            var at = Object.keys(a).map(function (k) { return ' ' + k + '="' + esc(a[k]) + '"'; }).join('');
            return '<button type="button" class="ums-sodo__nut is-cap-' + lopCap(cap) + (laCha ? ' is-cha' : '') + '"' + at + '>' +
                (o.nhan ? o.nhan(r, laCha) : esc(r.TEN)) + '</button>';
        }
        function nhanh(k, cap) {
            var ds = (con[k] || []).filter(function (r) { if (da[r[idK]]) return false; da[r[idK]] = true; return true; });
            if (!ds.length) return '';
            return '<ul>' + ds.map(function (r) {
                var duoi = nhanh(r[idK], cap + 1);
                return '<li>' + nut(r, !!duoi, cap) + duoi + '</li>';
            }).join('') + '</ul>';
        }
        host.innerHTML = '<div class="ums-sodo"><div class="ums-sodo__khung">' + nhanh('', 0) + '</div></div>';
        return host.firstChild;
    };

    /* =====================================================================
       DANH SÁCH CÁN BỘ bên trái (phân hệ Nhân sự — edu.system.getList_NhanSu)
       ---------------------------------------------------------------------
       Bản gốc chép tay ở hầu hết màn quản trị Nhân sự: ô từ khoá + Tìm kiếm,
       Khoa/Viện/Phòng ban → Bộ môn, Tình trạng làm việc (NS.TTNS), danh sách
       ảnh · họ tên / mã cán bộ / ngày sinh, phân trang máy chủ
       (ums.ref.nhanSuPage = LayDSNhanSu_HoSo_v2). Gộp 2026-09-26 từ năm bản
       tự dựng (hoso, quatrinh, luongA, luongB, chamcongphep) — mọi màn nay
       trông và chạy giống nhau.
       Luật chung: Bộ môn KHOÁ tới khi chọn Khoa (pat.chain) và chỉ liệt kê bộ
       môn của Khoa đó; lọc theo Bộ môn nếu có, không thì theo Khoa.

       pat.dsNhanSuLoc(o) → HTML ô lọc đặt vào side.filter của pat.master — khung "Bộ lọc nâng cao" ẨN SẴN,
           mở bằng nút thanh trượt trên tiêu đề cột; cạnh đó nút Tải lại. Không có nút Tìm kiếm: ô chọn đổi là
           tự tải, gõ từ khoá tự tìm sau 400ms (Enter tìm ngay).
           o = { locTinhTrang (mặc định true), cctcTen, locThem: HTML ô lọc riêng của màn (trong khung nâng cao),
                 sideTools: HTML nút riêng của màn (luôn hiện, dưới ô tìm) }
       pat.dsNhanSu(m, o) → gắn vào pat.master m đã dựng với dsNhanSuLoc
           o = { locTinhTrang, dLaCanBoNgoaiTruong (0 · 1 · -1), tuTai (mặc định
                 true: đổi ô lọc là tải lại), dong(r) → HTML các dòng phụ (mặc
                 định Mã cán bộ + Ngày sinh), onPick(r) }
           → { F, load(trang), boChon(), chon(), rows }
       pat.masterNhanSu(o) → dựng trọn khung hai cột
           o = { el, title, actions, sideTitle, sideTools, locTinhTrang,
                 dLaCanBoNgoaiTruong, dong(r), nhac: 'lời dẫn khi chưa chọn',
                 trong(host) (thay lời dẫn), ghiChu: HTML dưới dòng tên,
                 tenChon(r), dongNut: true (nút Đóng bỏ chọn),
                 onChon(r, host, api), onBoChon() }
           → { m, F, host(), dangChon(), idChon(), tai(trang), taiLai(), boChon(), ds }
       ===================================================================== */
    function ev0(v) { return v === null || v === undefined ? '' : String(v); }

    pat.anhNguoi = function (path) {
        return '<span class="ums-ava"><i class="fa-light fa-user"></i>' +
            (path ? '<img alt="" src="' + esc(ums.files && ums.files.url ? ums.files.url(path) : path) + '" onerror="this.remove()">' : '') + '</span>';
    };

    pat.dsNhanSuLoc = function (o) {
        o = o || {};
        /* Bộ lọc NÂNG CAO ẩn sẵn, mở bằng nút thanh trượt trên tiêu đề cột (người dùng 2026-09-26; cùng
           kiểu .ums-master__adv của Thu tiền / Chứng từ). Ô chọn đổi là tự tải — không còn nút Tìm kiếm. */
        return '<div class="ums-master__adv ums-dsns__loc" data-nsf="adv" hidden>' +
            '<div class="ums-field"><select class="ums-select" data-nsf="cctc" data-ph="' + esc(o.cctcTen || 'Chọn Khoa/Viện/Phòng ban') + '"><option value=""></option></select></div>' +
            '<div class="ums-field"><select class="ums-select" data-nsf="bomon" data-ph="Bộ môn"><option value=""></option></select></div>' +
            (o.locTinhTrang === false ? '' :
                '<div class="ums-field"><select class="ums-select" data-nsf="tt" data-ph="Chọn tình trạng làm việc"><option value=""></option></select></div>') +
            (o.locThem || '') +
            '</div>' +
            (o.sideTools ? '<div class="ums-dsns__nut">' + o.sideTools + '</div>' : '');
    };

    pat.dsNhanSu = function (m, o) {
        o = o || {};
        var side = m.side;
        var F = {
            cctc: side.querySelector('[data-nsf="cctc"]'),
            bomon: side.querySelector('[data-nsf="bomon"]'),
            tt: side.querySelector('[data-nsf="tt"]')
        };
        var tuTai = o.tuTai !== false;
        /* Hai nút trên tiêu đề cột: Tải lại · Bộ lọc nâng cao (mở / đóng khung lọc dưới ô tìm) */
        var tools = side.querySelector('.ums-panel__tools');
        if (tools) tools.insertAdjacentHTML('afterbegin',
            '<button type="button" class="ums-iconbtn" data-nsf="reload" title="Tải lại"><i class="fa-light fa-rotate-right"></i></button>' +
            '<button type="button" class="ums-iconbtn" data-nsf="advbtn" title="Bộ lọc nâng cao"><i class="fa-light fa-sliders"></i></button>');
        var adv = side.querySelector('[data-nsf="adv"]'), advBtn = side.querySelector('[data-nsf="advbtn"]');
        /* Nút lọc tô đậm khi đang có điều kiện lọc (để biết danh sách đang bị lọc dù khung đang đóng) */
        function danhDauLoc() {
            if (!advBtn || !adv) return;
            var co = Array.prototype.some.call(adv.querySelectorAll('select, input'), function (x) { return !!pat.val(x); });
            advBtn.classList.toggle('is-on', co || !adv.hidden);
        }
        var st = { page: 1, size: 10, total: 0, rows: [], chon: '' };
        var con = [];
        ui.enhance(side);

        ums.ref.coCauToChuc({ strCCTC_Loai_Id: '', strCCTC_Cha_Id: '', iTrangThai: 1 }).then(function (ds) {
            con = ds.filter(function (r) { return !!r.DAOTAO_COCAUTOCHUC_CHA_ID; });
            pat.fill(F.cctc, ds.filter(function (r) { return !r.DAOTAO_COCAUTOCHUC_CHA_ID; }), { head: F.cctc.getAttribute('data-ph') });
            pat.fill(F.bomon, [], { head: 'Bộ môn' });
        }).catch(function (err) { ums.api.handle(err, 'cơ cấu tổ chức'); });
        if (F.tt) ums.api.dm('NS.TTNS').then(function (r) { pat.fill(F.tt, r, { head: 'Chọn tình trạng làm việc' }); },
            function (err) { ums.api.handle(err, 'tình trạng làm việc'); });

        if (global.jQuery) {
            jQuery(F.cctc).on('select2:select select2:clear', function () {
                danhDauLoc();
                var v = F.cctc.value;
                pat.fill(F.bomon, v ? con.filter(function (r) { return r.DAOTAO_COCAUTOCHUC_CHA_ID === v; }) : [], { head: 'Bộ môn' });
                if (tuTai) api.load(1);
            });
            jQuery(F.bomon).on('select2:select select2:clear', function () { danhDauLoc(); if (tuTai) api.load(1); });
            if (F.tt) jQuery(F.tt).on('select2:select select2:clear', function () { danhDauLoc(); if (tuTai) api.load(1); });
        }
        pat.chain([F.cctc, F.bomon], { phatLai: false });

        if (adv) adv.addEventListener('change', function (ev) {
            if (tuTai && ev.target.matches('input')) api.load(1);   /* ô riêng kiểu chữ / ngày (locThem) */
            danhDauLoc();
        });
        side.addEventListener('click', function (ev) {
            if (ev.target.closest('[data-nsf="tim"], [data-nsf="reload"]')) { api.load(); return; }
            if (ev.target.closest('[data-nsf="advbtn"]')) { adv.hidden = !adv.hidden; danhDauLoc(); return; }
            var it = ev.target.closest('.ums-dsns__item');
            if (!it || !m.sideBody.contains(it)) return;
            var r = st.rows.filter(function (x) { return String(x.ID) === it.getAttribute('data-id'); })[0];
            if (!r) return;
            st.chon = r.ID;
            Array.prototype.forEach.call(m.sideBody.querySelectorAll('.ums-dsns__item'), function (x) {
                x.classList.toggle('is-active', x === it);
            });
            if (o.onPick) o.onPick(r);
        });
        if (m.search) {
            var hen = 0;
            m.search.addEventListener('keydown', function (ev) {
                if (ev.key === 'Enter') { ev.preventDefault(); clearTimeout(hen); api.load(1); }
            });
            /* Gõ từ khoá là tự tìm sau 400ms ngừng gõ — không cần nút Tìm kiếm */
            m.search.addEventListener('input', function () { clearTimeout(hen); hen = setTimeout(function () { api.load(1); }, 400); });
        }

        function dongPhu(r) {
            if (o.dong) return o.dong(r);
            var ns = ev0(r.NGAYSINH) || ev0(r.THANGSINH) || ev0(r.NAMSINH)
                ? ev0(r.NGAYSINH) + '/' + ev0(r.THANGSINH) + '/' + ev0(r.NAMSINH) : '';
            return '<span class="ums-master__item__sub">Mã cán bộ: ' + esc(ev0(r.MASO)) + '</span>' +
                '<span class="ums-master__item__sub">Ngày sinh: ' + esc(ns) + '</span>';
        }
        function ve() {
            if (m.sideCount) m.sideCount.textContent = '(' + st.total + ')';
            m.sideBody.innerHTML = !st.rows.length ? ui.empty('Không tìm thấy cán bộ', 'fa-users') : st.rows.map(function (r) {
                return '<button type="button" class="ums-master__item ums-dsns__item' + (r.ID === st.chon ? ' is-active' : '') +
                    '" data-id="' + esc(r.ID) + '">' + pat.anhNguoi(r.ANH) +
                    '<span class="ums-master__item__main"><b>' + esc((ev0(r.HODEM) + ' ' + ev0(r.TEN)).trim() || ev0(r.HOTEN)) + '</b>' +
                    dongPhu(r) + '</span></button>';
            }).join('');
            m.setPage({
                index: st.page, size: st.size, total: st.total, shown: st.rows.length,
                onChange: function (p) { if (p >= 1 && p <= Math.ceil(st.total / st.size)) api.load(p); },
                onSize: function (v) { st.size = v; api.load(1); }
            });
        }

        var token = 0;
        var api = {
            F: F,
            rows: [],
            chon: function () { return st.rows.filter(function (x) { return x.ID === st.chon; })[0] || null; },
            boChon: function () { st.chon = ''; ve(); },
            load: function (page) {
                if (page) st.page = page;
                var t = ++token;
                m.sideBody.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
                return ums.ref.nhanSuPage({
                    strTuKhoa: m.search ? (m.search.value || '').trim() : '',
                    strCoCauToChuc_Id: F.bomon.value || F.cctc.value,
                    strTinhTrangNhanSu_Id: F.tt ? F.tt.value : '',
                    dLaCanBoNgoaiTruong: o.dLaCanBoNgoaiTruong !== undefined ? o.dLaCanBoNgoaiTruong : 0,
                    pageIndex: st.page, pageSize: st.size
                }).then(function (kq) {
                    if (t !== token) return;
                    st.rows = kq.rows; st.total = kq.total; api.rows = kq.rows;
                    ve();
                }, function (err) {
                    if (t !== token) return;
                    st.rows = []; st.total = 0; api.rows = [];
                    m.sideBody.innerHTML = ui.fail(err.message);
                    ums.api.handle(err, 'danh sách cán bộ');
                });
            }
        };
        api.load(1);
        return api;
    };

    /* =====================================================================
       ÁP LUẬT CỘT TRÁI (BO-CUC luật 12) lên một pat.master ĐÃ DỰNG — cho màn tự dựng cột trái
       ---------------------------------------------------------------------
       pat.cotTrai(m, { tai: function () {…nạp lại trang 1…}, moSan: false, tuTaiLoc: true })
         m = kết quả pat.master, hoặc { side, search } khi ô tìm tự dựng; tuTaiLoc: false khi màn ĐÃ tự tải lúc đổi ô lọc
         tuTim: false khi ô tìm ĐÃ tự lọc tại chỗ lúc gõ (vd lọc cây) — khỏi nạp lại từ máy chủ mỗi lần gõ.
         Phần tử con của vùng lọc mang data-cot-giu (vd nhãn "Hệ / Khoá" đang lọc) thì giữ nguyên, luôn hiện.
         · nút trên tiêu đề cột: kính lúp → Tải lại (giữ nguyên thuộc tính data-* nên trình xử lý cũ vẫn chạy);
           chưa có nút Tải lại thì thêm (gọi o.tai); có ô lọc thì thêm nút "Bộ lọc nâng cao" (fa-sliders)
         · mọi ô chọn / ô chữ lọc trong .ums-master__filter (trừ ô tìm) dồn vào khung .ums-master__adv ẨN SẴN
           ngay dưới ô tìm (moSan: true = mở sẵn — dùng khi ô lọc bắt buộc chọn trước)
         · ẩn nút "Tìm kiếm" trong cột; gõ ô tìm là tự tìm sau 400ms; đổi ô lọc là tự tải
       Gộp 2026-09-26: 18 màn tự dựng vi phạm (người dùng: "kiểm toàn bộ chưa") — gọi MỘT dòng sau khi dựng xong.
       Kiểm: _harness/kiem-cot-trai.html.
       ===================================================================== */
    pat.cotTrai = function (m, o) {
        o = o || {};
        var side = m.side || (m.el && m.el.querySelector('.ums-master__side'));
        if (!side) return;
        var tai = o.tai || function () {};
        var hen = 0;
        function taiSau(ms) { clearTimeout(hen); hen = setTimeout(function () { tai(1); }, ms); }

        /* 1. Ẩn nút "Tìm kiếm" trong cột (không tính kính lúp trang trí trong ô tìm) */
        Array.prototype.slice.call(side.querySelectorAll('.ums-panel__body button .fa-magnifying-glass')).forEach(function (ic) {
            var b = ic.closest('button');
            if (b.classList.contains('ums-searchbar__icon')) return;
            (b.closest('.ums-field--fit') || b).hidden = true;
        });

        /* 2. Khung nâng cao + dồn ô lọc vào */
        var filt = side.querySelector('.ums-master__filter');
        var adv = side.querySelector('.ums-master__adv');
        if (filt) {
            /* có nội dung lọc ngoài ô tìm (kể cả vùng sẽ được đổ ô chọn SAU khi dựng) */
            var oTim0 = m.search && m.search.closest('.ums-master__search');
            /* vỏ chỉ còn nút Tìm đã ẩn → ẩn luôn vỏ (khỏi để lại khoảng đệm) */
            function giu(ch) { return ch === adv || ch === oTim0 || (oTim0 && ch.contains(oTim0)) || ch.hasAttribute('data-cot-giu'); }
            Array.prototype.forEach.call(filt.children, function (ch) {
                if (giu(ch)) return;
                var conGi = ch.matches('select, input, label, [data-z]') || Array.prototype.some.call(
                    ch.querySelectorAll('select, input, label, [data-z], .ums-check'), function (x) { return !x.closest('[hidden]'); });
                if (!conGi && !ch.textContent.trim()) ch.hidden = true;
            });
            var coLoc = Array.prototype.some.call(filt.children, function (ch) { return !giu(ch) && !ch.hidden; });
            if (coLoc) {
                if (!adv) {
                    adv = document.createElement('div');
                    adv.className = 'ums-master__adv ums-dsns__loc';
                    /* ngay DƯỚI ô tìm (ô tìm có thể nằm trong vùng lọc) */
                    var oTim = m.search && m.search.closest('.ums-master__search');
                    if (oTim && filt.contains(oTim)) oTim.parentNode.insertBefore(adv, oTim.nextSibling);
                    else filt.insertBefore(adv, filt.firstChild);
                }
                /* Dời TOÀN BỘ nội dung vùng lọc (ô chọn, nhãn, nhóm ô đánh dấu…) trừ ô tìm vào khung nâng cao,
                   giữ đúng thứ tự — dời lẻ từng ô thì nhãn / tiêu đề nhóm bị bỏ lại bên ngoài */
                var oTim2 = m.search && m.search.closest('.ums-master__search');
                Array.prototype.slice.call(filt.children).forEach(function (ch) {
                    if (giu(ch)) return;
                    adv.appendChild(ch);
                });
            }
        }
        if (adv) {
            adv.classList.add('ums-dsns__loc');
            adv.hidden = !o.moSan;
            adv.addEventListener('change', function () { danhDau(); if (o.tuTaiLoc !== false) taiSau(300); });
            if (global.jQuery) jQuery(adv).on('select2:select select2:clear', function () { danhDau(); });
        }

        /* 3. Nút trên tiêu đề: kính lúp → Tải lại; thêm Bộ lọc nâng cao */
        var tools = side.querySelector('.ums-panel__head .ums-panel__tools');
        var advBtn = null;
        if (tools) {
            var kinh = tools.querySelector('.fa-magnifying-glass');
            if (kinh) {
                kinh.className = 'fa-light fa-rotate-right';
                kinh.closest('button').title = 'Tải lại';
            } else if (!tools.querySelector('.fa-rotate-right')) {
                tools.insertAdjacentHTML('afterbegin', '<button type="button" class="ums-iconbtn" data-cot="reload" title="Tải lại"><i class="fa-light fa-rotate-right"></i></button>');
            }
            if (adv && !tools.querySelector('.fa-sliders')) {
                tools.insertAdjacentHTML('beforeend', '<button type="button" class="ums-iconbtn" data-cot="adv" title="Bộ lọc nâng cao"><i class="fa-light fa-sliders"></i></button>');
            }
            advBtn = tools.querySelector('[data-cot="adv"]');
            tools.addEventListener('click', function (ev) {
                if (ev.target.closest('[data-cot="reload"]')) { tai(1); return; }
                if (ev.target.closest('[data-cot="adv"]') && adv) { adv.hidden = !adv.hidden; danhDau(); }
            });
        }
        function danhDau() {
            if (!advBtn || !adv) return;
            var co = Array.prototype.some.call(adv.querySelectorAll('select, input'), function (x) { return !!pat.val(x); });
            advBtn.classList.toggle('is-on', co || !adv.hidden);
        }
        danhDau();

        /* 4. Gõ là tự tìm */
        if (m.search && o.tuTim !== false) m.search.addEventListener('input', function () { taiSau(400); });
        return { adv: adv };
    };

    /* =====================================================================
       KHUNG ĐỐI TƯỢNG ĐANG CHỌN (người nộp / sinh viên / đối tượng thu) — dùng chung các màn Thu tiền,
       Thu tiền khác, POS, Rút tiền, Chứng từ, Xuất hoá đơn… (người dùng 2026-09-26: "phải có cái chung",
       trước đây mỗi màn một kiểu: chỗ viên đỏ, chỗ biểu tượng + chữ, "đã chọn" lúc trên tiêu đề lúc cạnh nút)
       ---------------------------------------------------------------------
       pat.noCo(so, chuaRo) → viên "Tổng nợ: -x" (đỏ) / "Tổng dư: x" (xanh) / "Đã hoàn thành" (lục); không phải số → ''
           (hoặc viên xám chuaRo, vd 'Chưa xác định', khi truyền)
       pat.dauDoiTuong(o) → HTML ĐẦU KHUNG (.ums-panel__head) — đặt trong .ums-panel:
           o = { anh: đường dẫn ảnh | '' (biểu tượng người) | false (không ảnh), ten, nhan: HTML nhãn trạng thái,
                 noCo: số NOCO (hoặc bỏ trống rồi cập nhật sau), tools: HTML nút (Đóng ngoài cùng trái, rồi Sửa…) }
           Tên + nhãn + tổng nợ nằm cùng dòng tiêu đề (dính đỉnh khi cuộn). Cập nhật tổng nợ sau khi nạp:
           pat.datNoCo(khung, so) (khung = phần tử chứa đầu khung).
       pat.datDau(panel, o) → dựng / thay đầu khung là CON TRỰC TIẾP đầu tiên của .ums-panel (không bọc thêm lớp nào —
           bọc vào div là mất dính đỉnh), dùng khi khung dựng sẵn một lần rồi đổi người. Trả về panel.
       pat.thanhThu(o) → HTML THANH THAO TÁC của một tab bảng khoản:
           o = { tongLbl: 'Tổng nợ chung các khoản', tong: số/chuỗi, chiTiet: 'data-x="…"' (thuộc tính nút Chi tiết —
                 màn mở HỘP THOẠI), truocNut: HTML (vd ô ngày chứng từ), daChon: true (hiện "Tổng tiền đã chọn"),
                 nut: HTML nút Thu tiền / Rút tiền…, ghiChu: chữ nhạt bên trái khi tab không có tổng }
           Trái: tổng của tab + Chi tiết · Phải: [truocNut] "Tổng tiền đã chọn" + nút. Cập nhật:
           pat.datDaChon(vung, so), pat.datTongTab(vung, so).
       ===================================================================== */
    /* định dạng tiền chung — ums.ui.money (site.config.js `money`) */
    function tienVN(v) { return ui.money(v === undefined || v === null ? 0 : v) || '0'; }
    pat.noCo = function (so, chuaRo) {
        if (so === undefined || so === null || so === '' || !isFinite(Number(so))) return chuaRo ? ui.badge(chuaRo, 'mute') : '';
        var d = Number(so);
        if (d < 0) return ui.badge('Tổng nợ: ' + tienVN(d), 'bad');
        if (d > 0) return ui.badge('Tổng dư: ' + tienVN(d), 'info');
        return ui.badge('Đã hoàn thành', 'ok');
    };
    pat.dauDoiTuong = function (o) {
        o = o || {};
        return '<div class="ums-panel__head ums-dtg">' +
            '<div class="ums-panel__title ums-dtg__ten">' +
                (o.anh === false ? '' : pat.anhNguoi(o.anh || '')) +
                '<b class="ums-dtg__name">' + esc(o.ten || '') + '</b>' +
                (o.nhan || '') +
                '<span class="ums-dtg__noco" data-dtg="noco">' + pat.noCo(o.noCo) + '</span>' +
            '</div>' +
            '<div class="ums-panel__tools">' + (o.tools || '') + '</div>' +
            '</div>';
    };
    pat.datNoCo = function (khung, so, chuaRo) {
        var el = khung && khung.querySelector('[data-dtg="noco"]');
        if (el) el.innerHTML = typeof so === 'string' && /</.test(so) ? so : pat.noCo(so, chuaRo);
    };
    pat.datDau = function (panel, o) {
        if (!panel) return panel;
        var cu = null;
        for (var i = 0; i < panel.children.length; i++) {
            if (panel.children[i].classList.contains('ums-panel__head')) { cu = panel.children[i]; break; }
        }
        if (cu) cu.outerHTML = pat.dauDoiTuong(o);
        else panel.insertAdjacentHTML('afterbegin', pat.dauDoiTuong(o));
        return panel;
    };
    pat.thanhThu = function (o) {
        o = o || {};
        return '<div class="ums-thanhthu">' +
            '<div class="ums-thanhthu__l">' +
                (o.tongLbl ? '<span class="ums-thanhthu__tong">' + esc(o.tongLbl) + ': <b data-tt="tong">' + esc(o.tong === undefined ? '0' : tienVN(o.tong)) + '</b></span>' : '') +
                (o.chiTiet ? '<button type="button" class="ums-btn ums-btn--quiet ums-btn--sm" ' + o.chiTiet + '><i class="fa-light fa-eye"></i><span>Chi tiết</span></button>' : '') +
                (o.ghiChu ? '<span class="ums-thanhthu__ghichu">' + esc(o.ghiChu) + '</span>' : '') +
            '</div>' +
            '<div class="ums-thanhthu__r">' + (o.truocNut || '') +
                (o.daChon === false ? '' : '<span class="ums-thanhthu__chon">Tổng tiền đã chọn: <b data-tt="chon">0</b></span>') +
                (o.nut || '') +
            '</div></div>';
    };
    pat.datDaChon = function (vung, so) {
        var el = vung && vung.querySelector('[data-tt="chon"]');
        if (el) el.textContent = tienVN(so || 0);
    };
    pat.datTongTab = function (vung, so) {
        var el = vung && vung.querySelector('[data-tt="tong"]');
        if (el) el.textContent = tienVN(so || 0);
    };

    pat.masterNhanSu = function (o) {
        o = o || {};
        var m = pat.master({
            el: o.el, title: o.title, actions: o.actions || '',
            side: {
                title: o.sideTitle || 'Danh sách cán bộ', icon: 'fa-users',
                search: 'Nhập từ khóa tìm kiếm',
                filter: pat.dsNhanSuLoc(o)
            },
            main: { title: false }
        });
        m.el.classList.add('ums-dsns');
        var chon = null, host = null;

        function nhac() {
            chon = null; host = null;
            if (obs) { obs.disconnect(); obs = null; }
            m.mainBody.innerHTML = '';
            if (o.trong) { o.trong(m.mainBody); return; }
            m.mainBody.innerHTML = pat.panel({ title: 'Thông tin chung', icon: 'fa-circle-info',
                body: ui.empty(o.nhac || 'Chọn một cán bộ ở danh sách bên trái để xem và cập nhật.', 'fa-hand-pointer') });
        }
        function veChon(r) {
            chon = r;
            var ten = o.tenChon ? o.tenChon(r) : ((ev0(r.HODEM) + ' ' + ev0(r.TEN)).trim() || ev0(r.HOTEN));
            m.mainBody.innerHTML =
                '<div class="ums-panel ums-dsns__dau"><div class="ums-panel__head">' +
                    '<div class="ums-panel__title"><i class="fa-light fa-id-card"></i> ' + esc(ten) +
                    (r.MASO ? ' <span class="ums-u-faint ums-u-fz13">– Mã cán bộ: ' + esc(r.MASO) + '</span>' : '') + '</div>' +
                    (o.dongNut === false ? '' : '<div class="ums-panel__tools">' + ui.btn('close', { attr: { 'data-nsf': 'dong' } }) + '</div>') +
                '</div></div>' +
                (o.ghiChu ? '<div class="ums-dsns__ghichu">' + o.ghiChu + '</div>' : '') +
                '<div class="ums-dsns__noidung" data-z="dsnsNd"></div>';
            host = m.mainBody.querySelector('[data-z="dsnsNd"]');
            if (o.onChon) o.onChon(r, host, api);
            theoDoiDong();
        }
        /* Bên dưới đã có nút Đóng đang hiện (biểu mẫu thêm/sửa…) thì ẨN CẢ DÒNG TÊN (tên + mã + Đóng) — người
           đang chọn đã tô sáng ở danh sách trái, hai hàng Đóng chồng nhau chỉ gây rối (người dùng 2026-09-26). */
        var obs = null;
        function coDongDuoi() {
            if (!host) return false;
            return Array.prototype.some.call(host.querySelectorAll('.ums-btn .fa-xmark'), function (i) {
                return i.closest('.ums-btn').offsetParent !== null;
            });
        }
        function capNhatDong() {
            var dau = m.mainBody.querySelector('.ums-dsns__dau');
            if (dau) dau.hidden = coDongDuoi();
        }
        function theoDoiDong() {
            if (obs) obs.disconnect();
            capNhatDong();
            if (!host || !global.MutationObserver) return;
            var hen = 0;
            obs = new MutationObserver(function () {
                if (hen) return;
                hen = global.requestAnimationFrame ? requestAnimationFrame(function () { hen = 0; capNhatDong(); }) : (capNhatDong(), 0);
            });
            obs.observe(host, { subtree: true, childList: true, attributes: true, attributeFilter: ['hidden', 'class', 'style'] });
        }
        function boChon() { ds.boChon(); nhac(); if (o.onBoChon) o.onBoChon(); }

        m.mainBody.addEventListener('click', function (ev) {
            if (ev.target.closest('[data-nsf="dong"]')) boChon();
        });

        nhac();
        var ds = pat.dsNhanSu(m, {
            locTinhTrang: o.locTinhTrang, dLaCanBoNgoaiTruong: o.dLaCanBoNgoaiTruong, dong: o.dong,
            onPick: veChon
        });
        var api = {
            m: m, master: m, el: m.el, F: ds.F, ds: ds,
            host: function () { return host; },
            dangChon: function () { return chon; },
            idChon: function () { return chon ? chon.ID : ''; },
            tai: function (p) { return ds.load(p); },
            taiLai: function () { return ds.load(); },
            boChon: boChon
        };
        return api;
    };

    /* =====================================================================
       THANH LỌC NGƯỜI HỌC nhiều tầng (gốc: màn Xử lý học vụ, rồi Sinh viên / hồ sơ / quyết định
       chép lại) — đưa lên tầng chung 2026-09-26 từ ums.xlhvKQ.boLoc (ApisXuLyHocVu/…/_ketqua.js).
       pat.boLocNguoiHoc(host, o) → { f(k), v(k), tt, thamSo(), baoCao(add, dau), luong(), z(k), mucXuLy }
         o.hang = [['he','khoa','ct','lop'], ['nam','kql','hk','luong'], ['kh','loai','muc'], ['q','nut']]
           he · khoa · ct · lop  Hệ → Khoá → CT → Lớp CHỌN NHIỀU, getList_* KHÔNG lọc quyền (như gốc),
                                 luật cha → con (pat.chain)
           nam  KHCT_NamNhapHoc/LayDanhSach · kql Khoa quản lý · hk Học kỳ (chọn nhiều)
           luong "N luồng cùng chạy" · kh Kế hoạch xử lý · loai / muc XLHV.LOAIXULY / XLHV.MUCXULY
           q từ khoá · nut Tìm kiếm + vùng [data-z="bc"] (Xuất báo cáo / Import)
         o.them = HTML thêm cuối khung. Luôn có khối "Chọn trạng thái sinh viên" (QLSV.TRANGTHAI).
         o.don = true: he/khoa/ct/lop/hk là ô chọn MỘT (dòng đầu "Tất cả …") thay vì chọn nhiều.
         o.oRieng = { khoá: HTML } ô riêng của màn (màn tự nạp, đọc bằng f(k)/v(k)); o.nut = HTML cuối hàng cuối.
         mucXuLy = Promise danh mục mức xử lý — CHỈ có khi màn có ô 'muc'.
       ===================================================================== */
    function arrD(d) { return Array.isArray(d) ? d : []; }
    function uidD() { return (ums.session && ums.session.userId) || ''; }
    function cnId() { return (ums.state && ums.state.chucNangId) || ''; }
    /* dropSearch_SoLuong gốc — giữ đúng các mục và thứ tự (10 đứng đầu = mặc định) */
    var LUONG_NH = [[10, '10 luồng cùng chạy'], [1, '1 luồng chạy'], [2, '2 luồng chạy'], [30, '30 luồng cùng chạy'],
        [50, '50 luồng cùng chạy'], [100, '100 luồng cùng chạy'], [200, '200 luồng cùng chạy'],
        [500, '500 luồng cùng chạy'], [1000, '1000 luồng cùng chạy']];

    function selNH(k, ph, nhieu) {
        return '<div class="ums-field"><select class="ums-select" data-f="' + k + '" data-ph="' + esc(ph) + '"' +
            (nhieu ? ' multiple' : '') + '>' + (nhieu ? '' : '<option value=""></option>') + '</select></div>';
    }
    /* Ô chọn MỘT thay cho chọn nhiều (o.don — màn gốc dùng dropdown thường) */
    var DON_NH = { he: 'Tất cả hệ đào tạo', khoa: 'Tất cả khóa đào tạo', ct: 'Tất cả chương trình đào tạo', lop: 'Tất cả lớp', hk: 'Tất cả học kỳ' };
    var O_NH = {
        he: function () { return selNH('he', 'Tất cả hệ đào tạo', true); },
        khoa: function () { return selNH('khoa', 'Tất cả khóa đào tạo', true); },
        ct: function () { return selNH('ct', 'Tất cả chương trình đào tạo', true); },
        lop: function () { return selNH('lop', 'Tất cả lớp', true); },
        nam: function () { return selNH('nam', 'Tất cả năm nhập học', true); },
        kql: function () { return selNH('kql', 'Tất cả khoa quản lý', true); },
        hk: function () { return selNH('hk', 'Tất cả học kỳ', true); },
        kh: function () { return selNH('kh', 'Chọn kế hoạch xử lý'); },
        loai: function () { return selNH('loai', 'Chọn loại xử lý'); },
        muc: function () { return selNH('muc', 'Chọn mức xử lý'); },
        luong: function () {
            return '<div class="ums-field"><select class="ums-select" data-f="luong" data-required>' +
                LUONG_NH.map(function (x) { return '<option value="' + x[0] + '">' + esc(x[1]) + '</option>'; }).join('') +
                '</select></div>';
        },
        q: function () {
            return '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>';
        },
        nut: function () {
            return '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
                '<div class="ums-field ums-field--fit" data-z="bc"></div>';
        }
    };

    pat.boLocNguoiHoc = function (host, o) {
        o = o || {};
        var hang = o.hang || [];
        function oHtml(k) {
            if (o.oRieng && o.oRieng[k]) return o.oRieng[k];
            if (o.don && DON_NH[k]) return selNH(k, DON_NH[k], false);
            return O_NH[k]();
        }
        host.innerHTML = pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            hang.map(function (h, i) {
                return '<div class="ums-filter' + (i ? ' ums-u-mt-3' : '') + '">' +
                    h.map(oHtml).join('') + (i === hang.length - 1 ? (o.nut || '') : '') + '</div>';
            }).join('') +
            '<div class="ums-legend ums-legend--cach"><i class="fa-light fa-user-graduate"></i> Chọn trạng thái sinh viên</div>' +
            '<div data-z="tt"></div>' + (o.them || '')
        });
        ui.enhance(host);
        function f(k) { return host.querySelector('[data-f="' + k + '"]'); }
        function v(k) { return f(k) ? pat.val(f(k)) : ''; }
        /* Ô chọn MỘT cần dòng đầu "Tất cả …"; ô chọn nhiều thì không */
        function hd(k) { var el = f(k); return el && !el.multiple ? el.getAttribute('data-ph') : undefined; }
        function loi(t) { return function (err) { ums.api.handle(err, t); }; }
        var P = { pageIndex: 1, pageSize: 1000000 };
        function gop(a, b) { var r = {}; [a, b].forEach(function (x) { Object.keys(x).forEach(function (k) { r[k] = x[k]; }); }); return r; }

        /* ---- Hệ → Khoá → CT → Lớp (edu.system.getList_* gốc, tham số chép nguyên) ---- */
        function napKhoa() {
            return ums.ref.khoaDaoTao(gop(P, { strHeDaoTao_Id: v('he'), strCoSoDaoTao_Id: '', strTuKhoa: '' }))
                .then(function (d) { pat.fill(f('khoa'), d, { name: 'TENKHOA', head: hd('khoa') }); }).catch(loi('khóa đào tạo'));
        }
        function napCT() {
            return ums.ref.chuongTrinh(gop(P, { strKhoaDaoTao_Id: v('khoa'), strN_CN_LOP_Id: '', strKhoaQuanLy_Id: '',
                strToChucCT_Cha_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '' }))
                .then(function (d) { pat.fill(f('ct'), d, { name: 'TENCHUONGTRINH', head: hd('ct') }); }).catch(loi('chương trình đào tạo'));
        }
        /* edu.system.getList_LopQuanLy của Corei — có thêm strDaoTao_KhoaQuanLy_Id rỗng
           (ums.ref.lopQuanLy theo Core thiếu tham số này) */
        function napLop() {
            return ums.api.call({ action: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eDS4xEDQgLw04',
                func: 'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy', silent: true,
                strDaoTao_CoSoDaoTao_Id: '', strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_KhoaDaoTao_Id: v('khoa'),
                strDaoTao_KhoaQuanLy_Id: '', strDaoTao_Nganh_Id: '', strDaoTao_LoaiLop_Id: '', strDaoTao_ToChucCT_Id: v('ct'),
                strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
                .then(function (r) { pat.fill(f('lop'), arrD(r.data), { name: 'TEN', head: hd('lop') }); }).catch(loi('lớp quản lý'));
        }
        if (f('he')) {
            ums.ref.heDaoTao(gop(P, { strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '' }))
                .then(function (d) { pat.fill(f('he'), d, { name: 'TENHEDAOTAO', head: hd('he') }); }).catch(loi('hệ đào tạo'));
            /* Luật cha → con — gắn TRƯỚC trình xử lý nạp để lúc đọc giá trị các tầng dưới đã xoá trắng */
            pat.chain([f('he'), f('khoa'), f('ct'), f('lop')], { phatLai: false });
            var NAP = { he: napKhoa, khoa: napCT, ct: napLop };
            ['he', 'khoa', 'ct'].forEach(function (k) {
                jQuery(f(k)).on('select2:select select2:unselect select2:clear', function () { NAP[k](); });
            });
        }

        if (f('nam')) {
            ums.api.call({ action: 'KHCT_NamNhapHoc/LayDanhSach', method: 'GET', silent: true, strNguoiThucHien_Id: '' })
                .then(function (r) { pat.fill(f('nam'), arrD(r.data), { id: 'NAMNHAPHOC', name: 'NAMNHAPHOC' }); })
                .catch(loi('năm nhập học'));
        }
        if (f('kql')) ums.ref.khoaQuanLy().then(function (d) { pat.fill(f('kql'), d, { name: 'TEN' }); }).catch(loi('khoa quản lý'));
        if (f('hk')) {
            ums.ref.thoiGianDaoTao({ strNam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 })
                .then(function (d) { pat.fill(f('hk'), d, { name: 'DAOTAO_THOIGIANDAOTAO', head: hd('hk') }); }).catch(loi('học kỳ'));
        }
        /* Kế hoạch xử lý: gốc nạp MỘT lần lúc mở màn, học kỳ lúc đó còn trống — giữ như gốc */
        if (f('kh')) {
            ums.api.call({ action: 'XLHV_KeHoachXuLy/LayDanhSach', method: 'GET', silent: true,
                strTuKhoa: '', strChucNang_Id: cnId(), strDaoTao_ThoiGianDaoTao_Id: v('hk'),
                strNguoiTao_Id: uidD(), pageIndex: 1, pageSize: 100000 })
                .then(function (r) { pat.fill(f('kh'), arrD(r.data), { name: 'TEN', head: 'Chọn kế hoạch xử lý' }); })
                .catch(loi('kế hoạch xử lý'));
        }
        if (f('loai')) {
            ums.api.dm('XLHV.LOAIXULY').then(function (d) {
                pat.fill(f('loai'), d, { head: pat.dmTitle(d) || 'Chọn loại xử lý' });
            }).catch(loi('loại xử lý'));
        }
        /* Mức xử lý chỉ nạp khi màn có ô này (trước đây mọi màn đều gọi thừa XLHV.MUCXULY) */
        var mucXuLy;
        if (f('muc')) {
            mucXuLy = ums.api.dm('XLHV.MUCXULY');
            mucXuLy.then(function (d) { pat.fill(f('muc'), d, { head: pat.dmTitle(d) || 'Chọn mức xử lý' }); }, loi('mức xử lý'));
        }

        var tt = pat.checks(host.querySelector('[data-z="tt"]'), ums.api.dm('QLSV.TRANGTHAI'),
            { cols: 3, what: 'trạng thái sinh viên' });

        return {
            f: f, v: v, tt: tt, mucXuLy: mucXuLy,
            z: function (k) { return host.querySelector('[data-z="' + k + '"]'); },
            luong: function () { return Math.max(1, Number(v('luong')) || 10); },
            /* getList_XuLyHocVu / getList_TraCuuKetQua gốc (trừ trang) */
            thamSo: function () {
                return {
                    strTuKhoa: f('q') ? (f('q').value || '').trim() : '',
                    strChucNang_Id: cnId(),
                    strKhoaQuanLy_Id: v('kql'),
                    strHeDaoTao_Id: v('he'),
                    strKhoaDaoTao_Id: v('khoa'),
                    strChuongTrinh_Id: v('ct'),
                    strLopQuanLy_Id: v('lop'),
                    strNamNhapHoc: v('nam'),
                    strNguoiThucHien_Id: uidD(),
                    strNguoiDangNhap_Id: uidD(),
                    strTrangThaiNguoiHoc_Id: tt.val(),
                    strDaoTao_ThoiGianDaoTao_Id: v('hk'),
                    strXLHV_KeHoachXuLy_Id: v('kh'),
                    strLoaiXuLy_Id: v('loai'),
                    strMucXuLy_Id: v('muc'),
                    strTinhTrangXacNhan_Id: ''          // gốc đọc dropAAAA (không có ô này)
                };
            },
            /* Khối addKeyValue của getList_MauImport gốc — phần chung hai màn:
               từng id trạng thái riêng lẻ, rồi các cặp của obj_list (strTrangThaiNguoiHoc_Id ghép lại lần nữa) */
            baoCao: function (add, dau) {
                tt.ids().forEach(function (id) { add('strTrangThaiNguoiHoc_Id', id); });
                Object.keys(dau || {}).forEach(function (k) { add(k, dau[k]); });
                var p = {
                    strKhoaQuanLy_Id: v('kql'), strHeDaoTao_Id: v('he'), strKhoaDaoTao_Id: v('khoa'),
                    strChuongTrinh_Id: v('ct'), strLopQuanLy_Id: v('lop'), strNamNhapHoc: v('nam'),
                    strNguoiThucHien_Id: uidD(), strTrangThaiNguoiHoc_Id: tt.val(),
                    strDaoTao_ThoiGianDaoTao_Id: v('hk'), strXLHV_KeHoachXuLy_Id: v('kh'), strLoaiXuLy_Id: v('loai')
                };
                Object.keys(p).forEach(function (k) { add(k, p[k]); });
            }
        };
    };

    ums.pat = pat;

})(window);
