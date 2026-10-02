/* =========================================================================
   Khai báo điều kiện xử lý học vụ
   Bản gốc: ApisXuLyHocVu/Modules/dieukienxuly/html/khaibaodieukien.html
            + script/khaibaodieukien.js
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không func — chép nguyên):
     XLHV_DieuKienXuLy/LayDanhSach   GET, phân trang máy chủ: strTuKhoa,
                                     strLoaiXuLy_Id (ô lọc), strMucXuLy_Id = '',
                                     strNguoiTao_Id = '' (gốc đọc #dropAAAA — không tồn tại)
     XLHV_DieuKienXuLy/ThemMoi       POST — strId rỗng
     XLHV_DieuKienXuLy/CapNhat       POST — strId = ID dòng đang sửa
         strXauDieuKien, strMucXuLy_Id, strLoaiXuLy_Id, strMoTa, iThuTu
     XLHV_DieuKienXuLy/Xoa           POST, strIds = MỘT id mỗi lời gọi (gốc lặp)
     XLHV_ThongTinChung/LayDSTuKhoa  GET — bảng "Danh sách từ khóa" (_dieukien.js)
   Danh mục: XLHV.LOAIXULY (ô lọc + biểu mẫu), XLHV.MUCXULY (biểu mẫu).

   Bố cục giữ như gốc: thanh lọc + bảng một cột; biểu mẫu thay chỗ danh sách,
   HAI cột (ô nhập | bảng từ khoá).

   Khác gốc / bỏ:
     · Ô bắt buộc: Loại xử lý, Mức xử lý, Xâu điều kiện — máy chủ đòi cả ba (kiểm host 30/9: thiếu một ô là
       "Du lieu khong hop le"; gốc kiểm #txtKhaiBaoDieuKien_So không tồn tại nên thực tế không kiểm gì).
       Mỗi cặp Loại × Mức chỉ có MỘT điều kiện — thêm cặp đã có thì máy chủ trả "Du lieu da ton tai" → nói rõ (saveFail).
     · Lưu xong quay về danh sách (ums.crud). Gốc ở lại biểu mẫu mà không nhận
       id mới → bấm Lưu lần hai là THÊM TRÙNG bản ghi.
     · Bỏ vòng lặp #tblInput_DTSV_SinhVien sau khi lưu (bảng không tồn tại,
       gọi me.save_SinhVien không có — mã chết chép từ màn khác).
     · Không có nút xoá trên từng dòng (gốc chỉ có ô đánh dấu + "Xóa").
   ========================================================================= */
(function () {
    'use strict';

    var root = document.getElementById('xlhv-khaibaodieukien');
    if (!root) return;
    var D = ums.xlhvDk;

    ums.crud({
        root: root,
        title: 'Khai báo điều kiện xử lý',
        formTitle: 'điều kiện xử lý',
        icon: 'fa-list-radio',
        listTitle: 'Danh sách',

        filters: [
            { key: 'loai', type: 'select', label: 'Chọn loại xử lý', source: D.LOAIXULY },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],

        list: {
            paged: true,
            call: function (f) {
                return {
                    action: 'XLHV_DieuKienXuLy/LayDanhSach',
                    method: 'GET',
                    strTuKhoa: f.q,
                    strLoaiXuLy_Id: f.loai,
                    strMucXuLy_Id: '',
                    strNguoiTao_Id: ''
                };
            }
        },

        columns: [
            { title: 'Mức xử lý', prop: 'MUCXULY_TEN', cls: 'is-nowrap' },
            { title: 'Mô tả', prop: 'MOTA' },
            { title: 'Xâu điều kiện', prop: 'XAUDIEUKIEN' }
        ],

        formCols: 1,
        fields: [
            { type: 'legend', label: 'Thông tin điều kiện' },
            { key: 'strLoaiXuLy_Id', col: 'LOAIXULY_ID', label: 'Loại xử lý', type: 'select', source: D.LOAIXULY, required: true },
            { key: 'strMucXuLy_Id', col: 'MUCXULY_ID', label: 'Mức xử lý', type: 'select', source: D.MUCXULY, required: true },
            { key: 'iThuTu', col: 'THUTU', label: 'Thứ tự', type: 'number' },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả' },
            { key: 'strXauDieuKien', col: 'XAUDIEUKIEN', label: 'Xâu điều kiện', type: 'textarea', required: true }
        ],

        onForm: function (row, crud, extra) { D.haiCot(crud, extra); },

        saveFail: function (err) { return D.cauLoi(err, 'Loại xử lý và mức xử lý này đã có điều kiện (mỗi mức chỉ khai một điều kiện) — hãy sửa dòng đang có.'); },

        save: function (v, row) {
            return {
                action: row ? 'XLHV_DieuKienXuLy/CapNhat' : 'XLHV_DieuKienXuLy/ThemMoi',
                strId: row ? row.ID : '',
                strXauDieuKien: v.strXauDieuKien,
                strMucXuLy_Id: v.strMucXuLy_Id,
                strLoaiXuLy_Id: v.strLoaiXuLy_Id,
                strMoTa: v.strMoTa,
                iThuTu: v.iThuTu
            };
        },

        rowDelete: false,
        formDelete: false,
        removeText: 'Xóa',
        remove: function (ids) {
            return ids.map(function (id) { return { action: 'XLHV_DieuKienXuLy/Xoa', strIds: id }; });
        },
        removeConfirm: function () { return 'Bạn có chắc chắn xóa dữ liệu không?'; }
    });
})();
