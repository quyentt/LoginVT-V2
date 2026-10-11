/* =========================================================================
   Chưa có hợp đồng / Tạo và in hợp đồng (menu host gắn ở hai chỗ, cùng tệp)
   Bản gốc: ApisKyTucXa/Modules/hopdong/html/chuacohopdong.html + script/chuacohopdong.js
   Toàn bộ cách dựng, lời gọi, ghi chú "Giữ như gốc / Khác gốc / Cố ý bỏ" ở khung chung
   _hopdong.js (ums.ktxHopDong.mount) — màn này là bản daCo: false:
     · danh sách KTX_DaXepPhong/LayDanhSach với dDaLapHopDong 0
     · lưu = KTX_HopDong/ThemMoi, xong giấu Lưu, hiện hai nút In (gốc swithInHopDong)
     · Tòa nhà → Phòng đăng ký là ô chọn (gốc dropHopDong_ToaNha / dropHopDong_Phong)
   ========================================================================= */
(function () {
    'use strict';
    ums.ktxHopDong.mount(document.getElementById('ktx-chuacohopdong'), { daCo: false, title: 'Tạo và in hợp đồng' });
})();
