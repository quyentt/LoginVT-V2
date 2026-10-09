/* =========================================================================
   Hệ số học phần (mới) — lưới Học phần × Thời gian
   Bản gốc: ApisTaiChinh/Modules/danhmucheso/scripts/hesohocphanmoi.js
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên từ bản gốc):
       TC_HocPhan_HeSo/LayDSThoiGian_HocPhan_HeSo   GET  cột thời gian (ID, THOIGIAN)
       KHCT_ThongTin_MH … LayDSKS_HocPhan_ChuongTrinh    dòng = học phần của CT (ums.ref.hocPhan, pageSize 200)
       TC_HocPhan_HeSo/LayDanhSach                  GET  giá trị ô (DAOTAO_HOCPHAN_ID × DAOTAO_THOIGIANDAOTAO_ID → HESO)
       TC_HocPhan_HeSo/ThemMoi                      POST thêm (strId rỗng)
       TC_HocPhan_HeSo/Sua_TaiChinh_HocPhan_HeSo    POST sửa (có strId)
       TC_HocPhan_HeSo/Xoa                          POST strIds = một id
       ums.ref.heDaoTao / khoaDaoTao / chuongTrinh, CM_ThoiGianDaoTao/LayDSDAOTAO_ThoiGianDaoTao,
       TC_KhoanThu/LayDanhSach, CM_DanhMucDuLieu/LayDanhSach#KHDT.DIEM.KIEUHOC
       Import: IMPORTWITHPROC_HSHPSOTIEN (ums.report.importChung, như btnImportWithProce)

   Nạp danh mục như bản gốc: Khoá nạp MỘT lần (hệ rỗng) rồi lọc tại chỗ theo
   DAOTAO_HEDAOTAO_ID; Chương trình nạp MỘT lần (khoá rỗng) ở lần chọn hệ đầu
   tiên rồi lọc tại chỗ theo DAOTAO_KHOADAOTAO_ID (so sánh `==` như
   edu.util.objGetDataInData — chọn lại hệ thì lọc theo khoá rỗng, danh sách
   CT trống cho tới khi chọn khoá; đúng hành vi bản gốc).

   Lưu hàng loạt ("Cập nhật"): các ô đã đổi; khoản thu / kiểu học lấy từ bộ
   lọc; dKeThua rỗng (bản gốc đọc 'dropNew_KeThua_All' — ô không tồn tại).
   Hệ số gửi nguyên chuỗi gõ vào (bản gốc không bỏ dấu phẩy ở màn này).

   Cố ý bỏ:
     · ô "Nhập từ khóa tìm kiếm" (txtTuKhoa_Search) — bản gốc không đọc ở đâu
     · edu.system.getList_MauImport("zonebtnBaoCao_HSHPM") — gắn vào vùng
       không tồn tại trong HTML nên bản gốc không hiện gì; callback rỗng
     · nút Xoá trong hộp thoại khi THÊM MỚI (bản gốc gọi Xoa với id rỗng)
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, A = ums.dmhsA;
    var mx = null;                       // lưới ums.pat.matrix của lần vẽ gần nhất
    var root = document.getElementById('hesohocphanmoi');
    var S = { cot: [], rows: [], list: [], khoaAll: null, ctAll: null, thoiGian: [], khoanThu: [], kieuHoc: [] };

    /* objGetDataInData: so sánh lỏng `id == row[col]` */
    function byCol(rows, col, id) { return (rows || []).filter(function (r) { return id == r[col]; }); } // eslint-disable-line eqeqeq

    A.mount(root,
        A.head('Hệ số học phần',
            A.btn('update', 'Cập nhật', 'fa-pen-to-square', 'primary') +
            ui.btn('add', { attr: { 'data-a': 'add' } })) +
        A.filter(
            A.fsel('he', 'Chọn hệ đào tạo') +
            A.fsel('khoa', 'Chọn khóa đào tạo') +
            A.fsel('ct', 'Chọn chương trình đào tạo') +
            A.fsel('khoanthu', 'Chọn khoản thu') +
            A.fsel('kieuhoc', 'Chọn kiểu học') +
            A.fbtn(ui.btn('search', { attr: { 'data-a': 'search' } })) +
            A.fbtn(A.btn('import', 'Import HP số tiền', 'fa-cloud-arrow-up', 'out-info'))) +
        A.panel({ title: 'Danh sách', icon: 'fa-circle-dollar-to-slot', body: 'grid', count: 'count',
            html: ui.empty('Chọn hệ, khóa và chương trình đào tạo để hiện lưới hệ số', 'fa-filter') }));

    var el = {
        he: A.k(root, 'he'), khoa: A.k(root, 'khoa'), ct: A.k(root, 'ct'),
        kt: A.k(root, 'khoanthu'), kh: A.k(root, 'kieuhoc'),
        grid: A.q(root, '[data-z="grid"]'), count: A.q(root, '[data-z="count"]')
    };

    function fail(where) { return function (e) { ums.api.handle(e, where); }; }

    /* ---------- Danh mục ------------------------------------------------- */
    ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000 })
        .then(function (r) { A.fill(el.he, r, { name: 'TENHEDAOTAO', head: 'Chọn hệ đào tạo' }); }).catch(fail('hệ đào tạo'));
    ums.ref.khoaDaoTao({ strHeDaoTao_Id: '', strCoSoDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000 })
        .then(function (r) { S.khoaAll = r; A.fill(el.khoa, r, { name: 'TENKHOA', head: 'Chọn khóa đào tạo' }); }).catch(fail('khoá đào tạo'));
    A.thoiGian().then(function (r) { S.thoiGian = r; }).catch(fail('thời gian đào tạo'));
    A.khoanThu().then(function (r) { S.khoanThu = r; A.fill(el.kt, r, { head: 'Chọn khoản thu' }); }).catch(fail('khoản thu'));
    A.kieuHoc().then(function (r) { S.kieuHoc = r; A.fill(el.kh, r, { head: 'Chọn kiểu học' }); }).catch(fail('kiểu học'));

    function fillCT(khoa) {
        if (!S.ctAll) {
            return ums.ref.chuongTrinh({
                strKhoaDaoTao_Id: khoa, strN_CN_LOP_Id: '', strKhoaQuanLy_Id: '', strToChucCT_Cha_Id: '',
                strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000
            }).then(function (r) { S.ctAll = r; A.fill(el.ct, r, { name: 'TENCHUONGTRINH', head: 'Chọn chương trình đào tạo' }); })
                .catch(fail('chương trình đào tạo'));
        }
        A.fill(el.ct, byCol(S.ctAll, 'DAOTAO_KHOADAOTAO_ID', khoa), { name: 'TENCHUONGTRINH', head: 'Chọn chương trình đào tạo' });
        return Promise.resolve();
    }

    A.onPick(el.he, function () {
        if (S.khoaAll) A.fill(el.khoa, byCol(S.khoaAll, 'DAOTAO_HEDAOTAO_ID', el.he.value), { name: 'TENKHOA', head: 'Chọn khóa đào tạo' });
        fillCT('');
    });
    A.onPick(el.khoa, function () { fillCT(el.khoa.value); });
    A.onPick(el.ct, function () { load(); });
    // Chưa chọn tầng trên thì khoá tầng dưới; xoá tầng trên thì xoá tầng dưới
    ums.pat.chain([el.he, el.khoa, el.ct]);

    /* ---------- Nạp lưới: thời gian → học phần → hệ số -------------------- */
    function load() {
        var ct = el.ct.value;
        el.grid.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return A.rows({
            action: 'TC_HocPhan_HeSo/LayDSThoiGian_HocPhan_HeSo', method: 'GET', versionAPI: 'v1.0',
            strDaoTao_ThoiGianDaoTao_Id: '', strPhamViApDung_Id: ct, strDiem_KieuHoc_Id: el.kh.value,
            strTaiChinh_CacKhoanThu_Id: el.kt.value, strNguoiThucHien_Id: ''
        }).then(function (cot) {
            S.cot = cot;
            return ums.ref.hocPhan({ strChuongTrinh_Id: ct, strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 200 });
        }).then(function (hp) {
            S.rows = hp;
            return A.rows({
                action: 'TC_HocPhan_HeSo/LayDanhSach', method: 'GET', versionAPI: 'v1.0',
                strTuKhoa: '', pageIndex: 1, pageSize: 10000, strPhamViApDung_Id: ct,
                strPhanCapApDung_Id: '', strNgayApDung: '', strDaoTao_HocPhan_Id: '', strDaoTao_ThoiGianDaoTao_Id: '',
                strNguoiThucHien_Id: '', strDiem_KieuHoc_Id: el.kh.value, strTaiChinh_CacKhoanThu_Id: '',
                strDangKy_DotDangKyHoc_Id: ''
            });
        }).then(function (list) {
            S.list = list;
            draw();
        }).catch(function (e) {
            el.grid.innerHTML = ui.fail(e.message);
            ums.api.handle(e, 'nạp lưới hệ số');
        });
    }

    function draw() {
        mx = pat.matrix({
            el: el.grid, rows: S.rows, cols: S.cot,
            lead: [
                { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-center is-nowrap' },
                { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                { title: 'Số tín chỉ', prop: 'DAOTAO_HOCPHAN_SOTC', cls: 'is-center' }
            ],
            rowKey: function (row) { return row.DAOTAO_HOCPHAN_ID; },
            cells: S.list,
            cellKey: function (r) { return { r: r.DAOTAO_HOCPHAN_ID, c: r.DAOTAO_THOIGIANDAOTAO_ID }; },
            value: function (r) { return r.HESO; },
            onEdit: function (rec) { if (rec) openForm(rec); },
            empty: 'Chương trình chưa có học phần'
        });
        var wrap = el.grid.querySelector('.ums-tablewrap');
        if (wrap) wrap.classList.add('dmhsa-scroll');
        el.count.textContent = S.rows.length ? '(' + S.rows.length + ' học phần × ' + S.cot.length + ' thời gian)' : '';
    }

    /* ---------- Cập nhật hàng loạt -------------------------------------- */
    function saveAll() {
        ui.confirm('Bạn có chắc chắn muốn lưu toàn bộ hệ số không?').then(function (yes) {
            if (!yes) return;
            var dirty = mx ? mx.dirty() : [];
            if (!dirty.length) { ui.toast('Chưa có hệ số mới nào cần lưu', 'warn'); return; }
            var ct = el.ct.value, kt = el.kt.value, kh = el.kh.value;
            ui.batch(dirty.map(function (d) {
                var id = d.rec ? d.rec.ID : '';
                return {
                    action: id ? 'TC_HocPhan_HeSo/Sua_TaiChinh_HocPhan_HeSo' : 'TC_HocPhan_HeSo/ThemMoi',
                    versionAPI: 'v1.0',
                    strPhamViApDung_Id: ct, strPhanCapApDung_Id: '', strNgayApDung: '',
                    strDaoTao_HocPhan_Id: d.row.DAOTAO_HOCPHAN_ID,
                    strDaoTao_ThoiGianDaoTao_Id: d.col.ID,
                    dHeSo: d.value,
                    strNguoiThucHien_Id: '',
                    strDiem_KieuHoc_Id: kh, strTaiChinh_CacKhoanThu_Id: kt,
                    dKeThua: '', strGhiChu: '', strId: id
                };
            }), { title: 'Đang lưu hệ số', okText: 'Đã lưu' }).then(load);
        });
    }

    /* ---------- Hộp thoại "Học phần hệ số" ------------------------------- */
    function openForm(row) {
        var body =
            A.row('Học phần', A.sel('hp')) +
            A.row('Kiểu học', A.sel('kh')) +
            A.row('Loại khoản', A.sel('kt')) +
            A.row('Thời gian', A.sel('tg')) +
            A.row('Kế thừa', '<select class="ums-select" data-k="kethua" data-required>' +
                '<option value="0">1. Áp dụng bình thường</option>' +
                '<option value="1">2. Áp dụng tương tự cho tất cả các học phần còn lại trong chương trình</option></select>') +
            A.row('Hệ số', A.input('heso', { ph: 'Hệ số' }), { required: true });
        var buttons = [];
        if (row) buttons.push({ text: 'Xoá', kind: 'close', mod: 'danger', onClick: function (d) { remove(row, d); return false; } });
        buttons.push({ text: 'Lưu', kind: 'save', onClick: function (d) { saveOne(row, d); return false; } });
        var dlg = A.form({ host: root, title: (row ? 'Sửa' : 'Thêm') + ' hệ số học phần', body: body, buttons: buttons });
        var b = dlg.body;
        A.fill(A.k(b, 'hp'), S.rows, { id: 'DAOTAO_HOCPHAN_ID', name: function (r) { return r.DAOTAO_HOCPHAN_MA + ' - ' + r.DAOTAO_HOCPHAN_TEN; }, head: 'Chọn học phần' });
        A.fill(A.k(b, 'kh'), S.kieuHoc, { head: 'Chọn kiểu học' });
        A.fill(A.k(b, 'kt'), S.khoanThu, { head: 'Chọn khoản thu' });
        A.fill(A.k(b, 'tg'), S.thoiGian, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn học kỳ' });
        if (row) {
            A.set(b, 'hp', row.DAOTAO_HOCPHAN_ID);
            A.set(b, 'kh', row.KIEUHOC_ID);
            A.set(b, 'kt', row.TAICHINH_CACKHOANTHU_ID);
            A.set(b, 'tg', row.DAOTAO_THOIGIANDAOTAO_ID);
            A.set(b, 'heso', row.HESO);
        }
    }

    function saveOne(row, dlg) {
        var b = dlg.body, id = row ? row.ID : '';
        ums.api.call({
            action: id ? 'TC_HocPhan_HeSo/Sua_TaiChinh_HocPhan_HeSo' : 'TC_HocPhan_HeSo/ThemMoi',
            versionAPI: 'v1.0',
            strPhamViApDung_Id: el.ct.value, strPhanCapApDung_Id: '', strNgayApDung: '',
            strDaoTao_HocPhan_Id: A.val(b, 'hp'),
            strDaoTao_ThoiGianDaoTao_Id: A.val(b, 'tg'),
            dHeSo: A.val(b, 'heso'),
            strNguoiThucHien_Id: '',
            strDiem_KieuHoc_Id: A.val(b, 'kh'),
            strTaiChinh_CacKhoanThu_Id: A.val(b, 'kt'),
            dKeThua: A.val(b, 'kethua'),
            strGhiChu: '', strId: id
        }).then(function () {
            ui.toast(id ? 'Cập nhật thành công' : 'Thêm mới thành công', 'ok');
            dlg.close();
            load();
        }).catch(fail('lưu hệ số'));
    }

    function remove(row, dlg) {
        ui.confirm('Xoá hệ số này?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({ action: 'TC_HocPhan_HeSo/Xoa', versionAPI: 'v1.0', strIds: row.ID, strNguoiThucHien_Id: '' })
                .then(function () { ui.toast('Xóa thành công!', 'ok'); dlg.close(); load(); })
                .catch(fail('xoá hệ số'));
        });
    }

    A.actions(root, {
        search: function () { load(); },
        update: saveAll,
        add: function () {
            if (!el.he.value || !el.khoa.value || !el.ct.value) { ui.toast('Hãy chọn Hệ - Khóa - Chương trình trước!', 'warn'); return; }
            openForm(null);
        },
        // Tham số mẫu import có thể trỏ vào id ô của màn cũ — ánh xạ sang ô mới
        'import': function () {
            ums.report.importChung('HP số tiền', 'IMPORTWITHPROC_HSHPSOTIEN', {
                onDone: load,
                values: {
                    dropHeDaoTao_HSHP: el.he.value, dropKhoaDaoTao_HSHP: el.khoa.value,
                    dropChuongTrinhDaoTao_HSHP: el.ct.value, dropKhoanThu_HSHP: el.kt.value,
                    dropKieuHoc_HSHP: el.kh.value, txtTuKhoa_Search: ''
                }
            });
        }
        // sửa một ô: nút bút của ums.pat.matrix (onEdit trong draw)
    });
})();
