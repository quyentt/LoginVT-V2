/* =========================================================================
   Báo cáo tài chính
   Bản gốc: ApisTaiChinh/Modules/baocao/scripts/baocao.js (3.612 dòng)
   ---------------------------------------------------------------------------
   Lời gọi — chép nguyên bản gốc (tên tham số, kể cả `type` gửi kèm dữ liệu
   như bản gốc, và các lỗi chính tả strDaoVao_*):
     Danh mục lọc
       pkg_kehoach_thongtin.LayDSDaoTao_CoSoDaoTao (edu.system.getList_CoSoDaoTao)
       ums.ref.heDaoTao / khoaDaoTao / chuongTrinh / lopQuanLy / thoiGianDaoTao
       TC_NguoiDungDaThuTien/LayDanhSach · KHCT_NamNhapHoc/LayDanhSach ·
       KHCT_KhoaQuanLy/LayDanhSach · CM_DanhMucDuLieu/LayDanhSach (QLSV.TRANGTHAI)
       DKH_KeHoachDangKy/LayDSKeHoachTheoThoiGian (khi đổi học kỳ)
       ums.api.dm: QLTC.HTTHU · TAICHINH.PHANLOAICHUNGTU · KHCT.NCN · TAICHINH.BC.TINHTRANGBCLUU
       TC_KhoanThu/LayDanhSach · TC_ThuChi2/LayDSTaiChinh_Nam_BaoCao
     Tab 1–2
       TC_BaoCao/LayDSThuTien · TC_BaoCao/LayDSNopTien   (POST, phân trang 10)
       PKG_TAICHINH_THONGTIN.Xoa_TaiChinh_PhaiNop_TatCa   (từng dòng)
     Tab 3 — kết nối kế toán
       TC_KeToan/LayDSAPI_DoiTac · LayDSTenBangDuLieu · TaoDuLieuKeToanChoTungAPI ·
       XoaBangDuLieuAPI · LayCauTrucHienThiDuLieuAPI · LayDSDuLieuAPI ·
       LayGiaTriDuLieuAPI · LayDSAPI_DoiTac_ChiTiet · CapNhatDuLieuNhomAPI ·
       LayGiaTriDuLieuNhomAPI · CM_UngDung/CustomAPI
     Hộp thoại
       TC_ThuChi2/{Them|LayDS|Xoa}_TaiChinh_Nam_BaoCao · {Them|LayDS|Xoa}_TaiChinh_Nam_Thang_BC
       TC_ThuChi2/LayDSNguoiThucHienBC · LayDSBC_BaoCaoDaThucHien · An_BC_BaoCaoDaThucHien ·
       Them_TaiChinh_BC_XacNhanBCLuu · LayDSTaiChinh_BC_XacNhanBCLuu
       TC_KeToan/{Them|LayDS|Xoa}_TC_BC_KyHieu_KhoaNganh
       PKG_TAICHINH_THUCHI2.LayDSBaoCao · LayKetQuaBaoCao · LayThongSoBaoCao · Xoa_BaoCao_TT_TuDong_Lich
     Báo cáo / import: ums.report.mount (= edu.system.getList_MauImport),
       ums.report.importChung (= showImportChung, IMPORTWITHPROC_KHTPN)

   LỖI BẢN GỐC — đã xử lý:
     · Lưu dòng "năm – tháng" ĐÃ CÓ gọi DKH_DangKyThi_MonThi_Chung/
       Sua_DangKy_Thi_HP_KH_PhamVi (thủ tục của phân hệ Đăng ký học, chép
       nhầm). Không chép: chỉ dòng mới được lưu (Them_TaiChinh_Nam_Thang_BC),
       dòng cũ muốn đổi thì xoá rồi thêm lại.
     · Nút "Xoá" trong "Báo cáo đã thực hiện" gọi me.delete_BaoCaoDaLuu — hàm
       không tồn tại. Gắn vào delete_TangThem (An_BC_BaoCaoDaThucHien, nạp
       lại danh sách báo cáo đã lưu) — đúng hàm duy nhất làm việc này.
     · genTable_TongHop/PhaiNop đọc data[0].TONGTIEN khi danh sách rỗng →
       lỗi JS. Ở đây rỗng thì tổng = 0.
     · Enter trong ô từ khoá gọi me.activeTabFun — hàm không tồn tại. Ở đây
       Enter = Tìm kiếm.
   Nghi ngờ, giữ nguyên:
     · Cột "Từ ngày --> đến ngày" hiện DAUVAO_TUNGAY_TEN hai lần.
     · Duyệt sang kế toán gửi tài khoản/mật khẩu đối tác (btoa) cho
       CM_UngDung/CustomAPI chuyển tiếp — đúng thiết kế bản gốc.
   Khác bản gốc:
     · Tab 1–2 có phân trang (bản gốc gửi pageIndex 1/pageSize 10 nhưng
       không vẽ phân trang nên chỉ xem được 10 dòng đầu).
   Cố ý bỏ:
     · Vùng "zonebtnBaoCao_TC_DatLich": không nơi nào đổ nút vào.
     · Các nút trùng id btnXoaNamBaoCao/btnSaveNamBaoCao trong ba hộp thoại
       mã KH / lịch / thông số: jQuery chỉ gắn nút đầu tiên nên chúng không
       làm gì.
     · Đọc số thành chữ dùng ums.ui.docSo (thư viện n2vi ở tầng chung).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var root = document.getElementById('baocao');
    function z(n) { return root.querySelector('[data-z="' + n + '"]'); }
    function f(n) { return root.querySelector('[data-f="' + n + '"]'); }
    function e(v) { return v === undefined || v === null ? '' : v; }
    function num(v) {
        var n = Number(String(v === null || v === undefined ? '' : v).replace(/[^\d.-]/g, ''));
        return isNaN(n) ? 0 : n;
    }
    function rowsOf(r) { var d = r.data; return Array.isArray(d) ? d : (d && d.rs) || []; }
    function each(list, fn) { Array.prototype.forEach.call(list, fn); }

    /* Giá trị ô chọn — = edu.util.getValCombo / getValById: ô chọn nhiều nối
       bằng dấu phẩy, bỏ mục rỗng */
    function mv(name) {
        var el = f(name);
        if (!el) return '';
        if (el.multiple) return Array.prototype.filter.call(el.options, function (o) { return o.selected && o.value; })
            .map(function (o) { return o.value; }).join(',');
        return (el.value || '').trim();
    }

    /* =====================================================================
       Bộ lọc
       ===================================================================== */
    var FILTERS = [
        { k: 'coSo', label: 'Cơ sở đào tạo', multi: true },
        { k: 'he', label: 'Hệ đào tạo', multi: true },
        { k: 'khoa', label: 'Khoá đào tạo', multi: true },
        { k: 'ct', label: 'Chương trình', multi: true },
        { k: 'lop', label: 'Lớp', multi: true },
        { k: 'hocKy', label: 'Học kỳ', multi: true },
        { k: 'kyThucHien', label: 'Phạm vi', items: [['1', 'Trong kỳ này'], ['0', 'Đến kỳ này']], hidden: true },
        { k: 'keHoach', label: 'Kế hoạch đăng ký', multi: true },
        { k: 'nguoiThu', label: 'Người thu', multi: true },
        { k: 'namNhapHoc', label: 'Năm nhập học', multi: true },
        { k: 'khoaQL', label: 'Khoa quản lý', multi: true },
        { k: 'tuNgay', label: 'Từ ngày', date: true },
        { k: 'denNgay', label: 'Đến ngày', date: true },
        { k: 'tuSo', label: 'Từ số', text: true },
        { k: 'denSo', label: 'Đến số', text: true },
        { k: 'phanLoai', label: 'Phân loại chứng từ', multi: true },
        { k: 'hinhThucThu', label: 'Hình thức thu', multi: true },
        { k: 'phanLoaiCSDT', label: 'Phân loại cơ sở', items: [['1', '1. Cơ sở đào tạo theo người thu'], ['0', '2. Cơ sở đào tạo theo người học']] },
        { k: 'doiTuong', label: 'Đối tượng', items: [['', '1. Tất cả'], ['1', '2. Là sinh viên'], ['0', '3. Là đối tác đào tạo']] },
        { k: 'namBaoCao', label: 'Năm tài chính' },
        { k: 'nganh', label: 'Ngành học', multi: true },
        { k: 'tuKhoa', label: 'Nhập từ khoá tìm kiếm', text: true, wide: true }
    ];

    z('filter').innerHTML = FILTERS.map(function (x) {
        var ctl;
        if (x.text) ctl = '<input class="ums-input" data-f="' + x.k + '" placeholder="' + ui.esc(x.label) + '" autocomplete="off">';
        else if (x.date) ctl = '<div class="ums-inputwrap"><input class="ums-input" data-f="' + x.k + '" placeholder="' + ui.esc(x.label) + ' dd/mm/yyyy" autocomplete="off"><i class="fa-light fa-calendar"></i></div>';
        else ctl = '<select class="ums-select" data-f="' + x.k + '"' + (x.multi ? ' multiple' : '') + '>' +
            (x.items ? x.items.map(function (i) { return '<option value="' + i[0] + '">' + ui.esc(i[1]) + '</option>'; }).join('') : (x.multi ? '' : '<option value=""></option>')) +
            '</select>';
        return '<div class="ums-field"' + (x.hidden ? ' hidden' : '') + (x.wide ? ' style="grid-column:span 2"' : '') + ' data-wrap="' + x.k + '">' + ctl + '</div>';
    }).join('');
    FILTERS.forEach(function (x) {
        if (x.date) ui.datepicker(f(x.k));
        else if (!x.text) ui.select2(f(x.k), { placeholder: x.label, allowClear: !x.items });
    });

    z('filterBtns').innerHTML = ui.btn('search', { attr: { 'data-act': 'search' } }) +
        '<span class="ums-u-flex1"></span>' +
        '<button type="button" class="ums-btn ums-btn--danger" data-act="xoaNamBC"><i class="fa-light fa-trash-can"></i><span>Xoá năm tài chính</span></button>' +
        '<button type="button" class="ums-btn ums-btn--primary" data-act="namTC"><i class="fa-light fa-circle-dollar"></i><span>Cấu hình năm tài chính</span></button>' +
        '<button type="button" class="ums-btn ums-btn--save" data-act="daThucHien"><i class="fa-light fa-file-invoice-dollar"></i><span>Xem báo cáo đã thực hiện</span></button>';

    z('actions').innerHTML = '<span data-z="reportHost"></span>' +
        '<button type="button" class="ums-btn ums-btn--out-primary" data-act="lich"><i class="fa-light fa-calendar-days"></i><span>Xem đã đặt</span></button>' +
        '<button type="button" class="ums-btn ums-btn--out-danger" data-act="importKHTPN" title="Import: xoá nợ khoản phải nộp"><i class="fa-light fa-file-import"></i><span>Xoá nợ khoản phải nộp</span></button>';

    function fill(k, rows, id, name, autoOne) {
        var el = f(k);
        var keep = mv(k).split(',');
        el.innerHTML = (el.multiple ? '' : '<option value=""></option>') + rows.map(function (r) {
            var t = typeof name === 'function' ? name(r) : r[name];
            return '<option value="' + ui.esc(r[id]) + '">' + ui.esc(t) + '</option>';
        }).join('');
        each(el.options, function (o) { if (o.value && keep.indexOf(o.value) >= 0) o.selected = true; });
        if (autoOne !== false && rows.length === 1 && el.options.length) el.options[el.multiple ? 0 : 1].selected = true;   // = loadToCombo_data khi chỉ có 1 dòng
        if (window.jQuery) jQuery(el).trigger('change.select2');
    }
    function load(k, promise, id, name, autoOne) {
        return promise.then(function (rows) { fill(k, rows || [], id, name, autoOne); })
            .catch(function (err) { ums.api.handle(err, k); });
    }
    function get(call) { call.method = 'GET'; call.silent = true; return ums.api.call(call).then(rowsOf); }

    var namBaoCao = [];

    function loadKhoa() { return load('khoa', ums.ref.khoaDaoTao({ strHeDaoTao_Id: mv('he'), pageIndex: 1, pageSize: 1000000 }), 'ID', 'TENKHOA'); }
    function loadCT() { return load('ct', ums.ref.chuongTrinh({ strKhoaDaoTao_Id: mv('khoa'), pageIndex: 1, pageSize: 1000000 }), 'ID', 'TENCHUONGTRINH'); }
    function loadLop() {
        return load('lop', ums.ref.lopQuanLy({ strDaoTao_HeDaoTao_Id: mv('he'), strKhoaDaoTao_Id: mv('khoa'), strToChucCT_Id: mv('ct'), pageIndex: 1, pageSize: 1000000 }), 'ID', 'TEN');
    }
    function loadNamBaoCao() {
        return get({ action: 'TC_ThuChi2/LayDSTaiChinh_Nam_BaoCao', type: 'GET', strNguoiThucHien_Id: '' }).then(function (rows) {
            namBaoCao = rows;
            fill('namBaoCao', rows, 'ID', 'TAICHINH_NAM_BAOCAO_TEN', false);
        }).catch(function (err) { ums.api.handle(err, 'năm tài chính'); });
    }

    load('coSo', ums.api.call({
        action: 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eAi4SLgUgLhUgLgPP', func: 'pkg_kehoach_thongtin.LayDSDaoTao_CoSoDaoTao',
        silent: true, strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000
    }).then(rowsOf), 'ID', function (r) {
        var t = e(r.TEN), m = e(r.MA);
        return m && m !== t ? t + ' (' + m + ')' : (t || m);
    });
    load('he', ums.ref.heDaoTao({ pageIndex: 1, pageSize: 1000000 }), 'ID', 'TENHEDAOTAO', false);
    loadKhoa(); loadCT(); loadLop();
    load('hocKy', ums.ref.thoiGianDaoTao({ pageIndex: 1, pageSize: 100000 }), 'ID', 'DAOTAO_THOIGIANDAOTAO');
    load('nguoiThu', get({ action: 'TC_NguoiDungDaThuTien/LayDanhSach', versionAPI: 'v1.0' }), 'ID', 'TAIKHOAN');
    load('namNhapHoc', get({ action: 'KHCT_NamNhapHoc/LayDanhSach', versionAPI: 'v1.0', strNguoiThucHien_Id: '' }), 'NAMNHAPHOC', 'NAMNHAPHOC', false);
    load('khoaQL', get({ action: 'KHCT_KhoaQuanLy/LayDanhSach', versionAPI: 'v1.0', strNguoiThucHien_Id: '' }), 'ID', 'TEN', false);
    load('hinhThucThu', ums.api.dm('QLTC.HTTHU'), 'ID', 'TEN');
    load('phanLoai', ums.api.dm('TAICHINH.PHANLOAICHUNGTU'), 'ID', 'TEN');
    load('nganh', ums.api.dm('KHCT.NCN'), 'ID', 'TEN', false);
    loadNamBaoCao();

    /* Đổi ô cha — như các sự kiện select2:select của bản gốc */
    if (window.jQuery) {
        jQuery(f('he')).on('change', function () { loadKhoa(); loadLop(); });
        jQuery(f('khoa')).on('change', function () { if (mv('khoa')) { loadCT(); loadLop(); } });
        jQuery(f('ct')).on('change', function () { if (mv('ct')) loadLop(); });
        jQuery(f('hocKy')).on('change', function () {
            root.querySelector('[data-wrap="kyThucHien"]').hidden = !mv('hocKy');
            load('keHoach', get({ action: 'DKH_KeHoachDangKy/LayDSKeHoachTheoThoiGian', type: 'GET', strDaoTao_ThoiGianDaoTao_Id: mv('hocKy'), strNguoiThucHien_Id: '' }), 'ID', 'TEN', false);
        });
    }

    /* ---------- Khoản thu + trạng thái SV -------------------------------- */
    get({ action: 'TC_KhoanThu/LayDanhSach', versionAPI: 'v1.0', strTuKhoa: '', pageIndex: 1, pageSize: 10000, iTinhTrang: -1,
          strNhomCacKhoanThu_Id: '', strNguoiTao_Id: '', strCanBoQuanLy_Id: '', strNguoiThucHien_Id: '' })
        .then(function (rows) { z('khoanThu').innerHTML = checks('kt', rows); })
        .catch(function (err) { ums.api.handle(err, 'khoản thu'); });
    get({ action: 'CM_DanhMucDuLieu/LayDanhSach', versionAPI: 'v1.0', strMaBangDanhMuc: 'QLSV.TRANGTHAI' })
        .then(function (rows) { z('trangThai').innerHTML = checks('tt', rows); })
        .catch(function (err) { ums.api.handle(err, 'trạng thái sinh viên'); });

    function checks(g, rows) {
        return '<label class="ums-check"><input type="checkbox" data-g="' + g + '" data-all checked> <b>Tất cả</b></label>' +
            rows.map(function (r) {
                return '<label class="ums-check"><input type="checkbox" data-g="' + g + '" value="' + ui.esc(r.ID) + '" checked> ' + ui.esc(r.TEN) + '</label>';
            }).join('');
    }
    function checked(g) {
        return Array.prototype.filter.call(root.querySelectorAll('input[data-g="' + g + '"]:not([data-all])'), function (x) { return x.checked; })
            .map(function (x) { return x.value; });
    }
    /* Bản gốc tách danh sách khoản thu: 121 id đầu vào strTAICHINH_CacKhoanThu_Ids, phần còn lại vào strTaiChinh_KhoanKhac_Ids */
    function khoanThuIds() {
        var all = checked('kt');
        return { chinh: all.slice(0, 121).toString(), khac: all.length > 120 ? all.slice(121).toString() : '', all: all };
    }
    function phamVi() { return mv('hocKy') ? mv('kyThucHien') : ''; }

    /* =====================================================================
       Nút báo cáo — collect giữ đúng thứ tự addKeyValue của bản gốc
       ===================================================================== */
    ums.report.mount(z('reportHost'), {
        collect: function (add) {
            var kt = checked('kt');
            var tt = checked('tt').toString();
            if (!kt.length) { ui.toast('Vui lòng chọn khoản thu!', 'warn'); return false; }
            if (tt === '') { ui.toast('Vui lòng chọn trạng thái!', 'warn'); return false; }
            add('strMaTruong', 'KCNTTTN');
            add('strDaoTao_CoSoDaoTao_Id', mv('coSo'));
            add('strNguoiDangNhap_Id', ums.session.userId);
            add('strNguoiThucHien_Id', mv('nguoiThu'));
            add('strNguoiDung_Id', mv('nguoiThu'));
            add('strHeDaoTao_Id', mv('he'));
            add('strKhoaDaoTao_Id', mv('khoa'));
            add('strChuongTrinh_Id', mv('ct'));
            add('strLopQuanLy_Id', mv('lop'));
            add('strThoiGianDaoTao_Id', mv('hocKy'));
            add('strPhamViApDung', phamVi());
            add('strTuNgay', mv('tuNgay'));
            add('strDenNgay', mv('denNgay'));
            add('strTuKhoa', mv('tuKhoa'));
            add('strKhoaQuanLy_Id', mv('khoaQL'));
            add('strNamNhapHoc', mv('namNhapHoc'));
            add('strTuSo', mv('tuSo'));
            add('strDenSo', mv('denSo'));
            add('strHinhThucThu_Id', mv('hinhThucThu'));
            add('strDoiTuong', mv('doiTuong'));
            add('strPhanLoaiChungTu_Id', mv('phanLoai'));
            add('strPhanLoaiCSDT', mv('phanLoaiCSDT'));
            add('strTaiChinh_Nam_BaoCao_Id', mv('namBaoCao'));
            add('strDangKy_KeHoachDangKy_Id', mv('keHoach'));
            kt.forEach(function (id) { add('strTAICHINH_CacKhoanThu_Ids', id); });
            add('strTrangThaiNguoiHoc_Id', tt);
            add('strNganhHoc_Id', mv('nganh'));
        }
    });

    /* =====================================================================
       Tab 1–2: tổng thu, kết quả phải nộp
       ===================================================================== */
    var tab = 'tongthu';
    var SIZE = 10;
    var COLS_SV = [
        { title: 'Hình thức', prop: 'LOAICHUNGTU', cls: 'is-center' },
        { title: 'Thời gian', prop: 'DAOTAO_THOIGIANDAOTAO', cls: 'is-center is-nowrap' },
        { title: 'Người thu', prop: 'NGUOITAO_TENDAYDU' },
        { title: 'Khoản thu', prop: 'TAICHINH_CACKHOANTHU_TEN' },
        { title: 'Mã số', prop: 'MASONGUOIHOC', cls: 'is-nowrap' },
        { title: 'Họ tên', prop: 'HOTENNGUOIHOC', cls: 'is-nowrap' },
        { title: 'Ngày sinh', prop: 'NGAYSINH', cls: 'is-center is-nowrap' },
        { title: 'Trạng thái', prop: 'TRANGTHAINGUOIHOC_N1_TEN' },
        { title: 'Lớp học', prop: 'LOP' },
        { title: 'Chương trình', prop: 'NGANH' },
        { title: 'Khoá học', prop: 'KHOADAOTAO' },
        { title: 'Khoa quản lý', prop: 'KHOAQUANLY' },
        { title: 'Hệ đào tạo', prop: 'HEDAOTAO' }
    ];

    function params(pageIndex) {
        var kt = khoanThuIds();
        return {
            versionAPI: 'v1.0',
            pageIndex: pageIndex,
            pageSize: SIZE,
            strTAICHINH_CacKhoanThu_Ids: kt.chinh,
            strTaiChinh_KhoanKhac_Ids: kt.khac,
            strHeDaoTao_Id: mv('he'),
            strKhoaDaoTao_Id: mv('khoa'),
            strChuongTrinh_Id: mv('ct'),
            strThoiGianDaoTao_Id: mv('hocKy'),
            strLopQuanLy_Id: mv('lop'),
            strTuKhoa: mv('tuKhoa'),
            strNguoiDung_Id: mv('nguoiThu'),
            strTuNgay: mv('tuNgay'),
            strDenNgay: mv('denNgay'),
            strTrangThaiNguoiHoc_Id: checked('tt').toString(),
            strNguoiDangNhap_Id: ums.session.userId,
            strNamNhapHoc: mv('namNhapHoc'),
            strKhoaQuanLy_Id: mv('khoaQL'),
            strHinhThucThu_Id: mv('hinhThucThu'),
            strPhamViThongKe: phamVi(),
            strDoiTuong: mv('doiTuong'),
            strPhanLoaiChungTu_Id: mv('phanLoai'),
            strPhanLoaiCSDT: mv('phanLoaiCSDT'),
            strNganhHoc_Id: mv('nganh')
        };
    }

    function search(page) {
        if (!khoanThuIds().all.length) { ui.toast('Vui lòng chọn khoản thu. Để có thể lấy danh sách khoản thu!', 'warn'); return; }
        if (tab === 'phainop') loadPhaiNop(page || 1);
        else if (tab === 'tongthu') loadTongThu(page || 1);
    }

    function tongTien(rows, elSo, elChu) {
        var t = rows.length ? num(rows[0].TONGTIEN) : 0;
        z(elSo).textContent = ui.money(t);
        z(elChu).textContent = docSo(t);
    }

    function loadTongThu(page) {
        var p = params(page);
        p.action = 'TC_BaoCao/LayDSThuTien';
        p.strDaoTao_CoSoDaoTao_Id = mv('coSo');
        z('tblTongThu').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call(p).then(function (r) {
            var rows = rowsOf(r), total = Number(r.pager) || rows.length;
            ui.table({
                el: z('tblTongThu'), rows: rows,
                columns: [
                    { title: 'Số tiền đã nộp', cls: 'is-right is-nowrap', render: function (x) { return ui.money(x.SOTIEN); } },
                    { title: 'Ngày nộp', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap' },
                    { title: 'Mã đơn hàng', prop: 'MADONHANG' },
                    { title: 'Chứng từ', prop: 'CHUNGTU' }
                ].concat(COLS_SV),
                page: {
                    index: page, size: SIZE, total: total,
                    onChange: function (pg) { if (pg >= 1 && pg <= Math.ceil(total / SIZE)) loadTongThu(pg); },
                    onSize: function (v) { SIZE = v; loadTongThu(1); }
                }
            });
            tongTien(rows, 'tongThu', 'tongThuChu');
        }).catch(function (err) { z('tblTongThu').innerHTML = ui.fail(err.message); ums.api.handle(err, 'tổng thu'); });
    }

    var phaiNopRows = [];
    function loadPhaiNop(page) {
        var p = params(page);
        p.action = 'TC_BaoCao/LayDSNopTien';
        p.strDangKy_KeHoach_Id = mv('keHoach');
        p.strDaoTao_CoSoDaoTao_Id = mv('coSo');
        z('tblPhaiNop').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call(p).then(function (r) {
            phaiNopRows = rowsOf(r);
            var total = Number(r.pager) || phaiNopRows.length;
            ui.table({
                el: z('tblPhaiNop'), rows: phaiNopRows,
                columns: [
                    { head: '<input type="checkbox" data-allpick="phainop">', cls: 'is-center', width: '44px', render: function (x) {
                        return '<input type="checkbox" data-pick="phainop" value="' + ui.esc(x.ID) + '">';
                    } },
                    { title: 'Số tiền phải nộp', cls: 'is-right is-nowrap', render: function (x) { return ui.money(x.SOTIEN); } },
                    { title: 'Ngày phát sinh', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap' },
                    { title: 'Chứng từ', render: function (x) { return String(x.KHONGHACHTOAN) === '1' ? 'Không hạch toán' : ''; } }
                ].concat(COLS_SV),
                page: {
                    index: page, size: SIZE, total: total,
                    onChange: function (pg) { if (pg >= 1 && pg <= Math.ceil(total / SIZE)) loadPhaiNop(pg); },
                    onSize: function (v) { SIZE = v; loadPhaiNop(1); }
                }
            });
            tongTien(phaiNopRows, 'tongPhaiNop', 'tongPhaiNopChu');
        }).catch(function (err) { z('tblPhaiNop').innerHTML = ui.fail(err.message); ums.api.handle(err, 'kết quả phải nộp'); });
    }

    function picks(g, scope) {
        return Array.prototype.filter.call((scope || root).querySelectorAll('input[data-pick="' + g + '"]'), function (x) { return x.checked; })
            .map(function (x) { return x.value; });
    }

    function xoaPhaiNop() {
        var ids = picks('phainop');
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
            if (!yes) return;
            ui.batch(ids.map(function (id) {
                return { action: 'TC_ThongTin_MH/GS4gHhUgKAIpKC8pHhEpICgPLjEeFSA1AiAP', func: 'PKG_TAICHINH_THONGTIN.Xoa_TaiChinh_PhaiNop_TatCa', strId: id, strNguoiThucHien_Id: '' };
            }), { title: 'Đang xoá', okText: 'Đã xoá' }).then(function () { loadPhaiNop(1); });
        });
    }

    /* =====================================================================
       Tab 3: kết nối kế toán
       ===================================================================== */
    var kt3 = { doiTac: [], cot: [], hang: [], giaTri: [], cauTruc: [] };

    get({ action: 'TC_KeToan/LayDSAPI_DoiTac', type: 'GET', strChucNang_Id: '', strNguoiThucHien_Id: '' }).then(function (rows) {
        kt3.doiTac = rows;
        f('bangKetNoi').innerHTML = ui.options(rows, { title: 'Chọn bảng dữ liệu' });
        ui.select2(f('bangKetNoi'), { placeholder: 'Chọn bảng dữ liệu', allowClear: true });
    }).catch(function (err) { ums.api.handle(err, 'bảng kết nối kế toán'); });

    function loadBangDaTao() {
        return get({ action: 'TC_KeToan/LayDSTenBangDuLieu', type: 'GET', strChucNang_Id: '', strNguoiThucHien_Id: '' }).then(function (rows) {
            f('bangDaTao').innerHTML = ui.options(rows, { title: 'Chọn bảng dữ liệu' });
            ui.select2(f('bangDaTao'), { placeholder: 'Chọn bảng dữ liệu', allowClear: true });
        }).catch(function (err) { ums.api.handle(err, 'bảng dữ liệu đã tạo'); });
    }
    loadBangDaTao();
    if (window.jQuery) jQuery(f('bangDaTao')).on('select2:select', function () { xemBang(); });

    function taoDuLieu() {
        var kt = khoanThuIds();
        if (!kt.all.length) { ui.toast('Vui lòng chọn khoản thu. Để có thể lấy danh sách khoản thu!', 'warn'); return; }
        ums.api.call({
            action: 'TC_KeToan/TaoDuLieuKeToanChoTungAPI', type: 'POST',
            strTAICHINH_CacKhoanThu_Ids: kt.chinh, strTaiChinh_KhoanKhac_Ids: kt.khac,
            strHeDaoTao_Id: mv('he'), strKhoaDaoTao_Id: mv('khoa'), strChuongTrinh_Id: mv('ct'),
            strThoiGianDaoTao_Id: mv('hocKy'), strLopQuanLy_Id: mv('lop'), strTuKhoa: mv('tuKhoa'),
            strNguoiDung_Id: mv('nguoiThu'), strTuNgay: mv('tuNgay'), strDenNgay: mv('denNgay'),
            strTrangThaiNguoiHoc_Id: checked('tt').toString(), strNguoiDangNhap_Id: ums.session.userId,
            strNamNhapHoc: mv('namNhapHoc'), strKhoaQuanLy_Id: mv('khoaQL'), strHinhThucThu_Id: mv('hinhThucThu'),
            strPhamViThongKe: '', strDoiTuong: mv('doiTuong'), strPhanLoaiChungTu_Id: mv('phanLoai'),
            strPhanLoaiCSDT: mv('phanLoaiCSDT'), strDaoTao_CoSoDaoTao_Id: mv('coSo'), strOrderBy: '',
            strChucNang_Id: '', strAPI_DoiTac_Id: mv('bangKetNoi'), strTenBangDuLieu: mv('tenBang'),
            strTaiChinh_Nam_BaoCao_Id: mv('namBaoCao'), strNganhHoc_Id: mv('nganh'), strNguoiThucHien_Id: '',
            strDangKy_KeHoach_Id: mv('keHoach')
        }).then(function () {
            ui.toast('Thêm mới thành công!', 'ok');
            loadBangDaTao();
        }).catch(function (err) { ums.api.handle(err, 'tạo dữ liệu kế toán'); });
    }

    function bangParams(action) {
        return { action: action, type: 'GET', strChucNang_Id: '', strAPI_DoiTac_Id: mv('bangKetNoi'), strTenBangDuLieu: mv('bangDaTao'), strNguoiThucHien_Id: '' };
    }

    function xemBang() {
        z('tblKetNoi').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        // getList_DuLieu_ChiTiet — cấu trúc JSON gửi đối tác
        var ct = bangParams('TC_KeToan/LayDSAPI_DoiTac_ChiTiet');
        ct.strTenBangDuLieu = '';
        get(ct).then(function (rows) { kt3.cauTruc = rows; }).catch(function (err) { ums.api.handle(err, 'cấu trúc API'); });

        get(bangParams('TC_KeToan/LayCauTrucHienThiDuLieuAPI')).then(function (cot) {
            kt3.cot = cot;
            return get(bangParams('TC_KeToan/LayDSDuLieuAPI'));
        }).then(function (hang) {
            kt3.hang = hang;
            var p = bangParams('TC_KeToan/LayGiaTriDuLieuAPI');
            p.strThanhPhan_Id = '';        // bản gốc: getValById('dropAAAA') — ô không tồn tại
            return get(p);
        }).then(function (giaTri) {
            kt3.giaTri = giaTri;
            drawBang();
        }).catch(function (err) { z('tblKetNoi').innerHTML = ui.fail(err.message); ums.api.handle(err, 'bảng dữ liệu'); });
    }

    function drawBang() {
        var map = {}, kieu = {};
        kt3.giaTri.forEach(function (g) { map[g.API_DOITUONGDULIEU_ID + '|' + g.THANHPHAN_ID] = g.THANHPHAN_GIATRI; });
        var cols = [
            { title: 'Mã', prop: 'API_DOITUONGDULIEU_MA', cls: 'is-center' },
            { title: 'Tên', prop: 'API_DOITUONGDULIEU_TEN' },
            { title: 'Ghi chú', prop: 'GHICHU' }
        ];
        kt3.cot.forEach(function (c) {
            var isNum = c.KIEUDULIEU === 'NUMBER';
            cols.push({
                title: e(c.THANHPHAN_TEN), cls: isNum ? 'is-right is-nowrap' : 'is-center',
                render: function (r) { var v = map[r.ID + '|' + c.THANHPHAN_ID]; return isNum ? ui.money(v) : ui.esc(v); },
                sum: isNum ? function (rows) { return '<b>' + ui.money(rows.reduce(function (a, r) { return a + num(map[r.ID + '|' + c.THANHPHAN_ID]); }, 0)) + '</b>'; } : undefined
            });
        });
        cols.push({ head: '<input type="checkbox" data-allpick="ketnoi">', cls: 'is-center', width: '44px', render: function (r) {
            return '<input type="checkbox" data-pick="ketnoi" value="' + ui.esc(r.ID) + '">';
        } });
        ui.table({ el: z('tblKetNoi'), rows: kt3.hang, columns: cols });
    }

    function xoaBang() {
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
            if (!yes) return;
            var p = bangParams('TC_KeToan/XoaBangDuLieuAPI');
            ums.api.call(p).then(function () { ui.toast('Xóa dữ liệu thành công!', 'ok'); })
                .catch(function (err) { ums.api.handle(err, 'xoá bảng dữ liệu'); })
                .then(loadBangDaTao);
        });
    }

    function uuid() {       // = edu.util.uuid
        return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    function doiTac() { return kt3.doiTac.filter(function (d) { return d.ID === mv('bangKetNoi'); })[0]; }
    function maXacThuc(dt) {
        try { return window.btoa(dt.TAIKHOAN + ':' + dt.MATKHAU + ': ' + uuid()).trim(); }
        catch (x) { return window.btoa(unescape(encodeURIComponent(dt.TAIKHOAN + ':' + dt.MATKHAU + ': ' + uuid()))).trim(); }
    }

    /* Dựng JSON theo cây cấu trúc (getDeQuy của bản gốc) */
    function deQuy(chaId, dataAPI) {
        var o = {};
        kt3.cauTruc.filter(function (c) { return (c.CHA_ID || null) === chaId; }).forEach(function (c) {
            var v = '';
            if (c.VALUE_API) {
                var t = dataAPI.filter(function (d) { return String(d.THANHPHAN_MA).toUpperCase() === String(c.VALUE_API).toUpperCase(); })[0];
                if (t) v = t.THANHPHAN_GIATRI;
            } else v = c.DATADEFAULT_API;
            switch (c.DATATYPE_API) {
                case 'number': o[c.KEY_API] = v ? parseFloat(v) : null; break;
                case 'object': o[c.KEY_API] = deQuy(c.ID, dataAPI); break;
                case 'array': o[c.KEY_API] = [deQuy(c.ID, dataAPI)]; break;
                default: o[c.KEY_API] = v;
            }
        });
        return o;
    }

    function customAPI(dt, api, json) {
        return ums.api.call({
            action: 'CM_UngDung/CustomAPI', type: 'POST',
            strHost: dt.DIACHI_API, strApi: api, strLoaiXacThuc: dt.LOAIXACTHUC_API,
            strMaXacThuc: maXacThuc(dt), strData: JSON.stringify(json), strNguoiThucHien_Id: ''
        });
    }

    function duyetKeToan() {
        var ids = picks('ketnoi');
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng', 'warn'); return; }
        var dt = doiTac();
        if (!dt) { ui.toast('Vui lòng chọn bảng kết nối kế toán', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn lưu ' + ids.length + ' liệu không?').then(function (yes) {
            if (!yes) return;
            ui.batch(ids.map(function (id) {
                return function () {
                    var hang = kt3.hang.filter(function (h) { return h.ID === id; })[0] || {};
                    var json = deQuy(null, kt3.giaTri.filter(function (g) { return g.API_DOITUONGDULIEU_ID === id; }));
                    return customAPI(dt, dt.LINK_API, json).then(function (r) {
                        ui.toast(e(hang.API_DOITUONGDULIEU_TEN) + ' - ' + e(hang.API_DOITUONGDULIEU_MA) + ': ' + e(r.data), 'info');
                    });
                };
            }), { title: 'Đang duyệt sang kế toán', toast: false });
        });
    }

    function xacNhanFast(data, re) {           // xacnhan_FastAPI
        var dt = doiTac();
        if (!dt) { ui.toast('Vui lòng chọn bảng kết nối kế toán', 'warn'); return Promise.resolve(); }
        var form = kt3.cauTruc.filter(function (c) { return c.KEY_API === 'form'; })[0];
        return customAPI(dt, String(dt.LINK_API).replace('SyncData', re), { form: form ? form.DATADEFAULT_API : '', data: data })
            .then(function (r) { ui.toast(e(r.data) + e(r.message), 'info'); })
            .catch(function (err) { ums.api.handle(err, 'đồng bộ kế toán'); });
    }

    function taoChungTu() {
        var ids = picks('ketnoi');
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng', 'warn'); return; }
        ui.dialog({
            title: 'Tạo chứng từ', icon: 'fa-file-circle-plus', size: 'sm',
            body: ui.field('Nhập số chứng từ', '<input class="ums-input" data-x="so" autocomplete="off">'),
            buttons: [{ text: 'Đồng ý', kind: 'save', onClick: function (dlg) {
                var so = dlg.body.querySelector('[data-x="so"]').value;
                ui.batch(ids.map(function (id) {
                    var p = bangParams('TC_KeToan/CapNhatDuLieuNhomAPI');
                    return { action: p.action, method: 'GET', type: 'GET', strGiaTriDuLieu: so, strChucNang_Id: '', strAPI_DoiTuongDuLieu_Id: id,
                             strAPI_DoiTac_Id: p.strAPI_DoiTac_Id, strTenBangDuLieu: p.strTenBangDuLieu, strNguoiThucHien_Id: '' };
                }), { title: 'Đang tạo chứng từ', okText: 'Thực hiện thành công' });
            } }]
        });
    }

    function xoaChungTu() {
        var ids = picks('ketnoi');
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng', 'warn'); return; }
        ids.forEach(function (id) {
            var p = bangParams('TC_KeToan/LayGiaTriDuLieuNhomAPI');
            get({ action: p.action, type: 'GET', strChucNang_Id: '', strAPI_DoiTuongDuLieu_Id: id, strAPI_DoiTac_Id: p.strAPI_DoiTac_Id,
                  strTenBangDuLieu: p.strTenBangDuLieu, strNguoiThucHien_Id: '' })
                .then(function (rows) { rows.forEach(function (x) { xacNhanFast([x.THANHPHAN_GIATRI], 'deleteData'); }); })
                .catch(function (err) { ums.api.handle(err, 'dữ liệu chứng từ'); });
        });
    }

    /* =====================================================================
       Màn con: năm tài chính (bảng + thêm dòng + lưu + xoá) — mở NGAY TRONG TRANG, thay chỗ màn
       (BO-CUC luật 1: màn con quản lý bảng con không bật hộp thoại)
       ===================================================================== */
    function dlgNamTaiChinh() {
        var rows = [];     // { id, isNew, nam, thang, namBC }
        var dlg = ums.pat.formTrang({
            host: root, title: 'Cấu hình năm tài chính', icon: 'fa-circle-dollar', cols: 1,
            body: '<div class="ums-row ums-u-mb-4"><input class="ums-input ums-u-flex1" data-x="nam" placeholder="Năm báo cáo" autocomplete="off">' +
                  '<button type="button" class="ums-btn ums-btn--primary" data-x="saveNam"><i class="fa-light fa-floppy-disk"></i><span>Lưu năm báo cáo</span></button>' +
                  '<button type="button" class="ums-btn ums-btn--out-success" data-x="addRow"><i class="fa-light fa-plus"></i><span>Thêm</span></button></div>' +
                  '<div data-x="tbl"></div>',
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function () { saveRows(); return false; } }]
        });
        var body = dlg.body;

        function draw() {
            ui.table({
                el: body.querySelector('[data-x="tbl"]'), rows: rows, empty: 'Chưa có cấu hình',
                columns: [
                    { title: 'Năm tài chính', render: function (r, i) {
                        return '<select class="bc-in" data-r="' + i + '" data-c="namBC"><option value="">Chọn năm tài chính</option>' +
                            namBaoCao.map(function (n) { return '<option value="' + ui.esc(n.ID) + '"' + (n.ID === r.namBC ? ' selected' : '') + '>' + ui.esc(n.TAICHINH_NAM_BAOCAO_TEN) + '</option>'; }).join('') +
                            '</select>';
                    } },
                    { title: 'Năm', render: function (r, i) { return '<input class="bc-in" data-r="' + i + '" data-c="nam" value="' + ui.esc(r.nam) + '">'; } },
                    { title: 'Tháng', render: function (r, i) { return '<input class="bc-in" data-r="' + i + '" data-c="thang" value="' + ui.esc(r.thang) + '">'; } },
                    { title: 'Xoá', cls: 'is-center', render: function (r, i) {
                        return '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-x="del" data-r="' + i + '" title="' + (r.isNew ? 'Xoá dòng' : 'Xoá') + '"><i class="fa-light fa-trash-can"></i></button>';
                    } }
                ]
            });
        }
        function reload() {
            get({ action: 'TC_ThuChi2/LayDSTaiChinh_Nam_Thang_BC', type: 'GET', strNguoiThucHien_Id: '' }).then(function (data) {
                rows = data.map(function (d) { return { id: d.ID, isNew: false, nam: e(d.NAM), thang: e(d.THANG), namBC: e(d.TAICHINH_NAM_BAOCAO_ID) }; });
                draw();
            }).catch(function (err) { ums.api.handle(err, 'năm tài chính'); });
        }
        function saveRows() {
            // Chỉ dòng mới: bản gốc gọi nhầm thủ tục DKH khi sửa dòng cũ (xem đầu tệp)
            var calls = rows.filter(function (r) { return r.isNew && r.namBC; }).map(function (r) {
                return { action: 'TC_ThuChi2/Them_TaiChinh_Nam_Thang_BC', type: 'POST', strTaiChinh_Nam_BaoCao_Id: r.namBC,
                         strNam: r.nam, strThang: r.thang, strNguoiThucHien_Id: '' };
            });
            if (!calls.length) { ui.toast('Không có dòng mới để lưu', 'warn'); return; }
            ui.batch(calls, { title: 'Đang lưu', okText: 'Đã lưu' }).then(reload);
        }

        body.addEventListener('input', function (ev) {
            var t = ev.target;
            if (t.hasAttribute('data-r') && t.hasAttribute('data-c')) rows[Number(t.getAttribute('data-r'))][t.getAttribute('data-c')] = t.value;
        });
        body.addEventListener('change', function (ev) {
            var t = ev.target;
            if (t.tagName === 'SELECT' && t.hasAttribute('data-r')) rows[Number(t.getAttribute('data-r'))].namBC = t.value;
        });
        body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-x]');
            if (!b) return;
            var x = b.getAttribute('data-x');
            if (x === 'addRow') { rows.push({ id: '', isNew: true, nam: '', thang: '', namBC: '' }); draw(); }
            else if (x === 'del') {
                var r = rows[Number(b.getAttribute('data-r'))];
                if (r.isNew) { rows.splice(rows.indexOf(r), 1); draw(); return; }
                ui.confirm('Bạn có chắc chắn muốn xoá?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                    if (!yes) return;
                    ums.api.call({ action: 'TC_ThuChi2/Xoa_TaiChinh_Nam_Thang_BC', strId: r.id, strNguoiThucHien_Id: '' })
                        .then(function () { ui.toast('Xóa thành công!', 'ok'); reload(); })
                        .catch(function (err) { ums.api.handle(err, 'xoá năm tài chính'); });
                });
            }
            else if (x === 'saveNam') {
                ums.api.call({ action: 'TC_ThuChi2/Them_TaiChinh_Nam_BaoCao', type: 'POST',
                               strNam: body.querySelector('[data-x="nam"]').value.trim(), strMoTa: '', dHieuLuc: 0, strNguoiThucHien_Id: '' })
                    .catch(function (err) { ums.api.handle(err, 'lưu năm báo cáo'); })
                    .then(function () { return loadNamBaoCao(); })
                    .then(draw);
            }
        });
        reload();
    }

    function xoaNamBaoCao() {
        if (!mv('namBaoCao')) { ui.toast('Vui lòng chọn năm tài chính', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({ action: 'TC_ThuChi2/Xoa_TaiChinh_Nam_BaoCao', type: 'POST', strId: mv('namBaoCao'), strNguoiThucHien_Id: '' })
                .then(function () { ui.toast('Xóa thành công!', 'ok'); loadNamBaoCao(); })
                .catch(function (err) { ums.api.handle(err, 'xoá năm tài chính'); });
        });
    }

    /* =====================================================================
       Hộp thoại: báo cáo đã thực hiện (+ xác nhận)
       ===================================================================== */
    var nutXacNhan = [];
    ums.api.dm('TAICHINH.BC.TINHTRANGBCLUU').then(function (rows) { nutXacNhan = rows; }).catch(function () {});

    function dlgDaThucHien() {
        var dlg = ui.dialog({
            title: 'Báo cáo đã thực hiện', icon: 'fa-file-invoice-dollar', size: 'xl',
            body: '<div class="ums-row ums-u-mb-4"><div style="min-width:280px"><select class="ums-select" data-x="canBo"><option value="">Chọn người thực hiện báo cáo</option></select></div>' +
                  '<span class="ums-u-flex1"></span>' +
                  '<button type="button" class="ums-btn ums-btn--save" data-x="xacNhan"><i class="fa-light fa-circle-check"></i><span>Xác nhận</span></button>' +
                  /* nút ẩn: nút "Xoá đã chọn" ở chân hộp bấm hộ, trình xử lý giữ nguyên trong thân */
                  '<button type="button" data-x="xoa" hidden></button></div>' +
                  '<div data-x="tbl"></div>',
            xoa: { chon: 'input[data-pick="bcdl"]', onClick: function (d) { d.body.querySelector('[data-x="xoa"]').click(); } }
        });
        var body = dlg.body;
        var sel = body.querySelector('[data-x="canBo"]');
        get({ action: 'TC_ThuChi2/LayDSNguoiThucHienBC', type: 'GET', strNguoiThucHien_Id: '' }).then(function (rows) {
            sel.innerHTML = ui.options(rows, { title: 'Chọn người thực hiện báo cáo' });
            ui.select2(sel, { placeholder: 'Chọn người thực hiện báo cáo', dropdownParent: window.jQuery ? jQuery(dlg.el) : undefined });
        }).catch(function (err) { ums.api.handle(err, 'người thực hiện báo cáo'); });

        function reload() {
            body.querySelector('[data-x="tbl"]').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            get({
                action: 'TC_ThuChi2/LayDSBC_BaoCaoDaThucHien', type: 'GET',
                strDauVao_HeDaoTao: mv('he'), strDaoVao_KhoaDaoTao: mv('khoa'), strDauVao_NganhHoc: mv('nganh'),
                strDauVao_ChuongTrinh: mv('ct'), strDauVao_KhoaQuanLy: mv('khoaQL'), strDauVao_LopQuanLy: mv('lop'),
                strDaoVao_HocKy: mv('hocKy'), strDauVao_NguoiThu: mv('nguoiThu'), strDauVao_NamNhapHoc: mv('namNhapHoc'),
                strDauVao_TuNgay: mv('tuNgay'), strDauVao_DenNgay: mv('denNgay'), strDauVao_TuKhoa: mv('tuKhoa'),
                strDauVao_KhoanThu: checked('kt').toString(), strNguoiThucHien_Id: sel.value
            }).then(function (rows) {
                var host = ums.session.host || '';
                ui.table({
                    el: body.querySelector('[data-x="tbl"]'), rows: rows,
                    columns: [
                        { title: 'Xác nhận', prop: 'TAICHINH_BC_XACNHANBCLUU_TEN' },
                        { title: 'Tên báo cáo', prop: 'DAUVAO_TENBAOCAO' },
                        { title: 'Dữ liệu báo cáo', render: function (x) {
                            var p = e(x.DAURA_DUONGDANBAOCAO);
                            if (!p) return '';
                            var href = p.indexOf('http') === -1 ? host + p : p;
                            return '<a href="' + ui.esc(href) + '" target="_blank" rel="noopener">' + ui.esc(p) + '</a>';
                        } },
                        { title: 'Người thực hiện', prop: 'NGUOITAO_TENDAYDU' },
                        { title: 'Ngày thực hiện', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-nowrap' },
                        { title: 'Ngành học', prop: 'DAUVAO_NGANHHOC_TEN' },
                        { title: 'Hệ đào tạo', prop: 'DAUVAO_HEDAOTAO_TEN' },
                        { title: 'Khoá đào tạo', prop: 'DAOVAO_KHOADAOTAO_TEN' },
                        { title: 'Chương trình', prop: 'DAUVAO_CHUONGTRINH_TEN' },
                        { title: 'Khoa quản lý', prop: 'DAUVAO_KHOAQUANLY_TEN' },
                        { title: 'Lớp quản lý', prop: 'DAUVAO_LOPQUANLY_TEN' },
                        { title: 'Thời gian (kỳ, đợt)', prop: 'DAOVAO_HOCKY_TEN' },
                        { title: 'Người thu', prop: 'DAUVAO_NGUOITHU_TEN' },
                        { title: 'Năm nhập học', prop: 'DAUVAO_NAMNHAPHOC_TEN' },
                        { title: 'Hình thức thu', prop: 'DAUVAO_HINHTHUCTHU_TEN' },
                        { title: 'Từ ngày → đến ngày', render: function (x) { return ui.esc(e(x.DAUVAO_TUNGAY_TEN) + ' --> ' + e(x.DAUVAO_TUNGAY_TEN)); } },
                        { title: 'Loại khoản', prop: 'DAUVAO_KHOANTHU_TEN' },
                        { title: 'Trạng thái người học', prop: 'DAUVAO_TRANGTHAINGUOIHOC_TEN' },
                        { head: '<input type="checkbox" data-allpick="bcdl">', cls: 'is-center', render: function (x) {
                            return '<input type="checkbox" data-pick="bcdl" value="' + ui.esc(x.ID) + '">';
                        } }
                    ]
                });
            }).catch(function (err) { body.querySelector('[data-x="tbl"]').innerHTML = ui.fail(err.message); ums.api.handle(err, 'báo cáo đã lưu'); });
        }
        if (window.jQuery) jQuery(sel).on('select2:select', reload);

        body.addEventListener('click', function (ev) {
            var t = ev.target;
            if (t.matches('[data-allpick]')) { each(body.querySelectorAll('[data-pick="bcdl"]'), function (x) { x.checked = t.checked; }); return; }
            var b = t.closest('[data-x]');
            if (!b) return;
            var ids = picks('bcdl', body);
            if (b.getAttribute('data-x') === 'xacNhan') {
                if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
                dlgXacNhan(ids);
            } else if (b.getAttribute('data-x') === 'xoa') {
                if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
                ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                    if (!yes) return;
                    ui.batch(ids.map(function (id) {
                        return { action: 'TC_ThuChi2/An_BC_BaoCaoDaThucHien', strId: id, strChucNang_Id: '', strNguoiThucHien_Id: '' };
                    }), { title: 'Đang xoá', okText: 'Đã xoá' }).then(reload);
                });
            }
        });
    }

    function dlgXacNhan(ids) {
        var dlg = ui.dialog({
            title: 'Xác nhận báo cáo', icon: 'fa-circle-check', size: 'md',
            body: ui.field('Nội dung', '<input class="ums-input" data-x="nd" autocomplete="off">') +
                  '<div class="ums-legend ums-legend--cach">Chọn xác nhận</div>' +
                  '<div class="bc-xn">' + nutXacNhan.map(function (n) {
                      var ic = e(n.THONGTIN1) || 'fa fa-paper-plane';
                      ic = ums.iconFA4(ic);   // tên FA4 → FA7
                      return '<button type="button" data-xn="' + ui.esc(n.ID) + '"><i class="' + ui.esc(ic) + '"></i><b>' + ui.esc(n.TEN) + '</b></button>';
                  }).join('') + '</div>' +
                  '<div class="ums-legend ums-legend--cach">Lịch sử xác nhận</div><div data-x="ls"></div>'
        });
        get({ action: 'TC_ThuChi2/LayDSTaiChinh_BC_XacNhanBCLuu', type: 'GET', strTuKhoa: '', strDuLieuXacNhan: ids[0],
              strLoaiXacNhan_Id: '', strNguoiXacNhan_Id: '', strHanhDong_Id: '', pageIndex: 1, pageSize: 100000 })
            .then(function (rows) {
                ui.table({ el: dlg.body.querySelector('[data-x="ls"]'), rows: rows, columns: [
                    { title: 'Xác nhận', prop: 'TINHTRANG_TEN' },
                    { title: 'Người xác nhận', prop: 'NGUOIXACNHAN_TENDAYDU' },
                    { title: 'Ngày', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center' }
                ] });
            }).catch(function (err) { ums.api.handle(err, 'lịch sử xác nhận'); });
        dlg.body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-xn]');
            if (!b) return;
            var nd = dlg.body.querySelector('[data-x="nd"]').value;
            ui.batch(ids.map(function (id) {
                return { action: 'TC_ThuChi2/Them_TaiChinh_BC_XacNhanBCLuu', type: 'POST', strSanPham_Id: id,
                         strNguoiXacnhan_Id: ums.session.userId, strNoiDung: nd, strTinhTrang_Id: b.getAttribute('data-xn') };
            }), { title: 'Đang xác nhận', okText: 'Xác nhận thành công' });
        });
    }

    /* =====================================================================
       Màn con: mã khách hàng (ký hiệu khoá – ngành) — mở NGAY TRONG TRANG, thay chỗ màn (BO-CUC luật 1).
       Hộp chọn hệ – khoá (dlgHeKhoa) là việc phụ, vẫn là hộp thoại.
       ===================================================================== */
    function dlgMaKhachHang() {
        var data = [];
        var dlg = ums.pat.formTrang({
            host: root, title: 'Khai báo mã khách hàng', icon: 'fa-id-card', cols: 1,
            body: '<div class="ums-row ums-u-mb-4"><span class="ums-u-flex1"></span>' +
                  '<button type="button" class="ums-btn ums-btn--out-success" data-x="add"><i class="fa-light fa-plus"></i><span>Thêm theo hệ – khoá</span></button>' +
                  '<button type="button" data-x="del" hidden></button></div>' +
                  '<div data-x="tbl"></div>',
            xoa: { chon: 'input[data-pick="mkh"]', onClick: function (d) { d.body.querySelector('[data-x="del"]').click(); } },
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function () { save(); return false; } }]
        });
        var body = dlg.body;
        function reload() {
            get({ action: 'TC_KeToan/LayDSTC_BC_KyHieu_KhoaNganh', type: 'GET', strNguoiThucHien_Id: '' }).then(function (rows) {
                data = rows;
                ui.table({ el: body.querySelector('[data-x="tbl"]'), rows: rows, columns: [
                    { title: 'Mã khoá', prop: 'MAKHOAHOC' },
                    { title: 'Tên khoá', prop: 'TENKHOAHOC' },
                    { title: 'Mã chương trình', prop: 'MACHUONGTRINH' },
                    { title: 'Tên chương trình', prop: 'TENCHUONGTRINH' },
                    { title: 'Ký hiệu', render: function (x) { return '<input class="bc-in" data-kh="' + ui.esc(x.ID) + '" data-old="' + ui.esc(e(x.KYHIEU)) + '" value="' + ui.esc(e(x.KYHIEU)) + '">'; } },
                    { head: '<input type="checkbox" data-allpick="mkh">', cls: 'is-center', render: function (x) {
                        return '<input type="checkbox" data-pick="mkh" value="' + ui.esc(x.ID) + '">';
                    } }
                ] });
            }).catch(function (err) { ums.api.handle(err, 'mã khách hàng'); });
        }
        function save() {
            var changed = [];
            each(body.querySelectorAll('[data-kh]'), function (i) { if (i.value !== i.getAttribute('data-old')) changed.push(i); });
            if (!changed.length) { ui.toast('Không có thay đổi để lưu', 'warn'); return; }
            ui.batch(changed.map(function (i) {
                var r = data.filter(function (x) { return x.ID === i.getAttribute('data-kh'); })[0] || {};
                return { action: 'TC_KeToan/Them_TC_BC_KyHieu_KhoaNganh', strChucNang_Id: '', strDaoTao_KhoaDaoTao_Id: r.DAOTAO_KHOADAOTAO_ID,
                         strDaoTao_ChuongTrinh_Id: r.DAOTAO_CHUONGTRINH_ID, strKyHieu: i.value.trim(), strNguoiThucHien_Id: '' };
            }), { title: 'Đang lưu', okText: 'Đã lưu' }).then(reload);
        }
        body.addEventListener('click', function (ev) {
            var t = ev.target;
            if (t.matches('[data-allpick]')) { each(body.querySelectorAll('[data-pick="mkh"]'), function (x) { x.checked = t.checked; }); return; }
            var b = t.closest('[data-x]');
            if (!b) return;
            if (b.getAttribute('data-x') === 'del') {
                var ids = picks('mkh', body);
                if (!ids.length) { ui.toast('Vui lòng chọn đối tượng', 'warn'); return; }
                ui.batch(ids.map(function (id) {
                    return { action: 'TC_KeToan/Xoa_TC_BC_KyHieu_KhoaNganh', type: 'POST', strId: id, strNguoiThucHien_Id: '' };
                }), { title: 'Đang xoá', okText: 'Đã xoá' }).then(reload);
            } else if (b.getAttribute('data-x') === 'add') dlgHeKhoa(reload);
        });
        reload();
    }

    function dlgHeKhoa(done) {
        var dlg = ui.dialog({
            title: 'Chọn hệ – khoá', icon: 'fa-layer-group', size: 'sm',
            body: ui.field('Hệ đào tạo', '<select class="ums-select" data-x="he"><option value=""></option></select>') +
                  '<div class="ums-u-mt-4">' + ui.field('Khoá đào tạo', '<select class="ums-select" data-x="khoa"><option value=""></option></select>') + '</div>',
            buttons: [{ text: 'Đồng ý', kind: 'save', onClick: function (d) {
                var he = d.body.querySelector('[data-x="he"]').value, khoa = d.body.querySelector('[data-x="khoa"]').value;
                if (!khoa) { ui.toast('Vui lòng chọn hệ - khóa?', 'warn'); return false; }
                ums.ref.chuongTrinh({ strDaoTao_HeDaoTao_Id: he, strKhoaDaoTao_Id: khoa, pageIndex: 1, pageSize: 1000000 }).then(function (cts) {
                    return ui.batch(cts.map(function (c) {
                        return { action: 'TC_KeToan/Them_TC_BC_KyHieu_KhoaNganh', strChucNang_Id: '', strDaoTao_KhoaDaoTao_Id: khoa,
                                 strDaoTao_ChuongTrinh_Id: c.ID, strKyHieu: '', strNguoiThucHien_Id: '' };
                    }), { title: 'Đang thêm', okText: 'Thêm mới thành công' });
                }).then(done).catch(function (err) { ums.api.handle(err, 'chương trình đào tạo'); });
            } }]
        });
        var selHe = dlg.body.querySelector('[data-x="he"]'), selKhoa = dlg.body.querySelector('[data-x="khoa"]');
        ums.ref.heDaoTao({ pageIndex: 1, pageSize: 1000000 }).then(function (rows) {
            selHe.innerHTML = ui.options(rows, { name: 'TENHEDAOTAO', title: 'Chọn hệ đào tạo' });
        }).catch(function (err) { ums.api.handle(err, 'hệ đào tạo'); });
        selHe.addEventListener('change', function () {
            ums.ref.khoaDaoTao({ strHeDaoTao_Id: selHe.value, pageIndex: 1, pageSize: 1000000 }).then(function (rows) {
                selKhoa.innerHTML = ui.options(rows, { name: 'TENKHOA', title: 'Chọn khóa đào tạo' });
            }).catch(function (err) { ums.api.handle(err, 'khoá đào tạo'); });
        });
    }

    /* =====================================================================
       Hộp thoại: lịch báo cáo tự động
       ===================================================================== */
    function dlgLich() {
        var dlg = ui.dialog({
            title: 'Lịch báo cáo tự động', icon: 'fa-calendar-days', size: 'xl',
            body: '<button type="button" data-x="del" hidden></button><div data-x="tbl"></div>',
            xoa: { chon: 'input[data-pick="lich"]', onClick: function (d) { d.body.querySelector('[data-x="del"]').click(); } }
        });
        var body = dlg.body;
        function reload() {
            ums.api.call({ action: 'TC_ThuChi2_MH/DSA4BRIDIC4CIC4P', func: 'PKG_TAICHINH_THUCHI2.LayDSBaoCao', dDaDatTuDong: 1, strNguoiThucHien_Id: '' })
                .then(function (r) {
                    var rows = rowsOf(r);
                    ui.table({ el: body.querySelector('[data-x="tbl"]'), rows: rows, columns: [
                        { title: 'Người tạo', prop: 'NGUOITHUCHIEN_TAIKHOAN' },
                        { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap' },
                        { title: 'Loại báo cáo', prop: 'LOAIBAOCAO' },
                        { title: 'Thông số báo cáo', cls: 'is-center', render: function (x) {
                            return '<button type="button" class="ums-btn ums-btn--quiet ums-btn--sm" data-ts="' + ui.esc(x.BAOCAO_ID) + '"><i class="fa-light fa-eye"></i><span>Xem</span></button>';
                        } },
                        { title: 'Đặt lịch tự động', prop: 'TUDONG' },
                        { title: 'Xem kết quả', render: function (x) { return '<span data-kq="' + ui.esc(x.BAOCAO_ID) + '"></span>'; } },
                        { head: '<input type="checkbox" data-allpick="lich">', cls: 'is-center', render: function (x) {
                            return '<input type="checkbox" data-pick="lich" value="' + ui.esc(x.BAOCAO_ID) + '">';
                        } }
                    ] });
                    rows.forEach(function (x) {
                        ums.api.call({ action: 'TC_ThuChi2_MH/DSA4CiQ1EDQgAyAuAiAu', func: 'PKG_TAICHINH_THUCHI2.LayKetQuaBaoCao', silent: true, strBaoCao_Id: x.BAOCAO_ID, strNguoiThucHien_Id: '' })
                            .then(function (k) {
                                var el = body.querySelector('[data-kq="' + x.BAOCAO_ID + '"]');
                                if (!el) return;
                                el.innerHTML = rowsOf(k).map(function (q) {
                                    var p = e(q.DUONGDANKETQUA);
                                    return '<a href="' + ui.esc(p) + '" target="_blank" rel="noopener">' + ui.esc(p.substring(p.lastIndexOf('/') + 1) + ' ' + e(q.NGAYTAO_DD_MM_YYYY_HHMMSS)) + '</a>';
                                }).join('<br>');
                            }).catch(function (err) { ums.api.handle(err, 'kết quả báo cáo'); });
                    });
                }).catch(function (err) { ums.api.handle(err, 'lịch báo cáo'); });
        }
        body.addEventListener('click', function (ev) {
            var t = ev.target;
            if (t.matches('[data-allpick]')) { each(body.querySelectorAll('[data-pick="lich"]'), function (x) { x.checked = t.checked; }); return; }
            var ts = t.closest('[data-ts]');
            if (ts) { dlgThongSo(ts.getAttribute('data-ts')); return; }
            var b = t.closest('[data-x="del"]');
            if (!b) return;
            var ids = picks('lich', body);
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                if (!yes) return;
                ui.batch(ids.map(function (id) {
                    return { action: 'TC_ThuChi2_MH/GS4gHgMgLgIgLh4VFR4VNAUuLyYeDSgiKQPP', func: 'PKG_TAICHINH_THUCHI2.Xoa_BaoCao_TT_TuDong_Lich', strId: id, strNguoiThucHien_Id: '' };
                }), { title: 'Đang xoá', okText: 'Đã xoá' }).then(reload);
            });
        });
        reload();
    }

    function dlgThongSo(id) {
        var dlg = ui.dialog({ title: 'Thông số báo cáo', icon: 'fa-sliders', size: 'lg', body: ui.empty('Đang tải…', 'fa-spinner fa-spin') });
        ums.api.call({ action: 'TC_ThuChi2_MH/DSA4FSkuLyYSLgMgLgIgLgPP', func: 'PKG_TAICHINH_THUCHI2.LayThongSoBaoCao', strBaoCao_Id: id, strNguoiThucHien_Id: '' })
            .then(function (r) {
                ui.table({ el: dlg.body, rows: rowsOf(r), columns: [
                    { title: 'Từ khoá', prop: 'TUKHOA' },
                    { title: 'Dữ liệu', prop: 'DULIEU' },
                    { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-nowrap' },
                    { title: 'Người tạo', prop: 'NGUOITHUCHIEN_TAIKHOAN' }
                ] });
            }).catch(function (err) { dlg.body.innerHTML = ui.fail(err.message); ums.api.handle(err, 'thông số báo cáo'); });
    }

    /* =====================================================================
       Tiện ích + sự kiện
       ===================================================================== */
    /* Đọc số thành chữ — tầng chung ums.ui.docSo (thư viện n2vi ở
       assets/vendor/n2vi, đúng thư viện bản gốc dùng) */
    function docSo(n) { return ui.docSo(num(n)); }

    function setTab(k) {
        tab = k;
        each(z('tabs').querySelectorAll('[data-tab]'), function (a) { a.classList.toggle('is-active', a.getAttribute('data-tab') === k); });
        each(root.querySelectorAll('[data-pane]'), function (p) { p.hidden = p.getAttribute('data-pane') !== k; });
    }

    root.addEventListener('click', function (ev) {
        var t = ev.target;
        if (t.matches('input[data-g][data-all]')) {
            each(root.querySelectorAll('input[data-g="' + t.getAttribute('data-g') + '"]'), function (x) { x.checked = t.checked; });
            return;
        }
        if (t.matches('[data-allpick]')) {
            each(root.querySelectorAll('[data-pick="' + t.getAttribute('data-allpick') + '"]'), function (x) { x.checked = t.checked; });
            return;
        }
        var tb = t.closest('[data-tab]');
        if (tb) { setTab(tb.getAttribute('data-tab')); return; }
        var b = t.closest('[data-act]');
        if (!b) return;
        switch (b.getAttribute('data-act')) {
            case 'search': search(1); break;
            case 'delPhaiNop': xoaPhaiNop(); break;
            case 'taoDuLieu': taoDuLieu(); break;
            case 'maKH': dlgMaKhachHang(); break;
            case 'xemBang': xemBang(); break;
            case 'xoaBang': xoaBang(); break;
            case 'taoChungTu': taoChungTu(); break;
            case 'xoaChungTu': xoaChungTu(); break;
            case 'tongHopCT': xacNhanFast('', 'confirmData'); break;
            case 'duyetKT': duyetKeToan(); break;
            case 'namTC': dlgNamTaiChinh(); break;
            case 'xoaNamBC': xoaNamBaoCao(); break;
            case 'daThucHien': dlgDaThucHien(); break;
            case 'lich': dlgLich(); break;
            case 'importKHTPN': ums.report.importChung('Xóa nợ khoản phải nộp', 'IMPORTWITHPROC_KHTPN'); break;
        }
    });
    f('tuKhoa').addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter') { ev.preventDefault(); search(1); }     // bản gốc gọi activeTabFun (không tồn tại) — dùng Tìm kiếm
    });

    z('tblTongThu').innerHTML = ui.empty('Vui lòng chọn khoản và ấn "Tìm kiếm" để tải danh sách', 'fa-magnifying-glass');
    z('tblPhaiNop').innerHTML = ui.empty('Vui lòng chọn khoản và ấn "Tìm kiếm" để tải danh sách', 'fa-magnifying-glass');
    z('tblKetNoi').innerHTML = ui.empty('Chọn bảng dữ liệu rồi bấm Tìm kiếm', 'fa-database');
})();
