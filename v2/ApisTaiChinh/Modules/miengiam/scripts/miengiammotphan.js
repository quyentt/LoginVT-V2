/* =========================================================================
   Miễn giảm một phần (bán toàn phần) cho danh sách sinh viên
   Bản gốc: ApisTaiChinh/Modules/miengiam/scripts/miengiammotphan.js
   ---------------------------------------------------------------------------
   Khuôn dựng chung ở scripts/_mien.js (dùng chung với miengiamtoanphan).
   Lời gọi (action kiểu cũ, chép nguyên bản gốc):
       TC_MienMotPhan/LayDanhSach   GET, phân trang máy chủ
       TC_MienMotPhan/ThemMoi       strQLSV_NguoiHoc_Id = id sinh viên nối dấu phẩy,
                                    strNgayApDung / strNgayHetHan = ID THỜI GIAN đào tạo
                                    (ô chọn học kỳ — đúng như bản gốc),
                                    dPhanTramMienGiam bỏ ký tự %
       TC_MienMotPhan/Xoa           một lời gọi, strIds "id1,id2,"
   Nguồn: Hệ/Khoá/Chương trình/Lớp qua ums.ref, kiểu học qua danh mục
   KHDT.DIEM.KIEUHOC (loadToCombo_DanhMucDuLieu), thời gian qua
   CM_ThoiGianDaoTao/LayDSDAOTAO_ThoiGianDaoTao, sinh viên qua
   pkg_hosohocvien.LayDanhSachHoSo (edu.system.getList_SinhVien).

   Cố ý bỏ:
     · Ô lọc Quốc tịch: không nạp dữ liệu, không gửi lên.
     · Ô từ khoá: bản gốc gửi strTuKhoa đọc từ id "txtKeyword_Search_MGMP"
       không tồn tại (ô thật là txtKeyword_MGMP) → luôn gửi rỗng; ô vô tác
       dụng nên bỏ, tham số vẫn gửi rỗng như bản gốc.
     · Sửa: nút sửa (class btnEditRole_MGMP) không được vẽ trong bảng, hàm
       viewForm gọi me.popup() không tồn tại → chức năng chết. LayChiTiet
       vì thế cũng không dùng.
     · Menu "Truy/xuất": không có xử lý.
   Lỗi bản gốc: kiểm tra hợp lệ khai THONGTIN1 "1" nên không kiểm gì — ở
   đây bắt buộc chương trình và kiểu học như ý bản gốc; gõ phím trong ô tìm
   sinh viên gọi API mỗi phím (bỏ, tìm khi Enter / bấm nút).
   ========================================================================= */
(function () {
    'use strict';
    ums.miengiam.mienSinhVien({
        root: document.getElementById('miengiammotphan'),
        title: 'Miễn giảm một phần',
        formTitle: 'sinh viên miễn giảm bán toàn phần',
        api: 'TC_MienMotPhan',
        keyword: false,
        searchAll: false,
        syncCT: false,
        fields: [
            { key: 'strDiem_KieuHoc_Id', label: 'Kiểu học', type: 'select', source: { dm: 'KHDT.DIEM.KIEUHOC' }, required: true },
            { key: 'dPhanTramMienGiam', label: '% Miễn giảm', value: '50' }
        ],
        saveExtra: function (v) { return { strDiem_KieuHoc_Id: v.strDiem_KieuHoc_Id }; }
    });
})();
