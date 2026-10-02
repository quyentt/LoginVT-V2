/* Dữ liệu mẫu cho màn "Hồ sơ sinh viên" (chỉ xem) — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';

    /* [ID, TAB, Nhóm, Tên, giá trị, biểu tượng] — màn chỉ xem nên chỉ cần
       TRUONGTHONGTIN_GIATRI (geninput của bản gốc đọc đúng cột này) */
    var TRUONG = [
        ['H01', 'TC1', 'Thông tin cá nhân', 'Họ và tên khai sinh', 'Lăng Văn Huy', 'fa fa-user'],
        ['H02', 'TC1', 'Thông tin cá nhân', 'Ngày sinh', '18/07/2004', 'fa fa-calendar'],
        ['H03', 'TC1', 'Thông tin cá nhân', 'Giới tính', 'Nam', ''],
        ['H04', 'TC1', 'Giấy tờ tuỳ thân', 'Số căn cước công dân', '001204012345', 'fa fa-id-card'],
        ['H05', 'TC1', 'Giấy tờ tuỳ thân', 'Ngày cấp', '12/05/2021', ''],
        ['H10', 'TC2', 'Thông tin học tập', 'Khoá học', 'Khoá 16 (2022 - 2026)', 'fa fa-graduation-cap'],
        ['H11', 'TC2', 'Thông tin học tập', 'Lớp quản lý', 'DCOT.16.2', ''],
        ['H12', 'TC2', 'Thông tin học tập', 'Hệ đào tạo', 'Đại học chính quy', ''],
        ['H20', 'TC3', 'Gia đình', 'Họ tên bố', 'Lăng Văn Hoà', 'fa fa-users'],
        ['H21', 'TC3', 'Gia đình', 'Họ tên mẹ', 'Nguyễn Thị Lan', '']
    ];
    var XN = { H01: 'Đã xác nhận', H04: 'Đã xác nhận', H11: 'Đã xác nhận' };

    ums.demo.add({
        'pkg_congthongtin_hssv_thongtin.LayThongTinChuongTrinhHoc': [
            { DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT01', DAOTAO_CHUONGTRINH_TEN: 'Công nghệ thông tin - Khoá 16' },
            { DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT02', DAOTAO_CHUONGTRINH_TEN: 'Công nghệ thông tin - Chương trình 2 (văn bằng 2)' }
        ],
        'pkg_hosohocvien_quyen.LayDSTabThongTinNguoiHoc': [
            { ID: 'TC1', TAB_THONGTIN_TEN: 'Thông tin chung', TAB_THONGTIN_TENANH: 'fa fa-user' },
            { ID: 'TC2', TAB_THONGTIN_TEN: 'Thông tin học tập', TAB_THONGTIN_TENANH: 'fa fa-graduation-cap' },
            { ID: 'TC3', TAB_THONGTIN_TEN: 'Quan hệ gia đình', TAB_THONGTIN_TENANH: 'fa fa-users' }
        ],
        'pkg_hosohocvien_quyen.LayDSHoSoChoPhepCBNhap': TRUONG.map(function (t) {
            return {
                ID: t[0], TAB_THONGTIN_ID: t[1], THUOCNHOM: t[2], TEN: t[3],
                KIEUDULIEU: 'TEXT', BATBUOC: 0, DUOCSUA: 0, TENANH: t[5],
                TRUONGTHONGTIN_GIATRI: t[4], THONGTINXACMINH: t[4],
                KETQUAXACNHAN_TEN: XN[t[0]] || ''
            };
        })
    });
})();
