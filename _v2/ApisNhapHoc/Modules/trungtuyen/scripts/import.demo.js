/* Dữ liệu mẫu cho import (Import trúng tuyển) — chỉ dùng ở chế độ dựng thử. */
ums.demo.add({
    'PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc': [
        { ID: 'KHNH_A', MA: 'NH2026', TENKEHOACH: 'Kế hoạch nhập học đại học chính quy 2026' },
        { ID: 'KHNH_B', MA: 'NHLT2026', TENKEHOACH: 'Kế hoạch nhập học liên thông 2026' }
    ],
    'NH_NguoiHoc_ThongTinTuyenSinh/Import': {
        rows: [], pager: '3@5',
        message: 'Dòng 2: Nguyễn Văn An — thêm thành công@Dòng 3: Trần Thị Bình — thêm thành công@' +
            'Dòng 4: thiếu số báo danh@Dòng 5: Lê Minh Châu — thêm thành công@Dòng 6: ngày sinh không hợp lệ (31/02/2008)'
    },
    'NH_NguoiHoc_ThongTinTuyenSinh/Xoa_QLSV_NGUOIHOC_TTTS_KeHoach': []
});
