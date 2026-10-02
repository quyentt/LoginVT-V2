/* Dữ liệu mẫu cho khaibaothanhphandiem — danh sách đặt chung ở thamsochung/script/_khaibao.demo.js
   (ums.demo.qldTP, cũng là nguồn ô "Thành phần điểm" của công thức điểm); ở đây chỉ thêm chi tiết. */
(function () {
    'use strict';
    ums.demo.add({
        'D_ThanhPhanDiem/LayChiTiet': function (o) {
            return (ums.demo.qldTP || []).filter(function (r) { return r.ID === o.strId; });
        }
    });
})();
