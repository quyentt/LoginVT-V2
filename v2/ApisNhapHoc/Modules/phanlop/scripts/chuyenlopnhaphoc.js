/* =========================================================================
   Chuyển lớp — chỉ chuyển lớp, không thay đổi kế hoạch (nhập học)
   Bản gốc: ApisNhapHoc/Modules/phanlop/html/chuyenlopnhaphoc.html + scripts/chuyenlopnhaphoc.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc MỘT CỘT: thanh lọc (Kế hoạch tuyển sinh · từ khoá · Tìm kiếm · Import ▾ · Xuất báo cáo)
   → khung "Danh sách hồ sơ thí sinh (n)" + nút "Chuyển lớp": Mã số · Số báo danh · Họ đệm · Tên · Ngày sinh ·
   Lớp · Ngành đã nhập học · Ngành tuyển sinh · ô đánh dấu (phân trang máy chủ). Hộp "Chuyển nguyện vọng"
   (chữ nút / tiêu đề gốc): Hệ đào tạo → Khóa đào tạo → Lớp quản lý + Lý do.

   Lời gọi (chép nguyên):
     SV_Core_NhapHoc_ThuTien_MH/DSA4BRIKJAkuICIpDykgMQkuIgPP [PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc]
                                         ô Kế hoạch (TENKEHOACH) — ums.nhPhanLop.keHoachNhapHoc
     NH_NguoiHoc_ThongTinTuyenSinh/LayDanhSach  GET  strTuKhoa, strTaiChinh_KeHoach_Id, strNguoiThucHien_Id,
                                         dDaNhapHoc -1, pageIndex/pageSize
     edu.system.getList_HeDaoTao / KhoaDaoTao  = ums.ref.heDaoTao / khoaDaoTao (trang 1/1000000)
     edu.system.getList_LopQuanLy (Corei)      = ums.nhPhanLop.lopQuanLy { strDaoTao_HeDaoTao_Id, strKhoaDaoTao_Id,
                                         strToChucCT_Id '' (ô dropSearch_ChuongTrinh_QLTB không có trên màn) }
     NH_NguoiHoc_ThongTinTuyenSinh/ChuyenLop   POST mỗi dòng đánh dấu một lời gọi: strChucNang_Id, strTS_HoSoDuTuyen_Id
                                         (ID dòng), strDaoTao_LopQuanLy_Id, strLyDoChuyen, strNguoiThucHien_Id
     Import ▾ viết cứng trong html gốc: IMPORTWITHPROC_CLNH "Dồn lớp tự động", IMPORTWITHPROC_CDMS "Chuyển lớp và đổi
       mã số" (Corei showImportChungV2 → ums.report.importChung). Mẫu import được phân quyền (getList_MauImport
       "zonebtnBaoCao_CLNH" + vùng _Import) có thì THAY hai mục viết cứng — như gốc.
     Xuất báo cáo: ums.report.mount, collect không thêm khoá nào (callback gốc bị chú thích hết).

   Khác gốc / lỗi gốc đã sửa (tự chốt):
     · Từ khoá: gốc đọc ô 'txtAAAA' (không tồn tại) nên KHÔNG BAO GIỜ gửi chữ đã gõ dù ô từ khoá + Enter có trên
       màn → nay gửi đúng ô từ khoá.
     · Bấm "Chuyển lớp" trong hộp mà chưa chọn lớp: gốc vẫn gửi lớp rỗng → nay báo "Vui lòng chọn lớp quản lý".
     · Hệ → Khoá → Lớp trong hộp: chưa chọn tầng trên thì khoá tầng dưới (pat.chain). Danh sách hệ nạp khi mở hộp
       (gốc nạp lúc đổi kế hoạch — cùng lời gọi, không phụ thuộc kế hoạch).
     · Mã chết không dựng: .btnClose/.btnAdd/#btnLuuHoSo (không có trên màn), getList_ChuongTrinhDaoTao /
       ThoiGianDaoTao / NamNhapHoc / KhoaQuanLy, genList_TrangThaiSV (chép từ Quản lý toàn bộ, không nơi nào gọi).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, P = ums.nhPhanLop, e = P.e, esc = ui.esc;
    var root = document.getElementById('nh-chuyenlopnhaphoc');
    if (!root) return;

    var IMPORT = [
        { chu: '1. Dồn lớp tự động', ten: 'Dồn lớp tự động', ma: 'IMPORTWITHPROC_CLNH' },
        { chu: '2. Chuyển lớp và đổi mã số', ten: 'Chuyển lớp và đổi mã số', ma: 'IMPORTWITHPROC_CDMS' }
    ];
    var st = { page: 1, size: 10, total: 0, rows: [], daTim: false };

    root.innerHTML = pat.page('Chuyển lớp - chỉ chuyển lớp không thay đổi kế hoạch', '') +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            '<div class="ums-filter">' +
                '<div class="ums-field"><select class="ums-select" data-f="kh" data-ph="Chọn kế hoạch tuyển sinh">' +
                    '<option value="">Chọn kế hoạch tuyển sinh</option></select></div>' +
                '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
                '<div class="ums-field ums-field--fit" data-z="impGoc">' + P.drop('Import', 'fa-cloud-arrow-up', IMPORT) + '</div>' +
                '<div class="ums-field ums-field--fit" data-z="bc"></div>' +
            '</div>' }) +
        pat.panel({ title: 'Danh sách hồ sơ thí sinh', icon: 'fa-rectangle-history-circle-user', count: 'n', flush: true, zone: 'bang',
            tools: ui.btn('save', { text: 'Chuyển lớp', mod: 'primary', icon: 'fa-arrow-down-up-across-line', attr: { 'data-a': 'chuyenLop' } }) });

    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    ui.enhance(root);
    P.ganChon(z('bang'), 'hs');
    z('bang').innerHTML = ui.empty('Chọn kế hoạch tuyển sinh hoặc bấm Tìm kiếm để xem danh sách', 'fa-circle-info');

    P.keHoachNhapHoc().then(function (rows) { pat.fill(f('kh'), rows, { name: 'TENKEHOACH' }); },
        function (err) { ums.api.handle(err, 'kế hoạch'); });

    var tok = 0;
    function tai(page) {
        if (page) st.page = page;
        var t = ++tok;
        if (!st.rows.length) z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({
            action: 'NH_NguoiHoc_ThongTinTuyenSinh/LayDanhSach', method: 'GET',
            strTuKhoa: (f('q').value || '').trim(),
            strTaiChinh_KeHoach_Id: f('kh').value,
            strNguoiThucHien_Id: ums.session.userId,
            dDaNhapHoc: -1,
            pageIndex: st.page, pageSize: st.size
        }).then(function (r) {
            if (t !== tok) return;
            st.rows = Array.isArray(r.data) ? r.data : [];
            st.total = Number(r.pager) || st.rows.length;
            z('n').textContent = '(' + st.total + ')';
            ui.table({ el: z('bang'), rows: st.rows, stt: true, empty: 'Không có dữ liệu',
                page: { index: st.page, size: st.size, total: st.total, onChange: tai, onSize: function (s) { st.size = s; tai(1); } },
                columns: [
                    { title: 'Mã số', prop: 'MASO', cls: 'is-nowrap' },
                    { title: 'Số báo danh', prop: 'SOBAODANH', cls: 'is-nowrap' },
                    { title: 'Họ đệm', prop: 'HODEM' },
                    { title: 'Tên', prop: 'TEN', cls: 'is-nowrap' },
                    { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap', width: '120px' },
                    { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' },
                    { title: 'Ngành đã nhập học', prop: 'DAOTAO_NGANHNHAPHOC' },
                    { title: 'Ngành tuyển sinh', prop: 'DAOTAO_NGANHTRUNGTUYEN' },
                    P.cotChon('hs')
                ] });
        }, function (err) {
            if (t !== tok) return;
            z('bang').innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'danh sách hồ sơ thí sinh');
        });
    }

    /* ---------- Hộp "Chuyển nguyện vọng" ---------- */
    function chuyenLop() {
        var ids = P.chon(z('bang'), 'hs');
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng!', 'warn'); return; }
        function o(k, ph) { return '<select class="ums-select" data-cl="' + k + '" data-ph="' + ph + '"><option value="">' + ph + '</option></select>'; }
        var dlg = ui.dialog({
            title: 'Chuyển nguyện vọng', icon: 'fa-arrow-down-up-across-line', size: 'md',
            body: '<div class="ums-grid ums-grid--2">' +
                ui.field('Hệ đào tạo', o('he', 'Chọn hệ đào tạo')) +
                ui.field('Khóa đào tạo', o('khoa', 'Chọn khóa đào tạo')) +
                '<div style="grid-column:1 / -1">' + ui.field('Lớp quản lý', o('lop', 'Chọn lớp'), { required: true }) + '</div>' +
                '<div style="grid-column:1 / -1">' + ui.field('Lý do', '<input class="ums-input" data-cl="lydo" autocomplete="off">') + '</div>' +
                '</div>',
            buttons: [{ text: 'Chuyển lớp', mod: 'primary', icon: 'fa-arrow-down-up-across-line', onClick: function (d) {
                var chon = P.chon(z('bang'), 'hs');
                if (!chon.length) { ui.toast('Vui lòng chọn đối tượng!', 'warn'); return false; }
                var lop = D('lop').value;
                if (!lop) { ui.toast('Vui lòng chọn lớp quản lý', 'warn'); return false; }
                var lyDo = D('lydo').value;
                ui.confirm('Bạn có muốn chuyển lớp cho ' + chon.length + ' đối tượng không?', { ok: 'Chuyển lớp', title: 'Chuyển lớp' }).then(function (yes) {
                    if (!yes) return;
                    d.close();
                    ui.batch(chon.map(function (id) {
                        return { action: 'NH_NguoiHoc_ThongTinTuyenSinh/ChuyenLop',
                            strChucNang_Id: ums.state.chucNangId, strTS_HoSoDuTuyen_Id: id,
                            strDaoTao_LopQuanLy_Id: lop, strLyDoChuyen: lyDo, strNguoiThucHien_Id: ums.session.userId };
                    }), { title: 'Đang chuyển lớp', okText: 'Chuyển nguyện vọng thành công' }).then(function () { tai(); });
                });
                return false;
            } }]
        });
        function D(k) { return dlg.body.querySelector('[data-cl="' + k + '"]'); }
        ui.enhance(dlg.body);
        ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
            .then(function (r) { pat.fill(D('he'), r, { name: 'TENHEDAOTAO' }); }, function (err) { ums.api.handle(err, 'hệ đào tạo'); });
        function napKhoa() {
            if (!D('he').value) { pat.fill(D('khoa'), []); pat.fill(D('lop'), []); return; }
            ums.ref.khoaDaoTao({ strHeDaoTao_Id: D('he').value, strCoSoDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
                .then(function (r) { pat.fill(D('khoa'), r, { name: 'TENKHOA' }); }, function (err) { ums.api.handle(err, 'khóa đào tạo'); });
            napLop();
        }
        function napLop() {
            if (!D('khoa').value) { pat.fill(D('lop'), []); return; }
            P.lopQuanLy({ strCoSoDaoTao_Id: '', strDaoTao_HeDaoTao_Id: D('he').value, strKhoaDaoTao_Id: D('khoa').value,
                strNganh_Id: '', strLoaiLop_Id: '', strToChucCT_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
                .then(function (r) { pat.fill(D('lop'), r, { name: 'TEN' }); }, function (err) { ums.api.handle(err, 'lớp quản lý'); });
        }
        jQuery(D('he')).on('select2:select select2:clear', napKhoa);
        jQuery(D('khoa')).on('select2:select select2:clear', napLop);
        pat.chain([D('he'), D('khoa'), D('lop')], { phatLai: false });
    }

    /* ---------- Báo cáo / Import ---------- */
    ums.report.mount(z('bc'), {
        collect: function () { /* gốc: callback rỗng (mọi dòng bị chú thích) */ },
        onLoad: function (rows) {
            var coImport = (rows || []).some(function (t) { return /^IMPORT/i.test(e(t.MAUIMPORT_MA)); });
            z('impGoc').hidden = coImport;      // mẫu được phân quyền thay hai mục viết cứng (như cbGenCombo_MauImport gốc)
        },
        onImported: function () { if (st.daTim) tai(); }
    });

    /* ---------- Sự kiện ---------- */
    root.addEventListener('click', function (ev) {
        var t = ev.target, b;
        if ((b = t.closest('.ums-drop__toggle')) && z('impGoc').contains(b)) { P.batDrop(b); return; }
        if ((b = t.closest('[data-nhdrop]'))) {
            P.dongDrop(b);
            var x = IMPORT[Number(b.getAttribute('data-nhdrop'))];
            ums.report.importChung(x.ten, x.ma, { onDone: function () { if (st.daTim) tai(); } });
            return;
        }
        if (t.closest('[data-a="search"]')) { st.daTim = true; tai(1); }
        else if (t.closest('[data-a="chuyenLop"]')) chuyenLop();
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); st.daTim = true; tai(1); } });
    jQuery(f('kh')).on('select2:select', function () { st.daTim = true; tai(1); });
})();
