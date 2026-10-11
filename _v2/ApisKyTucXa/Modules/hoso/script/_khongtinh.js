/* =========================================================================
   Không tính miễn / Không tính phí — MỘT script cho hai màn (cờ theo id vùng gốc)
   Bản gốc: ApisKyTucXa/Modules/hoso/html/khongtinhmien.html + script/khongtinhmien.js (482 dòng)
             ApisKyTucXa/Modules/hoso/html/khongtinhphi.html  + script/khongtinhphi.js  (giống 90%: khác controller,
             màn phí không có hai ô Số tiền / Lý do)
   ---------------------------------------------------------------------------
   Bố cục gốc: MỘT cột — khung Tìm kiếm (Năm · Tháng · Từ khóa · nút Import) + "Danh sách kế hoạch" (Thêm mới · Xóa; bảng có
   ô đánh dấu); #zoneEdit thay chỗ danh sách: ô Ngày kiểm tra + từ khoá → bảng "Danh sách người ở" có ô đánh dấu, rồi hàng ô
   Năm · Tháng · Khoản thu · [Số tiền · Lý do] → Lưu (mỗi người ở đánh dấu một lời gọi ThemMoi, có tiến độ).
   Ở đây: ums.crud (danh sách + xoá nhiều) + pat.formTrang (biểu mẫu thêm) + ui.batch.
   Lời gọi (chép nguyên):
       <P>/LayDanhSach  GET  strTuKhoa, dNam (0 khi trống), dThang (0 khi trống), strTaiChinh_CacKhoanThu_Id (ô dropSearch_LoaiTinhPhi
                             không có trên trang → ''), pageIndex, pageSize
       <P>/ThemMoi      POST strKTX_DoiTuongOKTX_Id, dNam, dThang, strTaiChinh_CacKhoanThu_Id [, dSoTien, strLyDo — chỉ màn miễn]
       <P>/Xoa          POST strIds (mỗi dòng một lời gọi)
       KTX_DoiTuongOKyTucXa/LayDanhSach  người ở đang ở (dDoiTuongConDangOKTX 1, strNgayKiemTra, strTuKhoa; các ô lọc khác gốc đọc id
                             không có trên trang → rỗng)
       TC_KhoanThu/LayDanhSach  strNhomCacKhoanThu_Id "KTX", pageSize 100000 → ô Khoản thu
       Import: ums.report.mount (getList_MauImport "zonebtnDTKTM" / "zonebtnDTOTP")
       P = KTX_KhongTinh_Mien (miễn) | KTX_DSKhongTinh (phí)
   Giữ như gốc: lưu xong Ở LẠI biểu mẫu, danh sách phía sau nạp lại; nhánh CapNhat (obj_list.strId) không bao giờ chạy — bỏ.
   Khác gốc: tiêu đề khung "Danh sách kế hoạch" (chép từ màn khác) → "Danh sách không tính miễn / phí"; ô từ khoá gõ tự tìm.
   Cố ý bỏ: viewEdit_* (đọc 11 ô không có trên trang, không nơi nào gọi).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, esc = ui.esc, X = ums.ktxHoSo;
    var root = document.getElementById('ktx-khongtinhmien') || document.getElementById('ktx-khongtinhphi');
    if (!root) return;
    var MIEN = /mien$/.test(root.id);
    var P = MIEN ? 'KTX_KhongTinh_Mien/' : 'KTX_DSKhongTinh/';
    var TEN = MIEN ? 'Không tính miễn' : 'Không tính phí';

    var cols = [
        { title: 'Mã số', prop: 'KTX_DOITUONGOKYTUCXA_MASO', cls: 'is-nowrap' },
        { title: 'Họ Tên', render: function (r) { return esc(X.hoTen(r, 'KTX_DOITUONGOKYTUCXA_')); } },
        { title: 'Năm', prop: 'DAOTAO_THOIGIANDAOTAO_NAM', cls: 'is-center' },
        { title: 'Tháng', prop: 'DAOTAO_THOIGIANDAOTAO_THANG', cls: 'is-center' },
        { title: 'Khoản phí', prop: 'TAICHINH_CACKHOANTHU_TEN' }
    ];
    if (MIEN) cols.push({ title: 'Số tiền', cls: 'is-right is-nowrap', render: function (r) { return ui.money(r.SOTIEN); } }, { title: 'Lý do', prop: 'LYDO' });

    var crud = ums.crud({
        root: root, title: TEN, listTitle: 'Danh sách ' + TEN.toLowerCase(), icon: 'fa-money-bill-slash', canAdd: false, rowDelete: false,
        filters: [
            { key: 'nam', type: 'text', label: 'Năm' },
            { key: 'thang', type: 'text', label: 'Tháng' },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        toolbar: [{ text: 'Thêm mới', icon: 'fa-plus', mod: 'add', onClick: moThem }],
        list: { paged: true, call: function (f) {
            return { action: P + 'LayDanhSach', method: 'GET', strTuKhoa: f.q || '', dNam: f.nam ? f.nam : 0, dThang: f.thang ? f.thang : 0, strTaiChinh_CacKhoanThu_Id: '' };
        } },
        columns: cols,
        removeConfirm: function () { return 'Bạn có chắc chắn xóa dữ liệu không?'; },
        remove: function (ids) { return ids.map(function (id) { return { action: P + 'Xoa', method: 'POST', strIds: id }; }); }
    });
    var fq = root.querySelector('[data-cf="' + crud.uid + '"][data-scope="filter"][data-k="q"]'); if (fq) fq.setAttribute('data-tutim', '1');

    /* Import theo mẫu phân quyền (getList_MauImport gốc) */
    var act = crud.z('actions');
    if (act && ums.report && ums.report.mount) {
        var slot = document.createElement('span'); act.insertBefore(slot, act.firstChild);
        ums.report.mount(slot, { onImported: function () { crud.load(1); } });
    }

    /* ---------- Biểu mẫu thêm (thay chỗ danh sách) --------------------------- */
    function moThem() {
        var pg = { index: 1, size: 10, total: 0 }, nguoiO = [];
        var ft = pat.formTrang({ host: root, title: 'Thêm mới - ' + TEN, icon: 'fa-plus', cols: 1,
            body: '<div class="ums-filter ums-u-mb-4">' +
                    '<div class="ums-field"><input class="ums-input" data-kt="ngaykt" data-date placeholder="Ngày kiểm tra" autocomplete="off"></div>' +
                    '<div class="ums-field"><input class="ums-input" data-kt="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div></div>' +
                  '<div class="ums-legend">Danh sách người ở</div><div data-kt="ds"></div>' +
                  '<div class="ums-grid ums-grid--2 ums-u-mt-4">' +
                    ui.field('Năm', '<input class="ums-input" data-kt="nam" type="number" placeholder="Năm" autocomplete="off">') +
                    ui.field('Tháng', '<input class="ums-input" data-kt="thang" type="number" placeholder="Tháng" autocomplete="off">') +
                    ui.field('Khoản thu', '<select class="ums-select" data-kt="khoan" data-ph="Chọn khoản thu"><option value=""></option></select>') +
                    (MIEN ? ui.field('Số tiền', '<input class="ums-input" data-kt="sotien" type="number" placeholder="Số tiền" autocomplete="off">') +
                            ui.field('Lý do', '<input class="ums-input" data-kt="lydo" placeholder="Lý do" autocomplete="off">') : '') +
                  '</div>',
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function (api) { luu(); return false; } }]
        });
        var b = ft.body;
        function q(k) { return b.querySelector('[data-kt="' + k + '"]'); }
        function v(k) { return pat.val(q(k)); }
        ui.enhance(b);
        ums.api.call({ action: 'TC_KhoanThu/LayDanhSach', method: 'GET', strTuKhoa: '', strNhomCacKhoanThu_Id: 'KTX', strcanboquanly_id: '', pageIndex: 1, pageSize: 100000 })
            .then(function (d) { pat.fill(q('khoan'), X.arr(d.data), { head: 'Chọn khoản thu' }); }, X.loi('danh sách khoản thu'));

        pg.onChange = function (p) { if (p < 1 || p > Math.ceil(pg.total / pg.size)) return; taiNguoiO(p); };
        pg.onSize = function (s) { pg.size = s; taiNguoiO(1); };
        function taiNguoiO(p) {
            pg.index = p || 1;
            ums.api.call(X.dsCall({ strTuKhoa: v('q'), dDoiTuongConDangOKTX: 1, dBiKyLuat: -1, strNgayKiemTra: v('ngaykt'), pageIndex: pg.index, pageSize: pg.size })).then(function (d) {
                nguoiO = X.arr(d.data); pg.total = Number(d.pager) || nguoiO.length;
                var ds = q('ds');
                ui.table({ el: ds, rows: nguoiO, empty: 'Không có người ở', columns: [
                    { title: 'Mã số', prop: 'MASO', cls: 'is-nowrap' },
                    { title: 'Họ Tên', render: function (r) { return esc(X.hoTen(r)); } },
                    { title: 'Phòng', cls: 'is-center', render: function (r) { return esc(X.e(r.KTX_TOANHA_TEN) + ' - ' + X.e(r.KTX_PHONG_TEN)); } },
                    { head: '<input type="checkbox" data-kt="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                      render: function (r) { return '<input type="checkbox" data-ck="1" data-id="' + esc(r.ID) + '">'; } }
                ], page: pg });
            }, X.loi('danh sách người ở'));
        }
        var hen = 0;
        q('q').addEventListener('input', function () { clearTimeout(hen); hen = setTimeout(function () { taiNguoiO(1); }, 400); });
        q('q').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); clearTimeout(hen); taiNguoiO(1); } });
        if (window.jQuery) jQuery(q('ngaykt')).on('change', function () { taiNguoiO(1); });
        b.addEventListener('change', function (e) {
            if (!e.target.matches('[data-kt="all"]')) return;
            Array.prototype.forEach.call(b.querySelectorAll('[data-ck]'), function (c) { c.checked = e.target.checked; });
        });
        taiNguoiO(1);

        function luu() {
            var ids = Array.prototype.map.call(b.querySelectorAll('[data-ck]:checked'), function (c) { return c.getAttribute('data-id'); });
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn lưu dữ liệu không?').then(function (yes) {
                if (!yes) return;
                var calls = ids.map(function (id) {
                    var o = { action: P + 'ThemMoi', method: 'POST', strKTX_DoiTuongOKTX_Id: id, dNam: v('nam') ? v('nam') : 0, dThang: v('thang') ? v('thang') : 0, strTaiChinh_CacKhoanThu_Id: v('khoan') };
                    if (MIEN) { o.dSoTien = v('sotien') ? v('sotien') : 0; o.strLyDo = v('lydo'); }
                    return o;
                });
                ui.batch(calls, { title: 'Đang lưu ' + TEN.toLowerCase() }).then(function () { crud.load(1); });
            });
        }
    }
})();
