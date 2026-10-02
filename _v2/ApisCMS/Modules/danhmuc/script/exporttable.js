/* =========================================================================
   Export Table — ExportTable
   Bản gốc: ApisCMS/Modules/danhmuc/html/exporttable.html + script/exporttable.js
   ---------------------------------------------------------------------------
   ⚠ "Import dữ liệu" GHI THẲNG dữ liệu từ tệp excel vào các bảng CSDL.

   Bố cục bản gốc (một cột, một khung): ô "id database" · Tìm kiếm ; ô chọn NHIỀU
   bảng · Tải file ; ô câu truy vấn ("Only: Select * from xxx") ; nút Import dữ liệu.
   Hộp "Import dữ liệu file excel": chọn tệp · vùng kết quả · Đóng · Upload.

   Lời gọi (chép nguyên):
       CMS_OraDBTableName/LayDanhSach   GET strDataBaseName → TABLE_NAME
       Tải file: location.href = <rootPathReport>/Modules/Common/ExportDataInTable.aspx
                 ?strTableNames=<các bảng đã chọn, nối ","> | <câu truy vấn khi chưa chọn bảng>
       Import:   edu.system.uploadImport → ums.upload(tệp) (up_fileImport.ashx, đường dẫn
                 nhân đôi "\" như gốc) → SYS_Import/ImportDataTable GET strPath
                 → "Đã import dữ liệu: <Message>" | "Lỗi: <Message>"

   Khác gốc:
     · Gốc import NGAY khi chọn xong tệp (ô tải tệp tự gọi callback); nút "Upload"
       của hộp không có xử lý. Nay: chọn tệp → bấm Upload → hỏi lại (ums.cmsCu.ghi)
       → tải lên → import.
     · strTableNames được mã hoá URL (encodeURIComponent) — gốc ghép chuỗi trần, câu
       truy vấn có "&", "#", "+" thì máy chủ nhận sai. Giá trị máy chủ đọc ra như cũ.
     · Chế độ dựng thử: không chuyển trang, chỉ báo đường dẫn sẽ mở.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, cu = ums.cmsCu;
    var root = document.getElementById('cms-exporttable');
    if (!root) return;

    root.innerHTML =
        pat.page('Export Table', '') +
        pat.panel({ title: false, body:
            '<div class="ums-stack">' +
                '<div class="ums-filter">' +
                    '<div class="ums-field cu-flex3"><input class="ums-input" data-f="db" placeholder="Nhập id database -> Chọn bảng cần xuất dữ liệu" autocomplete="off"></div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'tim' } }) + '</div>' +
                '</div>' +
                '<div class="ums-filter">' +
                    '<div class="ums-field cu-flex3"><select class="ums-select" data-f="bang" multiple data-ph="Chọn bảng dữ liệu"></select></div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('excel', { text: 'Tải file', mod: 'primary', icon: 'fa-download', attr: { 'data-a': 'tai' } }) + '</div>' +
                '</div>' +
                '<textarea class="ums-textarea cu-code cu-code--query" data-f="query" placeholder="Only: Select * from xxx" spellcheck="false"></textarea>' +
                '<div>' + ui.btn('importer', { text: 'Import dữ liệu', attr: { 'data-a': 'import' } }) + '</div>' +
            '</div>' });
    ui.enhance(root);

    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function bangChon() { return window.jQuery ? (jQuery(f('bang')).val() || []) : []; }

    function tim() {
        var db = f('db').value;
        if (!db) { ui.toast('Vui lòng nhập id database', 'warn'); return; }
        ums.api.call({ action: 'CMS_OraDBTableName/LayDanhSach', method: 'GET', strDataBaseName: db })
            .then(function (r) {
                var d = arr(r.data);
                if (!d.length) { ui.toast('Dữ liệu vào không đúng!', 'warn'); return; }
                pat.fill(f('bang'), d, { id: 'TABLE_NAME', name: 'TABLE_NAME' });
            })
            .catch(function (err) { ums.api.handle(err, 'lấy danh sách bảng'); });
    }

    function taiFile() {
        var ds = bangChon();
        var ten = ds.length ? ds.toString() : f('query').value;
        var url = cu.rootPathReport() + '/Modules/Common/ExportDataInTable.aspx?strTableNames=' + encodeURIComponent(ten);
        if (cu.demo()) { ui.toast('Dựng thử — trên máy chủ sẽ mở: ' + url, 'info', { timeout: 8000 }); return; }
        window.location.href = url;
    }

    function hopImport() {
        var dlg = ui.dialog({
            title: 'Import dữ liệu file excel', icon: 'fa-file-excel', size: 'md',
            body: ui.field('Chọn file excel', ui.file({ key: 'tep', accept: '.xls,.xlsx,.doc,.docx' })) +
                '<div class="cu-notify" data-z="kq"></div>',
            buttons: [{ text: 'Upload', kind: 'importer', icon: 'fa-upload', onClick: function (d) { upload(d); return false; } }]
        });
        ui.enhance(dlg.body);
    }

    function upload(dlg) {
        var inp = dlg.body.querySelector('input[type="file"]');
        var kq = dlg.body.querySelector('[data-z="kq"]');
        var tep = inp && inp.files && inp.files[0];
        if (!tep) { ui.toast('Bạn chưa chọn file nào!', 'warn'); return; }
        cu.ghi('Import dữ liệu từ tệp "' + tep.name + '" vào các bảng CSDL? Dữ liệu trong tệp được GHI THẲNG vào bảng, không có bước xem trước.', { ok: 'Upload' })
            .then(function (ok) {
                if (!ok) return;
                kq.classList.remove('is-bad');
                kq.textContent = 'Đang tải tệp lên…';
                return ums.upload(inp.files).then(function (duong) {
                    return ums.api.call({ action: 'SYS_Import/ImportDataTable', method: 'GET', strPath: duong });
                }).then(function (r) {
                    kq.textContent = 'Đã import dữ liệu: ' + cu.e(r.message);
                }).catch(function (err) {
                    kq.classList.add('is-bad');
                    kq.textContent = 'Lỗi: ' + err.message;
                });
            });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'tim') tim();
        else if (a === 'tai') taiFile();
        else if (a === 'import') hopImport();
    });
    f('db').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim(); } });
})();
