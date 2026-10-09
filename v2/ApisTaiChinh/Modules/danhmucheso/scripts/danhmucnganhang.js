/* =========================================================================
   Danh mục ngân hàng — bật / ẩn ngân hàng dùng cho thanh toán
   Bản gốc: ApisTaiChinh/Modules/danhmucheso/scripts/danhmucnganhang.js
   ---------------------------------------------------------------------------
   Danh sách lấy từ danh mục dùng chung, bảng danh mục cố định
   62122C28DD724285BFC93E11639E5136:
       pkg_chung_danhmuc.LayDanhSachDuLieuDanhMuc
   Màn hình này CHỈ đổi trạng thái:
       pkg_chung_danhmuc.CapNhatTrangThai_DuLieuDM   strId, dTrangThai

   Cố ý KHÔNG chuyển hai thứ của bản gốc:
     · Nút "Thêm": mở biểu mẫu chỉ có ô trạng thái, lưu với strId rỗng —
       gọi cập nhật trạng thái cho một dòng không tồn tại.
     · Nút "Xoá": gọi nhầm pkg_taichinh_ketoan.Xoa_API_KeToan_Khoan_HT
       (thủ tục xoá của màn TK Nợ/Có) với ID ngân hàng. Thêm/xoá ngân hàng
       làm ở màn danh mục dữ liệu chung.
   ========================================================================= */
(function () {
    'use strict';

    var TRANGTHAI = { items: [{ ID: '1', TEN: 'Hoạt động' }, { ID: '0', TEN: 'Ẩn' }] };

    function active(r) { return Number(r.TRANGTHAI) === 1 || r.TRANGTHAI === true; }

    ums.crud({
        root: document.getElementById('danhmucnganhang'),
        title: 'Danh mục ngân hàng',
        formTitle: 'trạng thái ngân hàng',
        icon: 'fa-building-columns',
        canAdd: false,

        filters: [
            { key: 'q', type: 'text', label: 'Nhập mã hoặc tên ngân hàng' }
        ],

        list: {
            call: function (f) {
                return {
                    action: 'CMS_DanhMuc_MH/DSA4BSAvKRIgIikFNA0oJDQFIC8pDDQi',
                    func: 'pkg_chung_danhmuc.LayDanhSachDuLieuDanhMuc',
                    strTuKhoa: f.q,
                    strCHUNG_TENDANHMUC_Id: '62122C28DD724285BFC93E11639E5136',
                    strTieuChiSapXep: '',
                    strQUANHECHA_Id: '',
                    dTrangThai: -1,
                    pageIndex: 1,
                    pageSize: 1000000
                };
            }
        },

        columns: [
            { title: 'Mã', prop: 'MA', cls: 'is-nowrap', width: '140px' },
            { title: 'Tên', render: function (r) { return ums.ui.esc(r.THONGTIN1 || r.TEN || ''); } },
            { title: 'Trạng thái', cls: 'is-center', width: '160px', render: function (r) {
                return active(r) ? ums.ui.badge('Đang hoạt động', 'ok') : ums.ui.badge('Ẩn', 'mute');
            } }
        ],

        fields: [
            { key: '_ma', label: 'Mã', type: 'static', col: 'MA' },
            { key: '_ten', label: 'Tên', type: 'static', get: function (r) { return r.THONGTIN1 || r.TEN || ''; } },
            { key: 'dTrangThai', label: 'Trạng thái', type: 'select', source: TRANGTHAI, required: true,
              get: function (r) { return active(r) ? '1' : '0'; } }
        ],

        save: function (v, row) {
            if (!row) return null;
            return {
                action: 'CMS_DanhMuc_MH/AiAxDykgNRUzIC8mFSkgKB4FNA0oJDQFDAPP',
                func: 'pkg_chung_danhmuc.CapNhatTrangThai_DuLieuDM',
                strId: row.ID,
                dTrangThai: v.dTrangThai
            };
        }
    });
})();
