/* =========================================================================
   Kế hoạch xử lý học vụ
   Bản gốc: ApisXuLyHocVu/Modules/kehoachxuly/html/kehoachxuly.html
            + script/kehoachxuly.js (vỏ indexi)
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc — MỘT cột, các vùng thay chỗ nhau (zone-bus + toggle_overide):
       #zonebatdau   thanh lọc + "Danh sách kế hoạch"              → vùng "ds"   (tệp này)
       #zoneEdit     thêm / sửa kế hoạch + cán bộ + sinh viên      → vùng "form" (_khxl_form.js)
       #zonedieukien thiết lập điều kiện (2 bảng, 2 hộp)           → vùng "dk"   (_khxl_dieukien.js)
       #zoneketqua   kết quả xử lý                                  → vùng "kq"   (_khxl_ketqua.js)
       #zoneDSXet    danh sách xét                                  → vùng "xet"  (_khxl_ketqua.js)
   Tiện ích chung của màn: _khxl_chung.js (ums.khxl). Hộp chọn người dùng: nạp CHÍNH
   ApisDangKyHoc/Modules/thilai/script/_chung.js (ums.tlKh.pickNguoiDung) + css kehoach.css (ảnh tròn).

   Lời gọi của tệp này (chép nguyên):
       XLHV_KeHoachXuLy/LayDanhSach   GET  strTuKhoa · strDaoTao_ThoiGianDaoTao_Id (ô Học kỳ)
                                           · strNguoiTao_Id = userId · pageIndex · pageSize (phân trang máy chủ)
       XLHV_KeHoachXuLy/Xoa           strIds = ID (mỗi kế hoạch đã chọn một lời gọi)
       pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao (edu.system.getList_ThoiGianDaoTao — ô Học kỳ)
       Báo cáo: ums.report.mount (getList_MauImport "zonebtnBaoCao_KHXY" — gốc có cả vùng _Import):
           strDaoTao_ThoiGianDaoTao_Id = ô Học kỳ, mỗi kế hoạch đã đánh dấu một cặp strXLHV_KeHoachXuLy_Id.
   Cột: MA · TEN · DAOTAO_THOIGIANDAOTAO_KY · LOAIXULY_TEN · TUNGAY · DENNGAY · KETQUACHINHTHUC (1 → Có)
        · SOLUONG (nút mở "Danh sách xét") · "Thiết lập" · "Kết quả" · sửa · ô đánh dấu.

   Cố ý bỏ (mã chết của gốc): vùng #zoneDSNhanSu + nút .btnDSNhanSu (cột "Phân công" bị chú thích bỏ,
   vùng không có lối vào; bảng #tblPhanCong trong đó trùng id với bảng của biểu mẫu).
   Khác gốc:
       · Xoá kế hoạch: ums.ui.xoaChon + ums.ui.batch, xong nạp lại MỘT lần (gốc bắn N lời gọi rồi
         setTimeout N×50ms mới nạp lại — dễ nạp trước khi xoá xong).
       · Đóng biểu mẫu / vùng con thì nạp lại danh sách (như toggle_form của gốc).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc, K = ums.khxl;
    var root = document.getElementById('kehoachxuly');
    if (!root) return;
    var e = K.e;

    root.innerHTML =
        '<div data-z="ds">' +
            pat.page('Kế hoạch xử lý học vụ', ui.btn('add', { attr: { 'data-a': 'them' } })) +
            pat.filterBar([
                { key: 'tg', type: 'select', label: 'Tất cả học kỳ' },
                { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
            ], { extra: '<div class="ums-field ums-field--fit" data-z="bc"></div>' }) +
            pat.panel({ title: 'Danh sách kế hoạch', icon: 'fa-clipboard-list-check', count: 'n', flush: true, zone: 't',
                tools: ui.xoaChon('input[data-kh]', { goc: '.ums-panel', text: 'Xóa', attr: { 'data-a': 'xoa' } }) }) +
        '</div>' +
        '<div data-z="form" hidden></div>' +
        '<div data-z="dk" hidden></div>' +
        '<div data-z="kq" hidden></div>' +
        '<div data-z="xet" hidden></div>';

    function q(sel) { return root.querySelector(sel); }
    var zDs = q('[data-z="ds"]'), fTg = q('[data-f="tg"]'), fQ = q('[data-f="q"]');
    var vung = { form: q('[data-z="form"]'), dk: q('[data-z="dk"]'), kq: q('[data-z="kq"]'), xet: q('[data-z="xet"]') };
    var dangMo = null;
    ui.enhance(zDs);
    K.ganChon(zDs);

    function mo(k) { dangMo = vung[k]; ui.swap(zDs, dangMo); }
    function dong() { if (dangMo) ui.swap(dangMo, zDs); dangMo = null; load(); }

    var form = K.taoForm(vung.form, { onClose: dong, onSaved: function () { load(); } });
    var dk = K.taoDieuKien(vung.dk, { onClose: dong });
    var kq = K.taoKetQua(vung.kq, { onClose: dong });
    var xet = K.taoDSXet(vung.xet, { onClose: dong });

    /* ---------- Danh sách kế hoạch ----------------------------------------- */
    var page = 1, size = (ums.cfg && ums.cfg.behavior && ums.cfg.behavior.pageSize) || 10, total = 0, rows = [];

    function load(p) {
        if (p) page = p;
        var host = q('[data-z="t"]');
        K.dang(host);
        ums.api.call({
            action: 'XLHV_KeHoachXuLy/LayDanhSach', method: 'GET',
            strTuKhoa: (fQ.value || '').trim(),
            strChucNang_Id: '',
            strDaoTao_ThoiGianDaoTao_Id: fTg.value,
            strNguoiTao_Id: ums.session.userId,
            pageIndex: page, pageSize: size
        }).then(function (r) {
            rows = K.ds(r);
            total = Number(r.pager) || rows.length;
            ve();
        }).catch(function (err) { K.loi(host, err, 'danh sách kế hoạch xử lý'); });
    }

    function nut(kind, text, a, id, icon) {
        return ui.btn(kind, { text: text, mod: 'out-primary', icon: icon, cls: 'ums-btn--sm', attr: { 'data-a': a, 'data-id': id } });
    }

    function ve() {
        var n = q('[data-z="n"]');
        if (n) n.textContent = '(' + total + ')';
        ui.table({
            el: q('[data-z="t"]'), rows: rows, empty: 'Chưa có kế hoạch xử lý',
            page: {
                index: page, size: size, total: total,
                onChange: function (p) { if (p >= 1 && p <= Math.ceil(total / size)) load(p); },
                onSize: function (v) { size = v === 'all' ? ui.PAGE_ALL : Number(v); load(1); }
            },
            columns: [
                { title: 'Mã', prop: 'MA', cls: 'is-nowrap' },
                { title: 'Tên', prop: 'TEN', cls: 'khxl-ten' },
                { title: 'Học kỳ', prop: 'DAOTAO_THOIGIANDAOTAO_KY', cls: 'is-center is-nowrap' },
                { title: 'Loại', prop: 'LOAIXULY_TEN', cls: 'khxl-loai' },
                { title: 'Từ ngày', prop: 'TUNGAY', cls: 'is-center is-nowrap' },
                { title: 'Đến ngày', prop: 'DENNGAY', cls: 'is-center is-nowrap' },
                { title: 'Dùng làm kết quả chính', cls: 'is-center', render: function (r) {
                    return String(r.KETQUACHINHTHUC) === '1' ? ui.badge('Có', 'ok') : ui.badge('Không', 'mute');
                } },
                { title: 'Số lượng học viên xử lý', cls: 'is-center is-nowrap', render: function (r) {
                    return nut('view', String(e(r.SOLUONG)), 'xet', r.ID);
                } },
                { title: 'Điều kiện áp dụng', cls: 'is-center is-nowrap', render: function (r) { return nut('search', 'Thiết lập', 'dk', r.ID, 'fa-sliders'); } },
                { title: 'Kết quả xét', cls: 'is-center is-nowrap', render: function (r) { return nut('view', 'Kết quả', 'kq', r.ID); } },
                { title: 'Sửa', cls: 'is-center is-actions', render: function (r) {
                    return '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-a="sua" data-c="khxl:edit" data-id="' + esc(r.ID) + '" title="Sửa"><i class="fa-light fa-pen-to-square"></i></button>';
                } },
                K.cotChon('kh')
            ]
        });
    }

    function xoa() {
        var ids = K.daChon(q('[data-z="t"]'), 'kh');
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
        K.xoa(ids.map(function (id) {
            return { action: 'XLHV_KeHoachXuLy/Xoa', strIds: id, strNguoiThucHien_Id: '' };
        }), function () { load(); });
    }

    /* ---------- Sự kiện ----------------------------------------------------- */
    zDs.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !zDs.contains(b) || b.disabled) return;
        var id = b.getAttribute('data-id'), r = id ? K.tim(rows, id) : null;
        switch (b.getAttribute('data-a')) {
            case 'search': load(1); break;
            case 'them': form.moThem(); mo('form'); break;
            case 'xoa': xoa(); break;
            case 'sua': if (r) { form.moSua(r); mo('form'); } else ui.toast('Vui lòng chọn đối tượng!', 'warn'); break;
            case 'dk': if (r) { dk.mo(r); mo('dk'); } break;
            case 'kq': if (r) { kq.mo(r); mo('kq'); } break;
            case 'xet': if (r) { xet.mo(r); mo('xet'); } break;
        }
    });
    fQ.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); load(1); } });

    ums.report.mount(q('[data-z="bc"]'), {
        collect: function (add) {
            add('strDaoTao_ThoiGianDaoTao_Id', fTg.value);
            K.daChon(q('[data-z="t"]'), 'kh').forEach(function (id) { add('strXLHV_KeHoachXuLy_Id', id); });
        }
    });

    ums.ref.thoiGianDaoTao({ strNam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 })
        .then(function (ds) { pat.fill(fTg, ds, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Tất cả học kỳ' }); })
        .catch(function (err) { ums.api.handle(err, 'học kỳ'); });

    load(1);
})();
