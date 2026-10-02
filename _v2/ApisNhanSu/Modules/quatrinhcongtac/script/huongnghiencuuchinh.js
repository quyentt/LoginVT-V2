/* =========================================================================
   Hướng nghiên cứu chính — bản QUẢN TRỊ (Nhân sự)  (CHƯA DÙNG ĐƯỢC — chờ API)
   Bản gốc: ApisNhanSu/Modules/quatrinhcongtac/html/huongnghiencuuchinh.html
            + script/huongnghiencuuchinh.js (0 BYTE)
   ---------------------------------------------------------------------------
   html gốc có đủ khuôn hai cột (danh sách cán bộ; khung "Tóm tắt hướng nghiên
   cứu chính": bảng Stt · Hướng nghiên cứu chính · Sửa · Xóa, nút Thêm mới / Tải
   lại; biểu mẫu một ô textarea "Hướng nghiên cứu chính") nhưng tệp .js RỖNG —
   `new HuongNghienCuuChinh()` ném ReferenceError, cả danh sách cán bộ cũng không
   nạp. Bản Cổng cán bộ cùng tên thì gọi nhầm NS_QT_KhamSucKhoe (đã để khung khoá).

   Ở đây: danh sách cán bộ chạy như các màn cùng nhóm (ums.nsQT); bấm một cán bộ
   thì hiện khung "Tóm tắt hướng nghiên cứu chính" với nút Thêm mới / Tải lại
   KHOÁ và lời nhắc — chưa có controller/procedure cho hướng nghiên cứu. Khi có
   API, thay bằng ums.nsQT.crud(host, { … một ô textarea strHuongNghienCuuChinh … }).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat;

    ums.nsQT.man({
        el: document.getElementById('ns_huongnghiencuuchinh'),
        title: 'Hướng nghiên cứu chính',
        mo: function (host) {
            host.innerHTML = pat.panel({
                title: 'Tóm tắt hướng nghiên cứu chính', icon: 'fa-magnifying-glass-chart',
                tools: '<button type="button" class="ums-iconbtn" disabled title="Tải lại"><i class="fa-light fa-rotate-right"></i></button>' +
                    ui.btn('add', { attr: { disabled: 'disabled', title: 'Chưa có API cho hướng nghiên cứu' } }),
                body: ui.empty('Chức năng chưa dùng được: bản gốc chưa có mã xử lý (tệp .js rỗng). ' +
                    'Cần xác định API lưu hướng nghiên cứu chính.', 'fa-screwdriver-wrench')
            });
        }
    });
})();
