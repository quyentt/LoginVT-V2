/* =========================================================================
   Hệ số đối tượng (chương trình × đối tượng × học kỳ × khoản thu × kiểu học)
   Bản gốc: ApisTaiChinh/Modules/miengiam/scripts/hesodoituong.js
   ---------------------------------------------------------------------------
   Khuôn dựng chung ở scripts/_doituong.js (dùng chung với dinhmucmiengiam).
   Lời gọi (action kiểu cũ, chép nguyên bản gốc):
       TC_DoiTuong_HeSo/LayDanhSach  GET
       TC_DoiTuong_HeSo/ThemMoi      dHeSo + strGhiChu rỗng
       TC_DoiTuong_HeSo/CapNhat      sửa trong ô
       TC_DoiTuong_HeSo/Xoa          strIds = id bản ghi
   Nguồn: danh mục QLSV.DOITUONG (khác màn định mức dùng QLTC.DTMG) và
   KHDT.DIEM.KIEUHOC qua getList_DanhMucDulieu, TC_KhoanThu/LayDanhSach,
   CM_ThoiGianDaoTao/LayDSDAOTAO_ThoiGianDaoTao, Hệ/Khoá/Chương trình.

   Cố ý bỏ / lỗi bản gốc: như dinhmucmiengiam.js (hộp học phần chết, menu
   Truy/xuất không xử lý, tiêu đề nhóm khoản thu lệch, kiểm tra hợp lệ không
   chạy, nút xoá ở ô trống). Màn này không có Kế thừa.
   ========================================================================= */
(function () {
    'use strict';
    ums.miengiam.doiTuongPivot({
        root: document.getElementById('hesodoituong'),
        title: 'Hệ số đối tượng',
        formTitle: 'hệ số đối tượng',
        api: 'TC_DoiTuong_HeSo',
        dm: 'QLSV.DOITUONG',
        col: 'HESO',
        valueLabel: 'Hệ số',
        listExtra: {},
        addParams: function (v) { return { dHeSo: v, strGhiChu: '' }; },
        keThua: false
    });
})();
