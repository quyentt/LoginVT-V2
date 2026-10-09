/* =========================================================================
   Kế hoạch khảo sát — lưới "Đối tượng được khảo sát" / "Đối tượng tham gia khảo sát"
   (tblPhamVi / tblDoiTuong của bản gốc) — ums.ks.luoiDoiTuong
   ---------------------------------------------------------------------------
   Mỗi lưới có: dòng ĐÃ LƯU (ô đánh dấu → nút Xóa), dòng MỚI từ ba hộp chọn
   (người học, SV từ đăng ký học, giảng viên — chỉ hiện Mã + Tên, có thùng rác),
   dòng "Thêm dòng" tự nhập (Mã, Tên, Mô tả, Loại đối tượng). Bấm Lưu kế hoạch
   xong mới gửi, mỗi dòng mới một lời gọi (save_SinhVien / save_DoiTuong gốc):
       dòng từ hộp chọn  → strId = id người học (QLSV_NGUOIHOC_ID) / id nhân sự,
                            strTen, strKyHieu|strMaSo = chữ Mã/Tên đang hiện,
                            strGhiChu '', strKS_LoaiDoiTuong_Id ''
       dòng tự nhập      → strId '', các ô của dòng
   Khác bản gốc: bỏ trùng người trong CÙNG lưới (bản gốc không kiểm — một SV
   học nhiều lớp HP thành nhiều dòng cùng id); rác của lưới này không xoá nhầm
   dòng lưới kia (bản gốc tìm #rm_row toàn trang); số thứ tự dòng mới đánh đúng.
   Dòng đã lưu nạp hết một lần (bản gốc phân trang 10 dòng — sang trang là mất
   dòng mới chưa lưu).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var ks = ums.ks = ums.ks || {};
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    var seq = 0;
    function maNgauNhien() {            // edu.util.randomString(30) — chỉ để phân biệt dòng tự nhập
        var s = 'n' + (++seq) + Date.now().toString(36);
        while (s.length < 30) s += Math.random().toString(36).slice(2);
        return s.slice(0, 30);
    }

    /* cfg = { title, icon, maCol: 'KYHIEU'|'MASO', loaiCol, list(id) → lời gọi, remove(rowId) → lời gọi,
               save(dong, idKeHoach) → lời gọi (dong = { id, ten, ma, moTa, loai, tuNhap }),
               dsLoai: Promise<danh mục KS.PHANLOAI.DOITUONGDUOCKHAOSAT>, onGroup(kind, ids, names) } */
    ks.luoiDoiTuong = function (host, cfg) {
        var saved = [], moi = [], dsLoai = [];
        cfg.dsLoai.then(function (d) { dsLoai = d || []; ve(); }, function () {});
        function nut(a, text, mod, icon) { return ui.btn('add', { text: text, mod: mod, icon: icon, cls: 'ums-btn--sm', attr: { 'data-lg': a } }); }
        host.innerHTML = '<div class="ums-panel ums-rows">' +
            '<div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light ' + esc(cfg.icon) + '"></i> ' + esc(cfg.title) + '</div></div>' +
            '<div class="ums-panel__body"><div class="ums-row">' +
                ui.xoaChon('input[data-lgi]', { goc: '.ums-panel', sm: true, attr: { 'data-lg': 'xoa' } }) +
                nut('sv', 'Thêm người học', 'out-success') + nut('dk', 'Thêm sinh viên từ đăng ký học', 'out-info') +
                nut('gv', 'Thêm giảng viên', 'out-primary') + nut('dong', 'Thêm dòng', 'out-success') +
            '</div></div>' +
            '<div data-lg="tbl"></div></div>';
        var tbl = host.querySelector('[data-lg="tbl"]');

        function oLoai(m) {
            return '<select class="ums-select ums-input--sm" data-lgf="loai"><option value="">Chọn loại</option>' +
                dsLoai.map(function (x) { return '<option value="' + esc(x.ID) + '"' + (x.ID === m.loai ? ' selected' : '') + '>' + esc(x.TEN) + '</option>'; }).join('') + '</select>';
        }
        function ve() {
            docTuNhap();
            var rows = saved.map(function (r) { return { r: r }; }).concat(moi.map(function (m) { return { m: m }; }));
            ui.table({
                el: tbl, rows: rows, empty: 'Chưa có đối tượng',
                columns: [
                    { title: 'Mã', render: function (x) { return x.r ? esc(e(x.r[cfg.maCol])) : (x.m.tuNhap ? '<input class="ums-input ums-input--sm" data-lgf="ma" value="' + esc(x.m.ma) + '">' : esc(x.m.ma)); } },
                    { title: 'Tên', render: function (x) { return x.r ? esc(e(x.r.TEN)) : (x.m.tuNhap ? '<input class="ums-input ums-input--sm" data-lgf="ten" value="' + esc(x.m.ten) + '">' : esc(x.m.ten)); } },
                    { title: 'Mô tả', render: function (x) { return x.r ? esc(e(x.r.GHICHU)) : (x.m.tuNhap ? '<input class="ums-input ums-input--sm" data-lgf="moTa" value="' + esc(x.m.moTa) + '">' : ''); } },
                    { title: 'Loại đối tượng', render: function (x) { return x.r ? esc(e(x.r[cfg.loaiCol])) : (x.m.tuNhap ? oLoai(x.m) : ''); } },
                    { head: '<input type="checkbox" data-lg="all" title="Chọn tất cả">', cls: 'is-center', width: '56px', render: function (x, i) {
                        return x.r ? '<input type="checkbox" data-lgi="' + i + '">'
                            : '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-lgx="' + esc(x.m.key) + '" title="Xóa dòng"><i class="fa-light fa-trash-can"></i></button>';
                    } }
                ]
            });
            Array.prototype.forEach.call(tbl.querySelectorAll('tbody tr'), function (tr, i) {
                var m = rows[i] && rows[i].m; if (m) tr.setAttribute('data-lgk', m.key);
            });
        }
        /* Giữ chữ đang gõ ở dòng tự nhập khi vẽ lại (thêm / bỏ dòng khác) */
        function docTuNhap() {
            Array.prototype.forEach.call(tbl.querySelectorAll('tr[data-lgk]'), function (tr) {
                var m = moi.filter(function (x) { return x.key === tr.getAttribute('data-lgk'); })[0];
                if (!m || !m.tuNhap) return;
                ['ma', 'ten', 'moTa', 'loai'].forEach(function (k) { var el = tr.querySelector('[data-lgf="' + k + '"]'); if (el) m[k] = el.value.trim(); });
            });
        }
        function them(list) {
            docTuNhap();
            list.forEach(function (x) { if (!moi.some(function (m) { return m.key === x.key; })) moi.push(x); });
            ve();
        }
        function load(id) {
            moi = [];
            if (!id) { saved = []; ve(); return Promise.resolve(); }
            tbl.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return ums.api.call(cfg.list(id)).then(function (r) { saved = arr(r.data); ve(); })
                .catch(function (err) { saved = []; ve(); ums.api.handle(err, 'tải ' + cfg.title.toLowerCase()); });
        }
        var curId = '';

        host.addEventListener('change', function (ev) {
            if (ev.target.getAttribute('data-lg') === 'all') Array.prototype.forEach.call(tbl.querySelectorAll('input[data-lgi]'), function (c) { c.checked = ev.target.checked; });
        });
        host.addEventListener('click', function (ev) {
            var x = ev.target.closest('[data-lgx]');
            if (x) { docTuNhap(); var k = x.getAttribute('data-lgx'); moi = moi.filter(function (m) { return m.key !== k; }); ve(); return; }
            var b = ev.target.closest('button[data-lg]');
            if (!b) return;
            var a = b.getAttribute('data-lg');
            if (a === 'sv') {
                pat.pickSinhVienNganh({
                    onPick: function (rows) {
                        them(rows.map(function (s) { return { key: s.QLSV_NGUOIHOC_ID || s.ID, id: s.QLSV_NGUOIHOC_ID || s.ID,
                            ma: e(s.QLSV_NGUOIHOC_MASO), ten: e(s.QLSV_NGUOIHOC_HODEM) + ' ' + e(s.QLSV_NGUOIHOC_TEN) }; }));
                    },
                    onGroup: cfg.onGroup
                });
            } else if (a === 'dk') {
                ks.pickDangKyHoc({ onPick: function (rows) {
                    them(rows.map(function (r) { var id = r.QLSV_NGUOIHOC_ID || r.ID;
                        return { key: id, id: id, ma: e(r.QLSV_NGUOIHOC_MASO), ten: (e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN)).trim() }; }));
                } });
            } else if (a === 'gv') {
                pat.pickNhanSu({ onPick: function (rows) {
                    them(rows.map(function (n) { return { key: n.ID, id: n.ID, ma: e(n.MASO), ten: e(n.HOTEN) }; }));
                } });
            } else if (a === 'dong') {
                them([{ key: maNgauNhien(), id: '', tuNhap: true, ma: '', ten: '', moTa: '', loai: '' }]);
                var ins = tbl.querySelectorAll('[data-lgf="ma"]'); if (ins.length) ins[ins.length - 1].focus();
            } else if (a === 'xoa') {
                var pick = Array.prototype.map.call(tbl.querySelectorAll('input[data-lgi]:checked'), function (c) { return saved[Number(c.getAttribute('data-lgi'))]; }).filter(Boolean);
                if (!pick.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
                ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá đối tượng' }).then(function (yes) {
                    if (!yes) return;
                    ui.batch(pick.map(function (r) { return cfg.remove(r.ID); }), { title: 'Đang xoá', okText: 'Xóa thành công!' }).then(function () { load(curId); });
                });
            }
        });

        ve();
        return {
            load: function (id) { curId = id || ''; return load(curId); },
            clear: function () { curId = ''; return load(''); },
            /** Gửi mọi dòng mới — trả Promise */
            save: function (idKeHoach) {
                docTuNhap();
                var calls = moi.filter(function (m) { return !m.tuNhap || m.ten || m.ma; }).map(function (m) { return cfg.save(m, idKeHoach); });
                if (!calls.length) return Promise.resolve({ ok: 0 });
                return ui.batch(calls, { title: 'Đang lưu ' + cfg.title.toLowerCase(), okText: 'Thêm thành công!' });
            }
        };
    };
})();
