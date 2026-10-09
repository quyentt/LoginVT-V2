/* =========================================================================
   Nhập học — khung màn BÁO CÁO (ums.nhBc)   Dùng ở: baocaothongke/baocao, baocaothongke/baocaosinhvien
   ---------------------------------------------------------------------------
   Hai màn gốc là một tệp .js chép nhau (diff chỉ khác id ô, danh sách mẫu và việc gửi strLoaiKhoan_Id).
   Bố cục như gốc: HAI cột 6 | 6 — trái "Điều kiện xuất báo cáo" (Kế hoạch chọn nhiều · Chương trình · Lớp quản lý ·
   Khoản thu · Cơ sở đào tạo · Thời gian), phải "Danh sách mẫu báo cáo <LOẠI>" — mỗi dòng "Mẫu n: tên" + nút "Tải xuống".
   Bộ lọc dùng chung với nhóm thống kê: ums.nhTk.boLoc (thongke/scripts/_chung.js, nhãn "Tất cả" như gốc).

   ums.nhBc.man(root, {
       tieuDe, loai: 'TÀI CHÍNH' | 'SINH VIÊN',
       mau: [{ ma, ten }],          danh sách mẫu viết sẵn trong html gốc
       nguon: true,                 (baocao) nạp SYS_Import_PhanQuyen/LayDanhSach — có dòng thì THAY danh sách viết sẵn (như gốc)
       khoanThu: true               gửi strLoaiKhoan_Id khi xuất (baocaosinhvien gốc KHÔNG gửi dù có ô Khoản thu)
   })
   Xuất: edu.system.report(mã, "", addKeyValue) → ums.report.run(mã, { duongDan: '', tpl, collect }).
   ========================================================================= */
(function () {
    'use strict';
    var ums = window.ums, ui = ums.ui, pat = ums.pat;
    var B = ums.nhBc = ums.nhBc || {};

    B.man = function (root, o) {
        root.innerHTML = pat.page(o.tieuDe) +
            '<div class="ums-grid ums-grid--2 ums-cols nhbc">' +
            pat.panel({ title: 'Điều kiện xuất báo cáo', icon: 'fa-file-chart-pie', zone: 'loc' }) +
            pat.panel({ title: 'Danh sách mẫu báo cáo ' + o.loai, icon: 'fa-file-chart-column', zone: 'mau', flush: true, count: 'dem' }) +
            '</div>';

        var L = ums.nhTk.boLoc(root.querySelector('[data-z="loc"]'), { kieu: 'form', khNhieu: true, tatCa: true });
        var host = root.querySelector('[data-z="mau"]');
        var ds = o.mau.slice();

        function ve() {
            ui.table({
                el: host, rows: ds, stt: false, empty: 'Chưa có mẫu báo cáo',
                columns: [
                    { title: 'Mẫu báo cáo', render: function (r, i) { return 'Mẫu ' + (i + 1) + ': ' + ui.esc(r.ten); } },
                    { title: '', cls: 'is-actions', width: '130px', render: function (r, i) {
                        return ui.btn('report', { text: 'Tải xuống', icon: 'fa-download', cls: 'ums-btn--sm', attr: { 'data-mau': i } });
                    } }
                ]
            });
            root.querySelector('[data-z="dem"]').textContent = '(' + ds.length + ')';
        }
        ve();

        if (o.nguon) {
            /* getList_MauImport riêng của màn gốc — action kiểu cũ SYS_Import_PhanQuyen/LayDanhSach (GET) */
            ums.api.call({
                action: 'SYS_Import_PhanQuyen/LayDanhSach', method: 'GET', silent: true,
                strTuKhoa: '', strNguoiTao_Id: '', strUngDung_Id: ums.state.roleId, strChucNang_Id: ums.state.chucNangId,
                strNguoiDung_Id: ums.session.userId, strMauImport_Id: '', pageIndex: 1, pageSize: 100000
            }).then(function (r) {
                var rows = Array.isArray(r.data) ? r.data : [];
                if (!rows.length) return;          // gốc: rỗng thì giữ danh sách viết sẵn
                ds = rows.map(function (x) { return { ma: x.MAUIMPORT_MA || '', ten: x.MAUIMPORT_TENFILEMAU || '', tpl: x }; });
                ve();
            }).catch(function (err) { ums.api.handle(err, 'SYS_Import_PhanQuyen/LayDanhSach'); });
        }

        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-mau]');
            if (!b) return;
            var m = ds[Number(b.getAttribute('data-mau'))];
            if (!m) return;
            ums.report.run(m.ma, { duongDan: '', tpl: m.tpl, collect: function (add) { L.baoCao(add, { khoanThu: o.khoanThu !== false }); } });
        });
        return L;
    };
})();
