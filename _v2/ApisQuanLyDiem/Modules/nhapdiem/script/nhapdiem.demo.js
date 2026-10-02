/* Dữ liệu mẫu cho nhapdiem (Quản lý điểm) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {};
    fx['D_LoaiDanhSach/LayLoaiDanhSach'] = [{ ID: 'LDS1', TEN: 'Lớp học phần' }, { ID: 'LDS2', TEN: 'Danh sách thi' }];
    fx['D_ThoiGian/LayDanhSach'] = function (o) { return o.strLoaiDanhSach_Id ? [{ ID: 'TG1', DAOTAO_THOIGIANDAOTAO: '2026_2027_1' }, { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: '2025_2026_2' }] : []; };
    fx['D_LopQuanLy/LayDanhSach'] = function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'LQL1', TEN: 'KTPM01-K67' }, { ID: 'LQL2', TEN: 'HTTT02-K67' }] : []; };
    fx['D_HocPhan/LayDanhSach'] = function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'HP1', TEN: 'Lập trình hướng đối tượng', MA: 'IT3100' }, { ID: 'HP2', TEN: 'Cơ sở dữ liệu', MA: 'IT3200' }] : []; };
    fx['pkg_thi_tochucthi.LayDSDangKy_KeHoachDangKy'] = function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'KH1', TENKEHOACH: 'Đăng ký học kỳ 1 năm 2026-2027' }] : []; };
    fx['D_Hoc/LayDanhSach'] = function () {
        return { rows: [{ ID: 'BD1', LOAIDANHSACH_TEN: 'Lớp học phần', MA: 'IT3100.01', TEN: 'Lập trình HĐT - Nhóm 1', DAOTAO_HOCPHAN_MA: 'IT3100', DAOTAO_HOCPHAN_TEN: 'Lập trình hướng đối tượng',
            DSGIANGVIEN: 'Nguyễn Văn Hải', SOLUONG: 3, TYLENHAPDIEM: 67, XACNHANHOANTHANHNHAPDIEM: 1, XACNHANHOANTHANHDIEMDANH: 0, NGAYBATDAU: '08/09/2026', NGAYKETTHUC: '20/12/2026',
            DAOTAO_THOIGIANDAOTAO: '2026_2027_1' },
            { ID: 'BD2', LOAIDANHSACH_TEN: 'Lớp học phần', MA: 'IT3100.02', TEN: 'Lập trình HĐT - Nhóm 2', DAOTAO_HOCPHAN_MA: 'IT3100', DAOTAO_HOCPHAN_TEN: 'Lập trình hướng đối tượng',
            DSGIANGVIEN: 'Trần Thị Mai', SOLUONG: 0, TYLENHAPDIEM: 0, XACNHANHOANTHANHNHAPDIEM: 0, XACNHANHOANTHANHDIEMDANH: 1, NGAYBATDAU: '08/09/2026', NGAYKETTHUC: '20/12/2026',
            DAOTAO_THOIGIANDAOTAO: '2026_2027_1' }], pager: 2 };
    };
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DIEM.NHAPDIEM.SAPXEP'] = [];
    fx['D_CongThuc/LayChiTiet'] = function () {
        return { rows: { rsDSCotThongTinNguoiHoc: [{ MACOT: 'MASO', TENCOT: 'Mã số' }, { MACOT: 'HODEM', TENCOT: 'Họ đệm' }, { MACOT: 'TEN', TENCOT: 'Tên', CHUDAM: 'font-weight:bold' }, { MACOT: 'LOP', TENCOT: 'Lớp' }],
            rsDSCotThongTinDiem: [{ MACOT: 'QT', TENCOT: 'Điểm quá trình', MACOT_CHA: null }, { MACOT: 'CC', TENCOT: 'Chuyên cần', MACOT_CHA: 'QT' },
                { MACOT: 'GK', TENCOT: 'Giữa kỳ', MACOT_CHA: 'QT' }, { MACOT: 'CK', TENCOT: 'Cuối kỳ', MACOT_CHA: null },
                { MACOT: 'TK', TENCOT: 'Tổng kết', MACOT_CHA: null }, { MACOT: 'CHU', TENCOT: 'Điểm chữ', MACOT_CHA: null }] } };
    };
    var NH = [['SV1', 'SV2201', 'Trần Minh', 'Anh'], ['SV2', 'SV2202', 'Lê Thu', 'Hà'], ['SV3', 'SV2203', 'Phạm Quốc', 'Bảo']].map(function (x, i) {
        return { ID: 'DSNH' + i, QLSV_NGUOIHOC_ID: x[0], MASO: x[1], HODEM: x[2], TEN: x[3], LOP: 'KTPM01', HODEMNGUOIHOC: x[2], TENNGUOIHOC: x[3],
            DAOTAO_HOCPHAN_ID: 'HP1', DIEM_DANHSACHHOC_ID: 'BD1', DAOTAO_THOIGIANDAOTAO_ID: 'TG1', CHUONGTRINH_ID: 'CT1', LANHOC: 1, LANTHI: 1 };
    });
    fx['D_Hoc_NguoiHoc/LayDanhSach'] = function (o) { return o.strDiem_DanhSachHoc_Id === 'BD1' ? NH : []; };
    var DIEM = { CC: [9, 8, ''], GK: [7.5, 6, ''], CK: [8, 5.5, ''], TK: [8.1, 6.1, ''], CHU: ['B+', 'C', ''] };
    fx['D_Hoc_NguoiHoc_Diem/LayGiaTriDiemTheoDanhSach'] = function (o) {
        return NH.map(function (n, i) { return { QLSV_NGUOIHOC_ID: n.QLSV_NGUOIHOC_ID, GIATRICOTDULIEU: DIEM[o.strKyHieuCotDuLieu][i], CHIXEM: /TK|CHU/.test(o.strKyHieuCotDuLieu) ? 1 : 0 }; });
    };
    fx['D_Hoc_NguoiHoc_Diem/Nhan_Diem_NguoiHoc_ThanhPhan'] = function (o) {
        var i = NH.map(function (n) { return n.QLSV_NGUOIHOC_ID; }).indexOf(o.strQLSV_NguoiHoc_Id);
        if (DIEM[o.strDiem_ThanhPhanDiem_Id] && i >= 0) DIEM[o.strDiem_ThanhPhanDiem_Id][i] = o.strDiem; return [];
    };
    fx['D_Hoc_NguoiHoc_Diem/Tinh_Diem_NguoiHoc_ThanhPhan'] = [];
    fx['TP_XuLyTuKhoa/QuyDoiRubricTheoLopHocPhan'] = [];
    fx['D_Diem_MacDinh/Nhap_Diem_MacDinh_DanhSach'] = [];
    fx['D_NguoiHoc/XacNhanDiem_DanhSachHoc'] = [];
    fx['D_Hoc_NguoiHoc_Diem_Import/Import'] = { rows: 3 };
    fx['NS_Files/LayDanhSach'] = [];
    fx['D_HanhDongXacNhan/LayDanhSach'] = [{ ID: 'HDX1', TEN: 'Hoàn thành', THONGTIN1: 'fa fa-check-circle', THONGTIN2: 'color: #198754' },
        { ID: 'HDX2', TEN: 'Hủy hoàn thành', THONGTIN1: 'fa fa-times-circle', THONGTIN2: 'color: #dc3545' }];
    var LS = [];
    fx['D_XacNhan/LayDSDiem_XacNhan'] = function (o) { return LS.filter(function (x) { return x.id === o.strDuLieuXacNhan && x.loai === o.strLoaiXacNhan_Id; }); };
    fx['D_XacNhan/Them_Diem_XacNhan'] = function (o) {
        LS.unshift({ id: o.strDuLieuXacNhan, loai: o.strLoaiXacNhan_Id, TEN: o.strHanhDong_Id === 'HDX1' ? 'Hoàn thành' : 'Hủy hoàn thành', NGUOIXACNHAN_TENDAYDU: 'Nguyễn Văn Quản', NGAYTAO_DD_MM_YYYY: '25/09/2026' });
        return [];
    };
    ums.demo.add(fx);
})();
