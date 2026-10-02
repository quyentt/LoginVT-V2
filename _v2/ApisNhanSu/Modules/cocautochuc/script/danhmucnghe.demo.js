/* Dữ liệu mẫu cho danhmucnghe — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    var seq = 100;
    function r(id, code, name, so, them) { var x = { ID: id, CODE: code, NAME: name, SORT_ORDER: so, START_DATE: '01/01/2024', END_DATE: '', DESCRIPTION: '', IS_ACTIVE: 1 }; Object.keys(them || {}).forEach(function (k) { x[k] = them[k]; }); return x; }
    var D = {
        Job_CateGory: [r('LN1', 'GD', 'Giáo dục - đào tạo', 1), r('LN2', 'HC', 'Hành chính - văn phòng', 2)],
        Job_Family: [r('NN1', 'GV', 'Giảng dạy đại học', 1, { CATEGORY_ID: 'LN1', CORE_JOB_CATEGORY_NAME: 'Giáo dục - đào tạo' }),
            r('NN2', 'VP', 'Văn thư - lưu trữ', 1, { CATEGORY_ID: 'LN2', CORE_JOB_CATEGORY_NAME: 'Hành chính - văn phòng' })],
        Job_Group: [r('CD1', 'GVC', 'Giảng viên chính', 1, { FAMILY_ID: 'NN1', CORE_JOB_FAMILY_NAME: 'Giảng dạy đại học' }),
            r('CD2', 'GV', 'Giảng viên', 2, { FAMILY_ID: 'NN1', CORE_JOB_FAMILY_NAME: 'Giảng dạy đại học' }),
            r('CD3', 'VT', 'Văn thư', 1, { FAMILY_ID: 'NN2', CORE_JOB_FAMILY_NAME: 'Văn thư - lưu trữ' })],
        Job_Level: [r('BN1', 'B1', 'Bậc 1', 1), r('BN2', 'B2', 'Bậc 2', 2, { IS_ACTIVE: 0 })],
        Job: [{ ID: 'JB1', JOB_CODE: 'V.07.01.02', JOB_NAME: 'Giảng viên chính (hạng II)', JOB_GROUP_ID: 'CD1', CORE_JOB_GROUP_NAME: 'Giảng viên chính', JOB_LEVEL_ID: 'BN1',
            CORE_JOB_LEVEL_NAME: 'Bậc 1', SORT_ORDER: 1, START_DATE: '01/01/2024', END_DATE: '', DESCRIPTION: '', IS_ACTIVE: 1 }]
    };
    var fx = {};
    Object.keys(D).forEach(function (k) {
        fx['PKG_CORE_HOSONHANSU_03.LayDSCore_' + k] = function (o) {
            return D[k].filter(function (x) {
                if (o.strCateGory_Id && x.CATEGORY_ID !== o.strCateGory_Id) return false;
                if (o.strFamily_Id && x.FAMILY_ID !== o.strFamily_Id) return false;
                if (o.strJob_Group_Id && x.JOB_GROUP_ID !== o.strJob_Group_Id) return false;
                if (o.strJob_Level_Id && x.JOB_LEVEL_ID !== o.strJob_Level_Id) return false;
                return true;
            });
        };
        function gan(x, o) {
            ['strCode:CODE', 'strName:NAME', 'strJob_Code:JOB_CODE', 'strJob_Name:JOB_NAME', 'strCateGory_Id:CATEGORY_ID', 'strFamily_Id:FAMILY_ID',
                'strJob_Group_Id:JOB_GROUP_ID', 'strJob_Level_Id:JOB_LEVEL_ID', 'dSort_Order:SORT_ORDER', 'strStart_Date:START_DATE', 'strEnd_Date:END_DATE',
                'strDescription:DESCRIPTION', 'dIs_Active:IS_ACTIVE'].forEach(function (p) { var a = p.split(':'); if (o[a[0]] !== undefined) x[a[1]] = a[1] === 'IS_ACTIVE' ? Number(o[a[0]]) : o[a[0]]; });
            return x;
        }
        fx['PKG_CORE_HOSONHANSU_03.Them_Core_' + k] = function (o) { D[k].push(gan({ ID: k + (seq++) }, o)); return []; };
        fx['PKG_CORE_HOSONHANSU_03.Sua_Core_' + k] = function (o) { D[k].forEach(function (x) { if (x.ID === o.strId) gan(x, o); }); return []; };
        fx['PKG_CORE_HOSONHANSU_03.Xoa_Core_' + k] = function (o) { D[k] = D[k].filter(function (x) { return x.ID !== o.strId; }); return []; };
    });
    ums.demo.add(fx);
})();
