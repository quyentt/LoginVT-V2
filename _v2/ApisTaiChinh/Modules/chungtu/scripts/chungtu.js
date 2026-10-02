/* =========================================================================
   Chứng từ — xuất phiếu thu / biên lai / hoá đơn cho khoản đã nộp
   Bản gốc: ApisTaiChinh/Modules/chungtu/scripts/chungtu.js (3.327 dòng)
            + Core/systemextend.js (getData_Phieu, removeNoiDungDai)
   ---------------------------------------------------------------------------
   Lời gọi — chép nguyên bản gốc:
     Tìm người học
       SV_NGUOIHOC_01_MH/DSA4BRIPJjQuKAkuIh4ALS0P   PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc_All
           (phân trang 10 dòng; đúng 1 kết quả thì tự chọn, như bản gốc)
       Hệ/Khoá/Chương trình/Lớp: ums.ref.cascade (= edu.system.getList_*)
       CM_DanhMucDuLieu/LayDanhSach  QLSV.TRANGTHAI   ô đánh dấu trạng thái SV
       CM_DanhMucDuLieu/LayDanhSach  TAICHINH.NUTHDDT nút xuất hoá đơn điện tử
       TC_KhoanThu/LayDanhSach                          danh sách khoản để tách
     Tình hình tài chính (GET, versionAPI v1.0, strQLSV_NguoiHoc_Id)
       TC_ThongTinChung/LayDanhSach   → rsThongTin, rsKhoanDaNopChuaXuat{PhieuThu|BienLai|HoaDon}
       TC_ThongTinChung/LayDSKhoanPhaiNop | LayDSKhoanMien | LayDSKhoanDaNop | LayDSKhoanDaRut
       TC_ThongTinChung/LayDSKhoanNoRieng | LayDSKhoanNoChung | LayDSKhoanDuRieng | LayDSKhoanDuChung
       TC_ThongTinChung/LayDSPhieuDaThu | LayDSPhieuDaRut | LayDSPhieuHoaDon
     Lưu chứng từ (POST, versionAPI v1.0)
       TC_DaNop_PhieuThu/ThemMoi      phiếu thu và biên lai (cùng một action, như bản gốc)
       TC_DaNop_HoaDon/ThemMoi        hoá đơn
       HDDT_HoaDon/ThemMoi            hoá đơn điện tử (nút TAICHINH.NUTHDDT)
       HDDT_HoaDon/ThemMoi_Nhap       hoá đơn điện tử nháp (mã nút bắt đầu "HDDTNHAP") → mở link
       TC_SoBienLai/HuyBienLai        huỷ chứng từ
     Xem chứng từ đã lưu (edu.extend.getData_Phieu)
       TC_PhieuThu/LayTTPhieuThu_Rut  strPhieuThu_Rut_Id   (loại BIENLAI)
       TC_HoaDon/LayTTHoaDonThu_Rut   strHoaDonThu_Rut_Id  (loại HOADON)

   Nút HDDT: bản gốc gán edu.system.objApi["HDDT"] = THONGTIN4 của nút (nếu
   có) trước khi gọi — tức đổi base URL của tiền tố HDDT. Ở đây làm y như vậy
   trên ums.session.api.HDDT (tham số urlService của makeRequest bản gốc bị
   bỏ qua, nên URL thật luôn là objApi.HDDT + '/HDDT_HoaDon/...').
   Nghi ngờ, giữ nguyên: HDDT gửi strTaiChinh_CacKhoanThu_Ids = danh sách id
   KHOẢN ĐÃ NỘP (không phải id khoản thu) — bản gốc truyền đúng như vậy.
   Nghi ngờ, giữ nguyên: tách khoản vượt định mức (số tiền sau < 0) chỉ cảnh
   báo rồi vẫn tách (bản gốc đã comment dòng `return`).

   CHƯA CHUYỂN — cần tầng chung:
     · Mẫu in theo trường (edu.extend.genData_PhieuThu / genData_HoaDon, ~3.300
       dòng trong Core/systemextend.js, nạp Upload/Files/PrintTemplate/<MAUIN_MASO>.html
       rồi điền theo từng mẫu). Ở đây vẽ một mẫu chung từ đúng các cột engine
       gốc đọc (rs: TAICHINH_CACKHOANTHU_TEN, NOIDUNG, SOTIENDATHU, SOCHUNGTU,
       NGAYTAO_DD_MM_YYYY, NGUOITAO_TAIKHOAN, DUONGDANFILEHOADON;
       rsThongTinDoiTuong: HODEM, TEN, MASO, …). Chọn liên hoá đơn
       (genChonLien) phụ thuộc mẫu in nên chưa có.
     · Biểu mẫu viết phiếu gốc nạp Edit_DHCNTTTN_*.html; ở đây dựng lại đúng
       các ô mẫu đó có (hình thức thu chỉ có ở mẫu biên lai → hoá đơn gửi
       strHinhThucThu_Id rỗng, đúng như bản gốc).

   Cố ý bỏ:
     · getList_ThoiGianDaoTao: bản gốc đổ danh sách học kỳ vào CHÍNH ô Khoá
       đào tạo (dropSearch_KhoaDaoTao_CT), ghi đè ngẫu nhiên danh sách khoá.
     · Popover thông tin SV khi rê chuột, ảnh đại diện trong danh sách.
     · Nút "Xem trước" (popup in không tự in): khung chứng từ trên màn đã là
       bản xem trước; nút In dùng ums.ui.print.
     · Tab 5 "hoá đơn đã nộp" (tbldata_HoaDon_DaNop): có trong HTML nhưng
       không có tab bấm vào được và không lời gọi nào đổ dữ liệu.
     · Các nút *_Tab2..5 trong init(): không phần tử nào có các lớp đó.
     · Đọc số thành chữ dùng ums.ui.docSo (thư viện n2vi ở tầng chung).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var root = document.getElementById('chungtu');
    if (!root) return;

    /* Bố cục hai cột dùng chung — ums.pat.master (BO-CUC mục 4). Khi mở khung
       chứng từ thì ẩn cột trái (lớp is-wide, xem css/chungtu.css). */
    var mst = ums.pat.master({
        el: root,
        title: 'Chứng từ',
        side: {
            title: 'Người học', icon: 'fa-user-graduate', search: 'Nhập từ khoá tìm kiếm',
            filter:
                // Khung chung với Thu tiền (.ums-master__adv, components/patterns.css)
                '<div class="ums-master__adv" data-z="adv" hidden>' +
                '<div class="ums-field"><select class="ums-select" data-f="he"></select></div>' +
                '<div class="ums-field"><select class="ums-select" data-f="khoa"></select></div>' +
                '<div class="ums-field"><select class="ums-select" data-f="ct"></select></div>' +
                '<div class="ums-field"><select class="ums-select" data-f="lop"></select></div>' +
                '<div class="ums-master__advtitle">Trạng thái sinh viên</div>' +
                '<label class="ums-check"><input type="checkbox" data-tt="all" checked> <b>Tất cả</b></label>' +
                '<div class="ums-master__tt" data-z="trangThai"></div>' +
                '</div>'
        },
        main: { title: false }
    });
    mst.side.querySelector('.ums-panel__tools').innerHTML =
        '<button type="button" class="ums-iconbtn" data-act="search" title="Tải lại"><i class="fa-light fa-rotate-right"></i></button>' +
        '<button type="button" class="ums-iconbtn" data-act="adv" title="Tìm nâng cao"><i class="fa-light fa-sliders"></i></button>';
    mst.sideBody.setAttribute('data-z', 'svList');
    mst.search.setAttribute('data-f', 'tuKhoa');
    mst.mainBody.innerHTML =
        '<div data-z="empty" class="ums-panel"><div class="ums-panel__body">' +
        ui.empty('Tìm và chọn một người học để xem tình hình học phí và xuất chứng từ', 'fa-user-magnifying-glass') +
        '</div></div>' +

        '<div data-z="info" hidden>' +
        /* Đầu khung CHUNG (ums.pat.dauDoiTuong, người dùng 2026-09-26) dựng khi chọn người học: ảnh + tên +
           trạng thái + tổng nợ / dư · Đóng. "Tổng tiền đã chọn" nằm ở thanh thao tác của tab, cạnh nút Xuất. */
        '  <div class="ums-panel ums-u-mb-4" data-z="svPanel">' +
        '    <nav class="ums-tabs" data-z="tabs">' +
        '      <a class="ums-tabs__item is-active" href="javascript:void(0)" data-tab="1"><i class="fa-light fa-circle-dollar-to-slot"></i> Tình hình học phí</a>' +
        '      <a class="ums-tabs__item" href="javascript:void(0)" data-tab="PhieuThu"><i class="fa-light fa-receipt"></i> Xuất phiếu thu</a>' +
        '      <a class="ums-tabs__item" href="javascript:void(0)" data-tab="BienLai"><i class="fa-light fa-file-invoice-dollar"></i> Xuất biên lai</a>' +
        '      <a class="ums-tabs__item" href="javascript:void(0)" data-tab="HoaDon"><i class="fa-light fa-file-invoice"></i> Xuất hoá đơn</a>' +
        '    </nav>' +
        '    <div class="ums-panel__body" data-pane="1"><div class="ct-stats" data-z="stats"></div></div>' +
        '    <div class="ums-panel__body" data-pane="PhieuThu" hidden></div>' +
        '    <div class="ums-panel__body" data-pane="BienLai" hidden></div>' +
        '    <div class="ums-panel__body" data-pane="HoaDon" hidden></div>' +
        '  </div>' +
        '</div>' +

        '<div class="ums-panel" data-z="tach" hidden>' +
        '  <div class="ums-panel__head">' +
        '    <div class="ums-panel__title"><i class="fa-light fa-money-check-dollar-pen"></i> Tách khoản</div>' +
        '    <div class="ums-panel__tools">' +
        '      <button type="button" class="ums-btn ums-btn--ghost" data-act="closeTach"><i class="fa-light fa-xmark"></i><span>Đóng</span></button>' +
        '      <button type="button" class="ums-btn ums-btn--save" data-act="doTach"><i class="fa-light fa-money-check-dollar-pen"></i><span>Tách khoản</span></button>' +
        '    </div></div>' +
        '  <div class="ums-panel__body ums-panel__body--flush" data-z="tachTable"></div>' +
        '  <div class="ums-panel__body"><div class="ums-legend">Chọn khoản cần tách</div>' +
        '    <div class="ums-checkgrid" data-z="tachKhoan"></div></div>' +
        '</div>' +

        '<div class="ums-panel" data-z="chungTu" hidden>' +
        '  <div class="ums-panel__head">' +
        '    <div class="ums-panel__title"><i class="fa-light fa-file-lines"></i> <span data-z="ctTitle">Chứng từ</span></div>' +
        '    <div class="ums-panel__tools" data-z="ctTools"></div></div>' +
        '  <div class="ums-panel__body" data-z="ctBody"></div>' +
        '</div>';

    function z(n) { return root.querySelector('[data-z="' + n + '"]'); }
    function f(n) { return root.querySelector('[data-f="' + n + '"]'); }
    function e(v) { return v === undefined || v === null ? '' : v; }
    function num(v) {
        var n = Number(String(v === null || v === undefined ? '' : v).replace(/[^\d.-]/g, ''));
        return isNaN(n) ? 0 : n;
    }
    function rowsOf(r) { var d = r.data; return Array.isArray(d) ? d : (d && d.rs) || []; }
    function money(n) { return ui.money(num(n)); }

    var SV_SIZE = 10;
    var st = {
        svRows: [], svPage: 1, svTotal: 0,
        sv: null,               // dòng người học đang chọn (dt_HS)
        nguoiHocId: '',         // QLSV_NGUOIHOC_ID
        thongTin: null,         // rsThongTin[0] (dt_DoiTuongThu sau khi nạp)
        taiChinh: null,         // Data của TC_ThongTinChung/LayDanhSach
        nutHDDT: [],
        khoanThu: [],
        chungTuId: '',
        tab: '1'
    };

    var TABS = {
        PhieuThu: { rs: 'rsKhoanDaNopChuaXuatPhieuThu', ten: 'phiếu thu', capGoc: false, rows: [] },
        BienLai:  { rs: 'rsKhoanDaNopChuaXuatBienLai',  ten: 'biên lai',  capGoc: false, rows: [] },
        HoaDon:   { rs: 'rsKhoanDaNopChuaXuatHoaDon',   ten: 'hoá đơn',   capGoc: true,  rows: [] }
    };

    /* =====================================================================
       Tìm người học
       ===================================================================== */
    var cas = ums.ref.cascade({
        he: f('he'), khoa: f('khoa'), ct: f('ct'), lop: f('lop'),
        labels: { he: 'Tất cả hệ đào tạo', khoa: 'Tất cả khoá đào tạo', ct: 'Tất cả chương trình đào tạo', lop: 'Tất cả lớp' }
    });
    [f('he'), f('khoa'), f('ct'), f('lop')].forEach(function (el) { ui.select2(el, { allowClear: true }); });

    function dmCu(ma) {
        return ums.api.call({ action: 'CM_DanhMucDuLieu/LayDanhSach', method: 'GET', silent: true, versionAPI: 'v1.0', strMaBangDanhMuc: ma })
            .then(rowsOf);
    }

    dmCu('QLSV.TRANGTHAI').then(function (rows) {
        z('trangThai').innerHTML =
            rows.map(function (r) {
                return '<label class="ums-check"><input type="checkbox" data-tt="' + ui.esc(r.ID) + '" checked> ' + ui.esc(r.TEN) + '</label>';
            }).join('');
    }).catch(function (err) { ums.api.handle(err, 'trạng thái sinh viên'); });

    dmCu('TAICHINH.NUTHDDT').then(function (rows) { st.nutHDDT = rows; })
        .catch(function (err) { ums.api.handle(err, 'nút hoá đơn điện tử'); });

    ums.api.call({
        action: 'TC_KhoanThu/LayDanhSach', method: 'GET', silent: true, versionAPI: 'v1.0',
        strTuKhoa: '', pageIndex: 1, pageSize: 10000, iTinhTrang: -1, strNhomCacKhoanThu_Id: '',
        strNguoiTao_Id: '', strCanBoQuanLy_Id: '', strNguoiThucHien_Id: ''
    }).then(function (r) { st.khoanThu = rowsOf(r); })
        .catch(function (err) { ums.api.handle(err, 'danh sách khoản thu'); });

    function trangThaiIds() {
        return Array.prototype.filter.call(z('trangThai').querySelectorAll('input[data-tt]'), function (x) {
            return x.checked && x.getAttribute('data-tt') !== 'all';
        }).map(function (x) { return x.getAttribute('data-tt'); }).toString();
    }

    function loadSV(page) {
        st.svPage = page || 1;
        var v = cas.values();
        z('svList').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({
            action: 'SV_NGUOIHOC_01_MH/DSA4BRIPJjQuKAkuIh4ALS0P',
            func: 'PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc_All',
            strTuKhoa: (f('tuKhoa').value || '').trim(),
            strNguoiThucHien_Id: '',
            strVaiTroDangNhap_Id: '',
            strChucNangHeThong_Id: '',
            strHanhDong_Code: '',
            strDaoTao_HeDaoTao_Id: v.he,
            strDaoTao_KhoaDaoTao_Id: v.khoa,
            strDaoTao_ChuongTrinh_Id: v.ct,
            strDaoTao_KhoaQuanLy_Id: '',
            strDaoTao_LopQuanLy_Id: v.lop,
            strStudyStatus_Ids: trangThaiIds(),
            dIsPrimary: '',
            dBoQuaPhamVi: 0,
            pageIndex: st.svPage,
            pageSize: SV_SIZE
        }).then(function (r) {
            st.svRows = rowsOf(r);
            st.svTotal = Number(r.pager) || st.svRows.length;
            drawSV();
            /* KHÔNG tự chọn khi còn một kết quả — gõ là tự tìm, có thể nhiều người trùng tên (người dùng 2026-09-26) */
        }).catch(function (err) {
            z('svList').innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'tìm người học');
        });
    }

    /* mục danh sách của ums.pat.master */
    function drawSV() {
        if (!st.svRows.length) { z('svList').innerHTML = ui.empty('Không tìm thấy người học', 'fa-user-magnifying-glass'); return; }
        z('svList').innerHTML = st.svRows.map(function (r) {
            /* Ảnh người (có ảnh thì ảnh, không thì biểu tượng) — người dùng 2026-09-26: màn có sinh viên phải có ảnh */
            return '<button type="button" class="ums-master__item ums-dsns__item' + (st.sv && st.sv.ID === r.ID ? ' is-active' : '') +
                '" data-sv="' + ui.esc(r.ID) + '">' + ums.pat.anhNguoi(r.ANH) +
                '<span class="ums-master__item__main"><b>' + ui.esc(e(r.HODEM) + ' ' + e(r.TEN)) + '</b>' +
                '<span class="ums-master__item__sub">' + ui.esc(e(r.MASO)) + ' · Lớp: ' + ui.esc(e(r.DAOTAO_LOPQUANLY_N1_TEN)) + '</span></span></button>';
        }).join('') + ui.pager({ index: st.svPage, size: SV_SIZE, total: st.svTotal }, st.svRows.length);
    }

    /* =====================================================================
       Chọn người học → tình hình tài chính
       ===================================================================== */
    var TRANGTHAI_TONE = {
        CHUYENTRUONGDI: 'bad', XOATEN: 'bad', NORMAL: 'info', CHUYENTRUONG: 'info', FORCEDROPOUT: 'info', RESERVE: 'info',
        KHONGXACDINH: 'warn', CANHBAO: 'warn', DROPOUT: 'warn', REPEATE: 'warn', DUNGHOC: 'warn', GRADUATE: 'ok'
    };

    function pickSV(id) {
        var r = st.svRows.filter(function (x) { return x.ID === id; })[0];
        if (!r) return;
        resetSV();
        st.sv = r;
        st.thongTin = r;
        st.nguoiHocId = r.QLSV_NGUOIHOC_ID;
        drawSV();
        var ten = (e(r.HODEM) + ' ' + e(r.TEN)).toUpperCase();
        ums.pat.datDau(z('svPanel'), {
            anh: e(r.ANH),
            ten: ten + (r.MASO ? ' - ' + r.MASO : '') + (r.TTLL_DIENTHOAICANHAN ? ' - ' + r.TTLL_DIENTHOAICANHAN : ''),
            nhan: e(r.QLSV_TRANGTHAINGUOIHOC_TEN) ? ui.badge(e(r.QLSV_TRANGTHAINGUOIHOC_TEN), TRANGTHAI_TONE[e(r.QLSV_TRANGTHAINGUOIHOC_MA)] || 'ok') : '',
            tools: ui.btn('close', { attr: { 'data-act': 'closeSV' } })
        });
        z('empty').hidden = true;
        showOnly('info');
        setTab('1');
        loadTaiChinh();
    }

    function resetSV() {
        st.sv = null; st.nguoiHocId = ''; st.taiChinh = null;
        Object.keys(TABS).forEach(function (k) { TABS[k].rows = []; });
        ums.pat.datNoCo(z('svPanel'), '');
        z('stats').innerHTML = '';
    }

    function showOnly(name) {
        ['info', 'tach', 'chungTu'].forEach(function (n) { z(n).hidden = n !== name; });
        root.querySelector('.ums-master').classList.toggle('is-wide', name === 'chungTu');
        if (name !== 'info') z('empty').hidden = true;
    }

    function loadTaiChinh() {
        return ums.api.call({
            action: 'TC_ThongTinChung/LayDanhSach',
            method: 'GET',
            versionAPI: 'v1.0',
            strQLSV_NguoiHoc_Id: st.nguoiHocId,
            strNguoiThucHien_Id: '',
            strNguonDuLieu_Id: ''
        }).then(function (r) {
            var d = r.data || {};
            st.taiChinh = d;
            st.thongTin = (d.rsThongTin || [])[0] || st.thongTin;
            Object.keys(TABS).forEach(function (k) { TABS[k].rows = (d[TABS[k].rs] || []).map(toRow); drawTab(k); });
            drawTong((d.rsThongTin || [])[0] || {});
            showDaChon();
        }).catch(function (err) { ums.api.handle(err, 'tình hình tài chính'); });
    }

    function toRow(d) {
        return {
            key: d.ID, daNopId: d.ID, khoanThuId: d.TAICHINH_CACKHOANTHU_ID, thoiGianId: d.DAOTAO_THOIGIANDAOTAO_ID,
            hocKy: e(d.DAOTAO_THOIGIANDAOTAO), dot: e(d.DAOTAO_THOIGIANDAOTAO_DOT), ten: e(d.TAICHINH_CACKHOANTHU_TEN),
            noiDung: e(d.NOIDUNG), soTien: num(d.SOTIEN), goc: num(d.SOTIEN), ngayTao: e(d.NGAYTAO_DD_MM_YYYY),
            htct: e(d.HETHONGCHUNGTU_MA), src: d, checked: false, split: false
        };
    }

    /* ---------- Tab 1: tổng các khoản ---------------------------------- */
    var STATS = [
        { key: 'TONGKHOANPHAINOP', label: 'Khoản phải nộp', icon: 'fa-sack-dollar', tone: 'green', act: 'LayDSKhoanPhaiNop', kind: 'khoan' },
        { key: 'TONGKHOANDUOCMIEN', label: 'Khoản được miễn', icon: 'fa-badge-dollar', tone: 'green', act: 'LayDSKhoanMien', kind: 'khoan', soTienTitle: 'Số tiền được miễn' },
        { key: 'TONGKHOANDANOP', label: 'Khoản đã nộp', icon: 'fa-circle-dollar', tone: 'green', act: 'LayDSKhoanDaNop', kind: 'khoan', soCT: true },
        { key: 'TONGKHOANDARUT', label: 'Khoản đã rút', icon: 'fa-money-from-bracket', tone: 'green', act: 'LayDSKhoanDaRut', kind: 'khoan' },
        { key: 'TONGNORIENG', label: 'Tổng nợ riêng các khoản', icon: 'fa-hand-holding-dollar', tone: 'red', act: 'LayDSKhoanNoRieng', kind: 'khoan', paged: true },
        { key: 'TONGNOCHUNG', label: 'Tổng nợ chung các khoản', icon: 'fa-hands-holding-dollar', tone: 'red', act: 'LayDSKhoanNoChung', kind: 'khoan', paged: true },
        { key: 'TONGDURIENG', label: 'Tổng dư riêng các khoản', icon: 'fa-square-dollar', tone: '', act: 'LayDSKhoanDuRieng', kind: 'khoan', paged: true },
        { key: 'TONGDUCHUNG', label: 'Tổng dư chung các khoản', icon: 'fa-circle-dollar-to-slot', tone: '', act: 'LayDSKhoanDuChung', kind: 'khoan', paged: true },
        { key: 'TONGTIENPHIEUTHU', label: 'Danh sách phiếu đã thu', icon: 'fa-file-invoice-dollar', tone: 'amber', act: 'LayDSPhieuDaThu', kind: 'phieu', so: 'SOPHIEUTHU', nguoi: 'TAIKHOAN_NGUOITHU', loai: 'BIENLAI', paged: true },
        { key: 'TONGTIENPHIEURUT', label: 'Danh sách phiếu đã rút', icon: 'fa-file-invoice', tone: 'amber', act: 'LayDSPhieuDaRut', kind: 'phieu', so: 'SOPHIEUTHU', nguoi: 'TAIKHOAN_NGUOIRUT', loai: 'BIENLAI', rut: true, paged: true },
        { key: 'TONGTIENHOADON', label: 'Danh sách phiếu hoá đơn', icon: 'fa-receipt', tone: 'amber', act: 'LayDSPhieuHoaDon', kind: 'phieu', so: 'SOHOADON', nguoi: 'TAIKHOAN_NGUOITHU', loai: 'HOADON', paged: true }
    ];

    function drawTong(d) {
        /* viên chung "Tổng nợ / Tổng dư / Đã hoàn thành" trên tiêu đề (ums.pat.noCo) */
        ums.pat.datNoCo(z('svPanel'), d.NOCO, 'Chưa xác định');
        z('stats').innerHTML = STATS.map(function (s, i) {
            return '<div class="ums-stat' + (s.tone ? ' ums-stat--' + s.tone : '') + '" data-stat="' + i + '" title="Xem chi tiết">' +
                '<div class="ums-stat__icon"><i class="fa-light ' + s.icon + '"></i></div>' +
                '<div><div class="ums-stat__value">' + money(d[s.key]) + '</div>' +
                '<div class="ums-stat__label">' + ui.esc(s.label) + '</div></div></div>';
        }).join('');
    }

    function removeNoiDungDai(s, soTien) {
        s = e(s);
        if (!s) return '';
        if (s.indexOf('VIETINBANK') >= 0 && s.indexOf('DTC') >= 0) {     // riêng CNTT Thái Nguyên, như bản gốc
            s = s.replace('VIETIN', '');
            s = s.substring(0, s.indexOf('$'));
            if (s.indexOf(String(soTien)) >= 0) s = s.replace(String(soTien), '');
            return s + '...';
        }
        return s;
    }

    /* Thẻ số liệu mở HỘP THOẠI (người dùng 2026-09-26: không đổ bảng xuống dưới) */
    function openStat(s) {
        var dlg = ui.dialog({ title: s.label, icon: 'fa-list-ul', size: 'xl', body: ui.empty('Đang tải…', 'fa-spinner fa-spin') });
        dlg.body.addEventListener('click', function (ev) {
            var vw = ev.target.closest('[data-view]');
            if (vw) { dlg.close(); viewPhieu(vw.getAttribute('data-view'), vw.getAttribute('data-loai')); }
        });
        var call = {
            action: 'TC_ThongTinChung/' + s.act,
            method: 'GET',
            versionAPI: 'v1.0',
            strQLSV_NguoiHoc_Id: st.nguoiHocId,
            strNguoiThucHien_Id: ''
        };
        if (s.paged) { call.pageIndex = 1; call.pageSize = 1000000000; }
        ums.api.call(call).then(function (r) {
            var rows = rowsOf(r);
            var cols;
            if (s.kind === 'khoan') {
                cols = [
                    { title: 'Học kỳ', prop: 'DAOTAO_THOIGIANDAOTAO', cls: 'is-center is-nowrap' },
                    { title: 'Đợt', prop: 'DAOTAO_THOIGIANDAOTAO_DOT', cls: 'is-center' },
                    { title: 'Loại khoản', prop: 'TAICHINH_CACKHOANTHU_TEN' },
                    { title: 'Nội dung', render: function (x) { return '<span title="' + ui.esc(x.NOIDUNG) + '">' + ui.esc(removeNoiDungDai(x.NOIDUNG, x.SOTIEN)) + '</span>'; } },
                    { title: s.soTienTitle || 'Số tiền', cls: 'is-right is-nowrap', prop: 'SOTIEN', render: function (x) { return money(x.SOTIEN); }, sum: true }
                ];
                if (s.soCT) cols.push({ title: 'Số chứng từ', prop: 'CHUNGTU_SO', cls: 'is-center' });
                cols.push({ title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap' });
                cols.push({ title: 'Người tạo', prop: 'NGUOITAO_TENDAYDU', cls: 'is-center' });
            } else {
                cols = [
                    { title: 'Số phiếu', prop: s.so, cls: 'is-center' },
                    { title: 'Tổng tiền', cls: 'is-right is-nowrap', prop: 'TONGTIEN', render: function (x) { return money(x.TONGTIEN); }, sum: true },
                    { title: 'Ngày thu', prop: 'NGAYTHU_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' },
                    { title: 'Người thu', prop: s.nguoi, cls: 'is-center' },
                    { title: 'Chi tiết', cls: 'is-actions', render: function (x) {
                        return '<button type="button" class="ums-iconbtn ums-iconbtn--view" data-view="' + ui.esc(x.ID) + '" data-loai="' + s.loai + '" title="Xem chứng từ">' +
                            '<i class="fa-light fa-eye"></i></button>';
                    } }
                ];
            }
            if (!dlg.closed) ui.table({ el: dlg.body, rows: rows, columns: cols });
        }).catch(function (err) {
            if (!dlg.closed) dlg.body.innerHTML = ui.fail(err.message);
            ums.api.handle(err, s.label);
        });
    }

    /* ---------- Tab 2–4: khoản đã nộp chưa xuất chứng từ ---------------- */
    function setTab(k) {
        st.tab = k;
        Array.prototype.forEach.call(z('tabs').querySelectorAll('[data-tab]'), function (a) {
            a.classList.toggle('is-active', a.getAttribute('data-tab') === k);
        });
        Array.prototype.forEach.call(root.querySelectorAll('[data-pane]'), function (p) {
            p.hidden = p.getAttribute('data-pane') !== k;
        });
        showDaChon();
    }

    function drawTab(k) {
        var t = TABS[k];
        var pane = root.querySelector('[data-pane="' + k + '"]');
        /* Thanh thao tác CHUNG (ums.pat.thanhThu): số khoản chờ xuất · "Tổng tiền đã chọn" + nút Xuất */
        pane.innerHTML = ums.pat.thanhThu({
            tongLbl: 'Khoản đã nộp chưa xuất ' + t.ten, tong: t.rows.length,
            nut: ui.btn('save', { text: 'Xuất ' + t.ten, attr: { 'data-act': 'viet', 'data-k': k } })
        }) + '<div data-tbl="' + k + '"></div>';
        ui.table({
            el: pane.querySelector('[data-tbl="' + k + '"]'),
            rows: t.rows,
            empty: 'Không có khoản nào chờ xuất ' + t.ten,
            columns: [
                { title: 'Học kỳ', prop: 'hocKy', cls: 'is-center is-nowrap' },
                { title: 'Đợt', prop: 'dot', cls: 'is-center', width: '50px' },
                { title: 'Khoản thu', prop: 'ten' },
                { title: 'Nội dung', render: function (r, i) {
                    return '<input class="ct-in" data-nd="' + i + '" data-k="' + k + '" value="' + ui.esc(r.noiDung) + '">';
                } },
                { title: 'Số tiền', cls: 'is-right', width: '160px', render: function (r, i) {
                    return '<input class="ct-in ct-in--money" inputmode="decimal" data-st="' + i + '" data-k="' + k + '" value="' + ui.esc(fmt(r.soTien)) + '">';
                }, sum: function (rows) { return '<b class="ct-sum">' + ui.money(rows.reduce(function (a, r) { return a + num(r.soTien); }, 0)) + '</b>'; } },
                { title: 'Ngày tạo', prop: 'ngayTao', cls: 'is-center is-nowrap' },
                { title: 'Tách khoản', cls: 'is-center', render: function (r, i) {
                    return r.split ? '<span class="ums-u-faint ums-u-fz12">Tách từ khoản gốc</span>' :
                        '<button type="button" class="ums-btn ums-btn--quiet ums-btn--sm" data-act="tach" data-i="' + i + '" data-k="' + k + '">' +
                        '<i class="fa-light fa-money-check-dollar-pen"></i><span>Tách khoản</span></button>';
                } },
                { head: '<input type="checkbox" data-all="' + k + '" title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (r, i) {
                    return '<input type="checkbox" data-pick="' + i + '" data-k="' + k + '"' + (r.checked ? ' checked' : '') + '>';
                } }
            ]
        });
        syncPicks(k);
    }

    function fmt(n) { return ums.pat.money(n); }    // = edu.util.formatCurrency (tầng chung)

    function syncPicks(k) {
        var pane = root.querySelector('[data-pane="' + k + '"]');
        Array.prototype.forEach.call(pane.querySelectorAll('[data-pick]'), function (b) {
            var tr = b.closest('tr');
            if (tr) tr.classList.toggle('is-selected', b.checked);
        });
        var all = pane.querySelector('[data-all]');
        if (all) all.checked = TABS[k].rows.length > 0 && TABS[k].rows.every(function (r) { return r.checked; });
    }

    function showDaChon() {
        var t = TABS[st.tab];
        if (!t) return;
        var sum = t.rows.reduce(function (a, r) { return a + (r.checked ? num(r.soTien) : 0); }, 0);
        ums.pat.datDaChon(root.querySelector('[data-pane="' + st.tab + '"]'), sum);
    }

    /* Ô số tiền — edu.system.checkSoTienInput: chỉ nhận số; bảng hoá đơn không
       cho vượt số tiền gốc */
    function onMoney(el) {
        var k = el.getAttribute('data-k');
        var t = TABS[k];
        var r = t.rows[Number(el.getAttribute('data-st'))];
        var raw = el.value;
        if (/[.,]$/.test(raw)) return;
        var x = raw.replace(/,/g, '');
        if (x !== '' && isNaN(Number(x))) { el.value = fmt(r.soTien); return; }
        if (t.capGoc && Number(x) > r.goc) { el.value = fmt(r.soTien); ui.toast('Không được vượt số tiền gốc ' + ui.money(r.goc), 'warn'); return; }
        r.soTien = x === '' ? 0 : Number(x);
        el.value = x === '' ? '' : fmt(x);
        var foot = el.closest('table').querySelector('tfoot .ct-sum');
        if (foot) foot.textContent = ui.money(t.rows.reduce(function (a, y) { return a + num(y.soTien); }, 0));
        showDaChon();
    }

    /* =====================================================================
       Tách khoản
       ===================================================================== */
    var tach = null;   // { k, goc, them: [{ id, ten, noiDung, soTien }] }

    function openTach(k, i) {
        var goc = TABS[k].rows[i];
        tach = { k: k, goc: goc, them: [] };
        z('tachKhoan').innerHTML = st.khoanThu.map(function (x) {
            return '<label class="ums-check"><input type="checkbox" data-lkt="' + ui.esc(x.ID) + '"> ' + ui.esc(x.TEN) + '</label>';
        }).join('') || ui.empty('Không có khoản thu');
        drawTach();
        showOnly('tach');
    }

    function tachSau() {
        return tach.goc.soTien - tach.them.reduce(function (a, x) { return a + num(x.soTien); }, 0);
    }

    function drawTach() {
        var g = tach.goc;
        var rows = [{ goc: true }].concat(tach.them);
        ui.table({
            el: z('tachTable'),
            rows: rows,
            columns: [
                { title: 'Học kỳ', cls: 'is-center is-nowrap', render: function () { return ui.esc(g.hocKy); } },
                { title: 'Đợt', cls: 'is-center', render: function () { return ui.esc(g.dot); } },
                { title: 'Khoản thu', render: function (r) { return ui.esc(r.goc ? g.ten : r.ten); } },
                { title: 'Nội dung', render: function (r, i) {
                    return r.goc ? ui.esc(g.noiDung) : '<input class="ct-in" data-tnd="' + (i - 1) + '" value="' + ui.esc(r.noiDung) + '">';
                } },
                { title: 'Số tiền trước', cls: 'is-right', render: function (r) { return r.goc ? ui.money(g.soTien) : '0'; } },
                { title: 'Số tiền sau', cls: 'is-right', width: '170px', render: function (r, i) {
                    return r.goc ? '<b data-z="tachSau">' + ui.money(tachSau()) + '</b>'
                        : '<input class="ct-in ct-in--money" data-tst="' + (i - 1) + '" value="' + ui.esc(fmt(r.soTien)) + '">';
                } },
                { title: 'Xoá', cls: 'is-center', render: function (r, i) {
                    return r.goc ? 'Gốc' : '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-act="tachDel" data-i="' + (i - 1) + '" title="Xoá"><i class="fa-light fa-trash-can"></i></button>';
                } }
            ]
        });
    }

    function doTach() {
        var t = TABS[tach.k];
        if (tachSau() < 0) ui.toast('Khoản thu vượt quá định mức', 'warn');   // bản gốc vẫn tách tiếp
        var g = tach.goc;
        g.soTien = tachSau();
        var at = t.rows.indexOf(g);
        var seen = {};
        var add = [];
        tach.them.forEach(function (x) {
            if (!x.id || seen[x.id]) return;
            seen[x.id] = true;
            if (num(x.soTien) === 0) return;
            add.push({
                key: g.daNopId + '_' + x.id, daNopId: g.daNopId, khoanThuId: x.id, thoiGianId: g.thoiGianId,
                hocKy: g.hocKy, dot: g.dot, ten: x.ten, noiDung: x.noiDung, soTien: num(x.soTien), goc: num(x.soTien),
                ngayTao: '', htct: g.htct, src: g.src, checked: true, split: true
            });
        });
        Array.prototype.splice.apply(t.rows, [at + 1, 0].concat(add));
        drawTab(tach.k);
        tach = null;
        showOnly('info');
        showDaChon();
    }

    /* =====================================================================
       Viết chứng từ (genHTML_NoiDung_ChungTu + save_ChungTu)
       ===================================================================== */
    var viet = null;   // { k, rows, htthu }

    function openViet(k) {
        var t = TABS[k];
        var picked = t.rows.filter(function (r) { return r.checked; });
        if (!picked.length) { ui.toast('Vui lòng chọn khoản thu', 'warn'); return; }
        var ma = picked[0].htct;
        var khac = picked.filter(function (r) { return r.htct !== ma; })[0];
        if (khac) { ui.toast('Mã hệ thống chứng từ khác nhau. Vui lòng kiểm tra lại! ("' + ma + '" : "' + khac.htct + '")', 'warn'); return; }

        var rows = picked.filter(function (r) { return num(r.soTien) !== 0; });
        var tong = rows.reduce(function (a, r) { return a + num(r.soTien); }, 0);
        if (!rows.length || tong === 0) return;

        // Thông tin hình thức thu / loại tiền / đơn vị tính lấy từ dòng dữ liệu đầu tiên
        var src = picked[0].src || {};
        viet = {
            k: k, rows: rows, tong: tong,
            hinhThucThuMa: e(src.HINHTHUCTHU_MA), hinhThucThuTen: e(src.HINHTHUCTHU_TEN),
            loaiTienTeMa: e(src.LOAITIENTE_MA), donViTinhTen: e(src.DONVITINH_TEN)
        };
        st.chungTuId = '';
        z('ctTitle').textContent = 'Xuất ' + t.ten;
        delete z('ctBody').__phieu;      // rời khung xem của tầng chung, quay về bản xem trước
        z('ctBody').innerHTML = paper(k === 'HoaDon' ? 'Hoá đơn bán hàng' : (k === 'PhieuThu' ? 'Phiếu thu tiền' : 'Biên lai thu tiền'),
            st.thongTin || {}, rows.map(function (r) { return { ten: r.ten, noiDung: r.noiDung, soTien: r.soTien }; }), k !== 'HoaDon');
        drawTools('viet');
        showOnly('chungTu');

        if (k !== 'HoaDon') {
            ums.api.dm('QLTC.HTTHU').then(function (list) {
                var sel = z('ctBody').querySelector('[data-f="htthu"]');
                if (!sel) return;
                sel.innerHTML = list.map(function (x) { return '<option value="' + ui.esc(x.ID) + '">' + ui.esc(x.TEN) + '</option>'; }).join('');
                var tm = list.filter(function (x) { return x.MA === 'TM'; })[0];      // mặc định tiền mặt, như bản gốc
                if (tm) sel.value = tm.ID;
            }).catch(function (err) { ums.api.handle(err, 'hình thức thu'); });
        }
    }

    /** Tham số lưu — đúng các chuỗi nối của save_ChungTu bản gốc */
    function packRows() {
        var rows = viet.rows;
        return {
            ids: rows.map(function (r) { return r.daNopId; }).join(','),
            khoanThuIds: rows.map(function (r) { return r.khoanThuId; }).join(','),
            thoiGianIds: rows.map(function (r) { return r.thoiGianId; }).join(','),
            noiDungs: rows.map(function (r) { return r.noiDung; }).join('#'),
            soLuong: rows.map(function () { return 1; }).join(','),
            donGia: rows.map(function (r) { return num(r.soTien); }).join(','),
            soTien: rows.map(function (r) { return num(r.soTien); }).join(','),
            dvt: rows.map(function () { return viet.donViTinhTen; }).toString()
        };
    }

    /* VAT của hoá đơn (bản gốc thêm 2026-09-22, ba hàm save_HoaDon / saveHDDT / saveHDDT_Nhap):
       strTaiChinh_SoTien_TruocThue_s = SOTIENTRUOCVAT từng dòng (dòng tách giữ số của dòng gốc,
       như bản gốc tìm theo ID đã nộp), strVat = VAT chung. Bản gốc định chặn khi VAT khác nhau
       nhưng strVAT không bao giờ được gán → luôn gửi rỗng, và báo lỗi mỗi dòng có VAT mà VẪN lưu.
       Ở đây làm theo ý định: VAT dòng đầu, khác nhau thì báo và DỪNG. Trả null nếu phải dừng. */
    function vatRows() {
        var rows = viet.rows;
        var vat = (rows[0].src || {}).VAT;
        var khac = rows.some(function (r) { return String((r.src || {}).VAT) !== String(vat); });
        if (khac) { ui.toast('Không xuất được các khoản có VAT khác nhau', 'warn'); return null; }
        return {
            vat: vat === undefined || vat === null ? '' : vat,
            truocThue: rows.map(function (r) { return (r.src || {}).SOTIENTRUOCVAT; }).toString()
        };
    }

    function htthuId() {
        var sel = z('ctBody').querySelector('[data-f="htthu"]');
        return sel ? sel.value : '';
    }

    function saveChungTu() {
        var k = viet.k;
        var p = packRows();
        var call;
        if (k === 'HoaDon') {
            var v = vatRows();
            if (!v) return;
            call = {
                action: 'TC_DaNop_HoaDon/ThemMoi', versionAPI: 'v1.0', strNguoiThucHien_Id: '',
                strTaiChinh_DaNop_Ids: p.ids, strTAICHINH_CACKHOANTHU_Ids: p.khoanThuIds,
                strTaiChinh_SoTien_s: p.soTien, strTaiChinh_NoiDung_s: p.noiDungs,
                strTaiChinh_SoTien_TruocThue_s: v.truocThue, strVat: v.vat,
                strDonGia_s: p.donGia, strSoLuong_s: p.soLuong, strDonViTinhTen_s: p.dvt,
                strLoaiTienTe: viet.loaiTienTeMa, strQLSV_NguoiHoc_Id: st.nguoiHocId,
                strDaoTao_ThoiGianDaoTao_Id: p.thoiGianIds, strDaoTao_ToChucCT_Id: '', strHinhThucThu_Id: htthuId()
            };
        } else {
            call = {
                action: 'TC_DaNop_PhieuThu/ThemMoi', versionAPI: 'v1.0', strNguoiThucHien_Id: '',
                strTaiChinh_DaNop_Ids: p.ids, strTAICHINH_CACKHOANTHU_Ids: p.khoanThuIds,
                strTaiChinh_SoTien_s: p.soTien, strTaiChinh_NoiDung_s: p.noiDungs,
                strQLSV_NguoiHoc_Id: st.nguoiHocId, strDaoTao_ThoiGianDaoTao_Id: p.thoiGianIds,
                strDaoTao_ToChucCT_Id: '', strHinhThucThu_Id: htthuId()
            };
        }
        ui.confirm('Bạn có chắc chắn muốn lưu chứng từ không!', { title: 'Xuất chứng từ', ok: 'Lưu' }).then(function (yes) {
            if (!yes) return;
            ums.api.call(call).then(function (r) {
                var id = r.raw && r.raw.Id;
                ui.toast(k === 'HoaDon' ? 'Xuất hoá đơn thành công' : 'Thực hiện thu tiền thành công', 'ok');
                savedOk();
                viewPhieu(id, k === 'HoaDon' ? 'HOADON' : 'BIENLAI');
            }).catch(function (err) { ums.api.handle(err, 'lưu chứng từ'); });
        });
    }

    function xuatHDDT(nut) {
        if (nut.THONGTIN4) ums.session.api.HDDT = nut.THONGTIN4;   // như bản gốc: đổi base URL tiền tố HDDT
        var ma = e(nut.MA);
        var p = packRows();
        var v = vatRows();
        if (!v) return;
        var call = {
            strNguoiThucHien_Id: '',
            strTaiChinh_CacKhoanThu_Ids: p.ids,
            strQLSV_NguoiHoc_Id: st.nguoiHocId,
            strDaoTao_ThoiGianDaoTao_Id: p.thoiGianIds,
            strHinhThucThu_MA: viet.hinhThucThuMa,
            strHinhThucThu_TEN: viet.hinhThucThuTen,
            strTaiChinh_SoTien_s: p.soTien,
            strTaiChinh_SoTien_TruocThue_s: v.truocThue,
            strVat: v.vat,
            strTaiChinh_NoiDung_s: p.noiDungs,
            strDonGia_s: p.donGia,
            strSoLuong_s: p.soLuong,
            strDonViTinhTen_s: p.dvt,
            strLoaiTienTe: viet.loaiTienTeMa,
            strPhuongThuc_MA: ma,
            strDaoTao_ToChucCT_Id: e(st.sv && st.sv.DAOTAO_TOCHUCCHUONGTRINH_ID)
        };
        if (ma.indexOf('HDDTNHAP') === 0) {
            call.action = 'HDDT_HoaDon/ThemMoi_Nhap';
            ums.api.call(call).then(function (r) {
                var link = e(r.data);
                if (link.indexOf('http') === -1) {
                    var base = e(ums.session.api.HDDT);
                    link = base.substring(0, base.length - 3) + link;
                    if (link.indexOf('http') === -1) link = e(ums.session.apiUrlTemp) + link;
                }
                var w = window.open(link, '_blank');
                if (w) w.focus(); else ui.toast('Vui lòng cho phép mở tab mới trên trình duyệt và thử lại!', 'warn');
            }).catch(function (err) { ums.api.handle(err, 'hoá đơn điện tử nháp'); });
            return;
        }
        ui.confirm('Bạn có chắc chắn muốn xuất hóa đơn điện tử không!', { title: 'Hoá đơn điện tử', ok: 'Xuất' }).then(function (yes) {
            if (!yes) return;
            call.action = 'HDDT_HoaDon/ThemMoi';
            ums.api.call(call).then(function (r) {
                var id = r.raw && r.raw.Id;
                ui.toast('Sinh hóa đơn thành công', 'ok');
                savedOk();
                viewPhieu(id, 'HOADON');
            }).catch(function (err) {
                ums.api.handle(err, 'hoá đơn điện tử');
                closeChungTu();
            });
        });
    }

    function savedOk() {
        viet = null;
        loadTaiChinh();
    }

    /* =====================================================================
       Xem chứng từ đã lưu (getData_Phieu) — mẫu chung, xem ghi chú đầu tệp
       ===================================================================== */
    /* Xem chứng từ ĐÃ LƯU: đi qua ums.phieu.viewer (tầng chung) — đổ dữ
       liệu vào phôi in của trường, không nạp được phôi thì tầng chung vẽ bản
       rút gọn. paper() bên dưới chỉ còn dùng cho bản XEM TRƯỚC (chứng từ
       chưa lưu nên chưa có id để lấy phôi). */
    function viewPhieu(id, loai) {
        st.chungTuId = id || '';
        z('ctTitle').textContent = loai === 'HOADON' ? 'Hoá đơn' : 'Chứng từ';
        drawTools('xem');
        showOnly('chungTu');
        var host = z('ctBody');
        host.innerHTML = '';
        delete host.__phieu;
        host.__phieu = ums.phieu.viewer(host);
        host.__phieu.show({ id: id, loai: loai === 'HOADON' ? 'HOADON' : 'BIENLAI' });
    }

    function paper(title, dt, items, htthu, meta) {
        var d = new Date();
        var ngay = meta && meta.ngay ? 'Ngày ' + ui.esc(meta.ngay)
            : 'Ngày ' + d.getDate() + ' tháng ' + (d.getMonth() + 1) + ' năm ' + d.getFullYear();
        var tong = items.reduce(function (a, x) { return a + num(x.soTien); }, 0);
        function kv(k, v) { return '<div>' + k + ': <b>' + ui.esc(e(v)) + '</b></div>'; }
        return '<div class="ct-paper" data-z="paper">' +
            '<h2>' + ui.esc(title) + '</h2>' +
            '<div class="ct-date">' + ngay + (meta && meta.so ? ' — Số: ' + ui.esc(meta.so) : '') + '</div>' +
            '<div class="ct-kv">' +
                kv('Họ tên', e(dt.HODEM) + ' ' + e(dt.TEN)) + kv('Mã số', dt.MASO) +
                kv('Ngày sinh', dt.NGAYSINH) + kv('Mã số thuế', dt.MASOTHUECANHAN) +
                kv('Lớp', dt.DAOTAO_LOPQUANLY_N1_TEN) + kv('Ngành', dt.NGANHHOC_N1_TEN) +
                kv('Khoá', dt.KHOAHOC_N1_TEN) + kv('Địa chỉ', dt.NOIOHIENNAY) +
            '</div>' +
            (htthu ? '<div class="ums-u-mt-2">Hình thức thu: <select data-f="htthu"><option value="">…</option></select></div>' : '') +
            '<table class="ct-hh"><thead><tr><th>Stt</th><th>Khoản thu</th><th>Nội dung</th><th>Số lượng</th><th>Đơn giá</th><th>Thành tiền</th></tr></thead><tbody>' +
            items.map(function (x, i) {
                return '<tr><td class="ums-u-center">' + (i + 1) + '</td><td>' + ui.esc(x.ten) + '</td><td>' + ui.esc(x.noiDung) + '</td>' +
                    '<td class="ums-u-center">1</td><td class="ct-r">' + ui.money(num(x.soTien)) + '</td><td class="ct-r">' + ui.money(num(x.soTien)) + '</td></tr>';
            }).join('') +
            '</tbody><tfoot><tr><td colspan="5" class="ct-r"><b>Tổng</b></td><td class="ct-r"><b>' + ui.money(tong) + '</b></td></tr></tfoot></table>' +
            '<div>Số tiền bằng chữ: <b>' + ui.esc(docSo(tong)) + '</b></div>' +
            (meta && meta.nguoi ? '<div>Người lập: ' + ui.esc(meta.nguoi) + '</div>' : '') +
            '<div class="ct-sign"><div>Người nộp tiền</div><div>Người thu tiền</div></div>' +
            '</div>';
    }

    function drawTools(mode) {
        var h = '';
        if (mode === 'viet') {
            if (viet && viet.k === 'HoaDon') {
                h += st.nutHDDT.map(function (n, i) {
                    return '<button type="button" class="ums-btn ums-btn--navy" data-act="hddt" data-i="' + i + '" title="' + ui.esc(n.TEN) + '">' +
                        '<i class="fa-light fa-file-invoice"></i><span>' + ui.esc(n.TEN) + '</span></button>';
                }).join('');
            }
            h += ui.btn('save', { text: 'Xuất ' + TABS[viet.k].ten, attr: { 'data-act': 'saveCT' } });
        } else {
            h += '<button type="button" class="ums-btn ums-btn--danger" data-act="huy"' + (st.chungTuId ? '' : ' disabled') + '><i class="fa-light fa-trash-can"></i><span>Huỷ chứng từ</span></button>';
            h += ui.btn('print', { text: 'In chứng từ', mod: 'primary', attr: { 'data-act': 'print' } });
        }
        h += ui.btn('close', { attr: { 'data-act': 'closeCT' } });
        z('ctTools').innerHTML = h;
    }

    function huyChungTu() {
        ui.confirm('Bạn có chắc chắn muốn hủy chứng từ không!', { tone: 'bad', ok: 'Huỷ chứng từ', title: 'Huỷ chứng từ' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({
                action: 'TC_SoBienLai/HuyBienLai', versionAPI: 'v1.0',
                strBienLai_Id: st.chungTuId, strNguoiThucHien_Id: ''
            }).then(function () {
                ui.toast('Xóa biên lai thành công!', 'ok');
                loadTaiChinh();
                closeChungTu();
            }).catch(function (err) { ums.api.handle(err, 'huỷ chứng từ'); });
        });
    }

    function closeChungTu() {
        viet = null;
        showOnly(st.sv ? 'info' : 'none');
        if (!st.sv) z('empty').hidden = false;
    }

    /* Đọc số thành chữ — tầng chung ums.ui.docSo (thư viện n2vi ở
       assets/vendor/n2vi, đúng thư viện bản gốc dùng) */
    function docSo(n) { return ui.docSo(num(n)); }

    /* =====================================================================
       Sự kiện — gắn trên phần tử gốc của màn
       ===================================================================== */
    root.addEventListener('click', function (ev) {
        var t = ev.target;
        var sv = t.closest('[data-sv]');
        if (sv) { if (!st.sv || st.sv.ID !== sv.getAttribute('data-sv')) pickSV(sv.getAttribute('data-sv')); return; }
        var go = t.closest('.ums-pager__btn[data-go]');
        if (go && z('svList').contains(go)) {
            var p = Number(go.getAttribute('data-go'));
            if (p >= 1 && p <= Math.ceil(st.svTotal / SV_SIZE)) loadSV(p);
            return;
        }
        var tab = t.closest('[data-tab]');
        if (tab) { setTab(tab.getAttribute('data-tab')); return; }
        var stat = t.closest('[data-stat]');
        if (stat) { openStat(STATS[Number(stat.getAttribute('data-stat'))]); return; }
        var vw = t.closest('[data-view]');
        if (vw) { viewPhieu(vw.getAttribute('data-view'), vw.getAttribute('data-loai')); return; }

        if (t.matches('[data-tt="all"]')) {
            Array.prototype.forEach.call(z('trangThai').querySelectorAll('input[data-tt]'), function (x) { x.checked = t.checked; });
            return;
        }
        if (t.matches('[data-pick]')) {
            var k = t.getAttribute('data-k');
            TABS[k].rows[Number(t.getAttribute('data-pick'))].checked = t.checked;
            syncPicks(k); showDaChon();
            return;
        }
        if (t.matches('[data-all]')) {
            var ka = t.getAttribute('data-all');
            TABS[ka].rows.forEach(function (r) { r.checked = t.checked; });
            Array.prototype.forEach.call(root.querySelectorAll('[data-pick][data-k="' + ka + '"]'), function (x) { x.checked = t.checked; });
            syncPicks(ka); showDaChon();
            return;
        }
        if (t.matches('[data-lkt]') && tach) {
            var id = t.getAttribute('data-lkt');
            if (t.checked) {
                var kt = st.khoanThu.filter(function (x) { return x.ID === id; })[0] || {};
                tach.them.push({ id: id, ten: e(kt.TEN), noiDung: '', soTien: 0 });
            } else {
                tach.them = tach.them.filter(function (x) { return x.id !== id; });
            }
            drawTach();
            return;
        }

        var b = t.closest('[data-act]');
        if (!b || !root.contains(b)) return;
        var act = b.getAttribute('data-act');
        if (act === 'search') loadSV(1);
        else if (act === 'adv') { z('adv').hidden = !z('adv').hidden; }
        else if (act === 'closeSV') { resetSV(); drawSV(); showOnly('none'); z('info').hidden = true; z('empty').hidden = false; }
        else if (act === 'tach') openTach(b.getAttribute('data-k'), Number(b.getAttribute('data-i')));
        else if (act === 'tachDel') {
            var rm = tach.them.splice(Number(b.getAttribute('data-i')), 1)[0];
            var cb = rm && z('tachKhoan').querySelector('[data-lkt="' + rm.id + '"]');
            if (cb) cb.checked = false;
            drawTach();
        }
        else if (act === 'closeTach') { tach = null; showOnly('info'); }
        else if (act === 'doTach') doTach();
        else if (act === 'viet') openViet(b.getAttribute('data-k'));
        else if (act === 'saveCT') saveChungTu();
        else if (act === 'hddt') xuatHDDT(st.nutHDDT[Number(b.getAttribute('data-i'))]);
        else if (act === 'huy') huyChungTu();
        else if (act === 'print') {
            // chứng từ đã lưu nằm trong khung xem của tầng chung; bản xem trước vẫn là .ct-paper
            var body = z('ctBody');
            if (body.__phieu) body.__phieu.print('In chứng từ');
            else { var pp = body.querySelector('[data-z="paper"]'); if (pp) ui.print(pp.outerHTML, { title: 'In chứng từ', cssHref: CSS_IN_HREF }); }
            closeChungTu();
        }
        else if (act === 'closeCT') closeChungTu();
    });

    /* Kiểu CHỈ cho cửa sổ in: chungtu/css/chungtu.in.css */
    var CSS_IN_HREF = 'ApisTaiChinh/Modules/chungtu/css/chungtu.in.css';

    root.addEventListener('input', function (ev) {
        var t = ev.target;
        if (t.matches('[data-nd]')) TABS[t.getAttribute('data-k')].rows[Number(t.getAttribute('data-nd'))].noiDung = t.value;
        else if (t.matches('[data-st]')) onMoney(t);
        else if (t.matches('[data-tnd]') && tach) tach.them[Number(t.getAttribute('data-tnd'))].noiDung = t.value;
        else if (t.matches('[data-tst]') && tach) {
            var x = t.value.replace(/,/g, '');
            if (/[.,]$/.test(t.value)) return;
            if (x !== '' && isNaN(Number(x))) { t.value = fmt(tach.them[Number(t.getAttribute('data-tst'))].soTien); return; }
            tach.them[Number(t.getAttribute('data-tst'))].soTien = x === '' ? 0 : Number(x);
            t.value = x === '' ? '' : fmt(x);
            var sau = root.querySelector('[data-z="tachSau"]');
            if (sau) sau.textContent = ui.money(tachSau());
        }
    });

    /* Cùng khuôn cột trái (BO-CUC luật 12, người dùng 2026-09-26): gõ là tự tìm sau 400ms (Enter tìm ngay),
       đổi ô chọn / trạng thái là tự tải — không còn nút Tìm kiếm; nút trên tiêu đề là Tải lại. */
    var henTim = 0;
    function timSau(ms) { clearTimeout(henTim); henTim = setTimeout(function () { loadSV(1); }, ms); }
    f('tuKhoa').addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter') { ev.preventDefault(); clearTimeout(henTim); loadSV(1); }
    });
    f('tuKhoa').addEventListener('input', function () { timSau(400); });
    z('adv').addEventListener('change', function () { timSau(300); });

    showOnly('none');
    z('empty').hidden = false;
    cas.ready.then(function () { loadSV(1); });
})();
