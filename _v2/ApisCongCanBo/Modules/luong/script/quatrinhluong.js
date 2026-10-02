/* =========================================================================
   Quá trình lương — hồ sơ cá nhân (CHỈ XEM)
   Bản gốc: ApisCongCanBo/Modules/luong/script/quatrinhluong.js
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá):
       NS_QT_Luong/LayDanhSach  GET  strNhanSu_HoSoCanBo_Id = userId

   Bản gốc có biểu mẫu "Thêm mới - Quá trình lương" nhưng không mở được:
   trên màn không có nút Thêm mới (trình xử lý .btnAdd không có gì để bắt),
   nút Sửa gắn vào bảng #tbl_QTSK không tồn tại, và mọi lời gọi lưu/xoá/chi
   tiết là NS_QT_KhamSucKhoe (chép từ màn sức khỏe, chưa sửa). Chỉ chuyển
   danh sách. Quá trình lương do phòng tổ chức nhập ở phân hệ Nhân sự.
   ========================================================================= */
(function () {
    'use strict';

    function uid() { return (ums.session && ums.session.userId) || ''; }

    ums.crud({
        root: document.getElementById('quatrinhluong'),
        title: 'Quá trình lương',
        listTitle: 'Quá trình lương',
        icon: 'fa-money-bill-trend-up',

        list: { call: function () { return { action: 'NS_QT_Luong/LayDanhSach', method: 'GET', strNhanSu_HoSoCanBo_Id: uid() }; } },

        columns: [
            { title: 'Ngạch', prop: 'NGACH_MA', cls: 'is-center' },
            { title: 'Bậc', prop: 'BAC', cls: 'is-center' },
            { title: 'Hệ số lương', prop: 'HESOLUONG', cls: 'is-center' },
            { title: 'Ngày hưởng', prop: 'NGAYHUONG', cls: 'is-center is-nowrap' },
            { title: 'Phần trăm hưởng', prop: 'PHANTRAMHUONG', cls: 'is-center' },
            { title: 'Lý do', prop: 'LYDO' }
        ]
    });
})();
