/* =========================================================================
   Lịch giảng nhiều giảng viên — giảng viên × 7 ngày × 3 buổi
   Bản gốc: ApisCongCanBo/Modules/lichgiang/html/lichgiangnhieuphonghocgiangvien.html + script/lichgiangnhieuphonghocgiangvien.js
   Khung lưới / lịch tháng / chi tiết / xuất Excel: _nhieu.js (ums.lg.nhieu).
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên):
       NS_HoSo_V2_MH · pkg_nhansu_hoso_v2.LayDanhSachToanBo      ô Khoa/đơn vị (ums.ref.coCauToChuc)
       NS_HoSo_V2_MH · pkg_nhansu_hoso_v2.LayDSNhanSu_HoSo_v2   hai ô giảng viên + danh sách dòng
                                                                (dLaCanBoNgoaiTruong −1, pageSize 1000000, strTinhTrangNhanSu_Id
                                                                = ô Tình trạng — ums.ref.nhanSu)
       CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM · NS.TTNS   ô Tình trạng nhân sự (ums.ref.dm — gốc loadToCombo_DanhMucDuLieu)
       NS_ThongTinCanBo/LayDSLichGiang (GET)                     lịch tuần — MỖI GIẢNG VIÊN một lời gọi, 30 người / trang;
                                                                bận / rỗi: mỗi giảng viên MỘT lời gọi cho cả khoảng ngày, 6 cùng lúc, nhớ 5 phút
   Buổi chỉ theo TIETBATDAU: 1-6 / 7-10 / 11-15 (buổi không có tiết không hiện —
   như gốc). Hiệu suất tính CẢ Chủ nhật (mẫu số 7 ngày) — như gốc.

   Kéo gốc lần 12/13 (7/11 — diff ab5b4f19 → b2cd522d1, +564 html / +797 js) — đã chuyển:
     · Ô "Tình trạng nhân sự" (danh mục NS.TTNS) sau ô Khoa/đơn vị, mặc định mục "Đang làm việc / Đang công tác" (không có
       thì Tất cả) → mọi lượt lấy giảng viên truyền strTinhTrangNhanSu_Id; danh mục lỗi thì vẫn nạp giảng viên không lọc.
       Lưới tuần đầu tiên có thể nạp trước khi có danh mục → nạp lại khi có mặc định (như gốc).
     · "Tra bận / rỗi theo ngày" — thanh ngay trên lưới (cờ truocLuoi của khung): Từ ngày / Đến ngày (trống = 1 ngày),
       nút "Tuần đang xem", Thứ (lọc trong khoảng; không nhập ngày mà chọn thứ = thứ đó của tuần đang xem), Buổi / tiết.
       Phạm vi = đúng bộ lọc đang chọn (bắt chọn khoa/đơn vị hoặc giảng viên). Khoảng tối đa 186 ngày, bảng tối đa 31 cột
       ngày (quá thì cảnh báo). Bận = có lịch chạm khung tiết; Rỗi = không. Kết quả THAY lưới (veThay) + dòng tóm tắt
       (N.thanh) với chip Tất cả / Chỉ rỗi / Chỉ bận, nút Xuất Excel, Về lịch tuần. Một ngày: 3 cột buổi (buổi trong khung
       tô xanh); nhiều ngày: mỗi ngày một cột, chỉ hiện lịch trong khung. Bấm thẻ lịch → hộp chi tiết của khung (N.chiTiet).
       Xem tuần / đổi tuần / đổi bộ lọc → đóng bảng bận/rỗi (như gốc getList_TuanHienTai).
     · Xuất Excel bận/rỗi: mỗi ngày 5 ô mô-đun 3 tiết (T1-3 / T4-6 / T7-9 / T10-12 / T13-15), lịch kéo qua hai mô-đun cùng
       buổi thì gộp ô, ô trống ghi "T4-6 · Trống"; cột Trạng thái tô màu; file chỉ gồm chip đang lọc (như gốc).
     · Nút Xuất Excel của lưới tuần: theo mô-đun 3 tiết (gốc exportToExcel_Module, góp ý Phenikaa) — cờ xuat.module của khung.
   Khác gốc (lần 13):
     · Ô "Chọn nhiều giảng viên": gốc thay select2 bằng bảng ô tích tự dựng (chip + tìm + Chọn tất cả / Bỏ chọn hết / Xong)
       vì select2 4.0.3 đóng sau mỗi lần chọn. Ở đây GIỮ ô chọn nhiều của tầng chung: đã giữ danh sách mở khi tích
       (closeOnSelect false), gõ tìm tiếp được, tóm tắt một dòng, có nút xoá hết — đúng ý gốc, một kiểu ô chọn cho cả hệ.
       Cố ý bỏ "Chọn tất cả (kết quả lọc)" — "Xem tất cả lịch giảng" đã xem cả đơn vị.
     · Excel bận/rỗi: mỗi ngày 5 cột mô-đun trên MỘT dòng (gốc: 3 cột buổi × 2 dòng, Tối gộp 2 dòng). Excel lưới tuần qua
       khung: mỗi ngày một cột, mỗi mô-đun một dòng (gốc: 3 cột × 2 dòng) — cùng thông tin, khác hướng bảng.
     · Bận/rỗi dùng lại danh sách giảng viên đã nhớ theo đơn vị + tình trạng (gốc gọi lại getList_CanBo mỗi lần tra).
     · Về lịch tuần nạp lại tuần đang xem (gốc chỉ hiện lại lưới cũ) — khung đã huỷ lượt nạp khi tra.
   Cố ý bỏ (lần 13): vá cuộn select2 4.0.3 (select2:close gỡ scroll.select2) — lỗi vỏ cũ; console.log; nút Xong / bấm ra ngoài
     của bảng ô tích (không còn bảng đó).

   Không chép (lỗi rõ của bản gốc):
     · Buổi dạy chung nhiều giảng viên: hộp chi tiết lấy bản ghi ĐẦU TIÊN cùng ID
       nên có khi hiện nhầm tên giảng viên của dòng khác. Ở đây lấy đúng dòng đã bấm.
     · Buổi thiếu tiết vẫn in "(Tundefined-undefined)".
     · Mỗi lượt nạp tuần lại gọi lại toàn bộ danh sách nhân sự (pageSize 1000000);
       ở đây nhớ theo đơn vị + tình trạng.
     · getList_NhanSu lỗi thì lưới quay mãi — ở đây hiện lỗi.
   Giữ như bản gốc (chờ nghiệp vụ):
     · Buổi 7-10 / 11-15 và tính Chủ nhật — màn "Lịch giảng đường" lại chia
       7-12 / 13-15 và bỏ Chủ nhật. Hai màn đang lệch nhau (bảng bận/rỗi một ngày cũng chia 1-6 / 7-10 / 11-15 như gốc,
       còn Excel mô-đun chia 1-6 / 7-12 / 13-15 như gốc).
     · Khoa/đơn vị → giảng viên KHÔNG khoá: để trống = "Tất cả khoa/đơn vị".
       Đổi đơn vị / tình trạng vẫn nạp lại và xoá trắng hai ô giảng viên.
     · "Xem tất cả lịch giảng" = mọi nhân sự của đơn vị (30 người một lần nạp),
       xuất "Tất cả giảng viên" gọi một lượt cho MỖI người — có thể hàng nghìn lời gọi.
     · Chọn ở ô nhiều giảng viên thì xoá ô một giảng viên (hai ô loại trừ nhau).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, lg = ums.lg;
    var root = document.getElementById('lg-lichgiangnhieuphonghocgiangvien');
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function ten(r) { return (e(r.HODEM) + ' ' + e(r.TEN)).trim() || e(r.TENGIANGVIEN); }
    function tenMa(r) { return ten(r) + ' - ' + e(r.MASO); }
    function donVi(r) { return e(r.DAOTAO_COCAUTOCHUC_TEN) || e(r.COCAUTOCHUC_TEN); }
    function dmy(d) { return ums.lich.dmy(d); }
    function parse(s) { var p = String(s || '').split('/'); return p.length === 3 ? new Date(+p[2], +p[1] - 1, +p[0]) : null; }
    var THU = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    function thuCua(s) { var d = parse(s); return d ? THU[d.getDay()] : ''; }

    var CHE_DO = [
        { v: 'days', ten: 'Tính theo ngày có lịch dạy (mặc định)', nhan: 'Theo ngày' },
        { v: 'periods', ten: 'Tính theo tiết dạy', nhan: 'Theo tiết', tu: 1, den: 15 },
        { v: 'morning', ten: 'Tính theo buổi sáng (T1-6)', nhan: 'Buổi sáng', tu: 1, den: 6 },
        { v: 'afternoon', ten: 'Tính theo buổi chiều (T7-10)', nhan: 'Buổi chiều', tu: 7, den: 10 },
        { v: 'evening', ten: 'Tính theo buổi tối (T11-15)', nhan: 'Buổi tối', tu: 11, den: 15 },
        { v: 'morning-afternoon', ten: 'Tính theo sáng + chiều (T1-10)', nhan: 'Sáng + Chiều', tu: 1, den: 10 },
        { v: 'afternoon-evening', ten: 'Tính theo chiều + tối (T7-15)', nhan: 'Chiều + Tối', tu: 7, den: 15 },
        { v: 'all-sessions', ten: 'Tính theo cả 3 buổi (T1-15)', nhan: 'Cả 3 buổi', tu: 1, den: 15 }
    ];
    function tietCua(r) { return { batDau: r.TIETBATDAU, ketThuc: r.TIETKETTHUC }; }
    function caCua(r) {
        var t = +r.TIETBATDAU;
        if (t >= 1 && t <= 6) return 0; if (t >= 7 && t <= 10) return 1; if (t >= 11 && t <= 15) return 2;
        return -1;
    }
    function tietChu(r) { return r.TIETBATDAU ? 'T' + e(r.TIETBATDAU) + '-' + e(r.TIETKETTHUC) : ''; }
    /* getKhoangTiet của gốc: null nếu không có tiết bắt đầu; thiếu tiết kết thúc = tiết bắt đầu */
    function khoangTiet(r) {
        var tu = parseInt(r.TIETBATDAU, 10), den = parseInt(r.TIETKETTHUC, 10);
        if (isNaN(tu)) return null;
        if (isNaN(den) || den < tu) den = tu;
        return { tu: tu, den: den };
    }
    /* Mô-đun 3 tiết cho file Excel (gốc arrBuoiModule): Sáng T1-3 / T4-6 · Chiều T7-9 / T10-12 · Tối T13-15 */
    var MODULE = [
        { tu: 1, den: 3, ca: 0, tenBuoi: 'Sáng' }, { tu: 4, den: 6, ca: 0, tenBuoi: 'Sáng' },
        { tu: 7, den: 9, ca: 1, tenBuoi: 'Chiều' }, { tu: 10, den: 12, ca: 1, tenBuoi: 'Chiều' },
        { tu: 13, den: 15, ca: 2, tenBuoi: 'Tối' }
    ];
    /* Buổi của bảng bận/rỗi MỘT ngày (gốc arrBuoiBR) */
    var BUOI_BR = [{ ten: 'Sáng', tu: 1, den: 6 }, { ten: 'Chiều', tu: 7, den: 10 }, { ten: 'Tối', tu: 11, den: 15 }];
    var MAU = ['#223771', '#ff6b35', '#ec4c00', '#5a7adb', '#3c5398'], NEN_BUOI = ['#FFF9E6', '#E6F3FF', '#F0E6FF'];

    /* ---------- Nguồn dữ liệu ------------------------------------------- */
    var goc = [], boNho = {};
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function tinhTrang() { return f('tinhtrang').value || ''; }
    function layCanBo(dv) {
        var k = (dv || '') + '|' + tinhTrang();
        if (boNho[k]) return Promise.resolve(boNho[k]);
        return ums.ref.nhanSu({ strCoCauToChuc_Id: dv || '', strTinhTrangNhanSu_Id: tinhTrang(), dLaCanBoNgoaiTruong: -1, pageIndex: 1, pageSize: 1000000 })
            .then(function (d) { return (boNho[k] = d || []); });
    }
    function dsDong() {
        return layCanBo(f('donvi').value).then(function (ds) {
            goc = ds;
            var nhieu = pat.val(f('nhieu')), mot = f('mot').value;
            var ids = nhieu ? nhieu.split(',') : mot ? [mot] : [];
            return ids.length ? ds.filter(function (r) { return ids.indexOf(String(r.ID)) >= 0; }) : ds;
        });
    }
    function layLich(cb, bd, kt) {
        return ums.api.call({ action: 'NS_ThongTinCanBo/LayDSLichGiang', method: 'GET', silent: true, strNhanSu_HoSoCanBo_Id: cb.ID,
            strNgayBatDau: bd, strNgayKetThuc: kt, strNgayDangChon: bd }).then(function (r) {
            return arr(r.data).map(function (x) { x.IDCANBO = cb.ID; return x; });
        });
    }

    /* Ô giảng viên: danh sách hàng nghìn người — select2 phân trang 50 người
       ở máy khách, tìm trên nhãn (như bản gốc) */
    var nhanCB = [];
    function s2PhanTrang(el) {
        ui.select2(el, {
            minimumInputLength: 0,
            ajax: {
                delay: 150,
                transport: function (p, ok) {
                    var tk = String((p.data && p.data.term) || '').toLowerCase(), trang = (p.data && p.data.page) || 1;
                    var ds = tk ? nhanCB.filter(function (x) { return x.l.indexOf(tk) >= 0; }) : nhanCB;
                    ok({ results: ds.slice((trang - 1) * 50, trang * 50).map(function (x) { return { id: x.id, text: x.t }; }), pagination: { more: trang * 50 < ds.length } });
                    return { abort: function () {} };
                },
                processResults: function (d) { return d; }
            }
        });
    }
    function napOCanBo(dv) {
        return layCanBo(dv).then(function (ds) {
            nhanCB = ds.map(function (r) { var t = ums.ref.tenNhanSu(r); return { id: String(r.ID), t: t, l: t.toLowerCase() }; });
            f('mot').innerHTML = '<option value=""></option>'; f('nhieu').innerHTML = '';
            if (window.jQuery) { jQuery(f('mot')).val('').trigger('change.select2'); jQuery(f('nhieu')).val(null).trigger('change.select2').trigger('ums:refresh'); }
        });
    }
    /* Tình trạng nhân sự (NS.TTNS — cùng ô "Tình trạng làm việc" bên Nhân sự). Mặc định mục "Đang làm việc / Đang công tác"
       → danh sách giảng viên bỏ thầy cô đã nghỉ. Trả true khi có mặc định. Danh mục lỗi → không lọc (như gốc). */
    function napTinhTrang() {
        return ums.ref.dm('NS.TTNS').then(function (ds) {
            ds = ds || [];
            pat.fill(f('tinhtrang'), ds, { head: 'Tất cả tình trạng nhân sự' });
            var md = ds.filter(function (x) { return /^\s*đang\s*(làm\s*việc|công\s*tác)/i.test(e(x.TEN)); })[0]
                || ds.filter(function (x) { return /(làm\s*việc|công\s*tác)/i.test(e(x.TEN)) && !/nghỉ|thôi|chuyển/i.test(e(x.TEN)); })[0];
            if (!md) return false;
            f('tinhtrang').value = md.ID;
            if (window.jQuery) jQuery(f('tinhtrang')).trigger('change.select2');
            return true;
        }).catch(function () { return false; });
    }
    /* Cây đơn vị: con thụt vào dưới cha (bản gốc dựng cây theo DAOTAO_COCAUTOCHUC_CHA_ID) */
    function cay(ds) {
        var con = {}, co = {}, kq = [];
        ds.forEach(function (r) { co[r.ID] = true; });
        ds.forEach(function (r) { var c = co[r.DAOTAO_COCAUTOCHUC_CHA_ID] ? r.DAOTAO_COCAUTOCHUC_CHA_ID : ''; (con[c] = con[c] || []).push(r); });
        (function di(cha, muc) { (con[cha] || []).forEach(function (r) { kq.push({ ID: r.ID, TEN: new Array(muc + 1).join('— ') + e(r.TEN) }); if (muc < 20) di(r.ID, muc + 1); }); })('', 0);
        return kq;
    }

    /* ---------- Tra bận / rỗi theo ngày / giai đoạn (kéo gốc lần 12) -------
       BR = null (đang xem lưới tuần) | { dangTai, ngay: [dd/mm/yyyy], thu, canhBao, tu, den, tenBuoi, loc, dong: [{ cb, lich,
       ngayBan, soNgayBan, ban, loi }], donVi }. Kết quả thay lưới qua cfg.veThay; tóm tắt qua N.thanh. */
    var BR = null, luotBR = 0, boNhoLich = {}, mauCuaBR = {}, soMauBR = 0;
    var MAX_NGAY = 186, MAX_COT = 31, SONG_SONG = 6;
    function oChon(k) { var s = f(k); return s.options[s.selectedIndex] ? s.options[s.selectedIndex].text : ''; }
    function datNgay(k, v) { var el = f(k); el.value = v || ''; if (el._flatpickr) { try { el._flatpickr.setDate(v || '', false); } catch (x) { /* giữ .value */ } } }
    function phut(r) { return (parseInt(r.GIOBATDAU, 10) || 0) * 60 + (parseInt(r.PHUTBATDAU, 10) || 0); }
    function mauBR(r) { var k = e(r.IDLOPHOCPHAN); if (!mauCuaBR[k]) mauCuaBR[k] = (soMauBR++ % 5) + 1; return mauCuaBR[k]; }
    function trongModule(ds, m) { return ds.filter(function (r) { var k = khoangTiet(r); return k && k.tu <= m.den && k.den >= m.tu; }); }
    var BAR = '<div class="lgn-banroi">' +
        '<div class="lgn-banroi__tieude"><i class="fa-light fa-user-clock"></i>Tra bận / rỗi theo ngày</div>' +
        '<div class="ums-field"><label class="ums-field__label">Từ ngày</label><div class="ums-field__control">' +
            '<input class="ums-input" data-f="br_tu" data-date data-range="br:tu" placeholder="Từ ngày" autocomplete="off"></div></div>' +
        '<div class="ums-field"><label class="ums-field__label">Đến ngày <small>(trống = 1 ngày)</small></label><div class="ums-field__control">' +
            '<input class="ums-input" data-f="br_den" data-date data-range="br:den" placeholder="Đến ngày" autocomplete="off"></div></div>' +
        ui.btn('search', { text: 'Tuần đang xem', icon: 'fa-calendar-week', mod: 'ghost', attr: { 'data-a': 'br-tuan', title: 'Điền Từ ngày - Đến ngày = tuần đang xem' } }) +
        /* Thứ: giá trị = Date.getDay() như gốc. Có khoảng ngày → chỉ xét thứ này; không nhập ngày → thứ này của tuần đang xem */
        '<div class="ums-field"><label class="ums-field__label">Thứ</label><div class="ums-field__control"><select class="ums-select" data-f="br_thu" data-no-s2>' +
            [['', 'Mọi thứ'], ['1', 'Thứ 2'], ['2', 'Thứ 3'], ['3', 'Thứ 4'], ['4', 'Thứ 5'], ['5', 'Thứ 6'], ['6', 'Thứ 7'], ['0', 'Chủ nhật']]
                .map(function (a) { return '<option value="' + a[0] + '">' + a[1] + '</option>'; }).join('') + '</select></div></div>' +
        '<div class="ums-field"><label class="ums-field__label">Buổi / tiết</label><div class="ums-field__control"><select class="ums-select" data-f="br_buoi" data-no-s2>' +
            [['1-15', 'Cả ngày (T1-15)'], ['1-10', 'Sáng + chiều (T1-10)'], ['1-6', 'Sáng (T1-6)'], ['7-10', 'Chiều (T7-10)'], ['11-15', 'Tối (T11-15)']]
                .map(function (a) { return '<option value="' + a[0] + '">' + a[1] + '</option>'; }).join('') + '</select></div></div>' +
        ui.btn('search', { text: 'Tra bận / rỗi', attr: { 'data-a': 'br-tra' } }) +
        '</div>';

    /* Các ngày cần xét từ Từ ngày / Đến ngày / Thứ → { ngay, thu, canhBao } hoặc { loi } */
    function dsNgayBR() {
        var tu = f('br_tu').value || '', den = f('br_den').value || tu, thu = f('br_thu').value, tenThu = thu !== '' ? oChon('br_thu') : '';
        if (!tu && thu !== '' && N.tuan) { tu = N.tuan.batdau; den = N.tuan.ketthuc; }
        var a = parse(tu), b = parse(den);
        if (!a || !b) return { loi: 'Vui lòng chọn Từ ngày (hoặc bấm "Tuần đang xem", hoặc chọn Thứ)' };
        if (b < a) b = a;
        if ((b - a) / 864e5 + 1 > MAX_NGAY) return { loi: 'Khoảng ngày tối đa ' + MAX_NGAY + ' ngày' };
        var ngay = [];
        for (var d = new Date(a); d <= b; d.setDate(d.getDate() + 1)) if (thu === '' || String(d.getDay()) === thu) ngay.push(dmy(d));
        if (!ngay.length) return { loi: 'Khoảng ngày đã chọn không có ' + tenThu + ' nào' };
        var canhBao = '';
        if (ngay.length > MAX_COT) {
            canhBao = 'Bảng hiện tối đa ' + MAX_COT + ' ngày — đang tính tới ' + ngay[MAX_COT - 1] + '. Hãy chọn Thứ hoặc rút ngắn khoảng ngày.';
            ngay = ngay.slice(0, MAX_COT);
        }
        return { ngay: ngay, thu: tenThu, canhBao: canhBao };
    }
    /* "T2 26/10/2026" hoặc "T2 26/10/2026 → CN 01/11/2026 (7 ngày, chỉ Thứ 2)" */
    function moTaKhoang(k) {
        var a = k.ngay;
        if (a.length === 1) return thuCua(a[0]) + ' ' + a[0];
        return thuCua(a[0]) + ' ' + a[0] + ' → ' + thuCua(a[a.length - 1]) + ' ' + a[a.length - 1] + ' (' + a.length + ' ngày' + (k.thu ? ', chỉ ' + k.thu : '') + ')';
    }
    /* Lịch một giảng viên trong khoảng ngày — một lời gọi, nhớ 5 phút (như gốc) */
    function layLichKhoang(cb, tu, den) {
        var k = cb.ID + '|' + tu + '|' + den, c = boNhoLich[k];
        if (c && Date.now() - c.t < 5 * 60 * 1000) return Promise.resolve(c.ds);
        return layLich(cb, tu, den).then(function (ds) { boNhoLich[k] = { t: Date.now(), ds: ds }; return ds; });
    }
    function tienDoBR(html) { return '<i class="fa-light fa-spinner fa-spin"></i><span>' + html + '</span>'; }
    function dongBanRoi(napLai) {
        if (!BR) return;
        luotBR++; BR = null; N.thanh('');
        if (napLai) N.tai();
    }
    /* Mọi lượt xem lưới tuần (nút Xem, đổi bộ lọc) đóng bảng bận/rỗi trước — gốc getList_TuanHienTai */
    function taiTuan() { dongBanRoi(false); return N.tai(); }
    function traBanRoi() {
        if (!f('donvi').value && !f('mot').value && !pat.val(f('nhieu'))) { ui.toast('Vui lòng chọn khoa/đơn vị hoặc giảng viên trước khi tra bận / rỗi', 'warn'); return; }
        var o = dsNgayBR();
        if (o.loi) { ui.toast(o.loi, 'warn'); return; }
        if (!N.tuan) { ui.toast('Vui lòng chọn tuần trên lịch', 'warn'); return; }
        var tiet = (f('br_buoi').value || '1-15').split('-'), luot = ++luotBR, coNgay = {};
        o.ngay.forEach(function (s) { coNgay[s] = true; });
        BR = { dangTai: true, ngay: o.ngay, thu: o.thu, canhBao: o.canhBao, tu: +tiet[0], den: +tiet[1], tenBuoi: oChon('br_buoi'), loc: 'all', dong: [],
            donVi: f('donvi').value ? oChon('donvi').replace(/^(— )+/, '') : '' };
        N.thanh(tienDoBR('Đang tải danh sách giảng viên...'));
        N.tai();   // khung huỷ lượt nạp lưới đang chạy, vẽ "Đang tải…" thay lưới (veThay)
        dsDong().then(function (ds) {
            if (luot !== luotBR) return;
            var tu = o.ngay[0], den = o.ngay[o.ngay.length - 1], xong = 0;
            if (!ds.length) { BR.dangTai = false; N.thanh(tomTatBR()); N.tai(); return; }
            N.thanh(tienDoBR('Đang tải lịch ' + esc(moTaKhoang(BR)) + '… <span data-z="br-tiendo">0/' + ds.length + ' giảng viên</span>'));
            return lg.chayNhom(ds, SONG_SONG, function (cb) {
                return layLichKhoang(cb, tu, den).then(function (ds2) { return { cb: cb, lich: ds2 || [], loi: false }; }, function () { return { cb: cb, lich: [], loi: true }; })
                    .then(function (d) {
                        if (luot !== luotBR) return d;
                        var t = root.querySelector('[data-z="br-tiendo"]');
                        if (t) t.textContent = (++xong) + '/' + ds.length + ' giảng viên';
                        return d;
                    });
            }).then(function (kq) {
                if (luot !== luotBR) return;
                BR.dong = kq.map(function (d) {
                    // Chỉ giữ lịch rơi vào các ngày đang xét (đã lọc thứ), xếp theo ngày rồi giờ
                    d.lich = d.lich.filter(function (r) { return coNgay[r.NGAYHOC]; }).sort(function (a, b) { return (parse(a.NGAYHOC) - parse(b.NGAYHOC)) || (phut(a) - phut(b)); });
                    d.ngayBan = {};
                    d.lich.forEach(function (r) { var k = khoangTiet(r); if (k && k.tu <= BR.den && k.den >= BR.tu) (d.ngayBan[r.NGAYHOC] = d.ngayBan[r.NGAYHOC] || []).push(r); });
                    d.soNgayBan = Object.keys(d.ngayBan).length; d.ban = d.soNgayBan > 0;
                    return d;
                });
                BR.dangTai = false;
                N.thanh(tomTatBR());
                N.tai();
            });
        }).catch(function (err) { if (luot === luotBR) { BR = null; N.thanh(''); ums.api.handle(err, 'tra bận / rỗi'); } });
    }
    function dongHienBR() {
        return BR.dong.filter(function (d) { return BR.loc === 'ban' ? d.ban : BR.loc === 'roi' ? !d.ban && !d.loi : true; });
    }
    function tomTatBR() {
        var k = BR, ban = 0, roi = 0, loi = 0, nhieu = k.ngay.length > 1;
        k.dong.forEach(function (d) { if (d.loi) loi++; else if (d.ban) ban++; else roi++; });
        return '<i class="fa-light fa-user-clock"></i><span><b>' + esc(moTaKhoang(k) + ' · ' + k.tenBuoi) + ':</b> ' +
            '<b class="lgn-br__roi">' + roi + ' rỗi' + (nhieu ? ' cả giai đoạn' : '') + '</b> · <b class="lgn-br__ban">' + ban + ' bận' + (nhieu ? ' ít nhất 1 ngày' : '') + '</b> / ' + k.dong.length + ' giảng viên' +
            (loi ? ' · <b class="lgn-br__loi">' + loi + ' giảng viên lỗi tải lịch</b>' : '') +
            (k.canhBao ? '<br><span class="lgn-br__canhbao">' + esc(k.canhBao) + '</span>' : '') + '</span>' +
            ui.chips([{ key: 'all', label: 'Tất cả', count: k.dong.length }, { key: 'roi', label: 'Chỉ rỗi', count: roi }, { key: 'ban', label: 'Chỉ bận', count: ban }], k.loc) +
            '<span class="lgn-thanhloc__nut">' + ui.btn('excel', { attr: { 'data-a': 'br-xuat' } }) +
            ui.btn('search', { text: 'Về lịch tuần', icon: 'fa-calendar-week', mod: 'out-primary', attr: { 'data-a': 'br-dong' } }) + '</span>';
    }
    function oBR(d, iD, su) {
        var h = '<td class="lgn-br__o' + (su.length ? ' is-ban' : '') + '">';
        if (!su.length) return h + '<span class="lgn-br__trong">Rỗi</span></td>';
        su.forEach(function (r) {
            var t = tietChu(r), noi = e(r.TENHOCPHAN) + (r.TENPHONGHOC ? ' · ' + r.TENPHONGHOC : '');
            h += '<button type="button" class="lgn-su lgn-su--' + mauBR(r) + '" data-br="' + iD + '|' + d.lich.indexOf(r) + '" title="' + esc(thuCua(r.NGAYHOC) + ' ' + e(r.NGAYHOC) + ' · ' + noi + ' — bấm để xem chi tiết') + '">' +
                '<span>' + esc(lg.gioPhut(r, 'GIOBATDAU', 'PHUTBATDAU') + (t ? ' (' + t + ')' : '')) + '</span><small>' + esc(noi) + '</small></button>';
        });
        return h + '</td>';
    }
    /* Bảng bận/rỗi thay lưới tuần (cfg.veThay) */
    function veBangBR() {
        var k = BR;
        if (k.dangTai) return ui.empty('Đang tải dữ liệu bận / rỗi...', 'fa-spinner fa-spin');
        var ds = dongHienBR(), nhieu = k.ngay.length > 1;
        if (!ds.length) return ui.empty(k.dong.length ? 'Không có giảng viên nào ' + (k.loc === 'ban' ? 'bận' : 'rỗi') + ' trong khung này.' : 'Không có giảng viên nào theo bộ lọc. Hãy chọn khoa/đơn vị hoặc giảng viên.', 'fa-user-clock');
        var khung = k.tenBuoi.replace(/^.*\(|\)$/g, '');
        var h = '<div class="lgn-br"><table class="ums-table ums-table--lined lgn-br__bang"><thead><tr><th class="lgn-br__stt">STT</th><th class="lgn-br__gv">Giảng viên</th><th class="lgn-br__tt">Trạng thái<small>' + esc(khung) + '</small></th>';
        if (nhieu) k.ngay.forEach(function (s) { var t = thuCua(s); h += '<th class="lgn-br__ngay' + (t === 'CN' ? ' is-cn' : '') + '">' + t + '<small>' + s.substring(0, 5) + '</small></th>'; });
        else BUOI_BR.forEach(function (b) { h += '<th class="lgn-br__buoi' + (b.tu <= k.den && b.den >= k.tu ? ' is-khung' : '') + '">' + b.ten + '<small>Tiết ' + b.tu + '-' + b.den + '</small></th>'; });
        h += '</tr></thead><tbody>';
        ds.forEach(function (d, i) {
            var cb = d.cb, moTa = [], iD = k.dong.indexOf(d);
            if (cb.MASO) moTa.push(cb.MASO);
            if (donVi(cb)) moTa.push(donVi(cb));
            h += '<tr' + (d.ban ? ' class="is-ban"' : '') + '><td class="lgn-br__stt">' + (i + 1) + '</td>' +
                '<td class="lgn-br__gv"><b>' + esc(ten(cb)) + '</b>' + (moTa.length ? '<small>' + esc(moTa.join(' · ')) + '</small>' : '') + '</td>' +
                '<td class="lgn-br__tt">' + (d.loi ? ui.badge('Lỗi tải', 'warn') : ui.badge(d.ban ? 'Bận' : 'Rỗi', d.ban ? 'bad' : 'ok')) +
                (nhieu && !d.loi ? '<small class="' + (d.ban ? 'lgn-br__ban' : 'lgn-br__roi') + '">' + (d.ban ? d.soNgayBan + '/' + k.ngay.length + ' ngày' : 'cả ' + k.ngay.length + ' ngày') + '</small>' : '') + '</td>';
            if (nhieu) k.ngay.forEach(function (s) { h += oBR(d, iD, d.ngayBan[s] || []); });   // nhiều ngày: chỉ lịch trong khung tiết đang tra
            else BUOI_BR.forEach(function (b) { h += oBR(d, iD, d.lich.filter(function (r) { var t = parseInt(r.TIETBATDAU, 10); return t >= b.tu && t <= b.den; })); });
            h += '</tr>';
        });
        return h + '</tbody></table></div>';
    }
    /* Xuất Excel đúng bảng bận/rỗi đang xem (theo chip Tất cả / Chỉ rỗi / Chỉ bận); mỗi ngày 5 ô mô-đun 3 tiết */
    function xuatBR() {
        var k = BR;
        if (!k || k.dangTai) return;
        var ds = dongHienBR(), nhieu = k.ngay.length > 1;
        if (!ds.length) { ui.toast('Không có giảng viên nào để xuất', 'warn'); return; }
        var ban = k.dong.filter(function (d) { return d.ban; }).length, roi = k.dong.filter(function (d) { return !d.ban && !d.loi; }).length;
        var td = 'border:1px solid #999;padding:4px;vertical-align:middle;', khung = k.tenBuoi.replace(/^.*\(|\)$/g, '');
        var cotTrai = [['STT', 40], ['Giảng viên', 170], ['Mã số', 70], ['Đơn vị', 140], ['Trạng thái (' + khung + ')', 80]];
        if (nhieu) cotTrai.push(['Số ngày bận', 60]);
        var soCot = cotTrai.length + k.ngay.length * MODULE.length;
        function dong(noiDung, style) { return '<tr><td colspan="' + soCot + '"' + (style ? ' style="' + style + '"' : '') + '>' + noiDung + '</td></tr>'; }
        function oXls(su, m, span) {
            var cs = span > 1 ? ' colspan="' + span + '"' : '';
            if (!su.length) return '<td' + cs + ' align="center" style="' + td + 'color:#94a3b8;font-size:10px;">T' + m.tu + '-' + m.den + ' · Trống</td>';
            var mau = MAU[mauBR(su[0]) - 1];
            return '<td' + cs + ' valign="top" bgcolor="' + mau + '" style="' + td + 'vertical-align:top;background:' + mau + ';color:#ffffff;">' + su.map(function (r) {
                var t = tietChu(r);
                return '<b>' + esc(lg.gioPhut(r, 'GIOBATDAU', 'PHUTBATDAU') + (t ? ' (' + t + ')' : '')) + '</b><br>' + esc(e(r.TENHOCPHAN)) +
                    (r.TENLOPHOCPHAN ? '<br>Lớp: ' + esc(r.TENLOPHOCPHAN) : '') + (r.TENPHONGHOC ? '<br>Phòng: ' + esc(r.TENPHONGHOC) : '');
            }).join('<br>-----<br>') + '</td>';
        }
        var h = '<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"></head><body><table border="1" cellpadding="4" cellspacing="0" style="border-collapse:collapse;font-family:Arial;font-size:11px;">' +
            dong('DANH SÁCH BẬN / RỖI GIẢNG VIÊN', 'font-size:16px;font-weight:bold;text-align:center;height:30px;') +
            dong('Thời gian: ' + esc(moTaKhoang(k) + ' · ' + k.tenBuoi + (k.donVi ? ' · Đơn vị: ' + k.donVi : ''))) +
            dong('Tổng ' + k.dong.length + ' giảng viên: ' + roi + ' rỗi' + (nhieu ? ' cả giai đoạn' : '') + ', ' + ban + ' bận' + (nhieu ? ' ít nhất 1 ngày' : '') +
                (k.loc !== 'all' ? ' (file chỉ gồm giảng viên ' + (k.loc === 'ban' ? 'bận' : 'rỗi') + ')' : '')) +
            dong('Mỗi buổi chia mô-đun 3 tiết: Sáng T1-3 / T4-6 · Chiều T7-9 / T10-12 · Tối T13-15. Ô trắng ghi "Trống" là mô-đun còn rỗi.') + dong('') +
            '<tr style="font-weight:bold;background:#D9D9D9;">' + cotTrai.map(function (c) { return '<td rowspan="2" align="center" style="' + td + 'width:' + c[1] + 'px;">' + esc(c[0]) + '</td>'; }).join('') +
                k.ngay.map(function (s) { return '<td colspan="' + MODULE.length + '" align="center" style="' + td + '">' + thuCua(s) + ' (' + s.substring(0, 5) + ')</td>'; }).join('') + '</tr>' +
            '<tr style="font-weight:bold;">' + k.ngay.map(function () {
                return MODULE.map(function (m) { return '<td align="center" bgcolor="' + NEN_BUOI[m.ca] + '" style="' + td + 'width:110px;background:' + NEN_BUOI[m.ca] + ';">' + m.tenBuoi.toUpperCase() + '<br>T' + m.tu + '-' + m.den + '</td>'; }).join('');
            }).join('') + '</tr>';
        ds.forEach(function (d, i) {
            var cb = d.cb, nenTT = d.loi ? '#ffffff' : d.ban ? '#fde8e0' : '#dcf5e6', mauTT = d.loi ? '#0f172a' : d.ban ? '#c2410c' : '#1e7a45';
            h += '<tr style="height:55px;"><td align="center" style="' + td + '">' + (i + 1) + '</td><td style="' + td + 'font-weight:bold;">' + esc(ten(cb)) + '</td>' +
                '<td align="center" style="' + td + 'mso-number-format:\'\\@\';">' + esc(e(cb.MASO)) + '</td><td style="' + td + '">' + esc(donVi(cb)) + '</td>' +
                '<td align="center" bgcolor="' + nenTT + '" style="' + td + 'font-weight:bold;background:' + nenTT + ';color:' + mauTT + ';">' + (d.loi ? 'Lỗi tải' : d.ban ? 'Bận' : 'Rỗi') + '</td>' +
                (nhieu ? '<td align="center" style="' + td + 'mso-number-format:\'\\@\';">' + (d.loi ? '' : d.soNgayBan + '/' + k.ngay.length) + '</td>' : '');
            k.ngay.forEach(function (s) {
                var ngay = d.lich.filter(function (r) { return r.NGAYHOC === s; }), im = 0;
                while (im < MODULE.length) {
                    var m = MODULE[im], su = trongModule(ngay, m), span = 1;
                    // Lịch kéo qua cả hai mô-đun của một buổi (VD T1-6) → gộp hai ô thành một
                    if (im + 1 < MODULE.length && MODULE[im + 1].ca === m.ca) {
                        var su2 = trongModule(ngay, MODULE[im + 1]);
                        if (su.some(function (r) { return su2.indexOf(r) >= 0; })) {
                            su = su.concat(su2.filter(function (r) { return su.indexOf(r) < 0; })); span = 2; m = { tu: m.tu, den: MODULE[im + 1].den };
                        }
                    }
                    h += oXls(su, m, span);
                    im += span;
                }
            });
            h += '</tr>';
        });
        h += '</table></body></html>';
        var a = k.ngay, tenTep = 'Ban roi giang vien ' + (a.length === 1 ? 'ngay ' + a[0] : 'tu ' + a[0] + ' den ' + a[a.length - 1]).replace(/\//g, '.') + '.xls';
        ui.taiTep(tenTep, 'application/vnd.ms-excel;charset=utf-8', h);
        ui.toast('Đã xuất ' + tenTep + ' — ' + ds.length + ' giảng viên, ' + ds.reduce(function (s, d) { return s + d.lich.length; }, 0) + ' lịch', 'ok');
    }

    var N = lg.nhieu(root, {
        tieuDe: 'Lịch giảng nhiều giảng viên', phuDe: 'Tra cứu và quản lý lịch giảng theo khoa/đơn vị',
        gioiThieu: ['Chọn khoa/đơn vị để hiển thị danh sách giảng viên', 'Hiển thị lịch theo tuần (T2 - CN)', 'Xuất báo cáo Excel theo nhu cầu'],
        loc: '<div class="lgn-xep">' +
            '<select class="ums-select" data-f="donvi" data-ph="Chọn khoa/đơn vị..."><option value="">Tất cả khoa/đơn vị</option></select>' +
            /* Kéo gốc lần 12: tình trạng nhân sự (NS.TTNS) — mặc định "Đang làm việc" để bỏ thầy cô đã nghỉ */
            '<select class="ums-select" data-f="tinhtrang" data-ph="Tình trạng nhân sự..."><option value="">Tất cả tình trạng nhân sự</option></select>' +
            '<select class="ums-select" data-f="mot" data-ph="Tìm kiếm giảng viên..."><option value=""></option></select>' +
            '<select class="ums-select" data-f="nhieu" multiple data-ph="Chọn nhiều giảng viên..."></select>' +
            '<select class="ums-select" data-f="hieusuat" data-no-s2>' + CHE_DO.map(function (c) { return '<option value="' + c.v + '">' + esc(c.ten) + '</option>'; }).join('') + '</select></div>',
        nut: ui.btn('search', { text: 'Xem lịch giảng viên', attr: { 'data-a': 'xem' }, icon: 'fa-eye' }) +
            ui.btn('search', { text: 'Xem nhiều giảng viên', icon: 'fa-layer-group', mod: 'out-primary', attr: { 'data-a': 'nhieu' } }) +
            ui.btn('search', { text: 'Xem tất cả lịch giảng', icon: 'fa-table-list', mod: 'out-primary', attr: { 'data-a': 'tatca' } }),
        tenLuoi: 'Lịch tuần theo giảng viên', cotDong: 'Giảng viên', cotHieuSuat: 'Hiệu suất<br>dạy học', donVi: 'giảng viên',
        rong: function () { return BR ? 'Không có giảng viên nào theo bộ lọc. Hãy chọn khoa/đơn vị hoặc giảng viên.' : 'Không có dữ liệu giảng viên'; },
        ca: [
            { ten: 'SÁNG', xuat: 'Sáng', tiet: 'Tiết 1-6', mau: '#FFF9E6', nen: '#FFFEF5' },
            { ten: 'CHIỀU', xuat: 'Chiều', tiet: 'Tiết 7-10', mau: '#E6F3FF', nen: '#F5F9FF' },
            { ten: 'TỐI', xuat: 'Tối', tiet: 'Tiết 11-15', mau: '#F0E6FF', nen: '#F9F5FF' }
        ],
        caCua: caCua, tietCua: tietCua, khoangTiet: khoangTiet, cheDo: CHE_DO, boCN: false,
        dsDong: dsDong, dsGoc: function () { return goc; }, layLich: layLich, khoa: function (r) { return r.ID; },
        /* Kéo gốc lần 12: tra bận / rỗi — thanh trên lưới, kết quả thay lưới, tóm tắt trên lưới; đổi tuần thì đóng */
        truocLuoi: BAR, thanh: true,
        veThay: function () { return BR ? veBangBR() : null; },
        onTuan: function () { dongBanRoi(false); },
        veDong: function (r) {
            return '<b>' + esc(ten(r)) + '</b>' + (r.MASO ? '<span class="ums-badge ums-badge--info">' + esc(r.MASO) + '</span>' : '') + '<i>' + esc(donVi(r)) + '</i>';
        },
        dong3: function (r) { return '<i class="fa-light fa-door-open"></i> ' + esc(e(r.TENPHONGHOC)); },
        chiTiet: function (r, cb) {
            return { phong: e(r.TENPHONGHOC), ngay: e(r.NGAYHOC), gio: lg.gioPhut(r, 'GIOBATDAU', 'PHUTBATDAU') + ' - ' + lg.gioPhut(r, 'GIOKETTHUC', 'PHUTKETTHUC'),
                tiet: r.TIETBATDAU ? 'Tiết ' + e(r.TIETBATDAU) + ' - ' + e(r.TIETKETTHUC) : '', gv: cb ? tenMa(cb) : lg.sach(r.THONGTINGIANGVIEN) };
        },
        xuat: {
            tieuDe: 'Xuất Excel - Lịch giảng nhiều giảng viên', tieuDeTep: 'LỊCH GIẢNG NHIỀU GIẢNG VIÊN', nhanLoc: 'Chọn giảng viên',
            nhanPhamVi: ['Tất cả giảng viên', 'Giảng viên đang lọc hiện tại', 'Chọn giảng viên cụ thể'], nhanChon: 'Chọn giảng viên', nhanChonTrong: 'Giảng viên', banBan: false,
            thongTin: 'File xuất gồm: Giảng viên, Mã số, Đơn vị, Thời gian, Học phần, Lớp, Phòng học — mỗi buổi chia mô-đun 3 tiết, ô trống là mô-đun còn rỗi.',
            module: MODULE,   // kéo gốc lần 12: exportToExcel_Module — lưới tuần vẫn vẽ theo buổi
            tenChon: tenMa,
            tenDong: function (r) { return esc(ten(r)) + '<br><i>' + esc(e(r.MASO)) + '</i><br><small>' + esc(donVi(r)) + '</small>'; },
            csvDau: ['Giảng viên', 'Mã số', 'Đơn vị'], csvDong: function (r) { return [ten(r), e(r.MASO), donVi(r)]; },
            excelO: function (r) {
                var t = tietChu(r);
                return esc(lg.gioPhut(r, 'GIOBATDAU', 'PHUTBATDAU') + '-' + lg.gioPhut(r, 'GIOKETTHUC', 'PHUTKETTHUC') + (t ? ' (' + t + ')' : '')) + '<br>' + esc(e(r.TENHOCPHAN)) +
                    '<br>Lớp: ' + esc(e(r.TENLOPHOCPHAN)) + '<br>Phòng: ' + esc(e(r.TENPHONGHOC));
            },
            csvO: function (r) {
                var t = tietChu(r);
                return lg.gioPhut(r, 'GIOBATDAU', 'PHUTBATDAU') + '-' + lg.gioPhut(r, 'GIOKETTHUC', 'PHUTKETTHUC') + (t ? ' (' + t + ')' : '') + ' ' + e(r.TENHOCPHAN) +
                    ' - Lớp: ' + e(r.TENLOPHOCPHAN) + ' - Phòng: ' + e(r.TENPHONGHOC);
            }
        }
    });

    s2PhanTrang(f('mot')); s2PhanTrang(f('nhieu'));
    ums.ref.coCauToChuc({}).then(function (ds) { pat.fill(f('donvi'), cay(ds), { head: 'Tất cả khoa/đơn vị' }); }).catch(function (err) { ums.api.handle(err, 'khoa/đơn vị'); });
    /* Nạp danh mục tình trạng TRƯỚC rồi mới nạp giảng viên (danh sách đầu tiên đã bỏ người nghỉ việc — gốc genCombo_TinhTrang);
       lưới tuần đầu (khung tự chọn tuần hiện tại) có thể đã nạp trước khi có danh mục → nạp lại với tình trạng mặc định */
    napTinhTrang().then(function (coMacDinh) {
        return napOCanBo(f('donvi').value).then(function () { if (coMacDinh && N.tuan) taiTuan(); });
    }).catch(function (err) { ums.api.handle(err, 'giảng viên'); });

    if (window.jQuery) {
        jQuery(f('donvi')).add(f('tinhtrang')).on('change', function () {
            napOCanBo(f('donvi').value).then(function () { if (N.tuan) taiTuan(); }).catch(function (err) { ums.api.handle(err, 'giảng viên'); });
        });
        jQuery(f('mot')).on('select2:select select2:clear', function () { if (N.tuan) taiTuan(); });
        jQuery(f('nhieu')).on('select2:select', function () { jQuery(f('mot')).val('').trigger('change.select2'); });
    }
    root.addEventListener('click', function (ev) {
        var the = ev.target.closest('[data-br]');
        if (the && BR) {   // thẻ lịch trong bảng bận/rỗi → hộp chi tiết của khung
            var p = the.getAttribute('data-br').split('|'), d = BR.dong[+p[0]], r = d && d.lich[+p[1]];
            if (r) N.chiTiet(r, d.cb);
            return;
        }
        var chip = ev.target.closest('.lgn-thanhloc [data-chip]');
        if (chip && BR && !BR.dangTai) { BR.loc = chip.getAttribute('data-chip'); N.thanh(tomTatBR()); N.veLai(); return; }
        var b = ev.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'xem') {
            if (!f('donvi').value && !f('mot').value && !pat.val(f('nhieu'))) { ui.toast('Vui lòng chọn khoa/đơn vị hoặc giảng viên', 'warn'); return; }
            taiTuan();
        } else if (a === 'nhieu') {
            if (!pat.val(f('nhieu'))) { ui.toast('Vui lòng chọn ít nhất 1 giảng viên để xem', 'warn'); return; }
            taiTuan();
        } else if (a === 'tatca') {
            f('donvi').value = ''; if (window.jQuery) jQuery(f('donvi')).trigger('change.select2');
            napOCanBo('').then(function () { taiTuan(); });
        } else if (a === 'br-tra') traBanRoi();
        else if (a === 'br-tuan') { if (!N.tuan) { ui.toast('Vui lòng chọn tuần trên lịch', 'warn'); return; } datNgay('br_tu', N.tuan.batdau); datNgay('br_den', N.tuan.ketthuc); }
        else if (a === 'br-xuat') xuatBR();
        else if (a === 'br-dong') dongBanRoi(true);
    });
})();
