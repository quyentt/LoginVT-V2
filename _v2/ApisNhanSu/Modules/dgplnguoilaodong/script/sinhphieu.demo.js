/* Dữ liệu mẫu cho sinhphieu — chỉ dùng ở chế độ dựng thử. */
ums.demo.add({
    'NS_PLDG_NLD_KeHoach/LayDanhSach': function (o) {
        var rows = [
            { ID: 'KHN1', TENKEHOACH: 'Đánh giá, phân loại viên chức và người lao động năm 2025' },
            { ID: 'KHN2', TENKEHOACH: 'Đánh giá, phân loại viên chức và người lao động năm 2026' },
            { ID: 'KHN3', TENKEHOACH: 'Đánh giá giữa năm 2026 — khối phòng ban' }
        ];
        var q = (o.strTuKhoa || '').toLowerCase();
        if (q) rows = rows.filter(function (r) { return r.TENKEHOACH.toLowerCase().indexOf(q) >= 0; });
        return { rows: rows, pager: rows.length };
    }
});
