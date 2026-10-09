/* =========================================================================
   Thống kê tiến độ nhập điểm theo kế hoạch thi
   Bản gốc: ApisCongCanBo/Modules/thongke/html/nhapdiemlichthi.html + script/nhapdiemlichthi.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): 8 ô lọc hai hàng (Thời gian · Loại điểm · Hình thức
   thi · Đợt thi · Môn thi · Lọc hoàn thành · Từ khoá · Tìm kiếm + báo cáo) → bảng.
   Lời gọi (kiểu cũ, GET):
       TP_Chung/LayThoiGian · LayLoaiDiem · LayHinhThucThi · LayDotThi · LayHocPhan   các ô (nối tầng)
       Danh mục DIEM.TRANGTHAILOC (giá trị = MA)                                        ô "Chọn lọc"
       TP_Chung/LayDSLoaiDiemMonThiTheoDotThi                                           cột điểm thành phần (mỗi cột: SL · Tỷ lệ %)
       TP_Chung/LayDSThiTheoDotThi       danh sách (dLocKhongHoanThanhNhapDiem: rỗng → 0; KHÔNG gửi Thời gian / Loại điểm / Hình thức — như gốc)
       TP_Chung/LayTTTienDoNhapDiemTheoDST   MỖI Ô (dòng × cột) một lời gọi, như gốc; bỏ giá trị "x"
       TP_Chung/LayDSLopHocPhanTheoDST        bấm một dòng → các lớp học phần
   Mẫu báo cáo (chép nguyên): strThi_DotThi_Id, strDaoTao_HocPhan_Id, strDangKy_KeHoachDangKy_Id
   (ô gốc không tồn tại → rỗng), strHinhThucThi_Id, strDaoTao_ThoiGianDaoTao_Id,
   strDiem_ThanhPhanDiem_Id, strHoanThanhNhapDiem_Id.
   Không chép (lỗi rõ của bản gốc):
     · Mở màn gọi danh sách khi chưa có cột → lỗi JS, không có bảng. Ở đây nạp khi bấm Tìm kiếm.
     · Tiêu đề lệch (12 cột tĩnh thiếu rowspan).
     · Đổi Thời gian nạp Đợt thi / Môn thi với Loại điểm, Hình thức CŨ → ở đây nạp theo tầng.
   Làm theo ý định, CHƯA từng chạy ở bản gốc (thử trên host): bấm dòng mở danh sách lớp
   học phần — hộp #myModal và bảng #tblThanhPhan không có trong trang gốc. Tiêu đề cột
   do bản chuyển đặt (Mã / Tên lớp học phần, Tình trạng xác nhận nhập điểm).
   Nối tầng: Thời gian → Loại điểm → Hình thức thi → Đợt thi → Môn thi (ums.pat.chain).
   ---------------------------------------------------------------------------
   (+) 2026-09-25 — cờ cho bản anh em ApisQuanLyDiem/thongke/nhapdiemlichthi, MẶC ĐỊNH tắt:
   <div id="tk-nhapdiemlichthi" data-thongke="1"> thì
     · thêm cột ô đánh dấu (cuối bảng, ô "chọn tất cả" ở tiêu đề) và nút "Thống kê" ở đầu khung;
     · bấm "Thống kê" → phát sự kiện 'ndlt:thongke' trên phần tử gốc, detail = { ids, rows } (dòng đã đánh dấu);
       màn QLD tự vẽ phần thống kê (ApisQuanLyDiem/Modules/thongke/script/nhapdiemlichthi.js);
     · root.ndltTim() = chạy lại "Tìm kiếm" (màn QLD gọi khi đóng khung thống kê, như toggle_form gốc).
   Bấm vào ô đánh dấu KHÔNG mở danh sách lớp học phần của dòng.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('tk-nhapdiemlichthi');
    var coTK = root.getAttribute('data-thongke') === '1';
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function get(m, o) { return ums.api.call(Object.assign({ action: 'TP_Chung/' + m, method: 'GET', strNguoiThucHien_Id: uid() }, o)); }

    root.innerHTML =
        pat.page('Thống kê tiến độ nhập điểm theo kế hoạch thi', '<div data-z="bc"></div>') +
        pat.filterBar([
            { key: 'tg', label: 'Chọn thời gian', type: 'select' }, { key: 'ld', label: 'Chọn loại điểm', type: 'select' },
            { key: 'ht', label: 'Chọn hình thức thi', type: 'select' }, { key: 'dot', label: 'Chọn đợt thi', type: 'select' },
            { key: 'mon', label: 'Chọn môn thi', type: 'select' }, { key: 'loc', label: 'Chọn lọc', type: 'select' },
            { key: 'q', label: 'Nhập từ khóa tìm kiếm' }
        ]) +
        pat.panel({ title: 'Danh sách', icon: 'fa-list-check', count: 'n', flush: true, zone: 'bang',
            tools: coTK ? ui.btn('search', { text: 'Thống kê', mod: 'save', icon: 'fa-chart-column', attr: { 'data-a': 'thongke' } }) : '' });
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return f(k).value.trim(); }
    z('bang').innerHTML = ui.empty('Chọn điều kiện rồi bấm Tìm kiếm', 'fa-hand-pointer');

    /* ---------- Bộ lọc nối tầng ------------------------------------------- */
    var chuoi = pat.chain([f('tg'), f('ld'), f('ht'), f('dot'), f('mon')], { phatLai: false });
    var TANG = [
        ['tg', 'LayThoiGian', 'THOIGIAN', function () { return {}; }],
        ['ld', 'LayLoaiDiem', 'TEN', function () { return { strDaoTao_ThoiGianDaoTao_Id: v('tg') }; }],
        ['ht', 'LayHinhThucThi', 'TEN', function () { return { strDiem_ThanhPhanDiem_Id: v('ld'), strDaoTao_ThoiGianDaoTao_Id: v('tg') }; }],
        ['dot', 'LayDotThi', 'TEN', function () { return { strHinhThucThi_Id: v('ht'), strDiem_ThanhPhanDiem_Id: v('ld'), strDaoTao_ThoiGianDaoTao_Id: v('tg') }; }],
        ['mon', 'LayHocPhan', 'TEN', function () { return { strDotThi_Id: v('dot'), strHinhThucThi_Id: v('ht'), strDiem_ThanhPhanDiem_Id: v('ld'), strDaoTao_ThoiGianDaoTao_Id: v('tg') }; }]
    ];
    function nap(i) {
        var t = TANG[i];
        if (i && !v(TANG[i - 1][0])) { pat.fill(f(t[0]), []); chuoi.sync(); return Promise.resolve(); }
        return get(t[1], t[3]()).then(function (r) { pat.fill(f(t[0]), arr(r.data), { name: t[2] }); chuoi.sync(); })
            .catch(function (err) { ums.api.handle(err, t[1]); });
    }
    nap(0);
    function napTu(i) { var p = Promise.resolve(); for (var k = i; k < TANG.length; k++) (function (k) { p = p.then(function () { return nap(k); }); })(k); return p; }
    if (window.jQuery) TANG.forEach(function (t, i) { if (i < TANG.length - 1) jQuery(f(t[0])).on('select2:select select2:clear', function () { napTu(i + 1); }); });
    ums.api.dm('DIEM.TRANGTHAILOC').then(function (d) { pat.fill(f('loc'), d, { id: 'MA', name: 'TEN', head: 'Chọn lọc' }); }).catch(function () {});

    /* ---------- Danh sách ------------------------------------------------- */
    var ds = [], soHieu = 0;
    function tim() {
        var sh = ++soHieu;
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        get('LayDSLoaiDiemMonThiTheoDotThi', { strThi_DotThi_Id: v('dot'), strDaoTao_HocPhan_Id: v('mon') }).then(function (r) {
            var cot = arr(r.data);
            return get('LayDSThiTheoDotThi', { strTuKhoa: v('q'), dLocKhongHoanThanhNhapDiem: v('loc') || 0, strThi_DotThi_Id: v('dot'), strDaoTao_HocPhan_Id: v('mon') })
                .then(function (x) { if (sh === soHieu) ve(arr(x.data), cot, sh); });
        }).catch(function (err) { if (sh === soHieu) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'tiến độ nhập điểm'); } });
    }
    function ve(rows, cot, sh) {
        ds = rows;
        z('n').textContent = '(' + ds.length + ')';
        ui.table({ el: z('bang'), rows: ds, empty: 'Không có dữ liệu', columns: [
            { title: 'Ngày thi', prop: 'NGAYTHI', cls: 'is-center is-nowrap' },
            { title: 'Ca thi(Giờ thi)', cls: 'is-nowrap', render: function (x) { return esc(e(x.THI_CATHI_TEN) + '(' + e(x.GIOBATDAU) + 'h' + e(x.PHUTBATDAU) + '--> ' + e(x.GIOKETTHUC) + 'h' + e(x.PHUTKETTHUC) + ')'); } },
            { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' }, { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
            { title: 'Số TC', prop: 'DAOTAO_HOCPHAN_SOTIN', cls: 'is-center' }, { title: 'Hình thức thi', prop: 'HINHTHUCTHI_TEN' },
            { title: 'Số SV', prop: 'SOSV', cls: 'is-center' }, { title: 'Đợt thi', prop: 'DOTTHI_TEN' },
            { title: 'Công thức điểm', prop: 'DSCONGTHUCDIEM' }, { title: 'Khoa chuyên môn', prop: 'DONVIPHUTRACHHOCPHAN_TEN' },
            { title: 'Tỷ lệ % TKHP', prop: 'TYLEHOANTHANHTKHP', cls: 'is-center' }
        ].concat([].concat.apply([], cot.map(function (c) {
            var g = [e(c.TEN)];
            return [
                { title: 'SL', group: g, cls: 'is-center', render: function (x) { return '<span data-sl="' + esc(x.ID + '|' + c.ID) + '"></span>'; } },
                { title: 'Tỷ lệ %', group: g, cls: 'is-center', render: function (x) { return '<span data-tl="' + esc(x.ID + '|' + c.ID) + '"></span>'; } }
            ];
        }))).concat(coTK ? [{ head: '<input type="checkbox" data-ndlt-all title="Chọn tất cả">', cls: 'is-center',
            render: function (x, i) { return '<input type="checkbox" data-ndlt-ck="' + i + '">'; } }] : []) });
        Array.prototype.forEach.call(z('bang').querySelectorAll('tbody tr[data-id]'), function (tr) { tr.classList.add('ndlt-dong'); tr.title = 'Bấm để xem các lớp học phần'; });
        var viec = [];
        ds.forEach(function (x) { cot.forEach(function (c) { viec.push([x, c]); }); });
        var i = 0;
        function chay() {
            if (sh !== soHieu || i >= viec.length) return Promise.resolve();
            var p = viec[i++], x = p[0], c = p[1];
            return get('LayTTTienDoNhapDiemTheoDST', { silent: true, strNgayThi: e(x.NGAYTHI), strCaThi_Id: e(x.IDCATHI), strThi_DotThi_Id: e(x.IDDOTTHI), strDaoTao_HocPhan_Id: e(x.IDMONTHI),
                strCongThucDiem: e(x.CONGTHUC), strDiem_ThanhPhanDiem_Id: c.ID, strThi_DanhSachThi_Id: x.ID }).then(function (y) {
                arr(y.data).forEach(function (t) {
                    if (t.SOSV === 'x' || t.TYLE === 'x') return;
                    var a = z('bang').querySelector('[data-sl="' + x.ID + '|' + c.ID + '"]'), b = z('bang').querySelector('[data-tl="' + x.ID + '|' + c.ID + '"]');
                    if (a) a.textContent = e(t.SOSV); if (b) b.textContent = e(t.TYLE);
                });
            }).catch(function () {}).then(chay);
        }
        for (var k = 0; k < 6; k++) chay();
    }

    /* ---------- Bấm dòng: các lớp học phần -------------------------------- */
    function chiTiet(x) {
        var dlg = ui.dialog({ title: e(x.DAOTAO_HOCPHAN_TEN) || 'Danh sách lớp học phần', icon: 'fa-users-rectangle', size: 'lg', body: '<div data-k="b">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
        var h = dlg.body.querySelector('[data-k="b"]');
        get('LayDSLopHocPhanTheoDST', { strThi_DanhSachThi_Id: x.ID }).then(function (r) {
            ui.table({ el: h, rows: arr(r.data), empty: 'Không có lớp học phần', columns: [
                { title: 'Mã lớp học phần', prop: 'DAOTAO_LOPHOCPHAN_MA', cls: 'is-nowrap' }, { title: 'Tên lớp học phần', prop: 'DAOTAO_LOPHOCPHAN_TEN' },
                { title: 'Tình trạng xác nhận nhập điểm', prop: 'TINHTRANGXACNHANNHAPDIEM', cls: 'is-center' }] });
        }).catch(function (err) { h.innerHTML = ui.fail(err.message); });
    }

    ums.report.mount(z('bc'), { collect: function (add) {
        add('strThi_DotThi_Id', v('dot')); add('strDaoTao_HocPhan_Id', v('mon')); add('strDangKy_KeHoachDangKy_Id', ''); add('strHinhThucThi_Id', v('ht'));
        add('strDaoTao_ThoiGianDaoTao_Id', v('tg')); add('strDiem_ThanhPhanDiem_Id', v('ld')); add('strHoanThanhNhapDiem_Id', v('loc'));
    } });
    root.addEventListener('click', function (ev) {
        if (ev.target.closest('[data-a="search"]')) { tim(); return; }
        if (coTK && ev.target.closest('[data-a="thongke"]')) {
            var chon = ds.filter(function (r, i) { var c = root.querySelector('[data-ndlt-ck="' + i + '"]'); return c && c.checked; });
            if (!chon.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
            root.dispatchEvent(new CustomEvent('ndlt:thongke', { detail: { ids: chon.map(function (r) { return r.ID; }), rows: chon } }));
            return;
        }
        if (ev.target.closest('input')) return;          // ô đánh dấu (bản QLD) — không mở danh sách lớp
        var tr = ev.target.closest('tr.ndlt-dong');
        if (tr) { var x = ds.filter(function (r) { return String(r.ID) === tr.getAttribute('data-id'); })[0]; if (x) chiTiet(x); }
    });
    if (coTK) {
        root.addEventListener('change', function (ev) {
            if (!ev.target.matches('[data-ndlt-all]')) return;
            Array.prototype.forEach.call(root.querySelectorAll('[data-ndlt-ck]'), function (c) { c.checked = ev.target.checked; });
        });
        root.ndltTim = tim;
    }
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim(); } });
})();
