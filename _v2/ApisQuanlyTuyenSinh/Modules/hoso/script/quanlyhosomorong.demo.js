/* Dữ liệu mẫu — Quản lý hồ sơ - mở rộng (tuyển sinh). */
ums.demo.add({
    'TS_DuLieu/LayDSCauHienThiHoSo': [
        { THANHPHAN_ID: 'G1', THANHPHAN_CHA_ID: null, THANHPHAN_TEN: 'Thông tin cá nhân' },
        { THANHPHAN_ID: 'C1', THANHPHAN_CHA_ID: 'G1', THANHPHAN_TEN: 'Ảnh' },
        { THANHPHAN_ID: 'C2', THANHPHAN_CHA_ID: 'G1', THANHPHAN_TEN: 'Họ tên' },
        { THANHPHAN_ID: 'C3', THANHPHAN_CHA_ID: 'G1', THANHPHAN_TEN: 'Ngày sinh' },
        { THANHPHAN_ID: 'G2', THANHPHAN_CHA_ID: null, THANHPHAN_TEN: 'Hồ sơ' },
        { THANHPHAN_ID: 'C4', THANHPHAN_CHA_ID: 'G2', THANHPHAN_TEN: 'Học bạ' },
        { THANHPHAN_ID: 'C5', THANHPHAN_CHA_ID: null, THANHPHAN_TEN: 'Ghi chú' }
    ],
    'TS_DuLieu/LayDSDuLieuHienThiHoSo': function (o) {
        var id = String(o.strTS_HoSoDuTuyen_Id);
        return [
            { THANHPHAN_ID: 'C1', KIEUDULIEU: 'ANHCANHAN', THANHPHAN_GIATRI: 'Upload/Avatar/' + id + '.jpg' },
            { THANHPHAN_ID: 'C2', KIEUDULIEU: 'TEXT', THANHPHAN_GIATRI: 'Thí sinh ' + id },
            { THANHPHAN_ID: 'C3', KIEUDULIEU: 'DATE', THANHPHAN_GIATRI: '12/03/2008' },
            { THANHPHAN_ID: 'C4', KIEUDULIEU: 'FILE', THANHPHAN_GIATRI: '' },
            { THANHPHAN_ID: 'C5', KIEUDULIEU: 'TEXT', THANHPHAN_GIATRI: 'Đủ hồ sơ' }
        ];
    },
    'TS_ThiSinh_NguyenVong/LayDSTS_ThiSinh_TrungTuyen': [
        { ID: 'TT01', NGANHNGHE_MA: '7480103', NGANHNGHE_TEN: 'Kỹ thuật phần mềm' }
    ],
    'TS_TinhToan/ThucHienTongHopDuLieu': [],
    'TS_XetTuyen/Them_TS_ThiSinh_TrungTuyen': [],
    'TS_XetTuyen/Xoa_TS_ThiSinh_TrungTuyen': []
});
