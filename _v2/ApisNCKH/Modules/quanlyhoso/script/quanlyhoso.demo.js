/* Dữ liệu mẫu — Quản lý hồ sơ (NCKH), chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    var KH = [
        { ID: 'QKH1', MOTA: 'Kế hoạch nhập hồ sơ nghiên cứu sinh 2025', XACNHANTHONGTIN: '1' },
        { ID: 'QKH2', MOTA: 'Bổ sung hồ sơ lý lịch khoa học', XACNHANTHONGTIN: '0' }
    ];
    var SV = [
        { ID: 'PV1', QLSV_NGUOIHOC_ID: 'NH01', QLSV_NGUOIHOC_HODEM: 'Nguyễn Văn', QLSV_NGUOIHOC_TEN: 'An', QLSV_NGUOIHOC_MASO: 'BIT220101', ANH: '', KH: 'QKH1' },
        { ID: 'PV2', QLSV_NGUOIHOC_ID: 'NH02', QLSV_NGUOIHOC_HODEM: 'Trần Thị', QLSV_NGUOIHOC_TEN: 'Bình', QLSV_NGUOIHOC_MASO: 'BIT220102', ANH: '', KH: 'QKH1' },
        { ID: 'PV3', QLSV_NGUOIHOC_ID: 'NH03', QLSV_NGUOIHOC_HODEM: 'Lê Minh', QLSV_NGUOIHOC_TEN: 'Châu', QLSV_NGUOIHOC_MASO: 'BBA220561', ANH: '', KH: 'QKH2' }
    ];
    var TRUONG = [
        ['T01', 'TB1', 'Thông tin cá nhân', 'Họ và tên khai sinh', 'TEXT', 'Nguyễn Văn An', 'Nguyễn Văn An', 'Đã xác nhận', {}],
        ['T02', 'TB1', 'Thông tin cá nhân', 'Ngày sinh', 'DATE', '12/03/2004', '12/03/2004', '', {}],
        ['T03', 'TB1', 'Thông tin cá nhân', 'Giới tính', 'LIST', 'NAM', 'NAM', '', { MABANGDANHMUC: 'CHUN.GITI' }],
        ['T04', 'TB1', 'Liên hệ', 'Điện thoại', 'NUMBER', '0912345678', '', 'Chờ xác nhận', {}],
        ['T05', 'TB1', 'Liên hệ', 'Ghi chú', 'TEXT', '', '', '', { DORONG: 60 }],
        ['T10', 'TB2', 'Minh chứng', 'Bằng tốt nghiệp', 'FILE', '', '', '', {}]
    ];
    var kho = {};
    function ds(sv) {
        if (!kho[sv]) kho[sv] = TRUONG.map(function (t) {
            var r = { ID: t[0], TAB_THONGTIN_ID: t[1], THUOCNHOM: t[2], TEN: t[3], KIEUDULIEU: t[4], TRUONGTHONGTIN_GIATRI: t[5],
                THONGTINXACMINH: t[6], KETQUAXACNHAN_TEN: t[7], DUOCSUA: 1, DORONG: null, MABANGDANHMUC: '', NHOM: '' };
            Object.keys(t[8]).forEach(function (k) { r[k] = t[8][k]; });
            return r;
        });
        return kho[sv];
    }
    var seq = 10;
    ums.demo.add({
        'SV_KeHoach_NguoiHoc/LayDSKeHoachNhapHoSo': KH,
        'SV_KeHoach_PhamVi/LayDanhSach': function (o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            return SV.filter(function (r) {
                return r.KH === o.strQLSV_KeHoach_NguoiHoc_Id &&
                    (!q || (r.QLSV_NGUOIHOC_HODEM + ' ' + r.QLSV_NGUOIHOC_TEN + ' ' + r.QLSV_NGUOIHOC_MASO).toLowerCase().indexOf(q) >= 0);
            });
        },
        'SV_HoSo/LayChiTiet': function (o) {
            var r = SV.filter(function (x) { return x.QLSV_NGUOIHOC_ID === o.strId; })[0];
            return r ? [{ ID: r.QLSV_NGUOIHOC_ID, HODEM: r.QLSV_NGUOIHOC_HODEM, TEN: r.QLSV_NGUOIHOC_TEN, MASO: r.QLSV_NGUOIHOC_MASO, ANH: r.ANH }] : [];
        },
        'SV_KeHoach_NguoiHoc/LayDSTabThongTinNguoiHoc': [
            { ID: 'TB1', TAB_THONGTIN_TEN: 'Thông tin chung' }, { ID: 'TB2', TAB_THONGTIN_TEN: 'Minh chứng' }
        ],
        'SV_KeHoach_NguoiHoc/LayDSHoSoChoPhepSVNhap': function (o) { return ds(o.strQLSV_NguoiHoc_Id).slice(); },
        'SV_KeHoach_DuLieu/ThemMoi': function (o) {
            ds(o.strQLSV_NguoiHoc_Id).forEach(function (r) {
                if (r.ID === o.strTruongThongTin_Id) { r.TRUONGTHONGTIN_GIATRI = o.strTruongThongTin_GiaTri; r.THONGTINXACMINH = o.strThongTinXacMinh; }
            });
            return [];
        },
        'SV_KeHoach_HoSo/ThemMoi': function (o) {
            var id = 'NH' + (++seq);
            SV.push({ ID: 'PV' + seq, QLSV_NGUOIHOC_ID: id, QLSV_NGUOIHOC_HODEM: o.strHoDem, QLSV_NGUOIHOC_TEN: o.strTen, QLSV_NGUOIHOC_MASO: o.strMaSo, ANH: '', KH: o.strQLSV_KeHoach_NguoiHoc_Id });
            return { rows: [], raw: { Id: id } };
        },
        'SV_KeHoach_HoSo/CapNhat': function (o) {
            SV.forEach(function (r) { if (r.QLSV_NGUOIHOC_ID === o.strId) { r.QLSV_NGUOIHOC_HODEM = o.strHoDem; r.QLSV_NGUOIHOC_TEN = o.strTen; r.QLSV_NGUOIHOC_MASO = o.strMaSo; } });
            return [];
        },
        'SV_KeHoach_HoSo/Xoa': function (o) {
            for (var i = SV.length - 1; i >= 0; i--) if (SV[i].QLSV_NGUOIHOC_ID === o.strIds) SV.splice(i, 1);
            return [];
        },
        'SV_Files/LayDanhSach': function (o) { return o.strDuLieu_Id === 'NH01T01' ? [{ ID: 'QF1', FILEMINHCHUNG: 'ApisNCKH/SV_Files/giaykhaisinh.pdf', TENHIENTHI: 'Giấy khai sinh.pdf' }] : []; },
        'SV_Files/ThemMoi': { rows: [], message: 'OK' },
        'SV_Files/Xoa': { rows: [], message: 'OK' },
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#CHUN.GITI': [{ ID: 'NAM', MA: 'NAM', TEN: 'Nam' }, { ID: 'NU', MA: 'NU', TEN: 'Nữ' }]
    });
})();
