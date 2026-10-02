/* Dữ liệu mẫu cho hoatdong/phangiangvien — chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {}, D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    var P = 'PKG_KEHOACH_HOATDONG_', T = P + 'THONGTIN.';
    fx[P + 'CHUNG.LayDSNam'] = [{ ID: 'N2026', NAM: '2026' }];
    fx[P + 'KEHOACH.LayDSKH_Nam_TongHop'] = function (o) { return o.strNam ? [{ ID: 'KHN1', TEN: 'Kế hoạch đào tạo năm 2026' }] : []; };
    fx[P + 'KEHOACH.LayDSKH_Nam_ChiTietTheo'] = function (o) { return o.strKH_Nam_TongHop_Id ? [{ ID: 'KHCT1', TEN: 'Học kỳ 1 năm 2026' }, { ID: 'KHCT2', TEN: 'Học kỳ 2 năm 2026' }] : []; };
    fx[P + 'CHUNG.LayDSHocPhanTheoKhoaChuyenMon'] = function (o) { return o.strKH_Nam_TongHop_Id ? [{ ID: 'HP1', TEN: 'Lập trình hướng đối tượng', MA: 'IT3100' }, { ID: 'HP2', TEN: 'Cơ sở dữ liệu', MA: 'IT3200' }] : []; };
    fx[D + 'KH.PHANLOAI.HOCPHAN.LOAILOP'] = [{ ID: 'PLLT', MA: 'LT', TEN: 'Lý thuyết' }, { ID: 'PLTH', MA: 'TH', TEN: 'Thực hành' }];
    var DS = [
        { ID: 'DK1', DAOTAO_HOCPHAN_ID: 'HP1', DAOTAO_HOCPHAN_MA: 'IT3100', DAOTAO_HOCPHAN_TEN: 'Lập trình hướng đối tượng', HOCTRINHAPDUNGHOCTAP: 3, DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm',
          DAOTAO_KHOADAOTAO_TEN: 'K67', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', DAOTAP_KHOAQUANLY_TEN: 'Khoa CNTT', TONGSODUKIEN: 180, DAOTAO_THOIGIANDAOTAO_ID: 'TG1', KH_NAM_CHITIET_ID: 'KHCT1', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1' },
        { ID: 'DK2', DAOTAO_HOCPHAN_ID: 'HP2', DAOTAO_HOCPHAN_MA: 'IT3200', DAOTAO_HOCPHAN_TEN: 'Cơ sở dữ liệu', HOCTRINHAPDUNGHOCTAP: 3, DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm',
          DAOTAO_KHOADAOTAO_TEN: 'K67', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', DAOTAO_KHOAQUANLY_TEN: 'Khoa CNTT', TONGSODUKIEN: 120, DAOTAO_THOIGIANDAOTAO_ID: 'TG1', KH_NAM_CHITIET_ID: 'KHCT1', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1' }
    ];
    fx[T + 'LayDSKH_HocPhan_DuKien_PC'] = function (o) { var d = DS.filter(function (x) { return !o.strDaoTao_HocPhan_Id || x.DAOTAO_HOCPHAN_ID === o.strDaoTao_HocPhan_Id; }); return { rows: d, pager: d.length }; };
    fx[T + 'LayGiaTriKH_PL_MoLop_TH_SL'] = function (o) { return [{ QUYMO: o.strPhanLoaiLop_Id === 'PLLT' ? 60 : 30, SOLUONG: o.strPhanLoaiLop_Id === 'PLLT' ? 3 : 6 }]; };
    fx[T + 'LayGiaTriKH_PhanLoai_HP_SoTiet'] = function (o) { return [{ SOTIETPHANBO: o.strPhanLoaiLop_Id === 'PLLT' ? 30 : 15 }]; };
    fx[P + 'XACNHAN.LayTTKH_PhanLoai_MoLop_XacNhan'] = function (o) { return o.strDuLieuXacNhan === 'HP1' ? [{ HANHDONG_TEN: 'Đã xác nhận' }] : []; };
    var PC = { 'DK1|PLLT': [{ ID: 'NS1', GIANGVIEN_MASO: 'CB001', GIANGVIEN_HODEM: 'Nguyễn Văn', GIANGVIEN_TEN: 'Hùng', DAOTAO_COCAUTOCHUC_TEN: 'Bộ môn KTPM', CAUTRUCTHONGTINPHANGIANG: 'Lớp 01, 02' }] };
    function k(o) { return o.strKh_Kehoach_HP_Dk_Th_Id + '|' + o.strPhanLoaiLop_Id; }
    fx[T + 'LayDSKH_PhanCong_GiangVien_TH'] = function (o) { return PC[k(o)] || []; };
    fx[T + 'Them_KH_PhanCong_GiangVien_TH'] = function (o) {
        var l = PC[k(o)] = PC[k(o)] || [], r = l.filter(function (x) { return x.ID === o.strGiangVien_Id; })[0];
        if (!r) { r = { ID: o.strGiangVien_Id, GIANGVIEN_MASO: o.strGiangVien_Id, GIANGVIEN_HODEM: 'Mới', GIANGVIEN_TEN: o.strGiangVien_Id, DAOTAO_COCAUTOCHUC_TEN: '' }; l.push(r); }
        r.CAUTRUCTHONGTINPHANGIANG = o.strCauTrucThongTinPhanGiang || '';
        return [];
    };
    fx[T + 'Xoa_KH_PhanCong_GiangVien_TH'] = function (o) { PC[k(o)] = (PC[k(o)] || []).filter(function (x) { return x.ID !== o.strGiangVien_Id; }); return []; };
    ums.demo.add(fx);
})();
