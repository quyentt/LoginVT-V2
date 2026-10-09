/* =========================================================================
   "Khai thông tin các quá trình" của MỘT người học — ums.qhht.quaTrinh(host, o)
   Bản gốc: DaQHHT.js loadPersonProcessTab / renderPersonProcessTable /
   openPersonProcessForm / savePersonProcessForm / deletePersonProcess —
   một cấu hình (_qhht_cauhinh.js) phục vụ 7 bảng PKG_CORE_HOSONHANSU_06.
   ---------------------------------------------------------------------------
   o = { personId, sv: { ten, ma }, tabCuoi: { key, text, ve(host) } (tab
         "Thông tin hồ sơ - chính sách" do màn vẽ) }
   Lời gọi (chép nguyên, mã hoá):
       danh sách   strChucNang_Id, strVaiTro_Id '', strNguoiThucHien_Id, strPerson_Id
                   → giữ dòng PERSON_ID = người học (hoặc rỗng) và IS_ACTIVE rỗng / 1
       thêm / sửa  + dIs_Active 1, mọi trường theo tên tham số; sửa thêm Id, strId = ID viết HOA
       xoá         Id, strId (HOA), strChucNang_Id, strVaiTro_Id '', strNguoiThucHien_Id
   Hỏi lại: lưu — hộp chi tiết KHÔNG bắt đánh dấu; xoá — bắt đánh dấu (như gốc).
   Khác bản gốc (lỗi rõ): mở hồ sơ người học khác mà tab khác "Địa chỉ" đang mở
   thì tab đó vẫn hiện dữ liệu người trước → ở đây mỗi lần mở dựng lại, tab nạp khi bấm.
   Giữ như bản gốc: mã / ID gõ tay (ô chữ), không có ô chọn danh mục.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var qhht = ums.qhht = ums.qhht || {};
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function cn() { return (ums.state && ums.state.chucNangId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    var ICON = { DiaChi: 'fa-location-dot', GiaDinh: 'fa-users', TKNH: 'fa-building-columns', HocVan: 'fa-graduation-cap',
        ChungChi: 'fa-certificate', TaiLieu: 'fa-file-lines', HocHam: 'fa-award' };
    function giaTri(r, c) {
        var v = r[c.key];
        (c.fallback || []).forEach(function (k) { if (v === undefined || v === null || v === '') v = r[k]; });
        return v;
    }

    qhht.quaTrinh = function (host, o) {
        var CFG = qhht.QUATRINH, keys = Object.keys(CFG), cache = {};
        var tabs = keys.map(function (k) { return { key: k, text: CFG[k].title, icon: ICON[k] }; });
        if (o.tabCuoi) tabs.push({ key: o.tabCuoi.key, text: o.tabCuoi.text, icon: 'fa-id-card' });
        host.innerHTML = ui.tabs(tabs, keys[0], 'data-qttab') +
            tabs.map(function (t, i) { return '<div class="ums-u-mt-3" data-qtpane="' + t.key + '"' + (i ? ' hidden' : '') + '></div>'; }).join('');
        function pane(k) { return host.querySelector('[data-qtpane="' + k + '"]'); }
        var daNap = {};
        function mo(k) {
            ui.tabsActive(host, k, 'data-qttab');
            tabs.forEach(function (t) { pane(t.key).hidden = t.key !== k; });
            if (o.tabCuoi && k === o.tabCuoi.key) { o.tabCuoi.ve(pane(k)); return; }
            if (!daNap[k]) { daNap[k] = true; tai(k); }
        }

        function tai(k) {
            var c = CFG[k], p = pane(k);
            if (!o.personId) { p.innerHTML = ui.empty('Chưa xác định người học', 'fa-user-slash'); return; }
            p.innerHTML = ui.empty('Đang tải ' + c.title.toLowerCase() + '...', 'fa-spinner fa-spin');
            ums.api.call({ action: c.ep.list.a, func: c.ep.list.f, strChucNang_Id: cn(), strVaiTro_Id: '', strNguoiThucHien_Id: uid(), strPerson_Id: o.personId, silent: true })
                .then(function (r) {
                    cache[k] = arr(r.data).filter(function (x) {
                        return (x.PERSON_ID == o.personId || !x.PERSON_ID) && (x.IS_ACTIVE === undefined || x.IS_ACTIVE == 1);
                    });
                    bang(k);
                }).catch(function (err) { p.innerHTML = ui.fail('Không tải được dữ liệu: ' + err.message); });
        }
        function bang(k) {
            var c = CFG[k], p = pane(k), ds = cache[k] || [];
            p.innerHTML = '<div class="ums-row ums-row--between ums-u-mb-2"><b class="ums-u-navy">Danh sách ' + esc(c.title.toLowerCase()) + ' (' + ds.length + ')</b>' +
                ui.btn('add', { text: 'Thêm ' + c.title.toLowerCase(), cls: 'ums-btn--sm', attr: { 'data-qt': 'them' } }) + '</div><div data-qt="bang"></div>';
            if (!ds.length) { p.querySelector('[data-qt="bang"]').innerHTML = ui.empty('Chưa có ' + c.title.toLowerCase() + '. Bấm "Thêm ' + c.title.toLowerCase() + '" để bắt đầu.', ICON[k]); return; }
            ui.table({ el: p.querySelector('[data-qt="bang"]'), rows: ds, columns: c.columns.map(function (col) {
                return { title: col.label, cls: col.center ? 'is-center' : '', render: function (r) { var v = giaTri(r, col); return col.render ? col.render(v, r) : esc(e(v)); } };
            }).concat([{ title: 'Hành động', cls: 'is-center', width: '90px', render: function (r) {
                return '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-qtsua="' + esc(r.ID) + '" title="Sửa"><i class="fa-light fa-pen-to-square"></i></button>' +
                    '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-qtxoa="' + esc(r.ID) + '" title="Xoá"><i class="fa-light fa-trash-can"></i></button>'; } }]) });
        }
        function bieuMau(k, row) {
            var c = CFG[k], p = pane(k), sua = !!row;
            p.innerHTML = '<div class="ums-row ums-row--between ums-u-mb-3"><b class="ums-u-navy">' + (sua ? 'Sửa ' : 'Thêm ') + esc(c.title.toLowerCase()) + '</b>' +
                ui.btn('close', { text: 'Hủy', cls: 'ums-btn--sm', attr: { 'data-qt': 'huy' } }) + '</div>' +
                '<div class="ums-grid ums-grid--12">' + c.fields.map(function (f) {
                    var v = row ? e(row[f.from]) : '', id = 'qt_' + k + '_' + f.name, ctl;
                    if (f.type === 'checkbox') ctl = '<label class="ums-check"><input type="checkbox" data-qtf="' + f.name + '"' + (row && row[f.from] == 1 ? ' checked' : '') + '><span>' + esc(f.label) + '</span></label>';
                    else if (f.type === 'textarea') ctl = '<textarea class="ums-input" rows="2" data-qtf="' + f.name + '" id="' + id + '">' + esc(v) + '</textarea>';
                    else ctl = '<input class="ums-input" data-qtf="' + f.name + '" id="' + id + '" value="' + esc(v) + '"' + (f.placeholder ? ' placeholder="' + esc(f.placeholder) + '"' : '') + ' autocomplete="off">';
                    return '<div style="grid-column:span ' + (f.col || 6) + '">' + (f.type === 'checkbox' ? '<div class="ums-field"><label class="ums-field__label">&nbsp;</label><div class="ums-field__control">' + ctl + '</div></div>'
                        : ui.field(f.label, ctl, { required: f.required })) + '</div>';
                }).join('') + '</div>' +
                '<div class="ums-row ums-row--end ums-u-mt-3">' + ui.btn('close', { text: 'Hủy', attr: { 'data-qt': 'huy' } }) +
                    ui.btn('save', { text: sua ? 'Cập nhật' : 'Lưu', attr: { 'data-qt': 'luu', 'data-id': sua ? row.ID : '' } }) + '</div>';
        }
        function luu(k, rowId) {
            var c = CFG[k], p = pane(k);
            function ov(n) { return p.querySelector('[data-qtf="' + n + '"]'); }
            for (var i = 0; i < c.fields.length; i++) {
                var f = c.fields[i];
                if (f.required && !ov(f.name).value.trim()) { ov(f.name).focus(); ui.toast('Vui lòng nhập "' + f.label + '"', 'warn'); return; }
            }
            var ep = rowId ? c.ep.upd : c.ep.ins;
            var x = { action: ep.a, func: ep.f, strChucNang_Id: cn(), strVaiTro_Id: '', strPerson_Id: o.personId, strNguoiThucHien_Id: uid(), dIs_Active: 1 };
            if (rowId) { x.Id = String(rowId).toUpperCase(); x.strId = x.Id; }
            c.fields.forEach(function (f) { x[f.name] = f.type === 'checkbox' ? (ov(f.name).checked ? 1 : 0) : ov(f.name).value.trim(); });
            pat.xacNhanChiTiet({
                title: (rowId ? 'Cập nhật ' : 'Thêm ') + c.title.toLowerCase(), icon: ICON[k], requireCheckbox: false, okText: rowId ? 'Cập nhật' : 'Lưu',
                subject: { name: o.sv.ten, extra: [{ label: 'Mã NH', value: o.sv.ma }] },
                sections: [{ title: 'Thông tin ' + c.title.toLowerCase(), tone: 'blue', rows: c.fields.filter(function (f) { return f.type !== 'checkbox'; }).map(function (f) { return [f.label, x[f.name]]; }) }]
            }).then(function (ok) {
                if (!ok) return;
                ums.api.call(x).then(function () { ui.toast((rowId ? 'Cập nhật ' : 'Thêm ') + c.title.toLowerCase() + ' thành công', 'ok'); tai(k); })
                    .catch(function (err) { ums.api.handle(err, 'lưu ' + c.title.toLowerCase()); });
            });
        }
        function xoa(k, rowId) {
            var c = CFG[k], r = (cache[k] || []).filter(function (x) { return String(x.ID) === String(rowId); })[0] || {};
            pat.xacNhanChiTiet({
                title: 'Xóa ' + c.title.toLowerCase(), icon: 'fa-trash-can', tone: 'bad', okText: 'Xóa', warning: 'Bản ghi sẽ bị xoá mềm (soft delete).',
                subject: { name: e(giaTri(r, c.columns[0])) || 'Bản ghi #' + rowId },
                sections: [{ title: 'Bản ghi sẽ xoá', tone: 'red', rows: [['Loại', c.title], ['ID', rowId]] }]
            }).then(function (ok) {
                if (!ok) return;
                var id = String(rowId).toUpperCase();
                ums.api.call({ action: c.ep.del.a, func: c.ep.del.f, Id: id, strId: id, strChucNang_Id: cn(), strVaiTro_Id: '', strNguoiThucHien_Id: uid() })
                    .then(function () { ui.toast('Xóa thành công', 'ok'); tai(k); }).catch(function (err) { ums.api.handle(err, 'xoá ' + c.title.toLowerCase()); });
            });
        }

        host.addEventListener('click', function (ev) {
            var t = ev.target.closest('[data-qttab]');
            if (t) { mo(t.getAttribute('data-qttab')); return; }
            var p = ev.target.closest('[data-qtpane]');
            if (!p) return;
            var k = p.getAttribute('data-qtpane'), b;
            if (!CFG[k]) return;
            if ((b = ev.target.closest('[data-qtsua]'))) { bieuMau(k, (cache[k] || []).filter(function (x) { return String(x.ID) === b.getAttribute('data-qtsua'); })[0]); return; }
            if ((b = ev.target.closest('[data-qtxoa]'))) { xoa(k, b.getAttribute('data-qtxoa')); return; }
            if ((b = ev.target.closest('[data-qt]'))) {
                var a = b.getAttribute('data-qt');
                if (a === 'them') bieuMau(k, null);
                else if (a === 'huy') bang(k);
                else if (a === 'luu') luu(k, b.getAttribute('data-id'));
            }
        });
        mo(keys[0]);
    };
})();
