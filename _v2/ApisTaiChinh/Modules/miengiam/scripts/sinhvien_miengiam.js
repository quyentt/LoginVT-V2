/* =========================================================================
   Sinh viên miễn giảm — lập danh sách được miễn theo định mức rồi duyệt
   Bản gốc: ApisTaiChinh/Modules/miengiam/scripts/sinhvien_miengiam.js
   ---------------------------------------------------------------------------
   Bố cục hai cột dùng chung ums.pat.master (xem _v2/BO-CUC.md):
     · trái — thời gian, khoản thu, kiểu học, Hệ/Khoá/Chương trình/Lớp, nút
       "Lập danh sách miễn", danh sách đối tượng có định mức (bấm để lọc);
     · phải — danh sách sinh viên được miễn, sửa "Phần trăm duyệt" trong ô,
       chọn dòng → Duyệt / Xoá.
   Ô "Chọn lớp quản lý" nằm cùng cột lọc với Hệ/Khoá/Chương trình (bản
   chuyển trước để lẫn trong đầu khung bên phải, lạc khỏi chuỗi nối tầng).

   Lời gọi (action kiểu cũ, chép nguyên bản gốc):
       TC_MucMienGiam/LayDanhSach                       GET  đối tượng có định mức (cột trái)
       TC_DoiTuong_MienGiam/LapDSNguocHocDuocMienGiam   GET  lập danh sách
       TC_DoiTuong_MienGiam/LayDanhSach                 GET  danh sách sinh viên
       TC_DoiTuong_MienGiam/PheDuyetDoiTuong_MienGiam   POST mỗi dòng một lời gọi,
                                                        dPhanTramMienGiamDuyet = ô nhập
       TC_DoiTuong_MienGiam/Xoa                         POST mỗi dòng một lời gọi
   Nguồn: ums.ref (Hệ/Khoá/Chương trình/Lớp, thời gian đào tạo =
   edu.system.getList_ThoiGianDaoTao), TC_KhoanThu/LayDanhSach,
   CM_DanhMucDuLieu/LayDanhSach (KHDT.DIEM.KIEUHOC).

   Cố ý bỏ:
     · Ô từ khoá + nút tìm (#btnSearch_NguoiHoc_PhanLop) và hộp "Tìm kiếm
       sinh viên" (#myModalSinhVien_MTP): không có xử lý nào.
   Lỗi bản gốc:
     · Kiểm tra hợp lệ trước khi lập danh sách khai THONGTIN1 "1" nên không
       kiểm gì — ở đây bắt buộc thời gian, khoản thu, kiểu học như ý bản gốc.
     · Nút Xoá hẹn giờ nạp lại sau 2 giây NGAY khi bấm (trước cả khi xác
       nhận) và gắn thêm một trình xử lý #btnYes mỗi lần bấm — bỏ, nạp lại
       sau khi xoá xong.
   Nghi ngờ (giữ nguyên hành vi): bấm một đối tượng ở cột trái gửi
   strQLSV_DoiTuong_Id = ID của BẢN GHI ĐỊNH MỨC (id dòng bảng), không phải
   QLSV_DOITUONG_ID. Cần kiểm trên máy chủ.
   ========================================================================= */
(function () {
    'use strict';

    var M = ums.miengiam, ui = ums.ui, esc = ui.esc, e = M.e;
    var root = document.getElementById('sinhvien_miengiam');
    var st = { doiTuong: '', rows: [] };

    /* Bố cục hai cột dùng chung — ums.pat.master (xem _v2/BO-CUC.md) */
    var mv = ums.pat.master({
        el: root,
        title: 'Sinh viên miễn giảm',
        side: {
            title: 'Danh sách đối tượng', icon: 'fa-address-book', search: false,
            filter: '<div class="ums-panel__body"><div class="ums-stack ums-stack--tight">' +
                M.filterSelect('tg', 'Chọn thời gian đào tạo') +
                M.filterSelect('kt', 'Chọn khoản thu') +
                M.filterSelect('kh', 'Chọn kiểu học') +
                M.filterSelect('he', 'Chọn hệ đào tạo') +
                M.filterSelect('khoa', 'Chọn khóa đào tạo') +
                M.filterSelect('ct', 'Chọn chương trình đào tạo') +
                M.filterSelect('lop', 'Chọn lớp quản lý') +
                '<button type="button" class="ums-btn ums-btn--primary ums-btn--block" data-act="lap">' +
                    '<i class="fa-light fa-book-open-cover"></i><span>Lập danh sách miễn</span></button>' +
            '</div></div>'
        },
        main: {
            title: 'Sinh viên miễn giảm', icon: 'fa-address-book',
            tools: '<span class="ums-u-faint ums-u-fz13" data-z="count"></span>' +
                ui.xoaChon('[data-ck]', { attr: { 'data-act': 'del' } }) +
                '<button type="button" class="ums-btn ums-btn--save" data-act="duyet"><i class="fa-light fa-circle-check"></i><span>Duyệt</span></button>'
        }
    });
    mv.mainBody.classList.add('ums-panel__body--flush');
    mv.mainBody.setAttribute('data-z', 'table');
    mv.mainBody.innerHTML = ui.empty('Chọn khoá, chương trình hoặc lớp để xem danh sách', 'fa-magnifying-glass');

    M.initFilters(root);
    var f = function (k) { return M.fv(root, k); };
    var z = function (k) { return root.querySelector('[data-z="' + k + '"]'); };

    ums.ref.thoiGianDaoTao({ pageIndex: 1, pageSize: 100000 })
        .then(function (r) { M.fill(M.f(root, 'tg'), r, { head: 'Chọn thời gian đào tạo', name: 'DAOTAO_THOIGIANDAOTAO' }); })
        .catch(function (err) { ums.api.handle(err, 'thời gian'); });
    M.khoanThu().then(function (r) { M.fill(M.f(root, 'kt'), r, { head: 'Chọn khoản thu' }); }).catch(function (err) { ums.api.handle(err, 'khoản thu'); });
    M.kieuHoc().then(function (r) { M.fill(M.f(root, 'kh'), r, { head: 'Chọn kiểu học' }); }).catch(function (err) { ums.api.handle(err, 'kiểu học'); });

    ums.ref.cascade({
        he: M.f(root, 'he'), khoa: M.f(root, 'khoa'), ct: M.f(root, 'ct'), lop: M.f(root, 'lop'),
        labels: { he: 'Chọn hệ đào tạo', khoa: 'Chọn khóa đào tạo', ct: 'Chọn chương trình đào tạo', lop: 'Chọn lớp quản lý' },
        onChange: function (v, level) {
            // Bản gốc: đổi khoá → nạp danh sách; đổi chương trình → nạp định mức + danh sách; đổi lớp → danh sách
            if (level === 'ct') loadMucMien();
            if (level === 'khoa' || level === 'ct' || level === 'lop') loadList();
        }
    });

    /* ---------- Cột trái: đối tượng có định mức ------------------------- */
    function loadMucMien() {
        mv.sideBody.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
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
        }).then(function (r) {
            var list = M.rowsOf(r);
            if (mv.sideCount) mv.sideCount.textContent = '(' + (r.pager || list.length) + ')';
            mv.sideBody.innerHTML = list.length ? list.map(function (d) {
                return '<button type="button" class="ums-master__item' + (d.ID === st.doiTuong ? ' is-active' : '') + '" data-dt="' + esc(d.ID) + '">' +
                    '<div>Tên đối tượng: ' + esc(d.QLSV_DOITUONG_TEN) + '</div>' +
                    '<div class="ums-u-faint ums-u-fz13">Mức miễn: ' + esc(d.PHANTRAMMIENGIAM) + '</div></button>';
            }).join('') : ui.empty('Không có dữ liệu');
        }).catch(function (err) {
            mv.sideBody.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'định mức');
        });
    }

    /* ---------- Danh sách sinh viên ---------------------------------------- */
    function loadList() {
        var host = z('table');
        host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: 'TC_DoiTuong_MienGiam/LayDanhSach',
            method: 'GET',
            versionAPI: 'v1.0',
            strHeDaoTao_Id: f('he'),
            strKhoaDaoTao_Id: f('khoa'),
            strChuongTrinh_Id: f('ct'),
            strLopQuanLy_Id: f('lop'),
            strNguoiThucHien_Id: '',
            strPhamViApDung_Id: '',
            strPhanCapApDung_Id: '',
            strNgayApDung: '',
            strQLSV_NguoiHoc_Id: '',
            strQLSV_DoiTuong_Id: st.doiTuong,
            strDaoTao_ThoiGianDaoTao_Id: f('tg'),
            dTuKhoa_number: -1,
            strCanBoLapDuLieuMien_Id: '',
            strDiem_KieuHoc_Id: f('kh'),
            strTaiChinh_CacKhoanThu_Id: f('kt'),
            strDangKy_DotDangKy_Id: '',
            strTuKhoa: '',
            pageIndex: 1,
            pageSize: 100000
        }).then(function (r) {
            st.rows = M.rowsOf(r);
            z('count').textContent = '(' + st.rows.length + ')';
            ui.table({
                el: host, rows: st.rows, empty: 'Không có dữ liệu',
                columns: [
                    { title: 'Mã học viên', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                    { title: 'Họ và tên', cls: 'is-nowrap', render: function (a) { return esc(e(a.QLSV_NGUOIHOC_HODEM) + ' ' + e(a.QLSV_NGUOIHOC_TEN)); } },
                    { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-nowrap' },
                    { title: 'Tình trạng', prop: 'QLSV_NGUOIHOC_TINHTRANG' },
                    { title: 'Đối tượng', prop: 'QLSV_DOITUONG_TEN', width: '160px' },
                    { title: 'Lớp', prop: 'QLSV_NGUOIHOC_LOP', cls: 'is-nowrap' },
                    { title: 'Chương trình', prop: 'DAOTAO_TOCHUCCHUONGTRINH_TEN' },
                    { title: 'Phần trăm đề xuất', prop: 'PHANTRAMMIENGIAM', cls: 'is-center' },
                    { title: 'Phần trăm duyệt', width: '120px', render: function (a, i) {
                        return '<input class="ums-input ums-input--sm" style="text-align:right" data-pd="' + i + '" value="' + esc(a.PHANTRAMMIENGIAM) + '" autocomplete="off">';
                    } },
                    { title: 'Trạng thái', cls: 'is-center is-nowrap', render: function (a) { return a.CANBODUYET_ID ? ui.badge('Đã duyệt', 'ok') : ''; } },
                    { head: '<input type="checkbox" data-act="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                      render: function (a, i) { return '<input type="checkbox" data-ck="' + i + '">'; } }
                ]
            });
        }).catch(function (err) {
            host.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'sinh viên miễn giảm');
        });
    }

    function checked() {
        return Array.prototype.map.call(z('table').querySelectorAll('[data-ck]:checked'), function (x) { return Number(x.getAttribute('data-ck')); });
    }

    /* ---------- Thao tác ----------------------------------------------------- */
    function lapDanhSach() {
        var bad = [];
        [['tg', 'Thời gian'], ['kh', 'Kiểu học'], ['kt', 'Khoản thu']].forEach(function (x) {
            var el = M.f(root, x[0]), wrong = !el.value;
            if (el.nextElementSibling) el.nextElementSibling.classList.toggle('is-invalid', wrong);
            if (wrong) bad.push(x[1]);
        });
        if (bad.length) { ui.toast('Kiểm tra lại: ' + bad.join(', '), 'warn'); return; }
        ums.api.call({
            action: 'TC_DoiTuong_MienGiam/LapDSNguocHocDuocMienGiam',
            method: 'GET',
            versionAPI: 'v1.0',
            strNguoiThucHien_Id: '',
            strHeDaoTao_Id: f('he'),
            strKhoaDaoTao_Id: f('khoa'),
            strChuongTrinh_Id: f('ct'),
            strLopQuanLy_Id: f('lop'),
            strTrangThaiNguoiHoc_Id: '',
            strDaoTao_ThoiGianDaoTao_Id: f('tg'),
            strTaiChinh_CacKhoanThu_Id: f('kt'),
            strDiem_KieuHoc_Id: f('kh')
        }).then(function () {
            ui.toast('Lập dữ liệu danh sách sinh viên miễn giảm thành công!', 'ok');
            loadList();
        }).catch(function (err) { ums.api.handle(err, 'lập danh sách'); });
    }

    function duyet() {
        var idx = checked();
        if (!idx.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn duyệt dữ liệu không? (' + idx.length + ' sinh viên)', { ok: 'Duyệt' }).then(function (yes) {
            if (!yes) return;
            var calls = idx.map(function (i) {
                return {
                    action: 'TC_DoiTuong_MienGiam/PheDuyetDoiTuong_MienGiam',
                    versionAPI: 'v1.0',
                    strIds: st.rows[i].ID,
                    dPhanTramMienGiamDuyet: z('table').querySelector('[data-pd="' + i + '"]').value.trim(),
                    strNguoiThucHien_Id: ''
                };
            });
            return ui.batch(calls, { title: 'Đang duyệt', okText: 'Đã duyệt' }).then(loadList);
        });
    }

    function xoa() {
        var idx = checked();
        if (!idx.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không? (' + idx.length + ' sinh viên)', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
            if (!yes) return;
            var calls = idx.map(function (i) {
                return { action: 'TC_DoiTuong_MienGiam/Xoa', versionAPI: 'v1.0', strIds: st.rows[i].ID, strNguoiThucHien_Id: '' };
            });
            return ui.batch(calls, { title: 'Đang xoá', okText: 'Đã xoá' }).then(loadList);
        });
    }

    root.addEventListener('click', function (ev) {
        var dt = ev.target.closest('[data-dt]');
        if (dt) {
            st.doiTuong = dt.getAttribute('data-dt');
            Array.prototype.forEach.call(mv.sideBody.querySelectorAll('[data-dt]'), function (x) { x.classList.toggle('is-active', x === dt); });
            loadList();
            return;
        }
        var b = ev.target.closest('[data-act]');
        if (!b || !root.contains(b)) return;
        var act = b.getAttribute('data-act');
        if (act === 'lap') lapDanhSach();
        else if (act === 'duyet') duyet();
        else if (act === 'del') xoa();
        else if (act === 'all') {
            Array.prototype.forEach.call(z('table').querySelectorAll('[data-ck]'), function (x) {
                x.checked = b.checked;
                x.closest('tr').classList.toggle('is-selected', b.checked);
            });
        }
    });
    root.addEventListener('change', function (ev) {
        if (ev.target.hasAttribute && ev.target.hasAttribute('data-ck')) ev.target.closest('tr').classList.toggle('is-selected', ev.target.checked);
    });
})();
