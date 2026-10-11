/* =========================================================================
   Đơn giá phòng ở (Ký túc xá → Mức phí; tiêu đề gốc "Danh sách phí theo phòng")
   Bản gốc: ApisKyTucXa/Modules/taichinh/html/phitheophong.html + script/phitheophong.js (501 dòng)
   ---------------------------------------------------------------------------
   Một cột như gốc: bảng + nút Thêm / Tải lại; biểu mẫu thêm / sửa trong trang (gốc: hộp thoại #myModal → luật 2026-09-30).
   Lời gọi (kiểu cũ, không mã hoá — chép nguyên):
       KTX_MucPhi_Phong/LayDanhSach   GET   strTuKhoa, strKTX_Phong_Id, strDonViTinh_Id, strNguoiThucHien_Id '', pageIndex, pageSize
       KTX_MucPhi_Phong/LayChiTiet    GET   strId
       KTX_MucPhi_Phong/ThemMoi | CapNhat (khi có strId)   POST
           strId, strTaiChinh_CacKhoanThu_Id, strNgayApDung, strKTX_Phong_Id, strDonViTinh_Id, dDonGiaCaPhong, dDonGiaTheoNguoi
       KTX_MucPhi_Phong/Xoa           POST  strIds = một id (mỗi dòng một lời gọi)
       Ô chọn: TC_KhoanThu/LayDanhSach · KTX_Phong/LayDanhSach (hiện MA) · danh mục KTX.DVT0
   Bắt buộc như gốc (arrValid): Khoản thu, Ngày áp dụng, Phòng, Đơn giá cả phòng (số), Đơn vị tính.
   Khác gốc (lỗi rõ ràng):
     · Nhãn ô chọn phòng của gốc ghi "Loại phòng" nhưng ô là danh sách PHÒNG (KTX_Phong, cột bảng "Phòng") → nhãn "Phòng".
     · Gốc không có ô lọc; thêm ô từ khóa + Phòng + Đơn vị tính → đúng ba tham số strTuKhoa / strKTX_Phong_Id / strDonViTinh_Id
       mà LayDanhSach nhận (gốc luôn gửi rỗng), gõ / chọn tự tìm.
   Cố ý bỏ: #btnYes (hộp xác nhận cũ), #notify.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, T = ums.ktxTC, P = 'KTX_MucPhi_Phong/';
    var root = document.getElementById('ktx-phitheophong');
    if (!root) return;

    var PHONG = T.src.phong(), DVT = T.src.dvt();

    ums.crud({
        root: root,
        title: 'Đơn giá phòng ở', listTitle: 'Danh sách phí theo phòng', formTitle: 'phí theo phòng', icon: 'fa-bed',
        addText: 'Thêm',
        filters: [
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' },
            { key: 'phong', type: 'select', label: 'Chọn phòng', source: PHONG },
            { key: 'dvt', type: 'select', label: 'Chọn đơn vị tính', source: DVT }
        ],
        list: { paged: true, call: function (f) {
            return { action: P + 'LayDanhSach', method: 'GET', strTuKhoa: f.q || '', strKTX_Phong_Id: f.phong || '', strDonViTinh_Id: f.dvt || '', strNguoiThucHien_Id: '' };
        } },
        columns: [
            { title: 'Phòng', prop: 'KTX_PHONG_MA', cls: 'is-center is-nowrap' },
            { title: 'Đơn giá theo người', cls: 'is-right is-nowrap', render: function (r) { return ui.money(r.DONGIATHEONGUOI); } },
            { title: 'Đơn giá cả phòng', cls: 'is-right is-nowrap', render: function (r) { return ui.money(r.DONGIACAPHONG); } },
            { title: 'Đơn vị', prop: 'DONVITINH_TEN', cls: 'is-center' },
            { title: 'Ngày áp dụng', prop: 'NGAYAPDUNG', cls: 'is-center is-nowrap' }
        ],
        detail: function (row) { return { action: P + 'LayChiTiet', method: 'GET', strId: row.ID }; },
        fields: [
            { key: 'strTaiChinh_CacKhoanThu_Id', col: 'TAICHINH_CACKHOANTHU_ID', label: 'Khoản thu', type: 'select', required: true, placeholder: 'Chọn khoản thu', source: T.src.khoanThu() },
            { key: 'strNgayApDung', col: 'NGAYAPDUNG', label: 'Ngày áp dụng', type: 'date', required: true },
            { key: 'strKTX_Phong_Id', col: 'KTX_PHONG_ID', label: 'Phòng', type: 'select', required: true, placeholder: 'Chọn phòng', source: PHONG },
            { key: 'dDonGiaCaPhong', col: 'DONGIACAPHONG', label: 'Đơn giá cả phòng', type: 'number', required: true },
            { key: 'dDonGiaTheoNguoi', col: 'DONGIATHEONGUOI', label: 'Đơn giá từng người', type: 'number' },
            { key: 'strDonViTinh_Id', col: 'DONVITINH_ID', label: 'Đơn vị tính', type: 'select', required: true, source: DVT }
        ],
        save: function (v, row) {
            return { action: P + (row ? 'CapNhat' : 'ThemMoi'), method: 'POST', strId: row ? row.ID : '',
                strTaiChinh_CacKhoanThu_Id: v.strTaiChinh_CacKhoanThu_Id, strNgayApDung: v.strNgayApDung, strKTX_Phong_Id: v.strKTX_Phong_Id,
                strDonViTinh_Id: v.strDonViTinh_Id, dDonGiaCaPhong: v.dDonGiaCaPhong, dDonGiaTheoNguoi: v.dDonGiaTheoNguoi };
        },
        remove: function (ids) { return ids.map(function (id) { return { action: P + 'Xoa', method: 'POST', strIds: id }; }); }
    });
})();
