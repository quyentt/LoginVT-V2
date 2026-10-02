/* Dữ liệu mẫu cho khaibaodiemdacbiet — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function r(id, ma, ten, loai, loaiTen, gt) {
        return { ID: id, MA: ma, TEN: ten, LOAIDIEM_ID: loai, LOAIDIEM_TEN: loaiTen, GIATRIXULY: gt };
    }
    ums.demo.qldKB('D_DiemDacBiet', [
        r('DDB1', 'MT', 'Miễn thi học phần', 'DB1', 'Miễn thi', 'M'),
        r('DDB2', 'VT', 'Vắng thi không phép', 'DB2', 'Vắng thi', '0'),
        r('DDB3', 'VTP', 'Vắng thi có phép', 'DB2', 'Vắng thi', 'I'),
        r('DDB4', 'CT', 'Cấm thi do chuyên cần', 'DB3', 'Cấm thi', '0')
    ], { strLoaiDiem_Id: 'LOAIDIEM_ID' });
})();
