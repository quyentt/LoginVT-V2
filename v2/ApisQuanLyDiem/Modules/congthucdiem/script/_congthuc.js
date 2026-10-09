/* =========================================================================
   Khung dùng chung của hai màn "gán theo HỌC PHẦN × KỲ" của module congthucdiem:
     · hinhthucthi.js — Hình thức thi (+ thời gian thi) cho từng học phần theo kỳ
     · hocphan.js     — Công thức điểm (xâu công thức) cho từng học phần theo kỳ
   Hai tệp gốc (ApisQuanLyDiem/Modules/congthucdiem/script/hinhthucthi.js, hocphan.js)
   chép nhau gần từng dòng — chỉ khác lời gọi, ô trong ô bảng và hộp sửa.
   ---------------------------------------------------------------------------
   ums.qldCT.man(root, cfg) — cfg:
     tieuDe, nutThem ('Khai hình thức thi mới'), formTieuDe, hocTrinh (tên cột Số tín chỉ / Học trình)
     locChuaKhai: true           ô "Lọc môn chưa khai công thức" (chỉ hocphan)
     hang: { action, func }      danh sách học phần (phân trang máy chủ)
     cot:  { action, func }      danh sách KỲ làm cột (LayDSkY_*_PhamViHP) — cột THOIGIAN, ID
     o:    { action, func, hien(rec) }   nội dung MỘT ô (học phần × kỳ) — bản ghi cuối cùng thắng (như gốc)
     xoa:  { action, func }      xoá theo strIds = ID bản ghi của ô
     import: { ten, ma }         nút Import cố định trong khung "Thêm mới"
     form: { html(), init(get), cot: [cột ui.table cho mỗi dòng], dien(get, bang), luu(tr, row, tg, get) → call | null }
     sua(rec, hp, tg, xong, root)   biểu mẫu sửa MỘT ô — mở TRONG TRANG (ums.pat.formTrang, host = root), không bật hộp thoại
   ---------------------------------------------------------------------------
   Lời gọi dùng chung (chép nguyên hai bản gốc):
     Bộ môn: edu.system.getList_CoCauToChuc({ strCCTC_Loai_Id: '', strCCTC_Cha_Id: '', iTrangThai: 1 }) → ums.ref.coCauToChuc
     Môn học: KHCT_MonHoc/LayDanhSach (GET) — strTuKhoa '', strThuocBoMon_Id, strNguoiThucHien_Id '', 1, 1000000
     Thuộc tính học phần: danh mục KHCT.TTHP
     Thời gian (khung Thêm mới): KHCT_ThoiGianDaoTao/LayDanhSach (GET) — strTuKhoa '', strDAOTAO_NAM_Id '', '', 1, 1000000
     Báo cáo: edu.system.getList_MauImport("zonebtnHP") (danh sách) và ("zonebtnHTT"/"zonebtnHPC") (khung Thêm mới) → ums.report.mount
   Khác bản gốc (đổi cách làm, dữ liệu gửi đi giữ nguyên):
     · Nạp nội dung N×M ô: gốc bắn cùng lúc N×M lời gọi → nay hàng đợi 6 luồng, vẽ lần nạp mới thì huỷ lần cũ.
     · Lưu hàng loạt / xoá hàng loạt: ums.ui.batch rồi nạp lại MỘT lần.
     · Xoá theo danh sách chọn: gốc gửi cả ô TRỐNG (strIds = undefined) → nay chỉ gửi ô có bản ghi.
     · Bộ môn → Môn học: chưa chọn bộ môn thì KHOÁ môn học, đổi / xoá bộ môn thì xoá trắng môn học (luật chung).
       Xoá bộ môn cũng nạp lại danh sách (gốc chỉ bắt select2:select).
     · Khung Thêm mới: ô báo cáo mount({ import: false }) — gốc vẽ import của chức năng đè lên nút Import cố định;
       ở đây luôn giữ nút Import cố định. Mẫu import của chức năng vẫn ở nút của khung danh sách.
     · Khung Thêm mới BẮT chọn kỳ trước khi lưu (gốc gửi strDaoTao_ThoiGianDaoTao_Id rỗng).
     · Đếm tổng: gốc có ô #lbl…_Tong nhưng không đổ số → nay hiện tổng số học phần.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var C = ums.qldCT = ums.qldCT || {};
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function iM() { return (ums.session && ums.session.iM) || ''; }
    function loi(t) { return function (err) { ums.api.handle(err, t); }; }
    C.e = e; C.uid = uid; C.iM = iM; C.loi = loi; C.arr = arr;

    /* Hàng đợi N luồng cho lời gọi ô — trả hàm huỷ */
    function hangDoi(viec, n, moi) {
        var i = 0, huy = false;
        function chay() {
            if (huy || i >= viec.length) return Promise.resolve();
            var v = viec[i++];
            return Promise.resolve().then(v).catch(function () {}).then(chay);
        }
        for (var k = 0; k < (n || 6); k++) chay();
        return function () { huy = true; };
    }

    /* Thời gian đào tạo (khung Thêm mới) — dùng chung hai màn */
    C.napThoiGian = function (el) {
        return ums.api.call({ action: 'KHCT_ThoiGianDaoTao/LayDanhSach', method: 'GET', silent: true,
            strTuKhoa: '', strDAOTAO_NAM_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 })
            .then(function (r) { pat.fill(el, arr(r.data), { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn kỳ, đợt áp dụng' }); })
            .catch(loi('thời gian đào tạo'));
    };

    C.man = function (root, cfg) {
        var loc = [
            { key: 'q', label: 'Nhập từ khóa tìm kiếm' },
            { key: 'bm', type: 'select', label: 'Chọn bộ môn' },
            { key: 'mh', type: 'select', label: 'Chọn môn học' },
            { key: 'tt', type: 'select', label: 'Chọn thuộc tính học phần' }
        ];
        root.innerHTML =
            '<div data-z="ds">' +
                pat.page(cfg.tieuDe, '') +
                pat.filterBar(loc, { extra:
                    (cfg.locChuaKhai ? '<div class="ums-field ums-field--fit"><label class="ums-check"><input type="checkbox" data-f="chuakhai"> Lọc môn chưa khai công thức</label></div>' : '') +
                    '<div class="ums-field ums-field--fit" data-z="bc"></div>' }) +
                pat.panel({ title: 'Danh sách học phần', icon: 'fa-list-ul', count: 'n', flush: true, zone: 'bang',
                    tools: ui.btn('add', { text: cfg.nutThem, attr: { 'data-a': 'them' } }) +
                        ui.xoaChon('input[data-o]', { sm: true, goc: '.ums-panel', attr: { 'data-a': 'xoa' } }) }) +
            '</div>' +
            '<div data-z="form" hidden>' +
                pat.panel({ title: cfg.formTieuDe, icon: 'fa-plus', flush: true,
                    tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) + ui.btn('save', { attr: { 'data-a': 'luu' } }),
                    body: '<div class="ums-filter qldct-them">' +
                        '<div class="ums-field"><select class="ums-select" data-g="tg" data-ph="Chọn kỳ, đợt áp dụng"><option value=""></option></select></div>' +
                        cfg.form.html() +
                        '<div class="ums-field ums-field--fit">' + ui.btn('search', { text: 'Điền tự động', icon: 'fa-link', mod: 'out-primary', attr: { 'data-a': 'dien' } }) + '</div>' +
                        '<div class="ums-field ums-field--fit" data-z="bc2"></div>' +
                        '<div class="ums-field ums-field--fit">' + ui.btn('importer', { attr: { 'data-a': 'import' } }) + '</div>' +
                    '</div><div data-z="bangThem"></div>' }) +
            '</div>';
        ui.enhance(root);

        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
        function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
        function g(k) { return root.querySelector('[data-g="' + k + '"]'); }
        function v(k) { return pat.val(f(k)); }
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');

        /* ---------- Bộ lọc ---------------------------------------------- */
        ums.ref.coCauToChuc({ strCCTC_Loai_Id: '', strCCTC_Cha_Id: '', iTrangThai: 1 })
            .then(function (d) { pat.fill(f('bm'), d, { name: 'TEN', head: 'Chọn bộ môn' }); }).catch(loi('bộ môn'));
        function napMonHoc() {
            return ums.api.call({ action: 'KHCT_MonHoc/LayDanhSach', method: 'GET', silent: true,
                strTuKhoa: '', strThuocBoMon_Id: v('bm'), strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 })
                .then(function (r) { pat.fill(f('mh'), arr(r.data), { name: 'TEN', head: 'Chọn môn học' }); }).catch(loi('môn học'));
        }
        napMonHoc();
        ums.api.dm('KHCT.TTHP').then(function (d) { pat.fill(f('tt'), d, { head: 'Chọn thuộc tính học phần' }); }).catch(function () {});

        pat.chain([f('bm'), f('mh')], { phatLai: false });
        if (window.jQuery) {
            jQuery(f('bm')).on('select2:select select2:clear', function () { napMonHoc(); trang.index = 1; tai(); });
            jQuery(f('mh')).on('select2:select select2:clear', function () { trang.index = 1; tai(); });
            jQuery(f('tt')).on('select2:select select2:clear', function () { trang.index = 1; tai(); });
        }
        f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); trang.index = 1; tai(); } });

        ums.report.mount(z('bc'), {});
        ums.report.mount(z('bc2'), { import: false });

        /* ---------- Khung Thêm mới: ô chọn riêng ------------------------- */
        C.napThoiGian(g('tg'));
        cfg.form.init(g);

        /* ---------- Cột KỲ ----------------------------------------------- */
        var COT = [], DS = [], REC = {}, tong = 0, trang = { index: 1, size: 10 }, huyNap = null, lan = 0;
        var cotSan = ums.api.call({ action: cfg.cot.action, func: cfg.cot.func, strTuKhoa: '', strNguoiThucHien_Id: uid() })
            .then(function (r) { COT = arr(r.data); }).catch(loi('danh sách kỳ'));

        function khoa(hp, tg) { return hp + '|' + tg; }

        function tai() {
            var moi = ++lan;
            if (huyNap) huyNap();
            z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            var p = {
                action: cfg.hang.action, func: cfg.hang.func,
                strTuKhoa: (f('q').value || '').trim(),
                strDaoTao_MonHoc_Id: v('mh'),
                strThuocBoMon_Id: v('bm'),
                strThuocTinhHocPhan_Id: v('tt'),
                strChucNang_Id: (ums.state && ums.state.chucNangId) || '',
                strNguoiThucHien_Id: uid(),
                pageIndex: trang.index, pageSize: trang.size
            };
            if (cfg.locChuaKhai) {
                /* hocphan.js gốc đặt tham số này ngay sau strThuocTinhHocPhan_Id */
                p = Object.assign({}, p, { dMonChuaKhaiCongThuc: f('chuakhai').checked ? 1 : 0 });
            }
            return cotSan.then(function () { return ums.api.call(p); }).then(function (r) {
                if (moi !== lan) return;
                DS = arr(r.data); tong = r.pager || DS.length; REC = {};
                z('n').textContent = '(' + tong + ')';
                ve(); veThem(); napO(moi);
            }).catch(function (err) {
                if (moi !== lan) return;
                z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách học phần');
            });
        }
        C.tai = tai;

        function oHtml(row, c) {
            var k = khoa(row.ID, c.ID);
            return '<div class="qldct-o">' +
                '<button type="button" class="qldct-o__nut is-cho" data-sua="' + esc(k) + '" title="Bấm để sửa"><i class="fa-light fa-spinner fa-spin"></i></button>' +
                '<input type="checkbox" data-o="' + esc(k) + '" data-hang="' + esc(row.ID) + '" data-cot="' + esc(c.ID) + '" title="Chọn ô">' +
            '</div>';
        }
        function ve() {
            var cols = [
                { title: 'Mã học phần', prop: 'MA', cls: 'is-nowrap' },
                { title: 'Tên học phần', prop: 'TEN' },
                { title: cfg.hocTrinh, prop: 'HOCTRINH', cls: 'is-center' },
                { title: 'Đơn vị', prop: 'THUOCBOMON_TEN' }
            ];
            COT.forEach(function (c) {
                cols.push({ head: esc(e(c.THOIGIAN)) + '<br><input type="checkbox" data-chon-cot="' + esc(c.ID) + '" title="Chọn cả cột">',
                    cls: 'is-center is-nowrap', render: function (row) { return oHtml(row, c); } });
            });
            cols.push({ head: 'Tất cả <input type="checkbox" data-chon-all title="Chọn tất cả">', cls: 'is-center is-nowrap', width: '80px',
                render: function (row) { return '<input type="checkbox" data-chon-hang="' + esc(row.ID) + '" title="Chọn cả dòng">'; } });
            ui.table({ el: z('bang'), rows: DS, columns: cols, empty: 'Không có học phần',
                page: { index: trang.index, size: trang.size, total: tong,
                    onChange: function (p) { trang.index = p; tai(); },
                    onSize: function (n) { trang.size = n; trang.index = 1; tai(); } } });
        }

        /* Nạp nội dung từng ô — getList_KetQua_BangDuLieu(strPhamViApDung_Id, strDaoTao_ThoiGianDaoTao_Id) */
        function napO(moi) {
            var viec = [];
            DS.forEach(function (row) {
                COT.forEach(function (c) {
                    viec.push(function () {
                        return ums.api.call({ action: cfg.o.action, func: cfg.o.func, silent: true,
                            strPhamViApDung_Id: row.ID, strDaoTao_ThoiGianDaoTao_Id: c.ID })
                            .then(function (r) { if (moi === lan) datO(row.ID, c.ID, arr(r.data)); },
                                function () { if (moi === lan) datO(row.ID, c.ID, null); });
                    });
                });
            });
            huyNap = hangDoi(viec, 6);
        }
        function datO(hp, tg, ds) {
            var k = khoa(hp, tg);
            var nut = z('bang').querySelector('[data-sua="' + cssEsc(k) + '"]');
            if (!nut) return;
            nut.classList.remove('is-cho');
            if (ds === null) { nut.innerHTML = '<span class="qldct-o__loi" title="Không nạp được">!</span>'; return; }
            var rec = ds.length ? ds[ds.length - 1] : null;     // gốc: forEach ghi đè → bản ghi cuối thắng
            if (rec) REC[k] = rec; else delete REC[k];
            var t = rec ? cfg.o.hien(rec) : '';
            nut.classList.toggle('is-trong', !t);
            nut.innerHTML = t ? esc(t) : '<span class="qldct-o__trong">—</span>';
        }
        function cssEsc(s) { return window.CSS && CSS.escape ? CSS.escape(s) : String(s).replace(/"/g, '\\"'); }

        /* ---------- Chọn cả cột / cả dòng / tất cả ------------------------ */
        z('bang').addEventListener('change', function (ev) {
            var t = ev.target, bang = z('bang');
            function dat(sel, on) { Array.prototype.forEach.call(bang.querySelectorAll(sel), function (x) { x.checked = on; }); }
            if (t.hasAttribute('data-chon-cot')) dat('tbody input[data-cot="' + cssEsc(t.getAttribute('data-chon-cot')) + '"]', t.checked);
            else if (t.hasAttribute('data-chon-hang')) dat('tbody input[data-hang="' + cssEsc(t.getAttribute('data-chon-hang')) + '"]', t.checked);
            else if (t.hasAttribute('data-chon-all')) { dat('tbody input[data-o], tbody input[data-chon-hang], thead input[data-chon-cot]', t.checked); }
            else return;
            ui.demXoaChon && ui.demXoaChon();
        });

        /* ---------- Sửa một ô -------------------------------------------- */
        z('bang').addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-sua]');
            if (!b || b.classList.contains('is-cho')) return;
            var p = b.getAttribute('data-sua').split('|');
            cfg.sua(REC[b.getAttribute('data-sua')] || null, p[0], p[1], tai, root);   // root = vùng gốc cho biểu mẫu trong trang (BO-CUC luật 1)
        });

        /* ---------- Xoá theo danh sách chọn ------------------------------ */
        function xoa() {
            var chon = Array.prototype.map.call(z('bang').querySelectorAll('tbody input[data-o]:checked'), function (x) { return x.getAttribute('data-o'); });
            if (!chon.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
            var ids = chon.map(function (k) { return REC[k] && REC[k].ID; }).filter(Boolean);
            if (!ids.length) { ui.toast('Các ô đã chọn chưa có dữ liệu để xóa', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn xóa dữ liệu không?' + (ids.length < chon.length ? ' (' + (chon.length - ids.length) + ' ô trống được bỏ qua)' : ''),
                { tone: 'bad', ok: 'Xóa', title: 'Xóa theo danh sách chọn' }).then(function (yes) {
                if (!yes) return;
                ui.batch(ids.map(function (id) {
                    return { action: cfg.xoa.action, func: cfg.xoa.func, iM: iM(), strIds: id, strNguoiThucHien_Id: uid() };
                }), { title: 'Đang xóa', okText: 'Xóa dữ liệu thành công!', show: true }).then(tai);
            });
        }

        /* ---------- Khung Thêm mới --------------------------------------- */
        function veThem() {
            var cols = [
                { title: 'Mã học phần', prop: 'MA', cls: 'is-nowrap' },
                { title: 'Tên học phần', prop: 'TEN' },
                { title: 'Học trình', prop: 'HOCTRINH', cls: 'is-center' },
                { title: 'Đơn vị', prop: 'THUOCBOMON_TEN' }
            ].concat(cfg.form.cot).concat([{
                head: '<input type="checkbox" data-them-all title="Chọn tất cả">', cls: 'is-center', width: '44px',
                render: function (row) { return '<input type="checkbox" data-them="' + esc(row.ID) + '">'; }
            }]);
            ui.table({ el: z('bangThem'), rows: DS, columns: cols, empty: 'Không có học phần' });
        }
        z('bangThem').addEventListener('change', function (ev) {
            if (!ev.target.hasAttribute('data-them-all')) return;
            Array.prototype.forEach.call(z('bangThem').querySelectorAll('tbody input[data-them]'), function (x) { x.checked = ev.target.checked; });
        });
        function luu() {
            var tg = pat.val(g('tg'));
            if (!tg) { ui.toast('Vui lòng chọn kỳ, đợt áp dụng', 'warn'); return; }
            var calls = [];
            DS.forEach(function (row) {
                var tr = z('bangThem').querySelector('tr[data-id="' + cssEsc(row.ID) + '"]');
                if (!tr || !tr.querySelector('input[data-them]').checked) return;
                var c = cfg.form.luu(tr, row, tg, g);
                if (c) calls.push(c);
            });
            if (!calls.length) { ui.toast('Vui lòng chọn học phần và nhập dữ liệu cần lưu', 'warn'); return; }
            ui.batch(calls, { title: 'Đang lưu', okText: 'Thực hiện thành công', show: true }).then(tai);
        }

        root.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || b.disabled || !root.contains(b)) return;
            var a = b.getAttribute('data-a');
            if (a === 'search') { trang.index = 1; tai(); }
            else if (a === 'them') ui.swap(z('ds'), z('form'));
            else if (a === 'dong') { ui.swap(z('form'), z('ds')); tai(); }
            else if (a === 'xoa') xoa();
            else if (a === 'luu') luu();
            else if (a === 'dien') cfg.form.dien(g, z('bangThem'));
            else if (a === 'import') ums.report.importChung(cfg.import.ten, cfg.import.ma, { onDone: tai });
        });

        tai();
    };
})();
