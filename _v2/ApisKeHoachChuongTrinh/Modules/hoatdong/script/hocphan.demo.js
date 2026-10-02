/* Dữ liệu mẫu cho hoatdong/hocphan — chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {}, QM = {}, XN = {};
    function hp(id, ma, ten, tc, bm) { return { ID: id, DAOTAO_HOCPHAN_ID: id, DAOTAO_HOCPHAN_MA: ma, DAOTAO_HOCPHAN_TEN: ten, HOCTRINHAPDUNGHOCTAP: tc, THUOCBOMON_TEN: bm }; }
    var DS = [hp('HP1', 'IT3100', 'Lập trình hướng đối tượng', 3, 'Bộ môn Kỹ thuật phần mềm'), hp('HP2', 'IT3200', 'Cơ sở dữ liệu', 3, 'Bộ môn Hệ thống thông tin'),
        hp('HP3', 'IT4100', 'Trí tuệ nhân tạo', 2, 'Bộ môn Khoa học máy tính')];
    QM['HP1:PLL1'] = 60; QM['HP1:PLL2'] = 30; QM['HP2:PLL1'] = 70;
    XN['HP1:PLL1:LXN1'] = 'Đồng ý';
    fx['KHCT_ThongTin/LayDSKS_DaoTao_HocPhan'] = function () { return { rows: DS, pager: DS.length }; };
    fx['KHCT_ThongTin/LayDSKS_DaoTao_HocPhan_CT'] = function () { return { rows: DS.slice(0, 2), pager: 2 }; };
    fx['KHCT_HoatDong_ThongTin/LayGiaTriKH_PhanLoai_HP_QuyMo'] = function (o) { var v = QM[o.strDaoTao_HocPhan_Id + ':' + o.strPhanLoaiLop_Id]; return v === undefined ? [] : [{ QUYMO: v }]; };
    fx['PKG_KEHOACH_HOATDONG_THONGTIN.LayGiaTriKH_PhanLoai_HP_SoTiet'] = function (o) { return o.strPhanLoaiLop_Id === 'PLL1' ? [{ SOTIETPHANBO: 30 }] : [{ SOTIETPHANBO: 15 }]; };
    fx['KHCT_HoatDong_XacNhan/LayTTKH_PhanLoai_HP_XacNhan'] = function (o) { var v = XN[o.strDuLieuXacNhan + ':' + o.strPhanLoaiLop_Id + ':' + o.strLoaiXacNhan_Id]; return v ? [{ HANHDONG_TEN: v }] : []; };
    fx['KHCT_HoatDong_ThongTin/Them_KH_PhanLoai_HP_QuyMo'] = function (o) { QM[o.strDaoTao_HocPhan_Id + ':' + o.strPhanLoaiLop_Id] = o.dQuyMo; return []; };
    fx['KHCT_HoatDong_ThongTin/Xoa_KH_PhanLoai_HP_QuyMo'] = function (o) { delete QM[o.strDaoTao_HocPhan_Id + ':' + o.strPhanLoaiLop_Id]; return []; };
    fx['KHCT_HoatDong_XacNhan/Them_KH_PhanLoai_XacNhan'] = function (o) { XN[o.strDuLieuXacNhan + ':' + o.strPhanLoaiLop_Id + ':' + o.strLoaiXacNhan_Id] = o.strHanhDong_Id === 'HD1' ? 'Đồng ý' : 'Không đồng ý'; return []; };
    fx['KHCT_HoatDong_XacNhan/LayDSKH_PhanLoai_XacNhan'] = [{ TINHTRANG_TEN: 'Đồng ý', NOIDUNG: 'Đủ điều kiện mở lớp', NGUOIXACNHAN_TENDAYDU: 'Nguyễn Văn An', NGAYTAO_DD_MM_YYYY: '20/09/2026' }];
    ums.demo.add(fx);
})();
