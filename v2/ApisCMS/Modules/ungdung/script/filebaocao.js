/* =========================================================================
   File báo cáo
   Bản gốc: ApisCMS/Modules/ungdung/html/filebaocao.html + script/filebaocao.js
   (html gốc nạp "FileBaoCao.js" — IIS không phân biệt hoa thường)
   ---------------------------------------------------------------------------
   Một cột như bản gốc: thanh tìm (Ứng dụng · từ khoá · Tìm kiếm) + bảng tệp
   mẫu báo cáo của ứng dụng: Tên file · Download · Upload (thay tệp).

   Lời gọi (chép nguyên văn, đều là action kiểu cũ, GET):
       Danh mục CMS.UDBC                   ô "Ứng dụng" — mã (MA) = thư mục ứng dụng
       SYS_Report/Report_GetAllFile        strUngDung = "/" + MA + "/Upload", strLoai "*"
           Data = mảng đường dẫn vật lý; Pager = phần gốc cần cắt (dùng .replace như gốc)
       Tải tệp lên: Handler/up_fileImport.ashx?outFolderPath=Upload/File/ (uploadImport)
       CMS_UpCode/UpFileBaoCao             strPath = đường dẫn tệp cũ (dấu \ nhân đôi như gốc),
                                           strPathReplace = đường dẫn tệp vừa tải lên

   Giữ như gốc: chưa chọn ứng dụng thì không nạp; đổi ứng dụng = nạp ngay;
   Download mở strhost + "/" + (đường dẫn bỏ phần Pager); chọn tệp trong hộp
   Upload là tải lên và thay ngay (callback của uploadImport).

   Khác gốc:
     · Ô từ khoá: bản gốc KHÔNG gửi đi đâu (bấm Tìm kiếm chỉ nạp lại y nguyên).
       Ở đây lọc tại chỗ theo tên tệp.
     · Tổng số tệp: gốc ghi vào #lblFileBaoCao_Tong không tồn tại (html có
       #lblFile_Tong) nên không bao giờ hiện — nay hiện ở đầu khung.
     · Download: gốc đặt location.href (tệp xem được thì TRANG ứng dụng bị thay
       mất); ở đây mở tab mới.
     · Tải tệp lên tự viết trong màn thay ums.upload: ums.upload chỉ nhận
       .xls/.xlsx/.doc/.docx, còn mẫu báo cáo có thể là đuôi khác (uploadImport
       gốc đã bỏ kiểm tra đuôi) — đề nghị tầng chung thêm tuỳ chọn.
   Cố ý bỏ (mã chết): save_FileBaoCao / delete_FileBaoCao / viewForm_FileBaoCao
   (gọi NS_HeSo_Ngach — chép nhầm từ màn khác, không nút nào gọi), import_Table.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var root = document.getElementById('cms-filebaocao');
    if (!root) return;

    root.innerHTML =
        ums.pat.page('File báo cáo', '') +
        '<div class="ums-panel ums-u-mb-4"><div class="ums-panel__body"><div class="ums-filter">' +
            '<div class="ums-field"><select class="ums-select" data-a="ud" data-ph="Chọn ứng dụng"><option value="">Chọn ứng dụng</option></select></div>' +
            '<div class="ums-field"><input class="ums-input" data-a="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
            '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'tim' } }) + '</div>' +
        '</div></div></div>' +
        ums.pat.panel({ title: 'Danh sách', icon: 'fa-file-contract', count: 'dem', flush: true, body: '<div data-z="bang"></div>' });

    function $(s) { return root.querySelector(s); }
    var elUD = $('[data-a="ud"]'), elQ = $('[data-a="q"]'), elBang = $('[data-z="bang"]'), elDem = $('[data-z="dem"]');
    var dsUD = [], tep = [], goc = '';

    function S() { return ums.session || {}; }
    function host() { return S().host || location.origin; }
    function boDau(x) {
        return String(x === null || x === undefined ? '' : x).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
    }
    function tenTep(p) { return String(p).substring(String(p).lastIndexOf('\\') + 1); }

    function ve() {
        if (!elUD.value) {
            elBang.innerHTML = ui.empty('Chọn ứng dụng để xem các tệp báo cáo', 'fa-hand-pointer');
            elDem.textContent = '';
            return;
        }
        var q = boDau(elQ.value).trim();
        var rows = tep.map(function (p) { return { p: p, ten: tenTep(p) }; })
            .filter(function (x) { return !q || boDau(x.ten).indexOf(q) >= 0; });
        elDem.textContent = '(' + rows.length + ')';
        ui.table({
            el: elBang, rows: rows, empty: 'Không có tệp báo cáo',
            columns: [
                { title: 'Tên file', render: function (x) { return ui.esc(x.ten); } },
                { title: 'Download', cls: 'is-center', width: '90px', render: function (x, i) {
                    return '<button type="button" class="ums-iconbtn" data-a="down" data-i="' + i + '" title="' + ui.esc(x.p) + '">' +
                        '<i class="fa-light fa-cloud-arrow-down"></i></button>'; } },
                { title: 'Upload', cls: 'is-center', width: '90px', render: function (x, i) {
                    return '<button type="button" class="ums-iconbtn" data-a="up" data-i="' + i + '" title="' + ui.esc(x.p) + '">' +
                        '<i class="fa-light fa-cloud-arrow-up"></i></button>'; } }
            ]
        });
        ve.rows = rows;
    }

    function nap() {
        if (!elUD.value) { tep = []; ve(); return; }
        var ma = (dsUD.filter(function (u) { return String(u.ID) === elUD.value; })[0] || {}).MA || '';
        elBang.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        var tok = nap.tok = {};
        ums.api.call({
            action: 'SYS_Report/Report_GetAllFile',
            method: 'GET',
            strUngDung: '/' + ma + '/Upload',
            strLoai: '*'
        }).then(function (r) {
            if (nap.tok !== tok) return;
            tep = Array.isArray(r.data) ? r.data : [];
            goc = r.pager === undefined || r.pager === null ? '' : String(r.pager);
            ve();
        }).catch(function (err) {
            if (nap.tok !== tok) return;
            elBang.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'danh sách tệp báo cáo');
        });
    }

    /* Tải tệp lên như edu.system.uploadImport (Corei/systemroot.js:1072) —
       trả đường dẫn, dấu \ nhân đôi như bản gốc. */
    function taiLen(file) {
        if ((ums.state || {}).mode === 'demo') {
            return new Promise(function (ok) { setTimeout(function () { ok('Upload\\\\File\\\\' + file.name); }, 300); });
        }
        var fd = new FormData();
        fd.append(file.name, file);
        return fetch((S().rootPath || host()) + '/Handler/up_fileImport.ashx?outFolderPath=Upload/File/', { method: 'POST', body: fd, cache: 'no-store' })
            .then(function (res) {
                if (!res.ok) throw new Error(res.statusText || ('Máy chủ trả mã ' + res.status));
                return res.text();
            }).then(function (t) {
                if (t.indexOf('Loi System') !== -1) throw new Error(t);
                return t.replace(/\\/g, '\\\\');
            });
    }

    function moUpload(x) {
        var dlg = ui.dialog({
            title: 'Upload ' + x.ten, icon: 'fa-cloud-arrow-up', size: 'md',
            body: ui.field('- Upload ' + x.ten + ':', ui.file({ attr: { 'data-a': 'tep' } })) +
                '<div class="ums-u-faint ums-u-fz13 ums-u-mt-3">Chọn tệp là tải lên và thay ngay tệp đang có trên máy chủ.</div>'
        });
        var inp = dlg.body.querySelector('input[type=file]');
        ui.enhance(dlg.body);
        inp.addEventListener('change', function () {
            var f = inp.files && inp.files[0];
            if (!f) return;
            inp.disabled = true;
            taiLen(f).then(function (duongDan) {
                return ums.api.call({
                    action: 'CMS_UpCode/UpFileBaoCao',
                    method: 'GET',
                    strPath: x.p.replace(/\\/g, '\\\\'),
                    strPathReplace: duongDan
                });
            }).then(function () {
                ui.toast('Thực hiện thành công', 'ok');
                dlg.close();
            }).catch(function (err) {
                inp.disabled = false;
                ums.api.handle(err, 'thay tệp báo cáo');
            });
        });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'tim') nap();
        var x = ve.rows && ve.rows[Number(b.getAttribute('data-i'))];
        if (a === 'down' && x) window.open(host() + '/' + (goc ? x.p.replace(goc, '') : x.p), '_blank');
        if (a === 'up' && x) moUpload(x);
    });
    elQ.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); nap(); } });
    elQ.addEventListener('input', ve);
    if (window.jQuery) jQuery(elUD).on('select2:select select2:clear', nap);

    ums.api.dm('CMS.UDBC').then(function (rows) {
        dsUD = rows || [];
        ums.pat.fill(elUD, dsUD, { head: ums.pat.dmTitle(dsUD) || 'Chọn ứng dụng' });
    }).catch(function (err) { ums.api.handle(err, 'danh mục ứng dụng báo cáo'); });
    ve();
})();
