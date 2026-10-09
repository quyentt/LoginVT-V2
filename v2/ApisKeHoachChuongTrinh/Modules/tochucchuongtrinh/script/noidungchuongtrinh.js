/* =========================================================================
   Nội dung chương trình
   Bản gốc: ApisKeHoachChuongTrinh/Modules/tochucchuongtrinh/script/noidungchuongtrinh.js
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên văn):
       KHCT_NoiDungChuongTrinh/LayDanhSach   GET  strTuKhoa, strDaoTao_ToChucCT_Id, pageIndex/pageSize
       KHCT_NoiDungChuongTrinh/LayChiTiet    GET  strId
       KHCT_NoiDungChuongTrinh/ThemMoi       POST strId='', strDaoTao_ToChucCT_Id, strNoiDung
       KHCT_NoiDungChuongTrinh/CapNhat       POST như trên + strId
       KHCT_NoiDungChuongTrinh/Xoa           POST strIds (MỘT lời gọi, id nối dấu phẩy)
       KHCT_ToChucChuongTrinh/LayDanhSach    GET  pageSize 1000000 (ô Chương trình — lọc và biểu mẫu)
   Giữ: cột "Tên chương trình" đổ DAOTAO_CHUONGTRINH_MA như gốc; sửa đọc DAOTAO_TOCHUCCHUONGTRINH_ID.
   Bỏ mã chết: genTable_ChuongTrinh (vẽ vào một nhãn), getList_CoCauToChuc (gọi main_doc.ChucDanh không tồn tại),
       uploadFiles(txtThongTinDinhKem) không có ô trên màn.
   ========================================================================= */
(function () {
    'use strict';

    var T = ums.khctTC;
    var CT = T.srcChuongTrinh();

    T.crud({
        ctl: 'KHCT_NoiDungChuongTrinh',
        root: document.getElementById('noidungchuongtrinh'),
        title: 'Nội dung chương trình',
        formTitle: 'nội dung chương trình',
        listTitle: 'Danh sách nội dung chương trình',
        icon: 'fa-list-timeline',

        filters: [
            { key: 'ct', type: 'select', label: 'Chọn chương trình', source: CT },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],

        list: {
            paged: true,
            call: function (f) {
                return {
                    action: 'KHCT_NoiDungChuongTrinh/LayDanhSach', method: 'GET',
                    strTuKhoa: f.q,
                    strDaoTao_ToChucCT_Id: f.ct,
                    strNguoiThucHien_Id: ''
                };
            }
        },

        columns: [
            { title: 'Tên chương trình', prop: 'DAOTAO_CHUONGTRINH_MA', width: '30%' },
            { title: 'Nội dung', prop: 'NOIDUNG' }
        ],

        fields: [
            { type: 'legend', label: 'Thông tin nội dung chương trình' },
            { key: 'strDaoTao_ToChucCT_Id', col: 'DAOTAO_TOCHUCCHUONGTRINH_ID', label: 'Chương trình', type: 'select',
                placeholder: '-- Chọn chương trình --', source: CT },
            { key: 'strNoiDung', col: 'NOIDUNG', label: 'Nội dung', type: 'textarea' }
        ],

        onForm: function (row, crud) {
            if (!row) T.datTuLoc(crud, [['ct', 'strDaoTao_ToChucCT_Id']]);
        },

        save: function (v, row) {
            return {
                action: row ? 'KHCT_NoiDungChuongTrinh/CapNhat' : 'KHCT_NoiDungChuongTrinh/ThemMoi',
                strId: row ? row.ID : '',
                strDaoTao_ToChucCT_Id: v.strDaoTao_ToChucCT_Id,
                strNoiDung: v.strNoiDung,
                strNguoiThucHien_Id: ''
            };
        }
    });
})();
