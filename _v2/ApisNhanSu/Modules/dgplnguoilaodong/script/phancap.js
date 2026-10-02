/* Phân cấp (NLD) — bản gốc: ApisNhanSu/Modules/dgplnguoilaodong/script/phancap.js (NS_PLDG_NLD_PhanCap/*). Gốc có nút con mắt (btnView) ở từng người đánh giá → eye: true.
   Khung chung: ums.nsDgpl.phanCap — ApisNhanSu/Modules/dgplnguoilaodong/script/_dgpl.js (lời gọi, lỗi gốc, khác gốc: xem đầu tệp đó). */
(function () {
    'use strict';
    var r = document.getElementById('dgpl-phancap');
    if (r) ums.nsDgpl.phanCap(r, { title: 'Phân cấp', formTitle: 'Phân cấp', eye: true });
})();
