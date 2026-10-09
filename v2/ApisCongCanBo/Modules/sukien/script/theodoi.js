/* =========================================================================
   Theo dõi sự kiện — danh sách sự kiện của kế hoạch, xác nhận tham gia, check in
   Bản gốc: ApisCongCanBo/Modules/sukien/script/theodoi.js + html/theodoi.html
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       SV_SuKien/LayDSQLSV_SuKien_KeHoach        GET  ô chọn kế hoạch (chọn sẵn mục đầu)
       SV_SuKien/LayDSQLSV_SuKien_HoatDong       GET  strQLSV_SuKien_KeHoach_Id
       SV_SuKien/LayDSSuKien_HoatDong_ThoiGian   GET  mỗi dòng một lời gọi → cột Thời gian
       SV_SuKien/LayDSSuKien_HoatDong_DienGia    GET  mỗi dòng một lời gọi → cột Diễn giả
       SV_Files (viewFiles)                            cột Tư liệu, chỉ xem
       "Danh sách" → Chi tiết:
         SV_SuKien/LayDSSuKien_KeHoach_DangKy    GET  kế hoạch + sự kiện
         SV_SuKien/Them_SuKien_KeHoach_ThamGia   POST dòng vừa đánh dấu "Xác nhận tham gia"
         SV_SuKien/Xoa_SuKien_KeHoach_ThamGia    POST dòng vừa bỏ dấu — strId = ID dòng ĐĂNG KÝ (như gốc)
       "Thực hiện kiểm tra & Check in" → Chi tiết:
         SV_SuKien/LayTTKiemTraThamGia           GET  strMaSoNguoiHoc, strMaSoDangKy, strQLSV_SuKien_HoatDong_Id
         SV_SuKien/Them_SuKien_KeHoach_ThamGia   POST nút Check In
         SV_SuKien/LayDSSuKien_KeHoach_ThamGia_CI GET danh sách check in

   Giữ như bản gốc:
     · LayDSSuKien_KeHoach_ThamGia_CI gửi id SỰ KIỆN vào strQLSV_SuKien_KeHoach_Id
       và id KẾ HOẠCH vào strQLSV_SuKien_HoatDong_Id (đảo tên). Chỉ đọc nên
       giữ nguyên — KIỂM TRÊN HOST xem danh sách check in có ra đúng không.
   BẢN GỐC CHƯA TỪNG CHẠY ĐƯỢC — ở đây làm theo đúng ý định, THỬ TRÊN HOST:
     · Check in: genTable_CheckIn khai báo HAI lần (bản sau — đổ thông tin sinh
       viên — đè bản vẽ bảng), genTable_ThongTin không tồn tại, nút "Kiểm tra"
       không gắn xử lý. Tức danh sách check in không bao giờ hiện, "Kiểm tra"
       không làm gì, "Check In" gửi ID dòng check in ĐẦU TIÊN thay cho sinh viên.
       Ở đây: Kiểm tra → LayTTKiemTraThamGia → khối "Thông tin sinh viên";
       Check In gửi ID của dòng đó (strQLSV_NguoiHoc_Id) rồi nạp lại danh sách.
     · "Lưu" xác nhận tham gia: bản gốc gọi point.attr trên phần tử DOM → lỗi
       JS ngay dòng đầu, chưa lưu được lần nào. Ý định: đánh dấu mới → Them,
       bỏ dấu dòng đã xác nhận → Xoa (bản gốc viết nhầm thành xoá MỌI dòng đã
       xác nhận kể cả còn đánh dấu — không chép).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var C = 'SV_SuKien/';
    var root = document.getElementById('sk-theodoi');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function hoTen(r) { return e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN); }

    function kv(nhan, zone) { return '<div class="ums-kv"><span>' + esc(nhan) + '</span><b data-z="' + zone + '"></b></div>'; }
    root.innerHTML =
        '<div data-z="dsView">' +
            pat.page('Theo dõi sự kiện', '') +
            pat.filterBar([{ key: 'kh', label: 'Chọn kế hoạch', type: 'select' }]) +
            pat.panel({ title: 'Danh sách sự kiện', icon: 'fa-list-timeline', zone: 'ds', flush: true }) +
        '</div>' +
        '<div data-z="ciView" hidden>' +
            pat.page('Theo dõi sự kiện', '') +
            pat.panel({
                title: 'Check In', icon: 'fa-check-to-slot', count: 'ciTen',
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }),
                body:
                    '<div class="ums-filter">' +
                        '<div class="ums-field"><input class="ums-input" data-f="maDK" placeholder="Nhập mã đăng ký" autocomplete="off"></div>' +
                        '<div class="ums-field"><input class="ums-input" data-f="maSV" placeholder="Nhập mã sinh viên" autocomplete="off"></div>' +
                        '<div class="ums-field ums-field--fit">' + ui.btn('save', { text: 'Kiểm tra', icon: 'fa-check', attr: { 'data-a': 'kiemtra' } }) + '</div>' +
                    '</div>' +
                    '<div class="ums-legend ums-legend--cach">Thông tin sinh viên</div>' +
                    '<div class="ums-grid ums-grid--12">' +
                        '<div style="grid-column:span 2"><div class="ums-avatar is-empty" style="cursor:default" data-z="anhBox">' +
                            '<img alt="" data-z="anh"><i class="fa-light fa-user ums-avatar__none"></i></div></div>' +
                        '<div style="grid-column:span 5">' +
                            kv('Họ và tên', 'hoTen') + kv('Hệ đào tạo', 'he') + kv('Khóa đào tạo', 'khoa') +
                            kv('Chương trình đào tạo', 'ct') + kv('Lớp quản lý', 'lop') + kv('Tình trạng', 'tt') +
                        '</div>' +
                        '<div style="grid-column:span 5">' +
                            kv('Tình trạng đăng ký tham gia', 'ttdk') + kv('Mã số đăng ký', 'maDKv') + kv('Mã số', 'maSo') +
                            '<div class="ums-u-mt-4">' + ui.btn('save', { text: 'Check In', mod: 'out-success', icon: 'fa-location-check', attr: { 'data-a': 'checkin' } }) + '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="ums-legend ums-legend--cach">Danh sách check In</div>' +
                    '<div data-z="ci"></div>'
            }) +
        '</div>';
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }

    var dsSK = [], dangCI = null, svKiemTra = '';

    /* ---------- Danh sách sự kiện --------------------------------------- */
    function taiDs() {
        var kh = f('kh').value;
        z('ds').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: C + 'LayDSQLSV_SuKien_HoatDong', method: 'GET', strTuKhoa: '', strQLSV_SuKien_KeHoach_Id: kh, strNguoiThucHien_Id: uid() })
            .then(function (r) { dsSK = arr(r.data); veDs(); })
            .catch(function (err) { z('ds').innerHTML = ui.fail(err.message); ums.api.handle(err, 'tải sự kiện'); });
    }
    function nut(kind, id) {
        return '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm" data-ct="' + kind + '" data-id="' + esc(id) + '"><i class="fa-light fa-eye"></i>Chi tiết</button>';
    }
    function veDs() {
        ui.table({
            el: z('ds'), rows: dsSK, empty: 'Kế hoạch chưa có sự kiện',
            columns: [
                { title: 'Tên sự kiện', prop: 'TEN' },
                { title: 'Thời gian', cls: 'is-center', render: function (r) { return '<span data-tg="' + esc(r.ID) + '"></span>'; } },
                { title: 'Diễn giả', cls: 'is-center', render: function (r) { return '<span data-dg="' + esc(r.ID) + '"></span>'; } },
                { title: 'Tư liệu', cls: 'is-center', render: function (r) { return '<div data-tl="' + esc(r.ID) + '"></div>'; } },
                { title: 'Hình ảnh', cls: 'is-center', render: function (r) {
                    return r.HINHANHSUKIEN ? '<img src="' + esc(ums.files.url(r.HINHANHSUKIEN)) + '" alt="" style="max-height:100px">' : '';
                } },
                { title: 'Danh sách', cls: 'is-center', render: function (r) { return nut('ds', r.ID); } },
                { title: 'Thực hiện kiểm tra & Check in', cls: 'is-center', render: function (r) { return nut('ci', r.ID); } }
            ]
        });
        // Bản gốc nạp thời gian / diễn giả / tư liệu cho TỪNG dòng
        dsSK.forEach(function (r) {
            var p = { method: 'GET', strTuKhoa: '', strQLSV_SuKien_HoatDong_Id: r.ID, strNguoiThucHien_Id: uid(), silent: true };
            ums.api.call(Object.assign({ action: C + 'LayDSSuKien_HoatDong_ThoiGian' }, p)).then(function (x) {
                var el = root.querySelector('[data-tg="' + r.ID + '"]');
                if (el) el.innerHTML = arr(x.data).map(function (t) {
                    return esc(e(t.DIADIEM) + '(' + e(t.TUNGAY) + ' ' + e(t.GIOBATDAU) + 'h' + e(t.PHUTBATDAU) + ' - ' +
                        e(t.DENNGAY) + ' ' + e(t.GIOKETTHUC) + 'h' + e(t.PHUTKETTHUC) + ')');
                }).join('<br>');
            }).catch(function () {});
            ums.api.call(Object.assign({ action: C + 'LayDSSuKien_HoatDong_DienGia' }, p)).then(function (x) {
                var el = root.querySelector('[data-dg="' + r.ID + '"]');
                if (el) el.innerHTML = arr(x.data).map(function (d) { return '<b>' + esc(e(d.DIENGIA)) + '</b> (' + esc(e(d.MOTA)) + ')'; }).join('<br>');
            }).catch(function () {});
            var tl = root.querySelector('[data-tl="' + r.ID + '"]');
            if (tl) ums.files.mount(tl, { api: 'SV_Files', readonly: true }).load(r.ID);
        });
    }

    /* ---------- "Danh sách" — xác nhận tham gia ------------------------- */
    function danhSach(sk) {
        var rows = [];
        var dlg = ui.dialog({
            title: 'Danh sách đã đăng ký tham gia', icon: 'fa-users', size: 'xl',
            body: '<div data-z="xn">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>',
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function () { luu(); return false; } }]
        });
        var host = dlg.body.querySelector('[data-z="xn"]');
        function tai() {
            ums.api.call({ action: C + 'LayDSSuKien_KeHoach_DangKy', method: 'GET', strTuKhoa: '', strQLSV_SuKien_KeHoach_Id: f('kh').value,
                strQLSV_SuKien_HoatDong_Id: sk.ID, strQLSV_NguoiHoc_Id: '', strNguoiThucHien_Id: uid() }).then(function (r) {
                rows = arr(r.data);
                ui.table({
                    el: host, rows: rows, empty: 'Chưa có sinh viên đăng ký',
                    columns: [
                        { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                        { title: 'Tên', render: function (s) { return esc(hoTen(s)); } },
                        { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' },
                        { title: 'Ngành', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                        { title: 'Khóa', prop: 'DAOTAO_KHOAHOC_TEN' },
                        { title: 'Xác nhận tham gia', cls: 'is-center', width: '120px', render: function (s, i) {
                            return '<input type="checkbox" data-xn="' + i + '"' + (s.DAXACNHANTHAMGIA ? ' checked' : '') + '>';
                        } },
                        { title: 'Thời gian xác nhận', prop: 'THOIGIAN', cls: 'is-center is-nowrap' }
                    ]
                });
            }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'tải danh sách đăng ký'); });
        }
        function luu() {
            var them = [], xoa = [];
            Array.prototype.forEach.call(host.querySelectorAll('input[data-xn]'), function (c) {
                var s = rows[Number(c.getAttribute('data-xn'))];
                if (!s) return;
                if (c.checked && !s.DAXACNHANTHAMGIA) them.push(s);
                else if (!c.checked && s.DAXACNHANTHAMGIA) xoa.push(s);
            });
            if (!them.length && !xoa.length) { ui.toast('Không có thay đổi', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn đăng ký không?', { title: 'Xác nhận tham gia' }).then(function (yes) {
                if (!yes) return;
                var calls = them.map(function (s) {
                    return { action: C + 'Them_SuKien_KeHoach_ThamGia', method: 'POST', strQLSV_SuKien_KeHoach_Id: s.QLSV_SUKIEN_KEHOACH_ID,
                        strQLSV_NguoiHoc_Id: s.QLSV_NGUOIHOC_ID, strQLSV_SuKien_HoatDong_Id: s.QLSV_SUKIEN_HOATDONG_ID,
                        strNgayThamGia: '', dGioThamGia: '', dPhutThamGia: '', strNguoiThucHien_Id: uid() };
                }).concat(xoa.map(function (s) {
                    return { action: C + 'Xoa_SuKien_KeHoach_ThamGia', method: 'POST', strId: s.ID, strNguoiThucHien_Id: uid() };
                }));
                ui.batch(calls, { title: 'Đang lưu xác nhận tham gia', okText: 'Thực hiện thành công' }).then(tai);
            });
        }
        tai();
    }

    /* ---------- Check in ------------------------------------------------- */
    var NHAN = { hoTen: '', he: 'HEDAOTAO', khoa: 'KHOADAOTAO', ct: 'NGANHDAOTAO', lop: 'LOPQUANLY', tt: 'TINHTRANGSINHVIEN', ttdk: 'TINHTRANGDANGKY', maDKv: 'MASODANGKY', maSo: 'MASO' };
    function veSV(a) {
        a = a || {};
        Object.keys(NHAN).forEach(function (k) { z(k).textContent = k === 'hoTen' ? (a.ID ? e(a.HODEM) + ' ' + e(a.TEN) : '') : e(a[NHAN[k]]); });
        var box = z('anhBox'), img = z('anh');
        img.onload = function () { box.classList.remove('is-empty'); };
        img.onerror = function () { box.classList.add('is-empty'); };
        box.classList.add('is-empty');
        if (a.ANHCANHAN) img.src = ums.files.url(a.ANHCANHAN); else img.removeAttribute('src');
        svKiemTra = a.ID || '';
    }
    function taiCI() {
        z('ci').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: C + 'LayDSSuKien_KeHoach_ThamGia_CI', method: 'GET', strTuKhoa: '',
            strQLSV_SuKien_KeHoach_Id: dangCI.ID, strQLSV_SuKien_HoatDong_Id: f('kh').value,      // đảo tên như bản gốc
            strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 100000 }).then(function (r) {
            ui.table({
                el: z('ci'), rows: arr(r.data), empty: 'Chưa có ai check in',
                columns: [
                    { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                    { title: 'Họ tên', render: function (s) { return esc(hoTen(s)); } },
                    { title: 'Thời gian', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' },
                    { title: 'Đã đăng ký tham gia', prop: 'DANGKYTHAMGIA', cls: 'is-center' },
                    { title: 'Người check in', prop: 'NGUOITAO_TAIKHOAN', cls: 'is-center' }
                ]
            });
        }).catch(function (err) { z('ci').innerHTML = ui.fail(err.message); ums.api.handle(err, 'tải danh sách check in'); });
    }
    function kiemTra() {
        return ums.api.call({ action: C + 'LayTTKiemTraThamGia', method: 'GET', strMaSoNguoiHoc: f('maSV').value.trim(),
            strMaSoDangKy: f('maDK').value.trim(), strQLSV_SuKien_HoatDong_Id: dangCI.ID }).then(function (r) {
            var a = arr(r.data)[0];
            veSV(a);
            if (!a) ui.toast('Không tìm thấy sinh viên', 'warn');
        }).catch(function (err) { ums.api.handle(err, 'kiểm tra'); });
    }
    function checkIn() {
        if (!svKiemTra) { ui.toast('Nhập mã rồi bấm "Kiểm tra" trước khi check in', 'warn'); return; }
        ums.api.call({ action: C + 'Them_SuKien_KeHoach_ThamGia', method: 'POST', strQLSV_SuKien_KeHoach_Id: f('kh').value,
            strQLSV_NguoiHoc_Id: svKiemTra, strQLSV_SuKien_HoatDong_Id: dangCI.ID, strNguoiThucHien_Id: uid() }).then(function () {
            ui.toast('Thêm mới thành công!', 'ok');
            taiCI(); kiemTra();
        }).catch(function (err) { ums.api.handle(err, 'check in'); });
    }
    function moCI(sk) {
        dangCI = sk;
        z('ciTen').textContent = '— ' + e(sk.TEN);
        f('maDK').value = ''; f('maSV').value = '';
        veSV(null);
        ui.swap(z('dsView'), z('ciView'), { top: true });
        taiCI();
    }

    /* ---------- Sự kiện -------------------------------------------------- */
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-ct], [data-a]');
        if (!b) return;
        if (b.hasAttribute('data-ct')) {
            var sk = dsSK.filter(function (r) { return r.ID === b.getAttribute('data-id'); })[0];
            if (!sk) return;
            return b.getAttribute('data-ct') === 'ds' ? danhSach(sk) : moCI(sk);
        }
        var a = b.getAttribute('data-a');
        if (a === 'search') taiDs();
        else if (a === 'dong') { ui.swap(z('ciView'), z('dsView'), { top: true }); dangCI = null; }
        else if (a === 'kiemtra') kiemTra();
        else if (a === 'checkin') checkIn();
    });
    ['maDK', 'maSV'].forEach(function (k) {
        f(k).addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); kiemTra(); } });
    });
    if (window.jQuery) jQuery(f('kh')).on('select2:select', taiDs);

    ums.api.call({ action: C + 'LayDSQLSV_SuKien_KeHoach', method: 'GET', strTuKhoa: '', strNguoiThucHien_Id: uid() }).then(function (r) {
        var ds = arr(r.data);
        pat.fill(f('kh'), ds, { name: 'TENKEHOACH' });
        if (ds.length) { f('kh').value = ds[0].ID; if (window.jQuery) jQuery(f('kh')).trigger('change.select2'); }   // selectFirst
        taiDs();
    }).catch(function (err) { ums.api.handle(err, 'tải kế hoạch'); z('ds').innerHTML = ui.empty('Không tải được kế hoạch', 'fa-triangle-exclamation'); });
})();
