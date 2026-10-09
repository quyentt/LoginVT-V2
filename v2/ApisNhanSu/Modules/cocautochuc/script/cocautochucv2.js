/* =========================================================================
   Cơ cấu tổ chức (v2) — Danh sách đơn vị hành chính (ApisNhanSu)
   Bản gốc: ApisNhanSu/Modules/cocautochuc/html/cocautochucv2.html + script/cocautochucv2.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc: dải tab MỘT mục ("Đơn vị hành chính"; tab "Đơn vị khác" bị chú thích bỏ) →
   bỏ dải tab (quy ước một tab). Trong tab: HAI cột col-sm-3 | col-sm-9 —
     trái  — Loại đơn vị (NS.LCTC), Trạng thái (Hiệu lực / Hết hiệu lực), "Xem cấu trúc tại ngày",
             Từ khoá, nút Tìm kiếm;
     phải  — "Danh sách đơn vị hành chính" (số lượng) + nút "Thêm đơn vị hành chính" + cây jstree.
   Bấm nút cây / Thêm → hộp #modalDonVi (Thông tin đơn vị con · quan hệ cha-con hiện tại · lịch sử).
   Bản mới: biểu mẫu THAY CHỖ khung cây ngay trong trang (BO-CUC luật 1 — không dùng hộp thoại cho
   bản ghi chính); nút Thêm lên đầu trang.

   Lời gọi (chép nguyên):
     NS_CoCauToChuc/LayDanhSach   GET  dTrangThai = ô Trạng thái || 1, strLoaiCoCauToChuc_Id, strCoCauToChucCha_Id ''
     NS_CoCauToChuc/ThemMoi|CapNhat    strTen, strMa, strDaoTao_Loai_Id, dThuTu 1, dTrangThai = ô Tình trạng || 1,
                                       strDaoTao_CoCau_Cha_Id = ô Đơn vị cha, strGhiChu = ô Tên viết tắt,
                                       strNguoiThucHien_Id, strId
     NS_HoSo_V2/Xoa_DaoTao_CoCauToChuc strId, strNguoiThucHien_Id
     NS_HoSoNhanSu3_MH · PKG_CORE_HOSONHANSU_03.LayDSCore_Org_Relation  strId = đơn vị (lịch sử quan hệ)
   Giữ như gốc:
     · Ngày bắt đầu / kết thúc hiệu lực của đơn vị: gốc luôn đặt "" và KHÔNG gửi → ô vẫn có, không gửi đi.
     · "Xem cấu trúc tại ngày" (mặc định hôm nay) và Từ khoá KHÔNG gửi vào LayDanhSach (gốc chỉ dùng từ khoá
       để lọc cây tại chỗ khi gõ; Enter / Tìm kiếm nạp lại).
   Khác gốc (lỗi / dở dang rõ ràng, ghi báo cáo):
     · Khối "quan hệ cha - con": các nút "Thêm mới quan hệ", "Xóa quan hệ" (+ hộp #modalQuanHe) KHÔNG có trình
       xử lý ở gốc; save_QuanHe / getList_QuanHe / delete_QuanHe có mã nhưng không nơi nào gọi; ô "Loại quan hệ"
       không nạp danh mục. → Bản mới giữ hai nút nhưng KHOÁ; lịch sử quan hệ nay được ĐỌC (LayDSCore_Org_Relation,
       ý định của gốc) và hiện trong bảng; bốn ô "hiện tại" (ngày, loại quan hệ, tình trạng) hiện CHỈ ĐỌC từ dòng
       quan hệ đầu. Ô "Đơn vị cha" giữ như gốc: là ô của bản ghi đơn vị (strDaoTao_CoCau_Cha_Id).
     · Mỗi lần nạp cây gốc gắn thêm một trình xử lý select_node — không chép.
     · Lưu thêm mới xong gốc đóng hộp; bản mới về lại khung cây (nạp lại).
   Cố ý bỏ: getList_ThoiGian / getList_KeHoachTongHop / getList_KeHoachChiTiet (mã chết chép từ màn khối lượng
   giảng dạy, không ô nào của màn dùng), console.log, khối sửa select2 trong modal (tầng chung lo).
   Ô cha → con: không có (các ô lọc độc lập).
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('ns-cocautochucv2');
    if (!root) return;
    var ui = ums.ui, pat = ums.pat, C = ums.nsCoCau;
    function e(v) { return v === undefined || v === null ? '' : String(v); }
    var TT = '<option value="1">Hiệu lực</option><option value="0">Hết hiệu lực</option>';

    var mst = pat.master({
        el: root,
        title: 'Cơ cấu tổ chức',
        actions: ui.btn('add', { text: 'Thêm đơn vị hành chính', attr: { 'data-a': 'them' } }),
        side: {
            title: 'Tìm kiếm', icon: 'fa-filter', search: false,
            /* Luật cột trái (BO-CUC 12): ô tìm chuẩn trên cùng, Loại / Trạng thái / Ngày vào Bộ lọc nâng cao (pat.cotTrai) */
            filter: '<div class="ums-master__search"><div class="ums-searchbar ums-searchbar--sm">' +
                '<span class="ums-searchbar__icon"><i class="fa-light fa-magnifying-glass"></i></span>' +
                '<input class="ums-searchbar__input" data-a="q" autocomplete="off" placeholder="Từ khóa tìm kiếm"></div></div>' +
                '<div class="ums-filter">' +
                '<div class="ums-field"><select class="ums-select" data-a="loai" data-ph="Loại đơn vị"><option value="">Loại đơn vị</option></select></div>' +
                '<div class="ums-field"><select class="ums-select" data-a="tt" data-ph="Trạng thái"><option value="">Trạng thái</option>' + TT + '</select></div>' +
                '<div class="ums-field"><div class="ums-inputwrap"><input class="ums-input" data-a="ngay" data-date autocomplete="off" placeholder="Xem cấu trúc tại ngày dd/mm/yyyy"><i class="fa-light fa-calendar"></i></div></div>' +
                '<div class="ums-field">' + ui.btn('search', { attr: { 'data-a': 'tim' }, cls: 'ums-u-w100' }) + '</div>' +
                '</div>'
        },
        main: { title: false }
    });
    mst.sideBody.hidden = true;
    mst.sideFoot.hidden = true;
    var sLoai = root.querySelector('[data-a="loai"]'), sTT = root.querySelector('[data-a="tt"]');
    var iNgay = root.querySelector('[data-a="ngay"]'), iQ = root.querySelector('[data-a="q"]');
    iNgay.value = C.homNay();

    function o(label, ctl, op) { return '<div' + (op && op.rong ? ' class="nscc-span"' : '') + '>' + ui.field(label, ctl, op) + '</div>'; }
    function inp(k, ph, date) {
        var c = '<input class="ums-input" data-scope="form" data-k="' + k + '" autocomplete="off" placeholder="' + ui.esc(ph || '') + '"' + (date ? ' data-type="date"' : '') + '>';
        return date ? '<div class="ums-inputwrap">' + c + '<i class="fa-light fa-calendar"></i></div>' : c;
    }
    function tinh(k, v) { return '<div class="ums-input" style="display:flex;align-items:center" data-v="' + k + '">' + ui.esc(v || '') + '</div>'; }

    mst.mainBody.innerHTML =
        '<div data-z="ds">' + pat.panel({ title: 'Danh sách đơn vị hành chính', icon: 'fa-sitemap', count: 'dem', flush: true,
            body: '<div class="nscc-cay ums-master--danhmuc"><div class="ums-master__list" data-z="cay"></div></div>' }) + '</div>' +
        '<div data-z="form" hidden>' + pat.panel({ title: 'Đơn vị', icon: 'fa-pen-to-square', zone: 'formBody',
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                ui.btn('del', { text: 'Xóa cơ cấu tổ chức', mod: 'out-danger', attr: { 'data-a': 'xoa' } }) +
                ui.btn('save', { text: 'Lưu thông tin', attr: { 'data-a': 'luu' } }),
            body:
                '<div class="ums-legend">Thông tin đơn vị con</div>' +
                '<div class="ums-grid ums-grid--2">' +
                    o('Mã đơn vị', inp('ma', 'Mã đơn vị'), { required: true }) +
                    o('Tên đơn vị', inp('ten', 'Tên đơn vị'), { required: true }) +
                    o('Loại đơn vị', '<select class="ums-select" data-scope="form" data-k="loai" data-ph="Chọn loại đơn vị"><option value="">Chọn loại đơn vị</option></select>', { required: true }) +
                    o('Tên viết tắt', inp('tenviettat', 'Tên viết tắt')) +
                    o('Ngày bắt đầu hiệu lực', inp('hieuluc', 'dd/mm/yyyy', true)) +
                    o('Ngày kết thúc hiệu lực', inp('hethieuluc', 'dd/mm/yyyy', true)) +
                    o('Tình trạng', '<select class="ums-select" data-scope="form" data-k="tt" data-required>' + TT + '</select>') +
                '</div>' +
                '<div class="ums-legend nscc-nhom">Thông tin quan hệ cha - con - hiện tại</div>' +
                '<div class="ums-grid ums-grid--2">' +
                    o('Đơn vị cha', '<select class="ums-select" data-scope="form" data-k="cha" data-ph="Chọn cơ cấu tổ chức cha"><option value="">Chọn cơ cấu tổ chức cha</option></select>', { rong: true }) +
                    o('Ngày bắt đầu hiệu lực', tinh('qh_tu')) + o('Ngày kết thúc hiệu lực', tinh('qh_den')) +
                    o('Loại quan hệ', tinh('qh_loai')) + o('Tình trạng', tinh('qh_tt')) +
                '</div>' +
                '<div class="ums-legend nscc-nhom">Thông tin quan hệ cha - con - lịch sử</div>' +
                '<div class="ums-row ums-row--end ums-u-mb-2">' +
                    ui.xoaChon('input[data-qhck]', { text: 'Xóa quan hệ', attr: { title: 'Bản gốc chưa có xử lý cho nút này' } }) +
                    ui.btn('add', { text: 'Thêm mới quan hệ', mod: 'out-success', attr: { disabled: 'disabled', title: 'Bản gốc chưa có xử lý cho nút này' } }) +
                '</div>' +
                '<div data-z="qh"></div>' }) + '</div>';

    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return z('formBody').querySelector('[data-k="' + k + '"]'); }
    var elCay = z('cay');
    var S = { ds: [], sua: null, qh: [] };
    var dangForm = false;
    function sang(form) {
        if (form === dangForm) return;
        ui.swap(form ? z('ds') : z('form'), form ? z('form') : z('ds'), { top: false });
        dangForm = form;
        mst.formMode(form);
    }

    ums.api.dm('NS.LCTC').then(function (rows) {
        pat.fill(sLoai, rows, { head: 'Loại đơn vị' });
        pat.fill(f('loai'), rows, { head: 'Chọn loại đơn vị' });
    }).catch(function (err) { ums.api.handle(err, 'NS.LCTC'); });

    /* ---------- Cây (getList_CoCauToChuc / genTable_CoCauToChuc) ---------- */
    function napCay() {
        elCay.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return C.coCau({ dTrangThai: sTT.value || 1, strLoaiCoCauToChuc_Id: sLoai.value }).then(function (rows) {
            S.ds = rows;
            z('dem').textContent = '(' + rows.length + ')';
            C.cay(elCay, rows, {});
            C.loc(elCay, iQ.value);
            var cha = f('cha'), giu = cha.value;
            // gốc: loadToCombo_data KHÔNG parentId cho ô Đơn vị cha → danh sách phẳng
            pat.fill(cha, rows, { head: 'Chọn cơ cấu tổ chức cha' });
            cha.value = giu;
            jQuery(cha).trigger('change.select2');
        }).catch(function (err) {
            elCay.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'NS_CoCauToChuc/LayDanhSach');
        });
    }
    function tim(id) { return S.ds.filter(function (x) { return x.ID === id; })[0] || null; }

    /* ---------- Biểu mẫu ---------- */
    function dat(k, v) {
        var el = f(k); el.value = e(v); el.classList.remove('is-invalid');
        if (el.tagName === 'SELECT') jQuery(el).trigger('change.select2');
        if (el._flatpickr) el._flatpickr.setDate(v || null, false, 'd/m/Y');
    }
    function datTinh(k, v) { var el = z('formBody').querySelector('[data-v="' + k + '"]'); if (el) el.textContent = e(v); }
    function moForm(row) {
        S.sua = row || null;
        dat('ma', row ? row.MA : ''); dat('ten', row ? row.TEN : ''); dat('loai', row ? row.DAOTAO_LOAICOCAUTOCHUC_ID : '');
        dat('tenviettat', row ? row.GHICHU : ''); dat('hieuluc', ''); dat('hethieuluc', '');
        dat('tt', row ? (e(row.TRANGTHAI) || '1') : '1');
        dat('cha', row ? row.DAOTAO_COCAUTOCHUC_CHA_ID : '');
        ['qh_tu', 'qh_den', 'qh_loai', 'qh_tt'].forEach(function (k) { datTinh(k, ''); });
        root.querySelector('[data-a="xoa"]').hidden = !row;
        z('form').querySelector('.ums-panel__title').innerHTML = '<i class="fa-light ' + (row ? 'fa-pen-to-square' : 'fa-plus') + '"></i> ' +
            (row ? 'Đơn vị — ' + ui.esc(row.TEN) : 'Thêm đơn vị hành chính');
        if (row) C.chon(elCay, row.ID);
        napQuanHe(row);
        sang(true);
    }

    /* Lịch sử quan hệ cha - con (getList_QuanHe / genTable_QuanHe — gốc không gọi, xem đầu tệp) */
    function napQuanHe(row) {
        var host = z('qh');
        if (!row) { S.qh = []; host.innerHTML = ui.empty('Lưu đơn vị trước để xem lịch sử quan hệ'); return; }
        host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({
            action: 'NS_HoSoNhanSu3_MH/DSA4BRICLjMkHg4zJh4TJC0gNSguLwPP', func: 'PKG_CORE_HOSONHANSU_03.LayDSCore_Org_Relation',
            strNguoiThucHien_Id: '', strId: row.ID
        }).then(function (r) {
            if (!S.sua || S.sua.ID !== row.ID) return;
            S.qh = C.rows(r);
            ui.table({
                el: host, rows: S.qh, empty: 'Chưa có quan hệ cha - con',
                columns: [
                    { title: 'Đơn vị cha', render: function (x) { return ui.esc(e(x.PARENT_ORG_NAME) + ' - ' + e(x.PARENT_ORG_CODE)); } },
                    { title: 'Ngày bắt đầu hiệu lực', prop: 'START_DATE', cls: 'is-nowrap' },
                    { title: 'Ngày kết thúc hiệu lực', prop: 'END_DATE', cls: 'is-nowrap' },
                    { title: 'Loại quan hệ', prop: 'RELATION_TYPE_CODE_TEN' },
                    { title: 'Trạng thái', cls: 'is-center', render: function (x) { return x.IS_ACTIVE ? '' : ui.badge('Hết hiệu lực', 'mute'); } }
                ]
            });
            var d = S.qh[0];
            if (d) {
                datTinh('qh_tu', d.START_DATE); datTinh('qh_den', d.END_DATE); datTinh('qh_loai', d.RELATION_TYPE_CODE_TEN);
                datTinh('qh_tt', d.IS_ACTIVE ? 'Hiệu lực' : 'Hết hiệu lực');
            }
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'LayDSCore_Org_Relation'); });
    }

    function hopLe() {
        var thieu = [];
        [['ma', 'Mã đơn vị'], ['ten', 'Tên đơn vị'], ['loai', 'Loại đơn vị']].forEach(function (x) {
            var el = f(x[0]), sai = !e(el.value).trim();
            el.classList.toggle('is-invalid', sai);
            if (sai) thieu.push(x[1]);
        });
        if (thieu.length) ui.toast('Kiểm tra lại: ' + thieu.join(', '), 'warn');
        return !thieu.length;
    }
    function luu() {
        if (!hopLe()) return;
        var sua = S.sua;
        var act = sua ? 'NS_CoCauToChuc/CapNhat' : 'NS_CoCauToChuc/ThemMoi';
        ums.api.call({
            action: act,
            strTen: f('ten').value.trim(), strMa: f('ma').value.trim(), strDaoTao_Loai_Id: f('loai').value,
            dThuTu: 1, dTrangThai: f('tt').value || 1, strDaoTao_CoCau_Cha_Id: f('cha').value,
            strGhiChu: f('tenviettat').value.trim(), strNguoiThucHien_Id: '', strId: sua ? sua.ID : ''
        }).then(function () {
            ui.toast(sua ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok');
            sang(false);
            napCay();
        }).catch(function (err) { ums.api.handle(err, act); });
    }
    function xoa() {
        var row = S.sua;
        if (!row) return;
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không? (' + e(row.TEN) + ')', { tone: 'bad', ok: 'Xóa' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({ action: 'NS_HoSo_V2/Xoa_DaoTao_CoCauToChuc', strId: row.ID, strNguoiThucHien_Id: '' }).then(function () {
                ui.toast('Xóa dữ liệu thành công!', 'ok');
                sang(false);
                napCay();
            }).catch(function (err) { ums.api.handle(err, 'Xoa_DaoTao_CoCauToChuc'); });
        });
    }

    /* ---------- Sự kiện ---------- */
    iQ.addEventListener('input', function () { C.loc(elCay, iQ.value); });
    iQ.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); napCay(); } });
    jQuery(sLoai).on('select2:select', function () { napCay(); });
    /* gõ là lọc cây tại chỗ (C.loc) → tuTim: false; đổi Trạng thái / Ngày cũng nạp lại cây */
    ums.pat.cotTrai({ side: mst.side, search: iQ }, { tai: function () { napCay(); }, tuTim: false });
    elCay.addEventListener('click', function (ev) {
        var b = ev.target.closest('.nscc-node');
        if (!b) return;
        var row = tim(b.getAttribute('data-id'));
        if (row) moForm(row);
    });
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('button[data-a]');
        if (!b || !root.contains(b)) return;
        switch (b.getAttribute('data-a')) {
            case 'them': moForm(null); break;
            case 'tim': napCay(); break;
            case 'luu': luu(); break;
            case 'xoa': xoa(); break;
            case 'dong': sang(false); break;
        }
    });

    ui.enhance(root);
    ui.datepicker(iNgay);
    Array.prototype.forEach.call(root.querySelectorAll('[data-type="date"]'), function (x) { ui.datepicker(x); });
    napCay();
})();
