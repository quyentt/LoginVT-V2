/* =========================================================================
   ums.dmhsB — tiện ích dùng chung cho nhóm màn danhmucheso (nhóm B)
   Nạp bằng <script src="../scripts/_chung_b.js"> TRƯỚC tệp của màn hình.
   ---------------------------------------------------------------------------
   Bố cục dùng lại được đã chuyển hết sang tầng chung (xem _v2/BO-CUC.md);
   ở đây chỉ còn lớp vỏ giữ nguyên tên hàm và phần RIÊNG của module:
     · Ô chọn: fill → ums.pat.fill, s2 → ums.ui.select2 (ums.ui.enhance đã tự
       gắn cho mọi <select> nên hầu hết màn không cần gọi tay nữa);
       fillMulti / s2multi giữ riêng vì có mục "Chọn tất cả" của bản gốc
     · Tiền: money / num → ums.pat.money / ums.pat.num
     · grid → ums.pat.matrix (ô nhập, ô đã sửa, phím mũi tên / Enter, nút sửa
       trong ô nay nằm ở tầng chung)
     · Nguồn dùng chung chép nguyên lời gọi của bản gốc: khoanThu() =
       TC_KhoanThu/LayDanhSach, dmAll() = edu.system.getList_DanhMucDulieu
     · cascadeQuyen — bản viết lại edu.extend.genBoLoc_HeKhoa
       (Core/systemextend.js:6713), dùng các procedure …Quyen (lọc theo
       quyền dữ liệu). ums.ref.cascade gọi bản KHÔNG lọc quyền nên không
       thay được — xem báo cáo.
     · mucPhi — khung chung của 4 màn cùng một khuôn trong bản gốc:
       mucphi, sothangtinhtien, mucphilop, mucphinienche
   Không tạo biến toàn cục nào ngoài ums.dmhsB.
   ========================================================================= */
(function (global) {
    'use strict';

    var ums = global.ums;
    var ui = ums.ui, pat = ums.pat;
    var B = ums.dmhsB = ums.dmhsB || {};
    var esc = ui.esc;

    /* ---------- Tiện ích ---------------------------------------------------- */
    function arr(d) { return Array.isArray(d) ? d : (d && d.rs) || []; }
    B.arr = arr;

    B.rows = function (call) {
        call.silent = true;
        return ums.api.call(call).then(function (r) { return arr(r.data); });
    };

    function e(v) { return v === undefined || v === null ? '' : String(v); }
    B.e = e;

    /** edu.util.formatCurrency — dấu phẩy ngăn nghìn (ums.pat.money) */
    B.money = function (v) { return (v === undefined || v === null || v === '') ? '' : pat.money(v); };
    /** edu.util.convertStrToNum — bỏ dấu phẩy (ums.pat.num) */
    B.num = function (v) { return pat.num(v); };

    /* ---------- Ô chọn -------------------------------------------------------- */
    /** Đổ danh sách vào <select> — ums.pat.fill (gắn luôn select2) */
    B.fill = function (el, rows, o) {
        o = o || {};
        pat.fill(el, rows, { id: o.id, name: o.name, head: o.head === false ? '' : o.head });
    };

    /** Gắn select2. ums.ui.select2 tự tìm <dialog> cha và tự lấy chữ gợi ý từ
        data-ph / dòng đầu, nên `placeholder` và `parent` chỉ còn để tương thích. */
    B.s2 = function (el, placeholder) {
        return ui.select2(el, placeholder ? { placeholder: placeholder } : undefined);
    };

    B.picked = function (el) {
        return Array.prototype.slice.call(el.options).filter(function (o) { return o.selected && o.value && o.value !== 'SELECTALL'; })
            .map(function (o) { return o.value; });
    };

    /** Ô chọn nhiều có mục "Chọn tất cả" như loadToCombo_data của bản gốc
        (Core/systemroot.js:2353 + 2395). Gắn TRƯỚC các trình xử lý của màn
        hình: chọn "Chọn tất cả" thì chọn hết rồi phát lại select2:select. */
    B.s2multi = function (el, placeholder, parent) {
        B.s2(el, placeholder, parent);
        if (!global.jQuery) return;
        jQuery(el).on('select2:select', function (ev) {
            var v = jQuery(el).val() || [];
            if (v.indexOf('SELECTALL') < 0) return;
            ev.stopImmediatePropagation();
            var all = Array.prototype.slice.call(el.options).map(function (o) { return o.value; })
                .filter(function (x) { return x && x !== 'SELECTALL'; });
            jQuery(el).val(all).trigger('change').trigger({ type: 'select2:select' });
        });
    };
    /** Đổ ô chọn nhiều: có mục "Chọn tất cả", không giữ lựa chọn cũ (bản gốc
        đặt val("") sau mỗi lần nạp lại ô chọn nhiều) */
    B.fillMulti = function (el, rows, o) {
        o = o || {};
        var id = o.id || 'ID', name = o.name || 'TEN';
        var h = (rows && rows.length) ? '<option value="SELECTALL">Chọn tất cả</option>' : '';
        (rows || []).forEach(function (r) {
            var t = typeof name === 'function' ? name(r) : r[name];
            h += '<option value="' + esc(r[id]) + '">' + esc(t) + '</option>';
        });
        el.innerHTML = h;
        if (global.jQuery) jQuery(el).val([]).trigger('change.select2');
    };
    /** Giá trị ô chọn nhiều nối dấu phẩy, như edu.util.getValById */
    B.multi = function (el) { return B.picked(el).join(','); };

    /** Gắn sự kiện đổi giá trị (select2 phát sự kiện qua jQuery) */
    B.onChange = function (el, fn) {
        if (global.jQuery) jQuery(el).on('change', fn);
        else el.addEventListener('change', fn);
    };

    /* ---------- Nguồn dùng chung ---------------------------------------------- */
    var ktCache = null;
    /** TC_KhoanThu/LayDanhSach — tham số chép nguyên (lophocphan.js:1427, mucphi.js:688…) */
    B.khoanThu = function () {
        if (!ktCache) {
            ktCache = B.rows({
                action: 'TC_KhoanThu/LayDanhSach',
                method: 'GET',
                strTuKhoa: '',
                pageIndex: 1,
                pageSize: 10000,
                strNhomCacKhoanThu_Id: '',
                strCanBoQuanLy_Id: '',
                strNguoiThucHien_Id: ''
            }).catch(function (err) { ktCache = null; throw err; });
        }
        return ktCache;
    };

    /** edu.system.getList_DanhMucDulieu (Core/systemroot.js:4476) — bản gốc
        chỉ gửi strMaBangDanhMuc + strTieuChiSapXep, KHÔNG có khoá dTrangThai.
        Gửi kèm dTrangThai rỗng là máy chủ trả 400 (tham số kiểu số nhận chuỗi
        rỗng) — đã gặp thật trên máy chủ 2026-09-21. Khác ums.api.dm (gửi 1). */
    B.dmAll = function (code) {
        return B.rows({
            action: 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM',
            method: 'GET',
            strMaBangDanhMuc: code,
            strTieuChiSapXep: ''
        });
    };

    /** Giá trị loadToCombo_data tự chọn cho một ô chọn KHÔNG có dòng tiêu đề
        (Core/systemroot.js:2239): dòng THONGTIN8 = "CHON" nếu có; nếu dữ
        liệu không có CHUNG_TENDANHMUC_TEN thì ô không có dòng rỗng nên giá
        trị là dòng đầu. Dùng cho ô ẩn "nghiệp vụ áp dụng". */
    B.comboDefault = function (rows) {
        if (!rows || !rows.length) return '';
        var chon = rows.filter(function (r) { return r.THONGTIN8 === 'CHON'; });
        if (chon.length) return e(chon[chon.length - 1].ID);
        return rows[0].CHUNG_TENDANHMUC_TEN ? '' : e(rows[0].ID);
    };

    /* =========================================================================
       cascadeQuyen — edu.extend.genBoLoc_HeKhoa(strTienTo)
       Chỉ nạp Hệ lúc đầu (và Khoa quản lý nếu có ô). Đổi Hệ → nạp Khoá, CT,
       Lớp; đổi Khoá → CT, Lớp; đổi CT → Lớp. Ô nào không có thì bỏ qua,
       giống `if (!$("#dropX").length) return;` của bản gốc.
       ========================================================================= */
    var heQuyenCache = null;
    B.cascadeQuyen = function (o) {
        var el = { he: o.he, khoa: o.khoa, ct: o.ct, lop: o.lop, kql: o.kql };
        function v(k) { return el[k] ? el[k].value : ''; }
        var busy = 0;

        function heQuyen() {
            if (!heQuyenCache) {
                heQuyenCache = B.rows({
                    action: 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eCSQFIC4VIC4QNDgkLwPP',
                    func: 'pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTaoQuyen',
                    strTuKhoa: '',
                    strDaoTao_KhoaQuanLy_Id: '',          // bản gốc đọc 'dropKhoaQuanLy11111' — ô không tồn tại
                    strDaoTao_HinhThucDaoTao_Id: '',
                    strDaoTao_BacDaoTao_Id: '',
                    strNguoiThucHien_Id: '',
                    strChucNang_Id: '',
                    pageIndex: 1,
                    pageSize: 1000000
                }).catch(function (err) { heQuyenCache = null; throw err; });
            }
            return heQuyenCache;
        }
        function khoa() {
            if (!el.khoa) return Promise.resolve();
            return B.rows({
                action: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eCikuIAUgLhUgLhA0OCQv',
                func: 'pkg_kehoach_thongtin.LayDSKS_DaoTao_KhoaDaoTaoQuyen',
                strTuKhoa: '',
                strDaoTao_KhoaQuanLy_Id: v('kql'),
                strDaoTao_HeDaoTao_Id: v('he'),
                strDaoTao_CoSoDaoTao_Id: '',
                strNguoiTao_Id: '',
                strNguoiThucHien_Id: '',
                strChucNang_Id: '',
                pageIndex: 1,
                pageSize: 1000000
            }).then(function (r) { B.fill(el.khoa, r, { name: 'TENKHOA', head: 'Chọn khóa đào tạo' }); });
        }
        function ct() {
            if (!el.ct) return Promise.resolve();
            return B.rows({
                action: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eFS4CKTQiAhUQNDgkLwPP',
                func: 'pkg_kehoach_thongtin.LayDSKS_DaoTao_ToChucCTQuyen',
                strTuKhoa: '',
                strDaoTao_HeDaoTao_Id: v('he'),
                strDaoTao_KhoaDaoTao_Id: v('khoa'),
                strDaoTao_N_CN_Id: '',
                strDaoTao_KhoaQuanLy_Id: v('kql'),
                strDaoTao_ToChucCT_Cha_Id: '',
                strNguoiThucHien_Id: '',
                strChucNang_Id: '',
                pageIndex: 1,
                pageSize: 1000000
            }).then(function (r) { B.fill(el.ct, r, { name: 'TENCHUONGTRINH', head: 'Chọn chương trình đào tạo' }); });
        }
        function lop() {
            if (!el.lop) return Promise.resolve();
            return B.rows({
                action: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eDS4xEDQgLw04EDQ4JC8P',
                func: 'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLyQuyen',
                strTuKhoa: '',
                strDaoTao_HeDaoTao_Id: v('he'),
                strDaoTao_CoSoDaoTao_Id: '',
                strDaoTao_KhoaDaoTao_Id: v('khoa'),
                strDaoTao_Nganh_Id: '',
                strDaoTao_LoaiLop_Id: '',
                strDaoTao_ToChucCT_Id: v('ct'),
                strDaoTao_KhoaQuanLy_Id: v('kql'),
                strNhomlop_Id: '',
                strNguoiThucHien_Id: '',
                strChucNang_Id: '',
                pageIndex: 1,
                pageSize: 1000000
            }).then(function (r) { B.fill(el.lop, r, { name: 'TEN', head: 'Chọn lớp' }); });
        }
        function kql() {
            if (!el.kql) return Promise.resolve();
            return B.rows({
                action: 'KHCT_ThongTin_MH/DSA4BRIKKS4gEDQgLw04ESkgLxA0OCQv',
                func: 'pkg_kehoach_thongtin.LayDSKhoaQuanLyPhanQuyen',
                strNguoiThucHien_Id: ''
            }).then(function (r) { B.fill(el.kql, r, { name: 'TEN', head: 'Chọn khoa quản lý' }); });
        }

        function run(p) {
            busy++;
            return p.catch(function (err) { ums.api.handle(err, 'nạp danh mục đào tạo'); })
                .then(function () { busy--; if (o.onChange && !busy) o.onChange(); });
        }
        /* Đổi (hoặc XOÁ) tầng trên thì xoá trắng giá trị các tầng dưới trước
           khi nạp lại — fill() giữ giá trị cũ nếu nó còn trong danh sách mới,
           mà bỏ Hệ thì danh sách Khoá là TẤT CẢ khoá → khoá cũ vẫn nằm đó. */
        var DUOI = { kql: ['khoa', 'ct', 'lop'], he: ['khoa', 'ct', 'lop'], khoa: ['ct', 'lop'], ct: ['lop'] };
        function xoaDuoi(level) {
            (DUOI[level] || []).forEach(function (k) {
                if (!el[k]) return;
                el[k].value = '';
                if (global.jQuery) jQuery(el[k]).trigger('change.select2');
            });
        }
        function chain(level) {
            xoaDuoi(level);
            if (level === 'he' || level === 'kql') return khoa().then(ct).then(lop);
            if (level === 'khoa') return ct().then(lop);
            if (level === 'ct') return lop();
            return Promise.resolve();
        }

        ['kql', 'he', 'khoa', 'ct'].forEach(function (k) {
            if (!el[k]) return;
            B.onChange(el[k], function () { if (!busy) run(chain(k)); });
        });
        // Chưa chọn tầng trên thì khoá tầng dưới (ums.pat.chain)
        ums.pat.chain([el.he, el.khoa, el.ct, el.lop], { phatLai: false });

        var ready = run(Promise.all([
            el.he ? heQuyen().then(function (r) { B.fill(el.he, r, { name: 'TENHEDAOTAO', head: 'Chọn hệ đào tạo' }); }) : null,
            kql()
        ]));

        /** Đặt giá trị lần lượt từng tầng (nạp tầng con trước khi đặt) */
        function set(vals) {
            busy++;
            var p = ready.then(function () {
                if (el.he) { el.he.value = vals.he || ''; jQuery(el.he).trigger('change.select2'); }
                return khoa();
            }).then(function () {
                if (el.khoa) { el.khoa.value = vals.khoa || ''; jQuery(el.khoa).trigger('change.select2'); }
                return ct();
            }).then(function () {
                if (el.ct) { el.ct.value = vals.ct || ''; jQuery(el.ct).trigger('change.select2'); }
                return lop();
            });
            return p.catch(function (err) { ums.api.handle(err, 'nạp danh mục đào tạo'); })
                .then(function () { busy--; });
        }

        return {
            ready: ready,
            values: function () { return { he: v('he'), khoa: v('khoa'), ct: v('ct'), lop: v('lop'), kql: v('kql') }; },
            set: set
        };
    };

    /* =========================================================================
       grid — lưới nhập giá trị theo cột thời gian. Nay chỉ là lớp vỏ quanh
       ums.pat.matrix (ô nhập, ô đã sửa, phím ←↑→↓ / Enter, nút sửa trong ô).
       Khác bản trước: giá trị phải có SẴN khi vẽ (o.vals + o.map) thay vì đổ
       vào sau bằng g.fill — nơi gọi vẫn giữ nguyên thứ tự lời gọi cũ
       (cột → dòng → giá trị), chỉ vẽ sau khi cả ba đã về.

       o = { el, lead: [cột đầu], cols: [{ID, THOIGIAN}], rows, key(row),
             money: bool, empty, vals, map: { row(v), col(v), val(v), onEdit(v) } }
       g.changed() → [{ row, key, col, value, id, rec }]
       ========================================================================= */
    B.grid = function (o) {
        var m = o.map || {};
        var mx = pat.matrix({
            el: o.el, rows: o.rows, cols: o.cols, money: o.money, lead: o.lead, empty: o.empty,
            rowKey: o.key,
            cells: o.vals || [],
            cellKey: function (v) { return { r: m.row(v), c: m.col(v) }; },
            value: function (v) { var raw = e(m.val(v)); return o.money ? B.money(raw) : raw; },
            onEdit: m.onEdit ? function (rec) { if (rec) m.onEdit(rec); } : null
        });

        return {
            changed: function () {
                return mx.dirty().map(function (d) {
                    return {
                        row: d.row, key: o.key(d.row), col: d.col.ID,
                        value: o.money ? B.num(d.value) : d.value,
                        id: d.rec ? e(d.rec.ID) : '', rec: d.rec || null
                    };
                });
            }
        };
    };

    /* =========================================================================
       mucPhi — khung chung của mucphi / sothangtinhtien / mucphilop / mucphinienche
       Bốn tệp gốc gần như chép nhau (diff chỉ khác tên ô, action và cột
       dòng). Thứ tự lời gọi giữ nguyên bản gốc:
           Tìm kiếm → cols(f) → rows(f) → vẽ bảng → vals(f) → đổ giá trị
       cfg = {
         root, title, icon, rowTitle,
         hasCT: bool         — có ô lọc Chương trình (mucphilop, mucphinienche)
         target: 'ct' | 'lop' | 'sv'  — ô "phạm vi" trong hộp thêm/sửa
         editable: bool      — có nút sửa từng ô (mucphinienche: không)
         valCol, valParam, valLabel, money,
         pre                 — tiền tố action lưu/xoá (TC_MucPhi_SoTien | TC_SoThang_TinhTien)
         cols(f), rows(f), vals(f) → lời gọi;  rowKey(row), rowLabel(row)
         svCall(lop)         — (target 'sv') lời gọi nạp sinh viên của lớp
       }
       ========================================================================= */
    B.mucPhi = function (cfg) {
        var root = cfg.root;
        var st = { kt: [], tg: [], dvt: [], khoaAll: null, ctList: [], lopList: [], nv: '', cols: [], rows: [], vals: [], grid: null };

        var HEAD = { he: 'Chọn hệ đào tạo', khoa: 'Chọn khóa đào tạo', ct: 'Chọn chương trình đào tạo', dvt: 'Chọn đơn vị tính', kt: 'Chọn khoản thu', tg: 'Chọn thời gian đào tạo' };
        var KEYS = ['he', 'khoa', 'ct', 'dvt', 'kt', 'tg'];

        root.innerHTML =
            pat.page(cfg.title,
                ui.btn('save', { text: 'Cập nhật', mod: 'primary', attr: { 'data-do': 'update' } }) +
                ui.btn('add', { attr: { 'data-do': 'add' } })) +
            pat.filterBar(KEYS.filter(function (k) { return k !== 'ct' || cfg.hasCT; })
                .map(function (k) { return { key: k, label: HEAD[k], type: 'select' }; }),
                { searchText: undefined }) +
            pat.panel({
                title: 'Danh sách', icon: cfg.icon || 'fa-table-cells', count: 'count', zone: 'grid', flush: true,
                tools: '<span class="ums-u-faint ums-u-fz12">Sửa trực tiếp trong ô rồi bấm “Cập nhật”. Phím mũi tên / Enter để di chuyển.</span>',
                body: ui.empty('Chọn hệ, khoá' + (cfg.hasCT ? ', chương trình' : '') + ', đơn vị tính rồi bấm Tìm kiếm', 'fa-filter')
            });

        // pat.filterBar đặt nút Tìm kiếm là data-a="search"; màn này bắt data-do
        var btnSearch = root.querySelector('[data-a="search"]');
        if (btnSearch) { btnSearch.removeAttribute('data-a'); btnSearch.setAttribute('data-do', 'search'); }

        var F = {};
        KEYS.forEach(function (k) { F[k] = root.querySelector('[data-f="' + k + '"]'); });
        ui.enhance(root);               // một lần cho mọi ô chọn, thay vòng lặp select2
        var zGrid = root.querySelector('[data-z="grid"]');
        var zCount = root.querySelector('[data-z="count"]');

        function f() {
            var dv = st.dvt.filter(function (x) { return String(x.ID) === F.dvt.value; })[0];
            return {
                he: F.he.value, khoa: F.khoa.value, ct: F.ct ? F.ct.value : '',
                dvt: F.dvt.value, dvtMa: dv ? e(dv.MA) : '',
                kt: F.kt.value, tg: F.tg.value, nv: st.nv
            };
        }
        cfg.filter = f;

        /* --- Nguồn lọc --- */
        function fail(where) { return function (err) { ums.api.handle(err, where); }; }

        // Hệ: edu.system.getList_HeDaoTao, pageSize 1000
        ums.ref.heDaoTao({ pageIndex: 1, pageSize: 1000 })
            .then(function (r) { B.fill(F.he, r, { name: 'TENHEDAOTAO', head: HEAD.he }); }, fail('nạp hệ đào tạo'));

        // Khoá: bản gốc nạp MỘT lần với hệ rỗng rồi lọc tại máy theo DAOTAO_HEDAOTAO_ID
        function khoaAll() {
            if (!st.khoaAll) st.khoaAll = ums.ref.khoaDaoTao({ strHeDaoTao_Id: '', pageIndex: 1, pageSize: 10000 });
            return st.khoaAll;
        }
        function fillKhoa() {
            return khoaAll().then(function (r) {
                var he = F.he.value;
                B.fill(F.khoa, he ? r.filter(function (x) { return x.DAOTAO_HEDAOTAO_ID == he; }) : r, { name: 'TENKHOA', head: HEAD.khoa });
            }, fail('nạp khoá đào tạo'));
        }
        fillKhoa();

        // Chương trình theo khoá — edu.system.getList_ChuongTrinhDaoTao, pageSize 10000
        function loadCT() {
            return ums.ref.chuongTrinh({ strKhoaDaoTao_Id: F.khoa.value, pageIndex: 1, pageSize: 10000 })
                .then(function (r) {
                    st.ctList = r;
                    if (F.ct) B.fill(F.ct, r, { name: 'TENCHUONGTRINH', head: HEAD.ct });
                }, fail('nạp chương trình'));
        }
        // Lớp theo khoá + chương trình — edu.system.getList_LopQuanLy, pageSize 10000
        function loadLop() {
            return ums.ref.lopQuanLy({ strKhoaDaoTao_Id: F.khoa.value, strToChucCT_Id: F.ct ? F.ct.value : '', pageIndex: 1, pageSize: 10000 })
                .then(function (r) { st.lopList = r; }, fail('nạp lớp quản lý'));
        }

        // Đơn vị tính: getList_DanhMucDulieu QLTC.DVT; MA của đơn vị dùng cho thời gian
        B.dmAll('QLTC.DVT').then(function (r) {
            st.dvt = r;
            B.fill(F.dvt, r, { name: 'TEN', head: HEAD.dvt });
        }, fail('nạp đơn vị tính'));

        // Khoản thu
        B.khoanThu().then(function (r) { st.kt = r; B.fill(F.kt, r, { head: HEAD.kt }); }, fail('nạp khoản thu'));

        // Nghiệp vụ áp dụng: ô ẩn trong bản gốc, giá trị là giá trị mặc định của combo
        ums.api.dm('QLTC.NVAP').then(function (r) { st.nv = B.comboDefault(r); }, function () { st.nv = ''; });

        // Thời gian theo đơn vị tính: TC_ThoiGianTheoDonViTinh, strDonViTinh_Id = MA của đơn vị
        function loadTG() {
            return B.rows({
                action: 'TC_ThoiGianTheoDonViTinh/LayThoiGianTheoDonViTinh',
                method: 'GET',
                versionAPI: 'v1.0',
                strDonViTinh_Id: f().dvtMa
            }).then(function (r) { st.tg = r; B.fill(F.tg, r, { name: 'THOIGIAN', head: 'Chọn học kỳ' }); }, fail('nạp thời gian'));
        }

        /* --- Sự kiện lọc (bản gốc bắt select2:select — chỉ khi CHỌN) ---
           Bản gốc không xử lý lúc XOÁ nên bỏ Hệ mà Khoá/Chương trình cũ vẫn
           nằm nguyên. Ở đây xoá Hệ/Khoá thì xoá trắng các tầng dưới. */
        function onPick(el, fn) { if (el && global.jQuery) jQuery(el).on('select2:select', fn); }
        function onClear(el, fn) { if (el && global.jQuery) jQuery(el).on('select2:clear', fn); }
        function trang(el, rows) {
            if (!el) return;
            el.value = '';
            if (rows) B.fill(el, [], { head: rows });
            if (global.jQuery) jQuery(el).trigger('change.select2');
        }
        onPick(F.he, function () {
            trang(F.khoa); trang(F.ct);
            fillKhoa();
            if (cfg.hasCT) loadCT();
        });
        onClear(F.he, function () {
            trang(F.khoa); trang(F.ct, HEAD.ct); st.ctList = []; st.lopList = [];
            fillKhoa();
        });
        onPick(F.khoa, function () {
            trang(F.ct);
            if (cfg.hasCT) loadCT();
            else { load(); loadCT(); }
        });
        onClear(F.khoa, function () {
            trang(F.ct, HEAD.ct); st.ctList = []; st.lopList = [];
        });
        // Chưa chọn tầng trên thì khoá tầng dưới (ums.pat.chain)
        pat.chain([F.he, F.khoa, F.ct], { phatLai: false });
        onPick(F.ct, function () { load(); loadLop(); });
        onPick(F.dvt, function () {
            if (!F.dvt.value) return;
            loadTG();
            load();
        });

        /* --- Danh sách --- */
        var token = 0;
        function load() {
            var my = ++token, v = f();
            zGrid.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
            return ums.api.call(cfg.cols(v)).then(function (r) {
                if (my !== token) return;
                st.cols = arr(r.data);
                return ums.api.call(cfg.rows(v)).then(function (r2) {
                    if (my !== token) return;
                    st.rows = arr(r2.data);
                    zCount.textContent = '(' + st.rows.length + ')';
                    // Thứ tự lời gọi giữ nguyên bản gốc (cột → dòng → giá trị);
                    // lưới chỉ vẽ khi đã có cả ba.
                    return ums.api.call(cfg.vals(v)).then(function (r3) {
                        if (my !== token) return;
                        st.vals = arr(r3.data);
                        st.grid = B.grid({
                            el: zGrid, cols: st.cols, rows: st.rows, key: cfg.rowKey, money: cfg.money,
                            lead: [{ title: cfg.rowTitle, render: function (x) { return esc(cfg.rowLabel(x)); } }],
                            empty: 'Không có dữ liệu',
                            vals: st.vals,
                            map: {
                                row: function (x) { return x.PHAMVIAPDUNG_ID; },
                                col: function (x) { return x.DAOTAO_THOIGIANDAOTAO_ID; },
                                val: function (x) { return x[cfg.valCol]; },
                                onEdit: cfg.editable ? function (x) { openForm(x); } : null
                            }
                        });
                    });
                });
            }).catch(function (err) {
                if (my !== token) return;
                zGrid.innerHTML = ui.fail(err.message);
                ums.api.handle(err, cfg.title);
            });
        }

        function cellCall(c, v) {
            var o = {
                action: cfg.pre + (c.id ? '/CapNhat' : '/ThemMoi'),
                versionAPI: 'v1.0',
                strId: c.id,
                strNghiepVuApDung_Id: v.nv,
                strDonViTinh_Id: v.dvt,
                strPhamViApDung_Id: c.key,
                strPhanCapApDung_Id: '',
                strNgayApDung: '',
                strDaoTao_ThoiGianDaoTao_Id: c.col
            };
            o[cfg.valParam] = c.value;
            o.strNguoiThucHien_Id = '';
            o.strTaiChinh_CacKhoanThu_Id = v.kt;
            o.dKeThua = '';          // bản gốc đọc 'dropNew_KeThua_All' — ô không tồn tại
            o.strGhiChu = '';
            return o;
        }

        function updateAll() {
            if (!st.grid) { ui.toast('Chưa có bảng để cập nhật — hãy tìm kiếm trước.', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn muốn lưu toàn bộ các ô đã sửa không?', { title: 'Cập nhật' }).then(function (yes) {
                if (!yes) return;
                var list = st.grid.changed();
                if (!list.length) { ui.toast('Chưa có giá trị mới nào cần lưu', 'info'); return; }
                var v = f();
                ui.batch(list.map(function (c) { return cellCall(c, v); }), { title: 'Đang lưu', okText: 'Đã lưu' })
                    .then(function () { load(); });
            });
        }

        /* --- Hộp thêm / sửa một bản ghi --- */
        function openForm(rec) {
            var v = f();
            var isEdit = !!(rec && rec.ID);
            var tgtLabel = cfg.target === 'ct' ? 'Chương trình' : 'Lớp';
            var body = document.createElement('div');
            body.innerHTML =
                '<div class="ums-grid ums-grid--2">' +
                '<div style="grid-column:1 / -1">' + ui.field(tgtLabel, '<select class="ums-select" data-g="tgt"></select>') + '</div>' +
                (cfg.target === 'sv' ? '<div style="grid-column:1 / -1">' + ui.field('Sinh viên', '<select class="ums-select" data-g="sv"></select>', { required: true }) + '</div>' : '') +
                '<div>' + ui.field('Loại khoản', '<select class="ums-select" data-g="kt"></select>') + '</div>' +
                '<div>' + ui.field('Thời gian', '<select class="ums-select" data-g="tg"></select>') + '</div>' +
                '<div style="grid-column:1 / -1">' + ui.field('Kế thừa', '<select class="ums-select" data-g="kethua" data-required>' +
                    '<option value="0">1. Áp dụng bình thường</option>' +
                    '<option value="1">2. Áp dụng tương tự cho tất cả ngành trong khóa</option></select>') + '</div>' +
                '<div>' + ui.field('Ngày áp dụng', '<div class="ums-inputwrap"><input class="ums-input" data-g="ngay" data-date placeholder="dd/mm/yyyy" autocomplete="off"><i class="fa-light fa-calendar"></i></div>') + '</div>' +
                '<div>' + ui.field(cfg.valLabel, '<input class="ums-input" data-g="val" autocomplete="off"' + (cfg.money ? ' inputmode="numeric"' : '') + '>') + '</div>' +
                '</div>';
            function g(k) { return body.querySelector('[data-g="' + k + '"]'); }

            var buttons = [];
            if (isEdit) buttons.push({ text: 'Xoá', kind: 'del', onClick: function (dlg) { remove(rec, dlg); return false; } });
            buttons.push({ text: 'Lưu', kind: 'save', onClick: function (dlg) { save(dlg); return false; } });

            var dlg = pat.formTrang({ host: root, title: (isEdit ? 'Sửa ' : 'Thêm ') + cfg.formTitle, body: body, buttons: buttons });   // trong trang, không bật hộp thoại (BO-CUC luật 1)

            var tgtRows = cfg.target === 'ct' ? st.ctList : st.lopList;
            B.fill(g('tgt'), tgtRows, { name: cfg.target === 'ct' ? 'TENCHUONGTRINH' : 'TEN', head: cfg.target === 'ct' ? 'Chọn chương trình đào tạo' : 'Chọn lớp quản lý' });
            B.fill(g('kt'), st.kt, { head: 'Chọn khoản thu' });
            B.fill(g('tg'), st.tg, { name: 'THOIGIAN', head: 'Chọn học kỳ' });
            // ums.ui.enhance gắn select2 + lịch cho cả hộp thoại (tự tìm <dialog> cha)
            ui.enhance(dlg.body);

            var svRows = [];
            if (cfg.target === 'sv') {
                g('sv').innerHTML = '<option value="">Chọn sinh viên</option>';
                if (global.jQuery) jQuery(g('tgt')).on('select2:select', function () {
                    B.rows(cfg.svCall(g('tgt').value)).then(function (r) {
                        svRows = r;
                        B.fill(g('sv'), r, { head: 'Chọn sinh viên', name: function (x) {
                            return e(x.QLSV_NGUOIHOC_MASO) + ' - ' + e(x.QLSV_NGUOIHOC_HODEM) + ' ' + e(x.QLSV_NGUOIHOC_TEN);
                        } });
                    }, fail('nạp sinh viên'));
                });
            }

            if (isEdit) {
                g('tgt').value = e(rec.PHAMVIAPDUNG_ID);
                g('kt').value = e(rec.TAICHINH_CACKHOANTHU_ID);
                g('tg').value = e(rec.DAOTAO_THOIGIANDAOTAO_ID);
                g('ngay').value = e(rec.NGAYAPDUNG);
                if (g('ngay')._flatpickr) g('ngay')._flatpickr.setDate(e(rec.NGAYAPDUNG) || null, false, 'd/m/Y');
                g('val').value = cfg.money ? B.money(rec[cfg.valCol]) : e(rec[cfg.valCol]);
                ['tgt', 'kt', 'tg'].forEach(function (k) { jQuery(g(k)).trigger('change.select2'); });
            }

            function save(dlg) {
                var pv = g('tgt').value;
                if (cfg.target === 'sv') {
                    var sv = svRows.filter(function (x) { return String(x.ID) === g('sv').value; })[0];
                    if (!sv) { ui.toast('Hãy chọn sinh viên', 'warn'); return; }
                    pv = e(sv.QLSV_NGUOIHOC_ID) + e(sv.DAOTAO_TOCHUCCHUONGTRINH_ID);
                }
                var id = isEdit ? e(rec.ID) : '';
                // Kiểm trước khi gửi (kiểm host 2026-09-30): thiếu ô thì máy chủ chỉ trả "Du lieu khai khong hop le"
                var thieu = [];
                if (!pv) thieu.push(tgtLabel);
                if (!g('kt').value) thieu.push('Loại khoản');
                if (!g('tg').value) thieu.push('Thời gian');
                if (g('val').value.trim() === '') thieu.push(cfg.valLabel);
                if (thieu.length) { ui.toast('Chưa nhập: ' + thieu.join(', '), 'warn'); return; }
                var o = {
                    action: cfg.pre + (id ? '/CapNhat' : '/ThemMoi'),
                    versionAPI: 'v1.0',
                    strId: id,
                    strNghiepVuApDung_Id: v.nv,
                    strDonViTinh_Id: v.dvt,
                    strPhamViApDung_Id: pv,
                    strPhanCapApDung_Id: '',
                    strNgayApDung: g('ngay').value.trim(),
                    strDaoTao_ThoiGianDaoTao_Id: g('tg').value
                };
                o[cfg.valParam] = cfg.money ? B.num(g('val').value) : g('val').value.trim();
                o.strNguoiThucHien_Id = '';
                o.strTaiChinh_CacKhoanThu_Id = g('kt').value;
                o.dKeThua = g('kethua').value;
                o.strGhiChu = '';
                ums.api.call(o).then(function () {
                    ui.toast(id ? 'Cập nhật thành công' : 'Thêm mới thành công', 'ok');
                    dlg.close();
                    load();
                }).catch(fail('lưu'));
            }
        }

        function remove(rec, dlg) {
            ui.confirm('Xoá bản ghi này? Thao tác này không hoàn tác được.', { tone: 'bad', ok: 'Xoá', title: 'Xoá dữ liệu' }).then(function (yes) {
                if (!yes) return;
                ums.api.call({ action: cfg.pre + '/Xoa', versionAPI: 'v1.0', strIds: rec.ID, strNguoiThucHien_Id: '' })
                    .then(function () { ui.toast('Xoá thành công', 'ok'); dlg.close(); load(); })
                    .catch(fail('xoá'));
            });
        }

        root.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-do]');
            if (!b || !root.contains(b)) return;
            var act = b.getAttribute('data-do');
            if (act === 'search') load();
            else if (act === 'update') updateAll();
            else if (act === 'add') {
                var v = f();
                if (!v.he || !v.khoa || !v.dvt || (cfg.hasCT && !v.ct)) {
                    ui.toast(cfg.hasCT ? 'Hãy chọn Hệ - Khóa trước - Chương trình - Đơn vị tính !' : 'Hãy chọn Hệ - Khóa trước - Đơn vị tính !', 'warn');
                    return;
                }
                openForm(null);
            }
        });

        return { load: load, filter: f };
    };

    /* =========================================================================
       Dữ liệu mẫu dùng chung (CHỈ đọc ở chế độ dựng thử — ums.api không tra
       bảng này khi gọi API thật). Tệp <tên>.demo.js gọi B.demoChung() để
       đăng ký danh mục đào tạo, đơn vị tính… rồi thêm phần riêng của mình.
       ========================================================================= */
    var D = B.demo = {};
    D.he = [
        { ID: 'HE1', MAHEDAOTAO: 'DHCQ', TENHEDAOTAO: 'Đại học chính quy' },
        { ID: 'HE2', MAHEDAOTAO: 'VLVH', TENHEDAOTAO: 'Đại học vừa làm vừa học' },
        { ID: 'HE3', MAHEDAOTAO: 'THS', TENHEDAOTAO: 'Thạc sĩ' }
    ];
    D.khoa = [
        { ID: 'K67', MAKHOA: 'K67', TENKHOA: 'Khóa 67 (2022–2026)', DAOTAO_HEDAOTAO_ID: 'HE1' },
        { ID: 'K68', MAKHOA: 'K68', TENKHOA: 'Khóa 68 (2023–2027)', DAOTAO_HEDAOTAO_ID: 'HE1' },
        { ID: 'K69', MAKHOA: 'K69', TENKHOA: 'Khóa 69 (2024–2028)', DAOTAO_HEDAOTAO_ID: 'HE1' },
        { ID: 'VL23', MAKHOA: 'VL23', TENKHOA: 'VLVH 2023', DAOTAO_HEDAOTAO_ID: 'HE2' },
        { ID: 'CH24', MAKHOA: 'CH24', TENKHOA: 'Cao học 2024', DAOTAO_HEDAOTAO_ID: 'HE3' }
    ];
    D.ct = [
        { ID: 'CT1', MACHUONGTRINH: '7480103', TENCHUONGTRINH: 'Kỹ thuật phần mềm', DAOTAO_KHOADAOTAO_ID: 'K67' },
        { ID: 'CT2', MACHUONGTRINH: '7340101', TENCHUONGTRINH: 'Quản trị kinh doanh', DAOTAO_KHOADAOTAO_ID: 'K67' },
        { ID: 'CT3', MACHUONGTRINH: '7340301', TENCHUONGTRINH: 'Kế toán', DAOTAO_KHOADAOTAO_ID: 'K68' },
        { ID: 'CT4', MACHUONGTRINH: '7480201', TENCHUONGTRINH: 'Công nghệ thông tin', DAOTAO_KHOADAOTAO_ID: 'K68' },
        { ID: 'CT5', MACHUONGTRINH: '7220201', TENCHUONGTRINH: 'Ngôn ngữ Anh', DAOTAO_KHOADAOTAO_ID: 'K69' },
        { ID: 'CT6', MACHUONGTRINH: '8340101', TENCHUONGTRINH: 'Thạc sĩ Quản trị kinh doanh', DAOTAO_KHOADAOTAO_ID: 'CH24' }
    ];
    D.lop = [
        { ID: 'L1', MA: 'KTPM01', TEN: 'KTPM01-K67', DAOTAO_KHOADAOTAO_ID: 'K67', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1' },
        { ID: 'L2', MA: 'KTPM02', TEN: 'KTPM02-K67', DAOTAO_KHOADAOTAO_ID: 'K67', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1' },
        { ID: 'L3', MA: 'QTKD01', TEN: 'QTKD01-K67', DAOTAO_KHOADAOTAO_ID: 'K67', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT2' },
        { ID: 'L4', MA: 'KT01', TEN: 'KT01-K68', DAOTAO_KHOADAOTAO_ID: 'K68', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT3' },
        { ID: 'L5', MA: 'CNTT01', TEN: 'CNTT01-K68', DAOTAO_KHOADAOTAO_ID: 'K68', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT4' }
    ];
    D.sv = [
        { ID: 'SV1', QLSV_NGUOIHOC_ID: 'NH0000000000000000000000000000001', MASO: 'BIT220101', HODEM: 'Nguyễn Văn', TEN: 'An', NGAYSINH_NGAY: '12', NGAYSINH_THANG: '03', NGAYSINH_NAM: '2004', DAOTAO_LOPQUANLY_TEN: 'KTPM01-K67', DAOTAO_LOPQUANLY_ID: 'L1' },
        { ID: 'SV2', QLSV_NGUOIHOC_ID: 'NH0000000000000000000000000000002', MASO: 'BIT220102', HODEM: 'Trần Thị', TEN: 'Bình', NGAYSINH_NGAY: '05', NGAYSINH_THANG: '11', NGAYSINH_NAM: '2004', DAOTAO_LOPQUANLY_TEN: 'KTPM01-K67', DAOTAO_LOPQUANLY_ID: 'L1' },
        { ID: 'SV3', QLSV_NGUOIHOC_ID: 'NH0000000000000000000000000000003', MASO: 'BIT220103', HODEM: 'Lê Hoàng', TEN: 'Cường', NGAYSINH_NGAY: '21', NGAYSINH_THANG: '07', NGAYSINH_NAM: '2004', DAOTAO_LOPQUANLY_TEN: 'KTPM01-K67', DAOTAO_LOPQUANLY_ID: 'L1' },
        { ID: 'SV4', QLSV_NGUOIHOC_ID: 'NH0000000000000000000000000000004', MASO: 'BIT220140', HODEM: 'Phạm Minh', TEN: 'Đức', NGAYSINH_NGAY: '30', NGAYSINH_THANG: '01', NGAYSINH_NAM: '2004', DAOTAO_LOPQUANLY_TEN: 'KTPM02-K67', DAOTAO_LOPQUANLY_ID: 'L2' },
        { ID: 'SV5', QLSV_NGUOIHOC_ID: 'NH0000000000000000000000000000005', MASO: 'BBA220561', HODEM: 'Vũ Thu', TEN: 'Hà', NGAYSINH_NGAY: '09', NGAYSINH_THANG: '09', NGAYSINH_NAM: '2004', DAOTAO_LOPQUANLY_TEN: 'QTKD01-K67', DAOTAO_LOPQUANLY_ID: 'L3' }
    ];

    function has(v) { return v !== undefined && v !== null && v !== ''; }
    function inList(v, x) { return !has(v) || String(v).split(',').indexOf(String(x)) >= 0; }

    B.demoChung = function () {
        if (!ums.demo || !ums.demo.add) return;
        var khoa = function (o) { return D.khoa.filter(function (r) { return inList(o.strDAOTAO_HeDaoTao_Id || o.strDaoTao_HeDaoTao_Id, r.DAOTAO_HEDAOTAO_ID); }); };
        var ct = function (o) {
            return D.ct.filter(function (r) {
                var k = D.khoa.filter(function (x) { return x.ID === r.DAOTAO_KHOADAOTAO_ID; })[0] || {};
                return inList(o.strDaoTao_KhoaDaoTao_Id, r.DAOTAO_KHOADAOTAO_ID) && inList(o.strDaoTao_HeDaoTao_Id, k.DAOTAO_HEDAOTAO_ID);
            });
        };
        var lop = function (o) {
            return D.lop.filter(function (r) {
                return inList(o.strDaoTao_KhoaDaoTao_Id, r.DAOTAO_KHOADAOTAO_ID) && inList(o.strDaoTao_ToChucCT_Id, r.DAOTAO_TOCHUCCHUONGTRINH_ID);
            });
        };
        ums.demo.add({
            'pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTao': D.he,
            'pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTaoQuyen': D.he,
            'pkg_kehoach_thongtin.LayDSKS_DaoTao_KhoaDaoTao': khoa,
            'pkg_kehoach_thongtin.LayDSKS_DaoTao_KhoaDaoTaoQuyen': khoa,
            'pkg_kehoach_thongtin.LayDSKS_DaoTao_ToChucCT': ct,
            'pkg_kehoach_thongtin.LayDSKS_DaoTao_ToChucCTQuyen': ct,
            'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy': lop,
            'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLyQuyen': lop,
            'pkg_kehoach_thongtin.LayDSKhoaQuanLy': [
                { ID: 'KQL1', MA: 'CNTT', TEN: 'Khoa Công nghệ thông tin' },
                { ID: 'KQL2', MA: 'KT', TEN: 'Khoa Kinh tế' },
                { ID: 'KQL3', MA: 'NN', TEN: 'Khoa Ngoại ngữ' }
            ],
            'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao': [
                { ID: 'TG1', DAOTAO_THOIGIANDAOTAO: '2025_2026_1' }, { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: '2025_2026_2' }, { ID: 'TG3', DAOTAO_THOIGIANDAOTAO: '2026_2027_1' }
            ],
            'pkg_hosohocvien.LayDanhSachHoSo': function (o) {
                return D.sv.filter(function (r) { return inList(o.strLopQuanLy_Id, r.DAOTAO_LOPQUANLY_ID); });
            },
            'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLTC.DVT': [
                { ID: 'DVT1', MA: 'TC', TEN: 'Tín chỉ' }, { ID: 'DVT2', MA: 'HK', TEN: 'Học kỳ' }, { ID: 'DVT3', MA: 'THANG', TEN: 'Tháng' }
            ],
            'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLTC.NVAP': [
                { ID: 'NV1', MA: 'HP', TEN: 'Tính học phí', CHUNG_TENDANHMUC_TEN: 'Nghiệp vụ áp dụng' }
            ],
            'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLSV.TRANGTHAI': [
                { ID: 'TT1', MA: 'DH', TEN: 'Đang học' }, { ID: 'TT2', MA: 'BL', TEN: 'Bảo lưu' }, { ID: 'TT3', MA: 'TN', TEN: 'Đã tốt nghiệp' }, { ID: 'TT4', MA: 'TH', TEN: 'Thôi học' }
            ],
            'TC_ThoiGianTheoDonViTinh/LayThoiGianTheoDonViTinh': function (o) {
                if (o.strDonViTinh_Id === 'THANG') {
                    return [{ ID: 'T09', THOIGIAN: '09/2025' }, { ID: 'T10', THOIGIAN: '10/2025' }, { ID: 'T11', THOIGIAN: '11/2025' }, { ID: 'T12', THOIGIAN: '12/2025' }];
                }
                return [{ ID: 'TG1', THOIGIAN: '2025_2026_1' }, { ID: 'TG2', THOIGIAN: '2025_2026_2' }, { ID: 'TG3', THOIGIAN: '2026_2027_1' }];
            }
        });
    };

})(window);
