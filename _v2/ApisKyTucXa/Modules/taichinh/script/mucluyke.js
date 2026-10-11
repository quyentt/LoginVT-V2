/* =========================================================================
   Mức luỹ kế (Ký túc xá — bậc tính phí điện / nước; gốc "Danh sách mức lũy kế")
   Bản gốc: ApisKyTucXa/Modules/taichinh/html/mucluyke.html + script/mucluyke.js (366 dòng)
   ---------------------------------------------------------------------------
   Một cột như gốc: bảng + Thêm / Tải lại; biểu mẫu thêm / sửa trong trang (gốc: hộp thoại #myModal).
   Lời gọi (chép nguyên):
       KTX_LuyKe/LayDanhSach    GET   strTuKhoa, strNguoiThucHien_Id '', pageIndex, pageSize
       KTX_LuyKe/LayChiTiet     GET   strId
       KTX_LuyKe/ThemMoi | CapNhat (khi có strId)   POST  strId, dMucCanTren, dMucCanDuoi, strTen, strMa
       KTX_LuyKe/Xoa            POST  strIds = một id (mỗi dòng một lời gọi)
   Bắt buộc như gốc (arrValid): Mức cận trên (số), Mức cận dưới (số), Tên. Thứ tự ô như gốc: cận dưới, cận trên, Tên, Mã.
   Khác gốc: gốc không có ô lọc; thêm ô từ khóa → strTuKhoa (gốc luôn gửi rỗng), gõ tự tìm.
   Cố ý bỏ (mã chết): page_load nạp danh mục KTX.LP00 / CHUN.DVTT vào #dropMucLuyKe_LoaiPhong / #dropMucLuyKe_DonViTinh — hai ô không có
   trong HTML, cũng không được gửi; #btnYes, #notify.
   ========================================================================= */
(function () {
    'use strict';
    var P = 'KTX_LuyKe/';
    var root = document.getElementById('ktx-mucluyke');
    if (!root) return;

    ums.crud({
        root: root,
        title: 'Mức luỹ kế', listTitle: 'Danh sách mức lũy kế', formTitle: 'mức lũy kế', icon: 'fa-stairs',
        addText: 'Thêm',
        filters: [{ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }],
        list: { paged: true, call: function (f) { return { action: P + 'LayDanhSach', method: 'GET', strTuKhoa: f.q || '', strNguoiThucHien_Id: '' }; } },
        columns: [
            { title: 'Tên', prop: 'TEN' },
            { title: 'Mã', prop: 'MA', cls: 'is-nowrap' },
            { title: 'Mức cận dưới', prop: 'MUCCANDUOI', cls: 'is-right is-nowrap' },
            { title: 'Mức cận trên', prop: 'MUCCANTREN', cls: 'is-right is-nowrap' }
        ],
        detail: function (row) { return { action: P + 'LayChiTiet', method: 'GET', strId: row.ID }; },
        fields: [
            { key: 'dMucCanDuoi', col: 'MUCCANDUOI', label: 'Mức cận dưới', type: 'number', required: true },
            { key: 'dMucCanTren', col: 'MUCCANTREN', label: 'Mức cận trên', type: 'number', required: true },
            { key: 'strTen', col: 'TEN', label: 'Tên', required: true },
            { key: 'strMa', col: 'MA', label: 'Mã' }
        ],
        save: function (v, row) {
            return { action: P + (row ? 'CapNhat' : 'ThemMoi'), method: 'POST', strId: row ? row.ID : '',
                dMucCanTren: v.dMucCanTren, dMucCanDuoi: v.dMucCanDuoi, strTen: v.strTen, strMa: v.strMa };
        },
        remove: function (ids) { return ids.map(function (id) { return { action: P + 'Xoa', method: 'POST', strIds: id }; }); }
    });
})();
