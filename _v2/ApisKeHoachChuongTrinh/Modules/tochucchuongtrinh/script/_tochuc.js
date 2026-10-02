/* =========================================================================
   ums.khctTC — phần dùng chung của 6 màn danh mục đào tạo (module tochucchuongtrinh)
   hedaotao · khoahoc · namhoc · thoigiandaotao · chuongtrinh · noidungchuongtrinh
   ---------------------------------------------------------------------------
   Sáu màn gốc chép cùng một khuôn (zone_notify / zone_input, thanh lọc ngang +
   bảng + biểu mẫu thay chỗ, "Lưu và Nhập tiếp", xoá theo ô đánh dấu gửi MỘT lời
   gọi với chuỗi id nối dấu phẩy) → mỗi màn là một ums.crud; ở đây chỉ gom:
     · nguồn ô chọn (lời gọi chép NGUYÊN từ getList_* của các tệp gốc);
     · T.crud(cfg)   — mặc định chung: saveAgain, chi tiết LayChiTiet (GET),
                        xoá một lời gọi nhiều id;
     · T.o / T.nhieu / T.datTuLoc — đọc ô, đổi ô lọc sang chọn nhiều, điền
                        biểu mẫu thêm mới từ ô lọc (rewrite() của gốc).
   KHÔNG dùng ums.ref.*: bản gốc gọi thẳng các KHCT_X/LayDanhSach (không lọc quyền),
   chép nguyên văn các lời gọi đó ở đây.
   ========================================================================= */
(function (global) {
    'use strict';

    var ums = global.ums;
    var T = ums.khctTC = {};

    /* ---------- Nguồn ô chọn ---------------------------------------------- */
    /** Hệ đào tạo — getList_HeDaoTao (khoahoc.js, chuongtrinh.js) */
    T.srcHe = function () {
        return {
            call: {
                action: 'KHCT_HeDaoTao/LayDanhSach', method: 'GET',
                strTuKhoa: '', strDaoTao_HinhThucDaoTao_Id: '', strDaoTao_BacDaoTao_Id: '',
                strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000
            },
            id: 'ID', name: 'TENHEDAOTAO'
        };
    };

    /** Khoá đào tạo theo hệ — getList_KhoaDaoTao / getList_KhoaDaoTaoKT (chuongtrinh.js) */
    T.khoa = function (heId) {
        return ums.api.call({
            action: 'KHCT_KhoaDaoTao/LayDanhSach', method: 'GET', silent: true,
            strTuKhoa: '', strDaoTao_HeDaoTao_Id: heId || '', strDaoTao_CoSoDaoTao_Id: '',
            strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000
        }).then(function (r) { return Array.isArray(r.data) ? r.data : []; });
    };

    /** Năm học — getList_NamHoc (thoigiandaotao.js) */
    T.srcNamHoc = function () {
        return {
            call: {
                action: 'KHCT_NamHoc/LayDanhSach', method: 'GET',
                strTuKhoa: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 10000000
            },
            id: 'ID', name: 'NAMHOC'
        };
    };

    /** Chương trình — getList_ChuongTrinh (noidungchuongtrinh.js) */
    T.srcChuongTrinh = function () {
        return {
            call: {
                action: 'KHCT_ToChucChuongTrinh/LayDanhSach', method: 'GET',
                strTuKhoa: '', strDaoTao_KhoaDaoTao_Id: '', strDaoTao_HeDaoTao_Id: '', strDaoTao_N_CN_Id: '',
                strDaoTao_KhoaQuanLy_Id: '', strDaoTao_ToChucCT_Cha_Id: '', strNguoiThucHien_Id: '',
                pageIndex: 1, pageSize: 1000000
            },
            id: 'ID', name: 'TENCHUONGTRINH'
        };
    };

    /* ---------- Đọc ô / đổi ô ---------------------------------------------- */
    /** Ô của crud theo phạm vi ('filter' | 'form') và khoá */
    T.o = function (crud, scope, key) {
        return crud.root.querySelector('[data-cf="' + crud.uid + '"][data-scope="' + scope + '"][data-k="' + key + '"]');
    };

    /** Ô lọc chọn NHIỀU (select multiple của gốc) — crud chỉ dựng ô chọn một.
        Nợ tầng chung: ô lọc `multiple` của ums.crud. Giá trị đọc bằng ums.pat.val ("a,b"). */
    T.nhieu = function (crud, key, nhan) {
        var el = T.o(crud, 'filter', key);
        var $ = global.jQuery;
        if (!el) return el;
        if ($ && el.classList.contains('select2-hidden-accessible')) $(el).select2('destroy');
        el.multiple = true;
        ums.ui.select2(el, { placeholder: nhan });
        crud.sourcesReady.then(function () {
            var rong = el.querySelector('option[value=""]');
            if (rong) rong.remove();
            if ($) $(el).val([]).trigger('change.select2').trigger('ums:refresh');
        });
        return el;
    };

    /** rewrite() của gốc: biểu mẫu THÊM MỚI lấy sẵn giá trị ô lọc.
        cap = [[khoá ô lọc, khoá ô biểu mẫu], …]; ô lọc nhiều giá trị thì chỉ điền khi đúng MỘT. */
    T.datTuLoc = function (crud, cap) {
        var $ = global.jQuery;
        cap.forEach(function (p) {
            var v = ums.pat.val(T.o(crud, 'filter', p[0]));
            var el = T.o(crud, 'form', p[1]);
            if (!el || !v || v.indexOf(',') >= 0) return;
            el.value = v;
            if ($) $(el).trigger('change.select2').trigger('ums:refresh');
        });
    };

    /* ---------- Khung crud chung ------------------------------------------- */
    /**
     * T.crud(cfg) → ums.crud với các mặc định của sáu màn:
     *   cfg.ctl        controller (KHCT_HeDaoTao…) — dùng cho LayChiTiet / Xoa
     *   cfg.xoaKhoa    tên tham số id khi xoá: 'strIds' (mặc định) hoặc 'strId' (namhoc, thoigiandaotao)
     * Xoá: gốc gửi MỘT lời gọi, id các dòng đã đánh dấu nối bằng dấu phẩy (arrChecked_Id.toString()).
     */
    T.crud = function (cfg) {
        var ctl = cfg.ctl;
        var khoa = cfg.xoaKhoa || 'strIds';
        var c = {
            saveAgain: 'Lưu và Nhập tiếp',
            detail: function (row) { return { action: ctl + '/LayChiTiet', method: 'GET', strId: row.ID }; },
            remove: function (ids) {
                var o = { action: ctl + '/Xoa', strNguoiThucHien_Id: '' };
                o[khoa] = ids.join(',');
                return o;
            }
        };
        Object.keys(cfg).forEach(function (k) { if (k !== 'ctl' && k !== 'xoaKhoa') c[k] = cfg[k]; });
        return ums.crud(c);
    };

})(window);
