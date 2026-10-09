/* =========================================================================
   Miễn giảm toàn phần cho danh sách sinh viên
   Bản gốc: ApisTaiChinh/Modules/miengiam/scripts/miengiamtoanphan.js
   ---------------------------------------------------------------------------
   Khuôn dựng chung ở scripts/_mien.js (dùng chung với miengiammotphan).
   Lời gọi (action kiểu cũ, chép nguyên bản gốc):
       TC_MienToanBo/LayDanhSach    GET, phân trang máy chủ, strTuKhoa = ô từ khoá
       TC_MienToanBo/ThemMoi        strQLSV_NguoiHoc_Id nối dấu phẩy, strGhiChu = lý do,
                                    dPhanTramMienGiam = 100 (ô chỉ đọc),
                                    strNgayApDung / strNgayHetHan = ID thời gian đào tạo
       TC_MienToanBo/Xoa            một lời gọi, strIds "id1,id2,"
   Nguồn: như miengiammotphan.js (không có kiểu học).

   Cố ý bỏ:
     · Ô lọc Quốc tịch: không nạp dữ liệu, không gửi lên.
     · Sửa: nút sửa không được vẽ; handler gán vào me.input_MGTP (không tồn
       tại) → lỗi JS; điều kiện chuyển sang TC_MienToanBo/CapNhat viết
       `strId != "" && strId == undefined` không bao giờ đúng → chức năng chết.
     · Menu "Truy/xuất": không có xử lý.
   Giữ như bản gốc: bấm Tìm trong hộp chọn sinh viên gửi khoá/lớp RỖNG (khác
   bản một phần) — lần mở hộp đầu tiên vẫn lọc theo khoá/lớp đang chọn.
   Lỗi bản gốc: kiểm tra hợp lệ không chạy (THONGTIN1 "1") — ở đây bắt buộc
   chương trình và lý do như ý bản gốc.
   ========================================================================= */
(function () {
    'use strict';
    ums.miengiam.mienSinhVien({
        root: document.getElementById('miengiamtoanphan'),
        title: 'Miễn giảm toàn phần',
        formTitle: 'sinh viên miễn giảm toàn phần',
        api: 'TC_MienToanBo',
        keyword: true,
        searchAll: true,
        syncCT: true,
        columns: [{ title: 'Lý do', prop: 'GHICHU', width: '220px' }],
        fields: [
            { key: 'strGhiChu', label: 'Lý do miễn giảm', required: true },
            { key: 'dPhanTramMienGiam', label: '% Miễn giảm', value: '100', required: true }
        ],
        onForm: function (formEl) { formEl('dPhanTramMienGiam').readOnly = true; },
        saveExtra: function (v) { return { strGhiChu: v.strGhiChu }; }
    });
})();
