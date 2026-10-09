/* =========================================================================
   Kế hoạch khảo sát — kết quả khảo sát của một kế hoạch — ums.ks.ketQua (zoneKetQua)
   ---------------------------------------------------------------------------
   Bốn tab, mỗi tab một lời gọi GET có phân trang ở máy chủ (tham số chép
   nguyên: strTuKhoa '', strKS_LoaiDoiTuong_Id '', strKS_PhieuKhaoSat_Mau_Id ''
   — bản gốc đọc ô dropAAAA không có trên màn —, strKS_KeHoachKhaoSat_Id):
       Đối tượng tham gia khảo sát    KS_ThongTin/LayDSKS_DoiTuongThamGiaKhaoSat  MASO | HO TEN | DIACHI
       Đối tượng được khảo sát        KS_ThongTin/LayDSKS_DoiTuongDuocKhaoSat     KYHIEU | TEN | GHICHU
       Đối tượng thực hiện khảo sát   KS_ThongTin/LayDSKS_DoiTuongThamGiaChuaKS   …_MA | HO TEN | KS_PHIEUKHAOSAT_TEN
       Kết quả chi tiết               KS_ThongTin/LayDSKS_KetQuaKhaoSat → { rs, rsCauHoi }
           mỗi câu hỏi một cột; mỗi Ô một lời gọi KS_TaoPhieu/LayDSKetQuaTraLoiTheo
           (như bản gốc — chỉ cho các dòng của trang đang xem), strLoaiDapAn ''.
   Bỏ nút "Lưu" ở chân khung (bản gốc trùng id btnSave_KeHoach nên không có xử lý).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var ks = ums.ks = ums.ks || {};
    var C = 'KS_ThongTin/';
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }

    var TAB = [
        { key: 'tg', text: 'Đối tượng tham gia khảo sát', ds: 'LayDSKS_DoiTuongThamGiaKhaoSat',
          cols: [{ title: 'Mã số', prop: 'MASO' }, { title: 'Họ tên', render: function (r) { return esc(e(r.HO) + ' ' + e(r.TEN)); } }, { title: 'Mô tả', prop: 'DIACHI' }] },
        { key: 'dks', text: 'Đối tượng được khảo sát', ds: 'LayDSKS_DoiTuongDuocKhaoSat',
          cols: [{ title: 'Mã số', prop: 'KYHIEU' }, { title: 'Họ tên', prop: 'TEN' }, { title: 'Mô tả', prop: 'GHICHU' }] },
        { key: 'th', text: 'Đối tượng thực hiện khảo sát', ds: 'LayDSKS_DoiTuongThamGiaChuaKS',
          cols: [{ title: 'Mã số', prop: 'KS_DOITUONGTHAMGIAKHAOSAT_MA' },
                 { title: 'Họ tên', render: function (r) { return esc(e(r.KS_DOITUONGTHAMGIAKHAOSAT_HO) + ' ' + e(r.KS_DOITUONGTHAMGIAKHAOSAT_TEN)); } },
                 { title: 'Mô tả', prop: 'KS_PHIEUKHAOSAT_TEN' }] },
        { key: 'ct', text: 'Kết quả chi tiết', ds: 'LayDSKS_KetQuaKhaoSat' }
    ];

    ks.ketQua = function (ctx) {
        var kh = null, tab = 'tg', trang = {};
        var z = ctx.z('ketqua');
        z.innerHTML = pat.page('Quản lý kế hoạch', '') + pat.panel({
            title: 'Kết quả khảo sát', icon: 'fa-square-poll-vertical', count: 'kqTen', flush: true,
            tools: ui.btn('close', { attr: { 'data-kq': 'dong' } }),
            body: ui.tabs(TAB.map(function (t) { return { key: t.key, text: t.text }; }), tab, 'data-kqtab') +
                TAB.map(function (t) { return '<div data-kqpane="' + t.key + '"' + (t.key === tab ? '' : ' hidden') + '></div>'; }).join('')
        });
        function pane(k) { return z.querySelector('[data-kqpane="' + k + '"]'); }

        function tai(t, p) {
            var st = trang[t.key] || (trang[t.key] = { index: 1, size: 10 });
            if (p) st.index = p;
            var el = pane(t.key);
            el.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            ums.api.call({ action: C + t.ds, method: 'GET', strTuKhoa: '', strKS_LoaiDoiTuong_Id: '', strKS_PhieuKhaoSat_Mau_Id: '',
                strKS_KeHoachKhaoSat_Id: kh.ID, strNguoiThucHien_Id: uid(), pageIndex: st.index, pageSize: st.size }).then(function (r) {
                var total = Number(r.pager) || 0;
                var page = { index: st.index, size: st.size, total: total,
                    onChange: function (n) { if (n >= 1 && n <= Math.ceil(total / st.size)) tai(t, n); },
                    onSize: function (n) { st.size = n; tai(t, 1); } };
                if (t.key !== 'ct') {
                    var rows = arr(r.data);
                    page.total = total || rows.length;
                    ui.table({ el: el, rows: rows, empty: 'Không có dữ liệu', columns: t.cols, page: page });
                    return;
                }
                veChiTiet(el, r.data || {}, page);
            }).catch(function (err) { el.innerHTML = ui.fail(err.message); ums.api.handle(err, t.text); });
        }

        function veChiTiet(el, d, page) {
            var rs = arr(d.rs), cau = arr(d.rsCauHoi);
            if (!page.total) page.total = rs.length;
            var G1 = ['Thông tin đối tượng tham gia khảo sát'], G2 = ['Thông tin đối tượng được khảo sát'];
            ui.table({
                el: el, rows: rs, empty: 'Chưa có kết quả', page: page,
                columns: [
                    { title: 'Mã số', prop: 'KS_DOITUONGTHAMGIAKHAOSAT_MA', group: G1, cls: 'is-nowrap' },
                    { title: 'Họ tên', group: G1, render: function (r) { return esc(e(r.KS_DOITUONGTHAMGIAKHAOSAT_HO) + ' ' + e(r.KS_DOITUONGTHAMGIAKHAOSAT_TEN)); } },
                    { title: 'Ghi chú', prop: 'GHICHU', group: G1 },
                    { title: 'Phiếu khảo sát', prop: 'KS_PHIEUKHAOSAT_TEN' },
                    { title: 'Trạng thái khảo sát', prop: 'KETQUA', cls: 'is-center' },
                    { title: 'Mã số', prop: 'KS_DOITUONGDUOCKHAOSAT_MA', group: G2, cls: 'is-nowrap' },
                    { title: 'Họ tên', prop: 'KS_DOITUONGDUOCKHAOSAT_TEN', group: G2 }
                ].concat(cau.map(function (c) {
                    return { title: e(c.KS_CAUHOI_TEN), cls: 'is-center', render: function (r, i) {
                        return '<div data-kqo="' + i + '|' + esc(c.KS_CAUHOI_ID) + '"></div>';
                    } };
                }))
            });
            // Mỗi ô một lời gọi — như bản gốc
            rs.forEach(function (r, i) {
                cau.forEach(function (c) {
                    ums.api.call({ action: 'KS_TaoPhieu/LayDSKetQuaTraLoiTheo', method: 'GET', silent: true,
                        strKS_DoiTuongThamGiaKS_Id: r.KS_DOITUONGTHAMGIAKHAOSAT_ID, strKS_DoiTuongDuocKhaoSat_Id: r.KS_DOITUONGDUOCKHAOSAT_ID,
                        strKS_PhieuKhaoSat_Id: r.KS_PHIEUKHAOSAT_ID, strKS_KeHoachKhaoSat_Id: r.KS_KEHOACHKHAOSAT_ID, strKS_CauHoi_Id: c.KS_CAUHOI_ID, strLoaiDapAn: '' })
                        .then(function (x) {
                            var o = el.querySelector('[data-kqo="' + i + '|' + c.KS_CAUHOI_ID + '"]');
                            var v = arr(x.data)[0];
                            if (o && v) o.textContent = e(v.KETQUA);
                        }).catch(function () {});
                });
            });
        }

        z.addEventListener('click', function (ev) {
            var a = ev.target.closest('[data-kqtab]');
            if (a) {
                tab = a.getAttribute('data-kqtab');
                ui.tabsActive(z, tab, 'data-kqtab');
                TAB.forEach(function (t) { pane(t.key).hidden = t.key !== tab; });
                return;
            }
            if (ev.target.closest('[data-kq="dong"]')) ctx.show('ds');
        });

        return {
            mo: function (row) {
                kh = row; trang = {};
                z.querySelector('[data-z="kqTen"]').textContent = '— ' + e(row.TENKEHOACH);
                ctx.show('ketqua');
                TAB.forEach(function (t) { tai(t, 1); });     // bản gốc nạp cả bốn tab khi mở
            }
        };
    };
})();
