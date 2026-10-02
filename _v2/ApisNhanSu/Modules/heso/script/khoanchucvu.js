/* =========================================================================
   Phụ cấp chức vụ (khoản theo chức vụ)
   Bản gốc: ApisNhanSu/Modules/heso/html/khoanchucvu.html + script/khoanchucvu.js
   ---------------------------------------------------------------------------
   Một cột như gốc: lọc Chức vụ · Loại khoản · Ngày áp dụng · Từ khoá → Danh sách
   (Mã/Tên chức vụ · Mã/Tên khoản · Số tiền · Ngày áp dụng) → biểu mẫu Chức vụ ·
   Loại khoản · Đơn vị tính · Ngày áp dụng · Số tiền. Khung chung: ums.nsHeSo.man.

   Lời gọi (chép nguyên):
       NS_Tien_Khoan_ChucVu/LayDanhSach GET — strTuKhoa, strNgayApDung, strChucVu_Id,
           strLoaiKhoan_Id, strNguoiTao_Id '', pageIndex, pageSize
       NS_Tien_Khoan_ChucVu/ThemMoi | CapNhat POST — strId, strChucNang_Id,
           strDonViTinh_Id, strLoaiKhoan_Id, strChucVu_Id, strNgayApDung, dSoTien,
           strNguoiThucHien_Id
       NS_Tien_Khoan_ChucVu/Xoa POST — strIds (từng dòng), strChucNang_Id, strNguoiThucHien_Id
   Danh mục: NS.DMCV, NHANSU.LOAIKHOAN.
   Thêm mới điền sẵn Chức vụ / Loại khoản / Ngày áp dụng từ ô lọc (resetPopup gốc).

   Lỗi gốc đã sửa:
     · Danh sách gửi strTuKhoa đọc ô txtAAAA (không tồn tại) nên ô "Nhập từ khóa"
       KHÔNG BAO GIỜ có tác dụng → nay gửi giá trị ô từ khoá.
   Giữ như gốc (ghi sổ):
     · Ô "Đơn vị tính" gốc KHÔNG nạp danh mục nào (ô trống mãi) → giữ ô, khoá lại.
       Gốc gửi strDonViTinh_Id rỗng mỗi lần lưu, sửa một dòng có sẵn đơn vị tính là
       xoá mất nó; bản mới khi SỬA gửi lại DONVITINH_ID của dòng (không làm mất dữ liệu).
   ========================================================================= */
(function () {
    'use strict';
    var N = ums.nsHeSo, chucVu = N.dm('NS.DMCV'), loaiKhoan = N.dm('NHANSU.LOAIKHOAN');

    N.man('ns-khoanchucvu', {
        ctl: 'NS_Tien_Khoan_ChucVu',
        title: 'Phụ cấp chức vụ',
        filters: [
            { key: 'cv', type: 'select', label: 'Chọn chức vụ', source: chucVu },
            { key: 'lk', type: 'select', label: 'Chọn loại khoản', source: loaiKhoan },
            { key: 'ngay', label: 'Ngày áp dụng', date: true },
            { key: 'q', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: function (f) {
            return { strTuKhoa: f.q, strNgayApDung: f.ngay, strChucVu_Id: f.cv, strLoaiKhoan_Id: f.lk, strNguoiTao_Id: '' };
        },
        columns: [
            { title: 'Mã chức vụ', prop: 'CHUCVU_MA', cls: 'is-nowrap' },
            { title: 'Tên chức vụ', prop: 'CHUCVU_TEN' },
            { title: 'Mã khoản', prop: 'LOAIKHOAN_MA', cls: 'is-nowrap' },
            { title: 'Tên khoản', prop: 'LOAIKHOAN_TEN' },
            { title: 'Số tiền', cls: 'is-right is-nowrap', render: function (r) { return ums.ui.esc(ums.ui.money(r.SOTIEN)); } },
            { title: 'Ngày áp dụng', prop: 'NGAYAPDUNG', cls: 'is-center is-nowrap' }
        ],
        fields: [
            { key: 'strChucVu_Id', col: 'CHUCVU_ID', label: 'Chức vụ', type: 'select', source: chucVu, placeholder: 'Chọn chức vụ', tuLoc: 'cv' },
            { key: 'strLoaiKhoan_Id', col: 'LOAIKHOAN_ID', label: 'Loại khoản', type: 'select', source: loaiKhoan, placeholder: 'Chọn loại khoản', tuLoc: 'lk' },
            { key: '_donViTinh', label: 'Đơn vị tính', type: 'select', placeholder: 'Chưa có danh mục',
                hint: 'Bản gốc chưa nạp danh mục cho ô này' },
            { key: 'strNgayApDung', col: 'NGAYAPDUNG', label: 'Ngày áp dụng', type: 'date', tuLoc: 'ngay' },
            { key: 'dSoTien', col: 'SOTIEN', label: 'Số tiền', type: 'number' }
        ],
        onForm: function (row, c) { N.o(c, 'form', '_donViTinh').disabled = true; },
        save: function (v, row) {
            return {
                strDonViTinh_Id: row ? (row.DONVITINH_ID || '') : '',
                strLoaiKhoan_Id: v.strLoaiKhoan_Id, strChucVu_Id: v.strChucVu_Id,
                strNgayApDung: v.strNgayApDung, dSoTien: v.dSoTien
            };
        }
    });
})();
