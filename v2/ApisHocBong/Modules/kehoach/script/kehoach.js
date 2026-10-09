/* =========================================================================
   Kế hoạch xét học bổng
   Bản gốc: ApisHocBong/Modules/kehoach/html/kehoach.html + script/kehoach.js (vỏ indexi)
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc — MỘT cột, các vùng thay chỗ nhau (zone-bus + toggle_overide):
       #zonebatdau    thanh lọc (Quỹ · Học kỳ · từ khoá · Tìm kiếm / Xuất báo cáo) + "Danh sách kế hoạch"
       #zoneEdit      thêm / sửa kế hoạch + cán bộ phân công + sinh viên xét duyệt   → _kh_form.js
       #zoneDieuKien  chỉnh sửa điều kiện                                             → _kh_dieukien.js
   Hai hộp: "Danh sách sinh viên xét học bổng" (#myModal) và "Danh sách sinh viên" (#myModalKetQua) — H.hopDS.
   Khung chung ba màn: _kh_chung.js (ums.hbKh); tiện ích ô đánh dấu / hỏi lại dùng ums.khxl (Xử lý học vụ).

   Lời gọi của tệp này (chép nguyên):
       HB_ThongTin/LayDSHB_KeHoach   POST  strNguoiThucHien_Id · strTuKhoa (ô từ khoá) · strDaoTao_ThoiGianDaoTao_Id
            (ô Học kỳ) · strNguoiDung_Id = userId · strNguoiTao_Id = userId · pageIndex · pageSize · strHB_QuyHocBong_Id
            (ô Quỹ) · dHieuLuc 1 (phân trang máy chủ)
       HB_KeHoach/Xoa                strIds = ID (mỗi kế hoạch đã chọn một lời gọi)
       HB_KeHoach_PhamVi/LayDanhSach GET  hộp "Đối tượng xét": strTuKhoa '' · strNguoiDung_Id '' · strHB_KeHoach_Id
            · strNguoiTao_Id '' · pageIndex · pageSize (phân trang máy chủ)
       HB_KetQua/LayDanhSach         GET  hộp "Xem kết quả": strTuKhoa '' · strHB_KeHoach_Id · strNguoiTao_Id ''
            · pageIndex 1 · pageSize 100000 (ô tìm của gốc lọc ngay trên bảng)
       Nhân sự phân công / quỹ / học kỳ: xem _kh_chung.js.
       Báo cáo: ums.report.mount (getList_MauImport "zonebtnBaoCao_KH" — gốc không có vùng _Import → ẩn Import):
            strTuKhoa '' (gốc đọc txtSearch_TuKhoa — không có) · strDaoTao_ThoiGianDaoTao_Id · strHB_QuyHocBong_Id
            · mỗi kế hoạch đã đánh dấu một cặp strHocBong_Id.
   Cột: TEN · DAOTAO_THOIGIANDAOTAO · NGAYBATDAU · NGAYKETTHUC · PHANLOAI_TEN · Nhân sự phân công xét
        · Đối tượng xét / Điều kiện áp dụng / Xem kết quả ("Chi tiết") · Sửa · ô đánh dấu.

   Cố ý bỏ: khối nút .btn-show (display:none !important trong html gốc — ba nút mở hộp trùng nút trong bảng);
   ô "Phân loại" (dropSearch_PhanLoai / dropPhanLoai không có trên màn, dòng nạp HB.PHANLOAI đã bị chú thích).
   Khác gốc:
       · Xoá kế hoạch: ums.ui.xoaChon + ums.ui.batch, xong nạp lại MỘT lần (gốc N lời gọi rồi setTimeout N×50ms).
       · Đóng biểu mẫu / vùng điều kiện thì nạp lại danh sách (toggle_form của gốc).
       · Hộp "Xem kết quả": bFilter của gốc gọi nhầm getList_KeHoachXuLy (nạp lại danh sách kế hoạch) → ô tìm
         lọc ngay trên bảng.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc, H = ums.hbKh, K = H.K;
    var root = document.getElementById('hb-kehoach');
    if (!root) return;

    root.innerHTML =
        '<div data-z="ds">' +
            pat.page('Kế hoạch xét học bổng', ui.btn('add', { attr: { 'data-a': 'them' } })) +
            pat.filterBar([
                { key: 'quy', type: 'select', label: 'Chọn quỹ học bổng' },
                { key: 'tg', type: 'select', label: 'Tất cả học kỳ' },
                { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
            ], { extra: '<div class="ums-field ums-field--fit" data-z="bc"></div>' }) +
            pat.panel({ title: 'Danh sách kế hoạch', icon: 'fa-clipboard-list-check', count: 'n', flush: true, zone: 't',
                tools: ui.xoaChon('input[data-khhb]', { goc: '.ums-panel', text: 'Xóa', attr: { 'data-a': 'xoa' } }) }) +
        '</div>' +
        '<div data-z="form" hidden></div>' +
        '<div data-z="dk" hidden></div>';

    function q(sel) { return root.querySelector(sel); }
    var zDs = q('[data-z="ds"]'), fQuy = q('[data-f="quy"]'), fTg = q('[data-f="tg"]'), fQ = q('[data-f="q"]');
    var vung = { form: q('[data-z="form"]'), dk: q('[data-z="dk"]') };
    var dangMo = null;
    ui.enhance(zDs);
    K.ganChon(zDs);

    function mo(k) { dangMo = vung[k]; ui.swap(zDs, dangMo); }
    function dong() { if (dangMo) ui.swap(dangMo, zDs); dangMo = null; load(); }

    var form = H.taoForm(vung.form, { onClose: dong, onSaved: function () { load(); }, hocKyLoc: function () { return fTg.value; } });
    var dk = H.taoDieuKien(vung.dk, { onClose: dong });

    /* ---------- Danh sách kế hoạch ----------------------------------------- */
    var page = 1, size = (ums.cfg && ums.cfg.behavior && ums.cfg.behavior.pageSize) || 10, total = 0, rows = [];

    function load(p) {
        if (p) page = p;
        var host = q('[data-z="t"]');
        K.dang(host);
        H.dsKeHoach({
            strNguoiThucHien_Id: H.uid(), strTuKhoa: (fQ.value || '').trim(),
            strDaoTao_ThoiGianDaoTao_Id: fTg.value,
            strNguoiDung_Id: H.uid(), strNguoiTao_Id: H.uid(),
            pageIndex: page, pageSize: size,
            strHB_QuyHocBong_Id: fQuy.value, dHieuLuc: 1
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
                { title: 'Điều kiện áp dụng', cls: 'is-center is-nowrap', render: function (r) { return nut('dk', r.ID); } },
                { title: 'Xem kết quả', cls: 'is-center is-nowrap', render: function (r) { return nut('ketqua', r.ID); } },
                { title: 'Sửa', cls: 'is-center is-actions', render: function (r) {
                    return '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-a="sua" data-c="hbkh:edit" data-id="' + esc(r.ID) + '" title="Sửa"><i class="fa-light fa-pen-to-square"></i></button>';
                } },
                K.cotChon('khhb')
            ]
        });
        H.napPhanCong(host, rows);
    }

    function xoa() {
        var ids = K.daChon(q('[data-z="t"]'), 'khhb');
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
        K.xoa(ids.map(function (id) { return { action: 'HB_KeHoach/Xoa', strIds: id, strNguoiThucHien_Id: '' }; }), function () { load(); });
    }

    /* #myModal — getList_QuanSoTheoLop */
    function hopDoiTuong(kh) {
        H.hopDS({
            title: 'Danh sách sinh viên xét học bổng', phanTrang: true,
            call: function (p, s) {
                return { action: 'HB_KeHoach_PhamVi/LayDanhSach', method: 'GET',
                    strTuKhoa: '', strNguoiDung_Id: '', strHB_KeHoach_Id: kh.ID, strNguoiTao_Id: '', pageIndex: p, pageSize: s };
            },
            columns: function () { return H.cotSV(); }
        });
    }
    /* #myModalKetQua — getList_NhanHocBong */
    function hopKetQua(kh) {
        H.hopDS({
            title: 'Danh sách sinh viên', tim: 'cho',
            call: function () {
                return { action: 'HB_KetQua/LayDanhSach', method: 'GET',
                    strTuKhoa: '', strHB_KeHoach_Id: kh.ID, strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 };
            },
            columns: function () { return H.cotSV().concat(H.cotXepLoai()); }
        });
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
            case 'doituong': if (r) hopDoiTuong(r); break;
            case 'ketqua': if (r) hopKetQua(r); break;
        }
    });
    fQ.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); load(1); } });

    ums.report.mount(q('[data-z="bc"]'), {
        import: false,
        collect: function (add) {
            add('strTuKhoa', '');
            add('strDaoTao_ThoiGianDaoTao_Id', fTg.value);
            add('strHB_QuyHocBong_Id', fQuy.value);
            K.daChon(q('[data-z="t"]'), 'khhb').forEach(function (id) { add('strHocBong_Id', id); });
        }
    });

    H.napHocKy([fTg], ['Tất cả học kỳ']);
    H.napQuy([fQuy]);
    load(1);
})();
