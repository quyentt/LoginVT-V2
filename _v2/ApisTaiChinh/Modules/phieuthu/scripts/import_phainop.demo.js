/* Dữ liệu mẫu cho import_phainop — chỉ dùng ở chế độ dựng thử.
   Học kỳ, mẫu import, tệp Excel đọc được: _chung_tracuu.js. */
(function () {
    'use strict';
    var T = ums.tcTraCuu;

    var CHUA = [
        { ID: 'PN01', MASO: 'SV2201001', HODEM: 'Nguyễn Văn', TEN: 'An', SOTIEN: 9800000, MAGIAODICHCHUYENTIEN: '', NOIDUNG: 'Học phí HK1 2026-2027' },
        { ID: 'PN02', MASO: 'SV2201002', HODEM: 'Trần Thị', TEN: 'Bình', SOTIEN: 9800000, MAGIAODICHCHUYENTIEN: '', NOIDUNG: 'Học phí HK1 2026-2027' },
        { ID: 'PN03', MASO: 'SV2305020', HODEM: 'Phạm Minh', TEN: 'Đức', SOTIEN: 3600000, MAGIAODICHCHUYENTIEN: '', NOIDUNG: 'Ký túc xá quý 3' },
        { ID: 'PN04', MASO: 'SV2304118', HODEM: 'Vũ Thị Thu', TEN: 'Hà', SOTIEN: 563000, MAGIAODICHCHUYENTIEN: '', NOIDUNG: 'Bảo hiểm y tế 12 tháng' }
    ];
    var DA = [
        { ID: 'PH01', MASO: 'SV2201007', HODEM: 'Đỗ Quang', TEN: 'Huy', SOTIEN: 9800000, NOIDUNG: 'Học phí HK2', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 năm 2025-2026', TAICHINH_CACKHOANTHU_TEN: 'Học phí', CHUNGTU_SO: 'CN000118' },
        { ID: 'PH02', MASO: 'SV2201011', HODEM: 'Ngô Thị', TEN: 'Lan', SOTIEN: 9800000, NOIDUNG: 'Học phí HK2', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 năm 2025-2026', TAICHINH_CACKHOANTHU_TEN: 'Học phí', CHUNGTU_SO: 'CN000119' }
    ];

    ums.demo.add({
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TAICHINH.IMPORT.BANGDULIEU.CHI': [
            { ID: 'BDC1', MA: 'CONGNO', TEN: 'Công nợ phải thu', CHUNG_TENDANHMUC_TEN: 'Bảng dữ liệu chi' },
            { ID: 'BDC2', MA: 'CONGNOKHAC', TEN: 'Công nợ khoản khác', CHUNG_TENDANHMUC_TEN: 'Bảng dữ liệu chi' }
        ],
        'TC_Import/LayDS_Import_PhaiNop': function (o) {
            return T.demoPage(T.demoLike(Number(o.dDaChuyenKeToan) === 1 ? DA : CHUA, o.strTuKhoa, ['MASO', 'TEN', 'NOIDUNG']), o);
        },
        'TC_Import/LayDSThongTinImport_PhaiNop': [
            { ID: 'PN_HK1_2627', TEN: 'PN_HK1_2627' }
        ],
        'TC_Import_PhaiNop/Import': {
            rows: {
                Table1: [
                    { MASO: 'SV2201001', HODEM: 'Nguyễn Văn', TEN: 'An', SOTIEN: 9800000, MAGIAODICHCHUYENTIEN: '', NOIDUNG: 'Học phí HK1 2026-2027' }
                ],
                Table2: [
                    { MASO: "SV2299999", HODEM: "Không", TEN: "Tồn Tại", SOTIEN: 9800000, NOIDUNG: "Học phí HK1 2026-2027", NOIDUNGLOI: "Không tìm thấy mã sinh viên" }
                ]
            }
        },
        'Sys_Report/ThemMoi': { rows: [], message: 'BC_DEMO_01' }
    });
})();
