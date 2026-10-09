/* =========================================================================
   Dữ liệu chấm thi — khung chung của dulieuchamthi (theo từng lớp, hai cột) và
   dulieuchamthiv2 (lưới N giảng viên mỗi lớp, một cột) — ums.plg.chamThi(root, { kieu })
   Bản gốc: dulieuchamthi.js / dulieuchamthiv2.js (phần lọc chép y hệt nhau).
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ; GET trừ khi ghi — chép nguyên):
       KHCT_LichGiang/LayDSThoiGian (KHÔNG tự chọn) · LayDSHeDaoTao · LayDSHocPhan (dToanBo 1) · LayDSLopHocPhan
         (bản lưới gửi thêm strDaoTao_CoCauToChuc_Id); ums.ref.coCauToChuc — ô Bộ môn / Đơn vị
       KHCT_DuLieuChamThi_V2/LayDanhSach · ThemMoi · CapNhat · Xoa (POST)
       Bản lớp: thêm cán bộ bằng ums.pat.pickNhanSu (genModal_NhanSu); ô từ khoá DÙNG CHUNG làm
         strTuKhoa lọc cán bộ (như gốc)
       Bản lưới: danh sách giảng viên ums.ref.nhanSu (dLaCanBoNgoaiTruong 0); mỗi lớp một lời gọi kết quả
       Import: "1. Import Chấm thi" — IMPORTWITHPROC_CHAMTHI (ums.report.importChung)
   Không chép (lỗi rõ của bản gốc):
     · Chọn học phần nạp danh sách lớp rồi XOÁ luôn (bản lớp).
     · Lưu xong không nạp lại → bấm Lưu lần nữa thêm TRÙNG; một cảnh báo mỗi dòng.
     · Xoá dòng mới thêm không xoá được; kiểm "Đã tồn tại" so nhầm id bản ghi với id cán bộ.
     · Bản lưới: bỏ chọn giảng viên của ô đã lưu → gọi Xoá RỒI vẫn gửi ThemMoi rỗng. Ở đây chỉ Xoá.
     · Bản lưới: danh sách giảng viên chưa về mà lưới đã vẽ → ô trống. Ở đây đợi đủ.
   Giữ như bản gốc (chờ nghiệp vụ):
     · Số lượng hiện từ SOLUONG nhưng lưu vào dSoBaiCham (bản lưới đọc SOBAICHAM) — hiện SOLUONG, thiếu thì SOBAICHAM.
     · strDaoTao_HocPhan_Id lấy IDHOCPHAN (bản lớp) / DAOTAO_HOCPHAN_ID (bản lưới).
     · Cột ghi chú bản gốc đặt tiêu đề "Đối tượng" — giữ chữ gốc.
     · Không có nút báo cáo (vùng báo cáo gốc không có trong html).
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
    var L = 'KHCT_LichGiang/', CT = 'KHCT_DuLieuChamThi_V2/';
    function get(a, o) { return ums.api.call(Object.assign({ action: a, method: 'GET', strNguoiThucHien_Id: uid() }, o)); }
    function post(a, o) { return ums.api.call(Object.assign({ action: a, method: 'POST', strNguoiThucHien_Id: uid(), strChucNang_Id: cn() }, o)); }
    function sel(k, ph) { return '<div class="ums-field"><select class="ums-select" data-f="' + k + '" data-ph="' + esc(ph) + '"><option value=""></option></select></div>'; }
    var NUT_IMPORT = '<div class="ums-field ums-field--fit">' + ui.btn('search', { text: 'Import', icon: 'fa-file-import', mod: 'out-info', attr: { 'data-a': 'import', title: '1. Import Chấm thi' } }) + '</div>';

    plg.chamThi = function (root, o) {
        var luoi = o.kieu === 'luoi';
        var loc = sel('tg', 'Chọn thời gian đào tạo') + sel('he', 'Chọn hệ đào tạo') + sel('bm', luoi ? 'Chọn đơn vị' : 'Chọn bộ môn') + sel('hp', 'Chọn học phần');
        if (luoi) {
            root.innerHTML = pat.page(o.tieuDe, '') +
                pat.panel({ title: false, cls: 'ums-u-mb-4', body: '<div class="ums-filter">' + loc + '</div><div class="ums-filter ums-u-mt-2">' +
                    '<div class="ums-field ums-field--fit plg-sl"><label for="plg-sl">Số giảng viên</label><input class="ums-input" id="plg-sl" data-f="sl" value="4" title="Số lượng giảng viên mỗi lớp" inputmode="numeric" autocomplete="off"></div>' +
                    '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'tim' } }) + '</div>' + NUT_IMPORT + '</div>' }) +
                pat.panel({ title: 'Danh sách', icon: 'fa-list', count: 'nLop', flush: true, zone: 'luoi', tools: ui.btn('save', { attr: { 'data-a': 'luuluoi' } }) });
        } else {
            root.innerHTML = pat.page(o.tieuDe, '') +
                '<div class="plg-hai">' +
                    '<aside>' + pat.panel({ title: false, body: '<div class="ums-filter plg-loc">' +
                        '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' + loc + NUT_IMPORT +
                        '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'tim' } }) + '</div></div>' }) +
                    '<div class="ums-u-mt-4">' + pat.panel({ title: 'Danh sách lớp học phần', icon: 'fa-users-rectangle', count: 'nLop', flush: true, zone: 'lop' }) + '</div></aside>' +
                    '<div data-z="phai" hidden>' + pat.panel({ title: 'Danh sách cán bộ', icon: 'fa-user-pen', count: 'nCB', flush: true, zone: 'cb',
                        tools: ui.btn('add', { text: 'Thêm dòng mới', attr: { 'data-a': 'themcb' } }) + ui.btn('save', { attr: { 'data-a': 'luucb' } }) }) + '</div>' +
                '</div>';
        }
        ui.enhance(root);
        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
        function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
        function v(k) { return f(k) ? f(k).value.trim() : ''; }

        /* ---------- Bộ lọc ------------------------------------------------- */
        var c1 = pat.chain([f('tg'), f('he')], { phatLai: false }), c2 = pat.chain([f('tg'), f('hp')], { phatLai: false });
        function sync() { c1.sync(); c2.sync(); }
        get(L + 'LayDSThoiGian', { strChucNang_Id: cn() }).then(function (r) { pat.fill(f('tg'), arr(r.data), { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn thời gian đào tạo' }); sync(); })
            .catch(function (err) { ums.api.handle(err, 'thời gian đào tạo'); });
        ums.ref.coCauToChuc({}).then(function (d) { pat.fill(f('bm'), d, { name: 'TEN', head: 'Chọn đơn vị' }); }).catch(function () {});
        function napHe() {
            if (!v('tg')) { pat.fill(f('he'), []); sync(); return Promise.resolve(); }
            return get(L + 'LayDSHeDaoTao', { strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_HeDaoTao_Id: v('he') })
                .then(function (r) { pat.fill(f('he'), arr(r.data), { name: 'TEN', head: 'Chọn hệ đào tạo' }); sync(); }).catch(function (err) { ums.api.handle(err, 'hệ đào tạo'); });
        }
        function napHP() {
            if (!v('tg')) { pat.fill(f('hp'), []); sync(); return Promise.resolve(); }
            return get(L + 'LayDSHocPhan', { strDaoTao_CoCauToChuc_Id: v('bm'), strDaoTao_HeDaoTao_Id: v('he'), dToanBo: 1, strDaoTao_ThoiGianDaoTao_Id: v('tg'), strChucNang_Id: cn() })
                .then(function (r) { pat.fill(f('hp'), arr(r.data), { name: function (x) { return e(x.MA) + ' - ' + e(x.TEN); }, head: 'Chọn học phần' }); sync(); })
                .catch(function (err) { ums.api.handle(err, 'học phần'); });
        }
        function datLop() { dsLop = []; lop = null; if (luoi) z('luoi').innerHTML = ui.empty('Chọn học phần để xem danh sách lớp', 'fa-hand-pointer'); else { z('lop').innerHTML = ui.empty('Chọn học phần để xem danh sách lớp', 'fa-hand-pointer'); z('phai').hidden = true; } z('nLop').textContent = ''; }
        if (window.jQuery) {
            jQuery(f('tg')).on('select2:select select2:clear', function () { datLop(); napHe().then(napHP); });
            jQuery([f('he'), f('bm')]).on('select2:select select2:clear', function () { datLop(); napHP(); });
            jQuery(f('hp')).on('select2:select select2:clear', function () { datLop(); if (v('hp')) taiLop(); });
        }

        /* ---------- Danh sách lớp ------------------------------------------ */
        var dsLop = [], lop = null;
        function taiLop() {
            var h = luoi ? z('luoi') : z('lop');
            h.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            var ts = { strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_HocPhan_Id: v('hp'), strChucNang_Id: cn() };
            if (luoi) ts.strDaoTao_CoCauToChuc_Id = v('bm');
            return (luoi ? Promise.all([get(L + 'LayDSLopHocPhan', ts), dsGV()]) : get(L + 'LayDSLopHocPhan', ts).then(function (r) { return [r]; })).then(function (x) {
                dsLop = arr(x[0].data);
                z('nLop').textContent = '(' + (Number(x[0].pager) || dsLop.length) + ')';
                if (luoi) veLuoi(); else veLop();
            }).catch(function (err) { h.innerHTML = ui.fail(err.message); ums.api.handle(err, 'lớp học phần'); });
        }
        function veLop() {
            z('lop').innerHTML = dsLop.length ? '<div class="plg-lops">' + dsLop.map(function (x) {
                return '<button type="button" class="plg-lop' + (lop && lop.ID === x.ID ? ' is-active' : '') + '" data-lop="' + esc(x.ID) + '"><span>Tên lớp: <b>' + esc(e(x.TENLOPHOCPHAN)) + '</b></span>' +
                    '<span>Mã học phần: ' + esc(e(x.DAOTAO_HOCPHAN_MA)) + '</span><span>Học phần: ' + esc(e(x.DAOTAO_HOCPHAN_TEN)) + '</span><span>Tín chỉ: ' + esc(e(x.DAOTAO_HOCPHAN_SOTC)) + '</span>' +
                    '<span>Số sinh viên: ' + esc(e(x.SOSINHVIEN)) + '</span></button>';
            }).join('') + '</div>' : ui.empty('Không có lớp học phần', 'fa-users-slash');
        }

        /* ---------- Bản LỚP: danh sách cán bộ chấm ------------------------- */
        var dsCB = [], moi = [];
        function taiCB() {
            z('cb').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin'); moi = [];
            return get(CT + 'LayDanhSach', { strTuKhoa: v('q'), strDaoTao_LopHocPhan_Id: lop.ID, strDaoTao_ThoiGianDaoTao_Id: v('tg'), strNhanSu_HoSoCanBo_Id: '', strNguoiTao_Id: '',
                strDaoTao_HocPhan_Id: '', pageIndex: 1, pageSize: 1000000000 }).then(function (r) { dsCB = arr(r.data); veCB(); })
                .catch(function (err) { z('cb').innerHTML = ui.fail(err.message); ums.api.handle(err, 'cán bộ chấm thi'); });
        }
        function veCB() {
            var rows = dsCB.map(function (x) { return { ID: x.ID, cu: x, NS: x.NHANSU_HOSOCANBO_ID, dv: x.DAOTAO_COCAUTOCHUC_TEN, ma: x.NHANSU_HOSOCANBO_MASO,
                ten: e(x.NHANSU_HOSOCANBO_HODEM) + ' ' + e(x.NHANSU_HOSOCANBO_TEN), hp: x.DAOTAO_HOCPHAN_TEN, sl: e(x.SOLUONG) !== '' ? x.SOLUONG : x.SOBAICHAM, ngay: x.NGAYCHAMTHI, gc: x.GHICHU }; })
                .concat(moi);
            z('nCB').textContent = '(' + rows.length + ')';
            ui.table({ el: z('cb'), rows: rows, empty: 'Chưa có cán bộ chấm thi', columns: [
                { title: 'Đơn vị', prop: 'dv' }, { title: 'Mã cán bộ', prop: 'ma', cls: 'is-nowrap' }, { title: 'Họ tên', prop: 'ten' }, { title: 'Học phần', prop: 'hp' },
                { title: 'Số lượng', cls: 'is-center', render: function (x, i) { return '<input class="ums-input ums-input--sm" data-sl="' + i + '" value="' + esc(e(x.sl)) + '" style="width:70px" inputmode="numeric" autocomplete="off">'; } },
                { title: 'Ngày chấm thi', cls: 'is-center', render: function (x, i) { return '<input class="ums-input ums-input--sm" data-ngay="' + i + '" data-date value="' + esc(e(x.ngay)) + '" style="width:120px" autocomplete="off">'; } },
                { title: 'Đối tượng', render: function (x, i) { return '<input class="ums-input ums-input--sm" data-gc="' + i + '" value="' + esc(e(x.gc)) + '" autocomplete="off">'; } },
                { title: '', cls: 'is-center', width: '50px', render: function (x, i) { return '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-xoacb="' + i + '" title="Xóa"><i class="fa-light fa-trash-can"></i></button>'; } }
            ] });
            ui.enhance(z('cb'));
            z('cb')._rows = rows;
        }
        function themCB() {
            pat.pickNhanSu({ title: 'Tìm kiếm cán bộ', onPick: function (list) {
                var co = dsCB.map(function (x) { return String(x.NHANSU_HOSOCANBO_ID); }).concat(moi.map(function (x) { return String(x.NS); })), them = 0;
                list.forEach(function (n) {
                    if (co.indexOf(String(n.ID)) >= 0) return;
                    moi.push({ ID: '', NS: n.ID, dv: n.DAOTAO_COCAUTOCHUC_TEN, ma: n.MASO, ten: e(n.HOTEN) || (e(n.HODEM) + ' ' + e(n.TEN)), hp: e(lop.DAOTAO_HOCPHAN_TEN), sl: '', ngay: '', gc: '' }); them++;
                });
                if (them < list.length) ui.toast((list.length - them) + ' cán bộ đã có trong danh sách', 'info');
                veCB();
            } });
        }
        function luuCB() {
            var rows = z('cb')._rows || [], h = z('cb');
            if (!rows.length) { ui.toast('Chưa có cán bộ để lưu', 'info'); return; }
            ui.batch(rows.map(function (r, i) {
                return { action: CT + (r.ID ? 'CapNhat' : 'ThemMoi'), method: 'POST', strId: r.ID || '', strChucNang_Id: cn(), strNhanSu_HoSoCanBo_Id: r.NS, strDaoTao_ThoiGianDaoTao_Id: v('tg'),
                    strDangKy_LopHocPhan_Id: lop.ID, strDaoTao_HocPhan_Id: e(lop.IDHOCPHAN), dSoBaiCham: h.querySelector('[data-sl="' + i + '"]').value.trim(),
                    strGhiChu: h.querySelector('[data-gc="' + i + '"]').value.trim(), strNgayChamThi: h.querySelector('[data-ngay="' + i + '"]').value.trim(), strNguoiThucHien_Id: uid() };
            }), { title: 'Đang lưu', okText: 'Lưu thành công', show: true }).then(taiCB);
        }
        function xoaCB(i) {
            var r = z('cb')._rows[i];
            if (!r.ID) { moi.splice(moi.indexOf(r), 1); veCB(); return; }
            ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                if (!yes) return;
                post(CT + 'Xoa', { strIds: r.ID }).then(function () { ui.toast('Xóa thành công!', 'ok'); taiCB(); }).catch(function (err) { ums.api.handle(err, 'xoá'); });
            });
        }

        /* ---------- Bản LƯỚI: N giảng viên mỗi lớp ------------------------- */
        var gv = null;
        function dsGV() {
            if (gv) return Promise.resolve(gv);
            return ums.ref.nhanSu({ dLaCanBoNgoaiTruong: 0, pageIndex: 1, pageSize: 1000000 }).then(function (d) { gv = d || []; return gv; });
        }
        var KQ = {};
        function veLuoi() {
            var n = parseInt(v('sl'), 10); if (!(n > 0)) n = 0;
            function opt(chon) { return '<option value="">Chọn giảng viên</option>' + gv.map(function (x) { return '<option value="' + esc(x.ID) + '"' + (String(x.ID) === String(chon) ? ' selected' : '') + '>' + esc(e(x.HODEM) + ' ' + e(x.TEN) + ' - ' + e(x.MASO)) + '</option>'; }).join(''); }
            var cot = [
                { title: 'Lớp học phần', prop: 'TENLOPHOCPHAN' }, { title: 'Học phần', render: function (x) { return esc(e(x.DAOTAO_HOCPHAN_TEN) + ' - ' + e(x.DAOTAO_HOCPHAN_MA)); } },
                { title: 'Số sinh viên', prop: 'SOSINHVIEN', cls: 'is-center' }, { title: 'Ngày bắt đầu', prop: 'NGAYBATDAU', cls: 'is-center is-nowrap' },
                { title: 'Ngày kết thúc', prop: 'NGAYKETTHUC', cls: 'is-center is-nowrap' },
                { title: 'Ngày chấm', cls: 'is-center', render: function (x) { return '<input class="ums-input ums-input--sm" data-nc="' + esc(x.ID) + '" data-date style="width:120px" autocomplete="off">'; } }
            ];
            for (var k = 1; k <= n; k++) (function (k) {
                var g = ['Thông tin giảng viên ' + k];
                cot.push({ title: 'Giảng viên', group: g, render: function (x) { return '<select class="ums-select ums-input--sm plg-gv" data-gv="' + k + '|' + esc(x.ID) + '" data-s2>' + opt('') + '</select>'; } },
                    { title: 'Số bài', group: g, cls: 'is-center', render: function (x) { return '<input class="ums-input ums-input--sm" data-sb="' + k + '|' + esc(x.ID) + '" style="width:80px" inputmode="numeric" autocomplete="off">'; } });
            })(k);
            ui.table({ el: z('luoi'), rows: dsLop, empty: 'Không có lớp học phần', columns: cot });
            ui.enhance(z('luoi'));
            KQ = {};
            dsLop.forEach(function (x) {
                get(CT + 'LayDanhSach', { silent: true, strTuKhoa: '', strDaoTao_HocPhan_Id: v('hp'), strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_LopHocPhan_Id: x.ID, strNhanSu_HoSoCanBo_Id: '',
                    strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 }).then(function (r) {
                    var d = arr(r.data), h = z('luoi');
                    if (d[0]) { var nc = h.querySelector('[data-nc="' + x.ID + '"]'); if (nc) { nc.value = e(d[0].NGAYCHAMTHI); if (nc._flatpickr) nc._flatpickr.setDate(nc.value, false, 'd/m/Y'); } }
                    d.forEach(function (t, i) {
                        var key = (i + 1) + '|' + x.ID, s = h.querySelector('[data-gv="' + key + '"]'), b = h.querySelector('[data-sb="' + key + '"]');
                        if (!s) return;
                        KQ[key] = t.ID; s.value = e(t.NHANSU_HOSOCANBO_ID); if (window.jQuery) jQuery(s).trigger('change.select2'); if (b) b.value = e(t.SOBAICHAM);
                    });
                }).catch(function () {});
            });
        }
        function luuLuoi() {
            var h = z('luoi'), viec = [];
            Array.prototype.forEach.call(h.querySelectorAll('[data-sb]'), function (b) {
                var key = b.getAttribute('data-sb'), id = key.split('|')[1], s = h.querySelector('[data-gv="' + key + '"]'), rec = KQ[key], g = s ? s.value : '';
                var x = dsLop.filter(function (l) { return String(l.ID) === id; })[0] || {};
                if (!rec && !g) return;
                if (rec && !g) { viec.push({ action: CT + 'Xoa', method: 'POST', strChucNang_Id: cn(), strIds: rec, strNguoiThucHien_Id: uid() }); return; }
                viec.push({ action: CT + (rec ? 'CapNhat' : 'ThemMoi'), method: 'POST', strId: rec || '', strChucNang_Id: cn(), strNhanSu_HoSoCanBo_Id: g, strDaoTao_ThoiGianDaoTao_Id: v('tg'),
                    strDaoTao_HocPhan_Id: e(x.DAOTAO_HOCPHAN_ID), dSoBaiCham: b.value.trim(), strDangKy_LopHocPhan_Id: id, strGhiChu: '',
                    strNgayChamThi: (h.querySelector('[data-nc="' + id + '"]') || {}).value || '', strNguoiThucHien_Id: uid() });
            });
            if (!viec.length) { ui.toast('Chưa có dữ liệu để lưu', 'info'); return; }
            ui.confirm('Bạn có chắc chắn lưu dữ liệu không?', { title: 'Lưu dữ liệu chấm thi' }).then(function (yes) {
                if (yes) ui.batch(viec, { title: 'Đang lưu', okText: 'Lưu thành công', show: true }).then(veLuoi);
            });
        }

        root.addEventListener('click', function (ev) {
            var b;
            if ((b = ev.target.closest('[data-lop]'))) {
                lop = dsLop.filter(function (x) { return String(x.ID) === b.getAttribute('data-lop'); })[0];
                Array.prototype.forEach.call(z('lop').querySelectorAll('[data-lop]'), function (x) { x.classList.toggle('is-active', x === b); });
                z('phai').hidden = false;
                z('phai').querySelector('.ums-panel__title').innerHTML = '<i class="fa-light fa-user-pen"></i> Danh sách cán bộ — <span class="plg-nhan">' + esc(e(lop.DAOTAO_HOCPHAN_MA) + ' - ' + e(lop.TENLOPHOCPHAN)) + '</span> <span class="ums-u-faint ums-u-fz13" data-z="nCB"></span>';
                taiCB(); return;
            }
            if ((b = ev.target.closest('[data-xoacb]'))) { xoaCB(Number(b.getAttribute('data-xoacb'))); return; }
            if (!(b = ev.target.closest('[data-a]'))) return;
            var a = b.getAttribute('data-a');
            if (a === 'tim') { if (v('hp')) taiLop(); else ui.toast('Chọn học phần', 'warn'); }
            else if (a === 'import') ums.report.importChung('Thi', 'IMPORTWITHPROC_CHAMTHI', { onDone: function () { if (lop) taiCB(); else if (luoi && dsLop.length) veLuoi(); } });
            else if (a === 'themcb') themCB();
            else if (a === 'luucb') luuCB();
            else if (a === 'luuluoi') luuLuoi();
        });
        if (luoi) f('sl').addEventListener('change', function () { if (dsLop.length && gv) veLuoi(); });
        ['q'].forEach(function (k) { f(k).addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); if (v('hp')) taiLop(); } }); });
        datLop();
    };
})();
