/* =========================================================================
   ums.nsCham — phần dùng chung của nhóm màn "Chấm công, phép" (và các màn
   Hợp đồng / Nghỉ hưu cùng nhóm chuyển đổi) của phân hệ Nhân sự
   ---------------------------------------------------------------------------
   Bản gốc chép tay những khối sau vào từng tệp:
     · Cột trái "Danh sách nhân sự" (chamcongvaora, nghiphep, nghihuu,
       hopdong/hopdongcanbo): ô từ khoá + Cơ cấu khoa/viện/phòng ban → Bộ môn
       (+ Tình trạng làm việc ở hopdongcanbo), edu.system.getList_NhanSu có
       phân trang máy chủ, mỗi dòng ảnh + họ tên + dòng phụ.
       → S.dsNhanSu(master, o) — lớp bọc của ums.pat.dsNhanSu
     · Lịch âm – dương (edu.system.lunarCalendar: iframe
       App_Themes/Plugins/amlich-js/currentmonth.html) ở dimuonvesom,
       ngaylamviectuan, nghichedo, nghile → S.amLich(host) — thuật toán đổi
       ngày của chính amlich-hnd.js (Hồ Ngọc Đức), vẽ bằng lớp ums-, không
       iframe (iframe trỏ ra ngoài _v2 và mang giao diện cũ).
     · Đồng hồ (edu.util.roundClock + digitalClock) ở giolamviec → S.dongHo.
     · edu.system.dateYearToCombo / daysOfWeekToCombo / convertNumToDay
       → S.nam(), S.thu(), S.tenThu().

   Nạp bằng <script src="…/chamcongphep/script/_chung.js"> ở mỗi màn cần.
   CSS đi kèm: chamcongphep/css/_chung.css.
   ========================================================================= */
(function (global) {
    'use strict';

    var ums = global.ums;
    var ui = ums.ui, pat = ums.pat;
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function rows(r) { var d = r && r.data; return Array.isArray(d) ? d : (d && d.rs) || []; }
    function uid() { return (ums.session && ums.session.userId) || ''; }

    var S = ums.nsCham = { e: e, esc: esc, rows: rows, uid: uid };

    /* ---------------------------------------------------------------------
       Năm — edu.system.dateYearToCombo(year, drop, title, active)
       Bản gốc có HAI dải khác nhau: gọi cho MỘT ô thì từ năm nay + 5 lùi về
       year + 1; gọi cho NHIỀU ô (chuỗi có dấu phẩy) thì từ năm nay lùi về
       year + 1. Giữ đúng từng màn: S.nam(1993, true) = bản một ô.
       --------------------------------------------------------------------- */
    S.nam = function (tu, motO) {
        var out = [], y = new Date().getFullYear() + (motO ? 5 : 0);
        for (; y > (tu || 1993); y--) out.push({ ID: String(y), TEN: String(y) });
        return out;
    };
    S.namNay = function () { return String(new Date().getFullYear()); };

    /* edu.system.daysOfWeekToCombo — giá trị 2…8, chữ T2…T7, CN */
    S.thu = function () {
        var out = [];
        for (var i = 2; i < 9; i++) out.push({ ID: String(i), TEN: i < 8 ? 'T' + i : 'CN' });
        return out;
    };
    /* edu.util.convertNumToDay */
    S.tenThu = function (n) {
        if (n === null || n === undefined || n === '') return '';
        return Number(n) === 8 ? 'CN' : 'T' + n;
    };

    /* Nguồn ô chọn "đơn vị" cho ums.crud — CHÍNH lời gọi của ums.ref.coCauToChuc
       (edu.system.getList_CoCauToChuc, mọi cơ cấu, iTrangThai 1). ums.ref chỉ trả
       Promise, còn `source` của crud cần đối tượng lời gọi → chép tham số ở đây. */
    S.nguonCCTC = function () {
        return { call: { action: 'NS_HoSo_V2_MH/DSA4BSAvKRIgIikVLiAvAy4P', func: 'pkg_nhansu_hoso_v2.LayDanhSachToanBo',
            dTrangThai: 1, strLoaiCoCauToChuc_Id: '', strCoCauToChucCha_Id: '' } };
    };

    /* Ảnh tròn (edu.system.getRootPathImg) — dùng chung ums.pat.anhNguoi */
    S.anh = function (path) { return pat.anhNguoi(path); };

    /* Cột trái "Danh sách nhân sự" — từ 2026-09-26 là lớp bọc của khung chung
       ums.pat.dsNhanSuLoc / ums.pat.dsNhanSu (patterns.js): năm bản tự dựng của
       phân hệ Nhân sự đã gộp về đó (ô Tình trạng làm việc, tự tải lại khi đổi
       ô lọc, dòng phụ Mã cán bộ + Ngày sinh — như nhau ở mọi màn).
       S.locHtml({ cctcTen }) → HTML ô lọc · S.dsNhanSu(m, { onPick }) →
       { F, load(trang), chon(), boChon(), rows } */
    S.locHtml = function (o) { return pat.dsNhanSuLoc({ cctcTen: o && o.cctcTen }); };
    S.dsNhanSu = function (m, o) { return pat.dsNhanSu(m, { onPick: o && o.onPick }); };

    /* =====================================================================
       Lịch âm – dương — thuật toán của App_Themes/Plugins/amlich-js/amlich-hnd.js
       (Hồ Ngọc Đức, múi giờ +7), vẽ lịch một tháng: số dương lớn, số âm nhỏ;
       ngày mùng 1 âm ghi "1/tháng". Có nút tháng trước / tháng sau (bản gốc
       currentmonth.html chỉ vẽ tháng hiện tại, không có nút).
       ===================================================================== */
    var PI = Math.PI, TZ = 7;
    function INT(d) { return Math.floor(d); }
    function jdFromDate(dd, mm, yy) {
        var a = INT((14 - mm) / 12), y = yy + 4800 - a, m = mm + 12 * a - 3;
        var jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
        if (jd < 2299161) jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
        return jd;
    }
    function newMoon(k) {
        var T = k / 1236.85, T2 = T * T, T3 = T2 * T, dr = PI / 180;
        var Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
        Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
        var M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
        var Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
        var F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
        var C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
        C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
        C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
        C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
        C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
        C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
        C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
        var deltat = T < -11
            ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3
            : -0.000278 + 0.000265 * T + 0.000262 * T2;
        return Jd1 + C1 - deltat;
    }
    function sunLongitude(jdn) {
        var T = (jdn - 2451545.0) / 36525, T2 = T * T, dr = PI / 180;
        var M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
        var L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
        var DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
        DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
        var L = (L0 + DL) * dr;
        return L - PI * 2 * INT(L / (PI * 2));
    }
    function sunLong(dayNumber) { return INT(sunLongitude(dayNumber - 0.5 - TZ / 24) / PI * 6); }
    function newMoonDay(k) { return INT(newMoon(k) + 0.5 + TZ / 24); }
    function lunarMonth11(yy) {
        var k = INT((jdFromDate(31, 12, yy) - 2415021) / 29.530588853);
        var nm = newMoonDay(k);
        return sunLong(nm) >= 9 ? newMoonDay(k - 1) : nm;
    }
    function leapMonthOffset(a11) {
        var k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5), last, i = 1;
        var arc = sunLong(newMoonDay(k + i));
        do { last = arc; i++; arc = sunLong(newMoonDay(k + i)); } while (arc !== last && i < 14);
        return i - 1;
    }
    /** [ngày, tháng, năm, nhuận] âm lịch của một ngày dương */
    S.duongSangAm = function (dd, mm, yy) {
        var dayNumber = jdFromDate(dd, mm, yy);
        var k = INT((dayNumber - 2415021.076998695) / 29.530588853);
        var monthStart = newMoonDay(k + 1);
        if (monthStart > dayNumber) monthStart = newMoonDay(k);
        var a11 = lunarMonth11(yy), b11 = a11, lunarYear;
        if (a11 >= monthStart) { lunarYear = yy; a11 = lunarMonth11(yy - 1); }
        else { lunarYear = yy + 1; b11 = lunarMonth11(yy + 1); }
        var lunarDay = dayNumber - monthStart + 1;
        var diff = INT((monthStart - a11) / 29);
        var leap = 0, lunarMonth = diff + 11;
        if (b11 - a11 > 365) {
            var lm = leapMonthOffset(a11);
            if (diff >= lm) { lunarMonth = diff + 10; if (diff === lm) leap = 1; }
        }
        if (lunarMonth > 12) lunarMonth -= 12;
        if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;
        return [lunarDay, lunarMonth, lunarYear, leap];
    };
    var CAN = ['Canh', 'Tân', 'Nhâm', 'Quý', 'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ'];
    var CHI = ['Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi'];
    S.tenNamAm = function (y) { return CAN[y % 10] + ' ' + CHI[y % 12]; };

    S.amLich = function (host) {
        var hom = new Date(), thang = hom.getMonth(), nam = hom.getFullYear();
        function ve() {
            var dau = new Date(nam, thang, 1), soNgay = new Date(nam, thang + 1, 0).getDate();
            var lui = (dau.getDay() + 6) % 7, tong = Math.ceil((lui + soNgay) / 7) * 7, h = '';
            for (var c = 0; c < tong; c++) {
                var d = new Date(nam, thang, c - lui + 1);
                if (d.getMonth() !== thang) { h += '<span class="nscham-al__o is-khac"></span>'; continue; }
                var am = S.duongSangAm(d.getDate(), thang + 1, nam);
                var cls = 'nscham-al__o';
                if (d.toDateString() === hom.toDateString()) cls += ' is-today';
                if ((c % 7) === 6) cls += ' is-cn';
                if (am[0] === 1) cls += ' is-mung1';
                h += '<span class="' + cls + '" title="Âm lịch: ' + am[0] + '/' + am[1] + (am[3] ? ' (nhuận)' : '') + '/' + am[2] + '">' +
                    '<b>' + d.getDate() + '</b><small>' + (am[0] === 1 ? am[0] + '/' + am[1] : am[0]) + '</small></span>';
            }
            var am1 = S.duongSangAm(15, thang + 1, nam);
            host.innerHTML =
                '<div class="nscham-al">' +
                '<div class="nscham-al__head"><button type="button" class="ums-iconbtn" data-al="-1" title="Tháng trước"><i class="fa-light fa-chevron-left"></i></button>' +
                '<b>Tháng ' + (thang + 1) + ' - ' + nam + '<small>Năm ' + esc(S.tenNamAm(am1[2])) + '</small></b>' +
                '<button type="button" class="ums-iconbtn" data-al="1" title="Tháng sau"><i class="fa-light fa-chevron-right"></i></button></div>' +
                '<div class="nscham-al__thu"><span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span></div>' +
                '<div class="nscham-al__ngay">' + h + '</div></div>';
        }
        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-al]');
            if (!b) return;
            thang += Number(b.getAttribute('data-al'));
            if (thang < 0) { thang = 11; nam--; } else if (thang > 11) { thang = 0; nam++; }
            ve();
        });
        ve();
    };

    /* =====================================================================
       Đồng hồ kim + số (edu.util.roundClock trên <canvas> 300×300 +
       edu.util.digitalClock ở tiêu đề khung). Tự dừng khi màn bị thay.
       ===================================================================== */
    S.dongHo = function (hostKim, hostSo) {
        var vach = '';
        for (var i = 0; i < 60; i++) {
            var goc = i * 6 * PI / 180, dai = i % 5 === 0 ? 10 : 4;
            vach += '<line x1="' + (100 + 88 * Math.sin(goc)).toFixed(1) + '" y1="' + (100 - 88 * Math.cos(goc)).toFixed(1) +
                '" x2="' + (100 + (88 - dai) * Math.sin(goc)).toFixed(1) + '" y2="' + (100 - (88 - dai) * Math.cos(goc)).toFixed(1) +
                '" class="' + (i % 5 === 0 ? 'nscham-dh__vach5' : 'nscham-dh__vach') + '"/>';
        }
        var so = '';
        for (var n = 1; n <= 12; n++) {
            var g = n * 30 * PI / 180;
            so += '<text x="' + (100 + 70 * Math.sin(g)).toFixed(1) + '" y="' + (100 - 70 * Math.cos(g) + 5).toFixed(1) + '">' + n + '</text>';
        }
        hostKim.innerHTML = '<svg class="nscham-dh" viewBox="0 0 200 200" role="img" aria-label="Đồng hồ">' +
            '<circle cx="100" cy="100" r="94" class="nscham-dh__mat"/>' + vach + so +
            '<line data-kim="h" x1="100" y1="100" x2="100" y2="55" class="nscham-dh__gio"/>' +
            '<line data-kim="m" x1="100" y1="100" x2="100" y2="35" class="nscham-dh__phut"/>' +
            '<line data-kim="s" x1="100" y1="112" x2="100" y2="28" class="nscham-dh__giay"/>' +
            '<circle cx="100" cy="100" r="4" class="nscham-dh__tam"/></svg>';
        function hai(x) { return x < 10 ? '0' + x : '' + x; }
        function nhip() {
            if (!document.body.contains(hostKim)) { clearInterval(t); return; }
            var d = new Date(), h = d.getHours(), mi = d.getMinutes(), s = d.getSeconds();
            function xoay(k, deg) { var el = hostKim.querySelector('[data-kim="' + k + '"]'); if (el) el.setAttribute('transform', 'rotate(' + deg + ' 100 100)'); }
            xoay('h', (h % 12) * 30 + mi / 2);
            xoay('m', mi * 6 + s / 10);
            xoay('s', s * 6);
            if (hostSo) hostSo.textContent = hai(h) + ':' + hai(mi) + ':' + hai(s);
        }
        var t = setInterval(nhip, 1000);
        nhip();
    };

    /* =====================================================================
       Khung HAI CỘT: cột trái là các khung tự dựng (lịch âm – dương, danh mục
       ngày lễ, đồng hồ…), cột phải là ums.crud NHÚNG (Thêm / Tải lại ở đầu
       khung như gốc: "Thêm" + "Tải lại" đặt ở box-header của cột phải).
           var k = S.khung(root, { title, trai: [{ title, icon, ve(host) }], crud: {…cfg ums.crud} });
           k.m (pat.master) · k.crud
       ===================================================================== */
    S.khung = function (root, o) {
        var t0 = o.trai[0];
        var m = pat.master({ el: root, title: o.title, side: { title: t0.title, icon: t0.icon, search: false }, main: { title: false } });
        o.trai.forEach(function (k, i) {
            var host = i === 0 ? m.sideBody : S.themKhung(m, { title: k.title, icon: k.icon, flush: true, count: k.count });
            k.ve(host, m);
        });
        var cfg = { root: m.mainBody, embedded: true };
        Object.keys(o.crud).forEach(function (x) { cfg[x] = o.crud[x]; });
        return { m: m, crud: ums.crud(cfg) };
    };

    /* Khung hai cột: cột trái nhiều khung tự dựng (lịch, danh mục…), cột phải
       là ums.crud nhúng. Trả về pat.master; cột trái: m.sideBody (khung đầu)
       và S.themKhung(m, cfg pat.panel) để thêm khung dưới. */
    S.themKhung = function (m, o) {
        var d = document.createElement('div');
        d.innerHTML = pat.panel(o);
        var p = d.firstChild;
        m.side.appendChild(p);
        return p.querySelector('.ums-panel__body');
    };
})(window);
