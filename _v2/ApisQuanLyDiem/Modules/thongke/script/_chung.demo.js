/* Dữ liệu mẫu dùng chung cho thongke/diemhocphan, diemtrungbinh, tonghopketqua (Quản lý điểm) — chỉ dùng ở chế độ dựng thử.
   Hệ / khoá / chương trình / lớp / thời gian / khoa quản lý / cơ cấu tổ chức: dữ liệu mẫu chung của demo-data.js. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    var fx = {};
    fx[D + 'DIEM.PHAMVITONGHOPDIEM'] = [{ ID: 'PV1', MA: 'TOANKHOA', TEN: 'Toàn khóa' }, { ID: 'PV2', MA: 'NHIEUKY', TEN: 'Nhiều kỳ' },
        { ID: 'PV3', MA: 'NAMHOC', TEN: 'Năm học' }, { ID: 'PV4', MA: 'HOCKY', TEN: 'Học kỳ' }, { ID: 'PV5', MA: 'DOTHOC', TEN: 'Đợt học' }];
    fx[D + 'DIEM.THANGDIEM'] = [{ ID: 'TD10', MA: '10', TEN: 'Thang điểm 10' }, { ID: 'TD4', MA: '4', TEN: 'Thang điểm 4' }];
    fx[D + 'DIEM.LOAIDANHSACH'] = [{ ID: 'LDS1', MA: 'CAO', TEN: 'Danh sách điểm cao' }, { ID: 'LDS2', MA: 'THAP', TEN: 'Danh sách điểm thấp' }];
    fx[D + 'DIEM.LOAIDIEMTRUNGBINH'] = [{ ID: 'DTB1', MA: 'TBC', TEN: 'Điểm trung bình chung' }, { ID: 'DTB2', MA: 'TBTL', TEN: 'Điểm trung bình tích lũy' }];
    fx['pkg_kehoach_thongtin.LayDSNamNhapHoc'] = [{ NAMNHAPHOC: '2023' }, { NAMNHAPHOC: '2024' }, { NAMNHAPHOC: '2025' }];
    fx['D_ThanhPhanDiem/LayDanhSach'] = [{ ID: 'TP1', TEN: 'Điểm chuyên cần' }, { ID: 'TP2', TEN: 'Điểm giữa kỳ' }, { ID: 'TP3', TEN: 'Điểm thi kết thúc' }];
    fx['KHCT_HocPhan/LayDanhSach'] = function (o) { return o.strThuocBoMon_Id ? [{ ID: 'HP1', MA: 'IT3100', TEN: 'Lập trình hướng đối tượng' }, { ID: 'HP2', MA: 'IT3090', TEN: 'Cơ sở dữ liệu' }] : []; };
    var sv = [
        { QLSV_NGUOIHOC_ID: 'SV1', MASONGUOIHOC: 'BIT230001', QLSV_NGUOIHOC_HODEM: 'Nguyễn Văn', QLSV_NGUOIHOC_TEN: 'An' },
        { QLSV_NGUOIHOC_ID: 'SV2', MASONGUOIHOC: 'BIT230002', QLSV_NGUOIHOC_HODEM: 'Trần Thị', QLSV_NGUOIHOC_TEN: 'Bình' },
        { QLSV_NGUOIHOC_ID: 'SV3', MASONGUOIHOC: 'BIT230003', QLSV_NGUOIHOC_HODEM: 'Lê Minh', QLSV_NGUOIHOC_TEN: 'Châu' }];
    fx['D_ThongKe/LayDSDiem_ThongKe_DiemHP'] = sv;
    fx['D_ThongKe/LayDSDiem_ThongKe_DTB'] = sv;
    fx['D_TinhDiem/TinhDiem_TuDong_KetQua'] = [
        { QLSV_NGUOIHOC_ID: 'SV1', MASONGUOIHOC: 'BIT230001', HODEM: 'Nguyễn Văn', TEN: 'An', NGAYSINH: '12/03/2005', GIOITINH_TEN: 'Nam', LOP: 'CNTT K23A',
          NGANH: 'Công nghệ thông tin', KHOADAOTAO: 'K23', KHOAQUANLY: 'Khoa CNTT', TRANGTHAINGUOIHOC_TEN: 'Đang học', TONGSOTINCHI: 62, DIEMTRUNGBINH: 3.12 },
        { QLSV_NGUOIHOC_ID: 'SV2', MASONGUOIHOC: 'BIT230002', HODEM: 'Trần Thị', TEN: 'Bình', NGAYSINH: '05/09/2005', GIOITINH_TEN: 'Nữ', LOP: 'CNTT K23A',
          NGANH: 'Công nghệ thông tin', KHOADAOTAO: 'K23', KHOAQUANLY: 'Khoa CNTT', TRANGTHAINGUOIHOC_TEN: 'Đang học', TONGSOTINCHI: 58, DIEMTRUNGBINH: 2.87 }];
    fx['pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao'] = [{ ID: 'TGD1', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm 2025-2026' }, { ID: 'TGD2', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 năm 2025-2026' }, { ID: 'TGD3', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm 2026-2027' }];
    fx['pkg_kehoach_thongtin.LayDSKhoaQuanLy'] = [{ ID: 'KQL1', TEN: 'Khoa Công nghệ thông tin' }, { ID: 'KQL2', TEN: 'Khoa Kinh tế' }];
    ums.demo.add(fx);
})();
