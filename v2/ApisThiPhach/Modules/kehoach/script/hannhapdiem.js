/* hannhapdiem — "Nhập hạn nhập điểm". Khung chung: _tp_duyet.js (ums.tpDuyet), cờ kieu 'han'.
   Bản gốc: ApisThiPhach/Modules/kehoach/html/hannhapdiem.html + script/duyetdulieuthi.js (html gốc nạp CHÍNH tệp của
   màn "Cập nhật đủ điều kiện dự thi"). Màn này chỉ có: lọc Thời gian → Kế hoạch → Học phần, bảng lớp học phần với ô
   Hạn nộp, nút "Cập nhật hạn nộp điểm", và "Xem" danh sách người học theo thành phần điểm.
   Lời gọi, lỗi gốc đã sửa và điểm giữ như gốc: xem đầu tệp _tp_duyet.js. */
(function () {
    'use strict';
    ums.tpDuyet.man(document.getElementById('tp-hannhapdiem'), { kieu: 'han', tieuDe: 'Nhập hạn nhập điểm' });
})();
