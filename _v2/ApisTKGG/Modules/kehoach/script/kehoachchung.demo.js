/* Dữ liệu mẫu cho kehoachchung — chỉ dùng ở chế độ dựng thử (phần chung: _kehoach.demo.js). */
(function () {
    var D = ums.tkggKHDemo;
    var HT = [{ ID: 'HT1', TENHINHTHUCHOC: 'Lý thuyết', MAHINHTHUCHOC: 'LT' }, { ID: 'HT2', TENHINHTHUCHOC: 'Thực hành', MAHINHTHUCHOC: 'TH' }, { ID: 'HT3', TENHINHTHUCHOC: 'Thảo luận', MAHINHTHUCHOC: 'TL' }];
    var HD = { PV1: [{ ID: 'HD1', MA: 'TINH_LT', TEN: 'Tính theo lý thuyết' }, { ID: 'HD2', MA: 'TINH_TH', TEN: 'Tính theo thực hành' }], PV2: [{ ID: 'HD3', MA: 'TINH_CT', TEN: 'Tính coi thi' }], PV3: [{ ID: 'HD4', MA: 'TINH_HD', TEN: 'Tính hướng dẫn' }] };
    function hdMa(id) { var m = ''; Object.keys(HD).forEach(function (k) { HD[k].forEach(function (x) { if (x.ID === id) m = x.MA; }); }); return m; }
    function pvTen(id) { return (D.PVXN.filter(function (x) { return x.ID === id; })[0] || {}).TEN || ''; }
    function htMa(id) { return (HT.filter(function (x) { return x.ID === id; })[0] || {}).MAHINHTHUCHOC || ''; }
    var PLT = { KH1: [{ ID: 'P1', TKB_HINHTHUCHOC_MA: 'LT', HANHDONG_MA: 'TINH_LT', LOAIXACNHAN_TEN: 'Lớp học phần', PHAMVIAPDUNG_TEN: 'Tổng hợp giờ giảng năm học 2025-2026' },
                     { ID: 'P2', TKB_HINHTHUCHOC_MA: 'TH', HANHDONG_MA: 'TINH_TH', LOAIXACNHAN_TEN: 'Lớp học phần', PHAMVIAPDUNG_TEN: 'Tổng hợp giờ giảng năm học 2025-2026' }], KH2: [] };
    var CT = { KH1: [{ ID: 'C1', XAUCONGTHUC: 'SOTIET * HESOQUYMO * HESOLOAI', PHAMVIAPDUNG_ID: 'L1', PHAMVIAPDUNG_TEN: 'Lý thuyết', THOIGIAN_ID: 'TG2', THOIGIAN: 'Học kỳ 1 2025-2026' }], KH2: [] };
    var DT = { KH1: [{ ID: 'D1', TUNGAY: '01/09/2025', DENNGAY: '31/12/2025', TEN: 'Đợt 1 - quý 4/2025', MOTA: '', HIEULUC: 1 }, { ID: 'D2', TUNGAY: '01/01/2026', DENNGAY: '31/01/2026', TEN: 'Đợt 2 - tháng 1/2026', MOTA: 'Tách theo ngày', HIEULUC: 1 }], KH2: [] };
    var KQ = { D1: [
        { ID: 'Q1', NGUOIDUNG_MASO: 'GV001', NGUOIDUNG_HODEM: 'Nguyễn Văn', NGUOIDUNG_TEN: 'An', DULIEUXACNHAN_TEN: 'Lập trình C - 64CNTT1', SOSV: 45, NGAY: '08/09/2025', SOTIETTHEOTKB: 3, SOTIETCODIEMDANH: 3, GIOCHUAN: 3.6, DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 2025-2026', MOTA: '' },
        { ID: 'Q2', NGUOIDUNG_MASO: 'GV003', NGUOIDUNG_HODEM: 'Lê Minh', NGUOIDUNG_TEN: 'Châu', DULIEUXACNHAN_TEN: 'Cơ sở dữ liệu - 64CNTT2', SOSV: 52, NGAY: '09/09/2025', SOTIETTHEOTKB: 2, SOTIETCODIEMDANH: 2, GIOCHUAN: 2.6, DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 2025-2026', MOTA: '' }], D2: [] };
    var BC = [
        { ID: 'B1', DONVI: 'Khoa CNTT', MASO: 'GV001', HODEM: 'Nguyễn Văn', TEN: 'An', GIOCHUAN: 3.6, TONGGIOCHUAN: 120.5, SOLUONG: 3, SOGVCUNGDAY: 1, QUYMO: 45, TENLOP: 'Lập trình C - 64CNTT1', MALOP: 'LTC.64CNTT1', NGAY: '08/09/2025', TIETBATDAU: 1, TIETKETTHUC: 3 },
        { ID: 'B2', DONVI: 'Khoa CNTT', MASO: 'GV003', HODEM: 'Lê Minh', TEN: 'Châu', GIOCHUAN: 2.6, TONGGIOCHUAN: 98, SOLUONG: 2, SOGVCUNGDAY: 1, QUYMO: 52, TENLOP: 'Cơ sở dữ liệu - 64CNTT2', MALOP: 'CSDL.64CNTT2', NGAY: '09/09/2025', TIETBATDAU: 4, TIETKETTHUC: 5 }];
    function cua(m, k) { return m[k] || (m[k] = []); }
    function xoaKhoi(m, id) { Object.keys(m).forEach(function (k) { for (var i = m[k].length - 1; i >= 0; i--) if (m[k][i].ID === id) m[k].splice(i, 1); }); }
    ums.demo.add({
        'KHCT_ThoiGianDaoTao/LayDanhSach': D.TGDT,
        'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao': D.TGDT,
        'pkg_klgv_v2_baocao.LayDSKetQuaChiTietTheoKH': function (o) { return o.strKLGD_TongHopKhoiLuong_Id === 'KH2' ? [] : D.like(BC, o.strTuKhoa, ['TEN', 'MASO', 'TENLOP']); },
        'pkg_klgv_v2_baocao.LayDSTHTheoGiangVienTheoKH': function (o) { return o.strKLGD_TongHopKhoiLuong_Id === 'KH2' ? [] : D.like(BC, o.strTuKhoa, ['TEN', 'MASO']); },
        'pkg_klgv_v2_baocao.LayDSTHTheoLopVaGVTheoKH': function (o) { return o.strKLGD_TongHopKhoiLuong_Id === 'KH2' ? [] : D.like(BC, o.strTuKhoa, ['TEN', 'MASO', 'TENLOP']); },
        'PKG_KLGV_V2_CHUNG.LayDSHinhThucHoc': HT,
        'PKG_KLGV_V2_XACNHAN.LayHanhDongXacNhanNguoiDung': function (o) { return HD[o.strLoaiXacNhan_Id] || []; },
        'PKG_KLGV_V2_THONGTIN.LayDSKLGD_HinhThuc_PhanLoai': function (o) { return cua(PLT, o.strPhamViApDung_Id).slice(); },
        'PKG_KLGV_V2_THONGTIN.Them_KLGD_HinhThuc_PhanLoai': function (o) {
            var kh = D.KH.filter(function (x) { return x.ID === o.strPhamViApDung_Id; })[0] || {};
            cua(PLT, o.strPhamViApDung_Id).push({ ID: D.moi('P'), TKB_HINHTHUCHOC_MA: htMa(o.strTKB_HinhThucHoc_Id), HANHDONG_MA: hdMa(o.strHanhDong_Id), LOAIXACNHAN_TEN: pvTen(o.strLoaiXacNhan_Id), PHAMVIAPDUNG_TEN: kh.TEN || '' });
            return [];
        },
        'PKG_KLGV_V2_THONGTIN.Xoa_KLGD_HinhThuc_PhanLoai': function (o) { xoaKhoi(PLT, o.strId); return []; },
        'PKG_KLGV_V2_THONGTIN.KeThua_KLGD_HinhThuc_PhanLoai': function (o) {
            var kh = D.KH.filter(function (x) { return x.ID === o.strPhamViApDung_Dich_Id; })[0] || {};
            cua(PLT, o.strPhamViApDung_Nguon_Id).forEach(function (p) { cua(PLT, o.strPhamViApDung_Dich_Id).push({ ID: D.moi('P'), TKB_HINHTHUCHOC_MA: p.TKB_HINHTHUCHOC_MA, HANHDONG_MA: p.HANHDONG_MA, LOAIXACNHAN_TEN: p.LOAIXACNHAN_TEN, PHAMVIAPDUNG_TEN: kh.TEN || '' }); });
            return [];
        },
        'PKG_KLGV_V2_THONGTIN.LayDSKLGD_CongThuc_ApDung': function (o) { return cua(CT, o.strKLGD_TongHopKhoiLuong_Id).slice(); },
        'PKG_KLGV_V2_THONGTIN.Them_KLGD_CongThuc_ApDung': function (o) {
            var id = D.moi('C');
            cua(CT, o.strKLGD_TongHopKhoiLuong_Id).push({ ID: id, XAUCONGTHUC: o.strXauCongThuc, PHAMVIAPDUNG_ID: o.strPhamViDung_Id, PHAMVIAPDUNG_TEN: D.loaiTen(o.strPhamViDung_Id), THOIGIAN_ID: o.strDaoTao_ThoiGianDaoTao_Id, THOIGIAN: (D.TGDT.filter(function (t) { return t.ID === o.strDaoTao_ThoiGianDaoTao_Id; })[0] || {}).DAOTAO_THOIGIANDAOTAO || '' });
            return { rows: [], raw: { Id: id } };
        },
        'PKG_KLGV_V2_THONGTIN.Sua_KLGD_CongThuc_ApDung': function (o) {
            Object.keys(CT).forEach(function (k) { CT[k].forEach(function (r) { if (r.ID === o.strId) { r.XAUCONGTHUC = o.strXauCongThuc; r.PHAMVIAPDUNG_ID = o.strPhamViDung_Id; r.PHAMVIAPDUNG_TEN = D.loaiTen(o.strPhamViDung_Id); r.THOIGIAN_ID = o.strDaoTao_ThoiGianDaoTao_Id; r.THOIGIAN = (D.TGDT.filter(function (t) { return t.ID === o.strDaoTao_ThoiGianDaoTao_Id; })[0] || {}).DAOTAO_THOIGIANDAOTAO || ''; } }); });
            return [];
        },
        'PKG_KLGV_V2_THONGTIN.Xoa_KLGD_CongThuc_ApDung': function (o) { xoaKhoi(CT, o.strId); return []; },
        'PKG_KLGV_V2_KEHOACH.LayDSKLGD_TongHopKL_Dot': function (o) { return cua(DT, o.strKLGD_TongHopKhoiLuong_Id).slice(); },
        'PKG_KLGV_V2_KEHOACH.Them_KLGD_TongHopKhoiLuong_Dot': function (o) {
            var id = D.moi('D');
            cua(DT, o.strKLGD_TongHopKhoiLuong_Id).push({ ID: id, TUNGAY: o.strTuNgay, DENNGAY: o.strDenNgay, TEN: o.strTen, MOTA: o.strMoTa, HIEULUC: Number(o.dHieuLuc) });
            return { rows: [], raw: { Id: id } };
        },
        'PKG_KLGV_V2_KEHOACH.Sua_KLGD_TongHopKhoiLuong_Dot': function (o) {
            Object.keys(DT).forEach(function (k) { DT[k].forEach(function (r) { if (r.ID === o.strId) { r.TUNGAY = o.strTuNgay; r.DENNGAY = o.strDenNgay; r.TEN = o.strTen; r.MOTA = o.strMoTa; r.HIEULUC = Number(o.dHieuLuc); } }); });
            return [];
        },
        'PKG_KLGV_V2_KEHOACH.Xoa_KLGD_TongHopKhoiLuong_Dot': function (o) { xoaKhoi(DT, o.strId); return []; },
        'PKG_KLGV_V2_KEHOACH.TaoDuLieu_KLGD_TongHopKL_Dot': function () { return []; },
        'PKG_KLGV_V2_KEHOACH.LayDSKLGD_DuLieu_LG_TG': function (o) { return (KQ[o.strKLGD_TongHoKL_Dot_Id] || []).slice(); }
    });
})();
