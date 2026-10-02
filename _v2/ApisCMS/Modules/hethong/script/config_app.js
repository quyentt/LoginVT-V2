/* =========================================================================
   Cấu hình ứng dụng (tệp cấu hình XML của máy chủ)
   Bản gốc: ApisCMS/Modules/hethong/html/config_app.html + script/config_app.js
   ---------------------------------------------------------------------------
   Hai cột như bản gốc (col-sm-3 "Danh sách Ứng Dụng" | col-sm-9 "Thông số cấu
   hình") → ums.pat.master.
   Lời gọi — chép nguyên văn:
       SYS_Xml/GetFile    GET  versionAPI 'v1.0'          → Message = nội dung tệp XML
       SYS_Xml/EditNode   GET  strNode, strValue           → Message "True" = đã ghi
           strNode = <gốc> + "#" + <nghiệp vụ> + "#" + <ứng dụng> + "#" + <tham số>
           <nghiệp vụ> (node_NghiepVu) bản gốc KHÔNG BAO GIỜ gán → luôn rỗng,
           tức "Root##UngDung#ThamSo". Giữ nguyên.
   XML: con cấp 2 của gốc = ứng dụng; con cấp 3 = tham số (tên thẻ, textContent),
   chú thích <!-- … --> đứng trước thẻ là mô tả (hiện ở title của tên tham số).

   BẢN GỐC CHƯA TỪNG CHẠY: init() lỗi cú pháp (`var x = document.` bỏ dở, thiếu
   ngoặc ở if) nên cả tệp không nạp được; kể cả sửa cú pháp thì init() cũng
   `return` ngay sau một khối thử nghiệm (xem dưới) — phần nạp XML nằm sau
   `return`. Bản mới dựng theo Ý ĐỊNH của phần mã sau `return`.

   Cố ý bỏ:
     · Khối thử nghiệm đầu init(): POST một hồ sơ mẫu (tên, SĐT, email người
       thật) sang CRM bên ngoài (myfreshworks.com) kèm TOKEN API viết cứng, và
       một đoạn bắt chuột rời trang. Không chép (không chép cả token). Khuyến
       nghị gỡ khỏi mã gốc + thu hồi token. (ghi can-quyet)
     · Khung "Kanban Board" (thẻ Backlog / To Do… viết cứng, section d-none) và
       ảnh mahoa.svg — trang mẫu tĩnh, không nối dữ liệu.
   Khác bản gốc:
     · Ghi một tham số phải HỎI LẠI (cấu hình hệ thống — yêu cầu đợt chuyển CMS).
       Gốc: Enter là ghi, rời ô là huỷ. Bản mới: ô sửa + nút Lưu / Huỷ trên
       dòng; Enter = Lưu (có hỏi lại), Esc = Huỷ.
     · Tìm ở hai cột lọc ngay khi gõ (như gốc); nút kính lúp của gốc tô đỏ các
       dòng khớp — bỏ, vì lọc đã ẩn các dòng không khớp.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var root = document.getElementById('cms-config-app');
    if (!root) return;

    var S = { goc: '', nghiepVu: '', ungDung: '', xml: null, dsUngDung: [], thamSo: [], dangSua: '' };

    var m = pat.master({
        el: root,
        title: 'Cấu hình ứng dụng',
        side: {
            title: 'Danh sách Ứng Dụng', icon: 'fa-screwdriver-wrench', search: 'Tìm kiếm ứng dụng',
            tools: ui.btn('reload', { text: '', mod: 'warn', attr: { 'data-a': 'napLai', title: 'Tải lại file XML' } })
        },
        main: {
            title: 'Thông số cấu hình', icon: 'fa-gear', count: true,
            tools: '<div class="ums-searchbar ums-searchbar--sm"><span class="ums-searchbar__icon"><i class="fa-light fa-magnifying-glass"></i></span>' +
                '<input class="ums-searchbar__input" data-a="qThamSo" type="text" autocomplete="off" placeholder="Tìm kiếm thông số cấu hình"></div>'
        }
    });
    m.mainBody.classList.add('ums-panel__body--flush');
    var tieuDe = m.main.querySelector('.ums-panel__title');

    function veTrongMain(msg, icon) { m.mainBody.innerHTML = ui.empty(msg, icon); }

    /* ---------- Nạp tệp XML ------------------------------------------------ */
    function napXml() {
        m.sideBody.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({ action: 'SYS_Xml/GetFile', method: 'GET', versionAPI: 'v1.0' }).then(function (r) {
            var xml = new DOMParser().parseFromString(r.message || '', 'text/xml');
            if (!xml.documentElement || xml.getElementsByTagName('parsererror').length) {
                throw new Error('Nội dung tệp cấu hình không phải XML hợp lệ');
            }
            S.xml = xml;
            S.goc = xml.documentElement.nodeName;
            S.dsUngDung = Array.prototype.filter.call(xml.documentElement.childNodes, function (n) { return n.nodeType === 1; })
                .map(function (n) { return n.nodeName; });
            veUngDung();
            if (S.ungDung && S.dsUngDung.indexOf(S.ungDung) >= 0) chonUngDung(S.ungDung);
            else { S.ungDung = ''; veTrongMain('Vui lòng chọn ỨNG DỤNG cần cấu hình!', 'fa-hand-pointer'); m.mainCount.textContent = ''; }
        }).catch(function (err) {
            m.sideBody.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'CM_System.XML_Load');
        });
    }

    function veUngDung() {
        var q = m.search ? m.search.value : '';
        var ds = pat.loc(S.dsUngDung.map(function (t) { return { TEN: t }; }), q, ['TEN']);
        m.sideCount.textContent = '(' + S.dsUngDung.length + ')';
        m.sideBody.innerHTML = ds.length ? ds.map(function (d) {
            return '<button type="button" class="ums-master__item' + (d.TEN === S.ungDung ? ' is-active' : '') + '" data-ud="' + esc(d.TEN) + '">' +
                '<span class="ums-master__item__main"><i class="fa-light fa-hard-drive"></i> ' + esc(d.TEN) + '</span></button>';
        }).join('') : ui.empty('Không có ứng dụng');
    }

    /* getDetail_CF — tham số của một ứng dụng */
    function chonUngDung(ten) {
        S.ungDung = ten;
        S.dangSua = '';
        veUngDung();
        tieuDe.innerHTML = '<i class="fa-light fa-gear"></i> Thông số cấu hình <span class="ums-u-blue">' + esc(ten) + '</span>' +
            ' <span class="ums-u-faint ums-u-fz13" data-z="mainCount"></span>';
        m.mainCount = tieuDe.querySelector('[data-z="mainCount"]');
        var ud = Array.prototype.filter.call(S.xml.documentElement.childNodes, function (n) { return n.nodeType === 1 && n.nodeName === ten; })[0];
        var ds = [], chuThich = '';
        if (ud) {
            Array.prototype.forEach.call(ud.childNodes, function (n) {
                if (n.nodeType === 8) chuThich = n.textContent;
                if (n.nodeType === 1) ds.push({ TEN: n.nodeName, VALUE: n.textContent, COMMENT: chuThich });
            });
        }
        S.thamSo = ds;
        veThamSo();
    }

    function veThamSo(focusSua) {
        var q = root.querySelector('[data-a="qThamSo"]').value;
        var ds = pat.loc(S.thamSo, q, ['TEN', 'VALUE']);
        m.mainCount.textContent = '(' + S.thamSo.length + ')';
        ui.table({
            el: m.mainBody, rows: ds, empty: 'Không có thông số',
            columns: [
                { title: 'Tham số', render: function (r) { return '<b class="ums-u-muted" title="' + esc(r.COMMENT || '') + '">' + esc(r.TEN) + '</b>'; } },
                { title: 'Giá trị', render: function (r) {
                    if (r.TEN !== S.dangSua) return esc(r.VALUE);
                    return '<div class="cmsht-sua"><input class="ums-input" data-sua="' + esc(r.TEN) + '" value="' + esc(r.VALUE) + '">' +
                        ui.btn('save', { text: 'Lưu', cls: 'ums-btn--sm', attr: { 'data-a': 'luu', 'data-ts': r.TEN } }) +
                        ui.btn('close', { text: 'Huỷ', cls: 'ums-btn--sm', attr: { 'data-a': 'huy' } }) + '</div>';
                } },
                { title: 'Sửa', cls: 'is-actions', width: '64px', render: function (r) {
                    return '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-a="sua" data-ts="' + esc(r.TEN) + '" title="Sửa"><i class="fa-light fa-pen-to-square"></i></button>';
                } }
            ]
        });
        var o = m.mainBody.querySelector('[data-sua]');
        if (o && focusSua) { o.focus(); var v = o.value; o.value = ''; o.value = v; }
    }

    /* edit_xml — hỏi lại rồi ghi */
    function luu(ten) {
        var o = m.mainBody.querySelector('[data-sua]');
        if (!o) return;
        var giaTri = o.value;
        var r = S.thamSo.filter(function (x) { return x.TEN === ten; })[0];
        if (!r) return;
        if (giaTri === r.VALUE) { S.dangSua = ''; veThamSo(); return; }
        ui.confirm('Ghi thông số "' + ten + '" của ứng dụng "' + S.ungDung + '" thành "' + giaTri + '"? Thay đổi áp dụng ngay cho máy chủ.',
            { title: 'Cập nhật cấu hình', ok: 'Cập nhật' }).then(function (yes) {
            if (!yes) return;
            return ums.api.call({
                action: 'SYS_Xml/EditNode', method: 'GET',
                strNode: S.goc + '#' + S.nghiepVu + '#' + S.ungDung + '#' + ten,
                strValue: giaTri
            }).then(function (res) {
                if (res.message === 'True') {
                    ui.toast('Cập nhật thành công!', 'ok');
                    r.VALUE = giaTri;
                    // giữ bản XML trong máy khớp với máy chủ để chọn lại ứng dụng không hiện giá trị cũ
                    var ud = Array.prototype.filter.call(S.xml.documentElement.childNodes, function (n) { return n.nodeType === 1 && n.nodeName === S.ungDung; })[0];
                    var nut = ud && Array.prototype.filter.call(ud.childNodes, function (n) { return n.nodeType === 1 && n.nodeName === ten; })[0];
                    if (nut) nut.textContent = giaTri;
                } else {
                    ui.toast('Chưa cập nhật được dữ liệu', 'warn');
                }
                S.dangSua = '';
                veThamSo();
            });
        }).catch(function (err) { ums.api.handle(err, 'CM_System.XML_Edit'); });
    }

    root.addEventListener('click', function (e) {
        var ud = e.target.closest('[data-ud]');
        if (ud) { chonUngDung(ud.getAttribute('data-ud')); return; }
        var b = e.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'napLai') napXml();
        else if (a === 'sua') { S.dangSua = b.getAttribute('data-ts'); veThamSo(true); }
        else if (a === 'huy') { S.dangSua = ''; veThamSo(); }
        else if (a === 'luu') luu(b.getAttribute('data-ts'));
    });
    root.addEventListener('keydown', function (e) {
        var o = e.target.closest('[data-sua]');
        if (!o) return;
        if (e.key === 'Enter') { e.preventDefault(); luu(o.getAttribute('data-sua')); }
        else if (e.key === 'Escape') { e.preventDefault(); S.dangSua = ''; veThamSo(); }   // preventDefault: Esc huỷ sửa tại ô, tầng chung đừng đóng thêm màn
    });
    root.addEventListener('input', function (e) {
        if (e.target === m.search) veUngDung();
        else if (e.target.getAttribute('data-a') === 'qThamSo' && S.ungDung) veThamSo();
    });

    veTrongMain('Vui lòng chọn ỨNG DỤNG cần cấu hình!', 'fa-hand-pointer');
    napXml();
})();
