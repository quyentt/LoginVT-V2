/* =========================================================================
   Không điểm danh (sinh viên tự ghi nhận vi phạm — "Lý do")
   Bản gốc: ApisChuyenCan/Modules/nhapchuyencan/html/khongdiemdanh.html + script/khongdiemdanh.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): ô từ khoá · Tìm kiếm · Xuất báo cáo · "Import ▾" (một mục:
   "Import chuyên cần tự ghi nhận") → khung "Danh sách (n)" với nút Xoá · Lưu · Thêm và
   bảng Mã số · Họ đệm · Tên · Lớp · Lý do (ô nhập sửa ngay trong bảng) · ô đánh dấu.
   "Thêm" mở hộp chọn sinh viên → mỗi SV thêm MỘT dòng mới vào bảng (chưa lưu); "Lưu"
   gửi mọi dòng mới + dòng đã sửa lý do.

   Lời gọi (XLHV_CC_ThongTin_MH · PKG_CHUYENCAN_THONGTIN, chép nguyên):
       LayDSQLSV_NH_TuGhiNhan_ViPham   danh sách (strTuKhoa, phân trang)
       Them_QLSV_NH_TuGhiNhan_ViPham   lưu: dòng mới strId '', strQLSV_NguoiHoc_Id = ID dòng hộp chọn SV;
                                       dòng sửa strId = ID, strQLSV_NguoiHoc_Id = QLSV_NGUOIHOC_ID
                                       (strDaoTao_LopQuanLy_Id = LOP_ID, strMoTa = ô Lý do)
       Xoa_QLSV_NH_TuGhiNhan_ViPham    xoá từng dòng đã đánh dấu (strId)
       Import: ums.report.importChung('Chuyên cần', 'IMPORTWITHPROC_CCTGN') — nút .btnImportWithProce
               của html gốc (Corei showImportChungV2).
       Báo cáo: ums.report.mount (getList_MauImport "zonebtnKDD", callback không thêm tham số nào;
               html gốc có vùng _Import riêng viết tay → import: false để không trùng nút).
       Hộp chọn SV: ums.pat.pickSinhVien bản đầy đủ, nguồn như Corei genModal_SinhVien /
               getList_SinhVien: SV_NGUOIHOC_01_MH · PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc.
   Khác gốc:
     · Dòng mới đọc tên cột theo bản gốc (MASO, HODEM, TEN, LOP, LOP_ID) và lùi về cột của
       LayDSNguoiHoc (QLSV_NGUOIHOC_MASO …, DAOTAO_LOPQUANLY_*) — gốc chỉ đọc tên cũ nên dòng mới
       hiện "undefined" và gửi LOP_ID rỗng. Kiểm tên cột trên host.
     · Dòng mới gửi strQLSV_NguoiHoc_Id = QLSV_NGUOIHOC_ID của dòng hộp chọn SV (kiểm host 6/10: LayDSNguoiHoc
       trả ID = bản ghi đào tạo ≠ QLSV_NGUOIHOC_ID; gốc gửi ID nên máy chủ từ chối "Người học không tồn tại"
       với MỌI dòng thêm mới — thêm mới ở bản gốc chưa từng lưu được). Dòng sửa gốc cũng gửi QLSV_NGUOIHOC_ID.
     · Chọn trùng một SV đã có trong bảng thì bỏ qua (gốc thêm dòng trùng).
     · Lưu xong nạp lại một lần (gốc: mỗi lời gọi xong đều thử nạp lại).
     · Xoá nhiều dòng = ums.ui.xoaChon (luật chung); dòng mới chưa lưu gỡ bằng nút thùng rác trên dòng.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, cc = ums.cc;
    var root = document.getElementById('cc-khongdiemdanh');
    if (!root) return;

    var XL = 'XLHV_CC_ThongTin_MH/', PK = 'PKG_CHUYENCAN_THONGTIN.';
    function e(v) { return cc.e(v); }
    function esc(s) { return ui.esc(s); }

    root.innerHTML = pat.page('Không điểm danh', '') +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            '<div class="ums-filter">' +
                '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
                '<div class="ums-field ums-field--fit" data-z="bc"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('importer', { text: 'Import chuyên cần tự ghi nhận', attr: { 'data-a': 'import' } }) + '</div>' +
            '</div>' }) +
        pat.panel({ title: 'Danh sách', icon: 'fa-list-timeline', count: 'n', flush: true, zone: 'bang',
            tools: ui.xoaChon('input[data-ck]', { goc: '.ums-panel', text: 'Xóa', attr: { 'data-a': 'xoa' } }) + ui.btn('save', { text: 'Lưu', attr: { 'data-a': 'luu' } }) +
                ui.btn('add', { text: 'Thêm', attr: { 'data-a': 'them' } }) });
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

    var ds = [], moi = [], trang = 1, co = 10, tong = 0;

    /* Dòng của hộp chọn SV → dạng dòng bảng (tên cột gốc, lùi về cột LayDSNguoiHoc) */
    function tuHop(r) {
        return {
            ID: r.ID,
            NH_ID: e(r.QLSV_NGUOIHOC_ID) || e(r.ID),
            MASO: e(r.MASO) || e(r.QLSV_NGUOIHOC_MASO),
            HODEM: e(r.HODEM) || e(r.QLSV_NGUOIHOC_HODEM),
            TEN: e(r.TEN) || e(r.QLSV_NGUOIHOC_TEN),
            LOP: e(r.LOP) || e(r.DAOTAO_LOPQUANLY_TEN),
            LOP_ID: e(r.LOP_ID) || e(r.DAOTAO_LOPQUANLY_ID),
            MOTA: e(r.MOTA),
            _moi: true
        };
    }

    function ve() {
        var rows = moi.concat(ds);
        ui.table({ el: z('bang'), rows: rows, empty: 'Không có dữ liệu',
            page: { index: trang, size: co, total: tong + moi.length, onChange: function (p) { trang = p; tai(); }, onSize: function (s) { co = s; trang = 1; tai(); } },
            columns: [
                { title: 'Mã số', prop: 'MASO', cls: 'is-nowrap' },
                { title: 'Họ đệm', prop: 'HODEM' },
                { title: 'Tên', prop: 'TEN', cls: 'is-nowrap' },
                { title: 'Lớp', prop: 'LOP', cls: 'is-nowrap' },
                { title: 'Lý do', render: function (r) {
                    return '<input class="ums-input ums-input--sm" data-mt="' + esc(r.ID) + '"' + (r._moi ? ' data-moi' : '') +
                        ' value="' + esc(r.MOTA) + '" data-cu="' + esc(r._moi ? '' : e(r.MOTA)) + '" autocomplete="off">'; } },
                { head: '<input type="checkbox" data-ckall>', cls: 'is-center is-actions', render: function (r) {
                    return r._moi
                        ? '<button type="button" class="ums-btn ums-btn--ghost ums-btn--sm ums-btn--icon" data-bo="' + esc(r.ID) + '" title="Bỏ dòng chưa lưu"><i class="fa-light fa-trash-can"></i></button>'
                        : '<input type="checkbox" data-ck="' + esc(r.ID) + '">'; } }
            ] });
        z('n').textContent = '(' + tong + ')';
    }

    function tai() {
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: XL + 'DSA4BRIQDRIXHg8JHhU0BikoDykgLx4XKBEpICwP', func: PK + 'LayDSQLSV_NH_TuGhiNhan_ViPham',
            strTuKhoa: (f('q').value || '').trim(), strNguoiThucHien_Id: cc.uid(), pageIndex: trang, pageSize: co })
            .then(function (r) { ds = cc.arr(r.data); tong = Number(r.pager) || ds.length; ve(); })
            .catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách không điểm danh'); });
    }
    function tim() { trang = 1; tai(); }

    function them() {
        ums.pat.pickSinhVien({
            filters: true,
            status: function (el) { return pat.checks(el, ums.api.dm('QLSV.TRANGTHAI'), { cols: 3 }); },
            call: function (p, page, size) {
                return { action: 'SV_NGUOIHOC_01_MH/DSA4BRIPJjQuKAkuIgPP', func: 'PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc',
                    strTuKhoa: p.strTuKhoa, strNguoiThucHien_Id: cc.uid(),
                    strDaoTao_HeDaoTao_Id: p.strHeDaoTao_Id, strDaoTao_KhoaDaoTao_Id: p.strKhoaDaoTao_Id,
                    strDaoTao_ChuongTrinh_Id: p.strChuongTrinh_Id, strDaoTao_KhoaQuanLy_Id: '', strDaoTao_LopQuanLy_Id: p.strLopQuanLy_Id,
                    strStudyStatus_Ids: p.strTrangThaiNguoiHoc_Id, dIsPrimary: '', dBoQuaPhamVi: '', pageIndex: page, pageSize: size };
            },
            columns: [
                { title: 'Mã số', render: function (r) { return esc(e(r.QLSV_NGUOIHOC_MASO) || e(r.MASO)); }, cls: 'is-nowrap' },
                { title: 'Họ tên', render: function (r) { return esc((e(r.QLSV_NGUOIHOC_HODEM) || e(r.HODEM)) + ' ' + (e(r.QLSV_NGUOIHOC_TEN) || e(r.TEN))); } },
                { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' },
                { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' },
                { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                { title: 'Trạng thái', prop: 'QLSV_TRANGTHAINGUOIHOC_TEN' }
            ],
            onPick: function (rows) {
                var co_ = {};
                moi.forEach(function (x) { co_[x.ID] = 1; });
                var n = 0;
                rows.forEach(function (r) { if (!co_[r.ID]) { moi.push(tuHop(r)); co_[r.ID] = 1; n++; } });
                if (n < rows.length) ui.toast('Bỏ qua ' + (rows.length - n) + ' sinh viên đã có trong bảng', 'info');
                ve();
            }
        });
    }

    function luu() {
        var calls = [];
        Array.prototype.forEach.call(z('bang').querySelectorAll('input[data-mt]'), function (i) {
            var id = i.getAttribute('data-mt'), mt = i.value;
            if (i.hasAttribute('data-moi')) {
                var r = moi.filter(function (x) { return x.ID === id; })[0];
                if (r) {   // gốc: dòng mới không có giá trị cũ → luôn lưu, kể cả lý do trống
                    calls.push({ action: XL + 'FSkkLB4QDRIXHg8JHhU0BikoDykgLx4XKBEpICwP', func: PK + 'Them_QLSV_NH_TuGhiNhan_ViPham',
                        type: 'POST', strId: '', strQLSV_NguoiHoc_Id: r.NH_ID, strDaoTao_LopQuanLy_Id: r.LOP_ID, strMoTa: mt, strNguoiThucHien_Id: cc.uid() });
                }
            } else if (mt !== i.getAttribute('data-cu')) {
                var d = ds.filter(function (x) { return x.ID === id; })[0];
                if (d) calls.push({ action: XL + 'FSkkLB4QDRIXHg8JHhU0BikoDykgLx4XKBEpICwP', func: PK + 'Them_QLSV_NH_TuGhiNhan_ViPham',
                    type: 'POST', strId: d.ID, strQLSV_NguoiHoc_Id: d.QLSV_NGUOIHOC_ID, strDaoTao_LopQuanLy_Id: d.LOP_ID, strMoTa: mt, strNguoiThucHien_Id: cc.uid() });
            }
        });
        if (!calls.length) { ui.toast('Không có thay đổi lưu', 'info'); return; }
        ui.batch(calls, { title: 'Đang lưu', okText: 'Lưu thành công' }).then(function () { moi = []; tai(); });
    }

    function xoa(ids) {
        return ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (ok) {
            if (!ok) return;
            return ui.batch(ids.map(function (id) {
                return { action: XL + 'GS4gHhANEhceDwkeFTQGKSgPKSAvHhcoESkgLAPP', func: PK + 'Xoa_QLSV_NH_TuGhiNhan_ViPham',
                    strId: id, strChucNang_Id: cc.cn(), strNguoiThucHien_Id: cc.uid() };
            }), { title: 'Đang xoá', okText: 'Xóa dữ liệu thành công!' }).then(tai);
        });
    }

    ums.report.mount(z('bc'), { import: false, collect: function () {} });

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-bo]');
        if (b) { var id = b.getAttribute('data-bo'); moi = moi.filter(function (x) { return x.ID !== id; }); ve(); return; }
        b = ev.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') tim();
        else if (a === 'them') them();
        else if (a === 'luu') luu();
        else if (a === 'xoa') xoa(Array.prototype.map.call(z('bang').querySelectorAll('input[data-ck]:checked'), function (c) { return c.getAttribute('data-ck'); }));
        else if (a === 'import') ums.report.importChung('Chuyên cần', 'IMPORTWITHPROC_CCTGN', { onDone: tai });
    });
    root.addEventListener('change', function (ev) {
        if (!ev.target.hasAttribute('data-ckall')) return;
        Array.prototype.forEach.call(z('bang').querySelectorAll('input[data-ck]'), function (c) {
            c.checked = ev.target.checked;
            c.dispatchEvent(new Event('change', { bubbles: true }));
        });
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim(); } });

    tai();
})();
