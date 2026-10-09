/* =========================================================================
   Sinh viên không đăng ký (chặn đăng ký học — "Lý do")
   Bản gốc: ApisDangKyHoc/Modules/canbodangky/html/khongdangky.html + script/khongdangky.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): ô từ khoá · Tìm kiếm · (vùng Xuất báo cáo / Import) → khung
   "Danh sách (n)": bảng Mã số · Họ đệm · Tên · Lớp · Lý do (ô nhập sửa ngay trong bảng) · ô đánh
   dấu; nút Xóa · Thêm · Lưu. "Thêm" mở hộp chọn sinh viên → mỗi SV một dòng MỚI (chưa lưu);
   "Lưu" gửi mọi dòng mới + dòng đã sửa lý do.
   Cùng dạng với ApisChuyenCan/nhapchuyencan/khongdiemdanh (đã chuyển) — dựng theo đúng khuôn đó.

   Lời gọi (action kiểu cũ DKH_ThongTin/*, không func — chép nguyên):
     LayDSDangKy_NguoiHoc_Chan   danh sách (strTuKhoa, phân trang máy chủ)            GET
     Them_DangKy_NguoiHoc_Chan   lưu MỘT dòng: strQLSV_NguoiHoc_Id, strDaoTao_LopQuanLy_Id, strMoTa
                                 (dòng đã có cũng gọi THÊM — gốc không gửi strId; xem ghi chú)
     Xoa_DangKy_NguoiHoc_Chan    xoá từng dòng đã đánh dấu (strId, strChucNang_Id)
     Hộp chọn SV: Corei genModal_SinhVien + getList_SinhVien → ums.pat.pickSinhVien bản đầy đủ
       (SV_NGUOIHOC_01_MH · PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc), như khongdiemdanh.
   Khác gốc:
     · Báo cáo: gốc gọi getList_MauImport("zonebtnKDD") trong khi html đặt vùng "zonebtnKDK" (+ _Import)
       → nút báo cáo / import KHÔNG BAO GIỜ hiện (sai id). Bản mới gắn ums.report.mount vào đúng
       chỗ (có Import vì html có vùng _Import); callback gốc rỗng → không thêm tham số.
     · Dòng mới từ hộp chọn (callback genModal_SinhVien) gốc hiện QLSV_NGUOIHOC_HOTEN ở cột "Họ đệm"
       (cả họ tên) → hiện QLSV_NGUOIHOC_HODEM. Nhánh .btnSelect (MASO/HODEM/TEN/LOP) là mã chết của
       hộp cũ — đọc lùi về tên cột đó khi cột QLSV_NGUOIHOC_* rỗng.
     · strQLSV_NguoiHoc_Id của dòng mới = QLSV_NGUOIHOC_ID của dòng hộp chọn (như gốc), rỗng thì lùi
       về ID. Chọn trùng SV đã có trong bảng thì bỏ qua (gốc thêm dòng trùng).
     · Lưu xong nạp lại một lần; Xoá nhiều dòng = ums.ui.xoaChon; dòng mới gỡ bằng thùng rác.
   Bỏ: getList_ThoiGianDaoTao / viewForm_KhongDangKy (mã chết — ô không tồn tại).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('dkh-khongdangky');
    if (!root) return;

    var C = 'DKH_ThongTin/';
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(e(s)); }
    function arr(d) { return Array.isArray(d) ? d : []; }

    root.innerHTML = pat.page('Sinh viên không đăng ký', '') +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            '<div class="ums-filter">' +
                '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
                '<div class="ums-field ums-field--fit" data-z="bc"></div>' +
            '</div>' }) +
        pat.panel({ title: 'Danh sách', icon: 'fa-address-book', count: 'n', flush: true, zone: 'bang',
            tools: ui.xoaChon('input[data-kdk]', { goc: '.ums-panel', text: 'Xóa', attr: { 'data-a': 'xoa' } }) +
                ui.btn('add', { text: 'Thêm', attr: { 'data-a': 'them' } }) + ui.btn('save', { text: 'Lưu', attr: { 'data-a': 'luu' } }) });
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

    var ds = [], moi = [], trang = 1, co = 10, tong = 0;

    /* Dòng của hộp chọn SV → dòng bảng */
    function tuHop(r) {
        return {
            ID: e(r.ID),
            MASO: e(r.QLSV_NGUOIHOC_MASO) || e(r.MASO),
            HODEM: e(r.QLSV_NGUOIHOC_HODEM) || e(r.HODEM),
            TEN: e(r.QLSV_NGUOIHOC_TEN) || e(r.TEN),
            LOP: e(r.DAOTAO_LOPQUANLY_TEN) || e(r.LOP),
            QLSV_NGUOIHOC_ID: e(r.QLSV_NGUOIHOC_ID) || e(r.ID),
            DAOTAO_LOPQUANLY_ID: e(r.DAOTAO_LOPQUANLY_ID),
            MOTA: e(r.MOTA),
            _moi: true
        };
    }

    function ve() {
        ui.table({ el: z('bang'), rows: moi.concat(ds), empty: 'Không có dữ liệu',
            page: { index: trang, size: co, total: tong + moi.length, onChange: function (p) { trang = p; tai(); }, onSize: function (s) { co = s; trang = 1; tai(); } },
            columns: [
                { title: 'Mã số', prop: 'MASO', cls: 'is-nowrap' },
                { title: 'Họ đệm', prop: 'HODEM' },
                { title: 'Tên', prop: 'TEN', cls: 'is-nowrap' },
                { title: 'Lớp', prop: 'LOP', cls: 'is-nowrap' },
                { title: 'Lý do', render: function (r, i) {
                    return '<input class="ums-input ums-input--sm" data-mt="' + i + '" value="' + esc(r.MOTA) + '" data-cu="' + esc(r._moi ? '' : r.MOTA) + '" autocomplete="off">'; } },
                { head: '<input type="checkbox" data-kdkall title="Chọn tất cả">', cls: 'is-center is-actions', width: '56px', render: function (r, i) {
                    return r._moi
                        ? '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-bo="' + i + '" title="Bỏ dòng chưa lưu"><i class="fa-light fa-trash-can"></i></button>'
                        : '<input type="checkbox" data-kdk="' + esc(r.ID) + '">'; } }
            ] });
        z('n').textContent = '(' + tong + ')';
    }

    function tai() {
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: C + 'LayDSDangKy_NguoiHoc_Chan', type: 'GET', method: 'GET',
            strTuKhoa: (f('q').value || '').trim(), strNguoiThucHien_Id: '', pageIndex: trang, pageSize: co })
            .then(function (r) { ds = arr(r.data); tong = Number(r.pager) || ds.length; ve(); })
            .catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách sinh viên không đăng ký'); });
    }
    function tim() { trang = 1; tai(); }

    function them() {
        pat.pickSinhVien({
            filters: true,
            status: function (el) { return pat.checks(el, ums.api.dm('QLSV.TRANGTHAI'), { cols: 3 }); },
            call: function (p, page, size) {
                return { action: 'SV_NGUOIHOC_01_MH/DSA4BRIPJjQuKAkuIgPP', func: 'PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc',
                    strTuKhoa: p.strTuKhoa, strNguoiThucHien_Id: '',
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
                moi.forEach(function (x) { co_[x.QLSV_NGUOIHOC_ID] = 1; });
                var n = 0;
                rows.forEach(function (r) { var x = tuHop(r); if (!co_[x.QLSV_NGUOIHOC_ID]) { moi.push(x); co_[x.QLSV_NGUOIHOC_ID] = 1; n++; } });
                if (n < rows.length) ui.toast('Bỏ qua ' + (rows.length - n) + ' sinh viên đã có trong bảng', 'info');
                ve();
            }
        });
    }

    function luu() {
        var bang = moi.concat(ds), calls = [];
        Array.prototype.forEach.call(z('bang').querySelectorAll('input[data-mt]'), function (i) {
            var r = bang[Number(i.getAttribute('data-mt'))];
            if (!r) return;
            // gốc: dòng mới không có giá trị cũ (name) → luôn lưu; dòng cũ chỉ lưu khi đổi lý do
            if (!r._moi && i.value === i.getAttribute('data-cu')) return;
            calls.push({ action: C + 'Them_DangKy_NguoiHoc_Chan', type: 'POST',
                strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID, strDaoTao_LopQuanLy_Id: r.DAOTAO_LOPQUANLY_ID,
                strMoTa: i.value, strNguoiThucHien_Id: '' });
        });
        if (!calls.length) { ui.toast('Không có thay đổi để lưu', 'info'); return; }
        ui.batch(calls, { title: 'Đang lưu', okText: 'Lưu thành công' }).then(function () { moi = []; tai(); });
    }

    function xoa(ids) {
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (ok) {
            if (!ok) return;
            ui.batch(ids.map(function (id) {
                return { action: C + 'Xoa_DangKy_NguoiHoc_Chan', strId: id, strChucNang_Id: '', strNguoiThucHien_Id: '' };
            }), { title: 'Đang xoá', okText: 'Xóa dữ liệu thành công!' }).then(tai);
        });
    }

    ums.report.mount(z('bc'), { collect: function () {}, onImported: tai });

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-bo]');
        if (b) { moi.splice(Number(b.getAttribute('data-bo')), 1); ve(); return; }
        b = ev.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') tim();
        else if (a === 'them') them();
        else if (a === 'luu') luu();
        else if (a === 'xoa') xoa(Array.prototype.map.call(z('bang').querySelectorAll('input[data-kdk]:checked'), function (c) { return c.getAttribute('data-kdk'); }));
    });
    root.addEventListener('change', function (ev) {
        if (!ev.target.hasAttribute('data-kdkall')) return;
        Array.prototype.forEach.call(z('bang').querySelectorAll('input[data-kdk]'), function (c) { c.checked = ev.target.checked; });
    });
    /* Giữ chữ đã gõ ở dòng MỚI khi bảng vẽ lại (thêm SV lần nữa, bỏ một dòng) */
    root.addEventListener('input', function (ev) {
        var k = ev.target.getAttribute('data-mt');
        if (k !== null && moi[Number(k)]) moi[Number(k)].MOTA = ev.target.value;
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim(); } });

    tai();
})();
