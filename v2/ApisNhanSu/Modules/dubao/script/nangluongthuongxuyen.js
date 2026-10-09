/* =========================================================================
   Danh sách dự báo đến hạn nâng lương thường xuyên
   Bản gốc: ApisNhanSu/Modules/dubao/html/nangluongthuongxuyen.html + script/nangluongthuongxuyen.js
   ---------------------------------------------------------------------------
   Một cột như gốc (tiêu đề · ghi chú · lọc Cơ cấu → Bộ môn · Xuất excel · bảng), chỉ xem.
   Khung chung: ums.nsDuBao.man (../script/_dubao.js) — đọc chú thích ở đó.
   Lời gọi: NS_DuBao/NangLuongThuongXuyen GET — strDonViBoPhan_GiangVien_Id.
   Cột chép nguyên thứ tự mDataProp của gốc (kể cả hai cột cùng đọc một trường).
   Tiêu đề "Hế số lương" của gốc sửa chính tả thành "Hệ số lương".
   ========================================================================= */
(function () {
    'use strict';
    ums.nsDuBao.man('ns-nangluongthuongxuyen', {
        tieuDe: 'Danh sách dự báo đến hạn nâng lương thường xuyên',
        action: 'NS_DuBao/NangLuongThuongXuyen',
        tep: 'DuBaoNangLuongThuongXuyen',
        columns: [
            { title: 'Họ tên', prop: 'HOTEN' },
            { title: 'Giới tính', prop: 'GIOITINH_TEN', cls: 'is-center' },
            { title: 'Trình độ chuyên môn', prop: 'TRINHDOCHUYENMONCAONHAT_TEN' },
            { title: 'Chức danh hoặc ngạch', prop: 'NGACHLUONG_MA', cls: 'is-nowrap' },
            { title: 'Bậc lương hiện giữ', prop: 'BACLUONG_TEN', cls: 'is-center' },
            { title: 'Hệ số lương', prop: 'HESOLUONG', cls: 'is-center' },
            { title: 'Thời điểm được xếp', prop: 'NGAYQUYETDINH', cls: 'is-center is-nowrap' },
            { title: 'Chức danh hoặc ngạch', prop: 'NGACHLUONG_MA', cls: 'is-nowrap' },
            { title: 'Bậc lương sau nâng', prop: 'BACLUONG_TIEPTHEO_TEN', cls: 'is-center' },
            { title: 'Hệ số lương mới', prop: 'HESOLUONG_TIEPTHEO', cls: 'is-center' },
            { title: 'Thời điểm nâng bậc lần sau', prop: 'NGAYHUONGLUONG_TIEPTHEO', cls: 'is-center is-nowrap' },
            { title: 'Ngày hưởng', prop: 'NGAYHUONGLUONG_TIEPTHEO', cls: 'is-center is-nowrap' },
            { title: 'Số tháng được hưởng', prop: 'SOTHANGDUOCHUONGTINHHETNAM', cls: 'is-center' }
        ]
    });
})();
