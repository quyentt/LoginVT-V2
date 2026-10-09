/* =========================================================================
   qtqdl — khung chung ba màn QUẢN TRỊ QUYỀN DỮ LIỆU (ApisCMS/phanquyen): ums.qtqdl.*
   Bản gốc: ApisCMS/Modules/phanquyen/script/quantriquyendulieu.js (theo nhân sự của một đơn vị),
            quantriquyendulieum1.js (nhân sự × vai trò × chức năng), quantriquyendulieum2.js (theo vai trò).
   Ba tệp gốc chép nhau ~90%: cùng lưới "đối tượng × chiều dữ liệu" (mỗi ô hai nút Xem kết quả / Thêm quyền),
   cùng hộp "Thêm quyền" (danh sách giá trị của chiều, đánh dấu giá trị đã có quyền, tìm + phân trang ở máy
   khách), cùng hộp "Cấu hình quyền" (SCOPE_MODE / SCOPE_KIND viết cứng), cùng hộp "Xem kết quả".
   Chỗ khác nhau (lời gọi đọc / thêm / xoá quyền, nút xoá nằm ở hộp nào) do từng màn khai qua `quyen`.
   ---------------------------------------------------------------------------
   Lời gọi chung (chép nguyên, iM: 'Azz' viết cứng như gốc):
     PKG_CORE_QUANTRI_02.LayDSCore_Data_Dimension  { strChucNang_Id, strNguoiThucHien_Id }
     PKG_CORE_QUANTRI_02.LayDSCore_Dimension_Value { strChucNang_Id, strCore_Data_Dimension_Id, strNguoiThucHien_Id }
       — mỗi chiều một lời gọi; chiều nào lỗi / Success=false thì KHÔNG có cột (như gốc).
   Cột đọc: chiều ID|CORE_DATA_DIMENSION_ID, DIMENSION_NAME|TEN; giá trị ID|CORE_DATA_VALUE_ID|VALUE_ID,
     VALUE_CODE|CORE_DATA_VALUE_CODE, VALUE_NAME|CORE_DATA_VALUE_NAME|TEN, GHICHU.
   ---------------------------------------------------------------------------
   ums.qtqdl.napChieu() → Promise<[{ id, ten, data }]>
   ums.qtqdl.man(root, o) → { nhac(chữ, icon), dang(chữ), chieu(list), ve(dòng), loc: phần tử thanh lọc }
     o = { tieuDe, moTa (HTML dưới tiêu đề), loc (trường pat.filterBar), bang (chữ cột đầu), donVi ('người'), demDau (false = không ghi số ở ô đầu),
           doiTuong ('nhân sự' | 'vai trò'), icon, stt, phanTrang (cỡ trang, 0 = không phân trang),
           dau(row) → HTML ô đầu, id(row), ten(row), boiCanh() → ngữ cảnh chụp lúc mở hộp (m1: vai trò / chức năng),
           quyen: { tai(row, chieu, ctx) → call, map(item) → [valueId, scopeId] (scopeId rỗng = bỏ dòng),
                    them(row, chieu, ctx, valueId, mode, kind) → call, trungMoRong (m1: nhận thêm chữ lỗi mã hoá),
                    xoaThem(scopeId) → call  (nút "Xóa" trong hộp Thêm quyền — chỉ bản theo nhân sự),
                    xoaKQ(x, row, chieu, ctx) → call  (nút "Xóa quyền đã chọn" trong hộp Xem kết quả — m1, m2) } }
   ---------------------------------------------------------------------------
   Khác bản gốc (chung cho ba màn, ghi ở can-quyet.js):
     · Thứ tự cột chiều theo thứ tự LayDSCore_Data_Dimension trả về (gốc xếp theo thứ tự lời gọi giá trị
       nào về trước → mỗi lần mở một thứ tự).
     · Thêm / xoá chạy qua ums.ui.batch (4 luồng) thay cho bắn N lời gọi cùng lúc; đếm "đã tồn tại" là thành
       công như gốc.
     · Hỏi lại xoá một lần, chạy một lần (gốc gắn chồng $("#btnYes").click).
     · Xoá ở hộp "Xem kết quả" xong thì vẽ lại CHÍNH hộp đó (gốc nạp lại rồi vẽ vào bảng của hộp Thêm quyền —
       không tồn tại — nên hộp kết quả vẫn hiện quyền vừa xoá).
     · Bỏ: lịch tháng ẩn, thanh số liệu ẩn, ô chú giải ẩn (display:none ở gốc), các console.log gỡ lỗi.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var Q = ums.qtqdl = ums.qtqdl || {};

    function e(v) { return v === null || v === undefined ? '' : String(v); }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs)) ? d.rs : []; }
    function qa(r, s) { return Array.prototype.slice.call(r.querySelectorAll(s)); }
    Q.e = e; Q.arr = arr;
    Q.uid = function () { return (ums.session && ums.session.userId) || ''; };
    /* edu.system.strChucNang_Id — chức năng đang mở */
    Q.cn = function () { return (ums.state && ums.state.chucNangId) || ''; };
    /* edu.system.appId — CHÍNH LÀ VaiTro_Id đang đăng nhập (CLAUDE.md mục 4) */
    Q.appId = function () { return (ums.state && ums.state.roleId) || (ums.session && ums.session.appId) || ''; };

    /* Giá trị của một chiều */
    Q.vId = function (it) { return it.ID || it.CORE_DATA_VALUE_ID || it.VALUE_ID; };
    Q.vMa = function (it) { return it.VALUE_CODE || it.CORE_DATA_VALUE_CODE || ''; };
    Q.vTen = function (it) { return it.VALUE_NAME || it.CORE_DATA_VALUE_NAME || it.TEN || 'N/A'; };
    /* Cột giá trị trong dòng quyền đã gán — gốc thử lần lượt các tên này */
    Q.valueIdCuaQuyen = function (it) {
        return it.DIMENSION_VALUE_ID || it.CORE_DATA_VALUE_ID || it.VALUE_ID || it.CORE_DIMENSION_VALUE_ID ||
            it.DIMENSIONVALUEID || it.COREDATAVALUEID;
    };

    /* Lỗi "đã tồn tại" coi như thành công (quyền đã có). m1 thêm ba mẫu chữ bị lỗi mã hoá của máy chủ. */
    function laTrung(msg, rong) {
        var m = e(msg).toLowerCase();
        if (m.indexOf('da ton tai') !== -1 || m.indexOf('đã tồn tại') !== -1 || m.indexOf('already exists') !== -1) return true;
        return !!rong && (m.indexOf('ðã') !== -1 || m.indexOf('t?n t?i') !== -1 || m.indexOf('ph?m vi d? li?u') !== -1);
    }

    /* ---------- Chiều dữ liệu + giá trị của từng chiều ------------------- */
    Q.napChieu = function () {
        return ums.api.call({
            action: 'CMS_QuanTri02_MH/DSA4BRICLjMkHgUgNSAeBSgsJC8yKC4v',
            func: 'PKG_CORE_QUANTRI_02.LayDSCore_Data_Dimension',
            iM: 'Azz',
            strChucNang_Id: Q.cn(),
            strNguoiThucHien_Id: Q.uid()
        }).then(function (r) {
            var ds = arr(r.data);
            return Promise.all(ds.map(function (d) {
                var id = d.ID || d.CORE_DATA_DIMENSION_ID, ten = d.DIMENSION_NAME || d.TEN;
                return ums.api.call({
                    action: 'CMS_QuanTri02_MH/DSA4BRICLjMkHgUoLCQvMiguLx4XIC00JAPP',
                    func: 'PKG_CORE_QUANTRI_02.LayDSCore_Dimension_Value',
                    iM: 'Azz',
                    strChucNang_Id: Q.cn(),
                    strCore_Data_Dimension_Id: id,
                    strNguoiThucHien_Id: Q.uid(),
                    silent: true
                }).then(function (x) {
                    if (!x.data) return null;
                    var v = arr(x.data);
                    v.forEach(function (it) { it.DIMENSION_NAME = ten; it.CORE_DATA_DIMENSION_ID = id; });
                    return { id: id, ten: ten, data: v };
                }, function () { return null; });
            })).then(function (list) { return list.filter(Boolean); });
        });
    };

    /* =====================================================================
       Màn: thanh lọc + lưới đối tượng × chiều dữ liệu
       ===================================================================== */
    Q.man = function (root, o) {
        root.classList.add('qtqdl');
        root.innerHTML = pat.page(o.tieuDe) + (o.moTa || '') +
            (o.loc ? pat.filterBar(o.loc, { search: false }) : '') +
            pat.panel({ title: 'Phân quyền dữ liệu theo ' + o.doiTuong, icon: 'fa-shield-halved', flush: true, zone: 'luoi', count: 'dem' });
        ui.enhance(root);
        var luoi = root.querySelector('[data-z="luoi"]');
        var dem = root.querySelector('[data-z="dem"]');
        var S = { chieu: null, rows: null, msg: '', icon: '', trang: 1, co: o.phanTrang || 0, trangRows: [] };

        function ve() {
            if (S.chieu && !S.chieu.length) { dem.textContent = ''; luoi.innerHTML = ui.empty('Chưa cấu hình chiều dữ liệu để phân quyền.', 'fa-triangle-exclamation'); return; }
            if (S.rows === null) { dem.textContent = ''; luoi.innerHTML = ui.empty(S.msg, S.icon || 'fa-circle-info'); return; }
            if (!S.chieu) { luoi.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải dữ liệu chiều...</div>'; return; }
            var tong = S.rows.length;
            dem.textContent = '(' + tong + ' ' + (o.donVi || 'dòng') + ')';
            var rows = S.rows, page;
            if (S.co) {
                var soTrang = Math.max(1, Math.ceil(tong / S.co));
                if (S.trang > soTrang) S.trang = soTrang;
                rows = S.rows.slice((S.trang - 1) * S.co, S.trang * S.co);
                page = { index: S.trang, size: S.co, total: tong, sizes: [10, 20, 50, 100],
                    onChange: function (p) { S.trang = p; ve(); },
                    onSize: function (n) { S.co = n; S.trang = 1; ve(); } };
            }
            S.trangRows = rows;
            var cot = [{ head: '<span class="qtqdl-th">' + esc(o.bang) + '</span>' +
                (o.donVi && o.demDau !== false ? '<span class="qtqdl-th__sub">(' + tong + ' ' + esc(o.donVi) + ')</span>' : ''),
                cls: 'qtqdl-dau', render: function (r) { return o.dau(r); } }];
            S.chieu.forEach(function (c, ci) {
                cot.push({ head: '<span class="qtqdl-th">' + esc(c.ten) + '</span><span class="qtqdl-th__sub">(' + c.data.length + ' giá trị)</span>',
                    cls: 'is-center', render: function (r, i) {
                        var a = { 'data-r': i, 'data-c': ci };
                        return '<div class="qtqdl-o">' +
                            ui.btn('view', { text: 'Xem kết quả', cls: 'ums-btn--sm', attr: Object.assign({ 'data-q': 'xem', title: 'Xem các quyền đã gán' }, a) }) +
                            ui.btn('add', { text: 'Thêm quyền', mod: 'out-success', cls: 'ums-btn--sm', attr: Object.assign({ 'data-q': 'them', title: 'Thêm quyền mới' }, a) }) +
                            '</div>';
                    } });
            });
            ui.table({ el: luoi, rows: rows, columns: cot, stt: !!o.stt, page: page, tableCls: 'ums-table--lined qtqdl-luoi',
                empty: o.rong || 'Không có dữ liệu' });
            if (o.chan) luoi.insertAdjacentHTML('beforeend', '<div class="ums-tablefoot">' + o.chan(S) + '</div>');
        }

        luoi.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-q]');
            if (!b || !luoi.contains(b)) return;
            var row = S.trangRows[Number(b.getAttribute('data-r'))], c = S.chieu[Number(b.getAttribute('data-c'))];
            if (!row || !c) return;
            var ctx = o.boiCanh ? o.boiCanh() : {};
            if (b.getAttribute('data-q') === 'xem') Q.hopKetQua(o, row, c, ctx);
            else Q.hopThem(o, row, c, ctx);
        });

        var m = {
            loc: root.querySelector('.ums-filter'),
            /** Khung lời nhắc thay chỗ lưới (chưa chọn đơn vị…) */
            nhac: function (msg, icon) { S.rows = null; S.msg = msg; S.icon = icon; ve(); },
            dang: function (msg) { S.rows = null; dem.textContent = ''; luoi.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>' + esc(msg || 'Đang tải…') + '</div>'; },
            chieu: function (list) { S.chieu = list; if (S.rows !== null || list.length === 0) ve(); },
            ve: function (rows) { S.rows = rows || []; S.trang = 1; ve(); },
            loi: function (msg) { S.rows = null; dem.textContent = ''; luoi.innerHTML = ui.fail(msg); },
            state: S
        };
        return m;
    };

    /* ---------- Nạp quyền đã gán → { valueId: scopeId } ----------------- */
    function napQuyen(o, row, c, ctx) {
        return ums.api.call(Object.assign(o.quyen.tai(row, c, ctx), { silent: true })).then(function (r) {
            var map = {};
            arr(r.data).forEach(function (it) {
                var k = o.quyen.map(it);
                if (k[0] && k[1]) map[k[0]] = k[1];
            });
            return map;
        }, function () { return {}; });      // gốc: lỗi vẫn hiện hộp (coi như chưa có quyền nào)
    }

    function goiY(html, tone) { return '<div class="qtqdl-goiy' + (tone ? ' qtqdl-goiy--' + tone : '') + '">' + html + '</div>'; }
    function dangTai(msg) { return '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>' + esc(msg) + '</div>'; }

    /* =====================================================================
       Hộp "Thêm quyền" (showDetailModal / renderModalTable của gốc)
       ===================================================================== */
    Q.hopThem = function (o, row, c, ctx) {
        var q = o.quyen, ten = o.ten(row);
        var S = { loc: null, trang: 1, co: 10, co_q: {} };
        var dlg = ui.dialog({
            title: ten + ' - ' + c.ten + ' (' + c.data.length + ' giá trị)', icon: o.icon, size: 'lg',
            body: goiY('<b>Hướng dẫn:</b> Chọn các giá trị bạn muốn gán quyền cho ' + esc(o.doiTuong) + ' này. Các giá trị đã có quyền sẽ được đánh dấu sẵn.') +
                '<div class="qtqdl-tim"><div class="ums-field"><input class="ums-input" data-d="tim" placeholder="Nhập mã, tên để tìm kiếm..." autocomplete="off"></div>' +
                '<span class="ums-u-fz12 ums-u-muted" data-d="dem"></span></div><div data-d="bang">' + dangTai('Đang tải quyền hiện tại...') + '</div>',
            xoa: q.xoaThem ? { chon: 'input[data-qs]', text: 'Xóa', onClick: function () { xoa(); } } : undefined,
            buttons: [{ text: 'Thêm', kind: 'add', keepOpen: true, onClick: function () { them(); } }]
        });
        var B = dlg.body, bang = B.querySelector('[data-d="bang"]'), demEl = B.querySelector('[data-d="dem"]'), tim = B.querySelector('[data-d="tim"]');
        var nap = false;

        function dsDung() { return S.loc || c.data; }
        function veBang() {
            var ds = dsDung(), tong = ds.length;
            var soTrang = Math.max(1, Math.ceil(tong / S.co));
            if (S.trang > soTrang) S.trang = soTrang;
            var rows = ds.slice((S.trang - 1) * S.co, S.trang * S.co);
            ui.table({ el: bang, rows: rows, empty: 'Không có dữ liệu',
                rowCls: function (it) { return S.co_q[Q.vId(it)] ? 'qtqdl-co' : ''; },
                page: { index: S.trang, size: S.co, total: tong, sizes: [10, 20, 50, 100],
                    onChange: function (p) { S.trang = p; veBang(); }, onSize: function (n) { S.co = n; S.trang = 1; veBang(); } },
                columns: [
                    { title: 'Mã', width: '150px', render: function (it) { return esc(Q.vMa(it)); } },
                    { title: 'Tên', render: function (it) {
                        return esc(Q.vTen(it)) + (S.co_q[Q.vId(it)] ? ' ' + ui.badge('Đã có quyền', 'ok') : ''); } },
                    { title: 'Ghi chú', width: '120px', cls: 'is-center', render: function (it) { return esc(e(it.GHICHU)); } },
                    { head: '<label class="qtqdl-tatca"><input type="checkbox" data-d="tatca"><span>Chọn tất cả</span></label>', cls: 'is-center', width: '90px',
                        render: function (it) {
                            var v = Q.vId(it), s = S.co_q[v];
                            return '<input type="checkbox" data-qv="' + esc(v) + '"' + (s ? ' data-qs="' + esc(s === true ? 'true' : s) + '" checked' : '') + '>';
                        } }
                ] });
            dongBoTatCa();
        }
        function dongBoTatCa() {
            var all = B.querySelector('[data-d="tatca"]'), o2 = qa(bang, 'input[data-qv]');
            if (all) all.checked = o2.length > 0 && o2.every(function (x) { return x.checked; });
        }
        function napLai() {
            return napQuyen(o, row, c, ctx).then(function (map) { S.co_q = map; nap = true; veBang(); });
        }
        function locDs() {
            var k = tim.value.toLowerCase().trim();
            if (!k) { S.loc = null; demEl.innerHTML = ''; }
            else {
                S.loc = c.data.filter(function (it) {
                    return ((Q.vMa(it)) + ' ' + (it.VALUE_NAME || it.CORE_DATA_VALUE_NAME || it.TEN || '') + ' ' + e(it.GHICHU) + ' ').toLowerCase().indexOf(k) !== -1;
                });
                demEl.innerHTML = S.loc.length ? '<i class="fa-light fa-circle-check ums-u-blue"></i> ' + S.loc.length + '/' + c.data.length
                    : '<i class="fa-light fa-triangle-exclamation ums-u-danger"></i> Không tìm thấy';
            }
            S.trang = 1;
            if (nap) veBang();
        }
        var hen = 0;
        tim.addEventListener('input', function () { clearTimeout(hen); hen = setTimeout(locDs, 300); });
        tim.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); clearTimeout(hen); locDs(); } });
        B.addEventListener('change', function (ev) {
            var t = ev.target;
            if (t.matches && t.matches('[data-d="tatca"]')) qa(bang, 'input[data-qv]').forEach(function (x) { x.checked = t.checked; });
            else if (t.matches && t.matches('input[data-qv]')) dongBoTatCa();
        });

        function them() {
            var vals = qa(bang, 'input[data-qv]:not([data-qs]):checked').map(function (x) { return x.getAttribute('data-qv'); });
            if (!vals.length) { ui.toast('Vui lòng chọn ít nhất 1 giá trị chưa có quyền', 'warn'); return; }
            Q.hopKieu(vals.length, o.doiTuongHoa || 'Nhân sự').then(function (k) {
                if (!k) return;
                ui.batch(vals.map(function (v) { return q.them(row, c, ctx, v, k.mode, k.kind); }),
                    { title: 'Đang thêm quyền', toast: false, concurrency: 4, show: true })
                    .then(function (r) {
                        var trung = r.errors.filter(function (m) { return laTrung(m, q.trungMoRong); });
                        var loi = r.errors.filter(function (m) { return !laTrung(m, q.trungMoRong); });
                        var ok = r.ok + trung.length;
                        if (!loi.length) ui.toast('Thêm/cập nhật thành công ' + ok + ' quyền!', 'ok');
                        else ui.toast('Thêm thành công ' + ok + ' quyền. Có ' + loi.length + ' lỗi: ' + loi.join(', '), ok ? 'warn' : 'bad');
                        if (!dlg.closed) napLai();
                    });
            });
        }
        function xoa() {
            var ids = qa(bang, 'input[data-qs]:checked').map(function (x) { return x.getAttribute('data-qs'); });
            if (!ids.length) { ui.toast('Vui lòng chọn ít nhất 1 giá trị đã có quyền để xóa', 'warn'); return; }
            chayXoa(ids.map(function (id) { return q.xoaThem(id); }), function () { if (!dlg.closed) napLai(); });
        }
        napLai();
    };

    /* Hỏi lại → xoá hàng loạt → thông báo như gốc → gọi lại */
    function chayXoa(calls, xong) {
        ui.confirm('Bạn có chắc chắn muốn xóa ' + calls.length + ' quyền đã chọn?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
            if (!yes) return;
            ui.batch(calls, { title: 'Đang xoá quyền', toast: false, concurrency: 4, show: true }).then(function (r) {
                if (r.ok && !r.fail) ui.toast('Xóa thành công ' + r.ok + ' quyền!', 'ok');
                else if (r.ok) ui.toast('Xóa thành công ' + r.ok + ' quyền. Có ' + r.fail + ' lỗi: ' + r.errors.join(', '), 'warn');
                else ui.toast('Không thể xóa quyền: ' + r.errors.join(', '), 'bad');
                xong();
            });
        });
    }

    /* =====================================================================
       Hộp "Cấu hình quyền" — SCOPE_MODE / SCOPE_KIND (gốc viết cứng, không gọi API)
       ===================================================================== */
    Q.MODE = [{ ID: 'INCLUDE', TEN: 'INCLUDE - Cho phép truy cập' }, { ID: 'EXCLUDE', TEN: 'EXCLUDE - Từ chối truy cập' }];
    Q.KIND = [{ ID: 'EXPLICIT', TEN: 'EXPLICIT - Tường minh' }, { ID: 'DIRECT', TEN: 'DIRECT - Trực tiếp' }, { ID: 'LIST', TEN: 'LIST - Danh sách' }];
    Q.hopKieu = function (n, ai) {
        return new Promise(function (resolve) {
            var xong = false;
            function o(ds) { return ds.map(function (x) { return '<option value="' + esc(x.ID) + '">' + esc(x.TEN) + '</option>'; }).join(''); }
            function truong(nhan, ten, ds, goi) {
                return '<div class="ums-field"><label class="ums-field__label">' + esc(nhan) + '</label><div class="ums-field__control">' +
                    '<select class="ums-select" data-k="' + ten + '" data-required>' + o(ds) + '</select>' +
                    '<div class="ums-field__hint">' + goi + '</div></div></div>';
            }
            var dlg = ui.dialog({
                title: 'Cấu hình quyền', icon: 'fa-gear', size: 'md',
                body: goiY('<b>Thông tin:</b> Đang thêm quyền cho <b>' + n + '</b> giá trị', 'warn') +
                    '<div class="ums-stack">' +
                    truong('Chế độ (SCOPE_MODE)', 'mode', Q.MODE, 'INCLUDE: ' + esc(ai) + ' được phép truy cập dữ liệu này<br>EXCLUDE: ' + esc(ai) + ' bị từ chối truy cập dữ liệu này') +
                    truong('Kiểu (SCOPE_KIND)', 'kind', Q.KIND, 'EXPLICIT: Quyền được gán tường minh<br>DIRECT: Quyền trực tiếp<br>LIST: Quyền theo danh sách') +
                    '</div>',
                buttons: [{ text: 'Xác nhận thêm', kind: 'confirm', onClick: function (d) {
                    var mode = d.body.querySelector('[data-k="mode"]').value, kind = d.body.querySelector('[data-k="kind"]').value;
                    if (!mode || !kind) { ui.toast('Vui lòng chọn đầy đủ chế độ và kiểu', 'warn'); return false; }
                    xong = true; resolve({ mode: mode, kind: kind });
                } }],
                onClose: function () { if (!xong) resolve(null); }
            });
            ui.enhance(dlg.body);
        });
    };

    /* =====================================================================
       Hộp "Xem kết quả" (showResultModal / renderResultTable của gốc)
       ===================================================================== */
    Q.hopKetQua = function (o, row, c, ctx) {
        var q = o.quyen, ten = o.ten(row), map = {};
        var dlg = ui.dialog({
            title: 'Kết quả phân quyền - ' + ten + ' - ' + c.ten, icon: 'fa-list-check', size: 'lg',
            body: goiY('<b>Thông tin:</b> Hiển thị các quyền đã được gán cho ' + esc(o.doiTuong) + ' này. Chỉ xem, không thể chỉnh sửa.', 'info') +
                '<div data-d="bang">' + dangTai('Đang tải quyền hiện tại...') + '</div>',
            xoa: q.xoaKQ ? { chon: 'input[data-qr]', text: 'Xóa quyền đã chọn', onClick: function () { xoa(); } } : undefined
        });
        var B = dlg.body, bang = B.querySelector('[data-d="bang"]'), ds = [];
        function veBang() {
            ds = c.data.filter(function (it) { return !!map[Q.vId(it)]; }).map(function (it) { return { item: it, valueId: Q.vId(it), scopeId: map[Q.vId(it)] }; });
            var cot = [];
            if (q.xoaKQ) cot.push({ head: '<input type="checkbox" data-d="tatca" title="Chọn tất cả">', cls: 'is-center', width: '50px',
                render: function (x, i) { return '<input type="checkbox" data-qr="' + i + '">'; } });
            cot.push({ title: 'Mã', width: '150px', render: function (x) { return esc(Q.vMa(x.item)); } },
                { title: 'Tên', render: function (x) { return esc(Q.vTen(x.item)); } },
                { title: 'Trạng thái', width: '140px', cls: 'is-center', render: function () { return ui.badge('Đã có quyền', 'ok'); } });
            ui.table({ el: bang, rows: ds, columns: cot, rowCls: function () { return 'qtqdl-co'; },
                empty: 'Chưa có quyền nào được gán. Sử dụng nút "Thêm quyền" để gán quyền mới' });
        }
        function napLai() { return napQuyen(o, row, c, ctx).then(function (m) { map = m; veBang(); }); }
        B.addEventListener('change', function (ev) {
            var t = ev.target, all = B.querySelector('[data-d="tatca"]');
            if (t === all) qa(bang, 'input[data-qr]').forEach(function (x) { x.checked = t.checked; });
            else if (all && t.matches && t.matches('input[data-qr]')) {
                var o2 = qa(bang, 'input[data-qr]');
                all.checked = o2.every(function (x) { return x.checked; });
            }
        });
        function xoa() {
            var chon = qa(bang, 'input[data-qr]:checked').map(function (x) { return ds[Number(x.getAttribute('data-qr'))]; });
            if (!chon.length) { ui.toast('Vui lòng chọn ít nhất 1 quyền để xóa', 'warn'); return; }
            chayXoa(chon.map(function (x) { return q.xoaKQ(x, row, c, ctx); }), function () { if (!dlg.closed) napLai(); });
        }
        napLai();
    };

    /* ---------- Cây cha-con → dãy phẳng có thụt lề (dùng cho ô chọn) ----- */
    /** o = { cha: 'CỘT_CHA', ten, thuTu (true = THUTU trước tên), goc: 'root' (chỉ nút cha rỗng) | 'mo' (cha không có trong ds cũng là gốc) } */
    Q.cay = function (ds, o) {
        var con = {}, co = {};
        ds.forEach(function (x) { co[x.ID] = true; });
        ds.forEach(function (x) {
            var p = x[o.cha] && (o.goc !== 'mo' || co[x[o.cha]]) ? x[o.cha] : '#';
            (con[p] = con[p] || []).push(x);
        });
        function so(a, b) {
            if (o.thuTu) {
                var ta = a.THUTU != null && a.THUTU !== '' ? parseInt(a.THUTU, 10) : 999, tb = b.THUTU != null && b.THUTU !== '' ? parseInt(b.THUTU, 10) : 999;
                if (ta !== tb) return ta - tb;
            }
            return e(a[o.ten]).localeCompare(e(b[o.ten]), 'vi');
        }
        Object.keys(con).forEach(function (k) { con[k].sort(so); });
        var kq = [];
        (function di(id, sau) {
            (con[id] || []).forEach(function (x) { kq.push({ row: x, sau: sau }); di(x.ID, sau + 1); });
        })('#', 0);
        return kq;
    };
    /** Nhãn ô chọn kiểu cây: thụt lề bằng khoảng trắng + "└" như gốc */
    Q.nhanCay = function (sau, ten, rong, dau) {
        var p = '';
        for (var d = 0; d < sau; d++) p += rong;
        return p + (sau > 0 ? dau : '') + ten;
    };
})();
