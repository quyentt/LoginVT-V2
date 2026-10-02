/* =========================================================================
   Kế hoạch công nhận điểm — tiện ích dùng chung của màn (ums.qldKh)
   Bản gốc: ApisQuanLyDiem/Modules/kehoach/script/kehoach.js
   ---------------------------------------------------------------------------
   Dựa trên ums.khxl (nạp chéo ApisXuLyHocVu/Modules/kehoachxuly/script/_khxl_chung.js):
       K.cotChon(k) / K.ganChon(host) / K.daChon(host, k)   cột ô đánh dấu (checkX của gốc)
       K.locTaiCho(input, host)                             ô tìm tại chỗ (bFilter của gốc)
       K.xoa(calls, xong)                                   hỏi lại + chạy hàng loạt
       K.ds / K.tim / K.dang / K.loi / K.hoTen / K.e
   Thêm ở đây:
       Q.bang(host, rows, cfg)   bảng phân trang ở MÁY KHÁCH (lời gọi gốc không gửi pageIndex/pageSize
                                 nên máy chủ trả hết; loadToTable_data tự chia trang) — ums.ui.table
                                 chưa có phân trang máy khách (nợ tầng chung).
       Q.nut(kind, text, a, id, icon)   nút nhỏ viền trong ô bảng
       Q.chon(sel, rows, head, name)    đổ ô chọn (pat.fill)
       Q.datGiaTri(el, v)               đặt giá trị ô chọn / ô ngày / ô chữ
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc, K = ums.khxl;
    var Q = ums.qldKh = ums.qldKh || {};

    Q.K = K;
    Q.e = K.e;
    Q.CN = 'SV_CongNhanDiem_MH/';
    Q.CND = 'SV_CND_ThongTin_MH/';

    Q.nut = function (kind, text, a, id, icon) {
        return ui.btn(kind, { text: text, mod: 'out-primary', icon: icon, cls: 'ums-btn--sm', attr: { 'data-a': a, 'data-id': id } });
    };

    Q.chon = function (el, rows, head, name) { pat.fill(el, rows, { head: head, name: name || 'TEN' }); };

    Q.datGiaTri = function (el, v) {
        if (!el) return;
        el.value = v === undefined || v === null ? '' : String(v);
        if (el.tagName === 'SELECT' && window.jQuery) jQuery(el).trigger('change.select2');
        if (el._flatpickr) { if (el.value) el._flatpickr.setDate(el.value, false, 'd/m/Y'); else el._flatpickr.clear(); }
    };

    /** Bảng chia trang ở máy khách: cfg = { columns, empty, size, sau() } → { ve(rows), trang() } */
    Q.bang = function (host, cfg) {
        var rows = [], page = 1, size = cfg.size || (ums.cfg && ums.cfg.behavior && ums.cfg.behavior.pageSize) || 10;
        function ve() {
            var tong = rows.length, tu = (page - 1) * size;
            ui.table({
                el: host, rows: rows.slice(tu, tu + size), columns: cfg.columns, empty: cfg.empty,
                page: {
                    index: page, size: size, total: tong,
                    onChange: function (p) { if (p >= 1 && p <= Math.ceil(tong / size)) { page = p; ve(); } },
                    onSize: function (v) { size = v === 'all' ? ui.PAGE_ALL : Number(v); page = 1; ve(); }
                }
            });
            if (cfg.sau) cfg.sau();
        }
        return {
            ve: function (d) { rows = d || []; page = 1; ve(); },
            rows: function () { return rows; }
        };
    };

    /** Nhãn "Có hiệu lực" / "Hết hiệu lực" — gốc: aData.HIEULUC ? … : … (chuỗi "0" cũng tính là hết hiệu lực) */
    Q.hieuLuc = function (v) {
        var co = !!v && String(v) !== '0';
        return co ? ui.badge('Có hiệu lực', 'ok') : ui.badge('Hết hiệu lực', 'mute');
    };

    Q.esc = esc;
})();
