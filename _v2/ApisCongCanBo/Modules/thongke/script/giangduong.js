/* =========================================================================
   Thống kê giảng đường (tiết giảng theo giai đoạn)
   Bản gốc: ApisCongCanBo/Modules/thongke/script/giangduong.js + html/giangduong.html
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       KHCT_Quyen_ThongTin/LayDSKhoaQuanLyPhanQuyen    GET  ô Đơn vị
       NS_HoSoV2/LayDanhSach                           ô Thành viên — theo đơn vị, dLaCanBoNgoaiTruong 0, pageSize 100000
       ums.ref.heDaoTao                                ô Hệ đào tạo
       TKGG_GiangDuongTrucTuyen/LayDSLichGiangTheoGiaiDoan GET → Data.{ rsTongHop (bảng), rs (chi tiết từng buổi) }
   Mẫu báo cáo: strDaoTao_CoCauToChuc_Id, strGiangVien_Id, strTuNgay, strDenNgay.
   Giữ như bản gốc: ô "Nhập từ khóa" chỉ để bấm Enter tìm — không gửi đi.
   Khác bản gốc (lỗi rõ ràng, ghi lại):
     · Tiêu đề hộp "Quá trình" chép cứng "Phạm Quý Dương - 20042" (đặt chữ vào
       .SinhVienDaChon không có) → hiện đúng giảng viên đang xem.
     · Bảng quá trình: dữ liệu Giảng đường / Lớp học phần đổ NGƯỢC so với tiêu đề → đổ đúng cột.
   Theo luật chung: chưa chọn Đơn vị thì khoá Thành viên.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('tk-giangduong');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }

    root.innerHTML = pat.page('Thống kê giảng đường', '<div data-z="bc"></div>') +
        pat.filterBar([
            { key: 'dv', label: 'Chọn đơn vị', type: 'select' },
            { key: 'gv', label: 'Chọn thành viên', type: 'select' },
            { key: 'he', label: 'Chọn hệ đào tạo', type: 'select' },
            { key: 'tu', label: 'Từ ngày', type: 'date' },
            { key: 'den', label: 'Đến ngày', type: 'date' },
            { key: 'q', label: 'Nhập từ khóa tìm kiếm' }
        ]) +
        pat.panel({ title: 'Danh sách', icon: 'fa-list-timeline', count: 'n', flush: true, zone: 'bang' });
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    var dl = { rsTongHop: [], rs: [] };

    ums.api.call({ action: 'KHCT_Quyen_ThongTin/LayDSKhoaQuanLyPhanQuyen', method: 'GET', strNguoiThucHien_Id: uid(), silent: true })
        .then(function (r) { pat.fill(f('dv'), arr(r.data), { name: 'TEN' }); }).catch(function (err) { ums.api.handle(err, 'đơn vị'); });
    ums.ref.heDaoTao({ pageIndex: 1, pageSize: 1000000 }).then(function (d) { pat.fill(f('he'), d, { name: 'TENHEDAOTAO' }); }).catch(function (err) { ums.api.handle(err, 'hệ đào tạo'); });
    function napGV() {
        return ums.api.call({ action: 'NS_HoSoV2/LayDanhSach', method: 'GET', strTuKhoa: '', pageIndex: 1, pageSize: 100000, strDaoTao_CoCauToChuc_Id: f('dv').value,
            strNguoiThucHien_Id: '', dLaCanBoNgoaiTruong: 0, silent: true })
            .then(function (r) { pat.fill(f('gv'), arr(r.data), { name: function (x) { return e(x.HOTEN) + ' - ' + e(x.MASO); } }); })
            .catch(function (err) { ums.api.handle(err, 'thành viên'); });
    }
    if (window.jQuery) jQuery(f('dv')).on('select2:select', napGV);
    ums.pat.chain([f('dv'), f('gv')], { phatLai: false });

    function tai() {
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'TKGG_GiangDuongTrucTuyen/LayDSLichGiangTheoGiaiDoan', method: 'GET', strDaoTao_HeDaoTao_Id: f('he').value,
            strDaoTao_CoCauToChuc_Id: f('dv').value, strGiangVien_Id: f('gv').value, strNguoiThucHien_Id: uid(),
            strTuNgay: f('tu').value.trim(), strDenNgay: f('den').value.trim() }).then(function (r) {
            dl = r.data || {};
            var rows = arr(dl.rsTongHop);
            z('n').textContent = '(' + rows.length + ')';
            ui.table({ el: z('bang'), rows: rows, empty: 'Không có dữ liệu', columns: [
                { title: 'Đơn vị', prop: 'DAOTAO_COCAUTOCHUC_TEN' },
                { title: 'Mã số', prop: 'GIANGVIEN_MASO', cls: 'is-nowrap' },
                { title: 'Họ tên', prop: 'GIANGVIEN_HOTEN' },
                { title: 'Tổng số tiết giảng', prop: 'TONGSOTIET', cls: 'is-center' },
                { title: 'Xem', cls: 'is-center', width: '60px', render: function (x, i) {
                    return '<button type="button" class="ums-iconbtn" data-xem="' + i + '" title="Xem quá trình"><i class="fa-light fa-eye"></i></button>'; } },
                { head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (x, i) { return '<input type="checkbox" data-ck="' + i + '">'; } }
            ] });
        }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'thống kê giảng đường'); });
    }
    function xem(g) {
        var ds = arr(dl.rs).filter(function (x) { return x.GIANGVIEN_ID === g.GIANGVIEN_ID; });
        var dlg = ui.dialog({ title: 'Quá trình - ' + e(g.GIANGVIEN_HOTEN) + ' - ' + e(g.GIANGVIEN_MASO), icon: 'fa-clock-rotate-left', size: 'xl', body: '<div data-z="qt"></div>' });
        ui.table({ el: dlg.body.querySelector('[data-z="qt"]'), rows: ds, empty: 'Không có buổi giảng', columns: [
            { title: 'Ngày', prop: 'NGAYHOC', cls: 'is-center is-nowrap' },
            { title: 'Tiết bắt đầu', prop: 'TIETBATDAU', cls: 'is-center' },
            { title: 'Tiết kết thúc', prop: 'TIETKETTHUC', cls: 'is-center' },
            { title: 'Số tiết', prop: 'SOTIET', cls: 'is-center' },
            { title: 'Lớp học phần', prop: 'DAOTAO_LOPHOCPHAN_TEN' },
            { title: 'Giảng đường', prop: 'GIANGDUONG_TEN' }
        ] });
    }
    ums.report.mount(z('bc'), { collect: function (add) {
        add('strDaoTao_CoCauToChuc_Id', f('dv').value); add('strGiangVien_Id', f('gv').value);
        add('strTuNgay', f('tu').value.trim()); add('strDenNgay', f('den').value.trim());
    } });
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a="search"], [data-xem]');
        if (!b) return;
        if (b.hasAttribute('data-xem')) xem(arr(dl.rsTongHop)[Number(b.getAttribute('data-xem'))]); else tai();
    });
    z('bang').addEventListener('change', function (ev) {
        if (ev.target.getAttribute('data-ck') === 'all') Array.prototype.forEach.call(z('bang').querySelectorAll('input[data-ck]'), function (c) { c.checked = ev.target.checked; });
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(); } });
    z('bang').innerHTML = ui.empty('Chọn điều kiện rồi bấm Tìm kiếm', 'fa-filter');
})();
