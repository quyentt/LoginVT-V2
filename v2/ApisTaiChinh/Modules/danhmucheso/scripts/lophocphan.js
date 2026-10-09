/* =========================================================================
   Học phí lớp học phần (tổng số tiền lớp riêng theo từng lớp học phần)
   Bản gốc: ApisTaiChinh/Modules/danhmucheso/scripts/lophocphan.js
   ---------------------------------------------------------------------------
   Lưới nhập: danh sách lớp học phần (phân trang máy chủ), cột "Tổng số
   tiền" sửa trong ô; chọn khoản thu rồi "Lưu" gửi các dòng đã đổi.
   Lời gọi (kiểu cũ, không mã hoá; bản gốc để cả 'type' trong dữ liệu gửi
   đi nên giữ nguyên tham số `type`):
       DKH_Chung/LayThoiGianDangKyHoc                GET  ô Thời gian (chọn nhiều)
       DKH_PhanCong_LopHP/LayDSKhoaToChuc            GET  ô Khoá
       DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc     GET  ô Chương trình
       DKH_PhanCong_LopHP/LayDSHocPhan               GET  ô Học phần
       DKH_ThongTin/LayDSDangKy_KeHoachDangKy        GET  ô Kế hoạch
       DKH_ThongTin/LayDSLopHocPhanRieng             GET  danh sách, phân trang
       DKH_PhanCong_LopHP/LayDanhSach                GET  hộp "Chi tiết" phạm vi
       DKH_PhanCong_LopHP/LayDSDangKyHoc             GET  hộp sinh viên đã đăng ký
       TC_ThuChi2/Them_TaiChinh_LopRieng_SoTien      POST lưu tổng số tiền từng lớp
       TC_KhoanThu/LayDanhSach                       GET  ô khoản thu
       edu.system.getList_HeDaoTao / getList_KhoaQuanLy, danh mục QLSV.TRANGTHAI
   Báo cáo: ums.report.mount (= getList_MauImport "zonebtnBaoCao_LopHocPhan"),
   collect() thêm đúng các khoá bản gốc thêm. Import "Import lớp riêng số
   tiền" (IMPORTWITHPROC_LRST, mục cứng trong HTML) → ums.report.importChung.

   Khác bản gốc (có chủ đích):
     · Hộp "Chi tiết" phạm vi: bản gốc truyền pageIndex/pageSize mặc định
       của hệ (edu.system.pageIndex_default — tức TRANG ĐANG XEM của danh
       sách lớp, 10 dòng). Ở đây gửi pageIndex 1, pageSize 1000000 như hộp
       sinh viên bên cạnh.
     · Import: bản gốc truyền title rỗng (thẻ a có title=""); ở đây truyền
       chữ hiển thị "Import lớp riêng số tiền".
   Cố ý bỏ (không có đường vào trong bản gốc):
     · Vùng "Dồn lớp" (#zoneEdit, save_SinhVien, delete_LopHocPhan,
       getList_DangKyHoc/KQ): nút .btnDonLop không được vẽ ở đâu.
     · "Thiết lập lớp riêng" (#btnThietLapLopRieng): nút đã bị comment trong HTML.
     · Các ô dropSearch_Lop / NamNhapHoc / NguoiThu: không có trong HTML.
     · Ô đánh dấu trong hộp phạm vi: không dùng vào việc gì.
   Lỗi bản gốc: hai hàm genList_TrangThaiSV trùng tên (bản sau thắng — bản
   này dùng bản sau); bản trước ghi vào main_doc.TinhTrangQuanSo không tồn tại.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, B = ums.dmhsB, esc = ui.esc, e = B.e;
    var root = document.getElementById('lophocphan');
    var st = { rows: [], total: 0, page: 1, size: 10, tt: [] };

    root.innerHTML =
        '<div class="ums-page__head"><h1 class="ums-page__title ums-u-mb-0">Học phí lớp học phần</h1>' +
        '<div class="ums-page__actions">' +
            '<button type="button" class="ums-btn ums-btn--out-info" data-do="import"><i class="fa-light fa-cloud-arrow-up"></i><span>Import lớp riêng số tiền</span></button>' +
            '<span data-z="report"></span>' +
        '</div></div>' +
        '<div class="ums-panel ums-u-mb-4"><div class="ums-panel__body">' +
            '<div class="ums-filter">' +
                '<div class="ums-field"><select class="ums-select" data-f="tg" multiple></select></div>' +
                '<div class="ums-field"><select class="ums-select" data-f="he" multiple></select></div>' +
                '<div class="ums-field"><select class="ums-select" data-f="khoa" multiple></select></div>' +
                '<div class="ums-field"><select class="ums-select" data-f="kql" multiple></select></div>' +
            '</div><div class="ums-filter ums-u-mt-4">' +
                '<div class="ums-field"><select class="ums-select" data-f="ct" multiple></select></div>' +
                '<div class="ums-field"><select class="ums-select" data-f="hp" multiple></select></div>' +
                '<div class="ums-field"><select class="ums-select" data-f="kh"><option value="">Chọn kế hoạch</option></select></div>' +
                '<div class="ums-field"><label class="ums-check" style="min-height:var(--ums-control-h)"><input type="checkbox" data-f="chuaPC"> Chỉ hiện các lớp chưa phân công</label></div>' +
            '</div><div class="ums-filter ums-u-mt-4">' +
                '<div class="ums-field"><input class="ums-input" data-f="tuSo" placeholder="Số đã đăng ký (từ số)" inputmode="numeric" autocomplete="off"></div>' +
                '<div class="ums-field"><input class="ums-input" data-f="denSo" placeholder="Số đã đăng ký (đến số)" inputmode="numeric" autocomplete="off"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-do': 'search' } }) + '</div>' +
            '</div>' +
            '<div class="ums-legend ums-legend--cach ums-u-mb-2">Chọn trạng thái sinh viên <span class="ums-u-faint ums-u-fz12">(dùng cho báo cáo)</span></div>' +
            '<div class="ums-checkgrid" data-z="tt"></div>' +
        '</div></div>' +
        '<div class="ums-panel"><div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-list-timeline"></i> Danh sách ' +
            '<span class="ums-u-faint ums-u-fz13" data-z="count"></span></div>' +
            '<div class="ums-panel__tools"><div style="width:280px"><select class="ums-select" data-f="kt"><option value="">Chọn khoản thu</option></select></div>' +
                ui.btn('save', { attr: { 'data-do': 'save' } }) + '</div></div>' +
        '<div class="ums-panel__body ums-panel__body--flush" data-z="table">' +
            ui.empty('Chọn điều kiện rồi bấm Tìm kiếm', 'fa-filter') + '</div></div>';

    function q(s) { return root.querySelector(s); }
    var F = {};
    ['tg', 'he', 'khoa', 'kql', 'ct', 'hp', 'kh', 'chuaPC', 'tuSo', 'denSo', 'kt'].forEach(function (k) { F[k] = q('[data-f="' + k + '"]'); });
    var PH = { tg: 'Chọn thời gian', he: 'Tất cả hệ đào tạo', khoa: 'Tất cả khóa đào tạo', kql: 'Tất cả khoa quản lý', ct: 'Tất cả chương trình đào tạo', hp: 'Chọn học phần' };
    Object.keys(PH).forEach(function (k) { B.s2multi(F[k], PH[k]); });   // ô chọn nhiều có "Chọn tất cả"
    ui.enhance(root);       // các ô chọn còn lại (chữ gợi ý lấy từ dòng đầu)
    var zTable = q('[data-z="table"]');

    function fail(where) { return function (err) { ums.api.handle(err, where); }; }
    function m(k) { return B.multi(F[k]); }

    /* --- Nguồn lọc --- */
    function loadTG() {
        return B.rows({ action: 'DKH_Chung/LayThoiGianDangKyHoc', method: 'GET', type: 'GET', strNguoiThucHien_Id: '' })
            .then(function (r) { B.fillMulti(F.tg, r, { name: 'DAOTAO_THOIGIANDAOTAO' }); }, fail('nạp thời gian'));
    }
    function loadHe() {
        return ums.ref.heDaoTao({ pageIndex: 1, pageSize: 1000000 })
            .then(function (r) { B.fillMulti(F.he, r, { name: 'TENHEDAOTAO' }); }, fail('nạp hệ đào tạo'));
    }
    function loadKhoa() {
        return B.rows({
            action: 'DKH_PhanCong_LopHP/LayDSKhoaToChuc', method: 'GET', type: 'GET',
            strDaoTao_HeDaoTao_Id: m('he'),
            strDaoTao_ThoiGianDaoTao_Id: m('tg')
        }).then(function (r) { B.fillMulti(F.khoa, r, { name: 'TENKHOA' }); }, fail('nạp khoá'));
    }
    function loadCT() {
        return B.rows({
            action: 'DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc', method: 'GET', type: 'GET',
            strDaoTao_ThoiGianDaoTao_Id: m('tg'),
            strDaoTao_KhoaDaoTao_Id: m('khoa'),
            strDaoTao_HeDaoTao_Id: m('he'),
            strDaoTao_KhoaQuanLy_Id: m('kql')
        }).then(function (r) { B.fillMulti(F.ct, r, { name: 'TENCHUONGTRINH' }); }, fail('nạp chương trình'));
    }
    function loadKQL() {
        return ums.ref.khoaQuanLy().then(function (r) { B.fillMulti(F.kql, r, { name: 'TEN' }); }, fail('nạp khoa quản lý'));
    }
    function loadHP() {
        return B.rows({
            action: 'DKH_PhanCong_LopHP/LayDSHocPhan', method: 'GET', type: 'GET',
            strDaoTao_ThoiGianDaoTao_Id: m('tg'),
            strDaoTao_KhoaDaoTao_Id: m('khoa'),
            strDaoTao_HeDaoTao_Id: m('he'),
            strDaoTao_ChuongTrinh_Id: m('ct'),
            strDaoTao_KhoaQuanLy_Id: m('kql')
        }).then(function (r) {
            B.fillMulti(F.hp, r, { name: function (x) { return e(x.TEN) + ' - ' + e(x.MA); } });
        }, fail('nạp học phần'));
    }
    function loadKH() {
        return B.rows({
            action: 'DKH_ThongTin/LayDSDangKy_KeHoachDangKy', method: 'GET', type: 'GET',
            strTuKhoa: '',
            strDaoTao_ThoiGianDaoTao_Id: m('tg'),
            strNguoiThucHien_Id: '',
            pageIndex: 1,
            pageSize: 10000
        }).then(function (r) { B.fill(F.kh, r, { name: 'TENKEHOACH', head: 'Chọn kế hoạch' }); }, fail('nạp kế hoạch'));
    }

    loadHe(); loadKhoa(); loadCT(); loadKQL(); loadTG();
    B.khoanThu().then(function (r) { B.fill(F.kt, r, { head: 'Chọn khoản thu' }); }, fail('nạp khoản thu'));

    // Trạng thái sinh viên — mặc định chọn hết
    ums.api.dm('QLSV.TRANGTHAI').then(function (r) {
        st.tt = r;
        q('[data-z="tt"]').innerHTML =
            '<label class="ums-check"><input type="checkbox" data-tt="all" checked> <b>Tất cả</b></label>' +
            r.map(function (x) { return '<label class="ums-check"><input type="checkbox" data-tt="' + esc(x.ID) + '" checked> ' + esc(x.TEN) + '</label>'; }).join('');
    }, fail('nạp trạng thái sinh viên'));
    q('[data-z="tt"]').addEventListener('change', function (ev) {
        if (ev.target.getAttribute('data-tt') !== 'all') return;
        Array.prototype.forEach.call(q('[data-z="tt"]').querySelectorAll('input[data-tt]'), function (x) { x.checked = ev.target.checked; });
    });
    function trangThai() {
        return Array.prototype.slice.call(q('[data-z="tt"]').querySelectorAll('input[data-tt]:checked'))
            .map(function (x) { return x.getAttribute('data-tt'); }).filter(function (x) { return x !== 'all'; });
    }

    /* --- Sự kiện lọc (select2:select như bản gốc) --- */
    function onPick(el, fn) { jQuery(el).on('select2:select', fn); }
    onPick(F.tg, function () { loadHe(); loadHP(); load(1); loadKH(); });
    onPick(F.he, function () { loadKhoa(); loadCT(); loadHP(); });
    onPick(F.khoa, function () { loadCT(); loadHP(); });
    onPick(F.ct, function () { loadHP(); });
    onPick(F.kql, function () { loadCT(); loadHP(); });
    onPick(F.hp, function () { load(1); });

    /* --- Danh sách --- */
    var token = 0;
    function num(el) { var v = el.value.trim(); return v ? parseInt(v, 10) : -1; }
    function load(page) {
        if (page) st.page = page;
        var my = ++token;
        if (!st.rows.length) zTable.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
        return ums.api.call({
            action: 'DKH_ThongTin/LayDSLopHocPhanRieng',
            method: 'GET',
            strTuKhoa: '',
            strDaoTao_ThoiGianDaoTao_Id: m('tg'),
            strDaoTao_HocPhan_Id: m('hp'),
            strNguoiThucHien_Id: '',
            pageIndex: st.page,
            pageSize: st.size,
            strDangKy_KeHoachDangKy_Id: F.kh.value,
            dChiLayCacLopChuaPhanCong: F.chuaPC.checked ? 1 : 0,
            strDaoTao_KhoaDaoTao_Id: m('khoa'),
            strDaoTao_ChuongTrinh_Id: m('ct'),
            strDaoTao_HeDaoTao_Id: m('he'),
            strDaoTao_KhoaQuanLy_Id: m('kql'),
            dSoDaDangTuSo: num(F.tuSo),
            dSoDaDangDenSo: num(F.denSo)
        }).then(function (r) {
            if (my !== token) return;
            st.rows = B.arr(r.data);
            st.total = Number(r.pager) || st.rows.length;
            q('[data-z="count"]').textContent = '(' + st.total + ')';
            draw();
        }).catch(function (err) {
            if (my !== token) return;
            zTable.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'danh sách lớp học phần');
        });
    }

    function draw() {
        ui.table({
            el: zTable,
            rows: st.rows,
            tableCls: 'ums-table--lined ums-table--tight',
            empty: 'Không có lớp học phần',
            page: {
                index: st.page, size: st.size, total: st.total,
                onChange: function (p) {
                    if (p < 1 || p > Math.ceil(st.total / st.size)) return;
                    load(p);
                },
                onSize: function (v) { st.size = v; load(1); }
            },
            columns: [
                { title: 'Mã lớp', prop: 'MALOP', cls: 'is-nowrap' },
                { title: 'Tên lớp', prop: 'TENLOP' },
                { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-center is-nowrap' },
                { title: 'Loại lớp', prop: 'HINHTHUCHOC_TEN', cls: 'is-center' },
                { title: 'Số tín chỉ', prop: 'SOTINCHI', cls: 'is-center' },
                { title: 'Phân bổ', prop: 'THONGTINPHANBO', cls: 'is-center' },
                { title: 'Thông tin lịch', prop: 'THOIGIANCHITIET', cls: 'lhp-wrap' },
                { title: 'Mã GV', cls: 'is-center is-nowrap', render: function (r) { return esc(r.MaGiangVien || r.GIANGVIEN_MASO || r.GIANGVIEN_MA || r.MAGIANGVIEN); } },
                { title: 'Chức danh', prop: 'CHUDANHGIANGVIEN', cls: 'is-nowrap' },
                { title: 'Giảng viên', prop: 'GIANGVIEN', cls: 'is-nowrap' },
                { title: 'Đã phân công', cls: 'is-center', render: function (r, i) {
                    return '<button type="button" class="ums-btn ums-btn--quiet ums-btn--sm" data-do="phamvi" data-i="' + i + '"><i class="fa-light fa-eye"></i>Chi tiết</button>';
                } },
                { title: 'Số SV đã đăng ký', cls: 'is-center', render: function (r, i) {
                    return r.SOSVDADANGKY ? '<button type="button" class="ums-btn ums-btn--quiet ums-btn--sm" data-do="sinhvien" data-i="' + i + '">' + esc(r.SOSVDADANGKY) + '</button>' : '';
                } },
                { title: 'Số SV dự kiến', prop: 'SOLUONGDUKIENHOC', cls: 'is-center' },
                { title: 'Số SV chốt', prop: 'SOSVCHOT', cls: 'is-center' },
                { title: 'Chương trình mở lớp', prop: 'DAOTAO_CHUONGTRINH', cls: 'lhp-wrap' },
                { title: 'Lớp riêng', cls: 'is-center is-nowrap', render: function (r) { return r.HOCPHITINHRIENG ? ui.badge('Lớp riêng', 'info') : ''; } },
                { title: 'Loại khoản', prop: 'TAICHINH_CACKHOANTHU_TEN', cls: 'is-nowrap' },
                { title: 'Tổng số tiền', width: '150px', render: function (r, i) {
                    return '<input class="ums-input ums-input--sm lhp-tien" data-tien="' + i + '" value="' + esc(r.TONGSOTIEN) + '" autocomplete="off">';
                } },
                { head: '<input type="checkbox" data-pick="all" title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (r, i) {
                    return '<input type="checkbox" data-pick="' + i + '">';
                } }
            ]
        });
    }

    zTable.addEventListener('change', function (ev) {
        var x = ev.target;
        if (!x.matches('input[data-pick]')) return;
        if (x.getAttribute('data-pick') === 'all') {
            Array.prototype.forEach.call(zTable.querySelectorAll('input[data-pick]'), function (y) { y.checked = x.checked; });
        }
        Array.prototype.forEach.call(zTable.querySelectorAll('input[data-pick]'), function (y) {
            var tr = y.closest('tr');
            if (y.getAttribute('data-pick') !== 'all' && tr) tr.classList.toggle('is-selected', y.checked);
        });
    });
    function pickedIds() {
        return Array.prototype.slice.call(zTable.querySelectorAll('input[data-pick]:checked'))
            .filter(function (x) { return x.getAttribute('data-pick') !== 'all'; })
            .map(function (x) { return st.rows[Number(x.getAttribute('data-pick'))].ID; });
    }

    /* --- Lưu tổng số tiền các dòng đã đổi --- */
    function saveAll() {
        var calls = [];
        Array.prototype.forEach.call(zTable.querySelectorAll('input[data-tien]'), function (x) {
            var r = st.rows[Number(x.getAttribute('data-tien'))];
            if (x.value === e(r.TONGSOTIEN)) return;
            calls.push({
                action: 'TC_ThuChi2/Them_TaiChinh_LopRieng_SoTien',
                type: 'POST',
                strDaoTao_LopHocPhan_Id: r.ID,
                dTongSoTien: x.value.trim(),
                strTaiChinh_CacKhoanThu_Id: F.kt.value,
                strNguoiThucHien_Id: ''
            });
        });
        if (!calls.length) { ui.toast('Không có thay đổi để lưu', 'info'); return; }
        ui.batch(calls, { title: 'Đang lưu tổng số tiền', okText: 'Đã lưu' }).then(function () { load(); });
    }

    /* --- Hộp phạm vi / sinh viên --- */
    function showPhamVi(r) {
        var host = document.createElement('div');
        host.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
        ui.dialog({ title: 'Danh sách phạm vi — ' + e(r.MALOP), icon: 'fa-sitemap', size: 'lg', body: host });
        B.rows({
            action: 'DKH_PhanCong_LopHP/LayDanhSach',
            method: 'GET',
            strTuKhoa: '',
            strDangKy_KeHoachDangKy_Id: '',
            strDangKy_LopHocPhan_Id: r.ID,
            strPhanCapApDung_Id: '',
            strPhamViApDung_Id: '',
            strNguoiThucHien_Id: '',
            pageIndex: 1,
            pageSize: 1000000
        }).then(function (list) {
            ui.table({ el: host, rows: list, empty: 'Chưa có phạm vi', columns: [
                { title: 'Phạm vi', prop: 'PHAMVIAPDUNG_TEN' },
                { title: 'Phân cấp', prop: 'PHANCAPAPDUNG_TEN' }
            ] });
        }, function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'phạm vi'); });
    }

    function showSinhVien(r) {
        var host = document.createElement('div');
        host.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
        ui.dialog({ title: 'Danh sách sinh viên — ' + e(r.MALOP), icon: 'fa-users', size: 'xl', body: host });
        B.rows({
            action: 'DKH_PhanCong_LopHP/LayDSDangKyHoc',
            method: 'GET',
            type: 'GET',
            strTuKhoa: '',
            strDaoTao_LopHocPhan_Id: r.ID,
            strNguoiThucHien_Id: '',
            pageIndex: 1,
            pageSize: 1000000
        }).then(function (list) {
            ui.table({ el: host, rows: list, empty: 'Chưa có sinh viên', columns: [
                { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                { title: 'Họ tên', cls: 'is-nowrap', render: function (x) { return esc(e(x.QLSV_NGUOIHOC_HODEM) + ' ' + e(x.QLSV_NGUOIHOC_TEN)); } },
                { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' },
                { title: 'Tình trạng', prop: 'QLSV_TRANGTHAINGUOIHOC_TEN' },
                { title: 'Lớp học', prop: 'DAOTAO_LOPQUANLY_TEN' },
                { title: 'Chương trình học', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                { title: 'Khoa quản lý', prop: 'KHOAQUANLY_TEN' },
                { title: 'Hệ đào tạo', prop: 'DAOTAO_HEDAOTAO_TEN' }
            ] });
        }, function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'sinh viên đã đăng ký'); });
    }

    /* --- Báo cáo --- */
    ums.report.mount(q('[data-z="report"]'), {
        collect: function (add) {
            add('strDaoTao_ThoiGianDaoTao_Id', m('tg'));
            add('strDaoTao_KhoaDaoTao_Id', m('khoa'));
            add('strDaoTao_ChuongTrinh_Id', m('ct'));
            add('strDaoTao_HocPhan_Id', m('hp'));
            add('strDaoTao_HeDaoTao_Id', m('he'));
            add('strDaoTao_KhoaQuanLy_Id', m('kql'));
            pickedIds().forEach(function (id) { add('strDangKy_LopHocPhan_Id', id); });
            trangThai().forEach(function (id) { add('strTrangThaiNguoiHoc_Id', id); });
        }
    });

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-do]');
        if (!b || !root.contains(b)) return;
        var act = b.getAttribute('data-do');
        var r = b.hasAttribute('data-i') ? st.rows[Number(b.getAttribute('data-i'))] : null;
        if (act === 'search') load(1);
        else if (act === 'save') saveAll();
        else if (act === 'phamvi') showPhamVi(r);
        else if (act === 'sinhvien') showSinhVien(r);
        else if (act === 'import') ums.report.importChung('Import lớp riêng số tiền', 'IMPORTWITHPROC_LRST', { onDone: function () { load(); } });
    });
})();
