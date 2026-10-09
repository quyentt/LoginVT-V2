/* =========================================================================
   ums.miengiam — phần dùng chung của module Miễn giảm
   (khaidonviphi cũng nạp tệp này để dùng nguồn ô chọn và lưới nhập)
   ---------------------------------------------------------------------------
   Nguồn ô chọn — chép NGUYÊN lời gọi của các tệp gốc:
       khoanThu()   TC_KhoanThu/LayDanhSach                  GET (getList_LoaiKhoan)
       kieuHoc()    CM_DanhMucDuLieu/LayDanhSach             GET KHDT.DIEM.KIEUHOC (getList_KieuHoc kiểu makeRequest)
       thoiGian()   CM_ThoiGianDaoTao/LayDSDAOTAO_ThoiGianDaoTao GET (getList_ThoiGianDaoTao tự viết trong màn)
       dmdl(code)   = edu.system.getList_DanhMucDulieu: CMS_DanhMucThuocTinh/
                    LayDanhSachDuLieuTheoBangDM, dTrangThai RỖNG (khác ums.api.dm
                    gửi 1 — đó là loadToCombo_DanhMucDuLieu)

   KHÔNG dựng lại bố cục ở đây nữa — xem _v2/BO-CUC.md. Các tên dưới đây
   chỉ còn là lối gọi tắt sang tầng chung, giữ tên cũ để các màn không phải sửa:
       M.money · M.num      → ums.pat.money / ums.pat.num
       M.fill  · M.val      → ums.pat.fill  / ums.pat.val
       M.head               → ums.pat.page
       M.matrix             → ums.pat.matrix   (lưới nhập dòng × cột)
       M.pickSinhVien       → ums.pat.pickSinhVien (phân trang: ums.ref.sinhVienPage)
       M.initFilters        → ums.ui.enhance  (select2 + lịch cho mọi ô trong vùng)

   Riêng của module, còn giữ ở đây:
       formDialog(o)   biểu mẫu thêm / sửa MỘT bản ghi của lưới / bảng xoay — NGAY TRONG TRANG
                       (ums.pat.formTrang, truyền o.host = gốc màn; BO-CUC luật 1). Tên hàm giữ
                       nguyên để các màn không phải đổi; không truyền host thì vẫn bật hộp thoại.
   Khuôn màn dùng chung nằm ở tệp riêng (nạp sau tệp này):
       _doituong.js  doiTuongPivot(o)  Định mức miễn giảm / Hệ số đối tượng
       _mien.js      mienSinhVien(o)   Miễn giảm một phần / toàn phần
       _svmien.js    svMienMatrix(o)   Sinh viên miễn giảm (mới) / Số tiền miễn giảm
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var esc = ui.esc;
    var pat = ums.pat;
    var M = {};
    var cache = {};

    /* ---------- Tiện ích ------------------------------------------------ */
    function e(v) { return v === undefined || v === null ? '' : v; }
    M.e = e;

    function rowsOf(r) {
        var d = r && r.data;
        return Array.isArray(d) ? d : (d && d.rs) || [];
    }
    M.rowsOf = rowsOf;

    /** Gọi và trả mảng dòng */
    M.rows = function (call) {
        return ums.api.call(call).then(rowsOf);
    };

    /** edu.util.formatCurrency: rỗng → 0, rồi dấu phẩy ngăn nghìn của tầng chung */
    M.money = function (v) { return pat.money(v === undefined || v === null || v === '' ? 0 : v); };

    /** Bỏ dấu phẩy ngăn nghìn — .replace(/,/g, '') của bản gốc */
    M.num = function (v) { return pat.num(v); };

    function once(key, call) {
        if (!cache[key]) {
            call.silent = true;
            cache[key] = ums.api.call(call).then(rowsOf, function (err) { delete cache[key]; throw err; });
        }
        return cache[key];
    }

    /* ---------- Nguồn ô chọn -------------------------------------------- */
    M.khoanThu = function () {
        return once('khoanthu', {
            action: 'TC_KhoanThu/LayDanhSach',
            method: 'GET',
            strTuKhoa: '',
            pageIndex: 1,
            pageSize: 10000,
            strNhomCacKhoanThu_Id: '',
            strCanBoQuanLy_Id: '',
            strNguoiThucHien_Id: ''
        });
    };

    M.kieuHoc = function () {
        return once('kieuhoc', {
            action: 'CM_DanhMucDuLieu/LayDanhSach',
            method: 'GET',
            versionAPI: 'v1.0',
            strMaBangDanhMuc: 'KHDT.DIEM.KIEUHOC'
        });
    };

    M.thoiGian = function () {
        return once('thoigian', {
            action: 'CM_ThoiGianDaoTao/LayDSDAOTAO_ThoiGianDaoTao',
            method: 'GET',
            versionAPI: 'v1.0',
            strDAOTAO_Nam_Id: '',
            strNguoiThucHien_Id: '',
            strTuKhoa: '',
            pageIndex: 1,
            pageSize: 10000
        });
    };

    M.dmdl = function (code) {
        return once('dmdl:' + code, {
            action: 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM',
            method: 'GET',
            strMaBangDanhMuc: code,
            strTieuChiSapXep: ''
        });
    };

    /* ---------- Lối gọi tắt sang tầng chung ------------------------------ */

    /** Đổ danh sách vào ô chọn (ums.pat.fill). `value` = đặt sẵn giá trị. */
    M.fill = function (el, list, o) {
        if (!el) return;
        o = o || {};
        pat.fill(el, list, { id: o.id, name: o.name, head: o.head });
        if (o.value === undefined) return;
        if (window.jQuery) jQuery(el).val(o.value).trigger('change.select2');
        else el.value = o.value;
    };

    /** Giá trị ô chọn — nhiều giá trị thì nối dấu phẩy (edu.util.getValCombo) */
    M.val = function (el) { return pat.val(el); };

    /** Gắn select2 / lịch cho mọi ô trong vùng — ô chọn nhiều tự gom một dòng */
    M.initFilters = function (root) { ui.enhance(root); };

    M.q = function (root, sel) { return root.querySelector(sel); };

    /** Chạy danh sách hàm trả Promise, tối đa n luồng — không hiện hộp tiến độ */
    M.pool = function (jobs, n) {
        var i = 0;
        function next() {
            if (i >= jobs.length) return Promise.resolve();
            var f = jobs[i++];
            return Promise.resolve().then(f).catch(function () {}).then(next);
        }
        var w = [];
        for (var k = 0; k < Math.min(n || 4, jobs.length); k++) w.push(next());
        return Promise.all(w);
    };

    /* Lưới nhập ma trận: bố cục chung ums.pat.matrix. Bản gốc dựng
       <input id="input<dòng>_<cột>"> rồi tách id bằng substring(5, 37) — tức
       mặc định khoá chính đúng 32 ký tự; bản chung giữ dòng/cột trong data-*
       nên không phụ thuộc độ dài khoá. */
    M.matrix = function (o) { return pat.matrix(o); };

    /* Hộp chọn sinh viên: bố cục chung ums.pat.pickSinhVien — cùng procedure
       pkg_hosohocvien.LayDanhSachHoSo như edu.system.getList_SinhVien
       (Core/systemroot.js:4783), có phân trang máy chủ 10 dòng như bản gốc. */
    M.pickSinhVien = function (o) { return pat.pickSinhVien(o); };

    /* ---------- Khung trang, nút, ô lọc ---------------------------------- */
    M.head = function (title, actionsHtml) { return pat.page(title, actionsHtml); };

    M.btn = function (act, icon, text, mod) {
        return '<button type="button" class="ums-btn ums-btn--' + (mod || 'out-primary') + '" data-act="' + esc(act) + '">' +
            '<i class="fa-light ' + esc(icon) + '"></i><span>' + esc(text) + '</span></button>';
    };

    M.filterSelect = function (key, label) {
        return '<div class="ums-field"><select class="ums-select" data-f="' + esc(key) + '" data-ph="' + esc(label) + '">' +
            '<option value="">' + esc(label) + '</option></select></div>';
    };

    M.f = function (root, key) { return root.querySelector('[data-f="' + key + '"]'); };
    M.fv = function (root, key) { return M.val(M.f(root, key)); };

    /* =====================================================================
       Biểu mẫu thêm / sửa MỘT bản ghi nhỏ của lưới / bảng xoay
       ---------------------------------------------------------------------
       BO-CUC luật 1 (người dùng nhắc lại 2026-09-30): thêm / sửa bản ghi là
       biểu mẫu NGAY TRONG TRANG, thay chỗ màn — KHÔNG bật hộp thoại, kể cả
       bản ghi chỉ 2–6 trường. o.host = gốc màn (vùng bị thay chỗ); ô ngắn
       hai ô một hàng (o.cols để đổi). Không truyền o.host thì vẫn bật hộp
       thoại như trước (giữ cho nơi gọi cũ, hiện không còn nơi nào).
       Ô chọn KHÔNG tự gọi select2 ở đây — M.fill (ums.pat.fill) gọi
       ums.ui.enhance.
       ===================================================================== */
    M.formDialog = function (o) {
        var fields = o.fields || [];
        var body = '<div class="ums-grid ums-grid--' + (o.cols || (o.host ? 2 : 1)) + '">' + fields.map(function (f) {
            var a = ' data-fk="' + esc(f.key) + '"';
            var ctl;
            if (f.type === 'select') {
                ctl = '<select class="ums-select"' + a + (f.multiple ? ' multiple' : '') +
                    (f.required ? ' data-required' : '') +
                    ' data-ph="' + esc(f.placeholder || ('Chọn ' + String(f.label).toLowerCase())) + '"></select>';
            } else if (f.type === 'static') {
                // chỉ để đọc: ô nhập readonly, không cần kiểu riêng
                ctl = '<input class="ums-input"' + a + ' readonly tabindex="-1">';
            } else if (f.type === 'date') {
                ctl = '<div class="ums-inputwrap"><input class="ums-input"' + a + ' autocomplete="off" placeholder="dd/mm/yyyy"><i class="fa-light fa-calendar"></i></div>';
            } else {
                ctl = '<input class="ums-input"' + a + ' autocomplete="off"' + (f.readonly ? ' readonly' : '') + '>';
            }
            return '<div' + (f.span ? ' style="grid-column:1 / -1"' : '') + '>' + ui.field(f.label, ctl, { required: f.required, hint: f.hint }) + '</div>';
        }).join('') + '</div>';

        var buttons = [];
        if (o.onDelete) buttons.push({ text: 'Xoá', kind: 'del', onClick: function (dlg) { run(dlg, 'del'); return false; } });
        buttons.push({ text: o.saveText || 'Lưu', kind: 'save', onClick: function (dlg) { run(dlg, 'save'); return false; } });

        var dlg = o.host
            ? pat.formTrang({ host: o.host, title: o.title, body: body, cols: 1, buttons: buttons })      // thân đã tự bọc lưới
            : ui.dialog({ title: o.title, icon: o.icon || 'fa-pen-to-square', size: o.size || 'md', body: body, buttons: buttons });

        function el(k) { return dlg.body.querySelector('[data-fk="' + k + '"]'); }
        var vals = o.values || {};

        fields.forEach(function (f) {
            var x = el(f.key);
            var v = vals[f.key] !== undefined ? vals[f.key] : f.value;
            if (f.type === 'select') {
                var src = typeof f.source === 'function' ? f.source() : f.source;
                Promise.resolve(src).then(function (list) {
                    M.fill(x, list || [], { id: f.id, name: f.name, head: f.placeholder, value: f.multiple && v ? String(v).split(',') : v });
                }).catch(function (err) { ums.api.handle(err, f.label); });
            } else {
                x.value = e(v);
                if (f.type === 'date') ui.datepicker(x);
            }
        });
        ui.enhance(dlg.body);

        var busy = false;
        function run(d, kind) {
            if (busy) return;
            var p;
            if (kind === 'del') {
                p = ui.confirm('Xoá dữ liệu đang sửa? Thao tác này không hoàn tác được.', { tone: 'bad', ok: 'Xoá' })
                    .then(function (yes) { return yes ? o.onDelete(d) : 'skip'; });
            } else {
                var v = values(), bad = [];
                fields.forEach(function (f) {
                    var x = el(f.key);
                    var wrong = f.required && f.type !== 'static' && !v[f.key];
                    if (!wrong && f.numeric && v[f.key] && isNaN(Number(M.num(v[f.key])))) wrong = true;
                    x.classList.toggle('is-invalid', !!wrong);
                    var s2 = x.nextElementSibling && x.nextElementSibling.classList.contains('select2') ? x.nextElementSibling : null;
                    if (s2) s2.classList.toggle('is-invalid', !!wrong);
                    if (wrong) bad.push(f.label);
                });
                if (bad.length) { ui.toast('Kiểm tra lại: ' + bad.join(', '), 'warn'); return; }
                p = Promise.resolve(o.onSave(v, d));
            }
            busy = true;
            p.then(function (r) { if (r !== 'skip' && r !== false) d.close(); })
                .catch(function (err) { ums.api.handle(err, o.title); })
                .then(function () { busy = false; });
        }

        function values() {
            var v = {};
            fields.forEach(function (f) {
                var x = el(f.key);
                if (f.type === 'static') return;
                v[f.key] = f.type === 'select' ? M.val(x) : (x.value || '').trim();
            });
            return v;
        }

        dlg.values = values;
        dlg.field = el;
        return dlg;
    };

    ums.miengiam = M;
})();
