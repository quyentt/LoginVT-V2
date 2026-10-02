/* =========================================================================
   Hệ số lớp học phần — bảng xoay Học kỳ × Khoản thu × Kiểu học
   Bản gốc: ApisTaiChinh/Modules/danhmucheso/scripts/hesolophocphan.js
   ---------------------------------------------------------------------------
   Bản gốc dùng CHUNG các action TC_HocPhan_HeSo/* với màn "Hệ số học phần";
   khác ở nguồn danh sách bên trái/hộp thoại (lớp học phần) và không có
   "Kế thừa".

   Lời gọi (chép nguyên từ bản gốc; action kiểu cũ không mã hoá, func thì
   ums.api tự thêm iM):
       ums.ref.heDaoTao / khoaDaoTao / chuongTrinh     = edu.system.getList_* (tham số y bản gốc)
       KHCT_ThongTin_MH/… pkg_kehoach_thongtin.LayDSKS_DaoTao_HocPhan_Lop
                                                        = edu.system.getList_LopHocPhan (Core/systemroot.js:4247)
                                                        danh sách trái pageSize 100000, hộp thoại pageSize 200;
                                                        mọi tham số lọc RỖNG — xem "Nghi ngờ" dưới
       CM_ThoiGianDaoTao/LayDSDAOTAO_ThoiGianDaoTao     GET  học kỳ          (ums.dmhsA.thoiGian)
       TC_KhoanThu/LayDanhSach                          GET  khoản thu       (ums.dmhsA.khoanThu)
       CM_DanhMucDuLieu/LayDanhSach#KHDT.DIEM.KIEUHOC   GET  kiểu học        (ums.dmhsA.kieuHoc)
       TC_HocPhan_HeSo/LayDanhSach                      GET  giá trị bảng xoay (HESO)
       TC_HocPhan_HeSo/ThemMoi                          POST thêm (KHÔNG có dKeThua)
       TC_HocPhan_HeSo/CapNhat                          POST sửa một ô (Enter) — 4 id của ô (KHÔNG có dKeThua)
       TC_HocPhan_HeSo/Xoa                              POST strIds = ID bản ghi của ô → nạp lại bảng

   Như bản gốc:
     · Khoá nạp MỘT lần (hệ rỗng) rồi lọc tại chỗ theo DAOTAO_HEDAOTAO_ID;
       chương trình nạp một lần (khoá rỗng) rồi lọc theo DAOTAO_KHOADAOTAO_ID.
     · Cột trái/hộp thoại đọc DAOTAO_HOCPHAN_ID / _TEN / _MA của từng dòng.
     · CapNhat lấy phạm vi áp dụng từ ô Chương trình bên TRÁI; ThemMoi lấy từ
       ô Chương trình trong vùng thêm mới.
     · Trùng Học kỳ × Khoản thu × Kiểu học: lấy dòng CUỐI (bản gốc duyệt ngược).
     · Sửa hoặc xoá một ô xong thì nạp lại bảng (thay affectUpdate tại chỗ).

   Bố cục: ums.pat.master (danh sách lớp học phần bên trái) + ums.pat.pivot
   (bảng xoay hai tầng tiêu đề). Sửa một ô mở hộp thoại một trường — đúng quy
   ước 1 của BO-CUC.md (hộp thoại chỉ cho ô của matrix/pivot).

   Sửa lỗi bản gốc:
     · Xoá gửi strIds = chuỗi ghép "HocKy_HocPhan_KhoanThu_KieuHoc" (id nút
       "delete_" + arrId) cho TC_HocPhan_HeSo/Xoa — procedure nhận ID bản ghi.
       genRow đã nhận ID bản ghi (strHeSo_Id) nhưng không dùng. Ở đây gửi ID
       bản ghi như màn "Hệ số học phần"; bấm Xoá ở ô chưa có bản ghi chỉ báo
       "ô chưa có dữ liệu", không gọi API.
     · Tiêu đề khoản thu lấy dtKhoanThu[lk].TEN theo chỉ số của danh sách đã
       lọc → sai tên cột. Ở đây lấy tên của chính khoản thu đó.
   Nghi ngờ, giữ nguyên: danh sách lớp học phần KHÔNG lọc theo chương trình
   (getList_LopHocPhan bỏ qua strChuongTrinh_Id) — chọn chương trình nào cũng
   ra cùng một danh sách toàn trường.
   Nút "Truy/xuất" của bản gốc là menu CHẾT: "Import dữ liệu" trỏ vào #btnExport
   nhưng không tệp .js nào gắn xử lý, hai mục còn lại href="#". Ở đây thay bằng
   vùng báo cáo/Import thật của hệ (ums.report.mount = getList_MauImport, lấy
   mẫu theo quyền của chức năng) — chưa khai mẫu nào thì không hiện nút.
   Cố ý bỏ: ô "Nhập từ khóa tìm kiếm" bên trái (bản gốc không gắn xử lý),
   đóng/mở khung lọc (btnExtend_Search).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, A = ums.dmhsA, esc = ui.esc;
    var root = document.getElementById('hesolophocphan');

    var S = { khoaAll: null, ctAll: null, kt: [], kh: [], hpList: [], hp: '', list: [], modal: [], picked: [] };

    var LW = '110px';
    var FORM =
        '<div class="ums-grid ums-grid--2">' +
            A.row('Học kỳ', A.sel('hocky', { ph: '-- Chọn học kỳ --' }), { required: true, labelWidth: LW }) +
            A.row('Chương trình', A.sel('fct', { ph: '-- Chọn chương trình đào tạo --' }), { labelWidth: LW }) +
            A.row('Khoản thu', A.sel('khoanthu', { multiple: true, ph: '-- Chọn khoản thu --' }), { required: true, labelWidth: LW }) +
            A.row('Kiểu học', A.sel('kieuhoc', { multiple: true, ph: '-- Chọn kiểu học --' }), { required: true, labelWidth: LW }) +
            A.row('Hệ số', A.input('heso', { money: true, ph: 'Nhập hệ số' }), { required: true, labelWidth: LW }) +
        '</div>' +
        '<div class="ums-row ums-u-mt-4 ums-u-mb-2"><b>Học phần</b>' + A.btn('pick', 'Chọn học phần', 'fa-magnifying-glass') + '</div>' +
        '<div data-z="picked"></div>';

    var m = pat.master({
        el: root,
        title: 'Hệ số lớp học phần',
        actions: ums.ui.btn('reload', { attr: { 'data-a': 'refresh' } }) +
            '<span data-z="report"></span>' +
            ui.btn('add', { text: 'Tạo mới', attr: { 'data-a': 'add' } }),
        side: {
            title: 'Lớp học phần', icon: 'fa-chalkboard-user', search: false,
            filter: '<div class="ums-master__search"><div class="ums-filter">' +
                A.fsel('he', 'Chọn hệ đào tạo') +
                A.fsel('khoa', 'Chọn khóa đào tạo') +
                A.fsel('ct', 'Chọn chương trình đào tạo') +
                '</div><div class="ums-row ums-u-fz13 ums-u-muted ums-u-mt-2">' +
                '<i class="fa-light fa-folder-open"></i><span class="ums-u-ellipsis" data-z="path"></span></div></div>'
        },
        main: { title: false }
    });

    m.mainBody.innerHTML =
        '<div data-z="list">' +
            A.panel({ title: 'Hệ số lớp học phần', icon: 'fa-table-cells', count: 'hpname', body: 'grid',
                html: ui.empty('Vui lòng tìm kiếm dữ liệu!', 'fa-magnifying-glass') }) +
        '</div>' +
        '<div data-z="form" hidden>' +
            A.panel({ title: 'Thêm mới Hệ số học phần', icon: 'fa-pen', flush: false, html: FORM,
                tools: A.btn('close', 'Đóng', 'fa-xmark', 'ghost') +
                    A.btn('rewrite', 'Viết lại', 'fa-eraser', 'ghost') + ui.btn('save', { attr: { 'data-a': 'save' } }) }) +
        '</div>';
    m.sideBody.innerHTML = ui.empty('Chọn chương trình để hiện lớp học phần', 'fa-filter');
    A.initControls(root);

    var el = {
        he: A.k(root, 'he'), khoa: A.k(root, 'khoa'), ct: A.k(root, 'ct'), fct: A.k(root, 'fct'),
        path: A.q(root, '[data-z="path"]'), hplist: m.sideBody,
        list: A.q(root, '[data-z="list"]'), form: A.q(root, '[data-z="form"]'),
        grid: A.q(root, '[data-z="grid"]'), hpname: A.q(root, '[data-z="hpname"]'), picked: A.q(root, '[data-z="picked"]')
    };

    /* Báo cáo / Import — thay nút "Truy/xuất" chết của bản gốc (xem đầu tệp).
       Gửi kèm ngữ cảnh đang chọn để mẫu báo cáo lọc đúng phạm vi. */
    ums.report.mount(A.q(root, '[data-z="report"]'), {
        collect: function (add) {
            add('strDaoTao_HeDaoTao_Id', el.he.value);
            add('strDaoTao_KhoaDaoTao_Id', el.khoa.value);
            add('strDaoTao_ChuongTrinh_Id', el.ct.value);
            add('strDaoTao_HocPhan_Id', S.hp);
        }
    });

    function fail(where) { return function (e) { ums.api.handle(e, where); }; }
    function same(a, b) { return String(a === null || a === undefined ? '' : a) === String(b === null || b === undefined ? '' : b); }

    /* ---------- Danh mục lúc mở (page_load) ------------------------------ */
    ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000 })
        .then(function (r) { A.fill(el.he, r, { name: 'TENHEDAOTAO', head: 'Chọn hệ đào tạo' }); })
        .catch(fail('hệ đào tạo'));

    function khoaAPI(he) {
        return ums.ref.khoaDaoTao({ strHeDaoTao_Id: he, strCoSoDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000 });
    }
    function ctAPI(khoa) {
        return ums.ref.chuongTrinh({ strKhoaDaoTao_Id: khoa, strN_CN_LOP_Id: '', strKhoaQuanLy_Id: '', strToChucCT_Cha_Id: '',
            strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000 });
    }
    function fillKhoa(r) { A.fill(el.khoa, r, { name: 'TENKHOA', head: 'Chọn khóa đào tạo' }); }
    function fillCT(r) {
        A.fill(el.ct, r, { name: 'TENCHUONGTRINH', head: 'Chọn chương trình đào tạo' });
        A.fill(el.fct, r, { name: 'TENCHUONGTRINH', head: 'Chọn chương trình đào tạo' });
    }

    khoaAPI('').then(function (r) { if (!S.khoaAll || !S.khoaAll.length) S.khoaAll = r; fillKhoa(r); }).catch(fail('khoá đào tạo'));
    ctAPI('').then(function (r) { if (!S.ctAll || !S.ctAll.length) S.ctAll = r; fillCT(r); }).catch(fail('chương trình đào tạo'));

    A.thoiGian().then(function (r) {
        A.fill(A.k(root, 'hocky'), r, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn học kỳ' });
    }).catch(fail('học kỳ'));
    A.khoanThu().then(function (r) {
        S.kt = r;
        A.fill(A.k(root, 'khoanthu'), r, { name: 'TEN' });
    }).catch(fail('khoản thu'));
    A.kieuHoc().then(function (r) {
        S.kh = r;
        A.fill(A.k(root, 'kieuhoc'), r, { name: 'TEN' });
    }).catch(fail('kiểu học'));

    /* getList_KhoaDaoTao / getList_ChuongTrinhDaoTao: nạp lần đầu, sau đó lọc tại chỗ */
    function khoaTheoHe(he) {
        if (!S.khoaAll || !S.khoaAll.length) {
            khoaAPI(he).then(function (r) { S.khoaAll = r; fillKhoa(r); }).catch(fail('khoá đào tạo'));
            return;
        }
        fillKhoa(S.khoaAll.filter(function (k) { return same(k.DAOTAO_HEDAOTAO_ID, he); }));
    }
    function ctTheoKhoa(khoa) {
        if (!S.ctAll || !S.ctAll.length) {
            ctAPI(khoa).then(function (r) { S.ctAll = r; fillCT(r); }).catch(fail('chương trình đào tạo'));
            return;
        }
        fillCT(S.ctAll.filter(function (c) { return same(c.DAOTAO_KHOADAOTAO_ID, khoa); }));
    }

    A.onPick(el.he, function () { khoaTheoHe(el.he.value); ctTheoKhoa(''); });
    A.onPick(el.khoa, function () { ctTheoKhoa(el.khoa.value); });
    ums.pat.chain([el.he, el.khoa, el.ct]);     // xoá tầng trên thì xoá tầng dưới
    A.onPick(el.ct, function () {
        var ct = el.ct.value;
        if (!ct) { ui.toast('Chưa lấy được dữ liệu, vui lòng chọn lại!', 'warn'); return; }
        loadHP(ct);
        drawPath();
        A.set(root, 'fct', ct);
        loadModal(ct);
    });
    A.onPick(el.fct, function () { if (el.fct.value) loadModal(el.fct.value); });

    function drawPath() {
        var he = A.text(root, 'he') || '..', khoa = A.text(root, 'khoa') || '..', ct = A.text(root, 'ct') || '..';
        var s = he + '/' + khoa + '/' + ct;
        s = s.charAt(0).toUpperCase() + s.slice(1);
        el.path.textContent = s;
        el.path.title = s;
    }
    drawPath();

    /* edu.system.getList_LopHocPhan (Core/systemroot.js:4247) — bản gốc truyền
       strChuongTrinh_Id nhưng hàm này không đọc; mọi tham số lọc đều rỗng. */
    function lopHocPhan(pageSize) {
        return A.rows({
            action: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eCS4iESkgLx4NLjEP',
            func: 'pkg_kehoach_thongtin.LayDSKS_DaoTao_HocPhan_Lop',
            strDaoTao_CoSoDaoTao_Id: '',
            strDaoTao_KhoaDaoTao_Id: '',
            strDaoTao_ThoiGianDaoTao_Id: '',
            strDaoTao_HocPhan_Id: '',
            strNguoiThucHien_Id: '',
            strTuKhoa: '',
            pageIndex: 1,
            pageSize: pageSize
        });
    }

    /* ---------- Danh sách bên trái (cây jstree của bản gốc) --------------- */
    function loadHP() {
        el.hplist.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        lopHocPhan(100000)
            .then(function (r) {
                S.hp = '';
                S.hpList = r;
                drawHP();
            }).catch(function (e) { el.hplist.innerHTML = ui.fail(e.message); ums.api.handle(e, 'danh sách lớp học phần'); });
    }

    function drawHP() {
        if (!S.hpList.length) { el.hplist.innerHTML = ui.empty('Không tìm thấy dữ liệu!'); return; }
        el.hplist.innerHTML = S.hpList.map(function (r, i) {
            return '<button type="button" class="ums-master__item ums-u-ellipsis' + (S.hp && same(r.DAOTAO_HOCPHAN_ID, S.hp) ? ' is-active' : '') +
                '" data-a="hp" data-i="' + i + '" title="' + esc(r.DAOTAO_HOCPHAN_TEN) + '">' + esc(r.DAOTAO_HOCPHAN_TEN) + '</button>';
        }).join('');
    }

    function loadModal() {
        lopHocPhan(200)
            .then(function (r) { S.modal = r; })
            .catch(fail('lớp học phần'));
    }

    /* ---------- Bảng xoay ------------------------------------------------- */
    function loadList() {
        el.grid.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return A.rows({
            action: 'TC_HocPhan_HeSo/LayDanhSach', method: 'GET', versionAPI: 'v1.0',
            strTuKhoa: '', pageIndex: 1, pageSize: 10000,
            strPhamViApDung_Id: el.ct.value, strPhanCapApDung_Id: '', strNgayApDung: '',
            strDaoTao_HocPhan_Id: S.hp, strDaoTao_ThoiGianDaoTao_Id: '', strNguoiThucHien_Id: '',
            strDiem_KieuHoc_Id: '', strTaiChinh_CacKhoanThu_Id: '', strDangKy_DotDangKyHoc_Id: ''
        }).then(function (r) {
            S.list = r;
            draw();
        }).catch(function (e) {
            el.grid.innerHTML = ui.fail(e.message);
            ums.api.handle(e, 'hệ số học phần');
        });
    }

    /** getUnique_LoaiKhoan: khoản thu (theo thứ tự danh mục) có mặt trong dữ liệu */
    function khoanThuCoDuLieu() {
        return S.kt.filter(function (k) {
            return S.list.some(function (r) { return same(r.TAICHINH_CACKHOANTHU_ID, k.ID); });
        });
    }

    /** Bản ghi của ô (học kỳ × khoản thu × kiểu học); trùng thì lấy dòng CUỐI */
    function recAt(row, col, g) {
        for (var d = S.list.length - 1; d >= 0; d--) {          // duyệt ngược như bản gốc
            var r = S.list[d];
            if (same(r.DAOTAO_HOCPHAN_ID, row.HP) && same(r.DAOTAO_THOIGIANDAOTAO_ID, row.ID) &&
                same(r.TAICHINH_CACKHOANTHU_ID, g.id) && same(r.KIEUHOC_ID, col.key)) return r;
        }
        return null;
    }

    function draw() {
        var kts = khoanThuCoDuLieu(), khs = S.kh;
        // Dòng = học kỳ có dữ liệu của lớp học phần đang chọn (giữ thứ tự bản gốc)
        var rows = [];
        S.hpList.forEach(function (hp) {
            S.list.forEach(function (r) {
                if (!same(r.DAOTAO_HOCPHAN_ID, hp.DAOTAO_HOCPHAN_ID)) return;
                if (rows.some(function (x) { return same(x.HP, hp.DAOTAO_HOCPHAN_ID) && same(x.ID, r.DAOTAO_THOIGIANDAOTAO_ID); })) return;
                rows.push({ ID: r.DAOTAO_THOIGIANDAOTAO_ID, TEN: r.DAOTAO_THOIGIANDAOTAO_HOCKY, HP: hp.DAOTAO_HOCPHAN_ID });
            });
        });

        pat.pivot({
            el: el.grid, rows: rows,
            lead: [{ title: 'Học kỳ', prop: 'TEN', cls: 'is-center is-nowrap' }],
            groups: kts.map(function (k) {
                return { title: k.TEN, id: k.ID, cols: khs.map(function (x) { return { title: x.TEN, key: x.ID }; }) };
            }),
            value: function (row, col, g) { var r = recAt(row, col, g); return r ? A.money(r.HESO) : ''; },
            has: function () { return true; },      // ô trống vẫn sửa được (CapNhat theo 4 id)
            onEdit: openEdit, onDelete: removeCell,
            empty: 'Không có dữ liệu'
        });
        var wrap = el.grid.querySelector('.ums-tablewrap');
        if (wrap) wrap.classList.add('dmhsa-scroll');
    }

    /* ---------- Sửa một ô — biểu mẫu NGAY TRONG TRANG, thay chỗ màn (BO-CUC luật 1) ------- */
    function openEdit(row, col, g) {
        var rec = recAt(row, col, g);
        var dlg = A.form({
            host: root, title: 'Sửa hệ số lớp học phần',
            body: A.row('Học kỳ', '<input class="ums-input" readonly tabindex="-1" value="' + esc(row.TEN) + '">') +
                A.row('Khoản thu', '<input class="ums-input" readonly tabindex="-1" value="' + esc(g.title) + '">') +
                A.row('Kiểu học', '<input class="ums-input" readonly tabindex="-1" value="' + esc(col.title) + '">') +
                A.row('Hệ số', A.input('heso', { money: true, ph: 'Nhập hệ số' }), { required: true }),
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function (d) { update(row, col, g, d); return false; } }]
        });
        A.set(dlg.body, 'heso', rec ? A.money(rec.HESO) : '');
    }

    function update(row, col, g, dlg) {
        ums.api.call({
            action: 'TC_HocPhan_HeSo/CapNhat', versionAPI: 'v1.0',
            strPhamViApDung_Id: el.ct.value,
            strPhanCapApDung_Id: '',
            strNgayApDung: '',
            strDaoTao_HocPhan_Id: row.HP,
            strDaoTao_ThoiGianDaoTao_Id: row.ID,
            dHeSo: A.num(A.val(dlg.body, 'heso')),
            strNguoiThucHien_Id: '',
            strDiem_KieuHoc_Id: col.key,
            strTaiChinh_CacKhoanThu_Id: g.id,
            strGhiChu: ''
        }).then(function () {
            ui.toast('Cập nhật thành công!', 'ok', { timeout: 1500 });
            dlg.close();
            loadList();
        }).catch(fail('cập nhật hệ số'));
    }

    function removeCell(row, col, g) {
        var rec = recAt(row, col, g);
        if (!rec) { ui.toast('Ô này chưa có dữ liệu để xoá', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn muốn xóa dữ liệu hệ thống?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({ action: 'TC_HocPhan_HeSo/Xoa', versionAPI: 'v1.0', strIds: rec.ID, strNguoiThucHien_Id: '' })
                .then(function () { ui.toast('Xóa thành công!', 'ok'); loadList(); })
                .catch(fail('xoá hệ số'));
        });
    }

    /* ---------- Vùng thêm mới -------------------------------------------- */
    function drawPicked(bad) {
        el.picked.classList.toggle('ums-u-danger', !!bad);
        ui.table({
            el: el.picked, rows: S.picked, tableCls: 'ums-table--lined ums-table--tight', empty: 'Vui lòng chọn dữ liệu!',
            columns: [
                { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-center' },
                { title: '#', cls: 'is-center', width: '80px', render: function (r) {
                    return '<button type="button" class="ums-btn ums-btn--quiet ums-btn--sm" data-a="unpick" data-id="' +
                        esc(r.DAOTAO_HOCPHAN_ID) + '"><span>Hủy</span></button>';
                } }
            ]
        });
    }

    function rewrite() {
        A.set(root, 'hocky', '');
        A.set(root, 'heso', '');
        A.set(root, 'khoanthu', []);
        A.set(root, 'kieuhoc', []);
        S.picked = [];
        drawPicked();
    }

    function pickedHas(id) { return S.picked.some(function (p) { return same(p.DAOTAO_HOCPHAN_ID, id); }); }

    function openPick() {
        var dlg = A.dialog({
            title: 'Chọn học phần', icon: 'fa-chalkboard-user', size: 'lg',
            body: '<div class="ums-field"><input class="ums-input" data-k="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                '<div data-z="tbl"></div>'
        });
        var tbl = A.q(dlg.body, '[data-z="tbl"]');
        function btn(r, i) {
            var on = pickedHas(r.DAOTAO_HOCPHAN_ID);
            return '<button type="button" class="ums-btn ums-btn--sm ums-btn--' + (on ? 'quiet' : 'ghost') + '" data-pick="' + i + '">' +
                '<i class="fa-light fa-check"></i><span>' + (on ? 'Đã chọn' : 'Chọn') + '</span></button>';
        }
        ui.table({
            el: tbl, rows: S.modal, tableCls: 'ums-table--lined ums-table--tight', empty: 'Không có dữ liệu tìm thấy!',
            columns: [
                { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-center' },
                { title: '#', cls: 'is-center', width: '120px', render: btn }
            ]
        });
        A.k(dlg.body, 'q').addEventListener('input', function () {
            var v = this.value.toLowerCase();
            A.qa(tbl, 'tbody tr').forEach(function (tr) {
                tr.hidden = tr.textContent.toLowerCase().indexOf(v) < 0;
            });
        });
        tbl.addEventListener('click', function (e) {
            var b = e.target.closest('[data-pick]');
            if (!b) return;
            var i = Number(b.getAttribute('data-pick'));
            var r = S.modal[i];
            if (!r) return;
            if (pickedHas(r.DAOTAO_HOCPHAN_ID)) { ui.toast('Dữ liệu đã tồn tại!', 'warn'); return; }
            S.picked.push({ DAOTAO_HOCPHAN_ID: r.DAOTAO_HOCPHAN_ID, DAOTAO_HOCPHAN_TEN: r.DAOTAO_HOCPHAN_TEN, DAOTAO_HOCPHAN_MA: r.DAOTAO_HOCPHAN_MA });
            b.outerHTML = btn(r, i);
            drawPicked();
        });
    }

    var REQ = [['hocky', 'Học kỳ'], ['heso', 'Hệ số'], ['kieuhoc', 'Kiểu học'], ['khoanthu', 'Khoản thu']];

    function save() {
        var thieu = REQ.filter(function (x) { return !A.val(root, x[0]); }).map(function (x) { return x[1]; });
        if (thieu.length) { ui.toast('Vui lòng nhập: ' + thieu.join(', '), 'warn'); return; }
        if (!S.picked.length) { drawPicked(true); ui.toast('Vui lòng chọn học phần!', 'warn'); return; }

        ums.api.call({
            action: 'TC_HocPhan_HeSo/ThemMoi', versionAPI: 'v1.0',
            strPhamViApDung_Id: A.val(root, 'fct'),
            strPhanCapApDung_Id: '',
            strNgayApDung: '',
            strDaoTao_HocPhan_Id: S.picked.map(function (p) { return p.DAOTAO_HOCPHAN_ID; }).toString(),
            strDaoTao_ThoiGianDaoTao_Id: A.val(root, 'hocky'),
            dHeSo: A.num(A.val(root, 'heso')),
            strNguoiThucHien_Id: '',
            strDiem_KieuHoc_Id: A.val(root, 'kieuhoc'),
            strTaiChinh_CacKhoanThu_Id: A.val(root, 'khoanthu'),
            strGhiChu: '',
            strId: ''
        }).then(function () {
            ui.toast('Thêm mới thành công', 'ok');
            showList();
            loadList();
        }).catch(fail('thêm hệ số học phần'));
    }

    // m.formMode: mở biểu mẫu thì giấu nút ở đầu trang để thanh nút của
    // biểu mẫu là thanh dính đỉnh (xem ums.pat.master)
    function showList() { m.formMode(false); if (el.list.hidden) ui.swap(el.form, el.list, { top: false }); }
    function showForm() { m.formMode(true); ui.swap(el.list, el.form, { top: false }); }

    /* ---------- Nút ------------------------------------------------------ */
    A.actions(root, {
        hp: function (b) {
            var r = S.hpList[Number(b.getAttribute('data-i'))];
            if (!r) return;
            S.hp = r.DAOTAO_HOCPHAN_ID;
            A.qa(el.hplist, '.ums-master__item.is-active').forEach(function (x) { x.classList.remove('is-active'); });
            b.classList.add('is-active');
            el.hpname.textContent = '../' + (r.DAOTAO_HOCPHAN_TEN || '');
            loadList();
            showList();
        },
        refresh: function () {
            if (S.hp) loadList();
            else ui.toast('Vui lòng chọn Học phần để thao tác!', 'warn');
        },
        add: function () { rewrite(); showForm(); },
        close: showList,
        rewrite: rewrite,
        save: save,
        pick: openPick,
        unpick: function (b) {
            var id = b.getAttribute('data-id');
            S.picked = S.picked.filter(function (p) { return !same(p.DAOTAO_HOCPHAN_ID, id); });
            drawPicked();
        }
        // sửa/xoá một ô: nút của ums.pat.pivot (onEdit/onDelete trong draw)
    });

    drawPicked();
})();
