/* Dữ liệu mẫu cho chuontrinhhoc (Chương trình học) — chỉ dùng ở chế độ dựng thử.
   Người học mẫu: SV0001 (Lăng Văn Huy - DCOT.16.2).
   Lưu ý: bản gốc dùng selectOne nên mở màn tự chọn chương trình CUỐI danh sách. */
(function () {
    var fx = {};

    /* Loại phân bổ → các cột động của bảng học phần */
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KHCT.LOAIPHANBO'] = [
        { ID: 'PB1', MA: 'LT', TEN: 'Lý thuyết' },
        { ID: 'PB2', MA: 'TH', TEN: 'Thực hành' },
        { ID: 'PB3', MA: 'TL', TEN: 'Thảo luận' }
    ];

    fx['pkg_dangkyhoc_chung.LayDSChuongTrinh'] = [
        /* Bản gốc selectOne → ô chọn lấy mục CUỐI làm mặc định; để chương trình chính ở cuối */
        { DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT02', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Quản trị kinh doanh (ngành 2) - Khóa 16', TONGSOTINCHIQUYDINH: 62 },
        { DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT01', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Công nghệ kỹ thuật ô tô - Khóa 16', TONGSOTINCHIQUYDINH: 148 }
    ];

    function hp(id, ct, ma, ten, khoi, tc, tcp, dk, kh, tt) {
        return {
            ID: id, DAOTAO_TOCHUCCHUONGTRINH_ID: ct, DAOTAO_HOCPHAN_ID: 'HP' + id,
            DAOTAO_HOCPHAN_MA: ma, DAOTAO_HOCPHAN_TEN: ten, KHOIKIENTHUC: khoi,
            HOCTRINHAPDUNGHOCTAP: tc, HOCTRINHAPDUNGTINHHOCPHI: tcp, THONGTINQUANHEHOCPHAN: dk,
            DAOTAO_THOIGIAN_KEHOACH: kh, DAOTAO_THOIGIAN_THUCTE: tt,
            DAOTAO_THOIGIAN_KEHOACH_TEN: 'Học kỳ ' + kh, DAOTAO_THOIGIAN_THUCTE_TEN: tt ? 'Học kỳ ' + tt : '',
            LAMONTINHDIEMTHEOCHUONGTRINH: 'Tính điểm', THUOCTINHHOCPHAN_TEN: 'Bắt buộc',
            PHANCONGPHAMVIDAMNHIEM_TEN: 'Khoa Công nghệ kỹ thuật ô tô', THUTU: Number(id.substring(1))
        };
    }

    var HP = {
        CT01: [
            hp('D01', 'CT01', 'ML001', 'Triết học Mác - Lênin', 'Kiến thức đại cương', 3, 3, '', '1', '1'),
            hp('D02', 'CT01', 'AV001', 'Tiếng Anh cơ bản 1', 'Kiến thức đại cương', 3, 3, '', '1', '1'),
            hp('D03', 'CT01', 'TO101', 'Toán cao cấp 1', 'Kiến thức cơ sở', 3, 3, '', '1', '1'),
            hp('D04', 'CT01', 'CK201', 'Vẽ kỹ thuật cơ khí', 'Kiến thức cơ sở', 3, 3, 'Học trước: TO101', '2', '2'),
            hp('D05', 'CT01', 'OT301', 'Cấu tạo ô tô', 'Kiến thức ngành', 4, 4, 'Học trước: CK201', '3', '3'),
            hp('D06', 'CT01', 'OT302', 'Động cơ đốt trong', 'Kiến thức ngành', 4, 4, 'Học trước: CK201', '4', ''),
            hp('D07', 'CT01', 'OT401', 'Hệ thống điện - điện tử ô tô', 'Kiến thức chuyên ngành', 3, 3, 'Song hành: OT302', '5', ''),
            hp('D08', 'CT01', 'OT501', 'Thực tập tốt nghiệp', 'Thực tập, khóa luận', 6, 6, 'Tích lũy tối thiểu 110 TC', '8', '')
        ],
        CT02: [
            hp('Q01', 'CT02', 'QT101', 'Quản trị học', 'Kiến thức cơ sở', 3, 3, '', '3', '3'),
            hp('Q02', 'CT02', 'QT201', 'Marketing căn bản', 'Kiến thức ngành', 3, 3, 'Học trước: QT101', '4', '4'),
            hp('Q03', 'CT02', 'QT202', 'Quản trị nhân lực', 'Kiến thức ngành', 3, 3, 'Học trước: QT101', '5', ''),
            hp('Q04', 'CT02', 'QT301', 'Quản trị chiến lược', 'Kiến thức chuyên ngành', 3, 3, 'Học trước: QT201', '6', ''),
            hp('Q05', 'CT02', 'QT401', 'Khóa luận tốt nghiệp ngành 2', 'Thực tập, khóa luận', 5, 5, 'Tích lũy tối thiểu 50 TC', '8', '')
        ]
    };
    fx['pkg_kehoach_thongtin.LayDSKS_DaoTao_HocPhan_CT'] = function (o) { return HP[o.strDaoTao_ChuongTrinh_Id] || []; };

    /* Số tiết theo loại phân bổ — gọi cho từng học phần (như bản gốc) và cho hộp chi tiết */
    var TIET = {
        HPD01: [30, 0, 15], HPD02: [30, 15, 0], HPD03: [45, 0, 0], HPD04: [30, 30, 0],
        HPD05: [45, 30, 0], HPD06: [45, 30, 15], HPD07: [30, 30, 0], HPD08: [0, 180, 0],
        HPQ01: [45, 0, 0], HPQ02: [30, 15, 0], HPQ03: [30, 15, 0], HPQ04: [30, 0, 15], HPQ05: [0, 150, 0]
    };
    fx['pkg_kehoach_thongtin.LayDSKS_DaoTao_HocPhan_CT_PB'] = function (o) {
        var t = TIET[o.strDaoTao_HocPhan_Id] || [30, 15, 0];
        return [
            { ID: 'PBR1', LOAIPHANBO_ID: 'PB1', LOAIPHANBO_TEN: 'Lý thuyết', SOTIET: t[0] },
            { ID: 'PBR2', LOAIPHANBO_ID: 'PB2', LOAIPHANBO_TEN: 'Thực hành', SOTIET: t[1] },
            { ID: 'PBR3', LOAIPHANBO_ID: 'PB3', LOAIPHANBO_TEN: 'Thảo luận', SOTIET: t[2] }
        ];
    };

    var KBB = {
        CT01: [
            { ID: 'KBB1', TEN: 'Khối kiến thức chuyên ngành Công nghệ ô tô', TONGSOHOCPHAN: 3, TONGSOTINCHI: 10 },
            { ID: 'KBB2', TEN: 'Khối kiến thức lý luận chính trị', TONGSOHOCPHAN: 2, TONGSOTINCHI: 5 }
        ],
        CT02: [{ ID: 'KBB3', TEN: 'Khối kiến thức ngành Quản trị kinh doanh', TONGSOHOCPHAN: 2, TONGSOTINCHI: 6 }]
    };
    fx['pkg_kehoach_thongtin.LayDSKS_DaoTao_KhoiBatBuoc'] = function (o) { return KBB[o.strDaoTao_ToChucCT_Id] || []; };

    var KTCD = {
        CT01: [
            { ID: 'KTC1', TEN: 'Khối tự chọn ngoại ngữ', TONGSOHP: 4, TONGSOTC: 12, SOHOCPHANQUYDINH: 1, SOTINCHIQUYDINH: 3 },
            { ID: 'KTC2', TEN: 'Khối tự chọn kỹ năng mềm', TONGSOHP: 3, TONGSOTC: 6, SOHOCPHANQUYDINH: 2, SOTINCHIQUYDINH: '' }
        ],
        CT02: [{ ID: 'KTC3', TEN: 'Khối tự chọn bổ trợ ngành 2', TONGSOHP: 3, TONGSOTC: 9, SOHOCPHANQUYDINH: '', SOTINCHIQUYDINH: 3 }]
    };
    fx['pkg_kehoach_thongtin.LayDSKS_DaoTao_KhoiTuChon_Don'] = function (o) { return KTCD[o.strDaoTao_ToChucCT_Id] || []; };

    function hpKhoi(ma, ten, tc, tiet) {
        return { ID: 'K' + ma, DAOTAO_HOCPHAN_MA: ma, DAOTAO_HOCPHAN_TEN: ten, HOCTRINHAPDUNGHOCTAP: tc, TONGSOTIETPHANBO: tiet };
    }
    var HP_KBB = {
        KBB1: [hpKhoi('OT301', 'Cấu tạo ô tô', 4, 75), hpKhoi('OT302', 'Động cơ đốt trong', 4, 90), hpKhoi('OT401', 'Hệ thống điện - điện tử ô tô', 3, 60)],
        KBB2: [hpKhoi('ML001', 'Triết học Mác - Lênin', 3, 45), hpKhoi('ML002', 'Kinh tế chính trị Mác - Lênin', 2, 30)],
        KBB3: [hpKhoi('QT201', 'Marketing căn bản', 3, 45), hpKhoi('QT202', 'Quản trị nhân lực', 3, 45)]
    };
    fx['pkg_kehoach_thongtin.LayDSKS_DaoTao_HP_KhoiBatBuoc'] = function (o) { return HP_KBB[o.strDaoTao_KhoiBatBuoc_Id] || []; };

    var HP_KTCD = {
        KTC1: [hpKhoi('AV002', 'Tiếng Anh cơ bản 2', 3, 45), hpKhoi('AV003', 'Tiếng Anh chuyên ngành', 3, 45),
               hpKhoi('TQ001', 'Tiếng Trung cơ bản', 3, 45), hpKhoi('TN001', 'Tiếng Nhật cơ bản', 3, 45)],
        KTC2: [hpKhoi('KN001', 'Kỹ năng làm việc nhóm', 2, 30), hpKhoi('KN002', 'Kỹ năng thuyết trình', 2, 30), hpKhoi('KN003', 'Khởi nghiệp', 2, 30)],
        KTC3: [hpKhoi('QT302', 'Quản trị bán hàng', 3, 45), hpKhoi('QT303', 'Thương mại điện tử', 3, 45), hpKhoi('QT304', 'Quản trị dự án', 3, 45)]
    };
    fx['pkg_kehoach_thongtin.LayDSKS_DaoTao_HP_KTuChon_Don'] = function (o) { return HP_KTCD[o.strDaoTao_KTuChon_Don_Id] || []; };

    /* Hộp chi tiết học phần */
    var QH = {
        HPD04: [{ LOAIQUANHE_TEN: 'Học phần học trước', DAOTAO_HOCPHAN_QUANHE_TEN: 'TO101 - Toán cao cấp 1', MUCDIEUKIEN_TEN: 'Đạt', TOANTU_TEN: '>=', GIATRIDIEUKIEN: '4' }],
        HPD05: [{ LOAIQUANHE_TEN: 'Học phần học trước', DAOTAO_HOCPHAN_QUANHE_TEN: 'CK201 - Vẽ kỹ thuật cơ khí', MUCDIEUKIEN_TEN: 'Đạt', TOANTU_TEN: '>=', GIATRIDIEUKIEN: '4' }],
        HPD06: [{ LOAIQUANHE_TEN: 'Học phần học trước', DAOTAO_HOCPHAN_QUANHE_TEN: 'CK201 - Vẽ kỹ thuật cơ khí', MUCDIEUKIEN_TEN: 'Đạt', TOANTU_TEN: '>=', GIATRIDIEUKIEN: '4' }],
        HPD07: [{ LOAIQUANHE_TEN: 'Học phần song hành', DAOTAO_HOCPHAN_QUANHE_TEN: 'OT302 - Động cơ đốt trong', MUCDIEUKIEN_TEN: '', TOANTU_TEN: '', GIATRIDIEUKIEN: '' }],
        HPQ02: [{ LOAIQUANHE_TEN: 'Học phần học trước', DAOTAO_HOCPHAN_QUANHE_TEN: 'QT101 - Quản trị học', MUCDIEUKIEN_TEN: 'Đạt', TOANTU_TEN: '>=', GIATRIDIEUKIEN: '4' }],
        HPQ04: [{ LOAIQUANHE_TEN: 'Học phần học trước', DAOTAO_HOCPHAN_QUANHE_TEN: 'QT201 - Marketing căn bản', MUCDIEUKIEN_TEN: 'Đạt', TOANTU_TEN: '>=', GIATRIDIEUKIEN: '4' }]
    };
    fx['pkg_kehoach_thongtin.LayDSKS_DaoTao_QuanHeHocPhan'] = function (o) { return QH[o.strDaoTao_HocPhan_Id] || []; };

    var TD = {
        HPD01: [{ DAOTAO_KHOADAOTAO_TD_TEN: 'Khóa 15', DAOTAO_CHUONGTRINH_TD_TEN: 'Công nghệ kỹ thuật ô tô - Khóa 15', DAOTAO_HOCPHAN_TD_TEN: 'ML001A - Những nguyên lý cơ bản của CN Mác - Lênin' }],
        HPD05: [{ DAOTAO_KHOADAOTAO_TD_TEN: 'Khóa 15', DAOTAO_CHUONGTRINH_TD_TEN: 'Công nghệ kỹ thuật ô tô - Khóa 15', DAOTAO_HOCPHAN_TD_TEN: 'OT300 - Kết cấu ô tô' }],
        HPQ02: [{ DAOTAO_KHOADAOTAO_TD_TEN: 'Khóa 15', DAOTAO_CHUONGTRINH_TD_TEN: 'Quản trị kinh doanh - Khóa 15', DAOTAO_HOCPHAN_TD_TEN: 'QT200 - Nguyên lý marketing' }]
    };
    fx['pkg_kehoach_thongtin.LayDSKS_DaoTao_HocPhanTD'] = function (o) { return TD[o.strDaoTao_HocPhan_Id] || []; };

    var BH = {
        HPD05: [
            { TENBAI: 'Tổng quan về ô tô', KYHIEUBAI: 'B1', SOTIET: 6, NOIDUNG: 'Lịch sử, phân loại, thông số kỹ thuật cơ bản' },
            { TENBAI: 'Hệ thống truyền lực', KYHIEUBAI: 'B2', SOTIET: 12, NOIDUNG: 'Ly hợp, hộp số, các đăng, cầu chủ động' },
            { TENBAI: 'Hệ thống treo - lái - phanh', KYHIEUBAI: 'B3', SOTIET: 12, NOIDUNG: 'Cấu tạo, nguyên lý làm việc, bảo dưỡng' }
        ],
        HPD06: [
            { TENBAI: 'Chu trình làm việc của động cơ', KYHIEUBAI: 'B1', SOTIET: 9, NOIDUNG: 'Động cơ 4 kỳ, 2 kỳ; chu trình lý thuyết và thực tế' },
            { TENBAI: 'Hệ thống nhiên liệu', KYHIEUBAI: 'B2', SOTIET: 9, NOIDUNG: 'Phun xăng điện tử, Common Rail' }
        ],
        HPQ02: [
            { TENBAI: 'Tổng quan marketing', KYHIEUBAI: 'B1', SOTIET: 6, NOIDUNG: 'Khái niệm, vai trò, môi trường marketing' },
            { TENBAI: 'Chiến lược sản phẩm - giá', KYHIEUBAI: 'B2', SOTIET: 12, NOIDUNG: 'Vòng đời sản phẩm, các phương pháp định giá' }
        ]
    };
    fx['pkg_kehoach_thongtin.LayDSKS_DaoTao_BaiHoc'] = function (o) { return BH[o.strDaoTao_HocPhan_Id] || []; };

    ums.demo.add(fx);
})();
