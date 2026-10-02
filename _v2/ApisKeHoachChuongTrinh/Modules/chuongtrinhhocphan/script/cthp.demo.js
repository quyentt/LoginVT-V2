/* Dữ liệu mẫu cho Kế hoạch chương trình / cthp — chỉ dùng ở chế độ dựng thử.
   Danh sách chương trình + vùng xem lấy dữ liệu mẫu của Tài chính
   (ApisTaiChinh/Modules/hoatdong/script/cthp.demo.js, vỏ tự nạp cùng tệp .js). */
(function () {
    'use strict';
    var n = 0;
    function id(p) { return p + (++n); }
    function dm(i, ma, ten) { return { ID: i, MA: ma, TEN: ten }; }

    var HP = [
        ['HPCT1', 'HP1', 'MAT101', 'Giải tích 1', 3, 3, 'Đại cương', 'HK1', 'KY1', 'HK1', 1],
        ['HPCT2', 'HP2', 'MAT102', 'Đại số tuyến tính', 3, 3, 'Đại cương', 'HK1', 'KY1', 'HK1', 2],
        ['HPCT3', 'HP3', 'PHY101', 'Vật lý đại cương', 2, 2, 'Đại cương', 'HK2', 'KY2', '', 3],
        ['HPCT4', 'HP4', 'IT201', 'Cấu trúc dữ liệu và giải thuật', 4, 4, 'Cơ sở ngành', 'HK3', 'KY3', '', 4],
        ['HPCT5', 'HP5', 'IT202', 'Cơ sở dữ liệu', 3, 3, 'Cơ sở ngành', 'HK3', 'KY3', '', 5],
        ['HPCT6', 'HP6', 'IT401', 'Học máy', 3, 3, 'Tự chọn chuyên ngành', 'HK7', 'KY7', '', 6],
        ['HPCT7', 'HP7', 'IT402', 'Điện toán đám mây', 3, 3, 'Tự chọn chuyên ngành', 'HK7', 'KY7', '', 7]
    ].map(function (x) {
        return { ID: x[0], DAOTAO_HOCPHAN_ID: x[1], DAOTAO_HOCPHAN_MA: x[2], DAOTAO_HOCPHAN_TEN: x[3], HOCTRINHAPDUNGHOCTAP: x[4],
            HOCTRINHAPDUNGTINHHOCPHI: x[5], KHOIKIENTHUC: x[6], DAOTAO_THOIGIAN_KEHOACH: x[7], DAOTAO_THOIGIAN_KEHOACH_ID: x[8],
            DAOTAO_THOIGIAN_THUCTE: x[9], DAOTAO_THOIGIAN_THUCTE_ID: x[9] ? x[8] : '', THUTU: x[10], TONGSOTIETPHANBO: x[4] * 15,
            LAMONTINHDIEMTHEOCHUONGTRINH: 1, THUOCTINHHOCPHAN_ID: 'TT1', THUOCTINHHOCPHAN_TEN: 'Lý thuyết', PHANCONGPHAMVIDAMNHIEM_ID: 'PV1',
            THOIGIANDUKIEN: x[7], DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1', TONGSOTINCHITHEOKHOIKT: 148 };
    });
    var DANHMUC = [
        { ID: 'HP8', MA: 'ENG101', TEN: 'Tiếng Anh 1', HOCTRINH: 3, LAMONTINHDIEM: 1, HOCTRINHAPDUNGHOCTAP: 3, TONGSOTIETPHANBO: 45 },
        { ID: 'HP9', MA: 'POL101', TEN: 'Triết học Mác – Lênin', HOCTRINH: 3, LAMONTINHDIEM: 1, HOCTRINHAPDUNGHOCTAP: 3, TONGSOTIETPHANBO: 45 },
        { ID: 'HP10', MA: 'IT301', TEN: 'Mạng máy tính', HOCTRINH: 3, LAMONTINHDIEM: 1, HOCTRINHAPDUNGHOCTAP: 3, TONGSOTIETPHANBO: 45 }
    ];
    function hpCT(o) {
        var ky = o.strDaoTao_ThoiGian_KH_Id;
        return HP.filter(function (r) { return !ky || r.DAOTAO_THOIGIAN_KEHOACH_ID === ky; });
    }
    var KY = [{ ID: 'KY1', THOIGIAN: 'Học kỳ 1', TONTAI: 1 }, { ID: 'KY2', THOIGIAN: 'Học kỳ 2', TONTAI: 0 },
        { ID: 'KY3', THOIGIAN: 'Học kỳ 3', TONTAI: 0 }, { ID: 'KY7', THOIGIAN: 'Học kỳ 7', TONTAI: 0 }];
    var them = { rows: [], raw: { Id: 'MOI' + Date.now() } };

    var PV = [1, 2, 3, 4].map(function (i) { return { QLSV_NGUOIHOC_ID: 'SVPV' + i, QLSV_NGUOIHOC_MASO: '2500100' + i,
        QLSV_NGUOIHOC_HOTEN: ['Nguyễn Văn An', 'Trần Thị Bình', 'Lê Minh Châu', 'Phạm Quốc Dũng'][i - 1], LOP: 'DCOT.16.2' }; });
    var PV_DA = { SVPV1: 'PVDSVPV1' };
    ums.demo.add({
        'KHCT_HocPhan_ChuongTrinh/LayDanhSach': hpCT,
        'KHCT_HocPhan_TietHoc/LayDanhSach': function (o) {
            var ds = [];
            HP.forEach(function (r) {
                if (o.strDaoTao_HocPhan_Id && o.strDaoTao_HocPhan_Id !== r.DAOTAO_HOCPHAN_ID) return;
                ds.push({ ID: 'TH' + r.ID + 'A', DAOTAO_HOCPHAN_ID: r.DAOTAO_HOCPHAN_ID, LOAIPHANBO_ID: 'PB1', SOTIET: r.HOCTRINHAPDUNGHOCTAP * 10, SOTIN: r.HOCTRINHAPDUNGHOCTAP });
                ds.push({ ID: 'TH' + r.ID + 'B', DAOTAO_HOCPHAN_ID: r.DAOTAO_HOCPHAN_ID, LOAIPHANBO_ID: 'PB2', SOTIET: r.HOCTRINHAPDUNGHOCTAP * 5 });
            });
            return ds;
        },
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KHCT.LOAIPHANBO': [dm('PB1', 'LT', 'Lý thuyết'), dm('PB2', 'TH', 'Thực hành')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KHCT.PHAMVIDAMNHIEM': [dm('PV1', 'KHOA', 'Khoa đảm nhiệm'), dm('PV2', 'BM', 'Bộ môn đảm nhiệm')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KHCT.TTHP': [dm('TT1', 'LT', 'Lý thuyết'), dm('TT2', 'TH', 'Thực hành'), dm('TT3', 'DA', 'Đồ án')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KHCT.LQH': [dm('LQ1', 'TQ', 'Tiên quyết'), dm('LQ2', 'HT', 'Học trước'), dm('LQ3', 'SH', 'Song hành')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KHCT.QHHP.MUCDIEUKIEN': [dm('M1', 'DIEM', 'Điểm'), dm('M2', 'TC', 'Tín chỉ tích luỹ')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KHCT.QHHP.TOANTUDIEUKIEN': [dm('O1', '>=', '>='), dm('O2', '>', '>')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DAOTAO.PHANLOAI.KHOIKIENTHUC': [dm('PL1', 'BB', 'Bắt buộc'), dm('PL2', 'TC', 'Tự chọn')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DAOTAO.CTDT.DINHHUONG.CHEDO': [dm('CD1', 'SV', 'Sinh viên tự đăng ký'), dm('CD2', 'PK', 'Phòng đào tạo xếp')],
        'pkg_kehoach_thongtin2.LayDSPhanKyKeHoach': KY,
        'pkg_kehoach_thongtin2.LayDSKyTheoChuongTrinh': KY,
        'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao': KY.map(function (k) { return { ID: k.ID, DAOTAO_THOIGIANDAOTAO: k.THOIGIAN + ' (2026-2027)' }; }),
        'pkg_kehoach_thongtin2.LayDSKhoiKienThuc': [{ ID: 'KB1', TEN: 'Kiến thức đại cương' }, { ID: 'KB2', TEN: 'Cơ sở ngành' }],
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_HocPhan_CT': function () {
            return HP.slice(0, 4).map(function (r) { var x = {}; Object.keys(r).forEach(function (k) { x[k] = r[k]; }); x.ID = 'N' + r.ID; x.DAOTAO_THOIGIAN_KEHOACH_THUTU = 1; return x; });
        },
        'pkg_chung.LayIdHocKyTheoThuTu': [{ IDHOCKY: 'KY2' }],
        'KHCT_KhoiBatBuoc/LayDanhSach': [
            { ID: 'KB1', TEN: 'Kiến thức đại cương', KYHIEU: 'DC', THUTU: 1, PHANLOAI_ID: 'PL1', TONGSOHOCPHAN: 3, TONGSOTINCHI: 8, DAOTAO_KHOIBATBUOC_CHA_ID: '' },
            { ID: 'KB11', TEN: 'Toán – Khoa học tự nhiên', KYHIEU: 'DC1', THUTU: 1, PHANLOAI_ID: 'PL1', TONGSOHOCPHAN: 2, TONGSOTINCHI: 6, DAOTAO_KHOIBATBUOC_CHA_ID: 'KB1' },
            { ID: 'KB2', TEN: 'Cơ sở ngành', KYHIEU: 'CS', THUTU: 2, PHANLOAI_ID: 'PL1', TONGSOHOCPHAN: 2, TONGSOTINCHI: 7, DAOTAO_KHOIBATBUOC_CHA_ID: '' }
        ],
        'KHCT_HocPhan_KhoiBatBuoc/LayDanhSach': function (o) {
            var m = { KB1: [0, 1, 2], KB11: [0, 1], KB2: [3, 4] }[o.strDaoTao_KhoiBatBuoc_Id] || [];
            return m.map(function (i) { var r = HP[i]; return { ID: 'KBHP' + o.strDaoTao_KhoiBatBuoc_Id + i, DAOTAO_HOCPHAN_ID: r.DAOTAO_HOCPHAN_ID,
                DAOTAO_HOCPHAN_MA: r.DAOTAO_HOCPHAN_MA, DAOTAO_HOCPHAN_TEN: r.DAOTAO_HOCPHAN_TEN, HOCTRINHAPDUNGHOCTAP: r.HOCTRINHAPDUNGHOCTAP, TONGSOTIETPHANBO: r.TONGSOTIETPHANBO }; });
        },
        'KHCT_KhoiTuChon_Don/LayDanhSach': [
            { ID: 'KT1', TEN: 'Tự chọn chuyên ngành', KYHIEU: 'TC1', THUTU: 1, PHANLOAI_ID: 'PL2', TONGSOHP: 2, TONGSOTC: 6, SOTINCHIQUYDINH: 3,
              KHONGTINHDIEM: 0, NHOM: 'A', DAOTAO_KHOITUCHON_DON_CHA_ID: '' },
            { ID: 'KT2', TEN: 'Giáo dục thể chất', KYHIEU: 'GDTC', THUTU: 2, PHANLOAI_ID: 'PL2', TONGSOHP: 0, TONGSOTC: 0, SOHOCPHANQUYDINH: 2,
              KHONGTINHDIEM: 1, NHOM: '', DAOTAO_KHOITUCHON_DON_CHA_ID: '' }
        ],
        'KHCT_HocPhan_KhoiTuChon_Don/LayDanhSach': function (o) {
            if (o.strDaoTao_KTuChon_Don_Id !== 'KT1') return [];
            return [5, 6].map(function (i) { var r = HP[i]; return { ID: 'KTHP' + i, DAOTAO_HOCPHAN_ID: r.DAOTAO_HOCPHAN_ID, DAOTAO_HOCPHAN_MA: r.DAOTAO_HOCPHAN_MA,
                DAOTAO_HOCPHAN_TEN: r.DAOTAO_HOCPHAN_TEN, HOCTRINHAPDUNGHOCTAP: r.HOCTRINHAPDUNGHOCTAP, TONGSOTIETPHANBO: r.TONGSOTIETPHANBO, LAHOCPHANBATBUOC: i === 5 ? 1 : 0 }; });
        },
        'KHCT_HocPhan_ChuongTrinh/LayDSKS_DaoTao_HocPhan_CT_N': function () { return HP; },
        'KHCT_HocPhan/LayDSKS_DaoTao_HocPhan_N': function () {
            return DANHMUC.map(function (d) { return { DAOTAO_HOCPHAN_ID: d.ID, DAOTAO_HOCPHAN_MA: d.MA, DAOTAO_HOCPHAN_TEN: d.TEN, HOCTRINHAPDUNGHOCTAP: d.HOCTRINH, TONGSOTIETPHANBO: d.TONGSOTIETPHANBO }; });
        },
        'KHCT_HocPhan/LayDanhSach': DANHMUC,
        'KHCT_QuanHeHocPhan/LayDanhSach': [
            { ID: 'QH1', LOAIQUANHE_TEN: 'Tiên quyết', DAOTAO_HOCPHAN_QUANHE_TEN: 'Giải tích 1', DAOTAO_HOCPHAN_QUANHE_MA: 'MAT101',
              MUCDIEUKIEN_TEN: 'Điểm', TOANTU_TEN: '>=', GIATRIDIEUKIEN: '4' }
        ],
        'KHCT_ThongTin/LayDSKS_DaoTao_HocPhanTD': [
            { ID: 'TD1', DAOTAO_KHOADAOTAO_TD_TEN: 'K65', DAOTAO_CHUONGTRINH_TD_TEN: 'Công nghệ thông tin K65', DAOTAO_HOCPHAN_TD_TEN: 'Giải tích', SOTIN: 3, NHOM: '1' }
        ],
        'pkg_kehoach_thongtin2.LayDSKS_DaoTao_HocPhanThayThe': [],
        /* Hộp "Phạm vi áp dụng" (gốc thêm 27/09/2026): người học chưa / đã gán cho một dòng tương đương / thay thế */
        'pkg_kehoach_thongtin2.LayDSChuaGan_HocPhanTD': function () { return PV.filter(function (x) { return !PV_DA[x.QLSV_NGUOIHOC_ID]; }); },
        'pkg_kehoach_thongtin2.LayDSDaGan_HocPhanTD': function () {
            return PV.filter(function (x) { return PV_DA[x.QLSV_NGUOIHOC_ID]; }).map(function (x) {
                return { ID: PV_DA[x.QLSV_NGUOIHOC_ID], QLSV_NGUOIHOC_ID: x.QLSV_NGUOIHOC_ID, QLSV_NGUOIHOC_MASO: x.QLSV_NGUOIHOC_MASO, QLSV_NGUOIHOC_HOTEN: x.QLSV_NGUOIHOC_HOTEN, LOP: x.LOP };
            });
        },
        'pkg_kehoach_thongtin2.Them_HocPhanTD_SinhVien': function (o) { PV_DA[o.strQLSV_NguoiHoc_Id] = 'PVD' + o.strQLSV_NguoiHoc_Id; return {}; },
        'pkg_kehoach_thongtin2.Xoa_HocPhanTD_SinhVien': function (o) {
            Object.keys(PV_DA).forEach(function (k) { if (PV_DA[k] === o.strIds) delete PV_DA[k]; }); return {};
        },
        'KHCT_BaiHoc/LayDanhSach': [
            { ID: 'BH1', TENBAI: 'Giới hạn và liên tục', KYHIEUBAI: 'C1', SOTIET: 6, NOIDUNG: 'Giới hạn dãy số, hàm số' },
            { ID: 'BH2', TENBAI: 'Đạo hàm', KYHIEUBAI: 'C2', SOTIET: 9, NOIDUNG: 'Đạo hàm và vi phân' }
        ],
        'D_KQHocTapTheoChuongTrinh/LayKQHocTapTheoChuongTrinh': {
            rows: {
                rsNguoiHocChuaCoDiem: [{ QLSV_NGUOIHOC_MASO: 'BIT230210', QLSV_NGUOIHOC_HODEM: 'Phạm Thu', QLSV_NGUOIHOC_TEN: 'Dung', DAOTAO_LOPQUANLY_TEN: 'K68-HTTT1', QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học' }],
                rsNguoiHocChuaHoanThanh: [{ QLSV_NGUOIHOC_MASO: 'BIT220102', QLSV_NGUOIHOC_HODEM: 'Trần Thị', QLSV_NGUOIHOC_TEN: 'Bình', DAOTAO_LOPQUANLY_TEN: 'K67-KTPM1', QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học' }],
                rsNguoiHocDaHoanThanh: [{ QLSV_NGUOIHOC_MASO: 'BIT220101', QLSV_NGUOIHOC_HODEM: 'Nguyễn Văn', QLSV_NGUOIHOC_TEN: 'An', DAOTAO_LOPQUANLY_TEN: 'K67-KTPM1', QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học' }]
            }
        },
        'KHCT_ThongTin/LayDSDaoTao_CT_DinhHuong': [{ ID: 'DH1', MA: 'KHMT', TEN: 'Khoa học máy tính', TENTA: 'Computer Science', SOSV: 120,
            CHEDODANGKYDINHHUONG_ID: 'CD1', NGAYBATDAU: '01/09/2026', NGAYKETTHUC: '30/06/2030' },
            { ID: 'DH2', MA: 'KTPM', TEN: 'Kỹ thuật phần mềm', TENTA: 'Software Engineering', SOSV: 165, CHEDODANGKYDINHHUONG_ID: 'CD1', NGAYBATDAU: '', NGAYKETTHUC: '' }],
        'KHCT_ThongTin/LayDSDaoTao_CT_DinhHuong_KKT': [{ ID: 'X1', DAOTAO_KHOIKIENTHUC_MA: 'TC1', DAOTAO_KHOIKIENTHUC_TEN: 'Tự chọn chuyên ngành', LOAIKHOIKIENTHUC: 'Tự chọn' }],
        'KHCT_DinhHuong/LayDSKhoiKienThucChuaDinhHuong': [{ ID: 'KT2', MA: 'GDTC', TEN: 'Giáo dục thể chất' }, { ID: 'KB2', MA: 'CS', TEN: 'Cơ sở ngành' }],
        'KHCT_DinhHuong/LayDSDaoTao_CT_DinhHuong_KKT': function (o) {
            return o.strDaoTao_CT_DinhHuong_Id === 'DH1' ? [{ ID: 'DK1', DAOTAO_KHOIKIENTHUC_MA: 'TC1', DAOTAO_KHOIKIENTHUC_TEN: 'Tự chọn chuyên ngành' }] : [];
        },
        'KHCT_DinhHuong/LayDSDaoTao_CT_DinhHuong_HP': function (o) {
            return o.strDaoTao_CT_DinhHuong_Id === 'DH1' ? [{ ID: 'DP1', DAOTAO_KHOIKIENTHUC_MA: 'TC1', DAOTAO_KHOIKIENTHUC_TEN: 'Tự chọn chuyên ngành', DAOTAO_HOCPHAN_MA: 'IT401', DAOTAO_HOCPHAN_TEN: 'Học máy' }] : [];
        },
        'KHCT_DinhHuong/LayDSDaoTao_HocPhan_Chua_DH': [{ ID: 'HP7', MA: 'IT402', TEN: 'Điện toán đám mây' }, { ID: 'HP5', MA: 'IT202', TEN: 'Cơ sở dữ liệu' }],
        'KHCT_DinhHuong/LayDSDaoTao_CT_DinhHuong_NH': function (o) {
            return o.strDaoTao_CT_DinhHuong_Id === 'DH1' ? [{ ID: 'DN1', QLSV_NGUOIHOC_ID: 'NH01', QLSV_NGUOIHOC_MASO: 'BIT220101', QLSV_NGUOIHOC_HODEM: 'Nguyễn Văn', QLSV_NGUOIHOC_TEN: 'An' }] : [];
        },
        'PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc': function () {
            return { rows: [
                { ID: 'NH02', QLSV_NGUOIHOC_ID: 'NH02', QLSV_NGUOIHOC_MASO: 'BIT220102', QLSV_NGUOIHOC_HODEM: 'Trần Thị', QLSV_NGUOIHOC_TEN: 'Bình', DAOTAO_LOPQUANLY_TEN: 'K67-KTPM1', DAOTAO_CHUONGTRINH_TEN: 'Công nghệ thông tin', QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học' },
                { ID: 'NH03', QLSV_NGUOIHOC_ID: 'NH03', QLSV_NGUOIHOC_MASO: 'BIT220115', QLSV_NGUOIHOC_HODEM: 'Lê Minh', QLSV_NGUOIHOC_TEN: 'Châu', DAOTAO_LOPQUANLY_TEN: 'K67-KTPM1', DAOTAO_CHUONGTRINH_TEN: 'Công nghệ thông tin', QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học' }
            ], pager: 2 };
        },
        /* Pull 29/9: lưu hai ô "mô hình" của chương trình */
        'PKG_KEHOACH_THONGTIN2.CapNhat_MoHinh_ChuongTrinh': function () { return {}; },
        /* Lời gọi ghi: trả Id như máy chủ thật */
        'KHCT_ThongTin/Them_DaoTao_KhoiBatBuoc': them,
        'pkg_kehoach_thongtin.Them_DaoTao_KhoiTuChon_Don': them,
        'pkg_kehoach_thongtin.Them_DaoTao_CT_DinhHuong': them,
        'KHCT_HocPhan_ChuongTrinh/ThemMoi': { rows: [], raw: { Id: id('HPCTM') } }
    });
})();
