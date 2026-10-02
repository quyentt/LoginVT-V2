/* Dữ liệu mẫu cho khaibaothamsotinhdiem — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function r(id, qc, ten, tg, nam, ky, ngay) {
        return { ID: id, QUYCHEAPDUNG_ID: qc, QUYCHEAPDUNG_TEN: ten, DAOTAO_THOIGIANDAOTAO_ID: tg,
            DAOTAO_THOIGIANDAOTAO_NAM: nam, DAOTAO_THOIGIANDAOTAO_KY: ky, DAOTAO_THOIGIANDAOTAO_DOT: 1, NGAYAPDUNG: ngay,
            QUYTACLAYDIEMCAONHAT_ID: 'CN1', QUYTACLAYDULIEUCT_ID: 'DL1', QUYTACXACDINHDIEM_ID: 'XD1',
            QUYTACVEDIEUKIENDIEM_ID: 'DK1', QUYTACLAYDIEMLAN1_ID: 'L11', MOTA: 'Áp dụng cho ' + ten.toLowerCase() };
    }
    ums.demo.qldKB('D_ThamSoTongHop', [
        r('TH1', 'QC1', 'Quy chế đào tạo 2021', 'TG261', '2026-2027', 1, '01/09/2026'),
        r('TH2', 'QC1', 'Quy chế đào tạo 2021', 'TG251', '2025-2026', 1, '01/09/2025'),
        r('TH3', 'QC2', 'Quy chế đào tạo 2014', 'TG252', '2025-2026', 2, '15/01/2026')
    ], { strDaoTao_ThoiGianDaoTao_Id: 'DAOTAO_THOIGIANDAOTAO_ID', strQuyCheApDung_Id: 'QUYCHEAPDUNG_ID' });
})();
