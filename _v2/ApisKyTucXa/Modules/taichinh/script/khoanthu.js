/* =========================================================================
   Khoản thu (bản của phân hệ Ký túc xá — gốc "Danh sách danh mục khoản thu")
   Bản gốc: ApisKyTucXa/Modules/taichinh/html/khoanthu.html + script/khoanthu.js (371 dòng)
   ---------------------------------------------------------------------------
   Một cột như gốc: bảng + Thêm / Tải lại; biểu mẫu thêm / sửa trong trang (gốc: hộp thoại #myModal).
   Khác bản Tài chính (ApisTaiChinh/danhmucheso/khoanthu.js — gói mã hoá pkg_taichinh_thuchi, 20 ô): bản này gọi controller kiểu cũ
   TC_KhoanThu với 5 ô, không có kế hoạch xuất hoá đơn → màn riêng.
   Lời gọi (chép nguyên):
       TC_KhoanThu/LayDanhSach    GET   strTuKhoa, strNhomCacKhoanThu_Id, strNguoiThucHien_Id '', strcanboquanly_id '', pageIndex, pageSize
       TC_KhoanThu/LayChiTiet     GET   strId
       TC_KhoanThu/ThemMoi | CapNhat (khi có strId)   POST  strId, strTen, strMa, iThuTu, strNhomCacKhoanThu_Id, strMoTa, dThutuUuTienGachNo -1, dTinhPhiTuDong -1
       TC_KhoanThu/Xoa            POST  strIds = một id (mỗi dòng một lời gọi)
       Danh mục TC.NKT0 (constant.setting.CATOR.TC.NKT0 — nhóm khoản thu)
   Bắt buộc như gốc (arrValid): Tên, Mã, Nhóm khoản thu.
   Khác gốc: gốc không có ô lọc; thêm ô từ khóa + Nhóm khoản thu → strTuKhoa / strNhomCacKhoanThu_Id (gốc luôn gửi rỗng), gõ tự tìm.
   Cố ý bỏ (mã chết): btnAddnew_KhoanThu / btnRefresh_KhoanThu / #addHocPhan / #btnRefresh (không có xử lý), #btnYes, #notify.
   ========================================================================= */
(function () {
    'use strict';
    var T = ums.ktxTC, P = 'TC_KhoanThu/';
    var root = document.getElementById('ktx-khoanthu');
    if (!root) return;
    var NHOM = T.src.nhomKT();

    ums.crud({
        root: root,
        title: 'Khoản thu', listTitle: 'Danh sách danh mục khoản thu', formTitle: 'khoản thu', icon: 'fa-coins',
        addText: 'Thêm',
        filters: [
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' },
            { key: 'nhom', type: 'select', label: 'Chọn nhóm khoản thu', source: NHOM }
        ],
        list: { paged: true, call: function (f) {
            return { action: P + 'LayDanhSach', method: 'GET', strTuKhoa: f.q || '', strNhomCacKhoanThu_Id: f.nhom || '', strNguoiThucHien_Id: '', strcanboquanly_id: '' };
        } },
        columns: [
            { title: 'Tên', prop: 'TEN' },
            { title: 'Mã', prop: 'MA', cls: 'is-nowrap' },
            { title: 'Nhóm khoản thu', prop: 'NHOMCACKHOANTHU_TEN' },
            { title: 'Mô tả', prop: 'MOTA' }
        ],
        detail: function (row) { return { action: P + 'LayChiTiet', method: 'GET', strId: row.ID }; },
        fields: [
            { key: 'strTen', col: 'TEN', label: 'Tên khoản thu', required: true },
            { key: 'strMa', col: 'MA', label: 'Mã', required: true },
            { key: 'iThuTu', col: 'THUTU', label: 'Thứ tự', type: 'number' },
            { key: 'strNhomCacKhoanThu_Id', col: 'NHOMCACKHOANTHU_ID', label: 'Nhóm khoản thu', type: 'select', required: true, source: NHOM },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả' }
        ],
        save: function (v, row) {
            return { action: P + (row ? 'CapNhat' : 'ThemMoi'), method: 'POST', strId: row ? row.ID : '',
                strTen: v.strTen, strMa: v.strMa, iThuTu: v.iThuTu, strNhomCacKhoanThu_Id: v.strNhomCacKhoanThu_Id, strMoTa: v.strMoTa,
                dThutuUuTienGachNo: -1, dTinhPhiTuDong: -1 };
        },
        remove: function (ids) { return ids.map(function (id) { return { action: P + 'Xoa', method: 'POST', strIds: id }; }); }
    });
})();
