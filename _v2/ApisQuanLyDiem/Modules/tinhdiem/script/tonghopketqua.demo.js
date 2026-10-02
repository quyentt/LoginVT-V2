/* Dữ liệu mẫu cho tinhdiem/tonghopketqua — chỉ dùng ở chế độ dựng thử. */
ums.demo.add({
    'pkg_kehoach_thongtin.LayDSKhoaQuanLy': [{ ID: 'KQL1', TEN: 'Khoa Công nghệ thông tin' }, { ID: 'KQL2', TEN: 'Khoa Kinh tế' }],
    'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao': [{ ID: 'TG1', DAOTAO_THOIGIANDAOTAO: '2026_2027_1' }, { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: '2025_2026_2' }],
    'pkg_kehoach_thongtin.LayDSNamNhapHoc': [{ NAMNHAPHOC: '2022' }, { NAMNHAPHOC: '2023' }],
    'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DIEM.PHAMVITONGHOPDIEM': [{ ID: 'PV1', MA: 'TOANKHOA', TEN: 'Toàn khóa' }, { ID: 'PV2', MA: 'NHIEUKY', TEN: 'Nhiều kỳ' },
        { ID: 'PV3', MA: 'NAMHOC', TEN: 'Năm học' }, { ID: 'PV4', MA: 'HOCKY', TEN: 'Học kỳ' }, { ID: 'PV5', MA: 'DOTHOC', TEN: 'Đợt học' }],
    'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DIEM.THANGDIEM': [{ ID: 'TD10', MA: '10', TEN: 'Thang điểm 10' }, { ID: 'TD4', MA: '4', TEN: 'Thang điểm 4' }],
    'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DIEM.LOAIDIEMTRUNGBINH': [{ ID: 'LD1', MA: 'TRUNGBINHCHUNG', TEN: 'Trung bình chung' }, { ID: 'LD2', MA: 'TRUNGBINHTICHLUY', TEN: 'Trung bình tích lũy' }],
    'D_HangDoi/TaoHangDoi_TinhDiem_TuDong': [],
    'diem_nhiemvu_hangdoi.TaoHangDoi_XepLoai_TuDong': [],
    'D_TinhDiem/TinhDiem_TuDong_KetQua': { rows: [
        { QLSV_NGUOIHOC_ID: 'NH01', MASONGUOIHOC: 'BIT220101', HODEM: 'Nguyễn Văn', TEN: 'An', NGAYSINH: '01/05/2004', GIOITINH_TEN: 'Nam', LOP: 'K67-KTPM1', NGANH: 'Kỹ thuật phần mềm',
            KHOADAOTAO: 'Khóa 67', KHOAQUANLY: 'Khoa Công nghệ thông tin', TRANGTHAINGUOIHOC_TEN: 'Đang học', TONGSOTINCHI: 18, DIEMTRUNGBINH: 7.85 },
        { QLSV_NGUOIHOC_ID: 'NH02', MASONGUOIHOC: 'BIT220102', HODEM: 'Trần Thị', TEN: 'Bình', NGAYSINH: '02/05/2004', GIOITINH_TEN: 'Nữ', LOP: 'K67-KTPM1', NGANH: 'Kỹ thuật phần mềm',
            KHOADAOTAO: 'Khóa 67', KHOAQUANLY: 'Khoa Công nghệ thông tin', TRANGTHAINGUOIHOC_TEN: 'Đang học', TONGSOTINCHI: 16, DIEMTRUNGBINH: 6.9 }], pager: 2 },
    'PKG_DIEM_THONGTIN2.LayDSTongHopKetQua_ThoiGian': [
        { ID: 'PVT1', PHAMVITONGHOPDIEM_TEN: 'Học kỳ', DAOTAO_THOIGIANDAOTAO_TINH: '2026_2027_1', DAOTAO_THOIGIANDAOTAO: '2025_2026_2, 2026_2027_1', PHAMVIAPDUNG_TEN: 'Khóa 67' },
        { ID: 'PVT2', PHAMVITONGHOPDIEM_TEN: 'Học kỳ', DAOTAO_THOIGIANDAOTAO_TINH: '2026_2027_1', DAOTAO_THOIGIANDAOTAO: '2026_2027_1', PHAMVIAPDUNG_TEN: 'BIT220101 - Nguyễn Văn An' }],
    'PKG_DIEM_THONGTIN2.Them_TongHopKetQua_ThoiGian': [],
    'PKG_DIEM_THONGTIN2.Xoa_TongHopKetQua_ThoiGian': [],
    'CMS_HangDoiTuTao/LayDanhSach': function (o) {
        return o.strLoaiNhiemVu_Id === 'TINHDIEMTUDONG'
            ? [{ ID: 'HD1', TEN: 'Tổng hợp kết quả K67', TONGDULIEUCANTHUCHIEN: 120, TONGDULIEUDAHOANTHANH: 45, NGUOITHUCHIEN_TENDAYDU: 'Nguyễn Văn Hùng', NGAYTAO_DD_MM_YYYY_HHMMSS: '24/09/2026 08:30:12' },
               { ID: 'HD0', TEN: 'Tổng hợp kết quả K66', TONGDULIEUCANTHUCHIEN: 98, TONGDULIEUDAHOANTHANH: 98, NGUOITHUCHIEN_TENDAYDU: 'Nguyễn Văn Hùng', NGAYTAO_DD_MM_YYYY_HHMMSS: '20/09/2026 14:02:40' }]
            : [{ ID: 'HD2', TEN: 'Xếp loại học tập K67', TONGDULIEUCANTHUCHIEN: 120, TONGDULIEUDAHOANTHANH: 120, NGUOITHUCHIEN_TENDAYDU: 'Lê Thị Mai', NGAYTAO_DD_MM_YYYY_HHMMSS: '22/09/2026 10:15:00' }];
    }
});
