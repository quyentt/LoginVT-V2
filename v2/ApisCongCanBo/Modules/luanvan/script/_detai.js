/* =========================================================================
   luanvan — GIAO ĐỀ TÀI và DUYỆT ĐỀ TÀI: ums.lv.deTai(root, 'giaodetai' | 'duyetdetai')
   Bản gốc: giaodetai.js, duyetdetai.js (chép nhau 82%).
   ---------------------------------------------------------------------------
   Danh sách người học: LVLA_BV_KeHoach/LayDSBV_Kehoach_NguoiHoc GET strTuKhoa '', strBV_KeHoach_Id, phân trang;
     kế hoạch LayDSBV_KeHoach (dHieuLuc -1). Cột chép đúng ánh xạ của gốc (xem "Chờ nghiệp vụ").
   Biểu mẫu thêm / sửa (kho đề tài, Đề tài, Người hướng dẫn, Giao đề tài, Tạo quyết định) mở TRONG TRANG — pat.formTrang / ums.lv.bieuMau.
   Chi tiết một người học (bản gốc modal "Chi tiết đề tài"): các đề tài đã giao
     LayDSBV_KH_NG_GiaoDeTai GET strBV_KeHoach_Id, strQLSV_NguoiHoc_Id, strDaoTao_ChuongTrinh_Id.
   giaodetai:
     · "Thêm đề tài - bản giao đề tài cho Người học chọn": đề tài chưa giao (pkg_bv_kehoach.LayDSBV_KeHoach_DeTai_ChuaGiao,
       theo kế hoạch ĐANG CHỌN ở thanh lọc — như gốc) + lý do → Them_BV_KH_NG_GiaoDeTai (strId rỗng).
     · "Thêm người hướng dẫn" (các đề tài đã đánh dấu) / sửa một đề tài: lý do điều chỉnh + lưới người hướng dẫn
       (cán bộ · vai trò HUONGDAN · tệp). Lưu: Sua_BV_KH_NG_GiaoDeTai từng đề tài, rồi lưu lưới vào TỪNG đề tài
       (Them_/Sua_BV_KeHoach_NH_GiaoDT_HD, strBV_Kehoach_NH_GiaoDT_Id = id đề tài giao).
     · "Xóa": Xoa_BV_KH_NG_GiaoDeTai từng đề tài đã đánh dấu.
     · "Thêm đề tài" (đầu danh sách): kho đề tài của kế hoạch — LayDSBV_KeHoach_DeTai; Them_/Sua_BV_KeHoach_DeTai
       (strMaDeTai, strTenDeTaiTiengViet, strTenDeTaiTiengAnh); Xoa_BV_KeHoach_DeTai strIds.
   duyetdetai:
     · Mỗi đề tài: "Hướng dẫn" (chỉ xem), "Quyết định" (ums.lv.hopQuyetDinh — nút Lưu khoá), "Duyệt" (ums.lv.hopDuyet
       → Xác nhận LayDSBV_XacNhan_GiaoDeTai tham số tên strsanpham_Id (chữ thường, như gốc) /
       Them_BV_XacNhan_GiaoDeTai · BV.TINHTRANG.XACNHANGIAODETAI).
   Khác bản gốc (ghi ở can-quyet.js):
     · giaodetai "Tải file": gắn tải tệp nhưng không có lời lưu → giữ nút, khoá.
     · duyetdetai "Thêm" mở hộp không có nút lưu (d-none) và ô đề tài không nạp; "Xóa" đọc ô đánh dấu mà bảng không có
       → hai nút giữ, khoá.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, L = ums.lv, e = L.e;
    function esc(s) { return ui.esc(s); }
    var KH = L.KH;

    L.deTai = function (root, kieu) {
        var giao = kieu === 'giaodetai';
        var ctxMan = null;

        /* ---------- Kho đề tài của kế hoạch (modalThemDeTai + modalDSDeTai) ---------- */
        function khoDeTai(ctx) {
            var khId = ctx.kh();
            if (!khId) { ui.toast('Bạn cần chọn kế hoạch', 'warn'); return; }
            // MÀN CON trong trang (BO-CUC luật 1): kho thay chỗ cả màn; biểu mẫu "Đề tài" là tầng hai, thay chỗ thân kho
            var dlg = pat.formTrang({ host: ctx.root, title: 'Danh sách đề tài', icon: 'fa-books', cols: 1, body:
                '<div class="ums-row ums-u-mb-2" style="justify-content:flex-end">' +
                ui.btn('add', { text: 'Thêm', attr: { 'data-kho': 'them' } }) + '</div><div data-kho="bang"></div>',
                xoa: { chon: 'input[data-ck]', onClick: function () { xoa(); } } });
            var b = dlg.body, bang = b.querySelector('[data-kho="bang"]'), ds = [];
            function tai() {
                bang.innerHTML = L.DANG_TAI;
                L.g(KH + 'LayDSBV_KeHoach_DeTai', { strTuKhoa: '', strBV_KeHoach_Id: khId, strNguoiThucHien_Id: L.uid(), pageIndex: 1, pageSize: 100000 })
                    .then(function (r) {
                        ds = L.arr(r.data);
                        ui.table({ el: bang, rows: ds, empty: 'Kế hoạch chưa có đề tài', columns: [
                            { title: 'Mã số', prop: 'MADETAI', cls: 'is-nowrap' }, { title: 'Tên đề tài tiếng việt', prop: 'TENDETAITIENGVIET' },
                            { title: 'Tên đề tài tiếng Anh', prop: 'TENDETAITIENGANH' }, { title: 'Người nhập', prop: 'NGUOICUOI_TAIKHOAN' },
                            { title: 'Ngày nhập', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap' },
                            { title: 'Đã sử dụng', cls: 'is-center', render: function (x) { return x.DASUDUNG ? ui.badge('Đã sử dụng', 'info') : ''; } },
                            { title: 'Sửa', cls: 'is-center', render: function (x) { return ui.iconBtn('edit', x.ID); } },
                            { head: '<input type="checkbox" data-ck="all">', cls: 'is-center', width: '44px', render: function (x) { return '<input type="checkbox" data-ck="' + esc(x.ID) + '">'; } }
                        ] });
                    }).catch(function (err) { bang.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách đề tài'); });
            }
            function sua(x) {
                x = x || {};
                var f = pat.formTrang({ host: b, title: 'Đề tài', icon: 'fa-book', cols: 1, body:
                    '<div class="ums-field"><label class="ums-field__label">Mã số</label><input class="ums-input" data-dt="ma" value="' + esc(e(x.MADETAI)) + '"></div>' +
                    '<div class="ums-field"><label class="ums-field__label">Tên đề tài tiếng việt</label><input class="ums-input" data-dt="vn" value="' + esc(e(x.TENDETAITIENGVIET)) + '"></div>' +
                    '<div class="ums-field"><label class="ums-field__label">Tên đề tài tiếng anh</label><input class="ums-input" data-dt="en" value="' + esc(e(x.TENDETAITIENGANH)) + '"></div>',
                    buttons: [{ text: 'Lưu', kind: 'save', onClick: function (d) {
                        function v(k) { return d.body.querySelector('[data-dt="' + k + '"]').value.trim(); }
                        L.g(KH + (x.ID ? 'Sua_' : 'Them_') + 'BV_KeHoach_DeTai', { strId: e(x.ID), strChucNang_Id: L.chucNang(), strMaDeTai: v('ma'),
                            strTenDeTaiTiengViet: v('vn'), strTenDeTaiTiengAnh: v('en'), strBV_KeHoach_Id: khId, strNguoiThucHien_Id: L.uid() }, true)
                            .then(function () { ui.toast(x.ID ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok'); d.close(); tai(); })
                            .catch(function (err) { ums.api.handle(err, 'lưu đề tài'); });
                        return false;
                    } }] });
                return f;
            }
            b.addEventListener('change', function (ev) {
                if (ev.target.getAttribute('data-ck') === 'all') Array.prototype.forEach.call(bang.querySelectorAll('tbody input[data-ck]'), function (c) { c.checked = ev.target.checked; });
            });
            b.addEventListener('click', function (ev) {
                var ed = ev.target.closest('[data-act="edit"]');
                if (ed) { sua(ds.filter(function (x) { return e(x.ID) === ed.getAttribute('data-id'); })[0]); return; }
                var a = ev.target.closest('[data-kho]');
                if (!a) return;
                if (a.getAttribute('data-kho') === 'them') sua(null);
            });
            function xoa() {
                var ids = Array.prototype.filter.call(bang.querySelectorAll('tbody input[data-ck]:checked'), function () { return true; }).map(function (c) { return c.getAttribute('data-ck'); });
                if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
                ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                    if (!yes) return;
                    ui.batch(ids.map(function (id) { return { action: KH + 'Xoa_BV_KeHoach_DeTai', strChucNang_Id: L.chucNang(), strIds: id, strNguoiThucHien_Id: L.uid() }; }),
                        { title: 'Xoá đề tài', okText: 'Xóa thành công' }).then(tai);
                });
            }
            tai();
        }

        /* ---------- Chi tiết một người học: các đề tài đã giao ---------- */
        function chiTiet(sv, khung, ctx) {
            var h = khung.host, ds = [];
            h.innerHTML = L.thongTin(sv, { deTai: false, quyetDinh: false }) +
                ums.pat.panel({ title: 'Đề tài', icon: 'fa-book', flush: true, zone: 'dt', count: 'dtn', cls: 'lv-khoi', tools: giao
                    ? ui.btn('excel', { text: 'Tải file', icon: 'fa-upload', attr: { disabled: 'disabled', title: 'Bản gốc chưa có xử lý lưu tệp này' } }) +
                      ui.xoaChon('input[data-ck]', { goc: '.ums-panel', attr: { 'data-dt-a': 'xoa' } }) +
                      ui.btn('add', { text: 'Thêm người hướng dẫn', mod: 'out-primary', icon: 'fa-user-plus', attr: { 'data-dt-a': 'hd' } }) +
                      ui.btn('add', { text: 'Thêm đề tài - bản giao đề tài cho Người học chọn', mod: 'out-success', attr: { 'data-dt-a': 'giao' } })
                    : ui.btn('del', { text: 'Xóa', mod: 'out-danger', attr: { disabled: 'disabled', title: 'Bản gốc: bảng không có ô đánh dấu nên nút này không chạy' } }) +
                      ui.btn('add', { text: 'Thêm', attr: { disabled: 'disabled', title: 'Bản gốc: hộp Thêm không có nút lưu' } }) });
            var zDT = h.querySelector('[data-z="dt"]');
            function tai() {
                zDT.innerHTML = L.DANG_TAI;
                return L.g(KH + 'LayDSBV_KH_NG_GiaoDeTai', { strBV_KeHoach_Id: sv.BV_KEHOACH_ID, strQLSV_NguoiHoc_Id: sv.QLSV_NGUOIHOC_ID,
                    strDaoTao_ChuongTrinh_Id: sv.DAOTAO_TOCHUCCHUONGTRINH_ID, strNguoiThucHien_Id: L.uid() }).then(function (r) {
                    ds = L.arr(r.data);
                    h.querySelector('[data-z="dtn"]').textContent = '(' + ds.length + ')';
                    var cot = giao ? [{ title: 'Mã đề tài', prop: 'BV_KEHOACH_DETAI_MADETAI', cls: 'is-nowrap' }] : [];
                    cot = cot.concat([
                        { title: 'Tên đề tài tiếng việt', prop: 'BV_KEHOACH_DETAI_TEN' }, { title: 'Tên đề tài tiếng Anh', prop: 'BV_KEHOACH_DETAI_TENTA' },
                        { title: 'Quyết định', prop: 'QLSV_QUYETDINH_SOQD', cls: 'is-center' }, { title: 'Lý do điều chỉnh', prop: 'LYDODIEUCHINH' },
                        { title: 'Tình trạng duyệt', prop: 'BV_XACNHAN_GIAODETAI_TEN', cls: 'is-center' }]);
                    if (giao) cot.push({ title: 'GVHD', prop: 'THONGTINNGUOIHUONGDAN' },
                        { title: 'Chọn', cls: 'is-center', render: function (x) { return ui.iconBtn('edit', x.ID); } },
                        { head: '<input type="checkbox" data-ck="all">', cls: 'is-center', width: '44px', render: function (x) { return '<input type="checkbox" data-ck="' + esc(x.ID) + '">'; } });
                    else ['hd', 'qd', 'duyet'].forEach(function (k, i) {
                        cot.push({ title: ['Hướng dẫn', 'Quyết định', 'Duyệt'][i], cls: 'is-center', render: function (x) {
                            return '<button type="button" class="ums-btn ums-btn--sm ums-btn--out-primary" data-dt-x="' + k + '" data-id="' + esc(x.ID) + '"><i class="fa-light fa-eye"></i><span>Chi tiết</span></button>';
                        } });
                    });
                    ui.table({ el: zDT, rows: ds, columns: cot, empty: 'Chưa giao đề tài' });
                }).catch(function (err) { zDT.innerHTML = ui.fail(err.message); ums.api.handle(err, 'đề tài'); });
            }
            tai();
            function chon() { return Array.prototype.map.call(zDT.querySelectorAll('tbody input[data-ck]:checked'), function (c) { return c.getAttribute('data-ck'); }); }
            function dong(id) { return ds.filter(function (x) { return e(x.ID) === id; })[0]; }

            /* Biểu mẫu "Người hướng dẫn" (trong trang, thay chỗ thân khung chi tiết) — dsGiao: các đề tài giao; sua: true khi mở từ một dòng (hiện lý do / QĐ / tình trạng) */
            function hopHuongDan(dsGiao, sua) {
                var d0 = dsGiao[0];
                var dlg = L.bieuMau({ host: h, nutNgoai: khung.act, title: 'Người hướng dẫn', icon: 'fa-chalkboard-user', cols: 1, body:
                    L.kv('Đề tài giao', dsGiao.map(function (x) { return e(x.BV_KEHOACH_DETAI_TEN); }).join(' - ')) +
                    (sua ? '<div class="ums-field ums-u-mt-2"><label class="ums-field__label">Lý do điều chỉnh</label><input class="ums-input" data-hd="lydo" value="' +
                        esc(e(d0.LYDODIEUCHINH)) + '"></div>' + L.kv('Quyết định', e(d0.QLSV_QUYETDINH_SOQD)) + L.kv('Tình trạng Duyệt', e(d0.BV_XACNHAN_GIAODETAI_TEN))
                        : '<div class="ums-field ums-u-mt-2"><label class="ums-field__label">Lý do điều chỉnh</label><input class="ums-input" data-hd="lydo" value=""></div>') +
                    '<div class="ums-u-mt-4" data-hd="luoi"></div>',
                    buttons: [{ text: 'Lưu', kind: 'save', onClick: function (dl) {
                        var lyDo = dl.body.querySelector('[data-hd="lydo"]').value.trim();
                        dsGiao.reduce(function (p, x) {
                            return p.then(function () {
                                return L.g(KH + 'Sua_BV_KH_NG_GiaoDeTai', { strId: x.ID, strBV_KeHoach_Id: sv.BV_KEHOACH_ID, strQLSV_NguoiHoc_Id: sv.QLSV_NGUOIHOC_ID,
                                    strDaoTao_ChuongTrinh_Id: sv.DAOTAO_TOCHUCCHUONGTRINH_ID, strLyDoDieuChinh: lyDo, strBV_KeHoach_DeTai_Id: x.BV_KEHOACH_DETAI_ID,
                                    strNguoiThucHien_Id: L.uid() }, true).then(function () { return g.save(x.ID); });
                            });
                        }, Promise.resolve()).then(function () { ui.toast('Cập nhật thành công!', 'ok'); dl.close(); tai(); })
                            .catch(function (err) { ums.api.handle(err, 'lưu người hướng dẫn'); });
                        return false;
                    } }] });
                var g = L.luoiNguoi(dlg.body.querySelector('[data-hd="luoi"]'), { loai: 'HD', sv: sv, tieuDe: 'Người hướng dẫn', nhan: 'Người hướng dẫn',
                    vaiTro: L.vaiTro(sv.PHANLOAI_ID, 'HUONGDAN') });
                if (sua) g.load(d0.ID); else g.clear();
                return dlg;
            }
            /* Biểu mẫu "Giao đề tài" (trong trang) — đề tài chưa giao của kế hoạch đang chọn; lưu xong Ở LẠI để giao tiếp */
            function hopGiao() {
                var dlg = L.bieuMau({ host: h, nutNgoai: khung.act, title: 'Giao đề tài', icon: 'fa-book-bookmark', body:
                    '<div class="ums-field"><label class="ums-field__label">Đề tài giao</label><select class="ums-select" data-gd="dt" data-ph="Chọn đề tài"><option value="">Chọn đề tài</option></select></div>' +
                    '<div class="ums-field"><label class="ums-field__label">Lý do điều chỉnh</label><input class="ums-input" data-gd="lydo"></div>',
                    buttons: [{ text: 'Lưu', kind: 'save', onClick: function (dl) {
                        var dt = sel.value;
                        if (!dt) { ui.toast('Vui lòng chọn đề tài', 'warn'); return false; }
                        L.g(KH + 'Them_BV_KH_NG_GiaoDeTai', { strId: '', strBV_KeHoach_Id: sv.BV_KEHOACH_ID, strQLSV_NguoiHoc_Id: sv.QLSV_NGUOIHOC_ID,
                            strDaoTao_ChuongTrinh_Id: sv.DAOTAO_TOCHUCCHUONGTRINH_ID, strLyDoDieuChinh: dl.body.querySelector('[data-gd="lydo"]').value.trim(),
                            strBV_KeHoach_DeTai_Id: dt, strNguoiThucHien_Id: L.uid() }, true)
                            .then(function () { ui.toast('Thêm mới thành công!', 'ok'); napChuaGiao(); tai(); })
                            .catch(function (err) { ums.api.handle(err, 'giao đề tài'); });
                        return false;
                    } }] });
                var sel = dlg.body.querySelector('[data-gd="dt"]');
                function napChuaGiao() {
                    ums.api.call({ action: 'TN_LVLA_BV_KeHoach_MH/DSA4BRIDFx4KJAkuICIpHgUkFSAoHgIpNCAGKCAu', func: 'pkg_bv_kehoach.LayDSBV_KeHoach_DeTai_ChuaGiao',
                        strTuKhoa: '', strBV_KeHoach_Id: ctx.kh(), strNguoiThucHien_Id: L.uid(), pageIndex: 1, pageSize: 100000 })
                        .then(function (r) {
                            sel.value = '';
                            pat.fill(sel, L.arr(r.data), { head: 'Chọn đề tài', name: function (x) { return e(x.MADETAI) + ' - ' + e(x.TENDETAITIENGVIET); } });
                        }).catch(function (err) { ums.api.handle(err, 'đề tài chưa giao'); });
                }
                napChuaGiao();
            }
            /* duyetdetai: hộp Hướng dẫn CHỈ XEM */
            function hopHuongDanXem(x) {
                var dlg = ui.dialog({ title: 'Người hướng dẫn', icon: 'fa-chalkboard-user', size: 'lg', body:
                    L.kv('Đề tài giao', e(x.BV_KEHOACH_DETAI_TEN)) + L.kv('Lý do điều chỉnh', e(x.LYDODIEUCHINH)) +
                    L.kv('Quyết định', e(x.QLSV_QUYETDINH_SOQD)) + L.kv('Tình trạng Duyệt', e(x.BV_XACNHAN_GIAODETAI_TEN)) + '<div class="ums-u-mt-4" data-hd="bang"></div>' });
                var el = dlg.body.querySelector('[data-hd="bang"]');
                el.innerHTML = L.DANG_TAI;
                L.dsNguoi('HD', x.ID, sv).then(function (rows) { L.bangNguoi(el, rows, { nhan: 'Người hướng dẫn', empty: 'Chưa có người hướng dẫn' }); })
                    .catch(function (err) { el.innerHTML = ui.fail(err.message); ums.api.handle(err, 'người hướng dẫn'); });
            }

            khung.el.addEventListener('change', function (ev) {
                if (ev.target.getAttribute('data-ck') === 'all') Array.prototype.forEach.call(zDT.querySelectorAll('tbody input[data-ck]'), function (c) { c.checked = ev.target.checked; });
            });
            khung.el.addEventListener('click', function (ev) {
                var ed = ev.target.closest('[data-act="edit"]');
                if (ed && zDT.contains(ed)) { var x0 = dong(ed.getAttribute('data-id')); if (x0) hopHuongDan([x0], true); return; }
                var xb = ev.target.closest('[data-dt-x]');
                if (xb) {
                    var x = dong(xb.getAttribute('data-id'));
                    if (!x) return;
                    var k = xb.getAttribute('data-dt-x');
                    if (k === 'hd') hopHuongDanXem(x);
                    else if (k === 'qd') L.hopQuyetDinh(x, khung);
                    else L.hopDuyet(x, function () {
                        L.xacNhan({ loai: 'GiaoDeTai', dm: 'BV.TINHTRANG.XACNHANGIAODETAI', khoaDs: 'strsanpham_Id', sanPham: L.sanPham(x), onDone: tai });
                    });
                    return;
                }
                var a = ev.target.closest('[data-dt-a]');
                if (!a) return;
                var act = a.getAttribute('data-dt-a');
                if (act === 'giao') { hopGiao(); return; }
                var ids = chon();
                if (act === 'hd') {
                    if (!ids.length) { ui.toast('Vui lòng chọn đề tài?', 'warn'); return; }
                    hopHuongDan(ids.map(dong).filter(Boolean), false);
                } else if (act === 'xoa') {
                    if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
                    ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                        if (!yes) return;
                        ui.batch(ids.map(function (id) { return { action: KH + 'Xoa_BV_KH_NG_GiaoDeTai', strChucNang_Id: L.chucNang(), strId: id, strNguoiThucHien_Id: L.uid() }; }),
                            { title: 'Xoá đề tài giao', okText: 'Xóa thành công' }).then(tai);
                    });
                }
            });
            return null;
        }

        ctxMan = L.man(root, {
            tieuDe: giao ? 'Giao đề tài' : 'Duyệt đề tài',
            tieuDeChiTiet: 'Chi tiết đề tài',
            keHoach: 'tatCa',
            phanTrang: true,
            tools: giao ? ui.btn('add', { text: 'Thêm đề tài', attr: { 'data-lv-tool': 'kho' } }) : '',
            onTool: function (k, ctx) { if (k === 'kho') khoDeTai(ctx); },
            list: function (kh, page, size) {
                return { action: KH + 'LayDSBV_Kehoach_NguoiHoc', strTuKhoa: '', strBV_KeHoach_Id: kh, strNguoiThucHien_Id: L.uid(), pageIndex: page, pageSize: size };
            },
            columns: function () {
                // Ánh xạ cột chép ĐÚNG gốc (tiêu đề và dữ liệu lệch nhau ở gốc — xem can-quyet.js)
                var c = L.cotSV();
                if (giao) c.push({ title: 'Học phần đã đăng ký', prop: 'BV_KEHOACH_DETAI_TEN' }, { title: 'Thông tin đề tài', prop: 'THONGTINDETAI' },
                    { title: 'GVHD', prop: 'GVHD' });
                else c.push({ title: 'Thông tin đề tài', prop: 'THONGTINDETAI' }, { title: 'Đã giao đề tài', prop: 'BV_KEHOACH_DETAI_TEN' });
                c.push({ title: 'Đã có QĐ giao đề tài', prop: 'Daotao_Khoadaotao_Ten', cls: 'is-center' },
                    { title: 'Đã có QĐ bảo vệ', prop: 'Daotao_Khoadaotao_Ten', cls: 'is-center' }, L.cotChon());
                return c;
            },
            chiTiet: chiTiet
        });
    };
})();
