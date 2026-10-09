/* =========================================================================
   Các hình thức hợp đồng — bản QUẢN TRỊ (Nhân sự): chọn cán bộ rồi xem (CHỈ XEM)
   Bản gốc: ApisNhanSu/Modules/quatrinhcongtac/script/cachinhthuchopdong.js
   ---------------------------------------------------------------------------
   Bản gốc hai cột: trái "Danh sách cán bộ" (ums.nsQT.man), phải tab
   "1) Hợp đồng lao động" (hai tab kia đã chú thích bỏ → một tab, không vẽ dải
   tab), khung "Tóm tắt hợp đồng lao động": Số hợp đồng · Loại hợp đồng · Ngày
   bắt đầu có hiệu lực · Đơn vị tuyển dụng · Sửa · Xóa, kèm biểu mẫu hợp đồng
   (số HĐ, loại, ngày hiệu lực / hết hiệu lực, đơn vị tuyển dụng, công việc đảm
   nhận, ngày đóng BHXH, tệp).

   BẢN GỐC CHƯA TỪNG CHẠY:
     · bấm một cán bộ gọi me.getList_HopDongLaoDong() — hàm KHÔNG tồn tại
       (TypeError) → bảng không bao giờ có dữ liệu;
     · Thêm mới gọi resetPopup_HopDongLaoDong / popup_HopDongLaoDong, Sửa gọi
       getDetail_HopDongLaoDong, Xoá gọi delete_HopDongLaoDong — đều không tồn tại;
     · Lưu gọi save_ThuyenChuyen (NS_QT_ThuyenChuyenCanBo — điều chuyển cán bộ,
       đọc các ô KHÔNG có trên màn), tức không phải lưu hợp đồng.
   Làm theo ý định, như bản Cổng cán bộ đã chuyển: danh sách hợp đồng của cán bộ
   đang chọn qua NS_ThongTinHopDong/LayDanhSach (dùng lại ums.ccbHS.cachinhthuchopdong,
   phân trang đầy đủ); biểu mẫu chết không chuyển — nút "Thêm mới" giữ, KHOÁ.
   Hợp đồng nhập ở màn Hợp đồng cán bộ (ApisNhanSu/Modules/hopdong).
   Cột "Đơn vị tuyển dụng": tên cột máy chủ CHƯA RÕ (bản gốc chưa từng vẽ bảng,
   màn hopdongcanbo không có cột này) — đọc DIEU1_DONVITUYENDUNG_TEN (đoán).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;

    ums.nsQT.man({
        el: document.getElementById('ns_cachinhthuchopdong'),
        title: 'Các hình thức hợp đồng',
        mo: function (host, cb, P) {
            var cfg = ums.ccbHS.cachinhthuchopdong(P);
            cfg.columns = [
                { title: 'Số hợp đồng', prop: 'SOHOPDONG', cls: 'is-center' },
                { title: 'Loại hợp đồng', prop: 'DIEU1_LOAIHOPDONG_TEN', cls: 'is-center' },
                { title: 'Ngày bắt đầu có hiệu lực', prop: 'NGAYHIEULUCHOPDONG', cls: 'is-center is-nowrap' },
                { title: 'Đơn vị tuyển dụng', prop: 'DIEU1_DONVITUYENDUNG_TEN' }
            ];
            ums.nsQT.crud(host, cfg);
            var tools = host.querySelector('.ums-panel__tools');
            if (tools) tools.insertAdjacentHTML('beforeend', ui.btn('add', { attr: {
                disabled: 'disabled', title: 'Bản gốc chưa có chức năng thêm hợp đồng ở màn này' } }));
        }
    });
})();
