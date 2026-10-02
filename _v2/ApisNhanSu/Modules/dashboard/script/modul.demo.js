/* Dữ liệu mẫu cho modul — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    var CN = [
        { ID: 'NS-cocautochuc-cocautochuc', CHUNG_UNGDUNG_ID: 'R36', CHUCNANGCHA_ID: null, TENCHUCNANG: 'Cơ cấu tổ chức', TENANH: 'fa fa-sitemap', DUONGDANFILE: '/Modules/cocautochuc/html/cocautochuc.html', YEUTHICH: 1 },
        { ID: 'NS-cocautochuc-danhmucnghe', CHUNG_UNGDUNG_ID: 'R36', CHUCNANGCHA_ID: null, TENCHUCNANG: 'Danh mục nghề', TENANH: 'fa fa-briefcase', DUONGDANFILE: '/Modules/cocautochuc/html/danhmucnghe.html', YEUTHICH: 0 },
        { ID: 'NS-tracuuinan-hosolylich', CHUNG_UNGDUNG_ID: 'R36', CHUCNANGCHA_ID: null, TENCHUCNANG: 'Hồ sơ lý lịch', TENANH: 'fa fa-id-card-o', DUONGDANFILE: '/Modules/tracuuinan/html/hosolylich.html', YEUTHICH: 0 }
    ];
    ums.demo.add({
        'CMS_Quyen/LayDSUngDungTheoNguoiDung_Id': [{ ID: 'R36', TENUNGDUNG: 'Nhân sự', TENANH: 'fa fa-users', MAUNGDUNG: 'ApisNhanSu' },
            { ID: 'R33', TENUNGDUNG: 'Tài chính', TENANH: 'fa fa-money', MAUNGDUNG: 'ApisTaiChinh' }],
        'CMS_Quyen/LayDSChucNangTheoNguoiDung_Id': function () { return CN; },
        'CMS_NguoiDung/Them_ChucNang_ThuongDung': function (o) { CN.forEach(function (c) { if (c.ID === o.strChucNang_Id) c.YEUTHICH = 1; }); return []; },
        'CMS_NguoiDung/Xoa_ChucNang_ThuongDung': function (o) { CN.forEach(function (c) { if (c.ID === o.strChucNang_Id) c.YEUTHICH = 0; }); return []; },
        'CMS_NguoiDung/LayDSChucNangThuongDung': function () { return CN.filter(function (c) { return c.YEUTHICH; }); }
    });
})();
