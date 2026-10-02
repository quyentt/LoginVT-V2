/* Dữ liệu mẫu cho thutuchanhchinh/canboxuly — chỉ dùng ở chế độ dựng thử. */
ums.demo.add({
    'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#MOTCUA.DIEMMOCKIEMTRA': [
        { ID: 'MOC1', TEN: 'Quá hạn xử lý' }, { ID: 'MOC2', TEN: 'Sắp đến hạn (còn 1 ngày)' }, { ID: 'MOC3', TEN: 'Trong hạn' }
    ],
    'SV_MotCua_Chung/LayDSNguoiDung': [
        { ID: 'ND01', TENDAYDU: 'Phạm Thu Trang', TAIKHOAN: 'trangpt' },
        { ID: 'ND02', TENDAYDU: 'Lê Quốc Việt', TAIKHOAN: 'vietlq' }
    ],
    'SV_MotCua_XuLy/LayDMucTinhTrangXuLy': [
        { ID: 'TT1', TEN: 'Đã tiếp nhận' }, { ID: 'TT2', TEN: 'Đang xử lý' }, { ID: 'TT3', TEN: 'Cần bổ sung hồ sơ' }, { ID: 'TT4', TEN: 'Đã hoàn thành' }
    ],
    'SV_MotCua_XuLy/LayDSTinhTrangXuLyTiep': [{ ID: 'TT2', TEN: 'Đang xử lý' }, { ID: 'TT3', TEN: 'Cần bổ sung hồ sơ' }],
    'SV_MotCua_XuLy/LayDSTheoDoiTinhTrangYeuCau': [
        { ID: 'YC01', QLSV_NGUOIHOC_ID: 'SV01', QLSV_NGUOIHOC_MASO: '25001029', QLSV_NGUOIHOC_HODEM: 'Lăng Văn', QLSV_NGUOIHOC_TEN: 'Huy',
          DAOTAO_LOPQUANLY_TEN: 'DCOT.16.2', DAOTAO_KHOADAOTAO_TEN: 'Khóa 2025', THONGTINYEUCAU: 'Giấy xác nhận sinh viên', SOLUONG: 2,
          NGAYTAO_DD_MM_YYYY: '20/09/2026', NGAYTAO_DUKIEN_DD_MM_YYYY: '23/09/2026', NGAYTAO_THUCTE_DD_MM_YYYY: '',
          TINHTRANGHIENTAI_TEN: 'Đang xử lý', CANBOXULY_TAIKHOAN: 'trangpt', DANHGIACHATLUONG_MA: '', NHANXET: '', TRALOI: '',
          MOTCUA_DANHMUC_ID: 'DM01', DUONGDANFILE: '' },
        { ID: 'YC02', QLSV_NGUOIHOC_ID: 'SV02', QLSV_NGUOIHOC_MASO: '24000812', QLSV_NGUOIHOC_HODEM: 'Nguyễn Thị', QLSV_NGUOIHOC_TEN: 'Hà',
          DAOTAO_LOPQUANLY_TEN: 'DCQT.14.1', DAOTAO_KHOADAOTAO_TEN: 'Khóa 2024', THONGTINYEUCAU: 'Bảng điểm tiếng Anh', SOLUONG: 1,
          NGAYTAO_DD_MM_YYYY: '12/09/2026', NGAYTAO_DUKIEN_DD_MM_YYYY: '17/09/2026', NGAYTAO_THUCTE_DD_MM_YYYY: '16/09/2026',
          TINHTRANGHIENTAI_TEN: 'Đã hoàn thành', CANBOXULY_TAIKHOAN: 'vietlq', DANHGIACHATLUONG_MA: '4', NHANXET: 'Nhanh, đúng hẹn', TRALOI: 'vietlq',
          MOTCUA_DANHMUC_ID: 'DM02', DUONGDANFILE: '' }
    ],
    'SV_MotCua_XuLy/LayDSLichSuXuLyYeuCau': [
        { QLSV_NGUOIHOC_MASO: '25001029', QLSV_NGUOIHOC_HODEM: 'Lăng Văn', QLSV_NGUOIHOC_TEN: 'Huy', MOTCUA_DANHMUC_TEN: 'Giấy xác nhận sinh viên',
          TINHTRANGXULY_TEN: 'Đã tiếp nhận', NGUOIXULY_TAIKHOAN: 'trangpt', NGAYTAO_DD_MM_YYYY: '20/09/2026', NGAYXULY_DD_MM_YYYY: '21/09/2026' },
        { QLSV_NGUOIHOC_MASO: '25001029', QLSV_NGUOIHOC_HODEM: 'Lăng Văn', QLSV_NGUOIHOC_TEN: 'Huy', MOTCUA_DANHMUC_TEN: 'Giấy xác nhận sinh viên',
          TINHTRANGXULY_TEN: 'Đang xử lý', NGUOIXULY_TAIKHOAN: 'trangpt', NGAYTAO_DD_MM_YYYY: '20/09/2026', NGAYXULY_DD_MM_YYYY: '22/09/2026' }
    ],
    'SV_MotCua_ThongTin/LayDSMotCua_NH_YC_XL_PhanHoi': [
        { ID: 'PH1', NGUOITAO_ID: 'SV01', NGUOITAO_TAIKHOAN: '25001029', NGUOITAO_TENDAYDU: 'Lăng Văn Huy', NOIDUNG: 'Em cần giấy trước thứ Sáu ạ.', NGAYTAO_DD_MM_YYYY: '20/09/2026' },
        { ID: 'PH2', NGUOITAO_ID: 'ND01', NGUOITAO_TAIKHOAN: 'trangpt', NGUOITAO_TENDAYDU: 'Phạm Thu Trang', NOIDUNG: 'Phòng sẽ trả vào chiều thứ Năm.', NGAYTAO_DD_MM_YYYY: '21/09/2026' }
    ]
});
