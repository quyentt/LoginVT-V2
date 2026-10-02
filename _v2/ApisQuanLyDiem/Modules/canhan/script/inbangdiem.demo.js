/* Dữ liệu mẫu cho canhan/inbangdiem — chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {};
    var SV = [['NH01', 'BIT220101', 'Nguyễn Văn', 'An', 0], ['NH02', 'BIT220102', 'Trần Thị', 'Bình', 2500000], ['NH03', 'BIT220103', 'Lê Minh', 'Châu', 0]]
        .map(function (x, i) {
            return { ID: 'R' + i, QLSV_NGUOIHOC_ID: x[0], QLSV_NGUOIHOC_MASO: x[1], QLSV_NGUOIHOC_HODEM: x[2], QLSV_NGUOIHOC_TEN: x[3], QLSV_NGUOIHOC_NGAYSINH: '0' + (i + 1) + '/05/2004',
                QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học', TONGNOPHI: x[4], DAOTAO_LOPQUANLY_ID: 'LQ1', DAOTAO_LOPQUANLY_TEN: 'K67-KTPM1', DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm',
                DAOTAO_KHOADAOTAO_TEN: 'Khóa 67', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', DTBTICHLUYHE4TOANKHOA: 3.1 + i / 10, DTBTICHLUYHE10TOANKHOA: 7.6 + i / 10,
                SOTCTICHLUYTOANKHOA: 60 + i, DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1' };
        });
    fx['D_BaoCao/LayDanhSachHoSoNhieuNganh'] = function (o) { return { rows: SV.slice(0, Math.min(o.pageSize || 10, SV.length)), pager: SV.length }; };
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DIEM.PHAMVITONGHOPDIEM'] = [{ ID: 'PV1', MA: 'TOANKHOA', TEN: 'Toàn khóa' }, { ID: 'PV2', MA: 'NHIEUKY', TEN: 'Nhiều kỳ' },
        { ID: 'PV3', MA: 'NAMHOC', TEN: 'Năm học' }, { ID: 'PV4', MA: 'HOCKY', TEN: 'Học kỳ' }, { ID: 'PV5', MA: 'DOTHOC', TEN: 'Đợt học' }];
    fx['pkg_kehoach_thongtin.LayDSKhoaQuanLy'] = [{ ID: 'KQL1', TEN: 'Khoa Công nghệ thông tin' }, { ID: 'KQL2', TEN: 'Khoa Kinh tế' }];
    fx['pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao'] = [{ ID: 'TG1', DAOTAO_THOIGIANDAOTAO: '2026_2027_1' }, { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: '2025_2026_2' }];
    fx['TN_KeHoach/LayDSPhanLoaiXetTheoND1'] = [{ ID: 'LX1', TEN: 'Xét tốt nghiệp' }];
    fx['TN_ThongTin/LayDSTN_KeHoach'] = function (o) { return o.strPhanLoai_Id ? [{ ID: 'KH1', TEN: 'Xét TN đợt 1/2027' }] : []; };
    fx['KHCT_NamNhapHoc/LayDanhSach'] = [{ NAMNHAPHOC: '2022' }, { NAMNHAPHOC: '2023' }];
    fx['D_BaoCao/LayDSDiemKetThucCaNhan'] = [{ ID: 'D1', DAOTAO_HOCPHAN_ID: 'HP1', DAOTAO_HOCPHAN_MA: 'IT3100', DAOTAO_HOCPHAN_TEN: 'Lập trình hướng đối tượng', DAOTAO_HOCPHAN_SOTC: 3,
        DIEM: 8.2, LANHOC: 1, LANTHI: 1, DANHGIA_TEN: 'Đạt', DIEMQUYDOI: 3.5, DIEMQUYDOI_TEN: 'B+', THOIGIAN: '2025_2026_1' },
        { ID: 'D2', DAOTAO_HOCPHAN_ID: 'HP2', DAOTAO_HOCPHAN_MA: 'IT3200', DAOTAO_HOCPHAN_TEN: 'Cơ sở dữ liệu', DAOTAO_HOCPHAN_SOTC: 3,
        DIEM: 3.5, LANHOC: 1, LANTHI: 2, DANHGIA_TEN: 'Chưa đạt', DIEMQUYDOI: 0, DIEMQUYDOI_TEN: 'F', THOIGIAN: '2025_2026_2' }];
    fx['D_BaoCao/LayDSDiemThanhPhanCaNhan'] = [{ TEN: 'Chuyên cần', DIEM: 9, LANHOC: 1, LANTHI: 1 }, { TEN: 'Cuối kỳ', DIEM: 8, LANHOC: 1, LANTHI: 1 }];
    fx['SV_ThongTin/KetQuaHocTapCaNhan'] = { rows: { rsDiemKetThucHocPhan: [{ ID: 'K1', NAMHOC: '2025-2026', HOCKY: 1, DAOTAO_HOCPHAN_MA: 'IT3100', DAOTAO_HOCPHAN_TEN: 'Lập trình hướng đối tượng',
        DAOTAO_HOCPHAN_HOCTRINH: 3, LANHOC: 1, LANTHI: 1, DIEM: 8.2, DIEMQUYDOI: 3.5, DIEMQUYDOI_TEN: 'B+', DANHGIA_TEN: 'Đạt', GHICHU: '' }],
        rsDiemTrungBinhChung: [{ DAOTAO_THOIGIANDAOTAO_ID: 'TG1', LOAIDIEMTRUNGBINH_MA: 'TRUNGBINHCHUNG', THUOCTINHLANTINH: 0, THANGDIEM_MA: '10', NAMHOC: '2025-2026', DAOTAO_THOIGIANDAOTAO_KY: 1,
            PHAMVITONGHOPDIEM_TEN: 'HOCKY', TONGSOTINCHI: 18, DIEMTRUNGBINH: 7.9 }], rsDiemThanhPhan: [] } };
    fx['SV_ThongTin/LayKetQuaTichLuyTheoKhoi'] = { rows: { rsTongHop: [{ MAKHOI: 'DC', TENKHOI: 'Đại cương', TONGSOTINCHICUAKHOI: 40, SOBATBUOC: 30, SODATICHLUY: 28, SOTINCHINO: 2 },
        { MAKHOI: 'CSN', TENKHOI: 'Cơ sở ngành', TONGSOTINCHICUAKHOI: 45, SOBATBUOC: 40, SODATICHLUY: 30, SOTINCHINO: 3 }],
        rsChiTiet: [{ MAKHOI: 'DC', TENKHOI: 'Đại cương', DAOTAO_HOCPHAN_MA: 'MI1110', DAOTAO_HOCPHAN_TEN: 'Giải tích 1', DAOTAO_HOCPHAN_HOCTRINH: 4, DIEM: 7, DANHGIA_TEN: 'Đạt', DIEMQUYDOI: 3, DIEMQUYDOI_TEN: 'B', KETQUA: 1 },
            { MAKHOI: 'DC', TENKHOI: 'Đại cương', DAOTAO_HOCPHAN_MA: 'PH1110', DAOTAO_HOCPHAN_TEN: 'Vật lý 1', DAOTAO_HOCPHAN_HOCTRINH: 3, DIEM: 6.5, DANHGIA_TEN: 'Đạt', DIEMQUYDOI: 2.5, DIEMQUYDOI_TEN: 'C+', KETQUA: 1, HOCPHANTHUA: 1, HOCPHANTHUA_LOAIXULY: 'tự chọn' }] } };
    fx['SV_ThongTin/LayDSHocPhanChuHoanThanh'] = [{ DAOTAO_HOCPHAN_MA: 'IT3200', DAOTAO_HOCPHAN_TEN: 'Cơ sở dữ liệu', DAOTAO_HOCPHAN_HOCTRINH: 3, DIEM: 3.5, DIEMQUYDOI: 0, DANHGIA_TEN: 'Chưa đạt', LANHOC: 1, LANTHI: 2, THOIGIAN: '2025_2026_2' }];
    fx['SV_ThongTin/LayDSKetQuaChungChi'] = [{ PHANLOAI_TEN: 'Chuẩn đầu ra tiếng Anh', XEPLOAI_TEN: 'Đạt B1' }];
    fx['SV_ThongTin/LayDSThoiGianLichHoc'] = [{ ID: 'TG1', THOIGIAN: '2026_2027_1' }, { ID: 'TG2', THOIGIAN: '2025_2026_2' }];
    fx['SV_ThongTin/LayKetQuaDangKyHocCaNhan'] = { rows: { rsKetQuaDangKy: [{ DANGKY_LOPHOCPHAN_MA: 'IT3100.01', DANGKY_LOPHOCPHAN_TEN: 'Lập trình hướng đối tượng - 01', DAOTAO_HOCPHAN_MA: 'IT3100',
        DAOTAO_KHOAMOLOPHP_TEN: 'Khóa 67', DAOTAO_HOCPHAN_HOCTRINH: 3, THONGTINGIANGVIEN: 'Nguyễn Văn Hùng', KIEUHOC_TEN: 'Học đi', NGAYTAO_DD_MM_YYYY_HHMMSS: '20/08/2026 09:12:33',
        NGUOITAO_TAIKHOAN: 'bit220101', THOIGIAN: '2026_2027_1', DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm' }],
        rsLichSuDangKy: [{ NGUOITHUCHIEN_TAIKHOAN: 'bit220101', HANHDONG: 'Đăng ký', KETQUA: 'Thành công', THOIGIANTHUCHIEN: '20/08/2026 09:12:33', MAHOCPHAN: 'IT3100',
            TENHOCPHAN: 'Lập trình hướng đối tượng', DSLOPHOCPHAN: 'IT3100.01', DAOTAO_CHUONGTRINH_MA: 'KTPM', DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm' }] } };
    fx['pkg_congthongtin_hssv_thongtin.LatKetQuaDiemKetThucHocPhan'] = [{ ID: 'KT1', DAOTAO_HOCPHAN_MA: 'IT3100', DAOTAO_HOCPHAN_TEN: 'Lập trình hướng đối tượng', DIEM: 8.2, LANHOC: 1, LANTHI: 1,
        DANHGIA_TEN: 'Đạt', DIEMQUYDOI: 3.5, DIEMQUYDOI_TEN: 'B+', DIEM_DANHSACHHOC_TEN: 'IT3100.01', THOIGIAN: '2025_2026_1', KHONGTINHDIEM: 0 },
        { ID: 'KT2', DAOTAO_HOCPHAN_MA: 'PE1010', DAOTAO_HOCPHAN_TEN: 'Giáo dục thể chất 1', DIEM: 7, LANHOC: 1, LANTHI: 1,
        DANHGIA_TEN: 'Đạt', DIEMQUYDOI: 3, DIEMQUYDOI_TEN: 'B', DIEM_DANHSACHHOC_TEN: 'PE1010.02', THOIGIAN: '2025_2026_1', KHONGTINHDIEM: 1 }];
    fx['pkg_diem_tonghop_xuly.XuLyKhongTinhDiem'] = [];
    /* Kết quả đăng ký cả lớp (ums.ibd.caLop) */
    fx['NS_ThongTinCanBo/LayDSThoiGianDKTheoLopQL'] = [{ ID: 'TG1', TEN: 'Kỳ 1, 2026-2027' }, { ID: 'TG2', TEN: 'Kỳ 2, 2025-2026' }];
    fx['NS_ThongTinCanBo/LayDSHocPhanDKTheoLop'] = [{ ID: 'HP1', TEN: 'IT3100' }, { ID: 'HP2', TEN: 'IT3200' }];
    fx['NS_ThongTinCanBo/LayDSNguoiHocTheoLopQL'] = SV.map(function (s) { return { ID: s.QLSV_NGUOIHOC_ID, QLSV_NGUOIHOC_MASO: s.QLSV_NGUOIHOC_MASO, QLSV_NGUOIHOC_HODEM: s.QLSV_NGUOIHOC_HODEM,
        QLSV_NGUOIHOC_TEN: s.QLSV_NGUOIHOC_TEN, QLSV_NGUOIHOC_NGAYSINH: s.QLSV_NGUOIHOC_NGAYSINH, QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học', TONGNOPHI: s.TONGNOPHI, SOTINHOCDI: 18, SOTINHOCLAI: 0, SOTINHOCNANGDIEM: 0 }; });
    fx['DKH_Chung/KiemTraNguoiHocDangKyHocPhan'] = function (o) { return o.strQLSV_NguoiHoc_Id === 'NH02' && o.strDaoTao_HocPhan_Id === 'HP2' ? [] : [{ KETQUA: 1, SOTIETVANGMAT: o.strQLSV_NguoiHoc_Id === 'NH01' ? 3 : 0, SOBUOIVANGMAT: o.strQLSV_NguoiHoc_Id === 'NH01' ? 1 : 0 }]; };
    ums.demo.add(fx);
})();
