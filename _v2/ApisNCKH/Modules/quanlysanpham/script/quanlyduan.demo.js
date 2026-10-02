/* Dữ liệu mẫu cho Quản lý dự án (NCKH) — chỉ dùng ở chế độ dựng thử. */
(function () {
    function map(o) {
        var r = {};
        Object.keys(o).forEach(function (k) { if (/^(str|d)[A-Z]/.test(k)) r[k.replace(/^(str|d)/, '').toUpperCase()] = o[k]; });
        return r;
    }
    ums.demo.crudStore('NCKH_QuanLyDuAn', [
        { ID: 'DA1', TENDUAN: 'Dự án hợp tác đào tạo kỹ sư phần mềm Việt – Nhật', DONVICHUTRI_ID: '', TUNGAY: '01/03/2026', DENNGAY: '28/02/2028',
            MOU: 1, DONVIKYKETMOU: 'Đại học Tokyo', THOIHANKYKETMOU: '5 năm', MUCDICH_PHAMVI_NOIDUNG: 'Trao đổi giảng viên, sinh viên; xây dựng chương trình liên kết.',
            KETQUADUAN: 'Đã tiếp nhận 12 sinh viên trao đổi' },
        { ID: 'DA2', TENDUAN: 'Dự án phòng thí nghiệm trí tuệ nhân tạo', TUNGAY: '15/06/2026', DENNGAY: '15/06/2027', MOU: 0,
            MUCDICH_PHAMVI_NOIDUNG: 'Đầu tư thiết bị tính toán hiệu năng cao.' }
    ], { map: map });
})();
