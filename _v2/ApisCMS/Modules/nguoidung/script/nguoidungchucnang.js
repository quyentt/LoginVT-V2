/* =========================================================================
   Người dùng - chức năng (gán chức năng riêng cho người dùng, ngoài vai trò)
   Bản gốc: ApisCMS/Modules/nguoidung/html/nguoidungchucnang.html + script/nguoidungchucnang.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (HAI cột, giữ nguyên):
     trái  (col-sm-3) — tìm kiếm + "Danh sách người dùng" (ảnh, tên, email, nút xem)
     phải (col-sm-9) — "Người dùng <tên>" + nút "Chỉnh sửa quyền";
                       bên trong: col-3 "Danh sách ứng dụng" · col-9 hai vùng đổi chỗ:
                       "Danh sách chức năng" (bảng gộp theo ứng dụng) ↔ "Thêm Người dùng -
                       Chức năng" (Ứng dụng · Vai trò · Check All · Lưu · cây chức năng).
   Khung dùng chung: ums.cmsNd.dsNguoiDung + ums.cmsNd.quyen (script/_chung.js).

   Lời gọi (chép nguyên):
     CMS_QuanLyNguoiDung_MH · pkg_chung_quanlynguoidung.LayDanhSachNguoiDung
         = edu.extend.getList_NguoiDung (Corei/systemextend.js:2688): strTuKhoa, strPhanLoaiDoiTuong "",
           dTrangThai 1, strChung_DonVi_Id "", strVaiTro_Id "", strCapXuLy_Id "", strTinhThanh_Id "",
           pageIndex, pageSize (10)
     CMS_QuanLyNguoiDung_MH · pkg_chung_quanlynguoidung.LayDanhSachUngDung   strTuKhoa "", pageIndex 1,
           pageSize 1000, dTrangThai 1 — gọi lại sau MỖI lần nạp danh sách người dùng (như gốc)
     CMS_Quyen/LayDSChucNangTheoNguoiDung_Id (GET, type GET)  strNguoiDung_Id, strUngDung_Id "", strNgonNgu_Id ""
     CMS_QuanLyNguoiDung_MH · pkg_chung_quanlynguoidung.LayDanhSachChucNang  versionAPI v1.0, strTuKhoa "",
           strChung_UngDung_Id = ô Ứng dụng, strCha_Id "", pageIndex 1, pageSize 10000, strPhamViTruyCap_Id "", dTrangThai 1
     CMS_QuanLyNguoiDung/ThemNguoiDungChucNang  strId "", strChucNang_Id, strNguoiDung_Id, dHOATDONG_XEM/XOA/SUA/
           THEM/BAOCAO/KHAC = 1, strNguoiThucHien_Id, strUngDung_Id ""
     CMS_QuanLyNguoiDung/XoaChucNangTheoNguoiDung  strNguoiDung_Id, strUngDung_Id = ID CHỨC NĂNG (tên tham số
           gốc là strUngDung_Id nhưng giá trị là id chức năng — chép nguyên), strNguoiThucHien_Id

   Cố ý bỏ (mã chết trong gốc — không phần tử nào của html gọi tới):
     .btnDelete / toggle_delete, bảng tblChucNang_NDCN (+ nút thêm từng dòng), #btnDelete xoá nhiều ở
     tableNDCN, radio rdLoaiNguoiDung_ChucNang (đã chú thích trong html), checkExist / findChucNang.
   Khác gốc:
     · Cây chức năng: xem chú thích đầu _chung.js (đánh dấu con thì tự đánh dấu cha).
     · Ô "Vai trò" gốc có trên màn nhưng không nơi nào nạp → giữ ô, khoá.
     · Số đếm "Thêm Người dùng - Chức năng ( )" gốc để trống (genTable_ChucNang không được gọi) →
       hiện số chức năng của ứng dụng đang chọn.
     · Lưu: gốc bắn đồng loạt N lời gọi; ở đây chạy tuần tự có tiến độ (ums.ui.batch), xong nạp lại
       danh sách + cây như gốc.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, N = ums.cmsNd;
    var root = document.getElementById('cmsnd-nguoidungchucnang');
    if (!root) return;

    var m = pat.master({
        el: root,
        title: 'Người dùng - chức năng',
        side: { title: 'Danh sách người dùng', icon: 'fa-users', search: 'Nhập từ khóa tìm kiếm', page: { index: 1, size: 10, total: 0 } },
        main: { title: false }
    });

    var q = N.quyen(m.mainBody, {
        hauTo: 'NDCN',
        goiDsCN: function (uid) {
            return { action: 'CMS_Quyen/LayDSChucNangTheoNguoiDung_Id', method: 'GET', type: 'GET',
                     strNguoiDung_Id: uid, strUngDung_Id: '', strNgonNgu_Id: '' };
        },
        goiCay: function (app) {
            return { action: 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikCKTQiDyAvJgPP', func: 'pkg_chung_quanlynguoidung.LayDanhSachChucNang',
                     versionAPI: 'v1.0', strTuKhoa: '', strChung_UngDung_Id: app, strCha_Id: '',
                     pageIndex: 1, pageSize: 10000, strPhamViTruyCap_Id: '', dTrangThai: 1 };
        },
        them: function (uid, cn) {
            return { action: 'CMS_QuanLyNguoiDung/ThemNguoiDungChucNang', strId: '', strChucNang_Id: cn, strNguoiDung_Id: uid,
                     dHOATDONG_XEM: 1, dHOATDONG_XOA: 1, dHOATDONG_SUA: 1, dHOATDONG_THEM: 1, dHOATDONG_BAOCAO: 1, dHOATDONG_KHAC: 1,
                     strNguoiThucHien_Id: ums.session.userId, strUngDung_Id: '' };
        },
        xoa: function (uid, cn) {
            return { action: 'CMS_QuanLyNguoiDung/XoaChucNangTheoNguoiDung', strNguoiDung_Id: uid, strUngDung_Id: cn,
                     strNguoiThucHien_Id: ums.session.userId };
        }
    });

    function napUngDung() {
        ums.api.call({
            action: 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikULyYFNC8m', func: 'pkg_chung_quanlynguoidung.LayDanhSachUngDung',
            strTuKhoa: '', pageIndex: 1, pageSize: 1000, dTrangThai: 1
        }).then(function (r) { q.datUngDung(N.rows(r)); })
          .catch(function (err) { ums.api.handle(err, 'danh sách ứng dụng'); });
    }

    var ds = N.dsNguoiDung(m, {
        goi: function (tk, page, size) {
            return { action: 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikPJjQuKAU0LyYP', func: 'pkg_chung_quanlynguoidung.LayDanhSachNguoiDung',
                     strTuKhoa: tk, strPhanLoaiDoiTuong: '', dTrangThai: 1, strChung_DonVi_Id: '', strVaiTro_Id: '',
                     strCapXuLy_Id: '', strTinhThanh_Id: '', pageIndex: page, pageSize: size };
        },
        onChon: function (r) { q.chonNguoiDung(r); },
        sau: napUngDung
    });
    ds.nap(1);
})();
