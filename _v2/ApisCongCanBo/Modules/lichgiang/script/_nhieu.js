/* =========================================================================
   Lịch nhiều dòng × 7 ngày × 3 buổi — khung chung của
   lichgiangnhieuphonghoc (dòng = phòng) và lichgiangnhieuphonghocgiangvien
   (dòng = giảng viên) — ums.lg.nhieu(root, cfg)
   Bản gốc: hai tệp js ~1.900 dòng chép của nhau (≈94% giống — xem chú thích
   đầu từng màn). Ở đây phần giống nhau viết một lần; phần khác truyền qua cfg.
   ---------------------------------------------------------------------------
   Bố cục bản gốc: hàng 1 — thẻ trái (col-7) tiêu đề, 3 dòng giới thiệu, bộ lọc,
   nút | thẻ phải (col-5) lịch tháng. Hàng 2 — "Lịch tuần theo …": Tuần trước /
   Tuần (…) / Tuần sau + lưới. Hộp "chi tiết" và hộp "Xuất Excel".

   cfg = {
     tieuDe, phuDe?, gioiThieu: [3 dòng], loc: HTML bộ lọc, nut: HTML nút (data-a),
     tenLuoi: 'Lịch tuần theo phòng học', cotDong: 'Phòng', cotHieuSuat: 'Hiệu suất<br>sử dụng',
     ca: [{ ten, tiet, mau }] ×3, caCua(ev) → 0|1|2|-1, tietCua(ev) → {batDau, ketThuc},
     cheDo: [{ v, ten, nhan, tu, den }] (v 'days' = theo ngày), boCN: bool,
     dsDong() → Promise<dòng[]> (đã lọc) · dsGoc() → dòng[] chưa lọc (xuất "tất cả"),
     layLich(dòng, bd, kt) → Promise<buổi[]>, khoa(dòng) → id,
     veDong(dòng) → HTML ô đầu dòng, dong3(buổi) → HTML dòng thứ ba của ô,
     chiTiet(buổi, dòng) → { hp, lop, phong, ngay, gio, tiet, gv },
     xuat: { tieuDe, nhanPhamVi: [tất cả, đang lọc, cụ thể], nhanChon, banBan: bool,
             tenDong(dòng) → HTML ô Excel, csvDau: [...], csvDong(dòng) → [...], thongTin, excelO(buổi), csvO(buổi), tongCsv }
   }

   Pull 29/9 (bản gốc lichgiangnhieuphonghoc viết lại; bản giảng viên KHÔNG đổi) — các tuỳ
   chọn dưới đây đều KHÔNG bắt buộc, không truyền thì khung chạy y như trước:
     gon: true          bố cục gọn: một khối lọc (nút trên tiêu đề khối, bỏ 3 dòng giới thiệu), lịch tháng
                        thành hộp thả dưới nút "Tuần (…)" trên thanh tuần; lật tháng KHÔNG tự đổi tuần.
     tieuDeLoc, chuGiai tiêu đề khối lọc / HTML chú giải cạnh tiêu đề lưới (chỉ khi gon)
     trang, songSong    số dòng mỗi lượt nạp (mặc định 30) · số lời gọi lịch cùng lúc (mặc định: cả trang)
     tienDo: true       hiện "(x/y <đơn vị>)" khi đang nạp · bamThem: true  dòng "Cuộn xuống…" bấm được
     module: [{ tu, den, ca, tenBuoi }] + khoangTiet(buổi) → { tu, den } | null
                        chia mỗi buổi thành các module; lịch chạm nhiều module thì gộp ô; module không có
                        lịch hiện "Trống". Sáng / Chiều 2 module xếp trên dưới, Tối 1 module.
     oTrong(info, nút)  bấm ô Trống — info = { dong, ngay, tu, den }
     goiY(buổi) → chữ   title của thẻ lịch (mặc định tên học phần)
     nutChiTiet: { text, icon, kind, hien(buổi, dòng) → Promise<x | null>, onClick(x, buổi, dòng) }
                        nút thêm ở chân hộp chi tiết, chỉ hiện khi hien() trả khác null
     xuat.dem, xuat.nhanDang, xuat.nhanMau, xuat.songSong, xuat.cotDong, xuat.ghiChu(ban), xuat.ghiChuCsv(ban)

   Kéo gốc 30/9–1/10 (lọc "Phòng trống" của lichgiangnhieuphonghoc) — thêm các tuỳ chọn, đều KHÔNG bắt buộc,
   không truyền thì khung chạy y như trước (màn nhiều giảng viên không truyền):
     thanh: true        dựng dòng tóm tắt phía trên lưới (ẩn sẵn) — màn ghi nội dung bằng N.thanh(html) ('' = ẩn)
     ngayHien(days) → [dd/mm/yyyy] | null   chỉ vẽ các ngày này của tuần (lọc một ngày); hiệu suất VẪN tính cả tuần
     oLoc(ngày, module) → bool   ô Trống thuộc khung đang lọc → thêm lớp is-loc (viền xanh)
     veThay(dsDòng) → HTML | null   có HTML thì khung hiện HTML đó thay lưới, KHÔNG nạp lịch từng dòng (bảng phòng × ngày);
                        ô trong HTML mang data-trong="khoá|ngày|tiết từ|tiết đến" thì bấm vào vẫn gọi oTrong như ô Trống
     rong               nay nhận cả hàm → chữ (câu báo "không có dòng" theo bộ lọc đang dùng)
     onTuan(tuầnMới, tuầnCũ)   gọi khi đổi tuần, TRƯỚC khi nạp lại (màn dời khoảng ngày lọc theo tuần)
     N.chon(dd/mm/yyyy) nhảy tới tuần chứa ngày đó (nạp lại) · N.thanh(html) · ums.lg.chayNhom(ds, n, fn) dùng chung

   Không chép (lỗi rõ của bản gốc, chung cho hai màn):
     · Nạp chồng: đổi đơn vị / tòa nhà, "Xem tất cả", đổi tháng… bắn 2–3 lượt
       nạp cùng lúc, lượt sau xoá mảng lượt trước đang đổ vào → buổi lẫn / lặp.
       Ở đây mỗi lượt một số hiệu, kết quả của lượt cũ bị bỏ.
     · Dòng nạp thêm khi cuộn đặt grid-row số lẻ (4.78) → trình duyệt bỏ qua.
     · Lưới cuộn TRONG khung (max-height) — ở đây cuộn cả trang, khung chỉ cuộn ngang.
     · Đổi "Cách tính hiệu suất" gọi lại toàn bộ API — ở đây chỉ vẽ lại.
     · Chia cho 0 khi tính hiệu suất; tên học phần có dấu nháy làm vỡ title.
     · "Xlsx" thật ra là bảng HTML lưu đuôi .xls — giữ cách xuất nhưng ghi đúng
       đuôi .xls; CSV giờ cũng bỏ thẻ <br> như Excel.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui;
    var lg = ums.lg = ums.lg || {};
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function hai(n) { return ums.lich.hai(n); }
    function dmy(d) { return ums.lich.dmy(d); }
    function parse(s) { var p = String(s || '').split('/'); return p.length === 3 ? new Date(+p[2], +p[1] - 1, +p[0]) : null; }
    var THU = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    var TRANG = 30;
    function tuanCua(d) {
        var a = new Date(d.getFullYear(), d.getMonth(), d.getDate()), days = [];
        a.setDate(a.getDate() - (a.getDay() + 6) % 7);
        for (var i = 0; i < 7; i++) { var x = new Date(a); x.setDate(a.getDate() + i); days.push(dmy(x)); }
        return { ngay: dmy(d), batdau: days[0], ketthuc: days[6], days: days };
    }
    /* Chạy fn cho từng phần tử, tối đa n lời gọi cùng lúc (n rỗng = tất cả cùng lúc). fn không được reject. */
    function chayNhom(ds, n, fn) {
        if (!n || n >= ds.length) return Promise.all(ds.map(fn));
        return new Promise(function (ok) {
            var kq = [], i = 0, xong = 0;
            function tiep() {
                if (i >= ds.length) return;
                var k = i++;
                fn(ds[k], k).then(function (r) { kq[k] = r; if (++xong === ds.length) ok(kq); else tiep(); });
            }
            for (var j = 0; j < n; j++) tiep();
        });
    }
    /** Bỏ thẻ HTML, <br> thành ", " — cleanHtmlTags của bản gốc */
    lg.sach = function (s) { return String(e(s)).replace(/<br\s*\/?>/gi, ', ').replace(/<[^>]*>/g, '').replace(/\s+,/g, ',').trim(); };
    function gioPhut(r, g, p) { return r[g] === undefined || r[g] === null || r[g] === '' ? '' : hai(r[g]) + ':' + hai(e(r[p]) || 0); }

    lg.nhieu = function (root, cfg) {
        var trangSo = cfg.trang || TRANG;
        var thanhTuan = cfg.gon
            ? '<div class="lgn-chontuan"><button type="button" class="ums-btn ums-btn--out-primary" data-a="chontuan" title="Chọn tuần trên lịch">' +
                  '<i class="fa-light fa-calendar-days"></i><span data-z="tuanInfo">Tuần</span><i class="fa-light fa-angle-down"></i></button>' +
                  '<div class="lgn-popup" data-z="thang" hidden></div></div>'
            : '<b data-z="tuanInfo"></b>';
        root.innerHTML =
            ums.pat.page(cfg.tieuDe, '') +
            (cfg.gon
            ? '<section class="ums-panel lgn-loc lgn-loc--gon"><div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-calendar-days"></i> ' + esc(cfg.tieuDeLoc || cfg.tieuDe) + '</div>' +
                  '<div class="ums-panel__tools">' + cfg.nut + ui.btn('excel', { attr: { 'data-a': 'xuat' } }) + '</div></div>' +
                  '<div class="ums-panel__body"><div class="lgn-loc__o">' + cfg.loc + '</div></div></section>'
            : '<div class="lgn-tren">' +
                '<section class="ums-panel lgn-loc"><div class="ums-panel__body">' +
                    '<h3 class="lgn-loc__tieude">' + esc(cfg.tieuDe) + '</h3>' + (cfg.phuDe ? '<p class="lgn-loc__phude">' + esc(cfg.phuDe) + '</p>' : '') +
                    '<ul class="lgn-loc__gt">' + cfg.gioiThieu.map(function (s, i) {
                        return '<li><i class="fa-light ' + ['fa-circle-info', 'fa-calendar-week', 'fa-file-excel'][i] + '"></i>' + esc(s) + '</li>';
                    }).join('') + '</ul>' +
                    '<div class="lgn-loc__o">' + cfg.loc + '</div>' +
                    '<div class="lgn-loc__nut">' + cfg.nut + ui.btn('excel', { attr: { 'data-a': 'xuat' } }) + '</div>' +
                '</div></section>' +
                '<div data-z="thang"></div><div hidden data-z="an"></div>' +
            '</div>') +
            '<section class="ums-panel ums-u-mt-4' + (cfg.gon ? ' lgn-gon' : '') + '"><div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-table-cells"></i> ' + esc(cfg.tenLuoi) + '</div>' +
                (cfg.gon && cfg.chuGiai ? '<div class="lgn-chugiai">' + cfg.chuGiai + '</div>' : '') +
                '<div class="ums-panel__tools lgn-tuan">' +
                    ui.btn('search', { text: 'Tuần trước', icon: 'fa-chevron-left', mod: 'out-primary', attr: { 'data-a': 'tuan-1' } }) +
                    thanhTuan +
                    '<button type="button" class="ums-btn ums-btn--out-primary" data-a="tuan1"><span>Tuần sau</span><i class="fa-light fa-chevron-right"></i></button>' +
                '</div></div>' +
                '<div class="ums-panel__body ums-panel__body--flush">' + (cfg.thanh ? '<div class="lgn-thanhloc" data-z="thanhloc" hidden></div>' : '') +
                '<div class="lgn-khung" data-z="khung"></div></div></section>';
        ui.enhance(root);
        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
        var khung = z('khung');

        var tuan = null, soHieu = 0, dsDong = [], daVe = 0, lich = {}, mauCua = {}, soMau = 0, dangNap = false;
        function ngayTuan() {
            return tuan.days.map(function (s) { var d = parse(s); return { s: s, thu: THU[d.getDay()], dm: hai(d.getDate()) + '/' + hai(d.getMonth() + 1), cn: d.getDay() === 0 }; });
        }
        /* Ngày sẽ vẽ trên lưới: cả tuần, hoặc tập con do cfg.ngayHien trả (lọc phòng trống một ngày) */
        function ngayVe() {
            var nt = ngayTuan(), chi = cfg.ngayHien ? cfg.ngayHien(tuan.days) : null;
            if (!chi || !chi.length) return nt;
            var loc = nt.filter(function (d) { return chi.indexOf(d.s) >= 0; });
            return loc.length ? loc : nt;
        }
        function cheDo() { var f = root.querySelector('[data-f="hieusuat"]'); var v = f ? f.value : 'days'; return cfg.cheDo.filter(function (c) { return c.v === v; })[0] || cfg.cheDo[0]; }
        function mau(ev) {
            var k = e(ev.IDLOPHOCPHAN);
            if (mauCua[k] === undefined) mauCua[k] = (soMau++) % 5 + 1;
            return mauCua[k];
        }

        /* ---------- Hiệu suất ------------------------------------------- */
        function hieuSuat(ds) {
            var ngay = ngayTuan().filter(function (d) { return !(cfg.boCN && d.cn); });
            var trong = {}; ngay.forEach(function (d) { trong[d.s] = true; });
            ds = ds.filter(function (r) { return trong[r.NGAYHOC]; });
            if (!ngay.length) return 0;
            var c = cheDo();
            if (c.v === 'days') {
                var co = {}; ds.forEach(function (r) { co[r.NGAYHOC] = true; });
                return Math.round(Object.keys(co).length / ngay.length * 100);
            }
            var tong = ngay.length * (c.den - c.tu + 1), dung = 0;
            ds.forEach(function (r) {
                var t = cfg.tietCua(r);
                if (!t.batDau || !t.ketThuc) return;
                var a = Math.max(t.batDau, c.tu), b = Math.min(t.ketThuc, c.den);
                if (a <= b) dung += b - a + 1;
            });
            return tong > 0 ? Math.round(dung / tong * 100) : 0;
        }

        /* ---------- Vẽ lưới --------------------------------------------- */
        function veDau() {
            var nt = ngayVe();
            return '<div class="lgn-o lgn-o--dau lgn-o--dong" style="grid-row:1/3">' + esc(cfg.cotDong) + '</div>' +
                '<div class="lgn-o lgn-o--dau lgn-o--hs" style="grid-row:1/3">' + cfg.cotHieuSuat + '</div>' +
                nt.map(function (d) { return '<div class="lgn-o lgn-o--dau"><b>' + d.thu + '</b><span>' + d.dm + '</span></div>'; }).join('') +
                nt.map(function () {
                    return '<div class="lgn-o lgn-o--ca">' + cfg.ca.map(function (c) { return '<span style="background:' + c.mau + '"><b>' + esc(c.ten) + '</b>' + esc(c.tiet) + '</span>'; }).join('') + '</div>';
                }).join('');
        }
        /* Chia module thành khối (chiaKhoiModule của gốc): các module liên tiếp bị cùng một lịch chạm vào thì gộp
           thành một khối. Trả mảng dài bằng md: đầu khối = { span, su: [{ r, k }] }, module đã bị gộp = null. */
        function chiaKhoi(su, md) {
            var ds = [];
            su.forEach(function (x) {
                var kt = cfg.khoangTiet(x.r), a = -1, b = -1;
                if (!kt) return;
                md.forEach(function (m, i) { if (kt.tu <= m.den && kt.den >= m.tu) { if (a === -1) a = i; b = i; } });
                if (a !== -1) ds.push({ x: x, a: a, b: b, tu: kt.tu });
            });
            var kq = [], i = 0;
            function phut(r) { return (parseInt(r.GIOBATDAU, 10) || 0) * 60 + (parseInt(r.PHUTBATDAU, 10) || 0); }
            function noi(cuoi) { var xa = cuoi; ds.forEach(function (y) { if (y.a <= cuoi && y.b > xa) xa = y.b; }); return xa; }
            while (i < md.length) {
                var cuoi = i, xa = noi(cuoi);
                while (xa > cuoi) { cuoi = xa; xa = noi(cuoi); }
                var dau = i, c2 = cuoi;
                var trong = ds.filter(function (y) { return y.a <= c2 && y.b >= dau; });
                trong.sort(function (p, q) { return (p.tu - q.tu) || (phut(p.x.r) - phut(q.x.r)); });
                kq.push({ span: cuoi - i + 1, su: trong.map(function (y) { return y.x; }) });
                for (var j = i + 1; j <= cuoi; j++) kq.push(null);
                i = cuoi + 1;
            }
            return kq;
        }
        function veSu(d, y) {
            var r = y.r;
            return '<button type="button" class="lgn-su lgn-su--' + mau(r) + '" data-su="' + esc(cfg.khoa(d)) + '|' + y.k + '" title="' + esc(cfg.goiY ? cfg.goiY(r) : e(r.TENHOCPHAN)) + '">' +
                '<b>' + esc(gioPhut(r, 'GIOBATDAU', 'PHUTBATDAU')) + (r.TIETBATDAU ? ' (T' + esc(r.TIETBATDAU) + '-' + esc(e(r.TIETKETTHUC)) + ')' : '') + '</b>' +
                '<span>' + esc(e(r.TENHOCPHAN)) + '</span><small>' + cfg.dong3(r) + '</small></button>';
        }
        function veCaModule(d, ds, s, ci) {
            var md = cfg.module.filter(function (m) { return m.ca === ci; }), su = [];
            ds.forEach(function (r, k) { if (r.NGAYHOC === s) su.push({ r: r, k: k }); });
            return '<div class="lgn-ca lgn-ca--md" style="background:' + cfg.ca[ci].nen + '">' + chiaKhoi(su, md).map(function (kh, i) {
                if (!kh) return '';
                var span = md.length === 1 ? 2 : kh.span, m = md[i], st = ' style="grid-row:span ' + span + '"';
                if (kh.su.length) return '<div class="lgn-md lgn-md--ban"' + st + '>' + kh.su.map(function (y) { return veSu(d, y); }).join('') + '</div>';
                var nhan = '<span>T' + m.tu + '-' + m.den + '</span><b>Trống</b>';
                var loc = cfg.oLoc && cfg.oLoc(s, m) ? ' is-loc' : '';
                return cfg.oTrong
                    ? '<button type="button" class="lgn-md lgn-md--trong' + loc + '"' + st + ' data-trong="' + esc(cfg.khoa(d)) + '|' + s + '|' + m.tu + '|' + m.den + '" title="Bấm để đổi lịch vào phòng này, tiết ' + m.tu + '-' + m.den + '">' + nhan + '<em>+ Đổi lịch</em></button>'
                    : '<div class="lgn-md lgn-md--trong' + loc + '"' + st + '>' + nhan + '</div>';
            }).join('') + '</div>';
        }
        function veMotDong(d, i) {
            var ds = lich[cfg.khoa(d)] || [], hs = hieuSuat(ds), c = cheDo();
            var muc = hs > 60 ? 'high' : hs > 30 ? 'medium' : 'low', nhan = hs > 60 ? 'Cao' : hs > 30 ? 'Trung bình' : 'Thấp';
            var hang = 3 + i, h = '<div class="lgn-o lgn-o--ten" style="grid-row:' + hang + '">' + cfg.veDong(d) + '</div>' +
                '<div class="lgn-o lgn-o--hsv is-' + muc + '" style="grid-row:' + hang + '"><b>' + hs + '%</b><span>' + nhan + '</span>' +
                    '<i class="lgn-thanh"><i style="width:' + Math.min(100, hs) + '%"></i></i><small>' + esc(c.nhan) + '</small></div>';
            ngayVe().forEach(function (d0) {
                var s = d0.s;
                if (cfg.module) {
                    h += '<div class="lgn-o lgn-o--ngay is-md" style="grid-row:' + hang + '">' + cfg.ca.map(function (c0, ci) { return veCaModule(d, ds, s, ci); }).join('') + '</div>';
                    return;
                }
                var theoCa = [[], [], []];
                ds.forEach(function (r, k) { if (r.NGAYHOC !== s) return; var ca = cfg.caCua(r); if (ca >= 0) theoCa[ca].push({ r: r, k: k }); });
                h += '<div class="lgn-o lgn-o--ngay" style="grid-row:' + hang + '">' + theoCa.map(function (x, ci) {
                    x.sort(function (a, b) { return ((+a.r.GIOBATDAU || 0) * 60 + (+a.r.PHUTBATDAU || 0)) - ((+b.r.GIOBATDAU || 0) * 60 + (+b.r.PHUTBATDAU || 0)); });
                    return '<div class="lgn-ca" style="background:' + cfg.ca[ci].nen + '">' + x.map(function (y) {
                        var r = y.r;
                        return '<button type="button" class="lgn-su lgn-su--' + mau(r) + '" data-su="' + esc(cfg.khoa(d)) + '|' + y.k + '" title="' + esc(e(r.TENHOCPHAN)) + '">' +
                            '<b>' + esc(gioPhut(r, 'GIOBATDAU', 'PHUTBATDAU')) + (r.TIETBATDAU ? ' (T' + esc(r.TIETBATDAU) + '-' + esc(e(r.TIETKETTHUC)) + ')' : '') + '</b>' +
                            '<span>' + esc(e(r.TENHOCPHAN)) + '</span><small>' + cfg.dong3(r) + '</small></button>';
                    }).join('') + '</div>';
                }).join('') + '</div>';
            });
            return h;
        }
        function veLai() {
            if (!tuan) return;
            var thay = dsDong.length && cfg.veThay ? cfg.veThay(dsDong) : null;
            if (thay) { khung.innerHTML = thay; return; }
            if (!dsDong.length) { khung.innerHTML = ui.empty((typeof cfg.rong === 'function' ? cfg.rong() : cfg.rong) || 'Không có dữ liệu', 'fa-table-cells'); return; }
            var nv = ngayVe().length;
            var h = '<div class="lgn-luoi' + (nv < 7 ? ' is-it' : '') + '" style="--lgn-so-ngay:' + nv + '">' + veDau();
            for (var i = 0; i < daVe; i++) h += veMotDong(dsDong[i], i);
            h += '</div>';
            if (daVe < dsDong.length) h += '<div class="lgn-them' + (cfg.bamThem ? ' is-bam' : '') + '"' + (cfg.bamThem ? ' data-a="them" role="button" tabindex="0"' : '') + '>' +
                (dangNap ? '<i class="fa-light fa-spinner fa-spin"></i> Đang tải…' + (cfg.tienDo ? ' <span data-z="tiendo"></span>' : '')
                    : (cfg.bamThem ? '<i class="fa-light fa-arrow-down"></i> Cuộn xuống (hoặc bấm vào đây) để xem thêm ' : 'Cuộn xuống để xem thêm ') + (dsDong.length - daVe) + ' ' + cfg.donVi) + '</div>';
            khung.innerHTML = h;
            theoDoi();
        }
        var dauDong = null;
        function napTrang(sh) {
            var trang = dsDong.slice(daVe, daVe + trangSo), xong = 0;
            if (!trang.length) return Promise.resolve();
            dangNap = true; veLai();
            return chayNhom(trang, cfg.songSong, function (d) {
                return cfg.layLich(d, tuan.batdau, tuan.ketthuc).catch(function () { return []; }).then(function (r) {
                    xong++;
                    var td = sh === soHieu && cfg.tienDo ? z('tiendo') : null;
                    if (td) td.textContent = '(' + xong + '/' + trang.length + ' ' + cfg.donVi + ')';
                    return r;
                });
            }).then(function (kq) {
                if (sh !== soHieu) return;                 // lượt cũ — bỏ
                trang.forEach(function (d, i) { lich[cfg.khoa(d)] = kq[i] || []; });
                /* Khoanh trên lịch tháng những ngày có ÍT NHẤT MỘT dòng đang hiện có lịch (người dùng 2026-09-29: không
                   khoanh thì không biết ngày nào có lịch). Máy chủ chỉ trả lịch của tuần đang xem → tuần nào đã xem mới có khoanh. */
                var co = {};
                kq.forEach(function (ds) { (ds || []).forEach(function (r) { if (r.NGAYHOC) co[r.NGAYHOC] = true; }); });
                if (L.coLich) L.coLich(Object.keys(co));
                daVe += trang.length; dangNap = false; veLai();
            });
        }
        function tai() {
            if (!tuan) return Promise.resolve();
            var sh = ++soHieu;
            lich = {}; mauCua = {}; soMau = 0; daVe = 0; dangNap = false;
            khung.innerHTML = ui.empty('Đang tải dữ liệu...', 'fa-spinner fa-spin');
            return Promise.resolve(cfg.dsDong()).then(function (ds) {
                if (sh !== soHieu) return;
                dsDong = ds || [];
                // đổi tập dòng (lọc khác) thì các khoanh cũ không còn đúng → xoá, khoanh lại theo dữ liệu mới
                var dau = dsDong.map(function (d) { return cfg.khoa(d); }).join('|');
                if (dau !== dauDong) { dauDong = dau; if (L.xoaDanhDau) L.xoaDanhDau(); }
                if (!dsDong.length || (cfg.veThay && cfg.veThay(dsDong))) { veLai(); return; }
                return napTrang(sh);
            }).catch(function (err) { if (sh === soHieu) { khung.innerHTML = ui.fail(err.message); ums.api.handle(err, 'tải lịch'); } });
        }
        /* Nạp thêm 30 dòng khi dòng "Cuộn xuống để xem thêm…" lộ ra. Bản gốc cuộn
           TRONG khung (max-height); ở đây cuộn cả trang (BO-CUC quy ước 7). */
        var canh = window.IntersectionObserver ? new IntersectionObserver(function (ds2) {
            if (ds2.some(function (x) { return x.isIntersecting; }) && !dangNap && daVe < dsDong.length) napTrang(soHieu);
        }, { rootMargin: '200px' }) : null;
        function theoDoi() { if (!canh) return; canh.disconnect(); var t = khung.querySelector('.lgn-them'); if (t) canh.observe(t); }

        /* ---------- Lịch tháng + tuần ----------------------------------- */
        /* Bố cục gọn: lịch tháng là hộp thả dưới nút tuần. Tự vẽ (không qua ums.lich.tao) vì bản gốc mới
           lật tháng KHÔNG đổi tuần, còn ums.lich.tao lật tháng là chọn luôn ngày 1. Dùng lại lớp ums-lthang. */
        function lichGon(host) {
            var hom = new Date(), th = hom.getMonth(), nam = hom.getFullYear(), chon = '', coNgay = {};
            function ve() {
                var dau = new Date(nam, th, 1), soNgay = new Date(nam, th + 1, 0).getDate();
                var lui = (dau.getDay() + 6) % 7, tong = Math.ceil((lui + soNgay) / 7) * 7, h = '';
                for (var c = 0; c < tong; c++) {
                    var d = new Date(nam, th, c - lui + 1), s = dmy(d), trongTuan = tuan && tuan.days.indexOf(s) >= 0 ? ' is-tuan' : '';
                    if (d.getMonth() !== th) { h += '<span class="ums-lthang__o is-khac' + trongTuan + '">' + d.getDate() + '</span>'; continue; }
                    h += '<button type="button" class="ums-lthang__o' + (s === chon ? ' is-active' : '') + (dmy(hom) === s ? ' is-today' : '') + (coNgay[s] ? ' has-lich' : '') + trongTuan + '" data-ngay="' + s + '">' + d.getDate() + '</button>';
                }
                host.innerHTML = '<div class="ums-lthang"><div class="ums-lthang__head"><button type="button" class="ums-iconbtn" data-th="-1" title="Tháng trước"><i class="fa-light fa-chevron-left"></i></button>' +
                    '<b>Tháng ' + (th + 1) + ' - ' + nam + '</b><button type="button" class="ums-iconbtn" data-th="1" title="Tháng sau"><i class="fa-light fa-chevron-right"></i></button></div>' +
                    '<div class="ums-lthang__thu"><span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span></div>' +
                    '<div class="ums-lthang__ngay">' + h + '</div></div>';
            }
            function chonNgay(s) {
                var d = parse(s) || hom;
                th = d.getMonth(); nam = d.getFullYear(); chon = dmy(d);
                var cu = tuan;
                tuan = tuanCua(d);
                if (cfg.onTuan) cfg.onTuan(tuan, cu);
                z('tuanInfo').textContent = 'Tuần (' + tuan.batdau + ' - ' + tuan.ketthuc + ')';
                ve();
                return tai();
            }
            host.addEventListener('click', function (ev) {
                var t = ev.target.closest('[data-th]');
                if (t) { th += Number(t.getAttribute('data-th')); if (th < 0) { th = 11; nam--; } else if (th > 11) { th = 0; nam++; } ve(); return; }
                var b = ev.target.closest('[data-ngay]');
                if (b) { host.hidden = true; chonNgay(b.getAttribute('data-ngay')); }
            });
            /* Đóng hộp khi bấm ra ngoài / Esc — gắn trên gốc màn, không gắn lên document */
            root.addEventListener('mousedown', function (ev) { if (!host.hidden && !ev.target.closest('.lgn-chontuan')) host.hidden = true; });
            root.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && !host.hidden) { host.hidden = true; ev.preventDefault(); } });   // preventDefault: Esc này đã dùng để đóng hộp chọn tuần, tầng chung đừng đóng thêm màn
            ve();
            setTimeout(function () { chonNgay(dmy(hom)); }, 0);
            return { chon: chonNgay, moDong: function () { host.hidden = !host.hidden; if (!host.hidden) ve(); },
                coLich: function (ds) { (ds || []).forEach(function (x) { coNgay[x] = true; }); ve(); },
                xoaDanhDau: function () { coNgay = {}; ve(); } };
        }
        var L = cfg.gon ? lichGon(z('thang')) : ums.lich.tao({
            thang: z('thang'), tuan: z('an'), noiDung: function () { return ''; },
            load: function (t) {
                var cu = tuan;
                tuan = t;
                if (cfg.onTuan) cfg.onTuan(t, cu);
                z('tuanInfo').textContent = 'Tuần (' + t.batdau + ' - ' + t.ketthuc + ')';
                tai();
                return [];
            }
        });
        function doiTuan(k) {
            if (!tuan) { ui.toast('Vui lòng chọn tuần trên lịch', 'warn'); return; }
            var d = parse(tuan.batdau); d.setDate(d.getDate() + 7 * k);
            L.chon(dmy(d));
        }

        /* ---------- Chi tiết một buổi ----------------------------------- */
        function moChiTiet(b) {
            var p = b.getAttribute('data-su').split('|'), ds = lich[p[0]] || [], r = ds[Number(p[1])];
            if (!r) { ui.toast('Không tìm thấy thông tin lịch học!', 'warn'); return; }
            var dong = dsDong.filter(function (d) { return String(cfg.khoa(d)) === p[0]; })[0];
            var c = cfg.chiTiet(r, dong), cx = 'Chưa có thông tin';
            function o(nhan, v, rong) { return '<div class="ums-field' + (rong ? ' lgn-ct__rong' : '') + '"><label class="ums-field__label">' + nhan + '</label><div class="ums-field__control"><div class="lgn-ct__v">' + esc(v || cx) + '</div></div></div>'; }
            var nc = cfg.nutChiTiet, duLieuNut = null;
            var dlg = ui.dialog({ title: e(r.TENHOCPHAN) || cx, icon: 'fa-calendar-day', size: 'md',
                body: '<p class="lgn-ct__lop"><b>Lớp: ' + esc(e(r.TENLOPHOCPHAN) || cx) + '</b></p><div class="lgn-ct">' +
                    o('Phòng học', c.phong) + o('Ngày học', c.ngay) + o('Thời gian', c.gio) + o('Tiết học', c.tiet) + o('Giảng viên', c.gv, true) + '</div>',
                buttons: nc ? [{ text: nc.text, kind: nc.kind || 'edit', icon: nc.icon, onClick: function (dl) { dl.close(); nc.onClick(duLieuNut, r, dong); return false; } }] : [] });
            if (nc) {
                /* Nút chỉ hiện khi hien() trả khác null (vd buổi học là của chính người đăng nhập) */
                var nut = dlg.el.querySelector('[data-dlg="0"]');
                nut.hidden = true;
                Promise.resolve(nc.hien(r, dong)).then(function (x) { if (x && !dlg.closed) { duLieuNut = x; nut.hidden = false; } }).catch(function () {});
            }
        }

        /* ---------- Xuất Excel / CSV ------------------------------------ */
        function yyyy(s) { var d = parse(s); return d ? d.getFullYear() + '-' + hai(d.getMonth() + 1) + '-' + hai(d.getDate()) : ''; }
        function moXuat() {
            if (!tuan) { ui.toast('Vui lòng chọn tuần trước khi xuất', 'warn'); return; }
            var X = cfg.xuat, n = X.nhanPhamVi;
            function sel(k, opts) { return '<select class="ums-select" data-x="' + k + '" data-no-s2>' + opts.map(function (a) { return '<option value="' + a[0] + '">' + esc(a[1]) + '</option>'; }).join('') + '</select>'; }
            if (X.dem) n = [n[0] + ' (' + (cfg.dsGoc() || []).length + ' ' + cfg.donVi + ')', n[1] + ' (' + dsDong.length + ' ' + cfg.donVi + ')', n[2]];
            var dlg = ui.dialog({
                title: X.tieuDe + (X.dem ? ' — tuần ' + tuan.batdau + ' - ' + tuan.ketthuc : ''), icon: 'fa-file-excel', size: 'md',
                body:
                    ui.field('Khoảng thời gian', sel('kieu', [['current_week', 'Tuần hiện tại đang xem'], ['custom_date', 'Chọn ngày cụ thể'], ['custom_range', 'Chọn khoảng thời gian']])) +
                    '<div data-x="ngay1" hidden>' + ui.field('Ngày', '<input class="ums-input" data-x="ngay" data-date autocomplete="off">') + '</div>' +
                    '<div data-x="khoang" hidden class="ums-grid ums-grid--2">' + ui.field('Từ ngày', '<input class="ums-input" data-x="tu" data-date autocomplete="off">') +
                        ui.field('Đến ngày', '<input class="ums-input" data-x="den" data-date autocomplete="off">') + '</div>' +
                    ui.field(X.nhanLoc, sel('pham', [['all', n[0]], ['current', n[1]], ['custom', n[2]]])) +
                    '<div data-x="mot" hidden>' + ui.field(X.nhanChon, '<select class="ums-select" data-x="dong" data-ph="' + esc(X.nhanChonTrong) + '"><option value=""></option></select>') + '</div>' +
                    ui.field('Định dạng file', sel('dang', X.nhanDang || [['xls', 'Excel (.xls) - Định dạng đầy đủ'], ['csv', 'CSV (.csv) - Tương thích cao']])) +
                    (X.banBan ? ui.field('Mẫu xuất', sel('mau', X.nhanMau || [['full', 'Đầy đủ thông tin (mặc định)'], ['busy', 'Đánh dấu phòng bận (tô vàng, ẩn nội dung)']])) : '') +
                    '<div class="lgn-xuat__gt"><i class="fa-light fa-circle-info"></i> ' + esc(X.thongTin) + '</div>',
                buttons: [{ kind: 'excel', text: 'Xuất file', onClick: function (d) { chay(d); return false; } }]
            });
            var B = dlg.body;
            function q(k) { return B.querySelector('[data-x="' + k + '"]'); }
            q('ngay').value = tuan.batdau; q('tu').value = tuan.batdau; q('den').value = tuan.ketthuc;
            var goc = (cfg.dsGoc() || []).slice().sort(function (a, b) { return X.tenChon(a).localeCompare(X.tenChon(b), 'vi'); });
            ums.pat.fill(q('dong'), goc.map(function (d) { return { ID: cfg.khoa(d), TEN: X.tenChon(d) }; }));
            ui.enhance(B);
            B.addEventListener('change', function (ev) {
                var k = ev.target.getAttribute('data-x');
                if (k === 'kieu') { q('ngay1').hidden = ev.target.value !== 'custom_date'; q('khoang').hidden = ev.target.value !== 'custom_range'; }
                if (k === 'pham') q('mot').hidden = ev.target.value !== 'custom';
            });
            function chay(d) {
                var kieu = q('kieu').value, bd = tuan.batdau, kt = tuan.ketthuc;
                if (kieu === 'custom_date') { if (!q('ngay').value) { ui.toast('Vui lòng chọn ngày', 'warn'); return; } bd = kt = q('ngay').value; }
                if (kieu === 'custom_range') {
                    if (!q('tu').value || !q('den').value) { ui.toast('Vui lòng chọn đầy đủ khoảng thời gian', 'warn'); return; }
                    bd = q('tu').value; kt = q('den').value;
                    if (parse(bd) > parse(kt)) { ui.toast('Từ ngày phải trước Đến ngày', 'warn'); return; }
                }
                var pham = q('pham').value, dong;
                if (pham === 'custom') {
                    if (!q('dong').value) { ui.toast('Vui lòng chọn ' + X.nhanChonTrong.toLowerCase(), 'warn'); return; }
                    dong = goc.filter(function (x) { return String(cfg.khoa(x)) === q('dong').value; });
                } else dong = pham === 'current' ? dsDong : goc;
                if (!dong.length) { ui.toast('Không có ' + cfg.donVi + ' nào để xuất', 'warn'); return; }
                var dang = q('dang').value, ban = q('mau') && q('mau').value === 'busy';
                d.close();
                var kq = [];
                ui.batch(dong.map(function (x, i) {
                    return function () { return cfg.layLich(x, bd, kt).catch(function () { return []; }).then(function (r) { kq[i] = r || []; }); };
                }), { title: 'Đang tổng hợp dữ liệu', show: true, toast: false, concurrency: X.songSong || 4 }).then(function () {
                    var ngay = [], a = parse(bd), b = parse(kt);
                    for (var t = new Date(a); t <= b; t.setDate(t.getDate() + 1)) ngay.push(dmy(t));
                    var ten = tenTep(a, b) + (dang === 'csv' ? '.csv' : '.xls'), soSu = kq.reduce(function (s, r) { return s + r.length; }, 0);
                    if (dang === 'csv') taiTep(ten, 'text/csv;charset=utf-8', '﻿' + csv(dong, kq, ngay, bd, kt, ban));
                    else taiTep(ten, 'application/vnd.ms-excel;charset=utf-8', excel(dong, kq, ngay, bd, kt, ban));
                    ui.toast('Đã xuất ' + ten + ' — ' + dong.length + ' ' + cfg.donVi + ', ' + soSu + ' lịch', 'ok');
                });
            }
        }
        function tenTep(a, b) {
            function dm(d) { return d.getDate() + '.' + (d.getMonth() + 1); }
            if (a.getTime() === b.getTime()) return 'Lich hoc ngay ' + dm(a) + '.' + a.getFullYear();
            if (Math.round((b - a) / 864e5) === 6) {
                var t = new Date(a); t.setDate(t.getDate() + 3 - (t.getDay() + 6) % 7);
                var w1 = new Date(t.getFullYear(), 0, 4), tuanISO = 1 + Math.round(((t - w1) / 864e5 - 3 + (w1.getDay() + 6) % 7) / 7);
                return 'Lich hoc tuan ' + tuanISO + ' tu ngay ' + dm(a) + ' den ' + dm(b) + '.' + b.getFullYear();
            }
            return 'Lich hoc tu ' + dm(a) + ' den ' + dm(b) + '.' + b.getFullYear();
        }
        function taiTep(ten, kieu, noiDung) { ui.taiTep(ten, kieu, noiDung); }
        function thuCua(s) { var d = parse(s); return THU[d.getDay()] + ' (' + hai(d.getDate()) + '/' + hai(d.getMonth() + 1) + ')'; }
        /* Xuất theo module (pull 29/9): mỗi dòng của lưới ra N dòng = N module; lịch dài hơn một module thì gộp ô */
        function excelModule(dong, kq, ngay, bd, kt, ban) {
            var X = cfg.xuat, cot = 3 + ngay.length, M = cfg.module;
            var h = '<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"></head><body><table border="1">' +
                '<tr><td colspan="' + cot + '" style="font-size:16pt;font-weight:bold;text-align:center">' + esc(X.tieuDeTep) + (ban ? ' (ĐÁNH DẤU PHÒNG BẬN)' : '') + '</td></tr>' +
                '<tr><td colspan="' + cot + '">Thời gian: ' + bd + ' - ' + kt + '</td></tr>' +
                '<tr><td colspan="' + cot + '">Số ' + cfg.donVi + ': ' + dong.length + '</td></tr>' +
                '<tr><td colspan="' + cot + '">Ngày xuất: ' + new Date().toLocaleString('vi-VN') + '</td></tr>' +
                (X.ghiChu ? '<tr><td colspan="' + cot + '" style="font-style:italic;color:#666">' + X.ghiChu(ban) + '</td></tr>' : '') + '<tr><td colspan="' + cot + '"></td></tr>' +
                '<tr style="font-weight:bold;background:#D9D9D9"><td>STT</td><td>' + esc(X.cotDong || cfg.cotDong) + '</td><td>Ca học</td>' + ngay.map(function (s) { return '<td>' + thuCua(s).replace(' (', '<br>(') + '</td>'; }).join('') + '</tr>';
            dong.forEach(function (d, i) {
                var khoi = ngay.map(function (s) {
                    return chiaKhoi(kq[i].filter(function (r) { return r.NGAYHOC === s; }).map(function (r) { return { r: r }; }), M);
                });
                M.forEach(function (m, im) {
                    h += '<tr style="height:' + (ban ? '36px' : '80px') + '">' + (im ? '' : '<td rowspan="' + M.length + '" style="vertical-align:middle;text-align:center">' + (i + 1) + '</td><td rowspan="' + M.length + '" style="vertical-align:middle">' + X.tenDong(d) + '</td>') +
                        '<td style="vertical-align:middle;text-align:center;font-weight:bold">' + esc(m.tenBuoi) + '<br>T' + m.tu + '-' + m.den + '</td>';
                    ngay.forEach(function (s, ing) {
                        var kh = khoi[ing][im];
                        if (!kh) return;                                   // module đã gộp vào ô phía trên
                        var rs = kh.span > 1 ? ' rowspan="' + kh.span + '"' : '';
                        if (!kh.su.length) h += '<td' + rs + '>&nbsp;</td>';
                        else if (ban) h += '<td' + rs + ' bgcolor="#FFFF00" style="background:#FFFF00;mso-pattern:auto none #FFFF00">&nbsp;</td>';
                        else h += '<td' + rs + ' bgcolor="#DDEBF7" style="vertical-align:top;background:#DDEBF7;mso-pattern:auto none #DDEBF7">' + kh.su.map(function (y) { return X.excelO(y.r); }).join('<br>---<br>') + '</td>';
                    });
                    h += '</tr>';
                });
            });
            return h + '</table></body></html>';
        }
        function csvModule(dong, kq, ngay, bd, kt, ban) {
            var X = cfg.xuat, M = cfg.module;
            function c(v) { v = String(e(v)); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
            function phut(r) { return (parseInt(r.GIOBATDAU, 10) || 0) * 60 + (parseInt(r.PHUTBATDAU, 10) || 0); }
            var dongs = [[X.tieuDeTep + (ban ? ' (ĐÁNH DẤU PHÒNG BẬN)' : '')], ['Thời gian: ' + bd + ' - ' + kt], ['Số ' + cfg.donVi + ': ' + dong.length], ['Ngày xuất: ' + new Date().toLocaleString('vi-VN')]];
            if (X.ghiChuCsv) dongs.push([X.ghiChuCsv(ban)]);
            dongs.push([], ['STT'].concat(X.csvDau, ['Ca học'], ngay.map(thuCua)));
            dong.forEach(function (d, i) {
                M.forEach(function (m, im) {
                    /* CSV không gộp ô được → lịch kéo dài ghi ở mọi module nó chiếm */
                    dongs.push([im ? '' : i + 1].concat(im ? X.csvDong(d).map(function () { return ''; }) : X.csvDong(d), [m.tenBuoi + ' T' + m.tu + '-' + m.den], ngay.map(function (s) {
                        var su = kq[i].filter(function (r) { var k = r.NGAYHOC === s ? cfg.khoangTiet(r) : null; return k && k.tu <= m.den && k.den >= m.tu; });
                        su.sort(function (a, b) { return phut(a) - phut(b); });
                        return ban ? (su.length ? 'BẬN' : '') : su.map(function (r) { return X.csvO(r); }).join(' | ');
                    })));
                });
            });
            dongs.push([], ['THỐNG KÊ'], ['Tổng số ' + cfg.donVi + ':', dong.length], ['Tổng số lịch:', kq.reduce(function (s, r) { return s + r.length; }, 0)]);
            return dongs.map(function (r) { return r.map(c).join(','); }).join('\r\n');
        }
        function excel(dong, kq, ngay, bd, kt, ban) {
            if (cfg.module) return excelModule(dong, kq, ngay, bd, kt, ban);
            var X = cfg.xuat, cot = 3 + ngay.length;
            var h = '<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"></head><body><table border="1">' +
                '<tr><td colspan="' + cot + '" style="font-size:16pt;font-weight:bold;text-align:center">' + esc(X.tieuDeTep) + (ban ? ' (ĐÁNH DẤU PHÒNG BẬN)' : '') + '</td></tr>' +
                '<tr><td colspan="' + cot + '">Thời gian: ' + bd + ' - ' + kt + '</td></tr>' +
                '<tr><td colspan="' + cot + '">Số ' + cfg.donVi + ': ' + dong.length + '</td></tr>' +
                '<tr><td colspan="' + cot + '">Ngày xuất: ' + new Date().toLocaleString('vi-VN') + '</td></tr>' +
                (ban ? '<tr><td colspan="' + cot + '"><span style="background:#FFFF00">&nbsp;&nbsp;&nbsp;&nbsp;</span> Phòng bận</td></tr>' : '') + '<tr><td colspan="' + cot + '"></td></tr>' +
                '<tr style="font-weight:bold;background:#D9E1F2"><td>STT</td><td>' + esc(cfg.cotDong) + '</td><td>Ca học</td>' + ngay.map(function (s) { return '<td>' + thuCua(s).replace(' (', '<br>(') + '</td>'; }).join('') + '</tr>';
            dong.forEach(function (d, i) {
                cfg.ca.forEach(function (c, ci) {
                    h += '<tr>' + (ci ? '' : '<td rowspan="3" style="vertical-align:middle">' + (i + 1) + '</td><td rowspan="3" style="vertical-align:middle">' + X.tenDong(d) + '</td>') + '<td>' + esc(c.xuat || c.ten) + '</td>';
                    ngay.forEach(function (s) {
                        var su = kq[i].filter(function (r) { return r.NGAYHOC === s && cfg.caCua(r) === ci; });
                        if (ban && su.length) h += '<td style="background:#FFFF00"></td>';
                        else h += '<td style="vertical-align:top">' + su.map(function (r) { return X.excelO(r); }).join('<br>---<br>') + '</td>';
                    });
                    h += '</tr>';
                });
            });
            return h + '</table></body></html>';
        }
        function csv(dong, kq, ngay, bd, kt, ban) {
            if (cfg.module) return csvModule(dong, kq, ngay, bd, kt, ban);
            var X = cfg.xuat;
            function c(v) { v = String(e(v)); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
            var dongs = [[X.tieuDeTep], ['Thời gian: ' + bd + ' - ' + kt], ['Số ' + cfg.donVi + ': ' + dong.length], [], ['STT'].concat(X.csvDau, ngay.map(thuCua))];
            dong.forEach(function (d, i) {
                dongs.push([i + 1].concat(X.csvDong(d), ngay.map(function (s) {
                    var su = kq[i].filter(function (r) { return r.NGAYHOC === s; });
                    return ban ? (su.length ? 'BẬN' : '') : su.map(function (r) { return X.csvO(r); }).join(' | ');
                })));
            });
            dongs.push([], ['THỐNG KÊ'], ['Tổng số ' + cfg.donVi + ':', dong.length], ['Tổng số lịch:', kq.reduce(function (s, r) { return s + r.length; }, 0)]);
            return dongs.map(function (r) { return r.map(c).join(','); }).join('\r\n');
        }

        root.addEventListener('click', function (ev) {
            var su = ev.target.closest('[data-su]');
            if (su) { moChiTiet(su); return; }
            var tr = ev.target.closest('[data-trong]');
            if (tr && cfg.oTrong) {
                var p = tr.getAttribute('data-trong').split('|');
                cfg.oTrong({ dong: dsDong.filter(function (d) { return String(cfg.khoa(d)) === p[0]; })[0], ngay: p[1], tu: +p[2], den: +p[3] }, tr);
                return;
            }
            var b = ev.target.closest('[data-a]');
            if (!b) return;
            var a = b.getAttribute('data-a');
            if (a === 'tuan-1') doiTuan(-1);
            else if (a === 'tuan1') doiTuan(1);
            else if (a === 'xuat') moXuat();
            else if (a === 'chontuan' && L.moDong) L.moDong();
            else if (a === 'them' && !dangNap && daVe < dsDong.length) napTrang(soHieu);
        });
        var hs = root.querySelector('[data-f="hieusuat"]');
        if (hs) hs.addEventListener('change', veLai);

        return {
            tai: function () { if (!tuan) { ui.toast('Vui lòng chọn tuần trên lịch', 'warn'); return Promise.resolve(); } return tai(); },
            veLai: veLai,
            chon: function (s) { return Promise.resolve(L.chon(s)); },
            thanh: function (html) { var t = z('thanhloc'); if (!t) return; t.innerHTML = html || ''; t.hidden = !html; },
            get tuan() { return tuan; }
        };
    };
    lg.gioPhut = gioPhut;
    lg.chayNhom = chayNhom;
})();
