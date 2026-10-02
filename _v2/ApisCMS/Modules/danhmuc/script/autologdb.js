/* =========================================================================
   Nhật ký gọi hàm — AutoLog
   Bản gốc: ApisCMS/Modules/danhmuc/html/autologdb.html + script/autologdb.js
            (+ script/cutsouresql.js: SeaGate_CommentSQL, cutbugdata)
   ---------------------------------------------------------------------------
   ⚠ CÔNG CỤ SỬA MÃ CSDL: "Update" chạy `create or replace package body …` lên
   CSDL đang chạy — gắn thêm dòng `insert into bot values(…)` vào đầu MỌI
   procedure của package để ghi lại tham số mỗi lần được gọi.

   Bố cục bản gốc (một cột, hai vùng thay nhau — toggle_overide):
     · Vùng đầu: ô chọn Package · "Xem Code" ; khung "Danh sách các hàm đã gọi"
       (Tải lại · Clear Log) — bảng Stt · Package · Procedure · Time · Param · Data,
       gộp ô Procedure → Time (collageInTable cột 2..3).
     · Vùng sửa: "Khởi tạo" — ô mã pin · Update · Xóa Log ; hai khung
       "Code hiện tại" | "Code update".

   Lời gọi (CMS_OraDBTableName/*, chép nguyên):
       getListPackage      GET  strConnect ''                 → OBJECT_NAME
       getSourceLine       GET  strPackage, strType 'PACKAGE BODY', strConnect '' → TEXT
       getListBot          GET                                → A B C D E
       deleteBot           POST
       CreatAndAlterTable  POST strA = mã, strB = mã pin
   Chọn package → nạp mã, "Code update" = SeaGate_CommentSQL(mã) (thêm dòng log),
   "Xóa Log" → "Code update" = cutbugdata(mã hiện tại) (gỡ dòng log). Hai hàm
   này chép nguyên sang ums.cmsCu.commentSQL / cutBug (_cu.js), không eval.

   Khác gốc:
     · "Update" và "Clear Log" hỏi lại (ums.cmsCu.ghi) — gốc: Update hỏi bằng
       confirm chung, Clear Log xoá thẳng không hỏi.
     · "Code update" CHỈ ĐỌC: gốc cho gõ vào khung nhưng khi Update vẫn gửi
       biến me.strSQLUpdate (mã sinh tự động), sửa tay không có tác dụng — khoá
       lại để thấy đúng thứ sẽ gửi đi.
     · Chưa có mã (chưa chọn package) thì Update báo và dừng — gốc gửi chuỗi rỗng.
     · Gộp ô Procedure → Time luôn gộp; gốc bỏ qua gộp khi CẢ cột cùng một giá trị.
     · Bỏ đoạn thư chúc mừng tân sinh viên K66 dán nhầm ở cuối html gốc (không
       thuộc màn này) và bỏ tính chiều cao textarea theo cửa sổ (CSS lo).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, cu = ums.cmsCu;
    var root = document.getElementById('cms-autologdb');
    if (!root) return;
    var O = 'CMS_OraDBTableName/';
    var e = cu.e;

    var sqlHienTai = '', sqlUpdate = '';

    root.innerHTML =
        pat.page('Nhật ký gọi hàm', '') +
        '<div data-z="dau">' +
            pat.panel({ title: false, cls: 'ums-u-mb-4', body:
                '<div class="ums-filter">' +
                    '<div class="ums-field"><select class="ums-select" data-f="pkg" data-ph="Chọn package"><option value="">Chọn package</option></select></div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('view', { text: 'Xem Code', attr: { 'data-a': 'xem' } }) + '</div>' +
                    '<div class="ums-field ums-field--fit ums-u-flex1"></div>' +
                '</div>' }) +
            pat.panel({ title: 'Danh sách các hàm đã gọi', icon: 'fa-laptop-binary', flush: true, zone: 'bang',
                tools: ui.btn('reload', { mod: 'warn', attr: { 'data-a': 'tai' } }) +
                    ui.btn('del', { text: 'Clear Log', mod: 'out-danger', icon: 'fa-broom-wide', attr: { 'data-a': 'clear' } }) }) +
        '</div>' +
        '<div data-z="sua" hidden>' +
            pat.panel({ title: 'Khởi tạo', icon: 'fa-square-plus', body:
                '<div class="ums-filter">' +
                    '<div class="ums-field"><input type="password" class="ums-input" data-f="pin" placeholder="Password" autocomplete="new-password"></div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('confirm', { text: 'Update', mod: 'danger', icon: 'fa-cloud-arrow-up', attr: { 'data-a': 'update' } }) + '</div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('del', { text: 'Xóa Log', mod: 'out-danger', attr: { 'data-a': 'xoalog', title: 'Gỡ các dòng ghi log khỏi "Code update" (chưa ghi gì vào CSDL cho tới khi bấm Update)' } }) + '</div>' +
                    '<div class="ums-field ums-field--fit ums-u-flex1"></div>' +
                '</div>',
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) }) +
            '<div class="cu-cols">' +
                pat.panel({ title: 'Code hiện tại', icon: 'fa-window-restore', body: '<textarea class="ums-textarea cu-code cu-code--tall" data-f="hientai" readonly spellcheck="false"></textarea>' }) +
                pat.panel({ title: 'Code update', icon: 'fa-window-restore', body: '<textarea class="ums-textarea cu-code cu-code--tall" data-f="update" readonly spellcheck="false"></textarea>' }) +
            '</div>' +
        '</div>';
    ui.enhance(root);

    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function arr(d) { return Array.isArray(d) ? d : []; }

    function moSua() { ui.swap(z('dau'), z('sua')); }
    function veDau() { ui.swap(z('sua'), z('dau')); }

    /* ---------- Package ---------- */
    function taiPackage() {
        return ums.api.call({ action: O + 'getListPackage', method: 'GET', strConnect: '' })
            .then(function (r) {
                var d = arr(r.data);
                if (!d.length) { ui.toast('Dữ liệu vào không đúng!', 'warn'); return; }
                pat.fill(f('pkg'), d, { id: 'OBJECT_NAME', name: 'OBJECT_NAME' });
            })
            .catch(function (err) { ums.api.handle(err, 'nạp danh sách package'); });
    }

    function taiMa() {
        var pkg = f('pkg').value;
        if (!pkg) return;
        ums.api.call({ action: O + 'getSourceLine', method: 'GET', strPackage: pkg, strType: 'PACKAGE BODY', strConnect: '' })
            .then(function (r) {
                var d = arr(r.data);
                if (!d.length) { ui.toast('Dữ liệu vào không đúng!', 'warn'); return; }
                var s = 'create or replace ';
                d.forEach(function (x) { s += e(x.TEXT); });
                sqlHienTai = s;
                sqlUpdate = cu.commentSQL(s);
                f('hientai').value = sqlHienTai;
                f('update').value = sqlUpdate;
            })
            .catch(function (err) { ums.api.handle(err, 'nạp mã package'); });
    }

    /* ---------- Nhật ký ---------- */
    function taiLog() {
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: O + 'getListBot', method: 'GET' })
            .then(function (r) {
                ui.table({ el: z('bang'), rows: arr(r.data), empty: 'Chưa có hàm nào được ghi log',
                    columns: [
                        { title: 'Package', prop: 'A', cls: 'is-center' },
                        { title: 'Procedure', prop: 'B', cls: 'is-center' },
                        { title: 'Time', prop: 'C', cls: 'is-center is-nowrap', width: '150px' },
                        { title: 'Param', prop: 'D', cls: 'is-center' },
                        { title: 'Data', prop: 'E', cls: 'is-center' }
                    ] });
                cu.gopO(z('bang').querySelector('table'), [2, 3]);
            })
            .catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'nạp nhật ký gọi hàm'); });
    }

    function clearLog() {
        cu.ghi('Xoá TOÀN BỘ nhật ký gọi hàm (bảng BOT) trên CSDL? Không khôi phục được.', { ok: 'Clear Log' }).then(function (ok) {
            if (!ok) return;
            ums.api.call({ action: O + 'deleteBot', method: 'POST' })
                .then(taiLog)
                .catch(function (err) { ums.api.handle(err, 'xoá nhật ký'); });
        });
    }

    function update() {
        if (!sqlUpdate) { ui.toast('Chưa có mã để cập nhật — hãy chọn package trước.', 'warn'); return; }
        var pin = f('pin').value;
        cu.ghi('Chạy "create or replace" package ' + (f('pkg').value || '') + ' lên CSDL đang chạy bằng nội dung khung "Code update"? ' +
            'Mã của package sẽ bị ghi đè ngay; nếu mã lỗi, package mất hiệu lực cho tới khi sửa.', { ok: 'Update' })
            .then(function (ok) {
                if (!ok) return;
                f('pin').value = '';          // gốc xoá ô pin ngay khi gửi
                ums.api.call({ action: O + 'CreatAndAlterTable', method: 'POST', strA: sqlUpdate, strB: pin })
                    .then(function () { ui.toast('Thực hiện thành công', 'ok'); veDau(); })
                    .catch(function (err) { ums.api.handle(err, 'cập nhật package'); });
            });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'xem') moSua();
        else if (a === 'dong') veDau();
        else if (a === 'tai') taiLog();
        else if (a === 'clear') clearLog();
        else if (a === 'update') update();
        else if (a === 'xoalog') { sqlUpdate = cu.cutBug(sqlHienTai); f('update').value = sqlUpdate; }
    });
    // Gốc nghe select2:select → nạp mã và mở vùng sửa
    if (window.jQuery) jQuery(f('pkg')).on('select2:select', function () { taiMa(); moSua(); });

    taiPackage();
    taiLog();
})();
