/* =========================================================================
   ApisNCKH / xacnhankekhai — XÁC NHẬN KÊ KHAI "đề tài sinh viên", "giảng dạy sau đại học", "hướng dẫn sau
   đại học": ums.nckhHDxn.*  (tiền tố _hd_ — module có nhiều nhóm cùng làm)
   Bản gốc: ApisNCKH/Modules/xacnhankekhai/script/{detaisinhvien,giangdaysaudaihoc,huongdansaudaihoc}.js — ba tệp chép
   nhau: MỘT cột (thanh "Tìm kiếm" Đơn vị thành viên · Thành viên đăng ký · Tình trạng · từ khoá · Tìm kiếm · Xuất
   báo cáo; bảng đầy trang có cột nút xác nhận nhanh), bấm tên → khung kê khai CHỈ XEM thay chỗ danh sách, nút
   "Xác nhận sản phẩm" mở hộp (nội dung · các nút xác nhận · lịch sử).
   ---------------------------------------------------------------------------
   Lời gọi dùng chung (chép nguyên):
     Nút xác nhận   NCKH_XacNhanTheoNguoiDung/LayDMXacNhanTheoNguoiDung GET strChucNang_Id, strNguoiThucHien_Id
                    (detaisinhvien, giangdaysaudaihoc) | danh mục NCKH.XNKK sắp HESO1 (huongdansaudaihoc);
                    bỏ mục MA = XNKKCHUAKHAI.
     Lưu xác nhận   NCKH_SP_XacNhanKeKhai/ThemMoi POST strId '', strSanPham_Id, strNoiDung, strTinhTrang_Id,
                    strNguoiXacnhan_Id (edu.extend.save_XacNhanSanPham — Core/systemextend.js:2649)
     Lịch sử        NCKH_SP_XacNhanKeKhai/LayDanhSach GET strTuKhoa '', strSanPham_Id, strTinhTrang_Id '',
                    strNguoiThucHien_Id '', pageIndex 1, pageSize 100000 (cột TINHTRANG_TEN, NOIDUNG,
                    NGUOIXACNHAN_TENDAYDU, NGAYTAO_DD_MM_YYYY)
     Đơn vị         edu.system.getList_CoCauToChuc (ums.ref.coCauToChuc)
     Thành viên     NS_HoSoV2/LayDanhSach GET strTuKhoa '', pageIndex 1, pageSize 100000, strDaoTao_CoCauToChuc_Id
                    = đơn vị, strNguoiThucHien_Id '', dLaCanBoNgoaiTruong 0 — nạp lại khi đổi đơn vị
     Tệp            NCKH_Files (chỉ xem)
     Báo cáo        edu.system.getList_MauImport → ums.report.mount (không có Import)
   Khác bản gốc (tự chốt — ghi ở báo cáo chuyển đổi):
     · Ô "Tình trạng": detaisinhvien / giangdaysaudaihoc gốc CHÚ THÍCH BỎ dòng nạp (ô luôn chỉ có "Tất cả" mà vẫn gửi
       strTinhTrangXacNhan_Id) → nạp NCKH.XNKK như huongdansaudaihoc.
     · Đơn vị → Thành viên: đổi / xoá đơn vị thì xoá trắng Thành viên và nạp lại; KHÔNG khoá (nhãn "Tất cả …" = lọc
       tuỳ chọn, như gốc nạp sẵn mọi thành viên).
     · Hộp xác nhận nhanh (nút nhỏ trên dòng) và hộp "Xác nhận sản phẩm": xác nhận xong NẠP LẠI sau khi máy chủ trả
       (gốc chờ cứng 500ms). Khung chi tiết gốc là biểu mẫu nhập để trống nút Lưu → nay CHỈ XEM (.ums-kv + bảng).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var X = ums.nckhHDxn = ums.nckhHDxn || {};
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function cn() { return (ums.state && ums.state.chucNangId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : String(v); }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function icon(c) { return ums.iconFA4 ? ums.iconFA4(c || 'fa-solid fa-circle-check') : (c || 'fa-solid fa-circle-check'); }
    X.e = e; X.arr = arr;
    X.hoTen = function (x) { return (e(x.HODEM) + ' ' + e(x.TEN)).trim() + (e(x.MASO) ? ' - ' + e(x.MASO) : ''); };
    X.g = function (action, o) { return ums.api.call(Object.assign({ action: action, method: 'GET' }, o || {})).then(function (r) { return arr(r.data); }); };

    /** Phân loại NCKH.VTHDGD có MA = ma (genCombo_PhanLoai gốc) → Promise<ID> */
    X.phanLoai = function (ma) {
        return ums.api.dm('NCKH.VTHDGD').then(function (d) {
            var x = d.filter(function (r) { return r.MA === ma; })[0];
            return x ? x.ID : '';
        }).catch(function (err) { ums.api.handle(err, 'phân loại'); return ''; });
    };

    /* ---------- Khối xem chỉ đọc ------------------------------------------ */
    /** Các dòng "nhãn : giá trị" — dòng ĐẦU (tên sản phẩm) tự in đậm (BO-CUC luật 13) */
    X.kv = function (tieuDe, dong) {
        return '<div class="ums-legend">' + esc(tieuDe) + '</div><div>' + dong.map(function (d) {
            return '<div class="ums-kv"><span>' + esc(d[0]) + '</span><b>' + esc(e(d[1])) + '</b></div>';
        }).join('') + '</div>';
    };
    /** Khối bảng: tiêu đề nhóm + chỗ vẽ bảng (sát mép khung) */
    X.khoi = function (tieuDe, z) { return '<div class="ums-legend">' + esc(tieuDe) + '</div><div class="hdxn-bang" data-hdxn="' + z + '"></div>'; };
    X.bang = function (host, z, p, cot) {
        var h = host.querySelector('[data-hdxn="' + z + '"]');
        if (!h) return Promise.resolve();
        h.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return Promise.resolve(p).then(function (rows) { ui.table({ el: h, rows: rows, columns: cot, empty: 'Không có dữ liệu' }); })
            .catch(function (err) { h.innerHTML = ui.fail(err.message); });
    };
    X.tep = function (host, id) {
        var h = host.querySelector('[data-hdxn="tep"]');
        if (h) ums.files.mount(h, { api: 'NCKH_Files', readonly: true }).load(id);
    };
    /** Nguồn kinh phí (chỉ xem) — NCKH_SP_NguonKinhPhi/LayDanhSach */
    X.kinhPhi = function (host, id) {
        return X.bang(host, 'kp', X.g('NCKH_SP_NguonKinhPhi/LayDanhSach', { strSanPham_Id: id, pageIndex: 1, pageSize: 10000 }), [
            { title: 'Tên nguồn', prop: 'NGUONKINHPHI_TEN' },
            { title: 'Số tiền', cls: 'is-right is-nowrap', render: function (r) { return esc(ui.money(String(e(r.SOTIEN)).replace(/,/g, ''))); } },
            { title: 'Đơn vị', prop: 'DONVITINH_TEN', cls: 'is-nowrap' }]);
    };

    /* ---------- Hộp "Xác nhận sản phẩm" (modal_XacNhan gốc) ----------------- */
    X.hopXacNhan = function (sp, nut, onDone) {
        var dlg = ui.dialog({ title: 'Xác nhận sản phẩm: ' + e(sp.ten), icon: 'fa-circle-check', size: 'lg', body:
            ui.field('Nội dung xác nhận', '<input class="ums-input" data-hdxn="nd" autocomplete="off">') +
            '<div class="ums-legend ums-legend--cach">Chọn xác nhận</div>' +
            '<div class="hdxn-nut">' + (nut.length ? nut.map(function (b) {
                return '<button type="button" class="hdxn-nut__nut" data-hdxn-tt="' + esc(b.ID) + '"><i class="' + esc(icon(b.THONGTIN1)) + '"' +
                    (b.THONGTIN2 ? ' style="' + esc(b.THONGTIN2) + '"' : '') + '></i><span>' + esc(e(b.TEN)) + '</span></button>';
            }).join('') : ui.empty('Chưa khai báo trạng thái xác nhận')) + '</div>' +
            '<div class="ums-legend ums-legend--cach">Lịch sử xác nhận</div><div data-hdxn="ls"></div>' });
        var b = dlg.body;
        X.bang(b, 'ls', X.g('NCKH_SP_XacNhanKeKhai/LayDanhSach', { strTuKhoa: '', strSanPham_Id: sp.id, strTinhTrang_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000 }), [
            { title: 'Xác nhận', prop: 'TINHTRANG_TEN' }, { title: 'Nội dung', prop: 'NOIDUNG' },
            { title: 'Người xác nhận', prop: 'NGUOIXACNHAN_TENDAYDU' }, { title: 'Ngày', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap', width: '110px' }]);
        b.addEventListener('click', function (ev) {
            var t = ev.target.closest('[data-hdxn-tt]');
            if (!t) return;
            var nd = b.querySelector('[data-hdxn="nd"]').value.trim();
            dlg.close();
            X.luu(sp.id, t.getAttribute('data-hdxn-tt'), nd).then(function (ok) { if (ok && onDone) onDone(); });
        });
        return dlg;
    };
    /** Lưu một lượt xác nhận → Promise<boolean> */
    X.luu = function (spId, tt, nd) {
        return ums.api.call({ action: 'NCKH_SP_XacNhanKeKhai/ThemMoi', method: 'POST', strId: '', strSanPham_Id: spId, strNoiDung: nd,
            strTinhTrang_Id: tt, strNguoiXacnhan_Id: uid() })
            .then(function () { ui.toast('Xác nhận thành công', 'ok'); return true; })
            .catch(function (err) { ums.api.handle(err, 'xác nhận'); return false; });
    };

    /* =====================================================================
       X.man(root, cfg) — khung màn xác nhận. cfg:
         tieuDe, dsTieuDe, icon, ctl, paged (phân trang máy chủ; false = pageSize 1000000 gốc, chia trang ở máy khách),
         nut: 'nguoiDung' | 'dm', choNap (Promise), ds(f) → tham số danh sách (f = { dv, tv, tt, q }),
         tenCot, ten(r), cot: [cột giữa], baoCao(add, f), tieuDeCT, chiTiet(r, body), sauVe(rows, host)
       ===================================================================== */
    X.man = function (root, cfg) {
        var page = 1, size = (ums.cfg && ums.cfg.behavior && ums.cfg.behavior.pageSize) || 10, rows = [], tong = 0, nut = [], dang = null;
        root.innerHTML = pat.page(cfg.tieuDe, '<div data-hdxn="bc"></div>') +
            '<div data-hdxn="ds">' +
            pat.filterBar([{ key: 'dv', type: 'select', label: 'Tất cả đơn vị thành viên' }, { key: 'tv', type: 'select', label: 'Tất cả thành viên đăng ký' },
                { key: 'tt', type: 'select', label: 'Tất cả tình trạng' }, { key: 'q', label: 'Nhập từ khóa tìm kiếm' }]) +
            pat.panel({ title: cfg.dsTieuDe, icon: 'fa-list-ul', count: 'hdxn-dem', flush: true, zone: 'hdxn-bang',
                tools: ui.btn('reload', { attr: { 'data-hdxn-a': 'tai' } }) }) +
            '</div><div data-hdxn="ct" hidden></div>';
        function F(k) { return root.querySelector('[data-f="' + k + '"]'); }
        var vDs = root.querySelector('[data-hdxn="ds"]'), vCt = root.querySelector('[data-hdxn="ct"]');
        var bangEl = root.querySelector('[data-z="hdxn-bang"]'), demEl = root.querySelector('[data-z="hdxn-dem"]');
        var actions = root.querySelector('.ums-page__actions');
        ui.enhance(root);
        function f() { return { dv: F('dv').value, tv: F('tv').value, tt: F('tt').value, q: F('q').value.trim() }; }

        /* Ô lọc */
        ums.ref.coCauToChuc({ strCCTC_Loai_Id: '', strCCTC_Cha_Id: '', iTrangThai: 1 })
            .then(function (d) { pat.fill(F('dv'), d, { head: 'Tất cả đơn vị thành viên' }); }).catch(function (err) { ums.api.handle(err, 'đơn vị'); });
        /* Đơn vị → Thành viên: KHOÁ Thành viên tới khi chọn Đơn vị (luật cha → con; thống nhất với ums.nckhGT 2026-09-27) */
        function napTV() {
            var id = F('dv').value;
            if (!id) { pat.fill(F('tv'), [], { head: 'Tất cả thành viên đăng ký' }); return Promise.resolve(); }
            return X.g('NS_HoSoV2/LayDanhSach', { strTuKhoa: '', pageIndex: 1, pageSize: 100000, strDaoTao_CoCauToChuc_Id: id,
                strNguoiThucHien_Id: '', dLaCanBoNgoaiTruong: 0 })
                .then(function (d) {
                    if (F('dv').value !== id) return;
                    pat.fill(F('tv'), d, { head: 'Tất cả thành viên đăng ký', name: function (r) { return e(r.HOTEN) + ' - ' + e(r.MASO); } });
                })
                .catch(function (err) { ums.api.handle(err, 'thành viên'); });
        }
        pat.chain([F('dv'), F('tv')]);
        ums.api.dm('NCKH.XNKK', 'HESO1').then(function (d) { pat.fill(F('tt'), d, { head: 'Tất cả tình trạng' }); }).catch(function (err) { ums.api.handle(err, 'tình trạng'); });
        if (window.jQuery) jQuery(F('dv')).on('select2:select select2:clear', function () {
            F('tv').value = ''; jQuery(F('tv')).trigger('change.select2'); napTV();
        });
        F('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(1); } });

        /* Nút xác nhận (dùng cho cột "Xác nhận" và hộp "Xác nhận sản phẩm") */
        var nutP = (cfg.nut === 'dm' ? ums.api.dm('NCKH.XNKK', 'HESO1')
            : X.g('NCKH_XacNhanTheoNguoiDung/LayDMXacNhanTheoNguoiDung', { strChucNang_Id: cn(), strNguoiThucHien_Id: uid() }))
            .then(function (d) { nut = arr(d).filter(function (x) { return x.MA !== 'XNKKCHUAKHAI'; }); })
            .catch(function (err) { ums.api.handle(err, 'danh mục xác nhận'); });

        /* Báo cáo */
        ums.report.mount(root.querySelector('[data-hdxn="bc"]'), { import: false, collect: function (add) { cfg.baoCao(add, f()); } });

        /* Danh sách */
        function tai(p) {
            if (p) page = p;
            var call = Object.assign({ action: cfg.ctl + '/LayDanhSach', method: 'GET' }, cfg.ds(f()));
            if (cfg.paged) { call.pageIndex = page; call.pageSize = size; }
            if (!rows.length) bangEl.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return ums.api.call(call).then(function (r) {
                rows = arr(r.data);
                tong = cfg.paged ? (Number(r.pager) || rows.length) : rows.length;
                if (!cfg.paged && (page - 1) * size >= tong) page = 1;
                ve();
            }).catch(function (err) { rows = []; bangEl.innerHTML = ui.fail(err.message); ums.api.handle(err, cfg.dsTieuDe); });
        }
        function ve() {
            var shown = cfg.paged ? rows : rows.slice((page - 1) * size, page * size);
            demEl.textContent = '(' + tong + ')';
            ui.table({ el: bangEl, rows: shown, empty: 'Không tìm thấy dữ liệu', columns: [
                { title: cfg.tenCot, cls: 'hdxn-tencot', render: function (r) { return '<button type="button" class="ums-link hdxn-ten" data-hdxn-ct="' + esc(r.ID) + '">' + esc(cfg.ten(r)) + '</button>'; } }
            ].concat(cfg.cot, [
                { title: 'File đính kèm', render: function (r) { return '<div data-hdxn-f="' + esc(r.ID) + '"></div>'; } },
                { title: 'Xác nhận', cls: 'is-center', render: function (r) {
                    return '<div class="hdxn-nho">' + nut.map(function (b) {
                        return '<button type="button" class="ums-iconbtn" data-hdxn-nho="' + esc(r.ID) + '" data-tt="' + esc(b.ID) + '" title="' + esc(e(b.TEN)) + '">' +
                            '<i class="' + esc(icon(b.THONGTIN1)) + '"' + (b.THONGTIN2 ? ' style="' + esc(b.THONGTIN2) + '"' : '') + '></i></button>';
                    }).join('') + '</div>';
                } },
                { title: 'Xác nhận cuối cùng', cls: 'is-center is-nowrap', render: function (r) {
                    return e(r.KETQUAXACNHAN_TEN) ? '<span class="hdxn-kq" title="' + esc(e(r.KETQUAXACNHAN_TEN)) + '"><i class="' + esc(icon(r.KETQUAXACNHAN_THONGTIN1)) + '"' +
                        (r.KETQUAXACNHAN_THONGTIN2 ? ' style="' + esc(r.KETQUAXACNHAN_THONGTIN2) + '"' : '') + '></i> ' + esc(e(r.KETQUAXACNHAN_TEN)) + '</span>' : '';
                } },
                { title: 'Nội dung xác nhận', prop: 'KETQUAXACNHAN_NOIDUNG' }
            ]), page: { index: page, size: size, total: tong, onChange: function (p) { if (cfg.paged) tai(p); else { page = p; ve(); } },
                onSize: function (n) { size = n; page = 1; if (cfg.paged) tai(1); else ve(); } } });
            shown.forEach(function (r) {
                var h = bangEl.querySelector('[data-hdxn-f="' + (window.CSS && CSS.escape ? CSS.escape(r.ID) : r.ID) + '"]');
                if (h) ums.files.mount(h, { api: 'NCKH_Files', readonly: true }).load(r.ID);
            });
            if (cfg.sauVe) cfg.sauVe(shown, bangEl);
        }
        function timDong(id) { return rows.filter(function (r) { return e(r.ID) === e(id); })[0]; }

        /* Khung chi tiết (chỉ xem) */
        function moCT(r) {
            dang = r;
            vCt.innerHTML = pat.panel({ title: cfg.tieuDeCT, icon: 'fa-file-lines',
                tools: ui.btn('close', { attr: { 'data-hdxn-a': 'dong' } }) + ui.btn('confirm', { text: 'Xác nhận sản phẩm', attr: { 'data-hdxn-a': 'xn' } }),
                body: '<div data-hdxn="than"></div>' });
            cfg.chiTiet(r, vCt.querySelector('[data-hdxn="than"]'));
            if (actions) actions.hidden = true;
            ui.swap(vDs, vCt);
        }
        function dongCT() {
            dang = null;
            if (actions) actions.hidden = false;
            ui.swap(vCt, vDs);
        }
        root.addEventListener('click', function (ev) {
            var a = ev.target.closest('[data-hdxn-a]');
            if (a) {
                var k = a.getAttribute('data-hdxn-a');
                if (k === 'tai') tai();
                else if (k === 'dong') dongCT();
                else if (k === 'xn' && dang) X.hopXacNhan({ id: dang.ID, ten: cfg.ten(dang) }, nut, function () { dongCT(); tai(); });
                return;
            }
            if (ev.target.closest('[data-a="search"]')) { tai(1); return; }
            var c = ev.target.closest('[data-hdxn-ct]');
            if (c) { var r = timDong(c.getAttribute('data-hdxn-ct')); if (r) moCT(r); return; }
            var n = ev.target.closest('[data-hdxn-nho]');
            if (n) {
                var sp = timDong(n.getAttribute('data-hdxn-nho'));
                if (sp) hoiNhanh(sp, n.getAttribute('data-tt'), n.getAttribute('title'));
            }
        });
        /* Xác nhận nhanh trên dòng: "Xác nhận <trạng thái> cho sản phẩm <tên>!" + ô Mô tả xác nhận */
        function hoiNhanh(sp, tt, tenTT) {
            ui.dialog({ title: 'Xác nhận', icon: 'fa-circle-check', size: 'md', body:
                '<p>Xác nhận <b>' + esc(tenTT) + '</b> cho sản phẩm <b>' + esc(cfg.ten(sp)) + '</b>!</p>' +
                ui.field('Mô tả xác nhận', '<input class="ums-input" data-hdxn="mota" placeholder="Mô tả xác nhận" autocomplete="off">'),
                buttons: [{ text: 'Đồng ý', kind: 'confirm', onClick: function (dlg) {
                    var mt = dlg.body.querySelector('[data-hdxn="mota"]').value.trim();
                    X.luu(sp.ID, tt, mt).then(function (ok) { if (ok) tai(); });
                } }] });
        }

        Promise.all([nutP, cfg.choNap]).then(function () { tai(1); });
        return { tai: tai };
    };
})();

/* =========================================================================
   Giảng dạy / Hướng dẫn sau đại học — cấu hình chung (NCKH_SP_HuongDan_GiangDay, phân loại GIANGDAY / HUONGDAN)
   Bản gốc: ApisNCKH/Modules/xacnhankekhai/script/{giangdaysaudaihoc,huongdansaudaihoc}.js
     LayDanhSach GET strDaoTao_CoCauToChuc_Id, strThanhVien_Id, strDonViCuaThanhVien_Id, strTuKhoa, strTinhTrangXacNhan_Id,
       strPhanLoai_Id, strNguoiThucHien_Id '', pageIndex 1, pageSize 1000000 (chia trang ở máy khách)
     Chi tiết: NCKH_SP_HDGD_GiangVien_GD | _HD/LayDanhSach, NCKH_SP_HDGD_SinhVien/LayDanhSach (strNCKH_SP_HD_GD_Id),
       dòng LATHANHVIENCUATRUONG = 0 bỏ qua như gốc. Giảng viên giảng dạy: hiện NOIDUNGGIANGDAY dưới "Thời gian" (khớp
       chỗ tráo khi lưu ở màn kê khai — xem _hd_chung.js của quanlysanpham).
     Nút xác nhận: giảng dạy NCKH_XacNhanTheoNguoiDung (như gốc); hướng dẫn danh mục NCKH.XNKK (như gốc).
   ========================================================================= */
(function () {
    'use strict';
    var X = ums.nckhHDxn, ui = ums.ui, e = X.e, esc = ui.esc;
    X.sauDaiHoc = function (root, loai) {
        var gd = loai === 'GIANGDAY', plId = '';
        var pl = X.phanLoai(loai).then(function (v) { plId = v; });
        function trong(d) { return d.filter(function (x) { return e(x.LATHANHVIENCUATRUONG) !== '0'; }); }
        var ten = { title: 'Họ tên', render: function (x) { return esc(X.hoTen(x)); } };
        return X.man(root, {
            tieuDe: gd ? 'Giảng dạy sau đại học' : 'Hướng dẫn sau đại học', dsTieuDe: gd ? 'Giảng dạy sau đại học' : 'Hướng dẫn sau đại học',
            ctl: 'NCKH_SP_HuongDan_GiangDay', paged: false, nut: gd ? 'nguoiDung' : 'dm', choNap: pl,
            tenCot: gd ? 'Tên học phần' : 'Tên đề tài', ten: function (r) { return e(r.TENDETAI_GIANGDAY); },
            ds: function (f) {
                return { strDaoTao_CoCauToChuc_Id: f.dv, strThanhVien_Id: f.tv, strDonViCuaThanhVien_Id: f.dv, strTuKhoa: f.q,
                    strTinhTrangXacNhan_Id: f.tt, strPhanLoai_Id: plId, strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 };
            },
            cot: [
                { title: gd ? 'Thời gian giảng dạy' : 'Thời gian hướng dẫn', cls: 'is-center is-nowrap', render: function (r) {
                    return '<i>' + esc(e(r.THOIGIANBATDAU) + '-' + e(r.THOIGIANKETTHUC)) + '</i>'; } },
                { title: 'Năm nghiệm thu', prop: 'NAMNGHIEMTHU', cls: 'is-center' },
                { title: 'Giảng viên', prop: 'GIANGVIEN_HD_GD' },
                gd ? { title: 'Nội dung', prop: 'NOIDUNG_HD_GD' } : { title: 'Vai trò giảng viên', prop: 'VAITRO_HD_GD' }
            ],
            baoCao: function (add, f) {
                add('strTuKhoa', f.q); add('strDonViCuaThanhVien_Id', f.dv); add('strThanhVien_Id', f.tv); add('strPhanLoai_Id', plId);
                add('strNguoiThucHien_Id', ''); add('strTinhTrangXacNhan_Id', f.tt); add('strDaoTao_CoCauToChuc_Id', f.dv);
            },
            tieuDeCT: gd ? 'Kê khai giảng dạy sau đại học' : 'Kê khai hướng dẫn sau đại học',
            chiTiet: function (r, b) {
                b.innerHTML = X.kv(gd ? 'Khởi tạo giảng dạy sau đại học' : 'Khởi tạo hướng dẫn sau đại học', [
                        [gd ? 'Tên học phần' : 'Tên đề tài', r.TENDETAI_GIANGDAY], [gd ? 'Tên lớp dạy' : 'Tên học viên/Tên nghiên cứu sinh', r.MOTA],
                        ['Từ tháng', r.THOIGIANBATDAU], ['Đến tháng', r.THOIGIANKETTHUC], ['Năm nghiệm thu', r.NAMNGHIEMTHU]]) +
                    '<div class="ums-legend">Nội dung minh chứng</div><div data-hdxn="tep"></div>' +
                    X.khoi(gd ? 'Giảng viên' : 'Giảng viên hướng dẫn', 'gv') + X.khoi('Học viên tham gia', 'hv');
                X.tep(b, r.ID);
                X.bang(b, 'gv', X.g(gd ? 'NCKH_SP_HDGD_GiangVien_GD/LayDanhSach' : 'NCKH_SP_HDGD_GiangVien_HD/LayDanhSach', { strNCKH_SP_HD_GD_Id: r.ID }).then(trong),
                    gd ? [ten, { title: 'Thời gian', prop: 'NOIDUNGGIANGDAY' }, { title: 'Nội dung', prop: 'THOIGIAN' }] : [ten, { title: 'Vai trò', prop: 'VAITRO_TEN' }]);
                X.bang(b, 'hv', X.g('NCKH_SP_HDGD_SinhVien/LayDanhSach', { strNCKH_SP_HD_GD_Id: r.ID }).then(trong), [ten]);
            }
        });
    };
})();
