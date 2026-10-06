/* =========================================================================
   Khai báo xác nhận phạm vi khác (Thống kê giờ giảng → Tổng hợp giờ)
   Bản gốc: ApisTKGG/Modules/kehoach/html/xacdinhphamvi.html + script/xacdinhphamvi.js (1.747 dòng)
   ---------------------------------------------------------------------------
   Một cột như gốc: bộ lọc Thời gian → KH tổng hợp → KH chi tiết (ums.tkgg.boLocKeHoach họ 'plain') + Tìm kiếm + Import + báo cáo;
   bảng "dữ liệu khác" của kế hoạch chi tiết (phân trang máy chủ) với cột tình trạng xác nhận theo từng loại (dm KLGD.PHANLOAIXACNHAN);
   nút Xác nhận hàng loạt (ums.tkgg.xacNhan); biểu mẫu thêm / sửa TRONG TRANG (ums.crud): Mã · Tên · Hệ đào tạo + lưới "Giảng viên"
   (ums.pat.rows — thêm cán bộ bằng hộp chọn nhân sự ums.pat.pickNhanSu, lưu từng dòng sau khi có id bản ghi cha).

   Lời gọi (chép nguyên):
       TKGG_KeHoach/LayDSThoiGianTongHopKL · LayDSKLGD_TongHopKhoiLuong · LayDSKLGD_KeHoachChiTiet   GET (bộ lọc — _tkgg.js)
       Danh mục KLGD.PHANLOAIXACNHAN (cột tình trạng + hộp xác nhận), KLGD.DOANKL.VAITRO (cột Vai trò của lưới)
       edu.system.getList_HeDaoTao → ums.ref.heDaoTao (ô Hệ đào tạo, TENHEDAOTAO); getList_CoCauToChuc → ums.ref.coCauToChuc (cột Tính cho khoa chuyên môn)
       TKGG_KeHoach/LayDSKLGD_DuLieu_Khac      GET   strTuKhoa '', strKLGD_KeHoachChiTiet_Id, pageIndex, pageSize
       TKGG_XacNhan/LayTTKLGD_PhanLoai_XacNhan GET   mỗi dòng × mỗi loại một lời gọi (như gốc) → HANHDONG_TEN
       TKGG_KeHoach/Them_KLGD_DuLieu_Khac | Sua_KLGD_DuLieu_Khac   POST  strId, strKLGD_KeHoachChiTiet_Id, strDuLieuXacNhan_Ma, strDuLieuXacNhan_Ten, strDaoTao_HeDaoTao_Id, strMoTa ''
       TKGG_KeHoach/Xoa_KLGD_DuLieu_Khac       POST  strIds (nút Xóa trong biểu mẫu; strChucNang_Id hệ tự chèn)
       TKGG_KeHoach/LayDSKLGD_DuLieu_Khac_CT   GET   strTuKhoa '', strKLGD_DuLieu_Id
       TKGG_KeHoach/Them_KLGD_DuLieu_Khac_CT | Sua_KLGD_DuLieu_Khac_CT   POST  mỗi dòng lưới một lời gọi (tham số như gốc)
       TKGG_KeHoach/Xoa_KLGD_DuLieu_Khac_CT    POST  strIds
       TKGG_XacNhan/Them_KLGD_PhanLoai_XacNhan · LayHanhDongXacNhanNguoiDung   (hộp xác nhận — _tkgg.js)
       edu.system.getList_MauImport → ums.report.mount (addKeyValue như gốc: thời gian, kế hoạch (strDangKy_KeHoachDangKy_Id = strKLGD_TongHopKhoiLuong_Id = KH tổng hợp),
                                      KH chi tiết, strDangKy_XacDinhPhamVi_Id từng dòng đánh dấu)
       Nút "Import giờ giảng" (btnImportWithProce IMPORTWITHPROC_DLKCT) → ums.report.importChung  — KIỂM TRÊN HOST
   Giữ như gốc: pageSize 10; Mã / Tên không bắt buộc (gốc không kiểm); lưu bản ghi cha xong lưu từng dòng lưới.
   Khác gốc (lỗi rõ ràng):
     · Nút "Khóa dữ liệu" gốc không có xử lý → giữ, disabled. Xoá nhiều (btnXacDinhPhamVi), Tạo dữ liệu (btnTaoDuLieu — hàm rỗng), Xác nhận tự động
       (btnXacNhanTuDong): gốc có xử lý nhưng KHÔNG có nút trên html → cố ý bỏ.
     · Sửa gốc đổ ô dropHeDaoTao từ DAOTAO_HEDAOTAO_ID, nhưng Mô tả / lưới gửi strMoTa '' (txtAAAA) → giữ ''.
     · Ô "Tính cho khoa chuyên môn" của dòng mới gốc có mục đầu "--- Chọn Xếp loại--" (chép nhầm) → "Chọn đơn vị".
     · Hộp xác nhận: gốc gửi từng dòng không tiến độ gộp → ui.batch.
   Cố ý bỏ: các ô lọc DKH (Hệ / Khoá / CT / Lớp QL / Năm nhập học / Học phần) và bảng tblXacDinhPhamViAdd — gốc đã ghi chú trong html, không có trên màn;
   khối "Chọn trạng thái sinh viên" (ckbDSTrangThaiSV) không có; ảnh trang trí img-kehoach_2.svg.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, T = ums.tkgg;
    var root = document.getElementById('tkgg-xacdinhphamvi');
    if (!root) return;
    function e(v) { return T.e(v); }
    var KH = 'TKGG_KeHoach/';

    root.innerHTML = pat.page('Khai báo xác nhận phạm vi khác', '<span data-z="imp"></span> <span data-z="bc"></span>') +
        pat.panel({ title: 'Tìm kiếm', icon: 'fa-magnifying-glass', cls: 'ums-u-mb-4', body: '<div class="ums-grid ums-grid--3" data-z="kh"></div>' }) +
        '<div data-z="ds"></div>';
    var bl = T.boLocKeHoach(root.querySelector('[data-z="kh"]'), { loai: 'plain', muc: 3, onDoi: function (k) { if (k === 'ct' && crud) crud.load(1); } });
    root.querySelector('[data-z="imp"]').innerHTML = ui.btn('importer', { text: 'Import giờ giảng', attr: { 'data-a': 'import' } });
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a="import"]'); if (!b) return;
        ums.report.importChung('Import giờ giảng', 'IMPORTWITHPROC_DLKCT', { onDone: function () { if (crud) crud.load(); } });
    });
    ums.report.mount(root.querySelector('[data-z="bc"]'), { collect: function (add) {
        add('strDaoTao_ThoiGianDaoTao_Id', bl.v('tg')); add('strDangKy_KeHoachDangKy_Id', bl.v('th')); add('strKLGD_TongHopKhoiLuong_Id', bl.v('th')); add('strKLGD_KeHoachChiTiet_Id', bl.v('ct'));
        (crud ? crud.pickedRows() : []).forEach(function (r) { add('strDangKy_XacDinhPhamVi_Id', e(r.ID)); });
    } });

    var crud = null, luoi = null, dsLoai = [];
    ums.api.dm('KLGD.PHANLOAIXACNHAN').then(function (loai) { dsLoai = loai || []; }).catch(function () { dsLoai = []; }).then(dung);

    function dung() {
        var cols = [
            { title: 'Thông tin bậc hệ', prop: 'DAOTAO_HEDAOTAO_TEN' },
            { title: 'Thông tin dữ liệu tính khối lượng', prop: 'DULIEUXACNHAN_TEN' },
            { title: 'Ghi chú', prop: 'MOTA' },
            { title: 'Năm học', prop: 'NAMHOC', cls: 'is-center is-nowrap' }, { title: 'Học kỳ', prop: 'HOCKY', cls: 'is-center' }, { title: 'Đợt', prop: 'DOTHOC', cls: 'is-center' }
        ];
        dsLoai.forEach(function (l) {
            cols.push({ title: e(l.TEN), group: 'Phân loại theo nhóm lớp', cls: 'is-center', render: function (r) { return '<span data-xn="' + ui.esc(e(r.ID)) + '|' + ui.esc(e(l.ID)) + '" class="ums-u-muted">…</span>'; } });
        });
        crud = ums.crud({
            root: root.querySelector('[data-z="ds"]'), embedded: true, listTitle: 'Danh sách', formTitle: 'xác định phạm vi', icon: 'fa-list-check',
            autoload: false, pageSize: 10, rowDelete: false, multi: false,
            toolbar: [
                { text: 'Khóa dữ liệu', icon: 'fa-lock', mod: 'danger', onClick: function () { ui.toast('Nút này bản gốc chưa có xử lý', 'info'); } },
                { text: 'Xác nhận', icon: 'fa-circle-check', mod: 'primary', onClick: function (c) {
                    var rows = c.pickedRows();
                    T.xacNhan({ ids: rows.map(function (r) { return e(r.DULIEUXACNHAN); }), ten: rows.length + ' dòng', onXong: function () { c.load(); } });
                } }
            ],
            list: { paged: true, call: function () { return { action: KH + 'LayDSKLGD_DuLieu_Khac', method: 'GET', strTuKhoa: '', strKLGD_KeHoachChiTiet_Id: bl.v('ct') }; } },
            columns: cols,
            onLoad: function (rows) {
                rows.forEach(function (r) { dsLoai.forEach(function (l) {
                    T.ttXacNhan(r.DULIEUXACNHAN, l.ID).then(function (t) { var s = root.querySelector('[data-xn="' + e(r.ID) + '|' + e(l.ID) + '"]'); if (s) { s.textContent = t; s.className = t ? '' : 'ums-u-muted'; } });
                }); });
            },
            fields: [
                { key: 'strDuLieuXacNhan_Ma', col: 'DULIEUXACNHAN_MA', label: 'Mã' },
                { key: 'strDuLieuXacNhan_Ten', col: 'DULIEUXACNHAN_TEN', label: 'Tên' },
                { key: 'strDaoTao_HeDaoTao_Id', col: 'DAOTAO_HEDAOTAO_ID', label: 'Hệ đào tạo', type: 'select',
                  source: { call: { action: 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eCSQFIC4VIC4P', func: 'pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTao', strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 }, name: 'TENHEDAOTAO' } }
            ],
            onForm: function (row, c, extra) {
                extra.innerHTML = '<div data-z="gv"></div>';
                luoi = pat.rows(extra.querySelector('[data-z="gv"]'), {
                    title: 'Giảng viên', icon: 'fa-chalkboard-user',
                    tools: ui.btn('add', { text: 'Thêm cán bộ', mod: 'out-primary', attr: { 'data-gv': 'them' } }),
                    columns: [
                        { key: '_gv', title: 'Giảng viên', type: 'static', get: function (r) { return e(r.NGUOIDUNG_HOTEN) + (r.NGUOIDUNG_MASO ? ' - ' + e(r.NGUOIDUNG_MASO) : ''); } },
                        { key: 'dGioChuan', col: 'GIOCHUAN', title: 'Giờ chuẩn', width: '90px' },
                        { key: 'strMoTa', col: 'MOTA', title: 'Mô tả' },
                        { key: 'strDaoTao_CoCauToChuc_Id', col: 'DAOTAO_COCAUTOCHUC_ID', title: 'Tính cho khoa chuyên môn', type: 'select', s2: true, placeholder: 'Chọn đơn vị',
                          source: { load: function () { return ums.ref.coCauToChuc({ iTrangThai: 1 }); }, name: 'TEN' } },
                        { key: 'strVaiTro_Id', col: 'VAITRO_ID', title: 'Vai trò', type: 'select', placeholder: 'Chọn vai trò', source: { dm: 'KLGD.DOANKL.VAITRO' } },
                        { key: 'dQuyMo', col: 'QUYMO', title: 'Quy mô', width: '80px' },
                        { key: 'dSoLuong', col: 'SOLUONG', title: 'Số sv/Số tiết/Số lượng', width: '110px' }
                    ],
                    list: function (id) { return { action: KH + 'LayDSKLGD_DuLieu_Khac_CT', method: 'GET', strTuKhoa: '', strKLGD_DuLieu_Id: id }; },
                    filled: function (v, rec) { return !!(rec && (rec.NGUOIDUNG_ID || rec.ID)); },
                    save: function (v, rec, parentId) {
                        var f = c.formValues(), cha = (c.rows || []).filter(function (x) { return e(x.ID) === e(parentId); })[0];
                        return { action: KH + (rec && rec.ID ? 'Sua_KLGD_DuLieu_Khac_CT' : 'Them_KLGD_DuLieu_Khac_CT'), method: 'POST',
                            strKLGD_KeHoachChiTiet_Id: cha ? e(cha.KLGD_KEHOACHCHITIET_ID) : bl.v('ct'), strDaoTao_HeDaoTao_Id: f.strDaoTao_HeDaoTao_Id, strId: rec && rec.ID ? rec.ID : '',
                            strDuLieuXacNhan: parentId, strDuLieuXacNhan_Ma: f.strDuLieuXacNhan_Ma, strDuLieuXacNhan_Ten: f.strDuLieuXacNhan_Ten,
                            strDaoTao_CoCauToChuc_Id: v.strDaoTao_CoCauToChuc_Id, strNguoiDung_Id: e(rec.NGUOIDUNG_ID), strKLGD_DuLieu_Id: parentId,
                            dGioChuan: v.dGioChuan, strMoTa: v.strMoTa, strVaiTro_Id: v.strVaiTro_Id, dQuyMo: v.dQuyMo, dSoLuong: v.dSoLuong };
                    },
                    remove: function (rec) { return { action: KH + 'Xoa_KLGD_DuLieu_Khac_CT', method: 'POST', strIds: rec.ID }; }
                });
                luoi.load(row ? row.ID : '');
                extra.addEventListener('click', function (ev) {
                    var b = ev.target.closest('[data-gv="them"]'); if (!b) return;
                    pat.pickNhanSu({ title: 'Tìm kiếm cán bộ', onPick: function (rows, hop) {
                        rows.forEach(function (r) {
                            var src = { NGUOIDUNG_ID: e(r.ID), NGUOIDUNG_HOTEN: e(r.HOTEN || ((r.HODEM || '') + ' ' + (r.TEN || ''))).trim(), NGUOIDUNG_MASO: e(r.MASO) };
                            var d = luoi.addNew(src);
                            // pat.rows: dòng mới không có rec → gắn người vừa chọn vào dòng để lúc lưu biết strNguoiDung_Id; cột tĩnh "Giảng viên" điền tay
                            if (d) { d.rec = src; var td = d.tr && d.tr.children[1]; if (td) td.textContent = src.NGUOIDUNG_HOTEN + (src.NGUOIDUNG_MASO ? ' - ' + src.NGUOIDUNG_MASO : ''); }
                        });
                        if (hop && hop.close) hop.close();
                    } });
                });
            },
            save: function (v, row) {
                if (!bl.v('ct') && !row) { ui.toast('Chọn kế hoạch chi tiết ở thanh tìm kiếm trước khi thêm', 'warn'); return null; }
                return { action: KH + (row ? 'Sua_KLGD_DuLieu_Khac' : 'Them_KLGD_DuLieu_Khac'), method: 'POST', strId: row ? row.ID : '',
                    strKLGD_KeHoachChiTiet_Id: row ? e(row.KLGD_KEHOACHCHITIET_ID) || bl.v('ct') : bl.v('ct'),
                    strDuLieuXacNhan_Ma: v.strDuLieuXacNhan_Ma, strDuLieuXacNhan_Ten: v.strDuLieuXacNhan_Ten, strDaoTao_HeDaoTao_Id: v.strDaoTao_HeDaoTao_Id, strMoTa: '' };
            },
            onSaved: function (c, result, isEdit) {
                var id = isEdit ? (c.editing && c.editing.ID) : ((result.raw && result.raw.Id) || '');
                if (id && luoi) luoi.save(id);
            },
            formRemove: function (ids) { return ids.map(function (id) { return { action: KH + 'Xoa_KLGD_DuLieu_Khac', method: 'POST', strIds: id }; }); }
        });
        bl.sanSang.then(function () { if (bl.v('ct')) crud.load(1); else crud.draw(); });
    }
})();
