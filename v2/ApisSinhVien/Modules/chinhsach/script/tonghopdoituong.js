/* =========================================================================
   Tổng hợp theo đối tượng — lưới sinh viên × đối tượng (bản tổng hợp, phân trang máy chủ)
   Bản gốc: ApisSinhVien/Modules/chinhsach/html/tonghopdoituong.html + script/tonghopdoituong.js
   ---------------------------------------------------------------------------
   Khung chung: script/_chinhsach.js (ums.svcs.man, kieu 'dt', th).
   Riêng màn này:
     · Danh sách SV_ChinhSach/LayDSSV_TongHop_DoiTuong GET — bắt chọn Học kỳ + Chế độ trước khi tìm.
     · Ô lưới LayKQChinhSach_DoiTuong (strQLSV_NguoiHoc_Id = QLSV_NGUOIHOC_ID,
       strDaoTao_ChuongTrinh_Id = DAOTAO_TOCHUCCHUONGTRINH_ID).
     · Lưu TC_DoiTuong_NguoiHoc/ThemMoi | Xoa — chỉ thêm ô MỚI đánh dấu / xoá ô bỏ đánh dấu; bản tổng hợp gốc
       KHÔNG gửi số tháng (ô số tháng chỉ hiện) và không ghi lại khi đổi số tháng.
     · Kế thừa: SV_ChinhSach/KeThua_DoiTuong_Goi_Thang (dNamHoc, dThang) | _Ky (dNamHoc, dHocKy, dDotHoc).
   Lỗi gốc đã sửa:
     · "Gói hỗ trợ" chưa từng mở được: gốc tra người học bằng QLSV_NGUOIHOC_ID trong cột ID → không thấy,
       lỗi JS khi ghi tiêu đề hộp, danh sách không nạp. Nay tra đúng dòng.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('svcs-tonghopdoituong');
    if (!root) return;
    ums.svcs.man(root, {
        tieuDe: 'Tổng hợp theo đối tượng',
        kieu: 'dt',
        th: true,
        nhieu: true,
        hang: [['he', 'khoa', 'ct', 'lop'], ['hk', 'chedo', 'dt'], ['q']],
        nut: ['kethua'],
        mau: { kethua: 'save', kt: ['out-danger', 'out-success'] },
        baoCaoImport: false
    });
})();
