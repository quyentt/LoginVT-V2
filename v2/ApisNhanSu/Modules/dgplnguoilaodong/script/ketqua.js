/* =========================================================================
   Kết quả phân loại đánh giá công chức & người lao động
   Bản gốc: ApisNhanSu/Modules/dgplnguoilaodong/html/ketqua.html
            (+ script/ketqua.js — KHÔNG được html nạp; html nạp modules/baocao/script/chatluongnhanluc.js)
   ---------------------------------------------------------------------------
   Bố cục gốc MỘT cột: tiêu đề giữa trang, ghi chú, ô "Loại cán bộ" (NS.LHD0)
   + "Tìm kiếm", bảng 10 cột: Stt · Họ tên · Chức vụ/Chức danh · Tự phân loại ·
   [Kết quả phân loại của trưởng đơn vị: 4 mức] · Ghi chú. Nút "Xuất excel" gốc
   đã bị chú thích bỏ.

   BẢN GỐC KHÔNG CÓ NGUỒN DỮ LIỆU cho bảng này: mã được nạp (và cả ketqua.js,
   bản chép y hệt) là lớp ChatLuongNhanLuc — gọi NS_HoSo/LayDanhSach rồi đếm
   28 ô số (tổng nhân lực, nữ, đảng viên, trình độ, độ tuổi…) và nối MỘT dòng 28
   ô vào bảng 10 cột → cột lệch, không phải kết quả phân loại. Cả phân hệ không
   có lời gọi NS_PLDG_* nào trả kết quả phân loại.
   → Dựng đúng khung màn (tiêu đề, ghi chú, ô lọc, bảng 10 cột) với lời nhắc
     "chưa có nguồn dữ liệu"; nút Tìm kiếm khoá. Không gọi API. Báo cáo chất
     lượng nhân lực đầy đủ đã có ở menu "Kết quả" của Đánh giá lương tăng thêm
     (dgplluongtangthem/ketqua). Đã kiểm: tệp gốc không có đoạn mã đáng ngờ.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('dgpl-ketqua');
    if (!root) return;
    var ui = ums.ui, pat = ums.pat;
    var MUC = ['Kết quả phân loại của trưởng đơn vị'];

    root.innerHTML =
        pat.page('Kết quả phân loại') +
        '<div class="dgpl-kq">' +
        pat.panel({
            title: false,
            body:
                '<h2 class="dgpl-kq__tieude">KẾT QUẢ PHÂN LOẠI ĐÁNH GIÁ CÔNG CHỨC &amp; NGƯỜI LAO ĐỘNG</h2>' +
                '<b><u>Ghi chú:</u></b>' +
                '<p class="dgpl-kq__note">+ Nhấp chuột vào nút \'Tìm kiếm\' xem kết quả<br>' +
                '+ Nhấp chuột vào dropdown \'Chọn loại cán bộ\' để xem báo cáo theo loại</p>'
        }) +
        pat.panel({
            title: false, cls: 'ums-u-mt-4',
            body: '<div class="ums-filter">' +
                '<div class="ums-field"><select class="ums-select" data-f="loai" data-ph="Loại cán bộ"><option value="">Loại cán bộ</option></select></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { disabled: 'disabled', title: 'Chưa có nguồn dữ liệu kết quả phân loại' } }) + '</div>' +
                '</div>'
        }) +
        pat.panel({ title: 'Kết quả phân loại', icon: 'fa-table', flush: true, zone: 'bang', cls: 'ums-u-mt-4' }) +
        '</div>';

    var loai = root.querySelector('[data-f="loai"]');
    ui.enhance(root);
    ums.api.dm('NS.LHD0').then(function (rows) { pat.fill(loai, rows, { name: 'TEN' }); })
        .catch(function (err) { ums.api.handle(err, 'loại cán bộ'); });

    ui.table({
        el: root.querySelector('[data-z="bang"]'), rows: [],
        empty: 'Chưa có nguồn dữ liệu kết quả phân loại (bản gốc chưa nối lời gọi nào cho bảng này).',
        columns: [
            { title: 'Họ tên' },
            { title: 'Chức vụ/Chức danh' },
            { title: 'Tự phân loại', cls: 'is-center' },
            { title: 'Hoàn thành xuất sắc nhiệm vụ', cls: 'is-center', group: MUC },
            { title: 'Hoàn thành tốt nhiệm vụ', cls: 'is-center', group: MUC },
            { title: 'Hoàn thành nhiệm vụ', cls: 'is-center', group: MUC },
            { title: 'Không hoàn thành nhiệm vụ', cls: 'is-center', group: MUC },
            { title: 'Ghi chú' }
        ]
    });
})();
