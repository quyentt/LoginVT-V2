/* =========================================================================
   Vai trò vị trí — khai vai trò theo vị trí / quan hệ lao động / phân công lao động (ApisNhanSu)
   Bản gốc: ApisNhanSu/Modules/cocautochuc/html/vaitrovitri.html + script/vaitrovitri..js
            (tên tệp gốc có HAI dấu chấm; html gốc nạp đúng tên đó)
   ---------------------------------------------------------------------------
   Bố cục bản gốc: dải BA tab —
     1. "Khai vai trò theo vị trí công việc": khung chung script/_vitri.js (ums.nsViTri.man, vaiTro: true) —
        cây đơn vị → vị trí (cột Vai trò: tên vai trò đã gán + nút "Điều chỉnh") → vai trò của vị trí → thêm vai trò.
     2. "Khai vai trò theo quan hệ lao động": HAI cột — trái ô Loại quan hệ lao động (CORE.QUANHELAODONG.LOAI)
        + nút Xem; phải "Danh sách vai trò theo loại quan hệ lao động" (Xóa · Thêm mới).
     3. "Khai vai trò theo phân công lao động": như tab 2, loại lấy CORE_ASSIGNMENT.ASSIGNMENT_TYPE_CODE.
   Hộp thêm (#modalAddEmployRole / #modalAddAssignRole) → biểu mẫu thay chỗ danh sách trong cột phải.

   Lời gọi tab 2 / 3 (CMS_QuanTri03_MH · PKG_CORE_QUANTRI_03 — chép nguyên):
     Pr_Core_Employ_Type_R_Map_Gets | Pr_Core_Assign_Type_R_Map_Gets
         strTuKhoa '', strEmployment_Type_Code | strAssignment_Type_Code, strRole_Id '', dIs_Active '',
         strNguoiThucHien_Id, strVaiTroDangNhap_Id '', strChucNangHeThong_Id '', strHanhDong_Code ''
         → CHỈ giữ dòng IS_ACTIVE == 1 (lọc ở máy khách như gốc)
     Pr_Core_Employ_Type_R_Map_In | Pr_Core_Assign_Type_R_Map_In
         mã loại, strRole_Id, strStart_Date, strEnd_Date, dIs_Active, strNote, (+ 4 tham số như trên)
     Pr_Core_Employ_Type_R_Map_De | Pr_Core_Assign_Type_R_Map_De   strId (mỗi dòng một lời gọi), (+ 4)
     CMS_VaiTro/LayDanhSach (ô Chọn vai trò — TENVAITRO)
   Kiểm như gốc: chưa chọn Loại thì không Xem / không Thêm; chưa chọn vai trò thì không lưu; lỗi ORA-20021 /
   "Đã tồn tại" đổi thành câu "Cấu hình này đã tồn tại (có thể đang ở trạng thái Hết hiệu lực)…".
   Khác gốc:
     · Tab 1: nút "Xóa" ở bảng vai trò của vị trí gốc chỉ hỏi lại rồi KHÔNG làm gì (không có thủ tục xoá) →
       giữ nút, KHOÁ; bỏ cột ô đánh dấu (không còn việc gì). Cột Sửa vị trí: gốc có trình xử lý nhưng không vẽ
       nút → không có (như gốc).
     · Lưu thêm xong về danh sách (gốc đóng hộp — như nhau).
   Ô cha → con: không có (ô Loại là bộ lọc duy nhất của mỗi tab).
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('ns-vaitrovitri');
    if (!root || !ums.nsViTri) return;
    var ui = ums.ui, pat = ums.pat, C = ums.nsCoCau, V = ums.nsViTri;
    function e(v) { return v === undefined || v === null ? '' : String(v); }
    var Q3 = 'CMS_QuanTri03_MH/', PQ3 = 'PKG_CORE_QUANTRI_03.';

    var TABS = [
        { key: 'vitri', text: 'Khai vai trò theo vị trí công việc', icon: 'fa-user-tie' },
        { key: 'qhld', text: 'Khai vai trò theo quan hệ lao động', icon: 'fa-people-arrows' },
        { key: 'pcld', text: 'Khai vai trò theo phân công lao động', icon: 'fa-list-check' }
    ];
    root.innerHTML = pat.page('Vai trò vị trí') + ui.tabs(TABS, 'vitri', 'data-vtab') +
        '<div class="ums-u-mt-4">' + TABS.map(function (t, i) { return '<div data-vpane="' + t.key + '"' + (i ? ' hidden' : '') + '></div>'; }).join('') + '</div>';
    function pane(k) { return root.querySelector('[data-vpane="' + k + '"]'); }

    V.man(pane('vitri'), { vaiTro: true });

    var tabs = {
        qhld: theoLoai(pane('qhld'), {
            dm: 'CORE.QUANHELAODONG.LOAI', loai: 'Loại quan hệ lao động', tieuDe: 'Danh sách vai trò theo loại quan hệ lao động',
            themTieuDe: 'Thêm vai trò theo loại quan hệ lao động', maKhoa: 'strEmployment_Type_Code', ck: 'data-qhck',
            cotLoai: function (x) { return e(x.EMPLOYMENT_TYPE_CODE_NAME || x.EMPLOYMENT_TYPE_CODE); },
            gets: ['ETMeAi4zJB4ELDEtLjgeFTgxJB4THgwgMR4GJDUy', 'Pr_Core_Employ_Type_R_Map_Gets'],
            ins: ['ETMeAi4zJB4ELDEtLjgeFTgxJB4THgwgMR4ILwPP', 'Pr_Core_Employ_Type_R_Map_In'],
            del: ['ETMeAi4zJB4ELDEtLjgeFTgxJB4THgwgMR4FJAPP', 'Pr_Core_Employ_Type_R_Map_De']
        }),
        pcld: theoLoai(pane('pcld'), {
            dm: 'CORE_ASSIGNMENT.ASSIGNMENT_TYPE_CODE', loai: 'Loại phân công lao động', tieuDe: 'Danh sách vai trò theo loại phân công lao động',
            themTieuDe: 'Thêm vai trò theo loại phân công lao động', maKhoa: 'strAssignment_Type_Code', ck: 'data-pcck',
            cotLoai: function (x) { return e(x.ASSIGNMENT_TYPE_CODE_NAME || x.ASSIGNMENT_TYPE_CODE); },
            gets: ['ETMeAi4zJB4AMjIoJi8eFTgxJB4THgwgMR4GJDUy', 'Pr_Core_Assign_Type_R_Map_Gets'],
            ins: ['ETMeAi4zJB4AMjIoJi8eFTgxJB4THgwgMR4ILwPP', 'Pr_Core_Assign_Type_R_Map_In'],
            del: ['ETMeAi4zJB4AMjIoJi8eFTgxJB4THgwgMR4FJAPP', 'Pr_Core_Assign_Type_R_Map_De']
        })
    };

    root.addEventListener('click', function (ev) {
        var a = ev.target.closest('[data-vtab]');
        if (!a || !root.contains(a)) return;
        var k = a.getAttribute('data-vtab');
        ui.tabsActive(root, k, 'data-vtab');
        TABS.forEach(function (t) { pane(t.key).hidden = t.key !== k; });
    });

    /* ---------- Tab 2 / 3: vai trò theo loại ---------- */
    function theoLoai(host, o) {
        var mst = pat.master({
            el: host,
            side: {
                title: 'Tìm kiếm', icon: 'fa-filter', search: false,
                filter: '<div class="ums-filter"><div class="ums-field"><select class="ums-select" data-l="loai" data-ph="' + ui.esc(o.loai) + '">' +
                    '<option value="">' + ui.esc(o.loai) + '</option></select></div></div>'   // chọn là tự nạp — bỏ nút "Xem" (BO-CUC 12)
            },
            main: { title: false }
        });
        mst.sideBody.hidden = true;
        mst.sideFoot.hidden = true;
        var sLoai = host.querySelector('[data-l="loai"]');
        var ck = o.ck;   // mỗi tab một thuộc tính ô đánh dấu riêng
        mst.mainBody.innerHTML =
            '<div data-l="ds">' + pat.panel({ title: o.tieuDe, icon: 'fa-user-shield', count: 'lDem', flush: true, zone: 'lBang',
                tools: ui.xoaChon('input[' + ck + ']', { goc: '.ums-panel', text: 'Xóa', attr: { 'data-l': 'xoa' } }) +
                    ui.btn('add', { attr: { 'data-l': 'them' } }),
                body: ui.empty('Chọn ' + o.loai.toLowerCase() + ' ở cột trái', 'fa-hand-pointer') }) + '</div>' +
            '<div data-l="form" data-z="lform" hidden>' + pat.panel({ title: o.themTieuDe, icon: 'fa-plus', zone: 'lBody',
                tools: ui.btn('close', { attr: { 'data-l': 'dong' } }) + ui.btn('save', { attr: { 'data-l': 'luu' } }),
                body: '<div class="ums-grid ums-grid--2">' +
                    V.o(o.loai, '<div class="ums-input" style="display:flex;align-items:center" data-l="loaiTen"></div>', { rong: true }) +
                    V.o('Chọn vai trò', '<select class="ums-select" data-scope="form" data-k="role" data-ph="Chọn vai trò"><option value="">Chọn vai trò</option></select>', { rong: true, required: true }) +
                    V.o('Ngày hiệu lực', V.ngay('tu')) + V.o('Ngày hết hiệu lực', V.ngay('den')) +
                    V.o('Tình trạng', '<select class="ums-select" data-scope="form" data-k="tt" data-required>' + V.TT + '</select>') +
                    V.o('Ghi chú', '<textarea class="ums-textarea" data-scope="form" data-k="ghichu"></textarea>', { rong: true }) +
                    '</div>' }) + '</div>';
        function q(k) { return host.querySelector('[data-l="' + k + '"]'); }
        function zz(k) { return host.querySelector('[data-z="' + k + '"]'); }
        var body = zz('lBody');
        var S = { loai: '', ds: [] };
        var dangForm = false;
        function sang(form) {
            if (form === dangForm) return;
            ui.swap(form ? q('ds') : q('form'), form ? q('form') : q('ds'), { top: false });
            dangForm = form;
        }
        function ten(v) { var op = Array.prototype.filter.call(sLoai.options, function (x) { return x.value === v; })[0]; return op ? op.textContent.trim() : ''; }
        function goi(p, them) {
            var c = { action: Q3 + p[0], func: PQ3 + p[1], strNguoiThucHien_Id: '', strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: '', strHanhDong_Code: '' };
            Object.keys(them).forEach(function (k) { c[k] = them[k]; });
            return c;
        }

        ums.api.dm(o.dm).then(function (r) { pat.fill(sLoai, r, { head: o.loai }); }).catch(function (err) { ums.api.handle(err, o.dm); });

        function nap() {
            var loai = sLoai.value;
            if (!loai) { ui.toast('Vui lòng chọn ' + o.loai + ' trước khi xem!', 'warn'); return; }
            S.loai = loai;
            zz('lBang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            var t = { strTuKhoa: '', strRole_Id: '', dIs_Active: '' };
            t[o.maKhoa] = loai;
            ums.api.call(goi(o.gets, t)).then(function (r) {
                if (S.loai !== loai) return;
                S.ds = C.rows(r).filter(function (x) { return x.IS_ACTIVE == 1; });
                zz('lDem').textContent = '(' + S.ds.length + ')';
                ui.table({
                    el: zz('lBang'), rows: S.ds, empty: 'Chưa khai vai trò cho loại này',
                    columns: [
                        { title: o.loai, render: function (x) { return ui.esc(o.cotLoai(x)); } },
                        { title: 'Vai trò', render: function (x) { return ui.esc(V.tenVaiTro(x)); } },
                        { title: 'Ngày hiệu lực', prop: 'START_DATE', cls: 'is-nowrap is-center' },
                        { title: 'Ngày hết hiệu lực', prop: 'END_DATE', cls: 'is-nowrap is-center' },
                        { title: 'Tình trạng', cls: 'is-center', render: V.badgeTT },
                        { title: 'Ghi chú', prop: 'NOTE' },
                        { head: '<input type="checkbox" data-lall title="Chọn tất cả">', cls: 'is-center', width: '44px',
                          render: function (x) { return '<input type="checkbox" ' + ck + '="' + ui.esc(x.ID) + '">'; } }
                    ]
                });
            }).catch(function (err) { zz('lBang').innerHTML = ui.fail(err.message); ums.api.handle(err, o.gets[1]); });
        }
        function them() {
            var loai = sLoai.value;
            if (!loai) { ui.toast('Vui lòng chọn ' + o.loai + ' trước!', 'warn'); return; }
            S.loaiThem = loai;
            q('loaiTen').textContent = ten(loai);
            ['role', 'tu', 'den', 'ghichu'].forEach(function (k) { V.dat(body, k, ''); });
            V.dat(body, 'tt', '1');
            V.vaiTro().then(function (rows) { pat.fill(body.querySelector('[data-k="role"]'), rows, { name: 'TENVAITRO', head: 'Chọn vai trò' }); });
            sang(true);
        }
        function luu() {
            var L = function (k) { return V.lay(body, k); };
            var loai = S.loaiThem || sLoai.value;
            if (!loai) { ui.toast('Thiếu ' + o.loai + '!', 'warn'); return; }
            if (!L('role')) { ui.toast('Vui lòng chọn vai trò!', 'warn'); return; }
            var t = { strRole_Id: L('role'), strStart_Date: L('tu'), strEnd_Date: L('den'), dIs_Active: L('tt'), strNote: L('ghichu') };
            t[o.maKhoa] = loai;
            ums.api.call(goi(o.ins, t)).then(function () {
                ui.toast('Thêm mới thành công!', 'ok');
                sang(false);
                if (sLoai.value) nap();
            }).catch(function (err) {
                var msg = e(err && err.message);
                if (/ORA-20021/.test(msg) || /Đã tồn tại/.test(msg)) {
                    ui.toast('Cấu hình này đã tồn tại (có thể đang ở trạng thái Hết hiệu lực). Vui lòng kích hoạt lại bản ghi cũ thay vì thêm mới.', 'warn');
                } else ums.api.handle(err, o.ins[1]);
            });
        }
        function xoa() {
            var ids = Array.prototype.map.call(zz('lBang').querySelectorAll('input[' + ck + ']:checked'), function (c) { return c.getAttribute(ck); });
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xóa' }).then(function (yes) {
                if (!yes) return;
                ui.batch(ids.map(function (id) { return goi(o.del, { strId: id }); }), { title: 'Đang xóa', okText: 'Xóa dữ liệu thành công!' })
                    .then(function (r) {
                        if (r.errors && r.errors.length) ui.toast('Xóa thất bại: ' + r.errors.join('; '), 'warn');
                        nap();
                    });
            });
        }

        jQuery(sLoai).on('select2:select', function () { if (sLoai.value) nap(); });
        host.addEventListener('change', function (ev) {
            if (ev.target.hasAttribute('data-lall')) {
                Array.prototype.forEach.call(zz('lBang').querySelectorAll('input[' + ck + ']'), function (c) { c.checked = ev.target.checked; });
            }
        });
        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('button[data-l]');
            if (!b || !host.contains(b)) return;
            switch (b.getAttribute('data-l')) {
                case 'xem': nap(); break;
                case 'them': them(); break;
                case 'luu': luu(); break;
                case 'dong': sang(false); break;
                case 'xoa': xoa(); break;
            }
        });
        ui.enhance(host);
        Array.prototype.forEach.call(host.querySelectorAll('[data-type="date"]'), function (x) { ui.datepicker(x); });
        return { nap: nap };
    }
})();
