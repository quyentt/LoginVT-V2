/* =========================================================================
   tinhdiem/inbangdiem — bản gốc KHÔNG có nội dung dùng được:
     · html gốc là trang mẫu tĩnh (hai bảng cố định cột với chữ "Normal Header", "Info Long"…, không id nào);
     · script gốc là bản chép CŨ của tonghopketqua.js (hàng đợi "TONGHOPKETQUA", D_TinhDiem/TinhDiem_TuDong_KetQua…)
       gắn vào các ô #dropHeDaoTao, #btnTongHopKetQua… KHÔNG có trên trang → không nút nào chạy;
       endHangDoi còn đọc main_doc.TongHopKetQua (không tồn tại trên trang này).
   Chỉ vẽ khung báo chưa có nội dung, không gọi API. Việc "tổng hợp kết quả" thật nằm ở tinhdiem/tonghopketqua.
   ========================================================================= */
(function () {
    'use strict';
    var r = document.getElementById('qld-tinhdiem-inbangdiem');
    if (!r) return;
    r.innerHTML = ums.pat.page('In bảng điểm') + ums.pat.panel({ title: 'In bảng điểm', icon: 'fa-print',
        body: ums.ui.empty('Chức năng chưa có nội dung — bản gốc là trang mẫu tĩnh (bảng thử cột cố định); mã đi kèm là bản chép cũ của màn "Tổng hợp kết quả" và không gắn được vào trang. Đang chờ nghiệp vụ mô tả.', 'fa-file-circle-question') });
})();
