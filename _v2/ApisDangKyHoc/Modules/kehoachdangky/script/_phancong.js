/* =========================================================================
   Khung chung — các màn PHÂN CÔNG của phân hệ Đăng ký học
   ---------------------------------------------------------------------------
   Dùng ở:
     · kehoachdangky/phanconglop        (boPhamVi + luoi)
     · kehoachdangky/phancongphamvi     (phamViMan — bản đăng ký học)
     · nguyenvongdangky/phancongphamvi  (phamViMan — bản nguyện vọng; nạp chéo
                                         ../../kehoachdangky/script/_phancong.js)
   Hai bản phancongphamvi gốc chép nhau (git diff -w: 10 thêm / 237 bớt): cùng
   bố cục, khác controller (DKH_PhanCong_PhamVi ↔ DKH_NguyenVong_PhamVi), tên
   tham số kế hoạch (strDangKy_KeHoachDangKy_Id ↔ strKeHoachNguyenVong_Id) và
   bản nguyện vọng KHÔNG có: Sĩ số, Ngày bắt đầu tính mốc rút học phần, nút
   "Thêm Khoa quản lý - khóa học", "Tạo dữ liệu thời khóa biểu…", "Tính toán
   dữ liệu phục vụ đăng ký học". Khác nhau khai trong cfg của phamViMan.

   ums.dkhPC.boPhamVi(host, { dinhHuong, kqlKhoa })
       Khối "Thông tin phạm vi": mỗi dòng một ô chọn + nút "Thêm" (addPhamVi của
       gốc) — Khoa quản lý · Hệ · Khóa · Chương trình · [Định hướng · Nhóm định
       hướng] · Lớp · Người học · [Thêm Khoa quản lý - khóa học] · "Phạm vi đã
       chọn". nhanTren: nhãn nằm trên ô (cột hẹp — phanconglop 4 | 8).
       → { ds() [{ id, name }], xoaDs(), reset(), ready }
       Lời gọi (chép nguyên, edu.system.getList_* của Corei = ums.ref.*):
         pkg_kehoach_thongtin.LayDSKhoaQuanLy / LayDSDaoTao_HeDaoTao /
         LayDSKS_DaoTao_KhoaDaoTao (strHeDaoTao_Id) / LayDSKS_DaoTao_ToChucCT
         (CHỈ strKhoaDaoTao_Id như gốc) / LayDSKS_DaoTao_LopQuanLy (Hệ, Khóa, CT)
         SV_HoSo/LayDanhSach GET (Hệ, Khóa, CT, Lớp, pageSize 10000) — MASO - HODEM TEN
         pkg_kehoach_thongtin.LayDSDaoTao_CT_DinhHuong · pkg_kehoach_thongtin2.LayDSDaoTao_CT_DH_Nhom
       Bản gốc dùng edu.system.getList_* (KHÔNG lọc quyền) → giữ ums.ref.* (không
       đổi sang bản …Quyen, vì gốc không dùng genBoLoc_HeKhoa cho khối này).
       Khác gốc:
         · Nối tầng CHẶT Hệ → Khóa → Chương trình → Lớp → Người học và
           Chương trình → Định hướng → Nhóm định hướng (ums.pat.chain, luật
           người dùng 2026-09-21). Gốc nạp sẵn mọi Khóa, và chọn Khóa là nạp Lớp
           (không cần Chương trình) — nay muốn thêm phạm vi Lớp phải chọn Chương
           trình trước.
         · "Thêm Khoa quản lý - khóa học" không thêm trùng (gốc thêm được hai lần).
           Id phạm vi vẫn là GHÉP chuỗi id khoa quản lý + id khóa như gốc.

   ums.dkhPC.luoi(host, { phanCap, rows, chon(row), ten(row, pc), cot3: { title, render(row, pc) } })
       Danh sách phân công: mỗi phân cấp (danh mục DANGKY.PHANCAP) có dữ liệu
       là một bảng nhỏ (gốc: các <table> rộng 300px thả trôi trái). Ô đánh dấu
       mang data-pc (KHÔNG data-ck), ô đầu bảng "chọn tất cả" của bảng đó.

   ums.dkhPC.phamViMan(root, cfg) — xem chú thích tại hàm.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat;
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === undefined || v === null ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : ((d && d.rs) || []); }
    function jq(el) { return window.jQuery ? jQuery(el) : null; }

    var dkhPC = {};
    dkhPC.e = e;
    dkhPC.arr = arr;

    /* Danh sách kế hoạch cho ô "Chọn kế hoạch" — getList_KeHoachDangKy của gốc.
       strTuKhoa đọc ô txtSearch_TuKhoa không có trên các màn này → ''. */
    dkhPC.keHoach = function (action) {
        return ums.api.call({ action: action, method: 'GET', silent: true,
            strTuKhoa: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000 })
            .then(function (r) { return arr(r.data); });
    };
    dkhPC.phanCap = function () { return ums.api.dm('DANGKY.PHANCAP'); };

    /* Lấy chữ đang hiện của ô chọn (gốc: $("#x option:selected").text()) */
    function chu(sel) {
        var o = sel.options[sel.selectedIndex];
        return o ? o.text : '';
    }

    /* ---------------------------------------------------------------------
       Khối "Thông tin phạm vi"
       --------------------------------------------------------------------- */
    dkhPC.boPhamVi = function (host, o) {
        o = o || {};
        var DONG = [['kql', 'Khoa quản lý', 'Chọn khoa quản lý'], ['he', 'Hệ', 'Chọn hệ đào tạo'],
            ['khoa', 'Khóa', 'Chọn khóa đào tạo'], ['ct', 'Chương trình', 'Chọn chương trình đào tạo']];
        if (o.dinhHuong) DONG.push(['dh', 'Định hướng', 'Chọn định hướng'], ['ndh', 'Nhóm định hướng', 'Chọn nhóm định hướng']);
        DONG.push(['lop', 'Lớp', 'Chọn lớp'], ['hv', 'Người học', 'Chọn người học']);

        var ds = [];
        host.innerHTML =
            '<div class="ums-legend">Thông tin phạm vi</div>' +
            DONG.map(function (d) {
                return ui.field(d[1],
                    '<div class="dkhpc-pv"><div class="dkhpc-pv__sel"><select class="ums-select" data-pv="' + d[0] + '" data-ph="' + esc(d[2]) + '">' +
                    '<option value="">' + esc(d[2]) + '</option></select></div>' +
                    ui.btn('add', { text: 'Thêm', mod: 'out-success', attr: { 'data-pvadd': d[0], title: 'Thêm phạm vi và phân công' } }) +
                    '</div>', o.nhanTren ? {} : { inline: true, labelWidth: '130px' });
            }).join('') +
            (o.kqlKhoa ? '<div class="ums-row ums-row--end ums-u-mb-4">' +
                ui.btn('add', { text: 'Thêm Khoa quản lý - khóa học', mod: 'out-success',
                    attr: { 'data-pvadd': 'kqlkhoa', title: 'Thêm Khoa quản lý - khóa học' } }) + '</div>' : '') +
            '<div class="dkhpc-pvchon"><b>Phạm vi đã chọn:</b> <span data-pv="chon"></span></div>';
        ui.enhance(host);

        function s(k) { return host.querySelector('select[data-pv="' + k + '"]'); }
        function v(k) { var x = s(k); return x ? x.value : ''; }
        function ve() {
            host.querySelector('[data-pv="chon"]').textContent = ds.map(function (x) { return x.name; }).join(', ');
        }
        function hong(err, where) { ums.api.handle(err, where); }

        /* Ô con: cha trống thì đổ rỗng (ô đã bị khoá), không gọi máy chủ */
        function nap(k, cha, p, name, head) {
            var el = s(k);
            if (!el) return Promise.resolve();
            if (cha !== null && !cha) { pat.fill(el, [], { head: head }); return Promise.resolve(); }
            return p().then(function (rows) { pat.fill(el, rows, { name: name, head: head }); })
                .catch(function (err) { pat.fill(el, [], { head: head }); hong(err, 'nạp ' + head.toLowerCase()); });
        }
        function napKhoa() {
            return nap('khoa', v('he'), function () {
                return ums.ref.khoaDaoTao({ strHeDaoTao_Id: v('he'), strCoSoDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 });
            }, 'TENKHOA', 'Chọn khóa đào tạo');
        }
        function napCT() {
            return nap('ct', v('khoa'), function () {
                return ums.ref.chuongTrinh({ strKhoaDaoTao_Id: v('khoa'), strN_CN_LOP_Id: '', strKhoaQuanLy_Id: '',
                    strToChucCT_Cha_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 });
            }, 'TENCHUONGTRINH', 'Chọn chương trình đào tạo');
        }
        function napLop() {
            return nap('lop', v('ct'), function () {
                return ums.ref.lopQuanLy({ strCoSoDaoTao_Id: '', strDaoTao_HeDaoTao_Id: v('he'), strKhoaDaoTao_Id: v('khoa'),
                    strNganh_Id: '', strLoaiLop_Id: '', strToChucCT_Id: v('ct'), strNguoiThucHien_Id: '', strTuKhoa: '',
                    pageIndex: 1, pageSize: 1000000 });
            }, 'TEN', 'Chọn lớp');
        }
        function napHV() {
            return nap('hv', v('lop'), function () {
                return ums.api.call({ action: 'SV_HoSo/LayDanhSach', method: 'GET', silent: true,
                    strTuKhoa: '', strHeDaoTao_Id: v('he'), strKhoaDaoTao_Id: v('khoa'), strChuongTrinh_Id: v('ct'),
                    strLopQuanLy_Id: v('lop'), strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 10000 })
                    .then(function (r) { return arr(r.data); });
            }, function (r) { return e(r.MASO) + ' - ' + e(r.HODEM) + ' ' + e(r.TEN); }, 'Chọn người học');
        }
        function napDH() {
            return nap('dh', v('ct'), function () {
                return ums.api.call({ action: 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eAhUeBSgvKQk0Li8m',
                    func: 'pkg_kehoach_thongtin.LayDSDaoTao_CT_DinhHuong', silent: true,
                    strTuKhoa: '', strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_KhoaDaoTao_Id: v('khoa'),
                    strDaoTao_ChuongTrinh_Id: v('ct'), strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000 })
                    .then(function (r) { return arr(r.data); });
            }, 'TEN', 'Chọn định hướng');
        }
        function napNDH() {
            return nap('ndh', v('dh'), function () {
                return ums.api.call({ action: 'KHCT_ThongTin2_MH/DSA4BRIFIC4VIC4eAhUeBQkeDykuLAPP',
                    func: 'pkg_kehoach_thongtin2.LayDSDaoTao_CT_DH_Nhom', silent: true,
                    strDaoTao_ChuongTrinh_Id: v('ct'), strDaoTao_CT_DinhHuong_Id: v('dh'), strNguoiThucHien_Id: '' })
                    .then(function (r) { return arr(r.data); });
            }, 'TEN', 'Chọn nhóm định hướng');
        }

        function on(k, fn) {
            var el = s(k);
            if (el && jq(el)) jq(el).on('select2:select select2:clear', fn);
        }
        on('he', function () { napKhoa(); napCT(); napLop(); napHV(); });
        on('khoa', function () { napCT(); napLop(); napHV(); });
        on('ct', function () { napLop(); napHV(); if (o.dinhHuong) { napDH(); napNDH(); } });
        on('dh', function () { napNDH(); });
        on('lop', function () { napHV(); });
        // Chưa chọn cha thì khoá con; đổi / xoá cha thì xoá trắng con (trình xử lý trên đã nghe lúc xoá)
        var chains = [pat.chain([s('he'), s('khoa'), s('ct'), s('lop'), s('hv')], { phatLai: false })];
        if (o.dinhHuong) chains.push(pat.chain([s('ct'), s('dh'), s('ndh')], { phatLai: false }));

        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-pvadd]');
            if (!b || !host.contains(b)) return;
            var k = b.getAttribute('data-pvadd');
            var id, name;
            if (k === 'kqlkhoa') {
                // Gốc: id = id khoa quản lý + id khóa (ghép chuỗi), tên "KQL - Khóa"
                if (!v('kql') || !v('khoa')) return;
                id = v('kql') + v('khoa');
                name = chu(s('kql')) + ' - ' + chu(s('khoa'));
            } else {
                id = v(k);
                if (!id) return;
                name = chu(s(k));
            }
            if (ds.some(function (x) { return x.id === id; })) return;
            ds.push({ id: id, name: name });
            ve();
        });

        var ready = Promise.all([
            ums.ref.khoaQuanLy().then(function (r) { pat.fill(s('kql'), r, { name: 'TEN', head: 'Chọn khoa quản lý' }); }),
            ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
                .then(function (r) { pat.fill(s('he'), r, { name: 'TENHEDAOTAO', head: 'Chọn hệ đào tạo' }); })
        ]).catch(function (err) { hong(err, 'nạp danh mục đào tạo'); });

        return {
            ready: ready,
            ds: function () { return ds.slice(); },
            /* Chỉ xoá danh sách "Phạm vi đã chọn" (phanconglop: lưu xong gốc làm vậy) */
            xoaDs: function () { ds = []; ve(); },
            /* rewrite() của gốc: xoá danh sách phạm vi và trả mọi ô về trống */
            reset: function () {
                ds = [];
                ve();
                DONG.forEach(function (d) {
                    var el = s(d[0]);
                    if (!el) return;
                    el.value = '';
                    if (jq(el)) jq(el).trigger('change.select2');
                });
                chains.forEach(function (c) { c.sync(); });
            }
        };
    };

    /* ---------------------------------------------------------------------
       Danh sách phân công theo phân cấp
       --------------------------------------------------------------------- */
    dkhPC.luoi = function (host, o) {
        var nhom = [];
        (o.phanCap || []).forEach(function (pc) {
            var rs = (o.rows || []).filter(function (r) { return r.PHANCAPAPDUNG_ID === pc.ID; });
            if (rs.length) nhom.push({ pc: pc, rows: rs });
        });
        if (!host.__dkhpcAll) {
            host.__dkhpcAll = true;
            host.addEventListener('change', function (ev) {
                var t = ev.target;
                if (!t.hasAttribute('data-pcall')) return;
                var bang = t.closest('table');
                Array.prototype.forEach.call(bang.querySelectorAll('tbody input[data-pc]'), function (c) { c.checked = t.checked; });
            });
        }
        if (!nhom.length) { host.innerHTML = ui.empty(o.empty || 'Chưa có phân công'); return; }
        host.innerHTML = '<div class="dkhpc-luoi">' + nhom.map(function (g, i) {
            return '<div class="dkhpc-luoi__o" data-g="' + i + '"></div>';
        }).join('') + '</div>';
        nhom.forEach(function (g, i) {
            ui.table({
                el: host.querySelector('[data-g="' + i + '"]'), rows: g.rows, stt: false,
                columns: [
                    { head: '<input type="checkbox" data-pcall title="Chọn tất cả">', cls: 'is-center', width: '44px',
                      render: function (r) { return '<input type="checkbox" data-pc="' + esc(o.chon(r)) + '">'; } },
                    { title: e(g.pc.TEN), render: function (r) { return o.ten(r, g.pc); } },
                    { title: o.cot3.title, cls: 'is-center', width: '104px', render: function (r) { return o.cot3.render(r, g.pc); } }
                ]
            });
        });
    };
    /** Giá trị các ô đã đánh dấu trong danh sách phân công (getArrCheckedIds "zonePhanCong") */
    dkhPC.chon = function (host) {
        return Array.prototype.map.call(host.querySelectorAll('tbody input[data-pc]:checked'), function (c) {
            return c.getAttribute('data-pc');
        });
    };

    /* ---------------------------------------------------------------------
       Nhóm ô "Thời gian" — ngày/giờ/phút bắt đầu, kết thúc, số tín, sĩ số
       --------------------------------------------------------------------- */
    function o1(k, ph) { return '<input class="ums-input" data-t="' + k + '" autocomplete="off"' + (ph ? ' placeholder="' + esc(ph) + '"' : '') + '>'; }
    dkhPC.thoiGianHtml = function (o) {
        o = o || {};
        function ngay(nhan, k) {
            return '<div class="dkhpc-time">' +
                ui.field(nhan, '<input class="ums-input" data-t="' + k + '" data-date placeholder="dd/mm/yyyy" autocomplete="off">') +
                ui.field('Giờ', o1(k + 'Gio', 'hh')) + ui.field('Phút', o1(k + 'Phut', 'mm')) + '</div>';
        }
        function hai(n1, k1, n2, k2) {
            return '<div class="ums-grid ums-grid--2 dkhpc-hai">' + ui.field(n1, o1(k1)) + ui.field(n2, o1(k2)) + '</div>';
        }
        return '<div class="ums-legend">Thời gian</div>' +
            ngay('Ngày bắt đầu', 'bd') + ngay('Ngày kết thúc', 'kt') +
            hai('Số tín tối đa N1', 'max1', 'Số tín tối thiểu N1', 'min1') +
            hai('Số tín tối đa N2', 'max2', 'Số tín tối thiểu N2', 'min2') +
            (o.rutHP ? ui.field('Ngày bắt đầu tính mốc rút học phần',
                '<input class="ums-input" data-t="rut" data-date placeholder="dd/mm/yyyy" autocomplete="off">') : '') +
            (o.siSo ? hai('Sĩ số tối đa', 'ssMax', 'Sĩ số tối thiểu', 'ssMin') : '');
    };
    /** Đọc / đặt nhóm ô thời gian trong một vùng */
    dkhPC.tg = function (vung) {
        function el(k) { return vung.querySelector('[data-t="' + k + '"]'); }
        return {
            v: function (k) { var x = el(k); return x ? x.value.trim() : ''; },
            set: function (k, val) {
                var x = el(k);
                if (!x) return;
                if (x._flatpickr) x._flatpickr.setDate(e(val) || null, false, 'd/m/Y');
                x.value = e(val);
            },
            clear: function () {
                Array.prototype.forEach.call(vung.querySelectorAll('[data-t]'), function (x) {
                    if (x._flatpickr) x._flatpickr.clear();
                    x.value = '';
                });
            }
        };
    };

    /* =====================================================================
       Màn "Phân công phạm vi" — kehoachdangky / nguyenvongdangky
       ---------------------------------------------------------------------
       cfg = {
         tieuDe, keHoachAction,
         list    action danh sách phân công (GET)
         them    action thêm (gốc: 'Thêm mới' → một lời gọi mỗi phạm vi)
         sua     action sửa (hộp "Chi tiết" của gốc)
         xoa     action xoá (strIds = ID dòng, mỗi dòng một lời gọi)
         nguoiHoc action danh sách người học của một phạm vi (GET, phân trang máy chủ)
         khKey   tên tham số kế hoạch khi THÊM/SỬA
         rutHP, siSo, kqlKhoa, tinhToan   bật phần chỉ bản đăng ký học có
       }
       Bố cục gốc (một cột, hai vùng thay nhau): thanh lọc Kế hoạch + Tìm kiếm ·
       khung "Danh sách phân công" (Xóa · [Tạo dữ liệu thời khóa biểu theo lớp
       học phần · Tính toán dữ liệu phục vụ đăng ký học] · Thêm mới) · biểu mẫu
       "Thêm mới - Phân công" hai cột (Thông tin phạm vi | Thời gian).
       Bấm tên phạm vi → gốc mở modal hai cột (thời gian | danh sách người học,
       tiêu đề chép nhầm "Danh sách học phần"); ở đây là biểu mẫu SỬA thay chỗ
       danh sách (BO-CUC luật 1), vẫn hai cột.
       ===================================================================== */
    dkhPC.phamViMan = function (root, cfg) {
        var phanCap = [], dsPC = [], keHoach = [];
        var dangSua = null, trangNH = { index: 1, size: 10 };

        root.innerHTML =
            pat.page(cfg.tieuDe, ui.btn('add', { attr: { 'data-a': 'add' } })) +
            '<div data-z="list">' +
                pat.panel({ title: false, cls: 'ums-u-mb-4', body:
                    '<div class="ums-filter">' +
                        '<div class="ums-field dkhpc-kh"><select class="ums-select" data-f="kh" data-ph="Chọn kế hoạch"><option value="">Chọn kế hoạch</option></select></div>' +
                        '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
                    '</div>' }) +
                pat.panel({ title: 'Danh sách phân công', icon: 'fa-clipboard-list-check', zone: 'luoi',
                    tools: ui.xoaChon('input[data-pc]', { goc: '.ums-panel', attr: { 'data-a': 'xoa' } }) +
                        (cfg.tinhToan ?
                            ui.btn('add', { text: 'Tạo dữ liệu thời khóa biểu theo lớp học phần', mod: 'out-primary', icon: 'fa-calendar-plus', attr: { 'data-a': 'lichtuan' } }) +
                            ui.btn('add', { text: 'Tính toán dữ liệu phục vụ đăng ký học', mod: 'primary', icon: 'fa-calculator', attr: { 'data-a': 'tinhtoan' } }) : '') }) +
            '</div>' +
            '<div data-z="form" hidden>' +
                pat.panel({ title: 'Thêm mới - Phân công', icon: 'fa-plus', tools: ui.btn('close', { attr: { 'data-a': 'dong' } }),
                    body: '<div class="dkhpc-cols"><div data-z="pv"></div><div data-z="tgThem">' + dkhPC.thoiGianHtml({ siSo: cfg.siSo }) + '</div></div>',
                    foot: '<div class="ums-u-flex1"></div>' + ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                        ui.btn('save', { text: 'Phân công cho phạm vi', icon: 'fa-sitemap', attr: { 'data-a': 'luuThem' } }) }) +
            '</div>' +
            '<div data-z="edit" hidden>' +
                pat.panel({ title: 'Phân công', icon: 'fa-pen-to-square', count: 'tenPV', tools: ui.btn('close', { attr: { 'data-a': 'dong' } }),
                    body: '<div class="dkhpc-cols"><div data-z="tgSua">' + dkhPC.thoiGianHtml({ rutHP: cfg.rutHP, siSo: cfg.siSo }) + '</div>' +
                        '<div><div class="ums-legend">Danh sách</div><div data-z="nh"></div></div></div>',
                    foot: '<div class="ums-u-flex1"></div>' + ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                        ui.btn('save', { attr: { 'data-a': 'luuSua' } }) }) +
            '</div>';
        ui.enhance(root);

        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
        function kh() { return root.querySelector('[data-f="kh"]').value; }
        var btnAdd = root.querySelector('[data-a="add"]');
        var pv = dkhPC.boPhamVi(z('pv'), { kqlKhoa: cfg.kqlKhoa });
        var tgThem = dkhPC.tg(z('tgThem')), tgSua = dkhPC.tg(z('tgSua'));

        function vung(k) {
            var hien = ['list', 'form', 'edit'].filter(function (x) { return !z(x).hidden; })[0];
            if (hien === k) return;
            btnAdd.hidden = k !== 'list';
            ui.swap(z(hien), z(k));
        }

        /* ---------- Danh sách ---------- */
        function taiDS() {
            z('luoi').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return ums.api.call({ action: cfg.list, method: 'GET',
                strDangKy_KeHoachDangKy_Id: kh(), strPhanCapApDung_Id: '', strPhamViApDung_Id: '',
                strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 })
                .then(function (r) {
                    dsPC = arr(r.data);
                    dkhPC.luoi(z('luoi'), {
                        phanCap: phanCap, rows: dsPC, empty: kh() ? 'Kế hoạch chưa có phân công' : 'Chọn kế hoạch để xem phân công',
                        chon: function (row) { return row.ID; },
                        ten: function (row, pc) {
                            return '<button type="button" class="ums-link dkhpc-ten" data-sua="' + esc(row.PHAMVIAPDUNG_ID) +
                                '" data-pcid="' + esc(pc.ID) + '" title="Chi tiết">' + esc(row.PHAMVIAPDUNG_TEN) + '</button>';
                        },
                        cot3: { title: 'Số lượng', render: function (row) { return esc(e(row.SOLUONG)); } }
                    });
                })
                .catch(function (err) { z('luoi').innerHTML = ui.fail(err.message); ums.api.handle(err, 'tải danh sách phân công'); });
        }

        /* ---------- Thêm mới ---------- */
        function moThem() {
            if (!kh()) { ui.toast('Bạn cần chọn kế hoạch trước!', 'warn'); return; }
            pv.reset();
            tgThem.clear();
            vung('form');
        }
        function thamSoTG(t) {
            return {
                strNgayBatDau: t.v('bd'), strNgayKetThuc: t.v('kt'),
                dSoTinChiToiDa: t.v('max1'), dSoTinChiToiThieu: t.v('min1'),
                dSoTinChiToiDaN2: t.v('max2'), dSoTinChiToiThieuN2: t.v('min2'),
                dGioDangKyTrongNgayDau: t.v('bdGio'), dGioKetThucTrongNgayCuoi: t.v('ktGio'),
                dPhutDangKyTrongNgayDau: t.v('bdPhut'), dPhutKetThucTrongNgayCuoi: t.v('ktPhut')
            };
        }
        function luuThem() {
            var ds = pv.ds();
            if (!ds.length) { ui.toast('Vui lòng chọn đối tượng cần lưu?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn lưu ' + ds.length + ' dữ liệu không?', { title: 'Phân công cho phạm vi', ok: 'Lưu' }).then(function (yes) {
                if (!yes) return;
                var t = thamSoTG(tgThem);
                var calls = ds.map(function (x) {
                    var c = { action: cfg.them, strId: '' };
                    c[cfg.khKey] = kh();
                    c.strPhamViApDung_Id = x.id;
                    c.strDangKy_LopHocPhan_Id = '';
                    c.strNguoiThucHien_Id = '';
                    Object.keys(t).forEach(function (k) { c[k] = t[k]; });
                    // Ô "Ngày bắt đầu tính mốc rút học phần" không có trên biểu mẫu thêm — gốc đã xoá trắng ở rewrite()
                    if (cfg.rutHP) c.strNgayBatDauTinhRutHocPhan = '';
                    if (cfg.siSo) { c.dSiSoToiDa = tgThem.v('ssMax'); c.dSiSoToiThieu = tgThem.v('ssMin'); }
                    return c;
                });
                ui.batch(calls, { title: 'Đang phân công', okText: 'Thêm mới thành công!' }).then(function (r) {
                    if (r.ok) { vung('list'); taiDS(); }
                });
            });
        }

        /* ---------- Sửa (hộp "Chi tiết" của gốc) ---------- */
        function taiNH(p) {
            if (p) trangNH.index = p;
            var host = z('nh');
            host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            ums.api.call({ action: cfg.nguoiHoc, method: 'GET',
                strTuKhoa: '', strDangKy_KeHoachDangKy_Id: kh(), strDangKy_LopHocPhan_Id: '',
                strPhanCapApDung_Id: dangSua.pc, strPhamViApDung_Id: dangSua.pv, strNguoiThucHien_Id: '',
                pageIndex: trangNH.index, pageSize: trangNH.size })
                .then(function (r) {
                    var rows = arr(r.data);
                    ui.table({ el: host, rows: rows, empty: 'Không có người học',
                        columns: [
                            { title: 'Họ tên', render: function (x) { return esc(e(x.HODEM) + ' ' + e(x.TEN)); } },
                            { title: 'Mã số', prop: 'MASO', cls: 'is-nowrap' }
                        ],
                        page: { index: trangNH.index, size: trangNH.size, total: Number(r.pager) || rows.length,
                            onChange: taiNH, onSize: function (n) { trangNH.size = n; taiNH(1); } } });
                })
                .catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'tải danh sách người học'); });
        }
        function moSua(pvId, pcId) {
            // Gốc: dtPhanCongPhamVi.find(PHAMVIAPDUNG_ID === id) — dòng ĐẦU TIÊN mang phạm vi đó
            var row = dsPC.filter(function (x) { return x.PHAMVIAPDUNG_ID === pvId; })[0] || {};
            dangSua = { pv: pvId, pc: pcId, row: row };
            root.querySelector('[data-z="tenPV"]').textContent = '— ' + e(row.PHAMVIAPDUNG_TEN);
            tgSua.clear();
            tgSua.set('bd', row.NGAYBATDAU); tgSua.set('bdGio', row.GIODANGKYTRONGNGAYDAU); tgSua.set('bdPhut', row.PHUTDANGKYTRONGNGAYDAU);
            tgSua.set('kt', row.NGAYKETTHUC); tgSua.set('ktGio', row.GIOKETTHUCTRONGNGAYCUOI); tgSua.set('ktPhut', row.PHUTKETTHUCTRONGNGAYCUOI);
            tgSua.set('max1', row.SOTINCHITOIDA); tgSua.set('min1', row.SOTINCHITOITHIEU);
            tgSua.set('max2', row.SOTINCHITOIDAN2); tgSua.set('min2', row.SOTINCHITOITHIEUN2);
            if (cfg.rutHP) tgSua.set('rut', row.NGAYBATDAUTINHRUTHOCPHAN);
            if (cfg.siSo) { tgSua.set('ssMax', row.SISOTOIDA); tgSua.set('ssMin', row.SISOTOITHIEU); }
            trangNH.index = 1;
            vung('edit');
            taiNH(1);
        }
        function luuSua() {
            var row = dangSua.row;
            var c = { action: cfg.sua, strId: e(row.ID) };
            c[cfg.khKey] = e(row.DANGKY_KEHOACHDANGKY_ID);
            c.strPhamViApDung_Id = dangSua.pv;
            c.strNguoiThucHien_Id = '';
            var t = thamSoTG(tgSua);
            Object.keys(t).forEach(function (k) { c[k] = t[k]; });
            if (cfg.rutHP) c.strNgayBatDauTinhRutHocPhan = tgSua.v('rut');
            if (cfg.siSo) { c.dSiSoToiDa = tgSua.v('ssMax'); c.dSiSoToiThieu = tgSua.v('ssMin'); }
            ums.api.call(c).then(function () {
                ui.toast('Cập nhật thành công!', 'ok');
                vung('list');
                taiDS();
            }).catch(function (err) { ums.api.handle(err, 'cập nhật phân công'); });
        }

        /* ---------- Xoá ---------- */
        function xoa() {
            var ids = dkhPC.chon(z('luoi'));
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn xóa ' + ids.length + ' dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                if (!yes) return;
                ui.batch(ids.map(function (id) { return { action: cfg.xoa, strIds: id, strNguoiThucHien_Id: '' }; }),
                    { title: 'Đang xoá', okText: 'Xóa thành công!' }).then(taiDS);
            });
        }

        /* ---------- Tính toán dữ liệu phục vụ đăng ký học (chỉ bản đăng ký học) ---------- */
        function tinhToan() {
            if (!kh()) { ui.toast('Bạn cần chọn kế hoạch trước!', 'warn'); return; }
            var ids = dkhPC.chon(z('luoi'));
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
            ui.confirm('Bắt đầu tính toán dữ liệu cho ' + ids.length + ' phạm vi đã chọn?', { title: 'Tính toán dữ liệu' }).then(function (yes) {
                if (!yes) return;
                var sv = [];
                var calls = ids.map(function (id) {
                    var a = dsPC.filter(function (x) { return x.ID == id; })[0] || {};
                    return function () {
                        return ums.api.call({ action: cfg.nguoiHoc, method: 'GET', silent: true,
                            strTuKhoa: '', strDangKy_KeHoachDangKy_Id: kh(), strDangKy_LopHocPhan_Id: '',
                            strPhanCapApDung_Id: e(a.PHANCAPAPDUNG_ID), strPhamViApDung_Id: e(a.PHAMVIAPDUNG_ID),
                            strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 })
                            .then(function (r) { sv = sv.concat(arr(r.data)); });
                    };
                });
                ui.batch(calls, { title: 'Đang lấy danh sách người học', toast: false, show: true }).then(function (r) {
                    if (r.fail) ui.toast(r.errors[0], 'bad');
                    var seen = {};
                    sv = sv.filter(function (x) {
                        var k = x.QLSV_NGUOIHOC_ID;
                        if (!k || seen[k]) return false;
                        seen[k] = true;
                        return true;
                    });
                    if (!sv.length) { ui.toast('Không có sinh viên nào trong phạm vi đã chọn!', 'warn'); return; }
                    ui.confirm('Bắt đầu tính toán dữ liệu cho ' + sv.length + ' sinh viên?', { title: 'Tính toán dữ liệu' }).then(function (ok) {
                        if (!ok) return;
                        var khId = kh();
                        ui.batch(sv.map(function (x) {
                            return { action: 'TS_DKH_Chung5_MH/FSAuBTQNKCQ0CS4iESkgLxUgLAPP',
                                func: 'PKG_DANGKYHOC_CHUNG5.TaoDuLieuTamTheoNguoiHoc',
                                strDangKy_KeHoachDangKy_Id: khId, strQLSV_NguoiHoc_Id: x.QLSV_NGUOIHOC_ID, strNguoiThucHien_Id: '' };
                        }), { title: 'Đang tính toán dữ liệu', concurrency: 4, toast: false }).then(function (k) {
                            ui.toast('Đã thực hiện xong!' + (k.fail ? ' (' + k.fail + ' người học lỗi)' : ''), k.fail ? 'warn' : 'ok');
                        });
                    });
                });
            });
        }
        function taoLichTuan() {
            if (!kh()) { ui.toast('Bạn cần chọn kế hoạch trước!', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn tạo dữ liệu thời khóa biểu theo lớp học phần?', { title: 'Tạo dữ liệu thời khóa biểu' }).then(function (yes) {
                if (!yes) return;
                ums.api.call({ action: 'TS_DKH_Chung5_MH/FSAuBTQNKCQ0DSgiKRU0IC8VICwP',
                    func: 'PKG_DANGKYHOC_CHUNG5.TaoDuLieuLichTuanTam',
                    strDangKy_KeHoachDangKy_Id: kh(), strNguoiThucHien_Id: '' })
                    .then(function () { ui.toast('Đã thực hiện xong!', 'ok'); })
                    .catch(function (err) { ums.api.handle(err, 'tạo dữ liệu thời khóa biểu'); });
            });
        }

        root.addEventListener('click', function (ev) {
            var t = ev.target.closest('[data-sua]');
            if (t && root.contains(t)) { moSua(t.getAttribute('data-sua'), t.getAttribute('data-pcid')); return; }
            var b = ev.target.closest('[data-a]');
            if (!b || !root.contains(b)) return;
            var a = b.getAttribute('data-a');
            if (a === 'search') taiDS();
            else if (a === 'add') moThem();
            else if (a === 'dong') vung('list');
            else if (a === 'luuThem') luuThem();
            else if (a === 'luuSua') luuSua();
            else if (a === 'xoa') xoa();
            else if (a === 'tinhtoan') tinhToan();
            else if (a === 'lichtuan') taoLichTuan();
        });
        if (jq(root.querySelector('[data-f="kh"]'))) jq(root.querySelector('[data-f="kh"]')).on('select2:select select2:clear', taiDS);

        dkhPC.keHoach(cfg.keHoachAction).then(function (rows) {
            keHoach = rows;
            pat.fill(root.querySelector('[data-f="kh"]'), keHoach, { name: 'TENKEHOACH', head: 'Chọn kế hoạch' });
        }).catch(function (err) { ums.api.handle(err, 'nạp kế hoạch'); });
        dkhPC.phanCap().then(function (rows) { phanCap = rows; taiDS(); })
            .catch(function (err) { ums.api.handle(err, 'nạp danh mục phân cấp'); });
    };

    ums.dkhPC = dkhPC;
})();
