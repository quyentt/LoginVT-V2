/* =========================================================================
   Danh sách dự báo đến hạn nâng lương trước thời hạn
   Bản gốc: ApisNhanSu/Modules/dubao/html/nangluongtruocthoihan.html + script/nangluongtruocthoihan.js
   ---------------------------------------------------------------------------
   Một cột như gốc (tiêu đề · ghi chú · lọc Cơ cấu → Bộ môn · Xuất excel · bảng), chỉ xem.
   Khung chung: ums.nsDuBao.man (../script/_dubao.js) — đọc chú thích ở đó.
   Lời gọi: NS_DuBao/NangLuongVuotKhung GET — strDonViBoPhan_GiangVien_Id.
   Cột chép nguyên thứ tự mDataProp của gốc (kể cả hai cột cùng đọc một trường).
   Tiêu đề "Hế số lương" của gốc sửa chính tả thành "Hệ số lương".
   Giữ như gốc (ghi sổ): màn TRƯỚC THỜI HẠN gọi action NS_DuBao/NangLuongVuotKhung (chép nhầm từ
   màn vượt khung?) trong khi đọc cột của nâng lương trước hạn (SOTHANGNANGLUONGTRUOCHAN,
   THANHTICHDUOCGHINHANTRUOCHAN…). Giữ nguyên action — cần kiểm trên host.
   Lỗi gốc đã sửa: trình xử lý chọn Cơ cấu gắn vào "#dropSearchNLTTH_CoCauToChuc" (sai id, ô thật
   là dropSearchNLTH_…) → chọn Cơ cấu không lọc Bộ môn. Nay lọc đúng.
   ========================================================================= */
(function () {
    'use strict';
    ums.nsDuBao.man('ns-nangluongtruocthoihan', {
        tieuDe: 'Danh sách dự báo đến hạn nâng lương trước thời hạn',
        action: 'NS_DuBao/NangLuongVuotKhung',
        tep: 'DuBaoNangLuongTruocThoiHan',
        columns: [
            { title: 'Họ và tên', prop: 'HOTEN' },
            { title: 'Đơn vị', prop: 'DAOTAO_COCAUTOCHUC' },
            { title: 'Giới tính', prop: 'GIOITINH_TEN', cls: 'is-center' },
            { title: 'Trình độ chuyên môn', prop: 'LOAIHOCVI' },
            { title: 'Mã số ngạch', prop: 'NGACHLUONG_MA', cls: 'is-nowrap' },
            { title: 'Bậc lương hiện giữ', prop: 'BACLUONG_TEN', cls: 'is-center' },
            { title: 'Hệ số lương', prop: 'HESOLUONG', cls: 'is-center' },
            { title: 'Thời điểm được xếp', prop: 'NGAYQUYETDINH', cls: 'is-center is-nowrap' },
            { title: 'Mã số ngạch', prop: 'NGACHLUONG_MA', cls: 'is-nowrap' },
            { title: 'Bậc lương mới', prop: 'BACLUONG_TIEPTHEO_TEN', cls: 'is-center' },
            { title: 'Hệ số lương mới', prop: 'HESOLUONG_TIEPTHEO', cls: 'is-center' },
            { title: 'Số tháng được nâng trước hạn', prop: 'SOTHANGNANGLUONGTRUOCHAN', cls: 'is-center' },
            { title: 'Thời gian hưởng', prop: 'NGAYHUONGLUONG_TIEPTHEO', cls: 'is-center is-nowrap' },
            { title: 'Thành tích', prop: 'THANHTICHDUOCGHINHANTRUOCHAN' }
        ]
    });
})();
