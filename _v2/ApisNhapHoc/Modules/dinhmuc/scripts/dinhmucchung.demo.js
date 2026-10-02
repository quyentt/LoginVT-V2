/* Dữ liệu mẫu cho Định mức chung — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    ums.demo.crudStore('NH_DinhMuc_Chung', [
        { ID: 'DMC1', TAICHINH_KEHOACHNHAPHOC_ID: 'KHNH2026', TAICHINH_KEHOACHNHAPHOC_TEN: 'Nhập học Đại học chính quy khóa 2026',
          TAICHINH_CACKHOANTHU_ID: 'KT1', TAICHINH_CACKHOANTHU_TEN: 'Học phí', APDUNGMIENGIAM_ID: '2', THUOCTINHTUYCHON: 1,
          SOTIEN: 8500000, THUTU: 1, TUDONGCANDOISANGPHAINOP: 1, MOTA: 'Thu ngay khi nhập học' },
        { ID: 'DMC2', TAICHINH_KEHOACHNHAPHOC_ID: 'KHNH2026', TAICHINH_KEHOACHNHAPHOC_TEN: 'Nhập học Đại học chính quy khóa 2026',
          TAICHINH_CACKHOANTHU_ID: 'KT4', TAICHINH_CACKHOANTHU_TEN: 'Bảo hiểm y tế', APDUNGMIENGIAM_ID: '0', THUOCTINHTUYCHON: 1,
          SOTIEN: 884520, THUTU: 2, TUDONGCANDOISANGPHAINOP: 0, MOTA: '' },
        { ID: 'DMC3', TAICHINH_KEHOACHNHAPHOC_ID: 'KHNH2026', TAICHINH_KEHOACHNHAPHOC_TEN: 'Nhập học Đại học chính quy khóa 2026',
          TAICHINH_CACKHOANTHU_ID: 'KT5', TAICHINH_CACKHOANTHU_TEN: 'Phí ký túc xá', APDUNGMIENGIAM_ID: '1', THUOCTINHTUYCHON: 0,
          SOTIEN: 350000, THUTU: 3, TUDONGCANDOISANGPHAINOP: 2, MOTA: 'Sinh viên tự chọn' }
    ]);
    ums.demo.add({
        'NH_DinhMuc_Rieng/LayDanhSach': [
            { ID: 'DMR1', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Kỹ thuật phần mềm', DOITUONGDAOTAO_TEN: 'Sinh viên hệ chất lượng cao', SOTIEN: 12000000 },
            { ID: 'DMR2', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Quản trị kinh doanh', DOITUONGDAOTAO_TEN: 'Sinh viên liên kết', SOTIEN: 9500000 }
        ]
    });
})();
