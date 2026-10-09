/* =========================================================================
   Người dùng - vai trò (gán / gỡ vai trò của một người dùng)
   Bản gốc: ApisCMS/Modules/nguoidung/html/nguoidungvaitro.html + script/nguoidungvaitro.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (HAI cột, giữ nguyên):
     trái  (col-sm-3) — tìm kiếm + "Danh sách người dùng" (ảnh, tên, email, nút xem; rê chuột = thẻ thông tin)
     phải (col-sm-9) — "Người dùng <tên>" + "Xóa vai trò" + "Thêm vai trò";
                       bên trong: col-3 "Danh sách vai trò (n)" của người dùng · col-9 ba vùng đổi chỗ:
                       "Danh sách chức năng (n)" của vai trò đang chọn ↔ "Thêm mới vai trò (n)" (lọc
                       Toàn bộ / Chưa thêm / Đã thêm, nút + từng dòng) ↔ "Xóa vai trò người dùng" (thùng rác từng dòng).
   Khung dùng chung: ums.cmsNd.dsNguoiDung (script/_chung.js).

   Lời gọi (chép nguyên — CLAUDE.md mục 4):
     CMS_QuanLyNguoiDung_MH · pkg_chung_quanlynguoidung.LayDanhSachNguoiDung  (= edu.extend.getList_NguoiDung,
         Corei/systemextend.js:2688) strTuKhoa, strPhanLoaiDoiTuong "", dTrangThai 1, strChung_DonVi_Id "",
         strVaiTro_Id "", strCapXuLy_Id "", strTinhThanh_Id "", pageIndex, pageSize (10)
     CMS_QuanLyNguoiDung_MH · pkg_chung_quanlynguoidung.LayDanhSachVaiTro  type POST, strLoaiVaiTro_Id "",
         strTuKhoa "", pageIndex 1, pageSize 1000, dTrangThai 1, strChung_VaiTro_Cha_Id "" — gọi lại sau MỖI
         lần nạp danh sách người dùng (như gốc)
     CMS_QuanTri01_MH · PKG_CORE_QUANTRI_01.LayDSVaiTroNguoiDung  strChucNang_Id "", strNguoiThucHien_Id = NGƯỜI
         ĐANG XEM (không phải người đăng nhập — cố ý như gốc)
     CMS_QuanTri01_MH · PKG_CORE_QUANTRI_01.LayDSChucNangNguoiDung  strChucNang_Id "", strVaiTro_Id,
         strNguoiThucHien_Id = người đang xem; đọc Data.rs
     CMS_QuanTri02_MH · PKG_CORE_QUANTRI_02.Them_Core_NhanSu_VaiTro  strCore_NhanSu_Id, strVaiTro_Id,
         strPhanLoaiNguonTao_Id / dLaVaiTroChinh / strNguonDuLieu_Id / strNgayHieuLuc / strNgayHetHieuLuc /
         strCoChePhatSinh_Id / dHieuLuc = "" (gốc đọc ô dropAAAA / txtAAAA không tồn tại), strNguoiThucHien_Id
     CMS_QuanTri02_MH · PKG_CORE_QUANTRI_02.Xoa_Core_NhanSu_VaiTro  strId = ID dòng của LayDSVaiTroNguoiDung,
         strNguoiThucHien_Id — gốc KHÔNG gửi id người dùng; ID dòng lại chính là ID vai trò (gốc so trùng
         dtNguoiDungVaiTro.ID với dtVaiTro.ID để đánh dấu "Đã thêm") → cần kiểm trên host procedure hiểu strId thế nào.

   Giữ như gốc:
     · "Tình trạng" của bảng chức năng: TRANGTHAI === 0 → Not Active, còn lại Active (chữ gốc tiếng Anh).
     · Chọn người dùng khác: nạp lại vai trò, xoá trắng bảng chức năng, vùng đang mở giữ nguyên.
     · Lọc "Chưa thêm / Đã thêm / Toàn bộ" lọc tại chỗ (gốc lọc theo chuỗi HTML của dòng), mặc định "Chưa thêm".
   Cố ý bỏ: rewrite() (reset các ô txtVaiTro_* không có trên màn), getList_NguoiDungChucNang /
     process_NguoiDung_VaiTro_ChucNang (mã chết, không nơi nào gọi).
   Khác gốc: chữ nút "Xóa vài trò" → "Xóa vai trò" (lỗi gõ); tiêu đề cột nút ở bảng xoá gốc ghi "Thêm" → "Xoá".
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, N = ums.cmsNd;
    var root = document.getElementById('cmsnd-nguoidungvaitro');
    if (!root) return;
    function e(v) { return N.e(v); }
    function esc(s) { return ui.esc(s); }

    var st = { uid: '', dsVaiTro: [], cuaND: [], vaiTro: '', loc: 'chua' };

    var m = pat.master({
        el: root,
        title: 'Người dùng - vai trò',
        side: { title: 'Danh sách người dùng', icon: 'fa-users', search: 'Nhập từ khóa tìm kiếm', page: { index: 1, size: 10, total: 0 } },
        main: { title: false }
    });

    m.mainBody.innerHTML = pat.panel({
        title: 'Người dùng:', icon: 'fa-user', count: 'ten',
        tools: ui.btn('del', { text: 'Xóa vai trò', attr: { 'data-a': 'xoaVT' } }) +
               ui.btn('add', { text: 'Thêm vai trò', attr: { 'data-a': 'themVT' } }),
        body:
            '<div class="ums-grid cmsnd-hai">' +
                '<div class="cmsnd-sub">' +
                    '<div class="cmsnd-sub__head"><b><i class="fa-light fa-circle-user"></i> Danh sách vai trò</b> <span class="ums-u-faint" data-z="vtN">(0)</span></div>' +
                    '<div data-z="vt">' + ui.empty('Chọn một người dùng ở cột trái', 'fa-hand-pointer') + '</div>' +
                '</div>' +
                '<div class="cmsnd-sub">' +
                    '<div data-z="ds">' +
                        '<div class="cmsnd-sub__head"><b><i class="fa-light fa-user-gear"></i> Danh sách chức năng</b> <span class="ums-u-faint" data-z="cnN">(0)</span></div>' +
                        '<div data-z="cn">' + ui.empty('Chọn một vai trò để xem chức năng', 'fa-hand-pointer') + '</div>' +
                    '</div>' +
                    '<div data-z="them" hidden>' +
                        '<div class="cmsnd-sub__head"><b><i class="fa-light fa-user-pen"></i> Thêm mới vai trò</b> <span class="ums-u-faint" data-z="tN">(0)</span>' +
                            '<span class="ums-u-flex1"></span>' + ui.btn('close', { attr: { 'data-a': 'dong' } }) + '</div>' +
                        '<div class="ums-u-mb-4" data-z="loc"></div>' +
                        '<div data-z="bThem"></div>' +
                    '</div>' +
                    '<div data-z="xoa" hidden>' +
                        '<div class="cmsnd-sub__head"><b><i class="fa-light fa-trash-can"></i> Xóa vai trò người dùng</b>' +
                            '<span class="ums-u-flex1"></span>' + ui.btn('close', { attr: { 'data-a': 'dong' } }) + '</div>' +
                        '<div data-z="bXoa"></div>' +
                    '</div>' +
                '</div>' +
            '</div>'
    });
    var P = m.mainBody;
    function z(k) { return P.querySelector('[data-z="' + k + '"]'); }
    var vung = 'ds';
    function hien(k) {
        if (k === vung) return;
        ui.swap(z(vung), z(k), { top: false });
        vung = k;
    }

    /* ---------- Vai trò toàn hệ thống (bảng "Thêm mới vai trò") ---------- */
    function napVaiTro() {
        ums.api.call({
            action: 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikXICgVMy4P', func: 'pkg_chung_quanlynguoidung.LayDanhSachVaiTro',
            type: 'POST', strLoaiVaiTro_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000, dTrangThai: 1, strChung_VaiTro_Cha_Id: ''
        }).then(function (r) {
            st.dsVaiTro = N.rows(r);
            z('tN').textContent = '(' + (Number(r.pager) || st.dsVaiTro.length) + ')';
            veThem();
        }).catch(function (err) { ums.api.handle(err, 'danh sách vai trò'); });
    }
    function daThem(id) { return st.cuaND.some(function (x) { return x.ID === id; }); }
    function veLoc() {
        z('loc').innerHTML = ui.chips([
            { key: 'tatca', label: 'Toàn bộ' }, { key: 'chua', label: 'Chưa thêm' }, { key: 'da', label: 'Đã thêm' }
        ], st.loc);
    }
    function veThem() {
        var ds = st.dsVaiTro.filter(function (r) {
            if (st.loc === 'tatca') return true;
            return st.loc === 'da' ? daThem(r.ID) : !daThem(r.ID);
        });
        ui.table({
            el: z('bThem'), rows: ds, empty: 'Không có vai trò nào',
            columns: [
                { title: 'Tên vai trò', prop: 'TENVAITRO' },
                { title: 'Thêm', cls: 'is-center is-actions', width: '90px', render: function (r) {
                    return daThem(r.ID)
                        ? ui.badge('Đã thêm', 'ok')
                        : '<button type="button" class="ums-iconbtn" data-them="' + esc(r.ID) + '" title="Thêm"><i class="fa-light fa-plus"></i></button>';
                } }
            ]
        });
    }

    /* ---------- Vai trò của người dùng ---------- */
    function napCuaND() {
        z('vt').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: 'CMS_QuanTri01_MH/DSA4BRIXICgVMy4PJjQuKAU0LyYP', func: 'PKG_CORE_QUANTRI_01.LayDSVaiTroNguoiDung',
            strChucNang_Id: '', strNguoiThucHien_Id: st.uid
        }).then(function (r) {
            st.cuaND = N.rows(r);
            veCuaND();
            veThem();
            veXoa();
        }).catch(function (err) {
            z('vt').innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'vai trò của người dùng');
        });
    }
    function veCuaND() {
        z('vtN').textContent = '(' + st.cuaND.length + ')';
        z('vt').innerHTML = st.cuaND.length ? '<div class="cmsnd-list">' + st.cuaND.map(function (r) {
            return pat.masterItem({ text: e(r.TENVAITRO), id: r.ID, active: r.ID === st.vaiTro });
        }).join('') + '</div>' : ui.empty('Người dùng chưa có vai trò nào');
    }
    function veXoa() {
        ui.table({
            el: z('bXoa'), rows: st.cuaND, empty: 'Người dùng chưa có vai trò nào',
            columns: [
                { title: 'Tên vai trò', prop: 'TENVAITRO' },
                { title: 'Xoá', cls: 'is-center is-actions', width: '90px', render: function (r) {
                    return '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-xoa="' + esc(r.ID) + '" title="Xoá"><i class="fa-light fa-trash-can"></i></button>';
                } }
            ]
        });
    }

    /* ---------- Chức năng của vai trò đang chọn ---------- */
    function veCN(ds) {
        z('cnN').textContent = '(' + ds.length + ')';
        ui.table({
            el: z('cn'), rows: ds, empty: st.vaiTro ? 'Vai trò chưa có chức năng nào' : 'Chọn một vai trò để xem chức năng',
            columns: [
                { title: 'Mã', prop: 'MACHUCNANG', cls: 'is-nowrap' },
                { title: 'Tên', prop: 'TENCHUCNANG' },
                { title: 'Ứng dụng', prop: 'CHUNG_UNGDUNG' },
                { title: 'Tình trạng', cls: 'is-center', render: function (r) {
                    return r.TRANGTHAI === 0 ? ui.badge('Not Active', 'warn') : ui.badge('Active', 'ok');
                } }
            ]
        });
    }
    function napCN() {
        var tok = napCN.tok = {};
        z('cn').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({
            action: 'CMS_QuanTri01_MH/DSA4BRICKTQiDyAvJg8mNC4oBTQvJgPP', func: 'PKG_CORE_QUANTRI_01.LayDSChucNangNguoiDung',
            strChucNang_Id: '', strVaiTro_Id: st.vaiTro, strNguoiThucHien_Id: st.uid
        }).then(function (r) {
            if (napCN.tok !== tok) return;
            veCN(N.rows(r));
        }).catch(function (err) {
            if (napCN.tok !== tok) return;
            z('cn').innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'chức năng của vai trò');
        });
    }

    /* ---------- Sự kiện ---------- */
    P.addEventListener('click', function (ev) {
        var t;
        if ((t = ev.target.closest('.cmsnd-list .ums-master__item'))) {
            st.vaiTro = t.getAttribute('data-id');
            N.qa(z('vt'), '.ums-master__item').forEach(function (x) { x.classList.toggle('is-active', x === t); });
            napCN();
            return;
        }
        if ((t = ev.target.closest('[data-chip]'))) {
            st.loc = t.getAttribute('data-chip');
            veLoc();
            veThem();
            return;
        }
        if ((t = ev.target.closest('[data-them]'))) {
            var vt = t.getAttribute('data-them');
            t.disabled = true;
            ums.api.call({
                action: 'CMS_QuanTri02_MH/FSkkLB4CLjMkHg8pIC8SNB4XICgVMy4P', func: 'PKG_CORE_QUANTRI_02.Them_Core_NhanSu_VaiTro',
                strCore_NhanSu_Id: st.uid, strVaiTro_Id: vt, strPhanLoaiNguonTao_Id: '', dLaVaiTroChinh: '', strNguonDuLieu_Id: '',
                strNgayHieuLuc: '', strNgayHetHieuLuc: '', strCoChePhatSinh_Id: '', dHieuLuc: '', strNguoiThucHien_Id: ums.session.userId
            }).then(function () {
                ui.toast('Thêm thành công!', 'ok');
                napCuaND();
            }).catch(function (err) { t.disabled = false; ums.api.handle(err, 'thêm vai trò'); });
            return;
        }
        if ((t = ev.target.closest('[data-xoa]'))) {
            var id = t.getAttribute('data-xoa');
            ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                if (!yes) return;
                ums.api.call({
                    action: 'CMS_QuanTri02_MH/GS4gHgIuMyQeDykgLxI0HhcgKBUzLgPP', func: 'PKG_CORE_QUANTRI_02.Xoa_Core_NhanSu_VaiTro',
                    strId: id, strNguoiThucHien_Id: ums.session.userId
                }).then(function () {
                    ui.toast('Xóa thành công!', 'ok');
                    if (id === st.vaiTro) { st.vaiTro = ''; veCN([]); }
                    napCuaND();
                }).catch(function (err) { ums.api.handle(err, 'xoá vai trò'); });
            });
            return;
        }
        var a = ev.target.closest('[data-a]');
        if (!a) return;
        var k = a.getAttribute('data-a');
        if (k === 'themVT') {
            if (!st.uid) { ui.toast('Vui lòng chọn người dùng cần phân quyền!', 'warn'); return; }
            hien('them');
        } else if (k === 'xoaVT') {
            if (!st.uid) { ui.toast('Vui lòng chọn người dùng cần xóa quyền!', 'warn'); return; }
            hien('xoa');
        } else if (k === 'dong') {
            hien('ds');
        }
    });

    var ds = N.dsNguoiDung(m, {
        goi: function (tk, page, size) {
            return { action: 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikPJjQuKAU0LyYP', func: 'pkg_chung_quanlynguoidung.LayDanhSachNguoiDung',
                     strTuKhoa: tk, strPhanLoaiDoiTuong: '', dTrangThai: 1, strChung_DonVi_Id: '', strVaiTro_Id: '',
                     strCapXuLy_Id: '', strTinhThanh_Id: '', pageIndex: page, pageSize: size };
        },
        onChon: function (r) {
            st.uid = r.ID;
            st.vaiTro = '';
            z('ten').textContent = e(r.TENDAYDU);
            veCN([]);
            napCuaND();
        },
        sau: napVaiTro
    });
    veLoc();
    veThem();
    veXoa();
    ds.nap(1);
})();
