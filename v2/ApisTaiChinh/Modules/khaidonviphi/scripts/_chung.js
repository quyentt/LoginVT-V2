/* =========================================================================
   ums.khaidonviphi.donViPhi — khuôn chung của hai màn
       donviphikhoa   Đơn vị phí theo khoá   (dòng = khoá)
       donviphilop    Đơn vị phí theo lớp    (dòng = lớp, lọc thêm Khoá / Chương trình)
   Hai tệp gốc giống nhau từng dòng. Cần nạp trước
   ../../miengiam/scripts/_chung.js (lưới nhập ma trận, nguồn ô chọn).

   Lời gọi (action kiểu cũ, chép nguyên bản gốc):
       TC_DonViPhi_SoTien/LayDSThoiGian_DonViPhi_SoTien   GET  cột thời gian
       TC_DonViPhi_SoTien/LayDSTaiChinh_Lop_DonViPhi      GET  dòng (PHAMVIAPDUNG_ID)
       TC_DonViPhi_SoTien/LayDanhSach                     GET  giá trị ô (TONGSOTIEN)
       TC_DonViPhi_SoTien/ThemMoi | Sua_TaiChinh_DonViPhi_SoTien   lưu (dTongSoTien bỏ dấu phẩy)
       TC_DonViPhi_SoTien/Xoa                             strId
   Nguồn: TC_KhoanThu/LayDanhSach, CM_DanhMucDuLieu/LayDanhSach
   (KHDT.DIEM.KIEUHOC), thời gian = edu.system.getList_ThoiGianDaoTao
   (ums.ref.thoiGianDaoTao), Hệ/Khoá/Chương trình qua ums.ref.

   ── BẢN GỐC KHÔNG CHẠY ĐƯỢC — ĐÃ DỰNG LẠI THEO Ý ĐỒ ──────────────────
   Bấm Tìm kiếm ở bản gốc chỉ gọi LayDSThoiGian rồi nạp lại ô chương trình;
   genTable_DonViPhi (vẽ lưới) và getList_DonViPhi (lấy dòng) không được gọi
   ở đâu → bảng không bao giờ hiện. Tệp này là bản sao dở của
   danhmucheso/scripts/donviphimoict.js, nơi luồng chạy đúng là:
   tìm → LayDSThoiGian (cột) → lấy dòng → vẽ lưới → LayDanhSach (ô).
   Ở đây nối lại đúng luồng đó bằng CHÍNH các lời gọi có trong tệp gốc.
   Kèm theo, các tham số bản gốc đọc từ id đã đổi tên dở (dropHeDaoTao,
   dropKhoaDaoTao, dropKhoanThu, dropThoiGianDaoTao — không tồn tại / không
   được nạp) được lấy từ ô lọc tương ứng như donviphimoict.js; tham số
   không có ô nào (strDonViTinh_Id, strNghiepVuApDung_Id, dKeThua) gửi rỗng.
   CẦN KIỂM TRÊN MÁY CHỦ.

   Lỗi bản gốc khác: ô Khoản thu của thanh lọc (dropSearch_KhoanThu) không
   được nạp nên lưu hàng loạt luôn gửi khoản thu rỗng — ở đây nạp đủ và
   bắt buộc chọn khoản thu trước khi lưu; hộp sửa đặt thời gian vào id
   dropThoiGian (không tồn tại) và ô Khoá/Lớp, Thời gian không được nạp —
   ở đây nạp và đổ đúng giá trị.
   Cố ý bỏ: Kế thừa (màn lớp): nút chỉ mở hộp xác nhận rỗng, save_KeThua
   không được gọi. btnCapNhatAll không có trong HTML.
   ========================================================================= */
(function () {
    'use strict';

    var M = ums.miengiam, ui = ums.ui, esc = ui.esc, e = M.e;

    function donViPhi(cfg) {
        var root = cfg.root;
        var lop = cfg.kind === 'lop';
        var st = { rows: [], cols: [], mx: null };

        root.innerHTML =
            M.head(cfg.title,
                M.btn('update', 'fa-floppy-disk', 'Cập nhật', 'save') +
                M.btn('add', 'fa-plus', 'Thêm mới', 'add')) +
            '<div class="ums-panel ums-u-mb-4"><div class="ums-panel__body"><div class="ums-filter">' +
                M.filterSelect('he', 'Chọn hệ đào tạo') +
                (lop ? M.filterSelect('khoa', 'Chọn khóa đào tạo') + M.filterSelect('ct', 'Chọn chương trình') : '') +
                M.filterSelect('kt', 'Chọn khoản thu') +
                M.filterSelect('tg', 'Chọn thời gian đào tạo') +
                M.filterSelect('kh', 'Chọn kiểu học') +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-act': 'search' } }) + '</div>' +
            '</div></div></div>' +
            '<div class="ums-panel"><div class="ums-panel__head"><div class="ums-panel__title">' +
                '<i class="fa-light fa-building"></i> Danh sách <span class="ums-u-faint ums-u-fz13" data-z="count"></span></div>' +
                '<div class="ums-panel__tools ums-u-fz13 ums-u-faint">Enter / ↑ ↓ để chuyển ô</div></div>' +
            '<div class="ums-panel__body ums-panel__body--flush" data-z="grid">' +
                ui.empty('Chọn điều kiện rồi bấm Tìm kiếm', 'fa-magnifying-glass') + '</div></div>';

        M.initFilters(root);
        var f = function (k) { return M.fv(root, k); };
        var grid = root.querySelector('[data-z="grid"]');

        var srcTG = function () { return ums.ref.thoiGianDaoTao({ pageIndex: 1, pageSize: 100000 }); };
        M.khoanThu().then(function (r) { M.fill(M.f(root, 'kt'), r, { head: 'Chọn khoản thu' }); }).catch(function (err) { ums.api.handle(err, 'khoản thu'); });
        M.kieuHoc().then(function (r) { M.fill(M.f(root, 'kh'), r, { head: 'Chọn kiểu học' }); }).catch(function (err) { ums.api.handle(err, 'kiểu học'); });
        srcTG().then(function (r) { M.fill(M.f(root, 'tg'), r, { head: 'Tất cả học kỳ', name: 'DAOTAO_THOIGIANDAOTAO' }); }).catch(function (err) { ums.api.handle(err, 'thời gian'); });

        // Bản gốc: màn khoá tìm ngay khi chọn hệ; màn lớp tìm khi chọn chương trình
        ums.ref.cascade({
            he: M.f(root, 'he'), khoa: lop ? M.f(root, 'khoa') : null, ct: lop ? M.f(root, 'ct') : null,
            labels: { he: 'Tất cả hệ đào tạo', khoa: 'Tất cả khóa đào tạo', ct: 'Tất cả chương trình đào tạo' },
            onChange: function (v, level) {
                if (!lop && level === 'he') search();
                if (lop && level === 'ct' && v.ct) search();
            }
        });

        function search() {
            grid.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return M.rows({
                action: 'TC_DonViPhi_SoTien/LayDSThoiGian_DonViPhi_SoTien',
                method: 'GET',
                strDiem_KieuHoc_Id: f('kh'),
                strDaoTao_ThoiGianDaoTao_Id: f('tg'),
                strHeDaoTao_Id: f('he'),
                strKhoaDaoTao_Id: lop ? f('khoa') : '',
                strDonViTinh_Id: '',
                strTaiChinh_CacKhoanThu_Id: f('kt'),
                strNghiepVuApDung_Id: '',
                strNguoiThucHien_Id: ''
            }).then(function (cols) {
                st.cols = cols;
                return Promise.all([
                    M.rows({
                        action: 'TC_DonViPhi_SoTien/LayDSTaiChinh_Lop_DonViPhi',
                        method: 'GET',
                        strTuKhoa: '',
                        strHeDaoTao_Id: f('he'),
                        strKhoaDaoTao_Id: lop ? f('khoa') : '',
                        strChuongTrinh_Id: lop ? f('ct') : '',
                        strDaoTao_ThoiGianDaoTao_Id: f('tg'),
                        strDiem_KieuHoc_Id: f('kh'),
                        strTaiChinh_CacKhoanThu_Id: f('kt'),
                        strNguoiThucHien_Id: ''
                    }),
                    M.rows({
                        action: 'TC_DonViPhi_SoTien/LayDanhSach',
                        method: 'GET',
                        versionAPI: 'v1.0',
                        strDiem_KieuHoc_Id: f('kh'),
                        strTuKhoa: '',
                        strPhamViApDung_Id: '',
                        strPhanCapApDung_Id: '',
                        strNgayApDung: '',
                        strDonViTinh_Id: '',
                        strTaiChinh_CacKhoanThu_Id: f('kt'),
                        strDaoTao_ThoiGianDaoTao_Id: f('tg'),
                        strNguoiThucHien_Id: '',
                        pageIndex: 1,
                        pageSize: 100000
                    })
                ]);
            }).then(function (x) {
                st.rows = x[0];
                root.querySelector('[data-z="count"]').textContent = '(' + st.rows.length + ' ' + (lop ? 'lớp' : 'khoá') + ' × ' + st.cols.length + ' học kỳ)';
                st.mx = M.matrix({
                    el: grid, rows: st.rows, cols: st.cols, cells: x[1], money: true,
                    rowKey: function (r) { return r.PHAMVIAPDUNG_ID; },
                    lead: lop ? [
                        { title: 'Hệ', prop: 'DAOTAO_HEDAOTAO_TEN' },
                        { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN', cls: 'is-nowrap' },
                        { title: 'Chương trình', prop: 'DAOTAO_TOCHUCCHUONGTRINH_TEN' },
                        { title: 'Lớp', prop: 'PHAMVIAPDUNG_TEN', cls: 'is-nowrap' }
                    ] : [
                        { title: 'Hệ', prop: 'DAOTAO_HEDAOTAO_TEN' },
                        { title: 'Khóa', prop: 'PHAMVIAPDUNG_TEN', cls: 'is-nowrap' }
                    ],
                    cellKey: function (d) { return { r: d.PHAMVIAPDUNG_ID, c: d.DAOTAO_THOIGIANDAOTAO_ID }; },
                    value: function (d) { return M.money(d.TONGSOTIEN); },
                    onEdit: function (rec) { openForm(rec); },
                    empty: 'Không có dữ liệu'
                });
            }).catch(function (err) {
                grid.innerHTML = ui.fail(err.message);
                ums.api.handle(err, cfg.title);
            });
        }

        function saveCall(o) {
            return {
                action: o.strId ? 'TC_DonViPhi_SoTien/Sua_TaiChinh_DonViPhi_SoTien' : 'TC_DonViPhi_SoTien/ThemMoi',
                versionAPI: 'v1.0',
                strDiem_KieuHoc_Id: e(o.kh),
                strId: o.strId || '',
                strNghiepVuApDung_Id: '',
                strDonViTinh_Id: '',
                strPhamViApDung_Id: o.pv,
                strPhanCapApDung_Id: '',
                strNgayApDung: e(o.ngay),
                strDaoTao_ThoiGianDaoTao_Id: o.tg,
                dTongSoTien: M.num(o.value),
                strNguoiThucHien_Id: '',
                strTaiChinh_CacKhoanThu_Id: o.kt,
                dKeThua: '',
                strGhiChu: ''
            };
        }

        function updateAll() {
            if (!st.mx) { ui.toast('Chưa có dữ liệu — hãy tìm kiếm trước.', 'warn'); return; }
            var list = st.mx.dirty();
            if (!list.length) { ui.toast('Chưa có hệ số mới nào cần lưu', 'warn'); return; }
            if (!f('kt')) { ui.toast('Hãy chọn khoản thu trước khi lưu', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn muốn lưu toàn bộ hệ số không? (' + list.length + ' ô đã đổi)', { ok: 'Lưu' }).then(function (yes) {
                if (!yes) return;
                var calls = list.map(function (d) {
                    return saveCall({ strId: d.rec ? d.rec.ID : '', pv: d.row.PHAMVIAPDUNG_ID, tg: d.col.ID, value: d.value, kh: f('kh'), kt: f('kt'), ngay: '' });
                });
                return ui.batch(calls, { title: 'Đang lưu đơn vị phí', okText: 'Đã lưu' }).then(search);
            });
        }

        function openForm(rec) {
            var isEdit = !!rec;
            M.formDialog({
                host: root,
                title: (isEdit ? 'Sửa' : 'Thêm') + ' đơn vị phí',
                icon: 'fa-pencil',
                fields: [
                    { key: 'pv', label: lop ? 'Lớp' : 'Khóa', type: 'select', required: true, name: 'PHAMVIAPDUNG_TEN', id: 'PHAMVIAPDUNG_ID',
                      source: function () { return st.rows; } },
                    { key: 'kt', label: 'Loại khoản', type: 'select', source: M.khoanThu, required: true },
                    { key: 'tg', label: 'Thời gian', type: 'select', source: srcTG, name: 'DAOTAO_THOIGIANDAOTAO', required: true },
                    { key: 'kh', label: 'Kiểu học', type: 'select', source: M.kieuHoc },
                    { key: 'ngay', label: 'Ngày áp dụng', type: 'date' },
                    { key: 'mp', label: 'Mức phí', required: true, numeric: true }
                ],
                values: isEdit ? {
                    pv: rec.PHAMVIAPDUNG_ID, kt: rec.TAICHINH_CACKHOANTHU_ID, tg: rec.DAOTAO_THOIGIANDAOTAO_ID,
                    kh: f('kh'), ngay: rec.NGAYAPDUNG, mp: M.money(rec.TONGSOTIEN)
                } : { kt: f('kt'), tg: f('tg'), kh: f('kh') },
                onSave: function (v) {
                    return ums.api.call(saveCall({ strId: isEdit ? rec.ID : '', pv: v.pv, tg: v.tg, value: v.mp, kh: v.kh, kt: v.kt, ngay: v.ngay }))
                        .then(function () { ui.toast(isEdit ? 'Cập nhật thành công' : 'Thêm mới thành công', 'ok'); search(); });
                },
                onDelete: isEdit ? function () {
                    return ums.api.call({ action: 'TC_DonViPhi_SoTien/Xoa', versionAPI: 'v1.0', strId: rec.ID, strNguoiThucHien_Id: '' })
                        .then(function () { ui.toast('Xóa thành công!', 'ok'); search(); });
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
                if (!f('he') || (lop && (!f('khoa') || !f('ct')))) {
                    ui.toast(lop ? 'Hãy chọn Hệ - Khóa - Chương trình trước!' : 'Hãy chọn Hệ đào tạo trước!', 'warn');
                    return;
                }
                if (!st.rows.length) { ui.toast('Hãy bấm Tìm kiếm để có danh sách ' + (lop ? 'lớp' : 'khoá') + ' trước.', 'warn'); return; }
                openForm(null);
            }
        });
    }

    ums.khaidonviphi = { donViPhi: donViPhi };
})();
