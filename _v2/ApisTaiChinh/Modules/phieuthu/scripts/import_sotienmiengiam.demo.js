/* Dữ liệu mẫu cho import_sotienmiengiam — chỉ dùng ở chế độ dựng thử.
   Học kỳ, kiểu học, mẫu import, tệp Excel đọc được: _chung_tracuu.js. */
(function () {
    'use strict';
    var T = ums.tcTraCuu;

    var ROWS = [
        { ID: 'ST01', MASO: 'SV2201001', HODEM: 'Nguyễn Văn', TEN: 'An', SOTIEN: 2450000, QLSV_DOITUONG_TEN: 'Con thương binh', NOIDUNG: 'Miễn giảm 25% học phí HK1' },
        { ID: 'ST02', MASO: 'SV2201019', HODEM: 'Hoàng Thị', TEN: 'Mai', SOTIEN: 4900000, QLSV_DOITUONG_TEN: 'Hộ nghèo', NOIDUNG: 'Miễn giảm 50% học phí HK1' },
        { ID: 'ST03', MASO: 'SV2304077', HODEM: 'Lò Văn', TEN: 'Tâm', SOTIEN: 9800000, QLSV_DOITUONG_TEN: 'Dân tộc thiểu số vùng ĐBKK', NOIDUNG: 'Miễn 100% học phí HK1' }
    ];

    ums.demo.add({
        'TC_Import_SoTienMienGiam/LayDanhSach': function (o) {
            return T.demoPage(T.demoLike(ROWS, o.strTuKhoa, ['MASO', 'TEN', 'NOIDUNG']), o);
        },
        'TC_Import_SoTienMienGiam/LayDSThongTinImport_DT_ST': [
            { ID: 'MG_HK1_2627', TEN: 'MG_HK1_2627' }
        ],
        'TC_Import_SoTienMienGiam/Import': {
            rows: {
                Table1: [{ MASO: 'SV2201001', HODEM: 'Nguyễn Văn', TEN: 'An', SOTIEN: 2450000, QLSV_DOITUONG_TEN: 'Con thương binh', NOIDUNG: 'Miễn giảm 25% học phí HK1' }],
                Table2: []
            }
        }
    });
})();
