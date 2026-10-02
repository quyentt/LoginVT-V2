/* =========================================================================
   Mức miễn giảm (theo đối tượng × thời gian)
   Bản gốc: ApisTaiChinh/Modules/miengiam/scripts/mucmiengiammoi.js
   ---------------------------------------------------------------------------
   Lưới nhập: dòng = đối tượng miễn giảm (danh mục QLTC.DTMG), cột = thời
   gian do máy chủ trả, ô = phần trăm miễn. Sửa trong ô rồi "Cập nhật" để
   lưu hàng loạt, hoặc bấm nút sửa cạnh ô để mở biểu mẫu một bản ghi (trong trang).

   Lời gọi (chép nguyên bản gốc, đều là action kiểu cũ, không mã hoá):
       TC_MucMienGiam/LayDSThoiGian_MucMienGiam  GET  cột thời gian
       CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM  QLTC.DTMG  dòng (getList_DanhMucDulieu)
       TC_MucMienGiam/LayDanhSach                GET  giá trị ô
       TC_MucMienGiam/ThemMoi | CapNhat          lưu (CapNhat khi ô đã có bản ghi)
       TC_MucMienGiam/Xoa                        xoá, strIds = id bản ghi
   Nguồn ô chọn: TC_KhoanThu/LayDanhSach, CM_DanhMucDuLieu/LayDanhSach
   (KHDT.DIEM.KIEUHOC), CM_ThoiGianDaoTao/LayDSDAOTAO_ThoiGianDaoTao,
   Hệ/Khoá/Chương trình qua ums.ref.cascade.

   Khác bản gốc:
     · Nút Xoá của biểu mẫu chỉ hiện khi sửa — bản gốc hiện cả khi thêm
       mới và gửi Xoa với strIds rỗng.
     · Lưu xong thì đóng biểu mẫu (bản gốc để mở và báo trong hộp).
     · Bỏ mã chết: dropChuongTrinhDaoTao_Form_MMG không tồn tại.
   ========================================================================= */
(function () {
    'use strict';

    var M = ums.miengiam, ui = ums.ui, esc = ui.esc;
    var root = document.getElementById('mucmiengiammoi');

    root.innerHTML =
        M.head('Mức miễn giảm',
            M.btn('update', 'fa-floppy-disk', 'Cập nhật', 'save') +
            M.btn('add', 'fa-plus', 'Thêm mới', 'add')) +
        '<div class="ums-panel ums-u-mb-4"><div class="ums-panel__body"><div class="ums-filter">' +
            M.filterSelect('he', 'Chọn hệ đào tạo') +
            M.filterSelect('khoa', 'Chọn khoá đào tạo') +
            M.filterSelect('ct', 'Chọn chương trình đào tạo') +
            M.filterSelect('kt', 'Chọn khoản thu') +
            M.filterSelect('kh', 'Chọn kiểu học') +
            M.filterSelect('tg', 'Chọn học kỳ') +
            '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-act': 'search' } }) + '</div>' +
        '</div></div></div>' +
        '<div class="ums-panel"><div class="ums-panel__head"><div class="ums-panel__title">' +
            '<i class="fa-light fa-list-timeline"></i> Danh sách <span class="ums-u-faint ums-u-fz13" data-z="count"></span></div>' +
            '<div class="ums-panel__tools ums-u-fz13 ums-u-faint">Enter / ↑ ↓ để chuyển ô</div></div>' +
        '<div class="ums-panel__body ums-panel__body--flush" data-z="grid">' +
            ui.empty('Chọn hệ – khoá – chương trình rồi bấm Tìm kiếm', 'fa-magnifying-glass') + '</div></div>';

    M.initFilters(root);
    var f = function (k) { return M.fv(root, k); };
    var grid = root.querySelector('[data-z="grid"]');
    var mx = null;

    M.khoanThu().then(function (r) { M.fill(M.f(root, 'kt'), r, { head: 'Chọn khoản thu' }); }).catch(function (err) { ums.api.handle(err, 'khoản thu'); });
    M.kieuHoc().then(function (r) { M.fill(M.f(root, 'kh'), r, { head: 'Chọn kiểu học' }); }).catch(function (err) { ums.api.handle(err, 'kiểu học'); });
    M.thoiGian().then(function (r) { M.fill(M.f(root, 'tg'), r, { head: 'Chọn học kỳ', name: 'DAOTAO_THOIGIANDAOTAO' }); }).catch(function (err) { ums.api.handle(err, 'thời gian'); });

    // Bản gốc: chọn chương trình thì tìm luôn
    ums.ref.cascade({
        he: M.f(root, 'he'), khoa: M.f(root, 'khoa'), ct: M.f(root, 'ct'),
        labels: { he: 'Chọn hệ đào tạo', khoa: 'Chọn khoá đào tạo', ct: 'Chọn chương trình đào tạo' },
        onChange: function (v, level) { if (level === 'ct' && v.ct) search(); }
    });

    /* ---------- Nạp lưới: cột thời gian → dòng đối tượng → giá trị ô --- */
    function search() {
        grid.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        var cols;
        return M.rows({
            action: 'TC_MucMienGiam/LayDSThoiGian_MucMienGiam',
            method: 'GET',
            strDaoTao_ThoiGianDaoTao_Id: f('tg'),
            strHeDaoTao_Id: f('he'),
            strKhoaDaoTao_Id: f('khoa'),
            strChuongTrinh_Id: f('ct'),
            strDiem_KieuHoc_Id: f('kh'),
            strTaiChinh_CacKhoanThu_Id: f('kt'),
            strNguoiThucHien_Id: ''
        }).then(function (c) {
            cols = c;
            return Promise.all([M.dmdl('QLTC.DTMG'), M.rows({
                action: 'TC_MucMienGiam/LayDanhSach',
                method: 'GET',
                versionAPI: 'v1.0',
                dTuKhoa_number: -1,
                strTuKhoa: '',
                pageIndex: 1,
                pageSize: 10000,
                strPhamViApDung_Id: f('ct'),
                strPhanCapApDung_Id: '',
                strNgayApDung: '',
                strQLSV_DoiTuong_Id: '',
                strDaoTao_ThoiGianDaoTao_Id: f('tg'),
                strNguoiThucHien_Id: '',
                strDiem_KieuHoc_Id: f('kh'),
                strTaiChinh_CacKhoanThu_Id: f('kt'),
                strDangKy_DotDangKyHoc_Id: ''
            })]);
        }).then(function (x) {
            var doiTuong = x[0], cells = x[1];
            root.querySelector('[data-z="count"]').textContent = '(' + doiTuong.length + ' đối tượng × ' + cols.length + ' học kỳ)';
            mx = M.matrix({
                el: grid, rows: doiTuong, cols: cols, cells: cells,
                rowKey: function (r) { return r.ID; },
                lead: [
                    { title: 'Mã đối tượng', prop: 'MA', cls: 'is-nowrap' },
                    { title: 'Tên đối tượng', prop: 'TEN' }
                ],
                cellKey: function (d) { return { r: d.QLSV_DOITUONG_ID, c: d.DAOTAO_THOIGIANDAOTAO_ID }; },
                value: function (d) { return d.PHANTRAMMIENGIAM; },
                onEdit: function (rec) { openForm(rec); },
                empty: 'Chưa có đối tượng miễn giảm'
            });
        }).catch(function (err) {
            grid.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'mức miễn giảm');
        });
    }

    function saveCall(o) {
        return {
            action: o.strId ? 'TC_MucMienGiam/CapNhat' : 'TC_MucMienGiam/ThemMoi',
            versionAPI: 'v1.0',
            strPhamViApDung_Id: f('ct'),
            strPhanCapApDung_Id: '',
            strNgayApDung: '',
            strQLSV_DoiTuong_Id: o.doiTuong,
            strDaoTao_ThoiGianDaoTao_Id: o.thoiGian,
            dPhanTramMienGiam: o.value,
            strNguoiThucHien_Id: '',
            strDiem_KieuHoc_Id: o.kieuHoc,
            strTaiChinh_CacKhoanThu_Id: o.khoanThu,
            strGhiChu: '',
            strId: o.strId || ''
        };
    }

    /* ---------- Cập nhật hàng loạt các ô đã đổi --------------------------- */
    function updateAll() {
        if (!mx) { ui.toast('Chưa có dữ liệu — hãy tìm kiếm trước.', 'warn'); return; }
        var list = mx.dirty();
        if (!list.length) { ui.toast('Chưa có hệ số mới nào cần lưu', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn muốn lưu toàn bộ hệ số không? (' + list.length + ' ô đã đổi)', { ok: 'Lưu' }).then(function (yes) {
            if (!yes) return;
            var calls = list.map(function (d) {
                return saveCall({
                    strId: d.rec ? d.rec.ID : '',
                    doiTuong: d.row.ID,
                    thoiGian: d.col.ID,
                    value: d.value,
                    kieuHoc: f('kh'),
                    khoanThu: f('kt')
                });
            });
            return ui.batch(calls, { title: 'Đang lưu mức miễn giảm', okText: 'Đã lưu' }).then(search);
        });
    }

    /* ---------- Biểu mẫu thêm / sửa một bản ghi (trong trang, BO-CUC luật 1) ---- */
    function openForm(rec) {
        var isEdit = !!rec;
        M.formDialog({
            host: root,
            title: (isEdit ? 'Sửa' : 'Thêm') + ' định mức miễn giảm',
            icon: 'fa-chalkboard-user',
            fields: [
                { key: 'dt', label: 'Đối tượng', type: 'select', source: function () { return M.dmdl('QLTC.DTMG'); }, required: true },
                { key: 'kh', label: 'Kiểu học', type: 'select', source: M.kieuHoc, required: true },
                { key: 'kt', label: 'Loại khoản', type: 'select', source: M.khoanThu, required: true },
                { key: 'tg', label: 'Thời gian', type: 'select', source: M.thoiGian, name: 'DAOTAO_THOIGIANDAOTAO', required: true },
                { key: 'pt', label: 'Phần trăm', required: true, numeric: true }
            ],
            values: isEdit ? {
                dt: rec.QLSV_DOITUONG_ID, kh: rec.KIEUHOC_ID, kt: rec.TAICHINH_CACKHOANTHU_ID,
                tg: rec.DAOTAO_THOIGIANDAOTAO_ID, pt: rec.PHANTRAMMIENGIAM
            } : {},
            onSave: function (v) {
                return ums.api.call(saveCall({
                    strId: isEdit ? rec.ID : '',
                    doiTuong: v.dt, thoiGian: v.tg, value: v.pt, kieuHoc: v.kh, khoanThu: v.kt
                })).then(function () {
                    ui.toast(isEdit ? 'Cập nhật thành công' : 'Thêm mới thành công', 'ok');
                    search();
                });
            },
            onDelete: isEdit ? function () {
                return ums.api.call({
                    action: 'TC_MucMienGiam/Xoa', versionAPI: 'v1.0',
                    strIds: rec.ID, strNguoiThucHien_Id: ''
                }).then(function () { ui.toast('Xoá thành công!', 'ok'); search(); });
            } : null
        });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-act]');
        if (!b || !root.contains(b)) return;
        var act = b.getAttribute('data-act');
        if (act === 'search') search();
        else if (act === 'update') updateAll();
        else if (act === 'add') {
            if (!f('he') || !f('khoa') || !f('ct')) { ui.toast('Hãy chọn Hệ - Khóa - Chương trình trước!', 'warn'); return; }
            openForm(null);
        }
    });
})();
