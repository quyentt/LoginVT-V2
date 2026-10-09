/* =========================================================================
   Quản lý tiến trình gửi email
   Bản gốc: ApisCMS/Modules/hangdoi/html/quanlytientrinhguiemail.html
            + scripts/quanlytientrinhguiemail.js
   ---------------------------------------------------------------------------
   Một cột như bản gốc: thanh lọc + bảng "Tiến trình gửi email"; bấm địa chỉ
   "Gửi tới" → khung "Chi tiết Email" THAY CHỖ danh sách (gốc toggle_overide),
   bên trong hai cột col-md-4 (thông tin thư) | col-md-8 (Lịch sử gửi Email).

   Lời gọi — chép nguyên văn (mọi lời gọi GET, versionAPI 'v1.0'):
       CMS_TienIch/LayDS_CauTrucNoiDungGuiEmail  strTuKhoa "", strNguoiTao_Id "", pageIndex 1, pageSize 100000  (tên = MA)
       CMS_TienIch/LayDS_TienTrinhGuiEmail       strTuKhoa, strNguoiTao_Id "", strTuNgay, strDenNgay,
                                                 strDaGui "" (ô drpTrangThaiGuiMail KHÔNG có trên màn gốc),
                                                 strCauTrucNoiDungGuiEmailId, pageIndex, pageSize
       CMS_TienIch/ThucHienGuiEmail              ArrstrId "id1,id2", strHanhDong "GUILAI", strNguoiThucHien_Id
       CMS_TienIch/LayDS_LichSuGuiEmailBy        strTuKhoa (ô từ khoá của thanh lọc — như gốc),
                                                 strNguoiTao_Id "", strHangDoiGuiEmail_Id, pageIndex, pageSize
   Cột: MAILTO (ký tự mã 4 đầu tiên đổi thành "@" — như gốc), NOIDUNGEMAIL,
        NGAYGUI, DAGUI (1 Thành công · 0 Chưa gửi · 2 Gửi lỗi + LOIGUIMAIL),
        MAILSUBJECT (khung chi tiết).

   Giữ như gốc: mở màn KHÔNG tự nạp danh sách — bấm "Tìm kiếm".
   Khác gốc:
     · "Thực hiện gửi email": hỏi lại → gửi → nạp lại SAU khi máy chủ trả lời
       (gốc hẹn giờ 2 giây, kể cả khi người dùng bấm Huỷ).
     · Phân trang lịch sử: gốc gọi nhầm genTable_LichSuGuiEmail() (vẽ lại rỗng)
       khi bấm sang trang → nay nạp đúng trang.
     · Nội dung thư: bảng hiện dạng CHỮ (bỏ thẻ); khung chi tiết hiện bản HTML
       trong <iframe sandbox> (không chạy script) — gốc đổ thẳng HTML từ CSDL.
     · Hộp danh sách cấu trúc mail gốc nạp HAI lần — nạp một lần.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var root = document.getElementById('cms-qlttguiemail');
    if (!root) return;

    var size0 = (ums.cfg && ums.cfg.behavior && ums.cfg.behavior.pageSize) || 10;
    var T = { index: 1, size: size0, total: 0, rows: [] };
    var L = { index: 1, size: size0, total: 0, id: '' };

    root.innerHTML =
        '<div data-z="ds">' +
            pat.page('Quản lý tiến trình gửi email', '') +
            pat.filterBar([
                { key: 'cauTruc', type: 'select', label: '--Chọn cấu trúc--' },
                { key: 'tu', type: 'date', label: 'Từ ngày' },
                { key: 'den', type: 'date', label: 'Đến ngày' },
                { key: 'q', label: 'Nhập từ khóa tìm kiếm' }
            ], { extra: '<div class="ums-field ums-field--fit">' +
                ui.btn('save', { text: 'Thực hiện gửi email', icon: 'fa-envelope-open-text', attr: { 'data-a': 'gui' } }) + '</div>' }) +
            pat.panel({ title: 'Tiến trình gửi email', icon: 'fa-envelope-open-text', count: 'tong', flush: true, zone: 'bang' }) +
        '</div>' +
        '<div data-z="ct" hidden>' +
            pat.panel({ title: 'Chi tiết Email', icon: 'fa-envelope-open-text',
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }),
                body: '<div class="cmshd-ct-cols">' +
                    '<div data-z="thu"></div>' +
                    pat.panel({ title: 'Lịch sử gửi Email', icon: 'fa-clock-rotate-left', count: 'tongLs', flush: true, zone: 'ls' }) +
                    '</div>' }) +
        '</div>';

    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function F(k) { return root.querySelector('[data-f="' + k + '"]'); }

    ums.api.call({ action: 'CMS_TienIch/LayDS_CauTrucNoiDungGuiEmail', method: 'GET', versionAPI: 'v1.0', silent: true,
        strTuKhoa: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 })
        .then(function (r) { pat.fill(F('cauTruc'), r.data || [], { name: 'MA', head: '--Chọn cấu trúc--' }); })
        .catch(function (err) { ums.api.handle(err, 'CMS_TienIch/LayDS_CauTrucNoiDungGuiEmail'); });

    function mailTo(r) { return String(r.MAILTO == null ? '' : r.MAILTO).replace(String.fromCharCode(4), '@'); }
    /* HTML thư → chữ thường. DOMParser dựng tài liệu TRƠ (không chạy script, không tải ảnh). */
    function chu(html) {
        var s = String(html == null ? '' : html).replace(/<br\s*\/?>|<\/(p|div|li|tr|h[1-6])>/gi, ' ');
        var doc = new DOMParser().parseFromString(s, 'text/html');
        Array.prototype.forEach.call(doc.querySelectorAll('script, style'), function (x) { x.parentNode.removeChild(x); });
        return ((doc.body && doc.body.textContent) || '').replace(/\s+/g, ' ').trim();
    }
    function trangThai(r) {
        var v = String(r.DAGUI == null ? '' : r.DAGUI);
        if (v === '1') return ui.badge('Thành công', 'ok');
        if (v === '0') return ui.badge('Chưa gửi', 'mute');
        if (v === '2') return ui.badge('Gửi lỗi', 'bad') + (r.LOIGUIMAIL ? '<div class="ums-cell__sub">' + esc(r.LOIGUIMAIL) + '</div>' : '');
        return '';
    }
    function noiDung(r) {
        var t = chu(r.NOIDUNGEMAIL);
        return '<span title="' + esc(t) + '">' + esc(t.length > 200 ? t.slice(0, 200) + '…' : t) + '</span>';
    }

    /* getList_TienTrinhGuiEmail */
    function nap(p) {
        if (p) T.index = p;
        var el = z('bang');
        el.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: 'CMS_TienIch/LayDS_TienTrinhGuiEmail', method: 'GET', versionAPI: 'v1.0',
            strTuKhoa: F('q').value.trim(),
            strNguoiTao_Id: '',
            strTuNgay: F('tu').value,
            strDenNgay: F('den').value,
            strDaGui: '',
            strCauTrucNoiDungGuiEmailId: F('cauTruc').value,
            pageIndex: T.index,
            pageSize: T.size
        }).then(function (r) {
            T.rows = r.data || [];
            T.total = Number(r.pager) || T.rows.length;
            z('tong').textContent = '(' + T.total + ')';
            ui.table({
                el: el, rows: T.rows, empty: 'Không có dữ liệu',
                page: { index: T.index, size: T.size, total: T.total,
                    onChange: function (x) { if (x >= 1 && x <= Math.ceil(T.total / T.size)) nap(x); },
                    onSize: function (v) { T.size = v; nap(1); } },
                columns: [
                    { title: 'Gửi tới', cls: 'is-nowrap', render: function (r) {
                        return '<button type="button" class="ums-link" data-xem="' + esc(r.ID) + '" title="' + esc(mailTo(r)) + '">' + esc(mailTo(r)) + '</button>';
                    } },
                    { title: 'Nội dung', render: noiDung },
                    { title: 'Ngày gửi', prop: 'NGAYGUI', cls: 'is-nowrap is-center' },
                    { title: 'Trạng thái gửi', render: trangThai },
                    { head: '<input type="checkbox" data-chon-all title="Chọn tất cả">', cls: 'is-center', width: '48px',
                        render: function (r) { return '<input type="checkbox" data-chon value="' + esc(r.ID) + '">'; } }
                ]
            });
        }).catch(function (err) {
            el.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'CMS_TienIch/LayDS_TienTrinhGuiEmail');
        });
    }

    /* btn_ThucHienGuiEmail → ThucHienGuiEmail */
    function gui() {
        var ids = Array.prototype.map.call(z('bang').querySelectorAll('input[data-chon]:checked'), function (x) { return x.value; });
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần gửi', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn gửi? (' + ids.length + ' thư)', { title: 'Thực hiện gửi email', ok: 'Gửi' }).then(function (yes) {
            if (!yes) return;
            return ums.api.call({ action: 'CMS_TienIch/ThucHienGuiEmail', method: 'GET', versionAPI: 'v1.0',
                ArrstrId: ids.join(','), strHanhDong: 'GUILAI', strNguoiThucHien_Id: ums.session.userId })
                .then(function () { ui.toast('Đã gửi yêu cầu gửi lại ' + ids.length + ' thư', 'ok'); return nap(); });
        }).catch(function (err) { ums.api.handle(err, 'CMS_TienIch/ThucHienGuiEmail'); });
    }

    /* viewEdit_ChiTietHangDoiGuiEmail */
    function xem(id) {
        var r = T.rows.filter(function (x) { return String(x.ID) === String(id); })[0];
        if (!r) { ui.toast('Cột dữ liệu chọn không đúng', 'warn'); return; }
        L.id = r.ID; L.index = 1;
        z('thu').innerHTML =
            '<div class="ums-stack">' +
            '<div class="ums-kv"><span>Tiêu đề</span><b>' + esc(r.MAILSUBJECT || '') + '</b></div>' +
            '<div class="ums-kv"><span>Gửi tới</span><b>' + esc(mailTo(r)) + '</b></div>' +
            '<div class="ums-kv"><span>Ngày gửi</span><b>' + esc(r.NGAYGUI || '') + '</b></div>' +
            '<div class="ums-kv"><span>Trạng thái</span><b>' + trangThai(r) + '</b></div>' +
            '<div class="ums-field"><label class="ums-field__label">Nội dung</label>' +
                '<iframe class="cmshd-thu" sandbox="" title="Nội dung email"></iframe></div>' +
            '</div>';
        z('thu').querySelector('iframe').srcdoc = '<meta charset="utf-8"><style>body{font:14px/1.5 sans-serif;margin:10px;color:#222}</style>' +
            String(r.NOIDUNGEMAIL == null ? '' : r.NOIDUNGEMAIL);
        ui.swap(z('ds'), z('ct'));
        napLs(1);
    }

    /* getList_LichSuGuiEmail */
    function napLs(p) {
        if (p) L.index = p;
        var el = z('ls');
        el.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: 'CMS_TienIch/LayDS_LichSuGuiEmailBy', method: 'GET', versionAPI: 'v1.0',
            strTuKhoa: F('q').value.trim(),
            strNguoiTao_Id: '',
            strHangDoiGuiEmail_Id: L.id,
            pageIndex: L.index,
            pageSize: L.size
        }).then(function (r) {
            var rows = r.data || [];
            L.total = Number(r.pager) || rows.length;
            z('tongLs').textContent = '(' + L.total + ')';
            ui.table({
                el: el, rows: rows, empty: 'Chưa có lịch sử gửi',
                page: { index: L.index, size: L.size, total: L.total,
                    onChange: function (x) { if (x >= 1 && x <= Math.ceil(L.total / L.size)) napLs(x); },
                    onSize: function (v) { L.size = v; napLs(1); } },
                columns: [
                    { title: 'Gửi tới', cls: 'is-nowrap', render: function (d) { return esc(mailTo(d)); } },
                    { title: 'Nội dung', render: noiDung },
                    { title: 'Ngày gửi', prop: 'NGAYGUI', cls: 'is-nowrap is-center' },
                    { title: 'Trạng thái gửi', render: trangThai }
                ]
            });
        }).catch(function (err) {
            el.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'CMS_TienIch/LayDS_LichSuGuiEmailBy');
        });
    }

    root.addEventListener('click', function (e) {
        var all = e.target.closest('[data-chon-all]');
        if (all) {
            Array.prototype.forEach.call(z('bang').querySelectorAll('input[data-chon]'), function (x) { x.checked = all.checked; });
            return;
        }
        var xm = e.target.closest('[data-xem]');
        if (xm) { xem(xm.getAttribute('data-xem')); return; }
        var b = e.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') nap(1);
        else if (a === 'gui') gui();
        else if (a === 'dong') ui.swap(z('ct'), z('ds'));
    });
    F('q').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); nap(1); } });

    z('bang').innerHTML = ui.empty('Chọn điều kiện rồi bấm Tìm kiếm để xem tiến trình gửi email.', 'fa-magnifying-glass');
})();
