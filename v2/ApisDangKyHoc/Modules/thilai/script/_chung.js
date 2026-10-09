/* =========================================================================
   Kế hoạch thi lại — tiện ích dùng chung của module thilai (ums.tlKh)
   Bản gốc: ApisDangKyHoc/Modules/thilai/script/kehoach.js + hai hộp chọn
   của Corei/systemextend.js mà màn này dùng:
       edu.extend.genModal_HocPhan   + getList_HocPhan      (Corei:555, 673)
           KHCT_ThongTin_MH/… pkg_kehoach_thongtin.LayDSKS_DaoTao_HocPhan
           strTuKhoa, strDaoTao_MonHoc_Id "", strThuocBoMon_Id (bộ môn, không
           có thì khoa/viện), strThuocTinhHocPhan_Id "", strNguoiThucHien_Id "",
           pageIndex, pageSize — cột MA, TEN, HOCTRINH
       edu.extend.genModal_NguoiDung + getList_NguoiDungP   (Corei:324, 444)
           CMS_QuanLyNguoiDung_MH/… pkg_chung_quanlynguoidung.LayDanhSachNguoiDung
           strTuKhoa, strPhanLoaiDoiTuong "", dTrangThai -1, strChung_DonVi_Id,
           strVaiTro_Id "", strCapXuLy_Id "", strTinhThanh_Id "", pageIndex, pageSize
           — cột HINHDAIDIEN, TENDAYDU, TAIKHOAN, GIOITINH_TEN
       Bộ lọc đơn vị của cả hai hộp: edu.system.getList_CoCauToChuc (= ums.ref.
       coCauToChuc) tách "Khoa/Viện/Phòng ban" (không có DAOTAO_COCAUTOCHUC_CHA_ID)
       và "Bộ môn" (có cha) — chọn Khoa lọc Bộ môn theo cha.

   CẦN TẦNG CHUNG (viết tạm ở đây, đề nghị đưa lên assets/js/patterns.js):
       T.hopChon / pickHocPhan / pickNguoiDung — hai hộp chọn trên chưa có ở
       tầng chung (tầng chung mới có pickSinhVien*, pickNhanSu — nhân sự là
       LayDSNhanSu_HoSo_v2, KHÁC người dùng).
   Khác bản gốc:
     · Hộp mở là nạp trang 1 ngay (bản gốc để trống tới khi bấm Tìm kiếm).
     · Chọn giữ qua các trang; "Chọn" khi chưa đánh dấu thì báo (gốc gọi
       callback với mảng rỗng).
     · Khoa/Viện → Bộ môn khoá theo luật cha → con.
     · Hộp người dùng bỏ cột "Năm sinh" (bản gốc luôn để trống) và cột "#"
       (liên kết Chọn bị ẩn khi có callback); hộp học phần: tiêu đề cột thứ hai
       gốc ghi nhầm "Họ tên" — ở đây "Tên học phần".
   ========================================================================= */
(function () {
    'use strict';

    var ums = window.ums, ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var T = ums.tlKh = {};

    function e(v) { return v === undefined || v === null ? '' : v; }
    function qa(root, sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }

    T.e = e;
    T.qa = qa;
    T.AC = 'DKH_DangKyThi_MonThi_Chung/';
    T.TT = 'DKH_DangKyThi_MonThi_ThongTin/';

    /** Dòng dữ liệu của một kết quả ums.api.call */
    T.ds = function (r) { var d = r && r.data; return Array.isArray(d) ? d : (d && d.rs) || []; };
    T.tim = function (rows, id) { return (rows || []).filter(function (r) { return String(r.ID) === String(id); })[0]; };
    T.hoTen = function (r) { return e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN); };
    T.uid = function () { return (ums.session && ums.session.userId) || ''; };

    /* ---------- Cột ô đánh dấu (checkX + chkSystemSelectAll của bản gốc) ------
       Mỗi bảng một thuộc tính riêng (data-kq, data-cb, …) — KHÔNG dùng data-ck
       (trùng ô trạng thái của ums.pat.checks). Ô "chọn tất cả" mang data-all. */
    T.cotChon = function (k) {
        return { head: '<input type="checkbox" data-all="' + k + '" title="Chọn tất cả">', cls: 'is-center', width: '44px',
            render: function (r) { return '<input type="checkbox" data-' + k + '="' + esc(r.ID) + '">'; } };
    };
    T.ganChon = function (host) {
        host.addEventListener('change', function (ev) {
            var t = ev.target, k = t.getAttribute && t.getAttribute('data-all');
            if (!k) return;
            var tb = t.closest('table');
            if (tb) qa(tb, 'tbody input[data-' + k + ']').forEach(function (x) { x.checked = t.checked; });
        });
    };
    T.daChon = function (host, k) {
        return qa(host, 'tbody input[data-' + k + ']').filter(function (x) { return x.checked; })
            .map(function (x) { return x.getAttribute('data-' + k); });
    };

    /** Khung "đang tải" / "lỗi" cho một vùng bảng */
    T.dang = function (el) { el.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin'); };
    T.loi = function (el, err, noi) { el.innerHTML = ui.fail(err && err.message); ums.api.handle(err, noi); };

    /** Hỏi lại rồi chạy hàng loạt (edu.system.confirm + genHTML_Progress) */
    T.xoa = function (calls, xong, msg) {
        return ui.confirm(msg || 'Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá dữ liệu' }).then(function (yes) {
            if (!yes) return;
            return ui.batch(calls, { title: 'Đang xoá', okText: 'Xóa thành công!' }).then(function () { if (xong) xong(); });
        });
    };

    /* ---------- Bảng phân trang ở máy khách (bPaginate của loadToTable_data) --- */
    T.bangTrang = function (el, o) {
        var st = { page: 1, size: 10, rows: [] };
        function ve() {
            var n = st.rows.length, from = (st.page - 1) * st.size;
            ui.table({
                el: el, rows: st.rows.slice(from, from + st.size), columns: o.columns, empty: o.empty,
                page: { index: st.page, size: st.size, total: n,
                    onChange: function (p) { if (p >= 1 && p <= Math.ceil(n / st.size)) { st.page = p; ve(); } },
                    onSize: function (v) { st.size = v === 'all' ? Math.max(n, 1) : Number(v); st.page = 1; ve(); } }
            });
        }
        return { ve: function (rows) { st.rows = rows || []; st.page = 1; ve(); }, rows: function () { return st.rows; } };
    };

    /* ---------- Cơ cấu tổ chức (cache một lần cho mọi hộp) -------------------- */
    var cctcP = null;
    function cctc() {
        if (!cctcP) cctcP = ums.ref.coCauToChuc({}).catch(function (err) { cctcP = null; throw err; });
        return cctcP;
    }

    /* =====================================================================
       Hộp chọn có bộ lọc Khoa/Viện → Bộ môn, phân trang máy chủ, chọn nhiều
       o = { title, cot: [cột], call(q, donVi, page, size) → lời gọi,
             onPick(ids, rows), okText }
       ===================================================================== */
    T.hopChon = function (o) {
        var page = 1, size = 10, total = 0, rows = [], picked = {}, cha = [], con = [];
        var dlg = ui.dialog({
            title: o.title, icon: 'fa-magnifying-glass', size: 'xl',
            body:
                '<div class="ums-filter">' +
                    '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                    '<div class="ums-field"><select class="ums-select" data-f="loai" data-ph="Chọn Khoa/Viện/Phòng ban"><option value="">Chọn Khoa/Viện/Phòng ban</option></select></div>' +
                    '<div class="ums-field"><select class="ums-select" data-f="dv" data-ph="Bộ môn"><option value="">Bộ môn</option></select></div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-f': 'go' } }) + '</div>' +
                '</div>' +
                '<div class="ums-row ums-row--between ums-u-mt-4">' +
                    '<b class="ums-u-navy">Danh sách <span class="ums-u-faint ums-u-fz13" data-f="n"></span></b>' +
                    '<span class="ums-u-fz13 ums-u-muted" data-f="sel"></span></div>' +
                '<div class="ums-u-mt-2" data-f="tbl"></div>',
            buttons: [{ text: o.okText || 'Chọn', kind: 'add', mod: 'primary', onClick: function () {
                var ids = Object.keys(picked);
                if (!ids.length) { ui.toast('Vui lòng chọn đối tượng', 'warn'); return false; }
                o.onPick(ids, ids.map(function (k) { return picked[k]; }));
            } }]
        });
        var B = dlg.body;
        function f(k) { return B.querySelector('[data-f="' + k + '"]'); }
        ui.enhance(B);

        cctc().then(function (list) {
            cha = list.filter(function (x) { return !x.DAOTAO_COCAUTOCHUC_CHA_ID; });
            con = list.filter(function (x) { return !!x.DAOTAO_COCAUTOCHUC_CHA_ID; });
            pat.fill(f('loai'), cha, { name: 'TEN' });
        }).catch(function (err) { ums.api.handle(err, 'cơ cấu tổ chức'); });

        function napCon() {
            var p = f('loai').value;
            pat.fill(f('dv'), p ? con.filter(function (x) { return String(x.DAOTAO_COCAUTOCHUC_CHA_ID) === String(p); }) : [], { name: 'TEN' });
        }
        if (window.jQuery) jQuery(f('loai')).on('select2:select select2:clear', napCon);
        pat.chain([f('loai'), f('dv')], { phatLai: false });

        function tim(p) {
            if (p) page = p;
            T.dang(f('tbl'));
            var dv = f('dv').value || f('loai').value || '';
            var c = o.call((f('q').value || '').trim(), dv, page, size);
            c.silent = true;
            ums.api.call(c).then(function (r) {
                rows = T.ds(r);
                total = Number(r.pager) || rows.length;
                ve();
            }).catch(function (err) { T.loi(f('tbl'), err, o.title); });
        }
        function ve() {
            f('n').textContent = '(' + total + ')';
            ui.table({
                el: f('tbl'), rows: rows, empty: 'Không tìm thấy dữ liệu',
                page: { index: page, size: size, total: total,
                    onChange: function (p) { if (p >= 1 && p <= Math.ceil(total / size)) tim(p); },
                    onSize: function (v) { size = v === 'all' ? Math.max(total, 1) : Number(v); tim(1); } },
                columns: o.cot.concat([{
                    head: '<input type="checkbox" data-hc="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                    render: function (r, i) { return '<input type="checkbox" data-hc="' + i + '"' + (picked[r.ID] ? ' checked' : '') + '>'; }
                }])
            });
            dem();
        }
        function dem() {
            var n = Object.keys(picked).length;
            f('sel').textContent = n ? 'Đã chọn ' + n : '';
        }
        f('tbl').addEventListener('change', function (ev) {
            var t = ev.target, k = t.getAttribute && t.getAttribute('data-hc');
            if (k === null || k === undefined) return;
            if (k === 'all') {
                rows.forEach(function (r, i) {
                    if (t.checked) picked[r.ID] = r; else delete picked[r.ID];
                    var c = f('tbl').querySelector('input[data-hc="' + i + '"]'); if (c) c.checked = t.checked;
                });
            } else {
                var r = rows[Number(k)];
                if (r) { if (t.checked) picked[r.ID] = r; else delete picked[r.ID]; }
            }
            dem();
        });
        B.addEventListener('click', function (ev) { if (ev.target.closest('[data-f="go"]')) tim(1); });
        f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim(1); } });
        tim(1);
        return dlg;
    };

    /** edu.extend.genModal_HocPhan — "Tìm kiếm học phần" */
    T.pickHocPhan = function (onPick) {
        return T.hopChon({
            title: 'Tìm kiếm học phần',
            cot: [
                { title: 'Mã số', prop: 'MA', cls: 'is-nowrap' },
                { title: 'Tên học phần', prop: 'TEN' },
                { title: 'Số tín', prop: 'HOCTRINH', cls: 'is-center' }
            ],
            call: function (q, dv, page, size) {
                return {
                    action: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eCS4iESkgLwPP',
                    func: 'pkg_kehoach_thongtin.LayDSKS_DaoTao_HocPhan',
                    strTuKhoa: q,
                    strDaoTao_MonHoc_Id: '',
                    strThuocBoMon_Id: dv,
                    strThuocTinhHocPhan_Id: '',
                    strNguoiThucHien_Id: '',
                    pageIndex: page,
                    pageSize: size
                };
            },
            onPick: onPick
        });
    };

    /** edu.extend.genModal_NguoiDung — "Tìm kiếm nhân sự" (danh sách NGƯỜI DÙNG) */
    T.pickNguoiDung = function (onPick) {
        return T.hopChon({
            title: 'Tìm kiếm nhân sự',
            cot: [
                { title: 'Hình ảnh', cls: 'is-center', width: '72px', render: function (r) {
                    return ums.pat.anhNguoi(r.HINHDAIDIEN);
                } },
                { title: 'Họ tên', render: function (r) { return ui.cell(e(r.TENDAYDU), e(r.TAIKHOAN)); } },
                { title: 'Giới tính', prop: 'GIOITINH_TEN', cls: 'is-center' }
            ],
            call: function (q, dv, page, size) {
                return {
                    action: 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikPJjQuKAU0LyYP',
                    func: 'pkg_chung_quanlynguoidung.LayDanhSachNguoiDung',
                    strTuKhoa: q,
                    strPhanLoaiDoiTuong: '',
                    dTrangThai: -1,
                    strChung_DonVi_Id: dv,
                    strVaiTro_Id: '',
                    strCapXuLy_Id: '',
                    strTinhThanh_Id: '',
                    pageIndex: page,
                    pageSize: size
                };
            },
            onPick: onPick
        });
    };
})();
