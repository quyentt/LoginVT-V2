/* Dữ liệu mẫu dùng chung của module Miễn giảm (và Khai báo đơn vị phí) —
   chỉ dùng ở chế độ dựng thử. Tên cột lấy từ các tệp .js gốc. */
(function () {
    'use strict';

    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten }; }

    var HE = [
        { ID: 'HE01', MAHEDAOTAO: 'DHCQ', TENHEDAOTAO: 'Đại học chính quy' },
        { ID: 'HE02', MAHEDAOTAO: 'VLVH', TENHEDAOTAO: 'Vừa làm vừa học' }
    ];
    var KHOA = [
        { ID: 'KH22', MAKHOA: 'K22', TENKHOA: 'Khoá 2022', DAOTAO_HEDAOTAO_ID: 'HE01' },
        { ID: 'KH23', MAKHOA: 'K23', TENKHOA: 'Khoá 2023', DAOTAO_HEDAOTAO_ID: 'HE01' },
        { ID: 'KH24', MAKHOA: 'K24', TENKHOA: 'Khoá 2024', DAOTAO_HEDAOTAO_ID: 'HE01' },
        { ID: 'KV23', MAKHOA: 'V23', TENKHOA: 'Khoá VLVH 2023', DAOTAO_HEDAOTAO_ID: 'HE02' }
    ];
    var CT = [
        { ID: 'CT01', MACHUONGTRINH: '7340101', TENCHUONGTRINH: 'Quản trị kinh doanh', DAOTAO_KHOADAOTAO_ID: 'KH23' },
        { ID: 'CT02', MACHUONGTRINH: '7480201', TENCHUONGTRINH: 'Công nghệ thông tin', DAOTAO_KHOADAOTAO_ID: 'KH23' },
        { ID: 'CT03', MACHUONGTRINH: '7340301', TENCHUONGTRINH: 'Kế toán', DAOTAO_KHOADAOTAO_ID: 'KH23' },
        { ID: 'CT04', MACHUONGTRINH: '7220201', TENCHUONGTRINH: 'Ngôn ngữ Anh', DAOTAO_KHOADAOTAO_ID: 'KH24' }
    ];
    var LOP = [
        { ID: 'LOP1', MA: 'QTKD23A', TEN: 'QTKD23A', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT01' },
        { ID: 'LOP2', MA: 'QTKD23B', TEN: 'QTKD23B', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT01' },
        { ID: 'LOP3', MA: 'CNTT23A', TEN: 'CNTT23A', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT02' }
    ];
    var TG = [
        { ID: 'TG231', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm 2023-2024' },
        { ID: 'TG232', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 năm 2023-2024' },
        { ID: 'TG241', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm 2024-2025' },
        { ID: 'TG242', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 năm 2024-2025' }
    ];
    var KIEUHOC = [dm('KHOC1', 'HM', 'Học mới'), dm('KHOC2', 'HL', 'Học lại'), dm('KHOC3', 'HCT', 'Học cải thiện')];
    var DTMG = [
        dm('DT01', 'CON_TB', 'Con thương binh'), dm('DT02', 'HO_NGHEO', 'Hộ nghèo'),
        dm('DT03', 'DTTS', 'Dân tộc thiểu số vùng khó khăn'), dm('DT04', 'MO_COI', 'Mồ côi cả cha lẫn mẹ'),
        dm('DT05', 'KHUYET_TAT', 'Người khuyết tật')
    ];
    var SV = [
        ['SV01', 'Nguyễn Văn', 'An', 'BBA230101', '12', '03', '2005', 'QTKD23A'],
        ['SV02', 'Trần Thị', 'Bình', 'BBA230102', '05', '11', '2005', 'QTKD23A'],
        ['SV03', 'Lê Hoàng', 'Cường', 'BBA230103', '21', '07', '2005', 'QTKD23A'],
        ['SV04', 'Phạm Thu', 'Dung', 'BBA230104', '30', '01', '2005', 'QTKD23A'],
        ['SV05', 'Hoàng Minh', 'Đức', 'BBA230105', '09', '09', '2004', 'QTKD23A'],
        ['SV06', 'Vũ Thị', 'Hà', 'BBA230106', '17', '04', '2005', 'QTKD23A']
    ].map(function (x) {
        // DAOTAO_LOPQUANLY_N1_TEN: cột hộp chọn sinh viên dùng chung (ums.pat.pickSinhVien) đọc
        return { ID: x[0], HODEM: x[1], TEN: x[2], MASONGUOIHOC: x[3], NGAYSINH_NGAY: x[4], NGAYSINH_THANG: x[5], NGAYSINH_NAM: x[6], DAOTAO_LOPQUANLY_TEN: x[7], DAOTAO_LOPQUANLY_N1_TEN: x[7] };
    });

    function by(list, col, v) { return v ? list.filter(function (r) { return r[col] === v; }) : list; }

    ums.demo.add({
        'pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTao': HE,
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_KhoaDaoTao': function (o) { return by(KHOA, 'DAOTAO_HEDAOTAO_ID', o.strDAOTAO_HeDaoTao_Id); },
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_ToChucCT': function (o) { return by(CT, 'DAOTAO_KHOADAOTAO_ID', o.strDaoTao_KhoaDaoTao_Id); },
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy': function (o) { return by(LOP, 'DAOTAO_TOCHUCCHUONGTRINH_ID', o.strDaoTao_ToChucCT_Id); },
        'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao': TG,
        'CM_ThoiGianDaoTao/LayDSDAOTAO_ThoiGianDaoTao': TG,
        'CM_DanhMucDuLieu/LayDanhSach#KHDT.DIEM.KIEUHOC': KIEUHOC,
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KHDT.DIEM.KIEUHOC': KIEUHOC,
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLTC.DTMG': DTMG,
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLSV.DOITUONG': [
            dm('QD01', 'LS', 'Con liệt sĩ'), dm('QD02', 'TB', 'Con thương binh'), dm('QD03', 'HN', 'Hộ nghèo'), dm('QD04', 'CN', 'Hộ cận nghèo')
        ],
        'pkg_hosohocvien.LayDanhSachHoSo': function (o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            var list = SV.filter(function (s) { return !q || (s.HODEM + ' ' + s.TEN + ' ' + s.MASONGUOIHOC).toLowerCase().indexOf(q) >= 0; });
            var i = (Number(o.pageIndex) || 1) - 1, n = Number(o.pageSize) || 10;
            return { rows: list.slice(i * n, i * n + n), pager: list.length };
        },
        'SV_ChuongTrinhCuaHocVien/LayDanhSach': function () {
            return [{ DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT01', DAOTAO_CHUONGTRINH_MA: '7340101', DAOTAO_CHUONGTRINH_TEN: 'Quản trị kinh doanh' }];
        }
    });

    ums.demo.mg = { HE: HE, KHOA: KHOA, CT: CT, LOP: LOP, TG: TG, KIEUHOC: KIEUHOC, DTMG: DTMG, SV: SV };
})();
