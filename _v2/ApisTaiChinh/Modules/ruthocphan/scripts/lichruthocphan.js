/* =========================================================================
   Lịch rút học phần (Tài chính)
   Bản gốc: ApisTaiChinh/Modules/ruthocphan/html/lichruthocphan.html + scripts/lichruthocphan.js (LichRutHocPhan)
   Màn CHỈ ĐỌC: cán bộ tài chính theo dõi theo lịch ngày nào có sinh viên rút học phần.
   ---------------------------------------------------------------------------
   Bố cục bản gốc — MỘT cột, bốn khối xếp dọc:
     1. Bộ lọc: Đợt đăng ký · Hệ đào tạo · Từ khóa (lọc TẠI MÁY CHỦ) + khối "Lọc trên kết quả đã tải"
        (thu gọn bằng nút "Bộ lọc nâng cao" trên tiêu đề): Từ / Đến ngày rút, Khóa, Chương trình, Lớp,
        Học phần, Trạng thái người học, Kiểu học — các ô dạng facet (chỉ liệt kê giá trị còn lại, kèm số lượt).
     2. Năm thẻ số liệu + dòng "Kết quả theo bộ lọc" + nút Xuất Excel (toàn bộ kết quả đang lọc).
     3. Trái: lưới TUẦN 7 cột (Tuần trước / nhãn tuần / Tuần sau / Hôm nay), ngày có rút hiện thẻ tóm tắt.
        Phải: lịch tháng nhỏ (ô có rút viền xanh, ngày chọn cam, hôm nay xanh) + chú thích.
     4. Bấm thẻ ngày → hộp "Sinh viên rút học phần - <ngày>" kèm huy hiệu đợt, ô tìm nhanh, chip bộ lọc đang
        áp, bảng 16 cột có dòng tổng, nút Xuất Excel (đúng danh sách đang hiển thị).

   Lời gọi (action kiểu cũ, không func, chép nguyên tham số, đều GET — y hệt DKH kehoachdangky/ruthocphan):
     DKH_RutHocPhan/LayDSThoiGianRut   strNguoiThucHien_Id                      → ô Đợt (ID / THOIGIAN), chọn sẵn mục đầu
     DKH_RutHocPhan/LayDSRut           strTuKhoa, strDaoTao_ThoiGianDaoTao_Id, strDaoTao_HeDaoTao_Id, strNguoiThucHien_Id
                                        → mỗi dòng = 1 sinh viên × 1 học phần, có NGAYRUT_DD_MM_YYYY
     Hệ đào tạo: edu.system.getList_HeDaoTao → ums.ref.heDaoTao (bản không lọc quyền, như gốc; PHẢI truyền pageIndex 1 / pageSize 1000000 — kiểm host 9/11).
   API không lọc theo khoảng ngày và không có số liệu theo ngày → nạp cả đợt rồi nhóm theo ngày ở máy khách
   (như gốc). Không tính lại số liệu: chỉ cộng các cột số của chính danh sách trả về.

   Khác gốc (cách làm, không đổi bố cục):
     · Bỏ nút "Tìm kiếm": gõ Từ khóa là tự nạp lại sau 400 ms / Enter (luật thanh lọc _v2); thêm nút Tải lại chuẩn.
     · Khối "Lọc trên kết quả đã tải" ẨN SẴN (gốc mở sẵn); nút "Bộ lọc nâng cao" mang số bộ lọc đang bật.
     · Xuất Excel dùng ums.ui.xuatBang (bảng HTML .xls) thay edu.exporter — vỏ _v2 không có edu.exporter;
       cột và dòng điều kiện dưới tiêu đề giữ như gốc; hộp "lọc thêm khi xuất" của chuẩn cũ không có.
     · Ngày hôm nay lấy theo máy khách (gốc ưu tiên edu.util.dateToday của máy chủ — _v2 chưa có hàm tương đương).
     · Cặp Từ / Đến ngày rút qua ums.ui.khoangNgay (đến < từ → tự đặt đến = từ) nên lời cảnh báo
       "Từ ngày lớn hơn Đến ngày" của gốc hiếm khi còn hiện, vẫn giữ.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var root = document.getElementById('tc-lichruthocphan');
    if (!root) return;

    /* ---------- CSS của màn: tự nạp một lần (css/lichruthocphan.css cạnh tệp này) ---------- */
    (function napCss() {
        if (document.querySelector('link[data-ums-css="tc-lrhp"]')) return;
        var s = document.currentScript || Array.prototype.filter.call(document.scripts, function (x) { return /lichruthocphan\.js/.test(x.src); }).pop();
        if (!s || !s.src) return;
        var u = new URL('../css/lichruthocphan.css', s.src);
        if (ums.ban) u.searchParams.set('v', String(ums.ban));
        var l = document.createElement('link');
        l.rel = 'stylesheet'; l.href = u.href; l.setAttribute('data-ums-css', 'tc-lrhp');
        document.head.appendChild(l);
    })();

    var C = 'DKH_RutHocPhan/';
    var THU = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ nhật'];
    var TRONG = '__trong__';            // giá trị lọc cho dòng không có thông tin ở trường đó
    /* Các ô lọc trên dữ liệu đã nạp. pre = tiền tố trường (xxx_TEN, xxx_MA) → nhãn "TEN (MA)" khi có mã */
    /* ten = chữ trên chip / tệp Excel (như gốc), lb = nhãn ô lọc (như html gốc) */
    var LOC = [
        { k: 'khoa', pre: 'DAOTAO_KHOADAOTAO', ten: 'Khóa đào tạo', lb: 'Khóa đào tạo', all: 'Tất cả khóa đào tạo' },
        { k: 'ct', pre: 'DAOTAO_CHUONGTRINH', ten: 'Chương trình', lb: 'Chương trình đào tạo', all: 'Tất cả chương trình đào tạo' },
        { k: 'lop', pre: 'DAOTAO_LOPQUANLY', ten: 'Lớp quản lý', lb: 'Lớp quản lý', all: 'Tất cả lớp quản lý' },
        { k: 'hp', pre: 'DAOTAO_HOCPHAN', ten: 'Học phần', lb: 'Học phần', all: 'Tất cả học phần' },
        { k: 'tt', pre: 'QLSV_TRANGTHAINGUOIHOC', ten: 'Trạng thái', lb: 'Trạng thái người học', all: 'Tất cả trạng thái người học' },
        { k: 'kh', pre: 'KIEUHOC', ten: 'Kiểu học', lb: 'Kiểu học', all: 'Tất cả kiểu học' }
    ];

    var S = {
        dtRut: [],          // toàn bộ dòng máy chủ trả cho (đợt, hệ, từ khóa) hiện tại
        dtLoc: [],          // dtRut sau khi áp bộ lọc trên dữ liệu đã nạp
        theoNgay: {},       // 'yyyy-mm-dd' → mảng dòng (đã lọc) của ngày đó
        khongNgay: 0,       // số dòng không đọc được ngày rút
        daNap: false,
        homNay: null, ngayChon: null, thang: 0, nam: 0,
        req: 0,             // chống kết quả cũ ghi đè khi đổi đợt liên tục
        locNgayCu: '|',
        dot: [],
        hop: null           // hộp danh sách một ngày đang mở { dlg, rows, hienThi, k }
    };

    /* ---------- Ngày tháng (Date theo giờ địa phương, 00:00) ---------- */
    function pad2(n) { return (n < 10 ? '0' : '') + n; }
    function key(d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
    function parseKey(k) { var a = String(k).split('-'); return new Date(+a[0], +a[1] - 1, +a[2]); }
    function fmt(d) { return pad2(d.getDate()) + '/' + pad2(d.getMonth() + 1) + '/' + d.getFullYear(); }
    function fmtDai(d) { return THU[(d.getDay() + 6) % 7] + ', ' + fmt(d); }
    function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
    function thuHai(d) { return addDays(d, -((d.getDay() + 6) % 7)); }
    /* 'dd/mm/yyyy' (có thể kèm giờ) → 'yyyy-mm-dd'; không đọc được → '' */
    function parseNgay(str) {
        var m = /(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(String(str == null ? '' : str));
        return m ? m[3] + '-' + pad2(+m[2]) + '-' + pad2(+m[1]) : '';
    }
    /* Ô ngày 'dd/mm/yyyy' → 'yyyy-mm-dd'; rỗng, gõ dở hoặc ngày không có thật (31/02) → '' */
    function docNgay(k) {
        var m = /^\s*(\d{1,2})\/(\d{1,2})\/(\d{4})\s*$/.exec(F(k).value || '');
        if (!m) return '';
        var d = new Date(+m[3], +m[2] - 1, +m[1]);
        if (d.getDate() !== +m[1] || d.getMonth() !== +m[2] - 1) return '';
        return key(d);
    }

    /* ---------- Tiện ích hiển thị ---------- */
    function e(v) { return v === null || v === undefined ? '' : v; }
    function toNum(v) { var n = parseFloat(String(e(v)).replace(/,/g, '')); return isNaN(n) ? 0 : n; }
    function fmtNum(n) { return String(Math.round(n * 100) / 100); }
    function fmtTien(n) { return ui.money(Math.round(n)); }
    function fmtSo(n) { return ui.so(Math.round(n)); }
    /* Giá trị rỗng → gạch mờ để phân biệt với "0" */
    function gt(v) { return (v == null || String(v).trim() === '') ? '<span class="ums-u-faint">—</span>' : esc(v); }
    function chuanHoa(s) {
        s = String(e(s)).toLowerCase();
        if (s.normalize) s = s.normalize('NFD');
        return s.replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
    }
    /* "TEN (MA)" theo tiền tố trường; không có mã thì chỉ TEN */
    function nhan(r, pre) {
        var ten = String(e(r[pre + '_TEN'])).trim(), ma = String(e(r[pre + '_MA'])).trim();
        if (!ten && !ma) return '';
        if (ma && ma !== ten) return ten ? ten + ' (' + ma + ')' : ma;
        return ten;
    }
    /* Mã đợt "2026_2027_1,1" → "Năm học 2026-2027 · Học kỳ 1 · Đợt 1"; không khớp mẫu thì giữ nguyên */
    function nhanDot(str) {
        var m = /^\s*(\d{4})_(\d{4})_(\d+)\s*,\s*(\d+)\s*$/.exec(String(e(str)));
        return m ? 'Năm học ' + m[1] + '-' + m[2] + ' · Học kỳ ' + m[3] + ' · Đợt ' + m[4] : String(e(str));
    }
    function hoTen(r) { return (String(e(r.QLSV_NGUOIHOC_HODEM)) + ' ' + String(e(r.QLSV_NGUOIHOC_TEN))).trim(); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function F(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function chuOption(sel) { var o = sel && sel.options[sel.selectedIndex]; return o ? o.text.trim() : ''; }
    function tenDot() { return F('dot').value ? chuOption(F('dot')) : 'Tất cả đợt'; }
    function s2(el) { if (window.jQuery) jQuery(el).trigger('change.select2'); }
    /* Thông báo trong trang (i = thông tin, w = cảnh báo, e = lỗi) */
    function thongBao(loai, noiDung) {
        var icon = { i: 'fa-circle-info', w: 'fa-triangle-exclamation', e: 'fa-circle-xmark' }[loai] || 'fa-circle-info';
        z('tb').innerHTML = '<div class="ums-lrhp-banner' + (loai === 'i' ? '' : ' is-' + loai) + '"><i class="fa-light ' + icon + '"></i><span>' + esc(noiDung) + '</span></div>';
    }

    /* ---------- Dựng khung ---------- */
    function oChon(k, all) { return '<select class="ums-select" data-f="' + k + '"><option value="">' + esc(all) + '</option></select>'; }
    root.innerHTML =
        pat.page('Lịch rút học phần') +
        pat.panel({
            title: 'Bộ lọc', icon: 'fa-filter', cls: 'ums-u-mb-4',
            tools: '<span class="ums-badge ums-badge--info" data-z="soLoc" hidden>0</span>' +
                ui.btn('search', { text: 'Bộ lọc nâng cao', icon: 'fa-sliders', mod: 'ghost', attr: { 'data-a': 'adv', 'aria-expanded': 'false', title: 'Thu gọn / mở rộng bộ lọc nâng cao' } }) +
                ui.btn('reload', { attr: { 'data-a': 'tai' } }),
            body:
                '<div class="ums-grid ums-grid--4">' +
                    ui.field('Đợt đăng ký', oChon('dot', 'Tất cả đợt')) +
                    ui.field('Hệ đào tạo', oChon('he', 'Tất cả hệ đào tạo')) +
                    ui.field('Từ khóa', '<input class="ums-input" data-f="tuKhoa" placeholder="Mã sinh viên hoặc họ và tên" autocomplete="off">') +
                    '<div class="ums-field ums-lrhp-acts">' + ui.btn('search', { text: 'Xóa bộ lọc', icon: 'fa-eraser', mod: 'ghost', attr: { 'data-a': 'xoaLoc' } }) + '</div>' +
                '</div>' +
                /* Lọc ngay trên dữ liệu đã nạp (không gọi lại máy chủ); số trong ngoặc = số lượt rút */
                '<div class="ums-lrhp-adv" data-z="adv" hidden>' +
                    '<div class="ums-legend">Lọc trên kết quả đã tải</div>' +
                    '<div class="ums-grid ums-grid--4">' +
                        ui.field('Từ ngày rút', '<input class="ums-input" data-f="tu" data-date data-range="rut:tu" placeholder="dd/mm/yyyy" maxlength="10" autocomplete="off">') +
                        ui.field('Đến ngày rút', '<input class="ums-input" data-f="den" data-date data-range="rut:den" placeholder="dd/mm/yyyy" maxlength="10" autocomplete="off">') +
                        LOC.map(function (f) { return ui.field(f.lb, oChon(f.k, f.all)); }).join('') +
                    '</div>' +
                '</div>'
        }) +
        '<div class="ums-lrhp-kpis" data-z="kpi"></div>' +
        '<div class="ums-lrhp-kpifoot"><div class="ums-lrhp-cap" data-z="cap"></div>' +
            ui.btn('excel', { text: 'Xuất Excel', attr: { 'data-a': 'xuat', disabled: 'disabled', title: 'Xuất Excel toàn bộ kết quả đang lọc (tất cả các ngày)' } }) + '</div>' +
        '<div class="ums-lrhp-main">' +
            pat.panel({
                title: 'Lịch rút học phần', icon: 'fa-calendar',
                tools: '<div class="ums-lrhp-weeknav">' +
                    '<button type="button" class="ums-iconbtn" data-a="tuan-1" title="Tuần trước"><i class="fa-light fa-chevron-left"></i></button>' +
                    '<b data-z="nhanTuan"></b>' +
                    '<button type="button" class="ums-iconbtn" data-a="tuan1" title="Tuần sau"><i class="fa-light fa-chevron-right"></i></button>' +
                    ui.btn('search', { text: 'Hôm nay', icon: 'fa-calendar-day', mod: 'ghost', cls: 'ums-btn--sm', attr: { 'data-a': 'homNay', title: 'Về tuần hiện tại' } }) +
                    '</div>',
                body: '<div data-z="tb"></div><div class="ums-lrhp-scroll"><div class="ums-lrhp-week" data-z="tuan"></div></div>'
            }) +
            pat.panel({
                title: false,
                body: '<div data-z="thang"></div>' +
                    '<div class="ums-lrhp-legend">' +
                    '<div><i class="is-co"></i> Ngày có sinh viên rút học phần</div>' +
                    '<div><i class="is-chon"></i> Ngày đang chọn</div>' +
                    '<div><i class="is-nay"></i> Hôm nay</div>' +
                    '<div><i class="is-tuan"></i> Tuần đang xem</div>' +
                    '</div>'
            }) +
        '</div>';

    /* ---------- Nạp dữ liệu từ máy chủ ---------- */
    function napHeDaoTao() {
        // kiểm host 9/11: gọi không tham số → pageIndex / pageSize = 0 → ORA-24338 (con trỏ không mở); truyền đúng objList của gốc
        return ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 }).then(function (rows) {
            var el = F('he');
            el.innerHTML = '<option value="">Tất cả hệ đào tạo</option>' + (rows || []).map(function (r) {
                return '<option value="' + esc(r.ID) + '">' + esc(r.TENHEDAOTAO) + '</option>';
            }).join('');
            s2(el);
        }).catch(function (err) { ums.api.handle(err, 'hệ đào tạo'); });
    }
    function napDot() {
        return ums.api.call({ action: C + 'LayDSThoiGianRut', strNguoiThucHien_Id: '', method: 'GET' }).then(function (x) {
            S.dot = Array.isArray(x.data) ? x.data : [];
            var el = F('dot');
            el.innerHTML = '<option value="">Tất cả đợt</option>' + S.dot.map(function (r) {
                return '<option value="' + esc(r.ID) + '">' + esc(nhanDot(r.THOIGIAN)) + '</option>';
            }).join('');
            /* gốc: selectFirst → chọn sẵn đợt đầu rồi nạp dữ liệu một lần */
            if (S.dot.length) { el.value = String(S.dot[0].ID); s2(el); napRut(); }
            else { S.daNap = true; apDungLoc(false); }
        }).catch(function (err) {
            thongBao('e', C + 'LayDSThoiGianRut: ' + (err && err.message ? err.message : 'lỗi kết nối'));
        });
    }
    function napRut() {
        var req = ++S.req;
        var o = {
            action: C + 'LayDSRut', method: 'GET',
            strTuKhoa: (F('tuKhoa').value || '').trim(),
            strDaoTao_ThoiGianDaoTao_Id: F('dot').value || '',
            strDaoTao_HeDaoTao_Id: F('he').value || '',
            strNguoiThucHien_Id: ''
        };
        thongBao('i', 'Đang tải dữ liệu rút học phần...');
        return ums.api.call(o).then(function (x) {
            if (req !== S.req) return;                   // đã đổi điều kiện, bỏ kết quả cũ
            S.daNap = true;
            S.dtRut = Array.isArray(x.data) ? x.data : [];
            chuanBi(S.dtRut);
            apDungLoc(true);
        }).catch(function (err) {
            if (req !== S.req) return;
            S.daNap = true;
            S.dtRut = [];
            apDungLoc(true);
            thongBao('e', o.action + ': ' + (err && err.message ? err.message : 'lỗi kết nối'));
        });
    }
    /* Tính sẵn một lần cho mỗi dòng (khóa ngày, nhãn các ô lọc, số) để lọc nhiều lần không tính lại */
    function chuanBi(arr) {
        arr.forEach(function (r) {
            r._k = parseNgay(r.NGAYRUT_DD_MM_YYYY);
            r._lb = {};
            LOC.forEach(function (f) { r._lb[f.k] = nhan(r, f.pre) || TRONG; });
            r._tien = toNum(r.SOTIENPHAINOP);
            r._tcp = toNum(r.SOTINCHI_TINHPHI);
            r._tch = toNum(r.SOTINCHI_HOCTAP);
            r._sv = String(r.QLSV_NGUOIHOC_ID || r.QLSV_NGUOIHOC_MASO || r.ID);
            r._hp = String(r.DAOTAO_HOCPHAN_ID || r.DAOTAO_HOCPHAN_MA || r.DAOTAO_HOCPHAN_TEN);
            r._hs = undefined;
        });
    }

    /* ---------- Lọc trên dữ liệu đã nạp ---------- */
    function docLoc() {
        var o = { tu: docNgay('tu'), den: docNgay('den') };
        LOC.forEach(function (f) { o[f.k] = F(f.k).value || ''; });
        return o;
    }
    /* Dòng có thỏa bộ lọc không (boQua = ô lọc không tính — khi dựng danh sách lựa chọn của chính ô đó) */
    function dat(r, o, boQua) {
        for (var i = 0; i < LOC.length; i++) {
            var k = LOC[i].k;
            if (k !== boQua && o[k] && r._lb[k] !== o[k]) return false;
        }
        if (o.tu && (!r._k || r._k < o.tu)) return false;
        if (o.den && (!r._k || r._k > o.den)) return false;
        return true;
    }
    /* Dựng lại lựa chọn từng ô (facet). Trả true nếu có ô bị đưa về "Tất cả" vì giá trị cũ không còn */
    function taoOptionLoc() {
        var o = docLoc(), doi = false;
        LOC.forEach(function (f) {
            var dem = {};
            S.dtRut.forEach(function (r) { if (dat(r, o, f.k)) { var lb = r._lb[f.k]; dem[lb] = (dem[lb] || 0) + 1; } });
            var keys = Object.keys(dem).sort(function (a, b) {
                if (a === TRONG) return 1;
                if (b === TRONG) return -1;
                return a.localeCompare(b, 'vi');
            });
            var cur = o[f.k];
            var h = '<option value="">' + esc(f.all) + '</option>';
            keys.forEach(function (k) {
                h += '<option value="' + esc(k) + '">' + esc(k === TRONG ? '(Chưa có thông tin)' : k) + ' (' + dem[k] + ')</option>';
            });
            if (cur && dem[cur] === undefined) { cur = ''; doi = true; }
            var el = F(f.k);
            el.innerHTML = h; el.value = cur; s2(el);
        });
        return doi;
    }
    /* Áp bộ lọc → nhóm theo ngày → vẽ lại. veDauTien = true sau khi nạp mới: mở tới ngày rút gần nhất */
    function apDungLoc(veDauTien) {
        for (var i = 0; i < 4; i++) { if (!taoOptionLoc()) break; }   // bỏ một lựa chọn có thể làm đổi lựa chọn các ô khác
        var o = docLoc();
        S.locNgayCu = o.tu + '|' + o.den;
        S.dtLoc = S.dtRut.filter(function (r) { return dat(r, o, null); });
        var oKN = {}; Object.keys(o).forEach(function (k) { oKN[k] = o[k]; }); oKN.tu = ''; oKN.den = '';
        S.khongNgay = S.dtRut.filter(function (r) { return !r._k && dat(r, oKN, null); }).length;
        S.theoNgay = {};
        S.dtLoc.forEach(function (r) { if (r._k) (S.theoNgay[r._k] = S.theoNgay[r._k] || []).push(r); });

        var keys = Object.keys(S.theoNgay).sort();
        if (keys.length) {
            if (veDauTien) S.ngayChon = parseKey(keys[keys.length - 1]);
            else if (!coDuLieuTuan()) S.ngayChon = parseKey(ganNhat(keys));
        } else if (veDauTien) S.ngayChon = S.homNay;
        S.thang = S.ngayChon.getMonth() + 1;
        S.nam = S.ngayChon.getFullYear();

        veTatCa();
        veKpi(keys);
        veSoLoc(o);
        var bx = root.querySelector('[data-a="xuat"]');
        if (bx) bx.disabled = S.dtLoc.length === 0;
        capNhatThongBao();
    }
    function xoaLoc() {
        ['tu', 'den'].forEach(function (k) { var el = F(k); if (el._flatpickr) el._flatpickr.clear(); else el.value = ''; });
        LOC.forEach(function (f) { F(f.k).value = ''; s2(F(f.k)); });
        /* Từ khóa / hệ đào tạo là lọc tại máy chủ: chỉ nạp lại khi đang có giá trị */
        var canNap = !!((F('tuKhoa').value || '').trim() || F('he').value);
        F('tuKhoa').value = '';
        F('he').value = ''; s2(F('he'));
        if (canNap) napRut(); else apDungLoc(false);
    }
    function coDuLieuTuan() {
        var t2 = thuHai(S.ngayChon);
        for (var i = 0; i < 7; i++) if (S.theoNgay[key(addDays(t2, i))]) return true;
        return false;
    }
    /* Ngày có dữ liệu gần nhất với ngày đang chọn */
    function ganNhat(keys) {
        var min = Infinity, kq = keys[0];
        keys.forEach(function (k) { var c = Math.abs(parseKey(k) - S.ngayChon); if (c < min) { min = c; kq = k; } });
        return kq;
    }
    function capNhatThongBao() {
        if (!S.daNap) return;
        if (S.dtRut.length === 0) thongBao('i', 'Không có sinh viên rút học phần theo đợt / hệ đào tạo / từ khóa đã chọn.');
        else if (S.dtLoc.length === 0) {
            var o = docLoc();
            if (o.tu && o.den && o.tu > o.den) thongBao('w', '"Từ ngày rút" đang lớn hơn "Đến ngày rút" nên không có kết quả. Hãy kiểm tra lại khoảng ngày.');
            else thongBao('w', 'Không có dữ liệu phù hợp với bộ lọc hiện tại. Bấm "Xóa bộ lọc" để xem lại toàn bộ.');
        }
        else if (S.khongNgay > 0) thongBao('w', 'Có ' + fmtSo(S.khongNgay) + ' lượt rút không có ngày rút nên không hiện trên lịch.');
        else z('tb').innerHTML = '';
    }

    /* Tóm tắt một nhóm dòng rút (một ngày hoặc toàn bộ kết quả lọc) */
    function tomTat(arr) {
        var sv = {}, hp = {}, tien = 0, tcp = 0, tch = 0;
        arr.forEach(function (r) {
            sv[r._sv] = 1;
            if (!hp[r._hp]) hp[r._hp] = { ten: r.DAOTAO_HOCPHAN_TEN, ma: r.DAOTAO_HOCPHAN_MA, n: 0 };
            hp[r._hp].n++;
            tien += r._tien; tcp += r._tcp; tch += r._tch;
        });
        var dsHP = Object.keys(hp).map(function (k) { return hp[k]; }).sort(function (a, b) { return b.n - a.n; });
        return { iSV: Object.keys(sv).length, iLuot: arr.length, iHP: dsHP.length, dsHP: dsHP, tien: tien, tcp: tcp, tch: tch };
    }

    /* ---------- Điều hướng lịch ---------- */
    function chonNgay(k) {
        S.ngayChon = parseKey(k);
        S.thang = S.ngayChon.getMonth() + 1; S.nam = S.ngayChon.getFullYear();
        veTatCa();
    }
    function chuyenTuan(n) { chonNgay(key(addDays(S.ngayChon, 7 * n))); }
    /* Chỉ xem tháng khác trên lịch nhỏ, KHÔNG đổi tuần đang chọn */
    function chuyenThang(n) {
        S.thang += n;
        if (S.thang === 0) { S.thang = 12; S.nam--; }
        if (S.thang === 13) { S.thang = 1; S.nam++; }
        veThang();
    }

    /* ---------- Vẽ ---------- */
    function veTatCa() { veThang(); veTuan(); }
    function veKpi(keys) {
        var t = tomTat(S.dtLoc);
        function the(icon, tone, giaTri, nhanThe) {
            return '<div class="ums-stat' + (tone ? ' ums-stat--' + tone : '') + '"><div class="ums-stat__icon"><i class="fa-light ' + icon + '"></i></div>' +
                '<div class="ums-stat__main"><div class="ums-stat__value">' + giaTri + '</div><div class="ums-stat__label">' + nhanThe + '</div></div></div>';
        }
        z('kpi').innerHTML =
            the('fa-rectangle-list', '', fmtSo(t.iLuot), 'Lượt rút học phần') +
            the('fa-users', 'green', fmtSo(t.iSV), 'Sinh viên rút') +
            the('fa-book', 'purple', fmtSo(t.iHP), 'Học phần bị rút') +
            the('fa-calendar-check', 'amber', fmtSo(keys.length), 'Ngày có sinh viên rút') +
            the('fa-money-bill', 'red', fmtTien(t.tien), 'Số tiền phải nộp (đ)');
        var cap = 'Kết quả theo bộ lọc: <b>' + fmtSo(S.dtLoc.length) + '</b> / ' + fmtSo(S.dtRut.length) + ' lượt rút';
        if (S.daNap) cap += ' - ' + esc(tenDot());
        z('cap').innerHTML = cap;
    }
    /* Số bộ lọc "trên dữ liệu đã nạp" đang bật — hiện trên nút Bộ lọc nâng cao */
    function veSoLoc(o) {
        var n = (o.tu ? 1 : 0) + (o.den ? 1 : 0);
        LOC.forEach(function (f) { if (o[f.k]) n++; });
        var b = z('soLoc'); b.textContent = n; b.hidden = n === 0;
    }
    function veThang() {
        var y = S.nam, m = S.thang;
        var pad = (new Date(y, m - 1, 1).getDay() + 6) % 7;
        var days = new Date(y, m, 0).getDate();
        var cells = Math.ceil((pad + days) / 7) * 7;
        var kNay = key(S.homNay), kChon = key(S.ngayChon);
        var t2 = thuHai(S.ngayChon), kT2 = key(t2), kCN = key(addDays(t2, 6));
        var h = '';
        for (var c = 0; c < cells; c++) {
            var d = new Date(y, m - 1, 1 - pad + c), k = key(d), arr = S.theoNgay[k];
            var cls = 'ums-lthang__o';
            if (d.getMonth() !== m - 1) cls += ' is-khac';
            if (arr) cls += ' has-lich';
            if (k === kNay) cls += ' is-today';
            if (k === kChon) cls += ' is-active';
            if (k >= kT2 && k <= kCN) cls += ' is-tuan';
            var title = fmtDai(d) + (arr ? ' - ' + tomTat(arr).iSV + ' sinh viên rút (' + arr.length + ' lượt)' : '');
            h += '<button type="button" class="' + cls + '" data-ngay="' + k + '" title="' + esc(title) + '">' + d.getDate() + '</button>';
        }
        z('thang').innerHTML = '<div class="ums-lthang"><div class="ums-lthang__head">' +
            '<button type="button" class="ums-iconbtn" data-th="-1" title="Tháng trước"><i class="fa-light fa-chevron-left"></i></button>' +
            '<b>Tháng ' + m + ' - ' + y + '</b>' +
            '<button type="button" class="ums-iconbtn" data-th="1" title="Tháng sau"><i class="fa-light fa-chevron-right"></i></button></div>' +
            '<div class="ums-lthang__thu"><span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span></div>' +
            '<div class="ums-lthang__ngay">' + h + '</div></div>';
    }
    function veTuan() {
        var t2 = thuHai(S.ngayChon);
        z('nhanTuan').textContent = fmt(t2) + ' - ' + fmt(addDays(t2, 6));
        var kNay = key(S.homNay), kChon = key(S.ngayChon), h = '';
        for (var i = 0; i < 7; i++) {
            var d = addDays(t2, i), k = key(d);
            h += '<div class="ums-lrhp-day' + (k === kNay ? ' is-today' : '') + (k === kChon ? ' is-sel' : '') + '" data-ngay="' + k + '">' +
                '<div class="ums-lrhp-day__head"><div class="w">' + THU[i] + '</div><div class="d">' + fmt(d) + '</div></div>' +
                (S.theoNgay[k] ? theNgay(k, S.theoNgay[k]) : '<div class="ums-lrhp-day__trong">Không có</div>') + '</div>';
        }
        z('tuan').innerHTML = h;
        /* Màn hẹp: lưới cuộn ngang, đưa cột ngày đang chọn vào giữa khung */
        var sc = root.querySelector('.ums-lrhp-scroll'), sel = z('tuan').querySelector('.ums-lrhp-day.is-sel');
        if (sc && sel && sc.scrollWidth > sc.clientWidth) {
            var vt = sel.getBoundingClientRect().left - sc.getBoundingClientRect().left + sc.scrollLeft;
            sc.scrollLeft = vt - (sc.clientWidth - sel.offsetWidth) / 2;
        } else if (sc) sc.scrollLeft = 0;
    }
    /* Thẻ tóm tắt của một ngày */
    function theNgay(k, arr) {
        var t = tomTat(arr);
        var h = '<div class="ums-lrhp-card" data-ngay="' + k + '" tabindex="0" role="button" title="Bấm để xem danh sách sinh viên rút ngày ' + fmt(parseKey(k)) + '">' +
            '<div class="ums-lrhp-card__head">' + fmtSo(t.iSV) + ' sinh viên rút<small>' + fmtSo(t.iLuot) + ' lượt rút</small></div>' +
            '<div class="ums-lrhp-card__body">' +
            '<div class="ums-lrhp-kv"><span>Số học phần</span><b>' + fmtSo(t.iHP) + '</b></div>' +
            '<div class="ums-lrhp-kv"><span>Tín chỉ tính phí</span><b>' + fmtNum(t.tcp) + '</b></div>' +
            '<div class="ums-lrhp-kv ums-lrhp-kv--big"><span>Số tiền phải nộp (đ)</span><b>' + fmtTien(t.tien) + '</b></div>' +
            '<div class="ums-lrhp-hpcap">Rút nhiều nhất</div><ul class="ums-lrhp-hp">';
        t.dsHP.slice(0, 3).forEach(function (x) {
            h += '<li title="' + esc(e(x.ten)) + (x.ma ? ' (' + esc(x.ma) + ')' : '') + ' - ' + x.n + ' lượt"><span>' + esc(e(x.ten)) + '</span><b>' + x.n + '</b></li>';
        });
        h += '</ul>';
        if (t.dsHP.length > 3) h += '<div class="ums-lrhp-more">và ' + (t.dsHP.length - 3) + ' học phần khác</div>';
        h += '<div class="ums-lrhp-view"><i class="fa-light fa-eye"></i> Xem chi tiết</div></div></div>';
        return h;
    }

    /* ---------- Hộp danh sách sinh viên rút của một ngày ---------- */
    function sapXep(a, b) {
        var x = String(a.QLSV_NGUOIHOC_MASO || ''), y = String(b.QLSV_NGUOIHOC_MASO || '');
        if (x !== y) return x < y ? -1 : 1;
        x = String(a.DAOTAO_HOCPHAN_MA || ''); y = String(b.DAOTAO_HOCPHAN_MA || '');
        return x < y ? -1 : (x > y ? 1 : 0);
    }
    /* Các điều kiện đang áp: [[tên, giá trị], …] — chip trong hộp và dòng điều kiện của tệp Excel */
    function chipLoc() {
        var ds = [];
        if (F('he').value) ds.push(['Hệ đào tạo', chuOption(F('he'))]);
        var tk = (F('tuKhoa').value || '').trim();
        if (tk) ds.push(['Từ khóa', tk]);
        var o = docLoc();
        if (o.tu) ds.push(['Từ ngày rút', fmt(parseKey(o.tu))]);
        if (o.den) ds.push(['Đến ngày rút', fmt(parseKey(o.den))]);
        LOC.forEach(function (f) { if (o[f.k]) ds.push([f.ten, o[f.k] === TRONG ? '(Chưa có thông tin)' : o[f.k]]); });
        return ds;
    }
    function lopHocPhan(r) {
        var ds = String(e(r.DSLOPHOCPHAN)).split(/,(?=\S)/).filter(function (s) { return s.trim() !== ''; });
        return ds.length ? '<div class="ums-lrhp-lop">' + ds.map(function (s) { return '<div>' + esc(s.trim()) + '</div>'; }).join('') + '</div>' : gt('');
    }
    var COT_HOP = [
        { title: 'Mã sinh viên', cls: 'is-nowrap', render: function (r) { return gt(r.QLSV_NGUOIHOC_MASO); } },
        { title: 'Họ và tên', cls: 'is-nowrap', render: function (r) { return gt(hoTen(r)); } },
        { title: 'Lớp quản lý', cls: 'is-nowrap', render: function (r) { return gt(nhan(r, 'DAOTAO_LOPQUANLY')); } },
        { title: 'Học phần', render: function (r) { return gt(nhan(r, 'DAOTAO_HOCPHAN')); } },
        { title: 'Lớp học phần', render: lopHocPhan },
        { title: 'Số tín chỉ học tập', cls: 'is-right', render: function (r) { return gt(r.SOTINCHI_HOCTAP); } },
        { title: 'Số tín chỉ tính phí', cls: 'is-right', render: function (r) { return gt(r.SOTINCHI_TINHPHI); } },
        { title: 'Tỷ lệ tính phí (%)', cls: 'is-center', render: function (r) { return gt(r.PHANTRAMPHITINH); } },
        { title: 'Số tiền phải nộp (đ)', cls: 'is-right is-nowrap', render: function (r) { return String(e(r.SOTIENPHAINOP)).trim() === '' ? gt('') : fmtTien(r._tien); } },
        { title: 'Chương trình đào tạo', render: function (r) { return gt(nhan(r, 'DAOTAO_CHUONGTRINH')); } },
        { title: 'Khóa đào tạo', cls: 'is-nowrap', render: function (r) { return gt(nhan(r, 'DAOTAO_KHOADAOTAO')); } },
        { title: 'Trạng thái người học', cls: 'is-nowrap', render: function (r) { return gt(nhan(r, 'QLSV_TRANGTHAINGUOIHOC')); } },
        { title: 'Kiểu học', cls: 'is-nowrap', render: function (r) { return gt(nhan(r, 'KIEUHOC')); } },
        { title: 'Người thực hiện rút', cls: 'is-nowrap', render: function (r) { return gt(r.NGUOIRUT_TAIKHOAN); } },
        { title: 'Ghi chú', render: function (r) { return gt(r.GHICHU); } }
    ];
    function moChiTiet(k) {
        var arr = S.theoNgay[k];
        if (!arr || !arr.length) return;
        var body = document.createElement('div');
        body.innerHTML =
            '<div class="ums-lrhp-tool">' + ui.badge(tenDot(), 'info') + '<div class="ums-lrhp-tong" data-x="tong"></div>' +
            '<div class="ums-lrhp-tim"><input class="ums-input" data-x="tim" placeholder="Tìm theo mã sinh viên, họ tên, học phần, lớp..." autocomplete="off"></div></div>' +
            '<div class="ums-chips ums-lrhp-chips" data-x="chips" hidden></div>' +
            '<div data-x="bang"></div><div class="ums-tablefoot" data-x="foot"></div>';
        var hop = S.hop = {
            k: k,
            rows: arr.slice().sort(sapXep),   // các học phần của cùng một sinh viên nằm liền nhau
            hienThi: [],
            body: body
        };
        hop.dlg = ui.dialog({
            title: 'Sinh viên rút học phần - ' + fmtDai(parseKey(k)), icon: 'fa-user-xmark', size: 'xl', body: body,
            buttons: [{ text: 'Xuất Excel', kind: 'excel', keepOpen: true, onClick: function () { xuat(true); return false; } }],
            onClose: function () { if (S.hop === hop) S.hop = null; }
        });
        /* Chip nhắc bộ lọc đang áp để người xem hiểu vì sao danh sách có thể ít hơn tổng của ngày */
        var chips = chipLoc(), zc = body.querySelector('[data-x="chips"]');
        zc.hidden = !chips.length;
        zc.innerHTML = chips.length ? '<span class="ums-u-muted">Đang lọc:</span> ' + chips.map(function (c) {
            return '<span class="ums-chip">' + esc(c[0]) + ': <b>' + esc(c[1]) + '</b></span>';
        }).join(' ') : '';
        body.querySelector('[data-x="tim"]').addEventListener('input', veHop);
        veHop();
    }
    function veHop() {
        var hop = S.hop; if (!hop) return;
        var b = hop.body, tim = chuanHoa(b.querySelector('[data-x="tim"]').value).trim();
        var arr = hop.rows.filter(function (r) {
            if (!tim) return true;
            if (r._hs === undefined) {
                r._hs = chuanHoa([r.QLSV_NGUOIHOC_MASO, r.QLSV_NGUOIHOC_HODEM, r.QLSV_NGUOIHOC_TEN, r.DAOTAO_HOCPHAN_TEN,
                    r.DAOTAO_HOCPHAN_MA, r.DSLOPHOCPHAN, r.DAOTAO_LOPQUANLY_TEN, r.NGUOIRUT_TAIKHOAN, r.GHICHU].join(' '));
            }
            return r._hs.indexOf(tim) !== -1;
        });
        hop.hienThi = arr;
        var t = tomTat(arr);
        var tong = '<b>' + fmtSo(t.iSV) + '</b> sinh viên · <b>' + fmtSo(t.iLuot) + '</b> lượt rút · <b>' + fmtSo(t.iHP) + '</b> học phần';
        if (arr.length !== hop.rows.length) tong += ' <span class="ums-u-muted">(hiển thị ' + fmtSo(arr.length) + '/' + fmtSo(hop.rows.length) + ' lượt rút)</span>';
        b.querySelector('[data-x="tong"]').innerHTML = tong;

        /* nhóm theo sinh viên: g0 / g1 xen kẽ, dòng đầu nhóm có vạch */
        var svTruoc = null, nhom = 0;
        arr.forEach(function (r) { var dau = r._sv !== svTruoc; if (dau) { nhom++; svTruoc = r._sv; } r._g = nhom % 2; r._dau = dau; });
        ui.table({
            el: b.querySelector('[data-x="bang"]'), rows: arr, columns: COT_HOP,
            empty: 'Không có dòng nào khớp với từ khóa tìm kiếm.',
            rowCls: function (r) { return (r._g ? 'ums-lrhp-g1' : '') + (r._dau ? ' ums-lrhp-first' : ''); }
        });
        /* Dòng tổng các cột số (không cộng STT, không cộng %) — theo các dòng đang hiển thị */
        b.querySelector('[data-x="foot"]').innerHTML = arr.length ? '<span>Tổng</span><span class="ums-tablefoot__sum">' +
            pat.footSum('Số tín chỉ học tập', fmtNum(t.tch)) + pat.footSum('Số tín chỉ tính phí', fmtNum(t.tcp)) +
            pat.footSum('Số tiền phải nộp (đ)', fmtTien(t.tien)) + '</span>' : '';
        var bx = hop.dlg.el.querySelector('.ums-dialog__foot .ums-btn--out-success, .ums-dialog__foot [data-dlg="0"]');
        if (bx) bx.disabled = arr.length === 0;
    }

    /* ---------- Xuất Excel: theoNgay = danh sách đang hiển thị trong hộp; không thì toàn bộ kết quả đang lọc ---------- */
    function xuat(theoNgay) {
        var arr = theoNgay ? (S.hop ? S.hop.hienThi : []) : S.dtLoc;
        if (!arr || !arr.length) { ui.toast('Không có dữ liệu để xuất.', 'warn'); return; }
        var ngay = theoNgay ? fmt(parseKey(S.hop.k)) : '';
        /* Dòng điều kiện dưới tiêu đề: người đọc tệp biết dữ liệu lấy với điều kiện nào */
        var phu = ['Đợt đăng ký: ' + tenDot()];
        if (theoNgay) phu.push('Ngày rút: ' + fmtDai(parseKey(S.hop.k)));
        chipLoc().forEach(function (c) { phu.push(c[0] + ': ' + c[1]); });
        var tim = theoNgay ? S.hop.body.querySelector('[data-x="tim"]').value.trim() : '';
        if (tim) phu.push('Tìm trong danh sách: "' + tim + '"');

        /* Toàn bộ kết quả: sắp theo ngày rút, rồi mã sinh viên, rồi mã học phần (dòng không có ngày xếp cuối) */
        var rows = arr.slice();
        if (!theoNgay) rows.sort(function (a, b) {
            if (a._k !== b._k) { if (!a._k) return 1; if (!b._k) return -1; return a._k < b._k ? -1 : 1; }
            return sapXep(a, b);
        });
        function c(title, fn, cls) { return { title: title, cls: cls || '', render: function (r) { return esc(e(fn(r))); } }; }
        function n(pre) { return function (r) { return nhan(r, pre); }; }
        var cot = [
            c('Ngày rút', function (r) { return r.NGAYRUT_DD_MM_YYYY; }, 'is-center'),
            c('Mã sinh viên', function (r) { return r.QLSV_NGUOIHOC_MASO; }),
            c('Họ và tên', hoTen),
            c('Lớp quản lý', n('DAOTAO_LOPQUANLY')),
            c('Mã học phần', function (r) { return r.DAOTAO_HOCPHAN_MA; }),
            c('Tên học phần', function (r) { return r.DAOTAO_HOCPHAN_TEN; }),
            c('Lớp học phần', function (r) { return r.DSLOPHOCPHAN; }),
            c('Số tín chỉ học tập', function (r) { return r.SOTINCHI_HOCTAP; }),
            c('Số tín chỉ tính phí', function (r) { return r.SOTINCHI_TINHPHI; }),
            c('Tỷ lệ tính phí (%)', function (r) { return r.PHANTRAMPHITINH; }),
            c('Số tiền phải nộp (đ)', function (r) { return r.SOTIENPHAINOP; }),
            c('Chương trình đào tạo', n('DAOTAO_CHUONGTRINH')),
            c('Khóa đào tạo', n('DAOTAO_KHOADAOTAO')),
            c('Trạng thái người học', n('QLSV_TRANGTHAINGUOIHOC')),
            c('Kiểu học', n('KIEUHOC')),
            c('Người thực hiện rút', function (r) { return r.NGUOIRUT_TAIKHOAN; }),
            c('Ghi chú', function (r) { return r.GHICHU; })
        ];
        var tmp = document.createElement('div');
        ui.table({ el: tmp, rows: rows, columns: cot, empty: 'Không có dữ liệu' });
        ui.xuatBang(tmp, {
            ten: theoNgay ? 'SinhVienRutHocPhan_Ngay' + ngay.replace(/\//g, '') : 'SinhVienRutHocPhan',
            tieuDe: 'DANH SÁCH SINH VIÊN RÚT HỌC PHẦN' + (theoNgay ? ' NGÀY ' + ngay : ''),
            phu: phu
        });
    }

    /* ---------- Sự kiện ---------- */
    var hen = null;
    root.addEventListener('click', function (ev) {
        var th = ev.target.closest('[data-th]');
        if (th) { chuyenThang(+th.getAttribute('data-th')); return; }
        var o = ev.target.closest('.ums-lthang__o[data-ngay]');
        if (o) { chonNgay(o.getAttribute('data-ngay')); return; }
        var card = ev.target.closest('.ums-lrhp-card[data-ngay]');
        if (card) { moChiTiet(card.getAttribute('data-ngay')); return; }
        var b = ev.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'adv') {
            var adv = z('adv'); adv.hidden = !adv.hidden;
            b.setAttribute('aria-expanded', String(!adv.hidden));
        }
        else if (a === 'tai') napRut();
        else if (a === 'xoaLoc') xoaLoc();
        else if (a === 'xuat') xuat(false);
        else if (a === 'tuan-1') chuyenTuan(-1);
        else if (a === 'tuan1') chuyenTuan(1);
        else if (a === 'homNay') chonNgay(key(S.homNay));
    });
    root.addEventListener('keydown', function (ev) {
        var card = ev.target.closest('.ums-lrhp-card[data-ngay]');
        if (card && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); moChiTiet(card.getAttribute('data-ngay')); return; }
        if (ev.target === F('tuKhoa') && ev.key === 'Enter') { ev.preventDefault(); if (hen) clearTimeout(hen); napRut(); }
    });
    root.addEventListener('change', function (ev) {
        var f = ev.target.getAttribute && ev.target.getAttribute('data-f');
        if (!f) return;
        if (f === 'dot' || f === 'he') napRut();                       // lọc tại máy chủ
        else if (f === 'tu' || f === 'den') locNgay();
        else if (LOC.some(function (x) { return x.k === f; })) apDungLoc(false);
    });
    /* Ô ngày gõ tay: chỉ lọc lại khi cặp ngày hợp lệ thực sự đổi (tránh lọc ở mỗi phím gõ dở) */
    function locNgay() {
        setTimeout(function () {
            if (docNgay('tu') + '|' + docNgay('den') === S.locNgayCu) return;
            apDungLoc(false);
        }, 0);
    }
    root.addEventListener('input', function (ev) {
        var f = ev.target.getAttribute && ev.target.getAttribute('data-f');
        if (f === 'tuKhoa') { if (hen) clearTimeout(hen); hen = setTimeout(function () { hen = null; napRut(); }, 400); }
        else if (f === 'tu' || f === 'den') locNgay();
    });

    /* ---------- Khởi động ---------- */
    var nay = new Date();
    S.homNay = new Date(nay.getFullYear(), nay.getMonth(), nay.getDate());
    S.ngayChon = S.homNay;
    S.thang = S.homNay.getMonth() + 1; S.nam = S.homNay.getFullYear();
    apDungLoc(false);
    napHeDaoTao();
    napDot();
})();
