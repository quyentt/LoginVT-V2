/* Dữ liệu mẫu cho Quỹ học bổng — chỉ dùng ở chế độ dựng thử. */
ums.demo.crudStore('HB_QuyHocBong', [
    { ID: 'QHB1', MA: 'KKHT', TEN: 'Quỹ học bổng khuyến khích học tập', MOTA: 'Trích từ nguồn thu học phí', HIEULUC: 1 },
    { ID: 'QHB2', MA: 'DNTT', TEN: 'Quỹ học bổng doanh nghiệp tài trợ', MOTA: 'Các doanh nghiệp đối tác', HIEULUC: 1 },
    { ID: 'QHB3', MA: 'VUOTKHO', TEN: 'Quỹ học bổng vượt khó', MOTA: 'Hỗ trợ sinh viên hoàn cảnh khó khăn', HIEULUC: 1 },
    { ID: 'QHB4', MA: 'TN2024', TEN: 'Quỹ học bổng tân sinh viên 2024', MOTA: 'Đã kết thúc', HIEULUC: 0 }
], {
    map: function (o) { return { MA: o.strMa, TEN: o.strTen, MOTA: o.strMoTa, HIEULUC: Number(o.dHieuLuc) }; },
    list: function (rows, o) {
        var q = String(o.strTuKhoa || '').toLowerCase();
        return rows.filter(function (r) { return !q || (r.MA + ' ' + r.TEN).toLowerCase().indexOf(q) >= 0; });
    }
});
