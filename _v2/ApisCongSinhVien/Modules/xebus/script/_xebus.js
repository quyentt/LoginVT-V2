/* =========================================================================
   _xebus.js — phần dùng chung của module xebus (Cổng sinh viên)
   Dùng ở: xebus (Đăng ký xe buýt), vethang (Vé tháng).
   ---------------------------------------------------------------------------
   Hai màn gốc mở đầu giống hệt nhau: MỘT ô chọn "Chọn kế hoạch" + nút "Xem",
   chọn ô (select2:select) hoặc bấm "Xem" thì nạp lại toàn bộ danh sách.
   Khác nhau đúng hai chỗ, nên đưa vào tham số:
     · lời gọi nạp kế hoạch (xebus: LayDSKeHoach_DichVu_XeBus,
       vethang: LayDSKeHoachVeThang);
     · luật chọn sẵn của loadToCombo_data bản gốc — xebus khai `selectOne: true`
       (Core/systemroot.js:2391: CHỈ chọn khi danh sách có đúng một mục),
       vethang khai `selectFirst: true` (luôn chọn mục đầu).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var X = {};

    X.arr = function (d) { return Array.isArray(d) ? d : []; };
    X.e = function (v) { return v === null || v === undefined ? '' : v; };

    /** Thanh lọc: ô chọn kế hoạch + nút "Xem" (chữ nút giữ đúng bản gốc) */
    X.thanhLoc = function (o) {
        o = o || {};
        var nhan = o.label || 'Chọn kế hoạch';
        return pat.panel({
            title: false, cls: 'ums-u-mb-4',
            body: '<div class="ums-filter">' +
                '<div class="ums-field"><select class="ums-select" data-f="kh" data-ph="' + ui.esc(nhan) + '">' +
                '<option value="">' + ui.esc(nhan) + '</option></select></div>' +
                '<div class="ums-field ums-field--fit">' +
                ui.btn('search', { text: 'Xem', attr: { 'data-a': 'xem' } }) + '</div></div>'
        });
    };

    /**
     * Nạp danh sách kế hoạch vào ô chọn và gắn xử lý chọn / xoá ô.
     * o = { chon: 'mot' (selectOne) | 'dau' (selectFirst), label, name, onDoi(coGiaTri) }
     * onDoi cũng chạy khi ô được chọn SẴN lúc mở màn (bản gốc chỉ đổ giá trị mà
     * không nạp danh sách — người dùng phải bấm "Xem"; ở đây nạp luôn cho khỏi
     * bắt bấm thêm một nút, xem chú thích đầu từng màn).
     */
    X.napKeHoach = function (el, call, o) {
        o = o || {};
        var nhan = o.label || 'Chọn kế hoạch';
        if (window.jQuery) {
            jQuery(el).on('select2:select select2:clear', function () { if (o.onDoi) o.onDoi(!!el.value); });
        }
        return ums.api.call(call).then(function (r) {
            var ds = X.arr(r.data);
            pat.fill(el, ds, { name: o.name || 'TENKEHOACH', head: nhan });
            var tu = o.chon === 'dau' ? ds[0] : (ds.length === 1 ? ds[0] : null);
            if (tu) {
                el.value = tu.ID;
                if (window.jQuery) jQuery(el).trigger('change.select2');
                if (o.onDoi) o.onDoi(true);
            }
            return ds;
        }).catch(function (err) { ums.api.handle(err, 'kế hoạch'); return []; });
    };

    ums.xebus = X;
})();
