/* Dữ liệu mẫu cho thutienkhac — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';

    var DT = [
        { ID: 'DT01', TENDOITUONG: 'Công ty TNHH Minh Phát', MASODOITUONG: 'DTK0001', FULL_NAME: 'Công ty TNHH Minh Phát', MASO: 'DTK0001',
          SODIENTHOAI: '0243 868 1122', DIACHIEMAIL: 'ketoan@minhphat.vn', DIACHILIENLAC: '12 Trần Duy Hưng, Cầu Giấy, Hà Nội',
          COQUANCONGTAC: 'Công ty TNHH Minh Phát', DIACHICOQUANCONGTAC: '12 Trần Duy Hưng, Hà Nội', MASOTHUECANHAN: '', MASOTHUECOQUAN: '0106543210',
          LAHOCVIEN_DOITUONG_ID: 'DHV2', LAHOCVIEN_LOP_ID: 'L1,L2', NGANHANG_SOTAIKHOAN: '0011004455667', NGANHANG_THUOCNGANHANG_ID: 'NH1',
          NGANHANG_THUOCNGANHANG_TEN: 'Vietcombank', NGANHANG_THONGTINCHINHANH: 'Chi nhánh Thành Công', CCCD: '', MAQUANHENGANSACH: '1054321',
          NOIOHIENNAY: '12 Trần Duy Hưng, Cầu Giấy, Hà Nội' },
        { ID: 'DT02', TENDOITUONG: 'Nguyễn Văn Hùng', MASODOITUONG: 'DTK0002', FULL_NAME: 'Nguyễn Văn Hùng', MASO: 'DTK0002', NGAYSINH: '14/03/1988',
          SODIENTHOAI: '0912 345 678', DIACHIEMAIL: 'hungnv@gmail.com', DIACHILIENLAC: 'Số 5 ngõ 82 Chùa Láng, Đống Đa, Hà Nội',
          COQUANCONGTAC: 'Sở GD&ĐT Hà Nội', DIACHICOQUANCONGTAC: '23 Quang Trung, Hà Nội', MASOTHUECANHAN: '8012345678', MASOTHUECOQUAN: '',
          LAHOCVIEN_DOITUONG_ID: 'DHV1', LAHOCVIEN_LOP_ID: 'L1', NGANHANG_SOTAIKHOAN: '19033445566011', NGANHANG_THUOCNGANHANG_ID: 'NH2',
          NGANHANG_THUOCNGANHANG_TEN: 'Techcombank', NGANHANG_THONGTINCHINHANH: 'Chi nhánh Đống Đa', CCCD: '001088012345', MAQUANHENGANSACH: '',
          NOIOHIENNAY: 'Số 5 ngõ 82 Chùa Láng, Đống Đa, Hà Nội' },
        { ID: 'DT03', TENDOITUONG: 'Trường THPT Chu Văn An', MASODOITUONG: 'DTK0003', FULL_NAME: 'Trường THPT Chu Văn An', MASO: 'DTK0003',
          SODIENTHOAI: '0243 823 3099', DIACHIEMAIL: 'c3chuvanan@hanoi.edu.vn', DIACHILIENLAC: '10 Thụy Khuê, Tây Hồ, Hà Nội',
          COQUANCONGTAC: '', DIACHICOQUANCONGTAC: '', MASOTHUECANHAN: '', MASOTHUECOQUAN: '0100109988', LAHOCVIEN_DOITUONG_ID: '',
          LAHOCVIEN_LOP_ID: '', NGANHANG_SOTAIKHOAN: '', NGANHANG_THUOCNGANHANG_ID: '', NGANHANG_THONGTINCHINHANH: '', CCCD: '', MAQUANHENGANSACH: '1011223' },
        { ID: 'DT04', TENDOITUONG: 'Trần Thị Mai Anh', MASODOITUONG: 'DTK0004', FULL_NAME: 'Trần Thị Mai Anh', MASO: 'DTK0004', NGAYSINH: '02/09/1995',
          SODIENTHOAI: '0987 111 222', DIACHIEMAIL: 'maianh.tt@gmail.com', DIACHILIENLAC: 'Phường Quang Trung, TP Thái Nguyên',
          COQUANCONGTAC: '', DIACHICOQUANCONGTAC: '', MASOTHUECANHAN: '', MASOTHUECOQUAN: '', LAHOCVIEN_DOITUONG_ID: 'DHV1', LAHOCVIEN_LOP_ID: 'L2',
          NGANHANG_SOTAIKHOAN: '', NGANHANG_THUOCNGANHANG_ID: '', NGANHANG_THONGTINCHINHANH: '', CCCD: '019195000321', MAQUANHENGANSACH: '' }
    ];

    function khoan(id, hkId, hk, dot, ktId, kt, nd, tien, ht) {
        return { ID: id, DAOTAO_THOIGIANDAOTAO_ID: hkId, DAOTAO_THOIGIANDAOTAO: hk, DAOTAO_THOIGIANDAOTAO_DOT: dot,
            TAICHINH_CACKHOANTHU_ID: ktId, TAICHINH_CACKHOANTHU_TEN: kt, NOIDUNG: nd, SOTIEN: tien, HETHONGCHUNGTU_MA: ht || 'TAICHINH_HETHONGBIENLAI',
            NGAYTAO_DD_MM_YYYY: '05/09/2026', NGUOITAO_TENDAYDU: 'Phạm Thu Hà' };
    }

    var TINHTRANG = {
        rsPhaiNopTongHopChung: [
            khoan('N1', 'TG1', 'Học kỳ 1 2026-2027', '1', 'KT1', 'Học phí', 'Học phí khoá bồi dưỡng nghiệp vụ sư phạm', 4500000),
            khoan('N2', 'TG1', 'Học kỳ 1 2026-2027', '1', 'KT2', 'Lệ phí thi', 'Lệ phí thi cấp chứng chỉ', 350000),
            khoan('N3', 'TG1', 'Học kỳ 1 2026-2027', '1', 'KT3', 'Giáo trình', 'Bộ giáo trình 3 quyển', 285000)
        ],
        rsPhaiNopRieng: [
            khoan('R1', 'TG1', 'Học kỳ 1 2026-2027', '1', 'KT1', 'Học phí', 'Học phí', 4500000),
            khoan('R2', 'TG1', 'Học kỳ 1 2026-2027', '1', 'KT2', 'Lệ phí thi', 'Lệ phí thi', 350000)
        ],
        rsDuThuaChung: [
            khoan('D1', 'TG0', 'Học kỳ 2 2025-2026', '2', 'KT4', 'Ký túc xá', 'Tiền phòng nộp thừa', 600000)
        ],
        rsDuThuaRieng: [
            khoan('DR1', 'TG0', 'Học kỳ 2 2025-2026', '2', 'KT4', 'Ký túc xá', 'Tiền phòng nộp thừa', 600000)
        ],
        rsKhoanPhaiNop_ThuHo: [
            khoan('TH1', 'TG1', 'Học kỳ 1 2026-2027', '1', 'KT5', 'Bảo hiểm y tế', 'Thu hộ BHYT 12 tháng', 884520)
        ],
        rsThongTin: [{ NOCO: -5135000, TONGKHOANPHAINOP: 9635000, TONGKHOANDUOCMIEN: 0, TONGKHOANDANOP: 4500000, TONGKHOANDARUT: 0,
            TONGNORIENG: 4850000, TONGNOCHUNG: 5135000, TONGDURIENG: 600000, TONGDUCHUNG: 600000,
            TONGTIENPHIEUTHU: 5100000, TONGTIENPHIEURUT: 0, TONGTIENHOADON: 1200000 }],
        rsDotCongNo: [{ ID: 'DOT1', TENDOT: '1 — Học kỳ 1 2026-2027' }, { ID: 'DOT2', TENDOT: '2 — Học kỳ 2 2025-2026' }],
        rsTongHopNoTheoDot: [
            { TAICHINH_DOTCONGNO_ID: 'DOT1', DAOTAO_THOIGIANDAOTAO_HOCKY: '1', DAOTAO_THOIGIANDAOTAO_DOT: '1', TAICHINH_CACKHOANTHU_TEN: 'Học phí', NOIDUNG: 'Học phí khoá bồi dưỡng', SOTIEN: 4500000 },
            { TAICHINH_DOTCONGNO_ID: 'DOT1', DAOTAO_THOIGIANDAOTAO_HOCKY: '1', DAOTAO_THOIGIANDAOTAO_DOT: '1', TAICHINH_CACKHOANTHU_TEN: 'Lệ phí thi', NOIDUNG: 'Lệ phí thi', SOTIEN: 350000 }
        ],
        rsTongHopDuTheoDot: [
            { TAICHINH_DOTCONGNO_ID: 'DOT2', DAOTAO_THOIGIANDAOTAO_HOCKY: '2', DAOTAO_THOIGIANDAOTAO_DOT: '2', TAICHINH_CACKHOANTHU_TEN: 'Ký túc xá', NOIDUNG: 'Tiền phòng nộp thừa', SOTIEN: 600000 }
        ]
    };

    function chiTiet(sotien, nd) {
        return [
            khoan('C1', 'TG1', 'Học kỳ 1 2026-2027', '1', 'KT1', 'Học phí', nd || 'Học phí khoá bồi dưỡng', sotien),
            khoan('C2', 'TG1', 'Học kỳ 1 2026-2027', '1', 'KT2', 'Lệ phí thi', 'Lệ phí thi cấp chứng chỉ', 350000)
        ].map(function (r) { r.CHUNGTU_SO = 'BL0001234'; r.HINHTHUCTHU_ID = 'HT1'; return r; });
    }

    var PHIEU = {
        rs: [
            { CHUNGTU_ID: 'CT9001', NOIDUNG: 'Học phí khoá bồi dưỡng nghiệp vụ sư phạm', SOTIENDATHU: 4500000, SOPHIEUTHU: '0001234', QUYENSO: 'Q12',
              MAUSO: 'C45-BB', KYHIEU: 'BL/26', NGAYIN_NGAY: '18', NGAYIN_THANG: '09', NGAYIN_NAM: '2026',
              DAOTAO_COCAUTOCHUC_TEN: 'TRƯỜNG ĐẠI HỌC GIAO THÔNG VẬN TẢI', MA_QHNS: '1054321', NGUOITAO_TENDAYDU: 'Phạm Thu Hà' },
            { CHUNGTU_ID: 'CT9001', NOIDUNG: 'Lệ phí thi cấp chứng chỉ', SOTIENDATHU: 350000 },
            { CHUNGTU_ID: 'CT9001', NOIDUNG: 'Bộ giáo trình 3 quyển', SOTIENDATHU: 285000 }
        ],
        rsThongTinDoiTuong: [{ HODEM: 'Nguyễn Văn', TEN: 'Hùng', MASO: 'DTK0002', DAOTAO_LOPQUANLY_N1_TEN: '', MAUIN_MASO: 'DHGTVT_PHIEUTHU_2018', TINHTRANG: 1 }]
    };

    var HOADON = {
        rs: [
            { CHUNGTU_ID: 'HD7001', TAICHINH_CACKHOANTHU_TEN: 'Học phí', HOCKY: '1', NAMHOC: '2026-2027', SOLUONG: 1, DONGIA: 4500000, SOTIENDATHU: 4500000,
              SOPHIEUTHU: '0000712', MAUSO: '01GTKT0/001', KYHIEU: 'AA/26E', NGAYIN_NGAY: '18', NGAYIN_THANG: '09', NGAYIN_NAM: '2026',
              DAOTAO_COCAUTOCHUC_TEN: 'TRƯỜNG ĐẠI HỌC LUẬT', MASOTHUE: '0100000001', HINHTHUCTHU_TEN: 'Chuyển khoản', NHOTHEM: 'Phạm Thu Hà', LAHOADONDIENTU: 0 },
            { CHUNGTU_ID: 'HD7001', NOIDUNG_INHOADON: 'Lệ phí thi cấp chứng chỉ', SOLUONG: 1, DONGIA: 350000, SOTIENDATHU: 350000 }
        ],
        rsThongTinDoiTuong: [{ HODEM: 'Công ty TNHH', TEN: 'Minh Phát', MASO: 'DTK0001', NOIOHIENNAY: '12 Trần Duy Hưng, Hà Nội', MASOTHUECANHAN: '0106543210',
            MAUIN_MASO: 'HOADONDHLUAT', TINHTRANG: 1, QRCODE: 'HD7001|0106543210|4850000' }]
    };

    function like(rows, q) {
        q = String(q || '').toLowerCase();
        return rows.filter(function (r) { return !q || (r.TENDOITUONG + ' ' + r.MASODOITUONG).toLowerCase().indexOf(q) >= 0; });
    }

    ums.demo.add({
        'PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc_All_DoiTac': function (o) {
            var all = like(DT, o.strTuKhoa);
            var s = (o.pageIndex - 1) * o.pageSize;
            return { rows: all.slice(s, s + o.pageSize), pager: all.length };
        },
        'CM_DanhMucDuLieu/LayDanhSach#QLSV.TRANGTHAI': [
            { ID: 'TT1', MA: 'NORMAL', TEN: 'Đang học' }, { ID: 'TT2', MA: 'RESERVE', TEN: 'Bảo lưu' },
            { ID: 'TT3', MA: 'GRADUATE', TEN: 'Đã tốt nghiệp' }, { ID: 'TT4', MA: 'DROPOUT', TEN: 'Thôi học' }
        ],
        'CM_DanhMucDuLieu/LayDanhSach#TAICHINH.NUTHDDT': [
            { ID: 'NUT1', MA: 'HDDT_VIETTEL', TEN: 'Xuất HĐĐT', THONGTIN1: 'fa fa-cloud-upload', THONGTIN2: '', THONGTIN3: '', THONGTIN4: '' },
            { ID: 'NUT2', MA: 'HDDTNHAP_VIETTEL', TEN: 'Xem bản nháp', THONGTIN1: 'fa fa-file-o', THONGTIN2: 'VIETTEL', THONGTIN3: '', THONGTIN4: '' }
        ],
        'pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTao': [{ ID: 'H1', TENHEDAOTAO: 'Đại học chính quy' }, { ID: 'H2', TENHEDAOTAO: 'Bồi dưỡng ngắn hạn' }],
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_KhoaDaoTao': [{ ID: 'K1', TENKHOA: 'K66' }, { ID: 'K2', TENKHOA: 'K67' }],
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_ToChucCT': [{ ID: 'CT1', TENCHUONGTRINH: 'Công nghệ thông tin' }, { ID: 'CT2', TENCHUONGTRINH: 'Kế toán' }],
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy': [{ ID: 'L1', TEN: 'BDNVSP-K12' }, { ID: 'L2', TEN: 'TA-B1-K05' }],
        'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao': [
            { ID: 'TG0', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 2025-2026' }, { ID: 'TG1', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 2026-2027' }
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLTC.DHV': [{ ID: 'DHV1', MA: 'CN', TEN: 'Cá nhân' }, { ID: 'DHV2', MA: 'DN', TEN: 'Doanh nghiệp cử học' }],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLSV.TNH': [{ ID: 'NH1', MA: 'VCB', TEN: 'Vietcombank' }, { ID: 'NH2', MA: 'TCB', TEN: 'Techcombank' }, { ID: 'NH3', MA: 'BIDV', TEN: 'BIDV' }],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLTC.LTT': [{ ID: 'LT1', MA: 'VND', TEN: 'VND' }, { ID: 'LT2', MA: 'USD', TEN: 'USD' }],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TAICHINH.HOPDONG.PHANLOAI': [{ ID: 'PL1', MA: 'CN', TEN: 'Cá nhân' }, { ID: 'PL2', MA: 'TT', TEN: 'Tập thể' }],
        'TC_ThongTinChung/LayDanhSach': function () { return { rows: TINHTRANG }; },
        'TC_ThongTinChung/LayDSKhoanPhaiNop': function () { return chiTiet(4500000); },
        'TC_ThongTinChung/LayDSKhoanMien': [],
        'TC_ThongTinChung/LayDSKhoanDaNop': function () { return chiTiet(4500000, 'Nộp học phí đợt 1'); },
        'TC_ThongTinChung/LayDSKhoanDaRut': [],
        'TC_ThongTinChung/LayDSKhoanNoRieng': function () { return chiTiet(4500000); },
        'TC_ThongTinChung/LayDSKhoanNoChung': function () { return chiTiet(4500000); },
        'TC_ThongTinChung/LayDSKhoanDuRieng': [],
        'TC_ThongTinChung/LayDSKhoanDuChung': [],
        'TC_ThongTinChung/LayDSPhieuDaThu': [
            { ID: 'P1', SOPHIEUTHU: '0001234', TONGTIEN: 5135000, NGAYTHU_DD_MM_YYYY_HHMMSS: '18/09/2026 09:12:44', TAIKHOAN_NGUOITHU: 'hapt' }
        ],
        'TC_ThongTinChung/LayDSPhieuDaRut': [],
        'TC_ThongTinChung/LayDSPhieuHoaDon': [
            { ID: 'H1', SOHOADON: '0000712', TONGTIEN: 4850000, NGAYTHU_DD_MM_YYYY_HHMMSS: '10/09/2026 14:03:10', TAIKHOAN_NGUOITHU: 'hapt' }
        ],
        'TC_ThongTinChung/DocSoThanhChu': function (o) { return { rows: '(máy chủ đọc số ' + o.dSoTien + ' ' + o.strLoaiTien + ')' }; },
        'TC_PhieuThu/LayTTPhieuThu_Rut': function () { return { rows: PHIEU }; },
        'TC_HoaDon/LayTTHoaDonThu_Rut': function () { return { rows: HOADON }; },
        'TC_NguoiHoc_QuanLy/LayDSHopDong': [{ ID: 'HD1', SOHOPDONG: 'HĐ-2026/015' }],
        'TC_NguoiHoc_QuanLy/LayDanhSach': [
            { QLSV_NGUOIHOC_ID: 'SV1', QLSV_NGUOIHOC_MASO: 'BIT220263', QLSV_NGUOIHOC_HOTEN: 'Lê Minh Quân', PHANLOAI_TEN: 'Cá nhân', TONGTIENDAPHANBO: 0 },
            { QLSV_NGUOIHOC_ID: 'SV2', QLSV_NGUOIHOC_MASO: 'BIT220281', QLSV_NGUOIHOC_HOTEN: 'Đỗ Thu Trang', PHANLOAI_TEN: 'Tập thể', TONGTIENDAPHANBO: 1500000 }
        ]
    });
})();
