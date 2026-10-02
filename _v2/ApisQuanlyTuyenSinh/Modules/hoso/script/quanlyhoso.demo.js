/* Dữ liệu mẫu — Quản lý hồ sơ (tuyển sinh). */
ums.demo.add({
    'TS_TaiKhoan/LayDSThongTinTheoKeHoach': [
        { ID: 'TT1', TEN: 'Số CCCD', KIEUDULIEU: 'TEXT' },
        { ID: 'TT2', TEN: 'Trường THPT', KIEUDULIEU: 'LIST' },
        { ID: 'TT3', TEN: 'Học bạ', KIEUDULIEU: 'FILE' }
    ],
    'TS_TaiKhoan/LayKQTS_KeHoach_DuLieu': function (o) {
        var v = { TT1: '0012080' + String(o.strTS_HoSoTuyenSinh_Id).slice(-2) + '345', TT2: 'THPT Chu Văn An', TT3: 'x' };
        return [{ TRUONGTHONGTIN_GIATRI_TEN_CUOI: v[o.strTruongThongTin_Id] || '' }];
    },
    'TS_ThiSinh_KetQua/LayDSMonThiTheoThiSinh': [
        { ID: 'MT1', TS_MONTHI_TEN: 'Toán', DIEM: '8.5' }, { ID: 'MT2', TS_MONTHI_TEN: 'Vật lý', DIEM: '7.75' },
        { ID: 'MT3', TS_MONTHI_TEN: 'Hóa học', DIEM: '' }, { ID: 'MT4', TS_MONTHI_TEN: 'Tiếng Anh', DIEM: '9.0' }
    ],
    'TS_DuLieu/LayDSLichSuCapNhatHoSo': [
        { HANHDONG: 'Sửa', TRUONGTHONGTIN_ID: 'TT1', TRUONGTHONGTIN_TEN: 'Số CCCD', KIEUDULIEU: 'TEXT', DULIEU_TRUOCKHISUA: '001208012345',
          DULIEU_SAUKHISUA: '001208012346', NGAYTHUCHIEN: '15/07/2026 09:12:40', NGUOITHUCHIEN_TAIKHOAN: 'lannt' },
        { HANHDONG: 'Sửa', TRUONGTHONGTIN_ID: 'TT3', TRUONGTHONGTIN_TEN: 'Học bạ', KIEUDULIEU: 'FILE', DULIEU_TRUOCKHISUA: 'Upload/TuyenSinh/hocba_cu.pdf',
          DULIEU_SAUKHISUA: 'Upload/TuyenSinh/hocba_2026.pdf', NGAYTHUCHIEN: '16/07/2026 14:03:11', NGUOITHUCHIEN_TAIKHOAN: 'lannt' }
    ]
});
