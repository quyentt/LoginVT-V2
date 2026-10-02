/* Dữ liệu mẫu cho hethong/accessedhistory — chỉ dùng ở chế độ dựng thử. */
(function () {
    var UD = [
        { ID: 'UD1', MA: 'ApisTaiChinh', TENUNGDUNG: 'Quản lý tài chính' },
        { ID: 'UD2', MA: 'ApisCMS', TENUNGDUNG: 'Quản trị hệ thống' },
        { ID: 'UD3', MA: 'ApisCongCanBo', TENUNGDUNG: 'Cổng cán bộ' }
    ];
    var CN = {
        UD1: [{ ID: 'CN11', MA: 'thutien', TENCHUCNANG: 'Thu tiền' }, { ID: 'CN12', MA: 'khoanthu', TENCHUCNANG: 'Khai báo khoản thu' }],
        UD2: [{ ID: 'CN21', MA: 'nguoidung', TENCHUCNANG: 'Người dùng' }, { ID: 'CN22', MA: 'vaitro', TENCHUCNANG: 'Vai trò' }],
        UD3: [{ ID: 'CN31', MA: 'lichgiang', TENCHUCNANG: 'Lịch giảng' }]
    };
    var TD = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';
    var NGUOI = [['cb.lan', 'Nguyễn Thị Lan'], ['cb.hung', 'Trần Văn Hùng'], ['admin', 'Quản trị hệ thống'], ['gv.minh', 'Lê Quang Minh']];
    var HD = ['LOGINSUCESS', 'VAOUNGDUNG', 'VAOCHUCNANG', 'BUTTON', 'CONFIRM', 'LOGINPASSFAIL'];
    var ROWS = [];
    for (var i = 0; i < 27; i++) {
        var n = NGUOI[i % NGUOI.length], ud = UD[i % 3], cn = CN[ud.ID][i % CN[ud.ID].length];
        ROWS.push({
            ID: 'LS' + i, NGUOIDUNG_TAIKHOAN: n[0], NGUOIDUNG_TENDAYDU: n[1],
            UNGDUNG_ID: ud.ID, UNGDUNG_TEN: ud.TENUNGDUNG, CHUCNANG_ID: cn.ID, CHUCNANG_TEN: cn.TENCHUCNANG,
            HOATDONG: HD[i % HD.length],
            THOIGIANMAYCHU: (24 - (i % 20)) + '/09/2026 ' + (8 + i % 9) + ':' + (10 + i) + ':05',
            TRINHDUYETSUDUNGTRUYCAP: TD,
            DIACHIMAYTRAMTRUYCAP: '192.168.1.' + (20 + i) + ' (113.160.' + (i % 7) + '.' + (40 + i) + ':Hà Nội)'
        });
    }
    ums.demo.add({
        'CMS_UngDung/LayDanhSach': UD,
        'CMS_ChucNang/LayDanhSach': function (o) { return CN[o.strChung_UngDung_Id] || []; },
        'SYS_LuuCacThongTinHoatDong/LayDanhSach': function (o) {
            var q = (o.strTuKhoa || '').toLowerCase(), u = (o.strTaiKhoanDangNhap || '').toLowerCase();
            var r = ROWS.filter(function (x) {
                return (!o.strHoatDong || x.HOATDONG === o.strHoatDong) && (!o.strUngDung_Id || x.UNGDUNG_ID === o.strUngDung_Id) &&
                    (!u || x.NGUOIDUNG_TAIKHOAN.indexOf(u) >= 0) &&
                    (!q || (x.NGUOIDUNG_TENDAYDU + ' ' + x.CHUCNANG_TEN).toLowerCase().indexOf(q) >= 0);
            });
            var s = Number(o.pageSize) || 10, p = Number(o.pageIndex) || 1;
            return { rows: r.slice((p - 1) * s, p * s), pager: r.length };
        }
    });
})();
