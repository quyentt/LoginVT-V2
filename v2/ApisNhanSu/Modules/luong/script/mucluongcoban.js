/* =========================================================================
   Quy định mức lương cơ bản
   Bản gốc: ApisNhanSu/Modules/luong/script/mucluongcoban.js
   ---------------------------------------------------------------------------
   HAI CỘT như bản gốc (col-lg-3 danh sách | col-lg-9 Thông tin chung / biểu mẫu).
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       L_BangQuyDinhLuong/LayDanhSach  GET  strTuKhoa, strNguoiTao_Id '', pageIndex 1, pageSize 100000
       L_BangQuyDinhLuong/LayChiTiet   GET  strId (trước khi sửa)
       L_BangQuyDinhLuong/ThemMoi | CapNhat  POST
           strId, dMucLuongCoBan, dSoBacLuongToiDa, dLuongToiThieuVung,
           strNgayBatDauApDung, strNgayKetThucApDung, strMoTa
       L_BangQuyDinhLuong/Xoa          POST strIds
   Bắt buộc (arrValid gốc): Mức lương cơ bản, Số bậc lương tối đa.

   Lỗi bản gốc đã sửa: nạp danh sách xong gán me.strMucLuongCoBan_Id = MẢNG dữ
   liệu → bấm Lưu lần nữa trên biểu mẫu thêm vừa lưu là gọi CapNhat với strId
   rác. ums.crud giữ đúng dòng đang sửa. "Lưu và Nhập tiếp" giữ nguyên.
   Khác bản gốc: nút Xoá nằm trong biểu mẫu sửa (mục ở cột trái là nút bấm —
   không lồng nút xoá trong nút).
   ========================================================================= */
(function () {
    'use strict';

    var C = 'L_BangQuyDinhLuong';

    ums.crud({
        root: document.getElementById('mucluongcoban'),
        title: 'Quy định mức lương cơ bản',
        formTitle: 'quy định mức lương cơ bản',
        icon: 'fa-money-bill-wave',
        saveAgain: 'Lưu và Nhập tiếp',
        multi: false,

        master: {
            title: 'Danh sách quy định mức lương cơ bản', icon: 'fa-list-ul',
            empty: 'Hôm nay bạn có quy định mức lương mới không? Bấm Thêm mới ở đầu trang, hoặc chọn một quy định ở danh sách bên trái để sửa.',
            item: function (r) {
                return '<b>Mức lương cơ bản: ' + ums.ui.esc(r.MUCLUONGCOBAN == null ? '' : r.MUCLUONGCOBAN) + '</b>' +
                    '<span class="ums-master__item__sub">Thời gian áp dụng: ' + ums.ui.esc((r.NGAYBATDAUAPDUNG || '') + ' - ' + (r.NGAYKETTHUCAPDUNG || '')) + '</span>';
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
            { key: 'dMucLuongCoBan', col: 'MUCLUONGCOBAN', label: 'Mức lương cơ bản', required: true },
            { key: 'dSoBacLuongToiDa', col: 'SOBACLUONGTOIDA', label: 'Số bậc lương tối đa', required: true },
            { key: 'dLuongToiThieuVung', col: 'LUONGTOITHIEUVUNG', label: 'Lương tối thiểu vùng' },
            { key: 'strNgayBatDauApDung', col: 'NGAYBATDAUAPDUNG', label: 'Ngày bắt đầu áp dụng', type: 'date' },
            { key: 'strNgayKetThucApDung', col: 'NGAYKETTHUCAPDUNG', label: 'Ngày kết thúc áp dụng', type: 'date' },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả' }
        ],

        save: function (v, row) {
            return {
                action: C + (row ? '/CapNhat' : '/ThemMoi'),
                strId: row ? row.ID : '',
                dMucLuongCoBan: v.dMucLuongCoBan,
                dSoBacLuongToiDa: v.dSoBacLuongToiDa,
                dLuongToiThieuVung: v.dLuongToiThieuVung,
                strNgayBatDauApDung: v.strNgayBatDauApDung,
                strNgayKetThucApDung: v.strNgayKetThucApDung,
                strMoTa: v.strMoTa,
                strNguoiThucHien_Id: ''
            };
        },
        remove: function (ids) { return ids.map(function (id) { return { action: C + '/Xoa', strIds: id }; }); }
    });
})();
