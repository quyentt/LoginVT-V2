/* =========================================================================
   _hocphi — khung dùng chung của hai màn Tình hình học phí / Xuất hoá đơn
   (Cổng sinh viên, vai trò thủ vai: ums.session.userId = ID người học)
   Bản gốc: ApisCongSinhVien/Modules/tinhhinhhocphi/script/tinhhinhhocphi.js
   (lớp TinhHinhHocPhi) — MỘT tệp .js nạp cho CẢ HAI tệp html
   html/tinhhinhhocphi.html và html/xuathoadon.html. Hai html chỉ khác BỐ CỤC:
     · tinhhinhhocphi: lưới thẻ số liệu đầy trang + nút "Hướng dẫn" + dòng Lớp
       ở khối thông tin; bảng "Khoản đã nộp chưa xuất hóa đơn" nằm trong hộp thoại
       (mở từ thẻ #zoneChuaXuatHoaDon — thẻ này bị ẩn cứng, xem báo cáo);
     · xuathoadon: hai tab — "Xuất hóa đơn" (bảng khoản chưa xuất + nút xuất HĐĐT)
       và "Thông tin tài chính" (chính lưới thẻ đó); không có nút Hướng dẫn, không
       có dòng Lớp.
   Nên phần mã chung nằm ở tệp này, mỗi màn chỉ còn phần ghép bố cục.

   Lời gọi (chép nguyên action / func / tham số / tên cột):
     SV_Custom/…            pkg_hosohocvien.LayThongTinChiTietHoSo      thông tin người học
     TC_ThongTin_MH/…       pkg_taichinh_thongtin.LayDSTinhTrangTaiChinh
                              → rsThongTin[0] (các con số) + rsKhoanDaNopChuaXuatHoaDon
                            LayDSKhoanPhaiNop · LayDSKhoanMien · LayDSKhoanDaNop ·
                            LayDSKhoanDaRut · LayDSKhoanNoRieng · LayDSKhoanNoChung ·
                            LayDSKhoanDuRieng · LayDSKhoanDuChung · LayDSPhieuDaThu ·
                            LayDSPhieuDaRut · LayDSPhieuHoaDon
     CMS_DanhMucThuocTinh/… CHUNG.NGANHANG (hộp Hướng dẫn) · TAICHINH.NUTHDDT (nút xuất)
     HDDT_HoaDon/ThemMoi · HDDT_HoaDon/ThemMoi_Nhap                      xuất hoá đơn điện tử

   Khác bản gốc (cách làm, KHÔNG đổi bố cục):
     · Thẻ số liệu vẽ bằng ums.pat.cards, bảng bằng ums.ui.table (dòng tổng
       `sum: true` thay edu.system.insertSumAfterTable), hộp thoại bằng ums.ui.dialog.
     · Xem hoá đơn của dòng "Chi tiết" (phiếu hóa đơn) dùng ums.phieu.viewer
       (= edu.extend.getData_Phieu) trong một hộp thoại có nút In.
     · Sự kiện gắn vào phần tử gốc của màn, không gắn vào $(document) như gốc
       (gốc gắn .btnXuat_HDDT lên document → rò khi chuyển chức năng).
   Lỗi bản gốc — xem báo cáo, tóm tắt:
     · "Chi tiết" ở danh sách phiếu đã thu / đã rút (.detail_KhoanThu /
       .detail_KhoanRut) KHÔNG có trình xử lý nào → giữ nút, đặt disabled.
     · Sau khi xuất HĐĐT gốc gọi main_doc.ChungTu.changeWidthPrint — màn này
       không có đối tượng ChungTu → TypeError. Bản mới mở luôn hộp xem hoá đơn.
     · getList_ChiTietKhoanMien / getList_ChiTietKhoanPhaiNop +
       genTable_ChiTietKhoanPhaiNop (hộp "Chi tiết khoản") không nơi nào gọi, và
       genTable_ChiTietKhoanPhaiNop dùng biến strTableId không tồn tại → bỏ.
     · Bỏ mã chết: genTable_TinhTrangTaiChinh, genTable_TheoDot (#tab_8 không có),
       eventTongTien / show_TongTien / showTongTien, getList_DMLKT / genList_DMLKT
       (#zoneLoaiKhoanThu không có), getList_ChiTietKhoanThu (gọi hàm tự do).

   Kéo gốc 30/9 (kho gốc fed68f6e..cffda56e — tệp .js dùng chung nên áp cho CẢ HAI màn):
     · Tình trạng người học đọc TRANGTHAINGUOIHOC_N1_TEN / _MA (trước
       QLSV_TRANGTHAINGUOIHOC_*). Tự quyết: máy chủ chưa trả cột mới thì lùi về cột
       cũ (gốc không lùi) — tránh mất nhãn khi backend chưa cập nhật.
     · Bốn hộp chi tiết phải nộp / được miễn / đã nộp / đã rút bỏ dòng
       KHONGHACHTOAN = 1 (gốc filterKhongHachToan). Con số trên thẻ vẫn lấy từ
       rsThongTin như gốc (không lọc lại).
     · Cột "Mã thanh toán định danh" + hộp QR của bảng nợ chung chỉ hiện khi tên
       miền là cmcu.edu.vn (hoặc tên miền con) — giữ đúng điều kiện của gốc
       (/(^|\.)cmcu\.edu\.vn$/i). Trường khác thanh toán ở màn "Thanh toán học phí".
     · Bấm bất kỳ đâu trên thẻ số liệu = bấm nút "Chi tiết" (data-the đặt trên cả thẻ).
     · Riêng html Tình hình học phí: thẻ chia BA nhóm ("Tổng hợp dư, nợ" / "Chi tiết
       quá trình" / "Thông tin hóa đơn, phiếu thu"), hai thẻ nợ / dư chung đổi tên
       "Danh sách nợ" / "Danh sách thừa", thẻ phiếu hóa đơn lên đầu nhóm ba →
       H.veThe(host, tt, { nhom: true }). html Xuất hóa đơn KHÔNG đổi → giữ lưới phẳng
       và tên cũ. Nền gradient / hiệu ứng thẻ của gốc là CSS vỏ cũ — bỏ qua.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat;
    var H = ums.csvHocPhi = {};

    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(e(s)); }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function tien(v) { return ui.money(v); }
    H.e = e; H.esc = esc; H.arr = arr;

    /** ID người học đang xem (thủ vai) — bản gốc: edu.system.userId */
    H.sv = function () { return (ums.session && ums.session.userId) || ''; };

    /* ---------- Lời gọi (action + func chép nguyên văn) -------------------- */
    var TT = 'TC_ThongTin_MH/';
    var F = 'pkg_taichinh_thongtin.';
    var G = {
        hoSo:      { action: 'SV_Custom/DSA4FSkuLyYVKC8CKSgVKCQ1CS4SLgPP', func: 'pkg_hosohocvien.LayThongTinChiTietHoSo' },
        tinhTrang: { action: TT + 'DSA4BRIVKC8pFTMgLyYVICgCKSgvKQPP', func: F + 'LayDSTinhTrangTaiChinh' },
        phainop:   { action: TT + 'DSA4BRIKKS4gLxEpICgPLjEP', func: F + 'LayDSKhoanPhaiNop' },
        duocmien:  { action: TT + 'DSA4BRIKKS4gLwwoJC8P', func: F + 'LayDSKhoanMien' },
        danop:     { action: TT + 'DSA4BRIKKS4gLwUgDy4x', func: F + 'LayDSKhoanDaNop' },
        darut:     { action: TT + 'DSA4BRIKKS4gLwUgEzQ1', func: F + 'LayDSKhoanDaRut' },
        norieng:   { action: TT + 'DSA4BRIKKS4gLw8uEygkLyYP', func: F + 'LayDSKhoanNoRieng' },
        nochung:   { action: TT + 'DSA4BRIKKS4gLw8uAik0LyYP', func: F + 'LayDSKhoanNoChung' },
        durieng:   { action: TT + 'DSA4BRIKKS4gLwU0EygkLyYP', func: F + 'LayDSKhoanDuRieng' },
        duchung:   { action: TT + 'DSA4BRIKKS4gLwU0Aik0LyYP', func: F + 'LayDSKhoanDuChung' },
        phieuthu:  { action: TT + 'DSA4BRIRKSgkNAUgFSk0', func: F + 'LayDSPhieuDaThu' },
        phieurut:  { action: TT + 'DSA4BRIRKSgkNAUgEzQ1', func: F + 'LayDSPhieuDaRut' },
        hoadon:    { action: TT + 'DSA4BRIRKSgkNAkuIAUuLwPP', func: F + 'LayDSPhieuHoaDon' }
    };
    H.G = G;
    function goi(k, o) { return ums.api.call(Object.assign({ silent: true }, G[k], o || {})); }
    H.goi = goi;

    /* =====================================================================
       1. Thông tin người học — bản gốc: getDetail_DoiTuong + viewForm_DoiTuong
       ===================================================================== */
    /* Màu nhãn theo Ý NGHĨA, không theo loại dữ liệu (bảng màu chuẩn ở
       components/chip.css): ok = tốt / bình thường · warn = cần chú ý ·
       bad = xấu, đang nợ · info = trung tính · mute = chưa xác định. */
    var MAU_TT = {
        CHUYENTRUONGDI: 'bad', CHUYENTRUONG: 'bad', KHONGXACDINH: 'mute', FORCEDROPOUT: 'bad',
        CANHBAO: 'bad', DROPOUT: 'bad', XOATEN: 'bad', DUNGHOC: 'bad',
        NORMAL: 'ok',                       // đang học bình thường
        RESERVE: 'warn', REPEATE: 'warn'    // bảo lưu / học lại: cần chú ý
    };

    /**
     * Vẽ khối thông tin người học vào host.
     * o.lop = true  → hiện thêm "Lớp" (chỉ màn Tình hình học phí có)
     */
    H.thongTinSV = function (host, o) {
        o = o || {};
        host.innerHTML = ui.empty('Đang tải thông tin…', 'fa-spinner fa-spin');
        return goi('hoSo', { strId: H.sv() }).then(function (r) {
            var d = arr(r.data)[0] || {};
            var ten = (e(d.HODEM) + ' ' + e(d.TEN)).trim();
            /* Kéo gốc 30/9: cột mới TRANGTHAINGUOIHOC_N1_*; lùi về cột cũ nếu máy chủ chưa trả */
            var coMoi = e(d.TRANGTHAINGUOIHOC_N1_TEN) !== '' || e(d.TRANGTHAINGUOIHOC_N1_MA) !== '';
            var tt = e(coMoi ? d.TRANGTHAINGUOIHOC_N1_TEN : d.QLSV_TRANGTHAINGUOIHOC_TEN);
            var ma = e(coMoi ? d.TRANGTHAINGUOIHOC_N1_MA : d.QLSV_TRANGTHAINGUOIHOC_MA);
            host.innerHTML =
                '<div class="hp-sv">' +
                '<div class="hp-sv__ten">' + esc(ten) + '</div>' +
                '<div class="hp-sv__dong">Mã: <b>' + esc(d.MASO) + '</b>' +
                ' · SĐT: <b>' + esc(d.TTLL_DIENTHOAICANHAN) + '</b>' +
                (o.lop ? ' · Lớp: <b>' + esc(d.LOP) + '</b>' : '') + '</div>' +
                (tt ? '<div class="hp-sv__nhan">' + ui.badge(tt, MAU_TT[ma] || 'ok') + '</div>' : '') +
                '<div class="hp-sv__nhan" data-z="noco"></div>' +
                '</div>';
            return d;
        }).catch(function (err) {
            host.innerHTML = ui.fail(err.message);
            return null;
        });
    };

    /* Dòng "Tổng nợ / Tổng dư / Đã hoàn thành" — bản gốc genHTML_TongCacKhoanThu */
    H.noCo = function (host, data) {
        var el = host.querySelector('[data-z="noco"]');
        if (!el) return;
        var n = data ? Number(e(data.NOCO)) : NaN;
        if (isNaN(n) || e(data && data.NOCO) === '') { el.innerHTML = ui.badge('Chưa xác định', 'mute'); return; }
        /* Dư tiền là chuyện TỐT → xanh lá; đang nợ → đỏ. Chữ đã nói "nợ" nên số
           bỏ dấu âm (bản gốc in thẳng số âm: "Tổng nợ: -1.250.000"). */
        if (n > 0) el.innerHTML = ui.badge('Tổng dư: ' + tien(n) + ' đ', 'ok');
        else if (n < 0) el.innerHTML = ui.badge('Tổng nợ: ' + tien(Math.abs(n)) + ' đ', 'bad');
        else el.innerHTML = ui.badge('Đã hoàn thành', 'ok');
    };

    /* =====================================================================
       2. Lưới thẻ số liệu — bản gốc: 12 thẻ .finance-dashboard-item
       Hai thẻ "Tổng nợ riêng" / "Tổng dư riêng" và thẻ "Khoản đã nộp chưa xuất
       hóa đơn" bị bản gốc đặt style="display:none" và không mã nào bật lên →
       bản mới cũng không vẽ (xem báo cáo).
       ===================================================================== */
    var THE = [
        /* Ảnh: chép nguyên bộ biểu tượng của bản gốc (assets/images/finance/finance-icon-N.png),
           đổi tên theo nội dung để không phải nhớ số — xem assets/img/hocphi/. */
        { key: 'phainop',  ten: 'Khoản phải nộp',            col: 'TONGKHOANPHAINOP', tone: 'ok',   anh: 'khoan-phai-nop' },
        { key: 'duocmien', ten: 'Khoản được miễn',           col: 'TONGKHOANDUOCMIEN', tone: 'warn', anh: 'khoan-duoc-mien' },
        { key: 'danop',    ten: 'Khoản đã nộp',              col: 'TONGKHOANDANOP',   tone: 'info', anh: 'khoan-da-nop' },
        { key: 'darut',    ten: 'Khoản đã rút',              col: 'TONGKHOANDARUT',   tone: 'mute', anh: 'khoan-da-rut' },
        { key: 'nochung',  ten: 'Tổng nợ chung các khoản',   col: 'TONGNOCHUNG',      tone: 'bad',  anh: 'no-chung' },
        { key: 'duchung',  ten: 'Tổng dư chung các khoản',   col: 'TONGDUCHUNG',      tone: 'ok',   anh: 'du-chung' },
        { key: 'phieuthu', ten: 'Danh sách phiếu đã thu',    col: 'TONGTIENPHIEUTHU', tone: 'info', anh: 'phieu-da-thu' },
        { key: 'phieurut', ten: 'Danh sách phiếu đã rút',    col: 'TONGTIENPHIEURUT', tone: 'mute', anh: 'phieu-da-rut' },
        { key: 'hoadon',   ten: 'Danh sách phiếu hóa đơn',   col: 'TONGTIENHOADON',   tone: 'info', anh: 'hoa-don' }
    ];
    H.THE = THE;

    /* Kéo gốc 30/9 — html Tình hình học phí chia thẻ thành ba nhóm, đổi tên hai thẻ */
    var NHOM = [
        { ten: 'Tổng hợp dư, nợ', icon: 'fa-scale-balanced', keys: ['nochung', 'duchung'] },
        { ten: 'Chi tiết quá trình', icon: 'fa-rectangle-list', keys: ['phainop', 'duocmien', 'danop', 'darut'] },
        { ten: 'Thông tin hóa đơn, phiếu thu', icon: 'fa-file-invoice-dollar', keys: ['hoadon', 'phieuthu', 'phieurut'] }
    ];
    var TEN_NHOM = { nochung: 'Danh sách nợ', duchung: 'Danh sách thừa' };

    /**
     * Vẽ lưới thẻ; mỗi thẻ có nút "Chi tiết" đúng như bản gốc.
     * o.nhom = true → ba nhóm có tiêu đề (bố cục html Tình hình học phí sau kéo gốc 30/9).
     */
    H.veThe = function (host, tt, o) {
        o = o || {};
        if (!o.nhom) { veLuoi(host, THE, tt, {}); return; }
        host.innerHTML = NHOM.map(function (n, i) {
            return '<div class="ums-legend' + (i ? ' ums-legend--cach' : '') + '"><i class="fa-light ' + n.icon + '"></i> ' +
                esc(n.ten) + '</div><div data-nhom="' + i + '"></div>';
        }).join('');
        NHOM.forEach(function (n, i) {
            var ds = n.keys.map(function (k) { return THE.filter(function (t) { return t.key === k; })[0]; });
            veLuoi(host.querySelector('[data-nhom="' + i + '"]'), ds, tt, TEN_NHOM);
        });
    };

    function veLuoi(host, items, tt, doiTen) {
        pat.cards({
            el: host,
            items: items,
            /* Kéo gốc 30/9: bấm bất kỳ đâu trên thẻ = bấm "Chi tiết" (trình xử lý của màn bắt [data-the]) */
            attrs: function (t) { return { 'data-the': t.key }; },
            tone: function (t) { return t.tone; },
            render: function (t) {
                var v = tt ? tt[t.col] : null;
                /* Chữ và ảnh xếp HÀNG NGANG (không đặt ảnh tuyệt đối — thẻ hẹp là ảnh đè lên chữ) */
                return '<span class="hp-the__noi">' +
                        '<span class="hp-the__so">' + (e(v) === '' || isNaN(Number(v)) ? '0' : tien(v)) + ' <i>vnđ</i></span>' +
                        '<span class="hp-the__ten">' + esc(doiTen[t.key] || t.ten) + '</span>' +
                    '</span>' +
                    '<img class="hp-the__anh" src="assets/img/hocphi/' + t.anh + '.png" alt="" loading="lazy">';
            },
            actions: function (t) {
                return ui.btn('view', { text: 'Chi tiết', icon: 'fa-eye', mod: 'out-primary', cls: 'ums-btn--sm', attr: { 'data-the': t.key } });
            }
        });
    }

    /* =====================================================================
       3. Hộp "Danh sách <loại>" — bản gốc #finance_detail + genDetail_*
       ===================================================================== */
    var TEN_LOAI = {
        phainop: ' khoản phải nộp', duocmien: ' khoản được miễn', danop: ' khoản đã nộp',
        darut: ' khoản đã rút', norieng: ' khoản nợ riêng', nochung: ' khoản nợ chung',
        durieng: ' khoản dư riêng', duchung: ' dư chung', phieuthu: ' phiếu đã thu',
        phieurut: ' phiếu đã rút', hoadon: ' hóa đơn'
    };
    var PHAN_TRANG = { norieng: 1, nochung: 1, durieng: 1, duchung: 1, phieuthu: 1, phieurut: 1, hoadon: 1 };
    /* Kéo gốc 30/9: bốn hộp này bỏ dòng KHONGHACHTOAN = 1 (gốc filterKhongHachToan) */
    var LOC_HACH_TOAN = { phainop: 1, duocmien: 1, danop: 1, darut: 1 };
    function locKhongHachToan(rows) {
        return rows.filter(function (x) { return Number((x && x.KHONGHACHTOAN) || 0) !== 1; });
    }
    /* Kéo gốc 30/9: cột "Mã thanh toán định danh" + QR chỉ ở trường CMCU (gốc bShowQRInline) */
    H.qrInline = function () { return /(^|\.)cmcu\.edu\.vn$/i.test(window.location.hostname); };

    /* Cột của nhóm "khoản" — chép đúng thứ tự và chữ tiêu đề của bản gốc */
    function cotKhoan(key) {
        var c = [
            { title: 'Học kỳ', prop: 'DAOTAO_THOIGIANDAOTAO', cls: 'is-center' },
            { title: 'Đợt', prop: 'DAOTAO_THOIGIANDAOTAO_DOT', cls: 'is-center' },
            { title: 'Loại khoản', prop: 'TAICHINH_CACKHOANTHU_TEN' },
            { title: 'Nội dung', prop: 'NOIDUNG' },
            { title: key === 'duocmien' ? 'Số tiền được miễn' : 'Số tiền', cls: 'is-right is-nowrap', sum: true, sumProp: 'SOTIEN',
              render: function (x) { return tien(x.SOTIEN); } },
            { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap' }
        ];
        if (key === 'danop') c.push({ title: 'Số chứng từ', prop: 'CHUNGTU_SO', cls: 'is-center' });
        c.push({ title: 'Người tạo', prop: 'NGUOITAO_TENDAYDU', cls: 'is-center' });
        if (key === 'nochung' && H.qrInline()) {
            c.push({ title: 'Mã thanh toán định danh', cls: 'is-center is-nowrap', render: function (x) {
                if (!e(x.MATHANHTOANDINHDANH)) return '';
                return ui.btn('view', {
                    text: e(x.MATHANHTOANDINHDANH), icon: 'fa-credit-card', mod: 'quiet', cls: 'ums-btn--sm',
                    attr: { 'data-qr': e(x.MATHANHTOANDINHDANH), 'data-sotien': e(x.SOTIEN), 'data-noidung': e(x.NOIDUNG) }
                });
            } });
        }
        return c;
    }

    /* Cột của nhóm "phiếu" */
    function cotPhieu(key) {
        return [
            { title: 'Số phiếu', prop: 'SOPHIEUTHU', cls: 'is-center' },
            { title: 'Tổng tiền', cls: 'is-right is-nowrap', sum: true, sumProp: 'TONGTIEN',
              render: function (x) { return tien(x.TONGTIEN); } },
            { title: 'Ngày thu', prop: 'NGAYTHU_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' },
            { title: 'Người thu', prop: key === 'phieurut' ? 'TAIKHOAN_NGUOIRUT' : 'TAIKHOAN_NGUOITHU', cls: 'is-center' },
            { title: 'Chi tiết', cls: 'is-center', render: function (x) {
                /* Bản gốc chỉ gắn trình xử lý cho .detail_PhieuHoaDon; hai màn phiếu
                   đã thu / đã rút vẽ nút "Chi tiết" mà không có xử lý → giữ nút,
                   đặt disabled (luật chung, xem báo cáo). */
                if (key !== 'hoadon') {
                    return ui.btn('view', { text: 'Chi tiết', icon: 'fa-eye', cls: 'ums-btn--sm', attr: { disabled: 'disabled' } });
                }
                return ui.btn('view', { text: 'Chi tiết', icon: 'fa-eye', cls: 'ums-btn--sm', attr: { 'data-hd': e(x.ID) } });
            } }
        ];
    }

    H.hopChiTiet = function (key) {
        var dlg = ui.dialog({
            title: 'Danh sách' + (TEN_LOAI[key] || ''), icon: 'fa-list-ul', size: 'xl',
            body: '<div data-z="bang">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>'
        });
        var host = dlg.body.querySelector('[data-z="bang"]');
        var p = PHAN_TRANG[key] ? { pageIndex: 1, pageSize: 1000000000 } : {};
        goi(key, Object.assign({ strQLSV_NguoiHoc_Id: H.sv() }, p)).then(function (r) {
            var rows = arr(r.data);
            if (LOC_HACH_TOAN[key]) rows = locKhongHachToan(rows);
            var phieu = key === 'phieuthu' || key === 'phieurut' || key === 'hoadon';
            ui.table({ el: host, rows: rows, columns: phieu ? cotPhieu(key) : cotKhoan(key),
                       empty: 'Không có dữ liệu' });
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); });

        dlg.body.addEventListener('click', function (ev) {
            var q = ev.target.closest('[data-qr]');
            if (q) { H.hopQR(q.getAttribute('data-qr'), q.getAttribute('data-sotien'), q.getAttribute('data-noidung')); return; }
            var h = ev.target.closest('[data-hd]');
            if (h) H.hopPhieu(h.getAttribute('data-hd'));
        });
        return dlg;
    };

    /* Hộp "Thanh toán QR" — ảnh VietQR, chép nguyên đường dẫn của bản gốc */
    H.hopQR = function (maDinhDanh, soTien, noiDung) {
        var st = String(e(soTien)).replace(/,/g, '');
        var url = 'https://api.vietqr.io/image/970418-' + encodeURIComponent(e(maDinhDanh)) +
            '-JIzXIaG.jpg?accountName=LU%20A%20TUAN&amount=' + encodeURIComponent(st) +
            '&addInfo=' + encodeURIComponent(e(noiDung));
        ui.dialog({
            title: 'Thanh toán QR', icon: 'fa-qrcode', size: 'sm',
            body: '<div class="hp-qrbox"><img src="' + esc(url) + '" alt="Mã QR thanh toán"></div>'
        });
    };

    /* Hộp xem / in hoá đơn — bản gốc: edu.extend.getData_Phieu(id, "HOADON", …) */
    H.hopPhieu = function (id) {
        var dlg = ui.dialog({
            title: 'Hóa đơn', icon: 'fa-file-invoice', size: 'lg',
            body: '<div data-z="lien" class="ums-u-mb-2" hidden></div><div data-z="khung"></div>',
            buttons: [{ text: 'In', kind: 'print', keepOpen: true, onClick: function () { v.print('Hóa đơn'); return false; } }]
        });
        var v = ums.phieu.viewer(dlg.body.querySelector('[data-z="khung"]'), { tools: dlg.body.querySelector('[data-z="lien"]') });
        v.show({ id: id, loai: 'HOADON' });
        return dlg;
    };

    /* =====================================================================
       4. Bảng "Khoản đã nộp chưa xuất hóa đơn" + nút xuất HĐĐT
       Bản gốc: genTable_TinhTrangTaiChinh_HoaDon + save_ChungTu
       ===================================================================== */
    H.bangHoaDon = function (host, rows) {
        ui.table({
            el: host, rows: rows || [], empty: 'Không có khoản nào chờ xuất hóa đơn',
            columns: [
                { title: 'Học kỳ', prop: 'DAOTAO_THOIGIANDAOTAO', cls: 'is-center' },
                { title: 'Đợt', prop: 'DAOTAO_THOIGIANDAOTAO_DOT', cls: 'is-center' },
                { title: 'Khoản thu', prop: 'TAICHINH_CACKHOANTHU_TEN' },
                { title: 'Nội dung', prop: 'NOIDUNG' },
                { title: 'Số tiền', cls: 'is-right is-nowrap', sum: true, sumProp: 'SOTIEN',
                  render: function (x) { return tien(x.SOTIEN); } },
                { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap' },
                { head: '<input type="checkbox" data-ckall>', title: '', cls: 'is-center', width: '46px',
                  render: function (x) { return '<input type="checkbox" data-ck value="' + esc(x.ID) + '">'; } }
            ]
        });
        var all = host.querySelector('[data-ckall]');
        if (all) {
            all.addEventListener('click', function () {
                Array.prototype.forEach.call(host.querySelectorAll('input[data-ck]'), function (c) { c.checked = all.checked; });
            });
        }
    };

    /** ID các dòng đang đánh dấu trong bảng hoá đơn */
    H.chonHoaDon = function (host) {
        return Array.prototype.filter.call(host.querySelectorAll('input[data-ck]'), function (c) { return c.checked; })
            .map(function (c) { return c.value; });
    };

    /**
     * Vẽ các nút "Xuất <tên>" từ danh mục TAICHINH.NUTHDDT (bỏ mục MA = HDDTNHAP,
     * đúng như bản gốc) và gắn xử lý xuất hoá đơn.
     * o = { bang: phần tử chứa bảng, rows(): mảng dòng đang hiện, sauKhiXuat() }
     */
    H.nutHDDT = function (host, o) {
        /* "Xem hóa đơn nháp" có trong bản gốc nhưng KHÔNG có trình xử lý, lại bị
           chính đoạn đổ danh mục xoá mất → giữ nút, đặt disabled. */
        host.innerHTML = ui.btn('view', { text: 'Xem hóa đơn nháp', mod: 'out-info', icon: 'fa-paper-plane', attr: { disabled: 'disabled' } });
        return ums.api.dm('TAICHINH.NUTHDDT').then(function (dm) {
            var h = host.innerHTML;
            (dm || []).forEach(function (x) {
                if (e(x.MA) === 'HDDTNHAP') return;
                h += ui.btn('view', { text: 'Xuất ' + e(x.TEN), mod: 'out-info', icon: 'fa-paper-plane',
                    attr: { 'data-hddt': e(x.ID), 'data-ma': e(x.MA) } });
            });
            host.innerHTML = h;
            host.addEventListener('click', function (ev) {
                var b = ev.target.closest('[data-hddt]');
                if (!b) return;
                xuat(b.getAttribute('data-ma'), o);
            });
        }).catch(function (err) { ums.api.handle(err, 'danh mục nút hóa đơn điện tử'); });
    };

    /* save_ChungTu của bản gốc — gom các dòng đã chọn rồi gọi HDDT_HoaDon/… */
    function xuat(ma, o) {
        var ids = H.chonHoaDon(o.bang);
        if (!ids.length) { ui.toast('Vui lòng chọn khoản xuất hóa đơn?', 'warn'); return; }
        var ds = o.rows() || [];
        var p = { khoan: [], tg: [], noiDung: [], soTien: [], soLuong: [], donGia: [], dvt: [],
                  htMa: '', htTen: '', tienTe: '' };
        ids.forEach(function (id) {
            var a = null;
            for (var i = 0; i < ds.length; i++) if (String(ds[i].ID) === String(id)) { a = ds[i]; break; }
            if (!a) return;
            p.khoan.push(a.ID);
            p.tg.push(e(a.DAOTAO_THOIGIANDAOTAO_ID));
            p.noiDung.push(e(a.NOIDUNG));
            p.soTien.push(e(a.SOTIEN));
            p.soLuong.push(a.SOLUONG ? a.SOLUONG : 1);
            p.donGia.push(a.DONGIA ? a.DONGIA : a.SOTIEN);
            p.dvt.push(e(a.DONVITINH_TEN));
            p.htMa = e(a.HINHTHUCTHU_MA);
            p.htTen = e(a.HINHTHUCTHU_TEN);
            p.tienTe = e(a.LOAITIENTE_MA);
        });
        var nhap = String(ma).indexOf('HDDTNHAP') === 0;
        var obj = {
            action: nhap ? 'HDDT_HoaDon/ThemMoi_Nhap' : 'HDDT_HoaDon/ThemMoi',
            strTaiChinh_CacKhoanThu_Ids: p.khoan.toString(),
            strQLSV_NguoiHoc_Id: H.sv(),
            strDaoTao_ThoiGianDaoTao_Id: p.tg.toString(),
            strHinhThucThu_MA: p.htMa,
            strHinhThucThu_TEN: p.htTen,
            strTaiChinh_SoTien_s: p.soTien.toString(),
            strTaiChinh_NoiDung_s: p.noiDung.join('#'),
            strDonGia_s: p.donGia.toString(),
            strSoLuong_s: p.soLuong.toString(),
            strDonViTinhTen_s: p.dvt.toString(),
            strLoaiTienTe: p.tienTe,
            strPhuongThuc_MA: e(ma),
            /* Bản gốc gửi me.strChuongTrinh_Id — thuộc tính này KHÔNG bao giờ được
               gán trong màn, tức gốc gửi undefined. Giữ nguyên nghĩa: gửi rỗng. */
            strDaoTao_ToChucCT_Id: ''
        };
        ums.api.call(obj).then(function (r) {
            if (nhap) {
                var link = r.data;
                if (typeof link !== 'string' || link.indexOf('http') === -1) {
                    var S = ums.session || {};
                    link = (S.api && S.api.HDDT) || '';
                    link = link.substring(0, link.length - 3);
                    if (link.indexOf('http') === -1) link = (S.apiUrlTemp || '') + link;
                }
                var win = window.open(link, '_blank');
                if (win) win.focus();
                else ui.toast('Vui lòng cho phép mở tab mới trên trình duyệt và thử lại!', 'warn');
                return;
            }
            ui.toast('Xuất hóa đơn thành công', 'ok');
            var id = r.raw && r.raw.Id;
            if (id) H.hopPhieu(id);
            if (o.sauKhiXuat) o.sauKhiXuat();
        }).catch(function (err) { ums.api.handle(err, 'xuất hóa đơn điện tử'); });
    }

    /* =====================================================================
       5. Hộp "Hướng dẫn sử dụng thanh toán" — danh mục CHUNG.NGANHANG
       ===================================================================== */
    H.hopHuongDan = function () {
        var dlg = ui.dialog({
            title: 'Hướng dẫn sử dụng thanh toán', icon: 'fa-circle-question', size: 'lg',
            body: '<div data-z="bang">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>'
        });
        var host = dlg.body.querySelector('[data-z="bang"]');
        ums.api.dm('CHUNG.NGANHANG').then(function (rows) {
            ui.table({
                el: host, rows: rows || [], empty: 'Chưa có tài liệu hướng dẫn',
                columns: [
                    { title: 'Ngân hàng', prop: 'TEN' },
                    { title: 'Tài liệu hướng dẫn', render: function (x) {
                        if (!e(x.THONGTIN1)) return '';
                        return '<a href="' + esc(ums.files.url(x.THONGTIN1)) + '" target="_blank" rel="noopener">' + esc(x.THONGTIN1) + '</a>';
                    } },
                    { title: 'Ghi chú', prop: 'THONGTIN2' }
                ]
            });
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); });
        return dlg;
    };

    /* =====================================================================
       6. Nạp tình trạng tài chính (dùng cho cả hai màn)
       ===================================================================== */
    H.napTinhTrang = function () {
        return goi('tinhTrang', {
            strQLSV_NguoiHoc_Id: H.sv(),
            strNguonDuLieu_Id: ''
        }).then(function (r) {
            var d = r.data || {};
            return {
                tt: (d.rsThongTin || [])[0] || null,
                hoaDon: d.rsKhoanDaNopChuaXuatHoaDon || []
            };
        });
    };
})();
