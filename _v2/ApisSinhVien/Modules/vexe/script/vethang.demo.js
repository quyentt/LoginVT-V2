/* Dữ liệu mẫu cho vexe/vethang — chỉ dùng ở chế độ dựng thử. */
ums.demo.add({
    'SV_VeThang/LayDSKeHoach_DichVu_Ve': [
        { ID: 'KHVE01', TENKEHOACH: 'Vé tháng xe buýt tháng 9-12/2026', HIEULUC: 1, NGAYBATDAU: '20/08/2026', NGAYKETTHUC: '10/09/2026' },
        { ID: 'KHVE02', TENKEHOACH: 'Vé tháng xe buýt tháng 1-5/2026', HIEULUC: 0, NGAYBATDAU: '10/12/2025', NGAYKETTHUC: '31/12/2025' }
    ],
    'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLSV.VE.LOAI': [
        { ID: 'LV1', MA: 'MOTTUYEN', TEN: 'Vé một tuyến' },
        { ID: 'LV2', MA: 'LIENTUYEN', TEN: 'Vé liên tuyến' }
    ],
    'TC_KhoanThu/LayDanhSach': [
        { ID: 'KT01', MA: 'VEXB', TEN: 'Phí vé tháng xe buýt' },
        { ID: 'KT02', MA: 'LPT', TEN: 'Lệ phí làm thẻ' }
    ],
    'SV_VeThang/LayDSKeHoach_DichVu_LoaiVe': [
        { ID: 'LVK01', LOAIVE_ID: 'LV1', NAM: 2026, THANG: 9, MOTA: '' },
        { ID: 'LVK02', LOAIVE_ID: 'LV2', NAM: 2026, THANG: 9, MOTA: 'Ưu tiên sinh viên ở ký túc xá' }
    ],
    'SV_VeThang/LayDSKeHoach_DichVu_Phi': [
        { ID: 'MP01', LOAIVE_ID: 'LV1', TAICHINH_CACKHOANTHU_ID: 'KT01', SOTIEN: 55000, MOTA: 'Giá ưu tiên học sinh sinh viên' },
        { ID: 'MP02', LOAIVE_ID: 'LV2', TAICHINH_CACKHOANTHU_ID: 'KT01', SOTIEN: 100000, MOTA: '' }
    ],
    'SV_VeThang/LayDSKeHoach_Dich_Ve_PhamVi': [{ ID: 'PV01', PHAMVIAPDUNG_TEN: 'Toàn bộ hệ Đại học chính quy' }],
    'SV_VeThang/LayDSQLSV_KeHoach_Ve_DangKy': [
        { ID: 'DK01', QLSV_NGUOIHOC_MASO: '25001029', QLSV_NGUOIHOC_HODEM: 'Lăng Văn', QLSV_NGUOIHOC_TEN: 'Huy', DAOTAO_LOPQUANLY_TEN: 'DCOT.16.2',
          DAOTAO_CHUONGTRINH_TEN: 'Công nghệ thông tin', DAOTAO_KHOAHOC_TEN: 'Khóa 2025', LOAIVE_TEN: 'Vé một tuyến', SOTIEN: 55000 }
    ]
});
