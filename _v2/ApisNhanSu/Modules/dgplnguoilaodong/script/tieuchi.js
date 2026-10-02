/* =========================================================================
   Tiêu chí đánh giá (đánh giá phân loại viên chức & người lao động)
   Bản gốc: ApisNhanSu/Modules/dgplnguoilaodong/script/tieuchi.js
   ---------------------------------------------------------------------------
   Hai cột như gốc: cột trái từ khoá + "Danh sách tiêu chí"; cột phải "Thông
   tin chung" đổi chỗ cho biểu mẫu. Khung "Chi tiêu chí" (zone_detail) không có
   lối mở ở gốc → bỏ.
   Lời gọi (kiểu cũ, chép nguyên):
       NS_PLDG_NLD_TieuChi/LayDanhSach  GET  strTuKhoa, strLoaiDoiTuong_Id '', strNhomTieuChi_Id '' (gốc đọc ô rỗng), phân trang
       NS_PLDG_NLD_TieuChi/ThemMoi|CapNhat   strId, strTieuChi, iThuTu, strNhanSu_DGPL_Nam_KH_Id, strLoaiDoiTuong_Id, strNhomTieuChi_Id
       NS_PLDG_NLD_TieuChi/Xoa          strIds
       NS_PLDG_NLD_KeHoach/LayDanhSach  GET  (ô Kế hoạch)
   Danh mục: NS.LDVN (loại đối tượng), NS.NTCD (nhóm tiêu chí).
   Khác gốc: ô Kế hoạch gốc nạp với pageSize mặc định (10) → chỉ 10 kế hoạch
   đầu; nay lấy đủ (10000, như các màn anh em anhxa / phancap).
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('dgpl-tieuchi');
    if (!root) return;
    var esc = ums.ui.esc;
    var CTL = 'NS_PLDG_NLD_TieuChi';

    ums.crud({
        root: root,
        title: 'Tiêu chí',
        formTitle: 'tiêu chí đánh giá',
        icon: 'fa-list-check',
        addText: 'Thêm',
        master: {
            title: 'Danh sách tiêu chí', icon: 'fa-list-ul',
            item: function (r) { return '<b>' + esc(r.TIEUCHI) + '</b>'; }
        },
        filters: [{ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }],
        list: {
            paged: true,
            call: function (f) {
                return { action: CTL + '/LayDanhSach', method: 'GET', strTuKhoa: f.q,
                         strLoaiDoiTuong_Id: '', strNhomTieuChi_Id: '', strNguoiThucHien_Id: '' };
            }
        },
        fields: [
            { type: 'legend', label: 'Thông tin tiêu chí' },
            { key: 'strTieuChi', col: 'TIEUCHI', label: 'Tên tiêu chí', span: true },
            { key: 'strNhanSu_DGPL_Nam_KH_Id', col: 'NHANSU_DGPL_NAM_KEHOACH_ID', label: 'Kế hoạch', type: 'select',
              source: ums.nsDgpl.keHoachSrc('NS_PLDG_NLD_KeHoach', 10000), placeholder: 'Chọn kế hoạch', span: true },
            { key: 'strNhomTieuChi_Id', col: 'NHOMTIEUCHI_ID', label: 'Nhóm tiêu chí', type: 'select', source: { dm: 'NS.NTCD' }, span: true },
            { key: 'strLoaiDoiTuong_Id', col: 'LOAIDOITUONG_ID', label: 'Loại đối tượng', type: 'select', source: { dm: 'NS.LDVN' } },
            { key: 'iThuTu', col: 'THUTU', label: 'Thứ tự hiển thị', type: 'number' }
        ],
        save: function (v, row) {
            v.action = CTL + (row ? '/CapNhat' : '/ThemMoi');
            v.strId = row ? row.ID : '';
            return v;
        },
        remove: function (ids) {
            return ids.map(function (id) { return { action: CTL + '/Xoa', strIds: id }; });
        }
    });
})();
