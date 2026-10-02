/* Dữ liệu mẫu cho dongiatheodai — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function r(id, ten, tgId, tg, bd, kt, pl) {
        return { ID: id, TEN: ten, DAOTAO_THOIGIANDAOTAO_ID: tgId, DAOTAO_THOIGIANDAOTAO: tg, NGAYBATDAU: bd, NGAYKETTHUC: kt, PHANLOAI_TEN: pl };
    }
    ums.demo.add({
        'TC_Chung/LayDSPhanCapApDung': [{ ID: 'PC1', TEN: 'Theo lớp học phần' }, { ID: 'PC2', TEN: 'Theo lớp quản lý' }, { ID: 'PC3', TEN: 'Theo chương trình' }],
        'TC_ThuChi2/LayDSThoiGian': [{ ID: 'TG231', TEN: 'Học kỳ 1 năm 2023-2024' }, { ID: 'TG232', TEN: 'Học kỳ 2 năm 2023-2024' }, { ID: 'TG241', TEN: 'Học kỳ 1 năm 2024-2025' }],
        'TC_ThuChi2/LayDSKieuHocDVP_SiSo_SoTien': [{ ID: 'KHOC1', TEN: 'Học mới' }, { ID: 'KHOC2', TEN: 'Học lại' }],
        'TC_ThuChi2/LayDSPhamViDVP_SiSo_SoTien': [
            r('DG1', 'Lớp học phần dưới 20 sinh viên', 'TG231', 'Học kỳ 1 năm 2023-2024', '01/09/2023', '15/01/2024', 'Theo lớp học phần'),
            r('DG2', 'Lớp học phần 20 - 40 sinh viên', 'TG231', 'Học kỳ 1 năm 2023-2024', '01/09/2023', '15/01/2024', 'Theo lớp học phần'),
            r('DG3', 'Lớp học phần trên 40 sinh viên', 'TG232', 'Học kỳ 2 năm 2023-2024', '20/01/2024', '30/06/2024', 'Theo lớp học phần'),
            r('DG4', 'Lớp quản lý chất lượng cao', 'TG241', 'Học kỳ 1 năm 2024-2025', '01/09/2024', '15/01/2025', 'Theo lớp quản lý')
        ]
    });
})();
