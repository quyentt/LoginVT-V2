/* Dữ liệu mẫu cho hoatdong/molop — chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {}, P = 'PKG_KEHOACH_HOATDONG_', QM = {}, XN = {};
    function r(id, ma, ten, tong) {
        return { ID: id, DAOTAO_HOCPHAN_ID: 'HP' + id, DAOTAO_HOCPHAN_MA: ma, DAOTAO_HOCPHAN_TEN: ten, HOCTRINHAPDUNGHOCTAP: 3, DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm',
            DAOTAO_KHOADAOTAO_TEN: 'K67', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', DAOTAP_KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin', TONGSODUKIEN: tong,
            DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1', DAOTAO_THOIGIANDAOTAO_ID: 'TG1', KH_NAM_CHITIET_ID: 'KHCT1' };
    }
    var DS = [r('ML1', 'IT3100', 'Lập trình hướng đối tượng', 162), r('ML2', 'IT3200', 'Cơ sở dữ liệu', 90)];
    QM['HPML1:PLL1'] = { QUYMO: 60, SOLUONG: 3 }; QM['HPML1:PLL2'] = { QUYMO: 30, SOLUONG: 6 };
    XN['HPML1:PLL1:LXN2'] = 'Đồng ý';
    fx[P + 'THONGTIN.LayDSKH_HocPhan_DuKien_XNML'] = function () { return { rows: DS, pager: DS.length }; };
    fx[P + 'THONGTIN.LayGiaTriKH_PL_MoLop_TH_SL'] = function (o) { var v = QM[o.strDaoTao_HocPhan_Id + ':' + o.strPhanLoaiLop_Id]; return v ? [v] : []; };
    fx[P + 'XACNHAN.LayTTKH_PhanLoai_MoLop_XacNhan'] = function (o) { var v = XN[o.strDuLieuXacNhan + ':' + o.strPhanLoaiLop_Id + ':' + o.strLoaiXacNhan_Id]; return v ? [{ HANHDONG_TEN: v }] : []; };
    fx[P + 'THONGTIN.Them_KH_PhanLoai_MoLop_QuyMo'] = function (o) { var k = o.strDaoTao_HocPhan_Id + ':' + o.strPhanLoaiLop_Id; QM[k] = { QUYMO: o.dQuyMo, SOLUONG: Math.ceil(o.dQuyMo / 30) }; return []; };
    fx[P + 'TINHTOAN.TinhLopMoTheoQuyMo'] = [];
    fx[P + 'TINHTOAN.LayQuyMoTuCSDLHocPhan'] = [];
    fx['KHCT_HoatDong_XacNhan/Them_KH_PhanLoai_MoLop_XacNhan'] = function (o) { XN[o.strDuLieuXacNhan + ':' + o.strPhanLoaiLop_Id + ':' + o.strLoaiXacNhan_Id] = o.strHanhDong_Id === 'HD1' ? 'Đồng ý' : 'Không đồng ý'; return []; };
    fx['KHCT_HoatDong_XacNhan/LayDSKH_PhanLoai_MoLop_XacNhan'] = [];
    ums.demo.add(fx);
})();
