/* =========================================================================
   Khai báo điểm đặc biệt
   Bản gốc: ApisQuanLyDiem/Modules/diemdacbiet/html/khaibaodiemdacbiet.html
            + script/khaibaodiemdacbiet.js
   Khung chung: ../../thamsochung/script/_khaibao.js (ums.qldKB).
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không func — chép nguyên):
     D_DiemDacBiet/LayDanhSach  GET: strTuKhoa, strLoaiDiem_Id (ô lọc), strNguoiThucHien_Id "",
                                pageIndex/pageSize
     D_DiemDacBiet/LayChiTiet   GET strId
     D_DiemDacBiet/ThemMoi | CapNhat  POST: strId, strMa, strTen, strGiaTriXuLy, strLoaiDiem_Id, dThuTu = ''
     D_DiemDacBiet/Xoa          POST strIds
   Danh mục: DIEM.LOAIDIEMDACBIET (lọc + biểu mẫu).
   Cột: TEN, MA, LOAIDIEM_TEN, GIATRIXULY.
   ========================================================================= */
(function () {
    'use strict';

    var K = ums.qldKB;
    var LOAI = { dm: 'DIEM.LOAIDIEMDACBIET' };

    K.man(document.getElementById('qld-khaibaodiemdacbiet'), {
        title: 'Khai báo điểm đặc biệt',
        listTitle: 'Danh sách điểm đặc biệt',
        formTitle: 'thông tin điểm đặc biệt',
        icon: 'fa-list',
        ctl: 'D_DiemDacBiet',

        loc: [{ key: 'loai', label: 'Chọn loại điểm', source: LOAI }],
        locThamSo: function (f) { return { strLoaiDiem_Id: f.loai }; },

        columns: [
            { title: 'Tên điểm đặc biệt', prop: 'TEN' },
            { title: 'Mã điểm đặc biệt', prop: 'MA', cls: 'is-nowrap' },
            { title: 'Loại điểm đặc biệt', prop: 'LOAIDIEM_TEN', cls: 'is-center' },
            { title: 'Giá trị xử lý', prop: 'GIATRIXULY', cls: 'is-center' }
        ],

        fields: [
            { key: 'strTen', col: 'TEN', label: 'Tên điểm đặc biệt' },
            { key: 'strMa', col: 'MA', label: 'Mã điểm đặc biệt' },
            { key: 'strLoaiDiem_Id', col: 'LOAIDIEM_ID', label: 'Loại điểm', type: 'select',
                source: LOAI, placeholder: 'Chọn loại điểm' },
            { key: 'strGiaTriXuLy', col: 'GIATRIXULY', label: 'Giá trị xử lý' }
        ],
        tuLoc: { strLoaiDiem_Id: 'loai' },

        luu: function (v) {
            return {
                strMa: v.strMa,
                strTen: v.strTen,
                strGiaTriXuLy: v.strGiaTriXuLy,
                strLoaiDiem_Id: v.strLoaiDiem_Id,
                dThuTu: ''
            };
        }
    });
})();
