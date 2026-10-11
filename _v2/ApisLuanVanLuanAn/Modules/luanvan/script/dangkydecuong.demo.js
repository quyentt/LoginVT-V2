/* Dữ liệu mẫu cho luanvan/dangkydecuong — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    var D = ums.demo.lvDeCuong;
    var rows = [D('DK1', 0), D('DK2', 1), D('DK3', 2)];
    ums.demo.crudStore('LVLA_DeCuong_DangKy', rows, {
        map: function (o) { return { LVLA_KEHOACH_DECUONG_ID: o.strLVLA_KeHoach_DeCuong_Id, QLSV_NGUOIHOC_ID: o.strQLSV_NguoiHoc_Id, QLSV_NGUOIHOC_MASO: 'BIT220101',
            QLSV_NGUOIHOC_HOTEN: 'Nguyễn Văn An', TENTIENGVIET: o.strTenTiengViet, TENTIENGANH: o.strTenTiengAnh, MOTA: o.strMoTa, NGAYDANGKY: o.strNgayDangKy, DAOTAO_LOPQUANLY_TEN: 'K67-KTPM1' }; },
        list: function (r, o) { return o.strLVLA_KeHoach_DeCuong_Id ? r.filter(function (x) { return x.LVLA_KEHOACH_DECUONG_ID === o.strLVLA_KeHoach_DeCuong_Id; }) : r.slice(); }
    });
    ums.demo.crudStore('LVLA_DeCuong_DangKy_HuongDan', [{ ID: 'HD1', NGUOIHUONGDAN_ID: 'GV1', NGUOIHUONGDAN_HOTEN: 'PGS.TS. Nguyễn Văn Hùng', NGUOIHUONGDAN_COQUANCONGTAC: 'Khoa CNTT',
        VAITRO_ID: 'VT1', VAITRO_TEN: 'Hướng dẫn chính', DECUONG: 'DK1' }], {
        map: function (o) { return { NGUOIHUONGDAN_ID: o.strNguoiHuongDan_Id, NGUOIHUONGDAN_HOTEN: 'Người hướng dẫn mới', VAITRO_ID: o.strVaiTro_Id, VAITRO_TEN: '', DECUONG: o.strLVLA_DeCuong_DangKy_Id }; },
        list: function (r, o) { return r.filter(function (x) { return x.DECUONG === o.strLVLA_DeCuong_DangKy_Id; }); }
    });
})();
