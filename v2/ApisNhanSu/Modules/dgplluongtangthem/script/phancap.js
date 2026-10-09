/* Phân cấp đánh giá (lương tăng thêm) — bản gốc: ApisNhanSu/Modules/dgplluongtangthem/script/phancap.js (NS_PLDG_LTT_PhanCap/*; bấm dòng = xem, không có nút con mắt).
   Khung chung: ums.nsDgpl.phanCap — ApisNhanSu/Modules/dgplnguoilaodong/script/_dgpl.js (lời gọi, lỗi gốc, khác gốc: xem đầu tệp đó). */
(function () {
    'use strict';
    var r = document.getElementById('dgpl-ltt-phancap');
    if (r) ums.nsDgpl.phanCap(r, { ltt: true, title: 'Phân cấp', formTitle: 'Phân cấp đánh giá' });
})();
