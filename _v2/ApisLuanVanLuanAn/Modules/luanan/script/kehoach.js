/* =========================================================================
   Kế hoạch chuyên đề (luanan/kehoach)
   Bản gốc: ApisLuanVanLuanAn/Modules/luanan/html/kehoach.html (193 dòng) + script/kehoach.js (973 dòng)
   Giống luanvan/kehoach 96%: cùng bố cục một cột (thanh lọc → "Danh sách kế hoạch" → biểu mẫu Thông tin kế hoạch · Khóa áp dụng
   · Danh sách nhân sự). Khác ở tên action / tham số (ChuyenDe thay DeCuong). Khung nhân sự dùng ums.lvla.luoiNguoi (_lv_chung.js).
   Lời gọi (chép nguyên, strNguoiThucHien_Id / strChucNang_Id hệ tự chèn):
       LVLA_KeHoach_ChuyenDe/LayDanhSach GET strTuKhoa · pageIndex · pageSize (phân trang máy chủ)
       LVLA_KeHoach_ChuyenDe/ThemMoi | CapNhat POST strId · strTen · strMoTa · strNgayBatDau · strNgayKetThuc
       LVLA_KeHoach_ChuyenDe_NhanSu/LayDanhSach GET strTuKhoa '' · strNguoiDung_Id '' · strLVLA_KeHoach_ChuyenDe_Id · pageIndex 1 · pageSize 100000
            (cột NGUOIDUNG_ID · NGUOIDUNG_TENDAYDU · NGUOIDUNG_TAIKHOAN)
       LVLA_KeHoach_ChuyenDe_NhanSu/ThemMoi POST strId '' · strNguoiDung_Id · strLVLA_KeHoach_ChuyenDe_Id — chỉ dòng MỚI;  Xoa strIds
       LVLA_KeHoach_DeCuong_Khoa/LayDanhSach GET strTuKhoa '' · strDaoTao_KhoaDaoTao_Id '' · strLVLA_KeHoach_DeCuong_Id · pageIndex 1 · pageSize 10000
            (cột DAOTAO_HEDAOTAO_ID · DAOTAO_KHOADAOTAO_ID)
       LVLA_KeHoach_DeCuong_Khoa/ThemMoi POST strId '' · strDaoTao_HeDaoTao_Id · strDaoTao_KhoaDaoTao_Id · strLVLA_KeHoach_DeCuong_Id;  Xoa strIds
            — CHÉP NGUYÊN: gốc luanan gọi bộ Khóa của kế hoạch ĐỀ CƯƠNG (không có _ChuyenDe_Khoa) và gửi ID kế hoạch chuyên đề vào đó.
       Hệ / Khóa: ums.ref.heDaoTao / khoaDaoTao (cùng danh mục KHCT_HeDaoTao / KHCT_KhoaDaoTao)
   Cố ý bỏ: nút Xoá kế hoạch (btnDelete display:none) và delete_KeHoach; ảnh minh hoạ img-edu-02.png bên phải biểu mẫu; mã chết (txtAAAA, dropAAAA, btnYes ...).
   Khác gốc:
       · Dòng "Khóa áp dụng" đã lưu hiện khoá (gốc cho đổi nhưng không bao giờ lưu lại thay đổi); muốn đổi thì xoá rồi thêm dòng mới.
       · Hệ → Khóa: chưa chọn Hệ thì khoá ô Khóa, đổi Hệ thì xoá Khóa (luật cha → con).
       · Tên kế hoạch bắt buộc (gốc gửi thẳng); Lưu xong lưu các dòng con bằng ID máy chủ trả rồi đóng biểu mẫu về danh sách.
       · Gốc luôn dựng sẵn 1 dòng Hệ-Khóa trống khi thêm mới — giữ.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, L = ums.lvla, e = L.e, esc = L.esc;
    var P = 'LVLA_KeHoach_ChuyenDe/', K = 'LVLA_KeHoach_DeCuong_Khoa/';
    var root = document.getElementById('lvla-luanan-kehoach');
    if (!root) return;

    var page = 1, size = (ums.cfg && ums.cfg.behavior && ums.cfg.behavior.pageSize) || 10, total = 0, rows = [], cur = null;
    root.innerHTML =
        pat.page('Kế hoạch', ui.btn('add', { attr: { 'data-a': 'them' } })) +
        pat.filterBar([{ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }], { search: false }) +
        pat.panel({ title: 'Danh sách kế hoạch', icon: 'fa-list-ul', count: 'n', flush: true, zone: 't', tools: ui.btn('reload', { attr: { 'data-a': 'tai' } }) });
    function q(s) { return root.querySelector(s); }
    var fQ = q('[data-f="q"]');
    ui.enhance(root);

    function load(p) {
        if (p) page = p;
        var host = q('[data-z="t"]');
        L.dang(host);
        ums.api.call({ action: P + 'LayDanhSach', method: 'GET', strTuKhoa: (fQ.value || '').trim(), pageIndex: page, pageSize: size })
            .then(function (r) { rows = L.arr(r.data); total = Number(r.pager) || rows.length; ve(); })
            .catch(function (err) { L.loi(host, err, 'danh sách kế hoạch'); });
    }
    function ve() {
        q('[data-z="n"]').textContent = '(' + total + ')';
        ui.table({ el: q('[data-z="t"]'), rows: rows, empty: 'Chưa có kế hoạch',
            page: { index: page, size: size, total: total,
                onChange: function (p) { if (p >= 1 && p <= Math.ceil(total / size)) load(p); },
                onSize: function (v) { size = v === 'all' ? ui.PAGE_ALL : Number(v); load(1); } },
            columns: [
                { title: 'Tên kế hoạch', prop: 'TEN' },
                { title: 'Ngày bắt đầu', prop: 'NGAYBATDAU', cls: 'is-center is-nowrap', width: '120px' },
                { title: 'Ngày kết thúc', prop: 'NGAYKETTHUC', cls: 'is-center is-nowrap', width: '120px' },
                { title: 'Chi tiết', cls: 'is-center is-actions', width: '80px', render: function (r) {
                    return '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-a="sua" data-id="' + esc(r.ID) + '" title="Sửa"><i class="fa-light fa-pen-to-square"></i></button>';
                } }
            ] });
    }

    /* ---------- lưới Hệ × Khóa áp dụng ---------------------------------------- */
    function luoiHeKhoa(host) {
        var items = [], he = [], tam = 0, big = { pageIndex: 1, pageSize: 10000000 };
        host.innerHTML = pat.panel({ title: 'Khóa áp dụng', icon: 'fa-graduation-cap', flush: true, zone: 't',
            tools: ui.btn('add', { text: 'Thêm dòng mới', mod: 'out-success', attr: { 'data-hk': 'them' } }) }) +
            '<div class="ums-u-fz13 ums-u-muted ums-u-mt-2">Chú ý: Phải chọn đầy đủ hệ, khóa</div>';
        var heP = ums.ref.heDaoTao({ pageIndex: 1, pageSize: 1000000 }).then(function (r) { he = r; }, function () { he = []; });
        function z() { return host.querySelector('[data-z="t"]'); }
        function opt(list, nm, v, ph) {
            return '<option value="">' + esc(ph) + '</option>' + list.map(function (o) {
                return '<option value="' + esc(o.ID) + '"' + (String(o.ID) === String(v) ? ' selected' : '') + '>' + esc(typeof nm === 'function' ? nm(o) : o[nm]) + '</option>';
            }).join('');
        }
        function keo() { host.querySelectorAll('select[data-hk]').forEach(function (s) { var r = items[Number(s.getAttribute('data-i'))]; if (r) r[s.getAttribute('data-hk')] = s.value; }); }
        function ve() {
            ui.table({ el: z(), rows: items, empty: 'Chưa có dòng nào', columns: [
                { title: 'Hệ đào tạo', render: function (r, i) {
                    return '<select class="ums-select ums-input--sm" data-hk="he" data-i="' + i + '"' + (r.moi ? '' : ' disabled') + '>' + opt(he, 'TENHEDAOTAO', r.he, 'Chọn hệ đào tạo') + '</select>'; } },
                { title: 'Khóa học', render: function (r, i) {
                    return '<select class="ums-select ums-input--sm" data-hk="khoa" data-i="' + i + '"' + (r.moi && r.he ? '' : ' disabled') + '>' +
                        opt(r.ds || [], function (o) { return o.TENKHOA || o.MAKHOA || o.TEN; }, r.khoa, 'Chọn khóa học') + '</select>'; } },
                { title: 'Xóa', cls: 'is-center is-actions', width: '70px', render: function (r, i) {
                    return '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-hk="xoa" data-i="' + i + '" title="Xoá"><i class="fa-light fa-trash-can"></i></button>'; } }
            ] });
        }
        function napKhoa(r) {
            if (!r.he) { r.ds = []; return Promise.resolve(); }
            return ums.ref.khoaDaoTao(Object.assign({ strHeDaoTao_Id: r.he }, big)).then(function (d) { r.ds = d; }, function () { r.ds = []; });
        }
        host.addEventListener('change', function (ev) {
            var s = ev.target.closest && ev.target.closest('select[data-hk="he"]');
            if (!s) return;
            keo();
            var r = items[Number(s.getAttribute('data-i'))];
            r.khoa = ''; napKhoa(r).then(ve);
        });
        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-hk]');
            if (!b || b.tagName === 'SELECT') return;
            var k = b.getAttribute('data-hk');
            if (k === 'them') { keo(); items.push({ ID: '', he: '', khoa: '', ds: [], moi: true, _t: ++tam }); ve(); return; }
            if (k === 'xoa') {
                keo();
                var i = Number(b.getAttribute('data-i')), r = items[i];
                if (!r) return;
                if (r.moi) { items.splice(i, 1); ve(); return; }
                ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá khóa áp dụng' }).then(function (yes) {
                    if (!yes) return;
                    ums.api.call({ action: K + 'Xoa', strIds: r.ID }).then(function () { ui.toast('Xóa thành công!', 'ok'); if (cur) tai(cur.ID); })
                        .catch(function (err) { ums.api.handle(err, 'xoá khóa áp dụng'); });
                });
            }
        });
        function tai(khId) {
            if (!khId) { items = []; items.push({ ID: '', he: '', khoa: '', ds: [], moi: true }); ve(); return Promise.resolve(); }
            L.dang(z());
            return Promise.all([ums.api.call({ action: K + 'LayDanhSach', method: 'GET', strTuKhoa: '', strDaoTao_KhoaDaoTao_Id: '',
                strLVLA_KeHoach_DeCuong_Id: khId, pageIndex: 1, pageSize: 10000 }), heP]).then(function (x) {
                items = L.arr(x[0].data).map(function (r) { return { ID: r.ID, he: e(r.DAOTAO_HEDAOTAO_ID), khoa: e(r.DAOTAO_KHOADAOTAO_ID), ds: [] }; });
                return Promise.all(items.map(napKhoa));
            }).then(ve).catch(function (err) { L.loi(z(), err, 'khóa áp dụng'); });
        }
        ve();
        heP.then(ve);
        return {
            load: tai,
            save: function (khId) {
                keo();
                var calls = items.filter(function (r) { return r.moi && r.he && r.khoa; }).map(function (r) {
                    return { action: K + 'ThemMoi', method: 'POST', strId: '', strDaoTao_HeDaoTao_Id: r.he, strDaoTao_KhoaDaoTao_Id: r.khoa, strLVLA_KeHoach_DeCuong_Id: khId };
                });
                return calls.length ? ui.batch(calls, { title: 'Đang lưu khóa áp dụng', okText: 'Lưu khóa áp dụng' }) : Promise.resolve();
            }
        };
    }

    /* ---------- biểu mẫu ------------------------------------------------------- */
    function moForm(row) {
        cur = row || null;
        var body = document.createElement('div');
        body.innerHTML =
            '<div class="ums-legend">Thông tin kế hoạch</div>' +
            ui.field('Tên kế hoạch', L.inp('ten'), { required: true }) +
            '<div class="ums-grid ums-grid--2">' + ui.field('Ngày bắt đầu', L.inp('tu', true)) + ui.field('Ngày kết thúc', L.inp('den', true)) + '</div>' +
            ui.field('Mô tả', '<textarea class="ums-input" data-k="mota" data-scope="form" rows="3"></textarea>') +
            '<div class="ums-u-mt-4" data-b="hk"></div><div class="ums-u-mt-4" data-b="ns"></div>';
        var api = pat.formTrang({ host: root, title: (row ? 'Chỉnh sửa' : 'Thêm mới') + ' - Kế hoạch', icon: row ? 'fa-pen-to-square' : 'fa-plus', cols: 1, body: body,
            buttons: [{ text: 'Lưu', kind: 'save', keepOpen: true, onClick: function () { luu(); return false; } }],
            onClose: function () { cur = null; load(); } });
        function k(x) { return body.querySelector('[data-k="' + x + '"]'); }
        var hk = luoiHeKhoa(body.querySelector('[data-b="hk"]'));
        var N = P.slice(0, -1) + '_NhanSu/';
        var ns = L.luoiNguoi(body.querySelector('[data-b="ns"]'), {
            title: 'Danh sách nhân sự', icon: 'fa-user-tie', nhanSu: true, cotMa: true, chiLuuMoi: true, xoa: N + 'Xoa',
            list: function (r) { return { action: N + 'LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiDung_Id: '', strLVLA_KeHoach_ChuyenDe_Id: r.ID, pageIndex: 1, pageSize: 100000 }; },
            map: function (r) { return { ID: r.ID, pid: r.NGUOIDUNG_ID, ten: r.NGUOIDUNG_TENDAYDU, ma: r.NGUOIDUNG_TAIKHOAN }; },
            save: function (rec, cha) { return { action: N + 'ThemMoi', method: 'POST', strId: '', strNguoiDung_Id: rec.pid, strLVLA_KeHoach_ChuyenDe_Id: cha }; }
        });
        ui.enhance(body);
        if (row) {
            L.dat(k('ten'), row.TEN); L.dat(k('mota'), row.MOTA); L.dat(k('tu'), row.NGAYBATDAU); L.dat(k('den'), row.NGAYKETTHUC);
            hk.load(row.ID); ns.load(row);
        } else { hk.load(''); ns.clear(); }
        function luu() {
            if (!k('ten').value.trim()) { ui.toast('Vui lòng nhập tên kế hoạch', 'warn'); return; }
            var id = cur ? e(cur.ID) : '';
            ums.api.call({ action: P + (id ? 'CapNhat' : 'ThemMoi'), method: 'POST', strId: id, strTen: k('ten').value, strMoTa: k('mota').value,
                strNgayBatDau: k('tu').value, strNgayKetThuc: k('den').value }).then(function (r) {
                ui.toast(id ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok');
                var nid = id || (r.raw && r.raw.Id) || '';
                load();
                if (!nid) return;
                cur = { ID: nid };
                Promise.all([hk.save(nid), ns.save(nid)]).then(function () { api.close(); });
            }).catch(function (err) { ums.api.handle(err, 'lưu kế hoạch'); });
        }
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b) || b.closest('.ums-formtrang')) return;
        var a = b.getAttribute('data-a');
        if (a === 'them') moForm(null);
        else if (a === 'tai') load(1);
        else if (a === 'sua') { var r = rows.filter(function (x) { return String(x.ID) === b.getAttribute('data-id'); })[0]; if (r) moForm(r); }
    });
    var tm = null;
    fQ.addEventListener('input', function () { clearTimeout(tm); tm = setTimeout(function () { load(1); }, 400); });
    fQ.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); clearTimeout(tm); load(1); } });
    load(1);
})();
