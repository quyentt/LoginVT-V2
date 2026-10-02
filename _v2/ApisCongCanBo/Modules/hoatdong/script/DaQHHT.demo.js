/* Dữ liệu mẫu cho hoatdong/DaQHHT (+ bảng điểm ums.diemHoc) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {}, D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', B = 'PKG_CORE_GET_BIND_DIMENSION.', P = 'PKG_CORE_NGUOIHOC_01.';
    /* Danh mục */
    fx[D + 'QLSV.TRANGTHAI'] = [{ ID: 'TT1', MA: 'DANGHOC', TEN: 'Đang học' }, { ID: 'TT2', MA: 'BAOLUU', TEN: 'Bảo lưu' }, { ID: 'TT3', MA: 'TOTNGHIEP', TEN: 'Đã tốt nghiệp' }];
    fx[D + 'NS.GITI'] = [{ ID: 'G1', TEN: 'Nam' }, { ID: 'G2', TEN: 'Nữ' }];
    fx[D + 'NS.TOGI'] = [{ ID: 'TG0', TEN: 'Không' }, { ID: 'TG1', TEN: 'Phật giáo' }];
    fx[D + 'NS.DATO'] = [{ ID: 'DT1', TEN: 'Kinh' }, { ID: 'DT2', TEN: 'Tày' }];
    fx[D + 'NS.THANHPHANGIADINH'] = [{ ID: 'HC1', TEN: 'Công nhân' }, { ID: 'HC2', TEN: 'Nông dân' }];
    fx[D + 'NS.TINHTRANGHONNHAN'] = [{ ID: 'HN1', TEN: 'Độc thân' }, { ID: 'HN2', TEN: 'Đã kết hôn' }];
    fx[D + 'QLSV.DOITUONG'] = [{ ID: 'CS0', TEN: 'Không' }, { ID: 'CS1', TEN: 'Con thương binh' }];
    fx[D + 'KHCT.HTDT'] = [{ ID: 'HT1', TEN: 'Chính quy' }, { ID: 'HT2', TEN: 'Vừa làm vừa học' }];
    fx[D + 'CORE_PERSON_STUDY_TRACK.STUDY_RELATION_TYPE'] = [{ ID: 'DH1', TEN: 'Chính' }, { ID: 'DH2', TEN: 'Song ngành' }];
    fx[D + 'CORE_PERSON_STUDY_TRACK.SOURCE_TYPE'] = [{ ID: 'LN1', TEN: 'Tuyển sinh' }, { ID: 'LN2', TEN: 'Chuyển đến' }];
    fx[D + 'CORE_PERSON_STUDY.CHANGE_TYPE'] = [{ ID: 'LT1', TEN: 'Nhập học mới' }, { ID: 'LT2', TEN: 'Tiếp nhận chuyển' }];
    /* Chiều đào tạo */
    fx[B + 'LayDSHeDaoTao'] = [{ ID: 'H1', TENHEDAOTAO: 'Đại học chính quy' }, { ID: 'H2', TENHEDAOTAO: 'Liên thông' }];
    fx[B + 'LayDSKhoaQuanLy'] = [{ ID: 'KQL1', NAME: 'Khoa Công nghệ thông tin', CODE: 'CNTT' }, { ID: 'KQL2', NAME: 'Khoa Kinh tế', CODE: 'KT' }];
    fx[B + 'LayDSKhoaDaoTao'] = function (o) { return [{ ID: 'K67', TENKHOA: 'Khóa 67', MAKHOA: 'K67' }].concat(o.strDaoTao_HeDaoTao_Id === 'H2' ? [] : [{ ID: 'K68', TENKHOA: 'Khóa 68', MAKHOA: 'K68' }]); };
    fx[B + 'LayDSChuongTrinh'] = [{ ID: 'CT1', TENCHUONGTRINH: 'Kỹ thuật phần mềm', MACHUONGTRINH: 'KTPM' }, { ID: 'CT2', TENCHUONGTRINH: 'Quản trị kinh doanh', MACHUONGTRINH: 'QTKD' }];
    fx[B + 'LayDSLopQuanLy'] = function (o) { return o.strDaoTao_ChuongTrinh_Id ? [{ ID: 'L1', TENLOP: 'K67-KTPM1', MALOP: 'KTPM1' }] : [{ ID: 'L1', TENLOP: 'K67-KTPM1', MALOP: 'KTPM1' }, { ID: 'L2', TENLOP: 'K67-QTKD2', MALOP: 'QTKD2' }]; };
    /* Danh sách + thống kê */
    var SV = [];
    for (var i = 1; i <= 23; i++) SV.push({ STUDY_ID: 'ST' + i, CORE_PERSON_ID: i === 3 ? '' : 'P' + i, DINHDANH_CHINH_SO: '0010950' + (10000 + i), MA_NGUOIHOC_CHINH: 'BIT2201' + (10 + i),
        FULL_NAME: ['Nguyễn Văn An', 'Trần Thị Bình', 'Lê Quang Cường', 'Phạm Minh Dũng'][i % 4] + ' ' + i, SODIENTHOAI_CANHAN: i % 3 ? '09123456' + (10 + i) : '', EMAIL_CANHAN: i % 2 ? 'sv' + i + '@gmail.com' : '',
        STUDY_STATUS_TEN: i % 5 ? 'Đang học' : 'Bảo lưu', STUDY_STATUS_MA: i % 5 ? 'DANGHOC' : 'BAOLUU', GIOITINH_TEN: i % 2 ? 'Nam' : 'Nữ', GIOI_TINH_ID: i % 2 ? 'G1' : 'G2',
        DATE_OF_BIRTH: '1' + (i % 9) + '/0' + (i % 9 + 1) + '/2004', DANTOC_TEN: 'Kinh', TONGIAO_TEN: 'Không', TENKHOA: 'Khóa 67', KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin',
        LOPQUANLY_TEN: 'K67-KTPM1', TENCHUONGTRINH: 'Kỹ thuật phần mềm', IS_PRIMARY: i % 4 ? 1 : 0, GPA: (2.5 + (i % 10) / 7).toFixed(2), CONGNO: i % 6 ? 0 : 1500000, COVAN_TENDAYDU: 'ThS. Trần Thị Mai' });
    fx[P + 'LayDSNguoiHoc'] = function (o) {
        var d = SV.filter(function (x) { return (!o.strTuKhoa || x.FULL_NAME.toLowerCase().indexOf(o.strTuKhoa.toLowerCase()) >= 0) && (o.strStudyStatus_Ids.indexOf('BAOLUU') < 0 || x.STUDY_STATUS_MA === 'BAOLUU'); });
        var a = (o.pageIndex - 1) * o.pageSize; return { rows: d.slice(a, a + Number(o.pageSize)), pager: d.length };
    };
    fx[P + 'LayThongKe_TrangThaiNguoiHoc'] = function (o) { var k = o.dIsPrimary === '0' ? 0.2 : 1; return [{ MA: 'DANGHOC', TEN: 'Đang học', SoNguoi: Math.round(18 * k) }, { MA: 'BAOLUU', TEN: 'Bảo lưu', SoNguoi: Math.round(4 * k) }, { MA: 'TOTNGHIEP', TEN: 'Đã tốt nghiệp', SoNguoi: 1 }]; };
    /* Hồ sơ */
    fx[P + 'LayHoSoNguoiHoc_TongQuan'] = function (o) {
        return { rows: { ParamTongQHHT: 2, ParamSoDangHoc: 1, ParamSoHoanThanh: 1, rsThongTinCoBan: [{ LAST_NAME: 'Nguyễn', MIDDLE_NAME: 'Văn', FIRST_NAME: 'An', MA_NGUOI_HOC: 'NH' + o.strCorePerson_Id }],
            rsDanhSachQHHT: [{ STUDY_ID: 'Q1', QHHT_MA: 'QH-KTPM-01', IS_PRIMARY: 1, KHOAQUANLY_TEN: 'Khoa CNTT', NGANH_TEN: 'Kỹ thuật phần mềm', HEDAOTAO_TEN: 'Đại học chính quy', KHOA: 'K67', LOP_TEN: 'K67-KTPM1', TRANGTHAI_TEN: 'Đang học' },
                             { STUDY_ID: 'Q2', QHHT_MA: 'QH-QTKD-02', IS_PRIMARY: 0, KHOAQUANLY_TEN: 'Khoa Kinh tế', NGANH_TEN: 'Quản trị kinh doanh', HEDAOTAO_TEN: 'Song ngành', KHOA: 'K67', LOP_TEN: 'K67-QTKD2', TRANGTHAI_TEN: 'Hoàn thành' }],
            rsChiTietQHHT: [{ STUDY_ID: 'Q1', QHHT_MA: 'QH-KTPM-01', LOAIQHHT_TEN: 'Chính', NGAYBATDAU_DD_MM_YYYY: '05/09/2022', NGANH_TEN: 'Kỹ thuật phần mềm', NGAYDUKIEN_TN: '30/06/2026', KHOA: 'K67', GPA: 3.12,
                HEDAOTAO_TEN: 'Đại học chính quy', SOTINCHI_TICHLUY: 98, LOP_TEN: 'K67-KTPM1', TRANGTHAI_TEN: 'Đang học', COVAN_TENDAYDU: 'ThS. Trần Thị Mai', IS_PRIMARY: 1 }] } };
    };
    var HS = { P1: { PERSON_PROFILE_ID: 'PF1', RELIGION_ID: 'TG0', ETHNICITY_ID: 'DT1', BLOOD_TYPE_CODE: 'O+', UNION_JOIN_DATE: '26/03/2019', IS_ACTIVE: 1 } };
    fx[P + 'LayTTPerson_Profile'] = function (o) { return HS[o.strPerson_Id] ? [HS[o.strPerson_Id]] : []; };
    fx[P + 'Them_Person_Profile'] = function () { return { rows: [], raw: { Id: 'PFNEW' } }; };
    fx[P + 'Sua_Person_Profile'] = []; fx[P + 'Xoa_Person_Profile'] = [];
    fx['PKG_CORE_HOSONHANSU_05.UpdateCorePerson'] = []; fx['PKG_CORE_HOSONHANSU_05.InsertCorePerson'] = function () { return { rows: [], raw: { Id: 'PNEW' } }; };
    /* 7 bảng quá trình — lưu trong bộ nhớ */
    var QT = { Address: [{ ID: 'a1', PERSON_ID: 'P1', ADDRESS_TYPE_CODE: 'THUONGTRU', ADDRESS_TYPE_NAME: 'Thường trú', FULL_ADDRESS: 'Số 1 Đại Cồ Việt, Hà Nội', IS_PRIMARY: 1, IS_ACTIVE: 1 }],
        Family: [{ ID: 'f1', PERSON_ID: 'P1', RELATIONSHIP_NAME: 'Bố', FULL_NAME: 'Nguyễn Văn Bố', PHONE_NUMBER: '0912000111', OCCUPATION: 'Kỹ sư' }], Bank_Account: [], Education: [], Certificate: [], Document: [], Academic_Rank: [] };
    Object.keys(QT).forEach(function (k) {
        var H = 'PKG_CORE_HOSONHANSU_06.';
        fx[H + 'Get_Person_' + k] = function (o) { return QT[k].filter(function (x) { return !x.PERSON_ID || x.PERSON_ID === o.strPerson_Id; }); };
        fx[H + 'Ins_Person_' + k] = function (o) { var r = { ID: k + (QT[k].length + 1), PERSON_ID: o.strPerson_Id }; Object.keys(o).forEach(function (p) { if (/^(str|d)[A-Z]/.test(p)) r[p.replace(/^(str|d)/, '').toUpperCase()] = o[p]; }); QT[k].push(r); return []; };
        fx[H + 'Upd_Person_' + k] = function (o) { QT[k].forEach(function (r) { if (String(r.ID).toUpperCase() === o.strId) Object.keys(o).forEach(function (p) { if (/^(str|d)[A-Z]/.test(p) && p !== 'strId') r[p.replace(/^(str|d)/, '').toUpperCase()] = o[p]; }); }); return []; };
        fx[H + 'Del_Person_' + k] = function (o) { QT[k] = QT[k].filter(function (r) { return String(r.ID).toUpperCase() !== o.strId; }); return []; };
    });
    /* Tìm QLSV_NGUOIHOC_ID theo mã + bảng điểm */
    fx['pkg_hosohocvien.LayDanhSachHoSoNhieuNganh'] = function (o) { return [{ QLSV_NGUOIHOC_ID: 'QL_' + o.strTuKhoa, QLSV_NGUOIHOC_MASO: o.strTuKhoa }]; };
    var T = 'pkg_congthongtin_hssv_thongtin.';
    fx[T + 'LayThongTinChuongTrinhHoc'] = [{ DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1', DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm' }];
    function tb(ky, loai, thang, tc, d) { return { DAOTAO_THOIGIANDAOTAO_ID: ky ? 'TGK' : null, NAMHOC: '2023-2024', DAOTAO_THOIGIANDAOTAO_KY: ky, THUOCTINHLANTINH: 0, DOTHOC: null, PHAMVITONGHOPDIEM_TEN: ky ? 'HOCKY' : '', LOAIDIEMTRUNGBINH_MA: loai, THANGDIEM_MA: thang, TONGSOTINCHI: tc, DIEMTRUNGBINH: d }; }
    fx[T + 'KetQuaHocTapCaNhan'] = { rows: {
        rsThongTinNguoiHoc: [{ HODEM: 'Nguyễn Văn', TEN: 'An', QLSV_NGUOIHOC_MASO: 'BIT220111', NGAYSINH: '11/02/2004', GIOITINH: 'Nam', QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học', DAOTAO_LOPQUANLY_TEN: 'K67-KTPM1' }],
        rsDiemMoiNhat: [{ DAOTAO_HOCPHAN_TEN: 'Cơ sở dữ liệu', DAOTAO_HOCPHAN_MA: 'IT3200', DIEM: 8.7 }, { DAOTAO_HOCPHAN_TEN: 'Giải tích', DAOTAO_HOCPHAN_MA: 'MI1110', DIEM: 4.2 }],
        rsDiemTrungBinhChung: [tb(null, 'TRUNGBINHCHUNG', '10', 98, 7.8), tb(null, 'TRUNGBINHCHUNG', '4', 98, 3.12), tb(null, 'TRUNGBINHTICHLUY', '10', 95, 7.9), tb(null, 'TRUNGBINHTICHLUY', '4', 95, 3.15),
            tb('1', 'TRUNGBINHCHUNG', '10', 18, 7.5), tb('1', 'TRUNGBINHTICHLUY', '10', 18, 7.6), tb('1', 'TRUNGBINHCHUNG', '4', 18, 3.0), tb('1', 'TRUNGBINHTICHLUY', '4', 18, 3.05)],
        rsDiemKetThucHocPhan: [{ ID: 'KT1', NAMHOC: '2023-2024', HOCKY: '1', DAOTAO_HOCPHAN_MA: 'IT3200', DAOTAO_HOCPHAN_TEN: 'Cơ sở dữ liệu', DAOTAO_HOCPHAN_HOCTRINH: 3, LANHOC: 1, LANTHI: 1, DIEM: 8.7, DIEMQUYDOI: 4, DIEMQUYDOI_TEN: 'A', DANHGIA_TEN: 'Đạt' },
            { ID: 'KT2', NAMHOC: '2023-2024', HOCKY: '1', DAOTAO_HOCPHAN_MA: 'MI1110', DAOTAO_HOCPHAN_TEN: 'Giải tích', DAOTAO_HOCPHAN_HOCTRINH: 4, LANHOC: 1, LANTHI: 2, DIEM: 4.2, DIEMQUYDOI: 1, DIEMQUYDOI_TEN: 'D', DANHGIA_TEN: 'Đạt' },
            { ID: 'KT3', NAMHOC: '2023-2024', HOCKY: '2', DAOTAO_HOCPHAN_MA: 'IT3100', DAOTAO_HOCPHAN_TEN: 'Lập trình HĐT', DAOTAO_HOCPHAN_HOCTRINH: 3, LANHOC: 1, LANTHI: 1, DIEM: 7.5, DIEMQUYDOI: 3, DIEMQUYDOI_TEN: 'B', DANHGIA_TEN: 'Đạt' }],
        rsHocPhanChuaHoanThanh: [{ DAOTAO_HOCPHAN_MA: 'PH1110', DAOTAO_HOCPHAN_TEN: 'Vật lý đại cương', DAOTAO_HOCPHAN_HOCTRINH: 3, DIEM: 3.5, DANHGIA_TEN: 'Không đạt', LANHOC: 1, LANTHI: 2, THOIGIAN: '2023_2024_1', DIEM_DANHSACHHOC_TEN: 'PH1110.02' }] } };
    fx[T + 'LayKetQuaTichLuyTheoKhoi'] = { rows: { rsTongHop: [{ MAKHOI: 'DC', TENKHOI: 'Đại cương', TONGSOTINCHICUAKHOI: 40, SOBATBUOC: 36, SODATICHLUY: 32 }],
        rsChiTiet: [{ MAKHOI: 'DC', TENKHOI: 'Đại cương', DAOTAO_HOCPHAN_MA: 'MI1110', DAOTAO_HOCPHAN_TEN: 'Giải tích', DAOTAO_HOCPHAN_HOCTRINH: 4, DIEM: 4.2, DANHGIA_TEN: 'Đạt', DIEMQUYDOI: 1, DIEMQUYDOI_TEN: 'D', KETQUA: 1 },
            { MAKHOI: 'DC', TENKHOI: 'Đại cương', DAOTAO_HOCPHAN_MA: 'PH1110', DAOTAO_HOCPHAN_TEN: 'Vật lý đại cương', DAOTAO_HOCPHAN_HOCTRINH: 3, DIEM: 3.5, DANHGIA_TEN: 'Không đạt', KETQUA: 0 }] } };
    fx[T + 'LayDSKetQuaXuLyHocVu'] = []; fx[T + 'LayDSQDCaNhan'] = []; fx[T + 'LayDSTN_KetQua_CongNhan_VB'] = [];
    fx[T + 'LayDSThoiGianLichHoc'] = [{ ID: 'TGK', THOIGIAN: '2023_2024_1' }];
    fx[T + 'LayKetQuaDangKyHocCaNhan'] = { rows: { rsKetQuaDangKy: [{ DANGKY_LOPHOCPHAN_ID: 'D1', DANGKY_LOPHOCPHAN_MA: 'IT3200.01', DANGKY_LOPHOCPHAN_TEN: 'Cơ sở dữ liệu 01', DAOTAO_HOCPHAN_HOCTRINH: 3, THONGTINGIANGVIEN: 'ThS. Mai', KIEUHOC_TEN: 'Học mới', THOIGIAN: '2023_2024_1' }], rsLichSuDangKy: [] } };
    fx[T + 'LayKQRenLuyenCaNhan'] = { rows: { rsKy: [{ QLSV_NGUOIHOC_MASO: 'BIT220111', HODEM: 'Nguyễn Văn', TEN: 'An', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'KTPM', DAOTAO_TOCHUCCHUONGTRINH_MA: 'KTPM', DIEM: 85, XEPLOAI_TEN: 'Tốt', THOIGIAN: '2023_2024_1' }], rsNam: [], rsToanKhoa: [] } };
    fx[T + 'LayDSDiemThanhPhanTheoTKHP'] = [{ LANHOC: 1, LANTHI: 1, DIEM_THANHPHANDIEM_TEN: 'Chuyên cần', DIEM: 9 }, { LANHOC: 1, LANTHI: 1, DIEM_THANHPHANDIEM_TEN: 'Giữa kỳ', DIEM: 8 }, { LANHOC: 1, LANTHI: 1, DIEM_THANHPHANDIEM_TEN: 'Cuối kỳ', DIEM: 8.8 }];
    /* Định danh / phân ngành */
    fx[P + 'LayDSNguoiHocChuaCoCauTruc'] = [{ CORE_PERSON_ID: 'P90', IDENTIFIER_NO: '001205009999', HO_TEN: 'Đỗ Thị Hoa', GHICHU: 'Tân sinh viên', MA_NGUOI_HOC: 'NH090' },
        { CORE_PERSON_ID: 'P91', IDENTIFIER_NO: '001205008888', HO_TEN: 'Vũ Văn Nam', GHICHU: '', MA_NGUOI_HOC: 'NH091' }];
    fx[P + 'Them_StudyTrack_Full'] = [];
    ums.demo.add(fx);
})();
