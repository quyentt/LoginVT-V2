/* =========================================================================
   Khung cơ cấu nhân sự (ApisNhanSu)
   Bản gốc: ApisNhanSu/Modules/cocautochuc/html/khungcocaunhansu.html + script/khungcocaunhansu.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (HAI cột, col-lg-3 | col-lg-9):
     trái  — ô Loại (NS.LCTC) + từ khoá; khung "Cơ cấu tổ chức" (số lượng) + cây jstree;
     phải  — "Danh sách nhân sự" (số lượng; Stt · Hình ảnh · Họ tên + mã · Ngày sinh · Điện thoại · Email ·
             nút "Điều chuyển") và biểu mẫu "Quá trình điều chuyển" thay chỗ nhau (toggle_overide "zone-KCNS").
   Bản mới: ums.pat.master, cột trái kiểu DANH MỤC (cây — ums.nsCoCau); cột phải danh sách ↔ biểu mẫu.

   Lời gọi (chép nguyên):
     NS_CoCauToChuc/LayDanhSach   GET  dTrangThai 1, strLoaiCoCauToChuc_Id (ô Loại), strCoCauToChucCha_Id ''
     edu.system.getList_NhanSu → ums.ref.nhanSu { strTuKhoa '', pageIndex 1, pageSize 100000,
                                   strCoCauToChuc_Id = nút cây, dLaCanBoNgoaiTruong 0 }
     edu.system.getList_CoCauToChuc → ums.ref.coCauToChuc (ô "Đơn vị mới — Trong trường")
     NS_QT_ThuyenChuyenCanBo/ThemMoi  POST strId '', strSoQuyetDinh, strNgayQuyetDinh (= Ngày ký QĐ), strNgayChuyen,
                                   strDonViCu_Id = DAOTAO_COCAUTOCHUC_ID của cán bộ, strDonViMoi_Id,
                                   strDonViCu_NgoaiTruong '', strDonViMoi_NgoaiTruong (rỗng nếu đã chọn đơn vị
                                   trong trường), strThongTinDinhKem '', strNhanSu_ThongTinQD_Id (Loại QĐ — NS.QUDI),
                                   iTrangThai 1, iThuTu 0, strNhanSu_HoSoCanBo_Id = ID cán bộ
     sau khi thêm: edu.extend.ThietLapQuaTrinhCuoiCung(…, "NHANSU_QT_TCCB") → ums.ref.quaTrinhCuoiCung
   Kiểm như gốc: Ngày ký QĐ không được lớn hơn hôm nay.
   Khác gốc (ghi báo cáo):
     · Ảnh cán bộ: gốc đọc data.ANH (của MẢNG, luôn rỗng) → luôn ảnh mặc định. Nay đọc ANH của từng dòng.
     · Tệp đính kèm: gốc gọi uploadFiles (tải lên) nhưng KHÔNG gọi saveFiles → tệp không bao giờ gắn vào bản ghi.
       Nay dùng ums.files (NS_Files) và gắn tệp vào Id máy chủ trả sau khi thêm — ĐƯỜNG GHI MỚI, kiểm trên host.
     · Lưu xong gốc ở lại biểu mẫu (bấm Lưu lần nữa là thêm TRÙNG) → nay về danh sách nhân sự, nạp lại.
     · getDetail_ThuyenChuyen (NS_QT_ThuyenChuyenCanBo/LayChiTiet) có mã nhưng không nơi nào gọi → không chép.
     · Mỗi lần nạp cây gốc gắn thêm một trình xử lý select_node — không chép.
   Cố ý bỏ: ô "Chọn Khoa/Viện/Phòng ban", "Bộ môn", "Đơn vị cũ" (genCombo_CCTC_Parents/Childs, dropDonViCu…)
   — các ô đó KHÔNG có trên màn gốc.
   Ô cha → con: không có.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('ns-khungcocaunhansu');
    if (!root) return;
    var ui = ums.ui, pat = ums.pat, C = ums.nsCoCau;
    function e(v) { return v === undefined || v === null ? '' : String(v); }

    var searchbar = '<div class="ums-searchbar ums-searchbar--sm">' +
        '<span class="ums-searchbar__icon"><i class="fa-light fa-magnifying-glass"></i></span>' +
        '<input class="ums-searchbar__input" data-a="q" type="text" autocomplete="off" placeholder="Nhập từ khóa tìm kiếm"></div>';

    var mst = pat.master({
        el: root,
        title: 'Khung cơ cấu nhân sự',
        side: {
            title: 'Cơ cấu tổ chức', kieu: 'danhmuc', search: false,
            /* Luật cột trái (BO-CUC 12): ô tìm chuẩn trên cùng, loại cơ cấu vào Bộ lọc nâng cao (pat.cotTrai) */
            filter: '<div class="ums-master__search">' + searchbar + '</div>' +
                '<div class="ums-field"><select class="ums-select" data-a="loai" data-ph="Chọn loại cơ cấu">' +
                '<option value="">Chọn loại cơ cấu</option></select></div>'
        },
        main: { title: false }
    });
    var elCay = mst.sideBody, elDem = mst.sideCount;
    var selLoai = root.querySelector('[data-a="loai"]'), inpQ = root.querySelector('[data-a="q"]');

    function o(label, ctl, op) { return '<div' + (op && op.rong ? ' class="nscc-span"' : '') + '>' + ui.field(label, ctl, op) + '</div>'; }
    function ngay(k) {
        return '<div class="ums-inputwrap"><input class="ums-input" data-scope="form" data-type="date" data-k="' + k + '" autocomplete="off" placeholder="dd/mm/yyyy"><i class="fa-light fa-calendar"></i></div>';
    }
    mst.mainBody.innerHTML =
        '<div data-z="ds">' + pat.panel({ title: 'Danh sách nhân sự', icon: 'fa-users', count: 'dem', flush: true, zone: 'bang',
            body: ui.empty('Chọn một đơn vị ở cây bên trái để xem danh sách nhân sự', 'fa-hand-pointer') }) + '</div>' +
        '<div data-z="form" hidden>' + pat.panel({ title: 'Quá trình điều chuyển', icon: 'fa-pen-to-square', zone: 'formBody',
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) + ui.btn('save', { attr: { 'data-a': 'luu' } }),
            body:
                '<div class="ums-kv ums-u-mb-4" data-z="canbo"></div>' +
                '<div class="ums-grid ums-grid--2">' +
                    o('Loại quyết định', '<select class="ums-select" data-scope="form" data-k="qd" data-ph="-- Chọn loại quyết định --"><option value="">-- Chọn loại quyết định --</option></select>') +
                    o('Số quyết định', '<input class="ums-input" data-scope="form" data-k="so" autocomplete="off">') +
                    o('Ngày thuyên chuyển', ngay('ngaychuyen')) +
                    o('Ngày ký QĐ', ngay('ngayky')) +
                '</div>' +
                '<div class="ums-legend nscc-nhom">Đơn vị mới</div>' +
                '<div class="ums-grid ums-grid--2">' +
                    o('Trong trường', '<select class="ums-select" data-scope="form" data-k="dvmoi" data-ph="-- Chọn đơn vị mới trong trường --"><option value="">-- Chọn đơn vị mới trong trường --</option></select>') +
                    o('Ngoài trường', '<input class="ums-input" data-scope="form" data-k="ngoai" autocomplete="off">') +
                '</div>' +
                '<div class="nscc-nhom">' + ui.field('File đính kèm', '<div data-z="tep"></div>') + '</div>' }) + '</div>';

    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return z('formBody').querySelector('[data-k="' + k + '"]'); }
    var tep = ums.files.mount(z('tep'), { api: 'NS_Files' });
    var S = { ds: [], ns: [], dv: null, cb: null };
    var dangForm = false;
    function sang(form) {
        if (form === dangForm) return;
        ui.swap(form ? z('ds') : z('form'), form ? z('form') : z('ds'), { top: false });
        dangForm = form;
    }

    ums.api.dm('NS.LCTC').then(function (rows) { pat.fill(selLoai, rows, { head: 'Chọn loại cơ cấu' }); })
        .catch(function (err) { ums.api.handle(err, 'NS.LCTC'); });
    ums.api.dm('NS.QUDI').then(function (rows) { pat.fill(f('qd'), rows, { head: '-- Chọn loại quyết định --' }); })
        .catch(function (err) { ums.api.handle(err, 'NS.QUDI'); });
    ums.ref.coCauToChuc({ strCCTC_Loai_Id: '', strCCTC_Cha_Id: '', iTrangThai: 1 }).then(function (rows) {
        pat.fill(f('dvmoi'), rows, { head: '-- Chọn đơn vị mới trong trường --' });
    }).catch(function (err) { ums.api.handle(err, 'getList_CoCauToChuc'); });

    /* ---------- Cây ---------- */
    function napCay() {
        elCay.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return C.coCau({ dTrangThai: 1, strLoaiCoCauToChuc_Id: selLoai.value }).then(function (rows) {
            S.ds = rows;
            elDem.textContent = String(rows.length);
            C.cay(elCay, rows, { chon: S.dv });
            C.loc(elCay, inpQ.value);
        }).catch(function (err) {
            elCay.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'NS_CoCauToChuc/LayDanhSach');
        });
    }

    /* ---------- Danh sách nhân sự của đơn vị ---------- */
    function anh(r) { return pat.anhNguoi(r.ANH); }
    function napNhanSu() {
        var dv = S.dv;
        if (!dv) return;
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.ref.nhanSu({ strTuKhoa: '', pageIndex: 1, pageSize: 100000, strCoCauToChuc_Id: dv, dLaCanBoNgoaiTruong: 0 }).then(function (rows) {
            if (S.dv !== dv) return;
            S.ns = rows || [];
            z('dem').textContent = '(' + S.ns.length + ')';
            ui.table({
                el: z('bang'), rows: S.ns, empty: 'Đơn vị chưa có nhân sự',
                columns: [
                    { title: 'Hình ảnh', cls: 'is-center', width: '72px', render: anh },
                    { title: 'Họ tên', render: function (r) { return ui.cell(e(r.HODEM) + ' ' + e(r.TEN), e(r.MASO)); } },
                    { title: 'Ngày sinh', cls: 'is-nowrap', render: function (r) { return ui.esc(e(r.NGAYSINH) + '/' + e(r.THANGSINH) + '/' + e(r.NAMSINH)); } },
                    { title: 'Điện thoại', prop: 'SDT_CANHAN' },
                    { title: 'Email', prop: 'EMAIL' },
                    { title: 'Điều chuyển', cls: 'is-center', render: function (r) {
                        return ui.btn('edit', { text: 'Điều chuyển', mod: 'out-primary', icon: 'fa-arrow-right-arrow-left', cls: 'ums-btn--sm', attr: { 'data-dc': r.ID } });
                    } }
                ]
            });
        }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'getList_NhanSu'); });
    }

    /* ---------- Biểu mẫu điều chuyển ---------- */
    function dat(k, v) {
        var el = f(k); el.value = e(v);
        if (el.tagName === 'SELECT') jQuery(el).trigger('change.select2');
        if (el._flatpickr) el._flatpickr.setDate(v || null, false, 'd/m/Y');
    }
    function moForm(cb) {
        S.cb = cb;
        ['qd', 'so', 'ngaychuyen', 'ngayky', 'dvmoi', 'ngoai'].forEach(function (k) { dat(k, ''); });
        tep.clear();
        z('canbo').innerHTML = '<span>Cán bộ</span><b>' + ui.esc(e(cb.HODEM) + ' ' + e(cb.TEN)) + ' — ' + ui.esc(e(cb.MASO)) + '</b>';
        sang(true);
    }
    function soNgay(s) { var m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(e(s).trim()); return m ? new Date(+m[3], +m[2] - 1, +m[1]).getTime() : null; }
    function luu() {
        var cb = S.cb;
        if (!cb) return;
        var ky = soNgay(f('ngayky').value), homNay = new Date(); homNay.setHours(0, 0, 0, 0);
        if (ky !== null && ky > homNay.getTime()) { ui.toast('Ngày ký quyết định không được lớn hơn ngày hiện tại!', 'warn'); return; }
        if (tep.busy && tep.busy()) { ui.toast('Đang tải tệp lên, đợi xong rồi lưu', 'warn'); return; }
        var dvMoi = f('dvmoi').value, ngoai = f('ngoai').value.trim();
        if (dvMoi && ngoai) ngoai = '';
        ums.api.call({
            action: 'NS_QT_ThuyenChuyenCanBo/ThemMoi',
            strId: '', strSoQuyetDinh: f('so').value.trim(), strNgayQuyetDinh: f('ngayky').value, strNgayChuyen: f('ngaychuyen').value,
            strDonViCu_Id: e(cb.DAOTAO_COCAUTOCHUC_ID), strDonViMoi_Id: dvMoi, strDonViCu_NgoaiTruong: '', strDonViMoi_NgoaiTruong: ngoai,
            strThongTinDinhKem: '', strNhanSu_ThongTinQD_Id: f('qd').value, iTrangThai: 1, iThuTu: 0,
            strNhanSu_HoSoCanBo_Id: cb.ID, strNguoiThucHien_Id: ''
        }).then(function (r) {
            ui.toast('Thêm mới thành công!', 'ok');
            var id = (r.raw && r.raw.Id) || '';
            ums.ref.quaTrinhCuoiCung('NHANSU_QT_TCCB');
            return (id ? tep.save(id) : Promise.resolve()).then(function () { sang(false); napNhanSu(); });
        }).catch(function (err) { ums.api.handle(err, 'NS_QT_ThuyenChuyenCanBo/ThemMoi'); });
    }

    /* ---------- Sự kiện ---------- */
    inpQ.addEventListener('input', function () { C.loc(elCay, inpQ.value); });
    inpQ.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); napCay(); } });
    jQuery(selLoai).on('select2:select select2:clear', function () { napCay(); });
    ums.pat.cotTrai({ side: mst.side, search: inpQ }, { tai: function () { napCay(); }, tuTaiLoc: false, tuTim: false });   // gõ = lọc cây tại chỗ
    elCay.addEventListener('click', function (ev) {
        var b = ev.target.closest('.nscc-node');
        if (!b) return;
        S.dv = b.getAttribute('data-id');
        C.chon(elCay, S.dv);
        z('dem').textContent = '';
        sang(false);
        napNhanSu();
    });
    root.addEventListener('click', function (ev) {
        var dc = ev.target.closest('[data-dc]');
        if (dc && root.contains(dc)) {
            var cb = S.ns.filter(function (r) { return r.ID === dc.getAttribute('data-dc'); })[0];
            if (cb) moForm(cb);
            return;
        }
        var b = ev.target.closest('button[data-a]');
        if (!b || !root.contains(b)) return;
        if (b.getAttribute('data-a') === 'luu') luu();
        else if (b.getAttribute('data-a') === 'dong') sang(false);
    });

    ui.enhance(root);
    Array.prototype.forEach.call(root.querySelectorAll('[data-type="date"]'), function (x) { ui.datepicker(x); });
    napCay();
})();
