/* Dữ liệu mẫu cho luanan/kehoach (kế hoạch chuyên đề, nhân sự, khóa áp dụng) — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    /* kế hoạch chuyên đề (dùng chung cho 4 màn luanan) */
    if (!ums.demo.fixtures['LVLA_KeHoach_ChuyenDe/LayDanhSach']) {
        ums.demo.crudStore('LVLA_KeHoach_ChuyenDe', [
            { ID: 'KC1', TEN: 'Chuyên đề đợt 1 năm 2025', MOTA: '', NGAYBATDAU: '01/09/2025', NGAYKETTHUC: '30/12/2025' },
            { ID: 'KC2', TEN: 'Chuyên đề đợt 2 năm 2026', MOTA: 'Đợt bổ sung', NGAYBATDAU: '01/03/2026', NGAYKETTHUC: '30/06/2026' }
        ], { map: function (o) { return { TEN: o.strTen, MOTA: o.strMoTa, NGAYBATDAU: o.strNgayBatDau, NGAYKETTHUC: o.strNgayKetThuc }; } });
    }
    ums.demo.crudStore('LVLA_KeHoach_ChuyenDe_NhanSu', [{ ID: 'N1', NGUOIDUNG_ID: 'NS1', NGUOIDUNG_TENDAYDU: 'Nguyễn Văn Hùng', NGUOIDUNG_TAIKHOAN: 'CB001', KH: 'KC1' }], {
        map: function (o) { return { NGUOIDUNG_ID: o.strNguoiDung_Id, NGUOIDUNG_TENDAYDU: 'Cán bộ mới', NGUOIDUNG_TAIKHOAN: 'CBM', KH: o.strLVLA_KeHoach_ChuyenDe_Id }; },
        list: function (r, o) { return r.filter(function (x) { return x.KH === o.strLVLA_KeHoach_ChuyenDe_Id; }); }
    });
    ums.demo.crudStore('LVLA_KeHoach_DeCuong_Khoa', [{ ID: 'K1', DAOTAO_HEDAOTAO_ID: 'H1', DAOTAO_KHOADAOTAO_ID: 'K67', KH: 'KC1' }], {
        map: function (o) { return { DAOTAO_HEDAOTAO_ID: o.strDaoTao_HeDaoTao_Id, DAOTAO_KHOADAOTAO_ID: o.strDaoTao_KhoaDaoTao_Id, KH: o.strLVLA_KeHoach_DeCuong_Id }; },
        list: function (r, o) { return r.filter(function (x) { return x.KH === o.strLVLA_KeHoach_DeCuong_Id; }); }
    });
})();
