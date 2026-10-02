/* =========================================================================
   Hệ số lương — quy định lương (trái) + lưới hệ số Ngạch × Bậc (phải)
   Bản gốc: ApisNhanSu/Modules/luong/script/hesoluong.js
   Hai cột như gốc: ums.pat.master. Lưới dựng bằng ums.ui.table (dòng = ngạch, cột "Bậc 1…n"
   theo bậc lớn nhất đang có); ô chỉ có ô nhập khi đã có bản ghi hệ số (như gốc — bản ghi
   sinh ra từ "Thêm mới" = khởi tạo ngạch bậc).
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       L_BangQuyDinhLuong/LayDanhSach   GET  strTuKhoa (ô tìm), strNguoiTao_Id '', 1/100000  (tên = MUCLUONGCOBAN)
       L_BangHeSoLuong/LayDanhSach      GET  strTuKhoa '', strNgach_Id '', strNhom_Id '', strLoai_Id '',
                                             strNhanSu_QuyDinhLuong_Id, strNguoiTao_Id '', 1/10000
       L_Ngach/LayDanhSach              GET  strNhanSu_QuyDinhLuong_Id, strNguoiThucHien_Id
       L_BangHeSoLuong/ThemMoi | CapNhat POST từng ô đổi: strId (CapNhat khi ID dài 32), strNhanSu_QuyDinhLuong_Id,
                                             strNgach_Id, dBac, strNhom_Id, strLoai_Id (= cột LOAI), dHeSoLuong,
                                             strGhiChu '', strNguoiThucHien_Id
       L_BangHeSoLuong/Xoa_NhanSu_BangHeSoLuong_Ngach  strNhanSu_QuyDinhLuong_Id, strNgach_Id (xoá cả dòng ngạch)
       L_BangHeSoLuong/KhoiTao_NgachBac_BangHeSoLuong  POST strId '', strNhanSu_QuyDinhLuong_Id, strNgach_Id,
                                             dSoBacToiDa, strNhom_Id, strLoai_Id, dHeSoLuong '', strGhiChu '', strNguoiThucHien_Id
   Danh mục: LUONG.NGACH (tên "MA - TEN"), LUONG.NHOMNGACH, LUONG.LOAIHESOLUONG.
   Khác gốc:
     · Nút "Tìm kiếm" gốc gọi hàm không tồn tại (getList_ThoiGianDaoTao → lỗi JS); bản mới tìm
       như phím Enter (nạp lại quy định theo từ khoá).
     · "Thêm mới" (khởi tạo ngạch bậc) gốc mở hộp thoại; bản mới là biểu mẫu thay chỗ lưới
       (luật chung: bản ghi chính không dùng hộp thoại). Lưu xong về lại lưới và nạp lại
       (gốc ở lại hộp). Gốc coi Message khác rỗng là cảnh báo dù Success — giữ.
     · Phím ←→↑↓ / Enter di chuyển giữa các ô hệ số (move_ThroughInTable) — giữ ↑↓ / Enter.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('hesoluong');
    if (!root) return;
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : (d && d.rs) || []; }
    function uid() { return (ums.session && ums.session.userId) || ''; }
    var qdId = '', qds = [], heSo = [], ngach = [];

    var m = pat.master({
        el: root,
        title: 'Hệ số lương',
        side: { title: 'Chọn quy định lương', icon: 'fa-list-check', search: 'Nhập từ khóa tìm kiếm',
            tools: '<button type="button" class="ums-iconbtn" data-a="timQD" title="Tải lại"><i class="fa-light fa-rotate-right"></i></button>' },
        main: { title: false }
    });
    m.mainBody.innerHTML =
        '<div data-z="luoi">' + pat.panel({ title: 'Chi tiết', icon: 'fa-table-cells', flush: true, zone: 'bang',
            body: ui.empty('Chọn một quy định lương ở danh sách bên trái', 'fa-hand-pointer') }) + '</div>' +
        '<div data-z="nbform" hidden>' + pat.panel({
            title: 'Thêm mới - Hệ số lương', icon: 'fa-plus',
            tools: ui.btn('close', { attr: { 'data-a': 'dongForm' } }) + ui.btn('save', { attr: { 'data-a': 'luuNB' } }),
            body: '<div class="ums-grid ums-grid--2">' +
                ui.field('Loại', '<select class="ums-select" data-scope="form" data-k="strLoai_Id" data-ph="Chọn loại"><option value=""></option></select>') +
                ui.field('Nhóm', '<select class="ums-select" data-scope="form" data-k="strNhom_Id" data-ph="Chọn nhóm"><option value=""></option></select>') +
                ui.field('Ngạch', '<select class="ums-select" data-scope="form" data-k="strNgach_Id" data-ph="Chọn ngạch"><option value=""></option></select>') +
                ui.field('Số bậc tối đa', '<input class="ums-input" data-scope="form" data-k="dSoBacToiDa" inputmode="numeric" autocomplete="off">') +
                '</div>'
        }) + '</div>';
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function k(n) { return root.querySelector('[data-k="' + n + '"]'); }

    ums.api.dm('LUONG.LOAIHESOLUONG').then(function (r) { pat.fill(k('strLoai_Id'), r, { head: 'Chọn loại' }); }).catch(function () {});
    ums.api.dm('LUONG.NHOMNGACH').then(function (r) { pat.fill(k('strNhom_Id'), r, { head: 'Chọn nhóm' }); }).catch(function () {});
    ums.api.dm('LUONG.NGACH').then(function (r) {
        pat.fill(k('strNgach_Id'), r, { head: 'Chọn ngạch', name: function (x) { return e(x.MA) + ' - ' + e(x.TEN); } });
    }).catch(function () {});

    /* ---- Cột trái: quy định lương --------------------------------------- */
    function napQD() {
        m.sideBody.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
        ums.api.call({ action: 'L_BangQuyDinhLuong/LayDanhSach', method: 'GET', strTuKhoa: m.search.value.trim(), strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 })
            .then(function (r) {
                qds = arr(r.data);
                m.sideCount.textContent = '(' + qds.length + ')';
                m.sideBody.innerHTML = qds.length ? qds.map(function (x) {
                    return pat.masterItem({ id: x.ID, text: e(x.MUCLUONGCOBAN), active: x.ID === qdId });
                }).join('') : ui.empty('Không có dữ liệu');
            })
            .catch(function (err) { m.sideBody.innerHTML = ui.fail(err.message); ums.api.handle(err, 'quy định lương'); });
    }
    /* Cột trái (BO-CUC luật 12, 2026-09-26): gõ là tự tìm sau 400ms, Enter tìm ngay; nút trên tiêu đề = Tải lại */
    var henTim = 0;
    m.search.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); clearTimeout(henTim); napQD(); } });
    m.search.addEventListener('input', function () { clearTimeout(henTim); henTim = setTimeout(napQD, 400); });

    /* ---- Lưới hệ số ------------------------------------------------------ */
    function dauKhung() {
        var qd = qds.filter(function (x) { return x.ID === qdId; })[0] || {};
        var p = z('luoi').querySelector('.ums-panel');
        p.querySelector('.ums-panel__title').innerHTML = '<i class="fa-light fa-table-cells"></i> Chi tiết <i class="ums-u-blue">' + esc(e(qd.MUCLUONGCOBAN)) + '</i>';
        p.querySelector('.ums-panel__tools').innerHTML = ui.btn('add', { attr: { 'data-a': 'them' } }) + ui.btn('save', { attr: { 'data-a': 'luu' } });
    }
    function napLuoi() {
        z('bang').innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
        ums.api.call({ action: 'L_BangHeSoLuong/LayDanhSach', method: 'GET', strTuKhoa: '', strNgach_Id: '', strNhom_Id: '', strLoai_Id: '',
            strNhanSu_QuyDinhLuong_Id: qdId, strNguoiTao_Id: '', pageIndex: 1, pageSize: 10000 })
            .then(function (r) {
                heSo = arr(r.data);
                return ums.api.call({ action: 'L_Ngach/LayDanhSach', method: 'GET', strNhanSu_QuyDinhLuong_Id: qdId, strNguoiThucHien_Id: uid() });
            })
            .then(function (r) { ngach = arr(r.data); veLuoi(); })
            .catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'bảng hệ số lương'); });
    }
    function veLuoi() {
        var soBac = 0, o = {};
        heSo.forEach(function (h) { var b = Number(h.BAC) || 0; if (b > soBac) soBac = b; o[h.NGACH_ID + '|' + b] = h; });
        var cols = [
            { title: 'Loại', prop: 'LOAI_TEN', cls: 'is-nowrap' },
            { title: 'Nhóm', prop: 'NHOM_TEN', cls: 'is-nowrap' },
            { title: 'Mã ngạch', prop: 'NGACH_MA', cls: 'is-nowrap' },
            { title: 'Tên ngạch', prop: 'NGACH_TEN', cls: 'is-nowrap' },
            { title: 'Ghi chú', prop: 'GHICHU' }
        ];
        for (var b = 1; b <= soBac; b++) {
            (function (bac) {
                cols.push({ title: 'Bậc ' + bac, cls: 'is-center', width: '84px', render: function (r) {
                    var h = o[r.NGACH_ID + '|' + bac];
                    if (!h) return '';
                    return '<input class="ums-input ums-input--sm lga-o" data-hs="' + esc(h.ID) + '" value="' + esc(e(h.HESOLUONG)) + '" title="' + esc(e(h.HESOLUONG)) + '" autocomplete="off">';
                } });
            })(b);
        }
        cols.push({ title: 'Xóa', cls: 'is-actions', width: '56px', render: function (r) { return ui.iconBtn('del', r.NGACH_ID); } });
        ui.table({ el: z('bang'), columns: cols, rows: ngach, empty: 'Chưa có ngạch nào — bấm Thêm mới để khởi tạo ngạch bậc', tableCls: 'ums-table--lined ums-table--tight' });
    }
    // ↑ ↓ Enter: sang ô cùng bậc của dòng trên / dưới
    z('bang').addEventListener('keydown', function (ev) {
        var t = ev.target;
        if (!t.hasAttribute || !t.hasAttribute('data-hs')) return;
        var d = ev.key === 'Enter' || ev.key === 'ArrowDown' ? 1 : ev.key === 'ArrowUp' ? -1 : 0;
        if (!d) return;
        ev.preventDefault();
        var td = t.closest('td'), tr = td.parentNode, i = Array.prototype.indexOf.call(tr.children, td);
        var sau = d > 0 ? tr.nextElementSibling : tr.previousElementSibling;
        while (sau) {
            var n = sau.children[i] && sau.children[i].querySelector('[data-hs]');
            if (n) { n.focus(); n.select(); return; }
            sau = d > 0 ? sau.nextElementSibling : sau.previousElementSibling;
        }
    });

    function luuLuoi() {
        var doi = Array.prototype.filter.call(z('bang').querySelectorAll('[data-hs]'), function (x) { return x.value !== (x.getAttribute('title') || ''); });
        ui.confirm('Bạn có chắc chắn muốn lưu toàn bộ hệ số lương không?', { ok: 'Lưu', title: 'Lưu hệ số lương' }).then(function (ok) {
            if (!ok) return;
            if (!doi.length) { ui.toast('Chưa có hế số mới nào cần lưu', 'warn'); return; }
            var calls = doi.map(function (x) {
                var id = x.getAttribute('data-hs');
                var h = heSo.filter(function (r) { return r.ID === id; })[0] || {};
                return {
                    action: id.length === 32 ? 'L_BangHeSoLuong/CapNhat' : 'L_BangHeSoLuong/ThemMoi',
                    strId: id.length === 32 ? id : '',
                    strNhanSu_QuyDinhLuong_Id: qdId,
                    strNgach_Id: h.NGACH_ID,
                    dBac: h.BAC,
                    strNhom_Id: h.NHOM_ID,
                    strLoai_Id: h.LOAI,
                    dHeSoLuong: x.value,
                    strGhiChu: '',
                    strNguoiThucHien_Id: uid()
                };
            });
            ui.batch(calls, { title: 'Đang lưu hệ số lương', okText: 'Thực hiện thành công' }).then(function () { napLuoi(); });
        });
    }
    function xoaNgach(ngachId) {
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (ok) {
            if (!ok) return;
            ums.api.call({ action: 'L_BangHeSoLuong/Xoa_NhanSu_BangHeSoLuong_Ngach', strNhanSu_QuyDinhLuong_Id: qdId, strNgach_Id: ngachId, strNguoiThucHien_Id: uid() })
                .then(function () { ui.toast('Xóa thành công!', 'ok'); napLuoi(); })
                .catch(function (err) { ums.api.handle(err, 'xoá ngạch'); });
        });
    }

    /* ---- Thêm mới = khởi tạo ngạch bậc ------------------------------------ */
    function moForm() {
        ['strLoai_Id', 'strNhom_Id', 'strNgach_Id', 'dSoBacToiDa'].forEach(function (n) {
            var el = k(n); el.value = ''; if (el.tagName === 'SELECT' && window.jQuery) jQuery(el).trigger('change.select2');
        });
        ui.swap(z('luoi'), z('nbform'), { top: false });
    }
    function luuNB() {
        ums.api.call({
            action: 'L_BangHeSoLuong/KhoiTao_NgachBac_BangHeSoLuong',
            strId: '',
            strNhanSu_QuyDinhLuong_Id: qdId,
            strNgach_Id: k('strNgach_Id').value,
            dSoBacToiDa: k('dSoBacToiDa').value.trim(),
            strNhom_Id: k('strNhom_Id').value,
            strLoai_Id: k('strLoai_Id').value,
            dHeSoLuong: '',
            strGhiChu: '',
            strNguoiThucHien_Id: uid()
        }).then(function (r) {
            if (r.message) { ui.toast(r.message, 'warn'); return; }
            ui.toast('Thêm mới thành công!', 'ok');
            ui.swap(z('nbform'), z('luoi'), { top: false });
            napLuoi();
        }).catch(function (err) { ums.api.handle(err, 'khởi tạo ngạch bậc'); });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a], [data-act], .ums-master__item');
        if (!b || !root.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'timQD') napQD();
        else if (a === 'them') moForm();
        else if (a === 'luu') luuLuoi();
        else if (a === 'dongForm') ui.swap(z('nbform'), z('luoi'), { top: false });
        else if (a === 'luuNB') luuNB();
        else if (b.getAttribute('data-act') === 'del') xoaNgach(b.getAttribute('data-id'));
        else if (b.classList.contains('ums-master__item') && m.sideBody.contains(b)) {
            qdId = b.getAttribute('data-id');
            Array.prototype.forEach.call(m.sideBody.querySelectorAll('.ums-master__item'), function (x) { x.classList.toggle('is-active', x === b); });
            if (!z('nbform').hidden) ui.swap(z('nbform'), z('luoi'), { top: false });
            dauKhung();
            napLuoi();
        }
    });

    napQD();
})();
