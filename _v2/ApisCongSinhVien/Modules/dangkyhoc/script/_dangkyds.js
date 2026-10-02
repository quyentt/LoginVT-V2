/* =========================================================================
   Khung chung "ĐƯỢC MỞ ĐĂNG KÝ / ĐÃ ĐĂNG KÝ" của Cổng sinh viên › Đăng ký học
   Dùng cho: dangkyhoc/nganh2 (Đăng ký ngành 2), dangkyhoc/dinhhuong (Đăng ký định hướng)
   ---------------------------------------------------------------------------
   Hai màn gốc chép nhau cùng một bố cục MỘT CỘT:
       thanh lọc (ô chọn + nút "Xem…")
       bảng 1 "được mở đăng ký"  — cột cuối là ô chọn MỘT (radio)  → nút "Đăng ký"
       bảng 2 "đã đăng ký"       — cột cuối là ô đánh dấu + chọn tất cả → nút "Hủy đăng ký"
   Một lời gọi trả cả hai bảng (Data.{ rsX, rsY }). Đăng ký / hủy xong thì nạp lại lời gọi đó.

       var ds = ums.dkhDs(root, {
           title, filters: [{ key, label }], xem: { text, icon },
           mo: { title, icon, columns, empty },  da: { title, icon, columns, empty },
           tai(f) → Promise<{ mo: [], da: [] }>,       // f(key) = ô lọc
           chuaChon: 'Vui lòng chọn …?',              // bấm Đăng ký khi chưa chọn dòng
           dangKy(row) → call,  dangKyOk: 'Thêm mới thành công!',
           huy(row) → call,     huyOk: 'Xóa thành công!'
       });
       ds.f(key) · ds.tai() · ds.chonDau(el, rows, idCol) · ds.xoa()

   Khác bản gốc (áp cho cả hai màn):
     · Hủy nhiều dòng: bản gốc gọi xoá từng dòng, MỖI lời gọi xong lại nạp lại
       danh sách (N lần) và bật N thông báo → gom bằng ums.ui.batch, nạp lại MỘT lần.
     · Nút "Hủy đăng ký" = ums.ui.xoaChon (luật chung xoá nhiều dòng): tự đếm,
       khoá khi chưa đánh dấu dòng nào.
     · Nút "Đăng ký" / "Hủy đăng ký" đặt ở đầu khung của bảng tương ứng (bản gốc
       đặt ngay dưới bảng, dạt phải) — cùng cách với Cổng cán bộ canbodangkynganh2.
   ========================================================================= */
(function () {
    'use strict';
    var ums = window.ums, ui = ums.ui, pat = ums.pat;

    function arr(d) { return Array.isArray(d) ? d : []; }

    ums.dkhDs = function (root, o) {
        var DL = { mo: [], da: [] };

        var loc = (o.filters || []).map(function (x) {
            return '<div class="ums-field"><select class="ums-select" data-f="' + ui.esc(x.key) + '" data-ph="' + ui.esc(x.label) + '">' +
                '<option value="">' + ui.esc(x.label) + '</option></select></div>';
        }).join('');
        root.innerHTML =
            pat.page(o.title, '') +
            pat.panel({ title: false, cls: 'ums-u-mb-4', body: '<div class="ums-filter">' + loc +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { text: o.xem.text, icon: o.xem.icon, attr: { 'data-a': 'xem' } }) + '</div></div>' }) +
            pat.panel({ title: o.mo.title, icon: o.mo.icon, flush: true, zone: 'mo',
                tools: ui.btn('save', { text: 'Đăng ký', icon: 'fa-money-check-pen', attr: { 'data-a': 'dangky' } }) }) +
            '<div class="ums-u-mt-4">' + pat.panel({ title: o.da.title, icon: o.da.icon, flush: true, zone: 'da',
                tools: ui.xoaChon('input[data-da]', { goc: '.ums-panel', text: 'Hủy đăng ký', attr: { 'data-a': 'huy' } }) }) + '</div>';
        ui.enhance(root);

        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
        function f(k) { return root.querySelector('[data-f="' + k + '"]'); }

        function ve() {
            ui.table({ el: z('mo'), rows: DL.mo, empty: o.mo.empty || 'Không có dữ liệu',
                columns: o.mo.columns.concat([{ title: '', cls: 'is-center', width: '56px',
                    render: function (r, i) { return '<input type="radio" name="' + ui.esc(o.radio || 'dkhDs') + '" data-mo="' + i + '">'; } }]) });
            ui.table({ el: z('da'), rows: DL.da, empty: o.da.empty || 'Không có dữ liệu',
                columns: o.da.columns.concat([{ head: '<input type="checkbox" data-dall title="Chọn tất cả">', cls: 'is-center', width: '56px',
                    render: function (r, i) { return '<input type="checkbox" data-da="' + i + '">'; } }]) });
        }

        /* Nạp lại cả hai bảng (bản gốc: getList_ChuaDangKy) */
        function tai() {
            return o.tai(f).then(function (kq) {
                DL = { mo: arr(kq && kq.mo), da: arr(kq && kq.da) };
                ve();
            }).catch(function (err) { DL = { mo: [], da: [] }; ve(); ums.api.handle(err, o.title); });
        }
        /* Đưa hai bảng về trống (ô lọc bị xoá) */
        function xoa() { DL = { mo: [], da: [] }; ve(); }

        /* selectFirst của loadToCombo_data */
        function chonDau(el, rows, id) {
            if (rows.length) { el.value = rows[0][id || 'ID']; if (window.jQuery) jQuery(el).trigger('change.select2'); }
        }

        z('da').addEventListener('change', function (ev) {
            if (!ev.target.hasAttribute('data-dall')) return;
            Array.prototype.forEach.call(z('da').querySelectorAll('input[data-da]'), function (c) { c.checked = ev.target.checked; });
        });

        root.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || b.disabled) return;
            var a = b.getAttribute('data-a');
            if (a === 'xem') tai();
            else if (a === 'dangky') {
                var c = z('mo').querySelector('input[data-mo]:checked');
                if (!c) { ui.toast(o.chuaChon || 'Vui lòng chọn đối tượng?', 'warn'); return; }
                var row = DL.mo[Number(c.getAttribute('data-mo'))];
                ui.confirm('Bạn có chắc chắn đăng ký không?', { title: 'Đăng ký', ok: 'Đăng ký' }).then(function (yes) {
                    if (!yes) return;
                    return ums.api.call(o.dangKy(row)).then(function () {
                        ui.toast(o.dangKyOk || 'Thêm mới thành công!', 'ok');
                        return tai();
                    });
                }).catch(function (err) { ums.api.handle(err, 'đăng ký'); });
            }
            else if (a === 'huy') {
                var rows = Array.prototype.filter.call(z('da').querySelectorAll('input[data-da]:checked'), function () { return true; })
                    .map(function (x) { return DL.da[Number(x.getAttribute('data-da'))]; });
                if (!rows.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
                ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Hủy đăng ký', cancel: 'Đóng', title: 'Hủy đăng ký' }).then(function (yes) {
                    if (!yes) return;
                    ui.batch(rows.map(o.huy), { title: 'Đang hủy đăng ký', okText: o.huyOk || 'Xóa thành công!' }).then(tai);
                });
            }
        });

        ve();
        return { f: f, tai: tai, xoa: xoa, chonDau: chonDau };
    };
})();
