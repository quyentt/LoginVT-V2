/* =========================================================================
   klgd — tầng chung các màn KHỐI LƯỢNG GIẢNG DẠY (cổng cán bộ): ums.klgd.*
   Bản gốc: ApisCongCanBo/Modules/klgd/script/*.js — hai họ màn chép nhau:
     · bản cũ controller TKGG_KLGD  (năm học: GetcboSchoolYear, cột NIENHOC; người: strNguoiDung_Id / strNguoiDungId)
     · bản "quản lý" TKGG_QLKLGD    (năm học: GetThongTinNamKyDot NAMHOC, cột NAMHOC; người: strNguoiThucHienId)
   Lời gọi kiểu cũ (không func, không mã hoá), GET như gốc — kể cả lời GHI (gốc ghi bằng GET).
   `strChucNangId` gốc đọc edu.system.strChucNangId — thuộc tính KHÔNG tồn tại nên luôn gửi undefined
   (bị bỏ); ở đây cũng không gửi (ums.api.call bỏ khoá undefined).
   ---------------------------------------------------------------------------
   ums.klgd.nam(ql)          nguồn ô Năm học (value = text = NIENHOC | NAMHOC)
   ums.klgd.namKyDot(loai, thoiGian)  nguồn GetThongTinNamKyDot (HOCKY / DOTHOC)
   ums.klgd.danhMuc(root, o) màn DANH MỤC một cột: ô năm học + bảng + biểu mẫu (modal "Thông tin" của gốc)
       o = { ql, title, formTitle, icon, ds, them, sua (cùng tên với them = một action cho cả hai), xoa, xoaKhoa,
             columns, fields, luu(v, row) → tham số riêng, napNgay (false: mở màn không nạp — qlklgd_dongia) }
   ums.klgd.nhapBang(o)       bảng nhập TRỰC TIẾP, lưu từng dòng (thietlapthoigian, khoiluongnckh…)
   Khác bản gốc (chung, ghi ở can-quyet.js):
     · Ô năm học chọn sẵn năm đầu danh sách (gốc để trống rồi vẫn nạp bảng với năm rỗng).
     · Hỏi lại một lần, chạy một lần (gốc gắn chồng $("#btnYes").click → lần bấm thứ n chạy n lần).
     · Lưu xong về danh sách (gốc giữ modal mở, lần "Cập nhật" sau thành SỬA bản ghi vừa tạo).
     · Lưu từng dòng: báo đúng số dòng lỗi (gốc kiểm lỗi trước khi lời gọi xong → luôn "thành công").
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var K = ums.klgd = ums.klgd || {};
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : String(v); }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : (d && d.rs) || []; }
    K.uid = uid; K.e = e; K.arr = arr;
    K.chucNang = function () { return (ums.state && ums.state.chucNangId) || ''; };
    K.ctl = function (ql) { return ql ? 'TKGG_QLKLGD/' : 'TKGG_KLGD/'; };
    K.g = function (action, o, post) { return ums.api.call(Object.assign({ action: action, method: post ? 'POST' : 'GET' }, o || {})); };

    /* ---------- Nguồn ---------------------------------------------------- */
    K.nam = function (ql) {
        return ql
            ? { call: { action: 'TKGG_QLKLGD/GetThongTinNamKyDot', method: 'GET', strLoaiThoiGian: 'NAMHOC', strNguoiThucHienId: uid() }, id: 'NAMHOC', name: 'NAMHOC' }
            : { call: { action: 'TKGG_KLGD/GetcboSchoolYear', method: 'GET', strChucNang_Id: K.chucNang(), strNguoiThucHien_Id: uid() }, id: 'NIENHOC', name: 'NIENHOC' };
    };
    K.namKyDot = function (loai, thoiGian) {
        return K.g('TKGG_QLKLGD/GetThongTinNamKyDot', { strThoiGian: thoiGian, strLoaiThoiGian: loai, strNguoiThucHienId: uid(), silent: true })
            .then(function (r) { return arr(r.data); });
    };
    /** Hậu tố kiểu miễn giảm: PHANTRAM → " %", TIET → " tiết" */
    K.kieu = function (v, kieu) { return e(v) + (kieu === 'PHANTRAM' ? ' %' : kieu === 'TIET' ? ' tiết' : ''); };
    K.KIEU_MG = [{ ID: 'PHANTRAM', TEN: '%' }, { ID: 'TIET', TEN: 'Tiết' }];

    /* =====================================================================
       Màn DANH MỤC một cột (danhmucdinhmuc, danhmucmiengiam, hesolopdong, dongia — hai họ)
       ===================================================================== */
    K.danhMuc = function (root, o) {
        var ctl = K.ctl(o.ql), nd = o.ql ? 'strNguoiThucHienId' : 'strNguoiDungId';
        var crud = ums.crud({
            root: root, title: o.title, formTitle: o.formTitle, icon: o.icon, listTitle: 'Danh sách',
            filters: [{ key: 'nam', type: 'select', label: 'Chọn năm học', first: true, source: K.nam(o.ql) }],
            autoload: false,
            list: { call: function (f) {
                var p = { action: ctl + o.ds, method: 'GET', strNamHoc: f.nam };
                p[o.ql ? 'strNguoiThucHienId' : 'strNguoiDung_Id'] = uid();
                return p;
            } },
            columns: o.columns, fields: o.fields, formCols: o.formCols,
            save: function (v, row, c) {
                var nam = c.filterValues().nam;
                if (!nam) { ui.toast('Bạn chưa chọn năm học', 'warn'); return null; }
                var p = Object.assign({ action: ctl + (row ? o.sua : o.them), method: 'GET', strId: row ? row.ID : '', strNamHoc: nam }, o.luu(v, row));
                p[nd] = uid();
                return p;
            },
            // Gốc nối id bằng dấu phẩy CÓ dấu phẩy thừa cuối ("id1,id2,") — giữ nguyên
            remove: function (ids) {
                var p = { action: ctl + o.xoa, method: 'GET' };
                p[o.xoaKhoa] = ids.join(',') + ',';
                p[nd] = uid();
                return [p];
            },
            removeConfirm: function () { return 'Bạn có chắc chắn xóa dữ liệu?'; }
        });
        crud.sourcesReady.then(function () { if (o.napNgay !== false || crud.filterValues().nam) crud.load(1); });
        return crud;
    };

    /* =====================================================================
       BỘ LỌC dùng chung (phanconggiangday, tuychinhkhoiluong — hai họ)
       K.boLoc(host, keys, ql, onDoi) — vẽ thanh lọc theo `keys` (thứ tự của gốc), nạp nguồn, nối tầng:
         nam → hk → dot (ql; bản cũ Học kỳ là ô TĨNH 1/2 chọn sẵn "1" nên chuỗi chỉ nam → dot)
         he → khoa · nam → bm → gv · (nam, hk, dot, he, bm) → hocPhan (ql)
       Khoá: nam hk dot he khoa csdt bm gv loaiTiet kieuLop loaiLop hocPhan
       → { F(k), v(k), hocKy() (cũ "<năm>_<kỳ>", ql giá trị ô), html, gan() }
       onDoi(k) gọi sau mỗi lần người dùng đổi một ô (sau khi đã nạp lại ô con).
       Nguồn (chép nguyên gốc):
         cũ: GetcboSchoolYear · GetDotHoc{strHocKy} DOT/DOT · GetTRAININGSYSTEMList · GetAcademicYearByFormOfEdu{EducationSystemId}
             · GetListCSDT ID/NAME · GetBoMonDuocPhanCong{strNamHoc} · GetListStaff{strNhomMonHocId} NHANVIENID/HOTEN
         ql: GetThongTinNamKyDot NAMHOC/HOCKY/DOTHOC (đợt ID/DOTHOC) · ListDS_HeDaoTao · ListDS_KhoaHoc{strHeDaoTaoId}
             · ListDS_CoSoDaoTao ID/MA · LayDS_PhanQuyenNguoiDungDonVi · GetDanhSachCanBoNienHoc STAFFID/HOTENMASO
             · ListDS_HinhThucHoc ID/TENHINHTHUCHOC · ListDS_HocPhanPhanGiang ID/TENHOCPHANFULL
       ===================================================================== */
    var NHAN = { nam: 'Chọn năm học', hk: 'Chọn học kỳ', dot: 'Chọn đợt', he: 'Chọn hệ đào tạo', khoa: 'Chọn khóa', csdt: 'Chọn CSĐT',
        bm: 'Chọn bộ môn', gv: 'Chọn giảng viên', loaiTiet: 'Tất cả', kieuLop: 'Tất cả kiểu lớp', loaiLop: 'Chọn kiểu lớp', hocPhan: 'Chọn học phần',
        kieuLopT: 'Chọn kiểu lớp', monHoc: 'Chọn học phần', ttDuyet: 'Toàn bộ' };
    /* Kiểu lớp tĩnh của màn tách lớp bản cũ (mã số KIEUHOC) */
    K.KIEU_LOP_T = [{ ID: '1', TEN: 'Lý thuyết' }, { ID: '0', TEN: 'Thực hành' }, { ID: '2', TEN: 'Thảo luận' }, { ID: '3', TEN: 'Bài tập' }, { ID: '4', TEN: 'Thực tập' },
        { ID: '5', TEN: 'Đồ án' }, { ID: '8', TEN: 'TKMH' }, { ID: '6', TEN: 'Thí nghiệm' }, { ID: '12', TEN: 'Ngoại ngữ' }, { ID: '13', TEN: 'GDTC' }, { ID: '14', TEN: 'BTL' }];
    K.LOAI_TIET = [{ ID: '0', TEN: 'TKB' }, { ID: '1', TEN: 'TKBNC' }, { ID: '2', TEN: 'TTHTQT' }];
    K.KIEU_LOP = [{ ID: '0', TEN: 'Thực hành' }, { ID: '1', TEN: 'Lý thuyết' }, { ID: '2', TEN: 'Thảo luận' }, { ID: '3', TEN: 'Bài tập' },
        { ID: '4', TEN: 'Thực tập' }, { ID: '5', TEN: 'Đồ án' }, { ID: '6', TEN: 'Thí nghiệm' }, { ID: '8', TEN: 'TKMH' }];
    K.boLoc = function (host, keys, ql, onDoi) {
        var ctl = K.ctl(ql), co = {};
        keys.forEach(function (k) { co[k] = true; });
        var api = {
            html: function (o) { return pat.filterBar(keys.map(function (k) { return { key: k, type: 'select', label: NHAN[k] }; }), o); },
            F: function (k) { return host.querySelector('[data-f="' + k + '"]'); },
            v: function (k) { var el = api.F(k); return el ? el.value : ''; },
            hocKy: function () { return ql ? api.v('hk') : (api.v('nam') ? api.v('nam') + '_' + api.v('hk') : ''); }
        };
        var v = api.v, F = api.F;
        function g(action, o) { return K.g(ctl + action, Object.assign({ strChucNang_Id: K.chucNang(), strNguoiThucHien_Id: uid(), strNguoiThucHienId: uid(), silent: true }, o)).then(function (r) { return arr(r.data); }); }
        function fill(k, p, id, name) {
            if (!co[k]) return Promise.resolve();
            return p.then(function (d) { pat.fill(F(k), d, { id: id, name: name, head: NHAN[k] }); })
                .catch(function (err) { ums.api.handle(err, NHAN[k].replace(/^Chọn /, '')); });
        }
        var NAP = {
            nam: function () {
                return ums.crud.loadSource(K.nam(ql)).then(function (d) { var c = ql ? 'NAMHOC' : 'NIENHOC'; pat.fill(F('nam'), d, { id: c, name: c, head: NHAN.nam }); });
            },
            hk: function () {
                if (!ql) { pat.fill(F('hk'), [{ ID: '1', TEN: '1' }, { ID: '2', TEN: '2' }], { head: NHAN.hk }); return Promise.resolve(); }
                return v('nam') ? fill('hk', K.namKyDot('HOCKY', v('nam')), 'HOCKY', 'HOCKY') : Promise.resolve();
            },
            dot: function () {
                if (!v('nam') || !v('hk')) return Promise.resolve();
                return ql ? fill('dot', K.namKyDot('DOTHOC', v('hk')), 'ID', 'DOTHOC') : fill('dot', g('GetDotHoc', { strHocKy: api.hocKy() }), 'DOT', 'DOT');
            },
            he: function () { return fill('he', g(ql ? 'ListDS_HeDaoTao' : 'GetTRAININGSYSTEMList', {}), 'ID', 'NAME'); },
            khoa: function () {
                if (!v('he')) return Promise.resolve();
                return fill('khoa', ql ? g('ListDS_KhoaHoc', { strHeDaoTaoId: v('he') }) : g('GetAcademicYearByFormOfEdu', { EducationSystemId: v('he') }), 'ID', 'NAME');
            },
            csdt: function () { return fill('csdt', g(ql ? 'ListDS_CoSoDaoTao' : 'GetListCSDT', {}), 'ID', ql ? 'MA' : 'NAME'); },
            bm: function () {
                if (!v('nam')) return Promise.resolve();
                return fill('bm', ql ? g('LayDS_PhanQuyenNguoiDungDonVi', { strNamHoc: v('nam'), strNguoiDungId: uid() }) : g('GetBoMonDuocPhanCong', { strNamHoc: v('nam') }), 'ID', 'NAME');
            },
            gv: function () {
                if (!v('bm')) return Promise.resolve();
                return ql ? fill('gv', g('GetDanhSachCanBoNienHoc', { strNhomMonHocId: v('bm') }), 'STAFFID', 'HOTENMASO')
                    : fill('gv', g('GetListStaff', { strNhomMonHocId: v('bm') }), 'NHANVIENID', 'HOTEN');
            },
            loaiTiet: function () { pat.fill(F('loaiTiet'), K.LOAI_TIET, { head: NHAN.loaiTiet }); return Promise.resolve(); },
            kieuLop: function () { pat.fill(F('kieuLop'), K.KIEU_LOP, { head: NHAN.kieuLop }); return Promise.resolve(); },
            loaiLop: function () { return fill('loaiLop', g('ListDS_HinhThucHoc', {}), 'ID', 'TENHINHTHUCHOC'); },
            kieuLopT: function () { pat.fill(F('kieuLopT'), K.KIEU_LOP_T, { head: NHAN.kieuLopT }); return Promise.resolve(); },
            ttDuyet: function () { pat.fill(F('ttDuyet'), [{ ID: '1', TEN: 'Đã duyệt' }, { ID: '0', TEN: 'Chưa duyệt' }], { head: NHAN.ttDuyet }); return Promise.resolve(); },
            /* Học phần của màn tách lớp: GetMonHocPhanCong — cũ COURSEID/TENMON (strDotHoc, strAyId, strKieuHoc, strDuLieuTach ''),
               ql IDHOCPHAN/TENHOCPHAN (strDotHocId, strKhoaHocId, strLoaiLopId) */
            monHoc: function () {
                var p = { strBoMonId: v('bm'), strHocKy: api.hocKy(), strHeDaoTaoId: v('he'), strCoSoDaoTaoId: v('csdt') };
                if (ql) { p.strDotHocId = v('dot'); p.strKhoaHocId = v('khoa'); p.strLoaiLopId = v('loaiLop'); }
                else { p.strDotHoc = v('dot'); p.strAyId = v('khoa'); p.strKieuHoc = v('kieuLopT'); p.strDuLieuTach = ''; }
                return fill('monHoc', g('GetMonHocPhanCong', p), ql ? 'IDHOCPHAN' : 'COURSEID', ql ? 'TENHOCPHAN' : 'TENMON');
            },
            hocPhan: function () {
                if (!v('bm')) { if (F('hocPhan')) pat.fill(F('hocPhan'), [], { head: NHAN.hocPhan }); return Promise.resolve(); }
                return fill('hocPhan', g('ListDS_HocPhanPhanGiang', { strNhomMonHocId: v('bm'), strNamHoc: v('nam'), strHocKy: v('hk'), strDotHoc: v('dot'),
                    strHeDaoTaoId: v('he') }), 'ID', 'TENHOCPHANFULL');
            }
        };
        /* Ô con cần nạp lại khi một ô đổi (ô "đích" bị xoá trắng bởi pat.chain) */
        var CON = { nam: ['hk', 'dot', 'bm', 'hocPhan'], hk: ['dot', 'hocPhan'], dot: ['hocPhan'], he: ['khoa', 'hocPhan'], bm: ['gv', 'hocPhan'] };
        if (!ql) CON.nam = ['dot', 'bm'];
        api.gan = function () {
            ui.enhance(host);
            // Nối tầng TRƯỚC: trình xử lý của pat.chain phải xoá trắng ô con trước khi ta nạp lại chúng
            pat.chain(ql ? [F('nam'), F('hk'), F('dot')] : [F('nam'), F('dot')], { phatLai: false });
            if (co.khoa) pat.chain([F('he'), F('khoa')], { phatLai: false });
            if (co.gv) pat.chain([F('nam'), F('bm'), F('gv')], { phatLai: false });
            else if (co.bm) pat.chain([F('nam'), F('bm')], { phatLai: false });
            keys.forEach(function (k) {
                jQuery(F(k)).on('select2:select select2:unselect select2:clear', function () {
                    if (!ql && k === 'hk') { F('dot').value = ''; jQuery(F('dot')).trigger('change.select2'); }
                    var con = (CON[k] || []).filter(function (c) { return co[c]; });
                    // Học phần (tách lớp) phụ thuộc gần như mọi ô — xoá trắng rồi nạp lại
                    if (co.monHoc && ['nam', 'hk', 'dot', 'he', 'khoa', 'csdt', 'bm', 'kieuLopT', 'loaiLop'].indexOf(k) >= 0) {
                        F('monHoc').value = ''; jQuery(F('monHoc')).trigger('change.select2'); con.push('monHoc');
                    }
                    if (co.hocPhan && con.indexOf('hocPhan') >= 0) { F('hocPhan').value = ''; jQuery(F('hocPhan')).trigger('change.select2'); }
                    Promise.all(con.map(function (c) { return NAP[c](); })).then(function () { if (onDoi) onDoi(k); });
                });
            });
            keys.forEach(function (k) { if (['dot', 'khoa', 'bm', 'gv', 'hocPhan', 'monHoc', 'hk'].indexOf(k) < 0 || (!ql && k === 'hk')) NAP[k](); });
            if (!ql) { F('hk').value = '1'; jQuery(F('hk')).trigger('change.select2'); }
        };
        return api;
    };

    /* =====================================================================
       Hộp "Import dữ liệu" (myModal_Upload + uploadImport của gốc): chọn tệp → tải lên (ums.upload) → bấm một nút import
       o = { mau: mã báo cáo tệp mẫu, nut: [{ text, action }], params() → tham số thêm, onDone() }
       Mỗi nút gọi <action> { …params(), strPath }. Message rỗng = "Import thành công", khác rỗng = "Import lỗi <Message>".
       ===================================================================== */
    K.hopImport = function (o) {
        var path = '';
        var dlg = ui.dialog({ title: 'Import dữ liệu', icon: 'fa-file-import', size: 'lg', body:
            ui.field('Chọn file Import', ui.file({ key: 'tep', accept: '.xls,.xlsx' })) + '<div class="ums-u-mt-2" data-i="kq"></div>',
            buttons: [{ text: 'Tải file mẫu', kind: 'excel', icon: 'fa-download', onClick: function () { ums.report.run(o.mau, {}); return false; } }]
                .concat(o.nut.map(function (n) { return { text: n.text, kind: 'save', onClick: function () { chay(n.action); return false; } }; })) });
        var B = dlg.body, kq = B.querySelector('[data-i="kq"]');
        ui.enhance(B);
        B.querySelector('[data-k="tep"]').addEventListener('change', function (ev) {
            var f = ev.target.files;
            if (!f || !f.length) return;
            path = '';
            kq.innerHTML = '<span class="ums-u-muted"><i class="fa-light fa-spinner fa-spin"></i> Đang tải tệp lên…</span>';
            ums.upload(f).then(function (p) { path = p; kq.innerHTML = '<span class="ums-u-muted">Đã tải tệp lên — bấm nút import tương ứng.</span>'; },
                function (err) { kq.innerHTML = '<span class="ums-u-danger">' + esc(err.message) + '</span>'; });
        });
        function chay(action) {
            if (!path) { ui.toast('Chưa chọn tệp import', 'warn'); return; }
            kq.innerHTML = '<span class="ums-u-muted"><i class="fa-light fa-spinner fa-spin"></i> Đang import…</span>';
            ums.api.call(Object.assign({ action: action, method: 'GET' }, o.params(), { strPath: path })).then(function (r) {
                kq.innerHTML = r.message ? '<span class="ums-u-danger">Import lỗi ' + esc(r.message) + '</span>' : '<span class="ums-u-blue">Import thành công</span>';
                if (o.onDone) o.onDone();
            }).catch(function (err) { kq.innerHTML = '<span class="ums-u-danger">Lỗi: ' + esc(err.message) + '</span>'; });
        }
        return dlg;
    };

    /* =====================================================================
       Bảng NHẬP TRỰC TIẾP, lưu từng dòng một lời gọi
       o = { el, title, icon, cot: [cột ums.ui.table], khoa(row) → khoá ô, empty }
       → { ve(rows), rows(), gt(row, k) đọc ô data-o="k", dat(k, v) ghi mọi ô k, luu(calls, okText) }
       Ô nhập trong bảng: '<input class="ums-input ums-input--sm" data-o="k" data-i="<chỉ số>">'
       ===================================================================== */
    K.o = function (k, i, v, attr) {
        return '<input class="ums-input ums-input--sm" data-o="' + k + '" data-i="' + i + '" value="' + esc(e(v)) + '" autocomplete="off"' + (attr || '') + '>';
    };
    K.nhapBang = function (o) {
        var rows = [];
        var api = {
            ve: function (d, loi) {
                rows = d || [];
                if (loi) { o.el.innerHTML = loi; return; }
                ui.table({ el: o.el, rows: rows, columns: o.cot, empty: o.empty || 'Không có dữ liệu' });
            },
            rows: function () { return rows; },
            dangTai: function () { o.el.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>'; },
            gt: function (i, k) {
                var el = o.el.querySelector('[data-o="' + k + '"][data-i="' + i + '"]');
                if (!el) return '';
                return el.type === 'checkbox' ? (el.checked ? '1' : '0') : (el.value || '').trim();
            },
            dat: function (k, v) { o.el.querySelectorAll('[data-o="' + k + '"]').forEach(function (el) { el.value = v; }); },
            /** Lưu tuần tự, báo gộp số dòng lỗi (gốc: strErr kiểm trước khi xong → luôn "thành công") */
            luu: function (calls, okText) {
                return ui.batch(calls, { title: 'Đang cập nhật', okText: okText || 'Cập nhật thành công', show: true });
            }
        };
        return api;
    };
})();
