/* =========================================================================
   Số tháng không học (sinh viên × thời gian)
   Bản gốc: ApisTaiChinh/Modules/danhmucheso/scripts/sothangkhonghoc.js
   ---------------------------------------------------------------------------
   Ba vùng như bản gốc:
     1. Lưới: dòng = sinh viên, cột = thời gian; sửa trong ô rồi "Cập nhật".
     2. Hộp sửa một bản ghi (nút bút trong ô có giá trị) + Xoá.
     3. "Thêm mới": danh sách sinh viên của lớp, mỗi dòng chọn chương trình,
        đối tượng, số tháng; đánh dấu rồi Lưu hàng loạt.
   Lời gọi (kiểu cũ, không mã hoá):
       TC_NguoiHoc_SoThang/LayDSThoiGian_DT_SoThang   GET  cột thời gian
       TC_NguoiHoc_SoThang/LayDSTaiChinh_NH_SoThang   GET  dòng sinh viên
       TC_NguoiHoc_SoThang/LayDanhSach                GET  giá trị các ô
       TC_NguoiHoc_SoThang/ThemMoi | CapNhat          POST (CapNhat khi có strId)
       TC_NguoiHoc_SoThang/Xoa                        POST strIds
       CM_ThoiGianDaoTao/LayDSDAOTAO_ThoiGianDaoTao   GET  ô thời gian
       TC_KhoanThu/LayDanhSach                        GET  ô khoản thu
       SV_ChuongTrinhCuaHocVien/LayDanhSach           GET  chương trình của từng SV (vùng 3)
       pkg_hosohocvien.LayDanhSachHoSo                     sinh viên của lớp (edu.system.getList_SinhVien)
       danh mục QLTC.DTMG                                   đối tượng
   Hệ / Khoá / CT / Lớp: edu.system.getList_* (không lọc quyền). Khoá và
   Chương trình nạp MỘT lần rồi lọc tại máy như bản gốc.

   Khác bản gốc (có chủ đích):
     · getList_SinhVien: bản gốc truyền pageSize 100000 nhưng hàm hệ thống
       bỏ qua và dùng edu.system.pageSize_default (thường là 10) → chỉ ra
       10 sinh viên đầu lớp. Ở đây gửi pageIndex 1 / pageSize 100000 như
       màn hình muốn.
     · Bộ nhớ chương trình: bản gốc nạp một lần với khoá ĐANG chọn rồi lọc
       tại máy — nếu lần đầu chọn Khoá A thì đổi sang Khoá B không còn
       chương trình nào. Ở đây luôn nạp một lần với khoá rỗng (= như khi đi
       từ ô Hệ, đường thường gặp) rồi lọc.
   Cố ý bỏ: getList_KieuHoc (CM_DanhMucDuLieu/LayDanhSach KHDT.DIEM.KIEUHOC)
     — các ô kiểu học đều ẩn; ô lọc/ô thêm ẩn luôn gửi rỗng, ô sửa ẩn gửi
     lại KIEUHOC_ID của bản ghi. Giữ nguyên các giá trị đó mà không nạp ô.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, B = ums.dmhsB, esc = ui.esc, e = B.e;
    var root = document.getElementById('sothangkhonghoc');
    var st = { kt: [], tg: [], dt: [], khoaAll: null, ctAll: null, cols: [], rows: [], vals: [], grid: null, sv: [] };

    root.innerHTML =
        '<div data-z="list">' +
        '<div class="ums-page__head"><h1 class="ums-page__title ums-u-mb-0">Số tháng không học</h1>' +
        '<div class="ums-page__actions">' +
            ui.btn('save', { text: 'Cập nhật', mod: 'primary', attr: { 'data-do': 'update' } }) +
            ui.btn('add', { attr: { 'data-do': 'add' } }) +
        '</div></div>' +
        '<div class="ums-panel ums-u-mb-4"><div class="ums-panel__body"><div class="ums-filter">' +
            '<div class="ums-field"><select class="ums-select" data-f="he"></select></div>' +
            '<div class="ums-field"><select class="ums-select" data-f="khoa"></select></div>' +
            '<div class="ums-field"><select class="ums-select" data-f="ct"></select></div>' +
            '<div class="ums-field"><select class="ums-select" data-f="lop"></select></div>' +
            '<div class="ums-field"><select class="ums-select" data-f="kt"></select></div>' +
            '<div class="ums-field"><select class="ums-select" data-f="tg"></select></div>' +
            '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-do': 'search' } }) + '</div>' +
        '</div></div></div>' +
        '<div class="ums-panel"><div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-calendar-xmark"></i> Danh sách ' +
            '<span class="ums-u-faint ums-u-fz13" data-z="count"></span></div>' +
            '<div class="ums-panel__tools ums-u-faint ums-u-fz12">Sửa trực tiếp trong ô rồi bấm “Cập nhật”.</div></div>' +
        '<div class="ums-panel__body ums-panel__body--flush" data-z="grid">' +
            ui.empty('Chọn hệ, khoá, chương trình, lớp rồi bấm Tìm kiếm', 'fa-filter') + '</div></div>' +
        '</div>' +

        '<div data-z="add" hidden>' +
        '<div class="ums-panel"><div class="ums-panel__head">' +
            '<div class="ums-panel__title"><i class="fa-light fa-pen-to-square"></i> Thêm sinh viên - tháng <span class="ums-u-faint ums-u-fz13" data-z="lopTen"></span></div>' +
            '<div class="ums-panel__tools">' + ui.btn('close', { attr: { 'data-do': 'back' } }) + ui.btn('save', { attr: { 'data-do': 'saveNew' } }) + '</div></div>' +
        '<div class="ums-panel__body">' +
            '<div class="ums-filter ums-u-mb-4">' +
                '<div class="ums-field"><select class="ums-select" data-n="kt"></select></div>' +
                '<div class="ums-field"><select class="ums-select" data-n="tg"></select></div>' +
                '<div class="ums-field"><input class="ums-input" data-n="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                '<div class="ums-field"><input class="ums-input" data-n="macdinh" placeholder="Nhập số tháng mặc định" autocomplete="off"></div>' +
                '<div class="ums-field ums-field--fit"><button type="button" class="ums-btn ums-btn--out-primary" data-do="fill"><i class="fa-light fa-wand-magic-sparkles"></i><span>Điền tự động</span></button></div>' +
            '</div>' +
        '</div>' +
        '<div class="ums-panel__body ums-panel__body--flush" data-z="svTable"></div></div>' +
        '</div>';

    function q(s) { return root.querySelector(s); }
    var F = {}, N = {};
    ['he', 'khoa', 'ct', 'lop', 'kt', 'tg'].forEach(function (k) { F[k] = q('[data-f="' + k + '"]'); });
    ['kt', 'tg', 'q', 'macdinh'].forEach(function (k) { N[k] = q('[data-n="' + k + '"]'); });
    var HEAD = { he: 'Chọn hệ đào tạo', khoa: 'Chọn khóa đào tạo', ct: 'Chọn chương trình đào tạo', lop: 'Chọn lớp quản lý', kt: 'Chọn khoản thu', tg: 'Chọn học kỳ' };
    Object.keys(F).forEach(function (k) { F[k].innerHTML = '<option value="">' + esc(HEAD[k]) + '</option>'; });
    ['kt', 'tg'].forEach(function (k) { N[k].innerHTML = '<option value="">' + esc(HEAD[k]) + '</option>'; });
    ui.enhance(root);                 // một lần cho mọi ô chọn (thay vòng lặp select2)
    var zList = q('[data-z="list"]'), zAdd = q('[data-z="add"]'), zGrid = q('[data-z="grid"]');

    function fail(where) { return function (err) { ums.api.handle(err, where); }; }

    /* --- Nguồn --- */
    ums.ref.heDaoTao({ pageIndex: 1, pageSize: 1000 })
        .then(function (r) { B.fill(F.he, r, { name: 'TENHEDAOTAO', head: HEAD.he }); }, fail('nạp hệ đào tạo'));

    function khoaAll() {
        if (!st.khoaAll) st.khoaAll = ums.ref.khoaDaoTao({ strHeDaoTao_Id: '', pageIndex: 1, pageSize: 10000 });
        return st.khoaAll;
    }
    function fillKhoa() {
        return khoaAll().then(function (r) {
            var he = F.he.value;
            B.fill(F.khoa, he ? r.filter(function (x) { return x.DAOTAO_HEDAOTAO_ID == he; }) : r, { name: 'TENKHOA', head: HEAD.khoa });
        }, fail('nạp khoá đào tạo'));
    }
    fillKhoa();

    function ctAll() {
        if (!st.ctAll) st.ctAll = ums.ref.chuongTrinh({ strKhoaDaoTao_Id: '', pageIndex: 1, pageSize: 10000 });
        return st.ctAll;
    }
    function fillCT(khoa) {
        return ctAll().then(function (r) {
            B.fill(F.ct, khoa ? r.filter(function (x) { return x.DAOTAO_KHOADAOTAO_ID == khoa; }) : r, { name: 'TENCHUONGTRINH', head: HEAD.ct });
        }, fail('nạp chương trình'));
    }
    function loadLop(khoa, ct) {
        return ums.ref.lopQuanLy({ strKhoaDaoTao_Id: khoa, strToChucCT_Id: ct, pageIndex: 1, pageSize: 10000 })
            .then(function (r) { B.fill(F.lop, r, { name: 'TEN', head: HEAD.lop }); }, fail('nạp lớp quản lý'));
    }

    B.rows({
        action: 'CM_ThoiGianDaoTao/LayDSDAOTAO_ThoiGianDaoTao',
        method: 'GET',
        versionAPI: 'v1.0',
        strDAOTAO_Nam_Id: '',
        strNguoiThucHien_Id: '',
        strTuKhoa: '',
        pageIndex: 1,
        pageSize: 10000
    }).then(function (r) {
        st.tg = r;
        B.fill(F.tg, r, { name: 'DAOTAO_THOIGIANDAOTAO', head: HEAD.tg });
        B.fill(N.tg, r, { name: 'DAOTAO_THOIGIANDAOTAO', head: HEAD.tg });
    }, fail('nạp thời gian'));

    B.khoanThu().then(function (r) {
        st.kt = r;
        B.fill(F.kt, r, { head: HEAD.kt });
        B.fill(N.kt, r, { head: HEAD.kt });
    }, fail('nạp khoản thu'));

    // Đối tượng: loadToCombo_DanhMucDuLieu("QLTC.DTMG", "dropEdit_DoiTuong")
    ums.api.dm('QLTC.DTMG').then(function (r) { st.dt = r; }, fail('nạp đối tượng'));

    /* --- Sự kiện lọc (select2:select như bản gốc) --- */
    function onPick(el, fn) { jQuery(el).on('select2:select', fn); }
    onPick(F.he, function () { fillKhoa(); loadLop('', ''); fillCT(''); });
    onPick(F.khoa, function () { fillCT(F.khoa.value); loadLop(F.khoa.value, ''); });
    onPick(F.ct, function () { loadLop(F.khoa.value, F.ct.value); });
    onPick(F.lop, function () { load(); });
    ums.pat.chain([F.he, F.khoa, F.ct, F.lop]);     // xoá tầng trên thì xoá tầng dưới

    function f() {
        return { he: F.he.value, khoa: F.khoa.value, ct: F.ct.value, lop: F.lop.value, kieuHoc: '', kt: F.kt.value, tg: F.tg.value };
    }
    function base(v) {
        return {
            strHeDaoTao_Id: v.he,
            strKhoaDaoTao_Id: v.khoa,
            strChuongTrinh_Id: v.ct,
            strLopQuanLy_Id: v.lop,
            strDiem_KieuHoc_Id: v.kieuHoc,
            strTaiChinh_CacKhoanThu_Id: v.kt,
            strDaoTao_ThoiGianDaoTao_Id: v.tg,
            strNguoiThucHien_Id: ''
        };
    }
    function merge(a, b) { Object.keys(b).forEach(function (k) { a[k] = b[k]; }); return a; }

    /* --- Lưới --- */
    var token = 0;
    function load() {
        var my = ++token, v = f();
        zGrid.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
        return ums.api.call(merge({ action: 'TC_NguoiHoc_SoThang/LayDSThoiGian_DT_SoThang', method: 'GET' }, base(v)))
            .then(function (r) {
                if (my !== token) return;
                st.cols = B.arr(r.data);
                return ums.api.call(merge({ action: 'TC_NguoiHoc_SoThang/LayDSTaiChinh_NH_SoThang', method: 'GET', strTuKhoa: '' }, base(v)));
            }).then(function (r) {
                if (my !== token || !r) return;
                st.rows = B.arr(r.data);
                q('[data-z="count"]').textContent = '(' + st.rows.length + ')';
                // Thứ tự lời gọi giữ nguyên bản gốc (cột → dòng → giá trị);
                // lưới chỉ vẽ khi đã có cả ba.
                return ums.api.call({
                    action: 'TC_NguoiHoc_SoThang/LayDanhSach',
                    method: 'GET',
                    versionAPI: 'v1.0',
                    strTuKhoa: '',
                    strHeDaoTao_Id: v.he,
                    strKhoaDaoTao_Id: v.khoa,
                    strChuongTrinh_Id: v.ct,
                    strLopQuanLy_Id: v.lop,
                    strDiem_KieuHoc_Id: v.kieuHoc,
                    strTaiChinh_CacKhoanThu_Id: v.kt,
                    strDaoTao_ThoiGianDaoTao_Id: v.tg,
                    strQLSV_NguoiHoc_Id: '',
                    strQLSV_DoiTuong_Id: '',
                    strNguoiThucHien_Id: '',
                    pageIndex: 1,
                    pageSize: 100000
                }).then(function (r3) {
                    if (my !== token) return;
                    st.vals = B.arr(r3.data);
                    st.grid = B.grid({
                        el: zGrid, cols: st.cols, rows: st.rows,
                        key: function (x) { return e(x.QLSV_NGUOIHOC_ID); },
                        lead: [
                            { title: 'Mã học viên', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-center is-nowrap' },
                            { title: 'Họ tên', render: function (x) { return esc(e(x.QLSV_NGUOIHOC_HODEM) + ' ' + e(x.QLSV_NGUOIHOC_TEN)); }, cls: 'is-nowrap' },
                            { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' },
                            { title: 'Chương trình', prop: 'DAOTAO_TOCHUCCHUONGTRINH_TEN' },
                            { title: 'Lớp', prop: 'QLSV_NGUOIHOC_LOP', cls: 'is-nowrap' }
                        ],
                        empty: 'Không có dữ liệu',
                        vals: st.vals,
                        map: {
                            row: function (x) { return x.QLSV_NGUOIHOC_ID; },
                            col: function (x) { return x.DAOTAO_THOIGIANDAOTAO_ID; },
                            val: function (x) { return x.SOTHANG; },
                            onEdit: openEdit
                        }
                    });
                });
            }).catch(function (err) {
                if (my !== token) return;
                zGrid.innerHTML = ui.fail(err.message);
                ums.api.handle(err, 'số tháng không học');
            });
    }

    function saveCall(o) {
        return {
            action: o.strId ? 'TC_NguoiHoc_SoThang/CapNhat' : 'TC_NguoiHoc_SoThang/ThemMoi',
            versionAPI: 'v1.0',
            strId: o.strId,
            strDaoTao_ToChucCT_Id: o.strDaoTao_ToChucCT_Id,
            strQLSV_NguoiHoc_Id: o.strQLSV_NguoiHoc_Id,
            strQLSV_DoiTuong_Id: o.strQLSV_DoiTuong_Id,
            strDaoTao_ThoiGianDaoTao_Id: o.strDaoTao_ThoiGianDaoTao_Id,
            dSoThang: o.dSoThang,
            strDiem_KieuHoc_Id: o.strDiem_KieuHoc_Id,
            strTaiChinh_CacKhoanThu_Id: o.strTaiChinh_CacKhoanThu_Id,
            strNguoiThucHien_Id: ''
        };
    }

    function updateAll() {
        if (!st.grid) { ui.toast('Chưa có bảng để cập nhật — hãy tìm kiếm trước.', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn muốn lưu toàn bộ các ô đã sửa không?', { title: 'Cập nhật' }).then(function (yes) {
            if (!yes) return;
            var list = st.grid.changed();
            if (!list.length) { ui.toast('Chưa có giá trị mới nào cần lưu', 'info'); return; }
            var v = f();
            ui.batch(list.map(function (c) {
                var rec = c.rec || {};
                return saveCall({
                    strId: c.id,
                    // ô chưa có bản ghi: chương trình lấy theo ô lọc (bản gốc: temp == "")
                    strDaoTao_ToChucCT_Id: c.rec ? e(rec.DAOTAO_TOCHUCCHUONGTRINH_ID) : v.ct,
                    strQLSV_NguoiHoc_Id: c.key,
                    strQLSV_DoiTuong_Id: e(rec.QLSV_DOITUONG_ID),
                    strDaoTao_ThoiGianDaoTao_Id: c.col,
                    dSoThang: c.value,
                    strDiem_KieuHoc_Id: v.kieuHoc,
                    strTaiChinh_CacKhoanThu_Id: v.kt
                });
            }), { title: 'Đang lưu', okText: 'Đã lưu' }).then(function () { load(); });
        });
    }

    /* --- Sửa một bản ghi — biểu mẫu NGAY TRONG TRANG, thay chỗ màn (BO-CUC luật 1) --- */
    function openEdit(rec) {
        var body = document.createElement('div');
        body.className = 'ums-grid ums-grid--2';
        body.innerHTML =
            ui.field('Sinh viên', '<div class="ums-input" style="display:flex;align-items:center">' +
                esc(e(rec.QLSV_NGUOIHOC_MASO) + ' - ' + e(rec.QLSV_NGUOIHOC_HODEM) + ' ' + e(rec.QLSV_NGUOIHOC_TEN)) + '</div>', { inline: true }) +
            ui.field('Chương trình', '<div class="ums-input" style="display:flex;align-items:center">' + esc(rec.DAOTAO_TOCHUCCHUONGTRINH_TEN) + '</div>', { inline: true }) +
            ui.field('Loại khoản', '<select class="ums-select" data-g="kt"></select>', { inline: true }) +
            ui.field('Thời gian', '<select class="ums-select" data-g="tg"></select>', { inline: true }) +
            ui.field('Đối tượng', '<select class="ums-select" data-g="dt"></select>', { inline: true }) +
            ui.field('Số tháng', '<input class="ums-input" data-g="val" autocomplete="off">', { inline: true, required: true });
        function g(k) { return body.querySelector('[data-g="' + k + '"]'); }
        var dlg = ums.pat.formTrang({
            host: root, title: 'Sửa sinh viên - tháng không học', body: body,
            buttons: [
                { text: 'Xoá', kind: 'del', onClick: function (d) { remove(rec, d); return false; } },
                { text: 'Lưu', kind: 'save', onClick: function (d) { save(d); return false; } }
            ]
        });
        B.fill(g('kt'), st.kt, { head: HEAD.kt });
        B.fill(g('tg'), st.tg, { name: 'DAOTAO_THOIGIANDAOTAO', head: HEAD.tg });
        B.fill(g('dt'), st.dt, { head: 'Chọn đối tượng' });
        g('kt').value = e(rec.TAICHINH_CACKHOANTHU_ID);
        g('tg').value = e(rec.DAOTAO_THOIGIANDAOTAO_ID);
        g('dt').value = e(rec.QLSV_DOITUONG_ID);
        g('val').value = e(rec.SOTHANG);
        ui.enhance(dlg.body);
        // ô chọn đã được bọc select2 lúc dựng biểu mẫu → báo vẽ lại theo giá trị vừa đặt (không bắn change thật)
        if (window.jQuery) ['kt', 'tg', 'dt'].forEach(function (k) { jQuery(g(k)).trigger('change.select2'); });

        function save(d) {
            ums.api.call(saveCall({
                strId: e(rec.ID),
                strDaoTao_ToChucCT_Id: e(rec.DAOTAO_TOCHUCCHUONGTRINH_ID),
                strQLSV_NguoiHoc_Id: e(rec.QLSV_NGUOIHOC_ID),
                strQLSV_DoiTuong_Id: g('dt').value,
                strDaoTao_ThoiGianDaoTao_Id: g('tg').value,
                dSoThang: g('val').value.trim(),
                strDiem_KieuHoc_Id: e(rec.KIEUHOC_ID),     // ô kiểu học ẩn, giữ giá trị của bản ghi
                strTaiChinh_CacKhoanThu_Id: g('kt').value
            })).then(function () {
                ui.toast('Cập nhật thành công', 'ok');
                d.close();
                load();
            }).catch(fail('lưu'));
        }
    }

    function remove(rec, d) {
        ui.confirm('Xoá bản ghi này? Thao tác này không hoàn tác được.', { tone: 'bad', ok: 'Xoá', title: 'Xoá dữ liệu' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({ action: 'TC_NguoiHoc_SoThang/Xoa', versionAPI: 'v1.0', strIds: rec.ID, strNguoiThucHien_Id: '' })
                .then(function () { ui.toast('Xoá thành công!', 'ok'); d.close(); load(); })
                .catch(fail('xoá'));
        });
    }

    /* --- Vùng thêm mới --- */
    function openAdd() {
        var v = f();
        if (!v.he || !v.khoa || !v.ct || !v.lop) { ui.toast('Hãy chọn Hệ - Khóa - Chương trình - Lớp trước!', 'warn'); return; }
        N.kt.value = ''; N.tg.value = ''; N.q.value = ''; N.macdinh.value = '';
        jQuery(N.kt).trigger('change.select2'); jQuery(N.tg).trigger('change.select2');
        q('[data-z="lopTen"]').textContent = '— ' + (F.lop.options[F.lop.selectedIndex] || {}).text;
        ui.swap(zList, zAdd);
        var host = q('[data-z="svTable"]');
        host.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
        // edu.system.getList_SinhVien — xem ghi chú đầu tệp về pageSize
        ums.ref.sinhVien({ strLopQuanLy_Id: v.lop, pageIndex: 1, pageSize: 100000 }).then(function (r) {
            st.sv = r;
            ui.table({
                el: host, rows: r, empty: 'Lớp không có sinh viên',
                columns: [
                    { title: 'Mã học viên', prop: 'MASO', cls: 'is-nowrap' },
                    { title: 'Họ tên', render: function (x) { return esc(e(x.HODEM) + ' ' + e(x.TEN)); }, cls: 'is-nowrap' },
                    { title: 'Ngày sinh', cls: 'is-center is-nowrap', render: function (x) { return esc(e(x.NGAYSINH_NGAY) + '/' + e(x.NGAYSINH_THANG) + '/' + e(x.NGAYSINH_NAM)); } },
                    { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN', cls: 'is-nowrap' },
                    { title: 'Chương trình', render: function (x, i) { return '<select class="ums-select" data-sv-ct="' + i + '"><option value="">Chọn chương trình</option></select>'; } },
                    { title: 'Đối tượng', render: function (x, i) { return '<select class="ums-select" data-sv-dt="' + i + '"></select>'; } },
                    { title: 'Số tháng', width: '110px', render: function (x, i) { return '<input class="ums-input ums-input--sm" data-sv-val="' + i + '" autocomplete="off">'; } },
                    { head: '<input type="checkbox" data-sv-all title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (x, i) { return '<input type="checkbox" data-sv-pick="' + i + '">'; } }
                ]
            });
            r.forEach(function (x, i) {
                B.fill(host.querySelector('[data-sv-dt="' + i + '"]'), st.dt, { head: 'Chọn đối tượng' });
            });
            ui.enhance(host);           // gắn select2 cho mọi ô chọn trong bảng

            // Chương trình của từng sinh viên — một lời gọi mỗi dòng như bản gốc
            ui.batch(r.map(function (x, i) {
                return function () {
                    return B.rows({ action: 'SV_ChuongTrinhCuaHocVien/LayDanhSach', method: 'GET', versionAPI: 'v1.0', strQLSV_NguoiHoc_Id: x.ID })
                        .then(function (list) {
                            var sel = host.querySelector('[data-sv-ct="' + i + '"]');
                            B.fill(sel, list, {
                                id: 'DAOTAO_TOCHUCCHUONGTRINH_ID', head: 'Chọn chương trình',
                                name: function (c) { return e(c.DAOTAO_CHUONGTRINH_MA) + ' ' + e(c.DAOTAO_CHUONGTRINH_TEN); }
                            });
                            if (list.length === 1) { sel.value = e(list[0].DAOTAO_TOCHUCCHUONGTRINH_ID); jQuery(sel).trigger('change.select2'); }   // selectOne
                        });
                };
            }), { concurrency: 4, toast: false }).then(function (res) {
                if (res.fail) ui.toast('Không nạp được chương trình của ' + res.fail + ' sinh viên: ' + res.errors[0], 'warn');
            });
        }).catch(function (err) {
            host.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'nạp sinh viên');
        });
    }

    function saveNew() {
        if (!N.kt.value || !N.tg.value) { ui.toast('Kiểm tra lại: khoản thu, thời gian đào tạo', 'warn'); return; }
        var host = q('[data-z="svTable"]');
        ui.confirm('Bạn có chắc chắn muốn lưu không?', { title: 'Lưu' }).then(function (yes) {
            if (!yes) return;
            var calls = [];
            st.sv.forEach(function (x, i) {
                var pick = host.querySelector('[data-sv-pick="' + i + '"]');
                if (!pick || !pick.checked) return;
                calls.push(saveCall({
                    strId: '',
                    strDaoTao_ToChucCT_Id: host.querySelector('[data-sv-ct="' + i + '"]').value,
                    strQLSV_NguoiHoc_Id: e(x.ID),
                    strQLSV_DoiTuong_Id: host.querySelector('[data-sv-dt="' + i + '"]').value,
                    strDaoTao_ThoiGianDaoTao_Id: N.tg.value,
                    dSoThang: host.querySelector('[data-sv-val="' + i + '"]').value.trim(),
                    strDiem_KieuHoc_Id: '',                        // #dropNew_KieuHoc ẩn — luôn rỗng
                    strTaiChinh_CacKhoanThu_Id: N.kt.value
                }));
            });
            if (!calls.length) { ui.toast('Chưa có sinh viên nào được chọn để lưu', 'info'); return; }
            ui.batch(calls, { title: 'Đang lưu', okText: 'Đã lưu' }).then(function () {
                ui.swap(zAdd, zList);
                load();
            });
        });
    }

    /* --- Sự kiện chung --- */
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-do]');
        if (!b || !root.contains(b)) return;
        var act = b.getAttribute('data-do');
        if (act === 'search') load();
        else if (act === 'update') updateAll();
        else if (act === 'add') openAdd();
        else if (act === 'back') { ui.swap(zAdd, zList); }
        else if (act === 'saveNew') saveNew();
        else if (act === 'fill') {
            var val = N.macdinh.value;
            Array.prototype.forEach.call(root.querySelectorAll('[data-sv-val]'), function (x) { if (x.value === '') x.value = val; });
        }
    });
    zAdd.addEventListener('change', function (ev) {
        var x = ev.target;
        if (x.hasAttribute('data-sv-all')) {
            Array.prototype.forEach.call(zAdd.querySelectorAll('[data-sv-pick]'), function (y) { y.checked = x.checked; y.closest('tr').classList.toggle('is-selected', x.checked); });
        } else if (x.hasAttribute('data-sv-pick')) {
            x.closest('tr').classList.toggle('is-selected', x.checked);
        }
    });
    N.q.addEventListener('input', function () {
        var v = N.q.value.toLowerCase();
        Array.prototype.forEach.call(zAdd.querySelectorAll('[data-z="svTable"] tbody tr'), function (tr) {
            tr.hidden = v && tr.textContent.toLowerCase().indexOf(v) < 0;
        });
    });
})();
