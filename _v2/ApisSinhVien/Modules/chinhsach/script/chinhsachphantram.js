/* =========================================================================
   Chính sách theo phần trăm — lưới sinh viên × đối tượng (số tháng hưởng + phần trăm hưởng)
   Bản gốc: ApisSinhVien/Modules/chinhsach/html/chinhsachphantram.html + script/chinhsachphantram.js
   ---------------------------------------------------------------------------
   Khung chung: script/_chinhsach.js (ums.svcs.man, kieu 'pt') — lời gọi, cách lưu ghi ở đầu tệp đó.
   Riêng màn này:
     · Danh sách SV_ChinhSach/LayDSSV_ChinhSach_PhanTram (lọc theo Lớp + trạng thái + từ khoá; các ô
       Hệ / Khoá / CT chỉ để thu hẹp danh sách Lớp và "Nhập theo lớp" — như gốc).
     · Nút "Xóa" (btnDeleteKetQuaChinhSach) + cột ô đánh dấu → Xoa_TaiChinh_DT_MienGiam, strId = ID DÒNG.
     · Nút "Xem" từng dòng → LayDSChinhSachMienSV (strQLSV_NguoiHoc_Id = QLSV_NGUOIHOC_ID của dòng).
     · "Nhập theo lớp" → TC_DoiTuong_Lop_MienGiam/ThemMoi (dPhanTramMienGiam, dSoThang, kiểu học, khoản thu).
     · Báo cáo: vùng zonebtnBaoCao_CSQS có zonebtnBaoCao_CSQS_Import → hiện cả nút Import theo quyền.
   Bỏ: nút "Nhập theo lớp" thứ hai (html gốc có HAI thẻ cùng id btnSearch_Lop — một đỏ, một trắng).
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('svcs-chinhsachphantram');
    if (!root) return;
    ums.svcs.man(root, {
        tieuDe: 'Chính sách theo phần trăm',
        kieu: 'pt',
        hang: [['he', 'khoa', 'ct', 'lop'], ['hk', 'kieu', 'khoan', 'chedo'], ['dt', 'q']],
        nut: ['lop'],
        mau: { lop: 'danger' },
        xoa: true,
        xem: true,
        baoCaoImport: true
    });
})();
