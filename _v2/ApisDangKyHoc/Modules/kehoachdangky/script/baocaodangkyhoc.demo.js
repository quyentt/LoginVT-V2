/* Dữ liệu mẫu cho Báo cáo đăng ký học — chỉ dùng ở chế độ dựng thử. */
(function () {
    var LOP = [
        ['LHP1', 'IT3100.01', 'Lập trình hướng đối tượng - Nhóm 01', 'Thứ 2, tiết 1-3, phòng D3-201<br>Thứ 5, tiết 7-9, phòng D3-204', 58, 60, 0],
        ['LHP2', 'IT3100.02', 'Lập trình hướng đối tượng - Nhóm 02', 'Thứ 3, tiết 4-6, phòng D5-101', 41, 60, 0],
        ['LHP3', 'IT3080.01', 'Mạng máy tính - Nhóm 01', 'Thứ 4, tiết 1-3, phòng TC-312', 0, 50, 0],
        ['LHP4', 'EM1010.05', 'Quản trị học đại cương - Lớp riêng K66', 'Thứ 7, tiết 1-5, phòng B1-105', 23, 30, 1]
    ].map(function (x) { return { ID: x[0], MALOP: x[1], TENLOP: x[2], THOIGIANCHITIET: x[3], SOSVDADANGKY: x[4], SOLUONGDUKIENHOC: x[5], HOCPHITINHRIENG: x[6] }; });
    var SV = [
        ['BIT220263', 'Nguyễn Văn', 'An', '12/03/2004', 'K66-KTPM1'],
        ['BIT220271', 'Trần Thị', 'Bình', '05/07/2004', 'K66-KTPM1'],
        ['BIT220288', 'Lê Hoàng', 'Cường', '21/11/2004', 'K66-KTPM2']
    ].map(function (x, i) {
        return { ID: 'SV' + i, QLSV_NGUOIHOC_MASO: x[0], QLSV_NGUOIHOC_HODEM: x[1], QLSV_NGUOIHOC_TEN: x[2], QLSV_NGUOIHOC_NGAYSINH: x[3],
            QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học', DAOTAO_LOPQUANLY_TEN: x[4], DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm',
            DAOTAO_KHOADAOTAO_TEN: 'Khóa 66', KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy' };
    });
    ums.demo.add({
        'DKH_Chung/LayThoiGianDangKyHoc': [{ ID: 'TG20261', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm 2026-2027' }, { ID: 'TG20252', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 năm 2025-2026' }],
        'DKH_PhanCong_LopHP/LayDSKhoaToChuc': [{ ID: 'K66', TENKHOA: 'Khóa 66' }, { ID: 'K67', TENKHOA: 'Khóa 67' }],
        'DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc': [{ ID: 'CTKTPM', TENCHUONGTRINH: 'Kỹ thuật phần mềm' }, { ID: 'CTQTKD', TENCHUONGTRINH: 'Quản trị kinh doanh' }],
        'DKH_PhanCong_LopHP/LayDSHocPhan': function (o) {
            return o.strDaoTao_ThoiGianDaoTao_Id || o.strDaoTao_HeDaoTao_Id ? [{ ID: 'HP01', MA: 'IT3100', TEN: 'Lập trình hướng đối tượng' }, { ID: 'HP02', MA: 'IT3080', TEN: 'Mạng máy tính' }, { ID: 'HP03', MA: 'EM1010', TEN: 'Quản trị học đại cương' }] : [];
        },
        'DKH_Chung/LayDSHinhThucHoc': [{ ID: 'HT1', TENHINHTHUCHOC: 'Trực tiếp' }, { ID: 'HT2', TENHINHTHUCHOC: 'Trực tuyến' }],
        'DKH_ThongTin/LayDSDangKy_KeHoachDangKy': function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'KH01', TENKEHOACH: 'Đăng ký học kỳ 1 năm 2026-2027 — đợt chính' }, { ID: 'KH02', TENKEHOACH: 'Đăng ký bổ sung học kỳ 1' }] : []; },
        'KHCT_CoSoDaoTao/LayDanhSach': [{ ID: 'CS1', TEN: 'Cơ sở Hà Nội' }, { ID: 'CS2', TEN: 'Cơ sở Hưng Yên' }],
        'pkg_kehoach_thongtin.LayDSKhoaQuanLy': [{ ID: 'KQL1', TEN: 'Khoa Công nghệ thông tin' }, { ID: 'KQL2', TEN: 'Khoa Kinh tế' }],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KHDT.DIEM.KIEUHOC': [
            { ID: 'KIEU1', MA: 'LD', TEN: 'Học lần đầu', CHUNG_TENDANHMUC_TEN: 'Kiểu học' },
            { ID: 'KIEU2', MA: 'HL', TEN: 'Học lại', CHUNG_TENDANHMUC_TEN: 'Kiểu học' },
            { ID: 'KIEU3', MA: 'CT', TEN: 'Học cải thiện', CHUNG_TENDANHMUC_TEN: 'Kiểu học' }],
        'DKH_BaoCao/LayDSLopHocPhanPhanTrang': function (o) {
            var r = LOP.filter(function (x) { return !o.dChiLayCacLopChuaPhanCong || !x.SOSVDADANGKY; });
            return { rows: r, pager: r.length };
        },
        'DKH_PhanCong_LopHP/LayDSDangKyHoc': SV
    });
})();
