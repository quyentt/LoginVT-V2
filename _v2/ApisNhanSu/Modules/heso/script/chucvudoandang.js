/* =========================================================================
   Hệ số chức vụ đoàn đảng
   Bản gốc: ApisNhanSu/Modules/heso/html/chucvudoandang.html + script/chucvudoandang.js
   ---------------------------------------------------------------------------
   Một cột như gốc: lọc Chức vụ · Ngày áp dụng · Từ khoá → Danh sách (Mã chức vụ ·
   Tên chức vụ · Hệ số 1 · Hệ số 2 · Ngày áp dụng) → biểu mẫu Chức vụ · Ngày áp dụng ·
   Hệ số 1 · Hệ số 2. Khung chung: ums.nsHeSo.man (../script/_heso.js).
   (Gốc chucvudoandang.js và chucvuchinhquyen.js chép nhau, chỉ khác controller + mã lọc chức vụ.)

   Lời gọi (chép nguyên):
       NS_HeSo_ChucVuDangDoan/LayDanhSach GET — strTuKhoa, strNgayApDung, strChucVu_Id,
           strNguoiTao_Id '' (gốc đọc dropAAAA), pageIndex, pageSize
       NS_HeSo_ChucVuDangDoan/ThemMoi | CapNhat POST — strId, strChucNang_Id, strChucVu_Id,
           strNgayApDung, dHeSo1, dHeSo2, strNguoiThucHien_Id
       NS_HeSo_ChucVuDangDoan/Xoa POST — strIds (từng dòng), strChucNang_Id, strNguoiThucHien_Id
   Danh mục: NS.DMCV, chỉ giữ dòng THONGTIN1 = "DOANDANG" (objGetDataInData của gốc).
   ========================================================================= */
(function () {
    'use strict';
    var N = ums.nsHeSo, chucVu = N.dm('NS.DMCV', { THONGTIN1: 'DOANDANG' });

    N.man('ns-chucvudoandang', {
        ctl: 'NS_HeSo_ChucVuDangDoan',
        title: 'Hệ số chức vụ đoàn đảng',
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
            { title: 'Hệ số 1', prop: 'HESO1', cls: 'is-center' },
            { title: 'Hệ số 2', prop: 'HESO2', cls: 'is-center' },
            { title: 'Ngày áp dụng', prop: 'NGAYAPDUNG', cls: 'is-center is-nowrap' }
        ],
        fields: [
            { key: 'strChucVu_Id', col: 'CHUCVU_ID', label: 'Chức vụ', type: 'select', source: chucVu, placeholder: 'Chọn chức vụ' },
            { key: 'strNgayApDung', col: 'NGAYAPDUNG', label: 'Ngày áp dụng', type: 'date' },
            { key: 'dHeSo1', col: 'HESO1', label: 'Hệ số 1', type: 'number' },
            { key: 'dHeSo2', col: 'HESO2', label: 'Hệ số 2', type: 'number' }
        ],
        save: function (v) {
            return { strChucVu_Id: v.strChucVu_Id, strNgayApDung: v.strNgayApDung, dHeSo1: v.dHeSo1, dHeSo2: v.dHeSo2 };
        }
    });
})();
