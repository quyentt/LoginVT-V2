/* =========================================================================
   Quy định phân loại (đánh giá lương tăng thêm)
   Bản gốc: ApisNhanSu/Modules/dgplluongtangthem/script/quydinh.js
   ---------------------------------------------------------------------------
   Hai cột như gốc: cột trái từ khoá + Kế hoạch + Xếp loại, "Danh sách" (mỗi
   mục: Xếp loại (cận dưới - cận trên)); cột phải "Thông tin chung" đổi chỗ cho
   biểu mẫu. Khung "Chi tiết" không có lối mở → bỏ.
   Lời gọi (kiểu cũ, chép nguyên):
       NS_PLDG_LTT_QuyDinh/LayDanhSach  GET  strTuKhoa, strNhanSu_DGPL_LTT_KH_Id, phân trang
       NS_PLDG_LTT_QuyDinh/ThemMoi|CapNhat   strId, strNhanSu_DGPL_LTT_KH_Id, dMucDiemCanDuoi, dMucDiemCanTren, strXepLoai_Id
       NS_PLDG_LTT_QuyDinh/Xoa          strIds
       NS_PLDG_LTT_KeHoach/LayDanhSach  GET  pageIndex 1, pageSize 100000 (ô Kế hoạch)
   Danh mục: NS.XLTL (xếp loại).
   Lỗi gốc sửa theo ý định: danh sách gửi strNhanSu_DGPL_LTT_KH_Id đọc ô ""
   (getValById("")) → ô Kế hoạch ở cột trái không lọc được gì; nay gửi ô đó.
   Giữ như gốc: ô lọc "Xếp loại" KHÔNG gửi (LayDanhSach không có tham số xếp
   loại); trình xử lý "Loại áp dụng → Tiêu chí" của .js gốc trỏ ô không có
   trên màn → bỏ.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('dgpl-ltt-quydinh');
    if (!root) return;
    var esc = ums.ui.esc;
    function e(v) { return v === null || v === undefined ? '' : v; }
    var CTL = 'NS_PLDG_LTT_QuyDinh';
    var KH = ums.nsDgpl.keHoachSrc('NS_PLDG_LTT_KeHoach', 100000);
    var XL = { dm: 'NS.XLTL' };

    ums.crud({
        root: root,
        title: 'Quy định',
        formTitle: 'quy định phân loại',
        icon: 'fa-scale-balanced',
        addText: 'Thêm',
        master: {
            title: 'Danh sách', icon: 'fa-list-ul',
            item: function (r) {
                return '<b>' + esc(e(r.XEPLOAI_TEN) + ' (' + e(r.MUCDIEMCANDUOI) + ' - ' + e(r.MUCDIEMCANTREN) + ')') + '</b>';
            }
        },
        filters: [
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' },
            { key: 'kh', type: 'select', label: 'Kế hoạch', source: KH },
            { key: 'xl', type: 'select', label: 'Xếp loại', source: XL }
        ],
        list: {
            paged: true,
            call: function (f) {
                return { action: CTL + '/LayDanhSach', method: 'GET', strTuKhoa: f.q,
                         strNhanSu_DGPL_LTT_KH_Id: f.kh, strNguoiThucHien_Id: '' };
            }
        },
        fields: [
            { type: 'legend', label: 'Thông tin quy định' },
            { key: 'strNhanSu_DGPL_LTT_KH_Id', col: 'NHANSU_DGPL_LTT_KEHOACH_ID', label: 'Kế hoạch', type: 'select', source: KH, placeholder: 'Chọn kế hoạch', span: true },
            { key: 'dMucDiemCanDuoi', col: 'MUCDIEMCANDUOI', label: 'Điểm cận dưới', type: 'number' },
            { key: 'dMucDiemCanTren', col: 'MUCDIEMCANTREN', label: 'Điểm cận trên', type: 'number' },
            { key: 'strXepLoai_Id', col: 'XEPLOAI_ID', label: 'Xếp loại', type: 'select', source: XL, span: true }
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
