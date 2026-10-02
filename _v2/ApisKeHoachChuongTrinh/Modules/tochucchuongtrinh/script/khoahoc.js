/* =========================================================================
   Khóa học (khoá đào tạo)
   Bản gốc: ApisKeHoachChuongTrinh/Modules/tochucchuongtrinh/script/khoahoc.js
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên văn):
       KHCT_KhoaDaoTao/LayDanhSach   GET  strTuKhoa, strDaoTao_HeDaoTao_Id, strDaoTao_CoSoDaoTao_Id='', pageIndex/pageSize
       KHCT_KhoaDaoTao/LayChiTiet    GET  strId
       pkg_kehoach_thongtin.Them_DaoTao_KhoaDaoTao   (KHCT_ThongTin_MH/FSkk…)  thêm
       pkg_kehoach_thongtin.Sua_DaoTao_KhoaDaoTao    (KHCT_ThongTin_MH/EjQg…)  sửa
            strId, strTenKhoa, strMaKhoa, strNamNhapHoc, strNamKetThucTheoKeHoach, strSoNamDaoTao,
            dTrangThai=1, strDaoTao_HeDaoTao_Id, strDaoTao_CoSoDaoTao_Id
       KHCT_KhoaDaoTao/Xoa           POST strIds (MỘT lời gọi, id nối dấu phẩy)
       KHCT_HeDaoTao/LayDanhSach     GET  (ô Hệ đào tạo — lọc và biểu mẫu)
   Ghi chú:
     · strDaoTao_CoSoDaoTao_Id: gốc đọc ô dropHP_CoSoDaoTao KHÔNG có trên màn → luôn gửi rỗng (giữ nguyên).
       viewForm gốc còn đổ nhầm DAOTAO_HEDAOTAO_TEN vào ô đó — ô không tồn tại nên vô hại, bỏ.
     · Ô lọc chỉ có Hệ (không cha → con).
   ========================================================================= */
(function () {
    'use strict';

    var T = ums.khctTC;
    var HT = 'KHCT_ThongTin_MH/';
    var HE = T.srcHe();          // một nguồn cho cả ô lọc và biểu mẫu (tải một lần)

    T.crud({
        ctl: 'KHCT_KhoaDaoTao',
        root: document.getElementById('khoahoc'),
        title: 'Khóa học',
        formTitle: 'khóa học',
        listTitle: 'Danh sách khóa học',
        icon: 'fa-list-timeline',

        filters: [
            { key: 'he', type: 'select', label: 'Chọn hệ đào tạo', source: HE },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],

        list: {
            paged: true,
            call: function (f) {
                return {
                    action: 'KHCT_KhoaDaoTao/LayDanhSach', method: 'GET',
                    strTuKhoa: f.q,
                    strDaoTao_HeDaoTao_Id: f.he,
                    strDaoTao_CoSoDaoTao_Id: '',
                    strNguoiThucHien_Id: ''
                };
            }
        },

        columns: [
            { title: 'Mã khóa học', prop: 'MAKHOA', cls: 'is-nowrap' },
            { title: 'Tên khóa học', prop: 'TENKHOA' },
            { title: 'Hệ đào tạo', prop: 'DAOTAO_HEDAOTAO_TEN' },
            { title: 'Năm nhập học', prop: 'NAMNHAPHOC', cls: 'is-center' },
            { title: 'Năm kết thúc', prop: 'NAMKETTHUCTHEOKEHOACH', cls: 'is-center' }
        ],

        fields: [
            { type: 'legend', label: 'Thông tin khóa học' },
            { key: 'strMaKhoa', col: 'MAKHOA', label: 'Mã khóa học' },
            { key: 'strTenKhoa', col: 'TENKHOA', label: 'Tên khóa học' },
            { key: 'strDaoTao_HeDaoTao_Id', col: 'DAOTAO_HEDAOTAO_ID', label: 'Hệ đào tạo', type: 'select',
                placeholder: '--Chọn hệ đào tạo--', source: HE },
            { key: 'strNamNhapHoc', col: 'NAMNHAPHOC', label: 'Năm nhập học' },
            { key: 'strNamKetThucTheoKeHoach', col: 'NAMKETTHUCTHEOKEHOACH', label: 'Năm kết thúc theo kế hoạch' },
            { key: 'strSoNamDaoTao', col: 'SONAMDAOTAO', label: 'Số năm đào tạo' }
        ],

        onForm: function (row, crud) {
            if (!row) T.datTuLoc(crud, [['he', 'strDaoTao_HeDaoTao_Id']]);
        },

        save: function (v, row) {
            return {
                action: HT + (row ? 'EjQgHgUgLhUgLh4KKS4gBSAuFSAu' : 'FSkkLB4FIC4VIC4eCikuIAUgLhUgLgPP'),
                func: 'pkg_kehoach_thongtin.' + (row ? 'Sua_DaoTao_KhoaDaoTao' : 'Them_DaoTao_KhoaDaoTao'),
                strId: row ? row.ID : '',
                strTenKhoa: v.strTenKhoa,
                strMaKhoa: v.strMaKhoa,
                strNamNhapHoc: v.strNamNhapHoc,
                strNamKetThucTheoKeHoach: v.strNamKetThucTheoKeHoach,
                strSoNamDaoTao: v.strSoNamDaoTao,
                dTrangThai: 1,
                strDaoTao_HeDaoTao_Id: v.strDaoTao_HeDaoTao_Id,
                strDaoTao_CoSoDaoTao_Id: '',
                strNguoiThucHien_Id: ''
            };
        }
    });
})();
