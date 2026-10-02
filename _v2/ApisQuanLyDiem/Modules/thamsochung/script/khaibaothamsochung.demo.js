/* Dữ liệu mẫu cho khaibaothamsochung — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function r(id, tg, nam, ky, hoc, thi, ngay) {
        return { ID: id, SOLANHOCTOIDA: hoc, SOLANTHILAITOIDA: thi, DAOTAO_THOIGIANDAOTAO_ID: tg,
            DAOTAO_THOIGIANDAOTAO_NAM: nam, DAOTAO_THOIGIANDAOTAO_KY: ky, DAOTAO_THOIGIANDAOTAO_DOT: 1, NGAYAPDUNG: ngay };
    }
    ums.demo.qldKB('D_ThamSoHocTapChung', [
        r('TSC1', 'TG261', '2026-2027', 1, 3, 2, '01/09/2026'),
        r('TSC2', 'TG252', '2025-2026', 2, 3, 2, '15/01/2026'),
        r('TSC3', 'TG251', '2025-2026', 1, 2, 1, '01/09/2025')
    ], { strDaoTao_ThoiGianDaoTao_Id: 'DAOTAO_THOIGIANDAOTAO_ID' });
})();
