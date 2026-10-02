/* =========================================================================
   Tiêu chí thưởng (đánh giá lương tăng thêm)
   Bản gốc: ApisNhanSu/Modules/dgplluongtangthem/script/tieuchithuong.js
   ---------------------------------------------------------------------------
   Hai cột như gốc: cột trái từ khoá + Kế hoạch, "Danh sách"; cột phải "Thông
   tin chung" đổi chỗ cho biểu mẫu. Khung "Chi tiết" không có lối mở → bỏ.
   Lời gọi (kiểu cũ, chép nguyên):
       NS_PLDG_LTT_TieuChiThuong/LayDanhSach  GET  strTuKhoa, strNhanSu_DGPL_LTT_KH_Id, phân trang
       NS_PLDG_LTT_TieuChiThuong/ThemMoi|CapNhat   strId, strNhanSu_DGPL_LTT_KH_Id, strTieuChi, iThuTu, dDiemChuan
       NS_PLDG_LTT_TieuChiThuong/Xoa          strIds
       NS_PLDG_LTT_KeHoach/LayDanhSach        GET  pageIndex 1, pageSize 100000 (ô Kế hoạch)
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('dgpl-ltt-tieuchithuong');
    if (!root) return;
    var esc = ums.ui.esc;
    var CTL = 'NS_PLDG_LTT_TieuChiThuong';
    var KH = ums.nsDgpl.keHoachSrc('NS_PLDG_LTT_KeHoach', 100000);

    ums.crud({
        root: root,
        title: 'Tiêu chí thưởng',
        formTitle: 'tiêu chí thưởng',
        icon: 'fa-award',
        addText: 'Thêm',
        master: {
            title: 'Danh sách', icon: 'fa-list-ul',
            item: function (r) { return '<b>' + esc(r.TIEUCHI) + '</b>'; }
        },
        filters: [
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' },
            { key: 'kh', type: 'select', label: 'Kế hoạch', source: KH }
        ],
        list: {
            paged: true,
            call: function (f) {
                return { action: CTL + '/LayDanhSach', method: 'GET', strTuKhoa: f.q,
                         strNhanSu_DGPL_LTT_KH_Id: f.kh, strNguoiThucHien_Id: '' };
            }
        },
        fields: [
            { type: 'legend', label: 'Thông tin tiêu chí thưởng' },
            { key: 'strNhanSu_DGPL_LTT_KH_Id', col: 'NHANSU_DGPL_LTT_KEHOACH_ID', label: 'Kế hoạch', type: 'select', source: KH, placeholder: 'Chọn kế hoạch', span: true },
            { key: 'strTieuChi', col: 'TIEUCHI', label: 'Tên tiêu chí', span: true },
            { key: 'dDiemChuan', col: 'DIEMCHUAN', label: 'Điểm chuẩn', type: 'number' },
            { key: 'iThuTu', col: 'THUTU', label: 'Thứ tự', type: 'number' }
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
