/* Dữ liệu mẫu cho _tp_duyet.js (duyetdulieuthi, hannhapdiem) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var TP = [{ ID: 'TPD01', TEN: 'Thi kết thúc học phần lần 1' }, { ID: 'TPD02', TEN: 'Thi kết thúc học phần lần 2' }];
    var LOP = [
        { ID: 'LHP001', DAOTAO_HOCPHAN_TEN: 'Kinh tế vi mô', DAOTAO_HOCPHAN_MA: 'ECO101', TENLOP: 'ECO101.K14.01_LT', SOSV: 62, CONGTHUC_TUKHOA: 'CC+GK+THI', CONGTHUC: '#CC1#*0.1+#GK#*0.2+#THI1#*0.7',
            HANNOPDIEM: '15/01/2027', NGAYBATDAU: '07/09/2026', NGAYKETTHUC: '20/12/2026' },
        { ID: 'LHP002', DAOTAO_HOCPHAN_TEN: 'Kinh tế vi mô', DAOTAO_HOCPHAN_MA: 'ECO101', TENLOP: 'ECO101.K14.02_LT', SOSV: 58, CONGTHUC_TUKHOA: 'CC+GK+THI', CONGTHUC: '#CC1#*0.1+#GK#*0.2+#THI1#*0.7',
            HANNOPDIEM: '15/01/2027', NGAYBATDAU: '07/09/2026', NGAYKETTHUC: '20/12/2026' },
        { ID: 'LHP003', DAOTAO_HOCPHAN_TEN: 'Nguyên lý kế toán', DAOTAO_HOCPHAN_MA: 'ACC201', TENLOP: 'ACC201.K13.01_LT', SOSV: 45, CONGTHUC_TUKHOA: 'CC+THI', CONGTHUC: '#CC1#*0.3+#THI1#*0.7',
            HANNOPDIEM: '', NGAYBATDAU: '14/09/2026', NGAYKETTHUC: '27/12/2026' },
        { ID: 'LHP004', DAOTAO_HOCPHAN_TEN: 'Tiếng Anh thương mại 2', DAOTAO_HOCPHAN_MA: 'ENG202', TENLOP: 'ENG202.K14.03_LT', SOSV: 38, CONGTHUC_TUKHOA: 'CC+GK+THI', CONGTHUC: '#CC1#*0.2+#GK#*0.2+#THI1#*0.6',
            HANNOPDIEM: '20/01/2027', NGAYBATDAU: '07/09/2026', NGAYKETTHUC: '20/12/2026' },
        { ID: 'LHP005', DAOTAO_HOCPHAN_TEN: 'Cơ sở dữ liệu', DAOTAO_HOCPHAN_MA: 'BIT210', TENLOP: 'BIT210.K13.01_TH', SOSV: 30, CONGTHUC_TUKHOA: 'TH+THI', CONGTHUC: '#TH1#*0.4+#THI1#*0.6',
            HANNOPDIEM: '', NGAYBATDAU: '21/09/2026', NGAYKETTHUC: '03/01/2027' }
    ];
    var SOTP = { LHP001: [62, 4], LHP002: [55, 0], LHP003: [45, 3], LHP004: [38, 2], LHP005: [28, 0] };
    var HO = ['Nguyễn Văn', 'Trần Thị', 'Lê Minh', 'Phạm Thu', 'Hoàng Đức', 'Vũ Ngọc'], TEN = ['An', 'Bình', 'Châu', 'Dung', 'Giang', 'Hà'];
    var TT = [{ ID: 'TTT1', TEN: 'Đủ điều kiện dự thi', THONGTIN1: 'fa fa-check-circle', THONGTIN2: 'color: #2e7d32' },
        { ID: 'TTT2', TEN: 'Không đủ điều kiện', THONGTIN1: 'fa fa-ban', THONGTIN2: 'color: #c62828' },
        { ID: 'TTT3', TEN: 'Hoãn thi', THONGTIN1: 'fa fa-hourglass-half', THONGTIN2: 'color: #ef6c00' }];
    var CB = [{ ID: 'CB1', TEN: 'Công bố', THONGTIN1: 'fa fa-bullhorn', THONGTIN2: 'color: #1565c0' },
        { ID: 'CB2', TEN: 'Hủy công bố', THONGTIN1: 'fa fa-undo', THONGTIN2: 'color: #c62828' }];
    var DST = [
        { ID: 'DST01', MADANHSACHTHI: 'ECO101-D1-P01', TKB_PHONGHOC_TEN: 'A2-301', NGAYTHI: '05/01/2027', THI_CATHI_TEN: 'Ca 1 (07:30)', DAOTAO_HOCPHAN_TEN: 'Kinh tế vi mô', DAOTAO_HOCPHAN_ID: 'HP01',
            HINHTHUCTHI_TEN: 'Tự luận', THONGTINLOPHOCPHAN: 'ECO101.K14.01_LT', TRANGTHAICONGBO_TEN: 'Công bố', THOIGIANCONGBOLICH: '20/12/2026 09:15', NGUOITHUCHIENCONGBOLICH: 'Đỗ Thị Hằng' },
        { ID: 'DST02', MADANHSACHTHI: 'ECO101-D1-P02', TKB_PHONGHOC_TEN: 'A2-302', NGAYTHI: '05/01/2027', THI_CATHI_TEN: 'Ca 1 (07:30)', DAOTAO_HOCPHAN_TEN: 'Kinh tế vi mô', DAOTAO_HOCPHAN_ID: 'HP01',
            HINHTHUCTHI_TEN: 'Tự luận', THONGTINLOPHOCPHAN: 'ECO101.K14.01_LT,ECO101.K14.02_LT', TRANGTHAICONGBO_TEN: '', THOIGIANCONGBOLICH: '', NGUOITHUCHIENCONGBOLICH: '' },
        { ID: 'DST03', MADANHSACHTHI: 'ACC201-D1-P01', TKB_PHONGHOC_TEN: 'B1-204', NGAYTHI: '07/01/2027', THI_CATHI_TEN: 'Ca 3 (13:30)', DAOTAO_HOCPHAN_TEN: 'Nguyên lý kế toán', DAOTAO_HOCPHAN_ID: 'HP02',
            HINHTHUCTHI_TEN: 'Trắc nghiệm', THONGTINLOPHOCPHAN: 'ACC201.K13.01_LT', TRANGTHAICONGBO_TEN: null, THOIGIANCONGBOLICH: '', NGUOITHUCHIENCONGBOLICH: '' },
        { ID: 'DST04', MADANHSACHTHI: 'ENG202-D1-P01', TKB_PHONGHOC_TEN: 'C3-105', NGAYTHI: '09/01/2027', THI_CATHI_TEN: 'Ca 2 (09:30)', DAOTAO_HOCPHAN_TEN: 'Tiếng Anh thương mại 2', DAOTAO_HOCPHAN_ID: 'HP03',
            HINHTHUCTHI_TEN: 'Vấn đáp', THONGTINLOPHOCPHAN: 'ENG202.K14.03_LT', TRANGTHAICONGBO_TEN: 'Hủy công bố', THOIGIANCONGBOLICH: '22/12/2026 14:02', NGUOITHUCHIENCONGBOLICH: 'Đỗ Thị Hằng' }
    ];
    var LS = [{ TINHTRANG_TEN: 'Đủ điều kiện dự thi', NOIDUNG: 'Đã rà soát chuyên cần', NGUOIXACNHAN_TENDAYDU: 'Đỗ Thị Hằng', NGAYTAO_DD_MM_YYYY: '18/12/2026' }];

    ums.demo.add({
        'DKH_Chung/LayThoiGianDangKyHoc': [{ ID: 'TG2601', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm học 2026 - 2027' }, { ID: 'TG2602', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 năm học 2026 - 2027' }],
        'DKH_PhanCong_LopHP/LayDSKhoaToChuc': [{ ID: 'K13', TENKHOA: 'Khóa 13' }, { ID: 'K14', TENKHOA: 'Khóa 14' }, { ID: 'K15', TENKHOA: 'Khóa 15' }],
        'DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc': [{ ID: 'CT01', TENCHUONGTRINH: 'Quản trị kinh doanh' }, { ID: 'CT01B', TENCHUONGTRINH: 'Quản trị kinh doanh' },
            { ID: 'CT02', TENCHUONGTRINH: 'Kế toán' }, { ID: 'CT03', TENCHUONGTRINH: 'Công nghệ thông tin' }],
        'TP_ToChucThi/LayDSDangKy_KeHoachDangKy': [{ ID: 'KH01', TENKEHOACH: 'Đăng ký học kỳ 1 (2026 - 2027) - đợt chính' }, { ID: 'KH02', TENKEHOACH: 'Đăng ký học kỳ 1 (2026 - 2027) - đợt bổ sung' }],
        'TP_ToChucThi/LayDSHocPhanTheoKeHoach': [{ ID: 'HP01', MA: 'ECO101', TEN: 'Kinh tế vi mô' }, { ID: 'HP02', MA: 'ACC201', TEN: 'Nguyên lý kế toán' },
            { ID: 'HP03', MA: 'ENG202', TEN: 'Tiếng Anh thương mại 2' }, { ID: 'HP04', MA: 'BIT210', TEN: 'Cơ sở dữ liệu' }],
        'TP_ToChucThi/LayDSThanhPhanDiemThi': TP,
        'TP_ToChucThi/LayDSLopHocPhan': LOP,
        'TP_ToChucThi/LayTTThanhPhanDiemTheoLop': function (o) {
            var s = SOTP[o.strDaoTao_LopHocPhan_Id] || [0, 0];
            return [{ DIEM_THANHPHANDIEM_ID: 'TPD01', SOSV: s[0] }, { DIEM_THANHPHANDIEM_ID: 'TPD02', SOSV: s[1] }];
        },
        'TP_ToChucThi/LayDSNguoiHocTheoLop': function (o) {
            var lop = LOP.filter(function (l) { return l.ID === o.strDaoTao_LopHocPhan_Id; })[0] || LOP[0];
            var tp = TP.filter(function (t) { return t.ID === o.strDiem_ThanhPhanDiem_Id; })[0] || TP[0];
            return HO.map(function (h, i) {
                return { ID: 'NH' + lop.ID + i, MASO: 'BBA22' + (561 + i), HODEM: h, TEN: TEN[i], DAOTAO_HOCPHAN_TEN: lop.DAOTAO_HOCPHAN_TEN, DAOTAO_HOCPHAN_MA: lop.DAOTAO_HOCPHAN_MA,
                    LANHOC: 1, LANTHI: tp.ID === 'TPD02' ? 2 : 1, DIEM_THANHPHANDIEM_TEN: tp.TEN, TRANGTHAI: i === 4 ? 'Không đủ điều kiện' : 'Đủ điều kiện dự thi' };
            });
        },
        'TP_Chung/LayTrangThaiTruocThi': TT,
        'TP_XacNhanTruocThi/LayDanhSach': LS,
        'TP_Chung/LayTrangThaiCongBoLich': CB,
        'TP_ToChucThi/LayDSThoiGian': [{ ID: 'TG2601', THOIGIAN: '2026_2027_1' }, { ID: 'TG2602', THOIGIAN: '2026_2027_2' }],
        'TP_ToChucThi/LayDSThanhPhanDiemSauThi': TP,
        'TP_ToChucThi/LayDSDotThi': [{ ID: 'DOT01', TENDOTTHI: 'Đợt thi kết thúc học kỳ 1', NGAYBD: '04/01/2027', NGAYKT: '17/01/2027' },
            { ID: 'DOT02', TENDOTTHI: 'Đợt thi bổ sung học kỳ 1', NGAYBD: '01/02/2027', NGAYKT: '07/02/2027' }],
        'TP_ToChucThi/LayDSHocPhan': [{ ID: 'HP01', DAOTAO_HOCPHAN_MA: 'ECO101', DAOTAO_HOCPHAN_TEN: 'Kinh tế vi mô' }, { ID: 'HP02', DAOTAO_HOCPHAN_MA: 'ACC201', DAOTAO_HOCPHAN_TEN: 'Nguyên lý kế toán' },
            { ID: 'HP03', DAOTAO_HOCPHAN_MA: 'ENG202', DAOTAO_HOCPHAN_TEN: 'Tiếng Anh thương mại 2' }],
        'PKG_THI_TOCHUCTHI.LayDSThi': function (o) {
            var hp = String(o.strDaoTao_HocPhan_Id || '').split(',').filter(Boolean);
            return DST.filter(function (d) { return !hp.length || hp.indexOf(d.DAOTAO_HOCPHAN_ID) >= 0; });
        },
        'TP_CongBoLichThi/LayDSQLTHI_CongBoLichThi': [{ TINHTRANG_TEN: 'Công bố', NOIDUNG: 'Công bố lịch thi đợt 1', NGUOIXACNHAN_TENDAYDU: 'Đỗ Thị Hằng', NGAYTAO_DD_MM_YYYY: '20/12/2026' }]
    });
})();
