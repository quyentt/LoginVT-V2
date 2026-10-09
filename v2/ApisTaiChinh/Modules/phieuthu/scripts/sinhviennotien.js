/* =========================================================================
   Sinh viên còn nợ tiền
   Bản gốc: ApisTaiChinh/Modules/phieuthu/html/sinhviennotien.html + scripts/sinhviennotien.js
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên — tham số, GET/POST, có/không versionAPI như bản gốc):
     Ô chọn / danh sách đánh dấu
       ums.ref.heDaoTao / khoaDaoTao / chuongTrinh / lopQuanLy / thoiGianDaoTao
           (= edu.system.getList_*, pageSize 1000000 / 100000 như bản gốc;
            chương trình chỉ lọc theo khoá, lớp lọc theo hệ + khoá + CT)
       KHCT_NamNhapHoc/LayDanhSach   GET   → NAMNHAPHOC (chọn nhiều)
       KHCT_KhoaQuanLy/LayDanhSach   GET   → ID/TEN (chọn nhiều)
       TC_KhoanThu/LayDanhSach       GET   ô đánh dấu "Chọn khoản nợ" (strCanBoQuanLy_Id viết hoa khác màn khác)
       CM_DanhMucDuLieu/LayDanhSach  GET   QLSV.TRANGTHAI — ô đánh dấu trạng thái SV
     Danh sách
       TC_NguoiHoc/LayDSNguoiHocConNoTien   POST, phân trang máy chủ (10/trang);
           cùng lời gọi, trang 1000 dòng, khi lấy "toàn bộ khớp bộ lọc"
     Tổng hợp dữ liệu
       TC_NguoiHoc/LayDSNguoiHoc  GET → mỗi người học một lời gọi POST
       TC_NguoiHoc/TongHopDuNoSinhVien, hoặc TongHopDuNoSinhVien_UT khi có
       từ ngày / đến ngày. Số luồng song song = ô "N luồng cùng chạy"
       (bản gốc đổi edu.system.iGioiHanLuong).
     Gửi email báo nợ
       CMS_NguoiDung/SendEmail  POST tuần tự, thân email HTML dựng như bản gốc
     Xoá nợ (không hạch toán công nợ)
       PKG_TAICHINH_NGUOIHOC2.ThucHienKhongHachToanCongNo  (có func → mã hoá)
       strId = ID || TAICHINH_TONGHOPNOCHUNG_ID
     Báo cáo: ums.report.mount (edu.system.getList_MauImport) + hai mẫu tĩnh
       ThongKe_TongHopNoHocPhi / ThongKe_TongHopNoHocPhiRieng — bản gốc chỉ
       hiện hai mẫu tĩnh khi chức năng chưa được phân quyền mẫu nào.

   Cố ý bỏ / khác:
     · Cột "Nội dung" bản gốc hiển thị lại TAICHINH_CACKHOANTHU_TEN (trùng cột
       Khoản thu) — giữ đúng như vậy vì không có cột nội dung riêng.
     · edu.system.collageInTable gộp theo cột Stt (sau khi đảo cột) nên không
       bao giờ gộp được dòng nào → bỏ.
     · Ô "Người thu" bị ẩn và không bao giờ được nạp → strNguoiDung_Id luôn ''.
     · Email: tên / mã / lớp chèn vào HTML đã qua ums.ui.esc.
   Giữ nguyên (nghi ngờ lỗi bản gốc, ghi lại để nghiệp vụ xác nhận):
     · "Tổng hợp dữ liệu" gửi strTrangThaiNguoiHoc_Id = nội dung ô TỪ KHOÁ,
       strTuKhoa = '' (ô txtAAAA không tồn tại).
     · Danh sách nợ không gửi học kỳ; học kỳ chỉ dùng cho báo cáo và tổng hợp
       theo khoảng ngày.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc, T = ums.tcTraCuu;
    var root = document.getElementById('sinhviennotien');
    var st = { rows: [], page: 1, size: 10, total: 0, allPages: false, loaded: false };

    function uid() { return (ums.session && ums.session.userId) || ''; }
    function sel(k, head, multi) { return '<div class="ums-field">' + T.sel(k, head, multi) + '</div>'; }

    root.innerHTML =
        '<div class="ums-page__head"><h1 class="ums-page__title ums-u-mb-0">Sinh viên còn nợ tiền</h1>' +
        '<div class="ums-page__actions"><span data-z="report"></span>' +
        '<span class="ums-row" data-z="bctinh">' +
        '<button type="button" class="ums-btn ums-btn--out-info" data-bc="ThongKe_TongHopNoHocPhi"><i class="fa-light fa-file-excel"></i><span>BC tổng hợp nợ</span></button>' +
        '<button type="button" class="ums-btn ums-btn--out-info" data-bc="ThongKe_TongHopNoHocPhiRieng"><i class="fa-light fa-file-excel"></i><span>BC tổng hợp nợ riêng</span></button>' +
        '</span></div></div>' +

        '<div class="ums-panel ums-u-mb-4"><div class="ums-panel__body">' +
        '<div class="ums-grid ums-grid--4 svnt-grid">' +
        sel('he', 'Tất cả hệ đào tạo') + sel('khoa', 'Tất cả khoá đào tạo') +
        sel('ct', 'Tất cả chương trình đào tạo') + sel('lop', 'Tất cả lớp') +
        sel('hocKy', 'Tất cả học kỳ') +
        '<div class="ums-field" data-z="phamvi" hidden><select class="ums-select" data-k="kyThucHien"><option value="1">Trong kỳ này</option><option value="0">Đến kỳ này</option></select></div>' +
        sel('nam', '', true) + sel('khoaQL', '', true) +
        '<div class="ums-field"><select class="ums-select" data-k="luong">' +
        [10, 1, 2, 30, 50, 100, 200, 500, 1000].map(function (n) {
            return '<option value="' + n + '">' + (n === 1 ? '1 luồng chạy' : n === 2 ? '2 luồng chạy' : n + ' luồng cùng chạy') + '</option>';
        }).join('') + '</select></div>' +
        '</div>' +
        '<div class="ums-filter ums-u-mt-4">' +
        '<div class="ums-field" style="flex:0 1 180px"><div class="ums-inputwrap"><input class="ums-input" data-k="tuNgay" placeholder="Từ ngày dd/mm/yyyy" autocomplete="off"><i class="fa-light fa-calendar"></i></div></div>' +
        '<div class="ums-field" style="flex:0 1 180px"><div class="ums-inputwrap"><input class="ums-input" data-k="denNgay" placeholder="Đến ngày dd/mm/yyyy" autocomplete="off"><i class="fa-light fa-calendar"></i></div></div>' +
        '<div class="ums-field"><input class="ums-input" data-k="tuKhoa" placeholder="Nhập từ khoá tìm kiếm" autocomplete="off"></div>' +
        '</div>' +
        '<div class="ums-row ums-u-mt-4">' +
        ui.btn('search', { attr: { 'data-a': 'tim' } }) +
        '<button type="button" class="ums-btn ums-btn--out-primary" data-a="tonghop"><i class="fa-light fa-circle-dollar-to-slot"></i><span>Tổng hợp dữ liệu</span></button>' +
        '<span class="ums-u-flex1"></span>' +
        '<button type="button" class="ums-btn ums-btn--primary" data-a="email" title="Gửi email báo nợ cho các sinh viên đã chọn"><i class="fa-light fa-envelope"></i><span>Gửi Email</span></button>' +
        '<button type="button" class="ums-btn ums-btn--danger" data-a="xoano" title="Xoá nợ (không hạch toán công nợ) cho các bản ghi đã chọn"><i class="fa-light fa-trash-can"></i><span>Xoá nợ</span></button>' +
        '</div></div></div>' +

        '<div class="ums-grid ums-grid--main-aside ums-u-mb-4">' +
        '<div><div class="ums-panel"><div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-circle-dollar"></i> Chọn khoản nợ</div></div>' +
        '<div class="ums-panel__body" data-z="khoan">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div></div></div>' +
        '<div><div class="ums-panel"><div class="ums-panel__head"><div class="ums-panel__title ums-u-danger"><i class="fa-light fa-user-graduate"></i> Chọn trạng thái sinh viên</div></div>' +
        '<div class="ums-panel__body" data-z="trangthai">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div></div></div>' +
        '</div>' +

        '<div class="ums-panel"><div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-users"></i> Sinh viên nợ tiền ' +
        '<span class="ums-u-faint ums-u-fz13" data-z="count"></span></div></div>' +
        '<div class="ums-panel__body ums-panel__body--flush" data-z="table">' + ui.empty('Hãy ấn nút tìm kiếm để tải danh sách', 'fa-magnifying-glass') + '</div></div>';

    function z(n) { return root.querySelector('[data-z="' + n + '"]'); }
    function k(n) { return root.querySelector('[data-k="' + n + '"]'); }
    function val(n) { var e = k(n); return e ? (e.value || '').trim() : ''; }

    Array.prototype.forEach.call(root.querySelectorAll('select.ums-select'), function (e) {
        var ph = e.multiple ? (e.getAttribute('data-k') === 'nam' ? 'Tất cả năm nhập học' : 'Tất cả khoa quản lý') : e.options[0].textContent;
        ui.select2(e, { placeholder: ph, allowClear: false });
    });
    ui.datepicker(k('tuNgay'));
    ui.datepicker(k('denNgay'));

    /* ---------- Ô đánh dấu khoản nợ / trạng thái ----------
       Bản dựng ở tầng chung — ums.pat.checks (trước đây màn này tự vẽ). */
    var CK = {};
    function checklist(host, rows, cls) {
        CK[cls] = ums.pat.checks(host, rows, { cols: 3, empty: 'Không tìm thấy dữ liệu' });
    }
    function checked(cls) {
        return CK[cls] ? CK[cls].ids() : [];
    }

    /* ---------- Nạp nguồn ---------- */
    function loadKhoa() {
        return ums.ref.khoaDaoTao({ strHeDaoTao_Id: val('he'), strCoSoDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
            .then(function (r) { T.fill(k('khoa'), r, { name: 'TENKHOA', head: 'Tất cả khoá đào tạo' }); });
    }
    function loadCT() {
        return ums.ref.chuongTrinh({ strKhoaDaoTao_Id: val('khoa'), strN_CN_LOP_Id: '', strKhoaQuanLy_Id: '', strToChucCT_Cha_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
            .then(function (r) { T.fill(k('ct'), r, { name: 'TENCHUONGTRINH', head: 'Tất cả chương trình đào tạo' }); });
    }
    function loadLop() {
        return ums.ref.lopQuanLy({ strCoSoDaoTao_Id: '', strDaoTao_HeDaoTao_Id: val('he'), strKhoaDaoTao_Id: val('khoa'), strNganh_Id: '', strLoaiLop_Id: '', strToChucCT_Id: val('ct'), strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
            .then(function (r) { T.fill(k('lop'), r, { name: 'TEN', head: 'Tất cả lớp' }); });
    }
    function fail(what) { return function (e) { ums.api.handle(e, what); }; }

    ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
        .then(function (r) { T.fill(k('he'), r, { name: 'TENHEDAOTAO', head: 'Tất cả hệ đào tạo' }); }).catch(fail('hệ đào tạo'));
    loadKhoa().catch(fail('khoá đào tạo'));
    loadCT().catch(fail('chương trình'));
    loadLop().catch(fail('lớp'));
    ums.ref.thoiGianDaoTao({ strNam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 })
        .then(function (r) { T.fill(k('hocKy'), r, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Tất cả học kỳ' }); }).catch(fail('học kỳ'));

    ums.api.call({ action: 'KHCT_NamNhapHoc/LayDanhSach', method: 'GET', silent: true, versionAPI: 'v1.0', strNguoiThucHien_Id: '' })
        .then(function (r) { T.fill(k('nam'), T.rows(r), { id: 'NAMNHAPHOC', name: 'NAMNHAPHOC', head: false }); }).catch(fail('năm nhập học'));
    ums.api.call({ action: 'KHCT_KhoaQuanLy/LayDanhSach', method: 'GET', silent: true, versionAPI: 'v1.0', strNguoiThucHien_Id: '' })
        .then(function (r) { T.fill(k('khoaQL'), T.rows(r), { head: false }); }).catch(fail('khoa quản lý'));

    ums.api.call({
        action: 'TC_KhoanThu/LayDanhSach', method: 'GET', silent: true,
        strTuKhoa: '', pageIndex: 1, pageSize: 10000, iTinhTrang: -1, strNhomCacKhoanThu_Id: '',
        strNguoiTao_Id: '', strCanBoQuanLy_Id: '', strNguoiThucHien_Id: ''
    }).then(function (r) { checklist(z('khoan'), T.rows(r), 'lkt'); })
        .catch(function (e) { z('khoan').innerHTML = ui.fail(e.message); ums.api.handle(e, 'khoản thu'); });

    ums.api.call({ action: 'CM_DanhMucDuLieu/LayDanhSach', method: 'GET', silent: true, versionAPI: 'v1.0', strMaBangDanhMuc: 'QLSV.TRANGTHAI' })
        .then(function (r) { checklist(z('trangthai'), T.rows(r), 'tt'); })
        .catch(function (e) { z('trangthai').innerHTML = ui.fail(e.message); ums.api.handle(e, 'trạng thái sinh viên'); });

    if (window.jQuery) {
        var $ = window.jQuery;
        $(k('he')).on('change', function () { loadKhoa().then(loadCT).then(loadLop).catch(fail('danh mục đào tạo')); });
        $(k('khoa')).on('change', function () { loadCT().then(loadLop).catch(fail('danh mục đào tạo')); });
        $(k('ct')).on('change', function () { loadLop().catch(fail('lớp')); });
        $(k('hocKy')).on('change', function () { z('phamvi').hidden = !this.value; });
    }

    /* ---------- Tham số lọc chung ---------- */
    function listCall(pageIndex, pageSize) {
        return {
            action: 'TC_NguoiHoc/LayDSNguoiHocConNoTien',
            versionAPI: 'v1.0',
            pageIndex: pageIndex,
            pageSize: pageSize,
            strTrangThaiNguoiHoc_Id: checked('tt').toString(),
            strTAICHINH_CacKhoanThu_Ids: checked('lkt').toString(),
            strTaiChinh_KhoanKhac_Ids: '',
            strTuNgay: val('tuNgay'),
            strDenNgay: val('denNgay'),
            strHeDaoTao_Id: val('he'),
            strKhoaDaoTao_Id: val('khoa'),
            strChuongTrinh_Id: val('ct'),
            strLopQuanLy_Id: val('lop'),
            strTuKhoa: val('tuKhoa'),
            strNguoiDung_Id: '',
            strNamNhapHoc: T.multi(k('nam')),
            strKhoaQuanLy_Id: T.multi(k('khoaQL'))
        };
    }

    /* ---------- Danh sách ---------- */
    function draw() {
        z('count').textContent = '(' + st.total + ')';
        var start = (st.page - 1) * st.size;
        ui.table({
            el: z('table'), rows: st.rows, stt: false, empty: 'Không có sinh viên nợ tiền',
            page: {
                index: st.page, size: st.size, total: st.total,
                onChange: function (p) {
                    if (p >= 1 && p <= Math.ceil(st.total / st.size)) load(p);
                },
                onSize: function (v) { st.size = v; load(1); }
            },
            columns: [
                { head: '<input type="checkbox" data-pickall="nt" title="Chọn tất cả"' + (st.allPages ? ' checked' : '') + '>', cls: 'is-center', width: '44px',
                    render: function (r, i) { return '<input type="checkbox" data-pick="nt" data-i="' + i + '"' + (st.allPages ? ' checked' : '') + '>'; } },
                { title: 'Stt', cls: 'is-center', width: '56px', render: function (r, i) { return String(start + i + 1); } },
                { title: 'Mã số', prop: 'MASONGUOIHOC', cls: 'is-nowrap' },
                { title: 'Họ tên', prop: 'HOTENNGUOIHOC' },
                { title: 'Lớp', prop: 'LOP' },
                { title: 'Học kỳ', prop: 'DAOTAO_THOIGIANDAOTAO', cls: 'is-center' },
                { title: 'Khoản thu', prop: 'TAICHINH_CACKHOANTHU_TEN' },
                { title: 'Nội dung', prop: 'TAICHINH_CACKHOANTHU_TEN' },
                { title: 'Số tiền', prop: 'SOTIEN', cls: 'is-right is-nowrap', sum: true, render: function (r) { return ui.money(r.SOTIEN || 0); } }
            ]
        });
    }

    function load(page) {
        if (page) st.page = page;
        var call = listCall(st.page, st.size);
        if (!call.strTAICHINH_CacKhoanThu_Ids) {
            ui.toast('Vui lòng chọn khoản thu. Để có thể lấy danh sách khoản thu!', 'warn');
            return Promise.resolve();
        }
        z('table').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call(call).then(function (r) {
            st.rows = T.rows(r);
            st.total = st.rows.length ? (Number(r.pager) || st.rows.length) : 0;
            st.loaded = true;
            draw();
        }).catch(function (e) {
            z('table').innerHTML = ui.fail(e.message);
            ums.api.handle(e, 'danh sách nợ');
        });
    }

    function pickedRows() { return T.picked(root, 'nt', st.rows); }

    /* Toàn bộ dòng khớp bộ lọc — trang 1000 dòng, tuần tự (getAll_KhoanThu_ForEmail) */
    function fetchAll() {
        var call1 = listCall(1, 1000);
        if (!call1.strTAICHINH_CacKhoanThu_Ids) { ui.toast('Vui lòng chọn khoản thu!', 'warn'); return Promise.resolve([]); }
        var all = [], pages = 1, total = 0, prog = null;
        function chunk(i) {
            return ums.api.call(listCall(i, 1000)).then(function (r) {
                var rows = T.rows(r);
                all = all.concat(rows);
                if (i === 1) {
                    total = Number(r.pager) || all.length;
                    pages = Math.max(1, Math.ceil(total / 1000));
                    prog = T.progress('Đang tải danh sách sinh viên nợ tiền (' + total.toLocaleString('en-US') + ')');
                }
                prog.set(i, pages, 'Trang ' + i + ' / ' + pages);
                if (i < pages && rows.length) return chunk(i + 1);
                return all;
            });
        }
        return chunk(1).then(function (x) { if (prog) prog.close(); return x; }, function (e) {
            if (prog) prog.close();
            ums.api.handle(e, 'tải danh sách');
            return [];
        });
    }

    /* Hộp chọn phạm vi: chỉ dòng đã chọn / toàn bộ khớp bộ lọc */
    function chonPhamVi(opts) {   // tầng chung: ums.pat.chonPhamVi
        return pat.chonPhamVi(Object.assign({ soChon: pickedRows().length }, opts));
    }

    function rowsFor(mode) {
        if (mode === 'tatCa') return fetchAll();
        return Promise.resolve(pickedRows());
    }

    /* ---------- Gửi email báo nợ ---------- */
    function email(r) { return r.EMAIL || r.Email || r.TTLL_EMAILCANHAN || ''; }

    function previewText(d) {
        return 'Kính gửi <b>' + esc(d.HOTENNGUOIHOC || '') + '</b> (MSSV: ' + esc(d.MASONGUOIHOC || '') + '). Bạn hiện đang còn nợ khoản <b>' +
            esc(d.TAICHINH_CACKHOANTHU_TEN || '') + '</b> học kỳ ' + esc(d.DAOTAO_THOIGIANDAOTAO || '') + ': <b style="color:#c0392b">' +
            ui.money(d.SOTIEN || 0) + ' đ</b>. Đề nghị hoàn tất nghĩa vụ nộp phí.';
    }

    function emailBody(d) {
        var tien = ui.money(d.SOTIEN || 0);
        return '<html><head><style>' +
            'body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }' +
            '.email-container { max-width: 640px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; }' +
            '.email-header { background-color: #c0392b; color: white; padding: 15px; text-align: center; }' +
            '.email-body { padding: 20px; background-color: #f9f9f9; }' +
            '.tbl-no { width: 100%; border-collapse: collapse; margin-top: 10px; }' +
            '.tbl-no th, .tbl-no td { border: 1px solid #ccc; padding: 8px; }' +
            '.tbl-no th { background: #eee; }' +
            '.money { color: #c0392b; font-weight: bold; }' +
            '.email-footer { padding: 15px; text-align: center; font-size: 12px; color: #666; }' +
            '</style></head><body>' +
            '<div class="email-container">' +
            '<div class="email-header"><h2>THÔNG BÁO NHẮC NỘP HỌC PHÍ</h2></div>' +
            '<div class="email-body">' +
            '<p>Kính gửi: <strong>' + esc(d.HOTENNGUOIHOC || '') + '</strong></p>' +
            '<p>Mã sinh viên: <strong>' + esc(d.MASONGUOIHOC || '') + '</strong> — Lớp: <strong>' + esc(d.LOP || '') + '</strong></p>' +
            '<p>Nhà trường xin thông báo, hiện tại bạn đang còn nợ khoản phí sau:</p>' +
            '<table class="tbl-no">' +
            '<tr><th>Học kỳ</th><th>Khoản thu</th><th>Số tiền còn nợ</th></tr>' +
            '<tr><td>' + esc(d.DAOTAO_THOIGIANDAOTAO || '') + '</td><td>' + esc(d.TAICHINH_CACKHOANTHU_TEN || '') + '</td><td class="money" style="text-align:right">' + tien + ' đ</td></tr>' +
            '</table>' +
            '<p style="margin-top:15px">Đề nghị bạn hoàn tất nghĩa vụ nộp phí để đảm bảo quyền lợi học tập.</p>' +
            '<p>Trân trọng.</p>' +
            '</div>' +
            '<div class="email-footer">' +
            '<p>Email này được gửi tự động từ hệ thống quản lý tài chính.</p>' +
            '<p>Vui lòng không trả lời email này.</p>' +
            '</div>' +
            '</div>' +
            '</body></html>';
    }

    function openEmail(list) {   // tầng chung: ums.pat.guiEmail (xem trước + gửi tuần tự)
        pat.guiEmail({ title: 'Gửi Email báo nợ học phí', list: list, email: email, than: emailBody,
            tieuDe: '[THÔNG BÁO] Nhắc nộp các khoản phí còn nợ',
            hint: 'Có thể ghi thời hạn nộp ngay trong tiêu đề (VD: "Hạn nộp: dd/mm/yyyy") — nội dung tự sinh không có thời gian.',
            ghiChu: 'Nội dung email được hệ thống <b>tự sinh</b> theo từng sinh viên: Họ tên, Mã SV, Lớp, Học kỳ, Khoản thu, Số tiền còn nợ.',
            cot: [{ title: 'Mã SV', prop: 'MASONGUOIHOC', cls: 'is-nowrap' }, { title: 'Họ tên', prop: 'HOTENNGUOIHOC' }, { title: 'Lớp', prop: 'LOP' }],
            cotSau: [{ title: 'Khoản thu', prop: 'TAICHINH_CACKHOANTHU_TEN' },
                { title: 'Nội dung email', render: function (d) { return '<span class="ums-u-fz12">' + previewText(d) + '</span>'; } },
                { title: 'Số tiền', cls: 'is-right is-nowrap', render: function (d) { return ui.money(d.SOTIEN || 0); } }] });
    }

    /* ---------- Xoá nợ ---------- */
    function xoaNo(list, mode) {
        if (!list.length) { ui.toast('Không có bản ghi nào để xóa nợ!', 'warn'); return; }
        var msg = (mode === 'tatCa' ? 'XÁC NHẬN LẠI: Bạn đang xoá nợ TOÀN BỘ ' + list.length + ' bản ghi khớp bộ lọc (tất cả các trang). ' : '') +
            'Bạn có chắc chắn muốn xoá nợ cho ' + list.length + ' bản ghi không? Thao tác này không thể hoàn tác.';
        ui.confirm(msg, { tone: 'bad', ok: 'Xoá nợ', title: 'Xoá nợ (không hạch toán công nợ)' }).then(function (yes) {
            if (!yes) return;
            var calls = list.map(function (d) {
                var id = d.ID || d.TAICHINH_TONGHOPNOCHUNG_ID || '';
                var label = (d.MASONGUOIHOC || '') + ' - ' + (d.HOTENNGUOIHOC || '') + ' [' + (d.TAICHINH_CACKHOANTHU_TEN || '') + ']';
                return function () {
                    if (!id) return Promise.reject(new Error(label + ' → thiếu Id bản ghi'));
                    return ums.api.call({
                        action: 'TC_NGUOIHOC2_MH/FSk0IgkoJC8KKS4vJgkgIikVLiAvAi4vJg8u',
                        func: 'PKG_TAICHINH_NGUOIHOC2.ThucHienKhongHachToanCongNo',
                        strId: id,
                        strNguoiThucHien_Id: ''
                    }).catch(function (e) { if (!e.expired) e.message = label + ' → ' + e.message; throw e; });
                };
            });
            return ui.batch(calls, { title: 'Đang xoá nợ', okText: 'Xoá nợ thành công' }).then(function () {
                st.allPages = false;
                load();
            });
        });
    }

    /* ---------- Tổng hợp dữ liệu ---------- */
    function tongHop() {
        ui.confirm('Bạn có chắc chắn muốn tổng hợp dữ liệu không?', { ok: 'Tổng hợp' }).then(function (yes) {
            if (!yes) return;
            return ums.api.call({
                action: 'TC_NguoiHoc/LayDSNguoiHoc', method: 'GET',
                strTuKhoa: '',
                strHeDaoTao_Id: val('he'),
                strKhoaDaoTao_Id: val('khoa'),
                strChuongTrinh_Id: val('ct'),
                strLopQuanLy_Id: val('lop'),
                strNguoiThucHien_Id: '',
                strTrangThaiNguoiHoc_Id: val('tuKhoa')
            }).then(function (r) {
                var sv = T.rows(r);
                if (!sv.length) { ui.toast('Không có người học nào để tổng hợp', 'warn'); return; }
                var theoNgay = !!(val('tuNgay') || val('denNgay'));
                var calls = sv.map(function (x) {
                    return theoNgay ? {
                        action: 'TC_NguoiHoc/TongHopDuNoSinhVien_UT',
                        type: 'POST',
                        strNguoiThucHien_Id: '',
                        strNguoiHoc_Id: x.ID,
                        strNgayBatDau: val('tuNgay'),
                        strNgayKetThuc: val('denNgay'),
                        strPhamViThongKe: '',
                        strThoiGianDaoTao_Id: val('hocKy')
                    } : {
                        action: 'TC_NguoiHoc/TongHopDuNoSinhVien',
                        strNguoiThucHien_Id: '',
                        strQLSV_NguoiHoc_Id: x.ID
                    };
                });
                return ui.batch(calls, { title: 'Đang tổng hợp dữ liệu', concurrency: Number(val('luong')) || 10, okText: 'Thực hiện thành công. Hãy kiểm tra lại' });
            });
        }).catch(fail('tổng hợp dữ liệu'));
    }

    /* ---------- Báo cáo ---------- */
    function collect(add) {
        var khoan = checked('lkt');
        var tt = checked('tt').toString();
        if (!khoan.length) { ui.toast('Vui lòng chọn khoản thu!', 'warn'); return false; }
        if (tt === '') { ui.toast('Vui lòng chọn trạng thái!', 'warn'); return false; }
        add('strNguoiDangNhap_Id', uid());
        add('strMaTruong', 'KCNTTTN');
        add('strHeDaoTao_Id', val('he'));
        add('strKhoaDaoTao_Id', val('khoa'));
        add('strChuongTrinh_Id', val('ct'));
        add('strLopQuanLy_Id', val('lop'));
        add('strThoiGianDaoTao_Id', val('hocKy'));
        add('strPhamViApDung', val('hocKy') === '' ? '' : val('kyThucHien'));
        add('strTuNgay', val('tuNgay'));
        add('strDenNgay', val('denNgay'));
        add('strTuKhoa', val('tuKhoa'));
        add('strKhoaQuanLy_Id', T.multi(k('khoaQL')));
        add('strNamNhapHoc', T.multi(k('nam')));
        khoan.forEach(function (id) { add('strTAICHINH_CacKhoanThu_Ids', id); });
        add('strTrangThaiNguoiHoc_Id', tt);
    }
    ums.report.mount(z('report'), { collect: collect });
    // Chức năng đã có mẫu báo cáo phân quyền thì ẩn hai mẫu tĩnh (như bản gốc)
    if (window.MutationObserver) {
        var mo = new MutationObserver(function () { z('bctinh').hidden = !!z('report').children.length; });
        mo.observe(z('report'), { childList: true });
    }

    /* ---------- Sự kiện ---------- */
    root.addEventListener('click', function (e) {
        var bc = e.target.closest('[data-bc]');
        if (bc && root.contains(bc)) { ums.report.run(bc.getAttribute('data-bc'), { collect: collect }); return; }
        var a = e.target.closest('[data-a]');
        if (!a || !root.contains(a)) return;
        switch (a.getAttribute('data-a')) {
            case 'tim': st.allPages = false; load(1); break;
            case 'tonghop': tongHop(); break;
            case 'email':
                chonPhamVi({ title: 'Chọn phạm vi gửi Email', icon: 'fa-envelope', daChon: 'Chỉ sinh viên đã chọn', tatCa: 'Toàn bộ sinh viên khớp bộ lọc (tất cả các trang)' })
                    .then(function (m) { if (m) return rowsFor(m).then(openEmail); });
                break;
            case 'xoano':
                chonPhamVi({ title: 'Chọn phạm vi Xoá nợ', icon: 'fa-trash-can', daChon: 'Chỉ bản ghi đã chọn', tatCa: 'Toàn bộ bản ghi khớp bộ lọc (sẽ hỏi xác nhận lại)',
                    warn: 'Không hạch toán công nợ. Thao tác này <b>không thể hoàn tác</b> — kiểm tra kỹ trước khi xác nhận.' })
                    .then(function (m) { if (m) return rowsFor(m).then(function (list) { xoaNo(list, m); }); });
                break;
        }
    });
    root.addEventListener('change', function (e) {
        var t = e.target;
        if (t.matches('[data-all]')) {
            root.querySelectorAll('[data-ck="' + t.getAttribute('data-all') + '"]').forEach(function (x) { x.checked = t.checked; });
        } else if (t.matches('[data-pickall="nt"]')) {
            st.allPages = t.checked;                     // bSelectAllPages: giữ dấu chọn khi sang trang
            root.querySelectorAll('[data-pick="nt"]').forEach(function (x) { x.checked = t.checked; });
        } else if (t.matches('[data-pick="nt"]') && !t.checked) {
            st.allPages = false;
            var all = root.querySelector('[data-pickall="nt"]');
            if (all) all.checked = false;
        }
    });
    root.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && e.target === k('tuKhoa')) { e.preventDefault(); st.allPages = false; load(1); }
    });
})();
