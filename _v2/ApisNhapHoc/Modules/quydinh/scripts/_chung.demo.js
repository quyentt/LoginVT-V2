/* Dữ liệu mẫu dùng chung module Quy định hồ sơ (Nhập học) — chỉ dùng ở chế độ dựng thử. */
(function () {
    function dm(id, ma, ten, tenDM) { return { ID: id, MA: ma, TEN: ten, CHUNG_TENDANHMUC_TEN: tenDM }; }
    var B = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    var fx = {
        'PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc': [
            { ID: 'NHKH1', TENKEHOACH: 'Thu học phí sinh viên nhập học 2025-2026', NGAYBATDAU: '15/08/2025', NGAYKETTHUC: '30/09/2025',
              DAOTAO_KHOADAOTAO_ID: 'K67', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67' },
            { ID: 'NHKH2', TENKEHOACH: 'Nhập học bổ sung đợt 2 năm 2025', NGAYBATDAU: '01/10/2025', NGAYKETTHUC: '20/10/2025',
              DAOTAO_KHOADAOTAO_ID: 'K67', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67' },
            { ID: 'NHKH3', TENKEHOACH: 'Thu học phí sinh viên nhập học 2024-2025', NGAYBATDAU: '12/08/2024', NGAYKETTHUC: '25/09/2024',
              DAOTAO_KHOADAOTAO_ID: 'K68', DAOTAO_KHOADAOTAO_TEN: 'Khóa 68' }
        ]
    };
    fx[B + 'NHAPHOC.HOSO'] = [dm('HS1', 'HOCBA', 'Học bạ THPT (bản sao)', 'Loại hồ sơ'), dm('HS2', 'GIAYKS', 'Giấy khai sinh', 'Loại hồ sơ'),
        dm('HS3', 'ANH34', 'Ảnh 3x4', 'Loại hồ sơ'), dm('HS4', 'CCCD', 'Căn cước công dân (bản sao)', 'Loại hồ sơ')];
    fx[B + 'NHAPHOC.TINHCHAT'] = [dm('TC1', 'BATBUOC', 'Bắt buộc', 'Tính chất hồ sơ'), dm('TC2', 'KHONGBB', 'Không bắt buộc', 'Tính chất hồ sơ')];
    fx[B + 'NHAPHOC.NHOM'] = [dm('NM1', 'CANHAN', 'Hồ sơ cá nhân', 'Nhóm hồ sơ'), dm('NM2', 'HOCTAP', 'Hồ sơ học tập', 'Nhóm hồ sơ')];
    fx[B + 'NHAPHOC.KIEUDULIEU'] = [dm('KD1', 'GIAY', 'Bản giấy', 'Kiểu dữ liệu'), dm('KD2', 'FILE', 'Tệp điện tử', 'Kiểu dữ liệu')];
    fx[B + 'NHAPHOC.PHANCAP'] = [dm('PC1', 'CHUONGTRINH', 'Chương trình đào tạo', 'Phân cấp áp dụng'),
        dm('PC2', 'LOPQUANLY', 'Lớp quản lý', 'Phân cấp áp dụng'), dm('PC3', 'TOANTRUONG', 'Toàn trường', 'Phân cấp áp dụng')];
    ums.demo.add(fx);
})();
