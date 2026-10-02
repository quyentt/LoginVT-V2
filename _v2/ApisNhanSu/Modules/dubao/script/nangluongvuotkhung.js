/* =========================================================================
   Danh sách dự báo đến hạn nâng lương vượt khung
   Bản gốc: ApisNhanSu/Modules/dubao/html/nangluongvuotkhung.html + script/nangluongvuotkhung.js
   ---------------------------------------------------------------------------
   Một cột như gốc (tiêu đề · ghi chú · lọc Cơ cấu → Bộ môn · Xuất excel · bảng), chỉ xem.
   Khung chung: ums.nsDuBao.man (../script/_dubao.js) — đọc chú thích ở đó.
   Lời gọi: NS_DuBao/NangLuongVuotKhung GET — strDonViBoPhan_GiangVien_Id.
   Cột chép nguyên thứ tự mDataProp của gốc (kể cả hai cột cùng đọc một trường).
   Tiêu đề "Hế số lương" của gốc sửa chính tả thành "Hệ số lương".
   ========================================================================= */
(function () {
    'use strict';
    ums.nsDuBao.man('ns-nangluongvuotkhung', {
        tieuDe: 'Danh sách dự báo đến hạn nâng lương vượt khung',
        action: 'NS_DuBao/NangLuongVuotKhung',
        tep: 'DuBaoNangLuongVuotKhung',
        columns: [
            { title: 'Họ và tên', prop: 'HOTEN' },
            { title: 'Giới tính', prop: 'GIOITINH_TEN', cls: 'is-center' },
            { title: 'Trình độ chuyên môn', prop: 'TRINHDOCHUYENMONCAONHAT_TEN' },
            { title: 'Chức danh hoặc ngạch', prop: 'NGACHLUONG_MA', cls: 'is-nowrap' },
            { title: 'Bậc cuối của ngạch', prop: 'BACLUONGCUOICUANGACH', cls: 'is-center' },
            { title: 'Hệ số lương bậc cuối', prop: 'HESOLUONGBACCUOICUANGACH', cls: 'is-center' },
            { title: 'Thời điểm được xếp', prop: 'LAYNGAYHUONGLUONGVUOTKHUNG', cls: 'is-center is-nowrap' },
            { title: 'PC TNVK đã hưởng (%)', prop: 'PHANTRAMVUOTKHUNGDAHUONG', cls: 'is-center' },
            { title: 'Thời gian tính hưởng PCTNVK lần sau', prop: 'NGAYHUONGVUOTKHUNGTIEP_HIENTAI', cls: 'is-center is-nowrap' },
            { title: 'PCTNVK được hưởng(%)', prop: 'PHANTRAMVUOTKHUNGTIEP', cls: 'is-center' },
            { title: 'Thời gian tính hưởng PCTNVK lần sau', prop: 'NGAYHUONGVUOTKHUNGTIEP', cls: 'is-center is-nowrap' },
            { title: 'Số tháng được hưởng', prop: 'SOTHANGDUOCHUONGTINHTU', cls: 'is-center' }
        ]
    });
})();
