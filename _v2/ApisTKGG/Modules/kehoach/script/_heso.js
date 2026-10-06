/* =========================================================================
   tkggHeSo — khung chung HAI màn hệ số của Thống kê giờ giảng (gốc chép nhau, khác thủ tục):
     hesoquymo  "Khai hệ số quy mô theo dải"  — PKG_KLGV_V2_THONGTIN.*_KLGD_HeSo_QuyMoSoLuong  (có Số bắt đầu / Số kết thúc, lọc theo Phân loại)
     hesophamvi "Khai hệ số theo phạm vi"     — PKG_KLGV_V2_THONGTIN.*_KLGD_HeSo_PhamViApDung  (không dải số; html gốc thiếu hai ô đó, lọc Phân loại không gửi)
   Bản gốc: ApisTKGG/Modules/kehoach/script/hesoquymo.js, hesophamvi.js (modal "Hệ số" → biểu mẫu trong trang, ums.crud).
   ---------------------------------------------------------------------------
   ums.tkggHeSo(root, { title, list: {action, func}, them, sua, xoa, khoang: true|false, locPhanLoai: true|false })
   Lời gọi chung: danh mục KLGD.LOAIBANG (ô lọc Phân loại), KLGD.PHANLOAIXACNHAN (ô "Phạm vi" của biểu mẫu),
     ums.ref.thoiGianDaoTao (ô Thời gian — edu.system.getList_ThoiGianDaoTao), ums.tkgg.loaiApDung (ô "Loại" theo Phạm vi).
   Giữ như gốc: tên tham số lưu đảo nhau (strLoaiBang_Id = ô "Phạm vi" KLGD.PHANLOAIXACNHAN; strPhamViApDung_Id = ô "Loại") — chép nguyên.
   Khác gốc (lỗi rõ ràng):
     · Sửa: gốc đổ ô dropPhanLoai / dropPhamVi KHÔNG tồn tại → biểu mẫu sửa luôn trống Phạm vi / Loại; ở đây đổ LOAIBANG_ID / PHAMVIAPDUNG_ID.
     · Ô từ khoá gốc không gửi đi đâu → lọc tại chỗ theo Phân loại / Phạm vi áp dụng / Thời gian.
     · hesophamvi: tiêu đề bảng gốc có cột Phân loại / Số bắt đầu / Số kết thúc nhưng không đổ dữ liệu (lệch cột) → bỏ ba cột; ô lọc Phân loại không gửi → bỏ.
     · Xoá nhiều: một lượt hỏi, chạy tuần tự có tiến độ (gốc gắn chồng #btnYes).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, T = ums.tkgg;
    var TG = { call: { action: 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eFSkuKAYoIC8FIC4VIC4P', func: 'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao', strDAOTAO_Nam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 }, name: 'DAOTAO_THOIGIANDAOTAO' };
    ums.tkggHeSo = function (root, o) {
        function e(v) { return T.e(v); }
        function khop(r, q) { q = (q || '').toLowerCase(); return !q || [r.LOAIBANG_TEN, r.PHAMVIAPDUNG_TEN, r.THOIGIAN].some(function (x) { return e(x).toLowerCase().indexOf(q) >= 0; }); }
        var filters = [];
        if (o.locPhanLoai) filters.push({ key: 'pl', type: 'select', label: 'Chọn phân loại', source: { dm: 'KLGD.LOAIBANG' } });
        filters.push({ key: 'tg', type: 'select', label: 'Chọn thời gian', source: TG });
        filters.push({ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' });
        var columns = [];
        if (o.khoang) columns.push({ title: 'Phân loại', prop: 'LOAIBANG_TEN' });
        columns.push({ title: 'Phạm vi áp dụng', prop: 'PHAMVIAPDUNG_TEN' });
        if (o.khoang) columns.push({ title: 'Số bắt đầu', prop: 'SOBATDAU', cls: 'is-center' }, { title: 'Số kết thúc', prop: 'SOKETTHUC', cls: 'is-center' });
        columns.push({ title: 'Hệ số', prop: 'HESO', cls: 'is-center' }, { title: 'Thời gian', prop: 'THOIGIAN', cls: 'is-center' },
            { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' }, { title: 'Người tạo', prop: 'NGUOITAO_TAIKHOAN' });
        var fields = [
            { key: 'strLoaiBang_Id', col: 'LOAIBANG_ID', label: 'Phạm vi', type: 'select', required: true, source: { dm: 'KLGD.PHANLOAIXACNHAN' } },
            { key: 'strPhamViApDung_Id', col: 'PHAMVIAPDUNG_ID', label: 'Loại', type: 'select', required: true, placeholder: 'Chọn loại', source: { items: [] } },
            { key: 'strDaoTao_ThoiGianDaoTao_Id', col: 'THOIGIAN_ID', label: 'Thời gian', type: 'select', source: TG }
        ];
        if (o.khoang) fields.push({ key: 'dSoBatDau', col: 'SOBATDAU', label: 'Số bắt đầu', type: 'number' }, { key: 'dSoKetThuc', col: 'SOKETTHUC', label: 'Số kết thúc', type: 'number' });
        fields.push({ key: 'dHeSo', col: 'HESO', label: 'Hệ số', type: 'number', required: true });

        var crud = ums.crud({
            root: root, title: o.title, listTitle: 'Danh sách', formTitle: 'hệ số', icon: 'fa-sliders',
            filters: filters,
            list: {
                call: function (f) {
                    var c = Object.assign({}, o.list, { strDaoTao_ThoiGianDaoTao_Id: e(f.tg) });
                    if (o.locPhanLoai) c.strLoaiBang_Id = e(f.pl);
                    return c;
                },
                rows: function (data) { var q = crud.filterValues().q; return T.arr(data).filter(function (r) { return khop(r, q); }); }
            },
            columns: columns,
            fields: fields,
            onForm: function (row) {
                var pv = root.querySelector('select[data-scope="form"][data-k="strLoaiBang_Id"]'), loai = root.querySelector('select[data-scope="form"][data-k="strPhamViApDung_Id"]');
                var luot = 0;
                function nap(chon) {
                    var l = ++luot; pv._tkggVal = pv.value;
                    pat.fill(loai, [], { head: 'Chọn loại' });
                    T.loaiApDung(pv.value).then(function (rows) { if (l !== luot) return; pat.fill(loai, rows, { head: 'Chọn loại' }); if (chon) { loai.value = chon; if (window.jQuery) jQuery(loai).trigger('change'); } });
                }
                // nghe bằng jQuery (select2 bắn change bằng jQuery, kể cả change.select2 của bộ kiểm); bỏ qua change do crud đổ giá trị (Phạm vi không đổi)
                function doi() { if (pv.value === pv._tkggVal) return; nap(''); }
                if (!pv._tkgg) { pv._tkgg = true; /* jQuery: trigger có namespace (change.select2) không gọi handler 'change' trơn → nghe cả hai */ if (window.jQuery) jQuery(pv).on('change change.select2', doi); else pv.addEventListener('change', doi); }
                nap(row ? e(row.PHAMVIAPDUNG_ID) : '');
            },
            save: function (v, row) {
                return Object.assign({}, row ? o.sua : o.them, {
                    strId: row ? row.ID : '', strPhamViApDung_Id: v.strPhamViApDung_Id, dHeSo: v.dHeSo,
                    dSoBatDau: o.khoang ? v.dSoBatDau : '', dSoKetThuc: o.khoang ? v.dSoKetThuc : '',
                    strLoaiBang_Id: v.strLoaiBang_Id, strDaoTao_ThoiGianDaoTao_Id: v.strDaoTao_ThoiGianDaoTao_Id
                });
            },
            remove: function (ids) { return ids.map(function (id) { return Object.assign({}, o.xoa, { strId: id }); }); }
        });
        return crud;
    };
})();
