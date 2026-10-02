/* =========================================================================
   Hệ số chức danh
   Bản gốc: ApisNhanSu/Modules/heso/html/hesochucdanh.html + script/hesochucdanh.js
   ---------------------------------------------------------------------------
   Một cột như gốc: lọc Chức danh · Ngạch · Học hàm · Ngày áp dụng · Từ khoá →
   Danh sách (Mã/Tên chức danh · Mã/Tên ngạch · Mã/Tên học hàm · Hệ số · Hệ số tập sự ·
   Ngày áp dụng) → biểu mẫu Chức danh · Ngạch · Học hàm · Ngày áp dụng · Hệ số · Hệ số tập sự.
   Ba ô chọn độc lập (không phải cha → con). Khung chung: ums.nsHeSo.man.

   Lời gọi (chép nguyên):
       NS_HeSo_ChucDanh/LayDanhSach GET — strTuKhoa, strNgayApDung, strNgach_Id,
           strHocHam_Id, strChucDanhNgheNghiep_Id, strNguoiTao_Id '', pageIndex, pageSize
       NS_HeSo_ChucDanh/ThemMoi | CapNhat POST — strId, strChucNang_Id,
           strChucDanhNgheNghiep_Id, strNgach_Id, strHocHam_Id, dHeSoTapSu,
           strNgayApDung, dHeSo, strNguoiThucHien_Id
       NS_HeSo_ChucDanh/Xoa POST — strIds (từng dòng), strChucNang_Id, strNguoiThucHien_Id
   Danh mục: NS.CDNN (chức danh), LUONG.NGACH, NS.LOCD (học hàm).
   ========================================================================= */
(function () {
    'use strict';
    var N = ums.nsHeSo;
    var chucDanh = N.dm('NS.CDNN'), ngach = N.dm('LUONG.NGACH'), hocHam = N.dm('NS.LOCD');

    N.man('ns-hesochucdanh', {
        ctl: 'NS_HeSo_ChucDanh',
        title: 'Hệ số chức danh',
        filters: [
            { key: 'cd', type: 'select', label: 'Chọn chức danh', source: chucDanh },
            { key: 'ngach', type: 'select', label: 'Chọn ngạch', source: ngach },
            { key: 'hh', type: 'select', label: 'Chọn học hàm', source: hocHam },
            { key: 'ngay', label: 'Ngày áp dụng', date: true },
            { key: 'q', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: function (f) {
            return {
                strTuKhoa: f.q, strNgayApDung: f.ngay, strNgach_Id: f.ngach, strHocHam_Id: f.hh,
                strChucDanhNgheNghiep_Id: f.cd, strNguoiTao_Id: ''
            };
        },
        columns: [
            { title: 'Mã chức danh', prop: 'CHUCDANHNGHENGHIEP_MA', cls: 'is-nowrap' },
            { title: 'Tên chức danh', prop: 'CHUCDANHNGHENGHIEP_TEN' },
            { title: 'Mã ngạch', prop: 'NGACH_MA', cls: 'is-nowrap' },
            { title: 'Tên ngạch', prop: 'NGACH_TEN' },
            { title: 'Mã học hàm', prop: 'HOCHAM_MA', cls: 'is-nowrap' },
            { title: 'Tên học hàm', prop: 'HOCHAM_TEN' },
            { title: 'Hệ số', prop: 'HESO', cls: 'is-center' },
            { title: 'Hệ số tập sự', prop: 'HESOTAPSU', cls: 'is-center' },
            { title: 'Ngày áp dụng', prop: 'NGAYAPDUNG', cls: 'is-center is-nowrap' }
        ],
        fields: [
            { key: 'strChucDanhNgheNghiep_Id', col: 'CHUCDANHNGHENGHIEP_ID', label: 'Chức danh', type: 'select', source: chucDanh, placeholder: 'Chọn chức danh' },
            { key: 'strNgach_Id', col: 'NGACH_ID', label: 'Ngạch', type: 'select', source: ngach, placeholder: 'Chọn ngạch' },
            { key: 'strHocHam_Id', col: 'HOCHAM_ID', label: 'Học hàm', type: 'select', source: hocHam, placeholder: 'Chọn học hàm' },
            { key: 'strNgayApDung', col: 'NGAYAPDUNG', label: 'Ngày áp dụng', type: 'date' },
            { key: 'dHeSo', col: 'HESO', label: 'Hệ số', type: 'number' },
            { key: 'dHeSoTapSu', col: 'HESOTAPSU', label: 'Hệ số tập sự', type: 'number' }
        ],
        save: function (v) {
            return {
                strChucDanhNgheNghiep_Id: v.strChucDanhNgheNghiep_Id, strNgach_Id: v.strNgach_Id,
                strHocHam_Id: v.strHocHam_Id, dHeSoTapSu: v.dHeSoTapSu,
                strNgayApDung: v.strNgayApDung, dHeSo: v.dHeSo
            };
        }
    });
})();
