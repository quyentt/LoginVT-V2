/* Dữ liệu mẫu cho luanvan/kehoach (nhân sự, khóa áp dụng; kế hoạch ở _lv_chung.demo.js) — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    ums.demo.crudStore('LVLA_KeHoach_DeCuong_NhanSu', [{ ID: 'N1', NGUOIDUNG_ID: 'NS1', NGUOIDUNG_TENDAYDU: 'Nguyễn Văn Hùng', NGUOIDUNG_TAIKHOAN: 'CB001', KH: 'KH1' }], {
        map: function (o) { return { NGUOIDUNG_ID: o.strNguoiDung_Id, NGUOIDUNG_TENDAYDU: 'Cán bộ mới', NGUOIDUNG_TAIKHOAN: 'CBM', KH: o.strLVLA_KeHoach_DeCuong_Id }; },
        list: function (r, o) { return r.filter(function (x) { return x.KH === o.strLVLA_KeHoach_DeCuong_Id; }); }
    });
    ums.demo.crudStore('LVLA_KeHoach_DeCuong_Khoa', [{ ID: 'K1', DAOTAO_HEDAOTAO_ID: 'H1', DAOTAO_KHOADAOTAO_ID: 'K67', KH: 'KH1' }], {
        map: function (o) { return { DAOTAO_HEDAOTAO_ID: o.strDaoTao_HeDaoTao_Id, DAOTAO_KHOADAOTAO_ID: o.strDaoTao_KhoaDaoTao_Id, KH: o.strLVLA_KeHoach_DeCuong_Id }; },
        list: function (r, o) { return r.filter(function (x) { return x.KH === o.strLVLA_KeHoach_DeCuong_Id; }); }
    });
})();
