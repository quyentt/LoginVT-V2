/* =========================================================================
   ums.lich — lịch tuần theo giờ + lịch tháng nhỏ (dùng chung)
   =========================================================================
   Bản viết lại của cụm genHtml_Month / genTable_ThongTin trong
   lichgiang.js (Cổng cán bộ) — cùng một khuôn chép ở lichgiang, lichgiangadmin,
   lichgiangphonghoc và thoikhoabieusinhvien/lichhoc.

       var L = ums.lich.tao({
           thang: hostLichThang,          // lịch tháng nhỏ (cột phải của bản gốc)
           tuan:  hostLichTuan,           // lưới tuần theo giờ
           load:  function (tuan) → Promise<dòng>,   // tuan = { ngay, batdau, ketthuc, days[7] } (dd/mm/yyyy)
           mau:   'IDLOPHOCPHAN',         // cùng giá trị → cùng màu (bảng 5 màu của bản gốc)
           noiDung: function (dòng) → HTML thân ô lịch,
           onClick: function (dòng, phầnTửBấm),
           danhDau: function (dòng[]) → [số ngày trong tháng có lịch]   (DSNGAYCOLICH), tuỳ chọn
           sauKhiVe: function (dòng[], hostTuan)                          tuỳ chọn (vd nạp cảm xúc)
           ngayNgan: true                  đầu cột ngày chỉ hiện số ngày (ngày đủ ở title), tuỳ chọn
       });
       L.reload() · L.tuan · L.xoaDanhDau() · L.coLich([dd/mm/yyyy…])

   Dòng dữ liệu dùng các cột của bản gốc: NGAYHOC (dd/mm/yyyy), GIOBATDAU,
   PHUTBATDAU, GIOKETTHUC, PHUTKETTHUC. 1 phút = 1px, mỗi giờ 60px như bản gốc.

   Khác bản gốc (ghi lại):
     · Ô trùng giờ xếp CẠNH NHAU (bản gốc chồng khít lên nhau, ô sau che ô trước).
     · Tuần không có lịch vẫn vẽ 7:00–17:00 (bản gốc lichgiang vậy; bản
       lichhoc / phonghoc vẽ lưới trống không một dòng giờ).
     · Năm nhuận tính đúng (bản gốc chỉ xét chia hết cho 4).
     · Tiêu đề cột ngày dùng "Thứ 2 … CN" (bản gốc "Mon … Sun").
     · Ô bị cắt chữ thì rê chuột là mở rộng (bản gốc bật popover chép cả ô giờ).
   ========================================================================= */
(function (global) {
    'use strict';

    var ums = global.ums || (global.ums = {});
    var ui = ums.ui;
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function hai(n) { n = String(n === null || n === undefined ? '' : n); return n.length === 1 ? '0' + n : n; }

    var MAU = ['#223771', '#d49f3a', '#ec4c00', '#5a7adb', '#3c5398'];
    var THU = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
    var PX = 60;                         // 60px mỗi giờ → 1px mỗi phút

    function dmy(d) { return hai(d.getDate()) + '/' + hai(d.getMonth() + 1) + '/' + d.getFullYear(); }
    function parse(s) { var p = String(s || '').split('/'); return p.length === 3 ? new Date(+p[2], +p[1] - 1, +p[0]) : null; }
    function thu2(d) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); var k = (x.getDay() + 6) % 7; x.setDate(x.getDate() - k); return x; }
    function tuanCua(d) {
        var a = thu2(d), days = [];
        for (var i = 0; i < 7; i++) { var x = new Date(a); x.setDate(a.getDate() + i); days.push(dmy(x)); }
        return { ngay: dmy(d), batdau: days[0], ketthuc: days[6], days: days };
    }
    function phut(r, gio, ph) { return (Number(r[gio]) || 0) * 60 + (Number(r[ph]) || 0); }

    /** "HH:MM - HH:MM" — returnTwo của bản gốc */
    function khungGio(r) {
        return hai(e(r.GIOBATDAU)) + ':' + hai(e(r.PHUTBATDAU)) + ' - ' + hai(e(r.GIOKETTHUC)) + ':' + hai(e(r.PHUTKETTHUC));
    }

    function tao(o) {
        var hostT = o.thang, hostW = o.tuan;
        var hom = new Date(), thang = hom.getMonth(), nam = hom.getFullYear();
        var tuan = null, rows = [], mauCua = {}, soMau = 0;
        /* Ngày CÓ LỊCH — khoá là ngày đầy đủ dd/mm/yyyy, CỘNG DỒN qua các tuần đã xem (không xoá khi lật tháng).
           Trước 2026-09-29 khoá chỉ là SỐ NGÀY nên tuần vắt hai tháng (28/9 – 4/10) khoanh nhầm ngày 1, 2 của
           tháng đang hiện. Hai nguồn: DSNGAYCOLICH của máy chủ (số ngày của tháng chứa ngày đang chọn) và
           NGAYHOC của chính các dòng vừa tải. */
        var coNgay = {};

        /* ---------- Lịch tháng nhỏ ---------------------------------------- */
        function veThang(chon) {
            var dau = new Date(nam, thang, 1), soNgay = new Date(nam, thang + 1, 0).getDate();
            var lui = (dau.getDay() + 6) % 7, tong = Math.ceil((lui + soNgay) / 7) * 7;
            var h = '';
            for (var c = 0; c < tong; c++) {
                var d = new Date(nam, thang, c - lui + 1), cung = d.getMonth() === thang;
                if (!cung) { h += '<span class="ums-lthang__o is-khac">' + d.getDate() + '</span>'; continue; }
                var s = dmy(d), cls = 'ums-lthang__o';
                if (chon && s === chon) cls += ' is-active';
                if (dmy(hom) === s) cls += ' is-today';
                if (coNgay[s]) cls += ' has-lich';
                if (tuan && tuan.days.indexOf(s) >= 0) cls += ' is-tuan';
                h += '<button type="button" class="' + cls + '" data-ngay="' + s + '">' + d.getDate() + '</button>';
            }
            hostT.innerHTML =
                '<div class="ums-lthang">' +
                    '<div class="ums-lthang__head"><button type="button" class="ums-iconbtn" data-th="-1" title="Tháng trước"><i class="fa-light fa-chevron-left"></i></button>' +
                    '<b>Tháng ' + (thang + 1) + ' - ' + nam + '</b>' +
                    '<button type="button" class="ums-iconbtn" data-th="1" title="Tháng sau"><i class="fa-light fa-chevron-right"></i></button></div>' +
                    '<div class="ums-lthang__thu"><span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span></div>' +
                    '<div class="ums-lthang__ngay">' + h + '</div>' +
                '</div>';
        }
        hostT.addEventListener('click', function (ev) {
            var t = ev.target.closest('[data-th]');
            if (t) {
                thang += Number(t.getAttribute('data-th'));
                if (thang < 0) { thang = 11; nam--; } else if (thang > 11) { thang = 0; nam++; }
                // Bản gốc: đổi tháng thì tự chọn ngày 1 (tháng hiện tại thì hôm nay)
                var ngay = (thang === hom.getMonth() && nam === hom.getFullYear()) ? hom : new Date(nam, thang, 1);
                chonNgay(dmy(ngay));
                return;
            }
            var b = ev.target.closest('[data-ngay]');
            if (b) chonNgay(b.getAttribute('data-ngay'));
        });

        /* ---------- Lưới tuần --------------------------------------------- */
        function khoangGio(ds) {
            if (!ds.length) return { min: 7, max: 17 };
            var min = 24, max = 0;
            ds.forEach(function (r) { min = Math.min(min, Number(r.GIOBATDAU) || 0); max = Math.max(max, Number(r.GIOKETTHUC) || 0); });
            if (min >= 13) min = min - 1; else if (min > 7) min = 7;
            return { min: min, max: Math.max(max, min) };
        }
        /* Xếp làn cho các ô trùng giờ trong cùng một ngày */
        function xepLan(ds) {
            ds.sort(function (a, b) { return a._bd - b._bd || b._kt - a._kt; });
            var cum = [], cuoi = -1;
            ds.forEach(function (r) {
                if (!cum.length || r._bd >= cuoi) { cum.push([]); cuoi = r._kt; }
                cum[cum.length - 1].push(r); cuoi = Math.max(cuoi, r._kt);
            });
            cum.forEach(function (c) {
                var lan = [];
                c.forEach(function (r) {
                    var k = 0;
                    while (lan[k] !== undefined && lan[k] > r._bd) k++;
                    lan[k] = r._kt; r._lan = k;
                });
                c.forEach(function (r) { r._soLan = lan.length; });
            });
        }
        function veTuan() {
            if (!tuan) { hostW.innerHTML = ui.empty('Chọn một ngày ở lịch tháng', 'fa-calendar'); return; }
            var kg = khoangGio(rows), gio = [];
            for (var g = kg.min; g <= kg.max + 1; g++) gio.push(g);
            var cao = gio.length * PX;
            var theoNgay = {};
            rows.forEach(function (r, i) {
                r._i = i; r._bd = phut(r, 'GIOBATDAU', 'PHUTBATDAU'); r._kt = Math.max(phut(r, 'GIOKETTHUC', 'PHUTKETTHUC'), r._bd + 15);
                var k = e(r.NGAYHOC); (theoNgay[k] = theoNgay[k] || []).push(r);
                var km = e(r[o.mau || 'IDLOPHOCPHAN']);
                if (mauCua[km] === undefined) mauCua[km] = MAU[(soMau++) % MAU.length];
            });
            /* o.ngayNgan = true: đầu cột chỉ hiện SỐ NGÀY, ngày đủ để ở title (Cổng SV lichhoc, kéo gốc 30/9) */
            var head = '<div class="ums-ltuan__goc"><i class="fa-light fa-clock"></i><span>GMT+7</span></div>' + tuan.days.map(function (d, i) {
                return '<div class="ums-ltuan__ngay' + (d === dmy(hom) ? ' is-today' : '') + '"' + (o.ngayNgan ? ' title="' + esc(d) + '"' : '') + '><b>' +
                    esc(o.ngayNgan ? d.split('/')[0] : d) + '</b><span>' + THU[i] + '</span></div>';
            }).join('');
            var gutter = gio.map(function (x) { return '<div class="ums-ltuan__gio">' + x + ':00</div>'; }).join('');
            var cot = tuan.days.map(function (d) {
                var ds = (theoNgay[d] || []).slice();
                xepLan(ds);
                return '<div class="ums-ltuan__cot" style="height:' + cao + 'px">' + gio.map(function () { return '<div class="ums-ltuan__o"></div>'; }).join('') +
                    ds.map(function (r) {
                        var top = r._bd - kg.min * 60, h = r._kt - r._bd, w = 100 / r._soLan;
                        return '<div class="ums-ltuan__ev" data-ev="' + r._i + '" style="top:' + top + 'px;height:' + h + 'px;left:calc(' + (w * r._lan) + '% + 2px);width:calc(' + w + '% - 4px);background:' +
                            mauCua[e(r[o.mau || 'IDLOPHOCPHAN'])] + '">' + o.noiDung(r) + '</div>';
                    }).join('') + '</div>';
            }).join('');
            hostW.innerHTML = '<div class="ums-ltuan"><div class="ums-ltuan__head">' + head + '</div>' +
                '<div class="ums-ltuan__body"><div class="ums-ltuan__cotgio">' + gutter + '</div>' + cot + '</div></div>' +
                (rows.length ? '' : '<div class="ums-ltuan__trong">' + ui.empty(o.empty || 'Tuần này không có lịch', 'fa-calendar-xmark') + '</div>');
            if (o.sauKhiVe) o.sauKhiVe(rows, hostW);
        }
        hostW.addEventListener('click', function (ev) {
            var el = ev.target.closest('[data-ev]');
            if (el && o.onClick) o.onClick(rows[Number(el.getAttribute('data-ev'))], ev.target, el);
        });

        function tai() {
            if (!tuan) return Promise.resolve();
            hostW.innerHTML = ui.empty('Đang tải lịch…', 'fa-spinner fa-spin');
            return Promise.resolve(o.load(tuan)).then(function (ds) {
                rows = Array.isArray(ds) ? ds : [];
                var goc = parse(tuan.ngay) || hom;
                if (o.danhDau) (o.danhDau(rows) || []).forEach(function (n) {
                    n = Number(n);
                    if (n >= 1 && n <= 31) coNgay[dmy(new Date(goc.getFullYear(), goc.getMonth(), n))] = true;
                });
                rows.forEach(function (r) { if (r.NGAYHOC) coNgay[e(r.NGAYHOC)] = true; });
                veThang(tuan.ngay);
                veTuan();
            }).catch(function (err) { rows = []; hostW.innerHTML = ui.fail(err.message); ums.api.handle(err, 'tải lịch'); });
        }
        function chonNgay(s) {
            var d = parse(s) || hom;
            thang = d.getMonth(); nam = d.getFullYear();
            tuan = tuanCua(d);
            veThang(s);
            if (o.onChon) o.onChon(tuan);
            return tai();
        }

        var api = {
            reload: tai,
            chon: chonNgay,
            xoaDanhDau: function () { coNgay = {}; veThang(tuan ? tuan.ngay : ''); },
            /* Màn tự tải dữ liệu (lưới nhiều phòng / nhiều giảng viên) báo các ngày có lịch: mảng dd/mm/yyyy */
            coLich: function (ds) { (ds || []).forEach(function (x) { if (x) coNgay[x] = true; }); veThang(tuan ? tuan.ngay : ''); },
            get tuan() { return tuan; },
            get rows() { return rows; }
        };
        if (o.tuDong === false) { veThang(''); veTuan(); }
        else setTimeout(function () { chonNgay(dmy(hom)); }, 0);
        return api;
    }

    /* =====================================================================
       Hộp ĐIỂM DANH một buổi học — ums.lich.diemDanh(buổi, o)
       ---------------------------------------------------------------------
       #my_calendar của lichgiang / lichgiangadmin / lichgiangphonghoc (cùng
       một đoạn mã). Lời gọi chép nguyên (kiểu cũ trừ khi ghi func):
           kiểu chuyên cần  XLHV_CC_ThongTin_MH · PKG_CHUYENCAN_THONGTIN.LayDSKieuChuyenCan
                            (o.kieuTuDanhMuc: danh mục QLSV.KIEUCHUYENCAN — bản phonghoc)
           sinh viên        NS_ThongTinCanBo/LayDSDangKyHoc_2 (GET)
           đã điểm danh     CC_ThoiGian_ChuyenCan/LayKetQuaTheoKieuChuyenCan (GET) — GIATRI = 1
           sĩ số            CC_GiangVien_TuGhiNhan/LayChiTiet (GET)
           lưu thủ công     CC_NguoiHoc_ChuyenCan/ThemMoi (strDiem_DanhSach_Id) ·
                            Xoa_QLSV_NguoiHoc_ChuyenCan2 (strDiem_DanhSachHoc_Id) — tên tham số
                            KHÁC NHAU như bản gốc; xoá trước, thêm sau
           lưu từ khoá      CC_GiangVien_TuGhiNhan/ThemMoi
           tự động          CC_GiangVien_TuGhiNhan/ThucHienDiemDanhTuDong (strTuKhoa '' như gốc)
       o = { sapXep: true (ô "Xếp theo…", chỉ bản lichgiang), cot2: 'Vắng mặt(…)',
             kieuTuDanhMuc: false }
       Khác bản gốc: rời ô số lượng thì tự đánh dấu (bản gốc lỗi JS point.val());
       "chọn cả cột" cũng bỏ các kiểu khác của cùng sinh viên (giữ luật một kiểu
       mỗi sinh viên); mã sinh viên hiện chữ thường — bản gốc mở màn điểm học tập
       của Cổng sinh viên (ApisCongSinhVien, chưa chuyển).
       ===================================================================== */
    function diemDanh(r, o) {
        o = o || {};
        function uid() { return (ums.session && ums.session.userId) || ''; }
        var tieuDe = 'Học phần: ' + e(r.TENHOCPHAN);
        var dlg = ui.dialog({
            title: tieuDe, icon: 'fa-clipboard-user', size: 'xl',
            body:
                '<div class="ums-lich-dd__sub"><b>Lớp: ' + esc(e(r.TENLOPHOCPHAN)) + '</b><span>Thời gian ' + esc(khungGio(r)) +
                    ' (Tiết ' + esc(e(r.TIETBATDAU)) + '-' + esc(e(r.TIETKETTHUC)) + ')</span><span>(Phòng học: ' + esc(e(r.TENPHONGHOC)) + ')</span></div>' +
                '<div class="ums-lich-dd__bar is-tudong"><b>Điểm danh tự động</b>' +
                    '<input class="ums-input ums-input--sm" data-dd="tukhoa" placeholder="Từ khóa điểm danh" autocomplete="off">' +
                    ui.btn('save', { text: 'Lưu từ khóa', mod: 'out-primary', cls: 'ums-btn--sm', attr: { 'data-dd': 'luuTK' } }) +
                    ui.btn('save', { text: 'Lưu điểm danh tự động', mod: 'primary', cls: 'ums-btn--sm', icon: 'fa-wand-magic-sparkles', attr: { 'data-dd': 'tudong' } }) + '</div>' +
                '<div class="ums-lich-dd__bar is-thucong"><b>Điểm danh thủ công</b><span data-dd="siso"></span>' +
                    (o.sapXep ? '<select class="ums-select ums-input--sm" data-dd="sx" data-no-s2><option value="">Sắp xếp</option><option value="ABC">Xếp theo ABC</option>' +
                        '<option value="LOPQUANLY">Xếp theo Lớp quản lý</option><option value="MASO">Xếp theo Mã sinh viên</option></select>' : '') +
                    ui.btn('save', { text: 'Lưu điểm danh thủ công', cls: 'ums-btn--sm', attr: { 'data-dd': 'luu' } }) + '</div>' +
                '<div data-dd="bang">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>'
        });
        var B = dlg.body;
        function q(k) { return B.querySelector('[data-dd="' + k + '"]'); }
        var kieu = [], sv = [], goc = {};           // goc['sv|kieu'] = { daLuu, soLuong }
        var chung = { strNgayGhiNhan: e(r.NGAYHOC), strDaoTao_LopHocPhan_Id: e(r.IDLOPHOCPHAN) };

        function napKieu() {
            if (o.kieuTuDanhMuc) return ums.api.dm('QLSV.KIEUCHUYENCAN');
            return ums.api.call({ action: 'XLHV_CC_ThongTin_MH/DSA4BRIKKCQ0Aik0OCQvAiAv', func: 'PKG_CHUYENCAN_THONGTIN.LayDSKieuChuyenCan',
                strDaoTao_LopHocPhan_Id: e(r.IDLOPHOCPHAN), strNguoiThucHien_Id: uid(), silent: true }).then(function (x) { return arr(x.data); });
        }
        function siSo() {
            ums.api.call({ action: 'CC_GiangVien_TuGhiNhan/LayChiTiet', method: 'GET', silent: true, strNgayGhiNhan: chung.strNgayGhiNhan, strGio: e(r.GIOBATDAU),
                strPhut: e(r.PHUTBATDAU), strGiay: '', strDaoTao_LopHocPhan_Id: chung.strDaoTao_LopHocPhan_Id }).then(function (x) {
                var d = arr(x.data);
                q('siso').innerHTML = d.length ? '<b>Sĩ số: ' + esc(e(d[0].TONGSOSV)) + '</b> ' + d.map(function (k) { return '<span>' + esc(e(k.TEN)) + ': ' + esc(e(k.SOLUONG)) + '</span>'; }).join(' ') : '';
            }).catch(function () {});
        }
        function napSV() {
            q('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return ums.api.call({ action: 'NS_ThongTinCanBo/LayDSDangKyHoc_2', method: 'GET', strTuKhoa: '', strNgayGhiNhan: chung.strNgayGhiNhan,
                dGio: e(r.GIOBATDAU), dPhut: e(r.PHUTBATDAU), dGiay: 0, strTieuChiSapXep: q('sx') ? q('sx').value : '', strReport_Id: '',
                strDaoTao_LopHocPhan_Id: chung.strDaoTao_LopHocPhan_Id, strNguoiThucHien_Id: uid() }).then(function (x) {
                sv = arr(x.data);
                q('tukhoa').value = sv.length ? e(sv[0].MATLENHGIANGVIEN) : '';
                veBang();
                return ums.api.call({ action: 'CC_ThoiGian_ChuyenCan/LayKetQuaTheoKieuChuyenCan', method: 'GET', silent: true, strKieuChuyenCan_Id: '',
                    strNgayGhiNhan: chung.strNgayGhiNhan, strGio: e(r.GIOBATDAU), strPhut: e(r.PHUTBATDAU), strGiay: 0, strQLSV_NguoiHoc_Id: '',
                    strDaoTao_LopHocPhan_Id: chung.strDaoTao_LopHocPhan_Id });
            }).then(function (x) {
                goc = {};
                arr(x && x.data).forEach(function (k) {
                    if (Number(k.GIATRI) !== 1) return;
                    var key = k.QLSV_NGUOIHOC_ID + '|' + k.KIEUCHUYENCAN_ID;
                    goc[key] = { daLuu: true, soLuong: Number(k.SOLUONG) ? String(k.SOLUONG) : '' };
                    var c = B.querySelector('[data-ck="' + key + '"]'), n = B.querySelector('[data-sl="' + key + '"]');
                    if (c) c.checked = true;
                    if (n && goc[key].soLuong) n.value = goc[key].soLuong;
                });
            }).catch(function (err) { q('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách điểm danh'); });
        }
        function veBang() {
            ui.table({
                el: q('bang'), rows: sv, empty: 'Lớp chưa có sinh viên',
                columns: [
                    { title: o.cot2 || 'Vắng mặt(Số buổi/Số tiết/Tỷ lệ)', prop: 'SOBUOIVANG', cls: 'is-center' },
                    { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                    { title: 'Họ đệm', prop: 'QLSV_NGUOIHOC_HODEM' },
                    { title: 'Tên', prop: 'QLSV_NGUOIHOC_TEN' },
                    { title: 'Địa chỉ IP', prop: 'IPDIEMDANHNGUOIHOC', cls: 'is-center' },
                    { title: 'Tự điểm danh', prop: 'MATLENHNGUOIHOC', cls: 'is-center' }
                ].concat(kieu.map(function (k) {
                    return { head: esc(e(k.TEN)) + '<br><input type="checkbox" data-all="' + esc(k.ID) + '" title="Chọn cả cột">', cls: 'is-center', width: '104px',
                        render: function (s) {
                            var key = s.QLSV_NGUOIHOC_ID + '|' + k.ID;
                            return '<div class="ums-lich-dd__o"><input type="checkbox" data-ck="' + esc(key) + '" data-sv="' + esc(s.QLSV_NGUOIHOC_ID) + '">' +
                                '<input class="ums-input ums-input--sm" data-sl="' + esc(key) + '" inputmode="numeric" autocomplete="off"></div>';
                        } };
                }))
            });
        }
        /* Mỗi sinh viên chỉ một kiểu */
        function motKieu(c) {
            if (!c.checked) return;
            Array.prototype.forEach.call(B.querySelectorAll('[data-sv="' + c.getAttribute('data-sv') + '"]'), function (x) { if (x !== c) x.checked = false; });
        }
        B.addEventListener('change', function (ev) {
            var t = ev.target;
            if (t.hasAttribute('data-all')) {
                var k = t.getAttribute('data-all');
                sv.forEach(function (s) { var c = B.querySelector('[data-ck="' + s.QLSV_NGUOIHOC_ID + '|' + k + '"]'); if (c) { c.checked = t.checked; motKieu(c); } });
            } else if (t.hasAttribute('data-ck')) motKieu(t);
            else if (t.getAttribute('data-dd') === 'sx') napSV();
        });
        B.addEventListener('focusout', function (ev) {
            var t = ev.target;
            if (!t.hasAttribute || !t.hasAttribute('data-sl')) return;
            var c = B.querySelector('[data-ck="' + t.getAttribute('data-sl') + '"]');
            if (c && t.value.trim()) { c.checked = true; motKieu(c); }
        });
        function luu() {
            var them = [], xoa = [];
            sv.forEach(function (s) {
                kieu.forEach(function (k) {
                    var key = s.QLSV_NGUOIHOC_ID + '|' + k.ID, c = B.querySelector('[data-ck="' + key + '"]'), n = B.querySelector('[data-sl="' + key + '"]');
                    if (!c) return;
                    var g = goc[key], sl = n ? n.value.trim() : '';
                    var x = { strId: '', strNguoiThucHien_Id: uid(), strQLSV_NguoiHoc_Id: s.QLSV_NGUOIHOC_ID, strDaoTao_LopQuanLy_Id: '',
                        strDaoTao_ChuongTrinh_Id: e(s.DAOTAO_TOCHUCCHUONGTRINH_ID), strQLSV_TrangThaiNguoiHoc_Id: e(s.QLSV_TRANGTHAINGUOIHOC_ID),
                        strKieuChuyenCan_Id: k.ID, strNgayGhiNhan: chung.strNgayGhiNhan, dSoLuong: sl, dGio: e(r.GIOBATDAU), dPhut: e(r.PHUTBATDAU), dGiay: 0 };
                    if (c.checked && (!g || sl !== g.soLuong)) { x.action = 'CC_NguoiHoc_ChuyenCan/ThemMoi'; x.method = 'POST'; x.strDiem_DanhSach_Id = e(s.DANGKY_LOPHOCPHAN_ID); them.push(x); }
                    else if (!c.checked && g) { x.action = 'CC_NguoiHoc_ChuyenCan/Xoa_QLSV_NguoiHoc_ChuyenCan2'; x.method = 'POST'; x.strDiem_DanhSachHoc_Id = e(s.DANGKY_LOPHOCPHAN_ID); xoa.push(x); }
                });
            });
            if (!them.length && !xoa.length) { ui.toast('Bạn chưa thay đổi gì dữ liệu.', 'info'); return; }
            ui.batch(xoa.concat(them), { title: 'Đang lưu điểm danh', okText: 'Lưu thành công' }).then(function () { siSo(); napSV(); });
        }
        B.addEventListener('click', function (ev) {
            var b = ev.target.closest('button[data-dd]');
            if (!b) return;
            var a = b.getAttribute('data-dd');
            if (a === 'luu') luu();
            else if (a === 'luuTK') {
                ums.api.call({ action: 'CC_GiangVien_TuGhiNhan/ThemMoi', method: 'POST', strDaoTao_LopQuanLy_Id: '', strDiem_DanhSach_Id: chung.strDaoTao_LopHocPhan_Id,
                    strNgayGhiNhan: chung.strNgayGhiNhan, strGio: e(r.GIOBATDAU), strPhut: e(r.PHUTBATDAU), strGiay: 0, strNoiDungTuGhiNhan: q('tukhoa').value.trim(),
                    strNguoiThucHien_Id: uid() }).then(function () { ui.toast('Lưu thành công', 'ok'); }).catch(function (err) { ums.api.handle(err, 'lưu từ khóa'); });
            } else if (a === 'tudong') {
                ums.api.call({ action: 'CC_GiangVien_TuGhiNhan/ThucHienDiemDanhTuDong', method: 'POST', strTuKhoa: '', strNgayGhiNhan: chung.strNgayGhiNhan,
                    dGio: e(r.GIOBATDAU), dPhut: e(r.PHUTBATDAU), dGiay: 0, strDaoTao_LopHocPhan_Id: chung.strDaoTao_LopHocPhan_Id, strNguoiThucHien_Id: uid() })
                    .then(function () { ui.toast('Thực hiện thành công', 'ok'); siSo(); napSV(); }).catch(function (err) { ums.api.handle(err, 'điểm danh tự động'); });
            }
        });
        napKieu().then(function (k) { kieu = k || []; siSo(); return napSV(); }).catch(function (err) { q('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'kiểu chuyên cần'); });
        return dlg;
    }
    function arr(d) { return Array.isArray(d) ? d : []; }

    ums.lich = { tao: tao, diemDanh: diemDanh, khungGio: khungGio, hai: hai, dmy: dmy };
})(window);
