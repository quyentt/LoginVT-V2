/* Dữ liệu mẫu cho cachinhthuchopdong — chỉ dùng ở chế độ dựng thử (12 dòng để thấy phân trang). */
(function () {
    var rows = [];
    for (var i = 1; i <= 12; i++) rows.push({ ID: 'HD' + i, SOHOPDONG: (100 + i) + '/HĐLĐ', DIEU1_LOAIHOPDONG_TEN: i < 3 ? 'Thử việc' : 'Xác định thời hạn',
        NGAYHIEULUCHOPDONG: '01/09/' + (2011 + i), NGAYHETHIEULUCHOPDONG: '31/08/' + (2012 + i) });
    ums.demo.add({ 'NS_ThongTinHopDong/LayDanhSach': function (o) {
        var s = Number(o.pageSize) || 10, p = Number(o.pageIndex) || 1;
        return { rows: rows.slice((p - 1) * s, p * s), pager: rows.length };
    } });
})();
