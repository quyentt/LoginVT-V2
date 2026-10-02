/* Dữ liệu mẫu cho phanquyen/diem (Quản lý điểm) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var ROWS = [
        { ID: 'R1', NGUOIDUNG_ID: 'ND1', NGUOIDUNG_TAIKHOAN: 'hainv', NGUOIDUNG_TENDAYDU: 'Nguyễn Văn Hải', PHAMVIAPDUNG_ID: 'DV1', PHAMVIAPDUNG_TEN: 'Khoa Công nghệ thông tin', HEDAOTAO_ID: 'HE1', HEDAOTAO_TEN: 'Đại học chính quy', APDUNGQUYENCHOLOPHOCPHAN: 1 },
        { ID: 'R2', NGUOIDUNG_ID: 'ND1', NGUOIDUNG_TAIKHOAN: 'hainv', NGUOIDUNG_TENDAYDU: 'Nguyễn Văn Hải', PHAMVIAPDUNG_ID: 'DV2', PHAMVIAPDUNG_TEN: 'Khoa Kinh tế', HEDAOTAO_ID: 'HE1', HEDAOTAO_TEN: 'Đại học chính quy', APDUNGQUYENCHOLOPHOCPHAN: 0 },
        { ID: 'R3', NGUOIDUNG_ID: 'ND2', NGUOIDUNG_TAIKHOAN: 'maitt', NGUOIDUNG_TENDAYDU: 'Trần Thị Mai', PHAMVIAPDUNG_ID: 'DV1', PHAMVIAPDUNG_TEN: 'Khoa Công nghệ thông tin', HEDAOTAO_ID: 'HE2', HEDAOTAO_TEN: 'Đào tạo từ xa', APDUNGQUYENCHOLOPHOCPHAN: 0 }];
    var Q = { 'ND1|DV1|HE1': ['HD1', 'HD2'], 'ND2|DV1|HE2': ['HD3'] };
    function k(o) { return o.strNguoiDung_Id + '|' + o.strPhamViApDung_Id + '|' + o.strDaoTao_HeDaoTao_Id; }
    ums.demo.add({
        'pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTao': [{ ID: 'HE1', TENHEDAOTAO: 'Đại học chính quy' }, { ID: 'HE2', TENHEDAOTAO: 'Đào tạo từ xa' }],
        'pkg_nhansu_hoso_v2.LayDanhSachToanBo': [{ ID: 'DV1', MA: 'CNTT', TEN: 'Khoa Công nghệ thông tin' }, { ID: 'DV2', MA: 'KT', TEN: 'Khoa Kinh tế' }, { ID: 'DV3', MA: 'PDT', TEN: 'Phòng Đào tạo' }],
        'pkg_nhansu_hoso_v2.LayDSNhanSu_HoSo_v2': function (o) { return o.strDaoTao_CoCauToChuc_Id ? [{ ID: 'ND1', MASO: 'CB001', HOTEN: 'Nguyễn Văn Hải', HODEM: 'Nguyễn Văn', TEN: 'Hải' },
            { ID: 'ND2', MASO: 'CB002', HOTEN: 'Trần Thị Mai', HODEM: 'Trần Thị', TEN: 'Mai' }] : [{ ID: 'ND3', MASO: 'CB003', HOTEN: 'Lê Minh Tuấn', HODEM: 'Lê Minh', TEN: 'Tuấn' }]; },
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#CHUNG.HANHDONG': [{ ID: 'HD1', TEN: 'Nhập điểm' }, { ID: 'HD2', TEN: 'Xác nhận' }, { ID: 'HD3', TEN: 'Công bố' }, { ID: 'HD4', TEN: 'Xem' }],
        'pkg_chung_phanquyendulieu.LayDSThi_Phach_Quyen_Diem': function () { return ROWS; },
        'pkg_chung_phanquyendulieu.LayDSQuyenNguoiDungPhamVi': function (o) { return (Q[k(o)] || []).map(function (h, i) { return { ID: 'Q' + h + i, HANHDONG_ID: h }; }); },
        'pkg_chung_phanquyendulieu.Them_Thi_Phach_Quyen_Diem': function (o) { var a = Q[k(o)] = Q[k(o)] || []; if (a.indexOf(o.strHanhDong_Id) < 0) a.push(o.strHanhDong_Id); return []; },
        'pkg_chung_phanquyendulieu.Xoa_Thi_Phach_Quyen_Diem': function (o) { Q[k(o)] = (Q[k(o)] || []).filter(function (h) { return h !== o.strHanhDong_Id; }); return []; }
    });
})();
