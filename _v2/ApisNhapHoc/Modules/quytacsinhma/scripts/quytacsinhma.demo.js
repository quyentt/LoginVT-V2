/* Dữ liệu mẫu cho Quy tắc sinh mã — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    ums.demo.crudStore('NH_QuyTacSinhMa', [
        { ID: 'QT1', TAICHINH_KEHOACHNHAPHOC_ID: 'KHNH2026', TAICHINH_KEHOACHNHAPHOC_TEN: 'Nhập học Đại học chính quy khóa 2026',
          THUTU: 1, TEN: 'Mã trường', THANHPHANCAUTRUCMA_ID: 'CT1', THANHPHANCAUTRUCMA_TEN: 'Giá trị cố định', GIATRIMACDINH: 'DC',
          DODAI: 2, MUCAPDUNG_ID: 'MA1', MUCAPDUNG_TEN: 'Toàn trường' },
        { ID: 'QT2', TAICHINH_KEHOACHNHAPHOC_ID: 'KHNH2026', TAICHINH_KEHOACHNHAPHOC_TEN: 'Nhập học Đại học chính quy khóa 2026',
          THUTU: 2, TEN: 'Năm nhập học', THANHPHANCAUTRUCMA_ID: 'CT2', THANHPHANCAUTRUCMA_TEN: 'Năm nhập học (2 số cuối)', GIATRIMACDINH: '',
          DODAI: 2, MUCAPDUNG_ID: 'MA1', MUCAPDUNG_TEN: 'Toàn trường' },
        { ID: 'QT3', TAICHINH_KEHOACHNHAPHOC_ID: 'KHNH2026', TAICHINH_KEHOACHNHAPHOC_TEN: 'Nhập học Đại học chính quy khóa 2026',
          THUTU: 3, TEN: 'Số thứ tự', THANHPHANCAUTRUCMA_ID: 'CT3', THANHPHANCAUTRUCMA_TEN: 'Số tăng dần', GIATRIMACDINH: '0001',
          DODAI: 4, MUCAPDUNG_ID: 'MA2', MUCAPDUNG_TEN: 'Theo ngành' }
    ]);
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten }; }
    ums.demo.add({
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLSV.CAUTRUCMA': [
            dm('CT1', 'CODINH', 'Giá trị cố định'), dm('CT2', 'NAM', 'Năm nhập học (2 số cuối)'), dm('CT3', 'STT', 'Số tăng dần'), dm('CT4', 'NGANH', 'Mã ngành')
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLSV.MUCAPDUNG': [
            dm('MA1', 'TRUONG', 'Toàn trường'), dm('MA2', 'NGANH', 'Theo ngành'), dm('MA3', 'LOP', 'Theo lớp')
        ]
    });
})();
