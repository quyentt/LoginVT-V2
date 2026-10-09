/* =========================================================================
   _khtsc_cauhinh.js — hai vùng cấu hình mở từ kế hoạch tuyển sinh (bản cũ)
   Bản gốc: kehoachtuyensinh.js — zone_MauTuyenSinh (nút "Mẫu hồ sơ") và zone_CauTruc
            (nút "Cấu trúc hiển thị kết quả") + hộp myModalTTTuyenSinh, myModalCauTruc.
   ---------------------------------------------------------------------------
   ums.khtsc.mau(host, { onDong })            trường thông tin mở rộng của MỘT mẫu hồ sơ
   ums.khtsc.cauTruc(host, { kh, onDong })    cấu trúc hiển thị kết quả của kế hoạch
   Lời gọi (TS_KeHoach_MH · pkg_tuyensinh_kehoach., POST, func + iM — chép nguyên):
     LayDSTS_HoSo_MoRong · Them_TS_HoSo_MoRong · Sua_TS_HoSo_MoRong · Xoa_TS_HoSo_MoRong
     LayDSTS_CauTrucHienThiHoSo · Them_ · Sua_ · Xoa_TS_CauTrucHienThiHoSo
     TS_MauHoSo/LayDanhSach (GET) · danh mục TS.HOSO.TRUONGTHONGTIN
   Như gốc: sửa thẳng trong ô bảng, "Lưu" gửi các dòng ĐÃ ĐỔI (so với giá trị lúc nạp), ô số để trống gửi -1.
   Khác gốc (tự chốt):
     · "Thêm mới" trường thông tin khoá tới khi chọn mẫu hồ sơ (gốc gửi strTS_MauHoSo_Id rỗng).
     · Ô lọc "Thành phần cha" của cấu trúc: xoá lọc thì hiện lại mọi dòng (gốc ẩn dòng rồi không hiện lại, tô chữ đỏ).
     · Không có dòng đổi thì báo, không hỏi "lưu 0 dữ liệu".
   Nơi hiện (30/9, BO-CUC luật 1): "Thêm mới" của cả hai vùng là biểu mẫu NGAY TRONG TRANG thay chỗ bảng
     (ums.pat.formTrang, host = vùng) — trước đó là hộp thoại myModalTTTuyenSinh / myModalCauTruc.
   ========================================================================= */
(function () {
    'use strict';

    var ums = window.ums, ui = ums.ui, pat = ums.pat, K = ums.khtsc;
    var esc = ui.esc, e = K.e;
    var MH = 'TS_KeHoach_MH/', PK = 'pkg_tuyensinh_kehoach.';

    function o_(i, k, v, w) {
        return '<input class="ums-input ums-input--sm khtsc-o" data-o="' + k + '" data-i="' + i + '" data-goc="' + esc(e(v)) + '" value="' +
            esc(e(v)) + '" autocomplete="off"' + (w ? ' style="min-width:' + w + '"' : '') + '>';
    }
    function so(v) { return v === '' ? -1 : v; }
    function doi(tr) {
        return Array.prototype.some.call(tr.querySelectorAll('[data-o]'), function (x) { return (x.value || '') !== x.getAttribute('data-goc'); });
    }
    function chon(el, attr, ds) {
        return Array.prototype.filter.call(el.querySelectorAll('input[' + attr + ']'), function (c) { return c.checked; })
            .map(function (c) { return ds[Number(c.getAttribute(attr))]; });
    }
    function khung(title, icon, loc) {
        return pat.panel({
            title: title, icon: icon, flush: true,
            tools: ui.btn('close', { attr: { 'data-c': 'dong' } }) +
                ui.btn('add', { text: 'Thêm mới', mod: 'out-success', attr: { 'data-c': 'them' } }) +
                ui.xoaChon('input[data-ck]', { goc: '.ums-panel', attr: { 'data-c': 'xoa' } }) +
                ui.btn('save', { attr: { 'data-c': 'luu' } }),
            body: '<div class="ums-panel__body"><div class="ums-filter">' + loc + '</div></div><div data-c="tbl"></div>'
        });
    }
    function xoaNhieu(ds, call, sau) {
        if (!ds.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá dữ liệu' }).then(function (yes) {
            if (!yes) return;
            return ui.batch(ds.map(call), { title: 'Đang xoá', okText: 'Đã xoá' }).then(sau);
        });
    }
    function luuNhieu(ds, call, sau) {
        if (!ds.length) { ui.toast('Chưa có dòng nào thay đổi', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn lưu ' + ds.length + ' dữ liệu không?', { ok: 'Lưu', title: 'Lưu thay đổi' }).then(function (yes) {
            if (!yes) return;
            return ui.batch(ds.map(call), { title: 'Đang lưu', okText: 'Cập nhật thành công' }).then(sau);
        });
    }

    /* =====================================================================
       Mẫu hồ sơ — trường thông tin mở rộng (TS_HoSo_MoRong)
       ===================================================================== */
    K.mau = function (host, o) {
        var ds = [];
        host.innerHTML = khung('Mẫu', 'fa-file-lines',
            '<div class="ums-field"><select class="ums-select" data-c="mau" data-ph="Chọn mẫu hồ sơ"><option value=""></option></select></div>');
        function q(k) { return host.querySelector('[data-c="' + k + '"]'); }
        var sMau = q('mau');
        ui.enhance(host);
        K.mauHoSo().then(function (rows) { pat.fill(sMau, rows, { name: 'TEN' }); }).catch(function (err) { ums.api.handle(err, 'mẫu hồ sơ'); });

        function khoa() { q('them').disabled = !sMau.value; }
        function nap() {
            khoa();
            if (!sMau.value) { ds = []; ve('Chọn mẫu hồ sơ để xem các trường thông tin'); return; }
            q('tbl').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            K.post({ action: MH + 'DSA4BRIVEh4JLhIuHgwuEy4vJgPP', func: PK + 'LayDSTS_HoSo_MoRong', strTS_MauHoSo_Id: sMau.value, strNguoiThucHien_Id: '' })
                .then(function (rows) { ds = rows; ve(); })
                .catch(function (err) { ds = []; ve(); ums.api.handle(err, 'trường thông tin mở rộng'); });
        }
        function ve(rong) {
            ui.table({
                el: q('tbl'), rows: ds, empty: rong || 'Mẫu chưa có trường thông tin',
                columns: [
                    { title: 'Mã trường', prop: 'TRUONGTHONGTIN_MA', cls: 'is-nowrap' },
                    { title: 'Tên trường', prop: 'TRUONGTHONGTIN_TEN' },
                    { title: 'Kiểu dữ liệu', prop: 'TRUONGTHONGTIN_KIEUDULIEU', cls: 'is-nowrap' },
                    { title: 'Thuộc nhóm', render: function (r, i) { return o_(i, 'THUOCNHOM', r.THUOCNHOM, '140px'); } },
                    { title: 'Thứ tự hiển thị', render: function (r, i) { return o_(i, 'THUTU', r.THUTU, '80px'); } },
                    { title: 'Bắt buộc', render: function (r, i) { return o_(i, 'BATBUOC', r.BATBUOC, '70px'); } },
                    { title: 'Độ rộng', render: function (r, i) { return o_(i, 'DORONG', r.DORONG, '70px'); } },
                    { title: 'Phạm vi bắt đầu', render: function (r, i) { return o_(i, 'PHAMVIBATDAU', r.PHAMVIBATDAU, '80px'); } },
                    { title: 'Phạm vi kết thúc', render: function (r, i) { return o_(i, 'PHAMVIKETTHUC', r.PHAMVIKETTHUC, '80px'); } },
                    { head: '<input type="checkbox" data-c="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                      render: function (r, i) { return '<input type="checkbox" data-ck="' + i + '">'; } }
                ]
            });
        }
        function gt(i, k) { var x = host.querySelector('[data-o="' + k + '"][data-i="' + i + '"]'); return x ? x.value.trim() : ''; }

        if (window.jQuery) jQuery(sMau).on('select2:select select2:clear change', nap);
        host.addEventListener('change', function (ev) {
            if (ev.target.getAttribute('data-c') === 'all') {
                Array.prototype.forEach.call(q('tbl').querySelectorAll('input[data-ck]'), function (c) { c.checked = ev.target.checked; });
            }
        });
        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-c]');
            if (!b || !host.contains(b)) return;
            var k = b.getAttribute('data-c');
            if (k === 'dong') { if (o.onDong) o.onDong(); }
            else if (k === 'xoa') {
                xoaNhieu(chon(q('tbl'), 'data-ck', ds), function (r) {
                    return { action: MH + 'GS4gHhUSHgkuEi4eDC4TLi8m', func: PK + 'Xoa_TS_HoSo_MoRong', method: 'POST', strId: r.ID, strNguoiThucHien_Id: '' };
                }, nap);
            }
            else if (k === 'luu') {
                var sua = [];
                Array.prototype.forEach.call(q('tbl').querySelectorAll('tbody tr'), function (tr, i) { if (ds[i] && doi(tr)) sua.push(i); });
                luuNhieu(sua, function (i) {
                    return { action: MH + 'EjQgHhUSHgkuEi4eDC4TLi8m', func: PK + 'Sua_TS_HoSo_MoRong', method: 'POST', strId: ds[i].ID,
                        dThuTu: so(gt(i, 'THUTU')), dDoRong: so(gt(i, 'DORONG')), dBatBuoc: so(gt(i, 'BATBUOC')), strThuocNhom: gt(i, 'THUOCNHOM'),
                        dPhamViBatDau: so(gt(i, 'PHAMVIBATDAU')), dPhamViKetThuc: so(gt(i, 'PHAMVIKETTHUC')), strNguoiThucHien_Id: '' };
                }, nap);
            }
            else if (k === 'them') hopThem();
        });

        /* Biểu mẫu thêm — NGAY TRONG TRANG, thay chỗ bảng trường thông tin (BO-CUC luật 1; trước 30/9 là hộp thoại) */
        function hopThem() {
            var d = pat.formTrang({
                host: host,
                title: 'Trường thông tin', icon: 'fa-plus',
                body: ui.field('Trường thông tin', '<select class="ums-select" data-h="tt" data-ph="Chọn thành phần"><option value=""></option></select>', { required: true }),
                buttons: [{ text: 'Lưu', kind: 'save', onClick: function (api) {
                    var tt = api.body.querySelector('[data-h="tt"]').value;
                    if (!tt) { ui.toast('Vui lòng chọn trường thông tin', 'warn'); return false; }
                    ums.api.call({ action: MH + 'FSkkLB4VEh4JLhIuHgwuEy4vJgPP', func: PK + 'Them_TS_HoSo_MoRong', method: 'POST',
                        strTS_MauHoSo_Id: sMau.value, strTruongThongTin_Id: tt, strNguoiThucHien_Id: '' })
                        .then(function () { ui.toast('Thêm mới thành công!', 'ok'); api.close(); nap(); })
                        .catch(function (err) { ums.api.handle(err, 'thêm trường thông tin'); });
                    return false;
                } }]
            });
            var s = d.body.querySelector('[data-h="tt"]');
            K.thanhPhan().then(function (rows) { pat.fill(s, rows, { name: K.tenTP }); }).catch(function (err) { ums.api.handle(err, 'trường thông tin'); });
        }

        nap();
    };

    /* =====================================================================
       Cấu trúc hiển thị kết quả (TS_CauTrucHienThiHoSo) của kế hoạch
       ===================================================================== */
    K.cauTruc = function (host, o) {
        var kh = o.kh, ds = [], dsTP = [];
        host.innerHTML = khung('Cấu trúc hiển thị kết quả', 'fa-sitemap',
            '<div class="ums-field"><select class="ums-select" data-c="loc" data-ph="Lọc theo thành phần cha"><option value=""></option></select></div>');
        function q(k) { return host.querySelector('[data-c="' + k + '"]'); }
        var sLoc = q('loc');
        ui.enhance(host);
        var tpSan = K.thanhPhan().then(function (rows) { dsTP = rows || []; pat.fill(sLoc, dsTP, { name: K.tenTP }); })
            .catch(function (err) { ums.api.handle(err, 'thành phần'); });

        function selTP(i, k, v, khoa) {
            return '<select class="ums-select ums-input--sm khtsc-tp" data-o="' + k + '" data-i="' + i + '" data-goc="' + esc(e(v)) + '"' +
                (khoa ? ' disabled' : ' data-s2 data-ph="Chọn thành phần"') + '>' + K.opts(dsTP, 'ID', K.tenTP, 'Chọn thành phần', v) + '</select>';
        }
        function nap() {
            q('tbl').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return Promise.all([tpSan, K.post({ action: MH + 'DSA4BRIVEh4CIDQVMzQiCSgkLxUpKAkuEi4P', func: PK + 'LayDSTS_CauTrucHienThiHoSo',
                strTS_KeHoachTuyenSinh_Id: kh.ID, strNguoiThucHien_Id: '' })])
                .then(function (x) { ds = x[1]; ve(); })
                .catch(function (err) { ds = []; ve(); ums.api.handle(err, 'cấu trúc hiển thị'); });
        }
        function ve() {
            ui.table({
                el: q('tbl'), rows: ds, empty: 'Kế hoạch chưa có cấu trúc hiển thị kết quả',
                columns: [
                    { title: 'Thành phần', render: function (r, i) { return '<div class="khtsc-rong">' + selTP(i, 'THANHPHAN_ID', r.THANHPHAN_ID, true) + '</div>'; } },
                    { title: 'Thành phần - cha', render: function (r, i) { return '<div class="khtsc-rong">' + selTP(i, 'THANHPHAN_CHA_ID', r.THANHPHAN_CHA_ID) + '</div>'; } },
                    { title: 'Xâu công thức tính', render: function (r, i) { return o_(i, 'XAUCONGTHUCTINH', r.XAUCONGTHUCTINH, '260px'); } },
                    { title: 'Ký hiệu', render: function (r, i) { return o_(i, 'KYHIEU', r.KYHIEU, '140px'); } },
                    { title: 'Là thành phần cuối', render: function (r, i) { return o_(i, 'LATHANHPHANCUOI', r.LATHANHPHANCUOI, '70px'); } },
                    { title: 'Tính toán', render: function (r, i) { return o_(i, 'TINHTOAN', r.TINHTOAN, '70px'); } },
                    { title: 'Thứ tự', render: function (r, i) { return o_(i, 'THUTU', r.THUTU, '70px'); } },
                    { title: 'Thứ tự tra cứu', render: function (r, i) { return o_(i, 'THUTUTRACUU', r.THUTUTRACUU, '70px'); } },
                    { title: 'Hiển thị kết quả tra cứu', render: function (r, i) { return o_(i, 'HIENTHIKETQUATRACUU', r.HIENTHIKETQUATRACUU, '70px'); } },
                    { title: 'Mô tả', render: function (r, i) { return o_(i, 'MOTA', r.MOTA, '180px'); } },
                    { head: '<input type="checkbox" data-c="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                      render: function (r, i) { return '<input type="checkbox" data-ck="' + i + '">'; } }
                ]
            });
            ui.enhance(q('tbl'));
            loc();
        }
        /* Lọc tại chỗ theo thành phần cha (gốc: filter trên .loccha) */
        function loc() {
            var v = sLoc.value;
            Array.prototype.forEach.call(q('tbl').querySelectorAll('tbody tr'), function (tr) {
                var s = tr.querySelector('[data-o="THANHPHAN_CHA_ID"]');
                tr.hidden = !!(v && s && s.value !== v);
            });
        }
        function gt(i, k) { var x = host.querySelector('[data-o="' + k + '"][data-i="' + i + '"]'); return x ? (x.value || '').trim() : ''; }

        if (window.jQuery) jQuery(sLoc).on('select2:select select2:clear change', loc);
        host.addEventListener('change', function (ev) {
            if (ev.target.getAttribute('data-c') === 'all') {
                Array.prototype.forEach.call(q('tbl').querySelectorAll('tbody tr:not([hidden]) input[data-ck]'), function (c) { c.checked = ev.target.checked; });
            }
        });
        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-c]');
            if (!b || !host.contains(b)) return;
            var k = b.getAttribute('data-c');
            if (k === 'dong') { if (o.onDong) o.onDong(); }
            else if (k === 'xoa') {
                xoaNhieu(chon(q('tbl'), 'data-ck', ds), function (r) {
                    return { action: MH + 'GS4gHhUSHgIgNBUzNCIJKCQvFSkoCS4SLgPP', func: PK + 'Xoa_TS_CauTrucHienThiHoSo', method: 'POST', strId: r.ID, strNguoiThucHien_Id: '' };
                }, nap);
            }
            else if (k === 'luu') {
                var sua = [];
                Array.prototype.forEach.call(q('tbl').querySelectorAll('tbody tr'), function (tr, i) { if (ds[i] && doi(tr)) sua.push(i); });
                luuNhieu(sua, function (i) {
                    return { action: MH + 'EjQgHhUSHgIgNBUzNCIJKCQvFSkoCS4SLgPP', func: PK + 'Sua_TS_CauTrucHienThiHoSo', method: 'POST',
                        strId: ds[i].ID, strTS_KeHoachTuyenSinh_Id: kh.ID, strThanhPhan_Id: gt(i, 'THANHPHAN_ID'), strThanhPhan_Cha_Id: gt(i, 'THANHPHAN_CHA_ID'),
                        dThuTu: so(gt(i, 'THUTU')), strXauCongThucTinh: gt(i, 'XAUCONGTHUCTINH'), strKyHieu: gt(i, 'KYHIEU'),
                        dLaThanhPhanCuoi: so(gt(i, 'LATHANHPHANCUOI')), dTinhToan: so(gt(i, 'TINHTOAN')),
                        dHienThiKetQuaTraCuu: so(gt(i, 'HIENTHIKETQUATRACUU')), dThuTuTraCuu: so(gt(i, 'THUTUTRACUU')),
                        strMoTa: gt(i, 'MOTA'), strNguoiThucHien_Id: '' };
                }, nap);
            }
            else if (k === 'them') hopThem();
        });

        /* Biểu mẫu thêm — NGAY TRONG TRANG, thay chỗ bảng cấu trúc (BO-CUC luật 1; trước 30/9 là hộp thoại) */
        function hopThem() {
            var d = pat.formTrang({
                host: host,
                title: 'Trường thông tin', icon: 'fa-plus',
                body:
                    '<div>' + ui.field('Thành phần', '<select class="ums-select" data-h="tp" data-ph="Chọn thành phần"><option value=""></option></select>', { required: true }) + '</div>' +
                    '<div>' + ui.field('Thành phần cha', '<select class="ums-select" data-h="cha" data-ph="Chọn thành phần"><option value=""></option></select>') + '</div>',
                buttons: [{ text: 'Lưu', kind: 'save', onClick: function (api) {
                    var tp = api.body.querySelector('[data-h="tp"]').value;
                    if (!tp) { ui.toast('Vui lòng chọn thành phần', 'warn'); return false; }
                    ums.api.call({ action: MH + 'FSkkLB4VEh4CIDQVMzQiCSgkLxUpKAkuEi4P', func: PK + 'Them_TS_CauTrucHienThiHoSo', method: 'POST',
                        strTS_KeHoachTuyenSinh_Id: kh.ID, strThanhPhan_Id: tp, strThanhPhan_Cha_Id: api.body.querySelector('[data-h="cha"]').value,
                        dThuTu: -1, strXauCongThucTinh: '', strKyHieu: '', dLaThanhPhanCuoi: -1, dTinhToan: -1, dHienThiKetQuaTraCuu: -1,
                        dThuTuTraCuu: -1, strMoTa: '', strNguoiThucHien_Id: '' })
                        .then(function () { ui.toast('Thêm mới thành công!', 'ok'); api.close(); nap(); })
                        .catch(function (err) { ums.api.handle(err, 'thêm cấu trúc'); });
                    return false;
                } }]
            });
            tpSan.then(function () {
                pat.fill(d.body.querySelector('[data-h="tp"]'), dsTP, { name: K.tenTP });
                pat.fill(d.body.querySelector('[data-h="cha"]'), dsTP, { name: K.tenTP });
            });
        }

        nap();
    };
})();
