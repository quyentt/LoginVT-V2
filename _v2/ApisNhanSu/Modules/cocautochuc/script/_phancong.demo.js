/* Dữ liệu mẫu cho _phancong.js (phanconglaodong, quanhelaodong) — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function dm(id, ma, ten, tenDM) { return { ID: id, MA: ma, TEN: ten, CHUNG_TENDANHMUC_TEN: tenDM || '' }; }
    function ng(id, ma, ten, ns, gt, cccd, org, orgTen, vt, emp, loai, loaiTen, tt) {
        return { ID: id, PERSON_ID: id, CURRENT_EMPLOYEE_CODE: ma, FULL_NAME: ten, DATE_OF_BIRTH: ns, GENDER_NAME: gt, CCCD: cccd,
            ORG_ID: org, ORG_NAME: orgTen, POSITION_NAME: vt, STATUS_CODE_NAME: 'Đang làm việc', CORE_EMPLOYMENT_ID: emp,
            EMPLOYMENT_TYPE_CODE: loai, EMPLOYMENT_TYPE_CODE_NAME: loaiTen, EMPLOYMENT_STATUS_CODE: tt, EMPLOYMENT_EFFECTIVE_FROM: '01/09/2020', EMPLOYMENT_IS_ACTIVE: emp ? 1 : null };
    }
    var CO = [
        ng('PS1', 'CB0211', 'Nguyễn Văn Hùng', '12/04/1978', 'Nam', '001078012345', 'OU02', 'Khoa Công nghệ thông tin', 'Trưởng khoa', 'EM1', 'BC', 'Biên chế', 'HL'),
        ng('PS2', 'CB0215', 'Trần Thị Mai', '03/09/1988', 'Nữ', '001188054321', 'OU03', 'Khoa Kinh tế', 'Giảng viên', 'EM2', 'HD', 'Hợp đồng lao động', 'HL')
    ];
    var CHUA = [ng('PS3', 'CB0302', 'Lê Quang Minh', '21/01/1983', 'Nam', '001083099999', '', '', '', '', '', '', '')];
    var NGHI = [ng('PS4', 'CB0099', 'Phạm Thu Hà', '15/06/1960', 'Nữ', '001160011111', 'OU04', 'Phòng Tổ chức cán bộ', 'Chuyên viên', '', '', '', '')];
    var EMP = [
        { ID: 'EM1', PERSON_ID: 'PS1', EMPLOYMENT_TYPE_CODE: 'BC', EMPLOYMENT_TYPE_CODE_NAME: 'Biên chế', EMPLOYMENT_STATUS_CODE: 'HL', EMPLOYMENT_STATUS_CODE_NAME: 'Còn hiệu lực',
            LEGAL_ENTITY_ID: 'OU01', LEGAL_ENTITY_NAME: 'Ban Giám hiệu', EMPLOYER_ORG_ID: 'OU02', EFFECTIVE_FROM: '01/09/2020', EFFECTIVE_TO: '', IS_PRIMARY: 1, IS_ACTIVE: 1, STAFF_CODE: 'CB0211' },
        { ID: 'EM2', PERSON_ID: 'PS2', EMPLOYMENT_TYPE_CODE: 'HD', EMPLOYMENT_TYPE_CODE_NAME: 'Hợp đồng lao động', EMPLOYMENT_STATUS_CODE: 'HL', EMPLOYMENT_STATUS_CODE_NAME: 'Còn hiệu lực',
            LEGAL_ENTITY_ID: 'OU01', LEGAL_ENTITY_NAME: 'Ban Giám hiệu', EMPLOYER_ORG_ID: 'OU03', EFFECTIVE_FROM: '15/08/2022', EFFECTIVE_TO: '14/08/2027', IS_PRIMARY: 1, IS_ACTIVE: 1, STAFF_CODE: 'CB0215' }
    ];
    var ASG = [
        { ID: 'AS1', PERSON_ID: 'PS1', EMPLOYMENT_ID: 'EM1', ORG_ID: 'OU02', POSITION_ID: 'PS01', POSITION_NAME: 'Trưởng khoa', ASSIGNMENT_TYPE_CODE: 'CT', ASSIGNMENT_TYPE_CODE_NAME: 'Chính thức',
            ASSIGNMENT_STATUS_CODE: 'DL', EFFECTIVE_FROM: '01/09/2020', EFFECTIVE_TO: '', EMPLOYMENT_TYPE_CODE_NAME: 'Biên chế', IS_PRIMARY: 1, IS_ACTIVE: 1, NOTE: '' }
    ];
    var seq = 10;
    function like(rows, q) { q = String(q || '').toLowerCase(); return rows.filter(function (r) { return !q || (r.FULL_NAME + ' ' + r.CURRENT_EMPLOYEE_CODE).toLowerCase().indexOf(q) >= 0; }); }
    ums.demo.add({
        'PKG_CORE_HOSONHANSU_04.Get_Person_Co_Employment': function (o) { return like(CO, o.strKeyword); },
        'PKG_CORE_HOSONHANSU_04.Get_Person_Chua_Co_Employment': function (o) { return like(CHUA, o.strKeyword); },
        'PKG_CORE_HOSONHANSU_04.Get_Person_Da_Nghi_Viec': function (o) { return like(NGHI, o.strKeyword); },
        'PKG_CORE_HOSONHANSU_04.Get_Core_Employment': function (o) { return EMP.filter(function (r) { return r.PERSON_ID === o.strPerson_Id; }); },
        'PKG_CORE_HOSONHANSU_04.Get_Core_Employment_By_Id': function (o) { return EMP.filter(function (r) { return r.ID === o.strId; }); },
        'PKG_CORE_HOSONHANSU_04.Ins_Core_Employment': function (o) {
            var id = 'EM' + (seq++);
            EMP.push({ ID: id, PERSON_ID: o.strPerson_Id, EMPLOYMENT_TYPE_CODE: o.strEmployment_Type_Code, EMPLOYMENT_STATUS_CODE: o.strEmployment_Status_Code,
                LEGAL_ENTITY_ID: o.strLegal_Entity_Id, EMPLOYER_ORG_ID: o.strOrg_Id, EFFECTIVE_FROM: o.strEffective_From, EFFECTIVE_TO: o.strEffective_To,
                IS_PRIMARY: Number(o.dIs_Primary), IS_ACTIVE: 1, STAFF_CODE: o.strStaff_Code, NOTE: o.strNote });
            return { rows: id, raw: { Id: id } };
        },
        'PKG_CORE_HOSONHANSU_04.Upd_Core_Employment': function (o) {
            EMP.forEach(function (r) { if (r.ID === o.strId) { r.EMPLOYMENT_TYPE_CODE = o.strEmployment_Type_Code; r.EMPLOYMENT_TYPE_CODE_NAME = ''; r.NOTE = o.strNote; r.EFFECTIVE_FROM = o.strEffective_From; r.EFFECTIVE_TO = o.strEffective_To; } });
            return [];
        },
        'PKG_CORE_HOSONHANSU_04.Del_Core_Employment': function (o) { EMP = EMP.filter(function (r) { return r.ID !== o.strId; }); return []; },
        'PKG_CORE_HOSONHANSU_04.Get_Core_Assignment': function (o) { return ASG.filter(function (r) { return r.PERSON_ID === o.strPerson_Id && r.EMPLOYMENT_ID === o.strEmployment_Id; }); },
        'PKG_CORE_HOSONHANSU_04.Get_Core_Assignment_By_Id': function (o) { return ASG.filter(function (r) { return r.ID === o.strId; }); },
        'PKG_CORE_HOSONHANSU_04.Ins_Core_Assignment': function (o) {
            ASG.push({ ID: 'AS' + (seq++), PERSON_ID: o.strPerson_Id, EMPLOYMENT_ID: o.strEmployment_Id, ORG_ID: o.strOrg_Id, POSITION_ID: o.strPosition_Id,
                POSITION_NAME: o.strPosition_Id, ASSIGNMENT_TYPE_CODE: o.strAssignment_Type_Code, ASSIGNMENT_STATUS_CODE: o.strAssignment_Status_Code,
                EFFECTIVE_FROM: o.strEffective_From, EFFECTIVE_TO: o.strEffective_To, IS_PRIMARY: o.dIs_Primary, IS_ACTIVE: 1, NOTE: o.strNote });
            return [];
        },
        'PKG_CORE_HOSONHANSU_04.Upd_Core_Assignment': function (o) { ASG.forEach(function (r) { if (r.ID === o.strId) { r.EFFECTIVE_FROM = o.strEffective_From; r.EFFECTIVE_TO = o.strEffective_To; r.NOTE = o.strNote; } }); return []; },
        'PKG_CORE_HOSONHANSU_04.Del_Core_Assignment': function (o) { ASG = ASG.filter(function (r) { return r.ID !== o.strId; }); return []; },
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#CORE.QUANHELAODONG.LOAI': [dm('BC', 'BC', 'Biên chế', 'Loại quan hệ lao động'), dm('HD', 'HD', 'Hợp đồng lao động', 'Loại quan hệ lao động')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#CORE.QUANHELAODONG.TRANGTHAI': [dm('HL', 'HL', 'Còn hiệu lực', 'Trạng thái QHLĐ'), dm('TD', 'TD', 'Tạm dừng', 'Trạng thái QHLĐ')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#CORE_ASSIGNMENT.ASSIGNMENT_TYPE_CODE': [dm('CT', 'CT', 'Chính thức', 'Loại phân công'), dm('KN', 'KN', 'Kiêm nhiệm', 'Loại phân công')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#CORE_ASSIGNMENT.ASSIGNMENT_STATUS_CODE': [dm('DL', 'DL', 'Đang làm', 'Trạng thái phân công'), dm('KT', 'KT', 'Kết thúc', 'Trạng thái phân công')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#CORE_EMPLOYMENT.CONTRACT_TYPE_CODE': [dm('HDXD', 'XD', 'Xác định thời hạn'), dm('HDKXD', 'KXD', 'Không xác định thời hạn')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#CORE_EMPLOYMENT.STAFF_CODE_STATUS_CODE': [dm('MS1', 'CAP', 'Đã cấp')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#CORE_EMPLOYMENT.WORKING_TIME_MODE_CODE': [dm('TG1', 'TT', 'Toàn thời gian'), dm('TG2', 'BT', 'Bán thời gian')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#CORE_EMPLOYMENT.WORK_ARRANGEMENT_CODE': [dm('BT1', 'TT', 'Tại trường')]
    });
})();
