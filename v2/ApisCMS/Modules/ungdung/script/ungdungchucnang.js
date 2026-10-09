/* =========================================================================
   Ứng dụng - chức năng
   Bản gốc: ApisCMS/Modules/ungdung/html/ungdungchucnang.html + script/ungdungchucnang.js
   ---------------------------------------------------------------------------
   Hai cột như bản gốc: danh sách ứng dụng (col-sm-3) | cây chức năng của
   ứng dụng đang chọn (col-sm-9). Màn CHỈ XEM — bản gốc không có thao tác ghi.
   Cây: ums.cmsCay (vaitro/script/_chung.js, nạp chéo — xem báo cáo).

   Lời gọi (chép nguyên văn):
       pkg_chung_quanlynguoidung.LayDanhSachUngDung   CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikULyYFNC8m
           strTuKhoa "", pageIndex 1, pageSize 10000, dTrangThai 1
       pkg_chung_quanlynguoidung.LayDanhSachChucNang  CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikCKTQiDyAvJgPP
           strTuKhoa "", strChung_UngDung_Id, strCha_Id "", pageIndex 1, pageSize 1000,
           strPhamViTruyCap_Id "", dTrangThai 1          (bản này KHÔNG có versionAPI — như gốc)

   Giữ như gốc: số đếm hai khung lấy từ Pager; hai ô tìm lọc TẠI CHỖ trên
   cây đã tải, tô từ khoá (filterTree).
   Khác gốc: mục mồ côi (cha không có trong danh sách) hiện ở gốc cây — jstree
   của bản gốc bỏ mất.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, C = ums.cmsCay;
    var root = document.getElementById('cms-ungdungchucnang');
    if (!root) return;

    var m = ums.pat.master({
        el: root,
        title: 'Ứng dụng - chức năng',
        side: { title: 'Danh sách ứng dụng', icon: 'fa-check-to-slot', search: 'Tìm tên ứng dụng...' },
        main: { title: 'Danh sách chức năng', icon: 'fa-gear-complex', count: true }
    });
    m.mainBody.innerHTML =
        '<div class="ums-searchbar ums-searchbar--sm">' +
            '<span class="ums-searchbar__icon"><i class="fa-light fa-magnifying-glass"></i></span>' +
            '<input class="ums-searchbar__input" data-a="qcn" placeholder="Tìm tên chức năng..." autocomplete="off"></div>' +
        '<div data-z="cay">' + ui.empty('Chọn một ứng dụng ở cột bên trái', 'fa-hand-pointer') + '</div>';
    var elCay = root.querySelector('[data-z="cay"]');
    var elQ = root.querySelector('[data-a="qcn"]');
    var dangMo = '';

    function rowsOf(r) { var d = r.data; return Array.isArray(d) ? d : (d && d.rs) || []; }

    function napUngDung() {
        m.sideBody.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({
            action: 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikULyYFNC8m',
            func: 'pkg_chung_quanlynguoidung.LayDanhSachUngDung',
            strTuKhoa: '',
            pageIndex: 1,
            pageSize: 10000,
            dTrangThai: 1
        }).then(function (r) {
            var ds = rowsOf(r);
            m.sideCount.textContent = '(' + (r.pager || ds.length) + ')';
            m.sideBody.innerHTML = C.html(ds, { ten: 'TENUNGDUNG', icon: 'fa-hard-drive', active: dangMo });
            C.loc(m.sideBody, m.search.value);
        }).catch(function (err) {
            m.sideBody.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'danh sách ứng dụng');
        });
    }

    function napChucNang(id) {
        elCay.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        var tok = napChucNang.tok = {};
        ums.api.call({
            action: 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikCKTQiDyAvJgPP',
            func: 'pkg_chung_quanlynguoidung.LayDanhSachChucNang',
            strTuKhoa: '',
            strChung_UngDung_Id: id,
            strCha_Id: '',
            pageIndex: 1,
            pageSize: 1000,
            strPhamViTruyCap_Id: '',
            dTrangThai: 1
        }).then(function (r) {
            if (napChucNang.tok !== tok) return;
            var ds = rowsOf(r);
            if (m.mainCount) m.mainCount.textContent = '(' + (r.pager || ds.length) + ')';
            elCay.innerHTML = C.html(ds, { cha: 'CHUCNANGCHA_ID', ten: 'TENCHUCNANG', icon: 'fa-gear', kieu: 'xem' });
            C.loc(elCay, elQ.value);
        }).catch(function (err) {
            if (napChucNang.tok !== tok) return;
            elCay.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'chức năng của ứng dụng');
        });
    }

    m.search.addEventListener('input', function () { C.loc(m.sideBody, m.search.value); });
    elQ.addEventListener('input', function () { C.loc(elCay, elQ.value); });
    m.sideBody.addEventListener('click', function (ev) {
        var b = ev.target.closest('.cmsc-cay__node[data-id]');
        if (!b) return;
        dangMo = b.getAttribute('data-id');
        C.active(m.sideBody, dangMo);
        napChucNang(dangMo);
    });

    napUngDung();
})();
