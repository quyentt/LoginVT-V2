/* Dữ liệu mẫu cho luanvan/decuongchinhthuc — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    var D = ums.demo.lvDeCuong;
    ums.demo.crudStore('LVLA_DeCuong_ChinhThuc', [D('CT1', 0), D('CT2', 1)], {
        map: function (o) { return { TENTIENGVIET: o.strTenTiengViet, TENTIENGANH: o.strTenTiengAnh, MOTA: o.strMoTa, NGAYDANGKY: o.strNgayDangKy, SOQUYETDINH: o.strSoQuyetDinh, NGAYQUYETDINH: o.strNgayQuyetDinh }; },
        list: function (r, o) { return o.strLVLA_KeHoach_DeCuong_Id ? r.filter(function (x) { return x.LVLA_KEHOACH_DECUONG_ID === o.strLVLA_KeHoach_DeCuong_Id; }) : r.slice(); }
    });
    ums.demo.crudStore('LVLA_DeCuong_ChinhThuc_HuongDan', [{ ID: 'CH1', NGUOIHUONGDAN_ID: 'GV1', NGUOIHUONGDAN_HOTEN: 'PGS.TS. Nguyễn Văn Hùng', NGUOIHUONGDAN_COQUANCONGTAC: 'Khoa CNTT',
        VAITRO_ID: 'VT1', VAITRO_TEN: 'Hướng dẫn chính', DECUONG: 'CT1' }], {
        map: function (o) { return { NGUOIHUONGDAN_ID: o.strNguoiHuongDan_Id, NGUOIHUONGDAN_HOTEN: 'Người hướng dẫn mới', VAITRO_ID: o.strVaiTro_Id, DECUONG: o.strLVLA_DeCuong_ChinhThuc_Id }; },
        list: function (r, o) { return r.filter(function (x) { return x.DECUONG === o.strLVLA_DeCuong_ChinhThuc_Id; }); }
    });
})();
