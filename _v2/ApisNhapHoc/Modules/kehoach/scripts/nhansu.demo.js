/* Dữ liệu mẫu cho Kế hoạch nhân sự — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    ums.demo.crudStore('NH_KeHoachNhanSu', [
        { ID: 'KHNS1', TAICHINH_KEHOACHNHAPHOC_ID: 'KHNH2026', TAICHINH_KEHOACHNHAPHOC_TEN: 'Nhập học Đại học chính quy khóa 2026',
          NGUOIDUNG_ID: 'ND1', NGUOIDUNG_TENDAYDU: 'Nguyễn Văn An', NGUOIDUNG_TAIKHOAN: 'annv', LUONHIENTHDUCHUADENHAN: 1, LUONHIENTHIDUHETHAN: 0 },
        { ID: 'KHNS2', TAICHINH_KEHOACHNHAPHOC_ID: 'KHNH2026', TAICHINH_KEHOACHNHAPHOC_TEN: 'Nhập học Đại học chính quy khóa 2026',
          NGUOIDUNG_ID: 'ND2', NGUOIDUNG_TENDAYDU: 'Trần Thị Bích', NGUOIDUNG_TAIKHOAN: 'bichtt', LUONHIENTHDUCHUADENHAN: 0, LUONHIENTHIDUHETHAN: 1 },
        { ID: 'KHNS3', TAICHINH_KEHOACHNHAPHOC_ID: 'KHNH2025', TAICHINH_KEHOACHNHAPHOC_TEN: 'Nhập học Đại học chính quy khóa 2025',
          NGUOIDUNG_ID: 'ND3', NGUOIDUNG_TENDAYDU: 'Lê Minh Cường', NGUOIDUNG_TAIKHOAN: 'cuonglm', LUONHIENTHDUCHUADENHAN: 0, LUONHIENTHIDUHETHAN: 0 }
    ], { list: function (rows, o) {
        return rows.filter(function (r) { return !o.strTAICHINH_KeHoach_Id || r.TAICHINH_KEHOACHNHAPHOC_ID === o.strTAICHINH_KeHoach_Id; });
    } });
    var ND = [
        { ID: 'ND1', TENDAYDU: 'Nguyễn Văn An', TAIKHOAN: 'annv' },
        { ID: 'ND2', TENDAYDU: 'Trần Thị Bích', TAIKHOAN: 'bichtt' },
        { ID: 'ND3', TENDAYDU: 'Lê Minh Cường', TAIKHOAN: 'cuonglm' },
        { ID: 'ND4', TENDAYDU: 'Phạm Thu Hà', TAIKHOAN: 'hapt' },
        { ID: 'ND5', TENDAYDU: 'Đỗ Quang Huy', TAIKHOAN: 'huydq' }
    ];
    ums.demo.add({
        'CMS_NguoiDung/LayDanhSach': function (o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            return ND.filter(function (r) { return !q || (r.TENDAYDU + ' ' + r.TAIKHOAN).toLowerCase().indexOf(q) >= 0; });
        }
    });
})();
