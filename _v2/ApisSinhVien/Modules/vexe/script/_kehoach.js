/* =========================================================================
   _kehoach.js — khung chung của module "Vé xe" (phân hệ Sinh viên, bản CÁN BỘ quản lý kế hoạch)
   Dùng ở: xebus (kế hoạch đăng ký xe buýt — SV_XeBus), vethang (kế hoạch vé tháng — SV_VeThang).
   ---------------------------------------------------------------------------
   Hai màn gốc chép nhau gần như từng dòng (xebus.js 1.760 dòng, vethang.js 1.919 dòng), khác đúng:
     · controller + tên action / tên tham số id kế hoạch (strQLSV_KeHoach_XeBus_Id ↔ strQLSV_KeHoach_DichVu_Ve_Id);
     · HAI lưới dòng trong biểu mẫu (xebus: Tháng áp dụng + Tuyến xe; vethang: Loại vé + Mức phí áp dụng);
     · cột của khung "Kết quả đã đăng ký".
   Bố cục chung (MỘT cột, như gốc): thanh lọc từ khoá + "Xuất báo cáo" → "Danh sách kế hoạch" (Chi tiết · Sửa ·
   ô chọn + Xoá đã chọn) → biểu mẫu kế hoạch THAY CHỖ danh sách: "Thông tin kế hoạch" (Tên, Hiệu lực, Từ ngày,
   Đến ngày) + hai lưới dòng (ums.pat.rows) + "Phạm vi áp dụng" (ums.pat.phamVi — hộp chọn SV / thêm từng
   khoá, chương trình, lớp; gửi QLSV_NGUOIHOC_ID như save_SinhVien gốc).
   Chi tiết "Kết quả đăng ký": hộp thoại một bảng (gốc đổi vùng #zoneQuanSo — theo khuôn của sukien/kehoach).
   ---------------------------------------------------------------------------
     ums.svVe.man(root, {
         tieuDe, ctl: 'SV_XeBus/', idKey: 'strQLSV_KeHoach_XeBus_Id',
         ds: 'LayDSKeHoach_DichVu_XeBus', them: '…', sua: '…', xoa: '…',
         pv: { ds, them, xoa },                           // action phạm vi (thiếu ctl)
         luoi: [ cfg ums.pat.rows … (list/save/remove nhận id kế hoạch) ],
         ketQua: { call(row) → lời gọi, columns }        // hộp "Kết quả đã đăng ký"
     }) → crud
   Lưu kế hoạch xong gửi TUẦN TỰ: phạm vi mới → lưới 1 → lưới 2 (gốc bắn song song cùng lúc với
   Them_KeHoach_… nên dòng con có thể tới máy chủ trước khi kế hoạch có id), rồi nạp lại danh sách.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var V = ums.svVe = {};
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : []; }
    V.uid = uid;
    V.arr = arr;

    /* Hiệu lực: gốc `aData.HIEULUC ? "Có hiệu lực" : "Hết hiệu lực"` — số 0 là hết hiệu lực */
    V.hieuLuc = function (r) { return Number(r.HIEULUC) ? 'Có hiệu lực' : 'Hết hiệu lực'; };

    function ketQua(cfg, row) {
        var dlg = ui.dialog({ title: 'Kết quả đã đăng ký — ' + (row.TENKEHOACH || ''), icon: 'fa-pen-to-square', size: 'xl',
            body: '<div data-z="kq">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
        var h = dlg.body.querySelector('[data-z="kq"]');
        ums.api.call(cfg.ketQua.call(row)).then(function (r) {
            ui.table({ el: h, rows: arr(r.data), empty: 'Chưa có người học đăng ký', columns: cfg.ketQua.columns });
        }).catch(function (err) { h.innerHTML = ui.fail(err.message); ums.api.handle(err, 'kết quả đăng ký'); });
    }

    V.cotSV = [
        { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
        { title: 'Họ đệm Tên', render: function (s) { return esc((s.QLSV_NGUOIHOC_HODEM || '') + ' ' + (s.QLSV_NGUOIHOC_TEN || '')); } },
        { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' },
        { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
        { title: 'Khóa', prop: 'DAOTAO_KHOAHOC_TEN' }
    ];

    V.man = function (root, cfg) {
        var C = cfg.ctl, pv = null, luoi = [];
        var crud = ums.crud({
            root: root,
            title: cfg.tieuDe,
            listTitle: 'Danh sách kế hoạch',
            formTitle: 'kế hoạch',
            icon: 'fa-list-timeline',
            formCols: 12,
            rowDelete: false, formDelete: false,
            filters: [{ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }],
            list: {
                call: function (f) { return { action: C + cfg.ds, method: 'GET', strTuKhoa: f.q || '', strNguoiThucHien_Id: uid() }; }
            },
            columns: [
                { title: 'Tên kế hoạch', prop: 'TENKEHOACH' },
                { title: 'Hiệu lực', cls: 'is-center is-nowrap', render: V.hieuLuc },
                { title: 'Ngày bắt đầu', prop: 'NGAYBATDAU', cls: 'is-center is-nowrap' },
                { title: 'Ngày kết thúc', prop: 'NGAYKETTHUC', cls: 'is-center is-nowrap' },
                { title: 'Kết quả đăng ký', cls: 'is-center', render: function (r) {
                    return ui.btn('view', { text: 'Chi tiết', icon: 'fa-eye', cls: 'ums-btn--sm', attr: { 'data-kq': r.ID } });
                } }
            ],
            fields: [
                { key: 'strTenKeHoach', col: 'TENKEHOACH', label: 'Tên kế hoạch', cols: 6 },
                { key: 'dHieuLuc', col: 'HIEULUC', label: 'Hiệu lực', type: 'select', cols: 6, required: true, value: '1',
                  source: { items: [{ ID: '1', TEN: 'Hiệu lực' }, { ID: '0', TEN: 'Hết hiệu lực' }] } },
                { key: 'strNgayBatDau', col: 'NGAYBATDAU', label: 'Từ ngày', type: 'date', cols: 6 },
                { key: 'strNgayKetThuc', col: 'NGAYKETTHUC', label: 'Đến ngày', type: 'date', cols: 6 }
            ],
            onForm: function (row, c, extra) {
                var id = row ? row.ID : '';
                extra.innerHTML = cfg.luoi.map(function (l, i) { return '<div class="ums-u-mt-4" data-vl="' + i + '"></div>'; }).join('') +
                    '<div class="ums-u-mt-4" data-vl="pv"></div>';
                luoi = cfg.luoi.map(function (l, i) {
                    var g = pat.rows(extra.querySelector('[data-vl="' + i + '"]'), l);
                    g.load(id);
                    return g;
                });
                pv = pat.phamVi(extra.querySelector('[data-vl="pv"]'), {
                    list: function (khId) { var o = { action: C + cfg.pv.ds, method: 'GET', strTuKhoa: '', strNguoiThucHien_Id: uid() }; o[cfg.idKey] = khId; return o; },
                    save: function (pvId, khId) { var o = { action: C + cfg.pv.them, method: 'POST', strPhamViApDung_Id: pvId, strNguoiThucHien_Id: uid() }; o[cfg.idKey] = khId; return o; },
                    remove: function (rowId) { return { action: C + cfg.pv.xoa, strId: rowId, strNguoiThucHien_Id: uid() }; }
                });
                pv.load(id);
            },
            save: function (v, row) {
                return {
                    action: C + (row ? cfg.sua : cfg.them), method: 'POST',
                    strId: row ? row.ID : '',
                    strTenKeHoach: v.strTenKeHoach, dHieuLuc: v.dHieuLuc,
                    strNgayBatDau: v.strNgayBatDau, strNgayKetThuc: v.strNgayKetThuc,
                    strNguoiThucHien_Id: uid()
                };
            },
            onSaved: function (c, result, isEdit) {
                var id = isEdit ? (c.editing && c.editing.ID) : ((result.raw && result.raw.Id) || '');
                if (!id) return;
                var buoc = [function () { return pv ? pv.save(id) : null; }].concat(luoi.map(function (g) { return function () { return g.save(id); }; }));
                buoc.reduce(function (p, f) { return p.then(f); }, Promise.resolve()).then(function () { c.load(); });
            },
            remove: function (ids) {
                return ids.map(function (id) { return { action: C + cfg.xoa, method: 'POST', strId: id, strNguoiThucHien_Id: uid() }; });
            }
        });

        /* Nút "Xuất báo cáo" / Import theo mẫu phân quyền (getList_MauImport gốc) — đầu trang */
        var bc = document.createElement('div');
        var act = crud.z('actions');
        if (act) act.insertBefore(bc, act.firstChild);
        ums.report.mount(bc, { collect: function (add) {
            add('dHieuLuc', '');                                   // gốc đọc ô dropSearch_HieuLuc không có trên màn
            crud.pickedRows().forEach(function (r) { add('strDiem_KeHoachCongNhan_Id', r.ID); });
        } });

        root.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-kq]');
            if (!b) return;
            var row = crud.rows.filter(function (r) { return String(r.ID) === b.getAttribute('data-kq'); })[0];
            if (row) ketQua(cfg, row);
        });
        return crud;
    };
})();
