/* =========================================================================
   Cán bộ - chức năng (người quản lý gán chức năng cho cán bộ mình phụ trách)
   Bản gốc: ApisCMS/Modules/nguoidung/html/canbochucnang.html + script/canbochucnang.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (HAI cột, giữ nguyên):
     trái  (col-sm-3) — ô "Chọn ứng dụng" + tìm kiếm; "Danh sách người dùng" (ảnh, tên, email,
                       nút xoá phân công); chân khung: "Thêm cán bộ"
     phải (col-sm-9) — y hệt nguoidungchucnang (danh sách ứng dụng · bảng chức năng ↔ khung
                       "Thêm Người dùng - Chức năng" với cây chức năng).
   Khung dùng chung: ums.cmsNd.dsNguoiDung + ums.cmsNd.quyen (script/_chung.js),
   hộp chọn nhân sự ums.pat.pickNhanSu (= edu.extend.genModal_NhanSu).

   Lời gọi (chép nguyên):
     CMS_QuanLyNguoiDung2_MH · pkg_chung_quanlynguoidung2.LayDanhSachNguoiDungQuanLy
         strTuKhoa, strUngDung_Id = ô "Chọn ứng dụng" (trái), strNguoiThucHien_Id = người đăng nhập, pageIndex, pageSize (10)
     CMS_Quyen_MH · pkg_chung_laythongtinquyen.LayDSUngDungTheoNguoiDung_Id
         strNguoiDung_Id = người đăng nhập, strNgonNgu_Id "", strVeVaoCua ""
     CMS_QuanLyNguoiDung_MH · pkg_chung_quanlynguoidung.LayDanhSachUngDung   strTuKhoa "", pageIndex 1, pageSize 1000, dTrangThai 1
     CMS_Quyen/LayDSChucNangTheoNguoiDung_Id (GET, type GET)  strNguoiDung_Id, strUngDung_Id "", strNgonNgu_Id ""
     CMS_QuanLyNguoiDung_MH · pkg_chung_quanlynguoidung.LayDanhSachChucNang  strTuKhoa "", dTrangThai 1,
         strChucNangCha_Id "", strNguonTruyCap_Id "", strChung_UngDung_Id = ô Ứng dụng (khung Thêm),
         strNguoiDung_Id = NGƯỜI ĐĂNG NHẬP (chỉ thấy chức năng mình có), pageIndex 1, pageSize 10000
     CMS_NguoiDungChucNang/ThemMoi  strId "", strChucNang_Id, strNguoiDung_Id, dHOATDONG_* = 1, strNguoiThucHien_Id, strUngDung_Id ""
     CMS_NguoiDungChucNang/XoaChucNangTheoNguoiDung  strNguoiDung_Id, strUngDung_Id = ID CHỨC NĂNG (chép nguyên), strNguoiThucHien_Id
     CMS_QuanLyNguoiDung2_MH · pkg_chung_quanlynguoidung2.Them_Chung_NguoiDung_QuanLy
         strNguoiDung_Id = nhân sự chọn, strNguoiDungQuanLy_Id = người đăng nhập, strUngDung_Id = ô "Chọn ứng dụng", strNguoiThucHien_Id
     CMS_QuanLyNguoiDung2_MH · pkg_chung_quanlynguoidung2.Xoa_Chung_NguoiDung_QuanLy1
         strNguoiDung_Id = dòng, strNguoiDungQuanLy_Id = người đăng nhập, strUngDung_Id = ô "Chọn ứng dụng", strNguoiThucHien_Id
         (gốc khai obj Xoa_Chung_NguoiDung_QuanLy trước rồi GHI ĐÈ bằng bản …QuanLy1 — chỉ bản sau được gửi)

   Giữ như gốc / cần lưu ý:
     · Gốc nạp danh sách ứng dụng bằng HAI lời gọi chạy song song, cả hai cùng đổ vào HAI ô chọn — bên
       nào về sau thắng. Ở đây tách theo ý định hàm getList_UngDungQuyen của gốc: ô "Chọn ứng dụng" bên trái
       (lọc cán bộ, gắn phân công) = LayDSUngDungTheoNguoiDung_Id (theo quyền người đăng nhập); ô Ứng dụng
       trong khung Thêm + tên ứng dụng của bảng = LayDanhSachUngDung (toàn bộ).
     · "Thêm cán bộ" gửi strUngDung_Id theo ô "Chọn ứng dụng" kể cả khi ô trống (gốc không kiểm).
   Cố ý bỏ: #btnDelete_PhanCong / tblPhanCong (không có trên html), .btnDelete, tblChucNang_CBCN, radio lọc
     (đã chú thích), popover (gốc đã chú thích).
   Khác gốc: cây chức năng (xem _chung.js); Lưu / gắn phân công chạy tuần tự có tiến độ (ums.ui.batch);
     xoá phân công hỏi lại rồi mới gửi (như gốc) và bấm thùng rác KHÔNG chọn luôn dòng đó (gốc nút nằm
     trong dòng nên bấm xoá cũng mở người đó bên phải).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, N = ums.cmsNd;
    var root = document.getElementById('cmsnd-canbochucnang');
    if (!root) return;

    function uid() { return ums.session.userId; }

    var m = pat.master({
        el: root,
        title: 'Cán bộ - chức năng',
        side: {
            title: 'Danh sách người dùng', icon: 'fa-users', search: 'Nhập từ khóa tìm kiếm',
            filter: '<select class="ums-select" data-f="udLoc" data-ph="-- Chọn ứng dụng --"><option value=""></option></select>',
            footer: '', page: { index: 1, size: 10, total: 0 }
        },
        main: { title: false }
    });
    var udLoc = root.querySelector('[data-f="udLoc"]');
    /* "Thêm cán bộ" — gốc đặt ở chân khung danh sách người dùng */
    m.side.querySelector('.ums-panel').insertAdjacentHTML('beforeend',
        '<div class="ums-panel__foot">' + ui.btn('add', { text: 'Thêm cán bộ', mod: 'out-success', attr: { 'data-a': 'themCB' } }) + '</div>');
    ui.enhance(m.side);

    var cbDang = null;       // cán bộ đang chọn — nút "Xoá cán bộ" trên tiêu đề khung phải xoá người này
    var q = N.quyen(m.mainBody, {
        nutTruoc: ui.btn('del', { text: 'Xoá cán bộ', attr: { 'data-a': 'xoaCB' } }),
        hauTo: 'CBCN',
        goiDsCN: function (id) {
            return { action: 'CMS_Quyen/LayDSChucNangTheoNguoiDung_Id', method: 'GET', type: 'GET',
                     strNguoiDung_Id: id, strUngDung_Id: '', strNgonNgu_Id: '' };
        },
        goiCay: function (app) {
            return { action: 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikCKTQiDyAvJgPP', func: 'pkg_chung_quanlynguoidung.LayDanhSachChucNang',
                     strTuKhoa: '', dTrangThai: 1, strChucNangCha_Id: '', strNguonTruyCap_Id: '', strChung_UngDung_Id: app,
                     strNguoiDung_Id: uid(), pageIndex: 1, pageSize: 10000 };
        },
        them: function (id, cn) {
            return { action: 'CMS_NguoiDungChucNang/ThemMoi', strId: '', strChucNang_Id: cn, strNguoiDung_Id: id,
                     dHOATDONG_XEM: 1, dHOATDONG_XOA: 1, dHOATDONG_SUA: 1, dHOATDONG_THEM: 1, dHOATDONG_BAOCAO: 1, dHOATDONG_KHAC: 1,
                     strNguoiThucHien_Id: uid(), strUngDung_Id: '' };
        },
        xoa: function (id, cn) {
            return { action: 'CMS_NguoiDungChucNang/XoaChucNangTheoNguoiDung', strNguoiDung_Id: id, strUngDung_Id: cn,
                     strNguoiThucHien_Id: uid() };
        }
    });

    /* --- Ứng dụng (xem chú thích đầu tệp về hai lời gọi) --- */
    ums.api.call({
        action: 'CMS_Quyen_MH/DSA4BRIULyYFNC8mFSkkLg8mNC4oBTQvJh4IJQPP', func: 'pkg_chung_laythongtinquyen.LayDSUngDungTheoNguoiDung_Id',
        strNguoiDung_Id: uid(), strNgonNgu_Id: '', strVeVaoCua: ''
    }).then(function (r) { pat.fill(udLoc, N.rows(r), { name: 'TENUNGDUNG', head: '-- Chọn ứng dụng --' }); })
      .catch(function (err) { ums.api.handle(err, 'ứng dụng theo quyền'); });
    ums.api.call({
        action: 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikULyYFNC8m', func: 'pkg_chung_quanlynguoidung.LayDanhSachUngDung',
        strTuKhoa: '', pageIndex: 1, pageSize: 1000, dTrangThai: 1
    }).then(function (r) { q.datUngDung(N.rows(r)); })
      .catch(function (err) { ums.api.handle(err, 'danh sách ứng dụng'); });

    /* --- Danh sách cán bộ do người đăng nhập quản lý --- */
    var ds = N.dsNguoiDung(m, {
        tuTaiLoc: false,                 // ô ứng dụng đã tự nạp lại (select2:select bên dưới)
        hover: false,
        goi: function (tk, page, size) {
            return { action: 'CMS_QuanLyNguoiDung2_MH/DSA4BSAvKRIgIikPJjQuKAU0LyYQNCAvDTgP', func: 'pkg_chung_quanlynguoidung2.LayDanhSachNguoiDungQuanLy',
                     strTuKhoa: tk, strUngDung_Id: udLoc.value, strNguoiThucHien_Id: uid(), pageIndex: page, pageSize: size };
        },
        onChon: function (r) { cbDang = r; q.chonNguoiDung(r); }
    });
    /* Xoá cán bộ khỏi danh sách quản lý: trước đây là thùng rác trên từng mục danh sách → nay nút "Xoá cán bộ"
       trên tiêu đề khung phải, xoá người ĐANG CHỌN (người dùng 2026-09-26: bỏ nút trong danh sách) */
    function xoaCB(r) {
        if (!r) { ui.toast('Chọn một cán bộ ở danh sách bên trái', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({
                action: 'CMS_QuanLyNguoiDung2_MH/GS4gHgIpNC8mHg8mNC4oBTQvJh4QNCAvDThw', func: 'pkg_chung_quanlynguoidung2.Xoa_Chung_NguoiDung_QuanLy1',
                strNguoiDung_Id: r.ID, strNguoiDungQuanLy_Id: uid(), strUngDung_Id: udLoc.value, strNguoiThucHien_Id: uid()
            }).then(function () { ui.toast('Xóa thành công', 'ok'); cbDang = null; ds.nap(); })
              .catch(function (err) { ums.api.handle(err, 'xoá cán bộ'); });
        });
    }
    m.mainBody.addEventListener('click', function (ev) { if (ev.target.closest('[data-a="xoaCB"]')) xoaCB(cbDang); });

    jQuery(udLoc).on('select2:select select2:clear', function () { ds.nap(1); });

    m.side.addEventListener('click', function (ev) {
        if (!ev.target.closest('[data-a="themCB"]')) return;
        pat.pickNhanSu({
            title: 'Tìm kiếm cán bộ',
            onPick: function (list) {
                var app = udLoc.value;
                ui.batch(list.map(function (ns) {
                    return { action: 'CMS_QuanLyNguoiDung2_MH/FSkkLB4CKTQvJh4PJjQuKAU0LyYeEDQgLw04', func: 'pkg_chung_quanlynguoidung2.Them_Chung_NguoiDung_QuanLy',
                             strNguoiDung_Id: ns.ID, strNguoiDungQuanLy_Id: uid(), strUngDung_Id: app, strNguoiThucHien_Id: uid() };
                }), { title: 'Đang thêm cán bộ', okText: 'Thực hiện thành công' }).then(function () { ds.nap(); });
            }
        });
    });

    ds.nap(1);
})();
