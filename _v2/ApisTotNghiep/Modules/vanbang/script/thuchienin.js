/* =========================================================================
   Thực hiện in văn bằng
   Bản gốc: ApisTotNghiep/Modules/vanbang/html/thuchienin.html + script/thuchienin.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): khung tìm kiếm (Hệ · Khoá · CT · Lớp / Phân loại · Kế hoạch · Đối tượng · Mẫu phôi ·
   Mẫu bản sao / từ khoá · Tìm kiếm) → khung "Danh sách kế hoạch (n)" (In lần lượt · Tải file ảnh · Chế độ test),
   phân trang, khung "Chế độ test" (ẩn tới khi bật) và vùng PHÔI: mỗi người học của trang đang xem một bản phôi
   đã điền sẵn, xếp dọc.

   Lời gọi (chép nguyên):
       TN_VanBang_ChungChi_MH/DSA4BRIVDx4KJDUQNCAeAi4vJg8pIC8eFwMP · PKG_VANBANG_CHUNGCHI.LayDSTN_KetQua_CongNhan_VB (GET)
            strTuKhoa, strPhanLoai_Id, strDaoTao_HeDaoTao_Id, strDaoTao_KhoaDaoTao_Id, strDaoTao_ChuongTrinh_Id,
            strDaoTao_KhoaQuanLy_Id ('' — không có ô), strDaoTao_LopQuanLy_Id, strNguoiDung_Id / strNguoiTao_Id /
            strTinhTrangXacNhan_Id ('' — dropAAAA), pageIndex, pageSize, strChucNang_Id, strPhoi_MauPhoiIn_Id (ô Mẫu phôi),
            strPhoi_MauPhoiIn_BanSao_Id (ô Mẫu bản sao), dDoiTuongBenNgoai (-1 | 0 | 1), strTN_KeHoach_Id
       CMS_MauPhoiIn_ChiTiet/LayDanhSach (GET, strId = Mẫu phôi, không chọn thì Mẫu bản sao) → các ô của phôi — vẽ ở
            ums.tnvbPhoi (_tnvb_phoi.js; NOIDUNG tính bằng bộ tính biểu thức an toàn thay cho eval)
       TN_KetQua_CongNhan_VB/ThemMoi (POST) — sau khi bấm In: strTN_KetQua_CongNhan_VB_Id, strNguoiThucHien_Id (save_InBang;
            ghi nhận đã in — chỉ có hai tham số, GIỮ như gốc)
       CTT_Token/TaoQRCode (GET, strNoiDung) — khi mẫu phôi có ô QR
       Hệ → Khoá → CT → Lớp, Phân loại → Kế hoạch, hai ô mẫu phôi: ums.tnvb (_tnvb_chung.js). Phân loại = danh mục TN.PHANLOAI.

   Chế độ test (giữ như gốc, lưu localStorage của trình duyệt theo người dùng, KHÔNG gửi máy chủ, cùng khoá với màn cũ
   TEST_PHOI_ENABLED_<user> / TEST_PHOI_<user>_<ô> / TEST_PHOI_POS_<user>_<ô>): bảng các ô kèm ký hiệu (1)(2)…, giá trị mẫu
   (tính trên người học đầu trang), ô nhập giá trị test (đè lên NOIDUNG khi đang bật test), tọa độ — kéo ô trên phôi để
   căn lại; "Chỉ hiện ký hiệu"; "Reset tọa độ"; "Xóa giá trị test". Tọa độ đã kéo áp cả khi tắt test (như gốc).

   Khác gốc / lỗi gốc đã sửa:
     · Bảng tblThucHienIn gốc LUÔN TRỐNG (genTable_ThucHienIn return trước khi vẽ bảng) — bỏ hẳn; vùng phôi là danh sách.
     · "In lần lượt" hỏi lại trước khi in (mỗi lần in ghi nhận đã in lên máy chủ). Gốc in khối đầu rồi 2 giây sau xoá
       khối đó khỏi trang; sau khi in gọi me.getList_QuanLyThongTin (không có ở màn này → TypeError) — bỏ lời gọi đó.
     · makeQRCode: gốc dùng thư viện QRCode không được nạp → không bao giờ ra QR; nay lấy ảnh QR từ CTT_Token/TaoQRCode.
     · Ô "bảng lặp" ([x].) gốc viết hỏng (biến chưa khai báo) → ném lỗi và dừng điền các bản sau; nay làm theo ý định.
     · Hàm của ô phôi tìm theo khối của chính người học (gốc tìm theo id trùng giữa các bản → chỉ bản đầu có QR / ảnh).
     · Nội dung ô hiện dạng chữ (chặn HTML, giữ <br>); gốc đổ thẳng HTML.
     · Hệ → Khoá → CT → Lớp và Phân loại → Kế hoạch theo luật cha → con (khoá tầng dưới tới khi chọn tầng trên).
     · Không chọn mẫu phôi thì không vẽ (gốc vẫn gọi CMS_MauPhoiIn_ChiTiet với strId rỗng) — hiện lời nhắc chọn mẫu.
     · "Tải file ảnh": html2canvas đặt trong module (script/vendor), gốc nạp từ CDN.
   Cố ý bỏ (mã chết): #btnSave_ThucHienIn / save_ThucHienIn (không có nút), getList_ThoiGianDaoTao / NamNhapHoc / KhoaQuanLy /
     PhanLoai (TN_KeHoach/LayDSPhanLoaiXetTheoND2) / genList_TrangThaiSV (không ai gọi).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, T = ums.tnvb, PH = ums.tnvbPhoi, esc = ui.esc, e = T.e;
    var root = document.getElementById('tn-thuchienin');
    if (!root) return;

    function sel(k, ph, them) {
        return '<div class="ums-field"><select class="ums-select" data-f="' + k + '" data-ph="' + esc(ph) + '"' + (them || '') + '>' +
            '<option value=""></option></select></div>';
    }
    root.innerHTML = pat.page('Thực hiện in', '') +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            '<div class="ums-filter">' +
                sel('he', 'Tất cả hệ đào tạo') + sel('khoa', 'Tất cả khóa đào tạo') + sel('ct', 'Tất cả chương trình đào tạo') + sel('lop', 'Tất cả lớp') +
            '</div><div class="ums-filter ums-u-mt-3">' +
                sel('pl', 'Chọn phân loại') + sel('kh', 'Chọn kế hoạch') +
                '<div class="ums-field"><select class="ums-select" data-f="dt" data-required>' +
                    '<option value="-1">Tất cả đối tượng</option><option value="0">Đối tượng trong trường</option>' +
                    '<option value="1">Đối tượng ngoài trường</option></select></div>' +
                sel('phoi', 'Chọn mẫu phôi') +
            '</div><div class="ums-filter ums-u-mt-3">' + sel('bansao', 'Chọn mẫu bản sao') +
                '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
            '</div>' }) +
        pat.panel({ title: 'Danh sách kế hoạch', icon: 'fa-file-certificate', count: 'n',
            tools: ui.btn('print', { text: 'In lần lượt', mod: 'primary', attr: { 'data-a': 'in' } }) +
                ui.btn('print', { text: 'Tải file ảnh', icon: 'fa-image', attr: { 'data-a': 'anh' } }) +
                ui.btn('search', { text: 'Chế độ test', mod: 'warn', icon: 'fa-flask', attr: { 'data-a': 'test' } }),
            body:
                '<div data-z="test" hidden>' +
                    pat.panel({ title: 'Chế độ test — Nhập giá trị & Căn tọa độ các ô trên phôi', icon: 'fa-flask', cls: 'tnvb-test', flush: true,
                        tools: '<label class="ums-check"><input type="checkbox" data-a="kyhieu"> <span>Chỉ hiện ký hiệu (1)(2)... để dễ căn</span></label>' +
                            ui.btn('search', { text: 'Reset tọa độ', mod: 'out-warn', icon: 'fa-crosshairs', attr: { 'data-a': 'resetpos' } }) +
                            ui.btn('search', { text: 'Xóa giá trị test', mod: 'out-danger', icon: 'fa-eraser', attr: { 'data-a': 'resetval' } }),
                        body: '<div class="tnvb-test__note"><b>Cách dùng:</b> bật chế độ test → bảng này liệt kê mọi ô trên phôi kèm ký hiệu ' +
                            '(1), (2)… Có thể (a) kéo trực tiếp các ô trên phôi bên dưới để căn lại vị trí, (b) nhập giá trị test để thay nội dung ô. ' +
                            'Mọi thứ lưu trên trình duyệt này theo người dùng, không gửi lên máy chủ. Bạn tự chịu trách nhiệm về kết quả in.</div>' +
                            '<div data-z="ttbang"></div>' }) +
                '</div>' +
                '<div class="tnvb-phoi" data-z="phoi"></div>' +
                '<div data-z="pager"></div>' });
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

    var loc = T.boLoc({ he: f('he'), khoa: f('khoa'), ct: f('ct'), lop: f('lop'), pl: f('pl'), kh: f('kh') },
        { tuKhoa: function () { return (f('q').value || '').trim(); } });
    ums.api.dm('TN.PHANLOAI').then(function (d) { pat.fill(f('pl'), d, { head: 'Chọn phân loại' }); })
        .catch(function (err) { ums.api.handle(err, 'phân loại'); });

    /* ---------- Chế độ test: localStorage theo người dùng (khoá như màn cũ) ---------- */
    function uk() { return T.uid() || 'anon'; }
    function lsGet(k) { try { return localStorage.getItem(k); } catch (x) { return null; } }
    function lsSet(k, v) { try { if (v === null || v === undefined || v === '') localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (x) { /* trình duyệt chặn lưu */ } }
    var TEST = {
        bat: function () { return lsGet('TEST_PHOI_ENABLED_' + uk()) === '1'; },
        datBat: function (on) { lsSet('TEST_PHOI_ENABLED_' + uk(), on ? '1' : '0'); },
        chiKyHieu: function () { var c = root.querySelector('[data-a="kyhieu"]'); return !!(c && c.checked); },
        giaTri: function (id) { return lsGet('TEST_PHOI_' + uk() + '_' + id); },
        datGiaTri: function (id, v) { lsSet('TEST_PHOI_' + uk() + '_' + id, v); },
        viTri: function (id) {
            var s = lsGet('TEST_PHOI_POS_' + uk() + '_' + id);
            if (!s) return null;
            try { var o = JSON.parse(s); return typeof o.top === 'number' && typeof o.left === 'number' ? o : null; } catch (x) { return null; }
        },
        datViTri: function (id, pos) { lsSet('TEST_PHOI_POS_' + uk() + '_' + id, pos ? JSON.stringify(pos) : ''); }
    };

    /* ---------- Danh sách + phôi ---------- */
    var ds = [], ct = [], tong = 0, trang = { index: 1, size: 10 }, luot = 0;
    function maPhoi() { return f('phoi').value || f('bansao').value; }
    function tai(p) {
        if (p) trang.index = p;
        var sh = ++luot;
        z('phoi').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        z('pager').innerHTML = '';
        ums.api.call({ action: 'TN_VanBang_ChungChi_MH/DSA4BRIVDx4KJDUQNCAeAi4vJg8pIC8eFwMP', func: 'PKG_VANBANG_CHUNGCHI.LayDSTN_KetQua_CongNhan_VB',
            method: 'GET',
            strTuKhoa: (f('q').value || '').trim(), strPhanLoai_Id: loc.gtri('pl'),
            strDaoTao_HeDaoTao_Id: loc.gtri('he'), strDaoTao_KhoaDaoTao_Id: loc.gtri('khoa'), strDaoTao_ChuongTrinh_Id: loc.gtri('ct'),
            strDaoTao_KhoaQuanLy_Id: '', strDaoTao_LopQuanLy_Id: loc.gtri('lop'), strNguoiDung_Id: '', strNguoiTao_Id: '',
            pageIndex: trang.index, pageSize: trang.size, strChucNang_Id: T.cn(),
            strPhoi_MauPhoiIn_Id: f('phoi').value, strPhoi_MauPhoiIn_BanSao_Id: f('bansao').value,
            dDoiTuongBenNgoai: f('dt').value, strTinhTrangXacNhan_Id: '', strTN_KeHoach_Id: f('kh').value })
            .then(function (r) {
                if (sh !== luot) return null;
                ds = T.arr(r.data);
                tong = Number(r.pager) || ds.length;
                z('n').textContent = '(' + tong + ')';
                veTrang();
                if (!ds.length) { ct = []; z('phoi').innerHTML = ui.empty('Không tìm thấy dữ liệu'); veTest(); return null; }
                var mp = maPhoi();
                if (!mp) { ct = []; z('phoi').innerHTML = ui.empty('Chọn mẫu phôi (hoặc mẫu bản sao) để xem bản in', 'fa-file-certificate'); veTest(); return null; }
                return ums.api.call({ action: 'CMS_MauPhoiIn_ChiTiet/LayDanhSach', method: 'GET', strId: mp }).then(function (r2) {
                    if (sh !== luot) return;
                    ct = T.arr(r2.data);
                    veTest();
                    if (!ct.length) { z('phoi').innerHTML = ui.empty('Mẫu phôi chưa có nội dung'); return; }
                    PH.ve(z('phoi'), ct, ds, { test: TEST });
                });
            })
            .catch(function (err) {
                if (sh !== luot) return;
                z('phoi').innerHTML = ui.fail(err.message);
                ums.api.handle(err, 'PKG_VANBANG_CHUNGCHI.LayDSTN_KetQua_CongNhan_VB');
            });
    }
    function veTrang() {
        z('pager').innerHTML = tong ? ui.pager({ index: trang.index, size: trang.size, total: tong, onSize: function () {} }, ds.length) : '';
    }
    z('pager').addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-go]');
        if (!b || b.disabled) return;
        var p = Number(b.getAttribute('data-go'));
        if (p >= 1 && p <= Math.max(1, Math.ceil(tong / trang.size))) tai(p);
    });
    z('pager').addEventListener('change', function (ev) {
        if (!ev.target.hasAttribute('data-size')) return;
        trang.size = Number(ev.target.value) || 10;
        tai(1);
    });

    /* ---------- Bảng chế độ test (renderPanelTest) ---------- */
    function rutGon(s) { return String(s || '').replace(/aData\./g, ''); }
    function giaTriMau(d) {
        var nd = e(d.NOIDUNG), mau = ds[0];
        if (!mau || !nd) return { v: '', cls: 'ums-u-faint' };
        if (nd.indexOf('[x].') >= 0) return { v: '(template lặp)', cls: 'ums-u-faint' };
        if (/^\s*me\./.test(nd)) return { v: '(gọi hàm)', cls: 'ums-u-faint' };
        try {
            var v = PH.tinh(nd, { aData: mau, me: {} });
            if (v === null || v === undefined) return { v: '(null)', cls: 'ums-u-faint' };
            if (typeof v === 'string' || typeof v === 'number') return { v: String(v), cls: '' };
            return { v: '(' + typeof v + ')', cls: 'ums-u-faint' };
        } catch (ex) { return { v: '(lỗi: ' + ex.message + ')', cls: 'tnvb-loi' }; }
    }
    function nhanViTri(id) { var p = TEST.viTri(id); return p ? 'T:' + Math.round(p.top) + ' L:' + Math.round(p.left) : '(mặc định)'; }
    function veTest() {
        if (!TEST.bat()) return;
        ui.table({ el: z('ttbang'), rows: ct, empty: 'Chưa có ô nào (chọn mẫu phôi rồi Tìm kiếm)', chonCuoi: false, columns: [
            { title: 'Ký hiệu', cls: 'is-center', width: '80px', render: function (d, i) { return '<span class="tnvb-kyhieu">(' + (i + 1) + ')</span>'; } },
            { title: 'Biểu thức NOIDUNG', render: function (d) { return '<code class="tnvb-code">' + esc(rutGon(d.NOIDUNG)) + '</code>'; } },
            { title: 'Giá trị mẫu', render: function (d) { var m = giaTriMau(d); return '<span class="tnvb-mau ' + m.cls + '" title="' + esc(m.v) + '">' + esc(m.v) + '</span>'; } },
            { title: 'Giá trị test', width: '240px', render: function (d) {
                var m = giaTriMau(d), ph = m.v && !m.cls ? 'VD: ' + m.v.substring(0, 50) : 'Nhập giá trị test...';
                return '<input class="ums-input ums-input--sm" data-tt="' + esc(d.ID) + '" value="' + esc(e(TEST.giaTri(d.ID))) + '" placeholder="' + esc(ph) + '">';
            } },
            { title: 'Tọa độ (T, L)', cls: 'is-center', width: '130px', render: function (d) { return '<span class="tnvb-pos" data-pos="' + esc(d.ID) + '">' + esc(nhanViTri(d.ID)) + '</span>'; } },
            { title: 'Xóa', cls: 'is-actions', width: '64px', render: function (d) {
                return '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-xoatt="' + esc(d.ID) + '" title="Xóa giá trị test & tọa độ ô này"><i class="fa-light fa-trash-can"></i></button>';
            } }
        ] });
    }
    function dienLai() { if (ct.length && ds.length) PH.dien(z('phoi'), ct, ds, { test: TEST }); }
    function dungLai() { if (ct.length && ds.length) PH.ve(z('phoi'), ct, ds, { test: TEST }); }
    function apTest() {
        var on = TEST.bat(), b = root.querySelector('button[data-a="test"]');
        root.classList.toggle('tnvb-is-test', on);
        z('test').hidden = !on;
        b.classList.toggle('ums-btn--warn', !on);
        b.classList.toggle('ums-btn--save', on);
        if (on) veTest();
    }

    /* ---------- Kéo ô trên phôi để căn tọa độ (chỉ khi bật test) ---------- */
    var keo = null;
    z('phoi').addEventListener('pointerdown', function (ev) {
        var o = ev.target.closest('.tnvb-o[data-fid]');
        if (!o || !TEST.bat()) return;
        ev.preventDefault();
        keo = { el: o, id: o.getAttribute('data-fid'), x: ev.clientX, y: ev.clientY,
            top: parseFloat(o.style.marginTop) || 0, left: parseFloat(o.style.marginLeft) || 0 };
        o.classList.add('is-keo');
        try { o.setPointerCapture(ev.pointerId); } catch (x) { /* trình duyệt cũ */ }
    });
    z('phoi').addEventListener('pointermove', function (ev) {
        if (!keo) return;
        var top = keo.top + (ev.clientY - keo.y), left = keo.left + (ev.clientX - keo.x);
        Array.prototype.forEach.call(z('phoi').querySelectorAll('.tnvb-o[data-fid="' + keo.id + '"]'), function (x) {
            x.style.marginTop = top + 'px'; x.style.marginLeft = left + 'px';
        });
    });
    function thaKeo() {
        if (!keo) return;
        var top = parseFloat(keo.el.style.marginTop) || 0, left = parseFloat(keo.el.style.marginLeft) || 0;
        TEST.datViTri(keo.id, { top: top, left: left });
        var nhan = root.querySelector('[data-pos="' + keo.id + '"]');
        if (nhan) nhan.textContent = 'T:' + Math.round(top) + ' L:' + Math.round(left);
        keo.el.classList.remove('is-keo');
        keo = null;
    }
    z('phoi').addEventListener('pointerup', thaKeo);
    z('phoi').addEventListener('pointercancel', thaKeo);

    /* ---------- In lần lượt / Tải file ảnh ---------- */
    function tenNguoi(r) {
        var ten = (e(r.HODEM || r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.TEN || r.QLSV_NGUOIHOC_TEN)).trim();
        var ma = e(r.MASO || r.QLSV_NGUOIHOC_MASO);
        return (ma ? ma + ' - ' : '') + ten;
    }
    function banDau() { return z('phoi').querySelector('.tnvb-ban'); }
    function inLanLuot() {
        var ban = banDau();
        if (!ban) { ui.toast('Không còn bản phôi nào trên trang để in.', 'warn'); return; }
        var id = ban.getAttribute('data-ban');
        var r = ds.filter(function (x) { return String(x.ID) === id; })[0] || {};
        ui.confirm('In văn bằng của ' + (tenNguoi(r) || 'người học đầu tiên') + '? Sau khi in, hệ thống ghi nhận đã in.', { ok: 'In', title: 'In lần lượt' })
            .then(function (ok) {
                if (!ok) return;
                ui.print(ban.innerHTML, { title: 'Print',
                    css: PH.fontCss(e(ct[0] && ct[0].FONT)) + ' body{margin:0;font-family:inherit} @media print{@page{margin:0}body{margin:0}}' });
                ums.api.call({ action: 'TN_KetQua_CongNhan_VB/ThemMoi', strTN_KetQua_CongNhan_VB_Id: id, strNguoiThucHien_Id: T.uid() })
                    .catch(function (err) { ums.api.handle(err, 'TN_KetQua_CongNhan_VB/ThemMoi'); });
                /* gốc: 2 giây sau khi in thì bỏ khối vừa in khỏi trang — lần bấm sau in người kế tiếp */
                setTimeout(function () { if (ban.parentNode) ban.parentNode.removeChild(ban); }, 2000);
            });
    }
    function taiAnh(b) {
        var ban = banDau();
        if (!ban) { ui.toast('Chưa có bản phôi nào để chụp.', 'warn'); return; }
        b.disabled = true;
        PH.taiAnh(ban.querySelector('.tnvb-giay') || ban, 'bang-in.png')
            .catch(function (err) { ui.toast(err.message || 'Không tạo được ảnh', 'bad'); })
            .then(function () { b.disabled = false; });
    }

    /* ---------- Sự kiện ---------- */
    root.addEventListener('click', function (ev) {
        var x = ev.target.closest('[data-xoatt]');
        if (x && root.contains(x)) {
            var id = x.getAttribute('data-xoatt');
            TEST.datGiaTri(id, ''); TEST.datViTri(id, null);
            veTest(); dungLai();
            return;
        }
        var b = ev.target.closest('button[data-a]');
        if (!b || !root.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') tai(1);
        else if (a === 'in') inLanLuot();
        else if (a === 'anh') taiAnh(b);
        else if (a === 'test') { TEST.datBat(!TEST.bat()); apTest(); dienLai(); }
        else if (a === 'resetpos') { ct.forEach(function (d) { TEST.datViTri(d.ID, null); }); dungLai(); veTest(); }
        else if (a === 'resetval') { ct.forEach(function (d) { TEST.datGiaTri(d.ID, ''); }); veTest(); dienLai(); }
    });
    root.addEventListener('change', function (ev) {
        var t = ev.target;
        if (t.getAttribute('data-a') === 'kyhieu') { dienLai(); return; }
        if (t.hasAttribute('data-tt')) { TEST.datGiaTri(t.getAttribute('data-tt'), t.value); dienLai(); }
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(1); } });

    apTest();
    /* gốc: nạp xong danh sách mẫu phôi (genCombo_MauPhoiIn) thì tìm ngay */
    T.mauPhoi(f('phoi'), f('bansao'), { nhanSao: 'Chọn mẫu bản sao' }).then(function () { tai(1); });
})();
