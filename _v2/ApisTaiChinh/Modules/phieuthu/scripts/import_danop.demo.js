/* Dữ liệu mẫu cho import_danop — chỉ dùng ở chế độ dựng thử.
   Học kỳ, mẫu import, tệp Excel đọc được: _chung_tracuu.js. */
(function () {
    'use strict';
    var T = ums.tcTraCuu;

    var CHUA = [
        { ID: 'DN01', MASO: 'SV2201001', HODEM: 'Nguyễn Văn', TEN: 'An', SOTIEN: 9800000, MAGIAODICHCHUYENTIEN: 'FT26241877301', NOIDUNG: 'SV2201001 nop hoc phi HK1', DAOTAO_THOIGIANDAOTAO_ID: 'TG4', TAICHINH_CACKHOANTHU_ID: 'KT1' },
        { ID: 'DN02', MASO: 'SV2201002', HODEM: 'Trần Thị', TEN: 'Bình', SOTIEN: 9800000, MAGIAODICHCHUYENTIEN: 'FT26241877355', NOIDUNG: 'SV2201002 hoc phi ky 1', DAOTAO_THOIGIANDAOTAO_ID: 'TG4', TAICHINH_CACKHOANTHU_ID: 'KT1' },
        { ID: 'DN03', MASO: 'SV2201015', HODEM: 'Lê Hoàng', TEN: 'Cường', SOTIEN: 4900000, MAGIAODICHCHUYENTIEN: 'FT26242011209', NOIDUNG: 'Nop HP dot 1 SV2201015', DAOTAO_THOIGIANDAOTAO_ID: 'TG4', TAICHINH_CACKHOANTHU_ID: 'KT1' },
        { ID: 'DN04', MASO: 'SV2305020', HODEM: 'Phạm Minh', TEN: 'Đức', SOTIEN: 1200000, MAGIAODICHCHUYENTIEN: 'FT26242100470', NOIDUNG: 'KTX thang 9 SV2305020', DAOTAO_THOIGIANDAOTAO_ID: 'TG4', TAICHINH_CACKHOANTHU_ID: 'KT5' },
        { ID: 'DN05', MASO: 'SV2304118', HODEM: 'Vũ Thị Thu', TEN: 'Hà', SOTIEN: 250000, MAGIAODICHCHUYENTIEN: 'FT26242235811', NOIDUNG: 'Le phi thi lai', DAOTAO_THOIGIANDAOTAO_ID: 'TG2', TAICHINH_CACKHOANTHU_ID: 'KT2' }
    ];
    var DA = [
        { ID: 'DH01', MASO: 'SV2201007', HODEM: 'Đỗ Quang', TEN: 'Huy', SOTIEN: 9800000, NOIDUNG: 'Nộp học phí HK2', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 năm 2025-2026', TAICHINH_CACKHOANTHU_TEN: 'Học phí', CHUNGTU_SO: 'PT000512' },
        { ID: 'DH02', MASO: 'SV2201011', HODEM: 'Ngô Thị', TEN: 'Lan', SOTIEN: 9800000, NOIDUNG: 'Nộp học phí HK2', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 năm 2025-2026', TAICHINH_CACKHOANTHU_TEN: 'Học phí', CHUNGTU_SO: 'PT000513' },
        { ID: 'DH03', MASO: 'SV2305002', HODEM: 'Bùi Văn', TEN: 'Nam', SOTIEN: 1200000, NOIDUNG: 'Ký túc xá tháng 3', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 năm 2025-2026', TAICHINH_CACKHOANTHU_TEN: 'Phí ký túc xá', CHUNGTU_SO: 'PT000530' }
    ];

    ums.demo.add({
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TAICHINH.IMPORT.BANGDULIEU.THU': [
            { ID: 'BDT1', MA: 'NGANHANG', TEN: 'Dữ liệu ngân hàng gửi về', THONGTIN8: 'CHON' },
            { ID: 'BDT2', MA: 'VNPAY', TEN: 'Dữ liệu đối soát VNPAY' }
        ],
        'TC_Import/LayDS_Import_DaNop': function (o) {
            var rows = Number(o.dDaChuyenKeToan) === 1 ? DA : CHUA.filter(function (r) {
                return (!o.strDaoTao_ThoiGianDaoTao_Id || r.DAOTAO_THOIGIANDAOTAO_ID === o.strDaoTao_ThoiGianDaoTao_Id) &&
                    (!o.strTaiChinh_CacKhoanThu_Id || r.TAICHINH_CACKHOANTHU_ID === o.strTaiChinh_CacKhoanThu_Id);
            });
            return T.demoPage(T.demoLike(rows, o.strTuKhoa, ['MASO', 'TEN', 'NOIDUNG']), o);
        },
        'TC_Import_DaNop/LayDSThongTinImport_DaNop': [
            { ID: 'DOT_NH_0901', TEN: 'DOT_NH_0901' },
            { ID: 'DOT_NH_0915', TEN: 'DOT_NH_0915' }
        ],
        'TC_Import_DaNop/Import': {
            rows: {
                Table1: [
                    { MASO: 'SV2201001', HODEM: 'Nguyễn Văn', TEN: 'An', SOTIEN: 9800000, MAGIAODICHCHUYENTIEN: 'FT26241877301', NOIDUNG: 'Nộp học phí HK1' },
                    { MASO: 'SV2201002', HODEM: 'Trần Thị', TEN: 'Bình', SOTIEN: 9800000, MAGIAODICHCHUYENTIEN: 'FT26241877355', NOIDUNG: 'Nộp học phí HK1' }
                ],
                Table2: [
                    { MASO: 'SV2299999', HODEM: 'Không', TEN: 'Tồn Tại', SOTIEN: 4900000, NOIDUNG: 'Nộp học phí HK1', GHICHU: '', NOIDUNGLOI: 'Không tìm thấy mã sinh viên' }
                ]
            }
        }
    });
})();
