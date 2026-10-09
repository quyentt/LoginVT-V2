/* =========================================================================
   Gửi email (danh sách thư đã soạn sẵn → gửi hàng loạt)
   Bản gốc: ApisCMS/Modules/hethong/html/guiemail.html + script/guiemail.js
   ---------------------------------------------------------------------------
   Một cột như bản gốc: khung tìm kiếm (trái: từ khoá, Tìm kiếm, Import, Xuất
   báo cáo, tệp đính kèm | phải: thông tin người gửi) + ô "Danh mục người gửi"
   + bảng Danh sách (Gửi / Xóa).

   Lời gọi — chép nguyên văn:
       CMS_Email_ThongTin/LayDanhSach   GET   strTuKhoa, strNguoiTao_Id (= người đăng
                                              nhập), dTinhTrang 0, pageIndex 1, pageSize 10000000
       CMS_NguoiDung/SendEmail          POST  mailTo, mailSubject, strBody, arrFileDinhKem[]
                                              + (tuỳ chọn) mailFrom, mailPass, hostname, displayName
       CMS_Email_ThongTin/CapNhat_DaGui POST  strId       (gọi sau MỖI lần gửi thành công)
       CMS_Email_ThongTin/Xoa           POST  strIds      (mỗi dòng một lời gọi)
       Danh mục người gửi: loadToCombo_DanhMucDuLieu("CMS.TKEMAIL") —
           MA = địa chỉ, TEN = tên hiển thị, THONGTIN1 = host, THONGTIN2 = mật khẩu.
       Import: mục cứng "1. Import gửi email" (btnImportWithProce, mã
           IMPORTWITHPROC_GUIEMAIL) → ums.report.importChung, xong thì nạp lại.
           Như gốc: chức năng có mẫu import theo quyền thì nút cứng bị thay.
       Xuất báo cáo: getList_MauImport("zonebtnBaoCao_GE") → ums.report.mount
           (callback gốc rỗng — không thêm tham số nào).

   Giữ như gốc (ghi can-quyet):
     · Ô từ khoá: gốc gửi strTuKhoa từ ô txtAAAA KHÔNG tồn tại → luôn rỗng. Giữ
       gửi rỗng; ô từ khoá lọc trên danh sách đã tải (ums.pat.loc).
     · Chọn N người gửi ở "Danh mục người gửi" thì MỖI thư được gửi N lần (mỗi
       người gửi một lần) — gốc lặp arrId.forEach. Hàm chọn ngẫu nhiên một
       người gửi (getRomdomEmail) của gốc chỉ dùng để console.log.
     · Không chọn người gửi nào: gửi kèm thông tin 4 ô bên phải CHỈ KHI đánh
       dấu "Sử dụng người gửi này"; khi đó bốn ô (kể cả MẬT KHẨU) được lưu
       vào localStorage 'nguoiguiemail' của trình duyệt và tự điền lần sau —
       như gốc.
     · Thân thư gửi đúng NOIDUNG từ máy chủ (gốc đọc innerHTML của ô bảng).
   Khác gốc:
     · Hỏi lại → gửi tuần tự qua ums.ui.batch (gốc bắn cùng lúc, mỗi thư một
       thông báo "Đã gửi email"); xong báo gộp và nạp lại danh sách.
     · Tệp đính kèm: ô chọn tệp chuẩn (ums.ui.file), tải lên ngay khi chọn qua
       Handler/up_fileImport.ashx như uploadImport gốc. KHÔNG giới hạn đuôi
       tệp (gốc không chặn; ums.upload chặn chỉ còn xls/doc — viết tạm hàm tải
       lên ở đây, xin tầng chung tuỳ chọn bỏ kiểm đuôi).
     · Nội dung thư trong bảng hiện dạng CHỮ (bỏ thẻ HTML) — gốc đổ thẳng HTML
       từ CSDL vào bảng.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var root = document.getElementById('cms-guiemail');
    if (!root) return;

    var S = { rows: [], duongDan: '', dsNguoiGui: [] };
    var LS_KEY = 'nguoiguiemail';

    root.innerHTML =
        pat.page('Gửi email', '<span data-z="report"></span>') +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            '<div class="ums-grid ums-grid--12">' +
                '<div class="ums-stack cmsht-ge-trai">' +
                    '<div class="ums-filter">' +
                        '<div class="ums-field"><input class="ums-input" data-k="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                        '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
                        '<div class="ums-field ums-field--fit">' + ui.btn('importer', { text: 'Import gửi email', attr: { 'data-a': 'import' } }) + '</div>' +
                    '</div>' +
                    ui.field('Chọn file đính kèm', ui.file({ key: 'dinhKem', multiple: true, pick: 'Chọn file' }), { inline: true }) +
                '</div>' +
                '<div class="ums-stack cmsht-ge-phai">' +
                    '<input class="ums-input" data-k="mailFrom" placeholder="Email" autocomplete="off">' +
                    '<input class="ums-input" data-k="mailPass" type="password" placeholder="Mật khẩu" autocomplete="new-password">' +
                    '<input class="ums-input" data-k="hostname" placeholder="Host Mail" autocomplete="off">' +
                    '<input class="ums-input" data-k="displayName" placeholder="Tên người gửi" autocomplete="off">' +
                    '<label class="ums-check"><input type="checkbox" data-k="dungNguoiGui"> Sử dụng người gửi này</label>' +
                '</div>' +
                '<div class="cmsht-ge-full">' +
                    ui.field('Danh mục người gửi', '<select class="ums-select" data-k="nguoiGui" multiple data-ph="Chọn người gửi"></select>') +
                '</div>' +
            '</div>' }) +
        pat.panel({ title: 'Danh sách', icon: 'fa-address-book', count: 'tong', flush: true, zone: 'bang',
            tools: ui.btn('save', { text: 'Gửi', icon: 'fa-paper-plane-top', attr: { 'data-a': 'gui' } }) +
                ui.xoaChon('input[data-chon]', { goc: '.ums-panel', text: 'Xóa', attr: { 'data-a': 'xoa' } }) });

    function o(k) { return root.querySelector('[data-k="' + k + '"]'); }
    var elBang = root.querySelector('[data-z="bang"]');
    var elTong = root.querySelector('[data-z="tong"]');

    /* Người gửi đã lưu ở trình duyệt (như gốc) */
    try {
        var cu = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
        if (cu) { o('mailFrom').value = cu.mailFrom || ''; o('mailPass').value = cu.mailPass || ''; o('hostname').value = cu.hostname || ''; o('displayName').value = cu.displayName || ''; }
    } catch (e) { /* không đọc được thì thôi */ }

    ums.api.dm('CMS.TKEMAIL').then(function (rows) {
        S.dsNguoiGui = rows || [];
        pat.fill(o('nguoiGui'), S.dsNguoiGui, { name: function (r) { return (r.TEN || '') + (r.MA ? ' <' + r.MA + '>' : ''); } });
    }).catch(function (err) { ums.api.handle(err, 'CMS.TKEMAIL'); });

    /* Vùng gốc "zonebtnBaoCao_GE_Import" CHỨA SẴN mục cứng "Import gửi email"; getList_MauImport
       chỉ ghi đè vùng đó khi chức năng có mẫu import theo quyền → có mẫu import thì ẩn nút cứng
       (nút Import của ums.report thay chỗ), không có thì giữ nút cứng. */
    ums.report.mount(root.querySelector('[data-z="report"]'), {
        collect: function () { },
        onImported: function () { nap(); },
        onLoad: function (rows) {
            var co = (rows || []).some(function (t) {
                var m = String(t.MAUIMPORT_MA || '');
                return m.length > 14 && /^(IMPORTWITHPROC|IMPORTALLINPUT)$/i.test(m.substring(0, 14));
            });
            var nut = root.querySelector('[data-a="import"]');
            if (nut) nut.closest('.ums-field').hidden = co;
        }
    });

    /* HTML thư → chữ thường. DOMParser dựng tài liệu TRƠ (không chạy script, không tải ảnh). */
    function chu(html) {
        var s = String(html == null ? '' : html).replace(/<br\s*\/?>|<\/(p|div|li|tr|h[1-6])>/gi, ' ');
        var doc = new DOMParser().parseFromString(s, 'text/html');
        Array.prototype.forEach.call(doc.querySelectorAll('script, style'), function (x) { x.parentNode.removeChild(x); });
        return ((doc.body && doc.body.textContent) || '').replace(/\s+/g, ' ').trim();
    }

    function ve() {
        var ds = pat.loc(S.rows, o('q').value, ['EMAIL', 'TIEUDE', 'NOIDUNG']);
        elTong.textContent = '(' + S.rows.length + ')';
        ui.table({
            el: elBang, rows: ds, empty: 'Không có thư chờ gửi',
            columns: [
                { title: 'Người nhận', prop: 'EMAIL' },
                { title: 'Tiêu đề', prop: 'TIEUDE' },
                { title: 'Nội dung', render: function (r) { var t = chu(r.NOIDUNG); return '<span title="' + esc(t) + '">' + esc(t.length > 220 ? t.slice(0, 220) + '…' : t) + '</span>'; } },
                { head: '<input type="checkbox" data-chon-all title="Chọn tất cả">', cls: 'is-center', width: '48px',
                    render: function (r) { return '<input type="checkbox" data-chon value="' + esc(r.ID) + '">'; } }
            ]
        });
    }

    function nap() {
        elBang.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: 'CMS_Email_ThongTin/LayDanhSach', method: 'GET',
            strTuKhoa: '', strNguoiTao_Id: ums.session.userId, dTinhTrang: 0, pageIndex: 1, pageSize: 10000000
        }).then(function (r) {
            S.rows = r.data || [];
            ve();
        }).catch(function (err) {
            elBang.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'CMS_Email_ThongTin/LayDanhSach');
        });
    }

    function daChon() {
        var ids = Array.prototype.map.call(elBang.querySelectorAll('input[data-chon]:checked'), function (x) { return x.value; });
        return S.rows.filter(function (r) { return ids.indexOf(String(r.ID)) >= 0; });
    }

    /* Tải tệp đính kèm — uploadImport gốc: up_fileImport.ashx, KHÔNG kiểm đuôi.
       Tạm viết ở đây (ums.upload chặn chỉ còn xls/xlsx/doc/docx). */
    function taiLen(files) {
        var list = Array.prototype.slice.call(files || []);
        if (!list.length) return Promise.reject(new Error('Bạn chưa chọn file nào!'));
        var names = list.map(function (f) { return f.name; });
        function xong(text) {
            if (String(text).indexOf('Loi System') !== -1) throw new Error(text);
            var ps = names.length > 1 ? String(text).split(',') : [String(text)];
            if (ps.length !== names.length) throw new Error('File đính kèm không hợp lệ. Vui lòng thử lại');
            return ps.join(',').replace(/\\/g, '\\\\');
        }
        if (ums.state && ums.state.mode === 'demo') {
            return new Promise(function (ok) { setTimeout(function () { ok(xong(names.map(function (x) { return 'Upload/File/' + x; }).join(','))); }, 300); });
        }
        var fd = new FormData();
        list.forEach(function (f) { fd.append(f.name, f); });
        var goc = (ums.session && (ums.session.rootPath || ums.session.host)) || location.origin;
        return fetch(goc + '/Handler/up_fileImport.ashx?outFolderPath=Upload/File/', { method: 'POST', body: fd, cache: 'no-store' })
            .then(function (res) { if (!res.ok) throw new Error('Máy chủ trả mã ' + res.status); return res.text(); })
            .then(xong);
    }
    o('dinhKem').addEventListener('change', function () {
        var f = o('dinhKem').files;
        if (!f || !f.length) { S.duongDan = ''; return; }
        taiLen(f).then(function (p) { S.duongDan = p; ui.toast('Đã tải tệp đính kèm lên', 'ok'); })
            .catch(function (err) { S.duongDan = ''; ums.api.handle(err, 'tải tệp đính kèm'); });
    });

    /* btnSave_GuiEmail */
    function gui() {
        var obj;
        if (o('dungNguoiGui').checked) {
            obj = { mailFrom: o('mailFrom').value, mailPass: o('mailPass').value, hostname: o('hostname').value, displayName: o('displayName').value };
            try { localStorage.setItem(LS_KEY, JSON.stringify(obj)); } catch (e) { /* bỏ qua */ }
        }
        var rows = daChon();
        if (!rows.length) { ui.toast('Vui lòng chọn đối tượng gửi?', 'warn'); return; }
        var ids = window.jQuery ? (jQuery(o('nguoiGui')).val() || []) : [];
        var ds = [];
        rows.forEach(function (r) {
            var tep = String(S.duongDan).split(',');
            var cuoc = ids.length ? ids.map(function (id) {
                var g = S.dsNguoiGui.filter(function (x) { return String(x.ID) === String(id); })[0] || {};
                return { mailFrom: g.MA, mailPass: g.THONGTIN2, hostname: g.THONGTIN1, displayName: g.TEN };
            }) : [obj];
            cuoc.forEach(function (ng) {
                ds.push(function () {
                    var p = { action: 'CMS_NguoiDung/SendEmail', mailTo: r.EMAIL, mailSubject: r.TIEUDE, strBody: r.NOIDUNG, arrFileDinhKem: tep, silent: true };
                    if (ng) Object.keys(ng).forEach(function (k) { p[k] = ng[k]; });
                    return ums.api.call(p).catch(function (e) {
                        if (!e.expired) e.message = (ng && ng.mailFrom ? ng.mailFrom + ' → ' : '') + r.EMAIL + ': ' + e.message;
                        throw e;
                    }).then(function () {
                        return ums.api.call({ action: 'CMS_Email_ThongTin/CapNhat_DaGui', strId: r.ID, silent: true });
                    });
                });
            });
        });
        ui.confirm('Bạn có chắc chắn gửi không? (' + rows.length + ' thư' + (ids.length > 1 ? ' × ' + ids.length + ' người gửi' : '') + ')',
            { title: 'Gửi email', ok: 'Gửi' }).then(function (yes) {
            if (!yes) return;
            return ui.batch(ds, { title: 'Đang gửi email' }).then(function (r) {
                ui.toast('Gửi email: ' + r.ok + ' thành công, ' + r.fail + ' thất bại', r.fail ? 'warn' : 'ok');
                nap();
            });
        });
    }

    /* btnXoaGuiEmail */
    function xoa() {
        var rows = daChon();
        if (!rows.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá dữ liệu' }).then(function (yes) {
            if (!yes) return;
            return ui.batch(rows.map(function (r) { return { action: 'CMS_Email_ThongTin/Xoa', strIds: r.ID, silent: true }; }),
                { title: 'Đang xoá' }).then(function (r) {
                ui.toast(r.fail ? 'Xoá ' + r.ok + ' dòng, lỗi ' + r.fail : 'Xóa dữ liệu thành công!', r.fail ? 'warn' : 'ok');
                nap();
            });
        });
    }

    root.addEventListener('click', function (e) {
        var all = e.target.closest('[data-chon-all]');
        if (all) {
            Array.prototype.forEach.call(elBang.querySelectorAll('input[data-chon]'), function (x) { x.checked = all.checked; });
            return;
        }
        var b = e.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') nap();
        else if (a === 'gui') gui();
        else if (a === 'xoa') xoa();
        else if (a === 'import') ums.report.importChung('gửi email', 'IMPORTWITHPROC_GUIEMAIL', { onDone: nap });
    });
    o('q').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); nap(); } });
    o('q').addEventListener('input', ve);

    nap();
})();
