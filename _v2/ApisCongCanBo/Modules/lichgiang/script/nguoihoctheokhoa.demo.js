/* Dữ liệu mẫu cho nguoihoc / nguoihoctheokhoa — chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {}, N = 'NS_ThongTinCanBo/', D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    var TG = [{ ID: 'TG1', THOIGIAN: '2026_2027_1' }, { ID: 'TG2', THOIGIAN: '2025_2026_2' }];
    var HP = [{ ID: 'HP1', MA: 'IT3100', TEN: 'Lập trình hướng đối tượng' }, { ID: 'HP2', MA: 'IT3200', TEN: 'Cơ sở dữ liệu' }];
    var LOP = [
        { ID: 'L1', MALOP: 'IT3100.01', TENLOP: 'Lập trình HĐT 01', NGAYBATDAU: '01/09/2026', NGAYKETTHUC: '30/12/2026', SOLUONG: 2, HP: 'HP1', HE: 'H1',
          DSGIANGVIENTHEOCAUTRUC: 'NS1:Nguyễn Văn Hùng;NS2:Trần Thị Mai' },
        { ID: 'L2', MALOP: 'IT3200.02', TENLOP: 'Cơ sở dữ liệu 02', NGAYBATDAU: '03/09/2026', NGAYKETTHUC: '30/12/2026', SOLUONG: 2, HP: 'HP2', HE: 'H2', DSGIANGVIENTHEOCAUTRUC: '' }
    ];
    function lop(o) { return LOP.filter(function (l) { return (!o.strDaoTao_HocPhan_Id || l.HP === o.strDaoTao_HocPhan_Id) && (!o.strDaoTao_HeDaoTao_Id || l.HE === o.strDaoTao_HeDaoTao_Id); }); }
    fx[N + 'LayDSThoiGianTheoLichCaNhan'] = TG; fx[N + 'LayDSThoiGianTheoKhoaQL'] = TG;
    fx[N + 'LayDSHocPhanTheoLichCaNhan'] = HP; fx[N + 'LayDSHocPhanTheoKhoaQL'] = function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? HP : []; };
    fx[N + 'LayDSHeDaoTaoTheoKhoaQL'] = function (o) { return o.strDaoTao_HocPhan_Id ? [{ ID: 'H1', TEN: 'Đại học chính quy' }, { ID: 'H2', TEN: 'Vừa làm vừa học' }] : []; };
    fx[N + 'LayDSLopHocPhanTheoLichCaNhan'] = lop; fx[N + 'LayDSLopHocPhanTheoKhoaQL'] = lop;
    var SV = [
        { QLSV_NGUOIHOC_ID: 'NH01', QLSV_NGUOIHOC_MASO: 'BIT220101', QLSV_NGUOIHOC_HODEM: 'Nguyễn Văn', QLSV_NGUOIHOC_TEN: 'An', QLSV_NGUOIHOC_NGAYSINH: '01/02/2004', DAOTAO_LOPQUANLY_TEN: 'K67-KTPM1',
          DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Kỹ thuật phần mềm', DAOTAO_KHOADAOTAO_TEN: 'K67', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', DANGKY_LOPHOCPHAN_ID: 'DK1',
          TONGSOTIETHOC: 45, TONGSOTIETCOMAT: 42, PHANTRAMHOANTHANH: '80%', PHANTRAMTHUCHIEN: '93%' },
        { QLSV_NGUOIHOC_ID: 'NH02', QLSV_NGUOIHOC_MASO: 'BIT220102', QLSV_NGUOIHOC_HODEM: 'Trần Thị', QLSV_NGUOIHOC_TEN: 'Bình', QLSV_NGUOIHOC_NGAYSINH: '12/05/2004', DAOTAO_LOPQUANLY_TEN: 'K67-KTPM1',
          DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Kỹ thuật phần mềm', DAOTAO_KHOADAOTAO_TEN: 'K67', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', DANGKY_LOPHOCPHAN_ID: 'DK2',
          TONGSOTIETHOC: 45, TONGSOTIETCOMAT: 45, PHANTRAMHOANTHANH: '80%', PHANTRAMTHUCHIEN: '100%' }
    ];
    fx['DKH_BaoCao/LayDSDangKyHoc'] = { rows: { rs: SV } };
    fx[N + 'LayDSDangKyHoc'] = { rows: { rs: SV } };
    fx[N + 'LayDSLichGiang'] = function (o) {
        return ['02/09/2026', '04/09/2026', '09/09/2026'].map(function (d, i) {
            return { ID: 'LG' + i, IDLOPHOCPHAN: o.strDaoTao_LopHocPhan_Id, NGAYHOC: d, GIOBATDAU: 7, PHUTBATDAU: 0, GIOKETTHUC: 9, PHUTKETTHUC: 25, GV: o.strNhanSu_HoSoCanBo_Id };
        });
    };
    fx[D + 'QLSV.KIEUCHUYENCAN'] = [{ ID: 'K1', MA: 'CM', TEN: 'Có mặt' }, { ID: 'K2', MA: 'VP', TEN: 'Vắng có phép' }];
    fx['CC_ThoiGian_ChuyenCan/LayKetQuaTheoKieuChuyenCan'] = [{ QLSV_NGUOIHOC_ID: 'NH01', KIEUCHUYENCAN_ID: 'K1', GIATRI: 1, SOLUONG: 0 }];
    fx['CC_ThoiGian_ChuyenCan/LayKQTongHopTheoKieuChuyenCan'] = function (o) { return SV.map(function (s) { return { QLSV_NGUOIHOC_ID: s.QLSV_NGUOIHOC_ID, TONGSOBUOI: o.strKieuChuyenCan_Id === 'K1' ? 14 : 1, TONGSOTIET: o.strKieuChuyenCan_Id === 'K1' ? 42 : 3 }; }); };
    fx['CC_NguoiHoc_ChuyenCan/ThemMoi'] = []; fx['CC_NguoiHoc_ChuyenCan/Xoa_QLSV_NguoiHoc_ChuyenCan2'] = []; fx['CC_GiangVien_TuGhiNhan/XuLyDiemDanhKhongTonTaiTKB'] = [];
    var LS = [];
    fx['pkg_diem_chung.LayDSHanhDongXacNhan'] = [{ ID: '1', TEN: 'Hoàn thành' }, { ID: '0', TEN: 'Chưa hoàn thành' }];
    fx['pkg_diem_chung.LayDSDiem_XacNhan'] = function (o) { return LS.filter(function (x) { return x.L === o.strDuLieuXacNhan && x.LOAI === o.strLoaiXacNhan_Id; }); };
    fx['pkg_diem_chung.Them_Diem_XacNhan'] = function (o) { LS.unshift({ L: o.strDuLieuXacNhan, LOAI: o.strLoaiXacNhan_Id, TEN: o.strHanhDong_Id === '1' ? 'Hoàn thành' : 'Chưa hoàn thành', NGUOIXACNHAN_TENDAYDU: 'Quản trị', NGAYTAO_DD_MM_YYYY: '22/09/2026' }); return []; };
    ums.demo.add(fx);
})();
