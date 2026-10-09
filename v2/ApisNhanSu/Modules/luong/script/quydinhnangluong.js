/* =========================================================================
   Quy định nâng lương
   Bản gốc: ApisNhanSu/Modules/luong/script/quydinhnangluong.js
   ---------------------------------------------------------------------------
   HAI CỘT như bản gốc (col-lg-3 danh sách | col-lg-9 Thông tin chung / biểu mẫu).
   Biểu mẫu gốc: Thời hạn / Bảng quy định lương mỗi ô một hàng, Loại - Nhóm -
   Ngạch chung một hàng, Ghi chú một hàng → formCols 12.
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       L_QuyDinhNangLuong/LayDanhSach  GET  strTuKhoa, strNguoiTao_Id '', strNhanSu_QuyDinhLuong_Id '',
                                            strLoaiPhuCap_Id (ô dropLoaiPhuCap KHÔNG có trên màn → ''), pageIndex 1, pageSize 100000
       L_QuyDinhNangLuong/LayChiTiet   GET  strId
       L_QuyDinhNangLuong/ThemMoi | CapNhat  POST
           strId, dThoiHanNangLuong, strNhanSu_QuyDinhLuong_Id, strLoai_Id, strNhom_Id, strNgach_Id, strGhiChu
       L_QuyDinhNangLuong/Xoa          POST strIds
   Nguồn ô chọn: L_BangQuyDinhLuong/LayDanhSach (GET, pageSize 10000000, tên = MUCLUONGCOBAN),
   danh mục LUONG.LOAICONGCHUC, LUONG.NHOMNGACH, LUONG.NGACH (tên "MA - TEN").
   Bắt buộc (arrValid gốc): Thời hạn nâng lương, Bảng quy định lương, Loại.
   Nhóm mang dấu (*) trên nhãn nhưng arrValid gốc không kiểm → giữ không bắt buộc.
   Lỗi gốc đã sửa: nạp danh sách xong gán id đang sửa = MẢNG dữ liệu (Lưu lần hai
   trên biểu mẫu thêm gọi CapNhat với id rác) — ums.crud giữ đúng dòng đang sửa.
   Khác bản gốc: nút Xoá nằm trong biểu mẫu sửa (mục ở cột trái là nút bấm).
   ========================================================================= */
(function () {
    'use strict';

    var C = 'L_QuyDinhNangLuong';
    var esc = ums.ui.esc;
    function e(v) { return v === undefined || v === null ? '' : v; }

    var QDL = { call: { action: 'L_BangQuyDinhLuong/LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 10000000 }, id: 'ID', name: 'MUCLUONGCOBAN' };
    var NGACH = { dm: 'LUONG.NGACH', name: function (r) { return e(r.MA) + ' - ' + e(r.TEN); } };

    ums.crud({
        root: document.getElementById('quydinhnangluong'),
        title: 'Quy định nâng lương',
        formTitle: 'quy định nâng lương',
        icon: 'fa-arrow-trend-up',
        saveAgain: 'Lưu và nhập tiếp',
        multi: false,

        master: {
            title: 'Danh sách quy định nâng lương', icon: 'fa-list-ul',
            empty: 'Bạn có quy định nâng lương mới không? Bấm Thêm mới ở đầu trang, hoặc chọn một quy định ở danh sách bên trái để sửa.',
            item: function (r) {
                return '<b>Ngạch: ' + esc(e(r.NGACH_TEN)) + '</b>' +
                    '<span class="ums-master__item__sub">Thời hạn nâng lương: ' + esc(e(r.THOIHANNANGLUONG)) + '</span>';
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
            { key: 'dThoiHanNangLuong', col: 'THOIHANNANGLUONG', label: 'Thời hạn nâng lương', required: true, cols: 12 },
            { key: 'strNhanSu_QuyDinhLuong_Id', col: 'NHANSU_BANGQUYDINHLUONG_ID', label: 'Bảng quy định lương', type: 'select',
              source: QDL, placeholder: '-- Chọn quy định lương --', required: true, cols: 12 },
            { key: 'strLoai_Id', col: 'LOAI_ID', label: 'Loại', type: 'select', source: { dm: 'LUONG.LOAICONGCHUC' }, placeholder: '-- Chọn loại --', required: true, cols: 4 },
            { key: 'strNhom_Id', col: 'NHOM_ID', label: 'Nhóm', type: 'select', source: { dm: 'LUONG.NHOMNGACH' }, placeholder: '-- Chọn nhóm --', cols: 4 },
            { key: 'strNgach_Id', col: 'NGACH_ID', label: 'Ngạch', type: 'select', source: NGACH, placeholder: '-- Chọn ngạch --', cols: 4 },
            { key: 'strGhiChu', col: 'GHICHU', label: 'Ghi chú', cols: 12 }
        ],

        save: function (v, row) {
            return {
                action: C + (row ? '/CapNhat' : '/ThemMoi'),
                strId: row ? row.ID : '',
                dThoiHanNangLuong: v.dThoiHanNangLuong,
                strNhanSu_QuyDinhLuong_Id: v.strNhanSu_QuyDinhLuong_Id,
                strLoai_Id: v.strLoai_Id,
                strNhom_Id: v.strNhom_Id,
                strNgach_Id: v.strNgach_Id,
                strGhiChu: v.strGhiChu,
                strNguoiThucHien_Id: ''
            };
        },
        remove: function (ids) { return ids.map(function (id) { return { action: C + '/Xoa', strIds: id }; }); }
    });
})();
