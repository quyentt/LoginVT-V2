/* =========================================================================
   Lớp học (danh sách học — danh sách nhập điểm theo học phần)
   Bản gốc: ApisDangKyHoc/Modules/kehoachdangky/html/lophoc.html + script/lophoc.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột, ba vùng thay chỗ nhau):
     1. Danh sách: tìm kiếm (Loại danh sách · Thời gian · Học phần · Tìm kiếm / "Chọn trạng thái
        sinh viên") → khung "Danh sách (n)" + nút "Tạo danh sách nhập điểm": Mã danh sách · Tên
        danh sách · Số lượng · Sửa (phân trang máy chủ, 10 dòng, không đổi cỡ trang).
     2. Bấm Sửa → "Thêm mới - <tên danh sách> - <học phần>": bảng "Danh sách sinh viên đã thêm"
        (ô đánh dấu, nút Xóa) → thanh lọc Hệ · Khoá · Chương trình · Lớp · Kết quả · Tìm kiếm →
        bảng "Danh sách sinh viên chưa thêm" (ô đánh dấu, phân trang) → Import; nút Lưu thêm các
        sinh viên đã đánh dấu vào danh sách.
     3. "Tạo danh sách nhập điểm": Hệ · Khoá · Chương trình · Thời gian → HAI CỘT: Danh sách lớp
        quản lý (ô đánh dấu) | Danh sách học phần (nút Tìm kiếm = học phần chung của các lớp đã
        đánh dấu; ô đánh dấu); Lưu tạo một danh sách cho MỖI cặp lớp × học phần.

   Lời gọi (kiểu cũ, không mã hoá, chép nguyên; gốc để 'type' trong dữ liệu ở những lời gọi có ghi):
       D_LoaiDanhSach/LayLoaiDanhSach        GET  ô Loại danh sách (type)
       D_ThoiGian/LayDanhSach                GET  ô Thời gian (strLoaiDanhSach_Id = ô Loại lúc mở màn)
       D_HocPhan/LayDanhSach                 GET  ô Học phần (ba tham số lọc đọc ô *1 không tồn tại → '')
       D_Hoc/LayDanhSach                     GET  danh sách (phân trang)
       D_NguoiHoc/LayDanhSach                GET  sinh viên chưa thêm (type; phân trang)
       D_Hoc_NguoiHoc/LayDanhSach            GET  sinh viên đã thêm
       D_NguoiHoc/ThemMoi                    POST Lưu — từng sinh viên (type; LOP_ID, NGANH_ID, ID)
       D_NguoiHoc/Xoa                        POST Xóa — từng dòng đã thêm (strDiem_DanhSach_NguoiHoc_Id)
       D_HocPhanCungChuongTrinh/LayDanhSach  POST học phần chung (type GET; strDSLopQuanLy_Id nối dấu phẩy)
       D_Hoc/Tao_Diem_DanhSachHoc            POST tạo danh sách nhập điểm (type; mỗi lớp × học phần)
       edu.system.getList_HeDaoTao / KhoaDaoTao / ChuongTrinhDaoTao / LopQuanLy (bản Corei — ums.dkhLop.dt)
       edu.system.getList_ThoiGianDaoTao     = ums.ref.thoiGianDaoTao (pageSize 100000)
       danh mục DIEM.DANHGIA (ô Kết quả), QLSV.TRANGTHAI (trạng thái sinh viên)
   Import: ums.report.mount — gốc gọi getList_MauImport("zonebtnLopHoc") nhưng html CHỈ có vùng
   "zonebtnLopHoc_Import" (đặt dưới bảng sinh viên chưa thêm) → chỉ hiện nút Import (css/_lop.css
   ẩn nút Xuất báo cáo). collect() thêm đúng như gốc: mỗi trạng thái đánh dấu một
   strTrangThaiNguoiHoc_Id, rồi strDaoTao_LopQuanLy_Id '', strDaoTao_ThoiGianDaoTao_Id,
   strDaoTao_HocPhan_Id, strTrangThai_Id '', strDangKy_KeHoachDangKy_Id '', strLoaiDanhSach_Id,
   strNguoiDung_Id ''.

   Khác bản gốc:
     · Hệ → Khoá → Chương trình → Lớp (vùng 2) và Hệ → Khoá → Chương trình (vùng 3): chưa chọn tầng
       trên thì KHOÁ tầng dưới, đổi / xoá tầng trên thì xoá trắng tầng dưới (luật chung 2026-09-21).
       Xoá Hệ/Khoá/CT ở vùng 3 cũng nạp lại bảng lớp quản lý (gốc chỉ bắt lúc chọn).
     · Hai bảng sinh viên và bảng danh sách phân trang RIÊNG (gốc dùng chung một biến trang toàn cục).
     · Nút Lưu / Xóa: hỏi lại một lần rồi chạy tuần tự có tiến độ (gốc gắn thêm trình xử lý #btnYes
       mỗi lần bấm → bấm lần thứ hai là gửi hai lần).
   Cố ý bỏ: các trình xử lý của ô không có trong html (dropSearch_NguoiThu / KhoaQuanLy / NamNhapHoc /
   dropLopHoc_Loai → me.getList_HinhThuc không tồn tại), nút .btnAdd (không có trong html).
   Nghi ngờ (giữ như gốc): ô Thời gian chỉ nạp MỘT lần lúc mở màn với strLoaiDanhSach_Id rỗng, đổi
   Loại danh sách không nạp lại Thời gian; Lưu xong chỉ nạp lại bảng "đã thêm" (bảng "chưa thêm"
   giữ nguyên).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, L = ums.dkhLop, e = L.e, esc = ui.esc;
    var root = document.getElementById('dkh-lophoc');
    if (!root) return;

    function s1(k, ph) { return '<div class="ums-field"><select class="ums-select" data-f="' + k + '"><option value="">' + ph + '</option></select></div>'; }
    var cotKQ = [
        { title: 'Điểm hệ 10', prop: 'DIEM', cls: 'is-center', group: ['Kết quả học tập'] },
        { title: 'Điểm hệ 4', prop: 'DIEMQUYDOI', cls: 'is-center', group: ['Kết quả học tập'] },
        { title: 'Điểm chữ', prop: 'DIEMCHU', cls: 'is-center', group: ['Kết quả học tập'] },
        { title: 'Đánh giá', prop: 'DANHGIA_TEN', cls: 'is-center', group: ['Kết quả học tập'] },
        { title: 'Lần học', prop: 'LANHOC', cls: 'is-center', group: ['Kết quả học tập'] },
        { title: 'Lần thi', prop: 'LANTHI', cls: 'is-center', group: ['Kết quả học tập'] }
    ];

    root.innerHTML =
        /* 1. Danh sách */
        '<div data-z="ds">' +
        pat.page('Lớp học', ui.btn('add', { text: 'Tạo danh sách nhập điểm', attr: { 'data-a': 'moTao' } })) +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            '<div class="ums-filter">' +
                s1('loai', 'Chọn loại danh sách') + s1('tg', 'Chọn thời gian') + s1('hp', 'Chọn học phần') +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
            '</div>' +
            '<div class="ums-legend ums-legend--cach ums-u-mb-2">Chọn trạng thái sinh viên</div>' +
            '<div data-z="tt"></div>' }) +
        pat.panel({ title: 'Danh sách', icon: 'fa-screen-users', count: 'n', flush: true, zone: 'bang' }) +
        '</div>' +
        /* 2. Thêm sinh viên vào danh sách */
        '<div data-z="sua" hidden>' +
        pat.panel({ title: 'Thêm mới - ', icon: 'fa-plus', cls: 'ums-lop-sua',
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) + ui.btn('save', { attr: { 'data-a': 'luuSV' } }),
            body:
                '<div data-z="khDa">' +
                    '<div class="ums-legend ums-u-mb-2">Danh sách sinh viên đã thêm</div>' +
                    '<div data-z="bDa"></div>' +
                    '<div class="ums-tablefoot ums-lop-phai">' + ui.xoaChon('input[data-lck="da"]', { goc: '[data-z="khDa"]', text: 'Xóa', attr: { 'data-a': 'xoaSV' } }) + '</div>' +
                '</div>' +
                '<div class="ums-filter ums-u-mt-5">' +
                    s1('he', 'Chọn hệ đào tạo') + s1('khoa', 'Chọn khóa đào tạo') + s1('ct', 'Chọn chương trình') + s1('lop', 'Chọn lớp') +
                '</div><div class="ums-filter ums-u-mt-4">' +
                    s1('kq', 'Chọn kết quả') +
                    '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'timSV' } }) + '</div>' +
                '</div>' +
                '<div class="ums-legend ums-legend--cach ums-u-mb-2">Danh sách sinh viên chưa thêm</div>' +
                '<div data-z="bChua"></div>' +
                '<div class="ums-tablefoot ums-lop-chiimport" data-z="imp"></div>' }) +
        '</div>' +
        /* 3. Tạo danh sách nhập điểm */
        '<div data-z="tao" hidden>' +
        pat.panel({ title: 'Tạo danh sách nhập điểm', icon: 'fa-plus',
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) + ui.btn('save', { attr: { 'data-a': 'luuTao' } }),
            body:
                '<div class="ums-filter">' +
                    s1('he2', 'Chọn hệ đào tạo') + s1('khoa2', 'Chọn khóa đào tạo') + s1('ct2', 'Chọn chương trình') + s1('tg2', 'Chọn thời gian') +
                '</div>' +
                '<div class="ums-grid ums-grid--2 ums-u-mt-5">' +
                    '<div><div class="ums-lop-dau ums-u-mb-2"><div class="ums-legend">Danh sách lớp quản lý</div></div><div data-z="bLQL"></div></div>' +
                    '<div><div class="ums-lop-dau ums-u-mb-2"><div class="ums-legend">Danh sách học phần</div>' +
                        ui.btn('search', { attr: { 'data-a': 'timHP' } }) + '</div>' +
                        '<div data-z="bHP"></div></div>' +
                '</div>' }) +
        '</div>';

    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    ui.enhance(root);
    L.ganChonTatCa(root);
    function v(k) { return pat.val(f(k)); }

    /* ---------- 1. Danh sách ---------- */
    L.rows({ action: 'D_LoaiDanhSach/LayLoaiDanhSach', method: 'GET', type: 'GET', strChucNang_Id: '', strNguoiThucHien_Id: '' })
        .then(function (r) { pat.fill(f('loai'), r, { name: 'TEN', head: 'Chọn loại danh sách' }); }, L.fail('nạp loại danh sách'));
    L.rows({ action: 'D_ThoiGian/LayDanhSach', method: 'GET', strChucNang_Id: '', strNguoiThucHien_Id: '', strLoaiDanhSach_Id: v('loai') })
        .then(function (r) { pat.fill(f('tg'), r, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn thời gian' }); }, L.fail('nạp thời gian'));
    L.rows({ action: 'D_HocPhan/LayDanhSach', method: 'GET', strChucNang_Id: '', strNguoiThucHien_Id: '',
        strDaoTao_LopQuanLy_Id: '', strLoaiDanhSach_Id: '', strDaoTao_ThoiGianDaoTao_Id: '' })
        .then(function (r) { pat.fill(f('hp'), r, { name: 'TEN', head: 'Chọn học phần' }); }, L.fail('nạp học phần'));
    var tt = L.trangThai(z('tt'));

    var ds = { trang: 1, co: 10, rows: [], token: 0 };
    function taiDS(p) {
        if (p) ds.trang = p;
        var my = ++ds.token;
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'D_Hoc/LayDanhSach', method: 'GET',
            strTuKhoa: '', strChucNang_Id: '', strDaoTao_LopQuanLy_Id: '', strDaoTao_ThoiGianDaoTao_Id: v('tg'),
            strDaoTao_HocPhan_Id: v('hp'), strTrangThai_Id: '', strDangKy_KeHoachDangKy_Id: '', strLoaiDanhSach_Id: v('loai'),
            strNguoiDung_Id: '', strNguoiThucHien_Id: '', strNguoiTao_Id: '', pageIndex: ds.trang, pageSize: ds.co
        }).then(function (r) {
            if (my !== ds.token) return;
            ds.rows = L.arr(r.data);
            var tong = Number(r.pager) || ds.rows.length;
            z('n').textContent = '(' + tong + ')';
            ui.table({ el: z('bang'), rows: ds.rows, empty: 'Không có dữ liệu',
                page: { index: ds.trang, size: ds.co, total: tong, sizes: false, onChange: taiDS },
                columns: [
                    { title: 'Mã danh sách', prop: 'MA', cls: 'is-nowrap' },
                    { title: 'Tên danh sách', prop: 'TEN' },
                    { title: 'Số lượng', prop: 'SOLUONG', cls: 'is-center' },
                    { title: 'Sửa', cls: 'is-actions', width: '64px', render: function (r) {
                        return ui.iconBtn('edit', r.ID); } }
                ] });
        }).catch(function (err) {
            if (my !== ds.token) return;
            z('bang').innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'danh sách lớp học');
        });
    }

    /* ---------- 2. Thêm sinh viên vào danh sách ---------- */
    var sua = { lop: null, chua: [], trang: 1, co: 10, token: 0 };

    // Hệ → Khoá → CT → Lớp (edu.system.getList_*: không lọc quyền, như gốc)
    L.dt.he().then(function (r) {
        pat.fill(f('he'), r, { name: 'TENHEDAOTAO', head: 'Chọn hệ đào tạo' });
        pat.fill(f('he2'), r, { name: 'TENHEDAOTAO', head: 'Chọn hệ đào tạo' });
    }, L.fail('nạp hệ đào tạo'));
    function napKhoa() { return L.dt.khoa(v('he')).then(function (r) { pat.fill(f('khoa'), r, { name: 'TENKHOA', head: 'Chọn khóa đào tạo' }); }, L.fail('nạp khóa đào tạo')); }
    function napCT() { return L.dt.ct(v('khoa')).then(function (r) { pat.fill(f('ct'), r, { name: 'TENCHUONGTRINH', head: 'Chọn chương trình' }); }, L.fail('nạp chương trình')); }
    function napLop() { return L.dt.lop(v('he'), v('khoa'), v('ct')).then(function (r) { pat.fill(f('lop'), r, { name: 'TEN', head: 'Chọn lớp' }); }, L.fail('nạp lớp')); }
    napKhoa();
    jQuery(f('he')).on('select2:select', function () { napKhoa(); napCT(); napLop(); });
    jQuery(f('khoa')).on('select2:select', function () { napCT(); napLop(); });
    jQuery(f('ct')).on('select2:select', function () { napLop(); });
    pat.chain([f('he'), f('khoa'), f('ct'), f('lop')]);
    ums.api.dm('DIEM.DANHGIA').then(function (r) { pat.fill(f('kq'), r, { head: pat.dmTitle(r) || 'Chọn kết quả' }); }, L.fail('nạp kết quả'));

    function hoTenSV(r) { return esc(e(r.HODEM) + ' ' + e(r.TEN)); }
    function taiChua(p) {
        if (!sua.lop) return;
        if (p) sua.trang = p;
        var my = ++sua.token;
        z('bChua').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'D_NguoiHoc/LayDanhSach', method: 'GET', type: 'GET',
            strTuKhoa: '', strDaoTao_HocPhan_Id: sua.lop.DAOTAO_HOCPHAN_ID, strDanhGia_Id: v('kq'),
            strHeDaoTao_Id: v('he'), strKhoaDaoTao_Id: v('khoa'), strChuongTrinh_Id: v('ct'), strLopQuanLy_Id: v('lop'),
            strNguoiThucHien_Id: '', pageIndex: sua.trang, pageSize: sua.co
        }).then(function (r) {
            if (my !== sua.token) return;
            sua.chua = L.arr(r.data);
            var tong = Number(r.pager) || sua.chua.length;
            ui.table({ el: z('bChua'), rows: sua.chua, empty: 'Không có dữ liệu',
                page: { index: sua.trang, size: sua.co, total: tong, onChange: taiChua, onSize: function (s) { sua.co = s; taiChua(1); } },
                columns: [
                    { title: 'Mã số', prop: 'MASO', cls: 'is-nowrap' },
                    { title: 'Họ tên', render: hoTenSV },
                    { title: 'Tình trạng', prop: 'QLSV_NGUOIHOC_TRANGTHAI' },
                    { title: 'Lớp', prop: 'LOP' },
                    { title: 'Chương trình', prop: 'NGANH' }
                ].concat(cotKQ, [L.cotChon('chua')]) });
        }).catch(function (err) {
            if (my !== sua.token) return;
            z('bChua').innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'sinh viên chưa thêm');
        });
    }
    function taiDa() {
        if (!sua.lop) return Promise.resolve();
        z('bDa').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return L.rows({ action: 'D_Hoc_NguoiHoc/LayDanhSach', method: 'GET',
            strNguoiThucHien_Id: '', strDiem_DanhSachHoc_Id: sua.lop.ID, strTieuChiSapXep: '' })
            .then(function (rows) {
                ui.table({ el: z('bDa'), rows: rows, empty: 'Chưa có sinh viên',
                    columns: [
                        { title: 'Mã số', prop: 'MASONGUOIHOC', cls: 'is-nowrap' },
                        { title: 'Họ tên', render: function (r) { return esc(e(r.HODEMNGUOIHOC) + ' ' + e(r.TENNGUOIHOC)); } },
                        { title: 'Tình trạng', prop: 'TINHTRANG_TEN' },
                        { title: 'Lớp', prop: 'LOPQUANLY_TEN' },
                        { title: 'Chương trình', prop: 'CHUONGTRINH_TEN' }
                    ].concat(cotKQ, [L.cotChon('da')]) });
            }, function (err) { z('bDa').innerHTML = ui.fail(err.message); ums.api.handle(err, 'sinh viên đã thêm'); });
    }
    function moSua(id) {
        var row = ds.rows.filter(function (x) { return x.ID === id; })[0];
        if (!row) return;
        sua.lop = row;
        z('sua').querySelector('.ums-panel__title').innerHTML = '<i class="fa-light fa-plus"></i> Thêm mới - ' +
            esc(e(row.TEN) + ' - ' + e(row.DAOTAO_HOCPHAN_TEN));
        ui.swap(z('ds'), z('sua'));
        taiChua(1); taiDa();
    }
    function luuSV() {
        var ids = L.chon(z('bChua'), 'chua');
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn lưu dữ liệu không?').then(function (ok) {
            if (!ok) return;
            var rows = sua.chua.filter(function (x) { return ids.indexOf(x.ID) >= 0; });
            ui.batch(rows.map(function (o) {
                return { action: 'D_NguoiHoc/ThemMoi', type: 'POST', strChucNang_Id: '',
                    strDaoTao_LopQuanLy_Id: o.LOP_ID, strDaoTao_ChuongTrinh_Id: o.NGANH_ID,
                    strDiem_DanhSachHoc_Id: sua.lop.ID, strQLSV_NguoiHoc_Id: o.ID, strNguoiThucHien_Id: '' };
            }), { title: 'Đang thêm sinh viên', okText: 'Thêm sinh viên thành công!' }).then(taiDa);
        });
    }
    function xoaSV() {
        var ids = L.chon(z('bDa'), 'da');
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (ok) {
            if (!ok) return;
            ui.batch(ids.map(function (id) {
                return { action: 'D_NguoiHoc/Xoa', strDiem_DanhSach_NguoiHoc_Id: id, strNguoiThucHien_Id: '' };
            }), { title: 'Đang xóa', okText: 'Xóa thành công!' }).then(taiDa);
        });
    }
    ums.report.mount(z('imp'), {
        collect: function (add) {
            tt.ids().forEach(function (x) { add('strTrangThaiNguoiHoc_Id', x); });
            var o = {
                strDaoTao_LopQuanLy_Id: '',
                strDaoTao_ThoiGianDaoTao_Id: v('tg'),
                strDaoTao_HocPhan_Id: v('hp'),
                strTrangThai_Id: '',
                strDangKy_KeHoachDangKy_Id: '',
                strLoaiDanhSach_Id: v('loai'),
                strNguoiDung_Id: ''
            };
            Object.keys(o).forEach(function (k) { add(k, o[k]); });
        },
        onImported: function () { taiDa(); }
    });

    /* ---------- 3. Tạo danh sách nhập điểm ---------- */
    var tao = { lql: [], hp: [], token: 0 };
    function napKhoa2() { return L.dt.khoa(v('he2')).then(function (r) { pat.fill(f('khoa2'), r, { name: 'TENKHOA', head: 'Chọn khóa đào tạo' }); }, L.fail('nạp khóa đào tạo')); }
    function napCT2() { return L.dt.ct(v('khoa2')).then(function (r) { pat.fill(f('ct2'), r, { name: 'TENCHUONGTRINH', head: 'Chọn chương trình' }); }, L.fail('nạp chương trình')); }
    function taiLQL() {
        var my = ++tao.token;
        z('bLQL').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return L.dt.lop(v('he2'), v('khoa2'), v('ct2')).then(function (rows) {
            if (my !== tao.token) return;
            tao.lql = rows;
            ui.table({ el: z('bLQL'), rows: rows, empty: 'Không có dữ liệu',
                columns: [
                    { title: 'Mã lớp', prop: 'MA', cls: 'is-nowrap' },
                    { title: 'Tên lớp', prop: 'TEN' },
                    { title: 'Số sinh viên', prop: 'SOLUONGTHUCTE', cls: 'is-center' },
                    L.cotChon('lql')
                ] });
        }, function (err) { z('bLQL').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách lớp quản lý'); });
    }
    ums.ref.thoiGianDaoTao({ pageIndex: 1, pageSize: 100000 })
        .then(function (r) { pat.fill(f('tg2'), r, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn thời gian' }); }, L.fail('nạp thời gian'));
    jQuery(f('he2')).on('select2:select select2:clear', function () { napKhoa2(); napCT2(); taiLQL(); });
    jQuery(f('khoa2')).on('select2:select select2:clear', function () { napCT2(); taiLQL(); });
    jQuery(f('ct2')).on('select2:select select2:clear', function () { taiLQL(); });
    pat.chain([f('he2'), f('khoa2'), f('ct2')], { phatLai: false });
    z('bLQL').innerHTML = ui.empty('Chọn hệ đào tạo để xem danh sách lớp', 'fa-filter');
    z('bHP').innerHTML = ui.empty('Đánh dấu lớp quản lý rồi bấm Tìm kiếm', 'fa-filter');

    function timHP() {
        var ids = L.chon(z('bLQL'), 'lql');
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
        z('bHP').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        L.rows({ action: 'D_HocPhanCungChuongTrinh/LayDanhSach', type: 'GET',
            strDaoTao_ThoiGianDaoTao_Id: v('tg2'), strDSLopQuanLy_Id: ids.toString(), strNguoiThucHien_Id: '' })
            .then(function (rows) {
                tao.hp = rows;
                ui.table({ el: z('bHP'), rows: rows, empty: 'Không có dữ liệu',
                    columns: [
                        { title: 'Mã học phần', prop: 'MA', cls: 'is-nowrap' },
                        { title: 'Tên học phần', prop: 'TEN' },
                        { title: 'Số tín chỉ', prop: 'HOCTRINH', cls: 'is-center' },
                        L.cotChon('hp')
                    ] });
            }, function (err) { z('bHP').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách học phần'); });
    }
    function luuTao() {
        var lop = L.chon(z('bLQL'), 'lql'), hp = L.chon(z('bHP'), 'hp');
        if (!lop.length || !hp.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn lưu dữ liệu không?').then(function (ok) {
            if (!ok) return;
            var calls = [];
            lop.forEach(function (l) {
                hp.forEach(function (h) {
                    calls.push({ action: 'D_Hoc/Tao_Diem_DanhSachHoc', type: 'POST', strChucNang_Id: '', strNguoiThucHien_Id: '',
                        strDaoTao_ThoiGianDaoTao_Id: v('tg2'), strDaoTao_HocPhan_Id: h, strDSLopQuanLy_Id: l });
                });
            });
            ui.batch(calls, { title: 'Đang tạo danh sách nhập điểm', okText: 'Thành công!' });
        });
    }

    /* ---------- Chuyển vùng ---------- */
    function dong() {
        var mo = !z('sua').hidden ? z('sua') : z('tao');
        ui.swap(mo, z('ds'));
        taiDS();
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-act="edit"]');
        if (b && z('bang').contains(b)) { moSua(b.getAttribute('data-id')); return; }
        b = ev.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') taiDS(1);
        else if (a === 'moTao') ui.swap(z('ds'), z('tao'));
        else if (a === 'dong') dong();
        else if (a === 'timSV') taiChua(1);
        else if (a === 'luuSV') luuSV();
        else if (a === 'xoaSV') xoaSV();
        else if (a === 'timHP') timHP();
        else if (a === 'luuTao') luuTao();
    });

    taiDS(1);
})();
