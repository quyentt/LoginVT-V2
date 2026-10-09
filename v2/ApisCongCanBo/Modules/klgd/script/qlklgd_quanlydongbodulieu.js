/* =========================================================================
   Quản lý đồng bộ dữ liệu (log Kafka) — cổng cán bộ, quản lý KLGD.
   Bản gốc: ApisCongCanBo/Modules/klgd/html/qlklgd_quanlydongbodulieu.html + script/qlklgd_quanlydongbodulieu.js
   ---------------------------------------------------------------------------
   Danh sách (phân trang máy chủ): TKGG_QLKLGD/GetThongTinLogKafka { strTrangThai ('' | THANHCONG | LOI), strTuNgay,
     strDenNgay, strSearch, strNguoiThucHienId, pageIndex, pageSize }.
   Gửi lại (POST): TKGG_QLKLGD/GuiLaiKafka { strKhoiLuongThoiKhoaBieuId: các GIATRI đã đánh dấu nối bằng ";",
     strNguoiThucHienId } — tên tham số lệch nghĩa nhưng giữ đúng như gốc. Xong thì nạp lại.
   Khác bản gốc: mở màn gốc KHÔNG nạp gì (phải bấm Tìm kiếm) — giữ; đánh dấu dòng theo chỉ số (gốc dựng id ô từ GIATRI
     → trùng / lỗi khi GIATRI có khoảng trắng).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, K = ums.klgd;
    var root = document.getElementById('klgd-qlklgd_quanlydongbodulieu');
    if (!root) return;
    root.innerHTML = pat.page('Quản lý đồng bộ dữ liệu') +
        pat.filterBar([
            { key: 'tt', type: 'select', label: 'Tất cả' },
            { key: 'tu', type: 'date', label: 'Từ ngày' }, { key: 'den', type: 'date', label: 'Đến ngày' },
            { key: 'q', label: 'Nhập từ khóa tìm kiếm' }
        ], { searchText: 'Tìm kiếm', extra: '<div class="ums-field ums-field--fit">' +
            ui.btn('save', { text: 'Gửi lại', icon: 'fa-paper-plane', attr: { 'data-a': 'guilai' } }) + '</div>' }) +
        pat.panel({ title: 'Danh sách', icon: 'fa-arrows-rotate', flush: true, count: 'dem', zone: 'bang' });
    ui.enhance(root);
    function F(k) { return root.querySelector('[data-f="' + k + '"]'); }
    pat.fill(F('tt'), [{ ID: 'THANHCONG', TEN: 'Thành công' }, { ID: 'LOI', TEN: 'Không thành công' }], { head: 'Tất cả' });

    var rows = [], trang = 1, co = 10, tong = 0;
    var bang = root.querySelector('[data-z="bang"]');
    function ve() {
        ui.table({ el: bang, rows: rows, empty: 'Không có dữ liệu', columns: [
            { title: 'Trạng thái', prop: 'TRANGTHAI', cls: 'is-nowrap' },
            { title: 'Giá trị', prop: 'GIATRI' },
            { title: 'Hành động', prop: 'SUKIEN' },
            { title: 'Kết quả', prop: 'KETQUAGUI' },
            { title: 'Ngày', prop: 'NGAYHETHONG', cls: 'is-nowrap' },
            { head: '<input type="checkbox" data-a="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                render: function (r, i) { return '<input type="checkbox" data-ck="' + i + '">'; } }],
            page: { index: trang, size: co, total: tong, onChange: function (p) { tai(p); }, onSize: function (n) { co = n === 'all' ? 1000000 : n; tai(1); } } });
    }
    function tai(p) {
        if (p) trang = p;
        bang.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
        K.g('TKGG_QLKLGD/GetThongTinLogKafka', { strTrangThai: F('tt').value, strTuNgay: F('tu').value, strDenNgay: F('den').value,
            strSearch: F('q').value.trim(), strNguoiThucHienId: K.uid(), pageIndex: trang, pageSize: co }).then(function (r) {
            rows = K.arr(r.data); tong = Number(r.pager) || rows.length;
            root.querySelector('[data-z="dem"]').textContent = '(' + tong + ')';
            ve();
        }).catch(function (err) { bang.innerHTML = ui.fail(err.message); ums.api.handle(err, 'log đồng bộ'); });
    }
    function guiLai() {
        var chon = Array.prototype.slice.call(bang.querySelectorAll('[data-ck]:checked')).map(function (x) { return rows[Number(x.getAttribute('data-ck'))]; });
        if (!chon.length) { ui.toast('Vui lòng chọn đối tượng cần thực hiện?', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn thực hiện?', { ok: 'Gửi lại' }).then(function (yes) {
            if (!yes) return;
            K.g('TKGG_QLKLGD/GuiLaiKafka', { strKhoiLuongThoiKhoaBieuId: chon.map(function (r) { return K.e(r.GIATRI); }).join(';'),
                strNguoiThucHienId: K.uid() }, true).then(function () { ui.toast('Đã gửi lại ' + chon.length + ' dòng', 'ok'); tai(); })
                .catch(function (err) { ums.api.handle(err, 'gửi lại'); });
        });
    }
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') tai(1);
        else if (a === 'guilai') guiLai();
        else if (a === 'all') bang.querySelectorAll('[data-ck]').forEach(function (x) { x.checked = b.checked; });
    });
    F('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(1); } });
    bang.innerHTML = ui.empty('Chọn điều kiện rồi bấm Tìm kiếm', 'fa-magnifying-glass');
})();
