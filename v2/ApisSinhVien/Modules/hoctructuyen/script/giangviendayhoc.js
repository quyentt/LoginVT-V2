/* =========================================================================
   Giảng viên dạy học — giảng viên (người đăng nhập) khai công cụ / thông tin lớp học trực tuyến
   Bản gốc: ApisSinhVien/Modules/hoctructuyen/html/giangviendayhoc.html + script/giangviendayhoc.js
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc: ô Thời gian ở đầu, rồi HAI tab —
     1. "Danh sách các lớp trong kỳ, đợt, ngày": khung "Danh sách các lớp trong kỳ" (sửa trong ô + Lưu) và khung
        "Thời khóa biểu theo ngày" (ô ngày + Tìm kiếm, sửa trong ô + Lưu, nút "Xác nhận" vào lớp mỗi dòng);
     2. "Thống kê tình hình sinh viên học": "Danh sách lớp" → "Chi tiết" mở khung "Danh sách sinh viên"
        (sinh viên × buổi học) THAY CHỖ cả trang, nút Đóng quay lại (_dssv.js).

   Lời gọi (kiểu cũ, chép nguyên tên tham số; strGiangVien_Id = người đăng nhập như gốc):
     SV_HoTro_Chung/LayDSThoiGian               GET → ô Thời gian (gốc selectOne: chỉ chọn sẵn khi có đúng một)
     danh mục HOTROHOC.CONGCUHOC                 → ô "Sử dụng công cụ dạy học" trong bảng
     SV_LopHoc_CauHinh_GV/LayDanhSach           GET (strDaoTao_ThoiGianDaoTao_Id, strGiangVien_Id, pageIndex/pageSize)
                                                → bảng "các lớp trong kỳ" VÀ bảng "Danh sách lớp" của tab 2 (gốc dùng chung kết quả)
     SV_LopHoc_CauHinh_GV/Sua_HoTro_LopHoc_CauHinh_GV_1   (strId, strCongCuHoc_Id, strThongTinVaoHeThongHoc, strThongTinXacThucVaoHoc)
     SV_LopHoc_Lich_GV/LayDanhSach              GET (strNgayHoc = ô ngày, strDaoTao_ThoiGianDaoTao_Id, strGiangVien_Id…)
     SV_LopHoc_Lich_GV/Sua_HoTro_LopHoc_Lich_GV_1          (như trên, theo từng buổi)
     SV_LopHoc_CauHinh_GV/Sua_HoTro_LopHoc_Lich_GV_2       (strId) — "Xác nhận vào lớp"
   Lưu: như gốc CHỈ gửi dòng có ô đã đổi (so công cụ + hai ô chữ với dữ liệu nạp về), chạy qua ums.ui.batch.
   Khác gốc:
     · Chọn thời gian tự đặt ô ngày = hôm nay và nạp thời khoá biểu ngày (như gốc). Xoá thời gian thì hai bảng
       về lời nhắc (gốc giữ dữ liệu cũ).
     · Lưu mà không có dòng nào đổi: gốc bật thông báo rỗng → ở đây báo "Không có thay đổi".
     · "Xác nhận" vào lớp: gốc gọi start_Progress khi chưa dựng thanh tiến độ; ở đây xác nhận xong nạp lại bảng ngày.
     · Nút "Chi tiết" (tab 2): gốc là bút "Sửa" nhưng việc làm là XEM danh sách sinh viên → biểu tượng xem.
     · Ô chọn công cụ trong bảng là ô gốc (luật ô trong bảng ít mục), gốc bọc select2.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, H = ums.svHttt;
    var root = document.getElementById('httt-giangvien');
    if (!root) return;
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function get(a, o) { return ums.api.call(Object.assign({ action: a, method: 'GET', strNguoiThucHien_Id: uid() }, o)); }
    var CO = (ums.cfg && ums.cfg.behavior && ums.cfg.behavior.pageSize) || 10;

    root.innerHTML =
        '<div data-z="chinh">' +
            pat.page('Giảng viên dạy học', '') +
            pat.filterBar([{ key: 'tg', type: 'select', label: 'Chọn thời gian' }], { search: false }) +
            ui.tabs([{ key: 'lop', text: '1. Danh sách các lớp trong kỳ, đợt, ngày' }, { key: 'tk', text: '2. Thống kê tình hình sinh viên học' }], 'lop', 'data-gtab') +
            '<div data-tab-body="lop">' +
                pat.panel({ title: 'Danh sách các lớp trong kỳ', icon: 'fa-list-ul', count: 'nKy', flush: true, zone: 'ky',
                    tools: ui.btn('save', { attr: { 'data-a': 'luuKy' } }) }) +
                pat.panel({ title: 'Thời khóa biểu theo ngày', icon: 'fa-calendar-day', count: 'nNgay', flush: true, zone: 'ngay', cls: 'ums-u-mt-4',
                    tools: '<input class="ums-input httt-ngay" data-f="ngay" data-date placeholder="Nhập ngày" autocomplete="off">' +
                        ui.btn('search', { attr: { 'data-a': 'timNgay' } }) + ui.btn('save', { attr: { 'data-a': 'luuNgay' } }) }) +
            '</div>' +
            '<div data-tab-body="tk" hidden>' +
                pat.panel({ title: 'Danh sách lớp', icon: 'fa-list-ul', count: 'nLop', flush: true, zone: 'lop' }) +
            '</div>' +
        '</div>' +
        '<div data-z="sv" hidden></div>';
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function dem(k, n) { z(k).textContent = n === null ? '' : '(' + n + ')'; }

    var dtCongCu = [], dsKy = [], dsNgay = [];
    var pKy = { trang: 1, co: CO, tong: 0 }, pNgay = { trang: 1, co: CO, tong: 0 };
    var ccReady = ums.api.dm('HOTROHOC.CONGCUHOC').then(function (d) { dtCongCu = arr(d); }, function () { dtCongCu = []; });

    function nhac() {
        z('ky').innerHTML = z('lop').innerHTML = ui.empty('Chọn thời gian để xem các lớp', 'fa-hand-pointer');
        z('ngay').innerHTML = ui.empty('Chọn thời gian và ngày để xem thời khoá biểu', 'fa-hand-pointer');
        dem('nKy', null); dem('nNgay', null); dem('nLop', null);
        dsKy = []; dsNgay = [];
    }
    nhac();

    get('SV_HoTro_Chung/LayDSThoiGian').then(function (r) {
        var ds = arr(r.data);
        pat.fill(f('tg'), ds, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn thời gian' });
        if (ds.length === 1) { f('tg').value = ds[0].ID; if (window.jQuery) jQuery(f('tg')).trigger('change.select2'); doiTG(); }
    }).catch(function (err) { ums.api.handle(err, 'thời gian'); });
    function doiTG() {
        if (!f('tg').value) { nhac(); return; }
        taiKy(1);
        f('ngay').value = H.homNay();
        if (f('ngay')._flatpickr) f('ngay')._flatpickr.setDate(f('ngay').value, false, 'd/m/Y');
        taiNgay(1);
    }
    if (window.jQuery) jQuery(f('tg')).on('select2:select select2:clear', doiTG);

    /* ---------- Ô sửa trong bảng (công cụ + hai ô chữ) ---------- */
    function oCongCu(x) {
        return '<select class="ums-select" data-cc="' + esc(x.ID) + '"><option value="">Chọn công cụ</option>' +
            dtCongCu.map(function (c) {
                return '<option value="' + esc(c.ID) + '"' + (String(c.ID) === String(e(x.CONGCUHOC_ID)) ? ' selected' : '') + '>' + esc(c.TEN) + '</option>';
            }).join('') + '</select>';
    }
    var COT_SUA = [
        { title: 'Sử dụng công cụ dạy học', render: oCongCu, width: '200px' },
        { title: 'Thông tin hệ thống trực tuyến', render: function (x) { return '<input class="ums-input" data-vao="' + esc(x.ID) + '" value="' + esc(e(x.THONGTINVAOHETHONGHOC)) + '">'; } },
        { title: 'Thông tin xác thực hệ thống trực tuyến', render: function (x) { return '<input class="ums-input" data-xt="' + esc(x.ID) + '" value="' + esc(e(x.THONGTINXACTHUCVAOHOC)) + '">'; } }
    ];
    var COT_LOP = [
        { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' },
        { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
        { title: 'Lớp học phần', prop: 'DANGKY_LOPHOCPHAN_TEN' }
    ];
    function trangCfg(p, taiLai) {
        return {
            index: p.trang, size: p.co, total: p.tong,
            onChange: function (n) { if (n >= 1 && n <= Math.ceil(p.tong / p.co)) taiLai(n); },
            onSize: function (v) { p.co = v === 'all' ? Math.max(p.tong, 1) : Number(v); taiLai(1); }
        };
    }

    /* ---------- Các lớp trong kỳ (+ tab 2 dùng chung kết quả) ---------- */
    function taiKy(n) {
        if (n) pKy.trang = n;
        z('ky').innerHTML = z('lop').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        Promise.all([ccReady, get('SV_LopHoc_CauHinh_GV/LayDanhSach', {
            strTuKhoa: '', strDaoTao_HocPhan_Id: '', strDangKy_LopHocPhan_Id: '',
            strDaoTao_ThoiGianDaoTao_Id: f('tg').value, strGiangVien_Id: uid(), strCongCuHoc_Id: '',
            pageIndex: pKy.trang, pageSize: pKy.co
        })]).then(function (x) {
            var r = x[1];
            dsKy = arr(r.data);
            pKy.tong = Number(r.pager) || dsKy.length;
            dem('nKy', pKy.tong); dem('nLop', pKy.tong);
            ui.table({ el: z('ky'), rows: dsKy, empty: 'Không có lớp nào', page: trangCfg(pKy, taiKy), columns: COT_LOP.concat(COT_SUA) });
            ui.table({ el: z('lop'), rows: dsKy, empty: 'Không có lớp nào', page: trangCfg(pKy, taiKy), columns: COT_LOP.concat([
                { title: 'Chi tiết', cls: 'is-actions', width: '64px', render: function (x, i) { return ui.iconBtn('view', String(i)); } }
            ]) });
        }).catch(function (err) { z('ky').innerHTML = z('lop').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách lớp'); });
    }

    /* ---------- Thời khoá biểu theo ngày ---------- */
    function taiNgay(n) {
        if (!f('ngay').value || !f('tg').value) return;           // gốc: không có ngày thì không tải
        if (n) pNgay.trang = n;
        z('ngay').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        Promise.all([ccReady, get('SV_LopHoc_Lich_GV/LayDanhSach', {
            strTuKhoa: '', strCongCuHoc_Id: '', strNgayVao: '', strNgayHoc: f('ngay').value,
            strHoTroHoc_LopHoc_Lich_Id: '', strTrangThaiGhiNhan_Id: '', strDaoTao_HocPhan_Id: '', strDangKy_LopHocPhan_Id: '',
            strDaoTao_ThoiGianDaoTao_Id: f('tg').value, strGiangVien_Id: uid(), strNgay: '',
            pageIndex: pNgay.trang, pageSize: pNgay.co
        })]).then(function (x) {
            var r = x[1];
            dsNgay = arr(r.data);
            pNgay.tong = Number(r.pager) || dsNgay.length;
            dem('nNgay', pNgay.tong);
            ui.table({ el: z('ngay'), rows: dsNgay, empty: 'Không có buổi học nào trong ngày', page: trangCfg(pNgay, taiNgay),
                columns: COT_LOP.concat(COT_SUA).concat([
                    { title: 'Thứ - Ngày học - giờ học - phút học', cls: 'is-center is-nowrap', render: function (x) { return esc(H.buoi(x)); } },
                    { title: 'Xác nhận vào lớp', cls: 'is-center', render: function (x, i) {
                        return ui.btn('confirm', { text: 'Xác nhận', cls: 'ums-btn--sm', attr: { 'data-xn': String(i) } });
                    } }
                ]) });
        }).catch(function (err) { z('ngay').innerHTML = ui.fail(err.message); ums.api.handle(err, 'thời khoá biểu theo ngày'); });
    }

    /* ---------- Lưu: chỉ dòng có ô đổi ---------- */
    function luu(host, ds, action, sauLuu) {
        var calls = [];
        ds.forEach(function (x) {
            var id = String(x.ID);
            var cc = host.querySelector('[data-cc="' + CSS.escape(id) + '"]'), vao = host.querySelector('[data-vao="' + CSS.escape(id) + '"]'),
                xt = host.querySelector('[data-xt="' + CSS.escape(id) + '"]');
            if (!cc) return;
            var moi = cc.value + vao.value + xt.value, cu = e(x.CONGCUHOC_ID) + e(x.THONGTINVAOHETHONGHOC) + e(x.THONGTINXACTHUCVAOHOC);
            if (moi !== cu) calls.push({ action: action, method: 'POST', strId: x.ID, strCongCuHoc_Id: cc.value,
                strThongTinVaoHeThongHoc: vao.value, strThongTinXacThucVaoHoc: xt.value, strNguoiThucHien_Id: uid() });
        });
        if (!calls.length) { ui.toast('Không có thay đổi', 'info'); return; }
        ui.batch(calls, { title: 'Đang lưu', okText: 'Đã lưu', show: true }).then(sauLuu);
    }

    function xacNhan(x) {
        ui.confirm('Bạn có xác nhận vào lớp không?', { ok: 'Xác nhận', title: 'Xác nhận vào lớp' }).then(function (yes) {
            if (!yes) return;
            return ums.api.call({ action: 'SV_LopHoc_CauHinh_GV/Sua_HoTro_LopHoc_Lich_GV_2', method: 'POST', strId: x.ID, strNguoiThucHien_Id: uid() })
                .then(function () { ui.toast('Xác nhận thành công', 'ok'); taiNgay(); });
        }).catch(function (err) { ums.api.handle(err, 'xác nhận vào lớp'); });
    }

    function moSV(x) {
        H.dsSV(z('sv'), x.DANGKY_LOPHOCPHAN_ID, function () { ui.swap(z('sv'), z('chinh')); });
        ui.swap(z('chinh'), z('sv'));
    }

    root.addEventListener('click', function (ev) {
        var t = ev.target.closest('[data-gtab]');
        if (t) {
            var k = t.getAttribute('data-gtab');
            ui.tabsActive(root, k, 'data-gtab');
            Array.prototype.forEach.call(root.querySelectorAll('[data-tab-body]'), function (b) { b.hidden = b.getAttribute('data-tab-body') !== k; });
            return;
        }
        var v = ev.target.closest('[data-act="view"]');
        if (v) { var r = dsKy[Number(v.getAttribute('data-id'))]; if (r) moSV(r); return; }
        var xn = ev.target.closest('[data-xn]');
        if (xn) { var r2 = dsNgay[Number(xn.getAttribute('data-xn'))]; if (r2) xacNhan(r2); return; }
        var b = ev.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'luuKy') luu(z('ky'), dsKy, 'SV_LopHoc_CauHinh_GV/Sua_HoTro_LopHoc_CauHinh_GV_1', function () { taiKy(); });
        else if (a === 'luuNgay') luu(z('ngay'), dsNgay, 'SV_LopHoc_Lich_GV/Sua_HoTro_LopHoc_Lich_GV_1', function () { taiNgay(); });
        else if (a === 'timNgay') { if (!f('tg').value) ui.toast('Vui lòng chọn thời gian', 'warn'); else taiNgay(1); }
    });
    f('ngay').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); taiNgay(1); } });
})();
