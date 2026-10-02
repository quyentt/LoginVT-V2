/* =========================================================================
   ums.miengiam.doiTuongPivot — khuôn chung của hai màn
       dinhmucmiengiam   Định mức miễn giảm   (TC_MucMienGiam,   % miễn giảm, có Kế thừa)
       hesodoituong      Hệ số đối tượng      (TC_DoiTuong_HeSo, hệ số)
   Hai tệp gốc chung một khung, khác action, danh mục đối tượng, cột giá
   trị và vài tham số — đưa vào cfg.

   Bố cục (xem _v2/BO-CUC.md):
       ums.pat.master   hai cột — trái: lọc Hệ/Khoá/Chương trình + danh sách
                        đối tượng (bản gốc là cây jstree nhưng danh mục không
                        có cha → danh sách phẳng); phải: bảng ↔ biểu mẫu thêm.
       ums.pat.pivot    bảng xoay tiêu đề hai tầng:
                            dòng  = đối tượng × học kỳ có dữ liệu
                            cột   = khoản thu có dữ liệu × mọi kiểu học
                        Rê chuột vào ô mới hiện nút sửa / xoá.
       ums.pat.formTrang sửa MỘT ô (qua M.formDialog) — biểu mẫu trong trang, BO-CUC luật 1.
   Thêm mới vẫn là biểu mẫu thay chỗ bảng trong trang, bấm "Tạo mới" mới hiện.

   cfg = {
     root, title, api: 'TC_MucMienGiam' | 'TC_DoiTuong_HeSo',
     dm: 'QLTC.DTMG' | 'QLSV.DOITUONG', col: 'PHANTRAMMIENGIAM' | 'HESO',
     valueLabel, listExtra: { … } (tham số riêng của LayDanhSach),
     addParams(v) → tham số ThemMoi riêng, keThua: true
   }

   Khác bản gốc: bút sửa chỉ hiện ở ô ĐÃ CÓ bản ghi. Bản gốc hiện bút ở mọi
   ô rồi gửi CapNhat cho ô trống (không có bản ghi để sửa), và nút xoá cạnh
   nó gửi strIds "undefined". Thêm ô mới đã có nút "Tạo mới".
   ========================================================================= */
(function () {
    'use strict';

    var M = ums.miengiam, ui = ums.ui, pat = ums.pat, esc = ui.esc;

    M.doiTuongPivot = function (cfg) {
        var root = cfg.root;
        var st = { doiTuong: '', doiTuongTen: '', rows: [], dtDoiTuong: [], dtKhoanThu: [], dtKieuHoc: [], ctRows: [] };

        function fsel(k, label, req, multi) {
            return '<div>' + ui.field(label, '<select class="ums-select" data-f="' + k + '" data-ph="Chọn ' + esc(label.toLowerCase()) + '"' +
                (multi ? ' multiple' : '') + (req ? ' data-required' : '') + '></select>', { required: req }) + '</div>';
        }

        root.innerHTML =
            M.head(cfg.title,
                (cfg.keThua ? M.btn('kethua', 'fa-sitemap', 'Kế thừa', 'out-warn') : '') +
                M.btn('reload', 'fa-rotate-right', 'Tải lại', 'out-primary') +
                M.btn('add', 'fa-plus', 'Tạo mới', 'add')) +
            '<div data-z="mg"></div>' +
            (cfg.keThua ? keThuaHtml() : '');

        /* ---------- Hai cột ------------------------------------------------- */
        var mv = pat.master({
            el: root.querySelector('[data-z="mg"]'),
            side: {
                title: 'Đối tượng miễn giảm', icon: 'fa-folder-open', search: false,
                filter: '<div class="ums-panel__body"><div class="ums-stack ums-stack--tight">' +
                    M.filterSelect('he', 'Chọn hệ đào tạo') +
                    M.filterSelect('khoa', 'Chọn khoá đào tạo') +
                    M.filterSelect('ct', 'Chọn chương trình đào tạo') +
                '</div></div>'
            },
            main: { title: false }
        });

        mv.mainBody.innerHTML =
            '<div class="ums-panel" data-z="list"><div class="ums-panel__head"><div class="ums-panel__title">' +
                '<i class="fa-light fa-table-cells"></i> <span data-z="path">../</span></div></div>' +
                '<div class="ums-panel__body ums-panel__body--flush" data-z="table">' +
                    ui.empty('Vui lòng chọn chương trình hoặc đối tượng để xem dữ liệu!', 'fa-magnifying-glass') + '</div></div>' +
            '<div class="ums-panel" data-z="form" hidden><div class="ums-panel__head">' +
                '<div class="ums-panel__title"><i class="fa-light fa-pen-to-square"></i> Thêm mới ' + esc(cfg.formTitle) + '</div>' +
                '<div class="ums-panel__tools">' +
                    ui.btn('close', { attr: { 'data-act': 'close' } }) +
                    '<button type="button" class="ums-btn ums-btn--ghost" data-act="rewrite"><i class="fa-light fa-eraser"></i><span>Viết lại</span></button>' +
                    ui.btn('save', { attr: { 'data-act': 'save' } }) +
                '</div></div>' +
                '<div class="ums-panel__body"><div class="ums-grid ums-grid--2">' +
                    fsel('hk', 'Học kỳ', true) + fsel('fct', 'Chương trình', true) +
                    fsel('fdt', 'Đối tượng', true) +
                    '<div>' + ui.field(cfg.valueLabel, '<input class="ums-input" data-f="val" placeholder="Nhập hệ số" autocomplete="off">', { required: true }) + '</div>' +
                    fsel('fkt', 'Khoản thu', true, true) + fsel('fkh', 'Kiểu học', true, true) +
                '</div></div></div>';

        function keThuaHtml() {
            return '<div data-z="kt" hidden>' +
                '<div class="ums-panel"><div class="ums-panel__head">' +
                    '<div class="ums-panel__title"><i class="fa-light fa-copy"></i> Kế thừa định mức miễn giảm</div>' +
                    '<div class="ums-panel__tools">' + ui.btn('close', { attr: { 'data-act': 'closeKT' } }) + '</div></div>' +
                '<div class="ums-panel__body"><div class="ums-grid ums-grid--2">' +
                    '<div><div class="ums-legend">1) Nhóm thông tin gốc</div><div class="ums-stack">' +
                        fsel('ehe', 'Hệ đào tạo', true) + fsel('ekhoa', 'Khóa đào tạo', true) + fsel('ect', 'Chương trình', true) +
                        fsel('etg', 'Thời gian') + fsel('ekt', 'Loại khoản') + fsel('ekh', 'Kiểu học') +
                        '<div class="ums-row ums-row--between"><i class="ums-u-faint ums-u-fz13">Chú ý: Nhập đầy đủ thông tin bên trên. Sau đó chọn chương trình</i>' +
                            ui.btn('save', { attr: { 'data-act': 'saveKT' } }) + '</div>' +
                    '</div></div>' +
                    '<div><div class="ums-legend">2) Danh sách cần kế thừa</div><div data-z="ktct"></div></div>' +
                '</div></div></div></div>';
        }

        var f = function (k) { return M.fv(root, k); };
        var F = function (k) { return M.f(root, k); };
        var z = function (k) { return root.querySelector('[data-z="' + k + '"]'); };
        M.initFilters(root);

        /* ---------- Nguồn --------------------------------------------------- */
        var srcKhoanThu = M.khoanThu().then(function (r) {
            st.dtKhoanThu = r;
            M.fill(F('fkt'), r);
            M.fill(F('ekt'), r, { head: 'Chọn loại khoản' });
            return r;
        });
        // Bản gốc hai màn lấy kiểu học qua getList_DanhMucDulieu (dTrangThai rỗng)
        var srcKieuHoc = M.dmdl('KHDT.DIEM.KIEUHOC').then(function (r) {
            st.dtKieuHoc = r;
            M.fill(F('fkh'), r);
            M.fill(F('ekh'), r, { head: 'Chọn kiểu học' });
            return r;
        });
        M.thoiGian().then(function (r) {
            M.fill(F('hk'), r, { head: 'Chọn học kỳ', name: 'DAOTAO_THOIGIANDAOTAO' });
            M.fill(F('etg'), r, { head: 'Chọn học kỳ', name: 'DAOTAO_THOIGIANDAOTAO' });
        }).catch(function (err) { ums.api.handle(err, 'học kỳ'); });
        var srcDoiTuong = M.dmdl(cfg.dm).then(function (r) {
            st.dtDoiTuong = r;
            M.fill(F('fdt'), r, { head: 'Chọn đối tượng' });
            drawDoiTuong();
            return r;
        });
        Promise.all([srcKhoanThu, srcKieuHoc, srcDoiTuong]).catch(function (err) { ums.api.handle(err, cfg.title); });

        function drawDoiTuong() {
            mv.sideBody.innerHTML = st.dtDoiTuong.map(function (d) {
                return '<button type="button" class="ums-master__item' + (d.ID === st.doiTuong ? ' is-active' : '') +
                    '" data-dt="' + esc(d.ID) + '" title="' + esc(d.TEN) + '">' + esc(d.TEN) + '</button>';
            }).join('') || ui.empty('Chưa có đối tượng');
            if (mv.sideCount) mv.sideCount.textContent = st.dtDoiTuong.length ? '(' + st.dtDoiTuong.length + ')' : '';
        }

        /* ---------- Hệ / Khoá / Chương trình ------------------------------- */
        ums.ref.cascade({
            he: F('he'), khoa: F('khoa'), ct: F('ct'),
            labels: { he: 'Chọn hệ đào tạo', khoa: 'Chọn khóa đào tạo', ct: 'Chọn chương trình đào tạo' },
            onChange: function (v, level) {
                if (level === 'he' || level === 'khoa') loadCT();
                if (level === 'ct' && v.ct) {
                    // Bản gốc: chọn chương trình → nạp danh sách và đặt sẵn chương trình cho biểu mẫu
                    jQuery(F('fct')).val(v.ct).trigger('change.select2');
                    load();
                }
                path();
            }
        }).ready.then(loadCT);

        /* Danh sách chương trình theo khoá đang lọc — đổ vào ô Chương trình
           của biểu mẫu và bảng "Danh sách cần kế thừa" (bản gốc dùng chung
           kết quả cbGenCombo_ChuongTrinhDaoTao cho ba chỗ). */
        function loadCT() {
            return ums.ref.chuongTrinh({ strDaoTao_HeDaoTao_Id: f('he'), strKhoaDaoTao_Id: f('khoa'), pageIndex: 1, pageSize: 10000 })
                .then(function (r) {
                    st.ctRows = r;
                    M.fill(F('fct'), r, { head: 'Chọn chương trình', name: 'TENCHUONGTRINH' });
                    if (cfg.keThua) drawKTTable();
                }).catch(function (err) { ums.api.handle(err, 'chương trình'); });
        }

        function path() {
            function t(k) { var el = F(k); return el.value ? el.options[el.selectedIndex].text : '..'; }
            z('path').textContent = (st.doiTuongTen || 'Tất cả đối tượng') + '  —  ' + t('he') + ' / ' + t('khoa') + ' / ' + t('ct');
        }

        /* ---------- Danh sách ------------------------------------------------ */
        function load() {
            var tbl = z('table');
            tbl.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            var call = {
                action: cfg.api + '/LayDanhSach',
                method: 'GET',
                versionAPI: 'v1.0',
                strTuKhoa: '',
                pageIndex: 1,
                pageSize: 10000,
                strPhamViApDung_Id: f('ct'),
                strPhanCapApDung_Id: '',
                strNgayApDung: '',
                strQLSV_DoiTuong_Id: st.doiTuong,
                strDaoTao_ThoiGianDaoTao_Id: '',
                strNguoiThucHien_Id: '',
                strDiem_KieuHoc_Id: '',
                strTaiChinh_CacKhoanThu_Id: ''
            };
            Object.keys(cfg.listExtra || {}).forEach(function (k) { call[k] = cfg.listExtra[k]; });
            return Promise.all([M.rows(call), srcKhoanThu, srcKieuHoc, srcDoiTuong]).then(function (x) {
                st.rows = x[0];
                draw();
            }).catch(function (err) {
                tbl.innerHTML = ui.fail(err.message);
                ums.api.handle(err, cfg.title);
            });
        }

        /* Bảng xoay — theo đúng thuật toán genThead/genTbody của bản gốc, sửa
           hai lỗi hiển thị: tiêu đề nhóm khoản thu lấy nhầm dtKhoanThu[lk]
           thay vì khoản thu có dữ liệu thứ lk; tên chương trình lấy theo chỉ
           số học kỳ trên mảng bản ghi (lệch dòng). */
        function draw() {
            var data = st.rows, kh = st.dtKieuHoc;
            if (!data.length) { z('table').innerHTML = ui.empty('Không có dữ liệu'); return; }

            var lk = st.dtKhoanThu.filter(function (k) {
                return data.some(function (d) { return d.TAICHINH_CACKHOANTHU_ID === k.ID; });
            });

            var rows = [];
            st.dtDoiTuong.forEach(function (dt) {
                var mine = data.filter(function (d) { return d.QLSV_DOITUONG_ID === dt.ID; });
                var hks = [];
                mine.forEach(function (d) {
                    if (!hks.some(function (x) { return x.ID === d.DAOTAO_THOIGIANDAOTAO_ID; })) {
                        hks.push({ ID: d.DAOTAO_THOIGIANDAOTAO_ID, TEN: d.DAOTAO_THOIGIANDAOTAO_HOCKY, rec: d });
                    }
                });
                hks.forEach(function (hk) {
                    // trùng ô thì bản ghi SAU thắng — bản gốc duyệt ngược mảng và lấy bản ghi cuối
                    var cells = {};
                    mine.forEach(function (d) {
                        if (d.DAOTAO_THOIGIANDAOTAO_ID === hk.ID) cells[d.TAICHINH_CACKHOANTHU_ID + '|' + d.KIEUHOC_ID] = d;
                    });
                    rows.push({
                        CT: hk.rec.PHAMVIAPDUNG_TEN, DT: hk.rec.QLSV_DOITUONG_TEN,
                        HK: hk.TEN, hkId: hk.ID, cells: cells
                    });
                });
            });

            pat.pivot({
                el: z('table'),
                rows: rows,
                lead: [
                    { title: 'Chương trình', prop: 'CT', width: '150px' },
                    { title: 'Đối tượng', prop: 'DT', width: '150px' },
                    { title: 'Học kỳ', prop: 'HK', cls: 'is-center is-nowrap' }
                ],
                groups: lk.map(function (k) {
                    return {
                        title: k.TEN,
                        cols: kh.map(function (x) { return { title: x.TEN, key: k.ID + '|' + x.ID, lk: k.ID, kh: x.ID }; })
                    };
                }),
                value: function (row, col) { var rec = row.cells[col.key]; return rec ? M.money(rec[cfg.col]) : ''; },
                has: function (row, col) { return !!row.cells[col.key]; },
                onEdit: editCell,
                onDelete: delCell,
                empty: 'Không có dữ liệu'
            });
        }

        /* Sửa một ô — update_DinhMucMienGiam / update_HeSoDoiTuong của bản
           gốc. Tham số chép nguyên (kể cả dHeSo cho cả hai màn, và KHÔNG gửi
           đối tượng). strDaoTao_HocPhan_Id bản gốc lấy từ phần tử thứ 2 của
           id ô = arrDoiTuong.QLSV_DOITUONG_ID — cột không có trên dòng danh
           mục nên luôn là chuỗi "undefined"; ở đây gửi rỗng. */
        function editCell(row, col, g) {
            var rec = row.cells[col.key];
            if (!rec) return;
            M.formDialog({
                host: root,
                title: 'Sửa ' + cfg.formTitle,
                icon: 'fa-pen-to-square',
                fields: [
                    { key: 'ct', label: 'Chương trình', type: 'static' },
                    { key: 'dt', label: 'Đối tượng', type: 'static' },
                    { key: 'hk', label: 'Học kỳ', type: 'static' },
                    { key: 'kt', label: 'Khoản thu', type: 'static' },
                    { key: 'kh', label: 'Kiểu học', type: 'static' },
                    { key: 'val', label: cfg.valueLabel, required: true, numeric: true }
                ],
                values: { ct: row.CT, dt: row.DT, hk: row.HK, kt: g.title, kh: col.title, val: M.money(rec[cfg.col]) },
                onSave: function (v) {
                    return ums.api.call({
                        action: cfg.api + '/CapNhat',
                        versionAPI: 'v1.0',
                        strPhamViApDung_Id: f('ct'),
                        strPhanCapApDung_Id: '',
                        strNgayApDung: '',
                        strDaoTao_HocPhan_Id: '',
                        strDaoTao_ThoiGianDaoTao_Id: row.hkId,
                        dHeSo: M.num(v.val),
                        strNguoiThucHien_Id: '',
                        strDiem_KieuHoc_Id: col.kh,
                        strTaiChinh_CacKhoanThu_Id: col.lk,
                        strGhiChu: ''
                    }).then(function () { ui.toast('Cập nhật thành công!', 'ok'); load(); });
                },
                onDelete: function () { return xoa(rec); }
            });
        }

        function delCell(row, col) {
            var rec = row.cells[col.key];
            if (!rec) return;
            ui.confirm('Bạn có chắc chắn muốn xóa dữ liệu hệ thống?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                if (!yes) return;
                return xoa(rec);
            }).catch(function (err) { ums.api.handle(err, 'xoá'); });
        }

        function xoa(rec) {
            return ums.api.call({ action: cfg.api + '/Xoa', versionAPI: 'v1.0', strIds: rec.ID, strNguoiThucHien_Id: '' })
                .then(function () { ui.toast('Xóa thành công!', 'ok'); load(); });
        }

        /* ---------- Thêm mới -------------------------------------------------- */
        function rewrite() {
            ['hk', 'fkt', 'fkh'].forEach(function (k) { jQuery(F(k)).val(k === 'hk' ? '' : []).trigger('change.select2'); });
            F('val').value = '';
            root.querySelectorAll('[data-z="form"] .is-invalid').forEach(function (x) { x.classList.remove('is-invalid'); });
        }

        function save() {
            var req = [['hk', 'Học kỳ'], ['fct', 'Chương trình'], ['fdt', 'Đối tượng'], ['val', cfg.valueLabel], ['fkt', 'Khoản thu'], ['fkh', 'Kiểu học']];
            var bad = [];
            req.forEach(function (x) {
                var el = F(x[0]), v = M.val(el);
                var wrong = !v || (x[0] === 'val' && isNaN(Number(M.num(v))));
                el.classList.toggle('is-invalid', wrong);
                var s2 = el.nextElementSibling;
                if (s2 && s2.classList.contains('select2')) s2.classList.toggle('is-invalid', wrong);
                if (wrong) bad.push(x[1]);
            });
            if (bad.length) { ui.toast('Kiểm tra lại: ' + bad.join(', '), 'warn'); return; }

            var call = {
                action: cfg.api + '/ThemMoi',
                versionAPI: 'v1.0',
                strPhamViApDung_Id: f('fct'),
                strPhanCapApDung_Id: '',
                strNgayApDung: '',
                strQLSV_DoiTuong_Id: f('fdt'),
                strDaoTao_ThoiGianDaoTao_Id: f('hk'),
                strNguoiThucHien_Id: '',
                strDiem_KieuHoc_Id: f('fkh'),
                strTaiChinh_CacKhoanThu_Id: f('fkt'),
                strId: ''
            };
            var extra = cfg.addParams(M.num(f('val')));
            Object.keys(extra).forEach(function (k) { call[k] = extra[k]; });

            var btn = root.querySelector('[data-act="save"]');
            btn.disabled = true;
            ums.api.call(call).then(function () {
                ui.toast('Thêm mới thành công!', 'ok');
                closeForm();
                load();
            }).catch(function (err) { ums.api.handle(err, 'thêm mới'); })
                .then(function () { btn.disabled = false; });
        }

        /* Mở biểu mẫu thì ẨN cụm nút đầu trang ("Tạo mới") — đúng bố cục chung,
           lúc đó chỉ còn việc Lưu / Đóng. Khung "Kế thừa" ở dưới đã làm vậy
           từ đầu, riêng biểu mẫu này bỏ sót nên màn hình có hai nút thêm cùng lúc. */
        function capNhatActions(dangMo) {
            var a = root.querySelector('.ums-page__actions');
            if (a) a.hidden = !!dangMo;
        }

        function openForm() {
            rewrite();
            if (st.doiTuong) jQuery(F('fdt')).val(st.doiTuong).trigger('change.select2');
            capNhatActions(true);
            ui.swap(z('list'), z('form'));
        }
        function closeForm() { capNhatActions(false); ui.swap(z('form'), z('list')); }

        /* ---------- Kế thừa (chỉ Định mức miễn giảm) --------------------------- */
        if (cfg.keThua) {
            ums.ref.cascade({
                he: F('ehe'), khoa: F('ekhoa'), ct: F('ect'),
                labels: { he: 'Chọn hệ đào tạo', khoa: 'Chọn khóa đào tạo', ct: 'Chọn chương trình đào tạo' }
            });
        }

        function drawKTTable() {
            ui.table({
                el: z('ktct'), rows: st.ctRows, empty: 'Chưa có chương trình — chọn Hệ, Khoá ở cột lọc',
                columns: [
                    { title: 'Mã chương trình', prop: 'MACHUONGTRINH', cls: 'is-nowrap' },
                    { title: 'Tên chương trình', prop: 'TENCHUONGTRINH' },
                    { head: '<input type="checkbox" data-act="ktall" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                      render: function (r) { return '<input type="checkbox" data-ktck="' + esc(r.ID) + '">'; } }
                ]
            });
        }

        function saveKT() {
            if (!f('ect')) { ui.toast('Hãy chọn chương trình!', 'warn'); return; }
            var ids = Array.prototype.map.call(z('ktct').querySelectorAll('[data-ktck]:checked'), function (x) { return x.getAttribute('data-ktck'); });
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn muốn kế thừa dữ liệu không?', { ok: 'Kế thừa' }).then(function (yes) {
                if (!yes) return;
                return ui.batch(ids.map(function (id) {
                    return {
                        action: cfg.api + '/KeThua',
                        versionAPI: 'v1.0',
                        strChuongTrinh_Goc_Id: f('ect'),
                        strChuongTrinh_CanKeThua_Ids: id,
                        strNgayApDung: '',
                        strDaoTao_ThoiGianDaoTao_Id: f('etg'),
                        strDiem_KieuHoc_Id: f('ekh'),
                        strTaiChinh_CacKhoanThu_Id: f('ekt'),
                        strNguoiThucHien_Id: ''
                    };
                }), { title: 'Đang kế thừa', okText: 'Đã kế thừa' });
            });
        }

        /* ---------- Sự kiện ---------------------------------------------------- */
        var actions = root.querySelector('.ums-page__actions');
        root.addEventListener('click', function (ev) {
            var dtb = ev.target.closest('[data-dt]');
            if (dtb) {
                st.doiTuong = dtb.getAttribute('data-dt');
                st.doiTuongTen = dtb.getAttribute('title');
                drawDoiTuong();
                jQuery(F('fdt')).val(st.doiTuong).trigger('change.select2');
                path();
                load();
                return;
            }
            var b = ev.target.closest('[data-act]');
            if (!b || !root.contains(b)) return;
            var act = b.getAttribute('data-act');
            if (act === 'reload') load();
            else if (act === 'add') openForm();
            else if (act === 'close') closeForm();
            else if (act === 'rewrite') rewrite();
            else if (act === 'save') save();
            else if (act === 'kethua') {
                if (!f('he') || !f('khoa')) { ui.toast('Hãy chọn Hệ - Khóa trước!', 'warn'); return; }
                actions.hidden = true;
                ui.swap(z('mg'), z('kt'));
            } else if (act === 'closeKT') { actions.hidden = false; ui.swap(z('kt'), z('mg')); }
            else if (act === 'saveKT') saveKT();
            else if (act === 'ktall') {
                z('ktct').querySelectorAll('[data-ktck]').forEach(function (x) { x.checked = b.checked; });
            }
        });

        path();
    };
})();
