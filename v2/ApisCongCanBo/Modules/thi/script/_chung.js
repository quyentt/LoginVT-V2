/* =========================================================================
   thi — phần dùng chung của các màn nhóm Thi
   ums.thi.chung(ten, o)   gọi XLHV_TP_Chung_MH · pkg_thi_phach_chung.<ten> (mã hoá, POST) — ten: LayThoiGian, LayLoaiDiem,
                           LayHinhThucThi, LayDotThi, LayHocPhan
   ums.thi.loc({ f, tang, multiTg, chonDau, onDoi })
       Bộ lọc nối tầng Thời gian → Loại điểm → Hình thức thi [→ Đợt thi → Môn thi] (khác ums.nd.locThi của nhapdiem:
       dịch vụ XLHV_TP_Chung_MH mã hoá thay vì TP_Chung GET; ô Thời gian có thể CHỌN NHIỀU — gửi chuỗi "id,id").
       tang: mảng khoá theo thứ tự, mặc định ['tg','ld','ht']; f(k) → ô chọn. Tham số chép nguyên:
         LayLoaiDiem(strDaoTao_ThoiGianDaoTao_Id) · LayHinhThucThi(strDiem_ThanhPhanDiem_Id, …) ·
         LayDotThi(strHinhThucThi_Id, …) · LayHocPhan(strDotThi_Id, …) — tên "TEN - MA"
       tang có thể thêm 'dp' (Đợt phách: LayDotTaoPhach strDotThi_Id, strDaoTao_HocPhan_Id). o.them(k) → tham số THÊM cho tầng k
       (vd Đơn vị strDaoTao_CoCauToChuc_Id gửi vào LayDotThi, LayHocPhan).
       → { v(k) giá trị (ô nhiều = chuỗi nối phẩy), napLai(k), xong: Promise }
   ums.thi.canBo(o) — "Cán bộ coi thi / chấm thi": MÀN CON mở TRONG TRANG khi có o.host = gốc màn (ums.pat.formTrang, BO-CUC luật 1;
       bước Thứ tự / Số lượng là tầng hai trong chính khung đó; không truyền host thì hộp thoại như trước) (getList_PhanCong + save_PhanCong + delete_PhanCong của phancoithi,
       phanchamthi, phanchamtui, phanphuckhao). o = { title, ids (dòng đã đánh dấu), ds: [mã, func, tên tham số id], them: [mã, func],
       xoa: [mã, func], xemTruoc (bước Thứ tự / Số lượng — gửi "id;thứTự;sốLượng,…"), danhTu, onDone }
       Không xem trước (phanphuckhao): mỗi cán bộ × mỗi dòng một lời gọi, tham số id = MỘT dòng.
   ========================================================================= */
(function () {
    'use strict';
    var pat = ums.pat;
    var thi = ums.thi = ums.thi || {};
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    var MA = { LayThoiGian: 'DSA4FSkuKAYoIC8P', LayLoaiDiem: 'DSA4DS4gKAUoJCwP', LayHinhThucThi: 'DSA4CSgvKRUpNCIVKSgP', LayDotThi: 'DSA4BS41FSko', LayHocPhan: 'DSA4CS4iESkgLwPP',
        LayDotTaoPhach: 'DSA4BS41FSAuESkgIikP' };
    thi.chung = function (ten, o) {
        return ums.api.call(Object.assign({ action: 'XLHV_TP_Chung_MH/' + MA[ten], func: 'pkg_thi_phach_chung.' + ten, strNguoiThucHien_Id: uid() }, o));
    };
    thi.loc = function (o) {
        var f = o.f, tang = o.tang || ['tg', 'ld', 'ht'];
        function v(k) {
            var el = f(k); if (!el) return '';
            if (el.multiple) return (window.jQuery ? jQuery(el).val() || [] : []).filter(function (x) { return x && x !== 'SELECTALL'; }).join(',');
            return el.value.trim();
        }
        var TT = {
            tg: ['LayThoiGian', function () { return {}; }, 'THOIGIAN', 'Chọn thời gian'],
            ld: ['LayLoaiDiem', function () { return { strDaoTao_ThoiGianDaoTao_Id: v('tg') }; }, 'TEN', 'Chọn loại điểm'],
            ht: ['LayHinhThucThi', function () { return { strDiem_ThanhPhanDiem_Id: v('ld'), strDaoTao_ThoiGianDaoTao_Id: v('tg') }; }, 'TEN', 'Chọn hình thức thi'],
            dot: ['LayDotThi', function () { return { strHinhThucThi_Id: v('ht'), strDiem_ThanhPhanDiem_Id: v('ld'), strDaoTao_ThoiGianDaoTao_Id: v('tg') }; }, 'TEN', 'Chọn đợt thi'],
            mon: ['LayHocPhan', function () { return { strDotThi_Id: v('dot'), strHinhThucThi_Id: v('ht'), strDiem_ThanhPhanDiem_Id: v('ld'), strDaoTao_ThoiGianDaoTao_Id: v('tg') }; },
                function (x) { return e(x.TEN) + ' - ' + e(x.MA); }, 'Chọn môn thi'],
            dp: ['LayDotTaoPhach', function () { return { strChucNang_Id: (ums.state && ums.state.chucNangId) || '', strDotThi_Id: v('dot'), strDaoTao_HocPhan_Id: v('mon') }; }, 'TEN', 'Chọn đợt phách']
        };
        var chuoi = pat.chain(tang.map(f), { phatLai: false });
        function nap(i) {
            var k = tang[i], t = TT[k];
            if (i && !v(tang[i - 1])) { pat.fill(f(k), []); chuoi.sync(); return Promise.resolve(); }
            return thi.chung(t[0], Object.assign(t[1](), o.them ? o.them(k) : {})).then(function (r) {
                var d = arr(r.data);
                pat.fill(f(k), d, { name: t[2], head: f(k).multiple ? undefined : t[3] });
                if (!i && o.chonDau && d.length && !f(k).multiple) { f(k).value = d[0].ID; if (window.jQuery) jQuery(f(k)).trigger('change.select2'); }
                chuoi.sync();
            }).catch(function (err) { ums.api.handle(err, t[3]); });
        }
        function napTu(i) { var p = Promise.resolve(); for (var k = i; k < tang.length; k++) (function (k) { p = p.then(function () { return nap(k); }); })(k); return p; }
        if (window.jQuery) tang.forEach(function (k, i) {
            jQuery(f(k)).on('select2:select select2:unselect select2:clear', function () { napTu(i + 1).then(function () { if (o.onDoi) o.onDoi(k); }); });
        });
        /* ô NGOÀI chuỗi đổi (vd Đơn vị) → nạp lại từ tầng k */
        function napLai(k) { var i = tang.indexOf(k); return i < 0 ? Promise.resolve() : napTu(i); }
        return { v: v, napLai: napLai, xong: o.chonDau ? napTu(0) : nap(0) };
    };
    thi.canBo = function (o) {
        var ui = ums.ui, PC = 'XLHV_TP_PhanCong_MH/', ds = [];
        function goi(a, t) { return Object.assign({ action: PC + a[0], func: 'pkg_thi_phancong.' + a[1], strNguoiThucHien_Id: uid() }, t); }
        var mo = o.host ? pat.formTrang : ui.dialog;
        var dlg = mo({ host: o.host, cols: 1, title: o.title, icon: 'fa-chalkboard-user', size: 'xl', body: '<p class="ums-u-fz13 ums-u-muted">Áp dụng cho ' + o.ids.length + ' dòng đã chọn.</p><div data-x="bang"></div>',
            buttons: [{ text: 'Xóa', kind: 'del', onClick: function () { xoa(); return false; } }, { text: 'Thêm mới', kind: 'add', onClick: function () { them(); return false; } }] });
        var h = dlg.body.querySelector('[data-x="bang"]');
        function tai() {
            h.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            var t = {}; t[o.ds[2]] = o.ids.join(',');
            return ums.api.call(goi(o.ds, t)).then(function (r) {
                ds = arr(r.data);
                var cot = [{ title: 'Họ đệm', prop: 'HODEM' }, { title: 'Tên', prop: 'TEN' }, { title: 'Mã số', prop: 'MASO', cls: 'is-nowrap' }, { title: 'Thông tin phân công', prop: 'THONGTIN' }];
                if (o.xemTruoc) cot.push({ title: 'Thứ tự', prop: 'STT', cls: 'is-center', width: '90px' }, { title: 'Số lượng', prop: 'SOLUONG', cls: 'is-center', width: '90px' });
                /* data-pcck (không phải data-ck): khung nay nằm TRONG gốc màn, ô "chọn tất cả" của màn cũng nghe data-ck */
                cot.push({ head: '<input type="checkbox" data-pcck="all" title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (x, i) { return '<input type="checkbox" data-pcck="' + i + '">'; } });
                ui.table({ el: h, rows: ds, empty: 'Chưa phân công cán bộ', columns: cot });
            }).catch(function (err) { h.innerHTML = ui.fail(err.message); });
        }
        function xong() { return tai().then(function () { if (o.onDone) o.onDone(); }); }
        function xoa() {
            var chon = Array.prototype.filter.call(h.querySelectorAll('input[data-pcck]:checked'), function (c) { return c.getAttribute('data-pcck') !== 'all'; })
                .map(function (c) { return ds[Number(c.getAttribute('data-pcck'))]; }).filter(Boolean);
            if (!chon.length) { ui.toast('Vui lòng chọn đối tượng cần xóa', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                if (yes) ui.batch(chon.map(function (x) { return goi(o.xoa, { strId: x.ID }); }), { title: 'Đang xoá', okText: 'Xóa thành công', show: true }).then(xong);
            });
        }
        function luu(list) {
            if (!o.xemTruoc) {
                var calls = [];
                list.forEach(function (n) { o.ids.forEach(function (id) { var t = { strNhanSu_HoSoCanBo_v2_Id: n.ID }; t[o.ds[2]] = id; calls.push(goi(o.them, t)); }); });
                return ui.batch(calls, { title: 'Đang phân công', okText: 'Thực hiện thành công', concurrency: 10, show: true }).then(xong);
            }
            /* tầng hai: thay chỗ trong chính khung phân công (dlg.body) khi khung đang ở trong trang */
            var d2 = mo({ host: dlg.body, cols: 1, title: 'Danh sách nhân sự sẽ phân ' + o.danhTu + ' (' + list.length + ')', icon: 'fa-list-ol', size: 'lg', body: '<div data-x="xt"></div>',
                buttons: [{ text: 'Lưu', kind: 'save', onClick: function () {
                    var calls = list.map(function (n) {
                        var tt = d2.body.querySelector('[data-tt="' + n.ID + '"]').value.trim(), sl = d2.body.querySelector('[data-sl="' + n.ID + '"]').value.trim();
                        var t = { strNhanSu_HoSoCanBo_v2_Id: n.ID }; t[o.ds[2]] = o.ids.map(function (id) { return id + ';' + tt + ';' + sl; }).join(',');
                        return goi(o.them, t);
                    });
                    /* lưu xong mới đóng (trước đây đóng ngay khi bấm); MỌI lời gọi đều lỗi thì ở lại để sửa Thứ tự / Số lượng rồi lưu lại —
                       đã có lời gọi thành công thì đóng, tránh lưu lần hai thành phân công trùng */
                    ui.batch(calls, { title: 'Đang phân công', okText: 'Thực hiện thành công', show: true }).then(function (r) { if (r.ok) d2.close(); return xong(); });
                    return false;
                } }] });
            ui.table({ el: d2.body.querySelector('[data-x="xt"]'), rows: list, columns: [{ title: 'Mã số', prop: 'MASO', cls: 'is-nowrap' },
                { title: 'Họ tên', render: function (n) { return ui.esc(e(n.HOTEN) || (e(n.HODEM) + ' ' + e(n.TEN))); } },
                { title: 'Thứ tự', cls: 'is-center', width: '110px', render: function (n) { return '<input class="ums-input ums-input--sm" type="number" min="1" data-tt="' + ui.esc(n.ID) + '" style="width:80px">'; } },
                { title: 'Số lượng', cls: 'is-center', width: '110px', render: function (n) { return '<input class="ums-input ums-input--sm" type="number" min="1" data-sl="' + ui.esc(n.ID) + '" style="width:80px">'; } }] });
        }
        function them() { pat.pickNhanSu({ title: 'Tìm kiếm giảng viên', onPick: function (list) { luu(list); } }); }
        dlg.body.addEventListener('change', function (ev) {
            if (ev.target.getAttribute('data-pcck') === 'all') Array.prototype.forEach.call(h.querySelectorAll('tbody input[data-pcck]'), function (c) { c.checked = ev.target.checked; });
        });
        tai();
        return dlg;
    };
})();
