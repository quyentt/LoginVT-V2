/* Dữ liệu mẫu cho khung _vitri.js (vitricongviec, vaitrovitri tab 1) — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function dm(id, ma, ten, tenDM) { return { ID: id, MA: ma, TEN: ten, CHUNG_TENDANHMUC_TEN: tenDM || '' }; }
    var JOB = [
        { ID: 'J1', JOB_CODE: 'V.07.01.03', JOB_NAME: 'Giảng viên' },
        { ID: 'J2', JOB_CODE: 'V.07.01.02', JOB_NAME: 'Giảng viên chính' },
        { ID: 'J3', JOB_CODE: '01.003', JOB_NAME: 'Chuyên viên' }
    ];
    var LVT = { VT1: 'Quản lý', VT2: 'Chuyên môn', VT3: 'Hỗ trợ' };
    function ten(ids) { return String(ids || '').split(',').map(function (i) { var j = JOB.filter(function (x) { return x.ID === i; })[0]; return j ? j.JOB_NAME : ''; }).filter(Boolean).join(', '); }
    function pos(id, org, ma, tenVT, loai, chuChot, jobs, hc) {
        return { ID: id, ORG_UNIT_ID: org, POSITION_CODE: ma, POSITION_NAME: tenVT, POSITION_SHORT_NAME: ma, POSITION_TYPE_CODE: loai,
            POSITION_TYPE_CODE_NAME: LVT[loai], IS_KEY_POSITION: chuChot, JOB_ID: jobs, JOB: ten(jobs), MAX_HEADCOUNT: hc,
            START_DATE: '01/01/2024', END_DATE: '', DESCRIPTION: '', IS_ACTIVE: 1 };
    }
    var POS = [
        pos('P1', 'CC02', 'TK-CNTT', 'Trưởng khoa', 'VT1', 1, 'J2', 1),
        pos('P2', 'CC02', 'GV-CNTT', 'Giảng viên', 'VT2', 0, 'J1,J2', 40),
        pos('P3', 'CC07', 'CV-PDT', 'Chuyên viên đào tạo', 'VT3', 0, 'J3', 8)
    ];
    var seq = 10;
    function set(r, o) {
        r.POSITION_CODE = o.strPosition_Code; r.POSITION_NAME = o.strPosition_Name; r.POSITION_SHORT_NAME = o.strPosition_Short_Name;
        r.POSITION_TYPE_CODE = o.strPosition_Type_Code; r.POSITION_TYPE_CODE_NAME = LVT[o.strPosition_Type_Code] || '';
        r.IS_KEY_POSITION = Number(o.dIs_Key_Position); r.JOB_ID = o.strJob_Ids; r.JOB = ten(o.strJob_Ids); r.MAX_HEADCOUNT = o.dMax_HeadCount;
        r.START_DATE = o.strStart_Date; r.END_DATE = o.strEnd_Date; r.DESCRIPTION = o.strDescription; r.IS_ACTIVE = Number(o.dIs_Active);
        return r;
    }
    var ROLE = [{ ID: 'RM1', POSITION_ID: 'P1', ROLE_ID: 'VT01', ROLE_NAME: 'Lãnh đạo khoa', START_DATE: '01/01/2024', END_DATE: '', IS_ACTIVE: 1, NOTE: '' }];
    var VAITRO = [{ ID: 'VT01', TENVAITRO: 'Lãnh đạo khoa' }, { ID: 'VT02', TENVAITRO: 'Giảng viên' }, { ID: 'VT03', TENVAITRO: 'Chuyên viên phòng' }];
    ums.demo.add({
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#CORE.DONVI.LOAIQUANHE': [dm('LQ1', 'TT', 'Trực thuộc', 'Loại đơn vị'), dm('LQ2', 'PH', 'Phối hợp', 'Loại đơn vị')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#CORE.DONVI.LOAIVITRI': [dm('VT1', 'QL', 'Quản lý', 'Kiểu vị trí'), dm('VT2', 'CM', 'Chuyên môn', 'Kiểu vị trí'), dm('VT3', 'HT', 'Hỗ trợ', 'Kiểu vị trí')],
        'PKG_CORE_HOSONHANSU_03.LayDSCore_Job': JOB,
        'PKG_CORE_HOSONHANSU_03.LayDSCore_PositionByUnit': function (o) { return POS.filter(function (r) { return r.ORG_UNIT_ID === o.strOrg_Unit_Id; }); },
        'PKG_CORE_HOSONHANSU_03.Them_Core_Position': function (o) { var r = set({ ID: 'P' + (seq++), ORG_UNIT_ID: o.strOrg_Unit_Id }, o); POS.push(r); return { rows: [], raw: { Id: r.ID } }; },
        'PKG_CORE_HOSONHANSU_03.Sua_Core_Position': function (o) { POS.forEach(function (r) { if (r.ID === o.strId) set(r, o); }); return []; },
        'PKG_CORE_HOSONHANSU_03.Xoa_Core_Position': function (o) { for (var i = POS.length - 1; i >= 0; i--) if (POS[i].ID === o.strId) POS.splice(i, 1); return []; },
        'PKG_CORE_QUANTRI_03.Pr_Core_Position_Role_Map_Gets': function (o) {
            return ROLE.filter(function (r) { return r.POSITION_ID === o.strPosition_Id; }).map(function (r) {
                var p = POS.filter(function (x) { return x.ID === r.POSITION_ID; })[0] || {};
                return Object.assign({ POSITION_NAME: p.POSITION_NAME }, r);
            });
        },
        'PKG_CORE_QUANTRI_03.Pr_Core_Position_Role_Map_In': function (o) {
            var v = VAITRO.filter(function (x) { return x.ID === o.strRole_Id; })[0] || {};
            ROLE.push({ ID: 'RM' + (seq++), POSITION_ID: o.strPosition_Id, ROLE_ID: o.strRole_Id, ROLE_NAME: v.TENVAITRO, START_DATE: o.strStart_Date, END_DATE: o.strEnd_Date, IS_ACTIVE: Number(o.dIs_Active), NOTE: o.strNote });
            return [];
        },
        'CMS_VaiTro/LayDanhSach': VAITRO
    });
})();
