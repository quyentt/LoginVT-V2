/* Dữ liệu mẫu cho luanvan/hoidongthongqua — danh sách đăng ký / hướng dẫn khai lại nếu màn đăng ký chưa mở. Chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    var D = ums.demo.lvDeCuong;
    if (!ums.demo.fixtures['LVLA_DeCuong_DangKy/LayDanhSach']) {
        ums.demo.crudStore('LVLA_DeCuong_DangKy', [D('DK1', 0), D('DK2', 1), D('DK3', 2)], {
            list: function (r, o) { return o.strLVLA_KeHoach_DeCuong_Id ? r.filter(function (x) { return x.LVLA_KEHOACH_DECUONG_ID === o.strLVLA_KeHoach_DeCuong_Id; }) : r.slice(); }
        });
    }
    if (!ums.demo.fixtures['LVLA_DeCuong_DangKy_HuongDan/LayDanhSach']) {
        ums.demo.crudStore('LVLA_DeCuong_DangKy_HuongDan', [{ ID: 'HD1', NGUOIHUONGDAN_ID: 'GV1', NGUOIHUONGDAN_HOTEN: 'PGS.TS. Nguyễn Văn Hùng', NGUOIHUONGDAN_COQUANCONGTAC: 'Khoa CNTT',
            VAITRO_ID: 'VT1', VAITRO_TEN: 'Hướng dẫn chính', DECUONG: 'DK1' }], {
            list: function (r, o) { return r.filter(function (x) { return x.DECUONG === o.strLVLA_DeCuong_DangKy_Id; }); }
        });
    }
    ums.demo.crudStore('LVLA_DeCuong_HoiDong_ThanhVien', [{ ID: 'TV1', THANHVIEN_ID: 'GV3', THANHVIEN_HOTEN: 'TS. Lê Quang Minh', THANHVIEN_COQUANCONGTAC: 'Khoa CNTT',
        VAITRO_ID: 'HD1', VAITRO_TEN: 'Chủ tịch', DECUONG: 'DK1' }], {
        map: function (o) { return { THANHVIEN_ID: o.strThanhVien_Id, THANHVIEN_HOTEN: 'Thành viên mới', VAITRO_ID: o.strVaiTro_Id, DECUONG: o.strLVLA_DeCuong_DangKy_Id }; },
        list: function (r, o) { return r.filter(function (x) { return x.DECUONG === o.strLVLA_DeCuong_DangKy_Id; }); }
    });
})();
