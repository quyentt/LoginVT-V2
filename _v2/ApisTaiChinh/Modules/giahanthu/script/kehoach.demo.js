/* Dữ liệu mẫu cho giahanthu/kehoach — chỉ dùng ở chế độ dựng thử.
   Hệ, sinh viên (hộp chọn), khoản thu: xem dulieuhocphi/scripts/_chung.demo.js và demo-data.js */
(function () {
    'use strict';
    var P = 'TC_KeHoachThu_GiaHan/';
    var KH = [
        { ID: 'KHT1', HIEULUC: 1, TENKEHOACH: 'Kế hoạch thu học phí HK1 2025-2026', NGAYBATDAU: '01/09/2025', NGAYKETTHUC: '31/10/2025', BATCHEDOCANHBAOCHOSV: 1, NGAYTAO_DD_MM_YYYY_HHMMSS: '20/08/2025 09:15:00', NGUOITAO_TAIKHOAN: 'lannt' },
        { ID: 'KHT2', HIEULUC: 1, TENKEHOACH: 'Kế hoạch thu học phí học lại HK1 2025-2026', NGAYBATDAU: '15/09/2025', NGAYKETTHUC: '15/11/2025', BATCHEDOCANHBAOCHOSV: 0, NGAYTAO_DD_MM_YYYY_HHMMSS: '25/08/2025 14:02:11', NGUOITAO_TAIKHOAN: 'lannt' },
        { ID: 'KHT3', HIEULUC: 0, TENKEHOACH: 'Kế hoạch thu học phí HK2 2024-2025', NGAYBATDAU: '15/01/2025', NGAYKETTHUC: '15/03/2025', BATCHEDOCANHBAOCHOSV: 1, NGAYTAO_DD_MM_YYYY_HHMMSS: '05/01/2025 08:40:30', NGUOITAO_TAIKHOAN: 'hoanv' }
    ];
    ums.demo.add({
        'TC_KeHoachThu_GiaHan/LayDSTaiChinh_KeHoachThuTien': function (o) {
            var q = (o.strTuKhoa || '').toLowerCase();
            return KH.filter(function (k) {
                return (o.dHieuLuc === '' || o.dHieuLuc === undefined || String(k.HIEULUC) === String(o.dHieuLuc)) &&
                    (!q || k.TENKEHOACH.toLowerCase().indexOf(q) >= 0);
            });
        },
        'TC_KeHoachThu_GiaHan/LayDSTaiChinh_PhamViThu': [
            { ID: 'PV1', PHAMVIAPDUNG_TEN: 'Khóa 2022 (K66)' },
            { ID: 'PV2', PHAMVIAPDUNG_TEN: 'Khóa 2023 (K67)' },
            { ID: 'PV3', PHAMVIAPDUNG_TEN: 'Đăng ký học chính thức HK1 2025-2026' }
        ],
        'TC_KeHoachThu_GiaHan/LayDSTaiChinh_PhamViThu_Khong': [
            { ID: 'PK1', PHAMVIAPDUNG_TEN: 'BIT220263 - Nguyễn Văn An' }
        ],
        'TC_KeHoachThu_GiaHan/LayDSTaiChinh_PhamViThu_GiaHan': [
            { ID: 'GH1', PHAMVIAPDUNG_TEN: 'BBA220561 - Phạm Thu Dung', NGAYKETTHUC: '30/11/2025', MOTA: 'Hoàn cảnh khó khăn' },
            { ID: 'GH2', PHAMVIAPDUNG_TEN: 'Lớp KT 67A', NGAYKETTHUC: '15/11/2025', MOTA: '' }
        ],
        'TC_KeHoachThu_GiaHan/LayDSTaiChinh_KeHoach_Khoan': [
            { ID: 'KK1', TAICHINH_CACKHOANTHU_TEN: 'Học phí', THOIGIAN: 'HK1 2025-2026' },
            { ID: 'KK2', TAICHINH_CACKHOANTHU_TEN: 'Học phí học lại', THOIGIAN: 'HK1 2025-2026' }
        ],
        'TC_KeHoachThu_GiaHan/LayDSThoiGian': [
            { ID: 'TG1', THOIGIAN: 'HK1 2025-2026' }, { ID: 'TG2', THOIGIAN: 'HK2 2025-2026' }
        ],
        'TC_KeHoachThu_GiaHan/LayDSKeHoachDangKyHoc': function (o) {
            return o.strDaoTao_ThoiGianDaoTao_Id ? [
                { ID: 'KHDK1', TENKEHOACH: 'Đăng ký học chính thức HK1 2025-2026' },
                { ID: 'KHDK2', TENKEHOACH: 'Đăng ký học bổ sung HK1 2025-2026' }
            ] : [];
        },
        'SV_QuyetDinh_ThucThi/LayDSLoaiQuyetDinh': [
            { ID: 'LQD1', TEN: 'Quyết định gia hạn học phí' }, { ID: 'LQD2', TEN: 'Quyết định miễn giảm' }
        ],
        'SV_QuyetDinh/LayDanhSach': function (o) {
            return o.strLoaiQuyetDinh_Id ? [{ ID: 'QD1', SOQUYETDINH: '1520/QĐ-ĐHKT' }, { ID: 'QD2', SOQUYETDINH: '1633/QĐ-ĐHKT' }] : [];
        },
        'pkg_taichinh_kehoachthu_giahan.LayDSTC_KhoanThu_KhongKTra': [
            { ID: 'KX1', TAICHINH_CACKHOANTHU_TEN: 'Lệ phí tốt nghiệp', TAICHINH_CACKHOANTHU_MA: 'LPTN', PHAMVIAPDUNG_TEN: 'Khóa 2022 (K66)' },
            { ID: 'KX2', TAICHINH_CACKHOANTHU_TEN: 'Bảo hiểm y tế', TAICHINH_CACKHOANTHU_MA: 'BHYT', PHAMVIAPDUNG_TEN: 'BIT220274 - Trần Thị Bình' }
        ],
        'pkg_taichinh_thuchi2.ThongKeNoPhiTheoKhoaHoc': function (o) {
            return o.strDaoTao_HeDaoTao_Id ? [
                { ID: 'K1', TENKHOA: 'Khóa 2022 (K66)', THOIGIAN: 'HK2 2024-2025', DAOTAO_THOIGIANDAOTAO_ID: 'TG0', TAICHINH_CACKHOANTHU_ID: 'KT1', TAICHINH_CACKHOANTHU_TEN: 'Học phí', TONGTIENNO: 185400000 },
                { ID: 'K2', TENKHOA: 'Khóa 2023 (K67)', THOIGIAN: 'HK2 2024-2025', DAOTAO_THOIGIANDAOTAO_ID: 'TG0', TAICHINH_CACKHOANTHU_ID: 'KT1', TAICHINH_CACKHOANTHU_TEN: 'Học phí', TONGTIENNO: 96250000 },
                { ID: 'K1', TENKHOA: 'Khóa 2022 (K66)', THOIGIAN: 'HK2 2024-2025', DAOTAO_THOIGIANDAOTAO_ID: 'TG0', TAICHINH_CACKHOANTHU_ID: 'KT2', TAICHINH_CACKHOANTHU_TEN: 'Học phí học lại', TONGTIENNO: 12600000 }
            ] : [];
        },
        'pkg_taichinh_chung.LayTTThamSoChungThanhToan': [{ CHANTTKHIKHONGCOKEHOACHTHU: 1 }]
    });
    void P;
})();
