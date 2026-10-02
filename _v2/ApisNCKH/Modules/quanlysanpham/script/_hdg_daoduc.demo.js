/* Dữ liệu mẫu — Hội đồng đạo đức (NCKH_SP_HoiDongDaoDuc), chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    ums.demo.crudStore('NCKH_SP_HoiDongDaoDuc', [
        { ID: 'HDDD1', MASANPHAM: 'HDDD-2025-01', TONGSOHOIDONGDATHAMGIA: 3, NAMTHAMGIA: '2025', TRANGTHAI: 'Đang hoạt động',
            MOTA: 'Hội đồng đạo đức trong nghiên cứu y sinh học cấp trường', CANBONHAP_TENDAYDU: 'Nguyễn Văn Hùng' },
        { ID: 'HDDD2', MASANPHAM: 'HDDD-2024-07', TONGSOHOIDONGDATHAMGIA: 1, NAMTHAMGIA: '2024', TRANGTHAI: 'Đã kết thúc',
            MOTA: 'Thẩm định đạo đức đề tài khảo sát sinh viên', CANBONHAP_TENDAYDU: 'Trần Thị Mai' }
    ], {
        map: function (o) { return { MASANPHAM: o.strMa, NAMTHAMGIA: o.strNamBaoCao }; },
        list: function (rows, o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            return rows.filter(function (r) { return !q || (r.MASANPHAM + ' ' + (r.MOTA || '')).toLowerCase().indexOf(q) >= 0; });
        }
    });
})();
