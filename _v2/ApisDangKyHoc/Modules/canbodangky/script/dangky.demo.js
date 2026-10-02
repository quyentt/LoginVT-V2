/* Dữ liệu mẫu cho canbodangky/dangky — chỉ dùng ở chế độ dựng thử. */
(function () {
    var SV = [
        ['SV01', 'CTKTPM', 'BIT220263', 'Nguyễn Văn', 'An', 'K66-KTPM1', 'Kỹ thuật phần mềm', 'Phát triển phần mềm', 'Nhóm 1'],
        ['SV02', 'CTKTPM', 'BIT220271', 'Trần Thị', 'Bình', 'K66-KTPM1', 'Kỹ thuật phần mềm', 'Phát triển phần mềm', 'Nhóm 2'],
        ['SV03', 'CTQTKD', 'BBA220561', 'Lê Minh', 'Châu', 'K66-QTKD2', 'Quản trị kinh doanh', '', ''],
        ['SV04', 'CTHTTT', 'BIT230210', 'Phạm Thu', 'Dung', 'K67-HTTT1', 'Hệ thống thông tin', 'Khoa học dữ liệu', 'Nhóm 1']
    ].map(function (x) {
        return { ID: x[0], NGANH_ID: x[1], MASO: x[2], HODEM: x[3], TEN: x[4], LOP: x[5], NGANH: x[6],
            DAOTAO_CT_DINHHUONG_TEN: x[7], DAOTAO_CT_DH_NHOM_TEN: x[8], QLSV_NGUOIHOC_TRANGTHAI: 'Đang học' };
    });
    function lop(id, ten, hp, tt, thu, gv, sl, dk, nhom, chinh, soLop, phi) {
        return { ID: id, TENLOP: ten, DAOTAO_HOCPHAN_ID: hp, THUOCTINHLOP_ID: tt === 'Lý thuyết' ? 'TT1' : 'TT2', THUOCTINHLOP_TEN: tt,
            NGAYBATDAU: '07/09/2026', NGAYKETTHUC: '20/12/2026', THUHOC: thu, GIANGVIEN: gv, SOLUONGDUKIENHOC: sl, SOTHUCTEDANGKYHOC: dk,
            MANHOMLOP: nhom, LOPHOCPHANCHINH: chinh, SOLOPTHUOCCUNGNHOM: soLop, PHISAUKHITRUMIEN: phi };
    }
    var LHP = {
        HP01: [lop('L11', 'IT3100.01 - Lập trình hướng đối tượng', 'HP01', 'Lý thuyết', '2 (tiết 1-3)', 'TS. Nguyễn Văn Hùng', 60, 42, null, 1, 1, 2550000),
               lop('L12', 'IT3100.02 - Lập trình hướng đối tượng', 'HP01', 'Lý thuyết', '4 (tiết 7-9)', 'ThS. Trần Thị Mai', 60, 60, null, 1, 1, 2550000)],
        HP02: [lop('L21', 'IT3080.01 - Mạng máy tính', 'HP02', 'Lý thuyết', '3 (tiết 1-3)', 'TS. Lê Quang Minh', 80, 51, 'N21', 1, 2, 2380000)],
        HP03: [lop('L31', 'EM1010.01 - Quản trị học đại cương', 'HP03', 'Lý thuyết', '6 (tiết 4-6)', 'ThS. Đỗ Thu Hằng', 70, 12, null, 1, 1, 1700000)]
    };
    var NHOM = [lop('L21A', 'IT3080.01.TH1 - Mạng máy tính (thực hành)', 'HP02', 'Thực hành', '5 (tiết 7-9)', 'KS. Phạm Văn Long', 40, 40, 'N21', 0, 2, 0),
                lop('L21B', 'IT3080.01.TH2 - Mạng máy tính (thực hành)', 'HP02', 'Thực hành', '6 (tiết 7-9)', 'KS. Phạm Văn Long', 40, 11, 'N21', 0, 2, 0)];
    var KQ = [{ ID: 'KQ1', DANGKY_LOPHOCPHAN_ID: 'L31', DANGKY_LOPHOCPHAN_TEN: 'EM1010.01 - Quản trị học đại cương', DAOTAO_HOCPHAN_ID: 'HP03',
        DAOTAO_HOCPHAN_TEN: 'Quản trị học đại cương', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CTKTPM', DANGKY_KEHOACHDANGKY_ID: 'KH01', THUOCTINHLOP_ID: 'TT1',
        THUOCTINHLOP_TEN: 'Lý thuyết', NGAYBATDAU: '07/09/2026', NGAYKETTHUC: '20/12/2026', THUHOC: '6', THUHOC_TIETHOC: '6 (4-6)', GIANGVIEN: 'ThS. Đỗ Thu Hằng',
        SOLUONGDUKIENHOC: 70, SOTHUCTEDANGKYHOC: 12, PHISAUKHITRUMIEN: 1700000, MANHOMLOP: null, LOPHOCPHANCHINH: 1, SOTINCHIDADANGKY: 2 }];
    var fx = {};
    fx['pkg_hosohocvien.LayDanhSachHoSo'] = function (o) {
        var q = (o.strTuKhoa || '').toLowerCase();
        var r = SV.filter(function (x) { return (!q || (x.MASO + ' ' + x.HODEM + ' ' + x.TEN).toLowerCase().indexOf(q) >= 0) && (o.dLocTheoDuLieuImport !== 1 || x.ID !== 'SV03'); });
        return { rows: r, pager: r.length };
    };
    fx['pkg_kehoach_thongtin.LayDSDaoTao_CT_DinhHuong'] = [{ ID: 'DH1', TEN: 'Phát triển phần mềm' }, { ID: 'DH2', TEN: 'Khoa học dữ liệu' }];
    fx['pkg_kehoach_thongtin2.LayDSDaoTao_CT_DH_Nhom'] = function (o) { return o.strDaoTao_CT_DinhHuong_Id ? [{ ID: 'NDH1', TEN: 'Nhóm 1' }, { ID: 'NDH2', TEN: 'Nhóm 2' }] : []; };
    fx['DKH_Chung/LayDSChuongTrinh'] = function (o) {
        var s = SV.filter(function (x) { return x.ID === o.strQLSV_NguoiHoc_Id; })[0] || SV[0];
        return [{ DAOTAO_TOCHUCCHUONGTRINH_ID: s.NGANH_ID, DAOTAO_TOCHUCCHUONGTRINH_TEN: s.NGANH, QLSV_NGUOIHOC_HODEM: s.HODEM, QLSV_NGUOIHOC_TEN: s.TEN, QLSV_NGUOIHOC_MASO: s.MASO, TAIKHOAN: s.MASO }];
    };
    fx['DKH_Chung/LayDSKeHoachDangKyHoc'] = [
        { ID: 'KH01', MAKEHOACH: 'DK20261', TENKEHOACH: 'Đăng ký học kỳ 1 năm 2026-2027', NGAYBATDAU: '15/08/2026', GIODANGKYTRONGNGAYDAU: '08', PHUTDANGKYTRONGNGAYDAU: '00',
          NGAYKETTHUC: '30/09/2026', GIOKETTHUCTRONGNGAYCUOI: '17', PHUTKETTHUCTRONGNGAYCUOI: '00', SOTINCHIDADANGKY: 2, SOTINCHITOIDACHUONGTRINH: 25, SOTINCHITOITHIEUCHUONGTRINH: 12, SOGIAYCHO: 0 },
        { ID: 'KH02', MAKEHOACH: 'DKBS20261', TENKEHOACH: 'Đăng ký bổ sung học kỳ 1', NGAYBATDAU: '01/10/2026', GIODANGKYTRONGNGAYDAU: '08', PHUTDANGKYTRONGNGAYDAU: '00',
          NGAYKETTHUC: '07/10/2026', GIOKETTHUCTRONGNGAYCUOI: '17', PHUTKETTHUCTRONGNGAYCUOI: '00', SOTINCHIDADANGKY: 2, SOTINCHITOIDACHUONGTRINH: 25, SOTINCHITOITHIEUCHUONGTRINH: 12, SOGIAYCHO: 2 }];
    fx['DKH_Chung/LayDSHocPhanDangToChuc'] = [
        { DAOTAO_HOCPHAN_ID: 'HP01', DAOTAO_HOCPHAN_MA: 'IT3100', DAOTAO_HOCPHAN_TEN: 'Lập trình hướng đối tượng', DADANGKY: 0 },
        { DAOTAO_HOCPHAN_ID: 'HP02', DAOTAO_HOCPHAN_MA: 'IT3080', DAOTAO_HOCPHAN_TEN: 'Mạng máy tính', DADANGKY: 0 },
        { DAOTAO_HOCPHAN_ID: 'HP03', DAOTAO_HOCPHAN_MA: 'EM1010', DAOTAO_HOCPHAN_TEN: 'Quản trị học đại cương', DADANGKY: 1 }];
    fx['DKH_Chung/LayDSLopHocPhanDangToChuc'] = function (o) {
        if (o.dLaLopHocPhanChinh === -1 && o.strMaNhomLop) {
            return { rs: NHOM, rsThuocTinhLopHocPhan: [{ THUOCTINHLOP_ID: 'TT2', THUOCTINHLOP_TEN: 'Thực hành', MANHOMLOP: 'N21', LOPHOCPHANCHINH: 0 }] };
        }
        if (o.strThuocTinhLop_Id) {       // đổi lịch: các lớp cùng học phần
            return { rs: (LHP[o.strDaoTao_HocPhan_Id] || []).concat([lop('L32', 'EM1010.02 - Quản trị học đại cương', 'HP03', 'Lý thuyết', '7 (tiết 1-3)', 'TS. Vũ Hoàng Nam', 70, 30, null, 1, 1, 1700000)]) };
        }
        return { rs: LHP[o.strDaoTao_HocPhan_Id] || [],
                 rsNhomKiemSoat: [{ ID: 'NKS1', TENNHOM: 'Phương án 1 — sáng thứ 2, 4' }, { ID: 'NKS2', TENNHOM: 'Phương án 2 — chiều thứ 3, 5' }] };
    };
    fx['DKH_Chung/LayKetQuaDangKyLopHocPhan'] = KQ;
    fx['DKH_Chung/LayGiangVienTheoHocPhan'] = [{ ID: 'GV1', MASO: 'CB001', HODEM: 'Nguyễn Văn', TEN: 'Hùng' }, { ID: 'GV2', MASO: 'CB015', HODEM: 'Trần Thị', TEN: 'Mai' }];
    fx['DKH_Chung/LayThuHocTheoHocPhan'] = [{ THUHOC: 'Thứ 2' }, { THUHOC: 'Thứ 4' }];
    fx['DKH_Chung/LayLichTuanTheoLopHocPhan'] = [
        { BUOIHOC: 'Buổi 1', NGAYBATDAU: '07/09/2026', NGAYKETTHUC: '07/09/2026', THUHOC: 2, SOTIET: 3, TIETBATDAU: 1, TIETKETTHUC: 3, GIOBATDAU: '07', PHUTBATDAU: '00', GIOKETTHUC: '09', PHUTKETTHUC: '30', PHONGHOC_TEN: 'D3-201', GIANGVIEN: 'TS. Nguyễn Văn Hùng', THUOCTINH_TEN: 'Lý thuyết' },
        { BUOIHOC: 'Buổi 2', NGAYBATDAU: '14/09/2026', NGAYKETTHUC: '14/09/2026', THUHOC: 2, SOTIET: 3, TIETBATDAU: 1, TIETKETTHUC: 3, GIOBATDAU: '07', PHUTBATDAU: '00', GIOKETTHUC: '09', PHUTKETTHUC: '30', PHONGHOC_TEN: 'D3-201', GIANGVIEN: 'TS. Nguyễn Văn Hùng', THUOCTINH_TEN: 'Lý thuyết' }];
    fx['DKH_Chung/LayDSLopHocPhanTheoNhomKS'] = [{ MALOP: 'IT3100.01', TENLOP: 'Lập trình hướng đối tượng - 01', SODUKIEN: 60, SODADANGKY: 42 }];
    fx['TC_ThongTin/LayDSTinhTrangTaiChinhDKH'] = { rows: {
        rsConPhaiNopHienTai: [{ SOTIEN: 1200000, NOIDUNG: 'Học phí học kỳ 2 năm 2025-2026', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 năm 2025-2026' }],
        rsConDuHienTai: [{ SOTIEN: 350000, NOIDUNG: 'Tiền thừa nộp học phí', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm 2025-2026' }],
        rsConPhaiNopTrongDotDK: [{ DANGKY_LOPHOCPHAN_TEN: 'EM1010.01 - Quản trị học đại cương', DAOTAO_HOCPHAN_TEN: 'Quản trị học đại cương', DAOTAO_HOCPHAN_MA: 'EM1010',
            TAICHINH_CACKHOANTHU_TEN: 'Học phí', SOTINCHI: 2, KIEUHOC_TEN: 'Học lần đầu', SOTIEN: 1700000, PHAMTRAMMIEN: 0, SOTIENDUOCMIEN: 0, SOTIENPHAINOP: 1700000 }]
    }, raw: { Id: -850000 } };
    fx['DKH_DangKyMH/DangKyHocTrucTiep'] = { rows: [], raw: { Id: 'DK' + Date.now() } };
    fx['DKH_DangKyMH/ThucHienHuyDangKyHoc'] = { rows: [] };
    fx['DKH_DangKyMH/ThucHienDoiLichDangKyHoc'] = { rows: [] };
    fx['DKH_Import/Xoa_DangKy_NguoiHoc_Import'] = { rows: [] };
    ums.demo.add(fx);
})();
