/* Dữ liệu mẫu cho mucmiengiammoi — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    var D = ums.demo.mg;
    function r(id, dt, tg, kh, kt, pt) {
        var t = D.TG.filter(function (x) { return x.ID === tg; })[0];
        return { ID: id, QLSV_DOITUONG_ID: dt, DAOTAO_THOIGIANDAOTAO_ID: tg, DAOTAO_THOIGIANDAOTAO: t.DAOTAO_THOIGIANDAOTAO,
            KIEUHOC_ID: kh, TAICHINH_CACKHOANTHU_ID: kt, PHANTRAMMIENGIAM: pt };
    }
    ums.demo.add({
        'TC_MucMienGiam/LayDSThoiGian_MucMienGiam': [
            { ID: 'TG231', THOIGIAN: 'HK1 2023-2024' }, { ID: 'TG232', THOIGIAN: 'HK2 2023-2024' },
            { ID: 'TG241', THOIGIAN: 'HK1 2024-2025' }, { ID: 'TG242', THOIGIAN: 'HK2 2024-2025' }
        ],
        'TC_MucMienGiam/LayDanhSach': [
            r('MMG1', 'DT01', 'TG231', 'KHOC1', 'KT1', 100), r('MMG2', 'DT01', 'TG232', 'KHOC1', 'KT1', 100),
            r('MMG3', 'DT02', 'TG231', 'KHOC1', 'KT1', 70), r('MMG4', 'DT02', 'TG232', 'KHOC1', 'KT1', 70),
            r('MMG5', 'DT03', 'TG231', 'KHOC1', 'KT1', 70), r('MMG6', 'DT04', 'TG241', 'KHOC1', 'KT1', 100),
            r('MMG7', 'DT05', 'TG241', 'KHOC1', 'KT1', 50)
        ]
    });
})();
