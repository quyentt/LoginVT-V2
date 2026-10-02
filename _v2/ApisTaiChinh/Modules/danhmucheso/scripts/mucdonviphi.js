/* =========================================================================
   Mức đơn vị phí (theo chương trình: học kỳ × loại khoản × kiểu học)
   Bản gốc: ApisTaiChinh/Modules/danhmucheso/html/mucdonviphi.html
            + scripts/mucdonvipphi.js   ← tên tệp gốc có hai chữ "p"
   ---------------------------------------------------------------------------
   Bố cục: ums.pat.master (cột trái lọc Hệ / Khoá / từ khoá → danh sách
   chương trình; bản gốc vẽ bằng jstree phẳng) + ums.pat.pivot (dòng = học
   kỳ, nhóm cột = loại khoản có dữ liệu, cột con = kiểu học). Sửa một ô mở
   hộp thoại một trường — đúng quy ước 1 của BO-CUC.md. "Tạo mới" mở biểu mẫu
   áp dụng một mức cho nhiều chương trình × khoản thu × kiểu học.
   Lời gọi (kiểu cũ, không mã hoá, versionAPI v1.0 trong dữ liệu):
       TC_DonViPhi_SoTien/LayDanhSach    GET   theo strPhamViApDung_Id = chương trình
       TC_DonViPhi_SoTien/ThemMoi        POST  (id nối dấu phẩy cho CT / khoản / kiểu học)
       TC_DonViPhi_SoTien/CapNhat        POST  sửa một ô [HK, CT, khoản, kiểu học]
       TC_DonViPhi_SoTien/Xoa            POST  strId
       TC_KhoanThu/LayDanhSach           GET   loại khoản
       danh mục KHDT.DIEM.KIEUHOC (getList_DanhMucDulieu, không gửi dTrangThai)
       edu.system.getList_HeDaoTao / getList_KhoaDaoTao / getList_ChuongTrinhDaoTao
       / getList_ThoiGianDaoTao (ums.ref.*)

   Khác bản gốc (có chủ đích):
     · Tiêu đề nhóm cột: bản gốc ghi dtLoaiKhoan[lk].TEN (chỉ số của danh
       sách ĐẦY ĐỦ) thay vì arrLoaiKhoan[lk].TEN (danh sách loại khoản có dữ
       liệu) → tên cột sai khi loại khoản có dữ liệu không nằm đầu danh
       mục. Bản mới ghi đúng tên.
     · Bấm Xoá ở ô chưa có bản ghi chỉ báo "ô chưa có dữ liệu", không gọi API
       (bản gốc gọi Xoa với strId rỗng).
     · Chọn Hệ rỗng: bản gốc lọc khoá có DAOTAO_HEDAOTAO_ID == "" → danh
       sách rỗng; bản mới hiện lại toàn bộ khoá.
     · Chi tiết (popover jQuery) → dòng "Cập nhật" trong hộp thoại sửa ô.
   Cố ý bỏ: menu "Truy/xuất" (Import dữ liệu / Export dữ liệu / …) — không
   có trình xử lý nào trong bản gốc; ô #dropChuongTrinhDaoTao không có trong HTML.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, B = ums.dmhsB, esc = ui.esc, e = B.e;
    var root = document.getElementById('mucdonviphi');
    var st = { khoaAll: [], ct: [], lk: [], kh: [], tg: [], vals: [], ctId: '', ctTen: '', chon: [] };

    var m = pat.master({
        el: root,
        title: 'Mức đơn vị phí',
        side: {
            title: 'Chương trình', icon: 'fa-folder-open', search: false,
            /* Luật cột trái (BO-CUC 12): ô tìm chuẩn riêng (gõ tự tìm), Hệ / Khoá vào Bộ lọc nâng cao (pat.cotTrai),
               nhãn "Hệ / Khoá" đang lọc luôn hiện (data-cot-giu) */
            filter: '<div class="ums-master__search"><div class="ums-searchbar ums-searchbar--sm">' +
                '<span class="ums-searchbar__icon"><i class="fa-light fa-magnifying-glass"></i></span>' +
                '<input class="ums-searchbar__input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div></div>' +
                '<div class="ums-filter">' +
                '<div class="ums-field"><select class="ums-select" data-f="he"><option value="">-- Chọn hệ đào tạo --</option></select></div>' +
                '<div class="ums-field"><select class="ums-select" data-f="khoa"><option value="">-- Chọn khóa đào tạo --</option></select></div>' +
                '</div><div class="ums-row ums-u-fz13 ums-u-muted ums-u-mt-2" data-cot-giu>' +
                '<i class="fa-light fa-folder-open"></i><span class="ums-u-ellipsis" data-z="heKhoa">Chương trình</span></div>'
        },
        main: { title: false }
    });

    m.mainBody.innerHTML =
        '<div class="ums-panel" data-z="list">' +
            '<div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-table-cells"></i> ../<span data-z="ctTen"></span></div>' +
            '<div class="ums-panel__tools">' +
                ui.btn('add', { text: 'Tạo mới', attr: { 'data-do': 'add' } }) +
                ui.btn('reload', { attr: { 'data-do': 'reload' } }) +
            '</div></div>' +
            '<div class="ums-panel__body ums-panel__body--flush" data-z="table">' + ui.empty('Chọn một chương trình ở cột trái', 'fa-hand-pointer') + '</div>' +
        '</div>' +
        '<div class="ums-panel" data-z="form" hidden>' +
            '<div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-pen-to-square"></i> Thêm mới mức đơn vị phí</div>' +
            '<div class="ums-panel__tools">' + ui.btn('close', { attr: { 'data-do': 'close' } }) +
                '<button type="button" class="ums-btn ums-btn--ghost" data-do="rewrite"><i class="fa-light fa-eraser"></i><span>Viết lại</span></button>' +
                ui.btn('save', { attr: { 'data-do': 'save' } }) + '</div></div>' +
            '<div class="ums-panel__body"><div class="ums-grid ums-grid--2">' +
                '<div>' + ui.field('Học kỳ', '<select class="ums-select" data-n="hk"></select>', { required: true }) + '</div>' +
                '<div>' + ui.field('Số tiền', '<input class="ums-input" data-n="tien" placeholder="Nhập số tiền" inputmode="numeric" autocomplete="off">', { required: true }) + '</div>' +
                '<div>' + ui.field('Khoản thu', '<select class="ums-select" data-n="kt" multiple></select>', { required: true }) + '</div>' +
                '<div>' + ui.field('Kiểu học', '<select class="ums-select" data-n="kh" multiple></select>', { required: true }) + '</div>' +
                '<div style="grid-column:1 / -1">' + ui.field('Kế thừa', '<select class="ums-select" data-n="kethua" data-required>' +
                    '<option value="0">1. Áp dụng bình thường</option><option value="1">2. Áp dụng tương tự cho tất cả ngành trong khóa</option></select>') + '</div>' +
                '<div style="grid-column:1 / -1"><div class="ums-row ums-row--between ums-u-mb-2"><span class="ums-field__label ums-u-mb-0">Đối tượng áp dụng — chương trình <i class="ums-field__req">*</i></span>' +
                    '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm" data-do="pickCT"><i class="fa-light fa-magnifying-glass"></i><span>Tìm chương trình</span></button></div>' +
                    '<div data-z="chon"></div></div>' +
            '</div></div>' +
        '</div>';
    m.sideBody.innerHTML = ui.empty('Chọn khóa đào tạo để hiện chương trình', 'fa-filter');

    function q(s) { return root.querySelector(s); }
    var F = { q: q('[data-f="q"]'), he: q('[data-f="he"]'), khoa: q('[data-f="khoa"]') };
    var N = { hk: q('[data-n="hk"]'), tien: q('[data-n="tien"]'), kt: q('[data-n="kt"]'), kh: q('[data-n="kh"]'), kethua: q('[data-n="kethua"]') };
    ui.enhance(root);                       // select2 cho mọi ô chọn thường
    B.s2multi(N.kt, '-- Chọn khoản thu --');  // ô chọn nhiều có mục "Chọn tất cả"
    B.s2multi(N.kh, '-- Chọn kiểu học --');
    var zList = q('[data-z="list"]'), zForm = q('[data-z="form"]'), zTable = q('[data-z="table"]');

    function fail(where) { return function (err) { ums.api.handle(err, where); }; }

    /* --- Nguồn --- */
    ums.ref.heDaoTao({ pageIndex: 1, pageSize: 1000 })
        .then(function (r) { B.fill(F.he, r, { name: 'TENHEDAOTAO', head: '-- Chọn hệ đào tạo --' }); }, fail('nạp hệ đào tạo'));

    // Khoá: nạp một lần với hệ rỗng, sau đó lọc tại máy theo DAOTAO_HEDAOTAO_ID
    ums.ref.khoaDaoTao({ strHeDaoTao_Id: '', pageIndex: 1, pageSize: 10000 }).then(function (r) {
        st.khoaAll = r;
        B.fill(F.khoa, r, { name: 'TENKHOA', head: '-- Chọn khóa đào tạo --' });
    }, fail('nạp khoá đào tạo'));

    function loadCT() {
        var host = m.sideBody;
        host.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
        return ums.ref.chuongTrinh({ strKhoaDaoTao_Id: F.khoa.value, strTuKhoa: F.q.value.trim(), pageIndex: 1, pageSize: 10000 })
            .then(function (r) {
                st.ct = r;
                host.innerHTML = r.length ? r.map(function (x) {
                    return '<button type="button" class="ums-master__item ums-u-ellipsis' + (x.ID === st.ctId ? ' is-active' : '') +
                        '" data-ct="' + esc(x.ID) + '" title="' + esc(x.TENCHUONGTRINH) + '">' + esc(x.TENCHUONGTRINH) + '</button>';
                }).join('') : ui.empty('Không có chương trình');
            }, function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'nạp chương trình'); });
    }
    loadCT();

    ums.ref.thoiGianDaoTao({ strNam_Id: '', pageIndex: 1, pageSize: 10000 }).then(function (r) {
        st.tg = r;
        B.fill(N.hk, r, { name: 'DAOTAO_THOIGIANDAOTAO', head: '-- Chọn học kỳ --' });
    }, fail('nạp học kỳ'));

    var ready = Promise.all([
        B.khoanThu().then(function (r) { st.lk = r; B.fillMulti(N.kt, r, {}); }),
        B.dmAll('KHDT.DIEM.KIEUHOC').then(function (r) { st.kh = r; B.fillMulti(N.kh, r, {}); })
    ]).catch(fail('nạp khoản thu / kiểu học'));

    /* --- Lọc --- */
    jQuery(F.he).on('select2:select', function () {
        var he = F.he.value;
        B.fill(F.khoa, he ? st.khoaAll.filter(function (x) { return x.DAOTAO_HEDAOTAO_ID == he; }) : st.khoaAll,
            { name: 'TENKHOA', head: '-- Chọn khóa đào tạo --' });
    });
    jQuery(F.khoa).on('select2:select', function () {
        if (!F.khoa.value) return;
        loadCT();
        var he = F.he.value ? F.he.options[F.he.selectedIndex].text : '..';
        q('[data-z="heKhoa"]').textContent = he + ' / ' + F.khoa.options[F.khoa.selectedIndex].text;
    });
    ums.pat.chain([F.he, F.khoa]);     // xoá Hệ thì xoá cả Khoá
    F.q.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); loadCT(); } });
    ums.pat.cotTrai({ side: m.side, search: F.q }, { tai: function () { loadCT(); }, tuTaiLoc: false });

    /* --- Bảng chéo --- */
    var token = 0;
    function load() {
        if (!st.ctId) return Promise.resolve();
        var my = ++token;
        zTable.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
        return Promise.all([ready, ums.api.call({
            action: 'TC_DonViPhi_SoTien/LayDanhSach',
            method: 'GET',
            versionAPI: 'v1.0',
            strTuKhoa: '',
            pageIndex: 1,
            pageSize: 10000,
            strPhamViApDung_Id: st.ctId,
            strPhanCapApDung_Id: '',
            strNgayApDung: '',
            strDaoTao_ThoiGianDaoTao_Id: '',
            strNguoiThucHien_Id: '',
            strDiem_KieuHoc_Id: '',
            strTaiChinh_CacKhoanThu_Id: '',
            strDangKy_DotDangKyHoc_Id: ''
        })]).then(function (x) {
            if (my !== token) return;
            st.vals = B.arr(x[1].data);
            draw();
        }).catch(function (err) {
            if (my !== token) return;
            zTable.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'mức đơn vị phí');
        });
    }

    /** Bản ghi của ô; bản gốc duyệt từ cuối, lấy bản ghi đầu tiên khớp */
    function recAt(row, col, g) {
        for (var d = st.vals.length - 1; d >= 0; d--) {
            var v = st.vals[d];
            if (v.PHAMVIAPDUNG_ID == st.ctId && v.DAOTAO_THOIGIANDAOTAO_ID == row.ID &&
                v.TAICHINH_CACKHOANTHU_ID == g.id && v.KIEUHOC_ID == col.key) return v;
        }
        return null;
    }

    /* genThead / genTbody_MucDonViPhi → ums.pat.pivot */
    function draw() {
        var vals = st.vals.filter(function (v) { return v.PHAMVIAPDUNG_ID == st.ctId; });
        var lk = st.lk.filter(function (l) { return st.vals.some(function (v) { return v.TAICHINH_CACKHOANTHU_ID == l.ID; }); });
        var hk = [];
        vals.forEach(function (v) {
            if (!hk.some(function (h) { return h.ID == v.DAOTAO_THOIGIANDAOTAO_ID; })) hk.push({ ID: v.DAOTAO_THOIGIANDAOTAO_ID, TEN: v.DAOTAO_THOIGIANDAOTAO_HOCKY });
        });
        if (!hk.length) { zTable.innerHTML = ui.empty('Chương trình chưa có mức đơn vị phí'); return; }

        pat.pivot({
            el: zTable, rows: hk,
            lead: [{ title: 'Học kỳ', prop: 'TEN', cls: 'is-center is-nowrap' }],
            groups: lk.map(function (l) {
                return { title: l.TEN, id: l.ID, cols: st.kh.map(function (k) { return { title: k.TEN, key: k.ID }; }) };
            }),
            value: function (row, col, g) {
                var rec = recAt(row, col, g);
                return rec ? B.money(rec.TONGSOTIEN === null || rec.TONGSOTIEN === undefined ? 0 : rec.TONGSOTIEN) : '';
            },
            has: function () { return true; },      // ô trống vẫn sửa được (CapNhat theo 4 id)
            onEdit: openEdit, onDelete: remove
        });
    }

    /* Sửa một ô — biểu mẫu NGAY TRONG TRANG, thay chỗ màn (BO-CUC luật 1) */
    function openEdit(row, col, g) {
        var rec = recAt(row, col, g);
        var body = document.createElement('div');
        body.className = 'ums-grid ums-grid--2';
        body.innerHTML =
            ui.field('Học kỳ', '<input class="ums-input" readonly tabindex="-1" value="' + esc(row.TEN) + '">', { inline: true }) +
            ui.field('Khoản thu', '<input class="ums-input" readonly tabindex="-1" value="' + esc(g.title) + '">', { inline: true }) +
            ui.field('Kiểu học', '<input class="ums-input" readonly tabindex="-1" value="' + esc(col.title) + '">', { inline: true }) +
            (rec ? ui.field('Cập nhật', '<input class="ums-input" readonly tabindex="-1" value="' +
                esc(e(rec.NGUOICUOI_TENDAYDU) + ' — ' + e(rec.NGAYCUOI_DD_MM_YYYY)) + '">', { inline: true }) : '') +
            ui.field('Số tiền', '<input class="ums-input" data-g="tien" inputmode="numeric" autocomplete="off">', { inline: true, required: true });
        var inp = body.querySelector('[data-g="tien"]');
        inp.value = rec ? B.money(rec.TONGSOTIEN) : '';
        var dlg = pat.formTrang({
            host: root, title: 'Sửa mức đơn vị phí', body: body,
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function (d) { update(row, col, g, inp, d); return false; } }]
        });
        inp.addEventListener('blur', function () { if (inp.value) inp.value = B.money(B.num(inp.value)); });
        inp.focus();
        inp.select();
        return dlg;
    }

    /* update_MucDonViPhi — arrId = [HocKy, ChuongTrinh, LoaiKhoan, KieuHoc] */
    function update(row, col, g, inp, dlg) {
        var val = B.num(inp.value) || 0;
        ums.api.call({
            action: 'TC_DonViPhi_SoTien/CapNhat',
            versionAPI: 'v1.0',
            strPhamViApDung_Id: st.ctId,
            strPhanCapApDung_Id: '',
            strNgayApDung: '',
            strDaoTao_ThoiGianDaoTao_Id: row.ID,
            dTongSoTien: val,
            strDiem_KieuHoc_Id: col.key,
            strTaiChinh_CacKhoanThu_Id: g.id,
            dKeThua: N.kethua.value,
            strGhiChu: '',
            strNguoiThucHien_Id: ''
        }).then(function () {
            ui.toast('Cập nhật thành công!', 'ok', { timeout: 1500 });
            dlg.close();
            load();
        }).catch(fail('cập nhật'));
    }

    function remove(row, col, g) {
        var rec = recAt(row, col, g);
        // Bản gốc gọi Xoa với strId rỗng khi ô trống — ở đây chỉ báo, không gọi API
        if (!rec) { ui.toast('Ô này chưa có dữ liệu để xoá', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn muốn xóa dữ liệu hệ thống?', { tone: 'bad', ok: 'Xoá', title: 'Xoá dữ liệu' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({ action: 'TC_DonViPhi_SoTien/Xoa', versionAPI: 'v1.0', strId: rec.ID, strNguoiThucHien_Id: '' })
                .then(function () { ui.toast('Xóa thành công!', 'ok'); load(); })
                .catch(fail('xoá'));
        });
    }

    /* --- Biểu mẫu tạo mới --- */
    function drawChon() {
        var host = q('[data-z="chon"]');
        ui.table({
            el: host, rows: st.chon, empty: 'Vui lòng chọn dữ liệu!', tableCls: 'ums-table--lined ums-table--tight',
            columns: [
                { title: 'Tên chương trình', prop: 'TENCHUONGTRINH' },
                { title: 'Mã chương trình', prop: 'MACHUONGTRINH', cls: 'is-center' },
                { title: '', cls: 'is-center', width: '80px', render: function (x, i) { return '<button type="button" class="ums-btn ums-btn--quiet ums-btn--sm" data-do="unpick" data-i="' + i + '">Hủy</button>'; } }
            ]
        });
    }

    function rewrite() {
        N.hk.value = ''; N.tien.value = '';
        jQuery(N.hk).trigger('change.select2');
        jQuery(N.kt).val([]).trigger('change.select2');
        jQuery(N.kh).val([]).trigger('change.select2');
        [N.hk, N.tien, N.kt, N.kh].forEach(function (x) { x.classList.remove('is-invalid'); });
        st.chon = [];
        drawChon();
    }

    function pickCT() {
        var body = document.createElement('div');
        body.innerHTML = '<div class="ums-field"><input class="ums-input" data-g="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div><div data-g="t"></div>';
        var dlg = ui.dialog({ title: 'Tìm kiếm chương trình', icon: 'fa-magnifying-glass', size: 'md', body: body });
        ui.table({
            el: body.querySelector('[data-g="t"]'), rows: st.ct, empty: 'Không có dữ liệu tìm thấy!', tableCls: 'ums-table--tight',
            columns: [
                { title: 'Tên chương trình', prop: 'TENCHUONGTRINH' },
                { title: 'Mã chương trình', prop: 'MACHUONGTRINH', cls: 'is-center' },
                /* Ô đánh dấu thay nút "Chọn" (người dùng 2026-09-27, cùng kiểu NH trungtuyen/danhsach): đánh dấu = thêm, bỏ = gỡ */
                { title: 'Chọn', cls: 'is-center', width: '70px', render: function (x, i) {
                    return '<input type="checkbox" data-pick="' + i + '" title="Chọn"' + (st.chon.some(function (c) { return c.ID === x.ID; }) ? ' checked' : '') + '>';
                } }
            ]
        });
        body.querySelector('[data-g="q"]').addEventListener('input', function () {
            var v = this.value.toLowerCase();
            Array.prototype.forEach.call(body.querySelectorAll('tbody tr'), function (tr) { tr.hidden = v && tr.textContent.toLowerCase().indexOf(v) < 0; });
        });
        body.addEventListener('change', function (ev) {
            var b = ev.target.closest('input[data-pick]');
            if (!b) return;
            var x = st.ct[Number(b.getAttribute('data-pick'))];
            st.chon = st.chon.filter(function (c) { return c.ID !== x.ID; });
            if (b.checked) st.chon.push(x);
            drawChon();
        });
        return dlg;
    }

    function save() {
        var bad = [];
        [[N.hk, 'Học kỳ'], [N.tien, 'Số tiền'], [N.kh, 'Kiểu học'], [N.kt, 'Khoản thu']].forEach(function (p) {
            var v = p[0].multiple ? B.multi(p[0]) : p[0].value.trim();
            var s2 = p[0].nextElementSibling && p[0].nextElementSibling.classList.contains('select2') ? p[0].nextElementSibling : null;
            p[0].classList.toggle('is-invalid', !v);
            if (s2) s2.classList.toggle('is-invalid', !v);
            if (!v) bad.push(p[1]);
        });
        if (bad.length) { ui.toast('Kiểm tra lại: ' + bad.join(', '), 'warn'); return; }
        if (!st.chon.length) { ui.toast('Vui lòng chọn chương trình áp dụng!', 'warn'); return; }
        ums.api.call({
            action: 'TC_DonViPhi_SoTien/ThemMoi',
            versionAPI: 'v1.0',
            strPhamViApDung_Id: st.chon.map(function (c) { return c.ID; }).toString(),
            strPhanCapApDung_Id: '',
            strNgayApDung: '',
            strDaoTao_ThoiGianDaoTao_Id: N.hk.value,
            dTongSoTien: B.num(N.tien.value) || 0,
            strDiem_KieuHoc_Id: B.multi(N.kh),
            strTaiChinh_CacKhoanThu_Id: B.multi(N.kt),
            strGhiChu: '',
            strNguoiThucHien_Id: '',
            dKeThua: N.kethua.value
        }).then(function () {
            ui.swap(zForm, zList);
            ui.toast('Thêm mới thành công!', 'ok');
            load();
        }).catch(fail('thêm mới'));
    }

    /* --- Sự kiện --- */
    root.addEventListener('click', function (ev) {
        var ct = ev.target.closest('[data-ct]');
        if (ct && root.contains(ct)) {
            st.ctId = ct.getAttribute('data-ct');
            st.ctTen = ct.getAttribute('title');
            Array.prototype.forEach.call(root.querySelectorAll('[data-ct]'), function (x) { x.classList.toggle('is-active', x === ct); });
            q('[data-z="ctTen"]').textContent = st.ctTen;
            if (!zForm.hidden) ui.swap(zForm, zList, { top: false });
            load();
            return;
        }
        var b = ev.target.closest('[data-do]');
        if (!b || !root.contains(b)) return;
        var act = b.getAttribute('data-do');
        if (act === 'add') { rewrite(); ui.swap(zList, zForm, { top: false }); }
        else if (act === 'close') ui.swap(zForm, zList, { top: false });
        else if (act === 'rewrite') rewrite();
        else if (act === 'save') save();
        else if (act === 'reload') load();
        else if (act === 'pickCT') pickCT();
        else if (act === 'unpick') { st.chon.splice(Number(b.getAttribute('data-i')), 1); drawChon(); }
        // sửa/xoá một ô: nút của ums.pat.pivot (onEdit/onDelete trong draw)
    });
    N.tien.addEventListener('blur', function () { if (N.tien.value) N.tien.value = B.money(B.num(N.tien.value)); });
    drawChon();
})();
