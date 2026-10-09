/* =========================================================================
   ums.dkhChon — hộp chọn nhiều dòng (phân trang máy chủ) của phân hệ Đăng ký học
   ---------------------------------------------------------------------------
   Viết tạm trong module (tầng chung chưa có hộp chọn HỌC PHẦN / LỚP QUẢN LÝ) — ĐỀ NGHỊ
   đưa lên assets/js/patterns.js thành ums.pat.pickHocPhan / ums.pat.pickLop.
   Dùng ở: nguyenvongdangky/kehoachdangky (học phần), nganh2/kehoach (lớp — nạp chéo
   ../../nguyenvongdangky/script/_nvchon.js).

   ums.dkhChon.hocPhan({ onPick(rows, dlg) })   = edu.extend.genModal_HocPhan(callback) (Corei/systemextend.js:555)
       Lọc: từ khoá · Loại cơ cấu tổ chức (đơn vị CHA) · Cơ cấu tổ chức (đơn vị CON của cha đang chọn).
       Lời gọi: KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eCS4iESkgLwPP  pkg_kehoach_thongtin.LayDSKS_DaoTao_HocPhan
           strTuKhoa, strDaoTao_MonHoc_Id "" (gốc đọc ô không có), strThuocBoMon_Id (= ô con, rỗng thì ô cha),
           strThuocTinhHocPhan_Id "" , strNguoiThucHien_Id "", pageIndex, pageSize        (MA, TEN, HOCTRINH)
       Đơn vị: edu.system.getList_CoCauToChuc({ iTrangThai: 1 }) → ums.ref.coCauToChuc; cha = không có
           DAOTAO_COCAUTOCHUC_CHA_ID. Cặp Loại CCTC → CCTC: khoá con khi chưa chọn cha (ums.pat.chain).
       Sửa: cột "Họ tên" của gốc (chép từ hộp nhân sự) đặt lại thành "Tên học phần".

   ums.dkhChon.lop({ onPick(rows, dlg), extraHtml })   = edu.extend.genModal_Lop(callback) (Corei/systemextend.js:1501)
       Lọc (chọn nhiều, "Tất cả …" = lọc TUỲ CHỌN, không khoá): Khoa quản lý · Hệ · Khoá · Chương trình · từ khoá.
       Lời gọi (chép nguyên):
           KHCT_ThongTin_MH/DSA4BRIKKS4gEDQgLw04       pkg_kehoach_thongtin.LayDSKhoaQuanLy (edu.system.getList_KhoaQuanLy)
           KHCT_ThongTin/LayDSDaoTao_HeDaoTaoQuyen     GET  strTuKhoa "", strDaoTao_KhoaQuanLy_Id, …, pageSize 1000000
           KHCT_ThongTin_MH/…KhoaDaoTaoQuyen / …ToChucCTQuyen  (lọc quyền, như edu.extend)
           KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eDS4xEDQgLw04EDQ4JC8P  pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLyQuyen
               strTuKhoa, strDaoTao_HeDaoTao_Id, strDaoTao_KhoaDaoTao_Id, strDaoTao_ToChucCT_Id,
               strDaoTao_KhoaQuanLy_Id (… "a,b" khi chọn nhiều), pageIndex, pageSize
               → MA, TEN, DAOTAO_KHOADAOTAO_TEN, DAOTAO_CHUONGTRINH_TEN, DAOTAO_KHOAQUANLY_TEN (+ DAOTAO_HEDAOTAO_ID,
                 DAOTAO_KHOADAOTAO_ID, DAOTAO_TOCHUCCHUONGTRINH_ID mà màn gọi dùng khi lưu)
       Sửa: ô từ khoá của gốc KHÔNG được gửi (getList_Lop đọc txtAAAA) — bản mới gửi chữ trong ô.
       Đổi ô cha thì nạp lại và xoá trắng ô con (Khoa QL → Hệ, Khoá, CT; Hệ → Khoá; Khoá → CT).
   Chung: dòng chọn giữ qua các trang (gốc chỉ lấy trang đang hiện); bấm "Chọn" khi chưa đánh dấu thì báo.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    function e(v) { return v === undefined || v === null ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : (d && d.rs) || []; }
    function qa(r, s) { return Array.prototype.slice.call(r.querySelectorAll(s)); }

    /* Khung chung: lọc trên, bảng dưới, ô chọn cuối dòng, nút "Chọn" ở chân hộp */
    function bang(o) {
        var page = 1, size = o.pageSize || 10, total = 0, rows = [], picked = {}, order = [];
        var dlg = ui.dialog({
            title: o.title, icon: o.icon || 'fa-magnifying-glass', size: 'xl',
            body:
                '<div class="ums-filter">' + o.loc +
                    '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
                '</div>' + (o.extraHtml || '') +
                '<div class="ums-row ums-row--between ums-u-mt-4">' +
                    '<b class="ums-u-navy">Danh sách <span class="ums-u-faint ums-u-fz13" data-f="n"></span></b>' +
                    '<span class="ums-u-fz13 ums-u-muted" data-f="sel"></span></div>' +
                '<div class="ums-u-mt-2" data-f="tbl"></div>',
            buttons: [{ text: 'Chọn', kind: 'add', onClick: function () {
                var list = order.filter(function (id) { return picked[id]; }).map(function (id) { return picked[id]; });
                if (!list.length) { ui.toast(o.canChon || 'Vui lòng chọn đối tượng!', 'warn'); return false; }
                return o.onPick ? o.onPick(list, dlg) : undefined;
            } }]
        });
        var B = dlg.body;
        function f(k) { return B.querySelector('[data-f="' + k + '"]'); }
        ui.enhance(B);

        function search(p) {
            if (p) page = p;
            f('tbl').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            ums.api.call(o.call(f, page, size)).then(function (r) {
                rows = arr(r.data);
                total = Number(r.pager) || rows.length;
                draw();
            }).catch(function (err) { f('tbl').innerHTML = ui.fail(err.message); ums.api.handle(err, o.title); });
        }
        function draw() {
            f('n').textContent = '(' + total + ')';
            ui.table({
                el: f('tbl'), rows: rows, empty: o.empty || 'Không có dữ liệu',
                page: { index: page, size: size, total: total,
                        onChange: function (p) { if (p >= 1 && p <= Math.ceil(total / size)) search(p); },
                        onSize: function (v) { size = v === 'all' ? Math.max(total, 1) : Number(v); search(1); } },
                columns: o.columns.concat([{ head: '<input type="checkbox" data-pk="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                    render: function (r, i) { return '<input type="checkbox" data-pk="' + i + '"' + (picked[r.ID] ? ' checked' : '') + '>'; } }])
            });
            sync();
        }
        function sync() {
            var n = Object.keys(picked).length;
            f('sel').textContent = n ? 'Đã chọn ' + n : '';
            qa(f('tbl'), 'input[data-pk]').forEach(function (x) {
                if (x.getAttribute('data-pk') === 'all') return;
                var tr = x.closest('tr'); if (tr) tr.classList.toggle('is-selected', x.checked);
            });
        }
        function mark(r, on) {
            if (on) { if (!picked[r.ID]) order.push(r.ID); picked[r.ID] = r; } else delete picked[r.ID];
        }
        f('tbl').addEventListener('change', function (ev) {
            var t = ev.target;
            if (!t.matches || !t.matches('input[data-pk]')) return;
            var k = t.getAttribute('data-pk');
            if (k === 'all') {
                rows.forEach(function (r, i) {
                    mark(r, t.checked);
                    var c = f('tbl').querySelector('input[data-pk="' + i + '"]'); if (c) c.checked = t.checked;
                });
            } else mark(rows[Number(k)], t.checked);
            sync();
        });
        B.addEventListener('click', function (ev) { if (ev.target.closest('[data-a="search"]')) search(1); });
        B.addEventListener('keydown', function (ev) {
            if (ev.key === 'Enter' && ev.target.matches && ev.target.matches('input[data-f="q"]')) { ev.preventDefault(); search(1); }
        });
        if (o.init) o.init(f, B);
        search(1);
        return dlg;
    }

    /* ---------- Học phần (genModal_HocPhan) ------------------------------ */
    function hocPhan(o) {
        o = o || {};
        var cha = [], con = [];
        return bang({
            title: 'Tìm kiếm học phần', icon: 'fa-book', canChon: 'Vui lòng chọn học phần!',
            loc: '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                '<div class="ums-field"><select class="ums-select" data-f="loai" data-ph="Chọn loại cơ cấu tổ chức"></select></div>' +
                '<div class="ums-field"><select class="ums-select" data-f="cctc" data-ph="Chọn cơ cấu tổ chức"></select></div>',
            init: function (f) {
                ums.ref.coCauToChuc({ iTrangThai: 1 }).then(function (ds) {
                    cha = ds.filter(function (x) { return !x.DAOTAO_COCAUTOCHUC_CHA_ID; });
                    con = ds.filter(function (x) { return !!x.DAOTAO_COCAUTOCHUC_CHA_ID; });
                    pat.fill(f('loai'), cha, { name: 'TEN', head: 'Chọn loại cơ cấu tổ chức' });
                    pat.fill(f('cctc'), con, { name: 'TEN', head: 'Chọn cơ cấu tổ chức' });
                }).catch(function (err) { ums.api.handle(err, 'cơ cấu tổ chức'); });
                if (window.jQuery) {
                    jQuery(f('loai')).on('select2:select select2:clear', function () {
                        var id = f('loai').value;
                        pat.fill(f('cctc'), id ? con.filter(function (x) { return x.DAOTAO_COCAUTOCHUC_CHA_ID === id; }) : con,
                            { name: 'TEN', head: 'Chọn cơ cấu tổ chức' });
                    });
                }
                pat.chain([f('loai'), f('cctc')], { phatLai: false });
            },
            call: function (f, page, size) {
                return {
                    action: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eCS4iESkgLwPP',
                    func: 'pkg_kehoach_thongtin.LayDSKS_DaoTao_HocPhan',
                    strTuKhoa: (f('q').value || '').trim(),
                    strDaoTao_MonHoc_Id: '',
                    strThuocBoMon_Id: f('cctc').value || f('loai').value,
                    strThuocTinhHocPhan_Id: '',
                    strNguoiThucHien_Id: '',
                    pageIndex: page, pageSize: size
                };
            },
            columns: [
                { title: 'Mã số', prop: 'MA', cls: 'is-nowrap' },
                { title: 'Tên học phần', prop: 'TEN' },
                { title: 'Số tín', prop: 'HOCTRINH', cls: 'is-center' }
            ],
            onPick: o.onPick
        });
    }

    /* ---------- Lớp quản lý (genModal_Lop) ------------------------------- */
    function lop(o) {
        o = o || {};
        function sel(k, ph) { return '<div class="ums-field"><select class="ums-select" multiple data-f="' + k + '" data-ph="' + esc(ph) + '"></select></div>'; }
        return bang({
            title: 'Tìm kiếm lớp', icon: 'fa-users-rectangle', canChon: 'Vui lòng chọn lớp!',
            loc: '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                sel('kql', 'Tất cả khoa quản lý') + sel('he', 'Tất cả hệ đào tạo') + sel('khoa', 'Tất cả khóa đào tạo') +
                sel('ct', 'Tất cả chương trình đào tạo'),
            extraHtml: o.extraHtml,
            init: function (f) {
                function v(k) { return pat.val(f(k)); }
                function xoa(ks) { ks.forEach(function (k) { if (window.jQuery) jQuery(f(k)).val([]).trigger('change.select2').trigger('ums:refresh'); }); }
                function lay(call, k, name) {
                    call.silent = true;
                    return ums.api.call(call).then(function (r) { pat.fill(f(k), arr(r.data), { name: name }); })
                        .catch(function (err) { ums.api.handle(err, 'nạp ' + k); });
                }
                function he() {
                    return lay({ action: 'KHCT_ThongTin/LayDSDaoTao_HeDaoTaoQuyen', method: 'GET',
                        strTuKhoa: '', strDaoTao_KhoaQuanLy_Id: v('kql'), strDaoTao_HinhThucDaoTao_Id: '', strDaoTao_BacDaoTao_Id: '',
                        strNguoiThucHien_Id: (ums.session && ums.session.userId) || '', pageIndex: 1, pageSize: 1000000 }, 'he', 'TENHEDAOTAO');
                }
                function khoa() {
                    return lay({ action: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eCikuIAUgLhUgLhA0OCQv', func: 'pkg_kehoach_thongtin.LayDSKS_DaoTao_KhoaDaoTaoQuyen',
                        strTuKhoa: '', strDaoTao_KhoaQuanLy_Id: v('kql'), strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_CoSoDaoTao_Id: '',
                        strNguoiTao_Id: '', strNguoiThucHien_Id: (ums.session && ums.session.userId) || '', pageIndex: 1, pageSize: 1000000 }, 'khoa', 'TENKHOA');
                }
                function ct() {
                    return lay({ action: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eFS4CKTQiAhUQNDgkLwPP', func: 'pkg_kehoach_thongtin.LayDSKS_DaoTao_ToChucCTQuyen',
                        strTuKhoa: '', strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_KhoaDaoTao_Id: v('khoa'), strDaoTao_N_CN_Id: '',
                        strDaoTao_KhoaQuanLy_Id: v('kql'), strDaoTao_ToChucCT_Cha_Id: '', strNguoiThucHien_Id: (ums.session && ums.session.userId) || '',
                        pageIndex: 1, pageSize: 1000000 }, 'ct', 'TENCHUONGTRINH');
                }
                ums.ref.khoaQuanLy().then(function (r) { pat.fill(f('kql'), r, { name: 'TEN' }); })
                    .catch(function (err) { ums.api.handle(err, 'khoa quản lý'); });
                he();
                if (window.jQuery) {
                    var EV = 'select2:select select2:unselect select2:clear';
                    jQuery(f('kql')).on(EV, function () { xoa(['he', 'khoa', 'ct']); he(); khoa(); ct(); });
                    jQuery(f('he')).on(EV, function () { xoa(['khoa', 'ct']); khoa(); });
                    jQuery(f('khoa')).on(EV, function () { xoa(['ct']); ct(); });
                }
            },
            call: function (f, page, size) {
                return {
                    action: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eDS4xEDQgLw04EDQ4JC8P',
                    func: 'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLyQuyen',
                    strTuKhoa: (f('q').value || '').trim(),
                    strDaoTao_HeDaoTao_Id: pat.val(f('he')),
                    strDaoTao_CoSoDaoTao_Id: '',
                    strDaoTao_KhoaDaoTao_Id: pat.val(f('khoa')),
                    strDaoTao_Nganh_Id: '',
                    strDaoTao_LoaiLop_Id: '',
                    strDaoTao_ToChucCT_Id: pat.val(f('ct')),
                    strDaoTao_KhoaQuanLy_Id: pat.val(f('kql')),
                    strNhomlop_Id: '',
                    strNguoiThucHien_Id: (ums.session && ums.session.userId) || '',
                    pageIndex: page, pageSize: size
                };
            },
            columns: [
                { title: 'Mã lớp', prop: 'MA', cls: 'is-center is-nowrap' },
                { title: 'Tên lớp', prop: 'TEN' },
                { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                { title: 'Khoa quản lý', prop: 'DAOTAO_KHOAQUANLY_TEN' }
            ],
            onPick: o.onPick
        });
    }

    ums.dkhChon = { bang: bang, hocPhan: hocPhan, lop: lop };
})();
