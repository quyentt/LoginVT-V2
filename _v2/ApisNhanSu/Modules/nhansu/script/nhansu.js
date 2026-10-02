/* =========================================================================
   nhansu/nhansu — bản gốc KHÔNG có nội dung chạy được:
     · html gốc (3.858 dòng) là TRANG MẪU tĩnh của màn tuyển dụng: 4 tab "Kế hoạch tuyển dụng", "Các đợt tuyển dụng",
       "Đề xuất của các đơn vị theo đợt", "Thông tin hội đồng" với dữ liệu viết cứng, phân trang giả;
     · thẻ nạp modules/nhansu/script/kehoach.js ở cuối html đã bị chú thích → không một lời gọi máy chủ nào.
   Nội dung đó đã chạy thật ở màn "Kế hoạch nhân sự" (nhansu/kehoach — Kế hoạch → Đợt → Đề xuất / Hội đồng).
   Chỉ vẽ khung giải thích + nút mở màn đó (ums.app.openPath), không gọi API.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var r = document.getElementById('ns-nhansu');
    if (!r) return;
    r.innerHTML = pat.page('Nhân sự') + pat.panel({
        title: 'Tuyển dụng', icon: 'fa-user-plus',
        tools: ui.btn('view', { text: 'Mở Kế hoạch nhân sự', icon: 'fa-eye', attr: { 'data-a': 'mo' } }),
        body: ui.empty('Chức năng này chưa có nội dung — bản gốc là trang mẫu tĩnh (dữ liệu viết cứng, không gọi máy chủ) của màn tuyển dụng. ' +
            'Kế hoạch, các đợt, đề xuất của đơn vị và hội đồng tuyển dụng làm ở màn "Kế hoạch nhân sự".', 'fa-file-circle-question')
    });
    r.addEventListener('click', function (e) {
        if (e.target.closest('[data-a="mo"]')) ums.app.openPath('/Modules/nhansu/html/kehoach.html');
    });
})();
