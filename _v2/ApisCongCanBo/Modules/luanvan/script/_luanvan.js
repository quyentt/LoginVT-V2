/* =========================================================================
   luanvan — tầng chung của module "Luận văn" (cổng cán bộ): ums.lv.*
   Dùng cho giaodetai, duyetdetai, duyetdexuat, dexuathoidong, duyethoidong,
   gvhdxacnhan, khoaphanbien, pbxacnhan.
   Bản gốc: ApisCongCanBo/Modules/luanvan/script/*.js — sáu tệp chép nhau (45–96% dòng
   trùng): cùng thanh "Chọn kế hoạch thực hiện" + "Xem danh sách", cùng bảng người học của
   kế hoạch bảo vệ, cùng hộp "Xác nhận" (trạng thái + lịch sử), cùng khối thông tin người
   học, cùng lưới người hướng dẫn / phản biện (cán bộ · vai trò · tệp).
   ---------------------------------------------------------------------------
   Lời gọi dùng chung (action kiểu cũ trừ vai trò bản mã hoá):
     Kế hoạch  LVLA_BV_KeHoach/LayDSKeHoachTheoNguoiDung (kiểu 'nguoiDung')
               LVLA_BV_KeHoach/LayDSBV_KeHoach dHieuLuc -1, pageSize 100000 (kiểu 'tatCa')
               — chỉ một kế hoạch thì tự chọn (selectOne).
     Cán bộ    NS_HoSoV2/LayDanhSach pageIndex 1, pageSize 100000 (nạp một lần, dùng chung)
     Vai trò   pkg_bv_chung.LayDSBV_VaiTro_PhanLoai (strPhanLoaiTinhChat HUONGDAN / PHANBIEN)
               hoặc LVLA_BV_Chung/LayDSBV_VaiTro_PhanLoai (không tính chất) — theo PHANLOAI_ID dòng
     Người HD / PB  LVLA_BV_KeHoach/LayDSBV_KH_NG_GiaoDeTai_{HD|PB} · Them_/Sua_/Xoa_BV_KeHoach_NH_GiaoDT_{HD|PB}
     Xác nhận  LVLA_BV_Chung/LayDSBV_XacNhan_<loại> + Them_BV_XacNhan_<loại>; mã sản phẩm =
               QLSV_NGUOIHOC_ID + DAOTAO_TOCHUCCHUONGTRINH_ID + BV_KEHOACH_ID [+ BV_KEHOACH_DETAI_ID]
     Tệp       LVLA_Files (ums.files)
   Khung màn: ums.lv.man(root, cfg) — danh sách người học; "Chọn" → khung chi tiết THAY CHỖ
     danh sách (bản gốc: modal 1400px — BO-CUC quy ước 1). Hộp Xác nhận: ums.lv.xacNhan.
     Biểu mẫu thêm / sửa bên trong khung chi tiết: ums.lv.bieuMau (pat.formTrang) — thay chỗ thân khung, KHÔNG bật hộp thoại.
   Khác bản gốc (ghi ở can-quyet.js):
     · Ô "Nội dung xác nhận" (txtNoiDungXacNhanSanPham) không có trong html gốc → strNoiDung gửi rỗng như gốc;
       chưa chọn trạng thái thì báo (gốc gửi rỗng).
     · Sau khi xác nhận gốc gọi me.getList_SinhVien() không tồn tại (lỗi JS) → nạp lại danh sách.
     · Mở màn: gốc nạp danh sách NGAY với kế hoạch rỗng rồi mới tự chọn kế hoạch → nạp sau khi đã chọn.
     · Lưới người: dòng chưa chọn cán bộ KHÔNG gửi (gốc gửi cả dòng trống).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var L = ums.lv = ums.lv || {};
    var KH = 'LVLA_BV_KeHoach/', CH = 'LVLA_BV_Chung/';

    function uid() { return (ums.session && ums.session.userId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : String(v); }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function cssId(s) { return window.CSS && CSS.escape ? CSS.escape(s) : String(s).replace(/["\\]/g, '\\$&'); }
    var DANG_TAI = ui.empty('Đang tải…', 'fa-spinner fa-spin');
    L.e = e; L.arr = arr; L.uid = uid; L.KH = KH; L.CH = CH; L.DANG_TAI = DANG_TAI;
    L.chucNang = function () { return (ums.state && ums.state.chucNangId) || ''; };

    /** Gọi action kiểu cũ; o chép nguyên tham số bản gốc */
    L.g = function (action, o, post) {
        return ums.api.call(Object.assign({ action: action, method: post ? 'POST' : 'GET' }, o || {}));
    };

    /* ---------- Danh mục ------------------------------------------------- */
    L.keHoach = function (el, kieu) {
        var p = kieu === 'tatCa'
            ? L.g(KH + 'LayDSBV_KeHoach', { strTuKhoa: '', strPhanLoai_Id: '', dHieuLuc: -1, strDaoTao_ThoiGianDaoTao_Id: '',
                strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 100000 })
            : L.g(KH + 'LayDSKeHoachTheoNguoiDung', { strNguoiThucHien_Id: uid() });
        return p.then(function (r) {
            var d = arr(r.data);
            pat.fill(el, d, { name: 'TEN', head: 'Chọn kế hoạch' });
            if (d.length === 1) { el.value = d[0].ID; if (window.jQuery) jQuery(el).trigger('change.select2'); }   // selectOne
        }).catch(function (err) { ums.api.handle(err, 'kế hoạch'); });
    };
    var canBoP = null;
    /** Toàn bộ hồ sơ cán bộ (NS_HoSoV2/LayDanhSach 100000 dòng như gốc) — nạp một lần */
    L.canBo = function () {
        if (!canBoP) canBoP = L.g('NS_HoSoV2/LayDanhSach', { pageIndex: 1, pageSize: 100000, silent: true })
            .then(function (r) { return arr(r.data); }, function (err) { canBoP = null; ums.api.handle(err, 'danh sách cán bộ'); return []; });
        return canBoP;
    };
    L.tenCanBo = function (r) { return e(r.MASO) + ' - ' + (e(r.HODEM) + ' ' + e(r.TEN)).trim(); };
    /** tinhChat: 'HUONGDAN' | 'PHANBIEN' → bản mã hoá có tính chất; bỏ trống → LVLA_BV_Chung (GET) */
    L.vaiTro = function (phanLoai, tinhChat) {
        var p = tinhChat
            ? ums.api.call({ action: 'TN_LVLA_BV_Chung_MH/DSA4BRIDFx4XICgVMy4eESkgLw0uICgP', func: 'pkg_bv_chung.LayDSBV_VaiTro_PhanLoai',
                strPhanLoaiTinhChat: tinhChat, strNguoiThucHien_Id: uid(), strPhanLoai_Id: e(phanLoai), silent: true })
            : L.g(CH + 'LayDSBV_VaiTro_PhanLoai', { strNguoiThucHien_Id: uid(), strPhanLoai_Id: e(phanLoai), silent: true });
        return p.then(function (r) { return arr(r.data); }, function (err) { ums.api.handle(err, 'vai trò'); return []; });
    };

    /* ---------- Người học ------------------------------------------------ */
    L.hoTen = function (r) { return (e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN)).trim(); };
    L.sanPham = function (r, coDeTai) {
        return e(r.QLSV_NGUOIHOC_ID) + e(r.DAOTAO_TOCHUCCHUONGTRINH_ID) + e(r.BV_KEHOACH_ID) + (coDeTai === false ? '' : e(r.BV_KEHOACH_DETAI_ID));
    };
    function kv(n, v) { return '<div class="ums-kv"><span>' + esc(n) + '</span><b>' + esc(v) + '</b></div>'; }
    L.kv = kv;
    /** Khối thông tin người học của các hộp chi tiết. o = { tinhTrang, deTai: false, quyetDinh: false, lyDo } */
    L.thongTin = function (r, o) {
        o = o || {};
        var h = (o.tinhTrang !== undefined ? '<div class="lv-tt"><span>Tình trạng:</span> ' +
                (o.tinhTrang ? ui.badge(o.tinhTrang, 'ok') : '<span class="ums-u-faint">Chưa có</span>') + '</div>' : '') +
            '<div class="ums-grid ums-grid--2 lv-kv">' +
            kv('Mã số', e(r.QLSV_NGUOIHOC_MASO)) + kv('Họ tên', L.hoTen(r)) +
            kv('Lớp', e(r.QLSV_NGUOIHOC_LOP) || e(r.DAOTAO_LOPQUANLY_TEN)) +
            kv('Chương trình', e(r.DAOTAO_TOCHUCCHUONGTRINH_TEN) || e(r.DAOTAO_CHUONGTRINH_TEN)) +
            (o.deTai === false ? '' : kv('Tên đề tài tiếng Việt', e(r.BV_KEHOACH_DETAI_TEN)) + kv('Tên đề tài tiếng Anh', e(r.BV_KEHOACH_DETAI_TENTA))) +
            (o.quyetDinh === false ? '' : kv('Quyết định', e(r.QLSV_QUYETDINH_SOQD)) + kv('Lý do điều chỉnh', o.lyDo !== undefined ? e(o.lyDo) : e(r.LYDODIEUCHINH))) +
            '</div>';
        return pat.panel({ title: 'Thông tin người học', icon: 'fa-user-graduate', body: h, cls: 'ums-u-mb-4' });
    };
    /** Bảy cột đầu chung của mọi bảng người học */
    L.cotSV = function () {
        return [
            { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
            { title: 'Họ đệm', prop: 'QLSV_NGUOIHOC_HODEM', cls: 'is-nowrap' },
            { title: 'Tên', prop: 'QLSV_NGUOIHOC_TEN', cls: 'is-nowrap' },
            { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN', cls: 'is-center is-nowrap' },
            { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN', cls: 'is-center' },
            { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN', cls: 'is-center' },
            { title: 'Hệ đào tạo', prop: 'DAOTAO_HEDAOTAO_TEN', cls: 'is-center' }
        ];
    };
    L.cotChon = function () {
        return { title: 'Chọn', cls: 'is-center', width: '64px', render: function (r) {
            return '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-lv-mo="' + esc(r.ID) + '" title="Chọn"><i class="fa-light fa-pen-to-square"></i></button>';
        } };
    };
    /** Ô "Tình trạng …" kèm nút Xác nhận (btnDuyet của gốc) */
    L.oXacNhan = function (r, ten) {
        return '<div class="lv-xnc">' + esc(e(ten)) + '<button type="button" class="ums-btn ums-btn--sm ums-btn--out-primary" data-lv-xn="' + esc(r.ID) + '">' +
            '<i class="fa-light fa-circle-check"></i><span>Xác nhận</span></button></div>';
    };

    /* ---------- Hộp Xác nhận --------------------------------------------- */
    /**
     * cfg = { dm (mã danh mục trạng thái), loai ('HD' | 'PB' | 'PhanBienQ' | 'GiaoDeTai'),
     *         sanPham (mã lấy lịch sử), sanPhamLuu (mã khi lưu, mặc định = sanPham),
     *         khoaDs ('strSanPham_Id' | 'strsanpham_Id' — tên tham số khi lấy lịch sử, chép đúng gốc), onDone }
     */
    L.xacNhan = function (cfg) {
        var dlg = ui.dialog({ title: 'Xác nhận', icon: 'fa-circle-check', size: 'lg', body:
            '<div class="lv-xn"><div class="ums-field"><label class="ums-field__label">Trạng thái xác nhận</label>' +
            '<select class="ums-select" data-xn="tt" data-ph="Chọn trạng thái"><option value="">Chọn trạng thái</option></select></div>' +
            ui.btn('save', { text: 'Đồng ý', icon: 'fa-check', attr: { 'data-xn': 'ok' } }) + '</div>' +
            '<div class="ums-legend ums-legend--cach">Lịch sử xác nhận</div><div data-xn="ls"></div>' });
        var b = dlg.body, sel = b.querySelector('[data-xn="tt"]'), ls = b.querySelector('[data-xn="ls"]');
        ui.enhance(b);
        ums.api.dm(cfg.dm).then(function (d) { pat.fill(sel, d, { head: 'Chọn trạng thái' }); })
            .catch(function (err) { ums.api.handle(err, 'trạng thái xác nhận'); });
        ls.innerHTML = DANG_TAI;
        var o = { strTuKhoa: '', strLoaiXacNhan_Id: 'XACNHAN_HOANTHANH_NHAP', strNguoiXacNhan_Id: '', strHanhDong_Id: '', pageIndex: 1, pageSize: 100000 };
        o[cfg.khoaDs || 'strSanPham_Id'] = cfg.sanPham;
        L.g(CH + 'LayDSBV_XacNhan_' + cfg.loai, o).then(function (r) {
            ui.table({ el: ls, rows: arr(r.data), empty: 'Chưa có lượt xác nhận', columns: [
                { title: 'Trạng thái', prop: 'TINHTRANG_TEN' }, { title: 'Người xác nhận', prop: 'NGUOIXACNHAN_TENDAYDU' },
                { title: 'Thời gian', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap' }] });
        }).catch(function (err) { ls.innerHTML = ui.fail(err.message); ums.api.handle(err, 'lịch sử xác nhận'); });
        b.addEventListener('click', function (ev) {
            if (!ev.target.closest('[data-xn="ok"]')) return;
            if (!sel.value) { ui.toast('Vui lòng chọn trạng thái xác nhận', 'warn'); return; }
            L.g(CH + 'Them_BV_XacNhan_' + cfg.loai, { strSanPham_Id: cfg.sanPhamLuu || cfg.sanPham, strNguoiXacnhan_Id: uid(),
                strNoiDung: '', strTinhTrang_Id: sel.value }, true)
                .then(function () { ui.toast('Xác nhận thành công', 'ok'); dlg.close(); if (cfg.onDone) cfg.onDone(); })
                .catch(function (err) { ums.api.handle(err, 'xác nhận'); });
        });
        return dlg;
    };

    /* ---------- Người hướng dẫn / phản biện ------------------------------ */
    L.dsNguoi = function (loai, parentId, r) {
        return L.g(KH + 'LayDSBV_KH_NG_GiaoDeTai_' + loai, { strBV_Kehoach_NH_GiaoDT_Id: parentId, strBV_KeHoach_Id: r.BV_KEHOACH_ID,
            strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID, strDaoTao_ChuongTrinh_Id: r.DAOTAO_TOCHUCCHUONGTRINH_ID, strNguoiThucHien_Id: uid() })
            .then(function (res) { return arr(res.data); });
    };
    /** Bảng CHỈ XEM (người, vai trò, tệp). o = { nhan, ten(r) → tên, vaiTro(r) → tên vai trò, empty } */
    L.bangNguoi = function (el, rows, o) {
        o = o || {};
        ui.table({ el: el, rows: rows, empty: o.empty || 'Chưa có dữ liệu', columns: [
            { title: o.nhan || 'Người hướng dẫn', render: function (r) {
                return esc(o.ten ? o.ten(r) : (e(r.NGUOIDUNG_HODEM) + ' ' + e(r.NGUOIDUNG_TEN)).trim());
            } },
            { title: 'Vai trò', render: function (r) { return esc(e(r.VAITRO_TEN) || (o.vaiTro ? o.vaiTro(r) : '')); } },
            { title: 'File', render: function (r) { return '<div data-lvf="' + esc(r.ID) + '"></div>'; } }
        ] });
        rows.forEach(function (r) {
            var h = el.querySelector('[data-lvf="' + cssId(r.ID) + '"]');
            if (h) ums.files.mount(h, { api: 'LVLA_Files', readonly: true }).load(r.ID);
        });
    };
    /** Tên theo id khi dòng chỉ có NGUOIDUNG_ID / VAITRO_ID (gốc vẽ ô chọn đặt sẵn giá trị) */
    L.tenTheoId = function (ds, id, ten) {
        var x = arr(ds).filter(function (d) { return e(d.ID) === e(id); })[0];
        return x ? ten(x) : '';
    };
    /**
     * Lưới người SỬA ĐƯỢC (cán bộ · vai trò · tệp) — pat.rows. o = { loai 'HD'|'PB', sv (dòng người học),
     *   tieuDe, nhan, vaiTro (Promise<danh sách>) }. g.load(idGiao) · g.save(idGiao) · g.clear()
     */
    L.luoiNguoi = function (host, o) {
        var sv = o.sv;
        return pat.rows(host, {
            title: o.tieuDe, icon: 'fa-user-tie', addText: 'Thêm dòng',
            columns: [
                { key: 'strNguoiDung_Id', col: 'NGUOIDUNG_ID', title: o.nhan, type: 'select', s2: true, placeholder: 'Chọn cán bộ',
                    source: { load: L.canBo, name: L.tenCanBo } },
                { key: 'strVaiTro_Id', col: 'VAITRO_ID', title: 'Vai trò', type: 'select', placeholder: 'Chọn vai trò',
                    source: { load: function () { return o.vaiTro; } } },
                { key: '_tep', title: 'File', type: 'files', api: 'LVLA_Files' }
            ],
            list: function (pid) {
                return { action: KH + 'LayDSBV_KH_NG_GiaoDeTai_' + o.loai, method: 'GET', strBV_Kehoach_NH_GiaoDT_Id: pid, strBV_KeHoach_Id: sv.BV_KEHOACH_ID,
                    strQLSV_NguoiHoc_Id: sv.QLSV_NGUOIHOC_ID, strDaoTao_ChuongTrinh_Id: sv.DAOTAO_TOCHUCCHUONGTRINH_ID, strNguoiThucHien_Id: uid() };
            },
            filled: function (v) { return !!v.strNguoiDung_Id; },
            save: function (v, rec, pid) {
                return { action: KH + (rec ? 'Sua_' : 'Them_') + 'BV_KeHoach_NH_GiaoDT_' + o.loai, method: 'POST', strId: rec ? rec.ID : '',
                    strBV_KeHoach_Id: sv.BV_KEHOACH_ID, strQLSV_NguoiHoc_Id: sv.QLSV_NGUOIHOC_ID, strDaoTao_ChuongTrinh_Id: sv.DAOTAO_TOCHUCCHUONGTRINH_ID,
                    strBV_Kehoach_NH_GiaoDT_Id: pid, strVaiTro_Id: v.strVaiTro_Id, strNguoiDung_Id: v.strNguoiDung_Id, strNguoiThucHien_Id: uid() };
            },
            remove: function (rec) {
                return { action: KH + 'Xoa_BV_KeHoach_NH_GiaoDT_' + o.loai, strChucNang_Id: L.chucNang(), strId: rec.ID, strNguoiThucHien_Id: uid() };
            }
        });
    };

    /* =====================================================================
       Khung màn: danh sách người học của kế hoạch + khung chi tiết thay chỗ
       cfg = { tieuDe, keHoach: 'nguoiDung' | 'tatCa', list(khId, page, size) → lời gọi, phanTrang,
               columns(ctx) → cột, tools (HTML đầu khung danh sách, nút mang data-lv-tool),
               onTool(k, ctx), onXacNhan(row, ctx), chiTiet(row, khung, ctx) → hàm dọn }
       khung = { host (thân), act (vùng nút đầu trang, trước "Đóng"), el (cả khung — gắn sự kiện) }
       ===================================================================== */
    L.man = function (root, cfg) {
        var st = { page: 1, size: 10, rows: [] }, don = null;
        root.innerHTML = '<div data-lv="list">' + pat.page(cfg.tieuDe) +
            pat.filterBar([{ key: 'kh', type: 'select', label: 'Chọn kế hoạch thực hiện' }], { searchText: 'Xem danh sách' }) +
            pat.panel({ title: 'Danh sách', icon: 'fa-list-ul', count: 'lvn', flush: true, zone: 'lvbang', tools: cfg.tools || '' }) +
            '</div><div data-lv="view" hidden></div>';
        ui.enhance(root);
        var list = root.querySelector('[data-lv="list"]'), view = root.querySelector('[data-lv="view"]');
        var kh = list.querySelector('[data-f="kh"]'), bang = list.querySelector('[data-z="lvbang"]');
        var ctx = { kh: function () { return kh.value; }, tai: tai, st: st, root: root, dong: dong };

        function tai(page) {
            if (page) st.page = page;
            bang.innerHTML = DANG_TAI;
            return ums.api.call(Object.assign({ method: 'GET' }, cfg.list(kh.value, st.page, st.size))).then(function (r) {
                st.rows = arr(r.data);
                var tong = Number(r.pager) || st.rows.length;
                list.querySelector('[data-z="lvn"]').textContent = '(' + tong + ')';
                ui.table({ el: bang, rows: st.rows, columns: cfg.columns(ctx), empty: 'Không có dữ liệu',
                    page: cfg.phanTrang ? { index: st.page, size: st.size, total: tong, onChange: tai, onSize: function (n) { st.size = n; tai(1); } } : undefined });
            }).catch(function (err) { bang.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách'); });
        }
        function hang(id) { return st.rows.filter(function (r) { return e(r.ID) === id; })[0]; }
        function mo(id) {
            var row = hang(id);
            if (!row) return;
            view.innerHTML = '<div data-lv="khung"><div class="ums-page__head"><h1 class="ums-page__title ums-u-mb-0">' + esc(cfg.tieuDeChiTiet || cfg.tieuDe) +
                ' — ' + esc(L.hoTen(row)) + '</h1><div class="ums-page__actions" data-lv="act">' + ui.btn('close', { attr: { 'data-lv-dong': '1' } }) +
                '</div></div><div data-lv="ct"></div></div>';
            ui.swap(list, view);
            var el = view.querySelector('[data-lv="khung"]');
            el.addEventListener('click', function (ev) { if (ev.target.closest('[data-lv-dong]')) dong(true); });
            don = cfg.chiTiet(row, { el: el, host: el.querySelector('[data-lv="ct"]'), act: el.querySelector('[data-lv="act"]') }, ctx);
        }
        function dong(napLai) {
            if (typeof don === 'function') don();
            don = null;
            ui.swap(view, list);
            view.innerHTML = '';
            if (napLai) tai();
        }

        L.keHoach(kh, cfg.keHoach).then(function () { tai(1); });
        if (window.jQuery) jQuery(kh).on('select2:select select2:clear', function () { tai(1); });
        list.addEventListener('click', function (ev) {
            var t = ev.target;
            if (t.closest('[data-a="search"]')) { tai(1); return; }
            var m = t.closest('[data-lv-mo]');
            if (m) { mo(m.getAttribute('data-lv-mo')); return; }
            var x = t.closest('[data-lv-xn]');
            if (x && cfg.onXacNhan) { var r = hang(x.getAttribute('data-lv-xn')); if (r) cfg.onXacNhan(r, ctx); return; }
            var tl = t.closest('[data-lv-tool]');
            if (tl && cfg.onTool) cfg.onTool(tl.getAttribute('data-lv-tool'), ctx);
        });
        return ctx;
    };

    /* ---------- Biểu mẫu thêm / sửa TRONG TRANG (BO-CUC luật 1) ---------- */
    /**
     * Lớp bọc ums.pat.formTrang cho biểu mẫu mở TRONG khung chi tiết của L.man: o như formTrang (host = khung.host) +
     * o.nutNgoai = khung.act (vùng nút đầu trang của khung chi tiết): các nút ở đó ("Lưu toàn bộ", "Tạo quyết định"… — trừ "Đóng",
     * tầng chung tự ẩn theo luật 18) thao tác trên phần đang bị thay chỗ nên ẩn khi biểu mẫu mở, đóng thì hiện lại.
     * (Biểu mẫu lồng trong một formTrang khác thì gọi thẳng pat.formTrang — tầng chung tự ẩn dãy nút của khung ngoài.)
     */
    L.bieuMau = function (o) {
        var an = o.nutNgoai ? Array.prototype.filter.call(o.nutNgoai.children, function (x) { return !x.hidden && !x.hasAttribute('data-lv-dong'); }) : [];
        an.forEach(function (x) { x.hidden = true; });
        var dong = o.onClose;
        return pat.formTrang(Object.assign({}, o, { onClose: function () { an.forEach(function (x) { x.hidden = false; }); if (dong) dong(); } }));
    };

    /* ---------- "Tạo quyết định" (biểu mẫu trong trang) / hộp "Duyệt" (modalQuyetDinh, modalDuyet) ------------ */
    function khoiDeTai(r) {
        return pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            '<div class="lv-tt"><span>Tình trạng:</span> ' + (e(r.BV_XACNHAN_GIAODETAI_TEN) ? ui.badge(e(r.BV_XACNHAN_GIAODETAI_TEN), 'ok') : '<span class="ums-u-faint">Chưa có</span>') + '</div>' +
            '<div class="ums-grid ums-grid--2 lv-kv">' + kv('Mã số', e(r.QLSV_NGUOIHOC_MASO)) + kv('Họ tên', L.hoTen(r)) +
            kv('Lớp', e(r.QLSV_NGUOIHOC_LOP) || e(r.DAOTAO_LOPQUANLY_TEN)) + kv('Chương trình', e(r.DAOTAO_TOCHUCCHUONGTRINH_TEN) || e(r.DAOTAO_CHUONGTRINH_TEN)) +
            kv('Tên đề tài tiếng Việt', e(r.BV_KEHOACH_DETAI_TEN)) + kv('Tên đề tài tiếng Anh', e(r.BV_KEHOACH_DETAI_TENTA)) + '</div>' });
    }
    /**
     * "Tạo quyết định": nút Lưu (btnSave_QuyetDinh) KHÔNG được gắn xử lý ở bất kỳ tệp gốc nào → giữ nút, khoá.
     * Gốc đổ nhầm Ngày QĐ vào ô Số QĐ → đổ đúng Số QĐ.
     * Biểu mẫu mở TRONG TRANG, thay chỗ thân khung chi tiết (khung = { host, act } của L.man).
     */
    L.hopQuyetDinh = function (r, khung) {
        var dlg = L.bieuMau({ host: khung.host, nutNgoai: khung.act, title: 'Tạo quyết định', icon: 'fa-file-signature', cols: 1, body: khoiDeTai(r) +
            '<div class="ums-grid ums-grid--2">' +
            '<div class="ums-field"><label class="ums-field__label">Số QĐ</label><input class="ums-input" data-qd="so" value="' + esc(e(r.QLSV_QUYETDINH_SOQD)) + '"></div>' +
            '<div class="ums-field"><label class="ums-field__label">Ngày QĐ</label><input class="ums-input" data-date data-qd="ngay" value="' + esc(e(r.QLSV_QUYETDINH_NGAYQD)) + '"></div>' +
            '<div class="ums-field" style="grid-column:1 / -1"><label class="ums-field__label">Files</label><div class="ums-u-faint ums-u-fz13">Chưa có xử lý lưu tệp ở bản gốc.</div></div>' +
            '<div class="ums-field" style="grid-column:1 / -1"><label class="ums-field__label">Nội dung</label><textarea class="ums-input" rows="3" data-qd="nd">' + esc(e(r.QLSV_QUYETDINH_LYDO)) + '</textarea></div>' +
            '</div>',
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function () { return false; } }] });
        var luu = dlg.el.querySelector('.ums-panel__tools [data-ft="0"]');
        if (luu) { luu.disabled = true; luu.title = 'Bản gốc chưa có xử lý lưu quyết định'; }
        return dlg;
    };
    /** "Duyệt giao đề tài": gốc là khung mẫu (Lớp "T5K6", nội dung chép cứng) → hiện dữ liệu thật; "Duyệt" → onDuyet */
    L.hopDuyet = function (r, onDuyet) {
        return ui.dialog({ title: 'Duyệt giao đề tài', icon: 'fa-list-check', size: 'lg', body: khoiDeTai(r) +
            '<div class="ums-grid ums-grid--2 lv-kv">' + kv('Số QĐ', e(r.QLSV_QUYETDINH_SOQD)) + kv('Ngày QĐ', e(r.QLSV_QUYETDINH_NGAYQD)) + '</div>' +
            kv('Nội dung', e(r.QLSV_QUYETDINH_LYDO)),
            buttons: [{ text: 'Duyệt', kind: 'save', mod: 'save', onClick: function (d) { d.close(); onDuyet(); } }] });
    };

    /** Thêm nút vào vùng nút đầu trang của khung chi tiết — NGAY SAU "Đóng" (Đóng luôn ngoài cùng bên trái;
        thứ tự tương đối giữa các nút thêm vào giữ như trước: nút thêm sau đứng trước) */
    L.nut = function (khung, html) {
        var dong = khung.act.querySelector('[data-lv-dong]');
        if (dong) dong.insertAdjacentHTML('afterend', html); else khung.act.insertAdjacentHTML('afterbegin', html);
    };
})();
