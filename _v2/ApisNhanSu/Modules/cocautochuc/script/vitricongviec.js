/* =========================================================================
   Vị trí công việc (ApisNhanSu)
   Bản gốc: ApisNhanSu/Modules/cocautochuc/html/vitricongviec.html + script/vitricongviec.js
   Khung: script/_vitri.js (ums.nsViTri.man) — lời gọi, cột, bố cục ghi ở đầu tệp đó.
   ---------------------------------------------------------------------------
   Riêng màn này: bảng vị trí có cột "Sửa" (mở biểu mẫu vị trí), không có cột "Vai trò".
   Khác gốc (ghi báo cáo):
     · Cây: gốc đổi dữ liệu sang {ID, NAME, PARENT_ORG_ID = item.PARENT} — cột PARENT không có trong kết quả
       NS_CoCauToChuc/LayDanhSach nên cây gốc thành một tầng phẳng. Nay lồng theo DAOTAO_COCAUTOCHUC_CHA_ID như
       các màn anh em (cocautochuc, vaitrovitri).
     · Ô Từ khoá: gốc gợi ý tự động (LayDSCore_Org_Unit, 10 mục) rồi chọn gợi ý chỉ điền chữ và nạp lại cây — từ
       khoá KHÔNG gửi vào LayDanhSach nên không lọc được gì. Nay gõ là lọc cây tại chỗ (như cocautochucv2), Enter /
       Tìm kiếm nạp lại; bỏ khung gợi ý.
     · "Xem cấu trúc tại ngày" không gửi vào LayDanhSach (như gốc) — giữ ô.
     · Lưu vị trí xong gốc ở lại hộp biểu mẫu (bấm lại là thêm TRÙNG) → nay về bảng vị trí.
     · Nút "Thêm đơn vị hành chính" bị chú thích bỏ ở html gốc → không vẽ.
   Ô cha → con: không có.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('ns-vitricongviec');
    if (!root || !ums.nsViTri) return;
    ums.nsViTri.man(root, { tieuDe: 'Vị trí công việc', vaiTro: false });
})();
