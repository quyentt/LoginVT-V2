/* Dữ liệu mẫu cho thamsoquydoithangdiem — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function r(id, duoi, tren, so, chu) {
        return { ID: id, THANGDIEMGOC_ID: 'TD10', THANGDIEMGOC_TEN: 'Thang điểm 10', THANGDIEMQUYDOI_ID: 'TD4',
            THANGDIEMQUYDOI_TEN: 'Thang điểm 4', DIEMCANDUOI_THANGDIEMGOC: duoi, DIEMCANTREN_THANGDIEMGOC: tren,
            DIEMSO_THANGDIEMQUYDOI: so, DIEMCHU_THANGDIEMQUYDOI_ID: chu, DIEMCHU_THANGDIEMQUYDOI_TEN: chu };
    }
    ums.demo.qldKB('D_QuyDoiThangDiem', [
        r('QD1', 8.5, 10, 4, 'A'),
        r('QD2', 7, 8.4, 3, 'B'),
        r('QD3', 5.5, 6.9, 2, 'C'),
        r('QD4', 4, 5.4, 1, 'D'),
        r('QD5', 0, 3.9, 0, 'F')
    ], { strThangDiemGoc_Id: 'THANGDIEMGOC_ID', strThangDiemQuyDoi_Id: 'THANGDIEMQUYDOI_ID', strDiemChu_DiemQuyDoi_Id: 'DIEMCHU_THANGDIEMQUYDOI_ID' });
})();
