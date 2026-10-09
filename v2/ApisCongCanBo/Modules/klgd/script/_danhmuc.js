/* =========================================================================
   klgd — các màn DANH MỤC một cột (khung ums.klgd.danhMuc, _klgd.js):
     danhmucdinhmuc / qlklgd_danhmucdinhmuc, danhmucmiengiam / qlklgd_danhmucmiengiam,
     qlklgd_hesolopdong, qlklgd_dongia
   Mỗi cặp X / qlklgd_X chỉ khác controller (TKGG_KLGD / TKGG_QLKLGD), nguồn năm học và tên tham số người
   thực hiện — tên tham số dữ liệu giữ nguyên.
   Khác bản gốc riêng từng màn (ghi ở can-quyet.js):
     · danhmucmiengiam: Thêm mới gốc KHÔNG đặt lại hai ô "kiểu" (giữ giá trị lần sửa trước) → nay trống, bắt chọn.
     · qlklgd_hesolopdong: ô Hệ số gốc không bắt buộc — giữ.
     · qlklgd_dongia: ô Hình thức giảng gốc mang value = TÊN (NAME) nhưng khi sửa đặt theo HINHTHUCGIANGDAYID
       (không bao giờ khớp) → nay value = ID; bảng gốc thiếu tiêu đề cột "Chi tiết"; mở màn gốc KHÔNG nạp bảng —
       nay nạp theo năm chọn sẵn.
   ========================================================================= */
(function () {
    'use strict';
    var K = ums.klgd, e = K.e;
    var D = K.dm = {};
    function f(key, col, label, o) { return Object.assign({ key: key, col: col, label: label }, o || {}); }

    D.dinhMuc = function (root, ql) {
        return K.danhMuc(root, {
            ql: ql, title: 'Danh mục định mức', formTitle: 'định mức', icon: 'fa-list-check',
            ds: 'GetDanhsachDinhMuc', them: 'ThemMoiDinhMuc', sua: 'CapNhatDinhMuc', xoa: 'XoaDinhMuc', xoaKhoa: 'strDinhMucIds',
            columns: [
                { title: 'Mã định mức', prop: 'CODE', cls: 'is-center is-nowrap' }, { title: 'Tên định mức', prop: 'NAME' },
                { title: 'Định mức Giảng dạy', prop: 'DMGIANGDAY', cls: 'is-center' }, { title: 'Định mức NCKH', prop: 'DMNCKH', cls: 'is-center' },
                { title: 'Khác', prop: 'KHAC', cls: 'is-center' }],
            fields: [
                f('strMaDinhMuc', 'CODE', 'Mã định mức', { required: true }), f('strTenDinhMuc', 'NAME', 'Tên định mức', { required: true }),
                f('strDinhMucGiangDay', 'DMGIANGDAY', 'Định mức giảng dạy', { required: true }), f('strDinhMucNCKH', 'DMNCKH', 'Định mức NCKH', { required: true }),
                f('strKhac', 'KHAC', 'Khác', { required: true })],
            luu: function (v) {
                return { strMaDinhMuc: v.strMaDinhMuc, strTenDinhMuc: v.strTenDinhMuc, strDinhMucGiangDay: v.strDinhMucGiangDay,
                    strDinhMucNCKH: v.strDinhMucNCKH, strKhac: v.strKhac };
            }
        });
    };

    D.mienGiam = function (root, ql) {
        var kieu = { items: K.KIEU_MG };
        return K.danhMuc(root, {
            ql: ql, title: 'Danh mục miễn giảm', formTitle: 'miễn giảm', icon: 'fa-percent',
            ds: 'GetDanhsachMienGiam', them: 'ThemMoiMienGiam', sua: 'CapNhatMienGiam', xoa: 'XoaMienGiam', xoaKhoa: 'strMienGiamIds',
            columns: [
                { title: 'Mã Miễn giảm', prop: 'CODE', cls: 'is-center is-nowrap' }, { title: 'Tên Miễn giảm', prop: 'NAME' },
                { title: 'Miễn giảm Giảng dạy', cls: 'is-center', render: function (r) { return ums.ui.esc(K.kieu(r.MIENGIAMGD, e(r.KIEUMIENGIAMGIANGDAY))); } },
                { title: 'Miễn giảm NCKH', cls: 'is-center', render: function (r) { return ums.ui.esc(K.kieu(r.MIENGIAMNCKH, e(r.KIEUMIENGIAMNCKH))); } }],
            fields: [
                f('strMaMienGiam', 'CODE', 'Mã miễn giảm', { required: true }), f('strTenMienGiam', 'NAME', 'Tên miễn giảm', { required: true }),
                f('strMienGiamGiangDay', 'MIENGIAMGD', 'Miễn giảm giảng dạy', { required: true }),
                f('strKieuMienGiamGiangDay', 'KIEUMIENGIAMGIANGDAY', 'Kiểu miễn giảm giảng dạy', { type: 'select', required: true, placeholder: 'Chọn kiểu', source: kieu }),
                f('strMienGiamNCKH', 'MIENGIAMNCKH', 'Miễn giảm NCKH', { required: true }),
                f('strKieuMienGiamNCKH', 'KIEUMIENGIAMNCKH', 'Kiểu miễn giảm NCKH', { type: 'select', required: true, placeholder: 'Chọn kiểu', source: kieu })],
            luu: function (v) {
                return { strMaMienGiam: v.strMaMienGiam, strTenMienGiam: v.strTenMienGiam, strMienGiamGiangDay: v.strMienGiamGiangDay,
                    strMienGiamNCKH: v.strMienGiamNCKH, strKieuMienGiamGiangDay: v.strKieuMienGiamGiangDay, strKieuMienGiamNCKH: v.strKieuMienGiamNCKH };
            }
        });
    };

    D.heSoLopDong = function (root) {
        return K.danhMuc(root, {
            ql: true, title: 'Hệ số lớp đông', formTitle: 'hệ số lớp đông', icon: 'fa-users-rectangle',
            ds: 'GetHeSoLopDong', them: 'CapNhatHeSoLopDong', sua: 'CapNhatHeSoLopDong', xoa: 'XoaHeSoLopDong', xoaKhoa: 'strHeSoLopDongIds',
            columns: [{ title: 'Số tiết từ', prop: 'TU', cls: 'is-center' }, { title: 'Đến', prop: 'DEN', cls: 'is-center' }, { title: 'Hệ số', prop: 'HESO', cls: 'is-center' }],
            fields: [f('strSoTietTu', 'TU', 'Số tiết từ', { required: true }), f('strSoTietDen', 'DEN', 'Số tiết đến', { required: true }),
                f('strHeSoLopDong', 'HESO', 'Hệ số')],
            luu: function (v) { return { strSoTietTu: v.strSoTietTu, strSoTietDen: v.strSoTietDen, strHeSoLopDong: v.strHeSoLopDong }; }
        });
    };

    D.donGia = function (root) {
        return K.danhMuc(root, {
            ql: true, title: 'Đơn giá', formTitle: 'đơn giá', icon: 'fa-money-bill',
            ds: 'GetDonGia', them: 'CapNhatDonGia', sua: 'CapNhatDonGia', xoa: 'XoaDonGia', xoaKhoa: 'strDonGiaIds',
            columns: [
                { title: 'Mã', prop: 'CODE', cls: 'is-center is-nowrap' }, { title: 'Tên', prop: 'LOAIGIANGVIEN' },
                { title: 'Đơn giá', prop: 'DONGIA', cls: 'is-right' }, { title: 'Hình thức giảng', prop: 'TENHINHTHUCGIANGDAY' },
                { title: 'Học hàm', prop: 'HOCHAM' }, { title: 'Học vị', prop: 'HOCVI' }],
            fields: [
                f('strTen', 'LOAIGIANGVIEN', 'Tên', { required: true }), f('strDonGia', 'DONGIA', 'Đơn giá', { required: true }),
                f('strHinhThucGiangId', 'HINHTHUCGIANGDAYID', 'Hình thức giảng', { type: 'select', placeholder: 'Chọn hình thức giảng',
                    source: { call: { action: 'TKGG_QLKLGD/GetHinhThucGiang', method: 'GET', strNguoiThucHienId: K.uid() }, id: 'ID', name: 'NAME' } }),
                f('strHocHamId', 'HOCHAMID', 'Học hàm', { type: 'select', placeholder: 'Chọn học hàm', source: { dm: 'NS.LOCD' } }),
                f('strHocViId', 'HOCVIID', 'Học vị', { type: 'select', placeholder: 'Chọn học vị', source: { dm: 'NS.DMHV' } })],
            luu: function (v) {
                return { strTen: v.strTen, strDonGia: v.strDonGia, strHinhThucGiangId: v.strHinhThucGiangId, strHocHamId: v.strHocHamId, strHocViId: v.strHocViId };
            }
        });
    };
})();
