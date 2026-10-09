/* =========================================================================
   Hệ số ngạch
   Bản gốc: ApisNhanSu/Modules/heso/html/hesongach.html + script/hesongach.js
   ---------------------------------------------------------------------------
   Một cột như gốc: lọc Ngạch · Ngày áp dụng · Từ khoá → Danh sách (Mã ngạch ·
   Tên ngạch · Hệ số · Ngày áp dụng) → biểu mẫu Ngạch · Ngày áp dụng · Hệ số.
   Khung chung: ums.nsHeSo.man (../script/_heso.js).

   Lời gọi (chép nguyên):
       NS_HeSo_Ngach/LayDanhSach GET — strTuKhoa, strNgayApDung, strNgach_Id,
           strNguoiTao_Id '' (gốc đọc dropAAAA), pageIndex, pageSize
       NS_HeSo_Ngach/ThemMoi | CapNhat POST — strId, strChucNang_Id, strNgach_Id,
           strNgayApDung, dHeSo, strNguoiThucHien_Id
       NS_HeSo_Ngach/Xoa POST — strIds (từng dòng), strChucNang_Id, strNguoiThucHien_Id
   Danh mục: LUONG.NGACH (ô lọc + biểu mẫu).
   ========================================================================= */
(function () {
    'use strict';
    var N = ums.nsHeSo, ngach = N.dm('LUONG.NGACH');

    N.man('ns-hesongach', {
        ctl: 'NS_HeSo_Ngach',
        title: 'Hệ số ngạch',
        filters: [
            { key: 'ngach', type: 'select', label: 'Chọn ngạch', source: ngach },
            { key: 'ngay', label: 'Ngày áp dụng', date: true },
            { key: 'q', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: function (f) {
            return { strTuKhoa: f.q, strNgayApDung: f.ngay, strNgach_Id: f.ngach, strNguoiTao_Id: '' };
        },
        columns: [
            { title: 'Mã ngạch', prop: 'NGACH_MA', cls: 'is-nowrap' },
            { title: 'Tên ngạch', prop: 'NGACH_TEN' },
            { title: 'Hệ số', prop: 'HESO', cls: 'is-center' },
            { title: 'Ngày áp dụng', prop: 'NGAYAPDUNG', cls: 'is-center is-nowrap' }
        ],
        fields: [
            { key: 'strNgach_Id', col: 'NGACH_ID', label: 'Ngạch', type: 'select', source: ngach, placeholder: 'Chọn ngạch' },
            { key: 'strNgayApDung', col: 'NGAYAPDUNG', label: 'Ngày áp dụng', type: 'date' },
            { key: 'dHeSo', col: 'HESO', label: 'Hệ số', type: 'number' }
        ],
        save: function (v) {
            return { strNgach_Id: v.strNgach_Id, strNgayApDung: v.strNgayApDung, dHeSo: v.dHeSo };
        }
    });
})();
