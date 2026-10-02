/* Dữ liệu mẫu cho miengiammotphan / miengiamtoanphan — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    var SV = ums.demo.mg.SV;
    function r(id, i, pt, ad, hh, ghichu) {
        var s = SV[i];
        return {
            ID: id, QLSV_NGUOIHOC_HODEM: s.HODEM, QLSV_NGUOIHOC_TEN: s.TEN,
            QLSV_NGUOIHOC_NGAYSINH: s.NGAYSINH_NGAY + '/' + s.NGAYSINH_THANG + '/' + s.NGAYSINH_NAM,
            CHUONGTRINH: 'Quản trị kinh doanh', QUOCTICH_TEN: i === 4 ? 'Lào' : 'Việt Nam',
            PHANTRAMMIENGIAM: pt, NGAYAPDUNG: ad, NGAYHETHAN: hh, GHICHU: ghichu || ''
        };
    }
    function page(list) {
        return function (o) {
            var i = (Number(o.pageIndex) || 1) - 1, n = Number(o.pageSize) || 10;
            return { rows: list.slice(i * n, i * n + n), pager: list.length };
        };
    }
    ums.demo.add({
        'TC_MienMotPhan/LayDanhSach': page([
            r('MP1', 0, 50, 'Học kỳ 1 năm 2023-2024', 'Học kỳ 2 năm 2024-2025'),
            r('MP2', 1, 50, 'Học kỳ 1 năm 2023-2024', 'Học kỳ 2 năm 2023-2024'),
            r('MP3', 3, 30, 'Học kỳ 2 năm 2023-2024', 'Học kỳ 2 năm 2024-2025'),
            r('MP4', 4, 70, 'Học kỳ 1 năm 2024-2025', 'Học kỳ 2 năm 2024-2025')
        ]),
        'TC_MienToanBo/LayDanhSach': page([
            r('TB1', 2, 100, 'Học kỳ 1 năm 2023-2024', 'Học kỳ 2 năm 2026-2027', 'Con liệt sĩ'),
            r('TB2', 5, 100, 'Học kỳ 1 năm 2024-2025', 'Học kỳ 2 năm 2026-2027', 'Mồ côi cả cha lẫn mẹ'),
            r('TB3', 4, 100, 'Học kỳ 1 năm 2023-2024', 'Học kỳ 2 năm 2024-2025', 'Học bổng hiệp định')
        ])
    });
})();
