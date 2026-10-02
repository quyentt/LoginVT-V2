/* Dữ liệu mẫu cho thutuchanhchinh/giayto — chỉ dùng ở chế độ dựng thử. */
ums.demo.add({
    'SV_MotCua_DanhMuc/LayDanhSach': [
        { ID: 'DM01', MA: 'XNSV', TEN: 'Giấy xác nhận sinh viên', DONVIPHUTRACH_ID: 'DV01', DONVIPHUTRACH_TEN: 'Phòng Công tác sinh viên', SOLUONGTOIDA: 3,
          SONGAY_XULY: 2, SOGIO_XULY: 0, SOPHUT_XULY: 0, HIEULUC: 1, THUTU: 1, MOTA: 'Cấp trong 2 ngày làm việc' },
        { ID: 'DM02', MA: 'BDTA', TEN: 'Bảng điểm tiếng Anh', DONVIPHUTRACH_ID: 'DV02', DONVIPHUTRACH_TEN: 'Phòng Đào tạo', SOLUONGTOIDA: 2,
          SONGAY_XULY: 5, SOGIO_XULY: 0, SOPHUT_XULY: 0, HIEULUC: 1, THUTU: 2, MOTA: '' },
        { ID: 'DM03', MA: 'VAYVON', TEN: 'Giấy xác nhận vay vốn', DONVIPHUTRACH_ID: 'DV01', DONVIPHUTRACH_TEN: 'Phòng Công tác sinh viên', SOLUONGTOIDA: 1,
          SONGAY_XULY: 1, SOGIO_XULY: 4, SOPHUT_XULY: 30, HIEULUC: 0, THUTU: 3, MOTA: 'Tạm ngừng' }
    ],
    'pkg_nhansu_hoso_v2.LayDanhSachToanBo': [
        { ID: 'DV01', MA: 'CTSV', TEN: 'Phòng Công tác sinh viên' },
        { ID: 'DV02', MA: 'DT', TEN: 'Phòng Đào tạo' }
    ],
    'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#MOTCUA.TRUONGTHONGTIN': [
        { ID: 'TR01', MA: 'Nhập lý do', TEN: 'Lý do xin xác nhận' },
        { ID: 'TR02', MA: 'Nhập số', TEN: 'Số bản' },
        { ID: 'TR03', MA: 'Chọn', TEN: 'Nơi nhận' }
    ],
    'SV_MotCua_DanhMuc_MoRong/LayDanhSach': function (o) {
        return o.strMotCua_DanhMuc_Id === 'DM01' ? [{ ID: 'MR01', TRUONGTHONGTIN_ID: 'TR01' }, { ID: 'MR02', TRUONGTHONGTIN_ID: 'TR02' }] : [];
    },
    'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#MOTCUA.HINHTHUCTHANHTOAN': [
        { ID: 'HT1', TEN: 'Chuyển khoản' }, { ID: 'HT2', TEN: 'Tiền mặt' }
    ],
    'TC_KhoanThu/LayDanhSach': [
        { ID: 'KT01', MA: 'LPXN', TEN: 'Lệ phí cấp giấy xác nhận' },
        { ID: 'KT02', MA: 'LPBD', TEN: 'Lệ phí cấp bảng điểm' }
    ],
    'SV_MotCua_DanhMuc_Phi/LayDanhSach': [
        { ID: 'PH01', TAICHINH_CACKHOANTHU_ID: 'KT01', TAICHINH_CACKHOANTHU_TEN: 'Lệ phí cấp giấy xác nhận', SOTIEN: 10000,
          HINHTHUCTHANHTOAN_ID: 'HT1', HINHTHUCTHANHTOAN_TEN: 'Chuyển khoản', NGAYAPDUNG: '01/09/2026', MOTA: '', MOTCUA_DANHMUC_TEN: 'Giấy xác nhận sinh viên' }
    ],
    'SV_MotCua_DanhMuc_PhanCong/LayDanhSach': [
        { ID: 'PC01', MOTCUA_DANHMUC_TEN: 'Giấy xác nhận sinh viên', PHAMVIAPDUNG_ID: 'K2025', PHAMVIAPDUNG_TEN: 'Khóa 2025', NGUOIDUNG_ID: 'NS01',
          NGUOIDUNG_TAIKHOAN: 'trangpt', VAITRO_TEN: '', MOTA: '' }
    ],
    'NS_HoSoV2/LayDanhSach': [
        { ID: 'NS01', HOTEN: 'Phạm Thu Trang', MASO: 'CB0102' },
        { ID: 'NS02', HOTEN: 'Lê Quốc Việt', MASO: 'CB0215' }
    ],
    'SV_MotCua_Chung/LayDSNguoiDung': [
        { ID: 'ND01', TENDAYDU: 'Phạm Thu Trang', TAIKHOAN: 'trangpt' },
        { ID: 'ND02', TENDAYDU: 'Lê Quốc Việt', TAIKHOAN: 'vietlq' }
    ],
    'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#MOTCUA.TINHTRANGXULY': [
        { ID: 'TT1', TEN: 'Đã tiếp nhận' }, { ID: 'TT2', TEN: 'Đang xử lý' }, { ID: 'TT4', TEN: 'Đã hoàn thành' }
    ],
    'SV_MotCua_TT_NguoiDung/LayDanhSach': [{ ID: 'TN01', NGUOIDUNG_ID: 'ND01', TINHTRANGXULY_ID: 'TT1' }],
    'SV_MotCua_DanhMuc_NgayLV/LayDanhSach': [{ ID: 'LV01', MOTCUA_DANHMUC_TEN: 'Giấy xác nhận sinh viên', THUTRONGTUAN: '2,3,4,5,6' }]
});
