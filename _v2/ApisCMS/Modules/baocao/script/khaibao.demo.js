/* Dữ liệu mẫu cho baocao/khaibao — chỉ dùng ở chế độ dựng thử.
   Cấu trúc mẫu: hai cột chính (Ngành, Chuyên ngành) làm cột tên dòng; cột phụ
   "Quy mô người học" (Chính quy, Vừa làm vừa học) + "Tổng số". */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    function dm(id, ma, ten, tenDM) { return { ID: id, MA: ma, TEN: ten, CHUNG_TENDANHMUC_TEN: tenDM }; }
    var HTBC = [
        { ID: 'BC1', MA: 'THBC01', TEN: 'Thống kê quy mô người học', HIEULUC: 1, PHANLOAI_ID: 'PL1', PHANLOAI_TEN: 'Đào tạo' },
        { ID: 'BC2', MA: 'THBC02', TEN: 'Thống kê đội ngũ giảng viên', HIEULUC: 1, PHANLOAI_ID: 'PL2', PHANLOAI_TEN: 'Nhân sự' },
        { ID: 'BC3', MA: 'THBC03', TEN: 'Công khai tài chính', HIEULUC: 0, PHANLOAI_ID: 'PL3', PHANLOAI_TEN: 'Tài chính' }
    ];
    var CHINH = [
        { ID: 'C1', THANHPHAN_ID: 'TPC1', THANHPHAN_TEN: 'Ngành', THBC_BAOCAO_CAUTRUC_C_G_CHA_ID: null, THUTU: 1, MABANGDM_THANHPHAN_DULIEU_G: 'THBC.DM.NGANH' },
        { ID: 'C2', THANHPHAN_ID: 'TPC2', THANHPHAN_TEN: 'Chuyên ngành', THBC_BAOCAO_CAUTRUC_C_G_CHA_ID: null, THUTU: 2, MABANGDM_THANHPHAN_DULIEU_G: null }
    ];
    var PHU = [
        { ID: 'P1', THANHPHAN_ID: 'TPP1', THANHPHAN_TEN: 'Quy mô người học', THBC_BC_CAUTRUC_PHU_G_CHA_ID: null, THUTU: 1 },
        { ID: 'P2', THANHPHAN_ID: 'TPP2', THANHPHAN_TEN: 'Chính quy', THBC_BC_CAUTRUC_PHU_G_CHA_ID: 'P1', THUTU: 1 },
        { ID: 'P3', THANHPHAN_ID: 'TPP3', THANHPHAN_TEN: 'Vừa làm vừa học', THBC_BC_CAUTRUC_PHU_G_CHA_ID: 'P1', THUTU: 2 },
        { ID: 'P4', THANHPHAN_ID: 'TPP4', THANHPHAN_TEN: 'Tổng số', THBC_BC_CAUTRUC_PHU_G_CHA_ID: null, THUTU: 3 }
    ];
    var DL = [
        { ID: 'D1', THANHPHAN_ID: 'N1', THANHPHAN_TEN: 'Công nghệ thông tin', THBC_CAUTRUC_DULIEU_G_CHA_ID: null },
        { ID: 'D11', THANHPHAN_ID: 'CN1', THANHPHAN_TEN: 'Kỹ thuật phần mềm', THBC_CAUTRUC_DULIEU_G_CHA_ID: 'D1' },
        { ID: 'D12', THANHPHAN_ID: 'CN2', THANHPHAN_TEN: 'Hệ thống thông tin', THBC_CAUTRUC_DULIEU_G_CHA_ID: 'D1' },
        { ID: 'D2', THANHPHAN_ID: 'N2', THANHPHAN_TEN: 'Quản trị kinh doanh', THBC_CAUTRUC_DULIEU_G_CHA_ID: null },
        { ID: 'D21', THANHPHAN_ID: 'CN3', THANHPHAN_TEN: 'Quản trị doanh nghiệp', THBC_CAUTRUC_DULIEU_G_CHA_ID: 'D2' },
        { ID: 'D22', THANHPHAN_ID: 'CN4', THANHPHAN_TEN: 'Marketing', THBC_CAUTRUC_DULIEU_G_CHA_ID: 'D2' }
    ];
    var seq = 100;
    function ds(o, arr) { return o.strTHBC_HeThongBaoCao_Id === 'BC1' ? arr : []; }
    function them(arr, o, cha, chaCot) {
        var tp = (dmTp[o.strThanhPhan_Id] || {});
        var x = { ID: 'N' + (++seq), THANHPHAN_ID: o.strThanhPhan_Id, THANHPHAN_TEN: tp.TEN || o.strThanhPhan_Id, THUTU: o.iThuTu };
        x[chaCot] = o[cha] || null;
        if (arr === CHINH) x.MABANGDM_THANHPHAN_DULIEU_G = null;
        arr.push(x);
        return { rows: [], message: '' };
    }
    function sua(arr, o, cha, chaCot) {
        arr.forEach(function (x) { if (x.ID === o.strId) { x.THUTU = o.iThuTu; x[chaCot] = o[cha] || null; var tp = dmTp[o.strThanhPhan_Id]; if (tp) { x.THANHPHAN_ID = tp.ID; x.THANHPHAN_TEN = tp.TEN; } } });
        return { rows: [], message: '' };
    }
    function xoa(arr, o) { for (var i = arr.length - 1; i >= 0; i--) if (arr[i].ID === o.strIds) arr.splice(i, 1); return { rows: [], message: '' }; }
    var dmTp = {};
    var fx = {
        'CMS_HeThongBaoCao/LayDanhSach': function (o) {
            var r = HTBC.filter(function (x) { return !o.strPhanLoai_Id || x.PHANLOAI_ID === o.strPhanLoai_Id; });
            return { rows: r, pager: r.length };
        },
        'CMS_HeThongBaoCao/ThemMoi': { rows: [], message: '' },
        'CMS_HeThongBaoCao/CapNhat': { rows: [], message: '' },
        'CMS_HeThongBaoCao/Xoa': { rows: [], message: '' },
        'CMS_BaoCao_CauTruc_C_G/LayDanhSach': function (o) { return ds(o, CHINH); },
        'CMS_BaoCao_CauTruc_Phu_G/LayDanhSach': function (o) { return ds(o, PHU); },
        'CMS_CauTruc_DuLieu_G/LayDanhSach': function (o) { return ds(o, DL); },
        'CMS_BaoCao_CauTruc_C_G/ThemMoi': function (o) { return them(CHINH, o, 'strTHBC_BC_CT_C_G_Cha_Id', 'THBC_BAOCAO_CAUTRUC_C_G_CHA_ID'); },
        'CMS_BaoCao_CauTruc_C_G/CapNhat': function (o) { return sua(CHINH, o, 'strTHBC_BC_CT_C_G_Cha_Id', 'THBC_BAOCAO_CAUTRUC_C_G_CHA_ID'); },
        'CMS_BaoCao_CauTruc_C_G/Xoa': function (o) { return xoa(CHINH, o); },
        'CMS_BaoCao_CauTruc_Phu_G/ThemMoi': function (o) { return them(PHU, o, 'strTHBC_BC_CT_Phu_G_Cha_Id', 'THBC_BC_CAUTRUC_PHU_G_CHA_ID'); },
        'CMS_BaoCao_CauTruc_Phu_G/CapNhat': function (o) { return sua(PHU, o, 'strTHBC_BC_CT_Phu_G_Cha_Id', 'THBC_BC_CAUTRUC_PHU_G_CHA_ID'); },
        'CMS_BaoCao_CauTruc_Phu_G/Xoa': function (o) { return xoa(PHU, o); },
        'CMS_CauTruc_DuLieu_G/ThemMoi': function (o) { return them(DL, o, 'strTHBC_CT_DuLieu_G_Cha_Id', 'THBC_CAUTRUC_DULIEU_G_CHA_ID'); },
        'CMS_CauTruc_DuLieu_G/Xoa': function (o) { return xoa(DL, o); },
        'CMS_CauTruc_DuLieu_G/LayTHBC_CauTruc_DuLieu_G_Cha': function () {
            return DL.filter(function (x) { return !x.THBC_CAUTRUC_DULIEU_G_CHA_ID; }).map(function (x) { return { ID: x.ID, TEN: x.THANHPHAN_TEN }; });
        }
    };
    var PL = [dm('PL1', 'DAOTAO', 'Đào tạo', 'Phân loại báo cáo'), dm('PL2', 'NHANSU', 'Nhân sự', 'Phân loại báo cáo'), dm('PL3', 'TAICHINH', 'Tài chính', 'Phân loại báo cáo')];
    var TPC = [dm('TPC1', 'NGANH', 'Ngành', 'Thành phần chính'), dm('TPC2', 'CHUYENNGANH', 'Chuyên ngành', 'Thành phần chính'), dm('TPC3', 'KHOA', 'Khoa', 'Thành phần chính')];
    var TPP = [dm('TPP1', 'QUYMO', 'Quy mô người học', 'Thành phần phụ'), dm('TPP2', 'CHINHQUY', 'Chính quy', 'Thành phần phụ'),
        dm('TPP3', 'VLVH', 'Vừa làm vừa học', 'Thành phần phụ'), dm('TPP4', 'TONG', 'Tổng số', 'Thành phần phụ'), dm('TPP5', 'NU', 'Trong đó nữ', 'Thành phần phụ')];
    var NG = [dm('N1', '7480201', 'Công nghệ thông tin', 'Ngành'), dm('N2', '7340101', 'Quản trị kinh doanh', 'Ngành'), dm('N3', '7340301', 'Kế toán', 'Ngành')];
    var CNG = [dm('CN1', 'KTPM', 'Kỹ thuật phần mềm', 'Chuyên ngành'), dm('CN2', 'HTTT', 'Hệ thống thông tin', 'Chuyên ngành'),
        dm('CN3', 'QTDN', 'Quản trị doanh nghiệp', 'Chuyên ngành'), dm('CN4', 'MKT', 'Marketing', 'Chuyên ngành'), dm('CN5', 'KTDN', 'Kế toán doanh nghiệp', 'Chuyên ngành')];
    [TPC, TPP, NG, CNG].forEach(function (a) { a.forEach(function (x) { dmTp[x.ID] = x; }); });
    fx[D + 'THBC.HETHONGBAOCAO.PHANLOAI'] = PL;
    fx[D + 'THBC.THANHPHAN.CHINH'] = TPC;
    fx[D + 'THBC.THANHPHAN.PHU'] = TPP;
    fx[D + 'THBC.DANHMUC.TENBANG'] = [dm('B1', 'THBC.DM.NGANH', 'Danh mục ngành', 'Danh mục thành phần'), dm('B2', 'THBC.DM.CHUYENNGANH', 'Danh mục chuyên ngành', 'Danh mục thành phần')];
    fx[D + 'THBC.DM.NGANH'] = NG;
    fx[D + 'THBC.DM.CHUYENNGANH'] = CNG;
    ums.demo.add(fx);
})();
