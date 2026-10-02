/* =========================================================================
   Quản lý sinh viên tổng quát (danh sách QHHT)
   Bản gốc: ApisCongCanBo/Modules/hoatdong/html/DaQHHT.html (2.717 dòng, kèm lớp
   DiemHoc chép trong html) + script/DaQHHT.js (3.547 dòng)
   ---------------------------------------------------------------------------
   Tách tệp:
       _qhht_chung.js     danh mục, khối đầu hồ sơ, biểu mẫu cơ bản / hồ sơ - chính sách, qhht.dim
       _qhht_cauhinh.js   cấu hình 7 bảng quá trình (chép nguyên)
       _qhht_quatrinh.js  "Khai thông tin các quá trình"
       _qhht_hoso.js      hộp "Hồ sơ sinh viên" (bảng điểm: ums.diemHoc — assets/js/diemhoc.js)
       _qhht_dinhdanh.js  tab "Khởi tạo định danh mới" / "Phân ngành lớp chính"
   Tệp này: bộ lọc, thẻ thống kê, dải tab phân loại, danh sách, xuất Excel, báo cáo.
   Lời gọi (chép nguyên, mã hoá):
       KHCT_BIND_DIMENSION_MH · PKG_CORE_GET_BIND_DIMENSION.LayDSHeDaoTao / KhoaQuanLy / KhoaDaoTao /
           ChuongTrinh / LopQuanLy (ô chọn NHIỀU — giá trị nối bằng dấu phẩy)
       SV_NGUOIHOC_01_MH · PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc              danh sách (phân trang máy chủ)
           strStudyStatus_Ids = trạng thái đã chọn + "," + mã tab (DANGHOC…) — như gốc
       SV_NGUOIHOC_01_MH · PKG_CORE_NGUOIHOC_01.LayThongKe_TrangThaiNguoiHoc thẻ thống kê (dIsPrimary theo "Lọc thống kê")
   Mẫu báo cáo: Hệ / Khoá / Khoa QL / CT, strDaoTao_Lop_Id (tên KHÁC tham số danh sách — như gốc),
   strTrangThai = mã tab, strTuKhoa.

   Không chép (lỗi rõ của bản gốc):
     · Mở màn không nạp danh sách / thống kê (thẻ treo "Đang tải thống kê...") → nạp ngay.
     · Đổi ô cha nạp danh sách cùng lúc với ô con (lọc theo ô con cũ) → nạp con xong mới nạp danh sách.
     · "Đặt lại bộ lọc" không nạp lại danh sách của ô con; đổi lọc không về trang 1.
     · Xuất Excel dùng tên cột khác bảng (Cố vấn, Ngày sinh) → cùng cách lấy với bảng;
       tải SheetJS từ CDN → bảng HTML .xls (ums.ui.xuatXls). Vẫn chỉ trang đang xem, như gốc.
     · Lọc đổi khi đang ở tab định danh / phân ngành vẫn gọi danh sách vào bảng ẩn.
   Giữ như bản gốc (chờ nghiệp vụ):
     · strStudyStatus_Ids trộn ID danh mục với mã tab — kiểm procedure trên host.
     · Thẻ "Công nợ" và "Cảnh báo học vụ" chưa có nguồn số liệu → luôn 0.
     · Ô lọc là lọc TUỲ CHỌN (bỏ trống = tất cả) → KHÔNG khoá cha → con; đổi cha
       vẫn nạp lại và xoá chọn ở con như gốc.
     · Ô đánh dấu cột cuối bảng không có thao tác hàng loạt nào.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, qhht = ums.qhht;
    var root = document.getElementById('hd-daqhht');
    function esc(s) { return ui.esc(s); }
    var e = qhht.e, lay = qhht.lay, arr = qhht.arr;
    var NH = 'SV_NGUOIHOC_01_MH/', P = 'PKG_CORE_NGUOIHOC_01.';

    var TAB = [['', 'Tất cả'], ['DANGHOC', 'Đang học'], ['CANHBAO', 'Cảnh báo học vụ'], ['CONGNO', 'Công nợ'], ['SAPTOTNGHIEP', 'Sắp tốt nghiệp'],
        ['KHOITAODINHDANH', 'Khởi tạo định danh mới'], ['PHANNGANHLOPCHINH', 'Phân ngành lớp chính']];
    function ms(k, ph) { return '<select class="ums-select" data-f="' + k + '" multiple data-ph="' + esc(ph) + '"></select>'; }
    root.innerHTML =
        pat.page('Quản lý sinh viên tổng quát', '<div data-z="bc"></div>') +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            '<div class="ums-grid ums-grid--4">' +
                ui.field('Hệ đào tạo', ms('he', 'Chọn hệ đào tạo')) + ui.field('Khóa đào tạo', ms('khoa', 'Chọn khóa đào tạo')) +
                ui.field('Khoa quản lý', ms('kql', 'Chọn khoa quản lý')) + ui.field('Chương trình', ms('ct', 'Chọn chương trình')) +
                ui.field('Lớp', ms('lop', 'Chọn lớp')) + ui.field('Trạng thái học tập', ms('tt', 'Chọn trạng thái')) +
                '<div style="grid-column:span 2">' + ui.field('Thông tin', '<input class="ums-input" data-f="q" placeholder="Mã hồ sơ, Họ tên, CCCD..." autocomplete="off">') + '</div>' +
            '</div><div class="ums-row ums-u-mt-3">' +
                ui.btn('search', { attr: { 'data-a': 'tim' } }) + ui.btn('search', { text: 'Làm mới', icon: 'fa-arrows-rotate', mod: 'out-primary', attr: { 'data-a': 'tim' } }) +
                ui.btn('close', { text: 'Đặt lại bộ lọc', icon: 'fa-filter-circle-xmark', attr: { 'data-a': 'datlai' } }) +
                ui.btn('excel', { attr: { 'data-a': 'xuat', title: 'Xuất trang đang xem (Ctrl+G). Muốn xuất hết, chọn "Tất cả" ở số dòng mỗi trang trước.' } }) +
            '</div>' }) +
        '<div class="qhht-tkloc"><b>Lọc thống kê theo:</b>' +
            [['', 'Tất cả ngành'], ['1', 'Ngành chính'], ['0', 'Ngành phụ']].map(function (x, i) {
                return '<label class="ums-check"><input type="radio" name="qhhtIsPrimary" value="' + x[0] + '"' + (i ? '' : ' checked') + '><span>' + x[1] + '</span></label>'; }).join('') +
            '<i class="ums-u-muted ums-u-fz13">Filter này chỉ áp dụng cho phần thống kê</i></div>' +
        '<div class="qhht-tk" data-z="tk">' + ui.empty('Đang tải thống kê...', 'fa-spinner fa-spin') + '</div>' +
        ui.tabs(TAB.map(function (t) { return { key: t[0] || 'TATCA', text: t[1] }; }), 'TATCA', 'data-qtab') +
        '<div class="ums-u-mt-3" data-z="vungDS">' + pat.panel({ title: 'Danh sách sinh viên', icon: 'fa-users', count: 'n', flush: true, zone: 'bang' }) + '</div>' +
        '<div class="ums-u-mt-3" data-z="vungDD" hidden></div><div class="ums-u-mt-3" data-z="vungPN" hidden></div>';
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function mv(k) { return pat.val(f(k)).split(',').filter(function (x) { return x && x !== 'SELECTALL'; }).join(','); }
    var tab = '', trang = { index: 1, size: 10 }, ds = [];

    /* ---------- Bộ lọc --------------------------------------------------- */
    function nap(k, dim, ts) {
        return qhht.dim(dim, ts).then(function (d) {
            if (window.jQuery) jQuery(f(k)).val(null);
            pat.fill(f(k), d);
        }).catch(function (err) { ums.api.handle(err, 'danh mục đào tạo'); });
    }
    function napKhoa() { return nap('khoa', 'khoa', { strDaoTao_HeDaoTao_Id: mv('he') }); }
    function napCT() { return nap('ct', 'ct', { strDaoTao_KhoaDaoTao_Id: mv('khoa'), strDaoTao_KhoaQuanLy_Id: mv('kql'), strDaoTao_HeDaoTao_Id: mv('he') }); }
    function napLop() { return nap('lop', 'lop', { strDaoTao_HeDaoTao_Id: mv('he'), strDaoTao_KhoaDaoTao_Id: mv('khoa'), strDaoTao_KhoaQuanLy_Id: mv('kql'), strDaoTao_ChuongTrinh_Id: mv('ct') }); }
    nap('he', 'he', {}); nap('kql', 'kql', { strOrgTypeCode: '' }); napKhoa(); napCT(); napLop();
    ums.api.dm('QLSV.TRANGTHAI').then(function (d) { pat.fill(f('tt'), d, { name: 'TEN' }); }).catch(function () {});
    var SAU = { he: function () { return napKhoa().then(napCT).then(napLop); }, kql: function () { return napCT().then(napLop); },
        khoa: function () { return napCT().then(napLop); }, ct: napLop, lop: null, tt: null };
    if (window.jQuery) Object.keys(SAU).forEach(function (k) {
        jQuery(f(k)).on('select2:select select2:unselect select2:clear', function () { Promise.resolve(SAU[k] ? SAU[k]() : null).then(tuDau); });
    });

    /* ---------- Danh sách + thống kê --------------------------------------- */
    function loc() {
        return { strTuKhoa: f('q').value.trim(), strDaoTao_HeDaoTao_Id: mv('he'), strDaoTao_KhoaDaoTao_Id: mv('khoa'), strDaoTao_ChuongTrinh_Id: mv('ct'),
            strDaoTao_KhoaQuanLy_Id: mv('kql'), strDaoTao_LopQuanLy_Id: mv('lop'), dBoQuaPhamVi: 0 };
    }
    function taiDS() {
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        var tt = mv('tt');
        ums.api.call(Object.assign({ action: NH + 'DSA4BRIPJjQuKAkuIgPP', func: P + 'LayDSNguoiHoc', strStudyStatus_Ids: tt + (tab ? ',' + tab : ''), dIsPrimary: '',
            pageIndex: trang.index, pageSize: trang.size }, loc(), qhht.chung())).then(function (r) {
            ds = arr(r.data);
            var tong = Number(r.pager) || ds.length;
            z('n').textContent = '(' + tong + ')';
            ui.table({ el: z('bang'), rows: ds, empty: 'Không có sinh viên',
                page: { index: trang.index, size: trang.size, total: tong, onChange: function (p) { trang.index = p; taiDS(); }, onSize: function (s) { trang.size = s; trang.index = 1; taiDS(); } },
                columns: COT.map(function (c) { return { title: c[0], cls: c[2] || '', render: c[3] || function (x) { return esc(c[1](x)); } }; }).concat([
                    { head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (x, i) { return '<input type="checkbox" data-ck="' + i + '">'; } }]) });
        }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách sinh viên'); });
        taiTK();
    }
    function taiTK() {
        var pr = root.querySelector('input[name="qhhtIsPrimary"]:checked');
        ums.api.call(Object.assign({ action: NH + 'DSA4FSkuLyYKJB4VMyAvJhUpICgPJjQuKAkuIgPP', func: P + 'LayThongKe_TrangThaiNguoiHoc', silent: true, dIsPrimary: pr ? pr.value : '' },
            loc(), qhht.chung())).then(function (r) { veTK(arr(r.data)); }).catch(function (err) { z('tk').innerHTML = ui.fail(err.message); });
    }
    function so(n) { return Number(n || 0).toLocaleString('en-US'); }
    function veTK(d) {
        var tong = d.reduce(function (s, x) { return s + (Number(lay(x, ['SoNguoi', 'SONGUOI'])) || 0); }, 0);
        function the(icon, tone, gt, dv) { return '<div class="qhht-tk__o is-' + tone + '"><i class="fa-light ' + icon + '"></i><div><b>' + gt + '</b><span>' + esc(dv) + '</span></div></div>'; }
        function kieu(x) {
            var m = String(lay(x, ['MA', 'STATUS_CODE'])).toUpperCase(), t = String(e(x.TEN)).toLowerCase();
            if (m === 'DANGHOC' || /đang học/.test(t)) return ['fa-screen-users', 'lam'];
            if (/TOTNGHIEP/.test(m) || /tốt nghiệp/.test(t)) return ['fa-graduation-cap', 'luc'];
            if (m === 'BAOLUU' || m === 'TAMDUNG' || /bảo lưu|tạm dừng/.test(t)) return ['fa-user-clock', 'vang'];
            if (m === 'THOIHOC' || /thôi học/.test(t)) return ['fa-user-xmark', 'do'];
            if (m === 'CANHBAO' || /cảnh báo/.test(t)) return ['fa-triangle-exclamation', 'do'];
            return ['fa-user-tag', 'lam'];
        }
        z('tk').innerHTML = the('fa-users', 'navy', so(tong), '100% tổng số') + d.map(function (x) {
            var n = Number(lay(x, ['SoNguoi', 'SONGUOI'])) || 0, k = kieu(x);
            return the(k[0], k[1], so(n), (tong ? Math.round(n / tong * 1000) / 10 : 0) + '% · ' + e(x.TEN));
        }).join('') + the('fa-sack-dollar', 'cam', '0đ', '0 sinh viên · công nợ') + the('fa-bell-exclamation', 'do', '0', '0% · Cảnh báo học vụ');
    }

    var COT = [
        ['CCCD', function (x) { return lay(x, ['DINHDANH_CHINH_SO', 'CCCD']); }],
        ['Mã SV', function (x) { return lay(x, ['MA_NGUOIHOC_CHINH', 'MA_NGUOIHOC_PHU']); }, 'is-nowrap'],
        ['Họ và tên', function (x) { return lay(x, ['FULL_NAME', 'SINHVIEN_TENDAYDU']); }, 'is-nowrap'],
        ['Điện thoại cá nhân', dt, '', function (x) { var v = dt(x); return v ? '<a href="tel:' + esc(v) + '">' + esc(v) + '</a>' : '<span class="ums-u-faint">—</span>'; }],
        ['Email cá nhân', em, '', function (x) { var v = em(x); return v ? '<a href="mailto:' + esc(v) + '">' + esc(v) + '</a>' : '<span class="ums-u-faint">—</span>'; }],
        ['Trạng thái', function (x) { return lay(x, ['STUDY_STATUS_TEN', 'TRANGTHAI_TEN']) || '-'; }, 'is-center', function (x) {
            var m = String(lay(x, ['STUDY_STATUS_MA', 'TRANGTHAI'])).toUpperCase();
            var tone = /CANHBAO/.test(m) ? 'warn' : /TOTNGHIEP/.test(m) ? 'ok' : (m === 'BAOLUU' || m === 'TAMDUNG') ? 'mute' : 'info';
            return '<span class="ums-badge ums-badge--' + tone + '">' + esc(lay(x, ['STUDY_STATUS_TEN', 'TRANGTHAI_TEN']) || '-') + '</span>'; }],
        ['Xem hồ sơ', null, 'is-center', function (x, i) { return '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm" data-xem="' + i + '"><i class="fa-light fa-eye"></i><span>Xem hồ sơ</span></button>'; }],
        ['Giới tính', function (x) { return e(x.GIOITINH_TEN); }, 'is-center'],
        ['Ngày sinh', ngaySinh, 'is-center is-nowrap'],
        ['Dân tộc', function (x) { return e(x.DANTOC_TEN); }], ['Tôn giáo', function (x) { return e(x.TONGIAO_TEN); }],
        ['Khóa học', function (x) { return lay(x, ['TENKHOA', 'MAKHOA']); }], ['Khoa quản lý', function (x) { return lay(x, ['KHOAQUANLY_TEN', 'KHOAQUANLY_MA']); }],
        ['Lớp', function (x) { return lay(x, ['LOPQUANLY_TEN', 'LOPQUANLY_MA']); }], ['Chương trình', function (x) { return lay(x, ['TENCHUONGTRINH', 'MACHUONGTRINH']); }],
        ['Ngành chính/phụ', chinhPhu, 'is-center', function (x) { var v = chinhPhu(x); return '<span class="ums-badge ums-badge--' + (v === 'Chính' ? 'ok' : 'info') + '">' + esc(v) + '</span>'; }],
        ['GPA', function (x) { return e(x.GPA); }, 'is-center'],
        ['Công nợ', congNo, 'is-center', function (x) { return Number(x.CONGNO) > 0 ? '<b style="color:#dc3545">' + esc(congNo(x)) + '</b>' : '0'; }],
        ['Cố vấn', function (x) { return e(x.COVAN_TENDAYDU); }]
    ];
    function dt(x) { return lay(x, ['SODIENTHOAI_CANHAN', 'sodienthoai_canhan', 'PHONE_PERSONAL', 'DIENTHOAI_CANHAN', 'SODIENTHOAI']); }
    function em(x) { return lay(x, ['EMAIL_CANHAN', 'email_canhan', 'EMAIL_PERSONAL', 'EMAIL']); }
    function ngaySinh(x) { return lay(x, ['DATE_OF_BIRTH', 'NGAYSINH_DD_MM_YYYY']); }
    function chinhPhu(x) {
        var v = lay(x, ['NganhChinhPhu', 'NGANHCHINHPHU']);
        if (v) return v;
        if (x.IS_PRIMARY !== undefined && x.IS_PRIMARY !== null && x.IS_PRIMARY !== '') return Number(x.IS_PRIMARY) === 1 ? 'Chính' : 'Phụ';
        return x.MA_NGUOIHOC_CHINH && x.MA_NGUOIHOC_CHINH === x.MA_NGUOIHOC_PHU ? 'Chính' : 'Phụ';
    }
    function congNo(x) { return Number(x.CONGNO) > 0 ? ui.money(x.CONGNO) + 'đ' : '0'; }

    /* ---------- Tab ---------------------------------------------------------- */
    var dd = null, pn = null;
    function doiTab() {
        z('vungDS').hidden = tab === 'KHOITAODINHDANH' || tab === 'PHANNGANHLOPCHINH';
        z('vungDD').hidden = tab !== 'KHOITAODINHDANH';
        z('vungPN').hidden = tab !== 'PHANNGANHLOPCHINH';
        if (tab === 'KHOITAODINHDANH') { if (!dd) dd = qhht.dinhDanh(z('vungDD')); dd.tai(); }
        else if (tab === 'PHANNGANHLOPCHINH') { if (!pn) pn = qhht.phanNganh(z('vungPN')); pn.tai(); }
        else taiDS();
    }
    function tuDau() { trang.index = 1; doiTab(); }

    /* ---------- Xuất Excel (trang đang xem) --------------------------------- */
    function xuat() {
        if (!ds.length) { ui.toast('Không có dữ liệu để xuất. Vui lòng tìm kiếm trước.', 'warn'); return; }
        var d = new Date(), h2 = function (n) { return (n < 10 ? '0' : '') + n; };
        var ten = 'DSSV' + (tab ? '_' + tab : '') + '_' + d.getFullYear() + h2(d.getMonth() + 1) + h2(d.getDate()) + '_' + h2(d.getHours()) + h2(d.getMinutes()) + '.xls';
        ui.xuatXls(ten, { tieuDe: 'Danh sách sinh viên', dong: ds, cot: [{ title: 'STT', get: function (x, i) { return (trang.index - 1) * trang.size + i + 1; } }]
            .concat(COT.filter(function (c) { return c[1]; }).map(function (c) { return { title: c[0], get: c[1] }; })) });
    }
    function phim(ev) {
        if (!root.isConnected) { document.removeEventListener('keydown', phim); return; }
        if ((ev.ctrlKey || ev.metaKey) && (ev.key === 'g' || ev.key === 'G') && !document.querySelector('dialog[open]') && !root.querySelector('.ums-formtrang')) { ev.preventDefault(); xuat(); }
    }
    document.addEventListener('keydown', phim);

    ums.report.mount(z('bc'), { collect: function (add) {
        add('strDaoTao_HeDaoTao_Id', mv('he')); add('strDaoTao_KhoaDaoTao_Id', mv('khoa')); add('strDaoTao_KhoaQuanLy_Id', mv('kql'));
        add('strDaoTao_ChuongTrinh_Id', mv('ct')); add('strDaoTao_Lop_Id', mv('lop')); add('strTrangThai', tab); add('strTuKhoa', f('q').value.trim());
    } });
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-qtab]');
        if (b) { var k = b.getAttribute('data-qtab'); tab = k === 'TATCA' ? '' : k; ui.tabsActive(root, k, 'data-qtab'); tuDau(); return; }
        if ((b = ev.target.closest('[data-xem]'))) { qhht.moHoSo(ds[Number(b.getAttribute('data-xem'))], root); return; }   // hồ sơ mở TRONG TRANG
        if (!(b = ev.target.closest('[data-a]'))) return;
        var a = b.getAttribute('data-a');
        if (a === 'tim') tuDau();
        else if (a === 'xuat') xuat();
        else if (a === 'datlai') {
            if (window.jQuery) ['he', 'khoa', 'kql', 'ct', 'lop', 'tt'].forEach(function (k) { jQuery(f(k)).val(null).trigger('change.select2').trigger('ums:refresh'); });
            f('q').value = ''; tab = ''; ui.tabsActive(root, 'TATCA', 'data-qtab');
            napKhoa().then(napCT).then(napLop).then(tuDau);
        }
    });
    root.addEventListener('change', function (ev) {
        if (ev.target.name === 'qhhtIsPrimary') taiTK();
        if (ev.target.getAttribute('data-ck') === 'all') Array.prototype.forEach.call(z('bang').querySelectorAll('input[data-ck]'), function (c) { c.checked = ev.target.checked; });
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tuDau(); } });
    tuDau();
})();
