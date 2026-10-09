/* =========================================================================
   Cơ cấu tổ chức ngoài trường (ApisNhanSu)
   Bản gốc: ApisNhanSu/Modules/cocautochuc/html/cocautochucngoaitruong.html + script/cocautochucngoaitruong.js
   Khung: script/_cctc.js (ums.nsCctc.man) — dùng chung với cocautochuc.
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không func / iM — chép nguyên):
     NS_CoCauToChucNgoai/LayDanhSach  GET  iTrangThai 1, strLoaiCoCauToChuc_Id (ô Loại), strCoCauToChucCha_Id ''
     NS_CoCauToChucNgoai/ThemMoi      POST strTen, strMa, strDaoTao_Loai_Id, strDaoTao_CoCau_Cha_Id, iThuTu 1,
                                           iTrangThai 1, strGhiChu, strThongTinNguoiDungDau, strFax, strWebSite, strId ''
     NS_CoCauToChucNgoai/CapNhat      POST như trên, strId = đơn vị đang sửa
     NS_CoCauToChucNgoai/Xoa          POST strId, strNguoiThucHien_Id
     Danh mục NS.LCTC.
   Giữ như gốc (nghi ngờ, ghi báo cáo): strThongTinNguoiDungDau, strFax, strWebSite đều gửi giá trị ô
     GHI CHÚ (gốc chép nhầm id ô — biểu mẫu không có ba ô đó).
   Khác gốc (lỗi rõ):
     · Nút "Viết lại" gốc mang id btnRefresh_CCTC mà trình xử lý gắn vào btnRewrite_CCTC → bấm không có gì.
       Nay xoá trắng biểu mẫu (đúng tên nút).
     · Lưu (thêm mới) gốc ở lại biểu mẫu với strId rỗng → bấm Lưu lần nữa là thêm TRÙNG. Nay về khung Chi tiết.
     · arrValid_CCTC (Tên, Mã, Loại) gốc không gọi → nay kiểm trước khi lưu.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('ns-cocautochucngoaitruong');
    if (!root || !ums.nsCctc) return;
    ums.nsCctc.man(root, {
        tieuDe: 'Cơ cấu tổ chức ngoài trường',
        ctl: 'NS_CoCauToChucNgoai',
        xoa: 'NS_CoCauToChucNgoai/Xoa',
        nut3: 'vietlai',
        dsThamSo: function (loai) {
            return { iTrangThai: 1, strLoaiCoCauToChuc_Id: loai, strCoCauToChucCha_Id: '' };
        },
        luuThamSo: function (v, id) {
            return {
                strTen: v.ten, strMa: v.ma, strDaoTao_Loai_Id: v.loai, strDaoTao_CoCau_Cha_Id: v.cha,
                iThuTu: 1, iTrangThai: 1, strGhiChu: v.ghichu,
                strThongTinNguoiDungDau: v.ghichu, strFax: v.ghichu, strWebSite: v.ghichu,   // như gốc (đọc ô Ghi chú)
                strId: id
            };
        }
    });
})();
