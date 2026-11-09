/* =========================================================================
   Gửi cảnh báo thay đổi đăng ký / rút học phần cho Phòng TC-KT
   Bản gốc: ApisDangKyHoc/Modules/kehoachdangky/html/canhbaotckt.html + script/canhbaotckt.js (kho gốc 9/11/2026)
   ---------------------------------------------------------------------------
   Bố cục bản gốc — MỘT cột, ba vùng thay chỗ nhau (zone-bus):
     1. Màn chính: nút "Mẫu email" · "Gửi lại mục đã chọn" (chỉ ở tab 2) · "Gửi cho TC-KT" (chỉ ở tab 1)
        → ghi chú → dải thông báo → hai tab
          · "Thay đổi cần gửi": lọc (Nguồn · Đợt · Kế hoạch · từ khoá · Từ ngày · Đến ngày · Ẩn thay đổi trong đợt)
            → thanh "Đã chọn n dòng / Chọn tất cả / Bỏ chọn" → bảng + ô đánh dấu (giữ qua các trang)
          · "Lịch sử đã gửi": lọc (từ khoá · Từ ngày · Đến ngày · Trạng thái · Chỉ lượt gửi của tôi) → bảng + Xem + ô đánh dấu
     2. "Mẫu email cảnh báo TC-KT": biểu mẫu mẫu thư (mã cố định MA_MAU) — khung THAY CHỖ màn (ums.pat.formTrang)
     3. "Chi tiết email": khung chỉ đọc THAY CHỖ màn (ums.pat.formTrang)

   Lời gọi (chép nguyên văn tên action / tham số / cột):
       Nguồn DOCANBO  DKH_ThongTin2_MH/DSA4BRIFIC8mCjgJLiIFLgIgLwMu  PKG_DANGKYHOC_THONGTIN2.LayDSDangKyHocDoCanBo  (iM, POST)
       Nguồn DANGKY   DKH_ThongTin2_MH/DSA4BRIFIC8mCjgJLiIP          pkg_dangkyhoc_thongtin2.LayDSDangKyHoc         (iM, POST, thêm strHanhDong_XacNhan_Id '')
           strTuKhoa, strDaoTao_ThoiGianDaoTao_Id, strDaoTao_HocPhan_Id '', strNguoiThucHien_Id, pageIndex, pageSize,
           strTKB_HinhThucHoc_Id '', strDangKy_KeHoachDangKy_Id, dChiLayCacLopChuaPhanCong 0, strDaoTao_KhoaDaoTao_Id '',
           strDaoTao_ChuongTrinh_Id '', strDaoTao_HeDaoTao_Id '', strDaoTao_KhoaQuanLy_Id '', dSoDaDangTuSo -1, dSoDaDangDenSo -1, strKieuHoc_Id ''
           — phân trang ở máy chủ (Pager)
       Nguồn RUT      DKH_RutHocPhan/LayDSRut  GET  strTuKhoa, strDaoTao_ThoiGianDaoTao_Id, strDaoTao_HeDaoTao_Id '', strNguoiThucHien_Id
           — máy chủ trả cả đợt, cắt trang ở trình duyệt (như gốc)
       DKH_RutHocPhan/LayDSThoiGianRut   GET  ô Đợt (ID / THOIGIAN)
       DKH_KeHoachDangKy/LayDanhSach     GET  strTuKhoa '', pageIndex 1, pageSize 100000 — ô Kế hoạch + cửa sổ thời gian đăng ký / rút
           (NGAYBATDAU + GIODANGKYTRONGNGAYDAU/PHUT…, NGAYKETTHUC + GIOKETTHUCTRONGNGAYCUOI/PHUT…, NGAYBATDAUTINHRUTHOCPHAN, SONGAYDUOCPHEPRUTHOCPHAN)
       CMS_TienIch/LayDS_CauTrucNoiDungGuiEmail   GET versionAPI v1.0  strTuKhoa = MA_MAU, strNguoiTao_Id '', pageIndex 1, pageSize 1000 → mẫu có MA = MA_MAU
       CMS_TienIch/Them|Sua_CauTrucNoiDungGuiEmail  POST versionAPI v1.0  strId, strMa, strTenEmailHienThi, strTieuDe, strNoiDung, strDanhSachNhanEmail, strGhiChu
       CMS_TienIch/ThucHienGuiEmailTheoCauTruc    GET  strCauTrucGuiEmailId = MA_MAU, strDuLieuId = ID dòng thay đổi, strNguoiTao_Id — mỗi dòng một lời gọi
       CMS_TienIch/LayDS_TienTrinhGuiEmail        GET versionAPI v1.0  strTuKhoa, strNguoiTao_Id, strTuNgay, strDenNgay, strDaGui,
           strCauTrucNoiDungGuiEmailId = ID mẫu, pageIndex, pageSize — cột MAILTO (\x04 → @), NOIDUNGEMAIL, NGAYGUI, DAGUI, LOIGUIMAIL, MAILSUBJECT
       CMS_TienIch/ThucHienGuiEmail               GET versionAPI v1.0  ArrstrId "id1,id2", strHanhDong 'GUILAI', strNguoiThucHien_Id
       strNguoiThucHien_Id để '' — tầng ums.api tự chèn; strNguoiTao_Id gửi userId như gốc (không được tự chèn).

   Giữ như gốc: gợi ý Trong / Ngoài / Chưa xác định đợt chính thức tính ở trình duyệt (parseNgay / tinhCuaSo / danhGia chép nguyên);
     nhớ Nguồn và "Đã gửi (máy này)" ở localStorage theo người dùng; gửi hàng loạt qua form tiến trình chung (ums.process.run,
     gốc edu.process.run); gửi lại qua ums.process.runJob (gốc edu.process.runJob); kiểm lại mẫu trên máy chủ ngay trước khi gửi;
     nguồn LICHSU (DKH_XuLy/LayKetQuaLichSuDangKyHoc) gốc đã ẨN vì hàm bị xoá — ở đây không dựng (mã gốc đã comment).
   Khác gốc (cách làm, không đổi bố cục):
     · Không nút "Tìm kiếm": gõ từ khoá tự tìm sau 400 ms, đổi ô lọc tự nạp; nút ↻ Tải lại cuối thanh lọc (luật 26/9).
     · Cảnh báo chặn (chưa chọn dòng, mẫu thiếu…) = toast + dải thông báo trong trang (gốc: alert chồng lên banner).
     · Thử lại 1 lần khi mất kết nối / 404 / 502–504 như gốc, nhưng không có dòng "đang thử lại" riêng (toast của tầng chung lo).
   Cố ý bỏ: id HTML gốc không được JS dùng (cbThongBaoMau dùng chung cách dựng dải, paneLichSu/paneThayDoi là vùng tab).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var root = document.getElementById('dkh-canhbaotckt');
    if (!root) return;

    var MA_MAU = 'DKH_CANHBAO_THAYDOI_NGOAIDOT';
    var TIEU_DE = 'Gửi cảnh báo thay đổi đăng ký / rút học phần cho Phòng TC-KT';
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function iM() { return (ums.session && ums.session.iM) || ''; }
    function v(x) { return (x === null || x === undefined) ? '' : String(x); }
    function arr(d) { return Array.isArray(d) ? d : []; }
    var size0 = (ums.cfg && ums.cfg.behavior && ums.cfg.behavior.pageSize) || 10;

    var S = {
        dtAll: [],          // dòng đã chuẩn hoá của bộ dữ liệu đang xem (trước khi lọc ở trình duyệt)
        dt: [],             // dòng đang hiển thị (sau lọc ngày / ẩn trong đợt)
        dtLS: [],
        dtKeHoach: [],
        arrCuaSo: [], mapCuaSo: {},
        objMau: null, bMauDaNap: false, bKeHoachDaNap: false,
        objDaGui: {},       // { ID: timestamp } đã gửi từ máy này
        objChon: {},        // { ID: dòng } đang đánh dấu — giữ qua các trang
        mapTrang: {},       // { ID: dòng } đang hiện ở trang bảng hiện tại
        arrLoiPhu: [],
        nguonDL: 'DOCANBO', // nguồn mà bộ dữ liệu đang hiển thị thuộc về
        iPager: 0, iReq: 0, iReqLS: 0, bDangKiemTra: false,
        p1: { index: 1, size: size0 },   // trang tab 1 (nguồn rút cắt ở trình duyệt, nguồn đăng ký ở máy chủ)
        p2: { index: 1, size: size0 },   // trang tab 2
        tab: 'td', tim1: 0, tim2: 0
    };

    /* ---------- Dựng màn ------------------------------------------------- */
    root.innerHTML =
        pat.page(TIEU_DE,
            ui.btn('edit', { text: 'Mẫu email', icon: 'fa-file-lines', mod: 'out-info', attr: { 'data-a': 'mau' } }) +
            ui.btn('confirm', { text: 'Gửi lại mục đã chọn', icon: 'fa-paper-plane', mod: 'out-primary', attr: { 'data-a': 'guilai', hidden: '' } }) +
            ui.btn('confirm', { text: 'Gửi cho TC-KT', icon: 'fa-paper-plane', mod: 'primary', attr: { 'data-a': 'gui' } })) +
        '<div class="cbtckt-intro">Tick các thay đổi đăng ký/rút học phần cần báo, rồi bấm <b>Gửi cho TC-KT</b>. ' +
            'Nội dung và người nhận email do Phòng tự chỉnh ở <b>Mẫu email</b>; mọi lượt gửi được lưu ở tab <b>Lịch sử đã gửi</b>. ' +
            'Cột <b>Đợt chính thức</b> chỉ là gợi ý (so với thời gian đăng ký/rút của kế hoạch; chọn đúng <b>Kế hoạch</b> thì gợi ý chính xác hơn), việc chọn gửi do người dùng quyết định. ' +
            'Nguồn dữ liệu hiện có: đăng ký (do cán bộ thực hiện hoặc tất cả) và rút học phần. <b>Hủy đăng ký / đổi lịch</b> chưa có danh sách vì hàm lịch sử cũ đã bị xóa.</div>' +
        '<div class="cbtckt-banner" data-z="tb"></div>' +
        '<div class="cbtckt-banner" data-z="tbphu"></div>' +
        ui.tabs([{ key: 'td', text: 'Thay đổi cần gửi', icon: 'fa-right-left' }, { key: 'ls', text: 'Lịch sử đã gửi', icon: 'fa-clock-rotate-left' }], 'td', 'data-cbtab') +
        /* ---- Tab 1 ---- */
        '<div class="ums-u-mt-3" data-pane="td">' +
            pat.filterBar([
                { key: 'nguon', type: 'select', label: 'Nguồn dữ liệu' },
                { key: 'dot', type: 'select', label: 'Tất cả đợt' },
                { key: 'kh', type: 'select', label: 'Tất cả kế hoạch' },
                { key: 'q', type: 'text', label: 'Mã số / họ tên / học phần' },
                { key: 'tu', type: 'date', label: 'Từ ngày' },
                { key: 'den', type: 'date', label: 'Đến ngày' }
            ], { search: false, extra:
                '<div class="ums-field ums-field--fit"><label class="ums-check"><input type="checkbox" data-f="anTrong"> <b>Ẩn thay đổi trong đợt chính thức</b></label></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('reload', { attr: { 'data-a': 'tailai1' } }) + '</div>' }) +
            pat.panel({ title: 'Thay đổi cần gửi', icon: 'fa-right-left', count: 'n1', flush: true, zone: 'b1',
                tools: '<span class="ums-u-fz13 ums-u-muted" data-z="dachon"></span>' +
                    '<button type="button" class="ums-btn ums-btn--ghost ums-btn--sm" data-a="chonhet" hidden><i class="fa-light fa-check-double"></i><span data-z="chonhet"></span></button>' +
                    '<button type="button" class="ums-btn ums-btn--ghost ums-btn--sm" data-a="bochon" hidden><i class="fa-light fa-square-minus"></i><span>Bỏ chọn tất cả</span></button>',
                body: ui.empty('Đang tải dữ liệu…', 'fa-spinner fa-spin') }) +
        '</div>' +
        /* ---- Tab 2 ---- */
        '<div class="ums-u-mt-3" data-pane="ls" hidden>' +
            pat.filterBar([
                { key: 'lsq', type: 'text', label: 'Người nhận / nội dung' },
                { key: 'lstu', type: 'date', label: 'Từ ngày' },
                { key: 'lsden', type: 'date', label: 'Đến ngày' },
                { key: 'lstt', type: 'select', label: 'Tất cả trạng thái' }
            ], { search: false, extra:
                '<div class="ums-field ums-field--fit"><label class="ums-check"><input type="checkbox" data-f="cuaToi"> <b>Chỉ lượt gửi của tôi</b></label></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('reload', { attr: { 'data-a': 'tailai2' } }) + '</div>' }) +
            pat.panel({ title: 'Lịch sử đã gửi', icon: 'fa-clock-rotate-left', count: 'n2', flush: true, zone: 'b2',
                body: ui.empty('Chọn tab để xem lịch sử', 'fa-clock-rotate-left') }) +
        '</div>';

    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function nut(a) { return root.querySelector('[data-a="' + a + '"]'); }
    function pane(k) { return root.querySelector('[data-pane="' + k + '"]'); }
    function fieldCua(k) { var el = f(k); return el ? el.closest('.ums-field') : null; }

    /* Ô chọn liệt kê sẵn (không gọi máy chủ) */
    f('nguon').innerHTML =
        '<option value="DOCANBO">Đăng ký do cán bộ thực hiện</option>' +
        '<option value="DANGKY">Tất cả đăng ký</option>' +
        '<option value="RUT">Rút học phần</option>';
        /* ẨN 09/11/2026 (gốc): LICHSU 'Đăng ký / hủy / đổi lịch học phần' — hàm DKH_XuLy/LayKetQuaLichSuDangKyHoc đã bị xoá dưới CSDL */
    pat.fill(f('lstt'), [{ ID: '0', TEN: 'Chưa gửi' }, { ID: '1', TEN: 'Thành công' }, { ID: '2', TEN: 'Gửi lỗi' }], { head: 'Tất cả trạng thái' });
    /* Đếm trên dải tab */
    Array.prototype.forEach.call(root.querySelectorAll('[data-cbtab]'), function (a) {
        a.insertAdjacentHTML('beforeend', ' <span class="ums-badge ums-badge--info ums-badge--plain" data-cbn="' + a.getAttribute('data-cbtab') + '" hidden></span>');
    });
    ui.enhance(root);

    /* ---------- Tiện ích --------------------------------------------------- */
    function pad2(n) { return (n < 10 ? '0' : '') + n; }
    function fmtThoiDiem(ms) {
        var d = new Date(ms);
        return pad2(d.getDate()) + '/' + pad2(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes());
    }
    /* Chữ thuần của HTML máy chủ trả — DOMParser (tài liệu rỗng, không chạy script, không tải ảnh) */
    function htmlToText(s) {
        try {
            var doc = new DOMParser().parseFromString(v(s), 'text/html');
            return (doc.body && doc.body.textContent) ? doc.body.textContent.replace(/\s+\n/g, '\n').trim() : '';
        } catch (ex) { return v(s).replace(/<[^>]*>/g, ' '); }
    }
    /* Dải thông báo trong trang: loai info | warn | bad | ok; noiDung rỗng = xoá; zone mặc định "tb" */
    function thongBao(loai, noiDung, zone) {
        var el = typeof zone === 'object' && zone ? zone : z(zone || 'tb');
        if (!el) return;
        if (!noiDung) { el.innerHTML = ''; return; }
        var icon = { info: 'fa-circle-info', warn: 'fa-triangle-exclamation', bad: 'fa-circle-xmark', ok: 'fa-circle-check' }[loai] || 'fa-circle-info';
        el.innerHTML = '<div class="cbtckt-banner--' + (loai || 'info') + '"><i class="fa-light ' + icon + '"></i><span>' + esc(noiDung).replace(/\n/g, '<br>') + '</span></div>';
    }
    /* Cảnh báo CHẶN thao tác: toast (người đang cuộn giữa bảng dài vẫn thấy) + dải trong trang + cuộn tới dải */
    function canhBao(s) {
        thongBao('warn', s);
        ui.toast(s.split('\n')[0], 'warn');
        try { z('tb').scrollIntoView({ block: 'nearest' }); } catch (ex) { }
    }
    function moTaLoi(err) {
        var ma = (err && err.status) ? err.status : 0, body = v(err && err.message).trim();
        if (body.length > 200) body = body.substring(0, 200) + '...';
        return (ma ? 'lỗi ' + ma : 'mất kết nối') + (body ? ' (' + body + ')' : '');
    }
    function ghiLoiPhu(action, moTa) {
        S.arrLoiPhu = S.arrLoiPhu.filter(function (x) { return x.a !== action; });
        if (moTa) S.arrLoiPhu.push({ a: action, m: moTa });
        capNhatGoiY();
    }
    /* Dải chẩn đoán: API phụ lỗi + lý do khi TOÀN BỘ dòng đều "Chưa xác định" */
    function capNhatGoiY() {
        var a = S.arrLoiPhu.map(function (x) { return x.a + ' — ' + x.m; });
        if (S.bKeHoachDaNap && S.dtAll.length > 0) {
            var dem = {}, kxd = 0, top = '', iTop = 0;
            S.dtAll.forEach(function (r) {
                if (r.DG && r.DG.k === 'KXD') {
                    kxd++; dem[r.DG.ly] = (dem[r.DG.ly] || 0) + 1;
                    if (dem[r.DG.ly] > iTop) { iTop = dem[r.DG.ly]; top = r.DG.ly; }
                }
            });
            if (kxd === S.dtAll.length) a.push('Cột "Đợt chính thức": cả ' + kxd + ' dòng chưa xác định được — ' + top);
        }
        thongBao('warn', a.join(' | '), 'tbphu');
    }
    function layNguon() { var s = f('nguon').value; return (s === 'RUT' || s === 'DANGKY') ? s : 'DOCANBO'; }
    function khoiPhucNguon() {
        try {
            var s = window.localStorage.getItem('cbtckt_nguon_' + uid());
            if (s === 'RUT' || s === 'DANGKY' || s === 'DOCANBO') { f('nguon').value = s; if (window.jQuery) jQuery(f('nguon')).trigger('change.select2'); }
        } catch (ex) { }
    }
    function docDaGui() {
        try { var s = window.localStorage.getItem('cbtckt_dagui_' + uid()); S.objDaGui = s ? JSON.parse(s) : {}; } catch (ex) { S.objDaGui = {}; }
    }
    function luuDaGui() { try { window.localStorage.setItem('cbtckt_dagui_' + uid(), JSON.stringify(S.objDaGui)); } catch (ex) { } }
    function datDem(k, chu) { var b = root.querySelector('[data-cbn="' + k + '"]'); if (!b) return; b.textContent = chu; b.hidden = !chu; }

    /* ---------- Tab ------------------------------------------------------- */
    function chonTab(k) {
        S.tab = k;
        ui.tabsActive(root, k, 'data-cbtab');
        pane('td').hidden = k !== 'td';
        pane('ls').hidden = k !== 'ls';
        nut('gui').hidden = k !== 'td';
        nut('guilai').hidden = k !== 'ls';
        thongBao('', '');
        nhacMau();
        if (k === 'ls') getLS();
    }

    /* ---------- [1] Thay đổi cần gửi ------------------------------------- */
    function doiNguon() {
        var bRut = layNguon() === 'RUT';
        if (fieldCua('kh')) fieldCua('kh').hidden = bRut;   // nguồn rút có Id kế hoạch riêng từng dòng
        S.dtAll = []; S.iPager = 0; S.nguonDL = layNguon(); S.objChon = {}; S.p1.index = 1;
        try { window.localStorage.setItem('cbtckt_nguon_' + uid(), layNguon()); } catch (ex) { }
        getList(true);
    }
    function thamSo(nguon) {
        if (nguon === 'RUT') {
            return { action: 'DKH_RutHocPhan/LayDSRut', method: 'GET', type: 'GET', strTuKhoa: v(f('q').value).trim(),
                strDaoTao_ThoiGianDaoTao_Id: v(f('dot').value), strDaoTao_HeDaoTao_Id: '', strNguoiThucHien_Id: '' };
        }
        var bCanBo = nguon === 'DOCANBO';
        var o = {
            action: bCanBo ? 'DKH_ThongTin2_MH/DSA4BRIFIC8mCjgJLiIFLgIgLwMu' : 'DKH_ThongTin2_MH/DSA4BRIFIC8mCjgJLiIP',
            func: bCanBo ? 'PKG_DANGKYHOC_THONGTIN2.LayDSDangKyHocDoCanBo' : 'pkg_dangkyhoc_thongtin2.LayDSDangKyHoc',
            iM: iM(), method: 'POST',
            strTuKhoa: v(f('q').value).trim(), strDaoTao_ThoiGianDaoTao_Id: v(f('dot').value), strDaoTao_HocPhan_Id: '', strNguoiThucHien_Id: '',
            pageIndex: S.p1.index, pageSize: S.p1.size, strTKB_HinhThucHoc_Id: '', strDangKy_KeHoachDangKy_Id: v(f('kh').value),
            dChiLayCacLopChuaPhanCong: 0, strDaoTao_KhoaDaoTao_Id: '', strDaoTao_ChuongTrinh_Id: '', strDaoTao_HeDaoTao_Id: '', strDaoTao_KhoaQuanLy_Id: '',
            dSoDaDangTuSo: -1, dSoDaDangDenSo: -1, strKieuHoc_Id: ''
        };
        if (!bCanBo) o.strHanhDong_XacNhan_Id = '';
        return o;
    }
    function nguCanh() {
        var sel = f('dot');
        return { strDot: sel.value ? v(sel.options[sel.selectedIndex] && sel.options[sel.selectedIndex].text).trim() : '', strKeHoach_Id: v(f('kh').value) };
    }
    /* Dòng của LayDSDangKyHoc / LayDSDangKyHocDoCanBo (cột như bảng "Chi tiết đăng ký" của màn Lớp học phần) */
    function chuanHoaDangKy(r, nguon, nc) {
        return {
            ID: v(r.ID), NGUON: nguon, MASO: v(r.QLSV_NGUOIHOC_MASO),
            HOTEN: (v(r.QLSV_NGUOIHOC_HODEM) + ' ' + v(r.QLSV_NGUOIHOC_TEN)).trim(), KY: nc.strDot,
            HOCPHAN: v(r.DAOTAO_HOCPHAN_TEN) + (r.DAOTAO_HOCPHAN_MA ? ' (' + r.DAOTAO_HOCPHAN_MA + ')' : ''),
            LOP: v(r.DANGKY_LOPHOCPHAN_TEN) || v(r.DANGKY_LOPHOCPHAN_MA), THOIDIEM: v(r.NGAYTAO_DD_MM_YYYY_HHMMSS), NGUOI: v(r.NGUOITAO_TAIKHOAN),
            HANHDONG: nguon === 'DOCANBO' ? 'Đăng ký (cán bộ)' : 'Đăng ký', KETQUA: v(r.HANHDONG_XACNHAN_TEN),
            PLAN_ID: nc.strKeHoach_Id || v(r.DANGKY_KEHOACHDANGKY_ID)   // đã chọn kế hoạch thì máy chủ lọc đúng kế hoạch đó
        };
    }
    function chuanHoaRut(r, strDot) {
        return {
            ID: v(r.ID), NGUON: 'RUT', MASO: v(r.QLSV_NGUOIHOC_MASO),
            HOTEN: (v(r.QLSV_NGUOIHOC_HODEM) + ' ' + v(r.QLSV_NGUOIHOC_TEN)).trim(), KY: strDot,
            HOCPHAN: v(r.DAOTAO_HOCPHAN_TEN) + (r.DAOTAO_HOCPHAN_MA ? ' (' + r.DAOTAO_HOCPHAN_MA + ')' : ''),
            LOP: v(r.DSLOPHOCPHAN), THOIDIEM: v(r.NGAYRUT_DD_MM_YYYY), NGUOI: v(r.NGUOIRUT_TAIKHOAN),
            HANHDONG: 'Rút học phần', KETQUA: '', PLAN_ID: v(r.DANGKY_KEHOACHDANGKY_ID)
        };
    }
    function getList(bReset) {
        if (bReset) { S.p1.index = 1; S.objChon = {}; }
        var nguon = layNguon(); S.nguonDL = nguon;
        var p = thamSo(nguon), iReq = ++S.iReq, lan = 0;
        thongBao('info', 'Đang tải dữ liệu...');
        z('b1').innerHTML = ui.empty('Đang tải dữ liệu…', 'fa-spinner fa-spin');
        function thu() {
            lan++;
            ums.api.call(p).then(function (r) {
                if (iReq !== S.iReq) return;   // đã đổi nguồn / tìm lại: bỏ kết quả cũ
                var dt = arr(r.data);
                S.iPager = parseInt(r.pager, 10); if (isNaN(S.iPager)) S.iPager = dt.length;
                var nc = nguCanh();
                S.dtAll = dt.map(function (x) { return nguon === 'RUT' ? chuanHoaRut(x, nc.strDot) : chuanHoaDangKy(x, nguon, nc); });
                tinhDanhGiaTatCa();
                thongBao('', '');
                var khongId = S.dtAll.filter(function (x) { return !x.ID; }).length;
                if (khongId > 0) thongBao('warn', khongId + ' dòng không có ID từ máy chủ nên không thể chọn để gửi.'); else nhacMau();
                render();
            }).catch(function (err) {
                if (iReq !== S.iReq) return;
                var ma = (err && err.status) ? err.status : 0;
                // mất kết nối / 404 / 502–504 có thể chỉ là một máy chủ trong cụm chưa sẵn sàng: thử lại một lần (như gốc)
                if (lan === 1 && (ma === 0 || ma === 404 || ma === 502 || ma === 503 || ma === 504)) { setTimeout(function () { if (iReq === S.iReq) thu(); }, 700); return; }
                S.dtAll = []; render();
                thongBao('bad', p.action + ' — ' + moTaLoi(err) + (ma === 404 ? ': máy chủ không tìm thấy API này (chưa triển khai hoặc đang bảo trì).' : '.') +
                    ' Bấm Tải lại để thử lại; nếu vẫn lỗi hãy báo bộ phận kỹ thuật.');
            });
        }
        thu();
    }

    /* ---------- Danh mục: kế hoạch (cửa sổ thời gian) + đợt rút ------------ */
    function getKeHoach() {
        var a = 'DKH_KeHoachDangKy/LayDanhSach';
        ums.api.call({ action: a, method: 'GET', type: 'GET', strTuKhoa: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000, silent: true }).then(function (r) {
            S.dtKeHoach = arr(r.data);
            S.arrCuaSo = S.dtKeHoach.map(tinhCuaSo);
            S.mapCuaSo = {};
            S.arrCuaSo.forEach(function (c) { if (c.id) S.mapCuaSo[c.id] = c; });
            S.bKeHoachDaNap = true;
            ghiLoiPhu(a, '');
            pat.fill(f('kh'), S.dtKeHoach, { name: function (kh) { return v(kh.TENKEHOACH) + (kh.MAKEHOACH ? ' (' + kh.MAKEHOACH + ')' : ''); }, head: 'Tất cả kế hoạch' });
            if (S.dtAll.length > 0) { tinhDanhGiaTatCa(); render(); }
        }).catch(function (err) { ghiLoiPhu(a, moTaLoi(err)); });
    }
    function getDotRut() {
        var a = 'DKH_RutHocPhan/LayDSThoiGianRut';
        ums.api.call({ action: a, method: 'GET', type: 'GET', strNguoiThucHien_Id: '', silent: true }).then(function (r) {
            pat.fill(f('dot'), arr(r.data), { name: 'THOIGIAN', head: 'Tất cả đợt' });
            ghiLoiPhu(a, '');
        }).catch(function (err) { ghiLoiPhu(a, moTaLoi(err)); });
    }
    /* Nhắc cố định: chưa có mẫu email thì chưa gửi được */
    function nhacMau() {
        if (S.bMauDaNap && !S.objMau) thongBao('warn', 'Chưa có mẫu email ' + MA_MAU + '. Bấm "Mẫu email" để tạo mẫu (nội dung + người nhận) trước khi gửi.');
    }

    /* ---------- Gợi ý trong / ngoài đợt chính thức (chép nguyên gốc) -------- */
    function parseNgay(x) {
        var s = v(x).trim(), m = /^(\d{4})(\d{2})(\d{2})$/.exec(s);
        if (m) return { y: +m[1], m: +m[2], d: +m[3] };
        m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(s);
        if (m) return { y: +m[3], m: +m[2], d: +m[1] };
        m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
        if (m) return { y: +m[1], m: +m[2], d: +m[3] };
        return null;
    }
    function toDate(ngay, gio, phut, gioMD, phutMD) {
        var p = parseNgay(ngay); if (!p) return null;
        var g = parseInt(gio, 10), ph = parseInt(phut, 10);
        if (isNaN(g)) { g = gioMD; if (isNaN(ph)) ph = phutMD; } else if (isNaN(ph)) ph = 0;
        return new Date(p.y, p.m - 1, p.d, g, ph, 0);
    }
    function tinhCuaSo(kh) {
        var pick = function (a, b) { return (a !== null && a !== undefined && a !== '') ? a : b; };
        var bd = toDate(kh.NGAYBATDAU, pick(kh.GIODANGKYTRONGNGAYDAU, kh.NGAYBATDAU_GIO), pick(kh.PHUTDANGKYTRONGNGAYDAU, kh.NGAYBATDAU_PHUT), 0, 0);
        var kt = toDate(kh.NGAYKETTHUC, pick(kh.GIOKETTHUCTRONGNGAYCUOI, kh.NGAYKETTHUC_GIO), pick(kh.PHUTKETTHUCTRONGNGAYCUOI, kh.NGAYKETTHUC_PHUT), 23, 59);
        if (kt) kt.setSeconds(59);
        var bdRut = toDate(kh.NGAYBATDAUTINHRUTHOCPHAN, null, null, 0, 0), n = parseInt(kh.SONGAYDUOCPHEPRUTHOCPHAN, 10);
        var ktRut = (bdRut && !isNaN(n) && n > 0) ? new Date(bdRut.getFullYear(), bdRut.getMonth(), bdRut.getDate() + n, 23, 59, 59) : null;
        return { id: v(kh.ID).toLowerCase(), bd: bd, kt: kt, bdRut: bdRut, ktRut: ktRut };
    }
    function layCuaSo(planId) { var s = v(planId).toLowerCase(); return s ? (S.mapCuaSo[s] || null) : null; }
    function tinhDanhGiaTatCa() { S.dtAll.forEach(function (r) { r.DG = danhGia(r); }); }
    /* 'dd/MM/yyyy HH:mm:ss' → { start, end }; chỉ có ngày thì phủ cả ngày */
    function parseThoiDiem(x) {
        var m = /(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/.exec(v(x));
        if (!m) return null;
        var y = +m[3], mo = +m[2] - 1, d = +m[1];
        if (m[4] !== undefined) { var t = new Date(y, mo, d, +m[4], +m[5], m[6] ? +m[6] : 0); return { start: t, end: t }; }
        return { start: new Date(y, mo, d, 0, 0, 0), end: new Date(y, mo, d, 23, 59, 59) };
    }
    function giao(bd, kt, t) { return !!(bd && kt && t.end >= bd && t.start <= kt); }
    /* k: TRONG | NGOAI | KXD; ly: giải thích (tooltip) */
    function danhGia(row) {
        var t = parseThoiDiem(row.THOIDIEM);
        if (!t) return { k: 'KXD', ly: 'Không đọc được thời điểm của thay đổi' };
        if (!S.bKeHoachDaNap || S.arrCuaSo.length === 0) return { k: 'KXD', ly: 'Chưa có dữ liệu thời gian của kế hoạch đăng ký' };
        var w = layCuaSo(row.PLAN_ID);
        if (w) {
            if (giao(w.bd, w.kt, t)) return { k: 'TRONG', ly: 'Nằm trong thời gian đăng ký của kế hoạch' };
            if (giao(w.bdRut, w.ktRut, t)) return { k: 'TRONG', ly: 'Nằm trong thời gian được phép rút của kế hoạch' };
            if (w.bd && w.kt && (row.NGUON !== 'RUT' || (w.bdRut && w.ktRut))) {
                return { k: 'NGOAI', ly: row.NGUON === 'RUT' ? 'Ngoài thời gian đăng ký và thời gian được phép rút của kế hoạch' : 'Ngoài thời gian đăng ký của kế hoạch' };
            }
            return { k: 'KXD', ly: 'Kế hoạch thiếu ngày đăng ký hoặc cửa sổ rút' };
        }
        if (row.NGUON === 'RUT') return { k: 'KXD', ly: 'Không tìm thấy kế hoạch của dòng rút' };
        var coKhoang = false;
        for (var i = 0; i < S.arrCuaSo.length; i++) {
            var c = S.arrCuaSo[i];
            if (!c.bd || !c.kt) continue;
            coKhoang = true;
            if (giao(c.bd, c.kt, t)) return { k: 'TRONG', ly: 'Nằm trong thời gian đăng ký của một kế hoạch' };
        }
        return coKhoang ? { k: 'NGOAI', ly: 'Không nằm trong thời gian đăng ký của kế hoạch nào' } : { k: 'KXD', ly: 'Các kế hoạch thiếu ngày đăng ký' };
    }
    function parseNgayInput(k, cuoiNgay) {
        var p = parseNgay(f(k).value); if (!p) return null;
        return cuoiNgay ? new Date(p.y, p.m - 1, p.d, 23, 59, 59) : new Date(p.y, p.m - 1, p.d, 0, 0, 0);
    }

    /* ---------- Vẽ bảng thay đổi ----------------------------------------- */
    function locLai() { S.p1.index = 1; render(); }
    function render() {
        var bAn = f('anTrong').checked, dTu = parseNgayInput('tu', false), dDen = parseNgayInput('den', true), an = 0;
        S.dt = S.dtAll.filter(function (r) {
            var t = parseThoiDiem(r.THOIDIEM);
            if (t && dTu && t.end < dTu) return false;
            if (t && dDen && t.start > dDen) return false;
            if (bAn && r.DG && r.DG.k === 'TRONG') { an++; return false; }
            return true;
        });
        // dòng bị lọc ẩn thì không còn trong tập sẽ gửi (tránh gửi dòng người dùng không nhìn thấy)
        var hien = {}; S.dt.forEach(function (r) { hien[r.ID] = 1; });
        S.dtAll.forEach(function (r) { if (!hien[r.ID] && S.objChon[r.ID]) delete S.objChon[r.ID]; });
        var tong = String(S.dt.length);
        if (S.nguonDL !== 'RUT' && S.iPager > S.dtAll.length) tong += '/' + S.iPager;
        if (an > 0) tong += ' (ẩn ' + an + ')';
        datDem('td', tong);
        z('n1').textContent = '(' + tong + ')';
        veBang();
        capNhatGoiY();
    }
    function nhanDG(dg) {
        dg = dg || { k: 'KXD', ly: '' };
        var o = { NGOAI: ['bad', 'Ngoài đợt'], TRONG: ['ok', 'Trong đợt'], KXD: ['mute', 'Chưa xác định'] }[dg.k] || ['mute', 'Chưa xác định'];
        return '<span title="' + esc(dg.ly) + '">' + ui.badge(o[1], o[0]) + '</span>';
    }
    /* Vẽ đúng một trang: nguồn rút cắt từ danh sách đã lọc; nguồn đăng ký đã được máy chủ cắt sẵn */
    function veBang() {
        var bClient = S.nguonDL === 'RUT', total = bClient ? S.dt.length : S.iPager, rows = S.dt;
        if (bClient) {
            if ((S.p1.index - 1) * S.p1.size >= total) S.p1.index = 1;
            rows = S.dt.slice((S.p1.index - 1) * S.p1.size, S.p1.index * S.p1.size);
        }
        S.mapTrang = {};
        rows.forEach(function (r) { S.mapTrang[r.ID] = r; });
        ui.table({
            el: z('b1'), rows: rows, empty: 'Không tìm thấy dữ liệu!',
            columns: [
                { title: 'Mã số', prop: 'MASO', cls: 'is-nowrap' },
                { title: 'Họ tên', prop: 'HOTEN', cls: 'is-nowrap' },
                { title: 'Kỳ', prop: 'KY' },
                { title: 'Học phần', prop: 'HOCPHAN' },
                { title: 'Lớp học phần', prop: 'LOP' },
                { title: 'Thời điểm', prop: 'THOIDIEM', cls: 'is-center is-nowrap' },
                { title: 'Người thực hiện', prop: 'NGUOI', cls: 'is-nowrap' },
                { title: 'Hành động', prop: 'HANHDONG', cls: 'is-nowrap' },
                { title: 'Kết quả', prop: 'KETQUA' },
                { title: 'Đợt chính thức', cls: 'is-center', render: function (r) { return nhanDG(r.DG); } },
                { title: 'Đã gửi (máy này)', cls: 'is-center is-nowrap', render: function (r) {
                    var ms = S.objDaGui[r.ID];
                    return ms ? '<span title="Đã gửi từ máy này lúc ' + esc(fmtThoiDiem(ms)) + '">' + ui.badge(fmtThoiDiem(ms), 'info') + '</span>' : '';
                } },
                { head: '<input type="checkbox" data-cball title="Chọn cả trang">', cls: 'is-center is-actions', width: '50px', render: function (r) {
                    return '<input type="checkbox" data-cbck="' + esc(r.ID) + '"' + (r.ID ? '' : ' disabled') + (S.objChon[r.ID] ? ' checked' : '') + '>';
                } }
            ],
            page: { index: S.p1.index, size: S.p1.size, total: total,
                onChange: function (p) {
                    if (p < 1 || p > Math.max(1, Math.ceil(total / S.p1.size))) return;
                    S.p1.index = p;
                    if (bClient) veBang(); else getList(false);
                },
                onSize: function (n) { S.p1.size = n; S.p1.index = 1; if (bClient) veBang(); else getList(false); } }
        });
        capNhatChonBar();
    }
    function capNhatChonBar() {
        var chon = Object.keys(S.objChon).length, bClient = S.nguonDL === 'RUT', tong = bClient ? S.dt.length : 0;
        z('dachon').textContent = (S.dt.length > 0 || chon > 0) ? 'Đã chọn ' + chon + ' dòng' : '';
        z('chonhet').textContent = 'Chọn tất cả ' + tong + ' dòng đã lọc';
        nut('chonhet').hidden = !(bClient && tong > 0 && chon < tong);
        nut('bochon').hidden = !(chon > 0);
        var ds = Array.prototype.slice.call(z('b1').querySelectorAll('input[data-cbck]:not(:disabled)')), all = z('b1').querySelector('[data-cball]');
        if (all) all.checked = ds.length > 0 && ds.every(function (x) { return x.checked; });
    }

    /* ---------- Gửi cho TC-KT (mỗi thay đổi = 1 lời gọi gửi theo mẫu, form tiến trình chung) ---------- */
    /* Địa chỉ email hợp lệ trong "Danh sách email nhận" (cách nhau ; , xuống dòng, khoảng trắng; \x04 là ký tự máy chủ dùng thay '@') */
    function layEmailNhan() {
        var ds = v(S.objMau ? S.objMau.DANHSACHNHANEMAIL : '').replace(/\x04/g, '@');
        var kq = ds.match(/[A-Za-z0-9._%+\-]+@[A-Za-z0-9\-]+(?:\.[A-Za-z0-9\-]+)*\.[A-Za-z]{2,}/g) || [], da = {}, a = [];
        kq.forEach(function (e) { var k = e.toLowerCase(); if (!da[k]) { da[k] = 1; a.push(e); } });
        return a;
    }
    function kiemTraTruocGui() {
        var loi = [];
        if (!S.objMau) loi.push('Chưa có mẫu email ' + MA_MAU + ' — bấm "Mẫu email" để tạo mẫu (nội dung + người nhận).');
        else {
            if (!v(S.objMau.TIEUDE).trim()) loi.push('Mẫu email chưa có tiêu đề.');
            if (!htmlToText(S.objMau.NOIDUNG).trim()) loi.push('Mẫu email chưa có nội dung.');
            if (layEmailNhan().length === 0) loi.push('Mẫu email chưa có email người nhận hợp lệ (ô "Danh sách email nhận" đang trống hoặc sai định dạng).');
        }
        return loi;
    }
    function guiTCKT() {
        if (S.bDangKiemTra) return;
        var ds = Object.keys(S.objChon).map(function (id) { return S.objChon[id]; }).filter(function (r) { return !!r.ID; });
        if (!ds.length) { canhBao('Chưa chọn thay đổi nào để gửi.\nVui lòng tick chọn ít nhất một dòng trong bảng rồi bấm "Gửi cho TC-KT".'); return; }
        // kiểm tra mẫu + người nhận MỚI NHẤT trên máy chủ (mẫu có thể vừa bị người khác sửa / xoá) rồi mới gửi
        S.bDangKiemTra = true;
        thongBao('info', 'Đang kiểm tra mẫu email và người nhận trước khi gửi...');
        getMau().then(function () {
            S.bDangKiemTra = false;
            var loi = kiemTraTruocGui();
            if (loi.length) { canhBao('Chưa gửi được — cần xử lý trước:\n- ' + loi.join('\n- ')); return; }
            thongBao('', '');
            moFormGui(ds);
        }, function (err) { S.bDangKiemTra = false; canhBao('Chưa gửi — không kiểm tra được mẫu email:\n' + moTaLoi(err)); });
    }
    function moFormGui(ds) {
        var nhan = layEmailNhan(), ngoai = 0, trong = 0, kxd = 0, notes = [], thanhCong = [];
        ds.forEach(function (r) { var k = r.DG ? r.DG.k : 'KXD'; if (k === 'NGOAI') ngoai++; else if (k === 'TRONG') trong++; else kxd++; });
        if (trong > 0) notes.push(trong + ' thay đổi được chọn nằm trong thời gian đăng ký/rút chính thức (thường không cần cảnh báo).');
        var daGui = ds.filter(function (r) { return !!S.objDaGui[r.ID]; }).length;
        if (daGui > 0) notes.push(daGui + ' thay đổi đã gửi từ máy này trước đó — gửi tiếp sẽ tạo thêm email.');
        if (ds.length > 100) notes.push('Mỗi thay đổi gửi thành 1 email riêng: Phòng TC-KT sẽ nhận ' + ds.length + ' email.');
        var sel = f('nguon');
        ums.process.run({
            title: TIEU_DE,
            subTitles: ['Mẫu email: ' + MA_MAU, 'Người nhận: ' + nhan.join(', '),
                'Đã kiểm tra: mẫu email hợp lệ, ' + nhan.length + ' người nhận; ' + ds.length + ' thay đổi (' + ngoai + ' ngoài đợt · ' + kxd + ' chưa xác định · ' + trong + ' trong đợt)',
                'Nguồn: ' + v(sel.options[sel.selectedIndex] && sel.options[sel.selectedIndex].text)],
            unit: 'thay đổi', items: ds,
            columns: [
                { header: 'Mã số', render: function (it) { return it.MASO; } },
                { header: 'Họ tên', render: function (it) { return it.HOTEN; } },
                { header: 'Học phần', render: function (it) { return it.HOCPHAN; } },
                { header: 'Thời điểm', render: function (it) { return it.THOIDIEM; } }
            ],
            // run (không dùng request) để đánh dấu "đã gửi" ngay khi máy chủ báo thành công
            run: function (it) {
                return ums.api.call({ action: 'CMS_TienIch/ThucHienGuiEmailTheoCauTruc', method: 'GET', type: 'GET', silent: true,
                    strCauTrucGuiEmailId: MA_MAU, strDuLieuId: it.ID, strNguoiTao_Id: uid() }).then(function (r) {
                    S.objDaGui[it.ID] = Date.now(); thanhCong.push(it.ID);
                    return { ok: true, message: (r && r.message) || '' };
                });
            },
            okMessage: 'Đã yêu cầu gửi email — xem kết quả ở tab Lịch sử đã gửi',
            notes: notes, fileName: 'KetQuaGuiCanhBaoTCKT',
            refresh: function () {
                luuDaGui();
                thanhCong.forEach(function (id) { delete S.objChon[id]; });   // dòng gửi xong bỏ đánh dấu, dòng lỗi giữ để gửi lại
                veBang();
                S.p2.index = 1;
            }
        });
    }

    /* ---------- [2] Mẫu email ---------------------------------------------- */
    function getMau() {
        var p = { action: 'CMS_TienIch/LayDS_CauTrucNoiDungGuiEmail', method: 'GET', versionAPI: 'v1.0', strTuKhoa: MA_MAU, strNguoiTao_Id: '', pageIndex: 1, pageSize: 1000, silent: true };
        return ums.api.call(p).then(function (r) {
            var dt = arr(r.data);
            S.objMau = null;
            for (var i = 0; i < dt.length; i++) if (v(dt[i].MA).toLowerCase() === MA_MAU.toLowerCase()) { S.objMau = dt[i]; break; }
            S.bMauDaNap = true;
            nhacMau();
            return S.objMau;
        }, function (err) { thongBao('bad', p.action + ' — ' + moTaLoi(err)); throw err; });
    }
    function moMau() {
        var m = S.objMau, ed = null;
        var body =
            '<div class="ums-u-fz13 ums-u-muted ums-u-mb-4">Mã mẫu: ' + ui.badge(MA_MAU, 'info') + '</div>' +
            '<div class="cbtckt-banner" data-m="tb"></div>' +
            ui.field('Tên email hiển thị', '<input class="ums-input" data-m="ten" autocomplete="off">') +
            ui.field('Tiêu đề', '<input class="ums-input" data-m="tieude" autocomplete="off">', { required: true }) +
            ui.field('Nội dung', '<textarea class="ums-textarea" data-m="noidung" rows="10"></textarea>',
                { hint: 'Các biến có thể chèn vào nội dung do máy chủ quy định cho mẫu này (hỏi bộ phận kỹ thuật nếu cần thêm thông tin sinh viên/học phần vào email).' }) +
            ui.field('Danh sách email nhận', '<textarea class="ums-textarea" data-m="ds" rows="4" placeholder="Email Phòng TC-KT — nhập đúng định dạng như màn Cấu trúc nội dung gửi email đang dùng"></textarea>', { required: true }) +
            ui.field('Ghi chú', '<input class="ums-input" data-m="ghichu" autocomplete="off">');
        var ft = pat.formTrang({
            host: root, title: 'Mẫu email cảnh báo TC-KT', icon: 'fa-file-lines', cols: 1, body: body,
            buttons: [{ text: 'Lưu mẫu', kind: 'save', keepOpen: true, onClick: function () { saveMau(); return false; } }],
            onClose: function () { if (ed) { try { ed.destroy(); } catch (ex) { } } }
        });
        var B = ft.body;
        function mo(k) { return B.querySelector('[data-m="' + k + '"]'); }
        function ghi(k, val) { mo(k).value = v(val); }
        if (m) {
            ghi('ten', m.TENEMAILHIENTHI); ghi('tieude', m.TIEUDE); ghi('ds', m.DANHSACHNHANEMAIL); ghi('ghichu', m.GHICHU); ghi('noidung', m.NOIDUNG);
        } else {
            // chưa có mẫu: điền sẵn nội dung gợi ý (chưa lưu cho tới khi bấm "Lưu mẫu")
            ghi('ten', 'Hệ thống Quản lý đào tạo');
            ghi('tieude', '[CẢNH BÁO] Thay đổi đăng ký/rút học phần ngoài thời gian chính thức');
            ghi('ds', ''); ghi('ghichu', 'Tạo từ trang Gửi cảnh báo TC-KT');
            ghi('noidung', '<p>Kính gửi Phòng Tài chính - Kế toán,</p>' +
                '<p>Hệ thống ghi nhận có thay đổi đăng ký/rút học phần của sinh viên diễn ra ngoài khoảng thời gian đăng ký/rút chính thức của đợt.</p>' +
                '<p>Đề nghị Phòng kiểm tra trước khi thực hiện các nghiệp vụ liên quan đến học phí, hóa đơn và thuế.</p><p>Trân trọng.</p>');
            thongBao('info', 'Mẫu chưa tồn tại — nhập email người nhận rồi bấm "Lưu mẫu" để tạo.', mo('tb'));
        }
        ums.editor.tao(mo('noidung'), { cao: 220 }).then(function (e) { if (ft.closed) { try { e.destroy(); } catch (ex) { } return; } ed = e; }).catch(function () { });
        function noiDung() { return ed ? ed.get() : mo('noidung').value; }

        function saveMau() {
            var tieuDe = v(mo('tieude').value).trim(), nhan = v(mo('ds').value).trim();
            if (!tieuDe) { thongBao('warn', 'Vui lòng nhập tiêu đề email.', mo('tb')); ui.toast('Vui lòng nhập tiêu đề email.', 'warn'); return; }
            if (!nhan) { thongBao('warn', 'Vui lòng nhập email người nhận (Phòng TC-KT).', mo('tb')); ui.toast('Vui lòng nhập email người nhận (Phòng TC-KT).', 'warn'); return; }
            var bSua = !!(S.objMau && S.objMau.ID);
            var p = { action: bSua ? 'CMS_TienIch/Sua_CauTrucNoiDungGuiEmail' : 'CMS_TienIch/Them_CauTrucNoiDungGuiEmail', method: 'POST', versionAPI: 'v1.0',
                strId: bSua ? S.objMau.ID : '', strMa: MA_MAU, strTenEmailHienThi: v(mo('ten').value).trim(), strTieuDe: tieuDe,
                strNoiDung: noiDung(), strDanhSachNhanEmail: nhan, strGhiChu: v(mo('ghichu').value).trim(), strNguoiThucHien_Id: '' };
            ums.api.call(p).then(function () {
                ui.toast(bSua ? 'Đã cập nhật mẫu email.' : 'Đã tạo mẫu email.', 'ok');
                thongBao('ok', bSua ? 'Đã cập nhật mẫu email.' : 'Đã tạo mẫu email.', mo('tb'));
                getMau().then(function () { thongBao('', ''); }).catch(function () { });
            }).catch(function (err) { thongBao('bad', p.action + ': ' + moTaLoi(err), mo('tb')); ums.api.handle(err, 'mẫu email'); });
        }
    }

    /* ---------- [3] Lịch sử đã gửi ----------------------------------------- */
    function getLS(bReset) {
        if (bReset) S.p2.index = 1;
        if (S.bMauDaNap && !S.objMau) { S.dtLS = []; datDem('ls', '0'); veLS([], 0); return; }
        var p = { action: 'CMS_TienIch/LayDS_TienTrinhGuiEmail', method: 'GET', versionAPI: 'v1.0',
            strTuKhoa: v(f('lsq').value).trim(), strNguoiTao_Id: f('cuaToi').checked ? uid() : '', strTuNgay: v(f('lstu').value), strDenNgay: v(f('lsden').value),
            strDaGui: v(f('lstt').value), strCauTrucNoiDungGuiEmailId: S.objMau ? S.objMau.ID : '', pageIndex: S.p2.index, pageSize: S.p2.size };
        var iReq = ++S.iReqLS;
        z('b2').innerHTML = ui.empty('Đang tải dữ liệu…', 'fa-spinner fa-spin');
        ums.api.call(p).then(function (r) {
            if (iReq !== S.iReqLS) return;
            S.dtLS = arr(r.data);
            var pager = parseInt(r.pager, 10); if (isNaN(pager)) pager = S.dtLS.length;
            datDem('ls', String(pager));
            veLS(S.dtLS, pager);
        }).catch(function (err) {
            if (iReq !== S.iReqLS) return;
            z('b2').innerHTML = ui.fail(err.message, 'data-a="tailai2"');
            thongBao('bad', p.action + ' — ' + moTaLoi(err));
        });
    }
    /* Người gửi: máy chủ có thể đặt tên trường khác nhau — lấy trường đầu tiên có giá trị */
    function nguoiGui(a) {
        var fs = ['NGUOITAO_TAIKHOAN', 'NGUOITAO_TENDAYDU', 'NGUOITHUCHIEN_TAIKHOAN', 'NGUOITAO_HOTEN', 'NGUOITAO'];
        for (var i = 0; i < fs.length; i++) if (v(a[fs[i]]) !== '') return v(a[fs[i]]);
        return '';
    }
    function tenTrangThai(a) {
        if (a.DAGUI == '1') return 'Thành công';
        if (a.DAGUI == '0') return 'Chưa gửi';
        if (a.DAGUI == '2') return 'Gửi lỗi' + (a.LOIGUIMAIL ? ': ' + v(a.LOIGUIMAIL) : '');
        return v(a.DAGUI);
    }
    function nhanTT(a) { return ui.badge(tenTrangThai(a), a.DAGUI == '1' ? 'ok' : a.DAGUI == '2' ? 'bad' : 'mute'); }
    function veLS(rows, total) {
        z('n2').textContent = '(' + total + ')';
        ui.table({
            el: z('b2'), rows: rows, empty: 'Không tìm thấy dữ liệu!',
            columns: [
                { title: 'Gửi tới', render: function (a) { return esc(v(a.MAILTO).replace(/\x04/g, '@')); } },
                { title: 'Nội dung', render: function (a) { var s = htmlToText(a.NOIDUNGEMAIL).replace(/\s+/g, ' '); return '<span class="cbtckt-nd" title="' + esc(s) + '">' + esc(s) + '</span>'; } },
                { title: 'Ngày gửi', prop: 'NGAYGUI', cls: 'is-center is-nowrap' },
                { title: 'Trạng thái', cls: 'is-center', render: nhanTT },
                { title: 'Người gửi', render: function (a) { return esc(nguoiGui(a)); }, cls: 'is-nowrap' },
                { title: 'Xem', cls: 'is-center is-actions', width: '60px', render: function (a) { return ui.iconBtn('view', a.ID); } },
                { head: '<input type="checkbox" data-lsall title="Chọn cả trang">', cls: 'is-center is-actions', width: '50px', render: function (a) { return '<input type="checkbox" data-lsck="' + esc(a.ID) + '">'; } }
            ],
            page: { index: S.p2.index, size: S.p2.size, total: total,
                onChange: function (p) { if (p < 1 || p > Math.max(1, Math.ceil(total / S.p2.size))) return; S.p2.index = p; getLS(false); },
                onSize: function (n) { S.p2.size = n; S.p2.index = 1; getLS(false); } }
        });
    }
    function xemChiTiet(id) {
        var a = null;
        for (var i = 0; i < S.dtLS.length; i++) if (v(S.dtLS[i].ID) === v(id)) { a = S.dtLS[i]; break; }
        if (!a) { ui.toast('Không tìm thấy email đã chọn.', 'warn'); return; }
        function kv(nhan, html, dam) { return '<div class="ums-kv' + (dam ? ' ums-kv--dam' : '') + '"><span>' + esc(nhan) + '</span><b>' + html + '</b></div>'; }
        pat.formTrang({
            host: root, title: 'Chi tiết email', icon: 'fa-envelope-open', cols: 1,
            body: kv('Gửi tới', esc(v(a.MAILTO).replace(/\x04/g, '@')), true) + kv('Tiêu đề', esc(a.MAILSUBJECT)) + kv('Ngày gửi', esc(a.NGAYGUI)) +
                kv('Trạng thái', nhanTT(a)) + kv('Nội dung', '<span class="cbtckt-view">' + esc(htmlToText(a.NOIDUNGEMAIL)) + '</span>')
        });
    }
    function guiLai() {
        var ids = Array.prototype.map.call(z('b2').querySelectorAll('input[data-lsck]:checked'), function (x) { return x.getAttribute('data-lsck'); });
        if (!ids.length) { canhBao('Chưa chọn email nào để gửi lại.\nVui lòng tick chọn ít nhất một dòng ở bảng lịch sử rồi bấm "Gửi lại mục đã chọn".'); return; }
        thongBao('', '');
        ums.process.runJob({
            title: 'Gửi lại email cảnh báo TC-KT', what: 'Gửi lại ' + ids.length + ' email đã chọn', unit: 'yêu cầu',
            request: function () {
                return { action: 'CMS_TienIch/ThucHienGuiEmail', method: 'GET', type: 'GET', versionAPI: 'v1.0',
                    ArrstrId: ids.join(','), strHanhDong: 'GUILAI', strNguoiThucHien_Id: '' };
            },
            okMessage: 'Đã yêu cầu gửi lại — tải lại danh sách để xem trạng thái mới', fileName: 'KetQuaGuiLaiEmailTCKT',
            refresh: function () { getLS(); }
        });
    }

    /* ---------- Sự kiện ----------------------------------------------------- */
    root.addEventListener('click', function (ev) {
        var t = ev.target.closest('[data-cbtab], [data-a], [data-act="view"]');
        if (!t || !root.contains(t) || t.closest('.ums-formtrang')) return;
        if (t.hasAttribute('data-cbtab')) { ev.preventDefault(); chonTab(t.getAttribute('data-cbtab')); return; }
        if (t.getAttribute('data-act') === 'view') { xemChiTiet(t.getAttribute('data-id')); return; }
        var a = t.getAttribute('data-a');
        if (a === 'mau') moMau();
        else if (a === 'gui') guiTCKT();
        else if (a === 'guilai') guiLai();
        else if (a === 'tailai1') getList(true);
        else if (a === 'tailai2') getLS(true);
        else if (a === 'chonhet') { S.dt.forEach(function (r) { if (r.ID) S.objChon[r.ID] = r; }); veBang(); }
        else if (a === 'bochon') { S.objChon = {}; veBang(); }
    });
    root.addEventListener('change', function (ev) {
        var el = ev.target;
        if (!root.contains(el) || el.closest('.ums-formtrang')) return;
        if (el.hasAttribute('data-cbck')) {
            var id = el.getAttribute('data-cbck'), r = S.mapTrang[id];
            if (r) { if (el.checked) S.objChon[id] = r; else delete S.objChon[id]; }
            capNhatChonBar(); return;
        }
        if (el.hasAttribute('data-cball')) {   // ô đầu bảng = chọn cả TRANG đang xem
            Array.prototype.forEach.call(z('b1').querySelectorAll('input[data-cbck]:not(:disabled)'), function (x) {
                x.checked = el.checked;
                var rr = S.mapTrang[x.getAttribute('data-cbck')];
                if (rr) { if (el.checked) S.objChon[rr.ID] = rr; else delete S.objChon[rr.ID]; }
            });
            capNhatChonBar(); return;
        }
        if (el.hasAttribute('data-lsall')) {
            Array.prototype.forEach.call(z('b2').querySelectorAll('input[data-lsck]'), function (x) { x.checked = el.checked; });
            return;
        }
        var k = el.getAttribute('data-f');
        if (!k) return;
        if (k === 'nguon') doiNguon();
        else if (k === 'dot' || k === 'kh') getList(true);
        else if (k === 'tu' || k === 'den' || k === 'anTrong') locLai();   // lọc ở trình duyệt, không hỏi lại máy chủ
        else if (k === 'lstu' || k === 'lsden' || k === 'lstt' || k === 'cuaToi') getLS(true);
    });
    root.addEventListener('input', function (ev) {
        var el = ev.target, k = el.getAttribute && el.getAttribute('data-f');
        if (k === 'q') { clearTimeout(S.tim1); S.tim1 = setTimeout(function () { getList(true); }, 400); }
        else if (k === 'lsq') { clearTimeout(S.tim2); S.tim2 = setTimeout(function () { getLS(true); }, 400); }
    });
    root.addEventListener('keydown', function (ev) {
        var k = ev.target.getAttribute && ev.target.getAttribute('data-f');
        if (ev.key !== 'Enter' || (k !== 'q' && k !== 'lsq')) return;
        ev.preventDefault();
        if (k === 'q') { clearTimeout(S.tim1); getList(true); } else { clearTimeout(S.tim2); getLS(true); }
    });

    /* ---------- Khởi động (init của gốc) ----------------------------------- */
    docDaGui();
    getMau().catch(function () { });
    getKeHoach();
    getDotRut();
    khoiPhucNguon();
    doiNguon();
})();
