/* Dữ liệu mẫu cho thongke/chuyencan — chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {}, D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    fx[D + 'QLSV.KIEUCHUYENCAN'] = [{ ID: 'K1', MA: 'CM', TEN: 'Có mặt' }, { ID: 'K2', MA: 'VP', TEN: 'Vắng có phép' }];
    fx[D + 'QLSV.CHUYENCAN.LOAITHONGKE'] = [{ ID: 'LT1', MA: 'SOBUOI', TEN: 'Theo số buổi' }, { ID: 'LT2', MA: 'SOTIET', TEN: 'Theo số tiết' }];
    fx['CC_ThongTin/LayDSThoiGian'] = [{ ID: 'TG1', THOIGIAN: '2026_2027_1' }];
    fx['CC_ThongTin/LayDSHocPhan'] = function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'HP1', TEN: 'Lập trình HĐT' }, { ID: 'HP2', TEN: 'Cơ sở dữ liệu' }] : []; };
    fx['CC_ThongTin/LayDSLopHocPhan'] = function (o) { return o.strDaoTao_HocPhan_Id ? [{ ID: 'LHP1', TEN: 'IT3100.01' }] : []; };
    function kq(o) {
        var rs = [{ ID: 'SV1', MA: 'BIT220101', TEN: 'Nguyễn Văn An' }, { ID: 'SV2', MA: 'BIT220102', TEN: 'Trần Thị Bình' }];
        var ngay = o.dPhanLoaiKieuXem === '0' ? [{ ID: 'N1', NGAYGHINHAN: '02/09/2026', GIO: 7, PHUT: 0, GIOKETTHUC: 9, PHUTKETTHUC: 25 }, { ID: 'N2', NGAYGHINHAN: '04/09/2026', GIO: 13, PHUT: 0, GIOKETTHUC: 15, PHUTKETTHUC: 30 }] : [];
        return { rows: { rs: rs, rsNgayDiemDanh: ngay } };
    }
    ['LayDanhSachHoSoNhieuNganh', 'LayDanhSachLopHocPhan', 'LayDanhSachHocPhan', 'LayDanhSachLopQuanLy', 'LayDanhSachLopChuongTrinh', 'LayDanhSachKhoaQuanLy', 'LayDanhSachKhoaDaoTao']
        .forEach(function (m) { fx['CC_ThongKe/' + m] = kq; });
    fx['CC_ThongKe/LayKQTongHopChuyenCanTheoNgay'] = function (o) { return [{ SOLUONG: o.strKieuChuyenCan_Id === 'K1' ? 14 : 1 }]; };
    fx['CC_ThongKe/LayKQCaNhanChuyenCanTheoNgay'] = function (o) { return [{ GIATRI: (o.strKieuChuyenCan_Id === 'K1') !== (o.strQLSV_NguoiHoc_Id === 'SV2' && o.strNgay_Gio_Phut_Giay_Id === 'N2') ? 1 : 0, SOLUONG: 3 }]; };
    ums.demo.add(fx);
})();
