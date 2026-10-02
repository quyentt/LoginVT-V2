/* Dữ liệu mẫu cho import_phantrammiengiam — chỉ dùng ở chế độ dựng thử.
   Học kỳ, kiểu học, mẫu import, tệp Excel đọc được: _chung_tracuu.js. */
(function () {
    'use strict';
    var T = ums.tcTraCuu;

    var ROWS = [
        { ID: 'PT01', MASO: 'SV2201001', HODEM: 'Nguyễn Văn', TEN: 'An', PHANTRAMMIENGIAM: 25, QLSV_DOITUONG_TEN: 'Con thương binh', NOIDUNG: 'Miễn giảm học phí HK1' },
        { ID: 'PT02', MASO: 'SV2201019', HODEM: 'Hoàng Thị', TEN: 'Mai', PHANTRAMMIENGIAM: 50, QLSV_DOITUONG_TEN: 'Hộ nghèo', NOIDUNG: 'Miễn giảm học phí HK1' },
        { ID: 'PT03', MASO: 'SV2304077', HODEM: 'Lò Văn', TEN: 'Tâm', PHANTRAMMIENGIAM: 100, QLSV_DOITUONG_TEN: 'Dân tộc thiểu số vùng ĐBKK', NOIDUNG: 'Miễn học phí HK1' },
        { ID: 'PT04', MASO: 'SV2305041', HODEM: 'Đinh Công', TEN: 'Sơn', PHANTRAMMIENGIAM: 70, QLSV_DOITUONG_TEN: 'Khuyết tật', NOIDUNG: 'Miễn giảm học phí HK1' }
    ];

    ums.demo.add({
        'TC_Import_PhanTramMienGiam/LayDanhSach': function (o) {
            return T.demoPage(T.demoLike(ROWS, o.strTuKhoa, ['MASO', 'TEN', 'NOIDUNG']), o);
        },
        'TC_Import_PhanTramMienGiam/LayDSThongTinImport_DT_MG': [
            { ID: 'PTMG_HK1_2627', TEN: 'PTMG_HK1_2627' }
        ],
        'TC_Import_PhanTramMienGiam/Import': {
            rows: {
                Table1: [{ MASO: 'SV2201001', HODEM: 'Nguyễn Văn', TEN: 'An', PHANTRAMMIEN: 25, QLSV_DOITUONG_TEN: 'Con thương binh', NOIDUNG: 'Miễn giảm học phí HK1' }],
                Table2: [{ MASO: 'SV2201999', HODEM: 'Trịnh', TEN: 'Hùng', PHANTRAMMIEN: 30, NOIDUNGLOI: 'Sinh viên không thuộc đối tượng miễn giảm' }]
            }
        }
    });
})();
