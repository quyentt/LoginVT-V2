/* Dữ liệu mẫu cho Kế hoạch đăng ký — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function dm(id, ma, ten, bang) { return { ID: id, MA: ma, TEN: ten, CHUNG_TENDANHMUC_MA: bang, CHUNG_TENDANHMUC_TEN: '' }; }

    function kh(id, ma, ten, o) {
        var r = {
            ID: id, MAKEHOACH: ma, TENKEHOACH: ten, MOTA: 'Đăng ký học phần cho sinh viên đại học chính quy',
            DAOTAO_THOIGIANDAOTAO_NAM_ID: 'NAM2526', DAOTAO_THOIGIANDAOTAO_KY_ID: 'HK1_2526', DAOTAO_THOIGIANDAOTAO_DOT_ID: 'DOT1_HK1',
            NGAYBATDAU: '04/08/2025', GIODANGKYTRONGNGAYDAU: 8, PHUTDANGKYTRONGNGAYDAU: 0,
            NGAYKETTHUC: '17/08/2025', GIOKETTHUCTRONGNGAYCUOI: 17, PHUTKETTHUCTRONGNGAYCUOI: 30,
            TRANGTHAI_ID: 'CD3', TRANGTHAI_TEN: 'Chỉ mở cho sinh viên đăng ký',
            MOHINHDANGKY_ID: 'MH2', MOHINHDANGKY_TEN: 'Đăng ký trực tiếp',
            SOLUONGDUKIEN: 1250, SOLUONGDADANGKY: 1102, SOLUONGKHONGDANGKY: 148, TYLE: '88,16%',
            HIEULUC: 1, HIENTHITHONGTINGIANGVIEN: 1, KIEMTRATAICHINH: 1, HIENTHIDONGIAHOCPHI: 1, TINHPHITUDONG: 1, TINHPHITUDONGKHIXACNHAN: 0,
            QUYDINHKIEMTRAHOCPHI_ID: 'KTHP1', SOHOCPHINOTOIDACHOPHEP: 0,
            CHOPHEPNGUOCHOCHUYHOCPHAN: 0, KHONGCHOPHEPCOVANDANGKY: 1, SONGAYDUOCPHEPRUTHOCPHAN: 14, NGAYBATDAUTINHRUTHOCPHAN: '08/09/2025',
            KIEMTRASOTINCHITOIDA: 1, SOTINCHITOIDA: 25, SOTINCHITOIDAN2: 10, KIEMTRASOTINCHITOITHIEU: 1, SOTINCHITOITHIEU: 14, SOTINCHITOITHIEUN2: '',
            QUYDINHTINCHITOIDA_ID: 'QDTC1', QUYDINHTINCHITOIDA_PHAMVI_ID: 'PV1',
            KIEMTRATRUNGLICH: 1, KIEMTRATRUNGLOPKHONGXEP: 0, KIEMTRATRUNGTHOIGIAN_ID: 'PVTL1', DANGKYTHEOTOHOPQUYDINH_ID: 'TH2',
            PHANTRAMDANGKYVUOTQUYDINH: 10, CHOPHEPDANGKYNGOAICHUONGTRINH: 0, CHOPHEPDANGKYHPTUONGDUONG: 1, KHONGCHOPHEPDOILOPHOCPHAN: 0,
            CHIDANGKYMOTLANTRONGKY: 1, KIEMTRARANGBUOCHOCPHAN: 1, KIEMTRADINHHUONGHOCTAP: 0,
            APDUNGLUUBANGTAMHOCPHAN: 1, APDUNGLUUBANGTAMTAICHINH: null, APDUNGLUUBANGTAMLOPHOCPHAN: 1,
            NGAYBATDAUXACNHAN: '18/08/2025', NGAYKETTHUCXACNHAN: '22/08/2025',
            KIEUHOC_IDS: 'KH1,KH2', KIEUHOCLAI_PHANLOAI_ID: 'HL1', TRANGTHAISINHVIEN_IDS: 'TT1', DSNGUYENVONGLUACHON_ID: 'NV1',
            QUYDINHDANGKYNANGDIEM_ID: 'ND1', MUCDIEMCHUHE4_NANGDIEM: 'DC3', PHANLOAIDOTDANGKY_ID: 'PLD1',
            MOHINHUUTIENDADKNGUYENVONG_ID: 'UT1', KIEMTRADANGKYSOTINCUAKHOITC_ID: 'KTV1', SOGIAYCHO: 5
        };
        Object.keys(o || {}).forEach(function (k) { r[k] = o[k]; });
        return r;
    }
    var KH = [
        kh('KH01', 'DKH-2526-HK1-D1', 'Đăng ký học kỳ 1 năm học 2025-2026 (đợt 1)'),
        kh('KH02', 'DKH-2526-HK1-D2', 'Đăng ký bổ sung học kỳ 1 năm học 2025-2026', {
            DAOTAO_THOIGIANDAOTAO_DOT_ID: 'DOT2_HK1', NGAYBATDAU: '25/08/2025', NGAYKETTHUC: '31/08/2025',
            TRANGTHAI_ID: 'CD2', TRANGTHAI_TEN: 'Chỉ mở cho cán bộ đăng ký', MOHINHDANGKY_ID: 'MH1', MOHINHDANGKY_TEN: 'Hàng đợi',
            SOLUONGDUKIEN: 420, SOLUONGDADANGKY: 215, SOLUONGKHONGDANGKY: 205, TYLE: '51,19%', HIEULUC: 0, KIEMTRATAICHINH: 0,
            KIEUHOC_IDS: 'KH2,KH3', TRANGTHAISINHVIEN_IDS: 'TT1,TT2', PHANLOAIDOTDANGKY_ID: 'PLD2'
        }),
        kh('KH03', 'DKH-2425-HE', 'Đăng ký học kỳ hè năm học 2024-2025', {
            DAOTAO_THOIGIANDAOTAO_NAM_ID: 'NAM2425', DAOTAO_THOIGIANDAOTAO_KY_ID: 'HE_2425', DAOTAO_THOIGIANDAOTAO_DOT_ID: '',
            NGAYBATDAU: '02/06/2025', NGAYKETTHUC: '08/06/2025', TRANGTHAI_ID: 'CD1', TRANGTHAI_TEN: 'Khóa không cho đăng ký',
            SOLUONGDUKIEN: 310, SOLUONGDADANGKY: 287, SOLUONGKHONGDANGKY: 23, TYLE: '92,58%', KIEUHOC_IDS: 'KH2', TRANGTHAISINHVIEN_IDS: ''
        }),
        kh('KH04', 'DKH-2425-HK2', 'Đăng ký học kỳ 2 năm học 2024-2025', {
            DAOTAO_THOIGIANDAOTAO_NAM_ID: 'NAM2425', DAOTAO_THOIGIANDAOTAO_KY_ID: 'HK2_2425', DAOTAO_THOIGIANDAOTAO_DOT_ID: '',
            NGAYBATDAU: '06/01/2025', NGAYKETTHUC: '19/01/2025', SOLUONGDUKIEN: 1198, SOLUONGDADANGKY: 1164, SOLUONGKHONGDANGKY: 34, TYLE: '97,16%'
        })
    ];

    var HOCKY = [
        { ID: 'HK1_2526', DAOTAO_NAM_ID: 'NAM2526', HOCKY: 'Học kỳ 1 (2025-2026)' },
        { ID: 'HK2_2526', DAOTAO_NAM_ID: 'NAM2526', HOCKY: 'Học kỳ 2 (2025-2026)' },
        { ID: 'T8_2526', DAOTAO_NAM_ID: 'NAM2526', HOCKY: 'Học kỳ 1 (2025-2026)', THANG: 8 },
        { ID: 'HK2_2425', DAOTAO_NAM_ID: 'NAM2425', HOCKY: 'Học kỳ 2 (2024-2025)' },
        { ID: 'HE_2425', DAOTAO_NAM_ID: 'NAM2425', HOCKY: 'Học kỳ hè (2024-2025)' }
    ];
    var DOT = {
        HK1_2526: [{ ID: 'DOT1_HK1', DOTHOC: 'Đợt 1' }, { ID: 'DOT2_HK1', DOTHOC: 'Đợt 2' }],
        HK2_2526: [{ ID: 'DOT1_HK2', DOTHOC: 'Đợt 1' }]
    };

    ums.demo.add({
        'DKH_KeHoachDangKy/LayDanhSach': function (o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            var ds = KH.filter(function (r) { return !q || (r.MAKEHOACH + ' ' + r.TENKEHOACH).toLowerCase().indexOf(q) >= 0; });
            var s = Number(o.pageSize) || 10, p = Number(o.pageIndex) || 1;
            return { rows: ds.slice((p - 1) * s, p * s), pager: ds.length };
        },
        'pkg_dangkyhoc_chung2.Them_DangKy_KeHoachDangKy': { rows: [], raw: { Id: 'KH99' } },
        'pkg_dangkyhoc_chung2.Sua_DangKy_KeHoachDangKy': [],
        'KHCT_NamHoc/LayDanhSach': [{ ID: 'NAM2526', NAMHOC: '2025-2026' }, { ID: 'NAM2425', NAMHOC: '2024-2025' }],
        'KHCT_ThoiGianDaoTao/LayDanhSach': function (o) {
            return HOCKY.filter(function (r) { return !o.strDAOTAO_NAM_Id || r.DAOTAO_NAM_ID === o.strDAOTAO_NAM_Id; });
        },
        'KHCT_DotHoc/LayDanhSach_RutGon': function (o) { return DOT[o.strDaoTao_HocKy_Id] || []; },
        'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao': [
            { ID: 'NAM2526', DAOTAO_THOIGIANDAOTAO: 'Năm học 2025-2026' },
            { ID: 'HK1_2526', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm 2025-2026' },
            { ID: 'DOT2_HK1', DAOTAO_THOIGIANDAOTAO: 'Đợt 2 - Học kỳ 1 năm 2025-2026' },
            { ID: 'HK2_2425', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 năm 2024-2025' },
            { ID: 'HE_2425', DAOTAO_THOIGIANDAOTAO: 'Học kỳ hè năm 2024-2025' }
        ],
        'DKH_Chung/LayDSKeHoachDKNV': [
            { ID: 'NV1', MA: 'NV-2526-HK1', TEN: 'Nguyện vọng học kỳ 1 năm 2025-2026' },
            { ID: 'NV2', MA: 'NV-2526-HK1-BS', TEN: 'Nguyện vọng bổ sung học kỳ 1 năm 2025-2026' }
        ],

        // Danh mục của biểu mẫu
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DANGKY.MOHINH': [dm('MH1', 'HangDoi', 'Hàng đợi', 'DANGKY.MOHINH'), dm('MH2', 'DangKyTrucTiep', 'Đăng ký trực tiếp', 'DANGKY.MOHINH')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KHDT.DIEM.KIEUHOC': [dm('KH1', 'HocDi', 'Dành cho học đi'), dm('KH2', 'HocLai', 'Dành cho học lại'), dm('KH3', 'HocNangDiem', 'Dành cho học nâng điểm')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DANGKY.KIEUHOCLAI.PHANLOAI': [dm('HL1', 'TRUOT', 'Học lại do trượt'), dm('HL2', 'CAMTHI', 'Học lại do cấm thi'), dm('HL3', 'CHUAHOC', 'Học lại do chưa học')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DANGKY.CHEDO': [dm('CD1', '1', 'Khóa không cho đăng ký'), dm('CD2', '2', 'Chỉ mở cho cán bộ đăng ký'), dm('CD3', '3', 'Chỉ mở cho sinh viên đăng ký')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DANGKY.QUYDINHVETINCHITOIDA': [
            dm('QDTC1', '1', 'Xét riêng theo số tín chỉ N1 và N2'),
            dm('QDTC2', '2', 'Số tín chỉ của N1 không được vượt của N1, số tín chỉ của N2 có thể vượt của N2. Số tín chỉ chung không được vượt tối đa của N1 và N2'),
            dm('QDTC3', '3', 'Cho phép đăng ký mở rộng cả N1 và N2 nhưng tổng số tín chỉ đăng ký không vượt số tối đa N1 và N2')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DANGKY.QUYDINHVETINCHITOIDA.PHAMVI': [dm('PV1', 'KY', 'Theo học kỳ'), dm('PV2', 'DOT', 'Theo đợt đăng ký')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DANGKY.PHAMVIKIEMTRATRUNGTHOIGIAN': [
            dm('PVTL1', '1', 'Mặc định là kiểm tra trong kế hoạch hiện hành'), dm('PVTL2', '2', 'Kiểm tra trong cả học kỳ (bao gồm tất cả các đợt trong kỳ)'), dm('PVTL3', '3', 'Kiểm tra toàn bộ dữ liệu')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DANGKY.TOHOPQUYDINH': [
            dm('TH1', '1', 'Sinh viên đăng ký theo tổ hợp lớp học phần quy định'),
            dm('TH2', '2', 'Sinh viên có thể lựa chọn bất kỳ lớp học phần nào miễn đảm bảo đủ tổ hợp theo quy định'),
            dm('TH3', '3', 'Sinh viên không bị bắt buộc chọn đủ tổ hợp')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DANGKY.QUYDINHVENANGDIEM': [dm('ND1', 'DUOI', 'Chỉ được đăng ký học phần có điểm dưới mức quy định'), dm('ND2', 'TATCA', 'Được đăng ký mọi học phần đã đạt')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DANGKY.QUYDINHKIEMTRAHOCPHI': [dm('KTHP1', 'KYTRUOC', 'Kiểm tra nợ học phí các kỳ trước'), dm('KTHP2', 'TOANKHOA', 'Kiểm tra nợ học phí toàn khóa')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DIEM.DIEMCHU': [dm('DC1', 'D', 'D'), dm('DC2', 'D+', 'D+'), dm('DC3', 'C', 'C'), dm('DC4', 'C+', 'C+')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DANGKY.PHANLOAIDOT': [dm('PLD1', 'CHINH', 'Đợt chính'), dm('PLD2', 'BOSUNG', 'Đợt bổ sung')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DANGKY.MOHINHUTDANGKYNGUYENVONG': [dm('UT1', 'UUTIEN', 'Ưu tiên sinh viên đã đăng ký nguyện vọng'), dm('UT2', 'KHONG', 'Không ưu tiên')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DANGKY.SOTINCHI.KHOIKT.TUCHON': [dm('KTV1', 'CO', 'Có kiểm tra vượt số tín chỉ khối tự chọn'), dm('KTV2', 'KHONG', 'Không kiểm tra')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DANGKY.QUYDINH.LOP.XULYDACTHU': [dm('XL1', 'BOQUASISO', 'Bỏ qua kiểm tra sĩ số'), dm('XL2', 'BOQUATRUNGLICH', 'Bỏ qua kiểm tra trùng lịch'), dm('XL3', 'CHIDANHCHOLOPRIENG', 'Chỉ cho sinh viên lớp riêng')],

        // Hộp danh sách đăng ký / không đăng ký
        'DKH_KeHoachDangKy/LayDSNguoiHocDangKy_KeHoach': [
            { QLSV_NGUOIHOC_MASO: 'BIT220263', QLSV_NGUOIHOC_HODEM: 'Nguyễn Văn', QLSV_NGUOIHOC_TEN: 'An', QLSV_NGUOIHOC_NGAYSINH: '12/03/2004', DANGKY_LOPHOCPHAN_MA: 'IT3100.01', DANGKY_LOPHOCPHAN_TEN: 'Lập trình hướng đối tượng - 01', DAOTAO_LOPQUANLY_TEN: 'K67-KTPM1', KIEUHOC_TEN: 'Học đi', DAOTAO_HOCPHAN_HOCTRINH: 3 },
            { QLSV_NGUOIHOC_MASO: 'BIT220102', QLSV_NGUOIHOC_HODEM: 'Trần Thị', QLSV_NGUOIHOC_TEN: 'Bình', QLSV_NGUOIHOC_NGAYSINH: '05/07/2004', DANGKY_LOPHOCPHAN_MA: 'IT3100.01', DANGKY_LOPHOCPHAN_TEN: 'Lập trình hướng đối tượng - 01', DAOTAO_LOPQUANLY_TEN: 'K67-KTPM1', KIEUHOC_TEN: 'Học đi', DAOTAO_HOCPHAN_HOCTRINH: 3 },
            { QLSV_NGUOIHOC_MASO: 'BBA220561', QLSV_NGUOIHOC_HODEM: 'Lê Minh', QLSV_NGUOIHOC_TEN: 'Châu', QLSV_NGUOIHOC_NGAYSINH: '21/11/2004', DANGKY_LOPHOCPHAN_MA: 'EM1010.02', DANGKY_LOPHOCPHAN_TEN: 'Quản trị học - 02', DAOTAO_LOPQUANLY_TEN: 'K67-QTKD2', KIEUHOC_TEN: 'Học lại', DAOTAO_HOCPHAN_HOCTRINH: 2 }
        ],
        'DKH_BaoCao/LayDSKhongDangKy': [
            { QLSV_NGUOIHOC_MASO: 'BIT230210', QLSV_NGUOIHOC_HODEM: 'Phạm Thu', QLSV_NGUOIHOC_TEN: 'Dung', QLSV_TRANGTHAI_TEN: 'Đang học', TONGNOPHI: 4250000, DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Hệ thống thông tin', DAOTAO_LOPQUANLY_TEN: 'K68-HTTT1', DAOTAO_KHOADAOTAO_TEN: 'Khóa 68' },
            { QLSV_NGUOIHOC_MASO: 'BBA220588', QLSV_NGUOIHOC_HODEM: 'Đỗ Quang', QLSV_NGUOIHOC_TEN: 'Huy', QLSV_TRANGTHAI_TEN: 'Bảo lưu', TONGNOPHI: 0, DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Quản trị kinh doanh', DAOTAO_LOPQUANLY_TEN: 'K67-QTKD2', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67' }
        ],

        // Hộp phân công
        'PKG_DANGKYHOC_THONGTIN2.LayDSKhoaDaoTao': function (o) {
            return o.strDaoTao_HeDaoTao_Id ? [{ ID: 'K67', MAKHOA: 'K67', TENKHOA: 'Khóa 67' }, { ID: 'K68', MAKHOA: 'K68', TENKHOA: 'Khóa 68' }, { ID: 'K69', MAKHOA: 'K69', TENKHOA: 'Khóa 69' }] : [];
        },
        'PKG_DANGKYHOC_THONGTIN2.LayDSChuongTrinh': function (o) {
            return o.strDaoTao_KhoaDaoTao_Id ? [{ ID: 'CTKTPM', MACHUONGTRINH: '7480103', TENCHUONGTRINH: 'Kỹ thuật phần mềm' }, { ID: 'CTHTTT', MACHUONGTRINH: '7480104', TENCHUONGTRINH: 'Hệ thống thông tin' }] : [];
        },

        // Vùng phân quyền cán bộ
        'DKH_KeHoach_NhanSu/LayDSDangKy_KeHoach_NhanSu': [
            { ID: 'PQ1', NGUOIDUNG_ID: 'NS2', NGUOIDUNG_TAIKHOAN: 'maitt', KHONGKIEMTRASOTINCHITOIDA: 1, KHONGKIEMTRASOTINCHITOITHIEU: 0, KHONGKIEMTRATINHTRANGHOCPHI: 1, KHONGKIEMTRASISOTOIDA: 0 },
            { ID: 'PQ2', NGUOIDUNG_ID: 'NS3', NGUOIDUNG_TAIKHOAN: 'minhlq', KHONGKIEMTRASOTINCHITOIDA: 0, KHONGKIEMTRASOTINCHITOITHIEU: 0, KHONGKIEMTRATINHTRANGHOCPHI: 0, KHONGKIEMTRASISOTOIDA: 1 }
        ],

        // Hộp thiết đặt xử lý lớp HP
        'PKG_DANGKYHOC_THONGTIN2.Pr_DK_Kh_LopHp_DacThu_GetBy': [
            { ID: 'XLD1', DANGKY_LOPHOCPHAN_ID: 'LHP1', TENLOP: 'Lập trình hướng đối tượng - 01', MALOP: 'IT3100.01', XULYDACTHU_ID: 'XL1' },
            { ID: 'XLD2', DANGKY_LOPHOCPHAN_ID: 'LHP4', TENLOP: 'Quản trị học - 02', MALOP: 'EM1010.02', XULYDACTHU_ID: 'XL3' }
        ],
        'PKG_DANGKYHOC_THONGTIN2.Pr_DangKy_PhanCong_LHP_GetBy': [
            { DANGKY_LOPHOCPHAN_ID: 'LHP1', DANGKY_LOPHOCPHAN_TEN: 'Lập trình hướng đối tượng - 01', DANGKY_LOPHOCPHAN_MA: 'IT3100.01', LOPRIENG: 0 },
            { DANGKY_LOPHOCPHAN_ID: 'LHP2', DANGKY_LOPHOCPHAN_TEN: 'Lập trình hướng đối tượng - 02', DANGKY_LOPHOCPHAN_MA: 'IT3100.02', LOPRIENG: 1 },
            { DANGKY_LOPHOCPHAN_ID: 'LHP3', DANGKY_LOPHOCPHAN_TEN: 'Cấu trúc dữ liệu và giải thuật - 01', DANGKY_LOPHOCPHAN_MA: 'IT3011.01', LOPRIENG: 0 },
            { DANGKY_LOPHOCPHAN_ID: 'LHP4', DANGKY_LOPHOCPHAN_TEN: 'Quản trị học - 02', DANGKY_LOPHOCPHAN_MA: 'EM1010.02', LOPRIENG: 1 },
            { DANGKY_LOPHOCPHAN_ID: 'LHP5', DANGKY_LOPHOCPHAN_TEN: 'Kinh tế vi mô - 03', DANGKY_LOPHOCPHAN_MA: 'EM1100.03', LOPRIENG: 0 }
        ]
    });
})();
