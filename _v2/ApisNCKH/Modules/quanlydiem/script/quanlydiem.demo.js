/* Dữ liệu mẫu cho quanlydiem/quanlydiem — chỉ dùng ở chế độ dựng thử. */
(function () {
    var R = [
        { THONGTINSANPHAM: 'Deep learning for crop yield prediction — Computers and Electronics in Agriculture', PHANLOAISANPHAM_ID: 'NCKH_SP_TapChiQuocTe', VITRITACGIA_TEN: 'Tác giả chính', SOTACGIA_N: 3, HESOIF_N: 8.3, DIEM: 2, TINHTRANGXACNHAN: 'Đã xác nhận' },
        { THONGTINSANPHAM: 'Ứng dụng blockchain trong quản lý văn bằng — Tạp chí Khoa học Công nghệ', PHANLOAISANPHAM_ID: 'NCKH_SP_TapChiQuocGia', VITRITACGIA_TEN: 'Đồng tác giả', SOTACGIA_N: 2, DIEM: 0.5, TINHTRANGXACNHAN: 'Chưa xác nhận' },
        { THONGTINSANPHAM: 'Giáo trình Cơ sở dữ liệu nâng cao', PHANLOAISANPHAM_ID: 'NCKH_SP_Sach', VITRITACGIA_TEN: 'Chủ biên', SOTACGIA_N: 4, SODONGCHUBIEN_N: 1, SOTRANGTHAMGIAVIET_N: 120, DIEM: 2, TINHTRANGXACNHAN: 'Đã xác nhận' },
        { THONGTINSANPHAM: 'Đề tài cấp Bộ B2025-HN-07: Hệ thống cảnh báo sớm học vụ', PHANLOAISANPHAM_ID: 'NCKH_QUANLYDETAI', VITRITACGIA_TEN: 'Chủ nhiệm', TYLETHAMGIA: 40, DIEM: 1.5, TINHTRANGXACNHAN: 'Đã xác nhận' },
        { THONGTINSANPHAM: 'Hướng dẫn nhóm SV NCKH: Nhận dạng biển số xe', PHANLOAISANPHAM_ID: 'NCKH_SP_HuongDanSinhVien', VITRITACGIA_TEN: 'Người hướng dẫn', SONGUOIHUONGDAN_N: 2, DIEM: 0.25, TINHTRANGXACNHAN: 'Chưa xác nhận' }
    ];
    ums.demo.add({
        'NCKH_PhanBo/LayDanhSach': function (o) {
            var r = R.filter(function (x) { return !o.strPhanLoaiSanPham_Id || x.PHANLOAISANPHAM_ID === o.strPhanLoaiSanPham_Id; });
            var s = Number(o.pageSize) || r.length, i = (Number(o.pageIndex) || 1) - 1;
            return { rows: r.slice(i * s, i * s + s), pager: r.length };
        },
        'NCKH_TinhDiem/TongHop': []
    });
})();
