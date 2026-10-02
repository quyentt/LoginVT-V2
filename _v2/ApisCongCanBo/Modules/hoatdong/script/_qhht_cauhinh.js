/* =========================================================================
   Cấu hình 7 tab "Khai thông tin các quá trình" của người học (hoatdong/DaQHHT)
   CHÉP NGUYÊN khối _processConfig của DaQHHT.js (dòng 2284–2479 bản gốc) —
   action / func / tên tham số / cột trả về không đổi một ký tự; chỉ đổi biểu
   tượng sao sang FA7. Dùng bởi _qhht_quatrinh.js.
   ========================================================================= */
(function () {
    'use strict';
    var qhht = ums.qhht = ums.qhht || {};
    qhht.QUATRINH = {
        'DiaChi': {
            title: 'Địa chỉ', icon: 'fa-map-marker-alt', tabZoneId: 'qtm_diachi',
            ep: {
                list: { a: 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4AJSUzJDIy', f: 'PKG_CORE_HOSONHANSU_06.Get_Person_Address' },
                ins:  { a: 'NS_HoSoNhanSu6_MH/CC8yHhEkMzIuLx4AJSUzJDIy', f: 'PKG_CORE_HOSONHANSU_06.Ins_Person_Address' },
                upd:  { a: 'NS_HoSoNhanSu6_MH/FDElHhEkMzIuLx4AJSUzJDIy', f: 'PKG_CORE_HOSONHANSU_06.Upd_Person_Address' },
                del:  { a: 'NS_HoSoNhanSu6_MH/BSQtHhEkMzIuLx4AJSUzJDIy', f: 'PKG_CORE_HOSONHANSU_06.Del_Person_Address' }
            },
            columns: [
                { key: 'ADDRESS_TYPE_CODE_NAME', label: 'Loại', fallback: ['ADDRESS_TYPE_NAME', 'ADDRESS_TYPE_CODE'] },
                { key: 'FULL_ADDRESS', label: 'Địa chỉ đầy đủ', fallback: ['ADDRESS_LINE1'] },
                { key: 'IS_PRIMARY', label: 'Chính', center: true, render: function (v) { return v == 1 ? '<i class="fa-solid fa-star" style="color:#f0ad4e"></i>' : ''; } }
            ],
            fields: [
                { name: 'strAddress_Type_Code', label: 'Loại địa chỉ (Code)', type: 'text', from: 'ADDRESS_TYPE_CODE', col: 6 },
                { name: 'strAddress_Status_Code', label: 'Trạng thái (Code)', type: 'text', from: 'ADDRESS_STATUS_CODE', col: 6 },
                { name: 'strCountry_Id', label: 'Quốc gia ID', type: 'text', from: 'COUNTRY_ID', col: 4 },
                { name: 'strProvince_Id', label: 'Tỉnh ID', type: 'text', from: 'PROVINCE_ID', col: 4 },
                { name: 'strWard_Id', label: 'Phường/Xã ID', type: 'text', from: 'WARD_ID', col: 4 },
                { name: 'strAddress_Line1', label: 'Dòng 1', type: 'text', from: 'ADDRESS_LINE1', col: 6 },
                { name: 'strAddress_Line2', label: 'Dòng 2', type: 'text', from: 'ADDRESS_LINE2', col: 6 },
                { name: 'strFull_Address', label: 'Địa chỉ đầy đủ', type: 'text', from: 'FULL_ADDRESS', col: 12 },
                { name: 'strPostal_Code', label: 'Mã bưu chính', type: 'text', from: 'POSTAL_CODE', col: 6 },
                { name: 'dIs_Primary', label: 'Là địa chỉ chính', type: 'checkbox', from: 'IS_PRIMARY', col: 6 },
                { name: 'strEffective_From', label: 'Hiệu lực từ', type: 'text', from: 'EFFECTIVE_FROM', col: 6, placeholder: 'dd/mm/yyyy' },
                { name: 'strEffective_To', label: 'Hiệu lực đến', type: 'text', from: 'EFFECTIVE_TO', col: 6, placeholder: 'dd/mm/yyyy' },
                { name: 'strNote', label: 'Ghi chú', type: 'textarea', from: 'NOTE', col: 12 }
            ]
        },
        'GiaDinh': {
            title: 'Gia đình', icon: 'fa-users', tabZoneId: 'qtm_giadinh',
            ep: {
                list: { a: 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4HICwoLTgP', f: 'PKG_CORE_HOSONHANSU_06.Get_Person_Family' },
                ins:  { a: 'NS_HoSoNhanSu6_MH/CC8yHhEkMzIuLx4HICwoLTgP', f: 'PKG_CORE_HOSONHANSU_06.Ins_Person_Family' },
                upd:  { a: 'NS_HoSoNhanSu6_MH/FDElHhEkMzIuLx4HICwoLTgP', f: 'PKG_CORE_HOSONHANSU_06.Upd_Person_Family' },
                del:  { a: 'NS_HoSoNhanSu6_MH/BSQtHhEkMzIuLx4HICwoLTgP', f: 'PKG_CORE_HOSONHANSU_06.Del_Person_Family' }
            },
            columns: [
                { key: 'RELATIONSHIP_NAME', label: 'Quan hệ', fallback: ['RELATIONSHIP_CODE'] },
                { key: 'FULL_NAME', label: 'Họ và tên' },
                { key: 'PHONE_NUMBER', label: 'SĐT' },
                { key: 'OCCUPATION', label: 'Nghề nghiệp' }
            ],
            fields: [
                { name: 'strRelationship_Code', label: 'Mã quan hệ', type: 'text', from: 'RELATIONSHIP_CODE', col: 6 },
                { name: 'strFull_Name', label: 'Họ và tên', type: 'text', from: 'FULL_NAME', col: 6, required: true },
                { name: 'strGender_Code', label: 'Giới tính (Code)', type: 'text', from: 'GENDER_CODE', col: 4 },
                { name: 'strDate_Of_Birth', label: 'Ngày sinh', type: 'text', from: 'DATE_OF_BIRTH', col: 4, placeholder: 'dd/mm/yyyy' },
                { name: 'strOccupation', label: 'Nghề nghiệp', type: 'text', from: 'OCCUPATION', col: 4 },
                { name: 'strPhone_Number', label: 'Số điện thoại', type: 'text', from: 'PHONE_NUMBER', col: 6 },
                { name: 'strEmail', label: 'Email', type: 'text', from: 'EMAIL', col: 6 },
                { name: 'strIdentity_Number', label: 'Số CCCD', type: 'text', from: 'IDENTITY_NUMBER', col: 6 },
                { name: 'strWorkplace', label: 'Nơi làm việc', type: 'text', from: 'WORKPLACE', col: 6 },
                { name: 'strAddress', label: 'Địa chỉ', type: 'text', from: 'ADDRESS', col: 12 },
                { name: 'dIs_Emergency_Contact', label: 'Liên hệ khẩn cấp', type: 'checkbox', from: 'IS_EMERGENCY_CONTACT', col: 6 },
                { name: 'dIs_Dependent', label: 'Người phụ thuộc', type: 'checkbox', from: 'IS_DEPENDENT', col: 6 },
                { name: 'strNote', label: 'Ghi chú', type: 'textarea', from: 'NOTE', col: 12 }
            ]
        },
        'TKNH': {
            title: 'Tài khoản ngân hàng', icon: 'fa-university', tabZoneId: 'qtm_tknh',
            ep: {
                list: { a: 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4DIC8qHgAiIi40LzUP', f: 'PKG_CORE_HOSONHANSU_06.Get_Person_Bank_Account' },
                ins:  { a: 'NS_HoSoNhanSu6_MH/CC8yHhEkMzIuLx4DIC8qHgAiIi40LzUP', f: 'PKG_CORE_HOSONHANSU_06.Ins_Person_Bank_Account' },
                upd:  { a: 'NS_HoSoNhanSu6_MH/FDElHhEkMzIuLx4DIC8qHgAiIi40LzUP', f: 'PKG_CORE_HOSONHANSU_06.Upd_Person_Bank_Account' },
                del:  { a: 'NS_HoSoNhanSu6_MH/BSQtHhEkMzIuLx4DIC8qHgAiIi40LzUP', f: 'PKG_CORE_HOSONHANSU_06.Del_Person_Bank_Account' }
            },
            columns: [
                { key: 'BANK_NAME', label: 'Ngân hàng', fallback: ['BANK_CODE'] },
                { key: 'ACCOUNT_NUMBER', label: 'Số tài khoản' },
                { key: 'ACCOUNT_HOLDER', label: 'Chủ TK' },
                { key: 'IS_PRIMARY', label: 'Chính', center: true, render: function (v) { return v == 1 ? '<i class="fa-solid fa-star" style="color:#f0ad4e"></i>' : ''; } }
            ],
            fields: [
                { name: 'strBank_Code', label: 'Mã ngân hàng', type: 'text', from: 'BANK_CODE', col: 6 },
                { name: 'strBank_Name', label: 'Tên ngân hàng', type: 'text', from: 'BANK_NAME', col: 6, required: true },
                { name: 'strAccount_Number', label: 'Số tài khoản', type: 'text', from: 'ACCOUNT_NUMBER', col: 6, required: true },
                { name: 'strAccount_Holder', label: 'Chủ tài khoản', type: 'text', from: 'ACCOUNT_HOLDER', col: 6 },
                { name: 'strBranch_Name', label: 'Chi nhánh', type: 'text', from: 'BRANCH_NAME', col: 6 },
                { name: 'strSwift_Code', label: 'SWIFT/BIC', type: 'text', from: 'SWIFT_CODE', col: 6 },
                { name: 'strCurrency_Code', label: 'Loại tiền', type: 'text', from: 'CURRENCY_CODE', col: 4, placeholder: 'VND' },
                { name: 'strAccount_Type_Code', label: 'Loại TK', type: 'text', from: 'ACCOUNT_TYPE_CODE', col: 4 },
                { name: 'dIs_Primary', label: 'TK chính', type: 'checkbox', from: 'IS_PRIMARY', col: 4 },
                { name: 'strNote', label: 'Ghi chú', type: 'textarea', from: 'NOTE', col: 12 }
            ]
        },
        'HocVan': {
            title: 'Học vấn', icon: 'fa-graduation-cap', tabZoneId: 'qtm_hocvan',
            ep: {
                list: { a: 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4EJTQiIDUoLi8P', f: 'PKG_CORE_HOSONHANSU_06.Get_Person_Education' },
                ins:  { a: 'NS_HoSoNhanSu6_MH/CC8yHhEkMzIuLx4EJTQiIDUoLi8P', f: 'PKG_CORE_HOSONHANSU_06.Ins_Person_Education' },
                upd:  { a: 'NS_HoSoNhanSu6_MH/FDElHhEkMzIuLx4EJTQiIDUoLi8P', f: 'PKG_CORE_HOSONHANSU_06.Upd_Person_Education' },
                del:  { a: 'NS_HoSoNhanSu6_MH/BSQtHhEkMzIuLx4EJTQiIDUoLi8P', f: 'PKG_CORE_HOSONHANSU_06.Del_Person_Education' }
            },
            columns: [
                { key: 'EDUCATION_LEVEL_NAME', label: 'Trình độ', fallback: ['EDUCATION_LEVEL_CODE'] },
                { key: 'SCHOOL_NAME', label: 'Trường' },
                { key: 'MAJOR', label: 'Ngành' },
                { key: 'GRADUATION_YEAR', label: 'Năm TN' }
            ],
            fields: [
                { name: 'strEducation_Level_Code', label: 'Trình độ (Code)', type: 'text', from: 'EDUCATION_LEVEL_CODE', col: 6 },
                { name: 'strSchool_Name', label: 'Tên trường', type: 'text', from: 'SCHOOL_NAME', col: 6, required: true },
                { name: 'strMajor', label: 'Ngành học', type: 'text', from: 'MAJOR', col: 6 },
                { name: 'strDegree_Type_Code', label: 'Loại bằng (Code)', type: 'text', from: 'DEGREE_TYPE_CODE', col: 6 },
                { name: 'strGraduation_Year', label: 'Năm tốt nghiệp', type: 'text', from: 'GRADUATION_YEAR', col: 4 },
                { name: 'strStart_Year', label: 'Năm bắt đầu', type: 'text', from: 'START_YEAR', col: 4 },
                { name: 'strGpa', label: 'GPA', type: 'text', from: 'GPA', col: 4 },
                { name: 'strClassification_Code', label: 'Xếp loại (Code)', type: 'text', from: 'CLASSIFICATION_CODE', col: 6 },
                { name: 'strTraining_Form_Code', label: 'Hình thức ĐT (Code)', type: 'text', from: 'TRAINING_FORM_CODE', col: 6 },
                { name: 'strThesis_Title', label: 'Đề tài LV/LA', type: 'text', from: 'THESIS_TITLE', col: 12 },
                { name: 'dIs_Primary', label: 'Chính', type: 'checkbox', from: 'IS_PRIMARY', col: 6 },
                { name: 'strNote', label: 'Ghi chú', type: 'textarea', from: 'NOTE', col: 12 }
            ]
        },
        'ChungChi': {
            title: 'Chứng chỉ', icon: 'fa-certificate', tabZoneId: 'qtm_chungchi',
            ep: {
                list: { a: 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4CJDM1KCcoIiA1JAPP', f: 'PKG_CORE_HOSONHANSU_06.Get_Person_Certificate' },
                ins:  { a: 'NS_HoSoNhanSu6_MH/CC8yHhEkMzIuLx4CJDM1KCcoIiA1JAPP', f: 'PKG_CORE_HOSONHANSU_06.Ins_Person_Certificate' },
                upd:  { a: 'NS_HoSoNhanSu6_MH/FDElHhEkMzIuLx4CJDM1KCcoIiA1JAPP', f: 'PKG_CORE_HOSONHANSU_06.Upd_Person_Certificate' },
                del:  { a: 'NS_HoSoNhanSu6_MH/BSQtHhEkMzIuLx4CJDM1KCcoIiA1JAPP', f: 'PKG_CORE_HOSONHANSU_06.Del_Person_Certificate' }
            },
            columns: [
                { key: 'CERTIFICATE_NAME', label: 'Tên chứng chỉ' },
                { key: 'CERTIFICATE_TYPE_NAME', label: 'Loại', fallback: ['CERTIFICATE_TYPE_CODE'] },
                { key: 'ISSUE_DATE', label: 'Ngày cấp' },
                { key: 'ISSUE_ORG', label: 'Đơn vị cấp' }
            ],
            fields: [
                { name: 'strCertificate_Type_Code', label: 'Loại CC (Code)', type: 'text', from: 'CERTIFICATE_TYPE_CODE', col: 6 },
                { name: 'strCertificate_Name', label: 'Tên chứng chỉ', type: 'text', from: 'CERTIFICATE_NAME', col: 6, required: true },
                { name: 'strCertificate_No', label: 'Số chứng chỉ', type: 'text', from: 'CERTIFICATE_NO', col: 6 },
                { name: 'strIssue_Org', label: 'Đơn vị cấp', type: 'text', from: 'ISSUE_ORG', col: 6 },
                { name: 'strIssue_Date', label: 'Ngày cấp', type: 'text', from: 'ISSUE_DATE', col: 4, placeholder: 'dd/mm/yyyy' },
                { name: 'strEffective_From', label: 'Hiệu lực từ', type: 'text', from: 'EFFECTIVE_FROM', col: 4, placeholder: 'dd/mm/yyyy' },
                { name: 'strEffective_To', label: 'Hiệu lực đến', type: 'text', from: 'EFFECTIVE_TO', col: 4, placeholder: 'dd/mm/yyyy' },
                { name: 'strLevel_Code', label: 'Mức độ (Code)', type: 'text', from: 'LEVEL_CODE', col: 4 },
                { name: 'strScore', label: 'Điểm', type: 'text', from: 'SCORE', col: 4 },
                { name: 'strFile_Id', label: 'File ID', type: 'text', from: 'FILE_ID', col: 4 },
                { name: 'strNote', label: 'Ghi chú', type: 'textarea', from: 'NOTE', col: 12 }
            ]
        },
        'TaiLieu': {
            title: 'Tài liệu', icon: 'fa-file-alt', tabZoneId: 'qtm_tailieu',
            ep: {
                list: { a: 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4FLiI0LCQvNQPP', f: 'PKG_CORE_HOSONHANSU_06.Get_Person_Document' },
                ins:  { a: 'NS_HoSoNhanSu6_MH/CC8yHhEkMzIuLx4FLiI0LCQvNQPP', f: 'PKG_CORE_HOSONHANSU_06.Ins_Person_Document' },
                upd:  { a: 'NS_HoSoNhanSu6_MH/FDElHhEkMzIuLx4FLiI0LCQvNQPP', f: 'PKG_CORE_HOSONHANSU_06.Upd_Person_Document' },
                del:  { a: 'NS_HoSoNhanSu6_MH/BSQtHhEkMzIuLx4FLiI0LCQvNQPP', f: 'PKG_CORE_HOSONHANSU_06.Del_Person_Document' }
            },
            columns: [
                { key: 'DOCUMENT_TYPE_NAME', label: 'Loại', fallback: ['DOCUMENT_TYPE_CODE'] },
                { key: 'DOCUMENT_NAME', label: 'Tên tài liệu' },
                { key: 'DOCUMENT_NO', label: 'Số' },
                { key: 'ISSUE_DATE', label: 'Ngày cấp' }
            ],
            fields: [
                { name: 'strDocument_Type_Code', label: 'Loại TL (Code)', type: 'text', from: 'DOCUMENT_TYPE_CODE', col: 6 },
                { name: 'strDocument_Name', label: 'Tên tài liệu', type: 'text', from: 'DOCUMENT_NAME', col: 6, required: true },
                { name: 'strDocument_No', label: 'Số tài liệu', type: 'text', from: 'DOCUMENT_NO', col: 6 },
                { name: 'strIssue_Org', label: 'Đơn vị cấp', type: 'text', from: 'ISSUE_ORG', col: 6 },
                { name: 'strIssue_Date', label: 'Ngày cấp', type: 'text', from: 'ISSUE_DATE', col: 4, placeholder: 'dd/mm/yyyy' },
                { name: 'strEffective_From', label: 'Hiệu lực từ', type: 'text', from: 'EFFECTIVE_FROM', col: 4, placeholder: 'dd/mm/yyyy' },
                { name: 'strEffective_To', label: 'Hiệu lực đến', type: 'text', from: 'EFFECTIVE_TO', col: 4, placeholder: 'dd/mm/yyyy' },
                { name: 'strFile_Id', label: 'File ID', type: 'text', from: 'FILE_ID', col: 6 },
                { name: 'strDescription', label: 'Mô tả', type: 'textarea', from: 'DESCRIPTION', col: 12 },
                { name: 'strNote', label: 'Ghi chú', type: 'textarea', from: 'NOTE', col: 12 }
            ]
        },
        'HocHam': {
            title: 'Học hàm', icon: 'fa-award', tabZoneId: 'qtm_hocham',
            ep: {
                list: { a: 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4AIiAlJCwoIh4TIC8q', f: 'PKG_CORE_HOSONHANSU_06.Get_Person_Academic_Rank' },
                ins:  { a: 'NS_HoSoNhanSu6_MH/CC8yHhEkMzIuLx4AIiAlJCwoIh4TIC8q', f: 'PKG_CORE_HOSONHANSU_06.Ins_Person_Academic_Rank' },
                upd:  { a: 'NS_HoSoNhanSu6_MH/FDElHhEkMzIuLx4AIiAlJCwoIh4TIC8q', f: 'PKG_CORE_HOSONHANSU_06.Upd_Person_Academic_Rank' },
                del:  { a: 'NS_HoSoNhanSu6_MH/BSQtHhEkMzIuLx4AIiAlJCwoIh4TIC8q', f: 'PKG_CORE_HOSONHANSU_06.Del_Person_Academic_Rank' }
            },
            columns: [
                { key: 'ACADEMIC_RANK_NAME', label: 'Học hàm', fallback: ['ACADEMIC_RANK_CODE'] },
                { key: 'DECISION_NO', label: 'Số QĐ' },
                { key: 'DECISION_DATE', label: 'Ngày QĐ' },
                { key: 'ISSUE_ORG', label: 'Đơn vị cấp' }
            ],
            fields: [
                { name: 'strAcademic_Rank_Code', label: 'Học hàm (Code)', type: 'text', from: 'ACADEMIC_RANK_CODE', col: 6 },
                { name: 'strDecision_No', label: 'Số quyết định', type: 'text', from: 'DECISION_NO', col: 6 },
                { name: 'strDecision_Date', label: 'Ngày QĐ', type: 'text', from: 'DECISION_DATE', col: 4, placeholder: 'dd/mm/yyyy' },
                { name: 'strEffective_From', label: 'Hiệu lực từ', type: 'text', from: 'EFFECTIVE_FROM', col: 4, placeholder: 'dd/mm/yyyy' },
                { name: 'strEffective_To', label: 'Hiệu lực đến', type: 'text', from: 'EFFECTIVE_TO', col: 4, placeholder: 'dd/mm/yyyy' },
                { name: 'strIssue_Org', label: 'Đơn vị cấp', type: 'text', from: 'ISSUE_ORG', col: 12 },
                { name: 'strNote', label: 'Ghi chú', type: 'textarea', from: 'NOTE', col: 12 }
            ]
        }
    };
})();
