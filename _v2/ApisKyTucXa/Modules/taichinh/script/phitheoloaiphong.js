/* =========================================================================
   Phí theo loại phòng (Ký túc xá — gốc "Danh sách phí theo loại phòng")
   Bản gốc: ApisKyTucXa/Modules/taichinh/html/phitheoloaiphong.html + script/phitheoloaiphong.js (407 dòng)
   ---------------------------------------------------------------------------
   tom-tat-goc mục 7: không trùng ≥ 85% với phitheophong (khác controller, khác ô: Loại phòng là danh mục KTX.LP00, một đơn giá) → màn riêng,
   cùng khuôn ums.crud, dùng chung nguồn ô chọn ums.ktxTC.src.
   Một cột như gốc: bảng + Thêm / Tải lại; biểu mẫu thêm / sửa trong trang (gốc: hộp thoại #myModal).
   Lời gọi (chép nguyên):
       KTX_MucPhi_LoaiPhong/LayDanhSach   GET   strTuKhoa, strLoaiPhong_Id, strDonViTinh_Id, strNguoiThucHien_Id '', pageIndex, pageSize
       KTX_MucPhi_LoaiPhong/LayChiTiet    GET   strId
       KTX_MucPhi_LoaiPhong/ThemMoi | CapNhat (khi có strId)   POST  strId, strTaiChinh_CacKhoanThu_Id, strNgayApDung, strLoaiPhong_Id, strDonViTinh_Id, dDonGia
       KTX_MucPhi_LoaiPhong/Xoa           POST  strIds = một id (mỗi dòng một lời gọi)
       Ô chọn: TC_KhoanThu/LayDanhSach · danh mục KTX.LP00 (loại phòng) · KTX.DVT0 (đơn vị tính)
   Bắt buộc như gốc (arrValid): Khoản thu, Ngày áp dụng, Loại phòng, Đơn giá (số), Đơn vị tính.
   Khác gốc: gốc không có ô lọc; thêm ô từ khóa + Loại phòng + Đơn vị tính → đúng ba tham số của LayDanhSach (gốc luôn gửi rỗng), gõ / chọn tự tìm.
   Cố ý bỏ: #btnYes, #notify.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, T = ums.ktxTC, P = 'KTX_MucPhi_LoaiPhong/';
    var root = document.getElementById('ktx-phitheoloaiphong');
    if (!root) return;
    var LP = T.src.loaiPhong(), DVT = T.src.dvt();

    ums.crud({
        root: root,
        title: 'Phí theo loại phòng', listTitle: 'Danh sách phí theo loại phòng', formTitle: 'phí theo loại phòng', icon: 'fa-door-open',
        addText: 'Thêm',
        filters: [
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' },
            { key: 'lp', type: 'select', label: 'Chọn loại phòng', source: LP },
            { key: 'dvt', type: 'select', label: 'Chọn đơn vị tính', source: DVT }
        ],
        list: { paged: true, call: function (f) {
            return { action: P + 'LayDanhSach', method: 'GET', strTuKhoa: f.q || '', strLoaiPhong_Id: f.lp || '', strDonViTinh_Id: f.dvt || '', strNguoiThucHien_Id: '' };
        } },
        columns: [
            { title: 'Khoản thu', prop: 'TAICHINH_CACKHOANTHU_TEN' },
            { title: 'Loại phòng', prop: 'LOAIPHONG_TEN' },
            { title: 'Đơn giá', cls: 'is-right is-nowrap', render: function (r) { return ui.money(r.DONGIA); } },
            { title: 'Đơn vị tính', prop: 'DONVITINH_TEN' },
            { title: 'Ngày áp dụng', prop: 'NGAYAPDUNG', cls: 'is-center is-nowrap' }
        ],
        detail: function (row) { return { action: P + 'LayChiTiet', method: 'GET', strId: row.ID }; },
        fields: [
            { key: 'strTaiChinh_CacKhoanThu_Id', col: 'TAICHINH_CACKHOANTHU_ID', label: 'Khoản thu', type: 'select', required: true, placeholder: 'Chọn khoản thu', source: T.src.khoanThu() },
            { key: 'strNgayApDung', col: 'NGAYAPDUNG', label: 'Ngày áp dụng', type: 'date', required: true },
            { key: 'strLoaiPhong_Id', col: 'LOAIPHONG_ID', label: 'Loại phòng', type: 'select', required: true, source: LP },
            { key: 'dDonGia', col: 'DONGIA', label: 'Đơn giá', type: 'number', required: true },
            { key: 'strDonViTinh_Id', col: 'DONVITINH_ID', label: 'Đơn vị tính', type: 'select', required: true, source: DVT }
        ],
        save: function (v, row) {
            return { action: P + (row ? 'CapNhat' : 'ThemMoi'), method: 'POST', strId: row ? row.ID : '',
                strTaiChinh_CacKhoanThu_Id: v.strTaiChinh_CacKhoanThu_Id, strNgayApDung: v.strNgayApDung, strLoaiPhong_Id: v.strLoaiPhong_Id,
                strDonViTinh_Id: v.strDonViTinh_Id, dDonGia: v.dDonGia };
        },
        remove: function (ids) { return ids.map(function (id) { return { action: P + 'Xoa', method: 'POST', strIds: id }; }); }
    });
})();
