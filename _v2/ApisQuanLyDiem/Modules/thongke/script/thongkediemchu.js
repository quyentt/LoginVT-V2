/* =========================================================================
   Thống kê điểm chữ (Quản lý điểm)
   Bản gốc: ApisQuanLyDiem/Modules/thongke/html/thongkediemchu.html + script/thongkediemchu.js
   ---------------------------------------------------------------------------
   Bố cục gốc (một cột): khung "Bộ lọc đào tạo" (9 ô, nhãn trên ô, nút Đặt lại · Thống kê) → khung
   "Kết quả thống kê điểm chữ" (số dòng ở đầu khung, bảng CỘT ĐỘNG theo khoá của dòng đầu).
   Lời gọi (chép nguyên, bản KHÔNG lọc quyền — gốc gọi edu.system.getList_*):
       ums.ref.thoiGianDaoTao (pageSize 100000)                 ô Học kỳ (chọn nhiều)
       ums.ref.heDaoTao · khoaDaoTao · chuongTrinh · lopQuanLy (pageSize 1000000) · khoaQuanLy   (đều chọn nhiều)
       Danh mục KHCT.NCN · QLSV.TRANGTHAI (chọn sẵn tất cả)     ô Ngành / chuyên ngành · Trạng thái người học
       "Thống kê": D_ThongKe_MH/FSkuLyYKJAokNRA0IBUpJC4FKCQsAik0  func PKG_DIEM_THONGKE.ThongKeKetQuaTheoDiemChu  POST
           strHanhDong_Code = ô Phạm vi thống kê (1 Trong kỳ này · 0 Đến kỳ này (lũy kế));
           strVaiTroDangNhap_Id / strChucNangHeThong_Id do ums.api tự điền (gốc đọc edu.system.*).
   Bảng: bỏ khoá STT / TT của dữ liệu; tiêu đề = tên khoá bỏ "_", viết hoa chữ đầu mỗi từ (formatHeader gốc);
   số nguyên in kiểu vi-VN, số lẻ 2 chữ số — như gốc. Số dòng đầu khung = Pager (hoặc số dòng).
   Nối tầng: Hệ → Khoá → Chương trình → Lớp, Khoa quản lý → Chương trình / Lớp — mọi ô là ô CHỌN NHIỀU mang nhãn
   "Tất cả …" (lọc tuỳ chọn) → KHÔNG khoá ô con (ghi sổ can-quyet); đổi / xoá ô cha thì nạp lại ô con như gốc.
   Bỏ: CSS riêng của gốc (khung cuộn max-height 520px, cột STT dính) — theo luật chung cuộn cả trang.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, R = ums.ref;
    var root = document.getElementById('qld-thongkediemchu');
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : []; }

    function o(label, key, ph, multi, full) {
        return '<div' + (full ? ' class="qldtk-full"' : '') + '>' + ui.field(label, '<select class="ums-select" data-f="' + key + '" data-ph="' + esc(ph) + '"' +
            (multi ? ' multiple' : ' data-required') + '></select>') + '</div>';
    }
    root.innerHTML = pat.page('Thống kê điểm chữ', '') +
        pat.panel({ title: 'Bộ lọc đào tạo', icon: 'fa-filter', cls: 'ums-u-mb-4',
            tools: ui.btn('reload', { text: 'Đặt lại', icon: 'fa-arrow-rotate-left', attr: { 'data-a': 'datlai' } }) +
                ui.btn('search', { text: 'Thống kê', icon: 'fa-calculator', attr: { 'data-a': 'thongke' } }),
            body: '<div class="ums-grid ums-grid--4">' +
                o('Học kỳ', 'tg', 'Tất cả học kỳ', true) + o('Phạm vi thống kê', 'pv', 'Phạm vi thống kê') +
                o('Hệ đào tạo', 'he', 'Tất cả hệ đào tạo', true) + o('Khóa đào tạo', 'khoa', 'Tất cả khóa đào tạo', true) +
                o('Khoa quản lý', 'kql', 'Tất cả khoa quản lý', true) + o('Chương trình đào tạo', 'ct', 'Tất cả chương trình đào tạo', true) +
                o('Lớp quản lý', 'lop', 'Tất cả lớp quản lý', true) + o('Ngành / chuyên ngành', 'nganh', 'Tất cả ngành', true) +
                o('Trạng thái người học', 'tt', 'Tất cả trạng thái người học', true, true) + '</div>' }) +
        pat.panel({ title: 'Kết quả thống kê điểm chữ', icon: 'fa-list', count: 'n', flush: true, zone: 'bang' });
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return pat.val(f(k)); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    f('pv').innerHTML = '<option value="1">1. Trong kỳ này</option><option value="0">2. Đến kỳ này (lũy kế)</option>';
    ui.enhance(root);
    z('bang').innerHTML = ui.empty('Vui lòng chọn điều kiện và ấn "Thống kê" để xem kết quả', 'fa-circle-info');
    z('n').textContent = '(0)';

    /* ---------- Bộ lọc ------------------------------------------------------- */
    function loi(noi) { return function (err) { ums.api.handle(err, noi); }; }
    var ttAll = [];
    function napKhoa() { return R.khoaDaoTao({ strHeDaoTao_Id: v('he'), strCoSoDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 }).then(function (d) { pat.fill(f('khoa'), d, { name: 'TENKHOA' }); }).catch(loi('khóa đào tạo')); }
    function napCT() {
        return R.chuongTrinh({ strKhoaDaoTao_Id: v('khoa'), strN_CN_LOP_Id: '', strKhoaQuanLy_Id: v('kql'), strToChucCT_Cha_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
            .then(function (d) { pat.fill(f('ct'), d, { name: 'TENCHUONGTRINH' }); }).catch(loi('chương trình đào tạo'));
    }
    function napLop() {
        return R.lopQuanLy({ strCoSoDaoTao_Id: '', strDaoTao_HeDaoTao_Id: v('he'), strKhoaDaoTao_Id: v('khoa'), strNganh_Id: '', strLoaiLop_Id: '', strToChucCT_Id: v('ct'),
            strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 }).then(function (d) { pat.fill(f('lop'), d, { name: 'TEN' }); }).catch(loi('lớp quản lý'));
    }
    R.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 }).then(function (d) { pat.fill(f('he'), d, { name: 'TENHEDAOTAO' }); }).catch(loi('hệ đào tạo'));
    R.khoaQuanLy().then(function (d) { pat.fill(f('kql'), d, { name: 'TEN' }); }).catch(loi('khoa quản lý'));
    R.thoiGianDaoTao({ strNam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 }).then(function (d) { pat.fill(f('tg'), d, { name: 'DAOTAO_THOIGIANDAOTAO' }); }).catch(loi('học kỳ'));
    napKhoa(); napCT(); napLop();
    ums.api.dm('KHCT.NCN').then(function (d) { pat.fill(f('nganh'), d); }).catch(function () {});
    function chonHetTT() { if (window.jQuery) jQuery(f('tt')).val(ttAll).trigger('change.select2').trigger('ums:refresh'); }
    ums.api.dm('QLSV.TRANGTHAI').then(function (d) {
        pat.fill(f('tt'), d);
        ttAll = arr(d).map(function (r) { return String(r.ID); });
        chonHetTT();
    }).catch(function () {});
    if (window.jQuery) {
        var EV = 'select2:select select2:unselect select2:clear';
        jQuery(f('he')).on(EV, function () { napKhoa(); napCT(); napLop(); });
        jQuery(f('khoa')).on(EV, function () { napCT(); napLop(); });
        jQuery(f('kql')).on(EV, function () { napCT(); napLop(); });
        jQuery(f('ct')).on(EV, function () { napLop(); });
    }

    function datLai() {
        ['tg', 'he', 'khoa', 'kql', 'ct', 'lop', 'nganh'].forEach(function (k) {
            if (window.jQuery) jQuery(f(k)).val([]).trigger('change.select2').trigger('ums:refresh');
        });
        f('pv').value = '1';
        if (window.jQuery) jQuery(f('pv')).trigger('change.select2');
        chonHetTT();
    }

    /* ---------- Thống kê ----------------------------------------------------- */
    function tieuDe(k) {
        return String(k).replace(/_/g, ' ').toLowerCase().trim().replace(/(^|\s)(\S)/g, function (m, a, c) { return a + c.toUpperCase(); });
    }
    function so(x) {
        if (x === null || x === undefined || x === '') return '';
        if (typeof x === 'number') return Number.isInteger(x) ? x.toLocaleString('en-US') : x.toFixed(2);
        return esc(x);
    }
    function thongKe() {
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({
            action: 'D_ThongKe_MH/FSkuLyYKJAokNRA0IBUpJC4FKCQsAik0', func: 'PKG_DIEM_THONGKE.ThongKeKetQuaTheoDiemChu', method: 'POST',
            strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_KhoaDaoTao_Id: v('khoa'), strDaoTao_ChuongTrinh_Id: v('ct'),
            strDaoTao_KhoaQuanLy_Id: v('kql'), strDaoTao_LopQuanLy_Id: v('lop'), strDaoTao_NganhHoc_Id: v('nganh'),
            strDaoTao_ThoiGianDaoTao_Id: v('tg'), strQLSV_TrangThai_Id: v('tt'), strNguoiThucHien_Id: '',
            strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: '', strHanhDong_Code: v('pv')
        }).then(function (r) {
            var d = arr(r.data);
            z('n').textContent = '(' + (r.pager || d.length) + ')';
            if (!d.length) { z('bang').innerHTML = ui.empty('Không có dữ liệu phù hợp', 'fa-inbox'); return; }
            var keys = Object.keys(d[0]).filter(function (k) { var u = String(k).toUpperCase(); return u !== 'STT' && u !== 'TT'; });
            ui.table({ el: z('bang'), rows: d, columns: keys.map(function (k) {
                return { title: tieuDe(k), cls: 'is-nowrap', render: function (x) { return so(x[k]); } };
            }) });
        }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'thống kê điểm chữ'); });
    }

    root.addEventListener('click', function (ev) {
        var a = ev.target.closest('[data-a]');
        if (!a) return;
        if (a.getAttribute('data-a') === 'thongke') thongKe();
        else if (a.getAttribute('data-a') === 'datlai') datLai();
    });
})();
