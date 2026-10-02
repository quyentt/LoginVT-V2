/* Dữ liệu mẫu cho thamsodanhgiaketqua — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function r(id, dg, ten, xau, mota) {
        return { ID: id, DANHGIA_ID: dg, DANHGIA_TEN: ten, XAUDIEUKIEN: xau, MOTA: mota };
    }
    ums.demo.qldKB('D_ThamSoDanhGiaKetQua', [
        r('DGK1', 'DG1', 'Đạt', '[DIEMTK] >= 4', 'Điểm tổng kết học phần từ 4,0 trở lên'),
        r('DGK2', 'DG2', 'Không đạt', '[DIEMTK] < 4', 'Điểm tổng kết học phần dưới 4,0'),
        r('DGK3', 'DG3', 'Chưa đánh giá', '[DIEMTK] IS NULL', 'Chưa có điểm tổng kết')
    ], { strDanhGia_Id: 'DANHGIA_ID' });
})();
