/* Dữ liệu mẫu cho module heso (Nhân sự) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', fx = {};
    function dm(list) { return list.map(function (x, i) { return { ID: x[0], MA: x[1], TEN: x[2], THONGTIN1: x[3] || '' }; }); }

    fx[D + 'LUONG.NGACH'] = dm([['NG1', 'V.07.01.01', 'Giảng viên cao cấp'], ['NG2', 'V.07.01.02', 'Giảng viên chính'], ['NG3', 'V.07.01.03', 'Giảng viên'], ['NG4', '01.003', 'Chuyên viên']]);
    fx[D + 'NS.CDNN'] = dm([['CD1', 'GVCC', 'Giảng viên cao cấp (hạng I)'], ['CD2', 'GVC', 'Giảng viên chính (hạng II)'], ['CD3', 'GV', 'Giảng viên (hạng III)']]);
    fx[D + 'NS.LOCD'] = dm([['HH1', 'GS', 'Giáo sư'], ['HH2', 'PGS', 'Phó giáo sư']]);
    /* NS.DMCV: cùng ID với bản chung (CV1..CV4) + THONGTIN1 để thử lọc chính quyền / đoàn đảng */
    fx[D + 'NS.DMCV'] = dm([['CV1', 'GV', 'Giảng viên'], ['CV2', 'PTK', 'Phó trưởng khoa', 'CHINHQUYEN'], ['CV3', 'TK', 'Trưởng khoa', 'CHINHQUYEN'],
        ['CV4', 'TBM', 'Trưởng bộ môn', 'CHINHQUYEN'], ['CV5', 'BTDU', 'Bí thư Đảng ủy', 'DOANDANG'], ['CV6', 'BTDT', 'Bí thư Đoàn trường', 'DOANDANG'],
        ['CV7', 'CTCD', 'Chủ tịch Công đoàn', 'DOANDANG']]);
    fx[D + 'NHANSU.LOAIKHOAN'] = dm([['LK1', 'PCCV', 'Phụ cấp chức vụ'], ['LK2', 'PCTN', 'Phụ cấp trách nhiệm']]);
    fx[D + 'KLGD.LOAIDINHMUC'] = dm([['LDM1', 'GD', 'Định mức giảng dạy'], ['LDM2', 'NCKH', 'Định mức nghiên cứu khoa học']]);
    fx[D + 'KLGD.DINHMUCMIEN.DONVITINH'] = dm([['DVT1', 'GIO', 'Giờ chuẩn'], ['DVT2', 'PT', 'Phần trăm']]);
    fx[D + 'NS.LGV0'] = dm([['LGV1', 'CH', 'Cơ hữu'], ['LGV2', 'TG', 'Thỉnh giảng']]);
    fx[D + 'KLGD.PHAMVIAPDUNG.MIENGIAM'] = dm([['PVM1', 'NU', 'Giảng viên nữ có con nhỏ'], ['PVM2', 'TS', 'Tập sự']]);
    fx[D + 'KLGD.PHAMVIAPDUNG.DINHMUC'] = dm([['PVD1', 'KHOA', 'Theo khoa'], ['PVD2', 'BM', 'Theo bộ môn']]);
    fx[D + 'KLGD.HOATDONG'] = dm([['HD1', 'LT', 'Giảng lý thuyết'], ['HD2', 'TH', 'Hướng dẫn thực hành'], ['HD3', 'DA', 'Hướng dẫn đồ án']]);
    fx[D + 'KHCT.DDPG'] = dm([['DD1', 'CS1', 'Cơ sở chính'], ['DD2', 'CS2', 'Cơ sở ngoài trường']]);
    fx[D + 'KHDT.PHANLOAIDOITUONGDAOTAO'] = dm([['PV1', 'DH', 'Đại học'], ['PV2', 'SDH', 'Sau đại học']]);
    fx[D + 'KHCT.LOAICHUONGTRINH'] = dm([['MH1', 'CQ', 'Chính quy'], ['MH2', 'CLC', 'Chất lượng cao']]);
    fx[D + 'NHANSU.LUONG,LOAIXULYBIETLE'] = dm([['XL1', 'TRU', 'Trừ lương'], ['XL2', 'CONG', 'Cộng thêm']]);
    fx[D + 'NHANSU.THANHPHANLUONG'] = dm([['TP1', 'LCB', 'Lương cơ bản'], ['TP2', 'PCCV', 'Phụ cấp chức vụ'], ['TP3', 'PCTN', 'Phụ cấp thâm niên']]);
    fx[D + 'NHANSU.LOAIBANGLUONG'] = dm([['BL1', 'THANG', 'Bảng lương tháng'], ['BL2', 'NAM', 'Bảng lương năm']]);

    fx['KHCT_ThoiGianDaoTao/LayDanhSach'] = [
        { ID: 'TG1', DAOTAO_THOIGIANDAOTAO: '2025-2026 - Học kỳ 1', DAOTAO_THOIGIANDAOTAO_NAM: '2025-2026', DAOTAO_THOIGIANDAOTAO_KY: '1', DAOTAO_THOIGIANDAOTAO_DOT: '1' },
        { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: '2025-2026 - Học kỳ 2', DAOTAO_THOIGIANDAOTAO_NAM: '2025-2026', DAOTAO_THOIGIANDAOTAO_KY: '2', DAOTAO_THOIGIANDAOTAO_DOT: '1' }
    ];
    fx['NCKH_TinhDiem_KeHoach/LayDanhSach'] = [{ ID: 'KH1', MOTA: 'Kế hoạch tính điểm NCKH 2025-2026' }, { ID: 'KH2', MOTA: 'Kế hoạch tính điểm NCKH 2024-2025' }];
    fx['L_BangQuyDinhLuong/LayDanhSach'] = [{ ID: 'QD1', MUCLUONGCOBAN: '2.340.000' }, { ID: 'QD2', MUCLUONGCOBAN: '1.800.000' }];
    var CB = [
        { ID: 'NS1', HOTEN: 'Nguyễn Văn Hùng', MASO: 'CB001', DV: 'CC1' },
        { ID: 'NS2', HOTEN: 'Trần Thị Mai', MASO: 'CB014', DV: 'CC2' },
        { ID: 'NS3', HOTEN: 'Lê Quang Minh', MASO: 'CB102', DV: 'CC3' }
    ];
    fx['NS_HoSoV2/LayDanhSach'] = function (o) {
        return CB.filter(function (r) { return !o.strDaoTao_CoCauToChuc_Id || r.DV === o.strDaoTao_CoCauToChuc_Id; });
    };
    ums.demo.add(fx);

    var S = ums.demo.crudStore;
    function map(pairs) {
        return function (o) { var r = {}; Object.keys(pairs).forEach(function (k) { r[pairs[k]] = o[k]; }); return r; };
    }
    S('NS_HeSo_Ngach', [
        { ID: 'HN1', NGACH_ID: 'NG1', NGACH_MA: 'V.07.01.01', NGACH_TEN: 'Giảng viên cao cấp', HESO: '6,20', NGAYAPDUNG: '01/07/2024' },
        { ID: 'HN2', NGACH_ID: 'NG2', NGACH_MA: 'V.07.01.02', NGACH_TEN: 'Giảng viên chính', HESO: '4,40', NGAYAPDUNG: '01/07/2024' },
        { ID: 'HN3', NGACH_ID: 'NG3', NGACH_MA: 'V.07.01.03', NGACH_TEN: 'Giảng viên', HESO: '2,34', NGAYAPDUNG: '01/07/2024' }
    ], { map: map({ strNgach_Id: 'NGACH_ID', dHeSo: 'HESO', strNgayApDung: 'NGAYAPDUNG' }) });
    S('NS_HeSo_ChucVu', [
        { ID: 'HC1', CHUCVU_ID: 'CV3', CHUCVU_MA: 'TK', CHUCVU_TEN: 'Trưởng khoa', HESO: '0,50', NGAYAPDUNG: '01/01/2025' },
        { ID: 'HC2', CHUCVU_ID: 'CV2', CHUCVU_MA: 'PTK', CHUCVU_TEN: 'Phó trưởng khoa', HESO: '0,40', NGAYAPDUNG: '01/01/2025' }
    ], { map: map({ strChucVu_Id: 'CHUCVU_ID', dHeSo: 'HESO', strNgayApDung: 'NGAYAPDUNG' }) });
    S('NS_HeSo_ThamNien', [
        { ID: 'TN1', XAUDIEUKIEN: 'SONAM >= 5 AND SONAM < 10', HESO: '0,05', NGAYAPDUNG: '01/01/2025' },
        { ID: 'TN2', XAUDIEUKIEN: 'SONAM >= 10', HESO: '0,10', NGAYAPDUNG: '01/01/2025' }
    ], { map: map({ strXauDieuKien: 'XAUDIEUKIEN', dHeSo: 'HESO', strNgayApDung: 'NGAYAPDUNG' }) });
    S('NS_HeSo_ChucDanh', [
        { ID: 'CDH1', CHUCDANHNGHENGHIEP_ID: 'CD2', CHUCDANHNGHENGHIEP_MA: 'GVC', CHUCDANHNGHENGHIEP_TEN: 'Giảng viên chính (hạng II)',
            NGACH_ID: 'NG2', NGACH_MA: 'V.07.01.02', NGACH_TEN: 'Giảng viên chính', HOCHAM_ID: 'HH2', HOCHAM_MA: 'PGS', HOCHAM_TEN: 'Phó giáo sư',
            HESO: '4,40', HESOTAPSU: '', NGAYAPDUNG: '01/07/2024' },
        { ID: 'CDH2', CHUCDANHNGHENGHIEP_ID: 'CD3', CHUCDANHNGHENGHIEP_MA: 'GV', CHUCDANHNGHENGHIEP_TEN: 'Giảng viên (hạng III)',
            NGACH_ID: 'NG3', NGACH_MA: 'V.07.01.03', NGACH_TEN: 'Giảng viên', HOCHAM_ID: '', HOCHAM_MA: '', HOCHAM_TEN: '',
            HESO: '2,34', HESOTAPSU: '1,99', NGAYAPDUNG: '01/07/2024' }
    ], { map: map({ strChucDanhNgheNghiep_Id: 'CHUCDANHNGHENGHIEP_ID', strNgach_Id: 'NGACH_ID', strHocHam_Id: 'HOCHAM_ID', dHeSo: 'HESO', dHeSoTapSu: 'HESOTAPSU', strNgayApDung: 'NGAYAPDUNG' }) });
    var hs12 = map({ strChucVu_Id: 'CHUCVU_ID', dHeSo1: 'HESO1', dHeSo2: 'HESO2', strNgayApDung: 'NGAYAPDUNG' });
    S('NS_HeSo_ChucVuChinhQuyen', [
        { ID: 'CQ1', CHUCVU_ID: 'CV3', CHUCVU_MA: 'TK', CHUCVU_TEN: 'Trưởng khoa', HESO1: '0,50', HESO2: '0,45', NGAYAPDUNG: '01/01/2025' }
    ], { map: hs12 });
    S('NS_HeSo_ChucVuDangDoan', [
        { ID: 'DD1', CHUCVU_ID: 'CV5', CHUCVU_MA: 'BTDU', CHUCVU_TEN: 'Bí thư Đảng ủy', HESO1: '0,70', HESO2: '0,60', NGAYAPDUNG: '01/01/2025' }
    ], { map: hs12 });
    S('NS_Tien_Khoan_ChucVu', [
        { ID: 'KC1', CHUCVU_ID: 'CV3', CHUCVU_MA: 'TK', CHUCVU_TEN: 'Trưởng khoa', LOAIKHOAN_ID: 'LK1', LOAIKHOAN_MA: 'PCCV', LOAIKHOAN_TEN: 'Phụ cấp chức vụ', SOTIEN: 1170000, NGAYAPDUNG: '01/07/2024', DONVITINH_ID: '' },
        { ID: 'KC2', CHUCVU_ID: 'CV4', CHUCVU_MA: 'TBM', CHUCVU_TEN: 'Trưởng bộ môn', LOAIKHOAN_ID: 'LK2', LOAIKHOAN_MA: 'PCTN', LOAIKHOAN_TEN: 'Phụ cấp trách nhiệm', SOTIEN: 585000, NGAYAPDUNG: '01/07/2024', DONVITINH_ID: '' }
    ], { map: map({ strChucVu_Id: 'CHUCVU_ID', strLoaiKhoan_Id: 'LOAIKHOAN_ID', dSoTien: 'SOTIEN', strNgayApDung: 'NGAYAPDUNG' }) });
    var mien = map({ strLoaiDinhMuc_Id: 'LOAIDINHMUC_ID', strNgayApDung: 'NGAYAPDUNG', strChucVu_Id: 'CHUCVU_ID', dKhungDinhMucMienGiam: 'KHUNGDINHMUCMIENGIAM',
        strDonViTinh_Id: 'DONVITINH_ID', strDaoTao_CoCauToChuc_Id: 'DAOTAO_COCAUTOCHUC_ID', strLoaiGiangVien_Id: 'LOAIGIANGVIEN_ID', strPhamViApDung_Id: 'PHAMVIAPDUNG_ID' });
    S('KHCT_KhungMienGiam_V2', [
        { ID: 'MG1', LOAIDINHMUC_ID: 'LDM1', LOAIDINHMUC_TEN: 'Định mức giảng dạy', NGAYAPDUNG: '01/09/2025', DAOTAO_COCAUTOCHUC_ID: 'CC1', DAOTAO_COCAUTOCHUC_TEN: 'Khoa Công nghệ thông tin',
            LOAIGIANGVIEN_ID: 'LGV1', LOAIGIANGVIEN_TEN: 'Cơ hữu', CHUCVU_ID: 'CV3', CHUCVU_TEN: 'Trưởng khoa', KHUNGDINHMUCMIENGIAM: '70', DONVITINH_ID: 'DVT2', DONVITINH_TEN: 'Phần trăm' },
        { ID: 'MG2', LOAIDINHMUC_ID: 'LDM1', LOAIDINHMUC_TEN: 'Định mức giảng dạy', NGAYAPDUNG: '01/09/2025', DAOTAO_COCAUTOCHUC_ID: 'CC1', DAOTAO_COCAUTOCHUC_TEN: 'Khoa Công nghệ thông tin',
            LOAIGIANGVIEN_ID: 'LGV1', LOAIGIANGVIEN_TEN: 'Cơ hữu', CHUCVU_ID: 'CV4', CHUCVU_TEN: 'Trưởng bộ môn', KHUNGDINHMUCMIENGIAM: '15', DONVITINH_ID: 'DVT2', DONVITINH_TEN: 'Phần trăm' }
    ], { map: mien });
    S('KHCT_KhungMienGiam_AD_V2', [
        { ID: 'MGR1', LOAIDINHMUC_ID: 'LDM1', LOAIDINHMUC_TEN: 'Định mức giảng dạy', NGAYAPDUNG: '01/09/2025', DAOTAO_COCAUTOCHUC_ID: 'CC2', DAOTAO_COCAUTOCHUC_TEN: 'Bộ môn Hệ thống thông tin',
            PHAMVIAPDUNG_ID: 'PVM1', PHAMVIAPDUNG_TEN: 'Giảng viên nữ có con nhỏ', CHUCVU_ID: '', KHUNGDINHMUCMIENGIAM: '10', DONVITINH_ID: 'DVT2', DONVITINH_TEN: 'Phần trăm' }
    ], { map: mien });
    var kdm = map({ strLoaiDinhMuc_Id: 'LOAIDINHMUC_ID', strNgayApDung: 'NGAYAPDUNG', strDaoTao_CoCauToChuc_Id: 'DAOTAO_COCAUTOCHUC_ID', strLoaiGiangVien_Id: 'LOAIGIANGVIEN_ID',
        strPhamViApDung_Id: 'PHAMVIAPDUNG_ID', strChucDanh_Id: 'CHUCDANH_ID', strHocHam_Id: 'HOCHAM_ID', dKhungDinhMucChuan: 'KHUNGDINHMUCCHUAN',
        dKhungDinhMucChuan_ToiDa: 'KHUNGDINHMUCCHUAN_TOIDA', strDonViTinh_Id: 'DONVITINH_ID' });
    S('KHCT_KhungDinhMuc_V2', [
        { ID: 'KD1', LOAIDINHMUC_ID: 'LDM1', LOAIDINHMUC_TEN: 'Định mức giảng dạy', NGAYAPDUNG: '01/09/2025', DAOTAO_COCAUTOCHUC_ID: 'CC1', DAOTAO_COCAUTOCHUC_TEN: 'Khoa Công nghệ thông tin',
            LOAIGIANGVIEN_ID: 'LGV1', LOAIGIANGVIEN_TEN: 'Cơ hữu', CHUCDANH_ID: 'CD2', CHUCDANH_TEN: 'Giảng viên chính (hạng II)', HOCHAM_ID: '', HOCHAM_TEN: '',
            KHUNGDINHMUCCHUAN: '270', KHUNGDINHMUCCHUAN_TOIDA: '540', DONVITINH_ID: 'DVT1', DONVITINH_TEN: 'Giờ chuẩn' },
        { ID: 'KD2', LOAIDINHMUC_ID: 'LDM2', LOAIDINHMUC_TEN: 'Định mức nghiên cứu khoa học', NGAYAPDUNG: '01/09/2025', DAOTAO_COCAUTOCHUC_ID: 'CC1', DAOTAO_COCAUTOCHUC_TEN: 'Khoa Công nghệ thông tin',
            LOAIGIANGVIEN_ID: 'LGV1', LOAIGIANGVIEN_TEN: 'Cơ hữu', CHUCDANH_ID: 'CD3', CHUCDANH_TEN: 'Giảng viên (hạng III)', HOCHAM_ID: '', HOCHAM_TEN: '',
            KHUNGDINHMUCCHUAN: '590', KHUNGDINHMUCCHUAN_TOIDA: '', DONVITINH_ID: 'DVT1', DONVITINH_TEN: 'Giờ chuẩn' }
    ], { map: kdm });
    S('KHCT_KhungDinhMuc_AD_V2', [
        { ID: 'KDR1', LOAIDINHMUC_ID: 'LDM1', LOAIDINHMUC_TEN: 'Định mức giảng dạy', NGAYAPDUNG: '01/09/2025', DAOTAO_COCAUTOCHUC_ID: 'CC2', DAOTAO_COCAUTOCHUC_TEN: 'Bộ môn Hệ thống thông tin',
            PHAMVIAPDUNG_ID: 'PVD2', PHAMVIAPDUNG_TEN: 'Theo bộ môn', KHUNGDINHMUCCHUAN: '250', KHUNGDINHMUCCHUAN_TOIDA: '500', DONVITINH_ID: 'DVT1', DONVITINH_TEN: 'Giờ chuẩn' }
    ], { map: kdm });
    S('NS_HeSo_QuyDoiGioChuan', [
        { ID: 'QG1', DAOTAO_THOIGIANDAOTAO_ID: 'TG1', DAOTAO_THOIGIANDAOTAO_NAM: '2025-2026', DAOTAO_THOIGIANDAOTAO_KY: '1', DAOTAO_THOIGIANDAOTAO_DOT: '1',
            HOATDONG_ID: 'HD1', HOATDONG_TEN: 'Giảng lý thuyết', PHAMVIAPDUNG_ID: 'PV1', PHAMVIAPDUNG_TEN: 'Đại học', SOLUONGCANDUOI: '1', SOLUONGCANTREN: '40',
            HESOQUYDOIGIOCHUAN: '1,0', PHANLOAIDIADIEM_ID: 'DD1', PHANLOAIDIADIEM_TEN: 'Cơ sở chính', LYDO: 'Lớp chuẩn', DONVITINH_ID: '' },
        { ID: 'QG2', DAOTAO_THOIGIANDAOTAO_ID: 'TG1', DAOTAO_THOIGIANDAOTAO_NAM: '2025-2026', DAOTAO_THOIGIANDAOTAO_KY: '1', DAOTAO_THOIGIANDAOTAO_DOT: '1',
            HOATDONG_ID: 'HD1', HOATDONG_TEN: 'Giảng lý thuyết', PHAMVIAPDUNG_ID: 'PV1', PHAMVIAPDUNG_TEN: 'Đại học', SOLUONGCANDUOI: '41', SOLUONGCANTREN: '80',
            HESOQUYDOIGIOCHUAN: '1,2', PHANLOAIDIADIEM_ID: 'DD1', PHANLOAIDIADIEM_TEN: 'Cơ sở chính', LYDO: 'Lớp đông', DONVITINH_ID: '' }
    ], { map: map({ strDaoTao_ThoiGianDaoTao_Id: 'DAOTAO_THOIGIANDAOTAO_ID', strHoatDong_Id: 'HOATDONG_ID', strPhamViApDung_Id: 'PHAMVIAPDUNG_ID',
        strPhanLoaiDiaDiem_Id: 'PHANLOAIDIADIEM_ID', dHeSoQuyDoiGioChuan: 'HESOQUYDOIGIOCHUAN', dSoLuongCanDuoi: 'SOLUONGCANDUOI', dSoLuongCanTren: 'SOLUONGCANTREN', strLyDo: 'LYDO' }) });
    S('NS_HeSo_TangThem', [
        { ID: 'TT1', DAOTAO_THOIGIANDAOTAO_ID: 'TG1', DAOTAO_THOIGIANDAOTAO_NAM: '2025-2026', DAOTAO_THOIGIANDAOTAO_KY: '1', DAOTAO_THOIGIANDAOTAO_DOT: '1',
            HOATDONG_ID: 'HD1', HOATDONG_TEN: 'Giảng lý thuyết', PHAMVIAPDUNG_ID: 'PV2', PHAMVIAPDUNG_TEN: 'Sau đại học', HESOQUYDOITANGTHEM: '1,5',
            MOHINHHOC_ID: 'MH2', MOHINHHOC_TEN: 'Chất lượng cao', PHANLOAIDIADIEM_ID: 'DD2', PHANLOAIDIADIEM_TEN: 'Cơ sở ngoài trường', DONVITINH_ID: '' }
    ], { map: map({ strDaoTao_ThoiGianDaoTao_Id: 'DAOTAO_THOIGIANDAOTAO_ID', strHoatDong_Id: 'HOATDONG_ID', strPhamViApDung_Id: 'PHAMVIAPDUNG_ID',
        strPhanLoaiDiaDiem_Id: 'PHANLOAIDIADIEM_ID', dHeSoQuyDoiTangThem: 'HESOQUYDOITANGTHEM', strMoHinhHoc_Id: 'MOHINHHOC_ID' }) });
    S('KHCT_KeHoachTongHop_V2', [
        { ID: 'TH1', TEN: 'Tổng hợp khối lượng học kỳ 1 năm 2025-2026', TUNGAY: '15/01/2026', DENNGAY: '31/01/2026', DAOTAO_THOIGIANDAOTAO_ID: 'TG1',
            DAOTAO_THOIGIANDAOTAO_NAM: '2025-2026', DAOTAO_THOIGIANDAOTAO_KY: '1', DAOTAO_THOIGIANDAOTAO_DOT: '1', NCKH_TINHDIEM_KEHOACH_ID: 'KH1',
            NCKH_TINHDIEM_KEHOACH_TEN: 'Kế hoạch tính điểm NCKH 2025-2026', HIEULUC_ID: '1', HIEULUC_TEN: 'Hiệu lực', NOIDUNG: 'Tổng hợp giờ giảng + NCKH' }
    ], { map: map({ strTen: 'TEN', strTuNgay: 'TUNGAY', strDenNgay: 'DENNGAY', strDaoTao_ThoiGianDaoTao_Id: 'DAOTAO_THOIGIANDAOTAO_ID',
        strNCKH_TinhDiem_KeHoach_Id: 'NCKH_TINHDIEM_KEHOACH_ID', dHieuLuc: 'HIEULUC_ID', strNoiDung: 'NOIDUNG' }) });
    S('L_KhongTinh', [
        { ID: 'KTL1', NHANSU_HOSOCANBO_ID: 'NS2', NHANSU_HOSOCANBO_MA: 'CB014', NHANSU_HOSOCANBO_HODEM: 'Trần Thị', NHANSU_HOSOCANBO_TEN: 'Mai',
            THANHPHAN_ID: 'TP2', THANHPHAN_TEN: 'Phụ cấp chức vụ', TUNGAY: '01/03/2026', DENNGAY: '31/08/2026' }
    ], { map: map({ strNhanSu_HoSoCanBo_Id: 'NHANSU_HOSOCANBO_ID', strThanhPhan_Id: 'THANHPHAN_ID', strTuNgay: 'TUNGAY', strDenNgay: 'DENNGAY' }) });
    S('L_XuLyBietLe', [
        { ID: 'XL1', NHANSU_HOSOCANBO_ID: 'NS1', NHANSU_HOSOCANBO_MA: 'CB001', NHANSU_HOSOCANBO_HODEM: 'Nguyễn Văn', NHANSU_HOSOCANBO_TEN: 'Hùng',
            NAM: '2026', THANG: '8', LOAIXULYBIETLE_ID: 'XL1', LOAIXULYBIETLE_TEN: 'Trừ lương', THANHPHAN_ID: 'TP1', THANHPHAN_TEN: 'Lương cơ bản' },
        { ID: 'XL2', NHANSU_HOSOCANBO_ID: 'NS3', NHANSU_HOSOCANBO_MA: 'CB102', NHANSU_HOSOCANBO_HODEM: 'Lê Quang', NHANSU_HOSOCANBO_TEN: 'Minh',
            NAM: '2026', THANG: '9', LOAIXULYBIETLE_ID: 'XL2', LOAIXULYBIETLE_TEN: 'Cộng thêm', THANHPHAN_ID: 'TP3', THANHPHAN_TEN: 'Phụ cấp thâm niên' }
    ], { map: map({ strNhanSu_HoSoCanBo_Id: 'NHANSU_HOSOCANBO_ID', strLoaiXuLyBietLe_Id: 'LOAIXULYBIETLE_ID', strThanhPhan_Id: 'THANHPHAN_ID', strNam: 'NAM', strThang: 'THANG' }) });
})();
