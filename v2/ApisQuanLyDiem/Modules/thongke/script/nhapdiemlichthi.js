/* =========================================================================
   Tiến độ nhập điểm theo lịch thi (Quản lý điểm) — phần "Thống kê kết quả"
   Bản gốc: ApisQuanLyDiem/Modules/thongke/html/nhapdiemlichthi.html + script/nhapdiemlichthi.js
   ---------------------------------------------------------------------------
   Bản gốc QLD = bản Cổng cán bộ (ApisCongCanBo/.../nhapdiemlichthi.js, đã chuyển) cộng thêm:
     · cột ô đánh dấu cuối bảng + nút "Thống kê" (btn-success) ở đầu khung Danh sách;
     · khung "Thống kê kết quả" (#zoneEdit) thay chỗ danh sách, 4 tab bảng đếm.
   Phần giống nhau dùng CHÍNH tệp Cổng cán bộ với cờ data-thongke="1" (xem đầu tệp đó); tệp này chỉ vẽ phần thống kê.
   Lời gọi:
       D_ThongKe_MH/FSkuLyYJLiIVIDEVKSQuBRIV  func pkg_diem_thongke.ThongHocTapTheoDST  POST
           strThi_DanhSachThi_1_Id … _10_Id  (id các dòng đã đánh dấu, mỗi tham số 100 id, nối bằng dấu phẩy)
       Trả: rsThongTinHocPhan (dòng: DAOTAO_KHOAQUANLY_ID/_TEN, DAOTAO_HOCPHAN_ID/_TEN/_MA)
            rsDanhMucDiemChu + rsDuLieuDiemChu (DIEMQUYDOI_ID)      → tab 1 "Thống kê điểm chữ"
            rsDanhMucDanhGia + rsDuLieuDanhGia (DANHGIA_ID)         → tab 2 "Thống kê đánh giá"
            rsDanhMucDiemHe10 + rsDuLieuDiemHe10 (DIEM)             → tab 3 thang 10
            rsDanhMucDiemHe4 + rsDuLieuDiemHe4 (DIEMQUYDOI)         → tab 4 thang 4
       Mỗi bảng: Stt · Khoa quản lý (gộp ô liền nhau như actionRowSpan cột 1) · Học phần ("TEN MA") · một cột mỗi
       mục danh mục (đếm số bản ghi) · Sum; dòng tổng dưới bảng cộng các cột mục (không cộng cột Sum — như gốc).
   Lỗi gốc đã sửa:
     · Chia lô id bằng slice(0,100), slice(101,200)… → bỏ sót id thứ 101, 201, …; nay slice(0,100), (100,200)…
       Quá 1000 dòng bản gốc lặng lẽ bỏ phần dư — nay vẫn chỉ gửi 1000 đầu nhưng báo cho người dùng biết.
     · Ô số liệu đặt id theo aData.ID nhưng đổ theo DAOTAO_HOCPHAN_ID → dòng có ID ≠ mã học phần hiện trống;
       nay tính thẳng cho từng dòng.
     · Mẫu báo cáo đọc strDaoTao_HocPhan_Id từ #dropSearch_HocPhan (ô không có trên màn) → dùng ô Môn thi như
       bản Cổng cán bộ.
   Giữ như gốc (nghi ngờ, ghi sổ): tab điểm chữ chỉ lọc theo học phần (ba tab kia lọc thêm khoa quản lý).
   Đóng khung thống kê: quay về danh sách và chạy lại "Tìm kiếm" (gốc: toggle_form → getList_ThongKe).
   Bỏ: số đếm trên nhãn tab (#tblTinChi_Tong/#tblNienChe_Tong — bản gốc không bao giờ điền), nút Đóng thứ hai ở chân.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui;
    var ds = document.getElementById('tk-nhapdiemlichthi');
    var tk = document.getElementById('qld-ndlt-tk');
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }

    var TAB = [
        { key: 'chu', text: '1) Thống kê điểm chữ A,B,C,..', dm: 'rsDanhMucDiemChu', du: 'rsDuLieuDiemChu',
          khop: function (x, r, c) { return x.DAOTAO_HOCPHAN_ID == r.DAOTAO_HOCPHAN_ID && x.DIEMQUYDOI_ID == c.ID; } },
        { key: 'dg', text: '2) Thống kê đánh giá Học Lại,…', dm: 'rsDanhMucDanhGia', du: 'rsDuLieuDanhGia',
          khop: function (x, r, c) { return x.DAOTAO_HOCPHAN_ID == r.DAOTAO_HOCPHAN_ID && x.DAOTAO_KHOAQUANLY_ID == r.DAOTAO_KHOAQUANLY_ID && x.DANHGIA_ID == c.ID; } },
        { key: 'h10', text: '3) Thống kê kết quả theo thang điểm 10', dm: 'rsDanhMucDiemHe10', du: 'rsDuLieuDiemHe10',
          khop: function (x, r, c) { return x.DAOTAO_HOCPHAN_ID == r.DAOTAO_HOCPHAN_ID && x.DAOTAO_KHOAQUANLY_ID == r.DAOTAO_KHOAQUANLY_ID && x.DIEM == c.ID; } },
        { key: 'h4', text: '4) Thống kê kết quả theo thang điểm 4', dm: 'rsDanhMucDiemHe4', du: 'rsDuLieuDiemHe4',
          khop: function (x, r, c) { return x.DAOTAO_HOCPHAN_ID == r.DAOTAO_HOCPHAN_ID && x.DAOTAO_KHOAQUANLY_ID == r.DAOTAO_KHOAQUANLY_ID && x.DIEMQUYDOI == c.ID; } }
    ];

    tk.innerHTML = ums.pat.panel({
        title: 'Thống kê kết quả', icon: 'fa-chart-column', flush: true,
        tools: ui.btn('close', { attr: { 'data-a': 'dong' } }),
        body: ui.tabs(TAB.map(function (t) { return { key: t.key, text: t.text }; }), 'chu', 'data-tktab') +
            TAB.map(function (t, i) { return '<div data-tkpane="' + t.key + '"' + (i ? ' hidden' : '') + '></div>'; }).join('')
    });
    function pane(k) { return tk.querySelector('[data-tkpane="' + k + '"]'); }

    /* edu.system.actionRowSpan(tbl, [1]) — gộp ô liền nhau cùng nội dung ở một cột thân bảng */
    function gopCot(host, cot) {
        var dau = null, n = 0;
        Array.prototype.forEach.call(host.querySelectorAll('tbody > tr'), function (tr) {
            var td = tr.children[cot];
            if (!td) return;
            if (dau && dau.textContent === td.textContent) { n++; dau.rowSpan = n; td.remove(); }
            else { dau = td; n = 1; }
        });
    }

    function veTab(t, data) {
        var hp = arr(data.rsThongTinHocPhan), dm = arr(data[t.dm]), du = arr(data[t.du]);
        var rows = hp.map(function (r) {
            var o = Object.assign({}, r), tong = 0;
            dm.forEach(function (c, j) {
                var n = du.filter(function (x) { return t.khop(x, r, c); }).length;
                o['_c' + j] = n; tong += n;
            });
            o._tong = tong;
            return o;
        });
        ui.table({ el: pane(t.key), rows: rows, empty: 'Không có dữ liệu', columns: [
            { title: 'Khoa quản lý', prop: 'DAOTAO_KHOAQUANLY_TEN' },
            { title: 'Học phần', render: function (r) { return esc(e(r.DAOTAO_HOCPHAN_TEN) + ' ' + e(r.DAOTAO_HOCPHAN_MA)); } }
        ].concat(dm.map(function (c, j) {
            return { title: e(c.TEN), prop: '_c' + j, cls: 'is-center', sum: true };
        })).concat([{ title: 'Sum', prop: '_tong', cls: 'is-center' }]) });
        gopCot(pane(t.key), 1);
    }

    ds.addEventListener('ndlt:thongke', function (ev) {
        var ids = ev.detail.ids;
        if (ids.length > 1000) ui.toast('Chỉ thống kê được 1.000 dòng đầu (đã chọn ' + ids.length + ').', 'warn');
        var goi = { action: 'D_ThongKe_MH/FSkuLyYJLiIVIDEVKSQuBRIV', func: 'pkg_diem_thongke.ThongHocTapTheoDST', method: 'POST' };
        for (var k = 0; k < 10; k++) goi['strThi_DanhSachThi_' + (k + 1) + '_Id'] = ids.slice(k * 100, (k + 1) * 100).toString();
        TAB.forEach(function (t) { pane(t.key).innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin'); });
        ui.swap(ds, tk);
        ums.api.call(goi).then(function (r) {
            var data = r.data || {};
            TAB.forEach(function (t) { veTab(t, data); });
        }).catch(function (err) {
            TAB.forEach(function (t) { pane(t.key).innerHTML = ui.fail(err.message); });
            ums.api.handle(err, 'thống kê kết quả');
        });
    });

    tk.addEventListener('click', function (ev) {
        var a = ev.target.closest('[data-tktab]');
        if (a) {
            var k = a.getAttribute('data-tktab');
            ui.tabsActive(tk, k, 'data-tktab');
            TAB.forEach(function (t) { pane(t.key).hidden = t.key !== k; });
            return;
        }
        if (ev.target.closest('[data-a="dong"]')) {
            ui.swap(tk, ds);
            if (ds.ndltTim) ds.ndltTim();
        }
    });
})();
