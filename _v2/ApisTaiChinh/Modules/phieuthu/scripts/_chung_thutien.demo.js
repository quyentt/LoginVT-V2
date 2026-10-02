/* Dữ liệu mẫu cho thutien và viewthutien — chỉ dùng ở chế độ dựng thử.

   Sinh viên Nguyễn Văn An (NH001) được dựng để kiểm tra tiền:
     phải nộp  15.000.000 (học phí) + 704.025 (BHYT) + 300.000 (thi lại)
               + 1.200.000 (KTX, nợ riêng) + 450.000 (đồng phục, thu hộ) = 17.654.025
     miễn giảm 30% học phí                                         =  4.500.000
     đã nộp    5.000.000 (học phí, NỘP THIẾU) + 250.000 (nộp thừa kỳ trước) = 5.250.000
     nợ chung  5.500.000 + 704.025 + 300.000                        =  6.504.025
     NOCO      5.250.000 + 4.500.000 − 17.654.025                   = −7.904.025
   Trần Thị Bình (NH002) chỉ có khoản thừa, Lê Minh Châu (NH003) đã hoàn thành. */
(function () {
    'use strict';

    var SV = [
        { ID: 'R1', QLSV_NGUOIHOC_ID: 'NH001', MASO: 'CNTT23001', HODEM: 'Nguyễn Văn', TEN: 'An', ANH: '',
          DAOTAO_LOPQUANLY_N1_TEN: 'CNTT K23A', NGANHHOC_N1_TEN: 'Công nghệ thông tin', KHOAHOC_N1_TEN: 'Khóa 23', KHOAHOC_N1_MA: 'K23',
          NIENKHOA_N1: '2023-2027', TENHEDAOTAO: 'Đại học chính quy', TTLL_DIENTHOAICANHAN: '0912 345 678', SODIENTHOAI_CANHAN: '0912 345 678',
          NGAYSINH_NGAY: '12', NGAYSINH_THANG: '03', NGAYSINH_NAM: '2005', DINHDANH_CHINH_SO: '001205012345',
          TTLL_KHICANBAOTINCHOAI_ODAU: 'Số 12 ngõ 45 Trần Duy Hưng, Cầu Giấy, Hà Nội',
          QLSV_TRANGTHAINGUOIHOC_MA: 'NORMAL', QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT01' },
        { ID: 'R2', QLSV_NGUOIHOC_ID: 'NH002', MASO: 'KT23015', HODEM: 'Trần Thị', TEN: 'Bình', ANH: '',
          DAOTAO_LOPQUANLY_N1_TEN: 'KT K23B', NGANHHOC_N1_TEN: 'Kế toán', KHOAHOC_N1_TEN: 'Khóa 23', NIENKHOA_N1: '2023-2027',
          TENHEDAOTAO: 'Đại học chính quy', TTLL_DIENTHOAICANHAN: '0987 222 111',
          QLSV_TRANGTHAINGUOIHOC_MA: 'RESERVE', QLSV_TRANGTHAINGUOIHOC_TEN: '', QLSV_QUYETDINH_N1_SOQD: '215/QĐ-ĐHCN',
          QLSV_QUYETDINH_N1_NGAYQD: '01/08/2026', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT02' },
        { ID: 'R3', QLSV_NGUOIHOC_ID: 'NH003', MASO: 'QTKD22008', HODEM: 'Lê Minh', TEN: 'Châu', ANH: '',
          DAOTAO_LOPQUANLY_N1_TEN: 'QTKD K22A', NGANHHOC_N1_TEN: 'Quản trị kinh doanh', KHOAHOC_N1_TEN: 'Khóa 22', NIENKHOA_N1: '2022-2026',
          TENHEDAOTAO: 'Đại học chính quy', QLSV_TRANGTHAINGUOIHOC_MA: 'GRADUATE', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT03' }
    ];

    function khoan(id, kt, ten, tien, nd, htct, extra) {
        var r = {
            ID: id, TAICHINH_CACKHOANTHU_ID: kt, TAICHINH_CACKHOANTHU_TEN: ten, SOTIEN: tien, NOIDUNG: nd,
            DAOTAO_THOIGIANDAOTAO_ID: 'TG251', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm 2025-2026', DAOTAO_THOIGIANDAOTAO_DOT: '1',
            HETHONGCHUNGTU_MA: htct || 'TAICHINH_HETHONGBIENLAI', NGAYTAO_DD_MM_YYYY: '05/09/2025', NGUOITAO_TENDAYDU: 'Phạm Thu Hà'
        };
        Object.keys(extra || {}).forEach(function (k) { r[k] = extra[k]; });
        return r;
    }

    var NO_CHUNG = [
        khoan('PN01', 'KT1', 'Học phí', 5500000, 'Học phí học kỳ 1 năm học 2025-2026', null, { MATHANHTOANDINHDANH: '963CNTT23001HP' }),
        khoan('PN02', 'KT2', 'Bảo hiểm y tế', 704025, 'Bảo hiểm y tế năm 2026', null, { MATHANHTOANDINHDANH: '963CNTT23001BH' }),
        khoan('PN03', 'KT3', 'Lệ phí thi lại', 300000, 'Thi lại học phần Giải tích 1', null, { MATHANHTOANDINHDANH: '963CNTT23001TL' })
    ];
    var NO_RIENG = [khoan('PR01', 'KT4', 'Phí ký túc xá', 1200000, 'Ký túc xá tháng 9/2025', 'TAICHINH_HETHONGPHIEUTHU')];
    var THUA_CHUNG = [khoan('DC01', 'KT1', 'Học phí', 250000, 'Học phí HK2 2024-2025 nộp thừa', 'TAICHINH_HETHONGPHIEUTHURUT',
        { DAOTAO_THOIGIANDAOTAO_ID: 'TG242', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 năm 2024-2025', DAOTAO_THOIGIANDAOTAO_DOT: '2' })];
    var THU_HO = [khoan('TH01', 'KT5', 'Phí đồng phục', 450000, 'Đồng phục thể dục', 'TAICHINH_HETHONGBIENLAI')];

    var THONG_TIN = {
        NH001: { TONGKHOANPHAINOP: 17654025, TONGKHOANDUOCMIEN: 4500000, TONGKHOANDANOP: 5250000, TONGKHOANDARUT: 0,
                 TONGNORIENG: 1200000, TONGNOCHUNG: 6504025, TONGDURIENG: 0, TONGDUCHUNG: 250000,
                 TONGTIENPHIEUTHU: 5250000, TONGTIENPHIEURUT: 0, TONGTIENHOADON: 0, NOCO: -7904025 },
        NH002: { TONGKHOANPHAINOP: 12000000, TONGKHOANDUOCMIEN: 0, TONGKHOANDANOP: 12800000, TONGKHOANDARUT: 0,
                 TONGNORIENG: 0, TONGNOCHUNG: 0, TONGDURIENG: 300000, TONGDUCHUNG: 500000,
                 TONGTIENPHIEUTHU: 12800000, TONGTIENPHIEURUT: 0, TONGTIENHOADON: 0, NOCO: 800000 },
        NH003: { TONGKHOANPHAINOP: 11000000, TONGKHOANDUOCMIEN: 0, TONGKHOANDANOP: 11000000, TONGKHOANDARUT: 0,
                 TONGNORIENG: 0, TONGNOCHUNG: 0, TONGDURIENG: 0, TONGDUCHUNG: 0,
                 TONGTIENPHIEUTHU: 11000000, TONGTIENPHIEURUT: 0, TONGTIENHOADON: 0, NOCO: 0 }
    };

    function svCua(id) { return SV.find(function (s) { return s.QLSV_NGUOIHOC_ID === id || s.ID === id; }) || SV[0]; }

    function tinhTrang(o) {
        var id = o.strQLSV_NguoiHoc_Id;
        var sv = svCua(id);
        var tt = Object.assign({}, THONG_TIN[sv.QLSV_NGUOIHOC_ID] || {}, {
            MASO: sv.MASO, HODEM: sv.HODEM, TEN: sv.TEN, NGAYSINH: sv.NGAYSINH_NGAY ? sv.NGAYSINH_NGAY + '/' + sv.NGAYSINH_THANG + '/' + sv.NGAYSINH_NAM : '',
            MASOTHUECANHAN: '', NOIOHIENNAY: sv.TTLL_KHICANBAOTINCHOAI_ODAU || '',
            DAOTAO_LOPQUANLY_N1_TEN: sv.DAOTAO_LOPQUANLY_N1_TEN, NGANHHOC_N1_TEN: sv.NGANHHOC_N1_TEN, KHOAHOC_N1_TEN: sv.KHOAHOC_N1_TEN
        });
        var d = { rsPhaiNopTongHopChung: [], rsPhaiNopRieng: [], rsDuThuaChung: [], rsDuThuaRieng: [], rsKhoanPhaiNop_ThuHo: [],
                  rsThongTin: [tt], rsDotCongNo: [], rsTongHopNoTheoDot: [], rsTongHopDuTheoDot: [] };
        if (sv.QLSV_NGUOIHOC_ID === 'NH001') {
            d.rsPhaiNopTongHopChung = NO_CHUNG;
            d.rsPhaiNopRieng = NO_RIENG;
            d.rsDuThuaChung = THUA_CHUNG;
            d.rsKhoanPhaiNop_ThuHo = THU_HO;
            d.rsDotCongNo = [{ ID: 'DOT1', TENDOT: '1 — Học kỳ 1 năm 2025-2026' }];
            d.rsTongHopNoTheoDot = NO_CHUNG.map(function (r) {
                return Object.assign({}, r, { TAICHINH_DOTCONGNO_ID: 'DOT1', DAOTAO_THOIGIANDAOTAO_HOCKY: 'Học kỳ 1' });
            });
            d.rsTongHopDuTheoDot = THUA_CHUNG.map(function (r) {
                return Object.assign({}, r, { TAICHINH_DOTCONGNO_ID: 'DOT1', DAOTAO_THOIGIANDAOTAO_HOCKY: 'Học kỳ 2' });
            });
        } else if (sv.QLSV_NGUOIHOC_ID === 'NH002') {
            d.rsDuThuaChung = [khoan('DC21', 'KT1', 'Học phí', 500000, 'Học phí HK1 nộp thừa', 'TAICHINH_HETHONGPHIEUTHURUT')];
            d.rsDuThuaRieng = [khoan('DR21', 'KT4', 'Phí ký túc xá', 300000, 'KTX nộp thừa tháng 8', 'TAICHINH_HETHONGPHIEUTHURUT')];
        }
        return d;
    }

    function chiCua(o, rows) { return o.strQLSV_NguoiHoc_Id === 'NH001' ? rows : []; }

    var PHAI_NOP = [
        khoan('PN01', 'KT1', 'Học phí', 15000000, 'Học phí học kỳ 1 năm học 2025-2026'),
        khoan('PN02', 'KT2', 'Bảo hiểm y tế', 704025, 'Bảo hiểm y tế năm 2026'),
        khoan('PN03', 'KT3', 'Lệ phí thi lại', 300000, 'Thi lại học phần Giải tích 1', null, { KHONGHACHTOAN: 1 }),
        khoan('PN04', 'KT4', 'Phí ký túc xá', 1200000, 'Ký túc xá tháng 9/2025'),
        khoan('PN05', 'KT5', 'Phí đồng phục', 450000, 'Đồng phục thể dục')
    ];
    var MIEN = [khoan('MG01', 'KT1', 'Học phí', 4500000, 'Miễn giảm 30% học phí HK1 2025-2026', null,
        { CHEDOCHINHSACH_TEN: 'Con thương binh', PHANTRAMMIEN: 30, HINHTHUCTHU_ID: 'HT1' })];
    var DA_NOP = [
        khoan('DN01', 'KT1', 'Học phí', 5000000, 'Nộp học phí HK1 2025-2026 (đợt 1)', null, { CHUNGTU_SO: '0001234', HINHTHUCTHU_ID: 'HT1', KHONGHACHTOAN: 0 }),
        khoan('DN02', 'KT1', 'Học phí', 250000, 'Nộp học phí HK2 2024-2025', null, { CHUNGTU_SO: '0000987', HINHTHUCTHU_ID: 'HT2',
            DAOTAO_THOIGIANDAOTAO_ID: 'TG242', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 năm 2024-2025' })
    ];
    var PHIEU = [
        { ID: 'PT01', SOPHIEUTHU: '0001234', TONGTIEN: 5000000, NGAYTHU_DD_MM_YYYY_HHMMSS: '10/09/2025 09:12:40', TAIKHOAN_NGUOITHU: 'hapt' },
        { ID: 'PT02', SOPHIEUTHU: '0000987', TONGTIEN: 250000, NGAYTHU_DD_MM_YYYY_HHMMSS: '15/02/2025 14:03:11', TAIKHOAN_NGUOITHU: 'hapt' }
    ];

    /* Chứng từ in (TC_PhieuThu/LayTTPhieuThu_Rut) */
    function phieuIn(o) {
        var id = o.strPhieuThu_Rut_Id || o.strHoaDonThu_Rut_Id || 'PT01';
        var moi = id.indexOf('MOI') === 0;
        var rs = moi ? [
            { CHUNGTU_ID: id, NOIDUNG: 'Học phí học kỳ 1 năm học 2025-2026', SOTIENDATHU: 3000000, SOPHIEUTHU: '0001301', QUYENSO: '12',
              NGAYIN_NGAY: '18', NGAYIN_THANG: '09', NGAYIN_NAM: '2026', NGUOITAO_TENDAYDU: 'hapt', TENPHIEU: 'BIÊN LAI THU TIỀN',
              MAUSO: '01BLP2-001', KYHIEU: 'AA/26P', DIACHI: 'Số 1 Đại Cồ Việt, Hà Nội', MASOTHUE: '0101234567' },
            { CHUNGTU_ID: id, NOIDUNG: 'Bảo hiểm y tế năm 2026', SOTIENDATHU: 704025 }
        ] : [
            { CHUNGTU_ID: id, NOIDUNG: 'Nộp học phí HK1 2025-2026 (đợt 1)', SOTIENDATHU: 5000000, SOPHIEUTHU: '0001234', QUYENSO: '12',
              NGAYIN_NGAY: '10', NGAYIN_THANG: '09', NGAYIN_NAM: '2025', NGUOITAO_TENDAYDU: 'hapt', TENPHIEU: 'BIÊN LAI THU TIỀN' }
        ];
        var sv = SV[0];
        return { rs: rs, rsThongTinDoiTuong: [{ HODEM: sv.HODEM, TEN: sv.TEN, MASO: sv.MASO, NGAYSINH: '12/03/2005',
            DAOTAO_LOPQUANLY_N1_TEN: sv.DAOTAO_LOPQUANLY_N1_TEN, NGANHHOC_N1_TEN: sv.NGANHHOC_N1_TEN, KHOAHOC_N1_TEN: sv.KHOAHOC_N1_TEN,
            MAUIN_MASO: '', TINHTRANG: 1 }] };
    }

    var dem = 0;
    function moi(o) { dem++; return { rows: { Id: 'MOI' + dem }, message: o.strTaiChinh_CacKhoanThu_Ids || '' }; }

    function dm(code, rows) {
        return rows.map(function (r) { return Object.assign({ CHUNG_TENDANHMUC_TEN: code }, r); });
    }

    ums.demo.add({
        'PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc_All': function (o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            var rows = SV.filter(function (s) {
                return !q || (s.MASO + ' ' + s.HODEM + ' ' + s.TEN).toLowerCase().indexOf(q) >= 0;
            });
            return { rows: rows, pager: rows.length };
        },
        'CM_DanhMucDuLieu/LayDanhSach#QLSV.TRANGTHAI': [
            { ID: 'TT1', MA: 'NORMAL', TEN: 'Đang học' }, { ID: 'TT2', MA: 'RESERVE', TEN: 'Bảo lưu' },
            { ID: 'TT3', MA: 'GRADUATE', TEN: 'Tốt nghiệp' }, { ID: 'TT4', MA: 'DROPOUT', TEN: 'Thôi học' }
        ],
        'CM_DanhMucDuLieu/LayDanhSach#TAICHINH.NUTHDDT': [
            { ID: 'NUT1', MA: 'HDDT_VNPT', TEN: 'HĐĐT VNPT', THONGTIN1: 'fa fa-file-text', THONGTIN2: '', THONGTIN4: '' },
            { ID: 'NUT2', MA: 'HDDTNHAP_VNPT', TEN: 'HĐĐT nháp', THONGTIN1: 'fa fa-file-o', THONGTIN2: 'Nháp VNPT', THONGTIN4: '' }
        ],
        'TC_KhoanThu/LayDanhSach': [
            { ID: 'KT1', MA: 'HP', TEN: 'Học phí' }, { ID: 'KT2', MA: 'BHYT', TEN: 'Bảo hiểm y tế' },
            { ID: 'KT3', MA: 'THILAI', TEN: 'Lệ phí thi lại' }, { ID: 'KT4', MA: 'KTX', TEN: 'Phí ký túc xá' },
            { ID: 'KT5', MA: 'DONGPHUC', TEN: 'Phí đồng phục' }
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NTT': [{ ID: 'N1', MA: 'nguoithutien', TEN: 'Phạm Thu Hà' }],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLTC.HTTHU': dm('Hình thức thu', [
            { ID: 'HT1', MA: 'TM', TEN: 'Tiền mặt', THONGTIN1: 'Tiền mặt' },
            { ID: 'HT2', MA: 'CK', TEN: 'Chuyển khoản', THONGTIN1: null },
            { ID: 'HT3', MA: 'POS', TEN: 'Quẹt thẻ POS', THONGTIN1: 'TM/CK' }
        ]),
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLTC.LTT': dm('Loại tiền tệ', [
            { ID: 'LT1', MA: 'VND', TEN: 'VND' }, { ID: 'LT2', MA: 'USD', TEN: 'USD' }
        ]),
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TAICHINH.DVT': dm('Đơn vị tính', [
            { ID: 'DV1', MA: 'SINHVIEN', TEN: 'Sinh viên' }, { ID: 'DV2', MA: 'LAN', TEN: 'Lần', THONGTIN8: 'CHON' },
            { ID: 'DV3', MA: 'THANG', TEN: 'Tháng' }
        ]),
        'pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTao': [{ ID: 'HE1', TENHEDAOTAO: 'Đại học chính quy' }, { ID: 'HE2', TENHEDAOTAO: 'Liên thông' }],
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_KhoaDaoTao': [{ ID: 'KH23', TENKHOA: 'Khóa 23' }, { ID: 'KH22', TENKHOA: 'Khóa 22' }],
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_ToChucCT': [{ ID: 'CT01', TENCHUONGTRINH: 'Công nghệ thông tin' }, { ID: 'CT02', TENCHUONGTRINH: 'Kế toán' }],
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy': [{ ID: 'L1', TEN: 'CNTT K23A' }, { ID: 'L2', TEN: 'KT K23B' }],
        'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao': [
            { ID: 'TG251', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm 2025-2026' },
            { ID: 'TG252', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 năm 2025-2026' },
            { ID: 'TG242', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 năm 2024-2025' }
        ],

        'TC_ThongTin/LayDSTinhTrangTaiChinh': tinhTrang,
        'TC_ThongTinChung/LayDanhSach': tinhTrang,

        'TC_ThongTinChung/LayDSKhoanPhaiNop': function (o) { return chiCua(o, PHAI_NOP); },
        'TC_ThongTinChung/LayDSKhoanMien': function (o) { return chiCua(o, MIEN); },
        'TC_ThongTinChung/LayDSKhoanDaNop': function (o) { return chiCua(o, DA_NOP); },
        'TC_ThongTinChung/LayDSKhoanDaRut': [],
        'TC_ThongTinChung/LayDSKhoanNoRieng': function (o) { return chiCua(o, NO_RIENG); },
        'TC_ThongTinChung/LayDSKhoanNoChung': function (o) { return chiCua(o, NO_CHUNG); },
        'TC_ThongTinChung/LayDSKhoanDuRieng': [],
        'TC_ThongTinChung/LayDSKhoanDuChung': function (o) { return chiCua(o, THUA_CHUNG); },
        'TC_ThongTinChung/LayDSPhieuDaThu': function (o) { return chiCua(o, PHIEU); },
        'TC_ThongTinChung/LayDSPhieuDaRut': [],
        'TC_ThongTinChung/LayDSPhieuHoaDon': [],
        'TC_ThongTinChung/LayDSKhoanDaNopRieng': [],
        'TC_ThongTinChung/LayDSKhoanPhaiNopRieng': function (o) { return chiCua(o, THU_HO); },
        'TC_ThongTinChung/LayDSPhieuHoaDonRieng': [],
        'TC_ThongTinChung/LayDSPhieuDaThuRieng': [],
        'TC_ThongTin/LayDSKhoanDaRut_Rieng': [],
        'TC_KhoanPhaiNop/LayDSDienDaiChiTietPhaiNop': [
            { DAOTAO_HOCPHAN_MA: 'IT1101', DAOTAO_HOCPHAN_TEN: 'Nhập môn lập trình', SOTIEN: 3000000, SOTINCHI: 3, KIEUHOC_TEN: 'Học lần đầu', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'CNTT', DANGKY_LOPHOCPHAN_TEN: 'IT1101.01', TAICHINH_CACKHOANTHU_TEN: 'Học phí' },
            { DAOTAO_HOCPHAN_MA: 'MA1101', DAOTAO_HOCPHAN_TEN: 'Giải tích 1', SOTIEN: 3000000, SOTINCHI: 3, KIEUHOC_TEN: 'Học lần đầu', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'CNTT', DANGKY_LOPHOCPHAN_TEN: 'MA1101.03', TAICHINH_CACKHOANTHU_TEN: 'Học phí' },
            { DAOTAO_HOCPHAN_MA: 'PH1101', DAOTAO_HOCPHAN_TEN: 'Vật lý đại cương', SOTIEN: 3000000, SOTINCHI: 3, KIEUHOC_TEN: 'Học lần đầu', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'CNTT', DANGKY_LOPHOCPHAN_TEN: 'PH1101.02', TAICHINH_CACKHOANTHU_TEN: 'Học phí' },
            { DAOTAO_HOCPHAN_MA: 'EN1101', DAOTAO_HOCPHAN_TEN: 'Tiếng Anh 1', SOTIEN: 3000000, SOTINCHI: 3, KIEUHOC_TEN: 'Học lần đầu', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'CNTT', DANGKY_LOPHOCPHAN_TEN: 'EN1101.05', TAICHINH_CACKHOANTHU_TEN: 'Học phí' },
            { DAOTAO_HOCPHAN_MA: 'PE1101', DAOTAO_HOCPHAN_TEN: 'Triết học Mác - Lênin', SOTIEN: 3000000, SOTINCHI: 3, KIEUHOC_TEN: 'Học lần đầu', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'CNTT', DANGKY_LOPHOCPHAN_TEN: 'PE1101.01', TAICHINH_CACKHOANTHU_TEN: 'Học phí' }
        ],
        'TC_KhoanMien/LayDSDienDaiChiTietMien': [
            { DAOTAO_HOCPHAN_MA: 'IT1101', DAOTAO_HOCPHAN_TEN: 'Nhập môn lập trình', SOTIEN: 900000, SOTINCHI: 3, KIEUHOC_TEN: 'Học lần đầu', TAICHINH_CACKHOANTHU_TEN: 'Học phí' }
        ],

        'TC_ThongTinChung/DocSoThanhChu': function (o) {
            var s = typeof window.to_vietnamese === 'function' ? window.to_vietnamese(o.dSoTien).trim() : '';
            s = s.replace(/đồng$/, o.strLoaiTien || 'đồng');
            return { rows: s.charAt(0).toUpperCase() + s.substring(1) + '.' };
        },
        'TC_DaNop/ThemMoi': moi,
        'TC_TaiChinh_Rut/ThemMoi': moi,
        'HDDT_HoaDon/ThemMoi': moi,
        'HDDT_HoaDon/ThemMoi_Nhap': { rows: '/Upload/HDDT/nhap-demo.pdf' },
        'TC_HoaDonNhap/ThemMoi': moi,
        'TC_HoaDonNhap_ChuaThu/ThemMoi': [],
        'TC_SoBienLai/HuyBienLai': [],
        'TC_PhieuThu/LayTTPhieuThu_Rut': phieuIn,
        'TC_HoaDon/LayTTHoaDonThu_Rut': phieuIn
    });
})();
