/* =========================================================================
   Cloud update — CloudUpdate
   Bản gốc: ApisCMS/Modules/danhmuc/html/cloudupdate.html + script/cloudupdate.js
   ---------------------------------------------------------------------------
   ⚠ TRIỂN KHAI MÃ LÊN MÁY CHỦ: lấy bản Publish của các project đã chọn từ Dropbox
   của tài khoản dev và ghi đè lên máy chủ được chọn.

   Bố cục bản gốc (một cột): khung "Upcode" — ô chọn máy chủ · ô chọn tài khoản
   dropbox · Update ; đoạn Hướng dẫn. Khung "Danh sách" — bảng Stt · Project · ô đánh dấu.

   Lời gọi (chép nguyên):
       Danh mục: CMS.UCSV (máy chủ, id = MA) · CMS.DUSER (tài khoản dropbox, id = MA)
                 · CMS.UCPR (project, cột TEN)
       Máy chủ = "HIENTAI":  CMS_UpCode/CloudUpdate  GET  strFileName, strUser
       Máy chủ khác:         GET <MA máy chủ>/CMSAPI/api/CMS_UpCode/CloudUpdate
                             ($.ajax crossDomain, không token) với chính các tham số đó
                             (kể cả action) — ums.cmsCu.goiNgoai
       strFileName = tên các project đã đánh dấu, nối "," (arr.toString()).
   Nhớ máy chủ / tài khoản đã chọn ở localStorage "strStoreServer" / "strStoreUser"
   như gốc (cùng khoá).

   Khác gốc:
     · Lỗi gốc: vòng lặp gọi CloudUpDate(TẤT CẢ project) N lần (N = số project đánh
       dấu) → cập nhật lặp lại N lần. Nay gọi MỘT lần.
     · Lỗi gốc: lời gọi lỗi (máy chủ không tới được…) vẫn báo "Update thành công".
       Nay báo lỗi thật.
     · Chưa chọn máy chủ thì báo và dừng (gốc gửi tới "undefined/CMSAPI/…").
     · Ô "chọn tất cả" ở đầu cột đánh dấu chạy được (gốc có ô nhưng không gắn xử lý).
     · Hỏi lại dùng hộp hỏi lại chung, nêu rõ máy chủ và project (gốc: "Bạn có chắc
       chắn muốn update").
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, cu = ums.cmsCu;
    var root = document.getElementById('cms-cloudupdate');
    if (!root) return;

    var dsServer = [], dsProject = [];

    root.innerHTML =
        pat.page('Cloud update', '') +
        pat.panel({ title: 'Upcode', icon: 'fa-upload', cls: 'ums-u-mb-4', body:
            '<div class="ums-filter">' +
                '<div class="ums-field"><select class="ums-select" data-f="server" data-ph="Chọn server"><option value="">Chọn server</option></select></div>' +
                '<div class="ums-field"><select class="ums-select" data-f="user" data-ph="Chọn tài khoản dropbox"><option value="">Chọn tài khoản dropbox</option></select></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('confirm', { text: 'Update', mod: 'primary', icon: 'fa-cloud-arrow-up', attr: { 'data-a': 'update' } }) + '</div>' +
            '</div>' +
            '<div class="cu-guide ums-u-mt-4">' +
                '<p><i class="fa-light fa-file-invoice"></i> <b>Hướng dẫn:</b></p>' +
                '<p>Mở Visual studio chọn Public project cần up. Chọn project xong click ấn Update<br>' +
                '<i>Chú ý: Tại máy dev phải cài Dropbox lên "D:\\Cloulds\\Dropbox"</i></p>' +
            '</div>' }) +
        pat.panel({ title: 'Danh sách', icon: 'fa-list-timeline', flush: true, zone: 'bang' });
    ui.enhance(root);

    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

    function napO(el, rows, khoa) {
        pat.fill(el, rows, { id: 'MA', name: 'TEN' });
        var nho = cu.lsGet(khoa);
        // default_val của loadToCombo_data: chọn lại giá trị đã nhớ nếu còn trong danh sách
        if (nho && rows.some(function (r) { return r.MA === nho; })) {
            el.value = nho;
            if (window.jQuery) jQuery(el).trigger('change.select2');
        }
    }

    ums.api.dm('CMS.UCSV').then(function (rows) { dsServer = rows; napO(f('server'), rows, 'strStoreServer'); })
        .catch(function (err) { ums.api.handle(err, 'nạp danh sách máy chủ'); });
    ums.api.dm('CMS.DUSER').then(function (rows) { napO(f('user'), rows, 'strStoreUser'); })
        .catch(function (err) { ums.api.handle(err, 'nạp tài khoản dropbox'); });
    ums.api.dm('CMS.UCPR').then(function (rows) {
        dsProject = rows;
        ui.table({ el: z('bang'), rows: rows, empty: 'Chưa khai báo project nào (danh mục CMS.UCPR)',
            columns: [
                { title: 'Project', prop: 'TEN' },
                { head: '<input type="checkbox" data-ckall title="Chọn tất cả">', cls: 'is-center is-actions', width: '48px',
                  render: function (r, i) { return '<input type="checkbox" data-ck="' + i + '">'; } }
            ] });
    }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'nạp danh sách project'); });

    if (window.jQuery) {
        jQuery(f('server')).on('select2:select', function () { cu.lsSet('strStoreServer', f('server').value); });
        jQuery(f('user')).on('select2:select', function () { cu.lsSet('strStoreUser', f('user').value); });
    }

    function update() {
        var ten = Array.prototype.map.call(z('bang').querySelectorAll('input[data-ck]:checked'), function (c) {
            return cu.e(dsProject[Number(c.getAttribute('data-ck'))].TEN);
        });
        if (!ten.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
        var server = f('server').value;
        if (!server) { ui.toast('Vui lòng chọn server', 'warn'); return; }
        var tenServer = (dsServer.filter(function (s) { return s.MA === server; })[0] || {}).TEN || server;
        var thamSo = { action: 'CMS_UpCode/CloudUpdate', strFileName: ten.toString(), strUser: f('user').value };

        cu.ghi('Cập nhật ' + ten.length + ' project (' + ten.join(', ') + ') từ Dropbox lên máy chủ "' + tenServer + '"? ' +
            'Mã đang chạy trên máy chủ đó bị ghi đè ngay.', { ok: 'Update' }).then(function (ok) {
            if (!ok) return;
            var p = server === 'HIENTAI'
                ? ums.api.call({ action: thamSo.action, method: 'GET', strFileName: thamSo.strFileName, strUser: thamSo.strUser })
                : cu.goiNgoai(server + '/CMSAPI/api/CMS_UpCode/CloudUpdate', thamSo);
            p.then(function () { ui.toast('Update thành công', 'ok'); })
                .catch(function (err) { ums.api.handle(err, 'cập nhật từ cloud'); });
        });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (b && root.contains(b) && b.getAttribute('data-a') === 'update') update();
    });
    root.addEventListener('change', function (ev) {
        if (!ev.target.hasAttribute('data-ckall')) return;
        Array.prototype.forEach.call(z('bang').querySelectorAll('input[data-ck]'), function (c) { c.checked = ev.target.checked; });
    });
})();
