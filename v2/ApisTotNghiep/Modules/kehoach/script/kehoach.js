/* =========================================================================
   Kế hoạch xét tốt nghiệp
   Bản gốc: ApisTotNghiep/Modules/kehoach/html/kehoach.html + script/kehoach.js (vỏ indexi)
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc — MỘT cột, các vùng thay chỗ nhau (zone-bus + toggle_overide):
       #zonebatdau          thanh lọc (Phân loại · Học kỳ · từ khoá · Tìm kiếm) + "Danh sách kế hoạch"
       #zoneEdit            thêm / sửa kế hoạch + học phần + cán bộ phân công + sinh viên xét duyệt → _tnkh_form.js
       #zoneKeThua          "Điều kiện xét" (hai tab)                                             → _tnkh_dieukien.js
       #zoneChuanBiDuLieu   "Chuẩn bị dữ liệu" (hai tab)                                          → _tnkh_dieukien.js
   Hộp: "Danh sách sinh viên xét tốt nghiệp" (#myModal — ums.hbKh.hopDS của Học bổng, cột người học y hệt) và
   "Xác nhận" khoá - mở dữ liệu (#modal_XacNhan — ums.tnKh.xacNhan).
   Nạp chéo: ums.khxl (Xử lý học vụ — ô đánh dấu, hỏi lại rồi chạy hàng loạt), ums.hbKh (Học bổng — hopDS, cotSV),
   kiểu .nd-xn của Cổng cán bộ nhapdiem.css (hộp nút xác nhận lớn).

   Lời gọi của tệp này (chép nguyên):
       TN_ThongTin/LayDSTN_KeHoach  GET  strTuKhoa (ô từ khoá) · strPhanLoai_Id (ô Phân loại) · strDaoTao_ThoiGianDaoTao_Id
            (ô Học kỳ) · strNguoiDung_Id '' · strNguoiTao_Id '' (gốc đọc dropAAAA) · pageIndex · pageSize (phân trang máy chủ)
       TN_KeHoach/Xoa                strIds = ID (mỗi kế hoạch đã chọn một lời gọi)
       TN_KeHoach_NhanSu/LayDanhSach GET  cột "Nhân sự phân công xét": mỗi kế hoạch một lời gọi — strTuKhoa '' · strNguoiDung_Id ''
            · strTN_KeHoach_Id · strNguoiTao_Id '' · pageIndex 1 · pageSize 100000; tên = NGUOICUOI_TENDAYDU nối ", ".
       TN_KeHoach_PhamVi/LayDanhSach GET  hộp "Đối tượng xét": strTuKhoa '' · strNguoiDung_Id '' · strTN_KeHoach_Id
            · strNguoiTao_Id '' · pageIndex · pageSize (phân trang máy chủ)
       Phân loại: TN_Chung/LayDSPhanLoaiTheoNguoiDung (_tnkh_form.js) · Học kỳ: edu.system.getList_ThoiGianDaoTao.
   Cột: TEN · DAOTAO_THOIGIANDAOTAO · NGAYBATDAU · NGAYKETTHUC · PHANLOAI_TEN · Nhân sự phân công xét · Đối tượng xét
        ("Chi tiết") · Điều kiện xét · Xác nhận khóa - mở dữ liệu (TINHTRANG_KHOA_TEN, trống thì "Chi tiết") · Chuẩn bị
        dữ liệu ("Xem") · NGAYTAO_DD_MM_YYYY_HHMMSS · NGUOICUOI_TAIKHOAN · Sửa · ô đánh dấu.

   Lỗi gốc đã sửa: cột "Nhân sự phân công xét" — gốc ghi vào #DSPhanCong (không kèm ID kế hoạch, không phần tử nào mang
   id đó) nên cột luôn là một nút trống; ở đây hiện tên đúng dòng (ý định của gốc, như bản Học bổng).
   Cố ý bỏ: getList_KeHoachXuLy2 (không ai gọi); cbGenCombo_KeHoachXuLy sau khi nạp danh sách (đổ kế hoạch vào ô "Chọn
   nhóm" của hộp kế thừa — hộp mở ra là nạp lại bằng LayDSTN_PhamVi_ApDung nên bị ghi đè ngay); khối JOB_TUDONG (đã chú thích).
   Khác gốc: nút "Thêm mới" lên đầu trang (luật bố cục 5), "Xóa" là ums.ui.xoaChon ở đầu khung danh sách; xoá chạy
   ums.ui.batch rồi nạp lại MỘT lần (gốc N lời gọi + setTimeout N×50ms); đóng vùng nào cũng nạp lại danh sách (toggle_form).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc, T = ums.tnKh, K = T.K, e = T.e, H = ums.hbKh;
    var root = document.getElementById('tn-kehoach');
    if (!root) return;

    root.innerHTML =
        '<div data-z="ds">' +
            pat.page('Kế hoạch xét tốt nghiệp', ui.btn('add', { attr: { 'data-a': 'them' } })) +
            pat.filterBar([
                { key: 'pl', type: 'select', label: 'Chọn phân loại' },
                { key: 'tg', type: 'select', label: 'Tất cả học kỳ' },
                { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
            ]) +
            pat.panel({ title: 'Danh sách kế hoạch', icon: 'fa-file-certificate', count: 'n', flush: true, zone: 't',
                tools: ui.xoaChon('input[data-tnkh]', { goc: '.ums-panel', text: 'Xóa', attr: { 'data-a': 'xoa' } }) }) +
        '</div>' +
        '<div data-z="form" hidden></div>' +
        '<div data-z="dk" hidden></div>' +
        '<div data-z="cb" hidden></div>';

    function q(sel) { return root.querySelector(sel); }
    var zDs = q('[data-z="ds"]'), fPl = q('[data-f="pl"]'), fTg = q('[data-f="tg"]'), fQ = q('[data-f="q"]');
    var vung = { form: q('[data-z="form"]'), dk: q('[data-z="dk"]'), cb: q('[data-z="cb"]') };
    var dangMo = null;
    ui.enhance(zDs);
    K.ganChon(zDs);

    function mo(k) { dangMo = vung[k]; ui.swap(zDs, dangMo); }
    function dong() { if (dangMo) ui.swap(dangMo, zDs); dangMo = null; load(); }

    var form = T.taoForm(vung.form, { onClose: dong, onSaved: function () { load(); },
        hocKyLoc: function () { return fTg.value; }, phanLoaiLoc: function () { return fPl.value; } });
    var dk = T.taoDieuKien(vung.dk, { onClose: dong });
    var cb = T.taoChuanBi(vung.cb, { onClose: dong });

    /* ---------- Danh sách kế hoạch ----------------------------------------- */
    var page = 1, size = (ums.cfg && ums.cfg.behavior && ums.cfg.behavior.pageSize) || 10, total = 0, rows = [];

    function load(p) {
        if (p) page = p;
        var host = q('[data-z="t"]');
        K.dang(host);
        T.dsKeHoach({
            strTuKhoa: (fQ.value || '').trim(), strPhanLoai_Id: fPl.value,
            strDaoTao_ThoiGianDaoTao_Id: fTg.value,
            strNguoiDung_Id: '', strNguoiTao_Id: '',
            pageIndex: page, pageSize: size
        }).then(function (r) {
            rows = K.ds(r);
            total = Number(r.pager) || rows.length;
            ve();
        }).catch(function (err) { K.loi(host, err, 'danh sách kế hoạch'); });
    }

    function nut(a, id, text, kind) {
        return ui.btn(kind || 'view', { text: text || 'Chi tiết', cls: 'ums-btn--sm', attr: { 'data-a': a, 'data-id': id } });
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
                { title: 'Tên', prop: 'TEN', cls: 'tnkh-ten' },
                { title: 'Học kỳ', prop: 'DAOTAO_THOIGIANDAOTAO', cls: 'is-nowrap' },
                { title: 'Từ ngày', prop: 'NGAYBATDAU', cls: 'is-center is-nowrap' },
                { title: 'Đến ngày', prop: 'NGAYKETTHUC', cls: 'is-center is-nowrap' },
                { title: 'Phân loại', prop: 'PHANLOAI_TEN', cls: 'is-center' },
                { title: 'Nhân sự phân công xét', cls: 'tnkh-pc', render: function (r) {
                    return '<span class="ums-u-muted" data-pc="' + esc(r.ID) + '">…</span>';
                } },
                { title: 'Đối tượng xét', cls: 'is-center is-nowrap', render: function (r) { return nut('doituong', r.ID); } },
                { title: 'Điều kiện xét', cls: 'is-center is-nowrap', render: function (r) { return nut('dk', r.ID, 'Điều kiện xét'); } },
                { title: 'Xác nhận khóa - mở dữ liệu', cls: 'is-center is-nowrap', render: function (r) {
                    return nut('xacnhan', r.ID, e(r.TINHTRANG_KHOA_TEN) || 'Chi tiết', 'confirm');
                } },
                { title: 'Chuẩn bị dữ liệu', cls: 'is-center is-nowrap', render: function (r) { return nut('chuanbi', r.ID, 'Xem'); } },
                { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' },
                { title: 'Người tạo', prop: 'NGUOICUOI_TAIKHOAN', cls: 'is-nowrap' },
                { title: 'Sửa', cls: 'is-center is-actions', render: function (r) {
                    return '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-a="sua" data-id="' + esc(r.ID) + '" title="Sửa"><i class="fa-light fa-pen-to-square"></i></button>';
                } },
                K.cotChon('tnkh')
            ]
        });
        napPhanCong(host, rows);
    }

    /* getList_PhanCong — mỗi kế hoạch một lời gọi */
    function napPhanCong(host, ds) {
        ds.forEach(function (r) {
            function dat(t) {
                var el = host.querySelector('[data-pc="' + T.esc1(r.ID) + '"]');
                if (el) { el.textContent = t; el.classList.remove('ums-u-muted'); }
            }
            ums.api.call({ action: 'TN_KeHoach_NhanSu/LayDanhSach', method: 'GET', silent: true,
                strTuKhoa: '', strNguoiDung_Id: '', strTN_KeHoach_Id: r.ID, strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 })
                .then(function (kq) {
                    dat(K.ds(kq).map(function (x) { return e(x.NGUOICUOI_TENDAYDU); }).filter(Boolean).join(', '));
                }, function () { dat(''); });
        });
    }

    function xoa() {
        var ids = K.daChon(q('[data-z="t"]'), 'tnkh');
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
        K.xoa(ids.map(function (id) { return { action: 'TN_KeHoach/Xoa', strIds: id, strNguoiThucHien_Id: '' }; }), function () { load(); });
    }

    /* #myModal — getList_QuanSoTheoLop */
    function hopDoiTuong(kh) {
        H.hopDS({
            title: 'Danh sách sinh viên xét tốt nghiệp', phanTrang: true,
            call: function (p, s) {
                return { action: 'TN_KeHoach_PhamVi/LayDanhSach', method: 'GET',
                    strTuKhoa: '', strNguoiDung_Id: '', strTN_KeHoach_Id: kh.ID, strNguoiTao_Id: '', pageIndex: p, pageSize: s };
            },
            columns: function () { return H.cotSV(); }
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
            case 'chuanbi': if (r) { cb.mo(r); mo('cb'); } break;
            case 'doituong': if (r) hopDoiTuong(r); break;
            case 'xacnhan': if (r) T.xacNhan(r, function () { load(); }); break;
        }
    });
    fQ.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); load(1); } });

    ums.ref.thoiGianDaoTao({ strNam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 })
        .then(function (ds) { pat.fill(fTg, ds, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Tất cả học kỳ' }); })
        .catch(function (err) { ums.api.handle(err, 'học kỳ'); });
    T.napPhanLoai([fPl]);
    load(1);
})();
