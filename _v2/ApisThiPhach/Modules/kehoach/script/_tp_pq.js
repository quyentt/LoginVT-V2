/* =========================================================================
   Thi phách — PHÂN QUYỀN NHẬP ĐIỂM (theo Túi / theo Danh sách thi / theo Lớp học phần)
   Khung chung của ba màn: ums.tpPq.man(root, cfg)
   Bản gốc (ba bản chép lệch nhau, vỏ indexi):
       kehoach/html/phanquyennhapdiem.html     + script/phanquyennhapdiem.js      (theo Túi — 1.489 dòng)
       kehoach/html/phanquyennhapdiemdst.html  + script/phanquyennhapdiemdst.js   (theo DST — 1.504 dòng)
       kehoach/html/phanquyennhapdiemlhp.html  + script/phanquyenlophocphan.js    (theo Lớp HP — 1.787 dòng, chép từ màn
                                                                                   Lớp học phần của Đăng ký học)
   ---------------------------------------------------------------------------
   PHẦN CHUNG của cả ba bản (tệp này):
     · MỘT CỘT như gốc: thanh lọc → khung "Danh sách" (cột ô đánh dấu + nút "Quyền nhập điểm" từng dòng);
       ba vùng thay chỗ cả trang (edu.util.toggle_overide): chi tiết · "Phân quyền" · "Danh sách phân quyền".
     · Vùng "Phân quyền" (#zonePhanQuyen): Quyền cần phân (danh mục CHUNG.HANHDONG, chọn nhiều) · bảng đối tượng (trái) ·
       Đơn vị + bảng cán bộ (phải). Lưu = MỖI đối tượng × MỖI cán bộ × MỖI quyền một lời gọi POST (action theo kiểu).
         Đơn vị: ums.ref.coCauToChuc({ strCCTC_Loai_Id '', strCCTC_Cha_Id '', iTrangThai 1 }) = edu.system.getList_CoCauToChuc
         Cán bộ: ums.ref.nhanSu({ strTuKhoa '', pageIndex 1, pageSize 100000, strCoCauToChuc_Id = ô đơn vị,
                 strTinhTrangNhanSu_Id '', dLaCanBoNgoaiTruong -1 }) = edu.system.getList_NhanSu → MASO, HODEM, TEN, COCAUTOCHUC_TEN
     · Vùng "Danh sách phân quyền" (#zoneDSPhanQuyen): GET danh sách quyền của MỘT dòng, xoá nhiều dòng (mỗi dòng một POST).
   PHẦN LỆCH khai trong cfg (ba tệp màn mỏng): bộ lọc, lời gọi danh sách + cột, nút thao tác, báo cáo, vùng chi tiết,
     bốn lời gọi của khối quyền (đối tượng / thêm / danh sách / xoá).

   cfg = {
     tieuDe,
     loc(host, { onDoi }) → { f(k), v(k), xong: Promise }      bộ lọc (P.locThi, P.locLhp)
     tuTai: true                     nạp danh sách khi mở màn và mỗi lần đổi ô lọc (bản Túi); false = chỉ khi bấm Tìm kiếm
     doiTai: [khoá ô lọc]            (khi tuTai false) đổi các ô này thì nạp lại danh sách (bản Lớp HP: tg, hp)
     ds: { goi(L) → lời gọi, phanTrang, cot(ctx) → cột ui.table, khop(x) → chuỗi để lọc tại chỗ theo ô từ khoá (bản gốc
           không gửi từ khoá), rong, nhac, hanh: { khoá: fn(dòng) } nút trong dòng mang data-h="khoá" data-i="chỉ số" }
     nutO: 'trang' | 'khung'         nút thao tác nằm đầu trang (gốc: cạnh nút Tìm kiếm) hay đầu khung Danh sách (bản Lớp HP)
     xacNhan: { loai, chuDe }        nút "Xác nhận" trên các dòng đánh dấu (chỉ bản Túi — hai bản kia gốc đã bỏ nút)
     nutThem: [{ a, html, chay(dòngĐãChọn, ctx) }]
     baoCao: { import, collect(add, ctx) }
     chiTiet(host, dòng, ctx)        vẽ vùng chi tiết (P.nhapDiem của _tp_pq_nhap.js); bỏ trống = dòng không bấm mở được
     quyen: { danhTu, tenBang, doiTuong: { goi(ids) | null, cot }, them(idDoiTuong, idNguoiDung, idHanhDong) → lời gọi,
              ds(idDòng) → lời gọi, cotDs, xoa(id) → lời gọi, nutThemKhoa: true (nút "Thêm" gốc không có xử lý) }
   }
   ---------------------------------------------------------------------------
   Không chép (lỗi rõ của cả ba bản gốc):
     · Lưu phân quyền bắn N × M × K lời gọi một lúc, KHÔNG hỏi lại, mỗi lời gọi một thông báo → hỏi lại kèm số lượt ghi,
       chạy qua ums.ui.batch (5 luồng), báo gộp một lần.
     · Bấm "Xóa" nhiều lần thì #btnYes bị gắn nhiều trình xử lý (xoá lặp); xoá xong nạp lại danh sách sau MỖI lời gọi → một lần.
     · Bảng cán bộ: bPaginate trỏ hàm của màn khác (main_doc.NhapDiem ở bản Lớp HP), bảng quyền trỏ getList_NhapDiem →
       phân trang + ô tìm tại chỗ (máy khách), ô đánh dấu giữ qua trang.
     · Thông báo lỗi ghi "TN_KeHoach/Xoa" (chép từ màn khác) → theo Message máy chủ.
     · console.log(data) trong genTable_HS (bản DST).
   Tự chốt (báo cáo nhóm D):
     · Đổi Đơn vị thì BỎ các cán bộ đã đánh dấu (như gốc — bảng vẽ lại là mất dấu); tìm / sang trang tại chỗ thì giữ.
     · Lưu phân quyền xong Ở LẠI vùng Phân quyền (như gốc); Đóng thì nạp lại danh sách (toggle_form của gốc).
     · Hai khung "Danh sách" của vùng Phân quyền (gốc cùng tên) ghi rõ "Danh sách <đối tượng>" / "Danh sách cán bộ".
     · Cột Đơn vị của cán bộ đọc COCAUTOCHUC_TEN như gốc, không có thì DAOTAO_COCAUTOCHUC_TEN — kiểm tên cột trên host.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var P = ums.tpPq = ums.tpPq || {};
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function cn() { return (ums.state && ums.state.chucNangId) || ''; }
    function vt() { return (ums.state && ums.state.roleId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function qa(el, s) { return Array.prototype.slice.call(el.querySelectorAll(s)); }
    function dang() { return ui.empty('Đang tải…', 'fa-spinner fa-spin'); }
    function boDau(s) { return String(e(s)).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd'); }
    P.uid = uid; P.cn = cn; P.vt = vt; P.e = e; P.arr = arr; P.dang = dang; P.boDau = boDau;

    /** Lời gọi kiểu cũ (không func, không mã hoá) — GET để đọc, POST để ghi, đúng như từng hàm gốc */
    P.goiGet = function (a, o) { return Object.assign({ action: a, method: 'GET', strNguoiThucHien_Id: uid() }, o); };
    P.goiPost = function (a, o) { return Object.assign({ action: a, method: 'POST', strNguoiThucHien_Id: uid() }, o); };
    P.get = function (a, o) { return ums.api.call(P.goiGet(a, o)); };

    /* ---------- Mảnh dựng thanh lọc / bảng ---------------------------------- */
    P.sel = function (k, ph, o) {
        o = o || {};
        return '<div class="ums-field"><select class="ums-select" data-f="' + esc(k) + '" data-ph="' + esc(ph) + '"' + (o.nhieu ? ' multiple' : '') +
            (o.batBuoc ? ' data-required' : '') + '>' + (o.nhieu || o.opts ? '' : '<option value=""></option>') + (o.opts || '') + '</select></div>';
    };
    P.inp = function (k, ph, so) {
        return '<div class="ums-field"><input class="ums-input" data-f="' + esc(k) + '"' + (so ? ' inputmode="numeric"' : '') + ' placeholder="' + esc(ph) + '" autocomplete="off"></div>';
    };
    P.nutTim = function () { return '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>'; };
    /** Cột ô đánh dấu: ô tiêu đề data-all="<attr>", ô dòng <attr>="chỉ số dòng" */
    P.cotChon = function (attr) {
        return { head: '<input type="checkbox" data-all="' + attr + '" title="Chọn tất cả">', cls: 'is-center', width: '44px',
            render: function (x, i) { return '<input type="checkbox" data-' + attr + '="' + i + '">'; } };
    };
    P.chon = function (host, attr, rows) {
        return qa(host, 'tbody input[data-' + attr + ']:checked').map(function (c) { return rows[Number(c.getAttribute('data-' + attr))]; }).filter(Boolean);
    };
    /** Ô liên kết mở vùng chi tiết (a.btnEdit của gốc) */
    P.lk = function (txt, i) { return '<a href="javascript:void(0)" class="nd-lk" data-mo="' + i + '" title="Chi tiết">' + esc(e(txt)) + '</a>'; };
    P.cotQuyen = function () {
        return { title: 'Quyền nhập điểm', cls: 'is-center is-nowrap', render: function (x, i) {
            return ui.btn('view', { text: 'Quyền nhập điểm', cls: 'ums-btn--sm', attr: { 'data-q': i, title: 'Danh sách phân quyền' } }); } };
    };
    P.cotNguoiDung = function () {
        return { title: 'Người dùng', render: function (x) { return esc(e(x.NGUOIDUNG_TAIKHOAN) + ' (' + e(x.NGUOIDUNG_TENDAYDU) + ')'); } };
    };

    /* ---------- Bộ lọc Thời gian → Loại điểm → Hình thức thi → Đợt thi → Môn thi (bản Túi, bản DST) ----------
       TP_Chung/LayThoiGian · LayLoaiDiem · LayHinhThucThi · LayDotThi · LayHocPhan (GET) — ums.nd.locThi của Cổng cán bộ
       (cùng lời gọi, cùng tham số). Gốc KHÔNG tự chọn thời gian đầu → chonDau bỏ. */
    P.locThi = function (o) {
        o = o || {};
        return function (host, m) {
            host.innerHTML = pat.panel({ title: false, cls: 'ums-u-mb-4', body: '<div class="ums-filter">' +
                P.sel('tg', 'Chọn thời gian') + P.sel('ld', 'Chọn loại điểm') + P.sel('ht', 'Chọn hình thức thi') + P.sel('dot', 'Chọn đợt thi') + P.sel('mon', 'Chọn môn thi') +
                (o.hoanThanh ? P.sel('htnd', 'Chọn hoàn thành nhập điểm', { batBuoc: true,
                    opts: '<option value="0">-- Chọn hoàn thành nhập điểm --</option><option value="1">Hoàn thành nhập điểm</option>' }) : '') +
                P.inp('q', 'Nhập từ khóa tìm kiếm') + P.nutTim() + '</div>' });
            ui.enhance(host);
            function f(k) { return host.querySelector('[data-f="' + k + '"]'); }
            function v(k) { return f(k) ? pat.val(f(k)) : ''; }
            var L = ums.nd.locThi({ f: f, tenMon: function (x) { return e(x.TEN) + ' - ' + e(x.MA); }, onDoi: m.onDoi });
            return { f: f, v: v, xong: L.xong };
        };
    };

    /* =====================================================================
       KHUNG MÀN
       ===================================================================== */
    P.man = function (root, cfg) {
        if (!root) return;
        var Q = cfg.quyen, khung = cfg.nutO === 'khung';
        var nutThaoTac = (cfg.xacNhan ? ui.btn('confirm', { text: 'Xác nhận', attr: { 'data-a': 'xacnhan' } }) : '') +
            (cfg.nutThem || []).map(function (n) { return n.html; }).join('') +
            ui.btn('save', { text: 'Phân quyền', icon: 'fa-sitemap', mod: 'primary', attr: { 'data-a': 'pq' } });

        root.innerHTML =
            '<section data-v="ds">' + pat.page(cfg.tieuDe, (cfg.baoCao ? '<span data-z="bc"></span>' : '') + (khung ? '' : nutThaoTac)) +
                '<div data-z="loc"></div>' +
                pat.panel({ title: 'Danh sách', icon: 'fa-list-timeline', count: 'n', flush: true, zone: 'bang', cls: 'tppq-ds', tools: khung ? nutThaoTac : '' }) + '</section>' +
            '<section data-v="ct" hidden></section>' +
            '<section data-v="pq" hidden>' + pat.page('Phân quyền', ui.btn('close', { attr: { 'data-a': 'dong' } }) + ui.btn('save', { attr: { 'data-a': 'luupq' } })) +
                pat.panel({ title: 'Quyền cần phân', icon: 'fa-user-tag', body:
                    '<div class="ums-field"><select class="ums-select" data-f="hd" data-ph="Chọn quyền cần phân" multiple></select></div>' }) +
                '<div class="ums-grid ums-grid--2 tppq-hai">' +
                    pat.panel({ title: 'Danh sách ' + Q.danhTu, icon: 'fa-list-ul', count: 'nsp', flush: true, zone: 'sp' }) +
                    pat.panel({ title: 'Danh sách cán bộ', icon: 'fa-users', count: 'nns', flush: true, body:
                        '<div class="ums-filter tppq-pad">' + P.sel('dv', 'Chọn bộ môn') + P.inp('qns', 'Tìm trong danh sách cán bộ') + '</div><div data-z="ns"></div>' }) +
                '</div></section>' +
            '<section data-v="dsq" hidden>' + pat.page('Danh sách phân quyền', ui.btn('close', { attr: { 'data-a': 'dong' } })) +
                pat.panel({ title: 'Danh sách', icon: 'fa-user-shield', count: 'ndq', flush: true, zone: 'dq',
                    tools: (Q.nutThemKhoa ? ui.btn('add', { text: 'Thêm', mod: 'out-success', attr: { disabled: 'disabled', title: 'Bản gốc chưa có xử lý cho nút này' } }) : '') +
                        ui.xoaChon('input[data-dq]', { attr: { 'data-a': 'xoaq' } }) + ui.btn('reload', { attr: { 'data-a': 'tailaiq' } }) }) + '</section>';
        ui.enhance(root);
        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
        function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
        function vung(k) { return root.querySelector('[data-v="' + k + '"]'); }
        var dangO = 'ds';
        function sang(k) { if (k === dangO) return; ui.swap(vung(dangO), vung(k), { top: true }); dangO = k; }

        /* ---------- Danh sách -------------------------------------------- */
        var DS = [], hien = [], tong = 0, luot = 0, trang = { index: 1, size: 10 }, daTai = false;
        var ctx = { root: root, moDong: null, daChon: daChon, tai: function () { return tai(trang.index); }, dong: dong };
        var L = cfg.loc(z('loc'), { onDoi: function (k) {
            if (cfg.tuTai || (cfg.doiTai && cfg.doiTai.indexOf(k) >= 0)) tai(1);
        } });
        ctx.L = L;
        function tuKhoa() { return L.f('q') ? (L.f('q').value || '').trim() : ''; }
        function tai(idx) {
            var sh = ++luot;
            trang.index = idx || 1;
            daTai = true;
            z('bang').innerHTML = dang();
            var goi = cfg.ds.goi(L);
            if (cfg.ds.phanTrang) { goi.pageIndex = trang.index; goi.pageSize = trang.size; }
            return ums.api.call(goi).then(function (r) {
                if (sh !== luot) return;
                DS = arr(r.data); tong = Number(r.pager) || DS.length;
                ve();
            }).catch(function (err) { if (sh !== luot) return; z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách ' + Q.danhTu); });
        }
        function ve() {
            var q = boDau(tuKhoa());
            hien = cfg.ds.khop && q ? DS.filter(function (x) { return boDau(cfg.ds.khop(x)).indexOf(q) >= 0; }) : DS;
            z('n').textContent = '(' + ui.so(cfg.ds.phanTrang ? tong : hien.length) + ')';
            ui.table({ el: z('bang'), rows: hien, columns: cfg.ds.cot(ctx), empty: cfg.ds.rong || 'Không có dữ liệu', tableCls: cfg.ds.lopBang,
                page: cfg.ds.phanTrang ? { index: trang.index, size: trang.size, total: tong, onChange: function (i) { tai(i); },
                    onSize: function (n) { trang.size = n; tai(1); } } : undefined });
        }
        function daChon() { return P.chon(z('bang'), 'cd', hien); }
        function dong() { sang('ds'); return daTai || cfg.tuTai ? tai(trang.index) : null; }

        if (cfg.baoCao) ums.report.mount(z('bc'), { import: cfg.baoCao.import, collect: function (add) { return cfg.baoCao.collect(add, ctx); } });
        if (cfg.tuTai) L.xong.then(function () { tai(1); });
        else z('bang').innerHTML = ui.empty(cfg.ds.nhac || 'Chọn điều kiện rồi bấm "Tìm kiếm"', 'fa-hand-pointer');

        /* ---------- Vùng "Phân quyền" ------------------------------------ */
        var SP = [], NS = [], nsHien = [], nsChon = {}, nsTrang = { index: 1, size: 10 }, nsDaNap = false, henTim = null;
        ums.api.dm('CHUNG.HANHDONG').then(function (d) { pat.fill(f('hd'), d || []); })
            .catch(function (err) { ums.api.handle(err, 'danh mục hành động'); });
        ums.ref.coCauToChuc({ strCCTC_Loai_Id: '', strCCTC_Cha_Id: '', iTrangThai: 1 })
            .then(function (d) { pat.fill(f('dv'), d, { head: 'Chọn bộ môn' }); }).catch(function (err) { ums.api.handle(err, 'đơn vị'); });
        if (window.jQuery) jQuery(f('dv')).on('select2:select select2:clear', function () { nsChon = {}; napNS(); });

        function veSP(chonSan) {
            z('nsp').textContent = '(' + SP.length + ')';
            ui.table({ el: z('sp'), rows: SP, empty: 'Không có ' + Q.danhTu, columns: Q.doiTuong.cot.concat([P.cotChon('sp')]) });
            if (chonSan) qa(z('sp'), 'input[data-sp], input[data-all="sp"]').forEach(function (c) { c.checked = SP.length > 0; });
        }
        function napNS() {
            nsDaNap = true;
            z('ns').innerHTML = dang();
            return ums.ref.nhanSu({ strTuKhoa: '', pageIndex: 1, pageSize: 100000, strCoCauToChuc_Id: pat.val(f('dv')), strTinhTrangNhanSu_Id: '', dLaCanBoNgoaiTruong: -1 })
                .then(function (d) { NS = d || []; nsTrang.index = 1; veNS(); })
                .catch(function (err) { z('ns').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách cán bộ'); });
        }
        function hoTen(x) { return (e(x.HODEM) + ' ' + e(x.TEN)).trim(); }
        function veNS() {
            var q = boDau(f('qns').value.trim());
            nsHien = q ? NS.filter(function (x) { return boDau([x.MASO, hoTen(x), x.COCAUTOCHUC_TEN, x.DAOTAO_COCAUTOCHUC_TEN].join(' ')).indexOf(q) >= 0; }) : NS;
            var dau = (nsTrang.index - 1) * nsTrang.size, doan = nsHien.slice(dau, dau + nsTrang.size);
            demNS();
            ui.table({ el: z('ns'), rows: doan, empty: 'Không có cán bộ', columns: [{ title: 'Mã số', prop: 'MASO', cls: 'is-nowrap' },
                { title: 'Họ tên', render: function (x) { return esc(hoTen(x)); } },
                { title: 'Đơn vị', render: function (x) { return esc(e(x.COCAUTOCHUC_TEN) || e(x.DAOTAO_COCAUTOCHUC_TEN)); } },
                { head: '<input type="checkbox" data-all="ns" title="Chọn tất cả (trang đang xem)">', cls: 'is-center', width: '44px',
                    render: function (x) { return '<input type="checkbox" data-ns="' + esc(x.ID) + '"' + (nsChon[x.ID] ? ' checked' : '') + '>'; } }],
                page: { index: nsTrang.index, size: nsTrang.size, total: nsHien.length, onChange: function (i) { nsTrang.index = i; veNS(); },
                    onSize: function (n) { nsTrang.size = n; nsTrang.index = 1; veNS(); } } });
            if (ui.dongBoChon) ui.dongBoChon(z('ns').querySelector('table'));
        }
        function demNS() {
            var n = Object.keys(nsChon).length;
            z('nns').textContent = '(' + ui.so(nsHien.length) + ')' + (n ? ' — đã chọn ' + n : '');
        }
        function moPQ() {
            var chon = daChon();
            if (!chon.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
            sang('pq');
            if (Q.doiTuong.goi) {
                z('sp').innerHTML = dang();
                ums.api.call(Q.doiTuong.goi(chon.map(function (x) { return x.ID; }))).then(function (r) { SP = arr(r.data); veSP(false); })
                    .catch(function (err) { SP = []; z('sp').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách ' + Q.danhTu); });
            } else { SP = chon; veSP(true); }
            if (!nsDaNap) napNS();
        }
        function luuPQ() {
            var dl = P.chon(z('sp'), 'sp', SP), ns = Object.keys(nsChon), hd = (window.jQuery ? jQuery(f('hd')).val() : null) || [];
            if (!dl.length) { ui.toast('Vui lòng chọn dữ liệu phân quyền?', 'warn'); return; }
            if (!ns.length) { ui.toast('Vui lòng chọn người dùng phân quyền?', 'warn'); return; }
            if (!hd.length) { ui.toast('Vui lòng chọn hành động phân quyền?', 'warn'); return; }
            var calls = [];
            dl.forEach(function (d) { ns.forEach(function (n) { hd.forEach(function (h) { calls.push(Q.them(d.ID, n, h)); }); }); });
            ui.confirm('Phân ' + hd.length + ' quyền cho ' + ns.length + ' cán bộ trên ' + dl.length + ' ' + Q.danhTu + ' — tổng cộng ' + calls.length + ' lượt ghi. Bạn có chắc chắn thực hiện không?',
                { title: 'Phân quyền nhập điểm', ok: 'Phân quyền' }).then(function (yes) {
                if (yes) ui.batch(calls, { title: 'Đang phân quyền', okText: 'Thực hiện thành công', concurrency: 5, show: true });
            });
        }

        /* ---------- Vùng "Danh sách phân quyền" -------------------------- */
        var DQ = [], dqDong = null;
        function taiDQ() {
            if (!dqDong) return Promise.resolve();
            z('dq').innerHTML = dang();
            return ums.api.call(Q.ds(dqDong.ID)).then(function (r) {
                DQ = arr(r.data);
                z('ndq').textContent = '(' + DQ.length + ')';
                ui.table({ el: z('dq'), rows: DQ, empty: 'Chưa phân quyền cho ' + Q.danhTu + ' này', columns: Q.cotDs.concat([P.cotChon('dq')]) });
            }).catch(function (err) { z('dq').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách phân quyền'); });
        }
        function xoaDQ() {
            var chon = P.chon(z('dq'), 'dq', DQ);
            if (!chon.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn xóa ' + chon.length + ' quyền đã chọn không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá phân quyền' }).then(function (yes) {
                if (yes) ui.batch(chon.map(function (x) { return Q.xoa(x.ID); }), { title: 'Đang xoá', okText: 'Xóa thành công', show: true }).then(taiDQ);
            });
        }

        /* ---------- Sự kiện ---------------------------------------------- */
        root.addEventListener('change', function (ev) {
            var t = ev.target, k = t.getAttribute && t.getAttribute('data-all');
            if (k) {
                var bang = t.closest('table');
                if (bang) qa(bang, 'tbody input[data-' + k + ']').forEach(function (c) { c.checked = t.checked; if (k === 'ns') ghiNS(c); });
                if (k === 'ns') demNS();
                return;
            }
            if (t.hasAttribute && t.hasAttribute('data-ns')) { ghiNS(t); demNS(); }
        });
        function ghiNS(c) { var id = c.getAttribute('data-ns'); if (c.checked) nsChon[id] = 1; else delete nsChon[id]; }
        f('qns').addEventListener('input', function () { clearTimeout(henTim); henTim = setTimeout(function () { nsTrang.index = 1; veNS(); }, 300); });
        if (L.f('q')) L.f('q').addEventListener('keydown', function (ev) {
            if (ev.key !== 'Enter') return;
            ev.preventDefault();
            if (cfg.ds.khop && daTai) ve(); else tai(1);
        });
        root.addEventListener('click', function (ev) {
            var b, t = ev.target;
            if ((b = t.closest('[data-mo]')) && cfg.chiTiet) {
                ctx.moDong = hien[Number(b.getAttribute('data-mo'))];
                if (!ctx.moDong) return;
                sang('ct');
                cfg.chiTiet(vung('ct'), ctx.moDong, ctx);
                return;
            }
            if ((b = t.closest('[data-q]'))) {
                dqDong = hien[Number(b.getAttribute('data-q'))];
                if (!dqDong) return;
                sang('dsq');
                taiDQ();
                return;
            }
            if ((b = t.closest('[data-h]')) && cfg.ds.hanh && cfg.ds.hanh[b.getAttribute('data-h')]) {
                var d = hien[Number(b.getAttribute('data-i'))];
                if (d) cfg.ds.hanh[b.getAttribute('data-h')](d, ctx);
                return;
            }
            if (!(b = t.closest('[data-a]')) || b.disabled) return;
            var a = b.getAttribute('data-a');
            if (a === 'search') tai(1);
            else if (a === 'dong') dong();
            else if (a === 'pq') moPQ();
            else if (a === 'luupq') luuPQ();
            else if (a === 'xoaq') xoaDQ();
            else if (a === 'tailaiq') taiDQ();
            else if (a === 'xacnhan') {
                var chon = daChon();
                if (!chon.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
                /* Gốc: nút + lịch sử theo dòng ĐẦU, lưu cho MỌI dòng đánh dấu */
                ums.nd.xacNhanNut({ tieuDe: 'Xác nhận', chuDe: cfg.xacNhan.chuDe, loai: cfg.xacNhan.loai, ids: chon.map(function (x) { return x.ID; }), lichSu: chon[0].ID,
                    onDone: function () { tai(trang.index); } });
            } else {
                var n = (cfg.nutThem || []).filter(function (x) { return x.a === a; })[0];
                if (!n) return;
                var ds = daChon();
                if (!ds.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
                n.chay(ds, ctx);
            }
        });
        return ctx;
    };
})();
