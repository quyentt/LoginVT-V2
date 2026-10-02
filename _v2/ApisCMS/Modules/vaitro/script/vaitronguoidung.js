/* =========================================================================
   Vai trò - người dùng
   Bản gốc: ApisCMS/Modules/vaitro/html/vaitronguoidung.html + script/vaitronguoidung.js
   ---------------------------------------------------------------------------
   Hai cột như bản gốc: cây vai trò (col-sm-3) | hai khung xếp dọc (col-sm-9):
     1. "Danh sách người dùng thuộc vai trò - <tên>" + ô tìm + nút Xóa
     2. Thanh tìm (Đối tượng, từ khoá, Tìm kiếm) + "Thêm vai trò" +
        "Danh sách người dùng" có ô đánh dấu

   Lời gọi (chép nguyên văn):
       pkg_chung_quanlynguoidung.LayDanhSachVaiTro     CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikXICgVMy4P
           strLoaiVaiTro_Id "", strTuKhoa "", pageIndex 1, pageSize 1000, dTrangThai 1
       pkg_chung_quanlynguoidung.LayDanhSachNguoiDung  CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikPJjQuKAU0LyYP
           (edu.extend.getList_NguoiDung — Corei/systemextend.js:2688)
           strTuKhoa, strPhanLoaiDoiTuong (ô Đối tượng), dTrangThai 1, strChung_DonVi_Id "",
           strVaiTro_Id "", strCapXuLy_Id "", strTinhThanh_Id "", pageIndex, pageSize
           cột: TAIKHOAN, TENDAYDU
       PKG_CORE_QUANTRI_01.LayDSNguoiDungVaiTro        CMS_QuanTri01_MH/DSA4BRIPJjQuKAU0LyYXICgVMy4P
           strVaiTro_Id, strTuKhoa (ô tìm của bảng), strHanhDong_Id "", pageIndex, pageSize
           cột: NAME, FULLNAME, EMAIL
       PKG_CORE_QUANTRI_02.Them_Core_NhanSu_VaiTro     CMS_QuanTri02_MH/FSkkLB4CLjMkHg8pIC8SNB4XICgVMy4P
           strCore_NhanSu_Id = ID dòng người dùng, strVaiTro_Id; strPhanLoaiNguonTao_Id,
           dLaVaiTroChinh, strNguonDuLieu_Id, strNgayHieuLuc, strNgayHetHieuLuc,
           strCoChePhatSinh_Id, dHieuLuc = "" (gốc đọc ô txtAAAA/dropAAAA không tồn tại)
       PKG_CORE_QUANTRI_02.Xoa_Core_NhanSu_VaiTro2     CMS_QuanTri02_MH/GS4gHgIuMyQeDykgLxI0HhcgKBUzLnMP
           strId "", strCore_NhanSu_Id = ID dòng đã thêm, strVaiTro_Id

   Giữ như gốc: mỗi người một lời gọi (ums.ui.batch thay genHTML_Progress),
   xong nạp lại bảng đã thêm; chữ hỏi lại "Bạn có chắc chắn muốn kế thừa không".
   Đổi ô Đối tượng / gõ từ khoá (trễ 400ms) / Enter / Tìm kiếm = nạp lại trang 1.

   Khác gốc (lỗi rõ của bản gốc):
     · Hai bảng dùng CHUNG một biến trang (edu.system.pageIndex_default) — lật
       trang bảng này làm bảng kia nhảy trang. Ở đây mỗi bảng một phân trang.
     · Bảng "đã thêm" ghi tổng vào nhãn của bảng người dùng (lblNguoiDung_Tong)
       và gắn hai ô "chọn tất cả" trùng id vào cùng một bảng. Mỗi bảng nay tự
       đếm và có ô chọn tất cả của riêng nó.
     · Chưa chọn vai trò mà bấm "Thêm vai trò": gốc vẫn gửi strVaiTro_Id rỗng.
       Ở đây báo "Vui lòng chọn vai trò" và dừng.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, C = ums.cmsCay;
    var root = document.getElementById('cms-vaitronguoidung');
    if (!root) return;

    var SIZE = (ums.cfg && ums.cfg.behavior && ums.cfg.behavior.pageSize) || 10;
    var DOI_TUONG = [
        { ID: 'CANBO', TEN: 'Cán bộ, giảng viên, lãnh đạo' },
        { ID: 'DOITAC', TEN: 'Đối tác' },
        { ID: 'GIADINH', TEN: 'Gia đình' },
        { ID: 'CUUSINHVIEN', TEN: 'Cựu sinh viên' },
        { ID: 'SINHVIEN', TEN: 'Sinh viên' },
        { ID: 'NCS', TEN: 'Nghiên cứu sinh' }
    ];

    var m = ums.pat.master({
        el: root,
        title: 'Vai trò - người dùng',
        side: { title: 'Danh sách vai trò', icon: 'fa-users-gear', search: 'Tìm tên vai trò...' },
        main: { title: false }
    });

    m.mainBody.innerHTML =
        ums.pat.panel({
            title: 'Danh sách người dùng thuộc vai trò', icon: 'fa-users', count: 'daCount', flush: true,
            tools: '<div class="ums-searchbar ums-searchbar--sm cmsvtnd-tim">' +
                '<button type="button" class="ums-searchbar__icon" data-a="daTim" title="Tìm kiếm"><i class="fa-light fa-magnifying-glass"></i></button>' +
                '<input class="ums-searchbar__input" data-a="daQ" placeholder="Tìm theo từ khóa" autocomplete="off"></div>' +
                ui.xoaChon('input[data-ndvt]', { goc: '.ums-panel', attr: { 'data-a': 'xoa' } }),
            body: '<div data-z="da"></div>'
        }) +
        '<div class="ums-panel ums-u-mb-4"><div class="ums-panel__body"><div class="ums-filter">' +
            '<div class="ums-field"><select class="ums-select" data-a="doiTuong" data-ph="--Chọn đối tượng--">' +
                ui.options(DOI_TUONG, { title: '--Chọn đối tượng--' }) + '</select></div>' +
            '<div class="ums-field"><input class="ums-input" data-a="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
            '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'tim' } }) + '</div>' +
        '</div></div></div>' +
        ums.pat.panel({
            title: 'Danh sách người dùng', icon: 'fa-users', count: 'ndCount', flush: true,
            tools: ui.btn('add', { text: 'Thêm vai trò', attr: { 'data-a': 'them' } }),
            body: '<div data-z="nd"></div>'
        });

    function $(s) { return root.querySelector(s); }
    var elDa = $('[data-z="da"]'), elNd = $('[data-z="nd"]');
    var elDaQ = $('[data-a="daQ"]'), elQ = $('[data-a="q"]'), elDT = $('[data-a="doiTuong"]');
    var daTitle = elDa.closest('.ums-panel').querySelector('.ums-panel__title');

    var dsVaiTro = [];
    var vaiTro = null;
    var trangDa = 1, sizeDa = SIZE, trangNd = 1, sizeNd = SIZE;
    function rowsOf(r) { var d = r.data; return Array.isArray(d) ? d : (d && d.rs) || []; }

    /* ---------- Cây vai trò --------------------------------------------- */
    function napVaiTro() {
        m.sideBody.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({
            action: 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikXICgVMy4P',
            func: 'pkg_chung_quanlynguoidung.LayDanhSachVaiTro',
            strLoaiVaiTro_Id: '',
            strTuKhoa: '',
            pageIndex: 1,
            pageSize: 1000,
            dTrangThai: 1
        }).then(function (r) {
            dsVaiTro = rowsOf(r);
            m.sideCount.textContent = '(' + (r.pager || dsVaiTro.length) + ')';
            m.sideBody.innerHTML = C.html(dsVaiTro, { cha: 'CHUNG_VAITRO_CHA_ID', ten: 'TENVAITRO', icon: 'fa-user', active: vaiTro && vaiTro.ID });
            C.loc(m.sideBody, m.search.value);
        }).catch(function (err) {
            m.sideBody.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'danh sách vai trò');
        });
    }
    m.search.addEventListener('input', function () { C.loc(m.sideBody, m.search.value); });
    m.sideBody.addEventListener('click', function (ev) {
        var b = ev.target.closest('.cmsc-cay__node[data-id]');
        if (!b) return;
        var id = b.getAttribute('data-id');
        vaiTro = dsVaiTro.filter(function (x) { return x.ID === id; })[0] || null;
        C.active(m.sideBody, id);
        veTieuDe();
        napDa(1);
    });
    function veTieuDe() {
        var t = daTitle.firstChild;             // <i>
        while (t.nextSibling && t.nextSibling.nodeType === 3) t.parentNode.removeChild(t.nextSibling);
        t.insertAdjacentText('afterend', ' Danh sách người dùng thuộc vai trò' + (vaiTro ? ' - ' + (vaiTro.TENVAITRO || '') : '') + ' ');
    }

    /* ---------- Bảng người dùng đã thuộc vai trò ------------------------ */
    function oChon(attr, all) {
        return all ? '<input type="checkbox" ' + attr + '-all title="Chọn tất cả">' : '';
    }
    function napDa(p) {
        if (p) trangDa = p;
        if (!vaiTro) {
            elDa.innerHTML = ui.empty('Chọn một vai trò ở cây bên trái để xem người dùng', 'fa-hand-pointer');
            $('[data-z="daCount"]').textContent = '';
            return;
        }
        elDa.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        var tok = napDa.tok = {};
        ums.api.call({
            action: 'CMS_QuanTri01_MH/DSA4BRIPJjQuKAU0LyYXICgVMy4P',
            func: 'PKG_CORE_QUANTRI_01.LayDSNguoiDungVaiTro',
            strVaiTro_Id: vaiTro.ID,
            strTuKhoa: elDaQ.value.trim(),
            strHanhDong_Id: '',
            strNguoiThucHien_Id: '',
            pageIndex: trangDa,
            pageSize: sizeDa
        }).then(function (r) {
            if (napDa.tok !== tok) return;
            var rows = rowsOf(r);
            var tong = Number(r.pager) || rows.length;
            $('[data-z="daCount"]').textContent = '(' + tong + ')';
            ui.table({
                el: elDa, rows: rows,
                empty: 'Vai trò chưa có người dùng nào',
                columns: [
                    { title: 'Mã', prop: 'NAME', cls: 'is-nowrap' },
                    { title: 'Tên', prop: 'FULLNAME' },
                    { title: 'Email', prop: 'EMAIL' },
                    { head: oChon('data-ndvt', true), cls: 'is-center', width: '44px',
                      render: function (x) { return '<input type="checkbox" data-ndvt="' + ui.esc(x.ID) + '">'; } }
                ],
                page: { index: trangDa, size: sizeDa, total: tong,
                        onChange: function (p) { napDa(p); },
                        onSize: function (v) { sizeDa = v; napDa(1); } }
            });
        }).catch(function (err) {
            if (napDa.tok !== tok) return;
            elDa.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'người dùng của vai trò');
        });
    }

    /* ---------- Bảng người dùng ----------------------------------------- */
    function napNd(p) {
        if (p) trangNd = p;
        elNd.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        var tok = napNd.tok = {};
        ums.api.call({
            action: 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikPJjQuKAU0LyYP',
            func: 'pkg_chung_quanlynguoidung.LayDanhSachNguoiDung',
            strTuKhoa: elQ.value.trim(),
            strPhanLoaiDoiTuong: elDT.value,
            dTrangThai: 1,
            strChung_DonVi_Id: '',
            strVaiTro_Id: '',
            strCapXuLy_Id: '',
            strTinhThanh_Id: '',
            pageIndex: trangNd,
            pageSize: sizeNd
        }).then(function (r) {
            if (napNd.tok !== tok) return;
            var rows = rowsOf(r);
            var tong = Number(r.pager) || rows.length;
            $('[data-z="ndCount"]').textContent = '(' + tong + ')';
            ui.table({
                el: elNd, rows: rows,
                columns: [
                    { title: 'Mã', prop: 'TAIKHOAN', cls: 'is-nowrap' },
                    { title: 'Tên', prop: 'TENDAYDU' },
                    { head: oChon('data-nd', true), cls: 'is-center', width: '44px',
                      render: function (x) { return '<input type="checkbox" data-nd="' + ui.esc(x.ID) + '">'; } }
                ],
                page: { index: trangNd, size: sizeNd, total: tong,
                        onChange: function (p) { napNd(p); },
                        onSize: function (v) { sizeNd = v; napNd(1); } }
            });
        }).catch(function (err) {
            if (napNd.tok !== tok) return;
            elNd.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'danh sách người dùng');
        });
    }

    function daChon(host, attr) {
        return Array.prototype.filter.call(host.querySelectorAll('tbody input[' + attr + ']'), function (x) { return x.checked; })
            .map(function (x) { return x.getAttribute(attr); });
    }

    /* ---------- Sự kiện -------------------------------------------------- */
    root.addEventListener('change', function (ev) {
        var t = ev.target;
        ['data-ndvt', 'data-nd'].forEach(function (a) {
            if (!t.hasAttribute(a + '-all')) return;
            Array.prototype.forEach.call(t.closest('table').querySelectorAll('tbody input[' + a + ']'), function (x) { x.checked = t.checked; });
        });
        if (t === elDT) napNd(1);
    });

    var hen = 0;
    elQ.addEventListener('input', function () { clearTimeout(hen); hen = setTimeout(function () { napNd(1); }, 400); });
    root.addEventListener('keydown', function (ev) {
        if (ev.key !== 'Enter') return;
        if (ev.target === elQ) { ev.preventDefault(); clearTimeout(hen); napNd(1); }
        if (ev.target === elDaQ) { ev.preventDefault(); napDa(1); }
    });

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'tim') { clearTimeout(hen); napNd(1); }
        else if (a === 'daTim') napDa(1);
        else if (a === 'them') them();
        else if (a === 'xoa') xoa();
    });

    function them() {
        var ids = daChon(elNd, 'data-nd');
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
        if (!vaiTro) { ui.toast('Vui lòng chọn vai trò ở cây bên trái', 'warn'); return; }
        var vt = vaiTro.ID;
        ui.confirm('Bạn có chắc chắn muốn kế thừa không').then(function (ok) {
            if (!ok) return;
            ui.batch(ids.map(function (id) {
                return {
                    action: 'CMS_QuanTri02_MH/FSkkLB4CLjMkHg8pIC8SNB4XICgVMy4P',
                    func: 'PKG_CORE_QUANTRI_02.Them_Core_NhanSu_VaiTro',
                    strCore_NhanSu_Id: id,
                    strVaiTro_Id: vt,
                    strPhanLoaiNguonTao_Id: '',
                    dLaVaiTroChinh: '',
                    strNguonDuLieu_Id: '',
                    strNgayHieuLuc: '',
                    strNgayHetHieuLuc: '',
                    strCoChePhatSinh_Id: '',
                    dHieuLuc: '',
                    strNguoiThucHien_Id: ''
                };
            }), { title: 'Đang thêm người dùng vào vai trò', okText: 'Thêm thành công' }).then(function () { napDa(); });
        });
    }

    function xoa() {
        var ids = daChon(elDa, 'data-ndvt');
        if (!ids.length || !vaiTro) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
        var vt = vaiTro.ID;
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá dữ liệu' }).then(function (ok) {
            if (!ok) return;
            ui.batch(ids.map(function (id) {
                return {
                    action: 'CMS_QuanTri02_MH/GS4gHgIuMyQeDykgLxI0HhcgKBUzLnMP',
                    func: 'PKG_CORE_QUANTRI_02.Xoa_Core_NhanSu_VaiTro2',
                    strId: '',
                    strCore_NhanSu_Id: id,
                    strVaiTro_Id: vt,
                    strNguoiThucHien_Id: ''
                };
            }), { title: 'Đang xoá', okText: 'Xóa dữ liệu thành công' }).then(function () { napDa(); });
        });
    }

    napVaiTro();
    napDa(1);
    napNd(1);
})();
