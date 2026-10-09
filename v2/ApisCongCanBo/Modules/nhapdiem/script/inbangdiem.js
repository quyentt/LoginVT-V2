/* =========================================================================
   inbangdiem — In bảng điểm cá nhân: danh sách người học (mỗi dòng một người học × chương trình),
   11 hộp chi tiết theo dòng (_ibd_chitiet.js, _ibd_lop.js, _ibd_ctdt.js) và 4 thao tác hàng loạt.
   "In" = mẫu báo cáo máy chủ (ums.report.mount) — trang gốc không có phôi in nào.
   Bản gốc: nhapdiem/html/inbangdiem.html + script/inbangdiem.js + chuongtrinhhoc.js (vỏ index / Core).
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên):
       Danh sách D_BaoCao_MH · pkg_diem_baocao.LayDanhSachHoSoNhieuNganh (phân trang máy chủ, 10 dòng) — KHÁC gói
         pkg_hosohocvien của ums.pat.pickSinhVienNganh, đừng đổi lẫn
       Khoa QL → Hệ → Khoá → CT → Lớp: ums.ref.cascadeQuyen (…Quyen — lọc theo quyền như gốc)
       Trạng thái SV: danh mục QLSV.TRANGTHAI (ums.pat.checks, mặc định đánh dấu hết)
       Loại xét TN_KeHoach/LayDSPhanLoaiXetTheoND1 (strNguoiDung_Id '') → Kế hoạch TN_ThongTin/LayDSTN_KeHoach
       Phạm vi tổng hợp (CHỈ dùng cho báo cáo): danh mục DIEM.PHAMVITONGHOPDIEM (MA: TOANKHOA / NHIEUKY / NAMHOC / HOCKY / DOTHOC)
         → thời gian đào tạo ums.ref.thoiGianDaoTao · năm nhập học KHCT_NamNhapHoc/LayDanhSach
       Tổng hợp dữ liệu D_TongHop_XuLy_MH · PKG_DIEM_TONGHOP_XULY.TongHopDuLieuHocTap (mỗi dòng của TOÀN BỘ kết quả lọc một lời gọi,
         cùng một strKhoaKiemTraDuLieu; strPhanLoai_Id bỏ trống như gốc)
       Còn nợ môn D_BaoCao_MH · pkg_diem_baocao.LayDanhSachNoMon (không phân trang — ở đây phân trang máy khách)
       Gửi email ums.pat.guiEmail (CMS_NguoiDung/SendEmail tuần tự) · Xuất Excel ums.ui.xuatXls (gốc tải SheetJS từ CDN)
   Báo cáo — khoá gửi theo đúng thứ tự gốc: strPhamViTongHopDiem_Id, strDaoTao_ThoiGianDaoTao_Id (ô con của phạm vi), strTuKhoa,
       strNamNhapHoc '', strKhoaQuanLy_Id, strHeDaoTao_Id, strKhoaDaoTao_Id, strChuongTrinh_Id, strLopQuanLy_Id, strTrangThaiNguoiHoc_Id,
       strTN_KeHoach_Id, strDaoTao_KhoaQuanLy_Id, rồi MỖI dòng đánh dấu một strQlsv_NguoiHoc_Id (= ID dòng như gốc — kiểm trên host).
   Không chép (lỗi rõ của bản gốc):
     · Kế hoạch xét chỉ nạp 10 mục đầu (pageSize mặc định) → nạp hết.
     · Đổi ô lọc thì tìm NGAY với giá trị con cũ → tìm sau khi các ô con nạp xong.
     · Bảng nợ môn: bấm trang là quay về danh sách chính → phân trang riêng.
     · Tổng hợp dữ liệu: mỗi dòng lỗi một thông báo, không hỏi trước → hỏi lại, gộp lỗi.
     · Ô tìm kiếm kiểu "email" (bàn phím di động, tự điền sai) → ô chữ thường.
     · Khoa QL rỗng thì lỗi JS.
   Chờ nghiệp vụ:
     · Hệ → Khoá → CT → Lớp là lọc "Tất cả …" ở gốc; ở đây KHOÁ theo luật cha → con (như các màn dùng cascadeQuyen) — hỏi lại.
       Gốc nạp Hệ theo từng Khoa QL; cascadeQuyen nạp Hệ một lần.
     · Phạm vi "Năm học" đổ danh sách NĂM NHẬP HỌC (gửi năm làm strDaoTao_ThoiGianDaoTao_Id); "Đợt học" dùng chung danh sách với "Học kỳ".
     · Lọc "Chỉ SV còn nợ tài chính", Xuất Excel, Gửi email chỉ trên TRANG đang xem (như gốc — tăng "Hiển thị" để lấy nhiều hơn).
     · Cột email chưa rõ tên: dò EMAIL, Email, EMAIL_CANHAN, TTLL_EMAILCANHAN, QLSV_NGUOIHOC_EMAIL… như gốc.
     · Tổng hợp dữ liệu chạy cho mọi dòng khớp lọc (bỏ qua ô đánh dấu) — như gốc.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, ibd = ums.ibd;
    var root = document.getElementById('nd-inbangdiem');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function cn() { return (ums.state && ums.state.chucNangId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function sel(k, ph, multi) { return '<div class="ums-field"><select class="ums-select" data-f="' + k + '" data-ph="' + esc(ph) + '"' + (multi ? ' multiple' : '') + '>' + (multi ? '' : '<option value=""></option>') + '</select></div>'; }

    root.innerHTML = pat.page('In bảng điểm cá nhân', '<span data-z="bc"></span>') +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            '<div class="ums-filter"><div class="ums-field"><input class="ums-input" data-f="q" placeholder="Thông tin người học (Mã số, họ tên, ngày sinh ...)" autocomplete="off"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div></div>' +
            '<div class="ums-legend ums-legend--cach">Chọn trạng thái sinh viên</div><div data-z="tt"></div>' +
            '<details class="ibd-mo" open><summary>Điều kiện lọc dữ liệu mở rộng</summary><div class="ums-filter ums-u-mt-2">' +
                sel('kql', 'Chọn khoa quản lý') + sel('he', 'Tất cả hệ đào tạo') + sel('khoa', 'Tất cả khóa đào tạo') + sel('ct', 'Tất cả chương trình đào tạo') + sel('lop', 'Tất cả lớp') +
                sel('lx', 'Chọn loại xét') + sel('kh', 'Chọn kế hoạch') + '</div>' +
                '<div class="ums-filter ums-u-mt-2"><span class="ums-u-fz13 ums-u-muted ibd-pv__nhan">Phạm vi tổng hợp</span>' + sel('pv', 'Chọn phạm vi') +
                    '<span class="ums-u-fz13 ibd-pv" data-pv="TOANKHOA" hidden>- Toàn khóa</span>' +
                    '<span class="ibd-pv" data-pv="NHIEUKY" hidden>' + sel('pv_NHIEUKY', 'Chọn các kỳ', true) + '</span>' +
                    '<span class="ibd-pv" data-pv="NAMHOC" hidden>' + sel('pv_NAMHOC', 'Chọn năm') + '</span>' +
                    '<span class="ibd-pv" data-pv="HOCKY" hidden>' + sel('pv_HOCKY', 'Chọn học kỳ') + '</span>' +
                    '<span class="ibd-pv" data-pv="DOTHOC" hidden>' + sel('pv_DOTHOC', 'Chọn đợt học') + '</span></div></details>' }) +
        pat.panel({ title: 'Danh sách sinh viên', icon: 'fa-users', count: 'n', flush: true,
            body: '<div class="nd-thanh"><label class="ums-check ibd-no" title="Lọc ra các SV có Tài chính > 0 trong trang đang xem"><input type="checkbox" data-f="congno"><span>Chỉ SV còn nợ tài chính</span></label><div class="nd-thanh__phai">' +
                ui.btn('save', { text: 'Tổng hợp dữ liệu học tập', icon: 'fa-arrows-rotate', mod: 'out-success', attr: { 'data-a': 'tonghop' } }) +
                ui.btn('search', { text: 'Danh sách còn nợ môn', icon: 'fa-list-check', mod: 'out-primary', attr: { 'data-a': 'nomon' } }) +
                ui.btn('search', { text: 'Gửi Email', icon: 'fa-envelope', mod: 'out-warn', attr: { 'data-a': 'email', title: 'Gửi email kết quả học tập / báo công nợ cho các SV đã tick chọn (hoặc toàn bộ SV đang hiển thị).' } }) +
                ui.btn('excel', { text: 'Xuất Excel (Ctrl+G)', attr: { 'data-a': 'excel', title: 'Xuất danh sách theo dữ liệu đang hiển thị (Ctrl+G). Đổi "Hiển thị" sang số lớn hơn để xuất nhiều dòng hơn.' } }) +
                '</div></div><div data-z="bang"></div>' });
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { var el = f(k); if (!el) return ''; return el.multiple ? (window.jQuery ? (jQuery(el).val() || []).join(',') : '') : el.value.trim(); }

    /* ---------- Bộ lọc -------------------------------------------------- */
    var TT = pat.checks(z('tt'), ums.api.dm('QLSV.TRANGTHAI'), { cols: 3 });
    var daSan = false;
    var cas = ums.ref.cascadeQuyen({ kql: f('kql'), he: f('he'), khoa: f('khoa'), ct: f('ct'), lop: f('lop'), onChange: function () { if (daSan) { trang = 1; tai(); } } });
    cas.ready.then(function () {
        var o = f('kql').options[1];   // gốc: Khoa QL không có mục trống, mặc định mục đầu và tìm ngay
        daSan = true;
        if (o && window.jQuery) { f('kql').value = o.value; jQuery(f('kql')).trigger('change.select2').trigger({ type: 'select2:select' }); }
        else tai();
    });
    var cLX = pat.chain([f('lx'), f('kh')], { phatLai: false });
    ums.api.call({ action: 'TN_KeHoach/LayDSPhanLoaiXetTheoND1', method: 'GET', strNguoiDung_Id: '', strNguoiThucHien_Id: uid() })
        .then(function (r) { pat.fill(f('lx'), arr(r.data), { head: 'Chọn loại xét' }); cLX.sync(); }).catch(function () {});
    function napKH() {
        if (!v('lx')) { pat.fill(f('kh'), []); cLX.sync(); return; }
        ums.api.call({ action: 'TN_ThongTin/LayDSTN_KeHoach', method: 'GET', strTuKhoa: '', strPhanLoai_Id: v('lx'), strDaoTao_ThoiGianDaoTao_Id: '', strNguoiDung_Id: '', strNguoiTao_Id: '',
            pageIndex: 1, pageSize: 1000000, strNguoiThucHien_Id: uid() }).then(function (r) { pat.fill(f('kh'), arr(r.data), { head: 'Chọn kế hoạch' }); cLX.sync(); }).catch(function (err) { ums.api.handle(err, 'kế hoạch xét'); });
    }
    var PV = [], pvMa = '';
    ums.api.dm('DIEM.PHAMVITONGHOPDIEM').then(function (d) { PV = d || []; pat.fill(f('pv'), PV, { head: 'Chọn phạm vi' }); }).catch(function () {});
    ums.ref.thoiGianDaoTao({ strNam_Id: '', pageIndex: 1, pageSize: 100000 }).then(function (d) {
        ['pv_NHIEUKY', 'pv_HOCKY', 'pv_DOTHOC'].forEach(function (k) { pat.fill(f(k), d, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn thời gian' }); });
    }).catch(function () {});
    ums.api.call({ action: 'KHCT_NamNhapHoc/LayDanhSach', method: 'GET', strNguoiThucHien_Id: uid() })
        .then(function (r) { pat.fill(f('pv_NAMHOC'), arr(r.data), { id: 'NAMNHAPHOC', name: 'NAMNHAPHOC', head: 'Chọn năm' }); }).catch(function () {});
    function doiPV() {
        var p = PV.filter(function (x) { return String(x.ID) === v('pv'); })[0];
        pvMa = p ? e(p.MA) : '';
        Array.prototype.forEach.call(root.querySelectorAll('[data-pv]'), function (s) { s.hidden = s.getAttribute('data-pv') !== pvMa; });
    }
    if (window.jQuery) {
        jQuery(f('lx')).on('select2:select select2:clear', napKH);
        jQuery(f('pv')).on('select2:select select2:clear', doiPV);
    }
    function loc() {
        return { strTuKhoa: v('q'), strNamNhapHoc: '', strKhoaQuanLy_Id: v('kql'), strHeDaoTao_Id: v('he'), strKhoaDaoTao_Id: v('khoa'), strChuongTrinh_Id: v('ct'),
            strLopQuanLy_Id: v('lop'), strTrangThaiNguoiHoc_Id: TT.val(), strChucNang_Id: cn(), strTN_KeHoach_Id: v('kh'), strNguoiThucHien_Id: uid() };
    }
    function goiDS(trangSo, co) {
        return ums.api.call(Object.assign({ action: 'D_BaoCao_MH/DSA4BSAvKRIgIikJLhIuDykoJDQPJiAvKQPP', func: 'pkg_diem_baocao.LayDanhSachHoSoNhieuNganh', pageIndex: trangSo, pageSize: co }, loc()));
    }

    /* ---------- Danh sách ------------------------------------------------ */
    var trang = 1, co = 10, THO = [], TONG = 0, DS = [], cheDo = 'ds';
    function tai() {
        cheDo = 'ds';
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return goiDS(trang, co).then(function (r) { THO = arr(r.data); TONG = Number(r.pager) || THO.length; ve(); })
            .catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách sinh viên'); });
    }
    function nut(k, i, txt) { return '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm" data-x="' + k + '" data-i="' + i + '"><span>' + esc(txt || 'Xem') + '</span></button>'; }
    function ve() {
        var noTC = f('congno').checked;
        DS = noTC ? THO.filter(function (x) { return Number(x.TONGNOPHI) > 0; }) : THO;
        z('n').textContent = noTC ? '(' + DS.length + ' / ' + THO.length + ' trang này)' : '(' + TONG + ')';
        ui.table({ el: z('bang'), rows: DS, empty: 'Không có sinh viên', columns: [
            { title: 'Lịch học', cls: 'is-center', render: function (x, i) { return nut('lich', i, 'Lịch học'); } },
            { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' }, { title: 'Họ đệm', prop: 'QLSV_NGUOIHOC_HODEM' }, { title: 'Tên', prop: 'QLSV_NGUOIHOC_TEN' },
            { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' }, { title: 'Trạng thái', prop: 'QLSV_TRANGTHAINGUOIHOC_TEN', cls: 'is-right' },
            { title: 'Tài chính', cls: 'is-center', render: function (x, i) { return nut('tc', i, ui.money(x.TONGNOPHI || 0)); } },
            { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' }, { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' }, { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN', cls: 'is-center' },
            { title: 'Hệ', prop: 'DAOTAO_HEDAOTAO_TEN', cls: 'is-center' }, { title: 'ĐTBTL Hệ 4', prop: 'DTBTICHLUYHE4TOANKHOA', cls: 'is-center' },
            { title: 'ĐTBTL Hệ 10', prop: 'DTBTICHLUYHE10TOANKHOA', cls: 'is-center' }, { title: 'Số TCTL', prop: 'SOTCTICHLUYTOANKHOA', cls: 'is-center' }
        ].concat([['no', 'Học phần nợ'], ['hv', 'Xử lý học vụ'], ['qd', 'Quyết định'], ['tb', 'Điểm toàn bộ'], ['dtb', 'Điểm TB'], ['khoi', 'Tích lũy theo khối'],
            ['dk', 'Kết quả đăng ký'], ['lop', 'Kết quả đăng ký cả lớp'], ['ct', 'Khung chương trình'], ['drl', 'Điểm rèn luyện']].map(function (c) {
            return { title: c[1], cls: 'is-center', render: function (x, i) { return nut(c[0], i); } };
        }), [{ head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (x, i) { return '<input type="checkbox" data-ck="' + i + '">'; } }]),
            page: { index: trang, size: co, total: TONG, onChange: function (p) { trang = p; tai(); }, onSize: function (s) { co = s === 'all' ? Math.max(TONG, 1) : Number(s); trang = 1; tai(); } } });
    }
    function daChon() {
        return Array.prototype.filter.call(z('bang').querySelectorAll('input[data-ck]:checked'), function (c) { return c.getAttribute('data-ck') !== 'all'; })
            .map(function (c) { return DS[Number(c.getAttribute('data-ck'))]; }).filter(Boolean);
    }
    ums.report.mount(z('bc'), { reportText: 'Báo cáo', import: false, collect: function (add) {
        add('strPhamViTongHopDiem_Id', v('pv'));
        add('strDaoTao_ThoiGianDaoTao_Id', pvMa && f('pv_' + pvMa) ? v('pv_' + pvMa) : '');
        var l = loc();
        ['strTuKhoa', 'strNamNhapHoc', 'strKhoaQuanLy_Id', 'strHeDaoTao_Id', 'strKhoaDaoTao_Id', 'strChuongTrinh_Id', 'strLopQuanLy_Id', 'strTrangThaiNguoiHoc_Id', 'strTN_KeHoach_Id']
            .forEach(function (k) { add(k, l[k]); });
        add('strDaoTao_KhoaQuanLy_Id', v('kql'));
        if (cheDo === 'ds') daChon().forEach(function (x) { add('strQlsv_NguoiHoc_Id', x.ID); });
    } });

    /* ---------- Còn nợ môn --------------------------------------------- */
    var NM = [], trangNM = 1, coNM = 10;
    function noMon() {
        cheDo = 'nm';
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        var o = loc(); delete o.strNguoiThucHien_Id;
        ums.api.call(Object.assign({ action: 'D_BaoCao_MH/DSA4BSAvKRIgIikPLgwuLwPP', func: 'pkg_diem_baocao.LayDanhSachNoMon', strNguoiThucHien_Id: uid() }, o))
            .then(function (r) { NM = arr(r.data); trangNM = 1; veNM(); }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách nợ môn'); });
    }
    function veNM() {
        z('n').textContent = '(' + NM.length + ' — còn nợ môn)';
        var G1 = ['Thông tin sinh viên'], G2 = ['Thông tin học tập'];
        ui.table({ el: z('bang'), rows: NM.slice((trangNM - 1) * coNM, trangNM * coNM), empty: 'Không có sinh viên còn nợ môn', columns: [
            { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', group: G1, cls: 'is-nowrap' }, { title: 'Họ tên', group: G1, render: function (x) { return esc(e(x.QLSV_NGUOIHOC_HODEM) + ' ' + e(x.QLSV_NGUOIHOC_TEN)); } },
            { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN', group: G1 }, { title: 'Chương trình', group: G1, render: function (x) { return esc(e(x.DAOTAO_CHUONGTRINH_TEN) + '(' + e(x.DAOTAO_CHUONGTRINH_MA) + ')'); } },
            { title: 'Khoa quản lý', prop: 'DAOTAO_KHOAQUANLY_TEN', group: G1 }, { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN', group: G1 }, { title: 'Trạng thái', prop: 'QLSV_TRANGTHAINGUOIHOC_TEN', group: G1 },
            { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', group: G2, cls: 'is-nowrap' }, { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN', group: G2 },
            { title: 'Số tín', prop: 'DAOTAO_HOCPHAN_HOCTRINH', group: G2, cls: 'is-center' }, { title: 'Khối kiến thức', group: G2, render: function (x) { return esc(e(x.TENKHOI) + ' - ' + e(x.MAKHOI)); } },
            { title: 'Điểm', prop: 'DIEM', group: G2, cls: 'is-center' }, { title: 'Điểm quy đổi', prop: 'DIEMQUYDOI', group: G2, cls: 'is-center' },
            { title: 'Điểm chữ', prop: 'DIEMQUYDOI_TEN', group: G2, cls: 'is-center' }, { title: 'Đánh giá', prop: 'DANHGIA_TEN', group: G2, cls: 'is-center' },
            { title: 'Thời gian', prop: 'THOIGIAN', group: G2, cls: 'is-center' }, { title: 'Lớp tín chỉ', prop: 'DIEM_DANHSACHHOC_TEN', group: G2 }],
            page: { index: trangNM, size: coNM, total: NM.length, onChange: function (p) { trangNM = p; veNM(); }, onSize: function (s) { coNM = s === 'all' ? Math.max(NM.length, 1) : Number(s); trangNM = 1; veNM(); } } });
    }

    /* ---------- Tổng hợp dữ liệu học tập ------------------------------- */
    function uuid() { return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16).toUpperCase(); }); }
    function tongHop() {
        goiDS(1, 1000000).then(function (r) {
            var ds = arr(r.data);
            if (!ds.length) { ui.toast('Không có dữ liệu', 'info'); return; }
            return ui.confirm('Tổng hợp dữ liệu học tập cho ' + ds.length + ' dòng khớp bộ lọc (mọi trang)?', { title: 'Tổng hợp dữ liệu học tập', tone: 'warn' }).then(function (yes) {
                if (!yes) return;
                var khoa = uuid();
                return ui.batch(ds.map(function (x) {
                    return { action: 'D_TongHop_XuLy_MH/FS4vJgkuMQU0DSgkNAkuIhUgMQPP', func: 'PKG_DIEM_TONGHOP_XULY.TongHopDuLieuHocTap', strKhoaKiemTraDuLieu: khoa,
                        strQLSV_NguoiHoc_Id: x.QLSV_NGUOIHOC_ID, strDaoTao_ChuongTrinh_Id: x.DAOTAO_TOCHUCCHUONGTRINH_ID, strNguoiThucHien_Id: uid() };
                }), { title: 'Đang tổng hợp dữ liệu học tập', okText: 'Thực hiện hoàn tất', concurrency: 10, show: true });
            });
        }).catch(function (err) { ums.api.handle(err, 'tổng hợp dữ liệu'); });
    }

    /* ---------- Gửi email / Xuất Excel --------------------------------- */
    function email(x) { var ks = ['EMAIL', 'Email', 'EMAIL_CANHAN', 'TTLL_EMAILCANHAN', 'QLSV_NGUOIHOC_EMAIL', 'QLSV_NGUOIHOC_EMAILCANHAN', 'EMAILCANHAN', 'EMAIL_TRUONGCAP', 'EMAIL_TRUONG'];
        for (var i = 0; i < ks.length; i++) if (e(x[ks[i]]) !== '') return String(x[ks[i]]).trim(); return ''; }
    function hoTen(x) { return e(x.QLSV_NGUOIHOC_HODEM) + ' ' + e(x.QLSV_NGUOIHOC_TEN); }
    function thanEmail(x) {
        var no = Number(x.TONGNOPHI) || 0;
        function dong(a, b) { return '<tr><td style="border:1px solid #ccc;padding:6px 8px;background:#f5f5f5">' + a + '</td><td style="border:1px solid #ccc;padding:6px 8px">' + b + '</td></tr>'; }
        return '<html><body style="font-family:Arial,sans-serif;line-height:1.6;color:#333"><div style="max-width:640px;margin:0 auto;padding:20px;border:1px solid #ddd">' +
            '<div style="background:#1a71e8;color:#fff;padding:15px;text-align:center"><h2 style="margin:0">THÔNG BÁO KẾT QUẢ HỌC TẬP</h2></div><div style="padding:20px;background:#f9f9f9">' +
            '<p>Kính gửi: <strong>' + esc(hoTen(x)) + '</strong></p><p>Mã sinh viên: <strong>' + esc(e(x.QLSV_NGUOIHOC_MASO)) + '</strong></p>' +
            '<p>Nhà trường xin thông báo tình hình học tập và tài chính của bạn như sau:</p><table style="width:100%;border-collapse:collapse">' +
            dong('Lớp', esc(e(x.DAOTAO_LOPQUANLY_TEN))) + dong('Chương trình', esc(e(x.DAOTAO_CHUONGTRINH_TEN))) + dong('Khóa - Hệ', esc(e(x.DAOTAO_KHOADAOTAO_TEN) + ' - ' + e(x.DAOTAO_HEDAOTAO_TEN))) +
            dong('Trạng thái', esc(e(x.QLSV_TRANGTHAINGUOIHOC_TEN))) + dong('ĐTBTL Hệ 4 (toàn khóa)', esc(e(x.DTBTICHLUYHE4TOANKHOA))) + dong('ĐTBTL Hệ 10 (toàn khóa)', esc(e(x.DTBTICHLUYHE10TOANKHOA))) +
            dong('Số TC tích lũy', esc(e(x.SOTCTICHLUYTOANKHOA))) + dong('Công nợ tài chính', '<b style="color:' + (no > 0 ? '#c0392b' : '#333') + '">' + ui.money(no) + ' đ</b>') + '</table>' +
            (no > 0 ? '<div style="margin-top:12px;padding:10px;border:1px solid #c0392b;color:#c0392b">Lưu ý: Bạn hiện đang còn nợ tài chính. Đề nghị hoàn tất nghĩa vụ nộp phí để đảm bảo quyền lợi học tập.</div>' : '') +
            '<p style="margin-top:15px">Trân trọng.</p></div><div style="padding:15px;text-align:center;font-size:12px;color:#666"><p>Email này được gửi tự động từ hệ thống quản lý đào tạo.</p>' +
            '<p>Vui lòng không trả lời email này.</p></div></div></body></html>';
    }
    function guiEmail() {
        if (cheDo !== 'ds' || !DS.length) { ui.toast('Chưa có dữ liệu SV. Vui lòng tìm kiếm trước!', 'warn'); return; }
        var chon = daChon();
        pat.chonPhamVi({ title: 'Chọn phạm vi gửi Email', icon: 'fa-envelope', soChon: chon.length, daChon: 'Chỉ các sinh viên đã tick chọn', tatCa: 'Tất cả sinh viên đang hiển thị (' + DS.length + ' SV theo bộ lọc hiện tại)' })
            .then(function (m) {
                if (!m) return;
                pat.guiEmail({ title: 'Gửi Email kết quả học tập', list: m === 'daChon' ? chon : DS.slice(), email: email, than: thanEmail, tieuDe: '[THÔNG BÁO] Kết quả học tập và tình hình tài chính',
                    hint: 'VD: [THÔNG BÁO] Kết quả học tập học kỳ 1 năm học 2026-2027',
                    cot: [{ title: 'Mã SV', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' }, { title: 'Họ tên', render: function (x) { return esc(hoTen(x)); } }, { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' }],
                    cotSau: [{ title: 'ĐTBTL H4', prop: 'DTBTICHLUYHE4TOANKHOA', cls: 'is-center' }, { title: 'Số TCTL', prop: 'SOTCTICHLUYTOANKHOA', cls: 'is-center' },
                        { title: 'Công nợ', cls: 'is-right is-nowrap', render: function (x) { var n = Number(x.TONGNOPHI) || 0; return n > 0 ? '<b style="color:#c0392b">' + ui.money(n) + '</b>' : ui.money(n); } }] });
            });
    }
    function xuatExcel() {
        if (cheDo !== 'ds' || !DS.length) { ui.toast('Không có dữ liệu để xuất. Vui lòng tìm kiếm trước.', 'warn'); return; }
        var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; };
        ui.xuatXls('DSSV_InBangDiem' + (f('congno').checked ? '_ConNoTaiChinh' : '') + '_' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '_' + p(d.getHours()) + p(d.getMinutes()), {
            tieuDe: 'Danh sách sinh viên', dong: DS, cot: [
                { title: 'STT', get: function (x, i) { return i + 1; } }, { title: 'Mã số', get: function (x) { return e(x.QLSV_NGUOIHOC_MASO); } },
                { title: 'Họ đệm', get: function (x) { return e(x.QLSV_NGUOIHOC_HODEM); } }, { title: 'Tên', get: function (x) { return e(x.QLSV_NGUOIHOC_TEN); } },
                { title: 'Ngày sinh', get: function (x) { return e(x.QLSV_NGUOIHOC_NGAYSINH); } }, { title: 'Trạng thái', get: function (x) { return e(x.QLSV_TRANGTHAINGUOIHOC_TEN); } },
                { title: 'Tài chính (nợ)', get: function (x) { return Number(x.TONGNOPHI) || 0; } }, { title: 'Lớp', get: function (x) { return e(x.DAOTAO_LOPQUANLY_TEN); } },
                { title: 'Chương trình', get: function (x) { return e(x.DAOTAO_CHUONGTRINH_TEN); } }, { title: 'Khóa', get: function (x) { return e(x.DAOTAO_KHOADAOTAO_TEN); } },
                { title: 'Hệ', get: function (x) { return e(x.DAOTAO_HEDAOTAO_TEN); } }, { title: 'ĐTBTL Hệ 4', get: function (x) { return e(x.DTBTICHLUYHE4TOANKHOA); } },
                { title: 'ĐTBTL Hệ 10', get: function (x) { return e(x.DTBTICHLUYHE10TOANKHOA); } }, { title: 'Số TCTL', get: function (x) { return e(x.SOTCTICHLUYTOANKHOA); } }] });
    }
    function phim(ev) {
        if (!document.body.contains(root)) { document.removeEventListener('keydown', phim); return; }
        if (ev.ctrlKey && (ev.key === 'g' || ev.key === 'G')) { ev.preventDefault(); xuatExcel(); }
    }
    document.addEventListener('keydown', phim);

    /* ---------- Sự kiện -------------------------------------------------- */
    var HOP = { lich: 'lichHoc', tc: 'taiChinh', no: 'hpNo', hv: 'xuLyHocVu', qd: 'quyetDinh', tb: 'toanBo', dtb: 'diemTB', khoi: 'tichLuy', dk: 'ketQuaDK', lop: 'caLop', ct: 'khungCT', drl: 'renLuyen' };
    root.addEventListener('change', function (ev) {
        var t = ev.target;
        if (t.getAttribute('data-ck') === 'all') { Array.prototype.forEach.call(z('bang').querySelectorAll('tbody input[data-ck]'), function (c) { c.checked = t.checked; }); return; }
        if (t === f('congno') && cheDo === 'ds') ve();
    });
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-x][data-i]');
        if (b) { var r = DS[Number(b.getAttribute('data-i'))]; if (r) ibd[HOP[b.getAttribute('data-x')]](r); return; }
        if (!(b = ev.target.closest('[data-a]'))) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') { trang = 1; tai(); } else if (a === 'tonghop') tongHop(); else if (a === 'nomon') noMon();
        else if (a === 'email') guiEmail(); else if (a === 'excel') xuatExcel();
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); trang = 1; tai(); } });
})();
