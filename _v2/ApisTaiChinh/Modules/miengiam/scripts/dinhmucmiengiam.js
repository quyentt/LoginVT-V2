/* =========================================================================
   Định mức miễn giảm (chương trình × đối tượng × học kỳ × khoản thu × kiểu học)
   Bản gốc: ApisTaiChinh/Modules/miengiam/scripts/dinhmucmiengiam.js
   ---------------------------------------------------------------------------
   Khuôn dựng chung ở scripts/_doituong.js (dùng chung với hesodoituong).
   Lời gọi (action kiểu cũ, chép nguyên bản gốc):
       TC_MucMienGiam/LayDanhSach   GET  strPhamViApDung_Id = chương trình,
                                         strQLSV_DoiTuong_Id = đối tượng đang chọn
       TC_MucMienGiam/ThemMoi       dPhanTramMienGiam; khoản thu, kiểu học chọn
                                    nhiều nối dấu phẩy
       TC_MucMienGiam/CapNhat       sửa trong ô (dHeSo — đúng như bản gốc)
       TC_MucMienGiam/Xoa           strIds = id bản ghi
       TC_MucMienGiam/KeThua        mỗi chương trình được chọn một lời gọi
   Nguồn: danh mục QLTC.DTMG và KHDT.DIEM.KIEUHOC qua getList_DanhMucDulieu
   (dTrangThai rỗng), TC_KhoanThu/LayDanhSach, CM_ThoiGianDaoTao/
   LayDSDAOTAO_ThoiGianDaoTao, Hệ/Khoá/Chương trình qua ums.ref.

   Cố ý bỏ:
     · Hộp "Chọn chương trình đào tạo" + bảng học phần
       (#myModalChuongTrinh_DMMG): nút mở #btnCallModal_HocPhan_DMMG không có
       trong HTML, hàm getList_HocPhan_OnModal không tồn tại → chức năng chết.
     · Menu "Truy/xuất" (Import/Export dữ liệu): không có xử lý nào.
     · Ô từ khoá bên trái: không được đọc ở đâu.
   Lỗi bản gốc (đã sửa phần hiển thị, không đổi lời gọi):
     · Tiêu đề nhóm khoản thu lấy dtKhoanThu[lk] thay vì khoản thu có dữ liệu
       thứ lk → tên cột lệch với số liệu.
     · Kiểm tra hợp lệ khai THONGTIN1 "1" không khớp mã nào của hệ cũ
       (EM/FL/IN/DA) nên không kiểm gì — ở đây bắt buộc đủ 6 ô như ý bản gốc.
     · Nút xoá ở ô trống gửi Xoa với strIds "undefined" — ở đây chỉ hiện nút
       xoá khi ô có bản ghi.
   Nghi ngờ (giữ nguyên hành vi):
     · CapNhat trong ô không gửi đối tượng, gửi dHeSo (không phải
       dPhanTramMienGiam) — chép từ màn hệ số. strDaoTao_HocPhan_Id bản gốc
       gửi chuỗi "undefined", ở đây gửi rỗng. Cần kiểm trên máy chủ.
   ========================================================================= */
(function () {
    'use strict';
    ums.miengiam.doiTuongPivot({
        root: document.getElementById('dinhmucmiengiam'),
        title: 'Định mức miễn giảm',
        formTitle: 'mức miễn giảm',
        api: 'TC_MucMienGiam',
        dm: 'QLTC.DTMG',
        col: 'PHANTRAMMIENGIAM',
        valueLabel: '(%) Miễn giảm',
        listExtra: { dTuKhoa_number: -1 },
        addParams: function (v) { return { dPhanTramMienGiam: v }; },
        keThua: true
    });
})();
