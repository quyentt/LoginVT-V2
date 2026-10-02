/* Dữ liệu mẫu cho kehoachtuyensinh (Kế hoạch tuyển sinh — bản cũ) — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    var seq = 100;
    function moi() { return 'KTSC' + (++seq); }
    function dm(id, ma, ten, tenDM) { return { ID: id, MA: ma, TEN: ten, CHUNG_TENDANHMUC_TEN: tenDM || '' }; }

    var CHEDO = [dm('CD1', 'TRUCTUYEN', 'Nhập trực tuyến', 'Chế độ hoạt động'), dm('CD2', 'TAITRUONG', 'Nhập tại trường', 'Chế độ hoạt động')];
    var KH = [
        { ID: 'KTS1', TEN: 'Tuyển sinh đại học chính quy năm 2026', CHEDONHAPDULIEU_ID: 'CD1', CHEDONHAPDULIEU_TEN: 'Nhập trực tuyến',
          NGAYBATDAU: '01/03/2026', NGAYKETTHUC: '30/09/2026', MOTA: 'Xét tuyển theo kết quả thi tốt nghiệp THPT và học bạ' },
        { ID: 'KTS2', TEN: 'Tuyển sinh liên thông đại học năm 2026', CHEDONHAPDULIEU_ID: 'CD2', CHEDONHAPDULIEU_TEN: 'Nhập tại trường',
          NGAYBATDAU: '15/04/2026', NGAYKETTHUC: '31/10/2026', MOTA: '' },
        { ID: 'KTS3', TEN: 'Tuyển sinh văn bằng hai năm 2026', CHEDONHAPDULIEU_ID: 'CD1', CHEDONHAPDULIEU_TEN: 'Nhập trực tuyến',
          NGAYBATDAU: '01/05/2026', NGAYKETTHUC: '30/11/2026', MOTA: 'Dành cho người đã có bằng đại học' },
        { ID: 'KTS4', TEN: 'Tuyển sinh thạc sĩ đợt 1 năm 2026', CHEDONHAPDULIEU_ID: 'CD2', CHEDONHAPDULIEU_TEN: 'Nhập tại trường',
          NGAYBATDAU: '10/02/2026', NGAYKETTHUC: '30/06/2026', MOTA: '' }
    ];
    var DOT = [
        { ID: 'DPT1', TS_KEHOACHTUYENSINH_ID: 'KTS1', MA: 'D1-THPT', TEN: 'Đợt 1 — xét điểm thi THPT', MOTADIEUKIENXET: 'Tổng điểm 3 môn theo tổ hợp ≥ 18',
          DOITUONGDUTUYEN_ID: 'PT1', DOITUONGDUTUYEN_TEN: 'Xét điểm thi THPT', DOTTUYENSINH_ID: 'DT1', DOTTUYENSINH_TEN: 'Đợt 1',
          NGAYBATDAU: '01/07/2026', NGAYKETTHUC: '30/07/2026', TS_MAUHOSO_ID: 'MHS1', THUTU: 1, TENHIENTHITOHOP: 'Tổ hợp xét tuyển',
          NGUYENVONGTOITHIEUCANNHAP: 1, NGUYENVONGTOIDACANNHAP: 5 },
        { ID: 'DPT2', TS_KEHOACHTUYENSINH_ID: 'KTS1', MA: 'D1-HB', TEN: 'Đợt 1 — xét học bạ', MOTADIEUKIENXET: 'Điểm trung bình lớp 12 ≥ 6.5',
          DOITUONGDUTUYEN_ID: 'PT2', DOITUONGDUTUYEN_TEN: 'Xét học bạ', DOTTUYENSINH_ID: 'DT1', DOTTUYENSINH_TEN: 'Đợt 1',
          NGAYBATDAU: '15/03/2026', NGAYKETTHUC: '15/06/2026', TS_MAUHOSO_ID: 'MHS2', THUTU: 2, TENHIENTHITOHOP: 'Tổ hợp môn học bạ',
          NGUYENVONGTOITHIEUCANNHAP: 1, NGUYENVONGTOIDACANNHAP: 3 }
    ];
    var PHI = [
        { ID: 'PHI1', TS_DOTTS_DOITUONG_ID: 'DPT1', TAICHINH_CACKHOANTHU_ID: 'KT1', SOTIEN: 30000, DAOTAO_THOIGIANDAOTAO_ID: 'TG1', MOTA: 'Lệ phí xét tuyển mỗi nguyện vọng' }
    ];
    var LOP = [
        { ID: 'LDK1', DOT: 'DPT1', DAOTAO_LOPQUANLY_ID: 'LQL1', DAOTAO_LOPQUANLY_MA: 'K66-CNTT1', DAOTAO_LOPQUANLY_TEN: 'Công nghệ thông tin 1 — K66',
          SOLUONGKEHOACH: 60, SOLUONGTHUCTE: 12, NGAY_DD_MM_YYYY_HHMMSS: '12/06/2026 09:15:22', NGUOITAO_TAIKHOAN: 'hanhnt' },
        { ID: 'LDK2', DOT: 'DPT1', DAOTAO_LOPQUANLY_ID: 'LQL2', DAOTAO_LOPQUANLY_MA: 'K66-KT1', DAOTAO_LOPQUANLY_TEN: 'Kế toán 1 — K66',
          SOLUONGKEHOACH: 55, SOLUONGTHUCTE: 0, NGAY_DD_MM_YYYY_HHMMSS: '12/06/2026 09:17:40', NGUOITAO_TAIKHOAN: 'hanhnt' }
    ];
    var NGANH = [dm('NN1', '7480201', 'Công nghệ thông tin', 'Ngành nghề'), dm('NN2', '7340301', 'Kế toán', 'Ngành nghề'),
        dm('NN3', '7340101', 'Quản trị kinh doanh', 'Ngành nghề'), dm('NN4', '7620110', 'Khoa học cây trồng', 'Ngành nghề')];
    var DOTNGANH = [
        { ID: 'DN1', DOT: 'DPT1', NGANHNGHE_ID: 'NN1', NGANHNGHE_MA: '7480201', NGANHNGHE_TEN: 'Công nghệ thông tin', DSTOHOP: 'A00, A01',
          MANGANHNGHEXETTUYEN: 'CNTT01', TS_DOTTUYENSINH_DOITUONG_ID: 'DPT1', TS_KEHOACHTUYENSINH_ID: 'KTS1', DOITUONGDUTUYEN_ID: 'PT1', DOTTUYENSINH_ID: 'DT1' },
        { ID: 'DN2', DOT: 'DPT1', NGANHNGHE_ID: 'NN2', NGANHNGHE_MA: '7340301', NGANHNGHE_TEN: 'Kế toán', DSTOHOP: 'A00, D01',
          MANGANHNGHEXETTUYEN: 'KT01', TS_DOTTUYENSINH_DOITUONG_ID: 'DPT1', TS_KEHOACHTUYENSINH_ID: 'KTS1', DOITUONGDUTUYEN_ID: 'PT1', DOTTUYENSINH_ID: 'DT1' }
    ];
    var MONTHI = [
        { ID: 'MT1', TS_TOHOP_ID: 'A00', TS_TOHOP_TEN: 'A00', TS_MONTHI_ID: 'TOAN', TS_MONTHI_TEN: 'Toán', PHANLOAI_ID: 'PL1', PHANLOAI_TEN: 'Môn chính', TINHCHAT_ID: 'TC1', TINHCHAT_TEN: 'Bắt buộc' },
        { ID: 'MT2', TS_TOHOP_ID: 'A00', TS_TOHOP_TEN: 'A00', TS_MONTHI_ID: 'LY', TS_MONTHI_TEN: 'Vật lý', PHANLOAI_ID: 'PL2', PHANLOAI_TEN: 'Môn phụ', TINHCHAT_ID: 'TC1', TINHCHAT_TEN: 'Bắt buộc' },
        { ID: 'MT3', TS_TOHOP_ID: 'A00', TS_TOHOP_TEN: 'A00', TS_MONTHI_ID: 'HOA', TS_MONTHI_TEN: 'Hoá học', PHANLOAI_ID: 'PL2', PHANLOAI_TEN: 'Môn phụ', TINHCHAT_ID: 'TC1', TINHCHAT_TEN: 'Bắt buộc' },
        { ID: 'MT4', TS_TOHOP_ID: 'D01', TS_TOHOP_TEN: 'D01', TS_MONTHI_ID: 'ANH', TS_MONTHI_TEN: 'Tiếng Anh', PHANLOAI_ID: 'PL1', PHANLOAI_TEN: 'Môn chính', TINHCHAT_ID: 'TC2', TINHCHAT_TEN: 'Nhân hệ số 2' }
    ];
    var TOHOP = [
        { ID: 'TH1', NG: 'DN1', TS_TOHOP_TEN: 'A00', TS_MONTHI_TEN: 'Toán', PHANLOAI_TEN: 'Môn chính', TINHCHAT_TEN: 'Bắt buộc' },
        { ID: 'TH2', NG: 'DN1', TS_TOHOP_TEN: 'A00', TS_MONTHI_TEN: 'Vật lý', PHANLOAI_TEN: 'Môn phụ', TINHCHAT_TEN: 'Bắt buộc' }
    ];
    var TT_ = [dm('TT1', 'HOTEN', 'Họ và tên', 'Trường thông tin'), dm('TT2', 'NGAYSINH', 'Ngày sinh', 'Trường thông tin'),
        dm('TT3', 'DIEMTB12', 'Điểm trung bình lớp 12', 'Trường thông tin'), dm('TT4', 'TONGDIEM', 'Tổng điểm xét tuyển', 'Trường thông tin'),
        dm('TT5', 'KETQUA', 'Kết quả xét tuyển', 'Trường thông tin')];
    var MORONG = [
        { ID: 'MR1', MAU: 'MHS1', TRUONGTHONGTIN_MA: 'HOTEN', TRUONGTHONGTIN_TEN: 'Họ và tên', TRUONGTHONGTIN_KIEUDULIEU: 'TEXT', THUOCNHOM: 'Thông tin chung', THUTU: 1, BATBUOC: 1, DORONG: 6, PHAMVIBATDAU: '', PHAMVIKETTHUC: '' },
        { ID: 'MR2', MAU: 'MHS1', TRUONGTHONGTIN_MA: 'DIEMTB12', TRUONGTHONGTIN_TEN: 'Điểm trung bình lớp 12', TRUONGTHONGTIN_KIEUDULIEU: 'NUMBER', THUOCNHOM: 'Học bạ', THUTU: 2, BATBUOC: 1, DORONG: 3, PHAMVIBATDAU: 0, PHAMVIKETTHUC: 10 }
    ];
    var CAUTRUC = [
        { ID: 'CT1', KH: 'KTS1', THANHPHAN_ID: 'TT5', THANHPHAN_CHA_ID: '', XAUCONGTHUCTINH: '', KYHIEU: 'KQ', LATHANHPHANCUOI: 0, TINHTOAN: 0, THUTU: 1, THUTUTRACUU: 1, HIENTHIKETQUATRACUU: 1, MOTA: 'Kết quả xét tuyển' },
        { ID: 'CT2', KH: 'KTS1', THANHPHAN_ID: 'TT4', THANHPHAN_CHA_ID: 'TT5', XAUCONGTHUCTINH: '#TOAN#+#LY#+#HOA#', KYHIEU: 'TD', LATHANHPHANCUOI: 1, TINHTOAN: 1, THUTU: 2, THUTUTRACUU: 2, HIENTHIKETQUATRACUU: 1, MOTA: '' }
    ];
    var HEKHOA = [{ ID: 'HK1', KH: 'KTS1', DAOTAO_HEDAOTAO_ID: 'HE1', DAOTAO_KHOADAOTAO_ID: 'KH1' }];
    var NHANSU = [{ ID: 'NSK1', KH: 'KTS1', NGUOIDUNG_ID: 'NS0001', NGUOIDUNG_TENDAYDU: 'Nguyễn Thị Hạnh', NGUOIDUNG_TAIKHOAN: 'hanhnt' }];
    var HOSO = [{ ID: 'HS1', KH: 'KTS1', THUTU: 1, LOAIHOSO_ID: 'LHS1', SOLUONG: 2, TINHCHATHOSO_ID: 'TCH1' },
        { ID: 'HS2', KH: 'KTS1', THUTU: 2, LOAIHOSO_ID: 'LHS2', SOLUONG: 1, TINHCHATHOSO_ID: 'TCH2' }];
    var THMON = [{ ID: 'THM1', KH: 'KTS1', THUTU: 1, TENMON: 'Toán' }, { ID: 'THM2', KH: 'KTS1', THUTU: 2, TENMON: 'Ngữ văn' }];

    function theo(list, k, v) { return list.filter(function (r) { return r[k] === v; }); }
    function bo(list, id) { for (var i = list.length - 1; i >= 0; i--) if (list[i].ID === id) list.splice(i, 1); return []; }

    ums.demo.add({
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TS.CHEDONHAPDULIEU': CHEDO,
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TS.DOITUONGDUTUYEN': [dm('PT1', 'THPT', 'Xét điểm thi THPT', 'Phương thức tuyển'), dm('PT2', 'HOCBA', 'Xét học bạ', 'Phương thức tuyển'), dm('PT3', 'TUYENTHANG', 'Tuyển thẳng', 'Phương thức tuyển')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TS.DOTTUYENSINH': [dm('DT1', 'DOT1', 'Đợt 1', 'Đợt tuyển sinh'), dm('DT2', 'DOT2', 'Đợt 2', 'Đợt tuyển sinh'), dm('DT3', 'BOSUNG', 'Đợt bổ sung', 'Đợt tuyển sinh')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TUYENSINH.LOAIHOSO': [dm('LHS1', 'HOCBA', 'Học bạ THPT (bản sao)', 'Loại hồ sơ'), dm('LHS2', 'CCCD', 'Căn cước công dân (bản sao)', 'Loại hồ sơ'), dm('LHS3', 'ANH', 'Ảnh 3x4', 'Loại hồ sơ')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TUYENSINH.TINHCHATHOSO': [dm('TCH1', 'BATBUOC', 'Bắt buộc', 'Tính chất hồ sơ'), dm('TCH2', 'KHONGBB', 'Không bắt buộc', 'Tính chất hồ sơ')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TUYENSINH.NGANHNGHE': NGANH,
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TS.HOSO.TRUONGTHONGTIN': TT_,

        'TS_KeHoachTuyenSinh/LayDanhSach': function (o) {
            var q = (o.strTuKhoa || '').toLowerCase();
            return KH.filter(function (r) { return !q || r.TEN.toLowerCase().indexOf(q) >= 0; });
        },
        'TS_KeHoachTuyenSinh/LayChiTiet': function (o) { return theo(KH, 'ID', o.strId); },
        'TS_KeHoachTuyenSinh/ThemMoi': function (o) {
            var id = moi();
            KH.unshift({ ID: id, TEN: o.strTen, MOTA: o.strMoTa, NGAYBATDAU: o.strNgayBatDau, NGAYKETTHUC: o.strNgayKetThuc,
                CHEDONHAPDULIEU_ID: o.strCheDoNhapDuLieu_Id, CHEDONHAPDULIEU_TEN: (theo(CHEDO, 'ID', o.strCheDoNhapDuLieu_Id)[0] || {}).TEN || '' });
            return { rows: [], raw: { Id: id } };
        },
        'TS_KeHoachTuyenSinh/CapNhat': function (o) {
            theo(KH, 'ID', o.strId).forEach(function (r) {
                r.TEN = o.strTen; r.MOTA = o.strMoTa; r.NGAYBATDAU = o.strNgayBatDau; r.NGAYKETTHUC = o.strNgayKetThuc;
                r.CHEDONHAPDULIEU_ID = o.strCheDoNhapDuLieu_Id; r.CHEDONHAPDULIEU_TEN = (theo(CHEDO, 'ID', o.strCheDoNhapDuLieu_Id)[0] || {}).TEN || '';
            });
            return [];
        },
        'TS_KeHoachTuyenSinh/Xoa': function (o) { return bo(KH, o.strIds); },

        'KHCT_HeDaoTao/LayDanhSach': [{ ID: 'HE1', TENHEDAOTAO: 'Đại học chính quy' }, { ID: 'HE2', TENHEDAOTAO: 'Liên thông đại học' }, { ID: 'HE3', TENHEDAOTAO: 'Thạc sĩ' }],
        'KHCT_KhoaDaoTao/LayDanhSach': function (o) {
            var all = [{ ID: 'KH1', HE: 'HE1', TENKHOA: 'K66 (2026–2030)' }, { ID: 'KH2', HE: 'HE1', TENKHOA: 'K65 (2025–2029)' },
                { ID: 'KH3', HE: 'HE2', TENKHOA: 'LT26 (2026–2028)' }, { ID: 'KH4', HE: 'HE3', TENKHOA: 'CH2026' }];
            return all.filter(function (r) { return !o.strDaoTao_HeDaoTao_Id || r.HE === o.strDaoTao_HeDaoTao_Id; });
        },
        'TS_KeHoach_HeDaoTao/LayDanhSach': function (o) { return theo(HEKHOA, 'KH', o.strTS_KeHoachTuyenSinh_Id); },
        'TS_KeHoach_HeDaoTao/ThemMoi': function (o) { HEKHOA.push({ ID: moi(), KH: o.strTS_KeHoachTuyenSinh_Id, DAOTAO_HEDAOTAO_ID: o.strDaoTao_HeDaoTao_Id, DAOTAO_KHOADAOTAO_ID: o.strDaoTao_KhoaDaoTao_Id }); return []; },
        'TS_KeHoach_HeDaoTao/Xoa': function (o) { return bo(HEKHOA, o.strIds); },
        'TS_KeHoach_NhanSu/LayDanhSach': function (o) { return theo(NHANSU, 'KH', o.strTS_KeHoachTuyenSinh_Id); },
        'TS_KeHoach_NhanSu/ThemMoi': function (o) { NHANSU.push({ ID: moi(), KH: o.strTS_KeHoachTuyenSinh_Id, NGUOIDUNG_ID: o.strNguoiDung_Id, NGUOIDUNG_TENDAYDU: 'Cán bộ ' + o.strNguoiDung_Id, NGUOIDUNG_TAIKHOAN: o.strNguoiDung_Id }); return []; },
        'TS_KeHoach_NhanSu/Xoa': function (o) { return bo(NHANSU, o.strIds); },
        'TS_QuyDinhHoSo/LayDanhSach': function (o) { return theo(HOSO, 'KH', o.strTS_KeHoachTuyenSinh_Id); },
        'TS_QuyDinhHoSo/Xoa': function (o) { return bo(HOSO, o.strIds); },
        'TS_ToHopMon/LayDanhSach': function (o) { return theo(THMON, 'KH', o.strTS_KeHoachTuyenSinh_Id); },
        'TS_ToHopMon/Xoa': function (o) { return bo(THMON, o.strIds); },

        'TS_Dot_DoiTuong/LayDanhSach': function (o) { return theo(DOT, 'TS_KEHOACHTUYENSINH_ID', o.strTS_KeHoachTuyenSinh_Id); },
        'TS_Dot_DoiTuong/ThemMoi': function (o) {
            var id = moi();
            DOT.push({ ID: id, TS_KEHOACHTUYENSINH_ID: o.strTS_KeHoachTuyenSinh_Id, MA: o.strMa, TEN: o.strTen, MOTADIEUKIENXET: o.strMoTaDieuKienXet,
                DOITUONGDUTUYEN_ID: o.strDoiTuongDuTuyen_Id, DOITUONGDUTUYEN_TEN: '', DOTTUYENSINH_ID: o.strDotTuyenSinh_Id, DOTTUYENSINH_TEN: '',
                NGAYBATDAU: o.strNgayBatDau, NGAYKETTHUC: o.strNgayKetThuc, TS_MAUHOSO_ID: o.strTS_MauHoSo_Id, THUTU: o.iThuTu,
                TENHIENTHITOHOP: o.strTenHienThiToHop, NGUYENVONGTOITHIEUCANNHAP: o.dNguyenVongToiThieuCanNhap, NGUYENVONGTOIDACANNHAP: o.dNguyenVongToiDaCanNhap });
            return { rows: [], raw: { Id: id } };
        },
        'TS_Dot_DoiTuong/CapNhat': function (o) {
            theo(DOT, 'ID', o.strId).forEach(function (r) {
                r.MA = o.strMa; r.TEN = o.strTen; r.MOTADIEUKIENXET = o.strMoTaDieuKienXet; r.NGAYBATDAU = o.strNgayBatDau; r.NGAYKETTHUC = o.strNgayKetThuc;
                r.DOITUONGDUTUYEN_ID = o.strDoiTuongDuTuyen_Id; r.DOTTUYENSINH_ID = o.strDotTuyenSinh_Id; r.TS_MAUHOSO_ID = o.strTS_MauHoSo_Id;
                r.THUTU = o.iThuTu; r.TENHIENTHITOHOP = o.strTenHienThiToHop;
                r.NGUYENVONGTOITHIEUCANNHAP = o.dNguyenVongToiThieuCanNhap; r.NGUYENVONGTOIDACANNHAP = o.dNguyenVongToiDaCanNhap;
            });
            return [];
        },
        'TS_Dot_DoiTuong/Xoa': function (o) { return bo(DOT, o.strIds); },

        'TS_MauHoSo/LayDanhSach': [{ ID: 'MHS1', MA: 'MAU-THPT', TEN: 'Mẫu hồ sơ xét điểm thi THPT' }, { ID: 'MHS2', MA: 'MAU-HB', TEN: 'Mẫu hồ sơ xét học bạ' }],
        'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao': [{ ID: 'TG1', MA: '2026-1', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm học 2026-2027' }, { ID: 'TG2', MA: '2026-2', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 năm học 2026-2027' }],

        'pkg_tuyensinh_kehoach.LayDSTS_KeHoach_Phi_Dot': function (o) { return theo(PHI, 'TS_DOTTS_DOITUONG_ID', o.strTS_DotTS_DoiTuong_Id); },
        'pkg_tuyensinh_kehoach.Them_TS_KeHoach_Phi_Dot': function (o) {
            PHI.push({ ID: moi(), TS_DOTTS_DOITUONG_ID: o.strTS_DotTS_DoiTuong_Id, TAICHINH_CACKHOANTHU_ID: o.strTaiChinh_CacKhoanThu_Id, SOTIEN: o.dSoTien,
                DAOTAO_THOIGIANDAOTAO_ID: o.strDaoTao_ThoiGianDaoTao_Id, MOTA: o.strMoTa });
            return [];
        },
        'TS_KeHoach_Phi_Dot/Xoa': function (o) { return bo(PHI, o.strIds); },

        'pkg_tuyensinh_thongtin.LayDSLopQLTheoKeHoach': [{ ID: 'LQL1', MA: 'K66-CNTT1', TEN: 'Công nghệ thông tin 1 — K66' },
            { ID: 'LQL2', MA: 'K66-KT1', TEN: 'Kế toán 1 — K66' }, { ID: 'LQL3', MA: 'K66-QTKD1', TEN: 'Quản trị kinh doanh 1 — K66' }],
        'pkg_tuyensinh_thongtin.LayDSTS_Dot_DoiTuong_LopHoc': function (o) { return theo(LOP, 'DOT', o.strTS_DoiTuongTS_DT_Id); },
        'pkg_tuyensinh_thongtin.Xoa_TS_Dot_DoiTuong_LopHoc': function (o) { return bo(LOP, o.strId); },

        'TS_Dot_DT_NganhNghe/LayDanhSach': function (o) {
            return DOTNGANH.filter(function (r) { return r.TS_KEHOACHTUYENSINH_ID === o.strTS_KeHoachTuyenSinh_Id && r.DOTTUYENSINH_ID === o.strDotTuyenSinh_Id && r.DOITUONGDUTUYEN_ID === o.strDoiTuongDuTuyen_Id; });
        },
        'TS_Dot_DT_NganhNghe/ThemMoi': function (o) {
            var n = theo(NGANH, 'ID', o.strNganhNghe_Id)[0] || {};
            DOTNGANH.push({ ID: moi(), NGANHNGHE_ID: n.ID, NGANHNGHE_MA: n.MA, NGANHNGHE_TEN: n.TEN, DSTOHOP: '', MANGANHNGHEXETTUYEN: o.strMaNganhNgheXetTuyen,
                TS_DOTTUYENSINH_DOITUONG_ID: o.strTS_Dot_DoiTuong_Id, TS_KEHOACHTUYENSINH_ID: o.strTS_KeHoachTuyenSinh_Id,
                DOITUONGDUTUYEN_ID: o.strDoiTuongDuTuyen_Id, DOTTUYENSINH_ID: o.strDotTuyenSinh_Id });
            return [];
        },
        'TS_Dot_DT_NganhNghe/Xoa': function (o) { return bo(DOTNGANH, o.strIds); },
        'TS_ToHop_MonThi/LayDanhSach': MONTHI,
        'TS_ToHop_Mon_Nganh_Dot/LayDanhSach': function (o) {
            var ng = DOTNGANH.filter(function (r) { return r.NGANHNGHE_ID === o.strNganhNghe_Id && r.TS_KEHOACHTUYENSINH_ID === o.strTS_KeHoachTuyenSinh_Id; })[0];
            return ng ? theo(TOHOP, 'NG', ng.ID) : [];
        },
        'TS_ToHop_Mon_Nganh_Dot/ThemMoi': function (o) {
            var ng = DOTNGANH.filter(function (r) { return r.NGANHNGHE_ID === o.strNganhNghe_Id && r.TS_KEHOACHTUYENSINH_ID === o.strTS_KeHoachTuyenSinh_Id; })[0];
            var m = MONTHI.filter(function (x) { return x.TS_MONTHI_ID === o.strTS_MonThi_Id && x.TS_TOHOP_ID === o.strTS_ToHop_Id; })[0] || {};
            if (ng) TOHOP.push({ ID: moi(), NG: ng.ID, TS_TOHOP_TEN: m.TS_TOHOP_TEN, TS_MONTHI_TEN: m.TS_MONTHI_TEN, PHANLOAI_TEN: m.PHANLOAI_TEN, TINHCHAT_TEN: m.TINHCHAT_TEN });
            return [];
        },
        'TS_ToHop_Mon_Nganh_Dot/Xoa': function (o) { return bo(TOHOP, o.strIds); },

        'pkg_tuyensinh_kehoach.LayDSTS_HoSo_MoRong': function (o) { return theo(MORONG, 'MAU', o.strTS_MauHoSo_Id); },
        'pkg_tuyensinh_kehoach.Them_TS_HoSo_MoRong': function (o) {
            var t = theo(TT_, 'ID', o.strTruongThongTin_Id)[0] || {};
            MORONG.push({ ID: moi(), MAU: o.strTS_MauHoSo_Id, TRUONGTHONGTIN_MA: t.MA, TRUONGTHONGTIN_TEN: t.TEN, TRUONGTHONGTIN_KIEUDULIEU: 'TEXT' });
            return [];
        },
        'pkg_tuyensinh_kehoach.Xoa_TS_HoSo_MoRong': function (o) { return bo(MORONG, o.strId); },
        'pkg_tuyensinh_kehoach.LayDSTS_CauTrucHienThiHoSo': function (o) { return theo(CAUTRUC, 'KH', o.strTS_KeHoachTuyenSinh_Id); },
        'pkg_tuyensinh_kehoach.Them_TS_CauTrucHienThiHoSo': function (o) {
            CAUTRUC.push({ ID: moi(), KH: o.strTS_KeHoachTuyenSinh_Id, THANHPHAN_ID: o.strThanhPhan_Id, THANHPHAN_CHA_ID: o.strThanhPhan_Cha_Id });
            return [];
        },
        'pkg_tuyensinh_kehoach.Xoa_TS_CauTrucHienThiHoSo': function (o) { return bo(CAUTRUC, o.strId); }
    });
})();
