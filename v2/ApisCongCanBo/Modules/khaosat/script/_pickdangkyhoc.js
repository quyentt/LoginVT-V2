/* =========================================================================
   Hộp "Thêm sinh viên từ đăng ký học" — ums.ks.pickDangKyHoc
   Bản gốc: ApisCongCanBo/Modules/khaosat/script/dsdangkyhoc_picker.js (window.DSDangKyHocPicker)
   ---------------------------------------------------------------------------
   Chỉ khaosat/kehoach dùng, nên để ở module (không đưa lên tầng chung).

   Ô lọc (nguồn chép nguyên):
       Học kỳ        DKH_Chung/LayThoiGianDangKyHoc (GET)                         nhiều
       Hệ            ums.ref.heDaoTao (edu.system.getList_HeDaoTao, pageSize 1000000) nhiều
       Khóa          DKH_PhanCong_LopHP/LayDSKhoaToChuc (GET) — theo Hệ, Học kỳ    nhiều
       Khoa quản lý  ums.ref.khoaQuanLy                                           nhiều
       Chương trình  DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc — Học kỳ, Khóa, Hệ, Khoa QL
       Học phần      DKH_PhanCong_LopHP/LayDSHocPhan — như trên + Chương trình ("TEN - MA")
       Kế hoạch      DKH_ThongTin/LayDSDangKy_KeHoachDangKy — theo Học kỳ          một
       Kiểu học      danh mục KHDT.DIEM.KIEUHOC                                    một
       Loại lớp, Số đã đăng ký từ/đến, Từ khoá, "Chỉ hiện chưa nộp tiền", "Chỉ hiện đã chuyển kế toán"
   Tìm: DKH_ThongTin2_MH (mã hoá) · pkg_dangkyhoc_thongtin2.LayDSDangKyHoc — tham số chép nguyên.
   Ba bộ lọc "chưa nộp / đã chuyển kế toán / loại lớp" lọc TẠI CHỖ trên trang đang
   xem (như bản gốc) — tổng số vẫn là số máy chủ báo.
   Chọn giữ qua các trang (bản gốc cũng vậy).

   Cặp cha → con: Học kỳ → Kế hoạch khoá theo luật chung (Kế hoạch lấy theo học kỳ).
   Các ô "Tất cả …" (Hệ, Khóa, Khoa QL, Chương trình, Học phần) là lọc TUỲ CHỌN —
   để mở như bản gốc, ghi vào danh sách cần hỏi nghiệp vụ.
   Khác bản gốc: nút Đóng dùng data-dismiss kiểu Bootstrap 3 trong vỏ Bootstrap 5
   (bấm không đóng) — ở đây đóng bình thường.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var ks = ums.ks = ums.ks || {};
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }

    ks.pickDangKyHoc = function (o) {
        o = o || {};
        var page = 1, size = 50, total = 0, trang = [], chon = {};
        function sel(k, ph, multi) { return '<div class="ums-field"><select class="ums-select"' + (multi ? ' multiple' : '') + ' data-f="' + k + '" data-ph="' + esc(ph) + '"><option value=""></option></select></div>'; }
        function inp(k, ph) { return '<div class="ums-field"><input class="ums-input" data-f="' + k + '" placeholder="' + esc(ph) + '" autocomplete="off"></div>'; }
        var dlg = ui.dialog({
            title: 'Thêm sinh viên từ đăng ký học', icon: 'fa-user-magnifying-glass', size: 'xl',
            body:
                '<div class="ums-grid ums-grid--4">' +
                    sel('tg', 'Chọn học kỳ', true) + sel('he', 'Tất cả hệ đào tạo', true) + sel('khoa', 'Tất cả khóa đào tạo', true) + sel('kql', 'Tất cả khoa quản lý', true) +
                    sel('ct', 'Tất cả chương trình', true) + sel('hp', 'Chọn học phần', true) + sel('kh', 'Chọn kế hoạch') + sel('kieu', 'Chọn kiểu học') +
                    '<div class="ums-field"><select class="ums-select" data-f="loai"><option value="">Tất cả loại lớp</option>' +
                        '<option value="rieng">Chỉ lớp riêng</option><option value="thuong">Chỉ lớp thường</option></select></div>' +
                    inp('tu', 'Số đã đăng ký (từ số)') + inp('den', 'Số đã đăng ký (đến số)') + inp('q', 'Từ khóa (mã SV, họ tên, mã lớp...)') +
                '</div>' +
                '<div class="ums-row ums-row--between ums-u-mt-4">' +
                    '<div class="ums-row"><label class="ums-check"><input type="checkbox" data-f="chuaNop"><span>Chỉ hiện chưa nộp tiền</span></label>' +
                    '<label class="ums-check"><input type="checkbox" data-f="daKT"><span>Chỉ hiện đã chuyển kế toán</span></label></div>' +
                    '<div class="ums-row">' + ui.btn('del', { text: 'Xóa lọc', mod: 'out-danger', icon: 'fa-eraser', attr: { 'data-a': 'xoaloc' } }) +
                        ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
                '</div>' +
                '<div class="ums-row ums-row--between ums-u-mt-4"><b class="ums-u-navy">Danh sách <span class="ums-u-faint ums-u-fz13" data-f="n"></span></b>' +
                    '<span class="ums-u-fz13 ums-u-muted" data-f="sel">Đã chọn: 0</span></div>' +
                '<div class="ums-u-mt-2" data-f="loi" hidden></div><div class="ums-u-mt-2" data-f="tbl"></div>',
            buttons: [{ text: 'Chọn', kind: 'save', onClick: function () {
                var list = Object.keys(chon).map(function (k) { return chon[k]; });
                if (!list.length) { ui.toast('Vui lòng chọn ít nhất một bản ghi.', 'warn'); return false; }
                if (o.onPick) o.onPick(list);
            } }]
        });
        var B = dlg.body;
        function f(k) { return B.querySelector('[data-f="' + k + '"]'); }
        function v(k) { return pat.val(f(k)); }
        ui.enhance(B);
        function fail(err) { ums.api.handle(err, 'hộp đăng ký học'); }
        function goi(action, p) { return ums.api.call(Object.assign({ action: action, method: 'GET', silent: true }, p)).then(function (r) { return arr(r.data); }); }

        function napHe() { return ums.ref.heDaoTao({ pageIndex: 1, pageSize: 1000000 }).then(function (d) { pat.fill(f('he'), d, { name: 'TENHEDAOTAO' }); }).catch(fail); }
        function napKhoa() { return goi('DKH_PhanCong_LopHP/LayDSKhoaToChuc', { strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_ThoiGianDaoTao_Id: v('tg') }).then(function (d) { pat.fill(f('khoa'), d, { name: 'TENKHOA' }); }).catch(fail); }
        function napCT() {
            return goi('DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc', { strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_KhoaDaoTao_Id: v('khoa'),
                strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_KhoaQuanLy_Id: v('kql') }).then(function (d) { pat.fill(f('ct'), d, { name: 'TENCHUONGTRINH' }); }).catch(fail);
        }
        function napHP() {
            return goi('DKH_PhanCong_LopHP/LayDSHocPhan', { strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_KhoaDaoTao_Id: v('khoa'), strDaoTao_HeDaoTao_Id: v('he'),
                strDaoTao_ChuongTrinh_Id: v('ct'), strDaoTao_KhoaQuanLy_Id: v('kql') })
                .then(function (d) { pat.fill(f('hp'), d, { name: function (r) { return e(r.TEN) + ' - ' + e(r.MA); } }); }).catch(fail);
        }
        function napKH() {
            return goi('DKH_ThongTin/LayDSDangKy_KeHoachDangKy', { strTuKhoa: '', strDaoTao_ThoiGianDaoTao_Id: v('tg'), strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 10000 })
                .then(function (d) { pat.fill(f('kh'), d, { name: 'TENKEHOACH' }); }).catch(fail);
        }
        goi('DKH_Chung/LayThoiGianDangKyHoc', { strNguoiThucHien_Id: uid() }).then(function (d) { pat.fill(f('tg'), d, { name: 'DAOTAO_THOIGIANDAOTAO' }); }).catch(fail);
        napHe(); napKhoa(); napCT(); napHP(); napKH();
        ums.ref.khoaQuanLy().then(function (d) { pat.fill(f('kql'), d, { name: 'TEN' }); }).catch(fail);
        ums.api.dm('KHDT.DIEM.KIEUHOC').then(function (d) { pat.fill(f('kieu'), d, { name: 'TEN' }); }).catch(fail);

        if (window.jQuery) {
            var S = 'select2:select select2:unselect select2:clear';
            jQuery(f('tg')).on(S, function () { napHe(); napKH(); napHP(); });
            jQuery(f('he')).on(S, function () { napKhoa(); napCT(); napHP(); });
            jQuery(f('khoa')).on(S, function () { napCT(); napHP(); });
            jQuery(f('ct')).on(S, function () { napHP(); });
            jQuery(f('kql')).on(S, function () { napCT(); napHP(); });
            jQuery(f('loai')).on('select2:select select2:clear', function () { ve(); });
        }
        ums.pat.chain([f('tg'), f('kh')], { phatLai: false });

        function so(k) { var s = (f(k).value || '').trim(); return s ? parseInt(s, 10) : -1; }
        function tim(p) {
            if (p) page = p;
            f('loi').hidden = true;
            f('tbl').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            var chuaNop = f('chuaNop').checked, daKT = f('daKT').checked;
            ums.api.call({
                action: 'DKH_ThongTin2_MH/DSA4BRIFIC8mCjgJLiIP', func: 'pkg_dangkyhoc_thongtin2.LayDSDangKyHoc', method: 'POST', silent: true,
                strTuKhoa: (f('q').value || '').trim(), strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_HocPhan_Id: v('hp'), strNguoiThucHien_Id: uid(),
                pageIndex: page, pageSize: size, strTKB_HinhThucHoc_Id: '', strHanhDong_XacNhan_Id: '', strDangKy_KeHoachDangKy_Id: v('kh'),
                strDaoTao_KhoaDaoTao_Id: v('khoa'), strDaoTao_ChuongTrinh_Id: v('ct'), strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_KhoaQuanLy_Id: v('kql'),
                dSoDaDangTuSo: so('tu'), dSoDaDangDenSo: so('den'), strKieuHoc_Id: v('kieu'), dChiLayCacLopChuaPhanCong: 0
            }).then(function (r) {
                var d = arr(r.data);
                total = r.pager !== null && r.pager !== undefined && r.pager !== '' ? parseInt(r.pager, 10) : d.length;
                if (chuaNop || daKT) {
                    d = d.filter(function (x) {
                        if (chuaNop && (parseFloat(x.SOTIENDANOP !== null && x.SOTIENDANOP !== undefined ? x.SOTIENDANOP : x.TONGSOTIENDANOP) || 0) !== 0) return false;
                        if (daKT && (!x.DACHUYENKETOAN || parseInt(x.DACHUYENKETOAN, 10) === 0)) return false;
                        return true;
                    });
                }
                trang = d; ve();
                if (total > 0 && !d.length) {
                    f('loi').hidden = false;
                    f('loi').innerHTML = ui.fail('Server báo có ' + total + ' bản ghi khớp nhưng không trả về dữ liệu. Dữ liệu có thể quá lớn — hãy thu hẹp bộ lọc (học kỳ, học phần, khoa quản lý...) hoặc chọn page size nhỏ hơn.');
                }
            }).catch(function (err) { f('tbl').innerHTML = ui.fail(err.message); fail(err); });
        }
        function loaiLop(ds) {
            var k = f('loai').value;
            if (!k) return ds;
            return ds.filter(function (r) {
                var rieng = !!(r.HOCPHITINHRIENG || (r.LOPRIENG && String(r.LOPRIENG).trim() !== ''));
                return k === 'rieng' ? rieng : !rieng;
            });
        }
        var hien = [];
        function ve() {
            hien = loaiLop(trang);
            f('n').textContent = '(' + total + ')';
            ui.table({
                el: f('tbl'), rows: hien, empty: 'Không có dữ liệu',
                page: { index: page, size: size, total: total, onChange: function (p) { if (p >= 1 && p <= Math.ceil(total / size)) tim(p); },
                        onSize: function (n) { size = n; tim(1); } },
                columns: [
                    { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-center is-nowrap' },
                    { title: 'Họ đệm', prop: 'QLSV_NGUOIHOC_HODEM' },
                    { title: 'Tên', prop: 'QLSV_NGUOIHOC_TEN' },
                    { title: 'Chương trình', prop: 'DAOTAO_TOCHUCCHUONGTRINH_TEN' },
                    { title: 'Khoa quản lý', prop: 'DAOTAO_KHOAQUANLY_TEN' },
                    { title: 'Loại lớp', prop: 'LOPRIENG' },
                    { title: 'Mã lớp HP', prop: 'DANGKY_LOPHOCPHAN_MA', cls: 'is-nowrap' },
                    { title: 'Tên lớp HP', prop: 'DANGKY_LOPHOCPHAN_TEN' },
                    { title: 'Học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                    { title: 'Số tín', prop: 'SOTINCHI', cls: 'is-center' },
                    { title: 'Kiểu học', prop: 'KIEUHOC_TEN' },
                    { head: '<input type="checkbox" data-dk="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                      render: function (r, i) { return '<input type="checkbox" data-dk="' + i + '"' + (chon[r.ID] ? ' checked' : '') + '>'; } }
                ]
            });
            dem();
        }
        function dem() { f('sel').textContent = 'Đã chọn: ' + Object.keys(chon).length; }
        f('tbl').addEventListener('change', function (ev) {
            var t = ev.target, k = t.getAttribute && t.getAttribute('data-dk');
            if (k === null || k === undefined) return;
            if (k === 'all') {
                hien.forEach(function (r, i) {
                    if (t.checked) chon[r.ID] = r; else delete chon[r.ID];
                    var c = f('tbl').querySelector('input[data-dk="' + i + '"]'); if (c) c.checked = t.checked;
                });
            } else { var r = hien[Number(k)]; if (t.checked) chon[r.ID] = r; else delete chon[r.ID]; }
            dem();
        });
        B.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b) return;
            if (b.getAttribute('data-a') === 'search') tim(1);
            else if (b.getAttribute('data-a') === 'xoaloc') {
                ['tg', 'he', 'khoa', 'kql', 'ct', 'hp', 'kh', 'kieu', 'loai'].forEach(function (k) {
                    var el = f(k); if (el.multiple) Array.prototype.forEach.call(el.options, function (x) { x.selected = false; }); else el.value = '';
                    if (window.jQuery) jQuery(el).trigger('change');
                });
                ['tu', 'den', 'q'].forEach(function (k) { f(k).value = ''; });
                f('chuaNop').checked = false; f('daKT').checked = false;
                napHe(); napKhoa(); napCT(); napHP(); napKH();
            }
        });
        ['tu', 'den', 'q'].forEach(function (k) { f(k).addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim(1); } }); });
        f('tbl').innerHTML = ui.empty('Chọn điều kiện rồi bấm Tìm kiếm', 'fa-filter');
        return dlg;
    };
})();
