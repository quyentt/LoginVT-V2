/* =========================================================================
   Lệ phí nhập học — thống kê số tiền đã thu theo sinh viên × khoản thu của kế hoạch
   Bản gốc: ApisNhapHoc/Modules/thongke/html/lephinhaphoc.html + scripts/lephinhaphoc.js
   ---------------------------------------------------------------------------
   Bố cục như gốc: MỘT cột — thanh lọc ngang, khung "Danh sách" có nút "Truy/xuất ▾" + Tải lại.
   Lời gọi (chép nguyên):
     Bộ lọc: ums.nhTk.boLoc (thongke/scripts/_chung.js) — kế hoạch, CT, lớp, khoản thu, cơ sở
     Tìm kiếm (chỉ khi đã chọn Kế hoạch VÀ Lớp quản lý — như gốc):
       1. edu.system.getList_SinhVien → pkg_hosohocvien.LayDanhSachHoSo { strLopQuanLy_Id, pageIndex 1, pageSize 10000 }
       2. NH_ThongKe/LayDanhSach_CacKhoanNhapHocKeHoach (GET, versionAPI v1.0) { strNHAPHOC_KeHoach_Id }
          (khối obj_list dựng trước lời gọi này trong gốc là mã chết — trỏ ô dropAAAA/txtAAAA không có — bỏ)
       3. NH_ThongKe/LayDSTongHopThuTheoKeHoach (GET, versionAPI v1.0) { strTaiChinh_KeHoach_Id, strTaichinh_Cackhoanthu_Ids,
          strDaoTao_CoSoDaoTao_Id: "", strDaoTao_ChuongTrinh_Id: "", strDaoTao_LopQuanLy_Id, strTuNgay, strDenNgay }
     Truy/xuất: edu.system.report("M1" | "M2" | "M3", "", addKeyValue) → ums.report.run (cặp khoá: ums.nhTk.baoCao)
   Bảng (genTable_TongHop): SBD · Mã số · Họ tên · Ngày sinh · Giới tính · Lớp quản lý · <mỗi khoản thu (TEN)> · Tổng.
     Ô = SOTIEN của dòng tổng hợp có TAICHINH_CACKHOANTHU_ID = khoản và QLSV_NGUOIHOC_ID = sinh viên.
     Dòng Tổng = cộng MỌI dòng tổng hợp của khoản (như gốc — kể cả người học ngoài lớp đang xem).
   LỖI GỐC đã sửa:
     · Một sinh viên có HAI dòng tổng hợp cùng khoản thì gốc vẽ HAI ô → lệch cột cả dòng. Ở đây cộng dồn vào một ô.
     · Nút "Tải lại" gốc không gắn xử lý → nay chạy lại thống kê (như Tải lại của sinhviennhaphoc).
   Bỏ: ô "Nhập từ khóa tìm kiếm" gốc có trên thanh lọc nhưng không lời gọi nào đọc → vẫn giữ ô (bố cục gốc), không gửi.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('nh-lephinhaphoc');
    if (!root) return;
    var ums = window.ums, ui = ums.ui, pat = ums.pat, T = ums.nhTk;

    var MAU = [
        { key: 'M1', text: 'Mẫu 1: Bảng tổng hợp các khoản' },
        { key: 'M2', text: 'Mẫu 2: Bảng tổng hợp theo sinh viên' },
        { key: 'M3', text: 'Mẫu 3: Bảng tổng hợp chi tiết từng khoản' }
    ];

    root.innerHTML = pat.page('Lệ phí nhập học') +
        '<div data-z="loc"></div>' +
        pat.panel({
            title: 'Danh sách', icon: 'fa-list-timeline', count: 'dem', flush: true, zone: 'bang',
            tools: T.drop('Truy/xuất', 'fa-file-excel', MAU) + ui.btn('reload', { attr: { 'data-a': 'reload' } }),
            body: ui.empty('Chọn Kế hoạch và Lớp quản lý rồi bấm Tìm kiếm để thống kê.', 'fa-chart-simple')
        });

    var L = T.boLoc(root.querySelector('[data-z="loc"]'), { tuKhoa: true });
    var bang = root.querySelector('[data-z="bang"]');
    var dem = root.querySelector('[data-z="dem"]');

    function num(v) { var n = Number(String(v === null || v === undefined ? '' : v).replace(/,/g, '')); return isNaN(n) ? 0 : n; }

    function thongKe() {
        var v = L.v();
        if (!(v.lop && v.kh)) { ui.toast('Vui lòng chọn Kế hoạch và Lớp quản lý trước khi thống kê!', 'warn'); return; }
        bang.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
        Promise.all([
            ums.ref.sinhVien({ strCoSoDaoTao_Id: '', strKhoaDaoTao_Id: '', strNganh_Id: '', strLopQuanLy_Id: v.lop, strTuKhoa: '',
                pageIndex: 1, pageSize: 10000 }),
            ums.api.call({ action: 'NH_ThongKe/LayDanhSach_CacKhoanNhapHocKeHoach', method: 'GET', versionAPI: 'v1.0',
                strNHAPHOC_KeHoach_Id: v.kh }),
            ums.api.call({ action: 'NH_ThongKe/LayDSTongHopThuTheoKeHoach', method: 'GET', versionAPI: 'v1.0',
                strTaiChinh_KeHoach_Id: v.kh, strTaichinh_Cackhoanthu_Ids: v.kt, strDaoTao_CoSoDaoTao_Id: '',
                strDaoTao_ChuongTrinh_Id: '', strDaoTao_LopQuanLy_Id: v.lop, strTuNgay: v.tu, strDenNgay: v.den })
        ]).then(function (x) {
            ve(x[0] || [], x[1].data || [], x[2].data || []);
        }).catch(function (err) {
            bang.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'Lệ phí nhập học');
        });
    }

    function ve(dsSV, dsKhoan, dsThu) {
        // Ma trận sinh viên × khoản thu
        var o = {};
        dsThu.forEach(function (t) {
            var k = t.QLSV_NGUOIHOC_ID + '|' + t.TAICHINH_CACKHOANTHU_ID;
            o[k] = (o[k] || 0) + num(t.SOTIEN);
        });
        var rows = dsSV.map(function (sv) {
            var r = { _sv: sv, _tong: 0 };
            dsKhoan.forEach(function (kt, i) {
                var s = o[sv.ID + '|' + kt.ID] || 0;
                r['_k' + i] = s;
                r._tong += s;
            });
            return r;
        });
        var cols = [
            { title: 'SBD', render: function (r) { return ui.esc(r._sv.SOBAODANH || ''); } },
            { title: 'Mã số', cls: 'is-nowrap', render: function (r) { return ui.esc(r._sv.MASONGUOIHOC || ''); } },
            { title: 'Họ tên', render: function (r) { return ui.esc((r._sv.HODEM || '') + ' ' + (r._sv.TEN || '')); } },
            { title: 'Ngày sinh', cls: 'is-center is-nowrap', render: function (r) { return ui.esc(T.ngaySinh(r._sv)); } },
            { title: 'Giới tính', cls: 'is-center', render: function (r) { return ui.esc(r._sv.GIOITINH_TEN || ''); } },
            { title: 'Lớp quản lý', render: function (r) { return ui.esc(r._sv.DAOTAO_LOPQUANLY_TEN || ''); } }
        ];
        dsKhoan.forEach(function (kt, i) {
            cols.push({
                title: kt.TEN || '', cls: 'is-right is-nowrap',
                render: function (r) { return ui.money(r['_k' + i]); },
                // Dòng Tổng: cộng mọi dòng tổng hợp của khoản (như gốc)
                sum: function () {
                    return '<b>' + ui.money(dsThu.reduce(function (a, t) {
                        return a + (t.TAICHINH_CACKHOANTHU_ID === kt.ID ? num(t.SOTIEN) : 0);
                    }, 0)) + '</b>';
                }
            });
        });
        cols.push({
            title: 'Tổng', cls: 'is-right is-nowrap',
            render: function (r) { return '<b>' + ui.money(r._tong) + '</b>'; },
            sum: function () {
                var ids = {};
                dsKhoan.forEach(function (kt) { ids[kt.ID] = 1; });
                return '<b>' + ui.money(dsThu.reduce(function (a, t) { return a + (ids[t.TAICHINH_CACKHOANTHU_ID] ? num(t.SOTIEN) : 0); }, 0)) + '</b>';
            }
        });
        ui.table({ el: bang, columns: cols, rows: rows, empty: 'Lớp chưa có sinh viên' });
        dem.textContent = '(' + rows.length + ')';
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'search' || a === 'reload') thongKe();
    });
    root.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' && ev.target.matches('[data-f="q"]')) { ev.preventDefault(); thongKe(); }
    });
    T.ganDrop(root, function (ma) {
        ums.report.run(ma, { duongDan: '', collect: function (add) { L.baoCao(add); } });
    });
})();
