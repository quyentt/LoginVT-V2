/* =========================================================================
   Tổng hợp theo phần trăm — lưới sinh viên × đối tượng (bản tổng hợp, phân trang máy chủ)
   Bản gốc: ApisSinhVien/Modules/chinhsach/html/tonghopphantram.html + script/tonghopphantram.js
   ---------------------------------------------------------------------------
   Khung chung: script/_chinhsach.js (ums.svcs.man, kieu 'pt', th).
   Riêng màn này:
     · Danh sách SV_ChinhSach/LayDSSV_TongHop_PhanTram GET — bắt chọn Học kỳ, Kiểu học, Khoản thu, Chế độ.
     · Ô lưới / Lưu như "Chính sách theo phần trăm" nhưng đọc cột DAOTAO_* / QLSV_NGUOIHOC_* của bản tổng hợp.
     · Xóa dòng đã đánh dấu (Xoa_TaiChinh_DT_MienGiam), "Xem" (LayDSChinhSachMienSV).
     · Kế thừa: SV_ChinhSach/KeThua_DoiTuong_PhanTram_Thang | _Ky.
     · "Thống kê khai > 1 đối tượng": LayDSTongHopNhieuDoiTuong (tên cột chưa chốt — gốc dò nhiều tên, giữ).
     · Import: vùng báo cáo theo quyền (zonebtnBaoCao_THPT_Import) + nút viết cứng IMPORTWITHPROC_DCDTMG,
       IMPORTWITHPROC_XOATCMG "Import xóa" (zonebtnBaoCao_THPT1_Import).
   Bỏ: console.log payload / console.table của thống kê.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('svcs-tonghopphantram');
    if (!root) return;
    ums.svcs.man(root, {
        tieuDe: 'Tổng hợp theo phần trăm',
        kieu: 'pt',
        th: true,
        nhieu: true,
        hang: [['he', 'khoa', 'ct', 'lop'], ['hk', 'kieu', 'khoan', 'chedo'], ['dt', 'q']],
        nut: ['kethua', 'thongke'],
        mau: { kethua: 'primary', kt: ['primary', 'save'] },
        xoa: true,
        xem: true,
        baoCaoImport: true,
        importTinh: [
            { ma: 'IMPORTWITHPROC_DCDTMG', ten: 'IMPORTWITHPROC_DCDTMG', chu: 'IMPORTWITHPROC_DCDTMG' },
            { ma: 'IMPORTWITHPROC_XOATCMG', ten: 'xóa', chu: 'Import xóa' }
        ]
    });
})();
