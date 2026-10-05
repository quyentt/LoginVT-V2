/* =========================================================================
   ums.hbDk — khung chung của ba màn "ĐIỀU KIỆN ÁP DỤNG" (Học bổng / thiết lập)
   ---------------------------------------------------------------------------
   Dùng ở:
       thietlap/thamsochung    Tham số chung       (TN_XetDuyet_ThamSo, _Ad)
       thietlap/dieukienxet    Điều kiện xét        (HB_XetDuyet_DieuKien, _Ad)
       thietlap/xeploaihabac   Xếp loại hạ bậc      (TN_XepLoai_DieuKien, _Ad)
   Ba bản gốc chép cùng một khuôn (72–82% giống nhau từng dòng):
     · Dải hai tab "1) Điều kiện áp dụng chung" / "2) Điều kiện áp dụng riêng",
       mỗi tab thanh lọc (Phân loại | Quỹ học bổng, từ khoá; tab 2 thêm "Phân
       cấp áp dụng") + bảng + nút Thêm mới, cột cuối nút Sửa.
     · Biểu mẫu "Thêm mới - Điều kiện áp dụng" thay chỗ danh sách, HAI CỘT
       col-lg-4 "Thông tin đối tượng" | col-lg-8 "Thông tin áp dụng".
     · Tab 2: phân cấp áp dụng (MA của mục đang chọn ở ô lọc) quyết định ô
       phạm vi nào hiện ra; ô cuối của phân cấp là giá trị strPhamViApDung_Id:
           HEDAOTAO → Hệ          KHOAHOC → Hệ, Khoá        CHUONGTRINH → … CT
           LOPQUANLY → … Lớp      HSSV → … Lớp, Học viên
           KEHOACHXETTOTNGHIEP → Kế hoạch   KHOAQUANLY → Khoa quản lý
           MOHINHNIENCHE_TINCHI → Mô hình (danh mục KHCT.LOAILOP)
     · (dieukienxet, xeploaihabac) bảng "Danh sách từ khóa" dưới biểu mẫu:
       sửa Tên từ khoá / Mô tả ngay trong ô rồi "Lưu danh sách từ khóa".
   Không dùng lại ums.xlhvDk (XLHV): bảng từ khoá ở đó CHỈ XEM, đặt cạnh biểu
   mẫu, action khác. Không dùng ums.rlApDung: phạm vi ở đó là Khoá × thời
   gian cố định, ở đây là "phân cấp áp dụng" do máy chủ trả.

   Lời gọi chung (chép nguyên bản gốc):
     <ctl>/LayDanhSach   GET, phân trang máy chủ: strTuKhoa, <khoá phân loại>,
                         + tab 2: strPhamViApDung_Id = '' (gốc đọc
                         #dropSearch_PhamViApDung_AD — không có trên màn),
                         strPhanCapApDung_Id, strDaoTao_ThoiGianDaoTao_Id = ''
                         (#dropSearch_ThoiGian_AD — không có) + tham số riêng từng màn
     <ctl>/ThemMoi | CapNhat   POST strId + tham số riêng từng màn
     <ctl>/Xoa           POST strIds = id đang sửa
     <phanCap>           GET strPhanLoai_Id = ô lọc tab 2 (TN_ / HB_PhanCapApDung/LayDanhSach)
     Ô phạm vi: edu.system.getList_HeDaoTao / KhoaDaoTao / ChuongTrinhDaoTao /
       LopQuanLy / KhoaQuanLy → ums.ref.* (tham số như gốc); SV_HoSo/LayDanhSach
       GET (học viên theo Hệ/Khoá/CT/Lớp, pageSize 10000); kế hoạch: lời gọi
       riêng từng màn (cfg.keHoach); mô hình: danh mục KHCT.LOAILOP.
     <tuKhoa>/LayDanhSach GET (strTuKhoa/strPhanLoai_Id/strNguoiTao_Id = '' — gốc
       đọc #txtAAAA/#dropAAAA), <tuKhoa>/CapNhat POST strId, strTenTuKhoa, strMoTa.

   Khác gốc (chung cho cả ba màn):
     · Hệ → Khoá → CT → Lớp → Học viên KHOÁ theo luật cha → con (gốc nạp sẵn
       mọi khoá). Lớp nạp theo CT (gốc nạp cả khi chọn Khoá — nay Lớp khoá tới
       khi chọn CT). Phân loại (Quỹ) → Phân cấp ở tab 2 cũng vậy.
     · SỬA điều kiện riêng: gốc đặt MỌI ô phạm vi = PHAMVIAPDUNG_ID — chỉ đúng
       với ô đã nạp sẵn danh sách (Hệ, Khoá, Kế hoạch, Khoa, Mô hình); với CT /
       Lớp / Học viên ô trống nên Lưu gửi phạm vi RỖNG (xeploaihabac,
       thamsochung) hoặc gửi nhầm PHANCAPAPDUNG_ID (dieukienxet). Nay hiện
       "Phạm vi đang áp dụng" (chỉ xem) và giữ PHAMVIAPDUNG_ID của dòng nếu
       người dùng không chọn phạm vi mới.
     · Thêm điều kiện riêng mà chưa chọn phạm vi → nhắc chọn (gốc gửi rỗng).
     · Nút "Xóa" trong biểu mẫu: gốc có sẵn trình xử lý nhưng nút luôn
       display:none (không nơi nào hiện) — nay hiện khi SỬA.
     · Lưu xong quay về danh sách (ums.crud). Gốc ở lại biểu mẫu, không nhận id
       mới → bấm Lưu lần hai là THÊM TRÙNG.
     · Bảng từ khoá: chỉ gửi dòng đã đổi (như gốc), lưu xong nạp lại (gốc giữ
       giá trị cũ làm mốc so → bấm Lưu lần hai gửi lại cả những dòng vừa lưu).
     · Thêm mới điền sẵn Phân loại / Quỹ từ ô lọc của tab đang mở (gốc làm vậy
       ở thamsochung, xeploaihabac; dieukienxet đọc nhầm #dropPhanLoai).

   API
     ums.hbDk.man(root, {
         tieuDe, phanLoai: { key, col, nhan, loc, nguon },   nguon = { dm } | { call, id, name }
         cotChung: [cột ums.ui.table] (tab 2 tự thêm cột phạm vi ở đầu),
         trai: [trường crud thêm vào cột trái, sau Phân loại],
         phai: [trường crud cột phải; `multi: true` = ô chọn nhiều, gửi chuỗi "a,b"],
         chung: { ctl, ds: {tham số lọc thêm}, luu(v, row) → {tham số lưu thêm} },
         rieng: { ctl, ds, luu(v, row) },
         phanCap: 'X/LayDanhSach', keHoach: { call },
         tuKhoa: 'X_TuKhoa' | { ds, them, sua, size, trang } | null, toolbar: [{ text, icon, mod, onClick }],
         onForm(kieu, row, crud, host), onSaved(kieu, crud, id)       kieu = 'chung' | 'rieng'
     }) → { crud(kieu), ds (vùng danh sách), phu (vùng phụ, ẩn), moPhu(), dongPhu() }
     ums.hbDk.tuKhoa(host, ctl)       bảng từ khoá sửa trong ô (ctl chuỗi | đối tượng, xem tại hàm)
   Dùng thêm ở Tốt nghiệp (ApisTotNghiep/Modules/thietlap — nạp chéo tệp này):
     thamsochung nạp CHÍNH tệp Học bổng; dieukienxet, xeploaihabac là tệp cấu hình riêng.
     ums.hbDk.gt(crud)                giá trị biểu mẫu, ô chọn nhiều → "a,b"
   ========================================================================= */
(function () {
    'use strict';

    var ums = window.ums;
    if (ums.hbDk) return;
    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var D = ums.hbDk = {};

    function e(v) { return v === undefined || v === null ? '' : String(v); }
    function mang(s) { return s ? String(s).split(',') : []; }       // toArr của gốc
    function dong(r) { var d = r.data; return Array.isArray(d) ? d : (d && d.rs) || []; }
    function goi(call) { call.silent = true; return ums.api.call(call).then(dong); }
    function fail(where) { return function (err) { ums.api.handle(err, where); }; }
    function nguon(src) {
        if (src.dm) return ums.api.dm(src.dm);
        var c = {}; Object.keys(src.call).forEach(function (k) { c[k] = src.call[k]; });
        return goi(c);
    }

    /* ---------- Phân cấp → ô phạm vi (toggle_edit của gốc) ----------------- */
    var PC = {
        HSSV: ['he', 'khoa', 'ct', 'lop', 'hv'],
        KEHOACHXETTOTNGHIEP: ['kh'],
        LOPQUANLY: ['he', 'khoa', 'ct', 'lop'],
        CHUONGTRINH: ['he', 'khoa', 'ct'],
        KHOAHOC: ['he', 'khoa'],
        KHOAQUANLY: ['kql'],
        HEDAOTAO: ['he'],
        MOHINHNIENCHE_TINCHI: ['mh']
    };
    D.PHANCAP = PC;
    var PV = ['he', 'khoa', 'ct', 'lop', 'hv', 'kh', 'kql', 'mh'];
    var NHAN = { he: 'Hệ', khoa: 'Khóa', ct: 'Chương trình', lop: 'Lớp', hv: 'Học viên', kh: 'Kế hoạch', kql: 'Khoa quản lý', mh: 'Mô hình' };
    var GOIY = {
        he: 'Chọn hệ đào tạo', khoa: 'Chọn khóa đào tạo', ct: 'Chọn chương trình', lop: 'Chọn lớp',
        hv: 'Chọn học viên', kh: 'Chọn kế hoạch', kql: 'Chọn khoa quản lý', mh: 'Chọn mô hình'
    };

    function el(crud, k) { return crud.root.querySelector('[data-scope="form"][data-k="' + k + '"]'); }
    function locEl(crud, k) { return crud.root.querySelector('[data-scope="filter"][data-k="' + k + '"]'); }
    function chu(s) { var o = s && s.options[s.selectedIndex]; return o && o.value ? o.text.trim() : ''; }

    /** Giá trị biểu mẫu — ô chọn nhiều gửi "a,b" (edu.util.getValCombo) */
    D.gt = function (crud) {
        var v = crud.formValues();
        (crud._hbMulti || []).forEach(function (k) {
            var x = el(crud, k);
            v[k] = x ? (jQuery(x).val() || []).filter(Boolean).join(',') : '';
        });
        return v;
    };

    /* ---------- Bố cục hai cột col-lg-4 | col-lg-8 ------------------------- */
    function boCuc(crud, trai, phai) {
        if (crud._hbCot) return crud._hbCot;
        var grid = crud.z('form').querySelector('.ums-grid');
        var cot = {};
        [['trai', 'Thông tin đối tượng', trai], ['phai', 'Thông tin áp dụng', phai]].forEach(function (x) {
            var d = document.createElement('div');
            d.className = 'ums-grid hbdk-' + x[0];
            d.innerHTML = '<div class="ums-legend ums-u-mb-0">' + esc(x[1]) + '</div>';
            x[2].forEach(function (k) {
                var f = el(crud, k);
                var w = f;
                while (w && w.parentNode !== grid) w = w.parentNode;
                if (w) { d.appendChild(w); cot[k] = w; }
            });
            grid.appendChild(d);
        });
        grid.classList.add('hbdk-hai');
        crud._hbCot = cot;
        return cot;
    }

    /* ---------- Bảng từ khoá (genTable_TuKhoa / save_TuKhoa) --------------- */
    D.tuKhoa = function (host, ctl) {
        /* ctl: chuỗi controller (Học bổng: X/LayDanhSach phân trang máy chủ, X/ThemMoi | X/CapNhat)
           hoặc đối tượng (Tốt nghiệp — action / cỡ trang khác):
             { ds: 'X/LayDanhSach', them: 'X/ThemMoi', sua: 'X/CapNhat', size: 1000000, trang: false }
           trang: false = không phân trang (gốc TN chú thích bPaginate, nạp một lần size dòng). */
        var C = typeof ctl === 'string' ? { ds: ctl + '/LayDanhSach', them: ctl + '/ThemMoi', sua: ctl + '/CapNhat' } : ctl;
        var coTrang = C.trang !== false;
        var st = { page: 1, size: C.size || 10, total: 0 };
        host.innerHTML = pat.panel({
            title: 'Danh sách từ khóa', icon: 'fa-spell-check', count: 'hbTkDem', flush: true, zone: 'hbTk',
            tools: ui.btn('save', { text: 'Lưu danh sách từ khóa', attr: { 'data-hbtk': 'luu' } }),
            body: ui.empty('Đang tải…', 'fa-spinner fa-spin')
        });
        var z = host.querySelector('[data-z="hbTk"]');

        function nap(p) {
            if (p) st.page = p;
            return ums.api.call({
                action: C.ds, method: 'GET', silent: true,
                strTuKhoa: '', strPhanLoai_Id: '', strNguoiTao_Id: '',
                pageIndex: st.page, pageSize: st.size
            }).then(function (r) {
                var rows = dong(r);
                st.total = Number(r.pager) || rows.length;
                var dem = host.querySelector('[data-z="hbTkDem"]');
                if (dem) dem.textContent = '(' + st.total + ')';
                ui.table({
                    el: z, rows: rows, stt: true, empty: 'Không có từ khóa',
                    tableCls: 'ums-table--lined ums-table--tight',
                    columns: [
                        { title: 'Từ khóa', prop: 'TUKHOA', cls: 'is-nowrap' },
                        { title: 'Tên từ khóa', render: function (d) { return o(d, 'ten', d.TENTUKHOA); } },
                        { title: 'Mô tả', render: function (d) { return o(d, 'mota', d.MOTA); } }
                    ],
                    page: coTrang ? {
                        index: st.page, size: st.size, total: st.total,
                        onChange: function (x) { if (x >= 1 && x <= Math.ceil(st.total / st.size)) nap(x); },
                        onSize: function (v) { st.size = Number(v) || 100000; nap(1); }
                    } : null
                });
            }).catch(function (err) {
                z.innerHTML = ui.fail(err.message);
                ums.api.handle(err, 'danh sách từ khóa');
            });
        }
        function o(d, f, v) {
            return '<input class="ums-input ums-input--sm" data-tk="' + esc(d.ID) + '" data-tkf="' + f + '" data-goc="' +
                esc(e(v)) + '" value="' + esc(e(v)) + '">';
        }

        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-hbtk="luu"]');
            if (!b || !host.contains(b)) return;
            var doi = {};
            Array.prototype.forEach.call(z.querySelectorAll('[data-tk]'), function (x) {
                var id = x.getAttribute('data-tk');
                doi[id] = doi[id] || { ten: '', mota: '', khac: false };
                doi[id][x.getAttribute('data-tkf')] = x.value;
                if (x.value !== x.getAttribute('data-goc')) doi[id].khac = true;
            });
            var calls = Object.keys(doi).filter(function (id) { return doi[id].khac; }).map(function (id) {
                // Gốc: strId rỗng → ThemMoi — dòng nào cũng có ID nên thực tế luôn CapNhat
                return { action: id ? C.sua : C.them, strId: id, strTenTuKhoa: doi[id].ten, strMoTa: doi[id].mota };
            });
            if (!calls.length) { ui.toast('Không có từ khóa nào thay đổi', 'info'); return; }
            b.disabled = true;
            ui.batch(calls, { title: 'Lưu danh sách từ khóa' }).then(function (r) {
                if (r.fail) ui.toast('Lưu lỗi ' + r.fail + ' / ' + calls.length + ' từ khóa: ' + (r.errors[0] && r.errors[0].message || ''), 'bad');
                else ui.toast('Cập nhật thành công!', 'ok');
                return nap();
            }).then(function () { b.disabled = false; });
        });
        nap(1);
        return { nap: nap };
    };

    /* ---------- Nguồn ô phạm vi — nạp một lần khi mở biểu mẫu riêng đầu tiên */
    function ganPhamVi(crud, cfg) {
        if (crud._hbPV) return crud._hbPV;
        var F = {};
        PV.forEach(function (k) { F[k] = el(crud, '_pv_' + k); });

        function napKhoa(he) {
            return ums.ref.khoaDaoTao({ strHeDaoTao_Id: he, strCoSoDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 });
        }
        var ready = Promise.all([
            ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
                .then(function (r) { pat.fill(F.he, r, { name: 'TENHEDAOTAO', head: GOIY.he }); }),
            cfg.keHoach ? nguon(cfg.keHoach).then(function (r) { pat.fill(F.kh, r, { name: 'TEN', head: GOIY.kh }); }) : null,
            ums.ref.khoaQuanLy().then(function (r) { pat.fill(F.kql, r, { name: 'TEN', head: GOIY.kql }); }),
            ums.api.dm('KHCT.LOAILOP').then(function (r) { pat.fill(F.mh, r, { name: 'TEN', head: GOIY.mh }); })
        ]).catch(fail('nạp danh mục phạm vi'));

        function rong(ks) { ks.forEach(function (k) { pat.fill(F[k], [], { head: GOIY[k] }); }); }

        /* Đổi tầng trên → nạp tầng dưới (select2:select như gốc). pat.chain lo xoá
           trắng + khoá; xoá tầng trên thì chain phát lại select2:select rỗng. */
        jQuery(F.he).on('select2:select', function () {
            var he = F.he.value;
            rong(['ct', 'lop', 'hv']);
            if (!he) { rong(['khoa']); return; }
            napKhoa(he).then(function (r) { pat.fill(F.khoa, r, { name: 'TENKHOA', head: GOIY.khoa }); }).catch(fail('khóa đào tạo'));
        });
        jQuery(F.khoa).on('select2:select', function () {
            var khoa = F.khoa.value;
            rong(['lop', 'hv']);
            if (!khoa) { rong(['ct']); return; }
            ums.ref.chuongTrinh({
                strKhoaDaoTao_Id: khoa, strN_CN_LOP_Id: '', strKhoaQuanLy_Id: '', strToChucCT_Cha_Id: '',
                strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000
            }).then(function (r) { pat.fill(F.ct, r, { name: 'TENCHUONGTRINH', head: GOIY.ct }); }).catch(fail('chương trình'));
        });
        jQuery(F.ct).on('select2:select', function () {
            var ct = F.ct.value;
            rong(['hv']);
            if (!ct) { rong(['lop']); return; }
            ums.ref.lopQuanLy({
                strCoSoDaoTao_Id: '', strKhoaDaoTao_Id: '', strNganh_Id: '', strLoaiLop_Id: '', strToChucCT_Id: ct,
                strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000
            }).then(function (r) { pat.fill(F.lop, r, { name: 'TEN', head: GOIY.lop }); }).catch(fail('lớp'));
        });
        jQuery(F.lop).on('select2:select', function () {
            if (!F.lop.value) { rong(['hv']); return; }
            goi({   // getList_SinhVien của gốc
                action: 'SV_HoSo/LayDanhSach', method: 'GET',
                strTuKhoa: '', strHeDaoTao_Id: F.he.value, strKhoaDaoTao_Id: F.khoa.value,
                strChuongTrinh_Id: F.ct.value, strLopQuanLy_Id: F.lop.value, pageIndex: 1, pageSize: 10000
            }).then(function (r) {
                pat.fill(F.hv, r, { name: function (x) { return e(x.MASO) + ' - ' + e(x.HODEM) + ' ' + e(x.TEN); }, head: GOIY.hv });
            }).catch(fail('học viên'));
        });
        var ch = pat.chain([F.he, F.khoa, F.ct, F.lop, F.hv]);

        crud._hbPV = {
            F: F, ready: ready,
            /* Mở biểu mẫu: ô phạm vi về trống, ô con khoá lại */
            reset: function () {
                PV.forEach(function (k) { F[k].value = ''; jQuery(F[k]).trigger('change.select2'); });
                rong(['khoa', 'ct', 'lop', 'hv']);
                ch.sync();
            }
        };
        return crud._hbPV;
    }

    /* =====================================================================
       Khung màn
       ===================================================================== */
    D.man = function (root, cfg) {
        var PL = cfg.phanLoai;
        var S = { pc: [] };
        var sec = null;
        root.innerHTML = '<div data-hbdk="ds"></div><div data-hbdk="phu" hidden></div>';
        var ds = root.querySelector('[data-hbdk="ds"]');
        var phu = root.querySelector('[data-hbdk="phu"]');

        /* Nguồn ô Phân loại / Quỹ dùng chung cho ô lọc hai tab + biểu mẫu */
        var srcPL = PL.nguon.dm ? { dm: PL.nguon.dm } : { call: PL.nguon.call, id: PL.nguon.id || 'ID', name: PL.nguon.name || 'TEN' };

        /* Trường biểu mẫu: ô chọn nhiều bỏ `source` (crud đổ kèm ô trống đầu) — khung tự đổ */
        var multi = [];
        function truong(f) {
            var c = {};
            Object.keys(f).forEach(function (k) { c[k] = f[k]; });
            if (f.multi) { multi.push(f); delete c.source; }
            return c;
        }
        var fPL = { key: PL.key, col: PL.col, label: PL.nhan, type: 'select', source: srcPL, placeholder: PL.loc };
        var trai = [fPL].concat((cfg.trai || []).map(truong));
        var phai = (cfg.phai || []).map(truong);
        var fPV = [{ key: '_pvht', label: 'Phạm vi đang áp dụng', type: 'static', get: function (r) { return e(r.PHAMVIAPDUNG_TEN); } }]
            .concat(PV.map(function (k) { return { key: '_pv_' + k, label: NHAN[k], type: 'select', placeholder: GOIY[k] }; }));

        function khoaTrai(kieu) {
            return trai.map(function (f) { return f.key; }).concat(kieu === 'rieng' ? fPV.map(function (f) { return f.key; }) : []);
        }

        function maPc(crud) {
            var id = locEl(crud, 'pc').value;
            var x = S.pc.filter(function (r) { return r.ID === id; })[0];
            return x ? e(x.MA) : '';
        }

        /* Cột: tab 2 thêm cột phạm vi — tiêu đề = tên phân cấp đang chọn (lblPhamVi_Ten) */
        var cotRieng = [{ title: 'Phạm vi áp dụng', prop: 'PHAMVIAPDUNG_TEN' }].concat(cfg.cotChung);

        function tao(kieu) {
            var K = cfg[kieu];
            var rieng = kieu === 'rieng';
            var toolbar = [];
            if (rieng) toolbar.push({
                text: 'Thêm mới', icon: 'fa-plus', mod: 'add',
                onClick: function (crud) {
                    if (!locEl(crud, 'pc').value) { ui.toast('Hãy chọn phân cấp áp dụng', 'warn'); return; }
                    crud.showForm(null);
                }
            });
            (cfg.toolbar || []).forEach(function (t) { toolbar.push(t); });

            return {
                title: rieng ? 'Danh sách điều kiện' : 'Danh sách điều kiện chung',
                listTitle: rieng ? 'Danh sách điều kiện' : 'Danh sách điều kiện chung',
                formTitle: rieng ? 'điều kiện áp dụng riêng' : 'điều kiện áp dụng',
                icon: 'fa-list-ul',
                canAdd: !rieng,          // tab 2: nút Thêm mới tự dựng (phải chọn phân cấp trước)
                toolbar: toolbar,
                filters: [{ key: 'pl', type: 'select', label: PL.loc, source: srcPL }]
                    .concat(rieng ? [{ key: 'pc', type: 'select', label: 'Chọn phân cấp áp dụng' }] : [])
                    .concat([{ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }]),
                list: {
                    paged: true,
                    call: function (f, p) {
                        // tab 1 nạp ngay trong pat.sections (sec chưa có) — chỉ tab 2 cần tới crud
                        var me = rieng && sec ? crudOf(kieu) : null;
                        if (rieng) {
                            cotRieng[0].title = me ? (chu(locEl(me, 'pc')) || 'Phạm vi áp dụng') : 'Phạm vi áp dụng';
                            if (!f.pc) {
                                if (me) {
                                    me.rows = []; me.total = 0;
                                    me.z('table').innerHTML = ui.empty(f.pl ? 'Chọn phân cấp áp dụng để xem danh sách'
                                        : 'Chọn ' + PL.nhan.toLowerCase() + ' rồi chọn phân cấp áp dụng', 'fa-filter');
                                    var dem = me.z('count'); if (dem) dem.textContent = '';
                                }
                                return null;
                            }
                        }
                        var c = { action: K.ctl + '/LayDanhSach', method: 'GET', strTuKhoa: f.q };
                        c[PL.key] = f.pl;
                        if (rieng) {
                            c.strPhamViApDung_Id = '';
                            c.strPhanCapApDung_Id = f.pc;
                            c.strDaoTao_ThoiGianDaoTao_Id = '';
                        }
                        Object.keys(K.ds || {}).forEach(function (k) { c[k] = K.ds[k]; });
                        return c;
                    }
                },
                columns: rieng ? cotRieng : cfg.cotChung,
                formCols: 12,
                fields: trai.concat(rieng ? fPV : []).concat(phai),
                onForm: function (row, crud, extra) {
                    var cot = boCuc(crud, khoaTrai(kieu), phai.map(function (f) { return f.key; }));
                    // Ô chọn nhiều: fillForm chỉ đặt được một giá trị → đặt lại theo chuỗi "a,b"
                    multi.forEach(function (f) {
                        jQuery(el(crud, f.key)).val(row ? mang(row[f.col]) : []).trigger('change');
                    });
                    if (!row) {   // rewrite(): phân loại lấy theo ô lọc của tab đang mở
                        var x = el(crud, PL.key);
                        x.value = locEl(crud, 'pl').value;
                        jQuery(x).trigger('change.select2');
                    }
                    Array.prototype.forEach.call(crud.z('form').querySelectorAll('textarea'), function (t) { t.rows = cfg.dongTextarea || 4; });
                    if (rieng) {
                        var ma = maPc(crud);
                        var hien = PC[ma] || [];
                        if (!PC[ma]) ui.toast(ma + ' : Không thuộc HSSV, KEHOACHXETTOTNGHIEP, LOPQUANLY, CHUONGTRINH, KHOAHOC, KHOAQUANLY, HEDAOTAO, MOHINHNIENCHE_TINCHI', 'bad');
                        PV.forEach(function (k) { cot['_pv_' + k].hidden = hien.indexOf(k) < 0; });
                        cot._pvht.hidden = !row;
                        var pv = ganPhamVi(crud, cfg);
                        pv.reset();
                    }
                    extra.innerHTML = '<div data-hbdk="them"></div>' + (cfg.tuKhoa ? '<div class="ums-u-mt-4" data-hbdk="tk"></div>' : '');
                    if (cfg.onForm) cfg.onForm(kieu, row, crud, extra.querySelector('[data-hbdk="them"]'));
                    if (cfg.tuKhoa) D.tuKhoa(extra.querySelector('[data-hbdk="tk"]'), cfg.tuKhoa);
                },
                save: function (v0, row, crud) {
                    var v = D.gt(crud);
                    var c = { action: K.ctl + (row ? '/CapNhat' : '/ThemMoi'), strId: row ? row.ID : '' };
                    c[PL.key] = v[PL.key];
                    if (rieng) {
                        var ma = maPc(crud);
                        if (!PC[ma]) { ui.toast(ma + ' : Không thuộc các phân cấp đã biết — không lưu được', 'bad'); return null; }
                        var dich = PC[ma][PC[ma].length - 1];
                        var pvId = v['_pv_' + dich] || (row ? e(row.PHAMVIAPDUNG_ID) : '');
                        if (!pvId) { ui.toast('Hãy chọn ' + NHAN[dich].toLowerCase(), 'warn'); return null; }
                        c.strPhamViApDung_Id = pvId;
                        c.strDaoTao_ThoiGianDaoTao_Id = '';     // gốc đọc #dropThoiGianDaoTao — không có trên màn
                    }
                    var them = K.luu ? K.luu(v, row) : {};
                    Object.keys(them).forEach(function (k) { c[k] = them[k]; });
                    return c;
                },
                onSaved: function (crud, result, isEdit) {
                    var id = (result && result.raw && result.raw.Id) || (crud.editing && crud.editing.ID) || '';
                    if (cfg.onSaved) cfg.onSaved(kieu, crud, id);
                },
                rowDelete: false,
                multi: false,
                formRemoveText: 'Xóa',
                remove: function (ids) {
                    return ids.map(function (id) { return { action: K.ctl + '/Xoa', strIds: id }; });
                },
                removeConfirm: function () { return 'Bạn có chắc chắn xóa dữ liệu không?'; }
            };
        }

        sec = pat.sections({
            el: ds, title: cfg.tieuDe,
            tabs: [
                { key: 'chung', text: '1) Điều kiện áp dụng chung', sections: [tao('chung')] },
                { key: 'rieng', text: '2) Điều kiện áp dụng riêng', sections: [tao('rieng')] }
            ]
        });
        function crudOf(k) { return sec.crud(k, 0); }

        /* Ô chọn nhiều của biểu mẫu (cả hai tab): bật multiple, đổ danh mục */
        ['chung', 'rieng'].forEach(function (k) {
            var crud = crudOf(k);
            crud._hbMulti = multi.map(function (f) { return f.key; });
            multi.forEach(function (f) {
                var x = el(crud, f.key);
                x.multiple = true;
                x.innerHTML = '';
                ui.select2(x, { placeholder: f.placeholder || '-- Chọn --' });
                nguon(f.source).then(function (r) {
                    pat.fill(x, r, { id: f.source.id || 'ID', name: f.source.name || 'TEN' });
                }).catch(fail('nguồn ' + f.label));
            });
        });

        /* Tab 2: Phân loại (Quỹ) → Phân cấp áp dụng (getList_PhanCapApDung) */
        var cr = crudOf('rieng');
        var fPl = locEl(cr, 'pl'), fPc = locEl(cr, 'pc');
        function napPhanCap() {
            var pl = fPl.value;
            S.pc = [];
            if (!pl) { pat.fill(fPc, [], { head: 'Chọn phân cấp áp dụng' }); cr.load(1); return; }
            goi({ action: cfg.phanCap, method: 'GET', strPhanLoai_Id: pl }).then(function (r) {
                S.pc = r;
                pat.fill(fPc, r, { name: 'TEN', head: 'Chọn phân cấp áp dụng' });
                // cbGenCombo_PhanCapApDung: chọn sẵn mục đầu rồi nạp danh sách
                if (r.length) { fPc.value = r[0].ID; jQuery(fPc).trigger('change.select2').trigger('ums:refresh'); }
                cr.load(1);
            }).catch(fail('phân cấp áp dụng'));
        }
        jQuery(fPl).on('select2:select select2:clear', napPhanCap);
        pat.chain([fPl, fPc], { phatLai: false });

        return {
            crud: crudOf, sections: sec, ds: ds, phu: phu,
            moPhu: function () { ui.swap(ds, phu); },
            dongPhu: function () { ui.swap(phu, ds); }
        };
    };
})();
