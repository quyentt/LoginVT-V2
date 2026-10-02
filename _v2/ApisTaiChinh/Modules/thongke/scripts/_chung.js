/* =========================================================================
   Dùng chung cho các màn thống kê (theodoicongno, tonghoptaichinh,
   hachtoantaichinh) — chỉ tiện ích hiển thị, không có lời gọi API.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;

    function num(v) {
        var n = Number(String(v === null || v === undefined ? '' : v).replace(/[^\d.-]/g, ''));
        return isNaN(n) ? 0 : n;
    }

    ums.thongke = {
        num: num,

        /**
         * Thẻ số liệu. links: [{ act, text, icon }] → nối kết mở khung chi tiết.
         *
         * o.img  ảnh làm biểu tượng — bản gốc dùng Upload/images/accounting-*.png,
         *        đã chép sang _v2/assets/img/. Không có thì dùng o.icon của Font Awesome.
         *
         * Liên kết vẽ bằng .ums-link (chữ xanh, gạch chân khi rê chuột) chứ không
         * phải nút xám — nhìn là biết bấm được.
         */
        stat: function (o) {
            var bt = o.img
                ? '<img src="' + ui.esc(o.img) + '" alt="">'
                : '<i class="fa-light ' + ui.esc(o.icon) + '"></i>';
            return '<div class="ums-stat' + (o.tone ? ' ums-stat--' + o.tone : '') + '">' +
                '<div class="ums-stat__icon">' + bt + '</div>' +
                '<div class="ums-stat__main"><div class="ums-stat__value">' + ui.money(num(o.value)) + '</div>' +
                '<div class="ums-stat__label">' + ui.esc(o.label) + '</div>' +
                (o.links && o.links.length ? '<div class="ums-stat__links">' + o.links.map(function (l) {
                    return '<button type="button" class="ums-link" data-act="' + ui.esc(l.act) + '">' +
                        '<i class="fa-light ' + ui.esc(l.icon) + '"></i><span>' + ui.esc(l.text) + '</span></button>';
                }).join('') + '</div>' : '') +
                '</div></div>';
        },

        /** Dòng "Số liệu tính đến …" — thay dòng "Thời gian: …" viết cứng của bản
            gốc (hachtoantaichinh.html:13 ghi chết 27/07/2018 - 20/08/2018, không theo
            dữ liệu nào). Ở đây là thời điểm số liệu được nạp, có thật. */
        thoiDiem: function (el) {
            if (!el) return;
            var d = new Date();
            function hai(n) { return (n < 10 ? '0' : '') + n; }
            el.textContent = hai(d.getDate()) + '/' + hai(d.getMonth() + 1) + '/' + d.getFullYear() +
                ' ' + hai(d.getHours()) + ':' + hai(d.getMinutes());
        },

        /** Cột số tiền màu đỏ như bản gốc (color-danger), căn phải */
        moneyCol: function (title, prop) {
            return {
                title: title, cls: 'is-right is-nowrap',
                render: function (r) { return '<span class="ums-u-danger">' + ui.money(num(r[prop])) + '</span>'; }
            };
        },

        /* Bảng phân trang máy chủ: call(page) → tham số ums.api.call.
           Trả { load(page) }. Dùng cho các bảng "chi tiết theo đối tượng"
           (bản gốc: bPaginate + pageIndex_default 1 / pageSize_default 10). */
        pagedTable: function (el, cfg) {
            var size = 10;
            function load(page) {
                page = page || 1;
                el.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
                var call = cfg.call();
                call.pageIndex = page;
                call.pageSize = size;
                return ums.api.call(call).then(function (r) {
                    var rows = Array.isArray(r.data) ? r.data : (r.data && r.data.rs) || [];
                    var total = Number(r.pager) || rows.length;
                    ui.table({
                        el: el, rows: rows, columns: cfg.columns, empty: cfg.empty,
                        page: {
                            index: page, size: size, total: total,
                            onChange: function (p) {
                                if (p >= 1 && p <= Math.ceil(total / size)) load(p);
                            },
                            onSize: function (v) { size = v; load(1); }
                        }
                    });
                    if (cfg.onLoad) cfg.onLoad(rows, total, r);
                }).catch(function (err) {
                    el.innerHTML = ui.fail(err.message);
                    ums.api.handle(err, cfg.where || '');
                });
            }
            return { load: load };
        }
    };
})();
