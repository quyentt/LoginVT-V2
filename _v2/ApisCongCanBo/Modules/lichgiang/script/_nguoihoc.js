/* =========================================================================
   Danh sách người học theo lớp — khung chung của nguoihoc (giảng viên) và
   nguoihoctheokhoa (khoa quản lý) — ums.lg.nguoiHoc(root, cfg)
   Bản gốc: nguoihoc.js / nguoihoctheokhoa.js (bản chép của nhau).
   Hộp "Các buổi học theo thời khóa biểu": ums.lg.xemCacBuoi (_lichgiang_cacbuoi.js)
   — bản gốc của hai màn này chính là nguồn của hộp đó.
   ---------------------------------------------------------------------------
   Lời gọi chung (chép nguyên):
       DKH_BaoCao/LayDSDangKyHoc (GET)                           hộp "Chi tiết" — sinh viên của lớp (Data.rs)
       D_Chung_MH · pkg_diem_chung.LayDSHanhDongXacNhan          trạng thái xác nhận (theo lớp ĐẦU TIÊN đã chọn, như gốc)
       D_Chung_MH · pkg_diem_chung.LayDSDiem_XacNhan             lịch sử xác nhận
       D_Chung_MH · pkg_diem_chung.Them_Diem_XacNhan             "Đồng ý" — MỖI lớp đã chọn một lời gọi
   Loại xác nhận: XACNHAN_HOANTHANH_DIEMDANH (hoàn thành điểm danh);
   XACNHAN_HOANTHANH_NHAP (hoàn thành nhập điểm — chỉ xem lịch sử, nguoihoctheokhoa).
   Mẫu báo cáo: strNhanSu_HoSoCanBo_Id, strDaoTao_HocPhan_Id, strDaoTao_ThoiGianDaoTao_Id,
   và strDaoTao_LopHocPhan_Id lặp lại cho MỖI lớp đã chọn (như gốc).

   Không chép (lỗi rõ của bản gốc):
     · Đồng ý khi chưa chọn trạng thái; một cảnh báo cho MỖI lớp; không nạp lại.
     · Đổi thứ tự sắp xếp khi chưa chọn buổi → lỗi JS.
     · Đổi Thời gian nạp danh sách trước khi Học phần kịp xoá (lọc nhầm học phần cũ).
     · CRUD NS_HeSo_NguoiHoc chép từ màn hệ số, không có đường vào → bỏ.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var lg = ums.lg = ums.lg || {};
    var DC = 'D_Chung_MH/', PK = 'pkg_diem_chung.';
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }

    function lichSuXacNhan(host, lopId, loai) {
        host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({ action: DC + 'DSA4BRIFKCQsHhkgIg8pIC8P', func: PK + 'LayDSDiem_XacNhan', strTuKhoa: '', strDuLieuXacNhan: lopId, strLoaiXacNhan_Id: loai,
            strNguoiXacNhan_Id: '', strHanhDong_Id: '', strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 100000 }).then(function (r) {
            ui.table({ el: host, rows: arr(r.data), empty: 'Chưa có lịch sử xác nhận', columns: [
                { title: 'Trạng thái', prop: 'TEN' }, { title: 'Người thực hiện', prop: 'NGUOIXACNHAN_TENDAYDU' },
                { title: 'Thời gian', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap' }] });
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); });
    }
    lg.lichSuXacNhan = function (lop, loai, nhan) {
        var dlg = ui.dialog({ title: 'Xác nhận ' + nhan, icon: 'fa-clock-rotate-left', size: 'md', body: '<div class="ums-legend">Lịch sử xác nhận</div><div data-x="ls"></div>' });
        lichSuXacNhan(dlg.body.querySelector('[data-x="ls"]'), lop.ID, loai);
    };

    lg.nguoiHoc = function (root, cfg) {
        var loc = [{ key: 'tg', label: 'Chọn thời gian', type: 'select' }, { key: 'hp', label: 'Chọn học phần', type: 'select' }];
        if (cfg.coHe) loc.push({ key: 'he', label: 'Chọn hệ đào tạo', type: 'select' });
        root.innerHTML =
            pat.page(cfg.tieuDe, '<div data-z="bc"></div>' +
                ui.btn('save', { text: 'Xác nhận hoàn thành điểm danh tất cả các buổi học', icon: 'fa-clipboard-check', attr: { 'data-a': 'congbo' } })) +
            pat.filterBar(loc, { searchText: 'Danh sách' }) +
            pat.panel({ title: cfg.tieuDe, icon: 'fa-users', count: 'n', flush: true, zone: 'bang' });
        ui.enhance(root);
        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
        function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
        function v(k) { var el = f(k); return el ? el.value : ''; }
        var ds = [];

        /* ---------- Bộ lọc ----------------------------------------------- */
        var tang = cfg.coHe ? [f('tg'), f('hp'), f('he')] : [f('tg'), f('hp')];
        var chuoi = pat.chain(tang, { phatLai: false });
        cfg.dsThoiGian().then(function (d) {
            pat.fill(f('tg'), d, { name: 'THOIGIAN' });
            if (cfg.chonDau && d.length) { f('tg').value = d[0].ID; if (window.jQuery) jQuery(f('tg')).trigger('change.select2'); doiTG(); }
            chuoi.sync();
        }).catch(function (err) { ums.api.handle(err, 'thời gian'); });
        function napHP() {
            if (!v('tg')) { pat.fill(f('hp'), []); return Promise.resolve(); }
            return cfg.dsHocPhan(v).then(function (d) { pat.fill(f('hp'), d, { name: function (r) { return e(r.MA) + ' - ' + e(r.TEN); } }); chuoi.sync(); })
                .catch(function (err) { ums.api.handle(err, 'học phần'); });
        }
        function napHe() {
            if (!cfg.coHe) return Promise.resolve();
            if (!v('hp')) { pat.fill(f('he'), []); return Promise.resolve(); }
            return cfg.dsHe(v).then(function (d) { pat.fill(f('he'), d, { name: 'TEN' }); chuoi.sync(); }).catch(function (err) { ums.api.handle(err, 'hệ đào tạo'); });
        }
        function doiTG() { napHP().then(napHe).then(tai); }
        if (window.jQuery) {
            jQuery(f('tg')).on('select2:select select2:clear', doiTG);
            jQuery(f('hp')).on('select2:select select2:clear', function () { napHe().then(tai); });
            if (cfg.coHe) jQuery(f('he')).on('select2:select select2:clear', tai);
        }

        /* ---------- Danh sách lớp ---------------------------------------- */
        function tai() {
            z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return cfg.dsLop(v).then(function (d) {
                ds = d;
                z('n').textContent = '(' + ds.length + ')';
                ui.table({ el: z('bang'), rows: ds, empty: 'Không có lớp', columns: cfg.cot(ds).concat([
                    { title: 'Chi tiết', cls: 'is-center', width: '60px', render: function (x, i) {
                        return '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-ct="' + i + '" title="Chi tiết"><i class="fa-light fa-eye"></i></button>'; } },
                    { head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (x, i) { return '<input type="checkbox" data-ck="' + i + '">'; } }
                ]) });
            }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách lớp'); });
        }
        if (!cfg.chonDau) tai();
        function daChon() {
            return Array.prototype.filter.call(z('bang').querySelectorAll('input[data-ck]:checked'), function (c) { return c.getAttribute('data-ck') !== 'all'; })
                .map(function (c) { return ds[Number(c.getAttribute('data-ck'))]; }).filter(Boolean);
        }

        /* ---------- Hộp chi tiết: sinh viên của lớp ---------------------- */
        function chiTiet(r) {
            var dlg = ui.dialog({ title: e(r.TENLOP) + ' - Số lượng: ' + e(r.SOLUONG), icon: 'fa-users', size: 'xl', body: '<div data-x="sv">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
            var host = dlg.body.querySelector('[data-x="sv"]');
            ums.api.call({ action: 'DKH_BaoCao/LayDSDangKyHoc', method: 'GET', strTuKhoa: '', strReport_Id: '', strDaoTao_LopHocPhan_Id: r.ID, strNguoiThucHien_Id: uid() }).then(function (x) {
                ui.table({ el: host, rows: arr(x.data), empty: 'Lớp chưa có sinh viên', columns: [
                    { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' }, { title: 'Họ đệm', prop: 'QLSV_NGUOIHOC_HODEM' }, { title: 'Tên', prop: 'QLSV_NGUOIHOC_TEN' },
                    { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' }, { title: 'Lớp quản lý', prop: 'DAOTAO_LOPQUANLY_TEN', cls: 'is-center' },
                    { title: 'Chương trình', prop: 'DAOTAO_TOCHUCCHUONGTRINH_TEN' }, { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN' }, { title: 'Hệ đào tạo', prop: 'DAOTAO_HEDAOTAO_TEN' }] });
            }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'sinh viên của lớp'); });
        }

        /* ---------- Xác nhận hoàn thành điểm danh ------------------------ */
        function congBo() {
            var chon = daChon(), LOAI = 'XACNHAN_HOANTHANH_DIEMDANH';
            if (!chon.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
            var dlg = ui.dialog({ title: 'Xác nhận hoàn thành', icon: 'fa-clipboard-check', size: 'md',
                body: '<p class="ums-u-fz13 ums-u-muted">' + chon.length + ' lớp đã chọn</p>' +
                    ui.field('Trạng thái', '<select class="ums-select" data-x="tt" data-ph="Chọn xác nhận"><option value=""></option></select>') +
                    '<div class="ums-legend ums-legend--cach">Lịch sử xác nhận</div><div data-x="ls"></div>',
                buttons: [{ text: 'Đồng ý', kind: 'save', onClick: function () {
                    var tt = s.value;
                    if (!tt) { ui.toast('Chọn trạng thái xác nhận', 'warn'); return false; }
                    ui.batch(chon.map(function (r) {
                        return { action: DC + 'FSkkLB4FKCQsHhkgIg8pIC8P', func: PK + 'Them_Diem_XacNhan', strDiem_DanhSachHoc_Id: r.ID, strHanhDong_Id: tt, strLoaiXacNhan_Id: LOAI,
                            strThongTinXacNhan: '', strNguoiXacNhan_Id: uid(), strDuLieuXacNhan: r.ID, strNguoiThucHien_Id: uid() };
                    }), { title: 'Đang xác nhận', okText: 'Xác nhận thành công', show: true }).then(tai);
                } }] });
            ui.enhance(dlg.body);
            var s = dlg.body.querySelector('[data-x="tt"]');
            ums.api.call({ action: DC + 'DSA4BRIJIC8pBS4vJhkgIg8pIC8P', func: PK + 'LayDSHanhDongXacNhan', strLoaiXacNhan_Id: LOAI, strNguoiThucHien_Id: uid(), strDiem_DanhSachHoc_Id: chon[0].ID })
                .then(function (r) {
                    var d = arr(r.data);
                    pat.fill(s, d, { name: 'TEN' });
                    if (d.length === 1) { s.value = d[0].ID; if (window.jQuery) jQuery(s).trigger('change.select2'); }
                }).catch(function (err) { ums.api.handle(err, 'trạng thái xác nhận'); });
            lichSuXacNhan(dlg.body.querySelector('[data-x="ls"]'), chon[0].ID, LOAI);
        }

        ums.report.mount(z('bc'), { collect: function (add) {
            add('strNhanSu_HoSoCanBo_Id', uid()); add('strDaoTao_HocPhan_Id', v('hp')); add('strDaoTao_ThoiGianDaoTao_Id', v('tg'));
            daChon().forEach(function (r) { add('strDaoTao_LopHocPhan_Id', r.ID); });
        } });
        root.addEventListener('click', function (ev) {
            var b;
            if ((b = ev.target.closest('[data-ct]'))) { chiTiet(ds[Number(b.getAttribute('data-ct'))]); return; }
            if ((b = ev.target.closest('[data-cc]'))) {
                var r = ds[Number(b.getAttribute('data-cc'))];
                lg.xemCacBuoi({ IDLOPHOCPHAN: r.ID, TENLOPHOCPHAN: r.TENLOP }, null, Object.assign({ host: root }, cfg.hopBuoi(b.getAttribute('data-gv'))));
                return;
            }
            if ((b = ev.target.closest('[data-ls]'))) {
                var x = ds[Number(b.getAttribute('data-ls'))], diem = b.getAttribute('data-loai') === 'diem';
                lg.lichSuXacNhan(x, diem ? 'XACNHAN_HOANTHANH_NHAP' : 'XACNHAN_HOANTHANH_DIEMDANH', diem ? 'Điểm' : 'Điểm danh');
                return;
            }
            if ((b = ev.target.closest('[data-a]'))) {
                if (b.getAttribute('data-a') === 'search') tai();
                else if (b.getAttribute('data-a') === 'congbo') congBo();
            }
        });
        root.addEventListener('change', function (ev) {
            if (ev.target.getAttribute('data-ck') !== 'all') return;
            Array.prototype.forEach.call(z('bang').querySelectorAll('input[data-ck]'), function (c) { c.checked = ev.target.checked; });
        });
    };
})();
