/* =========================================================================
   Sinh viên nhập học — danh sách hồ sơ người học theo chương trình / lớp
   Bản gốc: ApisNhapHoc/Modules/thongke/html/sinhviennhaphoc.html + scripts/sinhviennhaphoc.js
   ---------------------------------------------------------------------------
   Bố cục như gốc: MỘT cột — thanh lọc ngang, khung "Danh sách sinh viên nhập học" có "Truy/xuất ▾" + Tải lại.
   Lời gọi (chép nguyên):
     Bộ lọc: ums.nhTk.boLoc (thongke/scripts/_chung.js) — kế hoạch → CT → lớp, cơ sở, từ/đến ngày, từ khoá
       (gốc KHÔNG có ô khoản thu trên màn này)
     SV_HoSoHocVien/LayDanhSachHoSo (GET, phân trang máy chủ) { type: 'GET', strTuKhoa, strHeDaoTao_Id: "", strKhoaDaoTao_Id: "",
       strChuongTrinh_Id, strLopQuanLy_Id, strQLSV_TrangThaiNguoiHoc_Id: "", dLocTheoDuLieuImport: -1, strNguoiThucHien_Id,
       strChucNang_Id, strTuNgay, strDenNgay, pageIndex, pageSize }
     Truy/xuất: edu.system.report("TKNH_DHTL_2018_THEOLOP" | "…_THEONGANH" | "…_DSCHITIETTHEOLOP", "", addKeyValue)
       → ums.report.run; strLoaiKhoan_Id đọc ô dropLoaiKhoanThu_SVNH KHÔNG có trên màn → gửi "" (đúng giá trị gốc gửi).
   Bảng: SBD (SOBAODANH) · Mã số SV (MASONGUOIHOC) · Họ tên (HODEM + TEN) · Ngày sinh (NGAYSINH_NGAY/THANG/NAM) ·
     Giới tính (GIOITINH_TEN) · Lớp quản lý (DAOTAO_LOPQUANLY_TEN).
   TỰ CHỐT: gốc gửi strTuKhoa = GIÁ TRỊ Ô LỚP QUẢN LÝ (còn ô "Nhập từ khóa" không lời gọi nào đọc) — rõ là gán nhầm
     ô. Ở đây strTuKhoa = ô từ khoá; lớp vẫn đi qua strLopQuanLy_Id.
   Như gốc: kế hoạch chỉ dùng để nối tầng chương trình và cho báo cáo, không lọc danh sách. Mở màn không tự tải.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('nh-sinhviennhaphoc');
    if (!root) return;
    var ums = window.ums, ui = ums.ui, pat = ums.pat, T = ums.nhTk;

    var MAU = [
        { key: 'TKNH_DHTL_2018_THEOLOP', text: 'Xuất BC theo lớp' },
        { key: 'TKNH_DHTL_2018_THEONGANH', text: 'Xuất BC theo ngành' },
        { key: 'TKNH_DHTL_2018_DSCHITIETTHEOLOP', text: 'Xuất BC chi tiết theo lớp' }
    ];

    root.innerHTML = pat.page('Sinh viên nhập học') +
        '<div data-z="loc"></div>' +
        pat.panel({
            title: 'Danh sách sinh viên nhập học', icon: 'fa-users', count: 'dem', flush: true, zone: 'bang',
            tools: T.drop('Truy/xuất', 'fa-file-excel', MAU) + ui.btn('reload', { attr: { 'data-a': 'reload' } }),
            body: ui.empty('Chọn điều kiện rồi bấm Tìm kiếm để xem danh sách.', 'fa-users')
        });

    var L = T.boLoc(root.querySelector('[data-z="loc"]'), { khoanThu: false, tuKhoa: true });
    var bang = root.querySelector('[data-z="bang"]');
    var dem = root.querySelector('[data-z="dem"]');
    var trang = 1, co = 10, tong = 0, rows = [];

    var COT = [
        { title: 'Số báo danh', prop: 'SOBAODANH' },
        { title: 'Mã số SV', prop: 'MASONGUOIHOC', cls: 'is-nowrap' },
        { title: 'Họ tên', render: function (r) { return ui.esc((r.HODEM || '') + ' ' + (r.TEN || '')); } },
        { title: 'Ngày sinh', cls: 'is-nowrap', render: function (r) { return ui.esc(T.ngaySinh(r)); } },
        { title: 'Giới tính', prop: 'GIOITINH_TEN' },
        { title: 'Lớp quản lý', prop: 'DAOTAO_LOPQUANLY_TEN' }
    ];

    function ve() {
        ui.table({
            el: bang, columns: COT, rows: rows, empty: 'Không có sinh viên',
            page: {
                index: trang, size: co, total: tong,
                onChange: function (p) { if (p >= 1 && p <= Math.ceil(tong / co)) tai(p); },
                onSize: function (s) { co = s; tai(1); }
            }
        });
        dem.textContent = '(' + tong + ')';
    }

    function tai(p) {
        trang = p || trang;
        var v = L.v();
        if (!rows.length) bang.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
        ums.api.call({
            action: 'SV_HoSoHocVien/LayDanhSachHoSo', method: 'GET', type: 'GET',
            strTuKhoa: v.q, strHeDaoTao_Id: '', strKhoaDaoTao_Id: '', strChuongTrinh_Id: v.ct, strLopQuanLy_Id: v.lop,
            strQLSV_TrangThaiNguoiHoc_Id: '', dLocTheoDuLieuImport: -1, strNguoiThucHien_Id: ums.session.userId,
            strChucNang_Id: ums.state.chucNangId, strTuNgay: v.tu, strDenNgay: v.den, pageIndex: trang, pageSize: co
        }).then(function (r) {
            rows = Array.isArray(r.data) ? r.data : [];
            tong = Number(r.pager) || rows.length;
            ve();
        }).catch(function (err) {
            rows = [];
            bang.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'Danh sách sinh viên nhập học');
        });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') tai(1);
        else if (a === 'reload') tai();
    });
    root.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' && ev.target.matches('[data-f="q"]')) { ev.preventDefault(); tai(1); }
    });
    T.ganDrop(root, function (ma) {
        ums.report.run(ma, { duongDan: '', collect: function (add) { L.baoCao(add); } });
    });
})();
