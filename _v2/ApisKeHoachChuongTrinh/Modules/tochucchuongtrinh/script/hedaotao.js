/* =========================================================================
   Hệ đào tạo
   Bản gốc: ApisKeHoachChuongTrinh/Modules/tochucchuongtrinh/script/hedaotao.js
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên văn):
       KHCT_HeDaoTao/LayDanhSach   GET  strTuKhoa, strDaoTao_HinhThucDaoTao_Id, strDaoTao_BacDaoTao_Id, pageIndex/pageSize
       KHCT_HeDaoTao/LayChiTiet    GET  strId
       KHCT_HeDaoTao/ThemMoi       POST strId='', strMaHeDaoTao, strTenHeDaoTao, strDaoTao_HinhThucDaoTao_Id,
                                        strDaoTao_BacDaoTao_Id, strPhanLoaiDoiTuong_Id
       KHCT_HeDaoTao/CapNhat       POST như trên + strId
       KHCT_HeDaoTao/Xoa           POST strIds (id các dòng đánh dấu nối dấu phẩy — MỘT lời gọi như gốc)
   Danh mục: KHCT.HTDT (hình thức), KHCT.BACDAOTAO (bậc), KHDT.PHANLOAIDOITUONGDAOTAO (loại đối tượng).
   Bố cục gốc một cột: thanh lọc (Bậc · Hình thức CHỌN NHIỀU · Từ khoá) + bảng; biểu mẫu thay chỗ.
   Hai ô lọc độc lập (không cha → con).
   Bỏ: arrValid_HeDaoTao (kiểm "dropChucDanh" — ô không có trên màn), hàm/nút trùng khai hai lần.
   ========================================================================= */
(function () {
    'use strict';

    var T = ums.khctTC;
    var main = null;

    main = T.crud({
        ctl: 'KHCT_HeDaoTao',
        root: document.getElementById('hedaotao'),
        title: 'Hệ đào tạo',
        formTitle: 'hệ đào tạo',
        listTitle: 'Danh sách hệ đào tạo',
        icon: 'fa-list-timeline',
        autoload: false,

        filters: [
            { key: 'bac', type: 'select', label: 'Chọn bậc đào tạo', source: { dm: 'KHCT.BACDAOTAO' } },
            { key: 'ht', type: 'select', label: 'Chọn hình thức đào tạo', source: { dm: 'KHCT.HTDT' } },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],

        list: {
            paged: true,
            call: function (f) {
                return {
                    action: 'KHCT_HeDaoTao/LayDanhSach', method: 'GET',
                    strTuKhoa: f.q,
                    // ô chọn nhiều → "a,b" như edu.util.getValById
                    strDaoTao_HinhThucDaoTao_Id: ums.pat.val(T.o(main, 'filter', 'ht')),
                    strDaoTao_BacDaoTao_Id: f.bac,
                    strNguoiThucHien_Id: ''
                };
            }
        },

        columns: [
            { title: 'Mã hệ đào tạo', prop: 'MAHEDAOTAO', cls: 'is-nowrap' },
            { title: 'Tên hệ đào tạo', prop: 'TENHEDAOTAO' },
            { title: 'Hình thức đào tạo', prop: 'DAOTAO_HINHTHUCDAOTAO_TEN' },
            { title: 'Bậc đào tạo', prop: 'DAOTAO_BACDAOTAO_TEN' },
            { title: 'Phân loại', prop: 'PHANLOAIDOITUONG_TEN' }
        ],

        fields: [
            { type: 'legend', label: 'Thông tin hệ đào tạo' },
            { key: 'strMaHeDaoTao', col: 'MAHEDAOTAO', label: 'Mã hệ đào tạo' },
            { key: 'strTenHeDaoTao', col: 'TENHEDAOTAO', label: 'Tên hệ đào tạo' },
            { key: 'strDaoTao_HinhThucDaoTao_Id', col: 'DAOTAO_HINHTHUCDAOTAO_ID', label: 'Hình thức đào tạo', type: 'select',
                placeholder: '--Chọn hình thức đào tạo--', source: { dm: 'KHCT.HTDT' } },
            { key: 'strDaoTao_BacDaoTao_Id', col: 'DAOTAO_BACDAOTAO_ID', label: 'Bậc đào tạo', type: 'select',
                placeholder: '--Chọn bậc đào tạo--', source: { dm: 'KHCT.BACDAOTAO' } },
            { key: 'strPhanLoaiDoiTuong_Id', col: 'PHANLOAIDOITUONG_ID', label: 'Loại đối tượng', type: 'select',
                placeholder: '--Chọn loại đối tượng--', source: { dm: 'KHDT.PHANLOAIDOITUONGDAOTAO' } }
        ],

        // rewrite(): thêm mới lấy sẵn Bậc / Hình thức đang lọc
        onForm: function (row, crud) {
            if (!row) T.datTuLoc(crud, [['bac', 'strDaoTao_BacDaoTao_Id'], ['ht', 'strDaoTao_HinhThucDaoTao_Id']]);
        },

        save: function (v, row) {
            return {
                action: row ? 'KHCT_HeDaoTao/CapNhat' : 'KHCT_HeDaoTao/ThemMoi',
                strId: row ? row.ID : '',
                strMaHeDaoTao: v.strMaHeDaoTao,
                strTenHeDaoTao: v.strTenHeDaoTao,
                strDaoTao_HinhThucDaoTao_Id: v.strDaoTao_HinhThucDaoTao_Id,
                strDaoTao_BacDaoTao_Id: v.strDaoTao_BacDaoTao_Id,
                strPhanLoaiDoiTuong_Id: v.strPhanLoaiDoiTuong_Id,
                strNguoiThucHien_Id: ''
            };
        }
    });

    T.nhieu(main, 'ht', 'Chọn hình thức đào tạo');
    main.load(1);
})();
