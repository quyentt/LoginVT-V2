/* =========================================================================
   nhapdiem — phần dùng chung của các màn nhập điểm
   ums.nd.he10(input)         quy tắc hệ 10 của bản gốc (nhapdiem.js:376, nhapdiemdst.js:242, tuibai…):
                              gõ SỐ NGUYÊN > 10 thì đổi: bội của 100 → 10, còn lại → round(n / 10^(số chữ số − 2)) / 10
                              (85 → 8.5, 755 → 7.6). Bản gốc dùng parseInt nên "12.5" thành 1.2 — ở đây chỉ đổi số nguyên.
   ums.nd.phim(host)          ←/→ sang ô trước/sau, ↑/↓/Enter lên/xuống ĐÚNG CỘT (ô input.nd-o mang data-r, data-c).
                              Bản gốc (move_ThroughInTable) tính bề rộng theo dòng đầu, đếm cả ô đánh dấu → dòng có ô
                              khoá là nhảy lệch cột.
   ums.nd.danhDau(host)       tô ô đã sửa (value khác data-goc) · ums.nd.oDoi(host) → các ô đã sửa
   ums.nd.locThi(o)           bộ lọc Thời gian → Loại điểm → Hình thức thi → Đợt thi → Môn thi (TP_Chung/*, GET)
       o = { f(k) → ô chọn theo khoá tg/ld/ht/dot/mon, tenMon(x), chonDau: true (tự chọn thời gian đầu như selectFirst) }
             them(k) → tham số THÊM cho tầng k (+ 2026-09-28, Thi phách: Khoa quản lý strDaoTao_CoCauToChuc_Id gửi vào LayHocPhan;
             mặc định không thêm gì). Ô NGOÀI chuỗi đổi thì màn gọi napTu(4) để nạp lại Môn thi.
       → { xong: Promise, napTu(i) }
   (+ 2026-09-25) ums.nd.bangDiem(host, o)   LƯỚI NHẬP ĐIỂM theo công thức (tách từ nhapdiem.js — cùng lời gọi, cùng
       cách vẽ; bản Quản lý điểm dùng; nhapdiem.js của cổng cán bộ CHƯA chuyển sang, vẫn giữ bản riêng):
       o = { bd() → bảng điểm đang mở (dòng D_Hoc/LayDanhSach), sx() → strTieuChiSapXep, dem: phần tử đếm người học,
             he10: false (bỏ quy tắc hệ 10 — gốc Quản lý điểm không có), onVe(),
             chon: false (+ 2026-09-27, Tuyển sinh: bỏ cột ô đánh dấu "Chọn" — gốc Tuyển sinh không có; mặc định giữ cột) }
       → { tai(), luu(), tinhLai(), rubric(), oDoi(), danhDau(), hoiBo(), daChon(), NH(), COT() }
       Lời gọi: D_CongThuc/LayChiTiet → D_Hoc_NguoiHoc/LayDanhSach → D_Hoc_NguoiHoc_Diem/LayGiaTriDiemTheoDanhSach (mỗi cột lá);
       Lưu: Nhan_Diem_NguoiHoc_ThanhPhan mỗi ô đã đổi → Tinh_Diem_NguoiHoc_ThanhPhan mỗi dòng → nạp lại (MỘT lần);
       Rubric: TP_XuLyTuKhoa/QuyDoiRubricTheoLopHocPhan → tính lại. Chi tiết "không chép" xem đầu nhapdiem.js.
   ========================================================================= */
(function () {
    'use strict';
    var pat = ums.pat;
    var nd = ums.nd = ums.nd || {};
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }

    nd.he10 = function (i) {
        var s = i.value.trim();
        if (!/^\d+$/.test(s)) return;
        var t = parseInt(s, 10);
        if (t <= 10) return;
        i.value = t % 100 === 0 ? '10' : String(Math.round(t / Math.pow(10, s.length - 2)) / 10);
    };
    /** Chạy fn(x) cho từng phần tử, tối đa n lời gọi cùng lúc (makeRequest gốc giới hạn 10 luồng). Lỗi từng phần tử bị nuốt. */
    nd.pool = function (ds, fn, n) {
        var i = 0;
        function chay() { if (i >= ds.length) return Promise.resolve(); var x = ds[i++]; return Promise.resolve().then(function () { return fn(x); }).catch(function () {}).then(chay); }
        var p = []; for (var k = 0; k < Math.min(n || 10, ds.length); k++) p.push(chay());
        return Promise.all(p);
    };
    nd.oDoi = function (host) { return Array.prototype.filter.call(host.querySelectorAll('input.nd-o'), function (i) { return i.value !== i.getAttribute('data-goc'); }); };
    nd.danhDau = function (host) { Array.prototype.forEach.call(host.querySelectorAll('input.nd-o'), function (i) { i.classList.toggle('is-doi', i.value !== i.getAttribute('data-goc')); }); };
    nd.phim = function (host) {
        host.addEventListener('keydown', function (ev) {
            var t = ev.target;
            if (!t.classList || !t.classList.contains('nd-o')) return;
            var r = Number(t.getAttribute('data-r')), c = t.getAttribute('data-c'), dich = null;
            if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') {
                if ((ev.key === 'ArrowRight' && t.selectionStart < t.value.length) || (ev.key === 'ArrowLeft' && t.selectionStart > 0)) return;
                var tat = Array.prototype.slice.call(host.querySelectorAll('input.nd-o'));
                dich = tat[tat.indexOf(t) + (ev.key === 'ArrowRight' ? 1 : -1)];
            } else if (ev.key === 'ArrowDown' || ev.key === 'Enter' || ev.key === 'ArrowUp') {
                var buoc = ev.key === 'ArrowUp' ? -1 : 1, max = host.querySelectorAll('tbody tr').length;
                for (var rr = r + buoc; rr >= 0 && rr < max && !dich; rr += buoc) dich = host.querySelector('input.nd-o[data-r="' + rr + '"][data-c="' + c + '"]');
            } else return;
            if (dich) { ev.preventDefault(); dich.focus(); dich.select(); }
        });
        host.addEventListener('change', function (ev) {
            var t = ev.target;
            if (!t.classList || !t.classList.contains('nd-o')) return;
            if (t.getAttribute('data-he') === '10') nd.he10(t);
            t.classList.toggle('is-doi', t.value !== t.getAttribute('data-goc'));
        });
    };

    nd.locThi = function (o) {
        var f = o.f;
        function v(k) { return f(k) ? f(k).value.trim() : ''; }
        var chuoi = pat.chain([f('tg'), f('ld'), f('ht'), f('dot'), f('mon')], { phatLai: false });
        var TANG = [
            ['tg', 'LayThoiGian', 'THOIGIAN', function () { return {}; }, 'Chọn thời gian'],
            ['ld', 'LayLoaiDiem', 'TEN', function () { return { strDaoTao_ThoiGianDaoTao_Id: v('tg') }; }, 'Chọn loại điểm'],
            ['ht', 'LayHinhThucThi', 'TEN', function () { return { strDiem_ThanhPhanDiem_Id: v('ld'), strDaoTao_ThoiGianDaoTao_Id: v('tg') }; }, 'Chọn hình thức thi'],
            ['dot', 'LayDotThi', 'TEN', function () { return { strHinhThucThi_Id: v('ht'), strDiem_ThanhPhanDiem_Id: v('ld'), strDaoTao_ThoiGianDaoTao_Id: v('tg') }; }, 'Chọn đợt thi'],
            ['mon', 'LayHocPhan', o.tenMon || 'TEN', function () { return { strDotThi_Id: v('dot'), strHinhThucThi_Id: v('ht'), strDiem_ThanhPhanDiem_Id: v('ld'), strDaoTao_ThoiGianDaoTao_Id: v('tg') }; }, 'Chọn môn thi']
        ];
        function nap(i) {
            var t = TANG[i];
            if (i && !v(TANG[i - 1][0])) { pat.fill(f(t[0]), []); chuoi.sync(); return Promise.resolve(); }
            return ums.api.call(Object.assign({ action: 'TP_Chung/' + t[1], method: 'GET', strNguoiThucHien_Id: uid() }, t[3](), o.them ? o.them(t[0]) : {})).then(function (r) {
                var d = arr(r.data);
                pat.fill(f(t[0]), d, { name: t[2], head: t[4] });
                if (!i && o.chonDau && d.length) { f('tg').value = d[0].ID; if (window.jQuery) jQuery(f('tg')).trigger('change.select2'); }
                chuoi.sync();
            }).catch(function (err) { ums.api.handle(err, t[1]); });
        }
        function napTu(i) { var p = Promise.resolve(); for (var k = i; k < TANG.length; k++) (function (k) { p = p.then(function () { return nap(k); }); })(k); return p; }
        if (window.jQuery) TANG.forEach(function (t, i) {
            if (i < TANG.length - 1) jQuery(f(t[0])).on('select2:select select2:clear', function () { napTu(i + 1).then(function () { if (o.onDoi) o.onDoi(t[0]); }); });
            else jQuery(f(t[0])).on('select2:select select2:clear', function () { if (o.onDoi) o.onDoi(t[0]); });
        });
        return { xong: o.chonDau ? napTu(0) : nap(0), napTu: napTu };
    };

    nd.bangDiem = function (host, o) {
        var ui = ums.ui;
        function cn() { return (ums.state && ums.state.chucNangId) || ''; }
        function vt() { return (ums.state && ums.state.roleId) || ''; }
        function e(v) { return v === null || v === undefined ? '' : v; }
        function esc(s) { return ui.esc(s); }
        function get(a, x) { return ums.api.call(Object.assign({ action: a, method: 'GET', strChucNang_Id: cn(), strNguoiThucHien_Id: uid() }, x)); }
        var COT = { nh: [], diem: [], la: [] }, NH = [], KQ = {};
        function kieu(c, than) {
            var s = '';
            if (c.KICHTHUOCFONTCHU) s += 'font-size:' + c.KICHTHUOCFONTCHU + 'px;';
            if (c.CANLE) s += String(c.CANLE).replace(/;?$/, ';');
            if (c.MAMAUHIENTHI) s += 'color:#' + String(c.MAMAUHIENTHI).replace(/^#/, '') + ';';
            if (than && c.CHUDAM) s += String(c.CHUDAM).replace(/;?$/, ';');
            return s;
        }
        function boc(c, html) { var s = kieu(c, true); return s ? '<div style="' + esc(s) + '">' + html + '</div>' : html; }
        function la(ds) {
            var ra = [];
            function di(n, duong) {
                var con = ds.filter(function (x) { return x.MACOT_CHA === n.MACOT; });
                if (!con.length) { ra.push({ c: n, group: duong }); return; }
                con.forEach(function (x) { di(x, duong.concat([n.TENCOT])); });
            }
            ds.filter(function (x) { return x.MACOT_CHA === null || x.MACOT_CHA === undefined || x.MACOT_CHA === ''; }).forEach(function (r) { di(r, []); });
            return ra;
        }
        function tai() {
            var bd = o.bd();
            host.innerHTML = ui.empty('Đang tải công thức điểm…', 'fa-spinner fa-spin');
            if (o.dem) o.dem.textContent = '';
            return get('D_CongThuc/LayChiTiet', { strDaoTao_HocPhan_Id: '', strDiem_DanhSachHoc_Id: bd.ID }).then(function (r) {
                var d = r.data || {};
                COT.nh = d.rsDSCotThongTinNguoiHoc || []; COT.diem = d.rsDSCotThongTinDiem || []; COT.la = la(COT.diem);
                return get('D_Hoc_NguoiHoc/LayDanhSach', { strDiem_DanhSachHoc_Id: bd.ID, strTieuChiSapXep: o.sx ? o.sx() : '' });
            }).then(function (r) {
                NH = arr(r.data); KQ = {};
                if (!NH.length || !COT.la.length) return null;
                var xong = 0;
                host.innerHTML = ui.empty('Đang tải điểm 0 / ' + COT.la.length + ' cột…', 'fa-spinner fa-spin');
                return Promise.all(COT.la.map(function (l) {
                    return get('D_Hoc_NguoiHoc_Diem/LayGiaTriDiemTheoDanhSach', { silent: true, strDaoTao_HocPhan_Id: NH[0].DAOTAO_HOCPHAN_ID, strDiem_DanhSachHoc_Id: NH[0].DIEM_DANHSACHHOC_ID,
                        strKyHieuCotDuLieu: l.c.MACOT }).then(function (r2) {
                        var m = KQ[l.c.MACOT] = {};
                        arr(r2.data).forEach(function (y) { m[y.QLSV_NGUOIHOC_ID] = y; });
                    }, function () { KQ[l.c.MACOT] = {}; })
                        .then(function () { xong++; host.innerHTML = ui.empty('Đang tải điểm ' + xong + ' / ' + COT.la.length + ' cột…', 'fa-spinner fa-spin'); });
                }));
            }).then(ve).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'bảng điểm'); });
        }
        function ve() {
            if (o.dem) o.dem.textContent = '(' + NH.length + ')';
            var cot = COT.nh.map(function (c) { return { title: e(c.TENCOT), render: function (x) { return boc(c, ui.escBr(x[c.MACOT])); } }; });
            if (o.chon !== false) cot.push({ head: 'Chọn <input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center is-nowrap', render: function (x, i) { return '<input type="checkbox" data-ck="' + i + '">'; } });
            COT.la.forEach(function (l, ci) {
                cot.push({ title: e(l.c.TENCOT), group: l.group, cls: 'is-center', render: function (x, ri) {
                    var r = (KQ[l.c.MACOT] || {})[x.QLSV_NGUOIHOC_ID];
                    if (!r) return '';
                    var gt = e(r.GIATRICOTDULIEU);
                    if (String(r.CHIXEM) === '1') return boc(l.c, esc(gt));
                    return '<input class="ums-input ums-input--sm nd-o" id="input' + esc(x.QLSV_NGUOIHOC_ID) + '_' + esc(l.c.MACOT) + '" data-r="' + ri + '" data-c="' + ci + '" data-he="' +
                        (o.he10 === false ? '' : esc(e(l.c.THANGDIEM))) + '" data-goc="' + esc(gt) + '" value="' + esc(gt) + '" autocomplete="off">';
                } });
            });
            ui.table({ el: host, rows: NH, columns: cot, stt: false, empty: NH.length ? 'Công thức điểm chưa có cột điểm' : 'Bảng điểm chưa có người học' });
            var t = host.querySelector('table');
            if (t) {
                t.id = 'tblNhapDiem'; t.setAttribute('colreport', '1'); t.classList.add('nd-luoi');
                if (COT.diem.length > 13) t.classList.add('nd-luoi--nho');
                Array.prototype.forEach.call(t.tBodies[0].rows, function (tr, i) { if (NH[i]) tr.id = NH[i].QLSV_NGUOIHOC_ID; });
            }
            if (o.onVe) o.onVe();
        }
        function oDoi() { return nd.oDoi(host); }
        function dong(x) { return NH.filter(function (n) { return n.QLSV_NGUOIHOC_ID === x; })[0]; }
        function goiTinh(n) {
            return { action: 'D_Hoc_NguoiHoc_Diem/Tinh_Diem_NguoiHoc_ThanhPhan', method: 'POST', strChucNang_Id: cn(), strUngDung_Id: vt(), strDaoTao_ThoiGianDaoTao_Id: n.DAOTAO_THOIGIANDAOTAO_ID,
                strDiem_DanhSach_NguoiHoc_Id: n.ID, strDiem_DanhSachHoc_Id: n.DIEM_DANHSACHHOC_ID, strQLSV_NguoiHoc_Id: n.QLSV_NGUOIHOC_ID, strDaoTao_ChuongTrinh_Id: n.CHUONGTRINH_ID,
                strDaoTao_HocPhan_Id: n.DAOTAO_HOCPHAN_ID, strDiem_ThanhPhanDiem_Id: '', strLanHoc: n.LANHOC, strLanThi: n.LANTHI, strGhiChu: '', strNguoiThucHien_Id: uid() };
        }
        function tinhLai() { return ui.batch(NH.map(goiTinh), { title: 'Đang tính lại điểm', okText: 'Tính lại điểm', concurrency: 5, show: true }).then(tai); }
        function luu() {
            var doi = oDoi();
            if (!doi.length) { ui.toast('Chưa có điểm mới nào cần lưu', 'info'); return; }
            ui.confirm('Bạn có chắc chắn muốn lưu điểm không? (' + doi.length + ' ô đã sửa)', { title: 'Lưu điểm' }).then(function (yes) {
                if (!yes) return;
                ui.batch(doi.map(function (i) {
                    var p = i.id.substring(5).split('_'), n = dong(p[0]), macot = p.slice(1).join('_');
                    return function () {
                        var x = goiTinh(n);
                        x.action = 'D_Hoc_NguoiHoc_Diem/Nhan_Diem_NguoiHoc_ThanhPhan'; x.strDiem_ThanhPhanDiem_Id = macot; x.strDiem = i.value.trim();
                        return ums.api.call(x).catch(function (err) { throw new Error(e(n.HODEMNGUOIHOC) + ' ' + e(n.TENNGUOIHOC) + ' (' + macot + ': ' + i.value + ') lỗi: ' + err.message); });
                    };
                }), { title: 'Đang lưu điểm', okText: 'Lưu điểm', concurrency: 5, show: true }).then(tinhLai);
            });
        }
        function rubric() {
            return ui.confirm('Lấy lại điểm theo Rubric cho cả bảng điểm? Điểm hiện có sẽ được quy đổi lại.', { title: 'Lấy điểm lại theo Rubric', tone: 'warn' }).then(function (yes) {
                if (!yes) return;
                return ums.api.call({ action: 'TP_XuLyTuKhoa/QuyDoiRubricTheoLopHocPhan', method: 'POST', dCapNhatLaiDuLieu: -1, strQLSV_NguoiHoc_Id: '', strDiem_DanhSachHoc_Id: o.bd().ID, strNguoiThucHien_Id: uid() })
                    .then(function () { ui.toast('Thực hiện hoàn tất', 'ok'); return tinhLai(); }).catch(function (err) { ums.api.handle(err, 'quy đổi Rubric'); });
            });
        }
        nd.phim(host);
        return {
            tai: tai, luu: luu, tinhLai: tinhLai, rubric: rubric, oDoi: oDoi,
            danhDau: function () { nd.danhDau(host); },
            hoiBo: function () { return oDoi().length ? ui.confirm('Có điểm chưa lưu. Bạn có chắc chắn muốn đóng và bỏ qua thay đổi không?', { tone: 'warn', ok: 'Bỏ thay đổi' }) : Promise.resolve(true); },
            daChon: function () {
                return Array.prototype.filter.call(host.querySelectorAll('input[data-ck]:checked'), function (c) { return c.getAttribute('data-ck') !== 'all'; })
                    .map(function (c) { return NH[Number(c.getAttribute('data-ck'))]; }).filter(Boolean);
            },
            NH: function () { return NH; }, COT: function () { return COT; }
        };
    };
})();
