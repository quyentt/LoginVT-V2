/* Dữ liệu mẫu cho ba màn Quản trị quyền dữ liệu (quantriquyendulieu, m1, m2) — chỉ dùng ở chế độ dựng thử.
   Quyền đã gán giữ trong bộ nhớ: Thêm / Xoá trên màn đổi được dữ liệu mẫu tới khi tải lại trang. */
(function () {
    'use strict';
    var CHIEU = [
        { ID: 'DIM_HE', DIMENSION_CODE: 'HEDAOTAO', DIMENSION_NAME: 'Hệ đào tạo' },
        { ID: 'DIM_KHOA', DIMENSION_CODE: 'KHOADAOTAO', DIMENSION_NAME: 'Khóa đào tạo' },
        { ID: 'DIM_KQL', DIMENSION_CODE: 'KHOAQUANLY', DIMENSION_NAME: 'Khoa quản lý' },
        { ID: 'DIM_CT', DIMENSION_CODE: 'CHUONGTRINH', DIMENSION_NAME: 'Chương trình đào tạo' },
        { ID: 'DIM_LOP', DIMENSION_CODE: 'LOPQUANLY', DIMENSION_NAME: 'Lớp quản lý' }
    ];
    function gt(id, ma, ten, gc) { return { ID: id, VALUE_CODE: ma, VALUE_NAME: ten, GHICHU: gc || '' }; }
    var GIATRI = {
        DIM_HE: [gt('V_H1', 'DHCQ', 'Đại học chính quy'), gt('V_H2', 'LT', 'Liên thông đại học'), gt('V_H3', 'VLVH', 'Vừa làm vừa học'), gt('V_H4', 'THS', 'Thạc sĩ')],
        DIM_KHOA: [gt('V_K65', 'K65', 'Khóa 65', '2020–2024'), gt('V_K66', 'K66', 'Khóa 66', '2021–2025'), gt('V_K67', 'K67', 'Khóa 67', '2022–2026'), gt('V_K68', 'K68', 'Khóa 68', '2023–2027')],
        DIM_KQL: [gt('V_Q1', 'CNTT', 'Khoa Công nghệ thông tin'), gt('V_Q2', 'KT', 'Khoa Kinh tế'), gt('V_Q3', 'NN', 'Khoa Ngoại ngữ')],
        DIM_CT: [gt('V_C1', '7480103', 'Kỹ thuật phần mềm'), gt('V_C2', '7340101', 'Quản trị kinh doanh'), gt('V_C3', '7480104', 'Hệ thống thông tin'), gt('V_C4', '7220201', 'Ngôn ngữ Anh')],
        DIM_LOP: []
    };
    ['KTPM', 'QTKD', 'HTTT', 'NNA'].forEach(function (nganh, i) {
        [66, 67, 68].forEach(function (k) {
            [1, 2].forEach(function (s) {
                var ma = 'K' + k + '-' + nganh + s;
                GIATRI.DIM_LOP.push(gt('V_L' + k + nganh + s, ma, 'Lớp ' + ma, i === 0 && k === 67 ? 'Lớp chất lượng cao' : ''));
            });
        });
    });

    /* Quyền đã gán — theo nhân sự (U), vai trò (R), nhân sự × vai trò × chức năng (URF) */
    var U = [
        { ID: 'US1', CORE_PERSON_ID: 'NS1', CORE_DATA_DIMENSION_ID: 'DIM_HE', DIMENSION_VALUE_ID: 'V_H1', SCOPE_MODE: 'INCLUDE' },
        { ID: 'US2', CORE_PERSON_ID: 'NS1', CORE_DATA_DIMENSION_ID: 'DIM_KQL', DIMENSION_VALUE_ID: 'V_Q1', SCOPE_MODE: 'INCLUDE' },
        { ID: 'US3', CORE_PERSON_ID: 'NS3', CORE_DATA_DIMENSION_ID: 'DIM_LOP', DIMENSION_VALUE_ID: 'V_L67KTPM1', SCOPE_MODE: 'INCLUDE' }
    ];
    var R = [
        { ID: 'RS1', ROLE_ID: 'VT_DT', CORE_DATA_DIMENSION_ID: 'DIM_HE', DIMENSION_VALUE_ID: 'V_H1' },
        { ID: 'RS2', ROLE_ID: 'VT_DT', CORE_DATA_DIMENSION_ID: 'DIM_HE', DIMENSION_VALUE_ID: 'V_H2' },
        { ID: 'RS3', ROLE_ID: 'VT_CTSV', CORE_DATA_DIMENSION_ID: 'DIM_KQL', DIMENSION_VALUE_ID: 'V_Q2' }
    ];
    var URF = [
        { USER_ID: 'P01', ROLE_ID: 'VT_DT', FUNCTION_ID: '', DIMENSION_ID: 'DIM_KHOA', DIMENSION_VALUE_ID: 'V_K67' },
        { USER_ID: 'P01', ROLE_ID: 'VT_DT', FUNCTION_ID: '', DIMENSION_ID: 'DIM_KHOA', DIMENSION_VALUE_ID: 'V_K68' }
    ];
    var so = 100;

    /* Đơn vị (NS_CoCauToChuc) — cây theo PARENT */
    var CCTC = [
        { ID: 'DV_BGH', TEN: 'Ban Giám hiệu', PARENT: null, THUTU: 1 },
        { ID: 'DV_P', TEN: 'Khối phòng ban', PARENT: null, THUTU: 2 },
        { ID: 'DV_PDT', TEN: 'Phòng Đào tạo', PARENT: 'DV_P', THUTU: 1 },
        { ID: 'DV_PCTSV', TEN: 'Phòng Công tác sinh viên', PARENT: 'DV_P', THUTU: 2 },
        { ID: 'DV_PKHTC', TEN: 'Phòng Kế hoạch - Tài chính', PARENT: 'DV_P', THUTU: 3 },
        { ID: 'DV_K', TEN: 'Khối khoa', PARENT: null, THUTU: 3 },
        { ID: 'DV_KCNTT', TEN: 'Khoa Công nghệ thông tin', PARENT: 'DV_K', THUTU: 1 },
        { ID: 'DV_BMKTPM', TEN: 'Bộ môn Kỹ thuật phần mềm', PARENT: 'DV_KCNTT', THUTU: 1 },
        { ID: 'DV_KKT', TEN: 'Khoa Kinh tế', PARENT: 'DV_K', THUTU: 2 }
    ];

    /* m1 — đơn vị / nhân sự theo Core Employment */
    var DV_EMP = [{ ID: 'OU1', NAME: 'Phòng Đào tạo', CODE: 'PDT' }, { ID: 'OU2', NAME: 'Khoa Công nghệ thông tin', CODE: 'CNTT' }, { ID: 'OU3', NAME: 'Khoa Kinh tế', CODE: 'KT' }];
    var NS_EMP = [
        { ID: 'P01', FULL_NAME: 'Nguyễn Thị Lan', CURRENT_EMPLOYEE_CODE: 'CB0021', ORG_NAME: 'Phòng Đào tạo', OU: 'OU1', VT: ['VT_DT'] },
        { ID: 'P02', FULL_NAME: 'Trần Văn Khánh', CURRENT_EMPLOYEE_CODE: 'CB0034', ORG_NAME: 'Phòng Đào tạo', OU: 'OU1', VT: ['VT_DT', 'VT_GV'] },
        { ID: 'P03', FULL_NAME: 'Phạm Minh Tuấn', CURRENT_EMPLOYEE_CODE: 'CB0105', ORG_NAME: 'Phòng Đào tạo', OU: 'OU1', VT: [] },
        { ID: 'P04', FULL_NAME: 'Lê Thu Hà', CURRENT_EMPLOYEE_CODE: 'CB0212', ORG_NAME: 'Khoa Công nghệ thông tin', OU: 'OU2', VT: ['VT_GV'] },
        { ID: 'P05', FULL_NAME: 'Đỗ Quang Huy', CURRENT_EMPLOYEE_CODE: 'CB0230', ORG_NAME: 'Khoa Công nghệ thông tin', OU: 'OU2', VT: ['VT_GV', 'VT_CTSV'] },
        { ID: 'P06', FULL_NAME: 'Vũ Thị Hồng', CURRENT_EMPLOYEE_CODE: 'CB0318', ORG_NAME: 'Khoa Kinh tế', OU: 'OU3', VT: ['VT_GV'] }
    ];
    function sach(p) { var r = {}; Object.keys(p).forEach(function (k) { if (k !== 'OU' && k !== 'VT') r[k] = p[k]; }); return r; }

    /* Vai trò — cây theo CHUNG_VAITRO_CHA_ID */
    var VAITRO = [
        { ID: 'VT_QT', TENVAITRO: 'Quản trị hệ thống', CHUNG_VAITRO_CHA_ID: null, THUTU: 1 },
        { ID: 'VT_DT', TENVAITRO: 'Phòng Đào tạo', CHUNG_VAITRO_CHA_ID: null, THUTU: 2 },
        { ID: 'VT_DT_KH', TENVAITRO: 'Đào tạo - Kế hoạch', CHUNG_VAITRO_CHA_ID: 'VT_DT', THUTU: 1 },
        { ID: 'VT_DT_TKB', TENVAITRO: 'Đào tạo - Thời khóa biểu', CHUNG_VAITRO_CHA_ID: 'VT_DT', THUTU: 2 },
        { ID: 'VT_CTSV', TENVAITRO: 'Công tác sinh viên', CHUNG_VAITRO_CHA_ID: null, THUTU: 3 },
        { ID: 'VT_GV', TENVAITRO: 'Giảng viên', CHUNG_VAITRO_CHA_ID: null, THUTU: 4 },
        { ID: 'VT_GV_CN', TENVAITRO: 'Giáo viên chủ nhiệm', CHUNG_VAITRO_CHA_ID: 'VT_GV', THUTU: 1 }
    ];
    var CHUCNANG = [
        { ID: 'F_HS', TENCHUCNANG: 'Hồ sơ người học', CHUCNANGCHA_ID: null, THUTU: 1 },
        { ID: 'F_HS_TC', TENCHUCNANG: 'Tra cứu hồ sơ', CHUCNANGCHA_ID: 'F_HS', THUTU: 1 },
        { ID: 'F_HS_CN', TENCHUCNANG: 'Cập nhật hồ sơ', CHUCNANGCHA_ID: 'F_HS', THUTU: 2 },
        { ID: 'F_DIEM', TENCHUCNANG: 'Quản lý điểm', CHUCNANGCHA_ID: null, THUTU: 2 },
        { ID: 'F_DIEM_NHAP', TENCHUCNANG: 'Nhập điểm', CHUCNANGCHA_ID: 'F_DIEM', THUTU: 1 }
    ];

    ums.demo.add({
        'PKG_CORE_QUANTRI_02.LayDSCore_Data_Dimension': CHIEU,
        'PKG_CORE_QUANTRI_02.LayDSCore_Dimension_Value': function (o) {
            return (GIATRI[o.strCore_Data_Dimension_Id] || []).map(function (x) { var r = {}; Object.keys(x).forEach(function (k) { r[k] = x[k]; }); return r; });
        },

        /* Theo nhân sự */
        'NS_CoCauToChuc/LayDanhSach': CCTC,
        'PKG_CORE_QUANTRI_02.LayDSCore_D_Value_U_Data_Scope': function (o) {
            return U.filter(function (x) { return x.CORE_PERSON_ID === o.strCore_Person_Id && x.CORE_DATA_DIMENSION_ID === o.strCore_Data_Dimension_Id; });
        },
        'PKG_CORE_QUANTRI_02.Them_Core_User_Data_Scope': function (o) {
            U.push({ ID: 'US' + (++so), CORE_PERSON_ID: o.strUserId, CORE_DATA_DIMENSION_ID: o.strDimensionId, DIMENSION_VALUE_ID: o.strDimensionValueId, SCOPE_MODE: o.strScopeMode });
            return [];
        },
        'PKG_CORE_QUANTRI_02.Xoa_Core_User_Data_Scope': function (o) { U = U.filter(function (x) { return x.ID !== o.strId; }); return []; },

        /* Theo vai trò */
        'CMS_VaiTro/LayDanhSach': VAITRO,
        'PKG_CORE_QUANTRI_02.LayDSCore_D_Value_R_Data_Scope': function (o) {
            return R.filter(function (x) { return x.ROLE_ID === o.strRoleId && x.CORE_DATA_DIMENSION_ID === o.strDimensionId; });
        },
        'PKG_CORE_QUANTRI_02.Them_Core_Role_Data_Scope': function (o) {
            R.push({ ID: 'RS' + (++so), ROLE_ID: o.strRoleId, CORE_DATA_DIMENSION_ID: o.strDimensionId, DIMENSION_VALUE_ID: o.strDimensionValueId });
            return [];
        },
        'PKG_CORE_QUANTRI_02.Xoa_Core_Role_Data_Scope': function (o) { R = R.filter(function (x) { return x.ID !== o.strId; }); return []; },

        /* Nhân sự × vai trò × chức năng (m1) */
        'PKG_CORE_HOSONHANSU_03.LayDSDonViTheoCore_Employment': DV_EMP,
        'PKG_CORE_HOSONHANSU_03.LayDSNhanSuTheoCore_Employment': function (o) {
            return NS_EMP.filter(function (p) { return !o.strOrg_Unit_Id || p.OU === o.strOrg_Unit_Id; }).map(sach);
        },
        'PKG_CORE_QUANTRI_02.Pr_Core_Person_Get_By_R_F_Emp': function (o) {
            return NS_EMP.filter(function (p) {
                return (!o.strDonVi_Id || p.OU === o.strDonVi_Id) && (!o.strVaiTro_Id || p.VT.indexOf(o.strVaiTro_Id) >= 0);
            }).map(sach);
        },
        'PKG_CORE_QUANTRI_01.LayDSChucNangTheoUDVaiTro': function (o) { return o.strVaiTro_Id ? CHUCNANG : []; },
        'PKG_CORE_QUANTRI_02.LayDSCore_D_V_URF_Data_Scope': function (o) {
            return URF.filter(function (x) {
                return x.USER_ID === o.strCore_Person_Id && x.ROLE_ID === (o.strCore_Role_Id || '') &&
                    x.FUNCTION_ID === (o.strChucNang_Id || '') && x.DIMENSION_ID === o.strCore_Data_Dimension_Id;
            });
        },
        'PKG_CORE_QUANTRI_02.Pr_Core_U_R_F_Data_Scope_In': function (o) {
            URF.push({ USER_ID: o.strUser_Id, ROLE_ID: o.strRole_Id || '', FUNCTION_ID: o.strFunction_Id || '', DIMENSION_ID: o.strDimension_Id, DIMENSION_VALUE_ID: o.strDimension_Value_Id });
            return [];
        },
        'PKG_CORE_QUANTRI_02.Pr_Co_U_R_F_Da_Sc_De_By_URFDV': function (o) {
            URF = URF.filter(function (x) {
                return !(x.USER_ID === o.strUser_Id && x.ROLE_ID === (o.strRole_Id || '') && x.FUNCTION_ID === (o.strFunction_Id || '') &&
                    x.DIMENSION_ID === o.strDimension_Id && x.DIMENSION_VALUE_ID === o.strDimension_Value_Id);
            });
            return [];
        }
    });
})();
