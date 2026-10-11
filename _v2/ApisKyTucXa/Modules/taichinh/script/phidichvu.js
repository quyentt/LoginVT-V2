/* =========================================================================
   Phí dịch vụ điện - nước (Ký túc xá → Mức phí)
   Bản gốc: ApisKyTucXa/Modules/taichinh/html/phidichvu.html + script/phidichvu.js (551 dòng)
   ---------------------------------------------------------------------------
   Một cột như gốc: bảng phí dịch vụ + nút Thêm mới / Tải lại; biểu mẫu thay chỗ (gốc: khung #zone_input_PhiDichVu
   bật bằng toggle_overide, đã là biểu mẫu trong trang).
   Lời gọi (kiểu cũ, không mã hoá — chép nguyên):
       KTX_MucPhiDichVu/LayDanhSach   GET   strTuKhoa, strDonViTinh_Id '', strKTX_LuyKe_Id '', strNguoiThucHien_Id '', pageIndex, pageSize
       KTX_MucPhiDichVu/LayChiTiet    GET   strId
       KTX_MucPhiDichVu/ThemMoi | CapNhat (khi có strId)   POST
           strId, strTaiChinh_CacKhoanThu_Id, strNgayApDung, strDonViTinh_Id, dDonGia, strKTX_LuyKe_Id
       KTX_MucPhiDichVu/Xoa           POST  strIds = một id (mỗi dòng một lời gọi)
       Ô chọn: TC_KhoanThu/LayDanhSach · KTX_LuyKe/LayDanhSach · danh mục KTX.DVT0 (ums.ktxTC.src)
   Bắt buộc như gốc (arrValid): Khoản thu, Ngày áp dụng, Đơn giá (số), Đơn vị tính.
   "Lưu và Nhập tiếp" của gốc → saveAgain.
   Khác gốc (lỗi rõ ràng):
     · Gốc đọc ô Mức lũy kế #dropPhiDichVu_LuyKe (gửi strKTX_LuyKe_Id, nạp bằng getList_MucLuyKe) nhưng HTML KHÔNG có ô đó
       → luôn gửi rỗng. Ở đây dựng ô chọn "Mức lũy kế" trong nhóm "Lũy kế" (đúng ý định), khi sửa đổ KTX_LUYKE_ID.
     · Hai ô "Chỉ số bắt đầu / Chỉ số kết thúc" của gốc không được đọc ở đâu → bỏ.
     · Gốc không có ô lọc; thêm ô "Nhập từ khóa tìm kiếm" → strTuKhoa (API có sẵn tham số), gõ tự tìm.
   Cố ý bỏ (mã chết): btnAddnew_PhiDichVu / btnRefresh_PhiDichVu / myModal_QTSK / txtTSBT_TuNgay không có trong HTML.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, T = ums.ktxTC, P = 'KTX_MucPhiDichVu/';
    var root = document.getElementById('ktx-phidichvu');
    if (!root) return;

    ums.crud({
        root: root,
        title: 'Phí dịch vụ điện - nước', listTitle: 'Phí dịch vụ', formTitle: 'phí dịch vụ', icon: 'fa-bolt',
        saveAgain: true,
        filters: [
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: { paged: true, call: function (f) {
            return { action: P + 'LayDanhSach', method: 'GET', strTuKhoa: f.q || '', strDonViTinh_Id: '', strKTX_LuyKe_Id: '', strNguoiThucHien_Id: '' };
        } },
        columns: [
            { title: 'Khoản thu', prop: 'TAICHINH_CACKHOANTHU_TEN' },
            { title: 'Đơn giá', cls: 'is-right is-nowrap', render: function (r) { return ui.money(r.DONGIA); } },
            { title: 'Đơn vị tính', prop: 'DONVITINH_TEN' },
            { title: 'Ngày áp dụng', prop: 'NGAYAPDUNG', cls: 'is-center is-nowrap' }
        ],
        detail: function (row) { return { action: P + 'LayChiTiet', method: 'GET', strId: row.ID }; },
        fields: [
            { key: 'strTaiChinh_CacKhoanThu_Id', col: 'TAICHINH_CACKHOANTHU_ID', label: 'Khoản thu', type: 'select', required: true, placeholder: 'Chọn khoản thu', source: T.src.khoanThu() },
            { key: 'strNgayApDung', col: 'NGAYAPDUNG', label: 'Ngày áp dụng', type: 'date', required: true },
            { key: 'dDonGia', col: 'DONGIA', label: 'Đơn giá', type: 'number', required: true },
            { key: 'strDonViTinh_Id', col: 'DONVITINH_ID', label: 'Đơn vị tính', type: 'select', required: true, source: T.src.dvt() },
            { type: 'legend', label: 'Lũy kế' },
            { key: 'strKTX_LuyKe_Id', col: 'KTX_LUYKE_ID', label: 'Mức lũy kế', type: 'select', placeholder: 'Chọn mức lũy kế', source: T.src.luyKe() }
        ],
        save: function (v, row) {
            return { action: P + (row ? 'CapNhat' : 'ThemMoi'), method: 'POST', strId: row ? row.ID : '',
                strTaiChinh_CacKhoanThu_Id: v.strTaiChinh_CacKhoanThu_Id, strNgayApDung: v.strNgayApDung, strDonViTinh_Id: v.strDonViTinh_Id,
                dDonGia: v.dDonGia, strKTX_LuyKe_Id: v.strKTX_LuyKe_Id };
        },
        remove: function (ids) { return ids.map(function (id) { return { action: P + 'Xoa', method: 'POST', strIds: id }; }); }
    });
})();
