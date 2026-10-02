/* Dữ liệu mẫu cho phanlichgiang / tracuulichgiang — chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {}, L = 'KHCT_LichGiang/', D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    fx[L + 'LayDSThoiGian'] = [{ ID: 'TG1', DAOTAO_THOIGIANDAOTAO: '2026_2027_1' }, { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: '2025_2026_2' }];
    fx[L + 'LayDSHeDaoTao'] = function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'H1', TEN: 'Đại học chính quy', MA: 'DHCQ' }] : []; };
    fx[L + 'LayDSHocPhan'] = function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'HP1', MA: 'IT3100', TEN: 'Lập trình HĐT' }, { ID: 'HP2', MA: 'IT3200', TEN: 'Cơ sở dữ liệu' }] : []; };
    var LOP = [{ ID: 'LHP1', IDHOCPHAN: 'HP1', TENLOPHOCPHAN: 'IT3100.01', DAOTAO_HOCPHAN_MA: 'IT3100', DAOTAO_HOCPHAN_TEN: 'Lập trình HĐT', DAOTAO_HOCPHAN_SOTC: 3, SOSINHVIEN: 60, KETQUAXACNHAN_TEN: 'Đã duyệt' },
        { ID: 'LHP2', IDHOCPHAN: 'HP1', TENLOPHOCPHAN: 'IT3100.02', DAOTAO_HOCPHAN_MA: 'IT3100', DAOTAO_HOCPHAN_TEN: 'Lập trình HĐT', DAOTAO_HOCPHAN_SOTC: 3, SOSINHVIEN: 55, DACHINHSUA: '1' }];
    fx[L + 'LayDSLopHocPhan'] = function (o) { return o.strDaoTao_HocPhan_Id === 'HP1' ? { rows: LOP, pager: LOP.length } : []; };
    var LICH = [['02/09/2026', 2], ['04/09/2026', 4], ['09/09/2026', 2], ['11/09/2026', 4]].map(function (x, i) {
        return { ID: 'LH' + i, NGAYBATDAU: i < 2 ? '01/09/2026' : '08/09/2026', NGAYKETTHUC: i < 2 ? '07/09/2026' : '14/09/2026', NGAYHOC: x[0], THUHOC: x[1], PHANGIANG: i ? '' : 'DAPHANGIANG' };
    });
    fx[L + 'LayDSLich'] = function (o) { return o.strIdLopHocPhan ? LICH : []; };
    var PG = [
        { ID: 'P1', TKB_LICHGIANG_HOCPHAN_ID: 'LH0', TENLOPHOCPHAN: 'IT3100.01', NGAYHOC: '02/09/2026', LICHHOC_SOTIET: 3, LICHHOC_TIETBATDAU: 1, LICHHOC_TIETKETTHUC: 3, SOSINHVIEN: 60, SOTIET: 3, TIETBATDAU: 1, TIETKETTHUC: 3,
          DAOTAO_BAIHOC_ID: 'BH1', IDHINHTHUCHOC: 'LT', NHANSU_HOSOCANBO_ID: 'GV1', TKB_PHANLOAIDIADIEM_ID: 'DD1', MOTA: '' },
        { ID: 'P2', TKB_LICHGIANG_HOCPHAN_ID: 'LH1', TENLOPHOCPHAN: 'IT3100.01', NGAYHOC: '04/09/2026', LICHHOC_SOTIET: 3, LICHHOC_TIETBATDAU: 7, LICHHOC_TIETKETTHUC: 9, SOSINHVIEN: 30, SOTIET: 3, TIETBATDAU: 7, TIETKETTHUC: 9,
          IDHINHTHUCHOC: 'TH', NHANSU_HOSOCANBO_ID: '', MOTA: 'Nhóm 1' }];
    function kq(ds) { return { rows: { rs: ds, rsHoatDong: [{ ID: 'LT', TENHINHTHUCHOC: 'Lý thuyết' }, { ID: 'TH', TENHINHTHUCHOC: 'Thực hành' }],
        rsGiangVienTrongTruong: [{ ID: 'GV1', HOTEN: 'Nguyễn Văn Hùng', MASO: 'CB001' }, { ID: 'GV2', HOTEN: 'Trần Thị Mai', MASO: 'CB015' }],
        rsGiangVienNgoaiTruong: [{ ID: 'GV9', HOTEN: 'Lê Văn Khách', MASO: 'NT01' }] } }; }
    fx[L + 'LayDanhSach'] = function () { return kq(PG); };
    fx[L + 'LayDSLichPhanGiangChiTietId'] = function (o) { var ids = [o.strTKB_LichGiang_HocPhan_Id, o.strTKB_LichGiang_HocPhan_Id2].join(','); return kq(PG.filter(function (p) { return ids.indexOf(p.TKB_LICHGIANG_HOCPHAN_ID) >= 0; })); };
    fx[L + 'LayTTLichPhanGiang_BaiHoc'] = function () { return kq(PG.slice(0, 1)); };
    fx[L + 'CapNhat'] = function (o) { PG.forEach(function (p) { if (p.ID === o.strId) { p.SOTIET = o.dSoTiet; p.NHANSU_HOSOCANBO_ID = o.strNhanSu_HoSoCanBo_Id; p.MOTA = o.strMoTa; p.IDHINHTHUCHOC = o.strIdHinhThucHoc; } }); return []; };
    fx[L + 'ThemMoi'] = function (o) { PG.push({ ID: 'P' + (PG.length + 1), TKB_LICHGIANG_HOCPHAN_ID: o.strTKB_LichGiang_HocPhan_Id, NGAYHOC: '', TENLOPHOCPHAN: 'IT3100.01' }); return []; };
    fx[L + 'Xoa'] = function (o) { PG = PG.filter(function (p) { return p.ID !== o.strId; }); return []; };
    fx[D + 'KHCT.DDPG'] = [{ ID: 'DD1', TEN: 'Trong trường' }, { ID: 'DD2', TEN: 'Doanh nghiệp' }];
    var BH = [{ ID: 'BH1', TENBAI: 'Bài 1 — Lớp và đối tượng', SOTIET: 3, NOIDUNG: 'Khái niệm' }];
    fx['KHCT_BaiHoc/LayDanhSach'] = function () { return BH; };
    fx['KHCT_BaiHoc/LayChiTiet'] = function (o) { return BH.filter(function (b) { return b.ID === o.strId; }); };
    fx['KHCT_BaiHoc/ThemMoi'] = function (o) { BH.push({ ID: 'BH' + (BH.length + 1), TENBAI: o.strTenBai, SOTIET: o.dSoTiet, NOIDUNG: o.strNoiDung }); return []; };
    fx['KHCT_BaiHoc/CapNhat'] = function (o) { BH.forEach(function (b) { if (b.ID === o.strId) { b.TENBAI = o.strTenBai; b.SOTIET = o.dSoTiet; b.NOIDUNG = o.strNoiDung; } }); return []; };
    fx['KHCT_BaiHoc/Xoa'] = function (o) { var ids = o.strIds.split(','); BH = BH.filter(function (b) { return ids.indexOf(b.ID) < 0; }); return []; };
    fx[L + 'LayDSLopHocPhanCanKeThua'] = [{ ID: 'LHP2', TENLOPHOCPHAN: 'IT3100.02', DAOTAO_HOCPHAN_MA: 'IT3100', DAOTAO_HOCPHAN_TEN: 'Lập trình HĐT', DAOTAO_HOCPHAN_SOTC: 3, SOSINHVIEN: 55 }];
    fx[L + 'KeThua'] = [];
    fx[D + 'TKB_PHANGIANG.XNKK'] = [{ ID: 'XN1', TEN: 'Đồng ý', THONGTIN1: 'fa fa-check-circle', THONGTIN2: 'color:#198754', HESO1: 1 }, { ID: 'XN2', TEN: 'Yêu cầu sửa', THONGTIN1: 'fa fa-pencil', THONGTIN2: 'color:#e8590c', HESO1: 2 }];
    var XN = [];
    fx['KHCT_XacNhanPhanGiang/LayDanhSach'] = function () { return XN; };
    fx['KHCT_XacNhanPhanGiang/ThemMoi'] = function (o) { XN.unshift({ TINHTRANG_TEN: o.strTinhTrang_Id === 'XN1' ? 'Đồng ý' : 'Yêu cầu sửa', NOIDUNG: o.strNoiDung, NGUOIXACNHAN_TENDAYDU: 'Trưởng khoa', NGAYTAO_DD_MM_YYYY: '22/09/2026' }); return []; };
    fx['KHCT_LichGiang_Import/Xoa'] = []; fx['KHCT_TinhToan/TongHopGioGiangVaQuyDoi'] = [];
    fx['NS_HoSoV2/LayDanhSach'] = [{ ID: 'GV1', HOTEN: 'Nguyễn Văn Hùng', MASO: 'CB001' }];
    ums.demo.add(fx);
})();
