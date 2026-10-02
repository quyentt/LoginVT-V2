/* =========================================================================
   Hệ số thâm niên
   Bản gốc: ApisNhanSu/Modules/heso/html/hesothamnien.html + script/hesothamnien.js
   ---------------------------------------------------------------------------
   Một cột như gốc: lọc Ngày áp dụng · Từ khoá → Danh sách (Xâu điều kiện · Hệ số ·
   Ngày áp dụng) → biểu mẫu Xâu điều kiện · Ngày áp dụng · Hệ số.
   Khung chung: ums.nsHeSo.man (../script/_heso.js).

   Lời gọi (chép nguyên):
       NS_HeSo_ThamNien/LayDanhSach GET — strTuKhoa, strNgayApDung, strNguoiTao_Id '',
           pageIndex, pageSize
       NS_HeSo_ThamNien/ThemMoi | CapNhat POST — strId, strChucNang_Id, strXauDieuKien,
           strNgayApDung, dHeSo, strNguoiThucHien_Id
       NS_HeSo_ThamNien/Xoa POST — strIds (từng dòng), strChucNang_Id, strNguoiThucHien_Id
   ========================================================================= */
(function () {
    'use strict';
    ums.nsHeSo.man('ns-hesothamnien', {
        ctl: 'NS_HeSo_ThamNien',
        title: 'Hệ số thâm niên',
        filters: [
            { key: 'ngay', label: 'Ngày áp dụng', date: true },
            { key: 'q', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: function (f) {
            return { strTuKhoa: f.q, strNgayApDung: f.ngay, strNguoiTao_Id: '' };
        },
        columns: [
            { title: 'Xâu điều kiện', prop: 'XAUDIEUKIEN' },
            { title: 'Hệ số', prop: 'HESO', cls: 'is-center' },
            { title: 'Ngày áp dụng', prop: 'NGAYAPDUNG', cls: 'is-center is-nowrap' }
        ],
        fields: [
            { key: 'strXauDieuKien', col: 'XAUDIEUKIEN', label: 'Xâu điều kiện', span: true },
            { key: 'strNgayApDung', col: 'NGAYAPDUNG', label: 'Ngày áp dụng', type: 'date' },
            { key: 'dHeSo', col: 'HESO', label: 'Hệ số', type: 'number' }
        ],
        save: function (v) {
            return { strXauDieuKien: v.strXauDieuKien, strNgayApDung: v.strNgayApDung, dHeSo: v.dHeSo };
        }
    });
})();
