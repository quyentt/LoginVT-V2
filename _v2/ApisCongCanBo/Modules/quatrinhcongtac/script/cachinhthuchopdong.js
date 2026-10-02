/* =========================================================================
   Hợp đồng lao động — hồ sơ cá nhân (CHỈ XEM)
   Bản gốc: ApisCongCanBo/Modules/quatrinhcongtac/script/cachinhthuchopdong.js
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá):
       NS_ThongTinHopDong/LayDanhSach  GET  strNhanSu_HoSoCanBo_Id, strTuKhoa '',
                                            strNguoiThucHien_Id '', pageIndex, pageSize

   Bản gốc có sẵn biểu mẫu hợp đồng nhưng KHÔNG mở được: không có nút Thêm
   mới, bảng không có cột Sửa/Xoá, và các hàm save_/getDetail_/delete_
   HopDongLaoDong mà nút gọi tới không tồn tại. Tức màn này chỉ để xem —
   không chuyển biểu mẫu chết. Hợp đồng do phòng tổ chức nhập ở phân hệ Nhân sự.

   Khác bản gốc:
     · Bản gốc chỉ nạp trang đầu (pageIndex 1, pageSize mặc định 10) và
       không vẽ thanh phân trang → hợp đồng thứ 11 trở đi không bao giờ hiện.
       Ở đây phân trang đầy đủ, cùng tham số.
   Dùng chung với bản QUẢN TRỊ ApisNhanSu/Modules/quatrinhcongtac/cachinhthuchopdong (cán bộ nhân sự chọn
   một người): ums.ccbHS.cachinhthuchopdong(P) trả cấu hình ums.crud. P = { hs() → id hồ sơ
   cán bộ, nth() → id người thực hiện, ns: true ở bản Nhân sự }; mặc định
   (Cổng cán bộ) cả hai là người đăng nhập.
   ========================================================================= */
(function () {
    'use strict';

    function uid() { return (ums.session && ums.session.userId) || ''; }

    function cauHinh(P) {
    return {
        title: 'Hợp đồng lao động',
        listTitle: 'Tóm tắt hợp đồng lao động',
        icon: 'fa-file-contract',
        pageSize: 10,

        list: {
            paged: true,
            call: function () {
                return { action: 'NS_ThongTinHopDong/LayDanhSach', method: 'GET',
                    strNhanSu_HoSoCanBo_Id: P.hs(), strTuKhoa: '', strNguoiThucHien_Id: '' };
            }
        },

        columns: [
            { title: 'Số hợp đồng', prop: 'SOHOPDONG', cls: 'is-center' },
            { title: 'Loại hợp đồng', prop: 'DIEU1_LOAIHOPDONG_TEN', cls: 'is-center' },
            { title: 'Ngày hiệu lực', prop: 'NGAYHIEULUCHOPDONG', cls: 'is-center is-nowrap' },
            { title: 'Ngày hết hiệu lực', prop: 'NGAYHETHIEULUCHOPDONG', cls: 'is-center is-nowrap' }
        ]
    };
    }

    (ums.ccbHS = ums.ccbHS || {}).cachinhthuchopdong = cauHinh;
    var root = document.getElementById('cachinhthuchopdong');
    if (root) ums.crud(Object.assign({ root: root }, cauHinh({ hs: uid, nth: uid })));
})();
