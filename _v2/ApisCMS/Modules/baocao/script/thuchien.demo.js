/* Dữ liệu mẫu cho baocao/thuchien — chỉ dùng ở chế độ dựng thử.
   Cây dùng CON_ID (khác ID) như máy chủ thật; ô nhập mang ID dòng / ID cột. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    var KH = [{ ID: 'KH1', MA: 'BC-2026-HK1', TEN: 'Báo cáo thống kê học kỳ 1 năm học 2026-2027' }];
    var DS = [
        { ID: 'TH1', MA: 'THBC01', TEN: 'Thống kê quy mô người học', HIEULUC: 1, PHANLOAI_TEN: 'Đào tạo', THBC_HETHONGBAOCAO_ID: 'BC1', THBC_COSODAOTAO_ID: 'CS1', THBC_KEHOACHBAOCAO_ID: 'KH1' },
        { ID: 'TH2', MA: 'THBC02', TEN: 'Thống kê đội ngũ giảng viên', HIEULUC: 1, PHANLOAI_TEN: 'Nhân sự', THBC_HETHONGBAOCAO_ID: 'BC2', THBC_COSODAOTAO_ID: 'CS1', THBC_KEHOACHBAOCAO_ID: 'KH1' }
    ];
    var CHINH = [
        { ID: 'C1', CON_ID: 'kC1', THANHPHAN_TEN: 'Ngành', THBC_BAOCAO_CAUTRUC_C_CHA_ID: null, LABANGCHINH: 1 },
        { ID: 'C2', CON_ID: 'kC2', THANHPHAN_TEN: 'Chuyên ngành', THBC_BAOCAO_CAUTRUC_C_CHA_ID: null, LABANGCHINH: 1 }
    ];
    var PHU = [
        { ID: 'P1', CON_ID: 'kP1', THANHPHAN_ID: 'TPP1', THANHPHAN_TEN: 'Quy mô người học', THBC_BC_CAUTRUC_PHU_CHA_ID: null },
        { ID: 'P2', CON_ID: 'kP2', THANHPHAN_ID: 'TPP2', THANHPHAN_TEN: 'Chính quy', THBC_BC_CAUTRUC_PHU_CHA_ID: 'kP1' },
        { ID: 'P3', CON_ID: 'kP3', THANHPHAN_ID: 'TPP3', THANHPHAN_TEN: 'Vừa làm vừa học', THBC_BC_CAUTRUC_PHU_CHA_ID: 'kP1' },
        { ID: 'P4', CON_ID: 'kP4', THANHPHAN_ID: 'TPP5', THANHPHAN_TEN: 'Mức đánh giá', THBC_BC_CAUTRUC_PHU_CHA_ID: null, MABANGDM_THANHPHAN_DULIEU: 'THBC.DM.MUCDANHGIA' }
    ];
    function dl(id, con, cha, ten, tp) {
        return { ID: id, CON_ID: con, THBC_CAUTRUC_DULIEU_CHA_ID: cha, THANHPHAN_TEN: ten, THANHPHAN_ID: tp, THBC_COSODAOTAO_ID: 'CS1', THBC_KEHOACHBAOCAO_ID: 'KH1' };
    }
    var DL = [
        dl('D1', 'kD1', null, 'Công nghệ thông tin', 'N1'), dl('D11', 'kD11', 'kD1', 'Kỹ thuật phần mềm', 'CN1'), dl('D12', 'kD12', 'kD1', 'Hệ thống thông tin', 'CN2'),
        dl('D2', 'kD2', null, 'Quản trị kinh doanh', 'N2'), dl('D21', 'kD21', 'kD2', 'Quản trị doanh nghiệp', 'CN3'), dl('D22', 'kD22', 'kD2', 'Marketing', 'CN4')
    ];
    var GT = { 'D11|P2': { ID: 'G1', V: '412' }, 'D11|P3': { ID: 'G2', V: '38' }, 'D11|P4': { ID: 'G3', V: 'M2' },
        'D12|P2': { ID: 'G4', V: '265' }, 'D21|P2': { ID: 'G5', V: '530' }, 'D22|P2': { ID: 'G6', V: '301' }, 'D22|P3': { ID: 'G7', V: '27' } };
    var seq = 100;
    function ds(o, arr) { return o.strTHBC_HeThongBaoCao_Id === 'TH1' ? arr : []; }
    var fx = {
        'CMS_KeHoachBaoCao/LayKeHoachBaoCaoTheoCanNhan': KH,
        'CMS_HeThongBaoCao/LayHeThongBaoCaoTheoCanNhan': function (o) { return DS.filter(function (x) { return !o.strTHBC_KeHoachBaoCao_Id || x.THBC_KEHOACHBAOCAO_ID === o.strTHBC_KeHoachBaoCao_Id; }); },
        'CMS_BaoCao_CauTruc_Phu/LayDanhSach': function (o) { return ds(o, PHU); },
        'CMS_BaoCao_CauTruc_Chinh/LayDanhSach': function (o) { return ds(o, CHINH); },
        'CMS_CauTruc_DuLieu/LayDanhSach': function (o) { return o.strTHBC_HeThongBaoCao_Id === 'BC1' ? DL : []; },
        'CMS_BaoCao_DuLieu/LayDanhSach': function (o) {
            var g = GT[o.strTHBC_CauTrucCay_DuLieu_Id + '|' + o.strTHBC_BaoCao_CauTruc_P_Id];
            return g ? [{ ID: g.ID, THANHPHAN_GIATRI: g.V }] : [];
        },
        'CMS_BaoCao_DuLieu/ThemMoi': function (o) { GT[o.strTHBC_CauTrucCay_DuLieu_Id + '|' + o.strTHBC_BaoCao_CauTruc_P_Id] = { ID: 'G' + (++seq), V: o.strThanhPhan_GiaTri }; return { rows: [], raw: { Id: 'G' + seq } }; },
        'CMS_BaoCao_DuLieu/CapNhat': function (o) { Object.keys(GT).forEach(function (k) { if (GT[k].ID === o.strId) GT[k].V = o.strThanhPhan_GiaTri; }); return { rows: [] }; },
        'CMS_BaoCao_DuLieu/Xoa': function (o) { Object.keys(GT).forEach(function (k) { if (GT[k].ID === o.strIds) delete GT[k]; }); return { rows: [], message: '' }; }
    };
    fx[D + 'THBC.DM.MUCDANHGIA'] = [
        { ID: 'M1', MA: 'TOT', TEN: 'Tốt', CHUNG_TENDANHMUC_TEN: 'Mức đánh giá' },
        { ID: 'M2', MA: 'KHA', TEN: 'Khá', CHUNG_TENDANHMUC_TEN: 'Mức đánh giá' },
        { ID: 'M3', MA: 'TB', TEN: 'Trung bình', CHUNG_TENDANHMUC_TEN: 'Mức đánh giá' }
    ];
    ums.demo.add(fx);
})();
