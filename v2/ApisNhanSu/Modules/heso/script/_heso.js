/* =========================================================================
   Khung chung module "heso" (Nhân sự) — ums.nsHeSo
   =========================================================================
   16 màn gốc của ApisNhanSu/Modules/heso chép cùng MỘT khuôn (mỗi tệp 300–580
   dòng): khung "Tìm kiếm" (ô lọc) → khung "Danh sách (n)" (Thêm mới · Xóa) với
   bảng + cột Sửa + ô đánh dấu → hộp modal biểu mẫu (nhãn col-3 | ô col-9) với
   Đóng · Lưu. Lời gọi luôn là <ctl>/LayDanhSach (GET, phân trang máy chủ),
   <ctl>/ThemMoi | CapNhat (POST, strId rỗng = thêm), <ctl>/Xoa (POST, mỗi dòng
   đánh dấu MỘT lời gọi strIds = id).

   Ở đây mỗi màn chỉ KHAI BÁO:
       ums.nsHeSo.man(root, {
           ctl: 'NS_HeSo_Ngach', title, formTitle, icon,
           filters: [{ key, type: 'select'|'text', label, source, date: true }],
           list: function (f) → tham số LayDanhSach (không kèm action / phân trang),
           columns, fields (thêm khoá `tuLoc: '<khoá ô lọc>'` = khi THÊM MỚI điền sẵn
                   từ ô lọc — resetPopup của gốc),
           save: function (v, row) → tham số ThemMoi/CapNhat (không kèm action, strId),
           onForm(row, crud), sauKhiTao(crud), toolbar
       });
   → ums.crud (biểu mẫu THAY CHỖ danh sách — luật chung; gốc là hộp modal).

   Nguồn ô chọn:
       N.dm('LUONG.NGACH')                 danh mục dùng chung
       N.dm('NS.DMCV', { THONGTIN1: 'CHINHQUYEN' })   lọc như objGetDataInData của gốc
       N.donVi()                           edu.system.getList_CoCauToChuc (cả cha lẫn con, TEN)
       N.thoiGian()                        KHCT_ThoiGianDaoTao/LayDanhSach GET (DAOTAO_THOIGIANDAOTAO)
       N.canBo(donViId)                    NS_HoSoV2/LayDanhSach GET (HOTEN - MASO) → Promise<dòng>
   Nguồn "đã có promise" khai dạng { _p: promise } — ums.crud.loadSource trả
   thẳng src._p nên dùng được mà không phải sửa crud.js.

   Khác gốc (chung cả module):
     · Lưu xong về danh sách + nạp lại (gốc để hộp mở, báo trong hộp).
     · Không nút xoá trên từng dòng / trong biểu mẫu — gốc chỉ có "Xóa" nhiều dòng
       (nút Xóa trong hộp gốc display:none, không có trình xử lý hiện nó).
     · Xoá nhiều: một lần hỏi, gửi tuần tự từng dòng, báo gộp (gốc: mỗi dòng
       một thông báo, vài màn nạp lại danh sách bằng setTimeout).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var N = ums.nsHeSo = {};

    function e(v) { return v === undefined || v === null ? '' : v; }

    /* ---------- Nguồn ô chọn ---------------------------------------------- */
    N.dm = function (code, loc) {
        if (!loc) return { dm: code };
        return {
            _p: ums.api.dm(code).then(function (rows) {
                return (rows || []).filter(function (r) {
                    return Object.keys(loc).every(function (k) { return String(e(r[k])) === String(loc[k]); });
                });
            })
        };
    };

    /* edu.system.getList_CoCauToChuc({ strCCTC_Loai_Id: "", strCCTC_Cha_Id: "", iTrangThai: 1 }) */
    N.coCau = function () { return ums.ref.coCauToChuc({ iTrangThai: 1 }); };
    N.donVi = function () { return { _p: N.coCau() }; };

    /* getList_ThoiGianDaoTao của quydoigio / tangthem / tonghopkhoiluong (chép nguyên) */
    N.thoiGian = function () {
        return {
            call: {
                action: 'KHCT_ThoiGianDaoTao/LayDanhSach', method: 'GET',
                strTuKhoa: '', strDAOTAO_NAM_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000
            },
            id: 'ID', name: 'DAOTAO_THOIGIANDAOTAO'
        };
    };

    /* getList_HS của khongtinhluong / xulybietle (chép nguyên, GET) */
    N.canBo = function (donVi) {
        return ums.api.call({
            action: 'NS_HoSoV2/LayDanhSach', method: 'GET', silent: true,
            strTuKhoa: '', pageIndex: 1, pageSize: 100000,
            strDaoTao_CoCauToChuc_Id: e(donVi), strNguoiThucHien_Id: '', dLaCanBoNgoaiTruong: 0
        }).then(function (r) { var d = r.data; return Array.isArray(d) ? d : (d && d.rs) || []; });
    };
    N.tenCanBo = function (r) { return e(r.HOTEN) + ' - ' + e(r.MASO); };

    /* Cột "Thời gian" gốc ghép NAM - KY - DOT (quydoigio, tangthem) */
    N.thoiGianCot = function (r, sep, thuTu) {
        var m = { NAM: r.DAOTAO_THOIGIANDAOTAO_NAM, KY: r.DAOTAO_THOIGIANDAOTAO_KY, DOT: r.DAOTAO_THOIGIANDAOTAO_DOT };
        return (thuTu || ['NAM', 'KY', 'DOT']).map(function (k) { return e(m[k]); }).join(sep || ' - ');
    };

    /* ---------- Tiện ích ô trong crud --------------------------------------- */
    N.o = function (crud, scope, key) {
        return crud.root.querySelector('[data-cf="' + crud.uid + '"][data-scope="' + scope + '"][data-k="' + key + '"]');
    };
    N.dat = function (el, v) {
        if (!el) return;
        v = e(v);
        if (el.multiple && window.jQuery) jQuery(el).val(v === '' ? [] : String(v).split(','));
        else el.value = v;
        if (el._flatpickr) el._flatpickr.setDate(v || null, false, 'd/m/Y');
        if (el.tagName === 'SELECT' && window.jQuery) jQuery(el).trigger('change.select2').trigger('ums:refresh');
    };

    /* getList_QuyDinhLuong (khongtinhluong, xulybietle) — tên hiện MUCLUONGCOBAN như gốc */
    N.quyDinhLuong = function () {
        return {
            call: { action: 'L_BangQuyDinhLuong/LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 },
            id: 'ID', name: 'MUCLUONGCOBAN'
        };
    };

    /* Đơn vị → Cán bộ (khongtinhluong, xulybietle). Gốc: chọn Đơn vị (ô lọc HOẶC biểu mẫu)
       gọi getList_HS rồi đổ vào CẢ HAI ô Cán bộ (lọc + biểu mẫu) — đổi một bên làm hỏng bên kia.
       Bản mới tách hai cặp:
         · ô lọc  dv → cb : ums.pat.chain (chưa chọn Đơn vị thì khoá Cán bộ; gốc: ô Cán bộ trống
           tới khi chọn Đơn vị).
         · biểu mẫu _donVi → strNhanSu_HoSoCanBo_Id : Đơn vị KHÔNG gửi đi, chỉ để thu hẹp danh
           sách cán bộ; để trống = mọi cán bộ (đúng cách gốc mở biểu mẫu SỬA: Đơn vị rỗng, nạp
           getList_HS("") rồi chọn cán bộ của dòng). Chọn / xoá Đơn vị thì xoá trắng Cán bộ.
       o = { cbForm: 'strNhanSu_HoSoCanBo_Id' } */
    N.ganCanBo = function (crud, o) {
        o = o || {};
        var $ = window.jQuery, pat = ums.pat;
        var kCb = o.cbForm || 'strNhanSu_HoSoCanBo_Id';
        var lDv = N.o(crud, 'filter', 'dv'), lCb = N.o(crud, 'filter', 'cb');
        var fDv = N.o(crud, 'form', '_donVi'), fCb = N.o(crud, 'form', kCb);
        var tLoc = 0, tForm = 0;

        function napLoc() {
            var t = ++tLoc, dv = lDv.value;
            if (!dv) { pat.fill(lCb, [], { head: 'Chọn cán bộ' }); return; }
            N.canBo(dv).then(function (rows) {
                if (t === tLoc) pat.fill(lCb, rows, { name: N.tenCanBo, head: 'Chọn cán bộ' });
            }).catch(function (err) { ums.api.handle(err, 'NS_HoSoV2/LayDanhSach'); });
        }
        function napForm(chon) {
            var t = ++tForm;
            fCb.value = '';
            $(fCb).trigger('change.select2');
            return N.canBo(fDv.value).then(function (rows) {
                if (t !== tForm) return;
                pat.fill(fCb, rows, { name: N.tenCanBo, head: 'Chọn cán bộ' });
                if (chon) N.dat(fCb, chon);
            }).catch(function (err) { ums.api.handle(err, 'NS_HoSoV2/LayDanhSach'); });
        }

        if (lDv && lCb && $) {
            $(lDv).on('select2:select', napLoc);
            pat.chain([lDv, lCb]);
        }
        if (fDv && fCb && $) {
            $(fDv).on('select2:select select2:clear', function () { napForm(''); });
        }
        /* gọi trong onForm: row = dòng đang sửa (null = thêm mới) */
        return {
            moForm: function (row) {
                if (!fDv || !fCb) return;
                if (row) { N.dat(fDv, ''); napForm(row.NHANSU_HOSOCANBO_ID); }
                else napForm(lCb ? lCb.value : '');
            }
        };
    };

    /* ---------- Màn danh mục hệ số ------------------------------------------ */
    N.man = function (root, cfg) {
        if (typeof root === 'string') root = document.getElementById(root);
        if (!root) return null;
        var ctl = cfg.ctl;

        var crud = ums.crud({
            root: root,
            title: cfg.title,
            formTitle: cfg.formTitle || (cfg.title || '').toLowerCase(),
            icon: cfg.icon || 'fa-list-ul',
            filters: cfg.filters || [],
            autoload: cfg.autoload,
            list: {
                paged: true,
                call: function (f) {
                    var p = cfg.list(f) || {};
                    p.action = ctl + '/LayDanhSach';
                    p.method = 'GET';
                    return p;
                }
            },
            columns: cfg.columns,
            formCols: cfg.formCols || 2,
            fields: cfg.fields,
            toolbar: cfg.toolbar,
            save: function (v, row, c) {
                if (cfg.truocLuu && cfg.truocLuu(v, row, c) === false) return null;
                var p = cfg.save(v, row, c);
                if (!p) return null;
                p.action = row ? ctl + '/CapNhat' : ctl + '/ThemMoi';
                p.strId = row ? row.ID : '';
                if (p.strChucNang_Id === undefined) p.strChucNang_Id = '';
                if (p.strNguoiThucHien_Id === undefined) p.strNguoiThucHien_Id = '';
                return p;
            },
            rowDelete: false,
            formDelete: false,
            removeText: 'Xóa',
            removeConfirm: function () { return 'Bạn có chắc chắn xóa dữ liệu không?'; },
            remove: cfg.xoa === false ? null : function (ids) {
                return ids.map(function (id) {
                    return { action: ctl + '/Xoa', strIds: id, strChucNang_Id: '', strNguoiThucHien_Id: '' };
                });
            },
            onForm: function (row, c, extra) {
                if (!row) {
                    var f = c.filterValues();
                    (cfg.fields || []).forEach(function (fd) {
                        if (fd.tuLoc) N.dat(N.o(c, 'form', fd.key), f[fd.tuLoc]);
                    });
                }
                if (cfg.onForm) cfg.onForm(row, c, extra);
            }
        });

        /* Ô lọc ngày (txtSearch_NgayApDung … input-datepicker của gốc) */
        (cfg.filters || []).forEach(function (fd) {
            if (fd.date) ui.datepicker(N.o(crud, 'filter', fd.key));
        });
        if (cfg.sauKhiTao) cfg.sauKhiTao(crud);
        return crud;
    };
})();
