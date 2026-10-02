/* Dữ liệu mẫu cho khaibaocongthucdiem — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function r(id, ma, ten, tp, tpTen, mh, mhTen, xau, toiThieu, duDiem) {
        return { ID: id, MA: ma, TEN: ten, DIEM_THANHPHANDIEM_ID: tp, DIEM_THANHPHANDIEM_TEN: tpTen, MOHINHXULY_ID: mh,
            MOHINHXULY_TEN: mhTen, XAUCONGTHUC: xau, SOTHANHPHANDIEMTOITHIEU: toiThieu, TONGHOPKHIDUDIEMTHANHPHAN: duDiem,
            CONGTHUCKHONGCANBANG: 0 };
    }
    ums.demo.qldKB('D_CongThucDiem', [
        r('CT1', 'CT_10_30_60', 'Chuyên cần 10% - Giữa kỳ 30% - Cuối kỳ 60%', 'TP4', 'Điểm tổng kết học phần', 'MH1', 'Trung bình có trọng số',
            '[CC]*0.1 + [GK]*0.3 + [CK]*0.6', 3, 1),
        r('CT2', 'CT_40_60', 'Quá trình 40% - Cuối kỳ 60%', 'TP4', 'Điểm tổng kết học phần', 'MH1', 'Trung bình có trọng số',
            '[GK]*0.4 + [CK]*0.6', 2, 1),
        r('CT3', 'CT_MAX', 'Lấy điểm cao nhất', 'TP5', 'Điểm tổng kết thang 4', 'MH2', 'Lấy thành phần cao nhất',
            'MAX([TKHP])', 1, 0)
    ], { strDiem_ThanhPhanDiem_Id: 'DIEM_THANHPHANDIEM_ID', strMoHinhXuLy_Id: 'MOHINHXULY_ID' });
})();
