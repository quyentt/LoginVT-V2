/* =========================================================================
   Dùng chung cho nhóm màn "lưới hệ số / đơn giá" của danhmucheso
   (apdungcongthucphi, donviphimoi*, hesohocphan*, hesolophocphan,
   hocphansotien*, kehoachthuchi). Nạp bằng thẻ <script> TRƯỚC tệp màn hình.

       ums.dmhsA.*

   Chỉ còn những thứ RIÊNG của nhóm màn này. Mọi bố cục dùng lại được đã
   chuyển sang tầng chung (xem _v2/BO-CUC.md) — ở đây chỉ còn lớp vỏ giữ
   nguyên tên hàm để 28 màn không phải sửa theo:
     · khung trang / thanh lọc / khung panel  → ums.pat.page / filterBar / panel
     · đổ ô chọn, đọc giá trị ô              → ums.pat.fill / ums.pat.val
     · tiền (edu.util.formatCurrency…)       → ums.pat.money / ums.pat.num
     · lưới nhập (ô, ô đã sửa, phím mũi tên) → ums.pat.matrix  (A.cell/A.dirty/
       A.watchCells/A.nav ĐÃ BỎ — xem D.screen bên dưới)
   Còn lại riêng của module:
     · các ô lọc/ô biểu mẫu theo data-k của nhóm màn này
     · danh mục hay dùng (thời gian đào tạo, khoản thu, kiểu học)
     · bộ lọc Khoa quản lý → Hệ → Khoá → Chương trình → Lớp THEO QUYỀN
       (edu.extend.genBoLoc_HeKhoa, Core/systemextend.js:6713) — ums.ref.cascade
       là bản KHÔNG lọc quyền nên không thay được
   Không gắn sự kiện lên document/window — mọi sự kiện gắn vào phần tử
   gốc của màn hình.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat;
    var A = ums.dmhsA = ums.dmhsA || {};
    var esc = ui.esc;

    /* ---------- Truy vấn ------------------------------------------------- */
    A.q = function (root, sel) { return root.querySelector(sel); };
    A.qa = function (root, sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); };
    A.k = function (root, key) { return root.querySelector('[data-k="' + key + '"]'); };

    /** Giá trị một ô theo data-k. Ô chọn nhiều → "a,b" (ums.pat.val) */
    A.val = function (root, key) {
        var el = typeof key === 'string' ? A.k(root, key) : key;
        if (!el) return '';
        if (el.type === 'checkbox') return el.checked;
        return pat.val(el);
    };

    /** Ghi giá trị (và báo select2 vẽ lại) — edu.util.viewValById */
    A.set = function (root, key, v) {
        var el = typeof key === 'string' ? A.k(root, key) : key;
        if (!el) return;
        if (el.multiple && typeof v === 'string') v = v ? v.split(',') : [];
        if (el.multiple) {
            Array.prototype.forEach.call(el.options, function (o) { o.selected = v.indexOf(o.value) >= 0; });
        } else {
            el.value = v === null || v === undefined ? '' : v;
        }
        if (window.jQuery) jQuery(el).trigger('change.select2');
    };

    /** Chữ đang hiện của ô chọn — edu.util.getTextById_Combo */
    A.text = function (root, key) {
        var el = A.k(root, key);
        if (!el || el.selectedIndex < 0 || !el.value) return '';
        return el.options[el.selectedIndex].text;
    };

    /* ---------- Tiền (ums.pat.money / ums.pat.num) ------------------------ */
    /** edu.util.formatCurrency: rỗng/null → "0", ngăn nghìn bằng dấu phẩy */
    A.money = function (v) { return pat.money(v === null || v === undefined || v === '' ? 0 : v); };
    /** Bỏ dấu phẩy trước khi gửi — .replace(/,/g, '') của bản gốc */
    A.unmoney = function (s) { return pat.num(s); };
    /** edu.util.convertStrToNum: rỗng → 0, còn lại bỏ dấu phẩy */
    A.num = function (s) {
        if (s === null || s === undefined || s === '' || s === 0 || s === '0') return 0;
        return pat.num(s);
    };

    /* ---------- Khung HTML (ums.pat.page / panel / filterBar) ------------- */
    A.head = function (title, actionsHtml) { return pat.page(title, actionsHtml); };

    /** Nút thường dạng ums-btn, gắn data-a để bắt sự kiện */
    A.btn = function (act, text, icon, mod) {
        return '<button type="button" class="ums-btn ums-btn--' + (mod || 'out-primary') + '" data-a="' + esc(act) + '">' +
            (icon ? '<i class="fa-light ' + esc(icon) + '"></i>' : '') + '<span>' + esc(text) + '</span></button>';
    };

    /** Ô lọc chọn (nhãn nằm trong ô) */
    A.fsel = function (key, label, opts) {
        opts = opts || {};
        return '<div class="ums-field"' + (opts.style ? ' style="' + esc(opts.style) + '"' : '') + '>' +
            '<select class="ums-select" data-k="' + esc(key) + '" data-ph="' + esc(label) + '"' +
            (opts.multiple ? ' multiple' : '') + '>' +
            (opts.multiple ? '' : '<option value="">' + esc(label) + '</option>') +
            (opts.options || '') + '</select></div>';
    };
    A.finput = function (key, label, opts) {
        opts = opts || {};
        return '<div class="ums-field"><input class="ums-input" data-k="' + esc(key) + '" placeholder="' + esc(label) + '"' +
            ' autocomplete="off"' + (opts.date ? ' data-date="1"' : '') + '></div>';
    };
    A.fcheck = function (key, label) {
        return '<div class="ums-field ums-field--fit"><label class="ums-check" style="height:var(--ums-control-h)">' +
            '<input type="checkbox" data-k="' + esc(key) + '"> ' + esc(label) + '</label></div>';
    };
    A.fbtn = function (html) { return '<div class="ums-field ums-field--fit">' + html + '</div>'; };

    A.filter = function (inner) {
        return pat.panel({ title: false, cls: 'ums-u-mb-4', body: '<div class="ums-filter">' + inner + '</div>' });
    };

    /** Khung nội dung — ums.pat.panel (o.body = tên data-z, o.html = nội dung) */
    A.panel = function (o) {
        return pat.panel({
            cls: o.cls, title: o.title || 'Danh sách', icon: o.icon, count: o.count, tools: o.tools,
            zone: o.body, flush: o.flush !== false, body: o.html, foot: o.foot
        });
    };

    /** Dòng biểu mẫu nhãn trái trong hộp thoại */
    A.row = function (label, control, opts) {
        return ui.field(label, control, { inline: true, labelWidth: (opts && opts.labelWidth) || '150px', required: opts && opts.required, hint: opts && opts.hint });
    };
    A.sel = function (key, opts) {
        opts = opts || {};
        return '<select class="ums-select" data-k="' + esc(key) + '" data-ph="' + esc(opts.ph || '-- Chọn --') + '"' +
            (opts.multiple ? ' multiple' : '') + '>' + (opts.multiple ? '' : '<option value=""></option>') + (opts.options || '') + '</select>';
    };
    A.input = function (key, opts) {
        opts = opts || {};
        return '<input class="ums-input" data-k="' + esc(key) + '" autocomplete="off"' +
            (opts.date ? ' data-date="1" placeholder="dd/mm/yyyy"' : (opts.ph ? ' placeholder="' + esc(opts.ph) + '"' : '')) +
            (opts.money ? ' data-money="1" inputmode="decimal"' : '') + '>';
    };

    /* Kiểu của nhóm màn: danhmucheso/css/_chung_a.css (nạp bằng <link> trong html). */

    A.mount = function (root, html) {
        root.innerHTML = html;
        A.initControls(root);
    };

    /** Gắn select2 / lịch / ô tiền. ums.ui.enhance lo select2 + flatpickr và
        tự tìm <dialog> cha nên không cần truyền dlgParent nữa. */
    A.initControls = function (el) {
        ui.enhance(el);
        A.qa(el, 'input[data-money]').forEach(A.moneyInput);
    };

    /** Tự thêm dấu phẩy ngăn nghìn khi gõ (bản gốc dùng inputmask/formatCurrency) */
    A.moneyInput = function (i) {
        i.addEventListener('blur', function () {
            var raw = A.unmoney(i.value);
            if (raw !== '' && !isNaN(Number(raw))) i.value = A.money(raw);
        });
    };

    /** Đổ ô chọn — edu.system.loadToCombo_data → ums.pat.fill */
    A.fill = function (el, rows, o) {
        o = o || {};
        pat.fill(el, rows, { id: o.id, name: o.name, head: o.head });
    };

    /** Bắt sự kiện chọn — bản gốc dùng 'select2:select' (không bắn khi xoá trắng) */
    A.onPick = function (el, fn) {
        if (!el) return;
        if (window.jQuery && jQuery.fn.select2) jQuery(el).on('select2:select', fn);
        else el.addEventListener('change', fn);
    };
    /** Bắt cả chọn và xoá trắng */
    A.onChange = function (el, fn) {
        if (!el) return;
        if (window.jQuery) jQuery(el).on('change', fn); else el.addEventListener('change', fn);
    };

    /** Gắn một trình xử lý cho mọi [data-a] trong root: map { tên: hàm(el, ev) } */
    A.actions = function (root, map) {
        root.addEventListener('click', function (e) {
            var b = e.target.closest('[data-a]');
            if (!b || !root.contains(b)) return;
            var f = map[b.getAttribute('data-a')];
            if (f) { e.preventDefault(); f(b, e); }
        });
    };

    /**
     * Hộp thoại biểu mẫu: ums.ui.dialog + gắn select2/lịch/ô tiền.
     *   A.dialog({ title, icon, size, body, buttons }) → dlg (dlg.body, dlg.close())
     */
    /** Biểu mẫu thêm / sửa bản ghi NGAY TRONG TRANG (BO-CUC luật 1, người dùng 2026-09-30) — cùng tham số và giá trị trả về như
     *  A.dialog, thêm o.host = vùng gốc của màn. Hộp thoại (A.dialog) nay chỉ còn cho việc phụ: Kế thừa, tìm kiếm, xem danh sách. */
    A.form = function (o) {
        var f = ums.pat.formTrang({ host: o.host, title: o.title, icon: o.icon, body: o.body, buttons: o.buttons, onClose: o.onClose, cols: o.cols });
        A.initControls(f.body);
        return f;
    };
    A.dialog = function (o) {
        var dlg = ui.dialog({
            title: o.title, icon: o.icon, size: o.size || 'md',
            body: o.body, buttons: o.buttons, onClose: o.onClose
        });
        A.initControls(dlg.body);
        return dlg;
    };

    /* ---------- Gọi API trả mảng ---------------------------------------- */
    A.rows = function (call) {
        return ums.api.call(call).then(function (r) {
            var d = r.data;
            return Array.isArray(d) ? d : (d && d.rs) || [];
        });
    };

    /* Lưới nhập: dùng ums.pat.matrix (ô nhập, ô đã sửa, phím mũi tên / Enter,
       nút sửa trong ô đều nằm ở đó). A.cell / A.dirty / A.watchCells / A.nav
       đã bỏ — chúng chép lại đúng những gì ums.pat.matrix làm. */

    /** Ô chọn tất cả ở tiêu đề bảng (edu.util.checkedAll_BgRow) */
    A.checkAll = function (host, allSel, itemSel) {
        host.addEventListener('change', function (e) {
            if (!e.target.matches(allSel)) return;
            A.qa(host, itemSel).forEach(function (c) { c.checked = e.target.checked; });
        });
    };

    /* ---------- Danh mục hay dùng (tham số chép từ bản gốc) --------------- */
    /** CM_ThoiGianDaoTao/LayDSDAOTAO_ThoiGianDaoTao — cột DAOTAO_THOIGIANDAOTAO */
    A.thoiGian = function () {
        return A.rows({
            action: 'CM_ThoiGianDaoTao/LayDSDAOTAO_ThoiGianDaoTao', method: 'GET', silent: true,
            versionAPI: 'v1.0', strDAOTAO_Nam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '',
            pageIndex: 1, pageSize: 10000
        });
    };
    /** CM_DanhMucDuLieu/LayDanhSach#KHDT.DIEM.KIEUHOC */
    A.kieuHoc = function () {
        return A.rows({
            action: 'CM_DanhMucDuLieu/LayDanhSach', method: 'GET', silent: true,
            versionAPI: 'v1.0', strMaBangDanhMuc: 'KHDT.DIEM.KIEUHOC'
        });
    };
    /** TC_KhoanThu/LayDanhSach — như getList_LoaiKhoan của các màn gốc */
    A.khoanThu = function () {
        return A.rows({
            action: 'TC_KhoanThu/LayDanhSach', method: 'GET', silent: true,
            strTuKhoa: '', pageIndex: 1, pageSize: 10000, strNhomCacKhoanThu_Id: '',
            strCanBoQuanLy_Id: '', strNguoiThucHien_Id: ''
        });
    };

    /* ---------- Bộ lọc theo quyền — edu.extend.genBoLoc_HeKhoa ----------- */
    /**
     * A.boLoc({ kql, he, khoa, ct, lop })  (phần tử select, ô nào thiếu thì bỏ)
     * Lúc mở chỉ nạp Khoa quản lý + Hệ, như bản gốc. Chọn KQL/Hệ → nạp
     * Khoá, CT, Lớp; chọn Khoá → CT, Lớp; chọn CT → Lớp.
     */
    A.boLoc = function (o) {
        var uid = function () { return (ums.session && ums.session.userId) || ''; };
        var cn = function () { return (ums.state && ums.state.chucNangId) || ''; };
        var v = function (el) { return el ? A.val(el.parentNode, el) : ''; };

        function khoaQL() {
            if (!o.kql) return Promise.resolve();
            return A.rows({
                action: 'KHCT_ThongTin_MH/DSA4BRIKKS4gEDQgLw04ESkgLxA0OCQv',
                func: 'pkg_kehoach_thongtin.LayDSKhoaQuanLyPhanQuyen',
                silent: true, strNguoiThucHien_Id: uid()
            }).then(function (r) { A.fill(o.kql, r, { name: 'TEN', head: 'Chọn khoa quản lý' }); });
        }
        function he() {
            if (!o.he) return Promise.resolve();
            return A.rows({
                action: 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eCSQFIC4VIC4QNDgkLwPP',
                func: 'pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTaoQuyen',
                silent: true, strTuKhoa: '',
                strDaoTao_KhoaQuanLy_Id: '',          // bản gốc đọc 'dropKhoaQuanLy11111…' — ô không tồn tại
                strDaoTao_HinhThucDaoTao_Id: '', strDaoTao_BacDaoTao_Id: '',
                strNguoiThucHien_Id: uid(), strChucNang_Id: cn(), pageIndex: 1, pageSize: 1000000
            }).then(function (r) { A.fill(o.he, r, { name: 'TENHEDAOTAO', head: 'Chọn hệ đào tạo' }); });
        }
        function khoa() {
            if (!o.khoa) return Promise.resolve();
            return A.rows({
                action: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eCikuIAUgLhUgLhA0OCQv',
                func: 'pkg_kehoach_thongtin.LayDSKS_DaoTao_KhoaDaoTaoQuyen',
                silent: true, strTuKhoa: '', strDaoTao_KhoaQuanLy_Id: v(o.kql), strDaoTao_HeDaoTao_Id: v(o.he),
                strDaoTao_CoSoDaoTao_Id: '', strNguoiTao_Id: '',
                strNguoiThucHien_Id: uid(), strChucNang_Id: cn(), pageIndex: 1, pageSize: 1000000
            }).then(function (r) { A.fill(o.khoa, r, { name: 'TENKHOA', head: 'Chọn khóa đào tạo' }); });
        }
        function ct() {
            if (!o.ct) return Promise.resolve();
            return A.rows({
                action: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eFS4CKTQiAhUQNDgkLwPP',
                func: 'pkg_kehoach_thongtin.LayDSKS_DaoTao_ToChucCTQuyen',
                silent: true, strTuKhoa: '', strDaoTao_HeDaoTao_Id: v(o.he), strDaoTao_KhoaDaoTao_Id: v(o.khoa),
                strDaoTao_N_CN_Id: '', strDaoTao_KhoaQuanLy_Id: v(o.kql), strDaoTao_ToChucCT_Cha_Id: '',
                strNguoiThucHien_Id: uid(), strChucNang_Id: cn(), pageIndex: 1, pageSize: 1000000
            }).then(function (r) { A.fill(o.ct, r, { name: 'TENCHUONGTRINH', head: 'Chọn chương trình đào tạo' }); });
        }
        function lop() {
            if (!o.lop) return Promise.resolve();
            return A.rows({
                action: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eDS4xEDQgLw04EDQ4JC8P',
                func: 'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLyQuyen',
                silent: true, strTuKhoa: '', strDaoTao_HeDaoTao_Id: v(o.he), strDaoTao_CoSoDaoTao_Id: '',
                strDaoTao_KhoaDaoTao_Id: v(o.khoa), strDaoTao_Nganh_Id: '', strDaoTao_LoaiLop_Id: '',
                strDaoTao_ToChucCT_Id: v(o.ct), strDaoTao_KhoaQuanLy_Id: v(o.kql), strNhomlop_Id: '',
                strNguoiThucHien_Id: uid(), strChucNang_Id: cn(), pageIndex: 1, pageSize: 1000000
            }).then(function (r) { A.fill(o.lop, r, { name: 'TEN', head: 'Chọn lớp' }); });
        }

        function err(e) { ums.api.handle(e, 'bộ lọc hệ/khoá'); }
        A.onPick(o.kql, function () { Promise.all([khoa(), ct(), lop()]).catch(err); });
        A.onPick(o.he, function () { Promise.all([khoa(), ct(), lop()]).catch(err); });
        A.onPick(o.khoa, function () { Promise.all([ct(), lop()]).catch(err); });
        A.onPick(o.ct, function () { lop().catch(err); });
        // Chưa chọn tầng trên thì khoá tầng dưới; xoá tầng trên thì xoá tầng dưới
        ums.pat.chain([o.he, o.khoa, o.ct, o.lop]);

        var ready = Promise.all([khoaQL(), he()]).catch(err);
        return { ready: ready, reloadKhoa: khoa, reloadCT: ct, reloadLop: lop };
    };

    /* ---------- Dữ liệu mẫu dùng chung (chỉ đọc ở chế độ dựng thử) -------- */
    if (ums.demo && ums.demo.add) {
        var HE = [
            { ID: 'HE1', TENHEDAOTAO: 'Đại học chính quy', MAHEDAOTAO: 'DHCQ' },
            { ID: 'HE2', TENHEDAOTAO: 'Đại học vừa làm vừa học', MAHEDAOTAO: 'VLVH' },
            { ID: 'HE3', TENHEDAOTAO: 'Thạc sĩ', MAHEDAOTAO: 'THS' }
        ];
        var KHOA = [
            { ID: 'KH1', TENKHOA: 'K66 (2021-2025)', MAKHOA: 'K66', DAOTAO_HEDAOTAO_ID: 'HE1' },
            { ID: 'KH2', TENKHOA: 'K67 (2022-2026)', MAKHOA: 'K67', DAOTAO_HEDAOTAO_ID: 'HE1' },
            { ID: 'KH3', TENKHOA: 'K68 (2023-2027)', MAKHOA: 'K68', DAOTAO_HEDAOTAO_ID: 'HE1' },
            { ID: 'KH4', TENKHOA: 'VLVH 2024', MAKHOA: 'V24', DAOTAO_HEDAOTAO_ID: 'HE2' }
        ];
        var KQL = [
            { ID: 'KQ1', TEN: 'Khoa Công nghệ thông tin', MA: 'CNTT' },
            { ID: 'KQ2', TEN: 'Khoa Kinh tế', MA: 'KT' },
            { ID: 'KQ3', TEN: 'Khoa Ngoại ngữ', MA: 'NN' }
        ];
        var CT = [
            { ID: 'CT1', TENCHUONGTRINH: 'Công nghệ thông tin', MACHUONGTRINH: '7480201', DAOTAO_KHOADAOTAO_ID: 'KH2' },
            { ID: 'CT2', TENCHUONGTRINH: 'Kỹ thuật phần mềm', MACHUONGTRINH: '7480103', DAOTAO_KHOADAOTAO_ID: 'KH2' },
            { ID: 'CT3', TENCHUONGTRINH: 'Quản trị kinh doanh', MACHUONGTRINH: '7340101', DAOTAO_KHOADAOTAO_ID: 'KH2' },
            { ID: 'CT4', TENCHUONGTRINH: 'Ngôn ngữ Anh', MACHUONGTRINH: '7220201', DAOTAO_KHOADAOTAO_ID: 'KH2' }
        ];
        var LOP = [
            { ID: 'L1', TEN: 'CNTT 67A', MA: '67CNTT1' }, { ID: 'L2', TEN: 'CNTT 67B', MA: '67CNTT2' },
            { ID: 'L3', TEN: 'QTKD 67A', MA: '67QTKD1' }
        ];
        var TG = [
            { ID: 'TG1', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm 2025-2026' },
            { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 năm 2025-2026' },
            { ID: 'TG3', DAOTAO_THOIGIANDAOTAO: 'Học kỳ hè năm 2025-2026' },
            { ID: 'TG4', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm 2026-2027' }
        ];
        var KIEUHOC = [
            { ID: 'KHO1', TEN: 'Học lần đầu', MA: 'HLD' }, { ID: 'KHO2', TEN: 'Học lại', MA: 'HL' },
            { ID: 'KHO3', TEN: 'Học cải thiện', MA: 'HCT' }
        ];
        var byHe = function (o) { return KHOA.filter(function (r) { return !o.strDaoTao_HeDaoTao_Id && !o.strDAOTAO_HeDaoTao_Id || r.DAOTAO_HEDAOTAO_ID === (o.strDaoTao_HeDaoTao_Id || o.strDAOTAO_HeDaoTao_Id); }); };
        ums.demo.add({
            'pkg_kehoach_thongtin.LayDSKhoaQuanLyPhanQuyen': KQL,
            'pkg_kehoach_thongtin.LayDSKhoaQuanLy': KQL,
            'pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTaoQuyen': HE,
            'pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTao': HE,
            'KHCT_ThongTin/LayDSDaoTao_HeDaoTaoQuyen': HE,
            'pkg_kehoach_thongtin.LayDSKS_DaoTao_KhoaDaoTaoQuyen': byHe,
            'pkg_kehoach_thongtin.LayDSKS_DaoTao_KhoaDaoTao': byHe,
            'KHCT_ThongTin/LayDSKS_DaoTao_KhoaDaoTaoQuyen': byHe,
            'pkg_kehoach_thongtin.LayDSKS_DaoTao_ToChucCTQuyen': CT,
            'pkg_kehoach_thongtin.LayDSKS_DaoTao_ToChucCT': CT,
            'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLyQuyen': LOP,
            'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy': LOP,
            'CM_ThoiGianDaoTao/LayDSDAOTAO_ThoiGianDaoTao': TG,
            'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao': TG,
            'CM_DanhMucDuLieu/LayDanhSach#KHDT.DIEM.KIEUHOC': KIEUHOC
        });
    }
})();

/* =========================================================================
   KHỐI NỐI THÊM — họ "đơn vị phí": ums.dmhsA.dvp
   Dùng cho donviphimoi, donviphimoict, donviphimoihp, donviphimoilop.
   Bản gốc: ApisTaiChinh/Modules/danhmucheso/scripts/donviphimoi*.js

   Bốn màn gốc là bốn bản chép của cùng một tệp, khác nhau ở: lời gọi nạp
   cột thời gian (dtCot) và nạp dòng, cột dòng, khoá ô (PHAMVIAPDUNG_ID hay
   ID), ô "phạm vi áp dụng" trong hộp thoại, và cách nạp hệ/khoá. Phần GIỐNG
   NHAU đặt ở đây, chép nguyên tham số:
       TC_DonViPhi_SoTien/LayDanhSach                          GET  giá trị ô (TONGSOTIEN)
       TC_DonViPhi_SoTien/ThemMoi | Sua_TaiChinh_DonViPhi_SoTien    lưu một ô
       TC_DonViPhi_SoTien/Xoa                                  xoá một ô (strId)
       TC_DonViPhi_Nganh/ThemMoi                               "Khai nhanh", từng ngành
       KHCT_ThongTin/LayDSDaoTao_HeDaoTaoQuyen                 GET  hệ theo quyền (donviphimoi, lop)
       KHCT_ThongTin/LayDSKS_DaoTao_KhoaDaoTaoQuyen            GET  khoá theo quyền (donviphimoi, lop)
   Phần khác nhau do tệp màn hình truyền vào D.screen(root, cfg) — xem chú
   thích của hàm đó.

   Lỗi bản gốc ở phần chung:
     · Khai nhanh: dChoPheoSua = $('#ckhChoSua').is(':checkbox') ? 1 : 0 —
       kiểm tra KIỂU phần tử nên luôn ra 1. Ở đây gửi theo trạng thái đánh
       dấu thật (CHUYEN-DOI mục 1.4).
     · Hộp thoại Đơn vị phí: bản gốc CÓ ô Kiểu học (dropNew_KieuHoc) nhưng
       hàm lưu lại đọc ô của BỘ LỌC — đổi trong hộp thoại không ăn. Bản mới
       giữ ô đó và gửi đúng giá trị người dùng chọn (mở ra đã đặt sẵn bằng bộ
       lọc nên không đụng vào thì y hệt bản gốc).
     · Nút Xoá trong hộp thoại khi THÊM MỚI gọi Xoa với strId rỗng — bỏ,
       chỉ hiện khi sửa. Xoá bản gốc không hỏi lại — ở đây có hỏi xác nhận.
     · Khai nhanh, ô khoá chọn nhiều để trống: getValCombo trả null rồi gọi
       .replace → lỗi JS ở jQuery 2 (indexi). Ở đây gửi chuỗi rỗng.
   Ô không tồn tại trong HTML gốc (dropNghiepVu_DVP, dropDonViTinh_DVP,
   dropNew_NghiepVu, dropNew_DonViTinh, dropNew_KeThua_All, txtAAAA, dropAAAA)
   → chuỗi rỗng, đúng giá trị bản gốc đang gửi.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, A = ums.dmhsA, esc = ui.esc;
    var D = A.dvp = {};

    var LABEL = {
        kql: 'Chọn khoa quản lý', he: 'Chọn hệ đào tạo', khoa: 'Chọn khóa đào tạo',
        ct: 'Chọn chương trình đào tạo', khoanthu: 'Chọn khoản thu',
        thoigian: 'Chọn thời gian đào tạo', kieuhoc: 'Chọn kiểu học'
    };
    var KEYS = ['kql', 'he', 'khoa', 'ct', 'khoanthu', 'thoigian', 'kieuhoc'];
    D.LABEL = LABEL;

    /* ---------- Lời gọi giống nhau ở cả bốn màn --------------------------- */

    /** getList_DonViPhiSoTien — f = giá trị bộ lọc */
    D.listCall = function (f) {
        return {
            action: 'TC_DonViPhi_SoTien/LayDanhSach', method: 'GET', versionAPI: 'v1.0',
            strDiem_KieuHoc_Id: f.kieuhoc,
            strTuKhoa: '', strPhamViApDung_Id: '', strPhanCapApDung_Id: '', strNgayApDung: '',
            strDonViTinh_Id: '',                               // dropDonViTinh_DVP không tồn tại
            strTaiChinh_CacKhoanThu_Id: f.khoanthu,
            strDaoTao_ThoiGianDaoTao_Id: f.thoigian,
            strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000
        };
    };

    /** save_DonViPhiSoTien (một ô của lưới) và save_DonViPhiSoTien_One (hộp thoại) */
    D.saveCall = function (o) {
        return {
            action: o.id ? 'TC_DonViPhi_SoTien/Sua_TaiChinh_DonViPhi_SoTien' : 'TC_DonViPhi_SoTien/ThemMoi',
            versionAPI: 'v1.0',
            strDiem_KieuHoc_Id: o.kieuhoc,                     // luôn là bộ lọc dropKieuHoc_DVP
            strId: o.id || '',
            strNghiepVuApDung_Id: '',                          // dropNghiepVu_DVP / dropNew_NghiepVu không tồn tại
            strDonViTinh_Id: '',                               // dropDonViTinh_DVP / dropNew_DonViTinh không tồn tại
            strPhamViApDung_Id: o.pv,
            strPhanCapApDung_Id: '',
            strNgayApDung: o.ngay || '',
            strDaoTao_ThoiGianDaoTao_Id: o.tg,
            dTongSoTien: A.unmoney(o.tien),
            strNguoiThucHien_Id: '',
            strTaiChinh_CacKhoanThu_Id: o.khoanthu,
            dKeThua: o.kethua || '',                           // lưới: dropNew_KeThua_All không tồn tại
            strGhiChu: ''
        };
    };

    D.delCall = function (id) {
        return { action: 'TC_DonViPhi_SoTien/Xoa', versionAPI: 'v1.0', strId: id, strNguoiThucHien_Id: '' };
    };

    /** save_KhaiNhanh — v = giá trị các ô của vùng Khai nhanh */
    D.khaiNhanhCall = function (nganhId, mucPhi, v) {
        return {
            action: 'TC_DonViPhi_Nganh/ThemMoi',
            type: 'POST',                                      // nằm trong obj gốc nên cũng được gửi đi
            strDaoTao_KhoaDaoTao_Id: String(v.khoa || '').replace(/,/g, '#'),
            strNganhDaoTao_Id: nganhId,
            strTaiChinh_CacKhoanThu_Id: v.khoanthu,
            strKieuHoc_Id: String(v.kieuhoc || '').replace(/,/g, '#'),
            strDaoTao_ThoiGianDaoTao_Id: v.thoigian,
            strMucPhi: mucPhi,                                 // bản gốc gửi nguyên chữ đã gõ, không bỏ dấu phẩy
            dChoPheoSua: v.chosua ? 1 : 0,                     // bản gốc luôn 1 — xem đầu khối
            strNgayApDung: v.ngay,
            strNguoiThucHien_Id: ''
        };
    };

    /** getList_HeDaoTao của donviphimoi / donviphimoilop (kql = dropKhoaQuanLy_DVP_Edit) */
    D.heQuyen = function (kql) {
        return A.rows({
            action: 'KHCT_ThongTin/LayDSDaoTao_HeDaoTaoQuyen', method: 'GET', silent: true,
            type: 'GET',
            strTuKhoa: '', strDaoTao_KhoaQuanLy_Id: kql || '',
            strDaoTao_HinhThucDaoTao_Id: '', strDaoTao_BacDaoTao_Id: '',
            strNguoiThucHien_Id: '', strChucNang_Id: '', pageIndex: 1, pageSize: 1000000
        });
    };

    /** getList_KhoaDaoTao của donviphimoi / donviphimoilop. Bản gốc đưa
        dropKhoaDaoTao_DVP_Edit vào strDaoTao_KhoaQuanLy_Id (nhầm ô) — giữ. */
    D.khoaQuyen = function (khoaEdit, heEdit) {
        return A.rows({
            action: 'KHCT_ThongTin/LayDSKS_DaoTao_KhoaDaoTaoQuyen', method: 'GET', silent: true,
            type: 'GET',
            strTuKhoa: '', strDaoTao_KhoaQuanLy_Id: khoaEdit || '', strDaoTao_HeDaoTao_Id: heEdit || '',
            strDaoTao_CoSoDaoTao_Id: '', strNguoiTao_Id: '',
            strNguoiThucHien_Id: '', strChucNang_Id: '', pageIndex: 1, pageSize: 1000000
        });
    };

    /* ---------- Khung màn hình --------------------------------------------- */
    /**
     * D.screen(root, cfg) → ctx
     *   cfg.title, cfg.icon, cfg.emptyMsg
     *   cfg.filters     ['kql','he','khoa','ct','khoanthu','thoigian','kieuhoc'] (thứ tự hiện)
     *   cfg.tools       [{ act, text, icon, mod, onClick(ctx) }]  nút thêm ở đầu trang (trước Khai nhanh)
     *   cfg.filterTools [{ act, text, icon, mod, onClick(ctx) }]  nút thêm cạnh Tìm kiếm
     *   cfg.cols        cột đầu của lưới (ums.ui.table)
     *   cfg.rowKey      cột của dòng làm khoá ô (bản gốc: id="input<khoá>_<idCột>")
     *   cfg.rowName     chữ đếm dòng ('chương trình', 'lớp'…)
     *   cfg.load(f, ctx) → Promise<{ cot, rows }>   nạp cột thời gian rồi nạp dòng, đúng thứ tự gốc
     *   cfg.init(ctx)   nạp/gắn bộ lọc riêng của màn
     *   cfg.addGuard(f) → chuỗi cảnh báo | ''
     *   cfg.dialog = { fields: [{ k, label, head, rows(ctx) → mảng|Promise, id, name,
     *                             onPick(body, ctx), value(row), addValue(ctx) }],
     *                  prefill: true = Loại khoản/Thời gian lấy theo bộ lọc khi thêm (resetPopup) }
     *                  trường có k:'pv' là strPhamViApDung_Id
     *   cfg.khaiNhanh = { title, kql: bool, themNhanh: bool, cols, nganhCall(v) → call, onKhoa(ctx) } | null
     *   cfg.autoload    true = nạp lưới ngay khi mở (donviphimoihp)
     * ctx = { root, main, el (ô lọc theo khoá), S (trạng thái), f() (giá trị lọc),
     *         load(), fail(nơi), kn: { root, el } }
     */
    D.screen = function (root, cfg) {
        var S = { cot: [], rows: [], list: [], khoanThu: [], thoiGian: [], kieuHoc: [] };
        var fil = cfg.filters;
        var tools = cfg.tools || [];
        var kn = cfg.khaiNhanh;

        var head = tools.map(function (t) { return A.btn(t.act, t.text, t.icon, t.mod); }).join('') +
            (kn ? A.btn('kn-open', 'Khai nhanh', 'fa-pen-field') : '') +
            A.btn('update', 'Cập nhật', 'fa-pen-to-square', 'primary') +
            ui.btn('add', { attr: { 'data-a': 'add' } });

        var filt = fil.map(function (k) { return A.fsel(k, LABEL[k]); }).join('') +
            A.fbtn(ui.btn('search', { attr: { 'data-a': 'search' } })) +
            (cfg.filterTools || []).map(function (t) { return A.fbtn(A.btn(t.act, t.text, t.icon, t.mod)); }).join('');

        A.mount(root,
            '<div data-z="main">' +
                A.head(cfg.title, head) +
                A.filter(filt) +
                A.panel({ title: 'Danh sách', icon: cfg.icon || 'fa-circle-dollar-to-slot', body: 'grid', count: 'count',
                    html: ui.empty(cfg.emptyMsg || 'Chọn bộ lọc rồi bấm Tìm kiếm để hiện lưới đơn vị phí', 'fa-filter') }) +
            '</div>' +
            (kn ? '<div data-z="kn" hidden>' + knHtml() + '</div>' : ''));

        var main = A.q(root, '[data-z="main"]');
        var knEl = kn ? A.q(root, '[data-z="kn"]') : null;
        var grid = A.q(main, '[data-z="grid"]'), count = A.q(main, '[data-z="count"]');
        var el = {};
        KEYS.forEach(function (k) { el[k] = A.k(main, k); });

        var mx = null;                  // ums.pat.matrix của lần vẽ gần nhất

        var ctx = {
            root: root, main: main, el: el, S: S, cfg: cfg,
            kn: knEl ? { root: knEl, el: {} } : null,
            f: function () {
                var o = {};
                KEYS.forEach(function (k) { o[k] = el[k] ? A.val(main, el[k]) : ''; });
                return o;
            },
            load: load,
            fail: function (where) { return function (e) { ums.api.handle(e, where); }; }
        };
        if (knEl) ['kql', 'he', 'khoa', 'khoanthu', 'thoigian', 'kieuhoc'].forEach(function (k) { ctx.kn.el[k] = A.k(knEl, k); });

        /* --- Danh mục dùng chung: thời gian, khoản thu, kiểu học ---------- */
        A.thoiGian().then(function (r) {
            S.thoiGian = r;
            // loadToCombo_ThoiGianDaoTao: tiêu đề "Chọn học kỳ"
            A.fill(el.thoigian, r, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn học kỳ' });
            if (knEl) A.fill(ctx.kn.el.thoigian, r, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn học kỳ' });
        }).catch(ctx.fail('thời gian đào tạo'));
        A.khoanThu().then(function (r) {
            S.khoanThu = r;
            A.fill(el.khoanthu, r, { head: 'Chọn khoản thu' });
            if (knEl) A.fill(ctx.kn.el.khoanthu, r, { head: 'Chọn khoản thu' });
        }).catch(ctx.fail('khoản thu'));
        A.kieuHoc().then(function (r) {
            S.kieuHoc = r;
            A.fill(el.kieuhoc, r, { head: 'Chọn kiểu học' });
            if (knEl) A.fill(ctx.kn.el.kieuhoc, r);
        }).catch(ctx.fail('kiểu học'));

        /* Khoá ô của một dòng. Kiểm host 2026-09-30 (Khai đơn vị phí - khối kt): máy chủ trả dòng khối kiến thức KHÔNG có cột
           PHAMVIAPDUNG_ID (chỉ có ID) → khoá dòng rỗng, không ô nào khớp bản ghi, lưới không bao giờ hiện giá trị đã khai. Thiếu cột
           khoá thì lấy ID của dòng (chính là giá trị gửi làm strPhamViApDung_Id khi thêm ở hộp / biểu mẫu). */
        function khoaDong(row) { var k = row[cfg.rowKey]; return k === undefined || k === null || k === '' ? row.ID : k; }

        /* --- Nạp lưới ---------------------------------------------------- */
        function load() {
            var f = ctx.f();
            grid.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return cfg.load(f, ctx).then(function (r) {
                S.cot = r.cot || [];
                S.rows = r.rows || [];
                return A.rows(D.listCall(f));
            }).then(function (list) {
                S.list = list;
                /* Kiểm host 2026-09-30 (Khai đơn vị phí - khối kiến thức): thêm xong bản ghi có trong danh sách giá trị nhưng lời gọi
                   nạp CỘT thời gian không trả cột của nó → lưới không hiện, người dùng không sửa / xoá được thứ vừa thêm. Bổ sung cột
                   cho mọi giá trị thuộc một dòng đang hiện mà thời gian chưa có trong danh sách cột (tên lấy từ ô lọc Thời gian). */
                var co = {}, dong = {};
                S.cot.forEach(function (c) { co[c.ID] = 1; });
                S.rows.forEach(function (r) { dong[khoaDong(r)] = 1; });
                list.forEach(function (v) {
                    var t = v.DAOTAO_THOIGIANDAOTAO_ID;
                    if (!t || co[t] || !dong[v.PHAMVIAPDUNG_ID]) return;
                    co[t] = 1;
                    var tg = S.thoiGian.filter(function (x) { return x.ID === t; })[0];
                    S.cot.push({ ID: t, THOIGIAN: tg ? tg.DAOTAO_THOIGIANDAOTAO : (v.DAOTAO_THOIGIANDAOTAO_TEN || v.THOIGIAN || t) });
                });
                draw();
            }).catch(function (e) {
                grid.innerHTML = ui.fail(e.message);
                ums.api.handle(e, 'nạp lưới đơn vị phí');
            });
        }

        function draw() {
            // genTable_DonViPhiSoTien: ô của cặp (dòng, thời gian).
            // Trùng cặp thì dòng sau thắng — đúng như ums.pat.matrix làm.
            mx = pat.matrix({
                el: grid, rows: S.rows, cols: S.cot, money: true, lead: cfg.cols,
                rowKey: khoaDong,
                cells: S.list,
                cellKey: function (r) { return { r: r.PHAMVIAPDUNG_ID, c: r.DAOTAO_THOIGIANDAOTAO_ID }; },
                value: function (r) { return A.money(r.TONGSOTIEN); },
                onEdit: function (rec) { if (rec) openForm(rec); },
                empty: 'Không có dữ liệu theo bộ lọc đã chọn'
            });
            var wrap = grid.querySelector('.ums-tablewrap');
            if (wrap) wrap.classList.add('dmhsa-scroll');
            count.textContent = S.rows.length ? '(' + S.rows.length + ' ' + (cfg.rowName || 'dòng') + ' × ' + S.cot.length + ' thời gian)' : '';
        }

        /* --- Cập nhật hàng loạt (btnUpdate) ------------------------------ */
        function saveAll() {
            ui.confirm('Bạn có chắc chắn muốn lưu toàn bộ hệ số không?').then(function (yes) {
                if (!yes) return;
                var dirty = mx ? mx.dirty() : [];
                if (!dirty.length) { ui.toast('Chưa có hệ số mới nào cần lưu', 'warn'); return; }
                var f = ctx.f();
                var calls = dirty.map(function (d) {
                    return D.saveCall({
                        id: d.rec ? d.rec.ID : '', kieuhoc: f.kieuhoc,
                        pv: khoaDong(d.row), tg: d.col.ID, ngay: '',
                        tien: d.value, khoanthu: f.khoanthu, kethua: ''
                    });
                });
                ui.batch(calls, { title: 'Đang lưu đơn vị phí', okText: 'Đã lưu' }).then(load);
            });
        }

        /* --- Hộp thoại Đơn vị phí (myModal) ------------------------------ */
        function openForm(row) {
            var f = ctx.f();
            var dc = cfg.dialog || {};
            var fields = dc.fields || [];
            var body = fields.map(function (x) { return A.row(x.label, A.sel(x.k, { ph: x.head })); }).join('') +
                A.row('Loại khoản', A.sel('khoanthu', { ph: 'Chọn khoản thu' })) +
                A.row('Thời gian', A.sel('tg', { ph: 'Chọn học kỳ' })) +
                A.row('Kiểu học', A.sel('kieuhoc', { ph: 'Chọn kiểu học' })) +
                A.row('Kế thừa', '<select class="ums-select" data-k="kethua" data-required>' +
                    '<option value="0">1. Áp dụng bình thường</option>' +
                    '<option value="1">2. Áp dụng tương tự cho tất cả ngành trong khóa</option></select>') +
                A.row('Ngày áp dụng', '<div class="ums-inputwrap">' + A.input('ngay', { date: true }) + '<i class="fa-light fa-calendar"></i></div>') +
                A.row('Mức phí', A.input('mucphi', { money: true }));

            var buttons = [];
            if (row) buttons.push({ text: 'Xoá', kind: 'close', mod: 'danger', onClick: function (d) { remove(row, d); return false; } });
            buttons.push({ text: 'Lưu', kind: 'save', onClick: function (d) { saveOne(row, d); return false; } });

            var dlg = A.form({ host: root, title: (row ? 'Sửa' : 'Thêm') + ' đơn vị phí', body: body, buttons: buttons });
            var b = dlg.body;

            fields.forEach(function (x) {
                var sel = A.k(b, x.k);
                Promise.resolve(x.rows ? x.rows(ctx) : []).then(function (r) {
                    A.fill(sel, r, { id: x.id || 'ID', name: x.name || 'TEN', head: x.head });
                    var v = row ? (x.value ? x.value(row) : '') : (x.addValue ? x.addValue(ctx) : '');
                    if (v) A.set(b, x.k, v);
                }).catch(ctx.fail(x.label));
                if (x.onPick) A.onPick(sel, function () { x.onPick(b, ctx); });
            });
            A.fill(A.k(b, 'khoanthu'), S.khoanThu, { head: 'Chọn khoản thu' });
            A.fill(A.k(b, 'tg'), S.thoiGian, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn học kỳ' });
            /* Kiểu học: bản gốc mở Thêm thì chép từ bộ lọc (donviphimoihp.js:234),
               mở Sửa thì lấy của chính dòng (dòng 597). */
            A.fill(A.k(b, 'kieuhoc'), S.kieuHoc, { head: 'Chọn kiểu học' });
            A.set(b, 'kieuhoc', row ? row.KIEUHOC_ID : f.kieuhoc);

            if (row) {
                // viewForm_DonViPhiSoTien
                A.set(b, 'khoanthu', row.TAICHINH_CACKHOANTHU_ID);
                A.set(b, 'tg', row.DAOTAO_THOIGIANDAOTAO_ID);
                A.set(b, 'ngay', row.NGAYAPDUNG);
                A.set(b, 'mucphi', A.money(row.TONGSOTIEN));
            } else if (dc.prefill) {
                // resetPopup: loại khoản / thời gian theo bộ lọc
                A.set(b, 'khoanthu', f.khoanthu);
                A.set(b, 'tg', f.thoigian);
            }
        }

        function saveOne(row, dlg) {
            var b = dlg.body, f = ctx.f();
            var id = row ? row.ID : '';
            /* Kiểm trước khi gửi (kiểm host 2026-09-30): thiếu phạm vi / khoản thu / thời gian / mức phí thì máy chủ chỉ trả
               "Du lieu khai khong hop le", người nhập không biết thiếu gì. */
            var thieu = [];
            if (A.k(b, 'pv') && !A.val(b, 'pv')) thieu.push((((cfg.dialog || {}).fields || []).filter(function (x) { return x.k === 'pv'; })[0] || {}).label || 'Phạm vi áp dụng');
            if (!A.val(b, 'khoanthu')) thieu.push('Loại khoản');
            if (!A.val(b, 'tg')) thieu.push('Thời gian');
            if (String(A.val(b, 'mucphi') || '').trim() === '') thieu.push('Mức phí');
            if (thieu.length) { ui.toast('Chưa nhập: ' + thieu.join(', '), 'warn'); return; }
            /* Bản gốc CÓ ô Kiểu học trong hộp thoại nhưng khi lưu lại đọc ô của
               BỘ LỌC (donviphimoihp.js:265/337/433/474) — đổi trong hộp thoại
               không có tác dụng. Ở đây gửi đúng ô người dùng vừa chọn; lúc mở
               ô này đã được đặt bằng bộ lọc nên không đụng vào thì y hệt bản gốc. */
            ums.api.call(D.saveCall({
                id: id, kieuhoc: A.val(b, 'kieuhoc') || f.kieuhoc, pv: A.val(b, 'pv'), ngay: A.val(b, 'ngay'),
                tg: A.val(b, 'tg'), tien: A.val(b, 'mucphi'), khoanthu: A.val(b, 'khoanthu'),
                kethua: A.val(b, 'kethua')
            })).then(function () {
                ui.toast(id ? 'Cập nhật thành công' : 'Thêm mới thành công', 'ok');
                dlg.close();
                load();
            }).catch(function (e) { ums.api.handle(e, 'lưu đơn vị phí'); });
        }

        function remove(row, dlg) {
            ui.confirm('Xoá đơn vị phí này?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                if (!yes) return;
                ums.api.call(D.delCall(row.ID))
                    .then(function () { ui.toast('Xóa thành công!', 'ok'); dlg.close(); load(); })
                    .catch(function (e) { ums.api.handle(e, 'xoá đơn vị phí'); });
            });
        }

        /* --- Khai nhanh (zoneEdit) --------------------------------------- */
        function knHtml() {
            return A.head(kn.title || 'Khai nhanh mức đơn vị phí',
                    ui.btn('close', { attr: { 'data-a': 'kn-back' } }) +   // quy ước: "Đóng" ngoài cùng bên trái, không mũi tên ←
                    A.btn('kn-save', 'Lưu', 'fa-floppy-disk', 'save')) +
                A.filter(
                    (kn.kql ? A.fsel('kql', LABEL.kql) : '') +
                    A.fsel('he', LABEL.he) +
                    A.fsel('khoa', LABEL.khoa, { multiple: true }) +
                    A.fsel('khoanthu', LABEL.khoanthu) +
                    A.fsel('thoigian', LABEL.thoigian) +
                    A.fsel('kieuhoc', LABEL.kieuhoc, { multiple: true }) +
                    A.finput('ngay', 'Ngày áp dụng', { date: true }) +
                    A.fcheck('chosua', 'Cho phép sửa') +
                    A.fbtn(ui.btn('search', { attr: { 'data-a': 'kn-search' } }))) +
                A.panel({ title: 'Danh sách ngành', icon: 'fa-list-check', body: 'kn-grid', count: 'kn-count',
                    tools: kn.themNhanh ? '<input class="ums-input" data-k="mucnhanh" placeholder="Thêm nhanh mức phí" autocomplete="off" style="width:180px">' +
                        A.btn('kn-fill', 'Thêm nhanh mức phí', 'fa-plus', 'out-success') : '',
                    html: ui.empty('Chọn khóa đào tạo để hiện danh sách ngành', 'fa-filter') });
        }

        function knVals() {
            var r = ctx.kn.root;
            return {
                kql: A.val(r, 'kql'), he: A.val(r, 'he'), khoa: A.val(r, 'khoa'), khoanthu: A.val(r, 'khoanthu'),
                thoigian: A.val(r, 'thoigian'), kieuhoc: A.val(r, 'kieuhoc'), ngay: A.val(r, 'ngay'),
                chosua: A.val(r, 'chosua') === true
            };
        }

        function knLoad() {
            var host = A.q(knEl, '[data-z="kn-grid"]');
            host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return A.rows(kn.nganhCall(knVals())).then(function (r) {
                var cols = kn.cols.slice();
                cols.push({ title: 'Mức phí', width: '180px', render: function (row) {
                    return '<input class="ums-input" data-mp="' + esc(row.ID) + '" autocomplete="off">';
                } });
                cols.push({ head: '<input type="checkbox" data-kn-all title="Chọn tất cả">', cls: 'is-center', width: '48px',
                    render: function (row) { return '<input type="checkbox" data-kn-ck="' + esc(row.ID) + '">'; } });
                ui.table({ el: host, rows: r, columns: cols, tableCls: 'ums-table--lined ums-table--tight', empty: 'Không có ngành nào' });
                var wrap = host.querySelector('.ums-tablewrap');
                if (wrap) wrap.classList.add('dmhsa-scroll');
                A.q(knEl, '[data-z="kn-count"]').textContent = r.length ? '(Tổng: ' + r.length + ' ngành)' : '';
            }).catch(function (e) {
                host.innerHTML = ui.fail(e.message);
                ums.api.handle(e, 'nạp ngành theo khóa');
            });
        }

        function byAttr(attr, id) {
            return A.qa(knEl, 'input[' + attr + ']').filter(function (i) { return i.getAttribute(attr) === id; })[0];
        }

        function knSave() {
            var ids = A.qa(knEl, 'input[data-kn-ck]').filter(function (c) { return c.checked; })
                .map(function (c) { return c.getAttribute('data-kn-ck'); });
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn lưu dữ liệu không?').then(function (yes) {
                if (!yes) return;
                var v = knVals();
                var calls = ids.map(function (id) {
                    var i = byAttr('data-mp', id);
                    return D.khaiNhanhCall(id, i ? i.value : '', v);
                });
                ui.batch(calls, { title: 'Đang lưu khai nhanh', okText: 'Thêm thành công' });
            });
        }

        if (knEl) {
            var ke = ctx.kn.el;
            // getList_KhoaDaoTao_Edit = edu.system.getList_KhoaDaoTao
            A.onPick(ke.he, function () {
                ums.ref.khoaDaoTao({ strHeDaoTao_Id: A.val(knEl, ke.he), strCoSoDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000 })
                    .then(function (r) { A.fill(ke.khoa, r, { name: 'TENKHOA' }); })
                    .catch(ctx.fail('khóa đào tạo'));
            });
            A.onPick(ke.khoa, function () { knLoad(); if (kn.onKhoa) kn.onKhoa(ctx); });
            ums.pat.chain([ke.he, ke.khoa]);
            // Ô mức phí có chữ → tự đánh dấu dòng (keyup .inputMucPhi)
            knEl.addEventListener('input', function (e) {
                var i = e.target;
                if (!i.hasAttribute || !i.hasAttribute('data-mp')) return;
                var c = byAttr('data-kn-ck', i.getAttribute('data-mp'));
                if (c) c.checked = !!i.value;
            });
            A.checkAll(knEl, 'input[data-kn-all]', 'input[data-kn-ck]');
        }

        /* --- Nút ---------------------------------------------------------- */
        var acts = {
            search: function () { load(); },
            update: saveAll,
            add: function () {
                var msg = cfg.addGuard ? cfg.addGuard(ctx.f()) : '';
                if (msg) { ui.toast(msg, 'warn'); return; }
                openForm(null);
            },
            // sửa một ô: nút bút của ums.pat.matrix (onEdit trong draw)
            'kn-open': function () { ui.swap(main, knEl); },
            'kn-back': function () { ui.swap(knEl, main); },
            'kn-search': function () { knLoad(); },
            'kn-save': knSave,
            'kn-fill': function () {
                // btnSearch_ThemNhanhMucPhi: chỉ điền giá trị, KHÔNG đánh dấu dòng (như bản gốc)
                var v = A.val(knEl, 'mucnhanh');
                A.qa(knEl, 'input[data-mp]').forEach(function (i) { i.value = v; });
            }
        };
        tools.concat(cfg.filterTools || []).forEach(function (t) { acts[t.act] = function () { t.onClick(ctx); }; });
        A.actions(root, acts);

        if (cfg.init) cfg.init(ctx);
        if (cfg.autoload) load();
        return ctx;
    };

    /**
     * Khoá đào tạo nạp MỘT lần rồi lọc tại chỗ theo DAOTAO_HEDAOTAO_ID
     * (getList_KhoaDaoTao + objGetDataInData của bản gốc). `loader(he)` trả
     * Promise<mảng>. Kết quả rỗng thì lần sau gọi lại, như bản gốc.
     */
    D.khoaOnce = function (ctx, loader) {
        var S = ctx.S, el = ctx.el;
        function get(he) {
            if (S.khoaAll && S.khoaAll.length) {
                A.fill(el.khoa, S.khoaAll.filter(function (k) { return k.DAOTAO_HEDAOTAO_ID === he; }),
                    { name: 'TENKHOA', head: LABEL.khoa });
                return Promise.resolve();
            }
            return loader(he).then(function (r) {
                if (!S.khoaAll || !S.khoaAll.length) S.khoaAll = r;
                A.fill(el.khoa, r, { name: 'TENKHOA', head: LABEL.khoa });
            });
        }
        A.onPick(el.he, function () { get(A.val(ctx.main, el.he)).catch(ctx.fail('khóa đào tạo')); });
        // Chưa chọn tầng trên thì khoá tầng dưới; xoá tầng trên thì xoá tầng dưới
        ums.pat.chain([el.he, el.khoa, el.ct, el.lop]);
        return get('').catch(ctx.fail('khóa đào tạo'));
    };

    /* ---------- Dữ liệu mẫu dùng chung của họ đơn vị phí ------------------ */
    if (ums.demo && ums.demo.add) {
        var fx = ums.demo.fixtures || {};
        var add = {};
        if (!fx.hasOwnProperty('TC_KhoanThu/LayDanhSach')) {
            add['TC_KhoanThu/LayDanhSach'] = [
                { ID: 'KT1', TEN: 'Học phí', MA: 'HP' },
                { ID: 'KT2', TEN: 'Học phí học lại', MA: 'HPHL' },
                { ID: 'KT3', TEN: 'Lệ phí thi', MA: 'LPT' }
            ];
        }
        add['TC_DonViPhi_Nganh/ThemMoi'] = { rows: [], message: '' };
        add['TC_ThuChi2/KeThua_TaiChinh_DonViPhi_ST'] = { rows: [], message: '' };
        ums.demo.add(add);
    }
})();
