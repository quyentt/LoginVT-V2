/* =========================================================================
   Dùng chung cho nhóm màn TRA CỨU / IMPORT của Tài chính
   (phieuthu: gachnotructiep, import_*, sinhviennotien, tracuusophieuthu;
    bienlai: tracuusobienlai; tracuu: tracuuthongtinnoptienvnpay)
   ---------------------------------------------------------------------------
   Đặt ở ums.tcTraCuu (không dùng ums.phieuthu — người chuyển thutien/
   viewthutien có thể dùng tên đó cho _chung.js của họ).

   ums.tcTraCuu.bangChu(n)            = ums.ui.docSo (tầng chung, thư viện
                                        n2vi nạp sẵn ở assets/vendor/n2vi)
   ums.tcTraCuu.xorB64(chuoi, khoa)   = edu.system.atob (Core/systemroot.js:9409)
   ums.tcTraCuu.fill(el, rows, o)     nạp <select>
   ums.tcTraCuu.rows(r)               mảng dòng từ kết quả ums.api.call
   ums.tcTraCuu.progress(title)       hộp tiến độ tự điều khiển (tải nhiều trang)
   ums.tcTraCuu.importScreen(root, cfg)  khung chung của 4 màn import_*
   ums.tcTraCuu.soPhieuScreen(root, cfg) khung chung tracuusophieuthu / tracuusobienlai
   ums.tcTraCuu.phieu.render(host, id, kind)  xem phiếu thu / biên lai — đi qua
                                        ums.phieu.viewer (tầng chung)
   ========================================================================= */
(function (global) {
    'use strict';

    var ums = global.ums;
    var ui = ums.ui;
    var esc = ui.esc;
    var T = ums.tcTraCuu = ums.tcTraCuu || {};
    var seq = 0;

    /** "Một triệu ... đồng." — đọc số thành chữ ở tầng chung (ums.ui.docSo,
        thư viện n2vi nạp sẵn); các mẫu phiếu gốc viết hoa chữ đầu, thêm dấu chấm */
    T.bangChu = function (n) { return ui.docSo(n); };

    /* ---------------------------------------------------------------------
       edu.system.atob(r, e): XOR từng ký tự với khoá rồi base64
       --------------------------------------------------------------------- */
    T.xorB64 = function (chuoi, khoa) { return ums.util.xorB64(chuoi, khoa); };   // tầng chung: api.js

    /* ---------------------------------------------------------------------
       Tiện ích nhỏ
       --------------------------------------------------------------------- */
    T.rows = function (r) {
        var d = r && r.data;
        return Array.isArray(d) ? d : (d && d.rs) || [];
    };

    /** Nạp <select>. o = { id, name (chuỗi | hàm), head (false = không có dòng đầu),
        attrs(row) → { tên: giá trị }, keep: true (giữ lựa chọn cũ) } */
    T.fill = function (el, rows, o) {
        if (!el) return;
        o = o || {};
        var id = o.id || 'ID', name = o.name || 'TEN';
        var keep = el.multiple ? null : el.value;
        var h = o.head === false ? '' : '<option value="">' + esc(o.head || '-- Chọn --') + '</option>';
        (rows || []).forEach(function (r) {
            var a = o.attrs ? o.attrs(r) : null;
            var extra = a ? Object.keys(a).map(function (k) { return ' ' + k + '="' + esc(a[k]) + '"'; }).join('') : '';
            h += '<option value="' + esc(r[id]) + '"' + extra + '>' +
                esc(typeof name === 'function' ? name(r) : r[name]) + '</option>';
        });
        el.innerHTML = h;
        if (keep && o.keep !== false && (rows || []).some(function (r) { return String(r[id]) === keep; })) el.value = keep;
        if (global.jQuery) jQuery(el).trigger('change.select2');
    };

    /** Giá trị ô chọn nhiều nối bằng dấu phẩy — = edu.util.getValCombo */
    T.multi = function (el) {
        if (!el) return '';
        return Array.prototype.filter.call(el.options, function (o) { return o.selected && o.value; })
            .map(function (o) { return o.value; }).join(',');
    };

    T.selText = function (el) {
        if (!el || !el.value) return '';
        var o = el.options[el.selectedIndex];
        return o ? o.textContent : '';
    };

    /** Hộp tiến độ tự điều khiển — thay edu.system.genHTML_Progress khi số
        bước chưa biết trước (tải danh sách nhiều trang). */
    T.progress = function (title) {
        var dlg = ui.dialog({
            title: title || 'Đang xử lý', icon: 'fa-spinner fa-spin', size: 'sm',
            body: '<div class="ums-u-fz13 ums-u-muted ums-u-mb-2" data-p="lbl">…</div>' +
                  '<div class="ums-meter"><div class="ums-meter__track"><div class="ums-meter__fill" data-p="bar" style="width:0"></div></div></div>'
        });
        var bar = dlg.body.querySelector('[data-p="bar"]');
        var lbl = dlg.body.querySelector('[data-p="lbl"]');
        return {
            set: function (done, total, text) {
                bar.style.width = (total ? Math.round(done / total * 100) : 0) + '%';
                lbl.textContent = text || (done + ' / ' + total);
            },
            close: function () { dlg.close(); }
        };
    };

    /** Bảng tự dựng cột theo khoá của dòng đầu (genTable_Import_View gốc).
        filterNull: bỏ cột rỗng ở mọi dòng (chỉ bản import_danop có). */
    T.dynTable = function (host, rows, filterNull, empty) {
        if (!rows || !rows.length) { host.innerHTML = ui.empty(empty || 'Không có dữ liệu'); return; }
        var keys = Object.keys(rows[0]);
        if (filterNull) {
            keys = keys.filter(function (k) {
                return rows.some(function (r) { var v = r[k]; return v !== null && v !== undefined && String(v).trim() !== ''; });
            });
        }
        ui.table({
            el: host, rows: rows, stt: false,
            columns: keys.map(function (k) { return { title: k, prop: k, cls: 'is-nowrap' }; })
        });
    };

    /** Cột ô đánh dấu + ô "chọn tất cả" cho ums.ui.table */
    T.pickCol = function (tag, titleFn) {
        return {
            head: '<input type="checkbox" data-pickall="' + tag + '" title="Chọn tất cả">',
            cls: 'is-center', width: '44px',
            render: function (r, i) {
                return '<input type="checkbox" data-pick="' + tag + '" data-i="' + i + '"' +
                    (titleFn ? ' title="' + esc(titleFn(r)) + '"' : '') + '>';
            }
        };
    };

    /** Gắn một lần trên root: bấm "chọn tất cả" thì đánh dấu cả bảng */
    T.bindPick = function (root) {
        root.addEventListener('change', function (e) {
            var t = e.target;
            if (t.matches && t.matches('[data-pickall]')) {
                var tag = t.getAttribute('data-pickall');
                root.querySelectorAll('[data-pick="' + tag + '"]').forEach(function (x) { x.checked = t.checked; });
            }
        });
    };

    T.picked = function (root, tag, rows) {
        return Array.prototype.map.call(root.querySelectorAll('[data-pick="' + tag + '"]:checked'), function (x) {
            return rows[Number(x.getAttribute('data-i'))];
        }).filter(Boolean);
    };

    function field(label, control, opts) { return ui.field(label, control, opts); }
    function sel(k, head, multi) {
        return '<select class="ums-select" data-k="' + k + '"' + (multi ? ' multiple' : '') + '>' +
            (multi ? '' : '<option value="">' + esc(head || '') + '</option>') + '</select>';
    }
    T.sel = sel;

    function badge(k) { return ' <span class="ums-badge ums-badge--mute" data-cnt="' + k + '" hidden></span>'; }

    function setCnt(root, k, n) {
        var b = root.querySelector('[data-cnt="' + k + '"]');
        if (!b) return;
        b.hidden = n === '' || n === null || n === undefined;
        b.textContent = n;
    }
    T.setCnt = setCnt;

    /* =====================================================================
       KHUNG CHUNG 4 MÀN IMPORT (import_danop / import_phainop /
       import_sotienmiengiam / import_phantrammiengiam)
       ---------------------------------------------------------------------
       Tệp Excel KHÔNG đọc ở trình duyệt: bản gốc tải tệp lên máy chủ
       (edu.system.uploadImport → ums.upload), rồi gọi
       SYS_Import/getDataFormFileImport(strPath) để máy chủ đọc; kết quả là
       Id = tên các sheet nối bằng "$", Data = { Table1: [...], Table2: … }.

       cfg = {
           title, bang: { dm } | null, kieuHoc: bool, ngayLabel,
           calls: { list(v), list5(v) | null, maThongTin(v), import(v), xoa(id), chuyen(id, v) },
           cols1, cols3, cols5, tip(row) (tiêu đề ô đánh dấu, dùng làm tiền tố lỗi),
           resetBeforeImport, filterNullCols, clearThatBaiOnView, xoaReload5,
           exportLoi(rows) | null
       }
       v = giá trị hiện tại của mọi ô (xem values()).
       ===================================================================== */
    T.importScreen = function (root, cfg) {
        if (!root) return;   /* người dùng đã sang màn khác trước khi tệp màn nạp xong — không còn chỗ để dựng (kiểm host 29/9) */
        var st = { path: '', data: null, p1: 1, p5: 1, size: 10, rows1: [], rows5: [], loi: [], mau: [] };
        var has5 = !!cfg.calls.list5;
        var tabs = [
            ['1', 'Đã import, chưa hạch toán'],
            ['2', 'Chuẩn bị import (đọc từ Excel)'],
            ['3', 'Import thành công'],
            ['4', 'Import lỗi']
        ];
        if (has5) tabs.push(['5', 'Đã import và đã hạch toán']);

        var h = '<div class="ums-page__head"><h1 class="ums-page__title ums-u-mb-0">' + esc(cfg.title) + '</h1></div>';

        h += '<div class="ums-grid ums-grid--2 ums-u-mb-4">';
        /* --- Chọn tệp --- */
        h += '<div><div class="ums-panel"><div class="ums-panel__head"><div class="ums-panel__title">' +
            '<i class="fa-light fa-file-import"></i> Chọn tệp import</div></div><div class="ums-panel__body"><div class="ums-stack">';
        if (cfg.bang) h += field('Bảng dữ liệu', sel('bang', 'Chọn bảng dữ liệu'));
        /* Màu và biểu tượng ba nút này lấy đúng bản gốc (import_danop.html:54/64/75):
           Tải tệp mẫu = btn-primary + file-import, Đọc dữ liệu = btn-success + book,
           Hiển thị dữ liệu = btn-warning + file-pdf. */
        h += field('Mẫu import', '<div class="ums-row"><div class="ums-u-flex1">' + sel('mau', 'Chọn mẫu import') + '</div>' +
            ui.btn('excel', { text: 'Tải tệp mẫu', mod: 'primary', icon: 'fa-file-import', attr: { 'data-a': 'taimau' } }) + '</div>');
        h += field('Tệp Excel', '<div class="ums-row"><div class="ums-u-flex1">' +
            ui.file({ key: 'file', accept: '.xls,.xlsx', empty: 'Chưa chọn tệp Excel' }) + '</div>' +
            ui.btn('search', { text: 'Đọc dữ liệu', mod: 'save', icon: 'fa-book', attr: { 'data-a': 'doc' } }) + '</div>' +
            '<div class="ums-field__hint" data-k="fileinfo">Chọn tệp — tệp được tải lên máy chủ ngay khi chọn.</div>');
        h += field('Sheet', '<div class="ums-row"><div class="ums-u-flex1">' + sel('sheet', '-- Chọn sheet dữ liệu để import --') + '</div>' +
            ui.btn('search', { text: 'Hiển thị dữ liệu', mod: 'warn', icon: 'fa-file-pdf', attr: { 'data-a': 'xem' } }) + '</div>');
        h += '<div class="ums-u-fz13 ums-u-muted">1. Chọn mẫu và tệp Excel · 2. Đọc dữ liệu · 3. Chọn sheet · ' +
            '4. Hiển thị dữ liệu · 5. Sang thẻ "Chuẩn bị import" bấm Thực hiện import.</div>';
        h += '</div></div></div></div>';

        /* --- Thông tin bổ sung --- */
        h += '<div><div class="ums-panel"><div class="ums-panel__head"><div class="ums-panel__title">' +
            '<i class="fa-light fa-circle-info"></i> Thông tin bổ sung</div></div><div class="ums-panel__body">' +
            '<div class="ums-grid ums-grid--2">' +
            field('Học kỳ', sel('hocKy', 'Chọn học kỳ'), { required: true }) +
            field('Loại khoản', sel('loaiKhoan', 'Chọn loại khoản'), { required: true }) +
            field('Chuyển kế toán', '<select class="ums-select" data-k="chuyenKT"><option value="0">Không</option><option value="1">Có</option></select>') +
            field('Loại kiểm tra', '<select class="ums-select" data-k="kiemTra"><option value="1">Chỉ mã sinh viên</option><option value="0">Mã sinh viên và họ tên</option></select>') +
            (cfg.kieuHoc ? field('Kiểu học', sel('kieuHoc', 'Chọn kiểu học')) : '') +
            field(cfg.ngayLabel || 'Ngày giao dịch', '<div class="ums-inputwrap"><input class="ums-input" data-k="ngay" placeholder="dd/mm/yyyy" autocomplete="off"><i class="fa-light fa-calendar"></i></div>') +
            '<div style="grid-column:1 / -1">' + field('Mã đợt import', '<input class="ums-input" data-k="maDot" autocomplete="off" placeholder="Chuỗi không dấu bất kỳ để phân biệt các đợt import">') + '</div>' +
            '</div></div></div></div>';
        h += '</div>';

        /* --- Các thẻ --- */
        h += '<div class="ums-panel"><nav class="ums-tabs">' + tabs.map(function (t, i) {
            return '<a class="ums-tabs__item' + (i ? '' : ' is-active') + '" href="javascript:void(0)" data-tab="' + t[0] + '">' +
                t[0] + ') ' + esc(t[1]) + badge(t[0]) + '</a>';
        }).join('') + '</nav>';

        // Thẻ 1
        h += '<div data-pane="1"><div class="ums-panel__body"><div class="ums-filter">' +
            '<div class="ums-field">' + sel('fHocKy', 'Tất cả học kỳ') + '</div>' +
            '<div class="ums-field">' + sel('fLoaiKhoan', 'Tất cả loại khoản') + '</div>' +
            '<div class="ums-field">' + sel('fMaDot', 'Tất cả mã đợt import') + '</div>' +
            (cfg.kieuHoc ? '<div class="ums-field">' + sel('fKieuHoc', 'Tất cả kiểu học') + '</div>' : '') +
            '<div class="ums-field"><input class="ums-input" data-k="fTuKhoa" placeholder="Nhập từ khoá tìm kiếm" autocomplete="off"></div>' +
            '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'tim1' } }) + '</div></div>' +
            '<div class="ums-row ums-row--end ums-u-mt-4">' +
            '<button type="button" class="ums-btn ums-btn--primary" data-a="chuyen1"><i class="fa-light fa-share-from-square"></i><span>Chuyển kế toán</span></button>' +
            ui.btn('reload', { attr: { 'data-a': 'tim1' } }) +
            ui.xoaChon('input[data-pick="p1"]', { goc: '[data-pane]', attr: { 'data-a': 'xoa1' } }) +
            '</div></div><div class="ums-panel__body ums-panel__body--flush" data-z="t1"></div></div>';

        // Thẻ 2
        h += '<div data-pane="2" hidden><div class="ums-panel__body"><div class="ums-row ums-row--end">' +
            '<button type="button" class="ums-btn ums-btn--primary" data-a="import"><i class="fa-light fa-file-import"></i><span>Thực hiện import dữ liệu</span></button>' +
            '</div></div><div class="ums-panel__body ums-panel__body--flush" data-z="t2">' + ui.empty('Chưa đọc dữ liệu từ tệp Excel', 'fa-file-excel') + '</div></div>';
        // Thẻ 3
        h += '<div data-pane="3" hidden><div class="ums-panel__body ums-panel__body--flush" data-z="t3">' + ui.empty('Chưa thực hiện import') + '</div></div>';
        // Thẻ 4
        h += '<div data-pane="4" hidden>' + (cfg.exportLoi ? '<div class="ums-panel__body"><div class="ums-row ums-row--end">' +
            ui.btn('excel', { text: 'Tải tệp lỗi', attr: { 'data-a': 'xuatloi' } }) + '</div></div>' : '') +
            '<div class="ums-panel__body ums-panel__body--flush" data-z="t4">' + ui.empty('Không có dòng lỗi') + '</div></div>';
        // Thẻ 5
        if (has5) {
            h += '<div data-pane="5" hidden><div class="ums-panel__body"><div class="ums-filter">' +
                '<div class="ums-field"><input class="ums-input" data-k="f5TuKhoa" placeholder="Gõ mã sinh viên để tìm kiếm" autocomplete="off"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'tim5' } }) + '</div>' +
                '<div class="ums-field ums-field--fit"><div class="ums-row">' +
                ui.btn('reload', { attr: { 'data-a': 'tim5' } }) +
                ui.xoaChon('input[data-pick="p5"]', { goc: '[data-pane]', attr: { 'data-a': 'xoa5' } }) +
                '</div></div></div></div><div class="ums-panel__body ums-panel__body--flush" data-z="t5">' +
                ui.empty('Bấm Tìm kiếm để tải danh sách') + '</div></div>';
        }
        h += '</div>';

        root.innerHTML = h;

        function q(s) { return root.querySelector(s); }
        function k(name) { return q('[data-k="' + name + '"]'); }
        function z(name) { return q('[data-z="' + name + '"]'); }
        function val(name) { var e = k(name); return e ? (e.value || '').trim() : ''; }

        Array.prototype.forEach.call(root.querySelectorAll('select.ums-select'), function (e) {
            ui.select2(e, { placeholder: e.options[0] ? e.options[0].textContent : '-- Chọn --', allowClear: false });
        });
        ui.datepicker(k('ngay'));
        T.bindPick(root);

        /* ---------- Giá trị hiện tại ---------- */
        function values() {
            var mau = k('mau');
            var opt = mau && mau.value ? mau.options[mau.selectedIndex] : null;
            var chiSo = opt ? opt.getAttribute('data-chiso') : undefined;
            return {
                path: st.path,
                bang: val('bang'),
                mau: val('mau'),
                // Bản gốc: attr("title") của option — undefined thì "0", null thì chuỗi "null"
                chiSo: chiSo === null || chiSo === undefined ? '0' : chiSo,
                sheetName: T.selText(k('sheet')),
                hocKy: val('hocKy'), loaiKhoan: val('loaiKhoan'), chuyenKT: val('chuyenKT'),
                kiemTra: val('kiemTra'), kieuHoc: val('kieuHoc'), ngay: val('ngay'), maDot: val('maDot'),
                fHocKy: val('fHocKy'), fLoaiKhoan: val('fLoaiKhoan'), fMaDot: val('fMaDot'),
                fKieuHoc: val('fKieuHoc'), fTuKhoa: val('fTuKhoa'), f5TuKhoa: val('f5TuKhoa'),
                p1: st.p1, p5: st.p5, size: st.size
            };
        }

        /* ---------- Thẻ ---------- */
        function tab(n) {
            root.querySelectorAll('.ums-tabs__item').forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('data-tab') === String(n)); });
            root.querySelectorAll('[data-pane]').forEach(function (p) { p.hidden = p.getAttribute('data-pane') !== String(n); });
        }

        /* ---------- Nguồn ô chọn ---------- */
        function warnMsg(r, what) {
            // Bản gốc: có Message là báo và dừng, không nạp ô chọn
            if (r.message) { ui.toast(r.message, 'warn'); return true; }
            return false;
        }

        ums.ref.thoiGianDaoTao({ strNam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 })
            .then(function (rows) {
                T.fill(k('fHocKy'), rows, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Tất cả học kỳ' });
                T.fill(k('hocKy'), rows, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn học kỳ' });
            }).catch(function (e) { ums.api.handle(e, 'học kỳ'); });

        ums.api.call({
            action: 'TC_KhoanThu/LayDanhSach', method: 'GET', silent: true, versionAPI: 'v1.0',
            strTuKhoa: '', strNhomCacKhoanThu_Id: '', strNguoiTao_Id: '', strcanboquanly_id: '',
            pageIndex: 1, pageSize: 10000, strNguoiThucHien_Id: ''
        }).then(function (r) {
            if (warnMsg(r)) return;
            var rows = T.rows(r);
            T.fill(k('fLoaiKhoan'), rows, { head: 'Tất cả loại khoản' });
            T.fill(k('loaiKhoan'), rows, { head: 'Chọn loại khoản' });
        }).catch(function (e) { ums.api.handle(e, 'khoản thu'); });

        ums.api.call({
            action: 'SYS_Import_PhanQuyen/LayDanhSach', method: 'GET', silent: true, versionAPI: 'v1.0',
            strTuKhoa: '', strNguoiTao_Id: '',
            strUngDung_Id: (ums.state && ums.state.roleId) || (ums.session && ums.session.appId) || '',
            strChucNang_Id: (ums.state && ums.state.chucNangId) || '',
            strNguoiDung_Id: (ums.session && ums.session.userId) || '',
            strMauImport_Id: '', pageIndex: 1, pageSize: 100000
        }).then(function (r) {
            if (warnMsg(r)) return;
            st.mau = T.rows(r);
            T.fill(k('mau'), st.mau, {
                id: 'MAUIMPORT_MA', name: 'MAUIMPORT_TENFILEMAU', head: 'Chọn mẫu import',
                attrs: function (x) {
                    return { 'data-url': x.MAUIMPORT_DUONGDANFILEMAU == null ? '' : x.MAUIMPORT_DUONGDANFILEMAU,
                             'data-chiso': x.CHISODONGDOCDULIEUTUFILE === null || x.CHISODONGDOCDULIEUTUFILE === undefined ? 'null' : x.CHISODONGDOCDULIEUTUFILE };
                }
            });
        }).catch(function (e) { ums.api.handle(e, 'mẫu import'); });

        if (cfg.kieuHoc) {
            ums.api.call({ action: 'CM_DanhMucDuLieu/LayDanhSach', method: 'GET', silent: true, versionAPI: 'v1.0', strMaBangDanhMuc: 'KHDT.DIEM.KIEUHOC' })
                .then(function (r) {
                    var rows = T.rows(r);
                    T.fill(k('kieuHoc'), rows, { head: 'Chọn kiểu học' });
                    T.fill(k('fKieuHoc'), rows, { head: 'Tất cả kiểu học' });
                }).catch(function (e) { ums.api.handle(e, 'kiểu học'); });
        }

        function loadMaDot() {
            ums.api.call(Object.assign({ method: 'GET', silent: true }, cfg.calls.maThongTin(values())))
                .then(function (r) {
                    if (warnMsg(r)) return;
                    T.fill(k('fMaDot'), T.rows(r), { head: 'Tất cả mã đợt import' });
                }).catch(function (e) { ums.api.handle(e, 'mã đợt import'); });
        }

        /* Bảng dữ liệu (loadToCombo_DanhMucDuLieu không truyền tiêu đề):
           dòng có THONGTIN8 = "CHON" được chọn sẵn; danh mục không có
           CHUNG_TENDANHMUC_TEN thì không có dòng trống, tức dòng đầu được chọn. */
        var ready = Promise.resolve();
        if (cfg.bang) {
            ready = ums.api.dm(cfg.bang.dm).then(function (rows) {
                var el = k('bang');
                var noHead = rows.length && !rows[0].CHUNG_TENDANHMUC_TEN;
                T.fill(el, rows, { head: noHead ? false : 'Chọn ' + String(rows[0] && rows[0].CHUNG_TENDANHMUC_TEN || 'bảng dữ liệu').toLowerCase() });
                var chon = rows.filter(function (r) { return r.THONGTIN8 === 'CHON'; })[0];
                if (chon) { el.value = chon.ID; if (global.jQuery) jQuery(el).trigger('change.select2'); }
            }).catch(function (e) { ums.api.handle(e, 'bảng dữ liệu'); });
        }

        /* ---------- Danh sách thẻ 1 / thẻ 5 ---------- */
        function checkTitle(r) { return cfg.tip ? cfg.tip(r) : ''; }

        function drawList(n, rows, total) {
            var paged = { index: n === 1 ? st.p1 : st.p5, size: st.size, total: total, onChange: function (p) {
                if (p < 1 || p > Math.ceil(total / st.size)) return;
                if (n === 1) load1(p); else load5(p);
            } };
            ui.table({
                el: z('t' + n), rows: rows, page: paged,
                columns: (n === 1 ? cfg.cols1 : cfg.cols5).concat([T.pickCol('p' + n, checkTitle)])
            });
            setCnt(root, String(n), total);
        }

        function loadList(n, page) {
            if (page) { if (n === 1) st.p1 = page; else st.p5 = page; }
            var v = values();
            var call = n === 1 ? cfg.calls.list(v) : cfg.calls.list5(v);
            call.method = 'GET';
            call.pageIndex = n === 1 ? st.p1 : st.p5;
            call.pageSize = st.size;
            var host = z('t' + n);
            host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return ums.api.call(call).then(function (r) {
                var rows = T.rows(r);
                if (n === 1) st.rows1 = rows; else st.rows5 = rows;
                drawList(n, rows, rows.length ? (Number(r.pager) || rows.length) : 0);
            }).catch(function (e) {
                host.innerHTML = ui.fail(e.message);
                ums.api.handle(e, 'danh sách');
            });
        }
        function load1(p) { return loadList(1, p); }
        function load5(p) { return loadList(5, p); }

        /* ---------- Chuyển kế toán / Xoá (edu.util.ActionInCheckedIds) ---------- */
        function act(n, what) {
            var rows = T.picked(root, 'p' + n, n === 1 ? st.rows1 : st.rows5);
            var label = what === 'xoa' ? 'xoá' : 'chuyển kế toán';
            if (!rows.length) { ui.toast('Vui lòng chọn dữ liệu ' + label + '.', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn muốn ' + label + ' ' + rows.length + ' dữ liệu không?',
                { tone: what === 'xoa' ? 'bad' : '', ok: what === 'xoa' ? 'Xoá' : 'Chuyển kế toán' })
                .then(function (yes) {
                    if (!yes) return;
                    var v = values();
                    var calls = rows.map(function (r) {
                        var c = what === 'xoa' ? cfg.calls.xoa(r.ID, v) : cfg.calls.chuyen(r.ID, v);
                        return function () {
                            return ums.api.call(c).catch(function (e) {
                                if (!e.expired) e.message = checkTitle(r) + ' ' + e.message;
                                throw e;
                            });
                        };
                    });
                    return ui.batch(calls, { title: what === 'xoa' ? 'Đang xoá' : 'Đang chuyển kế toán', okText: 'Thực hiện thành công' })
                        .then(function () {
                            if (n === 1 || (what === 'xoa' && cfg.xoaReload5)) load1();
                            if (has5 && (n === 5 || (what === 'xoa' && cfg.xoaReload5))) load5();
                        });
                });
        }

        /* ---------- Tải tệp / đọc tệp ---------- */
        function resetFile() {
            st.path = '';
            st.data = null;
            k('file').value = '';
            k('fileinfo').textContent = 'Chọn tệp — tệp được tải lên máy chủ ngay khi chọn.';
            T.fill(k('sheet'), [], { head: '-- Chọn sheet dữ liệu để import --' });
            z('t2').innerHTML = ui.empty('Chưa đọc dữ liệu từ tệp Excel', 'fa-file-excel');
            setCnt(root, '2', 0);
        }

        k('file').addEventListener('change', function () {
            var files = this.files;
            st.path = '';
            if (!files || !files.length) return;
            k('fileinfo').textContent = 'Đang tải lên: ' + files[0].name + '…';
            Promise.resolve(ums.upload(files)).then(function (p) {
                st.path = p || '';
                k('fileinfo').textContent = st.path ? 'Đã tải lên: ' + files[0].name : 'Chưa tải được tệp lên máy chủ.';
            }).catch(function (e) {
                k('fileinfo').textContent = 'Chưa tải được tệp lên máy chủ.';
                ums.api.handle(e, 'tải tệp');
            });
        });

        function docFile() {
            if (!st.path) { ui.toast('Vui lòng chọn file trước khi thực hiện import dữ liệu!', 'warn'); return; }
            ums.api.call({ action: 'SYS_Import/getDataFormFileImport', method: 'GET', versionAPI: 'v1.0', strPath: st.path })
                .then(function (r) {
                    var id = r.raw && r.raw.Id;
                    // Dữ liệu mẫu không mô phỏng được trường Id ngoài Data → lấy tên bảng
                    if (!id && ums.state && ums.state.mode === 'demo' && r.data) id = Object.keys(r.data).join('$');
                    if (!id) return;                       // bản gốc: không có Id thì im lặng
                    var sheets = String(id).indexOf('$') >= 0 ? String(id).split('$') : [id];
                    st.data = r.data || {};
                    T.fill(k('sheet'), sheets.map(function (s, i) { return { ID: 'Table' + (i + 1), TEN: s }; }), { head: false, keep: false });
                    ui.toast('Đọc được ' + sheets.length + ' sheet. Chọn sheet rồi bấm Hiển thị dữ liệu.', 'ok');
                }).catch(function (e) { ums.api.handle(e, 'đọc tệp'); });
        }

        function xemSheet() {
            var s = val('sheet');
            if (!s) { ui.toast('Vui lòng chọn sheet trước khi thực hiện import dữ liệu!', 'warn'); return; }
            var rows = (st.data && st.data[s]) || [];
            T.dynTable(z('t2'), rows, cfg.filterNullCols);
            setCnt(root, '2', rows.length);
            tab(2);
            if (cfg.clearThatBaiOnView) {
                z('t4').innerHTML = ui.empty('Không có dòng lỗi');
                setCnt(root, '4', '');
                st.loi = [];
            }
        }

        /* ---------- Thực hiện import ---------- */
        function doImport() {
            if (!st.path) { ui.toast('Vui lòng chọn file trước khi thực hiện import dữ liệu!', 'warn'); return; }
            if (!val('sheet')) { ui.toast('Vui lòng chọn sheet trước khi thực hiện import dữ liệu!', 'warn'); return; }
            if (!val('mau')) { ui.toast('Vui lòng chọn mẫu import trước khi thực hiện import dữ liệu!', 'warn'); return; }
            var v = values();
            if (!v.hocKy || !v.loaiKhoan || !v.mau) { ui.toast('Bạn cần chọn thời gian, khoản thu và mẫu import!', 'warn'); return; }

            var lines = [
                ['Học kỳ import', T.selText(k('hocKy'))],
                ['Import cho khoản phí', T.selText(k('loaiKhoan'))],
                ['Hạch toán', T.selText(k('chuyenKT')) + ' thực hiện hạch toán'],
                ['Loại kiểm tra', T.selText(k('kiemTra'))]
            ];
            if (cfg.kieuHoc) lines.push(['Kiểu học', T.selText(k('kieuHoc'))]);
            lines.push([cfg.ngayLabel || 'Ngày giao dịch', v.ngay], ['Mã đợt import', v.maDot]);

            ui.dialog({
                title: 'Xác nhận import', icon: 'fa-file-import', size: 'sm',
                body: '<table class="ums-table ums-table--tight"><tbody>' + lines.map(function (l) {
                    return '<tr><td class="ums-u-muted is-nowrap">' + esc(l[0]) + '</td><td class="ums-u-semi">' + esc(l[1] || '—') + '</td></tr>';
                }).join('') + '</tbody></table><p class="ums-u-mt-4 ums-u-mb-0">Bạn có chắc chắn muốn import không?</p>',
                buttons: [{ text: 'Thực hiện import', kind: 'save', onClick: function () { run(v); } }]
            });
        }

        function run(v) {
            var call = cfg.calls.import(v);
            call.method = 'GET';
            if (cfg.resetBeforeImport) resetFile();
            ums.api.call(call).then(function (r) {
                var d = r.data || {};
                var ok = d.Table1 || [], loi = d.Table2 || [];
                if (loi.length) { tab(4); setCnt(root, '4', loi.length); } else tab(3);
                ui.table({ el: z('t3'), rows: ok, columns: cfg.cols3 });
                setCnt(root, '3', ok.length);
                st.loi = loi;
                T.dynTable(z('t4'), loi, cfg.filterNullCols, 'Không có dòng lỗi');
                ui.toast('Thực hiện import hoàn tất. Hãy kiểm tra thông tin', 'ok');
                if (!cfg.resetBeforeImport) resetFile();
                load1();
            }).catch(function (e) { ums.api.handle(e, 'import'); });
        }

        function taiMau() {
            var el = k('mau');
            if (!el.value) { ui.toast('Vui lòng chọn mẫu import trước khi tải file mẫu!', 'warn'); return; }
            var url = el.options[el.selectedIndex].getAttribute('data-url');
            if (!url || url === 'undefined' || url === 'null') {
                ui.toast('Mẫu import này chưa được cấu hình file mẫu. Vui lòng liên hệ quản trị viên để bổ sung đường dẫn file mẫu trong hệ thống.', 'warn');
                return;
            }
            // Bản gốc (import_danop / import_phainop, 2026-09-22): đường dẫn tương đối thì ghép strhost + "/"
            if (url.indexOf('http') === -1) url = (ums.session.host || '') + '/' + url.replace(/^\/+/, '');
            global.open(url, '_blank');
        }

        /* ---------- Sự kiện ---------- */
        root.addEventListener('click', function (e) {
            var t = e.target.closest('[data-tab],[data-a]');
            if (!t || !root.contains(t)) return;
            if (t.hasAttribute('data-tab')) {
                var n = t.getAttribute('data-tab');
                tab(n);
                if (n === '5' && !st.loaded5) { st.loaded5 = true; load5(1); }
                return;
            }
            switch (t.getAttribute('data-a')) {
                case 'tim1': load1(1); break;
                case 'tim5': st.loaded5 = true; load5(1); break;
                case 'chuyen1': act(1, 'chuyen'); break;
                case 'xoa1': act(1, 'xoa'); break;
                case 'xoa5': act(5, 'xoa'); break;
                case 'doc': docFile(); break;
                case 'xem': xemSheet(); break;
                case 'import': doImport(); break;
                case 'taimau': taiMau(); break;
                case 'xuatloi': cfg.exportLoi(st.loi); break;
            }
        });
        root.addEventListener('keydown', function (e) {
            if (e.key !== 'Enter') return;
            if (e.target === k('fTuKhoa')) { e.preventDefault(); load1(1); }
            if (e.target === k('f5TuKhoa')) { e.preventDefault(); st.loaded5 = true; load5(1); }
        });

        /* Bản gốc gọi danh sách và mã đợt ngay khi mở, lúc ô "Bảng dữ liệu"
           chưa kịp nạp (tham số bảng = rỗng). Ở đây chờ ô đó nạp xong để lần
           tải đầu dùng đúng bảng đang chọn — kết quả như bản gốc bấm Tìm lại. */
        ready.then(function () { load1(1); loadMaDot(); });

        return { load1: load1, load5: load5, values: values };
    };

    /* =====================================================================
       Xuất bảng ra Excel qua Sys_Report/ThemMoi — report_Data() của
       import_phainop.js (bản gốc chỉ có ở màn đó). Ô A2, B2… lần lượt là
       từng dòng/cột; không có dòng tiêu đề (strFileName không truyền).
       ===================================================================== */
    var COLS = [];
    (function () {
        var a = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        a.forEach(function (x) { COLS.push(x); });
        'ABCDEFG'.split('').forEach(function (p) { a.forEach(function (x) { COLS.push(p + x); }); });
    })();

    T.reportCells = function (code, matrix, cols) {
        var tk = [], dl = [];
        matrix.forEach(function (row, i) {
            cols.forEach(function (c) { tk.push(COLS[c] + (i + 2)); dl.push(row[c] === null || row[c] === undefined ? '' : row[c]); });
        });
        tk.push('strReportCode'); dl.push(code);
        return ums.api.call({
            action: 'Sys_Report/ThemMoi',
            strTuKhoa: tk.toString(),
            strDuLieu: dl.toString(),
            strNguoiThucHien_Id: (ums.session && ums.session.userId) || ''
        }).then(function (r) {
            if (!r.message) { ui.toast('Chưa lấy được dữ liệu báo cáo!', 'warn'); return; }
            global.open(((ums.session && ums.session.rootPathReport) || '') + '?id=' + r.message, '_blank');
        }).catch(function (e) { ums.api.handle(e, 'xuất báo cáo'); });
    };

    /* =====================================================================
       KHUNG CHUNG tracuusophieuthu / tracuusobienlai
       cfg = {
           kind: 'PHIEUTHU' | 'BIENLAI', title, mauLabel, listTitle, huyText,
           calls: { mau(), list(v), huy(id) },
           card(row) → [[nhãn, giá trị], …] (ba dòng dưới số), so(row), tip(row) → [[nhãn, giá trị]…]
       }
       ===================================================================== */
    T.soPhieuScreen = function (root, cfg) {
        if (!root) return;   /* người dùng đã sang màn khác trước khi tệp màn nạp xong — không còn chỗ để dựng (kiểm host 29/9) */
        var st = { mau: [], rows: [], page: 1, size: 24, total: 0, current: null };
        var h = '<div data-z="list">' +
            '<div class="ums-page__head"><h1 class="ums-page__title ums-u-mb-0">' + esc(cfg.title) + '</h1></div>' +
            '<div class="ums-grid ums-grid--main-aside ums-u-mb-4">' +
            '<div class="ums-panel"><div class="ums-panel__body"><div class="ums-stack">' +
            field(cfg.mauLabel, sel('mau', 'Tất cả'), { inline: true }) +
            field('Từ khoá', '<input class="ums-input" data-k="tuKhoa" autocomplete="off" placeholder="Số phiếu, mã người thu…">', { inline: true }) +
            field('Loại phiếu', '<div class="ums-row" style="min-height:var(--ums-control-h)">' +
                [['-1', 'Toàn bộ'], ['1', 'Phiếu thu'], ['2', 'Phiếu đã sửa'], ['0', 'Phiếu huỷ']].map(function (x, i) {
                    return '<label class="ums-check"><input type="radio" name="' + cfg.kind + 'LoaiPhieu" data-k="loai" value="' + x[0] + '"' +
                        (i ? '' : ' checked') + '> ' + x[1] + '</label>';
                }).join('') + '</div>', { inline: true }) +
            '<div class="ums-row ums-row--end">' + ui.btn('search', { attr: { 'data-a': 'tim' } }) + '</div>' +
            '</div></div></div>' +
            '<div><div class="ums-panel"><div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-chart-simple"></i> ' +
            esc(cfg.kind === 'BIENLAI' ? 'Tình trạng biên lai' : 'Tình trạng phiếu thu') + '</div></div>' +
            '<div class="ums-panel__body"><div class="ums-stack" data-z="meters"></div></div></div></div>' +
            '</div>' +
            '<div class="ums-panel"><div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-receipt"></i> ' +
            esc(cfg.listTitle) + ' <span class="ums-u-faint ums-u-fz13" data-z="count"></span></div></div>' +
            '<div class="ums-panel__body ums-panel__body--flush" data-z="cards"></div></div>' +
            '</div>' +
            /* --- Xem phiếu --- */
            '<div data-z="view" hidden>' +
            '<div class="ums-page__head"><h1 class="ums-page__title ums-u-mb-0" data-z="vtitle"></h1>' +
            '<div class="ums-page__actions">' +
            ui.btn('close', { text: 'Đóng', attr: { 'data-a': 'dong' } }) +
            '<button type="button" class="ums-btn ums-btn--danger" data-a="huy"><i class="fa-light fa-ban"></i><span>' + esc(cfg.huyText) + '</span></button>' +
            ui.btn('print', { mod: 'primary', attr: { 'data-a': 'in' } }) +
            '</div></div>' +
            '<div class="ums-panel"><div class="ums-panel__body tcsp-paperwrap" data-z="paper"></div></div>' +
            '</div>';
        root.innerHTML = h;

        function q(s) { return root.querySelector(s); }
        function z(n) { return q('[data-z="' + n + '"]'); }
        ui.select2(q('[data-k="mau"]'), { placeholder: 'Tất cả', allowClear: false });

        function meters(mauId) {
            var dung = 0, huy = 0;
            if (!mauId) {
                st.mau.forEach(function (m) { dung += Number(m.SODADUNG) || 0; huy += Number(m.SODAHUY) || 0; });
            } else {
                var m = st.mau.filter(function (x) { return x.ID === mauId; })[0];
                if (m) { dung = Number(m.SODADUNG) || 0; huy = Number(m.SODAHUY) || 0; }
            }
            var tong = dung + huy;
            function row(label, n, tone) {
                var p = tong ? Math.round(n * 100 / tong) : 0;
                return '<div><div class="ums-row ums-row--between ums-u-fz13"><span class="ums-u-semi" style="color:var(--ums-' + tone + ')">' + label +
                    '</span><span><b>' + n + '</b> / ' + tong + '</span></div>' +
                    '<div class="ums-meter__track ums-u-mt-2"><div class="ums-meter__fill" style="width:' + p + '%;background:var(--ums-' + tone + ')"></div></div></div>';
            }
            // "Phiếu đã sửa" bản gốc luôn là 0 — procedure không trả số phiếu sửa
            z('meters').innerHTML = row('Phiếu đã dùng', dung, 'ok') + row('Phiếu đã sửa', 0, 'warn') + row('Phiếu đã huỷ', huy, 'bad');
        }

        function loadMau() {
            return ums.api.call(Object.assign({ method: 'GET', silent: true }, cfg.calls.mau())).then(function (r) {
                st.mau = T.rows(r);
                T.fill(q('[data-k="mau"]'), st.mau, { name: 'MAUSO', head: 'Tất cả' });
                meters(q('[data-k="mau"]').value);
            }).catch(function (e) { ums.api.handle(e, 'mẫu'); });
        }

        function tone(t) { return t === 1 ? 'ok' : t === -1 ? 'bad' : t === 2 ? 'warn' : ''; }

        /* Lưới thẻ dùng chung — ums.pat.cards (BO-CUC mục 5) */
        function draw() {
            var host = z('cards');
            z('count').textContent = '(' + st.total + ')';
            var tips = st.rows.map(function (r) {
                return (cfg.tip(r) || []).map(function (x) {
                    return x[0] + ': ' + (x[1] === null || x[1] === undefined ? '' : x[1]);
                }).join('\n');
            });
            ums.pat.cards({
                el: host, items: st.rows, empty: 'Không tìm thấy dữ liệu',
                tone: function (r) { return tone(Number(r.TINHTRANG)); },
                render: function (r) {
                    /* Dòng đầu là "Số : #…" như bản gốc, không phải tiêu đề to */
                    return '<span class="ums-card__row"><span>Số</span>' +
                        '<b class="ums-card__no">#' + esc(cfg.so(r)) + '</b></span>' +
                        cfg.card(r).map(function (x) { return ums.pat.cardRow(x[0], x[1]); }).join('');
                },
                /* Số thẻ mỗi trang nằm NGAY TRONG thanh phân trang, đúng chỗ của
                   bản gốc (beginLoadPag, Core:1739) — nhưng là dãy nút, không phải
                   ô chọn. Luôn vẽ thanh này, kể cả khi đang xem "Tất cả", nếu
                   không thì chọn "Tất cả" xong không có đường quay lại. */
                page: {
                    index: st.page, size: st.size, total: st.total,
                    onChange: function (p) { if (p >= 1 && p <= Math.ceil(st.total / st.size)) load(p); },
                    onSize: function (v) { st.size = v; load(1); }
                },
                onPick: function (r) { open(r); }
            });
            // tip của bản gốc (title trên thẻ) — pat.cards không nhận thuộc tính thẻ
            host.querySelectorAll('.ums-card').forEach(function (b, i) { if (tips[i]) b.title = tips[i]; });
        }

        function load(page) {
            if (page) st.page = page;
            var v = {
                tuKhoa: (q('[data-k="tuKhoa"]').value || '').trim(),
                mau: q('[data-k="mau"]').value,
                loai: (q('[data-k="loai"]:checked') || {}).value || '-1',
                page: st.page, size: st.size
            };
            var call = cfg.calls.list(v);
            call.method = 'GET';
            z('cards').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return ums.api.call(call).then(function (r) {
                st.rows = T.rows(r);
                st.total = st.rows.length ? (Number(r.pager) || st.rows.length) : 0;
                draw();
            }).catch(function (e) {
                z('cards').innerHTML = ui.fail(e.message);
                ums.api.handle(e, cfg.listTitle);
            });
        }

        function open(row) {
            st.current = row;
            z('vtitle').textContent = (cfg.kind === 'BIENLAI' ? 'Biên lai' : 'Phiếu thu') + ' #' + (cfg.so(row) || '');
            q('[data-a="huy"]').hidden = Number(row.TINHTRANG) === -1;
            ui.swap(z('list'), z('view'));
            T.phieu.render(z('paper'), row.ID, cfg.kind);
        }

        function close() { st.current = null; ui.swap(z('view'), z('list')); }

        root.addEventListener('click', function (e) {
            var a = e.target.closest('[data-a]');
            if (!a || !root.contains(a)) return;
            switch (a.getAttribute('data-a')) {
                case 'tim': load(1); break;
                case 'dong': close(); break;
                case 'in':
                    T.phieu.print(z('paper'), z('vtitle').textContent);
                    close();                           // bản gốc in xong thì đóng phiếu
                    break;
                case 'huy':
                    ui.confirm('Bạn có chắc chắn muốn ' + cfg.huyText.toLowerCase() + ' không?', { tone: 'bad', ok: cfg.huyText })
                        .then(function (yes) {
                            if (!yes || !st.current) return;
                            return ums.api.call(cfg.calls.huy(st.current.ID)).then(function () {
                                load(); loadMau(); close();
                                ui.toast('Xóa chứng từ thành công', 'ok');
                            });
                        }).catch(function (err) { ums.api.handle(err, cfg.huyText); });
                    break;
            }
        });
        root.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && e.target.matches('[data-k="tuKhoa"]')) { e.preventDefault(); load(1); }
        });
        root.addEventListener('change', function (e) {
            if (e.target.matches('[data-k="loai"]')) load(1);
        });
        if (global.jQuery) {
            jQuery(q('[data-k="mau"]')).on('change', function () { meters(this.value); load(1); });
        }

        loadMau();
        load(1);
    };

    /* =====================================================================
       XEM / IN PHIẾU — tầng chung
       ---------------------------------------------------------------------
       Trước đây khối này tự gọi TC_PhieuThu/LayTTPhieuThu_Rut rồi vẽ một tờ
       trung tính riêng (.tcp), kèm ghi chú "bộ máy phôi in phải là tầng
       chung". Tầng chung đó nay có: ums.phieu.viewer (assets/js/phieu.js) —
       đổ dữ liệu vào phôi in của trường ở Upload/Files/PrintTemplate, và tự
       vẽ bản rút gọn khi không nạp được phôi (máy lập trình, dữ liệu mẫu).
       ===================================================================== */
    T.phieu = {
        /** Khung xem gắn với host; dùng lại khung cũ nếu đã có */
        viewer: function (host, opts) {
            if (!host.__phieu) host.__phieu = ums.phieu.viewer(host, opts || {});
            return host.__phieu;
        },
        render: function (host, id, kind) {
            return T.phieu.viewer(host).show({ id: id, loai: kind === 'BIENLAI' ? 'BIENLAI' : 'PHIEUTHU' });
        },
        print: function (host, title) {
            return T.phieu.viewer(host).print(title);
        }
    };

    /* =====================================================================
       Dữ liệu mẫu dùng chung (chỉ đọc ở chế độ dựng thử)
       ===================================================================== */
    /** Cắt trang như procedure: trả { rows, pager } */
    T.demoPage = function (rows, o) {
        var size = Number(o && o.pageSize) || rows.length || 1;
        var idx = Number(o && o.pageIndex) || 1;
        return { rows: rows.slice((idx - 1) * size, idx * size), pager: rows.length };
    };
    T.demoLike = function (rows, q, cols) {
        function norm(s) { return String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd'); }
        q = norm((q || '').trim());
        return !q ? rows : rows.filter(function (r) { return cols.some(function (c) { return norm(r[c]).indexOf(q) >= 0; }); });
    };

    if (ums.demo && ums.demo.add) {
        ums.demo.add({
            'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao': [
                { ID: 'TG1', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm 2025-2026' },
                { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 năm 2025-2026' },
                { ID: 'TG3', DAOTAO_THOIGIANDAOTAO: 'Học kỳ hè năm 2025-2026' },
                { ID: 'TG4', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm 2026-2027' }
            ],
            'SYS_Import_PhanQuyen/LayDanhSach': [
                { ID: 'MIP1', MAUIMPORT_MA: 'MAUIMPORT_KHOANDANOP_01', MAUIMPORT_TENFILEMAU: 'Mẫu import khoản đã nộp (ngân hàng)', MAUIMPORT_DUONGDANFILEMAU: '/Upload/Files/Template/mau_da_nop.xlsx', CHISODONGDOCDULIEUTUFILE: 2 },
                { ID: 'MIP2', MAUIMPORT_MA: 'MAUIMPORT_KHOANPHAINOP_01', MAUIMPORT_TENFILEMAU: 'Mẫu import khoản phải nộp', MAUIMPORT_DUONGDANFILEMAU: '/Upload/Files/Template/mau_phai_nop.xlsx', CHISODONGDOCDULIEUTUFILE: 1 },
                { ID: 'MIP3', MAUIMPORT_MA: 'MAUIMPORT_MIENGIAM_01', MAUIMPORT_TENFILEMAU: 'Mẫu import miễn giảm', MAUIMPORT_DUONGDANFILEMAU: null, CHISODONGDOCDULIEUTUFILE: null }
            ],
            'CM_DanhMucDuLieu/LayDanhSach#KHDT.DIEM.KIEUHOC': [
                { ID: 'KH1', MA: 'HL', TEN: 'Học lần đầu' },
                { ID: 'KH2', MA: 'HLAI', TEN: 'Học lại' },
                { ID: 'KH3', MA: 'HCT', TEN: 'Học cải thiện' }
            ],
            'SYS_Import/getDataFormFileImport': {
                rows: {
                    Table1: [
                        { STT: 1, MASO: 'SV2201001', HODEM: 'Nguyễn Văn', TEN: 'An', SOTIEN: 9800000, NOIDUNG: 'Nộp học phí HK1', GHICHU: '' },
                        { STT: 2, MASO: 'SV2201002', HODEM: 'Trần Thị', TEN: 'Bình', SOTIEN: 9800000, NOIDUNG: 'Nộp học phí HK1', GHICHU: '' },
                        { STT: 3, MASO: 'SV2201015', HODEM: 'Lê Hoàng', TEN: 'Cường', SOTIEN: 4900000, NOIDUNG: 'Nộp học phí HK1 (đợt 1)', GHICHU: '' }
                    ],
                    Table2: [
                        { STT: 1, MASO: 'SV2305020', HODEM: 'Phạm Minh', TEN: 'Đức', SOTIEN: 1200000, NOIDUNG: 'Phí ký túc xá tháng 9', GHICHU: '' }
                    ]
                }
            }
        });
    }

})(window);
