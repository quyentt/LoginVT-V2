/* Dữ liệu mẫu cho Lập danh sách học lại thi lại — chỉ dùng ở chế độ dựng thử.
   Kết quả MỘT ô (sinh viên × học phần). Vài sinh viên không có kết quả ở một học phần → dòng bị ẩn (như gốc). */
ums.demo.add({
    'HLTL_ThongTinChung/LayKQNguoiHocHocLaiThiLai': function (o) {
        var i = Number(String(o.strQLSV_NguoiHoc_id).replace(/\D/g, '')) || 0;
        var j = Number(String(o.strDaoTao_HocPhan_Id).replace(/\D/g, '')) || 0;
        if ((i + j) % 7 === 0) return [];
        var diem = ((i * 3 + j * 5) % 40) / 10;
        return [{ DIEM: diem.toFixed(1), LANHOC: 1 + (i + j) % 2, LANTHI: 1 + (i * j) % 2,
            DANHGIA_TEN: diem < 2 ? 'Học lại' : 'Thi lại' }];
    }
});
