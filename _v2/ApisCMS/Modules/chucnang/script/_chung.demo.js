/* Dữ liệu mẫu dùng chung cho chucnang + sodoquytrinh — chỉ dùng ở chế độ dựng thử. */
(function () {
    var APP = [
        { ID: 'A1', MAUNGDUNG: 'ApisTaiChinh', TENUNGDUNG: 'Tài chính' },
        { ID: 'A2', MAUNGDUNG: 'ApisCMS', TENUNGDUNG: 'Quản trị hệ thống' },
        { ID: 'A3', MAUNGDUNG: 'ApisCongCanBo', TENUNGDUNG: 'Cổng cán bộ' }
    ];
    function cn(id, ten, ma, cha, chaTen, app, tt, anh, file, hienthi) {
        var a = APP.filter(function (x) { return x.ID === app; })[0] || {};
        return { ID: id, TENCHUCNANG: ten, MACHUCNANG: ma, CHUCNANGCHA_ID: cha, CHUCNANGCHA: chaTen,
            CHUNG_UNGDUNG_ID: app, CHUNG_UNGDUNG: a.TENUNGDUNG, THUTU: tt, TENANH: anh,
            DUONGDANFILE: file || '', DUONGDANHIENTHI: hienthi || '', DUONGDANHUONGDANSUDUNG: '',
            TENDAYDU: 'Internet', MOTA: '', THONGTINKHONGHIENTHI: '', TRANGTHAI: 1 };
    }
    var CN = [
        cn('F01', 'Danh mục hệ số', 'TC_DMHS', '', '', 'A1', 1, 'fa fa-list'),
        cn('F02', 'Khai báo khoản thu', 'TC_KHOANTHU', 'F01', 'Danh mục hệ số', 'A1', 1, 'fa fa-money', '/Modules/danhmucheso/html/khoanthu.html', '#khoanthu'),
        cn('F03', 'Hệ thống hoá đơn', 'TC_HTHD', 'F01', 'Danh mục hệ số', 'A1', 2, 'fa fa-file-text-o', '/Modules/danhmucheso/html/hethonghoadon.html', '#hethonghoadon'),
        cn('F04', 'Thu tiền', 'TC_THU', '', '', 'A1', 2, 'fa-light fa-cash-register'),
        cn('F05', 'Thu tiền người học', 'TC_THUTIEN', 'F04', 'Thu tiền', 'A1', 1, 'fa-light fa-coins', '/Modules/phieuthu/html/thutien.html', '#thutien'),
        cn('F06', 'Tra cứu số phiếu thu', 'TC_TCPT', 'F04', 'Thu tiền', 'A1', 2, '', '/Modules/phieuthu/html/tracuusophieuthu.html', '#tracuusophieuthu'),
        cn('F07', 'Báo cáo', 'TC_BAOCAO', '', '', 'A1', 3, 'fa fa-bar-chart'),
        cn('F08', 'Theo dõi công nợ', 'TC_CONGNO', 'F07', 'Báo cáo', 'A1', 1, 'fa fa-line-chart', '/Modules/thongke/html/theodoicongno.html', '#theodoicongno'),
        cn('G01', 'Người dùng', 'CMS_ND', '', '', 'A2', 1, 'fa fa-users'),
        cn('G02', 'Quản lý người dùng', 'CMS_NGUOIDUNG', 'G01', 'Người dùng', 'A2', 1, 'fa fa-user', '/Modules/nguoidung/html/nguoidung.html', '#nguoidung'),
        cn('G03', 'Chức năng', 'CMS_CN', '', '', 'A2', 2, 'fa fa-sitemap'),
        cn('G04', 'Quản lý chức năng', 'CMS_CHUCNANG', 'G03', 'Chức năng', 'A2', 1, 'fa fa-cogs', '/Modules/chucnang/html/chucnang.html', '#chucnang'),
        cn('H01', 'Hồ sơ cá nhân', 'CCB_HOSO', '', '', 'A3', 1, 'fa fa-user')
    ];
    function theoApp(o) { return CN.filter(function (x) { return !o.strChung_UngDung_Id || x.CHUNG_UNGDUNG_ID === o.strChung_UngDung_Id; }); }
    ums.demo.add({
        'pkg_chung_quanlynguoidung.LayDanhSachUngDung': APP,
        'pkg_chung_quanlynguoidung.LayDanhSachChucNang': theoApp,
        'CMS_UngDung/LayDanhSach': APP,
        'CMS_ChucNang/LayDanhSach': theoApp
    });
})();
