/* =========================================================================
   Báo cáo đăng ký học
   Bản gốc: ApisDangKyHoc/Modules/kehoachdangky/html/baocaodangkyhoc.html + script/baocaodangkyhoc.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc — MỘT cột: khối "Tìm kiếm" (10 ô chọn, ô "Chỉ hiện các lớp chưa phân
   công", Từ số / Đến số, từ khoá, hai nút xem, Xuất báo cáo, "Chọn trạng thái sinh viên")
   → khung "Danh sách (n)" (bảng lớp học phần, phân trang máy chủ, ô đánh dấu cuối dòng)
   → bấm số SV đã đăng ký mở hộp "Danh sách sinh viên".

   Lời gọi (chép nguyên action / tham số / cột):
     DKH_Chung/LayThoiGianDangKyHoc          Thời gian (ID / DAOTAO_THOIGIANDAOTAO)       GET
     edu.system.getList_HeDaoTao / getList_KhoaQuanLy → ums.ref.heDaoTao / khoaQuanLy  (KHÔNG lọc
       quyền — gốc không dùng genBoLoc_HeKhoa)
     DKH_PhanCong_LopHP/LayDSKhoaToChuc      Khoá (TENKHOA) theo Hệ + Thời gian           GET
     DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc  CT (TENCHUONGTRINH) theo Thời gian, Khoá, Hệ, Khoa QL  GET
     DKH_PhanCong_LopHP/LayDSHocPhan         Học phần (TEN - MA) theo Thời gian, Khoá, Hệ, CT, Khoa QL  GET
     DKH_Chung/LayDSHinhThucHoc              Hình thức học (TENHINHTHUCHOC)               GET
     DKH_ThongTin/LayDSDangKy_KeHoachDangKy  Kế hoạch (TENKEHOACH) theo Thời gian, pageSize 10000  GET
     KHCT_CoSoDaoTao/LayDanhSach             Cơ sở đào tạo (TEN), pageSize 10000          GET
     KHDT.DIEM.KIEUHOC                       Kiểu học (ums.api.dm)
     DKH_BaoCao/LayDSLopHocPhanPhanTrang     danh sách (phân trang máy chủ; strCachLocTheoKhoaQuanLy
                                             '' = "Xem theo khoa quản lý chuyên ngành",
                                             'THEOKHOAQUANLYHOCPHAN' = "… học phần")           GET
     DKH_PhanCong_LopHP/LayDSDangKyHoc       hộp "Danh sách sinh viên" (strDaoTao_LopHocPhan_Id)  GET
     Báo cáo: ums.report.mount (getList_MauImport "zonebtnBaoCao_LopHocPhan" — html gốc không có
       vùng _Import → import: false); callback chép nguyên (mỗi lớp đánh dấu / mỗi trạng thái một
       khoá lặp lại; strKhoaQuanLy = CHỮ các khoa đã chọn nối liền như option:selected.text();
       strHoTenNguoiDung = tên người dùng trên thanh trên của vỏ, như #lblHoTenNguoiDung).
   Nối tầng (mọi ô "Tất cả …" chọn NHIỀU, nhiều cha → lọc TUỲ CHỌN, không khoá):
     Thời gian → Kế hoạch (một cha, gốc chỉ nạp Kế hoạch khi chọn Thời gian) → ums.pat.chain.
     Hệ / Thời gian → Khoá; Hệ / Khoá / Khoa QL / Thời gian → CT; mọi ô trên → Học phần: nạp
     lại khi đổi (gốc chỉ bắt select2:select — bản mới bắt cả lúc bỏ chọn), KHÔNG khoá.
   Khác gốc:
     · Tiêu đề cột bảng lệch một cột ở gốc ("Đã phân công" hiện số SV đã đăng ký, "Số sv đã đăng
       ký" hiện số dự kiến, "Số sv dự kiến" hiện "Lớp riêng"). Đặt tiêu đề theo ĐÚNG dữ liệu:
       Số sv đã đăng ký · Số sv dự kiến · Lớp riêng (không có cột "Đã phân công" nào trong dữ liệu).
     · Khối "Chọn trạng thái sinh viên": gốc để TRỐNG (không lệnh nào nạp #DSTrangThaiSV — bản
       chép từ lophocphan.js bỏ sót loadToCombo_DanhMucDuLieu("QLSV.TRANGTHAI")) nên báo cáo không
       bao giờ nhận strTrangThaiNguoiHoc_Id. Bản mới nạp QLSV.TRANGTHAI (đánh dấu sẵn tất cả, như
       lophocphan) — chỉ ảnh hưởng tham số BÁO CÁO. Kiểm trên host.
     · Chọn Thời gian: gốc nạp lại cả danh sách Hệ (cùng danh sách, không tham số) và vì thế xoá
       trắng Hệ đang chọn — bỏ lời nạp thừa đó, Hệ giữ nguyên.
   Bỏ (mã chết của gốc): bảng ẩn tblLopHocPhanChiTiet (không nơi nào đổ dữ liệu), getList_PhamVi,
     getList_DangKyHocKQ, getList_NamNhapHoc, getList_LopQuanLy, ô dropSearch_Lop/NguoiThu/NamNhapHoc
     (không tồn tại trong html), toggle_form (.btnClose không tồn tại).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('dkh-baocaodangkyhoc');
    if (!root) return;

    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(e(s)); }
    function arr(d) { return Array.isArray(d) ? d : []; }

    function o(key, ph, nhieu) {
        return '<div class="ums-field"><select class="ums-select" data-f="' + key + '" data-ph="' + esc(ph) + '"' + (nhieu ? ' multiple' : '') + '>' +
            (nhieu ? '' : '<option value="">' + esc(ph) + '</option>') + '</select></div>';
    }
    function nhap(key, ph) { return '<div class="ums-field"><input class="ums-input" data-f="' + key + '" placeholder="' + esc(ph) + '" autocomplete="off"></div>'; }

    root.innerHTML = pat.page('Báo cáo đăng ký học', '') +
        pat.panel({ title: 'Tìm kiếm', icon: 'fa-magnifying-glass', cls: 'ums-u-mb-4', body:
            '<div class="ums-filter">' +
                o('tg', 'Chọn học kỳ', true) + o('he', 'Tất cả hệ đào tạo', true) + o('khoa', 'Tất cả khóa đào tạo', true) +
                o('kql', 'Tất cả khoa quản lý', true) + o('ct', 'Tất cả chương trình đào tạo', true) + o('hp', 'Chọn học phần', true) +
                o('htth', 'Tất cả hình thức học', true) + o('kh', 'Chọn kế hoạch') + o('kieu', 'Chọn kiểu học') + o('coso', 'Tất cả cơ sở đào tạo') +
                '<div class="ums-field ums-field--fit"><label class="ums-check"><input type="checkbox" data-f="chuaPC"> <b>Chỉ hiện các lớp chưa phân công</b></label></div>' +
                nhap('tuSo', 'Số đã đăng ký(từ số)') + nhap('denSo', 'Số đã đăng ký(đến số)') + nhap('q', 'Nhập từ khóa tìm kiếm') +
                '<div class="ums-field ums-field--fit">' +
                    ui.btn('search', { text: 'Xem theo khoa quản lý chuyên ngành.', mod: 'out-primary', attr: { 'data-a': 'xem', 'data-cach': '' } }) + ' ' +
                    ui.btn('search', { text: 'Xem theo khoa quản lý học phần', mod: 'out-primary', attr: { 'data-a': 'xem', 'data-cach': 'THEOKHOAQUANLYHOCPHAN' } }) +
                '</div>' +
                '<div class="ums-field ums-field--fit" data-z="bc"></div>' +
            '</div>' +
            '<div class="ums-legend ums-legend--cach"><i class="fa-light fa-user-graduate"></i> Chọn trạng thái sinh viên</div>' +
            '<div data-z="tt"></div>' }) +
        pat.panel({ title: 'Danh sách', icon: 'fa-building', count: 'n', flush: true, zone: 'bang',
            body: ui.empty('Chọn điều kiện rồi bấm Xem') });
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    var v = function (k) { return pat.val(f(k)); };

    var st = { ds: [], trang: 1, co: 10, tong: 0, cach: '' };
    var trangThai = pat.checks(z('tt'), ums.api.dm('QLSV.TRANGTHAI'), { cols: 3 });

    /* ---------- Danh mục -------------------------------------------------- */
    function goi(action, thamSo, noi) {
        return ums.api.call(Object.assign({ action: action, type: 'GET', method: 'GET' }, thamSo))
            .then(function (r) { return arr(r.data); })
            .catch(function (err) { ums.api.handle(err, noi); return []; });
    }
    /* xoa: gốc gọi .val("").trigger("change") sau khi đổ (khi danh sách không đúng 1 dòng) */
    function doVao(k, rows, name, xoa) {
        pat.fill(f(k), rows, { name: name });
        if (xoa && rows.length !== 1 && window.jQuery) jQuery(f(k)).val(f(k).multiple ? [] : '').trigger('change.select2').trigger('ums:refresh');
    }
    function napKhoa() {
        return goi('DKH_PhanCong_LopHP/LayDSKhoaToChuc', { strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_ThoiGianDaoTao_Id: v('tg') }, 'khóa đào tạo')
            .then(function (rows) { doVao('khoa', rows, 'TENKHOA', true); });
    }
    function napCT() {
        return goi('DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc', { strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_KhoaDaoTao_Id: v('khoa'),
            strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_KhoaQuanLy_Id: v('kql') }, 'chương trình đào tạo')
            .then(function (rows) { doVao('ct', rows, 'TENCHUONGTRINH', true); });
    }
    function napHP() {
        return goi('DKH_PhanCong_LopHP/LayDSHocPhan', { strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_KhoaDaoTao_Id: v('khoa'),
            strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_ChuongTrinh_Id: v('ct'), strDaoTao_KhoaQuanLy_Id: v('kql') }, 'học phần')
            .then(function (rows) { doVao('hp', rows, function (x) { return e(x.TEN) + ' - ' + e(x.MA); }); });
    }
    function napKH() {
        return goi('DKH_ThongTin/LayDSDangKy_KeHoachDangKy', { strTuKhoa: '', strDaoTao_ThoiGianDaoTao_Id: v('tg'), strNguoiThucHien_Id: '',
            pageIndex: 1, pageSize: 10000 }, 'kế hoạch đăng ký')
            .then(function (rows) { doVao('kh', rows, 'TENKEHOACH'); });
    }

    goi('DKH_Chung/LayDSHinhThucHoc', {}, 'hình thức học').then(function (rows) { doVao('htth', rows, 'TENHINHTHUCHOC'); });
    ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
        .then(function (rows) { doVao('he', rows, 'TENHEDAOTAO', true); })
        .catch(function (err) { ums.api.handle(err, 'hệ đào tạo'); });
    napKhoa();
    ums.ref.khoaQuanLy().then(function (rows) { doVao('kql', rows, 'TEN'); }).catch(function (err) { ums.api.handle(err, 'khoa quản lý'); });
    goi('DKH_Chung/LayThoiGianDangKyHoc', { strNguoiThucHien_Id: '' }, 'thời gian đăng ký').then(function (rows) { doVao('tg', rows, 'DAOTAO_THOIGIANDAOTAO'); });
    goi('KHCT_CoSoDaoTao/LayDanhSach', { pageIndex: 1, pageSize: 10000 }, 'cơ sở đào tạo').then(function (rows) { doVao('coso', rows, 'TEN'); });
    ums.api.dm('KHDT.DIEM.KIEUHOC').then(function (rows) {
        pat.fill(f('kieu'), rows, { head: pat.dmTitle(rows) || 'Chọn kiểu học' });
    }).catch(function (err) { ums.api.handle(err, 'kiểu học'); });

    /* Đổi ô chọn → nạp lại ô phụ thuộc (bắt `change` thật: chọn / bỏ chọn / xoá trắng đều nạp lại) */
    var DOI = {
        tg: function () { napHP(); napKH(); },
        he: function () { napKhoa(); napCT(); napHP(); },
        khoa: function () { napCT(); napHP(); },
        ct: function () { napHP(); },
        kql: function () { napCT(); napHP(); }
    };
    Object.keys(DOI).forEach(function (k) { f(k).addEventListener('change', DOI[k]); });
    pat.chain([f('tg'), f('kh')], { phatLai: false });

    /* ---------- Danh sách (getList_LopHocPhan) ---------------------------- */
    function so(k) { var x = (f(k).value || '').trim(); return x ? parseInt(x, 10) : -1; }
    function tai() {
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({
            action: 'DKH_BaoCao/LayDSLopHocPhanPhanTrang', method: 'GET',
            strTuKhoa: (f('q').value || '').trim(),
            strDaoTao_ThoiGianDaoTao_Id: v('tg'),
            strDaoTao_HocPhan_Id: v('hp'),
            strNguoiThucHien_Id: '',
            pageIndex: st.trang, pageSize: st.co,
            strDangKy_KeHoachDangKy_Id: v('kh'),
            dChiLayCacLopChuaPhanCong: f('chuaPC').checked ? 1 : 0,
            strDaoTao_KhoaDaoTao_Id: v('khoa'),
            strDaoTao_ChuongTrinh_Id: v('ct'),
            strDaoTao_HeDaoTao_Id: v('he'),
            strDaoTao_KhoaQuanLy_Id: v('kql'),
            dSoDaDangTuSo: so('tuSo'),
            dSoDaDangDenSo: so('denSo'),
            strDaoTao_CoSoDaoTao_Id: v('coso'),
            strTKB_HinhThucHoc_Id: v('htth'),
            strCachLocTheoKhoaQuanLy: st.cach
        }).then(function (r) {
            st.ds = arr(r.data);
            st.tong = Number(r.pager) || st.ds.length;
            z('n').textContent = '(' + st.tong + ')';
            ui.table({ el: z('bang'), rows: st.ds, empty: 'Không có dữ liệu',
                page: { index: st.trang, size: st.co, total: st.tong,
                    onChange: function (p) { st.trang = p; tai(); }, onSize: function (s) { st.co = s; st.trang = 1; tai(); } },
                columns: [
                    { title: 'Mã lớp', prop: 'MALOP', cls: 'is-nowrap' },
                    { title: 'Tên lớp', prop: 'TENLOP' },
                    { title: 'Thông tin lịch', render: function (x) { return ui.escBr(x.THOIGIANCHITIET); } },
                    { title: 'Số sv đã đăng ký', cls: 'is-center', render: function (x, i) {
                        return x.SOSVDADANGKY ? ui.btn('view', { text: String(x.SOSVDADANGKY), cls: 'ums-btn--sm', attr: { 'data-sv': i, title: 'Số sinh viên đã đăng ký' } }) : '';
                    } },
                    { title: 'Số sv dự kiến', prop: 'SOLUONGDUKIENHOC', cls: 'is-center' },
                    { title: 'Lớp riêng', cls: 'is-center', render: function (x) { return x.HOCPHITINHRIENG ? 'Lớp riêng' : ''; } },
                    { head: '<input type="checkbox" data-lhpall title="Chọn tất cả">', cls: 'is-center is-actions', width: '50px',
                        render: function (x) { return '<input type="checkbox" data-lhp="' + esc(x.ID) + '">'; } }
                ] });
        }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách lớp học phần'); });
    }

    /* ---------- Hộp "Danh sách sinh viên" (getList_QuanSoTheoLop) -------- */
    function xemSV(lop) {
        var dlg = ui.dialog({ title: 'Danh sách sinh viên - ' + e(lop.TENLOP), icon: 'fa-users', size: 'xl', body: '<div data-x="bang">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
        var h = dlg.body.querySelector('[data-x="bang"]');
        ums.api.call({ action: 'DKH_PhanCong_LopHP/LayDSDangKyHoc', type: 'GET', method: 'GET', strTuKhoa: '',
            strDaoTao_LopHocPhan_Id: lop.ID, strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 }).then(function (r) {
            ui.table({ el: h, rows: arr(r.data), empty: 'Không có sinh viên', columns: [
                { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                { title: 'Họ tên', cls: 'is-nowrap', render: function (x) { return esc(e(x.QLSV_NGUOIHOC_HODEM) + ' ' + e(x.QLSV_NGUOIHOC_TEN)); } },
                { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' },
                { title: 'Tình trạng', prop: 'QLSV_TRANGTHAINGUOIHOC_TEN', cls: 'is-nowrap' },
                { title: 'Lớp học', prop: 'DAOTAO_LOPQUANLY_TEN', cls: 'is-nowrap' },
                { title: 'Chương trình học', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN', cls: 'is-nowrap' },
                { title: 'Khoa quản lý', prop: 'KHOAQUANLY_TEN' },
                { title: 'Hệ đào tạo', prop: 'DAOTAO_HEDAOTAO_TEN' }
            ] });
        }).catch(function (err) { h.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách sinh viên'); });
    }

    /* ---------- Báo cáo (getList_MauImport "zonebtnBaoCao_LopHocPhan") --- */
    function chuKhoaQL() {
        return Array.prototype.filter.call(f('kql').options, function (x) { return x.selected; }).map(function (x) { return x.text; }).join('');
    }
    function tenNguoiDung() { var u = document.getElementById('userName'); return u ? u.textContent.trim() : ''; }
    ums.report.mount(z('bc'), { import: false, collect: function (add) {
        add('strDaoTao_ThoiGianDaoTao_Id', v('tg'));
        add('strDaoTao_KhoaDaoTao_Id', v('khoa'));
        add('strDaoTao_ChuongTrinh_Id', v('ct'));
        add('strDaoTao_HocPhan_Id', v('hp'));
        add('strDaoTao_HeDaoTao_Id', v('he'));
        add('strDaoTao_KhoaQuanLy_Id', v('kql'));
        add('strDangKy_KeHoachDangKy_Id', v('kh'));
        add('strKieuHoc_Id', v('kieu'));
        add('strTuKhoa', (f('q').value || '').trim());
        add('dChiLayCacLopChuaPhanCong', f('chuaPC').checked ? 1 : 0);
        add('dSoDaDangTuSo', so('tuSo'));
        add('dSoDaDangDenSo', so('denSo'));
        add('strKhoaQuanLy', chuKhoaQL());
        add('strHoTenNguoiDung', tenNguoiDung());
        Array.prototype.forEach.call(z('bang').querySelectorAll('input[data-lhp]:checked'), function (c) { add('strDangKy_LopHocPhan_Id', c.getAttribute('data-lhp')); });
        trangThai.ids().forEach(function (id) { add('strTrangThaiNguoiHoc_Id', id); });
    } });

    /* ---------- Sự kiện --------------------------------------------------- */
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-sv]');
        if (b) { var l = st.ds[Number(b.getAttribute('data-sv'))]; if (l) xemSV(l); return; }
        b = ev.target.closest('[data-a="xem"]');
        if (b) { st.cach = b.getAttribute('data-cach'); st.trang = 1; tai(); }
    });
    root.addEventListener('change', function (ev) {
        if (!ev.target.hasAttribute('data-lhpall')) return;
        Array.prototype.forEach.call(z('bang').querySelectorAll('input[data-lhp]'), function (c) { c.checked = ev.target.checked; });
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); st.cach = ''; st.trang = 1; tai(); } });
})();
