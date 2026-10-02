/* Dữ liệu mẫu cho kehoach/dexuathoso — chỉ dùng ở chế độ dựng thử. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', P5 = 'PKG_CORE_HOSONHANSU_05.', P6 = 'PKG_CORE_HOSONHANSU_06.', fx = {};
    function ok(id) { return { rows: [], raw: { Id: id || 'A1B2C3D4E5F60718293A4B5C6D7E8F90' } }; }
    function dm(ma, ds) { fx[D + ma] = ds.map(function (x, i) { return { ID: ma.replace(/[\W_]/g, '').slice(0, 6) + (i + 1), MA: x[0], TEN: x[1], QUANHECHA_ID: x[2] || null }; }); }

    dm('CORE_PERSON.GENDER_ID', [['NAM', 'Nam'], ['NU', 'Nữ']]);
    dm('CORE_PERSON.DOB_PRECISION_LEVEL', [['EXACT', 'Chính xác'], ['MONTH_ONLY', 'Chỉ biết tháng/năm'], ['YEAR_ONLY', 'Chỉ biết năm'], ['UNKNOWN', 'Không biết']]);
    dm('PERSON_IDENTIFIER.IDENTIFIER_TYPE_CODE', [['CCCD', 'Căn cước công dân'], ['HC', 'Hộ chiếu'], ['MST', 'Mã số thuế']]);
    dm('PERSON_ADDRESS.ADDRESS_TYPE_CODE', [['THUONGTRU', 'Thường trú'], ['TAMTRU', 'Tạm trú'], ['LIENHE', 'Liên hệ']]);
    dm('PERSON_ADDRESS.ADDRESS_STATUS_CODE', [['DANGDUNG', 'Đang sử dụng'], ['CU', 'Địa chỉ cũ']]);
    dm('PERSON_ADDRESS.COUNTRY_ID', [['VN', 'Việt Nam'], ['JP', 'Nhật Bản']]);
    dm('PERSON_FAMILY.RELATION_TYPE_CODE', [['CHA', 'Cha'], ['ME', 'Mẹ'], ['VO', 'Vợ'], ['CON', 'Con']]);
    dm('PERSON_FAMILY.RELATION_STATUS_CODE', [['CONSONG', 'Còn sống'], ['DAMAT', 'Đã mất']]);
    dm('PERSON_BANK_ACCOUNT.ACCOUNT_TYPE_CODE', [['LUONG', 'Tài khoản lương'], ['CANHAN', 'Tài khoản cá nhân']]);
    dm('PERSON_BANK_ACCOUNT.ACCOUNT_STATUS_CODE', [['HOATDONG', 'Đang hoạt động'], ['KHOA', 'Đã khoá']]);
    dm('PERSON_BANK_ACCOUNT.BANK_ID', [['VCB', 'Vietcombank'], ['BIDV', 'BIDV'], ['VTB', 'VietinBank']]);
    dm('PERSON_BANK_ACCOUNT.ACCOUNT_CURRENCY_CODE', [['VND', 'Việt Nam đồng'], ['USD', 'Đô la Mỹ']]);
    dm('PERSON_EDUCATION.EDUCATION_TYPE_CODE', [['CHINHQUY', 'Chính quy'], ['VLVH', 'Vừa làm vừa học']]);
    dm('PERSON_EDUCATION.EDUCATION_LEVEL_CODE', [['DH', 'Đại học'], ['THS', 'Thạc sĩ'], ['TS', 'Tiến sĩ']]);
    dm('PERSON_EDUCATION.EDUCATION_STATUS_CODE', [['TN', 'Đã tốt nghiệp'], ['DH', 'Đang học']]);
    dm('PERSON_EDUCATION.DEGREE_CODE', [['KS', 'Kỹ sư'], ['CN', 'Cử nhân'], ['THS', 'Thạc sĩ']]);
    dm('PERSON_EDUCATION.MAJOR_GROUP_ID', [['748', 'Máy tính và công nghệ thông tin'], ['752', 'Kỹ thuật']]);
    fx[D + 'PERSON_EDUCATION.MAJOR_ID'] = [
        { ID: 'PERSON1', MA: '7480201', TEN: 'Công nghệ thông tin', QUANHECHA_ID: 'PERSON1_G' },
        { ID: 'PERSON2', MA: '7480101', TEN: 'Khoa học máy tính', QUANHECHA_ID: 'PERSON1_G' }
    ];
    fx[D + 'PERSON_EDUCATION.MAJOR_GROUP_ID'][0].ID = 'PERSON1_G';
    dm('PERSON_EDUCATION.SPECIALIZATION_ID', [['HTTT', 'Hệ thống thông tin'], ['KTPM', 'Kỹ thuật phần mềm']]);
    dm('PERSON_EDUCATION.INSTITUTION_ID', [['BKA', 'Đại học Bách khoa Hà Nội'], ['QHI', 'Đại học Công nghệ - ĐHQGHN']]);
    dm('PERSON_EDUCATION.COUNTRY_ID', [['VN', 'Việt Nam'], ['FR', 'Pháp']]);
    dm('PERSON_EDUCATION.CLASSIFICATION_CODE', [['GIOI', 'Giỏi'], ['KHA', 'Khá']]);
    dm('PERSON_CERTIFICATE.CERTIFICATE_TYPE_CODE', [['NN', 'Ngoại ngữ'], ['TH', 'Tin học']]);
    dm('PERSON_CERTIFICATE.CERTIFICATE_STATUS_CODE', [['HL', 'Còn hiệu lực'], ['HH', 'Hết hạn']]);
    dm('PERSON_CERTIFICATE.CERTIFICATE_CODE', [['IELTS', 'IELTS'], ['TOEIC', 'TOEIC']]);
    dm('PERSON_CERTIFICATE.CATEGORY_ID', [['QT', 'Quốc tế'], ['TN', 'Trong nước']]);
    dm('PERSON_CERTIFICATE.LEVEL_ID', [['B2', 'B2'], ['C1', 'C1']]);
    dm('PERSON_CERTIFICATE.CLASSIFICATION_CODE', [['DAT', 'Đạt'], ['GIOI', 'Giỏi']]);
    dm('PERSON_CERTIFICATE.ISSUED_BY_ORG_ID', [['BC', 'British Council'], ['IIG', 'IIG Việt Nam']]);
    fx[D + 'PERSON_CERTIFICATE.COUNTRY_ID'] = [];
    dm('PERSON_DOCUMENT.DOCUMENT_TYPE_CODE', [['QD', 'Quyết định'], ['HD', 'Hợp đồng']]);
    dm('PERSON_DOCUMENT.DOCUMENT_STATUS_CODE', [['HL', 'Hiệu lực'], ['HUY', 'Đã huỷ']]);
    dm('PERSON_DOCUMENT.ISSUED_BY_ORG_ID', [['TCCB', 'Phòng Tổ chức cán bộ'], ['BGD', 'Bộ Giáo dục và Đào tạo']]);
    dm('PERSON_ACADEMIC_RANK.ACADEMIC_RANK_CODE', [['PGS', 'Phó giáo sư'], ['GS', 'Giáo sư']]);
    fx[D + 'PERSON_ACADEMIC_RANK.ISSUED_BY_ORG_ID'] = [];
    fx[D + 'CHUN.DMTT2'] = [
        { ID: 'VN', MA: 'VN', TEN: 'Việt Nam', QUANHECHA_ID: null },
        { ID: 'HN', MA: '01', TEN: 'Thành phố Hà Nội', QUANHECHA_ID: 'VN' },
        { ID: 'HP', MA: '31', TEN: 'Thành phố Hải Phòng', QUANHECHA_ID: 'VN' },
        { ID: 'HN1', MA: '00004', TEN: 'Phường Ba Đình', QUANHECHA_ID: 'HN' },
        { ID: 'HN2', MA: '00008', TEN: 'Phường Ngọc Hà', QUANHECHA_ID: 'HN' },
        { ID: 'HP1', MA: '11311', TEN: 'Phường Hồng Bàng', QUANHECHA_ID: 'HP' }
    ];
    fx['pkg_chung_danhmuc.LayDanhSachDuLieuDanhMuc'] = function (o) {
        var cn = { PERSONB1: [{ ID: 'CN1', MA: 'VCB-HN', TEN: 'Vietcombank Hà Nội' }, { ID: 'CN2', MA: 'VCB-TL', TEN: 'Vietcombank Thăng Long' }] };
        return cn[o.strQUANHECHA_Id] || [];
    };

    var T1 = 'A0000000000000000000000000000001', T2 = 'A0000000000000000000000000000002', L1 = 'B0000000000000000000000000000001', L2 = 'B0000000000000000000000000000002';
    fx[P5 + 'LayDSLoaiDinhDanhBatBuoc'] = [{ ID: T1, MA: 'CCCD', TEN: 'Căn cước công dân' }, { ID: T2, MA: 'HC', TEN: 'Hộ chiếu' }];
    fx[P5 + 'LayDSLoaiLienHeBatBuoc'] = [{ ID: L1, MA: 'DT', TEN: 'Điện thoại di động' }, { ID: L2, MA: 'EMAIL', TEN: 'Email' }];

    var P1 = 'C0000000000000000000000000000001';
    fx[P5 + 'GetCorePersonByNguoiTaoId'] = [
        { ID: P1, CURRENT_EMPLOYEE_CODE: 'CB2026001', FULL_NAME: 'Nguyễn Minh Anh', LAST_NAME: 'Nguyễn', MIDDLE_NAME: 'Minh', FIRST_NAME: 'Anh',
          DATE_OF_BIRTH: '15/04/1991', BIRTH_DAY: 15, BIRTH_MONTH: 4, BIRTH_YEAR: 1991, DOB_PRECISION_LEVEL: 'COREPE1', GENDER_ID: 'COREPE2', GENDER_NAME: 'Nữ',
          PROFILE_STATUS_NAME: 'Đang đề xuất', IS_ACTIVE: 1, CREATED_AT_DD_MM_YYYY_HHMMSS: '12/09/2026 08:30:12', CREATED_BY_TAIKHOAN: 'tccb01', PORTRAIT_FILE_ID: '' },
        { ID: 'C0000000000000000000000000000002', CURRENT_EMPLOYEE_CODE: '', FULL_NAME: 'Trần Quốc Bảo', LAST_NAME: 'Trần', MIDDLE_NAME: 'Quốc', FIRST_NAME: 'Bảo',
          DATE_OF_BIRTH: '1988', BIRTH_YEAR: 1988, DOB_PRECISION_LEVEL: 'COREPE3', GENDER_ID: 'COREPE1', GENDER_NAME: 'Nam',
          PROFILE_STATUS_NAME: 'Mới tạo', IS_ACTIVE: 1, CREATED_AT_DD_MM_YYYY_HHMMSS: '20/09/2026 14:05:40', CREATED_BY_TAIKHOAN: 'tccb01' },
        { ID: 'C0000000000000000000000000000003', CURRENT_EMPLOYEE_CODE: 'CB2026007', FULL_NAME: 'Lê Thị Hồng Nhung', LAST_NAME: 'Lê', MIDDLE_NAME: 'Thị Hồng', FIRST_NAME: 'Nhung',
          DATE_OF_BIRTH: '02/12/1995', BIRTH_DAY: 2, BIRTH_MONTH: 12, BIRTH_YEAR: 1995, DOB_PRECISION_LEVEL: 'COREPE1', GENDER_ID: 'COREPE2', GENDER_NAME: 'Nữ',
          PROFILE_STATUS_NAME: 'Đang đề xuất', IS_ACTIVE: 1, CREATED_AT_DD_MM_YYYY_HHMMSS: '22/09/2026 09:12:03', CREATED_BY_TAIKHOAN: 'khoacntt' },
        { ID: 'C0000000000000000000000000000004', FULL_NAME: 'Phạm Văn Hùng', DATE_OF_BIRTH: '07/07/1985', GENDER_NAME: 'Nam', IS_ACTIVE: 0,
          UPDATED_AT_DD_MM_YYYY_HHMMSS: '24/09/2026 16:40:00', UPDATED_BY_TAIKHOAN: 'tccb01' }
    ];
    ['InsertCorePerson', 'UpdateCorePerson', 'DeleteCorePerson', 'InsertPersonIdentifier', 'UpdatePersonIdentifier', 'InsertPersonContact', 'UpdatePersonContact']
        .forEach(function (k) { fx[P5 + k] = ok(); });
    fx[P5 + 'KiemTraThongTinDinhDanh'] = function (o) {
        return o.strIdentifier_No === '001091000123' ? [{ IDENTIFIER_TYPE_CODE_NAME: 'Căn cước công dân', IDENTIFIER_NO: '001091000123', ISSUE_DATE: '10/08/2021',
            ISSUE_PLACE: 'Cục CSQLHC về TTXH', FULL_NAME: 'Nguyễn Minh Anh', NOTE: '' }] : [];
    };
    fx[P5 + 'KiemTraThongTinLienHe'] = [];
    fx[P5 + 'GetPersonIdentifierByPerson_Id'] = function (o) {
        return o.strPerson_Id === P1 ? [{ ID: 'D1', IDENTIFIER_TYPE_CODE: T1, IDENTIFIER_NO: '001091000123', ISSUE_DATE: '10/08/2021', ISSUE_PLACE: 'Cục CSQLHC về TTXH', IS_PRIMARY: 1 }] : [];
    };
    fx[P5 + 'GetPersonContactByPerson_Id'] = function (o) {
        return o.strPerson_Id === P1 ? [{ ID: 'E1', CONTACT_TYPE_CODE_ID: L1, CONTACT_VALUE: '0912345678', IS_PRIMARY: 1 }, { ID: 'E2', CONTACT_TYPE_CODE_ID: L2, CONTACT_VALUE: 'minhanh@example.edu.vn' }] : [];
    };

    function cua(ds) { return function (o) { return ds.filter(function (r) { return r.PERSON_ID === o.strPerson_Id; }); }; }
    fx[P6 + 'Get_Person_Address'] = cua([
        { ID: 'DC1', PERSON_ID: P1, ADDRESS_TYPE_CODE: 'PERSON1', ADDRESS_TYPE_CODE_NAME: 'Thường trú', ADDRESS_STATUS_CODE: 'PERSON1', ADDRESS_STATUS_CODE_NAME: 'Đang sử dụng',
          COUNTRY_ID: 'PERSON1', COUNTRY_NAME: 'Việt Nam', PROVINCE_ID: 'HN', PROVINCE_NAME: 'Thành phố Hà Nội', WARD_ID: 'HN2', WARD_NAME: 'Phường Ngọc Hà',
          ADDRESS_LINE1: 'Số 12 ngõ 45 Đội Cấn', ADDRESS_LINE2: '', FULL_ADDRESS: 'Số 12 ngõ 45 Đội Cấn, Phường Ngọc Hà, Thành phố Hà Nội, Việt Nam', POSTAL_CODE: '100000',
          IS_PRIMARY: 1, EFFECTIVE_FROM: '01/01/2020', EFFECTIVE_TO: '', IS_ACTIVE: 1, NOTE: '' }
    ]);
    fx[P6 + 'Get_Person_Family'] = cua([
        { ID: 'GD1', PERSON_ID: P1, RELATION_TYPE_CODE: 'PERSON2', RELATION_TYPE_CODE_NAME: 'Mẹ', RELATION_STATUS_CODE: 'PERSON1', RELATION_STATUS_CODE_NAME: 'Còn sống',
          FULL_NAME: 'Đỗ Thị Lan', LAST_NAME: 'Đỗ', MIDDLE_NAME: 'Thị', FIRST_NAME: 'Lan', GENDER_ID: 'COREPE2', GENDER_NAME: 'Nữ', DOB_PRECISION_LEVEL: 'COREPE3',
          DOB_PRECISION_LEVEL_NAME: 'Chỉ biết năm', DATE_OF_BIRTH: '1965', BIRTH_YEAR: 1965, OCCUPATION: 'Giáo viên (nghỉ hưu)', IS_ACTIVE: 1, IS_DEPENDENT: 0 }
    ]);
    fx[P6 + 'Get_Person_Bank_Account'] = cua([
        { ID: 'TK1', PERSON_ID: P1, ACCOUNT_TYPE_CODE: 'PERSON1', ACCOUNT_TYPE_CODE_NAME: 'Tài khoản lương', ACCOUNT_STATUS_CODE_NAME: 'Đang hoạt động',
          BANK_ID: 'PERSONB1', BANK_CODE: 'VCB', BANK_NAME: 'Vietcombank', BRANCH_ID: 'CN2', BRANCH_CODE: 'VCB-TL', BRANCH_NAME: 'Vietcombank Thăng Long',
          ACCOUNT_NUMBER: '0011004567890', ACCOUNT_NAME: 'NGUYEN MINH ANH', ACCOUNT_CURRENCY_CODE: 'PERSON1', ACCOUNT_CURRENCY_CODE_NAME: 'Việt Nam đồng',
          IS_PRIMARY: 1, IS_PAYROLL_DEFAULT: 1, IS_VERIFIED: 1, EFFECTIVE_FROM: '01/03/2021', IS_ACTIVE: 1 }
    ]);
    fx[D + 'PERSON_BANK_ACCOUNT.BANK_ID'][0].ID = 'PERSONB1';
    var HV = [{ ID: 'HV1', PERSON_ID: P1, EDUCATION_TYPE_CODE: 'PERSON1', EDUCATION_TYPE_CODE_NAME: 'Chính quy', EDUCATION_LEVEL_CODE: 'PERSON2',
        EDUCATION_LEVEL_CODE_NAME: 'Thạc sĩ', EDUCATION_STATUS_CODE_NAME: 'Đã tốt nghiệp', DEGREE_CODE: 'PERSON3', DEGREE_NAME: 'Thạc sĩ Khoa học máy tính',
        MAJOR_GROUP_ID: 'PERSON1_G', MAJOR_ID: 'PERSON2', MAJOR_CODE: '7480101', MAJOR_NAME: 'Khoa học máy tính', SPECIALIZATION_ID: 'PERSON2',
        SPECIALIZATION_CODE: 'KTPM', SPECIALIZATION_NAME: 'Kỹ thuật phần mềm', INSTITUTION_ID: 'PERSON1', INSTITUTION_CODE: 'BKA',
        INSTITUTION_NAME: 'Đại học Bách khoa Hà Nội', COUNTRY_NAME: 'Việt Nam', ENROLLMENT_YEAR: 2014, START_DATE: '05/09/2014', COMPLETION_DATE: '20/10/2016',
        GRADUATION_YEAR: 2016, CLASSIFICATION_CODE_NAME: 'Giỏi', GPA: 3.6, GPA_SCALE: 4, DEGREE_NUMBER: 'ThS-2016-00123', DEGREE_ISSUE_DATE: '15/12/2016',
        IS_HIGHEST: 1, IS_RECOGNIZED: 1, IS_ACTIVE: 1 }];
    fx[P6 + 'Get_Person_Education'] = cua(HV);
    fx[P6 + 'Get_Person_Education_By_Id'] = [{ DUMMY: 'X' }];
    var CC = [{ ID: 'CC1', PERSON_ID: P1, CERTIFICATE_TYPE_CODE: 'PERSON1', CERTIFICATE_TYPE_CODE_NAME: 'Ngoại ngữ', CERTIFICATE_STATUS_CODE_NAME: 'Còn hiệu lực',
        CERTIFICATE_CODE: 'PERSON1', CERTIFICATE_NAME: 'IELTS Academic', CATEGORY_NAME: 'Quốc tế', LEVEL_NAME: 'C1', SCORE: 7.5, SCORE_SCALE: 9,
        CLASSIFICATION_CODE_NAME: 'Giỏi', CERTIFICATE_NO: '24VN012345', ISSUED_BY_ORG_NAME: 'British Council', COUNTRY_ID: 'PERSON1', COUNTRY_NAME: 'Việt Nam',
        ISSUE_DATE: '10/06/2024', EXPIRE_DATE: '10/06/2026', IS_MAIN_CERTIFICATE: 1, IS_ACTIVE: 1, FILE_ID: '' }];
    fx[P6 + 'Get_Person_Certificate'] = cua(CC);
    fx[P6 + 'Get_Person_Certificate_By_Id'] = function (o) { return CC.filter(function (r) { return r.ID === o.strId; }); };
    var TL = [{ ID: 'TL1', PERSON_ID: P1, DOCUMENT_TYPE_CODE: 'PERSON1', DOCUMENT_TYPE_CODE_NAME: 'Quyết định', DOCUMENT_STATUS_CODE_NAME: 'Hiệu lực',
        DOCUMENT_NAME: 'Quyết định tuyển dụng', DOCUMENT_NO: '215/QĐ-ĐHKT', DOCUMENT_TITLE: 'V/v tuyển dụng viên chức năm 2026', FILE_ID: 'F-2026-0215',
        FILE_NAME: 'qd-215.pdf', FILE_EXT: 'pdf', ISSUED_BY_ORG_ID: 'PERSON1', ISSUED_BY_ORG_CODE: 'TCCB', ISSUED_BY_ORG_NAME: 'Phòng Tổ chức cán bộ',
        ISSUE_DATE: '2026-09-01', IS_ACTIVE: 1 }];
    fx[P6 + 'Get_Person_Document'] = cua(TL);
    fx[P6 + 'Get_Person_Document_By_Id'] = function (o) { return TL.filter(function (r) { return r.ID === o.strId; }); };
    var HH = [{ ID: 'HH1', PERSON_ID: P1, ACADEMIC_RANK_CODE: 'PERSON1', ACADEMIC_RANK_NAME: 'Phó giáo sư', DECISION_NO: '45/QĐ-HĐGSNN', DECISION_DATE: '15/11/2024',
        RECOGNITION_DATE: '15/11/2024', ISSUED_BY_ORG_ID: 'PERSON2', ISSUED_BY_ORG_ID_NAME: 'Bộ Giáo dục và Đào tạo', ISSUED_BY_ORG_NAME: 'Hội đồng Giáo sư nhà nước',
        IS_CURRENT: 1, IS_ACTIVE: 1 }];
    fx[P6 + 'Get_Person_Academic_Rank'] = cua(HH);
    fx[P6 + 'Get_Person_Academic_Rank_By_Id'] = function (o) { return HH.filter(function (r) { return r.ID === o.strId; }); };
    ['Address', 'Family', 'Bank_Account', 'Education', 'Certificate', 'Document', 'Academic_Rank'].forEach(function (e) {
        ['Ins', 'Upd', 'Del'].forEach(function (p) { fx[P6 + p + '_Person_' + e] = ok(); });
    });

    ums.demo.add(fx);
})();
