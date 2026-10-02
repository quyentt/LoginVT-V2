/* =========================================================================
   Quy định tính thuế thu nhập cá nhân
   Bản gốc: ApisNhanSu/Modules/luong/script/quydinhtinhthuethunhapcanhan.js
   ---------------------------------------------------------------------------
   HAI CỘT như bản gốc (col-lg-3 danh sách | col-lg-9 Thông tin chung / biểu mẫu);
   biểu mẫu gốc hai cặp nhãn-ô mỗi hàng → formCols 2.
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       L_QuyDinh_ThueThuNhapCaNhan/LayDanhSach  GET  strTuKhoa, strNguoiTao_Id '', pageIndex 1, pageSize 100000
       L_QuyDinh_ThueThuNhapCaNhan/LayChiTiet   GET  strId
       L_QuyDinh_ThueThuNhapCaNhan/ThemMoi | CapNhat  POST
           strId, dMucCanDuoi, dMucCanTren, dPhanTramThue, strNgayApDung
       L_QuyDinh_ThueThuNhapCaNhan/Xoa          POST strIds
   Bắt buộc (arrValid gốc): Mức cận dưới, Mức cận trên, Phần trăm thuế.
   Bỏ: viewForm gốc đổ MOTA vào txtMoTa không có trên màn.
   Khác bản gốc: nút Xoá nằm trong biểu mẫu sửa (mục ở cột trái là nút bấm).
   ========================================================================= */
(function () {
    'use strict';

    var C = 'L_QuyDinh_ThueThuNhapCaNhan';
    var esc = ums.ui.esc;
    function e(v) { return v === undefined || v === null ? '' : v; }

    ums.crud({
        root: document.getElementById('quydinhtinhthuethunhapcanhan'),
        title: 'Quy định tính thuế thu nhập cá nhân',
        formTitle: 'quy định tính thuế cá nhân',
        icon: 'fa-file-invoice-dollar',
        saveAgain: 'Lưu và Nhập tiếp',
        multi: false,

        master: {
            title: 'Danh sách quy định tính thuế thu nhập cá nhân', icon: 'fa-list-ul',
            empty: 'Hôm nay bạn có quy định tính thuế thu nhập cá nhân mới không? Bấm Thêm mới ở đầu trang, hoặc chọn một quy định ở danh sách bên trái để sửa.',
            item: function (r) {
                return '<b>Khoảng thu nhập: ' + esc(e(r.MUCCANDUOI) + ' - ' + e(r.MUCCANTREN)) + '</b>' +
                    '<span class="ums-master__item__sub">Phần trăm thuế: ' + esc(e(r.PHANTRAMTHUE)) + '</span>';
            }
        },

        filters: [{ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }],

        list: {
            call: function (f) {
                return { action: C + '/LayDanhSach', method: 'GET', strTuKhoa: f.q, strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 };
            }
        },
        detail: function (row) { return { action: C + '/LayChiTiet', method: 'GET', strId: row.ID }; },

        formCols: 2,
        fields: [
            { key: 'dMucCanDuoi', col: 'MUCCANDUOI', label: 'Mức cận dưới', required: true },
            { key: 'dMucCanTren', col: 'MUCCANTREN', label: 'Mức cận trên', required: true },
            { key: 'dPhanTramThue', col: 'PHANTRAMTHUE', label: 'Phần trăm thuế (%)', required: true },
            { key: 'strNgayApDung', col: 'NGAYAPDUNG', label: 'Ngày bắt đầu áp dụng', type: 'date' }
        ],

        save: function (v, row) {
            return {
                action: C + (row ? '/CapNhat' : '/ThemMoi'),
                strId: row ? row.ID : '',
                dMucCanDuoi: v.dMucCanDuoi,
                dMucCanTren: v.dMucCanTren,
                dPhanTramThue: v.dPhanTramThue,
                strNgayApDung: v.strNgayApDung,
                strNguoiThucHien_Id: ''
            };
        },
        remove: function (ids) { return ids.map(function (id) { return { action: C + '/Xoa', strIds: id }; }); }
    });
})();
