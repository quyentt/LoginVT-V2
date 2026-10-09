/* =========================================================================
   Tính điểm sản phẩm — kết quả tính điểm NCKH theo cán bộ × loại sản phẩm
   Bản gốc: ApisNCKH/Modules/tinhdiem/script/tinhdiemsanpham.js + html/tinhdiemsanpham.html
   Bố cục như gốc (MỘT cột): khung Tìm kiếm (Kế hoạch, Đơn vị, Tình trạng xác nhận, Từ khoá, Tìm kiếm, Báo cáo)
   + khung "Danh sách tính điểm" có nút "Tính điểm"; bảng tiêu đề ba tầng:
     Thông tin cán bộ (Mã, Họ tên, Đơn vị) | Kết quả tính điểm sản phẩm → <từng loại sản phẩm> (Điểm, Giờ chuẩn) … | Tổng (Điểm, Giờ chuẩn)
   + dòng tổng cuối bảng (insertSumAfterTable của gốc).
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       NCKH_TinhDiem_KeHoach/LayDanhSach            GET  strTuKhoa '' (gốc đọc txtAAAA), strNguoiThucHien_Id, 1/1000000 — ô Kế hoạch (tên MOTA)
       ums.ref.coCauToChuc                          ô Đơn vị (edu.system.getList_CoCauToChuc, iTrangThai 1)
       danh mục NCKH.XNKK                           ô Tình trạng xác nhận (chọn nhiều) — CHỈ gửi cho mẫu báo cáo (như gốc)
       NCKH_PhanBoTinhDiem/LayDSNCKH_TinhDiem_KetQua GET strTuKhoa, strNCKH_TinhDiem_KeHoach_Id, strDaoTao_CoCauToChuc_Id, strNguoiThucHien_Id
                                                        → Data = { rsNhanSu (MASO, HODEM, TEN, DAOTAO_COCAUTOCHUC_TEN), rsLoaiSanPham (ID, TEN) }
       NCKH_PhanBoTinhDiem/LayKQCaNhan              GET  strNCKH_TinhDiem_KeHoach_Id, strLoaiSanPham_Id, strNhanSu_HoSoCanBo_Id
                                                        — MỖI Ô cán bộ × loại một lời gọi (như gốc) → DIEM, GIOCHUAN
       NCKH_TinhDiem/TinhDiem_NCKH                  POST strId '', strChucNang_Id, strNCKH_TinhDiem_KeHoach_Id, strNguoiThucHien_Id
       Mẫu báo cáo: strNCKH_TinhDiem_KeHoach_Id, strDaoTao_CoCauToChuc_Id, strTinhTrangXacNhan_Id (nối dấu phẩy), strTuKhoa.
   Gốc chạy N×M lời gọi cùng lúc + thanh tiến độ, rồi mới cộng cột Tổng và dòng tổng. Ở đây chạy qua ums.ui.batch
   (6 luồng, hộp tiến độ) rồi vẽ bảng MỘT lần với đủ số.
   Bỏ mã chết: khung biểu mẫu "Chỉnh sửa - Tính điểm" (không nút nào mở được), nhánh CapNhat / Xoa của
   NCKH_TinhDiemSanPham_KeHoach (strId luôn rỗng), vòng lặp #tbl_HeKhoa / #tblInputDanhSachNhanSu (bảng không có).
   Tự chốt: bắt chọn Kế hoạch trước khi Tìm kiếm / Tính điểm (gốc gửi rỗng); Tính điểm hỏi lại trước khi chạy.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('nckh-tinhdiemsanpham');
    if (!root) return;
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function so(v) { var n = parseFloat(v); return isNaN(n) ? 0 : n; }
    function tron(n) { return Math.floor(n * 100) / 100; }

    root.innerHTML = pat.page('Tính điểm sản phẩm', '<div data-z="bc"></div>') +
        pat.filterBar([
            { key: 'kh', type: 'select', label: 'Chọn kế hoạch' },
            { key: 'dv', type: 'select', label: 'Chọn đơn vị' },
            { key: 'tt', type: 'select', label: 'Tất cả tình trạng xác nhận', multiple: true },
            { key: 'q', label: 'Nhập từ khóa tìm kiếm' }
        ]) +
        pat.panel({ title: 'Danh sách tính điểm', icon: 'fa-list-ul', count: 'n', flush: true, zone: 'bang',
            tools: ui.btn('confirm', { text: 'Tính điểm', icon: 'fa-calculator', mod: 'primary', attr: { 'data-a': 'tinh' } }),
            body: ui.empty('Chọn kế hoạch rồi bấm Tìm kiếm', 'fa-filter') });
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

    ums.api.call({ action: 'NCKH_TinhDiem_KeHoach/LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 1000000 })
        .then(function (r) { pat.fill(f('kh'), arr(r.data), { name: 'MOTA' }); })
        .catch(function (err) { ums.api.handle(err, 'kế hoạch tính điểm'); });
    ums.ref.coCauToChuc({ iTrangThai: 1 }).then(function (d) { pat.fill(f('dv'), d, { name: 'TEN' }); })
        .catch(function (err) { ums.api.handle(err, 'đơn vị'); });
    ums.api.dm('NCKH.XNKK').then(function (d) { pat.fill(f('tt'), d); }).catch(function (err) { ums.api.handle(err, 'tình trạng xác nhận'); });
    function ttVal() { return window.jQuery ? (jQuery(f('tt')).val() || []).filter(Boolean).join(',') : ''; }

    ums.report.mount(z('bc'), { collect: function (add) {
        add('strNCKH_TinhDiem_KeHoach_Id', f('kh').value); add('strDaoTao_CoCauToChuc_Id', f('dv').value);
        add('strTinhTrangXacNhan_Id', ttVal()); add('strTuKhoa', f('q').value.trim());
    } });

    function ve(ns, loai, kq) {
        var cols = [
            { title: 'Mã cán bộ', prop: 'MASO', cls: 'is-nowrap', group: ['Thông tin cán bộ'] },
            { title: 'Họ tên', cls: 'is-nowrap', group: ['Thông tin cán bộ'], render: function (r) { return ui.esc((e(r.HODEM) + ' ' + e(r.TEN)).trim()); } },
            { title: 'Đơn vị', prop: 'DAOTAO_COCAUTOCHUC_TEN', group: ['Thông tin cán bộ'] }
        ];
        function o(r, lId, k) { var x = (kq[r.ID] || {})[lId]; return x ? x[k] : ''; }
        function tong(r, k) { return loai.reduce(function (a, l) { return a + so(o(r, l.ID, k)); }, 0); }
        function cot(title, grp, val) {
            return { title: title, cls: 'is-center', group: ['Kết quả tính điểm sản phẩm', grp], render: function (r) { return ui.esc(e(val(r))); },
                sum: function (rows) { return '<b>' + tron(rows.reduce(function (a, r) { return a + so(val(r)); }, 0)) + '</b>'; } };
        }
        loai.forEach(function (l) {
            cols.push(cot('Điểm', e(l.TEN), function (r) { return o(r, l.ID, 'DIEM'); }));
            cols.push(cot('Giờ chuẩn', e(l.TEN), function (r) { return o(r, l.ID, 'GIOCHUAN'); }));
        });
        var cD = cot('Điểm', 'Tổng', function (r) { return tron(tong(r, 'DIEM')); });
        var cG = cot('Giờ chuẩn', 'Tổng', function (r) { return tron(tong(r, 'GIOCHUAN')); });
        cD.cls = cG.cls = 'is-center ums-u-bold';
        cols.push(cD, cG);
        z('n').textContent = '(' + ns.length + ')';
        ui.table({ el: z('bang'), rows: ns, columns: cols, empty: 'Không có cán bộ nào' });
    }
    function tai() {
        if (!f('kh').value) { ui.toast('Vui lòng chọn kế hoạch', 'warn'); return; }
        var kh = f('kh').value;
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'NCKH_PhanBoTinhDiem/LayDSNCKH_TinhDiem_KetQua', method: 'GET', strTuKhoa: f('q').value.trim(),
            strNCKH_TinhDiem_KeHoach_Id: kh, strDaoTao_CoCauToChuc_Id: f('dv').value, strNguoiThucHien_Id: uid() })
            .then(function (r) {
                var d = r.data || {}, ns = arr(d.rsNhanSu), loai = arr(d.rsLoaiSanPham), kq = {};
                var goi = [];
                ns.forEach(function (n) {
                    loai.forEach(function (l) {
                        goi.push(function () {
                            return ums.api.call({ action: 'NCKH_PhanBoTinhDiem/LayKQCaNhan', method: 'GET', silent: true,
                                strNCKH_TinhDiem_KeHoach_Id: kh, strLoaiSanPham_Id: l.ID, strNhanSu_HoSoCanBo_Id: n.ID })
                                .then(function (x) {
                                    arr(x.data).forEach(function (j) { (kq[n.ID] = kq[n.ID] || {})[l.ID] = { DIEM: j.DIEM, GIOCHUAN: j.GIOCHUAN }; });
                                });
                        });
                    });
                });
                return ui.batch(goi, { title: 'Đang tải kết quả tính điểm', concurrency: 6, toast: false })
                    .then(function (b) {
                        if (b.fail) ui.toast(b.fail + ' ô không tải được kết quả: ' + b.errors[0], 'warn');
                        ve(ns, loai, kq);
                    });
            })
            .catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'kết quả tính điểm'); });
    }
    function tinh() {
        if (!f('kh').value) { ui.toast('Vui lòng chọn kế hoạch', 'warn'); return; }
        ui.confirm('Tính điểm sản phẩm cho kế hoạch đang chọn?', { ok: 'Tính điểm', title: 'Tính điểm' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({ action: 'NCKH_TinhDiem/TinhDiem_NCKH', method: 'POST', strId: '', strChucNang_Id: (ums.state && ums.state.chucNangId) || '',
                strNCKH_TinhDiem_KeHoach_Id: f('kh').value, strNguoiThucHien_Id: uid() })
                .then(function () { ui.toast('Tính điểm thành công!', 'ok'); tai(); })
                .catch(function (err) { ums.api.handle(err, 'tính điểm'); });
        });
    }
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b) return;
        if (b.getAttribute('data-a') === 'search') tai();
        else if (b.getAttribute('data-a') === 'tinh') tinh();
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(); } });
})();
