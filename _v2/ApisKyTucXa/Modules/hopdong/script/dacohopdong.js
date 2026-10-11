/* =========================================================================
   Đã có hợp đồng
   Bản gốc: ApisKyTucXa/Modules/hopdong/html/dacohopdong.html + script/dacohopdong.js
   Toàn bộ cách dựng, lời gọi, ghi chú "Giữ như gốc / Khác gốc / Cố ý bỏ" ở khung chung
   _hopdong.js (ums.ktxHopDong.mount) — màn này là bản daCo: true:
     · thêm ô lọc Tình trạng (KTX.TTHD → strTinhTrangHopDong_Id), danh sách dDaLapHopDong 1
     · chọn người → KTX_HopDong/LayChiTiet đổ biểu mẫu; Tòa nhà / Phòng đăng ký chỉ hiện (gốc lblHopDong_ToaNha / _Phong)
     · lưu = KTX_HopDong/CapNhat; Hủy hợp đồng = KTX_HopDong/Xoa; hai nút In hiện sẵn
   Cố ý bỏ: dòng mẫu cứng trong bảng miễn giảm của HTML gốc (txtMG_NoiDungMienGiam, txtMG_PhanTramMienGiam,
   dropMG_HinhThucMienGiam — JS không đọc).
   ========================================================================= */
(function () {
    'use strict';
    ums.ktxHopDong.mount(document.getElementById('ktx-dacohopdong'), { daCo: true, title: 'Đã có hợp đồng' });
})();
