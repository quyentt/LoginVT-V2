/* Dữ liệu mẫu cho dinhmucmiengiam — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    var DT = {};
    ums.demo.mg.DTMG.forEach(function (x) { DT[x.ID] = x.TEN; });
    var HK = { TG231: 'HK1 2023-2024', TG232: 'HK2 2023-2024', TG241: 'HK1 2024-2025' };
    function r(id, dt, tg, kt, kh, v) {
        return {
            ID: id, PHAMVIAPDUNG_ID: 'CT01', PHAMVIAPDUNG_TEN: 'Quản trị kinh doanh', QLSV_DOITUONG_ID: dt, QLSV_DOITUONG_TEN: DT[dt],
            DAOTAO_THOIGIANDAOTAO_ID: tg, DAOTAO_THOIGIANDAOTAO_HOCKY: HK[tg], TAICHINH_CACKHOANTHU_ID: kt, KIEUHOC_ID: kh, PHANTRAMMIENGIAM: v
        };
    }
    var ROWS = [
        r('DM1', 'DT01', 'TG231', 'KT1', 'KHOC1', 100), r('DM2', 'DT01', 'TG231', 'KT1', 'KHOC2', 50), r('DM3', 'DT01', 'TG232', 'KT1', 'KHOC1', 100),
        r('DM4', 'DT01', 'TG231', 'KT4', 'KHOC1', 100), r('DM5', 'DT02', 'TG231', 'KT1', 'KHOC1', 70), r('DM6', 'DT02', 'TG232', 'KT1', 'KHOC1', 70),
        r('DM7', 'DT03', 'TG241', 'KT1', 'KHOC1', 70), r('DM8', 'DT03', 'TG241', 'KT4', 'KHOC3', 30)
    ];
    ums.demo.add({
        'TC_MucMienGiam/LayDanhSach': function (o) {
            return ROWS.filter(function (x) { return !o.strQLSV_DoiTuong_Id || x.QLSV_DOITUONG_ID === o.strQLSV_DoiTuong_Id; });
        }
    });
})();
