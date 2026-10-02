/* =========================================================================
   _tp_tui — khung chung của hai màn TÚI BÀI / LẬP PHÁCH (phân hệ Thi phách)
       tuibaitc  "Tạo túi bài, lập phách"  (kieu: 'tc' — màn trên menu host)
       tuibai    bản cũ hơn                 (kieu: 'cu')
   Bản gốc: ApisThiPhach/Modules/kehoach/html/tuibaitc.html + tuibai.html, CÙNG nạp script/tuibai.js (2.479 dòng).
   Tệp này: bộ lọc, danh sách đợt phách, biểu mẫu đợt phách (thay chỗ danh sách).
   Tệp _tp_tui_tui.js: vùng "Đánh túi bài thi của đợt phách" + các hộp thoại.
   ---------------------------------------------------------------------------
   HAI MÀN KHÁC NHAU Ở ĐÂU (so hai html gốc — .js gốc dùng chung, ô nào không có trên màn thì gửi rỗng):
     Biểu mẫu đợt phách   tc: Tên đợt phách + Học phần / Đợt thi (chỉ hiện)
                          cu: Tên đợt phách + Quy tắc tạo túi / Quy tắc tạo phách / Bước nhẩy / Số bắt đầu
     Vùng đánh túi        tc: Thêm mới (hộp "Thêm mới - Túi"), Xuất báo cáo, Sinh số phách (từng túi đánh dấu),
                              Xóa túi, Xóa số phách, Xóa đợt phách
                          cu: Tạo túi - sinh số phách (cả đợt), Xóa (túi), Xóa số phách
     Hộp sinh viên trong túi   tc: sửa Tên túi / Số bắt đầu / Tiền tố, Thêm vào túi, Xóa, Lưu;  cu: chỉ xem
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, KHÔNG func; chép nguyên tên tham số; GET trừ khi ghi):
     Bộ lọc   TP_Chung/LayDSHeDaoTaoDuaTheoDot · LayThoiGian · LayLoaiDiem (strDaoTao_ThoiGianDaoTao_Id)
              · LayHinhThucThi (strDiem_ThanhPhanDiem_Id, strDaoTao_ThoiGianDaoTao_Id)
              · LayDotThi (strHinhThucThi_Id, strDaoTao_HeDaoTao_Id, strDiem_ThanhPhanDiem_Id, strDaoTao_ThoiGianDaoTao_Id)
              · LayHocPhan (strDotThi_Id, strHinhThucThi_Id, strDiem_ThanhPhanDiem_Id, strDaoTao_ThoiGianDaoTao_Id)
     Danh sách  TP_Chung/LayDotTaoPhach (strDotThi_Id, strDaoTao_HocPhan_Id)
     Đợt phách  POST TP_DotPhach/ThemMoi | CapNhat (strId, strTen, strMa '', strTHI_DotThi_Id, strDaoTao_HocPhan_Id,
                strDaoTao_ThoiGianDaoTao_Id) · POST TP_DotPhach/Xoa (strIds)
     Quy tắc    TP_QuyTacTu_SoPhach/LayDanhSach (strPhamViApDung_Id = id đợt phách, các ô khác rỗng, pageIndex 1, pageSize 10)
                · POST TP_QuyTacTu_SoPhach/ThemMoi (strId = id quy tắc đã có — gốc LUÔN gọi ThemMoi kể cả khi sửa)
     Gán danh sách thi   TP_Chung/LayDSThiTheoDotPhach (strThi_DotPhach_Id) · TP_Chung/LayDSThiChuaGanPhachTheoDotThi
                (strThi_DotThi_Id, strDaoTao_HocPhan_Id) · POST TP_DotPhach_DST/ThemMoi (strThi_DanhSachThi_Id,
                strThi_DotPhach_Id) · POST TP_DotPhach_DST/Xoa (strIds = THI_DOTPHACH_DANHSACHTHI_ID)
     Báo cáo    strThi_DotThi_Id, strDaoTao_HocPhan_Id, strDanhSachThi_Id (đợt phách mở gần nhất) + một strDanhSachThi_Id
                cho mỗi đợt phách đánh dấu (như gốc)
   ---------------------------------------------------------------------------
   KHÔNG chép (lỗi rõ của bản gốc) / làm theo ý định:
     · Ô "Đợt thi" của biểu mẫu tc gốc đổ NHẦM tên môn thi (lblDotThi = strMonThi_Ten) → nay hiện tên đợt thi.
     · Ô từ khoá gốc không được gửi đi đâu → lọc ngay trên danh sách (tên đợt phách, đợt thi).
     · "Thêm" / "Xóa" danh sách thi, lưu xong gốc nạp lại bảng ba lần (một lần với id rỗng đổ nhầm vào bảng "đã gán")
       → nạp lại mỗi bảng một lần sau khi chạy xong cả lô.
     · Thêm mới: gốc gán danh sách thi rồi quay về danh sách NGAY, chưa đợi lời gọi xong → nay đợi xong mới quay về.
     · arrValid gốc kiểm ô "txtTuiBai_So" không tồn tại → nay bắt buộc Tên đợt phách.
     · Nút thử btnSearchTest (gọi 1000 lần với id đợt thi viết cứng) — bỏ.
     · Ảnh trang trí Upload/images/test-1.svg bên phải biểu mẫu — bỏ.
   GIỮ như gốc (nghi ngờ, đã ghi báo cáo):
     · Màn tc KHÔNG có ô quy tắc nhưng Lưu vẫn gọi TP_QuyTacTu_SoPhach/ThemMoi với Bước nhẩy / quy tắc RỖNG;
       "Số bắt đầu" gửi giá trị đã nạp của quy tắc (gốc đọc nhầm ô cùng id trong hộp "Thêm mới - Túi").
     · Danh sách "chưa gán đợt" lấy theo Đợt thi đang chọn Ở BỘ LỌC (không theo đợt thi của đợt phách); bộ lọc trống
       thì nay dùng đợt thi của đợt phách đang sửa (gốc gửi rỗng).
   Khác gốc có chủ ý: mọi thao tác ghi hàng loạt đều hỏi lại; đổi Môn thi cũng tự tải danh sách (gốc phải bấm Tìm kiếm);
     Thời gian → Loại điểm → Hình thức → Đợt thi → Môn thi khoá theo luật cha → con; Hệ đào tạo là lọc tuỳ chọn của Đợt thi.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var T = ums.tpTui = ums.tpTui || {};

    function uid() { return (ums.session && ums.session.userId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    T.e = e; T.arr = arr; T.uid = uid;

    /** Tham số một lời gọi GET / POST kiểu cũ (strNguoiThucHien_Id như gốc) */
    T.thamSo = function (action, method, o) { return Object.assign({ action: action, method: method, strNguoiThucHien_Id: uid() }, o); };
    T.get = function (action, o) { return ums.api.call(T.thamSo(action, 'GET', o)); };
    T.post = function (action, o) { return ums.api.call(T.thamSo(action, 'POST', o)); };
    /** Bốn lời gọi TP_XuLy của hộp sinh viên: gốc truyền iM dù không có func → thân vẫn mã hoá */
    T.iM = function () { return (ums.session && ums.session.iM) || ''; };

    /** Cột ô đánh dấu (thuộc tính riêng từng bảng để nút "Xoá đã chọn" đếm đúng bảng) */
    T.cotChon = function (attr, id) {
        return { head: '<input type="checkbox" ' + attr + '="all" title="Chọn tất cả">', cls: 'is-center', width: '50px',
            render: function (x, i) { return '<input type="checkbox" ' + attr + '="' + (id ? esc(id(x)) : i) + '">'; } };
    };
    /** Ô "chọn tất cả" → đánh dấu mọi ô ĐANG HIỆN cùng thuộc tính trong host */
    T.ganChonTatCa = function (host, attrs) {
        host.addEventListener('change', function (ev) {
            attrs.forEach(function (a) {
                if (ev.target.getAttribute(a) !== 'all') return;
                var tb = ev.target.closest('table');
                Array.prototype.forEach.call(tb.querySelectorAll('tbody input[' + a + ']'), function (c) {
                    var tr = c.closest('tr');
                    if (!tr || !tr.hidden) c.checked = ev.target.checked;
                });
            });
        });
    };
    /** Giá trị (data-attr) của các ô đã đánh dấu trong host */
    T.daChon = function (host, attr) {
        return Array.prototype.filter.call(host.querySelectorAll('tbody input[' + attr + ']:checked'), function (c) { var tr = c.closest('tr'); return !tr || !tr.hidden; })
            .map(function (c) { return c.getAttribute(attr); });
    };
    /** Lọc dòng bảng theo chữ gõ, không dấu (edu.system.change_alias của gốc) */
    T.khongDau = function (s) {
        return String(e(s)).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
    };
    T.locDong = function (host, q) {
        q = T.khongDau(q).trim();
        Array.prototype.forEach.call(host.querySelectorAll('tbody tr'), function (tr) {
            if (!tr.querySelector('td[colspan]')) tr.hidden = !!q && T.khongDau(tr.textContent).indexOf(q) < 0;
        });
    };
    /** Cột của bảng danh sách thi đã gán / chưa gán đợt phách (genTable_Thi) */
    T.cotDST = function () {
        return [{ title: 'Mã danh sách thi', prop: 'MADANHSACHTHI', cls: 'is-center' }, { title: 'Ngày thi', prop: 'NGAYTHI', cls: 'is-center' },
            { title: 'Ca thi', prop: 'THI_CATHI_TEN' }, { title: 'Phòng thi', prop: 'TKB_PHONGTHI_TEN' }, { title: 'Số SV', prop: 'SOSV', cls: 'is-center' },
            { title: 'Dải số báo danh', cls: 'is-center is-nowrap', render: function (x) { return esc(e(x.CHISOBAODANHBATDAU) + ' --> ' + e(x.CHISOBAODANHKETTHUC)); } }];
    };

    /* ---------- Bộ lọc -------------------------------------------------------
       Chuỗi khoá cha → con: Thời gian → Loại điểm → Hình thức thi → Đợt thi → Môn thi (như ums.nd.locThi của Cổng cán bộ).
       Hệ đào tạo: cha thứ hai của Đợt thi (lọc tuỳ chọn, không khoá) — ums.nd.locThi không gửi strDaoTao_HeDaoTao_Id
       nên ở đây viết riêng. */
    T.boLoc = function (f, onDoi) {
        function v(k) { return f(k) ? f(k).value.trim() : ''; }
        var chuoi = pat.chain([f('tg'), f('ld'), f('ht'), f('dot'), f('mon')], { phatLai: false });
        var TANG = [
            ['tg', 'LayThoiGian', 'THOIGIAN', function () { return {}; }, 'Chọn thời gian'],
            ['ld', 'LayLoaiDiem', 'TEN', function () { return { strDaoTao_ThoiGianDaoTao_Id: v('tg') }; }, 'Chọn loại điểm'],
            ['ht', 'LayHinhThucThi', 'TEN', function () { return { strDiem_ThanhPhanDiem_Id: v('ld'), strDaoTao_ThoiGianDaoTao_Id: v('tg') }; }, 'Chọn hình thức thi'],
            ['dot', 'LayDotThi', 'TEN', function () { return { strHinhThucThi_Id: v('ht'), strDaoTao_HeDaoTao_Id: v('he'), strDiem_ThanhPhanDiem_Id: v('ld'), strDaoTao_ThoiGianDaoTao_Id: v('tg') }; }, 'Chọn đợt thi'],
            ['mon', 'LayHocPhan', function (x) { return e(x.TEN) + ' - ' + e(x.MA); },
                function () { return { strDotThi_Id: v('dot'), strHinhThucThi_Id: v('ht'), strDiem_ThanhPhanDiem_Id: v('ld'), strDaoTao_ThoiGianDaoTao_Id: v('tg') }; }, 'Chọn môn thi']
        ];
        function nap(i) {
            var t = TANG[i];
            if (i && !v(TANG[i - 1][0])) { pat.fill(f(t[0]), [], { head: t[4] }); chuoi.sync(); return Promise.resolve(); }
            return T.get('TP_Chung/' + t[1], t[3]()).then(function (r) {
                pat.fill(f(t[0]), arr(r.data), { name: t[2], head: t[4] });
                chuoi.sync();
            }).catch(function (err) { ums.api.handle(err, t[4]); });
        }
        function napTu(i) { var p = Promise.resolve(); for (var k = i; k < TANG.length; k++) (function (k) { p = p.then(function () { return nap(k); }); })(k); return p; }
        if (window.jQuery) {
            TANG.forEach(function (t, i) {
                jQuery(f(t[0])).on('select2:select select2:clear', function () {
                    (i < TANG.length - 1 ? napTu(i + 1) : Promise.resolve()).then(function () { if (onDoi) onDoi(t[0]); });
                });
            });
            jQuery(f('he')).on('select2:select select2:clear', function () { napTu(3).then(function () { if (onDoi) onDoi('he'); }); });
        }
        var he = T.get('TP_Chung/LayDSHeDaoTaoDuaTheoDot', {}).then(function (r) { pat.fill(f('he'), arr(r.data), { name: 'TENHEDAOTAO', head: 'Chọn hệ đào tạo' }); })
            .catch(function (err) { ums.api.handle(err, 'hệ đào tạo'); });
        return { v: v, xong: Promise.all([he, nap(0)]), chu: function (k) { var el = f(k), o = el && el.options[el.selectedIndex]; return el && el.value && o ? o.textContent : ''; } };
    };

    /* ---------- Màn hình ----------------------------------------------------- */
    T.man = function (root, o) {
        var tc = o.kieu === 'tc';
        root.innerHTML =
            '<div data-z="ds">' +
                pat.page(o.tieuDe, '<span data-z="bc"></span>' + ui.btn('add', { attr: { 'data-a': 'add' } })) +
                pat.filterBar([{ key: 'he', type: 'select', label: 'Chọn hệ đào tạo' }, { key: 'tg', type: 'select', label: 'Chọn thời gian' },
                    { key: 'ld', type: 'select', label: 'Chọn loại điểm' }, { key: 'ht', type: 'select', label: 'Chọn hình thức thi' },
                    { key: 'dot', type: 'select', label: 'Chọn đợt thi' }, { key: 'mon', type: 'select', label: 'Chọn môn thi' },
                    { key: 'q', label: 'Nhập từ khóa tìm kiếm' }]) +
                pat.panel({ title: 'Danh sách', icon: 'fa-list-timeline', count: 'n', flush: true, zone: 'bang' }) +
            '</div><div data-z="form" hidden></div><div data-z="view" hidden></div>';
        ui.enhance(root);
        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
        function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
        var ds = [], hien = [], moId = '', dong = null, dmQT = null;
        var loc = T.boLoc(f, function () { tai(); });
        var ctx = { root: root, tc: tc, z: z, loc: loc, veDanhSach: function () { ui.swap(z('view'), z('ds')); return tai(); }, dot: function () { return dong; }, xoaDot: xoaDot };

        function tai() {
            z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return T.get('TP_Chung/LayDotTaoPhach', { strDotThi_Id: loc.v('dot'), strDaoTao_HocPhan_Id: loc.v('mon') })
                .then(function (r) { ds = arr(r.data); ve(); })
                .catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'đợt phách'); });
        }
        function ve() {
            var q = T.khongDau(loc.v('q')).trim();
            hien = q ? ds.filter(function (x) { return T.khongDau(e(x.TEN) + ' ' + e(x.THI_DOTTHI_TEN)).indexOf(q) >= 0; }) : ds;
            z('n').textContent = '(' + hien.length + ')';
            ui.table({ el: z('bang'), rows: hien, empty: 'Không có đợt phách', columns: [
                { title: 'Đợt phách', render: function (x, i) { return '<a href="javascript:void(0)" class="tpt-lk" data-c="tpt:edit" data-i="' + i + '" title="Chi tiết">' + esc(e(x.TEN)) + '</a>'; } },
                { title: 'Đợt thi', render: function (x, i) { return '<a href="javascript:void(0)" class="tpt-lk" data-c="tpt:edit2" data-i="' + i + '" title="Chi tiết">' + esc(e(x.THI_DOTTHI_TEN)) + '</a>'; } },
                { title: 'Danh sách', cls: 'is-center', width: '120px', render: function (x, i) { return ui.btn('view', { text: 'Xem', icon: 'fa-eye', cls: 'ums-btn--sm', attr: { 'data-c': 'tpt:dsthi', 'data-i': i } }); } },
                { title: 'Chi tiết', cls: 'is-center', width: '130px', render: function (x, i) { return ui.btn('view', { text: 'Chi tiết', icon: 'fa-eye', cls: 'ums-btn--sm', attr: { 'data-c': 'tpt:tui', 'data-i': i } }); } },
                T.cotChon('data-ckd')] });
        }
        ums.report.mount(z('bc'), { collect: function (add) {
            add('strThi_DotThi_Id', loc.v('dot')); add('strDaoTao_HocPhan_Id', loc.v('mon')); add('strDanhSachThi_Id', moId);
            T.daChon(z('bang'), 'data-ckd').forEach(function (i) { if (hien[Number(i)]) add('strDanhSachThi_Id', hien[Number(i)].ID); });
        }, onImported: function () { tai(); } });

        /* ---------- Biểu mẫu đợt phách (thay chỗ danh sách) -------------------- */
        function moForm(row) {
            var mon = row ? { id: e(row.DAOTAO_HOCPHAN_ID), ten: e(row.DAOTAO_HOCPHAN_TEN) } : { id: loc.v('mon'), ten: loc.chu('mon') };
            var dotTen = row ? e(row.THI_DOTTHI_TEN) : loc.chu('dot');
            var nhan = row ? e(row.THOIGIAN) + ' - ' + e(row.THI_DOTTHI_TEN) + ' - ' + e(row.DAOTAO_HOCPHAN_TEN) : loc.chu('tg') + ' - ' + loc.chu('dot') + ' - ' + mon.ten;
            var qt = { id: '', soBatDau: '' };          // quy tắc túi - phách đã có của đợt phách
            dong = row; moId = row ? row.ID : '';
            var F = z('form');
            F.innerHTML =
                pat.panel({ title: (row ? 'Chỉnh sửa - ' : 'Thêm mới - ') + 'Đợt phách - ' + nhan, icon: row ? 'fa-pen-to-square' : 'fa-plus',
                    tools: ui.btn('close', { attr: { 'data-b': 'dong' } }) +
                        (row ? ui.btn('del', { text: 'Xóa', attr: { 'data-b': 'xoa', 'data-khong-chon': '1' } }) : '') + ui.btn('save', { attr: { 'data-b': 'luu' } }),
                    body: '<div class="ums-legend">Thông tin</div><div class="ums-grid ums-grid--2">' +
                        '<div class="tpt-cadong">' + ui.field('Tên đợt phách', '<input class="ums-input" data-scope="form" data-k="ten" autocomplete="off">', { required: true }) + '</div>' +
                        (tc ? '<div class="ums-kv ums-kv--thuong"><span>Học phần</span><b>' + esc(mon.ten) + '</b></div><div class="ums-kv ums-kv--thuong"><span>Đợt thi</span><b>' + esc(dotTen) + '</b></div>'
                            : ui.field('Quy tắc tạo túi', '<select class="ums-select" data-scope="form" data-k="taotui" data-ph="Chọn quy tắc tạo túi"><option value=""></option></select>') +
                              ui.field('Quy tắc tạo phách', '<select class="ums-select" data-scope="form" data-k="taophach" data-ph="Chọn quy tắc tạo phách"><option value=""></option></select>') +
                              ui.field('Bước nhẩy', '<input class="ums-input" data-scope="form" data-k="buocnhay" autocomplete="off">') +
                              ui.field('Số bắt đầu', '<input class="ums-input" data-scope="form" data-k="sobatdau" autocomplete="off">')) +
                        '</div>' }) +
                (row ? pat.panel({ title: 'Danh sách đã gán đợt', icon: 'fa-list-check', count: 'ng', flush: true, zone: 'dagan',
                    tools: ui.xoaChon('input[data-ckg]', { text: 'Xóa', goc: '.ums-panel', attr: { 'data-b': 'xoagan' } }) }) : '') +
                pat.panel({ title: 'Danh sách chưa gán đợt', icon: 'fa-list-ul', count: 'nc', flush: true, zone: 'chuagan',
                    tools: '<input class="ums-input ums-input--sm tpt-tim" data-k="qcg" placeholder="Tìm trong danh sách" autocomplete="off">' +
                        (row ? ui.btn('add', { text: 'Thêm', mod: 'out-success', attr: { 'data-b': 'themgan' } }) : '') });
            function k(n) { return F.querySelector('[data-k="' + n + '"]'); }
            function zf(n) { return F.querySelector('[data-z="' + n + '"]'); }
            ui.enhance(F);
            k('ten').value = row ? e(row.TEN) : nhan;

            var sanSang = Promise.resolve();
            if (!tc) {
                dmQT = dmQT || Promise.all([ums.api.dm('THI.PHACH.QUYTACTAOTUI'), ums.api.dm('THI.PHACH.QUYTACTAOPHACH')]);
                sanSang = dmQT.then(function (d) {
                    pat.fill(k('taotui'), d[0] || [], { head: 'Chọn quy tắc tạo túi' });
                    pat.fill(k('taophach'), d[1] || [], { head: 'Chọn quy tắc tạo phách' });
                }).catch(function (err) { dmQT = null; ums.api.handle(err, 'quy tắc tạo túi / phách'); });
            }
            function datChon(el, val) { el.value = e(val); if (window.jQuery) jQuery(el).trigger('change.select2'); }
            if (row) {
                sanSang.then(function () {
                    return T.get('TP_QuyTacTu_SoPhach/LayDanhSach', { strTuKhoa: '', strQuyTacTui_Id: '', strDaoTao_ThoiGianDaoTao_Id: '', strQuyTacPhach_Id: '',
                        strPhamViApDung_Id: row.ID, strPhanCapApDung_Id: '', pageIndex: 1, pageSize: 10 });
                }).then(function (r) {
                    var d = arr(r.data)[0];
                    if (F.hidden || dong !== row || !d) return;
                    qt = { id: e(d.ID), soBatDau: e(d.QUYTACTAOPHACH_SOBATDAU) };
                    if (!tc) {
                        k('buocnhay').value = e(d.QUYTACTAOPHACH_BUOCNHAY); k('sobatdau').value = e(d.QUYTACTAOPHACH_SOBATDAU);
                        datChon(k('taotui'), d.QUYTACTAOTUI_ID); datChon(k('taophach'), d.QUYTACTAOPHACH_ID);
                    }
                }).catch(function (err) { ums.api.handle(err, 'quy tắc túi - phách'); });
            }

            function taiDaGan() {
                if (!row) return Promise.resolve();
                zf('dagan').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
                return T.get('TP_Chung/LayDSThiTheoDotPhach', { strThi_DotPhach_Id: row.ID }).then(function (r) {
                    var d = arr(r.data);
                    zf('ng').textContent = '(' + d.length + ')';
                    ui.table({ el: zf('dagan'), rows: d, empty: 'Chưa gán danh sách thi nào', columns: T.cotDST().concat([T.cotChon('data-ckg', function (x) { return e(x.THI_DOTPHACH_DANHSACHTHI_ID); })]) });
                }).catch(function (err) { zf('dagan').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách đã gán'); });
            }
            function taiChuaGan() {
                zf('chuagan').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
                return T.get('TP_Chung/LayDSThiChuaGanPhachTheoDotThi', { strThi_DotThi_Id: loc.v('dot') || (row ? e(row.THI_DOTTHI_ID) : ''), strDaoTao_HocPhan_Id: mon.id }).then(function (r) {
                    var d = arr(r.data);
                    zf('nc').textContent = '(' + d.length + ')';
                    ui.table({ el: zf('chuagan'), rows: d, empty: 'Không còn danh sách thi chưa gán', columns: T.cotDST().concat([T.cotChon('data-ckc', function (x) { return e(x.ID); })]) });
                    T.locDong(zf('chuagan'), k('qcg').value);
                }).catch(function (err) { zf('chuagan').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách chưa gán'); });
            }
            function napHaiBang() { return Promise.all([taiDaGan(), taiChuaGan()]); }
            function goiGan(idDot, ids) { return ids.map(function (id) { return T.thamSo('TP_DotPhach_DST/ThemMoi', 'POST', { strThi_DanhSachThi_Id: id, strThi_DotPhach_Id: idDot }); }); }
            function luuQuyTac(idDot) {
                return T.post('TP_QuyTacTu_SoPhach/ThemMoi', { strId: qt.id,
                    dQuyTacTaoPhach_BuocNhay: tc ? '' : k('buocnhay').value.trim(), dQuyTacTaoPhach_SoBatDau: tc ? qt.soBatDau : k('sobatdau').value.trim(),
                    strQuyTacTaoTui_Id: tc ? '' : k('taotui').value, strQuyTacTaoPhach_Id: tc ? '' : k('taophach').value,
                    strDaoTao_ThoiGianDaoTao_Id: loc.v('tg'), strPhamViApDung_Id: idDot, strNgayApDung: '', strPhanCapApDung_Id: '' })
                    .then(function (r) { if (!qt.id && r.raw && r.raw.Id) qt.id = r.raw.Id; })
                    .catch(function (err) { ums.api.handle(err, 'quy tắc túi - phách'); });
            }
            function luu() {
                var ten = k('ten').value.trim();
                if (!ten) { ui.toast('Nhập tên đợt phách', 'warn'); k('ten').focus(); return; }
                var chon = row ? [] : T.daChon(zf('chuagan'), 'data-ckc');
                T.post(row ? 'TP_DotPhach/CapNhat' : 'TP_DotPhach/ThemMoi', { strId: row ? row.ID : '', strTen: ten, strMa: '', strTHI_DotThi_Id: loc.v('dot'),
                    strDaoTao_HocPhan_Id: mon.id, strDaoTao_ThoiGianDaoTao_Id: loc.v('tg') }).then(function (r) {
                    if (row) { ui.toast('Cập nhật thành công!', 'ok'); row.TEN = ten; return luuQuyTac(row.ID); }
                    var id = (r.raw && r.raw.Id) || '';
                    ui.toast('Thêm mới thành công!', 'ok');
                    if (!id) { if (chon.length) ui.toast('Máy chủ không trả mã đợt phách mới — chưa gán được danh sách thi đã chọn. Mở đợt phách vừa tạo để gán.', 'warn'); return dong2(); }
                    return luuQuyTac(id).then(function () {
                        return chon.length ? ui.batch(goiGan(id, chon), { title: 'Đang gán danh sách thi', okText: 'Gán danh sách thi', concurrency: 5 }) : null;
                    }).then(dong2);
                }).catch(function (err) { ums.api.handle(err, 'lưu đợt phách'); });
            }
            function dong2() { ui.swap(F, z('ds')); F.innerHTML = ''; dong = null; return tai(); }

            F.onclick = function (ev) {
                var b = ev.target.closest('[data-b]'); if (!b || b.disabled) return;
                var a = b.getAttribute('data-b'), ids;
                if (a === 'dong') dong2();
                else if (a === 'luu') luu();
                else if (a === 'xoa') xoaDot(row).then(function (ok) { if (ok) dong2(); });
                else if (a === 'themgan') {
                    ids = T.daChon(zf('chuagan'), 'data-ckc');
                    if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần lưu?', 'warn'); return; }
                    ui.confirm('Gán ' + ids.length + ' danh sách thi vào đợt phách "' + e(row.TEN) + '"?', { title: 'Thêm danh sách thi' }).then(function (yes) {
                        if (yes) ui.batch(goiGan(row.ID, ids), { title: 'Đang gán danh sách thi', okText: 'Thêm mới thành công', concurrency: 5, show: true }).then(napHaiBang);
                    });
                } else if (a === 'xoagan') {
                    ids = T.daChon(zf('dagan'), 'data-ckg');
                    if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
                    ui.confirm('Gỡ ' + ids.length + ' danh sách thi khỏi đợt phách "' + e(row.TEN) + '"?', { tone: 'bad', ok: 'Xoá', title: 'Xóa danh sách thi đã gán' }).then(function (yes) {
                        if (yes) ui.batch(ids.map(function (id) { return T.thamSo('TP_DotPhach_DST/Xoa', 'POST', { strIds: id }); }),
                            { title: 'Đang xoá', okText: 'Xóa thành công', concurrency: 5, show: true }).then(napHaiBang);
                    });
                }
            };
            k('qcg').oninput = function () { T.locDong(zf('chuagan'), k('qcg').value); };
            napHaiBang();
            ui.swap(z('ds'), F);
        }

        /** Xoá cả đợt phách (nút Xóa của biểu mẫu, nút "Xóa đợt phách" của vùng đánh túi) → Promise<đã xoá?> */
        function xoaDot(row) {
            return ui.confirm('Xoá đợt phách "' + e(row.TEN) + '"? Thao tác không hoàn lại được.', { tone: 'bad', ok: 'Xoá', title: 'Xóa đợt phách' }).then(function (yes) {
                if (!yes) return false;
                return T.post('TP_DotPhach/Xoa', { strIds: row.ID }).then(function () { ui.toast('Xóa thành công!', 'ok'); return true; })
                    .catch(function (err) { ums.api.handle(err, 'xoá đợt phách'); return false; });
            });
        }

        T.ganChonTatCa(root, ['data-ckd', 'data-ckg', 'data-ckc', 'data-ckt']);
        root.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-c^="tpt:"]'), a;
            if (b && z('bang').contains(b)) {
                var x = hien[Number(b.getAttribute('data-i'))]; if (!x) return;
                a = b.getAttribute('data-c');
                if (a === 'tpt:edit' || a === 'tpt:edit2') moForm(x);
                else if (a === 'tpt:dsthi') T.hopDSThi(x);
                else if (a === 'tpt:tui') { dong = x; moId = x.ID; T.moTui(ctx, x); }
                return;
            }
            if (!(b = ev.target.closest('[data-a]')) || !z('ds').contains(b)) return;
            a = b.getAttribute('data-a');
            if (a === 'search') tai();
            else if (a === 'add') {
                if (!loc.v('mon')) { ui.toast('Bạn cần chọn môn thi', 'warn'); return; }
                moForm(null);
            }
        });
        f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(); } });
        loc.xong.then(tai);
    };
})();
