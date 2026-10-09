/* =========================================================================
   Tiêu chí trừ (đánh giá lương tăng thêm)
   Bản gốc: ApisNhanSu/Modules/dgplluongtangthem/script/tieuchitru.js
   ---------------------------------------------------------------------------
   Hai cột như gốc: cột trái từ khoá + Loại áp dụng → Tiêu chí + Phương thức
   lấy tin, "Danh sách"; cột phải "Thông tin chung" đổi chỗ cho biểu mẫu.
   Lời gọi (kiểu cũ, chép nguyên):
       NS_PLDG_LTT_TieuChiTru/LayDanhSach  GET  strTuKhoa, strNhanSu_DGPL_LTT_TC_Id, strPhuongThucLayThongTin_Id, phân trang
       NS_PLDG_LTT_TieuChiTru/ThemMoi|CapNhat   strId, strNhanSu_DGPL_LTT_TC_Id, strTieuChi, iThuTu, dDiemChuan, strPhuongThucLayThongTin_Id
       NS_PLDG_LTT_TieuChiTru/Xoa          strIds
       NS_PLDG_LTT_TieuChi/LayDanhSach     GET  strTuKhoa '', strNhanSu_DGPL_LTT_KH_Id '', strLoaiDoiTuongApDung_Id = Loại áp dụng,
                                                pageIndex 1, pageSize 100000 — nguồn ô "Tiêu chí" (tên TIEUCHI)
   Danh mục: NS.LDTL (loại áp dụng), NS.PTLT (phương thức lấy tin).
   Ô "Loại áp dụng" chỉ để lọc ô Tiêu chí — KHÔNG gửi khi lưu / khi lấy danh
   sách (như gốc). Cặp cha → con Loại áp dụng → Tiêu chí khoá theo luật chung
   (cả thanh lọc lẫn biểu mẫu).
   Lỗi gốc sửa theo ý định: mở Sửa gốc chỉ đổ Loại áp dụng (và ô Kế hoạch
   không tồn tại) — KHÔNG đổ Tiêu chí, Phương thức lấy tin → bấm Lưu là ghi
   rỗng hai cột đó. Nay đổ lại từ cột NHANSU_DGPL_LTT_TC_ID /
   PHUONGTHUCLAYTHONGTIN_ID (tên cột ĐOÁN theo tên tham số — kiểm trên host).
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('dgpl-ltt-tieuchitru');
    if (!root) return;
    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    function e(v) { return v === null || v === undefined ? '' : v; }
    var CTL = 'NS_PLDG_LTT_TieuChiTru';
    var LOAI = { dm: 'NS.LDTL' }, PTLT = { dm: 'NS.PTLT' };
    var TC_KEY = 'strNhanSu_DGPL_LTT_TC_Id';

    function tieuChi(loai) {
        if (!loai) return Promise.resolve([]);
        return ums.api.call({
            action: 'NS_PLDG_LTT_TieuChi/LayDanhSach', method: 'GET', strTuKhoa: '', strNhanSu_DGPL_LTT_KH_Id: '',
            strLoaiDoiTuongApDung_Id: loai, strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000
        }).then(function (r) { return Array.isArray(r.data) ? r.data : []; });
    }
    function napTieuChi(loaiEl, tcEl, giaTri) {
        return tieuChi(loaiEl.value).then(function (rows) {
            pat.fill(tcEl, rows, { name: 'TIEUCHI', head: 'Chọn tiêu chí' });
            if (giaTri !== undefined) { tcEl.value = giaTri; jQuery(tcEl).trigger('change.select2'); }
        }).catch(function (err) { ums.api.handle(err, 'tiêu chí'); });
    }

    var chainForm;
    var crud = ums.crud({
        root: root,
        title: 'Tiêu chí trừ',
        formTitle: 'tiêu chí trừ',
        icon: 'fa-circle-minus',
        addText: 'Thêm',
        master: {
            title: 'Danh sách', icon: 'fa-list-ul',
            item: function (r) { return '<b>' + esc(r.TIEUCHI) + '</b>'; }
        },
        filters: [
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' },
            { key: 'loai', type: 'select', label: 'Loại áp dụng', source: LOAI },
            { key: 'tc', type: 'select', label: 'Tiêu chí' },
            { key: 'ptlt', type: 'select', label: 'Phương thức lấy tin', source: PTLT }
        ],
        list: {
            paged: true,
            call: function (f) {
                return { action: CTL + '/LayDanhSach', method: 'GET', strTuKhoa: f.q,
                         strNhanSu_DGPL_LTT_TC_Id: f.tc, strPhuongThucLayThongTin_Id: f.ptlt, strNguoiThucHien_Id: '' };
            }
        },
        fields: [
            { type: 'legend', label: 'Thông tin tiêu chí trừ' },
            { key: '_loai', col: 'LOAIDOITUONGAPDUNG_ID', label: 'Loại áp dụng', type: 'select', source: LOAI },
            { key: TC_KEY, label: 'Tiêu chí', type: 'select', placeholder: 'Chọn tiêu chí' },
            { key: 'strTieuChi', col: 'TIEUCHI', label: 'Tên tiêu chí', span: true },
            { key: 'dDiemChuan', col: 'DIEMCHUAN', label: 'Điểm chuẩn', type: 'number' },
            { key: 'iThuTu', col: 'THUTU', label: 'Thứ tự', type: 'number' },
            { key: 'strPhuongThucLayThongTin_Id', col: 'PHUONGTHUCLAYTHONGTIN_ID', label: 'Phương thức lấy tin', type: 'select', source: PTLT, span: true }
        ],
        onForm: function (row) {
            var loai = fe('_loai'), tc = fe(TC_KEY);
            pat.fill(tc, [], { head: 'Chọn tiêu chí' });
            if (row && loai.value) napTieuChi(loai, tc, e(row.NHANSU_DGPL_LTT_TC_ID)).then(function () { chainForm.sync(); });
            chainForm.sync();
        },
        save: function (v, row) {
            delete v._loai;
            v.action = CTL + (row ? '/CapNhat' : '/ThemMoi');
            v.strId = row ? row.ID : '';
            return v;
        },
        remove: function (ids) {
            return ids.map(function (id) { return { action: CTL + '/Xoa', strIds: id }; });
        }
    });

    function fe(k) { return root.querySelector('[data-cf="' + crud.uid + '"][data-scope="form"][data-k="' + k + '"]'); }
    function fl(k) { return root.querySelector('[data-cf="' + crud.uid + '"][data-scope="filter"][data-k="' + k + '"]'); }

    /* Thanh lọc: Loại áp dụng → Tiêu chí */
    jQuery(fl('loai')).on('select2:select select2:clear', function () { napTieuChi(fl('loai'), fl('tc')); });
    pat.chain([fl('loai'), fl('tc')], { phatLai: false });
    /* Biểu mẫu: Loại áp dụng → Tiêu chí */
    jQuery(fe('_loai')).on('select2:select select2:clear', function () { napTieuChi(fe('_loai'), fe(TC_KEY)); });
    chainForm = pat.chain([fe('_loai'), fe(TC_KEY)], { phatLai: false });
})();
