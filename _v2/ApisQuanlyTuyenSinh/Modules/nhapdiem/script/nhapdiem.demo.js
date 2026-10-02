/* Dữ liệu mẫu cho Nhập điểm tuyển sinh — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    var fx = {};
    fx['D_LoaiDanhSach/LayLoaiDanhSach'] = [{ ID: 'LDSTS', TEN: 'Danh sách thi tuyển sinh' }, { ID: 'LDSXT', TEN: 'Danh sách xét tuyển' }];
    fx['D_ThoiGian/LayDanhSach'] = function (o) { return o.strLoaiDanhSach_Id ? [{ ID: 'TGTS26', DAOTAO_THOIGIANDAOTAO: 'Tuyển sinh 2026 - đợt 1' }, { ID: 'TGTS262', DAOTAO_THOIGIANDAOTAO: 'Tuyển sinh 2026 - đợt 2' }] : []; };
    fx['D_HocPhan/LayDanhSach'] = function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'MT1', TEN: 'Toán' }, { ID: 'MT2', TEN: 'Ngữ văn' }, { ID: 'MT3', TEN: 'Tiếng Anh' }] : []; };
    var BD = [
        { ID: 'BDTS1', LOAIDANHSACH_TEN: 'Danh sách thi tuyển sinh', MA: 'TS26.TOAN.P01', TEN: 'Phòng thi 01 - Toán', DAOTAO_HOCPHAN_MA: 'TOAN',
          DAOTAO_HOCPHAN_TEN: 'Toán', SOLUONG: 3, TYLENHAPDIEM: 67, DAOTAO_THOIGIANDAOTAO: 'Tuyển sinh 2026 - đợt 1', HP: 'MT1', TG: 'TGTS26' },
        { ID: 'BDTS2', LOAIDANHSACH_TEN: 'Danh sách thi tuyển sinh', MA: 'TS26.VAN.P01', TEN: 'Phòng thi 01 - Ngữ văn', DAOTAO_HOCPHAN_MA: 'VAN',
          DAOTAO_HOCPHAN_TEN: 'Ngữ văn', SOLUONG: 3, TYLENHAPDIEM: 0, DAOTAO_THOIGIANDAOTAO: 'Tuyển sinh 2026 - đợt 1', HP: 'MT2', TG: 'TGTS26' },
        { ID: 'BDTS3', LOAIDANHSACH_TEN: 'Danh sách thi tuyển sinh', MA: 'TS26.ANH.P02', TEN: 'Phòng thi 02 - Tiếng Anh', DAOTAO_HOCPHAN_MA: 'ANH',
          DAOTAO_HOCPHAN_TEN: 'Tiếng Anh', SOLUONG: 0, TYLENHAPDIEM: 0, DAOTAO_THOIGIANDAOTAO: 'Tuyển sinh 2026 - đợt 2', HP: 'MT3', TG: 'TGTS262' }
    ];
    fx['D_Hoc/LayDanhSach'] = function (o) {
        var q = String(o.strTuKhoa || '').toLowerCase();
        var r = BD.filter(function (x) {
            return (!o.strDaoTao_ThoiGianDaoTao_Id || x.TG === o.strDaoTao_ThoiGianDaoTao_Id) && (!o.strDaoTao_HocPhan_Id || x.HP === o.strDaoTao_HocPhan_Id) &&
                (!q || (x.MA + ' ' + x.TEN).toLowerCase().indexOf(q) >= 0);
        });
        return { rows: r, pager: r.length };
    };
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DIEM.NHAPDIEM.SAPXEP'] = [{ ID: 'ABC', TEN: 'Xếp theo ABC' }, { ID: 'MASO', TEN: 'Xếp theo số báo danh' }];
    fx['D_CongThuc/LayChiTiet'] = function () {
        return { rows: { rsDSCotThongTinNguoiHoc: [{ MACOT: 'MASO', TENCOT: 'Số báo danh' }, { MACOT: 'HODEM', TENCOT: 'Họ đệm' }, { MACOT: 'TEN', TENCOT: 'Tên', CHUDAM: 'font-weight:bold' }, { MACOT: 'NGAYSINH', TENCOT: 'Ngày sinh' }],
            rsDSCotThongTinDiem: [{ MACOT: 'BAITHI', TENCOT: 'Điểm bài thi', MACOT_CHA: null }, { MACOT: 'TL', TENCOT: 'Tự luận', MACOT_CHA: 'BAITHI' },
                { MACOT: 'TN', TENCOT: 'Trắc nghiệm', MACOT_CHA: 'BAITHI' }, { MACOT: 'UT', TENCOT: 'Điểm ưu tiên', MACOT_CHA: null },
                { MACOT: 'TONG', TENCOT: 'Tổng điểm', MACOT_CHA: null }] } };
    };
    var NH = [['TSN1', 'TS260001', 'Nguyễn Thu', 'Hằng', '14/02/2008'], ['TSN2', 'TS260002', 'Trần Quốc', 'Khánh', '03/09/2008'], ['TSN3', 'TS260003', 'Phạm Thị', 'Lan', '22/12/2007']].map(function (x, i) {
        return { ID: 'DSNHTS' + i, QLSV_NGUOIHOC_ID: x[0], MASO: x[1], HODEM: x[2], TEN: x[3], NGAYSINH: x[4], HODEMNGUOIHOC: x[2], TENNGUOIHOC: x[3],
            DAOTAO_HOCPHAN_ID: 'MT1', DIEM_DANHSACHHOC_ID: 'BDTS1', DAOTAO_THOIGIANDAOTAO_ID: 'TGTS26', CHUONGTRINH_ID: '', LANHOC: 1, LANTHI: 1 };
    });
    fx['D_Hoc_NguoiHoc/LayDanhSach'] = function (o) { return o.strDiem_DanhSachHoc_Id === 'BDTS1' ? NH : []; };
    var DIEM = { TL: [6.5, 4, ''], TN: [2.75, 3, ''], UT: [0.5, 0, 1], TONG: [9.75, 7, ''] };
    fx['D_Hoc_NguoiHoc_Diem/LayGiaTriDiemTheoDanhSach'] = function (o) {
        return NH.map(function (n, i) { return { QLSV_NGUOIHOC_ID: n.QLSV_NGUOIHOC_ID, GIATRICOTDULIEU: DIEM[o.strKyHieuCotDuLieu][i], CHIXEM: o.strKyHieuCotDuLieu === 'TONG' ? 1 : 0 }; });
    };
    fx['D_Hoc_NguoiHoc_Diem/Nhan_Diem_NguoiHoc_ThanhPhan'] = function (o) {
        var i = NH.map(function (n) { return n.QLSV_NGUOIHOC_ID; }).indexOf(o.strQLSV_NguoiHoc_Id);
        if (DIEM[o.strDiem_ThanhPhanDiem_Id] && i >= 0) DIEM[o.strDiem_ThanhPhanDiem_Id][i] = o.strDiem;
        return [];
    };
    fx['D_Hoc_NguoiHoc_Diem/Tinh_Diem_NguoiHoc_ThanhPhan'] = [];
    fx['D_Diem_MacDinh/Nhap_Diem_MacDinh_DanhSach'] = [];
    fx['D_Hoc_NguoiHoc_Diem_Import/Import'] = { rows: 3 };
    fx['NS_Files/LayDanhSach'] = [];
    fx['D_HanhDongXacNhan/LayDanhSach'] = [{ ID: 'HDX1', TEN: 'Hoàn thành', THONGTIN1: 'fa fa-check-circle', THONGTIN2: 'color: #198754' },
        { ID: 'HDX2', TEN: 'Hủy hoàn thành', THONGTIN1: 'fa fa-times-circle', THONGTIN2: 'color: #dc3545' }];
    fx['D_XacNhan/XacNhan_DanhSachDiem'] = [];
    ums.demo.add(fx);
})();
