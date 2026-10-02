/* Dữ liệu mẫu cho nguoihocxacnhanthanhtoan — chỉ dùng ở chế độ dựng thử.
   Dùng chung cho bản Cổng sinh viên (ApisCongSinhVien/…/nguoihocxacnhanthanhtoan.html nạp chéo tệp .js này). */
ums.demo.add({
    'PKG_CORE_XACNHAN_HOSO.LayDS_Core_Person_KH_XN_By': [
        { ID: 'KHXN01', TEN: 'Xác nhận thông tin thanh toán học phí HK1 2026-2027', TUNGAY: '01/09/2026', DENNGAY: '30/09/2026',
          MOTA: 'Sinh viên kiểm tra số tài khoản, người thanh toán trước khi nhà trường đối soát.' },
        { ID: 'KHXN02', TEN: 'Xác nhận thông tin cá nhân năm 2026', TUNGAY: '15/08/2026', DENNGAY: '15/10/2026', MOTA: 'Kiểm tra họ tên, ngày sinh, CCCD.' }
    ],
    'PKG_CORE_XACNHAN_HOSO.LayDS_Core_Person_KH_TT_XN': [
        { CORE_PERSON_ID: 'SV0001', CORE_PERSON_KEHOACH_XACNHAN_ID: 'KHXN01', ID: 'TT01', TENHIENTHI: 'Họ và tên', GIATRIDULIEUNGUON: 'Đặng Bác Ái', BANGDULIEUNGUON: 'QLSV_NGUOIHOC', TRUONGDULIEUNGUON: 'HOTEN', DIEUKIENLOC: '',
          CORE_PS_HS_XN_HanhDong_NH_Ten: 'Đúng', CORE_PS_HS_XN_HanhDong_NH_MoTa: '', CORE_PS_HS_XN_HanhDong_ND_Ten: 'Đã duyệt', CORE_PS_HS_XN_HanhDong_ND_MoTa: '' },
        { CORE_PERSON_ID: 'SV0001', CORE_PERSON_KEHOACH_XACNHAN_ID: 'KHXN01', ID: 'TT02', TENHIENTHI: 'Ngày sinh', GIATRIDULIEUNGUON: '12/03/2005', BANGDULIEUNGUON: 'QLSV_NGUOIHOC', TRUONGDULIEUNGUON: 'NGAYSINH', DIEUKIENLOC: '',
          CORE_PS_HS_XN_HanhDong_NH_Ten: 'Sai', CORE_PS_HS_XN_HanhDong_NH_MoTa: 'Ngày sinh đúng là 21/03/2005' },
        { CORE_PERSON_ID: 'SV0001', CORE_PERSON_KEHOACH_XACNHAN_ID: 'KHXN01', ID: 'TT03', TENHIENTHI: 'Số tài khoản thanh toán', GIATRIDULIEUNGUON: '0451000123456 - Vietcombank', BANGDULIEUNGUON: 'TC_TAIKHOAN', TRUONGDULIEUNGUON: 'SOTAIKHOAN', DIEUKIENLOC: '' },
        { CORE_PERSON_ID: 'SV0001', CORE_PERSON_KEHOACH_XACNHAN_ID: 'KHXN01', ID: 'TT04', TENHIENTHI: 'Người thanh toán', GIATRIDULIEUNGUON: 'Đặng Văn Bình (bố)', BANGDULIEUNGUON: 'TC_TAIKHOAN', TRUONGDULIEUNGUON: 'NGUOITHANHTOAN', DIEUKIENLOC: '' }
    ],
    'PKG_CORE_XACNHAN_HOSO.LayDS_LoaiXacNhan': [{ ID: 'LXN01', TEN: 'Xác nhận thông tin thanh toán' }],
    'PKG_CORE_XACNHAN_HOSO.LayDS_HanhDong': [{ ID: 'HD01', TEN: 'Đúng' }, { ID: 'HD02', TEN: 'Sai — đề nghị sửa' }]
});
