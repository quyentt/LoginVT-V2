/* =========================================================================
   luanvan / luanan — KHUNG CHUNG: ums.lvla.*
   Dùng cho luanvan: kehoach, dangkydecuong, decuongchinhthuc, hoidongthongqua
   và (nạp chéo) module luanan: kehoach, dangky, decuongchinhthuc, hoidongthongqua (giống 85–100% bản gốc).
   Bản gốc: ApisLuanVanLuanAn/Modules/luanvan/script/{kehoach,dangkydecuong,decuongchinhthuc,hoidongthongqua}.js
   (bốn tệp chép nhau 85–96%: cùng cụm Hệ → Khóa → Chương trình → Lớp → Học viên, cùng lưới "người" có Vai trò,
   cùng hộp "Xác nhận" của LVLA_NhanXet_DanhGia).
   ---------------------------------------------------------------------------
   CÁCH THAM SỐ HOÁ CHO luanan (script/<tên>.js của luanan chỉ cần gọi một lần, html nạp chéo _lv_chung.js):

     ums.lvla.man(root, cfg)         màn "danh sách + biểu mẫu trong trang" của một đề cương / luận án
         cfg.title, cfg.listTitle, cfg.formTitle   chữ của màn
         cfg.P        tiền tố action chính:   luanvan 'LVLA_DeCuong_DangKy/' · 'LVLA_DeCuong_ChinhThuc/'
                      luanan  'LVLA_DeCuong_DangKy/' → đổi theo bản gốc luanan (xem tom-tat-goc.py luanan/<tên>.html)
         cfg.keHoach  { action: 'LVLA_KeHoach_DeCuong/LayDanhSach' }  (luanan: LVLA_KeHoach_ChuyenDe/LayDanhSach)
         cfg.khoaKH   tên khoá kế hoạch trong lời gọi / dòng: { param: 'strLVLA_KeHoach_DeCuong_Id', col: 'LVLA_KEHOACH_DECUONG_ID' }
         cfg.khoaCha  khoá cha của người hướng dẫn / thành viên (vd 'strLVLA_DeCuong_DangKy_Id')
         cfg.canAdd   true: có nút Thêm mới (đăng ký); false: chỉ sửa (đề cương chính thức, hội đồng)
         cfg.import   true: nút Import theo mẫu ("zonebtnDKDC")
         cfg.quyetDinh  true: Số / Ngày quyết định + tệp "File up quyết định hội đồng" (đề cương chính thức)
         cfg.check    true: cột ô đánh dấu + nút "Thực hiện phê duyệt"; cfg.cotKetQua: cột "Kết quả" (KETQUADANHGIA)
         cfg.xacNhan  { sanPham: function (id) → mã sản phẩm }  hộp Xác nhận (XLHV.XNKK) ở danh sách và trong biểu mẫu
         cfg.nguoi    mảng lưới người trong biểu mẫu (xem ums.lvla.luoiNguoi): { title, dm, readonly, list(row), save(rec, cha, row),
                      xoa (action Xoa), map(r), pick: 'llkh' }
         cfg.luu      (tuỳ chọn) hàm thêm tham số vào lời gọi lưu chính (row, v)
         cfg.phanLoai 'LVLA.PLCD' (danh mục): cột "Phân loại" (PHANLOAI_TEN) + ô chọn Phân loại trong biểu mẫu, gửi strPhanLoai_Id (luanan/dangky)
         cfg.tep      false: bỏ ô "File up quyết định hội đồng" dù có quyetDinh (luanan/decuongchinhthuc); mặc định có
         cfg.chiXem   true: thông tin đề cương trong biểu mẫu chỉ đọc, Lưu chỉ lưu các lưới người (luanan/hoidongthongqua)
       ums.lvla.luoiNguoi: g.diem true thêm ba cột Điểm (dDiem) · Đánh giá (danh mục LVLA.DGHD, strDanhGia_Id) · Nhận xét (strNhanXet);
                      map trả thêm diem / dg / nx, save đọc rec.diem / rec.dg / rec.nx
     ums.lvla.luoiNguoi(host, g) · ums.lvla.pickLLKH(onPick) · ums.lvla.xacNhan(o) · ums.lvla.nguoiHoc(body) — dùng riêng được.

   Lời gọi dùng chung (action kiểu cũ, không mã hoá; tham số chép nguyên văn, strNguoiThucHien_Id / strChucNang_Id hệ tự chèn):
     Kế hoạch   <keHoach.action> GET strTuKhoa '' · pageIndex 1 · pageSize 100000
     Học viên   SV_HoSo/LayDanhSach GET strTuKhoa '' · strHeDaoTao_Id · strKhoaDaoTao_Id · strChuongTrinh_Id · strLopQuanLy_Id
                · pageIndex 1 · pageSize 10000   (chữ hiện "MASO - HODEM TEN")
     Hệ / Khoá / Chương trình / Lớp: ums.ref.* (KHCT_*, như edu.system.getList_*)
     Người LLKH  TN_LLKH_HoSo_MH/DSA4BSAvKRIgIikNDQoJ · pkg_llkh_hoso.LayDanhSachLLKH: strTuKhoa · iTrangThai -1 · iTinhTrang -1
                · strLoaiTimKiem '' · dChiLayDSCoSua -1 · pageIndex · pageSize  (edu.extend.genModal_LLKH — chưa có ở tầng chung)
     Xác nhận   LVLA_NhanXet_DanhGia/ThemMoi POST strId '' · strSanPham_Id · strNoiDung · strTinhTrang_Id · strNguoiXacnhan_Id
                LVLA_NhanXet_DanhGia/LayDanhSach GET strTuKhoa '' · strsanpham_Id · strTinhTrang_Id '' · pageIndex 1 · pageSize 100000
                Danh mục nút xác nhận: XLHV.XNKK (sắp theo HESO1; THONGTIN1 = biểu tượng, THONGTIN2 = kiểu màu)

   Khác bản gốc (chung):
     · Thêm / Sửa là biểu mẫu trong trang (pat.formTrang) thay cho zone-bus; Lưu xong lưu luôn các dòng con (người, tệp) bằng ID máy
       chủ trả rồi ĐÓNG biểu mẫu về danh sách (gốc ở lại biểu mẫu mà không nhớ ID → Lưu lần hai thêm trùng).
     · Học viên bắt buộc chọn; đã chọn cán bộ trùng trong lưới thì báo "Đã tồn tại!" (gốc so ID cán bộ với ID DÒNG nên
       không bắt được dòng đã lưu).
     · Hộp Xác nhận trong biểu mẫu nạp lịch sử theo mã sản phẩm (gốc: dòng nạp lịch sử bị chú thích → bảng luôn trống).
   Cố ý bỏ (mã chết của gốc): dropAAAA / txtAAAA / btnYes / slnhansu / vaitro_ / DSTrangThaiSV_LHD / dropSearch_*_IHD /
     btnThemHeKhoa + tbl_HeKhoa + genHTML_*_HeKhoa (không có trên màn), getList_ThoiGianDaoTao / KhoaQuanLy / NamNhapHoc
     / genList_TrangThaiSV (đổ vào ô không có).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var L = ums.lvla = ums.lvla || {};

    function e(v) { return v === null || v === undefined ? '' : String(v); }
    function esc(s) { return ui.esc(e(s)); }
    function arr(d) { return Array.isArray(d) ? d : (d && d.rs) || []; }
    function uid() { return (ums.session && ums.session.userId) || ''; }
    L.e = e; L.esc = esc; L.arr = arr; L.uid = uid;
    L.dang = function (el) { el.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin'); };
    L.loi = function (el, err, noi) { el.innerHTML = ui.fail(err && err.message); ums.api.handle(err, noi); };
    L.g = function (action, o, post) { return ums.api.call(Object.assign({ action: action, method: post ? 'POST' : 'GET' }, o || {})); };
    L.cssId = function (s) { return window.CSS && CSS.escape ? CSS.escape(s) : String(s).replace(/["\\]/g, '\\$&'); };

    /** Đặt giá trị cho ô (kể cả select2 / lịch) */
    L.dat = function (el, v) {
        if (!el) return;
        el.value = e(v);
        if (el.tagName === 'SELECT' && window.jQuery) jQuery(el).trigger('change.select2');
        if (el._flatpickr) { if (el.value) el._flatpickr.setDate(el.value, false, 'd/m/Y'); else el._flatpickr.clear(); }
    };
    L.inp = function (k, date) {
        return '<input class="ums-input" data-k="' + k + '" data-scope="form" autocomplete="off"' + (date ? ' data-date placeholder="dd/mm/yyyy"' : '') + '>';
    };
    L.sel = function (k, ph) {
        return '<select class="ums-select" data-k="' + k + '" data-scope="form" data-ph="' + esc(ph) + '"><option value="">' + esc(ph) + '</option></select>';
    };

    /* ---------- Danh sách kế hoạch (ô lọc) ------------------------------------- */
    L.napKeHoach = function (el, action) {
        return L.g(action || 'LVLA_KeHoach_DeCuong/LayDanhSach', { strTuKhoa: '', pageIndex: 1, pageSize: 100000 })
            .then(function (r) { pat.fill(el, arr(r.data), { name: 'TEN', head: 'Chọn kế hoạch' }); })
            .catch(function (err) { ums.api.handle(err, 'kế hoạch'); });
    };

    /* ---------- Hộp chọn LLKH (edu.extend.genModal_LLKH) ------------------------ */
    /* onPick(dòng) gọi MỖI LẦN bấm "Chọn" (hộp vẫn mở như gốc); trả false = đã tồn tại */
    L.pickLLKH = function (onPick) {
        var page = 1, size = 10, total = 0, rows = [];
        var dlg = ui.dialog({
            title: 'Tìm kiếm nhân sự', icon: 'fa-user-magnifying-glass', size: 'xl',
            body: '<div class="ums-filter"><div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div></div>' +
                '<div class="ums-u-mt-4" data-f="tbl"></div>',
            buttons: []
        });
        var B = dlg.body;
        function f(k) { return B.querySelector('[data-f="' + k + '"]'); }
        function ten(r) {
            var cd = e(r.MACHUCDANH) ? e(r.MACHUCDANH) + '.' : '';
            var hv = e(r.MAHOCVI) ? e(r.MAHOCVI) + '.' : '';
            return (cd + hv + ' ' + e(r.HOVATEN)).trim();
        }
        function sinh(r) { return [r.NGAYSINH, r.THANGSINH, r.NAMSINH].filter(function (x) { return !(x === null || x === undefined || x === ''); }).join('/'); }
        function tim(p) {
            if (p) page = p;
            L.dang(f('tbl'));
            ums.api.call({ action: 'TN_LLKH_HoSo_MH/DSA4BSAvKRIgIikNDQoJ', func: 'pkg_llkh_hoso.LayDanhSachLLKH',
                strTuKhoa: (f('q').value || '').trim(), iTrangThai: -1, iTinhTrang: -1, strLoaiTimKiem: '', dChiLayDSCoSua: -1,
                pageIndex: page, pageSize: size })
                .then(function (r) { rows = arr(r.data); total = Number(r.pager) || rows.length; ve(); })
                .catch(function (err) { L.loi(f('tbl'), err, 'tìm nhân sự'); });
        }
        function ve() {
            ui.table({
                el: f('tbl'), rows: rows, empty: 'Không tìm thấy nhân sự',
                page: { index: page, size: size, total: total,
                    onChange: function (p) { if (p >= 1 && p <= Math.ceil(total / size)) tim(p); },
                    onSize: function (v) { size = v === 'all' ? ui.PAGE_ALL : Number(v); tim(1); } },
                columns: [
                    { title: 'Họ tên', render: function (r) { return esc(ten(r)) + '<br><span class="ums-u-faint ums-u-fz13">' + esc(r.MASO) + '</span>'; } },
                    { title: 'Ngày sinh', cls: 'is-center is-nowrap', render: function (r) { return esc(sinh(r)); } },
                    { title: 'Giới tính', prop: 'TENGIOITINH', cls: 'is-center' },
                    { title: 'Chọn', cls: 'is-center', width: '90px', render: function (r, i) {
                        return ui.btn('confirm', { text: 'Chọn', cls: 'ums-btn--sm', attr: { 'data-chon': String(i) } });
                    } }
                ]
            });
        }
        B.addEventListener('click', function (ev) {
            if (ev.target.closest('[data-a="search"]')) { tim(1); return; }
            var b = ev.target.closest('[data-chon]');
            if (!b) return;
            var r = rows[Number(b.getAttribute('data-chon'))];
            if (r) onPick({ ID: r.ID, MASO: r.MASO, TEN: ten(r), COQUANCONGTAC: r.COQUANCONGTAC });
        });
        f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim(1); } });
        tim(1);
        return dlg;
    };

    /* ---------- Khối "Thông tin học viên": Hệ → Khóa → Chương trình → Lớp → Học viên ---- */
    L.nguoiHocHtml = function () {
        return '<div class="ums-legend">Thông tin học viên</div>' +
            ui.field('Hệ', L.sel('he', 'Chọn hệ đào tạo')) + ui.field('Khóa', L.sel('khoa', 'Chọn khóa đào tạo')) +
            ui.field('Chương trình', L.sel('ct', 'Chọn chương trình')) + ui.field('Lớp', L.sel('lop', 'Chọn lớp')) +
            ui.field('Học viên', L.sel('hv', 'Chọn học viên'), { required: true });
    };
    L.nguoiHoc = function (body) {
        function k(x) { return body.querySelector('[data-k="' + x + '"]'); }
        var S = { he: k('he'), khoa: k('khoa'), ct: k('ct'), lop: k('lop'), hv: k('hv') };
        var tenHV = function (r) { return e(r.MASO) + ' - ' + (e(r.HODEM) + ' ' + e(r.TEN)).trim(); };
        function napHV(lopId, v) {
            if (!lopId) { pat.fill(S.hv, [], { head: 'Chọn học viên' }); return Promise.resolve(); }
            return L.g('SV_HoSo/LayDanhSach', { strTuKhoa: '', strHeDaoTao_Id: v.he, strKhoaDaoTao_Id: v.khoa, strChuongTrinh_Id: v.ct,
                strLopQuanLy_Id: lopId, pageIndex: 1, pageSize: 10000 })
                .then(function (r) { pat.fill(S.hv, arr(r.data), { name: tenHV, head: 'Chọn học viên' }); })
                .catch(function (err) { ums.api.handle(err, 'danh sách học viên'); });
        }
        var cas = ums.ref.cascade({ he: S.he, khoa: S.khoa, ct: S.ct, lop: S.lop,
            onChange: function (v, level) { if (level === 'lop' || level === 'ct' || level === 'khoa' || level === 'he') napHV(v.lop, v); } });
        pat.chain([S.he, S.khoa, S.ct, S.lop, S.hv], { phatLai: false });
        function khoa(b) {
            Object.keys(S).forEach(function (x) { S[x].disabled = b; if (window.jQuery) jQuery(S[x]).trigger('change.select2'); });
        }
        return {
            S: S,
            value: function () { return S.hv.value; },
            /* thêm mới: mở khoá, xoá trắng, nạp lại từ đầu */
            reset: function () {
                khoa(false);
                ['he', 'khoa', 'ct', 'lop', 'hv'].forEach(function (x) { L.dat(S[x], ''); });
                cas.ready.then(function () { cas.reload(); pat.fill(S.hv, [], { head: 'Chọn học viên' }); if (window.jQuery) jQuery(S.he).trigger('select2:clear'); });
            },
            /* sửa: nạp đúng các tầng của dòng rồi khoá (readonlyselect2 của gốc) */
            nap: function (r) {
                var he = e(r.DAOTAO_HEDAOTAO_ID), kh = e(r.DAOTAO_KHOADAOTAO_ID), ct = e(r.DAOTAO_CHUONGTRINH_ID), lop = e(r.DAOTAO_LOPQUANLY_ID);
                var big = { pageIndex: 1, pageSize: 1000000 };
                return cas.ready.then(function () {
                    L.dat(S.he, he);
                    return Promise.all([
                        ums.ref.khoaDaoTao(Object.assign({ strHeDaoTao_Id: he }, big)),
                        ums.ref.chuongTrinh(Object.assign({ strDaoTao_HeDaoTao_Id: he, strKhoaDaoTao_Id: kh }, big)),
                        ums.ref.lopQuanLy(Object.assign({ strDaoTao_HeDaoTao_Id: he, strKhoaDaoTao_Id: kh, strToChucCT_Id: ct }, big))
                    ]);
                }).then(function (x) {
                    pat.fill(S.khoa, x[0], { name: function (o) { return o.TENKHOA || o.MAKHOA || o.TEN; }, head: 'Chọn khóa đào tạo' });
                    pat.fill(S.ct, x[1], { name: function (o) { return o.TENCHUONGTRINH || o.MACHUONGTRINH || o.TEN; }, head: 'Chọn chương trình' });
                    pat.fill(S.lop, x[2], { name: function (o) { return o.TEN || o.MA; }, head: 'Chọn lớp' });
                    pat.fill(S.hv, [{ ID: r.QLSV_NGUOIHOC_ID, TEN: e(r.QLSV_NGUOIHOC_MASO) + ' - ' + e(r.QLSV_NGUOIHOC_HOTEN) }], { head: 'Chọn học viên' });
                    L.dat(S.khoa, kh); L.dat(S.ct, ct); L.dat(S.lop, lop); L.dat(S.hv, r.QLSV_NGUOIHOC_ID);
                    khoa(true);
                });
            }
        };
    };

    /* ---------- Lưới người (hướng dẫn / hội đồng / nhân sự kế hoạch) ----------------
       g = { title, icon, vaiTro: 'LVLA.VTHD' | null, readonly,
             list(ctx) → lời gọi lấy dòng đã lưu, map(r) → { ID, pid, ten, coQuan, ma, vt, vtTen },
             save(rec, chaId, ctx) → lời gọi lưu (null = bỏ qua), xoa: 'X/Xoa', nhanSu: true (hộp chọn nhân sự thay LLKH),
             cotMa: true (cột "Mã cán bộ" thay "Cơ quan công tác"), chiLuuMoi: true (chỉ lưu dòng mới) }
       → { load(ctx), clear(), save(chaId, ctx) → Promise, rows() }                                         */
    L.luoiNguoi = function (host, g) {
        var rows = [], vtRows = [], tam = 0, ctx = null;
        host.innerHTML = pat.panel({ title: g.title, icon: g.icon || 'fa-user-tie', flush: true, zone: 't', count: 'n',
            tools: g.readonly ? '' : ui.btn('add', { text: 'Thêm dòng mới', mod: 'out-success', attr: { 'data-g': 'them' } }) });
        function z() { return host.querySelector('[data-z="t"]'); }
        var dgRows = [];
        var dgP = g.diem ? ums.api.dm('LVLA.DGHD').then(function (d) { dgRows = d; }, function () { dgRows = []; }) : Promise.resolve();
        var vtP = g.vaiTro ? ums.api.dm(g.vaiTro).then(function (d) { vtRows = d; }, function () { vtRows = []; }) : Promise.resolve();

        function keo() {   // đọc lại ô Vai trò trước khi vẽ lại
            host.querySelectorAll('select[data-vt]').forEach(function (s) { var r = rows[Number(s.getAttribute('data-vt'))]; if (r) r.vt = s.value; });
            host.querySelectorAll('[data-gd]').forEach(function (s) { var r = rows[Number(s.getAttribute('data-i'))]; if (r) r[s.getAttribute('data-gd')] = s.value; });
        }
        function ve() {
            host.querySelector('[data-z="n"]').textContent = '(' + rows.length + ')';
            var cols = [
                { title: 'Họ tên', render: function (r) { return esc(r.ten) + (r.moi ? ' ' + ui.badge('Chưa lưu', 'warn') : ''); } },
                g.cotMa ? { title: 'Mã cán bộ', render: function (r) { return esc(r.ma); } } : { title: 'Cơ quan công tác', render: function (r) { return esc(r.coQuan); } }
            ];
            if (g.diem) {
                cols.push({ title: 'Điểm', render: function (r, i) {
                    return '<input class="ums-input ums-input--sm" data-gd="diem" data-i="' + i + '" value="' + esc(r.diem) + '" autocomplete="off">'; } });
                cols.push({ title: 'Đánh giá', render: function (r, i) {
                    return '<select class="ums-select ums-input--sm" data-gd="dg" data-i="' + i + '"><option value="">Chọn đánh giá</option>' +
                        dgRows.map(function (o) { return '<option value="' + esc(o.ID) + '"' + (String(o.ID) === String(r.dg) ? ' selected' : '') + '>' + esc(o.TEN) + '</option>'; }).join('') + '</select>'; } });
                cols.push({ title: 'Nhận xét', render: function (r, i) {
                    return '<input class="ums-input ums-input--sm" data-gd="nx" data-i="' + i + '" value="' + esc(r.nx) + '" autocomplete="off">'; } });
            }
            if (g.vaiTro || g.cotVaiTro) cols.push({ title: 'Vai trò', render: function (r, i) {
                if (g.readonly) return esc(r.vtTen);
                return '<select class="ums-select ums-input--sm" data-vt="' + i + '"><option value="">Chọn vai trò</option>' +
                    vtRows.map(function (o) { return '<option value="' + esc(o.ID) + '"' + (String(o.ID) === String(r.vt) ? ' selected' : '') + '>' + esc(o.TEN) + '</option>'; }).join('') + '</select>';
            } });
            if (!g.readonly) cols.push({ title: 'Xóa', cls: 'is-center is-actions', width: '70px', render: function (r, i) {
                return '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-g="xoa" data-i="' + i + '" title="Xoá"><i class="fa-light fa-trash-can"></i></button>';
            } });
            ui.table({ el: z(), rows: rows, stt: true, empty: g.readonly ? 'Chưa có dữ liệu' : 'Chưa có dòng nào', columns: cols });
        }
        function tai() {
            if (!ctx) { rows = []; ve(); return Promise.resolve(); }
            L.dang(z());
            return Promise.all([ums.api.call(g.list(ctx)), vtP, dgP]).then(function (x) {
                rows = arr(x[0].data).map(g.map);
                ve();
            }).catch(function (err) { L.loi(z(), err, g.title); });
        }
        function them() {
            var pick = g.nhanSu
                ? function (cb) { pat.pickNhanSu({ title: 'Tìm kiếm nhân sự', onPick: function (list) { list.forEach(function (x) {
                    cb({ ID: x.ID, MASO: x.MASO, TEN: (x.LOAICHUCDANH_MA ? x.LOAICHUCDANH_MA + '. ' : '') + (x.LOAIHOCVI_MA ? x.LOAIHOCVI_MA + '. ' : '') + e(x.HOTEN), COQUANCONGTAC: x.COQUANCONGTAC }); }); } }); }
                : function (cb) { L.pickLLKH(cb); };
            pick(function (x) {
                if (rows.some(function (r) { return String(r.pid) === String(x.ID); })) { ui.toast('Đã tồn tại!', 'warn'); return; }
                keo();
                rows.push({ ID: '', pid: x.ID, ten: x.TEN, ma: x.MASO, coQuan: x.COQUANCONGTAC, vt: '', moi: true, _t: ++tam });
                ve();
                ui.toast('Đã chọn!', 'ok');
            });
        }
        function xoa(i) {
            var r = rows[i]; if (!r) return;
            keo();
            if (r.moi) { rows.splice(i, 1); ve(); return; }
            ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá' }).then(function (yes) {
                if (!yes) return;
                ums.api.call({ action: g.xoa, strIds: r.ID }).then(function () { ui.toast('Xóa thành công!', 'ok'); tai(); })
                    .catch(function (err) { ums.api.handle(err, 'xoá'); });
            });
        }
        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-g]');
            if (!b || !host.contains(b)) return;
            if (b.getAttribute('data-g') === 'them') them();
            else if (b.getAttribute('data-g') === 'xoa') xoa(Number(b.getAttribute('data-i')));
        });
        ve();
        return {
            load: function (c) { ctx = c; return tai(); },
            clear: function () { ctx = null; rows = []; ve(); },
            rows: function () { return rows; },
            save: function (chaId, c) {
                keo();
                var calls = [];
                if (!g.save) return Promise.resolve();
                rows.forEach(function (r) {
                    if (g.chiLuuMoi && !r.moi) return;
                    var p = g.save(r, chaId, c || ctx);
                    if (p) calls.push(p);
                });
                if (!calls.length) return Promise.resolve();
                return ui.batch(calls, { title: 'Đang lưu ' + g.title.toLowerCase(), okText: 'Lưu ' + g.title.toLowerCase() });
            }
        };
    };

    /* ---------- Hộp Xác nhận (LVLA_NhanXet_DanhGia) ------------------------------ */
    /* o = { ids: [id…], sanPham(id) → mã sản phẩm, hist: id | null, onDone() } */
    L.xacNhan = function (o) {
        var dlg = ui.dialog({
            title: 'Xác nhận', icon: 'fa-circle-check', size: 'lg',
            body: '<div class="ums-legend">Nội dung xác nhận</div>' + '<input class="ums-input" data-xn="nd" autocomplete="off">' +
                '<div class="ums-legend ums-u-mt-4">Chọn xác nhận</div><div class="ums-row" data-xn="nut">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' +
                (o.hist ? '<div class="ums-legend ums-u-mt-4">Lịch sử xác nhận</div><div data-xn="ls"></div>' : ''),
            buttons: []
        });
        var B = dlg.body;
        ums.api.dm('XLHV.XNKK', 'HESO1').then(function (d) {
            B.querySelector('[data-xn="nut"]').innerHTML = d.map(function (x) {
                return '<button type="button" class="ums-btn ums-btn--out-primary" data-tt="' + esc(x.ID) + '"><i class="' + esc(ums.iconFA4(x.THONGTIN1) || 'fa-light fa-circle-check') + '"></i><span>' + esc(x.TEN) + '</span></button>';
            }).join('') || ui.empty('Chưa có danh mục xác nhận');
        }).catch(function (err) { L.loi(B.querySelector('[data-xn="nut"]'), err, 'danh mục xác nhận'); });
        if (o.hist) {
            L.g('LVLA_NhanXet_DanhGia/LayDanhSach', { strTuKhoa: '', strsanpham_Id: o.sanPham(o.hist), strTinhTrang_Id: '', pageIndex: 1, pageSize: 100000 })
                .then(function (r) {
                    ui.table({ el: B.querySelector('[data-xn="ls"]'), rows: arr(r.data), empty: 'Chưa có lịch sử xác nhận', columns: [
                        { title: 'Xác nhận', prop: 'TINHTRANG_TEN' }, { title: 'Nội dung', prop: 'NOIDUNG' },
                        { title: 'Người xác nhận', prop: 'NGUOIXACNHAN_TENDAYDU' }, { title: 'Ngày', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap' }] });
                }).catch(function (err) { L.loi(B.querySelector('[data-xn="ls"]'), err, 'lịch sử xác nhận'); });
        }
        B.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-tt]');
            if (!b) return;
            var tt = b.getAttribute('data-tt'), nd = B.querySelector('[data-xn="nd"]').value;
            dlg.close();
            ui.batch(o.ids.map(function (id) {
                return { action: 'LVLA_NhanXet_DanhGia/ThemMoi', method: 'POST', strId: '', strSanPham_Id: o.sanPham(id), strNoiDung: nd,
                    strTinhTrang_Id: tt, strNguoiXacnhan_Id: uid() };
            }), { title: 'Đang xác nhận', okText: 'Xác nhận thành công' }).then(function () { if (o.onDone) o.onDone(); });
        });
        return dlg;
    };

    /* ---------- Màn "danh sách + biểu mẫu" của đề cương ---------------------------- */
    L.man = function (root, c) {
        var P = c.P, KH = c.khoaKH || { param: 'strLVLA_KeHoach_DeCuong_Id', col: 'LVLA_KEHOACH_DECUONG_ID' };
        var page = 1, size = (ums.cfg && ums.cfg.behavior && ums.cfg.behavior.pageSize) || 10, total = 0, rows = [], cur = null;

        root.innerHTML =
            pat.page(c.title, c.canAdd ? ui.btn('add', { attr: { 'data-a': 'them' } }) : '') +
            pat.filterBar([{ key: 'kh', type: 'select', label: 'Chọn kế hoạch' }, { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }],
                { search: false, extra: c.import ? '<div class="ums-field ums-field--fit" data-z="bc"></div>' : '' }) +
            pat.panel({ title: c.listTitle, icon: 'fa-list-ul', count: 'n', flush: true, zone: 't',
                tools: (c.check ? ui.btn('confirm', { text: 'Thực hiện phê duyệt', attr: { 'data-a': 'pheduyet' } }) : '') + ui.btn('reload', { attr: { 'data-a': 'tai' } }) });
        function q(s) { return root.querySelector(s); }
        var fKH = q('[data-f="kh"]'), fQ = q('[data-f="q"]');
        ui.enhance(root);
        L.napKeHoach(fKH, c.keHoach && c.keHoach.action);

        if (c.import && ums.report && ums.report.mount) {
            ums.report.mount(q('[data-z="bc"]'), { collect: function () { }, onImported: function () { load(1); } });
        }

        function load(p) {
            if (p) page = p;
            var host = q('[data-z="t"]');
            L.dang(host);
            var call = { action: P + 'LayDanhSach', method: 'GET', strTuKhoa: (fQ.value || '').trim(), strQLSV_NguoiHoc_Id: '', strNguoiDangKy_Id: '', pageIndex: page, pageSize: size };
            call[KH.param] = fKH.value;
            ums.api.call(call).then(function (r) {
                rows = arr(r.data); total = Number(r.pager) || rows.length; ve();
            }).catch(function (err) { L.loi(host, err, 'danh sách'); });
        }
        function ve() {
            q('[data-z="n"]').textContent = '(' + total + ')';
            var cols = [
                { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                { title: 'Họ tên', prop: 'QLSV_NGUOIHOC_HOTEN' },
                { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' },
                { title: 'Ngành', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                { title: 'Tên đề cương', prop: 'TENTIENGVIET' }
            ];
            if (c.phanLoai) cols.push({ title: 'Phân loại', prop: 'PHANLOAI_TEN' });
            if (c.quyetDinh) cols.push({ title: 'Số quyết định', prop: 'SOQUYETDINH', cls: 'is-nowrap' });
            cols.push({ title: 'Mô tả', prop: 'MOTA' });
            if (c.cotKetQua) cols.push({ title: 'Kết quả', prop: 'KETQUADANHGIA', cls: 'is-center' });
            cols.push({ title: 'Chi tiết', cls: 'is-center is-actions', width: '80px', render: function (r) {
                return '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-a="sua" data-id="' + esc(r.ID) + '" title="Sửa"><i class="fa-light fa-pen-to-square"></i></button>';
            } });
            if (c.check) cols.push({ head: '<input type="checkbox" data-all="lvck" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                render: function (r) { return '<input type="checkbox" data-lvck="' + esc(r.ID) + '">'; } });
            ui.table({ el: q('[data-z="t"]'), rows: rows, empty: 'Chưa có dữ liệu',
                page: { index: page, size: size, total: total,
                    onChange: function (p) { if (p >= 1 && p <= Math.ceil(total / size)) load(p); },
                    onSize: function (v) { size = v === 'all' ? ui.PAGE_ALL : Number(v); load(1); } },
                columns: cols });
        }
        function daChon() {
            return Array.prototype.filter.call(q('[data-z="t"]').querySelectorAll('tbody input[data-lvck]'), function (x) { return x.checked; })
                .map(function (x) { return x.getAttribute('data-lvck'); });
        }

        /* ---------- biểu mẫu ---------------------------------------------------- */
        function moForm(row) {
            if (!row && !fKH.value) { ui.toast('Bạn cần chọn kế hoạch', 'warn'); return; }
            cur = row || null;
            var g = {};      // lưới người
            var body = document.createElement('div');
            body.innerHTML =
                '<div class="ums-grid ums-grid--2"><div>' + L.nguoiHocHtml() +
                    (c.quyetDinh ? ui.field('Số quyết định', L.inp('sqd')) + ui.field('Ngày quyết định', L.inp('nqd', true)) : '') +
                '</div><div><div class="ums-legend">Thông tin đề cương</div>' +
                    (c.phanLoai ? ui.field('Phân loại', L.sel('pl', 'Chọn phân loại')) : '') +
                    ui.field('Tên đề cương tiếng việt', L.inp('tv')) + ui.field('Tên đề cương tiếng anh', L.inp('ta')) +
                    ui.field('Ngày đăng ký', L.inp('ngay', true)) +
                    ui.field('Mô tả', '<textarea class="ums-input" data-k="mota" data-scope="form" rows="3"></textarea>') +
                    (c.quyetDinh && c.tep !== false ? ui.field('File up quyết định hội đồng', '<div data-k="tep"></div>') : '') +
                '</div></div>' +
                (c.nguoi || []).map(function (n, i) { return '<div class="ums-u-mt-4" data-nguoi="' + i + '"></div>'; }).join('');
            var buttons = [];
            if (c.xacNhan && row) buttons.push({ text: 'Xác nhận', kind: 'confirm', keepOpen: true, onClick: function () {
                L.xacNhan({ ids: [row.ID], sanPham: c.xacNhan.sanPham, hist: row.ID, onDone: function () { load(); } }); return false; } });
            buttons.push({ text: 'Lưu', kind: 'save', keepOpen: true, onClick: function () { luu(); return false; } });
            var api = pat.formTrang({ host: root, title: (row ? 'Chỉnh sửa' : 'Thêm mới') + ' - ' + (c.formTitle || c.title), icon: row ? 'fa-pen-to-square' : 'fa-plus',
                cols: 1, body: body, buttons: buttons, onClose: function () { cur = null; load(); } });
            function k(x) { return body.querySelector('[data-k="' + x + '"]'); }
            var nh = L.nguoiHoc(body);
            var files = c.quyetDinh && c.tep !== false ? ums.files.mount(k('tep'), { api: 'LVLA_Files' }) : null;
            (c.nguoi || []).forEach(function (n, i) { g[i] = L.luoiNguoi(body.querySelector('[data-nguoi="' + i + '"]'), n); });
            ui.enhance(body);
            var plP = c.phanLoai ? ums.api.dm(c.phanLoai).then(function (d) { pat.fill(k('pl'), d, { name: 'TEN', head: 'Chọn phân loại' }); },
                function (err) { ums.api.handle(err, 'danh mục phân loại'); }) : Promise.resolve();
            if (row) {
                nh.nap(row);
                if (c.phanLoai) plP.then(function () { L.dat(k('pl'), row.PHANLOAI_ID); });
                L.dat(k('tv'), row.TENTIENGVIET); L.dat(k('ta'), row.TENTIENGANH); L.dat(k('mota'), row.MOTA); L.dat(k('ngay'), row.NGAYDANGKY);
                if (c.quyetDinh) { L.dat(k('sqd'), row.SOQUYETDINH); L.dat(k('nqd'), row.NGAYQUYETDINH); if (files) files.load(row.ID); }
                (c.nguoi || []).forEach(function (n, i) { g[i].load(row); });
                if (c.chiXem) ['pl', 'tv', 'ta', 'ngay', 'mota', 'sqd', 'nqd'].forEach(function (x) {
                    var el = k(x); if (!el) return;
                    el.disabled = true; if (window.jQuery && el.tagName === 'SELECT') jQuery(el).trigger('change.select2');
                });
            }
            function luu() {
                var hv = nh.value() || (row ? e(row.QLSV_NGUOIHOC_ID) : '');
                if (!hv) { ui.toast('Vui lòng chọn học viên', 'warn'); return; }
                var id = cur ? e(cur.ID) : '';
                if (c.chiXem && row) {   // thông tin đề cương chỉ đọc: chỉ lưu các lưới người
                    var pc = [];
                    (c.nguoi || []).forEach(function (n, i) { pc.push(g[i].save(id, row)); });
                    Promise.all(pc).then(function () { api.close(); });
                    return;
                }
                var call = { action: P + (id ? 'CapNhat' : 'ThemMoi'), method: 'POST', strId: id };
                call[KH.param] = cur ? e(cur[KH.col]) : fKH.value;
                Object.assign(call, { strQLSV_NguoiHoc_Id: hv, strNguoiDangKy_Id: uid(), strNgayDangKy: k('ngay').value,
                    strTenTiengViet: k('tv').value, strTenTiengAnh: k('ta').value, strMoTa: k('mota').value });
                if (c.phanLoai) call.strPhanLoai_Id = k('pl').value;
                if (c.quyetDinh) Object.assign(call, { strSoQuyetDinh: k('sqd').value, strNgayQuyetDinh: k('nqd').value,
                    strLVLA_DeCuong_DangKy_Id: cur ? e(cur.LVLA_DECUONG_DANGKY_ID) : '' });
                ums.api.call(call).then(function (r) {
                    var moi = !id;
                    ui.toast(moi ? 'Thêm mới thành công!' : 'Cập nhật thành công!', 'ok');
                    var nid = moi ? ((r.raw && r.raw.Id) || '') : id;
                    if (!nid) { load(); return; }
                    if (moi) { cur = { ID: nid, QLSV_NGUOIHOC_ID: hv }; cur[KH.col] = fKH.value; }
                    cur.MOTA = call.strMoTa;
                    var ps = [];
                    (c.nguoi || []).forEach(function (n, i) { ps.push(g[i].save(nid, cur)); });
                    if (files) ps.push(files.save(nid));
                    Promise.all(ps).then(function () { api.close(); });
                }).catch(function (err) { ums.api.handle(err, 'lưu'); });
            }
        }

        root.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || !root.contains(b) || b.closest('.ums-formtrang')) return;
            switch (b.getAttribute('data-a')) {
                case 'them': moForm(null); break;
                case 'tai': load(1); break;
                case 'sua': var r = rows.filter(function (x) { return String(x.ID) === b.getAttribute('data-id'); })[0]; if (r) moForm(r); break;
                case 'pheduyet':
                    var ids = daChon();
                    if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
                    L.xacNhan({ ids: ids, sanPham: c.xacNhan.sanPham, onDone: function () { load(); } });
                    break;
            }
        });
        root.addEventListener('change', function (ev) {
            var t = ev.target;
            if (t.getAttribute && t.getAttribute('data-all') === 'lvck') {
                var tb = t.closest('table');
                if (tb) tb.querySelectorAll('tbody input[data-lvck]').forEach(function (x) { x.checked = t.checked; });
            }
        });
        var tm = null;
        fQ.addEventListener('input', function () { clearTimeout(tm); tm = setTimeout(function () { load(1); }, 400); });
        fQ.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); clearTimeout(tm); load(1); } });
        if (window.jQuery) jQuery(fKH).on('change select2:clear', function () { load(1); }); else fKH.addEventListener('change', function () { load(1); });
        load(1);
        return { load: load };
    };
})();
