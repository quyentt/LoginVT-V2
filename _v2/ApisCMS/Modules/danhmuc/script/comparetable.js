/* =========================================================================
   So sánh bảng — CompareTable
   Bản gốc: ApisCMS/Modules/danhmuc/html/comparetable.html + script/comparetable.js
   ---------------------------------------------------------------------------
   ⚠ CÔNG CỤ SỬA CẤU TRÚC CSDL. So danh sách bảng / cột của một CSDL NGUỒN (chuỗi
   kết nối mã hoá nhập ở ô đầu) với CSDL hiện tại, sinh lệnh CREATE TABLE / ALTER
   TABLE ADD / MODIFY, rồi chạy các lệnh đã đánh dấu lên CSDL hiện tại. Khung phải
   chép nguyên mã package (spec + body) từ CSDL nguồn sang CSDL hiện tại.

   Bố cục bản gốc: thanh lọc (chuỗi kết nối · ngày so sánh · Tìm kiếm ; ô đánh dấu
   Create Table · Add Column · Modify Column) → HAI CỘT 8 | 4: "Danh sách" (Thực thi,
   bảng Stt · Loại · Bảng · Cột · Lệnh · ô đánh dấu) | "Pakage Update" (Thực thi,
   bảng Stt · PKG · ô đánh dấu). Hộp "Thực thi lệnh": mã pin + lệnh + "Thực thi tất cả".

   Lời gọi (CMS_OraDBTableName/*, chép nguyên):
       LayDanhSach            GET strDataBaseName ''                    → TABLE_NAME (CSDL hiện tại)
       getTableNames_Source   GET strDataBaseName = chuỗi kết nối, strNgaySoSanh → OBJECT_NAME, TABLESPACE_NAME
       getTableProperty       GET strConnect ('' = hiện tại | chuỗi kết nối), strTable_Name
                                  → COLUMN_NAME, DATA_TYPE, DATA_LENGTH, NULLABLE
       getListPackage         GET strConnect = chuỗi kết nối            → OBJECT_NAME
       getSourceLine          GET strPackage, strType 'PACKAGE' | 'PACKAGE BODY', strConnect → TEXT
       CreatAndAlterTable     POST strA = lệnh, strB = mã pin
   Nhớ localStorage "connectString" / "strNgaySoSanh" như gốc (cùng khoá → đọc được
   giá trị hệ cũ đã nhớ trên cùng tên miền).

   Khác gốc:
     · Mọi nút Thực thi đều hỏi lại (ums.cmsCu.ghi). "Thực thi" của khung Package gốc
       chạy thẳng, không hỏi, lấy mã pin từ hộp của khung trái (thường là rỗng) — nay
       mở hộp mã pin riêng; spec rồi mới body, lần lượt từng package (gốc bắn song song).
     · Lỗi gốc: ô lệnh và ô đánh dấu đặt id theo TÊN BẢNG (cmd_<bảng>, chkSelect_<bảng>)
       → một bảng có nhiều dòng ADD/MODIFY thì chỉ lệnh ĐẦU TIÊN được chạy, chạy N lần.
       Nay mỗi dòng chạy đúng lệnh của nó.
     · Lỗi gốc: bỏ "Add Column" mà chọn "Modify Column" thì cột MỚI bị sinh lệnh
       MODIFY (so với cột không tồn tại). Nay chỉ MODIFY cột có ở cả hai bên.
     · Lỗi gốc: mảng tablespace không xoá giữa hai lần tìm → lần tìm thứ hai lệnh
       CREATE lấy nhầm tablespace. Nay xoá mỗi lần.
     · Hộp lệnh chỉ đọc (gốc cho gõ nhưng gửi lệnh của ô trong bảng, sửa trong hộp
       vô tác dụng). Sửa lệnh thì sửa ở cột "Lệnh".
     · Dòng sắp theo thứ tự: CREATE trước, rồi ADD/MODIFY theo thứ tự bảng (gốc: theo
       thứ tự lời gọi về). Chạy xong nạp lại sau khi MỌI lệnh xong (gốc: đợi n×50ms).
     · Tìm kiếm nạp lại cả danh sách package theo chuỗi kết nối mới (gốc chỉ nạp một
       lần lúc mở màn — đổi CSDL nguồn mà danh sách package vẫn của nguồn cũ).
     · KHÔNG chép giá trị mặc định của ô chuỗi kết nối (một chuỗi kết nối mã hoá viết
       cứng trong html gốc) — không đưa thông tin kết nối CSDL vào mã giao diện.
     · Giữ nguyên (nghi ngờ): lệnh luôn viết KIEU(DO_DAI) kể cả DATE/NUMBER, và
       CREATE kết thúc bằng " /" — y chuỗi gốc sinh ra.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, cu = ums.cmsCu;
    var root = document.getElementById('cms-comparetable');
    if (!root) return;
    var O = 'CMS_OraDBTableName/';
    var e = cu.e, esc = ui.esc;

    var dong = [];          // [{ LOAI, BANG, COT, LENH }]
    var dsPkg = [];

    root.innerHTML =
        pat.page('So sánh bảng', '') +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            '<div class="ums-filter">' +
                '<div class="ums-field cu-flex3"><input class="ums-input" data-f="conn" placeholder="Chuỗi kết nối CSDL nguồn (đã mã hoá)" autocomplete="off" spellcheck="false"></div>' +
                '<div class="ums-field"><div class="ums-inputwrap"><input class="ums-input" data-f="ngay" data-date placeholder="Ngày so sánh" value="01/01/2020" autocomplete="off"><i class="fa-light fa-calendar"></i></div></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'tim' } }) + '</div>' +
            '</div>' +
            '<div class="cu-opts">' +
                '<label class="ums-check"><input type="checkbox" data-f="create" checked> Create Table</label>' +
                '<label class="ums-check"><input type="checkbox" data-f="add" checked> Add Column</label>' +
                '<label class="ums-check"><input type="checkbox" data-f="modify"> Modify Column</label>' +
            '</div>' }) +
        '<div class="ums-grid ums-grid--main-aside">' +
            pat.panel({ title: 'Danh sách', icon: 'fa-list-timeline', flush: true, zone: 'bang', count: 'n',
                tools: ui.btn('confirm', { text: 'Thực thi', mod: 'primary', icon: 'fa-gear', attr: { 'data-a': 'thucthi' } }),
                body: ui.empty('Nhập chuỗi kết nối CSDL nguồn rồi bấm Tìm kiếm', 'fa-code-compare') }) +
            pat.panel({ title: 'Package Update', icon: 'fa-upload', flush: true, zone: 'pkg',
                tools: ui.btn('confirm', { text: 'Thực thi', mod: 'danger', icon: 'fa-gear', attr: { 'data-a': 'thucthipkg' } }) }) +
        '</div>';
    ui.enhance(root);

    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function conn() { return f('conn').value; }
    function chon(zone) {
        return Array.prototype.map.call(z(zone).querySelectorAll('input[data-ck]:checked'), function (c) { return Number(c.getAttribute('data-ck')); });
    }
    function oChonTatCa() { return '<input type="checkbox" data-ckall title="Chọn tất cả">'; }

    // Nhớ chuỗi kết nối / ngày so sánh như gốc
    var nhoConn = cu.lsGet('connectString');
    if (nhoConn) { f('conn').value = nhoConn; f('ngay').value = cu.lsGet('strNgaySoSanh') || ''; }

    /* ---------- Bảng lệnh ---------- */
    function veBang() {
        ui.table({ el: z('bang'), rows: dong, empty: 'Không có khác biệt nào giữa hai CSDL',
            columns: [
                { title: 'Loại', prop: 'LOAI', cls: 'is-center', width: '80px' },
                { title: 'Bảng', prop: 'BANG', width: '170px' },
                { title: 'Cột', prop: 'COT', width: '170px' },
                { title: 'Lệnh', render: function (r, i) {
                    return '<input class="ums-input ums-input--sm cu-cmd" data-cmd="' + i + '" value="' + esc(r.LENH) + '" spellcheck="false"' +
                        (r.LENH === null ? ' placeholder="Đang lấy cấu trúc bảng…"' : '') + '>'; } },
                { head: oChonTatCa(), cls: 'is-center is-actions', width: '48px', render: function (r, i) { return '<input type="checkbox" data-ck="' + i + '">'; } }
            ] });
        z('n').textContent = dong.length ? '(' + dong.length + ')' : '';
    }

    function thuocTinh(bang, chuoi) {
        return ums.api.call({ action: O + 'getTableProperty', method: 'GET', silent: true, strConnect: chuoi, strTable_Name: bang })
            .then(function (r) { return arr(r.data); });
    }
    function kieu(c) { return c.COLUMN_NAME + ' ' + c.DATA_TYPE + '(' + c.DATA_LENGTH + ') ' + (c.NULLABLE === 'Y' ? 'NULL' : 'NOT NULL'); }

    function lenhCreate(bang, tablespace, cols) {
        var row = 'Create table ' + bang + ' (';
        cols.forEach(function (c, i) { row += kieu(c); if (i < cols.length - 1) row += ','; });
        return row + ') ' + 'PCTFREE     10 ' + 'INITRANS    1 ' + 'MAXTRANS    255 ' + 'TABLESPACE  ' + tablespace +
            ' NOCACHE ' + 'MONITORING ' + 'NOPARALLEL ' + 'LOGGING /';
    }

    function soSanh(dtOrigin, dtSource) {
        var goc = dtOrigin.map(function (x) { return x.TABLE_NAME; });
        var moi = [], sua = [];
        var coAdd = f('add').checked, coMod = f('modify').checked, coCreate = f('create').checked;
        dtSource.forEach(function (x) {
            var t = e(x.OBJECT_NAME);
            if (t.indexOf('$') !== -1) return;
            if (goc.indexOf(t) < 0) moi.push({ bang: t, ts: e(x.TABLESPACE_NAME) });
            else if (coAdd || coMod) sua.push(t);
        });

        dong = [];
        var viec = [];
        if (coCreate) {
            moi.forEach(function (m) {
                var d = { LOAI: 'CREATE', BANG: m.bang, COT: '', LENH: null };
                dong.push(d);
                viec.push(function () {
                    return thuocTinh(m.bang, conn()).then(function (cols) { d.LENH = lenhCreate(m.bang, m.ts, cols); });
                });
            });
        }
        var themDong = [];      // dòng ADD/MODIFY theo thứ tự bảng
        sua.forEach(function (t, k) {
            themDong[k] = [];
            viec.push(function () {
                return thuocTinh(t, '').then(function (colGoc) {
                    return thuocTinh(t, conn()).then(function (colNguon) {
                        colNguon.forEach(function (c) {
                            if (e(c.COLUMN_NAME).indexOf('$') !== -1) return;
                            var cmp = colGoc.filter(function (g) { return g.COLUMN_NAME === c.COLUMN_NAME; })[0];
                            if (!cmp && coAdd) {
                                themDong[k].push({ LOAI: 'ADD', BANG: t, COT: c.COLUMN_NAME, LENH: 'ALTER TABLE ' + t + ' ADD ' + kieu(c) + ';' });
                            } else if (cmp && coMod && (c.DATA_TYPE !== cmp.DATA_TYPE || c.DATA_LENGTH !== cmp.DATA_LENGTH || c.NULLABLE !== cmp.NULLABLE)) {
                                themDong[k].push({ LOAI: 'MODIFY', BANG: t, COT: c.COLUMN_NAME, LENH: 'ALTER TABLE ' + t + ' MODIFY ' + kieu(c) + ';' });
                            }
                        });
                    });
                });
            });
        });
        veBang();
        if (!viec.length) return;
        ui.batch(viec, { title: 'Đang so sánh cấu trúc bảng', concurrency: 6, toast: false }).then(function (kq) {
            themDong.forEach(function (ds) { dong = dong.concat(ds); });
            veBang();
            if (kq.fail) ui.toast(kq.errors[0] + (kq.fail > 1 ? ' (và ' + (kq.fail - 1) + ' lỗi khác)' : ''), 'bad', { title: 'Lỗi khi lấy cấu trúc bảng' });
        });
    }

    function tim() {
        if (!conn()) return;          // gốc: ô trống thì bấm không có tác dụng
        cu.lsSet('connectString', conn());
        cu.lsSet('strNgaySoSanh', f('ngay').value);
        taiDoiChieu();
        taiPkg();
    }

    function taiDoiChieu() {
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: O + 'LayDanhSach', method: 'GET', strDataBaseName: '' })
            .then(function (r) {
                var goc = arr(r.data);
                if (!goc.length) throw new Error('Dữ liệu vào không đúng!');
                return ums.api.call({ action: O + 'getTableNames_Source', method: 'GET', strDataBaseName: conn(), strNgaySoSanh: f('ngay').value })
                    .then(function (r2) {
                        var nguon = arr(r2.data);
                        if (!nguon.length) throw new Error('Dữ liệu vào không đúng!');
                        soSanh(goc, nguon);
                    });
            })
            .catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'so sánh bảng'); });
    }

    /* ---------- Package ---------- */
    function taiPkg() {
        ums.api.call({ action: O + 'getListPackage', method: 'GET', strConnect: conn() })
            .then(function (r) {
                dsPkg = arr(r.data);
                if (!dsPkg.length) ui.toast('Dữ liệu vào không đúng!', 'warn');
                ui.table({ el: z('pkg'), rows: dsPkg, empty: 'Không có package',
                    columns: [
                        { title: 'PKG', prop: 'OBJECT_NAME' },
                        { head: oChonTatCa(), cls: 'is-center is-actions', width: '48px', render: function (r, i) { return '<input type="checkbox" data-ck="' + i + '">'; } }
                    ] });
            })
            .catch(function (err) { z('pkg').innerHTML = ui.fail(err.message); ums.api.handle(err, 'nạp danh sách package'); });
    }

    /* ---------- Thực thi ---------- */
    function thucThi() {
        var idx = chon('bang');
        if (!idx.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
        var lenh = idx.map(function (i) { return e(dong[i].LENH); });
        cu.hopPin({
            title: 'Thực thi lệnh', placeholder: 'Mã ẩn: Trẻ con không nghịch xe tăng',
            lenh: lenh.join('\n\n'),
            onOk: function (pin, dlg) {
                cu.ghi('Chạy ' + lenh.length + ' lệnh DDL (CREATE / ALTER TABLE) lên CSDL đang chạy? ' +
                    'Lệnh DDL tự xác nhận (auto-commit), KHÔNG hoàn tác được.', { ok: 'Thực thi tất cả' }).then(function (ok) {
                    if (!ok) return;
                    dlg.close();
                    ui.batch(lenh.map(function (l) {
                        return { action: O + 'CreatAndAlterTable', method: 'POST', strA: l, strB: pin };
                    }), { title: 'Đang thực thi lệnh', okText: 'Thực hiện thành công' }).then(taiDoiChieu);
                });
            }
        });
    }

    function thucThiPkg() {
        var idx = chon('pkg');
        if (!idx.length) { ui.toast('Vui lòng chọn package', 'warn'); return; }
        var ten = idx.map(function (i) { return e(dsPkg[i].OBJECT_NAME); });
        cu.hopPin({
            title: 'Chép package từ CSDL nguồn', placeholder: 'Mã ẩn: Trẻ con không nghịch xe tăng', nut: 'Thực thi',
            them: '<div class="ums-u-fz13 ums-u-muted">Sẽ chép (spec rồi body) ' + ten.length + ' package: <b>' + esc(ten.join(', ')) + '</b></div>',
            onOk: function (pin, dlg) {
                cu.ghi('Ghi đè mã ' + ten.length + ' package trên CSDL đang chạy bằng mã lấy từ CSDL nguồn (' + ten.join(', ') + ')? ' +
                    'Mã hiện tại của các package này bị thay ngay; nếu mã nguồn lỗi, package mất hiệu lực.', { ok: 'Thực thi' }).then(function (ok) {
                    if (!ok) return;
                    dlg.close();
                    var viec = [];
                    ten.forEach(function (p) {
                        ['PACKAGE', 'PACKAGE BODY'].forEach(function (loai) {
                            viec.push(function () {
                                return ums.api.call({ action: O + 'getSourceLine', method: 'GET', strPackage: p, strType: loai, strConnect: conn() })
                                    .then(function (r) {
                                        var d = arr(r.data);
                                        if (!d.length) throw new Error(p + ' - ' + loai + ': Dữ liệu vào không đúng!');
                                        var s = 'create or replace ';
                                        d.forEach(function (x) { s += e(x.TEXT); });
                                        return ums.api.call({ action: O + 'CreatAndAlterTable', method: 'POST', strA: s, strB: pin });
                                    });
                            });
                        });
                    });
                    ui.batch(viec, { title: 'Đang cập nhật package', show: true, okText: 'Thực hiện thành công' });
                });
            }
        });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'tim') tim();
        else if (a === 'thucthi') thucThi();
        else if (a === 'thucthipkg') thucThiPkg();
    });
    root.addEventListener('change', function (ev) {
        var t = ev.target;
        if (t.hasAttribute('data-ckall')) {
            var bang = t.closest('[data-z]');
            Array.prototype.forEach.call(bang.querySelectorAll('input[data-ck]'), function (c) { c.checked = t.checked; });
        } else if (t.hasAttribute('data-cmd')) {
            dong[Number(t.getAttribute('data-cmd'))].LENH = t.value;
        }
    });
    root.addEventListener('input', function (ev) {
        var t = ev.target;
        if (t.hasAttribute('data-cmd')) dong[Number(t.getAttribute('data-cmd'))].LENH = t.value;
    });
    f('conn').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim(); } });

    taiPkg();
})();
