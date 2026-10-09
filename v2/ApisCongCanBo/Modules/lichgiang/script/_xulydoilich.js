/* =========================================================================
   Duyệt yêu cầu đổi lịch — khung chung của lichgiangdaotao (Phòng đào tạo xử lý)
   và lichgiangkhoa (Khoa duyệt) — ums.lg.xuLyDoiLich(root, cfg)
   Bản gốc: lichgiangdaotao.js / lichgiangkhoa.js (bản chép của nhau). Hộp xem
   một yêu cầu dùng lại ums.lg.doiLich.xem (_lichgiang_doilich.js).
   ---------------------------------------------------------------------------
   Lời gọi chung (kiểu cũ, controller KHCT_LichGiang_DoiLich, GET):
       LayThoiGian                 ô Học kỳ
       LayTTLichGiang_Doi          xem một yêu cầu
       Danh mục TKB.LICHGIANG.DUYETDOILICH / XACNHANDOILICH   ô lọc trạng thái / kết quả
   Riêng từng màn: cfg.dsHocPhan, cfg.dsNguoiGui, cfg.ds (danh sách), cfg.trangThai,
   cfg.lichSu, cfg.luu, cfg.sauLuu — xem chú thích đầu từng màn.

   Không chép (lỗi rõ của bản gốc, chung hai màn):
     · Đổi Học kỳ gọi lại Khoa / Học phần / Người gửi / danh sách CÙNG LÚC, ba lời
       gọi sau vẫn mang giá trị cũ của ô vừa bị thay. Ở đây nạp theo thứ tự.
     · Đổi bộ lọc không về trang 1.
     · Nút "Xác nhận" gắn thêm một trình xử lý #btnYes mỗi lần bấm → lưu nhiều lần.
     · Lưu xong không nạp lại danh sách / lịch sử → bảng hiện trạng thái cũ.
     · Duyệt hàng loạt: một cảnh báo cho MỖI dòng (bản daotao còn gọi đồng bộ,
       treo trang). Ở đây một hộp tiến độ, báo gộp.
     · Không kiểm đã chọn trạng thái trước khi lưu.
   Giữ như bản gốc: duyệt một dòng có hỏi lại, duyệt hàng loạt không hỏi;
   nội dung phê duyệt (strNoiDung) luôn rỗng — hộp gốc không có ô nhập.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var lg = ums.lg = ums.lg || {};
    var C = 'KHCT_LichGiang_DoiLich/';
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    lg.C = C;
    lg.get = function (m, o) { return ums.api.call(Object.assign({ action: C + m, method: 'GET', strNguoiThucHien_Id: uid() }, o || {})); };
    lg.tenNguoiGui = function (r) { return e(r.NGUOIYEUCAU_MASO) + ' - ' + e(r.NGUOIYEUCAU_HODEM) + ' ' + e(r.NGUOIYEUCAU_TEN); };

    lg.xuLyDoiLich = function (root, cfg) {
        var loc = [{ key: 'hk', label: 'Chọn học kỳ', type: 'select' }];
        if (cfg.coKhoa) loc.push({ key: 'khoa', label: 'Chọn khoa quản lý', type: 'select' });
        loc.push({ key: 'tu', label: 'Từ ngày', type: 'date' }, { key: 'den', label: 'Đến ngày', type: 'date' },
            { key: 'hp', label: 'Chọn học phần', type: 'select' }, { key: 'ng', label: 'Chọn người gửi', type: 'select' },
            { key: 'tt', label: 'Chọn trạng thái duyệt yêu cầu', type: 'select' }, { key: 'kq', label: 'Chọn kết quả xử lý', type: 'select' });
        root.innerHTML =
            pat.page(cfg.tieuDe, (cfg.baoCao ? '<div data-z="bc"></div>' : '') + ui.btn('save', { text: 'Duyệt', icon: 'fa-check-double', attr: { 'data-a': 'duyet' } })) +
            pat.filterBar(loc, { searchText: 'Xem' }) +
            pat.panel({ title: cfg.tenBang, icon: 'fa-calendar-pen', count: 'n', flush: true, zone: 'bang' });
        ui.enhance(root);
        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
        function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
        var trang = { index: 1, size: 10 }, ds = [];

        /* ---------- Bộ lọc ----------------------------------------------- */
        lg.get('LayThoiGian').then(function (r) { pat.fill(f('hk'), arr(r.data), { name: 'THOIGIAN' }); dong.forEach(function (c) { c.sync(); }); })
            .catch(function (err) { ums.api.handle(err, 'học kỳ'); });
        ums.api.dm('TKB.LICHGIANG.DUYETDOILICH').then(function (d) { pat.fill(f('tt'), d, { name: 'TEN' }); }).catch(function () {});
        ums.api.dm('TKB.LICHGIANG.XACNHANDOILICH').then(function (d) { pat.fill(f('kq'), d, { name: 'TEN' }); }).catch(function () {});
        function v(k) { var el = f(k); return el ? el.value.trim() : ''; }
        function napKhoa() {
            if (!cfg.coKhoa) return Promise.resolve();
            if (!v('hk')) { pat.fill(f('khoa'), []); return Promise.resolve(); }
            return lg.get('LayDSKhoaQuanLyChuyenMon', { strDaoTao_ThoiGianDaoTao_Id: v('hk') })
                .then(function (r) { pat.fill(f('khoa'), arr(r.data), { name: 'DAOTAO_KHOAQUANLY_TEN' }); }).catch(function (err) { ums.api.handle(err, 'khoa quản lý'); });
        }
        function napHocPhan() {
            if (!v('hk') || (cfg.coKhoa && !v('khoa'))) { pat.fill(f('hp'), []); return Promise.resolve(); }
            return cfg.dsHocPhan(v).then(function (d) { pat.fill(f('hp'), d, { name: 'TEN' }); }).catch(function (err) { ums.api.handle(err, 'học phần'); });
        }
        function napNguoiGui() {
            if (!cfg.nguoiGuiSan(v)) { pat.fill(f('ng'), []); return Promise.resolve(); }
            return cfg.dsNguoiGui(v).then(function (d) { pat.fill(f('ng'), d, { name: lg.tenNguoiGui }); }).catch(function (err) { ums.api.handle(err, 'người gửi'); });
        }
        function tuDau() { trang.index = 1; return tai(); }
        if (window.jQuery) {
            var $ = jQuery;
            $(f('hk')).on('select2:select select2:clear', function () { napKhoa().then(napHocPhan).then(napNguoiGui).then(tuDau); });
            if (cfg.coKhoa) $(f('khoa')).on('select2:select select2:clear', function () { napHocPhan().then(napNguoiGui).then(tuDau); });
            $(f('hp')).on('select2:select select2:clear', function () { (cfg.nguoiGuiTheoHP ? napNguoiGui() : Promise.resolve()).then(tuDau); });
            $([f('ng'), f('tt'), f('kq')]).on('select2:select select2:clear', tuDau);
        }
        var dong = cfg.chuoi(f).map(function (c) { return pat.chain(c, { phatLai: false }); });

        /* ---------- Danh sách -------------------------------------------- */
        function tai() {
            z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return cfg.ds(v, trang).then(function (r) {
                ds = arr(r.data);
                var tong = Number(r.pager) || ds.length;
                z('n').textContent = '(' + tong + ')';
                ui.table({
                    el: z('bang'), rows: ds, empty: 'Không có yêu cầu đổi lịch',
                    page: { index: trang.index, size: trang.size, total: tong, onChange: function (p) { trang.index = p; tai(); }, onSize: function (s) { trang.size = s; tuDau(); } },
                    columns: [
                        { title: 'Học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                        { title: 'Lớp học phần', prop: 'LOPHOCPHAN_TEN' },
                        { title: 'Người gửi yêu cầu', prop: 'NGUOIYEUCAU_TAIKHOAN' },
                        { title: 'Thời gian gửi yêu cầu', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap' },
                        { title: 'Người duyệt yêu cầu', prop: 'NGUOIDUYET_TAIKHOAN' },
                        { title: 'Thời gian - trạng thái duyệt yêu cầu', render: function (x) { return esc(e(x.THOIGIANDUYET) + ' - ' + e(x.TINHTRANGDUYET_TEN)); } },
                        { title: 'Người xử lý', prop: 'NGUOIXULY_TAIKHOAN' },
                        { title: 'Thời gian kết quả xử lý', cls: 'is-center', render: function (x) { return esc(e(x.THOIGIANXULY) + ' - ' + e(x.KETQUAXULY) + ' - ' + e(x.NOIDUNGXULY)); } },
                        { title: 'Xem chi tiết yêu cầu', cls: 'is-center', width: '90px', render: function (x, i) {
                            return '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm" data-xem="' + i + '"><i class="fa-light fa-magnifying-glass"></i><span>Xem</span></button>'; } },
                        { head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (x, i) { return '<input type="checkbox" data-ck="' + i + '">'; } }
                    ]
                });
            }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách yêu cầu đổi lịch'); });
        }
        tai();
        function daChon() {
            return Array.prototype.filter.call(z('bang').querySelectorAll('input[data-ck]:checked'), function (c) { return c.getAttribute('data-ck') !== 'all'; })
                .map(function (c) { return ds[Number(c.getAttribute('data-ck'))]; }).filter(Boolean);
        }
        if (cfg.baoCao) ums.report.mount(z('bc'), { collect: function (add) { cfg.baoCao(add, v); } });

        /* ---------- Phê duyệt -------------------------------------------- */
        function oTrangThai(B) { var s = B.querySelector('[data-pd="tt"]'); cfg.trangThai().then(function (d) { pat.fill(s, d, { name: 'TEN' }); }).catch(function () {}); return s; }
        function luuMot(id, tt) {
            return cfg.luu(id, tt).then(function (r) { if (cfg.sauLuu) cfg.sauLuu(id); return r; });
        }
        function duyetMot(item, dlgXem) {
            var dlg = ui.dialog({ title: 'Phê duyệt', icon: 'fa-stamp', size: 'md',
                body: ui.field('Trạng thái', '<select class="ums-select" data-pd="tt" data-ph="Chọn trạng thái"><option value=""></option></select>') +
                    '<div class="ums-legend ums-legend--cach">Lịch sử</div><div data-pd="ls">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>',
                buttons: [{ text: 'Xác nhận', kind: 'save', onClick: function () {
                    var tt = s.value;
                    if (!tt) { ui.toast('Chọn trạng thái', 'warn'); return false; }
                    ui.confirm('Bạn có chắc chắn phê duyệt không?', { title: 'Phê duyệt' }).then(function (yes) {
                        if (!yes) return;
                        return luuMot(item.ID, tt).then(function () { ui.toast('Thực hiện thành công!', 'ok'); dlg.close(); if (dlgXem) dlgXem.close(); tai(); });
                    }).catch(function (err) { ums.api.handle(err, 'phê duyệt'); });
                    return false;
                } }] });
            ui.enhance(dlg.body);
            var s = oTrangThai(dlg.body), ls = dlg.body.querySelector('[data-pd="ls"]');
            cfg.lichSu(item.ID).then(function (r) {
                ui.table({ el: ls, rows: arr(r.data), empty: 'Chưa có lịch sử', columns: [
                    { title: 'Trạng thái', prop: 'TEN' }, { title: 'Người xác nhận', prop: 'NGUOIXACNHAN_TENDAYDU' },
                    { title: 'Thời gian', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap' }] });
            }).catch(function (err) { ls.innerHTML = ui.fail(err.message); });
        }
        function duyetNhieu() {
            var chon = daChon();
            if (!chon.length) { ui.toast('Vui lòng chọn đối tượng ?', 'warn'); return; }
            var dlg = ui.dialog({ title: 'Phê duyệt', icon: 'fa-stamp', size: 'sm',
                body: '<p class="ums-u-fz13 ums-u-muted">' + chon.length + ' yêu cầu đã chọn</p>' + ui.field('Trạng thái', '<select class="ums-select" data-pd="tt" data-ph="Chọn trạng thái"><option value=""></option></select>'),
                buttons: [{ text: 'Xác nhận', kind: 'save', onClick: function () {
                    if (!s.value) { ui.toast('Chọn trạng thái', 'warn'); return false; }
                    var tt = s.value;
                    ui.batch(chon.map(function (x) { return function () { return luuMot(x.ID, tt); }; }), { title: 'Đang phê duyệt', okText: 'Thực hiện thành công', show: true })
                        .then(function () { tai(); });
                } }] });
            ui.enhance(dlg.body);
            var s = oTrangThai(dlg.body);
        }

        root.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-xem]');
            if (b) {
                var item = ds[Number(b.getAttribute('data-xem'))];
                lg.doiLich.xem(item, { nut: cfg.nutXem.map(function (n) {
                    return n === 'duyet' ? { text: 'Phê duyệt', kind: 'save', onClick: duyetMot } : { text: 'Xóa', kind: 'del', disabled: true, title: 'Bản gốc chưa có chức năng xoá' };
                }) });
                return;
            }
            if (ev.target.closest('[data-a="duyet"]')) duyetNhieu();
            if (ev.target.closest('[data-a="search"]')) tuDau();
        });
        root.addEventListener('change', function (ev) {
            if (ev.target.getAttribute('data-ck') !== 'all') return;
            Array.prototype.forEach.call(z('bang').querySelectorAll('input[data-ck]'), function (c) { c.checked = ev.target.checked; });
        });
        return { tai: tai };
    };
})();
