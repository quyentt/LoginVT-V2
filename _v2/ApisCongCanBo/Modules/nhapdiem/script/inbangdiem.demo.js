/* Dữ liệu mẫu cho inbangdiem — chỉ dùng ở chế độ dựng thử (Khoa QL/Hệ/Khoá/CT/Lớp theo quyền dùng dữ liệu mẫu chung). */
(function () {
    var fx = {};
    var SV = [['NH01', 'BIT220101', 'Nguyễn Văn', 'An', 0, 'an.nv@st.truongmau.edu.vn'], ['NH02', 'BIT220102', 'Trần Thị', 'Bình', 2500000, ''], ['NH03', 'BIT220103', 'Lê Minh', 'Châu', 0, 'chau.lm@st.truongmau.edu.vn']]
        .map(function (x, i) {
            return { ID: 'R' + i, QLSV_NGUOIHOC_ID: x[0], QLSV_NGUOIHOC_MASO: x[1], QLSV_NGUOIHOC_HODEM: x[2], QLSV_NGUOIHOC_TEN: x[3], QLSV_NGUOIHOC_NGAYSINH: '0' + (i + 1) + '/05/2004',
                QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học', TONGNOPHI: x[4], DAOTAO_LOPQUANLY_ID: 'LQ1', DAOTAO_LOPQUANLY_TEN: 'KTPM01', DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm',
                DAOTAO_KHOADAOTAO_TEN: 'K67', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', DTBTICHLUYHE4TOANKHOA: 3.1 + i / 10, DTBTICHLUYHE10TOANKHOA: 7.6 + i / 10, SOTCTICHLUYTOANKHOA: 60 + i,
                DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1', EMAIL: x[5] };
        });
    fx['pkg_diem_baocao.LayDanhSachHoSoNhieuNganh'] = function (o) { return { rows: SV.slice(0, Math.min(o.pageSize || 10, SV.length)), pager: SV.length }; };
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLSV.TRANGTHAI'] = [{ ID: 'TT1', TEN: 'Đang học' }, { ID: 'TT2', TEN: 'Bảo lưu' }, { ID: 'TT3', TEN: 'Thôi học' }];
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DIEM.PHAMVITONGHOPDIEM'] = [{ ID: 'PV1', MA: 'TOANKHOA', TEN: 'Toàn khóa' }, { ID: 'PV2', MA: 'NHIEUKY', TEN: 'Nhiều kỳ' },
        { ID: 'PV3', MA: 'NAMHOC', TEN: 'Năm học' }, { ID: 'PV4', MA: 'HOCKY', TEN: 'Học kỳ' }, { ID: 'PV5', MA: 'DOTHOC', TEN: 'Đợt học' }];
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KHCT.LOAIPHANBO'] = [{ ID: 'PB1', MA: 'LT' }, { ID: 'PB2', MA: 'TH' }];
    fx['TN_KeHoach/LayDSPhanLoaiXetTheoND1'] = [{ ID: 'LX1', TEN: 'Xét tốt nghiệp' }];
    fx['TN_ThongTin/LayDSTN_KeHoach'] = function (o) { return o.strPhanLoai_Id ? [{ ID: 'KH1', TEN: 'Xét TN đợt 1/2027' }] : []; };
    fx['pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao'] = [{ ID: 'TG1', DAOTAO_THOIGIANDAOTAO: '2026_2027_1' }, { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: '2025_2026_2' }];
    fx['KHCT_NamNhapHoc/LayDanhSach'] = [{ NAMNHAPHOC: '2022' }, { NAMNHAPHOC: '2023' }];
    fx['pkg_diem_baocao.LayDSDiemKetThucCaNhan'] = [{ ID: 'D1', DAOTAO_HOCPHAN_ID: 'HP1', DAOTAO_HOCPHAN_MA: 'IT3100', DAOTAO_HOCPHAN_TEN: 'Lập trình HĐT', DIEM: 8.2, LANHOC: 1, LANTHI: 1,
        DANHGIA_TEN: 'Đạt', DIEMQUYDOI: 3.5, DIEMQUYDOI_TEN: 'B+' }];
    fx['pkg_diem_baocao.LayDSDiemThanhPhanCaNhan'] = [{ TEN: 'Chuyên cần', DIEM: 9, LANHOC: 1, LANTHI: 1 }, { TEN: 'Cuối kỳ', DIEM: 8, LANHOC: 1, LANTHI: 1 }];
    fx['SV_ThongTin/KetQuaHocTapCaNhan'] = { rows: { rsDiemKetThucHocPhan: [{ ID: 'K1', NAMHOC: '2025-2026', HOCKY: 1, DAOTAO_HOCPHAN_MA: 'IT3100', DAOTAO_HOCPHAN_TEN: 'Lập trình HĐT', DAOTAO_HOCPHAN_HOCTRINH: 3,
        LANHOC: 1, LANTHI: 1, DIEM: 8.2, DIEMQUYDOI: 3.5, DIEMQUYDOI_TEN: 'B+', DANHGIA_TEN: 'Đạt' }],
        rsDiemTrungBinhChung: [{ DAOTAO_THOIGIANDAOTAO_ID: 'TG1', LOAIDIEMTRUNGBINH_MA: 'TRUNGBINHCHUNG', THUOCTINHLANTINH: 0, THANGDIEM_MA: '10', NAMHOC: '2025-2026', DAOTAO_THOIGIANDAOTAO_KY: 1,
            PHAMVITONGHOPDIEM_TEN: 'HOCKY', TONGSOTINCHI: 18, DIEMTRUNGBINH: 7.9 }], rsDiemThanhPhan: [] } };
    fx['SV_ThongTin/LayKetQuaTichLuyTheoKhoi'] = { rows: { rsTongHop: [{ MAKHOI: 'DC', TENKHOI: 'Đại cương', TONGSOTINCHICUAKHOI: 40, SOBATBUOC: 30, SODATICHLUY: 28 }],
        rsChiTiet: [{ MAKHOI: 'DC', TENKHOI: 'Đại cương', DAOTAO_HOCPHAN_MA: 'MI1110', DAOTAO_HOCPHAN_TEN: 'Giải tích 1', DAOTAO_HOCPHAN_HOCTRINH: 4, DIEM: 7, KETQUA: 1 }] } };
    fx['SV_ThongTin/LayDSThoiGianLichHoc'] = [{ ID: 'TG1', THOIGIAN: '2026_2027_1' }];
    fx['SV_ThongTin/LayKetQuaDangKyHocCaNhan'] = { rows: { rsKetQuaDangKy: [{ DANGKY_LOPHOCPHAN_MA: 'IT3100.01', DANGKY_LOPHOCPHAN_TEN: 'Lập trình HĐT', DAOTAO_HOCPHAN_HOCTRINH: 3,
        QLSV_NGUOIHOC_HODEM: 'Nguyễn Văn', QLSV_NGUOIHOC_TEN: 'An', QLSV_NGUOIHOC_MASO: 'BIT220101', KIEUHOC_TEN: 'Học đi', THOIGIAN: '2026_2027_1' }], rsLichSuDangKy: [] } };
    fx['SV_ThongTin/LayDSHocPhanChuHoanThanh'] = [{ DAOTAO_HOCPHAN_MA: 'IT3200', DAOTAO_HOCPHAN_TEN: 'Cơ sở dữ liệu', DAOTAO_HOCPHAN_HOCTRINH: 3, DIEM: 3.5, DANHGIA_TEN: 'Chưa đạt', LANHOC: 1, LANTHI: 2 }];
    fx['SV_ThongTin/LayDSQDCaNhan'] = [{ SOQUYETDINH: '123/QĐ-ĐHMT', NGAYQUYETDINH: '01/09/2022', NGAYHIEULUC: '05/09/2022', NOIDUNG: 'Công nhận trúng tuyển', LOAIQUYETDINH_TEN: 'Nhập học' }];
    fx['pkg_congthongtin_hssv_thongtin.LayDSKetQuaXuLyHocVu'] = [];
    fx['pkg_congthongtin_hssv_thongtin.LayKQRenLuyenCaNhan'] = { rows: { rsKy: [{ QLSV_NGUOIHOC_MASO: 'BIT220101', QLSV_NGUOIHOC_HODEM: 'Nguyễn Văn', QLSV_NGUOIHOC_TEN: 'An', DIEM: 85, XEPLOAI_TEN: 'Tốt', THOIGIAN: '2025_2026_1' }], rsNam: [], rsToanKhoa: [] } };
    ['LayDSKhoanPhaiNop', 'LayDSKhoanNoChung', 'LayDSKhoanNoRieng', 'LayDSKhoanDaNop', 'LayDSKhoanMien', 'LayDSKhoanDaRut', 'LayDSKhoanDuChung', 'LayDSKhoanDuRieng'].forEach(function (k, i) {
        fx['TC_ThongTinChung/' + k] = i % 3 ? [] : [{ DAOTAO_THOIGIANDAOTAO: '2026_2027_1', DAOTAO_THOIGIANDAOTAO_DOT: 1, TAICHINH_CACKHOANTHU_TEN: 'Học phí', SOTIEN: 5000000, NOIDUNG: 'Học phí HK1', NGAYTAO_DD_MM_YYYY: '01/09/2026' }];
    });
    fx['NS_ThongTinCanBo/LayDSThoiGianDKTheoLopQL'] = [{ ID: 'TG1', TEN: 'Kỳ 1, 2026-2027' }, { ID: 'TG2', TEN: 'Kỳ 2, 2025-2026' }];
    fx['NS_ThongTinCanBo/LayDSHocPhanDKTheoLop'] = [{ ID: 'HP1', TEN: 'IT3100' }, { ID: 'HP2', TEN: 'IT3200' }];
    fx['NS_ThongTinCanBo/LayDSNguoiHocTheoLopQL'] = SV.map(function (s) { return { ID: s.QLSV_NGUOIHOC_ID, QLSV_NGUOIHOC_MASO: s.QLSV_NGUOIHOC_MASO, QLSV_NGUOIHOC_HODEM: s.QLSV_NGUOIHOC_HODEM,
        QLSV_NGUOIHOC_TEN: s.QLSV_NGUOIHOC_TEN, QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học', TONGNOPHI: s.TONGNOPHI, SOTINHOCDI: 18, SOTINHOCLAI: 0, SOTINHOCNANGDIEM: 0 }; });
    fx['DKH_Chung/KiemTraNguoiHocDangKyHocPhan'] = function (o) { return o.strQLSV_NguoiHoc_Id === 'NH02' && o.strDaoTao_HocPhan_Id === 'HP2' ? [] : [{ KETQUA: 1, SOTIETVANGMAT: o.strQLSV_NguoiHoc_Id === 'NH01' ? 3 : 0, SOBUOIVANGMAT: o.strQLSV_NguoiHoc_Id === 'NH01' ? 1 : 0 }]; };
    fx['pkg_chuyencan_thongtin.LayDSBuoiHocTheoHocPhan'] = [{ NGAYGHINHAN: '08/09/2026', TIETBATDAU: 1, TIETKETTHUC: 3, DAOTAO_LOPHOCPHAN_TEN: 'IT3100.01', CANBOGHINHAN_TENDAYDU: 'Nguyễn Văn Hùng', CANBOGHINHAN_TAIKHOAN: 'hungnv', KIEUCHUYENCAN_TEN: 'Vắng', TINHCHAT: 1 }];
    fx['DKH_Chung/LayDSChuongTrinh'] = [{ DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Kỹ thuật phần mềm K67', TONGSOTINCHIQUYDINH: 150 }];
    fx['KHCT_HocPhan_ChuongTrinh/LayDanhSach'] = [{ ID: 'HPC1', DAOTAO_HOCPHAN_ID: 'HP1', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1', DAOTAO_HOCPHAN_MA: 'IT3100', DAOTAO_HOCPHAN_TEN: 'Lập trình HĐT', HOCTRINHAPDUNGHOCTAP: 3,
        HOCTRINHAPDUNGTINHHOCPHI: 3, DAOTAO_THOIGIAN_KEHOACH: 'HK3', DAOTAO_THOIGIAN_THUCTE: 'HK3' }];
    fx['KHCT_HocPhan_TietHoc/LayDanhSach'] = [{ LOAIPHANBO_ID: 'PB1', LOAIPHANBO_TEN: 'Lý thuyết', SOTIET: 30 }, { LOAIPHANBO_ID: 'PB2', LOAIPHANBO_TEN: 'Thực hành', SOTIET: 15 }];
    fx['KHCT_KhoiBatBuoc/LayDanhSach'] = [{ ID: 'KB1', TEN: 'Khối đại cương', TONGSOHOCPHAN: 12, TONGSOTINCHI: 40 }];
    fx['KHCT_KhoiTuChon_Don/LayDanhSach'] = [{ ID: 'KD1', TEN: 'Tự chọn chuyên ngành', TONGSOHP: 6, TONGSOTC: 18, SOTINCHIQUYDINH: 9 }];
    fx['KHCT_HocPhan_KhoiBatBuoc/LayDanhSach'] = [{ DAOTAO_HOCPHAN_MA: 'MI1110', DAOTAO_HOCPHAN_TEN: 'Giải tích 1', HOCTRINHAPDUNGHOCTAP: 4, TONGSOTIETPHANBO: 60 }];
    fx['KHCT_HocPhan_KhoiTuChon_Don/LayDanhSach'] = [];
    fx['KHCT_QuanHeHocPhan/LayDanhSach'] = []; fx['KHCT_HocPhan_TuongDuong/LayDanhSach'] = []; fx['KHCT_BaiHoc/LayDanhSach'] = [];
    fx['pkg_diem_baocao.LayDanhSachNoMon'] = [Object.assign({}, SV[1], { DAOTAO_HOCPHAN_MA: 'IT3200', DAOTAO_HOCPHAN_TEN: 'Cơ sở dữ liệu', DAOTAO_HOCPHAN_HOCTRINH: 3, TENKHOI: 'Cơ sở ngành', MAKHOI: 'CSN', DIEM: 3.5 })];
    fx['PKG_DIEM_TONGHOP_XULY.TongHopDuLieuHocTap'] = [];
    fx['CMS_NguoiDung/SendEmail'] = [];
    /* Lịch học (khung ums.tkbSV) */
    fx['pkg_congthongtin_hssv_thongtin.LayDSLichCaNhan'] = [];
    fx['PKG_CONGTHONGTIN_HSSV_THONGTIN.LayTKBLopKhongCoLichChiTiet'] = [];
    fx['pkg_dg_camxuc_nguoihoc.LayDSCamXuc'] = [];
    ums.demo.add(fx);
})();
