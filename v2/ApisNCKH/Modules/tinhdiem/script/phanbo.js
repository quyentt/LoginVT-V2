/* =========================================================================
   Phân bổ tính điểm — gán thành viên sản phẩm vào kế hoạch tính điểm
   Bản gốc: ApisNCKH/Modules/tinhdiem/script/phanbo.js + html/phanbo.html
   Bố cục như gốc (MỘT cột): khung Tìm kiếm (Kế hoạch, Từ khoá, Tìm kiếm) + khung "Danh sách phân bổ"
   (nút Thêm mới; bảng có ô đánh dấu; xoá các dòng đã chọn). "Thêm mới" → khung "Thêm mới - Phân bổ" THAY
   CHỖ danh sách: ô Loại sản phẩm + bảng sản phẩm CHƯA phân bổ có ô đánh dấu + nút "Phân bổ".
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       NCKH_TinhDiem_KeHoach/LayDanhSach           GET  strTuKhoa '', strNguoiThucHien_Id, 1/1000000 — ô Kế hoạch (tên MOTA)
       NCKH_PhanBoTinhDiem/LayDanhSach             GET  strTuKhoa, strNCKH_TinhDiem_KeHoach_Id, strNguoiThucHien_Id, pageIndex, pageSize
       NCKH_PhanBoTinhDiem/LayDSNCKH_SP_ChuaPhanBo GET  strTuKhoa '', strLoaiSanPham_Id, strNCKH_TinhDiem_KeHoach_Id, strNguoiThucHien_Id, pageIndex, pageSize
       NCKH_PhanBoTinhDiem/ThemMoi                 POST strId '', strChucNang_Id, strNCKH_TinhDiem_KeHoach_Id, strNCKH_SP_ThanhVien_Id = ID dòng, strNguoiThucHien_Id
       NCKH_PhanBoTinhDiem/Xoa                     POST strIds = ID dòng, strNguoiThucHien_Id — mỗi dòng một lời gọi (như gốc)
   Danh mục: NCKH.LOAISANPHAM. Cột: THONGTINSANPHAM, THONGTINTHANHVIEN, VAITRO_TEN, DIEM, GIOCHUAN.
   Khác gốc:
     · Ô từ khoá: gốc có trên màn nhưng lời gọi đọc txtAAAA (không tồn tại) → luôn gửi rỗng. Nay gửi từ khoá của ô.
     · Nhánh CapNhat (strId luôn rỗng) và ô txtTenPhanBo/txtMoTa… (không có trên màn) → bỏ.
   Tự chốt: "Phân bổ" bắt chọn Kế hoạch (gốc gửi rỗng); lưu / xoá hàng loạt qua ums.ui.batch (hộp tiến độ như gốc).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('nckh-phanbo');
    if (!root) return;
    function arr(d) { return Array.isArray(d) ? d : []; }
    function uid() { return (ums.session && ums.session.userId) || ''; }
    var C = 'NCKH_PhanBoTinhDiem';
    var st = { ds: { page: 1, size: 10, rows: [], total: 0 }, chua: { page: 1, size: 10, rows: [], total: 0 } };

    root.innerHTML = '<div data-v="ds">' +
        pat.page('Phân bổ', ui.btn('add', { attr: { 'data-a': 'them' } })) +
        pat.filterBar([
            { key: 'kh', type: 'select', label: 'Chọn kế hoạch' },
            { key: 'q', label: 'Nhập từ khóa tìm kiếm' }
        ]) +
        pat.panel({ title: 'Danh sách phân bổ', icon: 'fa-list-ul', count: 'n', flush: true, zone: 'bang',
            tools: ui.xoaChon('input[data-ck="ds"]', { attr: { 'data-a': 'xoa' } }) }) +
        '</div><div data-v="them" hidden>' +
        pat.page('Thêm mới - Phân bổ', ui.btn('close', { attr: { 'data-a': 'dong' } }) +
            ui.btn('save', { text: 'Phân bổ', attr: { 'data-a': 'phanbo' } })) +
        pat.filterBar([{ key: 'loai', type: 'select', label: 'Chọn loại sản phẩm' }], { search: false }) +
        pat.panel({ title: 'Danh sách sản phẩm chưa phân bổ', icon: 'fa-list-check', count: 'nchua', flush: true, zone: 'chua' }) +
        '</div>';
    ui.enhance(root);
    var vDs = root.querySelector('[data-v="ds"]'), vThem = root.querySelector('[data-v="them"]');
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

    ums.api.call({ action: 'NCKH_TinhDiem_KeHoach/LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 1000000 })
        .then(function (r) { pat.fill(f('kh'), arr(r.data), { name: 'MOTA' }); })
        .catch(function (err) { ums.api.handle(err, 'kế hoạch tính điểm'); });
    ums.api.dm('NCKH.LOAISANPHAM').then(function (d) { pat.fill(f('loai'), d); }).catch(function (err) { ums.api.handle(err, 'loại sản phẩm'); });

    function cotChon(k) {
        return { head: '<input type="checkbox" data-all="' + k + '" title="Chọn tất cả">', cls: 'is-center', width: '44px',
            render: function (r, i) { return '<input type="checkbox" data-ck="' + k + '" data-i="' + i + '">'; } };
    }
    var COT = [
        { title: 'Thông tin sản phẩm', prop: 'THONGTINSANPHAM' },
        { title: 'Thông tin thành viên', prop: 'THONGTINTHANHVIEN' },
        { title: 'Vai trò thành viên', prop: 'VAITRO_TEN' }
    ];
    function ve(k) {
        var s = st[k], ds = k === 'ds';
        z(ds ? 'n' : 'nchua').textContent = '(' + s.total + ')';
        ui.table({ el: z(ds ? 'bang' : 'chua'), rows: s.rows, empty: ds ? 'Chưa có phân bổ nào' : 'Không có sản phẩm chưa phân bổ',
            columns: COT.concat(ds ? [{ title: 'Điểm', prop: 'DIEM', cls: 'is-center' }, { title: 'Giờ chuẩn', prop: 'GIOCHUAN', cls: 'is-center' }] : [], [cotChon(k)]),
            page: { index: s.page, size: s.size, total: s.total,
                onChange: function (p) { if (p >= 1 && p <= Math.ceil(s.total / s.size)) tai(k, p); },
                onSize: function (v) { s.size = v; tai(k, 1); } } });
    }
    function tai(k, page) {
        var s = st[k], ds = k === 'ds';
        s.page = page || 1;
        var el = z(ds ? 'bang' : 'chua');
        el.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        var goi = ds
            ? { action: C + '/LayDanhSach', method: 'GET', strTuKhoa: f('q').value.trim(), strNCKH_TinhDiem_KeHoach_Id: f('kh').value, strNguoiThucHien_Id: uid() }
            : { action: C + '/LayDSNCKH_SP_ChuaPhanBo', method: 'GET', strTuKhoa: '', strLoaiSanPham_Id: f('loai').value, strNCKH_TinhDiem_KeHoach_Id: f('kh').value, strNguoiThucHien_Id: uid() };
        goi.pageIndex = s.page; goi.pageSize = s.size;
        ums.api.call(goi).then(function (r) {
            s.rows = arr(r.data); s.total = Number(r.pager) || s.rows.length; ve(k);
        }).catch(function (err) { el.innerHTML = ui.fail(err.message); ums.api.handle(err, ds ? 'danh sách phân bổ' : 'sản phẩm chưa phân bổ'); });
    }
    function chon(k) {
        return Array.prototype.filter.call(root.querySelectorAll('input[data-ck="' + k + '"]'), function (c) { return c.checked; })
            .map(function (c) { return st[k].rows[Number(c.getAttribute('data-i'))]; }).filter(Boolean);
    }
    function phanBo() {
        var rows = chon('chua');
        if (!rows.length) { ui.toast('Vui lòng chọn đối tượng cần thêm', 'warn'); return; }
        if (!f('kh').value) { ui.toast('Vui lòng chọn kế hoạch ở khung tìm kiếm', 'warn'); return; }
        ui.confirm('Phân bổ ' + rows.length + ' sản phẩm đã chọn vào kế hoạch?', { ok: 'Phân bổ', title: 'Phân bổ' }).then(function (yes) {
            if (!yes) return;
            ui.batch(rows.map(function (r) {
                return { action: C + '/ThemMoi', method: 'POST', strId: '', strChucNang_Id: (ums.state && ums.state.chucNangId) || '',
                    strNCKH_TinhDiem_KeHoach_Id: f('kh').value, strNCKH_SP_ThanhVien_Id: r.ID, strNguoiThucHien_Id: uid() };
            }), { title: 'Đang phân bổ', okText: 'Thêm mới thành công', show: true }).then(function () { tai('ds', st.ds.page); tai('chua', 1); });
        });
    }
    function xoa() {
        var rows = chon('ds');
        if (!rows.length) { ui.toast('Vui lòng chọn đối tượng cần xóa', 'warn'); return; }
        ui.confirm('Xoá ' + rows.length + ' dòng phân bổ đã chọn?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
            if (!yes) return;
            ui.batch(rows.map(function (r) { return { action: C + '/Xoa', method: 'POST', strIds: r.ID, strNguoiThucHien_Id: uid() }; }),
                { title: 'Đang xoá', okText: 'Xóa dữ liệu thành công', show: true }).then(function () { tai('ds', 1); });
        });
    }

    if (window.jQuery) {
        jQuery(f('kh')).on('select2:select select2:clear', function () { tai('ds', 1); });
        jQuery(f('loai')).on('select2:select select2:clear', function () { tai('chua', 1); });
    }
    root.addEventListener('change', function (ev) {
        var k = ev.target.getAttribute && ev.target.getAttribute('data-all');
        if (k) Array.prototype.forEach.call(root.querySelectorAll('input[data-ck="' + k + '"]'), function (c) { c.checked = ev.target.checked; });
    });
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') tai('ds', 1);
        else if (a === 'them') { ui.swap(vDs, vThem); tai('chua', 1); }
        else if (a === 'dong') ui.swap(vThem, vDs);
        else if (a === 'phanbo') phanBo();
        else if (a === 'xoa') xoa();
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai('ds', 1); } });
    tai('ds', 1);
})();
