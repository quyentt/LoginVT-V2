/* =========================================================================
   Chính sách theo đối tượng — lưới sinh viên × đối tượng (ô đánh dấu + số tháng + "Gói hỗ trợ")
   Bản gốc: ApisSinhVien/Modules/chinhsach/html/chinhsachdoituong.html + script/chinhsachdoituong.js
   ---------------------------------------------------------------------------
   Khung chung: script/_chinhsach.js (ums.svcs.man, kieu 'dt').
   Riêng màn này:
     · Hệ / Khoá / CT / Lớp / Học kỳ CHỌN NHIỀU (html gốc multiple — gửi chuỗi "a,b" như getValById).
     · Danh sách SV_ChinhSach/LayDSSV_ChinhSach_PhanTram (như hai màn chính sách kia).
     · Ô lưới LayKQChinhSach_DoiTuong; Lưu TC_DoiTuong_NguoiHoc/ThemMoi | Xoa. Đổi số tháng của dòng đã
       có → ghi lại; gõ số tháng tự đánh dấu ô (như gốc).
     · "Gói hỗ trợ" (ô đã có bản ghi) → SV_KetQua_ChinhSach/LayDanhSach + CapNhat.
     · "Nhập theo lớp" → TC_DoiTuong_Lop_NguoiHoc/ThemMoi (dSoThang).
     · Import viết cứng trong html gốc: IMPORTWITHPROC_CSDT "Đối tượng chính sách".
   Lỗi gốc đã sửa:
     · Nút "Lưu" của "Nhập cho nhiều lớp" gắn HAI xử lý: lưu theo lớp VÀ gọi SV_KetQua_ChinhSach/CapNhat cho
       MỌI dòng của bảng sinh viên (strId = ID người học, ô số tiền không tồn tại → ghi rác). Bỏ xử lý thứ hai.
   Giữ như gốc:
     · Nút "Kế thừa" + hộp kế thừa có trong html nhưng .js KHÔNG gắn xử lý → nút khoá.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('svcs-chinhsachdoituong');
    if (!root) return;
    ums.svcs.man(root, {
        tieuDe: 'Chính sách theo đối tượng',
        kieu: 'dt',
        nhieu: true,
        hang: [['he', 'khoa', 'ct', 'lop'], ['hk', 'chedo', 'dt'], ['q']],
        nut: ['kethuaKhoa', 'lop'],
        mau: { kethua: 'save', lop: 'out-primary' },
        baoCaoImport: false,
        importTinh: [{ ma: 'IMPORTWITHPROC_CSDT', ten: 'Đối tượng chính sách', chu: 'Đối tượng chính sách' }]
    });
})();
