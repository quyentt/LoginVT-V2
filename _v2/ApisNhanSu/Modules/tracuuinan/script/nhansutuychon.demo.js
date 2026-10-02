/* Dữ liệu mẫu cho nhansutuychon — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function dm(id, ma, ten, tenDM) { return { ID: id, MA: ma, TEN: ten, CHUNG_TENDANHMUC_TEN: tenDM || '' }; }
    ums.demo.add({
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#BACO.HTQT.NHSU': [
            dm('C1', 'MASO', 'Mã cán bộ'), dm('C2', 'HOTEN', 'Họ và tên'), dm('C3', 'NGAYSINHDAYDU', 'Ngày sinh'),
            dm('C4', 'GIOITINH_TEN', 'Giới tính'), dm('C5', 'DAOTAO_COCAUTOCHUC_TEN', 'Đơn vị'), dm('C6', 'EMAIL', 'Email')
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NS.LOCD': [dm('LCD1', 'GS', 'Giáo sư'), dm('LCD2', 'PGS', 'Phó giáo sư')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NS.DMHV': [dm('HV1', 'TS', 'Tiến sĩ'), dm('HV2', 'ThS', 'Thạc sĩ')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NS.GITI': [dm('GT1', '1', 'Nam'), dm('GT0', '0', 'Nữ')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#CHUN.DMTT': [
            { ID: 'T01', MA: '01', TEN: 'TP Hà Nội', QUANHECHA_ID: null }, { ID: 'T33', MA: '33', TEN: 'Tỉnh Hưng Yên', QUANHECHA_ID: null },
            { ID: 'H0101', MA: '005', TEN: 'Quận Cầu Giấy', QUANHECHA_ID: 'T01' }, { ID: 'H3301', MA: '330', TEN: 'Huyện Phù Cừ', QUANHECHA_ID: 'T33' }
        ],
        'NS_HoSoV2/LayDanhSach': [
            { ID: 'NS1', MASO: 'CB001', HOTEN: 'Nguyễn Văn Hùng', NGAYSINHDAYDU: '12/04/1975', GIOITINH_TEN: 'Nam', DAOTAO_COCAUTOCHUC_TEN: 'Khoa Công nghệ thông tin', EMAIL: 'hungnv@truong.edu.vn' },
            { ID: 'NS2', MASO: 'CB015', HOTEN: 'Trần Thị Mai', NGAYSINHDAYDU: '03/09/1988', GIOITINH_TEN: 'Nữ', DAOTAO_COCAUTOCHUC_TEN: 'Khoa Kinh tế', EMAIL: 'maitt@truong.edu.vn' }
        ]
    });
})();
