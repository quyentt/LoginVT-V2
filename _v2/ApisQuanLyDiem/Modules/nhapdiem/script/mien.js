/* =========================================================================
   Miễn (công nhận miễn học phần theo quyết định) — Quản lý điểm
   Bản gốc: ApisQuanLyDiem/Modules/nhapdiem/html/mien.html + script/mien.js (không có bản anh em).
   Bố cục gốc một cột: thanh lọc → khung "Danh sách" (ô Đánh giá + Xóa + Lưu ở đầu khung) → bảng.
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, chép nguyên; GET trừ khi ghi):
       SV_QuyetDinh_ThucThi/LayDSLoaiQuyetDinh (strNguoiDung_Id) → ô Loại quyết định
       SV_QuyetDinh/LayDanhSach (strLoaiQuyetDinh_Id; mọi tham số khác '' như gốc; 1/100000) → ô Quyết định (SOQUYETDINH)
       SV_QuyetDinh_HocPhan/LayDSHocPhanTheoQuyetDinh (strQLSV_QuyetDinh_Id) → ô Học phần ("TEN - MA")
       Khoa QL → Hệ → Khoá → CT → Lớp: ums.ref.cascadeQuyen (= edu.extend.genBoLoc_HeKhoa("_CB") — procedure …Quyen, lọc quyền)
       D_Mien/LayDSNguoiHocTheoQuyetDinh → { rs, rsKetQua }: rs = dòng bảng, rsKetQua ghép theo QLSV_NGUOIHOC_ID + DAOTAO_HOCPHAN_ID
         (DANHGIA_TEN, THOIGIAN, NGAYTAO_DD_MM_YYYY_HHMMSS, NGUOITAO_TAIKHOAN, GHICHU)
       Lưu (mỗi dòng đánh dấu): POST D_Mien/Them_Diem_NH_CongNhan_Mien — strQLSV_NguoiHoc_Id, strDaoTao_ChuongTrinh_Id
         (= DAOTAO_TOCHUCCHUONGTRINH_ID), strDanhGia_Id (ô Đánh giá — danh mục DIEM.DANHGIA), strQLSV_QuyetDinh_Id, strGhiChu (ô ghi chú
         của dòng), strDaoTao_HocPhan_Id
       Xóa (mỗi dòng đánh dấu): POST D_Mien/Xoa_Diem_NH_CongNhan_Mien — cùng bốn khoá, không đánh giá / ghi chú
       Import: ums.report.importChung('Miễn', 'IMPORTWITHPROC_CNMIEN') (gốc: menu Import, mục "1. Miễn", btnImportWithProce)
   Khác gốc (sửa lỗi rõ):
     · Ô "Nhập từ khóa tìm kiếm" gốc có (Enter là tìm) nhưng danh sách gửi strTuKhoa từ ô txtAAAA không tồn tại → nay gửi ô từ khoá.
     · Lưu / Xoá: gốc báo "Thêm mới thành công!" CHO MỖI dòng và gắn thêm trình xử lý #btnYes mỗi lần bấm Xóa → ums.ui.batch một lần.
     · Mã chết viewForm_Mien (điền các ô không có trên màn) → bỏ.
   Chờ nghiệp vụ (giữ như gốc): Lưu không bắt chọn Đánh giá (gửi rỗng nếu chưa chọn); bảng không phân trang (gốc tắt bPaginate);
     "Xóa" không hỏi Ghi chú / Đánh giá. Xem _harness/_cq-nhapdiem.txt.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('qld-mien');
    if (!root) return;
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function cn() { return (ums.state && ums.state.chucNangId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }

    root.innerHTML = pat.page('Miễn học phần', '') +
        pat.filterBar([{ key: 'lqd', type: 'select', label: 'Chọn loại quyết định' }, { key: 'qd', type: 'select', label: 'Chọn quyết định' },
            { key: 'kql', type: 'select', label: 'Chọn khoa quản lý' }, { key: 'he', type: 'select', label: 'Chọn hệ đào tạo' },
            { key: 'khoa', type: 'select', label: 'Chọn khóa đào tạo' }, { key: 'ct', type: 'select', label: 'Chọn chương trình đào tạo' },
            { key: 'lop', type: 'select', label: 'Chọn lớp' }, { key: 'hp', type: 'select', label: 'Chọn học phần' },
            { key: 'q', label: 'Nhập từ khóa tìm kiếm' }],
            { extra: '<div class="ums-field ums-field--fit">' + ui.btn('importer', { attr: { 'data-a': 'import' } }) + '</div>' }) +
        pat.panel({ title: 'Danh sách', icon: 'fa-list-timeline', count: 'n', flush: true, zone: 'bang',
            tools: '<div class="ums-field qldm-dg"><select class="ums-select" data-f="dg" data-ph="Chọn đánh giá"><option value=""></option></select></div>' +
                ui.xoaChon('input[data-ck]', { sm: true, goc: '.ums-panel', attr: { 'data-a': 'xoa' } }) + ui.btn('save', { attr: { 'data-a': 'luu' } }) });
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function v(k) { return f(k) ? f(k).value.trim() : ''; }

    /* ---------- Ô lọc ---------------------------------------------------- */
    var cas = ums.ref.cascadeQuyen({ kql: f('kql'), he: f('he'), khoa: f('khoa'), ct: f('ct'), lop: f('lop') });
    var chain = pat.chain([f('lqd'), f('qd'), f('hp')], { phatLai: false });
    ums.api.call({ action: 'SV_QuyetDinh_ThucThi/LayDSLoaiQuyetDinh', method: 'GET', strNguoiDung_Id: uid() })
        .then(function (r) { pat.fill(f('lqd'), arr(r.data), { head: 'Chọn loại quyết định' }); chain.sync(); })
        .catch(function (err) { ums.api.handle(err, 'loại quyết định'); });
    ums.api.dm('DIEM.DANHGIA').then(function (d) { pat.fill(f('dg'), d, { head: 'Chọn đánh giá' }); }).catch(function () {});
    function napQD() {
        pat.fill(f('hp'), []);
        if (!v('lqd')) { pat.fill(f('qd'), []); chain.sync(); return; }
        ums.api.call({ action: 'SV_QuyetDinh/LayDanhSach', method: 'GET', strTuKhoa: '', strChucNang_Id: cn(), strNamNhapHoc: '', strKhoaQuanLy_Id: '', strHeDaoTao_Id: '',
            strKhoaDaoTao_Id: '', strChuongTrinh_Id: '', strLopQuanLy_Id: '', strTrangThaiNguoiHoc_Id: '', strQLSV_NguoiHoc_Id: '', strLoaiQuyetDinh_Id: v('lqd'),
            strCapQuyetDinh_Id: '', strDaoTao_ThoiGianDaoTao_Id: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 })
            .then(function (r) { pat.fill(f('qd'), arr(r.data), { name: 'SOQUYETDINH', head: 'Chọn quyết định' }); chain.sync(); })
            .catch(function (err) { ums.api.handle(err, 'quyết định'); });
    }
    function napHP() {
        if (!v('qd')) { pat.fill(f('hp'), []); chain.sync(); return; }
        ums.api.call({ action: 'SV_QuyetDinh_HocPhan/LayDSHocPhanTheoQuyetDinh', method: 'GET', strQLSV_QuyetDinh_Id: v('qd'), strNguoiThucHien_Id: uid() })
            .then(function (r) { pat.fill(f('hp'), arr(r.data), { head: 'Chọn học phần', name: function (x) { return e(x.TEN) + ' - ' + e(x.MA); } }); chain.sync(); })
            .catch(function (err) { ums.api.handle(err, 'học phần'); });
    }
    if (window.jQuery) {
        jQuery(f('lqd')).on('select2:select select2:clear', napQD);
        jQuery(f('qd')).on('select2:select select2:clear', napHP);
    }

    /* ---------- Danh sách ------------------------------------------------ */
    var DS = [], KQ = {};
    function khoa(x) { return e(x.QLSV_NGUOIHOC_ID) + '_' + e(x.DAOTAO_HOCPHAN_ID); }
    function tai() {
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        var c = cas.values();
        return ums.api.call({ action: 'D_Mien/LayDSNguoiHocTheoQuyetDinh', method: 'GET', strTuKhoa: v('q'), strQLSV_QuyetDinh_Id: v('qd'),
            strDaoTao_KhoaQuanLy_Id: c.kql, strDaoTao_HeDaoTao_Id: c.he, strDaoTao_KhoaDaoTao_Id: c.khoa, strDaoTao_ChuongTrinh_Id: c.ct, strDaoTao_LopQuanLy_Id: c.lop,
            strDaoTao_HocPhan_Id: v('hp'), strNguoiThucHien_Id: uid() }).then(function (r) {
            var d = r.data || {};
            DS = Array.isArray(d.rs) ? d.rs : arr(d); KQ = {};
            (Array.isArray(d.rsKetQua) ? d.rsKetQua : []).forEach(function (x) { KQ[khoa(x)] = x; });
            z('n').textContent = '(' + (r.pager != null && r.pager !== '' ? r.pager : DS.length) + ')';
            function kq(x, cot) { return esc(e((KQ[khoa(x)] || {})[cot])); }
            ui.table({ el: z('bang'), rows: DS, empty: 'Không có dữ liệu', columns: [
                { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                { title: 'Họ và tên', render: function (x) { return esc(e(x.QLSV_NGUOIHOC_HODEM) + ' ' + e(x.QLSV_NGUOIHOC_TEN)); } },
                { title: 'Chương trình', render: function (x) { return esc(e(x.DAOTAO_TOCHUCCHUONGTRINH_TEN) + ' - ' + e(x.DAOTAO_TOCHUCCHUONGTRINH_MA)); } },
                { title: 'Học phần', render: function (x) { return esc(e(x.DAOTAO_HOCPHAN_TEN) + ' - ' + e(x.DAOTAO_HOCPHAN_MA)); } },
                { title: 'Đánh giá', cls: 'is-center', render: function (x) { return kq(x, 'DANHGIA_TEN'); } },
                { title: 'Học kỳ, đợt', cls: 'is-center', render: function (x) { return kq(x, 'THOIGIAN'); } },
                { title: 'Ghi chú', render: function (x, i) { return '<input class="ums-input ums-input--sm qldm-gc" data-gc="' + i + '" value="' + kq(x, 'GHICHU') + '" autocomplete="off">'; } },
                { title: 'Ngày tạo', cls: 'is-center is-nowrap', render: function (x) { return kq(x, 'NGAYTAO_DD_MM_YYYY_HHMMSS'); } },
                { title: 'Người tạo', render: function (x) { return kq(x, 'NGUOITAO_TAIKHOAN'); } },
                { head: '<input type="checkbox" data-ckall title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (x, i) { return '<input type="checkbox" data-ck="' + i + '">'; } }] });
        }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách miễn'); });
    }
    function daChon() {
        return Array.prototype.filter.call(z('bang').querySelectorAll('tbody input[data-ck]:checked'), function () { return true; })
            .map(function (c) { var i = Number(c.getAttribute('data-ck')); return { x: DS[i], i: i }; }).filter(function (o) { return o.x; });
    }
    function luu() {
        var ds = daChon();
        if (!ds.length) { ui.toast('Vui lòng chọn đối tượng', 'warn'); return; }
        ui.batch(ds.map(function (o) {
            var gc = z('bang').querySelector('[data-gc="' + o.i + '"]');
            return { action: 'D_Mien/Them_Diem_NH_CongNhan_Mien', method: 'POST', strQLSV_NguoiHoc_Id: o.x.QLSV_NGUOIHOC_ID, strDaoTao_ChuongTrinh_Id: o.x.DAOTAO_TOCHUCCHUONGTRINH_ID,
                strDanhGia_Id: v('dg'), strQLSV_QuyetDinh_Id: o.x.QLSV_QUYETDINH_ID, strGhiChu: gc ? gc.value : '', strDaoTao_HocPhan_Id: o.x.DAOTAO_HOCPHAN_ID, strNguoiThucHien_Id: uid() };
        }), { title: 'Đang lưu', okText: 'Lưu thành công', show: true }).then(tai);
    }
    function xoa() {
        var ds = daChon();
        if (!ds.length) { ui.toast('Vui lòng chọn đối tượng cần xóa', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không? (' + ds.length + ' dòng)', { tone: 'bad', ok: 'Xóa' }).then(function (yes) {
            if (!yes) return;
            ui.batch(ds.map(function (o) {
                return { action: 'D_Mien/Xoa_Diem_NH_CongNhan_Mien', method: 'POST', strQLSV_NguoiHoc_Id: o.x.QLSV_NGUOIHOC_ID, strDaoTao_ChuongTrinh_Id: o.x.DAOTAO_TOCHUCCHUONGTRINH_ID,
                    strQLSV_QuyetDinh_Id: o.x.QLSV_QUYETDINH_ID, strDaoTao_HocPhan_Id: o.x.DAOTAO_HOCPHAN_ID, strNguoiThucHien_Id: uid() };
            }), { title: 'Đang xóa', okText: 'Xóa dữ liệu thành công', show: true }).then(tai);
        });
    }

    root.addEventListener('change', function (ev) {
        if (ev.target.hasAttribute('data-ckall')) Array.prototype.forEach.call(z('bang').querySelectorAll('tbody input[data-ck]'), function (c) { c.checked = ev.target.checked; });
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(); } });
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') tai();
        else if (a === 'luu') luu();
        else if (a === 'xoa') xoa();
        else if (a === 'import') ums.report.importChung('Miễn', 'IMPORTWITHPROC_CNMIEN', { onDone: tai });
    });
    cas.ready.then(tai);   // gốc nạp danh sách ngay khi mở màn
})();
