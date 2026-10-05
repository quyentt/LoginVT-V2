/* Dữ liệu mẫu cho Quản lý đơn vị (thi trắc nghiệm) — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function kd(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd'); }
    var DV = [
        ['DV01', 'KCNTT', 'Khoa Công nghệ thông tin', '1'],
        ['DV02', 'KKT', 'Khoa Kinh tế', '1'],
        ['DV03', 'KNN', 'Khoa Ngoại ngữ', '1'],
        ['DV04', 'TTKT', 'Trung tâm Khảo thí và Đảm bảo chất lượng', '1'],
        ['DV05', 'KLLCT', 'Khoa Lý luận chính trị', '0'],
        ['DV06', 'TTGDTC', 'Trung tâm Giáo dục thể chất', '1']
    ].map(function (x) { return { ID: x[0], CODE: x[1], NAME: x[2], STATUS: x[3] }; });

    ums.demo.add({
        'QLTTN_ThongTin/LayDS_ThonTinDonVi': function (o) {
            var q = kd(o.strTuKhoa), rows = DV.filter(function (r) {
                return (!o.strStatus || r.STATUS === String(o.strStatus)) && (!q || kd(r.CODE + ' ' + r.NAME).indexOf(q) >= 0);
            });
            var sz = Number(o.ItemPerPage) || 10, p = Number(o.PageNumber) || 1;
            return { rows: rows.slice((p - 1) * sz, p * sz), pager: rows.length };
        },
        'QLTTN_ThongTin/Them_ThongTinDonVi': { rows: [], message: 'DV_MOI' },
        'QLTTN_ThongTin/Sua_ThongTinDonVi': [],
        'QLTTN_ThongTin/Xoa_ThongTinDonVi': []
    });
})();
