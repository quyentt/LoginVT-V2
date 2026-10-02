/* Dữ liệu mẫu dùng chung của module cocautochuc — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function dm(id, ma, ten, tenDM) { return { ID: id, MA: ma, TEN: ten, CHUNG_TENDANHMUC_TEN: tenDM || '' }; }
    function cc(id, ma, ten, loaiId, loai, chaId, cha, ghichu) {
        return { ID: id, MA: ma, TEN: ten, DAOTAO_LOAICOCAUTOCHUC_ID: loaiId, DAOTAO_LOAICOCAUTOCHUC: loai,
            DAOTAO_COCAUTOCHUC_CHA_ID: chaId || '', DAOTAO_COCAUTOCHUC_CHA: cha || '', GHICHU: ghichu || '', TRANGTHAI: 1 };
    }
    var TRONG = [
        cc('CC01', 'BGH', 'Ban Giám hiệu', 'LC1', 'Ban', '', '', ''),
        cc('CC02', 'KCNTT', 'Khoa Công nghệ thông tin', 'LC2', 'Khoa', '', '', 'CNTT'),
        cc('CC03', 'BMHTTT', 'Bộ môn Hệ thống thông tin', 'LC3', 'Bộ môn', 'CC02', 'Khoa Công nghệ thông tin', ''),
        cc('CC04', 'BMKTPM', 'Bộ môn Kỹ thuật phần mềm', 'LC3', 'Bộ môn', 'CC02', 'Khoa Công nghệ thông tin', ''),
        cc('CC05', 'KKT', 'Khoa Kinh tế', 'LC2', 'Khoa', '', '', ''),
        cc('CC06', 'BMKT', 'Bộ môn Kế toán', 'LC3', 'Bộ môn', 'CC05', 'Khoa Kinh tế', ''),
        cc('CC07', 'PDT', 'Phòng Đào tạo', 'LC4', 'Phòng', '', '', ''),
        cc('CC08', 'PTCCB', 'Phòng Tổ chức cán bộ', 'LC4', 'Phòng', '', '', '')
    ];
    var NGOAI = [
        cc('CN01', 'BGDDT', 'Bộ Giáo dục và Đào tạo', 'LC4', 'Phòng', '', '', ''),
        cc('CN02', 'VKHCN', 'Viện Khoa học và Công nghệ Việt Nam', 'LC2', 'Khoa', '', '', ''),
        cc('CN03', 'VCNTT', 'Viện Công nghệ thông tin', 'LC3', 'Bộ môn', 'CN02', 'Viện Khoa học và Công nghệ Việt Nam', '')
    ];
    var LOAI = { LC1: 'Ban', LC2: 'Khoa', LC3: 'Bộ môn', LC4: 'Phòng' };
    function tenCha(ds, id) { var x = ds.filter(function (r) { return r.ID === id; })[0]; return x ? x.TEN : ''; }
    function map(ds) {
        return function (o) {
            return { TEN: o.strTen, MA: o.strMa, DAOTAO_LOAICOCAUTOCHUC_ID: o.strDaoTao_Loai_Id, DAOTAO_LOAICOCAUTOCHUC: LOAI[o.strDaoTao_Loai_Id] || '',
                DAOTAO_COCAUTOCHUC_CHA_ID: o.strDaoTao_CoCau_Cha_Id, DAOTAO_COCAUTOCHUC_CHA: tenCha(ds, o.strDaoTao_CoCau_Cha_Id), GHICHU: o.strGhiChu };
        };
    }
    function loc(ds, o) { return ds.filter(function (r) { return !o.strLoaiCoCauToChuc_Id || r.DAOTAO_LOAICOCAUTOCHUC_ID === o.strLoaiCoCauToChuc_Id; }); }
    ums.demo.crudStore('NS_CoCauToChuc', TRONG, { map: map(TRONG), list: loc });
    ums.demo.crudStore('NS_CoCauToChucNgoai', NGOAI, { map: map(NGOAI), list: loc });

    var ORG = [
        { ID: 'OU01', CODE: 'BGH', NAME: 'Ban Giám hiệu' },
        { ID: 'OU02', CODE: 'KCNTT', NAME: 'Khoa Công nghệ thông tin' },
        { ID: 'OU03', CODE: 'KKT', NAME: 'Khoa Kinh tế' },
        { ID: 'OU04', CODE: 'PTCCB', NAME: 'Phòng Tổ chức cán bộ' }
    ];
    var POS = {
        OU02: [{ ID: 'PS01', POSITION_CODE: 'TK', POSITION_NAME: 'Trưởng khoa' }, { ID: 'PS02', POSITION_CODE: 'GV', POSITION_NAME: 'Giảng viên' }],
        OU03: [{ ID: 'PS03', POSITION_CODE: 'PTK', POSITION_NAME: 'Phó trưởng khoa' }, { ID: 'PS04', POSITION_CODE: 'GVKT', POSITION_NAME: 'Giảng viên kế toán' }],
        OU04: [{ ID: 'PS05', POSITION_CODE: 'CV', POSITION_NAME: 'Chuyên viên tổ chức' }]
    };
    ums.demo.add({
        'NS_HoSo_V2/Xoa_DaoTao_CoCauToChuc': function (o) {
            for (var i = TRONG.length - 1; i >= 0; i--) if (TRONG[i].ID === o.strId) TRONG.splice(i, 1);
            return [];
        },
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NS.LCTC': [dm('LC1', 'BAN', 'Ban', 'Loại cơ cấu tổ chức'), dm('LC2', 'KHOA', 'Khoa', 'Loại cơ cấu tổ chức'),
            dm('LC3', 'BM', 'Bộ môn', 'Loại cơ cấu tổ chức'), dm('LC4', 'PHONG', 'Phòng', 'Loại cơ cấu tổ chức')],
        'PKG_CORE_HOSONHANSU_03.LayDSCore_Org_Unit': function (o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            return ORG.filter(function (r) { return !q || r.NAME.toLowerCase().indexOf(q) >= 0; });
        },
        'PKG_CORE_HOSONHANSU_03.LayDSCore_PositionByUnit': function (o) { return POS[o.strOrg_Unit_Id] || []; },
        'PKG_CORE_HOSONHANSU_03.LayDSCore_Org_Relation': function (o) {
            var x = TRONG.filter(function (r) { return r.ID === o.strId; })[0];
            if (!x || !x.DAOTAO_COCAUTOCHUC_CHA_ID) return [];
            var cha = TRONG.filter(function (r) { return r.ID === x.DAOTAO_COCAUTOCHUC_CHA_ID; })[0] || {};
            return [
                { ID: 'QH1', PARENT_ORG_ID: cha.ID, PARENT_ORG_NAME: cha.TEN, PARENT_ORG_CODE: cha.MA, START_DATE: '01/09/2020', END_DATE: '',
                    RELATION_TYPE_CODE_ID: 'TT', RELATION_TYPE_CODE_TEN: 'Trực thuộc', IS_ACTIVE: 1 },
                { ID: 'QH0', PARENT_ORG_ID: 'CC01', PARENT_ORG_NAME: 'Ban Giám hiệu', PARENT_ORG_CODE: 'BGH', START_DATE: '01/09/2015', END_DATE: '31/08/2020',
                    RELATION_TYPE_CODE_ID: 'TT', RELATION_TYPE_CODE_TEN: 'Trực thuộc', IS_ACTIVE: 0 }
            ];
        }
    });
})();
