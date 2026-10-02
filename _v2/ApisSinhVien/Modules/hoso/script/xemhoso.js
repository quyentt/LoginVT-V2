/* =========================================================================
   Xem hồ sơ sinh viên
   Bản gốc: ApisSinhVien/Modules/hoso/html/xemhoso.html + script/xemhoso.js
            (+ dexuathoso.js + zoneEditModal_inject.js — biểu mẫu "Chỉnh sửa - Hồ sơ đề xuất", ums.hsA.editor)
   ---------------------------------------------------------------------------
   xemhoso.js gốc là bản chép của hosodanhsach.js (cùng lớp HoSoDanhSach, cùng html hai cột, cùng
   #zeInlineHost): bấm sinh viên cũng mở CHÍNH biểu mẫu sửa 3 tab — dù tên màn là "Xem". Lệch nhau
   chỉ ở form cũ đã ẩn (readonlyselect2, thiếu địa chỉ / MST cơ quan) → dùng chung ums.hsA.manHaiCot
   với hoso_danhsach. Chi tiết lời gọi, phần bỏ, khác gốc: đầu tệp hoso_danhsach.js + _hsA.js.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('sv-xemhoso');
    if (!root) return;
    ums.hsA.manHaiCot({ el: root, title: 'Xem hồ sơ', loc: true, call: ums.hsA.callHoSo });
})();
