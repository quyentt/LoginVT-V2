/* =========================================================================
   Thi phách — Báo cáo thi (baocaothi): lọc danh sách thi theo đợt thi, đánh dấu rồi chạy mẫu báo cáo. CHỈ XEM.
   Bản gốc: ApisThiPhach/Modules/kehoach/html/baocaothi.html + script/baocaothi.js (không có trên menu host)
   Bố cục gốc: MỘT cột — khung lọc 9 ô + Tìm kiếm + nút báo cáo, bảng "Danh sách" có cột ô đánh dấu.
   Màn anh em: ApisCongCanBo/Modules/thi/script/baocao.js (khác lời gọi: bản đó liệt kê ĐỢT THI qua XLHV_TP_Chung_MH,
   bản này liệt kê DANH SÁCH THI qua TP_Chung kiểu cũ) → không nạp chéo được, viết riêng theo cùng khuôn.
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên):
       XLHV_TP_Chung_MH/DSA4FSkuKAYoIC8VIDUCIAPP  func pkg_thi_phach_chung.LayThoiGianTatCa  POST   ô Thời gian (ID, THOIGIAN)
       ums.ref.coCauToChuc({ strCCTC_Loai_Id: '', strCCTC_Cha_Id: '', iTrangThai: 1 })              ô Bộ môn (TEN)
       TP_Chung/LayLoaiDiem      GET  strDaoTao_ThoiGianDaoTao_Id
       TP_Chung/LayHinhThucThi   GET  strDiem_ThanhPhanDiem_Id, strDaoTao_ThoiGianDaoTao_Id
       TP_Chung/LayDotThi        GET  strHinhThucThi_Id, strDiem_ThanhPhanDiem_Id, strDaoTao_ThoiGianDaoTao_Id
       TP_Chung/LayHocPhan       GET  strDotThi_Id, strHinhThucThi_Id, strDiem_ThanhPhanDiem_Id, strDaoTao_ThoiGianDaoTao_Id
                                      (tên hiện "TEN - MA")
       TP_Chung/LayDSThiTheoDotThi  GET  strTuKhoa, strThi_DotThi_Id, strDaoTao_HocPhan_Id, strTuNgay, strDenNgay
           Cột: MADANHSACHTHI, DAOTAO_HOCPHAN_TEN + '_' + DAOTAO_HOCPHAN_MA, NGAYTHI, THI_CATHI_TEN, TKB_PHONGTHI_TEN, SOSVTHEODST, ID
       Mọi lời gọi kèm strNguoiThucHien_Id. Các lời gọi TP_Chung không func, không iM (không mã hoá) như gốc.
       Báo cáo ums.report.mount — đúng thứ tự gốc: strThi_DotThi_Id, strDaoTao_HocPhan_Id, rồi MỖI dòng đánh dấu một
           strDanhSachThi_Id. Không nút Import (html gốc không có vùng _Import).
   Cha → con (KHOÁ theo luật chung): Thời gian → Loại điểm → Hình thức → Đợt thi → Học phần.
       Ô Bộ môn đứng riêng, không cha không con.
   Lỗi bản gốc — làm theo ý định:
     · Danh sách học phần (LayHocPhan) đổ vào ô "dropSearch_MonThi" KHÔNG có trên màn; ô có thật là dropSearch_HocPhan nên
       ô Học phần của gốc luôn rỗng (strDaoTao_HocPhan_Id luôn gửi ''). Bản mới đổ vào ô Học phần → lọc được theo học phần.
     · Gốc chỉ bắt select2:select: xoá ô cha thì ô con giữ giá trị cũ → nay xoá trắng + khoá.
   Giữ như gốc:
     · Ô Bộ môn KHÔNG gửi vào lời gọi nào (danh sách, báo cáo đều không đọc) — giữ ô, ghi chú ở báo cáo chuyển đổi.
     · Mở màn không tự tải; không bắt chọn đợt thi trước khi Tìm kiếm.
     · Không phân trang: gốc khai bPaginate nhưng KHÔNG gửi pageIndex / pageSize → máy chủ trả hết; số ở tiêu đề = Pager.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('tp-baocaothi');
    if (!root) return;
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }

    function sel(k, ph) { return '<div class="ums-field"><select class="ums-select" data-f="' + k + '" data-ph="' + ui.esc(ph) + '"><option value="">' + ui.esc(ph) + '</option></select></div>'; }
    function inp(k, ph, date) { return '<div class="ums-field"><input class="ums-input" data-f="' + k + '"' + (date ? ' data-date' : '') + ' placeholder="' + ui.esc(ph) + '" autocomplete="off"></div>'; }

    root.innerHTML = pat.page('Báo cáo thi', '<span data-z="bc"></span>') +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body: '<div class="ums-filter tptk-luoi4">' +
            sel('tg', 'Chọn thời gian') + sel('bm', 'Chọn bộ môn') + sel('ld', 'Chọn loại điểm') + sel('ht', 'Chọn hình thức thi') +
            sel('dot', 'Chọn đợt thi') + sel('hp', 'Chọn môn thi') + inp('q', 'Nhập từ khóa tìm kiếm') + inp('tu', 'Từ ngày', true) + inp('den', 'Đến ngày', true) +
            '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div></div>' }) +
        pat.panel({ title: 'Danh sách', icon: 'fa-list-timeline', count: 'n', flush: true, zone: 'bang',
            body: ui.empty('Chọn điều kiện lọc rồi bấm Tìm kiếm', 'fa-magnifying-glass') });
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return pat.val(f(k)); }

    /* ---------- Bộ lọc nối tầng ------------------------------------------ */
    var TANG = [
        ['ld', 'LayLoaiDiem', 'TEN', function () { return { strDaoTao_ThoiGianDaoTao_Id: v('tg') }; }, 'Chọn loại điểm'],
        ['ht', 'LayHinhThucThi', 'TEN', function () { return { strDiem_ThanhPhanDiem_Id: v('ld'), strDaoTao_ThoiGianDaoTao_Id: v('tg') }; }, 'Chọn hình thức thi'],
        ['dot', 'LayDotThi', 'TEN', function () { return { strHinhThucThi_Id: v('ht'), strDiem_ThanhPhanDiem_Id: v('ld'), strDaoTao_ThoiGianDaoTao_Id: v('tg') }; }, 'Chọn đợt thi'],
        ['hp', 'LayHocPhan', function (x) { return e(x.TEN) + ' - ' + e(x.MA); },
            function () { return { strDotThi_Id: v('dot'), strHinhThucThi_Id: v('ht'), strDiem_ThanhPhanDiem_Id: v('ld'), strDaoTao_ThoiGianDaoTao_Id: v('tg') }; }, 'Chọn môn thi']
    ];
    var KHOA = ['tg', 'ld', 'ht', 'dot', 'hp'];
    var chuoi = pat.chain(KHOA.map(f), { phatLai: false });
    function nap(i) {
        var t = TANG[i], cha = KHOA[i];            // cha của tầng i là KHOA[i] (KHOA lệch TANG một bậc vì có 'tg' đứng đầu)
        if (!v(cha)) { pat.fill(f(t[0]), [], { head: t[4] }); chuoi.sync(); return Promise.resolve(); }
        return ums.api.call(Object.assign({ action: 'TP_Chung/' + t[1], method: 'GET' }, t[3](), { strNguoiThucHien_Id: uid(), silent: true }))
            .then(function (r) { pat.fill(f(t[0]), arr(r.data), { name: t[2], head: t[4] }); chuoi.sync(); })
            .catch(function (err) { ums.api.handle(err, t[4]); });
    }
    function napTu(i) { var p = Promise.resolve(); for (var k = i; k < TANG.length; k++) (function (k) { p = p.then(function () { return nap(k); }); })(k); return p; }
    if (window.jQuery) KHOA.slice(0, 4).forEach(function (k, i) {
        jQuery(f(k)).on('select2:select select2:clear', function () { napTu(i); });
    });

    ums.api.call({ action: 'XLHV_TP_Chung_MH/DSA4FSkuKAYoIC8VIDUCIAPP', func: 'pkg_thi_phach_chung.LayThoiGianTatCa', strNguoiThucHien_Id: uid(), silent: true })
        .then(function (r) { pat.fill(f('tg'), arr(r.data), { name: 'THOIGIAN', head: 'Chọn thời gian' }); chuoi.sync(); })
        .catch(function (err) { ums.api.handle(err, 'thời gian'); });
    ums.ref.coCauToChuc({ strCCTC_Loai_Id: '', strCCTC_Cha_Id: '', iTrangThai: 1 })
        .then(function (d) { pat.fill(f('bm'), d, { name: 'TEN', head: 'Chọn bộ môn' }); })
        .catch(function (err) { ums.api.handle(err, 'bộ môn'); });

    /* ---------- Danh sách thi -------------------------------------------- */
    var ds = [], lan = 0;
    function tai() {
        var toi = ++lan;
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({
            action: 'TP_Chung/LayDSThiTheoDotThi', method: 'GET',
            strTuKhoa: f('q').value.trim(),
            strThi_DotThi_Id: v('dot'),
            strDaoTao_HocPhan_Id: v('hp'),
            strTuNgay: f('tu').value.trim(),
            strDenNgay: f('den').value.trim(),
            strNguoiThucHien_Id: uid()
        }).then(function (r) {
            if (toi !== lan) return;
            ds = arr(r.data);
            z('n').textContent = '(' + ui.so(r.pager || ds.length) + ')';
            ui.table({ el: z('bang'), rows: ds, empty: 'Không có danh sách thi', columns: [
                { title: 'Mã danh sách thi', prop: 'MADANHSACHTHI', cls: 'is-nowrap' },
                { title: 'Học phần', render: function (x) { return ui.esc(e(x.DAOTAO_HOCPHAN_TEN) + '_' + e(x.DAOTAO_HOCPHAN_MA)); } },
                { title: 'Ngày thi', prop: 'NGAYTHI', cls: 'is-center is-nowrap' },
                { title: 'Ca thi', prop: 'THI_CATHI_TEN', cls: 'is-center' },
                { title: 'Phòng thi', prop: 'TKB_PHONGTHI_TEN', cls: 'is-center' },
                { title: 'Số SV', cls: 'is-center', render: function (x) { return ui.esc(ui.so(x.SOSVTHEODST)); } },
                { head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                    render: function (x, i) { return '<input type="checkbox" data-ck="' + i + '">'; } }
            ] });
            var t = z('bang').querySelector('table'); if (t) t.id = 'tblDanhSachThi';
        }).catch(function (err) {
            if (toi !== lan) return;
            ds = []; z('n').textContent = '';
            z('bang').innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'danh sách thi');
        });
    }
    function daChon() {
        return Array.prototype.filter.call(z('bang').querySelectorAll('tbody input[data-ck]:checked'), function (c) { return c.getAttribute('data-ck') !== 'all'; })
            .map(function (c) { return ds[Number(c.getAttribute('data-ck'))]; }).filter(Boolean);
    }

    ums.report.mount(z('bc'), { import: false,
        tables: function () { var t = document.getElementById('tblDanhSachThi'); return t ? [t] : []; },
        collect: function (add) {
            add('strThi_DotThi_Id', v('dot'));
            add('strDaoTao_HocPhan_Id', v('hp'));
            daChon().forEach(function (x) { add('strDanhSachThi_Id', x.ID); });
        } });

    root.addEventListener('change', function (ev) {
        if (ev.target.getAttribute && ev.target.getAttribute('data-ck') === 'all') {
            Array.prototype.forEach.call(z('bang').querySelectorAll('tbody input[data-ck]'), function (c) { c.checked = ev.target.checked; });
        }
    });
    root.addEventListener('click', function (ev) {
        if (ev.target.closest('[data-a="search"]')) tai();
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(); } });
})();
