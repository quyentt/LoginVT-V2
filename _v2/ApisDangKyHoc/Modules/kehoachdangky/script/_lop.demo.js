/* Dữ liệu mẫu dùng chung cho lophoc · donlop · quanlytoanbo · lichsu — chỉ dùng ở chế độ dựng thử. */
(function () {
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten }; }
    ums.demo.add({
        'DKH_Chung/LayThoiGianDangKyHoc': [
            { ID: 'TG1', DAOTAO_THOIGIANDAOTAO: '2025-2026_2' },
            { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: '2026-2027_1' },
            { ID: 'TG3', DAOTAO_THOIGIANDAOTAO: '2026-2027_2' }
        ],
        'KHCT_NamNhapHoc/LayDanhSach': [{ NAMNHAPHOC: '2022' }, { NAMNHAPHOC: '2023' }, { NAMNHAPHOC: '2024' }, { NAMNHAPHOC: '2025' }],
        'pkg_kehoach_thongtin.LayDSKhoaQuanLy': [{ ID: 'KQL1', TEN: 'Khoa Công nghệ thông tin' }, { ID: 'KQL2', TEN: 'Khoa Kinh tế' }],
        'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao': [
            { ID: 'TG1', DAOTAO_THOIGIANDAOTAO: '2025-2026_2' },
            { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: '2026-2027_1' }
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DIEM.DANHGIA': [dm('DG1', 'DAT', 'Đạt'), dm('DG2', 'KDAT', 'Không đạt'), dm('DG3', 'CHUA', 'Chưa có điểm')]
    });
})();
