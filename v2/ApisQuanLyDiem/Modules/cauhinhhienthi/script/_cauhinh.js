/* =========================================================================
   Khung dùng chung của hai màn "Cấu hình hiển thị" cột bảng nhập điểm:
     · cauhinhhienthi.js      — cấu hình theo NGƯỜI DÙNG  (D_CauHinhCotHienThi/*)
     · cauhinhhienthichung.js — cấu hình CHUNG theo chức năng (D_CauHinhCotHienThi_C/*)
   Hai tệp gốc (ApisQuanLyDiem/Modules/cauhinhhienthi/script/…) chép nhau gần từng dòng.
   ---------------------------------------------------------------------------
   ums.qldCH.man(root, { tieuDe, ctl: 'D_CauHinhCotHienThi' | 'D_CauHinhCotHienThi_C', chung: bool })
   Lời gọi (chép nguyên):
     Chức năng: CM_ChucNang/LayDanhSach (GET) — strNguoiDung_Id, strNgonNgu_Id '', strUngDung_Id = edu.system.appId
                (= VaiTro_Id → ums.state.roleId) · nhãn TENCHUCNANG
     Danh sách: <ctl>/LayDanhSach (GET) — strTuKhoa '', strChucNang_Id, strNguoiDung_Id '', strNguoiTao_Id '', pageIndex, pageSize
     Lưu:       <ctl>/ThemMoi (dòng mới) | <ctl>/CapNhat (dòng có ID 32 ký tự, strId) — MỖI dòng một lời gọi:
                strId, strNguoiThucHien_Id, strChucNang_Id, strNguoiDung_Id, strHienThi, strTenCot, strThuTu, strMaCot,
                strDoRong, strKichThuocFontChu, strCanLe ("text-align: left|center|right"), strChuDam (ghép
                "font-weight: bold;" "font-style:italic;" "text-decoration: underline;"), strChiXem, strDanhChoHeThong,
                strMaMauHienThi (mã màu 6 ký tự, không '#')
                · bản người dùng: strChucNang_Id / strNguoiDung_Id = CHUCNANG_ID / NGUOIDUNG_ID của DÒNG; dòng mới không
                  có dòng gốc → báo "Dữ liệu hệ thống chỉ có thể sửa" và bỏ qua (như gốc)
                · bản chung: strChucNang_Id = ô Chức năng đang chọn, strNguoiDung_Id ''
     Xoá:       <ctl>/Xoa (POST) — strId
   Khác gốc:
     · Ô màu: bỏ plugin bootstrap-colorselector → ô chọn thường (10 màu của gốc) kèm ô màu xem trước.
     · Lưu hàng loạt qua ums.ui.batch rồi NẠP LẠI (gốc lưu im lặng, không nạp lại → bấm Lưu lần hai là THÊM TRÙNG
       các dòng mới vì chúng vẫn mang id tạm 30 ký tự).
   Lỗi gốc đã sửa:
     · strChiXem gửi giá trị của ô "Hiển thị" (cả hai bản đọc cells[10] cho cả hai tham số) → nay gửi ô "Chỉ xem".
     · Dòng MỚI: ô của dòng mới không có ô STT ẩn nên mọi chỉ số lệch một cột (strThuTu nhận Mã cột, strMaCot nhận
       Tên cột…) → nay đọc theo tên ô.
     · Bản chung: strKichThuocFontChu đọc nhầm ô Độ rộng (cells[4]) → nay đọc ô Kích thước chữ.
     · Bản chung: cột STT là ô ẩn KHÔNG có giá trị → mọi lần Lưu ghi strThuTu RỖNG đè thứ tự cũ → nay gửi THUTU
       của dòng (ô vẫn chỉ hiện số thứ tự như gốc, không sửa được).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var H = ums.qldCH = ums.qldCH || {};
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function loi(t) { return function (err) { ums.api.handle(err, t); }; }

    /* 10 màu của #colorselector bản gốc (value = mã không '#') */
    var MAU = [['000000', 'Đen'], ['ffffff', 'Trắng'], ['44546a', 'Xám xanh đậm'], ['4472c4', 'Xanh dương'], ['ed7d31', 'Cam'],
        ['a5a5a5', 'Xám'], ['ffc000', 'Vàng'], ['5b9bd5', 'Xanh da trời'], ['70ad47', 'Xanh lá'], ['ff0000', 'Đỏ']];
    var CANLE = [['text-align: left', 'fa-align-left', 'Căn trái'], ['text-align: center', 'fa-align-center', 'Căn giữa'],
        ['text-align: right', 'fa-align-right', 'Căn phải']];
    var KIEU = [['font-weight: bold;', 'fa-bold', 'Chữ đậm'], ['font-style:italic;', 'fa-italic', 'Chữ nghiêng'],
        ['text-decoration: underline;', 'fa-underline', 'Gạch chân']];

    H.man = function (root, cfg) {
        root.innerHTML = pat.page(cfg.tieuDe, '') +
            pat.filterBar([{ key: 'cn', type: 'select', label: 'Tất cả chức năng' }]) +
            pat.panel({ title: 'Danh sách', icon: 'fa-list-ul', count: 'n', flush: true, zone: 'bang',
                tools: ui.btn('add', { text: 'Thêm dòng mới', mod: 'out-success', attr: { 'data-a': 'them' } }) +
                    ui.btn('save', { attr: { 'data-a': 'luu' } }) });
        ui.enhance(root);
        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
        var fcn = root.querySelector('[data-f="cn"]');

        ums.api.call({ action: 'CM_ChucNang/LayDanhSach', method: 'GET', silent: true,
            strNguoiDung_Id: uid(), strNgonNgu_Id: '', strUngDung_Id: (ums.state && ums.state.roleId) || '' })
            .then(function (r) { pat.fill(fcn, arr(r.data), { name: 'TENCHUCNANG', head: 'Tất cả chức năng' }); }).catch(loi('chức năng'));

        var DS = [], trang = { index: 1, size: 10 }, tong = 0, moi = 0;

        /* ---------- Ô của một dòng ------------------------------------------ */
        function inp(k, v) { return '<input class="ums-input ums-input--sm" data-k="' + k + '" value="' + esc(e(v)) + '" autocomplete="off">'; }
        function mauHtml(v) {
            v = String(e(v)).replace(/^#/, '');
            var co = MAU.some(function (m) { return m[0].toLowerCase() === v.toLowerCase(); });
            var o = (!v ? '<option value="" selected>(chưa chọn)</option>' : '') +
                (v && !co ? '<option value="' + esc(v) + '" selected>#' + esc(v) + '</option>' : '') +
                MAU.map(function (m) {
                    return '<option value="' + m[0] + '"' + (m[0].toLowerCase() === v.toLowerCase() ? ' selected' : '') +
                        ' style="background:#' + m[0] + ';color:' + (m[0] === 'ffffff' || m[0] === 'ffc000' ? '#000' : '#fff') + '">' + esc(m[1]) + '</option>';
                }).join('');
            return '<div class="qldch-mau"><span class="qldch-mau__o" data-o-mau style="background:' + (v ? '#' + esc(v) : 'transparent') + '"></span>' +
                '<select class="ums-select ums-input--sm" data-k="mau">' + o + '</select></div>';
        }
        function nhom(ds, dang, kieu) {
            return '<div class="qldch-nhom">' + ds.map(function (x) {
                return '<button type="button" class="ums-iconbtn qldch-nut" data-' + kieu + '="' + esc(x[0]) + '" aria-pressed="' + (dang(x[0]) ? 'true' : 'false') +
                    '" title="' + esc(x[2]) + '"><i class="fa-light ' + x[1] + '"></i></button>';
            }).join('') + '</div>';
        }
        function bat(k, on) {
            return '<button type="button" class="ums-iconbtn qldch-bat" data-bat="' + k + '" aria-pressed="' + (on ? 'true' : 'false') + '" title="Bật / tắt">' +
                '<i class="fa-solid ' + (on ? 'fa-toggle-on' : 'fa-toggle-off') + '"></i></button>';
        }
        function kieuCo(r) {
            var s = String(e(r.CHUDAM)).split(';').map(function (x) { return x.trim(); }).filter(Boolean);
            return function (ten) { return s.indexOf(ten.replace(/;$/, '').trim()) >= 0; };
        }
        var COT = [
            { title: 'Stt', cls: 'is-center', width: '64px', render: function (r, i) {
                if (r._moi) return inp('thutu', r._stt);
                if (cfg.chung) return '<span data-k-stt>' + ((trang.index - 1) * trang.size + i + 1) + '</span>';
                return inp('thutu', r.THUTU);
            } },
            { title: 'Mã cột', render: function (r) { return inp('macot', r.MACOT); } },
            { title: 'Tên cột', render: function (r) { return inp('tencot', r.TENCOT); } },
            { title: 'Độ rộng', width: '80px', render: function (r) { return inp('dorong', r.DORONG); } },
            { title: 'Kích thước chữ', width: '90px', render: function (r) { return inp('kichthuoc', r.KICHTHUOCFONTCHU); } },
            { title: 'Màu', cls: 'is-center', render: function (r) { return mauHtml(r._moi ? MAU[0][0] : r.MAMAUHIENTHI); } },
            { title: 'Căn lề', cls: 'is-center is-nowrap', render: function (r) { return nhom(CANLE, function (x) { return e(r.CANLE) === x; }, 'canle'); } },
            { title: 'Kiểu chữ', cls: 'is-center is-nowrap', render: function (r) { return nhom(KIEU, kieuCo(r), 'kieu'); } },
            { title: 'Chỉ xem', cls: 'is-center', width: '80px', render: function (r) { return bat('chixem', r._moi ? true : String(e(r.CHIXEM)) === '1'); } },
            { title: 'Hiển thị', cls: 'is-center', width: '80px', render: function (r) { return bat('hienthi', r._moi ? true : String(e(r.HIENTHI)) === '1'); } },
            { title: 'Hệ thống', cls: 'is-center', width: '85px', render: function (r) { return bat('hethong', r._moi ? false : String(e(r.DANHCHOHETHONG)) === '1'); } },
            { title: 'Xóa', cls: 'is-center', width: '60px', render: function () { return ui.iconBtn('del'); } }
        ];

        function tai() {
            z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return ums.api.call({ action: cfg.ctl + '/LayDanhSach', method: 'GET',
                strTuKhoa: '', strChucNang_Id: pat.val(fcn), strNguoiDung_Id: '', strNguoiTao_Id: '',
                pageIndex: trang.index, pageSize: trang.size })
                .then(function (r) { DS = arr(r.data); tong = r.pager || DS.length; ve(); })
                .catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'cấu hình hiển thị'); });
        }
        function ve() {
            z('n').textContent = '(' + DS.length + ')';
            ui.table({ el: z('bang'), rows: DS, stt: false, columns: COT, empty: 'Chưa có cấu hình cột — bấm "Thêm dòng mới"',
                tableCls: 'ums-table--lined qldch-bang',
                page: { index: trang.index, size: trang.size, total: tong,
                    onChange: function (p) { trang.index = p; tai(); },
                    onSize: function (n) { trang.size = n; trang.index = 1; tai(); } } });
        }

        /* genHTML_CauHinhHienThiCot — thêm một dòng trống vào cuối bảng */
        function themDong() {
            var tb = z('bang').querySelector('tbody');
            if (!tb) return;
            var trs = Array.prototype.filter.call(tb.rows, function (tr) { return tr.hasAttribute('data-id') || tr.hasAttribute('data-moi'); });
            if (!trs.length) tb.innerHTML = '';
            var r = { _moi: true, _stt: trs.length + 1 };
            var key = 'moi' + (++moi);
            var tr = document.createElement('tr');
            tr.setAttribute('data-moi', key);
            tr.innerHTML = COT.map(function (c) { return '<td class="' + esc(c.cls || '') + '">' + c.render(r, trs.length) + '</td>'; }).join('');
            tb.appendChild(tr);
            var o = tr.querySelector('[data-k="macot"]'); if (o) o.focus();
        }

        function giaTri(tr) {
            function k(x) { var el = tr.querySelector('[data-k="' + x + '"]'); return el ? el.value : ''; }
            function b(x) { var el = tr.querySelector('[data-bat="' + x + '"]'); return el && el.getAttribute('aria-pressed') === 'true' ? '1' : '0'; }
            var canLe = '', chuDam = '';
            Array.prototype.forEach.call(tr.querySelectorAll('[data-canle][aria-pressed="true"]'), function (x) { canLe = canLe || x.getAttribute('data-canle'); });
            Array.prototype.forEach.call(tr.querySelectorAll('[data-kieu][aria-pressed="true"]'), function (x) { chuDam += x.getAttribute('data-kieu'); });
            return { thutu: k('thutu'), macot: k('macot'), tencot: k('tencot'), dorong: k('dorong'), kichthuoc: k('kichthuoc'),
                mau: k('mau'), canle: canLe, chudam: chuDam, chixem: b('chixem'), hienthi: b('hienthi'), hethong: b('hethong') };
        }

        function luu() {
            var tb = z('bang').querySelector('tbody');
            if (!tb) return;
            var calls = [], boQua = 0;
            Array.prototype.forEach.call(tb.rows, function (tr) {
                var id = tr.getAttribute('data-id') || '';
                if (!id && !tr.hasAttribute('data-moi')) return;
                var rec = id ? DS.filter(function (x) { return x.ID === id; })[0] : null;
                if (!cfg.chung && !rec) { boQua++; return; }
                var g = giaTri(tr);
                var p = {
                    action: cfg.ctl + '/ThemMoi', strId: '', strNguoiThucHien_Id: uid(),
                    strChucNang_Id: cfg.chung ? pat.val(fcn) : e(rec.CHUCNANG_ID),
                    strNguoiDung_Id: cfg.chung ? '' : e(rec.NGUOIDUNG_ID),
                    strHienThi: g.hienthi, strTenCot: g.tencot,
                    strThuTu: cfg.chung && rec ? e(rec.THUTU) : g.thutu,
                    strMaCot: g.macot, strDoRong: g.dorong, strKichThuocFontChu: g.kichthuoc,
                    strCanLe: g.canle, strChuDam: g.chudam, strChiXem: g.chixem, strDanhChoHeThong: g.hethong,
                    strMaMauHienThi: g.mau, method: 'POST'
                };
                if (id.length === 32) { p.action = cfg.ctl + '/CapNhat'; p.strId = id; }
                calls.push(p);
            });
            if (boQua) ui.toast('Dữ liệu hệ thống chỉ có thể sửa' + (boQua > 1 ? ' (' + boQua + ' dòng mới bị bỏ qua)' : ''), 'warn');
            if (!calls.length) return;
            ui.batch(calls, { title: 'Đang lưu cấu hình', okText: 'Lưu thành công', show: true }).then(tai);
        }

        root.addEventListener('change', function (ev) {
            var s = ev.target;
            if (s.matches && s.matches('select[data-k="mau"]')) {
                var o = s.parentNode.querySelector('[data-o-mau]');
                if (o) o.style.background = s.value ? '#' + s.value : 'transparent';
            }
        });
        root.addEventListener('click', function (ev) {
            var t = ev.target;
            var cl = t.closest('[data-canle]');
            if (cl) {
                Array.prototype.forEach.call(cl.parentNode.querySelectorAll('[data-canle]'), function (x) { x.setAttribute('aria-pressed', x === cl ? 'true' : 'false'); });
                return;
            }
            var kc = t.closest('[data-kieu]');
            if (kc) { kc.setAttribute('aria-pressed', kc.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); return; }
            var bt = t.closest('[data-bat]');
            if (bt) {
                var on = bt.getAttribute('aria-pressed') !== 'true';
                bt.setAttribute('aria-pressed', on ? 'true' : 'false');
                bt.querySelector('i').className = 'fa-solid ' + (on ? 'fa-toggle-on' : 'fa-toggle-off');
                return;
            }
            var del = t.closest('[data-act="del"]');
            if (del) {
                var tr = del.closest('tr');
                if (tr.hasAttribute('data-moi')) { tr.parentNode.removeChild(tr); return; }
                var id = tr.getAttribute('data-id');
                ui.confirm('Bạn có chắc chắn muốn xóa không?', { tone: 'bad', ok: 'Xóa', title: 'Xóa cấu hình cột' }).then(function (yes) {
                    if (!yes) return;
                    ums.api.call({ action: cfg.ctl + '/Xoa', method: 'POST', strNguoiThucHien_Id: uid(), strId: id })
                        .then(function () { ui.toast('Xóa thành công!', 'ok'); tai(); }).catch(loi('xóa cấu hình cột'));
                });
                return;
            }
            var b = t.closest('[data-a]');
            if (!b || b.disabled || !root.contains(b)) return;
            var a = b.getAttribute('data-a');
            if (a === 'search') { trang.index = 1; tai(); }
            else if (a === 'them') themDong();
            else if (a === 'luu') luu();
        });

        tai();
    };
})();
