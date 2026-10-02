/* Dữ liệu mẫu cho Quản lý ứng dụng — chỉ dùng ở chế độ dựng thử.
   (Cùng bộ ứng dụng với vaitro/script/_chung.demo.js.) */
(function () {
    var UD = [
        { ID: 'UD01', MAUNGDUNG: 'ApisTaiChinh', TENUNGDUNG: 'Tài chính', MOTA: 'Thu học phí, hoá đơn', THUTU: 1, TRANGTHAI: 1, COSUDUNGDANGONNGU: 0, TENANH: 'fa fa-credit-card', DUONGDANTRUYCAPSSO: 'https://ums.truong.edu.vn/ApisTaiChinh', TENFILEDINHKEM: '/ApisTaiChinh/Upload' },
        { ID: 'UD02', MAUNGDUNG: 'ApisCMS', TENUNGDUNG: 'Quản trị hệ thống', MOTA: '', THUTU: 2, TRANGTHAI: 1, COSUDUNGDANGONNGU: 1, TENANH: 'fa fa-cogs', DUONGDANTRUYCAPSSO: 'https://ums.truong.edu.vn/ApisCMS', TENFILEDINHKEM: '' },
        { ID: 'UD03', MAUNGDUNG: 'ApisNhanSu', TENUNGDUNG: 'Nhân sự', MOTA: 'Hồ sơ cán bộ', THUTU: 3, TRANGTHAI: 1, COSUDUNGDANGONNGU: 0, TENANH: 'fa fa-users', DUONGDANTRUYCAPSSO: 'https://ums.truong.edu.vn/ApisNhanSu', TENFILEDINHKEM: '' },
        { ID: 'UD04', MAUNGDUNG: 'ApisDangKyHoc', TENUNGDUNG: 'Đăng ký học', MOTA: '', THUTU: 4, TRANGTHAI: 2, COSUDUNGDANGONNGU: 0, TENANH: 'fa fa-calendar', DUONGDANTRUYCAPSSO: '', TENFILEDINHKEM: '' },
        { ID: 'UD05', MAUNGDUNG: 'ApisCongSinhVien', TENUNGDUNG: 'Cổng sinh viên', MOTA: 'Cổng thông tin người học', THUTU: 5, TRANGTHAI: 1, COSUDUNGDANGONNGU: 1, TENANH: 'fa fa-graduation-cap', DUONGDANTRUYCAPSSO: 'https://sv.truong.edu.vn', TENFILEDINHKEM: '' },
        { ID: 'UD06', MAUNGDUNG: 'ApisKTX', TENUNGDUNG: 'Ký túc xá', MOTA: '', THUTU: 6, TRANGTHAI: null, COSUDUNGDANGONNGU: 0, TENANH: 'fa fa-building', DUONGDANTRUYCAPSSO: 'https://ums.truong.edu.vn/ApisKTX', TENFILEDINHKEM: '' }
    ];
    ums.demo.add({
        'pkg_chung_quanlynguoidung.LayDanhSachUngDung': function (o) {
            var q = (o.strTuKhoa || '').toLowerCase();
            var ds = UD.filter(function (u) { return !q || (u.TENUNGDUNG + ' ' + u.MAUNGDUNG).toLowerCase().indexOf(q) >= 0; });
            var i = Number(o.pageIndex) || 1, s = Number(o.pageSize) || ds.length || 1;
            return { rows: ds.slice((i - 1) * s, i * s), pager: ds.length };
        },
        'pkg_chung_quanlynguoidung.LayThongTinUngDung': function (o) {
            return UD.filter(function (u) { return u.ID === o.strId; });
        }
    });
})();
