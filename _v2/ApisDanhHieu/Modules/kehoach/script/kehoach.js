/* =========================================================================
   Kế hoạch xét danh hiệu
   Bản gốc: ApisDanhHieu/Modules/kehoach/html/kehoach.html + script/kehoach.js (vỏ indexi, 2.234 dòng)
   ---------------------------------------------------------------------------
   Màn gốc chép từ Kế hoạch xét học bổng (90%) → dựng lại bằng cùng khung: ums.hbKh (Học bổng) + ums.khxl (Xử lý học vụ)
   + ums.dhKh (_dh_chung.js: bộ lời gọi HB_XepLoaiDanhHieu/*). Bố cục giữ như gốc — MỘT cột, các vùng thay chỗ nhau
   (zone-bus + toggle_overide):
       #zonebatdau    thanh lọc (Loại danh hiệu · Học kỳ · từ khoá · Tìm kiếm / Xuất báo cáo) + "Danh sách kế hoạch"
       #zoneEdit      thêm / sửa kế hoạch + cán bộ phân công + sinh viên xét duyệt   → _dh_form.js
       #zoneDieuKien  chỉnh sửa điều kiện                                             → _dh_dieukien.js
   Hai hộp: "Danh sách sinh viên xét" (#myModal — D.hopDoiTuong) và "Danh sách sinh viên" (#myModalKetQua — D.hopKetQua).

   Lời gọi của tệp này (chép nguyên):
       HB_XepLoaiDanhHieu/LayDSXLDH_KeHoach GET  strTuKhoa (ô từ khoá) · strPhanLoai_Id (ô Loại danh hiệu)
            · strDaoTao_ThoiGianDaoTao_Id (ô Học kỳ) · strNguoiThucHien_Id · pageIndex · pageSize (phân trang máy chủ)
       HB_XepLoaiDanhHieu/Xoa_XLDH_TieuChuan_AD  strIds = ID kế hoạch (mỗi kế hoạch đã chọn một lời gọi) — gốc xoá KẾ HOẠCH bằng
            action xoá TIÊU CHUẨN áp dụng (delete_KeHoachXuLy); không có action xoá kế hoạch nào khác trong kho → chép nguyên,
            ghi "cần kiểm trên host" (CAN-QUYET-DA-CHOT.md).
       Hộp "Đối tượng xét" / "Xem kết quả", nhân sự phân công, loại danh hiệu, học kỳ: xem _dh_chung.js.
       Báo cáo: ums.report.mount (getList_MauImport "zonebtnBaoCao_KH" — gốc không có vùng _Import → ẩn Import):
            strTuKhoa '' (gốc đọc txtSearch_TuKhoa — không có) · strDaoTao_ThoiGianDaoTao_Id · strPhanLoai_Id
            · mỗi kế hoạch đã đánh dấu một cặp strXLDH_KeHoach_Id.
   Cột: TEN · DAOTAO_THOIGIANDAOTAO · NGAYBATDAU · NGAYKETTHUC · PHANLOAI_TEN · Nhân sự phân công xét
        · Đối tượng xét / Điều kiện xét / Xem kết quả ("Chi tiết") · Sửa · ô đánh dấu (cột Mã bị chú thích trong html gốc).

   Khác gốc:
       · Xoá kế hoạch: ums.ui.xoaChon + ums.ui.batch, xong nạp lại MỘT lần (gốc N lời gọi rồi setTimeout N×50ms).
       · Đóng biểu mẫu / vùng điều kiện thì nạp lại danh sách (toggle_form của gốc).
       · Hộp "Xem kết quả": gốc bật bFilter nhưng tên hàm phân trang trỏ nhầm getList_KeHoachXuLy (nạp lại danh sách kế hoạch)
         → phân trang máy chủ đúng kế hoạch đang xem.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var D = ums.dhKh, H = D.H, K = D.K;
    var root = document.getElementById('dh-kehoach-kehoach');
    if (!root) return;

    root.innerHTML =
        '<div data-z="ds">' +
            pat.page('Kế hoạch xét danh hiệu', ui.btn('add', { attr: { 'data-a': 'them' } })) +
            pat.filterBar([
                { key: 'loai', type: 'select', label: 'Chọn loại danh hiệu' },
                { key: 'tg', type: 'select', label: 'Tất cả học kỳ' },
                { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
            ], { extra: '<div class="ums-field ums-field--fit" data-z="bc"></div>' }) +
            pat.panel({ title: 'Danh sách kế hoạch', icon: 'fa-clipboard-list-check', count: 'n', flush: true, zone: 't',
                tools: ui.xoaChon('input[data-khdh]', { goc: '.ums-panel', text: 'Xóa', attr: { 'data-a': 'xoa' } }) }) +
        '</div>' +
        '<div data-z="form" hidden></div>' +
        '<div data-z="dk" hidden></div>';

    function q(sel) { return root.querySelector(sel); }
    var zDs = q('[data-z="ds"]'), fLoai = q('[data-f="loai"]'), fTg = q('[data-f="tg"]'), fQ = q('[data-f="q"]');
    var vung = { form: q('[data-z="form"]'), dk: q('[data-z="dk"]') };
    var dangMo = null;
    ui.enhance(zDs);
    K.ganChon(zDs);

    function mo(k) { dangMo = vung[k]; ui.swap(zDs, dangMo); }
    function dong() { if (dangMo) ui.swap(dangMo, zDs); dangMo = null; load(); }

    var form = D.taoForm(vung.form, { onClose: dong, onSaved: function () { load(); }, hocKyLoc: function () { return fTg.value; } });
    var dk = D.taoDieuKien(vung.dk, { onClose: dong });

    /* ---------- Danh sách kế hoạch ----------------------------------------- */
    var page = 1, size = (ums.cfg && ums.cfg.behavior && ums.cfg.behavior.pageSize) || 10, total = 0, rows = [];

    function load(p) {
        if (p) page = p;
        var host = q('[data-z="t"]');
        K.dang(host);
        D.dsKeHoach({
            strTuKhoa: (fQ.value || '').trim(), strPhanLoai_Id: fLoai.value, strDaoTao_ThoiGianDaoTao_Id: fTg.value,
            strNguoiThucHien_Id: H.uid(), pageIndex: page, pageSize: size
        }).then(function (r) {
            rows = K.ds(r);
            total = Number(r.pager) || rows.length;
            ve();
        }).catch(function (err) { K.loi(host, err, 'danh sách kế hoạch'); });
    }

    function nut(a, id) {
        return ui.btn('view', { text: 'Chi tiết', icon: 'fa-eye', cls: 'ums-btn--sm', attr: { 'data-a': a, 'data-id': id } });
    }

    function ve() {
        q('[data-z="n"]').textContent = '(' + total + ')';
        var host = q('[data-z="t"]');
        ui.table({
            el: host, rows: rows, stt: true, empty: 'Chưa có kế hoạch',
            page: {
                index: page, size: size, total: total,
                onChange: function (p) { if (p >= 1 && p <= Math.ceil(total / size)) load(p); },
                onSize: function (v) { size = v === 'all' ? ui.PAGE_ALL : Number(v); load(1); }
            },
            columns: [
                { title: 'Tên', prop: 'TEN', cls: 'hbkh-ten' },
                { title: 'Học kỳ', prop: 'DAOTAO_THOIGIANDAOTAO', cls: 'is-nowrap' },
                { title: 'Từ ngày', prop: 'NGAYBATDAU', cls: 'is-center is-nowrap' },
                { title: 'Đến ngày', prop: 'NGAYKETTHUC', cls: 'is-center is-nowrap' },
                { title: 'Phân loại', prop: 'PHANLOAI_TEN', cls: 'is-center' },
                H.cotPhanCong(),
                { title: 'Đối tượng xét', cls: 'is-center is-nowrap', render: function (r) { return nut('doituong', r.ID); } },
                { title: 'Điều kiện xét', cls: 'is-center is-nowrap', render: function (r) { return nut('dk', r.ID); } },
                { title: 'Xem kết quả', cls: 'is-center is-nowrap', render: function (r) { return nut('ketqua', r.ID); } },
                { title: 'Sửa', cls: 'is-center is-actions', render: function (r) {
                    return '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-a="sua" data-c="dhkh:edit" data-id="' + esc(r.ID) + '" title="Sửa"><i class="fa-light fa-pen-to-square"></i></button>';
                } },
                K.cotChon('khdh')
            ]
        });
        D.napPhanCong(host, rows);
    }

    function xoa() {
        var ids = K.daChon(q('[data-z="t"]'), 'khdh');
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
        K.xoa(ids.map(function (id) { return { action: D.XL + 'Xoa_XLDH_TieuChuan_AD', strIds: id, strNguoiThucHien_Id: '' }; }), function () { load(); });
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
            case 'doituong': if (r) D.hopDoiTuong(r); break;
            case 'ketqua': if (r) D.hopKetQua(r, { title: 'Danh sách sinh viên' }); break;
        }
    });
    fQ.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); load(1); } });

    ums.report.mount(q('[data-z="bc"]'), {
        import: false,
        collect: function (add) {
            add('strTuKhoa', '');
            add('strDaoTao_ThoiGianDaoTao_Id', fTg.value);
            add('strPhanLoai_Id', fLoai.value);
            K.daChon(q('[data-z="t"]'), 'khdh').forEach(function (id) { add('strXLDH_KeHoach_Id', id); });
        }
    });

    H.napHocKy([fTg], ['Tất cả học kỳ']);
    D.napLoai([fLoai]);
    load(1);
})();
