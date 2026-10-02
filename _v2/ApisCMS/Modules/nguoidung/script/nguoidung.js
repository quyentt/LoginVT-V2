/* =========================================================================
   Quản lý người dùng — tạo / sửa tài khoản, khởi tạo tài khoản hàng loạt,
   đặt lại mật khẩu, kế thừa phân quyền chức năng
   Bản gốc: ApisCMS/Modules/nguoidung/html/nguoidung.html + script/nguoidung.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (HAI cột, giữ nguyên):
     trái  (col-sm-3) — tìm kiếm · "Chọn điều kiện tìm kiếm" (Cán bộ / Sinh viên / Cựu sinh viên /
                       Gia đình / Đối tác) · "Danh sách người dùng" (ảnh, tên, email, nút xem; rê chuột =
                       thẻ thông tin)
     phải (col-sm-9) — SÁU vùng đổi chỗ nhau (toggle_overide "zone-bus-nd"):
        1. "Thông tin khởi tạo tài khoản Người dùng" (mặc định) — số tài khoản chờ khởi tạo theo loại + nút
           "Chi tiết"; nút "Thêm" (ở đây đưa lên đầu trang — BO-CUC luật 5)
        2. "Danh sách cán bộ" chờ khởi tạo — tìm, đánh dấu, "Kích hoạt tài khoản"
        3. "Danh sách sinh viên khởi tạo" — Hệ → Khoá → Chương trình → Lớp, tìm, "Kích hoạt tài khoản"
        4. "Chi tiết người dùng" — ảnh + 7 dòng thông tin; Reset mật khẩu · Kế thừa phân quyền chức năng ·
           Xác nhận kế thừa · Sửa thông tin; khung "Danh sách người dùng" để chọn người nhận kế thừa
        5. "Tạo mới tài khoản"      6. "Cập nhật tài khoản" (Đóng thì về vùng 4, như gốc)
     Hộp thoại "Cài lại mật khẩu" (Loại · Mật khẩu).
   Khung dùng chung: ums.cmsNd.dsNguoiDung (script/_chung.js), ums.ref.cascade (Hệ/Khoá/CT/Lớp —
   bản gốc gọi edu.system.getList_* KHÔNG lọc quyền, nên dùng bản không lọc quyền).

   Lời gọi (chép nguyên):
     CMS_QuanLyNguoiDung_MH · pkg_chung_quanlynguoidung.LayDanhSachNguoiDung  versionAPI v1.0, strTuKhoa,
         pageIndex, pageSize (10), dTrangThai 1, strChung_DonVi_Id "", strVaiTro_Id "", strPhanLoaiDoiTuong,
         strCapXuLy_Id "", strTinhThanh_Id ""   (bản cho khung kế thừa: y hệt, không có versionAPI)
     CMS_TaiKhoan/LaySoLuongTaiKhoanChuaKhoiTao (GET)  versionAPI v1.0 → CANBO, SINHVIEN, NCS, GIADINH, DOITAC
         — gọi lại sau MỖI lần nạp danh sách người dùng (như gốc)
     NS_HoSoV2/LayDanhSachNhanSuChuaTaoTK (GET)  strTuKhoa, strDonViChinhThuc_Id "" (ô dropAAAA không có), pageIndex, pageSize
     SV_HoSoHocVien/LayDanhSachSinhVienChuaKhoiTao (GET, type GET)  strTuKhoa, strDaoTao_HeDaoTao_Id,
         strDaoTao_KhoaDaoTao_Id, strDaoTao_ChuongTrinh_Id, strDaoTao_LopQuanLy_Id, dTrangThai 1, pageIndex, pageSize
     CMS_TaiKhoan/TaoMoiTaiKhoan (POST)
         · Tạo mới: strFirstName = Tên, strLastName = Họ (gốc đặt NGƯỢC tên như vậy — chép nguyên), strTaiKhoan,
           strPassWord, strEmail, strSoDienThoai, dTrangThai 1, dThoiHanDoiMatKhau 1, strNguoiThucHien_Id, strId "",
           strDonViId / strDiaChi / strQuyDinhDoiMatKhauId ""
         · Kích hoạt: strFirstName = HODEM, strLastName = TEN, strTaiKhoan = MASO, strPassWord "", strEmail =
           EMAIL_CANHAN, strSoDienThoai = SDT_CANHAN, dTrangThai 1, dThoiHanDoiMatKhau 1, strNguoiThucHien_Id,
           strId = ID dòng, strTenDayDu / strDonViId / strHinhDaiDien / strQuyDinhDoiMatKhauId / strDiaChi ""
     CMS_Custom/ResetPassword (POST)  strId, strLoaiThongTin (danh mục CMS.LRS), strNguoiThucHienId (KHÔNG có
         dấu gạch dưới — chép nguyên), strMatKhau (bỏ dấu cách)
     CMS_PhanQuyenDuLieu/KhoiTao_KeThua_Quyen (POST, type POST)  strNguoiDung_Id = người được đánh dấu,
         strNguoiDung_DungKeThua_Id = người đang xem, strNguoiThucHien_Id
     NS_CoCauToChuc/LayDanhSach (GET)  dTrangThai 1, strLoaiCoCauToChuc_Id "", strCoCauToChucCha_Id "" → ô Đơn vị
     CMS_QuanLyNguoiDung_MH · pkg_chung_quanlynguoidung.CapNhatThongTinTaiKhoan  strId, strTaiKhoan, strTenDayDu,
         strDonViId, dTrangThai, strEmail, dThoiHanDoiMatKhau, strQuyDinhDoiMatKhauId, strDiaChi, strSoDienThoai,
         strHinhDaiDien, strNguoiThucHien_Id — dTrangThai / dThoiHanDoiMatKhau là số KHÔNG được null (rỗng → 1 / 0)
     Danh mục: CMS.LRS (Loại — hộp Cài lại mật khẩu)

   Giữ như gốc:
     · Mở màn gửi strPhanLoaiDoiTuong "" (tất cả) dù ô "Cán bộ" tích sẵn trong html gốc (me.iNguoiDung_PhanLoai
       khởi tạo rỗng) → ở đây không tô sẵn loại nào, bấm một loại mới lọc theo loại đó.
     · Cột ẩn khi sửa đọc theo danh sách tên ưu tiên (pickField_NguoiDung): đơn vị CHUNG_DONVI_ID | DONVI_ID |
       DAOTAO_COCAUTOCHUC_ID, không có thì dò ngược từ TENDONVI; quy định CHUNG_QUYDINHDOIMATKHAU_ID |
       QUYDINHDOIMATKHAU_ID; thời hạn THOIHANPHAIDOIMATKHAU | THOIHANDOIMATKHAU.
     · Hộp Cài lại mật khẩu: chọn Loại thì ẩn ô Mật khẩu; mật khẩu điền sẵn số ngẫu nhiên 0…999999.
     · "Xác nhận kế thừa" không hỏi lại (gốc chạy ngay).
   Cố ý bỏ: nút "Chi tiết" của Nghiên cứu sinh / Phụ huynh / Đối tác (gốc chỉ gán strLoaiDoiTuong, không mở gì
     → giữ nút, khoá); delete_VaiTro / #btnDelete_VaiTro / rewrite (mã chép từ màn vai trò, không phần tử nào gọi);
     #btnResetPass_Email (rỗng); các hàm nạp năm học / thời gian / khoa quản lý / phạm vi (không ô nào dùng).
   Khác gốc:
     · Mỗi bảng có trang riêng (gốc dùng CHUNG edu.system.pageIndex_default nên lật trang bảng này làm lệch bảng kia).
     · Kích hoạt tra dòng trong CHÍNH bảng đang xem (gốc tra me.dtUser = bảng nạp gần nhất).
     · Tạo mới lưu xong quay về vùng 1 và nạp lại danh sách (gốc đứng yên ở biểu mẫu — bấm Lưu lần nữa là tạo trùng).
     · Hệ → Khoá → CT → Lớp: chưa chọn cha thì khoá con, đổi / xoá cha thì xoá trắng con (luật chung).
     · Enter ở ô tìm trái nạp lại khung kế thừa chỉ khi khung đó đang mở (gốc luôn gọi).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, N = ums.cmsNd;
    var root = document.getElementById('cmsnd-nguoidung');
    if (!root) return;
    function e(v) { return N.e(v); }
    function esc(s) { return ui.esc(s); }
    function uid() { return ums.session.userId; }

    var st = {
        loai: '', cur: null, dsDonVi: [],
        cb: { page: 1, size: 10, total: 0, rows: [] },
        sv: { page: 1, size: 10, total: 0, rows: [] },
        kt: { page: 1, size: 10, total: 0, rows: [] }
    };

    var LOAI = [
        { key: 'CANBO', label: 'Cán bộ' }, { key: 'SINHVIEN', label: 'Sinh viên' }, { key: 'CUUSINHVIEN', label: 'Cựu sinh viên' },
        { key: 'GIADINH', label: 'Gia đình' }, { key: 'DOITAC', label: 'Đối tác' }
    ];

    var m = pat.master({
        el: root,
        title: 'Quản lý người dùng',
        actions: ui.btn('add', { text: 'Thêm', attr: { 'data-a': 'them' } }),
        side: {
            title: 'Danh sách người dùng', icon: 'fa-address-book', search: 'Nhập từ khóa tìm kiếm',
            filter: '<div class="ums-u-fz13 ums-u-semi ums-u-mb-2">Chọn điều kiện tìm kiếm</div><div data-z="loai"></div>',
            page: { index: 1, size: 10, total: 0 }
        },
        main: { title: false }
    });

    function inp(label, k, req, extra) {
        return ui.field(label, '<input class="ums-input" data-k="' + k + '" autocomplete="off"' + (extra || '') + '>', { required: req });
    }
    function sel(k, ph) { return '<select class="ums-select" data-f="' + k + '" data-ph="' + esc(ph) + '"><option value=""></option></select>'; }
    function nutKichHoat(k) { return ui.btn('confirm', { text: 'Kích hoạt tài khoản', icon: 'fa-user-check', attr: { 'data-a': 'kichHoat', 'data-kh-bang': k } }); }
    var DONG = ui.btn('close', { attr: { 'data-a': 'dong' } });

    m.mainBody.innerHTML =
        /* 1. Thông tin khởi tạo */
        '<div data-v="ds">' + pat.panel({ title: 'Thông tin khởi tạo tài khoản Người dùng', icon: 'fa-circle-user', flush: true, zone: 'khoiTao' }) + '</div>' +
        /* 2. Cán bộ chờ khởi tạo */
        '<div data-v="cb" hidden>' + pat.panel({
            title: 'Danh sách cán bộ', icon: 'fa-users', tools: nutKichHoat('cb') + DONG,
            body: '<div class="ums-filter">' +
                      '<div class="ums-field"><input class="ums-input" data-f="cbQ" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                      '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'timCB' } }) + '</div>' +
                  '</div><div class="ums-u-mt-4" data-z="bCB"></div>'
        }) + '</div>' +
        /* 3. Sinh viên chờ khởi tạo */
        '<div data-v="sv" hidden>' + pat.panel({
            title: 'Danh sách sinh viên khởi tạo', icon: 'fa-user-graduate', tools: nutKichHoat('sv') + DONG,
            body: '<div class="ums-filter">' +
                      '<div class="ums-field">' + sel('he', '--Chọn hệ--') + '</div>' +
                      '<div class="ums-field">' + sel('khoa', '--Chọn khóa--') + '</div>' +
                      '<div class="ums-field">' + sel('ct', '--Chọn chương trình--') + '</div>' +
                      '<div class="ums-field">' + sel('lop', '--Chọn lớp--') + '</div>' +
                  '</div><div class="ums-filter ums-u-mt-3">' +
                      '<div class="ums-field"><input class="ums-input" data-f="svQ" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                      '<div class="ums-field ums-field--fit">' + ui.btn('search', { text: 'Tìm sinh viên', attr: { 'data-a': 'timSV' } }) + '</div>' +
                  '</div><div class="ums-u-mt-4" data-z="bSV">' + ui.empty('Chọn lớp hoặc bấm "Tìm sinh viên" để xem danh sách', 'fa-hand-pointer') + '</div>'
        }) + '</div>' +
        /* 4. Chi tiết người dùng */
        '<div data-v="ct" hidden>' + pat.panel({
            title: 'Chi tiết người dùng', icon: 'fa-address-card',
            tools: DONG,
            body: '<div class="cmsnd-hoso"><div data-z="ctAnh"></div><div data-z="ctTT"></div></div>',
            /* gốc đặt bốn nút ở box-footer, dạt phải */
            foot: '<div class="ums-row ums-row--end">' +
                   ui.btn('edit', { text: 'Reset mật khẩu', icon: 'fa-key', mod: 'out-warn', attr: { 'data-a': 'reset' } }) +
                   ui.btn('add', { text: 'Kế thừa phân quyền chức năng', icon: 'fa-user-gear', mod: 'out-success', attr: { 'data-a': 'keThua' } }) +
                   ui.btn('confirm', { text: 'Xác nhận kế thừa', attr: { 'data-a': 'xacNhanKT' } }) +
                   ui.btn('edit', { text: 'Sửa thông tin', attr: { 'data-a': 'sua' } }) + '</div>'
        }) +
        '<div data-z="ktKhung" hidden>' + pat.panel({ title: 'Danh sách người dùng', icon: 'fa-users-between-lines', count: 'ktN', flush: true, zone: 'bKT' }) + '</div>' +
        '</div>' +
        /* 5. Tạo mới tài khoản */
        '<div data-v="them" hidden>' + pat.panel({
            title: 'Tạo mới tài khoản', icon: 'fa-user-plus', tools: DONG + ui.btn('save', { attr: { 'data-a': 'luuMoi' } }),
            body: '<div class="cmsnd-hoso" data-z="fMoi"><div>' + N.anh('', 'cmsnd-ava--lon') + '</div><div class="ums-grid ums-grid--2">' +
                inp('Họ', 'ho', true) + inp('Tên', 'ten', true) + inp('Tài khoản', 'tk', true) + inp('Mật khẩu', 'mk', true) +
                inp('Email', 'email', true) + inp('Điện thoại', 'dt', false) + '</div></div>'
        }) + '</div>' +
        /* 6. Cập nhật tài khoản */
        '<div data-v="sua" hidden>' + pat.panel({
            title: 'Cập nhật tài khoản', icon: 'fa-pen-to-square', count: 'suaTen', tools: DONG + ui.btn('save', { attr: { 'data-a': 'luuSua' } }),
            body: '<div class="cmsnd-hoso" data-z="fSua"><div data-z="suaAnh"></div><div class="ums-grid ums-grid--2">' +
                inp('Tài khoản', 'tk', true) + inp('Họ và tên', 'hoTen', true) + inp('Email', 'email', false) + inp('Điện thoại', 'dt', false) +
                '<div class="cmsnd-full">' + ui.field('Đơn vị', sel('donVi', '--Chọn đơn vị--')) + '</div>' +
                '<div class="cmsnd-full">' + inp('Địa chỉ', 'diaChi', false) + '</div>' +
                ui.field('Trạng thái', '<select class="ums-select" data-f="trangThai" data-required><option value="1">Đang hoạt động</option><option value="0">Ngừng hoạt động</option></select>') +
                inp('Hạn đổi mật khẩu', 'thoiHan', false, ' type="number" min="0"') +
                '</div></div>'
        }) + '</div>';

    var P = m.mainBody;
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function k(form, key) { return z(form).querySelector('[data-k="' + key + '"]'); }
    ui.enhance(root);

    var vung = 'ds';
    function hien(v) {
        if (v === vung) return;
        ui.swap(P.querySelector('[data-v="' + vung + '"]'), P.querySelector('[data-v="' + v + '"]'));
        vung = v;
    }

    /* ---------- 1. Số tài khoản chờ khởi tạo ---------- */
    var KT = [
        ['CANBO', 'Danh sách tài khoản Cán bộ chờ khởi tạo', 'cb'],
        ['SINHVIEN', 'Danh sách tài khoản Sinh viên chờ khởi tạo', 'sv'],
        ['NCS', 'Danh sách tài khoản Nghiên cứu sinh chờ khởi tạo', ''],
        ['GIADINH', 'Danh sách tài khoản Phụ huynh chờ khởi tạo', ''],
        ['DOITAC', 'Danh sách Đối tác chờ khởi tạo', '']
    ];
    function napSoLuong() {
        ums.api.call({ action: 'CMS_TaiKhoan/LaySoLuongTaiKhoanChuaKhoiTao', method: 'GET', versionAPI: 'v1.0' }).then(function (r) {
            var d = N.rows(r)[0] || {};
            ui.table({
                el: z('khoiTao'), stt: false,
                rows: KT.map(function (x) { return { k: x[0], ten: x[1], v: x[2], n: d[x[0]] }; }),
                columns: [
                    { title: 'Danh sách', render: function (x) { return '<i class="fa-light fa-angle-right"></i> ' + esc(x.ten); } },
                    { title: 'Số lượng', cls: 'is-center', width: '120px', render: function (x) { return ui.badge(e(x.n), 'info'); } },
                    { title: '', cls: 'is-center is-actions', width: '140px', render: function (x) {
                        var b = ui.btn('view', { text: 'Chi tiết', icon: 'fa-eye', attr: { 'data-a': 'chiTiet', 'data-kt': x.v } });
                        return x.v ? b : b.replace('<button ', '<button disabled title="Bản gốc chưa có xử lý" ');
                    } }
                ]
            });
        }).catch(function (err) {
            z('khoiTao').innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'số tài khoản chờ khởi tạo');
        });
    }

    /* ---------- 2 + 3. Cán bộ / sinh viên chờ khởi tạo ---------- */
    function veKhoiTao(k) {
        var s = st[k];
        ui.table({
            el: z(k === 'cb' ? 'bCB' : 'bSV'), rows: s.rows, empty: 'Không có dữ liệu',
            page: { index: s.page, size: s.size, total: s.total,
                    onChange: function (p) { if (p >= 1 && p <= Math.ceil(s.total / s.size)) napKhoiTao(k, p); },
                    onSize: function (v) { s.size = v; napKhoiTao(k, 1); } },
            columns: [
                { title: 'Mã', prop: 'MASO', cls: 'is-nowrap' },
                { title: 'Tên', prop: 'HOTEN' },
                { title: 'Ngày sinh', prop: 'NGAYSINHDAYDU', cls: 'is-center is-nowrap' },
                { title: 'Số điện thoại', prop: 'SDT_CANHAN', cls: 'is-center is-nowrap' },
                { head: '<input type="checkbox" data-kh="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                  render: function (r) { return '<input type="checkbox" data-kh="' + esc(r.ID) + '">'; } }
            ]
        });
    }
    function napKhoiTao(k, page) {
        var s = st[k];
        if (page) s.page = page;
        var call = k === 'cb'
            ? { action: 'NS_HoSoV2/LayDanhSachNhanSuChuaTaoTK', method: 'GET', strTuKhoa: f('cbQ').value, strDonViChinhThuc_Id: '',
                pageIndex: s.page, pageSize: s.size }
            : { action: 'SV_HoSoHocVien/LayDanhSachSinhVienChuaKhoiTao', method: 'GET', type: 'GET', strTuKhoa: f('svQ').value,
                strDaoTao_HeDaoTao_Id: f('he').value, strDaoTao_KhoaDaoTao_Id: f('khoa').value, strDaoTao_ChuongTrinh_Id: f('ct').value,
                strDaoTao_LopQuanLy_Id: f('lop').value, dTrangThai: 1, pageIndex: s.page, pageSize: s.size };
        var el = z(k === 'cb' ? 'bCB' : 'bSV');
        el.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call(call).then(function (r) {
            s.rows = N.rows(r);
            s.total = Number(r.pager) || s.rows.length;
            veKhoiTao(k);
        }).catch(function (err) {
            el.innerHTML = ui.fail(err.message);
            ums.api.handle(err, k === 'cb' ? 'cán bộ chờ khởi tạo' : 'sinh viên chờ khởi tạo');
        });
    }
    function kichHoat(k) {
        var s = st[k];
        var el = z(k === 'cb' ? 'bCB' : 'bSV');
        var ids = N.qa(el, 'tbody input[data-kh]:checked').map(function (c) { return c.getAttribute('data-kh'); });
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần kích hoạt?', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn kích hoạt tài khoản không?').then(function (yes) {
            if (!yes) return;
            var calls = ids.map(function (id) {
                var d = s.rows.filter(function (r) { return r.ID === id; })[0] || {};
                return { action: 'CMS_TaiKhoan/TaoMoiTaiKhoan', strFirstName: d.HODEM, strLastName: d.TEN, strTaiKhoan: d.MASO,
                         strPassWord: '', strEmail: d.EMAIL_CANHAN, strSoDienThoai: d.SDT_CANHAN, dTrangThai: 1, dThoiHanDoiMatKhau: 1,
                         strNguoiThucHien_Id: uid(), strId: d.ID, strTenDayDu: '', strDonViId: '', strHinhDaiDien: '',
                         strQuyDinhDoiMatKhauId: '', strDiaChi: '' };
            });
            ui.batch(calls, { title: 'Đang kích hoạt tài khoản', okText: 'Thêm mới thành công!' }).then(function () { napKhoiTao(k); });
        });
    }
    /* Ô "chọn tất cả" của từng bảng (checkedAll_BgRow) */
    P.addEventListener('change', function (ev) {
        var t = ev.target;
        if (!t.matches) return;
        if (t.matches('thead input[data-kh="all"], thead input[data-kt="all"]')) {
            var attr = t.hasAttribute('data-kh') ? 'data-kh' : 'data-kt';
            N.qa(t.closest('table'), 'tbody input[' + attr + ']').forEach(function (c) {
                c.checked = t.checked;
                var tr = c.closest('tr'); if (tr) tr.classList.toggle('is-selected', t.checked);
            });
        } else if (t.matches('tbody input[data-kh], tbody input[data-kt]')) {
            var tr2 = t.closest('tr'); if (tr2) tr2.classList.toggle('is-selected', t.checked);
        }
    });

    /* Hệ → Khoá → Chương trình → Lớp (edu.system.getList_* — không lọc quyền); chọn Lớp thì nạp sinh viên */
    ums.ref.cascade({
        he: f('he'), khoa: f('khoa'), ct: f('ct'), lop: f('lop'),
        labels: { he: '--Chọn hệ--', khoa: '--Chọn khóa--', ct: '--Chọn chương trình--', lop: '--Chọn lớp--' },
        onChange: function (v, level) { if (level === 'lop' && v.lop) napKhoiTao('sv', 1); }
    });

    /* ---------- 4. Chi tiết + kế thừa ---------- */
    function veChiTiet() {
        var d = st.cur || {};
        z('ctAnh').innerHTML = N.anh(d.HINHDAIDIEN, 'cmsnd-ava--lon');
        z('ctTT').innerHTML = [
            ['Họ và tên', String(e(d.TENDAYDU)).toUpperCase()], ['Tài khoản', d.TAIKHOAN], ['Email', d.EMAIL],
            ['Điện thoại', d.SODIENTHOAI], ['Đơn vị', d.TENDONVI], ['Hạn mật khẩu', d.THOIHANPHAIDOIMATKHAU],
            ['Lịch sử truy cập', d.NGAYCN_GAN_DD_MM_YYYY]
        ].map(function (x) { return '<div class="ums-kv"><span>' + esc(x[0]) + '</span><b>' + esc(e(x[1])) + '</b></div>'; }).join('');
    }
    function napKeThua(page) {
        var s = st.kt;
        if (page) s.page = page;
        z('bKT').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({
            action: 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikPJjQuKAU0LyYP', func: 'pkg_chung_quanlynguoidung.LayDanhSachNguoiDung',
            strTuKhoa: (m.search.value || '').trim(), pageIndex: s.page, pageSize: s.size, dTrangThai: 1, strChung_DonVi_Id: '',
            strVaiTro_Id: '', strPhanLoaiDoiTuong: st.loai, strCapXuLy_Id: '', strTinhThanh_Id: ''
        }).then(function (r) {
            s.rows = N.rows(r);
            s.total = Number(r.pager) || s.rows.length;
            z('ktN').textContent = '(' + s.total + ')';
            ui.table({
                el: z('bKT'), rows: s.rows, empty: 'Không có người dùng',
                page: { index: s.page, size: s.size, total: s.total,
                        onChange: function (p) { if (p >= 1 && p <= Math.ceil(s.total / s.size)) napKeThua(p); },
                        onSize: function (v) { s.size = v; napKeThua(1); } },
                columns: [
                    { title: 'Mã', prop: 'TAIKHOAN', cls: 'is-nowrap' },
                    { title: 'Tên', prop: 'TENDAYDU' },
                    { head: '<input type="checkbox" data-kt="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                      render: function (x) { return '<input type="checkbox" data-kt="' + esc(x.ID) + '">'; } }
                ]
            });
        }).catch(function (err) {
            z('bKT').innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'danh sách người dùng kế thừa');
        });
    }
    function xacNhanKeThua() {
        var ids = N.qa(z('bKT'), 'tbody input[data-kt]:checked').map(function (c) { return c.getAttribute('data-kt'); });
        if (z('ktKhung').hidden || !ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
        var nguon = st.cur.ID;
        ui.batch(ids.map(function (id) {
            return { action: 'CMS_PhanQuyenDuLieu/KhoiTao_KeThua_Quyen', type: 'POST', strNguoiDung_Id: id,
                     strNguoiDung_DungKeThua_Id: nguon, strNguoiThucHien_Id: uid() };
        }), { title: 'Đang kế thừa phân quyền', okText: 'Thêm mới thành công!' });
    }
    function resetMatKhau() {
        var dlg = ui.dialog({
            title: 'Cài lại mật khẩu', icon: 'fa-key', size: 'md',
            body: '<div class="ums-stack">' +
                ui.field('Loại', '<select class="ums-select" data-r="loai" data-ph="Chọn loại"><option value=""></option></select>', { inline: true }) +
                '<div data-r="dongMk">' + ui.field('Mật khẩu', '<input class="ums-input" data-r="mk" autocomplete="off">', { inline: true }) + '</div></div>',
            buttons: [{ text: 'Lưu', kind: 'save', icon: 'fa-circle-check', onClick: function (d) {
                var loai = d.body.querySelector('[data-r="loai"]').value;
                ums.api.call({
                    action: 'CMS_Custom/ResetPassword', strId: st.cur.ID, strLoaiThongTin: loai,
                    strNguoiThucHienId: uid(), strMatKhau: String(d.body.querySelector('[data-r="mk"]').value || '').replace(/ /g, '')
                }).then(function () { ui.toast('Reset mật khẩu thành công', 'ok'); d.close(); })
                  .catch(function (err) { ums.api.handle(err, 'User/ResetPassword'); });
                return false;
            } }]
        });
        var B = dlg.body;
        B.querySelector('[data-r="mk"]').value = String(Math.floor(Math.random() * 1000000));
        var oLoai = B.querySelector('[data-r="loai"]');
        ui.enhance(B);
        ums.api.dm('CMS.LRS').then(function (ds) { pat.fill(oLoai, ds, { name: 'TEN' }); })
            .catch(function (err) { ums.api.handle(err, 'danh mục CMS.LRS'); });
        jQuery(oLoai).on('select2:select select2:clear', function () {
            B.querySelector('[data-r="dongMk"]').hidden = !!oLoai.value;
        });
    }

    /* ---------- 5. Tạo mới ---------- */
    function batBuoc(form, list) {
        for (var i = 0; i < list.length; i++) {
            var el = k(form, list[i][0]);
            if (!String(el.value || '').trim()) {
                ui.toast('Vui lòng nhập ' + list[i][1] + '!', 'warn');
                el.focus();
                return false;
            }
        }
        return true;
    }
    function moTaoMoi() {
        N.qa(z('fMoi'), '[data-k]').forEach(function (x) { x.value = ''; });
        hien('them');
        k('fMoi', 'ho').focus();
    }
    function luuMoi() {
        if (!batBuoc('fMoi', [['ho', 'Họ'], ['ten', 'Tên'], ['tk', 'Tài khoản'], ['mk', 'Mật khẩu'], ['email', 'Email']])) return;
        ums.api.call({
            action: 'CMS_TaiKhoan/TaoMoiTaiKhoan',
            strFirstName: k('fMoi', 'ten').value, strLastName: k('fMoi', 'ho').value, strTaiKhoan: k('fMoi', 'tk').value,
            strPassWord: k('fMoi', 'mk').value, strEmail: k('fMoi', 'email').value, strSoDienThoai: k('fMoi', 'dt').value,
            dTrangThai: 1, dThoiHanDoiMatKhau: 1, strNguoiThucHien_Id: uid(), strId: '',
            strDonViId: '', strDiaChi: '', strQuyDinhDoiMatKhauId: ''
        }).then(function () {
            ui.toast('Thêm mới thành công!', 'ok');
            hien('ds');
            ds.nap(1);
        }).catch(function (err) { ums.api.handle(err, 'CMS_NguoiDung/ThemMoi'); });
    }

    /* ---------- 6. Cập nhật ---------- */
    function lay(o, keys) {
        for (var i = 0; i < keys.length; i++) if (o[keys[i]] !== undefined && o[keys[i]] !== null) return o[keys[i]];
        return '';
    }
    function moSua() {
        var d = st.cur;
        if (!d) { ui.toast('Vui lòng chọn đối tượng!', 'warn'); return; }
        var donVi = lay(d, ['CHUNG_DONVI_ID', 'DONVI_ID', 'DAOTAO_COCAUTOCHUC_ID']);
        if (!donVi && d.TENDONVI) {
            var t = st.dsDonVi.filter(function (x) { return x.TEN === d.TENDONVI; })[0];
            if (t) donVi = t.ID;
        }
        st.sua = { id: e(d.ID), anh: e(d.HINHDAIDIEN), quyDinh: lay(d, ['CHUNG_QUYDINHDOIMATKHAU_ID', 'QUYDINHDOIMATKHAU_ID']) };
        var tt = lay(d, ['TRANGTHAI']);
        z('suaTen').textContent = e(d.TENDAYDU) + ' (' + e(d.TAIKHOAN) + ')';
        z('suaAnh').innerHTML = N.anh(d.HINHDAIDIEN, 'cmsnd-ava--lon');
        k('fSua', 'tk').value = e(d.TAIKHOAN);
        k('fSua', 'hoTen').value = e(d.TENDAYDU);
        k('fSua', 'email').value = e(d.EMAIL);
        k('fSua', 'dt').value = e(d.SODIENTHOAI);
        k('fSua', 'diaChi').value = lay(d, ['DIACHI']);
        k('fSua', 'thoiHan').value = lay(d, ['THOIHANPHAIDOIMATKHAU', 'THOIHANDOIMATKHAU']);
        f('trangThai').value = tt !== '' ? String(tt) : '1';
        f('donVi').value = donVi;
        jQuery([f('trangThai'), f('donVi')]).trigger('change.select2');
        hien('sua');
        k('fSua', 'hoTen').focus();
    }
    function luuSua() {
        if (!batBuoc('fSua', [['tk', 'Tài khoản'], ['hoTen', 'Họ và tên']])) return;
        var s = st.sua || {};
        if (!s.id) { ui.toast('Vui lòng chọn đối tượng!', 'warn'); return; }
        var iTT = parseInt(f('trangThai').value, 10), iTH = parseInt(k('fSua', 'thoiHan').value, 10);
        if (isNaN(iTT)) iTT = 1;
        if (isNaN(iTH)) iTH = 0;
        var o = {
            action: 'CMS_QuanLyNguoiDung_MH/AiAxDykgNRUpLi8mFSgvFSAoCikuIC8P', func: 'pkg_chung_quanlynguoidung.CapNhatThongTinTaiKhoan',
            strId: s.id, strTaiKhoan: k('fSua', 'tk').value, strTenDayDu: k('fSua', 'hoTen').value, strDonViId: f('donVi').value,
            dTrangThai: iTT, strEmail: k('fSua', 'email').value, dThoiHanDoiMatKhau: iTH, strQuyDinhDoiMatKhauId: s.quyDinh,
            strDiaChi: k('fSua', 'diaChi').value, strSoDienThoai: k('fSua', 'dt').value, strHinhDaiDien: s.anh, strNguoiThucHien_Id: uid()
        };
        ums.api.call(o).then(function () {
            ui.toast('Cập nhật thành công!', 'ok');
            if (st.cur) {
                st.cur.TAIKHOAN = o.strTaiKhoan; st.cur.TENDAYDU = o.strTenDayDu; st.cur.EMAIL = o.strEmail;
                st.cur.SODIENTHOAI = o.strSoDienThoai; st.cur.THOIHANPHAIDOIMATKHAU = o.dThoiHanDoiMatKhau;
                var opt = f('donVi').options[f('donVi').selectedIndex];
                st.cur.TENDONVI = opt && opt.value ? opt.text : '';
                veChiTiet();
            }
            ds.nap();
            hien('ct');
        }).catch(function (err) { ums.api.handle(err, 'pkg_chung_quanlynguoidung.CapNhatThongTinTaiKhoan'); });
    }

    /* ---------- Sự kiện ---------- */
    root.addEventListener('click', function (ev) {
        var chip = ev.target.closest('[data-z="loai"] [data-chip]');
        if (chip) {
            st.loai = chip.getAttribute('data-chip');
            veLoai();
            ds.nap(1);
            return;
        }
        var a = ev.target.closest('[data-a]');
        if (!a || a.disabled) return;
        switch (a.getAttribute('data-a')) {
            case 'them': moTaoMoi(); break;
            case 'dong': hien(vung === 'sua' ? 'ct' : 'ds'); break;
            case 'chiTiet':
                if (a.getAttribute('data-kt') === 'cb') { hien('cb'); napKhoiTao('cb', 1); }
                else if (a.getAttribute('data-kt') === 'sv') hien('sv');
                break;
            case 'timCB': napKhoiTao('cb', 1); break;
            case 'timSV': napKhoiTao('sv', 1); break;
            case 'kichHoat': kichHoat(a.getAttribute('data-kh-bang')); break;
            case 'reset': resetMatKhau(); break;
            case 'keThua': ui.reveal(z('ktKhung')); napKeThua(1); break;
            case 'xacNhanKT': xacNhanKeThua(); break;
            case 'sua': moSua(); break;
            case 'luuMoi': luuMoi(); break;
            case 'luuSua': luuSua(); break;
        }
    });
    root.addEventListener('keydown', function (ev) {
        if (ev.key !== 'Enter') return;
        if (ev.target === f('cbQ')) { ev.preventDefault(); napKhoiTao('cb', 1); }
        else if (ev.target === f('svQ')) { ev.preventDefault(); napKhoiTao('sv', 1); }
        else if (ev.target === m.search && !z('ktKhung').hidden) napKeThua(1);
    });

    function veLoai() { z('loai').innerHTML = ui.chips(LOAI, st.loai); }
    veLoai();

    /* Đơn vị cho biểu mẫu sửa (getList_DonVi) */
    ums.api.call({ action: 'NS_CoCauToChuc/LayDanhSach', method: 'GET', dTrangThai: 1, strLoaiCoCauToChuc_Id: '', strCoCauToChucCha_Id: '' })
        .then(function (r) { st.dsDonVi = N.rows(r); pat.fill(f('donVi'), st.dsDonVi, { name: 'TEN' }); })
        .catch(function (err) { ums.api.handle(err, 'NS_CoCauToChuc/LayDanhSach'); });

    var ds = N.dsNguoiDung(m, {
        goi: function (tk, page, size) {
            return { action: 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikPJjQuKAU0LyYP', func: 'pkg_chung_quanlynguoidung.LayDanhSachNguoiDung',
                     versionAPI: 'v1.0', strTuKhoa: tk, pageIndex: page, pageSize: size, dTrangThai: 1, strChung_DonVi_Id: '',
                     strVaiTro_Id: '', strPhanLoaiDoiTuong: st.loai, strCapXuLy_Id: '', strTinhThanh_Id: '' };
        },
        onChon: function (r) {
            st.cur = r;
            veChiTiet();
            hien('ct');
        },
        sau: napSoLuong
    });
    ds.nap(1);
})();
