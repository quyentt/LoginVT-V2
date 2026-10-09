/* =========================================================================
   Phân lịch giảng — khung chung của phanlichgiang (khoa phân giảng) và
   tracuulichgiang (giảng viên tra cứu — CHỈ XEM) — ums.plg.man(root, { sua })
   Bản gốc: phanlichgiang.js / tracuulichgiang.js (bản chép của nhau ~75%).
   ---------------------------------------------------------------------------
   Bố cục bản gốc: hai cột — trái (col-3) bộ lọc + "Danh sách lớp học phần";
   phải (col-9) thanh công cụ + "Danh sách lịch học" (hoặc khung "Kế thừa").
   Vùng CẢ BỀ NGANG thay chỗ hai cột: "Lịch phân giảng cho học phần" và
   "Danh sách bài học" (chỉ bản sửa).
   Lời gọi (kiểu cũ; GET trừ khi ghi — chép nguyên):
       KHCT_LichGiang/LayDSThoiGian (tự chọn mục ĐẦU) · LayDSHeDaoTao · LayDSHocPhan (dToanBo 0) · LayDSLopHocPhan
       ums.ref.coCauToChuc — ô Bộ môn (và Đơn vị thành viên ở bản sửa)
       KHCT_LichGiang/LayDSLich                                lịch học của lớp
       KHCT_LichGiang/LayDanhSach                              "Danh sách lịch phân giảng" (cả lớp)
       KHCT_LichGiang/LayDSLichPhanGiangChiTietId (POST)       theo buổi đã chọn — Id, Id2…Id5 mỗi phần 120 buổi
       KHCT_LichGiang/LayTTLichPhanGiang_BaiHoc                xem dòng trùng lịch khi lưu lỗi
       KHCT_LichGiang/ThemMoi · CapNhat · Xoa (POST)           (bản sửa)
       KHCT_BaiHoc/LayDanhSach · LayChiTiet · ThemMoi · CapNhat · Xoa   bài học (bản sửa)
       KHCT_LichGiang/LayDSLopHocPhanCanKeThua · KeThua (POST)  kế thừa (bản sửa)
       KHCT_XacNhanPhanGiang/LayDanhSach · ThemMoi (POST)       xác nhận; nút = danh mục TKB_PHANGIANG.XNKK (HESO1)
       KHCT_LichGiang_Import/Xoa (POST) + import IMPORTWITHPROC_LICHGIANG   (bản sửa)
       KHCT_TinhToan/TongHopGioGiangVaQuyDoi                   "Tổng hợp" (bản sửa)
       NS_HoSoV2/LayDanhSach (dLaCanBoNgoaiTruong 0)            ô Thành viên (theo đơn vị, chỉ gửi báo cáo)
       Danh sách mời giảng: _moigiang.js
   Không chép (lỗi rõ của bản gốc):
     · "Xem lịch phân giảng" cắt phần 120 buổi bỏ sót buổi thứ 121, 241… và mọi buổi quá 600.
     · Lưu / Thêm dòng / Xoá xong nạp lại SAI chế độ (mất danh sách đang xem).
     · Đổi học phần nạp lịch học của lớp CŨ; xác nhận xong mất lớp đang chọn.
     · So thay đổi so nhầm cột (LICHHOC_*), dòng không đổi vẫn bị lưu lại; báo "Không có thay đổi" không bao giờ hiện.
     · Bài học: liệt kê theo học phần của LỚP nhưng lưu theo ô Học phần; Thêm mới sau khi Sửa
       lại cập nhật bản ghi cũ; Xoá gọi N lần. Ở đây cùng một học phần, xoá một lần.
     · Xác nhận / Kế thừa / Import chạy khi chưa chọn lớp → gửi id rỗng.
     · Bản tra cứu: nút đóng mang hai lớp → hai trình xử lý chồng nhau; ô sửa được mà không lưu → khoá.
   Giữ như bản gốc: ô từ khoá KHÔNG gửi lên máy chủ — ở đây lọc tại chỗ danh sách lớp.
   Cờ cho bản chép ở phân hệ khác (mặc định = hành vi Cổng cán bộ):
     dToanBo: 0        tham số dToanBo của LayDSHocPhan (KHCT quantri_phanlichgiang gửi 1)
     ngoaiTruong: 0    dLaCanBoNgoaiTruong của NS_HoSoV2/LayDanhSach — ô Thành viên (KHCT gửi -1)
     bhSoTiet: true    cột "Số tiết" ở danh sách bài học (KHCT bỏ cột, biểu mẫu vẫn có ô Số tiết)
     nutXemLich        chữ nút xem lịch theo buổi đã chọn (mặc định 'Xem lịch Phân giảng'; KHCT 'Phân giảng')
     thuTuNut: [khoá]  thứ tự nút trên danh sách lịch học (khoá: xacnhan import moigiang kethua baihoc dslich xemlich)
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var plg = ums.plg = ums.plg || {};
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function cn() { return (ums.state && ums.state.chucNangId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    var L = 'KHCT_LichGiang/';
    function get(a, o) { return ums.api.call(Object.assign({ action: a, method: 'GET', strNguoiThucHien_Id: uid() }, o)); }
    function post(a, o) { return ums.api.call(Object.assign({ action: a, method: 'POST', strNguoiThucHien_Id: uid() }, o)); }
    function chon1(el, d) { if (d.length) { el.value = d[0].ID; if (window.jQuery) jQuery(el).trigger('change.select2'); return true; } return false; }

    plg.man = function (root, o) {
        var sua = !!o.sua;
        var dToanBo = o.dToanBo === undefined ? 0 : o.dToanBo, ngoaiTruong = o.ngoaiTruong === undefined ? 0 : o.ngoaiTruong;
        var chuXem = o.nutXemLich || 'Xem lịch Phân giảng';
        var nut = sua ? [['xacnhan', 'Xác nhận', 'save', 'fa-circle-check'], ['import', 'Import', 'out-info', 'fa-file-import'], ['moigiang', 'Danh sách mời giảng', 'out-primary', 'fa-user-plus'],
            ['kethua', 'Kế thừa', 'out-primary', 'fa-copy'], ['baihoc', 'Thêm bài học', 'out-primary', 'fa-book'], ['dslich', 'Danh sách lịch phân giảng', 'primary', 'fa-list'],
            ['xemlich', chuXem, 'primary', 'fa-calendar-check']] : [['dslich', 'Danh sách lịch phân giảng', 'primary', 'fa-list'], ['xemlich', chuXem, 'primary', 'fa-calendar-check']];
        if (o.thuTuNut) nut.sort(function (a, b) { return o.thuTuNut.indexOf(a[0]) - o.thuTuNut.indexOf(b[0]); });
        root.innerHTML =
            pat.page(o.tieuDe, '<div data-z="bc"></div>') +
            '<div data-z="hai" class="plg-hai">' +
                '<aside class="plg-trai">' + pat.panel({ title: false, body:
                    '<div class="ums-filter plg-loc">' +
                        '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                        ['tg:Chọn thời gian đào tạo', 'he:Chọn hệ đào tạo', 'bm:Chọn bộ môn', 'hp:Chọn học phần'].map(function (x) {
                            var p = x.split(':'); return '<div class="ums-field"><select class="ums-select" data-f="' + p[0] + '" data-ph="' + esc(p[1]) + '"><option value=""></option></select></div>'; }).join('') +
                        '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'tim' } }) + '</div></div>' }) +
                    '<div class="ums-u-mt-4">' + pat.panel({ title: 'Danh sách lớp học phần', icon: 'fa-users-rectangle', count: 'nLop', flush: true, zone: 'lop' }) + '</div>' +
                '</aside>' +
                '<div class="plg-phai">' +
                    (sua ? '<div class="plg-cc">' + ui.btn('save', { text: 'Tổng hợp', icon: 'fa-calculator', attr: { 'data-a': 'tonghop' } }) + '<div class="plg-cc__phai">' +
                        '<div class="ums-field"><select class="ums-select" data-f="dv" data-ph="Tất cả đơn vị thành viên"><option value=""></option></select></div>' +
                        '<div class="ums-field"><select class="ums-select" data-f="tv" data-ph="Tất cả thành viên đăng ký"><option value=""></option></select></div>' +
                        '<div class="ums-field plg-ngay"><input class="ums-input" data-f="tu" data-date placeholder="Từ ngày" autocomplete="off"></div>' +
                        '<div class="ums-field plg-ngay"><input class="ums-input" data-f="den" data-date placeholder="Đến ngày" autocomplete="off"></div></div></div>'
                        : '<div class="plg-cc"><b class="ums-u-navy">GV Tra cứu lịch giảng - xuất BC</b><div class="plg-cc__phai">' +
                        '<div class="ums-field plg-ngay"><input class="ums-input" data-f="tu" data-date placeholder="Từ ngày" autocomplete="off"></div>' +
                        '<div class="ums-field plg-ngay"><input class="ums-input" data-f="den" data-date placeholder="Đến ngày" autocomplete="off"></div></div></div>') +
                    '<div data-z="vungLich">' + pat.panel({ title: 'Danh sách lịch học', icon: 'fa-calendar-days', count: 'nLich', flush: true,
                        body: '<div class="plg-nut">' + nut.map(function (b) { return ui.btn(b[2] === 'save' ? 'save' : 'search', { text: b[1], mod: b[2], icon: b[3], cls: 'ums-btn--sm', attr: { 'data-a': b[0] } }); }).join('') +
                            '</div><div data-z="lich"></div>' }) + '</div>' +
                    '<div data-z="vungKT" hidden></div>' +
                '</div>' +
            '</div>' +
            '<div data-z="vungPG" hidden></div><div data-z="vungBH" hidden></div>';
        ui.enhance(root);
        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
        function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
        function v(k) { return f(k) ? f(k).value.trim() : ''; }
        var lop = null, dsLop = [], dsLich = [];
        z('lop').innerHTML = ui.empty('Chọn học phần để xem danh sách lớp', 'fa-hand-pointer');
        z('lich').innerHTML = ui.empty('Chọn một lớp học phần ở cột trái', 'fa-hand-pointer');
        function nhan() { return lop ? e(lop.TENLOPHOCPHAN) : ''; }
        function veNhan() { var t = z('vungLich').querySelector('.ums-panel__title'); if (t) t.innerHTML = '<i class="fa-light fa-calendar-days"></i> Danh sách lịch học' + (lop ? ' — <span class="plg-nhan">' + esc(nhan()) + '</span>' : '') + ' <span class="ums-u-faint ums-u-fz13" data-z="nLich"></span>'; }

        /* ---------- Bộ lọc ------------------------------------------------ */
        /* Học phần chỉ cần Thời gian (Hệ / Bộ môn là lọc thêm — như gốc) */
        var c1 = pat.chain([f('tg'), f('he')], { phatLai: false }), c2 = pat.chain([f('tg'), f('hp')], { phatLai: false });
        var chuoi = { sync: function () { c1.sync(); c2.sync(); } };
        function datLop() { lop = null; dsLop = []; z('lop').innerHTML = ui.empty('Chọn học phần để xem danh sách lớp', 'fa-hand-pointer'); z('nLop').textContent = ''; datLich(); }
        function datLich() { dsLich = []; veNhan(); z('lich').innerHTML = ui.empty('Chọn một lớp học phần ở cột trái', 'fa-hand-pointer'); }
        get(L + 'LayDSThoiGian', { strChucNang_Id: cn() }).then(function (r) {
            var d = arr(r.data); pat.fill(f('tg'), d, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn thời gian đào tạo' }); chuoi.sync();
            if (chon1(f('tg'), d)) napHe().then(napHP);                                  // gốc: tự chọn mục đầu
        }).catch(function (err) { ums.api.handle(err, 'thời gian đào tạo'); });
        ums.ref.coCauToChuc({}).then(function (d) { pat.fill(f('bm'), d, { name: 'TEN', head: 'Chọn bộ môn' }); if (f('dv')) pat.fill(f('dv'), d, { name: 'TEN', head: 'Tất cả đơn vị thành viên' }); })
            .catch(function (err) { ums.api.handle(err, 'đơn vị'); });
        function napHe() {
            if (!v('tg')) { pat.fill(f('he'), []); chuoi.sync(); return Promise.resolve(); }
            return get(L + 'LayDSHeDaoTao', { strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_HeDaoTao_Id: v('he'), strChucNang_Id: sua ? undefined : cn() }).then(function (r) {
                pat.fill(f('he'), arr(r.data), { name: 'TEN', head: 'Chọn hệ đào tạo' }); chuoi.sync();
            }).catch(function (err) { ums.api.handle(err, 'hệ đào tạo'); });
        }
        function napHP() {
            if (!v('tg')) { pat.fill(f('hp'), []); chuoi.sync(); return Promise.resolve(); }
            return get(L + 'LayDSHocPhan', { strDaoTao_CoCauToChuc_Id: v('bm'), strDaoTao_HeDaoTao_Id: v('he'), dToanBo: dToanBo, strDaoTao_ThoiGianDaoTao_Id: v('tg'), strChucNang_Id: cn() })
                .then(function (r) { pat.fill(f('hp'), arr(r.data), { name: function (x) { return e(x.MA) + ' - ' + e(x.TEN); }, head: 'Chọn học phần' }); chuoi.sync(); })
                .catch(function (err) { ums.api.handle(err, 'học phần'); });
        }
        if (window.jQuery) {
            jQuery(f('tg')).on('select2:select select2:clear', function () { datLop(); napHe().then(napHP); });
            jQuery([f('he'), f('bm')]).on('select2:select select2:clear', function () { datLop(); napHP(); });
            jQuery(f('hp')).on('select2:select select2:clear', function () { datLop(); if (v('hp')) taiLop(); });
        }

        /* ---------- Danh sách lớp ----------------------------------------- */
        function taiLop() {
            z('lop').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            var giu = lop && lop.ID;
            return get(L + 'LayDSLopHocPhan', { strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_HocPhan_Id: v('hp'), strChucNang_Id: cn() }).then(function (r) {
                dsLop = arr(r.data);
                z('nLop').textContent = '(' + (Number(r.pager) || dsLop.length) + ')';
                veLop(giu);
            }).catch(function (err) { z('lop').innerHTML = ui.fail(err.message); ums.api.handle(err, 'lớp học phần'); });
        }
        function veLop(giu) {
            var q = v('q').toLowerCase(), ds = dsLop.filter(function (x) { return !q || (e(x.TENLOPHOCPHAN) + ' ' + e(x.DAOTAO_HOCPHAN_MA) + ' ' + e(x.DAOTAO_HOCPHAN_TEN)).toLowerCase().indexOf(q) >= 0; });
            z('lop').innerHTML = ds.length ? '<div class="plg-lops">' + ds.map(function (x) {
                return '<button type="button" class="plg-lop' + (String(x.ID) === String(giu) ? ' is-active' : '') + '" data-lop="' + esc(x.ID) + '">' +
                    '<span>Tên lớp: <b>' + esc(e(x.TENLOPHOCPHAN)) + '</b></span><span>Mã học phần: ' + esc(e(x.DAOTAO_HOCPHAN_MA)) + '</span>' +
                    '<span>Học phần: ' + esc(e(x.DAOTAO_HOCPHAN_TEN)) + '</span><span>Tín chỉ: ' + esc(e(x.DAOTAO_HOCPHAN_SOTC)) + '</span><span>Số sinh viên: ' + esc(e(x.SOSINHVIEN)) + '</span>' +
                    (e(x.KETQUAXACNHAN_TEN) ? '<i class="plg-dau is-ok">' + esc(x.KETQUAXACNHAN_TEN) + '</i>' : '') + (String(x.DACHINHSUA) === '1' ? '<i class="plg-dau is-sua">Đã sửa</i>' : '') + '</button>';
            }).join('') + '</div>' : ui.empty('Không có lớp học phần', 'fa-users-slash');
        }
        function chonLop(id) {
            lop = dsLop.filter(function (x) { return String(x.ID) === String(id); })[0] || null;
            Array.prototype.forEach.call(z('lop').querySelectorAll('[data-lop]'), function (b) { b.classList.toggle('is-active', b.getAttribute('data-lop') === String(id)); });
            veVung('lich'); veNhan(); taiLich();
        }

        /* ---------- Lịch học ---------------------------------------------- */
        function taiLich() {
            if (!lop) { datLich(); return Promise.resolve(); }
            z('lich').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return get(L + 'LayDSLich', { strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_HocPhan_Id: v('hp'), strIdLopHocPhan: lop.ID, strChucNang_Id: sua ? undefined : cn() })
                .then(function (r) {
                    if (r.message) { ui.toast(r.message, 'info'); }
                    dsLich = arr(r.data);
                    z('nLich').textContent = '(' + (Number(r.pager) || dsLich.length) + ')';
                    ui.table({ el: z('lich'), rows: dsLich, empty: 'Lớp chưa có lịch học', columns: [
                        { title: 'Từ ngày', cls: 'is-center is-nowrap', render: function (x, i) { return i && dsLich[i - 1].NGAYBATDAU === x.NGAYBATDAU && dsLich[i - 1].NGAYKETTHUC === x.NGAYKETTHUC ? '' : esc(e(x.NGAYBATDAU)); } },
                        { title: 'Đến ngày', cls: 'is-center is-nowrap', render: function (x, i) { return i && dsLich[i - 1].NGAYBATDAU === x.NGAYBATDAU && dsLich[i - 1].NGAYKETTHUC === x.NGAYKETTHUC ? '' : esc(e(x.NGAYKETTHUC)); } },
                        { title: 'Ngày', prop: 'NGAYHOC', cls: 'is-center is-nowrap' }, { title: 'Thứ', prop: 'THUHOC', cls: 'is-center' },
                        { title: 'Phân giảng', cls: 'is-center', render: function (x, i) {
                            var da = x.PHANGIANG === 'DAPHANGIANG';
                            return '<button type="button" class="ums-btn ums-btn--sm ums-btn--' + (da ? 'out-primary' : 'primary') + '" data-pg="' + i + '"><span>' + (da ? 'Đã phân giảng' : 'Phân giảng') + '</span></button>'; } },
                        { head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (x, i) { return '<input type="checkbox" data-ck="' + i + '">'; } }
                    ] });
                }).catch(function (err) { z('lich').innerHTML = ui.fail(err.message); ums.api.handle(err, 'lịch học'); });
        }
        function daChon() { return Array.prototype.filter.call(z('lich').querySelectorAll('input[data-ck]:checked'), function (c) { return c.getAttribute('data-ck') !== 'all'; }).map(function (c) { return dsLich[Number(c.getAttribute('data-ck'))]; }).filter(Boolean); }
        function veVung(k) {
            z('hai').hidden = k === 'pg' || k === 'bh';
            z('vungPG').hidden = k !== 'pg'; z('vungBH').hidden = k !== 'bh';
            z('vungLich').hidden = k === 'kt'; z('vungKT').hidden = k !== 'kt';
        }

        /* ---------- Lịch phân giảng ------------------------------------------ */
        var che = null;          // { kieu: 'tatca' | 'id', ids: [] }
        function taiPG() {
            var h = z('vungPG').querySelector('[data-k="bang"]');
            h.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            var chung = { strDaoTao_HeDaoTao_Id: v('he'), strChucNang_Id: sua ? undefined : cn() }, p;
            if (che.kieu === 'tatca') p = get(L + 'LayDanhSach', Object.assign({ strIdLopHocPhan: lop ? lop.ID : '', strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_HocPhan_Id: v('hp') }, chung));
            else if (che.kieu === 'loi') p = get(L + 'LayTTLichPhanGiang_BaiHoc', { strId: che.ids[0], strChucNang_Id: sua ? undefined : cn() });
            else {
                var x = Object.assign({}, chung), phan = [];
                for (var i = 0; i < che.ids.length; i += 120) phan.push(che.ids.slice(i, i + 120).join(','));
                ['strTKB_LichGiang_HocPhan_Id', 'strTKB_LichGiang_HocPhan_Id2', 'strTKB_LichGiang_HocPhan_Id3', 'strTKB_LichGiang_HocPhan_Id4', 'strTKB_LichGiang_HocPhan_Id5'].forEach(function (k, j) { x[k] = phan[j] || ''; });
                if (phan.length > 5) ui.toast('Chỉ xem được 600 buổi một lần (máy chủ nhận 5 phần × 120) — bỏ bớt buổi đã chọn', 'warn');
                p = post(L + 'LayDSLichPhanGiangChiTietId', x);
            }
            return p.then(function (r) { vePG(r.data || {}); }).catch(function (err) { h.innerHTML = ui.fail(err.message); ums.api.handle(err, 'lịch phân giảng'); });
        }
        var pg = { rs: [] }, dmDiaDiem = [], dsBaiHoc = [];
        ums.api.dm('KHCT.DDPG').then(function (d) { dmDiaDiem = d || []; }).catch(function () {});
        function opt(ds, idk, ten, chon, dau) {
            return '<option value="">' + esc(dau) + '</option>' + (ds || []).map(function (x) {
                var id = e(x[idk || 'ID']); return '<option value="' + esc(id) + '"' + (id !== '' && id === String(e(chon)) ? ' selected' : '') + '>' + esc(typeof ten === 'function' ? ten(x) : e(x[ten])) + '</option>'; }).join('');
        }
        function vePG(d) {
            pg = { rs: arr(d), hd: d.rsHoatDong || [], gvTrong: d.rsGiangVienTrongTruong || [], gvMoi: d.rsGiangVienNgoaiTruong || [] };
            if (che.kieu === 'loi' && pg.rs[0]) z('vungPG').querySelector('[data-k="lbl"]').textContent = e(pg.rs[0].TENLOPHOCPHAN);
            var h = z('vungPG').querySelector('[data-k="bang"]'), khoa = sua ? '' : ' disabled';
            function o(r, k, v2, w) { return '<input class="ums-input ums-input--sm" data-o="' + k + '" value="' + esc(e(v2)) + '" style="width:' + (w || 56) + 'px"' + khoa + ' autocomplete="off">'; }
            function tenGV(x) { return e(x.HOTEN) + ' ' + e(x.MASO); }
            var LH = ['Lịch học'], PG = ['Phân giảng'], GV = ['Giảng viên'];
            ui.table({ el: h, rows: pg.rs, empty: 'Chưa có lịch phân giảng', tableCls: 'ums-table--lined plg-pg', columns: [
                { title: 'Ngày', cls: 'is-nowrap', render: function (r) { return sua ? o(r, 'ngay', r.NGAYHOC, 96) : esc(e(r.NGAYHOC)); } },
                { title: 'Số tiết', group: LH, cls: 'is-center', prop: 'LICHHOC_SOTIET' }, { title: 'Tiết bắt đầu', group: LH, cls: 'is-center', prop: 'LICHHOC_TIETBATDAU' },
                { title: 'Tiết kết thúc', group: LH, cls: 'is-center', prop: 'LICHHOC_TIETKETTHUC' },
                { title: 'Sĩ số', group: PG, cls: 'is-center', render: function (r) { return o(r, 'siso', r.SOSINHVIEN); } },
                { title: 'Số tiết', group: PG, cls: 'is-center', render: function (r) { return o(r, 'sotiet', r.SOTIET); } },
                { title: 'Tiết bắt đầu', group: PG, cls: 'is-center', render: function (r) { return o(r, 'tbd', r.TIETBATDAU); } },
                { title: 'Tiết kết thúc', group: PG, cls: 'is-center', render: function (r) { return o(r, 'tkt', r.TIETKETTHUC); } },
                { title: 'Bài học', render: function (r) { return '<select class="ums-select ums-input--sm" data-o="bh"' + khoa + '>' + opt(dsBaiHoc, 'ID', 'TENBAI', r.DAOTAO_BAIHOC_ID, 'Chọn bài học') + '</select>'; } },
                { title: 'Hoạt động (lý thuyết/thực hành)', render: function (r) { return '<select class="ums-select ums-input--sm" data-o="hd"' + khoa + '>' + opt(pg.hd, 'ID', 'TENHINHTHUCHOC', r.IDHINHTHUCHOC, 'Chọn hình thức học') + '</select>'; } },
                { title: 'Trong trường', group: GV, render: function (r) { return '<select class="ums-select ums-input--sm" data-o="gvt" data-s2' + khoa + '>' + opt(pg.gvTrong, 'ID', tenGV, r.NHANSU_HOSOCANBO_ID, 'Chọn GV trong viện') + '</select>'; } },
                { title: 'Mời giảng', group: GV, render: function (r) { return '<select class="ums-select ums-input--sm" data-o="gvm" data-s2' + khoa + '>' + opt(pg.gvMoi, 'ID', tenGV, r.NHANSU_HOSOCANBO_ID, 'Chọn GV mời giảng') + '</select>'; } },
                { title: 'Địa điểm', render: function (r) { return '<select class="ums-select ums-input--sm" data-o="dd"' + khoa + '>' + opt(dmDiaDiem, 'ID', 'TEN', r.TKB_PHANLOAIDIADIEM_ID, 'Chọn địa điểm') + '</select>'; } },
                { title: 'Ghi chú', render: function (r) { return o(r, 'gc', r.MOTA, 150); } },
                { title: 'Xóa', cls: 'is-center', render: function (r, i) { return sua ? '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-xoa="' + i + '" title="Xóa"><i class="fa-light fa-trash-can"></i></button>' : ''; } }
            ] });
            Array.prototype.forEach.call(h.querySelectorAll('tbody tr'), function (tr, i) { var r = pg.rs[i]; if (r) { tr.setAttribute('data-i', i); if (r.NHANSU_HOSOCANBO_ID) tr.classList.add('plg-cogv'); } });
            ui.enhance(h);
            var tong = pg.hd.map(function (x) { return [e(x.TENHINHTHUCHOC), pg.rs.reduce(function (s, r) { return s + (r.IDHINHTHUCHOC === x.ID && r.NHANSU_HOSOCANBO_ID ? (parseInt(r.SOTIET, 10) || 0) : 0); }, 0)]; });
            z('vungPG').querySelector('[data-k="tong"]').innerHTML = tong.map(function (t) { return '<span>' + esc(t[0]) + ' : <b>' + t[1] + '</b></span>'; }).join('');
        }
        function moPG(kieu, ids) {
            che = { kieu: kieu, ids: ids || [] };
            z('vungPG').innerHTML = pat.panel({ title: 'Lịch phân giảng cho học phần: ', icon: 'fa-chalkboard-user', flush: true,
                tools: ui.btn('close', { attr: { 'data-a': 'dongpg' } }), body: '<div data-k="bang"></div><div class="plg-tong" data-k="tong"></div>' +
                    (sua ? '<div class="ums-row ums-row--end plg-pg__nut">' + ui.btn('add', { text: 'Thêm dòng', attr: { 'data-a': 'themdong' } }) + ui.btn('save', { attr: { 'data-a': 'luupg' } }) + '</div>' : '') });
            z('vungPG').querySelector('.ums-panel__title').insertAdjacentHTML('beforeend', '<span class="plg-nhan" data-k="lbl">' + esc(nhan()) + '</span>');
            veVung('pg');
            (dsBaiHoc.length || !lop ? Promise.resolve() : napBaiHoc()).then(taiPG);
        }
        function giaTri(tr) { function q(k) { var el = tr.querySelector('[data-o="' + k + '"]'); return el ? el.value.trim() : ''; } return { ngay: q('ngay'), siso: q('siso'), sotiet: q('sotiet'), tbd: q('tbd'), tkt: q('tkt'), bh: q('bh'), hd: q('hd'), gv: q('gvt') || q('gvm'), dd: q('dd'), gc: q('gc') }; }
        function goc(r) { return { ngay: e(r.NGAYHOC), siso: String(e(r.SOSINHVIEN)), sotiet: String(e(r.SOTIET)), tbd: String(e(r.TIETBATDAU)), tkt: String(e(r.TIETKETTHUC)), bh: e(r.DAOTAO_BAIHOC_ID), hd: e(r.IDHINHTHUCHOC), gv: e(r.NHANSU_HOSOCANBO_ID), dd: e(r.TKB_PHANLOAIDIADIEM_ID), gc: e(r.MOTA) }; }
        function luuPG() {
            var h = z('vungPG').querySelector('[data-k="bang"]'), viec = [];
            Array.prototype.forEach.call(h.querySelectorAll('tbody tr[data-i]'), function (tr) {
                var r = pg.rs[Number(tr.getAttribute('data-i'))], g = giaTri(tr), cu = goc(r), moi = String(r.ID).length === 30;
                if (!moi && JSON.stringify(g) === JSON.stringify(cu)) return;
                viec.push({ r: r, x: { action: L + (moi || !r.ID ? 'ThemMoi' : 'CapNhat'), method: 'POST', silent: true, strId: moi ? '' : r.ID, strIdHinhThucHoc: g.hd, dSiSo: g.siso, dSoTiet: g.sotiet, strNgayHoc: g.ngay,
                    dTietBatDau: g.tbd, dTietKeThuc: g.tkt, strDaoTao_BaiHoc_Id: g.bh, strNhanSu_HoSoCanBo_Id: g.gv, strTKB_PhanLoaiDiaDiem_Id: g.dd, strTKB_KhuVuc_Id: '', strTKB_ToaNha_Id: '',
                    strTKB_PhongHoc_Id: '', strMoTa: g.gc, strTKB_LichGiang_HocPhan_Id: e(r.TKB_LICHGIANG_HOCPHAN_ID), strNguoiThucHien_Id: uid(), strDaoTao_HeDaoTao_Id: v('he') } });
            });
            if (!viec.length) { ui.toast('Không có thay đổi để lưu', 'info'); return; }
            var loi = [], i = 0;
            (function tiep() {
                if (i >= viec.length) {
                    if (loi.length) baoLoi(loi); else ui.toast('Cập nhật thành công (' + viec.length + ')', 'ok');
                    return taiPG();
                }
                var w = viec[i++];
                ums.api.call(w.x).catch(function (err) { loi.push({ msg: err.message, data: err.data || (err.raw && err.raw.Data) }); }).then(tiep);
            })();
        }
        /* Lưu lỗi mà máy chủ trả Data (id bản ghi trùng) → xem bản ghi đó (btnXemTrungLich của gốc) */
        function baoLoi(loi) {
            var dlg = ui.dialog({ title: 'Lưu chưa thành công', icon: 'fa-triangle-exclamation', size: 'md', body: '<ul class="plg-loi">' + loi.map(function (l, i) {
                return '<li>' + esc(l.msg || 'Lỗi') + (l.data && typeof l.data === 'string' ? ' <button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm" data-xemloi="' + i + '"><i class="fa-light fa-eye"></i><span>Xem lịch trùng</span></button>' : '') + '</li>'; }).join('') + '</ul>' });
            dlg.body.addEventListener('click', function (ev) {
                var b = ev.target.closest('[data-xemloi]');
                if (b) { dlg.close(); che = { kieu: 'loi', ids: [loi[Number(b.getAttribute('data-xemloi'))].data] }; taiPG(); }
            });
        }

        /* ---------- Bài học (bản sửa) ------------------------------------------ */
        function hpBaiHoc() { return lop ? e(lop.IDHOCPHAN) || v('hp') : v('hp'); }
        function napBaiHoc() {
            return get('KHCT_BaiHoc/LayDanhSach', { strTuKhoa: '', strDaoTao_HocPhan_Id: hpBaiHoc(), strDaoTao_ToChucCT_Id: '', pageIndex: 1, pageSize: 1000000 })
                .then(function (r) { dsBaiHoc = arr(r.data); return dsBaiHoc; }).catch(function () { dsBaiHoc = []; return []; });
        }
        function moBH() {
            if (!hpBaiHoc()) { ui.toast('Bạn phải chọn học phần', 'warn'); return; }
            z('vungBH').innerHTML = pat.panel({ title: 'Danh sách bài học — Học phần ' + (lop ? e(lop.DAOTAO_HOCPHAN_TEN) : f('hp').options[f('hp').selectedIndex].text), icon: 'fa-book',
                count: 'nBH', flush: true, zone: 'bh', tools: ui.btn('close', { attr: { 'data-a': 'dongbh' } }) + ui.xoaChon('input[data-bhck]', { goc: '.ums-panel', attr: { 'data-a': 'xoabh' } }) + ui.btn('add', { attr: { 'data-a': 'thembh' } }) }) +
                '<div class="ums-u-mt-4" data-z="bhForm" hidden></div>';
            veVung('bh'); taiBH();
        }
        function taiBH() {
            z('bh').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            napBaiHoc().then(function (ds) {
                z('nBH').textContent = '(' + ds.length + ')';
                ui.table({ el: z('bh'), rows: ds, empty: 'Học phần chưa có bài học', columns: [
                    { title: 'Tên bài', prop: 'TENBAI' }].concat(o.bhSoTiet === false ? [] : [{ title: 'Số tiết', prop: 'SOTIET', cls: 'is-center' }]).concat([{ title: 'Nội dung', prop: 'NOIDUNG' },
                    { title: 'Sửa', cls: 'is-center', width: '60px', render: function (x) { return '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-suabh="' + esc(x.ID) + '" title="Sửa"><i class="fa-light fa-pen-to-square"></i></button>'; } },
                    { head: '<input type="checkbox" data-bhck="all">', cls: 'is-center', width: '44px', render: function (x) { return '<input type="checkbox" data-bhck="' + esc(x.ID) + '">'; } }]) });
            });
        }
        function formBH(id) {
            var h = z('bhForm'); h.hidden = false;
            h.innerHTML = pat.panel({ title: (id ? 'Sửa' : 'Thêm') + ' bài học', icon: 'fa-pen', body:
                ui.field('Tên bài', '<input class="ums-input" data-bh="ten" autocomplete="off">', { required: true }) +
                ui.field('Số tiết', '<input class="ums-input" data-bh="st" inputmode="numeric" autocomplete="off">') +
                ui.field('Nội dung', '<textarea class="ums-input" rows="3" data-bh="nd"></textarea>') +
                '<div class="ums-row ums-row--end">' + ui.btn('close', { attr: { 'data-a': 'dongbhf' } }) + ui.btn('save', { text: 'Lưu và Nhập tiếp', mod: 'out-primary', attr: { 'data-a': 'luubh2', 'data-id': id || '' } }) +
                ui.btn('save', { attr: { 'data-a': 'luubh', 'data-id': id || '' } }) + '</div>' });
            if (id) get('KHCT_BaiHoc/LayChiTiet', { strId: id }).then(function (r) {
                var d = arr(r.data)[0] || {}; h.querySelector('[data-bh="ten"]').value = e(d.TENBAI); h.querySelector('[data-bh="st"]').value = e(d.SOTIET); h.querySelector('[data-bh="nd"]').value = e(d.NOIDUNG);
            }).catch(function (err) { ums.api.handle(err, 'bài học'); });
        }
        function luuBH(id, tiep) {
            var h = z('bhForm'); function q(k) { return h.querySelector('[data-bh="' + k + '"]').value.trim(); }
            if (!q('ten')) { ui.toast('Nhập tên bài', 'warn'); return; }
            post('KHCT_BaiHoc/' + (id ? 'CapNhat' : 'ThemMoi'), { strId: id || '', strDaoTao_HocPhan_Id: hpBaiHoc(), strDaoTao_ToChucCT_Id: '', strNoiDung: q('nd'), strTenBai: q('ten'), strKyHieu: '', dSoTiet: q('st') })
                .then(function () { ui.toast(id ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok'); taiBH(); if (tiep) formBH(''); else h.hidden = true; })
                .catch(function (err) { ums.api.handle(err, 'lưu bài học'); });
        }
        function xoaBH() {
            var ids = Array.prototype.filter.call(z('bh').querySelectorAll('input[data-bhck]:checked'), function (c) { return c.getAttribute('data-bhck') !== 'all'; }).map(function (c) { return c.getAttribute('data-bhck'); });
            if (!ids.length) { ui.toast('Vui lòng chọn bài học cần xóa?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn xóa bài học không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                if (!yes) return;
                post('KHCT_BaiHoc/Xoa', { strIds: ids.join(',') }).then(function () { ui.toast('Xóa dữ liệu thành công!', 'ok'); taiBH(); }).catch(function (err) { ums.api.handle(err, 'xoá bài học'); });
            });
        }

        /* ---------- Kế thừa (bản sửa) ----------------------------------------- */
        function moKT() {
            z('vungKT').innerHTML = pat.panel({ title: 'Danh sách lớp học phần kế thừa — ' + nhan(), icon: 'fa-copy', flush: true, zone: 'kt',
                tools: ui.btn('close', { attr: { 'data-a': 'dongkt' } }) + ui.btn('save', { text: 'Kế thừa sang học phần đã chọn', attr: { 'data-a': 'luukt' } }) });
            veVung('kt');
            z('kt').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            get(L + 'LayDSLopHocPhanCanKeThua', { strIdLopHocPhanGoc: lop.ID, strChucNang_Id: cn(), strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_HocPhan_Id: v('hp'), strDaoTao_ThoiGianDaoTao_Id: v('tg') }).then(function (r) {
                ui.table({ el: z('kt'), rows: arr(r.data), empty: 'Không có lớp để kế thừa', columns: [
                    { title: 'Lớp', prop: 'TENLOPHOCPHAN' }, { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA' }, { title: 'Học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                    { title: 'Tín chỉ', prop: 'DAOTAO_HOCPHAN_SOTC', cls: 'is-center' }, { title: 'Số sinh viên', prop: 'SOSINHVIEN', cls: 'is-center' },
                    { head: '<input type="checkbox" data-ktck="all">', cls: 'is-center', width: '44px', render: function (x) { return '<input type="checkbox" data-ktck="' + esc(x.ID) + '">'; } }] });
            }).catch(function (err) { z('kt').innerHTML = ui.fail(err.message); });
        }
        function luuKT() {
            var ids = Array.prototype.filter.call(z('kt').querySelectorAll('input[data-ktck]:checked'), function (c) { return c.getAttribute('data-ktck') !== 'all'; }).map(function (c) { return c.getAttribute('data-ktck'); });
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn muốn kế thừa không', { title: 'Kế thừa' }).then(function (yes) {
                if (!yes) return;
                post(L + 'KeThua', { strIdsLopHocPhan: ids.join(','), strIdLopHocPhan: lop.ID, strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_HocPhan_Id: v('hp') })
                    .then(function () { ui.toast('Kế thừa hoàn tất. Hãy kiểm tra lại!', 'warn'); }).catch(function (err) { ums.api.handle(err, 'kế thừa'); });
            });
        }

        /* ---------- Xác nhận (bản sửa) ---------------------------------------- */
        function xacNhan() {
            var dlg = ui.dialog({ title: 'Xác nhận: ' + nhan(), icon: 'fa-circle-check', size: 'lg', body:
                ui.field('Nội dung xác nhận', '<input class="ums-input" data-x="nd" autocomplete="off">') +
                '<div class="ums-legend">Chọn xác nhận</div><div class="plg-xn" data-x="nut">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' +
                '<div class="ums-legend ums-legend--cach">Lịch sử xác nhận</div><div data-x="ls"></div>' });
            var B = dlg.body;
            ums.api.dm('TKB_PHANGIANG.XNKK', 'HESO1').then(function (d) {
                B.querySelector('[data-x="nut"]').innerHTML = (d || []).map(function (x) {
                    var ic = ums.iconFA4(e(x.THONGTIN1));   // tên FA4 → FA7
                    return '<button type="button" class="plg-xn__o" data-tt="' + esc(x.ID) + '"><i class="' + esc(ic || 'fa-light fa-circle-check') + ' fa-2x" style="' + esc(e(x.THONGTIN2)) + '"></i><span>' + esc(e(x.TEN)) + '</span></button>';
                }).join('') || ui.empty('Chưa có trạng thái xác nhận', 'fa-circle-info');
            }).catch(function () {});
            function lichSu() {
                get('KHCT_XacNhanPhanGiang/LayDanhSach', { strTuKhoa: '', strSanPham_Id: lop.ID, strTinhTrang_Id: '', pageIndex: 1, pageSize: 100000 }).then(function (r) {
                    ui.table({ el: B.querySelector('[data-x="ls"]'), rows: arr(r.data), empty: 'Chưa có lịch sử xác nhận', columns: [
                        { title: 'Xác nhận', prop: 'TINHTRANG_TEN' }, { title: 'Nội dung', prop: 'NOIDUNG' }, { title: 'Người xác nhận', prop: 'NGUOIXACNHAN_TENDAYDU' },
                        { title: 'Ngày', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap' }] });
                }).catch(function () {});
            }
            lichSu();
            B.addEventListener('click', function (ev) {
                var b = ev.target.closest('[data-tt]');
                if (!b) return;
                post('KHCT_XacNhanPhanGiang/ThemMoi', { strId: '', strSanPham_Id: lop.ID, strNoiDung: B.querySelector('[data-x="nd"]').value.trim(), strTinhTrang_Id: b.getAttribute('data-tt'), strNguoiXacnhan_Id: uid() })
                    .then(function () { ui.toast('Xác nhận thành công', 'ok'); dlg.close(); taiLop(); }).catch(function (err) { ums.api.handle(err, 'xác nhận'); });
            });
        }

        /* ---------- Thanh công cụ (bản sửa): thành viên, tổng hợp ------------- */
        if (sua && window.jQuery) {
            jQuery(f('dv')).on('select2:select select2:clear', function () {
                get('NS_HoSoV2/LayDanhSach', { strTuKhoa: '', pageIndex: 1, pageSize: 100000, strDaoTao_CoCauToChuc_Id: v('dv'), dLaCanBoNgoaiTruong: ngoaiTruong })
                    .then(function (r) { pat.fill(f('tv'), arr(r.data), { name: function (x) { return e(x.HOTEN) + ' - ' + e(x.MASO); }, head: 'Tất cả thành viên đăng ký' }); })
                    .catch(function (err) { ums.api.handle(err, 'thành viên'); });
            });
        }
        function tongHop() {
            ui.confirm('Bạn có chắc chắn muốn tổng hợp giờ giảng và quy đổi không', { title: 'Tổng hợp' }).then(function (yes) {
                if (!yes) return;
                get('KHCT_TinhToan/TongHopGioGiangVaQuyDoi', { strDaoTao_CoCauToChuc_Id: v('dv'), strDaoTao_ThoiGianDaoTao_Id: v('tg'), strTuNgay: v('tu'), strDenNgay: v('den') })
                    .then(function () { ui.toast('Thực hiện hoàn tất. Hãy kiểm tra lại!', 'warn'); }).catch(function (err) { ums.api.handle(err, 'tổng hợp'); });
            });
        }
        function canLop() { if (!lop) { ui.toast('Chọn một lớp học phần trước', 'warn'); return false; } return true; }

        ums.report.mount(z('bc'), { collect: function (add) {
            add('strHeDaoTao_Id', v('he')); add('strHocPhan_Id', v('hp')); add('strLopHocPhan_Id', lop ? lop.ID : ''); add('strThoiGianDaoTao_Id', v('tg'));
            if (sua) add('strCoCauToChuc_Id', v('bm'));
            add('strChucNang_Id', cn()); add('strNguoiDangNhap_Id', uid()); add('strDonVi_Id', v('dv'));
            add('strCanBo_Id', sua ? v('tv') : uid()); add('strDenNgay', v('den')); add('strTuNgay', v('tu'));
        } });

        root.addEventListener('click', function (ev) {
            var b;
            if ((b = ev.target.closest('[data-lop]'))) { chonLop(b.getAttribute('data-lop')); return; }
            if ((b = ev.target.closest('[data-pg]'))) { moPG('id', [dsLich[Number(b.getAttribute('data-pg'))].ID]); return; }
            if ((b = ev.target.closest('[data-xoa]'))) {
                var r = pg.rs[Number(b.getAttribute('data-xoa'))];
                ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                    if (!yes) return;
                    post(L + 'Xoa', { strId: r.ID, strDaoTao_HeDaoTao_Id: v('he') }).then(function () { ui.toast('Xóa thành công!', 'ok'); taiPG(); }).catch(function (err) { ums.api.handle(err, 'xoá'); });
                });
                return;
            }
            if ((b = ev.target.closest('[data-suabh]'))) { formBH(b.getAttribute('data-suabh')); return; }
            if (!(b = ev.target.closest('[data-a]'))) return;
            var a = b.getAttribute('data-a');
            if (a === 'tim') { if (v('hp')) taiLop(); else ui.toast('Chọn học phần', 'warn'); }
            else if (a === 'dslich') { if (canLop()) moPG('tatca'); }
            else if (a === 'xemlich') { var c = daChon(); if (!c.length) ui.toast('Vui lòng chọn đối tượng?', 'warn'); else moPG('id', c.map(function (x) { return x.ID; })); }
            else if (a === 'dongpg') { veVung('lich'); taiLich(); }
            else if (a === 'luupg') luuPG();
            else if (a === 'themdong') {
                var lh = che.kieu === 'id' && che.ids.length === 1 ? che.ids[0] : (pg.rs.length ? e(pg.rs[pg.rs.length - 1].TKB_LICHGIANG_HOCPHAN_ID) : (che.ids[0] || ''));
                post(L + 'ThemMoi', { strId: '', strDaoTao_HeDaoTao_Id: v('he'), strTKB_LichGiang_HocPhan_Id: lh }).then(function () { taiPG(); }).catch(function (err) { ums.api.handle(err, 'thêm dòng'); });
            }
            else if (a === 'baihoc') moBH();
            else if (a === 'dongbh') { veVung('lich'); }
            else if (a === 'thembh') formBH('');
            else if (a === 'dongbhf') z('bhForm').hidden = true;
            else if (a === 'luubh' || a === 'luubh2') luuBH(b.getAttribute('data-id'), a === 'luubh2');
            else if (a === 'xoabh') xoaBH();
            else if (a === 'kethua') { if (canLop()) moKT(); }
            else if (a === 'dongkt') veVung('lich');
            else if (a === 'luukt') luuKT();
            else if (a === 'xacnhan') { if (canLop()) xacNhan(); }
            else if (a === 'import') {
                if (!canLop()) return;
                post('KHCT_LichGiang_Import/Xoa', { strId: '', strChucNang_Id: cn() }).catch(function () {}).then(function () {
                    ums.report.importChung('Lịch giảng', 'IMPORTWITHPROC_LICHGIANG', { onDone: function () { taiLich(); } });
                });
            }
            else if (a === 'moigiang') plg.moiGiang(root);
            else if (a === 'tonghop') tongHop();
        });
        root.addEventListener('change', function (ev) {
            var t = ev.target, k = t.getAttribute('data-ck') === 'all' ? 'data-ck' : t.getAttribute('data-bhck') === 'all' ? 'data-bhck' : t.getAttribute('data-ktck') === 'all' ? 'data-ktck' : '';
            if (k) Array.prototype.forEach.call(t.closest('table').querySelectorAll('input[' + k + ']'), function (c) { c.checked = t.checked; });
        });
        f('q').addEventListener('input', function () { if (dsLop.length) veLop(lop && lop.ID); });
    };
})();
