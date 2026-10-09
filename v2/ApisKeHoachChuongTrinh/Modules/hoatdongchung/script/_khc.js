/* =========================================================================
   Kế hoạch chung (KHCT hoatdongchung) — tiện ích dùng chung của hai màn
   kehoach (kế hoạch NĂM) và kehoachchitiet (kế hoạch CHI TIẾT) — ums.khctKh
   Bản gốc: ApisKeHoachChuongTrinh/Modules/hoatdongchung/script/kehoach.js và
            kehoachchitiet.js (cùng lớp KeHoachXuLy, chép nhau: danh sách + biểu mẫu
            + vùng "Nhân sự" thay chỗ nhau bằng zone-bus / toggle_overide).
   ---------------------------------------------------------------------------
   Dựa trên ums.khxl (nạp chéo ApisXuLyHocVu/Modules/kehoachxuly/script/_khxl_chung.js):
       K.cotChon / ganChon / daChon (cột ô đánh dấu), K.xoa (hỏi lại + chạy hàng loạt),
       K.ds / tim / dang / loi / e.
   Thêm ở đây:
       H.KH / H.CHUNG / H.P / H.PC   tiền tố action + package (chép nguyên)
       H.goi(action, func, o)        ums.api.call kèm strNguoiThucHien_Id ''
       H.hieuLuc(r) / H.khoaDL(r)    hai cột "Hiệu lực" / "Khóa dữ liệu"
       H.nut(text, a, id)            nút "Chi tiết" trong ô bảng (kind view)
       H.suaBtn(id)                  nút sửa trong ô bảng
       H.loc(rows, q)                lọc dòng theo từ khoá (không dấu)
       H.datGiaTri(el, v)            đặt giá trị ô chọn / ô ngày / ô chữ
       H.taoNhanSu(zone, cfg)        vùng "Danh sách" nhân sự (#zoneDSNhanSu của gốc)
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, esc = ui.esc, K = ums.khxl;
    var H = ums.khctKh = ums.khctKh || {};

    H.K = K;
    H.e = K.e;
    H.KH = 'KHCT_HoatDong_KeHoach_MH/';
    H.CHUNG = 'KHCT_HoatDong_Chung_MH/';
    H.TT = 'KHCT_HoatDong_ThongTin_MH/';
    H.P = 'PKG_KEHOACH_HOATDONG_KEHOACH.';

    H.goi = function (action, func, o) {
        return ums.api.call(Object.assign({ action: action, func: func, strNguoiThucHien_Id: '' }, o || {}));
    };

    /* Gốc: aData.HIEULUC ? "Hiệu lực" : "Hết hiệu lực" — chuỗi "0" cũng là hết hiệu lực */
    function co(v) { return !!v && String(v) !== '0'; }
    H.hieuLuc = function (r) { return co(r.HIEULUC) ? ui.badge('Hiệu lực', 'ok') : ui.badge('Hết hiệu lực', 'mute'); };
    /* Gốc đọc NHẦM cột HIEULUC cho cột "Khóa dữ liệu" (mọi kế hoạch có hiệu lực đều hiện "Khóa dữ liệu")
       → đọc đúng KHOADULIEU (cột biểu mẫu Sửa đổ vào ô Khóa dữ liệu). */
    H.khoaDL = function (r) { return co(r.KHOADULIEU) ? ui.badge('Khóa dữ liệu', 'warn') : ''; };

    H.nut = function (text, a, id) {
        return ui.btn('view', { text: text, mod: 'out-primary', cls: 'ums-btn--sm', attr: { 'data-a': a, 'data-id': id } });
    };
    H.suaBtn = function (id) {
        return '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-a="sua" data-id="' + esc(id) +
            '" title="Sửa"><i class="fa-light fa-pen-to-square"></i></button>';
    };

    function boDau(x) {
        return String(x === null || x === undefined ? '' : x)
            .toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
    }
    H.loc = function (rows, q, cols) {
        q = boDau(q).trim();
        if (!q) return rows;
        return rows.filter(function (r) {
            return cols.some(function (c) { return boDau(r[c]).indexOf(q) >= 0; });
        });
    };

    H.datGiaTri = function (el, v) {
        if (!el) return;
        v = v === undefined || v === null ? '' : String(v);
        if (el.tagName === 'SELECT' && v && !Array.prototype.some.call(el.options, function (o) { return o.value === v; })) {
            // Ô Năm: gốc đổ NAM vào ô có giá trị ID — thử khớp theo chữ hiện
            var hit = Array.prototype.filter.call(el.options, function (o) { return o.textContent.trim() === v; })[0];
            if (hit) v = hit.value;
        }
        el.value = v;
        if (el.tagName === 'SELECT' && window.jQuery) jQuery(el).trigger('change.select2');
        if (el._flatpickr) { if (el.value) el._flatpickr.setDate(el.value, false, 'd/m/Y'); else el._flatpickr.clear(); }
    };

    /* ---------- Vùng "Danh sách" nhân sự ---------------------------------
       cfg = { khoa: tên tham số ID kế hoạch, lay: [action, func], them: [action, func], xoa: [action, func], onClose }
       Lời gọi (chép nguyên, action/func do màn truyền):
           lay  strNguoiThucHien_Id · <khoa> = ID kế hoạch
           them <khoa> · strNguoiDung_Id (mỗi người một lời gọi)
           xoa  strId = ID dòng
       Hộp chọn người dùng (edu.extend.genModal_NguoiDung + getList_NguoiDungP): ums.tlKh.pickNguoiDung —
       nạp CHÍNH tệp ApisDangKyHoc/Modules/thilai/script/_chung.js.
       Khác gốc: thêm / xoá chạy qua ums.ui.batch rồi nạp lại MỘT lần; nút Xóa là ui.xoaChon trên đầu khung. */
    H.taoNhanSu = function (zone, cfg) {
        var khId = '';
        zone.innerHTML = ums.pat.panel({
            title: 'Danh sách', icon: 'fa-user-tie', count: 'n', flush: true, zone: 't',
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                ui.xoaChon('input[data-khns]', { sm: true, goc: '.ums-panel', attr: { 'data-a': 'xoa' } }) +
                ui.btn('add', { text: 'Thêm', mod: 'out-success', attr: { 'data-a': 'them' } })
        });
        function z(x) { return zone.querySelector('[data-z="' + x + '"]'); }
        K.ganChon(zone);

        function tai() {
            var host = z('t');
            K.dang(host);
            var o = {}; o[cfg.khoa] = khId;
            H.goi(cfg.lay[0], cfg.lay[1], o).then(function (r) {
                var rows = K.ds(r);
                z('n').textContent = '(' + rows.length + ')';
                ui.table({
                    el: host, rows: rows, empty: 'Chưa có nhân sự',
                    columns: [
                        { title: 'Mã số', prop: 'NGUOIDUNG_TAIKHOAN', cls: 'is-nowrap' },
                        { title: 'Họ tên', prop: 'NGUOIDUNG_TENDAYDU' },
                        { title: 'Đơn vị', prop: 'DAOTAO_COCAUTOCHUC_TEN' },
                        K.cotChon('khns')
                    ]
                });
            }).catch(function (err) { K.loi(host, err, 'nhân sự'); });
        }
        function them() {
            ums.tlKh.pickNguoiDung(function (ids) {
                ui.batch(ids.map(function (id) {
                    var o = { action: cfg.them[0], func: cfg.them[1], strNguoiDung_Id: id, strNguoiThucHien_Id: '' };
                    o[cfg.khoa] = khId;
                    return o;
                }), { title: 'Đang thêm nhân sự', okText: 'Thực hiện thành công', show: true }).then(tai);
            });
        }
        function xoa() {
            var ids = K.daChon(z('t'), 'khns');
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
            K.xoa(ids.map(function (id) {
                return { action: cfg.xoa[0], func: cfg.xoa[1], strId: id, strNguoiThucHien_Id: '' };
            }), tai);
        }
        zone.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || !zone.contains(b) || b.disabled) return;
            switch (b.getAttribute('data-a')) {
                case 'dong': if (cfg.onClose) cfg.onClose(); break;
                case 'them': them(); break;
                case 'xoa': xoa(); break;
            }
        });
        return { mo: function (id) { khId = id; tai(); } };
    };
})();
