/* Dữ liệu mẫu cho hoso nhóm A (_hsA.js) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', P5 = 'PKG_CORE_HOSONHANSU_05.', P6 = 'PKG_CORE_HOSONHANSU_06.', NH = 'PKG_CORE_NGUOIHOC_01.', fx = {};
    function ok(id) { return { rows: [], raw: { Id: id || 'F1F2F3F4F5F60718293A4B5C6D7E8F90' } }; }
    function dm(ma, ds) { fx[D + ma] = ds.map(function (x, i) { return { ID: x[2] || ma.replace(/[\W_]/g, '').slice(0, 6) + (i + 1), MA: x[0], TEN: x[1] }; }); }

    dm('CORE_PERSON.GENDER_ID', [['NAM', 'Nam', 'GT_NAM'], ['NU', 'Nữ', 'GT_NU']]);
    dm('CORE_PERSON.DOB_PRECISION_LEVEL', [['EXACT', 'Chính xác'], ['MONTH_ONLY', 'Chỉ biết tháng/năm'], ['YEAR_ONLY', 'Chỉ biết năm'], ['UNKNOWN', 'Không biết']]);
    dm('CHUN.CHLU', [['VN', 'Việt Nam', 'QT_VN'], ['LA', 'Lào', 'QT_LA'], ['KH', 'Campuchia', 'QT_KH']]);
    dm('NS.DATO', [['KINH', 'Kinh', 'DT_KINH'], ['TAY', 'Tày', 'DT_TAY'], ['MUONG', 'Mường', 'DT_MUONG'], ['THAI', 'Thái', 'DT_THAI']]);
    dm('NS.TOGI', [['KHONG', 'Không', 'TG_KHONG'], ['PHATGIAO', 'Phật giáo', 'TG_PG'], ['CONGGIAO', 'Công giáo', 'TG_CG']]);
    dm('TS.DOITUONGHOADON', [['CA_NHAN', 'CA_NHAN', 'DTHD_CN'], ['TO_CHUC', 'TO_CHUC', 'DTHD_TC']]);
    dm('PERSON_BANK_ACCOUNT.ACCOUNT_TYPE_CODE', [['CANHAN', 'Tài khoản cá nhân', 'LTK_CN'], ['HOCBONG', 'Tài khoản nhận học bổng', 'LTK_HB']]);
    dm('PERSON_ADDRESS.ADDRESS_TYPE_CODE', [['NOISINH', 'Nơi sinh', 'LDC_NS'], ['HOKHAU', 'Hộ khẩu thường trú', 'LDC_HK'], ['TAMTRU', 'Tạm trú', 'LDC_TT']]);
    /* CHUN.DMTT phẳng: Hà Nội 3 cấp, Thái Nguyên 2 cấp (xã treo thẳng vào tỉnh) */
    fx[D + 'CHUN.DMTT'] = [
        { ID: 'T_HN', TEN: 'Thành phố Hà Nội', QUANHECHA_ID: null }, { ID: 'T_TN', TEN: 'Tỉnh Thái Nguyên', QUANHECHA_ID: null },
        { ID: 'H_CG', TEN: 'Quận Cầu Giấy', QUANHECHA_ID: 'T_HN' }, { ID: 'H_BD', TEN: 'Quận Ba Đình', QUANHECHA_ID: 'T_HN' },
        { ID: 'X_DV', TEN: 'Phường Dịch Vọng', QUANHECHA_ID: 'H_CG' }, { ID: 'X_MD', TEN: 'Phường Mai Dịch', QUANHECHA_ID: 'H_CG' },
        { ID: 'X_NH', TEN: 'Phường Ngọc Hà', QUANHECHA_ID: 'H_BD' },
        { ID: 'X_PT', TEN: 'Phường Phan Đình Phùng', QUANHECHA_ID: 'T_TN' }, { ID: 'X_DH', TEN: 'Xã Đại Phúc', QUANHECHA_ID: 'T_TN' }
    ];

    /* Loại định danh / liên hệ bắt buộc — tên đặt theo danh mục thật của trường (CCCD, TAX_CODE, Email, Di động) */
    var T1 = 'A1000000000000000000000000000001', T2 = 'A1000000000000000000000000000002', L1 = 'B1000000000000000000000000000001', L2 = 'B1000000000000000000000000000002';
    fx[P5 + 'LayDSLoaiDinhDanhBatBuoc'] = [{ ID: T1, MA: 'CCCD', TEN: 'Căn cước công dân' }, { ID: T2, MA: 'TAX_CODE', TEN: 'Mã số thuế cá nhân' }];
    fx[P5 + 'LayDSLoaiLienHeBatBuoc'] = [{ ID: L1, MA: 'EMAIL', TEN: 'Email cá nhân' }, { ID: L2, MA: 'MOBILE', TEN: 'Số điện thoại di động' }];

    var S1 = 'C1000000000000000000000000000001', S2 = 'C1000000000000000000000000000002', S3 = 'C1000000000000000000000000000003';
    var SV = [
        { ID: S1, MASO: 'DCQT.14.420233195', HODEM: 'Đặng Bác', TEN: 'Ái', NGAYSINH_NGAY: '12', NGAYSINH_THANG: '03', NGAYSINH_NAM: '2005', GIOITINH_ID: 'GT_NAM', GIOITINH_MA: 'NAM',
          DANTOC_MA: 'KINH', TONGIAO_MA: 'KHONG', QUOCTICH_MA: 'VN', ANH: '' },
        { ID: S2, MASO: 'BIT220263', HODEM: 'Nguyễn Thị Thu', TEN: 'Hà', NGAYSINH_NGAY: '05', NGAYSINH_THANG: '11', NGAYSINH_NAM: '2004', GIOITINH_ID: 'GT_NU', GIOITINH_MA: 'NU',
          DANTOC_MA: 'TAY', TONGIAO_MA: 'KHONG', QUOCTICH_MA: 'VN', ANH: '' },
        { ID: S3, MASO: 'BBA220561', HODEM: 'Lê', TEN: 'Minh', NGAYSINH_NAM: '2004', GIOITINH_MA: 'NAM', ANH: '' },
        { ID: 'C1000000000000000000000000000004', MASO: 'DCQT.14.420233201', HODEM: 'Phạm Quốc', TEN: 'Bảo', NGAYSINH_NGAY: '21', NGAYSINH_THANG: '07', NGAYSINH_NAM: '2005', GIOITINH_MA: 'NAM' },
        { ID: 'C1000000000000000000000000000005', MASO: 'DCQT.14.420233217', HODEM: 'Vũ Thị', TEN: 'Lan', NGAYSINH_NGAY: '02', NGAYSINH_THANG: '09', NGAYSINH_NAM: '2005', GIOITINH_MA: 'NU' },
        { ID: 'C1000000000000000000000000000006', MASO: 'DCQT.14.420233222', HODEM: 'Hoàng Văn', TEN: 'Nam', NGAYSINH_NGAY: '30', NGAYSINH_THANG: '01', NGAYSINH_NAM: '2005', GIOITINH_MA: 'NAM' }
    ];
    function tim(o) {
        var q = String(o.strTuKhoa || '').toLowerCase();
        var ds = SV.filter(function (r) { return !q || (r.MASO + ' ' + r.HODEM + ' ' + r.TEN).toLowerCase().indexOf(q) >= 0; });
        var sz = Number(o.pageSize) || 10, pg = Number(o.pageIndex) || 1;
        return { rows: ds.slice((pg - 1) * sz, pg * sz), pager: ds.length };
    }
    fx['SV_HoSo/LayDanhSach'] = tim;
    fx['SV_HoSoKhoiTao/LayDanhSach'] = tim;

    fx[NH + 'LayDSNguoiHoc_All'] = function (o) {
        var r = SV.filter(function (x) { return x.MASO === o.strTuKhoa; })[0];
        return r ? [{ ID: r.ID, MASO: r.MASO, HODEM: r.HODEM, TEN: r.TEN, TTLL_DIENTHOAICANHAN: '0912345678', QLSV_TRANGTHAINGUOIHOC_MA: 'NORMAL',
            QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học', DAOTAO_LOPQUANLY_N1_TEN: 'DCQT.K14.01', NGANHHOC_N1_TEN: 'Quản trị kinh doanh',
            KHOAHOC_N1_TEN: 'Khoá 14', NIENKHOA_N1: '2023-2027' }] : [];
    };
    fx[P5 + 'GetPersonIdentifierByPerson_Id'] = function (o) {
        return o.strPerson_Id === S1 ? [{ ID: 'D1000000000000000000000000000001', PERSON_ID: S1, IDENTIFIER_TYPE_CODE: T1, IDENTIFIER_NO: '026205003347', ISSUE_DATE: '10/08/2021', ISSUE_PLACE: 'Cục Cảnh sát QLHC về TTXH', IS_PRIMARY: 1 }] : [];
    };
    fx[P5 + 'GetPersonContactByPerson_Id'] = function (o) {
        return o.strPerson_Id === S1 ? [{ ID: 'E1000000000000000000000000000001', PERSON_ID: S1, CONTACT_TYPE_CODE_ID: L1, CONTACT_VALUE: 'ai.dangbac@example.edu.vn', IS_PRIMARY: 1, IS_ACTIVE: 1 },
            { ID: 'E1000000000000000000000000000002', PERSON_ID: S1, CONTACT_TYPE_CODE_ID: L2, CONTACT_VALUE: '0912345678', IS_ACTIVE: 1 }] : [];
    };
    fx[P5 + 'KiemTraThongTinDinhDanh'] = function (o) {
        return o.strIdentifier_No === '001091000123' ? [{ PERSON_ID: 'C9999999999999999999999999999999', IDENTIFIER_NO: '001091000123' }] : [];
    };
    fx[P5 + 'KiemTraThongTinLienHe'] = [];
    fx[NH + 'LayTTPerson_Profile'] = function (o) {
        return o.strPerson_Id === S1 ? [{ PERSON_PROFILE_ID: 'F1000000000000000000000000000001', ETHNICITY_ID: 'DT_KINH', RELIGION_ID: 'TG_KHONG', MARITAL_STATUS_ID: '', BLOOD_TYPE_CODE: 'O' }] : [];
    };
    fx[NH + 'LayDS_PersonInvoiceInfo'] = function (o) {
        return o.strPerson_Id === S1 ? [{ ID: 'F2000000000000000000000000000001', BUYER_TYPE_LOAI: 'CA_NHAN', BUYER_NAME_TENNM: 'Đặng Bác Ái', BUYER_ADDR_DIACHI: 'Số 1, Phường Dịch Vọng, Quận Cầu Giấy, Thành phố Hà Nội',
            BUYER_TAX_MST: '', BUYER_EMAIL: 'ai.dangbac@example.edu.vn', BUYER_PHONE_SDT: '0912345678' }] : [];
    };
    fx[P6 + 'Get_Person_Bank_Account'] = function (o) {
        return o.strPerson_Id === S1 ? [{ ID: 'F3000000000000000000000000000001', PERSON_ID: S1, ACCOUNT_TYPE_CODE: 'CANHAN', BANK_NAME: 'Vietcombank', ACCOUNT_NUMBER: '0011004567890',
            ACCOUNT_NAME: 'DANG BAC AI', NOTE: '', IS_PRIMARY: 1, IS_ACTIVE: 1 }] : [];
    };
    fx[P6 + 'Get_Person_Address'] = function (o) {
        return o.strPerson_Id === S1 ? [
            { ID: 'F4000000000000000000000000000001', PERSON_ID: S1, ADDRESS_TYPE_CODE: 'LDC_NS', PROVINCE_ID: 'T_TN', WARD_ID: 'X_PT', ADDRESS_LINE1: 'Tổ 5', IS_ACTIVE: 1 },
            { ID: 'F4000000000000000000000000000002', PERSON_ID: S1, ADDRESS_TYPE_CODE: 'LDC_HK', PROVINCE_ID: 'T_HN', DISTRICT_ID: 'H_CG', WARD_ID: 'X_DV', ADDRESS_LINE1: 'Số 1 Nguyễn Phong Sắc', IS_ACTIVE: 1 }
        ] : [];
    };
    ['UpdateCorePerson', 'InsertPersonIdentifier', 'UpdatePersonIdentifier', 'InsertPersonContact', 'UpdatePersonContact'].forEach(function (k) { fx[P5 + k] = ok(); });
    ['Ins_Person_Address', 'Upd_Person_Address', 'Ins_Person_Bank_Account', 'Upd_Person_Bank_Account'].forEach(function (k) { fx[P6 + k] = ok(); });
    ['Them_Person_Profile', 'Sua_Person_Profile', 'Them_PersonInvoiceInfo', 'Sua_PersonInvoiceInfo'].forEach(function (k) { fx[NH + k] = ok(); });

    ums.demo.add(fx);
})();
