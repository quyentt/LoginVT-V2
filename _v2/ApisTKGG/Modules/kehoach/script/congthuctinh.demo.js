/* Dữ liệu mẫu cho congthuctinh — chỉ dùng ở chế độ dựng thử. */
(function () {
    var TGK = [{ ID: 'TG1', THOIGIAN: 'Năm học 2025-2026' }, { ID: 'TG2', THOIGIAN: 'Năm học 2024-2025' }];
    var CT = [
        { ID: 'CTT1', XAUCONGTHUC: 'SOTIET * HESOQUYMO * HESOLOP', PHAMVIAPDUNG_ID: 'L1', PHAMVIAPDUNG_TEN: 'Lý thuyết', THOIGIAN_ID: 'TG1', THOIGIAN: 'Năm học 2025-2026' },
        { ID: 'CTT2', XAUCONGTHUC: 'SOTIET * 0.5', PHAMVIAPDUNG_ID: 'L2', PHAMVIAPDUNG_TEN: 'Thực hành', THOIGIAN_ID: 'TG1', THOIGIAN: 'Năm học 2025-2026' }
    ];
    var TK = [
        { ID: 'TK1', TUKHOA: 'SOTIET', TENTUKHOA: 'Số tiết', MOTA: 'Số tiết theo TKB', TENPKG: 'PKG_KLGV_V2_TINHTOAN', TENFUNCTION: 'LaySoTiet', TENDATABASELINK: '' },
        { ID: 'TK2', TUKHOA: 'HESOQUYMO', TENTUKHOA: 'Hệ số quy mô', MOTA: '', TENPKG: 'PKG_KLGV_V2_TINHTOAN', TENFUNCTION: 'LayHeSoQuyMo', TENDATABASELINK: 'DBL_QTDH' }
    ];
    var TS = { TK1: [{ ID: 'TS1', TENTHAMSO: 'p_LopHocPhan_Id', GIATRIMACDINH: '', PHANLOAI: 'IN', MOTA: 'Id lớp học phần', THUTU: 1 }] };
    var seq = 10;
    ums.demo.add({
        'pkg_klgv_v2_thongtin.LayDSThoiGianKhaiCongThuc': TGK,
        'pkg_klgv_v2_thongtin.LayDSKLGD_CongThuc_ApDung': function (o) { var q = (o.strTuKhoa || '').toLowerCase(); return CT.filter(function (r) { return (!o.strDaoTao_ThoiGianDaoTao_Id || r.THOIGIAN_ID === o.strDaoTao_ThoiGianDaoTao_Id) && (!q || r.XAUCONGTHUC.toLowerCase().indexOf(q) >= 0); }); },
        'pkg_klgv_v2_thongtin.Them_KLGD_CongThuc_ApDung': function (o) { var id = 'CTT' + (seq++); CT.push({ ID: id, XAUCONGTHUC: o.strXauCongThuc, PHAMVIAPDUNG_ID: o.strPhamViDung_Id, PHAMVIAPDUNG_TEN: o.strPhamViDung_Id, THOIGIAN_ID: o.strDaoTao_ThoiGianDaoTao_Id, THOIGIAN: '' }); return { rows: [], raw: { Id: id } }; },
        'PKG_KLGV_V2_THONGTIN.Them_KLGD_CongThuc_ApDung': function (o) { var id = 'CTT' + (seq++); CT.push({ ID: id, XAUCONGTHUC: o.strXauCongThuc, PHAMVIAPDUNG_ID: o.strPhamViDung_Id, PHAMVIAPDUNG_TEN: 'Lớp ' + o.strPhamViDung_Id, THOIGIAN_ID: o.strDaoTao_ThoiGianDaoTao_Id, THOIGIAN: '' }); return { rows: [], raw: { Id: id } }; },
        'pkg_klgv_v2_thongtin.Sua_KLGD_CongThuc_ApDung': function (o) { CT.forEach(function (r) { if (r.ID === o.strId) { r.XAUCONGTHUC = o.strXauCongThuc; r.PHAMVIAPDUNG_ID = o.strPhamViDung_Id; } }); return []; },
        'pkg_klgv_v2_thongtin.Xoa_KLGD_CongThuc_ApDung': function (o) { for (var i = CT.length - 1; i >= 0; i--) if (CT[i].ID === o.strId) CT.splice(i, 1); return []; },
        'pkg_klgv_v2_thongtin.LayDSKLGD_TuKhoa': function () { return TK.slice(); },
        'pkg_klgv_v2_thongtin.Them_KLGD_TuKhoa': function (o) { var id = 'TK' + (seq++); TK.push({ ID: id, TUKHOA: o.strTuKhoa, TENTUKHOA: o.strTenTuKhoa, MOTA: o.strMoTa, TENPKG: o.strTenPKG, TENFUNCTION: o.strTenFunction, TENDATABASELINK: o.strTenDataBaseLink }); return { rows: [], raw: { Id: id } }; },
        'pkg_klgv_v2_thongtin.Sua_KLGD_TuKhoa': function (o) { TK.forEach(function (r) { if (r.ID === o.strId) { r.TUKHOA = o.strTuKhoa; r.TENTUKHOA = o.strTenTuKhoa; r.MOTA = o.strMoTa; } }); return []; },
        'pkg_klgv_v2_thongtin.Xoa_KLGD_TuKhoa': function (o) { for (var i = TK.length - 1; i >= 0; i--) if (TK[i].ID === o.strId) TK.splice(i, 1); return []; },
        'pkg_klgv_v2_thongtin.LayDSKLGD_TuKhoa_ThamSo': function (o) { return (TS[o.strKLGD_TuKhoa_Id] || []).slice(); },
        'pkg_klgv_v2_thongtin.Them_KLGD_TuKhoa_ThamSo': function (o) { var id = 'TS' + (seq++); (TS[o.strKLGD_TuKhoa_Id] = TS[o.strKLGD_TuKhoa_Id] || []).push({ ID: id, TENTHAMSO: o.strTenThamSo, GIATRIMACDINH: o.strGiaTriMacDinh, PHANLOAI: o.strPhanLoai, MOTA: o.strMoTa, THUTU: o.dThuTu }); return { rows: [], raw: { Id: id } }; },
        'pkg_klgv_v2_thongtin.Sua_KLGD_TuKhoa_ThamSo': function () { return []; },
        'pkg_klgv_v2_thongtin.Xoa_KLGD_TuKhoa_ThamSo': function (o) { Object.keys(TS).forEach(function (k) { TS[k] = TS[k].filter(function (r) { return r.ID !== o.strId; }); }); return []; },
        'DKH_Chung/LayThoiGianDangKyHoc': [{ ID: 'TG1', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 2025-2026' }, { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 2025-2026' }],
        'DKH_PhanCong_LopHP/LayDSKhoaToChuc': [{ ID: 'K67', TENKHOA: 'Khóa 67' }, { ID: 'K68', TENKHOA: 'Khóa 68' }],
        'DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc': [{ ID: 'CTD1', TENCHUONGTRINH: 'Công nghệ thông tin' }],
        'DKH_PhanCong_LopHP/LayDSHocPhan': [{ ID: 'HP1', TENHOCPHAN: 'Lập trình Web' }, { ID: 'HP2', TENHOCPHAN: 'Cơ sở dữ liệu' }],
        'DKH_ThongTin/LayDSLopHocPhan': function (o) { var r = [{ ID: 'LHP1', MALOP: 'LTW-01', TENLOP: 'Lập trình Web - 01' }, { ID: 'LHP2', MALOP: 'LTW-02', TENLOP: 'Lập trình Web - 02' }, { ID: 'LHP3', MALOP: 'CSDL-01', TENLOP: 'Cơ sở dữ liệu - 01' }]; return { rows: r, pager: r.length }; }
    });
})();
