/* Dữ liệu mẫu riêng của xuathoadonkhac — chỉ dùng ở chế độ dựng thử.
   Phần còn lại (tình trạng tài chính, danh mục…) dùng chung xuathoadon.demo.js. */
ums.demo.add({
    'TC_DoiTuongKhac/LayDanhSach': function (o) {
        var all = [
            { ID: 'DK01', TENDOITUONG: 'Công ty TNHH Hoà Bình', MASODOITUONG: 'DTK-0001' },
            { ID: 'DK02', TENDOITUONG: 'Trung tâm Ngoại ngữ Sao Mai', MASODOITUONG: 'DTK-0002' },
            { ID: 'DK03', TENDOITUONG: 'Nguyễn Thị Hạnh (học viên ngắn hạn)', MASODOITUONG: 'DTK-0003' }
        ];
        var q = String(o.strTuKhoa || '').toLowerCase();
        var list = all.filter(function (r) { return !q || (r.TENDOITUONG + ' ' + r.MASODOITUONG).toLowerCase().indexOf(q) >= 0; });
        return { rows: list, pager: list.length };
    }
});
