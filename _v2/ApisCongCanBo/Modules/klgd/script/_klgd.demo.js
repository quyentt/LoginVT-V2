/* Dữ liệu mẫu chung cho module klgd (khối lượng giảng dạy) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var A = 'TKGG_KLGD/', Q = 'TKGG_QLKLGD/';
    var GHI = { rows: [], raw: { Id: 'MOI1' } };
    var fx = {};
    [A, Q].forEach(function (c) {
        fx[c + 'GetcboSchoolYear'] = [{ NIENHOC: '2025-2026' }, { NIENHOC: '2024-2025' }];
        fx[c + 'GetThongTinNamKyDot'] = function (o) {
            if (o.strLoaiThoiGian === 'HOCKY') return [{ HOCKY: o.strThoiGian + '_1' }, { HOCKY: o.strThoiGian + '_2' }];
            if (o.strLoaiThoiGian === 'DOTHOC') return [{ ID: 'DOT1', DOTHOC: 'Đợt 1 — ' + o.strThoiGian }, { ID: 'DOT2', DOTHOC: 'Đợt 2 — ' + o.strThoiGian }];
            return [{ NAMHOC: '2025-2026' }, { NAMHOC: '2024-2025' }];
        };
    });
    fx[A + 'GetDotHoc'] = [{ DOT: '1' }, { DOT: '2' }];
    fx[Q + 'ListDS_HeDaoTao'] = [{ ID: 'HE1', NAME: 'Đại học chính quy' }, { ID: 'HE2', NAME: 'Thạc sĩ' }, { ID: 'HE3', NAME: 'Nghiên cứu sinh' }];
    var PQ = [{ USERID: 'U1', MATAIKHOAN: 'hungnv', TENTAIKHOAN: 'Nguyễn Văn Hùng', THOIGIANBATDAU: '01/09/2025', THOIGIANKETTHUC: '30/09/2025', LAUSERQUANTRI: '1' },
        { USERID: 'U2', MATAIKHOAN: 'maitt', TENTAIKHOAN: 'Trần Thị Mai', THOIGIANBATDAU: '', THOIGIANKETTHUC: '', LAUSERQUANTRI: '0' }];
    fx[A + 'GetDSPQTheoThoiGian'] = PQ; fx[Q + 'GetDSPQTheoThoiGian'] = PQ;
    fx[A + 'UpdatePhanQuyenTheoThoiGian'] = GHI; fx[Q + 'UpdatePhanQuyenTheoThoiGian'] = GHI;

    function store(c, ds, them, sua, xoa, rows) {
        var seq = 1;
        fx[c + ds] = function () { return rows.slice(); };
        fx[c + them] = function (o) { if (!o.strId) rows.push({ ID: 'N' + (seq++), CODE: o.strMaDinhMuc || o.strMaMienGiam || '', NAME: o.strTenDinhMuc || o.strTenMienGiam || '' }); return GHI; };
        if (sua !== them) fx[c + sua] = GHI;
        fx[c + xoa] = function (o) { var ids = String(o[Object.keys(o).filter(function (k) { return /Ids$/.test(k); })[0]] || '').split(','); for (var i = rows.length - 1; i >= 0; i--) if (ids.indexOf(rows[i].ID) >= 0) rows.splice(i, 1); return []; };
    }
    [A, Q].forEach(function (c) {
        store(c, 'GetDanhsachDinhMuc', 'ThemMoiDinhMuc', 'CapNhatDinhMuc', 'XoaDinhMuc', [
            { ID: 'DM1', CODE: 'GV', NAME: 'Giảng viên', DMGIANGDAY: '270', DMNCKH: '150', KHAC: '0' },
            { ID: 'DM2', CODE: 'GVC', NAME: 'Giảng viên chính', DMGIANGDAY: '280', DMNCKH: '200', KHAC: '0' }]);
        store(c, 'GetDanhsachMienGiam', 'ThemMoiMienGiam', 'CapNhatMienGiam', 'XoaMienGiam', [
            { ID: 'MG1', CODE: 'TK', NAME: 'Trưởng khoa', MIENGIAMGD: '30', KIEUMIENGIAMGIANGDAY: 'PHANTRAM', MIENGIAMNCKH: '20', KIEUMIENGIAMNCKH: 'TIET' }]);
    });
    store(Q, 'GetHeSoLopDong', 'CapNhatHeSoLopDong', 'CapNhatHeSoLopDong', 'XoaHeSoLopDong', [
        { ID: 'HS1', TU: '41', DEN: '60', HESO: '1.1' }, { ID: 'HS2', TU: '61', DEN: '80', HESO: '1.2' }]);
    store(Q, 'GetDonGia', 'CapNhatDonGia', 'CapNhatDonGia', 'XoaDonGia', [
        { ID: 'DG1', CODE: 'TS', LOAIGIANGVIEN: 'Tiến sĩ', DONGIA: '120000', TENHINHTHUCGIANGDAY: 'Lý thuyết', HINHTHUCGIANGDAYID: 'HT1', HOCHAM: '', HOCVI: 'Tiến sĩ' }]);
    fx[Q + 'GetHinhThucGiang'] = [{ ID: 'HT1', NAME: 'Lý thuyết' }, { ID: 'HT2', NAME: 'Thực hành' }];
    fx[Q + 'LayDS_PhanQuyenNguoiDungDonVi'] = [{ ID: 'BM1', NAME: 'Bộ môn Hệ thống thông tin' }, { ID: 'BM2', NAME: 'Bộ môn Mạng máy tính' }];
    fx[A + 'GetDanhSachGiangVienNCKHPVSX'] = [
        { ID: 'K1', NHANVIENID: 'NV1', BOMON: 'Bộ môn Hệ thống thông tin', MAGIANGVIEN: 'CB001', HOTEN: 'Nguyễn Văn Hùng', SOTIET: '120', SOTIETDUOCCONGTHEM: '30' },
        { ID: 'K2', NHANVIENID: 'NV2', BOMON: 'Bộ môn Hệ thống thông tin', MAGIANGVIEN: 'CB015', HOTEN: 'Trần Thị Mai', SOTIET: '80', SOTIETDUOCCONGTHEM: '' }];
    fx[A + 'CapNhatKhoiLuongNCKH'] = GHI;
    fx[Q + 'GetThongTinLogKafka'] = { rows: [
        { TRANGTHAI: 'LOI', GIATRI: 'KL-0001', SUKIEN: 'CAPNHAT_KHOILUONG', KETQUAGUI: 'Timeout', NGAYHETHONG: '20/09/2026 08:12' },
        { TRANGTHAI: 'THANHCONG', GIATRI: 'KL-0002', SUKIEN: 'CAPNHAT_KHOILUONG', KETQUAGUI: 'OK', NGAYHETHONG: '20/09/2026 08:13' }], pager: 2 };
    fx[Q + 'GuiLaiKafka'] = GHI;

    /* ---- Nhóm B: đơn vị giảng viên, tổng hợp, thanh toán ---- */
    var BM = [{ ID: 'BM1', NAME: 'Bộ môn Hệ thống thông tin', TBL_BOMONID: 'TB1' }, { ID: 'BM2', NAME: 'Bộ môn Mạng máy tính', TBL_BOMONID: 'TB2' }];
    fx[A + 'GetBoMonDuocPhanCong'] = BM;
    fx[Q + 'LayDS_PhanQuyenNguoiDungDonVi'] = BM;
    fx[A + 'Get_HocHamHocVi'] = { rows: { Table: [{ ID: 'HH1', NAME: 'Phó giáo sư' }, { ID: 'HH2', NAME: 'Giáo sư' }], Table1: [{ ID: 'HV1', NAME: 'Thạc sĩ' }, { ID: 'HV2', NAME: 'Tiến sĩ' }] } };
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NS.LOCD'] = [{ ID: 'HH1', MA: 'PGS', TEN: 'Phó giáo sư' }, { ID: 'HH2', MA: 'GS', TEN: 'Giáo sư' }];
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NS.DMHV'] = [{ ID: 'HV1', MA: 'ThS', TEN: 'Thạc sĩ' }, { ID: 'HV2', MA: 'TS', TEN: 'Tiến sĩ' }];
    var GV = [{ ID: 'G1', DOITUONGID: 'D1', MA: 'CB001', SOHIEUCT: 'CB001', HODEM: 'Nguyễn Văn', TEN: 'Hùng', HOCHAMID: '', HOCVIID: 'HV2', CHOTDULIEU: '1', NHANVIENID: 'NV1', STAFFID: 'NV1', HOTEN: 'Nguyễn Văn Hùng', HOTENMASO: 'Nguyễn Văn Hùng - CB001' },
        { ID: 'G2', DOITUONGID: 'D2', MA: 'CB015', SOHIEUCT: 'CB015', HODEM: 'Trần Thị', TEN: 'Mai', HOCHAMID: 'HH1', HOCVIID: 'HV2', CHOTDULIEU: '0', NHANVIENID: 'NV2', STAFFID: 'NV2', HOTEN: 'Trần Thị Mai', HOTENMASO: 'Trần Thị Mai - CB015' }];
    fx[A + 'GetListStaff'] = GV; fx[Q + 'GetDanhSachCanBoNienHoc'] = GV;
    [A, Q].forEach(function (c) {
        fx[c + 'Get_GiangVien_API'] = [{ id: 'API1', maDonVi: 'HTTT', code: 'CB030', ho: 'Lê Minh', ten: 'Tuấn', tenTrangThai: 'Đang làm việc' }];
        fx[c + 'Them_KLGDDoiTuongAPI'] = GHI; fx[c + 'DeleteKLGD_DoiTuong'] = GHI;
        fx[c + 'GetThongTinCanBo'] = [{ HOCHAMHOCVI: 'TS.', HOTEN: 'Nguyễn Văn Hùng', MACANBO: 'CB001', SOHIEUCT: 'CB001', TENBOMON: 'Bộ môn HTTT', TENBM: 'Bộ môn HTTT',
            DINHMUCGIANGDAY: '270', SOTIETHOANTHANHGIANGDAY: '310', SOTIETDUOCCONGTHEM: '20', SOTIETVUOT: '40', DINHMUCNGHIENCUUKHOAHOC: '150',
            SOTIETHOANTHANHNCKH: '120', THUATHIEUNCKH: '-30', TIENVUOTGIO: '4800000', TIENDATHANHTOAN: '2000000', TBL_KLGD_NHOMMONHOCID: 'BM1' }];
        fx[c + 'TinhKhoiLuongTruDanTheoChuan_Kieu2'] = GHI;
    });
    fx[Q + 'CapNhatHocHamHocVi'] = GHI; fx[Q + 'ChotMoChotDuLieu'] = GHI;
    fx[A + 'GetTRAININGSYSTEMList'] = [{ ID: 'HE1', NAME: 'Đại học chính quy' }, { ID: 'HE2', NAME: 'Thạc sĩ' }];
    var KL = { LOAI: 'Lý thuyết', TENMON: 'Cơ sở dữ liệu', TENHOCPHAN: 'Cơ sở dữ liệu', MAHOCPHAN: 'IT3090', HOCTRINH: '3', DVHT: '3', TENLOP: 'IT3090-01',
        TACHTHEOSINHVIEN_TIET: 'SV', LOAILOPHOCPHAN: 'Lớp thường', TENHINHTHUCHOC: 'Chính quy', TENHINHTHUCGIANGDAY: 'Trực tiếp', SOSV: '62', HEDAOTAO: 'ĐHCQ',
        TENHEDAOTAO: 'ĐHCQ', TENCOSODAOTAO: 'Cơ sở 1', HOCKY_DOT: '2025_1', HOCKYDOTHOCFULL: 'HK1 2025-2026 đợt 1', TIETLYTHUYET_DC: '30', TIETBAITAP_DC: '15',
        TIETTHAOLUAN_DC: '0', TIETTHINGHIEM_DC: '0', TIETTHUCHANH_DC: '0', BTL: '', TKMH: '', SONGAY: '', THIETKETN: '', SOTIETQUYDOI: '54.6' };
    fx[A + 'GetKhoiLuongThoiKhoaBieu'] = [KL]; fx[Q + 'GetDanhSachPhanCong'] = [KL];
    fx[A + 'GetTienThanhThoanVuotGio'] = { rows: [{ ID: 'NV1', HOTEN: 'Nguyễn Văn Hùng', TENBM: 'Bộ môn HTTT', NIENHOC: '2025-2026', TIENVUOTGIODHCQ: '4800000',
        TIENDATHANHTOANDHCQ: '2000000', TIENCONLAIDHCQ: '2800000', TIENVUOTGIODHTC: '0', TIENDATHANHTOANDHTC: '0', TIENCONLAIDHTC: '0', TIENVUOTGIOCAOHOC: '1200000',
        TIENDATHANHTOANCAOHOC: '0', TIENCONLAICAOHOC: '1200000', TIENVUOTGIOTTHTQT: '0', TIENDATHANHTOANTTHTQT: '0', TIENCONLAITTHTQT: '0',
        TONGTIENVUOTGIO: '6000000', TONGTIENDATHANHTOAN: '2000000', TONGTIENCONLAI: '4000000', NOIDUNG: '' }], pager: 1 };
    fx[Q + 'SaveThanhToanGiangDay'] = GHI;
    fx[Q + 'GetThongTinQuaTrinhThanhToan'] = [{ ID: 'TT1', NAMHOC: '2025-2026', NOIDUNG: 'Tạm ứng đợt 1', SOTIEN: '2000000', NGAYTHANHTOAN: '15/03/2026', MAHEDAOTAO: 'DHCQ' }];
    fx[Q + 'CapNhatTienDaThanhToan'] = GHI; fx[Q + 'DeleteTienThanhToan'] = GHI;

    /* ---- Nhóm C: phân công, tuỳ chỉnh ---- */
    fx[A + 'GetAcademicYearByFormOfEdu'] = [{ ID: 'K67', NAME: 'Khóa 67' }, { ID: 'K68', NAME: 'Khóa 68' }];
    fx[Q + 'ListDS_KhoaHoc'] = fx[A + 'GetAcademicYearByFormOfEdu'];
    fx[A + 'GetListCSDT'] = [{ ID: 'CS1', NAME: 'Cơ sở 1' }, { ID: 'CS2', NAME: 'Cơ sở 2' }];
    fx[Q + 'ListDS_CoSoDaoTao'] = [{ ID: 'CS1', MA: 'CS1' }, { ID: 'CS2', MA: 'CS2' }];
    fx[Q + 'ListDS_HinhThucHoc'] = [{ ID: 'HTH1', TENHINHTHUCHOC: 'Lý thuyết' }, { ID: 'HTH2', TENHINHTHUCHOC: 'Thực hành' }];
    fx[Q + 'ListDS_HocPhanPhanGiang'] = [{ ID: 'HP1', TENHOCPHANFULL: 'IT3090 - Cơ sở dữ liệu' }];
    fx[A + 'GetToanBoBoMon'] = BM; fx[Q + 'GetNhomMonHoc'] = BM;
    function lopHP(id, o) {
        return Object.assign({ ID: id, PHANCONGTINCHIID: 'PC' + id, IDTHOIKHOABIEU: 'TKB' + id, KHOILUONGTHOIKHOABIEUID: 'KL' + id, IDLOPHOCPHAN: 'LHP' + id,
            TENLOP: 'IT3090-0' + id, TENKHOA: 'CNTT', MAHOCPHAN: 'IT3090', DVHT: '3', HOCTRINH: '3', HOCKY: '2025-2026_1', HOCKYFULL: '2025-2026_1', DOTHOC: '1',
            SOSINHVIEN: '60', TONGTIETPHANBO: '45', TONGTIETCTDT: '45', LOAILOPHOCPHAN: 'Lý thuyết', TENHINHTHUCHOC: 'Lý thuyết', HOTEN: 'Nguyễn Văn Hùng',
            HOTENMASO: 'Nguyễn Văn Hùng - CB001', MACONGCHUC: 'CB001', STAFFID: 'NV1', NAMHOC: '2025-2026', DAOTAO_THOIGIANDAOTAO_ID: 'DOT1', MAHEDAOTAO: 'DHCQ',
            TENHEDAOTAO: 'ĐHCQ', BOMON: 'Bộ môn HTTT', TENBOMONPHANGIANG: 'Bộ môn Mạng máy tính', HOCKYDOTHOCFULL: 'HK1 2025-2026 đợt 1', DATACH: 0, LALOPTACH: 0 }, o || {});
    }
    fx[A + 'GetDanhSachPhanCong'] = [lopHP('1'), lopHP('2', { DATACH: 1 })];
    fx[Q + 'GetDanhSachPhanCong'] = [Object.assign(lopHP('1'), KL, { TENLOP: 'IT3090-01', HESOTINCHI: '1', HINHTHUCGIANGDAYID: 'HT1', TRONGTRUONG: '1',
        SOSV: '60', SOTIETHUONGDANMOTSV: '', IDHINHTHUCHOC: 'HTH1', DAOTAO_HEDAOTAO_ID: 'HE1' })];
    fx[A + 'GetDanhSachLopHocPhan'] = [lopHP('3', { HOTEN: '' }), lopHP('4', { HOTEN: '', DATACH: 2 })];
    fx[Q + 'GetDanhSachChuaPhanCong'] = [lopHP('3', { HOTEN: '' })];
    fx[A + 'GetDanhSachPhanCongBMKhac'] = [lopHP('5')]; fx[Q + 'GetDanhSachPhanCongBMKhac'] = [lopHP('5')];
    fx[A + 'GetDanhSachCacMonHocDaPCCuaBM'] = [lopHP('1'), lopHP('5')]; fx[Q + 'GetDanhSachCacMonHocDaPCCuaBM'] = [lopHP('1'), lopHP('5')];
    [A, Q].forEach(function (c) {
        fx[c + 'PhanCongGiangDay'] = GHI; fx[c + 'DeletePhanCongGiangDay'] = GHI; fx[c + 'UpdateKhoiLuongTKBNienChe'] = GHI; fx[c + 'XoaKhoiLuong'] = GHI;
        fx[c + 'GetHinhThucGiang'] = [{ ID: 'HT1', NAME: 'Trực tiếp' }, { ID: 'HT2', NAME: 'Trực tuyến' }];
    });
    fx[Q + 'CapNhatPhanBoTiet'] = GHI;

    /* ---- Nhóm D: định mức miễn giảm, nhập khối lượng ---- */
    var GVDM = [{ ID: 'X1', STAFFID: 'NV1', MA: 'CB001', HOTEN: 'Nguyễn Văn Hùng', HOCHAMHOCVI: 'TS.', TENBM: 'Bộ môn HTTT', DMGD_THUCTE: '270', DMNCKH_THUCTE: '150',
        DINHMUCGIANGDAY: '270', DINHMUCNGHIENCUUKHOAHOC: '150', DINHMUCGIANGDAY_NHAP: '1', DINHMUC: 'Giảng viên (270/150)', MIENGIAM: 'Trưởng bộ môn 20%',
        DONGIA_THUCTE: '120000', DONGIA: 'Tiến sĩ' }];
    [A, Q].forEach(function (c) {
        fx[c + 'GetThongTinDinhMucMienGiam'] = GVDM;
        fx[c + 'GetListDinhMuc'] = [{ ID: 'DM1', NAME: 'Giảng viên' }, { ID: 'DM2', NAME: 'Giảng viên chính' }];
        fx[c + 'GetListMienGiam'] = [{ ID: 'MG1', NAME: 'Trưởng khoa' }, { ID: 'MG2', NAME: 'Trưởng bộ môn' }];
        fx[c + 'GetDinhMucGV'] = [{ ID: 'R1', MADM: 'GV', TENDM: 'Giảng viên', DINHMUCID: 'DM1', DMGD: '270', DMNCKH: '150', NGAYTHANGBATDAU: '01/09/2025', NGAYTHANGKETTHUC: '31/08/2026' }];
        fx[c + 'GetMienGiamGV'] = [{ ID: 'R2', MAMG: 'TBM', TENMG: 'Trưởng bộ môn', MIENGIAMID: 'MG2', MGGD: '20%', MGNCKH: '10%', NGAYTHANGBATDAU: '01/09/2025', NGAYTHANGKETTHUC: '' }];
        fx[c + 'GetQuaTrinhDonGia'] = [{ ID: 'R3', LOAIGIANGVIEN: 'Tiến sĩ', TBL_KLGD_DONGIAGIANGDAYID: 'DG1', DONGIA: '120000', NGAYTHANGBATDAU: '01/09/2025', NGAYTHANGKETTHUC: '' }];
        ['UpdateDinhMuc', 'UpdateMienGiam', 'UpdateDonGiaGiangVien', 'DeleteDinhMucNhanvien', 'DeleteMienGiamNhanvien', 'DeleteDonGiaGiangVien', 'TongHopDinhMuc']
            .forEach(function (k) { fx[c + k] = GHI; });
    });
    fx[A + 'GetDonGia'] = [{ ID: 'DG1', DONGIAGIANGVIEN: 'Tiến sĩ — 120.000' }, { ID: 'DG2', DONGIAGIANGVIEN: 'Thạc sĩ — 100.000' }];
    var DGQ = fx[Q + 'GetDonGia'];
    fx[Q + 'GetDonGia'] = function (o) { return o.strNamHoc && !o.pageIndex ? [{ ID: 'DG1', DONGIAGIANGVIEN: 'Tiến sĩ — 120.000', CODE: 'TS', LOAIGIANGVIEN: 'Tiến sĩ', DONGIA: '120000' }] : DGQ(o); };
    fx[Q + 'Update_NhapDinhMuc'] = GHI;
    ['Import_DinhMuc', 'Import_MienGiam', 'Import_DonGiaGiangVien', 'Import_KhoiLuongNhap'].forEach(function (k) { fx[Q + k] = { rows: [], message: '' }; });
    fx[Q + 'GetKhoiLuongNhap'] = fx[Q + 'GetDanhSachPhanCong'];
    fx[Q + 'UpdateKhoiLuong_Nhap'] = GHI; fx[Q + 'XoaKhoiLuong_Nhap'] = GHI;

    /* ---- Nhóm E: tách lớp, duyệt dữ liệu tách ---- */
    fx[A + 'GetMonHocPhanCong'] = [{ COURSEID: 'C1', TENMON: 'Đồ án cơ sở dữ liệu' }];
    fx[Q + 'GetMonHocPhanCong'] = [{ IDHOCPHAN: 'H1', TENHOCPHAN: 'Đồ án cơ sở dữ liệu' }];
    var LOPG = { PHANCONGID: 'PG1', IDLOPMONHOC: 'LM1', IDTHOIKHOABIEU: 'TKB1', TENLOP: 'IT3091-01', TENKHOA: 'CNTT', MAHOCPHAN: 'IT3091', DVHT: '2', HOCTRINH: '2',
        SOSINHVIEN: '40', TONGTIETLOPMONTINCHI: '60', TONGTIETCTDT: '60', LOAILOPHOCPHAN: 'Đồ án', TENHINHTHUCHOC: 'Đồ án', KIEUHOC: 5, MAHINHTHUCHOC: 'DA',
        TACHTHEOSINHVIEN_TIET: 'SV', LALOPTACH: 2, DUYETTACH: 1, LT: 0, BT: 0, TL: 0, TN: 0, TH: 60, BTL: 0, TKMH: 0,
        TIETLYTHUYET_DC: 0, TIETBAITAP_DC: 0, TIETTHAOLUAN_DC: 0, TIETTHINGHIEM_DC: 0, TIETTHUCHANH_DC: 60 };
    [A, Q].forEach(function (c) {
        fx[c + 'GetDanhSachLopHPPhucVuTach'] = [LOPG, Object.assign({}, LOPG, { PHANCONGID: 'PG2', IDLOPMONHOC: 'LM2', TENLOP: 'IT3090-02', KIEUHOC: 1, MAHINHTHUCHOC: 'LT',
            LOAILOPHOCPHAN: 'Lý thuyết', TENHINHTHUCHOC: 'Lý thuyết', TACHTHEOSINHVIEN_TIET: '', LALOPTACH: 0, DUYETTACH: 0 })];
        fx[c + 'GetDanhSachLopHPDuyetTach'] = fx[c + 'GetDanhSachLopHPPhucVuTach'];
        fx[c + 'GetDanhSachLopThucTap'] = function (o) {
            if (o.strPhanCongId !== 'PG1' && o.strLopHocPhanId !== 'LM1') return [];
            return [1, 2].map(function (n) {
                return { ID: 'T' + n, KHOILUONGTHOIKHOABIEUID: 'KT' + n, LOPHOCPHANID: 'LM1', TENLOP: 'IT3091-01.' + n, DVHT: '2', HOCTRINH: '2', SOSV: '20', SOSINHVIEN: '20',
                    TACHTHEOSINHVIEN_TIET: 'SV', TIETLYTHUYET_DC: 0, TIETBAITAP_DC: 0, TIETTHAOLUAN_DC: 0, TIETTHINGHIEM_DC: 0, TIETTHUCHANH_DC: 30, BTL: 0, TKMH: 0,
                    HOTEN: n === 1 ? 'Nguyễn Văn Hùng' : '', HOTENMASO: n === 1 ? 'Nguyễn Văn Hùng - CB001' : '', STAFFID: 'NV1', TONGTIETDECUONG: '30', SONGAY: '' };
            });
        };
        ['ThucHienTachTaoLop', 'CapNhatPhanCongThucTapNC', 'CapNhatPhanCongBMKhac', 'ThucHienDuyet'].forEach(function (k) { fx[c + k] = GHI; });
    });
    fx[A + 'GetKhoiLuongTKBTuyChinh'] = [Object.assign({}, KL, { ID: 'T1', BOMON: 'Bộ môn HTTT', HOTEN: 'Nguyễn Văn Hùng', HOCKY: '2025-2026_1', HESOTINCHI: '1',
        HINHTHUCGIANGDAYID: 'HT1', TRONGTRUONG: null, SOTIETHUONGDANMOTSV: '', STAFFID: 'NV1', NAMHOC: '2025-2026', SOTIET: '45', LICHHOC: 'T2(1-3)', IDHEDAOTAO: 'HE1', LOAITIET: '0', SOTIEN: '' })];
    ums.demo.add(fx);
})();
