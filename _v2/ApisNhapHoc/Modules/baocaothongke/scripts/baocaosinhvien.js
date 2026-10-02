/* =========================================================================
   Báo cáo sinh viên (Nhập học)
   Bản gốc: ApisNhapHoc/Modules/baocaothongke/html/baocaosinhvien.html + scripts/baocaosinhvien.js
   ---------------------------------------------------------------------------
   Khung chung ums.nhBc (baocaothongke/scripts/_chung.js) + bộ lọc ums.nhTk (thongke/scripts/_chung.js).
   Ba mẫu viết sẵn trong html gốc (không nạp danh sách mẫu từ máy chủ):
     Mẫu 1 → TKNH_DHTL_2018_THEOLOP · Mẫu 2 → TKNH_DHTL_2018_THEONGANH · Mẫu 3 → TKNH_DHTL_2018_DSCHITIETTHEOLOP
   Tải xuống: edu.system.report(<mã>, "", addKeyValue) — như Báo cáo tài chính nhưng KHÔNG gửi strLoaiKhoan_Id
     (gốc có ô Khoản thu trên màn mà không gửi — giữ như gốc).
   ========================================================================= */
(function () {
    'use strict';
    var r = document.getElementById('nh-baocaosinhvien');
    if (!r) return;
    ums.nhBc.man(r, {
        tieuDe: 'Báo cáo sinh viên', loai: 'SINH VIÊN', khoanThu: false,
        mau: [
            { ma: 'TKNH_DHTL_2018_THEOLOP', ten: 'Xuất BC theo lớp' },
            { ma: 'TKNH_DHTL_2018_THEONGANH', ten: 'Xuất BC theo ngành' },
            { ma: 'TKNH_DHTL_2018_DSCHITIETTHEOLOP', ten: 'Xuất BC chi tiết theo lớp' }
        ]
    });
})();
