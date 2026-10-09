/* =========================================================================
   Kế hoạch khảo sát — phiếu khảo sát của một kế hoạch — ums.ks.phieu
   (zoneDSPhieu, zonePhieu, zoneThemPhieu của bản gốc)
   ---------------------------------------------------------------------------
   Danh sách phiếu:
       KS_ThongTin/LayDSKS_PhieuKhaoSat        GET  strKS_PhieuKhaoSat_Mau_Id = phiếu mẫu của kế hoạch, pageSize 100000
       KS_ThongTin/Xoa_KS_PhieuKhaoSat         POST mỗi dòng đánh dấu
       "Xem cấu trúc phiếu" → <strhost>/congthongtin/pages/phieukhaosat.aspx?strPhieu_Id&strKeHoach_Id&strNguoiThucHien_Id
   Một phiếu:
       KS_TaoPhieu/KhoiTaoPhieuTheoPhieuMau    POST "Khởi tạo theo phiếu mẫu" (strId = phiếu đang mở, rỗng = thêm)
       KS_TaoPhieu/GenPhieuBanTuDong           POST "Gen phiếu" (đồng hồ chạy giây như bản gốc)
       KS_ThongTin/LayDSKS_DoiTuongDuocKhaoSat GET  ô "Đối tượng" · LayDSKS_PhieuKhaoSat_DuocKS → giá trị đang chọn
       KS_ThongTin/Them_KS_PhieuKhaoSat_DuocKS POST "Lưu theo phiếu"
       KS_ThongTin/LayDSKS_PhieuKhaoSatThamGiaKS GET "Đối tượng tham gia" (tên → mở thuchienkhaosat.aspx)
       KS_ThongTin/LayDS_DoiTuongThamGiaChuaDung GET "Chưa tham gia"
       KS_ThongTin/Them_KS_PhieuKhaoSat_ThamGiaKS POST "Thêm" · Xoa_KS_PhieuKhaoSat_ThamGiaKS POST "Xóa"
   Phiếu tự động (ba tab, thời gian chọn nhiều):
       1  LayDSGiangVienTheoThoiGian  → KS_TaoPhieu/GenPhieuTuDongTrucTiepGV1 (strGiangVien_Id)
       2  LayDSHocPhanTheoThoiGian    → KS_TaoPhieu/GenPhieuTuDongTrucTiepGV2 (strDaoTao_HocPhan_Id)
       3  LayDSLopHocPhanTheoThoiGian → TS_KS_TaoPhieu_MH (mã hoá) khaosat_taophieu.GenPhieuTuDongTrucTiepGV3
          (strDaoTao_LopHocPhan_Id, strDaoTao_KhoaQuanLy_Id, iChayTienTrinh 0 = chạy ngay / 1 = chạy tiến trình)
       Thời gian: KS_ThongTin/LayDSThoiGianDangKyHoc · Khoa quản lý: ums.ref.coCauToChuc.

   Khác bản gốc (lỗi rõ ràng, ghi lại):
     · "Xóa" đối tượng tham gia đọc ô đánh dấu của bảng CHƯA tham gia → ở đây
       đọc đúng bảng tham gia, có hỏi lại.
     · Khởi tạo phiếu mới xong: bản gốc không giữ id phiếu vừa tạo (bấm tiếp là
       gửi id rỗng) và không nạp lại danh sách phiếu → ở đây giữ id (raw.Id) và nạp lại.
     · LayDSKS_PhieuKhaoSat_DuocKS trả mảng rỗng: bản gốc đọc Data[0] → lỗi JS.
     · Hai cột "Đối tượng được / tham gia khảo sát" của bảng phiếu: nút không gắn
       xử lý → giữ nút, đặt disabled.
     · Mở "Phiếu tự động" bản gốc nạp ngay ba bảng với thời gian RỖNG — ở đây
       chờ bấm "Xem DS…" (bản gốc cũng bắt chọn thời gian trước khi bấm).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var ks = ums.ks = ums.ks || {};
    var C = 'KS_ThongTin/', T = 'KS_TaoPhieu/';
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function host() { return (ums.session && ums.session.host) || location.origin; }
    function chon(tblHost) {
        return Array.prototype.filter.call(tblHost.querySelectorAll('input[data-ck]:checked'), function (c) { return c.getAttribute('data-ck') !== 'all'; })
            .map(function (c) { return Number(c.getAttribute('data-ck')); });
    }
    function cotChon() {
        return { head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                 render: function (r, i) { return '<input type="checkbox" data-ck="' + i + '">'; } };
    }
    function banChon(host) {
        host.addEventListener('change', function (ev) {
            var t = ev.target;
            if (t.getAttribute('data-ck') !== 'all') return;
            var tb = t.closest('table');
            Array.prototype.forEach.call(tb.querySelectorAll('input[data-ck]'), function (c) { c.checked = t.checked; });
        });
    }

    ks.phieu = function (ctx) {
        var kh = null, dsPhieu = [], phieu = null, dsTG = [], dsCTG = [];
        var zDs = ctx.z('dsphieu'), zP = ctx.z('phieu'), zT = ctx.z('tudong');

        /* ================= Danh sách phiếu ================= */
        zDs.innerHTML = pat.page('Quản lý kế hoạch', '') + pat.panel({
            title: 'Phiếu khảo sát', icon: 'fa-file-lines', count: 'dsTen', flush: true, zone: 'dsBang',
            tools: ui.btn('close', { attr: { 'data-p': 'dong' } }) +
                ui.btn('add', { text: 'Thêm phiếu tự động', mod: 'out-success', attr: { 'data-p': 'tudong' } }) +
                ui.btn('add', { text: 'Thêm phiếu', attr: { 'data-p': 'them' } }) +
                ui.xoaChon('input[data-ck]', { goc: '.ums-panel', attr: { 'data-p': 'xoa' } })
                        });
        function zd(k) { return zDs.querySelector('[data-z="' + k + '"]'); }
        banChon(zDs);
        function taiPhieu() {
            zd('dsBang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return ums.api.call({ action: C + 'LayDSKS_PhieuKhaoSat', method: 'GET', strTuKhoa: '', strKS_PhieuKhaoSat_Mau_Id: e(kh.KS_PHIEUKHAOSAT_MAU_ID),
                strKS_KeHoachKhaoSat_Id: kh.ID, strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 100000 }).then(function (r) {
                dsPhieu = arr(r.data);
                ui.table({
                    el: zd('dsBang'), rows: dsPhieu, empty: 'Kế hoạch chưa có phiếu',
                    columns: [
                        { title: 'Tên phiếu', prop: 'TENPHIEU' },
                        { title: 'Xem cấu trúc phiếu', cls: 'is-center', render: function (p, i) { return nutCT('cautruc', i); } },
                        { title: 'Đối tượng được khảo sát', cls: 'is-center', render: function () { return nutCT('', 0, true); } },
                        { title: 'Đối tượng tham gia khảo sát', cls: 'is-center', render: function () { return nutCT('', 0, true); } },
                        { title: 'Tỷ lệ hoàn thành phiếu', prop: 'TYLE', cls: 'is-center' },
                        { title: 'Sửa', cls: 'is-center', width: '60px', render: function (p, i) {
                            return '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-p="sua" data-i="' + i + '" title="Sửa"><i class="fa-light fa-pen-to-square"></i></button>';
                        } },
                        cotChon()
                    ]
                });
            }).catch(function (err) { zd('dsBang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'tải phiếu khảo sát'); });
        }
        function nutCT(a, i, off) {
            return '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm" data-p="' + a + '" data-i="' + i + '"' +
                (off ? ' disabled title="Bản gốc chưa có xử lý"' : '') + '><i class="fa-light fa-eye"></i>Chi tiết</button>';
        }

        /* ================= Một phiếu ================= */
        zP.innerHTML = pat.page('Quản lý kế hoạch', '') + pat.panel({
            title: 'Chỉnh sửa - Phiếu khảo sát', icon: 'fa-pen', count: 'pTen',
            tools: ui.btn('close', { attr: { 'data-p': 'dongP' } }) +
                ui.btn('add', { text: 'Khởi tạo theo phiếu mẫu', mod: 'out-success', icon: 'fa-wand-magic-sparkles', attr: { 'data-p': 'khoitao' } }) +
                ui.btn('save', { text: 'Gen phiếu', mod: 'out-danger', icon: 'fa-gears', attr: { 'data-p': 'gen' } }),
                            body:
                '<div class="ums-grid ums-grid--2">' +
                    ui.field('Mã', '<input class="ums-input" data-pf="ma" autocomplete="off">') +
                    ui.field('Tên phiếu', '<input class="ums-input" data-pf="ten" autocomplete="off">') +
                    '<div style="grid-column:1 / -1">' + ui.field('Mô tả', '<textarea class="ums-input" rows="4" data-pf="mota"></textarea>') + '</div>' +
                '</div>' +
                '<div data-z="pSua" hidden>' +
                    '<div class="ums-legend ums-legend--cach">Đối tượng cần khảo sát</div>' +
                    '<div class="ums-filter"><div class="ums-field">' +
                        '<select class="ums-select" data-pf="dt" data-ph="Chọn đối tượng"><option value=""></option></select></div>' +
                        '<div class="ums-field ums-field--fit">' + ui.btn('save', { text: 'Lưu theo phiếu', attr: { 'data-p': 'luuDT' } }) + '</div></div>' +
                    '<div class="ums-grid ums-grid--2 ums-u-mt-4">' +
                        pat.panel({ title: 'Đối tượng tham gia', icon: 'fa-users', flush: true, zone: 'tg',
                            tools: ui.xoaChon('input[data-ck]', { goc: '.ums-panel', attr: { 'data-p': 'xoaTG' } }) }) +
                        pat.panel({ title: 'Chưa tham gia', icon: 'fa-user-clock', flush: true, zone: 'ctg',
                            tools: ui.btn('add', { text: 'Thêm', mod: 'out-success', attr: { 'data-p': 'themTG' } }) }) +
                    '</div>' +
                '</div>'
        });
        ui.enhance(zP);
        banChon(zP);
        function zp(k) { return zP.querySelector('[data-z="' + k + '"]'); }
        function pf(k) { return zP.querySelector('[data-pf="' + k + '"]'); }
        function setDT(v) { pf('dt').value = e(v); if (window.jQuery) jQuery(pf('dt')).trigger('change.select2'); }
        function taiDoiTuongDuocKS() {
            return ums.api.call({ action: C + 'LayDSKS_DoiTuongDuocKhaoSat', method: 'GET', strTuKhoa: '', strKS_LoaiDoiTuong_Id: '',
                strKS_PhieuKhaoSat_Mau_Id: e(kh.KS_PHIEUKHAOSAT_MAU_ID), strKS_KeHoachKhaoSat_Id: kh.ID, strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 100000, silent: true })
                .then(function (r) { pat.fill(pf('dt'), arr(r.data), { name: 'TEN' }); })
                .catch(function (err) { ums.api.handle(err, 'đối tượng được khảo sát'); });
        }
        function moPhieu(p) {
            phieu = p || null;
            zp('pTen').textContent = p ? '— ' + e(p.TENPHIEU) : '— thêm mới';
            pf('ma').value = p ? e(p.MAPHIEU) : ''; pf('ten').value = p ? e(p.TENPHIEU) : ''; pf('mota').value = p ? e(p.MOTA) : '';
            zp('pSua').hidden = !p;
            if (p) {
                setDT('');
                ums.api.call({ action: C + 'LayDSKS_PhieuKhaoSat_DuocKS', method: 'GET', strKS_PhieuKhaoSat_Id: p.ID, strNguoiThucHien_Id: uid(), silent: true })
                    .then(function (r) { var d = arr(r.data)[0]; if (d) setDT(d.KS_DOITUONGDUOCKHAOSAT_ID); }).catch(function () {});
                taiThamGia();
            }
            ctx.show('phieu');
            pf('ma').focus();
        }
        function taiThamGia() {
            zp('tg').innerHTML = zp('ctg').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            ums.api.call({ action: C + 'LayDSKS_PhieuKhaoSatThamGiaKS', method: 'GET', strTuKhoa: '', strKS_PhieuKhaoSat_Id: phieu.ID, strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 100000 })
                .then(function (r) {
                    dsTG = arr(r.data);
                    ui.table({ el: zp('tg'), rows: dsTG, empty: 'Chưa có đối tượng tham gia', columns: [
                        { title: 'Mã', prop: 'KS_DOITUONGTHAMGIAKHAOSAT_MASO', cls: 'is-nowrap' },
                        { title: 'Tên', render: function (x, i) {
                            return '<a href="javascript:void(0)" class="ums-link" data-p="xemTG" data-i="' + i + '" title="Xem phiếu thực hiện">' + esc(e(x.KS_DOITUONGTHAMGIAKHAOSAT_TEN)) + '</a>';
                        } },
                        { title: 'Mô tả', prop: 'MOTA' }, cotChon() ] });
                }).catch(function (err) { zp('tg').innerHTML = ui.fail(err.message); ums.api.handle(err, 'đối tượng tham gia'); });
            ums.api.call({ action: C + 'LayDS_DoiTuongThamGiaChuaDung', method: 'GET', strKS_PhieuKhaoSat_Id: phieu.ID, strKS_PhieuKhaoSat_Mau_Id: e(kh.KS_PHIEUKHAOSAT_MAU_ID),
                strKS_KeHoachKhaoSat_Id: kh.ID, strNguoiThucHien_Id: uid() })
                .then(function (r) {
                    dsCTG = arr(r.data);
                    ui.table({ el: zp('ctg'), rows: dsCTG, empty: 'Không còn đối tượng', columns: [
                        { title: 'Mã', prop: 'MASO', cls: 'is-nowrap' }, { title: 'Tên', prop: 'TEN' }, { title: 'Mô tả', prop: 'MOTA' }, cotChon() ] });
                }).catch(function (err) { zp('ctg').innerHTML = ui.fail(err.message); ums.api.handle(err, 'đối tượng chưa tham gia'); });
        }
        function khoiTao() {
            ums.api.call({ action: T + 'KhoiTaoPhieuTheoPhieuMau', method: 'POST', strId: phieu ? phieu.ID : '', strKS_KeHoachKhaoSat_Id: kh.ID,
                strKS_PhieuKhaoSat_Mau_Id: e(kh.KS_PHIEUKHAOSAT_MAU_ID), strMaPhieu: pf('ma').value.trim(), strTenPhieu: pf('ten').value.trim(),
                strMoTa: pf('mota').value.trim(), strNguoiThucHien_Id: uid() }).then(function (r) {
                ui.toast(phieu ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok');
                var id = phieu ? phieu.ID : ((r.raw && r.raw.Id) || '');
                taiPhieu().then(function () {
                    var p = dsPhieu.filter(function (x) { return x.ID === id; })[0] || (id ? { ID: id, TENPHIEU: pf('ten').value.trim(), MAPHIEU: pf('ma').value.trim(), MOTA: pf('mota').value.trim() } : null);
                    if (p) moPhieu(p);
                });
                ctx.reloadList();
            }).catch(function (err) { ums.api.handle(err, 'khởi tạo phiếu'); });
        }
        function genPhieu() {
            var t0 = Date.now(), dlg = ui.dialog({ title: 'Đang gen phiếu khảo sát...', icon: 'fa-spinner fa-spin', size: 'sm',
                body: '<div class="ums-u-center"><div class="ks-dem" data-z="giay">0 giây</div><div class="ums-u-muted ums-u-fz13" data-z="loi">Hệ thống đang xử lý, vui lòng không đóng trang.</div></div>' });
            var chay = setInterval(function () {
                var s = Math.round((Date.now() - t0) / 1000), g = dlg.body.querySelector('[data-z="giay"]'), l = dlg.body.querySelector('[data-z="loi"]');
                if (g) g.textContent = s + ' giây';
                if (l) l.textContent = s >= 120 ? 'Dữ liệu lớn, vẫn đang xử lý…' : s >= 60 ? 'Sắp xong, vui lòng đợi thêm…' : s >= 30 ? 'Đang tạo phiếu cho các đối tượng…' : s >= 15 ? 'Đang xử lý dữ liệu…' : 'Hệ thống đang xử lý, vui lòng không đóng trang.';
            }, 1000);
            ums.api.call({ action: T + 'GenPhieuBanTuDong', method: 'POST', strKS_KeHoachKhaoSat_Id: kh.ID, strKS_PhieuKhaoSat_Id: phieu ? phieu.ID : '', strNguoiThucHien_Id: uid() })
                .then(function () { clearInterval(chay); dlg.close(); ui.toast('Thực hiện thành công!', 'ok'); ctx.reloadList(); })
                .catch(function (err) { clearInterval(chay); dlg.close(); ums.api.handle(err, 'gen phiếu'); });
        }

        /* ================= Phiếu tự động ================= */
        var TAB = [
            { key: 'gv', text: 'Khảo sát theo GV / không phân biệt học phần dạy', mota: '1 GV giảng dạy nhiều học phần và 1 học phần được giảng dạy bởi nhiều GV --> Khảo sát theo GV, không phân biệt học phần dạy',
              xem: 'Xem DS GV Theo TKB', ds: 'LayDSGiangVienTheoThoiGian',
              cols: [{ title: 'Mã số', prop: 'MASO' }, { title: 'Họ đệm', prop: 'HODEM' }, { title: 'Tên', prop: 'TEN' }, { title: 'Đơn vị', prop: 'DONVI_TEN' }] },
            { key: 'hp', text: 'Khảo sát theo học phần / không quan tâm là GV nào dạy', mota: '1 học phần có nhiều GV giảng dạy --> Khảo sát theo học phần, không quan tâm là GV nào dạy',
              xem: 'Xem DS Học phần Theo TKB', ds: 'LayDSHocPhanTheoThoiGian',
              cols: [{ title: 'Mã học phần', prop: 'MA' }, { title: 'Tên học phần', prop: 'TEN' }, { title: 'Học trình', prop: 'HOCTRINH', cls: 'is-center' }, { title: 'Đơn vị', prop: 'DONVI_TEN' }] },
            { key: 'lop', text: 'Khảo sát theo 1 học phần / 1 GV giảng dạy', mota: '1 học phần 1 GV giảng dạy',
              xem: 'Xem DS GV - lớp HP theo TKB', ds: 'LayDSLopHocPhanTheoThoiGian',
              cols: [{ title: 'Giảng viên', render: function (r) { var t = e(r.GIANGVIEN_TEN).trim(); return t ? esc(t) : '<i class="ks-thieu">Chưa có giảng viên</i>'; } },
                     { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA' }, { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                     { title: 'Tên lớp học phần', prop: 'TENLOP' }, { title: 'Thời gian', prop: 'THOIGIAN' }] }
        ];
        var dsTab = {}, tab = 'gv';
        zT.innerHTML = pat.page('Quản lý kế hoạch', '') + pat.panel({
            title: 'Chỉnh sửa - Phiếu tự động', icon: 'fa-wand-magic-sparkles', count: 'tTen', flush: true,
            tools: ui.btn('close', { attr: { 'data-p': 'dongT' } }),
            body: ui.tabs(TAB.map(function (t) { return { key: t.key, text: t.text }; }), tab, 'data-ktab') +
                TAB.map(function (t) {
                    return '<div class="ks-tab" data-tpane="' + t.key + '"' + (t.key === tab ? '' : ' hidden') + '>' +
                        '<div class="ks-mota">' + esc(t.mota) + '</div>' +
                        '<div class="ums-filter">' +
                            '<div class="ums-field"><select class="ums-select" multiple data-tg="' + t.key + '" data-ph="Chọn thời gian"></select></div>' +
                            (t.key === 'lop' ? '<div class="ums-field"><select class="ums-select" multiple data-kql="1" data-ph="Chọn 1 hoặc nhiều khoa quản lý"></select></div>' : '') +
                            '<div class="ums-field ums-field--fit">' + ui.btn('search', { text: t.xem, attr: { 'data-p': 'xemTab', 'data-t': t.key } }) + '</div>' +
                            (t.key === 'lop' ? '<div class="ums-field ums-field--fit">' + ui.btn('save', { text: 'Chạy tiến trình tạo phiếu', mod: 'danger', attr: { 'data-p': 'taoTab', 'data-t': t.key, 'data-tt': '1' } }) + '</div>' : '') +
                            '<div class="ums-field ums-field--fit">' + ui.btn('save', { text: 'Tạo phiếu tự động', attr: { 'data-p': 'taoTab', 'data-t': t.key, 'data-tt': '0' } }) + '</div>' +
                        '</div>' +
                        '<div data-tb="' + t.key + '">' + ui.empty('Chọn thời gian rồi bấm "' + t.xem + '"', 'fa-filter') + '</div></div>';
                }).join('')
        });
        ui.enhance(zT);
        banChon(zT);
        function tq(sel) { return zT.querySelector(sel); }
        ums.api.call({ action: C + 'LayDSThoiGianDangKyHoc', method: 'GET', strNguoiThucHien_Id: uid(), silent: true }).then(function (r) {
            TAB.forEach(function (t) { pat.fill(tq('[data-tg="' + t.key + '"]'), arr(r.data), { name: 'THOIGIAN' }); });
        }).catch(function (err) { ums.api.handle(err, 'thời gian'); });
        ums.ref.coCauToChuc({}).then(function (d) { pat.fill(tq('[data-kql="1"]'), d, { name: 'TEN' }); }).catch(function (err) { ums.api.handle(err, 'khoa quản lý'); });
        zT.addEventListener('click', function (ev) {
            var a = ev.target.closest('[data-ktab]');
            if (!a) return;
            tab = a.getAttribute('data-ktab');
            ui.tabsActive(zT, tab, 'data-ktab');
            Array.prototype.forEach.call(zT.querySelectorAll('[data-tpane]'), function (p) { p.hidden = p.getAttribute('data-tpane') !== tab; });
        });
        function tgTab(k) { return pat.val(tq('[data-tg="' + k + '"]')); }
        function xemTab(k) {
            var t = TAB.filter(function (x) { return x.key === k; })[0], el = tq('[data-tb="' + k + '"]');
            if (!tgTab(k)) { ui.toast('Vui lòng chọn ít nhất 1 thời gian!', 'warn'); return; }
            el.innerHTML = ui.empty('Đang tải dữ liệu, vui lòng đợi...', 'fa-spinner fa-spin');
            ums.api.call({ action: C + t.ds, method: 'GET', strKS_KeHoachKhaoSat_Id: kh.ID, strKS_PhieuKhaoSat_Mau_Id: e(kh.KS_PHIEUKHAOSAT_MAU_ID),
                strNguoiThucHien_Id: uid(), strDaoTao_ThoiGianDaoTao_Id: tgTab(k) }).then(function (r) {
                dsTab[k] = arr(r.data);
                ui.table({ el: el, rows: dsTab[k], empty: 'Không có dữ liệu', columns: t.cols.concat([cotChon()]) });
            }).catch(function (err) { el.innerHTML = ui.fail(err.message); ums.api.handle(err, t.xem); });
        }
        function taoTab(k, tienTrinh) {
            var ids = chon(tq('[data-tb="' + k + '"]')).map(function (i) { return dsTab[k][i].ID; });
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
            var tg = tgTab(k), mau = e(kh.KS_PHIEUKHAOSAT_MAU_ID);
            if (k === 'gv' || k === 'hp') {
                ui.batch(ids.map(function (id) {
                    var x = { action: T + (k === 'gv' ? 'GenPhieuTuDongTrucTiepGV1' : 'GenPhieuTuDongTrucTiepGV2'), method: 'POST' };
                    x[k === 'gv' ? 'strGiangVien_Id' : 'strDaoTao_HocPhan_Id'] = id;
                    x.strKS_KeHoachKhaoSat_Id = kh.ID; x.strKS_PhieuKhaoSat_Mau_Id = mau; x.strDaoTao_ThoiGianDaoTao_Id = tg; x.strNguoiThucHien_Id = uid();
                    return x;
                }), { title: 'Đang tạo phiếu khảo sát', okText: 'Thực hiện thành công' }).then(taiPhieu);
                return;
            }
            var khoa = pat.val(tq('[data-kql="1"]'));
            ui.confirm('Sẽ tạo phiếu cho ' + ids.length + ' lớp học phần. Bạn có muốn tiếp tục?', { title: 'Tạo phiếu tự động' }).then(function (yes) {
                if (!yes) return;
                ui.batch(ids.map(function (id) {
                    return { action: 'TS_KS_TaoPhieu_MH/BiQvESkoJDQVNAUuLyYVMzQiFSgkMQYXcgPP', func: 'khaosat_taophieu.GenPhieuTuDongTrucTiepGV3', method: 'POST',
                        iChayTienTrinh: tienTrinh, strKS_KeHoachKhaoSat_Id: kh.ID, strKS_PhieuKhaoSat_Mau_Id: mau, strDaoTao_LopHocPhan_Id: id,
                        strDaoTao_ThoiGianDaoTao_Id: tg, strDaoTao_KhoaQuanLy_Id: khoa || '', strNguoiThucHien_Id: uid() };
                }), { title: tienTrinh ? 'Đang chạy tiến trình tạo phiếu khảo sát...' : 'Đang tạo phiếu khảo sát (chạy ngay)...', okText: 'Hoàn tất! Đã xử lý' }).then(taiPhieu);
            });
        }

        /* ================= Sự kiện chung ================= */
        [zDs, zP, zT].forEach(function (z) {
            z.addEventListener('click', function (ev) {
                var b = ev.target.closest('[data-p]');
                if (!b || b.disabled) return;
                var a = b.getAttribute('data-p'), i = Number(b.getAttribute('data-i'));
                if (a === 'dong') ctx.show('ds');
                else if (a === 'them') moPhieu(null);
                else if (a === 'sua') moPhieu(dsPhieu[i]);
                else if (a === 'cautruc') {
                    var p = dsPhieu[i];
                    window.open(host() + '/congthongtin/pages/phieukhaosat.aspx?strPhieu_Id=' + encodeURIComponent(p.ID) + '&strKeHoach_Id=' + encodeURIComponent(e(p.KS_KEHOACHKHAOSAT_ID)) +
                        '&strNguoiThucHien_Id=' + encodeURIComponent(uid()), '_blank', 'location=yes,height=' + screen.height + ',width=' + screen.width + ',scrollbars=yes,status=yes');
                }
                else if (a === 'xoa') {
                    var ids = chon(zd('dsBang')).map(function (k) { return dsPhieu[k].ID; });
                    if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
                    ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá phiếu' }).then(function (yes) {
                        if (yes) ui.batch(ids.map(function (id) { return { action: C + 'Xoa_KS_PhieuKhaoSat', method: 'POST', strId: id, strNguoiThucHien_Id: uid() }; }),
                            { title: 'Đang xoá phiếu', okText: 'Xóa thành công!' }).then(taiPhieu);
                    });
                }
                else if (a === 'tudong') { zT.querySelector('[data-z="tTen"]').textContent = '— ' + e(kh.TENKEHOACH); ctx.show('tudong'); }
                else if (a === 'dongP' || a === 'dongT') ctx.show('dsphieu');
                else if (a === 'khoitao') khoiTao();
                else if (a === 'gen') genPhieu();
                else if (a === 'luuDT') {
                    ums.api.call({ action: C + 'Them_KS_PhieuKhaoSat_DuocKS', method: 'POST', strKS_PhieuKhaoSat_Id: phieu.ID, strKS_DoiTuongDuocKS_Id: pf('dt').value, strNguoiThucHien_Id: uid() })
                        .then(function () { ui.toast('Thêm mới thành công!', 'ok'); ctx.reloadList(); }).catch(function (err) { ums.api.handle(err, 'lưu theo phiếu'); });
                }
                else if (a === 'themTG') {
                    var c1 = chon(zp('ctg')).map(function (k) { return dsCTG[k].ID; });
                    if (!c1.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
                    ui.batch(c1.map(function (id) { return { action: C + 'Them_KS_PhieuKhaoSat_ThamGiaKS', method: 'POST', strKS_PhieuKhaoSat_Id: phieu.ID, strKS_DoiTuongThamGiaKS_Id: id, strNguoiThucHien_Id: uid() }; }),
                        { title: 'Đang thêm đối tượng tham gia', okText: 'Thêm mới thành công!' }).then(function () { taiThamGia(); ctx.reloadList(); });
                }
                else if (a === 'xoaTG') {
                    var c2 = chon(zp('tg')).map(function (k) { return dsTG[k].ID; });
                    if (!c2.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
                    ui.confirm('Bỏ ' + c2.length + ' đối tượng khỏi phiếu?', { tone: 'bad', ok: 'Xoá', title: 'Xoá đối tượng tham gia' }).then(function (yes) {
                        if (yes) ui.batch(c2.map(function (id) { return { action: C + 'Xoa_KS_PhieuKhaoSat_ThamGiaKS', method: 'POST', strId: id, strNguoiThucHien_Id: uid() }; }),
                            { title: 'Đang xoá', okText: 'Xóa thành công!' }).then(taiThamGia);
                    });
                }
                else if (a === 'xemTG') {
                    var x = dsTG[i];
                    window.open(host() + '/congthongtin/pages/thuchienkhaosat.aspx?strPhieu_Id=' + encodeURIComponent(phieu.ID) + '&strNguoiThucHien_Id=' + encodeURIComponent(e(x.KS_DOITUONGTHAMGIAKHAOSAT_ID)), '_blank');
                }
                else if (a === 'xemTab') xemTab(b.getAttribute('data-t'));
                else if (a === 'taoTab') taoTab(b.getAttribute('data-t'), Number(b.getAttribute('data-tt')));
            });
        });

        return {
            mo: function (row) {
                kh = row;
                zd('dsTen').textContent = '— ' + e(row.TENKEHOACH);
                ctx.show('dsphieu');
                taiPhieu(); taiDoiTuongDuocKS();
            }
        };
    };
})();
