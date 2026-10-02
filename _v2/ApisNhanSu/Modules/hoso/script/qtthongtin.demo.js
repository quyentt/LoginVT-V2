/* Dữ liệu mẫu cho qtthongtin (bản NS) — chỉ dùng ở chế độ dựng thử. Hoạt động / quyết định mẫu lấy
   của ApisCongCanBo/Modules/hoso/script/qtthongtin.demo.js; ở đây chỉ khai lại bảng "Tự nhập hồ sơ"
   theo cột của bản NS (TRUONGTHONGTIN_GIATRI, DORONG, DUOCSUA, đủ kiểu). */
ums.demo.add({
    'NS_HoatDong_DuLieu/LayDanhSach': function (o) {
        if (!o.strHoatDongNhanSu_Id) return [];
        return [
            { ID: 'TT1', TEN: 'Nơi làm việc mới', KIEUDULIEU: 'TEXT', TRUONGTHONGTIN_GIATRI: o.strNhanSu_HoatDong_TT_Id ? 'Khoa CNTT' : '' },
            { ID: 'TT4', TEN: 'Ngày nhận nhiệm vụ', KIEUDULIEU: 'DATE', TRUONGTHONGTIN_GIATRI: '' },
            { ID: 'TT5', TEN: 'Ghi chú của đơn vị', KIEUDULIEU: 'TEXT', DORONG: 80, TRUONGTHONGTIN_GIATRI: '' },
            { ID: 'TT6', TEN: 'Mã hồ sơ gốc', KIEUDULIEU: 'NUMBER', DUOCSUA: 0, TRUONGTHONGTIN_GIATRI: '1024' },
            { ID: 'TT2', TEN: 'Quan hệ người đi cùng', KIEUDULIEU: 'LIST', MABANGDANHMUC: 'NS.QHGD', TRUONGTHONGTIN_GIATRI: '' },
            { ID: 'TT3', TEN: 'Văn bản kèm theo', KIEUDULIEU: 'FILE', TRUONGTHONGTIN_GIATRI: '' }
        ];
    }
});
