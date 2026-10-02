/* Dữ liệu mẫu cho hesodoituong — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    var DT = { QD01: 'Con liệt sĩ', QD02: 'Con thương binh', QD03: 'Hộ nghèo', QD04: 'Hộ cận nghèo' };
    var HK = { TG231: 'HK1 2023-2024', TG232: 'HK2 2023-2024' };
    function r(id, dt, tg, kt, kh, v) {
        return {
            ID: id, PHAMVIAPDUNG_ID: 'CT02', PHAMVIAPDUNG_TEN: 'Công nghệ thông tin', QLSV_DOITUONG_ID: dt, QLSV_DOITUONG_TEN: DT[dt],
            DAOTAO_THOIGIANDAOTAO_ID: tg, DAOTAO_THOIGIANDAOTAO_HOCKY: HK[tg], TAICHINH_CACKHOANTHU_ID: kt, KIEUHOC_ID: kh, HESO: v
        };
    }
    var ROWS = [
        r('HS1', 'QD01', 'TG231', 'KT1', 'KHOC1', 0), r('HS2', 'QD02', 'TG231', 'KT1', 'KHOC1', 0.3), r('HS3', 'QD03', 'TG231', 'KT1', 'KHOC1', 0.5),
        r('HS4', 'QD03', 'TG232', 'KT1', 'KHOC1', 0.5), r('HS5', 'QD04', 'TG232', 'KT2', 'KHOC2', 0.7)
    ];
    ums.demo.add({
        'TC_DoiTuong_HeSo/LayDanhSach': function (o) {
            return ROWS.filter(function (x) { return !o.strQLSV_DoiTuong_Id || x.QLSV_DOITUONG_ID === o.strQLSV_DoiTuong_Id; });
        }
    });
})();
