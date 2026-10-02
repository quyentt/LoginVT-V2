/* Dữ liệu mẫu dùng chung cho ba màn Hồ sơ cá nhân (Cổng sinh viên)
   — chỉ dùng ở chế độ dựng thử. Người học mẫu: SV0001. */
(function () {
    'use strict';
    ums.demo.add({
        /* getDetail_SinhVien + viewForm_SinhVien — cùng func cho cả ba màn
           (hoso/tunhaphoso gọi qua SV_Custom, minhchung qua SV_HoSoHocVien_MH) */
        'pkg_hosohocvien.LayThongTinChiTietHoSo': [{
            ID: 'SV0001',
            HODEM: 'Lăng Văn', TEN: 'Huy',
            QLSV_NGUOIHOC_NGAYSINH: '18/07/2004',
            CMTND_SO: '001204012345',
            MASO: '25001029',
            NGANH: 'Công nghệ thông tin',
            MANGANH: '7480201',
            LOP: 'DCOT.16.2',
            ANHCANHANTUUP: 'ApisCongSinhVien/avatar/SV0001_anh.jpg'
        }],
        /* save_Anh — Sua_QLSV_NguoiHoc_1 */
        'pkg_hosohocvien.Sua_QLSV_NguoiHoc_1': { rows: [], message: 'SV0001' }
    });
})();
