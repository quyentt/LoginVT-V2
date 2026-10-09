/* =========================================================================
   Chốt danh sách lớp riêng (lớp học phần tính phí riêng)
   Bản gốc: ApisTaiChinh/Modules/danhmucheso/scripts/loprieng.js
   ---------------------------------------------------------------------------
   Kiểu procedure, có mã hoá:
       pkg_taichinh_loprieng.LayDSThoiGian                  ô Thời gian
       pkg_taichinh_loprieng.LayDSKeHoachDangKyHoc          ô Kế hoạch (theo thời gian)
       pkg_taichinh_loprieng.LayDSHocPhan                   ô Học phần (theo thời gian + kế hoạch)
       pkg_taichinh_loprieng.LayDSLopHocPhan                danh sách lớp
       pkg_taichinh_loprieng.Them_DangKy_LopHocPhan_Chot    "Chốt" từng lớp đã chọn
       PKG_TAICHINH_LOPRIENG.Them_DangKy_LopHocPhan_ChotLai "Chốt lại" từng lớp (viết HOA như bản gốc)
   Thứ tự như bản gốc: chọn Thời gian → nạp Kế hoạch; chọn Kế hoạch → nạp
   danh sách + Học phần; chọn Học phần / bấm Tìm kiếm → nạp danh sách.
   Chốt xong hiện bảng kết quả từng lớp (thành công / thất bại + lý do) rồi
   nạp lại danh sách.

   Cố ý bỏ:
     · getList_KhoanThu (pkg_taichinh_thuchi.LayDSCacKhoanThu): đổ vào
       #dropSearch_KhoanThu / #dropLoaiKhoan — hai ô không có trong HTML.
     · popup / resetPopup: đụng các ô không tồn tại (mã chết).
   Lỗi bản gốc: genTable_LopRieng gọi me.updateSelected_Count() nhưng hàm
   không khai báo `me` → ReferenceError sau khi vẽ bảng (nhãn "Đã chọn"
   không được làm mới). Bản mới không mắc.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, B = ums.dmhsB, esc = ui.esc;
    var root = document.getElementById('loprieng');
    var rows = [];

    root.innerHTML =
        '<div class="ums-page__head"><h1 class="ums-page__title ums-u-mb-0">Chốt lớp riêng</h1>' +
        '<div class="ums-page__actions">' +
            ui.btn('save', { text: 'Chốt', mod: 'primary', attr: { 'data-do': 'chot' } }) +
            ui.btn('save', { text: 'Chốt lại', mod: 'ghost', attr: { 'data-do': 'chotlai' } }) +
        '</div></div>' +
        '<div class="ums-panel ums-u-mb-4"><div class="ums-panel__body"><div class="ums-filter">' +
            '<div class="ums-field"><select class="ums-select" data-f="tg"><option value="">Chọn thời gian</option></select></div>' +
            '<div class="ums-field"><select class="ums-select" data-f="kh"><option value="">Chọn kế hoạch</option></select></div>' +
            '<div class="ums-field"><select class="ums-select" data-f="hp"><option value="">Chọn học phần</option></select></div>' +
            '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-do': 'search' } }) + '</div>' +
        '</div></div></div>' +
        '<div class="ums-panel"><div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-list-check"></i> Danh sách ' +
            '<span class="ums-u-faint ums-u-fz13" data-z="count"></span></div>' +
            '<div class="ums-panel__tools"><span data-z="picked"></span></div></div>' +
        '<div class="ums-panel__body ums-panel__body--flush" data-z="table">' +
            ui.empty('Chọn thời gian và kế hoạch để xem danh sách lớp', 'fa-filter') + '</div></div>';

    var F = {
        tg: root.querySelector('[data-f="tg"]'),
        kh: root.querySelector('[data-f="kh"]'),
        hp: root.querySelector('[data-f="hp"]')
    };
    ui.enhance(root);       // select2 cho mọi ô chọn (chữ gợi ý lấy từ dòng đầu)
    var zTable = root.querySelector('[data-z="table"]');

    function fail(where) { return function (err) { ums.api.handle(err, where); }; }

    B.rows({
        action: 'TC_LopRieng_MH/DSA4BRIVKS4oBiggLwPP',
        func: 'pkg_taichinh_loprieng.LayDSThoiGian',
        strNguoiThucHien_Id: ''
    }).then(function (r) { B.fill(F.tg, r, { name: 'THOIGIAN', head: 'Chọn thời gian' }); }, fail('nạp thời gian'));

    function loadKeHoach() {
        return B.rows({
            action: 'TC_LopRieng_MH/DSA4BRIKJAkuICIpBSAvJgo4CS4i',
            func: 'pkg_taichinh_loprieng.LayDSKeHoachDangKyHoc',
            strDaoTao_ThoiGianDaoTao_Id: F.tg.value,
            strNguoiThucHien_Id: ''
        }).then(function (r) { B.fill(F.kh, r, { name: 'TENKEHOACH', head: 'Chọn kế hoạch' }); }, fail('nạp kế hoạch'));
    }

    function loadHocPhan() {
        return B.rows({
            action: 'TC_LopRieng_MH/DSA4BRIJLiIRKSAv',
            func: 'pkg_taichinh_loprieng.LayDSHocPhan',
            strDaoTao_ThoiGianDaoTao_Id: F.tg.value,
            strDangKy_KeHoachDangKy_Id: F.kh.value,
            strNguoiThucHien_Id: ''
        }).then(function (r) {
            B.fill(F.hp, r, { head: 'Chọn học phần', name: function (x) { return B.e(x.TEN) + ' - ' + B.e(x.MA); } });
        }, fail('nạp học phần'));
    }

    var token = 0;
    function load() {
        var my = ++token;
        zTable.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
        return ums.api.call({
            action: 'TC_LopRieng_MH/DSA4BRINLjEJLiIRKSAv',
            func: 'pkg_taichinh_loprieng.LayDSLopHocPhan',
            strDaoTao_HocPhan_Id: F.hp.value,
            strDaoTao_ThoiGianDaoTao_Id: F.tg.value,
            strDangKy_KeHoachDangKy_Id: F.kh.value,
            strNguoiThucHien_Id: ''
        }).then(function (r) {
            if (my !== token) return;
            rows = B.arr(r.data);
            root.querySelector('[data-z="count"]').textContent = '(' + (r.pager || rows.length) + ')';
            draw();
        }).catch(function (err) {
            if (my !== token) return;
            zTable.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'danh sách lớp riêng');
        });
    }

    function hp(r) { return B.e(r.DAOTAO_HOCPHAN_TEN) + ' - ' + B.e(r.DAOTAO_HOCPHAN_MA); }

    function draw() {
        ui.table({
            el: zTable,
            rows: rows,
            empty: 'Không có lớp nào',
            columns: [
                { title: 'Thời gian kỳ, đợt', prop: 'THOIGIAN', cls: 'is-center is-nowrap' },
                { title: 'Mã lớp', prop: 'MALOP', cls: 'is-nowrap' },
                { title: 'Tên lớp', prop: 'TENLOP' },
                { title: 'Học phần', render: function (r) { return esc(hp(r)); } },
                { title: 'Thời gian chốt', prop: 'THOIGIANCHOT', cls: 'is-center is-nowrap' },
                { title: 'SL chốt', prop: 'SOLUONGKHICHOT', cls: 'is-center' },
                { title: 'Người chốt', prop: 'NGUOICHOT', cls: 'is-center' },
                {
                    head: '<input type="checkbox" data-pick="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                    render: function (r, i) { return '<input type="checkbox" data-pick="' + i + '">'; }
                }
            ]
        });
        count();
    }

    function picked() {
        return Array.prototype.slice.call(zTable.querySelectorAll('input[data-pick]:checked'))
            .filter(function (x) { return x.getAttribute('data-pick') !== 'all'; })
            .map(function (x) { return rows[Number(x.getAttribute('data-pick'))]; });
    }

    function count() {
        var n = picked().length;
        root.querySelector('[data-z="picked"]').innerHTML = n ? ui.badge('Đã chọn: ' + n, 'info') : '';
        Array.prototype.forEach.call(zTable.querySelectorAll('input[data-pick]'), function (x) {
            var tr = x.closest('tr');
            if (tr && x.getAttribute('data-pick') !== 'all') tr.classList.toggle('is-selected', x.checked);
        });
    }

    zTable.addEventListener('change', function (ev) {
        var x = ev.target;
        if (!x.matches('input[data-pick]')) return;
        if (x.getAttribute('data-pick') === 'all') {
            Array.prototype.forEach.call(zTable.querySelectorAll('input[data-pick]'), function (y) { y.checked = x.checked; });
        }
        count();
    });

    /* --- Chốt / Chốt lại --- */
    function chot(lai) {
        var list = picked();
        if (!list.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
        var ten = lai ? 'Chốt lại' : 'Chốt';
        ui.confirm('Bạn có chắc chắn muốn ' + ten.toLowerCase() + ' ' + list.length + ' đối tượng đã chọn không?', { title: ten, ok: ten }).then(function (yes) {
            if (!yes) return;
            var results = [];
            var calls = list.map(function (r) {
                return function () {
                    return ums.api.call({
                        action: lai ? 'TC_LopRieng_MH/FSkkLB4FIC8mCjgeDS4xCS4iESkgLx4CKS41DSAo' : 'TC_LopRieng_MH/FSkkLB4FIC8mCjgeDS4xCS4iESkgLx4CKS41',
                        func: lai ? 'PKG_TAICHINH_LOPRIENG.Them_DangKy_LopHocPhan_ChotLai' : 'pkg_taichinh_loprieng.Them_DangKy_LopHocPhan_Chot',
                        strDangKy_LopHocPhan_Id: r.ID,
                        strNguoiThucHien_Id: ''
                    }).then(function (x) {
                        results.push({ row: r, ok: true, msg: '' });
                        return x;
                    }, function (err) {
                        results.push({ row: r, ok: false, msg: err.message || 'Không rõ nguyên nhân' });
                        throw err;
                    });
                };
            });
            ui.batch(calls, { title: 'Đang ' + ten.toLowerCase(), toast: false, show: true }).then(function () {
                showResults(ten, list.length, results);
                load();
            });
        });
    }

    function showResults(ten, total, results) {
        var ok = results.filter(function (x) { return x.ok; }).length;
        var bad = results.length - ok;
        var missing = total - results.length;
        var host = document.createElement('div');
        host.innerHTML =
            '<div class="ums-row ums-u-mb-4">' +
                ui.badge('Đã chọn: ' + total, 'mute') + ui.badge('Thành công: ' + ok, 'ok') + ui.badge('Thất bại: ' + bad, bad ? 'bad' : 'mute') +
                (missing > 0 ? ui.badge('Chưa phản hồi: ' + missing, 'warn') : '') +
            '</div><div data-z="kq"></div>';
        ui.table({
            el: host.querySelector('[data-z="kq"]'),
            rows: results,
            columns: [
                { title: 'Mã lớp', render: function (x) { return esc(x.row.MALOP); }, cls: 'is-nowrap' },
                { title: 'Tên lớp', render: function (x) { return esc(x.row.TENLOP); } },
                { title: 'Học phần', render: function (x) { return esc(hp(x.row)); } },
                { title: 'Kết quả', cls: 'is-center', render: function (x) { return x.ok ? ui.badge('Thành công', 'ok') : ui.badge('Thất bại', 'bad'); } },
                { title: 'Lý do / Ghi chú', render: function (x) { return esc(x.msg); } }
            ]
        });
        ui.dialog({ title: 'Kết quả ' + ten, icon: 'fa-list-check', size: 'xl', body: host });
    }

    /* --- Sự kiện --- */
    function onPick(el, fn) { jQuery(el).on('select2:select', fn); }
    onPick(F.tg, function () { loadKeHoach(); });
    onPick(F.kh, function () { load(); loadHocPhan(); });
    onPick(F.hp, function () { load(); });
    /* Chưa chọn Thời gian thì khoá Kế hoạch, chưa chọn Kế hoạch thì khoá Học
       phần (CHUYEN-DOI.md mục 1 luật 6). Xoá Thời gian / Kế hoạch → bảng về
       lời nhắc ban đầu; xoá Học phần (lọc tuỳ chọn) → nạp lại mọi lớp của kế hoạch. */
    ums.pat.chain([F.tg, F.kh, F.hp], { phatLai: false });
    function veNhac() {
        ++token;                        // bỏ kết quả của lời gọi đang dở
        rows = [];
        root.querySelector('[data-z="count"]').textContent = '';
        root.querySelector('[data-z="picked"]').textContent = '';
        zTable.innerHTML = ui.empty('Chọn thời gian và kế hoạch để xem danh sách lớp', 'fa-filter');
    }
    jQuery(F.tg).on('select2:clear', veNhac);
    jQuery(F.kh).on('select2:clear', veNhac);
    jQuery(F.hp).on('select2:clear', function () { if (F.kh.value) load(); });

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-do]');
        if (!b || !root.contains(b)) return;
        var act = b.getAttribute('data-do');
        if (act === 'search') load();
        else if (act === 'chot') chot(false);
        else if (act === 'chotlai') chot(true);
    });
})();
