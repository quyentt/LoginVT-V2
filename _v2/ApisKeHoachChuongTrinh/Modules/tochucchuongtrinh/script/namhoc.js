/* =========================================================================
   Năm học
   Bản gốc: ApisKeHoachChuongTrinh/Modules/tochucchuongtrinh/script/namhoc.js
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên văn):
       KHCT_NamHoc/LayDanhSach   GET  strTuKhoa, dTRANGTHAI='', pageIndex/pageSize
       KHCT_NamHoc/LayChiTiet    GET  strId
       KHCT_NamHoc/ThemMoi       POST strId='', dNamHoc, dTRANGTHAI=1
       KHCT_NamHoc/CapNhat       POST strId, dNamHoc, dTRANGTHAI=1
       KHCT_NamHoc/Xoa           POST strId (tên tham số là strId dù gửi nhiều id nối dấu phẩy — như gốc)
   Bỏ: nút Tìm kiếm gốc gọi `me.getList_NamHoc()()` (gọi kết quả undefined → lỗi JS sau khi đã tải) — nay chỉ tải lại;
       popup()/resetPopup() và danh mục TKGG.HEDT, KHCT.COSODAOTAO, TKGG.HTDT, KHCT.BACDAOTAO nạp vào ô không có trên màn.
   ========================================================================= */
(function () {
    'use strict';

    var T = ums.khctTC;

    T.crud({
        ctl: 'KHCT_NamHoc',
        xoaKhoa: 'strId',
        root: document.getElementById('namhoc'),
        title: 'Năm học',
        formTitle: 'năm học',
        listTitle: 'Danh sách năm học',
        icon: 'fa-list-timeline',

        filters: [
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],

        list: {
            paged: true,
            call: function (f) {
                return {
                    action: 'KHCT_NamHoc/LayDanhSach', method: 'GET',
                    strTuKhoa: f.q,
                    dTRANGTHAI: '',
                    strNguoiThucHien_Id: ''
                };
            }
        },

        columns: [
            { title: 'Năm học', prop: 'NAMHOC' }
        ],

        fields: [
            { type: 'legend', label: 'Thông tin năm học' },
            { key: 'dNamHoc', col: 'NAMHOC', label: 'Năm học' }
        ],

        save: function (v, row) {
            return {
                action: row ? 'KHCT_NamHoc/CapNhat' : 'KHCT_NamHoc/ThemMoi',
                strId: row ? row.ID : '',
                dNamHoc: v.dNamHoc,
                dTRANGTHAI: 1,
                strNguoiThucHien_Id: ''
            };
        }
    });
})();
