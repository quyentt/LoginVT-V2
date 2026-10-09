/* =========================================================================
   Áp dụng công thức tính phí — lưới Chương trình × Thời gian
   Bản gốc: ApisTaiChinh/Modules/danhmucheso/scripts/apdungcongthucphi.js
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên từ bản gốc, đều là action kiểu cũ, không mã hoá):
       TC_CongThucTinhPhi/LayDSThoiGian_CongThucTinhPhi  GET  cột thời gian (ID, THOIGIAN)
       KHCT_ThongTin_MH … LayDSKS_DaoTao_ToChucCT        dòng = chương trình (ums.ref.chuongTrinh)
       TC_CongThucTinhPhi/LayDanhSach                    GET  giá trị ô (PHAMVIAPDUNG_ID × DAOTAO_THOIGIANDAOTAO_ID → XAUCONGTHUC)
       TC_CongThucTinhPhi/ThemMoi | CapNhat              POST lưu (CapNhat khi có strId)
       TC_CongThucTinhPhi/Xoa                            POST strIds = một id
       TC_TuKhoa/LayDanhSach                             GET  bảng "Xem từ khóa"
       Danh mục QLTC.NVAP                                nghiệp vụ áp dụng
       ums.ref.heDaoTao / khoaDaoTao / thoiGianDaoTao là CM_ThoiGianDaoTao/LayDSDAOTAO_ThoiGianDaoTao như bản gốc

   Thứ tự như bản gốc: thời gian (cột) → chương trình (dòng) → giá trị ô.
   Khoá đào tạo nạp MỘT lần với hệ rỗng, đổi hệ thì lọc tại chỗ theo
   DAOTAO_HEDAOTAO_ID (getList_KhoaDaoTao + objGetDataInData của bản gốc).

   Tham số bản gốc đọc từ ô KHÔNG tồn tại trong HTML → gửi chuỗi rỗng, đúng
   giá trị thật đang gửi: strDonViTinh_Id (dropDonViTinh_ADCT / dropNew_DonViTinh),
   strTaiChinh_CacKhoanThu_Id (dropKhoanThu_ADCT / dropNew_LoaiKhoan),
   dKeThua khi lưu hàng loạt (dropNew_KeThua_All).

   Cố ý bỏ:
     · ô "Nhập từ khóa tìm kiếm" (txtTuKhoa_Search) — bản gốc không đọc ô này ở đâu cả
     · nút Xoá trong hộp thoại khi THÊM MỚI — bản gốc gọi Xoa với id rỗng
     · các hàm chết getList_LoaiKhoan, getList_KieuHoc, genComBo_HocPhan (không ai gọi)
   Nghi ngờ, giữ nguyên: TC_TuKhoa/LayDanhSach gửi pageIndex 2 với pageSize
   100000 (trang 2 của một trang cực lớn — có thể luôn rỗng).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, A = ums.dmhsA;
    var root = document.getElementById('apdungcongthucphi');

    var S = { cot: [], rows: [], list: [], khoaAll: null, thoiGian: [], chuongTrinh: [] };
    var mx = null;                       // lưới ums.pat.matrix của lần vẽ gần nhất

    /* ---------- Khung ---------------------------------------------------- */
    A.mount(root,
        A.head('Áp dụng công thức tính phí',
            A.btn('tukhoa', 'Xem từ khóa', 'fa-spell-check') +
            A.btn('update', 'Cập nhật', 'fa-pen-to-square', 'primary') +
            ui.btn('add', { attr: { 'data-a': 'add' } })) +
        A.filter(
            A.fsel('he', 'Chọn hệ đào tạo') +
            A.fsel('khoa', 'Chọn khóa đào tạo') +
            A.fsel('nghiepvu', 'Chọn nghiệp vụ áp dụng') +
            A.fsel('thoigian', 'Chọn thời gian đào tạo') +
            A.fbtn(ui.btn('search', { attr: { 'data-a': 'search' } }))) +
        '<div class="ums-grid" data-z="split">' +
            A.panel({ title: 'Danh sách', icon: 'fa-list-timeline', body: 'grid', count: 'count',
                html: ui.empty('Chọn hệ và khóa đào tạo để hiện lưới công thức', 'fa-filter') }) +
            '<div data-z="tukhoa" hidden>' +
                A.panel({ title: 'Xem từ khóa', icon: 'fa-spell-check', body: 'tk' }) +
            '</div>' +
        '</div>');

    var el = {
        he: A.k(root, 'he'), khoa: A.k(root, 'khoa'), nv: A.k(root, 'nghiepvu'), tg: A.k(root, 'thoigian'),
        grid: A.q(root, '[data-z="grid"]'), count: A.q(root, '[data-z="count"]'),
        split: A.q(root, '[data-z="split"]'), tk: A.q(root, '[data-z="tukhoa"]'), tkBody: A.q(root, '[data-z="tk"]')
    };

    /* ---------- Danh mục ------------------------------------------------- */
    function fail(where) { return function (e) { ums.api.handle(e, where); }; }

    ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000 })
        .then(function (r) { A.fill(el.he, r, { name: 'TENHEDAOTAO', head: 'Chọn hệ đào tạo' }); })
        .catch(fail('hệ đào tạo'));

    ums.ref.khoaDaoTao({ strHeDaoTao_Id: '', strCoSoDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000 })
        .then(function (r) { S.khoaAll = r; A.fill(el.khoa, r, { name: 'TENKHOA', head: 'Chọn khóa đào tạo' }); })
        .catch(fail('khoá đào tạo'));

    A.thoiGian().then(function (r) {
        S.thoiGian = r;
        A.fill(el.tg, r, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn thời gian đào tạo' });
    }).catch(fail('thời gian đào tạo'));

    ums.api.dm('QLTC.NVAP').then(function (r) {
        S.nghiepVu = r;
        A.fill(el.nv, r, { head: 'Chọn nghiệp vụ áp dụng' });
    }).catch(fail('nghiệp vụ áp dụng'));

    A.rows({
        action: 'TC_TuKhoa/LayDanhSach', method: 'GET', versionAPI: 'v1.0',
        strTuKhoa: '', strNguoiTao_Id: '', pageSize: 100000, pageIndex: 2
    }).then(function (r) {
        ui.table({ el: el.tkBody, rows: r, tableCls: 'ums-table--lined ums-table--tight', empty: 'Không có từ khóa',
            columns: [{ title: 'Từ khóa', prop: 'TUKHOA', cls: 'is-nowrap' }, { title: 'Mô tả', prop: 'MOTA' }] });
    }).catch(fail('từ khoá'));

    /* Đổi hệ → lọc khoá tại chỗ; đổi khoá → nạp lưới (như bản gốc) */
    A.onPick(el.he, function () {
        if (!S.khoaAll) return;
        var he = el.he.value;
        A.fill(el.khoa, S.khoaAll.filter(function (k) { return k.DAOTAO_HEDAOTAO_ID === he; }),
            { name: 'TENKHOA', head: 'Chọn khóa đào tạo' });
    });
    A.onPick(el.khoa, function () { load(); });
    // Chưa chọn tầng trên thì khoá tầng dưới; xoá tầng trên thì xoá tầng dưới
    ums.pat.chain([el.he, el.khoa]);

    /* ---------- Nạp lưới ------------------------------------------------- */
    function load() {
        var f = { he: el.he.value, khoa: el.khoa.value, nv: el.nv.value, tg: el.tg.value };
        el.grid.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');

        return A.rows({
            action: 'TC_CongThucTinhPhi/LayDSThoiGian_CongThucTinhPhi', method: 'GET', versionAPI: 'v1.0',
            strDaoTao_ThoiGianDaoTao_Id: f.tg, strHeDaoTao_Id: f.he, strKhoaDaoTao_Id: f.khoa,
            strDonViTinh_Id: '', strTaiChinh_CacKhoanThu_Id: '', strNghiepVuApDung_Id: f.nv,
            strNguoiThucHien_Id: ''
        }).then(function (cot) {
            S.cot = cot;
            return ums.ref.chuongTrinh({
                strKhoaDaoTao_Id: f.khoa, strN_CN_LOP_Id: '', strKhoaQuanLy_Id: '', strToChucCT_Cha_Id: '',
                strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000
            });
        }).then(function (ct) {
            S.rows = ct;
            S.chuongTrinh = ct;
            return A.rows({
                action: 'TC_CongThucTinhPhi/LayDanhSach', method: 'GET', versionAPI: 'v1.0',
                strTuKhoa: '', strPhamViApDung_Id: '', strPhanCapApDung_Id: '', strNgayApDung: '',
                strNghiepVuApDung_Id: f.nv, strDaoTao_ThoiGianDaoTao_Id: f.tg, strNguoiTao_Id: '',
                pageIndex: 1, pageSize: 100000
            });
        }).then(function (list) {
            S.list = list;
            draw();
        }).catch(function (e) {
            el.grid.innerHTML = ui.fail(e.message);
            ums.api.handle(e, 'nạp lưới công thức');
        });
    }

    function draw() {
        // Giá trị theo cặp (chương trình, thời gian). Trùng cặp thì dòng sau thắng, như bản gốc.
        mx = pat.matrix({
            el: el.grid, rows: S.rows, cols: S.cot,
            lead: [{ title: 'Chương trình', prop: 'TENCHUONGTRINH' }],
            rowKey: function (row) { return row.ID; },
            cells: S.list,
            cellKey: function (r) { return { r: r.PHAMVIAPDUNG_ID, c: r.DAOTAO_THOIGIANDAOTAO_ID }; },
            value: function (r) { return r.XAUCONGTHUC; },
            onEdit: function (rec) { if (rec) openForm(rec); },
            empty: 'Không có chương trình nào của khóa đã chọn'
        });
        var wrap = el.grid.querySelector('.ums-tablewrap');
        if (wrap) wrap.classList.add('dmhsa-scroll');
        el.count.textContent = S.rows.length ? '(' + S.rows.length + ' chương trình × ' + S.cot.length + ' thời gian)' : '';
    }

    /* ---------- Lưu hàng loạt ("Cập nhật") ------------------------------- */
    function saveAll() {
        ui.confirm('Bạn có chắc chắn muốn lưu toàn bộ hệ số không?').then(function (yes) {
            if (!yes) return;
            var dirty = mx ? mx.dirty() : [];
            if (!dirty.length) { ui.toast('Chưa có hệ số mới nào cần lưu', 'warn'); return; }
            var nv = el.nv.value;
            var calls = dirty.map(function (d) {
                var id = d.rec ? d.rec.ID : '';
                return {
                    action: id ? 'TC_CongThucTinhPhi/CapNhat' : 'TC_CongThucTinhPhi/ThemMoi',
                    versionAPI: 'v1.0',
                    strId: id,
                    strNghiepVuApDung_Id: nv,
                    strDonViTinh_Id: '',
                    strPhamViApDung_Id: d.row.ID,
                    strPhanCapApDung_Id: '',
                    strNgayApDung: '',
                    strDaoTao_ThoiGianDaoTao_Id: d.col.ID,
                    strXauCongThuc: d.value,
                    strNguoiThucHien_Id: '',
                    strTaiChinh_CacKhoanThu_Id: '',
                    dKeThua: '',
                    strGhiChu: ''
                };
            });
            ui.batch(calls, { title: 'Đang lưu công thức', okText: 'Đã lưu' }).then(load);
        });
    }

    /* ---------- Hộp thoại thêm / sửa một công thức ----------------------- */
    function openForm(row) {
        var body =
            A.row('Chương trình', A.sel('ct'), { required: true }) +
            A.row('Thời gian', A.sel('tg')) +
            A.row('Nghiệp vụ', A.sel('nv')) +
            A.row('Kế thừa', '<select class="ums-select" data-k="kethua" data-required>' +
                '<option value="0">1. Áp dụng bình thường</option>' +
                '<option value="1">2. Áp dụng cho tất cả các chương trình còn lại của khóa học</option></select>') +
            A.row('Ngày áp dụng', '<div class="ums-inputwrap">' + A.input('ngay', { date: true }) + '<i class="fa-light fa-calendar"></i></div>') +
            '<div style="grid-column:1 / -1">' + A.row('Xâu công thức', '<textarea class="ums-textarea" data-k="xau" style="min-height:200px"></textarea>') + '</div>';

        var buttons = [];
        if (row) buttons.push({ text: 'Xoá', kind: 'close', mod: 'danger', onClick: function (d) { remove(row, d); return false; } });
        buttons.push({ text: 'Lưu', kind: 'save', onClick: function (d) { saveOne(row, d); return false; } });

        var dlg = A.form({ host: root, title: (row ? 'Sửa' : 'Thêm') + ' công thức tính phí', body: body, buttons: buttons });
        var b = dlg.body;
        A.fill(A.k(b, 'ct'), S.chuongTrinh, { name: 'TENCHUONGTRINH', head: 'Chọn chương trình đào tạo' });
        A.fill(A.k(b, 'tg'), S.thoiGian, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn học kỳ' });
        A.fill(A.k(b, 'nv'), S.nghiepVu || [], { head: 'Chọn nghiệp vụ áp dụng' });

        if (row) {
            A.set(b, 'ct', row.PHAMVIAPDUNG_ID);
            A.set(b, 'tg', row.DAOTAO_THOIGIANDAOTAO_ID);
            A.set(b, 'nv', row.NGHIEPVUAPDUNG_ID);
            A.set(b, 'ngay', row.NGAYAPDUNG);
            A.set(b, 'xau', row.XAUCONGTHUC);
        }
    }

    function saveOne(row, dlg) {
        var b = dlg.body;
        var id = row ? row.ID : '';
        ums.api.call({
            action: id ? 'TC_CongThucTinhPhi/CapNhat' : 'TC_CongThucTinhPhi/ThemMoi',
            versionAPI: 'v1.0',
            strId: id,
            strNghiepVuApDung_Id: A.val(b, 'nv'),
            strDonViTinh_Id: '',
            strPhamViApDung_Id: A.val(b, 'ct'),
            strPhanCapApDung_Id: '',
            strNgayApDung: A.val(b, 'ngay'),
            strDaoTao_ThoiGianDaoTao_Id: A.val(b, 'tg'),
            strXauCongThuc: A.val(b, 'xau'),
            strNguoiThucHien_Id: '',
            strTaiChinh_CacKhoanThu_Id: '',
            dKeThua: A.val(b, 'kethua'),
            strGhiChu: ''
        }).then(function () {
            ui.toast(id ? 'Cập nhật thành công' : 'Thêm mới thành công', 'ok');
            dlg.close();
            load();
        }).catch(function (e) { ums.api.handle(e, 'lưu công thức'); });
    }

    function remove(row, dlg) {
        ui.confirm('Xoá công thức này?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({ action: 'TC_CongThucTinhPhi/Xoa', versionAPI: 'v1.0', strIds: row.ID, strNguoiThucHien_Id: '' })
                .then(function () { ui.toast('Xóa thành công!', 'ok'); dlg.close(); load(); })
                .catch(function (e) { ums.api.handle(e, 'xoá công thức'); });
        });
    }

    /* ---------- Nút ------------------------------------------------------ */
    A.actions(root, {
        search: function () { load(); },
        update: saveAll,
        add: function () {
            if (!el.he.value || !el.khoa.value) { ui.toast('Hãy chọn Hệ - Khóa trước!', 'warn'); return; }
            openForm(null);
        },
        tukhoa: function () {
            var show = el.tk.hidden;
            el.tk.hidden = !show;
            el.split.classList.toggle('ums-grid--main-aside', show);
            if (show) ui.reveal(el.tk, { fade: true });
        }
        // sửa một ô: nút bút của ums.pat.matrix (onEdit trong draw)
    });
})();
