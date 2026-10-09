/* =========================================================================
   Xuất lô hóa đơn
   Bản gốc: ApisTaiChinh/Modules/hoadon/scripts/xuatlohoadon.js (InHoaDonTuDong)
   ---------------------------------------------------------------------------
   Bộ lọc (ô chọn NHIỀU, giá trị nối "," như edu.util.getValCombo):
     hệ, khoá, chương trình, lớp (nối tầng), học kỳ (+ "kỳ thực hiện" chỉ dùng cho báo cáo),
     người thu, năm nhập học, khoa quản lý, hình thức thu; từ ngày, đến ngày, từ khoá;
     danh sách khoản thu (bắt buộc chọn) và trạng thái người học.
   Danh mục: ums.ref (hệ/khoá/CT/lớp/thời gian, pageSize như bản gốc), TC_NguoiDungDaThuTien,
     KHCT_NamNhapHoc/LayDanhSach, KHCT_KhoaQuanLy/LayDanhSach, QLTC.HTTHU, QLSV.TRANGTHAI,
     TC_KhoanThu/LayDanhSach, TAICHINH.NUTHDDT.

   Sáu tab (Tìm kiếm nạp tab đang mở — activeTabFun; bấm tab CHỈ chuyển tab, giữ dữ liệu cũ —
   bản gốc bỏ nạp khi bấm tab ngày 2026-09-22):
     1 TC_HoaDon/LayDSKhoanPhaiNopChuaXuatPTBL    2 TC_HoaDon/LayDSKhoanPhaiNopChuaXuatHD
     3 TC_HoaDon/LayDSKhoanDaNopChuaXuatHoaDon2   4 TC_HoaDon/LayDSKhoanDaNopDaXuatHoaDon
     5/6 TC_HoaDon/LayDSTaiChinh_SoHoaDon dChuaIn 0/1, strNguoiThucHien_Id = userId
     Tham số từng lời gọi chép nguyên văn — các lời gọi KHÔNG giống nhau (có cái gửi học kỳ,
     có cái gửi hình thức thu…), xem từng hàm bên dưới.

   Xuất theo lô:
     3 nút "Sinh số…" mở màn xác nhận, nạp danh sách xem trước (pageSize 1000000):
       biên lai công nợ → LayDSKhoanPhaiNopChuaXuatPTBL; hoá đơn công nợ → …PhaiNopChuaXuatHD;
       hoá đơn tự động → LayDSKhoanDaNopChuaXuatHoaDon2 (+ strNgayCapHoaDon, strKieuXuatHoaDon,
       strPhuongThuc_Ma không truyền = rỗng — đúng như bản gốc)
     Nút phát hành (TAICHINH.NUTHDDT, bỏ mã bắt đầu "HDDTNHAP") → xác nhận →
       HDDT_HoaDon/SinhHoaDonTuDongTheoLo  GET  (bộ lọc hiện tại + strNgayCapHoaDon,
       strKieuXuatHoaDon, strPhuongThuc_Ma, strNguoiDangNhap_Id). THONGTIN4 → ums.session.api.HDDT.
       Máy chủ tự tính tiền — màn hình không tính gì.
     Bấm một người học ở danh sách xem trước → xem nháp HĐĐT:
       TC_DaNop/ThemMoi… KHÔNG — bản gốc dựng obj_save action 'TC_DaNop/ThemMoi' rồi đổi thành
       HDDT_HoaDon/ThemMoi_Nhap (strPhuongThuc_MA 'HDDTNHAP'), số tiền/đơn giá/số lượng/chiết khấu
       lấy NGUYÊN từ các dòng xem trước của người đó → mở tab bản nháp. Kèm (từ 2026-09-22)
       strTaiChinh_SoTien_TruocThue_s (SOTIENTRUOCVAT) + strVat (VAT dòng đầu); lỗi mà có Data
       thì báo lỗi rồi vẫn mở đường dẫn trong Data.
   Lô in: TC_HoaDon/TaoLoHoaDonCanIn GET (dSoHoaDon_TrongLo 100, dChuaIn 0) · TC_HoaDon/LayDSLoHoaDon
     · TC_HoaDon/LayDSHoaDonTheoLo → in: mỗi hoá đơn dựng bản xem chung (TC_HoaDon/LayTTHoaDonThu_Rut)
   Rà soát thiếu thông tin (tab 3): LayDSKhoanDaNopChuaXuatHoaDon2 pageSize 1000000, lọc ở máy
     khách theo cột đã tick, xuất .xls từ bảng HTML (không gọi máy chủ).
   Báo cáo: ums.report.mount — đúng các cặp addKeyValue của bản gốc (strMaTruong "KCNTTTN"…,
     mỗi khoản thu một cặp strTAICHINH_CacKhoanThu_Ids), chặn khi chưa chọn khoản thu/trạng thái.

   CỐ Ý BỎ
     · save_TaoSo_HoaDon / _PhaiNop / BienLai_PhaiNop (TC_HoaDon/SinhHoaDonTuDongTheoLo,
       SinhHoaDonTuDongTheoLo_PN, SinhPhieuThuTuDongTheoLo_PN) cùng vùng "Xuất thành công":
       nút #btnXacNhanSinhSo đã bị comment trong HTML gốc → không đường nào gọi tới.
     · Lưu tình trạng đã in sau khi in lô (TC_HoaDon/Them_TinhTrangInHoaDon): bản gốc lặp
       `me.dtTemp.length` (undefined) → TypeError ngay trước vòng lưu, chưa bao giờ lưu được.
       Không mở đường ghi này; danh sách tab 5/6 vẫn nạp lại.
     · Xem nháp người học có LAHOCVIEN = 0: bản gốc gán `obj.strLoaiDoiTuong` (biến obj không tồn
       tại) → ReferenceError, không gửi gì. Ở đây báo không hỗ trợ thay vì gửi sai loại đối tượng.
     · Popover rê chuột trên thẻ xem trước (lưu HTML vào localStorage) → nút "chi tiết" mở hộp thoại.
     · Phôi in riêng theo MAUIN_MASO, liên hoá đơn, đổi mẫu in.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, esc = ui.esc, H = ums.hoadon;
    var root = document.getElementById('xuatlohoadon');
    var PAGE = 10;
    var TABS = [
        ['bl', '1. Công nợ - biên lai'],
        ['hd', '2. Công nợ - hóa đơn'],
        ['chua', '3. Đã nộp chưa xuất HĐ'],
        ['da', '4. Đã xuất HĐ'],
        ['chuain', '5. Hóa đơn chưa in'],
        ['dain', '6. Hóa đơn đã in']
    ];
    var st = {
        tab: 'bl', t: {}, nut: [], iPhaiNop: 0, preview: [], lo: [], loId: '', loHD: [],
        thieu: [], thieuOn: false
    };
    TABS.forEach(function (t) { st.t[t[0]] = { page: 1, total: 0, rows: [], q: '' }; });

    /* =============================================================
       Khung
       ============================================================= */
    var ms = function (k, ph) { return '<select class="ums-select" multiple data-x="' + k + '" data-ph="' + esc(ph) + '"></select>'; };
    root.innerHTML =
        '<div class="ums-page__head"><h1 class="ums-page__title ums-u-mb-0">Xuất lô hóa đơn</h1>' +
          '<div class="ums-page__actions"><span data-x="report"></span></div></div>' +
        '<div data-x="main">' +
          '<div class="ums-panel ums-u-mb-4"><div class="ums-panel__body">' +
            '<div class="ums-grid ums-grid--4">' +
              ms('he', 'Chọn hệ đào tạo') + ms('khoa', 'Chọn khóa đào tạo') + ms('ct', 'Chọn chương trình') + ms('lop', 'Chọn lớp') +
              ms('hocKy', 'Chọn học kỳ') +
              '<select class="ums-select" data-x="kyTH" hidden><option value="1">Trong kỳ này</option><option value="0">Đến kỳ này</option></select>' +
              ms('nguoiThu', 'Chọn người thu') + ms('namNH', 'Chọn năm nhập học') + ms('khoaQL', 'Chọn khoa quản lý') + ms('htt', 'Chọn hình thức thu') +
              '<div class="ums-inputwrap"><input class="ums-input" data-x="tuNgay" placeholder="Từ ngày dd/mm/yyyy" autocomplete="off"><i class="fa-light fa-calendar"></i></div>' +
              '<div class="ums-inputwrap"><input class="ums-input" data-x="denNgay" placeholder="Đến ngày dd/mm/yyyy" autocomplete="off"><i class="fa-light fa-calendar"></i></div>' +
            '</div>' +
            '<div class="ums-row ums-u-mt-4"><input class="ums-input ums-u-flex1" data-x="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off">' +
              ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
            '<details class="ums-u-mt-4" open><summary class="ums-legend ums-u-mb-2" style="cursor:pointer">Các khoản thu <span class="ums-u-danger">*</span></summary><div data-x="kt"></div></details>' +
            '<details class="ums-u-mt-4"><summary class="ums-legend ums-u-mb-2" style="cursor:pointer">Trạng thái người học</summary><div data-x="tt"></div></details>' +
          '</div></div>' +
          '<div class="hd-lo-grid">' +
            '<div class="ums-panel hd-lo-main">' +
              '<div class="ums-tabs">' + TABS.map(function (t) {
                  return '<button type="button" class="ums-tabs__item' + (t[0] === st.tab ? ' is-active' : '') + '" data-tab="' + t[0] + '">' + esc(t[1]) + '</button>';
              }).join('') + '</div>' +
              '<div class="ums-panel__body" data-x="tabTools"></div>' +
              '<div class="ums-panel__body ums-panel__body--flush" data-x="tbl"></div>' +
              '<div class="ums-panel__foot hd-lo-actions">' +
                '<button type="button" class="ums-btn ums-btn--out-warn" data-a="sinh" data-p="2"><i class="fa-light fa-receipt"></i><span>Sinh số biên lai theo công nợ tự động</span></button>' +
                '<button type="button" class="ums-btn ums-btn--out-warn" data-a="sinh" data-p="1"><i class="fa-light fa-ballot-check"></i><span>Sinh số hóa đơn theo công nợ tự động</span></button>' +
                '<button type="button" class="ums-btn ums-btn--primary" data-a="sinh" data-p="0"><i class="fa-light fa-file-invoice"></i><span>Sinh số hóa đơn tự động</span></button>' +
                '<button type="button" class="ums-btn ums-btn--danger" data-a="taoLo"><i class="fa-light fa-file-invoice-dollar"></i><span>Tạo lô in cho các hóa đơn chưa in</span></button>' +
              '</div>' +
            '</div>' +
            '<aside class="ums-panel hd-lo-aside">' +
              '<div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-database"></i> <span data-x="loTitle">Lô hóa đơn</span></div>' +
                '<div class="ums-panel__tools" data-x="loTools"></div></div>' +
              '<div class="ums-panel__body" data-x="lo"></div>' +
            '</aside>' +
          '</div>' +
        '</div>' +
        '<div data-x="preview" hidden></div>' +
        '<div data-x="inView" hidden><div class="ums-panel"><div class="ums-panel__head">' +
            '<div class="ums-panel__title"><i class="fa-light fa-print"></i> <span data-x="inTitle">In lô hóa đơn</span></div>' +
            '<div class="ums-panel__tools">' + ui.btn('close', { attr: { 'data-a': 'dongIn' } }) + ui.btn('print', { text: 'In', attr: { 'data-a': 'in' } }) +
            '</div></div><div class="ums-panel__body"><div data-x="inBody"></div></div></div></div>';
    // Kiểu: hoadon/css/_chung.css + hoadon/css/xuatlohoadon.css (nạp bằng <link> trong html)

    function x(n) { return root.querySelector('[data-x="' + n + '"]'); }
    function v(n) { return H.val(x(n)); }
    function fail(where) { return function (e) { ums.api.handle(e, where); }; }

    ['he', 'khoa', 'ct', 'lop', 'hocKy', 'nguoiThu', 'namNH', 'khoaQL', 'htt'].forEach(function (k) {
        ui.select2(x(k), { placeholder: x(k).getAttribute('data-ph') });
    });
    ui.datepicker(x('tuNgay'));
    ui.datepicker(x('denNgay'));

    /* =============================================================
       Danh mục
       ============================================================= */
    function loadHe() {
        return ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
            .then(function (r) { H.fillSelect(x('he'), r, 'ID', 'TENHEDAOTAO'); });
    }
    function loadKhoa() {
        return ums.ref.khoaDaoTao({ strHeDaoTao_Id: v('he'), strCoSoDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
            .then(function (r) { H.fillSelect(x('khoa'), r, 'ID', 'TENKHOA'); });
    }
    function loadCT() {
        return ums.ref.chuongTrinh({ strKhoaDaoTao_Id: v('khoa'), strN_CN_LOP_Id: '', strKhoaQuanLy_Id: '', strToChucCT_Cha_Id: '',
            strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
            .then(function (r) { H.fillSelect(x('ct'), r, 'ID', 'TENCHUONGTRINH'); });
    }
    function loadLop() {
        return ums.ref.lopQuanLy({ strCoSoDaoTao_Id: '', strDaoTao_HeDaoTao_Id: v('he'), strKhoaDaoTao_Id: v('khoa'), strNganh_Id: '',
            strLoaiLop_Id: '', strToChucCT_Id: v('ct'), strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
            .then(function (r) { H.fillSelect(x('lop'), r, 'ID', 'TEN'); });
    }
    var f = fail('nạp danh mục đào tạo');
    loadHe().catch(f); loadKhoa().catch(f); loadCT().catch(f); loadLop().catch(f);
    ums.ref.thoiGianDaoTao({ strNam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 })
        .then(function (r) { H.fillSelect(x('hocKy'), r, 'ID', 'DAOTAO_THOIGIANDAOTAO'); }).catch(f);
    H.nguoiThu().then(function (r) { H.fillSelect(x('nguoiThu'), r, 'ID', 'TAIKHOAN'); }).catch(f);
    ums.api.call({ action: 'KHCT_NamNhapHoc/LayDanhSach', method: 'GET', versionAPI: 'v1.0', strNguoiThucHien_Id: '', silent: true })
        .then(function (r) { H.fillSelect(x('namNH'), H.rows(r), 'NAMNHAPHOC', 'NAMNHAPHOC'); }).catch(f);
    ums.api.call({ action: 'KHCT_KhoaQuanLy/LayDanhSach', method: 'GET', versionAPI: 'v1.0', strNguoiThucHien_Id: '', silent: true })
        .then(function (r) { H.fillSelect(x('khoaQL'), H.rows(r), 'ID', 'TEN'); }).catch(f);
    ums.api.dm('QLTC.HTTHU').then(function (r) { H.fillSelect(x('htt'), r, 'ID', 'TEN'); }).catch(f);
    var ckTT = H.checks(x('tt'), H.trangThaiSV(), { checked: true });
    var ckKT = H.checks(x('kt'), H.khoanThu(), { checked: false });
    H.nutHDDT().then(function (r) { st.nut = r.filter(function (n) { return String(n.MA || '').indexOf('HDDTNHAP') !== 0; }); }).catch(f);

    jQuery(x('he')).on('select2:select select2:unselect', function () { loadKhoa().catch(f); loadCT().catch(f); loadLop().catch(f); });
    jQuery(x('khoa')).on('select2:select select2:unselect', function () { loadCT().catch(f); loadLop().catch(f); });
    // Chưa chọn tầng trên thì khoá tầng dưới; xoá tầng trên thì xoá tầng dưới
    ums.pat.chain([x('he'), x('khoa'), x('ct'), x('lop')], { phatLai: false });
    jQuery(x('ct')).on('select2:select select2:unselect', function () { loadLop().catch(f); });
    jQuery(x('hocKy')).on('change', function () { x('kyTH').hidden = !v('hocKy'); });

    /* =============================================================
       Bộ lọc dùng chung
       ============================================================= */
    function khoanThu() { return ckKT.ids(); }
    function trangThai() { return ckTT.val(); }
    function canKhoanThu(msg) {
        if (khoanThu().toString() === '') { ui.toast(msg || 'Vui lòng chọn khoản thu. Để có thể lấy danh sách khoản thu!', 'warn'); return false; }
        return true;
    }
    function ngayXuat() { var el = x('preview').querySelector('[data-p="ngay"]'); return el ? el.value.trim() : ''; }
    function kieuXuat() { var el = x('preview').querySelector('[data-p="kieu"]'); return el ? el.value : ''; }

    /** Tham số chung của 2 lời gọi "phải nộp" (tab 1, 2 và xem trước) */
    function pnParams(action, page, size) {
        return {
            action: action, method: 'GET', versionAPI: 'v1.0',
            pageIndex: page, pageSize: size,
            strTAICHINH_CacKhoanThu_Ids: khoanThu().toString(),
            strHeDaoTao_Id: v('he'), strKhoaDaoTao_Id: v('khoa'), strChuongTrinh_Id: v('ct'),
            strDAOTAO_THOIGIANDAOTAO_Id: v('hocKy'),
            strLopQuanLy_Id: v('lop'),
            strTuKhoa: x('q').value.trim(),
            strNguoiDung_Id: v('nguoiThu'),
            strTuNgay: x('tuNgay').value.trim(), strDenNgay: x('denNgay').value.trim(),
            strTrangThaiNguoiHoc_Id: trangThai(),
            strNguoiDangNhap_Id: ums.session.userId,
            strNamNhapHoc: v('namNH'), strKhoaQuanLy_Id: v('khoaQL')
        };
    }

    /** getList_KhoanThu_ChuaXuat / checkThieu_ChuaXuat */
    function chuaXuatParams(page, size) {
        return {
            action: 'TC_HoaDon/LayDSKhoanDaNopChuaXuatHoaDon2', method: 'GET', versionAPI: 'v1.0',
            pageIndex: page, pageSize: size,
            strTAICHINH_CacKhoanThu_Ids: khoanThu().toString(),
            strHeDaoTao_Id: v('he'), strKhoaDaoTao_Id: v('khoa'), strChuongTrinh_Id: v('ct'), strLopQuanLy_Id: v('lop'),
            strTuKhoa: x('q').value.trim(), strNguoiDung_Id: v('nguoiThu'),
            strTuNgay: x('tuNgay').value.trim(), strDenNgay: x('denNgay').value.trim(),
            strTrangThaiNguoiHoc_Id: trangThai(),
            strNamNhapHoc: v('namNH'), strKhoaQuanLy_Id: v('khoaQL'), strHinhThucThu_Id: v('htt')
        };
    }

    /* =============================================================
       Tab danh sách
       ============================================================= */
    var COL_PN = [
        { title: 'Mã số', prop: 'MASONGUOIHOC', cls: 'is-nowrap' }, { title: 'Họ tên', prop: 'HOTENNGUOIHOC' }, { title: 'Lớp', prop: 'LOP' },
        { title: 'Học kỳ', prop: 'DAOTAO_THOIGIANDAOTAO', cls: 'is-center' }, { title: 'Khoản thu', prop: 'TAICHINH_CACKHOANTHU_TEN', cls: 'is-center' },
        { title: 'Số tiền', cls: 'is-right', render: function (r) { return ui.money(r.SOTIEN); }, sum: true, sumProp: 'SOTIEN' },
        { title: 'Người tạo', prop: 'NGUOITAO_TENDAYDU' }, { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center' }
    ];
    var COLS = {
        bl: COL_PN, hd: COL_PN,
        chua: [
            { title: 'Mã số', prop: 'MASONGUOIHOC', cls: 'is-nowrap' }, { title: 'Họ tên', prop: 'HOTENNGUOIHOC' }, { title: 'CCCD', prop: 'CCCD' },
            { title: 'Số tiền', cls: 'is-right', render: function (r) { return ui.money(r.SOTIEN); }, sum: true, sumProp: 'SOTIEN' },
            { title: 'Nội dung', prop: 'NOIDUNG' }, { title: 'Địa chỉ', prop: 'DIACHICOQUANCONGTAC' }, { title: 'Lớp', prop: 'LOP' },
            { title: 'Học kỳ', prop: 'DAOTAO_THOIGIANDAOTAO', cls: 'is-center' }, { title: 'Khoản thu', prop: 'TAICHINH_CACKHOANTHU_TEN', cls: 'is-center' },
            { title: 'Người tạo', prop: 'NGUOITAO_TENDAYDU' }, { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center' }
        ],
        da: [
            { title: 'Mã số', prop: 'MASONGUOIHOC', cls: 'is-nowrap' }, { title: 'Họ tên', prop: 'HOTENNGUOIHOC' }, { title: 'Lớp', prop: 'LOP' },
            { title: 'Học kỳ', prop: 'DAOTAO_THOIGIANDAOTAO', cls: 'is-center' }, { title: 'Khoản thu', prop: 'TAICHINH_CACKHOANTHU_TEN', cls: 'is-center' },
            { title: 'Số tiền', cls: 'is-right', render: function (r) { return ui.money(r.SOTIEN); }, sum: true, sumProp: 'SOTIEN' },
            { title: 'Số chứng từ', prop: 'CHUNGTU_SO' }, { title: 'Người tạo', prop: 'NGUOITAO_TENDAYDU' }, { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center' }
        ],
        chuain: [
            { title: 'Năm', prop: 'TAICHINH_HOADON_NAM', cls: 'is-center' }, { title: 'Số hóa đơn', prop: 'SOHOADON', cls: 'is-center' },
            { title: 'Tổng tiền', cls: 'is-right', render: function (r) { return ui.money(r.SOTIEN); } },
            { title: 'Người tạo', prop: 'NGUOITAO_TENDAYDU' }, { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-center' },
            { title: 'Ngày cấp hóa đơn', prop: 'NGAYCAPHOADON', cls: 'is-center' }
        ]
    };
    COLS.dain = COLS.chuain;

    function callTab(k, page) {
        var t = st.t[k];
        switch (k) {
            case 'bl': return pnParams('TC_HoaDon/LayDSKhoanPhaiNopChuaXuatPTBL', page, PAGE);
            case 'hd': return pnParams('TC_HoaDon/LayDSKhoanPhaiNopChuaXuatHD', page, PAGE);
            case 'chua': return chuaXuatParams(page, PAGE);
            case 'da': return {
                action: 'TC_HoaDon/LayDSKhoanDaNopDaXuatHoaDon', method: 'GET', versionAPI: 'v1.0',
                pageIndex: page, pageSize: PAGE,
                strTAICHINH_CacKhoanThu_Ids: khoanThu().toString(),
                strHeDaoTao_Id: v('he'), strKhoaDaoTao_Id: v('khoa'), strChuongTrinh_Id: v('ct'), strLopQuanLy_Id: v('lop'),
                strTuKhoa: x('q').value.trim(), strNguoiDung_Id: v('nguoiThu'),
                strTuNgay: x('tuNgay').value.trim(), strDenNgay: x('denNgay').value.trim(),
                strTrangThaiNguoiHoc_Id: trangThai(), strNamNhapHoc: v('namNH'), strKhoaQuanLy_Id: v('khoaQL')
            };
            default: return {
                action: 'TC_HoaDon/LayDSTaiChinh_SoHoaDon', method: 'GET', versionAPI: 'v1.0',
                pageIndex: page, pageSize: PAGE,
                strTaichinh_Hoadon_Id: '', iTinhTrang: -1, dChuaIn: k === 'chuain' ? 0 : 1,
                strNguoiThucHien_Id: ums.session.userId,
                strTuKhoa: t.q.trim(), strTuNgay: '', strDenNgay: ''
            };
        }
    }

    function loadTab(page) {
        var k = st.tab, t = st.t[k];
        if (page) t.page = page;
        if (k === 'chua') { st.thieuOn = false; drawTools(); }
        if (['bl', 'hd', 'chua', 'da'].indexOf(k) >= 0 && !canKhoanThu()) return;
        x('tbl').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call(callTab(k, t.page)).then(function (r) {
            t.rows = H.rows(r);
            t.total = Number(r.pager) || t.rows.length;
            if (st.tab === k) drawTab();
        }).catch(function (e) { x('tbl').innerHTML = ui.fail(e.message); ums.api.handle(e, 'nạp danh sách'); });
    }

    function drawTab() {
        var k = st.tab, t = st.t[k];
        if (k === 'chua' && st.thieuOn) {
            return ui.table({ el: x('tbl'), rows: st.thieu, columns: COLS.chua.concat([{ title: 'Cột đang thiếu', prop: '_COTTHIEU' }]) });
        }
        ui.table({
            el: x('tbl'), rows: t.rows, columns: COLS[k],
            page: {
                index: t.page, size: PAGE, total: t.total, onChange: loadTab,
                onSize: function (v) { PAGE = v; loadTab(1); }
            }
        });
    }

    function drawTools() {
        var k = st.tab, el = x('tabTools');
        el.hidden = !(k === 'chua' || k === 'chuain' || k === 'dain');
        if (k === 'chua') {
            el.innerHTML = '<div class="hd-lo-thieu"><b><i class="fa-light fa-triangle-exclamation"></i> Rà soát thiếu thông tin:</b>' +
                [['CCCD', 'CCCD', 1], ['DIACHICOQUANCONGTAC', 'Địa chỉ', 1], ['NOIDUNG', 'Nội dung'], ['SOTIEN', 'Số tiền'], ['LOP', 'Lớp']].map(function (c) {
                    return '<label class="ums-check"><input type="checkbox" data-thieu="' + c[0] + '"' + (c[2] ? ' checked' : '') + '> ' + c[1] + '</label>';
                }).join('') +
                '<button type="button" class="ums-btn ums-btn--sm ums-btn--primary" data-a="thieu"><i class="fa-light fa-magnifying-glass"></i><span>Kiểm tra</span></button>' +
                '<button type="button" class="ums-btn ums-btn--sm ums-btn--out-info" data-a="thieuXls"' + (st.thieuOn && st.thieu.length ? '' : ' hidden') + '><i class="fa-light fa-file-excel"></i><span>Xuất Excel</span></button>' +
                '<button type="button" class="ums-btn ums-btn--sm ums-btn--out-primary" data-a="thieuBo"' + (st.thieuOn ? '' : ' hidden') + '><i class="fa-light fa-xmark"></i><span>Xem lại tất cả</span></button>' +
                '<span class="ums-u-fz13" data-x="thieuInfo"></span></div>';
        } else if (!el.hidden) {
            el.innerHTML = '<div class="ums-row"><input class="ums-input ums-u-flex1" data-x="tabQ" placeholder="Tìm số hoá đơn…" value="' + esc(st.t[k].q) + '">' +
                ui.btn('search', { attr: { 'data-a': 'tabSearch' } }) + '</div>';
        } else el.innerHTML = '';
    }

    /* ---------- Rà soát thiếu thông tin --------------------------------- */
    var NHAN = { CCCD: 'CCCD', DIACHICOQUANCONGTAC: 'Địa chỉ', NOIDUNG: 'Nội dung', SOTIEN: 'Số tiền', LOP: 'Lớp' };
    function thieu() {
        var cols = Array.prototype.filter.call(root.querySelectorAll('[data-thieu]'), function (c) { return c.checked; })
            .map(function (c) { return c.getAttribute('data-thieu'); });
        if (!cols.length) return ui.toast('Vui lòng tick ít nhất 1 cột cần kiểm tra', 'warn');
        if (!canKhoanThu('Vui lòng chọn khoản thu trước khi rà soát!')) return;
        x('thieuInfo').innerHTML = '<i class="fa-light fa-spinner fa-spin"></i> Đang quét dữ liệu...';
        ums.api.call(chuaXuatParams(1, 1000000)).then(function (r) {
            var rows = H.rows(r), dem = {}, out = [];
            cols.forEach(function (c) { dem[c] = 0; });
            rows.forEach(function (row) {
                var thieuCot = [];
                cols.forEach(function (c) {
                    var val = row[c];
                    if (val === null || val === undefined || String(val).trim() === '') { thieuCot.push(NHAN[c] || c); dem[c]++; }
                });
                if (thieuCot.length) { row._COTTHIEU = thieuCot.join(', '); out.push(row); }
            });
            var checked = cols.slice();
            st.thieu = out; st.thieuOn = true;
            drawTools();
            Array.prototype.forEach.call(root.querySelectorAll('[data-thieu]'), function (c) { c.checked = checked.indexOf(c.getAttribute('data-thieu')) >= 0; });
            drawTab();
            x('thieuInfo').innerHTML = out.length
                ? '<span class="ums-u-danger">Thiếu <b>' + out.length + '</b>/<b>' + rows.length + '</b> bản ghi (' +
                    cols.map(function (c) { return esc(NHAN[c]) + ': <b>' + dem[c] + '</b>'; }).join(' · ') + ')</span>'
                : '<span class="hd-ok">Đã quét <b>' + rows.length + '</b> bản ghi — không có bản ghi nào thiếu thông tin.</span>';
        }).catch(function (e) { x('thieuInfo').innerHTML = ''; ums.api.handle(e, 'rà soát'); });
    }

    function thieuXls() {
        var dt = st.thieu;
        if (!dt.length) return ui.toast('Không có bản ghi thiếu để xuất', 'warn');
        var cols = [['Mã số', 'MASONGUOIHOC'], ['Họ tên', 'HOTENNGUOIHOC'], ['CCCD', 'CCCD'], ['Số tiền', 'SOTIEN'], ['Nội dung', 'NOIDUNG'],
            ['Địa chỉ', 'DIACHICOQUANCONGTAC'], ['Lớp', 'LOP'], ['Học kỳ', 'DAOTAO_THOIGIANDAOTAO'], ['Khoản thu', 'TAICHINH_CACKHOANTHU_TEN'],
            ['Người tạo', 'NGUOITAO_TENDAYDU'], ['Ngày tạo', 'NGAYTAO_DD_MM_YYYY']];
        var h = '<table border="1"><thead><tr><th>Stt</th>' + cols.map(function (c) { return '<th>' + c[0] + '</th>'; }).join('') +
            '<th>Cột đang thiếu</th></tr></thead><tbody>' + dt.map(function (r, i) {
                return '<tr><td>' + (i + 1) + '</td>' + cols.map(function (c) { return '<td>' + esc(r[c[1]]) + '</td>'; }).join('') +
                    '<td>' + esc(r._COTTHIEU) + '</td></tr>';
            }).join('') + '</tbody></table>';
        var p = function (n) { return n < 10 ? '0' + n : '' + n; };
        var d = new Date();
        var name = 'ThieuThongTin_' + dt.length + 'banghi_' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '_' + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds()) + '.xls';
        var blob = new Blob(['﻿<html><head><meta charset="utf-8"></head><body>' + h + '</body></html>'], { type: 'application/vnd.ms-excel;charset=utf-8' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = name;
        root.appendChild(a); a.click();
        setTimeout(function () { root.removeChild(a); URL.revokeObjectURL(a.href); }, 1000);
        ui.toast('Đã xuất ' + dt.length + ' bản ghi thiếu ra file ' + name, 'ok');
    }

    /* =============================================================
       Xác nhận sinh số (xem trước) + phát hành HĐĐT theo lô
       ============================================================= */
    var TIEUDE = { 0: 'Xác nhận thông tin xuất hóa đơn', 1: 'Xác nhận thông tin xuất hóa đơn phải nộp', 2: 'Xác nhận thông tin xuất biên lai phải nộp' };

    function moXemTruoc(p) {
        if (!canKhoanThu()) return;
        st.iPhaiNop = p;
        x('preview').innerHTML =
            '<div class="ums-panel"><div class="ums-panel__head">' +
              '<div class="ums-panel__title"><i class="fa-light fa-triangle-exclamation"></i> ' + esc(TIEUDE[p]) + '</div>' +
              '<div class="ums-panel__tools" data-p="nut"></div></div>' +
            '<div class="ums-panel__body">' +
              '<div class="ums-grid ums-grid--2">' +
                ui.field('Ngày xuất hóa đơn', '<div class="ums-inputwrap"><input class="ums-input" data-p="ngay" placeholder="dd/mm/yyyy" autocomplete="off"><i class="fa-light fa-calendar"></i></div>',
                    { hint: 'Nếu không nhập ngày xuất hóa đơn thì hệ thống sẽ lấy theo ngày khoản thu.' }) +
                ui.field('Phương thức xuất hóa đơn', '<select class="ums-select" data-p="kieu"><option value="">-- Sinh số các khoản theo sinh viên --</option>' +
                    '<option value="TUNGBANGHI">-- Sinh số theo từng bản ghi dữ liệu --</option></select>') +
              '</div>' +
              '<div class="ums-legend ums-legend--cach">Danh sách chứng từ xem trước <span class="ums-u-faint ums-u-fz13" data-p="dem"></span></div>' +
              '<div data-p="ds">' + ui.empty('Đang tải danh sách chứng từ trước khi sinh số tự động. Vui lòng đợi ...', 'fa-spinner fa-spin') + '</div>' +
            '</div></div>';
        ui.datepicker(x('preview').querySelector('[data-p="ngay"]'));
        x('preview').querySelector('[data-p="nut"]').innerHTML = st.nut.map(function (n) {
            return '<button type="button" class="ums-btn ums-btn--navy" data-a="phatHanh" data-id="' + esc(n.ID) + '" title="' + esc(n.MA) + '">' +
                '<i class="fa-light fa-file-signature"></i><span>' + esc(n.TEN) + '</span></button>';
        }).join('') + ui.btn('close', { attr: { 'data-a': 'dongPrev' } });
        ui.swap(x('main'), x('preview'));

        var call = p === 2 ? pnParams('TC_HoaDon/LayDSKhoanPhaiNopChuaXuatPTBL', 1, 1000000)
            : p === 1 ? pnParams('TC_HoaDon/LayDSKhoanPhaiNopChuaXuatHD', 1, 1000000)
            : (function () {
                var c = chuaXuatParams(1, 1000000);
                c.strNgayCapHoaDon = ngayXuat();
                c.strKieuXuatHoaDon = kieuXuat();
                c.strPhuongThuc_Ma = undefined;              // bản gốc gọi không truyền đối số này
                return c;
            })();
        ums.api.call(call).then(function (r) { drawXemTruoc(H.rows(r)); })
            .catch(function (e) {
                ums.api.handle(e, 'nạp danh sách xem trước');
                var ds = x('preview').querySelector('[data-p="ds"]'); if (ds) ds.innerHTML = ui.fail(e.message);
            });
    }

    /** genTable_KhoanThu_PreView: gom các dòng LIỀN NHAU cùng QLSV_NGUOIHOC_ID thành một thẻ */
    function nhom(data) {
        var out = [];
        data.forEach(function (d) {
            var g = out[out.length - 1];
            if (g && g[0].QLSV_NGUOIHOC_ID === d.QLSV_NGUOIHOC_ID) g.push(d); else out.push([d]);
        });
        return out;
    }

    function drawXemTruoc(data) {
        st.preview = data;
        var ds = x('preview').querySelector('[data-p="ds"]');
        if (!ds) return;
        if (!data.length) { ds.innerHTML = ui.empty('Không có dữ liệu. Vui lòng thử lại!'); return; }
        var g = nhom(data);
        x('preview').querySelector('[data-p="dem"]').textContent = '(' + g.length + ' người học, ' + data.length + ' khoản)';
        // Lưới thẻ dùng chung, kiểu "thẻ có nút thao tác" (BO-CUC mục 5):
        // cả thẻ không bấm được, hai nút nằm ở chân thẻ.
        ums.pat.cards({
            el: ds, items: g, tone: function () { return 'info'; },
            title: function (list) {
                var kt = [];
                list.forEach(function (d) { if (kt.indexOf(d.TAICHINH_CACKHOANTHU_MA) < 0) kt.push(d.TAICHINH_CACKHOANTHU_MA); });
                return kt.toString();
            },
            render: function (list) {
                var tong = 0, kt = [];
                list.forEach(function (d) { tong += d.SOTIEN; if (kt.indexOf(d.TAICHINH_CACKHOANTHU_MA) < 0) kt.push(d.TAICHINH_CACKHOANTHU_MA); });
                var hien = kt.length > 3 ? kt.slice(0, 3).concat([' ... ']) : kt;
                var r0 = list[0];
                return '<span class="ums-card__no">' + esc(r0.HOTENNGUOIHOC) + '</span>' +
                    ums.pat.cardRow('Mã SV', r0.MASONGUOIHOC) +
                    ums.pat.cardRow('Khoản thu', hien.toString()) +
                    ums.pat.cardRow('Tổng tiền', H.fmt(tong));
            },
            actions: function (list) {
                var ma = esc(list[0].MASONGUOIHOC);
                return '<button type="button" class="ums-iconbtn ums-iconbtn--view" data-a="ctPrev" data-ma="' + ma +
                        '" title="Chi tiết khoản"><i class="fa-light fa-eye"></i></button>' +
                    '<button type="button" class="ums-iconbtn" data-a="nhapSV" data-ma="' + ma +
                        '" title="Xem nháp hoá đơn điện tử"><i class="fa-light fa-file-magnifying-glass"></i></button>';
            }
        });
    }

    function ctXemTruoc(ma) {
        var list = st.preview.filter(function (d) { return d.MASONGUOIHOC == ma; });   // eslint-disable-line eqeqeq
        var dlg = ui.dialog({ title: 'Các khoản của ' + ma, icon: 'fa-list', size: 'lg', body: '<div></div>' });
        ui.table({ el: dlg.body.firstChild, rows: list, columns: [
            { title: 'Học kỳ', prop: 'DAOTAO_THOIGIANDAOTAO', cls: 'is-center' }, { title: 'Khoản thu', prop: 'TAICHINH_CACKHOANTHU_TEN' },
            { title: 'Nội dung', prop: 'NOIDUNG' }, { title: 'Số tiền', cls: 'is-right', render: function (r) { return esc(H.fmt(r.SOTIEN)); } },
            { title: 'Người tạo', prop: 'NGUOITAO_TAIKHOAN' }, { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center' }
        ] });
    }

    function dongXemTruoc() {
        st.iPhaiNop = 0;
        ui.swap(x('preview'), x('main'));
    }

    /** save_LoHoaDon_HDDT */
    function lohdParams(ma) {
        return {
            action: 'HDDT_HoaDon/SinhHoaDonTuDongTheoLo', method: 'GET',
            strId: '',
            strTAICHINH_CacKhoanThu_Ids: khoanThu().toString(),
            strHeDaoTao_Id: v('he'), strKhoaDaoTao_Id: v('khoa'), strChuongTrinh_Id: v('ct'), strLopQuanLy_Id: v('lop'),
            strNgayCapHoaDon: ngayXuat(),
            strTuKhoa: x('q').value.trim(),
            strNguoiDung_Id: v('nguoiThu'),
            strTuNgay: x('tuNgay').value.trim(), strDenNgay: x('denNgay').value.trim(),
            strTrangThaiNguoiHoc_Id: trangThai(),
            strKieuXuatHoaDon: kieuXuat(),
            strPhuongThuc_Ma: ma,
            strNamNhapHoc: v('namNH'), strKhoaQuanLy_Id: v('khoaQL'), strHinhThucThu_Id: v('htt'),
            strNguoiDangNhap_Id: ums.session.userId
        };
    }

    function phatHanh(id) {
        var n = st.nut.find(function (z) { return String(z.ID) === String(id); });
        if (!n) return;
        if (n.THONGTIN4) ums.session.api.HDDT = n.THONGTIN4;
        ui.confirm('Bạn có chắc chắn muốn xuất hóa đơn điện tử không!', { ok: 'Xuất hoá đơn', title: 'Xuất hoá đơn điện tử theo lô' }).then(function (yes) {
            if (!yes) return;
            if (!canKhoanThu('Vui lòng chọn khoản thu. Để có thể sinh số hóa đơn!')) return;
            ums.api.call(lohdParams(n.MA)).then(function (r) {
                if (r.message) ui.toast(r.message, 'info', { timeout: 10000 });
                else ui.toast('Thực hiện thành công', 'ok');
            }).catch(function (e) { ums.api.handle(e, 'xuất hoá đơn điện tử theo lô'); });
        });
    }

    /** save_HoaDon_Nhap — xem nháp HĐĐT của một người học trong danh sách xem trước */
    function nhapParams(ma) {
        var dt = st.preview.filter(function (d) { return d.MASONGUOIHOC == ma; });  // eslint-disable-line eqeqeq
        if (!dt.length) return null;
        var d0 = dt[0];
        // Bản gốc nối chuỗi "',' + rowKT[k]" nên null/undefined thành chữ "null"/"undefined" — giữ nguyên
        var join = function (k, sep) { return dt.map(function (r) { return String(r[k]); }).join(sep || ','); };
        var htt = '';
        dt.forEach(function (r) {
            if (htt.indexOf(r.HINHTHUCTHU_TEN) === -1) htt = htt === '' ? r.HINHTHUCTHU_TEN : htt + '/' + r.HINHTHUCTHU_TEN;
        });
        return {
            // obj_save của bản gốc — 'action' đổi thành ThemMoi_Nhap ngay trước khi gửi
            action: 'HDDT_HoaDon/ThemMoi_Nhap',
            versionAPI: 'v1.0',
            strQLSV_NguoiHoc_Id: d0.QLSV_NGUOIHOC_ID,
            strTaiChinh_CacKhoanThu_Ids: join('ID'),
            strNguoiThucHien_Id: '',
            strHinhThucThu_MA: d0.HINHTHUCTHU_MA,
            strHinhThucThu_TEN: htt,
            strLoaiTienTe: d0.LOAITIENTE_MA,
            strDonViTinhTen_s: dt.map(function (r) { return r.DONVITINH_TEN ? r.DONVITINH_TEN : ''; }).join(','),
            strSoLuong_s: join('SOLUONG'),
            strDonGia_s: join('DONGIA'),
            strChietKhaus: join('CHIETKHAU'),
            strPhanTramChietKhaus: join('TYLECHIETKHAU'),
            strTaiChinh_SoTien_s: join('SOTIEN'),
            strTaiChinh_SoTien_TruocThue_s: join('SOTIENTRUOCVAT'),
            strVat: d0.VAT,
            strTaiChinh_NoiDung_s: join('NOIDUNG', '#'),
            strDaoTao_ToChucCT_Id: d0.DAOTAO_TOCHUCCHUONGTRINH_ID,
            strLoaiDoiTuong: '',
            strPhuongThuc_MA: 'HDDTNHAP',
            strNgayXuatChungTu: ngayXuat()
        };
    }

    function xemNhap(ma) {
        var dt = st.preview.filter(function (d) { return d.MASONGUOIHOC == ma; });  // eslint-disable-line eqeqeq
        if (!dt.length) return;
        if (String(dt[0].LAHOCVIEN) === '0') {
            return ui.toast('Xem nháp cho đối tượng không phải học viên (LAHOCVIEN = 0) chưa hỗ trợ: chương trình gốc lỗi ở bước này.', 'warn', { timeout: 8000 });
        }
        ums.api.call(nhapParams(ma)).then(function (r) { H.openTab(H.hddtNhapLink(r.data)); })
            .catch(function (e) {
                ums.api.handle(e, 'xem nháp hoá đơn điện tử');
                // Bản gốc: lỗi mà máy chủ vẫn trả Data (đường dẫn bản nháp) thì vẫn mở bản nháp
                if (e.data) H.openTab(H.hddtNhapLink(e.data));
            });
    }

    /* =============================================================
       Lô in
       ============================================================= */
    function loadLo() {
        return ums.api.call({ action: 'TC_HoaDon/LayDSLoHoaDon', method: 'GET', versionAPI: 'v1.0', strNguoiThucHien_Id: ums.session.userId })
            .then(function (r) { st.lo = H.rows(r); drawLo(); })
            .catch(function (e) { x('lo').innerHTML = ui.fail(e.message); ums.api.handle(e, 'nạp lô hoá đơn'); });
    }

    function drawLo() {
        st.loId = '';
        x('loTitle').textContent = 'Lô hóa đơn';
        x('loTools').innerHTML = '<button type="button" class="ums-iconbtn" data-a="loReload" title="Tải lại"><i class="fa-light fa-rotate-right"></i></button>';
        if (!st.lo.length) { x('lo').innerHTML = ui.empty('Chưa có lô hóa đơn nào'); return; }
        x('lo').innerHTML = '<div class="hd-lo">' + st.lo.map(function (l) {
            var p = l.TONGSOHOADONDAIN > 0 && l.TONGSOHOADON > 0 ? l.TONGSOHOADONDAIN / (l.TONGSOHOADON * 1.0) * 100 : 0;
            return '<div class="hd-lo__item"><div class="ums-meter" title="Đã in ' + esc(l.TONGSOHOADONDAIN) + '/' + esc(l.TONGSOHOADON) + '">' +
                '<b class="ums-u-fz13">#' + esc(l.TEN) + '</b><div class="ums-meter__track"><div class="ums-meter__fill" style="width:' + p + '%"></div></div></div>' +
                '<button type="button" class="ums-iconbtn ums-iconbtn--view" data-a="loXem" data-id="' + esc(l.ID) + '" title="Xem hóa đơn trong lô"><i class="fa-light fa-eye"></i></button>' +
                '<button type="button" class="ums-iconbtn" data-a="loIn" data-id="' + esc(l.ID) + '" title="Thực hiện in hóa đơn trong lô"><i class="fa-light fa-print"></i></button></div>';
        }).join('') + '</div>';
    }

    function hoaDonTheoLo(id) {
        return ums.api.call({ action: 'TC_HoaDon/LayDSHoaDonTheoLo', method: 'GET', versionAPI: 'v1.0', strLoHoaDon_Id: id, strNguoiThucHien_Id: ums.session.userId })
            .then(function (r) { return H.rows(r); });
    }

    function xemLo(id) {
        var l = st.lo.find(function (z) { return String(z.ID) === String(id); }) || {};
        hoaDonTheoLo(id).then(function (list) {
            if (!list.length) return;
            st.loId = id; st.loHD = list;
            x('loTitle').innerHTML = 'Lô đã chọn: <span class="ums-u-danger">#' + esc(l.TEN) + '</span>';
            x('loTools').innerHTML = '<button type="button" class="ums-iconbtn" data-a="loDong" title="Đóng"><i class="fa-light fa-xmark"></i></button>' +
                '<button type="button" class="ums-btn ums-btn--danger ums-btn--sm" data-a="loIn" data-id="' + esc(id) + '"><i class="fa-light fa-print"></i><span>Thực hiện in</span></button>';
            x('lo').innerHTML = '<div class="hd-lo-hd">' + list.map(function (h) {
                return '<span class="' + (h.SOLANDAIN > 0 ? 'is-done' : '') + '"><i class="fa-light ' + (h.SOLANDAIN > 0 ? 'fa-file-lines' : 'fa-file') + '"></i> ' + esc(h.SOHOADON) + '</span>';
            }).join('') + '</div>';
        }).catch(fail('nạp hoá đơn trong lô'));
    }

    function inLo(id) {
        hoaDonTheoLo(id).then(function (list) {
            if (!list.length) return ui.toast('Lô không có hoá đơn', 'warn');
            // MỘT khung xem, mỗi hoá đơn nối thêm một trang (ums.phieu.viewer.add)
            var host = x('inBody');
            host.innerHTML = '';
            delete host.__phieu;
            var v = H.viewer(host);
            return ui.batch(list.map(function (h) {
                return function () {
                    return v.add({ id: h.ID, loai: 'HOADON' }).then(function (row) {
                        if (!row) throw new Error('Không dựng được hoá đơn ' + (h.SOHOADON || h.ID));
                        return row;
                    });
                };
            }), { title: 'Đang dựng hoá đơn trong lô', toast: false }).then(function (res) {
                x('inTitle').textContent = 'In lô hóa đơn — ' + res.ok + '/' + list.length + ' hoá đơn';
                ui.swap(x('main'), x('inView'));
                // Bản gốc: lưu tình trạng đã in → lỗi (me.dtTemp) nên KHÔNG lưu; chỉ nạp lại tab 5/6
            });
        }).catch(fail('in lô hoá đơn'));
    }

    function taoLo() {
        ui.confirm('Sinh lô hóa đơn hơi lâu. Hãy đợi nhé ^_^', { ok: 'Tạo lô in' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({
                action: 'TC_HoaDon/TaoLoHoaDonCanIn', method: 'GET', versionAPI: 'v1.0',
                strId: '', strNguoiThucHien_Id: ums.session.userId, strTAICHINH_HoaDon_Id: '', dSoHoaDon_TrongLo: 100, dChuaIn: 0
            }).then(function () { loadLo(); ui.toast('Các lô hóa đơn đã sẵn sàng để in!', 'ok'); })
                .catch(fail('tạo lô in'));
        });
    }

    /* =============================================================
       Báo cáo
       ============================================================= */
    ums.report.mount(x('report'), {
        collect: function (add) {
            var pham = v('hocKy') ? x('kyTH').value : '';
            var kt = khoanThu();
            var tt = trangThai();
            if (kt.length === 0) { ui.toast('Vui lòng chọn khoản thu!', 'warn'); return false; }
            if (tt === '') { ui.toast('Vui lòng chọn trạng thái!', 'warn'); return false; }
            add('strMaTruong', 'KCNTTTN');
            add('strNguoiDangNhap_Id', ums.session.userId);
            add('strNguoiThucHien_Id', v('nguoiThu'));
            add('strHeDaoTao_Id', v('he'));
            add('strKhoaDaoTao_Id', v('khoa'));
            add('strChuongTrinh_Id', v('ct'));
            add('strLopQuanLy_Id', v('lop'));
            add('strThoiGianDaoTao_Id', v('hocKy'));
            add('strPhamViApDung', pham);
            add('strTuNgay', x('tuNgay').value.trim());
            add('strDenNgay', x('denNgay').value.trim());
            add('strTuKhoa', x('q').value.trim());
            add('strKhoaQuanLy_Id', v('khoaQL'));
            add('strNamNhapHoc', v('namNH'));
            add('strTuSo', '');                  // #txtSearch_TuSo_IHD không có trong HTML gốc
            add('strDenSo', '');
            kt.forEach(function (id) { add('strTAICHINH_CacKhoanThu_Ids', id); });
            add('strTrangThaiNguoiHoc_Id', tt);
        }
    });

    /* =============================================================
       Sự kiện
       ============================================================= */
    root.addEventListener('click', function (e) {
        var tab = e.target.closest('[data-tab]');
        if (tab) {
            st.tab = tab.getAttribute('data-tab');
            Array.prototype.forEach.call(root.querySelectorAll('[data-tab]'), function (t) { t.classList.toggle('is-active', t === tab); });
            // Bản gốc (từ 2026-09-22) bỏ nạp khi bấm tab: chỉ chuyển tab, giữ dữ liệu lần nạp trước
            drawTools();
            drawTab();
            return;
        }
        var a = e.target.closest('[data-a]');
        if (!a) return;
        switch (a.getAttribute('data-a')) {
            case 'search': loadTab(1); break;
            case 'tabSearch': st.t[st.tab].q = x('tabQ').value; loadTab(1); break;
            case 'thieu': thieu(); break;
            case 'thieuXls': thieuXls(); break;
            case 'thieuBo': st.thieu = []; st.thieuOn = false; drawTools(); loadTab(); break;
            case 'sinh': moXemTruoc(Number(a.getAttribute('data-p'))); break;
            case 'dongPrev': dongXemTruoc(); break;
            case 'phatHanh': phatHanh(a.getAttribute('data-id')); break;
            case 'ctPrev': ctXemTruoc(a.getAttribute('data-ma')); break;
            case 'nhapSV': xemNhap(a.getAttribute('data-ma')); break;
            case 'taoLo': taoLo(); break;
            case 'loReload': loadLo(); break;
            case 'loXem': xemLo(a.getAttribute('data-id')); break;
            case 'loIn': inLo(a.getAttribute('data-id')); break;
            case 'loDong': drawLo(); break;
            case 'in': H.print(x('inBody'), 'In lô hóa đơn'); break;
            case 'dongIn':
                ui.swap(x('inView'), x('main'));
                st.t.chuain.page = st.t.dain.page = 1;
                break;
        }
    });
    root.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter') return;
        if (e.target === x('q')) { e.preventDefault(); loadTab(1); }
        if (e.target === x('tabQ')) { e.preventDefault(); st.t[st.tab].q = e.target.value; loadTab(1); }
    });

    root._hd = { st: st, pnParams: pnParams, chuaXuatParams: chuaXuatParams, lohdParams: lohdParams, nhapParams: nhapParams, callTab: callTab };
    drawTools();
    loadLo();
})();
