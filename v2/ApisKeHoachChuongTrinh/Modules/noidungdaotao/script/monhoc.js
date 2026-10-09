/* =========================================================================
   Môn học
   Bản gốc: ApisKeHoachChuongTrinh/Modules/noidungdaotao/html/monhoc.html + script/monhoc.js
   ---------------------------------------------------------------------------
   Một cột như gốc: thanh lọc (Bộ môn, từ khoá) + "Danh sách môn học"; biểu mẫu
   "Thông tin môn học" thay chỗ danh sách (ums.crud).
   Lời gọi (kiểu cũ, chép nguyên):
       KHCT_MonHoc/LayDanhSach  GET  strTuKhoa, strThuocBoMon_Id, strNguoiThucHien_Id '', phân trang
       KHCT_MonHoc/LayChiTiet   GET  strId
       KHCT_MonHoc/ThemMoi|CapNhat   strId, strTen, strMa, dHocTrinh, strThuocBoMon_Id, strKyHieu
       KHCT_MonHoc/Xoa          strIds (nhiều id nối dấu phẩy như gốc)
   Bộ môn: edu.system.getList_CoCauToChuc (pkg_nhansu_hoso_v2.LayDanhSachToanBo, trạng thái 1).
   Thêm mới: ô Bộ môn điền sẵn bộ môn đang lọc (rewrite của gốc).
   Gốc chỉ có nút Sửa trên dòng + ô đánh dấu để xoá nhiều → giữ vậy (không có xoá từng dòng).
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('khct-monhoc');
    if (!root) return;
    var N = ums.khctND;
    var BOMON = N.srcBoMon();
    var CTL = 'KHCT_MonHoc';

    var crud = ums.crud({
        root: root,
        title: 'Môn học',
        formTitle: 'môn học',
        listTitle: 'Danh sách môn học',
        icon: 'fa-book',
        saveAgain: 'Lưu và Nhập tiếp',
        rowDelete: false,
        formDelete: false,
        filters: [
            { key: 'bomon', type: 'select', label: 'Chọn bộ môn', source: BOMON },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: {
            paged: true,
            call: function (f) {
                return { action: CTL + '/LayDanhSach', method: 'GET', strTuKhoa: f.q, strThuocBoMon_Id: f.bomon, strNguoiThucHien_Id: '' };
            }
        },
        columns: [
            { title: 'Mã môn học', prop: 'MA', cls: 'is-nowrap' },
            { title: 'Tên môn học', prop: 'TEN' },
            { title: 'Bộ môn', prop: 'THUOCBOMON_TEN' },
            { title: 'Số tín chỉ', prop: 'HOCTRINH', cls: 'is-center', width: '100px' }
        ],
        detail: function (row) { return { action: CTL + '/LayChiTiet', method: 'GET', strId: row.ID }; },
        fields: [
            { type: 'legend', label: 'Thông tin môn học' },
            { key: 'strMa', col: 'MA', label: 'Mã môn học' },
            { key: 'strTen', col: 'TEN', label: 'Tên môn học' },
            { key: 'strThuocBoMon_Id', col: 'THUOCBOMON_ID', label: 'Bộ môn', type: 'select', source: BOMON, placeholder: 'Chọn bộ môn' },
            { key: 'dHocTrinh', col: 'HOCTRINH', label: 'Số tín chỉ' },
            { key: 'strKyHieu', col: 'KYHIEU', label: 'Ký hiệu' }
        ],
        onForm: function (row, c) {
            if (!row) N.datGT(N.fe(c, 'strThuocBoMon_Id'), N.fl(c, 'bomon').value);
        },
        save: function (v, row) {
            return {
                action: CTL + (row ? '/CapNhat' : '/ThemMoi'),
                strId: row ? row.ID : '',
                strTen: v.strTen,
                strMa: v.strMa,
                dHocTrinh: v.dHocTrinh,
                strThuocBoMon_Id: v.strThuocBoMon_Id,
                strKyHieu: v.strKyHieu,
                strNguoiThucHien_Id: ''
            };
        },
        remove: function (ids) {
            return { action: CTL + '/Xoa', strIds: ids.join(','), strNguoiThucHien_Id: '' };
        }
    });
    return crud;
})();
