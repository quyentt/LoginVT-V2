/* =========================================================================
   _hp — khung dùng chung của hai màn Kế hoạch đăng ký › Áp phí học phần và
   Rút học phần (ums.dkhHp). Hai bản gốc chép nhau gần như từng dòng
   (git diff --no-index -w apphihocphan.js ruthocphan.js): chỉ khác tên
   controller, vài cột thêm và khoá dòng (DAOTAO_HOCPHAN_ID ↔ ID).
   ---------------------------------------------------------------------------
   Bố cục bản gốc — MỘT cột, ba khối xếp dọc:
     1. Tìm kiếm: Đợt đăng ký · Hệ đào tạo · "Thông tin người học" · Tìm kiếm
        (+ "Import ▾" ở màn Rút)
     2. Khung "Học phần áp phí / đã rút (n)": bảng, ô "% Mức phí" sửa ngay trong
        bảng, ô đánh dấu cuối dòng; nút Xóa / Khôi phục + Áp phí / Lưu
     3. Khung "Kết quả đã đăng ký": bảng, ô đánh dấu; nút "Thực hiện áp phí /
        rút" → hộp (Học phần · Phần trăm phải đóng · Ghi chú) → "Xác nhận"

   ums.dkhHp.man(root, {
       tieuDe, ctl: 'DKH_RutHocPhan/',
       goi: { dot, ds, dk, luu, huy, thucHien }      tên method sau ctl (chép nguyên)
       keHoach: true          gửi strDangKy_KeHoachDangKy_Id khi Huỷ / Thực hiện (bản Rút)
       khoaDong(r)            khoá dòng của bản gốc (chỉ dùng để hiện, không gửi)
       khung1: { title, icon, cot: [...] , nutHuy: { text, kieu: 'xoa'|'khoiphuc' }, nutLuu }
       khung2: { title, icon, cot: [...], nut, nutIcon }
       hop: 'Rút học phần', xong: { luu, huy, thucHien }  chữ báo thành công
       import: [{ ma, ten, chu }]     mục của nút Import (btnImportWithProce)
   })
   Cột dựng sẵn: ums.dkhHp.cotSV() (7 cột người học), cotHP(chữ), cotPT() (ô %), cotTien(chữ).

   Khác gốc (cách làm, không đổi bố cục):
     · Dòng được khoá theo CHỈ SỐ dòng; tham số gửi đi vẫn đọc cột như gốc. Bản Áp phí
       khoá theo DAOTAO_HOCPHAN_ID nên hai SV cùng một học phần trùng id — Lưu/Xóa/Thực
       hiện chỉ trúng dòng ĐẦU (lỗi gốc, bản Rút đã sửa bằng ID). Không chép lỗi đó.
     · Thực hiện xong nạp lại CẢ HAI bảng (gốc chỉ nạp khung 1 → bảng "Kết quả đã đăng
       ký" còn dòng đã rút, bấm lại là gửi trùng).
     · Thanh cuộn ngang giả ở trên bảng (scroll-x-top của html Rút) → bỏ: bảng đã kéo
       chuột để vuốt ngang (ums.ui.table).
     · Tiến độ hàng loạt: ums.ui.batch thay genHTML_Progress / start_Progress.
   ========================================================================= */
(function (global) {
    'use strict';
    var ums = global.ums, ui = ums.ui, pat = ums.pat;
    var H = ums.dkhHp = {};

    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(e(s)); }
    function arr(d) { return Array.isArray(d) ? d : []; }
    H.e = e;

    /* ---------- Cột dựng sẵn -------------------------------------------- */
    H.cotSV = function () {
        return [
            { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
            { title: 'Họ tên', cls: 'is-nowrap', render: function (r) { return esc(e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN)); } },
            { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN', cls: 'is-nowrap' },
            { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
            { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN', cls: 'is-nowrap' },
            { title: 'Trạng thái', prop: 'QLSV_TRANGTHAINGUOIHOC_TEN', cls: 'is-nowrap' },
            { title: 'Thời gian', prop: 'THOIGIAN', cls: 'is-nowrap' }
        ];
    };
    H.cotHP = function (chu) {
        return { title: chu, render: function (r) { return esc(e(r.DAOTAO_HOCPHAN_TEN) + ' - ' + e(r.DAOTAO_HOCPHAN_MA)); } };
    };
    /* Ô "% Mức phí" — giá trị cũ giữ ở data-cu (gốc: thuộc tính name) để Lưu chỉ gửi ô đã đổi */
    H.cotPT = function () {
        return { title: '% Mức phí', cls: 'is-center', width: '110px', render: function (r, i) {
            return '<input class="ums-input ums-input--sm" data-pt="' + i + '" value="' + esc(r.PHANTRAMPHITINH) + '" data-cu="' + esc(r.PHANTRAMPHITINH) + '" autocomplete="off">';
        } };
    };
    H.cotTien = function (chu) {
        return { title: chu, cls: 'is-right is-nowrap', render: function (r) { return esc(e(r.SOTIENPHAINOP) === '' ? '' : ui.money(r.SOTIENPHAINOP)); } };
    };
    function cotChon(k) {
        return { head: '<input type="checkbox" data-hpall="' + k + '" title="Chọn tất cả">', cls: 'is-center is-actions', width: '50px',
            render: function (r, i) { return '<input type="checkbox" data-hp' + k + '="' + i + '">'; } };
    }

    /* Nút thả xuống tự dựng (Import ▾ của html gốc) — cùng khung .ums-drop với ums.report */
    function drop(text, icon, items) {
        return '<div class="ums-drop"><button type="button" class="ums-btn ums-btn--out-info ums-drop__toggle" aria-haspopup="menu" aria-expanded="false">' +
            '<i class="fa-light ' + icon + '"></i><span>' + esc(text) + '</span><i class="fa-light fa-angle-down ums-drop__caret"></i></button>' +
            '<div class="ums-drop__menu" role="menu" hidden>' + items.map(function (x, i) {
                return '<button type="button" class="ums-drop__item" role="menuitem" data-imp="' + i + '"><span class="ums-drop__text">' + esc(x.chu) + '</span></button>';
            }).join('') + '</div></div>';
    }
    H.drop = drop;
    /* Bật / tắt thả xuống (đóng khi bấm ra ngoài do report.js lo cho mọi .ums-drop) */
    H.batDrop = function (tog) {
        var d = tog.closest('.ums-drop'), m = d.querySelector('.ums-drop__menu');
        var on = !d.classList.contains('is-open');
        d.classList.toggle('is-open', on);
        m.hidden = !on;
        tog.setAttribute('aria-expanded', on ? 'true' : 'false');
    };
    H.dongDrop = function (el) {
        var d = el.closest('.ums-drop');
        if (!d) return;
        d.classList.remove('is-open');
        d.querySelector('.ums-drop__menu').hidden = true;
    };

    /* =====================================================================
       Màn
       ===================================================================== */
    H.man = function (root, c) {
        var k1 = c.khung1, k2 = c.khung2;
        function A(m) { return c.ctl + c.goi[m]; }

        var nutHuy = k1.nutHuy.kieu === 'xoa'
            ? ui.xoaChon('input[data-hp1]', { goc: '.ums-panel', text: k1.nutHuy.text, attr: { 'data-a': 'huy' } })
            : ui.btn('reload', { text: k1.nutHuy.text, mod: 'out-primary', icon: 'fa-arrow-rotate-left', attr: { 'data-a': 'huy' } });

        root.innerHTML = pat.page(c.tieuDe, '') +
            pat.panel({ title: false, cls: 'ums-u-mb-4', body:
                '<div class="ums-filter">' +
                    '<div class="ums-field"><select class="ums-select" data-f="dot" data-ph="Chọn đợt đăng ký"><option value="">Chọn đợt đăng ký</option></select></div>' +
                    '<div class="ums-field"><select class="ums-select" data-f="he" data-ph="Chọn đào tạo"><option value="">Chọn đào tạo</option></select></div>' +
                    '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Thông tin người học" autocomplete="off"></div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
                    (c.import ? '<div class="ums-field ums-field--fit">' + drop('Import', 'fa-cloud-arrow-up', c.import) + '</div>' : '') +
                '</div>' }) +
            pat.panel({ title: k1.title, icon: k1.icon, count: 'n1', flush: true, zone: 'b1',
                tools: nutHuy + ui.btn('save', { text: k1.nutLuu, attr: { 'data-a': 'luu' } }),
                body: ui.empty('Chọn đợt đăng ký, hệ đào tạo rồi bấm Tìm kiếm') }) +
            pat.panel({ title: k2.title, icon: k2.icon, flush: true, zone: 'b2',
                tools: ui.btn('confirm', { text: k2.nut, mod: 'primary', icon: k2.nutIcon || 'fa-money-simple-from-bracket', attr: { 'data-a': 'thuchien' } }),
                body: ui.empty('Chọn đợt đăng ký, hệ đào tạo rồi bấm Tìm kiếm') });
        ui.enhance(root);
        function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

        var ds1 = [], ds2 = [];

        /* ---------- Danh mục (getList_DotDangKy / getList_HeDaoTao) ---------- */
        ums.api.call({ action: A('dot'), type: 'GET', method: 'GET', strNguoiThucHien_Id: '' })
            .then(function (r) { pat.fill(f('dot'), arr(r.data), { name: 'THOIGIAN', head: 'Chọn đợt đăng ký' }); })
            .catch(function (err) { ums.api.handle(err, 'đợt đăng ký'); });
        ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
            .then(function (rows) { pat.fill(f('he'), rows, { name: 'TENHEDAOTAO', head: 'Chọn đào tạo' }); })
            .catch(function (err) { ums.api.handle(err, 'hệ đào tạo'); });

        function loc() {
            return {
                strTuKhoa: (f('q').value || '').trim(),
                strDaoTao_ThoiGianDaoTao_Id: f('dot').value,
                strDaoTao_HeDaoTao_Id: f('he').value,
                strNguoiThucHien_Id: ''
            };
        }
        function dangTai(el) { el.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin'); }

        /* ---------- Khung 1 (getList_ApPhiHocPhan / getList_RutHocPhan) ------ */
        function tai1() {
            dangTai(z('b1'));
            return ums.api.call(Object.assign({ action: A('ds'), type: 'GET', method: 'GET' }, loc())).then(function (r) {
                ds1 = arr(r.data);
                z('n1').textContent = '(' + e(r.pager === undefined || r.pager === null ? ds1.length : r.pager) + ')';
                ui.table({ el: z('b1'), rows: ds1, columns: k1.cot.concat([cotChon(1)]), empty: 'Không có dữ liệu' });
            }).catch(function (err) { z('b1').innerHTML = ui.fail(err.message); ums.api.handle(err, k1.title); });
        }
        /* ---------- Khung 2 (getList_HocPhan) --------------------------------- */
        function tai2() {
            dangTai(z('b2'));
            return ums.api.call(Object.assign({ action: A('dk'), type: 'GET', method: 'GET' }, loc())).then(function (r) {
                ds2 = arr(r.data);
                ui.table({ el: z('b2'), rows: ds2, columns: k2.cot.concat([cotChon(2)]), empty: 'Không có dữ liệu' });
            }).catch(function (err) { z('b2').innerHTML = ui.fail(err.message); ums.api.handle(err, k2.title); });
        }
        function tim() { tai1(); tai2(); }

        function chon(k) {
            var ds = k === 1 ? ds1 : ds2;
            return Array.prototype.map.call(z('b' + k).querySelectorAll('input[data-hp' + k + ']:checked'), function (x) {
                return ds[Number(x.getAttribute('data-hp' + k))];
            }).filter(Boolean);
        }
        function thamSo(r) {
            var o = {};
            if (c.keHoach) o.strDangKy_KeHoachDangKy_Id = r.DANGKY_KEHOACHDANGKY_ID;
            o.strDaoTao_HocPhan_Id = r.DAOTAO_HOCPHAN_ID;
            o.strQLSV_NguoiHoc_Id = r.QLSV_NGUOIHOC_ID;
            o.strDaoTao_ThoiGianDaoTao_Id = r.DAOTAO_THOIGIANDAOTAO_ID;
            return o;
        }

        /* ---------- Lưu % mức phí (btnSave_*) --------------------------------- */
        function luu() {
            var calls = [];
            Array.prototype.forEach.call(z('b1').querySelectorAll('input[data-pt]'), function (i) {
                if (i.value === i.getAttribute('data-cu')) return;
                var r = ds1[Number(i.getAttribute('data-pt'))];
                if (!r) return;
                calls.push({ action: A('luu'), type: 'POST', strDaoTao_HocPhan_Id: r.DAOTAO_HOCPHAN_ID, strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID,
                    strDaoTao_ThoiGianDaoTao_Id: r.DAOTAO_THOIGIANDAOTAO_ID, dPhanTramTinhPhi: i.value,
                    strMoTa: '',                     // gốc đọc 'txtAAAA' — ô không tồn tại
                    strNguoiThucHien_Id: '' });
            });
            if (!calls.length) { ui.toast('Không có thay đổi để lưu', 'info'); return; }
            ui.batch(calls, { title: 'Đang lưu', okText: c.xong.luu }).then(tai1);
        }

        /* ---------- Xóa / Khôi phục (btnDelete_*) ----------------------------- */
        function huy() {
            var rows = chon(1);
            if (!rows.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: k1.nutHuy.text }).then(function (ok) {
                if (!ok) return;
                ui.batch(rows.map(function (r) {
                    return Object.assign({ action: A('huy'), type: 'POST' }, thamSo(r), { strNguoiThucHien_Id: '' });
                }), { title: 'Đang xử lý', okText: c.xong.huy }).then(tim);
            });
        }

        /* ---------- Thực hiện (.btnAdd → #myModal → btnSave_XacNhan) ---------- */
        function thucHien() {
            var rows = chon(2);
            if (!rows.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
            var dlg = ui.dialog({ title: c.hop, icon: k2.nutIcon || 'fa-money-simple-from-bracket', size: 'lg', body: '<div data-x="bang"></div>',
                buttons: [{ text: 'Xác nhận', kind: 'confirm', onClick: function (d) {
                    var calls = rows.map(function (r, i) {
                        return Object.assign({ action: A('thucHien'), type: 'POST' }, thamSo(r), {
                            dPhanTramTinhPhi: d.body.querySelector('[data-xpt="' + i + '"]').value,
                            strMoTa: d.body.querySelector('[data-xmt="' + i + '"]').value,
                            strNguoiThucHien_Id: ''
                        });
                    });
                    ui.batch(calls, { title: 'Đang thực hiện', okText: c.xong.thucHien }).then(tim);
                } }] });
            ui.table({ el: dlg.body.querySelector('[data-x="bang"]'), rows: rows, columns: [
                H.cotHP('Học phần'),
                { title: 'Phần trăm phải đóng', width: '170px', render: function (r, i) { return '<input class="ums-input ums-input--sm" data-xpt="' + i + '" autocomplete="off">'; } },
                { title: 'Ghi chú', render: function (r, i) { return '<input class="ums-input ums-input--sm" data-xmt="' + i + '" autocomplete="off">'; } }
            ] });
        }

        /* ---------- Sự kiện --------------------------------------------------- */
        root.addEventListener('click', function (ev) {
            var t = ev.target, b;
            if ((b = t.closest('.ums-drop__toggle'))) { H.batDrop(b); return; }
            if ((b = t.closest('[data-imp]'))) {
                H.dongDrop(b);
                var x = c.import[Number(b.getAttribute('data-imp'))];
                ums.report.importChung(x.ten, x.ma, { onDone: tim });   // Corei showImportChungV2(title, name)
                return;
            }
            if (!(b = t.closest('[data-a]'))) return;
            var a = b.getAttribute('data-a');
            if (a === 'search') tim();
            else if (a === 'luu') luu();
            else if (a === 'huy') huy();
            else if (a === 'thuchien') thucHien();
        });
        root.addEventListener('change', function (ev) {
            var k = ev.target.getAttribute('data-hpall');
            if (!k) return;
            Array.prototype.forEach.call(z('b' + k).querySelectorAll('input[data-hp' + k + ']'), function (x) { x.checked = ev.target.checked; });
        });
        f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim(); } });

        return { tim: tim };
    };
})(window);
