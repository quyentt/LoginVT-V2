/* =========================================================================
   Hệ số chức vụ
   Bản gốc: ApisNhanSu/Modules/heso/html/hesochucvu.html + script/hesochucvu.js
   ---------------------------------------------------------------------------
   Một cột như gốc: lọc Chức vụ · Ngày áp dụng · Từ khoá → Danh sách (Mã chức vụ ·
   Tên chức vụ · Hệ số · Ngày áp dụng) → biểu mẫu Chức vụ · Ngày áp dụng · Hệ số.
   Khung chung: ums.nsHeSo.man (../script/_heso.js).

   Lời gọi (chép nguyên):
       NS_HeSo_ChucVu/LayDanhSach GET — strTuKhoa, strNgayApDung, strChucVu_Id,
           strNguoiTao_Id '' (gốc đọc dropAAAA), pageIndex, pageSize
       NS_HeSo_ChucVu/ThemMoi | CapNhat POST — strId, strChucNang_Id, strChucVu_Id,
           strNgayApDung, dHeSo, strNguoiThucHien_Id
       NS_HeSo_ChucVu/Xoa POST — strIds (từng dòng), strChucNang_Id, strNguoiThucHien_Id
   Danh mục: NS.DMCV.
   ========================================================================= */
(function () {
    'use strict';
    var N = ums.nsHeSo, chucVu = N.dm('NS.DMCV');

    N.man('ns-hesochucvu', {
        ctl: 'NS_HeSo_ChucVu',
        title: 'Hệ số chức vụ',
        filters: [
            { key: 'cv', type: 'select', label: 'Chọn chức vụ', source: chucVu },
            { key: 'ngay', label: 'Ngày áp dụng', date: true },
            { key: 'q', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: function (f) {
            return { strTuKhoa: f.q, strNgayApDung: f.ngay, strChucVu_Id: f.cv, strNguoiTao_Id: '' };
        },
        columns: [
            { title: 'Mã chức vụ', prop: 'CHUCVU_MA', cls: 'is-nowrap' },
            { title: 'Tên chức vụ', prop: 'CHUCVU_TEN' },
            { title: 'Hệ số', prop: 'HESO', cls: 'is-center' },
            { title: 'Ngày áp dụng', prop: 'NGAYAPDUNG', cls: 'is-center is-nowrap' }
        ],
        fields: [
            { key: 'strChucVu_Id', col: 'CHUCVU_ID', label: 'Chức vụ', type: 'select', source: chucVu, placeholder: 'Chọn chức vụ' },
            { key: 'strNgayApDung', col: 'NGAYAPDUNG', label: 'Ngày áp dụng', type: 'date' },
            { key: 'dHeSo', col: 'HESO', label: 'Hệ số', type: 'number' }
        ],
        save: function (v) {
            return { strChucVu_Id: v.strChucVu_Id, strNgayApDung: v.strNgayApDung, dHeSo: v.dHeSo };
        }
    });
})();
