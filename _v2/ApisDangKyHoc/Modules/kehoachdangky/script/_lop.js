/* =========================================================================
   Tầng chung của bốn màn kehoachdangky: lophoc · donlop · quanlytoanbo · lichsu
   (ums.dkhLop). Nạp bằng <script src="../script/_lop.js"> trước tệp của màn.
   ---------------------------------------------------------------------------
   · e / arr / rows / fail            tiện ích nhỏ
   · s2multi / fillMulti / multi      ô chọn NHIỀU có mục "Chọn tất cả" như
                                      loadToCombo_data của Corei (systemroot.js:2353,
                                      :2410): chọn "Chọn tất cả" → chọn hết; nạp lại
                                      danh sách thì bỏ chọn (gốc val("") sau mỗi lần nạp).
                                      Giá trị gửi = các ID nối dấu phẩy, không có
                                      SELECTALL (= edu.util.getValById / getValCombo).
                                      [Bản giống hệt đang nằm ở ApisTaiChinh/…/_chung_b.js
                                      (B.s2multi / B.fillMulti) — nên đưa lên ums.pat.]
   · dt.he / khoa / ct / lop          edu.system.getList_HeDaoTao / KhoaDaoTao /
                                      ChuongTrinhDaoTao / LopQuanLy — bản CỦA Corei
                                      (systemroot.js:3759, 3837, 3913, 4080), tham số
                                      chép nguyên. Khác ums.ref.lopQuanLy: Corei gửi
                                      thêm strDaoTao_KhoaQuanLy_Id ('' ở cả bốn màn).
                                      KHÔNG lọc quyền — bốn màn gốc gọi đúng các hàm này.
   · trangThai(host)                  nhóm ô đánh dấu trạng thái sinh viên (QLSV.TRANGTHAI,
                                      genList_TrangThaiSV của gốc) — ums.pat.checks
   · cotChon(tên) / chon(host, tên)   cột ô đánh dấu ở CUỐI bảng (checkX + ID của gốc)
                                      + ô "chọn tất cả" ở tiêu đề. Thuộc tính data-lck —
                                      KHÔNG dùng data-ck vì màn có ums.pat.checks.
   ========================================================================= */
(function (global) {
    'use strict';
    var ums = global.ums, ui = ums.ui, pat = ums.pat;
    var L = {};

    L.e = function (v) { return v === undefined || v === null ? '' : v; };
    L.arr = function (d) { return Array.isArray(d) ? d : (d && d.rs) || []; };
    L.rows = function (call) {
        call.silent = true;
        return ums.api.call(call).then(function (r) { return L.arr(r.data); });
    };
    L.fail = function (noi) { return function (err) { ums.api.handle(err, noi); }; };

    /* ---------- Ô chọn nhiều có "Chọn tất cả" ------------------------------ */
    L.s2multi = function (el) {
        if (!el) return;
        ui.select2(el);
        if (!global.jQuery) return;
        jQuery(el).on('select2:select', function (ev) {
            var v = jQuery(el).val() || [];
            if (v.indexOf('SELECTALL') < 0) return;
            ev.stopImmediatePropagation();
            var all = Array.prototype.slice.call(el.options).map(function (o) { return o.value; })
                .filter(function (x) { return x && x !== 'SELECTALL'; });
            jQuery(el).val(all).trigger('change').trigger({ type: 'select2:select', params: { data: { id: 'SELECTALL' } } });
        });
    };
    L.fillMulti = function (el, rows, o) {
        if (!el) return;
        o = o || {};
        var id = o.id || 'ID', name = o.name || 'TEN';
        var h = (rows && rows.length) ? '<option value="SELECTALL">Chọn tất cả</option>' : '';
        (rows || []).forEach(function (r) {
            var t = typeof name === 'function' ? name(r) : r[name];
            h += '<option value="' + ui.esc(r[id]) + '">' + ui.esc(t) + '</option>';
        });
        el.innerHTML = h;
        if (global.jQuery) jQuery(el).val([]).trigger('change.select2').trigger('ums:refresh');
    };
    L.multi = function (el) {
        if (!el) return '';
        if (!el.multiple) return pat.val(el);
        return Array.prototype.slice.call(el.options)
            .filter(function (o) { return o.selected && o.value && o.value !== 'SELECTALL'; })
            .map(function (o) { return o.value; }).join(',');
    };

    /* ---------- Danh mục đào tạo — bản Corei ------------------------------- */
    function z(v) { return v === undefined || v === null || v === '' ? 0 : v; }
    L.dt = {
        he: function () {
            return L.rows({ action: 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eCSQFIC4VIC4P', func: 'pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTao',
                strDAOTAO_HinhThucDaoTao_Id: '', strDaoTao_BacDaoTao_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '',
                pageIndex: 1, pageSize: 1000000 });
        },
        khoa: function (he) {
            return L.rows({ action: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eCikuIAUgLhUgLgPP', func: 'pkg_kehoach_thongtin.LayDSKS_DaoTao_KhoaDaoTao',
                strDAOTAO_HeDaoTao_Id: L.e(he), strDaoTao_CoSoDaoTao_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '',
                pageIndex: 1, pageSize: 1000000 });
        },
        /* Gốc chỉ truyền strKhoaDaoTao_Id → strDaoTao_HeDaoTao_Id rỗng */
        ct: function (khoa) {
            return L.rows({ action: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eFS4CKTQiAhUP', func: 'pkg_kehoach_thongtin.LayDSKS_DaoTao_ToChucCT',
                strDaoTao_HeDaoTao_Id: '', strDaoTao_KhoaDaoTao_Id: L.e(khoa), strDaoTao_N_CN_Id: '', strDaoTao_KhoaQuanLy_Id: '',
                strDaoTao_ToChucCT_Cha_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 });
        },
        lop: function (he, khoa, ct) {
            return L.rows({ action: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eDS4xEDQgLw04', func: 'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy',
                strDaoTao_CoSoDaoTao_Id: '', strDaoTao_HeDaoTao_Id: L.e(he), strDaoTao_KhoaDaoTao_Id: L.e(khoa),
                strDaoTao_KhoaQuanLy_Id: '', strDaoTao_Nganh_Id: '', strDaoTao_LoaiLop_Id: '', strDaoTao_ToChucCT_Id: L.e(ct),
                strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 });
        }
    };

    /* ---------- Trạng thái sinh viên --------------------------------------- */
    /* trả đối tượng của ums.pat.checks + `.ready` (Promise, xong khi đã vẽ các ô) */
    L.trangThai = function (host) {
        var p = ums.api.dm('QLSV.TRANGTHAI');
        var c = pat.checks(host, p, { cols: 3, what: 'trạng thái sinh viên' });
        c.ready = p.then(function () {}, function () {});
        return c;
    };

    /* ---------- Cột ô đánh dấu dòng ---------------------------------------- */
    L.cotChon = function (ten, idCol) {
        return {
            head: '<input type="checkbox" data-lckall="' + ui.esc(ten) + '" title="Chọn tất cả">',
            cls: 'is-center is-actions', width: '48px',
            render: function (r) { return '<input type="checkbox" data-lck="' + ui.esc(ten) + '" value="' + ui.esc(r[idCol || 'ID']) + '">'; }
        };
    };
    /** Các ID đang đánh dấu của bảng `ten` trong `host` */
    L.chon = function (host, ten) {
        return Array.prototype.map.call(host.querySelectorAll('input[data-lck="' + ten + '"]:checked'), function (c) { return c.value; });
    };
    /** Gắn một lần trên gốc màn: ô "chọn tất cả" của mọi bảng dùng cotChon */
    L.ganChonTatCa = function (root) {
        root.addEventListener('change', function (ev) {
            var t = ev.target, ten = t.getAttribute && t.getAttribute('data-lckall');
            if (!ten) return;
            var bang = t.closest('table');
            Array.prototype.forEach.call((bang || root).querySelectorAll('input[data-lck="' + ten + '"]'), function (c) {
                c.checked = t.checked;
                var tr = c.closest('tr');
                if (tr) tr.classList.toggle('is-selected', c.checked);
            });
            if (ui.demXoaChon) ui.demXoaChon();
        });
        root.addEventListener('change', function (ev) {
            var t = ev.target;
            if (!t.getAttribute || !t.getAttribute('data-lck')) return;
            var tr = t.closest('tr');
            if (tr) tr.classList.toggle('is-selected', t.checked);
        });
    };

    ums.dkhLop = L;
})(window);
