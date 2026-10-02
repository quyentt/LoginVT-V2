/* =========================================================================
   Quy định giảm trừ gia cảnh
   Bản gốc: ApisNhanSu/Modules/luong/script/quydinhgiamtru.js
   ---------------------------------------------------------------------------
   HAI CỘT như bản gốc (col-lg-3 danh sách | col-lg-9 Thông tin chung / biểu mẫu).
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       L_QuyDinh_GiamTru/LayDanhSach  GET  strTuKhoa, strNguoiTao_Id '', pageIndex 1, pageSize 100000
       L_QuyDinh_GiamTru/LayChiTiet   GET  strId
       L_QuyDinh_GiamTru/ThemMoi | CapNhat  POST
           strId, dVoiNguoiNopThue, dVoiNguoiPhuThuoc, strNgayApDung
       L_QuyDinh_GiamTru/Xoa          POST strIds
   Cột đọc khi sửa: VOINGUOINOPTHUE, VOIMOINGUOIPHUTHUOC (chữ "MOI" như gốc), NGAYAPDUNG.
   Bắt buộc: "Đối với người nộp thuế" (arrValid gốc còn khai txtPhanTramThue,
   txtMucCanTren — không có trên màn nên hệ cũ bỏ qua).
   Khác bản gốc: nút Xoá nằm trong biểu mẫu sửa (mục ở cột trái là nút bấm).
   ========================================================================= */
(function () {
    'use strict';

    var C = 'L_QuyDinh_GiamTru';
    var esc = ums.ui.esc;
    function e(v) { return v === undefined || v === null ? '' : v; }

    ums.crud({
        root: document.getElementById('quydinhgiamtru'),
        title: 'Quy định giảm trừ gia cảnh',
        formTitle: 'quy định giảm trừ gia cảnh',
        icon: 'fa-hand-holding-heart',
        saveAgain: 'Lưu và Nhập tiếp',
        multi: false,

        master: {
            title: 'Danh sách quy định giảm trừ gia cảnh', icon: 'fa-list-ul',
            empty: 'Hôm nay bạn có quy định giảm trừ gia cảnh mới không? Bấm Thêm mới ở đầu trang, hoặc chọn một quy định ở danh sách bên trái để sửa.',
            item: function (r) {
                return '<b>Với người nộp thuế: ' + esc(e(r.VOINGUOINOPTHUE)) + '</b>' +
                    '<span class="ums-master__item__sub">Với người phụ thuộc: ' + esc(e(r.VOIMOINGUOIPHUTHUOC)) + '</span>' +
                    '<span class="ums-master__item__sub">Ngày áp dụng: ' + esc(e(r.NGAYAPDUNG)) + '</span>';
            }
        },

        filters: [{ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }],

        list: {
            call: function (f) {
                return { action: C + '/LayDanhSach', method: 'GET', strTuKhoa: f.q, strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 };
            }
        },
        detail: function (row) { return { action: C + '/LayChiTiet', method: 'GET', strId: row.ID }; },

        formCols: 1,
        fields: [
            { key: 'dVoiNguoiNopThue', col: 'VOINGUOINOPTHUE', label: 'Đối với người nộp thuế', required: true },
            { key: 'dVoiNguoiPhuThuoc', col: 'VOIMOINGUOIPHUTHUOC', label: 'Đối với người phụ thuộc' },
            { key: 'strNgayApDung', col: 'NGAYAPDUNG', label: 'Ngày bắt đầu áp dụng', type: 'date' }
        ],

        save: function (v, row) {
            return {
                action: C + (row ? '/CapNhat' : '/ThemMoi'),
                strId: row ? row.ID : '',
                dVoiNguoiNopThue: v.dVoiNguoiNopThue,
                dVoiNguoiPhuThuoc: v.dVoiNguoiPhuThuoc,
                strNgayApDung: v.strNgayApDung,
                strNguoiThucHien_Id: ''
            };
        },
        remove: function (ids) { return ids.map(function (id) { return { action: C + '/Xoa', strIds: id }; }); }
    });
})();
