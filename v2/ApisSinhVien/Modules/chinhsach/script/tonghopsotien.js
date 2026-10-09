/* =========================================================================
   Tổng hợp theo số tiền — lưới sinh viên × đối tượng (bản tổng hợp, phân trang máy chủ)
   Bản gốc: ApisSinhVien/Modules/chinhsach/html/tonghopsotien.html + script/tonghopsotien.js
   ---------------------------------------------------------------------------
   Khung chung: script/_chinhsach.js (ums.svcs.man, kieu 'st', th).
   Riêng màn này:
     · Danh sách SV_ChinhSach/LayDSSV_TongHop_SoTien GET — bắt chọn Học kỳ, Kiểu học, Khoản thu, Chế độ.
     · Ô lưới LayKQChinhSach_SoTien; Lưu TC_SoTienMien/ThemMoi | Xoa.
     · Kế thừa: SV_ChinhSach/KeThua_DoiTuong_SoTien_Thang | _Ky.
     · Báo cáo zonebtnBaoCao_THST (không có vùng _Import → chỉ Xuất báo cáo) + nút Import viết cứng
       IMPORTWITHPROC_XOATCSTM "Import xóa".
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('svcs-tonghopsotien');
    if (!root) return;
    ums.svcs.man(root, {
        tieuDe: 'Tổng hợp theo số tiền',
        kieu: 'st',
        th: true,
        nhieu: true,
        hang: [['he', 'khoa', 'ct', 'lop'], ['hk', 'kieu', 'khoan', 'chedo'], ['dt', 'q']],
        nut: ['kethua'],
        mau: { kethua: 'save', kt: ['out-danger', 'out-success'] },
        baoCaoImport: false,
        importTinh: [{ ma: 'IMPORTWITHPROC_XOATCSTM', ten: 'xóa', chu: 'Import xóa' }]
    });
})();
