/* =========================================================================
   Cơ cấu tổ chức (ApisNhanSu)
   Bản gốc: ApisNhanSu/Modules/cocautochuc/html/cocautochuc.html + script/cocautochuc.js
   Khung: script/_cctc.js (ums.nsCctc.man) — dùng chung với cocautochucngoaitruong.
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không func / iM — chép nguyên):
     NS_CoCauToChuc/LayDanhSach   GET  dTrangThai 1, strLoaiCoCauToChuc_Id (ô Loại), strCoCauToChucCha_Id ''
     NS_CoCauToChuc/ThemMoi       POST strTen, strMa, strDaoTao_Loai_Id, dThuTu 1, dTrangThai 1,
                                       strDaoTao_CoCau_Cha_Id, strGhiChu, strNguoiThucHien_Id, strId ''
     NS_CoCauToChuc/CapNhat       POST như trên, strId = đơn vị đang sửa
     NS_HoSo_V2/Xoa_DaoTao_CoCauToChuc  POST strId, strNguoiThucHien_Id
     Danh mục NS.LCTC (ô Loại lọc + ô Loại biểu mẫu)
   Cột: ID, TEN, MA, DAOTAO_LOAICOCAUTOCHUC(_ID), DAOTAO_COCAUTOCHUC_CHA(_ID), GHICHU.
   Khác gốc (lỗi rõ):
     · "Lưu và nhập tiếp" gốc gọi lưu (bất đồng bộ) rồi xoá trắng NGAY → khi đang sửa thì strId bị xoá
       trước khi lời gọi đi. Nay lưu xong mới xoá trắng.
     · Lưu (thêm mới) gốc ở lại biểu mẫu với strId rỗng → bấm Lưu lần nữa là thêm TRÙNG. Nay lưu xong về
       khung Chi tiết / lời nhắc, cây nạp lại.
     · arrValid_CCTC (Tên, Mã, Loại bắt buộc) gốc khai mà không gọi → nay kiểm trước khi lưu.
     · Xoá gốc hỏi bằng confirm + $("#btnYes") gắn thêm trình xử lý mỗi lần bấm → nay ums.ui.confirm.
     · Mỗi lần nạp cây gốc gắn thêm một trình xử lý select_node — không chép.
   Ô cha → con: không có (ô Loại chỉ lọc cây; "Thuộc cơ cấu" lấy theo cây đang hiện).
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('ns-cocautochuc');
    if (!root || !ums.nsCctc) return;
    ums.nsCctc.man(root, {
        tieuDe: 'Cơ cấu tổ chức',
        ctl: 'NS_CoCauToChuc',
        xoa: 'NS_HoSo_V2/Xoa_DaoTao_CoCauToChuc',
        nut3: 'luutiep',
        dsThamSo: function (loai) {
            return { dTrangThai: 1, strLoaiCoCauToChuc_Id: loai, strCoCauToChucCha_Id: '' };
        },
        luuThamSo: function (v, id) {
            return {
                strTen: v.ten, strMa: v.ma, strDaoTao_Loai_Id: v.loai, dThuTu: 1, dTrangThai: 1,
                strDaoTao_CoCau_Cha_Id: v.cha, strGhiChu: v.ghichu, strNguoiThucHien_Id: '', strId: id
            };
        }
    });
})();
