/* =========================================================================
   Nhiệm vụ chiến lược — hồ sơ cá nhân
   Bản gốc: ApisCongCanBo/Modules/quatrinhcongtac/script/nhiemvuchienluoc.js
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       NS_QT_NhiemVuChienLuoc/LayDanhSach  GET  strNhanSu_HoSoCanBo_Id
       NS_QT_NhiemVuChienLuoc/LayChiTiet   GET  strId
       NS_QT_NhiemVuChienLuoc/ThemMoi | CapNhat, Xoa (strIds)
   Danh mục: NS.NHIEMVUCHIENLUOC. Bản gốc chú thích bỏ ThietLapQuaTrinhCuoiCung.
   Dùng chung với bản QUẢN TRỊ ApisNhanSu/Modules/quatrinhcongtac/nhiemvuchienluoc (cán bộ nhân sự chọn
   một người): ums.ccbHS.nhiemvuchienluoc(P) trả cấu hình ums.crud. P = { hs() → id hồ sơ
   cán bộ, nth() → id người thực hiện, ns: true ở bản Nhân sự }; mặc định
   (Cổng cán bộ) cả hai là người đăng nhập.
   ========================================================================= */
(function () {
    'use strict';

    function uid() { return (ums.session && ums.session.userId) || ''; }
    var C = 'NS_QT_NhiemVuChienLuoc';

    function cauHinh(P) {
    return {
        title: 'Nhiệm vụ chiến lược',
        listTitle: 'Tóm tắt nhiệm vụ chiến lược',
        formTitle: 'nhiệm vụ chiến lược',
        icon: 'fa-chess-knight',
        formCols: 1,
        saveAgain: 'Lưu và nhập tiếp',

        list: { call: function () { return { action: C + '/LayDanhSach', method: 'GET', strNhanSu_HoSoCanBo_Id: P.hs() }; } },
        detail: function (row) { return { action: C + '/LayChiTiet', method: 'GET', strId: row.ID }; },

        columns: [
            { title: 'Nhiệm vụ', prop: 'NHIEMVU_TEN' },
            { title: 'Nội dung tham gia', prop: 'THONGTINTHAMGIA' },
            { title: 'Thời gian bắt đầu', prop: 'THOIGIANBATDAU', cls: 'is-center' }
        ],

        fields: [
            { key: 'strNhiemVu_Id', col: 'NHIEMVU_ID', label: 'Nhiệm vụ chiến lược', type: 'select', source: { dm: 'NS.NHIEMVUCHIENLUOC' }, required: true },
            { key: 'strThongTinThamGia', col: 'THONGTINTHAMGIA', label: 'Nội dung tham gia', required: true },
            { key: 'strThoiGianBatDau', col: 'THOIGIANBATDAU', label: 'Năm bắt đầu', required: true }
        ],

        save: function (v, row) {
            return {
                action: C + (row ? '/CapNhat' : '/ThemMoi'),
                strId: row ? row.ID : '',
                strNhanSu_HoSoCanBo_Id: P.hs(),
                strThongTinThamGia: v.strThongTinThamGia,
                strNhiemVu_Id: v.strNhiemVu_Id,
                strThoiGianBatDau: v.strThoiGianBatDau,
                strNguoiThucHien_Id: P.nth()
            };
        },
        remove: function (ids) { return ids.map(function (id) { return { action: C + '/Xoa', strIds: id, strNguoiThucHien_Id: P.nth() }; }); }
    };
    }

    (ums.ccbHS = ums.ccbHS || {}).nhiemvuchienluoc = cauHinh;
    var root = document.getElementById('nhiemvuchienluoc');
    if (root) ums.crud(Object.assign({ root: root }, cauHinh({ hs: uid, nth: uid })));
})();
