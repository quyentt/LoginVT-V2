/* =========================================================================
   ums.miengiam.svMienMatrix — khuôn chung của hai màn
       sinhvienmiengiammoi   Sinh viên miễn giảm (mới)       — phần trăm
       sinhviensotienmien    Số tiền miễn giảm của sinh viên — số tiền
   Hai tệp gốc giống nhau từng dòng, chỉ khác action, cột giá trị
   (PHANTRAMMIENGIAM / SOTIEN) và tham số lưu (dPhanTramMienGiam / dSoTien).

   Lưới: dòng = sinh viên của lớp, cột = thời gian do máy chủ trả, ô = mức
   miễn. Sửa trong ô rồi "Cập nhật", hoặc nút sửa cạnh ô → biểu mẫu trong trang.
   "Thêm mới" mở vùng chọn nhiều sinh viên trong lớp, mỗi sinh viên chọn
   chương trình (SV_ChuongTrinhCuaHocVien/LayDanhSach) và đối tượng.

   cfg = { root, title, noun ('phần trăm miễn giảm' | 'số tiền miễn giảm'),
           valueLabel, money, act: { thoiGian, nguoiHoc, list, add, edit, del },
           col (cột giá trị), param (tên tham số), clean(v) → giá trị gửi lên }
   ========================================================================= */
(function () {
    'use strict';

    var M = ums.miengiam, ui = ums.ui, esc = ui.esc, e = M.e;

    M.svMienMatrix = function (cfg) {
        var root = cfg.root;
        var mx = null, dtCot = [];

        root.innerHTML =
            M.head(cfg.title,
                M.btn('update', 'fa-floppy-disk', 'Cập nhật', 'save') +
                M.btn('add', 'fa-plus', 'Thêm mới', 'add')) +
            '<div data-z="list">' +
            '<div class="ums-panel ums-u-mb-4"><div class="ums-panel__body"><div class="ums-filter">' +
                M.filterSelect('he', 'Chọn hệ đào tạo') +
                M.filterSelect('khoa', 'Chọn khoá đào tạo') +
                M.filterSelect('ct', 'Chọn chương trình đào tạo') +
                M.filterSelect('lop', 'Chọn lớp quản lý') +
                M.filterSelect('kt', 'Chọn khoản thu') +
                M.filterSelect('kh', 'Chọn kiểu học') +
                M.filterSelect('tg', 'Chọn học kỳ') +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-act': 'search' } }) + '</div>' +
            '</div></div></div>' +
            '<div class="ums-panel"><div class="ums-panel__head"><div class="ums-panel__title">' +
                '<i class="fa-light fa-list-timeline"></i> Danh sách <span class="ums-u-faint ums-u-fz13" data-z="count"></span></div>' +
                '<div class="ums-panel__tools ums-u-fz13 ums-u-faint">Enter / ↑ ↓ để chuyển ô</div></div>' +
            '<div class="ums-panel__body ums-panel__body--flush" data-z="grid">' +
                ui.empty('Chọn hệ – khoá – chương trình – lớp rồi bấm Tìm kiếm', 'fa-magnifying-glass') + '</div></div>' +
            '</div>' +

            /* --- Vùng thêm sinh viên miễn giảm --- */
            '<div data-z="input" hidden>' +
            '<div class="ums-panel"><div class="ums-panel__head">' +
                '<div class="ums-panel__title"><i class="fa-light fa-user-plus"></i> Thêm sinh viên miễn giảm</div>' +
                '<div class="ums-panel__tools">' +
                    ui.btn('close', { attr: { 'data-act': 'close' } }) +
                    ui.btn('save', { attr: { 'data-act': 'saveNew' } }) +
                '</div></div>' +
            '<div class="ums-panel__body">' +
                '<div class="ums-filter ums-u-mb-4">' +
                    M.filterSelect('nkt', 'Chọn khoản thu') +
                    M.filterSelect('nkh', 'Chọn kiểu học') +
                    M.filterSelect('ntg', 'Chọn thời gian đào tạo') +
                    '<div class="ums-field"><input class="ums-input" data-z="kw" placeholder="Lọc theo mã, tên sinh viên" autocomplete="off"></div>' +
                '</div>' +
                '<div class="ums-row">' +
                    '<label class="ums-field__label ums-u-mb-0">' + esc(cfg.valueLabel) + ' mặc định</label>' +
                    '<input class="ums-input" style="max-width:220px" data-z="def" placeholder="Nhập ' + esc(cfg.valueLabel.toLowerCase()) + ' mặc định" autocomplete="off">' +
                    '<button type="button" class="ums-btn ums-btn--out-primary" data-act="fill"><i class="fa-light ' +
                        (cfg.money ? 'fa-sack-dollar' : 'fa-percent') + '"></i><span>Điền tự động</span></button>' +
                    '<span class="ums-u-faint ums-u-fz13">Chỉ điền vào ô còn trống</span>' +
                '</div>' +
            '</div>' +
            '<div class="ums-panel__body ums-panel__body--flush" data-z="svs"></div></div>' +
            '</div>';

        M.initFilters(root);
        var f = function (k) { return M.fv(root, k); };
        var z = function (k) { return root.querySelector('[data-z="' + k + '"]'); };
        var grid = z('grid');

        M.khoanThu().then(function (r) {
            M.fill(M.f(root, 'kt'), r, { head: 'Chọn khoản thu' });
            M.fill(M.f(root, 'nkt'), r, { head: 'Chọn khoản thu' });
        }).catch(function (err) { ums.api.handle(err, 'khoản thu'); });
        M.kieuHoc().then(function (r) {
            M.fill(M.f(root, 'kh'), r, { head: 'Chọn kiểu học' });
            M.fill(M.f(root, 'nkh'), r, { head: 'Chọn kiểu học' });
        }).catch(function (err) { ums.api.handle(err, 'kiểu học'); });
        M.thoiGian().then(function (r) {
            M.fill(M.f(root, 'tg'), r, { head: 'Chọn học kỳ', name: 'DAOTAO_THOIGIANDAOTAO' });
            M.fill(M.f(root, 'ntg'), r, { head: 'Chọn thời gian đào tạo', name: 'DAOTAO_THOIGIANDAOTAO' });
        }).catch(function (err) { ums.api.handle(err, 'thời gian'); });

        // Bản gốc: chọn lớp thì tìm luôn
        ums.ref.cascade({
            he: M.f(root, 'he'), khoa: M.f(root, 'khoa'), ct: M.f(root, 'ct'), lop: M.f(root, 'lop'),
            labels: { he: 'Chọn hệ đào tạo', khoa: 'Chọn khoá đào tạo', ct: 'Chọn chương trình đào tạo', lop: 'Chọn lớp quản lý' },
            onChange: function (v, level) { if (level === 'lop' && v.lop) search(); }
        });

        function filterParams() {
            return {
                strHeDaoTao_Id: f('he'),
                strKhoaDaoTao_Id: f('khoa'),
                strChuongTrinh_Id: f('ct'),
                strLopQuanLy_Id: f('lop'),
                strDiem_KieuHoc_Id: f('kh'),
                strTaiChinh_CacKhoanThu_Id: f('kt'),
                strDaoTao_ThoiGianDaoTao_Id: f('tg')
            };
        }
        function withF(o) {
            var p = filterParams();
            Object.keys(p).forEach(function (k) { o[k] = p[k]; });
            return o;
        }

        /* ---------- Nạp lưới -------------------------------------------- */
        function search() {
            grid.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return M.rows(withF({ action: cfg.act.thoiGian, method: 'GET', strNguoiThucHien_Id: '' }))
                .then(function (cols) {
                    dtCot = cols;
                    return Promise.all([
                        M.rows(withF({ action: cfg.act.nguoiHoc, method: 'GET', strTuKhoa: '', strNguoiThucHien_Id: '' })),
                        M.rows(withF({
                            action: cfg.act.list, method: 'GET', versionAPI: 'v1.0', strTuKhoa: '',
                            strQLSV_NguoiHoc_Id: '', strQLSV_DoiTuong_Id: '', strNguoiThucHien_Id: '',
                            pageIndex: 1, pageSize: 100000
                        }))
                    ]);
                }).then(function (x) {
                    var svs = x[0];
                    z('count').textContent = '(' + svs.length + ' sinh viên × ' + dtCot.length + ' học kỳ)';
                    mx = M.matrix({
                        el: grid, rows: svs, cols: dtCot, cells: x[1], money: cfg.money,
                        rowKey: function (r) { return r.QLSV_NGUOIHOC_ID; },
                        lead: [
                            { title: 'Mã học viên', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                            { title: 'Họ tên', cls: 'is-nowrap', render: function (r) { return esc(e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN)); } },
                            { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-nowrap' },
                            { title: 'Chương trình', prop: 'DAOTAO_TOCHUCCHUONGTRINH_TEN' },
                            { title: 'Lớp', prop: 'QLSV_NGUOIHOC_LOP', cls: 'is-nowrap' }
                        ],
                        cellKey: function (d) { return { r: d.QLSV_NGUOIHOC_ID, c: d.DAOTAO_THOIGIANDAOTAO_ID }; },
                        value: function (d) { return cfg.money ? M.money(d[cfg.col]) : d[cfg.col]; },
                        onEdit: function (rec) { openEdit(rec); },
                        empty: 'Không có sinh viên'
                    });
                }).catch(function (err) {
                    grid.innerHTML = ui.fail(err.message);
                    ums.api.handle(err, cfg.title);
                });
        }

        function saveCall(o) {
            var c = {
                action: o.strId ? cfg.act.edit : cfg.act.add,
                versionAPI: 'v1.0',
                strId: o.strId || '',
                strDaoTao_ToChucCT_Id: e(o.ct),
                strQLSV_NguoiHoc_Id: o.sv,
                strQLSV_DoiTuong_Id: e(o.dt),
                strDaoTao_ThoiGianDaoTao_Id: o.tg
            };
            c[cfg.param] = cfg.clean(o.value);
            c.strDiem_KieuHoc_Id = o.kh;
            c.strTaiChinh_CacKhoanThu_Id = o.kt;
            c.strNguoiThucHien_Id = '';
            return c;
        }

        /* ---------- Cập nhật các ô đã đổi --------------------------------- */
        function updateAll() {
            if (!mx) { ui.toast('Chưa có dữ liệu — hãy tìm kiếm trước.', 'warn'); return; }
            var list = mx.dirty();
            if (!list.length) { ui.toast('Chưa có hệ số mới nào cần lưu', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn muốn lưu toàn bộ hệ số không? (' + list.length + ' ô đã đổi)', { ok: 'Lưu' }).then(function (yes) {
                if (!yes) return;
                var calls = list.map(function (d) {
                    return saveCall({
                        strId: d.rec ? d.rec.ID : '',
                        // Bản gốc: ô chưa có giá trị thì lấy chương trình đang lọc
                        ct: d.rec && d.old !== '' ? d.rec.DAOTAO_TOCHUCCHUONGTRINH_ID : f('ct'),
                        sv: d.row.QLSV_NGUOIHOC_ID,
                        dt: d.rec ? d.rec.QLSV_DOITUONG_ID : '',
                        tg: d.col.ID,
                        value: d.value,
                        kh: f('kh'),
                        kt: f('kt')
                    });
                });
                return ui.batch(calls, { title: 'Đang lưu ' + cfg.noun, okText: 'Đã lưu' }).then(search);
            });
        }

        /* ---------- Sửa một ô ---------------------------------------------- */
        function openEdit(rec) {
            M.formDialog({
                host: root,
                title: 'Sửa sinh viên - miễn giảm', icon: 'fa-chalkboard-user',
                fields: [
                    { key: 'sv', label: 'Sinh viên', type: 'static' },
                    { key: 'ctt', label: 'Chương trình', type: 'static' },
                    { key: 'kh', label: 'Kiểu học', type: 'select', source: M.kieuHoc },
                    { key: 'kt', label: 'Loại khoản', type: 'select', source: M.khoanThu },
                    { key: 'tg', label: 'Thời gian', type: 'select', source: M.thoiGian, name: 'DAOTAO_THOIGIANDAOTAO' },
                    { key: 'dt', label: 'Đối tượng', type: 'select', source: function () { return ums.api.dm('QLTC.DTMG'); } },
                    { key: 'mm', label: cfg.valueLabel, required: true, numeric: true }
                ],
                values: {
                    sv: e(rec.QLSV_NGUOIHOC_MASO) + ' - ' + e(rec.QLSV_NGUOIHOC_HODEM) + ' ' + e(rec.QLSV_NGUOIHOC_TEN),
                    ctt: rec.DAOTAO_TOCHUCCHUONGTRINH_TEN,
                    kh: rec.KIEUHOC_ID, kt: rec.TAICHINH_CACKHOANTHU_ID, tg: rec.DAOTAO_THOIGIANDAOTAO_ID,
                    dt: rec.QLSV_DOITUONG_ID, mm: cfg.money ? M.money(rec[cfg.col]) : rec[cfg.col]
                },
                onSave: function (v) {
                    return ums.api.call(saveCall({
                        strId: rec.ID, ct: rec.DAOTAO_TOCHUCCHUONGTRINH_ID, sv: rec.QLSV_NGUOIHOC_ID,
                        dt: v.dt, tg: v.tg, value: v.mm, kh: v.kh, kt: v.kt
                    })).then(function () { ui.toast('Cập nhật thành công', 'ok'); search(); });
                },
                onDelete: function () {
                    return ums.api.call({ action: cfg.act.del, versionAPI: 'v1.0', strIds: rec.ID, strNguoiThucHien_Id: '' })
                        .then(function () { ui.toast('Xóa thành công!', 'ok'); search(); });
                }
            });
        }

        /* ---------- Thêm mới: chọn sinh viên trong lớp ------------------- */
        var svList = [];

        function openAdd() {
            if (!f('he') || !f('khoa') || !f('ct') || !f('lop')) {
                ui.toast('Hãy chọn Hệ - Khóa - Chương trình - Lớp trước!', 'warn');
                return;
            }
            ['nkt', 'nkh', 'ntg'].forEach(function (k) { jQuery(M.f(root, k)).val('').trigger('change.select2'); });
            z('kw').value = '';
            z('def').value = '';
            ui.swap(z('list'), z('input'));
            root.querySelector('.ums-page__actions').hidden = true;
            var host = z('svs');
            host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');

            /* Bản gốc truyền pageSize 100000 nhưng edu.system.getList_SinhVien
               bỏ qua và luôn gửi phân trang mặc định (10 dòng) — lớp đông hơn
               10 người thì mất người. Ở đây gửi đúng 100000 như ý bản gốc.
               Lời gọi = ums.ref.sinhVienPage (pkg_hosohocvien.LayDanhSachHoSo),
               cùng procedure và cùng tham số với bản gốc. */
            Promise.all([
                ums.ref.sinhVienPage({ strLopQuanLy_Id: f('lop'), pageIndex: 1, pageSize: 100000 }),
                ums.api.dm('QLTC.DTMG')
            ]).then(function (x) {
                svList = x[0].rows;
                var dtOpts = '<option value="">Chọn đối tượng</option>' + (x[1] || []).map(function (d) {
                    return '<option value="' + esc(d.ID) + '">' + esc(d.TEN) + '</option>';
                }).join('');
                ui.table({
                    el: host, rows: svList, empty: 'Lớp chưa có sinh viên',
                    columns: [
                        { title: 'Mã học viên', prop: 'MASONGUOIHOC', cls: 'is-nowrap' },
                        { title: 'Họ tên', render: function (s) { return esc(e(s.HODEM) + ' ' + e(s.TEN)); } },
                        { title: 'Ngày sinh', cls: 'is-nowrap', render: function (s) { return esc(e(s.NGAYSINH_NGAY) + '/' + e(s.NGAYSINH_THANG) + '/' + e(s.NGAYSINH_NAM)); } },
                        { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN', cls: 'is-nowrap' },
                        { title: 'Chương trình', render: function (s, i) { return '<select class="ums-select ums-input--sm" data-nct="' + i + '"><option value="">Chọn chương trình</option></select>'; } },
                        { title: 'Đối tượng', render: function (s, i) { return '<select class="ums-select ums-input--sm" data-ndt="' + i + '">' + dtOpts + '</select>'; } },
                        { title: cfg.valueLabel, width: '130px', render: function (s, i) { return '<input class="ums-input ums-input--sm" style="text-align:right" data-nv="' + i + '" autocomplete="off">'; } },
                        { head: '<input type="checkbox" data-act="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                          render: function (s, i) { return '<input type="checkbox" data-nck="' + i + '">'; } }
                    ]
                });
                // Chương trình của từng sinh viên — bản gốc gọi một lần cho mỗi người
                M.pool(svList.map(function (s, i) {
                    return function () {
                        return M.rows({ action: 'SV_ChuongTrinhCuaHocVien/LayDanhSach', method: 'GET', versionAPI: 'v1.0', strQLSV_NguoiHoc_Id: s.ID, silent: true })
                            .then(function (cts) {
                                var el = host.querySelector('[data-nct="' + i + '"]');
                                // Bản gốc khai selectOne: true — chỉ một chương trình thì chọn sẵn
                                M.fill(el, cts, {
                                    id: 'DAOTAO_TOCHUCCHUONGTRINH_ID', head: 'Chọn chương trình',
                                    name: function (c) { return e(c.DAOTAO_CHUONGTRINH_MA) + ' ' + e(c.DAOTAO_CHUONGTRINH_TEN); },
                                    value: cts.length === 1 ? cts[0].DAOTAO_TOCHUCCHUONGTRINH_ID : undefined
                                });
                            });
                    };
                }), 4);
            }).catch(function (err) {
                host.innerHTML = ui.fail(err.message);
                ums.api.handle(err, 'danh sách sinh viên');
            });
        }

        function closeAdd() {
            root.querySelector('.ums-page__actions').hidden = false;
            ui.swap(z('input'), z('list'));
        }

        function saveNew() {
            var bad = [];
            [['nkt', 'Khoản thu'], ['nkh', 'Kiểu học'], ['ntg', 'Thời gian']].forEach(function (x) {
                var el = M.f(root, x[0]), wrong = !M.val(el);
                var s2 = el.nextElementSibling;
                if (s2 && s2.classList.contains('select2')) s2.classList.toggle('is-invalid', wrong);
                if (wrong) bad.push(x[1]);
            });
            if (bad.length) { ui.toast('Kiểm tra lại: ' + bad.join(', '), 'warn'); return; }

            ui.confirm('Bạn có chắc chắn muốn lưu toàn bộ ' + cfg.noun + ' không?', { ok: 'Lưu' }).then(function (yes) {
                if (!yes) return;
                var host = z('svs'), calls = [];
                Array.prototype.forEach.call(host.querySelectorAll('[data-nck]:checked'), function (ck) {
                    var i = ck.getAttribute('data-nck');
                    calls.push(saveCall({
                        strId: '',
                        ct: host.querySelector('[data-nct="' + i + '"]').value,
                        sv: svList[i].ID,
                        dt: host.querySelector('[data-ndt="' + i + '"]').value,
                        tg: f('ntg'),
                        value: host.querySelector('[data-nv="' + i + '"]').value.trim(),
                        kh: f('nkh'),
                        kt: f('nkt')
                    }));
                });
                if (!calls.length) { ui.toast('Chưa có hệ số mới nào cần lưu', 'warn'); return; }
                return ui.batch(calls, { title: 'Đang lưu ' + cfg.noun, okText: 'Đã lưu' }).then(function () {
                    closeAdd();
                    search();
                });
            });
        }

        /* ---------- Sự kiện ------------------------------------------------ */
        root.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-act]');
            if (!b || !root.contains(b)) return;
            var act = b.getAttribute('data-act');
            if (act === 'search') search();
            else if (act === 'update') updateAll();
            else if (act === 'add') openAdd();
            else if (act === 'close') closeAdd();
            else if (act === 'saveNew') saveNew();
            else if (act === 'fill') {
                var v = z('def').value.trim();
                Array.prototype.forEach.call(z('svs').querySelectorAll('[data-nv]'), function (x) { if (x.value === '') x.value = v; });
            } else if (act === 'all') {
                Array.prototype.forEach.call(z('svs').querySelectorAll('[data-nck]'), function (x) {
                    if (x.closest('tr').style.display !== 'none') x.checked = b.checked;
                });
            }
        });

        /* Lọc danh sách sinh viên trong vùng thêm mới — lọc trên máy như bản
           gốc, nhưng chỉ xét mã, tên, ngày sinh, lớp (bản gốc xét cả chữ của
           mọi <option> trong dòng nên gõ tên đối tượng là khớp mọi dòng). */
        z('kw').addEventListener('input', function () {
            var q = this.value.toLowerCase();
            Array.prototype.forEach.call(z('svs').querySelectorAll('tbody tr'), function (tr) {
                var t = Array.prototype.slice.call(tr.cells, 0, 5).map(function (c) { return c.textContent; }).join(' ').toLowerCase();
                tr.style.display = t.indexOf(q) >= 0 ? '' : 'none';
            });
        });

        return { search: search };
    };
})();
