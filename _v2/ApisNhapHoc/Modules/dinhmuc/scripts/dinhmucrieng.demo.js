/* Dữ liệu mẫu cho Định mức riêng — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    ums.demo.crudStore('NH_DinhMuc_Rieng', [
        { ID: 'DMR1', TAICHINH_KEHOACHNHAPHOC_ID: 'KHNH2026', TAICHINH_KEHOACHNHAPHOC_TEN: 'Nhập học Đại học chính quy khóa 2026',
          TAICHINH_CACKHOANTHU_ID: 'KT1', TAICHINH_CACKHOANTHU_TEN: 'Học phí', APDUNGMIENGIAM_ID: '2', THUOCTINHTUYCHON: 1,
          DOITUONGDAOTAO_ID: 'DT1', DOITUONGDAOTAO_TEN: 'Sinh viên hệ chất lượng cao',
          DAOTAO_TOCHUCCHUONGTRINH_ID: 'CTKTPM', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Kỹ thuật phần mềm',
          SOTIEN_CHUNG: 8500000, SOTIEN: 12000000, THUTU: 1, MOTA: '' },
        { ID: 'DMR2', TAICHINH_KEHOACHNHAPHOC_ID: 'KHNH2026', TAICHINH_KEHOACHNHAPHOC_TEN: 'Nhập học Đại học chính quy khóa 2026',
          TAICHINH_CACKHOANTHU_ID: 'KT1', TAICHINH_CACKHOANTHU_TEN: 'Học phí', APDUNGMIENGIAM_ID: '0', THUOCTINHTUYCHON: 1,
          DOITUONGDAOTAO_ID: 'DT2', DOITUONGDAOTAO_TEN: 'Sinh viên liên kết',
          DAOTAO_TOCHUCCHUONGTRINH_ID: 'CTQTKD', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Quản trị kinh doanh',
          SOTIEN_CHUNG: 8500000, SOTIEN: 9500000, THUTU: 2, MOTA: 'Áp dụng từ học kỳ 1' },
        { ID: 'DMR3', TAICHINH_KEHOACHNHAPHOC_ID: 'KHNH2026B', TAICHINH_KEHOACHNHAPHOC_TEN: 'Nhập học bổ sung đợt 2 năm 2026',
          TAICHINH_CACKHOANTHU_ID: 'KT5', TAICHINH_CACKHOANTHU_TEN: 'Phí ký túc xá', APDUNGMIENGIAM_ID: '1', THUOCTINHTUYCHON: 0,
          DOITUONGDAOTAO_ID: 'DT1', DOITUONGDAOTAO_TEN: 'Sinh viên hệ chất lượng cao',
          DAOTAO_TOCHUCCHUONGTRINH_ID: 'CTKTPM', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Kỹ thuật phần mềm',
          SOTIEN_CHUNG: 350000, SOTIEN: 420000, THUTU: 3, MOTA: '' }
    ]);
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten }; }
    ums.demo.add({
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLSV.DOITUONG': [
            dm('DT1', 'CLC', 'Sinh viên hệ chất lượng cao'), dm('DT2', 'LK', 'Sinh viên liên kết'), dm('DT3', 'CT', 'Sinh viên chính quy đại trà')
        ]
    });
})();
