/* Tra cứu - tương tác nhẹ (không phụ thuộc thư viện) */
(function () {
  'use strict';

  // Tab: Thông tin tài chính / Xuất hóa đơn
  var tabs = document.querySelectorAll('.aps-tc-tab');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('is-active'); });
      tab.classList.add('is-active');
    });
  });

  // "Chọn tất cả" đồng bộ với các checkbox trong bảng
  var all = document.getElementById('aps-tc-all');
  var rows = document.querySelectorAll('.aps-tc-table .aps-tc-check');
  if (all) {
    all.addEventListener('change', function () {
      rows.forEach(function (cb) { cb.checked = all.checked; });
    });
    rows.forEach(function (cb) {
      cb.addEventListener('change', function () {
        all.checked = Array.prototype.every.call(rows, function (r) { return r.checked; });
      });
    });
  }
})();
