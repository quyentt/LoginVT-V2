/* =========================================================================
   kehoach/canhan — bản gốc KHÔNG có nội dung dùng được:
     · html gốc là trang mẫu tĩnh "Cá nhân cập nhật hồ sơ theo kế hoạch" (thông tin nhân viên, bảng quá trình
       đào tạo / bồi dưỡng, các hộp phạm vi áp dụng / quyền cập nhật) — mọi ô mang id chép từ màn Tài chính
       (txtDoDaiBienLai_BL ×12, txt_ma ×9, id="1" ×8), không ô nào có dữ liệu;
     · script gốc (canhan.js, lớp CaNhan) là bản chép màn phạm vi coi thi: gọi NS_KLGD_KeHoach_MH,
       XLHV_TP_PhanCong_SoTheoDoi_MH… và gắn vào #tblPhamViCoiThi, #dropSearch_ThoiGian… KHÔNG có trên trang;
       init đã chú thích mọi lời nạp → mở màn không gọi gì, không nút nào chạy.
   Chỉ vẽ khung báo chưa có nội dung, không gọi API (điểm cần quyết: gỡ khỏi menu hay dựng thật).
   ========================================================================= */
(function () {
    'use strict';
    var r = document.getElementById('ns-canhan');
    if (!r) return;
    r.innerHTML = ums.pat.page('Cá nhân') + ums.pat.panel({ title: 'Cá nhân cập nhật hồ sơ theo kế hoạch', icon: 'fa-user-pen',
        body: ums.ui.empty('Chức năng chưa có nội dung — bản gốc là trang mẫu tĩnh (ô nhập mang id chép từ màn Tài chính); mã đi kèm là bản chép màn phạm vi coi thi và không gắn được vào trang. Đang chờ nghiệp vụ mô tả.', 'fa-file-circle-question') });
})();
