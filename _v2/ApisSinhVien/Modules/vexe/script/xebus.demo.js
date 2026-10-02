/* Dữ liệu mẫu cho vexe/xebus — chỉ dùng ở chế độ dựng thử. */
ums.demo.add({
    'SV_XeBus/LayDSKeHoach_DichVu_XeBus': [
        { ID: 'KHXB01', TENKEHOACH: 'Đăng ký xe buýt học kỳ 1 năm 2026-2027', HIEULUC: 1, NGAYBATDAU: '15/08/2026', NGAYKETTHUC: '15/09/2026' },
        { ID: 'KHXB02', TENKEHOACH: 'Đăng ký xe buýt học kỳ 2 năm 2025-2026', HIEULUC: 0, NGAYBATDAU: '05/01/2026', NGAYKETTHUC: '31/01/2026' }
    ],
    'SV_XeBus/LayDSKeHoach_DichVu_Thang': [
        { ID: 'TH01', NAM: 2026, THANG: 9 }, { ID: 'TH02', NAM: 2026, THANG: 10 }, { ID: 'TH03', NAM: 2026, THANG: 11 }
    ],
    'SV_XeBus/LayDSQLSV_XeBus_TuyenXe': [
        { ID: 'TX01', MA: '32', TEN: 'Giáp Bát - Nhổn', MOTA: 'Đón tại cổng chính' },
        { ID: 'TX02', MA: '20A', TEN: 'Cầu Giấy - Phùng', MOTA: '' }
    ],
    'SV_XeBus/LayDSKeHoach_DichVu_PhamVi': [
        { ID: 'PV01', PHAMVIAPDUNG_TEN: 'Khóa 2026 - Đại học chính quy' },
        { ID: 'PV02', PHAMVIAPDUNG_TEN: 'Lớp DCQT.14.1' }
    ],
    'SV_XeBus/LayDSKeHoach_XeBus_DangKy': [
        { ID: 'DK01', QLSV_NGUOIHOC_MASO: '25001029', QLSV_NGUOIHOC_HODEM: 'Lăng Văn', QLSV_NGUOIHOC_TEN: 'Huy', DAOTAO_LOPQUANLY_TEN: 'DCOT.16.2',
          DAOTAO_CHUONGTRINH_TEN: 'Công nghệ thông tin', DAOTAO_KHOAHOC_TEN: 'Khóa 2025', DIENTHOAILIENHE: '0912 345 678' },
        { ID: 'DK02', QLSV_NGUOIHOC_MASO: '25001030', QLSV_NGUOIHOC_HODEM: 'Nguyễn Thị', QLSV_NGUOIHOC_TEN: 'Hà', DAOTAO_LOPQUANLY_TEN: 'DCQT.14.1',
          DAOTAO_CHUONGTRINH_TEN: 'Quản trị kinh doanh', DAOTAO_KHOAHOC_TEN: 'Khóa 2024', DIENTHOAILIENHE: '0987 111 222' }
    ],
    'SV_XeBus/Them_KeHoach_DichVu_XeBus': { rows: [], raw: { Id: 'KHXB09' } }
});
