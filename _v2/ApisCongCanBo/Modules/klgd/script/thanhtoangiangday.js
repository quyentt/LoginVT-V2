/* =========================================================================
   Thanh toán giảng dạy (cổng cán bộ) — bảng tiền vượt giờ theo bộ môn, nhập số tiền thanh toán ngay trong bảng.
   Bản gốc: ApisCongCanBo/Modules/klgd/html/thanhtoangiangday.html + script/thanhtoangiangday.js
   ---------------------------------------------------------------------------
   Năm học TKGG_KLGD/GetcboSchoolYear (NIENHOC) → Bộ môn TKGG_KLGD/GetBoMonDuocPhanCong { strChucNang_Id, strNguoiThucHien_Id, strNamHoc }.
   Danh sách (phân trang máy chủ): TKGG_KLGD/GetTienThanhThoanVuotGio (sic) { NhomMonHocID, strNamHoc, PageNumber, ItemPerPage,
     strNguoiDung_Id } — tổng dòng ở Pager.
   Thanh toán (mỗi dòng, GET): TKGG_QLKLGD/SaveThanhToanGiangDay { strStaffId: ID, strNoiDung, strNamHoc, strSoTienDHCQ, strSoTienDHTC,
     strCAOHOC, strTTHTQT, strNgayThanhToan, strUserId, strNguoiDung_Id }.
   Chi tiết (mở TRONG TRANG, thay chỗ danh sách): TKGG_QLKLGD/GetThongTinQuaTrinhThanhToan { strStaffId, strNamHoc, strNguoiDung_Id } · Cập nhật CapNhatTienDaThanhToan
     { strId, strNoiDung, strSoTien, strNgayThanhToan, strNguoiDung_Id } (dòng đã đổi) · Xoá DeleteTienThanhToan { strId, strUserId,
     strNguoiDung_Id } (từng id).
   Báo cáo: mẫu phân quyền + strNamHoc, strNhomMonHocId, Id (bộ môn), strChucNang_Id.
   Khác bản gốc (ghi ở can-quyet.js):
     · Gốc chỉ gửi dòng có SỐ TIỀN đổi (đổi riêng Nội dung / Ngày TT không lưu) → nay gửi dòng đổi bất kỳ ô nào.
     · Số tiền gửi đi bỏ dấu phẩy ngăn nghìn (gốc lúc có lúc không, tuỳ ô đã gõ hay chưa).
     · Hỏi lại một lần, chạy một lần (gốc: bấm "Thanh toán" lần 2 gửi 2 lần → tạo TRÙNG thanh toán).
     · Báo đúng kết quả (gốc gán đè strErr bằng thông điệp thành công → có thể báo "lỗi" khi đã lưu).
     · Năm học → Bộ môn khoá theo luật cha → con; Thanh toán bắt chọn năm học + bộ môn.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, K = ums.klgd, e = K.e, esc = ui.esc;
    var root = document.getElementById('klgd-thanhtoangiangday');
    if (!root) return;
    root.innerHTML = pat.page('Thanh toán giảng dạy', '<span data-z="bc"></span>') +
        pat.filterBar([{ key: 'nam', type: 'select', label: 'Chọn năm học' }, { key: 'bm', type: 'select', label: 'Chọn bộ môn' }],
            { searchText: 'Danh sách', extra: '<div class="ums-field ums-field--fit">' + ui.btn('save', { text: 'Thanh toán', icon: 'fa-money-check-dollar', attr: { 'data-a': 'thanhtoan' } }) + '</div>' }) +
        pat.panel({ title: 'Danh sách thanh toán vượt giờ', icon: 'fa-money-bill-wave', flush: true, count: 'dem', zone: 'bang' });
    ui.enhance(root);
    function F(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return F(k).value; }
    var bang = root.querySelector('[data-z="bang"]');
    var rows = [], trang = 1, co = 10, tong = 0;
    var HE = [['DHCQ', 'ĐHCQ', 'TIENVUOTGIODHCQ', 'TIENDATHANHTOANDHCQ', 'TIENCONLAIDHCQ', 'strSoTienDHCQ'],
        ['DHTC', 'ĐHTC', 'TIENVUOTGIODHTC', 'TIENDATHANHTOANDHTC', 'TIENCONLAIDHTC', 'strSoTienDHTC'],
        ['CH', 'Cao học', 'TIENVUOTGIOCAOHOC', 'TIENDATHANHTOANCAOHOC', 'TIENCONLAICAOHOC', 'strCAOHOC'],
        ['HTQT', 'HTQT', 'TIENVUOTGIOTTHTQT', 'TIENDATHANHTOANTTHTQT', 'TIENCONLAITTHTQT', 'strTTHTQT']];
    function oTien(k, i, val) { return '<input class="ums-input ums-input--sm kl-tien" data-o="' + k + '" data-i="' + i + '" inputmode="decimal" value="' + esc(pat.money(val)) + '" autocomplete="off">'; }
    function oChu(k, i, val, date) { return (date ? '<div class="ums-inputwrap">' : '') + '<input class="ums-input ums-input--sm" data-o="' + k + '" data-i="' + i + '" value="' + esc(e(val)) + '" autocomplete="off"' + (date ? ' data-date placeholder="dd/mm/yyyy"' : '') + '>' + (date ? '<i class="fa-light fa-calendar"></i></div>' : ''); }
    function gt(host, k, i) { var el = host.querySelector('[data-o="' + k + '"][data-i="' + i + '"]'); return el ? el.value.trim() : ''; }

    function ve() {
        var cot = [{ title: 'Họ tên', prop: 'HOTEN' }];
        HE.forEach(function (h) {
            cot.push({ title: 'Tiền vượt giờ ' + h[1], cls: 'is-right is-nowrap', render: function (r) { return esc(pat.money(r[h[2]])); } });
            cot.push({ title: 'Tiền đã TT/nhập ' + h[1], render: function (r, i) { return '<span class="kl-da">' + esc(pat.money(r[h[3]])) + '</span>' + oTien(h[0], i, r[h[4]]); } });
        });
        cot.push({ title: 'Tổng tiền vượt giờ', cls: 'is-right is-nowrap', render: function (r) { return esc(pat.money(r.TONGTIENVUOTGIO)); } },
            { title: 'Tổng tiền đã thanh toán', cls: 'is-right is-nowrap', render: function (r) { return esc(pat.money(r.TONGTIENDATHANHTOAN)); } },
            { title: 'Tổng tiền còn lại', cls: 'is-right is-nowrap', render: function (r) { return esc(pat.money(r.TONGTIENCONLAI)); } },
            { title: 'Nội dung', width: '160px', render: function (r, i) { return oChu('nd', i, r.NOIDUNG); } },
            { title: 'Ngày TT', width: '150px', render: function (r, i) { return oChu('ngay', i, '', true); } },
            { title: 'Chi tiết', cls: 'is-center', width: '70px', render: function (r, i) { return '<button type="button" class="ums-iconbtn" data-ct="' + i + '" title="Chi tiết"><i class="fa-light fa-eye"></i></button>'; } });
        ui.table({ el: bang, rows: rows, columns: cot, empty: 'Không có dữ liệu',
            page: { index: trang, size: co, total: tong, onChange: function (p) { tai(p); }, onSize: function (n) { co = n === 'all' ? 1000000 : n; tai(1); } } });
        ui.enhance(bang);
    }
    function tai(p) {
        if (p) trang = p;
        if (!v('nam')) { bang.innerHTML = ui.empty('Chọn năm học và bộ môn', 'fa-filter'); return; }
        bang.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
        K.g('TKGG_KLGD/GetTienThanhThoanVuotGio', { NhomMonHocID: v('bm'), strNamHoc: v('nam'), PageNumber: trang, ItemPerPage: co, strNguoiDung_Id: K.uid() })
            .then(function (r) {
                rows = K.arr(r.data); tong = Number(r.pager) || rows.length;
                root.querySelector('[data-z="dem"]').textContent = '(' + tong + ')';
                ve();
            }).catch(function (err) { bang.innerHTML = ui.fail(err.message); ums.api.handle(err, 'thanh toán'); });
    }
    function thanhToan() {
        if (!v('nam') || !v('bm')) { ui.toast('Bạn chưa chọn năm học / bộ môn', 'warn'); return; }
        var doi = [];
        rows.forEach(function (r, i) {
            var tien = HE.map(function (h) { return pat.num(gt(bang, h[0], i)); });
            var nd = gt(bang, 'nd', i), ngay = gt(bang, 'ngay', i);
            var khac = HE.some(function (h, j) { return tien[j] !== pat.num(e(r[h[4]])); }) || nd !== e(r.NOIDUNG) || ngay !== '';
            if (khac) doi.push({ r: r, tien: tien, nd: nd, ngay: ngay });
        });
        if (!doi.length) { ui.toast('Không có dòng nào thay đổi', 'info'); return; }
        ui.confirm('Bạn có chắc chắn thanh toán giảng dạy? (' + doi.length + ' giảng viên)', { ok: 'Thanh toán' }).then(function (yes) {
            if (!yes) return;
            ui.batch(doi.map(function (x) {
                var p = { action: 'TKGG_QLKLGD/SaveThanhToanGiangDay', method: 'GET', strStaffId: e(x.r.ID), strNoiDung: x.nd, strNamHoc: v('nam'),
                    strNgayThanhToan: x.ngay, strUserId: K.uid(), strNguoiDung_Id: K.uid() };
                HE.forEach(function (h, j) { p[h[5]] = x.tien[j]; });
                return p;
            }), { title: 'Đang thanh toán', okText: 'Cập nhật thành công', show: true }).then(function () { tai(); });
        });
    }

    /* ---------- Chi tiết thanh toán — lưới sửa trong trang, thay chỗ danh sách (pat.formTrang, BO-CUC luật 1) ---------- */
    function chiTiet(r) {
        var ds = [];
        var dlg = pat.formTrang({ host: root, title: 'Chi tiết thanh toán', icon: 'fa-receipt', cols: 1, body:
            '<div class="ums-legend">Thông tin thanh toán giảng viên</div><div class="ums-grid ums-grid--3 ums-u-mb-4">' +
            '<div class="ums-kv"><span>Đơn vị</span><b>' + esc(e(r.TENBM)) + '</b></div><div class="ums-kv"><span>Họ tên</span><b>' + esc(e(r.HOTEN)) + '</b></div>' +
            '<div class="ums-kv"><span>Năm học</span><b>' + esc(e(r.NIENHOC)) + '</b></div></div>' +
            '<div class="ums-row ums-row--end ums-u-mb-2">' + ui.btn('save', { text: 'Cập nhật', attr: { 'data-d': 'capnhat' } }) + '</div><div data-d="bang"></div>',
            xoa: { chon: 'input[data-dk]', onClick: function () { xoaCT(); } } });
        var B = dlg.body, host = B.querySelector('[data-d="bang"]');
        function veCT() {
            ui.table({ el: host, rows: ds, empty: 'Chưa có thanh toán', columns: [
                { title: 'Năm học', prop: 'NAMHOC', cls: 'is-nowrap' },
                { title: 'Nội dung', render: function (x, i) { return oChu('nd', i, x.NOIDUNG); } },
                { title: 'Số tiền', width: '160px', render: function (x, i) { return oTien('st', i, x.SOTIEN); } },
                { title: 'Ngày thanh toán', width: '160px', render: function (x, i) { return oChu('ngay', i, x.NGAYTHANHTOAN, true); } },
                { title: 'Hệ đào tạo', prop: 'MAHEDAOTAO', cls: 'is-nowrap' },
                { head: '<input type="checkbox" data-d="all">', cls: 'is-center', width: '44px', render: function (x, i) { return '<input type="checkbox" data-dk="' + i + '">'; } }] });
            ui.enhance(host);
        }
        function taiCT() {
            host.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
            K.g('TKGG_QLKLGD/GetThongTinQuaTrinhThanhToan', { strStaffId: e(r.ID), strNamHoc: v('nam'), strNguoiDung_Id: K.uid() })
                .then(function (x) { ds = K.arr(x.data); veCT(); })
                .catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'quá trình thanh toán'); });
        }
        B.addEventListener('click', function (ev) {
            var a = ev.target.closest('[data-d]');
            if (!a) return;
            var k = a.getAttribute('data-d');
            if (k === 'all') host.querySelectorAll('[data-dk]').forEach(function (x) { x.checked = a.checked; });
            else if (k === 'capnhat') {
                var doi = ds.map(function (x, i) { return { x: x, nd: gt(host, 'nd', i), st: pat.num(gt(host, 'st', i)), ngay: gt(host, 'ngay', i) }; })
                    .filter(function (y) { return y.nd !== e(y.x.NOIDUNG) || y.st !== pat.num(e(y.x.SOTIEN)) || y.ngay !== e(y.x.NGAYTHANHTOAN); });
                if (!doi.length) { ui.toast('Không có dòng nào thay đổi', 'info'); return; }
                ui.confirm('Bạn có chắc chắn cập nhật?', { ok: 'Cập nhật' }).then(function (yes) {
                    if (!yes) return;
                    ui.batch(doi.map(function (y) {
                        return { action: 'TKGG_QLKLGD/CapNhatTienDaThanhToan', method: 'GET', strId: e(y.x.ID), strNoiDung: y.nd, strSoTien: y.st,
                            strNgayThanhToan: y.ngay, strNguoiDung_Id: K.uid() };
                    }), { title: 'Đang cập nhật', okText: 'Cập nhật thành công', show: true }).then(function () { taiCT(); tai(); });
                });
            }
        });
        function xoaCT() {
            var chon = Array.prototype.slice.call(host.querySelectorAll('[data-dk]:checked')).map(function (x) { return ds[Number(x.getAttribute('data-dk'))]; });
            if (!chon.length) { ui.toast('Vui lòng chọn thanh toán cần xóa?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn xóa thanh toán giảng dạy?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                if (!yes) return;
                ui.batch(chon.map(function (x) {
                    return { action: 'TKGG_QLKLGD/DeleteTienThanhToan', method: 'GET', strId: e(x.ID), strUserId: K.uid(), strNguoiDung_Id: K.uid() };
                }), { title: 'Đang xoá', okText: 'Thực hiện thành công', show: true }).then(function () { taiCT(); tai(); });
            });
        }
        taiCT();
    }

    ums.report.mount(root.querySelector('[data-z="bc"]'), { collect: function (add) {
        add('strNamHoc', v('nam')); add('strNhomMonHocId', v('bm')); add('Id', v('bm')); add('strChucNang_Id', K.chucNang());
    } });
    root.addEventListener('click', function (ev) {
        var c = ev.target.closest('[data-ct]');
        if (c) { chiTiet(rows[Number(c.getAttribute('data-ct'))]); return; }
        var b = ev.target.closest('[data-a]');
        if (!b) return;
        if (b.getAttribute('data-a') === 'search') tai(1);
        else if (b.getAttribute('data-a') === 'thanhtoan') thanhToan();
    });
    bang.addEventListener('input', function (ev) {
        if (!ev.target.classList.contains('kl-tien')) return;
        var s = ev.target.value.replace(/[^\d]/g, '');
        ev.target.value = s ? pat.money(s) : '';
    });
    function napBoMon() {
        if (!v('nam')) return;
        K.g('TKGG_KLGD/GetBoMonDuocPhanCong', { strChucNang_Id: K.chucNang(), strNguoiThucHien_Id: K.uid(), strNamHoc: v('nam'), silent: true })
            .then(function (r) { pat.fill(F('bm'), K.arr(r.data), { id: 'ID', name: 'NAME', head: 'Chọn bộ môn' }); })
            .catch(function (err) { ums.api.handle(err, 'bộ môn'); });
    }
    jQuery(F('nam')).on('select2:select select2:clear', function () { napBoMon(); rows = []; bang.innerHTML = ui.empty('Chọn bộ môn', 'fa-filter'); });
    jQuery(F('bm')).on('select2:select select2:clear', function () { tai(1); });
    pat.chain([F('nam'), F('bm')], { phatLai: false });
    ums.crud.loadSource(K.nam(false)).then(function (d) {
        pat.fill(F('nam'), d, { id: 'NIENHOC', name: 'NIENHOC', head: 'Chọn năm học' });
        if (d.length) { F('nam').value = e(d[0].NIENHOC); jQuery(F('nam')).trigger('change.select2'); jQuery(F('nam')).trigger({ type: 'select2:select' }); }
    }).catch(function (err) { ums.api.handle(err, 'năm học'); });
    bang.innerHTML = ui.empty('Chọn năm học và bộ môn', 'fa-filter');
})();
