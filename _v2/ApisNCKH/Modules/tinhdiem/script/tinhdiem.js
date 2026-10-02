/* =========================================================================
   Tính điểm — kế hoạch tính điểm NCKH (danh sách + biểu mẫu thay chỗ)
   Bản gốc: ApisNCKH/Modules/tinhdiem/script/tinhdiem.js + html/tinhdiem.html (MỘT cột → ums.crud khuôn A)
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       NCKH_TinhDiem_KeHoach/LayDanhSach   GET  strTuKhoa, strNguoiThucHien_Id, pageIndex, pageSize (phân trang máy chủ)
       NCKH_TinhDiem_KeHoach/ThemMoi       POST strId '', strChucNang_Id, strTuNgay, strDenNgay, strMoTa, strNguoiThucHien_Id
       NCKH_TinhDiem_KeHoach/CapNhat       POST (cùng tham số, strId = ID dòng)
       NCKH_TinhDiem_KeHoach/Xoa           POST strIds, strNguoiThucHien_Id
   Cột: MOTA, TUNGAY, DENNGAY.
   Khác gốc:
     · Nút "Xóa" trong biểu mẫu gốc đặt style="display:none" và không chỗ nào bật lên → chưa từng xoá được.
       Bản mới hiện nút Xoá trong biểu mẫu khi Sửa (lời gọi Xoa chép nguyên). Không thêm xoá trên dòng / xoá
       nhiều (gốc không có).
     · Lưu xong gốc còn lặp hai bảng #tbl_HeKhoa / #tblInputDanhSachNhanSu KHÔNG có trên màn (mã chép từ màn
       khác, không chạy) → bỏ. Ô txtTenTinhDiem (gốc đổ TEN) không có trên màn → bỏ.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('nckh-tinhdiem');
    if (!root) return;
    function uid() { return (ums.session && ums.session.userId) || ''; }
    var C = 'NCKH_TinhDiem_KeHoach';

    ums.crud({
        root: root,
        title: 'Tính điểm',
        formTitle: 'tính điểm',
        icon: 'fa-calculator',
        listTitle: 'Danh sách tính điểm',
        filters: [{ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }],
        list: {
            paged: true,
            call: function (f) { return { action: C + '/LayDanhSach', method: 'GET', strTuKhoa: f.q, strNguoiThucHien_Id: uid() }; }
        },
        columns: [
            { title: 'Mô tả', prop: 'MOTA' },
            { title: 'Ngày bắt đầu', prop: 'TUNGAY', cls: 'is-center is-nowrap', width: '120px' },
            { title: 'Ngày kết thúc', prop: 'DENNGAY', cls: 'is-center is-nowrap', width: '120px' }
        ],
        fields: [
            { key: '_tt', type: 'legend', label: 'Thông tin tính điểm' },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea' },
            { key: 'strTuNgay', col: 'TUNGAY', label: 'Ngày bắt đầu', type: 'date' },
            { key: 'strDenNgay', col: 'DENNGAY', label: 'Ngày kết thúc', type: 'date' }
        ],
        save: function (v, row) {
            return {
                action: C + (row ? '/CapNhat' : '/ThemMoi'), method: 'POST',
                strId: row ? row.ID : '',
                strChucNang_Id: (ums.state && ums.state.chucNangId) || '',
                strTuNgay: v.strTuNgay, strDenNgay: v.strDenNgay, strMoTa: v.strMoTa,
                strNguoiThucHien_Id: uid()
            };
        },
        rowDelete: false,
        multi: false,
        remove: function (ids) { return ids.map(function (id) { return { action: C + '/Xoa', method: 'POST', strIds: id, strNguoiThucHien_Id: uid() }; }); }
    });
})();
