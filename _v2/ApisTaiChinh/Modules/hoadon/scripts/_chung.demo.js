/* Dữ liệu mẫu cho xuathoadon / xuatchungtu / xuathoadonkhac — chỉ dùng ở chế độ dựng thử.
   ID khoản thu dài 32 ký tự: bản gốc chỉ nhận khoản tách có ID đúng 32 ký tự. */
(function () {
    var KT = {
        HP: 'A1B2C3D4E5F60718293A4B5C6D7E8F90',
        BH: 'B2C3D4E5F60718293A4B5C6D7E8F90A1',
        KTX: 'C3D4E5F60718293A4B5C6D7E8F90A1B2',
        LP: 'D4E5F60718293A4B5C6D7E8F90A1B2C3'
    };
    var SV = [
        { ID: 'NH01', QLSV_NGUOIHOC_ID: 'QL01', HODEM: 'Nguyễn Văn', TEN: 'An', MASO: 'DTC225200101', TTLL_DIENTHOAICANHAN: '0912345678',
          QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học', QLSV_TRANGTHAINGUOIHOC_MA: 'NORMAL', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT01' },
        { ID: 'NH02', QLSV_NGUOIHOC_ID: 'QL02', HODEM: 'Trần Thị', TEN: 'Bình', MASO: 'DTC225200102', TTLL_DIENTHOAICANHAN: '0987654321',
          QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học', QLSV_TRANGTHAINGUOIHOC_MA: 'NORMAL', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT01' },
        { ID: 'NH03', QLSV_NGUOIHOC_ID: 'QL03', HODEM: 'Lê Hoàng', TEN: 'Cường', MASO: 'DTC225200103', TTLL_DIENTHOAICANHAN: '',
          QLSV_TRANGTHAINGUOIHOC_TEN: 'Bảo lưu', QLSV_TRANGTHAINGUOIHOC_MA: 'RESERVE', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT02' },
        { ID: 'NH04', QLSV_NGUOIHOC_ID: 'QL04', HODEM: 'Phạm Minh', TEN: 'Đức', MASO: 'DTC225200104', TTLL_DIENTHOAICANHAN: '0904111222',
          QLSV_TRANGTHAINGUOIHOC_TEN: 'Cảnh báo học vụ', QLSV_TRANGTHAINGUOIHOC_MA: 'CANHBAO', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT02' }
    ];

    function chua(qlId) {
        return [
            { ID: qlId + 'DN1', TAICHINH_CACKHOANTHU_ID: KT.HP, TAICHINH_CACKHOANTHU_TEN: 'Học phí', DAOTAO_THOIGIANDAOTAO: 'HK1 2025-2026',
              DAOTAO_THOIGIANDAOTAO_ID: 'TG1', DAOTAO_THOIGIANDAOTAO_DOT: 1, NOIDUNG: 'Học phí học kỳ 1 năm học 2025-2026', SOTIEN: 8250000,
              NGAYTAO_DD_MM_YYYY: '12/09/2025', HETHONGCHUNGTU_MA: 'TAICHINH_HOADON', HINHTHUCTHU_ID: 'HT2', DONVITINH_ID: 'DV1', LOAITIENTE_ID: 'LT1',
              HINHTHUCTHU_MA: 'CK', HINHTHUCTHU_TEN: 'Chuyển khoản', DONVITINH_TEN: 'Học kỳ', LOAITIENTE_MA: 'VND' },
            { ID: qlId + 'DN2', TAICHINH_CACKHOANTHU_ID: KT.BH, TAICHINH_CACKHOANTHU_TEN: 'Bảo hiểm y tế', DAOTAO_THOIGIANDAOTAO: 'HK1 2025-2026',
              DAOTAO_THOIGIANDAOTAO_ID: 'TG1', DAOTAO_THOIGIANDAOTAO_DOT: 1, NOIDUNG: 'BHYT 12 tháng', SOTIEN: 1263600,
              NGAYTAO_DD_MM_YYYY: '12/09/2025', HETHONGCHUNGTU_MA: 'TAICHINH_HOADON', HINHTHUCTHU_ID: 'HT2', DONVITINH_ID: 'DV2', LOAITIENTE_ID: 'LT1',
              HINHTHUCTHU_MA: 'CK', HINHTHUCTHU_TEN: 'Chuyển khoản', DONVITINH_TEN: 'Năm', LOAITIENTE_MA: 'VND' },
            { ID: qlId + 'DN3', TAICHINH_CACKHOANTHU_ID: KT.KTX, TAICHINH_CACKHOANTHU_TEN: 'Phí ký túc xá', DAOTAO_THOIGIANDAOTAO: 'HK1 2025-2026',
              DAOTAO_THOIGIANDAOTAO_ID: 'TG1', DAOTAO_THOIGIANDAOTAO_DOT: 2, NOIDUNG: null, SOTIEN: 1500000,
              NGAYTAO_DD_MM_YYYY: '03/10/2025', HETHONGCHUNGTU_MA: 'TAICHINH_HOADON', HINHTHUCTHU_ID: 'HT1', DONVITINH_ID: 'DV1', LOAITIENTE_ID: 'LT1',
              HINHTHUCTHU_MA: 'TM', HINHTHUCTHU_TEN: 'Tiền mặt', DONVITINH_TEN: 'Học kỳ', LOAITIENTE_MA: 'VND' },
            { ID: qlId + 'DN4', TAICHINH_CACKHOANTHU_ID: KT.LP, TAICHINH_CACKHOANTHU_TEN: 'Lệ phí thi lại', DAOTAO_THOIGIANDAOTAO: 'HK2 2024-2025',
              DAOTAO_THOIGIANDAOTAO_ID: 'TG0', DAOTAO_THOIGIANDAOTAO_DOT: 1, NOIDUNG: 'Thi lại Giải tích 1', SOTIEN: 90000,
              NGAYTAO_DD_MM_YYYY: '20/06/2025', HETHONGCHUNGTU_MA: 'TAICHINH_HETHONGBIENLAI', HINHTHUCTHU_ID: 'HT1', DONVITINH_ID: 'DV3', LOAITIENTE_ID: 'LT1',
              HINHTHUCTHU_MA: 'TM', HINHTHUCTHU_TEN: 'Tiền mặt', DONVITINH_TEN: 'Lần', LOAITIENTE_MA: 'VND' }
        ];
    }

    function daXuat() {
        return [
            { CHUNGTU_SO: '0000125', CHUNGTU_ID: 'HD125', DAOTAO_THOIGIANDAOTAO: 'HK2 2024-2025', DAOTAO_THOIGIANDAOTAO_DOT: 1,
              TAICHINH_CACKHOANTHU_TEN: 'Học phí', NOIDUNG: 'Học phí học kỳ 2 năm học 2024-2025', SOTIEN: 7800000,
              NGUOITAO_TENDAYDU: 'Hoàng Thu Trang', NGAYTAO_DD_MM_YYYY_HHMMSS: '15/02/2025 09:12:44' },
            { CHUNGTU_SO: '0000125', CHUNGTU_ID: 'HD125', DAOTAO_THOIGIANDAOTAO: 'HK2 2024-2025', DAOTAO_THOIGIANDAOTAO_DOT: 1,
              TAICHINH_CACKHOANTHU_TEN: 'Lệ phí thư viện', NOIDUNG: 'Lệ phí thư viện', SOTIEN: 50000,
              NGUOITAO_TENDAYDU: 'Hoàng Thu Trang', NGAYTAO_DD_MM_YYYY_HHMMSS: '15/02/2025 09:12:44' }
        ];
    }

    function thongTin(sv) {
        return {
            MASO: sv.MASO, HODEM: sv.HODEM, TEN: sv.TEN, NGAYSINH: '14/03/2004', MASOTHUECANHAN: '',
            NOIOHIENNAY: 'Phường Tân Thịnh, TP Thái Nguyên', DAOTAO_LOPQUANLY_N1_TEN: 'CNTT K22A',
            NGANHHOC_N1_TEN: 'Công nghệ thông tin', KHOAHOC_N1_TEN: 'K22',
            NOCO: -1500000, TONGKHOANDUOCMIEN: 1200000, TONGKHOANDANOP: 18953600, TONGTIENPHIEUTHU: 11103600, TONGNOCHUNG: 1500000
        };
    }

    ums.demo.add({
        'PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc_All': function (o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            var list = SV.filter(function (s) { return !q || (s.HODEM + ' ' + s.TEN + ' ' + s.MASO).toLowerCase().indexOf(q) >= 0; });
            return { rows: list, pager: list.length };
        },
        'TC_ThongTinChung/LayDanhSach': function (o) {
            var sv = SV.find(function (s) { return s.QLSV_NGUOIHOC_ID === o.strQLSV_NguoiHoc_Id; }) ||
                { MASO: 'DT-KH01', HODEM: 'Công ty TNHH', TEN: 'Hoà Bình', ID: o.strQLSV_NguoiHoc_Id };
            return {
                rsKhoanDaNopChuaXuatHoaDon: chua(o.strQLSV_NguoiHoc_Id),
                rsKhoanDaNopDaXuatHoaDon: daXuat(),
                rsThongTin: [thongTin(sv)]
            };
        },
        'TC_ThongTinChung/LayDSKhoanMien': [
            { DAOTAO_THOIGIANDAOTAO: 'HK1 2025-2026', DAOTAO_THOIGIANDAOTAO_DOT: 1, TAICHINH_CACKHOANTHU_TEN: 'Học phí', NOIDUNG: 'Miễn giảm 50% đối tượng chính sách',
              SOTIEN: 1200000, NGAYTAO_DD_MM_YYYY: '01/09/2025', NGUOITAO_TENDAYDU: 'Hoàng Thu Trang' }
        ],
        'TC_ThongTinChung/LayDSKhoanDaNop': [
            { DAOTAO_THOIGIANDAOTAO: 'HK1 2025-2026', DAOTAO_THOIGIANDAOTAO_DOT: 1, TAICHINH_CACKHOANTHU_TEN: 'Học phí', NOIDUNG: 'Học phí HK1',
              SOTIEN: 8250000, NGAYTAO_DD_MM_YYYY: '12/09/2025', NGUOITAO_TENDAYDU: 'Hoàng Thu Trang' },
            { DAOTAO_THOIGIANDAOTAO: 'HK1 2025-2026', DAOTAO_THOIGIANDAOTAO_DOT: 1, TAICHINH_CACKHOANTHU_TEN: 'Bảo hiểm y tế', NOIDUNG: 'BHYT 12 tháng',
              SOTIEN: 1263600, NGAYTAO_DD_MM_YYYY: '12/09/2025', NGUOITAO_TENDAYDU: 'Hoàng Thu Trang' }
        ],
        'TC_ThongTinChung/LayDSKhoanNoChung': [
            { DAOTAO_THOIGIANDAOTAO: 'HK1 2025-2026', DAOTAO_THOIGIANDAOTAO_DOT: 2, TAICHINH_CACKHOANTHU_TEN: 'Phí ký túc xá', NOIDUNG: 'KTX tháng 10-12',
              SOTIEN: 1500000, NGAYTAO_DD_MM_YYYY: '03/10/2025', NGUOITAO_TENDAYDU: 'Hệ thống' }
        ],
        'TC_ThongTinChung/LayDSPhieuDaThu': [
            { SOPHIEUTHU: 'PT-00412', TONGTIEN: 9513600, NGAYTHU_DD_MM_YYYY_HHMMSS: '12/09/2025 10:02:11', TENDAYDU_NGUOITHU: 'Hoàng Thu Trang' },
            { SOPHIEUTHU: 'PT-00519', TONGTIEN: 1590000, NGAYTHU_DD_MM_YYYY_HHMMSS: '03/10/2025 14:25:37', TENDAYDU_NGUOITHU: 'Đỗ Văn Nam' }
        ],
        'TC_KhoanThu/LayDanhSach': [
            { ID: KT.HP, TEN: 'Học phí' }, { ID: KT.BH, TEN: 'Bảo hiểm y tế' },
            { ID: KT.KTX, TEN: 'Phí ký túc xá' }, { ID: KT.LP, TEN: 'Lệ phí thi lại' },
            { ID: 'E5F60718293A4B5C6D7E8F90A1B2C3D4', TEN: 'Phí giáo trình' }, { ID: 'F60718293A4B5C6D7E8F90A1B2C3D4E5', TEN: 'Phí đồng phục' }
        ],
        'CM_DanhMucDuLieu/LayDanhSach#QLSV.TRANGTHAI': [
            { ID: 'TT1', TEN: 'Đang học' }, { ID: 'TT2', TEN: 'Bảo lưu' }, { ID: 'TT3', TEN: 'Cảnh báo học vụ' }, { ID: 'TT4', TEN: 'Đã tốt nghiệp' }
        ],
        'CM_DanhMucDuLieu/LayDanhSach#TAICHINH.NUTHDDT': [
            { ID: 'N1', MA: 'HDDTNHAP_VNPT', TEN: 'Xem bản nháp', THONGTIN1: 'fa fa-eye', THONGTIN2: '', THONGTIN4: '' },
            { ID: 'N2', MA: 'HDDT_VNPT', TEN: 'Xuất HĐĐT (VNPT)', THONGTIN1: 'fa fa-paper-plane', THONGTIN2: '', THONGTIN4: '' }
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLTC.HTTHU': [
            { ID: 'HT1', MA: 'TM', TEN: 'Tiền mặt', THONGTIN1: null }, { ID: 'HT2', MA: 'CK', TEN: 'Chuyển khoản', THONGTIN1: 'TM/CK' }
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TAICHINH.DVT': [
            { ID: 'DV1', MA: 'HK', TEN: 'Học kỳ' }, { ID: 'DV2', MA: 'NAM', TEN: 'Năm' }, { ID: 'DV3', MA: 'LAN', TEN: 'Lần' }
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLTC.LTT': [
            { ID: 'LT1', MA: 'VND', TEN: 'Việt Nam đồng' }, { ID: 'LT2', MA: 'USD', TEN: 'Đô la Mỹ' }
        ],
        'pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTao': [{ ID: 'HE1', TENHEDAOTAO: 'Đại học chính quy' }, { ID: 'HE2', TENHEDAOTAO: 'Vừa làm vừa học' }],
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_KhoaDaoTao': [{ ID: 'KH22', TENKHOA: 'K22' }, { ID: 'KH23', TENKHOA: 'K23' }],
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_ToChucCT': [{ ID: 'CT01', TENCHUONGTRINH: 'Công nghệ thông tin' }, { ID: 'CT02', TENCHUONGTRINH: 'Kỹ thuật phần mềm' }],
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy': [{ ID: 'L1', TEN: 'CNTT K22A' }, { ID: 'L2', TEN: 'CNTT K22B' }],
        'HDDT_HoaDon/ThemMoi': { rows: null, message: '' },
        'HDDT_HoaDon/ThemMoi_Nhap': { rows: 'HDDTFILE/nhap-demo.pdf', message: '' },
        'TC_HoaDon/LayTTHoaDonThu_Rut': function (o) {
            return {
                rs: [
                    { CHUNGTU_ID: o.strHoaDonThu_Rut_Id, TENPHIEU: 'Hoá đơn bán hàng', MAUSO: '2/001', KYHIEU: 'C25TAA', SOPHIEUTHU: '0000125',
                      NGAYIN_NGAY: '15', NGAYIN_THANG: '02', NGAYIN_NAM: '2025', DAOTAO_COCAUTOCHUC_TEN: 'Trường Đại học Công nghệ Thông tin và Truyền thông',
                      MASOTHUE: '4600399999', DIACHI: 'Đường Z115, Quyết Thắng, TP Thái Nguyên', SODIENTHOAI: '0208 3846 254',
                      HINHTHUCTHU_TEN: 'Chuyển khoản', NOIDUNG: 'Học phí học kỳ 2 năm học 2024-2025', SOTIENDATHU: 7800000,
                      NGUOITAO_TENDAYDU: 'Hoàng Thu Trang', LAHOADONDIENTU: o.strHoaDonThu_Rut_Id === 'SHD2' ? 1 : 0,
                      DUONGDANFILEHOADON: o.strHoaDonThu_Rut_Id === 'SHD2' ? 'HDDTFILE/0000132.pdf' : null, TRACSECTION_ID: 'TX-7001', SOHOADON: '0000132' },
                    { CHUNGTU_ID: o.strHoaDonThu_Rut_Id, NOIDUNG: 'Lệ phí thư viện', SOTIENDATHU: 50000 }
                ],
                rsThongTinDoiTuong: [{ HODEM: 'Nguyễn Văn', TEN: 'An', MASO: 'DTC225200101', DAOTAO_LOPQUANLY_N1_TEN: 'CNTT K22A',
                    NGANHHOC_N1_TEN: 'Công nghệ thông tin', MASOTHUECANHAN: '', TINHTRANG: o.strHoaDonThu_Rut_Id === 'SHD3' ? -1 : 1, MAUIN_MASO: 'HOADONDHLUAT' }]
            };
        }
    });
})();
