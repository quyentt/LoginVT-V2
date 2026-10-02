/* =========================================================================
   Hoạt động xã hội và giảng dạy — hồ sơ cá nhân
   Bản gốc: ApisCongCanBo/Modules/quatrinhcongtac/script/hoatdongxahoi_giangday.js
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       NS_QT_HoatDongXaHoi/LayDanhSach  GET  strNhanSu_HoSoCanBo_Id
       NS_QT_HoatDongXaHoi/LayChiTiet   GET  strId
       NS_QT_HoatDongXaHoi/ThemMoi | CapNhat, Xoa (strIds)
   Bản gốc chú thích bỏ ThietLapQuaTrinhCuoiCung; có nạp KHCT.BACDAOTAO /
   NS.DMNN cho hai ô không có trên màn (chép từ màn môn học) — bỏ cả hai.
   Dùng chung với bản QUẢN TRỊ ApisNhanSu/Modules/quatrinhcongtac/hoatdongxahoivagiangday (cán bộ nhân sự chọn
   một người): ums.ccbHS.hoatdongxahoi_giangday(P) trả cấu hình ums.crud. P = { hs() → id hồ sơ
   cán bộ, nth() → id người thực hiện, ns: true ở bản Nhân sự }; mặc định
   (Cổng cán bộ) cả hai là người đăng nhập.
   ========================================================================= */
(function () {
    'use strict';

    function uid() { return (ums.session && ums.session.userId) || ''; }
    var C = 'NS_QT_HoatDongXaHoi';

    function cauHinh(P) {
    return {
        title: 'Hoạt động xã hội và giảng dạy',
        listTitle: 'Tóm tắt quá trình hoạt động xã hội và giảng dạy',
        formTitle: 'hoạt động xã hội',
        icon: 'fa-people-group',
        formCols: 1,
        saveAgain: 'Lưu và nhập tiếp',

        list: { call: function () { return { action: C + '/LayDanhSach', method: 'GET', strNhanSu_HoSoCanBo_Id: P.hs() }; } },
        detail: function (row) { return { action: C + '/LayChiTiet', method: 'GET', strId: row.ID }; },

        columns: [
            { title: 'Tham gia hiệp hội, tổ chức khoa học', prop: 'THONGTINTHAMGIA' },
            { title: 'Năm bắt đầu', prop: 'THOIGIANBATDAU', cls: 'is-center' },
            { title: 'Vai trò', prop: 'VAITRO_KHAC' }
        ],

        fields: [
            { key: 'strThongTinThamGia', col: 'THONGTINTHAMGIA', label: 'Hiệp hội, tổ chức khoa học', required: true },
            { key: 'strVaiTro_Khac', col: 'VAITRO_KHAC', label: 'Vai trò', required: true },
            { key: 'strThoiGianBatDau', col: 'THOIGIANBATDAU', label: 'Năm bắt đầu', required: true }
        ],

        save: function (v, row) {
            return {
                action: C + (row ? '/CapNhat' : '/ThemMoi'),
                strId: row ? row.ID : '',
                strNhanSu_HoSoCanBo_Id: P.hs(),
                strThongTinThamGia: v.strThongTinThamGia,
                strVaiTro_Khac: v.strVaiTro_Khac,
                strThoiGianBatDau: v.strThoiGianBatDau,
                strNguoiThucHien_Id: P.nth()
            };
        },
        remove: function (ids) { return ids.map(function (id) { return { action: C + '/Xoa', strIds: id, strNguoiThucHien_Id: P.nth() }; }); }
    };
    }

    (ums.ccbHS = ums.ccbHS || {}).hoatdongxahoi_giangday = cauHinh;
    var root = document.getElementById('hoatdongxahoi_giangday');
    if (root) ums.crud(Object.assign({ root: root }, cauHinh({ hs: uid, nth: uid })));
})();
