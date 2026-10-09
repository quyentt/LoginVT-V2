/* =========================================================================
   Kế hoạch thu chi — danh sách kế hoạch (trái) + biểu mẫu (phải)
   Bản gốc: ApisTaiChinh/Modules/danhmucheso/scripts/kehoachthuchi.js
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên từ bản gốc, đều là action kiểu cũ, không mã hoá):
       TC_KeHoachThuChi/LayDanhSach            GET  strTuKhoa, phân trang 1/10 mặc định của hệ
       TC_KeHoachThuChi/ThemMoi | CapNhat      POST (CapNhat khi strId khác rỗng)
       TC_KeHoachThuChi_NhanSu/LayDanhSach     GET  cán bộ sử dụng của kế hoạch
       TC_KeHoachThuChi_NhanSu/Xoa             POST strIds = id bản ghi cán bộ
       TC_HoaDon/LayDanhSach · TC_PhieuThu/LayDanhSach · TC_BienLai/LayDanhSach   GET, hiện MAUSO
       Danh mục: TAICHINH.PHANBOHOADON, TAICHINH.MOHINH_PHIEUTHU,
                 TAICHINH.PHANBOBIENLAI, TAICHINH.MOHINHGACHNO
   Tên tham số lưu chép nguyên, kể cả chỗ một ô cấp cho hai tham số
   (dropMoHinhPhanBoHoaDon_KHTC → strMoHinhApDungHoaDon_Id VÀ
   strMoHinhApDungHoaDonRut_Id; tương tự phiếu thu/phiếu rút, biên lai/biên lai rút).

   Lỗi bản gốc — KHÔNG chép, đã bỏ tính năng:
     · Thêm cán bộ sử dụng: nút "Tìm kiếm" mở edu.extend.genModal_NhanSu()
       KHÔNG truyền callback → bấm "Chọn nhân sự" ném TypeError; còn trình
       xử lý '.btnSelect' của màn chờ một nút không tồn tại trong hộp đó.
       Không thêm được cán bộ nào → bỏ phần thêm, chỉ giữ xem/xoá.
     · Sau khi lưu kế hoạch, bản gốc gọi TC_KeHoachThuChi_NhanSu/ThemMoi cho
       MỌI dòng trong bảng cán bộ, kể cả dòng đã lưu — với strNguoiDung_Id là
       id BẢN GHI (không phải người dùng), vai trò/cơ sở rỗng → nhân bản rác.
       Bỏ bước này (không còn dòng mới nào để lưu).
   Đã dựng lại (bản gốc có mã nhưng không bấm tới được):
     · XOÁ kế hoạch — nút '#delete_EditHocPhan' của bản gốc luôn display:none và
       '.btnDelete' trong bảng không có phần tử nào, nên TC_KeHoachThuChi/Xoa chưa
       bao giờ chạy. Ở đây nút Xoá hiện khi đang SỬA một kế hoạch, hỏi xác nhận
       rồi gọi đúng lời gọi đó (strIds = id kế hoạch).
   Cố ý bỏ (mã chết trong bản gốc):
     · danh mục TAICHINH.VAITRO_BAOCAO và KHCT_CoSoDaoTao/LayDanhSach — chỉ dùng
       cho dòng cán bộ thêm mới (đã bỏ); getList_CoSoDaoTao vốn không ai gọi
   Nghi ngờ, giữ nguyên:
     · kiểm tra hợp lệ của bản gốc trỏ vào các ô txtGT_* / dropSearch_* không có
       trên màn → thực tế không kiểm gì; ở đây cũng không chặn
     · thêm mới xong strId vẫn rỗng — bấm Lưu lần nữa sẽ thêm bản thứ hai
       (bản gốc hỏi "tiếp tục thêm?", đồng ý thì xoá trắng biểu mẫu)
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, A = ums.dmhsA;
    var root = document.getElementById('kehoachthuchi');
    var S = { list: [], page: 1, size: 10, total: 0, id: '' };

    function fail(where) { return function (e) { ums.api.handle(e, where); }; }
    function sel(key, label) { return '<div>' + ui.field(label, A.sel(key)) + '</div>'; }
    function inp(key, label, o) {
        o = o || {};
        var c = o.date ? '<div class="ums-inputwrap">' + A.input(key, { date: true }) + '<i class="fa-light fa-calendar"></i></div>' : A.input(key, o);
        return '<div' + (o.span ? ' style="grid-column:1 / -1"' : '') + '>' + ui.field(label, c, { required: o.required }) + '</div>';
    }

    var form =
        '<div class="ums-grid ums-grid--3">' +
        '<div class="ums-legend ums-u-mb-0" style="grid-column:1 / -1">Thông tin</div>' +
        inp('ten', 'Tên kế hoạch', { required: true, span: true }) +
        inp('batdau', 'Ngày bắt đầu', { date: true, required: true }) +
        inp('ketthuc', 'Ngày kết thúc', { date: true, required: true }) +
        '<div></div>' +
        '<div style="grid-column:1 / -1">' + ui.field('Mô tả', '<textarea class="ums-textarea" data-k="mota"></textarea>') + '</div>' +
        '<div class="ums-legend ums-u-mb-0" style="grid-column:1 / -1">Hóa đơn</div>' +
        sel('mhHoaDon', 'Mô hình phân bổ hóa đơn') + sel('hdThu', 'Loại hóa đơn thu') + sel('hdRut', 'Loại hóa đơn rút') +
        '<div class="ums-legend ums-u-mb-0" style="grid-column:1 / -1">Phiếu thu</div>' +
        sel('mhPhieuThu', 'Mô hình phân bổ phiếu thu') + sel('ptThu', 'Loại phiếu thu') + sel('ptRut', 'Loại phiếu rút') +
        '<div class="ums-legend ums-u-mb-0" style="grid-column:1 / -1">Biên lai</div>' +
        sel('mhBienLai', 'Mô hình phân bổ biên lai') + sel('blThu', 'Loại biên lai thu') + sel('blRut', 'Loại biên lai rút') +
        '<div class="ums-legend ums-u-mb-0" style="grid-column:1 / -1">Hóa đơn điện tử</div>' +
        sel('hdDienTu', 'Loại hóa đơn') + sel('mhGachNo', 'Mô hình gạch nợ') +
        inp('vat', 'VAT', { ph: 'Phần trăm thuế GTGT' }) +
        '</div>';

    var m = pat.master({
        el: root,
        title: 'Kế hoạch thu chi',
        actions: ui.btn('add', { attr: { 'data-a': 'add' } }),
        side: {
            // Ô tìm CHUẨN của ums.pat.master (.ums-searchbar). Trước đây màn này
            // tự dựng ô lọc + nút rời trong cột 320px nên ô nhập chỉ còn 123px,
            // chữ giữ chỗ bị cắt và khác hẳn các màn hai cột còn lại.
            title: 'Danh sách kế hoạch', icon: 'fa-money-check-pen', width: '320px',
            search: 'Nhập từ khóa tìm kiếm'
        },
        main: { title: false }
    });

    m.mainBody.innerHTML =
        // Quy ước 1 (BO-CUC.md): biểu mẫu chỉ hiện khi bấm "Thêm mới" hoặc chọn
        // một kế hoạch; lúc mở màn hiện khung giới thiệu.
        '<div data-z="form" hidden>' +
            A.panel({
                title: 'Thêm mới - Kế hoạch thu chi', icon: 'fa-pen-to-square', flush: false, html: form,
                tools: ui.btn('close', { attr: { 'data-a': 'close' } }) +
                    A.btn('rewrite', 'Nhập tiếp', 'fa-pen-line', 'ghost') +
                    /* Xoá chỉ hiện khi đang SỬA một kế hoạch có thật — đúng ý định bản
                       gốc (#delete_EditHocPhan có sẵn nhưng luôn display:none nên chưa
                       bao giờ bấm được). */
                    ui.btn('del', { attr: { 'data-a': 'xoa', hidden: 'hidden' } }) +
                    ui.btn('save', { attr: { 'data-a': 'save' } })
            }) +
            '<div class="ums-u-mt-4">' +
            A.panel({ title: 'Danh sách cán bộ sử dụng', icon: 'fa-users', body: 'canbo',
                html: ui.empty('Chọn một kế hoạch để xem cán bộ sử dụng', 'fa-users') }) +
            '</div>' +
        '</div>' +
        '<div data-z="notify">' +
            A.panel({ title: 'Thông tin chung', icon: 'fa-circle-info', flush: false,
                // Chỉ MỘT nút "Thêm mới" cho cả màn, đặt ở đầu trang theo
                // BO-CUC.md; khung này chỉ còn câu dẫn.
                html: '<div class="ums-row ums-u-muted">Chọn một kế hoạch ở danh sách bên trái để xem, ' +
                    'hoặc bấm <b>Thêm mới</b> ở đầu trang để tạo kế hoạch.</div>' }) +
        '</div>';
    A.initControls(root);

    var el = {
        list: m.sideBody, count: m.sideCount,
        form: A.q(root, '[data-z="form"]'), notify: A.q(root, '[data-z="notify"]'),
        canbo: A.q(root, '[data-z="canbo"]'), ftitle: A.q(root, '[data-z="form"] .ums-panel__title'),
        tukhoa: m.search
    };

    /* ---------- Danh mục ô chọn ----------------------------------------- */
    [['TAICHINH.PHANBOHOADON', 'mhHoaDon'], ['TAICHINH.MOHINH_PHIEUTHU', 'mhPhieuThu'],
     ['TAICHINH.PHANBOBIENLAI', 'mhBienLai'], ['TAICHINH.MOHINHGACHNO', 'mhGachNo']].forEach(function (p) {
        ums.api.dm(p[0]).then(function (r) { A.fill(A.k(root, p[1]), r); }).catch(fail('danh mục ' + p[0]));
    });
    function mauSo(action, keys, head) {
        A.rows({
            action: action, method: 'GET', versionAPI: 'v1.0', strTuKhoa: '',
            strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000
        }).then(function (r) {
            keys.forEach(function (k) { A.fill(A.k(root, k), r, { name: 'MAUSO', head: head }); });
            if (S.row) fill(S.row);           // đang sửa mà danh mục về sau thì đổ lại
        }).catch(fail(action));
    }
    // TC_HoaDon/LayDanhSach có thêm strLoaiHoaDon_Id rỗng
    A.rows({
        action: 'TC_HoaDon/LayDanhSach', method: 'GET', versionAPI: 'v1.0', strTuKhoa: '', strLoaiHoaDon_Id: '',
        strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000
    }).then(function (r) {
        ['hdRut', 'hdThu', 'hdDienTu'].forEach(function (k) { A.fill(A.k(root, k), r, { name: 'MAUSO', head: 'Chọn loại hóa đơn' }); });
        if (S.row) fill(S.row);
    }).catch(fail('TC_HoaDon/LayDanhSach'));
    mauSo('TC_PhieuThu/LayDanhSach', ['ptRut', 'ptThu'], 'Chọn loại phiếu thu');
    mauSo('TC_BienLai/LayDanhSach', ['blRut', 'blThu'], 'Chọn loại biên lai');

    /* ---------- Danh sách kế hoạch -------------------------------------- */
    function load(page) {
        S.page = page || S.page || 1;
        return ums.api.call({
            action: 'TC_KeHoachThuChi/LayDanhSach', method: 'GET', versionAPI: 'v1.0',
            strTuKhoa: el.tukhoa.value.trim(), strNguoiThucHien_Id: '',
            pageIndex: S.page, pageSize: S.size
        }).then(function (r) {
            S.list = Array.isArray(r.data) ? r.data : [];
            S.total = r.pager || S.list.length;
            // Danh sách bên trái của ums.pat.master: mỗi kế hoạch là một mục bấm được
            el.list.innerHTML = S.list.length
                ? S.list.map(function (row) {
                    return '<button type="button" class="ums-master__item" data-id="' + ui.esc(row.ID) + '">' +
                        ui.esc(row.TENKEHOACH) + '<span class="ums-master__item__sub">' +
                        ui.esc((row.NGAYBATDAU || '') + ' - ' + (row.NGAYKETTHUC || '')) + '</span></button>';
                }).join('') + ui.pager({ index: S.page, size: S.size, total: S.total }, S.list.length)
                : ui.empty('Chưa có kế hoạch');
            A.qa(el.list, '.ums-pager__btn[data-go]').forEach(function (b) {
                b.addEventListener('click', function () {
                    var n = Number(b.getAttribute('data-go'));
                    if (n >= 1 && n <= Math.ceil(S.total / S.size)) load(n);
                });
            });
            el.count.textContent = '(' + S.total + ')';
            mark();
        }).catch(function (e) { el.list.innerHTML = ui.fail(e.message); ums.api.handle(e, 'danh sách kế hoạch'); });
    }
    function mark() {
        A.qa(el.list, '.ums-master__item').forEach(function (b) { b.classList.toggle('is-active', b.getAttribute('data-id') === S.id); });
    }

    el.list.addEventListener('click', function (e) {
        var b = e.target.closest('.ums-master__item');
        if (!b) return;
        var row = S.list.filter(function (r) { return r.ID === b.getAttribute('data-id'); })[0];
        if (!row) { ui.toast('Dữ liệu chọn không đúng', 'warn'); return; }
        edit(row);
    });
    el.tukhoa.addEventListener('keypress', function (e) { if (e.which === 13) { e.preventDefault(); load(1); } });
    el.tukhoa.addEventListener('search', function () { load(1); });     // bấm dấu × của ô tìm

    /* ---------- Biểu mẫu ------------------------------------------------ */
    var MAP = [
        ['ten', 'TENKEHOACH'], ['batdau', 'NGAYBATDAU'], ['ketthuc', 'NGAYKETTHUC'], ['mota', 'MOTA'],
        ['mhHoaDon', 'MOHINHAPDUNGHOADON_ID'], ['hdThu', 'TAICHINH_HOADON_ID'], ['hdRut', 'TAICHINH_HETHONGHOADONRUT_ID'],
        ['mhPhieuThu', 'MOHINHAPDUNGPHIEUTHU_ID'], ['ptThu', 'TAICHINH_HETHONGPHIEUTHU_ID'], ['ptRut', 'TAICHINH_HETHONGPHIEURUT_ID'],
        ['mhBienLai', 'MOHINHAPDUNGBIENLAI_ID'], ['blThu', 'TAICHINH_HETHONGBIENLAI_ID'], ['blRut', 'TAICHINH_HETHONGBIENLAIRUT_ID'],
        ['hdDienTu', 'TAICHINH_HOADON_DIENTU_ID'], ['mhGachNo', 'MOHINHGACHNOTUDONG_ID'], ['vat', 'PHANTRAMTHUEGTGT']
    ];
    function fill(row) { MAP.forEach(function (m) { A.set(el.form, m[0], row ? row[m[1]] : ''); }); }

    function showForm() {
        // giấu nút đầu trang khi mở biểu mẫu → thanh Lưu/Đóng thành thanh dính
        m.formMode(true);
        if (!el.notify.hidden) ui.swap(el.notify, el.form, { top: false });
    }
    function nutXoa(hien) {
        var b = root.querySelector('[data-a="xoa"]');
        if (b) b.hidden = !hien;
    }

    function rewrite() {
        S.id = ''; S.row = null;
        nutXoa(false);
        fill(null);
        el.ftitle.innerHTML = '<i class="fa-light fa-plus"></i> Thêm mới - Kế hoạch thu chi';
        el.canbo.innerHTML = ui.empty('Chọn một kế hoạch để xem cán bộ sử dụng', 'fa-users');
        mark();
    }
    function edit(row) {
        showForm();
        S.id = row.ID; S.row = row;
        nutXoa(true);
        fill(row);
        el.ftitle.innerHTML = '<i class="fa-light fa-pen-to-square"></i> Sửa - ' + ui.esc(row.TENKEHOACH || 'Kế hoạch thu chi');
        mark();
        loadCanBo();
    }

    function save() {
        var v = function (k) { return A.val(el.form, k); };
        var id = S.id;
        ums.api.call({
            action: id !== '' ? 'TC_KeHoachThuChi/CapNhat' : 'TC_KeHoachThuChi/ThemMoi',
            versionAPI: 'v1.0',
            strId: id,
            strTaiChinh_HT_HoaDonRut_Id: v('hdRut'),
            strMoHinhApDungHoaDonRut_Id: v('mhHoaDon'),
            strTaiChinh_HoaDon_DienTu_Id: v('hdDienTu'),
            strMoHinhGachNoTuDong_Id: v('mhGachNo'),
            dPhanTramThueGTGT: v('vat'),
            strNgayBatDau: v('batdau'),
            strNgayKetThuc: v('ketthuc'),
            strTenKeHoach: v('ten'),
            strMoTa: v('mota'),
            strMoHinhApDungPhieuThu_Id: v('mhPhieuThu'),
            strTaiChinh_HT_PhieuThu_Id: v('ptThu'),
            strMoHinhApDungPhieuRut_Id: v('mhPhieuThu'),
            strTaiChinh_HT_PhieuRut_Id: v('ptRut'),
            strTaiChinh_HoaDon_Id: v('hdThu'),
            strMoHinhApDungHoaDon_Id: v('mhHoaDon'),
            strTaiChinh_HT_BienLai_Id: v('blThu'),
            strTaiChinh_HT_BienLaiRut_Id: v('blRut'),
            strMoHinhApDungBienLai_Id: v('mhBienLai'),
            strMoHinhApDungBienLaiRut_Id: v('mhBienLai'),
            strNguoiThucHien_Id: ''
        }).then(function () {
            load();
            if (id === '') {
                ui.confirm('Thêm mới thành công! Bạn có muốn tiếp tục thêm không?', { ok: 'Thêm tiếp', cancel: 'Không' })
                    .then(function (yes) { if (yes) rewrite(); });
            } else {
                ui.toast('Cập nhật thành công!', 'ok');
            }
        }).catch(fail('lưu kế hoạch'));
    }

    /* ---------- Cán bộ sử dụng (chỉ xem / xoá) --------------------------- */
    function loadCanBo() {
        var id = S.id;
        el.canbo.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        A.rows({
            action: 'TC_KeHoachThuChi_NhanSu/LayDanhSach', method: 'GET', versionAPI: 'v1.0',
            strTuKhoa: '', strNguoiDung_Id: '', strTaiChinh_KeHoach_Id: id, strNguoiThucHien_Id: '',
            pageIndex: 1, pageSize: 100000
        }).then(function (r) {
            if (id !== S.id) return;
            ui.table({
                el: el.canbo, rows: r, tableCls: 'ums-table--lined ums-table--tight', empty: 'Chưa có cán bộ nào',
                columns: [
                    { title: 'Họ tên', render: function (x) { return ui.esc(x.NGUOIDUNG_HOTEN) + ' - ' + ui.esc(x.NGUOIDUNG_TAIKHOAN); } },
                    { title: 'Vai trò', prop: 'VAITRO_TEN' },
                    { title: 'Cơ sở', prop: 'DAOTAO_COSODAOTAO_TEN' },
                    { title: 'Xóa', cls: 'is-actions', width: '70px', render: function (x) { return ui.iconBtn('del', x.ID); } }
                ]
            });
        }).catch(function (e) { el.canbo.innerHTML = ui.fail(e.message); ums.api.handle(e, 'cán bộ sử dụng'); });
    }
    el.canbo.addEventListener('click', function (e) {
        var b = e.target.closest('[data-act="del"]');
        if (!b) return;
        ui.confirm('Bạn có chắc chắn muốn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({ action: 'TC_KeHoachThuChi_NhanSu/Xoa', versionAPI: 'v1.0', strIds: b.getAttribute('data-id') })
                .then(function () { ui.toast('Xóa thành công!', 'ok'); loadCanBo(); })
                .catch(fail('xoá cán bộ'));
        });
    });

    /* Xoá kế hoạch — TC_KeHoachThuChi/Xoa, đúng lời gọi bản gốc đã viết sẵn
       (kehoachthuchi.js:316) nhưng không nút nào gọi tới được. */
    function xoa() {
        if (!S.id) return;
        var ten = (S.row && S.row.TENKEHOACH) || 'kế hoạch này';
        ui.confirm('Xoá "' + ten + '"? Thao tác này không hoàn tác được.',
            { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
            if (!yes) return;
            return ums.api.call({
                action: 'TC_KeHoachThuChi/Xoa', versionAPI: 'v1.0', strIds: S.id
            }).then(function () {
                ui.toast('Xoá thành công', 'ok');
                rewrite();
                m.formMode(false);
                ui.swap(el.form, el.notify, { top: false });
                load(1);
            });
        }).catch(function (err) { ums.api.handle(err, 'xoá kế hoạch thu chi'); });
    }

    A.actions(root, {
        add: function () { rewrite(); showForm(); },
        rewrite: rewrite,
        save: save,
        xoa: xoa,
        close: function () { m.formMode(false); ui.swap(el.form, el.notify, { top: false }); }
    });

    pat.cotTrai(m, { tai: function () { load(1); } });   // luật cột trái (BO-CUC 12): Tải lại, gõ là tự tìm
    load(1);
})();
