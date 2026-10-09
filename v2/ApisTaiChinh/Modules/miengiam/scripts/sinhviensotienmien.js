/* =========================================================================
   Số tiền miễn giảm của sinh viên — số tiền miễn theo sinh viên × thời gian
   Bản gốc: ApisTaiChinh/Modules/miengiam/scripts/sinhviensotienmien.js
   ---------------------------------------------------------------------------
   Khuôn dựng chung ở scripts/_svmien.js (dùng chung với sinhvienmiengiammoi).
   Lời gọi (action kiểu cũ, chép nguyên bản gốc):
       TC_SoTienMien/LayDSThoiGian_DT_SoTienMien          GET  cột thời gian
       TC_SoTienMien/LayDSTaiChinh_NH_SoTienMien          GET  dòng sinh viên
       TC_SoTienMien/LayDanhSach                          GET  giá trị ô (SOTIEN)
       TC_SoTienMien/ThemMoi | CapNhat                    lưu, dSoTien bỏ dấu phẩy
       TC_SoTienMien/Xoa                                  xoá, strIds = id
       + sinh viên, chương trình sinh viên, danh mục QLTC.DTMG như màn phần trăm

   Khác bản gốc: như sinhvienmiengiammoi.js; thêm: ô tiền hiện có dấu phẩy
   ngăn nghìn (bản gốc hiện số trần) — giá trị gửi lên vẫn bỏ dấu phẩy.
   ========================================================================= */
(function () {
    'use strict';
    ums.miengiam.svMienMatrix({
        root: document.getElementById('sinhviensotienmien'),
        title: 'Số tiền miễn giảm của sinh viên',
        noun: 'số tiền miễn giảm',
        valueLabel: 'Số tiền',
        money: true,
        col: 'SOTIEN',
        param: 'dSoTien',
        clean: function (v) { return String(v === undefined || v === null ? '' : v).replace(/,/g, ''); },
        act: {
            thoiGian: 'TC_SoTienMien/LayDSThoiGian_DT_SoTienMien',
            nguoiHoc: 'TC_SoTienMien/LayDSTaiChinh_NH_SoTienMien',
            list: 'TC_SoTienMien/LayDanhSach',
            add: 'TC_SoTienMien/ThemMoi',
            edit: 'TC_SoTienMien/CapNhat',
            del: 'TC_SoTienMien/Xoa'
        }
    });
})();
