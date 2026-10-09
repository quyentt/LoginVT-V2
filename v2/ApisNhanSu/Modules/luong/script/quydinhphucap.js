/* =========================================================================
   Quy định hưởng phụ cấp
   Bản gốc: ApisNhanSu/Modules/luong/script/quydinhphucap.js
   ---------------------------------------------------------------------------
   HAI CỘT như bản gốc (col-lg-3 danh sách | col-lg-9 Thông tin chung / biểu mẫu).
   Biểu mẫu gốc: Thời hạn / Bảng quy định lương mỗi ô một hàng, Loại - Nhóm -
   Ngạch chung một hàng, Loại phụ cấp và Ghi chú mỗi ô một hàng → formCols 12.
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       L_QuyDinhHuongPhuCap/LayDanhSach  GET  strTuKhoa, strNguoiTao_Id '', strNhanSu_QuyDinhLuong_Id '',
                                              strLoaiPhuCap_Id, pageIndex 1, pageSize 100000
       L_QuyDinhHuongPhuCap/LayChiTiet   GET  strId
       L_QuyDinhHuongPhuCap/ThemMoi | CapNhat  POST
           strId, dThoiHanNhanPhuCap, strNhanSu_QuyDinhLuong_Id, strLoai_Id, strNhom_Id,
           strNgach_Id, strLoaiPhuCap_Id, strGhiChu
       L_QuyDinhHuongPhuCap/Xoa          POST strIds
   Nguồn ô chọn: L_BangQuyDinhLuong/LayDanhSach (tên MUCLUONGCOBAN), danh mục
   LUONG.LOAICONGCHUC, LUONG.NHOMNGACH, LUONG.NGACH ("MA - TEN"), LUONG.LOAIPHUCAP.
   Bắt buộc (arrValid gốc): Thời hạn nhận phụ cấp, Bảng quy định lương, Loại, Nhóm, Loại phụ cấp.

   Khác bản gốc: danh sách gốc gửi strLoaiPhuCap_Id = ô "Loại phụ cấp" của
   BIỂU MẪU (không phải ô lọc) → lưu xong một quy định thì danh sách bên trái
   chỉ còn các quy định cùng loại phụ cấp. Bản mới gửi '' (danh sách đầy đủ).
   Lỗi gốc đã sửa: nạp danh sách xong gán id đang sửa = MẢNG dữ liệu.
   Nút Xoá nằm trong biểu mẫu sửa (mục ở cột trái là nút bấm).
   ========================================================================= */
(function () {
    'use strict';

    var C = 'L_QuyDinhHuongPhuCap';
    var esc = ums.ui.esc;
    function e(v) { return v === undefined || v === null ? '' : v; }

    var QDL = { call: { action: 'L_BangQuyDinhLuong/LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 10000000 }, id: 'ID', name: 'MUCLUONGCOBAN' };
    var NGACH = { dm: 'LUONG.NGACH', name: function (r) { return e(r.MA) + ' - ' + e(r.TEN); } };

    ums.crud({
        root: document.getElementById('quydinhphucap'),
        title: 'Quy định hưởng phụ cấp',
        formTitle: 'quy định hưởng phụ cấp',
        icon: 'fa-hand-holding-dollar',
        saveAgain: 'Lưu và Nhập tiếp',
        multi: false,

        master: {
            title: 'Danh sách quy định hưởng phụ cấp', icon: 'fa-list-ul',
            empty: 'Bạn có quy định hưởng phụ cấp mới không? Bấm Thêm mới ở đầu trang, hoặc chọn một quy định ở danh sách bên trái để sửa.',
            item: function (r) {
                return '<b>Ngạch hưởng phụ cấp: ' + esc(e(r.LOAI_TEN)) + '</b>' +
                    '<span class="ums-master__item__sub">Loại phụ cấp: ' + esc(e(r.LOAIPHUCAP_TEN)) + '</span>' +
                    '<span class="ums-master__item__sub">Thời hạn nhận phụ cấp: ' + esc(e(r.THOIHANNHANPHUCAP)) + '</span>';
            }
        },

        filters: [{ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }],

        list: {
            call: function (f) {
                return { action: C + '/LayDanhSach', method: 'GET', strTuKhoa: f.q, strNguoiTao_Id: '', strNhanSu_QuyDinhLuong_Id: '',
                    strLoaiPhuCap_Id: '', pageIndex: 1, pageSize: 100000 };
            }
        },
        detail: function (row) { return { action: C + '/LayChiTiet', method: 'GET', strId: row.ID }; },

        formCols: 12,
        fields: [
            { key: 'dThoiHanNhanPhuCap', col: 'THOIHANNHANPHUCAP', label: 'Thời hạn nhận phụ cấp', required: true, cols: 12 },
            { key: 'strNhanSu_QuyDinhLuong_Id', col: 'NHANSU_BANGQUYDINHLUONG_ID', label: 'Bảng quy định lương', type: 'select',
              source: QDL, placeholder: '-- Chọn quy định lương --', required: true, cols: 12 },
            { key: 'strLoai_Id', col: 'LOAI_ID', label: 'Loại', type: 'select', source: { dm: 'LUONG.LOAICONGCHUC' }, placeholder: '-- Chọn loại --', required: true, cols: 4 },
            { key: 'strNhom_Id', col: 'NHOM_ID', label: 'Nhóm', type: 'select', source: { dm: 'LUONG.NHOMNGACH' }, placeholder: '-- Chọn nhóm --', required: true, cols: 4 },
            { key: 'strNgach_Id', col: 'NGACH_ID', label: 'Ngạch', type: 'select', source: NGACH, placeholder: '-- Chọn ngạch --', cols: 4 },
            { key: 'strLoaiPhuCap_Id', col: 'LOAIPHUCAP_ID', label: 'Loại phụ cấp', type: 'select', source: { dm: 'LUONG.LOAIPHUCAP' },
              placeholder: '-- Chọn loại phụ cấp --', required: true, cols: 12 },
            { key: 'strGhiChu', col: 'GHICHU', label: 'Ghi chú', cols: 12 }
        ],

        save: function (v, row) {
            return {
                action: C + (row ? '/CapNhat' : '/ThemMoi'),
                strId: row ? row.ID : '',
                dThoiHanNhanPhuCap: v.dThoiHanNhanPhuCap,
                strNhanSu_QuyDinhLuong_Id: v.strNhanSu_QuyDinhLuong_Id,
                strLoai_Id: v.strLoai_Id,
                strNhom_Id: v.strNhom_Id,
                strNgach_Id: v.strNgach_Id,
                strLoaiPhuCap_Id: v.strLoaiPhuCap_Id,
                strGhiChu: v.strGhiChu,
                strNguoiThucHien_Id: ''
            };
        },
        remove: function (ids) { return ids.map(function (id) { return { action: C + '/Xoa', strIds: id }; }); }
    });
})();
