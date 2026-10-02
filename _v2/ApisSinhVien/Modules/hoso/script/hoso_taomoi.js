/* =========================================================================
   Tạo mới hồ sơ sinh viên — "Khởi tạo hồ sơ"
   Bản gốc: ApisSinhVien/Modules/hoso/html/hoso_taomoi.html + script/hosotaomoi.js + script/dexuathoso.js
            (biểu mẫu "Chỉnh sửa - Hồ sơ đề xuất" viết thẳng trong html, KHÔNG nạp zoneEditModal_inject.js)
   ---------------------------------------------------------------------------
   Bố cục gốc HAI cột: trái ô từ khoá + Tìm kiếm + "Danh sách sinh viên" (ảnh · họ tên · mã số - ngày sinh · nút sửa,
   phân trang); phải khung "Khởi tạo hồ sơ" — biểu mẫu khởi tạo ĐÃ ẨN theo yêu cầu 2026-08-21 (display:none), chỉ còn
   nút Import (thả xuống: 1. Import hồ sơ sinh viên — IMPORTWITHPROC_HSSV; 2. Import hồ sơ sinh viên đầy đủ —
   IMPORTWITHPROC_HSDD) + nút Lưu. Bấm sinh viên → biểu mẫu 3 tab (gốc: hộp nổi phủ trang; ở đây thay chỗ khung
   "Khởi tạo hồ sơ" ở cột phải — ums.hsA.editor), Đóng → về khung khởi tạo và nạp lại danh sách trái (như gốc).
   Lời gọi: SV_HoSoKhoiTao/LayDanhSach GET (pageIndex, pageSize, strHeDaoTao_Id, strKhoaDaoTao_Id, strChuongTrinh_Id,
            strLopQuanLy_Id — bốn ô dropSearchSinhVien_* KHÔNG có trên trang → rỗng như gốc, strNguoiThucHien_Id '',
            strTuKhoa) · Import: ums.report.importChung(tên, mã) (edu.system.showImportChung).
   Import: getList_MauImport("zonebtnHSSV") — vùng #zonebtnHSSV không có trên trang nên nút Báo cáo gốc KHÔNG BAO GIỜ
   hiện; vùng #zonebtnHSSV_Import thì có: phân quyền có mẫu import → thay hai mục viết cứng; không có → giữ hai mục đó.
   Ở đây: ums.report.mount chỉ lấy phần Import (onLoad vẽ lại vùng nút) — đúng hai nhánh trên.
   [Cần quyết] Nút "Lưu": gốc gọi SV_HoSo/ThemMoi với biểu mẫu khởi tạo đang ẨN (mọi ô rỗng) → tạo một hồ sơ RỖNG rồi
   mới hiện biểu mẫu, mà nút lưu biểu mẫu ("Cập nhật") đã bị chú thích bỏ. Tạm: giữ nút, KHOÁ (không tạo hồ sơ rỗng).
   Cố ý bỏ: popover thông tin khi rê chuột (popover_HS), CapNhat_HS / delete_HS / rewrite / addMode (nút đã chú thích bỏ
   trong html), getList_* Hệ/Khoá/CT/Lớp của biểu mẫu ẩn, fallback openEditModal "cache dexuathoso.js cũ".
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, esc = ui.esc, A = ums.hsA;
    var root = document.getElementById('sv-hoso-taomoi');
    if (!root) return;

    var m = pat.master({
        el: root, title: 'Tạo mới hồ sơ',
        side: { title: 'Danh sách sinh viên', icon: 'fa-address-book', search: 'Nhập từ khóa tìm kiếm',
            filter: '<div class="ums-filter hsa-loc"><div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-sv': 'tim' } }) + '</div></div>' },
        main: { title: false }
    });
    var kt = document.createElement('div'), edHost = document.createElement('div');
    m.mainBody.appendChild(kt); m.mainBody.appendChild(edHost);
    edHost.hidden = true;
    kt.innerHTML = pat.panel({ title: 'Khởi tạo hồ sơ', icon: 'fa-address-card',
        tools: '<span data-z="imp"></span>' + ui.btn('save', { attr: { 'data-a': 'luu', disabled: 'disabled',
            title: 'Biểu mẫu khởi tạo đã ẩn (yêu cầu 2026-08-21) — bấm Lưu ở bản gốc sẽ tạo một hồ sơ rỗng' } }),
        body: ui.empty('Import hồ sơ sinh viên theo mẫu, hoặc chọn một sinh viên ở danh sách bên trái để chỉnh sửa hồ sơ.', 'fa-hand-pointer') });

    /* ---------- Import (zonebtnHSSV_Import) ---------- */
    var CUNG = [{ MAUIMPORT_MA: 'IMPORTWITHPROC_HSSV', MAUIMPORT_TENFILEMAU: 'hồ sơ', nhan: 'Import hồ sơ sinh viên' },
        { MAUIMPORT_MA: 'IMPORTWITHPROC_HSDD', MAUIMPORT_TENFILEMAU: 'hồ sơ đầy đủ', nhan: 'Import hồ sơ sinh viên đầy đủ' }];
    var imp = kt.querySelector('[data-z="imp"]');
    ums.report.mount(imp, {
        onImported: function () { ds.load(1); },
        onLoad: function (rows) {
            function laImp(t) { var k = String(t.MAUIMPORT_MA || '').substring(0, 14).toUpperCase(); return k === 'IMPORTALLINPUT' || k === 'IMPORTWITHPROC'; }
            var chon = [];
            rows.forEach(function (t, i) { if (laImp(t)) chon.push(i); });
            if (!chon.length) {                           // không có mẫu import phân quyền → hai mục viết cứng của html gốc
                CUNG.forEach(function (t) { rows.push(t); chon.push(rows.length - 1); });
            }
            imp.innerHTML = '<div class="ums-drop" data-drop="import">' +
                '<button type="button" class="ums-btn ums-btn--out-info ums-drop__toggle" aria-haspopup="menu" aria-expanded="false">' +
                '<i class="fa-light fa-cloud-arrow-up"></i><span>Import</span><i class="fa-light fa-angle-down ums-drop__caret"></i></button>' +
                '<div class="ums-drop__menu" role="menu" hidden>' + chon.map(function (i, n) {
                    return '<button type="button" class="ums-drop__item" role="menuitem" data-rp="' + i + '">' +
                        '<span class="ums-drop__no">' + (n + 1) + '.</span><span class="ums-drop__text">' + esc(rows[i].nhan || rows[i].MAUIMPORT_TENFILEMAU) + '</span></button>';
                }).join('') + '</div></div>';
        }
    });

    /* ---------- Danh sách + biểu mẫu ---------- */
    var ed = A.editor(edHost, {
        onDong: function () { ds.boChon(); ui.swap(edHost, kt); setTimeout(function () { ds.load(); }, 300); }
    });
    var ds = A.dsSV(m, {
        call: function (q, v, trang, co) {
            return { action: 'SV_HoSoKhoiTao/LayDanhSach', method: 'GET', pageIndex: trang, pageSize: co, strHeDaoTao_Id: '', strKhoaDaoTao_Id: '',
                strChuongTrinh_Id: '', strLopQuanLy_Id: '', strNguoiThucHien_Id: '', strTuKhoa: q };
        },
        dong: function (r) {
            var meta = [A.e(r.MASO), [r.NGAYSINH_NGAY, r.NGAYSINH_THANG, r.NGAYSINH_NAM].map(A.e).filter(Boolean).join('/')].filter(Boolean).join(' - ');
            return meta ? '<span class="ums-master__item__sub">' + esc(meta) + '</span>' : '';
        },
        onPick: function (r) { if (edHost.hidden) ui.swap(kt, edHost); ed.mo(A.nguoi(r)); }
    });
    ds.load(1);
})();
