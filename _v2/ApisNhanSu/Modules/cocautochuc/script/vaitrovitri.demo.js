/* Dữ liệu mẫu cho vaitrovitri (tab 2, 3) — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function dm(id, ma, ten, tenDM) { return { ID: id, MA: ma, TEN: ten, CHUNG_TENDANHMUC_TEN: tenDM || '' }; }
    var VAITRO = { VT01: 'Lãnh đạo khoa', VT02: 'Giảng viên', VT03: 'Chuyên viên phòng' };
    var LOAI = { BC: 'Biên chế', HD: 'Hợp đồng lao động', CN: 'Kiêm nhiệm', CT: 'Chính thức' };
    var MAP = { E: [{ ID: 'E1', EMPLOYMENT_TYPE_CODE: 'BC', EMPLOYMENT_TYPE_CODE_NAME: 'Biên chế', ROLE_ID: 'VT02', ROLE_NAME: 'Giảng viên', START_DATE: '01/01/2024', END_DATE: '', IS_ACTIVE: 1, NOTE: '' }],
        A: [{ ID: 'A1', ASSIGNMENT_TYPE_CODE: 'CT', ASSIGNMENT_TYPE_CODE_NAME: 'Chính thức', ROLE_ID: 'VT03', ROLE_NAME: 'Chuyên viên phòng', START_DATE: '01/01/2024', END_DATE: '', IS_ACTIVE: 1, NOTE: '' }] };
    var seq = 5;
    function bo(k, khoa, tenKhoa) {
        var fx = {};
        fx['PKG_CORE_QUANTRI_03.Pr_Core_' + k + '_Type_R_Map_Gets'] = function (o) { return MAP[k[0]].filter(function (r) { return r[khoa] === o['str' + (k === 'Employ' ? 'Employment' : 'Assignment') + '_Type_Code']; }); };
        fx['PKG_CORE_QUANTRI_03.Pr_Core_' + k + '_Type_R_Map_In'] = function (o) {
            var code = o['str' + (k === 'Employ' ? 'Employment' : 'Assignment') + '_Type_Code'], r = { ID: k[0] + (seq++), ROLE_ID: o.strRole_Id, ROLE_NAME: VAITRO[o.strRole_Id],
                START_DATE: o.strStart_Date, END_DATE: o.strEnd_Date, IS_ACTIVE: Number(o.dIs_Active), NOTE: o.strNote };
            r[khoa] = code; r[tenKhoa] = LOAI[code];
            MAP[k[0]].push(r);
            return [];
        };
        fx['PKG_CORE_QUANTRI_03.Pr_Core_' + k + '_Type_R_Map_De'] = function (o) { MAP[k[0]] = MAP[k[0]].filter(function (r) { return r.ID !== o.strId; }); return []; };
        ums.demo.add(fx);
    }
    bo('Employ', 'EMPLOYMENT_TYPE_CODE', 'EMPLOYMENT_TYPE_CODE_NAME');
    bo('Assign', 'ASSIGNMENT_TYPE_CODE', 'ASSIGNMENT_TYPE_CODE_NAME');
    ums.demo.add({
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#CORE.QUANHELAODONG.LOAI': [dm('BC', 'BC', 'Biên chế', 'Loại quan hệ lao động'), dm('HD', 'HD', 'Hợp đồng lao động', 'Loại quan hệ lao động')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#CORE_ASSIGNMENT.ASSIGNMENT_TYPE_CODE': [dm('CT', 'CT', 'Chính thức', 'Loại phân công'), dm('CN', 'CN', 'Kiêm nhiệm', 'Loại phân công')]
    });
})();
