/* =========================================================================
   Nhập học — khung chung hai màn ĐỊNH MỨC (ums.nhDm)
   Dùng ở: dinhmuc/dinhmucchung (NH_DinhMuc_Chung), dinhmuc/dinhmucrieng (NH_DinhMuc_Rieng).
   Hai tệp gốc chép cùng một khuôn (dinhmucchung.js 799 dòng / dinhmucrieng.js 828 dòng):
   thanh tìm (Kế hoạch + Khoản thu + từ khoá + nút) · bảng "Danh sách" (Xóa, Tải lại,
   Tạo mới) · biểu mẫu thay chỗ danh sách (bảng nhãn hai cột + ảnh trang trí bên phải)
   → ums.crud một cột; ảnh minh hoạ (Upload/images/dinhmuc.svg) bỏ.
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên; <ctl> = NH_DinhMuc_Chung | NH_DinhMuc_Rieng):
     <ctl>/LayDanhSach  GET  strTAICHINH_CacKhoanThu_Id (ô lọc khoản thu), strTAICHINH_KeHoach_Id
                             (kế hoạch đang lọc, KHÔNG chọn thì ID NGƯỜI DÙNG — như gốc),
                             strApDungMienGiam_Id "", [riêng: strDAOTAO_ToChucCCCT_Id "",
                             strDoiTuongDaoTao_Id ""], strNguoiThucHien_Id "", strTuKhoa, pageIndex/pageSize
     <ctl>/LayChiTiet   GET  strId
     <ctl>/ThemMoi | CapNhat  POST  strId, strTAICHINH_KeHoach_Id, strTAICHINH_CacKhoanThu_Id,
                             strApDungMienGiam_Id, dSoTien, iThuTu, strMoTa, dThuocTinhTuyChon
                             chung: + dThuTu (= Thứ tự), dTuDongCanDoiSangPhaiNop; iThuTu, dSoTien qua convertStrToNum
                             riêng: + strDoiTuongDaoTao_Id, strDAOTAO_TOCHUCCT_Id; iThuTu gửi nguyên chữ
     <ctl>/Xoa          POST strIds (nối dấu phẩy)
     Khoản thu  TC_KhoanThu/LayDanhSach  GET  strTuKhoa "", strNhomCacKhoanThu_Id "", pageIndex 1,
                pageSize 100, strNguoiTao_Id "", strCanBoQuanLy_Id ""   (một lần cho ô lọc + ô nhập)
     Kế hoạch   ums.nhKH.theoNguoiDung() (PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc)

   "Tạo mới" (rewrite gốc): biểu mẫu lấy sẵn kế hoạch và khoản thu đang lọc.

   Khác gốc (chung hai màn):
     · Ô "Kế hoạch nhập học" là ô chọn có ô gõ tìm thay ô chữ chỉ đọc + hộp "Tìm kiếm kế hoạch"
       (hộp gốc liệt kê chính danh sách này; ô tìm trong hộp không có xử lý) — xem kehoach/scripts/_chung.js.
     · Lưu xong quay về danh sách (gốc ở lại biểu mẫu mà giữ strId rỗng khi thêm → bấm Lưu lần
       hai là THÊM TRÙNG).
     · Ô "Số tiền" ngăn nghìn bằng dấu phẩy khi gõ (ums.pat.money), gửi đi bỏ dấu phẩy như convertStrToNum.
     · Ô thứ hai cùng nhãn "Tùy chọn" của định mức chung (dropCanDoi_DMC) nay ghi "Cân đối khoản
       phải nộp" — lấy theo chữ gợi ý của chính ô đó, để khỏi hai ô trùng nhãn.
   ========================================================================= */
(function () {
    'use strict';

    if (window.ums.nhDm) return;
    var ums = window.ums, ui = ums.ui, pat = ums.pat, N = ums.nhKH, e = N.e;

    var MIENGIAM = { '0': 'Không áp dụng miễn giảm', '1': 'Chỉ áp dụng miễn 100%', '2': 'Áp dụng miễm giảm tất cả' };
    var TUYCHON = { '0': 'Không bắt buộc', '1': 'Bắt buộc' };
    function items(m, thuTu) { return { items: thuTu.map(function (k) { return { ID: k, TEN: m[k] }; }) }; }

    function khoanThu() {
        return {
            call: {
                action: 'TC_KhoanThu/LayDanhSach', method: 'GET', versionAPI: 'v1.0',
                strTuKhoa: '', strNhomCacKhoanThu_Id: '', pageIndex: 1, pageSize: 100,
                strNguoiTao_Id: '', strCanBoQuanLy_Id: ''
            },
            id: 'ID', name: 'TEN'
        };
    }
    /** convertStrToNum của gốc: rỗng → 0, bỏ dấu phẩy */
    function so(v) { var s = pat.num(v); return s === '' ? 0 : s; }

    /**
     * cfg = { rieng: bool, title, formTitle, icon,
     *         cot: [cột riêng chèn sau "Loại khoản"], cotTien: [cột số tiền],
     *         fields: [ô riêng chèn sau "Thứ tự"], luu(v) → tham số riêng,
     *         rowActions, onForm(row, crud, F), sauGan(crud, F) }
     */
    function man(root, cfg) {
        if (!root) return null;
        var ctl = cfg.rieng ? 'NH_DinhMuc_Rieng' : 'NH_DinhMuc_Chung';
        var KH = N.capNguon(N.theoNguoiDung);
        var KT = khoanThu();
        var F = { KH: KH };

        var columns = [{ title: 'Loại khoản', prop: 'TAICHINH_CACKHOANTHU_TEN' }]
            .concat(cfg.cot || [])
            .concat([
                { title: 'Mức áp dụng', render: function (r) { return ui.esc(MIENGIAM[e(r.APDUNGMIENGIAM_ID)] || ''); } },
                { title: 'Tùy chọn', render: function (r) { return ui.esc(TUYCHON[e(r.THUOCTINHTUYCHON)] || ''); } }
            ])
            .concat(cfg.cotTien || []);

        var fields = [
            { key: 'strTAICHINH_KeHoach_Id', col: 'TAICHINH_KEHOACHNHAPHOC_ID', label: 'Kế hoạch nhập học', type: 'select',
              placeholder: 'Chọn kế hoạch nhập học', source: KH.form, required: true, caDong: true },
            { key: 'strTAICHINH_CacKhoanThu_Id', col: 'TAICHINH_CACKHOANTHU_ID', label: 'Khoản thu', type: 'select',
              placeholder: 'Chọn khoản thu', source: KT },
            { key: 'strApDungMienGiam_Id', col: 'APDUNGMIENGIAM_ID', label: 'Miễn giảm', type: 'select',
              placeholder: '-- Chọn áp dụng miễn giảm --', source: items(MIENGIAM, ['0', '1', '2']) },
            { key: 'dSoTien', col: 'SOTIEN', label: 'Số tiền', type: 'number', placeholder: 'Nhập số tiền' },
            { key: 'dThuocTinhTuyChon', col: 'THUOCTINHTUYCHON', label: 'Tùy chọn', type: 'select',
              placeholder: '-- Chọn thuộc tính tùy chọn --', source: items(TUYCHON, ['1', '0']) },
            { key: 'iThuTu', col: 'THUTU', label: 'Thứ tự', type: 'number', placeholder: 'Nhập số thứ tự' }
        ].concat(cfg.fields || []).concat([
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea', span: true }
        ]);

        var crud = ums.crud({
            root: root,
            title: cfg.title,
            formTitle: cfg.formTitle,
            icon: cfg.icon || 'fa-sliders',
            addText: 'Tạo mới',
            filters: [
                { key: 'kh', type: 'select', label: 'Chọn kế hoạch nhập học', source: KH.loc },
                { key: 'kt', type: 'select', label: 'Chọn khoản thu', source: KT },
                { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
            ],
            list: {
                paged: true,
                call: function (f) {
                    var o = {
                        action: ctl + '/LayDanhSach', method: 'GET', versionAPI: 'v1.0',
                        strTAICHINH_CacKhoanThu_Id: f.kt,
                        strTAICHINH_KeHoach_Id: N.timKiem(f.kh),
                        strApDungMienGiam_Id: ''
                    };
                    if (cfg.rieng) { o.strDAOTAO_ToChucCCCT_Id = ''; o.strDoiTuongDaoTao_Id = ''; }
                    o.strNguoiThucHien_Id = '';
                    o.strTuKhoa = f.q;
                    return o;
                }
            },
            columns: columns,
            rowActions: cfg.rowActions,
            formCols: 2,
            fields: fields,

            detail: function (row) {
                return { action: ctl + '/LayChiTiet', method: 'GET', versionAPI: 'v1.0', strId: row.ID };
            },
            save: function (v, row) {
                var o = {
                    action: ctl + (row ? '/CapNhat' : '/ThemMoi'), versionAPI: 'v1.0',
                    strId: row ? row.ID : '',
                    strTAICHINH_KeHoach_Id: v.strTAICHINH_KeHoach_Id,
                    strTAICHINH_CacKhoanThu_Id: v.strTAICHINH_CacKhoanThu_Id,
                    strApDungMienGiam_Id: v.strApDungMienGiam_Id,
                    dSoTien: so(v.dSoTien)
                };
                var p = cfg.luu(v);
                Object.keys(p).forEach(function (k) { o[k] = p[k]; });
                return o;
            },
            rowDelete: false,
            formDelete: false,
            remove: function (ids) {
                return { action: ctl + '/Xoa', versionAPI: 'v1.0', strIds: ids.join(',') };
            },
            removeConfirm: function () { return 'Bạn có chắc chắn muốn xóa dữ liệu hệ thống?'; },

            onForm: function (row, c) {
                var khEl = N.o(c, 'strTAICHINH_KeHoach_Id');
                var tien = N.o(c, 'dSoTien');
                if (row) {
                    N.dat(khEl, row.TAICHINH_KEHOACHNHAPHOC_ID, row.TAICHINH_KEHOACHNHAPHOC_TEN);
                    /* Ô khoản thu gốc chỉ nạp 100 khoản đầu — khoản ngoài danh sách vẫn hiện đúng tên */
                    N.dat(N.o(c, 'strTAICHINH_CacKhoanThu_Id'), row.TAICHINH_CACKHOANTHU_ID, row.TAICHINH_CACKHOANTHU_TEN);
                    tien.value = pat.money(tien.value);
                } else {
                    var f = c.filterValues();
                    N.dat(khEl, f.kh);
                    N.dat(N.o(c, 'strTAICHINH_CacKhoanThu_Id'), f.kt);
                }
                if (cfg.onForm) cfg.onForm(row, c, F);
            }
        });

        /* Ô số tiền: dấu phẩy ngăn nghìn khi gõ */
        root.addEventListener('input', function (ev) {
            var t = ev.target;
            if (t.getAttribute && t.getAttribute('data-k') === 'dSoTien' && t.getAttribute('data-scope') === 'form') {
                var cuoi = t.value.length - t.selectionStart;
                t.value = pat.money(t.value);
                var vt = Math.max(0, t.value.length - cuoi);
                try { t.setSelectionRange(vt, vt); } catch (x) { /* ô không hỗ trợ con trỏ */ }
            }
        });

        if (cfg.sauGan) cfg.sauGan(crud, F);
        return crud;
    }

    ums.nhDm = { man: man, so: so, MIENGIAM: MIENGIAM, TUYCHON: TUYCHON };
})();
