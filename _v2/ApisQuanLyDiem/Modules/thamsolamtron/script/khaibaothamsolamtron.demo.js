/* Dữ liệu mẫu cho khaibaothamsolamtron — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function r(id, loai, ten, tg, nam, ky, le, lam, ngay, mota) {
        return { ID: id, LOAIDIEMTRUNGBINH_ID: loai, LOAIDIEMTRUNGBINH_TEN: ten, DAOTAO_THOIGIANDAOTAO_ID: tg,
            DAOTAO_THOIGIANDAOTAO_NAM: nam, DAOTAO_THOIGIANDAOTAO_KY: ky, DAOTAO_THOIGIANDAOTAO_DOT: 1,
            SOLESAUDAUPHAY: le, COLAMTRON: lam, NGAYAPDUNG: ngay, MOTA: mota };
    }
    ums.demo.qldKB('D_ThamSoLamTron', [
        r('LT1', 'TB1', 'Điểm trung bình học kỳ', 'TG261', '2026-2027', 1, 2, 1, '01/09/2026', 'Làm tròn 2 chữ số thập phân'),
        r('LT2', 'TB2', 'Điểm trung bình tích lũy', 'TG261', '2026-2027', 1, 2, 1, '01/09/2026', 'Làm tròn 2 chữ số thập phân'),
        r('LT3', 'TB3', 'Điểm trung bình năm học', 'TG251', '2025-2026', 1, 1, 0, '01/09/2025', 'Không làm tròn, giữ 1 số lẻ')
    ], { strDaoTao_ThoiGianDaoTao_Id: 'DAOTAO_THOIGIANDAOTAO_ID', strLoaiDiemTrungBinh_Id: 'LOAIDIEMTRUNGBINH_ID' });
})();
