/* =========================================================================
   ums.qldAD — khung chung họ màn "… ÁP DỤNG" của Quản lý điểm
   ---------------------------------------------------------------------------
   Dùng ở (mỗi màn một tệp cấu hình mỏng; màn ở module khác nạp chéo
   <script src="../../thamsochung/script/_apdung.js">):
       thamsochung/thamsochungapdung               D_ThamSoHocTapChung_ApDung
       thamsolamtron/thamsolamtronapdung           D_ThamSoLamTron_ApDung
       thanhphandiem/khaibaothanhphandiemapdung    D_ThanhPhanDiem_ApDung
       diemdacbiet/diemdacbietapdung               D_DiemDacBiet_ApDung
       thamsotinhdiem/thamsotinhdiemapdung         D_ThamSoTongHop_ApDung  (trái = KHOÁ, con = chương trình)
       thamsodanhgiaketqua/thamsodanhgiaketquaapdung  D_ThamSoDanhGiaKetQua_ApDung (3 tab, hộp Kế thừa CTĐT)
       thamsoquydoithangdiem/thamsoquydoithangdiemapdung  D_QuyDoiThangDiem_ApDung (3 tab, hộp Kế thừa CTĐT)
       congthucdiem/congthucdiemapdung             D_CongThucDiem_ApDung   (3 tab, kế thừa học phần đánh dấu)
   Phần THÊM 2026-09-25 (bốn màn sau — bốn màn đầu không dùng, hành vi giữ nguyên):
     Q.con.nguoiHoc() · Q.cap.nguoiHocLop() (tab người học có ô Thời gian → Lớp HP)
     · Q.hopKeThuaCTDT(ctx, o) (hộp "Kế thừa" cho các chương trình cùng học HP)
     · con.chonTatCa / con.nhan · cap.chonCon / cap.init / cap.onTrai
     · con.tai(dòngTrái, ctx) · ctx.locVal(k) · ctx.pvCua(cap).
   ---------------------------------------------------------------------------
   Tám bản gốc chép cùng một khuôn HAI CỘT (col-lg-3 | col-lg-9):
     · trái: Hệ đào tạo · Khóa học · từ khoá · Tìm kiếm + danh sách CHƯƠNG TRÌNH
       phân trang máy chủ (KHCT_ToChucChuongTrinh/LayDanhSach) → pat.master;
     · phải (ẩn tới khi bấm một chương trình): "Chương trình <tên>" + HAI TAB:
         1) bảng nhập áp dụng chung cho chương trình
            (strPhamViApDung_Id = ID chương trình) + Kế thừa · Thêm dòng · Lưu;
         2) trái "Chọn học phần - chương trình" (jstree + ô lọc tại chỗ) |
            phải bảng nhập áp dụng cho học phần đang chọn
            (strPhamViApDung_Id = ID học phần NỐI ID chương trình — chuỗi ghép,
            chép nguyên) + Thêm dòng · Lưu.
     · Bảng nhập: mỗi dòng là một bản ghi, ô chọn / ô chữ / ô ngày sửa tại chỗ,
       "Lưu" gửi <ctl>/ThemMoi cho TỪNG dòng (dòng mới: strId = '', dòng cũ:
       strId = ID — gốc nhận biết dòng mới qua id tạm dài 30 ký tự).
       Cột Xóa: dòng đã lưu có LADULIEUKHOITAO == '0' → hỏi rồi <ctl>/Xoa
       (strIds = ID); còn lại (dòng mới, dòng LADULIEUKHOITAO khác '0') chỉ gỡ
       khỏi màn — ĐÚNG NHƯ GỐC, không gọi máy chủ.
     · Hai hộp #myModal_* trong html gốc không nút nào mở, không có xử lý → bỏ.
       Nút "Kéo xuống" (btnExtend_Search) mở một khung rỗng → bỏ.

   Lỗi gốc chung đã sửa (ghi lại ở đầu từng màn):
     · Lưu xong KHÔNG nạp lại bảng → dòng mới vẫn mang id tạm, bấm Lưu lần hai là
       THÊM TRÙNG. Nay lưu xong nạp lại.
     · Lưu bắn N lời gọi song song, mỗi lời gọi một thông báo → nay ums.ui.batch
       (tuần tự, một thanh tiến độ, một thông báo tổng).
     · Tiêu đề khung trái gốc ghi "Chọn thời gian đào tạo" (chép nhầm) trong khi
       danh sách là chương trình → "Chọn chương trình".
   Khác gốc theo luật chung: Hệ → Khóa nối tầng (khoá Khóa khi chưa chọn Hệ);
   "Kế thừa" luôn hỏi lại (gốc chỉ hỏi ở vài màn).

   ---------------------------------------------------------------------------
   CÁCH KHAI MỘT MÀN — ums.qldAD.man(root, cfg)
   ---------------------------------------------------------------------------
     tieuDe      tiêu đề trang
     api         controller, vd 'D_ThamSoLamTron_ApDung' → /LayDanhSach /ThemMoi
                 /CapNhat /Xoa /KeThua
     trai        cột trái — Q.trai.chuongTrinh({ sub }) (mặc định) | Q.trai.khoa()
                 | tự khai { tieuDe, icon, loc: ['he','khoa'], phanTrang, tai(f, page)
                 → tham số ums.api.call, item(r) → { text, sub }, ten(r) }
     dauDe       chữ đầu khung phải, mặc định 'Chương trình' (thamsotinhdiem: 'Khóa')
     cot         cột bảng nhập (mọi tab), mỗi cột:
                   { key: 'strX_Id' (tên tham số GỬI), col: 'X_ID' (cột ĐỌC), title,
                     group: ['Thời gian bắt đầu áp dụng'] (tiêu đề hai tầng),
                     type: 'select' | 'text' | 'date' | 'static' (chỉ hiện),
                     source: { call: {action,…}, id, name } | { dm: 'MA.BANG' }
                             | { items: [...] } | { load: fn → Promise<dòng> },
                     trong: false (ô chọn không có dòng "-- Chọn --"),
                     s2: true (danh sách dài → select2 có ô tìm), width, ph }
                 Có sẵn: Q.cot.thoiGian(), Q.cot.ngay(), Q.cot.coKhong(key, col, title)
     loc         tham số RIÊNG của <api>/LayDanhSach (chép nguyên, thường là '' );
                 khung tự thêm strTuKhoa '', strPhamViApDung_Id, strNguoiThucHien_Id,
                 pageIndex 1, pageSize 10000000
     luu         tham số CỐ ĐỊNH của ThemMoi (vd strPhanCapApDung_Id: '', strMa: '');
                 khung tự thêm strId, strPhamViApDung_Id, strNguoiThucHien_Id và
                 mọi `key` của cột (trừ static)
     keThua      false | { text, hoi, thamSo(ctx) → tham số <api>/KeThua } — nút ở tab
                 có `keThua: true`; mặc định gửi strDaoTao_ChuongTrinh_Id = ID trái
     caps        các tab (tầng áp dụng), mỗi tab:
                   { key, tab: '1) …' (chữ tab gốc), tieuDe (đầu khung bảng),
                     con: Q.con.hocPhan() | Q.con.chuongTrinh() | Q.con.nguoiHoc() | { tieuDe, icon, id, ten(r),
                          tai(dòngTrái, ctx) → call, chuaChon, rong: '260px', chon: true (ô đánh
                          dấu từng mục — đọc bằng ctx.conChon(capKey); dấu GIỮ qua lọc / bấm mục),
                          chonTatCa: true (ô "chọn tất cả" ở đầu danh sách con — cần chon),
                          nhan(r) (chữ đầu khung bảng khi chọn, mặc định ten(r)) } — có thì tab này hai
                          cột: danh sách con trái | bảng phải (đầu khung bảng = tên mục con),
                     chonCon(r, ctx, luoi)  bấm một mục con: màn TỰ nạp bảng (khung không gọi
                          luoi.nap) — dùng khi phạm vi còn phụ thuộc ô chọn ở đầu khung bảng,
                     init(ctx, luoi)  chạy một lần sau khi dựng bảng (gắn sự kiện ô ở đầu khung),
                     onTrai(dòngTrái, ctx, luoi)  sau khi chọn một mục cột trái,
                     pv(ctx) → strPhamViApDung_Id (mặc định ID trái, hoặc
                          id con + ID trái khi có con — đúng chuỗi ghép gốc),
                     batBuoc: 'strX_Id'  (gốc bỏ qua dòng trống khoá này — chỉ tab HP),
                     capNhat: true       (dòng cũ gửi /CapNhat thay /ThemMoi),
                     keThua: true,  cot: [...] (thay cfg.cot cho riêng tab),
                     tieuDe: chữ đầu khung bảng (tab thường mặc định KHÔNG tiêu đề, chỉ nút),
                     tools(ctx) → HTML nút thêm (đặt trước "Thêm dòng"; nút mang
                          data-qad-tool="tên"), onTool(tên, ctx, luoi) }
     thamSo(kind, obj, cap, ctx)  móc cuối: sửa tham số trước khi gửi
                 (kind: 'loc' | 'luu' | 'xoa' | 'keThua')
     onChonTrai(row, ctx) · onChonCon(cap, row, ctx)   móc sau khi chọn

   ctx (trả về và truyền vào móc): { root, cfg, trai (dòng trái đang chọn),
     con: { <capKey>: dòng con đang chọn }, luoi: { <capKey>: Q.luoi }, conChon(capKey)
     → các dòng con đang đánh dấu (khi con.chon) , napTrai(page),
     locVal('he'|'khoa'|'q') → giá trị ô lọc cột trái, pvCua(cap) → phạm vi áp dụng }

   Q.luoi(host, o) — bảng nhập dùng lại được riêng (tab tự dựng, hộp thoại…):
     o = { tieuDe (false = đầu khung chỉ có nút), icon, cot, tools, loc(pv) → call, luu(v, rec, pv) → call,
           xoa(rec) → call, xoaDuoc(rec) (mặc định LADULIEUKHOITAO == '0'),
           batBuoc, onTool(tên, luoi), nhac }
     → { nap(pv) → Promise, luu() → Promise, them(rec?), nhac(chữ), tieuDe(chữ), rows(),
         giaTri() → [{ rec, v }], pv(), el }
   ========================================================================= */
(function () {
    'use strict';

    var ums = window.ums, ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var Q = ums.qldAD = {};

    function e(v) { return v === undefined || v === null ? '' : String(v); }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function jq(el) { return window.jQuery ? window.jQuery(el) : null; }
    function get(action, o) {
        return ums.api.call(Object.assign({ action: action, method: 'GET', silent: true }, o))
            .then(function (r) { return { rows: arr(r.data), pager: r.pager }; });
    }
    var uid = 0;
    function k() { return 'q' + (++uid); }

    /* ---------- Nguồn dùng chung (lời gọi chép nguyên bản gốc) ------------- */
    Q.nguon = {
        he: function () {
            return get('KHCT_HeDaoTao/LayDanhSach', {
                strTuKhoa: '', strDaoTao_HinhThucDaoTao_Id: '', strDaoTao_BacDaoTao_Id: '',
                strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000
            }).then(function (x) { return x.rows; });
        },
        khoa: function (he, o) {
            return get('KHCT_KhoaDaoTao/LayDanhSach', Object.assign({
                strTuKhoa: '', strDaoTao_HeDaoTao_Id: he || '', strDaoTao_CoSoDaoTao_Id: '',
                strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000
            }, o || {}));
        },
        thoiGian: function () {
            return get('KHCT_ThoiGianDaoTao/LayDanhSach', {
                strTuKhoa: '', strDAOTAO_NAM_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000
            }).then(function (x) { return x.rows; });
        }
    };

    /* ---------- Cột dựng sẵn ------------------------------------------------- */
    Q.cot = {
        /* Học kỳ áp dụng — genCombo_ThoiGianDaoTao (DAOTAO_THOIGIANDAOTAO) */
        thoiGian: function (o) {
            return Object.assign({ key: 'strDaoTao_ThoiGianDaoTao_Id', col: 'DAOTAO_THOIGIANDAOTAO_ID', title: 'Học kỳ',
                group: ['Thời gian bắt đầu áp dụng'], type: 'select', s2: true, ph: 'Chọn học kỳ',
                source: { load: 'thoiGian', name: 'DAOTAO_THOIGIANDAOTAO' }, width: '180px' }, o || {});
        },
        ngay: function (o) {
            return Object.assign({ key: 'strNgayApDung', col: 'NGAYAPDUNG', title: 'Ngày',
                group: ['Thời gian bắt đầu áp dụng'], type: 'date', width: '140px' }, o || {});
        },
        /* Ô "Có / Không" gốc: <option value="0"> Không <option value="1"> Có, không có dòng trống */
        coKhong: function (key, col, title, o) {
            return Object.assign({ key: key, col: col, title: title, type: 'select', trong: false,
                source: { items: [{ ID: '0', TEN: 'Không' }, { ID: '1', TEN: 'Có' }] }, width: '110px' }, o || {});
        }
    };

    /* =====================================================================
       BẢNG NHẬP — Q.luoi
       ===================================================================== */
    Q.luoi = function (host, o) {
        var cot = o.cot || [];
        var rows = [];          // [{ k, rec, v }]
        var src = {};           // key cột → danh sách mục
        var curPv = '';
        var dangNhac = true;

        host.innerHTML = pat.panel({
            title: o.tieuDe === false ? false : (o.tieuDe || ''), icon: o.icon || 'fa-table-list', flush: true, zone: 'qadBang', cls: 'qad-luoi',
            tools: (o.tools || '') +
                ui.btn('add', { text: 'Thêm dòng', mod: 'out-success', attr: { 'data-qad': 'them' } }) +
                ui.btn('save', { attr: { 'data-qad': 'luu' } })
        });
        var bang = host.querySelector('[data-z="qadBang"]');
        var tools = host.querySelector('.ums-panel__tools');

        /* Nguồn ô chọn — nạp một lần; `load` là hàm hoặc tên trong Q.nguon */
        var ready = Promise.all(cot.map(function (c) {
            if (c.type !== 'select' || !c.source) return null;
            var s = c.source;
            var p = typeof s.load === 'function' ? s.load()
                : typeof s.load === 'string' ? Q.nguon[s.load]()
                : s.items ? Promise.resolve(s.items)
                : s.dm ? ums.api.dm(s.dm)
                : ums.api.call(Object.assign({ method: 'GET', silent: true }, s.call)).then(function (r) { return arr(r.data); });
            return Promise.resolve(p).then(function (list) { src[c.key] = arr(list); },
                function (err) { src[c.key] = []; ums.api.handle(err, 'nạp ' + (c.title || c.key)); });
        }));

        function giaTriCot(c, r) {
            if (r.v && Object.prototype.hasOwnProperty.call(r.v, c.key)) return r.v[c.key];
            if (!r.rec) return '';
            return e(typeof c.get === 'function' ? c.get(r.rec) : r.rec[c.col || '']);
        }
        function o_(c, r) {
            var v = giaTriCot(c, r);
            // Bề rộng tối thiểu theo cấu hình cột — bảng nhiều cột thì cuộn ngang, ô không bị bóp còn một chữ
            var w = c.width || (c.type === 'date' ? '140px' : c.type === 'select' ? '160px' : '90px');
            var at = ' data-rk="' + esc(c.key) + '" data-k="' + r.k + '"' + ' style="min-width:' + esc(w) + '"';
            if (c.type === 'static') return esc(r.rec ? e(typeof c.get === 'function' ? c.get(r.rec) : r.rec[c.col || '']) : '');
            if (c.type === 'select') {
                var id = (c.source && c.source.id) || 'ID', nm = (c.source && c.source.name) || 'TEN';
                var ph = c.ph || '-- Chọn --';
                return '<select class="ums-select ums-input--sm"' + at +
                    (c.s2 ? ' data-s2 data-ph="' + esc(ph) + '"' : '') + '>' +
                    (c.trong === false ? '' : '<option value="">' + esc(ph) + '</option>') +
                    (src[c.key] || []).map(function (x) {
                        return '<option value="' + esc(x[id]) + '"' + (e(x[id]) === e(v) ? ' selected' : '') + '>' +
                            esc(typeof nm === 'function' ? nm(x) : x[nm]) + '</option>';
                    }).join('') + '</select>';
            }
            if (c.type === 'date') {
                return '<div class="ums-inputwrap" style="min-width:' + esc(w) + '"><input class="ums-input ums-input--sm"' + at +
                    ' data-date placeholder="dd/mm/yyyy" autocomplete="off" value="' + esc(v) + '">' +
                    '<i class="fa-light fa-calendar"></i></div>';
            }
            return '<input class="ums-input ums-input--sm"' + at + ' autocomplete="off" value="' + esc(v) + '">';
        }

        /* Đọc giá trị đang nhập trên màn vào r.v trước khi vẽ lại */
        function dong() {
            rows.forEach(function (r) {
                var v = r.v || (r.v = {});
                Array.prototype.forEach.call(bang.querySelectorAll('[data-k="' + r.k + '"][data-rk]'), function (el) {
                    v[el.getAttribute('data-rk')] = (el.value || '').trim();
                });
            });
        }
        function xoaDuoc(rec) {
            if (!rec) return false;
            return o.xoaDuoc ? o.xoaDuoc(rec) : e(rec.LADULIEUKHOITAO) === '0';
        }
        function ve() {
            dangNhac = false;
            ui.table({
                el: bang, rows: rows, empty: 'Chưa có dữ liệu — bấm "Thêm dòng" để nhập',
                tableCls: 'ums-table--lined ums-table--tight qad-bang',
                columns: cot.map(function (c) {
                    return { title: c.title, group: c.group, cls: c.cls || '',
                        render: function (r) { return o_(c, r); } };
                }).concat([{ title: 'Xóa', cls: 'is-center is-actions', width: '64px', render: function (r) {
                    var sv = xoaDuoc(r.rec);
                    return '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-qad-xoa="' + r.k + '" title="' +
                        (sv ? 'Xóa' : 'Xóa dòng (chỉ gỡ khỏi màn, không xoá trên máy chủ)') + '"><i class="fa-light fa-trash-can"></i></button>';
                } }])
            });
            ui.enhance(bang);
        }
        function nhac(msg, icon) {
            dangNhac = true;
            rows = [];
            bang.innerHTML = ui.empty(msg, icon || 'fa-hand-pointer');
        }
        function khoaNut(on) {
            Array.prototype.forEach.call(tools.querySelectorAll('button'), function (b) { b.disabled = !!on; });
        }

        function nap(pv) {
            curPv = pv === undefined ? curPv : e(pv);
            if (!curPv) { nhac(o.nhac || 'Chưa chọn phạm vi áp dụng'); khoaNut(true); return Promise.resolve(); }
            khoaNut(false);
            bang.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            var pvNap = curPv;
            return ready.then(function () {
                return ums.api.call(Object.assign({ method: 'GET', silent: true }, o.loc(pvNap)));
            }).then(function (r) {
                if (pvNap !== curPv) return;
                rows = arr(r.data).map(function (rec) { return { k: k(), rec: rec, v: null }; });
                ve();
            }).catch(function (err) {
                if (pvNap !== curPv) return;
                rows = []; bang.innerHTML = ui.fail(err.message);
                ums.api.handle(err, 'tải ' + (o.tieuDe || 'dữ liệu áp dụng'));
            });
        }
        function them(rec) {
            if (!curPv) return;
            if (!dangNhac) dong();
            rows.push({ k: k(), rec: null, v: rec ? Object.assign({}, rec) : null });
            ve();
        }
        function giaTri() {
            dong();
            return rows.map(function (r) { return { rec: r.rec, v: Object.assign({}, r.v) }; });
        }
        function luu() {
            if (!curPv || dangNhac) return Promise.resolve();
            var calls = giaTri().filter(function (x) { return !o.batBuoc || x.v[o.batBuoc]; })
                .map(function (x) { return o.luu(x.v, x.rec, curPv); }).filter(Boolean);
            if (!calls.length) { ui.toast('Không có dòng nào để lưu', 'warn'); return Promise.resolve(); }
            return ui.batch(calls, { title: 'Đang lưu', okText: 'Cập nhật thành công' }).then(function () { return nap(); });
        }

        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-qad], [data-qad-xoa], [data-qad-tool]');
            if (!b || !host.contains(b) || b.disabled) return;
            if (b.hasAttribute('data-qad-tool')) { if (o.onTool) o.onTool(b.getAttribute('data-qad-tool'), api); return; }
            var a = b.getAttribute('data-qad');
            if (a === 'them') { them(); return; }
            if (a === 'luu') { luu(); return; }
            var kk = b.getAttribute('data-qad-xoa');
            var r = rows.filter(function (x) { return x.k === kk; })[0];
            if (!r) return;
            if (!xoaDuoc(r.rec)) { dong(); rows.splice(rows.indexOf(r), 1); ve(); return; }
            ui.confirm('Bạn có chắc chắn muốn xóa dữ liệu?', { tone: 'bad', ok: 'Xoá', title: 'Xoá dòng áp dụng' }).then(function (yes) {
                if (!yes) return;
                return ums.api.call(o.xoa(r.rec)).then(function () { ui.toast('Xóa thành công!', 'ok'); return nap(); });
            }).catch(function (err) { ums.api.handle(err, 'xoá dòng áp dụng'); });
        });

        nhac(o.nhac || 'Chưa chọn phạm vi áp dụng');
        khoaNut(true);
        /* Đổi chữ đầu khung (tab có danh sách con: tên mục con đang chọn) */
        function tieuDe(t) {
            var el = host.querySelector('.ums-panel__title');
            if (el) el.innerHTML = '<i class="fa-light ' + esc(o.icon || 'fa-table-list') + '"></i> ' + esc(t);
        }
        var api = { el: host, nap: nap, tieuDe: tieuDe, luu: luu, them: them, nhac: nhac, giaTri: giaTri,
            rows: function () { return rows; }, pv: function () { return curPv; }, ready: ready };
        return api;
    };

    /* =====================================================================
       CỘT TRÁI — danh sách dựng sẵn
       ===================================================================== */
    Q.trai = {
        /* Danh sách chương trình (getList_ChuongTrinh + genTable_ChuongTrinh của gốc):
           phân trang máy chủ pageIndex/pageSize mặc định (10), số tổng = Pager */
        chuongTrinh: function (o) {
            o = o || {};
            return {
                tieuDe: o.tieuDe || 'Chọn chương trình', icon: 'fa-book', loc: ['he', 'khoa'], phanTrang: true,
                tai: function (f, page) {
                    return {
                        action: 'KHCT_ToChucChuongTrinh/LayDanhSach', method: 'GET',
                        strTuKhoa: f.q, strDaoTao_KhoaDaoTao_Id: f.khoa, strDaoTao_HeDaoTao_Id: f.he,
                        strDaoTao_N_CN_Id: '', strDaoTao_KhoaQuanLy_Id: '', strDaoTao_ToChucCT_Cha_Id: '',
                        strNguoiThucHien_Id: '', pageIndex: page.index, pageSize: page.size
                    };
                },
                item: function (r) {
                    return { text: 'Chương trình: ' + e(r.TENCHUONGTRINH), sub: (o.sub || 'Khóa') + ': ' + e(r.DAOTAO_KHOADAOTAO_TEN) };
                },
                ten: function (r) { return e(r.TENCHUONGTRINH); }
            };
        },
        /* Danh sách khoá (thamsotinhdiemapdung: getList_KhoaDaoTao, KHÔNG phân trang,
           pageSize 1000000; lọc Hệ + từ khoá) */
        khoa: function (o) {
            o = o || {};
            return {
                tieuDe: o.tieuDe || 'Chọn khóa đào tạo', icon: 'fa-graduation-cap', loc: ['he'], phanTrang: false,
                tai: function (f) {
                    return {
                        action: 'KHCT_KhoaDaoTao/LayDanhSach', method: 'GET',
                        strTuKhoa: f.q, strDaoTao_HeDaoTao_Id: f.he, strDaoTao_CoSoDaoTao_Id: '',
                        strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000
                    };
                },
                item: function (r) { return { text: 'Khóa đào tạo: ' + e(r.TENKHOA), sub: 'Hệ đào tạo: ' + e(r.DAOTAO_HEDAOTAO_TEN) }; },
                ten: function (r) { return e(r.TENKHOA); }
            };
        }
    };

    /* Danh sách CON của tab hai cột (jstree gốc + ô lọc tại chỗ) */
    Q.con = {
        hocPhan: function (o) {
            return Object.assign({
                tieuDe: 'Chọn học phần - chương trình', icon: 'fa-chalkboard-user', id: 'DAOTAO_HOCPHAN_ID', chuaChon: 'Chưa chọn học phần',
                ten: function (r) { return e(r.DAOTAO_HOCPHAN_TEN); },
                tai: function (trai) {
                    return {
                        action: 'KHCT_HocPhan_ChuongTrinh/LayDanhSach', method: 'GET',
                        strTuKhoa: '', strDaoTao_ThoiGian_KH_Id: '', strDaoTao_ThoiGian_TT_Id: '',
                        strThuocTinhHocPhan_Id: '', strPhanCongPhamViDamNhiem_Id: '', strDaoTao_HocPhan_Id: '',
                        strDaoTao_ChuongTrinh_Id: trai.ID, strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000
                    };
                }
            }, o || {});
        },
        chuongTrinh: function (o) {
            return Object.assign({
                tieuDe: 'Chọn chương trình - khóa', icon: 'fa-book', id: 'ID', chuaChon: 'Chưa chọn chương trình',
                ten: function (r) { return e(r.TENCHUONGTRINH); },
                tai: function (trai) {
                    return {
                        action: 'KHCT_ToChucChuongTrinh/LayDanhSach', method: 'GET',
                        strTuKhoa: '', strDaoTao_KhoaDaoTao_Id: trai.ID, strDaoTao_HeDaoTao_Id: '',
                        strDaoTao_N_CN_Id: '', strDaoTao_KhoaQuanLy_Id: '', strDaoTao_ToChucCT_Cha_Id: '',
                        strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000
                    };
                }
            }, o || {});
        },
        /* Người học của chương trình (getList_NguoiHoc_ChuongTrinh gốc — thamsodanhgiaketqua,
           thamsoquydoithangdiem, congthucdiem chép y hệt). Gốc đọc txtSearchDSSV_TuKhoa,
           dropSearch_KhoaDaoTao, dropSearch_LopQuanLy — ô không tồn tại → ''. strHeDaoTao_Id là
           ô Hệ đào tạo ĐANG CHỌN ở cột trái (ô có thật) — chép nguyên. */
        nguoiHoc: function (o) {
            return Object.assign({
                tieuDe: 'Chọn người học - chương trình', icon: 'fa-user-graduate', id: 'QLSV_NGUOIHOC_ID', chuaChon: 'Chưa chọn người học',
                ten: function (r) { return e(r.QLSV_NGUOIHOC_MASO) + ' - ' + e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN); },
                tai: function (trai, ctx) {
                    return {
                        action: 'SV_HoSoNhieuNganh/LayDanhSach', method: 'GET', versionAPI: 'v1.0',
                        strTuKhoa: '', strHeDaoTao_Id: ctx && ctx.locVal ? ctx.locVal('he') : '', strKhoaDaoTao_Id: '',
                        strChuongTrinh_Id: trai.ID, strLopQuanLy_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000
                    };
                }
            }, o || {});
        }
    };

    /* =====================================================================
       TẦNG DỰNG SẴN — Q.cap
       ===================================================================== */
    Q.cap = {
        /* Tab "… đến từng người học" của thamsoquydoithangdiem + congthucdiem (hai bản gốc chép
           cùng một khối): danh sách người học trái; đầu khung bảng có hai ô
             Thời gian (SV_ThongTin/LayDSThoiGianLichHoc, THOIGIAN, chọn sẵn mục đầu)
             → Lớp học phần (SV_ThongTin/LayKetQuaDangKyHocCaNhan → rsKetQuaDangKy,
               DANGKY_LOPHOCPHAN_ID / DANGKY_LOPHOCPHAN_TEN, chọn sẵn mục đầu);
           phạm vi áp dụng = ID người học NỐI ID lớp học phần (KHÔNG có ID chương trình — chép nguyên).
           Khác gốc (luật cha → con): chưa có lớp học phần thì khung bảng về lời nhắc; gốc vẫn nạp
           và LƯU với phạm vi = chỉ ID người học.
           o = { key: 'nh', tab, ten(r) (chữ mục người học), ...ghi đè } */
        nguoiHocLop: function (o) {
            o = o || {};
            var key = o.key || 'nh';
            function q(luoi, k) { return luoi.el.querySelector('[data-qad-f="' + k + '"]'); }
            function oChon(k, ph) {
                return '<div class="ums-field qad-loc"><select class="ums-select" data-qad-f="' + k + '" data-ph="' + esc(ph) + '">' +
                    '<option value="">' + esc(ph) + '</option></select></div>';
            }
            function chonDau(el, rows, id) {
                if (rows.length) el.value = e(rows[0][id]);
                if (window.jQuery) window.jQuery(el).trigger('change.select2').trigger('ums:refresh');
            }
            var cap = Object.assign({
                key: key,
                con: Q.con.nguoiHoc(o.ten ? { ten: o.ten } : null),
                tools: function () { return oChon('tg', 'Chọn thời gian') + oChon('lop', 'Chọn lớp học phần'); },
                pv: function (ctx) {
                    var r = ctx.con[key], luoi = ctx.luoi[key];
                    var lop = luoi ? q(luoi, 'lop').value : '';
                    return r && lop ? e(r.QLSV_NGUOIHOC_ID) + lop : '';
                },
                /* Bấm một người học: xoá bảng (gốc: tbody.html("")) → nạp Thời gian → Lớp → bảng */
                chonCon: function (r, ctx, luoi) {
                    luoi.nap('');
                    var tg = q(luoi, 'tg'), lop = q(luoi, 'lop');
                    pat.fill(tg, [], { head: 'Chọn thời gian' });
                    pat.fill(lop, [], { head: 'Chọn lớp học phần' });
                    ums.api.call({ action: 'SV_ThongTin/LayDSThoiGianLichHoc', method: 'GET', silent: true,
                        strNguoiThucHien_Id: '', strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID }).then(function (x) {
                        if (ctx.con[key] !== r) return;
                        var ds = arr(x.data);
                        pat.fill(tg, ds, { name: 'THOIGIAN', head: 'Chọn thời gian' });
                        chonDau(tg, ds, 'ID');
                        return napLop(ctx, luoi);
                    }).catch(function (err) { ums.api.handle(err, 'nạp thời gian đăng ký'); });
                },
                init: function (ctx, luoi) {
                    var tg = q(luoi, 'tg'), lop = q(luoi, 'lop');
                    var $ = window.jQuery;
                    if ($) {
                        $(tg).on('select2:select', function () { napLop(ctx, luoi); });
                        $(lop).on('select2:select select2:clear', function () { luoi.nap(cap.pv(ctx)); });
                    }
                    pat.chain([tg, lop]);
                },
                onTrai: function (r, ctx, luoi) {
                    pat.fill(q(luoi, 'tg'), [], { head: 'Chọn thời gian' });
                    pat.fill(q(luoi, 'lop'), [], { head: 'Chọn lớp học phần' });
                }
            }, o);
            delete cap.ten;
            function napLop(ctx, luoi) {
                var r = ctx.con[key], tg = q(luoi, 'tg'), lop = q(luoi, 'lop');
                pat.fill(lop, [], { head: 'Chọn lớp học phần' });
                if (!r || !tg.value) { luoi.nap(''); return Promise.resolve(); }
                var tgNap = tg.value;
                return ums.api.call({ action: 'SV_ThongTin/LayKetQuaDangKyHocCaNhan', method: 'GET', silent: true,
                    strNguoiThucHien_Id: '', strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID, strDaoTao_ThoiGianDaoTao_Id: tgNap }).then(function (x) {
                    if (ctx.con[key] !== r || tg.value !== tgNap) return;
                    var ds = arr(x.data && x.data.rsKetQuaDangKy);
                    pat.fill(lop, ds, { id: 'DANGKY_LOPHOCPHAN_ID', name: 'DANGKY_LOPHOCPHAN_TEN', head: 'Chọn lớp học phần' });
                    chonDau(lop, ds, 'DANGKY_LOPHOCPHAN_ID');
                    luoi.nap(cap.pv(ctx));
                    if (!ds.length) luoi.nhac('Người học chưa có lớp học phần trong thời gian đã chọn');
                }).catch(function (err) { ums.api.handle(err, 'nạp lớp học phần'); });
            }
            return cap;
        }
    };

    /* =====================================================================
       HỘP "KẾ THỪA" CHO CÁC CHƯƠNG TRÌNH CÙNG HỌC HỌC PHẦN — Q.hopKeThuaCTDT
       ---------------------------------------------------------------------
       #myModalKeThua của thamsodanhgiaketqua + thamsoquydoithangdiem (chép cùng một khối,
       chỉ khác procedure ghi). Nguồn chép nguyên:
         Hệ / Khóa     edu.extend.genBoLoc_HeKhoa("_KT") → ums.ref.cascadeQuyen (bản THEO QUYỀN)
         Danh sách     D_ThongTin2_MH/DSA4BRIKJBUpNCACNC8mAhUFFQPP PKG_DIEM_THONGTIN2.LayDSKeThuaCungCTDT
                       (strPhamViApDung_Id = ID học phần NỐI ID chương trình, strDaoTao_HeDaoTao_Id,
                        strDaoTao_KhoaDaoTao_Id) — cột DAOTAO_KHOADAOTAO_TEN, CHUONGTRINH,
                        DAOTAO_HOCPHAN_TEN - DAOTAO_HOCPHAN_MA
         Năm           KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eDyAsCS4i pkg_kehoach_thongtin.LayDSDaoTao_NamHoc (NAMHOC)
         Thời gian     KHCT_ThoiGianDaoTao/LayDanhSach strDAOTAO_NAM_Id — đổ vào ô Thời gian chung
                       VÀ ô "Thời gian áp dụng" của từng dòng; "Điền tự động" đặt ô chung cho dòng còn trống
         Kế thừa       o.action / o.func cho TỪNG dòng đánh dấu: strParamViApDungKeThua_Id (phạm vi nguồn),
                       strDaoTao_ChuongTrinh_Id = DAOTAO_TOCHUCCHUONGTRINH_ID, strDaoTao_HocPhan_Id,
                       strDaoTao_ThoiGianDaoTao_Id = ô của dòng
       Khác gốc: Năm → Thời gian nối tầng (khoá Thời gian khi chưa chọn Năm); chạy tuần tự một thanh
       tiến độ (ums.ui.batch) thay N lời gọi song song; chưa đánh dấu dòng nào thì hộp KHÔNG đóng.
       o = { action, func, capKey: 'hp' }
       ===================================================================== */
    Q.hopKeThuaCTDT = function (ctx, o) {
        o = o || {};
        var hp = ctx.con[o.capKey || 'hp'];
        if (!ctx.trai || !hp) return;
        var pvNguon = e(hp.DAOTAO_HOCPHAN_ID) + e(ctx.trai.ID);
        var ds = [], dsTG = [];
        function sel(k, ph) {
            return '<div class="ums-field"><select class="ums-select" data-kt="' + k + '" data-ph="' + esc(ph) + '">' +
                '<option value="">' + esc(ph) + '</option></select></div>';
        }
        var dlg = ui.dialog({
            title: 'Kế thừa', icon: 'fa-object-ungroup', size: 'xl',
            body: '<div class="ums-filter">' + sel('he', 'Chọn hệ đào tạo') + sel('khoa', 'Chọn khóa đào tạo') +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-kt-a': 'tim' } }) + '</div></div>' +
                '<div class="ums-filter ums-u-mt-3">' + sel('nam', 'Chọn năm kế thừa') + sel('tg', 'Chọn thời gian') +
                '<div class="ums-field ums-field--fit">' + ui.btn('confirm', { text: 'Điền tự động', icon: 'fa-wand-magic-sparkles', mod: 'ghost', attr: { 'data-kt-a': 'dien' } }) + '</div></div>' +
                '<div class="ums-u-mt-3" data-kt="bang"></div>',
            buttons: [{ text: 'Kế thừa', kind: 'add', icon: 'fa-object-ungroup', onClick: function () { return luu(); } }]
        });
        var B = dlg.body;
        function q(k) { return B.querySelector('[data-kt="' + k + '"]'); }
        var bang = q('bang');

        function tgHtml(v) {
            return '<option value="">Chọn thời gian</option>' + dsTG.map(function (t) {
                return '<option value="' + esc(t.ID) + '"' + (e(t.ID) === e(v) ? ' selected' : '') + '>' + esc(t.DAOTAO_THOIGIANDAOTAO) + '</option>';
            }).join('');
        }
        function ve() {
            ui.table({
                el: bang, rows: ds, empty: 'Không có chương trình nào cùng học học phần này',
                tableCls: 'ums-table--lined ums-table--tight',
                columns: [
                    { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                    { title: 'Chương trình', prop: 'CHUONGTRINH' },
                    { title: 'Học phần', render: function (r) { return esc(e(r.DAOTAO_HOCPHAN_TEN) + ' - ' + e(r.DAOTAO_HOCPHAN_MA)); } },
                    { title: 'Thời gian áp dụng', width: '220px', render: function (r) {
                        return '<select class="ums-select ums-input--sm" data-kt-tg="' + esc(r.ID) + '">' + tgHtml('') + '</select>';
                    } },
                    { head: '<input type="checkbox" data-kt-all title="Chọn tất cả">', cls: 'is-center', width: '48px', render: function (r) {
                        return '<input type="checkbox" data-kt-ck="' + esc(r.ID) + '">';
                    } }
                ]
            });
        }
        function napDs() {
            bang.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return ums.api.call({
                action: 'D_ThongTin2_MH/DSA4BRIKJBUpNCACNC8mAhUFFQPP', func: 'PKG_DIEM_THONGTIN2.LayDSKeThuaCungCTDT',
                silent: true, strPhamViApDung_Id: pvNguon, strDaoTao_HeDaoTao_Id: q('he').value,
                strDaoTao_KhoaDaoTao_Id: q('khoa').value, strNguoiThucHien_Id: ''
            }).then(function (r) { ds = arr(r.data); ve(); })
                .catch(function (err) { ds = []; bang.innerHTML = ui.fail(err.message); ums.api.handle(err, 'tải danh sách kế thừa'); });
        }
        function napTG() {
            var nam = q('nam').value;
            var p = nam ? get('KHCT_ThoiGianDaoTao/LayDanhSach', {
                strTuKhoa: '', strDAOTAO_NAM_Id: nam, strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000
            }).then(function (x) { return x.rows; }) : Promise.resolve([]);
            return p.then(function (rows) {
                dsTG = rows;
                pat.fill(q('tg'), rows, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn thời gian' });
                Array.prototype.forEach.call(bang.querySelectorAll('select[data-kt-tg]'), function (s) { s.innerHTML = tgHtml(s.value); });
            }).catch(function (err) { ums.api.handle(err, 'nạp thời gian'); });
        }
        function luu() {
            var chon = Array.prototype.map.call(bang.querySelectorAll('input[data-kt-ck]:checked'), function (x) { return x.getAttribute('data-kt-ck'); });
            if (!chon.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return false; }
            var calls = chon.map(function (id) {
                var r = ds.filter(function (x) { return e(x.ID) === id; })[0];
                var s = bang.querySelector('select[data-kt-tg="' + id + '"]');
                return {
                    action: o.action, func: o.func, strParamViApDungKeThua_Id: pvNguon,
                    strDaoTao_ChuongTrinh_Id: r.DAOTAO_TOCHUCCHUONGTRINH_ID, strDaoTao_HocPhan_Id: r.DAOTAO_HOCPHAN_ID,
                    strDaoTao_ThoiGianDaoTao_Id: s ? s.value : '', strNguoiThucHien_Id: ''
                };
            });
            ui.batch(calls, { title: 'Đang kế thừa', okText: 'Thực hiện thành công' });
        }

        B.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-kt-a]');
            if (!b) return;
            if (b.getAttribute('data-kt-a') === 'tim') { napDs(); return; }
            var v = q('tg').value;
            Array.prototype.forEach.call(bang.querySelectorAll('select[data-kt-tg]'), function (s) { if (!s.value) s.value = v; });
        });
        B.addEventListener('change', function (ev) {
            var t = ev.target;
            if (t.matches && t.matches('input[data-kt-all]')) {
                Array.prototype.forEach.call(bang.querySelectorAll('input[data-kt-ck]'), function (x) { x.checked = t.checked; });
            }
        });
        ums.ref.cascadeQuyen({ he: q('he'), khoa: q('khoa') });
        ums.api.call({ action: 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eDyAsCS4i', func: 'pkg_kehoach_thongtin.LayDSDaoTao_NamHoc',
            silent: true, strTuKhoa: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000 })
            .then(function (r) { pat.fill(q('nam'), arr(r.data), { name: 'NAMHOC', head: 'Chọn năm kế thừa' }); })
            .catch(function (err) { ums.api.handle(err, 'nạp năm học'); });
        if (window.jQuery) window.jQuery(q('nam')).on('select2:select', napTG);
        pat.chain([q('nam'), q('tg')]);
        napDs();
        return dlg;
    };

    /* =====================================================================
       MÀN — Q.man
       ===================================================================== */
    Q.man = function (root, cfg) {
        var trai = cfg.trai || Q.trai.chuongTrinh();
        var caps = cfg.caps || [];
        var ctx = { root: root, cfg: cfg, trai: null, con: {}, luoi: {} };
        var page = { index: 1, size: 10, total: 0 };
        var dsTrai = [];

        function sel(key, ph) {
            return '<div class="ums-field"><select class="ums-select" data-qf="' + key + '" data-ph="' + esc(ph) + '">' +
                '<option value="">' + esc(ph) + '</option></select></div>';
        }
        var locKeys = trai.loc || [];
        /* Luật cột trái (BO-CUC 12): ô tìm chuẩn trên cùng (gõ là tự tìm), Hệ / Khóa vào Bộ lọc nâng cao (pat.cotTrai) */
        var locHtml = '<div class="ums-master__search"><div class="ums-searchbar ums-searchbar--sm">' +
            '<span class="ums-searchbar__icon"><i class="fa-light fa-magnifying-glass"></i></span>' +
            '<input class="ums-searchbar__input" data-qf="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div></div>' +
            '<div class="ums-filter">' +
            (locKeys.indexOf('he') >= 0 ? sel('he', 'Chọn hệ đào tạo') : '') +
            (locKeys.indexOf('khoa') >= 0 ? sel('khoa', 'Chọn khóa học') : '') +
            '<div class="ums-field">' + ui.btn('search', { attr: { 'data-qad-a': 'tim' }, cls: 'ums-u-w100' }) + '</div></div>';

        var mst = pat.master({
            el: root, title: cfg.tieuDe,
            side: { title: trai.tieuDe, icon: trai.icon, search: false, filter: locHtml },
            main: { title: false }
        });
        function qf(kk) { return root.querySelector('[data-qf="' + kk + '"]'); }
        function val(kk) { var x = qf(kk); return x ? (x.value || '').trim() : ''; }
        ctx.locVal = val;

        /* ---------- Thân phải: tab ---------- */
        var tabs = caps.map(function (c) { return { key: c.key, text: c.tab }; });
        /* Khung đầu "Chương trình <tên>" (gốc: chữ 30px giữa khung) chứa dải tab; mỗi tab
           là các khung riêng xếp dưới nó. Chưa chọn gì: khung đầu chỉ có câu dẫn. */
        mst.main.innerHTML =
            pat.panel({ title: cfg.dauDe || 'Chương trình', icon: cfg.icon || 'fa-sliders', count: 'qadTen', cls: 'qad-dau', flush: true,
                body: '<div data-qad-z="nhac">' + ui.empty('Chọn một ' + (cfg.dauDe || 'chương trình').toLowerCase() +
                    ' ở cột trái để khai báo áp dụng', 'fa-hand-pointer') + '</div>' +
                    '<div data-qad-z="tabs" hidden>' + (caps.length > 1 ? ui.tabs(tabs, caps[0].key, 'data-qad-tab') : '') + '</div>' }) +
            '<div data-qad-z="than" hidden>' +
            caps.map(function (c, i) {
                return '<div data-qad-cap="' + esc(c.key) + '"' + (i ? ' hidden' : '') + '>' +
                    (c.con ? '<div data-qad-con="' + esc(c.key) + '"></div>' : '<div data-qad-luoi="' + esc(c.key) + '"></div>') +
                    '</div>';
            }).join('') + '</div>';
        var zNhac = mst.main.querySelector('[data-qad-z="nhac"]');
        var zTabs = mst.main.querySelector('[data-qad-z="tabs"]');
        var zThan = mst.main.querySelector('[data-qad-z="than"]');
        var zTen = mst.main.querySelector('[data-z="qadTen"]');

        function capOf(key) { return caps.filter(function (c) { return c.key === key; })[0]; }

        /* Tham số chung của một tầng */
        function thamSo(kind, obj, cap) { return cfg.thamSo ? (cfg.thamSo(kind, obj, cap, ctx) || obj) : obj; }
        function pvCua(cap) {
            if (cap.pv) return cap.pv(ctx);
            if (!ctx.trai) return '';
            if (cap.con) { var r = ctx.con[cap.key]; return r ? e(r[cap.con.id]) + e(ctx.trai.ID) : ''; }
            return e(ctx.trai.ID);
        }
        function taoLuoi(cap, host) {
            var cot = cap.cot || cfg.cot || [];
            var nutKT = '';
            if (cap.keThua && cfg.keThua !== false) {
                var kt = cfg.keThua || {};
                nutKT = ui.btn('add', { text: kt.text || 'Kế thừa cho tất cả chương trình trong khóa', mod: 'out-warn',
                    icon: 'fa-object-ungroup', attr: { 'data-qad-tool': '_keThua' } });
            }
            return Q.luoi(host, {
                // Tab thường: chữ tab đã nói rõ → đầu khung chỉ có nút. Tab có danh sách con: tên mục con đang chọn.
                tieuDe: cap.con ? (cap.con.chuaChon || 'Chưa chọn') : (cap.tieuDe || false), cot: cot,
                icon: cap.icon, batBuoc: cap.batBuoc,
                nhac: cap.con ? 'Chọn một mục ở danh sách bên trái' : 'Chưa chọn ' + (cfg.dauDe || 'chương trình').toLowerCase(),
                tools: nutKT + (cap.tools ? cap.tools(ctx) : ''),
                loc: function (pv) {
                    return thamSo('loc', Object.assign({ action: cfg.api + '/LayDanhSach', method: 'GET', strTuKhoa: '' },
                        cfg.loc || {}, { strPhamViApDung_Id: pv, strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 10000000 }), cap);
                },
                luu: function (v, rec, pv) {
                    var id = rec ? e(rec.ID) : '';
                    var o = Object.assign({ action: cfg.api + (cap.capNhat && id ? '/CapNhat' : '/ThemMoi'), strId: id },
                        cfg.luu || {});
                    cot.forEach(function (c) { if (c.type !== 'static' && c.key) o[c.key] = e(v[c.key]); });
                    o.strPhamViApDung_Id = pv;
                    o.strNguoiThucHien_Id = '';
                    return thamSo('luu', o, cap);
                },
                xoa: function (rec) {
                    return thamSo('xoa', { action: cfg.api + '/Xoa', strIds: rec.ID, strNguoiThucHien_Id: '' }, cap);
                },
                xoaDuoc: cfg.xoaDuoc,
                onTool: function (ten, luoi) {
                    if (ten === '_keThua') { keThua(cap); return; }
                    if (cap.onTool) cap.onTool(ten, ctx, luoi);
                }
            });
        }
        function keThua(cap) {
            if (!ctx.trai) return;
            var kt = cfg.keThua || {};
            var o = kt.thamSo ? kt.thamSo(ctx) : { strDaoTao_ChuongTrinh_Id: ctx.trai.ID, strNguoiThucHien_Id: '' };
            o = thamSo('keThua', Object.assign({ action: cfg.api + '/KeThua' }, o), cap);
            ui.confirm(kt.hoi || ('Bạn có chắc chắn kế thừa? Tham số của "' + trai.ten(ctx.trai) + '" sẽ được áp cho tất cả chương trình trong khóa.'),
                { title: 'Kế thừa', ok: 'Kế thừa' }).then(function (yes) {
                if (!yes) return;
                return ums.api.call(o).then(function () {
                    ui.toast(kt.xong || 'Kế thừa cho tất cả chương trình trong khóa thành công', 'ok');
                });
            }).catch(function (err) { ums.api.handle(err, 'kế thừa'); });
        }

        /* ---------- Tab có danh sách con (học phần…) ---------- */
        var con = {};   // capKey → { mst, ds, chon: { id: 1 } }
        caps.forEach(function (cap) {
            var host;
            if (cap.con) {
                host = mst.main.querySelector('[data-qad-con="' + cap.key + '"]');
                var m = pat.master({
                    el: host, side: { title: cap.con.tieuDe, icon: cap.con.icon, search: 'Nhập từ khóa tìm kiếm', width: cap.con.rong || '260px',
                        // con.chonTatCa: ô "chọn tất cả" ở đầu danh sách con (gốc: chkSelectAll_… cạnh tiêu đề)
                        tools: cap.con.chon && cap.con.chonTatCa ? '<label class="ums-check" title="Chọn tất cả"><input type="checkbox" data-qad-chontatca></label>' : '' },
                    main: { title: false }
                });
                m.main.innerHTML = '<div data-qad-luoi="' + esc(cap.key) + '"></div>';
                con[cap.key] = { mst: m, ds: [], chon: {} };
                ctx.luoi[cap.key] = taoLuoi(cap, m.main.querySelector('[data-qad-luoi]'));
                m.search.addEventListener('input', function () { veCon(cap); });
                m.sideBody.addEventListener('click', function (ev) {
                    if (ev.target.closest('input[type="checkbox"]')) return;
                    var b = ev.target.closest('.ums-master__item');
                    if (!b) return;
                    var r = con[cap.key].ds.filter(function (x) { return e(x[cap.con.id]) === b.getAttribute('data-id'); })[0];
                    if (!r) return;
                    ctx.con[cap.key] = r;
                    veCon(cap);
                    ctx.luoi[cap.key].tieuDe((cap.con.nhan || cap.con.ten)(r));
                    if (cap.chonCon) cap.chonCon(r, ctx, ctx.luoi[cap.key]);
                    else ctx.luoi[cap.key].nap(pvCua(cap));
                    if (cfg.onChonCon) cfg.onChonCon(cap, r, ctx);
                });
                /* Dấu chọn giữ trong con[].chon — lọc từ khoá / bấm mục vẽ lại danh sách không làm mất */
                m.side.addEventListener('change', function (ev) {
                    var t = ev.target, c = con[cap.key];
                    if (t.hasAttribute('data-qad-chon')) {
                        if (t.checked) c.chon[t.getAttribute('data-qad-chon')] = 1; else delete c.chon[t.getAttribute('data-qad-chon')];
                    } else if (t.hasAttribute('data-qad-chontatca')) {
                        Array.prototype.forEach.call(c.mst.sideBody.querySelectorAll('input[data-qad-chon]'), function (x) {
                            x.checked = t.checked;
                            if (t.checked) c.chon[x.getAttribute('data-qad-chon')] = 1; else delete c.chon[x.getAttribute('data-qad-chon')];
                        });
                    }
                });
            } else {
                host = mst.main.querySelector('[data-qad-luoi="' + cap.key + '"]');
                ctx.luoi[cap.key] = taoLuoi(cap, host);
            }
        });
        function boDau(s) { return e(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd'); }
        function veCon(cap) {
            var c = con[cap.key], q = boDau(c.mst.search.value).trim(), cur = ctx.con[cap.key];
            var ds = c.ds.filter(function (r) { return !q || boDau(cap.con.ten(r)).indexOf(q) >= 0; });
            c.mst.sideCount.textContent = '(' + c.ds.length + ')';
            c.mst.sideBody.innerHTML = ds.length ? ds.map(function (r) {
                var id = e(r[cap.con.id]);
                return pat.masterItem({ id: id, text: cap.con.ten(r), active: cur && e(cur[cap.con.id]) === id,
                    act: cap.con.chon ? '<input type="checkbox" data-qad-chon="' + esc(id) + '" title="Chọn"' + (c.chon[id] ? ' checked' : '') + '>' : '' });
            }).join('') : ui.empty(c.ds.length ? 'Không có mục khớp từ khoá' : 'Không có dữ liệu', 'fa-inbox');
        }
        function napCon(cap) {
            var c = con[cap.key];
            c.ds = []; c.chon = {}; ctx.con[cap.key] = null;
            c.mst.search.value = '';
            var all = c.mst.side.querySelector('input[data-qad-chontatca]');
            if (all) all.checked = false;
            c.mst.sideBody.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            ctx.luoi[cap.key].nap('');
            ctx.luoi[cap.key].tieuDe(cap.con.chuaChon || 'Chưa chọn');
            var tr = ctx.trai;
            return ums.api.call(Object.assign({ method: 'GET', silent: true }, cap.con.tai(tr, ctx))).then(function (r) {
                if (tr !== ctx.trai) return;
                c.ds = arr(r.data);
                veCon(cap);
            }).catch(function (err) {
                c.mst.sideBody.innerHTML = ui.fail(err.message);
                ums.api.handle(err, 'tải ' + cap.con.tieuDe.toLowerCase());
            });
        }
        ctx.conChon = function (capKey) {
            var c = con[capKey]; if (!c) return [];
            var cap = capOf(capKey);
            return c.ds.filter(function (r) { return !!c.chon[e(r[cap.con.id])]; });
        };
        ctx.pvCua = pvCua;
        // cap.init: một lần sau khi dựng (gắn sự kiện cho ô chọn ở đầu khung bảng)
        caps.forEach(function (cap) { if (cap.init) cap.init(ctx, ctx.luoi[cap.key]); });

        /* ---------- Chuyển tab ---------- */
        root.addEventListener('click', function (ev) {
            var t = ev.target.closest('[data-qad-tab]');
            if (!t || !root.contains(t)) return;
            var key = t.getAttribute('data-qad-tab');
            ui.tabsActive(zTabs, key, 'data-qad-tab');
            caps.forEach(function (c) {
                zThan.querySelector('[data-qad-cap="' + c.key + '"]').hidden = c.key !== key;
            });
        });

        /* ---------- Cột trái ---------- */
        function veTrai() {
            mst.sideCount.textContent = '(' + (trai.phanTrang ? page.total : dsTrai.length) + ')';
            mst.sideBody.innerHTML = dsTrai.length ? dsTrai.map(function (r) {
                var it = trai.item(r);
                return pat.masterItem({ id: e(r.ID), text: it.text, sub: it.sub, active: ctx.trai && ctx.trai.ID === r.ID });
            }).join('') : ui.empty('Không có dữ liệu', 'fa-inbox');
            if (trai.phanTrang) mst.setPage(Object.assign({}, page, { shown: dsTrai.length, onChange: napTrai, onSize: function (s) { page.size = s; napTrai(1); } }));
        }
        function dongPhai() {
            ctx.trai = null;
            zThan.hidden = true; zTabs.hidden = true; zNhac.hidden = false;
            zTen.textContent = '';
        }
        function napTrai(p) {
            page.index = p || 1;
            dongPhai();   // gốc: genTable_ChuongTrinh → $("#zoneEdit").slideUp()
            mst.sideBody.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            var f = { he: val('he'), khoa: val('khoa'), q: val('q') };
            return ums.api.call(Object.assign({ silent: true }, trai.tai(f, page))).then(function (r) {
                dsTrai = arr(r.data);
                page.total = Number(r.pager) || dsTrai.length;
                veTrai();
            }).catch(function (err) {
                dsTrai = []; mst.sideBody.innerHTML = ui.fail(err.message);
                ums.api.handle(err, 'tải ' + trai.tieuDe.toLowerCase());
            });
        }
        ctx.napTrai = napTrai;
        mst.sideBody.addEventListener('click', function (ev) {
            var b = ev.target.closest('.ums-master__item');
            if (!b) return;
            var r = dsTrai.filter(function (x) { return e(x.ID) === b.getAttribute('data-id'); })[0];
            if (!r) return;
            chonTrai(r);
        });
        function chonTrai(r) {
            ctx.trai = r;
            veTrai();
            zTen.textContent = trai.ten(r);
            zNhac.hidden = true; zTabs.hidden = false;
            if (zThan.hidden) { zThan.hidden = false; ui.reveal(zThan); }
            caps.forEach(function (cap) {
                if (cap.con) napCon(cap);
                else ctx.luoi[cap.key].nap(pvCua(cap));
                if (cap.onTrai) cap.onTrai(r, ctx, ctx.luoi[cap.key]);
            });
            if (cfg.onChonTrai) cfg.onChonTrai(r, ctx);
        }

        /* ---------- Thanh lọc trái: Hệ → Khóa (select2:select như gốc) ---------- */
        root.querySelector('[data-qad-a="tim"]').addEventListener('click', function () { napTrai(1); });
        qf('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); napTrai(1); } });
        ui.enhance(mst.side);
        function napKhoa() {
            if (!qf('khoa')) return Promise.resolve();
            return Q.nguon.khoa(val('he')).then(function (x) {
                pat.fill(qf('khoa'), x.rows, { name: 'TENKHOA', head: 'Chọn khóa học' });
            }).catch(function (err) { ums.api.handle(err, 'nạp khóa học'); });
        }
        if (qf('he')) {
            Q.nguon.he().then(function (rows) { pat.fill(qf('he'), rows, { name: 'TENHEDAOTAO', head: 'Chọn hệ đào tạo' }); })
                .catch(function (err) { ums.api.handle(err, 'nạp hệ đào tạo'); });
            jq(qf('he')).on('select2:select', function () { napKhoa(); napTrai(1); });
        }
        // Gốc chỉ nghe select2:select; xoá trắng Khóa thì cũng nạp lại (không để danh sách của khoá cũ)
        if (qf('khoa')) jq(qf('khoa')).on('select2:select select2:clear', function () { napTrai(1); });
        /* Luật chung: chưa chọn Hệ thì khoá Khóa; chọn / xoá Hệ thì xoá trắng Khóa.
           Xoá Hệ → chain phát lại select2:select → nạp lại Khóa (theo hệ rỗng) + danh sách. */
        if (qf('he') && qf('khoa')) pat.chain([qf('he'), qf('khoa')]);
        napKhoa();
        pat.cotTrai({ side: mst.side, search: qf('q') }, { tai: function () { napTrai(1); }, tuTaiLoc: false });

        napTrai(1);
        return ctx;
    };
})();
